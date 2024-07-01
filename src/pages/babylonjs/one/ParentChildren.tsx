import React, { useEffect, useRef, useState } from 'react'
import {
  Engine,
  StandardMaterial,
  DynamicTexture,
  Mesh,
  TransformNode,
  Color3,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight
} from 'babylonjs'
import { Button, Drawer } from 'antd'
import Editor from 'react-monaco-editor'
import BasicScene from '../../../common/babylonjs/BasicScene'

const codes = [
  {
    p: '改变父级',
    language: 'javascript',
    value: `boxChildAxes.parent = boxChild`,
    height: '100px',
    theme: 'vs-dark'
  },
  {
    p: '创建线成为坐标系',
    language: 'javascript',
    value: `showAxis = (size, scene) => {
    const axisX = Mesh.CreateLines("axisX", [
      new Vector3.Zero(),
      new Vector3(size, 0, 0),
      new Vector3(size * 0.95, 0.05 * size, 0),
      new Vector3(size, 0, 0),
      new Vector3(size * 0.95, -0.05 * size, 0),
    ]);
    axisX.color = new Color3(1, 0, 0);
    const xChar = makeTextPlane("X", "red", size / 10, scene);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

    const axisY = Mesh.CreateLines("axisY", [
      new Vector3.Zero(),
      new Vector3(0, size, 0),
      new Vector3(-0.05 * size, size * 0.95, 0),
      new Vector3(0, size, 0),
      new Vector3(0.05 * size, size * 0.95, 0),
    ]);
    axisY.color = new Color3(0, 1, 0);
    const yChar = makeTextPlane("Y", "green", size / 10, scene);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = Mesh.CreateLines("axisZ", [
      new Vector3.Zero(),
      new Vector3(0, 0, size),
      new Vector3(0, -0.05 * size, size * 0.95),
      new Vector3(0, 0, size),
      new Vector3(0, 0.05 * size, size * 0.95),
    ]);
    axisZ.color = new Color3(0, 0, 1);
    const zChar = makeTextPlane("Z", "blue", size / 10, scene);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  }`,
    height: '400px',
    theme: 'vs-dark'
  },
  {
    p: '创建线成为坐标系',
    language: 'javascript',
    value: `makeTextPlane = (text, color, size, scene) => {
    const dynamicTexture = new DynamicTexture(
      "DynamicTexture",
      50,
      scene,
      true
    );
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(
      text,
      5,
      40,
      "bold 36px Arial",
      color,
      "transparent",
      true
    );
    const plane = new Mesh.CreatePlane("TextPlane", size, scene, true);
    plane.material = new StandardMaterial("TextPlaneMaterial", scene);
    plane.material.backFaceCulling = false; // 不剔除背面
    plane.material.specularColor = new Color3(0, 0, 0); // 设置高光颜色为黑色
    plane.material.diffuseTexture = dynamicTexture; // 应用先前创建的动态纹理作为材料的漫反射纹理
    return plane;
  }`,
    height: '400px',
    theme: 'vs-dark'
  }
]
const localAxes = (size: number, scene: Scene) => {
  //@ts-ignore
  const local_axisX = Mesh.CreateLines(
    'local_axisX',
    [
      //@ts-ignore
      new Vector3.Zero(),
      new Vector3(size, 0, 0),
      new Vector3(size * 0.95, 0.05 * size, 0),
      new Vector3(size, 0, 0),
      new Vector3(size * 0.95, -0.05 * size, 0)
    ],
    scene
  )
  local_axisX.color = new Color3(1, 0, 0)
  //@ts-ignore
  const local_axisY = Mesh.CreateLines(
    'local_axisY',
    [
      //@ts-ignore
      new Vector3.Zero(),
      new Vector3(0, size, 0),
      new Vector3(-0.05 * size, size * 0.95, 0),
      new Vector3(0, size, 0),
      new Vector3(0.05 * size, size * 0.95, 0)
    ],
    scene
  )
  local_axisY.color = new Color3(0, 1, 0)
  //@ts-ignore
  const local_axisZ = Mesh.CreateLines(
    'local_axisZ',
    [
      //@ts-ignore
      new Vector3.Zero(),
      new Vector3(0, 0, size),
      new Vector3(0, -0.05 * size, size * 0.95),
      new Vector3(0, 0, size),
      new Vector3(0, 0.05 * size, size * 0.95)
    ],
    scene
  )
  local_axisZ.color = new Color3(0, 0, 1)

  const local_origin = new TransformNode('local_origin')

  local_axisX.parent = local_origin
  local_axisY.parent = local_origin
  local_axisZ.parent = local_origin

  return local_origin
}
const makeTextPlane = (text: string, color: string, size: number, scene: Scene) => {
  const dynamicTexture = new DynamicTexture('DynamicTexture', 50, scene, true)
  dynamicTexture.hasAlpha = true
  dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true)
  //@ts-ignore
  const plane = new Mesh.CreatePlane('TextPlane', size, scene, true)
  plane.material = new StandardMaterial('TextPlaneMaterial', scene)
  plane.material.backFaceCulling = false // 不剔除背面
  plane.material.specularColor = new Color3(0, 0, 0) // 设置高光颜色为黑色
  plane.material.diffuseTexture = dynamicTexture // 应用先前创建的动态纹理作为材料的漫反射纹理
  return plane
}
const showAxis = (size: number, scene: Scene) => {
  //@ts-ignore
  const axisX = Mesh.CreateLines('axisX', [
    //@ts-ignore
    new Vector3.Zero(),
    new Vector3(size, 0, 0),
    new Vector3(size * 0.95, 0.05 * size, 0),
    new Vector3(size, 0, 0),
    new Vector3(size * 0.95, -0.05 * size, 0)
  ])
  axisX.color = new Color3(1, 0, 0)
  const xChar = makeTextPlane('X', 'red', size / 10, scene)
  xChar.position = new Vector3(0.9 * size, -0.05 * size, 0)
  //@ts-ignore
  const axisY = Mesh.CreateLines('axisY', [
    //@ts-ignore
    new Vector3.Zero(),
    new Vector3(0, size, 0),
    new Vector3(-0.05 * size, size * 0.95, 0),
    new Vector3(0, size, 0),
    new Vector3(0.05 * size, size * 0.95, 0)
  ])
  axisY.color = new Color3(0, 1, 0)
  const yChar = makeTextPlane('Y', 'green', size / 10, scene)
  yChar.position = new Vector3(0, 0.9 * size, -0.05 * size)
  //@ts-ignore
  const axisZ = Mesh.CreateLines('axisZ', [
    //@ts-ignore
    new Vector3.Zero(),
    new Vector3(0, 0, size),
    new Vector3(0, -0.05 * size, size * 0.95),
    new Vector3(0, 0, size),
    new Vector3(0, 0.05 * size, size * 0.95)
  ])
  axisZ.color = new Color3(0, 0, 1)
  const zChar = makeTextPlane('Z', 'blue', size / 10, scene)
  zChar.position = new Vector3(0, 0.05 * size, 0.9 * size)
}
const ParenChildren = () => {
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
  useEffect(() => {
    const babylonjs = new BasicScene()
    const scene = babylonjs.getScene()
    const canvas = babylonjs.getcanvas()
    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), scene)
    camera.attachControl(canvas, true) // 注意：修改了拼写错误
    new HemisphericLight('light', new Vector3(0, 1, 0), scene)
    MeshBuilder.CreateBox('box', {}, scene) // 将盒子添加到场景中
    const faceColors = [Color3.Blue(), Color3.Teal(), Color3.Red(), Color3.Purple(), Color3.Green(), Color3.Yellow()],
      boxParent = MeshBuilder.CreateBox('Box', {
        //@ts-ignore
        faceColors: faceColors
      }),
      boxChild = MeshBuilder.CreateBox('Box', {
        size: 0.5,
        //@ts-ignore
        faceColors: faceColors
      })
    boxChild.setParent(boxParent)

    boxChild.position.x = 0
    boxChild.position.y = 2
    boxChild.position.z = 0

    boxChild.rotation.x = Math.PI / 4
    boxChild.rotation.y = Math.PI / 4
    boxChild.rotation.z = Math.PI / 4

    boxParent.position.x = 2
    boxParent.position.y = 0
    boxParent.position.z = 0

    boxParent.rotation.x = 0
    boxParent.rotation.y = 0
    boxParent.rotation.z = -Math.PI / 4
    const boxChildAxes = localAxes(1, scene)
    boxChildAxes.parent = boxChild
    showAxis(6, scene)
    return () => {
      babylonjs.dispose()
    }
  }, [])
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas className="cyxScene" style={{ width: '100%', height: '100%' }}></canvas>
      <Button style={{ position: 'fixed', top: 10, right: 10 }} type="primary" onClick={showDrawer}>
        笔记
      </Button>
      <Drawer title="笔记内容" onClose={onClose} open={open} width={600} style={{ overflow: 'hidden', height: 'calc(100%)' }}>
        <div style={{ height: '100%', overflow: 'auto' }}>
          <div>
            {codes.map((code, index) => (
              <div key="index">
                <p>{code.p}</p>
                <Editor
                  key={index}
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
    </div>
  )
}

export default ParenChildren
