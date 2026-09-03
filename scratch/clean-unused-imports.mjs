import fs from 'fs';

const files = [
  'src/components/tools/box-fill-calculator/box-fill-form.tsx',
  'src/components/tools/concrete-calculator/concrete-form.tsx',
  'src/components/tools/conduit-fill-calculator/conduit-form.tsx',
  'src/components/tools/deck-calculator/deck-form.tsx',
  'src/components/tools/drywall-calculator/drywall-form.tsx',
  'src/components/tools/duct-calculator/duct-form.tsx',
  'src/components/tools/electrical-load-calculator/electrical-load-form.tsx',
  'src/components/tools/framing-calculator/framing-form.tsx',
  'src/components/tools/gravel-calculator/gravel-form.tsx',
  'src/components/tools/hvac-calculator/hvac-form.tsx',
  'src/components/tools/plumbing-dfu-calculator/plumbing-dfu-form.tsx',
  'src/components/tools/roof-calculator/roof-form.tsx',
  'src/components/tools/stair-calculator/stair-form.tsx',
  'src/components/tools/voltage-drop-calculator/voltage-drop-form.tsx'
];

for (const f of files) {
  let txt = fs.readFileSync(f, 'utf8');
  txt = txt.replace(/import { siteConfig } from "@\/config\/site";\r?\n/, '');
  fs.writeFileSync(f, txt, 'utf8');
  console.log('Cleaned:', f);
}
console.log('Unused siteConfig imports removed.');
