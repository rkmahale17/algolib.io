const fs = require('fs');
let content = fs.readFileSync('src/components/algorithm/ProblemDescriptionPanel.tsx', 'utf-8');
if (!content.includes('import { getProblemUrl }')) {
  content = "import { getProblemUrl } from '@/utils/url';\n" + content;
  fs.writeFileSync('src/components/algorithm/ProblemDescriptionPanel.tsx', content, 'utf-8');
}
