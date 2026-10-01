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
 * programmatic worked solutions, and engineering methodology standards.
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

  return [
    ...standardEntries,
    solutionsHubEntry,
    ...solutionProblemEntries,
    methodologyEntry,
  ];
}
