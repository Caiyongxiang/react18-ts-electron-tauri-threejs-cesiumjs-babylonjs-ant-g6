import React, { useEffect, useRef, useState } from 'react'
import scene from '../../../common/three/scene'
import THREE from '../../../common/three/three'
import { addControls } from '../../../common/three/controls'
import { Button, Drawer } from 'antd'
import Editor from 'react-monaco-editor'
import { useThreeSetup } from '../../../common/hook/init'
import { renderer } from '../../../common/three/renderer'
import { windowinit } from '../../../common/hook/winodwinit'
// 封装一个自定义的Editor组件
const CustomEditor = ({ height = '200px', language = 'javascript', value = '', theme = 'vs-dark', ...props }) => {
  return <Editor height={height} language={language} value={value} theme={theme} {...props} />
}
const codes = [
  {
    p: 'web三维主要构成元素:场景，相机，渲染器，渲染函数实时执行渲染器构建',
    language: 'javascript',
    value: ` // 导入threejs
import * as THREE from "three";

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);// 设置相机位置
camera.position.z = 5;
camera.lookAt(0, 0, 0);

// 渲染函数
function animate() {
  requestAnimationFrame(animate);
  // 旋转
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  // 渲染
  renderer.render(scene, camera);
}
animate();`,
    height: '400px',
    theme: 'vs-dark'
  },
  {
    p: '模型主要构成元素:几何体，材质',
    language: 'javascript',
    value: `
// 创建几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    // 创建材质
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // 创建网格
    const cube = new THREE.Mesh(geometry, material)

    // 将网格添加到场景中
    scene.add(cube)`,
    height: '230px',
    theme: 'vs-dark'
  }
]
const oneFirstView = () => {
  const requestRef = useRef<number | null>(null)
  const [open, setOpen] = useState(false)
  const options = {
    selectOnLineNumbers: true
  }
  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }
  useThreeSetup()
  windowinit()
  useEffect(() => {
    // 创建几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    // 创建材质
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // 创建网格
    const cube = new THREE.Mesh(geometry, material)
    // 将网格添加到场景中
    scene.add(cube)

    function nowanimate() {
      requestRef.current = requestAnimationFrame(nowanimate) // 更新 ref 的当前值
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
    }
    nowanimate()
    addControls()
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current) // 取消动画帧
      }

      scene.remove(cube) // 从场景中移除立方体
      geometry.dispose() // 释放几何体资源
      material.dispose() // 释放材质资源
      scene.background = null
      // 设置环境贴图
      scene.environment = null
      scene.clear()
      if (renderer) {
        // 确保你有一个对renderer的引用
        renderer.dispose()
        const canvas = renderer.domElement
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas)
        }
      }
    }
  }, []) // 依赖项数组为空，确保仅在首次渲染后执行
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Button style={{ position: 'fixed', bottom: 10, right: 10 }} type="primary" onClick={showDrawer}>
        笔记
      </Button>
      <Drawer
        placement="left"
        title="笔记内容"
        onClose={onClose}
        open={open}
        width={600}
        style={{ overflow: 'hidden', height: 'calc(100%)' }}
      >
        <div style={{ height: '100%', overflow: 'auto' }}>
          <div>
            {codes.map(code => (
              <div key={code.p}>
                <p dangerouslySetInnerHTML={{ __html: code.p }}></p>
                <CustomEditor
                  key={code.p}
                  options={options}
                  height={code.height}
                  language={code.language}
                  value={code.value}
                  theme={code.theme}
                />
              </div>
            ))}
          </div>
        </div>
      </Drawer>
      <div className="cyxScene" style={{ width: '100%', height: '100%' }}></div>
    </div>
  )
}

export default oneFirstView
