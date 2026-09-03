import fs from 'fs';

const BASE_URL = 'http://localhost:3000';

const URLS_TO_AUDIT = [
  '/',
  '/tools',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/categories/construction',
  '/categories/materials',
  '/categories/electrical',
  '/categories/hvac',
  '/categories/plumbing',
  '/construction/concrete-calculator',
  '/construction/deck-calculator',
  '/construction/framing-calculator',
  '/construction/roof-pitch-calculator',
  '/construction/stair-calculator',
  '/materials/drywall-calculator',
  '/materials/gravel-calculator',
  '/electrical/box-fill-calculator',
  '/electrical/conduit-fill-calculator',
  '/electrical/residential-load-calculator',
  '/electrical/voltage-drop-calculator',
  '/guides/subpanel-feeder-sizing',
  '/hvac/btu-calculator',
  '/hvac/duct-sizing-calculator',
  '/plumbing/dfu-calculator',
  '/plumbing/wsfu-calculator',
  '/robots.txt',
  '/sitemap.xml'
];

async function runAudit() {
  console.log(`Starting Page-Level SEO Implementation Verification on ${URLS_TO_AUDIT.length} endpoints...`);

  const results = [];

  for (const path of URLS_TO_AUDIT) {
    const url = `${BASE_URL}${path}`;
    try {
      const res = await fetch(url);
      const statusCode = res.status;
      const contentType = res.headers.get('content-type') || '';
      const text = await res.text();

      if (path === '/robots.txt' || path === '/sitemap.xml') {
        results.push({
          path,
          statusCode,
          contentType,
          byteLength: text.length,
          status: statusCode === 200 ? 'PASS' : 'FLAGGED',
          isSpecial: true,
          contentSample: text.slice(0, 300)
        });
        console.log(`[${statusCode}] ${path} (Special Endpoint - ${text.length} bytes)`);
        continue;
      }

      // Title
      const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';

      // Meta Description
      const metaDescMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                            text.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
      const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

      // Canonical
      const canonicalMatch = text.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
                             text.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
      const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';

      // Robots
      const robotsMatch = text.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
      const robots = robotsMatch ? robotsMatch[1].trim() : 'index, follow (default)';

      // Open Graph
      const ogTitleMatch = text.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
      const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : '';
      const ogDescMatch = text.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
      const ogDesc = ogDescMatch ? ogDescMatch[1].trim() : '';
      const ogUrlMatch = text.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i);
      const ogUrl = ogUrlMatch ? ogUrlMatch[1].trim() : '';
      const ogTypeMatch = text.match(/<meta[^>]*property=["']og:type["'][^>]*content=["']([^"']+)["']/i);
      const ogType = ogTypeMatch ? ogTypeMatch[1].trim() : '';

      // Headings
      const h1Matches = Array.from(text.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
      const h2Matches = Array.from(text.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
      const h3Matches = Array.from(text.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());

      // JSON-LD Schemas
      const jsonLdMatches = Array.from(text.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
      const schemas = [];
      for (const m of jsonLdMatches) {
        try {
          const parsed = JSON.parse(m[1]);
          schemas.push(parsed);
        } catch (e) {
          schemas.push({ error: 'Invalid JSON', raw: m[1] });
        }
      }

      // Breadcrumb check
      const hasBreadcrumbs = text.includes('aria-label="Breadcrumb"') || text.includes('itemtype="https://schema.org/BreadcrumbList"');

      // Internal Links
      const internalLinks = Array.from(text.matchAll(/href=["'](\/[^"'#?]*)["']/gi)).map(m => m[1]);
      const uniqueInternalLinks = Array.from(new Set(internalLinks));

      // Visible text estimation
      const plainText = text.replace(/<script[\s\S]*?<\/script>/gi, '')
                            .replace(/<style[\s\S]*?<\/style>/gi, '')
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/&[a-z0-9#]+;/gi, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();
      const wordCount = plainText.split(/\s+/).filter(w => w.length > 0).length;

      // Hype / Spam / Fake claim check
      const bannedHypeTerms = ['#1 rated', 'world-class accuracy', 'guaranteed to rank', 'guaranteed permit approval', 'official government utility', 'we are licensed contractors'];
      const foundBannedTerms = bannedHypeTerms.filter(term => plainText.toLowerCase().includes(term.toLowerCase()));

      const issues = [];
      if (statusCode !== 200) issues.push(`Non-200 status: ${statusCode}`);
      if (h1Matches.length !== 1) issues.push(`Expected exactly 1 H1, found ${h1Matches.length}`);
      if (!title || title.length < 15) issues.push(`Title too short: "${title}"`);
      if (!metaDescription || metaDescription.length < 50) issues.push(`Meta description too short or missing (${metaDescription.length} chars)`);
      if (!canonical) issues.push('Missing canonical tag');
      if (wordCount < 150) issues.push(`Thin content warning: only ${wordCount} words`);
      if (foundBannedTerms.length > 0) issues.push(`Found banned buzzwords: ${foundBannedTerms.join(', ')}`);

      const status = issues.length === 0 ? 'PASS' : 'FLAGGED';

      results.push({
        path,
        statusCode,
        title,
        titleLength: title.length,
        metaDescription,
        metaDescLength: metaDescription.length,
        canonical,
        robots,
        ogTitle,
        ogDesc,
        ogUrl,
        ogType,
        h1Count: h1Matches.length,
        h1: h1Matches[0] || '',
        h2Count: h2Matches.length,
        h3Count: h3Matches.length,
        schemas: schemas.map(s => Array.isArray(s) ? s.map(item => item['@type']) : s['@type']).flat(),
        hasBreadcrumbs,
        internalLinksCount: uniqueInternalLinks.length,
        wordCount,
        issues,
        status
      });

      console.log(`[${statusCode}] ${path} - Title: "${title.slice(0, 45)}..." (H1: ${h1Matches.length}, Words: ${wordCount}, Status: ${status})`);
    } catch (err) {
      console.error(`Error auditing ${path}:`, err.message);
      results.push({
        path,
        error: err.message,
        status: 'ERROR'
      });
    }
  }

  fs.writeFileSync('scratch/seo/page-implementation-audit-results.json', JSON.stringify(results, null, 2));
  console.log(`\nAudit complete. ${results.filter(r => r.status === 'PASS').length}/${results.length} passed.`);
}

runAudit();
