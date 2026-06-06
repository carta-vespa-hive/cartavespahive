export const SITES = [
  {
    id: "carta-vespa-hive",
    number: "01",
    title: "Carta Vespa Hive",
    subtitle: "THE HUB",
    description:
      "The central entry chamber of the project cavern. Serves as a responsive, high-end visual and technical index for all connected web properties.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663328288612/n35ShxAD8wf6XQ8UBrQARC/cvh-hero-pyramid-QyzL7ugeVvgs28AdGZtTWF.webp",
    tags: ["PORTAL", "THREE.js", "GSAP"],
    status: "ENTRY",
    href: "#",
    accent: "oklch(0.72 0.09 185 / 80%)",
  },
  {
    id: "vetavorphosis",
    number: "02",
    title: "Vetavorphosis",
    subtitle: "TURING INCUBATOR",
    description:
      "An interactive reaction-diffusion simulator that visualizes organic mathematical patterns hatching and evolving from eggs.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663328288612/n35ShxAD8wf6XQ8UBrQARC/cvh-project-ubsess-5Yx5UqgBLpUfBiVMVy6KQY.webp",
    tags: ["TURING", "SIMULATION", "HTML5"],
    status: "INCUBATOR",
    href: "../vorph_ai2/vorph-homepage.html",
    accent: "oklch(0.74 0.12 165 / 80%)",
  },
  {
    id: "hive-soundboard",
    number: "03",
    title: "Hive Soundboard",
    subtitle: "INSECT AUDIO SYNTH",
    description:
      "An interactive web audio sequencer and soundboard that utilizes insect sounds and custom-engineered synthesizers to construct complex beats.",
    image: "/manus-storage/cvh-spectula-v2_06fdc1ec.png",
    tags: ["AUDIO", "SEQUENCER", "REACT"],
    status: "SOUNDPACK",
    href: "../Creating Music with Insect Sounds on Hive Soundboard/index.html",
    accent: "oklch(0.78 0.1 220 / 80%)",
  },
  {
    id: "cozzor",
    number: "04",
    title: "Cozzor",
    subtitle: "GRID PROTOCOL",
    description:
      "A premium visual interface utilizing parametric design principles, custom CSS grids, and experimental layout hierarchies.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663328288612/n35ShxAD8wf6XQ8UBrQARC/cvh-project-hive-EgoNZjb6M3AGfJGZQP4tqX.webp",
    tags: ["LAYOUT", "CSS GRID", "GEOMETRY"],
    status: "PROPERTY",
    href: "../cozzor/index.html",
    accent: "oklch(0.76 0.08 140 / 80%)",
  },
  {
    id: "vorph-ai",
    number: "05",
    title: "Vorph AI",
    subtitle: "COGNITIVE SYSTEM",
    description:
      "The official production platform and interface for Vorph AI, a futuristic and highly optimized cognitive computing system.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663328288612/n35ShxAD8wf6XQ8UBrQARC/cvh-hero-pyramid-foQsU8cjdzYxNkjdPxuiZA.png",
    tags: ["AI", "PRODUCTION", "LIVE"],
    status: "LIVE",
    href: "http://www.vorph.ai/",
    accent: "oklch(0.76 0.12 190 / 80%)",
  },
] as const;

export type Site = (typeof SITES)[number];
