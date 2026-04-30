const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update logo dimensions: width 42, height 39
  content = content.replace(/Img src=\{LOGO_URL\} width="\d+" height="\d+"/g, 'Img src={LOGO_URL} width="42" height="39"');
  
  // 2. Lock the TD/Column width to exactly 42px (no padding or extra space)
  // We search for the Column wrapping the logo
  content = content.replace(/<Column style=\{\{ width: '\d+px', paddingRight: '12px', verticalAlign: 'middle' \}\}>/g, "<Column style={{ width: '42px', verticalAlign: 'middle' }}>");
  content = content.replace(/<Column style=\{\{ width: '\d+px', verticalAlign: 'middle' \}\}>/g, "<Column style={{ width: '42px', verticalAlign: 'middle' }}>");

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file} with 42px logo lock`);
}
