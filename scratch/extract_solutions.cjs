const fs = require('fs');
const path = require('path');

const solutionsPath = path.join(__dirname, 'solutions.json');
if (!fs.existsSync(solutionsPath)) {
  console.error("solutions.json not found. Run fetch_solutions.cjs first.");
  process.exit(1);
}

const algorithms = JSON.parse(fs.readFileSync(solutionsPath, 'utf8'));

const targetSlugs = [
  // Batch 1 & 2 (1-10)
  'two-pointers', 'sliding-window', 'prefix-sum', 'binary-search', 'kadanes-algorithm', 'maximum-subarray',
  'dutch-national-flag', 'monotonic-stack', 'rotate-array', 'cyclic-sort', 'fast-slow-pointers', 'detect-cycle-in-a-linked-list',
  // Batch 3 & 4 (11-20)
  'merge-two-sorted-lists', 'merge-sorted-lists', 'middle-node', 'dfs-preorder', 'dfs-inorder', 'dfs-postorder',
  'bfs-level-order', 'bst-insert', 'lca', 'lowest-common-ancestor-of-bst', 'recover-bst', 'serialize-tree'
];

const results = {};

for (const slug of targetSlugs) {
  const algo = algorithms.find(a => a.id === slug);
  if (algo) {
    results[slug] = {
      id: algo.id,
      name: algo.name,
      implementations: algo.implementations
    };
  } else {
    // Try substring match on ID
    const matches = algorithms.filter(a => a.id.includes(slug) || slug.includes(a.id));
    if (matches.length > 0) {
      results[slug] = matches.map(m => ({ id: m.id, name: m.name, implementations: m.implementations }));
    } else {
      results[slug] = "NOT_FOUND";
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'extracted_codes.json'), JSON.stringify(results, null, 2));
console.log("Extracted code stored in extracted_codes.json");
