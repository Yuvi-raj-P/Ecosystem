import { Environment, Sphere, Stars } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";
import * as THREE from "three";

export const Background = () => {
  return (
    <>
      
      <Sphere scale={[100, 100, 100]} rotation-y={-90}>
        <LayerMaterial 
          lighting="physical" 
          transmission={1} 
          side={THREE.BackSide}
        >
          <Gradient colorA={"#07249b"} colorB={"#09104d"} axes="y" start={-0.3} end={0.5}/>
        </LayerMaterial>
        
      </Sphere>
      
    </>
  );
};