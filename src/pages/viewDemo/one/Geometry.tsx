import React, { useEffect, useRef, useState } from 'react'
import scene from '../../../common/three/scene'
import THREE from '../../../common/three/three'
import { addControls } from '../../../common/three/controls'
import { useLocation } from 'react-router-dom'
// 导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入顶点法向量辅助器
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Button, Drawer } from 'antd'
import Editor from 'react-monaco-editor'
import { useThreeSetup } from '../../../common/hook/init'
import { renderer } from '../../../common/three/renderer'
// 封装一个自定义的Editor组件
const CustomEditor = ({ height = '200px', language = 'javascript', value = '', theme = 'vs-dark', ...props }) => {
  return <Editor height={height} language={language} value={value} theme={theme} {...props} />
}
const codes = [
  {
    p: 'uv就是平面的顶点，(x,y)代表一个点',
    language: 'javascript',
    value: `    const geometry = new THREE.BufferGeometry(),
      // 使用顶点坐标
      vertices = new Float32Array([
        -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0,
      ]);
    // 创建顶点属性
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    // 创建索引
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
    // 创建索引属性
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // 设置uv坐标
    const uv = new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1, // 正面
    ]);
    // 创建uv属性
    geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

    console.log(geometry);
    // 创建材质
    const material = new THREE.MeshBasicMaterial({
        map: uvTexture,
      }),
      plane = new THREE.Mesh(geometry, material);
    scene.add(plane);`,
    height: '230px',
    theme: 'vs-dark'
  },
  {
    p: `法向是指垂直于某个表面或曲线的向量,最简单就是反射,呈现镜子效果,作用是 <br />
      1.光照计算：画一个立方体，然后画出立方体每个面上的法向箭头。再画一束光照射到立方体上，光线与法向箭头之间的角度可以决定每个面的亮度<br>
      2.碰撞检测：画一个球和一个墙壁，球向墙壁移动。画出墙壁上的法向箭头，当球撞到墙上时，箭头指示了球反弹的方向。`,
    language: 'javascript',
    value: `// 设置法向量
    const normals = new Float32Array([
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1, // 正面
    ]);
    // 创建法向量属性
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    
    // 创建法向量辅助器
    const helper = new VertexNormalsHelper(plane, 0.2, 0xff0000);
    scene.add(helper);`,
    height: '230px',
    theme: 'vs-dark'
  },
  {
    p: `模型居中创建包围球和包围盒`,
    language: 'javascript',
    value: `    // 实例化加载器gltf
    const gltfLoader = new GLTFLoader();
    // 加载模型
    gltfLoader.load(
      // 模型路径
      "../../../model/Duck.glb",
      // 加载完成回调
      (gltf) => {
        console.log(gltf);
        scene.add(gltf.scene);

        let duckMesh = gltf.scene.getObjectByName("LOD3spShape") as any,
          duckGeometry = duckMesh.geometry;

        // 计算包围盒
        duckGeometry.computeBoundingBox();
        // 设置几何体居中
        // duckGeometry.center();
        // 获取duck包围盒
        let duckBox = duckGeometry.boundingBox;

        // 更新世界矩阵
        duckMesh.updateWorldMatrix(true, true);
        // 更新包围盒
        duckBox.applyMatrix4(duckMesh.matrixWorld);
        // 获取包围盒中心点
        let center = duckBox.getCenter(new THREE.Vector3());
        console.log(center);
        // 创建包围盒辅助器
        let boxHelper = new THREE.Box3Helper(duckBox, 0xffff00);
        // 添加包围盒辅助器
        scene.add(boxHelper);

        // 获取包围球
        let duckSphere = duckGeometry.boundingSphere;
        duckSphere.applyMatrix4(duckMesh.matrixWorld);

        console.log(duckSphere);
        // 创建包围球辅助器
        let sphereGeometry = new THREE.SphereGeometry(
            duckSphere.radius,
            16,
            16
          ),
          sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
          }),
          sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh.position.copy(duckSphere.center);
        scene.add(sphereMesh);
      }
    );`,
    height: '320px',
    theme: 'vs-dark'
  },
  {
    p: `合并包围盒`,
    language: 'javascript',
    value: `      // 三个小球
      let sphere1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
      })
    );
    sphere1.position.x = -3;
    scene.add(sphere1);
    let sphere2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      })
    );
    sphere2.position.x = 0;
    scene.add(sphere2);
    let sphere3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x0000ff,
      })
    );
    sphere3.position.x = 3;
    scene.add(sphere3);
    let box = new THREE.Box3(),
      arrSphere = [sphere1, sphere2, sphere3];
    for (let i = 0; i < arrSphere.length; i++) {
      let box3 = new THREE.Box3().setFromObject(arrSphere[i]);
      // 合并包围盒
      box.union(box3);
    }
    console.log(box);
    // 创建包围盒辅助器
    let boxHelper = new THREE.Box3Helper(box, 0xffff00);
    scene.add(boxHelper);`,
    height: '2320px',
    theme: 'vs-dark'
  },
  {
    p: `线框几何体`,
    language: 'javascript',
    value: `     gltfLoader1.load(
      // 模型路径
      "../../../model/city.glb",
      // 加载完成回调
      (gltf) => {
        gltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            let building = child,
              geometry1 = building.geometry,
              // 获取边缘geometry
              edgesGeometry = new THREE.EdgesGeometry(geometry1),
              // // 创建线段材质
              edgesMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
              }),
              edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

            // 更新建筑物世界转换矩阵
            building.updateWorldMatrix(true, true);
            edges.matrix.copy(building.matrixWorld);
            edges.matrix.decompose(
              edges.position,
              edges.quaternion,
              edges.scale
            );

            // 添加到场景
            scene.add(edges);
          }
        });
      }
    );`,
    height: '230px',
    theme: 'vs-dark'
  }
]
const Geometry = () => {
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
  const location = useLocation()
  useEffect(() => {
    addControls()
    let uvTexture = new THREE.TextureLoader().load('../../texture/uv_grid_opengl.jpg')

    // // 创建平面几何体
    const planeGeometry = new THREE.PlaneGeometry(2, 2)
    console.log(planeGeometry)
    // // 创建材质
    const planeMaterial = new THREE.MeshBasicMaterial({
        map: uvTexture
      }),
      // // 创建平面
      planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
    // // 添加到场景
    scene.add(planeMesh)
    planeMesh.position.x = -3

    // 创建几何体
    const geometry = new THREE.BufferGeometry(),
      // 使用顶点坐标
      vertices = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0])
    // 创建顶点属性
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    // 创建索引
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
    // 创建索引属性
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))

    // 设置uv坐标
    const uv = new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1 // 正面
    ])
    // 创建uv属性
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    // 设置法向量
    const normals = new Float32Array([
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1 // 正面
    ])
    // 创建法向量属性
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))

    console.log(geometry)
    // 创建材质
    const material = new THREE.MeshBasicMaterial({
        map: uvTexture
      }),
      plane = new THREE.Mesh(geometry, material)
    scene.add(plane)

    // 创建法向量辅助器
    const helper = new VertexNormalsHelper(plane, 0.2, 0xff0000)
    scene.add(helper)
    plane.position.x = 3
    function nowanimate() {
      requestRef.current = requestAnimationFrame(nowanimate) // 更新 ref 的当前值
    }
    nowanimate()
    // rgbeLoader 加载hdr贴图
    let rgbeLoader = new RGBELoader()
    rgbeLoader.load('../../../texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap: any) => {
      if (window.location.pathname !== '/viewDemo/one/Geometry') {
        return
      }
      // 设置球形贴图
      envMap.mapping = THREE.EquirectangularReflectionMapping
      // 设置环境贴图
      scene.background = envMap
      // 设置环境贴图
      scene.environment = envMap
      // 设置plane的环境贴图
      planeMaterial.envMap = envMap
      // 设置plane的环境贴图
      material.envMap = envMap
    })
    // 实例化加载器gltf
    const gltfLoader = new GLTFLoader()
    // 加载模型
    gltfLoader.load(
      // 模型路径
      '../../../model/Duck.glb',
      // 加载完成回调
      gltf => {
        if (window.location.pathname !== '/viewDemo/one/Geometry') {
          return
        }
        console.log(gltf)
        scene.add(gltf.scene)

        let duckMesh = gltf.scene.getObjectByName('LOD3spShape') as any,
          duckGeometry = duckMesh.geometry

        // 计算包围盒
        duckGeometry.computeBoundingBox()
        // 设置几何体居中
        // duckGeometry.center();
        // 获取duck包围盒
        let duckBox = duckGeometry.boundingBox

        // 更新世界矩阵
        duckMesh.updateWorldMatrix(true, true)
        // 更新包围盒
        duckBox.applyMatrix4(duckMesh.matrixWorld)
        // 获取包围盒中心点
        let center = duckBox.getCenter(new THREE.Vector3())
        console.log(center)
        // 创建包围盒辅助器
        let boxHelper = new THREE.Box3Helper(duckBox, 0xffff00)
        // 添加包围盒辅助器
        scene.add(boxHelper)

        // 获取包围球
        let duckSphere = duckGeometry.boundingSphere
        duckSphere.applyMatrix4(duckMesh.matrixWorld)

        console.log(duckSphere)
        // 创建包围球辅助器
        let sphereGeometry = new THREE.SphereGeometry(duckSphere.radius, 16, 16),
          sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
          }),
          sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphereMesh.position.copy(duckSphere.center)
        scene.add(sphereMesh)
      }
    )
    // 三个小球
    let sphere1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xff0000
      })
    )
    sphere1.position.x = -3
    scene.add(sphere1)
    let sphere2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00
      })
    )
    sphere2.position.x = 0
    scene.add(sphere2)
    let sphere3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x0000ff
      })
    )
    sphere3.position.x = 3
    scene.add(sphere3)
    let box = new THREE.Box3(),
      arrSphere = [sphere1, sphere2, sphere3]
    for (let i = 0; i < arrSphere.length; i++) {
      let box3 = new THREE.Box3().setFromObject(arrSphere[i])
      // 合并包围盒
      box.union(box3)
    }
    console.log(box)
    // 创建包围盒辅助器
    let boxHelper = new THREE.Box3Helper(box, 0xffff00)
    scene.add(boxHelper)
    // 实例化加载器gltf
    const gltfLoader1 = new GLTFLoader(),
      // 实例化加载器draco
      dracoLoader = new DRACOLoader()
    // 设置draco路径
    dracoLoader.setDecoderPath('../../draco/')
    // 设置gltf加载器draco解码器
    gltfLoader1.setDRACOLoader(dracoLoader)
    gltfLoader1.load(
      // 模型路径
      '../../../model/city.glb',
      // 加载完成回调
      gltf => {
        if (window.location.pathname !== '/viewDemo/one/Geometry') {
          return
        }
        gltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            let building = child,
              geometry1 = building.geometry,
              // 获取边缘geometry
              edgesGeometry = new THREE.EdgesGeometry(geometry1),
              // // 创建线段材质
              edgesMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff
              }),
              edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)

            // 更新建筑物世界转换矩阵
            building.updateWorldMatrix(true, true)
            edges.matrix.copy(building.matrixWorld)
            edges.matrix.decompose(edges.position, edges.quaternion, edges.scale)

            // 添加到场景
            scene.add(edges)
          }
        })
      }
    )
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current) // 取消动画帧
      }
      scene.traverse(function (obj) {
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) {
            obj.geometry.dispose()
          }
          // if(obj.material){
          //   obj.material.dispose();
          // }
        }
      })
      // 设置环境贴图
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
  }, [])
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Button style={{ position: 'fixed', top: 10, right: 10 }} type="primary" onClick={showDrawer}>
        笔记
      </Button>
      <Drawer title="笔记内容" onClose={onClose} open={open} width={600} style={{ overflow: 'hidden', height: 'calc(100%)' }}>
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

export default Geometry
