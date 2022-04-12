import React, { createContext } from 'react'
import io from 'socket.io-client'
export const SocketContext = createContext()

const URL = process.env.REACT_APP_SERVER_HOST || 'http://localhost:3001'

const SocketProvider = ({ children }) => {
  const socket = io.connect(URL)
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
