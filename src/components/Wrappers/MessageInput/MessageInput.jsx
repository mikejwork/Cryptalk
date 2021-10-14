/*
  Author: Michael
  Description:
    Messgae input for channels and direct messaging
  Related PBIs: nil
*/

import React, { useState, useRef, useContext } from 'react'

import CryptoJS from 'crypto-js'
import { AuthContext } from "../../../contexts/AuthContext";
import { DataStore, Storage } from "aws-amplify";
import { MessageType, Messages, FileMetadata } from '../../../models'

import styles from './index.module.css'
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";

import EmojiMenu from '../Emoji/EmojiMenu'
// import MessageUploader from '../MessageUploader/MessageUploader'

function MessageInput(props) {
  const context = useContext(AuthContext)
  const uploaderRef = useRef(null)
  const [_Filetype, set_Filetype] = useState("DEFAULT")
  const [_Filename, set_Filename] = useState("")
  const [_Filesize, set_Filesize] = useState("")
  const [_Filepreview, set_Filepreview] = useState()
  const [formState, setformState] = useState({
    message: "",
    type: MessageType.TEXT,
    file: undefined
  })

  async function encrypt(message, key) {
    var ciphertext = CryptoJS.AES.encrypt(message, key + "cryptalkKey");
    return ciphertext.toString();
  }

  async function uploadToS3(file) {
    context.spawnNotification("DOWNLOAD", "Uploading..", "Beginning upload.");
    var ret = ''
    await Storage.put(context.user.username + "_" + file.name, file).then(async (result) => {
      ret = result.key
    });
    return ret
  }

  async function processMessage() {
    // If type is file we can have empty messages
    if (formState.type === MessageType.TEXT) {
      if (formState.message === undefined) { context.spawnNotification("ERROR", "Error", "Message cannot be empty."); return; }
      if (!/[^\s]/.test(formState.message)) { context.spawnNotification("ERROR", "Error", "Message cannot be empty."); return; }
    }

    const message = await encrypt(formState.message, props.id)

    var contentLink = ""
    var metadata = null
    if (formState.type === MessageType.FILE) {
      contentLink = await uploadToS3(formState.file);
      metadata = new FileMetadata({
        "S3Key": contentLink,
        "filename": formState.file.name,
        "filesize": formState.file.size,
        "filetype": _Filetype
      })
    }

    await DataStore.save(
      new Messages({
        "author_username": context.user.username,
        "author_id": context.user.attributes.sub,
        "content": message,
        "metadata": metadata,
        "type": formState.type,
        "directmessageID": props.type === "DIRECT" ? props.id : undefined,
        "subchannelID": props.type === "SUBCHANNEL" ? props.id : undefined
      })
    )

    setformState({
      message: "",
      type: MessageType.TEXT,
      file: undefined
    })
  }

  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  function updatePreview(file) {
    // File name
    set_Filename(file.name);

    // File size
    set_Filesize(bytesToSize(file.size));

    // File type
    if (file.type.startsWith("image/")) {
      set_Filetype("IMAGE");
      set_Filepreview(URL.createObjectURL(file))
      return;
    }

    if (file.name.endsWith(".docx")) {
      set_Filetype("DOC");
      return;
    }

    switch(file.type) {
      case "application/pdf":
        set_Filetype("PDF");
        break;
      case "application/x-zip-compressed":
        set_Filetype("ZIP");
        break;
      default:
        break;
    }
  }

  const FilePreview = () => {
    switch(_Filetype) {
      case "IMAGE": return <img src={_Filepreview} alt=" "/>;
      case "PDF": return <FaIcons.FaFilePdf className={styles.icon}/>
      case "ZIP": return <FaIcons.FaFileArchive className={styles.icon}/>
      case "DOC": return <FaIcons.FaFileWord className={styles.icon}/>
      case "DEFAULT": return <FaIcons.FaFileDownload className={styles.icon}/>
      default:
        break;
    }
  }

  // Event management
  function onKeyPress(e) {
    if (e.key === "Enter") {
      processMessage()
    }
  }

  function onFileChange(e) {
    var file = e
    if (!file) { return; }
    if (file.type === "change") { file = e.target.files[0] }
    if (!file.name) { return; }
    if (file.size > 2000000) {
      context.spawnNotification("ERROR", "Error", "File size can't exceed 2MB.");
      return;
    }

    setformState(() => ({
      ...formState,
      type: MessageType.FILE,
      file: file
    }));

    updatePreview(file)
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  function onRemove() {
    setformState(() => ({
      ...formState,
      type: MessageType.TEXT,
      file: undefined
    }));
    set_Filetype("DEFAULT")
    set_Filename("")
    set_Filesize("")
    set_Filepreview(null)
  }

  return (
    <>
      { formState.file &&
        <div className={styles.preview}>
          <div className={styles.filePreview}>
            { FilePreview() }
          </div>
          <div className={styles.fileRemove} onClick={onRemove}>
            <MdIcons.MdClose/>
          </div>
          <div className={styles.fileInfo}>
            <p className={styles.name}>{_Filename}</p>
            <p className={styles.size}>{_Filesize}</p>
          </div>
        </div>
      }

      <div className={styles.main}>
        <input type="file" ref={uploaderRef} onChange={onFileChange} style={{ display: "none" }}/>

        {/* <MessageUploader callback={onFileChange}/> */}

        <div className={styles.container} onKeyPress={onKeyPress}>
          <MdIcons.MdAttachFile className={styles.upload} onClick={() => uploaderRef.current.click()}/>
          <EmojiMenu className={styles.emoji} setting="APPEND" formState={formState} setformState={setformState}/>
          <input value={formState.message} onChange={onChange} autoComplete="off" spellCheck="false" id="message" name="message" type="text" placeholder="Write a message.."/>
          <MdIcons.MdSend className={styles.send} onClick={processMessage}/>
        </div>
      </div>
    </>

  )
}

export default MessageInput
