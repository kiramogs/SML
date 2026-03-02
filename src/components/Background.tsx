"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export default function Background() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setReady(true));
    }, []);

    const options: ISourceOptions = useMemo(() => ({
        fullScreen: { enable: true, zIndex: 2 },
        fpsLimit: 60,
        background: { color: { value: "transparent" } },
        particles: {
            number: { value: 70, density: { enable: true, width: 1920, height: 1080 } },
            color: { value: ["#f5f0e8", "#5eead4", "#a78bfa", "#fbbf24"] },
            shape: { type: "circle" },
            opacity: {
                value: { min: 0.1, max: 0.7 },
                animation: { enable: true, speed: 0.8, startValue: "random", sync: false },
            },
            size: {
                value: { min: 0.8, max: 2.5 },
                animation: { enable: true, speed: 1.5, startValue: "random", sync: false },
            },
            move: {
                enable: true,
                speed: { min: 0.1, max: 0.4 },
                direction: "none" as const,
                random: true,
                straight: false,
                outModes: { default: "out" as const },
            },
            links: {
                enable: true,
                distance: 120,
                color: "#5eead4",
                opacity: 0.06,
                width: 0.8,
            },
            twinkle: {
                particles: {
                    enable: true,
                    frequency: 0.03,
                    opacity: 1,
                    color: { value: "#fbbf24" },
                },
            },
        },
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "grab",
                },
                onClick: {
                    enable: true,
                    mode: "push",
                },
            },
            modes: {
                grab: {
                    distance: 140,
                    links: { opacity: 0.25, color: "#5eead4" },
                },
                push: { quantity: 3 },
            },
        },
        detectRetina: true,
    }), []);

    return (
        <>
            {/* Night sky gradient */}
            <div className="night-sky" aria-hidden="true" />

            {/* Aurora ribbons */}
            <div className="aurora-container" aria-hidden="true">
                <div className="aurora-ribbon" />
                <div className="aurora-ribbon" />
                <div className="aurora-ribbon" />
            </div>

            {/* Interactive particle star field */}
            {ready && <Particles id="starfield" options={options} />}

            {/* Noise grain */}
            <div className="noise-overlay" aria-hidden="true" />
        </>
    );
}
