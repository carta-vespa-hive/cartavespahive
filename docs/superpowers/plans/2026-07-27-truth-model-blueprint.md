# Truth-Model Blueprint Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the prompt-oriented architect brief workbench with a dead-simple, plain-English editor that stores a system as typed truth, projects it into an editable blueprint, reports deterministic structural warnings, and exports portable JSON.

**Architecture:** Keep one Vite/React application and introduce framework-free domain modules for the blueprint document, immutable reducer, validation, and export. React owns only session and selection state; SVG projects `truth` plus independent `view` positions. The editor reveals system naming and parts first, then relationships and evidence through progressive disclosure.

**Tech Stack:** React 19.2, TypeScript 5.9 strict mode, Vite 7.1, browser-native SVG and Pointer Events, Vitest, jsdom, React Testing Library, Testing Library user-event, and the existing CSS visual system.

## Global Constraints

- `src/` remains the sole active application source and `src/main.tsx` remains the only entry point.
- Preserve the clean light diagram-foundry direction: warm paper, dark ink, restrained functional color, modern sans-serif and mono metadata, square borders, and no decorative spectacle.
- The first interaction must be plain English: name the system, add a part, say what it does. Evidence and relationship controls are progressively disclosed.
- Store structural facts in `BlueprintTruth`; store coordinates and viewport only in `BlueprintView`.
- Use stable generated IDs for systems, components, relationships, and evidence. Never use display names or array indexes as references.
- Validation is deterministic, non-destructive, and warning-only. It must not delete data or block export.
- Export UTF-8 JSON with the `.cvh-blueprint.json` suffix and separate versioned `truth` and `view` sections.
- Do not add JSON import, accounts, persistence, collaboration, SVG/PNG/PDF export, model calls, AI-generated images, futuristic illustrated cutaways, or Expand/Inspect-stage rendering.
- Use browser-native SVG; do not add a canvas or diagramming dependency for this slice.
- The worktree contains user-owned dirty changes. Do not stage, commit, reset, restore, or overwrite unrelated files. Every task ends with read-only verification instead of a Git commit.
- After implementation run `npm test`, `npm run typecheck`, and `npm run build`; then inspect the full interaction in a browser.

---

## Planned file layout

```text
src/
├── App.test.tsx                         # Product integration and old-workbench replacement
├── App.tsx                              # Existing page shell; mounts BlueprintEditor
├── components/
│   ├── BlueprintCanvas.test.tsx         # SVG projection, warnings, selection, dragging
│   ├── BlueprintCanvas.tsx              # Truth/view SVG projection
│   ├── BlueprintEditor.test.tsx         # Plain-English authoring and progressive flow
│   ├── BlueprintEditor.tsx              # Reducer orchestration and workbench layout
│   ├── BlueprintInspector.tsx           # System, part, evidence, relationship controls
│   ├── ValidationSummary.tsx            # Always-visible warning list
│   └── blueprintUi.ts                    # Shared component prop types and warning helpers
├── lib/
│   ├── blueprint.test.ts                # Truth/view reducer tests
│   ├── blueprint.ts                     # Typed document and immutable actions
│   ├── blueprintExport.test.ts          # Serialization, filename, download tests
│   ├── blueprintExport.ts               # Deterministic JSON and browser download adapter
│   ├── blueprintValidation.test.ts      # All warning rules
│   └── blueprintValidation.ts           # Pure deterministic validator
├── test/
│   └── setup.ts                         # jest-dom matchers and test cleanup
└── styles.css                           # Existing tokens plus editor/canvas/responsive styles
```

Additional repository changes:

- Modify `package.json`, `package-lock.json`, and `vite.config.ts` for the test harness.
- Modify `index.html` so metadata describes structural blueprint authoring, not generated cutaways.
- Delete `src/lib/architectBrief.ts` only after `rg architectBrief src` returns no references.
- Update `README.md`, `WORKFLOW.md`, and `AGENTS.md` after behavior is verified so their current-implementation sections remain truthful.

---

### Task 1: Install and prove the test harness

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/setup.test.tsx`

**Interfaces:**

- Consumes: the current Vite/React runtime and strict TypeScript configuration.
- Produces: `npm test`, `npm run test:watch`, jsdom, jest-dom matchers, and automatic React cleanup for every later task.

- [ ] **Step 1: Install exact test dependencies without changing runtime dependencies**

Run:

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Expected: `package.json` and `package-lock.json` change; no files under `src/` change yet.

- [ ] **Step 2: Add exact test scripts and Vite test configuration**

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Replace `vite.config.ts` with:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());
```

- [ ] **Step 3: Write the harness smoke test**

Create `src/test/setup.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("test setup", () => {
  it("renders React with jest-dom matchers", () => {
    render(<button type="button">Build blueprint</button>);
    expect(screen.getByRole("button", { name: "Build blueprint" })).toBeVisible();
  });
});
```

- [ ] **Step 4: Run the smoke test and typecheck**

Run:

```bash
npm test -- src/test/setup.test.tsx
npm run typecheck
```

Expected: one test passes; typecheck exits 0.

- [ ] **Step 5: Read-only checkpoint**

Run:

```bash
git diff --check
git status --short
```

Expected: only test-harness files from this task join the pre-existing dirty state. Do not stage or commit.

---

### Task 2: Define the truth document and immutable reducer

**Files:**

- Create: `src/lib/blueprint.test.ts`
- Create: `src/lib/blueprint.ts`

**Interfaces:**

- Consumes: no React APIs and no rendering state.
- Produces: `BlueprintDocument`, all entity types, `Point`, `BlueprintAction`, `createBlueprintDocument(systemId)`, `createEntityId(kind)`, `nextComponentPosition(index)`, and `blueprintReducer(document, action)`.

- [ ] **Step 1: Write failing reducer tests**

Create `src/lib/blueprint.test.ts` with these concrete cases:

```ts
import { describe, expect, it } from "vitest";
import {
  blueprintReducer,
  createBlueprintDocument,
  type ComponentTruth,
  type EvidenceTruth,
  type RelationshipTruth,
} from "./blueprint";

const component: ComponentTruth = {
  id: "component-intake",
  name: "Support form",
  label: "Capture request",
  description: "",
  evidenceIds: ["evidence-intake"],
};

const evidence: EvidenceTruth = {
  id: "evidence-intake",
  kind: "observation",
  statement: "All requests enter through the form.",
  reference: "",
};

const relationship: RelationshipTruth = {
  id: "relationship-submit",
  fromComponentId: "component-intake",
  toComponentId: "component-review",
  label: "Submit for review",
  evidenceIds: ["evidence-intake"],
};

describe("blueprintReducer", () => {
  it("keeps truth and view in separate document sections", () => {
    const initial = createBlueprintDocument("system-ai");
    const withComponent = blueprintReducer(initial, {
      type: "component.added",
      component,
      position: { x: 80, y: 120 },
    });
    const moved = blueprintReducer(withComponent, {
      type: "component.moved",
      componentId: component.id,
      position: { x: 240, y: 180 },
    });

    expect(moved.truth).toBe(withComponent.truth);
    expect(moved.view.componentPositions[component.id]).toEqual({ x: 240, y: 180 });
  });

  it("preserves stable references when a component is renamed", () => {
    let document = createBlueprintDocument("system-ai");
    document = blueprintReducer(document, { type: "component.added", component, position: { x: 0, y: 0 } });
    document = blueprintReducer(document, {
      type: "relationship.added",
      relationship,
    });
    document = blueprintReducer(document, {
      type: "component.updated",
      componentId: component.id,
      patch: { name: "Request intake" },
    });

    expect(document.truth.relationships[0].fromComponentId).toBe(component.id);
  });

  it("leaves relationships dangling when their component is removed", () => {
    let document = createBlueprintDocument("system-ai");
    document = blueprintReducer(document, { type: "component.added", component, position: { x: 0, y: 0 } });
    document = blueprintReducer(document, { type: "relationship.added", relationship });
    document = blueprintReducer(document, { type: "component.removed", componentId: component.id });

    expect(document.truth.components).toHaveLength(0);
    expect(document.truth.relationships).toEqual([relationship]);
    expect(document.view.componentPositions[component.id]).toBeUndefined();
  });

  it("leaves evidence references visible for validation when evidence is removed", () => {
    let document = createBlueprintDocument("system-ai");
    document = blueprintReducer(document, { type: "evidence.added", evidence });
    document = blueprintReducer(document, { type: "component.added", component, position: { x: 0, y: 0 } });
    document = blueprintReducer(document, { type: "evidence.removed", evidenceId: evidence.id });

    expect(document.truth.evidence).toHaveLength(0);
    expect(document.truth.components[0].evidenceIds).toEqual([evidence.id]);
  });
});
```

- [ ] **Step 2: Run the tests and verify the expected RED state**

Run:

```bash
npm test -- src/lib/blueprint.test.ts
```

Expected: FAIL because `src/lib/blueprint.ts` does not exist.

- [ ] **Step 3: Implement the exact typed contract**

Create `src/lib/blueprint.ts` with these exported types:

```ts
export type EntityId = string;
export type EvidenceKind = "observation" | "source" | "assumption";
export type EntityKind = "system" | "component" | "relationship" | "evidence";

export interface Point { x: number; y: number }
export interface Viewport { x: number; y: number; zoom: number }
export interface SystemTruth { id: EntityId; name: string; purpose?: string }
export interface ComponentTruth {
  id: EntityId;
  name: string;
  label: string;
  description?: string;
  evidenceIds: EntityId[];
}
export interface RelationshipTruth {
  id: EntityId;
  fromComponentId: EntityId;
  toComponentId: EntityId;
  label: string;
  evidenceIds: EntityId[];
}
export interface EvidenceTruth {
  id: EntityId;
  kind: EvidenceKind;
  statement: string;
  reference?: string;
}
export interface BlueprintTruth {
  system: SystemTruth;
  components: ComponentTruth[];
  relationships: RelationshipTruth[];
  evidence: EvidenceTruth[];
}
export interface BlueprintView {
  componentPositions: Record<EntityId, Point>;
  viewport?: Viewport;
}
export interface BlueprintDocument {
  schema: "cvh-blueprint";
  version: "1.0";
  truth: BlueprintTruth;
  view: BlueprintView;
}
```

Define actions with the same property names used by all later tasks:

```ts
export type BlueprintAction =
  | { type: "system.updated"; patch: Partial<Pick<SystemTruth, "name" | "purpose">> }
  | { type: "component.added"; component: ComponentTruth; position: Point }
  | { type: "component.updated"; componentId: EntityId; patch: Partial<Omit<ComponentTruth, "id">> }
  | { type: "component.removed"; componentId: EntityId }
  | { type: "component.moved"; componentId: EntityId; position: Point }
  | { type: "evidence.added"; evidence: EvidenceTruth }
  | { type: "evidence.updated"; evidenceId: EntityId; patch: Partial<Omit<EvidenceTruth, "id">> }
  | { type: "evidence.removed"; evidenceId: EntityId }
  | { type: "relationship.added"; relationship: RelationshipTruth }
  | { type: "relationship.updated"; relationshipId: EntityId; patch: Partial<Omit<RelationshipTruth, "id">> }
  | { type: "relationship.removed"; relationshipId: EntityId };
```

Implement:

```ts
export function createEntityId(kind: EntityKind): EntityId {
  return `${kind}-${crypto.randomUUID()}`;
}

export function createBlueprintDocument(systemId: EntityId): BlueprintDocument {
  return {
    schema: "cvh-blueprint",
    version: "1.0",
    truth: {
      system: { id: systemId, name: "", purpose: "" },
      components: [],
      relationships: [],
      evidence: [],
    },
    view: { componentPositions: {} },
  };
}

export function nextComponentPosition(index: number): Point {
  return { x: 60 + (index % 3) * 280, y: 70 + Math.floor(index / 3) * 150 };
}
```

Implement `blueprintReducer` as an exhaustive switch. Every action returns a new `BlueprintDocument`. `component.moved` must reuse the exact existing `truth` object. Removing components deletes only the component and its view position; removing evidence deletes only the evidence entity. Relationships or evidence references remain for validation until the user repairs them.

- [ ] **Step 4: Run targeted and full tests**

Run:

```bash
npm test -- src/lib/blueprint.test.ts
npm test
npm run typecheck
```

Expected: all reducer cases pass and strict TypeScript exits 0.

- [ ] **Step 5: Read-only checkpoint**

Run `git diff --check && git status --short`. Do not stage or commit.

---

### Task 3: Implement deterministic validation warnings

**Files:**

- Create: `src/lib/blueprintValidation.test.ts`
- Create: `src/lib/blueprintValidation.ts`

**Interfaces:**

- Consumes: `BlueprintTruth`, `EntityId`, `ComponentTruth`, and `RelationshipTruth` from `src/lib/blueprint.ts`.
- Produces: `WarningCode`, `ValidationWarning`, `validateBlueprint(truth)`, and `warningsForEntity(warnings, entityId)`.

- [ ] **Step 1: Write one failing test for every warning code**

Create `src/lib/blueprintValidation.test.ts`. Build one truth fixture containing these distinct entities so missing and invalid references are tested independently:

- `component-empty`, with blank `label` and `evidenceIds: []`;
- `component-invalid-evidence`, with a nonblank label and `evidenceIds: ["evidence-missing"]`;
- `relationship-empty`, with blank `label`, `evidenceIds: []`, `fromComponentId: "component-missing-source"`, and `toComponentId: "component-missing-target"`;
- `relationship-invalid-evidence`, with valid existing endpoints, a nonblank label, and `evidenceIds: ["evidence-missing"]`;
- evidence with a blank statement.

Assert the exact code set:

```ts
expect(validateBlueprint(truth).map((warning) => warning.code)).toEqual([
  "component.missing-label",
  "component.missing-evidence",
  "evidence.invalid-reference",
  "relationship.missing-label",
  "relationship.missing-evidence",
  "relationship.dangling-source",
  "relationship.dangling-target",
  "evidence.invalid-reference",
  "evidence.missing-statement",
]);
```

Add a second test with the complete AI support-workflow example from the design and assert `validateBlueprint(truth)` returns `[]`. Add a third test asserting `warningsForEntity` returns only warnings whose `entityId` matches.

- [ ] **Step 2: Run the validation test and verify RED**

Run `npm test -- src/lib/blueprintValidation.test.ts`.

Expected: FAIL because the validator module does not exist.

- [ ] **Step 3: Implement the warning contract exactly**

Create `src/lib/blueprintValidation.ts`:

```ts
import type { BlueprintTruth, EntityId } from "./blueprint";

export type WarningCode =
  | "component.missing-label"
  | "component.missing-evidence"
  | "relationship.missing-label"
  | "relationship.missing-evidence"
  | "relationship.dangling-source"
  | "relationship.dangling-target"
  | "evidence.missing-statement"
  | "evidence.invalid-reference";

export interface ValidationWarning {
  id: string;
  code: WarningCode;
  entityType: "component" | "relationship" | "evidence";
  entityId: EntityId;
  field: string;
  message: string;
}
```

`validateBlueprint(truth)` must:

1. create `componentIds` and `evidenceIds` sets;
2. visit components in array order and emit missing-label, missing-evidence, then invalid-reference warnings;
3. visit relationships in array order and emit missing-label, missing-evidence, dangling-source, dangling-target, then invalid-reference warnings;
4. visit evidence in array order and emit missing-statement warnings;
5. use IDs formatted as `${code}:${entityId}:${field}`;
6. trim strings before testing emptiness;
7. return warnings without changing `truth`.

Use these messages verbatim so UI tests remain stable:

```ts
const messages: Record<WarningCode, string> = {
  "component.missing-label": "Say what this part does.",
  "component.missing-evidence": "Add evidence for this part.",
  "relationship.missing-label": "Describe what this connection does.",
  "relationship.missing-evidence": "Add evidence for this connection.",
  "relationship.dangling-source": "Choose an existing source part.",
  "relationship.dangling-target": "Choose an existing destination part.",
  "evidence.missing-statement": "Write the evidence statement.",
  "evidence.invalid-reference": "This item points to evidence that no longer exists.",
};
```

- [ ] **Step 4: Verify the validator**

Run:

```bash
npm test -- src/lib/blueprintValidation.test.ts
npm test
npm run typecheck
```

Expected: all warning cases and the complete example pass.

- [ ] **Step 5: Read-only checkpoint**

Run `git diff --check && git status --short`. Do not stage or commit.

---

### Task 4: Implement deterministic portable JSON export

**Files:**

- Create: `src/lib/blueprintExport.test.ts`
- Create: `src/lib/blueprintExport.ts`

**Interfaces:**

- Consumes: `BlueprintDocument` from `src/lib/blueprint.ts`.
- Produces: `serializeBlueprint(document)`, `createBlueprintFilename(systemName)`, `BlueprintDownloadEnvironment`, and `downloadBlueprint(document, environment?)`.

- [ ] **Step 1: Write failing export tests**

Create `src/lib/blueprintExport.test.ts` with these cases:

```ts
import { describe, expect, it, vi } from "vitest";
import { blueprintReducer, createBlueprintDocument } from "./blueprint";
import {
  createBlueprintFilename,
  downloadBlueprint,
  serializeBlueprint,
  type BlueprintDownloadEnvironment,
} from "./blueprintExport";

describe("blueprint export", () => {
  it("serializes separate versioned truth and view sections", () => {
    const document = createBlueprintDocument("system-ai");
    const parsed = JSON.parse(serializeBlueprint(document));
    expect(parsed).toEqual(document);
    expect(Object.keys(parsed)).toEqual(["schema", "version", "truth", "view"]);
  });

  it("creates a portable deterministic filename", () => {
    expect(createBlueprintFilename(" Customer-support AI workflow ")).toBe(
      "customer-support-ai-workflow.cvh-blueprint.json",
    );
    expect(createBlueprintFilename("   ")).toBe("untitled-system.cvh-blueprint.json");
  });

  it("downloads JSON and always revokes the object URL", () => {
    const document = blueprintReducer(createBlueprintDocument("system-ai"), {
      type: "system.updated",
      patch: { name: "AI workflow" },
    });
    const environment: BlueprintDownloadEnvironment = {
      createObjectUrl: vi.fn(() => "blob:blueprint"),
      triggerDownload: vi.fn(),
      revokeObjectUrl: vi.fn(),
    };

    downloadBlueprint(document, environment);

    expect(environment.triggerDownload).toHaveBeenCalledWith(
      "blob:blueprint",
      "ai-workflow.cvh-blueprint.json",
    );
    expect(environment.revokeObjectUrl).toHaveBeenCalledWith("blob:blueprint");
  });
});
```

- [ ] **Step 2: Run the export test and verify RED**

Run `npm test -- src/lib/blueprintExport.test.ts`.

Expected: FAIL because the export module does not exist.

- [ ] **Step 3: Implement pure serialization and an injectable browser adapter**

Create `src/lib/blueprintExport.ts`:

```ts
import type { BlueprintDocument } from "./blueprint";

export interface BlueprintDownloadEnvironment {
  createObjectUrl(blob: Blob): string;
  triggerDownload(url: string, filename: string): void;
  revokeObjectUrl(url: string): void;
}

export function serializeBlueprint(document: BlueprintDocument): string {
  return `${JSON.stringify(document, null, 2)}\n`;
}

export function createBlueprintFilename(systemName: string): string {
  const slug = systemName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "untitled-system";
  return `${slug}.cvh-blueprint.json`;
}
```

Define a default browser environment that creates a Blob with `type: "application/json;charset=utf-8"`, appends a temporary anchor, clicks it, removes it, and revokes the URL in a `finally` block. `downloadBlueprint` must call `serializeBlueprint` and `createBlueprintFilename`; it must not add timestamps or validation output to the document.

- [ ] **Step 4: Verify export behavior**

Run:

```bash
npm test -- src/lib/blueprintExport.test.ts
npm test
npm run typecheck
```

Expected: deterministic serialization, filename, and adapter tests pass.

- [ ] **Step 5: Read-only checkpoint**

Run `git diff --check && git status --short`. Do not stage or commit.

---

### Task 5: Project truth and view state into an accessible SVG blueprint

**Files:**

- Create: `src/components/blueprintUi.ts`
- Create: `src/components/BlueprintCanvas.test.tsx`
- Create: `src/components/BlueprintCanvas.tsx`

**Interfaces:**

- Consumes: `BlueprintDocument`, `EntityId`, `Point`, and `ValidationWarning`.
- Produces: `BlueprintCanvasProps`, `BlueprintInspectorProps`, and `BlueprintCanvas`.

Create `src/components/blueprintUi.ts` with shared UI types:

```ts
import type { Dispatch } from "react";
import type { BlueprintAction, BlueprintDocument, EntityId, Point } from "../lib/blueprint";
import type { ValidationWarning } from "../lib/blueprintValidation";

export interface BlueprintCanvasProps {
  document: BlueprintDocument;
  warnings: ValidationWarning[];
  selectedComponentId?: EntityId;
  onSelectComponent(componentId: EntityId): void;
  onMoveComponent(componentId: EntityId, position: Point): void;
}

export interface BlueprintInspectorProps {
  document: BlueprintDocument;
  warnings: ValidationWarning[];
  selectedComponentId?: EntityId;
  focusedWarning?: ValidationWarning;
  onSelectComponent(componentId: EntityId | undefined): void;
  dispatch: Dispatch<BlueprintAction>;
}
```

- [ ] **Step 1: Write failing SVG projection tests**

Create `src/components/BlueprintCanvas.test.tsx` with four cases:

1. two components and a valid relationship render two component buttons, one connector with `data-testid="relationship-relationship-submit"`, and the label "Submit for review";
2. a dangling relationship renders `data-testid="dangling-relationship-relationship-submit"` and does not render the valid connector test ID;
3. pressing Enter on the "Support form: Capture request" SVG node calls `onSelectComponent("component-intake")`;
4. pointer down/move/up calls `onMoveComponent("component-intake", { x: 300, y: 210 })` after stubbing the SVG bounding box to `960 × 600`.

Run `npm test -- src/components/BlueprintCanvas.test.tsx` and confirm RED because the component does not exist.

- [ ] **Step 2: Implement projection geometry and accessibility**

Create `src/components/BlueprintCanvas.tsx` with:

```ts
const VIEWBOX_WIDTH = 960;
const VIEWBOX_HEIGHT = 600;
const NODE_WIDTH = 220;
const NODE_HEIGHT = 88;
```

Required behavior:

- Render `<svg viewBox="0 0 960 600" aria-label="Editable system blueprint">`.
- Resolve each component position from `document.view.componentPositions`; use `nextComponentPosition(index)` only as a fallback.
- Render valid relationships before nodes so connectors remain behind components.
- Anchor connector endpoints at node centers. Place the relationship label at the line midpoint.
- If either endpoint is missing, render a warning marker and "Unresolved connection" text but no line pretending to reach a valid component.
- Render each node as a focusable `<g role="button" tabIndex={0}>` with a rect, name, functional label, warning icon/text, and an accessible name formatted `${name || "Unnamed part"}: ${label || "Missing function"}`.
- Use `warningsForEntity` to add `.has-warning`; also render the word "Warning" so color is not the only signal.
- Enter or Space selects a focused node.
- Pointer dragging converts client coordinates into viewBox coordinates via `getBoundingClientRect()`, clamps the node to the viewBox, and calls `onMoveComponent`. Drag state remains local component state and never enters `BlueprintDocument`.
- Do not store SVG paths, node dimensions, selection, pointer IDs, or warning state in truth data.

- [ ] **Step 3: Verify the SVG projection**

Run:

```bash
npm test -- src/components/BlueprintCanvas.test.tsx
npm test
npm run typecheck
```

Expected: valid/dangling projection, keyboard selection, and drag tests pass.

- [ ] **Step 4: Read-only checkpoint**

Run `git diff --check && git status --short`. Do not stage or commit.

---

### Task 6: Build the progressive plain-English editor and warnings UI

**Files:**

- Create: `src/components/BlueprintEditor.test.tsx`
- Create: `src/components/BlueprintEditor.tsx`
- Create: `src/components/BlueprintInspector.tsx`
- Create: `src/components/ValidationSummary.tsx`

**Interfaces:**

- Consumes: all domain functions from Tasks 2–4, `BlueprintCanvas`, and `BlueprintInspectorProps`.
- Produces: `BlueprintEditor`, a complete local authoring session, and an always-visible `ValidationSummary`.

- [ ] **Step 1: Write failing tests for the simple path and progressive detail**

Create `src/components/BlueprintEditor.test.tsx` and test this exact user flow with `userEvent`:

1. render `<BlueprintEditor />`;
2. fill "System name" with "Customer-support AI workflow";
3. click "Add a part" twice;
4. select each part and fill "Part name" and "What does this part do?";
5. assert the canvas exposes both updated accessible node names;
6. assert the summary says "2 structural warnings" because both completed parts lack evidence;
7. open the `<details>` summary "Evidence and connections";
8. click "Add evidence", choose "Observation", and fill "Evidence statement";
9. check "Use evidence: All requests enter through the support form." for the selected part;
10. click "Add a connection", select source/destination, and fill "What happens between them?";
11. attach the evidence to the connection;
12. assert the connector label appears and its warning disappears;
13. remove the destination part and assert "Choose an existing destination part." appears in the warning summary while the connection remains;
14. click "Download blueprint" with an injected fake `BlueprintDownloadEnvironment` and assert export is called even while warnings exist.

Add focused tests that:

- evidence/relationship controls are inside a closed `<details>` element on first render;
- clicking a warning for a component selects that component;
- "Move left/right/up/down" buttons change view position without changing serialized truth;
- component, relationship, and evidence remove buttons require a second explicit confirmation click labeled "Confirm remove"; cancellation preserves data.

Run `npm test -- src/components/BlueprintEditor.test.tsx` and confirm RED because editor components do not exist.

- [ ] **Step 2: Implement `ValidationSummary`**

Create `src/components/ValidationSummary.tsx` with props:

```ts
interface ValidationSummaryProps {
  warnings: ValidationWarning[];
  onSelectWarning(warning: ValidationWarning): void;
}
```

Render `<section aria-label="Blueprint warnings">`. With no warnings, render "No structural warnings." With warnings, render the exact count and one button per warning using `warning.message`; include the affected entity type as mono metadata. Warning selection must call `onSelectWarning` and never mutate the document.

- [ ] **Step 3: Implement `BlueprintInspector` with progressive disclosure**

The always-visible primary controls use these exact labels and copy:

- `System name` with placeholder `e.g. Customer-support AI workflow`;
- `What does this system do? (optional)`;
- button `Add a part`;
- selected component fields `Part name`, `What does this part do?`, and `Notes (optional)`;
- position controls `Move left`, `Move right`, `Move up`, and `Move down`, each moving by 20 viewBox units through `component.moved`;
- one explicit `Remove part` → `Confirm remove` sequence.

Place all evidence and relationship controls inside:

```tsx
<details className="progressive-details">
  <summary>Evidence and connections</summary>
  {/* evidence and relationship editors */}
</details>
```

Evidence controls:

- `Add evidence` creates `{ kind: "observation", statement: "", reference: "" }` with `createEntityId("evidence")`;
- inputs `Evidence statement` and `Source or reference (optional)`;
- select `Evidence type` with Observation, Source, Assumption;
- selected component and selected relationship show checkboxes labeled `Use evidence: ${statement || "Untitled evidence"}`;
- removal uses `Remove evidence` → `Confirm remove` and intentionally leaves references for validation.

Relationship controls:

- `Add a connection` creates a relationship only when at least two components exist; otherwise render "Add at least two parts before connecting them.";
- source select `From part`, destination select `To part`, text input `What happens between them?`;
- a relationship list allows selection, reconnection, relabeling, evidence attachment, and `Remove connection` → `Confirm remove`;
- missing component IDs remain selectable as `Missing part (${id})` so dangling data can be repaired.

Display entity-specific warnings beside the corresponding component, relationship, or evidence fields with `role="status"`. Do not silently fill labels or evidence.

- [ ] **Step 4: Implement `BlueprintEditor` orchestration**

`BlueprintEditor` must:

```ts
const [document, dispatch] = useReducer(
  blueprintReducer,
  createBlueprintDocument(createEntityId("system")),
);
const [selectedComponentId, setSelectedComponentId] = useState<EntityId>();
const [focusedWarning, setFocusedWarning] = useState<ValidationWarning>();
const warnings = useMemo(() => validateBlueprint(document.truth), [document.truth]);
```

Define warning selection before composing the workbench:

```ts
const handleSelectWarning = (warning: ValidationWarning) => {
  setFocusedWarning(warning);
  if (warning.entityType === "component") {
    setSelectedComponentId(warning.entityId);
  }
};
```

Compose a two-column workbench with explicit props:

```tsx
<div className="blueprint-editor">
  <BlueprintInspector
    document={document}
    warnings={warnings}
    selectedComponentId={selectedComponentId}
    focusedWarning={focusedWarning}
    onSelectComponent={setSelectedComponentId}
    dispatch={dispatch}
  />
  <section className="blueprint-stage" aria-label="Blueprint preview">
    <BlueprintCanvas
      document={document}
      warnings={warnings}
      selectedComponentId={selectedComponentId}
      onSelectComponent={setSelectedComponentId}
      onMoveComponent={(componentId, position) =>
        dispatch({ type: "component.moved", componentId, position })
      }
    />
    <ValidationSummary warnings={warnings} onSelectWarning={handleSelectWarning} />
    <button type="button" onClick={() => downloadBlueprint(document, downloadEnvironment)}>
      Download blueprint
    </button>
  </section>
</div>
```

Accept an optional `downloadEnvironment?: BlueprintDownloadEnvironment` prop for tests. `BlueprintInspector` owns local `selectedRelationshipId` and `selectedEvidenceId` values. When `focusedWarning` changes, it opens the progressive `<details>`, selects the affected relationship or evidence when applicable, and focuses the control with ID `warning-field-${warning.id}`. Selecting a component warning selects that component. Focus and selection state remain UI-only.

- [ ] **Step 5: Verify the complete editor behavior**

Run:

```bash
npm test -- src/components/BlueprintEditor.test.tsx
npm test
npm run typecheck
```

Expected: simple entry, progressive detail, CRUD, warning repair, accessible movement, and warning-tolerant export pass.

- [ ] **Step 6: Read-only checkpoint**

Run `git diff --check && git status --short`. Do not stage or commit.

---

### Task 7: Integrate the editor into the existing light diagram-foundry page

**Files:**

- Create: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `index.html`
- Delete: `src/lib/architectBrief.ts` after reference verification

**Interfaces:**

- Consumes: `BlueprintEditor` from Task 6 and existing visual tokens/layout.
- Produces: one product page whose primary workbench is the truth-model blueprint editor.

- [ ] **Step 1: Write the failing integration test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("presents the truth-model blueprint workbench", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Map the truth before styling the picture." })).toBeVisible();
    expect(screen.getByLabelText("System name")).toBeVisible();
    expect(screen.getByRole("button", { name: "Add a part" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Download blueprint" })).toBeVisible();
  });

  it("removes the superseded prompt-generator controls", () => {
    render(<App />);
    expect(screen.queryByText("Copy Fable architect prompt")).not.toBeInTheDocument();
    expect(screen.queryByText("Choose a diagram mode")).not.toBeInTheDocument();
  });
});
```

Run `npm test -- src/App.test.tsx`.

Expected: FAIL because the current app still renders the architect brief generator.

- [ ] **Step 2: Replace only the foundry workbench, not the page identity**

Modify `src/App.tsx`:

- remove `FormEvent`, `useMemo`, prompt generator state, `pipelineOptions`, and imports from `architectBrief`;
- import `BlueprintEditor`;
- retain the existing header, hero, diagram preview, workflow section, rules section, footer, and one `src/main.tsx` entry point;
- change header links from `#foundry` to `#blueprint` and CTA copy to `Build a blueprint`;
- replace the current `<section className="foundry-section" id="foundry">` with:

```tsx
<section className="blueprint-section" id="blueprint">
  <div className="foundry-intro">
    <p className="eyebrow">Truth-model blueprint editor</p>
    <h2>Map the truth before styling the picture.</h2>
    <p>
      Name the system, add its parts, and connect what happens. Add evidence when you are ready;
      Carta Vespa Hive keeps the facts separate from the layout.
    </p>
  </div>
  <BlueprintEditor />
</section>
```

Do not add image-generation, AI, import, or cutaway-generation controls.

- [ ] **Step 3: Extend the existing CSS tokens rather than replacing them**

In `src/styles.css`:

- retain `--paper`, `--paper-bright`, `--ink`, `--muted`, `--line`, `--red`, `--blue`, and `--acid`;
- replace obsolete `.brief-*`, `.pipeline-*`, `.output-*`, and `.mode-badge` rules with focused editor classes;
- use `.blueprint-section` as a full-width paper-bright section with the same padding and ink border rhythm as existing sections;
- set `.blueprint-editor` to a two-column grid `minmax(300px, .72fr) minmax(0, 1.28fr)`;
- style `.blueprint-inspector`, `.blueprint-stage`, `.validation-summary`, `.progressive-details`, `.entity-list`, and `.editor-field` with square 1px ink/line borders and existing typography;
- style `.blueprint-canvas` on warm paper with a subtle 20px grid, no gradients beyond the existing paper grid, and `min-height: 560px`;
- use dark ink for normal nodes, blue for selection, and red plus visible `Warning` text/icon for warnings;
- preserve focus visibility with `box-shadow: 3px 3px 0 var(--blue)`;
- at `max-width: 1050px`, stack inspector above canvas;
- at `max-width: 720px`, keep the canvas horizontally scrollable with a 760px minimum SVG width, make action rows vertical, and preserve 44px minimum button targets;
- retain the existing reduced-motion media query.

No dark-luxury language, rounded glass cards, film grain, parallax, 3D background, generic hive decoration, or illustrated-cutaway generator is permitted.

- [ ] **Step 4: Update page metadata**

Change `index.html` description to:

```html
<meta
  name="description"
  content="Carta Vespa Hive turns system facts, relationships, labels, and evidence into clean editable blueprints."
/>
```

Keep the current title and warm theme color.

- [ ] **Step 5: Remove the superseded contract only after proving it is unused**

Run:

```bash
rg -n "architectBrief|buildArchitectBrief|formatFablePrompt|Pipeline" src
```

Expected: matches only inside `src/lib/architectBrief.ts`. Then delete `src/lib/architectBrief.ts`. If any other match remains, remove the stale usage first and rerun the command; do not delete a referenced file.

- [ ] **Step 6: Verify integration and responsive-safe compilation**

Run:

```bash
npm test -- src/App.test.tsx
npm test
npm run typecheck
npm run build
```

Expected: integration tests pass, all tests pass, typecheck exits 0, and Vite builds successfully.

- [ ] **Step 7: Read-only checkpoint**

Run `git diff --check && git status --short`. Do not stage or commit.

---

### Task 8: Update product truth and perform final browser verification

**Files:**

- Modify: `README.md`
- Modify: `WORKFLOW.md`
- Modify: `AGENTS.md`
- Verify: all files created or changed in Tasks 1–7

**Interfaces:**

- Consumes: verified behavior from the complete editor.
- Produces: truthful repository instructions and an evidence-backed completion report.

- [ ] **Step 1: Update documentation to match implemented reality**

In `README.md`:

- replace "architect-brief workbench" with "truth-model blueprint editor";
- update the active structure tree with `components/BlueprintEditor.tsx`, `components/BlueprintCanvas.tsx`, `lib/blueprint.ts`, `lib/blueprintValidation.ts`, and `lib/blueprintExport.ts`;
- add `npm test` to Verify;
- state plainly that CVH authors deterministic blueprints and does not generate finished artwork.

In `WORKFLOW.md` Current implementation:

```md
The website now authors a typed truth model, projects it into an editable structural blueprint, reports deterministic completeness warnings, and exports versioned JSON. It does not call a model, generate finished artwork, or perform AI inspection. Expand and Inspect remain later product slices.
```

In `AGENTS.md`:

- replace the `architectBrief.ts` source-of-truth line with the three new domain modules;
- replace the deterministic Architect brief capability statement with the verified truth-model editor capability;
- add `npm test` to local verification commands;
- preserve every repository/product-boundary rule verbatim.

- [ ] **Step 2: Run the complete automated verification suite fresh**

Run:

```bash
npm test
npm run typecheck
npm run build
git diff --check
```

Expected: zero failed tests, typecheck exit 0, Vite build exit 0, and no whitespace errors.

- [ ] **Step 3: Start a strict development preview**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

Expected: Vite reports `http://127.0.0.1:5174/`. If 5174 is occupied, choose one different explicit unused port and report it; do not stop an unrelated process.

- [ ] **Step 4: Verify the primary flow in the in-app browser**

Use `browser:control-in-app-browser` and inspect both desktop and narrow layouts. Perform this exact flow:

1. Open the preview and confirm the light paper/ink/functional-color direction is preserved.
2. Enter `Customer-support AI workflow` as System name.
3. Add parts `Support form`, `Triage model`, and `Human reviewer` with the labels from the design example.
4. Open Evidence and connections; add all three evidence statements and attach them to the matching parts.
5. Add `Support form` → `Triage model` and `Triage model` → `Human reviewer`, with labels and evidence.
6. Confirm three nodes and two labeled directional connectors render.
7. Drag `Human reviewer`; confirm only its position changes and its relationships remain intact.
8. Remove `Human reviewer` with confirmation; confirm the second relationship remains and shows the dangling-target warning in the editor, summary, and blueprint.
9. Reconnect the relationship to an existing part; confirm the dangling warning disappears.
10. Remove attached evidence with confirmation; confirm invalid-reference warnings appear without deleting the component or relationship.
11. Download the blueprint while warnings remain. Inspect the JSON and confirm top-level keys are exactly `schema`, `version`, `truth`, and `view`; confirm no selection, warning list, SVG path, or React state is present.
12. At a narrow viewport, confirm the editor stacks, the canvas scrolls horizontally, controls remain keyboard reachable, and warning meaning is not color-only.
13. Read browser console logs and confirm no errors or warnings from the app.

- [ ] **Step 5: Confirm excluded scope is absent**

Run:

```bash
rg -n -i "import blueprint|generate image|image generation|illustrated cutaway|futuristic cutaway|copy fable|imagen|openai|vertex" src
rg -n -i "import blueprint|generate image|image generation|illustrated cutaway|futuristic cutaway|copy fable|imagen|openai|vertex" README.md WORKFLOW.md AGENTS.md || true
```

Expected: the `src` command returns no matches. Documentation matches are allowed only when they explicitly state a non-goal or denial; there must be no claim that excluded behavior exists.

- [ ] **Step 6: Final read-only worktree audit**

Run:

```bash
git status --short --untracked-files=all
git diff --stat
```

Record the exact files created, modified, and deleted by this plan separately from the pre-existing dirty changes. Do not stage, commit, reset, or restore anything.

---

## Plan self-review result

- **Spec coverage:** Every goal, non-goal, warning code, export requirement, accessibility requirement, and acceptance criterion maps to at least one task below.
- **Placeholder scan:** No `TBD`, `TODO`, ellipsis props, "implement later", or undefined implementation step remains.
- **Type consistency:** `BlueprintDocument`, `BlueprintTruth`, `BlueprintView`, `BlueprintAction`, `ValidationWarning`, `BlueprintDownloadEnvironment`, action property names, and component prop names are identical across producers and consumers.
- **Scope:** JSON import, persistence, model calls, generated images, illustrated cutaways, and non-JSON export remain excluded.

## Plan coverage map

| Approved requirement | Implemented by |
|---|---|
| Plain-English system naming and parts | Task 6 |
| Progressive relationships and evidence | Task 6 |
| Typed truth separate from view | Task 2 |
| Clean editable blueprint | Tasks 5–7 |
| Missing label/evidence warnings | Task 3 |
| Dangling relationship warnings | Tasks 2, 3, 5, 6 |
| Warning repair without data loss | Tasks 2, 3, 6 |
| Portable versioned JSON export | Task 4 |
| Keyboard and non-color accessibility | Tasks 5–8 |
| Current Vite/React/light visual system | Tasks 1, 7 |
| AI workflow example | Tasks 3, 8 |
| No import, AI images, or cutaway generator | Global constraints and Task 8 |
| Typecheck/build/browser verification | Tasks 7–8 |

## Execution handoff

This plan is ready for implementation after the user chooses an execution method. Because the current worktree contains user-owned dirty changes, execution must continue without staging/committing or move to a user-approved isolated worktree first.

Two execution options:

1. **Subagent-Driven (recommended):** execute one task at a time with fresh implementer/reviewer gates.
2. **Inline Execution:** execute the tasks in this session using `superpowers:executing-plans` with checkpoints.
