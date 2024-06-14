import type { MenuProps } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    key: 'viewDemo',
    label: 'threejs基础递进巩固',
    icon: <AppstoreOutlined />,
    children: [{ key: 'oneFirstView', label: '第一个3d界面' }]
  },
  {
    key: 'webDemo',
    label: 'threejs官网案例复刻',
    icon: <AppstoreOutlined />,
    children: [{ key: '21', label: '第一个3d界面' }]
  },
  {
    key: 'babylonjs',
    label: 'babylonjs基础学习',
    icon: <AppstoreOutlined />,
    children: [{ key: '211', label: '第一个3d界面' }]
  }
]
export default items
