/**
 * HeroSection — Minimal Manus-style visual-first hero
 * Top-left wordmark + EST. 2024, top-right nav, faint pyramid geometry, heavy void.
 */
import { useRef, useEffect, Suspense } from "react";
import gsap from "gsap";
import CymaticBackground from "./src/components/CymaticBackground";

export default function HeroSection() {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 2.2,
    });

    tl.fromTo(
      wordmarkRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 1.4 },
      0
    )
      .fromTo(
        tagRef.current,
        { opacity: 0, y: 10 },
        { opacity: 0.55, y: 0, duration: 1.2 },
        0.3
      )
      .fromTo(
        navRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 1.1 },
        0.2
      );
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 3D background layer */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <CymaticBackground />
        </Suspense>
      </div>

      {/* Faint pyramid wireframe accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden />
      <svg
        className="absolute right-16 top-24 h-64 w-64 opacity-[0.18]"
        viewBox="0 0 200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 10 L190 160 L10 160 Z"
          stroke="currentColor"
          strokeWidth="1.1"
          className="text-amber-400"
        />
        <path
          d="M100 10 L130 70 L70 70 Z"
          stroke="currentColor"
          strokeWidth="1.1"
          className="text-amber-400"
        />
        <path
          d="M10 160 L100 100"
          stroke="currentColor"
          strokeWidth="1"
          className="text-amber-400"
        />
        <path
          d="M190 160 L100 100"
          stroke="currentColor"
          strokeWidth="1"
          className="text-amber-400"
        />
      </svg>

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 px-6 md:px-12 lg:px-16">
        <div className="flex items-start justify-between">
          <div className="pt-6 md:pt-8">
            <div
              ref={wordmarkRef}
              className="text-xs font-semibold tracking-[0.22em] text-amber-500/90 mix-blend-screen"
            >
              CARTA VESPA HIVE
            </div>
            <div
              ref={tagRef}
              className="mt-2 text-[11px] font-mono tracking-[0.18em] text-white/40"
            >
              EST. 2024
            </div>
          </div>

          <nav
            ref={navRef}
            className="hidden md:flex items-center gap-6 pt-6 md:pt-8 text-[11px] font-mono tracking-[0.18em] text-white/50"
          >
            <span className="hover:text-white/80 transition-colors">ORIGIN</span>
            <span className="hover:text-white/80 transition-colors">PROJECTS</span>
            <span className="hover:text-white/80 transition-colors">VISION</span>
            <span className="hover:text-white/80 transition-colors">CONTACT</span>
          </nav>
        </div>
      </div>
    </section>
  );
}
