import React, { useState, useContext, createContext, useEffect } from 'react'
import { AuthContext } from "../../../contexts/AuthContext";
import styles from './index.module.css'

import ChannelsList from '../ChannelsList/ChannelsList'
import SubchannelsList from '../SubchannelsList/SubchannelsList'
import NewChannel from '../ChannelOverlays/NewChannel/NewChannel'
import ManageChannel from '../ChannelOverlays/ManageChannel/ManageChannel'
import SubChannelRenderer from '../SubChannelRenderer/SubChannelRenderer'
import DirectRenderer from '../DirectRenderer/DirectRenderer'
import DirectUserProfile from '../DirectUserProfile/DirectUserProfile'

import { Channel } from '../../../models';
import { DataStore } from "aws-amplify";

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

  useEffect(() => {
    if (context.datastore_ready && _Channel) {
      get_Channel()
      const s_Channel = DataStore.observe(Channel, _Channel.id).subscribe(() => get_Channel())
      return () => {
        s_Channel.unsubscribe()
      }
    }
    // eslint-disable-next-line
  }, [context.datastore_ready, _Channel])

  async function get_Channel() {
    DataStore.query(Channel, _Channel.id).then((result) => {
      set_Channel(result)
    });
  }

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
          { _ViewOverlay === "ViewOverlay_ManageChannel" && <ManageChannel/> }
        </div>
      }
      <div className={styles.container} id="cypress-channelsPage">
        <div className={styles.grid}>
          <ChannelsList/>
          { _ViewType === 'ViewType_Channels' && <SubchannelsList/> }
          { _ViewType === 'ViewType_Channels' && <SubChannelRenderer/> }

          { _ViewType === 'ViewType_Direct' && <DirectUserProfile/> }
          { _ViewType === 'ViewType_Direct' && <DirectRenderer/> }
        </div>
      </div>
    </ChannelsContext.Provider>
  )
}

export default Channels
