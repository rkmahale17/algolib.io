import sys

file_path = r"d:\repo\hobby\learn-algo-animate\src\data\guidesData.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add imports
imports_addition = """import { content as fastSlowPointersContent } from "./guides/fast-slow-pointers";
import { content as greedyContent } from "./guides/greedy";
import { content as bfsDfsContent } from "./guides/bfs-dfs";
"""

content = content.replace(
    'import { content as databaseTerminologyContent } from "./guides/database-terminology";',
    'import { content as databaseTerminologyContent } from "./guides/database-terminology";\n' + imports_addition
)

# Add new categories before Database category
new_categories = """  {
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
"""

content = content.replace(
    '  {\n    id: "database",',
    new_categories + '  {\n    id: "database",'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated guidesData.ts")
