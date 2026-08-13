import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("presents the multimodal foundry and flagship diagram practice", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /Difficult ideas/ })).toBeVisible();
    expect(screen.getByRole("link", { name: "Make me a diagram" })).toBeVisible();
    expect(screen.getByText("Diagrams & visual systems")).toBeVisible();
    expect(screen.getByText("Characters & artifacts")).toBeVisible();
    expect(screen.getByText("Websites & prototypes")).toBeVisible();
  });

  it("preserves the working truth-model blueprint workbench", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Map the truth before styling the picture." }),
    ).toBeVisible();
    expect(screen.getByLabelText("System name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add a part" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download blueprint" })).toBeInTheDocument();
  });

  it("removes the superseded prompt-generator controls", () => {
    render(<App />);
    expect(screen.queryByText("Copy Fable architect prompt")).not.toBeInTheDocument();
    expect(screen.queryByText("Choose a diagram mode")).not.toBeInTheDocument();
  });
});
