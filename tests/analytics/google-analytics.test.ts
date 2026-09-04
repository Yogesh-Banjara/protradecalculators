import { describe, it, expect } from "vitest";
import { GA_MEASUREMENT_ID } from "@/config/analytics";
import fs from "fs";
import path from "path";

describe("Google Analytics 4 Global Implementation", () => {
  it("defines the exact production GA4 measurement ID", () => {
    expect(GA_MEASUREMENT_ID).toBe("G-N2GDHEQZJS");
  });

  it("includes GoogleAnalytics component in root layout", () => {
    const layoutPath = path.join(process.cwd(), "src/app/layout.tsx");
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");

    expect(layoutContent).toContain("import { GoogleAnalytics } from");
    expect(layoutContent).toContain("<GoogleAnalytics />");
  });

  it("configures official gtag.js script and initialization in component", () => {
    const componentPath = path.join(
      process.cwd(),
      "src/components/analytics/google-analytics.tsx"
    );
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    // Must reference the official Google tag loader
    expect(componentContent).toContain(
      "https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"
    );

    // Must initialize dataLayer, gtag function, and config
    expect(componentContent).toContain("window.dataLayer = window.dataLayer || [];");
    expect(componentContent).toContain("function gtag(){dataLayer.push(arguments);}");
    expect(componentContent).toContain("gtag('js', new Date());");
    expect(componentContent).toContain("gtag('config', '${GA_MEASUREMENT_ID}'");
  });

  it("verifies no duplicate GA4 measurement IDs or GTM containers exist in src/", () => {
    const srcDir = path.join(process.cwd(), "src");

    function getAllFiles(dir: string): string[] {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      const files: string[] = [];
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...getAllFiles(fullPath));
        } else if (/\.(tsx?|jsx?|html)$/.test(entry.name)) {
          files.push(fullPath);
        }
      }
      return files;
    }

    const allFiles = getAllFiles(srcDir);

    // Check for any hardcoded duplicate G- tags outside of config/analytics.ts and google-analytics.tsx
    const filesWithMeasurementId = allFiles.filter((file) => {
      const content = fs.readFileSync(file, "utf-8");
      return content.includes("G-N2GDHEQZJS");
    });

    const relativeMatches = filesWithMeasurementId.map((f) =>
      path.relative(process.cwd(), f).replace(/\\/g, "/")
    );

    // Must ONLY exist in config/analytics.ts
    expect(relativeMatches).toEqual(["src/config/analytics.ts"]);

    // Ensure no Google Tag Manager container (GTM-XXXX) is introduced
    for (const file of allFiles) {
      const content = fs.readFileSync(file, "utf-8");
      expect(content).not.toMatch(/GTM-[A-Z0-9]+/);
    }
  });
});
