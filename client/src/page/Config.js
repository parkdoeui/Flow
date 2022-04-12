import React, { useState, useContext } from 'react'
import { SocketContext } from '../context'
import { AiOutlineSelect, AiOutlineFlag } from 'react-icons/ai'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import Marker from '../components/Marker'
import Modal from '@mui/material/Modal'
import Configurator from '../components/Configurator'
import Alert from '../components/Alert'
import Menu from '../components/Menu'
import { useSocket } from './hooks'
import {
  DEFAULT_GRID,
  DEFAULT_OBJECT_CONFIG,
  DEFAULT_PATH_CONFIG,
} from '../constants'
import './Config.css'

const Config = () => {
  const socket = useContext(SocketContext)

  const [current, setCurrent] = useState({
    mode: 'end',
    selected: null,
  })

  const [grid, isLoading, isError, isUnstable] = useSocket(socket)
  const [isOpen, setIsOpen] = useState(false)
  const tileOnClick = (id, position, mode) => {
    if (mode === 'select') {
      const selectedItem = grid.find((el) => el.id === id)
      if (selectedItem && selectedItem.content) {
        setIsOpen(true)
        setCurrent((prev) => ({ ...prev, mode, selected: selectedItem }))
      }
      return
    }

    if (grid.some((el) => el.id === id && el.content === mode)) {
      socket.emit('delete_grid', { id })
      socket.emit('get_grid')
      return
    }

    if (mode === 'object') {
      socket.emit('set_grid', {
        id,
        position,
        content: mode,
        config: DEFAULT_OBJECT_CONFIG,
      })
    }

    if (mode === 'end') {
      socket.emit('set_grid', {
        id,
        position,
        content: mode,
        config: DEFAULT_PATH_CONFIG,
      })
    }

    socket.emit('get_grid')
  }

  const menuOnClick = (newMode) => {
    setCurrent((prev) => ({ ...prev, mode: newMode }))
  }

  const configOnSave = (id, config) => {
    socket.emit('update_grid_config', { id, config })
    socket.emit('get_grid')
    setIsOpen(false)
  }

  const onReset = () => {
    socket.emit('reset_grid')
    socket.emit('get_grid')
  }
  return (
    <>
      <Alert open={isLoading} color={'#0b9624'} body={'Loading...'} />
      <Alert
        open={isError}
        color={'#b32a00'}
        body={'Connection lost: reconnecting...'}
      />
      <Alert open={isUnstable} color={'#d47c24'} body={'Unstable network...'} />
      <div className="config">
        {current.selected && (
          <Modal
            className="config__modal"
            open={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <Configurator
              item={current.selected}
              onDiscard={() => setIsOpen(false)}
              onSave={configOnSave}
            />
          </Modal>
        )}
        <div className="config__control">
          <Menu
            label="End"
            value="end"
            currentValue={current.mode}
            icon={<AiOutlineFlag />}
            onClick={menuOnClick}
          />
          <Menu
            label="Object"
            value="object"
            currentValue={current.mode}
            icon={<HiOutlineOfficeBuilding />}
            onClick={menuOnClick}
          />
          <Menu
            label="Select"
            value="select"
            currentValue={current.mode}
            icon={<AiOutlineSelect />}
            onClick={menuOnClick}
          />
          <Menu
            label="Reset All"
            value="reset"
            currentValue={current.mode}
            icon={<AiOutlineSelect />}
            onClick={() => onReset()}
          />
        </div>
        <div
          style={{ gridTemplateColumns: `repeat(${DEFAULT_GRID}, 1fr` }}
          className="config__board"
        >
          {!isLoading &&
            grid.length > 0 &&
            grid.map(({ id, position, content, config }, idx) => (
              <div
                key={`grid-${idx}`}
                className="config__tile"
                onClick={() => tileOnClick(id, position, current.mode)}
              >
                <Marker type={content} config={config} />
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default Config
