/*
  Author: Michael
  Description:
    Text sub channel, shows member list, message list, etc.
  Related PBIs: 10
*/

import React, { useState, useContext, useEffect } from 'react'
import styles from './index.module.css'

import { DataStore, SortDirection } from "aws-amplify";
import { AuthContext } from "../../../contexts/AuthContext";
import { ChannelsContext } from "../Channels/Channels";
import { Messages } from '../../../models';

import MessageSorter from '../../Wrappers/MessageSorter/MessageSorter'
import MessageInput from '../../Wrappers/MessageInput/MessageInput'
import Header from '../../Wrappers/Header/Header'

import FriendsListItem from '../FriendsListItem/FriendsListItem'

function SubChannelText() {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)
  const [_Messages, set_Messages] = useState([])

  // Data subscriptions
  useEffect(() => {
    if (context.datastore_ready && channelsContext._SubChannel) {
      getMessages()
      const messages_subscription = DataStore.observe(Messages, (message) => message.subchannelID("eq", channelsContext._SubChannel.id)).subscribe(() => getMessages())
      return () => {
        messages_subscription.unsubscribe()
      }
    } else {
      set_Messages([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelsContext._SubChannel])

  async function getMessages() {
    var result = await DataStore.query(Messages, (message) => message.subchannelID("eq", channelsContext._SubChannel.id), {
      sort: msg => msg.createdAt(SortDirection.ASCENDING)
    })
    set_Messages(result)

    // if (document.getElementById("message-end") !== null) {
    //   document.getElementById("message-end").scrollIntoView({ behavior: "smooth" })
    // }
  }

  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        <MessageSorter _Messages={_Messages}/>
      </div>
      <div className={styles.inputContainer}>
        <MessageInput type="SUBCHANNEL" id={channelsContext?._SubChannel?.id}/>
      </div>
      <div className={styles.members}>
        <Header text="MEMBERS"/>
        { channelsContext?._SubChannel?.users?.map((user) => {
          // we set selectable to false because we dont want users
          // to be able to direct message non-friends
          return (<FriendsListItem key={user.sub} friend={user} selectable={false}/>)
        })}
      </div>
    </div>
  )
}

export default SubChannelText
