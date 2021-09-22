import React from 'react'
import styles from './index.module.css';
import * as HiIcons from "react-icons/hi";
import UserAvatar from '../../../Wrappers/Avatar/UserAvatar'

function UserProfile(props) {
  return (
    <div className={styles.container}>
      <UserAvatar className={styles.avatar} key={props.data.sub} alt="" id={props.data.sub}/>
      <h2>{props.data.username}</h2>
      <h4>👋🏻 status here</h4>
      <hr/>
      <div className={styles.action}>
        <strong><HiIcons.HiPhoneOutgoing style={{color:"var(--bg-accent)"}}/></strong>
        <p>Voice call</p>
      </div>

       <div className={styles.action}>
        <strong><HiIcons.HiShieldExclamation style={{color:"var(--warning)"}}/></strong>
        <p>Block user</p>
      </div>
      <hr/>
      <div className={styles.other}>
        <button><HiIcons.HiExclamation style={{marginTop: "0.4ex", marginRight: "0.4ex"}}/>Report user</button>
        <button><HiIcons.HiTrash style={{marginTop: "0.4ex", marginRight: "0.4ex"}}/>Delete conversation</button>
      </div>
    </div>
  )
}

export default UserProfile
