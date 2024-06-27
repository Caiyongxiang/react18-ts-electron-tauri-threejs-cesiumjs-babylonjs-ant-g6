import React, { useEffect, useRef, useState } from 'react'
import {
  Engine,
  MeshBuilder,
  Scene,
  Mesh,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Sound,
  StandardMaterial,
  Color3,
  Texture,
  Vector4,
  SceneLoader
} from 'babylonjs'
import { Button, Drawer } from 'antd'
import Editor from 'react-monaco-editor'
import BasicScene from '../../common/babylonjs/BasicScene'
import 'babylonjs-loaders'
const Village = () => {
  const codes = [
    {
      p: '创建地面',
      language: 'javascript',
      value: `MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene)`,
      height: '100px',
      theme: 'vs-dark'
    },
    {
      p: '创建音频',
      language: 'javascript',
      value: `new Sound(
      "cello",
      "https://playground.babylonjs.com/sounds/cellolong.wav",
      scene,
      null,
      { loop: true, autoplay: true }
    );`,
      height: '100px',
      theme: 'vs-dark'
    },
    {
      p: '房顶',
      language: 'javascript',
      value: `const roof = MeshBuilder.CreateCylinder(
      "roof",
      {
        diameter: 1.3,
        height: 1.2,
        tessellation: 3,
      },
      scene
    );
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;`,
      height: '100px',
      theme: 'vs-dark'
    },
    {
      p: '材质',
      language: 'javascript',
      value: `const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseColor = new Color3(0, 1, 0);
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      scene
    ); //地面
    ground.material = groundMat;
        const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/roof.jpg"
    );
    roof.material = roofMat;`,
      height: '150px',
      theme: 'vs-dark'
    },
    {
      p: '纹理UV UV是为了确定贴图的位置,如果没有的话，默认所有面都加贴图全部,加了uv相当于每个面的贴图都有剪切的效果',
      language: 'javascript',
      value: `const faceUV = [
        new Vector4(0.5, 0.0, 0.75, 1.0),
        new Vector4(0.0, 0.0, 0.25, 1.0),
        new Vector4(0.25, 0, 0.5, 1.0),
        new Vector4(0.75, 0, 1.0, 1.0),
      ],
      box = MeshBuilder.CreateBox(
        "box",
        {
          faceUV,
          wrap: true,
          // width: 2,
          // height: 1.5,
          // depth: 3,
        },
        scene
      );`,
      height: '150px',
      theme: 'vs-dark'
    },
    {
      p: '合并网格',
      language: 'javascript',
      value: `const house = Mesh.MergeMeshes(
      [box, roof],
      true,
      false,
      undefined,
      false,
      true
    );`,
      height: '100px',
      theme: 'vs-dark'
    }
  ]
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
    const faceUV = [
        new Vector4(0.5, 0.0, 0.75, 1.0),
        new Vector4(0.0, 0.0, 0.25, 1.0),
        new Vector4(0.25, 0, 0.5, 1.0),
        new Vector4(0.75, 0, 1.0, 1.0)
      ],
      box = MeshBuilder.CreateBox(
        'box',
        {
          faceUV,
          wrap: true
          // width: 2,
          // height: 1.5,
          // depth: 3,
        },
        scene
      ) // 将盒子添加到场景中
    box.position.y = 0.5
    MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene)
    // new Sound('cello', 'https://playground.babylonjs.com/sounds/cellolong.wav', scene, null, { loop: true, autoplay: true })
    const bounce = new Sound('bounce', 'https://playground.babylonjs.com/sounds/bounce.wav', scene)
    bounce.play()
    //三角形
    const roof = MeshBuilder.CreateCylinder(
      'roof',
      {
        diameter: 1.3,
        height: 1.2,
        tessellation: 3
      },
      scene
    )
    roof.scaling.x = 0.75
    roof.rotation.z = Math.PI / 2
    roof.position.y = 1.22
    const groundMat = new StandardMaterial('groundMat')
    groundMat.diffuseColor = new Color3(0, 1, 0)
    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene) //地面
    ground.material = groundMat
    const roofMat = new StandardMaterial('roofMat')
    roofMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/roof.jpg')
    roof.material = roofMat
    const boxMat = new StandardMaterial('boxMat')
    boxMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/cubehouse.png')
    box.material = boxMat
    const house = Mesh.MergeMeshes([box, roof], true, false, undefined, false, true)
    console.log(house)
    SceneLoader.ImportMeshAsync('', 'https://assets.babylonjs.com/meshes/', 'village.glb')
    return () => {
      babylonjs.dispose()
    }
  })
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

export default Village
