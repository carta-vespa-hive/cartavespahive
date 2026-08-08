import type { ValidationWarning } from "../lib/blueprintValidation";

interface ValidationSummaryProps {
  warnings: ValidationWarning[];
  onSelectWarning(warning: ValidationWarning): void;
}

export function ValidationSummary({ warnings, onSelectWarning }: ValidationSummaryProps) {
  return (
    <section className="validation-summary" aria-label="Blueprint warnings">
      <div className="validation-heading">
        <h3>Structure check</h3>
        <span className="warning-count">
          {warnings.length === 0
            ? "No structural warnings."
            : `${warnings.length} structural warning${warnings.length === 1 ? "" : "s"}`}
        </span>
      </div>
      {warnings.length > 0 ? (
        <ul className="warning-list">
          {warnings.map((warning) => (
            <li key={warning.id}>
              <button type="button" onClick={() => onSelectWarning(warning)}>
                <span>{warning.message}</span>
                <span className="warning-meta">{warning.entityType}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
