import React, { useMemo } from 'react'
import './Marker.css'

const Marker = ({ type, config }) => {
  const color = useMemo(
    () => (type === 'object' || type === 'end' ? config.color : '#fff'),
    [type, config]
  )
  return (
    <div className="marker__container">
      <svg viewBox="0 0 100 100">
        {type && <circle cx="50" cy="50" r="20" fill={color} />}
      </svg>
    </div>
  )
}

export default Marker
