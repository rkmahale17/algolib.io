const fs = require('fs');
const path = require('path');

const targetIds = [
  'product-of-array-except-self',
  'maximum-subarray',
  'maximum-product-subarray',
  'find-minimum-in-rotated-sorted-array',
  'search-in-rotated-sorted-array',
  'three-sum',
  '3sum',
  'container-with-most-water',
  'sum-of-two-integers',
  'number-of-1-bits',
  'counting-bits'
];

const solutionsPath = path.join(__dirname, 'solutions.json');
if (!fs.existsSync(solutionsPath)) {
  console.error("solutions.json not found.");
  process.exit(1);
}

const solutions = JSON.parse(fs.readFileSync(solutionsPath, 'utf8'));

function stripCommentsAndEmptyLines(code, lang) {
  if (!code) return '';
  let clean = code;
  if (lang.toLowerCase() === 'python') {
    // Remove docstrings
    clean = clean.replace(/"""[\s\S]*?"""/g, '');
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

const results = {};

for (const targetId of targetIds) {
  let problem = solutions.find(p => p.id === targetId);
  
  if (!problem) {
    problem = solutions.find(p => p.id.toLowerCase().includes(targetId.toLowerCase()) || targetId.toLowerCase().includes(p.id.toLowerCase()));
  }
  
  if (problem) {
    if (results[problem.id]) continue;
    console.log(`Found match: Target "${targetId}" -> Solution ID: "${problem.id}" (${problem.name})`);
    
    results[problem.id] = {
      name: problem.name,
      id: problem.id,
      languages: {}
    };
    
    for (const impl of problem.implementations) {
      const lang = impl.lang.toLowerCase();
      const codeObj = impl.code.find(c => c.codeType === 'optimize');
      if (codeObj) {
        results[problem.id].languages[lang] = {
          raw: codeObj.code,
          clean: stripCommentsAndEmptyLines(codeObj.code, lang)
        };
      }
    }
  } else {
    console.log(`No match found for: "${targetId}"`);
  }
}

fs.writeFileSync(path.join(__dirname, 'batch_2_clean_codes.json'), JSON.stringify(results, null, 2));
console.log("Saved clean codes to batch_2_clean_codes.json");
