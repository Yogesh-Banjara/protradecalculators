import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.next' || item === '.git' || item === '.tempmediaStorage') continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

const targets = [
  'Construction & Trade Tools',
  'I Trade Hub',
  'constructionandtradetools.com',
  'toolsandcalculations.com',
  'tools-and-calculators.com',
  'itradehub.net'
];

const files = walk('src').concat(walk('tests'));
const matches = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  for (const t of targets) {
    if (content.includes(t)) {
      matches.push({ file: f, target: t });
    }
  }
}

console.log('Brand & Domain references found:');
matches.forEach(m => console.log(`- [${m.target}] in ${m.file}`));
