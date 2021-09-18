import React, { useContext, useState, useEffect } from 'react'
import { useParams, Redirect } from "react-router-dom";
import { DataStore, SortDirection } from "aws-amplify";
import { AuthContext } from "../../../contexts/AuthContext";
import { Channel, SubChannel } from '../../../models';

import EditDetails from './EditDetails'
import EditMembers from './EditMembers'
import EditChannels from './EditChannels'
import EditPermissions from './EditPermissions'

import styles from '../../../css/Channels/EditChannel/EditChannel.module.css';

function ListItem(props) {
  return (
    <div className={styles.itemContainer} onClick={() => props.set_Tab(props.name)}>
      <div className={styles.itemIcon}>
        {props.icon}
      </div>
      <div className={styles.itemInfo}>
        <div className={styles.name}>
          <h4>{props.name}</h4>
        </div>
      </div>
    </div>
  )
}

function EditChannel() {
  const context = useContext(AuthContext)

  // State
  let { channelID } = useParams();
  const [_Channel, set_Channel] = useState()
  const [_SubChannels, set_SubChannels] = useState()
  const [invalid, setinvalid] = useState(false)
  const [_Tab, set_Tab] = useState("Details")
  const View_Tab = () => {
    switch(_Tab) {
      case "Details":     return <EditDetails _Channel={_Channel} _SubChannels={_SubChannels}/>;
      case "Permissions": return <EditPermissions _Channel={_Channel} _SubChannels={_SubChannels}/>;
      case "Members":     return <EditMembers _Channel={_Channel} _SubChannels={_SubChannels}/>;
      case "Channels":    return <EditChannels _Channel={_Channel} _SubChannels={_SubChannels}/>;
      default: return;
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
      if (result.length === 0) {
        setinvalid(true)
      }
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
  if (invalid) { return <Redirect to="/channels"/> }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3>Channel management</h3>

        <br/>
        <div className={styles.header}>
          <h5 className="subcomment">CHANNEL INFORMATION</h5>
          <div className={styles.spacer}/>
        </div>

        <ListItem name="Details" icon="🖊️" set_Tab={set_Tab}/>

        <br/>
        <div className={styles.header}>
          <h5 className="subcomment">CHANNEL MANAGEMENT</h5>
          <div className={styles.spacer}/>
        </div>

        <ListItem name="Channels" icon="💬" set_Tab={set_Tab}/>
        <ListItem name="Permissions" icon="🔧" set_Tab={set_Tab}/>

        <br/>
        <div className={styles.header}>
          <h5 className="subcomment">MEMBER MANAGEMENT</h5>
          <div className={styles.spacer}/>
        </div>

        <ListItem name="Members" icon="👥" set_Tab={set_Tab}/>

      </div>
      <div className={styles.page}>
        { _Channel &&
          <>
            { View_Tab() }
          </>
        }
      </div>

    </div>
  )
}

export default EditChannel
