/**
 * Visual Reference Asset Type Definitions
 * ProTrade Calculators (https://protradecalculators.com)
 */

export interface VisualAssetMetadata {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly tradeCategory: "construction" | "electrical" | "plumbing" | "hvac" | "materials";
  readonly codeBody?: "NEC" | "IRC" | "IPC" | "UPC" | "ASTM";
  readonly codeCitation?: string;
  readonly aspectRatio?: "16/9" | "16/10" | "4/3" | "1/1";
  readonly keyTakeaways?: readonly string[];
}
