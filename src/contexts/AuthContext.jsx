import React, { useState, useEffect, createContext } from "react";
import { Auth, Hub, DataStore } from "aws-amplify";
import { io } from "socket.io-client"

const socket = io.connect('/');
export const AuthContext = createContext();

function AuthContextProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [datastore_ready, setdatastore_ready] = useState(false)

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
        console.log("datastore::listener => ready")
        setdatastore_ready(true)
        setLoading(false);
      }
    });

    Hub.listen("auth", (data) => {
      switch(data.payload.event) {

        case "signIn":
          socket.emit("user_connect", data.payload.data);
          checkUser()
          break;

        case "signOut":
          socket.emit("user_disconnect", data.payload.data.attributes.sub);
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
    checkUser();
    setAuthListener();

    return () => {
      Hub.remove("auth");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    // TODO, make something nicer, maybe a loading gif?
    return <></>;
  }

  return (
    <AuthContext.Provider value={{ user: user, updateUser: setUser, socket: socket, datastore_ready: datastore_ready }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
