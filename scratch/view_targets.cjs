const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'extracted_targets.json');
const targets = JSON.parse(fs.readFileSync(filePath, 'utf8'));

for (const [id, data] of Object.entries(targets)) {
  console.log(`=== ID: ${id} ===`);
  console.log(`Name: ${data.name}`);
  console.log(`Languages available: ${Object.keys(data.languages).join(', ')}`);
  if (data.languages.typescript) {
    console.log(`TypeScript Code length: ${data.languages.typescript.length} chars`);
  } else {
    console.log(`WARNING: NO TYPESCRIPT CODE FOR ${id}!`);
  }
}
