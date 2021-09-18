import React from 'react'
import { DataStore } from "aws-amplify";
import { SubChannel } from '../../../models';
import * as HiIcons from "react-icons/hi";
import AvatarImg from '../../../components/Wrappers/AvatarImg'
import styles from '../../../css/Channels/EditChannel/Edit.module.css';

function EditPermissions(props) {
  async function grant_user(subChannelID, username, sub) {
    await DataStore.query(SubChannel, subChannelID).then(async (result) => {
      await DataStore.save(SubChannel.copyOf(result, item => {
        item.users.push({
          username: username,
          sub: sub
        })
      }));
    });
  }

  async function revoke_user(subChannelID, sub) {
    await DataStore.query(SubChannel, subChannelID).then(async (result) => {
      await DataStore.save(SubChannel.copyOf(result, item => {
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
        <h2>Permissions</h2>
        <h6>View subchannels and edit member permissions</h6>
        <hr/>
      </div>

      <div className={styles.subContainerDiv}>
        <h6 className={styles.subtitle}>SUBCHANNELS</h6>
        <hr/>
        { props._Channel &&
          <div className={styles.subChannels}>
            { props._SubChannels.map((subchannel) => {
              return (
                <>
                  <div key={subchannel.id} className={styles.subChannel}>
                    { subchannel.type === "TEXT" ? <HiIcons.HiHashtag/> : <HiIcons.HiMicrophone/>}
                    <p>{subchannel.name}</p>
                  </div>
                  { subchannel.users.map((user) => {
                    return (
                      <div style={{padding: "0.5ex", backgroundColor:"var(--bg-darker)", margin:"0ex 0ex 1ex 10ex"}} key={user.sub} className={styles.subChannel}>
                        <AvatarImg className={styles.avatar} alt="user avatar" id={user.sub}/>
                        <p>{user.username}</p>
                        <HiIcons.HiMinusCircle onClick={() => revoke_user(subchannel.id, user.sub)} style={{marginLeft:"auto", color:"darkred"}}/>
                      </div>
                    )
                  })}
                  { props._Channel.users.map((user) => {
                    for (var i in subchannel.users) {
                      if (subchannel.users[i].sub === user.sub) {
                        return null
                      }
                    }
                    return (
                      <div style={{padding: "0.5ex", backgroundColor:"var(--bg-darker)", margin:"0ex 0ex 1ex 10ex"}} key={user.sub} className={styles.subChannel}>
                        <AvatarImg className={styles.avatar} alt="user avatar" id={user.sub}/>
                        <p>{user.username}</p>
                        <HiIcons.HiPlusCircle onClick={() => grant_user(subchannel.id, user.username, user.sub)} style={{marginLeft:"auto", color:"green"}}/>
                      </div>
                    )
                  })}
                  <hr/>
                </>
              )
            })}
          </div>
        }
      </div>
    </div>
  )
}

export default EditPermissions
