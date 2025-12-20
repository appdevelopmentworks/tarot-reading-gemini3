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
    setTimeout(() => {
      router.push("/reading");
    }, 1000);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-[#050511]">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B026FF] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00f3ff] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

      {/* 3D Background */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
        <HeroScene />
      </div>

      {/* UI Overlay */}
      <AnimatePresence>
        {!isExiting && (
          <div className="relative z-10 flex flex-col items-center text-center space-y-12 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.5 } }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="mb-4 overflow-hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/30 font-syne tracking-tighter drop-shadow-[0_0_30px_rgba(176,38,255,0.2)]"
                >
                  CELESTIA
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 0.6, letterSpacing: "0.8em" }}
                transition={{ duration: 2, delay: 0.5 }}
                className="text-[#a0a0b0] text-[10px] md:text-xs font-inter uppercase mb-8"
              >
                Digital Ritual Platform
              </motion.div>

              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B026FF]/50 to-transparent mb-8" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
            >
              <StartButton onClick={handleStart} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/10 pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/10 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/10 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/10 pointer-events-none" />
    </main>
  );
}

