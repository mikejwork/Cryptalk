import React, { useState, useEffect, useContext } from 'react'
import { SubChannel } from '../../models';
import { AuthContext } from "../../contexts/AuthContext";
import { DataStore, SortDirection } from "aws-amplify";
import { Redirect } from "react-router-dom";

import DMListItem from './DMListItem'
import ChannelContent from './ChannelContent'
import ChannelListItem from './ChannelListItem'
import SubchannelListItem from './SubchannelListItem'

import * as HiIcons from "react-icons/hi";
import * as MdIcons from "react-icons/md";
import styles from '../../css/Channels/Channels.module.css';

function Channels() {
  const context = useContext(AuthContext)

  // useState
  const [_Channel, set_Channel] = useState()
  const [_SubChannel, set_SubChannel] = useState()
  const [SubChannels, setSubChannels] = useState()
  const [_ChatType, set_ChatType] = useState("CHANNELS")

  // useEffect(() => {
  //   set_SubChannel(undefined)
  // }, [_Channel])

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

          {/* GROUPS ----------------------------------------------- */}
          <div className={styles.header}>
            <h5 className="subcomment">GROUPS</h5>
            <div className={styles.spacer}/>
            <MdIcons.MdAdd className={styles.icon}/>
          </div>
          { context.channels.map((channel) => {
            return (
              <ChannelListItem data={channel} set_Channel={set_Channel} key={channel.id}/>
            )
          })}

          {/* DIRECT MESSAGES -------------------------------------- */}
          <div className={styles.header}>
            <h5 className="subcomment">DIRECT MESSAGES</h5>
            <div className={styles.spacer}/>
            <MdIcons.MdAdd className={styles.icon}/>
          </div>
          { context.friends.map((friend) => {
            return (
              <DMListItem data={friend} key={friend.sub}/>
            )
          })}
        </div>
        <div className={styles.subTitle}>
          {_SubChannel ?
            <>
              { _SubChannel.type === "TEXT" ? <p><HiIcons.HiHashtag/></p> : <p><HiIcons.HiMicrophone/></p>}
              <div className={styles.subTitleContainer}>
                <h2>{_SubChannel.name}</h2>
                <p>{_SubChannel.users.length} members</p>
              </div>
            </>
          :
            <>
              { _Channel &&
                <>
                  <p><HiIcons.HiHashtag/></p>
                  <div className={styles.subTitleContainer}>
                    <h3>No channel selected</h3>
                    <p>select a channel to start talking</p>
                  </div>
                </>
              }
            </>
          }
        </div>
        <div className={styles.sublist}>
          { SubChannels !== undefined ?
            <>
              {/* TEXT SUB-CHANNELS ------------------------------------ */}
              <div className={styles.header}>
                <h5 className="subcomment">TEXT</h5>
                <div className={styles.spacer}/>
              </div>

              { SubChannels.map((subChannel) => {
                if (subChannel.type !== "TEXT") { return null }
                return (
                  <SubchannelListItem data={subChannel} set_SubChannel={set_SubChannel} key={subChannel.id}/>
                )
              })}

              {/* VOICE SUB-CHANNELS ----------------------------------- */}
              <div className={styles.header}>
                <h5 className="subcomment">VOICE</h5>
                <div className={styles.spacer}/>
              </div>

              { SubChannels.map((subChannel) => {
                if (subChannel.type !== "VOICE") { return null }
                return (
                  <SubchannelListItem data={subChannel} set_SubChannel={set_SubChannel} key={subChannel.id}/>
                )
              })}
            </>
          :
            <div className={styles.noneMsg}>
              <p>No channel selected</p>
            </div>
          }
        </div>
        <div className={styles.contentHead}>
          {/* Empty for now, maybe a user list of avatars? */}
          {/* Timestamp of last activity */}
        </div>
        <div className={styles.content}>
          <ChannelContent data={_SubChannel}/>
        </div>
      </div>
    </div>
  )
}

export default Channels
