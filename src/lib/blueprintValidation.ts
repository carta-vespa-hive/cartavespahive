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

function createWarning(
  code: WarningCode,
  entityType: ValidationWarning["entityType"],
  entityId: EntityId,
  field: string,
): ValidationWarning {
  return {
    id: `${code}:${entityId}:${field}`,
    code,
    entityType,
    entityId,
    field,
    message: messages[code],
  };
}

export function validateBlueprint(truth: BlueprintTruth): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  const componentIds = new Set(truth.components.map((component) => component.id));
  const evidenceIds = new Set(truth.evidence.map((evidence) => evidence.id));

  for (const component of truth.components) {
    if (!component.label.trim()) {
      warnings.push(
        createWarning("component.missing-label", "component", component.id, "label"),
      );
    }
    if (component.evidenceIds.length === 0) {
      warnings.push(
        createWarning(
          "component.missing-evidence",
          "component",
          component.id,
          "evidenceIds",
        ),
      );
    }
    if (component.evidenceIds.some((evidenceId) => !evidenceIds.has(evidenceId))) {
      warnings.push(
        createWarning(
          "evidence.invalid-reference",
          "component",
          component.id,
          "evidenceIds",
        ),
      );
    }
  }

  for (const relationship of truth.relationships) {
    if (!relationship.label.trim()) {
      warnings.push(
        createWarning(
          "relationship.missing-label",
          "relationship",
          relationship.id,
          "label",
        ),
      );
    }
    if (relationship.evidenceIds.length === 0) {
      warnings.push(
        createWarning(
          "relationship.missing-evidence",
          "relationship",
          relationship.id,
          "evidenceIds",
        ),
      );
    }
    if (!componentIds.has(relationship.fromComponentId)) {
      warnings.push(
        createWarning(
          "relationship.dangling-source",
          "relationship",
          relationship.id,
          "fromComponentId",
        ),
      );
    }
    if (!componentIds.has(relationship.toComponentId)) {
      warnings.push(
        createWarning(
          "relationship.dangling-target",
          "relationship",
          relationship.id,
          "toComponentId",
        ),
      );
    }
    if (relationship.evidenceIds.some((evidenceId) => !evidenceIds.has(evidenceId))) {
      warnings.push(
        createWarning(
          "evidence.invalid-reference",
          "relationship",
          relationship.id,
          "evidenceIds",
        ),
      );
    }
  }

  for (const evidence of truth.evidence) {
    if (!evidence.statement.trim()) {
      warnings.push(
        createWarning(
          "evidence.missing-statement",
          "evidence",
          evidence.id,
          "statement",
        ),
      );
    }
  }

  return warnings;
}

export function warningsForEntity(
  warnings: ValidationWarning[],
  entityId: EntityId,
): ValidationWarning[] {
  return warnings.filter((warning) => warning.entityId === entityId);
}
