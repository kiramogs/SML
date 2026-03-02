"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.07,
            smoothWheel: true,
            wheelMultiplier: 1.0,
        });
        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // expose for scroll-to buttons
        (window as unknown as Record<string, Lenis>).__lenis = lenis;

        return () => { lenis.destroy(); };
    }, []);

    return <>{children}</>;
}
