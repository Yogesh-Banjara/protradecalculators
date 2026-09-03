import fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const PROD_DOMAIN = 'https://protradecalculators.com';

const ALL_33_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/tools',
  '/guides/subpanel-feeder-sizing',
  '/categories/construction',
  '/categories/materials',
  '/categories/electrical',
  '/categories/plumbing',
  '/categories/hvac',
  '/construction/concrete-calculator',
  '/construction/deck-calculator',
  '/construction/framing-calculator',
  '/construction/roof-pitch-calculator',
  '/construction/stair-calculator',
  '/electrical/box-fill-calculator',
  '/electrical/conduit-fill-calculator',
  '/electrical/residential-load-calculator',
  '/electrical/voltage-drop-calculator',
  '/hvac/btu-calculator',
  '/hvac/duct-sizing-calculator',
  '/materials/drywall-calculator',
  '/materials/gravel-calculator',
  '/plumbing/dfu-calculator',
  '/plumbing/wsfu-calculator',
  '/robots.txt',
  '/sitemap.xml'
];

async function runStep234Verification() {
  console.log('--- RUNNING STEP 2, 3, 4: HTML, PRODUCTION-DOMAIN, SITEMAP & INDEXABILITY AUDIT ---\n');

  const results = {
    step2_html_domain: {
      routesChecked: 0,
      forbiddenStringMatches: [],
      pages: []
    },
    step3_sitemap_robots: {
      sitemapUrlsCount: 0,
      indexableRoutesCount: 0,
      sitemapUrls: [],
      robotsTxt: '',
      sitemapDiscrepancies: []
    },
    step4_representative_indexability: []
  };

  // Step 3: Fetch Sitemap and Robots.txt
  console.log('Fetching /sitemap.xml and /robots.txt...');
  const sitemapResp = await fetch(`${BASE_URL}/sitemap.xml`);
  const sitemapText = await sitemapResp.text();
  const sitemapUrls = Array.from(sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);
  results.step3_sitemap_robots.sitemapUrlsCount = sitemapUrls.length;
  results.step3_sitemap_robots.sitemapUrls = sitemapUrls;

  const robotsResp = await fetch(`${BASE_URL}/robots.txt`);
  const robotsText = await robotsResp.text();
  results.step3_sitemap_robots.robotsTxt = robotsText;

  // Verify routes
  const htmlRoutes = ALL_33_ROUTES.filter(r => !r.endsWith('.txt') && !r.endsWith('.xml'));
  results.step3_sitemap_robots.indexableRoutesCount = htmlRoutes.length;

  console.log(`INDEXABLE ROUTES COUNT = ${htmlRoutes.length}`);
  console.log(`SITEMAP URL COUNT = ${sitemapUrls.length}`);

  // Check for discrepancies between sitemap and indexable routes
  const expectedSitemapUrls = htmlRoutes.map(r => r === '/' ? `${PROD_DOMAIN}` : `${PROD_DOMAIN}${r}`);
  for (const exp of expectedSitemapUrls) {
    if (!sitemapUrls.includes(exp)) {
      results.step3_sitemap_robots.sitemapDiscrepancies.push(`Missing from sitemap: ${exp}`);
    }
  }
  for (const surl of sitemapUrls) {
    if (!expectedSitemapUrls.includes(surl)) {
      results.step3_sitemap_robots.sitemapDiscrepancies.push(`Unexpected in sitemap: ${surl}`);
    }
  }

  // Step 2 & 4: Audit each HTML route
  const FORBIDDEN_STRINGS = [
    'constructionandtradetools.com',
    'toolsandcalculations.com',
    'tools-and-calculators.com',
    'localhost:3000',
    'localhost',
    'Construction & Trade Tools',
    'Construction and Trade Tools'
  ];

  for (const route of htmlRoutes) {
    results.step2_html_domain.routesChecked++;
    const resp = await fetch(`${BASE_URL}${route}`);
    const html = await resp.text();

    // Check for forbidden strings
    for (const forbidden of FORBIDDEN_STRINGS) {
      if (html.includes(forbidden)) {
        // Exclude development/next script comments if any
        results.step2_html_domain.forbiddenStringMatches.push({
          route,
          forbiddenString: forbidden
        });
      }
    }

    // Extract Metadata
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const metaDescMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
    const ogUrlMatch = html.match(/<meta\s+property="og:url"\s+content="([^"]*)"/i);
    const robotsMetaMatch = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);

    // Extract JSON-LD Schemas
    const jsonLdMatches = Array.from(html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi));
    const parsedSchemas = [];
    for (const jm of jsonLdMatches) {
      try {
        const parsed = JSON.parse(jm[1]);
        if (Array.isArray(parsed)) {
          parsedSchemas.push(...parsed);
        } else {
          parsedSchemas.push(parsed);
        }
      } catch (e) {
        parsedSchemas.push({ parseError: e.message, raw: jm[1] });
      }
    }

    // Extract H1 counts
    const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
    
    // Internal links count
    const internalLinks = Array.from(html.matchAll(/<a\s+[^>]*href="([^"]*)"[^>]*>/gi))
      .map(m => m[1])
      .filter(href => href.startsWith('/') || href.startsWith(PROD_DOMAIN));

    const pageAudit = {
      route,
      title: titleMatch ? titleMatch[1] : null,
      metaDescription: metaDescMatch ? metaDescMatch[1] : null,
      canonical: canonicalMatch ? canonicalMatch[1] : null,
      ogUrl: ogUrlMatch ? ogUrlMatch[1] : null,
      robots: robotsMetaMatch ? robotsMetaMatch[1] : 'index, follow (default)',
      h1List: h1Matches,
      h1Count: h1Matches.length,
      internalLinksCount: internalLinks.length,
      schemasCount: parsedSchemas.length,
      schemaTypes: parsedSchemas.map(s => s['@type'] || s['type'] || 'unknown'),
      contentLengthBytes: html.length,
      hasSupportingGuideContent: html.includes('<section') || html.includes('Guide') || html.includes('Reference') || html.includes('FAQ')
    };

    results.step2_html_domain.pages.push(pageAudit);

    // If representative page, add to Step 4
    const REPRESENTATIVE_PAGES = [
      '/',
      '/construction/concrete-calculator',
      '/construction/roof-pitch-calculator',
      '/construction/framing-calculator',
      '/construction/deck-calculator',
      '/electrical/voltage-drop-calculator',
      '/electrical/conduit-fill-calculator',
      '/electrical/residential-load-calculator',
      '/plumbing/dfu-calculator',
      '/plumbing/wsfu-calculator',
      '/hvac/btu-calculator',
      '/hvac/duct-sizing-calculator'
    ];

    if (REPRESENTATIVE_PAGES.includes(route)) {
      results.step4_representative_indexability.push({
        route,
        h1Count: h1Matches.length,
        h1Text: h1Matches[0] || 'NONE',
        hasTitle: !!titleMatch,
        hasMetaDesc: !!metaDescMatch,
        hasCanonical: !!canonicalMatch,
        canonical: canonicalMatch ? canonicalMatch[1] : null,
        internalLinksCount: internalLinks.length,
        hasInitialContent: html.length > 5000,
        hasSupportingContent: pageAudit.hasSupportingGuideContent,
        verdict: (h1Matches.length === 1 && !!titleMatch && !!metaDescMatch && !!canonicalMatch && canonicalMatch[1].startsWith(PROD_DOMAIN)) ? 'PASS' : 'FAIL'
      });
    }
  }

  fs.writeFileSync('scratch/prelaunch/task038-step234-audit.json', JSON.stringify(results, null, 2));
  console.log('\nStep 2, 3, 4 Verification Complete.');
  console.log(`Forbidden string matches found: ${results.step2_html_domain.forbiddenStringMatches.length}`);
  if (results.step2_html_domain.forbiddenStringMatches.length > 0) {
    console.log('Forbidden matches detail:', results.step2_html_domain.forbiddenStringMatches);
  }
  console.log(`Sitemap discrepancies: ${results.step3_sitemap_robots.sitemapDiscrepancies.length}`);
  console.log(`Representative indexability passes: ${results.step4_representative_indexability.filter(p => p.verdict === 'PASS').length} / ${results.step4_representative_indexability.length}`);
}

runStep234Verification();
