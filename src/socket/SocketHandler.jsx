import { useEffect, useRef, useContext, createContext, useState } from 'react'

import Peer from 'peerjs'
import io from 'socket.io-client';

import { AuthContext } from "../contexts/AuthContext";

export const SocketContext = createContext();

function SocketHandler(props) {
  const context = useContext(AuthContext)
  const socketRef = useRef();
  const peerRef = useRef();
  const [peerData, setpeerData] = useState({})

  // Stream settings
  // const [_Mic, set_Mic] = useState(true)
  // const [_Vid, set_Vid] = useState(true)

  useEffect(() => {
    if (context.datastore_ready) {
      console.log('[SocketHandler::connect]')

      // Connect to socket
      socketRef.current = io.connect(`http://${window.location.hostname}:3333`);

      peerRef.current = new Peer(context.user.attributes.sub)

      peerRef.current.on('open', () => {
        console.log('[SocketHandler::PeerOpen] ' + peerRef.current.id)
      })

      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((stream) => {
        peerRef.current.on('call', (call) => {
          call.answer(stream)

          call.on('stream', (incoming) => {
            console.log('callstream:answered')
            // peerData.current[call.peer] = incoming
            setpeerData(old => ({
              ...old,
              [call.peer]: incoming
            }))
          })
          console.log("CALL", call)
        })

        // When user joins the current room, start a call with the user
        socketRef.current.on('room::userJoined', (user) => {
          const call = peerRef.current.call(user.sub, stream)

          call.on('stream', (incoming) => {
            console.log('callstream')
            // peerData.current[user.sub] = incoming
            setpeerData(old => ({
              ...old,
              [user.sub]: incoming
            }))
          })
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.datastore_ready])

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      peer: peerRef,
      peerData: peerData
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
