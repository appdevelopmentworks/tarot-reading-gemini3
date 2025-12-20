"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Sparkles, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import Deck from "@/components/canvas/Deck";
import { HUD } from "@/components/ui/HUD";
import { Suspense } from "react";

export default function ReadingPage() {
    return (
        <main className="relative w-full h-screen bg-[#050511] text-[#e0e0e0] overflow-hidden">

            <HUD />

            {/* 3D Scene - Reading Room */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 5, 8], fov: 35 }} shadows>
                    <color attach="background" args={['#050511']} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#B026FF" />

                    {/* Altar/Table Surface */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                        <planeGeometry args={[50, 50]} />
                        <meshStandardMaterial
                            color="#050511"
                            roughness={0.2}
                            metalness={0.8}
                        />
                    </mesh>

                    <gridHelper args={[50, 50, 0x202020, 0x101010]} position={[0, -1.99, 0]} />

                    {/* The Tarot Deck */}
                    <group position={[0, -1.5, 0]}>
                        <Suspense fallback={null}>
                            <Deck />
                        </Suspense>
                    </group>

                    <OrbitControls
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 2.2}
                        enableZoom={false}
                        enablePan={false}
                    />
                    <Environment preset="night" />
                </Canvas>
            </div>

        </main>
    );
}
