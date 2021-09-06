/* eslint-disable no-loop-func */
import React, { useContext, useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Redirect } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import '../css/Dashboard.css';
import * as MdIcons from "react-icons/md";

import { Storage, DataStore } from "aws-amplify";
import { RequestStorage, RequestType, RequestStatus } from '../models';

function Person(props) {
  const [avatar, setavatar] = useState(null)
  const [settingsMenu, setsettingsMenu] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false);
  const [ready, setReady] = useState(false)

  const styling = useSpring({
    from: { transform: `translateY(200%)` },
    to: { transform: `translateY(0%)` },
    delay: 100,
    onRest: (r) => {
      setReady(true)
    }
    })

  useEffect(() => {
    if (ready) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  function fetch() {
    Storage.get(props.data.sub + '.jpg', { level: 'public' }).then((result) => {
      setavatar(result)
    });
  }

  return (
    <animated.div style={styling} className="people-container">
      {!imageLoaded &&
        <>
          <div className="smooth-preloader">
            <span className="loader"/>
          </div>
        </>
      }
      <img className={`people-avatar img-${imageLoaded ? "visible" : "hidden"}`} onLoad={() => setImageLoaded(true)} src={avatar} alt=" "/>
      <div className="people-info">
        <p className="people-info-name">{props.data.username}</p>
        <span className="people-info-status"><MdIcons.MdLabel className="status-icon"/>online</span>
      </div>
      <MdIcons.MdChat className="dm-icon"/>
      <MdIcons.MdSettings className="settings-icon" onClick={() => setsettingsMenu(!settingsMenu)}/>
      { settingsMenu &&
        <>
          <PersonSettings data={props.data}/>
        </>
      }
    </animated.div>
  )
}

function PersonSettings(props) {
  // const sub = props.data.sub
  // const username = props.data.sub
  return (
    <>
      <div className="people-settings-container unselectable">
        <ul>
          <li>
            <span onClick={() => {}}><MdIcons.MdClose className="icon"/>Remove friend</span>
          </li>
        </ul>
      </div>
    </>
  )
}

function Request(props) {
  const styling = useSpring({
    from: { transform: `translateY(200%)` },
    to: { transform: `translateY(0%)` }})

  async function reject() {
    DataStore.query(RequestStorage, props.id).then((result) => {
      DataStore.save(RequestStorage.copyOf(result[0], item => {
        item.status = RequestStatus.REJECTED;
      }));
    })
  }

  async function accept() {
    DataStore.query(RequestStorage, props.id).then((result) => {
      DataStore.save(RequestStorage.copyOf(result[0], item => {
        item.status = RequestStatus.ACCEPTED;
      }));
    })
  }

  if (props.data.status !== "PENDING") {
    return (<></>)
  }

  return (
    <animated.div style={styling} className="request-container">
      <div className="request-info">
        <p className="request-title">Incoming Request</p>
        <p className="request-from">from {props.data.sender_username}</p>
      </div>
      <div className="request-actions">
        <span onClick={accept} className="request-accept"><MdIcons.MdDone/></span>
        <span onClick={reject} className="request-reject"><MdIcons.MdClose/></span>
      </div>
    </animated.div>
  )
}

function DashboardNotifications(props) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    setNotifications([1])
  }, [])

  return (
    <>
      <div className="notifications-list">
        { notifications.length === 0 ?
          <>
            <p className="notifications-uptodate">You're all up to date!</p>
          </>
        :
          <>
            <p className="notifications-uptodate">Notification</p>
          </>
        }
      </div>
    </>
  )
}

function AddField(props) {
  const styling = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 }})

  return (
    <>
      <animated.div style={styling} className="people-add-anim">
        <input name="user-to-add" value={props.friend_field} onChange={(e) => {props.setfriend_field(e.target.value);}} placeholder="Add a friend.." type="text"/>
        <button onClick={props.sendReq}><MdIcons.MdSend/></button>
      </animated.div>
    </>
  )
}

function Dashboard() {
  const context = useContext(AuthContext)
  const styling = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 }})

  // State

  const [friend_field, setfriend_field] = useState("")
  const [friend_field_toggle, setfriend_field_toggle] = useState(false)

  // TODO: Create a cron-lambda function to go through all requests that are over ~15 days
  // and remove them
  async function send_friend_request() {
    const username = friend_field;

    if (username === context.user.username)
      return

    await DataStore.save(
      new RequestStorage({
        "sender_sub": context.user.attributes.sub,
        "sender_username": context.user.username,
        "reciever_username": username,
        "reciever_sub": "",
        "type": RequestType.FRIEND_REQUEST,
        "status": RequestStatus.PENDING
      })
    ).then((result) => {
      setfriend_field("")
      setfriend_field_toggle(false)
    });
  }

  if (!context.datastore_ready) { return <Redirect to="/authentication"/> }

  return (
    <div className="background">
      <div className="dashboard-container">
        <animated.div style={styling} className="people">
          <div className="people-title">
            <h2>People</h2>
          </div>
          <div className="people-list">
            <h6>ONLINE ({context.friends.length})</h6>
            <hr/>
            <ul>
              { context.friends.map((friend) => {
                return (
                  <li key={friend.sub}>
                    <Person data={friend}/>
                  </li>
                )
              })}
            </ul>
            <ul>
              { context.requests.map((request) => {
                return (
                  <li key={request.id}>
                    <Request data={request}/>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="people-add">
              <span onClick={() => setfriend_field_toggle(!friend_field_toggle)}><MdIcons.MdPlaylistAdd/></span>
              {friend_field_toggle &&
                <AddField friend_field={friend_field} setfriend_field={setfriend_field} sendReq={send_friend_request}/>
              }
          </div>
        </animated.div>

        <div className="notifications-container">
          <div className="notifications-tabs">
            <h2>Notifications</h2>
          </div>
          <DashboardNotifications/>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
