/*
  Author: Michael
  Description:
    This class hosts the function of adding a new channel, an
    overlay form presents itself when clicks on the channels page.

  Related PBIs: 7
*/

import React, { useState, useContext, useEffect } from 'react'

import { ChannelsContext } from "../../Channels/Channels";
import { AuthContext } from "../../../../contexts/AuthContext";
import { DataStore } from "aws-amplify";
import { Channel, SubChannel, SubChannelType } from '../../../../models';

import styles from './index.module.css'
import { useSpring, animated } from 'react-spring'
import EmojiMenu from '../../../Wrappers/Emoji/EmojiMenu'

function NewChannel() {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)
  const [_Icon, set_Icon] = useState({message: "💬"})
  const [formState, setformState] = useState({name: "Channel name", desc: "Channel description"})

  const [anim, api] = useSpring(() => ({
    opacity: `0`
  }))

  //renders the pop-up when called
  useEffect(() => {
    api.start({opacity:`1`})
    return () => {api.start({opacity:`0`})}
    // eslint-disable-next-line
  }, [])

  //closes the pop-up by setting opacity to 0
  async function close() {
    await api.start({
      opacity:`0`,
      config: {
        duration: 100
      },
      onRest: () => channelsContext.set_ViewOverlay("ViewOverlay_None")
    })
  }

  //creates the channel, with error checking
  async function createChannel() {
    const { name, desc } = formState;

    if (name === undefined) { context.spawnNotification("ERROR", "Error", "Channel name is required."); return; }
    if (desc === undefined) { context.spawnNotification("ERROR", "Error", "Channel description is required."); return; }
    if (!/[^\s]/.test(name)) { context.spawnNotification("ERROR", "Error", "Invalid channel name."); return; }
    if (!/[^\s]/.test(desc)) { context.spawnNotification("ERROR", "Error", "Invalid channel description"); return; }
    if (name.length > 16) { context.spawnNotification("ERROR", "Error", "Channel name too long. Must be less than 16 characters."); return; }
    if (name.desc > 32) { context.spawnNotification("ERROR", "Error", "Channel description too long. Must be less than 16 characters."); return; }

    //checks for if the channel name already exists
    const models = await DataStore.query(Channel);
    for (var i in models) {
      if (models[i].name === name) {
        return null
      }
    }
    //after checking for validility, it saves the database to channels
    const channel = await DataStore.save(
        new Channel({
        "name": name,
        "description": desc,
        "users": [{username: context.user.username, sub: context.user.attributes.sub}],
        "icon": _Icon.message,
        "owner_id": context.user.attributes.sub
      })
    );

    //creates main-chat, so the channel has a sub-channel initially in it.
    await DataStore.save(
      new SubChannel({
        "name": "main-chat",
        "type": SubChannelType.TEXT,
        "users": [{username: context.user.username, sub: context.user.attributes.sub}],
        "channelID": channel.id
      })
    )
    context.spawnNotification("SUCCESS", `${_Icon.message} ${name}`, "Successfully created.");
    channelsContext.set_ViewOverlay("ViewOverlay_None")
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
      error: "",
    }));
  }

  //basic form setup
  return (
    <animated.div style={anim} className={styles.container} id="cypress-addChannelContainer">
      <div className={styles.title}>
        <h1>Create new channel</h1>
        <p>Enter your new channel details below.</p>
      </div>
      <div className={styles.form}>
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
      <button onClick={createChannel} className={styles.create}>Create</button>
      <u className={styles.return} onClick={close} id="cypress-return">Return</u>
    </animated.div>
  )
}

export default NewChannel
