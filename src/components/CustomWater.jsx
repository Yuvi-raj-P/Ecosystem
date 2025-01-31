import React, { useRef, useMemo } from "react";
import { extend, useThree, useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });

export function CustomWater() {
  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(
    THREE.TextureLoader, 
    "https://threejs.org/examples/textures/waternormals.jpg"
  );
  
  const foamTexture = useLoader(
    THREE.TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/sprites/spark1.png"
  );

  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  foamTexture.wrapS = foamTexture.wrapT = THREE.RepeatWrapping;
  
  const rockPositions = [
    new THREE.Vector3(40, -2, 50),    // ForegroundRock
    new THREE.Vector3(-50, 0, -30),   // BackSmallRock
    new THREE.Vector3(-130, -10, -40) // BigBackRock
  ];
  
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      foamTexture,
      sunDirection: new THREE.Vector3(),
      sunColor: 0x2432a0,
      waterColor: 0x070b2d,
      foamColor: 0xffffff,
      format: THREE.RGBAFormat,
      distortionScale: 4.5,
      size: 10,
      transparent: true,
      opacity: 0.7,
      foamStrength: 1.5,
      foamScale: 4.0,
      rockPositions: rockPositions,
      foamRadius: 15.0,
      foamIntensity: 100.0
    }),
    [waterNormals, foamTexture]
  );

  useFrame((state, delta) => {
    if (ref.current?.material) {
      const material = ref.current.material;
      material.uniforms.time.value += 0.022;
      material.uniforms.size.value = config.size;
      material.uniforms.distortionScale.value = config.distortionScale;
      
      if (!material.uniforms.foamTexture) {
        material.uniforms.foamTexture = { value: config.foamTexture };
        material.uniforms.foamColor = { value: new THREE.Color(config.foamColor) };
        material.uniforms.foamStrength = { value: config.foamStrength };
        material.uniforms.foamScale = { value: config.foamScale };
        material.uniforms.rockPositions = { value: config.rockPositions };
        material.uniforms.foamRadius = { value: config.foamRadius };
        material.uniforms.foamIntensity = { value: config.foamIntensity };
      }
      
      material.onBeforeCompile = (shader) => {
        shader.uniforms.rockPositions = material.uniforms.rockPositions;
        shader.uniforms.foamRadius = material.uniforms.foamRadius;
        shader.uniforms.foamIntensity = material.uniforms.foamIntensity;

        shader.fragmentShader = shader.fragmentShader
          .replace(
            '#include <common>',
            `
            #include <common>
            uniform sampler2D foamTexture;
            uniform vec3 foamColor;
            uniform float foamStrength;
            uniform float foamScale;
            uniform vec3 rockPositions[3];
            uniform float foamRadius;
            uniform float foamIntensity;

            float calculateFoamAroundRock(vec3 worldPos) {
              float foam = 0.0;
              for(int i = 0; i < 3; i++) {
                vec3 rockPos = rockPositions[i];
                float dist = length(worldPos.xz - rockPos.xz);
                foam += smoothstep(foamRadius, 0.0, dist) * foamIntensity;
              }
              return clamp(foam, 0.0, 1.0);
            }
            `
          )
          .replace(
            'gl_FragColor = vec4( color, alpha );',
            `
            vec3 worldPosition = vec3(modelMatrix * vec4(position, 1.0));
            float rockFoam = calculateFoamAroundRock(worldPosition);
            float foam = texture2D(foamTexture, vUv * foamScale).r;
            foam = max(foam * smoothstep(0.4, 1.0, distortedNormal.y) * foamStrength, rockFoam);
            color = mix(color, foamColor, foam);
            gl_FragColor = vec4(color, alpha);
            `
          );
      };
      
      material.transparent = true;
      material.opacity = config.opacity;
      material.needsUpdate = true;
    }
  });

  return (
    <water
      ref={ref}
      args={[geom, config]}
      rotation-x={-Math.PI / 2}
      position={[0, -1, 0]}
      transparent
      userData={{ frustumCulled: true }}
    />
  );
}