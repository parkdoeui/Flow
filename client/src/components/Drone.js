import React, { useState, useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import droneGLB from '../assets/drone.glb'

const keycodes = {
  left: [37, 65],
  up: [38, 87],
  right: [39, 68],
  down: [40, 83],
}

const useController = ({ acc, rot, decay }) => {
  const [pos, setPos] = useState({
    x: 0,
    y: 0,
    deg: 180,
    acc: 0,
  })

  const onFriction = () => {
    setPos(prev => {
      const rad = THREE.MathUtils.degToRad(prev.deg)
      return {
        ...prev,
        x: prev.x += Math.sin(rad) * prev.acc,
        y: prev.y -= Math.cos(rad) * prev.acc,
        acc: Math.max(-10, prev.acc *= decay),
      }
    })
  }

  const onAcceleration = (num) => {
    setPos(prev => {
      return {
        ...prev,
        acc: THREE.MathUtils.clamp(prev.acc += 0.05 * num, -0.5, 2),
      }
    })
  }

  const onRotation = (num) => {
    setPos(prev => ({ ...prev, deg: prev.deg += num }))
  }

  const handleKeyInput = (e) => {
    if (keycodes.right.includes(e.keyCode)) {
      onRotation(-rot)
    }
    if (keycodes.down.includes(e.keyCode)) {
      onAcceleration(-acc)
    }
    if (keycodes.left.includes(e.keyCode)) {
      onRotation(rot)
    }
    if (keycodes.up.includes(e.keyCode)) {
      onAcceleration(acc)
    }
  }
  useEffect(() => {
    const keyDown = document.addEventListener('keydown', (e) => handleKeyInput(e,'keydown'))
    return () => {
      if(keyDown)
        document.clearEventListener('keydown', handleKeyInput)
    }
  }, [])

  return [ onFriction, pos ]
}

const Drone = ({ onChange = () => { }, position, ...props }) => {
  const group = useRef()
  const [ animate, pos ] = useController({ acc: 1, rot: 20, decay: 0.98 })
  const { nodes, materials } = useGLTF(droneGLB)
  const propellerRef = useRef(new Array(4))

  useFrame((state) => {
    animate()
    for (const ref of propellerRef.current) {
      ref.rotation.z += 0.8
    }
    group.current.position.y = Math.sin(state.clock.elapsedTime)
  })

  useEffect(() => {
    onChange(pos)
  },[pos])

  return (
    <group ref={group} {...props} rotation={[0, THREE.MathUtils.degToRad(pos.deg), 0]} position={[pos.x, 1, -pos.y]} dispose={null}>
      <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[1.38, 1.98, 0.61]} scale={0.42}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle_0.geometry}
            material={nodes.Circle_0.material}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle_1.geometry}
            material={nodes.Circle_1.material}
          />
        </group>
        <group position={[3.08, 2.73, -0.05]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle001_0.geometry}
            material={nodes.Circle001_0.material}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle001_1.geometry}
            material={nodes.Circle001_1.material}
          />
        </group>
        <group position={[0.02, 0.27, 0]} scale={[1.18, 1, 1]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_0.geometry}
            material={nodes.Cube_0.material}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube_1.geometry}
            material={materials['Material.002']}
          />
        </group>
        <group position={[0.05, 2.87, -0.19]} scale={[0.1, 0.1, 0.12]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Sphere_0.geometry}
            material={materials['Material.005']}
          />
        </group>
        <group position={[0, -2.49, -0.12]} scale={[0.17, 0.13, 0.16]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Sphere001_0.geometry}
            material={materials['Material.004']}
          />
        </group>
        <group position={[1.14, 0.83, 0.28]} scale={[0.1, 0.05, 0.05]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube001_0.geometry}
            material={nodes.Cube001_0.material}
          />
        </group>
        <group
          ref={el=>propellerRef.current[0] = el}
          //propeller
          position={[3.06, 2.73, 1]}
          rotation={[0, 0, 0.05]}
          scale={[0.15, 0.15, 0.15]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle002_0.geometry}
            material={nodes.Circle002_0.material}
          />
        </group>
        <group
          //propeller
          ref={el=>propellerRef.current[1] = el}
          position={[-3.03, 2.75, 1]}
          rotation={[0, 0, -1.44]}
          scale={[0.15, 0.15, 0.15]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle003_0.geometry}
            material={nodes.Circle003_0.material}
          />
        </group>
        <group
          //propeller
          ref={el=>propellerRef.current[2] = el}
          position={[-3.03, -2.19, 1]}
          rotation={[0, 0, -0.39]}
          scale={[0.15, 0.15, 0.15]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle004_0.geometry}
            material={nodes.Circle004_0.material}
          />
        </group>
        <group
          //propeller
          ref={el=>propellerRef.current[3] = el}
          position={[3.05, -2.19, 1]}
          rotation={[0, 0, -1.36]}
          scale={[0.15, 0.15, 0.15]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle005_0.geometry}
            material={nodes.Circle005_0.material}
          />
        </group>
        <group
          position={[0.06, 3.09, 0.25]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.12, 0.12, 0.12]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder_0.geometry}
            material={nodes.Cylinder_0.material}
          />
        </group>
        <group
          position={[-0.06, 3.09, 0.25]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.12, 0.12, 0.12]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder001_0.geometry}
            material={nodes.Cylinder001_0.material}
          />
        </group>
      </group>
    </group>
  )
}

export default Drone
