import React, { useState, useContext, createContext } from 'react'
import { AuthContext } from "../../../contexts/AuthContext";
import styles from './index.module.css'

import ChannelsList from '../ChannelsList/ChannelsList'
import SubchannelsList from '../SubchannelsList/SubchannelsList'
import NewChannel from '../ChannelOverlays/NewChannel/NewChannel'
import SubChannelRenderer from '../SubChannelRenderer/SubChannelRenderer'

export const ChannelsContext = createContext();

function Channels() {
  const context = useContext(AuthContext)

  // Models State
  const [_Channel, set_Channel] = useState()
  const [_SubChannel, set_SubChannel] = useState()
  const [_Direct, set_Direct] = useState()

  // UI State
  const [_ViewType, set_ViewType] = useState("ViewType_Channels") // ViewType_Channels ViewType_Direct
  const [_ViewOverlay, set_ViewOverlay] = useState("ViewOverlay_None") // ViewOverlay_None ViewOverlay_NewChannel

  // Shared state
  var sharedState = {
    _Channel: _Channel,
    set_Channel: set_Channel,
    _SubChannel: _SubChannel,
    set_SubChannel: set_SubChannel,
    set_ViewType: set_ViewType,
    _Direct: _Direct,
    set_Direct: set_Direct,
    set_ViewOverlay: set_ViewOverlay
  };

  if (!context.datastore_ready) { return null }

  return (
    <ChannelsContext.Provider value={sharedState}>
      { _ViewOverlay !== "ViewOverlay_None" &&
        <div className={styles.viewOverlay}>
          { _ViewOverlay === "ViewOverlay_NewChannel" && <NewChannel/> }
        </div>
      }
      <div className={styles.container}>
        <div className={styles.grid}>
          <ChannelsList/>
          <SubchannelsList/>
          { _ViewType === 'ViewType_Channels' && <SubChannelRenderer/> }
        </div>
      </div>
    </ChannelsContext.Provider>
  )
}

export default Channels
