import React, { useContext, useEffect, useState } from 'react'
import styles from './index.module.css'
import * as HiIcons from "react-icons/hi";

import { DataStore, SortDirection } from "aws-amplify";
import { DirectMessage, Messages } from '../../../models'
import MessageSorter from '../../Wrappers/MessageSorter/MessageSorter'
import { AuthContext } from "../../../contexts/AuthContext";
import { ChannelsContext } from "../Channels/Channels";


function DirectRenderer() {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)

  const [_DirectMessage, set_DirectMessage] = useState()
  const [_Messages, set_Messages] = useState()

  useEffect(() => {
    if (context.datastore_ready) {
      get_DirectMessage()
      const s_DirectMessage = DataStore.observe(DirectMessage, (dm) => dm.participants("contains", context.user.attributes.sub)).subscribe(() => get_DirectMessage())
      return () => {
        s_DirectMessage.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.datastore_ready, channelsContext._Direct.sub])

  useEffect(() => {
    if (context.datastore_ready && _DirectMessage) {
      get_Messages()
      const s_Messages = DataStore.observe(Messages, (msg) => msg.directmessageID("eq", _DirectMessage.id)).subscribe(() => get_Messages())
      return () => {
        s_Messages.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.datastore_ready, _DirectMessage])

  async function get_DirectMessage() {
    DataStore.query(DirectMessage, (dm) => dm.participants("contains", context.user.attributes.sub), {
      sort: s => s.createdAt(SortDirection.ASCENDING)
    }).then(async (result) => {
      for (var i in result) {
        if (result[i].participants.includes(channelsContext._Direct.sub)) {
          set_DirectMessage(result[i]);
          return;
        }
      }
      // If a DM does not exist
      DataStore.save(new DirectMessage({
        "participants": [context.user.attributes.sub, channelsContext._Direct.sub]
      })).then(async (result) => {
        set_DirectMessage(result);
      })
    });
  }

  async function get_Messages() {
    DataStore.query(Messages, (msg) => msg.directmessageID("eq", _DirectMessage.id), {
      sort: s => s.createdAt(SortDirection.ASCENDING)
    }).then(async (result) => {
      set_Messages(result);
    });
  }

  if (!channelsContext._Direct) { return null }
  return (
    <>
      <div className={styles.contentHead}>
        <p className={styles.icon}><HiIcons.HiHashtag/></p>
        <p className={styles.name}>{channelsContext._Direct.username}</p>
      </div>
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.messageList}>
            { _Messages &&
              <MessageSorter _Messages={_Messages}/>
            }
          </div>
          <div className={styles.inputContainer}>
            INPUT HERE
          </div>
        </div>
      </div>
    </>
  )
}

export default DirectRenderer
