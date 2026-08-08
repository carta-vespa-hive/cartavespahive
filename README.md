# Carta Vespa Hive

Carta Vespa Hive is a diagram foundry. Its truth-model blueprint editor turns rough system facts into a structurally coherent, labeled diagram through one workflow:

> Structure → Expand → Inspect

The active product does not contain or manage Quail's other projects. Apps, tools, artworks, characters, processes, and fictional systems are subjects that a creator can bring into CVH and turn into a diagram.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run typecheck
npm run build
```

CVH currently authors deterministic blueprints and exports them as portable, versioned JSON. It does not call a model or generate finished artwork.

## Active structure

```text
src/
├── App.tsx                    # Product page and truth-model blueprint editor
├── main.tsx                   # Single application entry
├── styles.css                 # Diagram-first visual system
├── components/
│   ├── BlueprintEditor.tsx    # Local authoring session and workbench
│   ├── BlueprintInspector.tsx # Plain-English and progressive controls
│   └── BlueprintCanvas.tsx    # Accessible editable SVG projection
└── lib/
    ├── blueprint.ts           # Typed truth/view document and reducer
    ├── blueprintValidation.ts # Deterministic structural warnings
    └── blueprintExport.ts     # Versioned portable JSON export
```

Read `AGENTS.md` before changing product direction and `WORKFLOW.md` before extending the diagram pipeline.
