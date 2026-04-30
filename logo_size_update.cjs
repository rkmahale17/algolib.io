const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Update logo dimensions to 42x39
  content = content.replace(/Img src=\{LOGO_URL\} width="\d+" height="\d+"/g, 'Img src={LOGO_URL} width="42" height="39"');
  
  // Also update the Column width to match the new logo size (42 + padding)
  content = content.replace(/style=\{\{ width: '50px'/g, "style={{ width: '54px'");

  fs.writeFileSync(filePath, content);
  console.log(`Updated logo dimensions in ${file}`);
}
