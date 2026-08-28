const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/data/guides');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const parsedCode = content.replace(/^export\s+const\s+/gm, 'const ');
    new Function(parsedCode);
  } catch (err) {
    console.log(`\n--- FAILED: ${file} ---`);
    console.log(err.message);
  }
}
