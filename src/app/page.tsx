"use client";

import dynamic from "next/dynamic";
import { StartButton } from "@/components/ui/StartButton";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Dynamically import the 3D scene to avoid SSR issues with Three.js
const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050511]" />,
});

export default function Home() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    // Add a slight delay for the exit animation to play
    setTimeout(() => {
      router.push("/reading");
    }, 1000);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">

      {/* 3D Background - Persistent but fade out possibly? Or let the next page take over */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
        <HeroScene />
      </div>

      {/* UI Overlay */}
      <AnimatePresence>
        {!isExiting && (
          <div className="relative z-10 flex flex-col items-center text-center space-y-8 p-4">
            <motion.div
              initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.5 } }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-2 font-syne tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                CELESTIA
              </h1>
              <p className="text-[#a0a0b0] text-sm md:text-base font-inter tracking-[0.3em] uppercase opacity-80">
                Digital Ritual Platform
              </p>
            </motion.div>

            <motion.div
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
            >
              <StartButton onClick={handleStart} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
