import fs from 'fs';

const updates = [
  {
    file: 'src/components/tools/deck-calculator/deck-form.tsx',
    storageKey: 'saved_deck_config',
    setterFn: `const stored = localStorage.getItem("saved_deck_config");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.lengthFt) setLengthFt(data.lengthFt);
        if (data.widthFt) setWidthFt(data.widthFt);
        if (data.boardType) setBoardType(data.boardType);
        if (data.joistSpacingInches) setJoistSpacingInches(data.joistSpacingInches);
      }`
  },
  {
    file: 'src/components/tools/framing-calculator/framing-form.tsx',
    storageKey: 'saved_framing_config',
    setterFn: `const stored = localStorage.getItem("saved_framing_config");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.walls) setWalls(data.walls);
        if (data.wastePercent !== undefined) setWastePercent(data.wastePercent);
      }`
  },
  {
    file: 'src/components/tools/hvac-calculator/hvac-form.tsx',
    storageKey: 'saved_hvac_config',
    setterFn: `const stored = localStorage.getItem("saved_hvac_config");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.floorAreaSqFt) setFloorAreaSqFt(data.floorAreaSqFt);
        if (data.ceilingHeightFt) setCeilingHeightFt(data.ceilingHeightFt);
        if (data.climateZone) setClimateZone(data.climateZone);
        if (data.insulationGrade) setInsulationGrade(data.insulationGrade);
      }`
  },
  {
    file: 'src/components/tools/plumbing-dfu-calculator/plumbing-dfu-form.tsx',
    storageKey: 'saved_dfu_config',
    setterFn: `const stored = localStorage.getItem("saved_dfu_config");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.codeStandard) setCodeStandard(data.codeStandard);
        if (data.systemType) setSystemType(data.systemType);
        if (data.pipeSlope) setPipeSlope(data.pipeSlope);
        if (data.fixtures) setFixtures(data.fixtures);
      }`
  },
  {
    file: 'src/components/tools/stair-calculator/stair-form.tsx',
    storageKey: 'saved_stair_config',
    setterFn: `const stored = localStorage.getItem("saved_stair_config");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.totalRiseInches) setTotalRiseInches(data.totalRiseInches);
        if (data.targetRiserHeightInches) setTargetRiserHeightInches(data.targetRiserHeightInches);
        if (data.targetTreadDepthInches) setTargetTreadDepthInches(data.targetTreadDepthInches);
      }`
  }
];

for (const u of updates) {
  let txt = fs.readFileSync(u.file, 'utf8');

  // 1. Fix PDF Blueprint to Print Worksheet
  txt = txt.replace(/label="PDF Blueprint"/g, 'label="Print Worksheet"');

  // 2. Fix Save button labels
  txt = txt.replace(/<span>\{saved \? "Saved!" : "Save"\}<\/span>/g, '<span>{saved ? "Saved on this device" : "Save on This Device"}</span>');

  // 3. Update reset to clear localStorage
  txt = txt.replace(/const resetAll = \(\) => \{/g, `const resetAll = () => {\n    try { localStorage.removeItem("${u.storageKey}"); } catch {}`);

  fs.writeFileSync(u.file, txt, 'utf8');
  console.log('Updated Save & Print in:', u.file);
}

// Also check conduit-form.tsx for PDF Blueprint
let conduitTxt = fs.readFileSync('src/components/tools/conduit-fill-calculator/conduit-form.tsx', 'utf8');
conduitTxt = conduitTxt.replace(/label="PDF Blueprint"/g, 'label="Print Worksheet"');
fs.writeFileSync('src/components/tools/conduit-fill-calculator/conduit-form.tsx', conduitTxt, 'utf8');
console.log('Updated conduit-form.tsx');
