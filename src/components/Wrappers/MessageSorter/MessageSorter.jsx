import React, { useContext, useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import UserAvatar from '../Avatar/UserAvatar'
import { AuthContext } from "../../../contexts/AuthContext";
import styles from './index.module.css';

function getRelativeDate(createdAt) {
  var date = new Date(createdAt);
  var now = new Date();
  var diff = now.getTime() - date.getTime();
  var day_diff = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (day_diff === 0) {
    return "Today";
  } else if (day_diff === 1) {
    return "Yesterday";
  } else if (day_diff < 7) {
    if (day_diff === 1) {
      return day_diff + " day ago";
    }
    return day_diff + " days ago";
  } else if (day_diff < 31) {
    if (Math.floor(day_diff / 7) === 1) {
      return Math.floor(day_diff / 7) + " week ago";
    }
    return Math.floor(day_diff / 7) + " weeks ago";
  } else if (day_diff < 365) {
    if (Math.floor(day_diff / 30) === 1) {
      return Math.floor(day_diff / 30) + " month ago";
    }
    return Math.floor(day_diff / 30) + " months ago";
  } else {
    if (Math.floor(day_diff / 365) === 1) {
      return Math.floor(day_diff / 365) + " year ago";
    }
    return Math.floor(day_diff / 365) + " years ago";
  }
}

function getRelativeIndex(createdAt) {
  var date = new Date(createdAt);
  var now = new Date();
  var diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function ChatBubble(props) {
  var content = props._Message.content;
  var directID = props._Message.directmessageID;
  var channelID = props._Message.subchannelID;

  const [_Decrypted, set_Decrypted] = useState("")

  function decrypt(cipherText, key) {
    var bytes = CryptoJS.AES.decrypt(cipherText, key + "cryptalkKey");
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  useEffect(() => {
    if (directID !== null && directID !== undefined) {
      var decryptedDM = decrypt(content, directID)
      set_Decrypted(decryptedDM)
      return;
    }

    if (channelID !== null && channelID !== undefined) {
      var decryptedMSG = decrypt(content, channelID)
      set_Decrypted(decryptedMSG)
      return;
    }
  }, [channelID, directID, content])

  if (props.isIncoming) {
    return (
      <>
        <div className={styles.incoming}>
          <div className={`${props.appendPrevious ? styles.incomingInfo_a : styles.incomingInfo}`}>
            <p>{props._Message.author_username}</p>
            <UserAvatar id={props._Message.author_id}/>
          </div>
          <div className={`${props.appendPrevious ? styles.incomingMessage_a : styles.incomingMessage}`}>
            <p>{_Decrypted}</p>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className={styles.outgoing}>
          <div className={`${props.appendPrevious ? styles.outgoingInfo_a : styles.outgoingInfo}`}>
            <UserAvatar id={props._Message.author_id}/>
            <p>{props._Message.author_username}</p>
          </div>
          <div className={`${props.appendPrevious ? styles.outgoingMessage_a : styles.outgoingMessage}`}>
            <p>{_Decrypted}</p>
          </div>
        </div>
      </>
    )
  }
}

function MessageSorter(props) {
  // _Messages
  const context = useContext(AuthContext)

  return (
    <div className={styles.container}>
      { props._Messages.map((message, index) => {
        var isIncoming = false;
        var isImage = false
        var isFile = false
        var appendPrevious = false;
        var relativeIndex = getRelativeIndex(message.createdAt)
        var relativeDate = getRelativeDate(message.createdAt)

        if (message.author_id !== context.user.attributes.sub) { isIncoming = true }
        if (message.type === "FILE") { isFile = true }
        if (message.type === "IMG") { isImage = true }
        if (index !== 0) { if (props._Messages.at(index - 1).author_id === message.author_id) { appendPrevious = true }}

        if (relativeIndex !== -1 && index !== 0) {
          if (relativeIndex < getRelativeIndex(props._Messages.at(index - 1).createdAt)) {
            // TODAY
            if (relativeIndex === 0) {
              return (
                <div key={message.id}>
                  <div className={styles.timeSpacer}>
                    <div className={styles.spacer}/>
                    <p>{relativeDate}</p>
                    <div className={styles.spacer}/>
                  </div>
                  <ChatBubble _Message={message} isIncoming={isIncoming} isImage={isImage} isFile={isFile} appendPrevious={false} key={message.id}/>
                </div>
              )
            }
          }
        }

        // PUT THE LATEST DATE ON TOP OF THE FIRST MESSAGE
        if (index === 0) {
          return (
            <div key={message.id}>
              <div className={styles.timeSpacer}>
                <div className={styles.spacer}/>
                <p>{relativeDate}</p>
                <div className={styles.spacer}/>
              </div>
              <ChatBubble _Message={message} isIncoming={isIncoming} isImage={isImage} isFile={isFile} appendPrevious={false} key={message.id}/>
            </div>
          )
        }

        // ELSE
        return (
          <ChatBubble _Message={message} isIncoming={isIncoming} isImage={isImage} isFile={isFile} appendPrevious={appendPrevious} key={message.id}/>
        )
      })}
      <div id="message-end" className={styles.messageEnd}/>
    </div>
  )
}

export default MessageSorter
