import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("presents the truth-model blueprint workbench", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Map the truth before styling the picture." }),
    ).toBeVisible();
    expect(screen.getByLabelText("System name")).toBeVisible();
    expect(screen.getByRole("button", { name: "Add a part" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Download blueprint" })).toBeVisible();
  });

  it("removes the superseded prompt-generator controls", () => {
    render(<App />);
    expect(screen.queryByText("Copy Fable architect prompt")).not.toBeInTheDocument();
    expect(screen.queryByText("Choose a diagram mode")).not.toBeInTheDocument();
  });
});
