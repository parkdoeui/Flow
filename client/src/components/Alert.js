import React from 'react'
import { Snackbar } from '@mui/material'
import './Alert.css'
const Alert = ({ open, color, body }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000}>
      <div style={{ backgroundColor: color }} className="main__alert"><span>{body}</span><div className="loader__ripple"><div></div><div></div></div></div>
    </Snackbar>
  )
}

export default Alert
