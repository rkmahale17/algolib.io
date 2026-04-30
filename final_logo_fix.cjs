const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Force Column width to 52px for the logo column
  content = content.replace(/<Column style=\{\{[\s\S]*?width:\s*'\d+px'[\s\S]*?\}\}>([\s\S]*?src=\{LOGO_URL\}[\s\S]*?)<\/Column>/g, (match, inner) => {
    return `<Column style={{ width: '52px', verticalAlign: 'middle' }}>${inner}</Column>`;
  });

  // 2. Force Img width to 42 and height to 39 for the logo
  // We'll just replace any width/height inside a tag that contains LOGO_URL
  content = content.replace(/<Img[\s\S]*?src=\{LOGO_URL\}[\s\S]*?\/>/g, (match) => {
    let updated = match;
    updated = updated.replace(/width="\d+"/, 'width="42"');
    updated = updated.replace(/height="\d+"/, 'height="39"');
    return updated;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Verified and fixed ${file}`);
}
