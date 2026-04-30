const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add padding-right to the logo column to separate it from the text
  content = content.replace(/<Column style=\{\{ width: '52px', verticalAlign: 'middle' \}\}>/g, "<Column style={{ width: '52px', verticalAlign: 'middle', paddingRight: '16px' }}>");
  
  // 2. Ensure the heading column also has vertical alignment
  content = content.replace(/<Column style=\{\{ verticalAlign: 'middle' \}\}>/g, "<Column style={{ verticalAlign: 'middle' }}>");

  fs.writeFileSync(filePath, content);
  console.log(`Updated spacing in ${file}`);
}
