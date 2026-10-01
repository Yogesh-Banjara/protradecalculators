import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { HardHat, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | ProTrade Calculators",
  description:
    "The requested trade calculator or engineering guide was not found. Browse our complete directory of construction and trade calculation instruments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="py-20">
      <Container size="sm" className="text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
          <HardHat className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">404 - Page Not Found</h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            The page or calculator you are looking for does not exist, may have moved, or is scheduled for a future release.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center font-semibold rounded-md h-10 px-5 bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </div>
      </Container>
    </div>
  );
}
