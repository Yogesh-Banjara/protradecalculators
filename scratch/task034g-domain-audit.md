# Task 034G: Domain & Base URL Architecture Audit

**Document Version**: 1.0  
**Audit Scope**: Complete inspection and centralization of site origin / domain handling across all platform layers.

---

## 1. Domain Centralization Architecture

The platform origin is decoupled from any hardcoded unregistered domain. The origin is established via a single environment-driven configuration source:

```typescript
// src/config/site.ts
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://constructionandtradetools.com";
```

When a production domain is finalized and registered by leadership, setting the `NEXT_PUBLIC_SITE_URL` environment variable immediately cascades to 100% of the platform with **zero code modifications**.

---

## 2. Exhaustive Audit of Domain Consumers

| Consumer Subsystem | File Path | Usage & Implementation | Dynamic Binding |
| :--- | :--- | :--- | :---: |
| **Site Configuration** | `src/config/site.ts` | `siteConfig.url`, `siteConfig.ogImage` | **YES** |
| **Root Metadata & MetadataBase** | `src/app/layout.tsx` | `metadataBase: new URL(siteConfig.url)`, `alternates.canonical`, `openGraph.url` | **YES** |
| **Canonical URL Generator** | `src/lib/seo/metadata.ts` | `getCanonicalUrl(path)` | **YES** |
| **XML Sitemap Feed** | `src/app/sitemap.ts` | Dynamically generates all 26 canonical URLs: `${base}${path}` | **YES** |
| **Robots Protocol Feed** | `src/app/robots.ts` | `sitemap: ${base}/sitemap.xml` | **YES** |
| **Structured Data (WebSite)** | `src/lib/seo/schema.ts` | `buildWebSiteSchema()`: `url: siteConfig.url` | **YES** |
| **Structured Data (Organization)** | `src/lib/seo/schema.ts` | `buildOrganizationSchema()`: `url: siteConfig.url`, `logo: ${siteConfig.url}/logo.png` | **YES** |
| **Structured Data (SoftwareApp)** | `src/lib/seo/schema.ts` | `buildSoftwareAppSchema()`: `url: getCanonicalUrl(path)` | **YES** |
| **Result Panel Share / Copy** | `src/components/ui/result-panel.tsx` | `Source: ${siteConfig.name} (${siteConfig.url})` | **YES** |
| **Result Hero Share / Copy** | `src/components/workspace/result-hero.tsx` | `Source: ${siteConfig.name} (${siteConfig.url})` | **YES** |
| **14 Calculator Forms** | `src/components/tools/*/*-form.tsx` | `Source: ${siteConfig.name} (${siteConfig.url}/...)` | **YES** |

---

## 3. Unregistered Domain Cleanup Verification

- **Hardcoded Domain Scan**: Audited entire repository (`src/`, `tests/`, `public/`).
- **Result**: Zero instances of `itradehub.com` exist in application source code, schemas, components, or configuration files.
- **Safety**: No production metadata or sitemap emits unowned or unconfigured domains.
