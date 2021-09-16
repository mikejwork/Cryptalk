import React, { useState, useEffect, useContext } from 'react'

import AvatarImg from '../Wrappers/AvatarImg'

import * as MdIcons from "react-icons/md";
import * as HiIcons from "react-icons/hi";
import styles from '../../css/Channels/DMListItem.module.css';

function DMListItem(props) {
  return (
    <div className={styles.container}>
      <div className={styles.channelIcon}>
        <AvatarImg className={styles.avatar} key={props.data.sub} alt="" id={props.data.sub}/>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name} style={{color: `${props.selected ? "white" : "rgb(168, 168, 168)"}`}}>
          <h4>{props.data.username}</h4>
        </div>
      </div>
    </div>
  )
}

export default DMListItem
