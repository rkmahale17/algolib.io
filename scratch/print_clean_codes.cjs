const fs = require('fs');
const path = require('path');

const targetIds = [
  'subsets',
  'permutations',
  'combinations',
  'word-search',
  'n-queens',
  'sudoku-solver',
  'xor-trick',
  'count-bits',
  'subset-generation-bits',
  'kth-largest'
];

const cleanCodes = JSON.parse(fs.readFileSync(path.join(__dirname, 'target_clean_codes.json'), 'utf8'));

let output = '';

for (const id of targetIds) {
  output += `=========================================\n`;
  output += `PROBLEM: ${id}\n`;
  output += `=========================================\n\n`;
  
  const problem = cleanCodes[id];
  if (!problem) {
    output += `NOT FOUND!\n\n`;
    continue;
  }
  
  for (const lang of ['typescript', 'python', 'java', 'cpp']) {
    output += `--- LANGUAGE: ${lang} ---\n`;
    if (problem.languages[lang]) {
      output += problem.languages[lang].clean + '\n\n';
    } else {
      output += `MISSING!\n\n`;
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'all_clean_codes.txt'), output);
console.log("Saved all clean codes to all_clean_codes.txt");
