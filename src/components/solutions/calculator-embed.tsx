"use client";

import React from "react";
import { VoltageDropCalculatorForm } from "@/components/tools/voltage-drop-calculator/voltage-drop-form";
import { ConduitFillCalculatorForm } from "@/components/tools/conduit-fill-calculator/conduit-form";
import { LoadSolutionCalculator } from "@/components/solutions/load-solution-calculator";
import { MotorSolutionCalculator } from "@/components/solutions/motor-solution-calculator";
import type { ConduitType, ConductorInputRow, ConductorInsulation } from "@/types/conduit";
import type { WireGaugeSize } from "@/types/electrical";

export interface CalculatorEmbedProps {
  calculatorType: string;
  inputs: Record<string, unknown>;
}

export function CalculatorEmbed({ calculatorType, inputs }: CalculatorEmbedProps) {
  if (calculatorType === "voltage-drop-calculator") {
    const voltage = typeof inputs.voltage === "number" ? inputs.voltage : 120;
    const current = typeof inputs.current === "number" ? inputs.current : 20;
    const distance = typeof inputs.distance === "number" ? inputs.distance : 100;
    const phase = inputs.phase === 3 ? "three_phase" : "single_phase";

    return (
      <VoltageDropCalculatorForm
        initialVoltage={voltage}
        initialLoadCurrentAmps={current}
        initialDistanceFt={distance}
        initialPhase={phase}
        initialMaterial="copper"
      />
    );
  }

  if (calculatorType === "conduit-fill-calculator") {
    const rawConduitType = (typeof inputs.conduitType === "string" ? inputs.conduitType.toLowerCase() : "emt") as ConduitType;
    let initialConductors: ConductorInputRow[] = [
      { id: "1", size: "4 AWG", insulation: "thhn", count: 3 },
    ];

    if (Array.isArray(inputs.conductors) && inputs.conductors.length > 0) {
      initialConductors = inputs.conductors.map((c, i) => {
        const item = c as { gauge?: string; insulation?: string; count?: number };
        let ins: ConductorInsulation = "thhn";
        const rawIns = item.insulation?.toLowerCase();
        if (rawIns === "xhhw") ins = "xhhw";
        else if (rawIns === "use_rhw" || rawIns === "rhw") ins = "use_rhw";
        else if (rawIns === "bare_copper" || rawIns === "bare") ins = "bare_copper";

        return {
          id: String(i + 1),
          size: (item.gauge ?? "4 AWG") as WireGaugeSize,
          insulation: ins,
          count: item.count ?? 1,
        };
      });
    }

    return (
      <ConduitFillCalculatorForm
        initialConduitType={rawConduitType}
        initialConductors={initialConductors}
      />
    );
  }

  if (calculatorType === "load-calculator") {
    return (
      <LoadSolutionCalculator
        initialInputs={{
          wattage: typeof inputs.wattage === "number" ? inputs.wattage : 7000,
          voltage: typeof inputs.voltage === "number" ? inputs.voltage : 240,
          continuous: typeof inputs.continuous === "boolean" ? inputs.continuous : true,
        }}
      />
    );
  }

  if (calculatorType === "motor-calculator") {
    return (
      <MotorSolutionCalculator
        initialInputs={{
          horsepower: typeof inputs.horsepower === "number" ? inputs.horsepower : 20,
          voltage: typeof inputs.voltage === "number" ? inputs.voltage : 230,
          phase: typeof inputs.phase === "number" ? inputs.phase : 3,
        }}
      />
    );
  }

  return (
    <div className="p-6 bg-slate-100 rounded-xl text-slate-700 text-sm">
      Interactive calculator preview for {calculatorType}.
    </div>
  );
}
