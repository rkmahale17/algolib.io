const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace only dark with light dark
  content = content.replace(/content="only dark"/g, 'content="light dark"');

  fs.writeFileSync(filePath, content);
  console.log(`Updated meta tags in ${file}`);
}
