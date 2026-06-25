const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
if (!slug) {
  console.error("Please specify a slug.");
  process.exit(1);
}

const dbCodesPath = path.join(__dirname, 'db_codes_clean.json');
const dbCodes = JSON.parse(fs.readFileSync(dbCodesPath, 'utf8'));

const algo = dbCodes[slug];
if (!algo) {
  console.error(`Slug ${slug} not found in db_codes.json`);
  process.exit(1);
}

console.log(`=== DB Codes for: ${algo.name} (${slug}) ===\n`);
for (const lang in algo.codes) {
  console.log(`--- Language: ${lang} ---`);
  const lines = algo.codes[lang].split('\n');
  lines.forEach((line, idx) => {
    console.log(`${idx + 1}: ${line}`);
  });
  console.log('\n');
}
