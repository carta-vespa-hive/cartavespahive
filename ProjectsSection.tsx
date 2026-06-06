/**
 * ProjectsSection — Staggered asymmetric project showcase
 * Design: Crystalline Emergence — each project emerges from a different depth layer
 */
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITES, type Site } from "./siteData";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({
  project,
}: {
  project: Site & { align: "left" | "right" };
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const el = cardRef.current;

    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: 80,
        x: project.align === "left" ? -40 : 40,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [project.align]);

  return (
    <div
      ref={cardRef}
      id={project.id}
      className="portal-card mb-16 md:mb-20 opacity-0 scroll-mt-28"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.10 0.015 70 / 78%), oklch(0.05 0.005 70 / 68%))",
        border: "1px solid oklch(0.62 0.14 70 / 10%)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] gap-8 lg:gap-12 items-center p-6 md:p-8 lg:p-10">
        <div className={`order-2 ${project.align === "right" ? "lg:order-2" : "lg:order-1"}`}>
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-utility-sm"
              style={{ color: project.accent }}
            >
              {project.number}
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.62 0.14 70 / 15%)" }}
            />
            <span
              className="text-utility-sm"
              style={{ color: "oklch(0.94 0.02 90 / 30%)" }}
            >
              {project.status}
            </span>
          </div>

          <div
            className="text-utility-sm mb-3"
            style={{ color: project.accent }}
          >
            {project.subtitle}
          </div>

          <h3
            className="heading-display mb-5"
            style={{
              fontSize: "clamp(2.05rem, 4vw, 3.6rem)",
              color: "oklch(0.94 0.02 90 / 88%)",
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              color: "oklch(0.94 0.02 90 / 48%)",
              lineHeight: 1.85,
              fontWeight: 400,
              maxWidth: "38rem",
            }}
          >
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-utility-sm px-3 py-1.5"
                style={{
                  color: project.accent,
                  border: "1px solid oklch(0.55 0.12 185 / 15%)",
                  fontSize: "0.45rem",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={project.href}
            className="inline-flex items-center gap-3 mt-8 text-utility transition-all duration-500 hover:tracking-[0.24em]"
            style={{
              color: "oklch(0.94 0.02 90 / 78%)",
            }}
          >
            <span>ENTER PORTAL</span>
            <span style={{ color: project.accent }}>↘</span>
          </a>
        </div>

        <div className={`order-1 ${project.align === "right" ? "lg:order-1" : "lg:order-2"}`}>
          <div className="portal-frame group mx-auto max-w-[420px]">
            <div
              className="portal-glow"
              style={{
                background: `radial-gradient(circle at 50% 38%, ${project.accent}, transparent 72%)`,
              }}
            />
            <div
              className="portal-shell"
              style={{
                border: `1px solid color-mix(in oklab, ${project.accent} 35%, transparent)`,
                boxShadow: `0 0 0 1px color-mix(in oklab, ${project.accent} 16%, transparent) inset`,
              }}
            >
              <div
                className="portal-image"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent 0%, oklch(0.05 0.005 70 / 70%) 100%), url(${project.image})`,
                }}
              />
              <div
                className="portal-cap"
                style={{ background: project.accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative py-32 md:py-44"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, oklch(0.10 0.02 185 / 22%), transparent 36%), oklch(0.06 0.008 70)",
      }}
    >
      {/* Gold rule */}
      <div className="gold-rule w-full" data-animate="rule" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 md:pt-28">
        {/* Section header */}
        <div className="mb-24 md:mb-32" data-animate="fade-up">
          <div
            className="text-utility-sm mb-6"
            style={{ color: "oklch(0.62 0.14 70 / 45%)" }}
          >
            002 &mdash; SITES
          </div>
          <h2
            className="heading-display"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
              color: "oklch(0.94 0.02 90 / 85%)",
              maxWidth: "700px",
            }}
          >
            Five pyramids. Five linked{" "}
            <em style={{ color: "oklch(0.55 0.12 185)", fontWeight: 300 }}>
              destinations
            </em>
          </h2>
          <p
            className="mt-6"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.06em",
              color: "oklch(0.94 0.02 90 / 35%)",
              maxWidth: "550px",
              lineHeight: 1.9,
            }}
          >
            Each object in the cavern stands for a different property. The goal
            is not to merge them, but to make the collection feel deliberate,
            connected, and worth exploring.
          </p>
        </div>

        {/* Project cards */}
        <div className="mt-16">
          {SITES.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={{ ...project, align: i % 2 === 0 ? "left" : "right" }}
          />
          ))}
        </div>
      </div>
    </section>
  );
}
