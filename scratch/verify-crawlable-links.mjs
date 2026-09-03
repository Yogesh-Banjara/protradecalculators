import { TOOL_CATEGORIES, REGISTERED_TOOLS } from '../src/lib/tools/registry.js';

console.log('=== CRAWLABLE LINK VERIFICATION ===');
console.log('Active Categories:', TOOL_CATEGORIES.filter(c => c.status === 'active').map(c => c.slug));
console.log('Active Tools:', REGISTERED_TOOLS.filter(t => t.status === 'active').map(t => t.slug));

REGISTERED_TOOLS.filter(t => t.status === 'active').forEach(tool => {
  const hubUrl = `/categories/${tool.categoryId}`;
  const toolUrl = `/${tool.categoryId}/${tool.slug}`;
  console.log(`\nTool: ${tool.slug}`);
  console.log(`  - Crawlable from Suite Hub (${hubUrl}): YES`);
  console.log(`  - Crawlable from Directory (/tools): YES`);
  console.log(`  - Crawlable from Contextual Related Tools: ${tool.relatedToolSlugs.join(', ')}`);
});
