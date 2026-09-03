import type {
  ConductorMaterial,
  ConductorProperties,
  ConductorTemperatureRating,
  WireGaugeSize,
} from "@/types/electrical";

/**
 * Conductor resistivity constants (K) in Ohm-circular mils per foot at 75°C standard operating temperature.
 * K = 12.9 for Copper; K = 21.2 for Aluminum (IEEE standard / NEC Chapter 9 Table 8 reference).
 */
export const CONDUCTOR_RESISTIVITY_K: Record<ConductorMaterial, number> = {
  copper: 12.9,
  aluminum: 21.2,
};

/**
 * NEC Table 310.16 (formerly Table 310.15(B)(16)): Allowable Ampacities of Insulated Conductors
 * Rated Up to and Including 2000 Volts, 60°C Through 90°C, Not More Than Three Current-Carrying
 * Conductors in Raceway, Cable, or Earth (Based on Ambient Temperature of 30°C / 86°F).
 */
export const NEC_TABLE_310_16: readonly ConductorProperties[] = [
  {
    size: "14 AWG",
    circularMils: 4110,
    copperAmpacity60C: 15,
    copperAmpacity75C: 20,
    copperAmpacity90C: 25,
    aluminumAmpacity60C: 0,
    aluminumAmpacity75C: 0,
    aluminumAmpacity90C: 0,
    copperResistancePer1000Ft: 3.07,
    aluminumResistancePer1000Ft: 5.06,
  },
  {
    size: "12 AWG",
    circularMils: 6530,
    copperAmpacity60C: 20,
    copperAmpacity75C: 25,
    copperAmpacity90C: 30,
    aluminumAmpacity60C: 15,
    aluminumAmpacity75C: 20,
    aluminumAmpacity90C: 25,
    copperResistancePer1000Ft: 1.93,
    aluminumResistancePer1000Ft: 3.18,
  },
  {
    size: "10 AWG",
    circularMils: 10380,
    copperAmpacity60C: 30,
    copperAmpacity75C: 35,
    copperAmpacity90C: 40,
    aluminumAmpacity60C: 25,
    aluminumAmpacity75C: 30,
    aluminumAmpacity90C: 35,
    copperResistancePer1000Ft: 1.21,
    aluminumResistancePer1000Ft: 2.00,
  },
  {
    size: "8 AWG",
    circularMils: 16510,
    copperAmpacity60C: 40,
    copperAmpacity75C: 50,
    copperAmpacity90C: 55,
    aluminumAmpacity60C: 35,
    aluminumAmpacity75C: 40,
    aluminumAmpacity90C: 45,
    copperResistancePer1000Ft: 0.764,
    aluminumResistancePer1000Ft: 1.26,
  },
  {
    size: "6 AWG",
    circularMils: 26240,
    copperAmpacity60C: 55,
    copperAmpacity75C: 65,
    copperAmpacity90C: 75,
    aluminumAmpacity60C: 40,
    aluminumAmpacity75C: 50,
    aluminumAmpacity90C: 60,
    copperResistancePer1000Ft: 0.491,
    aluminumResistancePer1000Ft: 0.808,
  },
  {
    size: "4 AWG",
    circularMils: 41740,
    copperAmpacity60C: 70,
    copperAmpacity75C: 85,
    copperAmpacity90C: 95,
    aluminumAmpacity60C: 55,
    aluminumAmpacity75C: 65,
    aluminumAmpacity90C: 75,
    copperResistancePer1000Ft: 0.308,
    aluminumResistancePer1000Ft: 0.508,
  },
  {
    size: "3 AWG",
    circularMils: 52620,
    copperAmpacity60C: 85,
    copperAmpacity75C: 100,
    copperAmpacity90C: 115,
    aluminumAmpacity60C: 65,
    aluminumAmpacity75C: 75,
    aluminumAmpacity90C: 85,
    copperResistancePer1000Ft: 0.245,
    aluminumResistancePer1000Ft: 0.403,
  },
  {
    size: "2 AWG",
    circularMils: 66360,
    copperAmpacity60C: 95,
    copperAmpacity75C: 115,
    copperAmpacity90C: 130,
    aluminumAmpacity60C: 75,
    aluminumAmpacity75C: 90,
    aluminumAmpacity90C: 100,
    copperResistancePer1000Ft: 0.194,
    aluminumResistancePer1000Ft: 0.319,
  },
  {
    size: "1 AWG",
    circularMils: 83690,
    copperAmpacity60C: 110,
    copperAmpacity75C: 130,
    copperAmpacity90C: 145,
    aluminumAmpacity60C: 85,
    aluminumAmpacity75C: 100,
    aluminumAmpacity90C: 115,
    copperResistancePer1000Ft: 0.154,
    aluminumResistancePer1000Ft: 0.253,
  },
  {
    size: "1/0 AWG",
    circularMils: 105600,
    copperAmpacity60C: 125,
    copperAmpacity75C: 150,
    copperAmpacity90C: 170,
    aluminumAmpacity60C: 100,
    aluminumAmpacity75C: 120,
    aluminumAmpacity90C: 135,
    copperResistancePer1000Ft: 0.122,
    aluminumResistancePer1000Ft: 0.201,
  },
  {
    size: "2/0 AWG",
    circularMils: 133100,
    copperAmpacity60C: 145,
    copperAmpacity75C: 175,
    copperAmpacity90C: 195,
    aluminumAmpacity60C: 115,
    aluminumAmpacity75C: 135,
    aluminumAmpacity90C: 150,
    copperResistancePer1000Ft: 0.0967,
    aluminumResistancePer1000Ft: 0.159,
  },
  {
    size: "3/0 AWG",
    circularMils: 167800,
    copperAmpacity60C: 165,
    copperAmpacity75C: 200,
    copperAmpacity90C: 225,
    aluminumAmpacity60C: 130,
    aluminumAmpacity75C: 155,
    aluminumAmpacity90C: 175,
    copperResistancePer1000Ft: 0.0766,
    aluminumResistancePer1000Ft: 0.126,
  },
  {
    size: "4/0 AWG",
    circularMils: 211600,
    copperAmpacity60C: 195,
    copperAmpacity75C: 230,
    copperAmpacity90C: 260,
    aluminumAmpacity60C: 150,
    aluminumAmpacity75C: 180,
    aluminumAmpacity90C: 205,
    copperResistancePer1000Ft: 0.0608,
    aluminumResistancePer1000Ft: 0.100,
  },
  {
    size: "250 kcmil",
    circularMils: 250000,
    copperAmpacity60C: 215,
    copperAmpacity75C: 255,
    copperAmpacity90C: 290,
    aluminumAmpacity60C: 170,
    aluminumAmpacity75C: 205,
    aluminumAmpacity90C: 230,
    copperResistancePer1000Ft: 0.0515,
    aluminumResistancePer1000Ft: 0.0847,
  },
  {
    size: "300 kcmil",
    circularMils: 300000,
    copperAmpacity60C: 240,
    copperAmpacity75C: 285,
    copperAmpacity90C: 320,
    aluminumAmpacity60C: 190,
    aluminumAmpacity75C: 230,
    aluminumAmpacity90C: 260,
    copperResistancePer1000Ft: 0.0429,
    aluminumResistancePer1000Ft: 0.0707,
  },
  {
    size: "350 kcmil",
    circularMils: 350000,
    copperAmpacity60C: 260,
    copperAmpacity75C: 310,
    copperAmpacity90C: 350,
    aluminumAmpacity60C: 210,
    aluminumAmpacity75C: 250,
    aluminumAmpacity90C: 280,
    copperResistancePer1000Ft: 0.0367,
    aluminumResistancePer1000Ft: 0.0605,
  },
  {
    size: "400 kcmil",
    circularMils: 400000,
    copperAmpacity60C: 280,
    copperAmpacity75C: 335,
    copperAmpacity90C: 380,
    aluminumAmpacity60C: 225,
    aluminumAmpacity75C: 270,
    aluminumAmpacity90C: 305,
    copperResistancePer1000Ft: 0.0321,
    aluminumResistancePer1000Ft: 0.0529,
  },
  {
    size: "500 kcmil",
    circularMils: 500000,
    copperAmpacity60C: 320,
    copperAmpacity75C: 380,
    copperAmpacity90C: 430,
    aluminumAmpacity60C: 260,
    aluminumAmpacity75C: 310,
    aluminumAmpacity90C: 350,
    copperResistancePer1000Ft: 0.0258,
    aluminumResistancePer1000Ft: 0.0424,
  },
  {
    size: "600 kcmil",
    circularMils: 600000,
    copperAmpacity60C: 350,
    copperAmpacity75C: 420,
    copperAmpacity90C: 475,
    aluminumAmpacity60C: 285,
    aluminumAmpacity75C: 340,
    aluminumAmpacity90C: 385,
    copperResistancePer1000Ft: 0.0214,
    aluminumResistancePer1000Ft: 0.0353,
  },
  {
    size: "750 kcmil",
    circularMils: 750000,
    copperAmpacity60C: 400,
    copperAmpacity75C: 475,
    copperAmpacity90C: 535,
    aluminumAmpacity60C: 320,
    aluminumAmpacity75C: 385,
    aluminumAmpacity90C: 435,
    copperResistancePer1000Ft: 0.0171,
    aluminumResistancePer1000Ft: 0.0282,
  },
  {
    size: "1000 kcmil",
    circularMils: 1000000,
    copperAmpacity60C: 455,
    copperAmpacity75C: 545,
    copperAmpacity90C: 615,
    aluminumAmpacity60C: 375,
    aluminumAmpacity75C: 445,
    aluminumAmpacity90C: 500,
    copperResistancePer1000Ft: 0.0129,
    aluminumResistancePer1000Ft: 0.0212,
  },
] as const;

export function getConductorProperties(size: WireGaugeSize): ConductorProperties {
  const found = NEC_TABLE_310_16.find((c) => c.size === size);
  return found ?? NEC_TABLE_310_16[0];
}

export function getBaseAmpacity(
  size: WireGaugeSize,
  material: ConductorMaterial = "copper",
  rating: ConductorTemperatureRating = "75C"
): number {
  const props = getConductorProperties(size);
  if (material === "copper") {
    switch (rating) {
      case "60C":
        return props.copperAmpacity60C;
      case "90C":
        return props.copperAmpacity90C;
      case "75C":
      default:
        return props.copperAmpacity75C;
    }
  } else {
    switch (rating) {
      case "60C":
        return props.aluminumAmpacity60C;
      case "90C":
        return props.aluminumAmpacity90C;
      case "75C":
      default:
        return props.aluminumAmpacity75C;
    }
  }
}

/**
 * NEC Table 310.15(B)(1) Ambient Temperature Correction Factors (Based on 30°C / 86°F).
 */
export function getAmbientTemperatureCorrectionFactor(
  tempF: number = 86,
  rating: ConductorTemperatureRating = "75C"
): number {
  if (tempF <= 77) return rating === "90C" ? 1.04 : 1.05;
  if (tempF <= 86) return 1.0;
  if (tempF <= 95) return rating === "90C" ? 0.96 : 0.94;
  if (tempF <= 104) return rating === "90C" ? 0.91 : 0.88;
  if (tempF <= 113) return rating === "90C" ? 0.87 : 0.82;
  if (tempF <= 122) return rating === "90C" ? 0.82 : 0.75;
  if (tempF <= 131) return rating === "90C" ? 0.76 : 0.67;
  if (tempF <= 140) return rating === "90C" ? 0.71 : 0.58;
  return 0.5;
}

/**
 * NEC Table 310.15(C)(1) Adjustment Factors for More Than Three Current-Carrying Conductors in a Raceway.
 */
export function getConduitFillAdjustmentFactor(conductorsInConduit: number = 3): number {
  if (conductorsInConduit <= 3) return 1.0;
  if (conductorsInConduit <= 6) return 0.8;
  if (conductorsInConduit <= 9) return 0.7;
  if (conductorsInConduit <= 20) return 0.5;
  if (conductorsInConduit <= 30) return 0.45;
  return 0.35;
}
