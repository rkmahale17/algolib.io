const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add mix-blend-mode to text-force-white and text-force-grey
  content = content.replace(/color: #ffffff !important; }/g, 'color: #ffffff !important; mix-blend-mode: difference; }');
  content = content.replace(/color: #f2f2f2 !important; }/g, 'color: #f2f2f2 !important; mix-blend-mode: difference; }');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
}
