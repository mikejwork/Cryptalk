/*
  Author: Michael
  Description:
    Sub channel item, when clicked will take the user to that specific sub-channel
  Related PBIs: 13
*/

import React, { useState, useEffect, useContext } from 'react'
import styles from './index.module.css'
import * as HiIcons from "react-icons/hi";

import { ChannelsContext } from "../Channels/Channels";
import { AuthContext } from "../../../contexts/AuthContext";
import { SubChannel } from '../../../models';
import { DataStore } from "aws-amplify";

import UserAvatar from '../../Wrappers/Avatar/UserAvatar'

export function TextChannelItem(props) {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)
  const [_Locked, set_Locked] = useState(true)

  useEffect(() => {
    function check_locked() {
      for (var i in props._SubChannel.users) {
        if (props._SubChannel.users[i].sub === context.user.attributes.sub) {
          return false
        }
      }
      return true
    }
    set_Locked(check_locked())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props._SubChannel])

  function setCurrent() {
    if (!_Locked) {
      channelsContext.set_SubChannel(props._SubChannel)
    }
  }

  return (
    <div className={styles.container} onClick={setCurrent}>
      <div className={styles.channelIcon}>
        { _Locked ?
          <HiIcons.HiLockClosed style={{color:"grey"}}/>
        :
          <HiIcons.HiHashtag/>
        }
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>
          { props._SubChannel.id === channelsContext._SubChannel?.id ?
            <h4 style={{color: "var(--bg-accent)"}}>{props._SubChannel.name}</h4>
          :
            <h4 style={{color: `${_Locked ? "grey" : "white"}`}}>{props._SubChannel.name}</h4>
          }
        </div>
      </div>
    </div>
  )
}

export function VoiceChannelItem(props) {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)
  const [_Locked, set_Locked] = useState(true)
  const [_ConnectedUsers, set_ConnectedUsers] = useState([])

  useEffect(() => {
    getConnectedUsers()
    const s_ConnectedUsers = DataStore.observe(SubChannel, props._SubChannel.id).subscribe(() => getConnectedUsers())
    return () => {
      s_ConnectedUsers.unsubscribe()
    }
    // eslint-disable-next-line
  }, [props._SubChannel.id])

  useEffect(() => {
    function check_locked() {
      for (var i in props._SubChannel.users) {
        if (props._SubChannel.users[i].sub === context.user.attributes.sub) {
          return false
        }
      }
      return true
    }
    set_Locked(check_locked())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props._SubChannel])

  async function getConnectedUsers() {
    DataStore.query(SubChannel, props._SubChannel.id).then((result) => {
      set_ConnectedUsers(result.users_connected)
    })
  }

  function setCurrent() {
    if (!_Locked) {
      channelsContext.set_SubChannel(props._SubChannel)
    }
  }

  return (
    <div className={styles.container} onClick={setCurrent}>
      <div className={styles.channelIcon}>
        { _Locked ?
          <HiIcons.HiLockClosed style={{color:"grey"}}/>
        :
          <HiIcons.HiMicrophone/>
        }
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>
          { props._SubChannel.id === channelsContext._SubChannel?.id ?
            <h4 style={{color: "var(--bg-accent)"}}>{props._SubChannel.name}</h4>
          :
            <h4 style={{color: `${_Locked ? "grey" : "white"}`}}>{props._SubChannel.name}</h4>
          }
        </div>
        <div className={styles.users}>
          { _ConnectedUsers.map((user) => {
            return (
              <UserAvatar className={styles.userAvatar} key={user.sub} id={user.sub}/>
            )
          })}
        </div>
      </div>
    </div>
  )
}
