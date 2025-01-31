import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useGraph, useFrame } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";

export function Jellyfish(props) {
  const group = useRef();
  const { scene, materials, animations } = useGLTF('/NewJellyFish/JellyFishFinal.glb');
  const { actions } = useAnimations(animations, group);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);
  const [initialY] = useState(props.position[1]);
  const [currentY, setCurrentY] = useState(props.position[1]);
  
  const speed = useMemo(() => ({
    x: -(Math.random() * 0.2 + 0.1),
    y: Math.random() * (0.08 - 0.01) + 0.01,
  }), []);
  const waveParams = useMemo(() => ({
    phaseOffset: Math.random() * Math.PI * 2,
    frequency1: Math.random() * 0.5 + 1.5,  
    frequency2: Math.random() * 0.3 + 0.7,  
    amplitude1: Math.random() * 0.3 + 0.3,  
    amplitude2: Math.random() * 0.2 + 0.1  
  }), []);

 
  const material = useMemo(() => {
    if (materials.Material_0) {
      const clonedMaterial = materials.Material_0.clone();
      clonedMaterial.color.set('#FFFFFF');
      const emissiveColor = Math.random() > 0.5 ? '#FFB042' : '#E0FFFF';
      clonedMaterial.emissive.set(emissiveColor);
      clonedMaterial.emissiveIntensity = 1;
      clonedMaterial.transparent = true;
      clonedMaterial.opacity = 0.35;
      clonedMaterial.depthWrite = false;
      return clonedMaterial;
    }
  }, [materials]);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach(action => {
        const delay = Math.random() * 5; 
        setTimeout(() => {
          action.play();
          action.timeScale = 0.5; 
        }, delay * 1000);
      });
    }
  }, [actions]);

  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.x += speed.x * delta;

      const time = state.clock.getElapsedTime();
      const wave1 = Math.sin(time * waveParams.frequency1 + waveParams.phaseOffset) * waveParams.amplitude1;
      const wave2 = Math.cos(time * waveParams.frequency2) * waveParams.amplitude2;
      const waveOffset = wave1 + wave2;

      const newY = currentY + speed.y * delta;
      setCurrentY(newY);
      group.current.position.y = newY + waveOffset;

      if (group.current.position.x < -35) {
        group.current.position.x = 35;
        setCurrentY(initialY + (Math.random() * 10 - 5));
      }
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="JellyFish_(Scyphozoa)">
          <group name="Jellyfish_bone_27">
            <group name="GLTF_created_0">
              <skinnedMesh
                name="_gltfNode_0"
                geometry={nodes._gltfNode_0.geometry}
                material={material}
                skeleton={nodes._gltfNode_0.skeleton}
              />
              <primitive object={nodes.Nyi_jellyfish_bone_25} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/NewJellyFish/JellyFishFinal.glb');