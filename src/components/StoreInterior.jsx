import { useRef, useEffect, useState } from "react";
import { useThree, useLoader, useFrame } from "@react-three/fiber";
import { useGLTF, Text3D, Center, Html } from "@react-three/drei";
import * as THREE from "three";

export default function StoreInterior({ hasEntered, setHasEntered }) {
  const interiorRef = useRef();
  const videoRef = useRef();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const hoverTimeoutRef = useRef(null);

  const { camera, gl } = useThree();

  const pelotonPath = process.env.PUBLIC_URL + "/peloton.glb";
  const sofaPath = process.env.PUBLIC_URL + "/Sofa_main.glb";
  const tablePath = process.env.PUBLIC_URL + "/table.glb";
  const lampPath = process.env.PUBLIC_URL + "/lamp.glb";

  const { scene: bikeModel } = useGLTF(pelotonPath);
  const { scene: sofaModel } = useGLTF(sofaPath);
  const { scene: tableModel } = useGLTF(tablePath);
  const { scene: lampModel } = useGLTF(lampPath);
  const [videoTexture, setVideoTexture] = useState(null);

  useEffect(() => {
    if (bikeModel) {
      console.log("Bike model loaded:", bikeModel);
      bikeModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [bikeModel]);

  // Load wooden texture
  const woodTexture = useLoader(
    THREE.TextureLoader,
    `${process.env.PUBLIC_URL}/wall_texture.jpg`
  );
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(4, 4);

  // Wooden floor
  const woodenFloorTexture = useLoader(
    THREE.TextureLoader,
    `${process.env.PUBLIC_URL}/wooden_floor.jpg`
  );
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(4, 4);

  //   useEffect(() => {
  //     // if (!hasEntered) {
  //     // Set initial camera position
  //     camera.position.set(5, 3, 12);
  //     camera.lookAt(0, 2, 0);
  //     setHasEntered(true);
  //     // }
  //   }, []);

  // Video texture setup
  // useEffect(() => {
  //   const video = document.createElement("video");
  //   video.src = `${process.env.PUBLIC_URL}/pelotonbike.mp4`;
  //   video.crossOrigin = "anonymous";
  //   video.loop = true;
  //   video.playsInline = true;
  //   video.muted = true;

  //   // Create and configure texture
  //   const texture = new THREE.VideoTexture(video);
  //   texture.minFilter = THREE.LinearFilter;
  //   texture.magFilter = THREE.LinearFilter;
  //   texture.format = THREE.RGBAFormat;
  //   texture.colorSpace = THREE.SRGBColorSpace;
  //   texture.generateMipmaps = false;

  //   // Set video texture
  //   setVideoTexture(texture);
  //   videoRef.current = video;

  //   // Start playing
  //   video
  //     .play()
  //     .then(() => {
  //       console.log("Video playing");
  //     })
  //     .catch((error) => {
  //       console.error("Error playing video:", error);
  //     });

  //   // Cleanup
  //   return () => {
  //     video.pause();
  //     video.src = "";
  //     video.load();
  //     texture.dispose();
  //   };
  // }, []);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = `${process.env.PUBLIC_URL}/pelotonbike.mp4`;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.playsInline = true;
    // Remove muted property to allow sound

    // Create and configure texture
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;

    setVideoTexture(texture);
    videoRef.current = video;

    // Only try to play if user has interacted
    if (hasInteracted) {
      video
        .play()
        .then(() => {
          console.log("Video playing with sound");
          setShowPlayButton(false);
        })
        .catch((error) => {
          console.error("Error playing video:", error);
          setShowPlayButton(true);
        });
    }

    return () => {
      video.pause();
      video.src = "";
      video.load();
      texture.dispose();
    };
  }, [hasInteracted]);

  useFrame(() => {
    if (videoTexture) {
      videoTexture.needsUpdate = true;
    }
  });

  return (
    <>
      <group ref={interiorRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#808080" />
        </mesh>

        {/* Store Walls */}
        {/* Back Wall - 25 wide */}
        <mesh position={[0, 10, -6]}>
          <boxGeometry args={[25, 20, 0.2]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>

        {/* Front Wall - 25 wide */}
        {/* <mesh position={[0, 10, 10]}>
          <boxGeometry args={[25, 20, 0.2]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh> */}

        {/* Side Walls - 20 long */}
        <mesh position={[-12.5, 10, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[12, 20, 0.2]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>

        <mesh position={[12.5, 10, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[12, 20, 0.2]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>

        {/* Floor with updated dimensions */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[25, 12]} />
          <meshStandardMaterial map={woodenFloorTexture} />
        </mesh>

        {/* Roof - Added new */}
        <mesh position={[0, 20, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[25, 12]} />
          <meshStandardMaterial
            color="#4a4a4a"
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>

        {/* Ceiling lights */}
        {Array.from({ length: 3 }).map((_, i) => (
          <group key={i} position={[8.33 * (i - 1), 19.8, 0]}>
            {/* Light fixture */}
            <mesh>
              <boxGeometry args={[0.5, 0.2, 0.5]} />
              <meshStandardMaterial color="#303030" metalness={0.8} />
            </mesh>
            {/* Light source */}
            {/* <pointLight
              position={[-15, -15, -15]}
              intensity={5}
              distance={10}
              color="#ffffff"
              castShadow
            /> */}
          </group>
        ))}

        {/* Hero Bike */}
        {bikeModel && (
          <primitive
            object={bikeModel.clone()}
            position={[7, 0.1, 0]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            scale={[0.0035, 0.0035, 0.0035]}
          />
        )}

        {sofaModel && (
          <primitive
            object={sofaModel.clone()}
            position={[-10, 0.1, -1.75]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[3, 3, 3]}
          />
        )}

        {sofaModel && (
          <primitive
            object={tableModel.clone()}
            position={[-5, 0.1, -1.5]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[3, 3, 3]}
          />
        )}

        {lampModel && (
          <group>
            <primitive
              object={lampModel.clone()}
              position={[-5, 1.25, -1]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[3, 3, 3]}
            />
          </group>
        )}

        {/* TV */}
        <group position={[0, 6, -5.7]}>
          {/* Moved slightly forward */}
          {/* TV Frame
          // <mesh>
          //   <boxGeometry args={[10.4, 5.4, 0.3]} />
          //   <meshStandardMaterial
          //     color="black"
          //     metalness={0.5}
          //     roughness={0.3}
          //   />
          // </mesh>
          {/* Video Screen */}
          {/* <mesh position={[0, 0, 0.2]}>
            <planeGeometry args={[10, 5]} />
            {videoTexture ? (
              <meshBasicMaterial
                map={videoTexture}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            ) : (
              <meshBasicMaterial color="black" />
            )}
          </mesh>  */}
          <mesh>
            <boxGeometry args={[10.4, 5.4, 0.3]} />
            <meshStandardMaterial
              color="black"
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>

          {/* Video Screen */}
          {/* <mesh position={[0, 0, 0.2]}>
            <planeGeometry args={[10, 5]} />
            {videoTexture ? (
              <meshBasicMaterial
                map={videoTexture}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            ) : (
              <meshBasicMaterial color="black" />
            )}
          </mesh> */}
          <mesh
            position={[0, 0, 0.2]}
            onPointerEnter={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
              setIsHovering(true);
            }}
            onPointerLeave={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
              hoverTimeoutRef.current = setTimeout(() => {
                setIsHovering(false);
              }, 300); // Add a small delay before hiding
            }}
          >
            <planeGeometry args={[10, 5]} />
            {videoTexture ? (
              <meshBasicMaterial
                map={videoTexture}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            ) : (
              <meshBasicMaterial color="black" />
            )}
          </mesh>

          {/* Play/Pause Button Overlay with improved transitions */}
          {/* Play/Pause Button Overlay */}
          {(showPlayButton || (isHovering && hasInteracted)) && (
            <Html position={[0, 0, 0.3]} center>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasInteracted) {
                    setHasInteracted(true);
                  }
                  if (videoRef.current) {
                    if (isPaused) {
                      videoRef.current
                        .play()
                        .then(() => {
                          setShowPlayButton(false);
                          setIsPaused(false);
                        })
                        .catch((error) => {
                          console.error("Error playing video:", error);
                          setShowPlayButton(true);
                        });
                    } else {
                      videoRef.current.pause();
                      setIsPaused(true);
                    }
                  }
                }}
                style={{
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "opacity 0.3s ease",
                  opacity: isHovering || !hasInteracted ? "1" : "0",
                  backgroundColor: "rgba(0, 0, 0, 0.001)",
                  borderRadius: "50%",
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${
                    isPaused ? "play-button.png" : "pause-button.png"
                  }`}
                  style={{
                    width: "3rem",
                    height: "3rem",
                    transition: "transform 0.3s ease",
                    filter: "drop-shadow(0px 0px 10px rgba(0,0,0,0.5))",
                    // pointerEvents: "none"
                  }}
                  alt={isPaused ? "Play Video" : "Pause Video"}
                />
              </div>
            </Html>
          )}

          {/* Play Button Overlay */}
          {/* {showPlayButton && (
            <Html position={[0, 0, 0.3]} center>
              <img
                src={`${process.env.PUBLIC_URL}/play-button.png`}
                onClick={(e) => {
                  e.stopPropagation();
                  setHasInteracted(true);
                  if (videoRef.current) {
                    videoRef.current
                      .play()
                      .then(() => {
                        console.log("Video playing after button click");
                        setShowPlayButton(false);
                      })
                      .catch((error) => {
                        console.error("Error playing video:", error);
                        setShowPlayButton(true);
                      });
                  }
                }}
                style={{
                  width: "3rem",
                  height: "3rem",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  filter: "drop-shadow(0px 0px 10px rgba(0,0,0,0.5))",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                alt="Play Video"
              />
            </Html>
          )} */}

          {/* {(showPlayButton || (isHovering && hasInteracted)) && (
            <Html position={[0, 0, 0.3]} center>
              <img
                src={`${process.env.PUBLIC_URL}/${
                  isPaused ? "play-button.png" : "pause-button.png"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasInteracted) {
                    setHasInteracted(true);
                  }
                  if (videoRef.current) {
                    if (isPaused) {
                      videoRef.current
                        .play()
                        .then(() => {
                          console.log("Video playing");
                          setShowPlayButton(false);
                          setIsPaused(false);
                        })
                        .catch((error) => {
                          console.error("Error playing video:", error);
                          setShowPlayButton(true);
                        });
                    } else {
                      videoRef.current.pause();
                      setIsPaused(true);
                    }
                  }
                }}
                style={{
                  width: "64px", // Adjust size as needed
                  height: "64px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  filter: "drop-shadow(0px 0px 10px rgba(0,0,0,0.5))",
                  opacity: isHovering || !hasInteracted ? "1" : "0.8",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.opacity = "0.8";
                }}
                alt={isPaused ? "Play Video" : "Pause Video"}
              />
            </Html>
          )} */}

          {/* Add a subtle ambient light near the TV */}
          <pointLight
            position={[0, 0, 2]}
            intensity={0.5}
            distance={5}
            color="#ffffff"
          />
        </group>

        {/* Spotlight for TV */}
        <spotLight
          position={[0, 8, -8]}
          angle={Math.PI / 4}
          penumbra={0.5}
          intensity={3}
          castShadow
          target-position={[0, 6, -9.8]}
        />

        {/* Enhanced Lighting */}
        <ambientLight intensity={1.5} />
        <spotLight
          position={[7, 0.1, 0]}
          angle={Math.PI}
          penumbra={0.5}
          intensity={10}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight
          position={[7.5, 0.1, 0]}
          angle={Math.PI}
          penumbra={0.5}
          intensity={10}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight
          position={[8, 0.1, 0]}
          angle={Math.PI}
          penumbra={0.5}
          intensity={10}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight
          position={[8.5, 0.1, 0]}
          angle={Math.PI}
          penumbra={0.5}
          intensity={10}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {/* <pointLight position={[5, 5, 5]} intensity={0.7} />
        <pointLight position={[-5, 5, 5]} intensity={0.7} />
        <pointLight position={[0, 5, -5]} intensity={0.7} /> */}

        {/* Helper point for orientation */}
        {/* <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#000000" />
        </mesh> */}
      </group>
    </>
  );
}

useGLTF.preload(`${process.env.PUBLIC_URL}/peloton.glb`);
useGLTF.preload(`${process.env.PUBLIC_URL}/Sofa_main.glb`);
useGLTF.preload(`${process.env.PUBLIC_URL}/table.glb`);
useGLTF.preload(`${process.env.PUBLIC_URL}/lamp.glb`);
