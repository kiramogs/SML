"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import Tilt from "react-parallax-tilt";
import confetti from "canvas-confetti";
import { TypeAnimation } from "react-type-animation";

const noteLines = [
    "There are no words that can undo what happened this morning — and I know that. But I also know I owe you honesty, not silence.",
    "The way I spoke to you was wrong. The tone I used, the words I chose — they weren't fair, and they weren't kind. You deserved better, and I failed you in that moment.",
    "I am not writing this to explain it away. I'm writing because I want you to know that I see it clearly, and I take full responsibility.",
    "I won't repeat it again.",
    "You mean far more to me than any moment of frustration ever should. [Our little phrase] — and I mean that with everything I have.",
    "If you need time, I understand.",
];

const lineVariant = {
    hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
    visible: {
        opacity: 1, y: 0, filter: "blur(0px)",
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export default function NoteSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-12%" });
    const [sealActive, setSealActive] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const fireConfetti = useCallback(() => {
        const x = 0.5;
        const y = 0.7;
        confetti({
            particleCount: 60,
            spread: 70,
            origin: { x, y },
            colors: ["#fbbf24", "#d4a053", "#5eead4", "#a78bfa", "#f5f0e8"],
            ticks: 120,
            gravity: 0.8,
            scalar: 0.9,
            shapes: ["star", "circle"],
            disableForReducedMotion: true,
        });
    }, []);

    const handleSeal = useCallback(() => {
        if (revealed) return;
        setSealActive(true);
        fireConfetti();
        setTimeout(() => setRevealed(true), 600);
    }, [revealed, fireConfetti]);

    return (
        <section id="note" className="relative px-6 py-32 flex justify-center">
            <div className="w-full max-w-xl" ref={ref}>
                {/* Section label */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10"
                    style={{
                        fontFamily: "var(--font-body)", fontSize: "0.7rem",
                        letterSpacing: "0.4em", textTransform: "uppercase" as const,
                        color: "rgba(94,234,212,0.4)",
                    }}
                >
                    a note for you
                </motion.p>

                {/* 3D Tilt Note Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
                >
                    <Tilt
                        tiltMaxAngleX={5}
                        tiltMaxAngleY={8}
                        glareEnable={true}
                        glareMaxOpacity={0.08}
                        glareColor="#5eead4"
                        glarePosition="all"
                        glareBorderRadius="16px"
                        scale={1.01}
                        transitionSpeed={800}
                        style={{ borderRadius: "16px" }}
                    >
                        <div style={{
                            background: "linear-gradient(160deg, rgba(245,240,232,0.05), rgba(245,240,232,0.02))",
                            border: "1px solid rgba(94,234,212,0.12)",
                            borderRadius: "16px",
                            padding: "clamp(2rem, 6vw, 3.5rem)",
                            backdropFilter: "blur(16px)",
                            boxShadow: "0 0 50px rgba(94,234,212,0.04), 0 24px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
                            position: "relative",
                            overflow: "hidden",
                        }}>
                            {/* Subtle corner glow */}
                            <div aria-hidden="true" style={{
                                position: "absolute", top: "-60px", right: "-60px",
                                width: "180px", height: "180px", borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(94,234,212,0.07), transparent 70%)",
                                pointerEvents: "none",
                            }} />
                            <div aria-hidden="true" style={{
                                position: "absolute", bottom: "-40px", left: "-40px",
                                width: "140px", height: "140px", borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(167,139,250,0.05), transparent 70%)",
                                pointerEvents: "none",
                            }} />

                            {/* Note lines with blur-in */}
                            <motion.div
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                transition={{ staggerChildren: 0.12, delayChildren: 0.3 }}
                                className="space-y-5 mb-10"
                            >
                                {noteLines.map((line, i) => {
                                    const isPromise = line === "I won't repeat it again.";
                                    return (
                                        <motion.p
                                            key={i}
                                            variants={lineVariant}
                                            style={{
                                                fontFamily: isPromise ? "var(--font-heading)" : "var(--font-body)",
                                                fontSize: isPromise ? "clamp(1.15rem, 3vw, 1.4rem)" : "clamp(0.88rem, 2vw, 1.02rem)",
                                                fontWeight: isPromise ? 500 : 300,
                                                fontStyle: isPromise ? "italic" : "normal",
                                                color: isPromise ? "var(--teal-soft)" : "var(--ivory-dim)",
                                                lineHeight: 1.85,
                                                letterSpacing: "0.01em",
                                                borderLeft: isPromise ? "2px solid rgba(94,234,212,0.5)" : "none",
                                                paddingLeft: isPromise ? "1.2rem" : "0",
                                                textShadow: isPromise ? "0 0 20px rgba(94,234,212,0.15)" : "none",
                                            }}
                                        >
                                            {line}
                                        </motion.p>
                                    );
                                })}
                            </motion.div>

                            {/* Divider */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={isInView ? { scaleX: 1 } : {}}
                                transition={{ duration: 0.8, delay: 1.2 }}
                                style={{
                                    height: "1px",
                                    background: "linear-gradient(to right, transparent, rgba(94,234,212,0.2), transparent)",
                                    marginBottom: "1.5rem",
                                    transformOrigin: "left",
                                }}
                            />

                            {/* Signature */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 1.5, duration: 0.8 }}
                            >
                                <p style={{
                                    fontFamily: "var(--font-heading)",
                                    fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
                                    fontStyle: "italic", fontWeight: 400,
                                    color: "var(--ivory-faint)",
                                }}>
                                    — Arman
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.75rem", fontWeight: 300,
                                    color: "rgba(245,240,232,0.25)",
                                    letterSpacing: "0.06em", marginTop: "0.3rem",
                                }}>
                                    March 2, 2026
                                </p>
                            </motion.div>
                        </div>
                    </Tilt>
                </motion.div>

                {/* Promise Seal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    className="flex flex-col items-center mt-10 gap-4"
                >
                    <p style={{
                        fontFamily: "var(--font-body)", fontSize: "0.68rem",
                        letterSpacing: "0.25em", textTransform: "uppercase" as const,
                        color: "rgba(245,240,232,0.2)",
                    }}>
                        tap to feel the promise
                    </p>

                    <motion.button
                        onClick={handleSeal}
                        disabled={revealed}
                        whileHover={!revealed ? { scale: 1.12, boxShadow: "0 0 40px rgba(94,234,212,0.3)" } : {}}
                        whileTap={!revealed ? { scale: 0.9 } : {}}
                        animate={sealActive ? {
                            scale: [1, 1.25, 0.93, 1.06, 1],
                            rotate: [0, -8, 5, -2, 0],
                        } : {}}
                        transition={sealActive
                            ? { duration: 0.6 }
                            : { type: "spring", stiffness: 280, damping: 20 }}
                        style={{
                            width: "72px", height: "72px", borderRadius: "50%",
                            border: revealed
                                ? "1px solid rgba(251,191,36,0.5)"
                                : "1px solid rgba(94,234,212,0.3)",
                            background: revealed
                                ? "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(212,160,83,0.12))"
                                : "linear-gradient(135deg, rgba(94,234,212,0.12), rgba(139,92,246,0.08))",
                            cursor: revealed ? "default" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.5rem",
                            boxShadow: revealed
                                ? "0 0 35px rgba(251,191,36,0.25), 0 0 60px rgba(251,191,36,0.08)"
                                : "0 0 20px rgba(94,234,212,0.12), 0 8px 24px rgba(0,0,0,0.3)",
                            backdropFilter: "blur(8px)",
                            transition: "background 0.5s, box-shadow 0.5s, border-color 0.5s",
                        }}
                    >
                        {revealed ? "✦" : "☽"}
                    </motion.button>

                    {/* Revealed commitment with typewriter */}
                    <AnimatePresence>
                        {revealed && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    fontFamily: "var(--font-heading)",
                                    fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
                                    fontStyle: "italic", fontWeight: 400,
                                    color: "var(--amber-soft)",
                                    textAlign: "center",
                                    maxWidth: "320px",
                                    textShadow: "0 0 20px rgba(212,160,83,0.2)",
                                }}
                            >
                                <TypeAnimation
                                    sequence={["\"I choose kindness in my words — always.\""]}
                                    speed={50}
                                    cursor={false}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
