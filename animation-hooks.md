# Animation Hooks Reference

Complete implementations for the three core animation hooks. Place in `client/src/hooks/`.

## useLenis.ts

Lenis smooth scroll with heavy, luxury-tier feel. Duration 1.8 creates weighted momentum.

```typescript
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
```

**Key parameters:**
- `duration: 1.8` — Heavy, luxury feel. Increase for more weight, decrease for snappier.
- `easing` — Exponential ease-out. Feels organic and non-linear.
- `touchMultiplier: 1.5` — Slightly amplified touch scroll for mobile.

Set `html { scroll-behavior: auto; }` in CSS to avoid conflicts with native smooth scroll.

## useScrollAnimation.ts

GSAP ScrollTrigger hook that auto-animates elements with `data-animate` attributes. Initialize once, auto-discovers all annotated elements.

```typescript
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const timer = setTimeout(() => {
      // Cinematic fade-up reveals
      document.querySelectorAll("[data-animate='fade-up']").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 55 },
          {
            opacity: 1, y: 0, duration: 1.6, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      // Staggered children reveals
      document.querySelectorAll("[data-animate='stagger']").forEach((group) => {
        gsap.fromTo(group.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 82%", toggleActions: "play none none none" },
          }
        );
      });

      // Gold rule width animation
      document.querySelectorAll("[data-animate='rule']").forEach((rule) => {
        gsap.fromTo(rule,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 2.2, ease: "power2.inOut",
            scrollTrigger: { trigger: rule, start: "top 92%", toggleActions: "play none none none" },
          }
        );
      });

      // Parallax images — slow drift on scroll
      document.querySelectorAll("[data-animate='parallax']").forEach((el) => {
        gsap.to(el, {
          y: -70, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 2.5 },
        });
      });

      // Scale reveal for images — emerge from darkness
      document.querySelectorAll("[data-animate='scale-reveal']").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 1.08 },
          {
            opacity: 1, scale: 1, duration: 2.2, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });

      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}
```

**Key details:**
- 400ms delay ensures DOM is ready after preloader and content mount.
- `toggleActions: "play none none none"` — animate once, never reverse (cinematic, not bouncy).
- `scrub: 2.5` on parallax creates a heavy, lagging drift effect.
- Call `ScrollTrigger.refresh()` after setup to recalculate positions.

## useMouseParallax.ts

Smoothed mouse position tracking for multi-layer parallax. Returns `{ x, y }` offset values.

```typescript
import { useEffect, useRef, useState } from "react";

interface ParallaxPosition { x: number; y: number; }

export function useMouseParallax(intensity: number = 20) {
  const [position, setPosition] = useState<ParallaxPosition>({ x: 0, y: 0 });
  const targetRef = useRef<ParallaxPosition>({ x: 0, y: 0 });
  const currentRef = useRef<ParallaxPosition>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetRef.current = {
        x: ((e.clientX - cx) / cx) * intensity,
        y: ((e.clientY - cy) / cy) * intensity,
      };
    };

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.06;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.06;
      setPosition({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [intensity]);

  return position;
}
```

**Usage in components:**

```tsx
const parallax = useMouseParallax(18);

// Background layer (subtle movement)
style={{ transform: `translate(${parallax.x * 0.15}px, ${parallax.y * 0.15}px)` }}

// Subject layer (prominent movement)
style={{ transform: `translate(${parallax.x * 0.7}px, ${parallax.y * 0.5}px)` }}

// Glow layer (medium movement)
style={{ transform: `translate(${parallax.x * 0.3}px, ${parallax.y * 0.3}px)` }}
```

**Key parameters:**
- `intensity: 18` — Maximum pixel offset from center. Higher = more dramatic.
- `0.06` lerp factor — Controls smoothing. Lower = heavier, more viscous. Range: 0.03 (very heavy) to 0.12 (responsive).
- Multiply parallax values by different factors per layer to create depth separation.

## Hero Animation Timeline

GSAP timeline for the hero entrance after images load:

```typescript
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.fromTo(nestRef.current,
    { opacity: 0, scale: 1.15 },
    { opacity: 0.4, scale: 1.05, duration: 3.5 })
  .fromTo(waspRef.current,
    { opacity: 0, scale: 1.08, x: 40 },
    { opacity: 1, scale: 1, x: 0, duration: 2.8, ease: "power2.out" },
    "-=2.8")
  .fromTo(taglineRef.current,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 1.2 },
    "-=1.6")
  .fromTo(titleRef.current,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.8 },
    "-=0.8")
  .fromTo(subtitleRef.current,
    { opacity: 0 },
    { opacity: 1, duration: 1.4 },
    "-=1.0")
  .fromTo(scrollIndicatorRef.current,
    { opacity: 0 },
    { opacity: 0.5, duration: 1.2 },
    "-=0.5");
```

**Timing pattern:** Background first (3.5s), then subject overlapping, then text cascading with overlapping offsets. Total perceived duration ~4s. Use negative offsets (`"-=X"`) to overlap animations for fluid, non-sequential feel.
