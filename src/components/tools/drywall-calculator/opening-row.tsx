"use client";

import React from "react";
import type { DrywallOpeningInput, DrywallOpeningType } from "@/types/drywall";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface DrywallOpeningRowProps {
  opening: DrywallOpeningInput;
  index: number;
  onChange: (updated: DrywallOpeningInput) => void;
  onRemove: () => void;
}

const OPENING_TYPES = [
  { label: "Door", value: "door" },
  { label: "Window", value: "window" },
  { label: "Custom Opening", value: "custom" },
];

export function DrywallOpeningRow({
  opening,
  index,
  onChange,
  onRemove,
}: DrywallOpeningRowProps) {
  const handleFieldChange = (field: keyof DrywallOpeningInput, val: unknown) => {
    onChange({
      ...opening,
      [field]: val,
    });
  };

  const totalOpeningArea = (opening.widthFt * opening.heightFt * (opening.count || 1)).toFixed(1);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-md bg-slate-50 border border-slate-200 text-xs">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-bold text-slate-500 font-mono">#{index + 1}</span>
        <div className="w-32">
          <Select
            value={opening.type}
            onChange={(e) => handleFieldChange("type", e.target.value as DrywallOpeningType)}
            options={OPENING_TYPES}
            aria-label="Opening Type"
          />
        </div>
        <input
          type="text"
          value={opening.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          placeholder="Name (e.g. Entry Door)"
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
                handleFieldChange("heightFt", parseFloat(e.target.value) || 6.83)
              }
              aria-label="Opening height in feet"
            />
          </div>
          <span className="text-slate-400">ft</span>
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

        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/60 px-2 py-1 rounded">
          -{totalOpeningArea} sq ft
        </span>

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
