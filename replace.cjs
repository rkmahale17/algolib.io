const fs = require('fs');
let content = fs.readFileSync('src/components/algorithm/ProblemDescriptionPanel.tsx', 'utf-8');
const search = 'href={`/problem/${nextProblem.slug || nextProblem.id}`}';
const replace = 'href={getProblemUrl(nextProblem)}';
content = content.split(search).join(replace);
fs.writeFileSync('src/components/algorithm/ProblemDescriptionPanel.tsx', content, 'utf-8');
