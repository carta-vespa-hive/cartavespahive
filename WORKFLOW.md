# Structure → Expand → Inspect

This is the complete CVH product method.

## 1. Structure

The Architect converts a rough subject into a spatial system. The output must define:

- an enclosing boundary
- a section plane or exploded axis
- named chambers and layers
- connectors with two attachment points
- material boundaries
- functional callouts
- unresolved structural questions

No rendering, atmosphere, lore, or decorative detail belongs in this stage.

## 2. Expand

The Visual Translator receives an approved blueprint and adds:

- material behavior
- line and color hierarchy
- visual density
- lighting and viewpoint
- legible callout placement
- a render-ready specification

Expansion may enrich the blueprint but may not silently change its spatial facts.

## 3. Inspect

The Diagram Verifier compares the result against the approved blueprint.

Reject when the result contains:

- disconnected or floating parts
- impossible intersections
- ambiguous material boundaries
- generic labels
- fake or unreadable text
- decorative components without a function

The verifier returns `pass`, `revise`, or `reject`, followed by exact corrections.

## Current implementation

The website now authors a typed truth model, projects it into an editable structural blueprint, reports deterministic completeness warnings, and exports versioned JSON. It does not call a model, generate finished artwork, or perform AI inspection. Expand and Inspect remain later product slices.
