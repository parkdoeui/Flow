const getArrayPos = (str) => {
  const arr = []
  str.split(',').forEach((el) => {
    arr.push(parseInt(el))
  })
  arr.push(0)
  return arr
}

export const getGridAssets = (items) => {
  const planes = []
  const objs = []
  const path = {
    start: [],
    end: [],
    grid: [],
    config: {},
  }
  const dimension = {
    width: 0,
    height: 0,
  }
  for (let i = 0; i < items.length; i++) {
    const pos = getArrayPos(items[i].position)
    planes.push({
      id: `plane-${i}`,
      position: pos,
    })

    path.grid.push(0)

    if (items[i].content === 'object') {
      objs.push({
        id: `object-${i}`,
        position: pos,
        config: items[i].config,
      })
      path.grid.pop()
      path.grid.push(1)
    }

    if (items[i].content === 'start') {
      path.start = getArrayPos(items[i].position)
    }
    if (items[i].content === 'end') {
      path.end = getArrayPos(items[i].position)
      path.config = items[i].config
    }

    dimension.width = Math.max(pos[0], dimension.width)
    dimension.height = Math.max(pos[1], dimension.height)
  }

  const grid1D = [...path.grid]
  const grid2D = []
  while (grid1D.length) {
    grid2D.push(grid1D.splice(0, dimension.width + 1))
  }
  path.grid = grid2D

  return [planes, path, objs]
}

export const mapRange = (value, low1, high1, low2, high2) => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
}

export const throttle = (fn, limit = 1000) => {
  let wait = false
  return (...args) => {
    if (!wait) {
      fn(...args)
      wait = true
      setTimeout(function () {
        wait = false
      }, limit)
    }
  }
}

export const debounce = (fn, timeout = 1000) => {
  return (...args) => {
    let time
    if (time) {
      clearTimeout(time)
    }
    setTimeout(() => fn(...args), timeout)
  }
}
