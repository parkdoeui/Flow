import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { HuePicker, AlphaPicker } from 'react-color'
import Box from '../components/Box'
import Drone from './Drone'
import Plane from './Plane'
import './Configurator.css'

const Configurator = ({ item, onSave, onDiscard }) => {
  const [config, setConfig] = useState(item.config)

  const colorOnChange = (value) => {
    const { r, g, b, a } = value.rgb

    setConfig((prev) => {
      let newConfig = {}
      if (config.alpha) {
        newConfig.alpha = Math.min(1, Math.max(a, 0.1))
      }
      newConfig.color = `rgba(${r},${g},${b},${a})`
      return {
        ...prev,
        ...newConfig,
      }
    })
  }
  return (
    <div>
      <div className="config__modal__content">
        <div className="config__modal__model">
          <Canvas style={{ borderRadius: 8 }}>
            <OrthographicCamera makeDefault position={[0, 10, 10]} zoom={30} />
            <OrbitControls autoRotate autoRotateSpeed={5} />
            <color attach="background" args={['#eee']} />
            <pointLight position={[10, 10, 10]} color={'#fffbde'} />
            {item.content === 'object' ? (
              <Box
                scale={3}
                opacity={config.alpha}
                color={config.color}
                hoverDisabled
              />
            ) : item.content === 'start' ? (
              <Suspense>
                <Drone position={[0, 0, 0]} />
              </Suspense>
            ) : (
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <Plane
                  scale={30}
                  color={config.color}
                  transparent
                  onFrame={(state, ref) => {
                    ref.current.material.opacity = Math.sin(
                      state.clock.elapsedTime * 2
                    )
                  }}
                />
              </group>
            )}
          </Canvas>
        </div>
        <div>
          <h5>ID</h5>
          <h4>{item.id}</h4>
          <h5>Position</h5>
          <h4>{item.position}</h4>
          <h5>Type</h5>
          <h4>{item.content}</h4>
        </div>
        <div>
          {Object.keys(item.config).length > 0 && (
            <>
              <h5>Configuration</h5>
              {config.color && (
                <HuePicker
                  color={config.color}
                  onChangeComplete={(value) => colorOnChange(value)}
                />
              )}
              {config.alpha && (
                <AlphaPicker
                  color={config.color}
                  onChangeComplete={(value) => colorOnChange(value)}
                />
              )}
            </>
          )}
        </div>
        <div className="config__modal__btns">
          <button onClick={() => onSave(item.id, config)}>Save</button>
          <button onClick={() => onDiscard()}>Discard</button>
        </div>
      </div>
    </div>
  )
}

export default Configurator
