const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Force Column width to 52px
  content = content.replace(/<Column style=\{\{[\s\S]*?width:\s*'\d+px'[\s\S]*?\}\}>([\s\S]*?src=\{LOGO_URL\}[\s\S]*?)<\/Column>/g, (match, inner) => {
    return `<Column style={{ width: '52px', verticalAlign: 'middle' }}>${inner}</Column>`;
  });

  // 2. Force Img width to 42 and height to 39 for the logo specifically
  content = content.replace(/(src=\{LOGO_URL\}[\s\S]*?)width="\d+"/, '$1width="42"');
  content = content.replace(/(src=\{LOGO_URL\}[\s\S]*?)height="\d+"/, '$1height="39"');
  
  // Also handle if width comes BEFORE src
  content = content.replace(/width="\d+"([\s\S]*?src=\{LOGO_URL\})/, 'width="42"$1');
  content = content.replace(/height="\d+"([\s\S]*?src=\{LOGO_URL\})/, 'height="39"$1');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
}
