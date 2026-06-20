import { content as linkedListContent } from "./guides/linked-list";
import { content as treesContent } from "./guides/trees";
import { content as trieContent } from "./guides/trie";
import { content as graphsContent } from "./guides/graphs";
import { content as arraysHashingContent } from "./guides/arrays-hashing";
import { content as twoPointersContent } from "./guides/two-pointers";
import { content as frequencyCounterContent } from "./guides/frequency-counter";
import { content as slidingWindowContent } from "./guides/sliding-window";
import { content as stackContent } from "./guides/stack";
import { content as binarySearchContent } from "./guides/binary-search";
import { content as recursionContent } from "./guides/recursion";
import { content as backtrackingContent } from "./guides/backtracking";
import { content as coreDataStructuresContent } from "./guides/core-data-structures";
import { content as mergeIntervalsContent } from "./guides/merge-intervals";
import { content as prefixSumContent } from "./guides/prefix-sum";
import { content as dynamicProgrammingContent } from "./guides/dynamic-programming";
import { content as cyclicSortContent } from "./guides/cyclic-sort";
import { content as mergeSortContent } from "./guides/merge-sort";
import { content as whatIsDatabaseContent } from "./guides/what-is-database";
import { content as typesOfDatabasesContent } from "./guides/types-of-databases";
import { content as databaseTerminologyContent } from "./guides/database-terminology";


export interface RelatedQuestion {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface GuideItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string; // Markdown content
  questions: RelatedQuestion[];
  visualizations?: string[]; // mapped to visualizationMapping.tsx
  videoUrl?: string;
  heroImage?: string;
  author?: {
    name: string;
    role: string;
    avatarUrl?: string;
    linkedin?: string;
  };
}

export interface GuideCategory {
  id: string;
  title: string;
  guides: GuideItem[];
}

export const guidesData: GuideCategory[] = [
  {
    id: "time-complexity",
    title: "Time Complexity",
    guides: [
      {
        slug: "time-complexity",
        title: "Time Complexity Cheat Sheet",
        description: "A quick reference guide for common operation complexities and Big O rules.",
        category: "time-complexity",
        heroImage: "time-compxity-hero",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        content: `
# Time Complexity Cheat Sheet

## Overview

Here is an overview of Time and Space complexity, followed by the reference table of standard operations across data structures and algorithms.

### Common Data Structure Operations

| Data Structure | Access / Lookup | Search | Insertion | Deletion |
| :--- | :--- | :--- | :--- | :--- |
| **Array / Vector** | O(1) | O(n) | O(n) (O(1) at end) | O(n) (O(1) at end) |
| **Singly Linked List** | O(n) | O(n) | O(1) (with pointer) | O(1) (with pointer) |
| **Doubly Linked List** | O(n) | O(n) | O(1) | O(1) |
| **Stack (LIFO)** | O(1) (top only) | O(n) | O(1) (push) | O(1) (pop) |
| **Queue (FIFO)** | O(1) (front only) | O(n) | O(1) (enqueue) | O(1) (dequeue) |
| **Hash Table** | O(1) (average) | O(1) (average) | O(1) (average) | O(1) (average) |
| **Binary Search Tree** | O(log n) (avg) / O(n) (worst) | O(log n) (avg) / O(n) (worst) | O(log n) (avg) / O(n) (worst) | O(log n) (avg) / O(n) (worst) |
| **Red-Black Tree / AVL** | O(log n) | O(log n) | O(log n) | O(log n) |

### Common Algorithmic Operations

| Operation / Algorithm | Complexity | Why / Notes |
| :--- | :--- | :--- |
| **Binary Search** | O(log n) | Halves the search space at each iteration. |
| **Heap Push / Pop** | O(log n) | Up-heaping or down-heaping requires traversing heap height. |
| **Sorting (Merge/Quick/Heap)** | O(n log n) | Optimal comparison-based sorting complexity. |
| **Graph DFS / BFS** | O(V + E) | Visits every vertex V and checks every edge E. |
| **Tree Traversal (DFS/BFS)** | O(n) | Visits every node in the tree exactly once. |
| **Matrix Traversal** | O(R × C) | Visits every cell in a grid of dimensions R by C. |

## O(1) - Constant Time

## O(log n) - Logarithmic Time

## O(n) - Linear Time

## O(n log n) - Linearithmic Time

## O(n^2) - Quadratic Time
`,
        questions: [
          { id: "binary-search", name: "Binary Search", difficulty: "Easy" }
        ]
      }
    ]
  },
  {
    id: "space-complexity",
    title: "Space Complexity",
    guides: [
      {
        slug: "space-complexity",
        title: "Space Complexity Cheat Sheet",
        description: "A quick reference guide for common operation space complexities, auxiliary memory, and recursion stack rules.",
        category: "space-complexity",
        heroImage: "space-compxity-hero",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["binary-search", "reverse-linked-list", "monotonic-stack", "knapsack-01"],
        content: `
# Space Complexity Cheat Sheet

## Overview

Here is an overview of Space Complexity, followed by the reference table of standard space usage across data structures and algorithms.

### Common Data Structure Space Complexity

| Data Structure | Space Complexity | Why / Notes |
| :--- | :--- | :--- |
| **Array / Vector** | O(n) | Storing $N$ elements in contiguous memory. |
| **Singly Linked List** | O(n) | Storing $N$ elements, each node requiring a next pointer. |
| **Doubly Linked List** | O(n) | Storing $N$ elements, each node requiring previous and next pointers. |
| **Stack (LIFO)** | O(n) | Space grows with the maximum number of items pushed onto the stack. |
| **Queue (FIFO)** | O(n) | Space grows with the maximum size of queue at any point. |
| **Hash Table** | O(n) | Requires memory proportional to the number of key-value pairs stored. |
| **Binary Search Tree** | O(n) | Storing $N$ nodes in memory. |
| **Red-Black Tree / AVL** | O(n) | Storing $N$ nodes in memory with balanced tree guarantees. |

### Common Algorithmic Space Complexity

| Operation / Algorithm | Space Complexity | Why / Notes |
| :--- | :--- | :--- |
| **Binary Search** | O(1) | Iterative version requires constant auxiliary space. Recursive version requires O(log n) call stack space. |
| **Merge Sort** | O(n) | Requires auxiliary arrays of size $N$ to merge sub-arrays. |
| **Quick Sort** | O(log n) | Requires O(log n) auxiliary stack space for partition recursion (average). |
| **Graph DFS** | O(V) | Stack memory needed for recursion or iterative stack path in worst case. |
| **Graph BFS** | O(V) | Queue memory needed to hold vertices at the maximum layer width. |
| **Recursion Call Stack** | O(depth) | Memory is proportional to the maximum depth of call stack. |
`,
        questions: [
          { id: "binary-search", name: "Binary Search", difficulty: "Easy" }
        ]
      }
    ]
  },
  {
    id: "fundamentals",
    title: "Fundamentals",
    guides: [
      {
        slug: "core-data-structures",
        title: "Core Data Structures",
        description: "High-level summary of Array, HashMap, Stack, Queue, Heap and when to use them.",
        category: "fundamentals",
        heroImage: "fundamentals-overview",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["reverse-linked-list", "bfs-level-order", "monotonic-stack", "binary-search", "kth-largest-element-in-a-stream"],
        content: coreDataStructuresContent,
        questions: [
          { id: "two-sum", name: "Two Sum", difficulty: "Easy" },
          { id: "valid-parentheses", name: "Valid Parentheses", difficulty: "Easy" }
        ]
      },
      {
        slug: "linked-list",
        title: "Linked List Guide",
        description: "Master pointers, reversing, and cycle detection in singly and doubly linked lists.",
        category: "fundamentals",
        heroImage: "fundamentals-linked-list",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["reverse-linked-list", "detect-cycle-in-a-linked-list", "middle-node", "merge-two-sorted-lists"],
        content: linkedListContent,
        questions: [
          { id: "reverse-linked-list", name: "Reverse Linked List", difficulty: "Easy" },
          { id: "detect-cycle-in-a-linked-list", name: "Linked List Cycle", difficulty: "Easy" },
          { id: "merge-two-sorted-lists", name: "Merge Two Sorted Lists", difficulty: "Easy" }
        ]
      },
      {
        slug: "trees",
        title: "Binary Trees & BSTs",
        description: "DFS Traversals, BFS level orders, and Binary Search Tree properties.",
        category: "fundamentals",
        heroImage: "fundamentals-bst",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["dfs-inorder", "bfs-level-order", "lowest-common-ancestor-of-bst", "bst-insert", "invert-binary-tree"],
        content: treesContent,
        questions: [
          { id: "invert-binary-tree", name: "Invert Binary Tree", difficulty: "Easy" },
          { id: "maximum-depth-of-binary-tree", name: "Maximum Depth of Binary Tree", difficulty: "Easy" },
          { id: "lowest-common-ancestor-of-a-binary-search-tree", name: "Lowest Common Ancestor of a BST", difficulty: "Easy" }
        ]
      },
      {
        slug: "trie",
        title: "Trie (Prefix Tree)",
        description: "Master string prefix queries and autocomplete dictionary structures.",
        category: "fundamentals",
        heroImage: "fundamentals--trie",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["trie"],
        content: trieContent,
        questions: [
          { id: "implement-trie-prefix-tree", name: "Implement Trie", difficulty: "Medium" },
          { id: "design-add-and-search-words-data-structure", name: "Add and Search Word", difficulty: "Medium" }
        ]
      },
      {
        slug: "graphs",
        title: "Graphs Algorithms",
        description: "Topological sort, cycle detection, DFS/BFS grids, and shortest path basics.",
        category: "fundamentals",
        heroImage: "fundamentals-graph-algorith",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["graph-dfs", "graph-bfs", "topological-sort", "dijkstras", "number-of-islands"],
        content: graphsContent,
        questions: [
          { id: "number-of-islands", name: "Number of Islands", difficulty: "Medium" },
          { id: "clone-graph", name: "Clone Graph", difficulty: "Medium" },
          { id: "course-schedule", name: "Course Schedule", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "arrays-hashing",
    title: "Arrays & Hashing",
    guides: [
      {
        slug: "arrays-hashing",
        title: "Arrays & Hashing",
        description: "Learn frequency counting, prefix sums, and element mapping tactics.",
        category: "arrays-hashing",
        heroImage: "core-pattern-arrays",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["prefix-sum", "top-k-frequent-elements", "rotate-array", "maximum-subarray"],
        content: arraysHashingContent,
        questions: [
          { id: "two-sum", name: "Two Sum", difficulty: "Easy" },
          { id: "valid-anagram", name: "Valid Anagram", difficulty: "Easy" },
          { id: "group-anagrams", name: "Group Anagrams", difficulty: "Medium" },
          { id: "longest-consecutive-sequence", name: "Longest Consecutive Sequence", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    guides: [
      {
        slug: "two-pointers",
        title: "Two Pointers",
        description: "Master opposing pointers, fast-slow pointers, and sorted partition tactics.",
        category: "two-pointers",
        heroImage: "core-pattern-two-pointer",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["two-pointers", "dutch-national-flag", "container-with-most-water", "trapping-rain-water"],
        content: twoPointersContent,
        questions: [
          { id: "valid-palindrome", name: "Valid Palindrome", difficulty: "Easy" },
          { id: "two-sum-ii-input-array-is-sorted", name: "Two Sum II", difficulty: "Medium" },
          { id: "3sum", name: "3Sum", difficulty: "Medium" },
          { id: "container-with-most-water", name: "Container With Most Water", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "frequency-counter",
    title: "Frequency Counter",
    guides: [
      {
        slug: "frequency-counter",
        title: "Frequency Counter",
        description: "Master character inventories, count matching, and element frequency caching.",
        category: "frequency-counter",
        heroImage: "core-pattern-frequency-counter",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["valid-anagram", "top-k-frequent-elements"],
        content: frequencyCounterContent,
        questions: [
          { id: "valid-anagram", name: "Valid Anagram", difficulty: "Easy" },
          { id: "group-anagrams", name: "Group Anagrams", difficulty: "Medium" },
          { id: "top-k-frequent-elements", name: "Top K Frequent Elements", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "prefix-sum",
    title: "Prefix Sum",
    guides: [
      {
        slug: "prefix-sum",
        title: "Prefix Sum",
        description: "Master the magic diary pattern for instant range queries and subarray sums.",
        category: "prefix-sum",
        heroImage: "prefix-sum",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["prefix-sum"],
        content: prefixSumContent,
        questions: [
          { id: "product-of-array-except-self", name: "Product of Array Except Self", difficulty: "Medium" },
          { id: "maximum-subarray", name: "Maximum Subarray", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    guides: [
      {
        slug: "sliding-window",
        title: "Sliding Window",
        description: "Master fixed and variable-sized windows to optimize subarray/substring searches.",
        category: "sliding-window",
        heroImage: "core-pattern-slidng-window",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["sliding-window", "sliding-window-maximum"],
        content: slidingWindowContent,
        questions: [
          { id: "longest-substring-without-repeating-characters", name: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
          { id: "longest-repeating-character-replacement", name: "Longest Repeating Character Replacement", difficulty: "Medium" },
          { id: "minimum-window-substring", name: "Minimum Window Substring", difficulty: "Hard" }
        ]
      }
    ]
  },
  {
    id: "stack",
    title: "Stack",
    guides: [
      {
        slug: "stack",
        title: "Stack & Monotonic Stack",
        description: "LIFO concepts, bracket pairing, and next-greater-element monotonic templates.",
        category: "stack",
        heroImage: "core-pattern-stack-deep",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["valid-parentheses", "monotonic-stack"],
        content: stackContent,
        questions: [
          { id: "valid-parentheses", name: "Valid Parentheses", difficulty: "Easy" },
          { id: "min-stack", name: "Min Stack", difficulty: "Medium" },
          { id: "daily-temperatures", name: "Daily Temperatures", difficulty: "Medium" },
          { id: "largest-rectangle-in-histogram", name: "Largest Rectangle in Histogram", difficulty: "Hard" }
        ]
      }
    ]
  },
  {
    id: "binary-search",
    title: "Binary Search",
    guides: [
      {
        slug: "binary-search",
        title: "Binary Search",
        description: "Learn standard templates, range search, and binary search on solution space.",
        category: "binary-search",
        heroImage: "core-pattern-bineary",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["binary-search"],
        content: binarySearchContent,
        questions: [
          { id: "binary-search", name: "Binary Search", difficulty: "Easy" },
          { id: "search-a-2d-matrix", name: "Search a 2D Matrix", difficulty: "Medium" },
          { id: "find-minimum-in-rotated-sorted-array", name: "Find Min in Rotated Sorted Array", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "cyclic-sort",
    title: "Cyclic Sort",
    guides: [
      {
        slug: "cyclic-sort",
        title: "Cyclic Sort",
        description: "Master finding missing and duplicate numbers in O(n) time and O(1) space.",
        category: "cyclic-sort",
        heroImage: "core-pattern-cyclic-sort-hero",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["missing-number"],
        content: cyclicSortContent,
        questions: [
          { id: "missing-number", name: "Missing Number", difficulty: "Easy" },
          { id: "find-the-duplicate-number", name: "Find the Duplicate Number", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "merge-sort",
    title: "Merge Sort",
    guides: [
      {
        slug: "merge-sort",
        title: "Merge Sort",
        description: "Master Divide and Conquer with O(n log n) sorting and merging techniques.",
        category: "merge-sort",
        heroImage: "core-pattern-merge-sort-hero",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["merge-two-sorted-lists"],
        content: mergeSortContent,
        questions: [
          { id: "sort-an-array", name: "Sort an Array", difficulty: "Medium" },
          { id: "merge-two-sorted-lists", name: "Merge Two Sorted Lists", difficulty: "Easy" }
        ]
      }
    ]
  },
  {
    id: "recursion",
    title: "Recursion",
    guides: [
      {
        slug: "recursion",
        title: "Recursion",
        description: "Learn the fundamentals of recursion, base cases, and call stack management.",
        category: "recursion",
        heroImage: "recursion-hero",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["climbing-stairs", "reverse-linked-list"],
        content: recursionContent,
        questions: [
          { id: "climbing-stairs", name: "Climbing Stairs", difficulty: "Easy" },
          { id: "fibonacci-number", name: "Fibonacci Number", difficulty: "Easy" }
        ]
      }
    ]
  },
  {
    id: "backtracking",
    title: "Backtracking",
    guides: [
      {
        slug: "backtracking",
        title: "Backtracking",
        description: "Master exhaustive search, state reversal, and pruning techniques.",
        category: "backtracking",
        heroImage: "backtraking-hero",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["subsets", "permutations", "combination-sum"],
        content: backtrackingContent,
        questions: [
          { id: "combination-sum", name: "Combination Sum", difficulty: "Medium" },
          { id: "word-search", name: "Word Search", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    guides: [
      {
        slug: "merge-intervals",
        title: "Merge Intervals",
        description: "Master overlapping times, schedules, and continuous ranges.",
        category: "merge-intervals",
        heroImage: "merge-intervals-hero",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["merge-intervals", "interval-scheduling"],
        content: mergeIntervalsContent,
        questions: [
          { id: "merge-intervals", name: "Merge Intervals", difficulty: "Medium" },
          { id: "insert-interval", name: "Insert Interval", difficulty: "Medium" },
          { id: "non-overlapping-intervals", name: "Non-overlapping Intervals", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    guides: [
      {
        slug: "dynamic-programming",
        title: "Dynamic Programming",
        description: "Learn the art of remembering past solutions to avoid doing extra work.",
        category: "dynamic-programming",
        heroImage: "dp-hero",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        visualizations: ["coin-change", "knapsack-01", "climbing-stairs"],
        content: dynamicProgrammingContent,
        questions: [
          { id: "climbing-stairs", name: "Climbing Stairs", difficulty: "Easy" },
          { id: "coin-change", name: "Coin Change", difficulty: "Medium" },
          { id: "house-robber", name: "House Robber", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    id: "database",
    title: "Database",
    guides: [
      {
        slug: "what-is-database",
        title: "What is Database?",
        description: "An easy-to-understand introduction to databases, files vs databases, and real-world examples.",
        category: "database",
        heroImage: "database-overview",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        content: whatIsDatabaseContent,
        questions: []
      },
      {
        slug: "types-of-databases",
        title: "Types of Databases",
        description: "Learn the differences between Relational (SQL) and Non-Relational (NoSQL) databases.",
        category: "database",
        heroImage: "database-types",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        content: typesOfDatabasesContent,
        questions: []
      },
      {
        slug: "database-terminology",
        title: "Database Terminology",
        description: "Master essential database terms like Schema, Table, Row, Column, and Primary Key.",
        category: "database",
        heroImage: "database-terminology",
        author: {
          name: "Rahul Mahale",
          role: "Senior SLB Engineer",
          linkedin: "https://linkedin.com/in/rkmahale"
        },
        content: databaseTerminologyContent,
        questions: []
      }
    ]
  }
];
