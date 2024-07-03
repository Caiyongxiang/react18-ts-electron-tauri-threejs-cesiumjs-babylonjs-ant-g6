// src/router.tsx

import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
import OneFirstView from './pages/viewDemo/one/oneFirstVIew'
import Threejsbasiceditor from './pages/viewDemo/one/threejsbasiceditor'
import Texturefroggygltfloaderlighttween from './pages/viewDemo/one/texturefroggygltfloaderlighttween'
import Geometry from './pages/viewDemo/one/Geometry'
import Material from './pages/viewDemo/one/Material'
import Texture from './pages/viewDemo/one/Texture'
import BasicView from './pages/babylonjs/one/BasicView'
import ImportModel from './pages/babylonjs/one/ImportModel'
import Village from './pages/babylonjs/one/Village'
import ParenChildren from './pages/babylonjs/one/ParentChildren'

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
            path: 'threejsbasiceditor',
            element: <Threejsbasiceditor />
          },
          {
            path: 'texturefroggygltfloaderlighttween',
            element: <Texturefroggygltfloaderlighttween />
          },
          {
            path: 'Geometry',
            element: <Geometry />
          },
          {
            path: 'Material',
            element: <Material />
          },
          {
            path: 'Texture',
            element: <Texture />
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
          },
          {
            path: 'ParenChildren',
            element: <ParenChildren />
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
