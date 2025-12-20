"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Float, Environment, Instances, Instance, CameraControls } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

const CardStack = () => {
    const count = 40;

    // Random rotations for messy stack effect
    const randomRotations = useMemo(() => {
        return Array.from({ length: count }).map(() => (Math.random() - 0.5) * 0.15);
    }, []);

    return (
        <Instances range={count} position={[0, -0.5, 0]}>
            <boxGeometry args={[1.6, 2.7, 0.015]} />
            <meshPhysicalMaterial
                color="#0a0a10"
                roughness={0.2}
                metalness={0.9}
                clearcoat={1}
                clearcoatRoughness={0.1}
                emissive="#201040"
                emissiveIntensity={0.2}
            />
            {Array.from({ length: count }).map((_, i) => (
                <CardInstance key={i} index={i} rotationZ={randomRotations[i]} />
            ))}
        </Instances>
    )
}

const CardInstance = ({ index, rotationZ }: { index: number, rotationZ: number }) => {
    const ref = useRef<THREE.Group>(null);

    // Hover state for individual cards (optional, maybe too busy for stack)
    // For now, simple breathing stack

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            // "Breathing" stack animation - cards floating slightly apart
            const breathing = Math.sin(t * 0.8 + index * 0.1) * 0.002;
            ref.current.position.y = index * 0.01 + breathing;
        }
    })

    return <Instance
        ref={ref}
        position={[0, index * 0.01, 0]}
        rotation={[0, 0, rotationZ]}
    />
}

const Rig = () => {
    const { camera, pointer } = useThree();
    const vec = useMemo(() => new THREE.Vector3(), []);

    useFrame(() => {
        // Parallax camera movement based on mouse pointer
        camera.position.lerp(vec.set(pointer.x * 2, 4 + pointer.y * 1, 6 + pointer.y * 1), 0.05);
        camera.lookAt(0, 0, 0);
    });

    return null;
}

export default function HeroScene() {
    return (
        <div className="absolute inset-0 z-0 w-full h-full">
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 5, 8], fov: 35 }}
                gl={{ antialias: true, alpha: false }}
            >
                <color attach="background" args={['#050511']} />

                <Rig />

                {/* Ambient environment */}
                <ambientLight intensity={0.4} />

                {/* Magical Lights */}
                <pointLight position={[5, 5, 5]} intensity={20} color="#B026FF" distance={15} decay={2} />
                <pointLight position={[-5, 5, -5]} intensity={20} color="#00f3ff" distance={15} decay={2} />

                {/* Particles */}
                <Sparkles count={300} scale={12} size={2} speed={0.4} opacity={0.6} color="#B026FF" noise={0.2} />
                <Sparkles count={200} scale={10} size={4} speed={0.2} opacity={0.4} color="#00f3ff" noise={0.1} />

                {/* Centerpiece Deck */}
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
                    <group rotation={[Math.PI / 4, 0, 0]}> {/* Angled view of deck */}
                        <CardStack />
                    </group>
                </Float>

                {/* Post-processing or Environment (Reflections) */}
                <Environment preset="city" blur={0.8} />
            </Canvas>
        </div>
    );
}
