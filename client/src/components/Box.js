import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

const Box = ({
  onFrame = () => {},
  hoverDisabled,
  position,
  color,
  opacity,
  scale,
  ...props
}) => {
  const ref = useRef()
  const [isHovered, setIsHovered] = useState(false)
  useFrame((state) => onFrame(state, ref))
  return (
    <mesh
      ref={ref}
      scale={scale}
      position={position}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      {...props}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        flatShading
        roughness={0.2}
        clearcoat={1.0}
        clearcoatRoughness={1}
        transmission={0.8}
        ior={1.25}
        transparent
        opacity={opacity}
        attenuationTint="#fff"
        attenuationDistance={0}
        color={hoverDisabled ? color : isHovered ? 'hotpink' : color}
      />
    </mesh>
  )
}

export default Box
