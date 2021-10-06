import React, { useContext, useEffect, useState, useRef } from 'react'
import styles from './index.module.css'

import Peer from "simple-peer";

import { AuthContext } from "../../../contexts/AuthContext";
import { ChannelsContext } from "../Channels/Channels";
import { SubChannel, SendSignal, ReturnSignal, Signal } from '../../../models';
import { DataStore } from "aws-amplify";

const ContentHandler = (props) => {
  const videoRef = useRef();

  useEffect(() => {
    props.peer.on("stream", stream => {
      console.log('peerstream')
      videoRef.current.srcObject = stream;
    })
    // eslint-disable-next-line
  }, [])

  return (
    <video playsInline autoPlay ref={videoRef}/>
  )
}

function SubChannelVoice() {
  const context = useContext(AuthContext);
  const channelsContext = useContext(ChannelsContext)
  const [_Ready, set_Ready] = useState(false)

  // stores user objects for error handling
  var _Peers = [];
  // stores user objects + peer data for audio and video
  const _PeersData = useRef([])

  const myOutput = useRef()
  var _MyStream = null;

  useEffect(() => {
    if (_Ready) {
      join()
      return async () => { await leave() }
    }
    // eslint-disable-next-line
  }, [_Ready])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then(streamMedia).catch(() => {})
    // eslint-disable-next-line
  }, [])

  function streamMedia(stream) {
    _MyStream = stream
    myOutput.current.srcObject = stream;
    console.log('[_MyStream::set]')
    set_Ready(true)
  }

  useEffect(() => {
    if (_Ready) {
      getConnectedUsers()
      getSentSignals()
      getReturnSignals()
      const s_ConnectedUsers = DataStore.observe(SubChannel, channelsContext._SubChannel.id).subscribe(() => getConnectedUsers())
      const s_SentSignals = DataStore.observe(SendSignal, (signal) => signal.recipientId("eq", context.user.attributes.sub)).subscribe(() => getSentSignals())
      const s_ReturnSignals = DataStore.observe(ReturnSignal, (signal) => signal.recipientId("eq", context.user.attributes.sub)).subscribe(() => getReturnSignals())
      return () => {
        s_ConnectedUsers.unsubscribe()
        s_SentSignals.unsubscribe()
        s_ReturnSignals.unsubscribe()
      }
    }

    // eslint-disable-next-line
  }, [channelsContext._SubChannel.id, _Ready])

  async function getSentSignals() {
    DataStore.query(SendSignal,
      (signal) => signal.recipientId("eq", context.user.attributes.sub)).then(async (result) => {
        if (result.length > 0) {
          console.log('[signal::recieved]', result)

          const newPeer = new Peer({
            initiator: false,
            trickle: false,
            stream: _MyStream
          });

          // Once signal obtained, send back to the original sender with our signal attatched
          newPeer.on('signal', async (signal) => {
            console.log('[returnSignal::signal]', signal)
            // Get sdp signal, create new
            await DataStore.save(
              new ReturnSignal({
                "callerId": context.user.attributes.sub,
                "recipientId": result[0].callerId,
                "signal": new Signal({
                  "type": signal.type,
                  "sdp": signal.sdp
                })
              })
            ).then(() => console.log('[returnSignal::signal::sent]'))
          })

          // Add signal to newly created peer
          newPeer.signal(result[0].signal)
          _PeersData.current.push({ peer: newPeer, user: result[0].callerId})

          // Cleanup and delete signal
          const modelToDelete = await DataStore.query(SendSignal, result[0].id);
          DataStore.delete(modelToDelete);
        }
    })
  }

  async function getReturnSignals() {
    DataStore.query(ReturnSignal,
      (signal) => signal.recipientId("eq", context.user.attributes.sub)).then(async (result) => {
        if (result.length > 0) {
          console.log('[signal::returned]', result)

          const item = _PeersData.current.find(peer => peer.user === result[0].callerId);
          console.log('[signal::returned::itemFound]', item)

          item.peer.signal(result[0].signal)

          // Cleanup and delete signal
          const modelToDelete = await DataStore.query(ReturnSignal, result[0].id);
          DataStore.delete(modelToDelete);
        }
    })
  }

  async function userConnected(user) {
    console.log(`${user.username} connecting..`)
    _Peers.push(user)
    console.log('[userConnected::creatingPeer]')

    const newPeer = new Peer({
      initiator: true,
      trickle: false,
      stream: _MyStream
    });

    newPeer.on('signal', async (signal) => {
      console.log('[userConnected::signal::obtained]')
      // Get sdp signal, create new
      await DataStore.save(
        new SendSignal({
          "callerId": context.user.attributes.sub,
          "recipientId": user.sub,
          "signal": new Signal({
            "type": signal.type,
            "sdp": signal.sdp
          })
        })
      ).then(() => console.log('[userConnected::signal::sent]'))
    })

    _PeersData.current.push({ peer: newPeer, user: user.sub})
  }

  async function userLeft(user) {
    console.log(`${user.username} leaving..`)
    _Peers = _Peers.filter(peer => peer.sub !== user.sub)
    // console.log("_Peers", _Peers)
  }

  async function getConnectedUsers() {
    DataStore.query(SubChannel, channelsContext._SubChannel.id).then((result) => {

      _Peers.forEach((existingUser) => {
        var stillConnected = false
        result.users_connected.forEach((newUser) => {
          if (newUser.sub === existingUser.sub) { stillConnected = true }
        })
        if (!stillConnected) {
          userLeft(existingUser)
        }
      })

      result.users_connected.forEach((newUser) => {
        var alreadyExists = false
        _Peers.forEach((existingUser) => {
          if (existingUser.sub === newUser.sub) { alreadyExists = true }
        })
        if (!alreadyExists && newUser.sub !== context.user.attributes.sub) {
          userConnected(newUser)
        }
      })
      // set_ConnectedUsers(result.users_connected)
    })
  }

  async function join() {
    await DataStore.query(SubChannel, channelsContext._SubChannel.id).then((result) => {
      DataStore.save(SubChannel.copyOf(result, item => {
        const filtered = item.users_connected.filter(user => user.sub === context.user.attributes.sub);
        if (filtered.length === 0) {
          item.users_connected.push({
            username: context.user.username,
            sub: context.user.attributes.sub
          });
        }
      }));
    });
  }

  async function leave() {
    await DataStore.query(SubChannel, channelsContext._SubChannel.id).then((result) => {
      DataStore.save(SubChannel.copyOf(result, item => {
        item.users_connected = item.users_connected.filter(user => user.sub !== context.user.attributes.sub);
      }));
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.localView}>
        <video ref={myOutput} autoPlay playsInline muted/>
      </div>

      <button onClick={() => console.log(_PeersData.current)}>PrintRef</button>
      { _PeersData.current.map((peer, index) => {
        return (
          <div key={index}>
            {index}
            <ContentHandler peer={peer.peer}/>
          </div>
        )
      })}
    </div>
  )
}

export default SubChannelVoice
