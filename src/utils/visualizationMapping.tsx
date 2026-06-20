// Centralized visualization mapping for all algorithms
// This file imports all visualization components and provides a lookup function
// Used as fallback when database doesn't provide visualization URL

import React from 'react';
import dynamic from 'next/dynamic';

// Lazy load all visualization components
export const visualizationMap: Record<string, any> = {
  // Core Patterns
  'two-pointers': dynamic(() => import('@/components/visualizations/algorithms/TwoPointersVisualization').then(m => m.TwoPointersVisualization), { ssr: false }),
  'sliding-window': dynamic(() => import('@/components/visualizations/algorithms/SlidingWindowVisualization').then(m => m.SlidingWindowVisualization), { ssr: false }),
  'prefix-sum': dynamic(() => import('@/components/visualizations/algorithms/PrefixSumVisualization').then(m => m.PrefixSumVisualization), { ssr: false }),
  'binary-search': dynamic(() => import('@/components/visualizations/algorithms/BinarySearchVisualization').then(m => m.BinarySearchVisualization), { ssr: false }),
  'kadanes-algorithm': dynamic(() => import('@/components/visualizations/algorithms/MaximumSubarrayVisualization').then(m => m.MaximumSubarrayVisualization), { ssr: false }),
  'maximum-subarray': dynamic(() => import('@/components/visualizations/algorithms/MaximumSubarrayVisualization').then(m => m.MaximumSubarrayVisualization), { ssr: false }),
  'dutch-national-flag': dynamic(() => import('@/components/visualizations/algorithms/DutchNationalFlagVisualization').then(m => m.DutchNationalFlagVisualization), { ssr: false }),
  'merge-intervals': dynamic(() => import('@/components/visualizations/algorithms/MergeIntervalsVisualization').then(m => m.MergeIntervalsVisualization), { ssr: false }),
  'interval-scheduling': dynamic(() => import('@/components/visualizations/algorithms/InsertIntervalVisualization').then(m => m.InsertIntervalVisualization), { ssr: false }),
  'monotonic-stack': dynamic(() => import('@/components/visualizations/algorithms/MonotonicStackVisualization').then(m => m.MonotonicStackVisualization), { ssr: false }),
  'valid-parentheses': dynamic(() => import('@/components/visualizations/algorithms/ValidParenthesesVisualization').then(m => m.ValidParenthesesVisualization), { ssr: false }),
  'two-sum': dynamic(() => import('@/components/visualizations/algorithms/TwoSumVisualization').then(m => m.TwoSumVisualization), { ssr: false }),
  'quick-select': dynamic(() => import('@/components/visualizations/algorithms/QuickSelectVisualization').then(m => m.QuickSelectVisualization), { ssr: false }),
  'median-of-two-sorted-arrays': dynamic(() => import('@/components/visualizations/algorithms/MedianOfTwoSortedArraysVisualization').then(m => m.MedianOfTwoSortedArraysVisualization), { ssr: false }),
  'container-with-most-water': dynamic(() => import('@/components/visualizations/algorithms/ContainerWithMostWaterVisualization').then(m => m.ContainerWithMostWaterVisualization), { ssr: false }),
  'trapping-rain-water': dynamic(() => import('@/components/visualizations/algorithms/TrappingRainWaterVisualization').then(m => m.TrappingRainWaterVisualization), { ssr: false }),
  'rotate-array': dynamic(() => import('@/components/visualizations/algorithms/RotateArrayVisualization').then(m => m.RotateArrayVisualization), { ssr: false }),
  'cyclic-sort': dynamic(() => import('@/components/visualizations/algorithms/CyclicSortVisualization').then(m => m.CyclicSortVisualization), { ssr: false }),
  'missing-number': dynamic(() => import('@/components/visualizations/algorithms/MissingNumberVisualization').then(m => m.MissingNumberVisualization), { ssr: false }),
  'valid-anagram': dynamic(() => import('@/components/visualizations/algorithms/ValidAnagramVisualization').then(m => m.ValidAnagramVisualization), { ssr: false }),

  // Tree Algorithms
  'dfs-preorder': dynamic(() => import('@/components/visualizations/algorithms/DFSPreorderVisualization').then(m => m.DFSPreorderVisualization), { ssr: false }),
  'dfs-inorder': dynamic(() => import('@/components/visualizations/algorithms/DFSInorderVisualization').then(m => m.DFSInorderVisualization), { ssr: false }),
  'dfs-postorder': dynamic(() => import('@/components/visualizations/algorithms/DFSPostorderVisualization').then(m => m.DFSPostorderVisualization), { ssr: false }),
  'bfs-level-order': dynamic(() => import('@/components/visualizations/algorithms/BFSLevelOrderVisualization').then(m => m.BFSLevelOrderVisualization), { ssr: false }),
  'binary-tree-right-side-view': dynamic(() => import('@/components/visualizations/algorithms/BinaryTreeRightSideViewVisualization').then(m => m.BinaryTreeRightSideViewVisualization), { ssr: false }),
  'bst-insert': dynamic(() => import('@/components/visualizations/algorithms/BSTInsertVisualization').then(m => m.BSTInsertVisualization), { ssr: false }),
  'lca': dynamic(() => import('@/components/visualizations/algorithms/LowestCommonAncestorBSTVisualization').then(m => m.LowestCommonAncestorBSTVisualization), { ssr: false }),
  'lowest-common-ancestor-of-bst': dynamic(() => import('@/components/visualizations/algorithms/LowestCommonAncestorBSTVisualization').then(m => m.LowestCommonAncestorBSTVisualization), { ssr: false }),
  'serialize-tree': dynamic(() => import('@/components/visualizations/algorithms/SerializeTreeVisualization').then(m => m.SerializeTreeVisualization), { ssr: false }),
  'recover-bst': dynamic(() => import('@/components/visualizations/algorithms/RecoverBSTVisualization').then(m => m.RecoverBSTVisualization), { ssr: false }),
  'invert-binary-tree': dynamic(() => import('@/components/visualizations/algorithms/InvertBinaryTreeVisualization').then(m => m.InvertBinaryTreeVisualization), { ssr: false }),
  'trie': dynamic(() => import('@/components/visualizations/algorithms/TrieVisualization').then(m => m.TrieVisualization), { ssr: false }),

  // Linked List Algorithms
  'fast-slow-pointers': dynamic(() => import('@/components/visualizations/algorithms/FastSlowPointersVisualization').then(m => m.FastSlowPointersVisualization), { ssr: false }),
  'reverse-linked-list': dynamic(() => import('@/components/visualizations/algorithms/ReverseLinkedListVisualization').then(m => m.ReverseLinkedListVisualization), { ssr: false }),
  'detect-cycle': dynamic(() => import('@/components/visualizations/algorithms/DetectCycleVisualization').then(m => m.DetectCycleVisualization), { ssr: false }),
  'detect-cycle-in-a-linked-list': dynamic(() => import('@/components/visualizations/algorithms/FastSlowPointersVisualization').then(m => m.FastSlowPointersVisualization), { ssr: false }),
  'middle-node': dynamic(() => import('@/components/visualizations/algorithms/MiddleNodeVisualization').then(m => m.MiddleNodeVisualization), { ssr: false }),
  'merge-sorted-lists': dynamic(() => import('@/components/visualizations/algorithms/MergeSortLinkedListVisualization').then(m => m.MergeSortLinkedListVisualization), { ssr: false }),
  'merge-two-sorted-lists': dynamic(() => import('@/components/visualizations/algorithms/MergeSortLinkedListVisualization').then(m => m.MergeSortLinkedListVisualization), { ssr: false }),
  'merge-k-lists': dynamic(() => import('@/components/visualizations/algorithms/MergeKSortedListsVisualization').then(m => m.MergeKSortedListsVisualization), { ssr: false }),
  'merge-k-sorted-lists': dynamic(() => import('@/components/visualizations/algorithms/MergeKSortedListsVisualization').then(m => m.MergeKSortedListsVisualization), { ssr: false }),
  'add-two-numbers': dynamic(() => import('@/components/visualizations/algorithms/AddTwoNumbersVisualization').then(m => m.AddTwoNumbersVisualization), { ssr: false }),

  // Graph Algorithms
  'graph-dfs': dynamic(() => import('@/components/visualizations/GraphVisualization').then(m => m.GraphVisualization), { ssr: false }),
  'graph-bfs': dynamic(() => import('@/components/visualizations/GraphVisualization').then(m => m.GraphVisualization), { ssr: false }),
  'number-of-islands': dynamic(() => import('@/components/visualizations/algorithms/NumberOfIslandsVisualization').then(m => m.NumberOfIslandsVisualization), { ssr: false }),
  'number-of-connected-components-in-an-undirected-graph': dynamic(() => import('@/components/visualizations/algorithms/NumberOfConnectedComponentsVisualization').then(m => m.NumberOfConnectedComponentsVisualization), { ssr: false }),
  'pacific-atlantic-water-flow': dynamic(() => import('@/components/visualizations/algorithms/PacificAtlanticVisualization').then(m => m.PacificAtlanticVisualization), { ssr: false }),
  'alien-dictionary': dynamic(() => import('@/components/visualizations/algorithms/AlienDictionaryVisualization').then(m => m.AlienDictionaryVisualization), { ssr: false }),
  'topological-sort': dynamic(() => import('@/components/visualizations/algorithms/TopologicalSortVisualization').then(m => m.TopologicalSortVisualization), { ssr: false }),
  'union-find': dynamic(() => import('@/components/visualizations/algorithms/UnionFindVisualization').then(m => m.UnionFindVisualization), { ssr: false }),
  'union-find-by-rank': dynamic(() => import('@/components/visualizations/algorithms/UnionFindByRankVisualization').then(m => m.UnionFindByRankVisualization), { ssr: false }),
  'union-by-rank': dynamic(() => import('@/components/visualizations/algorithms/UnionFindByRankVisualization').then(m => m.UnionFindByRankVisualization), { ssr: false }),
  'tarjans': dynamic(() => import('@/components/visualizations/algorithms/TarjansVisualization').then(m => m.TarjansVisualization), { ssr: false }),
  'kruskals': dynamic(() => import('@/components/visualizations/algorithms/KruskalsVisualization').then(m => m.KruskalsVisualization), { ssr: false }),
  'prims': dynamic(() => import('@/components/visualizations/algorithms/PrimsVisualization').then(m => m.PrimsVisualization), { ssr: false }),
  'dijkstras': dynamic(() => import('@/components/visualizations/algorithms/DijkstrasVisualization').then(m => m.DijkstrasVisualization), { ssr: false }),
  'bellman-ford': dynamic(() => import('@/components/visualizations/algorithms/BellmanFordVisualization').then(m => m.BellmanFordVisualization), { ssr: false }),
  'floyd-warshall': dynamic(() => import('@/components/visualizations/algorithms/FloydWarshallVisualization').then(m => m.FloydWarshallVisualization), { ssr: false }),
  'a-star': dynamic(() => import('@/components/visualizations/algorithms/AStarVisualization').then(m => m.AStarVisualization), { ssr: false }),
  'word-ladder': dynamic(() => import('@/components/visualizations/algorithms/WordLadderVisualization').then(m => m.WordLadderVisualization), { ssr: false }),

  // Dynamic Programming
  'knapsack-01': dynamic(() => import('@/components/visualizations/algorithms/KnapsackVisualization').then(m => m.KnapsackVisualization), { ssr: false }),
  'coin-change': dynamic(() => import('@/components/visualizations/algorithms/CoinChangeVisualization').then(m => m.CoinChangeVisualization), { ssr: false }),
  'coin-change-ii': dynamic(() => import('@/components/visualizations/algorithms/CoinChangeIIVisualization').then(m => m.CoinChangeIIVisualization), { ssr: false }),
  'coin-change-2': dynamic(() => import('@/components/visualizations/algorithms/CoinChangeIIVisualization').then(m => m.CoinChangeIIVisualization), { ssr: false }),
  'lcs': dynamic(() => import('@/components/visualizations/algorithms/LCSVisualization').then(m => m.LCSVisualization), { ssr: false }),
  'lis': dynamic(() => import('@/components/visualizations/algorithms/LISVisualization').then(m => m.LISVisualization), { ssr: false }),
  'edit-distance': dynamic(() => import('@/components/visualizations/algorithms/EditDistanceVisualization').then(m => m.EditDistanceVisualization), { ssr: false }),
  'regular-expression-matching': dynamic(() => import('@/components/visualizations/algorithms/RegularExpressionMatchingVisualization').then(m => m.RegularExpressionMatchingVisualization), { ssr: false }),
  'matrix-path-dp': dynamic(() => import('@/components/visualizations/algorithms/MatrixPathVisualization').then(m => m.MatrixPathVisualization), { ssr: false }),
  'house-robber': dynamic(() => import('@/components/visualizations/algorithms/HouseRobberVisualization').then(m => m.HouseRobberVisualization), { ssr: false }),
  'best-time-to-buy-and-sell-stock-with-cooldown': dynamic(() => import('@/components/visualizations/algorithms/BestTimeToBuyAndSellStockWithCooldownVisualization').then(m => m.BestTimeToBuyAndSellStockWithCooldownVisualization), { ssr: false }),
  'climbing-stairs': dynamic(() => import('@/components/visualizations/algorithms/ClimbingStairsVisualization').then(m => m.ClimbingStairsVisualization), { ssr: false }),
  'min-cost-climbing-stairs': dynamic(() => import('@/components/visualizations/algorithms/MinCostClimbingStairsVisualization').then(m => m.MinCostClimbingStairsVisualization), { ssr: false }),
  'partition-equal-subset': dynamic(() => import('@/components/visualizations/algorithms/PartitionEqualSubsetVisualization').then(m => m.PartitionEqualSubsetVisualization), { ssr: false }),
  'partition-equal-subset-sum': dynamic(() => import('@/components/visualizations/algorithms/PartitionEqualSubsetVisualization').then(m => m.PartitionEqualSubsetVisualization), { ssr: false }),
  'target-sum': dynamic(() => import('@/components/visualizations/algorithms/TargetSumVisualization').then(m => m.TargetSumVisualization), { ssr: false }),
  'target-sum-ways': dynamic(() => import('@/components/visualizations/algorithms/TargetSumVisualization').then(m => m.TargetSumVisualization), { ssr: false }),
  'word-break': dynamic(() => import('@/components/visualizations/algorithms/WordBreakVisualization').then(m => m.WordBreakVisualization), { ssr: false }),
  'distinct-subsequences': dynamic(() => import('@/components/visualizations/algorithms/DistinctSubsequencesVisualization').then(m => m.DistinctSubsequencesVisualization), { ssr: false }),
  'burst-balloons': dynamic(() => import('@/components/visualizations/algorithms/BurstBalloonsVisualization').then(m => m.BurstBalloonsVisualization), { ssr: false }),

  // Backtracking
  'generate-parentheses': dynamic(() => import('@/components/visualizations/algorithms/GenerateParenthesesVisualization').then(m => m.GenerateParenthesesVisualization), { ssr: false }),
  'subsets': dynamic(() => import('@/components/visualizations/algorithms/SubsetsVisualization').then(m => m.SubsetsVisualization), { ssr: false }),
  'subsets-ii': dynamic(() => import('@/components/visualizations/algorithms/SubsetsIIVisualization').then(m => m.SubsetsIIVisualization), { ssr: false }),
  'permutations': dynamic(() => import('@/components/visualizations/algorithms/PermutationsVisualization').then(m => m.PermutationsVisualization), { ssr: false }),
  'combinations': dynamic(() => import('@/components/visualizations/algorithms/CombinationsVisualization').then(m => m.CombinationsVisualization), { ssr: false }),
  'combination-sum': dynamic(() => import('@/components/visualizations/algorithms/CombinationSumVisualization').then(m => m.CombinationSumVisualization), { ssr: false }),
  'combination-sum-ii': dynamic(() => import('@/components/visualizations/algorithms/CombinationSumIIVisualization').then(m => m.CombinationSumIIVisualization), { ssr: false }),
  'letter-combinations-of-a-phone-number': dynamic(() => import('@/components/visualizations/algorithms/LetterCombinationsVisualization').then(m => m.LetterCombinationsVisualization), { ssr: false }),
  'word-search': dynamic(() => import('@/components/visualizations/algorithms/WordSearchVisualization').then(m => m.WordSearchVisualization), { ssr: false }),
  'word-search-grid': dynamic(() => import('@/components/visualizations/algorithms/WordSearchVisualization').then(m => m.WordSearchVisualization), { ssr: false }),
  'n-queens': dynamic(() => import('@/components/visualizations/algorithms/NQueensVisualization').then(m => m.NQueensVisualization), { ssr: false }),
  'sudoku-solver': dynamic(() => import('@/components/visualizations/algorithms/SudokuSolverVisualization').then(m => m.SudokuSolverVisualization), { ssr: false }),
  'palindrome-partitioning': dynamic(() => import('@/components/visualizations/algorithms/PalindromePartitioningVisualization').then(m => m.PalindromePartitioningVisualization), { ssr: false }),

  // Advanced Data Structures
  'time-based-key-value-store': dynamic(() => import('@/components/visualizations/algorithms/TimeMapVisualization').then(m => m.TimeMapVisualization), { ssr: false }),
  'design-twitter': dynamic(() => import('@/components/visualizations/algorithms/DesignTwitterVisualization').then(m => m.DesignTwitterVisualization), { ssr: false }),
  'segment-tree': dynamic(() => import('@/components/visualizations/algorithms/SegmentTreeVisualization').then(m => m.SegmentTreeVisualization), { ssr: false }),
  'fenwick-tree': dynamic(() => import('@/components/visualizations/algorithms/FenwickTreeVisualization').then(m => m.FenwickTreeVisualization), { ssr: false }),
  'sparse-table': dynamic(() => import('@/components/visualizations/algorithms/SparseTableVisualization').then(m => m.SparseTableVisualization), { ssr: false }),
  'binary-lifting': dynamic(() => import('@/components/visualizations/algorithms/BinaryLiftingVisualization').then(m => m.BinaryLiftingVisualization), { ssr: false }),
  // 'lca': dynamic(() => import('@/components/visualizations/algorithms/BinaryLiftingVisualization').then(m => m.BinaryLiftingVisualization), { ssr: false }),
  'lowest-common-ancestor': dynamic(() => import('@/components/visualizations/algorithms/BinaryLiftingVisualization').then(m => m.BinaryLiftingVisualization), { ssr: false }),

  // String Algorithms
  'kmp': dynamic(() => import('@/components/visualizations/algorithms/KMPVisualization').then(m => m.KMPVisualization), { ssr: false }),
  'kmp-string-matching': dynamic(() => import('@/components/visualizations/algorithms/KMPVisualization').then(m => m.KMPVisualization), { ssr: false }),
  'manachers': dynamic(() => import('@/components/visualizations/algorithms/ManachersVisualization').then(m => m.ManachersVisualization), { ssr: false }),
  'rabin-karp': dynamic(() => import('@/components/visualizations/algorithms/RabinKarpVisualization').then(m => m.RabinKarpVisualization), { ssr: false }),
  'robin-knp': dynamic(() => import('@/components/visualizations/algorithms/RabinKarpVisualization').then(m => m.RabinKarpVisualization), { ssr: false }),
  'huffman-coding': dynamic(() => import('@/components/visualizations/algorithms/HuffmanCodingVisualization').then(m => m.HuffmanCodingVisualization), { ssr: false }),
  'huffman-encoding': dynamic(() => import('@/components/visualizations/algorithms/HuffmanCodingVisualization').then(m => m.HuffmanCodingVisualization), { ssr: false }),
  'huffman-algorithm': dynamic(() => import('@/components/visualizations/algorithms/HuffmanCodingVisualization').then(m => m.HuffmanCodingVisualization), { ssr: false }),
  'huffman': dynamic(() => import('@/components/visualizations/algorithms/HuffmanCodingVisualization').then(m => m.HuffmanCodingVisualization), { ssr: false }),
  'huffman-tree': dynamic(() => import('@/components/visualizations/algorithms/HuffmanCodingVisualization').then(m => m.HuffmanCodingVisualization), { ssr: false }),

  // Greedy Algorithms
  'activity-selection': dynamic(() => import('@/components/visualizations/algorithms/ActivitySelectionVisualization').then(m => m.ActivitySelectionVisualization), { ssr: false }),
  'gas-station': dynamic(() => import('@/components/visualizations/algorithms/GasStationVisualization').then(m => m.GasStationVisualization), { ssr: false }),
  'partition-labels': dynamic(() => import('@/components/visualizations/algorithms/PartitionLabelsVisualization').then(m => m.PartitionLabelsVisualization), { ssr: false }),

  // Bit Manipulation
  'xor-trick': dynamic(() => import('@/components/visualizations/algorithms/XORTrickVisualization').then(m => m.XORTrickVisualization), { ssr: false }),
  'count-bits': dynamic(() => import('@/components/visualizations/algorithms/CountingBitsVisualization').then(m => m.CountingBitsVisualization), { ssr: false }),
  'subset-generation-bits': dynamic(() => import('@/components/visualizations/algorithms/SubsetBitsVisualization').then(m => m.SubsetBitsVisualization), { ssr: false }),

  // Scheduling / Greedy
  'hand-of-straights': dynamic(() => import('@/components/visualizations/algorithms/HandOfStraightsVisualization').then(m => m.HandOfStraightsVisualization), { ssr: false }),
  'task-scheduler': dynamic(() => import('@/components/visualizations/algorithms/TaskSchedulerVisualization').then(m => m.TaskSchedulerVisualization), { ssr: false }),

  // Heap/Priority Queue
  'kth-largest': dynamic(() => import('@/components/visualizations/algorithms/KthLargestVisualization').then(m => m.KthLargestVisualization), { ssr: false }),
  'kth-largest-element': dynamic(() => import('@/components/visualizations/algorithms/KthLargestVisualization').then(m => m.KthLargestVisualization), { ssr: false }),
  'kth-largest-element-in-a-stream': dynamic(() => import('@/components/visualizations/algorithms/KthLargestElementInAStreamVisualization').then(m => m.KthLargestElementInAStreamVisualization), { ssr: false }),
  'top-k-frequent-elements': dynamic(() => import('@/components/visualizations/algorithms/TopKFrequentElementsVisualization').then(m => m.TopKFrequentElementsVisualization), { ssr: false }),
  'sliding-window-maximum': dynamic(() => import('@/components/visualizations/algorithms/SlidingWindowMaxVisualization').then(m => m.SlidingWindowMaxVisualization), { ssr: false }),
  'minimum-window-substring': dynamic(() => import('@/components/visualizations/algorithms/MinimumWindowSubstringVisualization').then(m => m.MinimumWindowSubstringVisualization), { ssr: false }),
  'find-median-from-data-stream': dynamic(() => import('@/components/visualizations/algorithms/FindMedianFromDataStreamVisualization').then(m => m.FindMedianFromDataStreamVisualization), { ssr: false }),
  'last-stone-weight': dynamic(() => import('@/components/visualizations/algorithms/LastStoneWeightVisualization').then(m => m.LastStoneWeightVisualization), { ssr: false }),
  'k-closest-points-to-origin': dynamic(() => import('@/components/visualizations/algorithms/KClosestPointsVisualization').then(m => m.KClosestPointsVisualization), { ssr: false }),
  'k-closest': dynamic(() => import('@/components/visualizations/algorithms/KClosestPointsVisualization').then(m => m.KClosestPointsVisualization), { ssr: false }),

  // Cache Algorithms
  'lru-cache': dynamic(() => import('@/components/visualizations/algorithms/LRUCacheVisualization').then(m => m.LRUCacheVisualization), { ssr: false }),
  'lru': dynamic(() => import('@/components/visualizations/algorithms/LRUCacheVisualization').then(m => m.LRUCacheVisualization), { ssr: false }),

  // Math Algorithms
  'multiply-strings': dynamic(() => import('@/components/visualizations/algorithms/MultiplyStringsVisualization').then(m => m.MultiplyStringsVisualization), { ssr: false }),
  'gcd-euclidean': dynamic(() => import('@/components/visualizations/algorithms/GCDVisualization').then(m => m.GCDVisualization), { ssr: false }),
  'gcd': dynamic(() => import('@/components/visualizations/algorithms/GCDVisualization').then(m => m.GCDVisualization), { ssr: false }),
  'modular-exponentiation': dynamic(() => import('@/components/visualizations/algorithms/ModularExponentiationVisualization').then(m => m.ModularExponentiationVisualization), { ssr: false }),
  'sieve-eratosthenes': dynamic(() => import('@/components/visualizations/algorithms/SieveOfEratosthenesVisualization').then(m => m.SieveOfEratosthenesVisualization), { ssr: false }),
  'sieve-of-eratosthenes': dynamic(() => import('@/components/visualizations/algorithms/SieveOfEratosthenesVisualization').then(m => m.SieveOfEratosthenesVisualization), { ssr: false }),
  'karatsuba': dynamic(() => import('@/components/visualizations/algorithms/KaratsubaVisualization').then(m => m.KaratsubaVisualization), { ssr: false }),
  'karatsuba-multiplication': dynamic(() => import('@/components/visualizations/algorithms/KaratsubaVisualization').then(m => m.KaratsubaVisualization), { ssr: false }),
  'happy-number': dynamic(() => import('@/components/visualizations/algorithms/HappyNumberVisualization').then(m => m.HappyNumberVisualization), { ssr: false }),
  'powx-n': dynamic(() => import('@/components/visualizations/algorithms/PowxNVisualization').then(m => m.PowxNVisualization), { ssr: false }),
  'pow': dynamic(() => import('@/components/visualizations/algorithms/PowxNVisualization').then(m => m.PowxNVisualization), { ssr: false }),
};

export const visualizationMetadataMap: Record<string, { title: string; description: string }> = {
  'two-pointers': {
    title: 'Two Pointers Technique',
    description: 'Visualize how two pointers starting at opposite ends of a sorted array converge inward to find a pair that meets a target condition in O(n) time.'
  },
  'sliding-window': {
    title: 'Sliding Window',
    description: 'See how left and right pointers define a dynamic window that expands and contracts to find optimal subarrays or substrings.'
  },
  'prefix-sum': {
    title: 'Prefix Sum Array',
    description: 'Visualize how cumulative sums are precomputed to allow any subarray range sum query in constant O(1) time.'
  },
  'binary-search': {
    title: 'Binary Search',
    description: 'Watch the search space bisect at each step as low, high, and mid pointers narrow down the target value in a sorted array.'
  },
  'dutch-national-flag': {
    title: 'Dutch National Flag (3-Way Partition)',
    description: 'See how three pointers partition an array of three distinct keys (e.g. Red, White, Blue or 0s, 1s, 2s) in a single O(n) pass.'
  },
  'monotonic-stack': {
    title: 'Monotonic Stack',
    description: 'Visualize how elements are pushed and popped to maintain a strict increasing/decreasing order, solving next greater element problems in O(n).'
  },
  'valid-parentheses': {
    title: 'Valid Parentheses',
    description: 'Watch how a stack is used to ensure opening and closing brackets match correctly in a string.'
  },
  'two-sum': {
    title: 'Two Sum',
    description: 'Visualize using a hash map to find two numbers that add up to a target value in O(n) time.'
  },
  'missing-number': {
    title: 'Missing Number',
    description: 'Visualize finding the missing number in an array from 0 to n using Cyclic Sort in O(n) time.'
  },
  'median-of-two-sorted-arrays': {
    title: 'Median of Two Sorted Arrays',
    description: 'Visualize binary search on two sorted arrays to find the overall median in O(log(min(m,n))) time.'
  },
  'valid-anagram': {
    title: 'Valid Anagram',
    description: 'Visualize checking if two strings are anagrams by comparing their character frequencies using Hash Maps.'
  },
  'container-with-most-water': {
    title: 'Container With Most Water',
    description: 'Visualize two pointers moving inward, greedily replacing the shorter boundary to find the maximum possible containment area.'
  },
  'dfs-inorder': {
    title: 'DFS Inorder Traversal',
    description: 'Walk through the standard Depth-First Search inorder traversal (Left, Root, Right) of a binary tree.'
  },
  'bfs-level-order': {
    title: 'BFS Level Order Traversal',
    description: 'See how a queue organizes nodes to traverse a binary tree level-by-level from top to bottom, left to right.'
  },
  'binary-tree-right-side-view': {
    title: 'Binary Tree Right Side View',
    description: 'Visualize using level-order traversal (BFS) to capture the rightmost node at each level of the binary tree.'
  },
  'lowest-common-ancestor-of-bst': {
    title: 'Lowest Common Ancestor in BST',
    description: 'Visualize how the binary search tree property is leveraged to find the lowest common ancestor node of two target nodes in O(log n) time.'
  },
  'bst-insert': {
    title: 'BST Insertion',
    description: 'See how a new value is placed in a Binary Search Tree by recursively comparing values and branching left or right.'
  },
  'trie': {
    title: 'Trie (Prefix Tree)',
    description: 'Visualize character-by-character insertion, search, and prefix matching operations in a prefix tree.'
  },
  'graph-dfs': {
    title: 'Graph DFS',
    description: 'Visualize Depth-First Search as it explores a graph by going deep along each branch before backtracking.'
  },
  'graph-bfs': {
    title: 'Graph BFS',
    description: 'Visualize Breadth-First Search exploring a graph layer-by-layer starting from a source node.'
  },
  'topological-sort': {
    title: 'Topological Sort',
    description: 'See how topological ordering resolves dependencies in a Directed Acyclic Graph (DAG) using DFS or Kahn\'s algorithm.'
  },
  'dijkstras': {
    title: 'Dijkstra\'s Algorithm',
    description: 'Visualize finding the shortest paths from a single source vertex to all other vertices in a weighted graph.'
  },
  'reverse-linked-list': {
    title: 'Reverse Linked List',
    description: 'Watch how pointers (prev, curr, next) are re-wired node by node to reverse a singly linked list in-place.'
  },
  'detect-cycle-in-a-linked-list': {
    title: 'Linked List Cycle Detection',
    description: 'Visualize Floyd\'s Cycle-Finding Algorithm (Tortoise & Hare) where a fast pointer eventually laps a slow pointer inside a loop.'
  },
  'middle-node': {
    title: 'Middle of a Linked List',
    description: 'See how a slow pointer (1x speed) and a fast pointer (2x speed) find the exact middle of a linked list in one pass.'
  },
  'merge-two-sorted-lists': {
    title: 'Merge Two Sorted Lists',
    description: 'Visualize the merge step of two sorted linked lists by comparing head elements and linking them in sorted order.'
  },
  'add-two-numbers': {
    title: 'Add Two Numbers',
    description: 'Visualize adding two numbers represented by linked lists, carrying over digits just like manual addition.'
  },
  'top-k-frequent-elements': {
    title: 'Top K Frequent Elements',
    description: 'Track how a frequency map and a min-heap extract the K most common elements in O(n log k) time.'
  },
  'kth-largest-element-in-a-stream': {
    title: 'Kth Largest Element in a Stream',
    description: 'Visualize maintaining a sliding window of the top K elements using a Min-Heap data structure as new scores arrive.'
  },
  'sliding-window-maximum': {
    title: 'Sliding Window Maximum',
    description: 'See how a double-ended queue (deque) maintains potential maximums to solve the sliding window max problem in O(n) time.'
  },
  'minimum-window-substring': {
    title: 'Minimum Window Substring',
    description: 'Visualize using a dynamic sliding window with hash maps to find the shortest substring containing all required characters.'
  },
  'knapsack-01': {
    title: '0/1 Knapsack',
    description: 'Visualize the dynamic programming table construction to maximize value within a weight capacity.'
  },
  'task-scheduler': {
    title: 'Task Scheduler',
    description: 'Visualize scheduling tasks with cooling intervals using a max-heap and queue to minimize idle time.'
  },
  'hand-of-straights': {
    title: 'Hand of Straights',
    description: "Visualize how to group magical cards into consecutive stairs, checking if it's possible to form perfect groups of a required size."
  },
  'coin-change-ii': {
    title: 'Coin Change II',
    description: 'Visualize the dynamic programming approach to find the total number of unique combinations that make up a given amount.'
  },
  'coin-change-2': {
    title: 'Coin Change II',
    description: 'Visualize the dynamic programming approach to find the total number of unique combinations that make up a given amount.'
  },
  'best-time-to-buy-and-sell-stock-with-cooldown': {
    title: 'Best Time to Buy and Sell Stock with Cooldown',
    description: 'Visualize a dynamic programming state machine to maximize profit from trading stocks, subject to a 1-day cooldown period after selling.'
  },
  'letter-combinations-of-a-phone-number': {
    title: 'Letter Combinations of a Phone Number',
    description: 'Visualize recursive backtracking on an interactive phone keypad — watch the algorithm explore every letter path for each digit, building combinations character-by-character and backtracking when a branch is exhausted.'
  },
  'lru-cache': {
    title: 'LRU Cache',
    description: 'Visualize Least Recently Used cache eviction using a Hash Map for O(1) lookups and a Doubly Linked List for ordering.'
  },
  'last-stone-weight': {
    title: 'Last Stone Weight',
    description: 'Simulate stone smashing gameplay by maintaining a max heap to extract the heaviest two stones on each turn.'
  },
  'k-closest-points-to-origin': {
    title: 'K Closest Points to Origin',
    description: 'Visualize how points on an X-Y plane are tracked and sorted by their Euclidean distance to the origin using a min-heap structure.'
  },
  'k-closest': {
    title: 'K Closest Points to Origin',
    description: 'Visualize how points on an X-Y plane are tracked and sorted by their Euclidean distance to the origin using a min-heap structure.'
  },
  'design-twitter': {
    title: 'Design Twitter',
    description: 'Visualize the internal data structures of a simplified Twitter implementation, tracking user followings and rendering chronological news feeds with a min-heap.'
  },
  'time-based-key-value-store': {
    title: 'Time-Based Key-Value Store',
    description: 'Visualize how a hash map of dynamically growing arrays combined with binary search allows efficient retrieval of time-versioned values.'
  },
  'target-sum-ways': {
    title: 'Target Sum',
    description: 'Visualize the dynamic programming approach to find the number of ways to assign +/- signs to an array to reach a specific target sum.'
  },
  'min-cost-climbing-stairs': {
    title: 'Min Cost Climbing Stairs',
    description: 'Visualize climbing a staircase where you calculate the minimum cost to reach the top by choosing between 1 or 2 steps using Dynamic Programming.'
  },
  'distinct-subsequences': {
    title: 'Distinct Subsequences',
    description: 'Visualize how a 2D dynamic programming table tracks the number of ways a short string can be formed from a long string by deleting characters.'
  },
  'regular-expression-matching': {
    title: 'Regular Expression Matching',
    description: 'Visualize the top-down dynamic programming approach to match a string against a pattern containing . and *.'
  },
  'burst-balloons': {
    title: 'Burst Balloons',
    description: 'Visualize a "reverse time" dynamic programming approach where you determine the maximum coins by recursively deciding which balloon pops last.'
  },
  'invert-binary-tree': {
    title: 'Invert Binary Tree',
    description: 'Watch how every node in a binary tree has its left and right children swapped recursively to create a mirror image.'
  },
  'number-of-islands': {
    title: 'Number of Islands',
    description: 'Visualize DFS/BFS flood-fill on a 2D grid to count distinct connected land masses surrounded by water.'
  },
  'happy-number': {
    title: 'Happy Number',
    description: "Visualize cycle detection using a Hash Set to determine if repeatedly summing the square of a number's digits eventually reaches 1."
  },
  'powx-n': {
    title: 'Pow(x, n)',
    description: 'Visualize binary exponentiation (exponentiation by squaring) to compute powers in O(log n) time.'
  },
  'pow': {
    title: 'Pow(x, n)',
    description: 'Visualize binary exponentiation (exponentiation by squaring) to compute powers in O(log n) time.'
  },
  'multiply-strings': {
    title: 'Multiply Strings',
    description: 'Visualize multiplying two large numbers represented as strings, simulating the manual paper-and-pencil method digit by digit.'
  },
  'generate-parentheses': {
    title: 'Generate Parentheses',
    description: 'Visualize the recursive backtracking approach to build all combinations of well-formed parentheses strings.'
  },
  'partition-labels': {
    title: 'Partition Labels',
    description: 'Visualize greedily partitioning a string so that each letter appears in at most one part by continuously expanding the farthest required reach.'
  },
  'word-ladder': {
    title: 'Word Ladder',
    description: 'Visualize how Breadth-First Search (BFS) is used to find the shortest transformation sequence from a start word to an end word by changing one letter at a time.'
  }
};

/**
 * Get metadata (title, description) for an algorithm visualization
 * @param algorithmId - The algorithm ID or slug
 * @returns Object with title and description
 */
export function getVisualizationMetadata(algorithmId: string): { title: string; description: string } {
  const metadata = visualizationMetadataMap[algorithmId];
  if (metadata) {
    return metadata;
  }
  
  // Dynamic fallback title
  const title = algorithmId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
    
  return {
    title,
    description: `Interactive simulator for ${title}. Step through the operations, inspect variables, and master the concepts dynamically.`
  };
}


/**
 * Get visualization component for an algorithm
 * @param algorithmId - The algorithm ID or slug
 * @returns React component or null if not found
 */
export function getVisualizationComponent(algorithmId: string): React.LazyExoticComponent<React.ComponentType<any>> | null {
  return visualizationMap[algorithmId] || null;
}

/**
 * Check if visualization exists for an algorithm
 * @param algorithmId - The algorithm ID or slug
 * @returns boolean
 */
export function hasVisualization(algorithmId: string): boolean {
  return algorithmId in visualizationMap;
}

/**
 * Render visualization component with Suspense fallback
 * @param algorithmId - The algorithm ID or slug
 * @returns JSX element or null
 */
export function renderVisualization(algorithmId: string): JSX.Element | null {
  const VisualizationComponent = getVisualizationComponent(algorithmId);

  if (!VisualizationComponent) {
    return null;
  }

  return (
    <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}>
      <VisualizationComponent algorithmId={algorithmId} />
    </React.Suspense>
  );
}
