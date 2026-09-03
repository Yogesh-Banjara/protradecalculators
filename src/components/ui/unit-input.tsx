"use client";

import React from "react";
import { convertLength, convertArea, convertVolume, convertWeight, convertPressure, convertTemperature } from "@/lib/units/converter";
import type { LengthUnit, AreaUnit, VolumeUnit, WeightUnit, PressureUnit, TemperatureUnit } from "@/types/units";

export type SupportedUnitCategory = "length" | "area" | "volume" | "weight" | "pressure" | "temperature";

export interface UnitOption {
  value: string;
  label: string;
  symbol: string;
}

export interface UnitInputProps {
  id?: string;
  label: string;
  value: number | string;
  unit: string;
  category?: SupportedUnitCategory;
  allowedUnits?: readonly UnitOption[];
  min?: number;
  max?: number;
  step?: number | string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  onChange: (newValue: number, newUnit: string) => void;
  className?: string;
}

const DEFAULT_UNIT_OPTIONS: Record<SupportedUnitCategory, UnitOption[]> = {
  length: [
    { value: "foot", label: "Feet (ft)", symbol: "ft" },
    { value: "inch", label: "Inches (in)", symbol: "in" },
    { value: "yard", label: "Yards (yd)", symbol: "yd" },
    { value: "meter", label: "Meters (m)", symbol: "m" },
    { value: "centimeter", label: "Centimeters (cm)", symbol: "cm" },
    { value: "millimeter", label: "Millimeters (mm)", symbol: "mm" },
  ],
  area: [
    { value: "square-foot", label: "Sq Feet (sq ft)", symbol: "sq ft" },
    { value: "square-yard", label: "Sq Yards (sq yd)", symbol: "sq yd" },
    { value: "square-meter", label: "Sq Meters (sq m)", symbol: "sq m" },
  ],
  volume: [
    { value: "cubic-yard", label: "Cubic Yards (yd³)", symbol: "yd³" },
    { value: "cubic-foot", label: "Cubic Feet (ft³)", symbol: "ft³" },
    { value: "cubic-meter", label: "Cubic Meters (m³)", symbol: "m³" },
    { value: "gallon", label: "Gallons (gal)", symbol: "gal" },
  ],
  weight: [
    { value: "pound", label: "Pounds (lbs)", symbol: "lbs" },
    { value: "short-ton", label: "Tons (US short ton)", symbol: "tons" },
    { value: "kilogram", label: "Kilograms (kg)", symbol: "kg" },
    { value: "metric-ton", label: "Metric Tonnes (t)", symbol: "t" },
  ],
  pressure: [
    { value: "psi", label: "PSI (lbs/in²)", symbol: "PSI" },
    { value: "bar", label: "Bar", symbol: "bar" },
    { value: "kilopascal", label: "Kilopascals (kPa)", symbol: "kPa" },
  ],
  temperature: [
    { value: "fahrenheit", label: "Fahrenheit (°F)", symbol: "°F" },
    { value: "celsius", label: "Celsius (°C)", symbol: "°C" },
  ],
};

export function UnitInput({
  id,
  label,
  value,
  unit,
  category = "length",
  allowedUnits,
  min = 0,
  max,
  step = "any",
  placeholder,
  helperText,
  error,
  onChange,
  className = "",
}: UnitInputProps) {
  const options = allowedUnits ?? DEFAULT_UNIT_OPTIONS[category] ?? [];

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(0, unit);
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(num, unit);
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    if (newUnit === unit) return;

    const currentNum = typeof value === "number" ? value : parseFloat(value) || 0;
    let convertedNum = currentNum;

    // Non-destructive physical quantity conversion
    try {
      if (category === "length") {
        convertedNum = convertLength(currentNum, unit as LengthUnit, newUnit as LengthUnit);
      } else if (category === "area") {
        convertedNum = convertArea(currentNum, unit as AreaUnit, newUnit as AreaUnit);
      } else if (category === "volume") {
        convertedNum = convertVolume(currentNum, unit as VolumeUnit, newUnit as VolumeUnit);
      } else if (category === "weight") {
        convertedNum = convertWeight(currentNum, unit as WeightUnit, newUnit as WeightUnit);
      } else if (category === "pressure") {
        convertedNum = convertPressure(currentNum, unit as PressureUnit, newUnit as PressureUnit);
      } else if (category === "temperature") {
        convertedNum = convertTemperature(currentNum, unit as TemperatureUnit, newUnit as TemperatureUnit);
      }

      // Sensible display rounding
      convertedNum = Math.round(convertedNum * 1000) / 1000;
    } catch {
      convertedNum = currentNum;
    }

    onChange(convertedNum, newUnit);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-stretch min-h-[44px] rounded-xl border border-slate-300 bg-white shadow-xs focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all overflow-hidden">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value === 0 ? "" : value}
          onChange={handleNumberChange}
          placeholder={placeholder || "0"}
          className="flex-1 min-w-0 w-full bg-transparent px-3.5 py-2.5 text-base sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {options.length > 1 ? (
          <div className="border-l border-slate-200 bg-slate-50 shrink-0 flex items-center">
            <select
              value={unit}
              onChange={handleUnitChange}
              aria-label={`${label} unit`}
              className="h-full bg-transparent px-2.5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 focus:outline-none cursor-pointer"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.symbol || opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="border-l border-slate-200 bg-slate-50 px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-600 select-none shrink-0 flex items-center">
            {options[0]?.symbol || unit}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="text-[11px] text-slate-500 leading-tight">{helperText}</p>
      )}
      {error && (
        <p className="text-[11px] font-semibold text-red-600 leading-tight">{error}</p>
      )}
    </div>
  );
}
