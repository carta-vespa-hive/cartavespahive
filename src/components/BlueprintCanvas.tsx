import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { nextComponentPosition, type EntityId, type Point } from "../lib/blueprint";
import { warningsForEntity } from "../lib/blueprintValidation";
import type { BlueprintCanvasProps } from "./blueprintUi";

const VIEWBOX_WIDTH = 960;
const VIEWBOX_HEIGHT = 600;
const NODE_WIDTH = 220;
const NODE_HEIGHT = 88;

interface DragState {
  componentId: EntityId;
  pointerId: number;
  offsetX: number;
  offsetY: number;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function normalizeCoordinate(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function toViewboxPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const bounds = svg.getBoundingClientRect();
  const width = bounds.width || VIEWBOX_WIDTH;
  const height = bounds.height || VIEWBOX_HEIGHT;
  return {
    x: normalizeCoordinate(((clientX - bounds.left) / width) * VIEWBOX_WIDTH),
    y: normalizeCoordinate(((clientY - bounds.top) / height) * VIEWBOX_HEIGHT),
  };
}

export function BlueprintCanvas({
  document,
  warnings,
  selectedComponentId,
  onSelectComponent,
  onMoveComponent,
}: BlueprintCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragState, setDragState] = useState<DragState>();
  const componentById = new Map(
    document.truth.components.map((component) => [component.id, component]),
  );
  const positions = new Map(
    document.truth.components.map((component, index) => [
      component.id,
      document.view.componentPositions[component.id] ?? nextComponentPosition(index),
    ]),
  );

  const handlePointerDown = (
    event: PointerEvent<SVGGElement>,
    componentId: EntityId,
    position: Point,
  ) => {
    const svg = svgRef.current;
    if (!svg) return;
    const point = toViewboxPoint(svg, event.clientX, event.clientY);
    onSelectComponent(componentId);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragState({
      componentId,
      pointerId: event.pointerId,
      offsetX: point.x - position.x,
      offsetY: point.y - position.y,
    });
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragState || event.pointerId !== dragState.pointerId || !svgRef.current) return;
    const point = toViewboxPoint(svgRef.current, event.clientX, event.clientY);
    onMoveComponent(dragState.componentId, {
      x: clamp(point.x - dragState.offsetX, 0, VIEWBOX_WIDTH - NODE_WIDTH),
      y: clamp(point.y - dragState.offsetY, 0, VIEWBOX_HEIGHT - NODE_HEIGHT),
    });
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (dragState && event.pointerId === dragState.pointerId) setDragState(undefined);
  };

  const handleNodeKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    componentId: EntityId,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectComponent(componentId);
    }
  };

  return (
    <svg
      ref={svgRef}
      className="blueprint-canvas"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="img"
      aria-label="Editable system blueprint"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setDragState(undefined)}
    >
      <defs>
        <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" className="blueprint-grid-line" />
        </pattern>
        <marker
          id="blueprint-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="blueprint-arrow" />
        </marker>
      </defs>
      <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#blueprint-grid)" />

      <g className="blueprint-relationships" aria-label="System connections">
        {document.truth.relationships.map((relationship, index) => {
          const source = componentById.get(relationship.fromComponentId);
          const target = componentById.get(relationship.toComponentId);
          const sourcePosition = positions.get(relationship.fromComponentId);
          const targetPosition = positions.get(relationship.toComponentId);

          if (!source || !target || !sourcePosition || !targetPosition) {
            return (
              <g
                key={relationship.id}
                data-testid={`dangling-relationship-${relationship.id}`}
                className="blueprint-dangling"
                transform={`translate(34 ${40 + index * 42})`}
              >
                <circle cx="7" cy="-4" r="7" />
                <text x="22" y="0">Unresolved connection</text>
                <text className="blueprint-dangling-label" x="170" y="0">
                  {relationship.label || "Missing relationship label"}
                </text>
              </g>
            );
          }

          const x1 = sourcePosition.x + NODE_WIDTH;
          const y1 = sourcePosition.y + NODE_HEIGHT / 2;
          const x2 = targetPosition.x;
          const y2 = targetPosition.y + NODE_HEIGHT / 2;

          return (
            <g
              key={relationship.id}
              data-testid={`relationship-${relationship.id}`}
              className={
                warningsForEntity(warnings, relationship.id).length > 0
                  ? "blueprint-relationship has-warning"
                  : "blueprint-relationship"
              }
            >
              <line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd="url(#blueprint-arrow)" />
              <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 10} textAnchor="middle">
                {relationship.label || "Missing relationship label"}
              </text>
            </g>
          );
        })}
      </g>

      <g className="blueprint-components" aria-label="System parts">
        {document.truth.components.map((component, index) => {
          const position = positions.get(component.id) ?? nextComponentPosition(index);
          const componentWarnings = warningsForEntity(warnings, component.id);
          const hasWarnings = componentWarnings.length > 0;
          const accessibleName = `${component.name || "Unnamed part"}: ${component.label || "Missing function"}`;

          return (
            <g
              key={component.id}
              role="button"
              tabIndex={0}
              aria-label={accessibleName}
              aria-pressed={selectedComponentId === component.id}
              className={[
                "blueprint-node",
                selectedComponentId === component.id ? "is-selected" : "",
                hasWarnings ? "has-warning" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              transform={`translate(${position.x} ${position.y})`}
              onClick={() => onSelectComponent(component.id)}
              onKeyDown={(event) => handleNodeKeyDown(event, component.id)}
              onPointerDown={(event) => handlePointerDown(event, component.id, position)}
            >
              <rect width={NODE_WIDTH} height={NODE_HEIGHT} />
              <text className="blueprint-node-name" x="16" y="30">
                {component.name || "Unnamed part"}
              </text>
              <text className="blueprint-node-label" x="16" y="55">
                {component.label || "Missing function"}
              </text>
              {hasWarnings ? (
                <text className="blueprint-node-warning" x="16" y="76">
                  Warning · {componentWarnings.length}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
