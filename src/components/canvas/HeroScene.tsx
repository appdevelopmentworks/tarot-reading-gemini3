"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    Sparkles,
    Float,
    Environment,
    MeshTransmissionMaterial,
    Text,
    PerspectiveCamera,
    MeshReflectorMaterial,
    useTexture
} from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

const CrystalBall = () => {
    const ballRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Group>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);

    // Load textures for the cards
    const textures = useTexture([
        "/assets/tarot_images/ar00.jpg", // The Fool
        "/assets/tarot_images/ar10.jpg", // Wheel of Fortune
        "/assets/tarot_images/ar17.jpg", // The Star
        "/assets/tarot_images/ar21.jpg", // The World
    ]);
    const cardBackTexture = useTexture("/assets/magical_card_back.jpg");

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ballRef.current) {
            ballRef.current.rotation.y = t * 0.1;
        }
        if (innerRef.current) {
            innerRef.current.rotation.y = -t * 0.2;
            innerRef.current.position.y = Math.sin(t * 0.5) * 0.1;
        }
        if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.5;
        if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.3;
    });

    return (
        <group>
            {/* Main Crystal Ball Shell */}
            <mesh ref={ballRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshPhysicalMaterial
                    transmission={0.9}
                    thickness={2}
                    roughness={0}
                    ior={1.5}
                    clearcoat={1}
                    color="#ffffff"
                    metalness={0}
                />
            </mesh>

            {/* Inner Content */}
            <group ref={innerRef}>
                {/* Central Core Glow */}
                <mesh>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshBasicMaterial color="#00f3ff" transparent opacity={0.9} />
                </mesh>
                <pointLight intensity={50} color="#00f3ff" distance={5} />

                {/* AI Brain Indicator */}
                <Text
                    position={[0, 0, 0.2]}
                    fontSize={0.25}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                >
                    AI
                </Text>

                {/* Floating Inner Cards */}
                {(textures as THREE.Texture[]).map((texture: THREE.Texture, i: number) => (
                    <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
                        <group position={[1.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                            {/* Front face with tarot texture */}
                            <mesh position={[0, 0, 0.011]}>
                                <planeGeometry args={[0.6, 1]} />
                                <meshBasicMaterial map={texture} />
                            </mesh>
                            {/* Back face with magical card back texture */}
                            <mesh position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
                                <planeGeometry args={[0.6, 1]} />
                                <meshBasicMaterial map={cardBackTexture as THREE.Texture} />
                            </mesh>
                            {/* Body of the card (Thin middle frame) */}
                            <mesh>
                                <boxGeometry args={[0.6, 1, 0.02]} />
                                <meshPhysicalMaterial
                                    color="#1a1a2e"
                                    emissive="#B026FF"
                                    emissiveIntensity={1}
                                    metalness={0.9}
                                    roughness={0.1}
                                />
                            </mesh>
                        </group>
                    </group>
                ))}

                {/* Magical Rings */}
                <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.3, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#B026FF" transparent opacity={0.7} />
                </mesh>
                <mesh ref={ring2Ref} rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[1.5, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#00f3ff" transparent opacity={0.5} />
                </mesh>
            </group>

            {/* Sub-glow */}
            <mesh scale={1.2}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} side={THREE.BackSide} depthWrite={false} />
            </mesh>
        </group>
    );
};

const Rig = () => {
    const { camera, pointer } = useThree();
    const vec = new THREE.Vector3();

    useFrame(() => {
        camera.position.lerp(vec.set(pointer.x * 1, pointer.y * 1, 8), 0.05);
        camera.lookAt(0, 0, 0);
    });

    return null;
};

export default function HeroScene() {
    return (
        <div className="absolute inset-0 z-0 w-full h-full">
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: false, stencil: false, depth: true }}
            >
                <color attach="background" args={["#030308"]} />

                <Suspense fallback={<mesh><sphereGeometry args={[2, 16, 16]} /><meshBasicMaterial color="#1a1a2e" wireframe /></mesh>}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
                    <Rig />

                    {/* Ambient / Environment */}
                    <ambientLight intensity={1.5} />
                    <Environment preset="city" />

                    {/* Magical Lights */}
                    <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={800} color="#B026FF" />
                    <pointLight position={[-10, 10, -10]} intensity={500} color="#00f3ff" />
                    <pointLight position={[0, -5, 5]} intensity={200} color="#ffffff" />

                    {/* Background Particles */}
                    <Sparkles count={400} scale={15} size={2} speed={0.3} opacity={0.4} color="#B026FF" />
                    <Sparkles count={300} scale={12} size={1} speed={0.5} opacity={0.3} color="#00f3ff" />

                    {/* The Crystal Ball */}
                    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                        <CrystalBall />
                    </Float>

                    {/* Ground Reflection (Fake) */}
                    <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[20, 20]} />
                        <MeshReflectorMaterial
                            blur={[300, 100]}
                            resolution={2048}
                            mixBlur={1}
                            mixStrength={40}
                            roughness={1}
                            depthScale={1.2}
                            minDepthThreshold={0.4}
                            maxDepthThreshold={1.4}
                            color="#101010"
                            metalness={0.5}
                            mirror={0} // No mirror for real reflector? Actually MeshReflectorMaterial is from drei
                        />
                    </mesh>
                </Suspense>
            </Canvas>
        </div>
    );
}

