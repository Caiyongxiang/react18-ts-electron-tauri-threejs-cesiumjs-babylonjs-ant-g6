import React, { useEffect, useRef, useState } from 'react'
import { Button, Drawer } from 'antd'
import Editor from 'react-monaco-editor'
import { windowinit } from '../../../common/hook/winodwinit'
// 封装一个自定义的Editor组件
const CustomEditor = ({ height = '200px', language = 'javascript', value = '', theme = 'vs-dark', ...props }) => {
  return <Editor height={height} language={language} value={value} theme={theme} {...props} />
}
const codes = [
  {
    p: 'webgl创建三角形',
    language: 'javascript',
    value: `const canvasEl = document.querySelector('#cyxScene') as any
    canvasEl.width = document.body.clientWidth // 设置 canvas 画布的宽度
    canvasEl.height = document.body.clientHeight // 设置 canvas 画布的高度

    const gl = canvasEl.getContext('webgl') // 获取 WebGL 上下文

    // 创建顶点着色器 语法 gl.createShader(type) 此处 type 为枚举型值为 gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER 两者中的一个
    const vShader = gl.createShader(gl.VERTEX_SHADER)
    // 编写顶点着色器的 GLSL 代码 语法 gl.shaderSource(shader, source); shader - 用于设置程序代码的 webglShader（着色器对象) source - 包含 GLSL 程序代码的字符串
    gl.shaderSource(
      vShader,
      '
          attribute vec4 v_position;

          void main() {
            gl_Position = v_position; // 设置顶点位置
          }
        '
    )
    gl.compileShader(vShader) // 编译着色器代码

    const fShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(
      fShader,
      '
          precision mediump float;
          uniform vec4 f_color;
          void main() {
            gl_FragColor = f_color; // 设置片元颜色
          }
        '
    ) // 编写片元着色器代码
    gl.compileShader(fShader) // 编译着色器代码

    // 创建一个程序用于连接顶点着色器和片元着色器
    const program = gl.createProgram()
    gl.attachShader(program, vShader) // 添加顶点着色器
    gl.attachShader(program, fShader) // 添加片元着色器
    gl.linkProgram(program) // 连接 program 中的着色器

    gl.useProgram(program) // 告诉 WebGL 用这个 program 进行渲染

    //   用于指定uniform变量在 GPU 内存中的位置
    const color = gl.getUniformLocation(program, 'f_color')
    // 获取 f_color 变量位置
    gl.uniform4f(color, 0.93, 0, 0.56, 1) // 设置它的值

    const position = gl.getAttribLocation(program, 'v_position')
    // 获取 v_position 位置
    const pBuffer = gl.createBuffer()

    // 创建一个顶点缓冲对象，返回其 id，用来放三角形顶点数据，
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer)
    // 将这个顶点缓冲对象绑定到 gl.ARRAY_BUFFER
    // 后续对 gl.ARRAY_BUFFER 的操作都会映射到这个缓存
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0.5, 0.5, 0, -0.5, -0.5]), // 三角形的三个顶点
      // 因为会将数据发送到 GPU，为了省去数据解析，这里使用 Float32Array 直接传送数据
      gl.STATIC_DRAW // 表示缓冲区的内容不会经常更改
    )
    // 将顶点数据加入的刚刚创建的缓存对象

    gl.vertexAttribPointer(
      // 告诉 OpenGL 如何从 Buffer 中获取数据
      position, // 顶点属性的索引
      2, // 组成数量，必须是 1，2，3 或 4。我们只提供了 x 和 y
      gl.FLOAT, // 每个元素的数据类型
      false, // 是否归一化到特定的范围，对 FLOAT 类型数据设置无效
      0, // stride 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让 OpenGL 决定具体步长
      0 // offset 字节偏移量，必须是类型的字节长度的倍数。
    )
    gl.enableVertexAttribArray(position)
    // 开启 attribute 变量额，使顶点着色器能够访问缓冲区数据

    gl.clearColor(1, 1, 1, 1) // 设置清空颜色缓冲时的颜色值
    gl.clear(gl.COLOR_BUFFER_BIT) // 清空颜色缓冲区，也就是清空画布
    // 语法 gl.drawArrays(mode, first, count); mode - 指定绘制图元的方式 first - 指定从哪个点开始绘制 count - 指定绘制需要使用到多少个点
    gl.drawArrays(gl.TRIANGLES, 0, 3)`,
    height: '400px',
    theme: 'vs-dark'
  }
]
const WebGlDemo = () => {
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
  useEffect(() => {
    const canvasEl = document.querySelector('#cyxScene') as any
    canvasEl.width = document.body.clientWidth // 设置 canvas 画布的宽度
    canvasEl.height = document.body.clientHeight // 设置 canvas 画布的高度

    const gl = canvasEl.getContext('webgl') // 获取 WebGL 上下文

    // 创建顶点着色器 语法 gl.createShader(type) 此处 type 为枚举型值为 gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER 两者中的一个
    const vShader = gl.createShader(gl.VERTEX_SHADER)
    // 编写顶点着色器的 GLSL 代码 语法 gl.shaderSource(shader, source); shader - 用于设置程序代码的 webglShader（着色器对象) source - 包含 GLSL 程序代码的字符串
    gl.shaderSource(
      vShader,
      `
          attribute vec4 v_position;

          void main() {
            gl_Position = v_position; // 设置顶点位置
          }
        `
    )
    gl.compileShader(vShader) // 编译着色器代码

    const fShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(
      fShader,
      `
          precision mediump float;
          uniform vec4 f_color;
          void main() {
            gl_FragColor = f_color; // 设置片元颜色
          }
        `
    ) // 编写片元着色器代码
    gl.compileShader(fShader) // 编译着色器代码

    // 创建一个程序用于连接顶点着色器和片元着色器
    const program = gl.createProgram()
    gl.attachShader(program, vShader) // 添加顶点着色器
    gl.attachShader(program, fShader) // 添加片元着色器
    gl.linkProgram(program) // 连接 program 中的着色器

    gl.useProgram(program) // 告诉 WebGL 用这个 program 进行渲染

    //   用于指定uniform变量在 GPU 内存中的位置
    const color = gl.getUniformLocation(program, 'f_color')
    // 获取 f_color 变量位置
    gl.uniform4f(color, 0.93, 0, 0.56, 1) // 设置它的值

    const position = gl.getAttribLocation(program, 'v_position')
    // 获取 v_position 位置
    const pBuffer = gl.createBuffer()

    // 创建一个顶点缓冲对象，返回其 id，用来放三角形顶点数据，
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer)
    // 将这个顶点缓冲对象绑定到 gl.ARRAY_BUFFER
    // 后续对 gl.ARRAY_BUFFER 的操作都会映射到这个缓存
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0.5, 0.5, 0, -0.5, -0.5]), // 三角形的三个顶点
      // 因为会将数据发送到 GPU，为了省去数据解析，这里使用 Float32Array 直接传送数据
      gl.STATIC_DRAW // 表示缓冲区的内容不会经常更改
    )
    // 将顶点数据加入的刚刚创建的缓存对象

    gl.vertexAttribPointer(
      // 告诉 OpenGL 如何从 Buffer 中获取数据
      position, // 顶点属性的索引
      2, // 组成数量，必须是 1，2，3 或 4。我们只提供了 x 和 y
      gl.FLOAT, // 每个元素的数据类型
      false, // 是否归一化到特定的范围，对 FLOAT 类型数据设置无效
      0, // stride 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让 OpenGL 决定具体步长
      0 // offset 字节偏移量，必须是类型的字节长度的倍数。
    )
    gl.enableVertexAttribArray(position)
    // 开启 attribute 变量额，使顶点着色器能够访问缓冲区数据

    gl.clearColor(1, 1, 1, 1) // 设置清空颜色缓冲时的颜色值
    gl.clear(gl.COLOR_BUFFER_BIT) // 清空颜色缓冲区，也就是清空画布
    // 语法 gl.drawArrays(mode, first, count); mode - 指定绘制图元的方式 first - 指定从哪个点开始绘制 count - 指定绘制需要使用到多少个点
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current) // 取消动画帧
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
      <canvas id="cyxScene" style={{ width: '100%', height: '100%' }}></canvas>
    </div>
  )
}

export default WebGlDemo
