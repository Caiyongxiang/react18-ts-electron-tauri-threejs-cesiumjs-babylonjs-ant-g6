import THREE from './three'
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true // 开启抗锯齿
})
function rendererfn() {
  renderer.setSize(
    (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetWidth,
    (document.getElementsByClassName('cyxScene')[0] as HTMLElement).offsetHeight
  )
  ;(document.getElementsByClassName('cyxScene')[0] as HTMLElement).appendChild(renderer.domElement)
}
renderer.shadowMap.enabled = true
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1

export { rendererfn, renderer }
