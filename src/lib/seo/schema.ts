import type {
  BreadcrumbItem,
  FaqItem,
  HowToStep,
  SoftwareAppSchemaOptions,
} from "@/types/seo";
import { siteConfig } from "@/config/site";
import { getCanonicalUrl } from "./metadata";

/**
 * Generates Schema.org WebSite JSON-LD.
 */
export function buildWebSiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

/**
 * Generates Schema.org Organization JSON-LD.
 */
export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [],
  };
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD.
 */
export function buildBreadcrumbSchema(
  items: readonly BreadcrumbItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : getCanonicalUrl(item.url),
    })),
  };
}

/**
 * Generates Schema.org WebPage JSON-LD.
 */
export function buildWebPageSchema(
  title: string,
  description: string,
  path: string,
  breadcrumbs?: readonly BreadcrumbItem[]
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: getCanonicalUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = buildBreadcrumbSchema(breadcrumbs);
  }

  return schema;
}

/**
 * Generates Schema.org SoftwareApplication JSON-LD for interactive calculator tools.
 */
export function buildSoftwareAppSchema(
  options: SoftwareAppSchemaOptions
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: options.name,
    description: options.description,
    url: getCanonicalUrl(options.url),
    applicationCategory: options.applicationCategory,
    operatingSystem: options.operatingSystem ?? "Any (Web Application)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * Generates Schema.org FAQPage JSON-LD.
 */
export function buildFaqSchema(faqs: readonly FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates Schema.org HowTo JSON-LD.
 */
export function buildHowToSchema(
  name: string,
  description: string,
  steps: readonly HowToStep[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
      ...(step.image && { image: step.image }),
    })),
  };
}
