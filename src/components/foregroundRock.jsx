import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function ForegroundRock(props) {
  const { nodes } = useGLTF('/rockforeground.glb')
  
  const rockyMaterial = new THREE.MeshStandardMaterial({
    color: '#061038',
    roughness: 0.8,
    metalness: 0.2,
    flatShading: true,
    side: THREE.DoubleSide
  })

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.SM_LittleRock_06_M_LittleRock_06_0.geometry}
        material={rockyMaterial}
        scale={[0.04, 0.039, 0.026]}
      />
    </group>
  )
}

useGLTF.preload('/rockforeground.glb')