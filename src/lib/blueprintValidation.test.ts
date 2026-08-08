import { describe, expect, it } from "vitest";
import type { BlueprintTruth } from "./blueprint";
import { validateBlueprint, warningsForEntity } from "./blueprintValidation";

const invalidTruth: BlueprintTruth = {
  system: { id: "system-ai", name: "AI workflow", purpose: "" },
  components: [
    {
      id: "component-empty",
      name: "Empty part",
      label: "  ",
      description: "",
      evidenceIds: [],
    },
    {
      id: "component-invalid-evidence",
      name: "Referenced part",
      label: "Route work",
      description: "",
      evidenceIds: ["evidence-missing"],
    },
  ],
  relationships: [
    {
      id: "relationship-empty",
      fromComponentId: "component-missing-source",
      toComponentId: "component-missing-target",
      label: " ",
      evidenceIds: [],
    },
    {
      id: "relationship-invalid-evidence",
      fromComponentId: "component-empty",
      toComponentId: "component-invalid-evidence",
      label: "Pass work",
      evidenceIds: ["evidence-missing"],
    },
  ],
  evidence: [
    {
      id: "evidence-blank",
      kind: "observation",
      statement: " ",
      reference: "",
    },
  ],
};

const completeTruth: BlueprintTruth = {
  system: { id: "system-ai", name: "Customer-support AI workflow", purpose: "Route support" },
  evidence: [
    {
      id: "ev-intake",
      kind: "observation",
      statement: "All requests enter through the support form.",
      reference: "",
    },
    {
      id: "ev-triage",
      kind: "source",
      statement: "The triage model classifies each request.",
      reference: "Triage policy v2, section 3.",
    },
    {
      id: "ev-review",
      kind: "source",
      statement: "Sensitive replies require human approval.",
      reference: "Review policy v1.",
    },
  ],
  components: [
    {
      id: "intake",
      name: "Support form",
      label: "Capture request",
      description: "",
      evidenceIds: ["ev-intake"],
    },
    {
      id: "triage",
      name: "Triage model",
      label: "Classify request",
      description: "",
      evidenceIds: ["ev-triage"],
    },
    {
      id: "review",
      name: "Human reviewer",
      label: "Approve sensitive reply",
      description: "",
      evidenceIds: ["ev-review"],
    },
  ],
  relationships: [
    {
      id: "submit",
      fromComponentId: "intake",
      toComponentId: "triage",
      label: "Submit for classification",
      evidenceIds: ["ev-intake"],
    },
    {
      id: "escalate",
      fromComponentId: "triage",
      toComponentId: "review",
      label: "Escalate low confidence",
      evidenceIds: ["ev-review"],
    },
  ],
};

describe("validateBlueprint", () => {
  it("returns every required warning in deterministic entity order", () => {
    const warnings = validateBlueprint(invalidTruth);

    expect(warnings.map((warning) => warning.code)).toEqual([
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
    expect(warnings[0]).toEqual({
      id: "component.missing-label:component-empty:label",
      code: "component.missing-label",
      entityType: "component",
      entityId: "component-empty",
      field: "label",
      message: "Say what this part does.",
    });
  });

  it("returns no warnings for a complete supported workflow", () => {
    expect(validateBlueprint(completeTruth)).toEqual([]);
  });

  it("filters warnings to one affected entity", () => {
    const warnings = validateBlueprint(invalidTruth);
    expect(warningsForEntity(warnings, "relationship-empty").map((warning) => warning.code)).toEqual([
      "relationship.missing-label",
      "relationship.missing-evidence",
      "relationship.dangling-source",
      "relationship.dangling-target",
    ]);
  });
});
