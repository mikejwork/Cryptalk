import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import * as HiIcons from "react-icons/hi";
import { AuthContext } from "../../../contexts/AuthContext";

import { DataStore } from "aws-amplify";
import { RequestStorage, RequestType, RequestStatus } from '../../../models';

function FriendsListAdd(props) {
  const context = useContext(AuthContext)
  const [_Open, set_Open] = useState(false)
  const [formState, setformState] = useState({username:""})

  async function sendRequest() {
    if (formState.username === undefined) { context.spawnNotification("ERROR", "Error", "Invalid username."); return; }
    if (formState.username === context.user.username) { context.spawnNotification("ERROR", "Error", "You cannot add yourself."); return; }
    if (formState.username === "") { context.spawnNotification("ERROR", "Error", "Invalid username."); return; }
    if (!/[^\s]/.test(formState.username)) { context.spawnNotification("ERROR", "Error", "Invalid username."); return; }

    await DataStore.save(
      new RequestStorage({
        "sender_sub": context.user.attributes.sub,
        "sender_username": context.user.username,
        "reciever_username": formState.username,
        "reciever_sub": "",
        "type": RequestType.FRIEND_REQUEST,
        "status": RequestStatus.PENDING
      })
    ).then((result) => {
      setformState({username:""})
      set_Open(false)
      context.spawnNotification("SUCCESS", "Request sent", `Friend request sent to ${formState.username}`);
    });
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div className={styles.container}>
      <div className={styles.clickable} onClick={() => set_Open(!_Open)}>
        <div className={styles.channelIcon}>
          { _Open ?
            <HiIcons.HiChevronUp/>
          :
            <HiIcons.HiChevronDown/>
          }
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.name}>
            Add friend
          </div>
        </div>
      </div>
      { _Open &&
        <div className={styles.form}>
          <input onChange={onChange} name="username" type="text" placeholder="Username.." />
          <button onClick={sendRequest}><HiIcons.HiUserAdd/></button>
        </div>
      }
    </div>
  )
}


export default FriendsListAdd
