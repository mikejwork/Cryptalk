import React, { useContext } from 'react'
import styles from './index.module.css'
import { ChannelsContext } from "../Channels/Channels";

function ChannelsListItem(props) {
  const channelsContext = useContext(ChannelsContext)

  function changeState() {
    channelsContext.set_Channel(props._Channel)
  }

  return (
    <div className={styles.container} onClick={changeState}>
      <div className={styles.channelIcon}>
        {props._Channel.icon}
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>
          <h4>{props._Channel.name}</h4>
        </div>
      </div>
    </div>
  )
}

export default ChannelsListItem
