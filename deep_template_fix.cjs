const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

const hoverStyle = `
        <style>{\`
          @media (prefers-color-scheme: dark) {
            body, table, td, p, span, a {
              color: #ffffff !important;
              -webkit-text-fill-color: #ffffff !important;
            }
          }
          .cta-button {
            transition: all 0.2s ease-in-out !important;
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

  // 1. Fix Hero Image Width (Must be 600)
  content = content.replace(/(src=\{HERO_IMAGE_URL\}[\s\S]*?)width="\d+"/, '$1width="600"');

  // 2. Fix Logo Column (Exactly 42px) and Logo Img (42x39)
  // We search for the Column containing the LOGO_URL
  content = content.replace(/<Column style=\{\{[\s\S]*?width:\s*'\d+px'[\s\S]*?\}\}>([\s\S]*?src=\{LOGO_URL\}[\s\S]*?)<\/Column>/g, (match, inner) => {
    let fixedInner = inner
      .replace(/width="\d+"/, 'width="42"')
      .replace(/height="\d+"/, 'height="39"');
    return `<Column style={{ width: '42px', verticalAlign: 'middle' }}>${fixedInner}</Column>`;
  });

  // 3. Add padding-left to the Heading column to prevent it from touching the logo
  // The heading column is usually the next Column after the logo column
  content = content.replace(/(<\/Column>\s+<Column style=\{\{)( verticalAlign: 'middle' \}\}>)/g, "$1 paddingLeft: '16px',$2");

  // 4. Ensure CTA button has both the class and the style
  content = content.replace(/<Link href=\{.*?\} style=\{buttonStyle\}/g, (match) => {
      if (!match.includes('className="cta-button"')) {
          return match.replace('<Link', '<Link className="cta-button"');
      }
      return match;
  });
  
  // 5. Ensure the style block is correct
  content = content.replace(/<style>\{`[\s\S]*?`\}<\/style>/, hoverStyle);

  fs.writeFileSync(filePath, content);
  console.log(`Deep fixed ${file}`);
}
