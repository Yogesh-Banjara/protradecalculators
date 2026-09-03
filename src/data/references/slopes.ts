export interface StandardSlopeReference {
  readonly id: string;
  readonly label: string;
  readonly application: string;
  readonly risePer12Run: number;
  readonly degrees: number;
  readonly percentGrade: number;
  readonly minOrMax: "min" | "max" | "standard";
}

export const STANDARD_SLOPES: readonly StandardSlopeReference[] = [
  {
    id: "ada-ramp-max",
    label: "ADA Wheelchair Ramp (Maximum)",
    application: "Accessible ramps without mechanical lift",
    risePer12Run: 1.0, // 1:12 slope
    degrees: 4.76,
    percentGrade: 8.33,
    minOrMax: "max",
  },
  {
    id: "pipe-drain-quarter-inch",
    label: "Sewer / Drainage Pipe (Standard Minimum)",
    application: "Standard building drain lines (4\" pipe)",
    risePer12Run: 0.25, // 1/4" per foot
    degrees: 1.19,
    percentGrade: 2.08,
    minOrMax: "min",
  },
  {
    id: "roof-low-slope",
    label: "Low-Slope Roof (Shingle Minimum)",
    application: "Minimum slope permitted for standard asphalt shingles (with double underlayment)",
    risePer12Run: 2.0, // 2:12
    degrees: 9.46,
    percentGrade: 16.67,
    minOrMax: "min",
  },
  {
    id: "roof-standard-4-12",
    label: "Conventional Roof Pitch (4:12)",
    application: "Standard single-family residential roof pitch",
    risePer12Run: 4.0, // 4:12
    degrees: 18.43,
    percentGrade: 33.33,
    minOrMax: "standard",
  },
  {
    id: "roof-steep-6-12",
    label: "Moderate Roof Pitch (6:12)",
    application: "Enhanced architectural roof profile, excellent water shedding",
    risePer12Run: 6.0, // 6:12
    degrees: 26.57,
    percentGrade: 50.0,
    minOrMax: "standard",
  },
  {
    id: "roof-steep-8-12",
    label: "Steep Roof Pitch (8:12)",
    application: "High water and snow shedding, walkable with safety gear",
    risePer12Run: 8.0, // 8:12
    degrees: 33.69,
    percentGrade: 66.67,
    minOrMax: "standard",
  },
  {
    id: "roof-steep-12-12",
    label: "45-Degree Pitch (12:12)",
    application: "Historic, cathedral, and Alpine roof styles",
    risePer12Run: 12.0, // 12:12
    degrees: 45.0,
    percentGrade: 100.0,
    minOrMax: "standard",
  },
] as const;
