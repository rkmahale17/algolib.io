const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the old mix-blend-mode hack with the bulletproof Linear Gradient Text Hack
  content = content.replace(
    /color: #ffffff !important; mix-blend-mode: difference; }/g, 
    'color: #ffffff !important; background-image: linear-gradient(#ffffff, #ffffff) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; }'
  );
  
  content = content.replace(
    /color: #f2f2f2 !important; mix-blend-mode: difference; }/g, 
    'color: #f2f2f2 !important; background-image: linear-gradient(#f2f2f2, #f2f2f2) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; }'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file} with Linear Gradient Hack`);
}
