const fs = require('fs');
const path = require('path');

const dbCodesPath = path.join(__dirname, 'db_codes.json');
if (!fs.existsSync(dbCodesPath)) {
  console.error("db_codes.json not found.");
  process.exit(1);
}

const dbCodes = JSON.parse(fs.readFileSync(dbCodesPath, 'utf8'));

function stripCommentsAndEmptyLines(code, lang) {
  if (!code) return '';
  let clean = code;
  if (lang === 'python') {
    clean = clean.replace(/#.*$/gm, '');
  } else {
    clean = clean.replace(/\/\*[\s\S]*?\*\//g, '');
    clean = clean.replace(/\/\/.*$/gm, '');
  }
  
  // Filter out completely empty or whitespace-only lines
  const lines = clean.split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.trim() !== '');
  
  return lines.join('\n').trim();
}

const cleanDbCodes = {};
for (const slug in dbCodes) {
  cleanDbCodes[slug] = {
    name: dbCodes[slug].name,
    codes: {}
  };
  for (const lang in dbCodes[slug].codes) {
    cleanDbCodes[slug].codes[lang] = stripCommentsAndEmptyLines(dbCodes[slug].codes[lang], lang);
  }
}

fs.writeFileSync(path.join(__dirname, 'db_codes_clean.json'), JSON.stringify(cleanDbCodes, null, 2));
console.log("Saved clean database codes to db_codes_clean.json");
