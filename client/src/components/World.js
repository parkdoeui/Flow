import React from 'react'

const World = ({ ...props }) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial opacity={0} transparent/>
    </mesh>
  )
}

export default World
