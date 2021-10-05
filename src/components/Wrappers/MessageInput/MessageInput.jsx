import React, { useEffect, useState, useRef, useContext } from 'react'

import { AuthContext } from "../../../contexts/AuthContext";
import EmojiMenu from '../Emoji/EmojiMenu'
import { MessageType } from '../../../models';
import * as MdIcons from "react-icons/md";
import styles from './index.module.css'
import DragDrop from '../DragDrop/DragDrop';

function MessageInput(props) {
  const context = useContext(AuthContext)

  const uploaderRef = useRef(null)
  const [_FileName, set_FileName] = useState("")
  const [_FileSize, set_FileSize] = useState("")

  const [_FilePreview, set_FilePreview] = useState(undefined)

  const [_FileDelete, set_FileDelete] = useState(false)

  const [_FileView, set_FileView] = useState("")

  const [formState, setformState] = useState({
    message: "",
    type: MessageType.TEXT,
    file: undefined
  })

  function processMessage() {
    // If type is file we can have empty messages
    if (formState.type === MessageType.TEXT) {
      if (formState.message === undefined) { context.spawnNotification("ERROR", "Error", "Message cannot be empty."); return; }
      if (!/[^\s]/.test(formState.message)) { context.spawnNotification("ERROR", "Error", "Message cannot be empty."); return; }
    }
    console.log("formState", formState)
  }

  function openUpload() {
    if (uploaderRef?.current) {
      uploaderRef.current.click()
    }
  }

  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  function onFileChange(e) {
    let file = e
    if (e.type === "change") {
      file = e.target.files[0];
    }

    if (!file) { return; }
    console.log(file)

    set_FileName(file.name)
    set_FileSize(bytesToSize(file.size))
    setformState(() => ({
      ...formState,
      type: MessageType.FILE,
      file: file
    }));

    if (file.type.startsWith("image/")) {
      let src = URL.createObjectURL(file);
      set_FilePreview(src)
      set_FileView("IMAGE")
      set_FileDelete(true)
    } else if (file.type === "application/pdf") {
      set_FileView("PDF")
      set_FileDelete(true)
    } else if (file.type === "application/x-zip-compressed") {
      set_FileView("ZIP")
      set_FileDelete(true)
    } else {
      set_FileView("unknown")
      set_FileDelete(true)
    }
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  function onKeyPress(e) {
    if (e.key === "Enter") {
      processMessage()
    }
  }

  //Used for drag and drop
  const dropFile = (files) => {
    onFileChange(files[0])
  }

  const FilePreview = () => {
    switch(_FileView) {
      case "IMAGE": return <img className={styles.preview} alt="attatchment preview" src={_FilePreview} />;
      case "PDF": return <p className={styles.fileIcon}><MdIcons.MdInsertDriveFile/></p>
      case "ZIP": return <p className={styles.fileIcon}><MdIcons.MdViewDay/></p>
      case "unknown": return <p className={styles.fileIcon}><MdIcons.MdFileDownload/></p> 
    }
  }

  function deleteFile(e) {
    setformState(() => ({
      ...formState,
      type: 0,
      file: null
    }));
      set_FilePreview(null)
      set_FileName("");
      set_FileDelete(false)
  }

  return (
    <>
      <DragDrop dropFile={dropFile}>
        <div style={{ display: "none" }}>
          <input type="file" ref={uploaderRef} onChange={onFileChange} />
        </div>
        {_FileName &&
        <div className={styles.imageBlock}>
          <div className={styles.attatchment} style={{ display: `${formState.type === MessageType.FILE ? "block" : "none"}` }}>
            {_FileName} . <strong>{_FileSize}</strong>
          </div>
          <div className={styles.imageContainer}>
            { FilePreview() }

            {_FileDelete &&
              <p onClick={deleteFile} className={styles.reject}><MdIcons.MdClose/></p>
            }
          </div>
          </div>
          }

        <div className={styles.main} onKeyPress={onKeyPress}>
          <MdIcons.MdAttachFile className={styles.attatchFileIcon} onClick={openUpload} />
          <EmojiMenu setting="APPEND" formState={formState} setformState={setformState} className={styles.emojiMenuIcon} />
          <input value={formState.message} onChange={onChange} autoComplete="off" spellCheck="false" id="message" name="message" type="text" placeholder="Write a message.." />
          <MdIcons.MdSend onClick={processMessage} className={styles.sendIcon} />
        </div>
      </DragDrop>
    </>
  )
}

export default MessageInput
