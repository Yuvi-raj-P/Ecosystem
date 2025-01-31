import React, { useMemo } from 'react'
import { Fish } from './fish'
import * as THREE from 'three'

export function FishGroup() {
    const curve = useMemo(() => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-20, 0, 0),  
        new THREE.Vector3(-10, 7, -10),
        new THREE.Vector3(0, 0, -20),
        new THREE.Vector3(10, -7, -10),
        new THREE.Vector3(20, 0, 0),
        new THREE.Vector3(10, 7, 10),
        new THREE.Vector3(0, 0, 20),
        new THREE.Vector3(-10, -7, 10),
      ], true);
      
      return curve;
    }, []);
  
    const fishConfigs = useMemo(() => {
      const configs = Array.from({ length: 5 }, (_, i) => ({
        timeOffset: i * 0.15,
        heightOffset: Math.sin(i) * 2, 
        sideOffset: Math.cos(i) * 2,
        speed: 0.2,  
        scale: [0.02, 0.02, 0.02], 
        fishIndex: i
      }));
      
      return configs;
    }, []);

    return (
      <>
        <group>
          {curve.getPoints(50).map((point, i) => (
            <mesh key={i} position={point}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial color="red" />
            </mesh>
          ))}
        </group>
        {fishConfigs.map((config, i) => (
          <Fish
            key={i}
            curve={curve}
            {...config}
          />
        ))}
      </>
    );
}