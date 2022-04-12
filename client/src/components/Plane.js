import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
const Plane = ({
  onFrame = () => {},
  transparent,
  opacity = 1.0,
  color = '#11121c',
  position,
  scale,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const ref = useRef()
  useFrame((state) => onFrame(state, ref))
  return (
    <mesh
      ref={ref}
      position={position}
      scale={scale}
      onPointerOver={() => setIsFocused(true)}
      onPointerOut={() => setIsFocused(false)}
      thickness={2}
    >
      <planeBufferGeometry args={[1, 1]} />
      <meshPhysicalMaterial
        transparent={transparent}
        roughness={1}
        metalness={0}
        reflectivity={0}
        opacity={opacity}
        color={isFocused ? '#ff9ef9' : color}
      />
    </mesh>
  )
}
export default Plane
