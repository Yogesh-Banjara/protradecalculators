import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("AdSense ads.txt Specification & Compliance", () => {
  const adsTxtPath = path.resolve(process.cwd(), "public/ads.txt");
  const headersPath = path.resolve(process.cwd(), "public/_headers");
  const layoutPath = path.resolve(process.cwd(), "src/app/layout.tsx");

  it("verifies public/ads.txt exists on disk", () => {
    expect(fs.existsSync(adsTxtPath)).toBe(true);
  });

  it("verifies public/ads.txt has NO UTF-8 BOM", () => {
    const buffer = fs.readFileSync(adsTxtPath);
    const hasBOM = buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
    expect(hasBOM).toBe(false);
  });

  it("verifies exact single-line content format per Google AdSense specifications", () => {
    const content = fs.readFileSync(adsTxtPath, "utf-8").trim();
    const expected = "google.com, pub-7986712897197037, DIRECT, f08c47fec0942fa0";
    expect(content).toBe(expected);
  });

  it("verifies ads.txt fields conform to IAB Tech Lab Ads.txt v1.1 format", () => {
    const rawContent = fs.readFileSync(adsTxtPath, "utf-8");
    const lines = rawContent.split(/\r?\n/).filter((l) => l.trim().length > 0);

    expect(lines.length).toBe(1);

    const parts = lines[0].split(",").map((p) => p.trim());
    expect(parts.length).toBe(4);

    const [domain, publisherId, relationType, certAuthorityId] = parts;
    expect(domain).toBe("google.com");
    expect(publisherId).toBe("pub-7986712897197037");
    expect(relationType).toBe("DIRECT");
    expect(certAuthorityId).toBe("f08c47fec0942fa0");
  });

  it("ensures no quotes, markdown, or HTML formatting exist in ads.txt", () => {
    const rawContent = fs.readFileSync(adsTxtPath, "utf-8");
    expect(rawContent).not.toContain('"');
    expect(rawContent).not.toContain("'");
    expect(rawContent).not.toContain("<");
    expect(rawContent).not.toContain(">");
    expect(rawContent).not.toContain("#");
    expect(rawContent).not.toContain("`");
  });

  it("verifies publisher ID matches ca-pub ID in root layout metadata and script", () => {
    const adsTxtContent = fs.readFileSync(adsTxtPath, "utf-8");
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");

    const adsTxtPubMatch = adsTxtContent.match(/pub-(\d+)/);
    expect(adsTxtPubMatch).not.toBeNull();
    const pubDigits = adsTxtPubMatch![1];
    expect(pubDigits).toBe("7986712897197037");

    // Must match the meta tag in layout
    expect(layoutContent).toContain(`ca-pub-${pubDigits}`);
    expect(layoutContent).toContain(`"google-adsense-account": "ca-pub-${pubDigits}"`);
  });

  it("verifies public/_headers specifies text/plain Content-Type for /ads.txt", () => {
    expect(fs.existsSync(headersPath)).toBe(true);
    const headersContent = fs.readFileSync(headersPath, "utf-8");
    expect(headersContent).toContain("/ads.txt");
    expect(headersContent).toContain("Content-Type: text/plain");
  });
});
