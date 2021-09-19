import React, { useContext } from 'react'
import UserAvatar from '../Wrappers/Avatar/UserAvatar'
import { AuthContext } from "../../contexts/AuthContext";
import styles from '../../css/Channels/MessageSorter.module.css';

// Purpose:
// to sort a given array of messages into a readable format, sorted by timestamp etc.

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
  // isIncoming
  // isImage
  // isFile
  // appendPrevious
  // _Message

  if (props.isIncoming) {
    return (
      <div className={styles.i_container}>
        <div className={`${props.appendPrevious ? styles.i_chatBubbleAppend : styles.i_chatBubble}`}>
          <div className={styles.chatBubbleAvatar} style={{marginTop: `${props.appendPrevious ? "-5ex" : "0ex"}`}}>
            <UserAvatar style={{visibility: `${props.appendPrevious ? "hidden" : "visible"}`}} alt={`${props._Message.author_username} + "'s avatar."`} id={props._Message.author_id}/>
          </div>
          {!props.appendPrevious &&
            <>
              <div className={styles.i_chatBubbleName}>
                <p>{props._Message.author_username}</p>
                {/* <div className={styles.spacer}/>*/}
              </div>
              <div className={styles.chatBubbleTime}>
                <p></p>
              </div>
            </>
          }
          <div className={`${props.appendPrevious ? styles.i_chatBubbleMessageAppend : styles.i_chatBubbleMessage}`}>
            <p>{props._Message.content}</p>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className={`${props.appendPrevious ? styles.chatBubbleAppend : styles.chatBubble}`}>
        <div className={styles.chatBubbleAvatar} style={{marginTop: `${props.appendPrevious ? "-5ex" : "0ex"}`}}>
          <UserAvatar style={{visibility: `${props.appendPrevious ? "hidden" : "visible"}`}} alt={`${props._Message.author_username} + "'s avatar."`} id={props._Message.author_id}/>
        </div>
        {!props.appendPrevious &&
          <>
            <div className={styles.chatBubbleName}>
              <p>{props._Message.author_username}</p>
              {/* <div className={styles.spacer}/>*/}
            </div>
            <div className={styles.chatBubbleTime}>
              <p></p>
            </div>
          </>
        }
        <div className={`${props.appendPrevious ? styles.chatBubbleMessageAppend : styles.chatBubbleMessage}`}>
          <p>{props._Message.content}</p>
        </div>
      </div>
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
    </div>
  )
}

export default MessageSorter
