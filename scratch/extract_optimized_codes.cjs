const fs = require('fs');
const path = require('path');

const solutionsPath = path.join(__dirname, 'solutions.json');
if (!fs.existsSync(solutionsPath)) {
  console.error("solutions.json not found.");
  process.exit(1);
}

const algorithms = JSON.parse(fs.readFileSync(solutionsPath, 'utf8'));

const targetSlugs = [
  'two-pointers', 'sliding-window', 'prefix-sum', 'binary-search', 'kadanes-algorithm', 'maximum-subarray',
  'dutch-national-flag', 'monotonic-stack', 'rotate-array', 'cyclic-sort', 'fast-slow-pointers', 'detect-cycle-in-a-linked-list',
  'merge-two-sorted-lists', 'merge-sorted-lists', 'middle-node', 'dfs-preorder', 'dfs-inorder', 'dfs-postorder',
  'bfs-level-order', 'bst-insert', 'lca', 'lowest-common-ancestor-of-bst', 'recover-bst', 'serialize-tree'
];

const dbCodes = {};

for (const slug of targetSlugs) {
  const algo = algorithms.find(a => a.id === slug);
  if (!algo) {
    // Try substring matching
    const fallback = algorithms.find(a => a.id.includes(slug) || slug.includes(a.id));
    if (!fallback) continue;
    extract(fallback, slug);
  } else {
    extract(algo, slug);
  }
}

function extract(algo, key) {
  if (!dbCodes[key]) dbCodes[key] = { name: algo.name, codes: {} };
  const impls = algo.implementations || [];
  for (const impl of impls) {
    const lang = (impl.lang || '').toLowerCase();
    const codes = impl.code || [];
    const opt = codes.find(c => c.codeType === 'optimize');
    if (opt) {
      dbCodes[key].codes[lang] = opt.code;
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'db_codes.json'), JSON.stringify(dbCodes, null, 2));
console.log("Saved database codes to db_codes.json");
