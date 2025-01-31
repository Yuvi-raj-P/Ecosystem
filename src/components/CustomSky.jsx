import { useMemo } from 'react';
import * as THREE from 'three';

export function CustomSky() {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color(0x020339) },
      bottomColor: { value: new THREE.Color(0x07249b) },
      offset: { value: 60 },
      exponent: { value: 0.3 }
    }),
    []
  );

  const vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * worldPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize(vWorldPosition + offset).y;
      gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }
  `;

  return (
    <mesh scale={[1, 1, 1]}>
      <sphereGeometry args={[5000, 32, 32]} />
      <shaderMaterial 
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
      />
    </mesh>
  );
}