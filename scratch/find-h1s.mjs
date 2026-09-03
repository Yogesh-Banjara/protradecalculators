import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk('src');
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = Array.from(content.matchAll(/<h1[\s\S]*?>/gi));
  if (matches.length > 0) {
    console.log(`${file}: found ${matches.length} <h1`);
  }
}
