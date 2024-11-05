// src/components/StoreExterior.jsx
import { useRef } from "react";

export default function StoreExterior({ onEnter }) {
  console.log("outside store");
  const storeRef = useRef();

  const handleStoreEnter = (e) => {
    e.stopPropagation();
    console.log("Store entrance clicked");
    onEnter();
  };

  return (
    <group ref={storeRef}>
      {/* Store Building */}
      <mesh position={[0, 5, 0]} receiveShadow castShadow>
        <boxGeometry args={[20, 10, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Store Front - Interactive entrance */}
      <mesh
        position={[0, 5, 10]}
        onClick={handleStoreEnter}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "default";
        }}
      >
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial
          color="#333"
          transparent
          opacity={0.5}
          emissive="#666"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 8, 12]} intensity={0.5} color="#ffffff" />
    </group>
  );
}
