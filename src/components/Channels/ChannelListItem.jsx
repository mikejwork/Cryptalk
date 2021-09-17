import React from 'react'
import * as MdIcons from "react-icons/md";
import styles from '../../css/Channels/ChannelListItem.module.css';

function ChannelListItem(props) {
  return (
    <div className={styles.container} onClick={() => props.set_Channel(props.data)}>
      <div className={styles.channelIcon}>
        <MdIcons.MdQuestionAnswer/>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>
          <h4>{props.data.name}</h4>
        </div>
      </div>
    </div>
  )
}

export default ChannelListItem
