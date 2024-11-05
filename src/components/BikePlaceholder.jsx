// src/components/BikePlaceholder.jsx
export default function BikePlaceholder({ position, rotation, scale }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Frame */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Wheels */}
      <mesh position={[-0.8, 0, 0]}>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.8, 0, 0]}>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}
