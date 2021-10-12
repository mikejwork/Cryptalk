import { useEffect, useRef, useContext, createContext, useState } from 'react'

import Peer from 'peerjs'
import io from 'socket.io-client';

import { AuthContext } from "../contexts/AuthContext";

export const SocketContext = createContext();

function SocketHandler(props) {
  const context = useContext(AuthContext)
  const socketRef = useRef();
  const peerRef = useRef();
  const _LocalStream = useRef()
  const [peerData, setpeerData] = useState({})
  const [testData, settestData] = useState({})

  // Stream settings
  // const [_Mic, set_Mic] = useState(true)
  // const [_Vid, set_Vid] = useState(true)

  useEffect(() => {
    if (context.datastore_ready) {
      console.log('[SocketHandler::connect]')

      // Connect to socket
      // ec2-3-24-215-60.ap-southeast-2.compute.amazonaws.com:3333
      // socketRef.current = io.connect(`http://${window.location.hostname}:3333`);
      socketRef.current = io.connect(`ec2-3-24-215-60.ap-southeast-2.compute.amazonaws.com:3333`);

      // Create new peer
      peerRef.current = new Peer(context.user.attributes.sub)

      // Peer events
      peerRef.current.on('open', () => { console.log('[SocketHandler::PeerOpen]') })
      peerRef.current.on('error', (e) => { console.log('[SocketHandler::error]', e) })

      // Get stream then set listeners
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        _LocalStream.current = stream
        _LocalStream.current.getAudioTracks()[0].enabled = false;

        // Listen for incoming calls, answer them and add to peerData
        peerRef.current.on('call', (call) => {
          call.answer(stream)
          call.on('stream', (incoming) => { setpeerData(old => ({ ...old, [call.peer]: incoming })) })
          call.on('close', (e) => { console.log('call closed', e) })
          call.on('error', (e) => { console.log('call error', e) })
          settestData(old => ({ ...old, [call.peer]: call }))
        })

        // When user joins the current room, start a call with the user
        socketRef.current.on('room::userJoined', (user) => {
          const call = peerRef.current.call(user.sub, stream)

          call.on('stream', (incoming) => { setpeerData(old => ({ ...old, [user.sub]: incoming }))})
          call.on('close', (e) => { console.log('call closed', e) })
          call.on('error', (e) => { console.log('call error', e) })
          settestData(old => ({ ...old, [user.sub]: call }))
        })

        // When a user leaves the room
        socketRef.current.on('room::userLeft', (user) => {
          console.log('room::userLeft')
          // Close all calls for that user
          for (let [key, value] of Object.entries(testData)) {
            if (key === user.sub) {
              value.close()
            }
          }

          // Update the peer datastreams
          var tempData = {}
          for (let [key, value] of Object.entries(peerData)) {
            if (key !== user.sub) {
              tempData[key] = value
            }
          }
          setpeerData(tempData)
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.datastore_ready])

  // Functions for when leaving a room, will close all connections and empty
  // the data stream states
  function disconnect(roomID) {
    socketRef.current.emit('room::leave', roomID, { username: context.user.username, sub: context.user.attributes.sub})
    disconnectAllStreams()
  }

  function disconnectAllStreams() {
    //eslint-disable-next-line
    for (let [key, value] of Object.entries(testData)) {
      value.close()
    }
    settestData({})
    setpeerData({})
  }

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      peer: peerRef,
      peerData: peerData,
      testData: testData,
      disconnect: disconnect,
      _LocalStream: _LocalStream
    }}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketHandler


// peerjs --port 4444
// peerRef.current = new Peer(context.user.attributes.sub, {
//   host: '/',
//   port: '4444'
// })
