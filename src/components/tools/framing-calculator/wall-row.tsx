"use client";

import React from "react";
import type {
  LumberNominalSize,
  StudSpacing,
  WallOpeningInput,
  WallSectionInput,
} from "@/types/framing";
import { STANDARD_WALL_HEIGHTS } from "@/data/materials/lumber-types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { OpeningRow } from "./opening-row";
import { Trash2, DoorOpen, AppWindow } from "lucide-react";

export interface WallRowProps {
  wall: WallSectionInput;
  index: number;
  canRemove: boolean;
  onChange: (updated: WallSectionInput) => void;
  onRemove: () => void;
}

const SPACING_OPTIONS = [
  { label: "16\" OC (Standard Residential)", value: "16" },
  { label: "24\" OC (Advanced / Non-Bearing)", value: "24" },
  { label: "12\" OC (Heavy Load / Tile Backing)", value: "12" },
  { label: "19.2\" OC (Engineered 5-bay Sheet)", value: "19.2" },
];

const LUMBER_OPTIONS = [
  { label: "2x4 (Interior & Non-Bearing)", value: "2x4" },
  { label: "2x6 (Exterior Structural & Wet Walls)", value: "2x6" },
];

export function WallRow({
  wall,
  index,
  canRemove,
  onChange,
  onRemove,
}: WallRowProps) {
  const handleFieldChange = (field: keyof WallSectionInput, val: unknown) => {
    onChange({
      ...wall,
      [field]: val,
    });
  };

  const addOpening = (type: "window" | "door") => {
    const nextCount = wall.openings.length + 1;
    const newOpening: WallOpeningInput = {
      id: `op-${Date.now()}`,
      name: type === "window" ? `Window ${nextCount}` : `Door ${nextCount}`,
      type,
      widthFt: type === "window" ? 3.0 : 3.0,
      heightFt: type === "window" ? 4.0 : 6.833,
      count: 1,
      headerLumberSize: "2x8",
    };
    handleFieldChange("openings", [...wall.openings, newOpening]);
  };

  const updateOpening = (opIndex: number, updated: WallOpeningInput) => {
    const next = [...wall.openings];
    next[opIndex] = updated;
    handleFieldChange("openings", next);
  };

  const removeOpening = (opIndex: number) => {
    const next = wall.openings.filter((_, i) => i !== opIndex);
    handleFieldChange("openings", next);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl space-y-4 text-white">
      {/* Header with Wall Name & Remove */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-500 text-xs font-black text-slate-950 font-mono">
            {index + 1}
          </span>
          <input
            type="text"
            value={wall.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            aria-label={`Name for Wall ${index + 1}`}
            className="font-bold text-xs text-white border-b border-dashed border-slate-700 hover:border-amber-400 focus:border-amber-400 bg-transparent px-1 py-0.5 focus:outline-none font-mono"
            placeholder="Wall Name (e.g. North Exterior Wall)"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-full sm:w-56">
            <Select
              value={wall.lumberSize}
              onChange={(e) =>
                handleFieldChange("lumberSize", e.target.value as LumberNominalSize)
              }
              options={LUMBER_OPTIONS}
              aria-label={`Lumber Size for Wall ${index + 1}`}
              className="bg-slate-950 border-slate-700 text-white text-xs h-8"
            />
          </div>

          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              aria-label={`Remove wall ${wall.name}`}
              className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Dimensions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end text-xs">
        {/* Wall Length */}
        <FormField id={`wall-${wall.id}-len`} label="Length (ft)" required className="space-y-1">
          <Input
            id={`wall-${wall.id}-len`}
            type="number"
            min="1"
            step="0.5"
            value={wall.lengthFt || ""}
            onChange={(e) =>
              handleFieldChange("lengthFt", parseFloat(e.target.value) || 0)
            }
            placeholder="20"
            className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
          />
        </FormField>

        {/* Wall Height */}
        <FormField id={`wall-${wall.id}-ht`} label="Height (ft)" required className="space-y-1">
          <div className="flex gap-1">
            <Input
              id={`wall-${wall.id}-ht`}
              type="number"
              min="4"
              max="24"
              step="0.5"
              value={wall.heightFt || ""}
              onChange={(e) =>
                handleFieldChange("heightFt", parseFloat(e.target.value) || 8)
              }
              placeholder="8"
              className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
            />
            <div className="w-20 shrink-0">
              <select
                aria-label="Preset Wall Height"
                onChange={(e) => handleFieldChange("heightFt", parseFloat(e.target.value))}
                value={wall.heightFt}
                className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 px-1.5 py-1 text-xs font-mono font-bold text-white focus:outline-none"
              >
                {STANDARD_WALL_HEIGHTS.map((h) => (
                  <option key={h.heightFt} value={h.heightFt}>
                    {h.heightFt}′
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FormField>

        {/* Stud Spacing OC */}
        <FormField id={`wall-${wall.id}-spacing`} label="Stud Spacing" required className="space-y-1">
          <Select
            value={wall.studSpacingInches.toString()}
            onChange={(e) =>
              handleFieldChange("studSpacingInches", parseFloat(e.target.value) as StudSpacing)
            }
            options={SPACING_OPTIONS}
            aria-label="Stud Spacing"
            className="bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
          />
        </FormField>

        {/* Corners & Drywall Intersections */}
        <div className="grid grid-cols-2 gap-1.5">
          <FormField id={`wall-${wall.id}-corners`} label="Corners" className="space-y-1">
            <Input
              id={`wall-${wall.id}-corners`}
              type="number"
              min="0"
              max="4"
              step="1"
              value={wall.cornerCount}
              onChange={(e) =>
                handleFieldChange("cornerCount", parseInt(e.target.value, 10) || 0)
              }
              className="text-center font-bold bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
              placeholder="2"
            />
          </FormField>

          <FormField id={`wall-${wall.id}-inter`} label="T-Backing" className="space-y-1">
            <Input
              id={`wall-${wall.id}-inter`}
              type="number"
              min="0"
              max="8"
              step="1"
              value={wall.intersectionCount}
              onChange={(e) =>
                handleFieldChange("intersectionCount", parseInt(e.target.value, 10) || 0)
              }
              className="text-center font-bold bg-slate-950 border-slate-700 text-white font-mono text-xs h-9"
              placeholder="0"
            />
          </FormField>
        </div>
      </div>

      {/* Double Top Plate Checkbox & Add Opening Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 font-mono">
          <input
            type="checkbox"
            checked={wall.hasDoubleTopPlate}
            onChange={(e) => handleFieldChange("hasDoubleTopPlate", e.target.checked)}
            className="h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950"
          />
          <span>Include Double Top Plate (Standard Load-Bearing)</span>
        </label>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addOpening("window")}
            className="text-[11px] h-7 px-2 border-slate-700 bg-slate-950 text-slate-300 hover:text-white"
          >
            <AppWindow className="h-3 w-3 mr-1 text-amber-400" />
            + Window
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addOpening("door")}
            className="text-[11px] h-7 px-2 border-slate-700 bg-slate-950 text-slate-300 hover:text-white"
          >
            <DoorOpen className="h-3 w-3 mr-1 text-amber-400" />
            + Door
          </Button>
        </div>
      </div>

      {/* Openings List */}
      {wall.openings.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Wall Openings ({wall.openings.length})
          </span>
          {wall.openings.map((op, opIdx) => (
            <OpeningRow
              key={op.id}
              opening={op}
              index={opIdx}
              wallLumberSize={wall.lumberSize}
              onChange={(updated) => updateOpening(opIdx, updated)}
              onRemove={() => removeOpening(opIdx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
