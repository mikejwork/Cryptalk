/* eslint-disable no-loop-func */
import React, { useState, useEffect, createContext } from "react";
import { Auth, Hub, DataStore, Storage } from "aws-amplify";
import { Friends, RequestStorage, RequestStatus, Channel } from '../models';
import LoadingPage from '../components/Wrappers/Loading/Loading'

export const AuthContext = createContext();

function AuthContextProvider(props) {
  const [user, setUser] = useState(null);
  const [friend_list, setFriends] = useState([])
  const [request_list, setRequests] = useState([])
  const [channels_list, setChannels] = useState([])
  const [loading, setLoading] = useState(true);
  const [datastore_ready, setdatastore_ready] = useState(false)

  // cache test
  const [_cachedAvatar, set_cachedAvatar] = useState()

  async function checkUser() {
    try {
      await Auth.currentAuthenticatedUser().then((result) => {
        setUser(result);
        start_sync();
      });
    } catch (e) {
      setUser(null);
      setLoading(false);
    }
  }

  async function start_sync() {
    await DataStore.start()
  }

  // Creates a listener that will trigger on auth events
  async function setAuthListener() {
    Hub.listen("datastore", (data) => {
      // console.log(data.payload.event)
      if (data.payload.event === "ready") {
        // console.log("datastore::listener => ready")
        setdatastore_ready(true)
        setLoading(false);
      }
    });

    Hub.listen("auth", (data) => {
      switch(data.payload.event) {
        case "signIn":
          checkUser()
          break;
        case "signOut":
          DataStore.clear();
          checkUser()
          setdatastore_ready(false)
          break;
        default:
          break;
      }
    });
  }

  useEffect(() => {
    if (user) {
      async function fetchAvatar() {
        const src = await Storage.get(user.attributes.sub + ".jpg");
        set_cachedAvatar(src);
      }
      fetchAvatar()
    }
  }, [user])

  useEffect(() => {
    checkUser();
    setAuthListener();
    return () => {
      Hub.remove("auth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // BUGFIX: If user was logged in -> closed browser -> came back to the /dashboard page
    // This would run automatically and not check their login state, this ensures that nothing is
    // done without datastore being 100% ready
    if (datastore_ready) {
      handle_friends()
      handle_incoming()
      handle_outgoing()
      handle_channels()

      // Detects updates in friends
      const friends_subscription = DataStore.observe(Friends).subscribe(() => handle_friends());
      // Detects updates in recieved requests
      const request_subscription = DataStore.observe(RequestStorage, (request) => request.reciever_username("eq", user.username)).subscribe(() => handle_incoming());
      // Detects updates in sent requests
      const incoming_subscription = DataStore.observe(RequestStorage, (request) => request.sender_username("eq", user.username)).subscribe(() => handle_outgoing());
      // Detects updates in channels
      const channels_subscription = DataStore.observe(Channel).subscribe(() => handle_channels())

      return () => {
        // Cleanup
        friends_subscription.unsubscribe()
        request_subscription.unsubscribe()
        incoming_subscription.unsubscribe()
        channels_subscription.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datastore_ready])
  // When a change is detected in datastore_ready, update our subscriptions

  // Run on page load, will obtain the list of friends
  // if the list doesnt exist, create a new one
  async function handle_friends() {
    const result = await DataStore.query(Friends)
    // console.log("friends", result)

    if (result[0] === undefined) {
      await DataStore.save(
          new Friends({
          "list": []
        })
      );
    }

    DataStore.query(Friends).then((result) => {
      setFriends(result[0].list)
    })
  }

  // Handler for all outgoing requests
  async function handle_outgoing() {
    const result = await DataStore.query(RequestStorage, (request) => request.sender_username("eq", user.username));
    // console.log("outgoing", result)
    for (let idx = 0; idx < result.length; idx++) {
      switch (result[idx].status) {

        case RequestStatus.ACCEPTED:
          var reciever_username = result[idx].reciever_username
          var reciever_sub = result[idx].reciever_sub

          if (reciever_sub === "")
            break

          // Check if the friend already exists,
          let abort = false
          await DataStore.query(Friends).then((res) => {
            for (var i = 0; i < res[0].list.length; i++) {
              if (res[0].list[i].sub === reciever_sub) {
                abort = true
                console.log('handle_outgoing::ERROR::FriendAlreadyExists')
                break;
              }
            }
          })
          if (abort) { break; }

          // Add as friend
          await DataStore.query(Friends).then(async (res) => {
            await DataStore.save(Friends.copyOf(res[0], item => {
              item.list.push({"sub": reciever_sub, "username": reciever_username})
            }))
          })

          // Delete the request
          const modelToDelete = await DataStore.query(RequestStorage, result[idx].id);
          await DataStore.delete(modelToDelete);
          break;
        default:
          break;
      }
    }
  }

  // Handler for all incoming requests
  async function handle_incoming() {
    const result = await DataStore.query(RequestStorage, (request) => request.reciever_username("eq", user.username));
    // console.log("incoming", result)
    setRequests(result)
    for (let idx = 0; idx < result.length; idx++) {
      var sender_sub = result[idx].sender_sub
      var sender_username = result[idx].sender_username

      // @enum RequestStatus
      // RequestStatus.ACCEPTED
      // RequestStatus.REJECTED
      // RequestStatus.PENDING
      switch (result[idx].status) {
        case RequestStatus.ACCEPTED:

          // Check if the friend already exists,
          let abort = false
          await DataStore.query(Friends).then((res) => {
            for (var i = 0; i < res[0].list.length; i++) {
              if (res[0].list[i].sub === sender_sub) {
                abort = true
                console.log('handle_incoming::ERROR::FriendAlreadyExists')
                break;
              }
            }
          })
          if (abort) { break; }

          // Add as friend
          await DataStore.query(Friends).then(async (res) => {
            await DataStore.save(Friends.copyOf(res[0], item => {
              item.list.push({"sub": sender_sub, "username": sender_username})
            }))
          })
          // Update the request to include the reciever sub
          await DataStore.query(RequestStorage, result[idx].id).then(async (res) => {
            await DataStore.save(RequestStorage.copyOf(res, item => {
              item.reciever_sub = user.attributes.sub;
            }));
          })
          break;
        default:
          break;
      }
    }
  }

  async function handle_channels() {
    let filtered = []
    await DataStore.query(Channel).then((result) => {
      for (var i in result) {
        for (var k in result[i].users) {
          if (result[i].users[k].sub === user.attributes.sub) {
            filtered.push(result[i])
          }
        }
      }
    })
    // console.log("channels", filtered)
    setChannels(filtered)
  }

  if (loading) {
    return <LoadingPage/>;
  }

  return (
    <>
        <AuthContext.Provider value={{
          spawnNotification: props.notificationRef.current?.spawn,
          user: user,
          updateUser: setUser,
          datastore_ready: datastore_ready,
          friends: friend_list,
          requests: request_list,
          channels: channels_list,
          _cachedAvatar: _cachedAvatar
        }}>

        {props.children}
      </AuthContext.Provider>
    </>
  );
}

export default AuthContextProvider;
