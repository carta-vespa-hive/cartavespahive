import { describe, expect, it } from "vitest";
import { blueprintReducer, createBlueprintDocument } from "./blueprint";
import {
  createBlueprintFilename,
  downloadBlueprint,
  serializeBlueprint,
  type BlueprintDownloadEnvironment,
} from "./blueprintExport";

describe("blueprint export", () => {
  it("serializes separate versioned truth and view sections", () => {
    const document = createBlueprintDocument("system-ai");
    const serialized = serializeBlueprint(document);
    const parsed = JSON.parse(serialized);

    expect(parsed).toEqual(document);
    expect(Object.keys(parsed)).toEqual(["schema", "version", "truth", "view"]);
    expect(serialized.endsWith("\n")).toBe(true);
  });

  it("creates a portable deterministic filename", () => {
    expect(createBlueprintFilename(" Customer-support AI workflow ")).toBe(
      "customer-support-ai-workflow.cvh-blueprint.json",
    );
    expect(createBlueprintFilename("   ")).toBe("untitled-system.cvh-blueprint.json");
  });

  it("downloads the real serialized document and revokes the object URL", async () => {
    const document = blueprintReducer(createBlueprintDocument("system-ai"), {
      type: "system.updated",
      patch: { name: "AI workflow" },
    });
    let capturedBlob: Blob | undefined;
    let capturedDownload: { url: string; filename: string } | undefined;
    let revokedUrl: string | undefined;
    const environment: BlueprintDownloadEnvironment = {
      createObjectUrl(blob) {
        capturedBlob = blob;
        return "blob:blueprint";
      },
      triggerDownload(url, filename) {
        capturedDownload = { url, filename };
      },
      revokeObjectUrl(url) {
        revokedUrl = url;
      },
    };

    downloadBlueprint(document, environment);

    expect(capturedDownload).toEqual({
      url: "blob:blueprint",
      filename: "ai-workflow.cvh-blueprint.json",
    });
    expect(revokedUrl).toBe("blob:blueprint");
    expect(capturedBlob?.type).toBe("application/json;charset=utf-8");
    expect(JSON.parse(await capturedBlob!.text())).toEqual(document);
  });
});
