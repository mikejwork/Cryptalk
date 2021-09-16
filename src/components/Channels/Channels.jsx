import React, { useState, useEffect, useContext } from 'react'
import { Channel, SubChannel, SubChannelType, Messages, MessageType } from '../../models';
import { AuthContext } from "../../contexts/AuthContext";
import { DataStore, SortDirection } from "aws-amplify";
import { Redirect } from "react-router-dom";

import DMListItem from './DMListItem'
import ChannelListItem from './ChannelListItem'

import * as MdIcons from "react-icons/md";
import styles from '../../css/Channels/Channels.module.css';

function Channels() {
  const context = useContext(AuthContext)

  // useState
  const [_Channel, set_Channel] = useState()
  const [_SubChannel, set_SubChannel] = useState()
  const [SubChannels, setSubChannels] = useState()
  const [_ChatType, set_ChatType] = useState("CHANNELS")

  // useEffect
  useEffect(() => {
    set_SubChannel(undefined)
  }, [_Channel])

  useEffect(() => {
    if (context.datastore_ready && _Channel) {
      get_subChannels()
      const s_SubChannel = DataStore.observe(SubChannel, (sc) => sc.channelID("eq", _Channel.id)).subscribe(() => get_subChannels())
      return () => {
        s_SubChannel.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.datastore_ready, _Channel])

  async function get_subChannels() {
    DataStore.query(SubChannel, (_sc) => _sc.channelID("eq", _Channel.id), {
      sort: s => s.createdAt(SortDirection.ASCENDING)
    }).then((result) => {
      setSubChannels(result)
    });
  }

  if (!context.datastore_ready) { return <Redirect to="/authentication"/> }

  if (_ChatType === "DIRECT") {
    return (
      <div className={styles.channels}>
        <div className={styles.gridContainer}>
          <div className={styles.gridTitle}>
            <h1>Direct Messages</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.channels}>
      <div className={styles.gridContainer}>
        <div className={styles.gridTitle}>
          <div className={styles.searchBar}>
            <MdIcons.MdSearch className={styles.icon}/>
            <input name="searchFilter" type="text" placeholder="Search.."/>
          </div>
        </div>
        <div className={styles.gridList}>

          <div className={styles.header}>
            <h5 className="subcomment">GROUPS</h5>
            <div className={styles.spacer}/>
            <MdIcons.MdAdd className={styles.icon}/>
          </div>
          { context.channels.map((channel) => {
            // Current selection highlighting
            var selected = false
            if (channel === _Channel) {
              selected = true
            }
            return (
              <ChannelListItem data={channel} selected={selected} set_Channel={set_Channel}/>
            )
          })}

          <div className={styles.header}>
            <h5 className="subcomment">DIRECT MESSAGES</h5>
            <div className={styles.spacer}/>
            <MdIcons.MdAdd className={styles.icon}/>
          </div>
          { context.friends.map((friend) => {
            return (
              <DMListItem data={friend}/>
            )
          })}

        </div>
      </div>
    </div>
  )
}

export default Channels
