import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  buildWebPageSchema,
  buildSoftwareAppSchema,
  buildHowToSchema,
  buildFaqSchema,
} from "@/lib/seo/schema";
import { PlumbingDfuForm } from "@/components/tools/plumbing-dfu-calculator/plumbing-dfu-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  HelpCircle,
  Layers,
  AlertTriangle,
  ArrowRight,
  Compass,
  Gauge,
  Workflow,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Plumbing DFU Calculator - Drain Pipe & Vent Stack Sizing (IPC & UPC)",
  description:
    "Calculate Drainage Fixture Units (DFU) and size drain lines, soil stacks, building sewers, and IPC Table 906.1 vent stacks with fixture load schedules.",
  path: "/plumbing/dfu-calculator",
  keywords: [
    "plumbing dfu calculator",
    "drainage fixture unit calculator",
    "dfu pipe sizing calculator",
    "drain pipe sizing calculator",
    "plumbing fixture unit calculator",
    "ipc dfu calculator",
    "upc dfu calculator",
    "soil stack sizing calculator",
    "building drain sizing calculator",
    "sanitary pipe sizing",
    "plumbing code pipe sizing",
    "ipc table 906.1",
    "vent stack sizing calculator",
    "stack vent pipe sizing",
    "maximum developed length of vent",
  ],
});

export default function PlumbingDfuCalculatorPage() {
  const breadcrumbs = [
    { name: "Tools Directory", url: "/tools" },
    { name: "Plumbing & Drainage", url: "/categories/plumbing" },
    { name: "DFU & Pipe Sizing Calculator", url: "/plumbing/dfu-calculator" },
  ];

  const faqItems = [
    {
      question: "How do you size a plumbing vent stack under IPC Table 906.1?",
      answer:
        "To size a stack vent or vent stack under IPC Section 906.1: First, determine the diameter of the soil/waste stack served and the total Drainage Fixture Units (DFU) connected to it. Second, measure the vent's developed length from the lowest vent connection to the outdoor open-air terminal. Third, cross-reference the stack diameter and DFU load in IPC Table 906.1 to select a vent pipe diameter whose maximum allowable developed length meets or exceeds your measured length. Finally, verify that the vent diameter is at least one-half the diameter of the drain served (e.g. minimum 1.5\" vent for a 3\" stack, minimum 2\" vent for a 4\" stack) and never less than 1-1/4\".",
    },
    {
      question: "What is a Drainage Fixture Unit (DFU)?",
      answer:
        "A Drainage Fixture Unit (DFU) is a dimensionless measure of the probable hydraulic discharge into a plumbing drainage system by various types of plumbing fixtures. 1 DFU corresponds roughly to a flow rate of 7.5 gallons per minute (approx. 1 cubic foot per minute) from a single intermittent residential lavatory sink. Sizing by DFU accounts for the statistical probability of simultaneous fixture operation across a building.",
    },
    {
      question: "Why does the code require a minimum 3-inch drain for toilets regardless of DFU?",
      answer:
        "Under both IPC Table 710.1 and UPC Table 703.1, any horizontal branch, stack, building drain, or sewer that receives the discharge of one or more water closets must be at least 3 inches in diameter. Even if a single toilet is rated at only 3 or 4 DFU (which numerically fits inside a 2-inch pipe), 3 inches is physically required to prevent solids clogging and siphoning trap seals during bulk waste flushes.",
    },
    {
      question: "What is the difference between IPC and UPC drainage sizing?",
      answer:
        "The International Plumbing Code (IPC) and Uniform Plumbing Code (UPC) use slightly different fixture unit weights and branch capacities. For example, residential clothes washers are rated at 2 DFU in IPC but 3 DFU in UPC. Furthermore, UPC mandates a 2-inch minimum trap for showers and requires 1/4 inch per foot slope for 3-inch building drains unless special AHJ approval is obtained, whereas IPC permits 1/8 inch slope on 3-inch drains.",
    },
    {
      question: "How do you calculate DFU for continuous flow sump pumps and ejectors?",
      answer:
        "Per IPC Section 709.3 and UPC Section 702.2, continuous or semi-continuous discharge equipment (such as sump pumps, sewage ejector pumps, and air conditioning condensate pumps) is converted to fixture units at the rate of 2 DFU for each 1 Gallon Per Minute (GPM) of rated pump flow. For example, a 20 GPM sewage pump adds 40 DFU directly to the downstream drainage pipe.",
    },
    {
      question: "What is the minimum pipe slope required for sanitary drainage lines?",
      answer:
        "For drain pipes 2-1/2 inches and smaller, both IPC and UPC mandate a minimum slope of 1/4 inch per foot (2.08% fall). For pipes 3 inches to 6 inches, standard IPC allows 1/8 inch per foot (1.04% fall), whereas UPC requires 1/4 inch per foot unless physical obstructions make 1/4 inch impossible and the AHJ grants approval for 1/8 inch slope.",
    },
    {
      question: "How many toilets can be connected to a 3-inch horizontal branch drain?",
      answer:
        "Under IPC Table 710.1(2), a 3-inch horizontal fixture branch drain may serve a maximum of 2 water closets. If 3 or more toilets are connected to the same horizontal branch, the pipe must be upsized to 4 inches. Under UPC Table 703.2, a 3-inch horizontal branch can serve up to 3 water closets.",
    },
  ];

  const howToSteps = [
    {
      name: "Select Plumbing Code Standard",
      text: "Choose between IPC (International Plumbing Code) or UPC (Uniform Plumbing Code) based on your local Authority Having Jurisdiction (AHJ) requirements.",
    },
    {
      name: "Select Drainage System Segment",
      text: "Identify whether you are sizing a horizontal branch drain, vertical soil/waste stack, building drain (inside building footprint), or building sewer.",
    },
    {
      name: "Build Fixture Schedule",
      text: "Add all connected plumbing fixtures (toilets, sinks, tubs, showers, washing machines) and enter exact quantities. Optional continuous pumps are entered in GPM.",
    },
    {
      name: "Review Recommended Pipe Diameter",
      text: "Examine the recommended standard pipe diameter, rated DFU capacity, utilization percentage, and governing code rules (such as the 3-inch water closet floor).",
    },
    {
      name: "Print Permit Takeoff Worksheet",
      text: "Export or print the complete mathematical derivation and fixture schedule for permit submittal and jobsite installation.",
    },
  ];

  const pageSchema = buildWebPageSchema(
    "Plumbing DFU & Drainage Pipe Sizing Calculator",
    "Free plumbing drainage fixture unit (DFU) and drain pipe sizing calculator per IPC and UPC standards.",
    "/plumbing/dfu-calculator",
    breadcrumbs
  );

  const softwareAppSchema = buildSoftwareAppSchema({
    name: "Plumbing DFU & Pipe Sizing Calculator",
    description:
      "Deterministic plumbing drainage fixture unit calculator for sizing sanitary branch drains, vertical soil stacks, and building sewers per IPC and UPC standards.",
    url: "/plumbing/dfu-calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (Web Browser)",
  });

  const howToSchema = buildHowToSchema(
    "How to Calculate Plumbing DFU and Drain Pipe Size",
    "Step-by-step guide to calculating cumulative drainage fixture units and selecting drain pipe diameters based on plumbing code capacity tables.",
    howToSteps
  );

  const faqSchema = buildFaqSchema(faqItems);

  return (
    <>
      <JsonLd schema={pageSchema} />
      <JsonLd schema={softwareAppSchema} />
      <JsonLd schema={howToSchema} />
      <JsonLd schema={faqSchema} />

      <div className="py-10">
        <Container>
          <Breadcrumb items={breadcrumbs} />

          {/* Hero Section */}
          <div className="my-8 space-y-4 max-w-4xl">
            <div className="flex items-center gap-2">
              <Badge variant="brand" className="gap-1">
                <Droplets className="h-3.5 w-3.5" />
                <span>Plumbing &amp; Drainage Cluster</span>
              </Badge>
              <Badge variant="outline">IPC &amp; UPC Reference Tables</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Plumbing Drainage Fixture Unit (DFU) &amp; Pipe Sizing Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Calculate cumulative Drainage Fixture Units (DFU) and estimate sanitary pipe diameters for horizontal branch drains, vertical soil stacks, and building drains based on <strong>IPC Chapter 7 (Table 710.1)</strong> and <strong>UPC Chapter 7 (Table 703.2)</strong>.
            </p>
          </div>

          {/* Interactive Calculator Component */}
          <div className="my-8">
            <PlumbingDfuForm />
          </div>

          {/* Technical Guides & Explanatory Architecture (8 In-Depth Sections) */}
          <div className="my-16 space-y-12">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Plumbing Drainage Engineering &amp; Code Sizing Guide
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Professional engineering reference covering IPC/UPC fixture tables, stack sizing rules, slope hydraulic velocities, and permit preparation.
              </p>
            </div>

            {/* Guide Section 1 & 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                    <Gauge className="h-4 w-4" />
                    <span>Hydraulic Fundamentals</span>
                  </div>
                  <CardTitle className="text-lg">
                    1. Understanding Drainage Fixture Units (DFU)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>
                    Plumbing drainage operates by gravity rather than pressure. Because not all fixtures in a building discharge water at the exact same moment, sizing drainage pipes by peak continuous GPM would result in massive, expensive, and self-fouling oversized pipes.
                  </p>
                  <p>
                    To solve this, plumbing codes use the <strong>Drainage Fixture Unit (DFU)</strong> system—a probabilistic weighting method created by Dr. Roy B. Hunter at the National Bureau of Standards. One DFU represents approximately 7.5 GPM (1 cubic foot/minute) of intermittent discharge from a standard private lavatory. Fixtures with higher volumes or longer discharge cycles (e.g. washing machines or flushometer toilets) receive higher DFU values.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                    <Compass className="h-4 w-4" />
                    <span>Code Comparison</span>
                  </div>
                  <CardTitle className="text-lg">
                    2. IPC vs. UPC: Key Sizing Differences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>
                    In the United States, two primary model plumbing codes govern sanitary systems: the <strong>International Plumbing Code (IPC)</strong> (adopted in most East Coast, Midwest, and Southern states) and the <strong>Uniform Plumbing Code (UPC)</strong> (prominent in Western states like California, Washington, and Oregon).
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Clothes Washer:</strong> IPC assigns 2 DFU; UPC assigns 3 DFU.</li>
                    <li><strong>Shower Traps:</strong> IPC permits 1-1/2&quot; minimum trap on small residential showers; UPC strictly mandates a 2&quot; trap minimum.</li>
                    <li><strong>3&quot; Pipe Fall:</strong> IPC permits 1/8&quot; per foot slope on 3&quot; drains; UPC requires 1/4&quot; per foot slope unless approved by the AHJ.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Guide Section 3 & 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Mandatory Code Rule</span>
                  </div>
                  <CardTitle className="text-lg">
                    3. The 3-Inch Water Closet Minimum Floor Rule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>
                    A common mistake among novice designers is sizing a toilet branch solely on mathematical DFU. A single residential toilet is rated at 3 DFU, which mathematically fits within a 2&quot; pipe capacity (which carries up to 6 DFU in IPC).
                  </p>
                  <p>
                    However, <strong>IPC Section 710.1 and UPC Section 703.1</strong> enforce an absolute physical floor: <em>No water closet shall discharge into a drain pipe smaller than 3 inches in diameter</em>. This ensures solid waste passages clear without choking the pipe or siphoning neighboring trap seals.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                    <Layers className="h-4 w-4" />
                    <span>System Geometry</span>
                  </div>
                  <CardTitle className="text-lg">
                    4. Horizontal Branches vs. Vertical Stacks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>
                    Water flows down vertical stacks in an annular sheet along the pipe walls, creating a central core of air. This hydraulic phenomenon allows vertical stacks to carry significantly more DFU than horizontal pipes of identical diameter.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] border border-slate-200">
                      <thead className="bg-slate-100 font-bold">
                        <tr>
                          <th className="p-1.5 text-left">Pipe Size</th>
                          <th className="p-1.5 text-center">Horizontal Branch (IPC)</th>
                          <th className="p-1.5 text-center">Vertical Stack (IPC)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr><td className="p-1.5 font-bold">2&quot;</td><td className="p-1.5 text-center font-mono">6 DFU</td><td className="p-1.5 text-center font-mono">24 DFU</td></tr>
                        <tr><td className="p-1.5 font-bold">3&quot;</td><td className="p-1.5 text-center font-mono">20 DFU</td><td className="p-1.5 text-center font-mono">72 DFU</td></tr>
                        <tr><td className="p-1.5 font-bold">4&quot;</td><td className="p-1.5 text-center font-mono">160 DFU</td><td className="p-1.5 text-center font-mono">500 DFU</td></tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Guide Section 5 & 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                    <Workflow className="h-4 w-4" />
                    <span>Hydraulic Velocity</span>
                  </div>
                  <CardTitle className="text-lg">
                    5. Pipe Slope &amp; The 2 FPS Scouring Velocity Rule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>
                    Drainage piping must be sloped to maintain a minimum fluid velocity of <strong>2 feet per second (fps)</strong>. This velocity provides &quot;scouring action&quot; to keep solids suspended in the wastewater flow rather than settling on the pipe bottom.
                  </p>
                  <p>
                    Conversely, excessive slope (&gt; 1/2&quot; per ft) on long horizontal runs can cause water to outrun solid waste, leading to clogs. Standard minimum slope is <strong>1/4&quot; per foot (2%)</strong> for lines $\le 2-1/2&quot;$ and <strong>1/8&quot; per foot (1%)</strong> for lines $3&quot;$ to $6&quot;$.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                    <Droplets className="h-4 w-4" />
                    <span>Pump Loads</span>
                  </div>
                  <CardTitle className="text-lg">
                    6. Sizing Sump &amp; Sewage Ejector Pump Loads
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>
                    When basement bathrooms or sub-grade plumbing fixtures cannot drain by gravity, a sewage ejector pump lifts the waste to the main building drain.
                  </p>
                  <p>
                    Per <strong>IPC 709.3 and UPC 702.2</strong>, pump discharge is rated as continuous flow at <strong>2 DFU per 1 GPM</strong>. A standard 20 GPM residential sewage ejector contributes 40 DFU. When sizing the gravity building drain receiving this pump discharge, the 40 DFU must be added to all upstream gravity fixtures.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Master DFU Code Sizing Matrix (IPC Table 710.1(2) & UPC Table 703.2) */}
            <section className="space-y-4 rounded-2xl border border-cyan-200 bg-white p-6 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-800">
                  <Layers className="h-4 w-4 text-cyan-600" />
                  <span>National Plumbing Code Master Reference</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Sanitary Drainage Pipe Sizing Matrix: IPC Table 710.1(2) &amp; UPC Table 703.2
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Maximum permitted Drainage Fixture Units (DFU) for horizontal fixture branches, vertical soil/waste stacks, and building drains across standard slope gradients:
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Pipe Size</th>
                      <th className="p-3">Horizontal Branch (IPC)</th>
                      <th className="p-3">Building Drain (1/8&quot; / ft)</th>
                      <th className="p-3">Building Drain (1/4&quot; / ft)</th>
                      <th className="p-3">Building Drain (1/2&quot; / ft)</th>
                      <th className="p-3">Stack (&le; 3 Stories)</th>
                      <th className="p-3">Stack (&gt; 3 Stories)</th>
                      <th className="p-3">Code Provisions &amp; Water Closet Limits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">1-1/2&quot;</td>
                      <td className="p-3 text-cyan-900 font-bold">3 DFU</td>
                      <td className="p-3 text-slate-400">N/A</td>
                      <td className="p-3">1 DFU</td>
                      <td className="p-3">1 DFU</td>
                      <td className="p-3">4 DFU</td>
                      <td className="p-3">8 DFU</td>
                      <td className="p-3 font-sans text-slate-600">Sinks, lavatories, tubs. No water closets permitted.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2&quot;</td>
                      <td className="p-3 text-cyan-900 font-bold">6 DFU</td>
                      <td className="p-3 text-slate-400">N/A</td>
                      <td className="p-3">21 DFU</td>
                      <td className="p-3">26 DFU</td>
                      <td className="p-3">10 DFU</td>
                      <td className="p-3">24 DFU</td>
                      <td className="p-3 font-sans text-slate-600">Kitchen sinks, laundry trays, shower stalls. No water closets.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2-1/2&quot;</td>
                      <td className="p-3 text-cyan-900 font-bold">12 DFU</td>
                      <td className="p-3 text-slate-400">N/A</td>
                      <td className="p-3">24 DFU</td>
                      <td className="p-3">31 DFU</td>
                      <td className="p-3">20 DFU</td>
                      <td className="p-3">42 DFU</td>
                      <td className="p-3 font-sans text-slate-600">Commercial fixtures and floor drains. No water closets.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">3&quot;</td>
                      <td className="p-3 text-cyan-900 font-bold">20 DFU</td>
                      <td className="p-3 text-amber-800 font-bold">36 DFU (IPC)</td>
                      <td className="p-3 text-cyan-900 font-bold">42 DFU</td>
                      <td className="p-3">50 DFU</td>
                      <td className="p-3">48 DFU</td>
                      <td className="p-3">72 DFU</td>
                      <td className="p-3 font-sans text-slate-600">Minimum size for water closets. Max 2 WCs (IPC) or 3 WCs (UPC) on branch.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">4&quot;</td>
                      <td className="p-3 text-cyan-900 font-bold">160 DFU</td>
                      <td className="p-3 text-cyan-900 font-bold">180 DFU</td>
                      <td className="p-3 text-cyan-900 font-bold">216 DFU</td>
                      <td className="p-3">250 DFU</td>
                      <td className="p-3">240 DFU</td>
                      <td className="p-3">500 DFU</td>
                      <td className="p-3 font-sans text-slate-600">Standard residential main building drain. Unlimited water closets.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">6&quot;</td>
                      <td className="p-3 text-cyan-900 font-bold">620 DFU</td>
                      <td className="p-3 text-cyan-900 font-bold">700 DFU</td>
                      <td className="p-3 text-cyan-900 font-bold">840 DFU</td>
                      <td className="p-3">1,000 DFU</td>
                      <td className="p-3">960 DFU</td>
                      <td className="p-3">1,900 DFU</td>
                      <td className="p-3 font-sans text-slate-600">Commercial building sewer mains and multi-family branches.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* IPC Table 906.1 Vent Stack & Stack Vent Sizing Matrix */}
            <section className="space-y-4 rounded-2xl border border-cyan-200 bg-white p-6 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-800">
                  <Gauge className="h-4 w-4 text-cyan-600" />
                  <span>IPC Section 906 Sizing Standard</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Vent Stack &amp; Stack Vent Sizing: IPC Table 906.1
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Maximum permitted developed length (in feet) of stack vents and vent stacks based on the diameter of the soil/waste stack served and total connected Drainage Fixture Units (DFU):
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Soil/Waste Stack Diameter</th>
                      <th className="p-3">Total DFUs Served</th>
                      <th className="p-3 text-center">1-1/4″ Vent</th>
                      <th className="p-3 text-center">1-1/2″ Vent</th>
                      <th className="p-3 text-center">2″ Vent</th>
                      <th className="p-3 text-center">2-1/2″ Vent</th>
                      <th className="p-3 text-center">3″ Vent</th>
                      <th className="p-3 text-center">4″ Vent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">1-1/2″ Stack</td>
                      <td className="p-3">8 DFU</td>
                      <td className="p-3 text-center">50 ft</td>
                      <td className="p-3 text-center text-cyan-900 font-bold">150 ft</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">2″ Stack</td>
                      <td className="p-3">12 DFU</td>
                      <td className="p-3 text-center">30 ft</td>
                      <td className="p-3 text-center">75 ft</td>
                      <td className="p-3 text-center text-cyan-900 font-bold">200 ft</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">2″ Stack</td>
                      <td className="p-3">24 DFU</td>
                      <td className="p-3 text-center">26 ft</td>
                      <td className="p-3 text-center">50 ft</td>
                      <td className="p-3 text-center text-cyan-900 font-bold">150 ft</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">3″ Stack</td>
                      <td className="p-3">10 DFU</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center">42 ft</td>
                      <td className="p-3 text-center">150 ft</td>
                      <td className="p-3 text-center">360 ft</td>
                      <td className="p-3 text-center text-cyan-900 font-bold">1,040 ft</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">3″ Stack</td>
                      <td className="p-3">21 DFU</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center">32 ft</td>
                      <td className="p-3 text-center">110 ft</td>
                      <td className="p-3 text-center">270 ft</td>
                      <td className="p-3 text-center text-cyan-900 font-bold">810 ft</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">3″ Stack</td>
                      <td className="p-3">53 DFU</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center">27 ft</td>
                      <td className="p-3 text-center">94 ft</td>
                      <td className="p-3 text-center">230 ft</td>
                      <td className="p-3 text-center text-cyan-900 font-bold">680 ft</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">3″ Stack</td>
                      <td className="p-3">102 DFU</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center">25 ft</td>
                      <td className="p-3 text-center">86 ft</td>
                      <td className="p-3 text-center">210 ft</td>
                      <td className="p-3 text-center text-cyan-900 font-bold">620 ft</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">4″ Stack</td>
                      <td className="p-3">43 DFU</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center">35 ft</td>
                      <td className="p-3 text-center">85 ft</td>
                      <td className="p-3 text-center">250 ft</td>
                      <td className="p-3 text-center text-cyan-900 font-bold">980 ft</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">4″ Stack</td>
                      <td className="p-3">140 DFU</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center">27 ft</td>
                      <td className="p-3 text-center">65 ft</td>
                      <td className="p-3 text-center">200 ft</td>
                      <td className="p-3 text-center text-cyan-900 font-bold">750 ft</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">4″ Stack</td>
                      <td className="p-3">320 DFU</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center text-slate-400">—</td>
                      <td className="p-3 text-center">23 ft</td>
                      <td className="p-3 text-center">55 ft</td>
                      <td className="p-3 text-center">170 ft</td>
                      <td className="p-3 text-center text-cyan-900 font-bold">640 ft</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-cyan-50/70 border border-cyan-200/80 rounded-xl p-4 text-xs text-cyan-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-cyan-700" />
                  IPC Section 906.1 Sizing Rules:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 font-sans">
                  <li>
                    <strong>Half-Diameter Floor Rule:</strong> The diameter of a stack vent or vent stack shall not be less than one-half the diameter of the drain served, and not less than 1-1/4 inches. A 3″ soil stack requires a minimum 1-1/2″ vent; a 4″ soil stack requires a minimum 2″ vent.
                  </li>
                  <li>
                    <strong>Developed Length Measurement:</strong> The developed length of the vent is measured from the lowest point of connection with the drainage system to the open-air terminal above the roof line.
                  </li>
                  <li>
                    <strong>Pneumatic Trap Protection:</strong> Vent pipe sizing limits differential pneumatic pressures within the drainage system to within &plusmn;1 inch of water column (249 Pa), preserving the 2-inch minimum water seal in fixture P-traps.
                  </li>
                </ul>
              </div>
            </section>

            {/* Reciprocal Trade Ecosystem Cross-Links */}
            <Card className="border-amber-200/80 bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5">
              <CardHeader>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                  <Workflow className="h-4 w-4 text-amber-700" />
                  <span>Trade Workflow Integration</span>
                </div>
                <CardTitle className="text-xl">Connected Plumbing &amp; Trade Calculators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href="/plumbing/wsfu-calculator"
                    className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-cyan-500 hover:shadow-md"
                  >
                    <div className="text-xs font-bold uppercase text-cyan-700 mb-1">
                      Potable Supply Sizing
                    </div>
                    <div className="font-bold text-slate-900 group-hover:text-cyan-700 text-sm flex items-center justify-between">
                      <span>Water Supply Fixture Unit (WSFU) Calculator</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Calculate peak flow (GPM) via Hunter&apos;s Curve and size copper, PEX, and CPVC potable water main supply trunks.
                    </p>
                    <div className="text-xs font-bold text-cyan-600 mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Size Potable Water Supply Lines (WSFU) →
                    </div>
                  </Link>

                  <Link
                    href="/construction/concrete-calculator"
                    className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-md"
                  >
                    <div className="text-xs font-bold uppercase text-amber-700 mb-1">
                      Under-Slab Rough-In
                    </div>
                    <div className="font-bold text-slate-900 group-hover:text-amber-700 text-sm flex items-center justify-between">
                      <span>Concrete Slab Calculator</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Calculate concrete yardage for slab box-outs, sleeve penetrations, and sewer trench infill.
                    </p>
                    <div className="text-xs font-bold text-amber-600 mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Calculate Slab Concrete Volume →
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Frequently Asked Questions */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-amber-600" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Frequently Asked Questions (FAQ)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqItems.map((faq, index) => (
                  <Card key={index} className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
