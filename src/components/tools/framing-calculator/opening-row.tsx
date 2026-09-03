"use client";

import React from "react";
import type { LumberNominalSize, OpeningType, WallOpeningInput } from "@/types/framing";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface OpeningRowProps {
  opening: WallOpeningInput;
  index: number;
  wallLumberSize: LumberNominalSize;
  onChange: (updated: WallOpeningInput) => void;
  onRemove: () => void;
}

const OPENING_TYPES = [
  { label: "Window", value: "window" },
  { label: "Door", value: "door" },
];

const HEADER_SIZES = [
  { label: "2x8 Header (Spans to 6')", value: "2x8" },
  { label: "2x10 Header (Spans to 8')", value: "2x10" },
  { label: "2x12 Header (Spans 8'+)", value: "2x12" },
  { label: "2x6 Header (Small Spans to 4')", value: "2x6" },
];

export function OpeningRow({
  opening,
  index,
  wallLumberSize: _wallLumberSize,
  onChange,
  onRemove,
}: OpeningRowProps) {
  const handleFieldChange = (field: keyof WallOpeningInput, val: unknown) => {
    onChange({
      ...opening,
      [field]: val,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-md bg-slate-50 border border-slate-200 text-xs">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-bold text-slate-500 font-mono">#{index + 1}</span>
        <div className="w-28">
          <Select
            value={opening.type}
            onChange={(e) => handleFieldChange("type", e.target.value as OpeningType)}
            options={OPENING_TYPES}
            aria-label="Opening Type"
          />
        </div>
        <input
          type="text"
          value={opening.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          placeholder="Name (e.g. 3060 Window)"
          aria-label="Opening Name"
          className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-medium">Width:</span>
          <div className="w-16">
            <Input
              type="number"
              min="0.5"
              step="0.25"
              value={opening.widthFt}
              onChange={(e) =>
                handleFieldChange("widthFt", parseFloat(e.target.value) || 3)
              }
              aria-label="Opening width in feet"
            />
          </div>
          <span className="text-slate-400">ft</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-medium">Height:</span>
          <div className="w-16">
            <Input
              type="number"
              min="0.5"
              step="0.25"
              value={opening.heightFt}
              onChange={(e) =>
                handleFieldChange("heightFt", parseFloat(e.target.value) || 4)
              }
              aria-label="Opening height in feet"
            />
          </div>
          <span className="text-slate-400">ft</span>
        </div>

        <div className="w-36">
          <Select
            value={opening.headerLumberSize ?? "2x8"}
            onChange={(e) =>
              handleFieldChange("headerLumberSize", e.target.value as LumberNominalSize)
            }
            options={HEADER_SIZES}
            aria-label="Header Lumber Size"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-medium">Qty:</span>
          <div className="w-14">
            <Input
              type="number"
              min="1"
              step="1"
              value={opening.count}
              onChange={(e) =>
                handleFieldChange(
                  "count",
                  Math.max(1, parseInt(e.target.value, 10) || 1)
                )
              }
              className="text-center font-bold"
              aria-label="Opening quantity"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          aria-label={`Remove opening ${opening.name}`}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
