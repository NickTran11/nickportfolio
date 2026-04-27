import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  OrbitControls,
  Sparkles,
  Text
} from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export type FocusKey = "none" | "ring" | "king" | "board" | "glass" | "football";

type FocusConfig = {
  target: THREE.Vector3;
  lookAt: THREE.Vector3;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function Football({ position, emphasis = 0 }: { position: [number, number, number]; emphasis?: number }) {
  const group = useRef<THREE.Group>(null);

  // 12 regular points of an icosahedron
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawPoints = [
    [-1,  phi, 0],
    [ 1,  phi, 0],
    [-1, -phi, 0],
    [ 1, -phi, 0],

    [0, -1,  phi],
    [0,  1,  phi],
    [0, -1, -phi],
    [0,  1, -phi],

    [ phi, 0, -1],
    [ phi, 0,  1],
    [-phi, 0, -1],
    [-phi, 0,  1]
  ] as const;

  const patchPoints = rawPoints.map(([x, y, z]) =>
    new THREE.Vector3(x, y, z).normalize()
  );

  useFrame((state) => {
    if (!group.current) return;
    const scale = lerp(1, 1.35, emphasis);
    group.current.scale.setScalar(scale);
    group.current.rotation.y = state.clock.elapsedTime * 0.55;
    group.current.rotation.x = state.clock.elapsedTime * 0.35;
    group.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.05) * (0.12 + emphasis * 0.06);
  });

  return (
    <group ref={group} position={position}>
      {/* base ball */}
      <mesh castShadow receiveShadow>
  <sphereGeometry args={[0.82, 64, 64]} />
  <meshPhysicalMaterial
    color="#f7fff9"
    roughness={0.22}
    metalness={0.08}
    clearcoat={1}
    clearcoatRoughness={0.08}
    reflectivity={1}
  />
</mesh>

<mesh>
  <sphereGeometry args={[0.826, 64, 64]} />
  <meshPhysicalMaterial
    color="#ffffff"
    transparent
    opacity={0.08}
    roughness={0.05}
    metalness={0}
    clearcoat={1}
    clearcoatRoughness={0.02}
    reflectivity={1}
  />
</mesh>
      
      {/* black patches */}
{patchPoints.map((n, i) => {
  const pos = n.clone().multiplyScalar(0.825);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    n
  );
  const euler = new THREE.Euler().setFromQuaternion(quat);

  return (
    <mesh
      key={i}
      position={[pos.x, pos.y, pos.z]}
      rotation={[euler.x, euler.y, euler.z]}
    >
      <circleGeometry args={[0.3, 5]} />
      <meshPhysicalMaterial
        color="#0b0d10"
        roughness={0.28}
        metalness={0.18}
        clearcoat={0.9}
        clearcoatRoughness={0.12}
        reflectivity={1}
      />
    </mesh>
  );
})}
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

function LightningBolt({
  position,
  rotation = [0, 0, 0]
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);

  // Slim, sharp, elongated bolt — matching screenshot 2 proportions exactly
  // Top tip is upper-right, bottom tip is lower-left, creating the lean
  const boltShape = new THREE.Shape();
  boltShape.moveTo(0.28, 1.85);   // top-right sharp tip
  boltShape.lineTo(-0.52, 0.12);  // left side going down
  boltShape.lineTo(0.04, 0.12);   // notch inner top-left
  boltShape.lineTo(-0.42, -1.75); // bottom-left sharp tip
  boltShape.lineTo(0.52, -0.14);  // right side going up
  boltShape.lineTo(-0.04, -0.14); // notch inner bottom-right
  boltShape.lineTo(0.28, 1.85);   // back to top

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.15) * 0.05;
    group.current.rotation.z =
      rotation[2] + Math.sin(state.clock.elapsedTime * 0.7) * 0.02;
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={[
        rotation[0] + 0.08,   // very slight forward tilt
        rotation[1] + 0.18,   // slight y rotation to show the thin edge/depth
        rotation[2] + 0.32    // ~18 degrees tilt — top leans right, matches screenshot 2
      ]}
      scale={[1.0, 1.35, 1]}
    >
      {/* 
        Main crystal body — thin depth is critical.
        Screenshot 2 shows a thin shard, not a thick block.
        Large bevel relative to depth creates the sharp chamfered edges 
        that catch light and create those distinct angled faces.
      */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry
          args={[
            boltShape,
            {
              depth: 0.22,          // THIN — screenshot 2 is a slim crystal shard
              bevelEnabled: true,
              bevelSize: 0.07,      // Large bevel relative to depth = sharp crystal faces
              bevelThickness: 0.07,
              bevelSegments: 8      // Smooth bevel curves
            }
          ]}
        />
        <MeshTransmissionMaterial
          color="#38eeaa"           // Mint green, slightly cool
          transmission={0.88}       // Very glassy/transparent
          thickness={0.35}          // Controls internal refraction depth
          roughness={0.0}           // Perfectly smooth glass
          chromaticAberration={0.04}
          backside={true}
          backsideThickness={0.2}
          samples={16}              // High quality transmission
          distortion={0.0}          // No distortion — clean crystal
          distortionScale={0.0}
          temporalDistortion={0.0}
          envMapIntensity={3.0}
          ior={1.8}                 // High IOR — dense glass, bends light strongly
          anisotropy={0.1}
        />
      </mesh>

      {/* 
        The critical grey/silver notch face seen in screenshot 2.
        The middle "step" of the bolt has a distinct silver-grey face
        that's clearly visible — this is the bevel face at the notch catching light.
        We recreate it as a separate mesh at the notch position.
      */}
      <mesh position={[0.0, -0.01, 0.11]}>
        <shapeGeometry args={[(() => {
          const notch = new THREE.Shape();
          notch.moveTo(0.04, 0.12);
          notch.lineTo(0.52, -0.14);  
          notch.lineTo(-0.04, -0.14);
          notch.lineTo(-0.52, 0.12);
          notch.lineTo(0.04, 0.12);
          return notch;
        })()]} />
        <meshPhysicalMaterial
          color="#b0c8be"           // Cool grey-silver, matches screenshot 2 notch
          metalness={0.85}
          roughness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          transparent
          opacity={0.82}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/*
        Upper blade face — bright mint highlight.
        In screenshot 2 the upper portion of the front face
        catches bright light and appears as bright aqua-green.
      */}
      <mesh position={[0, 0, 0.22]}>
        <shapeGeometry args={[(() => {
          const upper = new THREE.Shape();
          upper.moveTo(0.28, 1.85);
          upper.lineTo(-0.52, 0.12);
          upper.lineTo(0.04, 0.12);
          upper.lineTo(0.28, 1.85);
          return upper;
        })()]} />
        <meshPhysicalMaterial
          color="#50ffb8"
          emissive="#00ff99"
          emissiveIntensity={0.08}
          metalness={0.2}
          roughness={0.0}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          transparent
          opacity={0.28}
          side={THREE.FrontSide}
        />
      </mesh>

      {/*
        Lower blade face — slightly darker green.
        The bottom half in screenshot 2 is a touch darker/deeper.
      */}
      <mesh position={[0, 0, 0.22]}>
        <shapeGeometry args={[(() => {
          const lower = new THREE.Shape();
          lower.moveTo(-0.04, -0.14);
          lower.lineTo(0.52, -0.14);
          lower.lineTo(-0.42, -1.75);
          lower.lineTo(-0.04, -0.14);
          return lower;
        })()]} />
        <meshPhysicalMaterial
          color="#30cc88"
          metalness={0.3}
          roughness={0.0}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          transparent
          opacity={0.22}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 
        Lighting rig — screenshot 2 has a strong light from upper-left
        creating a bright face on the upper blade,
        and the silver notch is lit more neutrally/coolly.
      */}

      {/* Strong white key light — upper left, creates bright face on upper blade */}
      <pointLight
        position={[-2.0, 3.0, 2.0]}
        intensity={5.5}
        color="#e8fff5"
        distance={9}
        decay={2}
      />

      {/* Cool fill from the right to illuminate the lower blade */}
      <pointLight
        position={[2.5, -1.0, 1.5]}
        intensity={2.2}
        color="#40ffaa"
        distance={7}
        decay={2}
      />

      {/* Back light — makes it glow from behind for translucency */}
      <pointLight
        position={[0.5, 0.2, -2.0]}
        intensity={1.8}
        color="#00ffaa"
        distance={5}
        decay={2}
      />

      {/* Subtle warm top fill */}
      <pointLight
        position={[0, 2.5, 1.0]}
        intensity={1.2}
        color="#ffffff"
        distance={6}
        decay={2}
      />
    </group>
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
  <ChessKing position={[6.25, -0.15, -0.5]} emphasis={emphasis.king} />
</Float>

      <GlassOrb position={[-4.8, 1.6, -5]} emphasis={emphasis.glass} color="#d7ffea" />
      <GlassOrb position={[-0.8, 2.5, -4.5]} emphasis={0} />
      <GlassOrb position={[4.5, 1.6, -5]} emphasis={0} color="#d7ffea" />

      <Ring position={[0.6, -0.1, -4.0]} rotation={[Math.PI / 2.8, 0, 0.2]} emphasis={emphasis.ring} />
      <Ring position={[1.6, 2.2, -7.2]} rotation={[0.9, 0.2, 0.8]} emphasis={0} />

      <Board position={[-2.2, -2.2, -6]} rotation={[0.3, -0.35, -0.2]} emphasis={emphasis.board} />
      <LightningBolt position={[-7.8, -1, -3.3]} rotation={[0.12, -0.25, 0.08]} />

      <Text
        position={[0, -2.6, -3]}
        fontSize={0.35}
        letterSpacing={0.08}
        color="#91ffc9"
        anchorX="center"
        anchorY="middle"
      >
        BACH (NICK) TRAN
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
