const fs = require('fs');
const path = require('path');

const targetIds = [
  'trie',
  'graph-dfs',
  'graph-bfs',
  'union-find',
  'kruskals',
  'prims',
  'dijkstras',
  'bellman-ford',
  'floyd-warshall',
  'a-star'
];

const solutionsPath = path.join(__dirname, 'solutions.json');
const rawData = fs.readFileSync(solutionsPath, 'utf8');
const solutions = JSON.parse(rawData);

const outDir = path.join(__dirname, 'extracted');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

for (const id of targetIds) {
  const problem = solutions.find(p => p.id === id);
  if (problem) {
    const problemDir = path.join(outDir, id);
    if (!fs.existsSync(problemDir)) {
      fs.mkdirSync(problemDir);
    }
    for (const impl of problem.implementations) {
      const codeObj = impl.code.find(c => c.codeType === 'optimize') || impl.code[0];
      if (codeObj && codeObj.code) {
        let ext = 'txt';
        if (impl.lang.toLowerCase() === 'typescript') ext = 'ts';
        else if (impl.lang.toLowerCase() === 'python') ext = 'py';
        else if (impl.lang.toLowerCase() === 'java') ext = 'java';
        else if (impl.lang.toLowerCase() === 'cpp') ext = 'cpp';
        
        fs.writeFileSync(path.join(problemDir, `optimize.${ext}`), codeObj.code);
      }
    }
    console.log(`Extracted codes for ${id}`);
  } else {
    console.log(`Problem ${id} not found in solutions.json`);
  }
}
