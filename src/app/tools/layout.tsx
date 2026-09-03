import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Trade Tools & Calculators Directory",
  description:
    "Comprehensive directory of professional construction, electrical, HVAC, plumbing, and material takeoff calculators.",
  path: "/tools",
  keywords: [
    "trade tools directory",
    "construction calculators list",
    "electrical calculators directory",
    "contractor calculator suite",
  ],
});

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
