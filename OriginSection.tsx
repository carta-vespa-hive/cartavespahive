/**
 * OriginSection — Editorial spread about CVH
 * Design: Crystalline Emergence — gold rule, section number, asymmetric grid
 */

const INSPIRATION_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663328288612/n35ShxAD8wf6XQ8UBrQARC/cvh-project-hive-EgoNZjb6M3AGfJGZQP4tqX.webp";

export default function OriginSection() {
  return (
    <section
      id="origin"
      className="relative py-32 md:py-44"
      style={{ background: "oklch(0.05 0.005 70)" }}
    >
      {/* Gold rule divider */}
      <div className="gold-rule w-full" data-animate="rule" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 md:pt-28">
        {/* Section label */}
        <div
          className="text-utility-sm mb-16"
          data-animate="fade-up"
          style={{ color: "oklch(0.62 0.14 70 / 45%)" }}
        >
          001 &mdash; ABOUT
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Image column */}
          <div className="lg:col-span-5" data-animate="scale-reveal">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={INSPIRATION_IMAGE}
                alt="Hive interior structure"
                className="w-full h-full object-cover"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 60%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 60%, transparent 100%)",
                  filter:
                    "brightness(0.85) sepia(0.1) saturate(1.2) hue-rotate(-5deg)",
                  border: "1px solid oklch(0.62 0.14 70 / 12%)",
                }}
              />
              <div
                className="absolute bottom-4 left-4 text-utility-sm"
                style={{ color: "oklch(0.62 0.14 70 / 30%)", fontSize: "0.4rem" }}
              >
                FIG. 01 &mdash; HIVE INTERIOR TOPOLOGY
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
            <h2
              className="heading-display mb-8"
              data-animate="fade-up"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
                color: "oklch(0.94 0.02 90 / 85%)",
              }}
            >
              One chamber. Five separate{" "}
              <em style={{ color: "oklch(0.62 0.14 70)", fontWeight: 300 }}>
                destinations
              </em>
            </h2>

            <p
              data-animate="fade-up"
              style={{
                fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                color: "oklch(0.94 0.02 90 / 55%)",
                lineHeight: 1.8,
                fontWeight: 400,
              }}
            >
              This homepage is not meant to flatten everything into one brand
              statement. It is meant to act like an entrance: a single place
              where separate web properties can live together without losing
              their individual identity.
            </p>

            <p
              data-animate="fade-up"
              className="mt-6"
              style={{
                fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                color: "oklch(0.94 0.02 90 / 45%)",
                lineHeight: 1.8,
                fontWeight: 400,
              }}
            >
              The cavern, the inverted pyramids, and the repeated geometry are
              the connective tissue. Each site is its own object, but the
              atmosphere makes it clear they belong to the same constellation.
            </p>

            {/* User's inspiration art */}
            <div className="mt-10" data-animate="scale-reveal">
              <div
                className="relative overflow-hidden"
                style={{
                  border: "1px solid oklch(0.62 0.14 70 / 10%)",
                  background: "#0a0a0a",
                }}
              >
                <img
                  src="/manus-storage/cvh-inspiration_bf876748.webp"
                  alt="Pyramid wasp-nest geometric structures — CVH visual DNA"
                  className="w-full h-auto"
                  style={{
                    mixBlendMode: "lighten" as const,
                    filter: "brightness(0.95) saturate(1.2)",
                  }}
                />
                <div
                  className="absolute bottom-3 left-3 text-utility-sm"
                  style={{ color: "oklch(0.62 0.14 70 / 30%)", fontSize: "0.4rem" }}
                >
                  FIG. 02 — VISUAL SYSTEM STUDY
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div
              className="grid grid-cols-3 gap-8 mt-16 pt-8"
              data-animate="stagger"
              style={{ borderTop: "1px solid oklch(0.62 0.14 70 / 10%)" }}
            >
              {[
                { label: "SITES", value: "5" },
                { label: "SHARED DNA", value: "1" },
                { label: "SINCE", value: "2024" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="heading-display"
                    style={{
                      fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                      color: "oklch(0.62 0.14 70 / 80%)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-utility-sm mt-2"
                    style={{ color: "oklch(0.94 0.02 90 / 30%)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
