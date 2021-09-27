import React, { useState, useContext} from 'react'
import styles from './index.module.css';

import { DataStore } from "aws-amplify";
import { AuthContext } from "../../../contexts/AuthContext";
import { RequestStorage, RequestType, RequestStatus } from '../../../models';

function AddFriend(props) {
  const context = useContext(AuthContext)
  const [formState, setformState] = useState({username:""})

  async function send() {
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
      props.setfriendMenu(false)
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
      <input name="username" placeholder="Add user.." type="text" value={formState.username} onChange={onChange}/>
      <button onClick={send}>Send</button>
    </div>
  )
}

export default AddFriend
