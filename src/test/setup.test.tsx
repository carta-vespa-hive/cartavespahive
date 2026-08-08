import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("test setup", () => {
  it("renders React with jest-dom matchers", () => {
    render(<button type="button">Build blueprint</button>);
    expect(screen.getByRole("button", { name: "Build blueprint" })).toBeVisible();
  });
});
