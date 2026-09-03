// WCAG 2.1 Relative Luminance & Contrast Ratio Calculator

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function getsRGB(c) {
  c = c / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * getsRGB(r) + 0.7152 * getsRGB(g) + 0.0722 * getsRGB(b);
}

function getContrast(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const pairs = [
  { name: "Primary Dark Text on White Card", fg: "#0f172a", bg: "#ffffff" }, // slate-900 on white
  { name: "Secondary Text on White Card", fg: "#334155", bg: "#ffffff" }, // slate-700 on white
  { name: "Muted Text on White Card", fg: "#475569", bg: "#ffffff" }, // slate-600 on white
  { name: "Amber Brand Button (Dark Text on Amber)", fg: "#020617", bg: "#f59e0b" }, // slate-950 on amber-500
  { name: "Amber Brand Result on Dark Canvas", fg: "#fbbf24", bg: "#020617" }, // amber-400 on slate-950
  { name: "Cyan Result on Dark Canvas", fg: "#22d3ee", bg: "#020617" }, // cyan-400 on slate-950
  { name: "Emerald Metric on Dark Canvas", fg: "#34d399", bg: "#020617" }, // emerald-400 on slate-950
  { name: "White Primary Text on Slate-900 Surface", fg: "#f8fafc", bg: "#0f172a" }, // slate-50 on slate-900
  { name: "Muted Label on Slate-900 Surface", fg: "#94a3b8", bg: "#0f172a" }, // slate-400 on slate-900
  { name: "Error Text on White Card", fg: "#dc2626", bg: "#ffffff" }, // red-600 on white
  { name: "Dark Text on Amber-50 Surface", fg: "#78350f", bg: "#fffbeb" }, // amber-900 on amber-50
];

console.log("=== WCAG 2.1 Color Contrast Measurements ===");
for (const p of pairs) {
  const ratio = getContrast(p.fg, p.bg);
  const aaNormal = ratio >= 4.5 ? "PASS (AA)" : "FAIL";
  const aaaNormal = ratio >= 7.0 ? "PASS (AAA)" : "FAIL (AA only)";
  console.log(`${p.name}:`);
  console.log(`  FG: ${p.fg} | BG: ${p.bg} -> Ratio: ${ratio.toFixed(2)}:1 | Normal text: ${aaNormal} | Large text: ${ratio >= 3.0 ? "PASS" : "FAIL"}`);
}
