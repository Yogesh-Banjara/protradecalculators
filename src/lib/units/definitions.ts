import type {
  LengthUnit,
  AreaUnit,
  VolumeUnit,
  WeightUnit,
  AngleUnit,
  TemperatureUnit,
  PressureUnit,
  EnergyUnit,
  PowerUnit,
  CurrencyCode,
  UnitDefinition,
} from "@/types/units";

export const LENGTH_DEFINITIONS: Readonly<Record<LengthUnit, UnitDefinition>> = {
  inch: {
    id: "inch",
    name: "inch",
    plural: "inches",
    symbol: "in",
    system: "imperial",
    category: "length",
    toBase: 0.0254, // 1 in = 0.0254 m (exact)
  },
  foot: {
    id: "foot",
    name: "foot",
    plural: "feet",
    symbol: "ft",
    system: "imperial",
    category: "length",
    toBase: 0.3048, // 1 ft = 0.3048 m (exact)
  },
  yard: {
    id: "yard",
    name: "yard",
    plural: "yards",
    symbol: "yd",
    system: "imperial",
    category: "length",
    toBase: 0.9144, // 1 yd = 0.9144 m (exact)
  },
  millimeter: {
    id: "millimeter",
    name: "millimeter",
    plural: "millimeters",
    symbol: "mm",
    system: "metric",
    category: "length",
    toBase: 0.001,
  },
  centimeter: {
    id: "centimeter",
    name: "centimeter",
    plural: "centimeters",
    symbol: "cm",
    system: "metric",
    category: "length",
    toBase: 0.01,
  },
  meter: {
    id: "meter",
    name: "meter",
    plural: "meters",
    symbol: "m",
    system: "metric",
    category: "length",
    toBase: 1.0,
  },
};

export const AREA_DEFINITIONS: Readonly<Record<AreaUnit, UnitDefinition>> = {
  "square-inch": {
    id: "square-inch",
    name: "square inch",
    plural: "square inches",
    symbol: "sq in",
    system: "imperial",
    category: "area",
    toBase: 0.00064516, // 0.0254^2
  },
  "square-foot": {
    id: "square-foot",
    name: "square foot",
    plural: "square feet",
    symbol: "sq ft",
    system: "imperial",
    category: "area",
    toBase: 0.09290304, // 0.3048^2
  },
  "square-yard": {
    id: "square-yard",
    name: "square yard",
    plural: "square yards",
    symbol: "sq yd",
    system: "imperial",
    category: "area",
    toBase: 0.83612736, // 0.9144^2
  },
  "square-meter": {
    id: "square-meter",
    name: "square meter",
    plural: "square meters",
    symbol: "sq m",
    system: "metric",
    category: "area",
    toBase: 1.0,
  },
};

export const VOLUME_DEFINITIONS: Readonly<Record<VolumeUnit, UnitDefinition>> = {
  "cubic-inch": {
    id: "cubic-inch",
    name: "cubic inch",
    plural: "cubic inches",
    symbol: "cu in",
    system: "imperial",
    category: "volume",
    toBase: 0.000016387064, // 0.0254^3
  },
  "cubic-foot": {
    id: "cubic-foot",
    name: "cubic foot",
    plural: "cubic feet",
    symbol: "cu ft",
    system: "imperial",
    category: "volume",
    toBase: 0.028316846592, // 0.3048^3
  },
  "cubic-yard": {
    id: "cubic-yard",
    name: "cubic yard",
    plural: "cubic yards",
    symbol: "cu yd",
    system: "imperial",
    category: "volume",
    toBase: 0.764554857984, // 0.9144^3
  },
  "cubic-meter": {
    id: "cubic-meter",
    name: "cubic meter",
    plural: "cubic meters",
    symbol: "m³",
    system: "metric",
    category: "volume",
    toBase: 1.0,
  },
  liter: {
    id: "liter",
    name: "liter",
    plural: "liters",
    symbol: "L",
    system: "metric",
    category: "volume",
    toBase: 0.001,
  },
  gallon: {
    id: "gallon",
    name: "gallon",
    plural: "gallons",
    symbol: "gal",
    system: "imperial",
    category: "volume",
    toBase: 0.003785411784, // US liquid gallon
  },
};

export const WEIGHT_DEFINITIONS: Readonly<Record<WeightUnit, UnitDefinition>> = {
  ounce: {
    id: "ounce",
    name: "ounce",
    plural: "ounces",
    symbol: "oz",
    system: "imperial",
    category: "weight",
    toBase: 0.028349523125, // avoirdupois ounce
  },
  pound: {
    id: "pound",
    name: "pound",
    plural: "pounds",
    symbol: "lbs",
    system: "imperial",
    category: "weight",
    toBase: 0.45359237, // exact definition of lb
  },
  kilogram: {
    id: "kilogram",
    name: "kilogram",
    plural: "kilograms",
    symbol: "kg",
    system: "metric",
    category: "weight",
    toBase: 1.0,
  },
  "metric-ton": {
    id: "metric-ton",
    name: "metric ton",
    plural: "metric tons",
    symbol: "t",
    system: "metric",
    category: "weight",
    toBase: 1000.0,
  },
  "short-ton": {
    id: "short-ton",
    name: "short ton",
    plural: "short tons",
    symbol: "tons",
    system: "imperial",
    category: "weight",
    toBase: 907.18474, // 2000 lbs
  },
};

export const ANGLE_DEFINITIONS: Readonly<Record<AngleUnit, UnitDefinition>> = {
  degrees: {
    id: "degrees",
    name: "degree",
    plural: "degrees",
    symbol: "°",
    system: "imperial",
    category: "angle",
    toBase: Math.PI / 180,
  },
  radians: {
    id: "radians",
    name: "radian",
    plural: "radians",
    symbol: "rad",
    system: "metric",
    category: "angle",
    toBase: 1.0,
  },
  "percent-grade": {
    id: "percent-grade",
    name: "percent grade",
    plural: "percent grade",
    symbol: "%",
    system: "imperial",
    category: "angle",
    toBase: 0.01,
  },
};

export const TEMPERATURE_DEFINITIONS: Readonly<Record<TemperatureUnit, UnitDefinition>> = {
  celsius: {
    id: "celsius",
    name: "Celsius",
    plural: "degrees Celsius",
    symbol: "°C",
    system: "metric",
    category: "temperature",
    toBase: 1.0,
  },
  fahrenheit: {
    id: "fahrenheit",
    name: "Fahrenheit",
    plural: "degrees Fahrenheit",
    symbol: "°F",
    system: "imperial",
    category: "temperature",
    toBase: 1.0,
  },
  kelvin: {
    id: "kelvin",
    name: "Kelvin",
    plural: "Kelvin",
    symbol: "K",
    system: "metric",
    category: "temperature",
    toBase: 1.0,
  },
};

export const PRESSURE_DEFINITIONS: Readonly<Record<PressureUnit, UnitDefinition>> = {
  psi: {
    id: "psi",
    name: "pounds per square inch",
    plural: "pounds per square inch",
    symbol: "psi",
    system: "imperial",
    category: "pressure",
    toBase: 6894.757293168, // 1 psi in Pascal (exact)
  },
  bar: {
    id: "bar",
    name: "bar",
    plural: "bar",
    symbol: "bar",
    system: "metric",
    category: "pressure",
    toBase: 100000.0, // 1 bar = 100 kPa
  },
  pascal: {
    id: "pascal",
    name: "Pascal",
    plural: "Pascals",
    symbol: "Pa",
    system: "metric",
    category: "pressure",
    toBase: 1.0,
  },
  kilopascal: {
    id: "kilopascal",
    name: "kilopascal",
    plural: "kilopascals",
    symbol: "kPa",
    system: "metric",
    category: "pressure",
    toBase: 1000.0,
  },
  atmosphere: {
    id: "atmosphere",
    name: "standard atmosphere",
    plural: "atmospheres",
    symbol: "atm",
    system: "metric",
    category: "pressure",
    toBase: 101325.0, // 1 atm = 101.325 kPa
  },
};

export const ENERGY_DEFINITIONS: Readonly<Record<EnergyUnit, UnitDefinition>> = {
  joule: {
    id: "joule",
    name: "Joule",
    plural: "Joules",
    symbol: "J",
    system: "metric",
    category: "energy",
    toBase: 1.0,
  },
  kilojoule: {
    id: "kilojoule",
    name: "kilojoule",
    plural: "kilojoules",
    symbol: "kJ",
    system: "metric",
    category: "energy",
    toBase: 1000.0,
  },
  btu: {
    id: "btu",
    name: "British Thermal Unit",
    plural: "BTUs",
    symbol: "BTU",
    system: "imperial",
    category: "energy",
    toBase: 1055.05585262, // 1 BTU (IT) in Joules
  },
  "kilowatt-hour": {
    id: "kilowatt-hour",
    name: "kilowatt-hour",
    plural: "kilowatt-hours",
    symbol: "kWh",
    system: "metric",
    category: "energy",
    toBase: 3600000.0, // 1 kWh = 3.6 MJ
  },
  calorie: {
    id: "calorie",
    name: "thermochemical calorie",
    plural: "calories",
    symbol: "cal",
    system: "metric",
    category: "energy",
    toBase: 4.184, // 1 cal = 4.184 J
  },
};

export const POWER_DEFINITIONS: Readonly<Record<PowerUnit, UnitDefinition>> = {
  watt: {
    id: "watt",
    name: "Watt",
    plural: "Watts",
    symbol: "W",
    system: "metric",
    category: "power",
    toBase: 1.0,
  },
  kilowatt: {
    id: "kilowatt",
    name: "kilowatt",
    plural: "kilowatts",
    symbol: "kW",
    system: "metric",
    category: "power",
    toBase: 1000.0,
  },
  horsepower: {
    id: "horsepower",
    name: "mechanical horsepower",
    plural: "horsepower",
    symbol: "HP",
    system: "imperial",
    category: "power",
    toBase: 745.69987158227022, // 1 HP = 550 ft·lbf/s ≈ 745.7 W
  },
  "btu-per-hour": {
    id: "btu-per-hour",
    name: "BTU per hour",
    plural: "BTU/hr",
    symbol: "BTU/hr",
    system: "imperial",
    category: "power",
    toBase: 0.293071070172222, // 1055.05585262 / 3600
  },
};

export const CURRENCY_SYMBOLS: Readonly<Record<CurrencyCode, { symbol: string; name: string }>> = {
  USD: { symbol: "$", name: "US Dollar" },
  CAD: { symbol: "CA$", name: "Canadian Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
};
