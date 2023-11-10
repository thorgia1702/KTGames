import { createContext, useContext, useEffect } from 'react'
import { io } from 'socket.io-client'

// const socket = io('localhost:3000', {
//   transports: ['websocket', 'polling'],
// })
const socket = io('https://ktgames.onrender.com/', {
  transports: ['websocket', 'polling'],
})

const SocketContext = createContext(null)

export const SocketProvider = props => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected')
    })

    return () => {
      socket.off('connect')
    }
  }, [])

  return <SocketContext.Provider value={{ appSocket: socket }}>{props.children}</SocketContext.Provider>
}

export const useSocket = () => {
  const { appSocket } = useContext(SocketContext)
  return {
    appSocket,
  }
}