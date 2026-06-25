const fs = require('fs');
const path = require('path');

const solutionsPath = path.join(__dirname, 'solutions.json');
if (!fs.existsSync(solutionsPath)) {
  console.error("solutions.json not found.");
  process.exit(1);
}

const algorithms = JSON.parse(fs.readFileSync(solutionsPath, 'utf8'));

const targetSlugs = [
  'knapsack-01',
  'lcs',
  'lis',
  'edit-distance',
  'matrix-path-dp',
  'partition-equal-subset',
  'activity-selection',
  'interval-scheduling',
  'huffman-encoding',
  'gas-station'
];

const extracted = {};

for (const slug of targetSlugs) {
  const algo = algorithms.find(a => a.id === slug);
  if (!algo) {
    console.log(`Could not find exact match for ${slug}`);
    // Try substring matching
    const fallback = algorithms.find(a => a.id.includes(slug) || slug.includes(a.id));
    if (fallback) {
      console.log(`Found fallback: ${fallback.id} for ${slug}`);
      extract(fallback, slug);
    }
  } else {
    extract(algo, slug);
  }
}

function extract(algo, key) {
  if (!extracted[key]) {
    extracted[key] = {
      id: algo.id,
      name: algo.name,
      title: algo.title,
      languages: {}
    };
  }
  const impls = algo.implementations || [];
  for (const impl of impls) {
    const lang = (impl.lang || '').toLowerCase();
    const codes = impl.code || [];
    const opt = codes.find(c => c.codeType === 'optimize');
    if (opt) {
      // Remove comments from the code
      extracted[key].languages[lang] = opt.code;
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'extracted_targets.json'), JSON.stringify(extracted, null, 2));
console.log("Saved extracted targets to extracted_targets.json");
