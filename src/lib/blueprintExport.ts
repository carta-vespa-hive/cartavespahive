import type { BlueprintDocument } from "./blueprint";

export interface BlueprintDownloadEnvironment {
  createObjectUrl(blob: Blob): string;
  triggerDownload(url: string, filename: string): void;
  revokeObjectUrl(url: string): void;
}

export function serializeBlueprint(blueprint: BlueprintDocument): string {
  return `${JSON.stringify(blueprint, null, 2)}\n`;
}

export function createBlueprintFilename(systemName: string): string {
  const slug =
    systemName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled-system";

  return `${slug}.cvh-blueprint.json`;
}

const browserDownloadEnvironment: BlueprintDownloadEnvironment = {
  createObjectUrl(blob) {
    return URL.createObjectURL(blob);
  },
  triggerDownload(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  revokeObjectUrl(url) {
    URL.revokeObjectURL(url);
  },
};

export function downloadBlueprint(
  blueprint: BlueprintDocument,
  environment: BlueprintDownloadEnvironment = browserDownloadEnvironment,
): void {
  const blob = new Blob([serializeBlueprint(blueprint)], {
    type: "application/json;charset=utf-8",
  });
  const objectUrl = environment.createObjectUrl(blob);

  try {
    environment.triggerDownload(
      objectUrl,
      createBlueprintFilename(blueprint.truth.system.name),
    );
  } finally {
    environment.revokeObjectUrl(objectUrl);
  }
}
