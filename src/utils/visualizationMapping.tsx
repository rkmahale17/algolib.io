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
  'quick-select': dynamic(() => import('@/components/visualizations/algorithms/QuickSelectVisualization').then(m => m.QuickSelectVisualization), { ssr: false }),
  'container-with-most-water': dynamic(() => import('@/components/visualizations/algorithms/ContainerWithMostWaterVisualization').then(m => m.ContainerWithMostWaterVisualization), { ssr: false }),
  'trapping-rain-water': dynamic(() => import('@/components/visualizations/algorithms/TrappingRainWaterVisualization').then(m => m.TrappingRainWaterVisualization), { ssr: false }),
  'rotate-array': dynamic(() => import('@/components/visualizations/algorithms/RotateArrayVisualization').then(m => m.RotateArrayVisualization), { ssr: false }),
  'cyclic-sort': dynamic(() => import('@/components/visualizations/algorithms/CyclicSortVisualization').then(m => m.CyclicSortVisualization), { ssr: false }),

  // Tree Algorithms
  'dfs-preorder': dynamic(() => import('@/components/visualizations/algorithms/DFSPreorderVisualization').then(m => m.DFSPreorderVisualization), { ssr: false }),
  'dfs-inorder': dynamic(() => import('@/components/visualizations/algorithms/DFSInorderVisualization').then(m => m.DFSInorderVisualization), { ssr: false }),
  'dfs-postorder': dynamic(() => import('@/components/visualizations/algorithms/DFSPostorderVisualization').then(m => m.DFSPostorderVisualization), { ssr: false }),
  'bfs-level-order': dynamic(() => import('@/components/visualizations/algorithms/BFSLevelOrderVisualization').then(m => m.BFSLevelOrderVisualization), { ssr: false }),
  'bst-insert': dynamic(() => import('@/components/visualizations/algorithms/BSTInsertVisualization').then(m => m.BSTInsertVisualization), { ssr: false }),
  'lca': dynamic(() => import('@/components/visualizations/algorithms/LowestCommonAncestorBSTVisualization').then(m => m.LowestCommonAncestorBSTVisualization), { ssr: false }),
  'lowest-common-ancestor-of-bst': dynamic(() => import('@/components/visualizations/algorithms/LowestCommonAncestorBSTVisualization').then(m => m.LowestCommonAncestorBSTVisualization), { ssr: false }),
  'serialize-tree': dynamic(() => import('@/components/visualizations/algorithms/SerializeTreeVisualization').then(m => m.SerializeTreeVisualization), { ssr: false }),
  'recover-bst': dynamic(() => import('@/components/visualizations/algorithms/RecoverBSTVisualization').then(m => m.RecoverBSTVisualization), { ssr: false }),
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

  // Graph Algorithms
  'graph-dfs': dynamic(() => import('@/components/visualizations/algorithms/GraphDFSVisualization').then(m => m.GraphDFSVisualization), { ssr: false }),
  'graph-bfs': dynamic(() => import('@/components/visualizations/algorithms/GraphBFSVisualization').then(m => m.GraphBFSVisualization), { ssr: false }),
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

  // Dynamic Programming
  'knapsack-01': dynamic(() => import('@/components/visualizations/algorithms/KnapsackVisualization').then(m => m.KnapsackVisualization), { ssr: false }),
  'coin-change': dynamic(() => import('@/components/visualizations/algorithms/CoinChangeVisualization').then(m => m.CoinChangeVisualization), { ssr: false }),
  'lcs': dynamic(() => import('@/components/visualizations/algorithms/LCSVisualization').then(m => m.LCSVisualization), { ssr: false }),
  'lis': dynamic(() => import('@/components/visualizations/algorithms/LISVisualization').then(m => m.LISVisualization), { ssr: false }),
  'edit-distance': dynamic(() => import('@/components/visualizations/algorithms/EditDistanceVisualization').then(m => m.EditDistanceVisualization), { ssr: false }),
  'matrix-path-dp': dynamic(() => import('@/components/visualizations/algorithms/MatrixPathVisualization').then(m => m.MatrixPathVisualization), { ssr: false }),
  'house-robber': dynamic(() => import('@/components/visualizations/algorithms/HouseRobberVisualization').then(m => m.HouseRobberVisualization), { ssr: false }),
  'climbing-stairs': dynamic(() => import('@/components/visualizations/algorithms/ClimbingStairsVisualization').then(m => m.ClimbingStairsVisualization), { ssr: false }),
  'partition-equal-subset': dynamic(() => import('@/components/visualizations/algorithms/PartitionEqualSubsetVisualization').then(m => m.PartitionEqualSubsetVisualization), { ssr: false }),
  'word-break': dynamic(() => import('@/components/visualizations/algorithms/WordBreakVisualization').then(m => m.WordBreakVisualization), { ssr: false }),

  // Backtracking
  'subsets': dynamic(() => import('@/components/visualizations/algorithms/SubsetsVisualization').then(m => m.SubsetsVisualization), { ssr: false }),
  'permutations': dynamic(() => import('@/components/visualizations/algorithms/PermutationsVisualization').then(m => m.PermutationsVisualization), { ssr: false }),
  'combinations': dynamic(() => import('@/components/visualizations/algorithms/CombinationsVisualization').then(m => m.CombinationsVisualization), { ssr: false }),
  'combination-sum': dynamic(() => import('@/components/visualizations/algorithms/CombinationSumVisualization').then(m => m.CombinationSumVisualization), { ssr: false }),
  'word-search': dynamic(() => import('@/components/visualizations/algorithms/WordSearchVisualization').then(m => m.WordSearchVisualization), { ssr: false }),
  'word-search-grid': dynamic(() => import('@/components/visualizations/algorithms/WordSearchVisualization').then(m => m.WordSearchVisualization), { ssr: false }),
  'n-queens': dynamic(() => import('@/components/visualizations/algorithms/NQueensVisualization').then(m => m.NQueensVisualization), { ssr: false }),
  'sudoku-solver': dynamic(() => import('@/components/visualizations/algorithms/SudokuSolverVisualization').then(m => m.SudokuSolverVisualization), { ssr: false }),

  // Advanced Data Structures
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

  // Bit Manipulation
  'xor-trick': dynamic(() => import('@/components/visualizations/algorithms/XORTrickVisualization').then(m => m.XORTrickVisualization), { ssr: false }),
  'count-bits': dynamic(() => import('@/components/visualizations/algorithms/CountingBitsVisualization').then(m => m.CountingBitsVisualization), { ssr: false }),
  'subset-generation-bits': dynamic(() => import('@/components/visualizations/algorithms/SubsetBitsVisualization').then(m => m.SubsetBitsVisualization), { ssr: false }),

  // Heap/Priority Queue
  'kth-largest': dynamic(() => import('@/components/visualizations/algorithms/KthLargestVisualization').then(m => m.KthLargestVisualization), { ssr: false }),
  'kth-largest-element': dynamic(() => import('@/components/visualizations/algorithms/KthLargestVisualization').then(m => m.KthLargestVisualization), { ssr: false }),
  'top-k-frequent-elements': dynamic(() => import('@/components/visualizations/algorithms/TopKFrequentElementsVisualization').then(m => m.TopKFrequentElementsVisualization), { ssr: false }),
  'sliding-window-maximum': dynamic(() => import('@/components/visualizations/algorithms/SlidingWindowMaxVisualization').then(m => m.SlidingWindowMaxVisualization), { ssr: false }),
  'find-median-from-data-stream': dynamic(() => import('@/components/visualizations/algorithms/FindMedianFromDataStreamVisualization').then(m => m.FindMedianFromDataStreamVisualization), { ssr: false }),

  // Cache Algorithms
  'lru-cache': dynamic(() => import('@/components/visualizations/algorithms/LRUCacheVisualization').then(m => m.LRUCacheVisualization), { ssr: false }),
  'lru': dynamic(() => import('@/components/visualizations/algorithms/LRUCacheVisualization').then(m => m.LRUCacheVisualization), { ssr: false }),

  // Math Algorithms
  'gcd-euclidean': dynamic(() => import('@/components/visualizations/algorithms/GCDVisualization').then(m => m.GCDVisualization), { ssr: false }),
  'gcd': dynamic(() => import('@/components/visualizations/algorithms/GCDVisualization').then(m => m.GCDVisualization), { ssr: false }),
  'modular-exponentiation': dynamic(() => import('@/components/visualizations/algorithms/ModularExponentiationVisualization').then(m => m.ModularExponentiationVisualization), { ssr: false }),
  'sieve-eratosthenes': dynamic(() => import('@/components/visualizations/algorithms/SieveOfEratosthenesVisualization').then(m => m.SieveOfEratosthenesVisualization), { ssr: false }),
  'sieve-of-eratosthenes': dynamic(() => import('@/components/visualizations/algorithms/SieveOfEratosthenesVisualization').then(m => m.SieveOfEratosthenesVisualization), { ssr: false }),
  'karatsuba': dynamic(() => import('@/components/visualizations/algorithms/KaratsubaVisualization').then(m => m.KaratsubaVisualization), { ssr: false }),
  'karatsuba-multiplication': dynamic(() => import('@/components/visualizations/algorithms/KaratsubaVisualization').then(m => m.KaratsubaVisualization), { ssr: false }),
};

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
      <VisualizationComponent />
    </React.Suspense>
  );
}
