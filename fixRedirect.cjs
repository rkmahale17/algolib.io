const fs = require('fs');
let content = fs.readFileSync('src/app/problem/[slug]/page.tsx', 'utf-8');
content = content.replace('redirect(`/frontend/${slug}`);', 'redirect(`/frontend/problems/${slug}`);');
fs.writeFileSync('src/app/problem/[slug]/page.tsx', content, 'utf-8');
