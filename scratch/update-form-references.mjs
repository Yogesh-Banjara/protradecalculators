import fs from 'fs';

const mapping = [
  {
    file: 'src/components/tools/box-fill-calculator/box-fill-form.tsx',
    ref: 'Reference: NEC 2023 Section 314.16 Box Volume Allowances'
  },
  {
    file: 'src/components/tools/concrete-calculator/concrete-form.tsx',
    ref: 'Reference: ACI 318 Ready-Mix & Bagged Sizing Formulas'
  },
  {
    file: 'src/components/tools/conduit-fill-calculator/conduit-form.tsx',
    ref: 'Reference: NEC 2023 Chapter 9 Tables 1, 4 & 5 Raceway Limits'
  },
  {
    file: 'src/components/tools/deck-calculator/deck-form.tsx',
    ref: 'Reference: IRC 2024 Table R507 Prescriptive Deck Sizing'
  },
  {
    file: 'src/components/tools/drywall-calculator/drywall-form.tsx',
    ref: 'Reference: Standard Sheet Goods & Joint Compound Takeoff Schedules'
  },
  {
    file: 'src/components/tools/duct-calculator/duct-form.tsx',
    ref: 'Reference: Equal Friction Airflow & Huebscher Duct Equivalence Formulations'
  },
  {
    file: 'src/components/tools/electrical-load-calculator/electrical-load-form.tsx',
    ref: 'Reference: NEC 2023 Article 220.82 Optional Residential Load Method'
  },
  {
    file: 'src/components/tools/framing-calculator/framing-form.tsx',
    ref: 'Reference: Prescriptive Wall Stud & Plate Takeoff Standards'
  },
  {
    file: 'src/components/tools/gravel-calculator/gravel-form.tsx',
    ref: 'Reference: Bulk Aggregate Density & Compaction Schedules'
  },
  {
    file: 'src/components/tools/hvac-calculator/hvac-form.tsx',
    ref: 'Reference: Simplified ACCA Manual J Design Principles'
  },
  {
    file: 'src/components/tools/plumbing-dfu-calculator/plumbing-dfu-form.tsx',
    ref: 'Reference: IPC 2024 Table 709 / UPC 2024 Table 702 Drainage Fixture Units'
  },
  {
    file: 'src/components/tools/roof-calculator/roof-form.tsx',
    ref: 'Reference: Standard Pitch Geometry & Rafter Line Formulas'
  },
  {
    file: 'src/components/tools/stair-calculator/stair-form.tsx',
    ref: 'Reference: IRC 2024 Section R311.7 Prescriptive Sizing Limits'
  },
  {
    file: 'src/components/tools/voltage-drop-calculator/voltage-drop-form.tsx',
    ref: 'Reference: NEC 2023 Table 310.16 & Conductor Resistance Schedules'
  }
];

for (const { file, ref } of mapping) {
  let txt = fs.readFileSync(file, 'utf8');
  txt = txt.replace(/`Source: \${siteConfig\.name} \(\${siteConfig\.url}[^`]*\)`/g, `"${ref}"`);
  fs.writeFileSync(file, txt, 'utf8');
  console.log(`Updated ${file} -> "${ref}"`);
}
console.log('All 14 forms updated to clean technical reference attribution.');
