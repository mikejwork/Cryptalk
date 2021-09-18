import React, { useContext, useState, useEffect } from 'react'

import * as MdIcons from "react-icons/md";
import { DataStore, SortDirection } from "aws-amplify";
import { AuthContext } from "../../contexts/AuthContext";
import { Messages, MessageType } from '../../models';
import styles from '../../css/Channels/ChannelContent.module.css';

import EmojiMenu from '../Wrappers/Emoji/EmojiMenu'

import MessageSorter from './MessageSorter'

function ChannelContent(props) {
  const context = useContext(AuthContext)

  const [formState, setformState] = useState({message: ""})
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

  function onKeyPress(e) {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  async function getMessages() {
    const result = await DataStore.query(Messages, (message) => message.subchannelID("eq", props.data.id), {
      sort: msg => msg.createdAt(SortDirection.ASCENDING) //SortDirection.DESCENDING
    })
    set_Messages(result)

    if (document.getElementById("message-end") !== null) {
      document.getElementById("message-end").scrollIntoView({ behavior: "smooth" })
    }
  }

  async function sendMessage() {
    const { message } = formState
    const username = context.user.username
    const id = context.user.attributes.sub
    const type = MessageType.TEXT
    const subchannelID = props.data.id

    // Error checking
    // regex ensures the message isnt empty, or just spaces
    if (message === undefined) { return }
    if (!/[^\s]/.test(message)) { return }

    await DataStore.save(
      new Messages({
        "author_username": username,
        "author_id": id,
        "content": message,
        "type": type,
        "subchannelID": subchannelID
      })
    )
    setformState({message: ""})
    document.getElementById("message").value = ""
  }

  return (
    <div className={styles.container} onKeyPress={onKeyPress}>
      <div className={styles.messages}>
        { _Messages &&
          <MessageSorter _Messages={_Messages}/>
        }
        <div id="message-end" className={styles.messageEnd}/>
      </div>
      <div className={styles.inputForm}>
        <MdIcons.MdAttachFile className={styles.attatchFileIcon}/>
        <EmojiMenu setting="APPEND" formState={formState} setformState={setformState} className={styles.emojiMenuIcon}/>
        <input value={formState.message} onChange={onChange} autoComplete="off" spellCheck="false" id="message" name="message" type="text" placeholder="Write a message.."/>
        <MdIcons.MdSend onClick={sendMessage} className={styles.sendIcon}/>
      </div>
    </div>
  )
}

export default ChannelContent
