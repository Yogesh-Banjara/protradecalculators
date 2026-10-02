"use client";

import React from "react";
import type { ConcreteSectionInput, ConcreteShape } from "@/types/concrete";
import type { LengthUnit } from "@/types/units";
import { UnitInput } from "@/components/ui/unit-input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Trash2, Plus, Minus } from "lucide-react";

export interface SectionRowProps {
  section: ConcreteSectionInput;
  index: number;
  canRemove: boolean;
  onChange: (updated: ConcreteSectionInput) => void;
  onRemove: () => void;
}

const SHAPE_OPTIONS = [
  { label: "Rectangular Slab (Patio, Driveway, Floor)", value: "rectangular-slab" },
  { label: "Continuous Footing / Grade Beam", value: "continuous-footing" },
  { label: "Sonotube / Cylindrical Footing / Pier Tube", value: "round-column" },
  { label: "Circular Slab", value: "circular-slab" },
  { label: "Circular Footing Pad", value: "circular-footing" },
];

export function SectionRow({
  section,
  index,
  canRemove,
  onChange,
  onRemove,
}: SectionRowProps) {
  const isCircular =
    section.shape === "round-column" ||
    section.shape === "circular-slab" ||
    section.shape === "circular-footing";

  const handleShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newShape = e.target.value as ConcreteShape;
    const isNewCircular =
      newShape === "round-column" ||
      newShape === "circular-slab" ||
      newShape === "circular-footing";

    onChange({
      ...section,
      shape: newShape,
      length: isNewCircular ? undefined : (section.length || 10),
      width: isNewCircular ? undefined : (section.width || 10),
      diameter: isNewCircular ? (section.diameter || (newShape === "round-column" ? 12 : 10)) : undefined,
      lengthUnit: isNewCircular && newShape === "round-column" ? "inch" : section.lengthUnit,
      depthUnit: section.depthUnit,
    });
  };

  const handleFieldChange = (field: keyof ConcreteSectionInput, val: unknown) => {
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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl space-y-4 text-white">
      {/* Header with Section Name, Shape Selector & Delete */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-xs font-black text-slate-950 font-mono">
            {index + 1}
          </span>
          <input
            type="text"
            value={section.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            aria-label={`Name for Section ${index + 1}`}
            className="font-bold text-xs text-white border-b border-dashed border-slate-700 hover:border-amber-400 focus:border-amber-400 bg-transparent px-1 py-0.5 focus:outline-none"
            placeholder="Section Name (e.g. Main Slab)"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-full sm:w-60">
            <Select
              value={section.shape}
              onChange={handleShapeChange}
              options={SHAPE_OPTIONS}
              aria-label={`Shape for Section ${index + 1}`}
              className="bg-slate-950 border-slate-700 text-white text-xs h-8"
            />
          </div>

          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              aria-label={`Delete Section ${index + 1}`}
              className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Dynamic Dimension Inputs Grid (2x2 for Spacious Legibility) */}
      <div className="grid grid-cols-2 gap-3.5 items-end">
        {!isCircular ? (
          <>
            {/* Length */}
            <div className="space-y-1">
              <UnitInput
                id={`sec-${section.id}-length`}
                label="Length"
                value={section.length ?? 0}
                unit={section.lengthUnit}
                category="length"
                onChange={(val, unit) => {
                  onChange({
                    ...section,
                    length: val,
                    lengthUnit: unit as LengthUnit,
                  });
                }}
                min={0}
              />
            </div>

            {/* Width */}
            <div className="space-y-1">
              <UnitInput
                id={`sec-${section.id}-width`}
                label="Width"
                value={section.width ?? 0}
                unit={section.lengthUnit}
                category="length"
                onChange={(val, unit) => {
                  onChange({
                    ...section,
                    width: val,
                    lengthUnit: unit as LengthUnit,
                  });
                }}
                min={0}
              />
            </div>
          </>
        ) : (
          /* Diameter for circular shapes */
          <div className="space-y-1.5">
            <UnitInput
              id={`sec-${section.id}-diameter`}
              label={section.shape === "round-column" ? "Sonotube / Pier Diameter" : "Diameter"}
              value={section.diameter ?? 0}
              unit={(section.diameterUnit || section.lengthUnit) as LengthUnit}
              category="length"
              onChange={(val, unit) => {
                onChange({
                  ...section,
                  diameter: val,
                  diameterUnit: unit as LengthUnit,
                });
              }}
              min={0}
            />
            {section.shape === "round-column" && (
              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                <span className="text-[10px] text-slate-400 font-mono">Tubes:</span>
                {[8, 10, 12, 14, 16, 18, 24].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...section,
                        diameter: d,
                        diameterUnit: "inch",
                      })
                    }
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      section.diameter === d && (section.diameterUnit === "inch" || !section.diameterUnit)
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    {d}″
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Thickness / Depth / Height */}
        <div className="space-y-1">
          <UnitInput
            id={`sec-${section.id}-depth`}
            label={
              section.shape === "round-column"
                ? "Tube Depth / Height"
                : "Thickness / Depth"
            }
            value={section.depth ?? 0}
            unit={section.depthUnit}
            category="length"
            onChange={(val, unit) => {
              onChange({
                ...section,
                depth: val,
                depthUnit: unit as LengthUnit,
              });
            }}
            min={0}
          />
        </div>

        {/* Quantity Stepper */}
        <FormField id={`sec-${section.id}-quantity`} label="Quantity" className="space-y-1">
          <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 min-h-[44px] sm:min-h-[40px] h-11 sm:h-10">
            <button
              type="button"
              onClick={() => updateQuantity(-1)}
              disabled={(section.quantity || 1) <= 1}
              aria-label={`Decrease quantity for Section ${index + 1}`}
              className="flex h-full w-10 items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="flex-1 text-center font-mono text-sm font-bold text-white">
              {section.quantity || 1}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(1)}
              aria-label={`Increase quantity for Section ${index + 1}`}
              className="flex h-full w-10 items-center justify-center text-slate-400 hover:text-white cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </FormField>
      </div>
    </div>
  );
}
