const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'guidesData.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const importsAddition = `import { content as fastSlowPointersContent } from "./guides/fast-slow-pointers";
import { content as greedyContent } from "./guides/greedy";
import { content as bfsDfsContent } from "./guides/bfs-dfs";
`;

content = content.replace(
    'import { content as databaseTerminologyContent } from "./guides/database-terminology";',
    'import { content as databaseTerminologyContent } from "./guides/database-terminology";\n' + importsAddition
);

const newCategories = `  {
    id: "fast-and-slow-pointers",
    title: "Fast and Slow Pointers",
    guides: [
      {
        slug: "fast-and-slow-pointers",
        title: "Fast and Slow Pointers",
        description: "Master cycle detection and finding the middle of sequences using the Tortoise and Hare.",
        category: "fast-and-slow-pointers",
        heroImage: "core-pattern-two-pointer",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["detect-cycle-in-a-linked-list", "middle-node"],
        content: fastSlowPointersContent,
        questions: [
          { id: "detect-cycle-in-a-linked-list", name: "Linked List Cycle", difficulty: "Easy" },
          { id: "middle-node", name: "Middle of the Linked List", difficulty: "Easy" }
        ]
      }
    ]
  },
  {
    id: "greedy",
    title: "Greedy Approach",
    guides: [
      {
        slug: "greedy",
        title: "Greedy Approach",
        description: "Learn to make the optimal local choice to solve problems efficiently.",
        category: "greedy",
        heroImage: "core-pattern-arrays",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["assign-cookies"],
        content: greedyContent,
        questions: [
          { id: "assign-cookies", name: "Assign Cookies", difficulty: "Easy" },
          { id: "jump-game", name: "Jump Game", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "bfs-dfs",
    title: "BFS and DFS",
    guides: [
      {
        slug: "bfs-dfs",
        title: "BFS and DFS",
        description: "Master exploring networks, trees, and grids with Depth First and Breadth First Search.",
        category: "bfs-dfs",
        heroImage: "fundamentals-graph-algorith",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["number-of-islands"],
        content: bfsDfsContent,
        questions: [
          { id: "number-of-islands", name: "Number of Islands", difficulty: "Medium" },
          { id: "rotting-oranges", name: "Rotting Oranges", difficulty: "Medium" }
        ]
      }
    ]
  },
`;

content = content.replace(
    '  {\r\n    id: "database",',
    newCategories + '  {\r\n    id: "database",'
).replace(
    '  {\n    id: "database",',
    newCategories + '  {\n    id: "database",'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Updated guidesData.ts');

// Also update sidebarNav.ts
const sidebarPath = path.join(__dirname, 'src', 'config', 'sidebarNav.ts');
let sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');

const targetStr = `  "dynamic-programming",
] as const;`;

const replaceStr = `  "dynamic-programming",
  "fast-and-slow-pointers",
  "greedy",
  "bfs-dfs",
] as const;`;

sidebarContent = sidebarContent.replace(targetStr, replaceStr);
fs.writeFileSync(sidebarPath, sidebarContent, 'utf-8');
console.log('Updated sidebarNav.ts');
