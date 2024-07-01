import React, { useEffect, useRef, useState } from 'react'
import { Engine, MeshBuilder, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader } from 'babylonjs'
import { Button, Drawer } from 'antd'
import Editor from 'react-monaco-editor'
import BasicScene from '../../../common/babylonjs/BasicScene'
const ImportModel = () => {
  const code = `SceneLoader.ImportMeshAsync(
      '',
      "https://assets.babylonjs.com/meshes/",
      "both_houses_scene.babylon"
    ).then(() => {
      const house = scene.getMeshByName("detached_house")!;
      house.position.y = 1;
    });`
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
    SceneLoader.ImportMeshAsync('', 'https://assets.babylonjs.com/meshes/', 'both_houses_scene.babylon').then(result => {
      const house = scene.getMeshByName('detached_house')!
      house.position.y = 1
    })
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
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <p>加载和操作模型</p>
          <Editor options={options} height="300px" language="javascript" value={code} theme="vs-dark" />
        </div>
      </Drawer>
    </div>
  )
}

export default ImportModel
