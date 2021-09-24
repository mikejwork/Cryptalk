import React, { useContext } from 'react'
import styles from './index.module.css';
import { AuthContext } from "../../../contexts/AuthContext";

import UserAvatar from '../../Wrappers/Avatar/UserAvatar'

function NavigationItem(props) {
  return (
    <div className={styles.container} onClick={props.onClick}>
      <div className={styles.icon}>
        { props.icon }
      </div>
      <p>{ props.name }</p>
    </div>
  )
}

export function NavigationLink(props) {
  return (
    <a href={props.destination}>
      <div className={styles.container} onClick={props.onClick}>
        <div className={styles.icon}>
          { props.icon }
        </div>
        <p>{ props.name }</p>
      </div>
    </a>
  )
}

export function NavigationUser(props) {
  const context = useContext(AuthContext)
  return (
    <div className={styles.userContainer}>
      <div className={styles.avatarContainer}>
        <UserAvatar className={styles.avatar} id={context.user.attributes.sub}/>
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{context.user.username}</p>
        <a href="/profile" className={styles.link}>See your profile</a>
      </div>
    </div>
  )
}

export default NavigationItem
