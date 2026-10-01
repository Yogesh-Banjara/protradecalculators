import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllCanonicalRoutes } from "@/config/routes";
import necProblems from "@/data/nec-problems.json";

export const dynamic = "force-static";

/**
 * Scalable Dynamic XML Sitemap Generator
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Exclusively outputs verified canonical routes from the central route registry,
 * programmatic worked solutions, technical master guides, and legal compliance pages.
 * Strictly excludes query strings, share hashes, drafts, and test pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.endsWith("/")
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;

  const lastModified = new Date();
  const canonicalRoutes = getAllCanonicalRoutes();

  const standardEntries: MetadataRoute.Sitemap = canonicalRoutes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const solutionsHubEntry: MetadataRoute.Sitemap[number] = {
    url: `${base}/solutions`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  };

  const solutionProblemEntries: MetadataRoute.Sitemap = (
    necProblems as Array<{ slug: string }>
  ).map((item) => ({
    url: `${base}/solutions/${item.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const methodologyEntry: MetadataRoute.Sitemap[number] = {
    url: `${base}/methodology`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.5,
  };

  const additionalGuideEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/guides`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/guides/nec-conduit-fill-rules-and-tables`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/guides/electricians-guide-to-voltage-drop-calculations`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const privacyPolicyEntry: MetadataRoute.Sitemap[number] = {
    url: `${base}/privacy-policy`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.3,
  };

  return [
    ...standardEntries,
    solutionsHubEntry,
    ...solutionProblemEntries,
    methodologyEntry,
    ...additionalGuideEntries,
    privacyPolicyEntry,
  ];
}
