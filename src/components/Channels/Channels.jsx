import React, { useState, useEffect, useContext } from 'react'

// Backend
import { DataStore, SortDirection } from "aws-amplify";
import { AuthContext } from "../../contexts/AuthContext";
import { Channel, SubChannel, SubChannelType, Messages, MessageType } from '../../models';

// Wrappers
import AvatarImg from '../Wrappers/AvatarImg'

// View / Animation / Content
// import { useSpring, animated } from 'react-spring';
import { Redirect } from "react-router-dom";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import '../../css/Channels.css';
import '../../css/Channels-Settings.css';

function ChannelsCreationMenu(props) {
  const context = useContext(AuthContext)

  // State - store
  const [formState, setformState] = useState({})

  async function createChannel() {
    const { name, description } = formState;

    if (name === "") {
      document.getElementById("name-sub").style.color = "red";
    }

    if (description === "") {
      document.getElementById("description-sub").style.color = "red";
    }

    const models = await DataStore.query(Channel);
    for (var i in models) {
      if (models[i].name === name) {
        document.getElementById("name-sub").style.color = "red";
        document.getElementById("name-sub").innerHTML = "There is another channel with that name!"
        return null
      }
    }

    const channel = await DataStore.save(
        new Channel({
        "name": name,
        "description": description,
        "users": [{username: context.user.username, sub: context.user.attributes.sub}]
      })
    );

    await DataStore.save(
      new SubChannel({
        "name": "main",
        "type": SubChannelType.TEXT,
        "users": [{username: context.user.username, sub: context.user.attributes.sub}],
        "channelID": channel.id
      })
    )
  }

  function onChange(e) {
    if (e.target.name === "name") {
      if (e.target.value.length > 20) {
        document.getElementById("name-sub").style.color = "red";
      } else {
        document.getElementById("name-sub").style.color = "grey";
      }
    }
    document.getElementById("name-sub").innerHTML = "Maximum of 20 characters"
    document.getElementById("description-sub").style.color = "grey";

    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div style={{display: `${props._Create ? "block" : "none"}`}}>
      <div className="channels-list-create-menu">
        <h4>Create Channel</h4>
        <hr/>
        <input autoComplete="off" name="name" spellCheck="false" onChange={onChange} type="text" placeholder="Channel name.."/>
        <h6 id="name-sub">Maximum of 20 characters</h6>
        <input autoComplete="off" name="description" spellCheck="false" onChange={onChange} style={{fontSize: "10pt"}} type="text" placeholder="Channel description.."/>
        <h6 id="description-sub">A description for your channel</h6>
        <button onClick={createChannel} style={{width: "100%", marginTop: "3ex"}} className="button-selected">Create Channel</button>
      </div>
    </div>
  )
}

function SubChannelItem(props) {
  const context = useContext(AuthContext)

  // State - view
  const [_Locked, set_Locked] = useState(true)

  useEffect(() => {
    function check_locked() {
      for (var i in props.SubChannel.users) {
        if (props.SubChannel.users[i].sub === context.user.attributes.sub) {
          return false
        }
      }
      return true
    }
    set_Locked(check_locked())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.SubChannel])

  function selectSubChannel() {
    if (!_Locked) { props.set_SubChannel(props.SubChannel) }
  }

  return (
    <div onClick={selectSubChannel} className="chatchannel-container">
      <div className="chatchannel-info">
        { props.SubChannel.type === "TEXT" ?
          <div className={`${ _Locked ? "subchannel-locked" : "" }`}>
            <FaIcons.FaHashtag/>
            { _Locked && <MdIcons.MdLock className="locked-icon"/> }
          </div>
        :
          <div className={`${ _Locked ? "subchannel-locked" : "" }`}>
            <MdIcons.MdMic/>
            { _Locked && <MdIcons.MdLock className="locked-icon"/> }
          </div>
        }
        <h4 className={`${ _Locked ? "subchannel-locked" : "" }`}>{props.SubChannel.name}</h4>
      </div>
    </div>
  )
}

function ChannelContent(props) {
  const context = useContext(AuthContext)

  // State - store
  const [formState, setformState] = useState({})
  const [_Messages, set_Messages] = useState([])
  const [redirect, setredirect] = useState(false)

  useEffect(() => {
    if (context.datastore_ready && props._SubChannel) {
      getMessages()
      const messages_subscription = DataStore.observe(Messages, (message) => message.subchannelID("eq", props._SubChannel.id)).subscribe(() => getMessages())
      return () => {
        messages_subscription.unsubscribe()
      }
    } else {
      set_Messages([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props._SubChannel])

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  async function getMessages() {
    const result = await DataStore.query(Messages, (message) => message.subchannelID("eq", props._SubChannel.id), {
      sort: msg => msg.createdAt(SortDirection.ASCENDING) //SortDirection.DESCENDING
    })
    set_Messages(result)
    console.log("Messages", result)

    if (document.getElementById("message-end") !== null) {
      document.getElementById("message-end").scrollIntoView({ behavior: "smooth" })
    }
  }

  async function sendMessage() {
    const { message } = formState
    const username = context.user.username
    const id = context.user.attributes.sub
    const type = MessageType.TEXT
    const subchannelID = props._SubChannel.id

    if (message === undefined) { return }

    await DataStore.save(
      new Messages({
        "author_username": username,
        "author_id": id,
        "content": message,
        "type": type,
        "subchannelID": subchannelID
      })
    )
    setformState({})
    document.getElementById("message").value = ""
  }

  if (props._Channel === undefined) {
    return (
      <div style={{alignSelf: "center", color: "grey"}} className="channels-chat-title">
        <h4>Select a channel to start talking</h4>
      </div>
    )
  }

  if (redirect) { return <Redirect to={{pathname: "/channels/edit/" + props._Channel.id, state: { id: props._Channel.id}}}/> }

  return (
    <>
      <div className="channels-chat-title">
        <div className="channels-chat-title-head">
          <h2># {props._Channel.name} { props._SubChannel ? <span>{props._SubChannel.name}</span> : <></>}</h2>
          <MdIcons.MdSettings className="channels-settings-cog" onClick={() => setredirect(!redirect)}/>
        </div>
        <h6>{props._Channel.description}</h6>
        <hr/>
      </div>
      <div className="channels-chat-content">
        { _Messages.map((message, index) => {
          let appendPrevious = false
          if (_Messages.at(index - 1).author_id === message.author_id) {
            appendPrevious = true
          }
          return (
            <div key={message.id}>
              { message.author_username === context.user.username &&
                <div key={message.id} className="message">
                  { !appendPrevious ?
                    <div className="message-author">
                      {message.author_username}
                    </div>
                  :
                    <div className="message-author-none"/>
                  }
                  <div className="message-content">
                    <AvatarImg style={{visibility: `${appendPrevious ? "hidden" : "visible"}`}} className="message-content-avatar" alt="" id={message.author_id}/>
                    <div className="message-content-box">
                      {message.content}
                    </div>
                  </div>
                </div>
              }
              { message.author_username !== context.user.username &&
                <div key={message.id} className="message message-from-other">
                  { !appendPrevious ?
                    <div className="message-author">
                      {message.author_username}
                    </div>
                  :
                    <div className="message-author-none"/>
                  }
                  <div className="message-content-from-other">
                    <div className="message-content-box box-from-other">
                      {message.content}
                    </div>
                    <AvatarImg style={{visibility: `${appendPrevious ? "hidden" : "visible"}`}} className="message-content-avatar" alt="" id={message.author_id}/>
                  </div>
                </div>
              }
            </div>
          )
        })}
        <div id="message-end" className="message-end"></div>
      </div>
      { props._SubChannel &&
        <div className="channels-chat-messageform">
          <MdIcons.MdAttachFile style={{marginRight: "0.5ex", color: "rgba(128, 128, 128, 0.6)", fontSize: "15pt", cursor: "pointer"}}/>
          <MdIcons.MdTagFaces style={{color: "rgba(128, 128, 128, 0.6)", fontSize: "15pt", cursor: "pointer"}}/>
          <input autoComplete="off" id="message" name="message" onChange={onChange} type="text" placeholder="Write a message.."/>
          <MdIcons.MdSend onClick={sendMessage} style={{color: "var(--bg-accent)", cursor: "pointer"}}/>
        </div>
      }
    </>
  )
}

function Channels() {
  const context = useContext(AuthContext)

  // State - view
  const [_Channel, set_Channel] = useState()
  const [_SubChannel, set_SubChannel] = useState()

  // State - store
  const [SubChannels, setSubChannels] = useState()

  // State - UI
  const [_Create, set_Create] = useState(false)
  const [_ChatType, set_ChatType] = useState("channels")

  useEffect(() => {
    set_SubChannel(undefined)
  }, [_Channel])

  useEffect(() => {
    if (context.datastore_ready && _Channel) {
      query_subchannels()
      const s_SubChannel = DataStore.observe(SubChannel, (sc) => sc.channelID("eq", _Channel.id)).subscribe(() => query_subchannels())
      return () => {
        s_SubChannel.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.datastore_ready, _Channel])

  function query_subchannels() {
    DataStore.query(SubChannel, (_sc) => _sc.channelID("eq", _Channel.id), {
      sort: s => s.createdAt(SortDirection.ASCENDING)
    }).then((result) => {
      setSubChannels(result)
      console.log("setSubChannels", result)
    })
  }

  if (!context.datastore_ready) { return <Redirect to="/"/> }

  return (
    <div className="channels">
      <div className="channels-container">
        <div className="channels-header">
          <MdIcons.MdContacts style={{color: "var(--bg-accent)"}}/>
          <h2>Channels</h2>
        </div>
        <div className="channels-list">
          <div className="channels-list-head">
            <h4>Chats</h4>
            <MdIcons.MdSearch className="icon-search"/>
            <MdIcons.MdPlaylistAdd className="icon-add" onClick={() => set_Create(!_Create)}/>
          </div>
          <div className="channels-list-menu">
            <button onClick={() => set_ChatType("channels")} className={`unselectable button-${_ChatType === "channels" ? "selected" : "muted"}`}>Channels</button>
            <button onClick={() => set_ChatType("messages")} className={`unselectable button-${_ChatType === "messages" ? "selected" : "muted"}`}>Direct Messages</button>
          </div>
          <div className="channels-list-chats">
            <ul>
              { _ChatType === "channels" ?
                <>
                  { context.channels.map((c) => {
                    return (
                      <li key={c.id}>
                        <div onClick={() => set_Channel(c)} className="chatchannel-container">
                          <div className="chatchannel-info">
                            <FaIcons.FaHashtag style={{color: "#3f3f3f"}}/>
                            <h4>{c.name}</h4>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </>
              :
                <>
                  { context.friends.map((f) => {
                    return (
                      <li key={f.sub}>
                        <h6>{f.username} | {f.sub}</h6>
                      </li>
                    )
                  })}
                </>
              }
            </ul>
          </div>
          <ChannelsCreationMenu _Create={_Create} set_Create={set_Create}/>
        </div>

        <div className="channels-chat">
          <ChannelContent _Channel={_Channel} _SubChannel={_SubChannel}/>
        </div>

        <div className="channels-subchannels">
          <h4 className="subtitle">SUB-CHANNELS</h4>
          { SubChannels !== undefined &&
            <ul>
              { SubChannels.map((sc) => {
                return (
                  <li key={sc.id}>
                    <SubChannelItem SubChannel={sc} set_SubChannel={set_SubChannel}/>
                  </li>
                )
              })}
            </ul>
          }
        </div>
        <div className="channels-members">
          <h4 className="subtitle">MEMBERS</h4>
          <hr style={{marginBottom: "1ex", marginTop: "1ex"}}/>
          <div className="channels-members-user">
            { _Channel !== undefined &&
              <ul>
                { _Channel.users.map((user) => {
                  return (
                    <AvatarImg key={user.sub} style={{marginRight: "0.2ex"}} className="message-content-avatar" alt="" id={user.sub}/>
                  )
                })}
              </ul>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channels
