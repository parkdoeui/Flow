import React, { Suspense, useContext } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { OrbitControls, OrthographicCamera, Center } from '@react-three/drei'
import { SocketContext } from '../context'
import Grid from '../layers/Grid'
import Drone from '../components/Drone'
import World from '../components/World'
import { DEFAULT_GRID, DEFAULT_SCALE } from '../constants'
import { throttle } from '../utils'
import { useSocket } from './hooks'
import './Main.css'
import Alert from '../components/Alert'

const Main = () => {

  const socket = useContext(SocketContext)
  const [data, isLoading, isError, isUnstable] = useSocket(socket)

  const updateStart = throttle((pos) => {
    const x = THREE.MathUtils.clamp(Math.round(pos.x / DEFAULT_SCALE), 0, DEFAULT_GRID - 1)
    const y = THREE.MathUtils.clamp(Math.round(pos.y / DEFAULT_SCALE), 0, DEFAULT_GRID - 1)
    const targetId = `grid-${x + DEFAULT_GRID * y}`
    if (data.some(({ id, content }) => id === targetId && content === null)) {
      socket.emit('set_grid', { content: 'start', id: targetId, position: `${x},${y}`, config: {} })
      socket.emit('get_grid')
    }
  }, 1000)

  const t = DEFAULT_SCALE * DEFAULT_GRID / 2
  return <>
    <div className='main__header'>
      <a href='/config' target="_blank">Open control board</a>
    </div>
    <Alert open={isLoading} color={'#0b9624'} body={'Loading...'} />
    <Alert open={isError} color={'#b32a00'} body={'Connection lost: reconnecting...'} />
    <Alert open={isUnstable} color={'#d47c24'} body={'Unstable network...'} />
    <Canvas width={800} height={600} style={{ position: 'unset' }} className='main__canvas'>
      <OrthographicCamera makeDefault near={0.001} far={1000} position={[50, 50,-50]} zoom={10} />
      <color attach="background" args={['#06092c']} />
      <OrbitControls maxPolarAngle={Math.PI/2.3}/>
      <ambientLight />
      <pointLight position={[20, 10, 10]} color={'#fffbde'} />
      <hemisphereLight groundColor={'#ffcd19'} intensity={1.9}/>
      {!isLoading && <Center >
        <World scale={300} position={[t, 0, -t]} />
        <Suspense>
          <Drone onChange={(pos) => updateStart(pos)} position={[0, 8, 0]} />
        </Suspense>
        <Grid scale={DEFAULT_SCALE} data={data} />
      </Center>}
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={800} />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  </>
}

export default Main
