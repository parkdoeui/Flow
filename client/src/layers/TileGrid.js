import React from 'react'
import Plane from '../components/Plane'

const TileGrid = ({ items, scale, position, rotation }) => {

  return (
    <group position={position} rotation={rotation}>
      {items?.map(({ position, id }, idx) => {
        const scaledPos = position.map(el => el * scale)
        return <Plane
          key={`tile-${idx}`}
          planeId={id}
          scale={scale}
          position={scaledPos}
          idx={idx}
        />
      })}
      ;
    </group>
  )
}

export default TileGrid
