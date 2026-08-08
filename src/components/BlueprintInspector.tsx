import { useEffect, useRef, useState } from "react";
import {
  createEntityId,
  nextComponentPosition,
  type ComponentTruth,
  type EntityId,
  type EvidenceKind,
  type RelationshipTruth,
} from "../lib/blueprint";
import { warningsForEntity, type ValidationWarning } from "../lib/blueprintValidation";
import type { BlueprintInspectorProps } from "./blueprintUi";

type RemovalTarget = "component" | "evidence" | "relationship";

function WarningMessages({ warnings }: { warnings: ValidationWarning[] }) {
  if (warnings.length === 0) return null;
  return (
    <div className="entity-warnings" role="status">
      {warnings.map((warning) => (
        <span key={warning.id}>Warning: {warning.message}</span>
      ))}
    </div>
  );
}

function RemovalControls({
  target,
  pendingTarget,
  onRequest,
  onCancel,
  onConfirm,
}: {
  target: RemovalTarget;
  pendingTarget?: RemovalTarget;
  onRequest(): void;
  onCancel(): void;
  onConfirm(): void;
}) {
  if (pendingTarget === target) {
    return (
      <div className="confirmation-row" role="group" aria-label={`Confirm ${target} removal`}>
        <button type="button" className="danger-button" onClick={onConfirm}>
          Confirm remove
        </button>
        <button type="button" className="text-button" onClick={onCancel}>
          Cancel removal
        </button>
      </div>
    );
  }
  return (
    <button type="button" className="text-button danger-text" onClick={onRequest}>
      Remove {target === "component" ? "part" : target === "relationship" ? "connection" : "evidence"}
    </button>
  );
}

function evidenceLabel(statement: string): string {
  return `Use evidence: ${statement.trim() || "Untitled evidence"}`;
}

export function BlueprintInspector({
  document,
  warnings,
  selectedComponentId,
  focusedWarning,
  onSelectComponent,
  dispatch,
}: BlueprintInspectorProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<EntityId>();
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<EntityId>();
  const [pendingRemoval, setPendingRemoval] = useState<RemovalTarget>();
  const [connectionHint, setConnectionHint] = useState("");

  const selectedComponent = document.truth.components.find(
    (component) => component.id === selectedComponentId,
  );
  const selectedEvidence = document.truth.evidence.find(
    (evidence) => evidence.id === selectedEvidenceId,
  );
  const selectedRelationship = document.truth.relationships.find(
    (relationship) => relationship.id === selectedRelationshipId,
  );

  useEffect(() => {
    if (!focusedWarning) return;
    if (focusedWarning.entityType === "relationship") {
      detailsRef.current?.setAttribute("open", "");
      setSelectedRelationshipId(focusedWarning.entityId);
    }
    if (focusedWarning.entityType === "evidence") {
      detailsRef.current?.setAttribute("open", "");
      setSelectedEvidenceId(focusedWarning.entityId);
    }
    const frame = requestAnimationFrame(() => {
      globalThis.document
        .getElementById(`warning-field-${focusedWarning.id}`)
        ?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [focusedWarning]);

  useEffect(() => {
    if (selectedComponentId && !selectedComponent) onSelectComponent(undefined);
  }, [onSelectComponent, selectedComponent, selectedComponentId]);

  const addComponent = () => {
    const id = createEntityId("component");
    const component: ComponentTruth = {
      id,
      name: "",
      label: "",
      description: "",
      evidenceIds: [],
    };
    dispatch({
      type: "component.added",
      component,
      position: nextComponentPosition(document.truth.components.length),
    });
    onSelectComponent(id);
    setPendingRemoval(undefined);
  };

  const moveComponent = (deltaX: number, deltaY: number) => {
    if (!selectedComponent) return;
    const position = document.view.componentPositions[selectedComponent.id] ??
      nextComponentPosition(document.truth.components.indexOf(selectedComponent));
    dispatch({
      type: "component.moved",
      componentId: selectedComponent.id,
      position: { x: position.x + deltaX, y: position.y + deltaY },
    });
  };

  const addEvidence = () => {
    const id = createEntityId("evidence");
    dispatch({
      type: "evidence.added",
      evidence: { id, kind: "observation", statement: "", reference: "" },
    });
    setSelectedEvidenceId(id);
    setPendingRemoval(undefined);
  };

  const addRelationship = () => {
    if (document.truth.components.length < 2) {
      setConnectionHint("Add at least two parts before connecting them.");
      return;
    }
    const id = createEntityId("relationship");
    const relationship: RelationshipTruth = {
      id,
      fromComponentId: document.truth.components[0].id,
      toComponentId: document.truth.components[1].id,
      label: "",
      evidenceIds: [],
    };
    dispatch({ type: "relationship.added", relationship });
    setSelectedRelationshipId(id);
    setConnectionHint("");
    setPendingRemoval(undefined);
  };

  const toggleEvidenceReference = (
    entity: ComponentTruth | RelationshipTruth,
    evidenceId: EntityId,
    checked: boolean,
  ) => {
    const evidenceIds = checked
      ? [...entity.evidenceIds, evidenceId]
      : entity.evidenceIds.filter((id) => id !== evidenceId);
    if ("fromComponentId" in entity) {
      dispatch({
        type: "relationship.updated",
        relationshipId: entity.id,
        patch: { evidenceIds },
      });
    } else {
      dispatch({ type: "component.updated", componentId: entity.id, patch: { evidenceIds } });
    }
  };

  const endpointOptions = (relationship: RelationshipTruth, endpointId: EntityId) => {
    const isMissing = !document.truth.components.some((component) => component.id === endpointId);
    return (
      <>
        {isMissing ? <option value={endpointId}>Missing part ({endpointId})</option> : null}
        {document.truth.components.map((component) => (
          <option key={component.id} value={component.id}>
            {component.name || "Unnamed part"}
          </option>
        ))}
      </>
    );
  };

  return (
    <aside className="blueprint-inspector" aria-label="Blueprint editor controls">
      <section className="inspector-section primary-authoring">
        <p className="section-kicker">Start with what you know</p>
        <label>
          <span>System name</span>
          <input
            value={document.truth.system.name}
            placeholder="e.g. Customer-support AI workflow"
            onChange={(event) =>
              dispatch({ type: "system.updated", patch: { name: event.target.value } })
            }
          />
        </label>
        <label>
          <span>What does this system do? (optional)</span>
          <textarea
            value={document.truth.system.purpose ?? ""}
            onChange={(event) =>
              dispatch({ type: "system.updated", patch: { purpose: event.target.value } })
            }
          />
        </label>
        <button type="button" className="primary-button" onClick={addComponent}>
          Add a part
        </button>
      </section>

      {document.truth.components.length > 0 ? (
        <section className="inspector-section component-list" aria-label="System parts">
          <h3>Parts</h3>
          <div className="chip-list">
            {document.truth.components.map((component, index) => (
              <button
                key={component.id}
                type="button"
                className={component.id === selectedComponentId ? "chip is-selected" : "chip"}
                onClick={() => onSelectComponent(component.id)}
              >
                {component.name || `Part ${index + 1}`}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {selectedComponent ? (
        <section className="inspector-section selected-entity" aria-label="Selected part">
          <h3>Selected part</h3>
          <label>
            <span>Part name</span>
            <input
              value={selectedComponent.name}
              onChange={(event) =>
                dispatch({
                  type: "component.updated",
                  componentId: selectedComponent.id,
                  patch: { name: event.target.value },
                })
              }
            />
          </label>
          <label>
            <span>What does this part do?</span>
            <input
              id={
                warningsForEntity(warnings, selectedComponent.id).find(
                  (warning) => warning.field === "label",
                )
                  ? `warning-field-${warningsForEntity(warnings, selectedComponent.id).find((warning) => warning.field === "label")!.id}`
                  : undefined
              }
              value={selectedComponent.label}
              onChange={(event) =>
                dispatch({
                  type: "component.updated",
                  componentId: selectedComponent.id,
                  patch: { label: event.target.value },
                })
              }
            />
          </label>
          <label>
            <span>Notes (optional)</span>
            <textarea
              value={selectedComponent.description ?? ""}
              onChange={(event) =>
                dispatch({
                  type: "component.updated",
                  componentId: selectedComponent.id,
                  patch: { description: event.target.value },
                })
              }
            />
          </label>
          <div className="position-controls" role="group" aria-label="Part position">
            <button type="button" onClick={() => moveComponent(-20, 0)}>Move left</button>
            <button type="button" onClick={() => moveComponent(20, 0)}>Move right</button>
            <button type="button" onClick={() => moveComponent(0, -20)}>Move up</button>
            <button type="button" onClick={() => moveComponent(0, 20)}>Move down</button>
          </div>
          <WarningMessages warnings={warningsForEntity(warnings, selectedComponent.id)} />
          <RemovalControls
            target="component"
            pendingTarget={pendingRemoval}
            onRequest={() => setPendingRemoval("component")}
            onCancel={() => setPendingRemoval(undefined)}
            onConfirm={() => {
              dispatch({ type: "component.removed", componentId: selectedComponent.id });
              onSelectComponent(undefined);
              setPendingRemoval(undefined);
            }}
          />
        </section>
      ) : null}

      <details ref={detailsRef} className="progressive-details">
        <summary>Evidence and connections</summary>
        <div className="progressive-content">
          <section className="inspector-section" aria-label="Evidence">
            <div className="section-title-row">
              <h3>Evidence</h3>
              <button type="button" onClick={addEvidence}>Add evidence</button>
            </div>
            <div className="chip-list">
              {document.truth.evidence.map((evidence, index) => (
                <button
                  key={evidence.id}
                  type="button"
                  className={evidence.id === selectedEvidenceId ? "chip is-selected" : "chip"}
                  onClick={() => setSelectedEvidenceId(evidence.id)}
                >
                  {evidence.statement || `Evidence ${index + 1}`}
                </button>
              ))}
            </div>
            {selectedEvidence ? (
              <fieldset className="entity-fieldset">
                <legend>Selected evidence</legend>
                <label>
                  <span>Evidence type</span>
                  <select
                    value={selectedEvidence.kind}
                    onChange={(event) =>
                      dispatch({
                        type: "evidence.updated",
                        evidenceId: selectedEvidence.id,
                        patch: { kind: event.target.value as EvidenceKind },
                      })
                    }
                  >
                    <option value="observation">Observation</option>
                    <option value="source">Source</option>
                    <option value="assumption">Assumption</option>
                  </select>
                </label>
                <label>
                  <span>Evidence statement</span>
                  <textarea
                    id={
                      warningsForEntity(warnings, selectedEvidence.id)[0]
                        ? `warning-field-${warningsForEntity(warnings, selectedEvidence.id)[0].id}`
                        : undefined
                    }
                    value={selectedEvidence.statement}
                    onChange={(event) =>
                      dispatch({
                        type: "evidence.updated",
                        evidenceId: selectedEvidence.id,
                        patch: { statement: event.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  <span>Source or reference (optional)</span>
                  <input
                    value={selectedEvidence.reference ?? ""}
                    onChange={(event) =>
                      dispatch({
                        type: "evidence.updated",
                        evidenceId: selectedEvidence.id,
                        patch: { reference: event.target.value },
                      })
                    }
                  />
                </label>
                <WarningMessages warnings={warningsForEntity(warnings, selectedEvidence.id)} />
                <RemovalControls
                  target="evidence"
                  pendingTarget={pendingRemoval}
                  onRequest={() => setPendingRemoval("evidence")}
                  onCancel={() => setPendingRemoval(undefined)}
                  onConfirm={() => {
                    dispatch({ type: "evidence.removed", evidenceId: selectedEvidence.id });
                    setSelectedEvidenceId(undefined);
                    setPendingRemoval(undefined);
                  }}
                />
              </fieldset>
            ) : null}
            {selectedComponent && document.truth.evidence.length > 0 ? (
              <fieldset className="evidence-links">
                <legend>Evidence for selected part</legend>
                {document.truth.evidence.map((evidence) => (
                  <label key={evidence.id}>
                    <input
                      type="checkbox"
                      checked={selectedComponent.evidenceIds.includes(evidence.id)}
                      onChange={(event) =>
                        toggleEvidenceReference(selectedComponent, evidence.id, event.target.checked)
                      }
                    />
                    <span>{evidenceLabel(evidence.statement)}</span>
                  </label>
                ))}
              </fieldset>
            ) : null}
          </section>

          <section className="inspector-section" aria-label="Connections">
            <div className="section-title-row">
              <h3>Connections</h3>
              <button type="button" onClick={addRelationship}>Add a connection</button>
            </div>
            {connectionHint ? <p role="status">{connectionHint}</p> : null}
            <div className="chip-list">
              {document.truth.relationships.map((relationship, index) => (
                <button
                  key={relationship.id}
                  type="button"
                  className={relationship.id === selectedRelationshipId ? "chip is-selected" : "chip"}
                  onClick={() => setSelectedRelationshipId(relationship.id)}
                >
                  {relationship.label || `Connection ${index + 1}`}
                </button>
              ))}
            </div>
            {selectedRelationship ? (
              <fieldset className="entity-fieldset" aria-label="Selected connection">
                <legend>Selected connection</legend>
                <label>
                  <span>From part</span>
                  <select
                    id={
                      warningsForEntity(warnings, selectedRelationship.id).find((warning) => warning.field === "fromComponentId")
                        ? `warning-field-${warningsForEntity(warnings, selectedRelationship.id).find((warning) => warning.field === "fromComponentId")!.id}`
                        : undefined
                    }
                    value={selectedRelationship.fromComponentId}
                    onChange={(event) =>
                      dispatch({
                        type: "relationship.updated",
                        relationshipId: selectedRelationship.id,
                        patch: { fromComponentId: event.target.value },
                      })
                    }
                  >
                    {endpointOptions(selectedRelationship, selectedRelationship.fromComponentId)}
                  </select>
                </label>
                <label>
                  <span>To part</span>
                  <select
                    id={
                      warningsForEntity(warnings, selectedRelationship.id).find((warning) => warning.field === "toComponentId")
                        ? `warning-field-${warningsForEntity(warnings, selectedRelationship.id).find((warning) => warning.field === "toComponentId")!.id}`
                        : undefined
                    }
                    value={selectedRelationship.toComponentId}
                    onChange={(event) =>
                      dispatch({
                        type: "relationship.updated",
                        relationshipId: selectedRelationship.id,
                        patch: { toComponentId: event.target.value },
                      })
                    }
                  >
                    {endpointOptions(selectedRelationship, selectedRelationship.toComponentId)}
                  </select>
                </label>
                <label>
                  <span>What happens between them?</span>
                  <input
                    id={
                      warningsForEntity(warnings, selectedRelationship.id).find((warning) => warning.field === "label")
                        ? `warning-field-${warningsForEntity(warnings, selectedRelationship.id).find((warning) => warning.field === "label")!.id}`
                        : undefined
                    }
                    value={selectedRelationship.label}
                    onChange={(event) =>
                      dispatch({
                        type: "relationship.updated",
                        relationshipId: selectedRelationship.id,
                        patch: { label: event.target.value },
                      })
                    }
                  />
                </label>
                {document.truth.evidence.length > 0 ? (
                  <fieldset className="evidence-links">
                    <legend>Evidence for selected connection</legend>
                    {document.truth.evidence.map((evidence) => (
                      <label key={evidence.id}>
                        <input
                          type="checkbox"
                          checked={selectedRelationship.evidenceIds.includes(evidence.id)}
                          onChange={(event) =>
                            toggleEvidenceReference(
                              selectedRelationship,
                              evidence.id,
                              event.target.checked,
                            )
                          }
                        />
                        <span>{evidenceLabel(evidence.statement)}</span>
                      </label>
                    ))}
                  </fieldset>
                ) : null}
                <WarningMessages warnings={warningsForEntity(warnings, selectedRelationship.id)} />
                <RemovalControls
                  target="relationship"
                  pendingTarget={pendingRemoval}
                  onRequest={() => setPendingRemoval("relationship")}
                  onCancel={() => setPendingRemoval(undefined)}
                  onConfirm={() => {
                    dispatch({
                      type: "relationship.removed",
                      relationshipId: selectedRelationship.id,
                    });
                    setSelectedRelationshipId(undefined);
                    setPendingRemoval(undefined);
                  }}
                />
              </fieldset>
            ) : null}
          </section>
        </div>
      </details>
    </aside>
  );
}
