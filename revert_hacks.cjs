const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Revert text-force-white
  content = content.replace(
    /color: #ffffff !important; background-image: linear-gradient\(#ffffff, #ffffff\) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; }/g, 
    'color: #ffffff !important; }'
  );
  
  // Revert text-force-grey
  content = content.replace(
    /color: #f2f2f2 !important; background-image: linear-gradient\(#f2f2f2, #f2f2f2\) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; }/g, 
    'color: #f2f2f2 !important; }'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Reverted ${file}`);
}
