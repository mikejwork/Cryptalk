import React, { useState, useContext } from 'react'

import { DataStore } from "aws-amplify";
import { AuthContext } from "../../contexts/AuthContext";
import { Channel, SubChannel, SubChannelType } from '../../models';

import * as MdIcons from "react-icons/md";
import EmojiMenu from '../Wrappers/Emoji/EmojiMenu'
import styles from '../../css/Channels/CreateChannel.module.css';

function CreateChannel(props) {
  const context = useContext(AuthContext)
  const [_Icon, set_Icon] = useState({message: "💬"})
  const [formState, setformState] = useState({})

  async function createChannel() {
    const { name, desc } = formState;

    if (name === undefined) { context.spawnNotification("ERROR", "Error", "Channel name is required."); return; }
    if (desc === undefined) { context.spawnNotification("ERROR", "Error", "Channel description is required."); return; }
    if (!/[^\s]/.test(name)) { context.spawnNotification("ERROR", "Error", "Invalid channel name."); return; }
    if (!/[^\s]/.test(desc)) { context.spawnNotification("ERROR", "Error", "Invalid channel description"); return; }

    const models = await DataStore.query(Channel);
    for (var i in models) {
      if (models[i].name === name) {
        return null
      }
    }

    const channel = await DataStore.save(
        new Channel({
        "name": name,
        "description": desc,
        "users": [{username: context.user.username, sub: context.user.attributes.sub}],
        "icon": _Icon.message,
        "owner_id": context.user.attributes.sub
      })
    );

    await DataStore.save(
      new SubChannel({
        "name": "main-chat",
        "type": SubChannelType.TEXT,
        "users": [{username: context.user.username, sub: context.user.attributes.sub}],
        "channelID": channel.id
      })
    )
    props.set_ChatType("CHANNELS")
    context.spawnNotification("SUCCESS", `${_Icon.message} ${name}`, "Successfully created.");
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
      error: "",
    }));
  }

  return (
    <>
      <img src={process.env.PUBLIC_URL + '/vector_assets/contours.png'} alt="dd"/>
      <p onClick={() => props.set_ChatType("CHANNELS")}><MdIcons.MdKeyboardArrowLeft className={styles.backIcon}/>
        <strong>Back to channels</strong>
      </p>
      <div className={styles.popup}>
        <h1>Create Channel</h1>
        <hr/>
        { formState.error === "" ? <></> : <p className="error">{formState.error}</p>}
        <div className={styles.inputs}>
          <div className={styles.inputIcon}>
            {/* Emoji menu */}
            <h2>Channel icon</h2>
            <p>Select an icon for your channel from the list below.</p>
            <hr/>
            <div className={styles.inputIconSelect}>
              <p>{_Icon.message}</p>
              <EmojiMenu setting="REPLACE" formState={formState} setformState={set_Icon}/>
            </div>


          </div>
          <div className={styles.inputDetails}>
            <h2>Channel details</h2>
            <p>Enter your new channels details below.</p>
            <hr/>
            <input onChange={onChange} type="text" name="name" placeholder="Channel name.." spellCheck="false" autoComplete="off"/>
            <input onChange={onChange} type="text" name="desc" placeholder="Channel description.." spellCheck="false" autoComplete="off"/>
          </div>
        </div>
        <div className={styles.preview}>
          <button onClick={createChannel}>Complete</button>
        </div>
      </div>
    </>
  )
}

export default CreateChannel
