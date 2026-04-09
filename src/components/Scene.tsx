import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  OrbitControls,
  Sparkles,
  Text,
  useGLTF
} from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type FocusKey = "none" | "ring" | "king" | "board" | "glass" | "football";

type FocusConfig = {
  target: THREE.Vector3;
  lookAt: THREE.Vector3;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function FootballTexture() {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("/football-texture.png");

    texture.colorSpace = THREE.SRGBColorSpace;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // 🔥 FIX distortion
    texture.repeat.set(2, 1.2);
    texture.offset.set(0, 0.2);

    // rotate so pattern aligns better
    texture.center.set(0.5, 0.5);
    texture.rotation = Math.PI / 2;

    return texture;
  }, []);
}

function Football({ position, emphasis = 0 }: { position: [number, number, number]; emphasis?: number }) {
  const group = useRef<THREE.Group>(null);

  const { scene } = useGLTF("/football/soccer_ball.gltf");

  useFrame((state) => {
    if (!group.current) return;

    const scale = lerp(0.8, 1.2, emphasis);
    group.current.scale.setScalar(scale);

    // smooth rotation
    group.current.rotation.y += 0.01;
    group.current.rotation.x += 0.005;

    // floating motion
    group.current.position.y =
      position[1] +
      Math.sin(state.clock.elapsedTime * 1.2) * (0.12 + emphasis * 0.08);
  });

  return (
    <group ref={group} position={position}>
      <primitive object={scene.clone()} scale={1.3} />
    </group>
  );
}

function GlassOrb({
  position,
  emphasis = 0,
  color = "#a3ffd1"
}: {
  position: [number, number, number];
  emphasis?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const scale = lerp(0.7, 1.18, emphasis);
    ref.current.scale.setScalar(scale);
    ref.current.rotation.y = state.clock.elapsedTime * 0.25;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * (0.08 + emphasis * 0.05);
  });

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.65, 2]} />
      <MeshTransmissionMaterial
        thickness={0.3}
        roughness={0.05}
        transmission={1}
        chromaticAberration={0.04}
        backside
        samples={8}
        color={color}
        distortion={0.08}
        distortionScale={0.3}
        temporalDistortion={0.18}
      />
    </mesh>
  );
}

function ChessKing({ position, emphasis = 0 }: { position: [number, number, number]; emphasis?: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const scale = lerp(0.95, 1.3, emphasis);
    group.current.scale.setScalar(scale);
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * (0.35 + emphasis * 0.22);
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9) * (0.08 + emphasis * 0.07);
  });

  return (
    <group ref={group} position={position}>
      <mesh position={[0, -0.9, 0]} castShadow>
        <cylinderGeometry args={[1.05, 1.25, 0.35, 48]} />
        <meshStandardMaterial color="#113a2a" metalness={0.55} roughness={0.18} />
      </mesh>

      <mesh position={[0, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.85, 0.9, 48]} />
        <meshStandardMaterial color="#1ecf7a" metalness={0.65} roughness={0.12} />
      </mesh>

      <mesh position={[0, 0.35, 0]} castShadow>
        <torusGeometry args={[0.48, 0.09, 24, 64]} />
        <meshStandardMaterial color="#b4ffd8" metalness={1} roughness={0.1} />
      </mesh>

      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.42, 0.6, 40]} />
        <meshStandardMaterial color="#31f0a0" metalness={0.8} roughness={0.12} />
      </mesh>

      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#d8ffe9" metalness={0.8} roughness={0.08} />
      </mesh>

      <mesh position={[0, 1.42, 0]} castShadow>
        <boxGeometry args={[0.12, 0.48, 0.12]} />
        <meshStandardMaterial color="#e9fff4" metalness={0.7} roughness={0.05} />
      </mesh>

      <mesh position={[0, 1.42, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.12, 0.48, 0.12]} />
        <meshStandardMaterial color="#e9fff4" metalness={0.7} roughness={0.05} />
      </mesh>
    </group>
  );
}

function Board({
  position,
  rotation = [0, 0, 0],
  emphasis = 0
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  emphasis?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const scale = lerp(1, 1.35, emphasis);
    ref.current.scale.setScalar(scale);
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * (0.07 + emphasis * 0.05);
    ref.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={[2.2, 1.2, 0.07]} />
      <MeshTransmissionMaterial
        color="#7dffc2"
        transmission={1}
        thickness={0.28}
        roughness={0.12}
        backside
        chromaticAberration={0.05}
      />
    </mesh>
  );
}

function Ring({
  position,
  rotation = [0, 0, 0],
  emphasis = 0
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  emphasis?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const scale = lerp(1, 1.45, emphasis);
    ref.current.scale.setScalar(scale);
    ref.current.rotation.z = rotation[2] + state.clock.elapsedTime * (0.22 + emphasis * 0.25);
    ref.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <torusGeometry args={[1.35, 0.06, 24, 120]} />
      <meshStandardMaterial
        color="#7fffc6"
        emissive="#0bd66f"
        emissiveIntensity={0.9 + emphasis * 1.4}
        metalness={0.6}
        roughness={0.15}
      />
    </mesh>
  );
}

function CameraRig({ activeFocus, scrollProgress }: { activeFocus: FocusKey; scrollProgress: number }) {
  const configs: Record<FocusKey, FocusConfig> = {
    none: {
      target: new THREE.Vector3(0, 0.1, 8.2),
      lookAt: new THREE.Vector3(0, 0, -3.2)
    },
    ring: {
      target: new THREE.Vector3(0.2, -0.15, 4.3),
      lookAt: new THREE.Vector3(0.6, -0.25, -3.8)
    },
    king: {
      target: new THREE.Vector3(2.95, 0.45, 4.6),
      lookAt: new THREE.Vector3(3.4, 0.45, -0.35)
    },
    board: {
      target: new THREE.Vector3(-2.75, -0.35, 4.4),
      lookAt: new THREE.Vector3(-2.2, -0.2, -6.1)
    },
    glass: {
      target: new THREE.Vector3(-4.25, 1.4, 4.4),
      lookAt: new THREE.Vector3(-4.8, 1.6, -5.1)
    },
    football: {
      target: new THREE.Vector3(-2.25, 0.55, 4.9),
      lookAt: new THREE.Vector3(-3.45, 0.9, -1.6)
    }
  };

  useFrame((state) => {
    const camera = state.camera;
    const cfg = configs[activeFocus];
    const orbitAmount = scrollProgress * Math.PI * 2;

    camera.position.x = lerp(camera.position.x, cfg.target.x + Math.sin(orbitAmount) * 0.18, 0.06);
    camera.position.y = lerp(camera.position.y, cfg.target.y + Math.cos(orbitAmount * 0.4) * 0.08, 0.06);
    camera.position.z = lerp(camera.position.z, cfg.target.z, 0.06);

    const lookX = lerp((camera as any).__lx ?? 0, cfg.lookAt.x, 0.06);
    const lookY = lerp((camera as any).__ly ?? 0, cfg.lookAt.y, 0.06);
    const lookZ = lerp((camera as any).__lz ?? -3.2, cfg.lookAt.z, 0.06);
    (camera as any).__lx = lookX;
    (camera as any).__ly = lookY;
    (camera as any).__lz = lookZ;
    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}

function SceneContents({ activeFocus, scrollProgress }: { activeFocus: FocusKey; scrollProgress: number }) {
  const emphasis = {
    ring: activeFocus === "ring" ? 1 : 0,
    king: activeFocus === "king" ? 1 : 0,
    board: activeFocus === "board" ? 1 : 0,
    glass: activeFocus === "glass" ? 1 : 0,
    football: activeFocus === "football" ? 1 : 0
  };

  return (
    <>
      <color attach="background" args={["#020805"]} />
      <fog attach="fog" args={["#020805", 7, 26]} />

      <ambientLight intensity={0.72} />
      <directionalLight position={[4, 6, 3]} intensity={1.8} color="#e6fff4" castShadow />
      <pointLight position={[-5, 2, 2]} intensity={8} color="#0dff87" />
      <pointLight position={[5, -1, -2]} intensity={4} color="#83ffc5" />

      <Sparkles count={180} scale={[22, 13, 20]} size={3.4} speed={0.35} color="#92ffd0" />

      <CameraRig activeFocus={activeFocus} scrollProgress={scrollProgress} />

      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.2}>
        <Football position={[-3.5, 0.8, -1.5]} emphasis={emphasis.football} />
      </Float>

      <Float speed={1.2} rotationIntensity={0.35} floatIntensity={1.1}>
        <ChessKing position={[3.4, -0.2, -0.5]} emphasis={emphasis.king} />
      </Float>

      <GlassOrb position={[-4.8, 1.6, -5]} emphasis={emphasis.glass} color="#d7ffea" />
      <GlassOrb position={[-0.8, 2.5, -4.5]} emphasis={0} />
      <GlassOrb position={[4.5, 1.6, -5]} emphasis={0} color="#d7ffea" />

      <Ring position={[0.6, -0.1, -4.0]} rotation={[Math.PI / 2.8, 0, 0.2]} emphasis={emphasis.ring} />
      <Ring position={[1.6, 2.2, -7.2]} rotation={[0.9, 0.2, 0.8]} emphasis={0} />

      <Board position={[-2.2, -2.2, -6]} rotation={[0.3, -0.35, -0.2]} emphasis={emphasis.board} />
      <Board position={[2.8, 2.4, -8]} rotation={[0.2, 0.6, 0.25]} emphasis={0} />

      <Text
        position={[0, -2.6, -3]}
        fontSize={0.35}
        letterSpacing={0.08}
        color="#91ffc9"
        anchorX="center"
        anchorY="middle"
      >
        NICK TRAN
      </Text>

      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
}

export default function Scene({
  activeFocus,
  scrollProgress
}: {
  activeFocus: FocusKey;
  scrollProgress: number;
}) {
  return (
    <div className="canvas-shell" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.3, 8.2], fov: 46 }} shadows dpr={[1, 2]}>
        <SceneContents activeFocus={activeFocus} scrollProgress={scrollProgress} />
      </Canvas>

      <div className="canvas-glow canvas-glow-1" />
      <div className="canvas-glow canvas-glow-2" />
      <div className="canvas-grid" />
      <div className="canvas-vignette" />
    </div>
  );
}

useGLTF.preload("/football/soccer_ball.gltf");
