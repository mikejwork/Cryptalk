import React, { useContext, useEffect, useState } from 'react'
import styles from './index.module.css'
import * as HiIcons from "react-icons/hi";

import { ChannelsContext } from "../Channels/Channels";
import { DataStore } from "aws-amplify";
import { SubChannel } from '../../../models';

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
      </div>
      <div className={styles.content}>
        {channelsContext._SubChannel.type === 'TEXT' ? <SubChannelText/> : <SubChannelVoice/>}
      </div>
    </>
  )
}

export default SubChannelRenderer
