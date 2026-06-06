/**
 * Footer — Minimal with ghosted decorative text
 * Design: Crystalline Emergence — large ghosted serif, gold rule
 */
export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "oklch(0.04 0.005 70)" }}
    >
      <div className="gold-rule w-full" data-animate="rule" />

      {/* Ghosted decorative text */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden"
        style={{
          fontFamily: "'Cormorant', Georgia, serif",
          fontSize: "clamp(6rem, 15vw, 18rem)",
          fontWeight: 300,
          color: "oklch(0.94 0.02 90 / 0.025)",
          lineHeight: 0.85,
          whiteSpace: "nowrap",
          letterSpacing: "-0.04em",
        }}
      >
        CARTA VESPA HIVE
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo */}
          <div>
            <div
              className="text-utility tracking-[0.3em] mb-2"
              style={{ color: "oklch(0.62 0.14 70 / 50%)", fontSize: "0.55rem" }}
            >
              CARTA VESPA HIVE
            </div>
            <div
              className="text-utility-sm"
              style={{ color: "oklch(0.94 0.02 90 / 20%)" }}
            >
              FIVE CONNECTED PROPERTIES &mdash; {new Date().getFullYear()}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex gap-8">
            {[
              { label: "About", href: "#origin" },
              { label: "Sites", href: "#projects" },
              { label: "Structure", href: "#vision" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-utility-sm transition-colors duration-500"
                style={{ color: "oklch(0.94 0.02 90 / 25%)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "oklch(0.62 0.14 70 / 60%)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "oklch(0.94 0.02 90 / 25%)")
                }
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector(link.href)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {link.label.toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-12 text-utility-sm"
          style={{ color: "oklch(0.94 0.02 90 / 12%)", fontSize: "0.4rem" }}
        >
          &copy; {new Date().getFullYear()} CARTA VESPA HIVE LLC. A CAVERN OF
          CONNECTED SITES.
        </div>
      </div>
    </footer>
  );
}
