import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { BlueprintDownloadEnvironment } from "../lib/blueprintExport";
import { BlueprintEditor } from "./BlueprintEditor";

function createDownloadEnvironment() {
  const blobs: Blob[] = [];
  const environment: BlueprintDownloadEnvironment = {
    createObjectUrl: vi.fn((blob: Blob) => {
      blobs.push(blob);
      return `blob:blueprint-${blobs.length}`;
    }),
    triggerDownload: vi.fn(),
    revokeObjectUrl: vi.fn(),
  };
  return { environment, blobs };
}

async function addNamedPart(
  user: ReturnType<typeof userEvent.setup>,
  name: string,
  label: string,
) {
  await user.click(screen.getByRole("button", { name: "Add a part" }));
  await user.type(screen.getByRole("textbox", { name: "Part name" }), name);
  if (label) {
    await user.type(
      screen.getByRole("textbox", { name: "What does this part do?" }),
      label,
    );
  }
}

describe("BlueprintEditor", () => {
  it("authors, validates, connects, leaves dangling truth, and exports with warnings", async () => {
    const user = userEvent.setup();
    const { environment } = createDownloadEnvironment();
    render(<BlueprintEditor downloadEnvironment={environment} />);

    await user.type(
      screen.getByRole("textbox", { name: "System name" }),
      "Customer-support AI workflow",
    );
    await addNamedPart(user, "Support form", "Capture request");
    await addNamedPart(user, "Triage model", "Route request");

    expect(
      screen.getByRole("button", { name: "Support form: Capture request" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Triage model: Route request" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2 structural warnings")).toBeInTheDocument();

    await user.click(screen.getByText("Evidence and connections"));
    await user.click(screen.getByRole("button", { name: "Add evidence" }));
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Evidence type" }),
      "observation",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Evidence statement" }),
      "All requests enter through the support form.",
    );
    await user.click(
      screen.getByRole("checkbox", {
        name: "Use evidence: All requests enter through the support form.",
      }),
    );

    await user.click(screen.getByRole("button", { name: "Add a connection" }));
    const fromPart = screen.getByRole("combobox", { name: "From part" });
    const toPart = screen.getByRole("combobox", { name: "To part" });
    await user.selectOptions(
      fromPart,
      within(fromPart).getByRole("option", { name: "Support form" }),
    );
    await user.selectOptions(
      toPart,
      within(toPart).getByRole("option", { name: "Triage model" }),
    );
    await user.type(
      screen.getByRole("textbox", { name: "What happens between them?" }),
      "Submit for review",
    );
    const connectionEditor = screen.getByRole("group", { name: "Selected connection" });
    await user.click(
      within(connectionEditor).getByRole("checkbox", {
        name: "Use evidence: All requests enter through the support form.",
      }),
    );
    expect(
      within(screen.getByRole("img", { name: "Editable system blueprint" })).getByText(
        "Submit for review",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Add evidence for this connection."),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove part" }));
    await user.click(screen.getByRole("button", { name: "Confirm remove" }));
    expect(screen.getByText("Choose an existing destination part.")).toBeInTheDocument();
    expect(screen.getByText("Unresolved connection")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Download blueprint" }));
    expect(environment.triggerDownload).toHaveBeenCalledWith(
      "blob:blueprint-1",
      "customer-support-ai-workflow.cvh-blueprint.json",
    );
  });

  it("keeps evidence and connection controls closed until requested", () => {
    render(<BlueprintEditor />);

    const details = screen.getByText("Evidence and connections").closest("details");
    expect(details).not.toHaveAttribute("open");
    expect(screen.getByRole("button", { name: "Add evidence" })).not.toBeVisible();
  });

  it("selects the affected component and focuses its field when a warning is activated", async () => {
    const user = userEvent.setup();
    render(<BlueprintEditor />);
    await addNamedPart(user, "Intake", "Capture request");
    await addNamedPart(user, "Router", "");

    const warningButtons = screen.getAllByRole("button", {
      name: /^Add evidence for this part\./,
    });
    await user.click(warningButtons[0]);

    expect(screen.getByRole("textbox", { name: "Part name" })).toHaveValue("Intake");

    await user.click(
      screen.getByRole("button", { name: /^Say what this part does\./ }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("textbox", { name: "What does this part do?" }),
      ).toHaveFocus(),
    );
  });

  it("moves only view state through accessible position controls", async () => {
    const user = userEvent.setup();
    const { environment, blobs } = createDownloadEnvironment();
    render(<BlueprintEditor downloadEnvironment={environment} />);
    await addNamedPart(user, "Intake", "Capture request");

    await user.click(screen.getByRole("button", { name: "Download blueprint" }));
    await user.click(screen.getByRole("button", { name: "Move right" }));
    await user.click(screen.getByRole("button", { name: "Move down" }));
    await user.click(screen.getByRole("button", { name: "Download blueprint" }));

    const before = JSON.parse(await blobs[0].text());
    const after = JSON.parse(await blobs[1].text());
    expect(after.truth).toEqual(before.truth);
    expect(after.view.componentPositions).not.toEqual(before.view.componentPositions);
  });

  it("requires confirmation and allows cancellation for destructive controls", async () => {
    const user = userEvent.setup();
    render(<BlueprintEditor />);
    await addNamedPart(user, "Intake", "Capture request");
    await addNamedPart(user, "Router", "Route request");
    await user.click(screen.getByText("Evidence and connections"));
    await user.click(screen.getByRole("button", { name: "Add evidence" }));
    await user.type(
      screen.getByRole("textbox", { name: "Evidence statement" }),
      "Observed handoff",
    );
    await user.click(screen.getByRole("button", { name: "Add a connection" }));

    for (const removeName of ["Remove connection", "Remove evidence", "Remove part"]) {
      await user.click(screen.getByRole("button", { name: removeName }));
      expect(screen.getByRole("button", { name: "Confirm remove" })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Cancel removal" }));
      expect(screen.getByRole("button", { name: removeName })).toBeInTheDocument();
    }
  });
});
