# Design Tokens Reference

Complete CSS configuration for the dark luxury editorial aesthetic. Adapt colors and fonts to the specific brand.

## Google Fonts

Add to `client/index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
```

**Cormorant** = display serif (sharp, calligraphic). **Space Mono** = utility monospace (clinical precision). Substitute with similar pairings if brand requires (e.g., Playfair Display + JetBrains Mono).

## Color Palette (OKLCH for Tailwind 4)

| Token | OKLCH Value | Hex Approx | Usage |
|-------|------------|------------|-------|
| `--color-amber` | `oklch(0.62 0.14 70)` | #b5832a | Primary accent, gold highlights |
| `--color-amber-light` | `oklch(0.72 0.12 70)` | #d4a84a | Hover states, lighter gold |
| `--color-amber-dark` | `oklch(0.52 0.14 70)` | #8a6320 | Pressed states, darker gold |
| `--color-paper` | `oklch(0.94 0.02 90)` | #f0ead8 | Body text, paper white |
| `--color-chitin` | `oklch(0.12 0.01 70)` | #0d0b08 | Deepest black, hero bg |
| `--color-charcoal` | `oklch(0.18 0.02 70)` | #1a1208 | Card backgrounds, sections |
| `--color-iridescent` | `oklch(0.65 0.12 170)` | #4a9e8a | Rare accent, wing flash |

## Theme Variables (index.css :root)

```css
:root {
  --radius: 0.25rem;
  --background: oklch(0.10 0.015 70);
  --foreground: oklch(0.94 0.02 90);
  --card: oklch(0.14 0.015 70);
  --card-foreground: oklch(0.94 0.02 90);
  --popover: oklch(0.14 0.015 70);
  --popover-foreground: oklch(0.94 0.02 90);
  --primary: oklch(0.62 0.14 70);
  --primary-foreground: oklch(0.10 0.015 70);
  --secondary: oklch(0.18 0.02 70);
  --secondary-foreground: oklch(0.94 0.02 90);
  --muted: oklch(0.20 0.015 70);
  --muted-foreground: oklch(0.60 0.03 70);
  --accent: oklch(0.62 0.14 70);
  --accent-foreground: oklch(0.10 0.015 70);
  --border: oklch(0.62 0.14 70 / 15%);
  --input: oklch(0.62 0.14 70 / 20%);
  --ring: oklch(0.62 0.14 70);
}
```

Set `defaultTheme="dark"` in `App.tsx` ThemeProvider.

## Font Declarations (@theme inline)

```css
@theme inline {
  --font-serif: "Cormorant", Georgia, serif;
  --font-mono: "Space Mono", "Courier New", monospace;
}
```

Set body font-family to the serif in `@layer base`.

## Utility Classes (index.css @layer components)

### Film Grain Overlay

```css
.grain-overlay {
  position: fixed;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

### Gold Rule

```css
.gold-rule {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    oklch(0.62 0.14 70 / 40%) 20%,
    oklch(0.62 0.14 70 / 60%) 50%,
    oklch(0.62 0.14 70 / 40%) 80%,
    transparent 100%
  );
  border: none;
}
```

### Display Heading

```css
.heading-display {
  font-family: "Cormorant", Georgia, serif;
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
```

### Utility Text

```css
.text-utility {
  font-family: "Space Mono", "Courier New", monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

### Hexagonal Clip

```css
.hex-clip {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
```

### Selection Color

```css
::selection {
  background: oklch(0.62 0.14 70 / 30%);
  color: oklch(0.94 0.02 90);
}
```

## Typography Scale

| Element | Font | Weight | Size | Line-Height | Letter-Spacing |
|---------|------|--------|------|-------------|----------------|
| Hero title | Cormorant | 300 | clamp(2.8rem, 8vw, 6.5rem) | 0.92 | -0.02em |
| Section title | Cormorant | 300 | clamp(2.2rem, 5vw, 4.5rem) | 1.05 | -0.02em |
| Body text | Cormorant | 400 | clamp(1.1rem, 1.5vw, 1.25rem) | 1.75 | normal |
| Section label | Space Mono | 400 | 0.5rem | normal | 0.3em |
| Nav links | Space Mono | 400 | 0.5rem | normal | 0.18em |
| Figure caption | Space Mono | 400 | 0.45rem | normal | 0.15em |
| Subtitle | Space Mono | 400 | 0.5rem | 1.9 | 0.12em |

## Opacity Scale for Text on Dark Backgrounds

| Purpose | Opacity |
|---------|---------|
| Primary headings | 0.9 |
| Body text | 0.6 |
| Gold accent labels | 0.45-0.55 |
| Subtle captions | 0.18-0.3 |
| Hover gold | 0.6-0.7 |
| Ghosted decorative text | 0.03 |
