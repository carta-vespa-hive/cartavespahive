import { describe, expect, it } from "vitest";
import {
  blueprintReducer,
  createBlueprintDocument,
  nextComponentPosition,
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
    document = blueprintReducer(document, {
      type: "component.added",
      component,
      position: { x: 0, y: 0 },
    });
    document = blueprintReducer(document, { type: "relationship.added", relationship });
    document = blueprintReducer(document, {
      type: "component.updated",
      componentId: component.id,
      patch: { name: "Request intake" },
    });

    expect(document.truth.components[0].id).toBe(component.id);
    expect(document.truth.relationships[0].fromComponentId).toBe(component.id);
  });

  it("leaves relationships dangling when their component is removed", () => {
    let document = createBlueprintDocument("system-ai");
    document = blueprintReducer(document, {
      type: "component.added",
      component,
      position: { x: 0, y: 0 },
    });
    document = blueprintReducer(document, { type: "relationship.added", relationship });
    document = blueprintReducer(document, {
      type: "component.removed",
      componentId: component.id,
    });

    expect(document.truth.components).toHaveLength(0);
    expect(document.truth.relationships).toEqual([relationship]);
    expect(document.view.componentPositions[component.id]).toBeUndefined();
  });

  it("leaves evidence references visible for validation when evidence is removed", () => {
    let document = createBlueprintDocument("system-ai");
    document = blueprintReducer(document, { type: "evidence.added", evidence });
    document = blueprintReducer(document, {
      type: "component.added",
      component,
      position: { x: 0, y: 0 },
    });
    document = blueprintReducer(document, {
      type: "evidence.removed",
      evidenceId: evidence.id,
    });

    expect(document.truth.evidence).toHaveLength(0);
    expect(document.truth.components[0].evidenceIds).toEqual([evidence.id]);
  });

  it("updates and removes editable truth entities immutably", () => {
    let document = createBlueprintDocument("system-ai");
    document = blueprintReducer(document, {
      type: "system.updated",
      patch: { name: "AI workflow", purpose: "Route support work" },
    });
    document = blueprintReducer(document, { type: "evidence.added", evidence });
    document = blueprintReducer(document, { type: "relationship.added", relationship });
    document = blueprintReducer(document, {
      type: "evidence.updated",
      evidenceId: evidence.id,
      patch: { kind: "source", reference: "Policy v2" },
    });
    document = blueprintReducer(document, {
      type: "relationship.updated",
      relationshipId: relationship.id,
      patch: { label: "Route for review" },
    });

    expect(document.truth.system).toEqual({
      id: "system-ai",
      name: "AI workflow",
      purpose: "Route support work",
    });
    expect(document.truth.evidence[0]).toMatchObject({ kind: "source", reference: "Policy v2" });
    expect(document.truth.relationships[0].label).toBe("Route for review");

    document = blueprintReducer(document, {
      type: "relationship.removed",
      relationshipId: relationship.id,
    });
    expect(document.truth.relationships).toHaveLength(0);
  });
});

describe("nextComponentPosition", () => {
  it("lays out components in deterministic rows of three", () => {
    expect(nextComponentPosition(0)).toEqual({ x: 60, y: 70 });
    expect(nextComponentPosition(3)).toEqual({ x: 60, y: 220 });
  });
});
