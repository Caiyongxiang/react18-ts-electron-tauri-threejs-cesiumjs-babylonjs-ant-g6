// src/router.tsx

import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
import OneFirstView from './pages/viewDemo/oneFirstView/index'
import AboutDetails from './childrenPages/Pages/AboutDetails'
import AboutTeam from './childrenPages/Pages/AboutTeam'
import BasicView from './pages/babylonjs/BasicView'
const routes = [
  {
    path: '/',
    element: <Navigate to="/oneFirstView" />
  },
  {
    path: '/oneFirstView',
    children: [
      {
        index: true,
        element: <OneFirstView />
      },
      {
        path: 'details',
        element: <AboutDetails />
      },
      {
        path: 'team',
        element: <AboutTeam />
      }
    ]
  },
  {
    path: '/babylonjs',
    children: [
      {
        index: true,
        element: <BasicView />
      },
      {
        path: 'BasicView',
        element: <BasicView />
      }
    ]
  },
  {
    path: '*',
    element: <OneFirstView />
  }
]
function AppRouter() {
  let element = useRoutes(routes) // 识别当前的url， 返回对应的组件
  return element
}
export default AppRouter
