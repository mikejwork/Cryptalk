/*
  Author: Michael
  Description:
    Called in the direct message overlay, it displays information
    about the friend that the user is sending messages to

  Related PBIs: 14
*/

import React, { useContext, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import styles from './index.module.css'
import * as HiIcons from "react-icons/hi";
import { ChannelsContext } from "../Channels/Channels";
import UserAvatar from '../../Wrappers/Avatar/UserAvatar'

//used to create an animation when hovered over
function ActionButton(props) {
  const [_Hovered, set_Hovered] = useState(false)
  const [anim, api] = useSpring(() => ({
    width: _Hovered ? `100%` : `0%`,
    opacity: _Hovered ? `1` : `0`
  }))

  function hovered(value) {
    set_Hovered(value)
    api.start({
      width: value ? `100%` : `0%`,
      opacity: value ? `1` : `0`
    })
  }

  return (
    <div className={styles.actionButton} onMouseEnter={() => hovered(true)} onMouseLeave={() => hovered(false)}>
      <div className={styles.icon}>
        {props.icon}
      </div>
      <animated.div className={styles.text} style={anim}>
        {props.text}
      </animated.div>
    </div>
  )
}

function DirectUserProfile() {
  const channelsContext = useContext(ChannelsContext)
  //displays user information
  return (
    <>
      <div className={styles.subtitle}/>
      <div className={styles.sublist}>
        <div className={styles.avatar}>
          <UserAvatar className={styles.avatar} key={channelsContext._Direct.sub} alt="" id={channelsContext._Direct.sub}/>
        </div>
        <div className={styles.info}>
          <p>{channelsContext._Direct.username}</p>
          <i>currently online</i>
        </div>
        <div className={styles.actions}>
          <ActionButton icon={<HiIcons.HiPhoneOutgoing style={{color:"var(--bg-accent)"}}/>} text="Start call"/>
          <hr style={{marginTop:"auto"}}/>
          <ActionButton icon={<HiIcons.HiShieldExclamation/>} text="Remove friend"/>
          <ActionButton icon={<HiIcons.HiExclamation/>} text="Report user"/>
          <ActionButton icon={<HiIcons.HiTrash/>} text="Delete conversation"/>
        </div>
      </div>
    </>
  )
}

export default DirectUserProfile
