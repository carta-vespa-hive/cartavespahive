---
name: cvh-dark-editorial
description: Dark luxury editorial landing page workflow for Carta Vespa Hive and similar brands. Use when building cinematic, dark-themed landing pages with GSAP scroll animations, Lenis smooth scroll, mouse parallax, film-grain overlays, and editorial asymmetric layouts. Covers the full process from brainstorm to polished delivery.
---

# CVH Dark Luxury Editorial — Landing Page Skill

Build cinematic, dark-themed editorial landing pages with physics-based animation and luxury-tier aesthetics. This skill captures the proven workflow from the Carta Vespa Hive project.

## When to Use

- Dark luxury or high-fashion landing pages
- Brands requiring biomorphic, organic, or entomological aesthetics
- Pages that need cinematic scroll pacing, parallax, and GSAP-driven reveals
- Editorial layouts with dramatic negative space and photographic primacy

## Workflow

1. **Brainstorm** — Write `ideas.md` with 3 distinct design directions (see Section 1)
2. **Install Animation Stack** — `pnpm add gsap lenis`, restart dev server
3. **Generate Hero Images** — 3-5 high-quality images via `generate_image` before coding
4. **Configure Design Tokens** — Set up CSS variables, fonts, grain overlay (see `references/design-tokens.md`)
5. **Build Hooks** — Create Lenis, GSAP ScrollTrigger, and mouse parallax hooks (see `references/animation-hooks.md`)
6. **Build Sections** — Assemble page top-to-bottom using editorial patterns (see Section 3)
7. **Polish** — Refine image masking, vignettes, and transition timing
8. **Checkpoint & Deliver**

## 1. Brainstorm Format

Write `ideas.md` with 3 `<response>` blocks. Each must define:

- **Design Movement**: Specific aesthetic reference (e.g., "High-Fashion Editorial meets Dark Natural History Museum")
- **Core Principles**: 3-4 rules that guide ALL decisions
- **Color Philosophy**: Emotional intent behind each color, not just hex values
- **Layout Paradigm**: Structural approach (avoid centered grid defaults)
- **Signature Elements**: 2-3 recurring visual motifs
- **Interaction Philosophy**: How hover/scroll/click reflect the design ethos
- **Animation**: Specific easing, duration, and motion character
- **Typography System**: Font pairings with size/weight/spacing rules

Select one approach and commit fully. Document the philosophy at the top of every component file.

## 2. Animation Stack

### Dependencies

```bash
pnpm add gsap lenis
```

Restart the dev server after install.

### Three Core Hooks

Create these in `client/src/hooks/`:

1. **`useLenis.ts`** — Smooth scroll with heavy, luxury feel. See `references/animation-hooks.md`.
2. **`useScrollAnimation.ts`** — GSAP ScrollTrigger for cinematic reveals. Supports `data-animate` attributes: `fade-up`, `stagger`, `rule`, `parallax`, `scale-reveal`.
3. **`useMouseParallax.ts`** — Smoothed mouse tracking for hero parallax layers.

### Data-Animate Attributes

Apply to any element for automatic scroll-triggered animation:

| Attribute | Effect | Duration |
|-----------|--------|----------|
| `data-animate="fade-up"` | Opacity 0→1, Y +55→0 | 1.6s |
| `data-animate="stagger"` | Children stagger in | 1.2s, 0.15s stagger |
| `data-animate="rule"` | ScaleX 0→1 (gold rule) | 2.2s |
| `data-animate="parallax"` | Slow Y drift on scroll | Scrub 2.5 |
| `data-animate="scale-reveal"` | Scale 1.08→1, fade in | 2.2s |

### Easing

Default custom ease: `cubic-bezier(0.22, 1, 0.36, 1)` — heavy, deliberate, no bounce. Use `power3.out` for GSAP fade-ups, `power2.inOut` for rules.

## 3. Section Patterns

### Navigation

- Fixed top, transparent → opaque on scroll with backdrop blur
- Utility font, 0.5rem, 0.18em letter-spacing, uppercase
- Gold underline on hover extending with 0.7s transition
- Mobile: hamburger with two animated lines

### Hero (Full Viewport)

- Background: dark void (#0d0b08) with atmospheric texture image
- Primary image: radial-gradient mask to blend edges into darkness
- Multi-layer parallax: background at 0.15x, subject at 0.7x mouse intensity
- Text: bottom-left editorial placement, serif 300 weight
- Accent word in gold italic
- Scroll indicator: animated gold line pulse

### Editorial Spread (About)

- Gold rule divider at top (`data-animate="rule"`)
- Section number in utility font (e.g., "001 — Origin")
- 12-column grid: image 5 cols, text 6 cols offset
- Image: 3:4 aspect, bottom-fade gradient, subtle amber border
- Figure caption in utility font 0.45rem
- Stats grid at bottom: label in utility font, value in serif

### Brand Taxonomy

- Featured brand: large image + detailed description
- Image masking with radial gradient for seamless blending
- Data row: key attributes in utility font
- Future/emerging items: cards with SVG icons, corner accents

### Collection/Products

- Full-bleed hero image with parallax (`data-animate="parallax"`)
- Title overlay with text-shadow for contrast
- Product list: numbered items with name, material, description

### Contact

- Invitation heading with editorial copy
- Form: inputs with accent-tinted borders, utility font labels
- Email contacts in separate column

### Footer

- Large ghosted decorative text (serif, 15vw, opacity 0.03)
- Minimal nav links and copyright
- Gold rule divider at top

## 4. Image Masking Technique

Hero and feature images must blend seamlessly into the dark background:

```tsx
style={{
  maskImage: `radial-gradient(ellipse 72% 72% at 48% 42%, black 20%, rgba(0,0,0,0.65) 40%, transparent 68%)`,
  WebkitMaskImage: `radial-gradient(ellipse 72% 72% at 48% 42%, black 20%, rgba(0,0,0,0.65) 40%, transparent 68%)`,
  filter: "brightness(0.88) sepia(0.12) saturate(1.15) hue-rotate(-3deg)",
}}
```

Adjust ellipse percentages and center point per image. Always add a warm color correction filter to match the amber-toned background.

## 5. Film Grain Overlay

Add to `index.css` and render as a fixed overlay on the page:

```css
.grain-overlay {
  position: fixed;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,...feTurbulence...");
}
```

Use SVG feTurbulence with `baseFrequency="0.9"` and `numOctaves="4"`.

## 6. Preloader Pattern

Cinematic preloader with progress bar and fade-out:

- Brand name in utility font, 0.5rem, gold at 40% opacity
- 8rem gold progress bar on 1px track
- 2.2s ease-out-cubic duration
- Fade out with 0.7s transition before revealing content
- Main content fades in with 1.0s ease after preloader completes

## References

- **`references/design-tokens.md`** — Complete CSS variables, color palette, typography, and utility classes
- **`references/animation-hooks.md`** — Full implementation of useLenis, useScrollAnimation, and useMouseParallax hooks
