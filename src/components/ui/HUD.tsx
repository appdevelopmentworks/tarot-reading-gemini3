"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { translations } from "@/lib/i18n";

export const HUD = () => {
    const phase = useStore((state) => state.phase);
    const setPhase = useStore((state) => state.setPhase);
    const readingResult = useStore((state) => state.readingResult);
    const question = useStore((state) => state.question);
    const setQuestion = useStore((state) => state.setQuestion);
    const setReadingResult = useStore((state) => state.setReadingResult);
    const language = useStore((state) => state.language);
    const setLanguage = useStore((state) => state.setLanguage);

    const t = translations[language];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        setReadingResult(""); // Clear previous result
        setPhase('shuffling');
    };

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] z-10">
            {/* Header / Language Toggle */}
            <header className="w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-4">

                <div>
                    <h1 className="font-syne font-bold text-4xl text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {t.title}
                    </h1>
                    <p className="font-inter text-white/60 text-sm tracking-widest uppercase mt-1">
                        {t.subtitle}
                    </p>
                </div>
                <div className="pointer-events-auto flex items-center space-x-2 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLanguage('ja')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'ja' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        JP
                    </button>
                </div>
            </header>

            {/* Loading / Status Indicators */}
            <AnimatePresence>
                {phase === 'shuffling' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto"
                    >
                        <div className="text-[#00f3ff] font-syne text-2xl animate-pulse tracking-widest">
                            {t.shuffling}
                        </div>
                    </motion.div>
                )}
                {phase === 'dealing' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-20"
                    >
                        <div className="text-white font-inter text-lg tracking-widest bg-black/50 px-6 py-2 rounded-full border border-white/20 backdrop-blur-md">
                            {t.dealing}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Form */}
            <AnimatePresence>
                {phase === 'idle' && (
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="pointer-events-auto w-full max-w-lg"
                    >
                        <div className="relative group flex flex-col md:flex-row gap-2">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder={t.placeholder}
                                className="w-full bg-black/60 border border-white/20 rounded-xl px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all font-inter backdrop-blur-xl"
                            />
                            <button
                                type="submit"
                                className="md:absolute md:right-2 md:top-2 md:bottom-2 px-8 py-4 md:py-0 bg-white text-black font-bold rounded-lg hover:bg-[#00f3ff] active:scale-95 transition-all font-syne uppercase tracking-wider text-sm"
                            >
                                {t.submit}
                            </button>
                        </div>

                    </motion.form>
                )}
            </AnimatePresence>

            {/* Reading Display */}
            <AnimatePresence>
                {(phase === 'reading' || phase === 'result') && (
                    <motion.div
                        key="reading-display"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pointer-events-auto w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 max-h-[70vh] overflow-y-auto custom-scrollbar"
                    >
                        <div className="font-syne text-[#00f3ff] text-xl mb-6 border-b border-white/10 pb-4">
                            {t.decoding}
                        </div>
                        <div className="prose prose-invert prose-p:text-white/80 prose-headings:text-[#B026FF] max-w-none font-inter leading-relaxed whitespace-pre-wrap">
                            {readingResult}
                        </div>
                        {phase === 'result' && (
                            <button
                                onClick={() => { setPhase('idle'); setQuestion(''); setReadingResult(''); }}
                                className="mt-8 px-6 py-2 border border-white/30 rounded-full text-white/70 hover:bg-white hover:text-black transition-all text-sm uppercase tracking-widest"
                            >
                                {t.reset}
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="w-full text-center text-white/10 font-mono text-[10px]">
                ID: CELESTIA-V3.1
            </footer>
        </div>
    );
};
