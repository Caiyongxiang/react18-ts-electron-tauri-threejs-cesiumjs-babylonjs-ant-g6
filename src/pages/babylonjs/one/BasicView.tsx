import React, { useEffect, useRef, useState } from 'react'
import { Engine, MeshBuilder, Scene, ArcRotateCamera, Vector3, HemisphericLight } from 'babylonjs'
import { Button, Drawer } from 'antd'
import Editor from 'react-monaco-editor'
import BasicScene from '../../../common/babylonjs/BasicScene'

const codes = [
  {
    p: 'babylonjs渲染步骤:初始化引擎绑定Demo元素,创建场景，引擎循环渲染场景',
    language: 'javascript',
    value: `this.canvas = document.getElementsByClassName(
      "cyxScene"
    )[0] as HTMLCanvasElement;
    this.engine = new Engine(this.canvas); // 初始化引擎
    this.scene = this.createScene(); // 创建场景
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });`,
    height: '300px',
    theme: 'vs-dark'
  },
  {
    p: '创建场景步骤：场景绑定引擎，创建相机绑定Demo元素，创建灯光和盒子绑定场景',
    language: 'javascript',
    value: `createScene(): Scene {
    const scene = new Scene(this.engine),
      camera = new ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2.5,
        3,
        new Vector3(0, 0, 0),
        scene
      );
    camera.attachControl(this.canvas, true); // 注意：修改了拼写错误
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    MeshBuilder.CreateBox("box", {}, scene); // 将盒子添加到场景中

    return scene;
  }`,
    height: '300px',
    theme: 'vs-dark'
  }
]
const BasicView = () => {
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

export default BasicView
