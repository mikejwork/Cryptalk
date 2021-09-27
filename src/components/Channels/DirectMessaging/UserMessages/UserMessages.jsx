import React, { useState, useContext, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import styles from './index.module.css';
import * as MdIcons from "react-icons/md";
import { DataStore, SortDirection } from "aws-amplify";
import { AuthContext } from "../../../../contexts/AuthContext";
import { DirectMessage, MessageType, Messages } from '../../../../models'
import MessageSorter from '../../MessageSorter'
import EmojiMenu from '../../../Wrappers/Emoji/EmojiMenu'

function UserMessages(props) {
  const context = useContext(AuthContext)
  const userID = props.data.sub

  const [_DirectMessage, set_DirectMessage] = useState()
  const [_Messages, set_Messages] = useState()
  const [formState, setformState] = useState({message: ""})

  useEffect(() => {
    if (context.datastore_ready) {
      get_DirectMessage()
      const s_DirectMessage = DataStore.observe(DirectMessage, (dm) => dm.participants("contains", context.user.attributes.sub)).subscribe(() => get_DirectMessage())
      return () => {
        s_DirectMessage.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.datastore_ready, userID])

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
        if (result[i].participants.includes(userID)) {
          set_DirectMessage(result[i]);
          return;
        }
      }
      // If a DM does not exist
      DataStore.save(new DirectMessage({
        "participants": [context.user.attributes.sub, userID]
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

  async function encrypt(message, key) {
    var ciphertext = CryptoJS.AES.encrypt(message, key + "cryptalkKey");
    return ciphertext.toString();
  }

  async function sendMessage() {
    var { message } = formState
    const author_username = context.user.username
    const author_id = context.user.attributes.sub
    const type = MessageType.TEXT
    const directmessageID = _DirectMessage.id

    // Error checking
    // regex ensures the message isnt empty, or just spaces
    if (message === undefined) { return }
    if (!/[^\s]/.test(message)) { return }

    message = await encrypt(message, directmessageID)

    await DataStore.save(
      new Messages({
        "author_username": author_username,
        "author_id": author_id,
        "content": message,
        "type": type,
        "directmessageID": directmessageID
      })
    )
    setformState({message: ""})
    document.getElementById("message").value = ""
  }

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

  if (!_DirectMessage) { return null }

  return (
    <div className={styles.container} onKeyPress={onKeyPress}>
      <div className={styles.messages}>
        { _Messages &&
          <MessageSorter _Messages={_Messages}/>
        }
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

export default UserMessages
