import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function BackSmallRock(props) {
  const { nodes } = useGLTF('/rock2.glb')
  
  const rockMaterial = new THREE.MeshStandardMaterial({
    color: '#0a1b21',
    roughness: 0.8,
    metalness: 0.2,
    flatShading: true,
    side: THREE.DoubleSide
  })

  return (
    <group {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SM_LittleRock_02_M_LittleRock_02_0.geometry}
          material={rockMaterial}
          scale={0.079}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/rock2.glb')