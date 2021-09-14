import React, { useState, useEffect, useContext } from 'react'

// Backend
import { DataStore, SortDirection } from "aws-amplify";
import { AuthContext } from "../../contexts/AuthContext";
import { Channel, SubChannel, SubChannelType } from '../../models';

// Wrappers
import AvatarImg from '../Wrappers/AvatarImg'

// View / Animation / Content
// import { useSpring, animated } from 'react-spring';
import { Redirect, useParams } from "react-router-dom";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import '../../css/Channels.css';
import '../../css/Channels-Settings.css';

function ChannelSettings(props) {
  const context = useContext(AuthContext)

  // State - storage
  let { channelID } = useParams();
  const [_Channel, set_Channel] = useState()
  const [_SubChannels, set_SubChannels] = useState()

  // State - view
  const [_Tab, set_Tab] = useState()
  const View_Tab = () => {
    switch(_Tab) {
      case "Details":     return <SETTINGS_DETAILS _Channel={_Channel} _SubChannels={_SubChannels}/>;
      case "Channels":    return <SETTINGS_CHANNELS _Channel={_Channel} _SubChannels={_SubChannels}/>;
      case "Permissions": return <SETTINGS_PERMISSIONS _Channel={_Channel} _SubChannels={_SubChannels}/>;
      case "Users":       return <SETTINGS_USERS _Channel={_Channel} _SubChannels={_SubChannels}/>;
      default: return <h6>No page selected</h6>;
    }
  }

  // Channel Listener
  useEffect(() => {
    if (context.datastore_ready) {
      query_channels()
      const s_Channel = DataStore.observe(Channel, (c) => c.id("eq", channelID)).subscribe(() => query_channels())
      return () => {
        s_Channel.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelID, context.datastore_ready])

  // SubChannel Listener
  useEffect(() => {
    if (context.datastore_ready && _Channel) {
      query_subchannels()
      const s_SubChannel = DataStore.observe(SubChannel, (sc) => sc.channelID("eq", _Channel.id)).subscribe(() => query_subchannels())
      return () => {
        s_SubChannel.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Channel])

  function query_channels() {
    DataStore.query(Channel, (c) => c.id("eq", channelID), {
      sort: c => c.createdAt(SortDirection.ASCENDING)
    }).then((result) => {
      set_Channel(result[0])
      console.log("channels", result)
    })
  }

  function query_subchannels() {
    DataStore.query(SubChannel, (sc) => sc.channelID("eq", _Channel.id), {
      sort: s => s.createdAt(SortDirection.ASCENDING)
    }).then((result) => {
      set_SubChannels(result)
      console.log("subchannels", result)
    })
  }

  if (!context.datastore_ready) { return <Redirect to="/"/> }

  return (
    <div className="channel-settings">
      <div className="channel-settings-container">

        <div className="channel-settings-head">
          <MdIcons.MdSettings style={{color: "var(--bg-accent)"}}/>
          <h2>Settings</h2>
        </div>

        <div className="channel-settings-tabs">
          <strong>CHANNEL INFORMATION</strong>
          <span onClick={() => set_Tab("Details")}>Details</span>
          <hr/>
          <strong>CHANNEL MANAGEMENT</strong>
          <span onClick={() => set_Tab("Channels")}>Channels</span>
          <span onClick={() => set_Tab("Permissions")}>Permissions</span>
          <hr/>
          <strong>USER MANAGEMENT</strong>
          <span onClick={() => set_Tab("Users")}>Users</span>
        </div>

        <div className="channel-settings-content">
          <h2>{_Tab}</h2>

          {View_Tab()}

        </div>
      </div>
    </div>
  )
}

function SETTINGS_DETAILS(props) {
  let initialState = {
    name: props._Channel.name,
    description: props._Channel.description
  }

  // State - UI
  const [_UnsavedChanges, set_UnsavedChanges] = useState(false)

  // State - store
  const [formState, setformState] = useState(initialState)

  function creationDate() {
    var date = new Date(props._Channel.createdAt);
    return (<>{ date.getFullYear() }-{ date.getMonth() + 1 }-{ date.getDate() }</>)
  }

  function editedAt() {
    var date = new Date(props._Channel.createdAt);
    return (<>{ 24 - date.getHours() }:{ date.getMinutes() }:{ date.getSeconds() }</>)
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
    set_UnsavedChanges(true)
  }

  function revert_changes() {
    setformState(initialState)
    set_UnsavedChanges(false)
  }

  async function save_changes() {
    const result = await DataStore.save(Channel.copyOf(props._Channel, item => {
      item.name = formState.name
      item.description = formState.description
    }));

    console.log(result)
    set_UnsavedChanges(false)
  }

  return (
    <div className="channel-settings-content-main">
      <div className="channel-settings-content-save">
        <button onClick={revert_changes} style={{opacity: "0.7", color: "#bf2a2aee", border: "1px solid #bf2a2abb", backgroundColor: "#3d1212aa",visibility: `${_UnsavedChanges ? "visible" : "hidden"}`}}>Revert</button>
        <button onClick={save_changes} style={{visibility: `${_UnsavedChanges ? "visible" : "hidden"}`}}>Save changes</button>
      </div>
      <div className="channel-settings-content-field">
        <strong>CHANNEL NAME</strong>
        <input value={formState.name} onChange={onChange} autoComplete="off" name="name" spellCheck="false" type="text" placeholder="Channel name.."/>
      </div>
      <div className="channel-settings-content-field">
        <strong>CHANNEL DESCRIPTION</strong>
        <input value={formState.description} onChange={onChange} autoComplete="off" name="description" spellCheck="false" type="text" placeholder="Channel description.."/>
      </div>
      <div className="channel-settings-content-field">
        <strong>DATE CREATED</strong>
        <h6>{creationDate()}</h6>
      </div>
      <div className="channel-settings-content-field">
        <strong>LAST EDITED</strong>
        <h6>{creationDate()} {editedAt()}</h6>
      </div>
    </div>
  )
}

function SETTINGS_CHANNELS(props) {
  const context = useContext(AuthContext)

  // State - store
  const [formState, setformState] = useState({})

  async function add_channel() {
    if (!formState.name) { return }
    if (formState.name === "") { return }
    if (!formState.type) { return }
    if (!props._Channel) { return }

    await DataStore.save(
      new SubChannel({
        "name": formState.name,
        "type": formState.type === "TEXT" ? SubChannelType.TEXT : SubChannelType.VOICE,
        "users": [{username: context.user.username, sub: context.user.attributes.sub}],
        "channelID": props._Channel.id
      })
    )

    setformState({})
    document.getElementById("name").value = ""
  }

  async function delete_channel(id) {
    DataStore.query(SubChannel, id).then(async (result) => {
      DataStore.delete(result)
    });
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div style={{marginTop: "2ex"}} className="channel-settings-content-main">
      <div className="setKJaw0q-main">
        <div className="setKJaw0q-list">
          { props._SubChannels &&
            <>
              { props._SubChannels.map((sc) => {
                return (
                  <div className="channel-settings-content-subchannel" key={sc.id}>
                    { sc.type === "TEXT" && <FaIcons.FaHashtag className="subchannel-icon"/>}
                    { sc.type === "VOICE" && <MdIcons.MdMic className="subchannel-icon"/>}
                    <p style={{flexGrow: "1"}}>{sc.name}</p>
                    <MdIcons.MdRemove style={{color: "grey", cursor: "pointer"}} onClick={() => delete_channel(sc.id)}/>
                  </div>
                )
              })}
            </>
          }
        </div>
        <div className="setKJaw0q-add">
          <h2>Add channel</h2>
          <hr/>
          <input onChange={onChange} type="text" name="name" id="name" autoComplete="off" spellCheck="false" placeholder="Channel name.."/>
          <div className="setKJaw0q-add-select">
            <div onClick={() => setformState(() => ({...formState, type: "TEXT"}))} className={`setKJaw0q-select-text ${formState.type === "TEXT" ? "setKJaw0q-selected" : ""}`}><FaIcons.FaHashtag style={{marginRight: "0.3ex", fontSize: "10pt"}}/>Text</div>
            <div onClick={() => setformState(() => ({...formState, type: "VOICE"}))} className={`setKJaw0q-select-voice ${formState.type === "VOICE" ? "setKJaw0q-selected" : ""}`}><MdIcons.MdMic/>Voice</div>
          </div>
          <button onClick={add_channel}>Create</button>
        </div>
      </div>
    </div>
  )
}

function SETTINGS_PERMISSIONS(props) {

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
    <div className="channel-settings-content-main">
      <div className="per18kj21-main">
        { props._SubChannels &&
          <>
            { props._SubChannels.map((sc) => {
              return (
                <div key={sc.id}>
                  <div className="channel-settings-content-subchannel">
                    { sc.type === "TEXT" && <FaIcons.FaHashtag className="subchannel-icon"/>}
                    { sc.type === "VOICE" && <MdIcons.MdMic className="subchannel-icon"/>}
                    <p>{sc.name}</p>
                  </div>
                  <div className="per18kj21-userlist">
                    { sc.users.map((user) => {
                      return (
                        <div key={user.sub} className="per18kj21-user">
                          <AvatarImg className="message-content-avatar" alt="user avatar" id={user.sub}/>
                          <MdIcons.MdCheckBox onClick={() => revoke_user(sc.id, user.sub)} style={{marginLeft: "1ex", color: "var(--bg-accent)", cursor: "pointer"}}/>
                          <p>{user.username}: {user.sub}</p>
                        </div>
                      )
                    })}
                    { props._Channel.users.map((user) => {

                      for (var i in sc.users) {
                        if (sc.users[i].sub === user.sub) {
                          return null
                        }
                      }

                      return (
                        <div key={user.sub} className="per18kj21-user">
                          <AvatarImg className="message-content-avatar" alt="user avatar" id={user.sub}/>
                          <MdIcons.MdCheckBoxOutlineBlank onClick={() => grant_user(sc.id, user.username, user.sub)} style={{marginLeft: "1ex", color: "var(--bg-accent)", cursor: "pointer"}}/>
                          <p>{user.username}: {user.sub}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </>
        }
      </div>
    </div>
  )
}

function SETTINGS_USERS(props) {
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
    <div className="channel-settings-content-main">
      <div className="per18kj21-main">
        <div className="per18kj21-userlist">
          { props._Channel &&
            <>
              <h6>Channel users</h6>
              <hr/>
              { props._Channel.users.map((user) => {
                return (
                  <div key={user.sub} className="per18kj21-user">
                    <AvatarImg className="message-content-avatar" alt="user avatar" id={user.sub}/>
                    <MdIcons.MdCheckBox onClick={() => kick_user(user.sub)} style={{marginLeft: "1ex", color: "var(--bg-accent)", cursor: "pointer"}}/>
                    <p>{user.username}: {user.sub}</p>
                  </div>
                )
              })}
              <h6>Friends to add</h6>
              <hr/>
              { context.friends.map((friend) => {
                if (!does_user_exist(friend.sub)) {
                  return (
                    <div key={friend.sub} className="per18kj21-user">
                      <AvatarImg className="message-content-avatar" alt="user avatar" id={friend.sub}/>
                      <MdIcons.MdCheckBoxOutlineBlank onClick={() => add_user(friend.username, friend.sub)} style={{marginLeft: "1ex", color: "var(--bg-accent)", cursor: "pointer"}}/>
                      <p>{friend.username}: {friend.sub}</p>
                    </div>
                  )
                } else {
                  return null
                }
              })}
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default ChannelSettings
