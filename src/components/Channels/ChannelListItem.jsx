import React, { useState, useEffect, useContext } from 'react'

import * as HiIcons from "react-icons/hi";
import styles from '../../css/Channels/ChannelListItem.module.css';

function ChannelListItem(props) {
  return (
    <div className={styles.container} onClick={() => props.set_Channel(props.data)}>
      <div className={styles.channelIcon}>
        <HiIcons.HiHashtag/>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name} style={{color: `${props.selected ? "white" : "rgb(168, 168, 168)"}`}}>
          <h4>{props.data.name}</h4>
        </div>
      </div>
    </div>
  )
}

export default ChannelListItem
