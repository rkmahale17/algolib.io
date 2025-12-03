// Centralized visualization mapping for all algorithms
// This file imports all visualization components and provides a lookup function
// Used as fallback when database doesn't provide visualization URL

import React from 'react';

// Lazy load all visualization components
export const visualizationMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  // Core Algorithms
  'two-pointers': React.lazy(() => import('@/components/visualizations/algorithms/TwoPointersVisualization').then(m => ({ default: m.TwoPointersVisualization }))),
  'sliding-window': React.lazy(() => import('@/components/visualizations/algorithms/SlidingWindowVisualization').then(m => ({ default: m.SlidingWindowVisualization }))),
  'prefix-sum': React.lazy(() => import('@/components/visualizations/algorithms/PrefixSumVisualization').then(m => ({ default: m.PrefixSumVisualization }))),
  'binary-search': React.lazy(() => import('@/components/visualizations/algorithms/BinarySearchVisualization').then(m => ({ default: m.BinarySearchVisualization }))),
  'kadanes-algorithm': React.lazy(() => import('@/components/visualizations/algorithms/KadanesVisualization').then(m => ({ default: m.KadanesVisualization }))),
  'dutch-national-flag': React.lazy(() => import('@/components/visualizations/algorithms/DutchNationalFlagVisualization').then(m => ({ default: m.DutchNationalFlagVisualization }))),
  'merge-intervals': React.lazy(() => import('@/components/visualizations/algorithms/MergeIntervalsVisualization').then(m => ({ default: m.MergeIntervalsVisualization }))),
  'monotonic-stack': React.lazy(() => import('@/components/visualizations/algorithms/MonotonicStackVisualization').then(m => ({ default: m.MonotonicStackVisualization }))),
  'quick-select': React.lazy(() => import('@/components/visualizations/algorithms/QuickSelectVisualization').then(m => ({ default: m.QuickSelectVisualization }))),
  'container-with-most-water': React.lazy(() => import('@/components/visualizations/algorithms/ContainerWithMostWaterVisualization').then(m => ({ default: m.ContainerWithMostWaterVisualization }))),
  'trapping-rain-water': React.lazy(() => import('@/components/visualizations/algorithms/TrappingRainWaterVisualization').then(m => ({ default: m.TrappingRainWaterVisualization }))),
  'rotate-array': React.lazy(() => import('@/components/visualizations/algorithms/RotateArrayVisualization').then(m => ({ default: m.RotateArrayVisualization }))),
  'cyclic-sort': React.lazy(() => import('@/components/visualizations/algorithms/CyclicSortVisualization').then(m => ({ default: m.CyclicSortVisualization }))),
  
  // Tree Algorithms
  'dfs-preorder': React.lazy(() => import('@/components/visualizations/algorithms/DFSPreorderVisualization').then(m => ({ default: m.DFSPreorderVisualization }))),
  'dfs-inorder': React.lazy(() => import('@/components/visualizations/algorithms/DFSInorderVisualization').then(m => ({ default: m.DFSInorderVisualization }))),
  'dfs-postorder': React.lazy(() => import('@/components/visualizations/algorithms/DFSPostorderVisualization').then(m => ({ default: m.DFSPostorderVisualization }))),
  'bfs-level-order': React.lazy(() => import('@/components/visualizations/algorithms/BFSLevelOrderVisualization').then(m => ({ default: m.BFSLevelOrderVisualization }))),
  'bst-insert': React.lazy(() => import('@/components/visualizations/algorithms/BSTInsertVisualization').then(m => ({ default: m.BSTInsertVisualization }))),
  'lca': React.lazy(() => import('@/components/visualizations/algorithms/LowestCommonAncestorVisualization').then(m => ({ default: m.LowestCommonAncestorVisualization }))),
  'serialize-tree': React.lazy(() => import('@/components/visualizations/algorithms/SerializeTreeVisualization').then(m => ({ default: m.SerializeTreeVisualization }))),
  'recover-bst': React.lazy(() => import('@/components/visualizations/algorithms/RecoverBSTVisualization').then(m => ({ default: m.RecoverBSTVisualization }))),
  'trie': React.lazy(() => import('@/components/visualizations/algorithms/TrieVisualization').then(m => ({ default: m.TrieVisualization }))),
  
  // Linked List Algorithms
  'fast-slow-pointers': React.lazy(() => import('@/components/visualizations/algorithms/FastSlowPointersVisualization').then(m => ({ default: m.FastSlowPointersVisualization }))),
  'reverse-linked-list': React.lazy(() => import('@/components/visualizations/algorithms/ReverseLinkedListVisualization').then(m => ({ default: m.ReverseLinkedListVisualization }))),
  'detect-cycle': React.lazy(() => import('@/components/visualizations/algorithms/DetectCycleVisualization').then(m => ({ default: m.DetectCycleVisualization }))),
  'middle-node': React.lazy(() => import('@/components/visualizations/algorithms/MiddleNodeVisualization').then(m => ({ default: m.MiddleNodeVisualization }))),
  'merge-sorted-lists': React.lazy(() => import('@/components/visualizations/algorithms/MergeSortedListsVisualization').then(m => ({ default: m.MergeSortedListsVisualization }))),
  'merge-k-lists': React.lazy(() => import('@/components/visualizations/algorithms/MergeKSortedListsVisualization').then(m => ({ default: m.MergeKSortedListsVisualization }))),
  'merge-k-sorted-lists': React.lazy(() => import('@/components/visualizations/algorithms/MergeKSortedListsVisualization').then(m => ({ default: m.MergeKSortedListsVisualization }))),
  
  // Graph Algorithms
  'graph-dfs': React.lazy(() => import('@/components/visualizations/algorithms/GraphDFSVisualization').then(m => ({ default: m.GraphDFSVisualization }))),
  'graph-bfs': React.lazy(() => import('@/components/visualizations/algorithms/GraphBFSVisualization').then(m => ({ default: m.GraphBFSVisualization }))),
  'topological-sort': React.lazy(() => import('@/components/visualizations/algorithms/TopologicalSortVisualization').then(m => ({ default: m.TopologicalSortVisualization }))),
  'union-find': React.lazy(() => import('@/components/visualizations/algorithms/UnionFindVisualization').then(m => ({ default: m.UnionFindVisualization }))),
  'kruskals': React.lazy(() => import('@/components/visualizations/algorithms/KruskalsVisualization').then(m => ({ default: m.KruskalsVisualization }))),
  'prims': React.lazy(() => import('@/components/visualizations/algorithms/PrimsVisualization').then(m => ({ default: m.PrimsVisualization }))),
  'dijkstras': React.lazy(() => import('@/components/visualizations/algorithms/DijkstrasVisualization').then(m => ({ default: m.DijkstrasVisualization }))),
  'bellman-ford': React.lazy(() => import('@/components/visualizations/algorithms/BellmanFordVisualization').then(m => ({ default: m.BellmanFordVisualization }))),
  'floyd-warshall': React.lazy(() => import('@/components/visualizations/algorithms/FloydWarshallVisualization').then(m => ({ default: m.FloydWarshallVisualization }))),
  'a-star': React.lazy(() => import('@/components/visualizations/algorithms/AStarVisualization').then(m => ({ default: m.AStarVisualization }))),
  
  // Dynamic Programming
  'knapsack-01': React.lazy(() => import('@/components/visualizations/algorithms/KnapsackVisualization').then(m => ({ default: m.KnapsackVisualization }))),
  'coin-change': React.lazy(() => import('@/components/visualizations/algorithms/CoinChangeVisualization').then(m => ({ default: m.CoinChangeVisualization }))),
  'lcs': React.lazy(() => import('@/components/visualizations/algorithms/LCSVisualization').then(m => ({ default: m.LCSVisualization }))),
  'lis': React.lazy(() => import('@/components/visualizations/algorithms/LISVisualization').then(m => ({ default: m.LISVisualization }))),
  'edit-distance': React.lazy(() => import('@/components/visualizations/algorithms/EditDistanceVisualization').then(m => ({ default: m.EditDistanceVisualization }))),
  'matrix-path-dp': React.lazy(() => import('@/components/visualizations/algorithms/MatrixPathVisualization').then(m => ({ default: m.MatrixPathVisualization }))),
  'house-robber': React.lazy(() => import('@/components/visualizations/algorithms/HouseRobberVisualization').then(m => ({ default: m.HouseRobberVisualization }))),
  'climbing-stairs': React.lazy(() => import('@/components/visualizations/algorithms/ClimbingStairsVisualization').then(m => ({ default: m.ClimbingStairsVisualization }))),
  'partition-equal-subset': React.lazy(() => import('@/components/visualizations/algorithms/PartitionEqualSubsetVisualization').then(m => ({ default: m.PartitionEqualSubsetVisualization }))),
  'word-break': React.lazy(() => import('@/components/visualizations/algorithms/WordBreakVisualization').then(m => ({ default: m.WordBreakVisualization }))),
  
  // Backtracking
  'subsets': React.lazy(() => import('@/components/visualizations/algorithms/SubsetsVisualization').then(m => ({ default: m.SubsetsVisualization }))),
  'permutations': React.lazy(() => import('@/components/visualizations/algorithms/PermutationsVisualization').then(m => ({ default: m.PermutationsVisualization }))),
  'combinations': React.lazy(() => import('@/components/visualizations/algorithms/CombinationsVisualization').then(m => ({ default: m.CombinationsVisualization }))),
  'combination-sum': React.lazy(() => import('@/components/visualizations/algorithms/CombinationSumVisualization').then(m => ({ default: m.CombinationSumVisualization }))),
  'word-search': React.lazy(() => import('@/components/visualizations/algorithms/WordSearchVisualization').then(m => ({ default: m.WordSearchVisualization }))),
  'word-search-grid': React.lazy(() => import('@/components/visualizations/algorithms/WordSearchVisualization').then(m => ({ default: m.WordSearchVisualization }))),
  'n-queens': React.lazy(() => import('@/components/visualizations/algorithms/NQueensVisualization').then(m => ({ default: m.NQueensVisualization }))),
  'sudoku-solver': React.lazy(() => import('@/components/visualizations/algorithms/SudokuSolverVisualization').then(m => ({ default: m.SudokuSolverVisualization }))),
  
  // Advanced Data Structures
  'segment-tree': React.lazy(() => import('@/components/visualizations/algorithms/SegmentTreeVisualization').then(m => ({ default: m.SegmentTreeVisualization }))),
  'fenwick-tree': React.lazy(() => import('@/components/visualizations/algorithms/FenwickTreeVisualization').then(m => ({ default: m.FenwickTreeVisualization }))),
  
  // String Algorithms
  'kmp': React.lazy(() => import('@/components/visualizations/algorithms/KMPVisualization').then(m => ({ default: m.KMPVisualization }))),
  'kmp-string-matching': React.lazy(() => import('@/components/visualizations/algorithms/KMPVisualization').then(m => ({ default: m.KMPVisualization }))),
  'rabin-karp': React.lazy(() => import('@/components/visualizations/algorithms/RabinKarpVisualization').then(m => ({ default: m.RabinKarpVisualization }))),
  
  // Greedy Algorithms
  'activity-selection': React.lazy(() => import('@/components/visualizations/algorithms/ActivitySelectionVisualization').then(m => ({ default: m.ActivitySelectionVisualization }))),
  
  // Bit Manipulation
  'xor-trick': React.lazy(() => import('@/components/visualizations/algorithms/XORTrickVisualization').then(m => ({ default: m.XORTrickVisualization }))),
  'count-bits': React.lazy(() => import('@/components/visualizations/algorithms/CountBitsVisualization').then(m => ({ default: m.CountBitsVisualization }))),
  'subset-generation-bits': React.lazy(() => import('@/components/visualizations/algorithms/SubsetBitsVisualization').then(m => ({ default: m.SubsetBitsVisualization }))),
  
  // Heap/Priority Queue
  'kth-largest': React.lazy(() => import('@/components/visualizations/algorithms/KthLargestVisualization').then(m => ({ default: m.KthLargestVisualization }))),
  'kth-largest-element': React.lazy(() => import('@/components/visualizations/algorithms/KthLargestVisualization').then(m => ({ default: m.KthLargestVisualization }))),
  'sliding-window-maximum': React.lazy(() => import('@/components/visualizations/algorithms/SlidingWindowMaxVisualization').then(m => ({ default: m.SlidingWindowMaxVisualization }))),
  
  // Math Algorithms
  'gcd-euclidean': React.lazy(() => import('@/components/visualizations/algorithms/GCDVisualization').then(m => ({ default: m.GCDVisualization }))),
  'gcd': React.lazy(() => import('@/components/visualizations/algorithms/GCDVisualization').then(m => ({ default: m.GCDVisualization }))),
  'sieve-eratosthenes': React.lazy(() => import('@/components/visualizations/algorithms/SieveVisualization').then(m => ({ default: m.SieveVisualization }))),
  'sieve-of-eratosthenes': React.lazy(() => import('@/components/visualizations/algorithms/SieveVisualization').then(m => ({ default: m.SieveVisualization }))),
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
