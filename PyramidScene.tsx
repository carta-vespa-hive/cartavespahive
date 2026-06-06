import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { SITES } from "./siteData";

const PYRAMID_LAYOUT = [
  { position: [-4.4, 2.4, -1.6], scale: 1.05, color: "#6fd7d8" },
  { position: [-2.1, 3.2, 0.8], scale: 0.82, color: "#8ce0cb" },
  { position: [0, 1.9, -1.2], scale: 1.35, color: "#b3f0ff" },
  { position: [2.4, 2.9, 0.5], scale: 0.9, color: "#6ec7ff" },
  { position: [4.3, 2.2, -1.1], scale: 1.12, color: "#73f5dd" },
] as const;

function InvertedPyramid({
  siteId,
  position,
  scale,
  color,
  rotationOffset,
}: {
  siteId: string;
  position: [number, number, number];
  scale: number;
  color: string;
  rotationOffset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(1, 1.9, 4, 1);
    geo.rotateY(Math.PI / 4);
    geo.rotateZ(Math.PI);
    return geo;
  }, []);

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 25), [geometry]);

  // Rotate, float, and smoothly interpolate scale based on hover state
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    
    // Base rotation
    groupRef.current.rotation.y = rotationOffset + t * (hovered ? 0.22 : 0.08);
    
    // Smoothly interpolate scale for organic hover reaction
    const targetScale = hovered ? scale * 1.25 : scale;
    groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.12;
    groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.12;
    groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * 0.12;
  });

  // Set cursor
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "pointer";
    }
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    
    // If it's the first site (the hub), scroll to the top or projects section
    // Otherwise, scroll to the specific project ID
    const targetId = siteId === "carta-vespa-hive" ? "projects" : siteId;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.25}>
      <group
        ref={groupRef}
        position={position}
        scale={scale}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        onClick={handleClick}
      >
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color={color}
            transparent
            opacity={hovered ? 0.58 : 0.24}
            roughness={hovered ? 0.05 : 0.1}
            metalness={hovered ? 0.35 : 0.15}
            transmission={hovered ? 0.82 : 0.92}
            thickness={1.8}
            ior={hovered ? 1.25 : 1.18}
            side={THREE.DoubleSide}
          />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial
            color={hovered ? "#ffdd8b" : "#d8ba70"}
            transparent
            opacity={hovered ? 0.95 : 0.72}
          />
        </lineSegments>

        <mesh position={[0, 0.18, 0]} scale={hovered ? 0.72 : 0.58}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.65 : 0.22}
          />
        </mesh>

        <mesh position={[0, 0.9, 0]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.05, 1.15, 8]} />
          <meshBasicMaterial
            color={hovered ? "#ffdca2" : "#c6b282"}
            transparent
            opacity={hovered ? 0.68 : 0.24}
          />
        </mesh>
      </group>
    </Float>
  );
}


function CavernShell() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[15, 32, 32]} />
        <meshStandardMaterial
          color="#090808"
          side={THREE.BackSide}
          roughness={1}
          metalness={0}
        />
      </mesh>

      <mesh position={[0, -4.8, 0]} rotation={[-0.08, 0, 0]}>
        <cylinderGeometry args={[10.5, 13.5, 3.5, 10, 1, true]} />
        <meshStandardMaterial
          color="#0d1314"
          side={THREE.DoubleSide}
          transparent
          opacity={0.95}
        />
      </mesh>

      {[
        [-8, 0, -2],
        [8, -0.4, -3],
        [0, 6.4, -6],
        [-5.5, 5.8, 2.5],
        [5.9, 5.4, 1.8],
      ].map((position, index) => (
        <mesh
          key={index}
          position={position as [number, number, number]}
          rotation={[Math.random() * 0.5, Math.random() * 0.5, 0]}
        >
          <icosahedronGeometry args={[3.2, 0]} />
          <meshStandardMaterial
            color="#111515"
            roughness={1}
            metalness={0.05}
            flatShading
          />
        </mesh>
      ))}
    </>
  );
}

function DustField({ count = 140 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 8 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return buffer;
  }, [count]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#a7ece4"
        size={0.05}
        transparent
        opacity={0.22}
        sizeAttenuation
      />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * 0.03;
    currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * 0.03;

    camera.position.x = Math.sin(t * 0.08) * 0.5 + currentRef.current.x * 0.55;
    camera.position.y = 1.7 + currentRef.current.y * -0.3;
    camera.position.z = 8.1 + Math.cos(t * 0.05) * 0.35;
    camera.lookAt(0, 2.1, -0.8);
  });

  return null;
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 7, 18]} />

      <ambientLight intensity={0.22} />
      <spotLight
        position={[0, 8, 5]}
        angle={0.48}
        penumbra={1}
        intensity={28}
        color="#d2b066"
      />
      <pointLight position={[-5, 2, 1]} intensity={12} color="#4ccfcb" />
      <pointLight position={[5, 3, -2]} intensity={10} color="#7ad8ff" />
      <pointLight position={[0, -1, 3]} intensity={3} color="#0f6f73" />

      <CavernShell />
      <DustField />

      {SITES.map((site, index) => (
        <InvertedPyramid
          key={site.id}
          siteId={site.id}
          position={PYRAMID_LAYOUT[index].position as [number, number, number]}
          scale={PYRAMID_LAYOUT[index].scale}
          color={PYRAMID_LAYOUT[index].color}
          rotationOffset={index * 0.9}
        />
      ))}

      <mesh position={[0, -1.9, -1.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.8, 48]} />
        <meshBasicMaterial color="#4ed6cb" transparent opacity={0.07} />
      </mesh>

      <CameraRig />
    </>
  );
}

export default function PyramidScene({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 1.6, 8.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
