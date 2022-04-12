import { useState, useEffect } from 'react'
import { LATENCY_THRESHOLD, DEFAULT_INTERVAL } from '../constants'

export const useSocket = (socket) => {
  const [data, setData] = useState([])
  const [latency, setLatency] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isUnstable, setIsUnstable] = useState(false)

  useEffect(() => {
    socket.emit('get_grid', (res) => {
      setData(res)
      setIsLoading(false)
      setIsError(false)
    })
  }, [])

  useEffect(() => {
    if (latency > LATENCY_THRESHOLD) {
      setIsUnstable(true)
    } else {
      setIsUnstable(false)
    }
  },[latency])

  useEffect(() => {
    let reconnectSocket
    if (isError) {
      reconnectSocket = setInterval(() => {
        socket.emit('get_grid')
      }, DEFAULT_INTERVAL)
    }
    return () => {
      if (reconnectSocket) {
        clearInterval(reconnectSocket)
      }
    }
  },[isError])

  useEffect(() => {
    socket.on('subscribe_grid', (res) => {
      socket.emit('send_timestamp', Date.now())
      setData(res)
      setIsError(false)
    },[])

    socket.on('connect_error', (err) => {
      setIsError(true)
      setIsUnstable(false)
      console.log(`connect_error due to ${err.message}`)
    })

    socket.on('get_timestamp', (sentTime) => {
      setLatency(Date.now() - sentTime)
    })

  }, [socket])

  return [data, isLoading, isError, isUnstable]
}
