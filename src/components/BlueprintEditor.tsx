import { useMemo, useReducer, useState } from "react";
import { blueprintReducer, createBlueprintDocument, createEntityId, type EntityId } from "../lib/blueprint";
import { downloadBlueprint, type BlueprintDownloadEnvironment } from "../lib/blueprintExport";
import { validateBlueprint, type ValidationWarning } from "../lib/blueprintValidation";
import { BlueprintCanvas } from "./BlueprintCanvas";
import { BlueprintInspector } from "./BlueprintInspector";
import { ValidationSummary } from "./ValidationSummary";

interface BlueprintEditorProps {
  downloadEnvironment?: BlueprintDownloadEnvironment;
}

export function BlueprintEditor({ downloadEnvironment }: BlueprintEditorProps) {
  const [document, dispatch] = useReducer(
    blueprintReducer,
    undefined,
    () => createBlueprintDocument(createEntityId("system")),
  );
  const [selectedComponentId, setSelectedComponentId] = useState<EntityId>();
  const [focusedWarning, setFocusedWarning] = useState<ValidationWarning>();
  const warnings = useMemo(() => validateBlueprint(document.truth), [document.truth]);

  const handleSelectWarning = (warning: ValidationWarning) => {
    setFocusedWarning(warning);
    if (warning.entityType === "component") {
      setSelectedComponentId(warning.entityId);
    }
  };

  return (
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
        <div className="blueprint-stage-heading">
          <div>
            <p className="section-kicker">Editable blueprint</p>
            <h2>{document.truth.system.name || "Untitled system"}</h2>
          </div>
          <button
            type="button"
            className="export-button"
            onClick={() => downloadBlueprint(document, downloadEnvironment)}
          >
            Download blueprint
          </button>
        </div>
        <div className="blueprint-scroll-frame">
          <BlueprintCanvas
            document={document}
            warnings={warnings}
            selectedComponentId={selectedComponentId}
            onSelectComponent={setSelectedComponentId}
            onMoveComponent={(componentId, position) =>
              dispatch({ type: "component.moved", componentId, position })
            }
          />
        </div>
        <ValidationSummary warnings={warnings} onSelectWarning={handleSelectWarning} />
      </section>
    </div>
  );
}
