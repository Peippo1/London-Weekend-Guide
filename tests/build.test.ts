import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const nodeBinary =
  process.env.NODE_BINARY ??
  "/Users/tim/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node";
const astroCli = path.join(projectRoot, "node_modules", "astro", "bin", "astro.mjs");

function readDistFile(relativePath: string) {
  return fs.readFileSync(path.join(projectRoot, "dist", relativePath), "utf8");
}

describe("static build output", () => {
  beforeAll(() => {
    execFileSync(nodeBinary, [astroCli, "build"], {
      cwd: projectRoot,
      stdio: "pipe",
      env: {
        ...process.env,
        ASTRO_TELEMETRY_DISABLED: "1"
      }
    });
  }, 120000);

  it("creates the homepage and weekend detail page", () => {
    expect(fs.existsSync(path.join(projectRoot, "dist", "index.html"))).toBe(true);
    expect(
      fs.existsSync(path.join(projectRoot, "dist", "weekends", "2026-07-18", "index.html"))
    ).toBe(true);
  });

  it("renders the current weekend on the homepage", () => {
    const html = readDistFile("index.html");

    expect(html).toContain("London this weekend: galleries, rooftops, and late northern sunsets");
    expect(html).toContain('href="#top-picks"');
  });

  it("renders the weekend detail page with optional and linked content", () => {
    const html = readDistFile(path.join("weekends", "2026-07-18", "index.html"));

    expect(html).toContain("If you only do three things");
    expect(html).toContain("Check details");
    expect(html).toContain("Neighbourhood note");
    expect(html).toContain("Weather-aware tip");
  });
});
