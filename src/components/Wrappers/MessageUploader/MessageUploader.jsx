/*
  Author: Michael
  Description:
    Uploader for user attatchments, drag-and-drop
  Related PBIs: nil
*/

import React, { useRef, useEffect, useState } from 'react'

import styles from './index.module.css'
import * as HiIcons from "react-icons/hi";
import { useSpring, animated } from 'react-spring'

function MessageUploader(props) {
  const containerRef = useRef()
  const [_Dragging, set_Dragging] = useState(false)
  const [a_styling, api] = useSpring(() => ({
    opacity: `0`,
    zIndex: `1`,
    config: {
      duration: 100
    }
  }))

  useEffect(() => {
    api.start({
      opacity: _Dragging ? `1` : `0`,
      zIndex: _Dragging ? `3` : `1`
    })
    return () => {api.start({opacity:`0`})}
    // eslint-disable-next-line
  }, [_Dragging])

  // Event setting & cleanup
  useEffect(() => {
    let container = containerRef.current;
    if (container) {
      container.addEventListener('dragover', onDragOver, false);
      container.addEventListener('dragenter', onDragEnter, false);
      container.addEventListener('dragleave', onDragLeave, false);
      container.addEventListener('drop', onDrop, false);
    }
    return () => {
      if (container) {
        container.removeEventListener('dragover', onDragOver);
        container.removeEventListener('dragenter', onDragEnter);
        container.removeEventListener('dragleave', onDragLeave);
        container.removeEventListener('drop', onDrop);
      }
    }
    // eslint-disable-next-line
  }, [containerRef.current])

  // Event management
  function onDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function onDragEnter(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      set_Dragging(true)
    }
  }

  function onDragLeave(e) {
    e.preventDefault()
    e.stopPropagation()
    set_Dragging(false)
  }

  function onDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      fileDropped(e.dataTransfer.files[0])
      e.dataTransfer.clearData()
      set_Dragging(false)
    }
  }

  function fileDropped(file) {
    props.callback(file)
  }

  return (
    <animated.div ref={containerRef} className={styles.container} style={a_styling}>
      <div className={styles.uploader}>
        <HiIcons.HiUpload className={styles.icon}/>
        <p>Drop a file here</p>
        <i>maximum file size: 2MB</i>
      </div>
    </animated.div>
  )
}

export default MessageUploader
