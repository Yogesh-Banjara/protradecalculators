import type { Metadata } from "next";
import type { PageSeoProps } from "@/types/seo";
import { siteConfig } from "@/config/site";

/**
 * Constructs a fully qualified URL given a path.
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const base = siteConfig.url.endsWith("/")
    ? siteConfig.url.slice(0, -1)
    : siteConfig.url;
  return `${base}${cleanPath}`;
}

/**
 * Generates unified Next.js App Router Metadata for any page.
 */
export function generatePageMetadata(props: PageSeoProps): Metadata {
  const {
    title,
    description,
    path,
    keywords = [],
    ogType = "website",
    publishedTime,
    modifiedTime,
    noIndex = false,
  } = props;

  const canonical = getCanonicalUrl(path);
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;

  return {
    title: {
      absolute: fullTitle,
    },
    description,
    keywords: [
      "construction calculators",
      "trade tools",
      "material estimator",
      "contractor utilities",
      ...keywords,
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_US",
      type: ogType,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
