"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion-3d";
import { getCardById } from "@/lib/tarot-data";
import { getCardTexturePath } from "@/lib/asset-utils";

const CARD_COUNT = 78;
const CARD_SIZE = [1.6, 2.7, 0.02]; // Width, Height, Thickness (updated from 0.015 to 0.02)



// Vertex Shader for InstancedMesh to handle custom UV offsets if we used an atlas
// For now, we'll keep it simple with standard material but prepare for custom shader
// As per spec, we should eventually use a custom shader for "Holographic" look.

const Card = ({ id, index, total }: { id: number, index: number, total: number }) => {
    const meshRef = useRef<THREE.Group>(null);
    const phase = useStore((state) => state.phase);
    const hoveredCardId = useStore((state) => state.hoveredCardId);
    const selected = useStore((state) => state.selectedCardIds.includes(index));
    const setHoveredCardId = useStore((state) => state.setHoveredCardId);
    const addSelectedCardId = useStore((state) => state.addSelectedCardId);
    const setPhase = useStore((state) => state.setPhase);
    const setReadingResult = useStore((state) => state.setReadingResult);
    const appendReadingResult = useStore((state) => state.appendReadingResult);

    const cardData = getCardById(index);
    const texturePath = getCardTexturePath(cardData);

    // Lazy load texture? Or pre-load? 
    // For 78 cards, useTexture might cache.
    // To avoid loading ALL at once, we could load only when dealt? 
    // But for visual impact, let's load major arcana or just back of card first?
    // Let's rely on browser cache and Next.js public folder serving.
    // Note: useTexture might suspend.

    // Optimization: Only load texture if phase is NOT 'idle' (stack) or 'shuffling' (too fast to see)
    // Or just use a shared Back texture for everything first.
    // Let's load the specific texture.

    const texture = useTexture(texturePath);
    const backTexture = useTexture("/assets/tarot_images/ar00.jpg"); // Use Fool or a generic back if we had one. 
    // Actually, physically let's make the cards thinner and add back face.

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        const i = index;

        let targetPos = new THREE.Vector3(0, i * 0.005, 0);
        let targetRot = new THREE.Euler(Math.PI / 2, 0, 0);
        let targetScale = 1;

        if (phase === 'shuffling') {
            const noiseX = Math.sin(time * 2 + i * 132.1) * 2;
            const noiseY = Math.cos(time * 1.5 + i * 42.5) * 1.5 + 2;
            const noiseZ = Math.sin(time * 1.8 + i * 323.2) * 2;
            targetPos.set(noiseX, noiseY, noiseZ);
            targetRot.set(time + i * 0.1, time * 0.5 + i * 0.2, time * 0.3 + i * 0.3);
        } else if (phase === 'dealing') {
            const angle = (i / total) * Math.PI * 2;
            const radius = 4;
            targetPos.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            targetRot.set(0, -angle + Math.PI / 2, 0);

            if (i === hoveredCardId) {
                targetPos.y = 0.5;
                targetScale = 1.2;
            }
        } else if (phase === 'reading' || phase === 'result') {
            // If selected, move to center
            if (selected) {
                targetPos.set(0, 4, 3);
                // Rotate to face camera (face front, tilt up slightly)
                targetRot.set(-Math.PI / 6, 0, 0);
                targetScale = 1.5;
            } else {
                // Others fade or fall back
                targetPos.y = -10; // Hide
            }
        } else {
            // Idle
            targetPos.y += Math.sin(time * 0.5 + i * 0.05) * 0.02;
            if (i === hoveredCardId) {
                targetPos.y += 0.5;
            }
        }

        // Lerp for smooth animation
        meshRef.current.position.lerp(targetPos, 0.1);
        // Rotation is harder to lerp with Euler, use Quaternion in real app, but this is fine for now
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRot.x, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRot.y, 0.1);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRot.z, 0.1);

        const currentScale = meshRef.current.scale.x;
        const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
        meshRef.current.scale.set(nextScale, nextScale, nextScale);
    });

    const handleClick = async (e: any) => {
        e.stopPropagation();
        if (phase === 'dealing') {
            console.log("Selected card:", index);
            addSelectedCardId(index);
            setPhase('reading');
            setReadingResult(""); // Ensure clear start

            const { generateReading } = await import('@/app/reading/actions');

            const question = useStore.getState().question;
            const language = useStore.getState().language; // Get current language
            const cardName = cardData.name;

            try {
                // Currently receiving full text to resolve crash.
                const result = await generateReading(question, [cardName], language);

                // Simulate typing effect for "streaming" feel since we have full text
                const text = result;
                let currentText = "";
                const chunkSize = 5;

                for (let i = 0; i < text.length; i += chunkSize) {
                    currentText += text.slice(i, i + chunkSize);
                    setReadingResult(currentText); // This might be slow with Zustand, but okay for now
                    await new Promise(r => setTimeout(r, 10)); // Artificial delay
                }

            } catch (err) {
                console.error("Reading failed", err);
                setReadingResult("The void is silent... (Error connecting to Oracle)");
            }
        }
    };

    return (
        <group ref={meshRef}>
            <mesh
                onPointerOver={(e) => { e.stopPropagation(); setHoveredCardId(index); }}
                onPointerOut={() => setHoveredCardId(null)}
                onClick={handleClick}
            >
                <boxGeometry args={[CARD_SIZE[0], CARD_SIZE[1], CARD_SIZE[2]]} />
                {/* Materials: Right, Left, Top, Bottom, Front, Back */}
                <meshStandardMaterial color="#2d2d2d" /> {/* Right */}
                <meshStandardMaterial color="#2d2d2d" /> {/* Left */}
                <meshStandardMaterial color="#2d2d2d" /> {/* Top */}
                <meshStandardMaterial color="#2d2d2d" /> {/* Bottom */}
                <meshStandardMaterial map={texture} roughness={0.3} metalness={0.0} /> {/* Front */}
                <meshStandardMaterial color="#000000" roughness={0.5} /> {/* Back */}
            </mesh>
        </group>
    );
};

// Main Deck Component
const Deck = () => {
    const phase = useStore((state) => state.phase);
    const setPhase = useStore((state) => state.setPhase);
    const shuffleStartRef = useRef<number | null>(null);

    useFrame((state) => {
        if (phase === 'shuffling') {
            if (shuffleStartRef.current === null) {
                shuffleStartRef.current = state.clock.getElapsedTime();
            } else if (state.clock.getElapsedTime() - shuffleStartRef.current > 3.0) {
                setPhase('dealing');
                shuffleStartRef.current = null;
            }
        } else {
            shuffleStartRef.current = null; // Reset if phase changes externally
        }
    });

    return (
        <group>
            {Array.from({ length: CARD_COUNT }).map((_, i) => (
                <Card key={i} id={i} index={i} total={CARD_COUNT} />
            ))}
        </group>
    );
};

export default Deck;
