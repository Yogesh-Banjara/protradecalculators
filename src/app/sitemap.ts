import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllCanonicalRoutes } from "@/config/routes";

export const dynamic = "force-static";

/**
 * Scalable Dynamic XML Sitemap Generator
 * ProTrade Calculators (https://protradecalculators.com)
 *
 * Exclusively outputs verified canonical routes from the central route registry.
 * Strictly excludes query strings, share hashes, drafts, and test pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.endsWith("/")
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;

  const lastModified = new Date();
  const canonicalRoutes = getAllCanonicalRoutes();

  return canonicalRoutes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
