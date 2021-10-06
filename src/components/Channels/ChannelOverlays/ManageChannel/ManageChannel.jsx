import React, { useState, useEffect, useContext } from 'react'

import { ChannelsContext } from "../../Channels/Channels";
import { AuthContext } from "../../../../contexts/AuthContext";

import styles from './index.module.css'
import { useSpring, animated } from 'react-spring'

import Details from './Details/Details'
import Members from './Members/Members'
import Permissions from './Permissions/Permissions'
import Subchannels from './Subchannels/Subchannels'

function ManageChannel() {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)

  const [_Current, set_Current] = useState("DETAILS")

  const [anim, api] = useSpring(() => ({
    opacity: `0`
  }))

  useEffect(() => {
    api.start({opacity:`1`})
    return () => {api.start({opacity:`0`})}
    // eslint-disable-next-line
  }, [])

  async function close() {
    await api.start({
      opacity:`0`,
      config: {
        duration: 100
      },
      onRest: () => channelsContext.set_ViewOverlay("ViewOverlay_None")
    })
  }

  const currentTab = () => {
    switch(_Current) {
      case "DETAILS":
        return <Details close={close}/>;
      case "MEMBERS":
        return <Members close={close}/>;
      case "PERMS":
        return <Permissions close={close}/>;
      case "SUBS":
        return <Subchannels close={close}/>;
      default:
        return null;
    }
  }

  if (channelsContext?._Channel?.owner_id !== context.user.attributes.sub) { return null }

  return (
    <>
      <animated.div style={anim} className={styles.container}>
        <div className={styles.tabs}>
          <button className={`${_Current === "DETAILS" && styles.current}`} onClick={() => set_Current("DETAILS")}>🖊️ Channel details</button>
          <button className={`${_Current === "PERMS" && styles.current}`} onClick={() => set_Current("PERMS")}>🔧 Channel permissions</button>
          <button className={`${_Current === "MEMBERS" && styles.current}`} onClick={() => set_Current("MEMBERS")}>👥 Channel members</button>
          <button className={`${_Current === "SUBS" && styles.current}`} onClick={() => set_Current("SUBS")}>💬 Subchannels</button>
          <button className={styles.close} onClick={close}>Close</button>
        </div>
        <div className={styles.content}>
          { currentTab() }
        </div>
      </animated.div>

    </>
  )
}

export default ManageChannel
