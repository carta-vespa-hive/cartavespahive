/**
 * Preloader — Cinematic loading screen
 * Design: Crystalline Emergence — gold progress bar on void black
 */
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.7,
          ease: "power2.inOut",
          onComplete: onComplete,
        });
      },
    });

    tl.to(
      {},
      {
        duration: 2.2,
        ease: "power2.out",
        onUpdate: function () {
          setProgress(Math.round(this.progress() * 100));
        },
      }
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{ background: "#050505" }}
    >
      <div
        className="text-utility-sm mb-8"
        style={{ color: "oklch(0.62 0.14 70 / 40%)" }}
      >
        CARTA VESPA HIVE
      </div>

      <div className="relative w-32 h-px" style={{ background: "oklch(0.62 0.14 70 / 10%)" }}>
        <div
          ref={barRef}
          className="absolute top-0 left-0 h-full transition-none"
          style={{
            width: `${progress}%`,
            background: "oklch(0.62 0.14 70 / 80%)",
          }}
        />
      </div>

      <div
        className="text-utility-sm mt-4"
        style={{ color: "oklch(0.62 0.14 70 / 25%)", fontSize: "0.45rem" }}
      >
        {progress}%
      </div>
    </div>
  );
}
