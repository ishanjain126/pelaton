// src/components/Scene.jsx
import { useEffect } from "react";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import StoreExterior from "./StoreExterior";
import StoreInterior from "./StoreInterior";

export default function Scene({
  isInside,
  setIsInside,
  hasEnteredStore,
  setHasEnteredStore,
  setIsLoading,
}) {
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleEnterStore = () => {
    console.log("Entering store...");
    setIsInside(true);
  };

  return (
    <>
      {/* {!isInside ? (
        <StoreExterior onEnter={handleEnterStore} />
      ) : ( */}
      {/* <Environment
        // files="https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@environment/public/img/venice_sunset_1k.hdr"
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/modern_buildings_2_1k.hdr"
        background
        // blur={0.5}
        // Add these properties
        ground={{
          height: 15, // Height of the environment
          radius: 60, // How far the ground extends
          scale: 100, // Scale of the environment map
        }}
      /> */}
      {/* 
      <PerspectiveCamera
        // makeDefault
        position={[0, 1.7, 8]} // Eye level height (1.7 meters) and closer to the scene
        fov={100} // Narrower FOV for more natural perspective
      /> */}

      <StoreInterior
        hasEntered={hasEnteredStore}
        setHasEntered={setHasEnteredStore}
      />
      {/* )} */}

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={1}
        panSpeed={1}
        rotateSpeed={0.8}
        minDistance={0.1}
        maxDistance={10}
        // minPolarAngle={0}
        // maxPolarAngle={Math.PI / 2}
        // target={[0, 0.5, 0]}
        minPolarAngle={Math.PI / 4} // Limit how low can look
        maxPolarAngle={Math.PI / 2} // Limit how high can look
        target={[0, 1.7, 0]}
      />
    </>
  );
}
