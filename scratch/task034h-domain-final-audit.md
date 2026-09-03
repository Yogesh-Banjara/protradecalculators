# Task 034H: Final Domain Hygiene & Site-Origin Audit

**Audit Timestamp**: 2026-09-02T15:56:42.614Z  
**Scope**: 100% codebase scan (excluding node_modules, .next, .git, scratch)

---

## 1. Executive Summary

- **Placeholder Production Domains**: **0** (All instances of placeholder domains `constructionandtradetools.com` and `itradehub.com` have been completely eliminated from application code).
- **Origin Single Source of Truth**: Driven strictly by `process.env.NEXT_PUBLIC_SITE_URL` with clean local development fallback `http://localhost:3000`.
- **Zero Production Domain Commitment**: The application does not hardcode, assume, or invent an unowned domain.

---

## 2. Exhaustive Site-Origin Inventory

The following table lists every location in the source code where the origin URL is generated or referenced:

| Category | File | Line | Usage |
| :--- | :--- | :---: | :--- |
| **Origin Fallback** | `src/config/site.ts` | 24 | `process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"` |
| **Metadata Base** | `src/app/layout.tsx` | 16 | `metadataBase: new URL(siteConfig.url)` |
| **Canonical Alternates** | `src/app/layout.tsx` | 36 | `alternates: { canonical: siteConfig.url }` |
| **OpenGraph URL** | `src/app/layout.tsx` | 41 | `openGraph: { url: siteConfig.url }` |
| **Sitemap XML Feed** | `src/app/sitemap.ts` | 6 | Slices trailing slash and maps 26 canonical URLs against `siteConfig.url` |
| **Robots Protocol Feed** | `src/app/robots.ts` | 15 | `sitemap: ${base}/sitemap.xml` |
| **Canonical Generator** | `src/lib/seo/metadata.ts` | 10 | `getCanonicalUrl(path)` resolves relative paths against `siteConfig.url` |
| **Structured Data** | `src/lib/seo/schema.ts` | 19, 32 | WebSite & Organization JSON-LD schemas resolve `siteConfig.url` |

---

## 3. Legitimate External References (Exempt from Site Origin)

The codebase retains standard W3C, Schema.org, and Google Fonts namespaces:
- `https://schema.org` (JSON-LD linked data schemas)
- `http://www.w3.org/2000/svg` (Inline SVG xmlns namespaces)
- `https://fonts.googleapis.com` / `https://fonts.gstatic.com` (Web typography CDN preconnects)

---

## 4. Clipboard / Share Attribution Verification

All 14 calculator result clipboards and workspace hero panels now cite explicit technical standards (e.g. *"Reference: NEC 2023 Table 310.16 & Conductor Resistance Schedules"*) rather than appending raw development or placeholder domain URLs into jobsite notes.
