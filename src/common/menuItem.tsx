import type { MenuProps } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    key: 'viewDemo',
    label: 'threejs基础递进巩固',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: 'viewDemo/one',
        label: '第一阶段',
        icon: <AppstoreOutlined />,
        children: [
          { key: 'viewDemo/one/oneFirstView', label: '第一个3d界面' },
          { key: 'viewDemo/one/threejsbasiceditor', label: 'threejs基本配置' },
          { key: 'viewDemo/one/texturefroggygltfloaderlighttween', label: '基础贴图雾gltf模型加载灯光tween动画' },
          { key: 'viewDemo/one/Geometry', label: 'Geometry' },
          { key: 'viewDemo/one/Material', label: '材质' },
          { key: 'viewDemo/one/Texture', label: 'Texture' },
          { key: 'viewDemo/one/light', label: 'light' },
          { key: 'viewDemo/one/easyEditor', label: 'easyEditor' },
          { key: 'viewDemo/one/animation', label: 'animation' },
          { key: 'viewDemo/one/points', label: 'points' }
        ]
      }
    ]
  },
  {
    key: 'webDemo',
    label: 'threejs官网案例复刻',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: 'one',
        label: '第一阶段',
        icon: <AppstoreOutlined />,
        children: [{ key: '21', label: '第一个3d界面' }]
      }
    ]
  },
  {
    key: 'babylonjs',
    label: 'babylonjs基础学习',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: 'babylonjs/one',
        label: '第一阶段',
        icon: <AppstoreOutlined />,
        children: [
          { key: 'babylonjs/one/BasicView', label: '第一个3d界面' },
          { key: 'babylonjs/one/ImportModel', label: '导入babylon模型' },
          { key: 'babylonjs/one/Village', label: '村庄' },
          { key: 'babylonjs/one/ParenChildren', label: '父子模型' }
        ]
      }
    ]
  }
]
export default items
