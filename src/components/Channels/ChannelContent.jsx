import React, { useContext, useState, useEffect } from 'react'

import * as MdIcons from "react-icons/md";
import { DataStore, SortDirection } from "aws-amplify";
import { AuthContext } from "../../contexts/AuthContext";
import { Channel, SubChannel, SubChannelType, Messages, MessageType } from '../../models';
import styles from '../../css/Channels/ChannelContent.module.css';

function ChannelContent(props) {
  const context = useContext(AuthContext)

  const [formState, setformState] = useState({})
  const [_Messages, set_Messages] = useState([])

  useEffect(() => {
    if (context.datastore_ready && props.data) {
      getMessages()
      const messages_subscription = DataStore.observe(Messages, (message) => message.subchannelID("eq", props.data.id)).subscribe(() => getMessages())
      return () => {
        messages_subscription.unsubscribe()
      }
    } else {
      set_Messages([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data])

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  async function getMessages() {
    const result = await DataStore.query(Messages, (message) => message.subchannelID("eq", props.data.id), {
      sort: msg => msg.createdAt(SortDirection.ASCENDING) //SortDirection.DESCENDING
    })
    set_Messages(result)
    console.log("Messages", result)

    if (document.getElementById("message-end") !== null) {
      document.getElementById("message-end").scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.messages}>

      </div>
      <div className={styles.inputForm}>
        <MdIcons.MdAttachFile className={styles.attatchFileIcon}/>
        <MdIcons.MdTagFaces className={styles.emojiMenuIcon}/>
        <input autoComplete="off" spellCheck="false" id="message" name="message" type="text" placeholder="Write a message.."/>
        <MdIcons.MdSend className={styles.sendIcon}/>
      </div>
    </div>
  )
}

export default ChannelContent
