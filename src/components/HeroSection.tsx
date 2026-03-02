"use client";

import { motion } from "framer-motion";


function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as Record<string, { scrollTo: (el: Element, opts: object) => void }>).__lenis;
    if (lenis?.scrollTo) lenis.scrollTo(el, { offset: -40, duration: 1.8 });
    else el.scrollIntoView({ behavior: "smooth" });
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HeroSection() {

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center max-w-2xl">

                {/* Headline */}
                <motion.h1
                    variants={fadeUp}
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(3rem, 9vw, 6.5rem)",
                        fontWeight: 400,
                        fontStyle: "italic",
                        color: "var(--ivory)",
                        lineHeight: 1.08,
                        letterSpacing: "-0.02em",
                        marginBottom: "1.2rem",
                    }}
                >
                    I&apos;m sorry,{" "}
                    <motion.span
                        initial={{ backgroundSize: "0% 100%" }}
                        animate={{ backgroundSize: "100% 100%" }}
                        transition={{ duration: 1.5, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            background: "linear-gradient(135deg, var(--teal-soft), var(--lavender), var(--amber-warm))",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        mi amor.
                    </motion.span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    variants={fadeUp}
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(0.95rem, 2.2vw, 1.15rem)",
                        fontWeight: 300,
                        color: "var(--ivory-dim)",
                        lineHeight: 1.75,
                        maxWidth: "480px",
                        margin: "0 auto 2.5rem",
                    }}
                >
                    Nandini, I regret the words I used this morning.
                    <br />
                    <span style={{ color: "var(--ivory-faint)", fontSize: "0.92em" }}>
                        This page holds what I should have said instead.
                    </span>
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.button
                        onClick={() => scrollTo("note")}
                        whileHover={{ scale: 1.05, y: -3, boxShadow: "0 0 40px rgba(94,234,212,0.3), 0 6px 20px rgba(0,0,0,0.3)" }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        style={{
                            padding: "0.85rem 2.4rem",
                            borderRadius: "100px",
                            border: "1px solid rgba(94,234,212,0.35)",
                            background: "linear-gradient(135deg, rgba(94,234,212,0.15), rgba(139,92,246,0.1))",
                            color: "var(--ivory)",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.88rem",
                            fontWeight: 500,
                            letterSpacing: "0.03em",
                            cursor: "pointer",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 0 25px rgba(94,234,212,0.15), 0 4px 16px rgba(0,0,0,0.3)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <motion.span
                            className="absolute inset-0"
                            style={{
                                background: "radial-gradient(circle at 50% 0%, rgba(94,234,212,0.15), transparent 60%)",
                                pointerEvents: "none",
                            }}
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                        />
                        Read my note
                    </motion.button>

                    <motion.button
                        onClick={() => scrollTo("response")}
                        whileHover={{ scale: 1.05, y: -3, borderColor: "rgba(167,139,250,0.4)" }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        style={{
                            padding: "0.85rem 2.4rem",
                            borderRadius: "100px",
                            border: "1px solid var(--ivory-ghost)",
                            background: "rgba(245,240,232,0.04)",
                            color: "var(--ivory-dim)",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.88rem",
                            fontWeight: 400,
                            letterSpacing: "0.03em",
                            cursor: "pointer",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        Tell me how you feel
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Animated scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
                <span style={{
                    fontFamily: "var(--font-body)", fontSize: "0.62rem",
                    letterSpacing: "0.35em", textTransform: "uppercase" as const,
                    color: "rgba(245,240,232,0.18)",
                }}>
                    scroll
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    style={{
                        width: "1px", height: "28px",
                        background: "linear-gradient(to bottom, rgba(94,234,212,0.4), transparent)",
                    }}
                />
            </motion.div>
        </section>
    );
}
