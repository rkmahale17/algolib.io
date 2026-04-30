const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

const extremeHoverStyle = `
        <style>{\`
          @media (prefers-color-scheme: dark) {
            body, table, td, p, span, a {
              color: #ffffff !important;
              -webkit-text-fill-color: #ffffff !important;
            }
          }
          .cta-button {
            transition: all 0.2s ease-in-out !important;
            box-shadow: 0 4px 12px rgba(132, 204, 22, 0.4) !important;
          }
          .cta-button:hover, .cta-button:focus {
            background-color: #98e61a !important;
            box-shadow: 0 10px 28px rgba(132, 204, 22, 0.7) !important;
            transform: translateY(-3px) !important;
            outline: none !important;
          }
        \`}</style>`;

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Move padding from Heading column back to Logo column (but 8px)
  // Remove paddingLeft: '16px' from Heading column
  content = content.replace(/paddingLeft: '16px', verticalAlign: 'middle'/g, "verticalAlign: 'middle'");
  
  // Update Logo Column to have 8px paddingRight
  content = content.replace(/<Column style=\{\{ width: '42px', verticalAlign: 'middle' \}\}>/g, "<Column style={{ width: '42px', verticalAlign: 'middle', paddingRight: '8px' }}>");

  // 2. Update Style Block for extreme hover/focus shadow
  content = content.replace(/<style>\{`[\s\S]*?`\}<\/style>/, extremeHoverStyle);

  fs.writeFileSync(filePath, content);
  console.log(`Final polish applied to ${file}`);
}
