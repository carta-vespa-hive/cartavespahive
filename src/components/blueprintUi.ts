import type { Dispatch } from "react";
import type {
  BlueprintAction,
  BlueprintDocument,
  EntityId,
  Point,
} from "../lib/blueprint";
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
