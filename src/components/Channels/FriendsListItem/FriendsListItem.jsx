import React, { useContext } from 'react'
import UserAvatar from '../../Wrappers/Avatar/UserAvatar'
import { ChannelsContext } from "../Channels/Channels";
import styles from './index.module.css'

function FriendsListItem(props) {
  const channelsContext = useContext(ChannelsContext)

  function changeState() {
    channelsContext.set_ViewType("ViewType_Direct")
    channelsContext.set_Direct(props.friend)
  }

  return (
    <div className={styles.container} onClick={changeState}>
      <div className={styles.channelIcon}>
        <UserAvatar className={styles.avatar} key={props.friend.sub} alt="" id={props.friend.sub}/>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>
          <h4>{props.friend.username}</h4>
        </div>
      </div>
    </div>
  )
}


export default FriendsListItem
