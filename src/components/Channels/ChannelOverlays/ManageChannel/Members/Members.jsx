/*
  Author: Michael
  Description:
    This class handels all of the users inside of a channel, this includes
    adding a user, removing and displaying the current and potential users
    inside the channel
  Related PBIs: 8, 19
*/

import React, { useState, useContext } from 'react'
import * as HiIcons from "react-icons/hi";
import styles from './index.module.css'

import UserAvatar from '../../../../Wrappers/Avatar/UserAvatar'
import LoadingPage from '../../../../Wrappers/Loading/Loading'

import { DataStore } from "aws-amplify"
import { Channel } from '../../../../../models';

import { ChannelsContext } from "../../../Channels/Channels";
import { AuthContext } from "../../../../../contexts/AuthContext";

function Members(props) {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)

  const [_Loading, set_Loading] = useState(false)

  //checks for if the user
  function alreadyExists(sub, obj) {
    for (var i in obj.users) {
      if (obj.users[i].sub === sub) {
        return true
      }
    }
    return false
  }

  async function add_user(username, sub) {
    set_Loading(true)
    await DataStore.query(Channel, channelsContext._Channel.id).then(async (result) => {
      if (!alreadyExists(sub, result)) {
        await DataStore.save(Channel.copyOf(result, item => {
          item.users.push({
            username: username,
            sub: sub
          })
        }));
      }
    }).then(() => {
      set_Loading(false)
      context.spawnNotification("SUCCESS", "User added", `User "${username}" added to channel.`);
    });
  }

  async function kick_user(sub) {
    set_Loading(true)

    if (sub === channelsContext._Channel.owner_id) {
      set_Loading(false)
      context.spawnNotification("ERROR", "Error", `Can't kick the channel owner.`);
      return;
    }

    await DataStore.query(Channel, channelsContext._Channel.id).then(async (result) => {
      await DataStore.save(Channel.copyOf(result, item => {
        item.users = []
        for (var i in result.users) {
          if (result.users[i].sub !== sub) {
            item.users.push(result.users[i])
          }
        }
      }));
    }).then(() => {
      set_Loading(false)
      context.spawnNotification("SUCCESS", "User kicked", `User kicked from channel.`);
    });
  }

  if (_Loading) { return <LoadingPage/> }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Channel members</h1>
        <h5>Add new members through your friends list.</h5>
      </div>
      <div>
        <div className={styles.form}>
          <p>Existing users</p>
          <hr/>
          <div className={styles.cardContainer}>
            { channelsContext._Channel.users.map((user) => {
              return (
                <div key={user.sub} className={styles.card} onClick={() => {
                  if (!_Loading) {
                    kick_user(user.sub)
                  }
                }}>
                  <div className={styles.avatar}>
                    <UserAvatar id={user.sub}/>
                  </div>
                  <div className={styles.removeOverlay}><HiIcons.HiMinus/></div>
                  <p>{user.username}</p>
                </div>
              )
            })}
          </div>
          <br/>
          <p>Users to add</p>
          <hr/>
          <div className={styles.cardContainer}>
            { context.friends.map((user) => {

              // If the friend already exists in the channel, ignore
              if (alreadyExists(user.sub, channelsContext._Channel)) { return null }
              return (
                <div key={user.sub}  className={styles.card} onClick={() => {
                  if (!_Loading) {
                    add_user(user.username, user.sub)
                  }
                }}>
                  <UserAvatar id={user.sub}/>
                  <div className={styles.addOverlay}><HiIcons.HiPlus/></div>
                  <p style={{color:"grey"}}>{user.username}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Members
