import React, { useState, useEffect, useContext } from 'react'
import { SubChannel } from '../../models';
import { AuthContext } from "../../contexts/AuthContext";
import { DataStore, SortDirection } from "aws-amplify";
import { Redirect } from "react-router-dom";

import DMListItem from './DMListItem'
import FRListItem from './FRListItem'

import ChannelContent from './ChannelContent'
import ChannelListItem from './ChannelListItem'
import SubchannelListItem from './SubchannelListItem'
import CreateChannel from './CreateChannel'
import UserProfile from './DirectMessaging/UserProfile/UserProfile'
import UserMessages from './DirectMessaging/UserMessages/UserMessages'

import * as HiIcons from "react-icons/hi";
import * as MdIcons from "react-icons/md";
import styles from '../../css/Channels/Channels.module.css';
import { RequestStorage, RequestType, RequestStatus } from '../../models';

function Channels() {
  const context = useContext(AuthContext)

  // useState
  const [_Channel, set_Channel] = useState()
  const [_SubChannel, set_SubChannel] = useState()
  const [SubChannels, setSubChannels] = useState()
  const [_Direct, set_Direct] = useState()
  const [_ChatType, set_ChatType] = useState("CHANNELS")
  const [redirectEdit, setredirectEdit] = useState(false)

  // useEffect(() => {
  //   set_SubChannel(undefined)
  // }, [_Channel])

  const [friend_field, setfriend_field] = useState("")

  async function send_friend_request() {
    const username = friend_field;

    if (username === context.user.username)
      return

    await DataStore.save(
      new RequestStorage({
        "sender_sub": context.user.attributes.sub,
        "sender_username": context.user.username,
        "reciever_username": username,
        "reciever_sub": "",
        "type": RequestType.FRIEND_REQUEST,
        "status": RequestStatus.PENDING
      })
    ).then((result) => {
      setfriend_field("")
    });
  }

  useEffect(() => {
    if (context.datastore_ready && _Channel) {
      set_ChatType("CHANNELS")
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

  if (redirectEdit) { return <Redirect to={{ pathname: "/channels/edit/" + _Channel.id, state: { id: _Channel.id } }} />; }
  if (!context.datastore_ready) { return <Redirect to="/authentication" /> }

  return (
    <div className={styles.channels}>
      <div className={`${_ChatType === "CREATECHANNEL" ? styles.gridContainerPopup : styles.gridContainer}`}>
        <div className={styles.gridTitle}>
          <div className={styles.searchBar}>
            <MdIcons.MdSearch className={styles.icon} />
            <input name="searchFilter" type="text" placeholder="Search.." />
          </div>
        </div>
        <div className={styles.gridList}>
          {/* GROUPS ----------------------------------------------- */}
          <div className={styles.header}>
            <h5 className="subcomment">GROUPS</h5>
            <div className={styles.spacer} />
            <MdIcons.MdAdd className={styles.icon} onClick={() => set_ChatType("CREATECHANNEL")} />
          </div>
          {context.channels.map((channel) => {
            return (
              <ChannelListItem data={channel} set_Channel={set_Channel} key={channel.id} />
            )
          })}

          {/* DIRECT MESSAGES -------------------------------------- */}
          <div className={styles.header}>
            <h5 className="subcomment">FRIENDS</h5>
            <div className={styles.spacer} />
          </div>
          {context.friends.map((friend) => {
            return (
              <DMListItem data={friend} key={friend.sub} set_ChatType={set_ChatType} set_Direct={set_Direct} />
            )
          })}

          {/* ADD FRIEND ----------------------------------------------*/}
          <div className={styles.addFriend}>
            <input name="user-to-add" placeholder="Add a friend.." type="text" value={friend_field} onChange={(e) => { setfriend_field(e.target.value); }} />
            <button onClick={send_friend_request} className={styles.addFriendIcon} ><MdIcons.MdAdd /></button>
          </div>

          {/* FRIEND REQUESTS -------------------------------------- */}
          <div className={styles.header}>
            <h5 className="subcomment">FRIEND REQUESTS</h5>
            <div className={styles.spacer} />
          </div>
          {context.requests.map((request) => {
            return (
              <FRListItem data={request} />
            )
          })}
          



        </div>
        {/* CHATTYPE === CHANNEL */}
        {_ChatType === "CHANNELS" &&
          <>
            <div className={styles.subTitle}>
              {_Channel &&
                <div className={styles.subTitleContainer}>
                  <span>{_Channel.icon}</span> {_Channel.name}
                  <p>{_Channel.description}</p>
                </div>
              }
            </div>
            <div className={styles.sublist}>
              {SubChannels !== undefined ?
                <>
                  {/* TEXT SUB-CHANNELS ------------------------------------ */}
                  <div className={styles.header}>
                    <h5 className="subcomment">TEXT</h5>
                    <div className={styles.spacer} />
                  </div>

                  {SubChannels.map((subChannel) => {
                    if (subChannel.type !== "TEXT") { return null }
                    return (
                      <SubchannelListItem data={subChannel} set_SubChannel={set_SubChannel} key={subChannel.id} />
                    )
                  })}

                  {/* VOICE SUB-CHANNELS ----------------------------------- */}
                  <div className={styles.header}>
                    <h5 className="subcomment">VOICE</h5>
                    <div className={styles.spacer} />
                  </div>

                  {SubChannels.map((subChannel) => {
                    if (subChannel.type !== "VOICE") { return null }
                    return (
                      <SubchannelListItem data={subChannel} set_SubChannel={set_SubChannel} key={subChannel.id} />
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
              {/* TODO: Timestamp of last activity */}
              {/* Reformat to make it look nicer too */}
              {_SubChannel &&
                <>
                  <div className={styles.contentHeadContainer} style={{ width: "100%" }}>
                    {_SubChannel.type === "TEXT" ? <p><HiIcons.HiHashtag /></p> : <p><HiIcons.HiMicrophone /></p>}
                    {_SubChannel.name}
                    <div className={styles.spacer} />
                    <p>{_SubChannel.users.length} member(s)</p>
                  </div>
                </>
              }
              {_Channel &&
                <>
                  {context.user.attributes.sub === _Channel.owner_id &&
                    <>
                      <div className={styles.adminActionsContainer}>
                        <div onClick={() => setredirectEdit(true)}>
                          <p>Edit Channel</p>
                          <HiIcons.HiCog className={styles.editCog} />
                        </div>
                      </div>
                    </>
                  }
                </>
              }
            </div>
            <div className={styles.content}>
              {_SubChannel &&
                <ChannelContent data={_SubChannel} />
              }
            </div>
          </>
        }

        {/* CHATTYPE === DIRECT */}
        {_ChatType === "DIRECT" &&
          <>
            <div className={styles.subTitle} />
            <div className={styles.sublist}>
              <UserProfile data={_Direct} />
            </div>
            <div className={styles.contentHead} />
            <div className={styles.content}>
              <UserMessages data={_Direct} />
            </div>
          </>
        }

        {_ChatType === "CREATECHANNEL" &&
          <div className={styles.gridPopup}>
            <CreateChannel set_ChatType={set_ChatType} />
          </div>
        }
      </div>
    </div>
  )
}

export default Channels
