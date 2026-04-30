const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update logo Img dimensions (robust multi-line regex)
  content = content.replace(/<Img[\s\S]*?src=\{LOGO_URL\}[\s\S]*?width="\d+"[\s\S]*?height="\d+"[\s\S]*?\/>/g, (match) => {
    return match
      .replace(/width="\d+"/, 'width="42"')
      .replace(/height="\d+"/, 'height="39"');
  });

  // 2. Update Column width to exactly 52px
  // We look for the Column that contains LOGO_URL
  content = content.replace(/<Column style=\{\{[\s\S]*?width:\s*'\d+px'[\s\S]*?\}\}>([\s\S]*?src=\{LOGO_URL\}[\s\S]*?)<\/Column>/g, (match, inner) => {
    return `<Column style={{ width: '52px', verticalAlign: 'middle' }}>${inner}</Column>`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Force updated ${file} with 52px column and 42x39 logo`);
}
