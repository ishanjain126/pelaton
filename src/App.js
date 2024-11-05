import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Scene from "./components/Scene";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInside, setIsInside] = useState(false);
  const [hasEnteredStore, setHasEnteredStore] = useState(false);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 75 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <color attach="background" args={["#808080"]} />
        <Suspense fallback={null}>
          <Scene
            isInside={isInside}
            setIsInside={setIsInside}
            hasEnteredStore={hasEnteredStore}
            setHasEnteredStore={setHasEnteredStore}
            setIsLoading={setIsLoading}
          />
        </Suspense>
      </Canvas>
    </>
  );
}
