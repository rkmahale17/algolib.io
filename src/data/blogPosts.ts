export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  content: BlogContent[];
}

export interface BlogContent {
  type: 'heading' | 'paragraph' | 'image' | 'code' | 'list' | 'quote' | 'cta';
  content?: string;
  language?: string; // for code blocks
  items?: string[]; // for lists
  alt?: string; // for images
  link?: string; // for CTAs
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'master-blind-75-visual-algorithms',
    title: 'Master the Blind 75: Learn Faster with Visual Algorithms',
    subtitle: 'Understand the most important coding interview problems through interactive visualization',
    description: 'Understand the Blind 75 problems through interactive visual learning — learn patterns, logic, and coding techniques the fun way on AlgoLib.io.',
    author: 'AlgoLib Team',
    date: '2025-03-10',
    readTime: '12 min read',
    category: 'Interview Prep',
    tags: ['Blind 75', 'DSA Practice', 'Leetcode', 'Visual Learning'],
    thumbnail: '/blog/blind75-patterns-diagram.jpg',
    content: [
      {
        type: 'paragraph',
        content: 'Landing your dream job at a top tech company requires more than just knowing algorithms—you need to master the patterns that appear repeatedly in coding interviews. The Blind 75 list has become the industry standard for interview preparation, but traditional learning methods can feel overwhelming and disconnected from real problem-solving.'
      },
      {
        type: 'paragraph',
        content: 'In this comprehensive guide, we\'ll explore how visual learning transforms the way you understand and retain these critical algorithms, making your interview preparation not just more effective, but actually enjoyable.'
      },
      {
        type: 'image',
        content: '/blog/blind75-coding.jpg',
        alt: 'Developer working on coding interview problems'
      },
      {
        type: 'heading',
        content: 'What is the Blind 75 and Why Does It Matter?'
      },
      {
        type: 'paragraph',
        content: 'The Blind 75 is a carefully curated collection of 75 LeetCode problems created by a former Facebook engineer. Unlike random problem lists, these 75 questions were specifically chosen because they represent the fundamental patterns that appear in 90% of all technical interviews at companies like Google, Amazon, Meta, Microsoft, and Apple.'
      },
      {
        type: 'paragraph',
        content: 'What makes Blind 75 revolutionary is its focus on pattern recognition over brute memorization. Each problem teaches you a reusable technique that applies to dozens of similar questions. Master these 75 problems, and you\'ve effectively prepared for thousands of potential interview questions.'
      },
      {
        type: 'heading',
        content: 'The Science Behind Visual Learning'
      },
      {
        type: 'paragraph',
        content: 'Research shows that our brains process visual information 60,000 times faster than text. When you visualize how an algorithm works—watching pointers move through an array, seeing nodes connect in a graph, or observing how a stack builds and collapses—you\'re creating multiple neural pathways for that information.'
      },
      {
        type: 'list',
        items: [
          '<strong>Dual Coding Theory</strong>: Your brain stores both the visual representation and the verbal/textual explanation, creating redundant memory pathways',
          '<strong>Pattern Recognition</strong>: Seeing algorithms in action helps you recognize when to apply them in new contexts',
          '<strong>Reduced Cognitive Load</strong>: Visual representations break down complex concepts into digestible chunks',
          '<strong>Better Retention</strong>: Studies show visual learners retain information 65% longer than text-only learners'
        ]
      },
      {
        type: 'heading',
        content: 'Key Patterns in the Blind 75'
      },
      {
        type: 'paragraph',
        content: 'The Blind 75 problems are organized around essential patterns. Let\'s explore the most important ones:'
      },
      {
        type: 'paragraph',
        content: '<strong>1. Two Pointers Pattern</strong><br/>Used in problems like "Container With Most Water" and "3Sum", the two pointers technique is crucial for optimizing array and string problems. By maintaining two references that move toward each other or in the same direction, you can often reduce O(n²) solutions to O(n).'
      },
      {
        type: 'paragraph',
        content: '<strong>2. Sliding Window</strong><br/>Perfect for substring and subarray problems like "Longest Substring Without Repeating Characters". This pattern maintains a window of elements and adjusts its size based on conditions, giving you O(n) time complexity for problems that seem to require nested loops.'
      },
      {
        type: 'code',
        content: `def maxSubArray(nums):
    # Kadane's Algorithm - Classic Sliding Window
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        # Extend window or start new window
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum

# Example: [-2,1,-3,4,-1,2,1,-5,4]
# Returns: 6 (subarray [4,-1,2,1])`,
        language: 'python'
      },
      {
        type: 'paragraph',
        content: '<strong>3. Fast & Slow Pointers</strong><br/>Essential for linked list problems like "Linked List Cycle" and "Find Middle of Linked List". One pointer moves twice as fast as the other, allowing you to detect cycles or find middle elements in a single pass.'
      },
      {
        type: 'paragraph',
        content: '<strong>4. Dynamic Programming</strong><br/>Problems like "Climbing Stairs", "Coin Change", and "Longest Increasing Subsequence" require breaking down problems into overlapping subproblems. Visual DP tables make it crystal clear how solutions build upon previous computations.'
      },
      {
        type: 'image',
        content: '/blog/blind75-patterns-diagram.jpg',
        alt: 'The 7 essential algorithm patterns in Blind 75 - circular diagram showing Two Pointers, Sliding Window, Fast & Slow Pointers, Dynamic Programming, Binary Search, Tree Traversal, and Graph Algorithms'
      },
      {
        type: 'heading',
        content: 'How AlgoLib Makes Learning Visual and Interactive'
      },
      {
        type: 'paragraph',
        content: 'At AlgoLib, we\'ve built interactive visualizations for every algorithm in the Blind 75. Instead of staring at static code, you watch algorithms execute step-by-step. You see variables change, pointers move, and data structures transform in real-time.'
      },
      {
        type: 'list',
        items: [
          'Step through each line of code and watch the corresponding visualization update',
          'Adjust input values and see how the algorithm adapts',
          'Compare time and space complexity visually across different approaches',
          'Practice with guided challenges that reinforce pattern recognition'
        ]
      },
      {
        type: 'cta',
        content: 'Explore Blind 75 with Interactive Visualizations',
        link: '/blind75'
      },
      {
        type: 'heading',
        content: 'Real Success Stories: Pattern Recognition in Action'
      },
      {
        type: 'paragraph',
        content: 'Take the "Product of Array Except Self" problem. At first glance, it seems impossible without division or O(n²) time. But once you visualize the left and right product arrays building simultaneously, the pattern clicks instantly. You see how each element is the product of everything to its left times everything to its right.'
      },
      {
        type: 'paragraph',
        content: 'Similarly, "Merge Intervals" becomes intuitive when you see intervals as colored bars on a timeline. Sorting them first, then watching them merge visually, makes the algorithm obvious. What was once a confusing word problem becomes a simple visual pattern you can recognize in seconds.'
      },
      {
        type: 'quote',
        content: '"After using AlgoLib\'s visualizations for just two weeks, I finally understood dynamic programming. Seeing the DP table fill in real-time was the breakthrough I needed. I got offers from both Google and Amazon." - Sarah Chen, Software Engineer'
      },
      {
        type: 'heading',
        content: 'Your 30-Day Blind 75 Learning Plan'
      },
      {
        type: 'paragraph',
        content: 'Here\'s a proven approach to mastering the Blind 75 using visual learning:'
      },
      {
        type: 'list',
        items: [
          '<strong>Week 1 - Arrays & Strings (20 problems)</strong>: Master two pointers, sliding window, and basic array manipulation. These are the most common interview questions.',
          '<strong>Week 2 - Linked Lists & Trees (15 problems)</strong>: Focus on pointer manipulation and tree traversal patterns. Visual representations of node connections are game-changing here.',
          '<strong>Week 3 - Dynamic Programming & Graphs (20 problems)</strong>: The toughest section, but visualizations make DP tables and graph traversals intuitive.',
          '<strong>Week 4 - Review & Advanced Patterns (20 problems)</strong>: Revisit tricky problems and tackle advanced topics like tries, heaps, and backtracking.'
        ]
      },
      {
        type: 'paragraph',
        content: 'Spend 1-2 hours daily. For each problem: (1) Try solving it yourself for 20 minutes, (2) Watch the visualization to understand the pattern, (3) Implement the solution while referencing the visualization, (4) Solve a similar problem to reinforce the pattern.'
      },
      {
        type: 'heading',
        content: 'Common Pitfalls and How to Avoid Them'
      },
      {
        type: 'paragraph',
        content: '<strong>Pitfall #1: Memorizing Solutions</strong><br/>Don\'t memorize code. Instead, understand the underlying pattern. AlgoLib\'s visualizations help you see *why* an algorithm works, not just *how* to code it.'
      },
      {
        type: 'paragraph',
        content: '<strong>Pitfall #2: Rushing Through Easy Problems</strong><br/>Easy problems teach fundamental patterns. Take time to truly understand them. Watch the visualization even if you solved it correctly—you might discover a more elegant approach.'
      },
      {
        type: 'paragraph',
        content: '<strong>Pitfall #3: Skipping The Analysis</strong><br/>Always analyze time and space complexity. Our visualizations show you exactly when and where your algorithm consumes resources, making Big O notation intuitive rather than abstract.'
      },
      {
        type: 'heading',
        content: 'Beyond Blind 75: What Comes Next'
      },
      {
        type: 'paragraph',
        content: 'Once you\'ve mastered the Blind 75, you\'re not done—you\'re just getting started. These patterns form the foundation for tackling any algorithmic problem. You can move on to the Blind 150, NeetCode 150, or company-specific problem sets.'
      },
      {
        type: 'paragraph',
        content: 'The real power of pattern-based learning is that you\'ll start seeing these techniques everywhere. A new problem that would have taken hours to solve now takes minutes because you recognize it as a variation of a pattern you\'ve already mastered.'
      },
      {
        type: 'cta',
        content: 'Start Your Visual Learning Journey',
        link: '/blind75'
      }
    ]
  },
  {
    id: '2',
    slug: 'graph-explorer-traverse-maze-pro',
    title: 'Graph Explorer — Traverse the Maze Like a Pro',
    subtitle: 'Master BFS, DFS, and shortest-path algorithms through interactive gameplay',
    description: 'Visualize BFS, DFS, and shortest-path algorithms with the Graph Explorer game. Learn graph logic by playing.',
    author: 'AlgoLib Team',
    date: '2025-02-20',
    readTime: '9 min read',
    category: 'DSA Games',
    tags: ['Graphs', 'BFS', 'DFS', 'Algorithms', 'Visualization'],
    thumbnail: '/blog/graph-traversal-diagram.jpg',
    content: [
      {
        type: 'image',
        content: '/blog/graph-traversal-diagram.jpg',
        alt: 'Side-by-side comparison of BFS (breadth-first) and DFS (depth-first) graph traversal algorithms with queue and stack visualization'
      },
      {
        type: 'heading',
        content: 'Why Graph Algorithms Matter'
      },
      {
        type: 'paragraph',
        content: 'Graphs are everywhere in real software systems: social networks, maps, recommendation engines, dependency resolution, network routing, and more. Understanding graph traversal is essential for any software engineer.'
      },
      {
        type: 'heading',
        content: 'BFS vs DFS: The Core Difference'
      },
      {
        type: 'paragraph',
        content: 'The key difference between Breadth-First Search and Depth-First Search lies in the data structure they use and the order they explore nodes.'
      },
      {
        type: 'heading',
        content: 'Breadth-First Search (BFS) - Queue Logic'
      },
      {
        type: 'paragraph',
        content: 'BFS explores level by level, like ripples in water. It uses a queue (FIFO) to ensure you visit all neighbors at the current level before moving deeper.'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// BFS Implementation
function bfs(graph: number[][], start: number): void {
  const queue = [start];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const node = queue.shift()!;
    console.log('Visiting:', node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`
      },
      {
        type: 'paragraph',
        content: '🎯 Use BFS for: Shortest path in unweighted graphs, level-order traversal, finding closest nodes'
      },
      {
        type: 'heading',
        content: 'Depth-First Search (DFS) - Stack Logic'
      },
      {
        type: 'paragraph',
        content: 'DFS explores as deep as possible before backtracking. It uses a stack (LIFO) - either explicit or via recursion.'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// DFS Implementation (Recursive)
function dfs(graph: number[][], node: number, visited: Set<number>): void {
  visited.add(node);
  console.log('Visiting:', node);
  
  for (const neighbor of graph[node]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}

// DFS Implementation (Iterative with Stack)
function dfsIterative(graph: number[][], start: number): void {
  const stack = [start];
  const visited = new Set([start]);
  
  while (stack.length > 0) {
    const node = stack.pop()!;
    console.log('Visiting:', node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
}`
      },
      {
        type: 'paragraph',
        content: '🎯 Use DFS for: Detecting cycles, topological sorting, finding connected components, pathfinding in mazes'
      },
      {
        type: 'heading',
        content: 'Real-World Applications'
      },
      {
        type: 'list',
        items: [
          '🗺️ Maps & Navigation: GPS systems use shortest-path algorithms (Dijkstra, A*)',
          '🌐 Social Networks: Friend recommendations use graph traversal to find connections',
          '🔌 Network Routing: Internet packets find optimal routes through graph algorithms',
          '📦 Dependency Resolution: Package managers use topological sort (DFS-based)',
          '🎮 Game AI: Pathfinding in games uses BFS/A* for character movement'
        ]
      },
      {
        type: 'heading',
        content: 'Common Graph Interview Problems'
      },
      {
        type: 'list',
        items: [
          'Number of Islands (DFS/BFS)',
          'Clone Graph (DFS/BFS)',
          'Course Schedule (Cycle Detection)',
          'Word Ladder (BFS for shortest path)',
          'Network Delay Time (Dijkstra)',
          'Minimum Spanning Tree (Kruskal/Prim)'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: Always visualize the graph first! Draw nodes and edges before coding. This prevents confusion and helps you choose the right algorithm.'
      },
      {
        type: 'paragraph',
        content: 'Ready to master graph algorithms? Play Graph Explorer and watch BFS and DFS come alive in an interactive maze!'
      }
    ]
  },
  {
    id: '3',
    slug: 'stack-master-decode-lifo-magic',
    title: 'Stack Master — Decode the Magic of LIFO',
    subtitle: 'Understand stack operations through real-time visualization',
    description: 'Understand how stacks work through AlgoLib\'s Stack Master — visualize push/pop operations in real time.',
    author: 'AlgoLib Team',
    date: '2025-02-15',
    readTime: '7 min read',
    category: 'Data Structures',
    tags: ['Stack', 'LIFO', 'Data Structures', 'Visualization'],
    thumbnail: '/blog/stack-data-structure.jpg',
    content: [
      {
        type: 'heading',
        content: 'What is a Stack?'
      },
      {
        type: 'paragraph',
        content: 'A stack is a linear data structure that follows the Last In, First Out (LIFO) principle. Think of it like a stack of plates - you can only add or remove plates from the top.'
      },
      {
        type: 'heading',
        content: 'Core Stack Operations'
      },
      {
        type: 'list',
        items: [
          '🔼 Push: Add an element to the top of the stack - O(1)',
          '🔽 Pop: Remove and return the top element - O(1)',
          '👁️ Peek/Top: View the top element without removing it - O(1)',
          '❓ isEmpty: Check if the stack is empty - O(1)',
          '📏 Size: Get the number of elements - O(1)'
        ]
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Stack Implementation
class Stack<T> {
  private items: T[] = [];
  
  push(element: T): void {
    this.items.push(element);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  
  size(): number {
    return this.items.length;
  }
}`
      },
      {
        type: 'heading',
        content: 'Real-Life Uses of Stacks'
      },
      {
        type: 'paragraph',
        content: 'Stacks are fundamental to how computers work and appear in countless applications:'
      },
      {
        type: 'list',
        items: [
          '↩️ Undo/Redo Functionality: Text editors store actions in a stack',
          '🌐 Browser History: Back button uses a stack of visited pages',
          '🔍 Function Call Stack: Programming languages track function calls',
          '✅ Syntax Parsing: Compilers use stacks to validate parentheses and brackets',
          '🧮 Expression Evaluation: Convert infix to postfix notation',
          '🔙 Backtracking Algorithms: DFS uses stack for maze solving'
        ]
      },
      {
        type: 'heading',
        content: 'Common Stack Interview Problems'
      },
      {
        type: 'paragraph',
        content: 'Valid Parentheses - Classic stack problem:'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: { [key: string]: string } = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}`
      },
      {
        type: 'heading',
        content: 'Min Stack - Design Challenge'
      },
      {
        type: 'paragraph',
        content: 'Design a stack that supports push, pop, top, and retrieving the minimum element in O(1) time:'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];
  
  push(val: number): void {
    this.stack.push(val);
    const min = this.minStack.length === 0 
      ? val 
      : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(min);
  }
  
  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }
  
  top(): number {
    return this.stack[this.stack.length - 1];
  }
  
  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}`
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: Whenever you see "balanced parentheses" or "valid brackets" in a problem, think STACK! It\'s the go-to data structure for matching pairs.'
      },
      {
        type: 'paragraph',
        content: 'Ready to master stacks? Play Stack Master and visualize push/pop operations in real-time!'
      }
    ]
  },
  {
    id: '4',
    slug: 'dp-puzzle-grid-crack-dynamic-programming',
    title: 'DP Puzzle Grid — Crack Dynamic Programming Visually',
    subtitle: 'Make Dynamic Programming fun and simple through interactive grid visualization',
    description: 'Make Dynamic Programming fun and simple — fill grids, visualize recursion, and master memoization interactively.',
    author: 'AlgoLib Team',
    date: '2024-01-14',
    readTime: '12 min read',
    category: 'DSA Patterns',
    tags: ['Dynamic Programming', 'DP', 'Memoization', 'Optimization'],
    content: [
      {
        type: 'heading',
        content: 'What is Dynamic Programming?'
      },
      {
        type: 'paragraph',
        content: 'Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking them down into simpler subproblems. The key insight: if you\'re solving the same subproblem multiple times, store the result and reuse it!'
      },
      {
        type: 'paragraph',
        content: 'DP = Recursion + Memoization (or Bottom-Up Tabulation)'
      },
      {
        type: 'heading',
        content: 'When to Use Dynamic Programming'
      },
      {
        type: 'list',
        items: [
          '✅ Optimal Substructure: Solution can be constructed from optimal solutions of subproblems',
          '✅ Overlapping Subproblems: Same subproblems are solved multiple times',
          '✅ Decision-Making: Problems involve making choices at each step',
          '✅ Optimization: Finding max/min, count of ways, or feasibility'
        ]
      },
      {
        type: 'heading',
        content: 'Classic Example: Climbing Stairs'
      },
      {
        type: 'paragraph',
        content: 'You can climb 1 or 2 steps at a time. How many ways can you reach step n?'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Naive Recursion (Slow - O(2^n))
function climbStairs(n: number): number {
  if (n <= 2) return n;
  return climbStairs(n - 1) + climbStairs(n - 2);
}

// With Memoization (Fast - O(n))
function climbStairsMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n)!;
  
  const result = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Bottom-Up Tabulation (Most efficient)
function climbStairsDP(n: number): number {
  if (n <= 2) return n;
  const dp = [0, 1, 2];
  
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}`
      },
      {
        type: 'heading',
        content: 'How DP Tables Evolve'
      },
      {
        type: 'paragraph',
        content: 'Visualizing the DP table is key to understanding. Let\'s see Climbing Stairs for n=5:'
      },
      {
        type: 'paragraph',
        content: 'Step 0: [0, 1, 2, ?, ?, ?]\nStep 1: [0, 1, 2, 3, ?, ?]  (dp[3] = dp[2] + dp[1] = 2 + 1)\nStep 2: [0, 1, 2, 3, 5, ?]  (dp[4] = dp[3] + dp[2] = 3 + 2)\nStep 3: [0, 1, 2, 3, 5, 8]  (dp[5] = dp[4] + dp[3] = 5 + 3)'
      },
      {
        type: 'heading',
        content: '0/1 Knapsack Problem'
      },
      {
        type: 'paragraph',
        content: 'Given items with weights and values, maximize value without exceeding capacity:'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        // Max of: include item vs exclude item
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]], // include
          dp[i - 1][w] // exclude
        );
      } else {
        dp[i][w] = dp[i - 1][w]; // can't include (too heavy)
      }
    }
  }
  
  return dp[n][capacity];
}`
      },
      {
        type: 'heading',
        content: 'Longest Increasing Subsequence (LIS)'
      },
      {
        type: 'paragraph',
        content: 'Find the length of the longest increasing subsequence in an array:'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function lengthOfLIS(nums: number[]): number {
  const n = nums.length;
  const dp = Array(n).fill(1); // Each element is a subsequence of length 1
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}`
      },
      {
        type: 'heading',
        content: 'DP Pattern Recognition'
      },
      {
        type: 'list',
        items: [
          '🎯 "Maximum/Minimum" → Think DP optimization',
          '🎯 "Count number of ways" → Think DP counting',
          '🎯 "Is it possible to..." → Think DP feasibility',
          '🎯 "Subsequence/Subarray" → Think 1D or 2D DP table',
          '🎯 "Multiple choices at each step" → Think decision tree → DP'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: Start with the recursive solution first! Once you see repeated calculations, add memoization. Then convert to bottom-up if needed for optimization.'
      },
      {
        type: 'paragraph',
        content: 'Ready to master DP? Play DP Puzzle Grid and watch memoization tables fill step by step!'
      }
    ]
  },
  {
    id: '5',
    slug: 'sliding-window-ninja-spot-pattern-fast',
    title: 'Sliding Window Ninja — Spot the Pattern Fast',
    subtitle: 'Master the sliding window technique through interactive visualization',
    description: 'Learn sliding window technique through an interactive visual game that simplifies pointer logic.',
    author: 'AlgoLib Team',
    date: '2024-01-12',
    readTime: '8 min read',
    category: 'DSA Patterns',
    tags: ['Sliding Window', 'Arrays', 'Optimization', 'Two Pointers'],
    content: [
      {
        type: 'heading',
        content: 'What is the Sliding Window Technique?'
      },
      {
        type: 'paragraph',
        content: 'The sliding window technique is an optimization pattern that transforms nested loops into a single pass through data. Instead of recalculating from scratch for each position, you "slide" a window across the data, adding new elements and removing old ones.'
      },
      {
        type: 'paragraph',
        content: 'Time Complexity: O(n²) → O(n) 🚀'
      },
      {
        type: 'heading',
        content: 'Two Types of Sliding Windows'
      },
      {
        type: 'paragraph',
        content: '1. Fixed-Size Window: Window size is constant (e.g., max sum of k consecutive elements)'
      },
      {
        type: 'paragraph',
        content: '2. Variable-Size Window: Window size changes based on conditions (e.g., longest substring without repeating chars)'
      },
      {
        type: 'heading',
        content: 'Example 1: Maximum Sum of K Consecutive Elements'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Naive Approach - O(n*k)
function maxSumNaive(arr: number[], k: number): number {
  let maxSum = -Infinity;
  
  for (let i = 0; i <= arr.length - k; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) {
      sum += arr[j];
    }
    maxSum = Math.max(maxSum, sum);
  }
  
  return maxSum;
}

// Sliding Window - O(n)
function maxSumWindow(arr: number[], k: number): number {
  let windowSum = 0;
  let maxSum = -Infinity;
  
  // First window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i]; // Remove left, add right
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}`
      },
      {
        type: 'heading',
        content: 'Example 2: Longest Substring Without Repeating Characters'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function lengthOfLongestSubstring(s: string): number {
  const seen = new Map<string, number>();
  let maxLength = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    
    // If char is in window, shrink from left
    if (seen.has(char) && seen.get(char)! >= left) {
      left = seen.get(char)! + 1;
    }
    
    seen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}

// Example: "abcabcbb"
// Window expands: a, ab, abc
// Sees duplicate 'a': shrink left to index 1 → bca
// Continues sliding...`
      },
      {
        type: 'heading',
        content: 'Example 3: Minimum Window Substring'
      },
      {
        type: 'paragraph',
        content: 'Find the smallest substring that contains all characters from target string:'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  const window = new Map<string, number>();
  
  for (const char of t) {
    need.set(char, (need.get(char) || 0) + 1);
  }
  
  let left = 0, right = 0;
  let valid = 0;
  let start = 0, len = Infinity;
  
  while (right < s.length) {
    const c = s[right];
    right++;
    
    // Expand window
    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (window.get(c) === need.get(c)) {
        valid++;
      }
    }
    
    // Shrink window when valid
    while (valid === need.size) {
      if (right - left < len) {
        start = left;
        len = right - left;
      }
      
      const d = s[left];
      left++;
      
      if (need.has(d)) {
        if (window.get(d) === need.get(d)) {
          valid--;
        }
        window.set(d, window.get(d)! - 1);
      }
    }
  }
  
  return len === Infinity ? "" : s.substring(start, start + len);
}`
      },
      {
        type: 'heading',
        content: 'When to Use Sliding Window'
      },
      {
        type: 'list',
        items: [
          '🎯 Problem involves contiguous sequence (subarray/substring)',
          '🎯 You need to find max/min value in a range',
          '🎯 Problem asks for longest/shortest with condition',
          '🎯 You see keywords: "consecutive", "contiguous", "substring"',
          '🎯 Optimization from O(n²) to O(n) is possible'
        ]
      },
      {
        type: 'heading',
        content: 'Common Sliding Window Problems'
      },
      {
        type: 'list',
        items: [
          'Maximum Sum Subarray of Size K',
          'Longest Substring Without Repeating Characters',
          'Minimum Window Substring',
          'Permutation in String',
          'Fruit Into Baskets',
          'Longest Repeating Character Replacement'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: Draw the window! Visualize left and right pointers moving. Ask yourself: When do I expand? When do I shrink? What do I track in the window?'
      },
      {
        type: 'paragraph',
        content: 'Ready to master sliding windows? Play Sliding Window Ninja and watch the window slide in real-time!'
      }
    ]
  },
  {
    id: '6',
    slug: 'two-pointer-strategy-guide',
    title: 'Mastering the Two Pointer Strategy: Why and How to Use It',
    subtitle: 'A comprehensive guide to one of the most powerful algorithmic techniques',
    description: 'Learn the two-pointer technique, understand when to use it, and master common patterns like opposite directional pointers, same direction pointers, and sliding windows.',
    author: 'AlgoLib Team',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'DSA Patterns',
    tags: ['Two Pointers', 'Arrays', 'Algorithms', 'Interview Prep'],
    content: [
      {
        type: 'heading',
        content: 'What is the Two Pointer Technique?'
      },
      {
        type: 'paragraph',
        content: 'The two-pointer technique is an algorithmic pattern where we use two pointers to iterate through a data structure (usually an array or linked list) in a smart way. Instead of using nested loops that result in O(n²) time complexity, we can often solve the same problem in O(n) time by using two pointers strategically.'
      },
      {
        type: 'paragraph',
        content: 'This technique is particularly powerful for problems involving arrays, strings, and linked lists where you need to find pairs, triplets, or subarrays that satisfy certain conditions.'
      },
      {
        type: 'heading',
        content: 'Why Use Two Pointers?'
      },
      {
        type: 'paragraph',
        content: 'The two-pointer technique offers several compelling advantages that make it a go-to pattern for many algorithmic challenges:'
      },
      {
        type: 'list',
        items: [
          '✅ Time Complexity: Reduces O(n²) nested loops to O(n) single pass',
          '✅ Space Efficiency: Usually O(1) extra space required',
          '✅ Intuitive Logic: Easy to understand and implement once you grasp the pattern',
          '✅ Versatile: Works for multiple problem types (pairs, subarrays, palindromes)',
          '✅ Interview Favorite: Extremely common in coding interviews'
        ]
      },
      {
        type: 'heading',
        content: 'Common Two Pointer Patterns'
      },
      {
        type: 'paragraph',
        content: 'There are three main patterns of two-pointer techniques, each suited for different types of problems:'
      },
      {
        type: 'heading',
        content: '1. Opposite Directional Pointers'
      },
      {
        type: 'paragraph',
        content: 'Start with one pointer at the beginning (left) and one at the end (right), moving them toward each other. This pattern is ideal for:'
      },
      {
        type: 'list',
        items: [
          'Finding pairs with a target sum in sorted arrays',
          'Checking if a string is a palindrome',
          'Reversing arrays or strings in-place',
          'Container with most water problem'
        ]
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Example: Two Sum in Sorted Array
function twoSum(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const sum = nums[left] + nums[right];
    
    if (sum === target) {
      return [left, right]; // Found the pair!
    } else if (sum < target) {
      left++; // Need a larger sum
    } else {
      right--; // Need a smaller sum
    }
  }
  
  return [-1, -1]; // No pair found
}`
      },
      {
        type: 'heading',
        content: '2. Same Directional Pointers (Fast & Slow)'
      },
      {
        type: 'paragraph',
        content: 'Both pointers start at the same position but move at different speeds. Perfect for:'
      },
      {
        type: 'list',
        items: [
          'Detecting cycles in linked lists',
          'Finding the middle of a linked list',
          'Removing duplicates from sorted arrays',
          'Partition problems'
        ]
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Example: Remove Duplicates from Sorted Array
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  
  let slow = 0; // Position for next unique element
  
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  
  return slow + 1; // Length of unique elements
}`
      },
      {
        type: 'heading',
        content: '3. Sliding Window (Two Pointers with Dynamic Range)'
      },
      {
        type: 'paragraph',
        content: 'Both pointers define a window that expands or contracts based on conditions. Used for:'
      },
      {
        type: 'list',
        items: [
          'Finding maximum/minimum subarray sums',
          'Longest substring without repeating characters',
          'Subarray with target sum',
          'Minimum window substring problems'
        ]
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Example: Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let left = 0;
  let maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    // Shrink window while we have duplicates
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    
    seen.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`
      },
      {
        type: 'heading',
        content: 'When to Use Two Pointers?'
      },
      {
        type: 'paragraph',
        content: 'Consider using the two-pointer technique when you encounter problems with these characteristics:'
      },
      {
        type: 'list',
        items: [
          '🎯 The data structure is ordered or can be sorted',
          '🎯 You need to find pairs, triplets, or subarrays',
          '🎯 The problem asks about relationships between elements',
          '🎯 You want to optimize from O(n²) to O(n)',
          '🎯 The problem mentions "in-place" or "constant space"'
        ]
      },
      {
        type: 'heading',
        content: 'Practice Problems'
      },
      {
        type: 'paragraph',
        content: 'Ready to practice? Try these problems on AlgoLib to master the two-pointer technique:'
      },
      {
        type: 'list',
        items: [
          '1. Two Sum (Sorted Array) - Perfect for learning opposite directional pointers',
          '2. Valid Palindrome - Great introduction to the pattern',
          '3. Container With Most Water - Classic two-pointer optimization',
          '4. Remove Duplicates - Learn fast & slow pointer pattern',
          '5. 3Sum - Advanced: combine two pointers with iteration'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: When stuck on an array problem, ask yourself: "Can I use two pointers to avoid nested loops?" This simple question can lead to elegant O(n) solutions!'
      },
      {
        type: 'heading',
        content: 'Try It Yourself!'
      },
      {
        type: 'paragraph',
        content: 'Want to experience the two-pointer technique in action? Check out our interactive Two Pointer Race game where you can practice finding pairs by moving pointers strategically. It\'s a fun way to build intuition for when to move left, when to move right, and how to think like the algorithm!'
      },
      {
        type: 'paragraph',
        content: 'Happy coding, and may your pointers always find their targets! 🎯'
      }
    ]
  },
  {
    id: '7',
    slug: 'sorting-wars-learn-with-animations',
    title: 'Sorting Wars — Learn Sorting with Animations',
    subtitle: 'Compare sorting algorithms side by side with real-time visualizations',
    description: 'Compare sorting algorithms side by side — bubble, quick, merge, and insertion sorts in real time.',
    author: 'AlgoLib Team',
    date: '2024-01-10',
    readTime: '10 min read',
    category: 'Algorithms',
    tags: ['Sorting', 'Algorithms', 'Visualization', 'Big O'],
    content: [
      {
        type: 'heading',
        content: 'Why Sorting Algorithms Matter'
      },
      {
        type: 'paragraph',
        content: 'Sorting is fundamental to computer science. Understanding different sorting algorithms teaches you about time complexity trade-offs, recursion, divide-and-conquer strategies, and algorithm stability.'
      },
      {
        type: 'heading',
        content: 'Comparison of Popular Sorting Algorithms'
      },
      {
        type: 'paragraph',
        content: 'Algorithm | Time (Best) | Time (Avg) | Time (Worst) | Space | Stable\nBubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes\nInsertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes\nSelection Sort | O(n²) | O(n²) | O(n²) | O(1) | No\nMerge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes\nQuick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No\nHeap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No'
      },
      {
        type: 'heading',
        content: 'Bubble Sort — Simple but Slow'
      },
      {
        type: 'paragraph',
        content: 'Repeatedly swap adjacent elements if they\'re in wrong order. Like bubbles rising to the surface.'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
        swapped = true;
      }
    }
    
    if (!swapped) break; // Already sorted
  }
  
  return arr;
}`
      },
      {
        type: 'heading',
        content: 'Quick Sort — Fast and Efficient'
      },
      {
        type: 'paragraph',
        content: 'Divide-and-conquer: pick a pivot, partition around it, recursively sort left and right.'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
      },
      {
        type: 'heading',
        content: 'Merge Sort — Guaranteed O(n log n)'
      },
      {
        type: 'paragraph',
        content: 'Divide array in half recursively, then merge sorted halves.'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`
      },
      {
        type: 'heading',
        content: 'Understanding Stability'
      },
      {
        type: 'paragraph',
        content: 'A stable sort preserves the relative order of equal elements. This matters when sorting objects with multiple fields.'
      },
      {
        type: 'list',
        items: [
          '✅ Stable: Bubble, Insertion, Merge Sort',
          '❌ Unstable: Selection, Quick, Heap Sort',
          '💡 Use Case: Sorting users by name, then by age (stable sort keeps name order)'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: Use JavaScript\'s built-in sort() for production. It uses TimSort (hybrid of merge + insertion), optimized for real-world data!'
      },
      {
        type: 'paragraph',
        content: 'Ready to see sorting in action? Play Sorting Wars and watch algorithms compete!'
      }
    ]
  },
  {
    id: '8',
    slug: 'build-coding-interview-mindset',
    title: 'Build the Right Mindset for Coding Interviews',
    subtitle: 'Develop consistency, focus, and pattern retention for interview success',
    description: 'Learn how to develop a strong coding mindset — focus, consistency, and daily practice using AlgoLib\'s learning games.',
    author: 'AlgoLib Team',
    date: '2024-01-08',
    readTime: '6 min read',
    category: 'Career',
    tags: ['Interview Prep', 'Mindset', 'Learning', 'Practice'],
    content: [
      {
        type: 'heading',
        content: 'The Interview Mindset Shift'
      },
      {
        type: 'paragraph',
        content: 'Coding interviews aren\'t just about knowing algorithms — they\'re about thinking clearly under pressure, communicating your process, and staying calm when stuck. The right mindset is as important as technical knowledge.'
      },
      {
        type: 'heading',
        content: 'Key Principles for Success'
      },
      {
        type: 'list',
        items: [
          '🎯 Focus on Patterns, Not Problems: Learn 20 patterns, solve 200+ problems',
          '🔄 Consistency Over Intensity: 30 minutes daily beats 5-hour weekend crams',
          '🗣️ Think Out Loud: Practice explaining your approach before coding',
          '❌ Embrace Mistakes: Each error teaches you what NOT to do',
          '📊 Track Progress: Visualize improvement to stay motivated'
        ]
      },
      {
        type: 'heading',
        content: 'The Power of Daily 15-Minute Practice'
      },
      {
        type: 'paragraph',
        content: 'Research shows that short, daily practice sessions outperform long, sporadic study marathons. Here\'s why:'
      },
      {
        type: 'list',
        items: [
          '🧠 Better Retention: Spaced repetition strengthens long-term memory',
          '⚡ No Burnout: Small sessions prevent mental fatigue',
          '🎯 Builds Habit: Consistency creates automatic behavior',
          '📈 Compound Growth: Small daily wins add up exponentially'
        ]
      },
      {
        type: 'heading',
        content: 'How Visualization Improves Recall'
      },
      {
        type: 'paragraph',
        content: 'Visual learning engages multiple parts of your brain simultaneously, creating stronger neural pathways:'
      },
      {
        type: 'list',
        items: [
          '👁️ Visual cortex processes animations',
          '🧠 Prefrontal cortex reasons about logic',
          '✋ Motor cortex reinforces through interaction',
          '💾 Hippocampus stores visual memories longer'
        ]
      },
      {
        type: 'paragraph',
        content: 'When you visualize an algorithm, you create a "mental movie" that\'s easier to recall during high-pressure interviews.'
      },
      {
        type: 'heading',
        content: 'Your 10-Week Interview Prep Plan'
      },
      {
        type: 'list',
        items: [
          '📅 Week 1-2: Arrays & Strings — Two Pointers, Sliding Window',
          '📅 Week 3-4: Linked Lists & Trees — Fast/Slow, DFS/BFS',
          '📅 Week 5-6: Graphs & Dynamic Programming',
          '📅 Week 7-8: Advanced Patterns — Backtracking, Greedy, Trie',
          '📅 Week 9-10: Mock Interviews & System Design'
        ]
      },
      {
        type: 'heading',
        content: 'Dealing with "I\'m Stuck" Moments'
      },
      {
        type: 'paragraph',
        content: 'Every candidate gets stuck. Here\'s how top performers handle it:'
      },
      {
        type: 'list',
        items: [
          '1. Verbalize the Problem: "I\'m trying to find X, but Y is blocking me"',
          '2. Ask Clarifying Questions: "Can I assume the array is sorted?"',
          '3. Start with Brute Force: A working O(n²) beats a broken O(n)',
          '4. Work Through Examples: Trace your logic on paper',
          '5. Pattern Match: "This looks similar to [problem I solved]"'
        ]
      },
      {
        type: 'quote',
        content: '💡 Remember: Interviewers want to see how you think, not just if you know the answer. Communicate your thought process!'
      },
      {
        type: 'heading',
        content: 'Motivation Tips for Consistency'
      },
      {
        type: 'list',
        items: [
          '🏆 Set Micro-Goals: "Solve 1 problem today" not "Master DP this week"',
          '📊 Track Your Streak: Don\'t break the chain!',
          '🎮 Gamify Learning: Use AlgoLib\'s games to make practice fun',
          '👥 Join a Community: Share progress, get support',
          '🎉 Celebrate Small Wins: Solved a hard problem? Take a moment to feel proud!'
        ]
      },
      {
        type: 'paragraph',
        content: 'Start your journey today. Every expert was once a beginner who didn\'t give up. 💪'
      }
    ]
  },
  {
    id: '9',
    slug: 'system-design-starter-kit',
    title: 'System Design Starter Kit — From Algorithms to Architecture',
    subtitle: 'Learn how DSA knowledge applies to scalable system design',
    description: 'Learn how your DSA knowledge applies to scalable system design — from caching to load balancing.',
    author: 'AlgoLib Team',
    date: '2024-01-06',
    readTime: '11 min read',
    category: 'System Design',
    tags: ['System Design', 'Architecture', 'Scalability', 'Backend'],
    content: [
      {
        type: 'heading',
        content: 'Bridging Algorithms and Architecture'
      },
      {
        type: 'paragraph',
        content: 'The algorithms you learn aren\'t just for coding interviews—they\'re the building blocks of scalable systems. Understanding data structures and algorithms helps you make better architectural decisions.'
      },
      {
        type: 'heading',
        content: 'How DSA Connects to System Design'
      },
      {
        type: 'list',
        items: [
          '🔍 Hash Tables → Caching systems (Redis, Memcached)',
          '🌳 Trees → Database indexes (B-trees, B+ trees)',
          '📊 Graphs → Social networks, recommendation engines',
          '📝 Queues → Message queues (RabbitMQ, Kafka)',
          '⚖️ Heaps → Priority queues, task schedulers'
        ]
      },
      {
        type: 'heading',
        content: 'Core System Design Concepts'
      },
      {
        type: 'heading',
        content: '1. Caching Strategies'
      },
      {
        type: 'paragraph',
        content: 'Caching uses hash tables under the hood. Different strategies for different needs:'
      },
      {
        type: 'list',
        items: [
          'LRU (Least Recently Used): Linked list + hash map',
          'LFU (Least Frequently Used): Multiple hash maps + doubly linked lists',
          'Write-Through: Write to cache and DB simultaneously',
          'Write-Back: Write to cache first, DB later (async)'
        ]
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// LRU Cache Implementation
class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;
  
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    
    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    this.cache.set(key, value);
    
    if (this.cache.size > this.capacity) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}`
      },
      {
        type: 'heading',
        content: '2. Load Balancing'
      },
      {
        type: 'paragraph',
        content: 'Distribute traffic across servers using different algorithms:'
      },
      {
        type: 'list',
        items: [
          'Round Robin: Circular distribution (simple queue)',
          'Least Connections: Track active connections (priority queue)',
          'Consistent Hashing: Minimize redistribution when servers change (hash ring)',
          'Weighted Round Robin: Based on server capacity'
        ]
      },
      {
        type: 'heading',
        content: '3. Database Sharding'
      },
      {
        type: 'paragraph',
        content: 'Partition data across multiple databases:'
      },
      {
        type: 'list',
        items: [
          'Hash-based: hash(user_id) % num_shards',
          'Range-based: Users 1-1M on shard1, 1M-2M on shard2',
          'Geo-based: Users by region',
          'Directory-based: Lookup table maps keys to shards'
        ]
      },
      {
        type: 'heading',
        content: '4. Rate Limiting'
      },
      {
        type: 'paragraph',
        content: 'Control API usage with algorithms:'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Token Bucket Rate Limiter
class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;
  
  constructor(maxTokens: number, refillRate: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }
  
  allowRequest(): boolean {
    this.refillTokens();
    
    if (this.tokens >= 1) {
      this.tokens--;
      return true;
    }
    
    return false;
  }
  
  private refillTokens(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}`
      },
      {
        type: 'heading',
        content: '5. Microservices Communication'
      },
      {
        type: 'paragraph',
        content: 'How services talk to each other:'
      },
      {
        type: 'list',
        items: [
          'REST APIs: Stateless, cacheable (HTTP)',
          'Message Queues: Async, decoupled (Kafka, RabbitMQ)',
          'gRPC: Binary protocol, faster than REST',
          'GraphQL: Client specifies exact data needs'
        ]
      },
      {
        type: 'heading',
        content: 'Common System Design Interview Questions'
      },
      {
        type: 'list',
        items: [
          '🔗 Design URL Shortener (hashing, base62 encoding)',
          '📸 Design Instagram (blob storage, CDN, feed generation)',
          '💬 Design WhatsApp (websockets, message queues)',
          '🎥 Design YouTube (video encoding, CDN, recommendations)',
          '🚗 Design Uber (geospatial indexes, real-time matching)'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: Always start with requirements! Ask about scale (users, requests/sec), latency needs, and consistency vs availability trade-offs.'
      },
      {
        type: 'paragraph',
        content: 'Master the fundamentals first, then system design becomes intuitive!'
      }
    ]
  },
  {
    id: '10',
    slug: 'greedy-algorithms-optimal-decisions',
    title: 'Greedy Algorithms — Make Optimal Decisions Every Step',
    subtitle: 'Learn when greedy choices lead to global optimization',
    description: 'Understand greedy algorithms by playing a visual decision-making challenge that teaches optimal step-by-step logic.',
    author: 'AlgoLib Team',
    date: '2024-01-04',
    readTime: '8 min read',
    category: 'Algorithms',
    tags: ['Greedy', 'Optimization', 'Algorithms', 'Problem Solving'],
    content: [
      {
        type: 'heading',
        content: 'What Are Greedy Algorithms?'
      },
      {
        type: 'paragraph',
        content: 'Greedy algorithms make the locally optimal choice at each step, hoping to find a global optimum. They\'re fast but don\'t always give the correct answer—you need to prove the greedy choice property.'
      },
      {
        type: 'heading',
        content: 'When Does Greedy Work?'
      },
      {
        type: 'list',
        items: [
          '✅ Greedy Choice Property: Local optimum leads to global optimum',
          '✅ Optimal Substructure: Optimal solution contains optimal solutions to subproblems',
          '✅ No Look-Ahead Needed: Don\'t need to reconsider choices',
          '❌ Doesn\'t Work: When future choices depend on past ones (use DP instead)'
        ]
      },
      {
        type: 'heading',
        content: 'Classic Example: Activity Selection'
      },
      {
        type: 'paragraph',
        content: 'Given activities with start and end times, select maximum number of non-overlapping activities:'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `interface Activity {
  start: number;
  end: number;
}

function activitySelection(activities: Activity[]): Activity[] {
  // Greedy choice: always pick activity that ends earliest
  activities.sort((a, b) => a.end - b.end);
  
  const selected: Activity[] = [activities[0]];
  let lastEnd = activities[0].end;
  
  for (let i = 1; i < activities.length; i++) {
    if (activities[i].start >= lastEnd) {
      selected.push(activities[i]);
      lastEnd = activities[i].end;
    }
  }
  
  return selected;
}

// Why this works: Choosing earliest-ending activity 
// leaves maximum room for future activities`
      },
      {
        type: 'heading',
        content: 'Coin Change (Greedy Works for Specific Coin Systems)'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Works for US coins: [25, 10, 5, 1]
function coinChangeGreedy(amount: number, coins: number[]): number[] {
  coins.sort((a, b) => b - a); // Largest first
  const result: number[] = [];
  
  for (const coin of coins) {
    while (amount >= coin) {
      result.push(coin);
      amount -= coin;
    }
  }
  
  return result;
}

// Greedy FAILS for coins like [1, 3, 4] and amount = 6
// Greedy: 4 + 1 + 1 = 3 coins
// Optimal: 3 + 3 = 2 coins
// Use DP for general coin systems!`
      },
      {
        type: 'heading',
        content: 'Interval Scheduling'
      },
      {
        type: 'paragraph',
        content: 'Similar to activity selection but you want to minimize rooms needed:'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function minMeetingRooms(intervals: number[][]): number {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  
  let rooms = 0;
  let maxRooms = 0;
  let startPtr = 0, endPtr = 0;
  
  while (startPtr < starts.length) {
    if (starts[startPtr] < ends[endPtr]) {
      rooms++;
      maxRooms = Math.max(maxRooms, rooms);
      startPtr++;
    } else {
      rooms--;
      endPtr++;
    }
  }
  
  return maxRooms;
}`
      },
      {
        type: 'heading',
        content: 'Huffman Coding — Optimal Compression'
      },
      {
        type: 'paragraph',
        content: 'Build a binary tree where frequent characters have shorter codes:'
      },
      {
        type: 'list',
        items: [
          '1. Create leaf nodes for each character with frequency',
          '2. Always merge two nodes with lowest frequency (min heap)',
          '3. Repeat until one tree remains',
          '4. Assign 0 for left edge, 1 for right edge'
        ]
      },
      {
        type: 'heading',
        content: 'Common Greedy Problems'
      },
      {
        type: 'list',
        items: [
          '💰 Fractional Knapsack (greedy works, 0/1 needs DP)',
          '⛽ Gas Station (circular array greedy)',
          '🔢 Jump Game (can you reach the end?)',
          '📅 Meeting Rooms II (min rooms needed)',
          '🎯 Assign Cookies (satisfy max children)'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: Always ask yourself: "Does making the locally best choice now guarantee the globally best solution?" If not, consider DP!'
      }
    ]
  },
  {
    id: '11',
    slug: 'backtracking-decision-trees',
    title: 'Backtracking — Visualize Every Decision Tree',
    subtitle: 'Master backtracking by seeing recursion branches unfold',
    description: 'Master backtracking by seeing recursion branches unfold live — permutations, subsets, and Sudoku solving.',
    author: 'AlgoLib Team',
    date: '2024-01-02',
    readTime: '9 min read',
    category: 'Algorithms',
    tags: ['Backtracking', 'Recursion', 'DFS', 'Problem Solving'],
    content: [
      {
        type: 'heading',
        content: 'What is Backtracking?'
      },
      {
        type: 'paragraph',
        content: 'Backtracking is a refined brute force approach. Build solutions incrementally, abandoning paths that can\'t lead to valid solutions. Think of it as DFS with pruning.'
      },
      {
        type: 'heading',
        content: 'The Backtracking Template'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function backtrack(state, choices, result) {
  // Base case: found valid solution
  if (isValidSolution(state)) {
    result.push([...state]); // Save a copy
    return;
  }
  
  // Try each choice
  for (const choice of choices) {
    // Make choice
    state.push(choice);
    
    // Recurse
    backtrack(state, getNextChoices(state), result);
    
    // Unmake choice (backtrack)
    state.pop();
  }
}`
      },
      {
        type: 'heading',
        content: 'Example 1: Generate All Subsets'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  
  function backtrack(start: number, current: number[]) {
    // Every state is a valid subset
    result.push([...current]);
    
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);        // Include nums[i]
      backtrack(i + 1, current);     // Recurse
      current.pop();                 // Exclude nums[i]
    }
  }
  
  backtrack(0, []);
  return result;
}

// For [1,2,3]:
// []
// [1] → [1,2] → [1,2,3]
//       [1,3]
// [2] → [2,3]
// [3]`
      },
      {
        type: 'heading',
        content: 'Example 2: Generate Permutations'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  
  function backtrack(current: number[], remaining: number[]) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }
    
    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      
      // Remove remaining[i] for next recursion
      const next = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
      backtrack(current, next);
      
      current.pop();
    }
  }
  
  backtrack([], nums);
  return result;
}`
      },
      {
        type: 'heading',
        content: 'Example 3: N-Queens'
      },
      {
        type: 'paragraph',
        content: 'Place N queens on an N×N board so no two attack each other:'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const board: string[][] = Array(n).fill(0).map(() => Array(n).fill('.'));
  
  function isValid(row: number, col: number): boolean {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    
    // Check diagonal (top-left)
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    
    // Check diagonal (top-right)
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    
    return true;
  }
  
  function backtrack(row: number) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = 'Q';    // Place queen
        backtrack(row + 1);        // Recurse
        board[row][col] = '.';     // Remove queen
      }
    }
  }
  
  backtrack(0);
  return result;
}`
      },
      {
        type: 'heading',
        content: 'Pruning — The Key Optimization'
      },
      {
        type: 'paragraph',
        content: 'Don\'t explore paths that can\'t lead to solutions:'
      },
      {
        type: 'list',
        items: [
          '✂️ Early Termination: Stop when constraint violated',
          '✂️ Memoization: Cache states you\'ve seen',
          '✂️ Constraint Propagation: Rule out impossible choices',
          '✂️ Heuristics: Try most promising paths first'
        ]
      },
      {
        type: 'heading',
        content: 'Common Backtracking Problems'
      },
      {
        type: 'list',
        items: [
          '🎯 Generate all subsets/combinations',
          '🔄 Generate all permutations',
          '♟️ N-Queens, Sudoku solver',
          '🧮 Combination Sum',
          '📞 Letter combinations of phone number',
          '🗺️ Word Search in grid'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: Draw the decision tree! Each level is a choice, each leaf is a solution. Backtracking is DFS on this tree with pruning.'
      }
    ]
  },
  {
    id: '12',
    slug: 'recursion-call-stack-visualization',
    title: 'Recursion — Understand Call Stacks Step by Step',
    subtitle: 'Watch recursion unfold with visual call stack tracking',
    description: 'Recursion made easy — watch call stacks and return paths unfold visually in AlgoLib\'s interactive visualizations.',
    author: 'AlgoLib Team',
    date: '2023-12-30',
    readTime: '8 min read',
    category: 'Fundamentals',
    tags: ['Recursion', 'Call Stack', 'Fundamentals', 'Visualization'],
    content: [
      {
        type: 'heading',
        content: 'What is Recursion?'
      },
      {
        type: 'paragraph',
        content: 'Recursion is when a function calls itself to solve smaller instances of the same problem. Every recursive function needs two things: a base case (stopping condition) and a recursive case (progress toward base case).'
      },
      {
        type: 'heading',
        content: 'The Anatomy of Recursion'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function recursiveFunction(input) {
  // Base case: when to stop
  if (baseCondition) {
    return baseValue;
  }
  
  // Recursive case: call itself with simpler input
  return someOperation(recursiveFunction(simplerInput));
}`
      },
      {
        type: 'heading',
        content: 'Example 1: Factorial'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function factorial(n: number): number {
  // Base case
  if (n <= 1) return 1;
  
  // Recursive case
  return n * factorial(n - 1);
}

// Call stack for factorial(4):
// factorial(4) → 4 * factorial(3)
//   factorial(3) → 3 * factorial(2)
//     factorial(2) → 2 * factorial(1)
//       factorial(1) → 1 (base case)
//     factorial(2) → 2 * 1 = 2
//   factorial(3) → 3 * 2 = 6
// factorial(4) → 4 * 6 = 24`
      },
      {
        type: 'heading',
        content: 'Example 2: Fibonacci'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Tree structure for fib(5):
//                 fib(5)
//             /            \\
//         fib(4)          fib(3)
//        /      \\        /      \\
//    fib(3)   fib(2)  fib(2)  fib(1)
//    /   \\    /   \\   /   \\
// fib(2) fib(1) ...

// Notice: fib(3) calculated twice! Use memoization.`
      },
      {
        type: 'heading',
        content: 'Understanding the Call Stack'
      },
      {
        type: 'paragraph',
        content: 'Each function call creates a stack frame containing:'
      },
      {
        type: 'list',
        items: [
          '📦 Local variables',
          '📍 Return address (where to resume)',
          '🔢 Parameters',
          '💾 Return value (when function completes)'
        ]
      },
      {
        type: 'heading',
        content: 'Example 3: Tree Traversal'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

// Inorder: Left → Root → Right
function inorder(root: TreeNode | null, result: number[] = []): number[] {
  if (root === null) return result;
  
  inorder(root.left, result);    // Visit left subtree
  result.push(root.val);         // Visit root
  inorder(root.right, result);   // Visit right subtree
  
  return result;
}

// For tree:     4
//             /   \\
//            2     6
//           / \\   / \\
//          1   3 5   7
//
// Inorder: [1, 2, 3, 4, 5, 6, 7]`
      },
      {
        type: 'heading',
        content: 'Recursion vs Iteration'
      },
      {
        type: 'paragraph',
        content: 'Any recursion can be converted to iteration using a stack:'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Recursive
function sumRecursive(n: number): number {
  if (n === 0) return 0;
  return n + sumRecursive(n - 1);
}

// Iterative
function sumIterative(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// Recursion: More elegant, uses call stack
// Iteration: More efficient, uses loop`
      },
      {
        type: 'heading',
        content: 'Common Pitfalls'
      },
      {
        type: 'list',
        items: [
          '❌ Missing base case → Infinite recursion → Stack overflow',
          '❌ Not progressing toward base case',
          '❌ Too deep recursion → Stack overflow (max ~10k calls)',
          '❌ Inefficient: Recalculating same values (use memoization)',
          '✅ Solution: Add base case, ensure progress, use DP for optimization'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: To understand recursion, you must first understand recursion. 😉 Draw the call stack on paper—it makes everything click!'
      }
    ]
  },
  {
    id: '13',
    slug: 'binary-search-divide-conquer',
    title: 'Binary Search — Divide and Conquer Like a Pro',
    subtitle: 'Master binary search with live mid-point visualizations',
    description: 'Learn how binary search works with live visuals of mid-point moves and array divisions.',
    author: 'AlgoLib Team',
    date: '2023-12-28',
    readTime: '7 min read',
    category: 'Algorithms',
    tags: ['Binary Search', 'Divide and Conquer', 'Arrays', 'Optimization'],
    content: [
      {
        type: 'heading',
        content: 'What is Binary Search?'
      },
      {
        type: 'paragraph',
        content: 'Binary search is the most efficient way to search in a sorted array. Instead of checking every element (O(n)), we eliminate half the search space with each comparison (O(log n)).'
      },
      {
        type: 'heading',
        content: 'The Core Algorithm'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found it!
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Not found
}

// Example: [1, 3, 5, 7, 9, 11], target = 7
// Step 1: left=0, right=5, mid=2, arr[2]=5 < 7 → left=3
// Step 2: left=3, right=5, mid=4, arr[4]=9 > 7 → right=3
// Step 3: left=3, right=3, mid=3, arr[3]=7 ✓ Found!`
      },
      {
        type: 'heading',
        content: 'Common Binary Search Variations'
      },
      {
        type: 'heading',
        content: '1. Find First Occurrence'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function findFirst(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;      // Store result
      right = mid - 1;   // Continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}`
      },
      {
        type: 'heading',
        content: '2. Search in Rotated Sorted Array'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function searchRotated(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] === target) return mid;
    
    // Determine which half is sorted
    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  
  return -1;
}

// Example: [4,5,6,7,0,1,2], target = 0
// Array rotated at index 4`
      },
      {
        type: 'heading',
        content: '3. Find Minimum in Rotated Array'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function findMin(nums: number[]): number {
  let left = 0, right = nums.length - 1;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] > nums[right]) {
      // Minimum is in right half
      left = mid + 1;
    } else {
      // Minimum is in left half (or is mid)
      right = mid;
    }
  }
  
  return nums[left];
}`
      },
      {
        type: 'heading',
        content: 'Binary Search on Answer Space'
      },
      {
        type: 'paragraph',
        content: 'Sometimes you binary search on the answer itself, not the array!'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Find smallest number where condition is true
function binarySearchOnAnswer(
  min: number, 
  max: number, 
  condition: (x: number) => boolean
): number {
  let left = min, right = max;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (condition(mid)) {
      result = mid;
      right = mid - 1; // Try smaller
    } else {
      left = mid + 1;  // Need larger
    }
  }
  
  return result;
}

// Example: "Find minimum days to make m bouquets"
// Binary search on days: [1, 2, ..., max_days]`
      },
      {
        type: 'heading',
        content: 'When to Use Binary Search'
      },
      {
        type: 'list',
        items: [
          '🎯 Array is sorted (or rotated sorted)',
          '🎯 You need to find a specific value or position',
          '🎯 Problem has monotonic property (if X works, X+1 also works)',
          '🎯 You can check if answer is valid in O(n) or less',
          '🎯 Search space can be represented as range [min, max]'
        ]
      },
      {
        type: 'heading',
        content: 'Common Mistakes'
      },
      {
        type: 'list',
        items: [
          '❌ Integer overflow: Use mid = left + (right - left) / 2',
          '❌ Infinite loop: Ensure left/right changes each iteration',
          '❌ Off-by-one: Use left <= right for inclusive, left < right for exclusive',
          '❌ Forgetting sorted requirement'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: Binary search reduces search from O(n) to O(log n). For 1 billion elements, that\'s 30 comparisons vs 1 billion!'
      }
    ]
  },
  {
    id: '14',
    slug: 'data-structure-fundamentals',
    title: 'Data Structure Visual Hub — Master the Core Structures',
    subtitle: 'One place to learn all fundamental data structures interactively',
    description: 'One dashboard to visualize stacks, queues, linked lists, trees, and graphs interactively.',
    author: 'AlgoLib Team',
    date: '2023-12-26',
    readTime: '9 min read',
    category: 'Data Structures',
    tags: ['Data Structures', 'Fundamentals', 'Learning', 'Visualization'],
    content: [
      {
        type: 'heading',
        content: 'Why Data Structures Matter'
      },
      {
        type: 'paragraph',
        content: 'Data structures are the building blocks of efficient algorithms. Choosing the right structure can transform O(n²) code into O(n) or even O(1). Let\'s explore the essential structures every developer must know.'
      },
      {
        type: 'heading',
        content: '1. Arrays — The Foundation'
      },
      {
        type: 'paragraph',
        content: 'Contiguous memory, random access in O(1).'
      },
      {
        type: 'list',
        items: [
          '✅ Access by index: O(1)',
          '✅ Append to end: O(1) amortized',
          '❌ Insert/Delete middle: O(n)',
          '❌ Fixed size (in some languages)'
        ]
      },
      {
        type: 'heading',
        content: '2. Linked Lists — Dynamic Sequential Data'
      },
      {
        type: 'paragraph',
        content: 'Nodes connected by pointers, efficient insertions/deletions.'
      },
      {
        type: 'list',
        items: [
          '✅ Insert/Delete at known position: O(1)',
          '✅ Dynamic size',
          '❌ Access by index: O(n)',
          '❌ Extra memory for pointers'
        ]
      },
      {
        type: 'code',
        language: 'typescript',
        content: `class ListNode {
  val: number;
  next: ListNode | null;
  
  constructor(val: number) {
    this.val = val;
    this.next = null;
  }
}

// Reverse a linked list
function reverse(head: ListNode | null): ListNode | null {
  let prev = null;
  let curr = head;
  
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  
  return prev;
}`
      },
      {
        type: 'heading',
        content: '3. Stacks — LIFO Principle'
      },
      {
        type: 'list',
        items: [
          '📚 Use Cases: Undo/redo, function call stack, expression parsing',
          '⚡ Operations: Push O(1), Pop O(1), Peek O(1)'
        ]
      },
      {
        type: 'heading',
        content: '4. Queues — FIFO Principle'
      },
      {
        type: 'list',
        items: [
          '📚 Use Cases: BFS, task scheduling, print queue',
          '⚡ Operations: Enqueue O(1), Dequeue O(1)'
        ]
      },
      {
        type: 'heading',
        content: '5. Hash Tables — Fast Lookup'
      },
      {
        type: 'paragraph',
        content: 'Key-value pairs with O(1) average access.'
      },
      {
        type: 'list',
        items: [
          '✅ Insert/Delete/Search: O(1) average',
          '✅ Perfect for caching, counting, deduplication',
          '❌ No order maintained',
          '❌ Worst case O(n) with collisions'
        ]
      },
      {
        type: 'heading',
        content: '6. Binary Trees — Hierarchical Data'
      },
      {
        type: 'code',
        language: 'typescript',
        content: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  
  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// Tree traversals
function inorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
}

function preorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [root.val, ...preorder(root.left), ...preorder(root.right)];
}

function postorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...postorder(root.left), ...postorder(root.right), root.val];
}`
      },
      {
        type: 'heading',
        content: '7. Binary Search Trees (BST)'
      },
      {
        type: 'paragraph',
        content: 'Ordered binary tree: left < root < right'
      },
      {
        type: 'list',
        items: [
          '✅ Search/Insert/Delete: O(log n) average',
          '✅ Inorder traversal gives sorted order',
          '❌ Can become unbalanced → O(n)',
          '✅ Self-balancing variants: AVL, Red-Black trees'
        ]
      },
      {
        type: 'heading',
        content: '8. Heaps — Priority Queue'
      },
      {
        type: 'list',
        items: [
          '📊 Min Heap: Parent ≤ children (root is minimum)',
          '📊 Max Heap: Parent ≥ children (root is maximum)',
          '✅ Insert: O(log n), Extract min/max: O(log n)',
          '📚 Use Cases: Priority queue, top K elements, median finding'
        ]
      },
      {
        type: 'heading',
        content: '9. Graphs — Network Relationships'
      },
      {
        type: 'paragraph',
        content: 'Nodes (vertices) connected by edges.'
      },
      {
        type: 'list',
        items: [
          '🔗 Directed vs Undirected',
          '⚖️ Weighted vs Unweighted',
          '🗺️ Representations: Adjacency list (common), Adjacency matrix',
          '📚 Algorithms: BFS, DFS, Dijkstra, Bellman-Ford, Topological sort'
        ]
      },
      {
        type: 'heading',
        content: 'Choosing the Right Structure'
      },
      {
        type: 'list',
        items: [
          '🎯 Fast access by key? → Hash Table',
          '🎯 Maintain order, fast search? → BST',
          '🎯 LIFO access? → Stack',
          '🎯 FIFO access? → Queue',
          '🎯 Always get min/max? → Heap',
          '🎯 Relationships between entities? → Graph',
          '🎯 Hierarchical data? → Tree'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: Master these 9 core structures and you can solve 90% of coding problems efficiently!'
      }
    ]
  }
];

export const getBlogPost = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getRelatedPosts = (currentSlug: string, limit: number = 3): BlogPost[] => {
  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .slice(0, limit);
};
