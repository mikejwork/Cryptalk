/*
  Author: Michael
  Description:
    Class is used to grant/revoke users permissions towards each channel and subchannel

  Related PBIs: 8, 19
*/


import React, { useState, useContext, useEffect } from 'react'
import * as HiIcons from "react-icons/hi";
import styles from './index.module.css'

import UserAvatar from '../../../../Wrappers/Avatar/UserAvatar'

import { DataStore, SortDirection } from "aws-amplify";
import { SubChannel } from '../../../../../models';

import { ChannelsContext } from "../../../Channels/Channels";
import { AuthContext } from "../../../../../contexts/AuthContext";

function Permissions() {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)

  const [_Subchannels, set_Subchannels] = useState([])

  //initally gets all subchannels within the channel to display
  useEffect(() => {
    if (channelsContext._Channel) {
      getSubchannels()
      const s_Channel = DataStore.observe(SubChannel, (s) => s.channelID("eq", channelsContext._Channel.id)).subscribe(() => getSubchannels())
      return () => {
        s_Channel.unsubscribe()
      }
    }
    // eslint-disable-next-line
  }, [channelsContext._Channel])

  async function getSubchannels() {
    //queries the database for a match on channelID's
    DataStore.query(SubChannel, (s) => s.channelID("eq", channelsContext._Channel.id), {
      sort: s => s.createdAt(SortDirection.ASCENDING)
    }).then((result) => {
      set_Subchannels(result)
    })
  }

  //function created to allow users acess to the passed subchannel
  async function grant_user(subChannelID, username, sub) {
    await DataStore.query(SubChannel, subChannelID).then(async (result) => {
      //saves and pushes changes to the subchannel
      await DataStore.save(SubChannel.copyOf(result, item => {
        item.users.push({
          username: username,
          sub: sub
        })
      }));
    });
    context.spawnNotification("SUCCESS", "Access granted", `Updated user "${username}" permissions".`);
  }

  //function created to remove users acess to the passed subchannel
  async function revoke_user(subChannelID, sub) {
    await DataStore.query(SubChannel, subChannelID).then(async (result) => {
      await DataStore.save(SubChannel.copyOf(result, item => {
        item.users = []
        //loops through all users in subchannel, and if not desired user to kick, they are re-added
        for (var i in result.users) {
          if (result.users[i].sub !== sub) {
            item.users.push(result.users[i])
          }
        }
      }));
    });
    context.spawnNotification("SUCCESS", "Access revoked", `Updated users permissions".`);
  }


  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Channel permissions</h1>
        <h5>Permit user-by-user access to sub-channels.</h5>
      </div>
      <div className={styles.scrollable}>
        <div className={styles.form}>
          {_Subchannels.map((subchannel) => {
            return (
              <React.Fragment key={subchannel.id}>
                <p>{ subchannel.type === "TEXT" ? <HiIcons.HiHashtag/> : <HiIcons.HiMicrophone/>}&nbsp;{subchannel.name}</p>
                <hr/>
                <div className={styles.cardContainer}>
                  {/* Loops through users that ARE in the channel, and if button is clicked, they will be removed */}

                  { subchannel.users.map((user) => {
                    return (
                      <div key={user.sub} className={styles.card}>
                        <div className={styles.avatar}>
                          <UserAvatar id={user.sub}/>
                        </div>
                        <div className={styles.removeOverlay} onClick={() => revoke_user(subchannel.id, user.sub)}><HiIcons.HiMinus/></div>
                        <p>{user.username}</p>
                      </div>
                    )
                  })}
                  {/* Loops through users that are NOT in the channel yet, and if add button click, they will be added */}
                  { channelsContext._Channel.users.map((user) => {

                    if (subchannel.users.filter(u => u.sub === user.sub).length > 0) { return null }
                    return (
                      <div key={user.sub} className={styles.card}>
                        <div className={styles.avatar}>
                          <UserAvatar id={user.sub}/>
                        </div>
                        <div className={styles.addOverlay} onClick={() => grant_user(subchannel.id, user.username, user.sub)}><HiIcons.HiPlus/></div>
                        <p style={{color:"grey"}}>{user.username}</p>
                      </div>
                    )
                  })}
                </div>
              </React.Fragment>
            )
          })}

        </div>
      </div>
    </div>
  )
}

export default Permissions
