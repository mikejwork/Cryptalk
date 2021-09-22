import React from 'react'
import UserAvatar from '../Wrappers/Avatar/UserAvatar'
import styles from '../../css/Channels/DMListItem.module.css';

function DMListItem(props) {
  return (
    <div className={styles.container} onClick={() => props.set_ChatType("DIRECT")}>
      <div className={styles.channelIcon}>
        <UserAvatar className={styles.avatar} key={props.data.sub} alt="" id={props.data.sub}/>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>
          <h4>{props.data.username}</h4>
        </div>
      </div>
    </div>
  )
}

export default DMListItem
