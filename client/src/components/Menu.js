import React from 'react'
import './Menu.css'

const Menu = ({ icon, label, value, currentValue, onClick }) => {
  return  <div className={currentValue === value ? 'config__item--active' : 'config__item'} onClick={()=>onClick(value)}>
    {icon}<span>{label}</span>
  </div>
}

export default Menu
