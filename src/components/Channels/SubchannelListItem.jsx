import React, { useContext, useState, useEffect } from 'react'
import * as HiIcons from "react-icons/hi";
import { AuthContext } from "../../contexts/AuthContext";
import styles from '../../css/Channels/SubchannelListItem.module.css';

function SubchannelListItem(props) {
  const context = useContext(AuthContext)

  // State - view
  const [_Locked, set_Locked] = useState(true)

  useEffect(() => {
    function check_locked() {
      for (var i in props.data.users) {
        if (props.data.users[i].sub === context.user.attributes.sub) {
          return false
        }
      }
      return true
    }
    set_Locked(check_locked())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data])

  function selectSubChannel() {
    // Have to check if the channel is locked first
    if (!_Locked) { props.set_SubChannel(props.data) }
  }

  return (
    <div className={styles.container} onClick={selectSubChannel}>
      <div className={styles.channelIcon}>
        { _Locked ?
          <>
            <HiIcons.HiLockClosed style={{color:"grey"}}/>
          </>
        :
          <>
            { props.data.type === "TEXT" ? <HiIcons.HiHashtag/> : <HiIcons.HiMicrophone/>}
          </>
        }
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>
          <h4 style={{color: `${_Locked ? "grey" : "white"}`}}>{props.data.name}</h4>
        </div>
      </div>
    </div>
  )
}

export default SubchannelListItem
