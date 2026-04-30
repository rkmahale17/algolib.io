const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

const appleHackStyle = `
        <style>{\`
          @media (prefers-color-scheme: dark) {
            body, table, td, p, span, a {
              color: #ffffff !important;
              -webkit-text-fill-color: #ffffff !important;
            }
          }
          .cta-button:hover {
            background-color: #98e61a !important;
          }
        \`}</style>`;

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update logo size
  content = content.replace(/Img src=\{LOGO_URL\} width="30"/g, 'Img src={LOGO_URL} width="36"');
  content = content.replace(/style=\{\{ width: '42px'/g, "style={{ width: '50px'"); // Column width for logo

  // 2. Update button to have cta-button class
  content = content.replace(/Link href=\{confirmationUrl\} style=\{buttonStyle\}/g, 'Link href={confirmationUrl} className="cta-button" style={buttonStyle}');
  content = content.replace(/Link href=\{link\} style=\{buttonStyle\}/g, 'Link href={link} className="cta-button" style={buttonStyle}');
  
  // 3. Ensure the Apple hack and Hover style is in Head
  if (content.includes('<style>')) {
      content = content.replace(/<style>\{`[\s\S]*?`\}<\/style>/, appleHackStyle);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file} for new design`);
}
