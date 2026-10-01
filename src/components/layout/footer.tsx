import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "../ui/container";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 mt-20">
      <Container>
        <div className="py-14 lg:py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
            >
              <BrandLogo variant="monochrome-light" size="md" showSubtitle={true} />
            </Link>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Open, deterministic estimating calculators for construction,
              framing, earthwork, electrical, mechanical, and plumbing trades. Built for jobsite
              accuracy without paywalls, accounts, or heuristic approximations.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Transparent formulas &amp; published code reference schedules.</span>
            </div>
          </div>

          {/* Quick Links / Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Trade Suites
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/categories/construction"
                  className="hover:text-amber-400 transition-colors"
                >
                  Construction &amp; Framing (5)
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/electrical"
                  className="hover:text-amber-400 transition-colors"
                >
                  Electrical &amp; Conduit (4)
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/plumbing"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Plumbing &amp; Piping (2)
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/hvac"
                  className="hover:text-amber-400 transition-colors"
                >
                  HVAC &amp; Airflow (2)
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/materials"
                  className="hover:text-amber-400 transition-colors"
                >
                  Materials &amp; Earthwork (2)
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/tools"
                  className="text-xs font-bold text-amber-400 hover:underline"
                >
                  View All 15 Calculators →
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Methodology &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/methodology"
                  className="hover:text-amber-400 transition-colors font-medium text-slate-300"
                >
                  Calculation Methodology &amp; NEC Compliance
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-amber-400 transition-colors"
                >
                  Calculation Standards &amp; Physics
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-amber-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-amber-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact &amp; Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="border-t border-slate-800/80 py-6 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong>Preliminary Estimating Notice:</strong> Calculations and diagrams provided on this platform are mathematical models intended for preliminary planning, material takeoff estimation, and educational reference. Field conditions, local building codes, manufacturer tolerances, and project-specific engineering requirements must always be verified by licensed contractors, registered architects, or professional engineers prior to construction or permit submission.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-3 text-slate-500">
            <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/methodology" className="hover:text-slate-300">
                Methodology
              </Link>
              <Link href="/privacy" className="hover:text-slate-300">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-slate-300">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-slate-300">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
