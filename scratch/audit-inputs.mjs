import fs from 'fs';
import path from 'path';

function walk(dir, list = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full, list);
    else if (f.endsWith('.tsx')) list.push(full);
  }
  return list;
}

const files = walk('src/components/tools');
console.log('Auditing input components across', files.length, 'tool component files...');

const rawInputs = [];
const unitInputs = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('<input')) {
      rawInputs.push({ file: file.replace(/\\/g, '/'), line: idx + 1, text: line.trim() });
    }
    if (line.includes('<UnitInput')) {
      unitInputs.push({ file: file.replace(/\\/g, '/'), line: idx + 1, text: line.trim() });
    }
  });
}

console.log('\n--- RAW <input> USAGES (' + rawInputs.length + ') ---');
rawInputs.forEach(i => console.log(`${i.file}:${i.line} -> ${i.text}`));

console.log('\n--- <UnitInput> USAGES (' + unitInputs.length + ') ---');
unitInputs.forEach(i => console.log(`${i.file}:${i.line} -> ${i.text}`));
