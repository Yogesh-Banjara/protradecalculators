import { describe, it, expect } from "vitest";
import type { ToolDefinition } from "@/types/tools";
import { executeTool } from "@/lib/tools/runner";

interface FixtureInput extends Record<string, unknown> {
  lengthFeet: number;
  widthFeet: number;
  thicknessInches: number;
  wastePercent: number;
}

interface FixtureOutput extends Record<string, unknown> {
  volumeCubicYards: number;
  totalWithWaste: number;
  bagCount80Lb: number;
}

const fixtureConcreteTool: ToolDefinition<FixtureInput, FixtureOutput> = {
  id: "test-concrete-slab",
  slug: "concrete-slab",
  categoryId: "construction",
  title: "Concrete Slab Calculator (Test Fixture)",
  description: "Estimates ready-mix concrete volume and bags required.",
  searchIntent: "Calculate concrete slab volume in cubic yards",
  status: "active",
  inputs: [
    {
      id: "lengthFeet",
      label: "Length (feet)",
      type: "number",
      required: true,
      min: 0.1,
      defaultValue: 10,
    },
    {
      id: "widthFeet",
      label: "Width (feet)",
      type: "number",
      required: true,
      min: 0.1,
      defaultValue: 10,
    },
    {
      id: "thicknessInches",
      label: "Thickness (inches)",
      type: "number",
      required: true,
      min: 1,
      defaultValue: 4,
    },
    {
      id: "wastePercent",
      label: "Waste Allowance (%)",
      type: "number",
      required: false,
      defaultValue: 10,
    },
  ],
  outputs: [
    {
      id: "volumeCubicYards",
      label: "Net Volume",
      unit: "cubic-yard",
      isPrimary: true,
      precision: 2,
    },
    {
      id: "totalWithWaste",
      label: "Total Volume (+ Waste)",
      unit: "cubic-yard",
      precision: 2,
    },
    {
      id: "bagCount80Lb",
      label: "80lb Bags Required",
      precision: 0,
    },
  ],
  calculate: (input) => {
    const thicknessFeet = input.thicknessInches / 12;
    const cuFt = input.lengthFeet * input.widthFeet * thicknessFeet;
    const netYards = cuFt / 27;
    const withWaste = netYards * (1 + (input.wastePercent || 0) / 100);
    const bagCount = Math.ceil((cuFt * (1 + (input.wastePercent || 0) / 100)) / 0.6);

    return {
      values: {
        volumeCubicYards: Math.round(netYards * 100) / 100,
        totalWithWaste: Math.round(withWaste * 100) / 100,
        bagCount80Lb: bagCount,
      },
      steps: [
        {
          label: "Cubic Feet",
          formula: "L * W * (T/12)",
          values: `${input.lengthFeet} * ${input.widthFeet} * (${input.thicknessInches}/12)`,
          result: `${cuFt.toFixed(2)} cu ft`,
        },
      ],
    };
  },
  seo: {
    title: "Concrete Slab Calculator",
    description: "Calculate concrete yards needed.",
  },
};

describe("Tool Execution Runner", () => {
  it("validates and calculates valid input successfully", () => {
    const rawInputs = {
      lengthFeet: 20,
      widthFeet: 20,
      thicknessInches: 4,
      wastePercent: 10,
    };

    const result = executeTool(fixtureConcreteTool, rawInputs);

    expect(result.isValid).toBe(true);
    expect(result.values).toBeDefined();
    // 20 * 20 * (4/12) = 133.33 cu ft -> 4.94 cu yd -> +10% = 5.43 cu yd
    expect(result.values?.volumeCubicYards).toBeCloseTo(4.94, 2);
    expect(result.values?.totalWithWaste).toBeCloseTo(5.43, 2);
    expect(result.formattedOutputs?.volumeCubicYards).toBe("4.94 cu yd");
    expect(result.formattedOutputs?.totalWithWaste).toBe("5.43 cu yd");
    expect(result.steps?.length).toBe(1);
  });

  it("handles missing required fields with validation errors", () => {
    const rawInputs = {
      lengthFeet: "",
      widthFeet: 20,
    };

    const result = executeTool(fixtureConcreteTool, rawInputs);

    expect(result.isValid).toBe(false);
    expect(result.errors?.lengthFeet).toBeDefined();
  });

  it("rejects non-numeric inputs with validation errors", () => {
    const rawInputs = {
      lengthFeet: "twenty",
      widthFeet: 20,
      thicknessInches: 4,
    };

    const result = executeTool(fixtureConcreteTool, rawInputs);

    expect(result.isValid).toBe(false);
    expect(result.errors?.lengthFeet).toContain("must be a valid number");
  });

  it("rejects values below min threshold", () => {
    const rawInputs = {
      lengthFeet: -5,
      widthFeet: 20,
      thicknessInches: 4,
    };

    const result = executeTool(fixtureConcreteTool, rawInputs);

    expect(result.isValid).toBe(false);
    expect(result.errors?.lengthFeet).toContain("must be greater than zero");
  });
});
