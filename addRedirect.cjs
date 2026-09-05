const fs = require('fs');
let content = fs.readFileSync('src/app/problem/[slug]/page.tsx', 'utf-8');

const search = `  if (!algorithm) {
    notFound();
  }`;
  
const replace = `  if (!algorithm) {
    notFound();
  }

  if (algorithm.problem_type === 'frontend' || algorithm.problemType === 'frontend') {
    redirect(\`/frontend/\${slug}\`);
  }`;

content = content.replace(search, replace);
fs.writeFileSync('src/app/problem/[slug]/page.tsx', content, 'utf-8');
