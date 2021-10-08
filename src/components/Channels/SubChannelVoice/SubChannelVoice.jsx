import React, { useEffect, useContext, useRef, useState } from 'react'
import styles from './index.module.css'
import * as FaIcons from 'react-icons/fa'
import { AuthContext } from '../../../contexts/AuthContext'
import { SocketContext } from '../../../socket/SocketHandler'

// import UserAvatar from '../../Wrappers/Avatar/UserAvatar'

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    ref.current.srcObject = props.stream;
    // eslint-disable-next-line
  }, []);

  return ( <video playsInline autoPlay ref={ref}/> );
}

const Status = (props) => {
  switch(props.status) {
    case "WAITING":
      return (
        <>
          <FaIcons.FaWifi style={{color:"orange"}}/>
          <p style={{margin:"0 0 0 1ex", fontSize:"10pt"}}>Awaiting connection</p>
        </>
      )
    case "CONNECTED":
      return (
        <>
          <FaIcons.FaWifi style={{color:"green"}}/>
          <p style={{margin:"0 0 0 1ex", fontSize:"10pt"}}>Connected to voice</p>
        </>
      )
    default:
      return (
        <>
          <FaIcons.FaWifi style={{color:"red"}}/>
          <p style={{margin:"0 0 0 1ex", fontSize:"10pt"}}>Not connected</p>
        </>
      )
  }
}

function SubChannelVoice(props) {
  const context = useContext(AuthContext)
  const socketContext = useContext(SocketContext)

  const [_Status, set_Status] = useState("")

  useEffect(() => {
    socketContext.socket.emit('room::join', props.id, { username: context.user.username, sub: context.user.attributes.sub})
    set_Status("CONNECTED")
    // eslint-disable-next-line
  }, [props.id])

  const streamList = () => {
    for (let [key, value] of Object.entries(socketContext.peerData)) {
      return (
        <div key={key}>
          <div className={styles.info}>
            <p>Username here</p>
          </div>
          <div className={styles.streamContainer}>
            <Video stream={value}/>
          </div>
        </div>
      )
    }
  }

  return (
    <div className={styles.container}>
      <hr/>
      <div className={styles.menu}>
        {<span>
          <Status status={_Status}/>
        </span>}
        <span>
          <FaIcons.FaMicrophone style={{color:"white"}}/>
        </span>
        <span>
          <FaIcons.FaCamera style={{color:"white"}}/>
        </span>
        <span>
          <FaIcons.FaHeadphonesAlt style={{color:"grey"}}/>
        </span>
      </div>
      <hr/>
      <div className={styles.streams}>
        { streamList() }
      </div>

      {/* <UserAvatar className={styles.avatar} alt="" id="4a857176-e238-4410-9556-ad6ce055177f"/> */}
    </div>
  )
}

export default SubChannelVoice
