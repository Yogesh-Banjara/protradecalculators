import { describe, it, expect } from "vitest";
import {
  buildWebSiteSchema,
  buildOrganizationSchema,
  buildBreadcrumbSchema,
  buildWebPageSchema,
  buildSoftwareAppSchema,
  buildFaqSchema,
  buildHowToSchema,
} from "@/lib/seo/schema";

describe("SEO Schema Generation", () => {
  it("builds valid WebSite schema", () => {
    const schema = buildWebSiteSchema();
    expect(schema["@type"]).toBe("WebSite");
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema.name).toBe("ProTrade Calculators");
  });

  it("builds valid Organization schema", () => {
    const schema = buildOrganizationSchema();
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("ProTrade Calculators");
  });

  it("builds valid BreadcrumbList schema", () => {
    const items = [
      { name: "Tools", url: "/tools" },
      { name: "Concrete Slabs", url: "/tools/construction/concrete" },
    ];
    const schema = buildBreadcrumbSchema(items);
    expect(schema["@type"]).toBe("BreadcrumbList");
    const elements = schema.itemListElement as { position: number; name: string }[];
    expect(elements.length).toBe(2);
    expect(elements[0].position).toBe(1);
    expect(elements[0].name).toBe("Tools");
  });

  it("builds valid WebPage schema with breadcrumbs", () => {
    const schema = buildWebPageSchema("Test Title", "Test Desc", "/test", [
      { name: "Test", url: "/test" },
    ]);
    expect(schema["@type"]).toBe("WebPage");
    expect(schema.name).toBe("Test Title");
    expect(schema.breadcrumb).toBeDefined();
  });

  it("builds valid SoftwareApplication schema for calculator tools", () => {
    const schema = buildSoftwareAppSchema({
      name: "Concrete Slab Calculator",
      description: "Calculate concrete volume in cubic yards",
      url: "/tools/construction/concrete",
      applicationCategory: "CalculatorApplication",
    });
    expect(schema["@type"]).toBe("SoftwareApplication");
    expect(schema.name).toBe("Concrete Slab Calculator");
  });

  it("builds valid FAQPage schema", () => {
    const schema = buildFaqSchema([
      { question: "How thick should a concrete slab be?", answer: "Typically 4 inches for driveways." },
    ]);
    expect(schema["@type"]).toBe("FAQPage");
  });

  it("builds valid HowTo schema", () => {
    const schema = buildHowToSchema("How to calculate concrete", "Step by step guide", [
      { name: "Measure Length & Width", text: "Measure length and width in feet." },
      { name: "Measure Depth", text: "Measure thickness in inches." },
    ]);
    expect(schema["@type"]).toBe("HowTo");
    expect((schema.step as unknown[]).length).toBe(2);
  });
});
