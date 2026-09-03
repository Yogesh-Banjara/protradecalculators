import type {
  ConductorDimensionData,
  ConductorInsulation,
  ConduitTradeSize,
  ConduitTradeSizeData,
  ConduitType,
  ConduitTypeInfo,
} from "@/types/conduit";
import type { WireGaugeSize } from "@/types/electrical";

export const CONDUIT_TYPES: readonly ConduitTypeInfo[] = [
  {
    type: "emt",
    name: "Electrical Metallic Tubing (EMT)",
    shortName: "EMT Thinwall",
    description: "Standard thin-wall steel conduit for indoor commercial and residential wiring.",
  },
  {
    type: "pvc_sch40",
    name: "Rigid PVC Schedule 40",
    shortName: "PVC Sch 40",
    description: "Standard nonmetallic conduit for underground burial, concrete encasement, and outdoor walls.",
  },
  {
    type: "pvc_sch80",
    name: "Rigid PVC Schedule 80",
    shortName: "PVC Sch 80 (Heavy Wall)",
    description: "Extra-heavy wall PVC for areas subject to physical damage. Has smaller internal diameter.",
  },
  {
    type: "rmc",
    name: "Rigid Metal Conduit (RMC / GRC)",
    shortName: "Rigid Metal (RMC)",
    description: "Heavy-wall galvanized steel conduit for maximum mechanical protection and hazardous locations.",
  },
  {
    type: "fmc",
    name: "Flexible Metal Conduit (FMC)",
    shortName: "Flex / Greenfield",
    description: "Helically wound flexible steel/aluminum conduit for equipment connections and motor vibrations.",
  },
  {
    type: "lfmc",
    name: "Liquidtight Flexible Metal Conduit (LFMC)",
    shortName: "Liquidtight Flex (Sealtite)",
    description: "Flexible metallic conduit with waterproof outer jacket for wet outdoor A/C units and pumps.",
  },
] as const;

/**
 * NEC Chapter 9 Table 4: Dimensions and Percent Area of Conduit and Tubing (in square inches).
 */
export const NEC_CONDUIT_TABLE_4: Record<ConduitType, Record<ConduitTradeSize, ConduitTradeSizeData>> = {
  emt: {
    "1/2": { tradeSize: "1/2", internalDiameterInches: 0.622, totalInternalAreaSqIn: 0.304, area1Wire53Pct: 0.161, area2Wire31Pct: 0.094, areaOver2Wire40Pct: 0.122, areaNipple60Pct: 0.182 },
    "3/4": { tradeSize: "3/4", internalDiameterInches: 0.824, totalInternalAreaSqIn: 0.533, area1Wire53Pct: 0.283, area2Wire31Pct: 0.165, areaOver2Wire40Pct: 0.213, areaNipple60Pct: 0.320 },
    "1": { tradeSize: "1", internalDiameterInches: 1.049, totalInternalAreaSqIn: 0.864, area1Wire53Pct: 0.458, area2Wire31Pct: 0.268, areaOver2Wire40Pct: 0.346, areaNipple60Pct: 0.518 },
    "1-1/4": { tradeSize: "1-1/4", internalDiameterInches: 1.380, totalInternalAreaSqIn: 1.496, area1Wire53Pct: 0.793, area2Wire31Pct: 0.464, areaOver2Wire40Pct: 0.598, areaNipple60Pct: 0.898 },
    "1-1/2": { tradeSize: "1-1/2", internalDiameterInches: 1.610, totalInternalAreaSqIn: 2.036, area1Wire53Pct: 1.079, area2Wire31Pct: 0.631, areaOver2Wire40Pct: 0.814, areaNipple60Pct: 1.222 },
    "2": { tradeSize: "2", internalDiameterInches: 2.067, totalInternalAreaSqIn: 3.356, area1Wire53Pct: 1.779, area2Wire31Pct: 1.040, areaOver2Wire40Pct: 1.342, areaNipple60Pct: 2.014 },
    "2-1/2": { tradeSize: "2-1/2", internalDiameterInches: 2.731, totalInternalAreaSqIn: 5.858, area1Wire53Pct: 3.105, area2Wire31Pct: 1.816, areaOver2Wire40Pct: 2.343, areaNipple60Pct: 3.515 },
    "3": { tradeSize: "3", internalDiameterInches: 3.356, totalInternalAreaSqIn: 8.846, area1Wire53Pct: 4.688, area2Wire31Pct: 2.742, areaOver2Wire40Pct: 3.538, areaNipple60Pct: 5.308 },
    "3-1/2": { tradeSize: "3-1/2", internalDiameterInches: 3.834, totalInternalAreaSqIn: 11.545, area1Wire53Pct: 6.119, area2Wire31Pct: 3.579, areaOver2Wire40Pct: 4.618, areaNipple60Pct: 6.927 },
    "4": { tradeSize: "4", internalDiameterInches: 4.334, totalInternalAreaSqIn: 14.752, area1Wire53Pct: 7.819, area2Wire31Pct: 4.573, areaOver2Wire40Pct: 5.901, areaNipple60Pct: 8.851 },
  },
  pvc_sch40: {
    "1/2": { tradeSize: "1/2", internalDiameterInches: 0.602, totalInternalAreaSqIn: 0.285, area1Wire53Pct: 0.151, area2Wire31Pct: 0.088, areaOver2Wire40Pct: 0.114, areaNipple60Pct: 0.171 },
    "3/4": { tradeSize: "3/4", internalDiameterInches: 0.804, totalInternalAreaSqIn: 0.508, area1Wire53Pct: 0.269, area2Wire31Pct: 0.157, areaOver2Wire40Pct: 0.203, areaNipple60Pct: 0.305 },
    "1": { tradeSize: "1", internalDiameterInches: 1.029, totalInternalAreaSqIn: 0.832, area1Wire53Pct: 0.441, area2Wire31Pct: 0.258, areaOver2Wire40Pct: 0.333, areaNipple60Pct: 0.499 },
    "1-1/4": { tradeSize: "1-1/4", internalDiameterInches: 1.360, totalInternalAreaSqIn: 1.453, area1Wire53Pct: 0.770, area2Wire31Pct: 0.450, areaOver2Wire40Pct: 0.581, areaNipple60Pct: 0.872 },
    "1-1/2": { tradeSize: "1-1/2", internalDiameterInches: 1.590, totalInternalAreaSqIn: 1.986, area1Wire53Pct: 1.053, area2Wire31Pct: 0.616, areaOver2Wire40Pct: 0.794, areaNipple60Pct: 1.192 },
    "2": { tradeSize: "2", internalDiameterInches: 2.047, totalInternalAreaSqIn: 3.291, area1Wire53Pct: 1.744, area2Wire31Pct: 1.020, areaOver2Wire40Pct: 1.316, areaNipple60Pct: 1.975 },
    "2-1/2": { tradeSize: "2-1/2", internalDiameterInches: 2.445, totalInternalAreaSqIn: 4.695, area1Wire53Pct: 2.488, area2Wire31Pct: 1.455, areaOver2Wire40Pct: 1.878, areaNipple60Pct: 2.817 },
    "3": { tradeSize: "3", internalDiameterInches: 3.042, totalInternalAreaSqIn: 7.268, area1Wire53Pct: 3.852, area2Wire31Pct: 2.253, areaOver2Wire40Pct: 2.907, areaNipple60Pct: 4.361 },
    "3-1/2": { tradeSize: "3-1/2", internalDiameterInches: 3.521, totalInternalAreaSqIn: 9.737, area1Wire53Pct: 5.161, area2Wire31Pct: 3.018, areaOver2Wire40Pct: 3.895, areaNipple60Pct: 5.842 },
    "4": { tradeSize: "4", internalDiameterInches: 3.998, totalInternalAreaSqIn: 12.554, area1Wire53Pct: 6.654, area2Wire31Pct: 3.892, areaOver2Wire40Pct: 5.022, areaNipple60Pct: 7.532 },
  },
  pvc_sch80: {
    "1/2": { tradeSize: "1/2", internalDiameterInches: 0.526, totalInternalAreaSqIn: 0.217, area1Wire53Pct: 0.115, area2Wire31Pct: 0.067, areaOver2Wire40Pct: 0.087, areaNipple60Pct: 0.130 },
    "3/4": { tradeSize: "3/4", internalDiameterInches: 0.722, totalInternalAreaSqIn: 0.409, area1Wire53Pct: 0.217, area2Wire31Pct: 0.127, areaOver2Wire40Pct: 0.164, areaNipple60Pct: 0.245 },
    "1": { tradeSize: "1", internalDiameterInches: 0.936, totalInternalAreaSqIn: 0.688, area1Wire53Pct: 0.365, area2Wire31Pct: 0.213, areaOver2Wire40Pct: 0.275, areaNipple60Pct: 0.413 },
    "1-1/4": { tradeSize: "1-1/4", internalDiameterInches: 1.255, totalInternalAreaSqIn: 1.237, area1Wire53Pct: 0.656, area2Wire31Pct: 0.383, areaOver2Wire40Pct: 0.495, areaNipple60Pct: 0.742 },
    "1-1/2": { tradeSize: "1-1/2", internalDiameterInches: 1.476, totalInternalAreaSqIn: 1.711, area1Wire53Pct: 0.907, area2Wire31Pct: 0.530, areaOver2Wire40Pct: 0.684, areaNipple60Pct: 1.027 },
    "2": { tradeSize: "2", internalDiameterInches: 1.913, totalInternalAreaSqIn: 2.874, area1Wire53Pct: 1.523, area2Wire31Pct: 0.891, areaOver2Wire40Pct: 1.150, areaNipple60Pct: 1.724 },
    "2-1/2": { tradeSize: "2-1/2", internalDiameterInches: 2.290, totalInternalAreaSqIn: 4.119, area1Wire53Pct: 2.183, area2Wire31Pct: 1.277, areaOver2Wire40Pct: 1.648, areaNipple60Pct: 2.471 },
    "3": { tradeSize: "3", internalDiameterInches: 2.864, totalInternalAreaSqIn: 6.442, area1Wire53Pct: 3.414, area2Wire31Pct: 1.997, areaOver2Wire40Pct: 2.577, areaNipple60Pct: 3.865 },
    "3-1/2": { tradeSize: "3-1/2", internalDiameterInches: 3.326, totalInternalAreaSqIn: 8.688, area1Wire53Pct: 4.605, area2Wire31Pct: 2.693, areaOver2Wire40Pct: 3.475, areaNipple60Pct: 5.213 },
    "4": { tradeSize: "4", internalDiameterInches: 3.786, totalInternalAreaSqIn: 11.258, area1Wire53Pct: 5.967, area2Wire31Pct: 3.490, areaOver2Wire40Pct: 4.503, areaNipple60Pct: 6.755 },
  },
  rmc: {
    "1/2": { tradeSize: "1/2", internalDiameterInches: 0.632, totalInternalAreaSqIn: 0.314, area1Wire53Pct: 0.166, area2Wire31Pct: 0.097, areaOver2Wire40Pct: 0.126, areaNipple60Pct: 0.188 },
    "3/4": { tradeSize: "3/4", internalDiameterInches: 0.836, totalInternalAreaSqIn: 0.549, area1Wire53Pct: 0.291, area2Wire31Pct: 0.170, areaOver2Wire40Pct: 0.220, areaNipple60Pct: 0.329 },
    "1": { tradeSize: "1", internalDiameterInches: 1.063, totalInternalAreaSqIn: 0.887, area1Wire53Pct: 0.470, area2Wire31Pct: 0.275, areaOver2Wire40Pct: 0.355, areaNipple60Pct: 0.532 },
    "1-1/4": { tradeSize: "1-1/4", internalDiameterInches: 1.394, totalInternalAreaSqIn: 1.526, area1Wire53Pct: 0.809, area2Wire31Pct: 0.473, areaOver2Wire40Pct: 0.610, areaNipple60Pct: 0.916 },
    "1-1/2": { tradeSize: "1-1/2", internalDiameterInches: 1.624, totalInternalAreaSqIn: 2.071, area1Wire53Pct: 1.098, area2Wire31Pct: 0.642, areaOver2Wire40Pct: 0.828, areaNipple60Pct: 1.243 },
    "2": { tradeSize: "2", internalDiameterInches: 2.083, totalInternalAreaSqIn: 3.408, area1Wire53Pct: 1.806, area2Wire31Pct: 1.056, areaOver2Wire40Pct: 1.363, areaNipple60Pct: 2.045 },
    "2-1/2": { tradeSize: "2-1/2", internalDiameterInches: 2.489, totalInternalAreaSqIn: 4.866, area1Wire53Pct: 2.579, area2Wire31Pct: 1.508, areaOver2Wire40Pct: 1.946, areaNipple60Pct: 2.920 },
    "3": { tradeSize: "3", internalDiameterInches: 3.090, totalInternalAreaSqIn: 7.499, area1Wire53Pct: 3.974, area2Wire31Pct: 2.325, areaOver2Wire40Pct: 3.000, areaNipple60Pct: 4.499 },
    "3-1/2": { tradeSize: "3-1/2", internalDiameterInches: 3.570, totalInternalAreaSqIn: 10.010, area1Wire53Pct: 5.305, area2Wire31Pct: 3.103, areaOver2Wire40Pct: 4.004, areaNipple60Pct: 6.006 },
    "4": { tradeSize: "4", internalDiameterInches: 4.050, totalInternalAreaSqIn: 12.882, area1Wire53Pct: 6.827, area2Wire31Pct: 3.993, areaOver2Wire40Pct: 5.153, areaNipple60Pct: 7.729 },
  },
  fmc: {
    "1/2": { tradeSize: "1/2", internalDiameterInches: 0.625, totalInternalAreaSqIn: 0.307, area1Wire53Pct: 0.163, area2Wire31Pct: 0.095, areaOver2Wire40Pct: 0.123, areaNipple60Pct: 0.184 },
    "3/4": { tradeSize: "3/4", internalDiameterInches: 0.812, totalInternalAreaSqIn: 0.518, area1Wire53Pct: 0.275, area2Wire31Pct: 0.161, areaOver2Wire40Pct: 0.207, areaNipple60Pct: 0.311 },
    "1": { tradeSize: "1", internalDiameterInches: 1.000, totalInternalAreaSqIn: 0.785, area1Wire53Pct: 0.416, area2Wire31Pct: 0.243, areaOver2Wire40Pct: 0.314, areaNipple60Pct: 0.471 },
    "1-1/4": { tradeSize: "1-1/4", internalDiameterInches: 1.250, totalInternalAreaSqIn: 1.227, area1Wire53Pct: 0.650, area2Wire31Pct: 0.380, areaOver2Wire40Pct: 0.491, areaNipple60Pct: 0.736 },
    "1-1/2": { tradeSize: "1-1/2", internalDiameterInches: 1.500, totalInternalAreaSqIn: 1.767, area1Wire53Pct: 0.937, area2Wire31Pct: 0.548, areaOver2Wire40Pct: 0.707, areaNipple60Pct: 1.060 },
    "2": { tradeSize: "2", internalDiameterInches: 2.000, totalInternalAreaSqIn: 3.142, area1Wire53Pct: 1.665, area2Wire31Pct: 0.974, areaOver2Wire40Pct: 1.257, areaNipple60Pct: 1.885 },
    "2-1/2": { tradeSize: "2-1/2", internalDiameterInches: 2.500, totalInternalAreaSqIn: 4.909, area1Wire53Pct: 2.602, area2Wire31Pct: 1.522, areaOver2Wire40Pct: 1.964, areaNipple60Pct: 2.945 },
    "3": { tradeSize: "3", internalDiameterInches: 3.000, totalInternalAreaSqIn: 7.069, area1Wire53Pct: 3.747, area2Wire31Pct: 2.191, areaOver2Wire40Pct: 2.828, areaNipple60Pct: 4.241 },
    "3-1/2": { tradeSize: "3-1/2", internalDiameterInches: 3.500, totalInternalAreaSqIn: 9.621, area1Wire53Pct: 5.099, area2Wire31Pct: 2.983, areaOver2Wire40Pct: 3.848, areaNipple60Pct: 5.773 },
    "4": { tradeSize: "4", internalDiameterInches: 4.000, totalInternalAreaSqIn: 12.566, area1Wire53Pct: 6.660, area2Wire31Pct: 3.895, areaOver2Wire40Pct: 5.026, areaNipple60Pct: 7.540 },
  },
  lfmc: {
    "1/2": { tradeSize: "1/2", internalDiameterInches: 0.622, totalInternalAreaSqIn: 0.304, area1Wire53Pct: 0.161, area2Wire31Pct: 0.094, areaOver2Wire40Pct: 0.122, areaNipple60Pct: 0.182 },
    "3/4": { tradeSize: "3/4", internalDiameterInches: 0.820, totalInternalAreaSqIn: 0.528, area1Wire53Pct: 0.280, area2Wire31Pct: 0.164, areaOver2Wire40Pct: 0.211, areaNipple60Pct: 0.317 },
    "1": { tradeSize: "1", internalDiameterInches: 1.041, totalInternalAreaSqIn: 0.851, area1Wire53Pct: 0.451, area2Wire31Pct: 0.264, areaOver2Wire40Pct: 0.340, areaNipple60Pct: 0.511 },
    "1-1/4": { tradeSize: "1-1/4", internalDiameterInches: 1.380, totalInternalAreaSqIn: 1.496, area1Wire53Pct: 0.793, area2Wire31Pct: 0.464, areaOver2Wire40Pct: 0.598, areaNipple60Pct: 0.898 },
    "1-1/2": { tradeSize: "1-1/2", internalDiameterInches: 1.575, totalInternalAreaSqIn: 1.948, area1Wire53Pct: 1.032, area2Wire31Pct: 0.604, areaOver2Wire40Pct: 0.779, areaNipple60Pct: 1.169 },
    "2": { tradeSize: "2", internalDiameterInches: 2.020, totalInternalAreaSqIn: 3.205, area1Wire53Pct: 1.699, area2Wire31Pct: 0.994, areaOver2Wire40Pct: 1.282, areaNipple60Pct: 1.923 },
    "2-1/2": { tradeSize: "2-1/2", internalDiameterInches: 2.480, totalInternalAreaSqIn: 4.831, area1Wire53Pct: 2.560, area2Wire31Pct: 1.498, areaOver2Wire40Pct: 1.932, areaNipple60Pct: 2.899 },
    "3": { tradeSize: "3", internalDiameterInches: 3.070, totalInternalAreaSqIn: 7.402, area1Wire53Pct: 3.923, area2Wire31Pct: 2.295, areaOver2Wire40Pct: 2.961, areaNipple60Pct: 4.441 },
    "3-1/2": { tradeSize: "3-1/2", internalDiameterInches: 3.500, totalInternalAreaSqIn: 9.621, area1Wire53Pct: 5.099, area2Wire31Pct: 2.983, areaOver2Wire40Pct: 3.848, areaNipple60Pct: 5.773 },
    "4": { tradeSize: "4", internalDiameterInches: 4.000, totalInternalAreaSqIn: 12.566, area1Wire53Pct: 6.660, area2Wire31Pct: 3.895, areaOver2Wire40Pct: 5.026, areaNipple60Pct: 7.540 },
  },
};

export const CONDUIT_TRADE_SIZES_ORDERED: readonly ConduitTradeSize[] = [
  "1/2",
  "3/4",
  "1",
  "1-1/4",
  "1-1/2",
  "2",
  "2-1/2",
  "3",
  "3-1/2",
  "4",
];

/**
 * NEC Chapter 9 Table 5: Dimensions of Insulated Conductors and Fixture Wires (in square inches).
 */
export const NEC_CONDUCTOR_TABLE_5: Record<ConductorInsulation, Record<WireGaugeSize, ConductorDimensionData>> = {
  thhn: {
    "14 AWG": { size: "14 AWG", insulation: "thhn", approxDiameterInches: 0.111, crossSectionalAreaSqIn: 0.0097 },
    "12 AWG": { size: "12 AWG", insulation: "thhn", approxDiameterInches: 0.130, crossSectionalAreaSqIn: 0.0133 },
    "10 AWG": { size: "10 AWG", insulation: "thhn", approxDiameterInches: 0.164, crossSectionalAreaSqIn: 0.0211 },
    "8 AWG": { size: "8 AWG", insulation: "thhn", approxDiameterInches: 0.216, crossSectionalAreaSqIn: 0.0366 },
    "6 AWG": { size: "6 AWG", insulation: "thhn", approxDiameterInches: 0.254, crossSectionalAreaSqIn: 0.0507 },
    "4 AWG": { size: "4 AWG", insulation: "thhn", approxDiameterInches: 0.324, crossSectionalAreaSqIn: 0.0824 },
    "3 AWG": { size: "3 AWG", insulation: "thhn", approxDiameterInches: 0.352, crossSectionalAreaSqIn: 0.0973 },
    "2 AWG": { size: "2 AWG", insulation: "thhn", approxDiameterInches: 0.384, crossSectionalAreaSqIn: 0.1158 },
    "1 AWG": { size: "1 AWG", insulation: "thhn", approxDiameterInches: 0.446, crossSectionalAreaSqIn: 0.1562 },
    "1/0 AWG": { size: "1/0 AWG", insulation: "thhn", approxDiameterInches: 0.486, crossSectionalAreaSqIn: 0.1855 },
    "2/0 AWG": { size: "2/0 AWG", insulation: "thhn", approxDiameterInches: 0.532, crossSectionalAreaSqIn: 0.2223 },
    "3/0 AWG": { size: "3/0 AWG", insulation: "thhn", approxDiameterInches: 0.584, crossSectionalAreaSqIn: 0.2679 },
    "4/0 AWG": { size: "4/0 AWG", insulation: "thhn", approxDiameterInches: 0.642, crossSectionalAreaSqIn: 0.3237 },
    "250 kcmil": { size: "250 kcmil", insulation: "thhn", approxDiameterInches: 0.711, crossSectionalAreaSqIn: 0.3970 },
    "300 kcmil": { size: "300 kcmil", insulation: "thhn", approxDiameterInches: 0.766, crossSectionalAreaSqIn: 0.4608 },
    "350 kcmil": { size: "350 kcmil", insulation: "thhn", approxDiameterInches: 0.817, crossSectionalAreaSqIn: 0.5242 },
    "400 kcmil": { size: "400 kcmil", insulation: "thhn", approxDiameterInches: 0.864, crossSectionalAreaSqIn: 0.5863 },
    "500 kcmil": { size: "500 kcmil", insulation: "thhn", approxDiameterInches: 0.949, crossSectionalAreaSqIn: 0.7073 },
    "600 kcmil": { size: "600 kcmil", insulation: "thhn", approxDiameterInches: 1.051, crossSectionalAreaSqIn: 0.8676 },
    "750 kcmil": { size: "750 kcmil", insulation: "thhn", approxDiameterInches: 1.152, crossSectionalAreaSqIn: 1.0423 },
    "1000 kcmil": { size: "1000 kcmil", insulation: "thhn", approxDiameterInches: 1.304, crossSectionalAreaSqIn: 1.3355 },
  },
  xhhw: {
    "14 AWG": { size: "14 AWG", insulation: "xhhw", approxDiameterInches: 0.133, crossSectionalAreaSqIn: 0.0139 },
    "12 AWG": { size: "12 AWG", insulation: "xhhw", approxDiameterInches: 0.152, crossSectionalAreaSqIn: 0.0181 },
    "10 AWG": { size: "10 AWG", insulation: "xhhw", approxDiameterInches: 0.176, crossSectionalAreaSqIn: 0.0243 },
    "8 AWG": { size: "8 AWG", insulation: "xhhw", approxDiameterInches: 0.236, crossSectionalAreaSqIn: 0.0437 },
    "6 AWG": { size: "6 AWG", insulation: "xhhw", approxDiameterInches: 0.274, crossSectionalAreaSqIn: 0.0590 },
    "4 AWG": { size: "4 AWG", insulation: "xhhw", approxDiameterInches: 0.322, crossSectionalAreaSqIn: 0.0814 },
    "3 AWG": { size: "3 AWG", insulation: "xhhw", approxDiameterInches: 0.350, crossSectionalAreaSqIn: 0.0962 },
    "2 AWG": { size: "2 AWG", insulation: "xhhw", approxDiameterInches: 0.382, crossSectionalAreaSqIn: 0.1146 },
    "1 AWG": { size: "1 AWG", insulation: "xhhw", approxDiameterInches: 0.442, crossSectionalAreaSqIn: 0.1534 },
    "1/0 AWG": { size: "1/0 AWG", insulation: "xhhw", approxDiameterInches: 0.482, crossSectionalAreaSqIn: 0.1825 },
    "2/0 AWG": { size: "2/0 AWG", insulation: "xhhw", approxDiameterInches: 0.528, crossSectionalAreaSqIn: 0.2190 },
    "3/0 AWG": { size: "3/0 AWG", insulation: "xhhw", approxDiameterInches: 0.580, crossSectionalAreaSqIn: 0.2642 },
    "4/0 AWG": { size: "4/0 AWG", insulation: "xhhw", approxDiameterInches: 0.638, crossSectionalAreaSqIn: 0.3197 },
    "250 kcmil": { size: "250 kcmil", insulation: "xhhw", approxDiameterInches: 0.707, crossSectionalAreaSqIn: 0.3926 },
    "300 kcmil": { size: "300 kcmil", insulation: "xhhw", approxDiameterInches: 0.762, crossSectionalAreaSqIn: 0.4560 },
    "350 kcmil": { size: "350 kcmil", insulation: "xhhw", approxDiameterInches: 0.813, crossSectionalAreaSqIn: 0.5191 },
    "400 kcmil": { size: "400 kcmil", insulation: "xhhw", approxDiameterInches: 0.860, crossSectionalAreaSqIn: 0.5809 },
    "500 kcmil": { size: "500 kcmil", insulation: "xhhw", approxDiameterInches: 0.945, crossSectionalAreaSqIn: 0.7014 },
    "600 kcmil": { size: "600 kcmil", insulation: "xhhw", approxDiameterInches: 1.060, crossSectionalAreaSqIn: 0.8825 },
    "750 kcmil": { size: "750 kcmil", insulation: "xhhw", approxDiameterInches: 1.161, crossSectionalAreaSqIn: 1.0587 },
    "1000 kcmil": { size: "1000 kcmil", insulation: "xhhw", approxDiameterInches: 1.313, crossSectionalAreaSqIn: 1.3540 },
  },
  use_rhw: {
    "14 AWG": { size: "14 AWG", insulation: "use_rhw", approxDiameterInches: 0.163, crossSectionalAreaSqIn: 0.0209 },
    "12 AWG": { size: "12 AWG", insulation: "use_rhw", approxDiameterInches: 0.182, crossSectionalAreaSqIn: 0.0260 },
    "10 AWG": { size: "10 AWG", insulation: "use_rhw", approxDiameterInches: 0.206, crossSectionalAreaSqIn: 0.0333 },
    "8 AWG": { size: "8 AWG", insulation: "use_rhw", approxDiameterInches: 0.266, crossSectionalAreaSqIn: 0.0556 },
    "6 AWG": { size: "6 AWG", insulation: "use_rhw", approxDiameterInches: 0.304, crossSectionalAreaSqIn: 0.0726 },
    "4 AWG": { size: "4 AWG", insulation: "use_rhw", approxDiameterInches: 0.352, crossSectionalAreaSqIn: 0.0973 },
    "3 AWG": { size: "3 AWG", insulation: "use_rhw", approxDiameterInches: 0.380, crossSectionalAreaSqIn: 0.1134 },
    "2 AWG": { size: "2 AWG", insulation: "use_rhw", approxDiameterInches: 0.412, crossSectionalAreaSqIn: 0.1333 },
    "1 AWG": { size: "1 AWG", insulation: "use_rhw", approxDiameterInches: 0.492, crossSectionalAreaSqIn: 0.1901 },
    "1/0 AWG": { size: "1/0 AWG", insulation: "use_rhw", approxDiameterInches: 0.532, crossSectionalAreaSqIn: 0.2223 },
    "2/0 AWG": { size: "2/0 AWG", insulation: "use_rhw", approxDiameterInches: 0.578, crossSectionalAreaSqIn: 0.2624 },
    "3/0 AWG": { size: "3/0 AWG", insulation: "use_rhw", approxDiameterInches: 0.630, crossSectionalAreaSqIn: 0.3117 },
    "4/0 AWG": { size: "4/0 AWG", insulation: "use_rhw", approxDiameterInches: 0.688, crossSectionalAreaSqIn: 0.3718 },
    "250 kcmil": { size: "250 kcmil", insulation: "use_rhw", approxDiameterInches: 0.777, crossSectionalAreaSqIn: 0.4741 },
    "300 kcmil": { size: "300 kcmil", insulation: "use_rhw", approxDiameterInches: 0.832, crossSectionalAreaSqIn: 0.5437 },
    "350 kcmil": { size: "350 kcmil", insulation: "use_rhw", approxDiameterInches: 0.883, crossSectionalAreaSqIn: 0.6124 },
    "400 kcmil": { size: "400 kcmil", insulation: "use_rhw", approxDiameterInches: 0.930, crossSectionalAreaSqIn: 0.6793 },
    "500 kcmil": { size: "500 kcmil", insulation: "use_rhw", approxDiameterInches: 1.015, crossSectionalAreaSqIn: 0.8091 },
    "600 kcmil": { size: "600 kcmil", insulation: "use_rhw", approxDiameterInches: 1.130, crossSectionalAreaSqIn: 1.0029 },
    "750 kcmil": { size: "750 kcmil", insulation: "use_rhw", approxDiameterInches: 1.231, crossSectionalAreaSqIn: 1.1902 },
    "1000 kcmil": { size: "1000 kcmil", insulation: "use_rhw", approxDiameterInches: 1.383, crossSectionalAreaSqIn: 1.5022 },
  },
  bare_copper: {
    "14 AWG": { size: "14 AWG", insulation: "bare_copper", approxDiameterInches: 0.064, crossSectionalAreaSqIn: 0.0032 },
    "12 AWG": { size: "12 AWG", insulation: "bare_copper", approxDiameterInches: 0.081, crossSectionalAreaSqIn: 0.0051 },
    "10 AWG": { size: "10 AWG", insulation: "bare_copper", approxDiameterInches: 0.102, crossSectionalAreaSqIn: 0.0082 },
    "8 AWG": { size: "8 AWG", insulation: "bare_copper", approxDiameterInches: 0.129, crossSectionalAreaSqIn: 0.0130 },
    "6 AWG": { size: "6 AWG", insulation: "bare_copper", approxDiameterInches: 0.162, crossSectionalAreaSqIn: 0.0206 },
    "4 AWG": { size: "4 AWG", insulation: "bare_copper", approxDiameterInches: 0.204, crossSectionalAreaSqIn: 0.0328 },
    "3 AWG": { size: "3 AWG", insulation: "bare_copper", approxDiameterInches: 0.229, crossSectionalAreaSqIn: 0.0412 },
    "2 AWG": { size: "2 AWG", insulation: "bare_copper", approxDiameterInches: 0.258, crossSectionalAreaSqIn: 0.0521 },
    "1 AWG": { size: "1 AWG", insulation: "bare_copper", approxDiameterInches: 0.289, crossSectionalAreaSqIn: 0.0658 },
    "1/0 AWG": { size: "1/0 AWG", insulation: "bare_copper", approxDiameterInches: 0.325, crossSectionalAreaSqIn: 0.0829 },
    "2/0 AWG": { size: "2/0 AWG", insulation: "bare_copper", approxDiameterInches: 0.365, crossSectionalAreaSqIn: 0.1046 },
    "3/0 AWG": { size: "3/0 AWG", insulation: "bare_copper", approxDiameterInches: 0.410, crossSectionalAreaSqIn: 0.1319 },
    "4/0 AWG": { size: "4/0 AWG", insulation: "bare_copper", approxDiameterInches: 0.460, crossSectionalAreaSqIn: 0.1662 },
    "250 kcmil": { size: "250 kcmil", insulation: "bare_copper", approxDiameterInches: 0.500, crossSectionalAreaSqIn: 0.1963 },
    "300 kcmil": { size: "300 kcmil", insulation: "bare_copper", approxDiameterInches: 0.548, crossSectionalAreaSqIn: 0.2356 },
    "350 kcmil": { size: "350 kcmil", insulation: "bare_copper", approxDiameterInches: 0.592, crossSectionalAreaSqIn: 0.2749 },
    "400 kcmil": { size: "400 kcmil", insulation: "bare_copper", approxDiameterInches: 0.632, crossSectionalAreaSqIn: 0.3142 },
    "500 kcmil": { size: "500 kcmil", insulation: "bare_copper", approxDiameterInches: 0.707, crossSectionalAreaSqIn: 0.3927 },
    "600 kcmil": { size: "600 kcmil", insulation: "bare_copper", approxDiameterInches: 0.775, crossSectionalAreaSqIn: 0.4712 },
    "750 kcmil": { size: "750 kcmil", insulation: "bare_copper", approxDiameterInches: 0.866, crossSectionalAreaSqIn: 0.5890 },
    "1000 kcmil": { size: "1000 kcmil", insulation: "bare_copper", approxDiameterInches: 1.000, crossSectionalAreaSqIn: 0.7854 },
  },
};

export function getConduitTradeSizeData(
  type: ConduitType,
  tradeSize: ConduitTradeSize
): ConduitTradeSizeData {
  return NEC_CONDUIT_TABLE_4[type][tradeSize];
}

export function getConductorDimensionData(
  size: WireGaugeSize,
  insulation: ConductorInsulation = "thhn"
): ConductorDimensionData {
  return (
    NEC_CONDUCTOR_TABLE_5[insulation]?.[size] ??
    NEC_CONDUCTOR_TABLE_5.thhn[size] ??
    NEC_CONDUCTOR_TABLE_5.thhn["12 AWG"]
  );
}
