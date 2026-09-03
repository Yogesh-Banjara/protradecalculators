"use client";

import React from "react";
import type {
  DrywallOpeningInput,
  DrywallRoomInput,
} from "@/types/drywall";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { DrywallOpeningRow } from "./opening-row";
import { Trash2, DoorOpen, AppWindow } from "lucide-react";

export interface DrywallRoomRowProps {
  room: DrywallRoomInput;
  index: number;
  canRemove: boolean;
  onChange: (updated: DrywallRoomInput) => void;
  onRemove: () => void;
}

export function DrywallRoomRow({
  room,
  index,
  canRemove,
  onChange,
  onRemove,
}: DrywallRoomRowProps) {
  const handleFieldChange = (field: keyof DrywallRoomInput, val: unknown) => {
    onChange({
      ...room,
      [field]: val,
    });
  };

  const addOpening = (type: "door" | "window" | "custom") => {
    const nextCount = room.openings.length + 1;
    const newOpening: DrywallOpeningInput = {
      id: `op-${Date.now()}`,
      name:
        type === "door"
          ? `Door ${nextCount}`
          : type === "window"
          ? `Window ${nextCount}`
          : `Opening ${nextCount}`,
      type,
      widthFt: type === "door" ? 3.0 : 3.0,
      heightFt: type === "door" ? 6.833 : 4.0,
      count: 1,
    };
    handleFieldChange("openings", [...room.openings, newOpening]);
  };

  const updateOpening = (opIndex: number, updated: DrywallOpeningInput) => {
    const next = [...room.openings];
    next[opIndex] = updated;
    handleFieldChange("openings", next);
  };

  const removeOpening = (opIndex: number) => {
    const next = room.openings.filter((_, i) => i !== opIndex);
    handleFieldChange("openings", next);
  };

  // Quick client preview
  const wallArea = room.includeWalls ? 2 * (room.lengthFt + room.widthFt) * room.heightFt : 0;
  const ceilingArea = room.includeCeiling ? room.lengthFt * room.widthFt : 0;
  const deductions = room.openings.reduce((sum, o) => sum + o.widthFt * o.heightFt * (o.count || 1), 0);
  const netArea = Math.max(0, wallArea + ceilingArea - deductions);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header with Room Name & Remove */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-500 text-xs font-black text-slate-950 font-mono">
            {index + 1}
          </span>
          <input
            type="text"
            value={room.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            aria-label={`Name for Room ${index + 1}`}
            className="font-bold text-sm text-slate-900 border-b border-dashed border-slate-300 hover:border-slate-500 focus:border-amber-500 bg-transparent px-1 py-0.5 focus:outline-none"
            placeholder="Room Name (e.g. Master Bedroom)"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
            Net: {netArea.toFixed(1)} sq ft
          </span>

          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              aria-label={`Remove room ${room.name}`}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Dimensions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField id={`room-${room.id}-len`} label="Room Length (ft)" required>
          <Input
            id={`room-${room.id}-len`}
            type="number"
            min="1"
            step="0.5"
            value={room.lengthFt || ""}
            onChange={(e) =>
              handleFieldChange("lengthFt", parseFloat(e.target.value) || 0)
            }
            placeholder="14"
          />
        </FormField>

        <FormField id={`room-${room.id}-wd`} label="Room Width (ft)" required>
          <Input
            id={`room-${room.id}-wd`}
            type="number"
            min="1"
            step="0.5"
            value={room.widthFt || ""}
            onChange={(e) =>
              handleFieldChange("widthFt", parseFloat(e.target.value) || 0)
            }
            placeholder="12"
          />
        </FormField>

        <FormField id={`room-${room.id}-ht`} label="Ceiling Height (ft)" required>
          <Input
            id={`room-${room.id}-ht`}
            type="number"
            min="4"
            max="24"
            step="0.5"
            value={room.heightFt || ""}
            onChange={(e) =>
              handleFieldChange("heightFt", parseFloat(e.target.value) || 8)
            }
            placeholder="8"
          />
        </FormField>
      </div>

      {/* Surface Toggles & Add Opening Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-semibold">
            <input
              type="checkbox"
              checked={room.includeWalls}
              onChange={(e) => handleFieldChange("includeWalls", e.target.checked)}
              className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 h-4 w-4"
            />
            <span>Include Walls ({wallArea.toFixed(0)} sq ft)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-semibold">
            <input
              type="checkbox"
              checked={room.includeCeiling}
              onChange={(e) => handleFieldChange("includeCeiling", e.target.checked)}
              className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 h-4 w-4"
            />
            <span>Include Ceiling ({ceilingArea.toFixed(0)} sq ft)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => addOpening("door")}
            className="text-xs h-7 px-2 text-slate-700 border-slate-300"
          >
            <DoorOpen className="h-3.5 w-3.5 mr-1 text-amber-600" />
            + Door
          </Button>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => addOpening("window")}
            className="text-xs h-7 px-2 text-slate-700 border-slate-300"
          >
            <AppWindow className="h-3.5 w-3.5 mr-1 text-amber-600" />
            + Window
          </Button>
        </div>
      </div>

      {/* Openings List */}
      {room.openings.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Opening Deductions ({room.openings.length})
          </span>
          <div className="space-y-2">
            {room.openings.map((op, opIdx) => (
              <DrywallOpeningRow
                key={op.id}
                opening={op}
                index={opIdx}
                onChange={(updated) => updateOpening(opIdx, updated)}
                onRemove={() => removeOpening(opIdx)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
