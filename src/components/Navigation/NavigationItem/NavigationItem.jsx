/*
  Author: Michael
  Description:
    Navigation items for links and other dropdown menus
  Related PBIs: nil
*/

import React, { useContext } from 'react'
import styles from './index.module.css';
import { Link } from 'react-router-dom'
import { AuthContext } from "../../../contexts/AuthContext";

import UserAvatar from '../../Wrappers/Avatar/UserAvatar'

function NavigationItem(props) {
  return (
    <div className={styles.containerMenu} onClick={props.onClick} id={props.name === "Logout" ? "cypress-navLogout" : ""}>
      <div className={styles.icon}>
        { props.icon }
      </div>
      <p>{ props.name }</p>
    </div>
  )
}

export function NavigationLink(props) {
  return (
    <Link to={props.destination}>
      <div className={`${props.menu ? styles.containerMenu : styles.container}`} onClick={props.onClick} id={props.name === "Login" ? "cypress-navLogin" : ""}>
        <div className={styles.icon}>
          { props.icon }
        </div>
        <p>{ props.name }</p>
      </div>
    </Link>
  )
}

export function NavigationUser(props) {
  const context = useContext(AuthContext)
  if (!context.datastore_ready) {
    return (
      <div className={styles.userContainer}>
        <div className={styles.avatarContainer}>

        </div>
        <div className={styles.info}>
          <p className={styles.name}>Not logged in!</p>
          <Link to="/authentication" className={styles.link}>click here to login</Link>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.userContainer}>
      <div className={styles.avatarContainer}>
        <UserAvatar className={styles.avatar} id={context.user.attributes.sub}/>
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{context.user.username}</p>
        <Link to="/profile" className={styles.link}>See your profile</Link>
      </div>
    </div>
  )
}

export default NavigationItem
