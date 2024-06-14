// src/App.tsx
import React, { useEffect } from 'react'
import AppRouter from './router'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import items from './common/menuItem'
import './common/three/animate'
import './App.css'
import { fncamera } from './common/three/camera'
import { rendererfn } from './common/three/renderer'
import animate from './common/three/animate'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainComponent />
    </BrowserRouter>
  )
}

const MainComponent: React.FC = () => {
  const navigate = useNavigate()
  const onClick: MenuProps['onClick'] = e => {
    navigate(`/${e.key}`, { replace: false })
  }
  useEffect(() => {
    fncamera()
    rendererfn()
    animate()
  })
  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: '15%', float: 'left' }}>
        <Menu
          onClick={onClick}
          style={{ width: '100%', height: '100%' }}
          defaultSelectedKeys={['oneFirstView']}
          defaultOpenKeys={['viewDemo']}
          mode="inline"
          theme="dark"
          items={items}
        />
      </div>
      <div className="cyxScene" style={{ height: '100%', width: '85%', float: 'left' }}>
        <AppRouter />
      </div>
    </div>
  )
}

export default App