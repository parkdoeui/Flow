import React, { useCallback } from 'react'
import TileGrid from './TileGrid'
import ObjectGrid from './ObjectGrid'
import PathGrid from './PathGrid'
import { getGridAssets } from '../utils'
const Grid = ({ data, scale }) => {
  const [planes, path, objects] = useCallback(getGridAssets(data), [data])

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <PathGrid scale={scale} position={[0, 0, 0.2]} path={path} />
      <ObjectGrid scale={scale} position={[0, 0, scale / 2]} items={objects} />
      <TileGrid scale={scale} position={[0, 0, 0]} items={planes} />
    </group>
  )
}
export default Grid
