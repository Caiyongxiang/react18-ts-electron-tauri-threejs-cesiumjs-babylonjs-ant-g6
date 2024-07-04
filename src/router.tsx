// src/router.tsx

import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
import OneFirstView from './pages/viewDemo/one/oneFirstVIew'
import Threejsbasiceditor from './pages/viewDemo/one/threejsbasiceditor'
import Texturefroggygltfloaderlighttween from './pages/viewDemo/one/texturefroggygltfloaderlighttween'
import Geometry from './pages/viewDemo/one/Geometry'
import Material from './pages/viewDemo/one/Material'
import Texture from './pages/viewDemo/one/Texture'
import Light from './pages/viewDemo/one/light'
import EasyEditor from './pages/viewDemo/one/easyEditor'
import Animation from './pages/viewDemo/one/animation'
import Points from './pages/viewDemo/one/Points'
import OfficialWebsite from './pages/viewDemo/one/officialWebsite'
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
          },
          {
            path: 'light',
            element: <Light />
          },
          {
            path: 'easyEditor',
            element: <EasyEditor />
          },
          {
            path: 'animation',
            element: <Animation />
          },
          {
            path: 'points',
            element: <Points />
          },
          {
            path: 'officialWebsite',
            element: <OfficialWebsite />
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
