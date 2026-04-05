import React from 'react';

/**
 * Helper function to render Blind 75 visualizations
 * Maps algorithm IDs to their corresponding visualization components
 */

// Comprehensive mapping of all Blind 75 visualizations statically lazy-loaded
const blind75Map: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  "two-sum": React.lazy(() => import("@/components/visualizations/algorithms/TwoSumVisualization").then(m => ({ default: m.TwoSumVisualization }))),
  "two-pointers": React.lazy(() => import("@/components/visualizations/algorithms/TwoPointersVisualization").then(m => ({ default: m.TwoPointersVisualization }))),
  "sliding-window": React.lazy(() => import("@/components/visualizations/algorithms/SlidingWindowVisualization").then(m => ({ default: m.SlidingWindowVisualization }))),
  "product-of-array-except-self": React.lazy(() => import("@/components/visualizations/algorithms/ProductOfArrayExceptSelfVisualization").then(m => ({ default: m.ProductOfArrayExceptSelfVisualization }))),
  "prefix-sum": React.lazy(() => import("@/components/visualizations/algorithms/PrefixSumVisualization").then(m => ({ default: m.PrefixSumVisualization }))),
  "binary-search": React.lazy(() => import("@/components/visualizations/algorithms/BinarySearchVisualization").then(m => ({ default: m.BinarySearchVisualization }))),
  "maximum-subarray": React.lazy(() => import("@/components/visualizations/algorithms/MaximumSubarrayVisualization").then(m => ({ default: m.MaximumSubarrayVisualization }))),
  "kadanes-algorithm": React.lazy(() => import("@/components/visualizations/algorithms/MaximumSubarrayVisualization").then(m => ({ default: m.MaximumSubarrayVisualization }))),
  "3sum": React.lazy(() => import("@/components/visualizations/algorithms/ThreeSumVisualization").then(m => ({ default: m.ThreeSumVisualization }))),
  "find-minimum-in-rotated-sorted-array": React.lazy(() => import("@/components/visualizations/algorithms/FindMinimumInRotatedSortedArrayVisualization").then(m => ({ default: m.FindMinimumInRotatedSortedArrayVisualization }))),
  "search-in-rotated-sorted-array": React.lazy(() => import("@/components/visualizations/algorithms/SearchInRotatedSortedArrayVisualization").then(m => ({ default: m.SearchInRotatedSortedArrayVisualization }))),
  "container-with-most-water": React.lazy(() => import("@/components/visualizations/algorithms/ContainerWithMostWaterVisualization").then(m => ({ default: m.ContainerWithMostWaterVisualization }))),
  "best-time-to-buy-and-sell-stock": React.lazy(() => import("@/components/visualizations/algorithms/BestTimeToBuyAndSellStockVisualization").then(m => ({ default: m.BestTimeToBuyAndSellStockVisualization }))),
  "contains-duplicate": React.lazy(() => import("@/components/visualizations/algorithms/ContainsDuplicateVisualization").then(m => ({ default: m.ContainsDuplicateVisualization }))),
  "maximum-product-subarray": React.lazy(() => import("@/components/visualizations/algorithms/MaximumProductSubarrayVisualization").then(m => ({ default: m.MaximumProductSubarrayVisualization }))),
  "sum-of-two-integers": React.lazy(() => import("@/components/visualizations/algorithms/SumOfTwoIntegersVisualization").then(m => ({ default: m.SumOfTwoIntegersVisualization }))),
  "number-of-1-bits": React.lazy(() => import("@/components/visualizations/algorithms/NumberOf1BitsVisualization").then(m => ({ default: m.NumberOf1BitsVisualization }))),
  "counting-bits": React.lazy(() => import("@/components/visualizations/algorithms/CountingBitsVisualization").then(m => ({ default: m.CountingBitsVisualization }))),
  "missing-number": React.lazy(() => import("@/components/visualizations/algorithms/MissingNumberVisualization").then(m => ({ default: m.MissingNumberVisualization }))),
  "reverse-bits": React.lazy(() => import("@/components/visualizations/algorithms/ReverseBitsVisualization").then(m => ({ default: m.ReverseBitsVisualization }))),
  "climbing-stairs": React.lazy(() => import("@/components/visualizations/algorithms/ClimbingStairsVisualization").then(m => ({ default: m.ClimbingStairsVisualization }))),
  "coin-change": React.lazy(() => import("@/components/visualizations/algorithms/CoinChangeVisualization").then(m => ({ default: m.CoinChangeVisualization }))),
  "longest-increasing-subsequence": React.lazy(() => import("@/components/visualizations/algorithms/LISVisualization").then(m => ({ default: m.LISVisualization }))),
  "longest-common-subsequence": React.lazy(() => import("@/components/visualizations/algorithms/LCSVisualization").then(m => ({ default: m.LCSVisualization }))),
  "word-break": React.lazy(() => import("@/components/visualizations/algorithms/WordBreakVisualization").then(m => ({ default: m.WordBreakVisualization }))),
  "word-break-problem": React.lazy(() => import("@/components/visualizations/algorithms/WordBreakVisualization").then(m => ({ default: m.WordBreakVisualization }))),

  "valid-parentheses": React.lazy(() => import("@/components/visualizations/algorithms/ValidParenthesesVisualization").then(m => ({ default: m.ValidParenthesesVisualization }))),
  "longest-palindromic-substring": React.lazy(() => import("@/components/visualizations/algorithms/LongestPalindromicSubstringVisualization").then(m => ({ default: m.LongestPalindromicSubstringVisualization }))),
  "palindromic-substrings": React.lazy(() => import("@/components/visualizations/algorithms/PalindromicSubstringsVisualization").then(m => ({ default: m.PalindromicSubstringsVisualization }))),
  "encode-and-decode-strings": React.lazy(() => import("@/components/visualizations/algorithms/EncodeDecodeStringsVisualization").then(m => ({ default: m.EncodeDecodeStringsVisualization }))),
  "maximum-depth-of-binary-tree": React.lazy(() => import("@/components/visualizations/algorithms/MaximumDepthOfBinaryTreeVisualization").then(m => ({ default: m.MaximumDepthOfBinaryTreeVisualization }))),
  "combination-sum": React.lazy(() => import("@/components/visualizations/algorithms/CombinationSumVisualization").then(m => ({ default: m.CombinationSumVisualization }))),
  "house-robber": React.lazy(() => import("@/components/visualizations/algorithms/HouseRobberVisualization").then(m => ({ default: m.HouseRobberVisualization }))),
  "house-robber-ii": React.lazy(() => import("@/components/visualizations/algorithms/HouseRobberIIVisualization").then(m => ({ default: m.HouseRobberIIVisualization }))),
  "decode-ways": React.lazy(() => import("@/components/visualizations/algorithms/DecodeWaysVisualization").then(m => ({ default: m.DecodeWaysVisualization }))),
  'unique-paths': React.lazy(() => import('@/components/visualizations/algorithms/MatrixPathVisualization').then(m => ({ default: m.MatrixPathVisualization }))),
  "jump-game": React.lazy(() => import("@/components/visualizations/algorithms/JumpGameVisualization").then(m => ({ default: m.JumpGameVisualization }))),
  "clone-graph": React.lazy(() => import("@/components/visualizations/algorithms/CloneGraphVisualization").then(m => ({ default: m.CloneGraphVisualization }))),
  "course-schedule": React.lazy(() => import("@/components/visualizations/algorithms/CourseScheduleVisualization").then(m => ({ default: m.CourseScheduleVisualization }))),
  "pacific-atlantic": React.lazy(() => import("@/components/visualizations/algorithms/PacificAtlanticVisualization").then(m => ({ default: m.PacificAtlanticVisualization }))),
  "num-islands": React.lazy(() => import("@/components/visualizations/algorithms/NumberOfIslandsVisualization").then(m => ({ default: m.NumberOfIslandsVisualization }))),
  "number-of-islands": React.lazy(() => import("@/components/visualizations/algorithms/NumberOfIslandsVisualization").then(m => ({ default: m.NumberOfIslandsVisualization }))),
  "longest-consecutive-sequence": React.lazy(() => import("@/components/visualizations/algorithms/LongestConsecutiveSequenceVisualization").then(m => ({ default: m.LongestConsecutiveSequenceVisualization }))),
  "insert-interval": React.lazy(() => import("@/components/visualizations/algorithms/InsertIntervalVisualization").then(m => ({ default: m.InsertIntervalVisualization }))),
  "connected-components": React.lazy(() => import("@/components/visualizations/algorithms/ConnectedComponentsVisualization").then(m => ({ default: m.ConnectedComponentsVisualization }))),
  "graph-valid-tree": React.lazy(() => import("@/components/visualizations/algorithms/GraphValidTreeVisualization").then(m => ({ default: m.GraphValidTreeVisualization }))),
  "alien-dictionary": React.lazy(() => import("@/components/visualizations/algorithms/AlienDictionaryVisualization").then(m => ({ default: m.AlienDictionaryVisualization }))),
  "merge-intervals": React.lazy(() => import("@/components/visualizations/algorithms/MergeIntervalsVisualization").then(m => ({ default: m.MergeIntervalsVisualization }))),
  "non-overlapping-intervals": React.lazy(() => import("@/components/visualizations/algorithms/NonOverlappingIntervalsVisualization").then(m => ({ default: m.NonOverlappingIntervalsVisualization }))),
  "meeting-rooms": React.lazy(() => import("@/components/visualizations/algorithms/MeetingRoomsVisualization").then(m => ({ default: m.MeetingRoomsVisualization }))),
  "meeting-rooms-ii": React.lazy(() => import("@/components/visualizations/algorithms/MeetingRoomsIIVisualization").then(m => ({ default: m.MeetingRoomsIIVisualization }))),
  "reverse-linked-list": React.lazy(() => import("@/components/visualizations/algorithms/ReverseLinkedListVisualization").then(m => ({ default: m.ReverseLinkedListVisualization }))),
  "detect-cycle": React.lazy(() => import("@/components/visualizations/algorithms/DetectCycleVisualization").then(m => ({ default: m.DetectCycleVisualization }))),
  "merge-two-sorted-lists": React.lazy(() => import("@/components/visualizations/algorithms/MergeSortLinkedListVisualization").then(m => ({ default: m.MergeSortLinkedListVisualization }))),
  "merge-k-sorted-lists": React.lazy(() => import("@/components/visualizations/algorithms/MergeKSortedListsVisualization").then(m => ({ default: m.MergeKSortedListsVisualization }))),
  "remove-nth-node-from-end-of-list": React.lazy(() => import("@/components/visualizations/algorithms/RemoveNthNodeVisualization").then(m => ({ default: m.RemoveNthNodeVisualization }))),
  "reorder-list": React.lazy(() => import("@/components/visualizations/algorithms/ReorderListVisualization").then(m => ({ default: m.ReorderListVisualization }))),
  "set-matrix-zeroes": React.lazy(() => import("@/components/visualizations/algorithms/SetMatrixZeroesVisualization").then(m => ({ default: m.SetMatrixZeroesVisualization }))),
  "spiral-matrix": React.lazy(() => import("@/components/visualizations/algorithms/SpiralMatrixVisualization").then(m => ({ default: m.SpiralMatrixVisualization }))),
  "rotate-image": React.lazy(() => import("@/components/visualizations/algorithms/RotateImageVisualization").then(m => ({ default: m.RotateImageVisualization }))),
  "word-search": React.lazy(() => import("@/components/visualizations/algorithms/WordSearchVisualization").then(m => ({ default: m.WordSearchVisualization }))),
  "longest-substring-without-repeating-characters": React.lazy(() => import("@/components/visualizations/algorithms/LongestSubstringWithoutRepeatingCharactersVisualization").then(m => ({ default: m.LongestSubstringWithoutRepeatingCharactersVisualization }))),
  "longest-repeating-character-replacement": React.lazy(() => import("@/components/visualizations/algorithms/LongestRepeatingCharacterReplacementVisualization").then(m => ({ default: m.LongestRepeatingCharacterReplacementVisualization }))),
  "minimum-window-substring": React.lazy(() => import("@/components/visualizations/algorithms/MinimumWindowSubstringVisualization").then(m => ({ default: m.MinimumWindowSubstringVisualization }))),
  "valid-anagram": React.lazy(() => import("@/components/visualizations/algorithms/ValidAnagramVisualization").then(m => ({ default: m.ValidAnagramVisualization }))),
  "group-anagrams": React.lazy(() => import("@/components/visualizations/algorithms/GroupAnagramsVisualization").then(m => ({ default: m.GroupAnagramsVisualization }))),
  "valid-palindrome": React.lazy(() => import("@/components/visualizations/algorithms/ValidPalindromeVisualization").then(m => ({ default: m.ValidPalindromeVisualization }))),
  "same-tree": React.lazy(() => import("@/components/visualizations/algorithms/SameTreeVisualization").then(m => ({ default: m.SameTreeVisualization }))),
  "invert-binary-tree": React.lazy(() => import("@/components/visualizations/algorithms/InvertBinaryTreeVisualization").then(m => ({ default: m.InvertBinaryTreeVisualization }))),
  "binary-tree-maximum-path-sum": React.lazy(() => import("@/components/visualizations/algorithms/BinaryTreeMaximumPathSumVisualization").then(m => ({ default: m.BinaryTreeMaximumPathSumVisualization }))),
  "serialize-and-deserialize-binary-tree": React.lazy(() => import("@/components/visualizations/algorithms/SerializeDeserializeBinaryTreeVisualization").then(m => ({ default: m.SerializeDeserializeBinaryTreeVisualization }))),
  "subtree-of-another-tree": React.lazy(() => import("@/components/visualizations/algorithms/SubtreeOfAnotherTreeVisualization").then(m => ({ default: m.SubtreeOfAnotherTreeVisualization }))),
  "construct-binary-tree-from-preorder-and-inorder-traversal": React.lazy(() => import("@/components/visualizations/algorithms/ConstructBinaryTreeVisualization").then(m => ({ default: m.ConstructBinaryTreeVisualization }))),
  "validate-binary-search-tree": React.lazy(() => import("@/components/visualizations/algorithms/ValidateBSTVisualization").then(m => ({ default: m.ValidateBSTVisualization }))),
  "kth-smallest-element-in-a-bst": React.lazy(() => import("@/components/visualizations/algorithms/KthSmallestInBSTVisualization").then(m => ({ default: m.KthSmallestInBSTVisualization }))),
  "lowest-common-ancestor-of-a-binary-search-tree": React.lazy(() => import("@/components/visualizations/algorithms/LowestCommonAncestorBSTVisualization").then(m => ({ default: m.LowestCommonAncestorBSTVisualization }))),
  "implement-trie-prefix-tree": React.lazy(() => import("@/components/visualizations/algorithms/ImplementTrieVisualization").then(m => ({ default: m.ImplementTrieVisualization }))),
  "add-and-search-word": React.lazy(() => import("@/components/visualizations/algorithms/AddAndSearchWordVisualization").then(m => ({ default: m.AddAndSearchWordVisualization }))),
  "word-search-ii": React.lazy(() => import("@/components/visualizations/algorithms/WordSearchIIVisualization").then(m => ({ default: m.WordSearchIIVisualization }))),
};

export const renderBlind75Visualization = (algoId: string): React.ReactNode | null => {
  if (!algoId) return null;

  const VisualizationComponent = blind75Map[algoId];

  if (!VisualizationComponent) {
    return null;
  }

  return (
    <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}>
      <VisualizationComponent />
    </React.Suspense>
  );
};
