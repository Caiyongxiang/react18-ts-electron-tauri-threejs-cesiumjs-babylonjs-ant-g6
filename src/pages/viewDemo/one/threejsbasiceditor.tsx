import React, { useEffect, useRef, useState } from 'react'
import scene from '../../../common/three/scene'
import THREE from '../../../common/three/three'
import { renderer } from '../../../common/three/renderer'
import asesHelper from '../../../common/three/axesHelper'
import { addControls } from '../../../common/three/controls'
import { windowinit } from '../../../common/hook/winodwinit'
import { Button, Drawer } from 'antd'
import Editor from 'react-monaco-editor'
import { useThreeSetup } from '../../../common/hook/init'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 封装一个自定义的Editor组件
const CustomEditor = ({ height = '200px', language = 'javascript', value = '', theme = 'vs-dark', ...props }) => {
  return <Editor height={height} language={language} value={value} theme={theme} {...props} />
}

const codes = [
  {
    p: '界面自适应',
    language: 'javascript',
    value: `  window.addEventListener('resize', () => {
    // 重置渲染器宽高比
    renderer.setSize(
      (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetWidth,
      (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetHeight
    )
    // 重置相机宽高比
    camera.aspect =
      (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetWidth /
      (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetHeight
    // 更新相机投影矩阵
    camera.updateProjectionMatrix()
  })`,
    height: '230px',
    theme: 'vs-dark'
  },
  {
    p: '坐标轴和轨道控制器',
    language: 'javascript',
    value: `
//添加坐标轴
    const axesHelper = new THREE.AxesHelper(5)
 // 添加轨道控制器
  const controls = new OrbitControls(camera, document.getElementsByClassName('cyxScene')[0] as HTMLElement)
  // 设置带阻尼的惯性
  controls.enableDamping = true
  // 设置阻尼系数
  controls.dampingFactor = 0.05
  // 设置旋转速度
  controls.autoRotate = true
  //附加模型
   parentCube.add(cube)`,
    height: '230px',
    theme: 'vs-dark'
  },

  {
    p: '附加子模型,模型缩放和旋转,dom的全屏和退出全屏',
    language: 'javascript',
    value: `parentCube.add(cube)
        // 设置立方体的放大
    cube.scale.set(2, 2, 2)
      // 绕着x轴旋转
    cube.rotation.x = Math.PI / 4
     // 全屏
        document.body.requestFullscreen()
          document.exitFullscreen()
    `,
    height: '230px',
    theme: 'vs-dark'
  },

  {
    p: 'gui的配置 gui一般第一个参数是对象，第二个参数是具体的键名，会根据你的参数类型显示对应的操作设计',
    language: 'javascript',
    value: ` // 创建GUI
    const gui = new GUI()
    // 添加按钮 第一个参数对象，第二人参数键名
    gui.add(eventObj, 'Fullscreen').name('全屏')
    gui.add(eventObj, 'ExitFullscreen').name('退出全屏')
    //创建新的下拉框
     let folder = gui.addFolder('立方体位置')
    //加节点
    folder
      .add(cube.position, 'x')
      .min(-10)
      .max(10)
      .step(1)
      .name('立方体x轴位置')
      .onChange(val => {
        console.log('立方体x轴位置', val)
      })
    //布尔值
     gui.add(parentMaterial, 'wireframe').name('父元素线框模式')
     //颜色
        gui
      .addColor(colorParams, 'cubeColor')
      .name('立方体颜色')
      .onChange(val => {
        cube.material.color.set(val)
      })
    `,
    height: '430px',
    theme: 'vs-dark'
  },
  {
    p: '索引绘制图形',
    language: 'javascript',
    value: `   // 使用索引绘制
    const vertices = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0])
    // 创建顶点属性
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    // 创建索引
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
    // 创建索引属性
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))

    console.log(geometry)
    // 创建材质
    const material1 = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      // side: THREE.DoubleSide,
      wireframe: true
    })
    const plane = new THREE.Mesh(geometry, material1)
    scene.add(plane)
    //setIndex和setAttribute有关，为了顶点复用
   // 当你在处理位置（position）、颜色（color）、法线（normal）等属性时，这些属性通常包含多个值（例如，位置通常由 x, y, z 三个坐标组成，所以其对应的参数是 3
    `,
    height: '400px',
    theme: 'vs-dark'
  },
  {
    p: '索引绘制多材质',
    language: 'javascript',
    value: `
const geometry1 = new THREE.BufferGeometry()
// 使用索引绘制
const vertices1 = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0])
// 创建顶点属性
geometry1.setAttribute('position', new THREE.BufferAttribute(vertices1, 3))
// 创建索引
const indices1 = new Uint16Array([0, 1, 2, 2, 3, 0])
// 创建索引属性
geometry1.setIndex(new THREE.BufferAttribute(indices1, 1))

// 设置2个顶点组，形成2个材质
geometry1.addGroup(0, 3, 0)
geometry1.addGroup(3, 3, 1)
// 创建材质
const material2 = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  // side: THREE.DoubleSide,
  wireframe: true
})
const material3 = new THREE.MeshBasicMaterial({
  color: 0xff0000
})
const plane1 = new THREE.Mesh(geometry1, [material2, material3])
    `,
    height: '400px',
    theme: 'vs-dark'
  }
]
const threejsbasiceditor = () => {
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
    const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    // 创建网格
    let parentCube = new THREE.Mesh(geometry, parentMaterial)
    const cube = new THREE.Mesh(geometry, material)
    parentCube.add(cube)
    parentCube.position.set(-3, 0, 0)
    // 设置立方体的放大
    // cube.scale.set(2, 2, 2)
    // cube.position.x = 2;
    cube.position.set(3, 0, 0)
    // 设置立方体的放大
    // cube.scale.set(2, 2, 2);
    // 绕着x轴旋转
    cube.rotation.x = Math.PI / 4
    // 将网格添加到场景中
    scene.add(parentCube)

    // 使用索引绘制
    const vertices = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0])
    // 创建顶点属性
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    // 创建索引
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
    // 创建索引属性
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))

    console.log(geometry)
    // 创建材质
    const material1 = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      // side: THREE.DoubleSide,
      wireframe: true
    })
    const plane = new THREE.Mesh(geometry, material1)
    scene.add(plane)

    const geometry1 = new THREE.BufferGeometry()
    // 使用索引绘制
    const vertices1 = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0])
    // 创建顶点属性
    geometry1.setAttribute('position', new THREE.BufferAttribute(vertices1, 3))
    // 创建索引
    const indices1 = new Uint16Array([0, 1, 2, 2, 3, 0])
    // 创建索引属性
    geometry1.setIndex(new THREE.BufferAttribute(indices1, 1))

    // 设置2个顶点组，形成2个材质
    geometry1.addGroup(0, 3, 0)
    geometry1.addGroup(3, 3, 1)
    // 创建材质
    const material2 = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      // side: THREE.DoubleSide,
      wireframe: true
    })
    const material3 = new THREE.MeshBasicMaterial({
      color: 0xff0000
    })
    const plane1 = new THREE.Mesh(geometry1, [material2, material3])
    plane1.position.set(0, 3, 3)
    scene.add(plane1)
    //添加辅助坐标系
    scene.add(asesHelper)
    //轨道控制器
    addControls()
    let eventObj = {
      Fullscreen: function () {
        // 全屏
        document.body.requestFullscreen()
        console.log('全屏')
      },
      ExitFullscreen: function () {
        document.exitFullscreen()
        console.log('退出全屏')
      }
    }
    // 创建GUI
    const gui = new GUI()
    // 添加按钮 第一个参数对象，第二人参数键名
    gui.add(eventObj, 'Fullscreen').name('全屏')
    gui.add(eventObj, 'ExitFullscreen').name('退出全屏')
    // 控制立方体的位置
    // gui.add(cube.position, "x", -5, 5).name("立方体x轴位置");
    let folder = gui.addFolder('立方体位置')
    //加节点
    folder
      .add(cube.position, 'x')
      .min(-10)
      .max(10)
      .step(1)
      .name('立方体x轴位置')
      .onChange(val => {
        console.log('立方体x轴位置', val)
      })
    folder
      .add(cube.position, 'y')
      .min(-10)
      .max(10)
      .step(1)
      .name('立方体y轴位置')
      .onFinishChange(val => {
        console.log('立方体y轴位置', val)
      })
    folder.add(cube.position, 'z').min(-10).max(10).step(1).name('立方体z轴位置')

    gui.add(parentMaterial, 'wireframe').name('父元素线框模式')

    let colorParams = {
      cubeColor: '#00ff00'
    }

    gui
      .addColor(colorParams, 'cubeColor')
      .name('立方体颜色')
      .onChange(val => {
        cube.material.color.set(val)
      })
    return () => {
      scene.remove(cube) // 从场景中移除立方体
      geometry.dispose() // 释放几何体资源
      material.dispose() // 释放材质资源
      scene.clear()
      gui.destroy()
      if (renderer) {
        // 确保你有一个对renderer的引用
        renderer.dispose()
        const canvas = renderer.domElement
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas)
        }
      }
    }
  }, [])
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
                <p>{code.p}</p>
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

export default threejsbasiceditor
