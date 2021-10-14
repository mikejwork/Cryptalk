/*
  Author: Michael
  Description:
    Used for making new sub-channel for the channel that it is in
    This utilises filters, database querys, and setting information
    to if the channel is a voice or text sub-channnel
  Related PBIs: 7, 9
*/

import React, { useState, useContext, useEffect } from 'react'
import * as HiIcons from "react-icons/hi";
import styles from './index.module.css'
import Toggle from '../../../../../components/Wrappers/Toggle/Toggle'

import { DataStore, SortDirection } from "aws-amplify";
import { SubChannel, SubChannelType } from '../../../../../models';

import { ChannelsContext } from "../../../Channels/Channels";
import { AuthContext } from "../../../../../contexts/AuthContext";

function Subchannels() {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)
  const [formState, setformState] = useState({})
  const [isVoice, setisVoice] = useState(false)

  const [_Subchannels, set_Subchannels] = useState([])

  useEffect(() => {
    if (channelsContext._Channel) {
      getSubchannels()
    }
    // eslint-disable-next-line
  }, [channelsContext._Channel])

  //Returns all subchannels in Channels Database
  async function getSubchannels() {
    DataStore.query(SubChannel, (s) => s.channelID("eq", channelsContext._Channel.id), {
      sort: s => s.createdAt(SortDirection.ASCENDING)
    }).then((result) => {
     set_Subchannels(result)
    })
  }

  //Function adds a sub-channel
  async function addChannel() {
    if (!formState.name) { return }
    if (!/[^\s]/.test(formState.name)) { return }
    if (!channelsContext._Channel) { return }

    //Creates new subchannel object and saves to database with set information, with no users connected
    await DataStore.save(
      new SubChannel({
        "name": formState.name,
        "type": isVoice ? SubChannelType.VOICE : SubChannelType.TEXT,
        "users": [{username: context.user.username, sub: context.user.attributes.sub}],
        "channelID": channelsContext._Channel.id,
        "users_connected": []
      })
    ).then(() => {
      context.spawnNotification("SUCCESS", `New ${isVoice ? "voice" : "text"} channel`, `Channel "${formState.name}" created.`);
    })
    setformState({})
    //Sets the text/voice switch back to original position
    setisVoice(false)
    document.getElementById("name").value = ""
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Subchannels</h1>
        <h5>View & Create subchannels.</h5>
      </div>
      <div>
        <div className={styles.form}>
          {_Subchannels.map((subchannel) => {
            return (
              <React.Fragment key={subchannel.id}>
                <p>{ subchannel.type === "TEXT" ? <HiIcons.HiHashtag/> : <HiIcons.HiMicrophone/>}&nbsp;{subchannel.name}</p>
              </React.Fragment>
            )
          })}
          <hr style={{marginTop:"2ex"}}/>
          <input onChange={onChange} autoComplete="off" id="name" name="name" spellCheck="false" type="text" placeholder="Subchannel name.."/>
          <div className={styles.setting}>

            <Toggle value={setisVoice}/>
            <h5>{ isVoice ? <>VOICE</> : <>TEXT</>}</h5>
          </div>

          <div className={styles.submit}>
            <button onClick={addChannel}>Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subchannels
