import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Text, Clouds, Cloud, Center } from "@react-three/drei";
import { CustomStars } from "./components/CustomStars";
import { CustomWater } from './components/CustomWater';
import { CustomSky } from "./components/CustomSky";
import { Suspense, useState, useEffect, useRef } from "react";
import { Gradient, LayerMaterial } from "lamina";
import * as THREE from "three";
import { Jellyfish } from "./components/Jellyfish";
import { LoadingScreen } from "./components/loadingScreen";
import { Bloom, EffectComposer, ColorAverage, SMAA, SelectiveBloom, Selection, Select } from "@react-three/postprocessing";
import { Fish } from "./components/fish";
import { FogVolume } from './components/fogVolume'
import ForegroundRock from "./components/foregroundRock";
import BackSmallRock from "./components/backsmallRock";
import BigBackRock from "./components/bigbackRock";
import "./components/styles/main.css";

function App() {
  const MAX_FISH = 2;
  const SPAWN_INTERVAL = 5000;
  const [loading, setLoading] = useState(true);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [fishes, setFishes] = useState(() => 
    Array(MAX_FISH).fill(null).map(() => ({
      id: `fish-${Date.now()}-${Math.random()}`,
      active: false
    }))
  );
  const spawnIntervalRef = useRef();
  const activeFishCount = useRef(0);

  useEffect(() => {
    const spawnFish = () => {
      if (activeFishCount.current >= MAX_FISH) return;

      setFishes(prev => {
        const inactiveFishIndex = prev.findIndex(fish => !fish.active);
        if (inactiveFishIndex === -1) return prev;

        const randomPath = fishPaths[Math.floor(Math.random() * fishPaths.length)];
        const newFishes = [...prev];
        newFishes[inactiveFishIndex] = {
          ...randomPath,
          id: `fish-${Date.now()}-${Math.random()}`,
          active: true,
          delay: 0,
          speed: getRandomSpeed()
        };
        activeFishCount.current++;
        return newFishes;
      });
    };

    spawnIntervalRef.current = setInterval(spawnFish, SPAWN_INTERVAL);
    spawnFish(); 

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, []);

  const handleFishComplete = (index) => {
    setFishes(prev => {
      const randomPath = fishPaths[Math.floor(Math.random() * fishPaths.length)];
      const newFishes = [...prev];
      newFishes[index] = {
        ...randomPath,
        id: `fish-${Date.now()}-${Math.random()}`,
        active: true,
        delay: 0,
        speed: getRandomSpeed()
      };
      return newFishes;
    });
  };

  const jellyfishPositions = [
    { position: [19, 9.0, 22.2], scale: [10, 10,10], rotation: [0.2, 0, 0.5] },
    { position: [-8, 9.0, 22.2], scale: [8, 8,8], rotation: [0.5, 20, 0.5] },
    { position: [-14, -4.0, 32.2], scale: [9, 9,9], rotation: [0.2, 0, 0.2] },
    { position: [-20, 16.0, 15.2], scale: [5, 5,5], rotation: [0.2, 0.4, 0.2] },
    { position: [-14, 5.0, 15.2], scale: [5, 5,5], rotation: [0.2, 0.4, 0.2] },
    { position: [-4, 2.0, 15.2], scale: [9, 9,9], rotation: [0.2, 0.4, 0.2] },
    { position: [-28, 6.0, 15.2], scale: [10, 10,10], rotation: [0.2, 0.4, 0.2] },
    { position: [12, 2.0, 15.2], scale: [10, 10,10], rotation: [0.5, 0.4, 0.4] },
    { position: [12, -2.0, 35.2], scale: [10, 10,10], rotation: [0.5, 0.4, 0.4] },
    { position: [-28, -2.0, 31.2], scale: [10, 10,10], rotation: [0.5, 0.4, 0.4] },
    { position: [-33, 2.0, 31.2], scale: [10, 10,10], rotation: [0.5, 0.4, 0.4] },
  ];

  const fishPaths = [
    {path: [[-95, 0.5, 20], [30, 10, 20]], scale: [0.5, 0.5, 0.5]},
    {path: [[-100, 0.5, 20], [30, 10, 20]], scale: [0.5, 0.5, 0.5]},
    {path: [[-90, 0.5, 25], [30, 10, 25]], scale: [0.4, 0.4, 0.4]},
    {path: [[-95, 0.5, 15], [30, 10, 15]], scale: [0.6, 0.6, 0.6]},
    {path: [[-85, 0.5, 30], [30, 10, 30]], scale: [0.45, 0.45, 0.45]},
    {path: [[-105, 0.5, 18], [30, 10, 18]], scale: [0.55, 0.55, 0.55]},
    {path: [[-110, 0.5, 22], [30, 10, 22]], scale: [0.475, 0.475, 0.475]},
    {path: [[-103, 0.5, 28], [30, 10, 28]], scale: [0.525, 0.525, 0.525]},
  ];

  const getRandomSpeed = () => 0.05 + Math.random() * 0.1;

  return (
    <div id="canvas-container" style={{height: "100vh", width: "100vw"}}>
      <div style={{position: "absolute", top: "0", left: "0", height: "100%", width: "100%", border: "5px solid white", borderRadius: "15px", pointerEvents: "none", boxSizing: "border-box"}}></div>
      {loading && <LoadingScreen />}
      <Canvas gl={{ antialias: false, powerPreference: "high-performance", stencil: false, depth: true, toneMapping: THREE.ACESFilmicToneMapping }}
       linear dpr={[1, 2]} camera={{ position: [3.36, 1, 50.02], rotation: [0.16, 0.16, -0.04], fov: 60, near:0.1 }}>
        
        <Clouds material={THREE.MeshBasicMaterial}>
          <Cloud seed={1} bounds={100} segments={1} volume={80} opacity={0.2} color={'#3a64f0'} speed={0} scale={[2,1,1]} position={[-70, 80, -80]} />
          <Cloud seed={3} bounds={100} segments={1} volume={80} opacity={0.2} color={'#5c7ff7'} speed={0} scale={[1,1,1]} position={[-120, 90, -80]} />
          <Cloud seed={3} bounds={100} segments={1} volume={80} opacity={0.2} color={'#3a64f0'} speed={0} scale={[2,1,1]} position={[-40, 60, -80]} />
          <Cloud seed={3} bounds={100} segments={1} volume={80} opacity={0.2} color={'#3a64f0'} speed={0} scale={[2,1,1]} position={[40, 60, -80]} />
        </Clouds>

        <directionalLight position={[300, 300, 100]} intensity={9} color="#c7d2ff" target-position={[-130, -10, -40]} />
        <ambientLight position={[10, 20, 200]} intensity={12} color="#8ba2f7" />

        <EffectComposer multisampling={0}>
          <Bloom 
            intensity={2}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.1}
            height={300}
            radius={0.9}
          />
        </EffectComposer>

        <CustomStars />
        
        <Sphere scale={[900, 900, 900]} rotation-y={-90}>
          <LayerMaterial 
            lighting="physical" 
            transmission={1} 
            side={THREE.BackSide}
            envMapIntensity={0}
            roughness={1}
            metalness={0}
          >
            <Gradient colorA={"#082ca7"} colorB={"#040e6d"} axes="y" start={0.1} end={0.5}/>
          </LayerMaterial>
        </Sphere>

        {fishes.filter(fish => fish?.active && fish?.path).map((fish, index) => (
          <Fish
            key={fish.id}
            path={fish.path}
            speed={fish.speed}
            delay={fish.delay}
            rotation={[-0.2, 0, 0]}
            scale={fish.scale}
            onComplete={() => handleFishComplete(index)}
          />
        ))}

        <Suspense fallback={null}>
          {jellyfishPositions.map((config, index) => (
            <Jellyfish 
              key={index}
              position={config.position}
              scale={config.scale}
              rotation={config.rotation}
            />
          ))}
        </Suspense>

        <CustomWater />
        <ForegroundRock position={[5, -5, 49]} rotation={[0, -2, 0]} scale={[0.8, 0.8, 0.8]} />
        <BackSmallRock position={[-50, 0, -30]} rotation={[0, -2.2, 0]} scale={[0.5, 0.5, 0.5]} />
        <BigBackRock position={[-130, -10, -40]} rotation={[0, -0.7, 0]} scale={[1.4, 1, 1.4]} />
        <CustomText position={[-6, 10, 0]}>Hi, I'm</CustomText>
        <NameText position={[-4, 5, 10]}>Yuvraj</NameText>
      </Canvas>
    </div>
    
  );
}
function CustomText({ children, ...props }) {
  return (
   
      <mesh {...props}>
        <Text
          fontSize={3}
          font="fonts/melo.ttf"
          characters="abcdefghijklmnopqrstuvwxyz"
        >
          {children}
          <meshBasicMaterial
            attach="material"
            color="white"
            
            toneMapped={false}
          />
        </Text>
      </mesh>
    
  );
}
function NameText({ children, ...props }) {
  return (
   
      <mesh {...props}>
        <Text
          fontSize={4}
          font="fonts/mich.otf"
          characters="abcdefghijklmnopqrstuvwxyz"
        >
          {children}
          <meshBasicMaterial
            attach="material"
            color="white"
            
            toneMapped={false}
          />
        </Text>
      </mesh>
    
  );
}
export default App