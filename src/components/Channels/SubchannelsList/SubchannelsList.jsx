import React, { useContext, useState, useEffect } from 'react'
import styles from './index.module.css'

import { ChannelsContext } from "../Channels/Channels";
import { DataStore, SortDirection } from "aws-amplify";
import { SubChannel } from '../../../models';

import Header from '../../Wrappers/Header/Header'
import { TextChannelItem, VoiceChannelItem } from '../SubchannelListItem/SubchannelListItem'

function SubchannelsList() {
  const channelsContext = useContext(ChannelsContext)

  const [_SubChannelsText, set_SubChannelsText] = useState([])
  const [_SubChannelsVoice, set_SubChannelsVoice] = useState([])

  useEffect(() => {
    if (channelsContext._Channel) {
      getSubchannels()
    }
    // eslint-disable-next-line
  }, [channelsContext._Channel])

  async function getSubchannels() {
    DataStore.query(SubChannel, (s) => s.channelID("eq", channelsContext._Channel.id), {
      sort: s => s.createdAt(SortDirection.ASCENDING)
    }).then((result) => {
      set_SubChannelsText(result.filter(s => s.type === 'TEXT'))
      set_SubChannelsVoice(result.filter(s => s.type === 'VOICE'))
    })
  }

  return (
    <>
      <div className={styles.header}>
        <p className={styles.icon}>{channelsContext._Channel?.icon}</p>
        <div>
          <p className={styles.name}>{channelsContext._Channel?.name}</p>
          <p className={styles.desc}>{channelsContext._Channel?.description}</p>
        </div>
      </div>
      { channelsContext._Channel ?
        <div className={styles.container}>
          <Header text="TEXT CHATS"/>
          {_SubChannelsText.map((_SubChannel) => {
            return (
              <TextChannelItem key={_SubChannel.id} _SubChannel={_SubChannel}/>
            )
          })}
          <Header text="VOICE CHATS"/>
          {_SubChannelsVoice.map((_SubChannel) => {
            return (
              <VoiceChannelItem key={_SubChannel.id} _SubChannel={_SubChannel}/>
            )
          })}
        </div>
      :
        <div className={styles.emptyContainer}>
          <p>No channel selected</p>
          <img src={process.env.PUBLIC_URL + '/vector_assets/message.svg'} alt="A girl holding a paper plane."/>
        </div>
      }
    </>
  )
}

export default SubchannelsList
