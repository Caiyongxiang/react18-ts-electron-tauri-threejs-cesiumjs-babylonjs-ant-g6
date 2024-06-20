import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fncamera } from '../three/camera'
import { rendererfn } from '../three/renderer'
import animate from '../three/animate'

// 钩子用于处理导航
function useNavigation() {
  const navigate = useNavigate()
  const onClick = (e: { key: string }) => {
    navigate(`/${e.key}`, { replace: false })
  }
  return onClick
}

// 钩子用于设置Three.js
function useThreeSetup() {
  useEffect(() => {
    fncamera()
    rendererfn()
    animate()
  }, [])
}
export { useThreeSetup, useNavigation }
