import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';

const PARTICLE_COUNT = 280;

function GenerativeParticles({ isDark, animate }) {
  const points = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const r = 1.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 1.5;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!animate || !points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.04;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
  });

  const color = isDark ? '#4ade80' : '#2dbd6e';

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={color}
        transparent
        opacity={isDark ? 0.55 : 0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function GenerativeCore({ isDark, animate }) {
  const core = useRef();
  const halo = useRef();

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    if (core.current) {
      core.current.rotation.y = t * 0.1;
      core.current.rotation.z = t * 0.06;
      const pulse = 1 + Math.sin(t * 0.7) * 0.06;
      core.current.scale.setScalar(2.35 * pulse);
    }
    if (halo.current) {
      halo.current.rotation.x = t * 0.18;
      halo.current.rotation.y = -t * 0.12;
    }
  });

  const accent = isDark ? '#3dd68c' : '#2dbd6e';
  const accentSoft = isDark ? '#22d3ee' : '#38bdf8';

  return (
    <group position={[0, 0, -1.4]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.05, 4]} />
        <meshStandardMaterial
          color={accent}
          wireframe
          transparent
          opacity={isDark ? 0.42 : 0.32}
          emissive={accent}
          emissiveIntensity={0.35}
        />
      </mesh>

      <mesh scale={2.1}>
        <sphereGeometry args={[1, 48, 48]} />
        <MeshDistortMaterial
          color={accentSoft}
          wireframe
          transparent
          opacity={isDark ? 0.28 : 0.22}
          distort={0.45}
          speed={1.8}
          roughness={0.2}
        />
      </mesh>

      <mesh ref={halo} rotation={[1.1, 0.2, 0.5]}>
        <torusGeometry args={[1.65, 0.03, 12, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={isDark ? 0.35 : 0.28} />
      </mesh>
      <mesh rotation={[0.4, 0.8, 0]}>
        <torusGeometry args={[1.9, 0.02, 10, 80]} />
        <meshBasicMaterial color={accentSoft} transparent opacity={isDark ? 0.25 : 0.2} />
      </mesh>
    </group>
  );
}

function FloatingScene({ isDark, animate }) {
  const group = useRef();
  const ring = useRef();

  useFrame((state) => {
    if (!animate || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.08;
    if (ring.current) {
      ring.current.rotation.x = t * 0.28;
      ring.current.rotation.z = t * 0.18;
    }
  });

  const accent = isDark ? '#3dd68c' : '#2dbd6e';
  const wireOpacity = isDark ? 0.4 : 0.3;

  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 0.7} />
      <pointLight position={[4, 3, 6]} intensity={isDark ? 1.2 : 0.95} color={accent} />
      <pointLight position={[-5, -2, 3]} intensity={0.5} color="#60a5fa" />

      <GenerativeCore isDark={isDark} animate={animate} />
      <GenerativeParticles isDark={isDark} animate={animate} />

      <group ref={group}>
        <mesh ref={ring} position={[0.15, -0.35, -0.6]}>
          <torusKnotGeometry args={[0.5, 0.09, 80, 12]} />
          <meshStandardMaterial
            color={accent}
            wireframe
            transparent
            opacity={wireOpacity}
            emissive={accent}
            emissiveIntensity={0.12}
          />
        </mesh>
      </group>
    </>
  );
}

function getPrefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ChatBackground3D({ isDark }) {
  const animate = !getPrefersReducedMotion();

  return (
    <Canvas
      className="chat-messages__canvas"
      camera={{ position: [0, 0, 3.6], fov: 52 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
    >
      <FloatingScene isDark={isDark} animate={animate} />
    </Canvas>
  );
}
