export interface Algorithm {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  problems?: LeetCodeProblem[]

}
export interface LeetCodeProblem {
  number: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link: string;
}


export const categories = [
  'Arrays & Strings',
  'Linked List',
  'Trees & BSTs',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Bit Manipulation',
  'Heap / Priority Queue',
  'Math & Number Theory',
  'Advanced'
] as const;

export const algorithms: Algorithm[] = [
  // Arrays & Strings
  {
    id: 'two-pointers', name: 'Two Pointers', category: 'Arrays & Strings', difficulty: 'beginner', description: 'Use two pointers to traverse arrays efficiently', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',

    problems: [
      { number: 167, title: 'Two Sum II - Input Array Is Sorted', slug: 'two-sum-ii-input-array-is-sorted', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { number: 125, title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome/' },
      { number: 344, title: 'Reverse String', slug: 'reverse-string', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-string/' },
      { number: 283, title: 'Move Zeroes', slug: 'move-zeroes', difficulty: 'Easy', link: 'https://leetcode.com/problems/move-zeroes/' },
      { number: 15, title: '3Sum', slug: '3sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/3sum/' },
      { number: 11, title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/' },
      { number: 16, title: '3Sum Closest', slug: '3sum-closest', difficulty: 'Medium', link: 'https://leetcode.com/problems/3sum-closest/' },
      { number: 75, title: 'Sort Colors', slug: 'sort-colors', difficulty: 'Medium', link: 'https://leetcode.com/problems/sort-colors/' },
      { number: 948, title: 'Bag of Tokens', slug: 'bag-of-tokens', difficulty: 'Medium', link: 'https://leetcode.com/problems/bag-of-tokens/' },
      { number: 5, title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { number: 42, title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard', link: 'https://leetcode.com/problems/trapping-rain-water/' },
      { number: 76, title: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard', link: 'https://leetcode.com/problems/minimum-window-substring/' },
      { number: 18, title: '4Sum', slug: '4sum', difficulty: 'Hard', link: 'https://leetcode.com/problems/4sum/' },
      { number: 828, title: 'Count Unique Characters of All Substrings', slug: 'count-unique-characters-of-all-substrings', difficulty: 'Hard', link: 'https://leetcode.com/problems/count-unique-characters-of-all-substrings/' },]

  },
  { id: 'sliding-window', name: 'Sliding Window', category: 'Arrays & Strings', difficulty: 'intermediate', description: 'Maintain a window of elements for efficient computation', timeComplexity: 'O(n)', spaceComplexity: 'O(k)' },
  { id: 'prefix-sum', name: 'Prefix Sum', category: 'Arrays & Strings', difficulty: 'beginner', description: 'Pre-compute cumulative sums for range queries', timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'binary-search', name: 'Binary Search', category: 'Arrays & Strings', difficulty: 'beginner', description: 'Search in sorted arrays in logarithmic time', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
  { id: 'kadanes-algorithm', name: "Kadane's Algorithm", category: 'Arrays & Strings', difficulty: 'intermediate', description: 'Find maximum subarray sum efficiently', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'dutch-national-flag', name: 'Dutch National Flag', category: 'Arrays & Strings', difficulty: 'intermediate', description: 'Sort array of three distinct elements', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'merge-intervals', name: 'Merge Intervals', category: 'Arrays & Strings', difficulty: 'intermediate', description: 'Merge overlapping intervals', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  { id: 'monotonic-stack', name: 'Monotonic Stack', category: 'Arrays & Strings', difficulty: 'advanced', description: 'Stack with monotonic properties for efficient queries', timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'rotate-array', name: 'Rotate Array In-Place', category: 'Arrays & Strings', difficulty: 'beginner', description: 'Rotate array elements without extra space', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'cyclic-sort', name: 'Cyclic Sort', category: 'Arrays & Strings', difficulty: 'intermediate', description: 'Sort by placing elements at their correct index', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },

  // Linked List
  { id: 'fast-slow-pointers', name: 'Fast & Slow Pointers', category: 'Linked List', difficulty: 'intermediate', description: 'Detect cycles and find middle using two pointers', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'reverse-linked-list', name: 'Reverse Linked List', category: 'Linked List', difficulty: 'beginner', description: 'Reverse a singly linked list', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'merge-sorted-lists', name: 'Merge Two Sorted Lists', category: 'Linked List', difficulty: 'beginner', description: 'Merge two sorted linked lists', timeComplexity: 'O(n+m)', spaceComplexity: 'O(1)' },
  { id: 'detect-cycle', name: 'Detect Cycle', category: 'Linked List', difficulty: 'intermediate', description: "Floyd's algorithm to detect cycles", timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'middle-node', name: 'Middle Node', category: 'Linked List', difficulty: 'beginner', description: 'Find middle node using fast and slow pointers', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },

  // Trees & BSTs
  { id: 'dfs-preorder', name: 'DFS Preorder', category: 'Trees & BSTs', difficulty: 'beginner', description: 'Visit root, left, then right subtree', timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
  { id: 'dfs-inorder', name: 'DFS Inorder', category: 'Trees & BSTs', difficulty: 'beginner', description: 'Visit left, root, then right subtree', timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
  { id: 'dfs-postorder', name: 'DFS Postorder', category: 'Trees & BSTs', difficulty: 'beginner', description: 'Visit left, right, then root', timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
  { id: 'bfs-level-order', name: 'BFS Level Order', category: 'Trees & BSTs', difficulty: 'beginner', description: 'Traverse tree level by level', timeComplexity: 'O(n)', spaceComplexity: 'O(w)' },
  { id: 'bst-insert', name: 'BST Insert', category: 'Trees & BSTs', difficulty: 'intermediate', description: 'Insert node in binary search tree', timeComplexity: 'O(log n)', spaceComplexity: 'O(h)' },
  { id: 'lca', name: 'Lowest Common Ancestor', category: 'Trees & BSTs', difficulty: 'intermediate', description: 'Find LCA of two nodes in tree', timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
  { id: 'recover-bst', name: 'Recover BST', category: 'Trees & BSTs', difficulty: 'advanced', description: 'Fix BST with two swapped nodes', timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
  { id: 'serialize-tree', name: 'Serialize Tree', category: 'Trees & BSTs', difficulty: 'advanced', description: 'Serialize and deserialize binary tree', timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'trie', name: 'Trie (Prefix Tree)', category: 'Trees & BSTs', difficulty: 'intermediate', description: 'Efficient string storage and retrieval', timeComplexity: 'O(m)', spaceComplexity: 'O(n*m)' },

  // Graphs
  { id: 'graph-dfs', name: 'Graph DFS', category: 'Graphs', difficulty: 'intermediate', description: 'Depth-first traversal of graphs', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' },
  { id: 'graph-bfs', name: 'Graph BFS', category: 'Graphs', difficulty: 'intermediate', description: 'Breadth-first traversal of graphs', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' },
  { id: 'topological-sort', name: 'Topological Sort', category: 'Graphs', difficulty: 'intermediate', description: "Kahn's algorithm for DAG ordering", timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' },
  { id: 'union-find', name: 'Union-Find', category: 'Graphs', difficulty: 'intermediate', description: 'Disjoint set data structure', timeComplexity: 'O(α(n))', spaceComplexity: 'O(n)' },
  { id: 'kruskals', name: "Kruskal's Algorithm", category: 'Graphs', difficulty: 'advanced', description: 'Find minimum spanning tree', timeComplexity: 'O(E log E)', spaceComplexity: 'O(V)' },
  { id: 'prims', name: "Prim's Algorithm", category: 'Graphs', difficulty: 'advanced', description: 'Find MST using greedy approach', timeComplexity: 'O(E log V)', spaceComplexity: 'O(V)' },
  { id: 'dijkstras', name: "Dijkstra's Algorithm", category: 'Graphs', difficulty: 'advanced', description: 'Single-source shortest path', timeComplexity: 'O((V+E) log V)', spaceComplexity: 'O(V)' },
  { id: 'bellman-ford', name: 'Bellman-Ford', category: 'Graphs', difficulty: 'advanced', description: 'Shortest path with negative weights', timeComplexity: 'O(VE)', spaceComplexity: 'O(V)' },
  { id: 'floyd-warshall', name: 'Floyd-Warshall', category: 'Graphs', difficulty: 'advanced', description: 'All-pairs shortest paths', timeComplexity: 'O(V³)', spaceComplexity: 'O(V²)' },
  { id: 'a-star', name: 'A* Search', category: 'Graphs', difficulty: 'advanced', description: 'Heuristic pathfinding algorithm', timeComplexity: 'O(b^d)', spaceComplexity: 'O(b^d)' },

  // Dynamic Programming
  { id: 'knapsack-01', name: '0/1 Knapsack', category: 'Dynamic Programming', difficulty: 'intermediate', description: 'Maximize value with weight constraint', timeComplexity: 'O(nW)', spaceComplexity: 'O(nW)' },
  { id: 'coin-change', name: 'Coin Change', category: 'Dynamic Programming', difficulty: 'intermediate', description: 'Minimum coins for target amount', timeComplexity: 'O(nW)', spaceComplexity: 'O(W)' },
  { id: 'lcs', name: 'Longest Common Subsequence', category: 'Dynamic Programming', difficulty: 'intermediate', description: 'Find longest common subsequence', timeComplexity: 'O(mn)', spaceComplexity: 'O(mn)' },
  { id: 'lis', name: 'Longest Increasing Subsequence', category: 'Dynamic Programming', difficulty: 'intermediate', description: 'Find LIS in array', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  { id: 'edit-distance', name: 'Edit Distance', category: 'Dynamic Programming', difficulty: 'advanced', description: 'Minimum edits to transform strings', timeComplexity: 'O(mn)', spaceComplexity: 'O(mn)' },
  { id: 'matrix-path-dp', name: 'Matrix Path DP', category: 'Dynamic Programming', difficulty: 'intermediate', description: 'Find unique or minimum paths in matrix', timeComplexity: 'O(mn)', spaceComplexity: 'O(mn)' },
  { id: 'partition-equal-subset', name: 'Partition Equal Subset', category: 'Dynamic Programming', difficulty: 'intermediate', description: 'Check if array can be partitioned equally', timeComplexity: 'O(n*sum)', spaceComplexity: 'O(sum)' },
  { id: 'house-robber', name: 'House Robber', category: 'Dynamic Programming', difficulty: 'intermediate', description: 'Maximum sum without adjacent elements', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'climbing-stairs', name: 'Climbing Stairs', category: 'Dynamic Programming', difficulty: 'beginner', description: 'Count ways to climb n stairs', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'word-break', name: 'Word Break', category: 'Dynamic Programming', difficulty: 'intermediate', description: 'Segment string into dictionary words', timeComplexity: 'O(n²)', spaceComplexity: 'O(n)' },

  // Greedy
  { id: 'activity-selection', name: 'Activity Selection', category: 'Greedy', difficulty: 'intermediate', description: 'Select maximum non-overlapping activities', timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)' },
  { id: 'interval-scheduling', name: 'Interval Scheduling', category: 'Greedy', difficulty: 'intermediate', description: 'Schedule intervals optimally', timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)' },
  { id: 'huffman-encoding', name: 'Huffman Encoding', category: 'Greedy', difficulty: 'advanced', description: 'Optimal prefix-free encoding', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  { id: 'gas-station', name: 'Gas Station', category: 'Greedy', difficulty: 'intermediate', description: 'Find starting station for circular tour', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },

  // Backtracking
  { id: 'subsets', name: 'Subsets', category: 'Backtracking', difficulty: 'intermediate', description: 'Generate all subsets of a set', timeComplexity: 'O(2^n)', spaceComplexity: 'O(n)' },
  { id: 'permutations', name: 'Permutations', category: 'Backtracking', difficulty: 'intermediate', description: 'Generate all permutations', timeComplexity: 'O(n!)', spaceComplexity: 'O(n)' },
  { id: 'combinations', name: 'Combinations', category: 'Backtracking', difficulty: 'intermediate', description: 'Generate all k-combinations', timeComplexity: 'O(C(n,k))', spaceComplexity: 'O(k)' },
  { id: 'combination-sum', name: 'Combination Sum', category: 'Backtracking', difficulty: 'intermediate', description: 'Find combinations summing to target', timeComplexity: 'O(2^n)', spaceComplexity: 'O(target)' },
  { id: 'word-search-grid', name: 'Word Search', category: 'Backtracking', difficulty: 'intermediate', description: 'Find word in 2D grid', timeComplexity: 'O(m*n*4^L)', spaceComplexity: 'O(L)' },
  { id: 'n-queens', name: 'N-Queens', category: 'Backtracking', difficulty: 'advanced', description: 'Place N queens on N×N board', timeComplexity: 'O(N!)', spaceComplexity: 'O(N)' },
  { id: 'sudoku-solver', name: 'Sudoku Solver', category: 'Backtracking', difficulty: 'advanced', description: 'Solve Sudoku puzzle', timeComplexity: 'O(9^(n*n))', spaceComplexity: 'O(n*n)' },

  // Bit Manipulation
  { id: 'xor-trick', name: 'XOR Trick', category: 'Bit Manipulation', difficulty: 'intermediate', description: 'Find single number using XOR', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  { id: 'count-bits', name: 'Count Bits', category: 'Bit Manipulation', difficulty: 'beginner', description: "Brian Kernighan's algorithm", timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
  { id: 'subset-generation-bits', name: 'Subset Generation with Bits', category: 'Bit Manipulation', difficulty: 'intermediate', description: 'Generate subsets using bitmasks', timeComplexity: 'O(2^n * n)', spaceComplexity: 'O(1)' },

  // Heap / Priority Queue
  { id: 'kth-largest', name: 'Kth Largest Element', category: 'Heap / Priority Queue', difficulty: 'intermediate', description: 'Find kth largest using min heap', timeComplexity: 'O(n log k)', spaceComplexity: 'O(k)' },
  { id: 'merge-k-lists', name: 'Merge K Sorted Lists', category: 'Heap / Priority Queue', difficulty: 'advanced', description: 'Merge using min heap', timeComplexity: 'O(N log k)', spaceComplexity: 'O(k)' },
  { id: 'sliding-window-maximum', name: 'Sliding Window Maximum', category: 'Heap / Priority Queue', difficulty: 'advanced', description: 'Find max in each window', timeComplexity: 'O(n)', spaceComplexity: 'O(k)' },

  // Math & Number Theory
  { id: 'gcd-euclidean', name: 'GCD (Euclidean)', category: 'Math & Number Theory', difficulty: 'beginner', description: "Euclid's algorithm for GCD", timeComplexity: 'O(log(min(a,b)))', spaceComplexity: 'O(1)' },
  { id: 'sieve-eratosthenes', name: 'Sieve of Eratosthenes', category: 'Math & Number Theory', difficulty: 'intermediate', description: 'Generate all primes up to n', timeComplexity: 'O(n log log n)', spaceComplexity: 'O(n)' },
  { id: 'modular-exponentiation', name: 'Modular Exponentiation', category: 'Math & Number Theory', difficulty: 'intermediate', description: 'Fast power with modulo', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
  { id: 'karatsuba', name: 'Karatsuba Multiplication', category: 'Math & Number Theory', difficulty: 'advanced', description: 'Fast multiplication algorithm', timeComplexity: 'O(n^1.58)', spaceComplexity: 'O(n)' },

  // Advanced
  { id: 'segment-tree', name: 'Segment Tree', category: 'Advanced', difficulty: 'advanced', description: 'Range query data structure', timeComplexity: 'O(log n)', spaceComplexity: 'O(n)' },
  { id: 'fenwick-tree', name: 'Fenwick Tree (BIT)', category: 'Advanced', difficulty: 'advanced', description: 'Binary indexed tree for prefix sums', timeComplexity: 'O(log n)', spaceComplexity: 'O(n)' },
  { id: 'sparse-table', name: 'Sparse Table', category: 'Advanced', difficulty: 'advanced', description: 'Range minimum query in O(1)', timeComplexity: 'O(1)', spaceComplexity: 'O(n log n)' },
  { id: 'kmp', name: 'KMP String Matching', category: 'Advanced', difficulty: 'advanced', description: 'Linear time pattern matching', timeComplexity: 'O(n+m)', spaceComplexity: 'O(m)' },
  { id: 'rabin-karp', name: 'Rabin-Karp', category: 'Advanced', difficulty: 'advanced', description: 'Rolling hash pattern matching', timeComplexity: 'O(n+m)', spaceComplexity: 'O(1)' },
  { id: 'manachers', name: "Manacher's Algorithm", category: 'Advanced', difficulty: 'advanced', description: 'Longest palindromic substring', timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  { id: 'union-by-rank', name: 'Union by Rank + Path Compression', category: 'Advanced', difficulty: 'advanced', description: 'Optimized union-find', timeComplexity: 'O(α(n))', spaceComplexity: 'O(n)' },
  { id: 'tarjans', name: "Tarjan's Algorithm", category: 'Advanced', difficulty: 'advanced', description: 'Find strongly connected components', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' },
  { id: 'binary-lifting', name: 'Binary Lifting', category: 'Advanced', difficulty: 'advanced', description: 'LCA using binary lifting', timeComplexity: 'O(log n)', spaceComplexity: 'O(n log n)' },
];
