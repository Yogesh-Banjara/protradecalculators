import { describe, it, expect } from "vitest";
import {
  convertTemperature,
  convertPressure,
  convertEnergy,
  convertPower,
} from "@/lib/units/converter";
import { formatCurrency, formatUnit, getUnitSymbol } from "@/lib/units/formatting";

describe("Extended Unit Converters", () => {
  describe("Temperature Conversions", () => {
    it("converts Celsius to Fahrenheit accurately", () => {
      expect(convertTemperature(0, "celsius", "fahrenheit")).toBe(32);
      expect(convertTemperature(100, "celsius", "fahrenheit")).toBe(212);
      expect(convertTemperature(-40, "celsius", "fahrenheit")).toBe(-40);
    });

    it("converts Fahrenheit to Celsius accurately", () => {
      expect(convertTemperature(32, "fahrenheit", "celsius")).toBe(0);
      expect(convertTemperature(212, "fahrenheit", "celsius")).toBe(100);
      expect(convertTemperature(-40, "fahrenheit", "celsius")).toBe(-40);
    });

    it("converts to and from Kelvin", () => {
      expect(convertTemperature(0, "celsius", "kelvin")).toBe(273.15);
      expect(convertTemperature(273.15, "kelvin", "celsius")).toBe(0);
    });

    it("throws when temperature is below absolute zero", () => {
      expect(() => convertTemperature(-274, "celsius", "fahrenheit")).toThrow(RangeError);
      expect(() => convertTemperature(-1, "kelvin", "celsius")).toThrow(RangeError);
    });
  });

  describe("Pressure Conversions", () => {
    it("converts PSI to bar and kilopascal", () => {
      // 100 psi ≈ 6.89476 bar ≈ 689.476 kPa
      expect(convertPressure(100, "psi", "bar")).toBeCloseTo(6.89476, 4);
      expect(convertPressure(100, "psi", "kilopascal")).toBeCloseTo(689.476, 3);
    });

    it("converts atmosphere to kPa and PSI", () => {
      // 1 atm = 101.325 kPa ≈ 14.6959 psi
      expect(convertPressure(1, "atmosphere", "kilopascal")).toBe(101.325);
      expect(convertPressure(1, "atmosphere", "psi")).toBeCloseTo(14.6959, 3);
    });
  });

  describe("Energy Conversions", () => {
    it("converts Joules to Kilojoules and Kilowatt-hours", () => {
      expect(convertEnergy(1000, "joule", "kilojoule")).toBe(1);
      expect(convertEnergy(3600000, "joule", "kilowatt-hour")).toBe(1);
    });

    it("converts BTU to Joules and kWh", () => {
      // 1 BTU ≈ 1055.06 J ≈ 0.00029307 kWh
      expect(convertEnergy(1, "btu", "joule")).toBeCloseTo(1055.056, 3);
      expect(convertEnergy(3412.142, "btu", "kilowatt-hour")).toBeCloseTo(1, 2);
    });
  });

  describe("Power Conversions", () => {
    it("converts Watts to Kilowatts", () => {
      expect(convertPower(1500, "watt", "kilowatt")).toBe(1.5);
    });

    it("converts Horsepower to Watts and kW", () => {
      // 1 HP ≈ 745.7 W
      expect(convertPower(1, "horsepower", "watt")).toBeCloseTo(745.7, 1);
      expect(convertPower(10, "horsepower", "kilowatt")).toBeCloseTo(7.457, 3);
    });

    it("converts BTU/hr to Watts", () => {
      // 12,000 BTU/hr (1 ton AC) ≈ 3516.85 Watts
      expect(convertPower(12000, "btu-per-hour", "watt")).toBeCloseTo(3516.85, 1);
    });
  });

  describe("Currency Formatting", () => {
    it("formats USD currency amounts correctly", () => {
      expect(formatCurrency(1250.5)).toBe("$1,250.50");
      expect(formatCurrency(0)).toBe("$0.00");
      expect(formatCurrency(NaN)).toBe("—");
    });

    it("formats multiple currency codes via formatUnit", () => {
      expect(formatUnit(500, "USD")).toBe("$500.00");
      expect(formatUnit(100, "psi")).toBe("100 psi");
      expect(formatUnit(75, "fahrenheit")).toBe("75°F");
      expect(formatUnit(24, "celsius")).toBe("24°C");
      expect(formatUnit(5, "kilowatt")).toBe("5 kW");
    });

    it("retrieves symbols properly", () => {
      expect(getUnitSymbol("psi")).toBe("psi");
      expect(getUnitSymbol("horsepower")).toBe("HP");
      expect(getUnitSymbol("USD")).toBe("$");
    });
  });
});
