export interface SiteConfig {
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
  readonly url: string;
  readonly ogImage: string;
  readonly links: {
    readonly twitter?: string;
    readonly github?: string;
  };
  readonly navItems: readonly {
    readonly title: string;
    readonly href: string;
    readonly status?: "active" | "planned";
  }[];
  readonly footerNav: {
    readonly tools: readonly { readonly title: string; readonly href: string }[];
    readonly resources: readonly { readonly title: string; readonly href: string }[];
    readonly legal: readonly { readonly title: string; readonly href: string }[];
  };
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://protradecalculators.com";

export const siteConfig: SiteConfig = {
  name: "ProTrade Calculators",
  shortName: "ProTrade",
  description:
    "Free estimating calculators and material takeoff tools for construction contractors, tradespeople, and builders.",
  url: siteUrl,
  ogImage: `${siteUrl}/og.png`,
  links: {},
  navItems: [
    {
      title: "Tools Directory",
      href: "/tools",
      status: "active",
    },
    {
      title: "Guides",
      href: "/guides/subpanel-feeder-sizing",
      status: "active",
    },
    {
      title: "About & Methodology",
      href: "/about",
      status: "active",
    },
    {
      title: "Contact",
      href: "/contact",
      status: "active",
    },
  ],
  footerNav: {
    tools: [
      { title: "All Tools", href: "/tools" },
      { title: "Construction", href: "/tools#construction" },
      { title: "Materials", href: "/tools#materials" },
      { title: "Electrical", href: "/tools#electrical" },
      { title: "HVAC", href: "/tools#hvac" },
      { title: "Plumbing", href: "/tools#plumbing" },
    ],
    resources: [
      { title: "About & Standards", href: "/about" },
      { title: "Contact & Feedback", href: "/contact" },
    ],
    legal: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
    ],
  },
};
