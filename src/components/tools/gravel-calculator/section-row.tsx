"use client";

import React from "react";
import type { AggregateSectionInput, AggregateSectionShape } from "@/types/aggregate";
import type { LengthUnit } from "@/types/units";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Trash2, Plus, Minus } from "lucide-react";

export interface SectionRowProps {
  section: AggregateSectionInput;
  index: number;
  canRemove: boolean;
  onChange: (updated: AggregateSectionInput) => void;
  onRemove: () => void;
}

const SHAPE_OPTIONS = [
  { label: "Rectangular Area (Driveway, Path, Bed)", value: "rectangular" },
  { label: "Circular Area (Round Patio, Firepit, Tree Ring)", value: "circular" },
];

const LENGTH_UNITS = [
  { label: "feet (ft)", value: "foot" },
  { label: "yards (yd)", value: "yard" },
  { label: "inches (in)", value: "inch" },
  { label: "meters (m)", value: "meter" },
  { label: "centimeters (cm)", value: "centimeter" },
];

const DEPTH_UNITS = [
  { label: "inches (in)", value: "inch" },
  { label: "feet (ft)", value: "foot" },
  { label: "centimeters (cm)", value: "centimeter" },
  { label: "meters (m)", value: "meter" },
];

export function SectionRow({
  section,
  index,
  canRemove,
  onChange,
  onRemove,
}: SectionRowProps) {
  const isCircular = section.shape === "circular";

  const handleShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newShape = e.target.value as AggregateSectionShape;
    const isNewCircular = newShape === "circular";

    onChange({
      ...section,
      shape: newShape,
      length: isNewCircular ? undefined : (section.length || 20),
      width: isNewCircular ? undefined : (section.width || 10),
      diameter: isNewCircular ? (section.diameter || 12) : undefined,
      lengthUnit: section.lengthUnit,
      depthUnit: section.depthUnit,
    });
  };

  const handleFieldChange = (field: keyof AggregateSectionInput, val: unknown) => {
    onChange({
      ...section,
      [field]: val,
    });
  };

  const updateQuantity = (delta: number) => {
    const newQty = Math.max(1, (section.quantity || 1) + delta);
    handleFieldChange("quantity", newQty);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header with Section Name, Shape Selector & Delete */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-500 text-xs font-black text-slate-950 font-mono">
            {index + 1}
          </span>
          <input
            type="text"
            value={section.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            aria-label={`Name for Section ${index + 1}`}
            className="font-bold text-sm text-slate-900 border-b border-dashed border-slate-300 hover:border-slate-500 focus:border-amber-500 bg-transparent px-1 py-0.5 focus:outline-none"
            placeholder="Section Name (e.g. Main Driveway)"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-full sm:w-64">
            <Select
              value={section.shape}
              onChange={handleShapeChange}
              options={SHAPE_OPTIONS}
              aria-label={`Shape for Section ${index + 1}`}
            />
          </div>

          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              aria-label={`Remove section ${section.name}`}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Dimensions Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isCircular ? (
          <>
            {/* Diameter */}
            <FormField id={`sec-${section.id}-diam`} label="Circle Diameter" required>
              <div className="flex gap-1.5">
                <Input
                  id={`sec-${section.id}-diam`}
                  type="number"
                  min="0.1"
                  step="any"
                  value={section.diameter ?? ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "diameter",
                      e.target.value === "" ? undefined : parseFloat(e.target.value)
                    )
                  }
                  placeholder="12"
                />
                <div className="w-28 shrink-0">
                  <Select
                    value={section.diameterUnit ?? section.lengthUnit}
                    onChange={(e) =>
                      handleFieldChange("diameterUnit", e.target.value as LengthUnit)
                    }
                    options={LENGTH_UNITS}
                    aria-label="Diameter unit"
                  />
                </div>
              </div>
            </FormField>

            {/* Depth / Thickness */}
            <FormField id={`sec-${section.id}-depth`} label="Depth / Layer Thickness" required>
              <div className="flex gap-1.5">
                <Input
                  id={`sec-${section.id}-depth`}
                  type="number"
                  min="0.1"
                  step="any"
                  value={section.depth ?? ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "depth",
                      e.target.value === "" ? undefined : parseFloat(e.target.value)
                    )
                  }
                  placeholder="3"
                />
                <div className="w-28 shrink-0">
                  <Select
                    value={section.depthUnit}
                    onChange={(e) =>
                      handleFieldChange("depthUnit", e.target.value as LengthUnit)
                    }
                    options={DEPTH_UNITS}
                    aria-label="Depth unit"
                  />
                </div>
              </div>
            </FormField>
          </>
        ) : (
          <>
            {/* Length */}
            <FormField id={`sec-${section.id}-len`} label="Length" required>
              <div className="flex gap-1.5">
                <Input
                  id={`sec-${section.id}-len`}
                  type="number"
                  min="0.1"
                  step="any"
                  value={section.length ?? ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "length",
                      e.target.value === "" ? undefined : parseFloat(e.target.value)
                    )
                  }
                  placeholder="50"
                />
                <div className="w-28 shrink-0">
                  <Select
                    value={section.lengthUnit}
                    onChange={(e) =>
                      handleFieldChange("lengthUnit", e.target.value as LengthUnit)
                    }
                    options={LENGTH_UNITS}
                    aria-label="Length unit"
                  />
                </div>
              </div>
            </FormField>

            {/* Width */}
            <FormField id={`sec-${section.id}-wid`} label="Width" required>
              <div className="flex gap-1.5">
                <Input
                  id={`sec-${section.id}-wid`}
                  type="number"
                  min="0.1"
                  step="any"
                  value={section.width ?? ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "width",
                      e.target.value === "" ? undefined : parseFloat(e.target.value)
                    )
                  }
                  placeholder="12"
                />
                <div className="w-28 shrink-0">
                  <Select
                    value={section.lengthUnit}
                    onChange={(e) =>
                      handleFieldChange("lengthUnit", e.target.value as LengthUnit)
                    }
                    options={LENGTH_UNITS}
                    aria-label="Width unit"
                  />
                </div>
              </div>
            </FormField>

            {/* Depth / Thickness */}
            <FormField id={`sec-${section.id}-depth`} label="Depth / Layer Thickness" required>
              <div className="flex gap-1.5">
                <Input
                  id={`sec-${section.id}-depth`}
                  type="number"
                  min="0.1"
                  step="any"
                  value={section.depth ?? ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "depth",
                      e.target.value === "" ? undefined : parseFloat(e.target.value)
                    )
                  }
                  placeholder="4"
                />
                <div className="w-28 shrink-0">
                  <Select
                    value={section.depthUnit}
                    onChange={(e) =>
                      handleFieldChange("depthUnit", e.target.value as LengthUnit)
                    }
                    options={DEPTH_UNITS}
                    aria-label="Depth unit"
                  />
                </div>
              </div>
            </FormField>
          </>
        )}

        {/* Quantity */}
        <FormField id={`sec-${section.id}-qty`} label="Quantity (Count)">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => updateQuantity(-1)}
              aria-label="Decrease quantity"
              className="h-10 px-3"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Input
              id={`sec-${section.id}-qty`}
              type="number"
              min="1"
              step="1"
              value={section.quantity}
              onChange={(e) =>
                handleFieldChange(
                  "quantity",
                  Math.max(1, parseInt(e.target.value, 10) || 1)
                )
              }
              className="text-center font-bold"
            />
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => updateQuantity(1)}
              aria-label="Increase quantity"
              className="h-10 px-3"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </FormField>
      </div>
    </div>
  );
}
