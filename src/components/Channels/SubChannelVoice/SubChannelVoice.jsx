/*
  Author: Michael
  Description:
    Voice handler for voice chat, uses the SocketHandler context to show peers video and audio.
  Related PBIs: 11
*/

import React, { useEffect, useContext, useRef, useState } from 'react'
import styles from './index.module.css'
import * as FaIcons from 'react-icons/fa'
import * as BsIcons from 'react-icons/bs'
import { SocketContext } from '../../../socket/SocketHandler'

import UserAvatar, { AvatarHue } from '../../Wrappers/Avatar/UserAvatar'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';

const Audio = (props) => {
  const audioRef = useRef();
  const volume = useRef();
  const [volumeUI, setvolumeUI] = useState(0)

  useEffect(() => {
    volume.current = 100
    setvolumeUI(100)
    audioRef.current.srcObject = props.stream
    //eslint-disable-next-line
  }, [])

  function onSliderChange(e) {
    volume.current = e
    setvolumeUI(e)
    audioRef.current.volume = (e / 100)
  }

  return (
    <>
      <audio className={styles.audioPlayer} ref={audioRef} controls autoPlay/>
      <div className={styles.audioSliderContainer}>
        Volume: {volumeUI}%
        <Slider
          className={styles.audioSlider}
          defaultValue={100}
          min={0}
          max={100}
          step={10}
          onChange={onSliderChange}
          trackStyle={{
            background: "var(--bg-accent)"
          }}
          handleStyle={{
            background: "white"
          }}
          railStyle={{
            background: "var(--bg-dark)"
          }}
        />
      </div>
    </>
  )
}

function PeerContainer(props) {
  const socketContext = useContext(SocketContext)
  const [colour, setcolour] = useState(``)
  // const [_Video, set_Video] = useState(false)
  const [_Audio, set_Audio] = useState(true)

  /* Coloured background */
  useEffect(() => {
    const getColour = async () => {
      const avatarHue = await AvatarHue(props.peer.sub);
      setcolour(avatarHue)
    }
    getColour()
    // eslint-disable-next-line
  }, [props.peer])

  /* UI Setup */
  useEffect(() => {
    //set_Video(props.peer.video)
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
        //set_Video(true)
      }
    })

    socketContext.socket.on('room::disableVideo', (user) => {
      if (user.sub === props.peer.sub) {
        //set_Video(false)
      }
    })
    // eslint-disable-next-line
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.streamContainer} style={{backgroundColor:`${colour}`}}>
        { !_Audio &&
          <div className={styles.muted}><BsIcons.BsMicMuteFill/></div>
        }
        <UserAvatar className={styles.avatar} alt="" id={props.peer.sub}/>
        <p className={styles.username}>{props.peer.username}</p>
      </div>
      <div className={styles.audioContainer}>
        <Audio stream={props.peer.call._remoteStream}/>
      </div>

    </div>
  )
}

function SubChannelVoice(props) {
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
          <FaIcons.FaMicrophone style={{color:`${socketContext._Audio ? "white" : "grey"}`}}/>
        </span>
        <span onClick={socketContext.toggle_Video}>
          <FaIcons.FaCamera style={{color:`${socketContext._Video ? "white" : "grey"}`}}/>
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
