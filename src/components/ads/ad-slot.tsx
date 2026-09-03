export type AdZone =
  | "zone-a-below-workspace"
  | "zone-b-in-content"
  | "zone-c-below-tools";

export interface AdSlotProps {
  readonly zone: AdZone;
  readonly className?: string;
}

/**
 * AdSlot Architecture Placeholder
 * 
 * Future AdSense layout boundary. Strictly disabled in production.
 * Renders null to guarantee 0 layout shift (CLS) and zero visual distraction.
 * 
 * Strict Placement Rules:
 * - ZONE A: Below calculator workspace and above methodology.
 * - ZONE B: Within long-form technical explanations.
 * - ZONE C: Below related tools and FAQ.
 * - NEVER inside calculator inputs, results, or interactive diagrams.
 */
export function AdSlot(_props: AdSlotProps) {
  // Production disabled: No live ads, no fake placeholders, no CLS.
  return null;
}
