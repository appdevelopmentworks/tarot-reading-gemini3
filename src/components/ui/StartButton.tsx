"use client";

import { motion } from "framer-motion";

interface StartButtonProps {
    onClick?: () => void;
}

export const StartButton = ({ onClick }: StartButtonProps) => {
    return (
        <motion.button
            whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(176, 38, 255, 0.6), 0 0 40px rgba(176, 38, 255, 0.3)",
                textShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.8,
                delay: 0.5,
                type: "spring",
                stiffness: 100
            }}
            onClick={onClick}
            className="group relative px-10 py-5 bg-transparent border-2 border-[#B026FF] text-[#e0e0e0] font-syne text-xl uppercase tracking-[0.2em] rounded-none overflow-hidden cursor-pointer"
        >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Start Ritual
            </span>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[#B026FF] opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md" />

            {/* Sliding Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#B026FF] to-[#00f3ff] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out opacity-30" />

            {/* Particle Hint (pseudo) */}
            <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent shadow-[0_0_10px_#00f3ff]" />
        </motion.button>
    );
};
