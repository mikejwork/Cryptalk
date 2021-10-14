/*
  Author: Michael
  Description:
    Shows the user information about the details of the specific channel,
    this inlcudes creation date, and edited date.
  Related PBIs: 7, 19
*/

import React, { useState, useContext } from 'react'
import { DataStore } from "aws-amplify"
import { Channel } from '../../../../../models';
import styles from './index.module.css'
import { ChannelsContext } from "../../../Channels/Channels";
import { AuthContext } from "../../../../../contexts/AuthContext";
import EmojiMenu from '../../../../Wrappers/Emoji/EmojiMenu'

function Details(props) {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)

  const [_Icon, set_Icon] = useState({message: channelsContext._Channel.icon})
  const [formState, setformState] = useState({name: channelsContext._Channel.name, desc: channelsContext._Channel.description})

  //Returns the date as an output for html
  function creationDate() {
    var date = new Date(channelsContext._Channel.createdAt);
    return (<>{ date.getFullYear() }-{ date.getMonth() + 1 }-{ date.getDate() }</>)
  }

  //Returns the edited date as an output for html
  function editedAt() {
    var date = new Date(channelsContext._Channel.createdAt);
    return (<>{ date.getFullYear() }-{ date.getMonth() + 1 }-{ date.getDate() } { 24 - date.getHours() }:{ date.getMinutes() }:{ date.getSeconds() }</>)
  }

  //Saves all the changes after edit has been completed
  async function save_changes() {
    //stores information into the Channels Database
    await DataStore.save(Channel.copyOf(channelsContext._Channel, item => {
      item.name = formState.name
      item.description = formState.desc
      item.icon = _Icon.message
    })).then((result) => {
      //sets the channel information
      channelsContext.set_Channel(result)
      channelsContext.set_SubChannel(null)
    });
    props.close()
    context.spawnNotification("SUCCESS", "Saved", "Changes successfully changed.");
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
      error: "",
    }));
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Channel details</h1>
        <h5>Edit channel name, description and icon.</h5>
      </div>
      <div>
        <div className={styles.form}>
          <p>Creation date - <i>@ { creationDate() }</i></p>
          <p>Last edited - <i>@ { editedAt() }</i></p>
          <hr/>
          <input onChange={onChange} value={formState.name} type="text" name="name" placeholder="Channel name.." spellCheck="false" autoComplete="off"/>
          <input onChange={onChange} value={formState.desc} type="text" name="desc" placeholder="Channel description.." spellCheck="false" autoComplete="off"/>
        </div>
        <div className={styles.preview}>
          <h1>{_Icon.message}</h1>
          <div className={styles.iconForm}>
            <EmojiMenu setting="REPLACE" formState={formState} setformState={set_Icon}/>
          </div>
          <div className={styles.previewInfo}>
            <h1>{formState.name}</h1>
            <p>{formState.desc}</p>
          </div>
        </div>
      </div>
      <button className={styles.create} onClick={save_changes}>Save changes</button>
    </div>
  )
}

export default Details
