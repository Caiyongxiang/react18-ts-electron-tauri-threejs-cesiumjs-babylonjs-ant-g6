import React, { useEffect, useRef, useState } from 'react'
import scene from '../../../common/three/scene'
import THREE from '../../../common/three/three'
import { Button, Drawer } from 'antd'
import Editor from 'react-monaco-editor'
import { useThreeSetup } from '../../../common/hook/init'
import { renderer } from '../../../common/three/renderer'
const oneFirstView = () => {
  const code = `
    // 导入threejs
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
animate();`
  const alcode = `
// 创建几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    // 创建材质
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // 创建网格
    const cube = new THREE.Mesh(geometry, material)

    // 将网格添加到场景中
    scene.add(cube)`

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
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current) // 取消动画帧
      }
      scene.remove(cube) // 从场景中移除立方体
      geometry.dispose() // 释放几何体资源
      material.dispose() // 释放材质资源
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
  })
  return (
    <div className="cyxScene" style={{ width: '100%', height: '100%' }}>
      <Button style={{ position: 'fixed', top: 10, right: 10 }} type="primary" onClick={showDrawer}>
        笔记
      </Button>
      <Drawer title="笔记内容" onClose={onClose} open={open} width={600} style={{ overflow: 'hidden', height: 'calc(100%)' }}>
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <p>web三维主要构成元素:场景，相机，渲染器，渲染函数实时执行渲染器构建</p>
          <Editor options={options} height="400px" language="javascript" value={code} theme="vs-dark" />
          <p>模型主要构成元素:几何体，材质</p>
          <Editor options={options} height="230px" language="javascript" value={alcode} theme="vs-dark" />
        </div>
      </Drawer>
    </div>
  )
}

export default oneFirstView
