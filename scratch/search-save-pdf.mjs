import fs from 'fs';
import path from 'path';

function walk(dir, list = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full, list);
    else if (f.endsWith('.tsx') || f.endsWith('.ts')) list.push(full);
  }
  return list;
}

const files = walk('src');
console.log('Searching for localStorage and Save across', files.length, 'files...');

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('localStorage') || content.includes('Save') || content.includes('save') || content.includes('Blueprint') || content.includes('PDF')) {
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('localStorage') || line.toLowerCase().includes('pdf') || line.toLowerCase().includes('blueprint') || line.includes('Save')) {
        console.log(`${file.replace(/\\/g, '/')}:${idx + 1} -> ${line.trim()}`);
      }
    });
  }
}
