# CVH agent rules

## Studio sentence

Carta Vespa Hive directs rough source material into coherent visual forms: diagrams, artifacts, images, interfaces, and production-ready creative systems.

## Active product and repository boundary

- This repository contains the Carta Vespa Hive multimodal studio website and its flagship Diagram Foundry workbench.
- `src/` is the sole active application source.
- Legacy CVH implementations are archived outside this repository. Do not copy, restore, nest, or reintroduce them here.
- Quail's other projects are separate products and separate repositories.
- The site may present the foundry's commissioned practices and selected work, but it must not absorb the source code, product dashboards, or operational hierarchies of Quail's other projects.
- Vespillery and other standalone products remain separate repositories and deployments. They may be referenced as work only when explicitly approved.
- Add new practices through the shared foundry architecture rather than inventing a new top-level company for each capability.
- Preserve this boundary in every change. If work requires another product's code, stop and keep that implementation outside this repository.

## Source of truth and current layout

- `WORKFLOW.md` defines the complete product method.
- `README.md` describes the current product and local workflow.
- `index.html` is the Vite HTML shell.
- `src/main.tsx` is the single React entry point.
- `src/App.tsx` contains the studio page and mounts the truth-model blueprint editor.
- `src/styles.css` contains the studio visual system and workbench styling.
- `src/lib/blueprint.ts` defines the typed truth/view document and immutable reducer.
- `src/lib/blueprintValidation.ts` defines deterministic structural warnings.
- `src/lib/blueprintExport.ts` defines the portable versioned JSON export.
- `public/` is reserved for static assets when they are needed.
- Root `package.json`, `package-lock.json`, `tsconfig.json`, and `vite.config.ts` are the active runtime and build configuration.

The current studio page presents selected work and authors a typed truth model through its embedded workbench. The workbench projects truth into an editable SVG blueprint, reports deterministic completeness warnings, and exports versioned JSON. It does not call a model, generate finished artwork, or perform AI inspection.

## Workflow law

1. **Structure:** geometry, chambers, layers, connectors, attachment points, section plane.
2. **Expand:** materials, lighting, density, callouts, render specification.
3. **Inspect:** compare against the blueprint and pass, revise, or reject.

Do not skip Structure. Do not allow Expand to change approved spatial facts. Do not let Inspect rubber-stamp a pretty image.

## Visual direction

- Multimodal foundry, annotated field guide, and contemporary editorial utility.
- Warm paper, dark ink, functional color coding, modern sans-serif and mono typography.
- No dark-luxury landing-page language.
- No generic hive decoration, film grain, parallax spectacle, or decorative 3D background unless it belongs to presented work.
- Every visible element should clarify structure, state, or action.

## Engineering rules

- Keep one entry point: `src/main.tsx`.
- Prefer typed data contracts over prompt-only behavior.
- Never imply that AI work completed when a feature is deterministic or mocked.
- Keep exports portable: JSON first, then SVG/PNG/PDF when those features are implemented.
- Keep dependencies in `node_modules/`; never vendor them into `src/`.
- Treat `dist/` and `.DS_Store` files as generated local artifacts, not source.

## Local commands and verification

- Install dependencies: `npm install`
- Start the development app: `npm run dev`
- Run tests: `npm test`
- Type-check: `npm run typecheck`
- Build production output: `npm run build`
- Preview the production build: `npm run preview`

After changes, run `npm test`, `npm run typecheck`, and `npm run build`. For UI or runtime changes, also open the development preview and inspect the affected flow in a browser.
