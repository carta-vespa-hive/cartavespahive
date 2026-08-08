export type EntityId = string;
export type EvidenceKind = "observation" | "source" | "assumption";
export type EntityKind = "system" | "component" | "relationship" | "evidence";

export interface Point {
  x: number;
  y: number;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface SystemTruth {
  id: EntityId;
  name: string;
  purpose?: string;
}

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
  | {
      type: "relationship.updated";
      relationshipId: EntityId;
      patch: Partial<Omit<RelationshipTruth, "id">>;
    }
  | { type: "relationship.removed"; relationshipId: EntityId };

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
  return {
    x: 60 + (index % 3) * 280,
    y: 70 + Math.floor(index / 3) * 150,
  };
}

export function blueprintReducer(
  document: BlueprintDocument,
  action: BlueprintAction,
): BlueprintDocument {
  switch (action.type) {
    case "system.updated":
      return {
        ...document,
        truth: {
          ...document.truth,
          system: { ...document.truth.system, ...action.patch },
        },
      };

    case "component.added":
      return {
        ...document,
        truth: {
          ...document.truth,
          components: [...document.truth.components, action.component],
        },
        view: {
          ...document.view,
          componentPositions: {
            ...document.view.componentPositions,
            [action.component.id]: action.position,
          },
        },
      };

    case "component.updated":
      return {
        ...document,
        truth: {
          ...document.truth,
          components: document.truth.components.map((component) =>
            component.id === action.componentId
              ? { ...component, ...action.patch }
              : component,
          ),
        },
      };

    case "component.removed": {
      const componentPositions = { ...document.view.componentPositions };
      delete componentPositions[action.componentId];
      return {
        ...document,
        truth: {
          ...document.truth,
          components: document.truth.components.filter(
            (component) => component.id !== action.componentId,
          ),
        },
        view: { ...document.view, componentPositions },
      };
    }

    case "component.moved":
      return {
        ...document,
        view: {
          ...document.view,
          componentPositions: {
            ...document.view.componentPositions,
            [action.componentId]: action.position,
          },
        },
      };

    case "evidence.added":
      return {
        ...document,
        truth: {
          ...document.truth,
          evidence: [...document.truth.evidence, action.evidence],
        },
      };

    case "evidence.updated":
      return {
        ...document,
        truth: {
          ...document.truth,
          evidence: document.truth.evidence.map((evidence) =>
            evidence.id === action.evidenceId
              ? { ...evidence, ...action.patch }
              : evidence,
          ),
        },
      };

    case "evidence.removed":
      return {
        ...document,
        truth: {
          ...document.truth,
          evidence: document.truth.evidence.filter(
            (evidence) => evidence.id !== action.evidenceId,
          ),
        },
      };

    case "relationship.added":
      return {
        ...document,
        truth: {
          ...document.truth,
          relationships: [...document.truth.relationships, action.relationship],
        },
      };

    case "relationship.updated":
      return {
        ...document,
        truth: {
          ...document.truth,
          relationships: document.truth.relationships.map((relationship) =>
            relationship.id === action.relationshipId
              ? { ...relationship, ...action.patch }
              : relationship,
          ),
        },
      };

    case "relationship.removed":
      return {
        ...document,
        truth: {
          ...document.truth,
          relationships: document.truth.relationships.filter(
            (relationship) => relationship.id !== action.relationshipId,
          ),
        },
      };

    default: {
      const unreachable: never = action;
      return unreachable;
    }
  }
}
