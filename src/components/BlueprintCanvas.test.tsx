import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BlueprintDocument } from "../lib/blueprint";
import { validateBlueprint } from "../lib/blueprintValidation";
import { BlueprintCanvas } from "./BlueprintCanvas";

function createCanvasDocument(targetId = "component-review"): BlueprintDocument {
  return {
    schema: "cvh-blueprint",
    version: "1.0",
    truth: {
      system: { id: "system-ai", name: "AI workflow", purpose: "" },
      evidence: [
        {
          id: "evidence-intake",
          kind: "observation",
          statement: "Requests enter through the form.",
          reference: "",
        },
      ],
      components: [
        {
          id: "component-intake",
          name: "Support form",
          label: "Capture request",
          description: "",
          evidenceIds: ["evidence-intake"],
        },
        {
          id: "component-review",
          name: "Human reviewer",
          label: "Approve response",
          description: "",
          evidenceIds: ["evidence-intake"],
        },
      ],
      relationships: [
        {
          id: "relationship-submit",
          fromComponentId: "component-intake",
          toComponentId: targetId,
          label: "Submit for review",
          evidenceIds: ["evidence-intake"],
        },
      ],
    },
    view: {
      componentPositions: {
        "component-intake": { x: 80, y: 120 },
        "component-review": { x: 500, y: 120 },
      },
    },
  };
}

describe("BlueprintCanvas", () => {
  it("renders valid components and their labeled directional connector", () => {
    const document = createCanvasDocument();
    render(
      <BlueprintCanvas
        document={document}
        warnings={validateBlueprint(document.truth)}
        onSelectComponent={() => undefined}
        onMoveComponent={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: "Support form: Capture request" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Human reviewer: Approve response" })).toBeVisible();
    expect(screen.getByTestId("relationship-relationship-submit")).toBeInTheDocument();
    expect(screen.getByText("Submit for review")).toBeVisible();
  });

  it("renders a warning marker instead of a false connector for a dangling relationship", () => {
    const document = createCanvasDocument("component-missing");
    render(
      <BlueprintCanvas
        document={document}
        warnings={validateBlueprint(document.truth)}
        onSelectComponent={() => undefined}
        onMoveComponent={() => undefined}
      />,
    );

    expect(screen.getByTestId("dangling-relationship-relationship-submit")).toBeInTheDocument();
    expect(screen.queryByTestId("relationship-relationship-submit")).not.toBeInTheDocument();
    expect(screen.getByText("Unresolved connection")).toBeVisible();
  });

  it("selects a focused component with the keyboard", () => {
    const document = createCanvasDocument();
    const onSelectComponent = vi.fn();
    render(
      <BlueprintCanvas
        document={document}
        warnings={[]}
        onSelectComponent={onSelectComponent}
        onMoveComponent={() => undefined}
      />,
    );

    fireEvent.keyDown(
      screen.getByRole("button", { name: "Support form: Capture request" }),
      { key: "Enter" },
    );

    expect(onSelectComponent).toHaveBeenCalledWith("component-intake");
  });

  it("converts pointer dragging into viewbox coordinates", () => {
    const document = createCanvasDocument();
    const onMoveComponent = vi.fn();
    render(
      <BlueprintCanvas
        document={document}
        warnings={[]}
        onSelectComponent={() => undefined}
        onMoveComponent={onMoveComponent}
      />,
    );
    const canvas = screen.getByLabelText("Editable system blueprint");
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 960,
      bottom: 600,
      width: 960,
      height: 600,
      toJSON: () => ({}),
    });
    const node = screen.getByRole("button", { name: "Support form: Capture request" });

    fireEvent.pointerDown(node, { pointerId: 1, clientX: 100, clientY: 140 });
    fireEvent.pointerMove(canvas, { pointerId: 1, clientX: 320, clientY: 230 });
    fireEvent.pointerUp(canvas, { pointerId: 1 });

    expect(onMoveComponent).toHaveBeenLastCalledWith("component-intake", { x: 300, y: 210 });
  });
});
