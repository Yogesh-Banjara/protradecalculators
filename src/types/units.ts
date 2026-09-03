export type UnitSystem = "imperial" | "metric";

export type LengthUnit =
  | "inch"
  | "foot"
  | "yard"
  | "millimeter"
  | "centimeter"
  | "meter";

export type AreaUnit =
  | "square-inch"
  | "square-foot"
  | "square-yard"
  | "square-meter";

export type VolumeUnit =
  | "cubic-inch"
  | "cubic-foot"
  | "cubic-yard"
  | "cubic-meter"
  | "liter"
  | "gallon";

export type WeightUnit =
  | "ounce"
  | "pound"
  | "kilogram"
  | "metric-ton"
  | "short-ton";

export type AngleUnit = "degrees" | "radians" | "percent-grade";

export type TemperatureUnit = "celsius" | "fahrenheit" | "kelvin";

export type PressureUnit =
  | "psi"
  | "bar"
  | "pascal"
  | "kilopascal"
  | "atmosphere";

export type EnergyUnit =
  | "joule"
  | "kilojoule"
  | "btu"
  | "kilowatt-hour"
  | "calorie";

export type PowerUnit = "watt" | "kilowatt" | "horsepower" | "btu-per-hour";

export type ElectricalUnit = "volt" | "ampere" | "ohm";

export type CurrencyCode = "USD" | "CAD" | "EUR" | "GBP" | "AUD";

export type UnitCategory =
  | "length"
  | "area"
  | "volume"
  | "weight"
  | "angle"
  | "temperature"
  | "pressure"
  | "energy"
  | "power"
  | "electrical"
  | "currency";

export type AnyUnit =
  | LengthUnit
  | AreaUnit
  | VolumeUnit
  | WeightUnit
  | AngleUnit
  | TemperatureUnit
  | PressureUnit
  | EnergyUnit
  | PowerUnit
  | ElectricalUnit
  | CurrencyCode;

export interface UnitDefinition {
  readonly id: string;
  readonly name: string;
  readonly plural: string;
  readonly symbol: string;
  readonly system: UnitSystem;
  readonly category: UnitCategory;
  /** Multiplier relative to the base SI unit in its category */
  readonly toBase: number;
}

export interface UnitDisplayOptions {
  readonly precision?: number;
  readonly showSymbol?: boolean;
  readonly fractionDenominator?: 2 | 4 | 8 | 16 | 32;
  readonly currency?: CurrencyCode;
}
