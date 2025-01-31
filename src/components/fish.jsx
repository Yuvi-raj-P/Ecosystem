import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Fish({ path = [], speed = 0.5, delay = 0, wavePhase = Math.random() * Math.PI * 2,
  waveAmplitude = 0.3 + Math.random() * 0.4,
  waveFrequency = 1.5 + Math.random() * 1, onComplete, ...props }) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/fishM.glb')
  const { actions } = useAnimations(animations, group)
  const pathIndex = useRef(0)
  const lerpProgress = useRef(0)
  const time = useRef(0)
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024 
    canvas.height = 1024 
    const ctx = canvas.getContext('2d')
    
    const gradient = ctx.createRadialGradient(
      512, 512, 0,  
      512, 512, 512  
    )
    
    gradient.addColorStop(0.3, 'rgba(255, 166, 0, 0.2)') 
    gradient.addColorStop(0.6, 'rgba(255, 166, 0, 0.1)')
    gradient.addColorStop(1, 'rgba(255, 166, 0, 0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 1024)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
}, [])

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [glowTexture])

  useEffect(() => {
    const action = Object.values(actions)[0]
    if (action) {
      action.reset().play()
      action.setLoop(THREE.LoopRepeat)
    }
  }, [actions])

  useFrame((state, delta) => {
    if (path.length < 2 || !group.current) return
  
    time.current += delta * 3

    lerpProgress.current += delta * speed
    const current = new THREE.Vector3(...path[pathIndex.current])
    const next = new THREE.Vector3(...path[(pathIndex.current + 1) % path.length])
    const newPos = current.lerp(next, lerpProgress.current)
    
    const smoothFactor = 0.05
    const targetY = Math.sin(time.current * waveFrequency + wavePhase) * waveAmplitude
    const targetZ = Math.cos(time.current * (waveFrequency * 0.75) + wavePhase) * (waveAmplitude * 0.6)
    
    group.current.position.copy(newPos)
    group.current.position.y += targetY * smoothFactor
    group.current.position.z += targetZ * smoothFactor

    const targetRotZ = Math.sin(time.current * waveFrequency + wavePhase) * 0.1
    const targetRotX = Math.cos(time.current * (waveFrequency * 0.75) + wavePhase) * 0.05
    
    group.current.rotation.z += (targetRotZ - group.current.rotation.z) * smoothFactor
    group.current.rotation.x += (targetRotX - group.current.rotation.x) * smoothFactor
  
    if (lerpProgress.current >= 1) {
      lerpProgress.current = 0
      pathIndex.current = 0
      group.current.position.copy(new THREE.Vector3(...path[0]))
      onComplete?.();
    }
  })

  const emissiveMaterial = new THREE.MeshStandardMaterial({
    color: '#ff5100',
    emissive: '#ff9100',
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.8,
    toneMapped: false
  })
  const planeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [glowTexture])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <group name="koifish_0" position={[-0.268, 0, 0]} rotation={[Math.PI, 0, Math.PI]}>
                <mesh
                  name="mesh_0"
                  castShadow
                  receiveShadow
                  geometry={nodes.mesh_0.geometry}
                  material={emissiveMaterial}
                  morphTargetDictionary={nodes.mesh_0.morphTargetDictionary}
                  morphTargetInfluences={nodes.mesh_0.morphTargetInfluences}
                />
               
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
