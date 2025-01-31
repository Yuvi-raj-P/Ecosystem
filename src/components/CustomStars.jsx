import { useRef, useMemo} from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function CustomStars() {
  const starsRef = useRef();
  
  const starVertices = [];
  const starPhases = [];
  const starSizes = [];
  const uniforms = useMemo(
    () => ({
      time: { value: 0.0 }
    }),
    []
  );
  
  for (let i = 0; i < 4000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloat(60, 2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    
    if (Math.sqrt(x * x + y * y + z * z) > 200) {
      starVertices.push(x, y, z);
      starPhases.push(Math.random() * 2.0 * Math.PI);
      starSizes.push(Math.random() * 6 + 2);
    }
  }

  const vertexShader = `
    attribute float phase;
    attribute float size;
    varying float vPhase;
    void main() {
      vPhase = phase;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform float time;
    varying float vPhase;
    void main() {
      float alpha = 0.8 + 0.5 * sin(time + vPhase);
      vec2 coord = gl_PointCoord - vec2(0.5);
      float distance = length(coord);
      if (distance > 0.5) {
        discard;
      }
      float glow = smoothstep(0.1, 0.3, distance);
      vec3 color = mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 0.0, 1.0), glow);
      gl_FragColor = vec4(color, alpha * (1.0 - distance * 0.5));
    }
  `;

  useFrame((state) => {
    uniforms.time.value = state.clock.getElapsedTime();
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starVertices.length / 3}
          array={new Float32Array(starVertices)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-phase"
          count={starPhases.length}
          array={new Float32Array(starPhases)}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-size"
          count={starSizes.length}
          array={new Float32Array(starSizes)}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
}