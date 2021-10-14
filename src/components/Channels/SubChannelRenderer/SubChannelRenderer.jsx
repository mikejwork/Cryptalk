/*
  Author: Michael
  Description:
    Renders the subchannels with the name, edit button, and icon,
    viewed in the channels side bar.

  Related PBIs: 9
*/

import React, { useContext } from 'react'
import styles from './index.module.css'
import * as HiIcons from "react-icons/hi";

import { ChannelsContext } from "../Channels/Channels";

import SubChannelText from '../SubChannelText/SubChannelText'
import SubChannelVoice from '../SubChannelVoice/SubChannelVoice'

function SubChannelRenderer() {
  const channelsContext = useContext(ChannelsContext)

  if (!channelsContext._SubChannel) { return null }

  return (
    <>
      <div className={styles.contentHead}>
        <p className={styles.icon}>{channelsContext._SubChannel.type === 'TEXT' ? <HiIcons.HiHashtag/> : <HiIcons.HiMicrophone/>}</p>
        <p className={styles.name}>{channelsContext._SubChannel.name}</p>
        <div className={styles.edit}>
          <HiIcons.HiCog className={styles.icon} onClick={() => channelsContext.set_ViewOverlay("ViewOverlay_ManageChannel")}/>
        </div>
      </div>
      <div className={styles.content}>
        {channelsContext._SubChannel.type === 'TEXT' ? <SubChannelText/> : <SubChannelVoice id={channelsContext._SubChannel.id}/>}
      </div>
    </>
  )
}

export default SubChannelRenderer
