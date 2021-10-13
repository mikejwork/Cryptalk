import React, { useEffect, useContext, useRef, useState } from 'react'
import styles from './index.module.css'
import * as FaIcons from 'react-icons/fa'
import * as BsIcons from 'react-icons/bs'
import { AuthContext } from '../../../contexts/AuthContext'
import { SocketContext } from '../../../socket/SocketHandler'

import UserAvatar, { AvatarHue } from '../../Wrappers/Avatar/UserAvatar'

/* Video stream handler */
const Video = (props) => {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.srcObject = props.stream
    //eslint-disable-next-line
  }, [])

  return ( <video ref={videoRef} playsInline autoPlay muted/>)
}

function PeerContainer(props) {
  const socketContext = useContext(SocketContext)
  const [colour, setcolour] = useState(``)
  const [_Video, set_Video] = useState(false)
  const [_Audio, set_Audio] = useState(false)

  /* Coloured background */
  useEffect(() => {
    const getColour = async () => {
      const fuck = await AvatarHue(props.peer.sub);
      setcolour(fuck)
    }
    getColour()
    // eslint-disable-next-line
  }, [props.peer])

  /* UI Setup */
  useEffect(() => {
    set_Video(props.peer.video)
    set_Audio(props.peer.audio)

    socketContext.socket.on('room::enableVoice', (user) => {
      if (user.sub === props.peer.sub) {
        set_Audio(true)
      }
    })

    socketContext.socket.on('room::disableVoice', (user) => {
      if (user.sub === props.peer.sub) {
        set_Audio(false)
      }
    })

    socketContext.socket.on('room::enableVideo', (user) => {
      if (user.sub === props.peer.sub) {
        set_Video(true)
      }
    })

    socketContext.socket.on('room::disableVideo', (user) => {
      if (user.sub === props.peer.sub) {
        set_Video(false)
      }
    })
  }, [])


  return (
    <>
      { _Video ?
        <div className={styles.streamContainerVideo}>
          <div className={styles.videoContainer}>
            { !_Audio &&
              <div className={styles.mutedVideo}><BsIcons.BsMicMuteFill/></div>
            }
            <Video stream={props.peer.call._remoteStream}/>
          </div>
        </div>
      :
        <div className={styles.streamContainer} style={{backgroundColor:`${colour}`}}>

          { !_Audio &&
            <div className={styles.muted}><BsIcons.BsMicMuteFill/></div>
          }
          <UserAvatar className={styles.avatar} alt="" id={props.peer.sub}/>
          <p className={styles.username}>{props.peer.username}</p>
        </div>
      }
    </>

  )
}

function SubChannelVoice(props) {
  const context = useContext(AuthContext)
  const socketContext = useContext(SocketContext)

  useEffect(() => {
    socketContext.room_connect(props.id)

    return () => {
      socketContext.room_disconnect(props.id)
    }
    // eslint-disable-next-line
  }, [props.id])

  return (
    <div className={styles.container}>
      <hr/>
      <div className={styles.menu}>
        <span onClick={socketContext.toggle_Audio}>
          <FaIcons.FaMicrophone style={{color:`${socketContext._Audio ? "white" : "red"}`}}/>
        </span>
        <span onClick={socketContext.toggle_Video}>
          <FaIcons.FaCamera style={{color:`${socketContext._Video ? "white" : "red"}`}}/>
        </span>
        <span>
          <FaIcons.FaHeadphonesAlt style={{color:"grey"}}/>
        </span>
      </div>
      <hr/>
      <div className={styles.streams}>
        { socketContext.current_peers.map((peer) => {
          return (
            <PeerContainer key={peer.sub} peer={peer}/>
          )
        })}
      </div>
    </div>
  )
}

export default SubChannelVoice
