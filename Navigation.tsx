/**
 * Navigation — Fixed transparent nav with gold accents
 * Design: Crystalline Emergence — utility font, minimal, luxury
 */
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "About", href: "#origin" },
  { label: "Sites", href: "#projects" },
  { label: "Structure", href: "#vision" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 2.5 }
      );
    }
  }, []);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700"
      style={{
        background: scrolled
          ? "oklch(0.05 0.005 70 / 85%)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid oklch(0.62 0.14 70 / 8%)"
          : "1px solid transparent",
        opacity: 0,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#"
          className="text-utility tracking-[0.3em]"
          style={{ color: "oklch(0.62 0.14 70 / 70%)", fontSize: "0.55rem" }}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          CVH LLC
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-utility relative group"
              style={{ color: "oklch(0.94 0.02 90 / 50%)" }}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link.href);
              }}
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 h-px bg-amber transition-all duration-700 group-hover:w-full"
                style={{
                  width: "0%",
                  background: "oklch(0.62 0.14 70 / 60%)",
                }}
              />
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-6"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-px w-full transition-all duration-500"
            style={{
              background: "oklch(0.62 0.14 70 / 60%)",
              transform: menuOpen
                ? "rotate(45deg) translateY(4px)"
                : "none",
            }}
          />
          <span
            className="block h-px w-full transition-all duration-500"
            style={{
              background: "oklch(0.62 0.14 70 / 60%)",
              transform: menuOpen
                ? "rotate(-45deg) translateY(-4px)"
                : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-8 pt-4"
          style={{ background: "oklch(0.05 0.005 70 / 95%)" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block py-3 text-utility"
              style={{ color: "oklch(0.94 0.02 90 / 50%)" }}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
