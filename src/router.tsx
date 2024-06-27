// src/router.tsx

import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
import OneFirstView from './pages/viewDemo/oneFirstView/index'
import AboutDetails from './childrenPages/Pages/AboutDetails'
import AboutTeam from './childrenPages/Pages/AboutTeam'
import BasicView from './pages/babylonjs/BasicView'
import ImportModel from './pages/babylonjs/ImportModel'
import Village from './pages/babylonjs/Village'
const routes = [
  {
    path: '/',
    element: <Navigate to="/viewDemo/one/oneFirstView" />
  },
  {
    path: '/viewDemo',
    children: [
      {
        path: 'one',
        children: [
          {
            index: true,
            element: <OneFirstView />
          },
          {
            path: 'oneFirstView',
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
      }
    ]
  },
  {
    path: '/babylonjs',
    children: [
      {
        path: 'one',
        children: [
          {
            index: true,
            element: <BasicView />
          },
          {
            path: 'BasicView',
            element: <BasicView />
          },
          {
            path: 'ImportModel',
            element: <ImportModel />
          },
          {
            path: 'Village',
            element: <Village />
          }
        ]
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
