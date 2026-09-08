import fs from "node:fs";

const PRERENDER_MANIFEST = "prerender-manifest.json";
const READ_RETRY_ATTEMPTS = 16;
const READ_RETRY_MS = 25;

const EMPTY_PRERENDER_MANIFEST = JSON.stringify({
  version: 4,
  routes: {},
  dynamicRoutes: {},
  notFoundRoutes: [],
  preview: {
    previewModeId: "",
    previewModeSigningKey: "",
    previewModeEncryptionKey: "",
  },
});

function isPrerenderManifestPath(filePath: unknown): boolean {
  if (typeof filePath !== "string" && !Buffer.isBuffer(filePath)) {
    return false;
  }

  return String(filePath).replaceAll("\\", "/").endsWith(PRERENDER_MANIFEST);
}

function asManifestText(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (Buffer.isBuffer(value)) {
    return value.toString("utf8");
  }

  return null;
}

function isParseableJson(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function wantsStringResult(options: unknown): boolean {
  if (typeof options === "string") {
    return options.includes("utf");
  }

  if (options && typeof options === "object" && "encoding" in options) {
    const encoding = (options as { encoding?: string | null }).encoding;
    return typeof encoding === "string" && encoding.includes("utf");
  }

  return false;
}

function fallbackManifest(options: unknown): string | Buffer {
  return wantsStringResult(options)
    ? EMPTY_PRERENDER_MANIFEST
    : Buffer.from(EMPTY_PRERENDER_MANIFEST);
}

const originalReadFile = fs.promises.readFile.bind(fs.promises);

fs.promises.readFile = (async (...args: Parameters<typeof originalReadFile>) => {
  const [filePath, options] = args;

  if (!isPrerenderManifestPath(filePath)) {
    return originalReadFile(...args);
  }

  for (let attempt = 0; attempt < READ_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const result = await originalReadFile(...args);
      const text = asManifestText(result);

      if (text !== null && isParseableJson(text)) {
        return result;
      }
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: unknown }).code)
          : "";

      if (code !== "ENOENT" && attempt === READ_RETRY_ATTEMPTS - 1) {
        throw error;
      }
    }

    await wait(READ_RETRY_MS);
  }

  return fallbackManifest(options);
}) as typeof fs.promises.readFile;
