import '../../../common/css/officialWebsite.css'
import React, { useEffect, useRef, useState } from 'react'
import scene from '../../../common/three/scene'
import THREE from '../../../common/three/three'
import { Button, Drawer } from 'antd'
import { camera } from '../../../common/three/camera'
import Editor from 'react-monaco-editor'
import { useThreeSetup } from '../../../common/hook/init'
import { renderer } from '../../../common/three/renderer'
import { windowinit } from '../../../common/hook/winodwinit'
import getGlobalOffsetLeft from '../../../common/three/getGlobalOffsetLeft'
import gsap from 'gsap'
// 封装一个自定义的Editor组件
const CustomEditor = ({ height = '200px', language = 'javascript', value = '', theme = 'vs-dark', ...props }) => {
  return <Editor height={height} language={language} value={value} theme={theme} {...props} />
}
const codes = [
  {
    p: '创建多个线框正方体,点击射线到的正方体变成实体',
    language: 'javascript',
    value: ` // 1000立方体
    let cubeArr: any = []
    let cubeGroup = new THREE.Group()
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        for (let z = 0; z < 5; z++) {
          const cube = new THREE.Mesh(cubeGeometry, material)
          cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4)
          cubeGroup.add(cube)
          cubeArr.push(cube)
        }
      }
    }

    scene.add(cubeGroup)
    
    // 监听鼠标的位置
    window.addEventListener('click', event => {
      //   console.log(event);
      mouse.x =
        ((event.clientX - Number(getGlobalOffsetLeft(document.getElementsByClassName('cyxScene')[0]).totalOffsetLeft)) /
          (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetWidth) *
          2 -
        1
      mouse.y = -(
        ((event.clientY - Number(getGlobalOffsetLeft(document.getElementsByClassName('cyxScene')[0]).totalOffsetTop)) /
          (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetHeight) *
          2 -
        1
      )
      raycaster.setFromCamera(mouse, camera)
      let result = raycaster.intersectObjects(cubeArr)
      result.forEach((item: any) => {
        item.object.material = redMaterial
      })
    })`,
    height: '400px',
    theme: 'vs-dark'
  },
  {
    p: '顶点组合多个三角形',
    language: 'javascript',
    value: `
 let sjxGroup = new THREE.Group()
    for (let i = 0; i < 50; i++) {
      // 每一个三角形，需要3个顶点，每个顶点需要3个值
      const geometry = new THREE.BufferGeometry()
      const positionArray = new Float32Array(9)
      for (let j = 0; j < 9; j++) {
        if (j % 3 == 1) {
          positionArray[j] = Math.random() * 10 - 5
        } else {
          positionArray[j] = Math.random() * 10 - 5
        }
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
      let color = new THREE.Color(Math.random(), Math.random(), Math.random())
      const material1 = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      })
      // 根据几何体和材质创建物体
      let sjxMesh = new THREE.Mesh(geometry, material1)
      //   console.log(mesh);
      sjxGroup.add(sjxMesh)
    }
    sjxGroup.position.set(0, -30, 0)
    scene.add(sjxGroup)
`,
    height: '230px',
    theme: 'vs-dark'
  },
  {
    p: '创建组合,包括大球，小球和平面，小球包着点光源',
    language: 'javascript',
    value: `
 // 弹跳小球
    const sphereGroup = new THREE.Group()
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
    const spherematerial = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide
    })
    const sphere = new THREE.Mesh(sphereGeometry, spherematerial)
    // 投射阴影
    sphere.castShadow = true

    sphereGroup.add(sphere)

    // // 创建平面
    const planeGeometry = new THREE.PlaneGeometry(20, 20)
    const plane = new THREE.Mesh(planeGeometry, spherematerial)
    plane.position.set(0, -1, 0)
    plane.rotation.x = -Math.PI / 2
    // 接收阴影
    plane.receiveShadow = true
    sphereGroup.add(plane)

    // 灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5) // soft white light
    sphereGroup.add(light)

    const smallBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
    smallBall.position.set(2, 2, 2)
    //直线光源
    const pointLight = new THREE.PointLight(0xff0000, 3)
    // pointLight.position.set(2, 2, 2);
    pointLight.castShadow = true

    // 设置阴影贴图模糊度
    pointLight.shadow.radius = 20
    // 设置阴影贴图的分辨率
    pointLight.shadow.mapSize.set(512, 512)

    // 设置透视相机的属性
    smallBall.add(pointLight)
    sphereGroup.add(smallBall)

    sphereGroup.position.set(0, -60, 0)
    scene.add(sphereGroup)

`,
    height: '230px',
    theme: 'vs-dark'
  },
  {
    p: '鼠标获取当前位置,移动场景',
    language: 'javascript',
    value: `
  // 监听鼠标的位置
    window.addEventListener('mousemove', event => {
      mouse.x =
        (event.clientX - Number(getGlobalOffsetLeft(document.getElementsByClassName('cyxScene')[0]).totalOffsetLeft)) /
          (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetWidth -
        0.5
      mouse.y =
        (event.clientY - Number(getGlobalOffsetLeft(document.getElementsByClassName('cyxScene')[0]).totalOffsetTop)) /
          (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetHeight -
        0.5
    })
function nowanimate() {
      requestRef.current = requestAnimationFrame(nowanimate) // 更新 ref 的当前值
      let deltaTime = clock.getDelta()
      camera.position.y =
        -(
          document.getElementsByClassName('cyxscroll')[0].scrollTop / document.getElementsByClassName('cyxscroll')[0].clientHeight
        ) * 30

      camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 5
    }
`,
    height: '230px',
    theme: 'vs-dark'
  }
]
const OfficialWebsite = () => {
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
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshBasicMaterial({
      wireframe: true
    })
    camera.far = 300
    camera.position.set(0, 0, 23)
    camera.updateMatrix()
    const redMaterial = new THREE.MeshBasicMaterial({
      color: '#ff0000'
    })

    // 1000立方体
    let cubeArr: any = []
    let cubeGroup = new THREE.Group()
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        for (let z = 0; z < 5; z++) {
          const cube = new THREE.Mesh(cubeGeometry, material)
          cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4)
          cubeGroup.add(cube)
          cubeArr.push(cube)
        }
      }
    }

    scene.add(cubeGroup)
    // 创建三角形酷炫物体
    // 添加物体
    // 创建几何体
    let sjxGroup = new THREE.Group()
    for (let i = 0; i < 50; i++) {
      // 每一个三角形，需要3个顶点，每个顶点需要3个值
      const geometry = new THREE.BufferGeometry()
      const positionArray = new Float32Array(9)
      for (let j = 0; j < 9; j++) {
        if (j % 3 == 1) {
          positionArray[j] = Math.random() * 10 - 5
        } else {
          positionArray[j] = Math.random() * 10 - 5
        }
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
      let color = new THREE.Color(Math.random(), Math.random(), Math.random())
      const material1 = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      })
      // 根据几何体和材质创建物体
      let sjxMesh = new THREE.Mesh(geometry, material1)
      //   console.log(mesh);
      sjxGroup.add(sjxMesh)
    }
    sjxGroup.position.set(0, -30, 0)
    scene.add(sjxGroup)

    // 弹跳小球
    const sphereGroup = new THREE.Group()
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
    const spherematerial = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide
    })
    const sphere = new THREE.Mesh(sphereGeometry, spherematerial)
    // 投射阴影
    sphere.castShadow = true

    sphereGroup.add(sphere)

    // // 创建平面
    const planeGeometry = new THREE.PlaneGeometry(20, 20)
    const plane = new THREE.Mesh(planeGeometry, spherematerial)
    plane.position.set(0, -1, 0)
    plane.rotation.x = -Math.PI / 2
    // 接收阴影
    plane.receiveShadow = true
    sphereGroup.add(plane)

    // 灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5) // soft white light
    sphereGroup.add(light)

    const smallBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
    smallBall.position.set(2, 2, 2)
    //直线光源
    const pointLight = new THREE.PointLight(0xff0000, 3)
    // pointLight.position.set(2, 2, 2);
    pointLight.castShadow = true

    // 设置阴影贴图模糊度
    pointLight.shadow.radius = 20
    // 设置阴影贴图的分辨率
    pointLight.shadow.mapSize.set(512, 512)

    // 设置透视相机的属性
    smallBall.add(pointLight)
    sphereGroup.add(smallBall)

    sphereGroup.position.set(0, -60, 0)
    scene.add(sphereGroup)

    let arrGroup = [cubeGroup, sjxGroup, sphereGroup]

    // 创建投射光线对象
    const raycaster = new THREE.Raycaster()

    // 鼠标的位置对象
    const mouse = new THREE.Vector2()

    // 监听鼠标的位置
    window.addEventListener('mousemove', event => {
      mouse.x =
        (event.clientX - Number(getGlobalOffsetLeft(document.getElementsByClassName('cyxScene')[0]).totalOffsetLeft)) /
          (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetWidth -
        0.5
      mouse.y =
        (event.clientY - Number(getGlobalOffsetLeft(document.getElementsByClassName('cyxScene')[0]).totalOffsetTop)) /
          (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetHeight -
        0.5
    })

    // 监听鼠标的位置
    window.addEventListener('click', event => {
      //   console.log(event);
      mouse.x =
        ((event.clientX - Number(getGlobalOffsetLeft(document.getElementsByClassName('cyxScene')[0]).totalOffsetLeft)) /
          (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetWidth) *
          2 -
        1
      mouse.y = -(
        ((event.clientY - Number(getGlobalOffsetLeft(document.getElementsByClassName('cyxScene')[0]).totalOffsetTop)) /
          (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetHeight) *
          2 -
        1
      )
      raycaster.setFromCamera(mouse, camera)
      let result = raycaster.intersectObjects(cubeArr)
      result.forEach((item: any) => {
        item.object.material = redMaterial
      })
    })
    // 添加坐标轴辅助器
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    // 设置时钟
    const clock = new THREE.Clock()
    gsap.to(cubeGroup.rotation, {
      x: '+=' + Math.PI * 2,
      y: '+=' + Math.PI * 2,
      duration: 10,
      ease: 'power2.inOut',
      repeat: -1
    })
    gsap.to(sjxGroup.rotation, {
      x: '-=' + Math.PI * 2,
      z: '+=' + Math.PI * 2,
      duration: 12,
      ease: 'power2.inOut',
      repeat: -1
    })
    gsap.to(smallBall.position, {
      x: -3,
      duration: 6,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true
    })
    gsap.to(smallBall.position, {
      y: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true
    })
    function nowanimate() {
      requestRef.current = requestAnimationFrame(nowanimate) // 更新 ref 的当前值
      let deltaTime = clock.getDelta()
      camera.position.y =
        -(
          document.getElementsByClassName('cyxscroll')[0].scrollTop / document.getElementsByClassName('cyxscroll')[0].clientHeight
        ) * 30

      camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 5
    }
    nowanimate()
    // 设置当前页
    let currentPage = 0
    // 监听滚动事件
    document.getElementsByClassName('cyxscroll')[0].addEventListener('scroll', () => {
      //   console.log(window.scrollY);
      const newPage = Math.round(
        document.getElementsByClassName('cyxscroll')[0].scrollTop / document.getElementsByClassName('cyxscroll')[0].clientHeight
      )
      if (newPage != currentPage) {
        currentPage = newPage
        console.log('改变页面，当前是：' + currentPage)
        console.log(arrGroup[currentPage].rotation)
        gsap.to(arrGroup[currentPage].rotation, {
          z: '+=' + Math.PI * 2,
          x: '+=' + Math.PI * 2,
          duration: 2,
          onComplete: () => {
            console.log('旋转完成')
          }
        })
        gsap.fromTo(`.page${currentPage} h3`, { x: -300 }, { x: 0, rotate: '+=360', duration: 1 })
      }
    })

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current) // 取消动画帧
      }
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
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Button style={{ position: 'fixed', bottom: 10, right: 10, zIndex: '11' }} type="primary" onClick={showDrawer}>
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
      <div className="cyxscroll" style={{ height: '100%', zIndex: '10', width: '100%', overflowY: 'auto', position: 'absolute' }}>
        <div className="page page0" style={{ height: '100%', display: 'flex', color: ' #fff', flexDirection: 'column' }}>
          <h3>THREE.Raycaster实现3d交互效果</h3>
        </div>
        <div className="page page1" style={{ height: '100%', display: 'flex', color: ' #fff', flexDirection: 'column' }}>
          <h3>THREE.BufferGeometry！</h3>
        </div>
        <div className="page page2" style={{ height: '100%', display: 'flex', color: ' #fff', flexDirection: 'column' }}>
          <h3>点光源围绕照亮小球</h3>
        </div>
      </div>

      <div className="cyxScene" style={{ width: '100%', height: '100%' }}></div>
    </div>
  )
}

export default OfficialWebsite
