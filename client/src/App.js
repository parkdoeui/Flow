import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './page/Main'
import Config from './page/Config'
import './common.css'
import './App.css'
function App() {
  return (
    <div className="App">
      <div className="app__header">
        <div>
          <h5>Flow</h5>
          <h6>by Do Park</h6>
        </div>
      </div>
      <div></div>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/config" element={<Config />} />
      </Routes>
    </div>
  )
}

export default App
