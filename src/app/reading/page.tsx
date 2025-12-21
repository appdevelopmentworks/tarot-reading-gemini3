"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Sparkles, OrbitControls, SpotLight, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import Deck from "@/components/canvas/Deck";
import { HUD } from "@/components/ui/HUD";
import { Suspense } from "react";

export default function ReadingPage() {
    return (
        <main className="relative w-full h-screen bg-background text-foreground overflow-hidden">

            <HUD />

            {/* 3D Scene - Reading Room */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 4, 12], fov: 35 }} shadows>
                    <color attach="background" args={['#050511']} />

                    {/* Ambient environment */}
                    <ambientLight intensity={0.4} />

                    {/* Main Ritual Lights */}
                    <pointLight position={[0, 5, 0]} intensity={15} color="#B026FF" distance={20} />
                    <pointLight position={[5, 3, 5]} intensity={10} color="#00f3ff" distance={15} />
                    <pointLight position={[-5, 3, -5]} intensity={10} color="#ff0055" distance={15} />

                    {/* Central Glow at the Altar */}
                    <SpotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} color="#B026FF" castShadow />

                    {/* Particles */}
                    <Sparkles count={100} scale={15} size={2} speed={0.3} opacity={0.4} color="#B026FF" />
                    <Sparkles count={50} scale={10} size={4} speed={0.1} opacity={0.2} color="#00f3ff" />

                    {/* Altar/Table Surface */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                        <planeGeometry args={[100, 100]} />
                        <meshStandardMaterial
                            color="#0a0a1a"
                            roughness={0.1}
                            metalness={0.5}
                        />
                    </mesh>

                    {/* The Tarot Deck */}
                    <group position={[0, -0.2, 0]}>
                        <Suspense fallback={null}>
                            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                                <Deck />
                            </Float>
                        </Suspense>
                    </group>


                    <OrbitControls
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 2.2}
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={true}
                        autoRotateSpeed={0.5}
                    />
                    <Environment preset="city" />
                </Canvas>
            </div>


        </main>
    );
}
