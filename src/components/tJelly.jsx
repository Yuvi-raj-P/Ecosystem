import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useGraph } from "@react-three/fiber"
import * as THREE from 'three'
import { SkeletonUtils } from "three-stdlib"

export function TJelly(props) {
  const group = useRef()
  const { scene, materials, animations } = useGLTF('/tJelly.glb')
  const { actions } = useAnimations(animations, group)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes } = useGraph(clone)

  useEffect(() => {
    if (materials['Material.006']) {
      materials['Material.006'].color = new THREE.Color(0xffffff)
      materials['Material.006'].emissive = new THREE.Color(0xffffff)
      materials['Material.006'].emissiveIntensity = 0.5
      materials['Material.006'].roughness = 1
      materials['Material.006'].metalness = 0
      materials['Material.006'].envMapIntensity = 0
      materials['Material.006'].receiveShadow = false
      materials['Material.006'].castShadow = false

      materials['Material.006'].vertexColors = false
      materials['Material.006'].side = THREE.DoubleSide
      materials['Material.006'].flatShading = false

      materials['Material.006'].transparent = true
      materials['Material.006'].blending = THREE.AdditiveBlending
      materials['Material.006'].opacity = 1
      materials['Material.006'].alphaTest = 0
      materials['Material.006'].depthTest = false
      materials['Material.006'].depthWrite = false
      
      materials['Material.006'].needsUpdate = true
    }
    if (materials['Material.005']) {

      materials['Material.005'].color = new THREE.Color(0xffffff)
      materials['Material.005'].emissive = new THREE.Color(0xffffff)
      materials['Material.005'].emissiveIntensity = 0.2
      materials['Material.005'].roughness = 0.34
      materials['Material.005'].metalness = 0
      materials['Material.005'].envMapIntensity = 0
      materials['Material.005'].receiveShadow = false
      materials['Material.005'].castShadow = false
      

      materials['Material.005'].vertexColors = false
      materials['Material.005'].side = THREE.DoubleSide
      materials['Material.005'].flatShading = false

      materials['Material.005'].transparent = true
      materials['Material.005'].blending = THREE.NormalBlending
      materials['Material.005'].opacity = 0.9
      materials['Material.005'].alphaTest = 0

      materials['Material.005'].depthTest = true
      materials['Material.005'].depthWrite = false
      
      materials['Material.005'].needsUpdate = true
    }
    if (materials['Material.007']) {

      materials['Material.007'].color = new THREE.Color(0x69E7E0)
      materials['Material.007'].emissive = new THREE.Color(0x1B47FF)
      materials['Material.007'].emissiveIntensity = 15
      materials['Material.007'].roughness = 0.5
      materials['Material.007'].metalness = 0
      
      materials['Material.007'].vertexColors = false
      materials['Material.007'].side = THREE.DoubleSide
      materials['Material.007'].flatShading = false

      materials['Material.007'].transparent = true
      materials['Material.007'].blending = THREE.AdditiveBlending
      materials['Material.007'].opacity = 0.1
      materials['Material.007'].alphaTest = 0

      materials['Material.007'].depthTest = true
      materials['Material.007'].depthWrite = true
      
      materials['Material.007'].needsUpdate = true
    }
    Object.values(actions).forEach(action => {
      action.play()
      action.repetitions = Infinity
      action.clampWhenFinished = true
    })
  }, [materials, actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="sJellyglb">
          <group name="Moon_Jellyfish">
            <group
              name="Armature_8"
              position={[0.013, 0.049, -0.074]}
              rotation={[0.168, 0, 0]}
              scale={0.842}>
              <group name="GLTF_created_0">
                <skinnedMesh
                  name="Inside"
                  geometry={nodes.Inside.geometry}
                  material={materials['Material.006']}
                  skeleton={nodes.Inside.skeleton}
                />
                <skinnedMesh
                  name="Swiggything"
                  geometry={nodes.Swiggything.geometry}
                  material={materials['Material.007']}
                  skeleton={nodes.Swiggything.skeleton}
                />
                <skinnedMesh
                  name="TopLayer"
                  geometry={nodes.TopLayer.geometry}
                  material={materials['Material.005']}
                  skeleton={nodes.TopLayer.skeleton}
                />
                <primitive object={nodes.Bone_5} />
                <primitive object={nodes.Bone001_6} />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/tJelly.glb')