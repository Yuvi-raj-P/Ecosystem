import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/rockforeground.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.SM_LittleRock_06_M_LittleRock_06_0.geometry}
        material={materials.M_LittleRock_06}
        scale={[0.04, 0.039, 0.026]}
      />
    </group>
  )
}

useGLTF.preload('/rockforeground.glb')
