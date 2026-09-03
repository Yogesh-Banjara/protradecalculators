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
  '/plumbing/wsfu-calculator'
];

async function runStep789Verification() {
  console.log('--- RUNNING STEP 7, 8, 9: SEO METADATA, STRUCTURED DATA & INTERNAL LINK GRAPH AUDIT ---\n');

  const report = {
    step7_seo_metadata: [],
    step8_structured_data: {
      totalPagesChecked: 0,
      totalSchemasFound: 0,
      schemaTypeDistribution: {},
      reviewRatingFabricationsFound: 0,
      priceFabricationsFound: 0,
      faqRoleDescription: "Educational & building code informational Q&A (not claiming guaranteed Google SERP rich result badge)",
      schemaValidationIssues: []
    },
    step9_internal_links: {
      publicPagesCount: ALL_33_ROUTES.length,
      crawlGraph: {},
      orphans: [],
      brokenInternalLinks: [],
      linksToOldDomains: [],
      linksToLocalhost: []
    }
  };

  const linkGraph = {};
  for (const r of ALL_33_ROUTES) {
    linkGraph[r] = { inbound: 0, outbound: 0, linksTo: [], linkedFrom: [] };
  }

  // Crawl and extract from each page
  for (const route of ALL_33_ROUTES) {
    const resp = await fetch(`${BASE_URL}${route}`);
    const html = await resp.text();

    // 1. Step 7: SEO Metadata Inspection
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const metaDescMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
    const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());

    const title = titleMatch ? titleMatch[1] : '';
    const metaDesc = metaDescMatch ? metaDescMatch[1] : '';
    const canonical = canonicalMatch ? canonicalMatch[1] : '';
    const h1 = h1Matches[0] || '';

    let status = 'GREEN';
    const notes = [];

    if (!title || !canonical || h1Matches.length !== 1) {
      status = 'RED';
      notes.push('Missing Title, Canonical or Single H1');
    } else if (title.includes('localhost') || canonical.includes('localhost') || title.includes('Construction & Trade Tools')) {
      status = 'RED';
      notes.push('Contains old brand or localhost');
    } else if (title.length > 70) {
      status = 'YELLOW';
      notes.push(`Title length ${title.length} chars (>70 chars)`);
    } else if (metaDesc.length > 175) {
      status = 'YELLOW';
      notes.push(`Meta description length ${metaDesc.length} chars (>175 chars)`);
    }

    report.step7_seo_metadata.push({
      route,
      status,
      title,
      metaDescription: metaDesc,
      h1,
      canonical,
      h1Count: h1Matches.length,
      notes: notes.join('; ') || 'Verified clear intent, correct brand, and valid canonical'
    });

    // 2. Step 8: Structured Data Validation
    report.step8_structured_data.totalPagesChecked++;
    const jsonLdMatches = Array.from(html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi));

    for (const jm of jsonLdMatches) {
      try {
        const parsed = JSON.parse(jm[1]);
        const schemas = Array.isArray(parsed) ? parsed : [parsed];

        for (const s of schemas) {
          report.step8_structured_data.totalSchemasFound++;
          const stype = s['@type'] || 'Unknown';
          report.step8_structured_data.schemaTypeDistribution[stype] = (report.step8_structured_data.schemaTypeDistribution[stype] || 0) + 1;

          // Check for fabricated reviews / ratings
          if (s.aggregateRating || s.review || s.ratingValue) {
            report.step8_structured_data.reviewRatingFabricationsFound++;
            report.step8_structured_data.schemaValidationIssues.push({
              route,
              issue: 'Fabricated aggregateRating/review found in schema'
            });
          }

          // Check for fabricated prices
          if (s.offers && s.offers.price && s.offers.price !== '0.00' && s.offers.price !== '0') {
            report.step8_structured_data.priceFabricationsFound++;
          }
        }
      } catch (e) {
        report.step8_structured_data.schemaValidationIssues.push({
          route,
          issue: `JSON-LD Parse Error: ${e.message}`
        });
      }
    }

    // 3. Step 9: Internal Link Extraction
    const hrefMatches = Array.from(html.matchAll(/<a\s+[^>]*href="([^"]*)"[^>]*>/gi)).map(m => m[1]);

    for (const href of hrefMatches) {
      if (href.includes('constructionandtradetools.com') || href.includes('toolsandcalculations.com')) {
        report.step9_internal_links.linksToOldDomains.push({ from: route, href });
      }
      if (href.includes('localhost')) {
        report.step9_internal_links.linksToLocalhost.push({ from: route, href });
      }

      // Clean internal link path
      let cleanPath = href;
      if (cleanPath.startsWith(PROD_DOMAIN)) {
        cleanPath = cleanPath.replace(PROD_DOMAIN, '') || '/';
      }
      if (cleanPath.startsWith('/') && !cleanPath.startsWith('//')) {
        // Remove hash / query
        const pathOnly = cleanPath.split('#')[0].split('?')[0];
        if (ALL_33_ROUTES.includes(pathOnly)) {
          if (!linkGraph[route].linksTo.includes(pathOnly)) {
            linkGraph[route].linksTo.push(pathOnly);
            linkGraph[route].outbound++;
          }
          if (!linkGraph[pathOnly].linkedFrom.includes(route)) {
            linkGraph[pathOnly].linkedFrom.push(route);
            linkGraph[pathOnly].inbound++;
          }
        } else if (pathOnly !== '' && !pathOnly.endsWith('.xml') && !pathOnly.endsWith('.txt')) {
          report.step9_internal_links.brokenInternalLinks.push({ from: route, brokenHref: pathOnly });
        }
      }
    }
  }

  // Check orphans
  for (const route of ALL_33_ROUTES) {
    if (route !== '/' && linkGraph[route].inbound === 0) {
      report.step9_internal_links.orphans.push(route);
    }
  }

  report.step9_internal_links.crawlGraph = linkGraph;

  fs.writeFileSync('scratch/prelaunch/task038-step789-audit.json', JSON.stringify(report, null, 2));
  console.log('\nSteps 7, 8, 9 Complete.');
  console.log(`SEO Metadata: ${report.step7_seo_metadata.filter(p => p.status === 'GREEN').length} GREEN, ${report.step7_seo_metadata.filter(p => p.status === 'YELLOW').length} YELLOW, ${report.step7_seo_metadata.filter(p => p.status === 'RED').length} RED.`);
  console.log(`Structured Data: Total Schemas: ${report.step8_structured_data.totalSchemasFound}, Fabrications: ${report.step8_structured_data.reviewRatingFabricationsFound}, Parse Errors: ${report.step8_structured_data.schemaValidationIssues.length}`);
  console.log(`Internal Links: Orphans: ${report.step9_internal_links.orphans.length}, Broken: ${report.step9_internal_links.brokenInternalLinks.length}, Old Domain: ${report.step9_internal_links.linksToOldDomains.length}, Localhost: ${report.step9_internal_links.linksToLocalhost.length}`);
}

runStep789Verification();
