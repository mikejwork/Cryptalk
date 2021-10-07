import React, { useContext, useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import UserAvatar from '../Avatar/UserAvatar'
import { AuthContext } from "../../../contexts/AuthContext";
import styles from './index.module.css';
import { Storage } from "aws-amplify";
import * as FaIcons from "react-icons/fa";

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
  const context = useContext(AuthContext)
  var content = props._Message.content;

  const [_Decrypted, set_Decrypted] = useState("")
  const [_Image, set_Image] = useState(undefined)
  const [_Filetype, set_Filetype] = useState("DEFAULT")
  const [_Filename, set_Filename] = useState("")
  const [_Filesize, set_Filesize] = useState("")

  function decrypt(cipherText, key) {
    var bytes = CryptoJS.AES.decrypt(cipherText, key + "cryptalkKey");
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  useEffect(() => {
    var key = "";

    if (props._Message.directmessageID === null) {
      key = props._Message.subchannelID;
    }

    if (props._Message.subchannelID === null) {
      key = props._Message.directmessageID;
    }
    if (key === "") { return; } 
    var decryptedDM = decrypt(content, key)
    set_Decrypted(decryptedDM)
    // eslint-disable-next-line
  }, [props._Message.directmessageID, props._Message.subchannelID])

  useEffect(() => {
    if (props._Message.type === "FILE") {
      if (props._Message.metadata.filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
        set_Filetype("DEFAULT")
        set_Filename(props._Message.metadata.filename)
        set_Filesize(props._Message.metadata.filesize)
        Storage.get(props._Message.metadata.S3Key).then((result) => {
          set_Image(result)
        })
        return;
      }

      set_Filetype(props._Message.metadata.filetype)
      set_Filename(props._Message.metadata.filename)
      set_Filesize(props._Message.metadata.filesize)
    }
    // eslint-disable-next-line
  }, [])

  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  function downloadFile(S3Key) {
    Storage.get(S3Key).then((result) => {
      window.location.href = result
      context.spawnNotification("DOWNLOAD", "Downloaded", "File successfully downloaded.");
    })
  }

  const FilePreview = () => {
    switch(_Filetype) {
      case "PDF": return <FaIcons.FaFilePdf className={styles.icon}/>
      case "ZIP": return <FaIcons.FaFileArchive className={styles.icon}/>
      case "DOC": return <FaIcons.FaFileWord className={styles.icon}/>
      case "DEFAULT": return <FaIcons.FaFileDownload className={styles.icon}/>
      default:
        break;
    }
  }

  if (props.isIncoming) {
    return (
      <>
        <div className={styles.incoming}>
          <div className={`${props.appendPrevious ? styles.incomingInfo_a : styles.incomingInfo}`}>
            <p>{props._Message.author_username}</p>
            <UserAvatar id={props._Message.author_id}/>
          </div>
          <div className={`${props.appendPrevious ? styles.incomingMessage_a : styles.incomingMessage}`}>
            <p style={{textAlign:"end"}}>{_Decrypted}</p>
            { props._Message.type === "FILE" &&
              <>
                { _Image &&
                  <img className={styles.messageContent} src={_Image} alt=""/>
                }
                <div className={styles.fileInfo}>
                  <p className={styles.fileIcon}>{ FilePreview() }</p>
                  <p className={styles.filename}>{ _Filename }</p>
                  <p className={styles.filesize}>{ bytesToSize(_Filesize) }</p>
                  <p className={styles.filedownload} onClick={() => downloadFile(props._Message.metadata.S3Key)}><FaIcons.FaDownload/></p>
                </div>
              </>
            }
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
            { props._Message.type === "FILE" &&
              <>
                { _Image &&
                  <img className={styles.messageContent} src={_Image} alt=""/>
                }
                <div className={styles.fileInfo}>
                  <p className={styles.fileIcon}>{ FilePreview() }</p>
                  <p className={styles.filename}>{ _Filename }</p>
                  <p className={styles.filesize}>{ bytesToSize(_Filesize) }</p>
                  <p className={styles.filedownload} onClick={() => downloadFile(props._Message.metadata.S3Key)}><FaIcons.FaDownload/></p>
                </div>
              </>
            }
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
                  <ChatBubble _Message={message} isIncoming={isIncoming} isFile={isFile} appendPrevious={false} key={message.id}/>
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
