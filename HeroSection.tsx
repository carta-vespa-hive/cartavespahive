/**
 * HeroSection — Full viewport with 3D pyramid scene + editorial text
 * Design: Crystalline Emergence — elements emerge from void
 */
import { useRef, useEffect, Suspense } from "react";
import gsap from "gsap";
import CymaticBackground from "./src/components/CymaticBackground";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { SITES } from "./siteData";

const HERO_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663328288612/n35ShxAD8wf6XQ8UBrQARC/cvh-hero-pyramid-QyzL7ugeVvgs28AdGZtTWF.webp";

export default function HeroSection() {
  const parallax = useMouseParallax(18);
  const taglineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const sitesPanelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 2.4,
    });

    tl.fromTo(
      imageRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 0.35, scale: 1, duration: 3.0 }
    )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2 },
        "-=2.0"
      )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.8 },
        "-=0.8"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 1.4 },
        "-=1.0"
      )
      .fromTo(
        sitesPanelRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1.3 },
        "-=1.0"
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 0.5, duration: 1.2 },
        "-=0.5"
      );

    gsap.to(scrollRef.current, {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: "power1.inOut",
      delay: 5,
    });
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 3D Scene layer */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${parallax.x * 0.3}px, ${parallax.y * 0.3}px)`,
        }}
      >
        <Suspense fallback={null}>
          <CymaticBackground />
        </Suspense>
      </div>

      {/* Background image layer */}
      <div
        ref={imageRef}
        className="absolute inset-0 opacity-0"
        style={{
          transform: `translate(${parallax.x * 0.15}px, ${parallax.y * 0.15}px)`,
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, rgba(0,0,0,0.4) 40%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, rgba(0,0,0,0.4) 40%, transparent 70%)",
          filter: "brightness(0.7) saturate(1.3)",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, oklch(0.05 0.005 70) 0%, transparent 40%, transparent 60%, oklch(0.05 0.005 70 / 30%) 100%)",
        }}
      />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 pb-20 md:pb-28 px-6 md:px-16 lg:px-24">
        <div
          ref={taglineRef}
          className="text-utility-sm mb-4 opacity-0"
          style={{ color: "oklch(0.62 0.14 70 / 55%)" }}
        >
          CARTA VESPA HIVE LLC &mdash; EST. 2024
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,820px)_300px] gap-10 items-end">
          <div>
            <h1
              ref={titleRef}
              className="heading-display opacity-0"
              style={{
                fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
                color: "oklch(0.94 0.02 90 / 90%)",
                lineHeight: 0.92,
                maxWidth: "820px",
              }}
            >
              A cavern of{" "}
              <em
                style={{
                  color: "oklch(0.62 0.14 70)",
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                five sites
              </em>
              .
            </h1>

            <p
              ref={subtitleRef}
              className="mt-6 opacity-0"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                color: "oklch(0.94 0.02 90 / 45%)",
                maxWidth: "520px",
                lineHeight: 1.8,
              }}
            >
              Carta Vespa Hive is the entry chamber. Each translucent inverted
              pyramid below represents a separate web property, connected by a
              shared visual language and a common obsession with structure.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="text-utility px-6 py-3 transition-all duration-700 hover:tracking-[0.22em]"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: "oklch(0.62 0.14 70 / 12%)",
                  border: "1px solid oklch(0.62 0.14 70 / 30%)",
                  color: "oklch(0.94 0.02 90 / 82%)",
                }}
              >
                EXPLORE THE CAVERN
              </a>
              <a
                href="#contact"
                className="text-utility px-6 py-3 transition-all duration-700 hover:tracking-[0.22em]"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: "transparent",
                  border: "1px solid oklch(0.55 0.12 185 / 24%)",
                  color: "oklch(0.94 0.02 90 / 68%)",
                }}
              >
                GET IN TOUCH
              </a>
            </div>
          </div>

          <div
            className="opacity-0 xl:justify-self-end"
            ref={sitesPanelRef}
            style={{
              border: "1px solid oklch(0.62 0.14 70 / 12%)",
              background: "linear-gradient(180deg, oklch(0.08 0.01 70 / 78%), oklch(0.05 0.005 70 / 55%))",
              backdropFilter: "blur(18px)",
              padding: "1.1rem 1rem",
            }}
          >
            <div className="text-utility-sm mb-4" style={{ color: "oklch(0.62 0.14 70 / 48%)" }}>
              FIVE PYRAMIDS
            </div>
            <div className="space-y-3">
              {SITES.map((site) => (
                <a
                  key={site.id}
                  href={site.href}
                  onClick={(e) => {
                    const targetId = site.id === "carta-vespa-hive" ? "projects" : site.id;
                    const card = document.getElementById(targetId);
                    if (card) {
                      e.preventDefault();
                      card.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  style={{ borderTop: "1px solid oklch(0.94 0.02 90 / 8%)", paddingTop: "0.75rem" }}
                  className="block transition-transform duration-500 hover:translate-x-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-utility-sm" style={{ color: site.accent }}>
                        {site.number}
                      </div>
                      <div
                        style={{
                          color: "oklch(0.94 0.02 90 / 82%)",
                          fontSize: "1.15rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {site.title}
                      </div>
                    </div>
                    <div className="text-utility-sm" style={{ color: "oklch(0.94 0.02 90 / 28%)" }}>
                      OPEN
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <div
          className="w-px h-8"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.62 0.14 70 / 60%), transparent)",
          }}
        />
      </div>
    </section>
  );
}
