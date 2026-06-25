const fs = require('fs');
const path = require('path');

const solutionsPath = path.join(__dirname, 'solutions.json');
const algorithms = JSON.parse(fs.readFileSync(solutionsPath, 'utf8'));

const lca = algorithms.find(a => a.id === 'lowest-common-ancestor-of-bst');
if (lca) {
  console.log("Found LCA of BST!");
  lca.implementations.forEach(impl => {
    console.log(`--- Lang: ${impl.lang} ---`);
    const opt = impl.code.find(c => c.codeType === 'optimize');
    if (opt) {
      console.log(opt.code);
    } else {
      console.log("No optimized implementation.");
    }
  });
} else {
  console.log("Not found!");
}
