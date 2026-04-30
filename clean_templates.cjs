const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace meta tags with "dark light"
  content = content.replace(/<meta name="color-scheme"[^>]+>/g, '<meta name="color-scheme" content="dark light" />');
  content = content.replace(/<meta name="supported-color-schemes"[^>]+>/g, '<meta name="supported-color-schemes" content="dark light" />');

  // Remove the <style> block completely from <Head>
  content = content.replace(/\s*<style>\{`[\s\S]*?`\}<\/style>/g, '');

  fs.writeFileSync(filePath, content);
  console.log(`Cleaned up ${file}`);
}
