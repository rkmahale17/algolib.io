const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

const advancedHoverStyle = `
        <style>{\`
          @media (prefers-color-scheme: dark) {
            body, table, td, p, span, a {
              color: #ffffff !important;
              -webkit-text-fill-color: #ffffff !important;
            }
          }
          .cta-button {
            transition: all 0.2s ease-in-out !important;
            box-shadow: 0 4px 12px rgba(132, 204, 22, 0.3) !important;
          }
          .cta-button:hover {
            background-color: #98e61a !important;
            box-shadow: 0 6px 20px rgba(132, 204, 22, 0.5) !important;
            transform: translateY(-2px) !important;
          }
        \`}</style>`;

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the old style block with the new advanced one
  content = content.replace(/<style>\{`[\s\S]*?`\}<\/style>/, advancedHoverStyle);

  fs.writeFileSync(filePath, content);
  console.log(`Elevated experience in ${file}`);
}
