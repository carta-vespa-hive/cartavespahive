/**
 * VisionSection — Full-bleed parallax image with manifesto text
 * Design: Crystalline Emergence — cinematic, immersive
 * Optimized: uses CSS shimmer instead of second Three.js scene for performance
 */

const VISION_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663328288612/n35ShxAD8wf6XQ8UBrQARC/cvh-hero-pyramid-foQsU8cjdzYxNkjdPxuiZA.png";

export default function VisionSection() {
  return (
    <section id="vision" className="relative">
      {/* Full-bleed parallax image */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0"
          data-animate="parallax"
          style={{
            backgroundImage: `url(${VISION_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.5) saturate(1.3)",
            transform: "scale(1.1)",
          }}
        />

        {/* Animated gold shimmer overlay instead of heavy 3D scene */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, oklch(0.62 0.14 70 / 4%) 45%, transparent 55%, oklch(0.55 0.12 185 / 3%) 70%, transparent 80%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 12s ease-in-out infinite",
          }}
        />

        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.05 0.005 70) 0%, transparent 30%, transparent 70%, oklch(0.05 0.005 70) 100%)",
          }}
        />

        {/* Centered manifesto text */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center max-w-[800px]" data-animate="fade-up">
            <div
              className="text-utility-sm mb-8"
              style={{ color: "oklch(0.62 0.14 70 / 45%)" }}
            >
              003 &mdash; STRUCTURE
            </div>
            <h2
              className="heading-display"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                color: "oklch(0.94 0.02 90 / 90%)",
              }}
            >
              This is not a portfolio
              <br />
              grid. It is a{" "}
              <em style={{ color: "oklch(0.55 0.12 185)", fontWeight: 300 }}>
                chamber
              </em>
              .
            </h2>
            <p
              className="mt-8 mx-auto"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                color: "oklch(0.94 0.02 90 / 40%)",
                lineHeight: 2,
                maxWidth: "600px",
              }}
            >
              The homepage works best as a spatial metaphor: a dark cavern, five
              luminous inverted pyramids, and a visitor moving from one object
              to the next. It should feel exploratory instead of corporate.
            </p>
          </div>
        </div>
      </div>

      {/* Manifesto details */}
      <div
        className="py-32 md:py-44"
        style={{ background: "oklch(0.05 0.005 70)" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12"
            data-animate="stagger"
          >
            {[
              {
                title: "Distinct Sites",
                description:
                  "Each pyramid stands for its own property, with enough identity to feel independent rather than duplicated.",
                icon: "◇",
              },
              {
                title: "Shared Geometry",
                description:
                  "The inverted pyramid form becomes the recurring signal that ties the separate sites back to the same world.",
                icon: "△",
              },
              {
                title: "Explorable Atmosphere",
                description:
                  "The visual treatment should feel immersive, subterranean, and cinematic enough that the homepage behaves like a place.",
                icon: "□",
              },
            ].map((item) => (
              <div key={item.title}>
                <div
                  className="mb-6"
                  style={{
                    color: "oklch(0.55 0.12 185 / 50%)",
                    fontSize: "1.5rem",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  className="heading-display mb-4"
                  style={{
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    color: "oklch(0.94 0.02 90 / 80%)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
                    color: "oklch(0.94 0.02 90 / 40%)",
                    lineHeight: 1.8,
                    fontWeight: 400,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
