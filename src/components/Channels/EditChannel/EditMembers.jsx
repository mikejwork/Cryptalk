import React, { useContext } from 'react'
import { DataStore } from "aws-amplify";
import { AuthContext } from "../../../contexts/AuthContext";
import { Channel } from '../../../models';
import * as HiIcons from "react-icons/hi";
import AvatarImg from '../../../components/Wrappers/AvatarImg'
import styles from '../../../css/Channels/EditChannel/Edit.module.css';

function EditMembers(props) {
  const context = useContext(AuthContext)

  function does_user_exist(sub) {
    for (var i in props._Channel.users) {
      if (props._Channel.users[i].sub === sub) {
        return true
      }
    }
    return false
  }

  async function add_user(username, sub) {
    await DataStore.query(Channel, props._Channel.id).then(async (result) => {
      await DataStore.save(Channel.copyOf(result, item => {
        item.users.push({
          username: username,
          sub: sub
        })
      }));
    });
  }

  async function kick_user(sub) {
    await DataStore.query(Channel, props._Channel.id).then(async (result) => {
      await DataStore.save(Channel.copyOf(result, item => {
        item.users = []
        for (var i in result.users) {
          if (result.users[i].sub !== sub) {
            item.users.push(result.users[i])
          }
        }
      }));
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Members</h2>
        <h6>View and invite channel members</h6>
        <hr/>
      </div>

      <div className={styles.subContainerDiv}>
        <h6 className={styles.subtitle}>MEMBERS</h6>
        <hr/>
        { props._Channel &&
          <div className={styles.subChannels}>
            { props._Channel.users.map((user) => {
              return (
                <div key={user.sub} className={styles.subChannel}>
                  <AvatarImg className={styles.avatar} alt="user avatar" id={user.sub}/>
                  <p>{user.username}</p>
                  <HiIcons.HiMinusCircle onClick={() => kick_user(user.sub)} style={{marginLeft:"auto", color:"darkred"}}/>
                </div>
              )
            })}
          </div>
        }
        <h6 className={styles.subtitle}>FRIENDS</h6>
        <hr/>
        <div className={styles.subChannels}>
          { context.friends.map((friend) => {
            if (does_user_exist(friend.sub)) { return null }
            return (
              <div key={friend.sub} className={styles.subChannel}>
                <AvatarImg className={styles.avatar} alt="user avatar" id={friend.sub}/>
                <p>{friend.username}</p>
                <HiIcons.HiPlusCircle onClick={() => add_user(friend.username, friend.sub)} style={{marginLeft:"auto", color:"green"}}/>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default EditMembers
