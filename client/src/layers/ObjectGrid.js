import React from 'react'
import Box from '../components/Box'

const ObjectGrid = ({ items, position, rotation, scale }) => {

  return (
    <group position={position} rotation={rotation}>
      {items?.map(({ position, config }, idx) => {
        const scaledPos = position.map(el => el * scale)
        return <Box key={`box-${idx}`} boxId={`object-${idx}`} position={scaledPos} scale={scale} color={config.color} opacity={config.alpha} />
      })}
    </group>
  )
}

export default ObjectGrid
