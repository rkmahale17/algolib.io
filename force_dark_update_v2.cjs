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
        \`}</style>`;

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add forceDarkWrapper to imports
  content = content.replace(/import \{([\s\S]+?)\} from '\.\/shared\.tsx'/, (match, p1) => {
    if (!p1.includes('forceDarkWrapper')) {
      return `import {${p1.trim()},\n  forceDarkWrapper} from './shared.tsx'`;
    }
    return match;
  });

  // 2. Update meta tags to strict "dark"
  content = content.replace(/content="dark light"/g, 'content="dark"');
  content = content.replace(/content="light dark"/g, 'content="dark"');

  // 3. Add Apple-specific style hack in <Head>
  if (!content.includes('prefers-color-scheme: dark')) {
    content = content.replace('</Head>', `${appleHackStyle}\n      </Head>`);
  }

  // 4. Wrap body content in forceDarkWrapper div
  // We look for <Body ...> and the closing </Body>
  // We wrap everything between the first <Container and the last </Container>
  if (!content.includes('style={forceDarkWrapper}')) {
      content = content.replace(/<Body([\s\S]+?)>([\s\S]+?)<\/Body>/, (match, p1, p2) => {
          return `<Body${p1}>\n        <div style={forceDarkWrapper}>\n${p2}\n        </div>\n      </Body>`;
      });
  }

  // 5. Ensure WebkitTextFillColor is added to any inline styles that have color
  // This is a bit tricky with regex but I'll try to find style={{ color: ... }}
  content = content.replace(/style=\{\{\s*color:\s*([^,}]+)([^}]*)\}\}/g, (match, p1, p2) => {
      if (!p2.includes('WebkitTextFillColor')) {
          return `style={{ color: ${p1}, WebkitTextFillColor: ${p1}${p2} }}`;
      }
      return match;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file} for strict dark mode forcing`);
}
