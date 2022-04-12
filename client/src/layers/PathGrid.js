import React,{ useMemo } from 'react'
import PF from 'pathfinding'
import Plane from '../components/Plane'
import { mapRange } from '../utils'
const generatePath = ({ grid, start, end }) => {
  if (start.length && grid.length && end.length) {

    const mat = new PF.Grid(grid)
    const finder = new PF.AStarFinder().findPath(start[0], start[1], end[0], end[1], mat)
    return finder.map(el=> [...el, 0]).reverse()
  }
}

const PathGrid = ({ position, path, scale }) => {

  const pathArray = useMemo(()=>generatePath(path),[path])
  return pathArray && (
    <group position={position}>
      {pathArray?.map((position, idx) => {
        const scaledPos = position.map(el => el * scale)
        return <Plane key={`path-${idx}`}
          onFrame={(state, ref) => {
            ref.current.material.opacity = Math.max(0, Math.sin(state.clock.elapsedTime * 1.2 + mapRange(idx, 0,pathArray.length -1, 0, 1)))
          }}
          planeId={`path-${idx}`}
          scale={scale}
          transparent
          color={path.config.color}
          position={scaledPos}
          idx={idx}
        />
      })}
    </group>
  )
}

export default PathGrid
