import { useEffect, useRef, useContext, createContext } from 'react'

import io from 'socket.io-client';

import { AuthContext } from "../contexts/AuthContext";

export const SocketContext = createContext();

function SocketHandler(props) {
  const context = useContext(AuthContext)
  const socketRef = useRef();

  useEffect(() => {
    if (context.datastore_ready) {
      console.log('[SocketHandler::connect]')

      socketRef.current = io.connect('http://localhost:8000');

      // socketRef.current.on('userJoin', payload => {
      //   console.log('[SocketHandler::userJoined]')
      //   console.log(payload)

      //   if (payload.channel !== "main") { return; }

      //   if (context.user.username !== payload.name) {
      //     context.spawnNotification("NETWORK", "Connected", `${payload.name} joined your channel.`);
      //   } else {
      //     context.spawnNotification("NETWORK", "Connected", `Connected to ${payload.channel} channel.`);
      //   }
      // })

      socketRef.current.emit("$connect", {
        channel: "main",
        username: context.user.username,
        sub: context.user.attributes.sub
      });

      return () => {
        socketRef.current.emit("$disconnect", {
          channel: "main",
          username: context.user.username,
          sub: context.user.attributes.sub
        });
      }
    } else {
      socketRef?.current?.emit('forceDisconnect');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.datastore_ready])

  return (
    <SocketContext.Provider value={{
      socket: socketRef
    }}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketHandler
