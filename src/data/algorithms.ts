export interface Algorithm {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  problems?: LeetCodeProblem[];
  youtubeUrl?: string;
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
    "id": "two-pointers",
    "name": "Two Pointers",
    "category": "Arrays & Strings",
    "difficulty": "beginner",
    "description": "Use two pointers to traverse arrays efficiently",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=_d0T_2Lk2qA",
    "problems": [
      { "number": 167, "title": "Two Sum II - Input Array Is Sorted", "slug": "two-sum-ii-input-array-is-sorted", "difficulty": "Easy", "link": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
      { "number": 1, "title": "Two Sum", "slug": "two-sum", "difficulty": "Easy", "link": "https://leetcode.com/problems/two-sum/" },
      { "number": 283, "title": "Move Zeroes", "slug": "move-zeroes", "difficulty": "Easy", "link": "https://leetcode.com/problems/move-zeroes/" },
      { "number": 344, "title": "Reverse String", "slug": "reverse-string", "difficulty": "Easy", "link": "https://leetcode.com/problems/reverse-string/" },
      { "number": 15, "title": "3Sum", "slug": "3sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/3sum/" },
      { "number": 16, "title": "3Sum Closest", "slug": "3sum-closest", "difficulty": "Medium", "link": "https://leetcode.com/problems/3sum-closest/" },
      { "number": 11, "title": "Container With Most Water", "slug": "container-with-most-water", "difficulty": "Medium", "link": "https://leetcode.com/problems/container-with-most-water/" },
      { "number": 881, "title": "Boats to Save People", "slug": "boats-to-save-people", "difficulty": "Medium", "link": "https://leetcode.com/problems/boats-to-save-people/" },
      { "number": 1672, "title": "Richest Customer Wealth", "slug": "richest-customer-wealth", "difficulty": "Easy", "link": "https://leetcode.com/problems/richest-customer-wealth/" },
      { "number": 992, "title": "Subarrays With K Different Integers", "slug": "subarrays-with-k-different-integers", "difficulty": "Hard", "link": "https://leetcode.com/problems/subarrays-with-k-different-integers/" },
      { "number": 239, "title": "Sliding Window Maximum", "slug": "sliding-window-maximum", "difficulty": "Hard", "link": "https://leetcode.com/problems/sliding-window-maximum/" },
      { "number": 42, "title": "Trapping Rain Water", "slug": "trapping-rain-water", "difficulty": "Hard", "link": "https://leetcode.com/problems/trapping-rain-water/" },
      { "number": 209, "title": "Minimum Size Subarray Sum", "slug": "minimum-size-subarray-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-size-subarray-sum/" },
      { "number": 160, "title": "Intersection of Two Linked Lists", "slug": "intersection-of-two-linked-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/intersection-of-two-linked-lists/" }
    ]
  },
  {
    "id": "sliding-window",
    "name": "Sliding Window",
    "category": "Arrays & Strings",
    "difficulty": "intermediate",
    "description": "Maintain a window of elements for efficient computation",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(k)",
    "youtubeUrl": "https://www.youtube.com/watch?v=wiGpQwVHdE0&list=PLot-Xpze53leOBgcVsJBEGrHPd_7x_koV&index=2",
    "problems": [
      { "number": 3, "title": "Longest Substring Without Repeating Characters", "slug": "longest-substring-without-repeating-characters", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { "number": 76, "title": "Minimum Window Substring", "slug": "minimum-window-substring", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-window-substring/" },
      { "number": 209, "title": "Minimum Size Subarray Sum", "slug": "minimum-size-subarray-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-size-subarray-sum/" },
      { "number": 438, "title": "Find All Anagrams in a String", "slug": "find-all-anagrams-in-a-string", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
      { "number": 76, "title": "Minimum Window Substring (duplicate)", "slug": "minimum-window-substring", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-window-substring/" },
      { "number": 904, "title": "Fruit Into Baskets", "slug": "fruit-into-baskets", "difficulty": "Medium", "link": "https://leetcode.com/problems/fruit-into-baskets/" },
      { "number": 159, "title": "Longest Substring with At Most Two Distinct Characters", "slug": "longest-substring-with-at-most-two-distinct-characters", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/" },
      { "number": 76, "title": "Minimum Window Substring (again)", "slug": "minimum-window-substring", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-window-substring/" },
      { "number": 125, "title": "Valid Palindrome", "slug": "valid-palindrome", "difficulty": "Easy", "link": "https://leetcode.com/problems/valid-palindrome/" },
      { "number": 1253, "title": "Reconstruct a 2-Row Binary Matrix", "slug": "reconstruct-a-2-row-binary-matrix", "difficulty": "Medium", "link": "https://leetcode.com/problems/reconstruct-a-2-row-binary-matrix/" },
      { "number": 76, "title": "Minimum Window Substring (canonical)", "slug": "minimum-window-substring", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-window-substring/" },
      { "number": 76, "title": "Minimum Window Substring (canonical duplicate)", "slug": "minimum-window-substring", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-window-substring/" },
      { "number": 727, "title": "Minimum Window Subsequence", "slug": "minimum-window-subsequence", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-window-subsequence/" },
      { "number": 76, "title": "Minimum Window Substring (placeholder)", "slug": "minimum-window-substring", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-window-substring/" }
    ]
  },
  {
    "id": "prefix-sum",
    "name": "Prefix Sum",
    "category": "Arrays & Strings",
    "difficulty": "beginner",
    "description": "Pre-compute cumulative sums for range queries",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "youtubeUrl": "https://www.youtube.com/watch?v=fFVZt-6sgyo",
    "problems": [
      { "number": 724, "title": "Find Pivot Index", "slug": "find-pivot-index", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-pivot-index/" },
      { "number": 560, "title": "Subarray Sum Equals K", "slug": "subarray-sum-equals-k", "difficulty": "Medium", "link": "https://leetcode.com/problems/subarray-sum-equals-k/" },
      { "number": 523, "title": "Continuous Subarray Sum", "slug": "continuous-subarray-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/continuous-subarray-sum/" },
      { "number": 930, "title": "Binary Subarrays With Sum", "slug": "binary-subarrays-with-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/binary-subarrays-with-sum/" },
      { "number": 1544, "title": "Make The String Great", "slug": "make-the-string-great", "difficulty": "Easy", "link": "https://leetcode.com/problems/make-the-string-great/" },
      { "number": 525, "title": "Contiguous Array", "slug": "contiguous-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/contiguous-array/" },
      { "number": 930, "title": "Binary Subarrays With Sum (duplicate)", "slug": "binary-subarrays-with-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/binary-subarrays-with-sum/" },
      { "number": 974, "title": "Subarray Sums Divisible by K", "slug": "subarray-sums-divisible-by-k", "difficulty": "Medium", "link": "https://leetcode.com/problems/subarray-sums-divisible-by-k/" },
      { "number": 560, "title": "Subarray Sum Equals K (duplicate)", "slug": "subarray-sum-equals-k", "difficulty": "Medium", "link": "https://leetcode.com/problems/subarray-sum-equals-k/" },
      { "number": 1234, "title": "Replace the Substring for Balanced String", "slug": "replace-the-substring-for-balanced-string", "difficulty": "Hard", "link": "https://leetcode.com/problems/replace-the-substring-for-balanced-string/" }
    ]
  },
  {
    "id": "binary-search",
    "name": "Binary Search",
    "category": "Arrays & Strings",
    "difficulty": "beginner",
    "description": "Search in sorted arrays in logarithmic time",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=s4DPM8ct1pI",
    "problems": [
      { "number": 704, "title": "Binary Search", "slug": "binary-search", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-search/" },
      { "number": 33, "title": "Search in Rotated Sorted Array", "slug": "search-in-rotated-sorted-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
      { "number": 153, "title": "Find Minimum in Rotated Sorted Array", "slug": "find-minimum-in-rotated-sorted-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
      { "number": 34, "title": "Find First and Last Position of Element in Sorted Array", "slug": "find-first-and-last-position-of-element-in-sorted-array", "difficulty": "Hard", "link": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" },
      { "number": 69, "title": "Sqrt(x)", "slug": "sqrtx", "difficulty": "Easy", "link": "https://leetcode.com/problems/sqrtx/" },
      { "number": 278, "title": "First Bad Version", "slug": "first-bad-version", "difficulty": "Easy", "link": "https://leetcode.com/problems/first-bad-version/" },
      { "number": 658, "title": "Find K Closest Elements", "slug": "find-k-closest-elements", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-k-closest-elements/" },
      { "number": 162, "title": "Find Peak Element", "slug": "find-peak-element", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-peak-element/" },
      { "number": 744, "title": "Find Smallest Letter Greater Than Target", "slug": "find-smallest-letter-greater-than-target", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-smallest-letter-greater-than-target/" },
      { "number": 875, "title": "Koko Eating Bananas", "slug": "koko-eating-bananas", "difficulty": "Medium", "link": "https://leetcode.com/problems/koko-eating-bananas/" }
    ]
  },
  {
    "id": "kadanes-algorithm",
    "name": "Kadane's Algorithm",
    "category": "Arrays & Strings",
    "difficulty": "intermediate",
    "description": "Find maximum subarray sum efficiently",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=5WZl3MMT0Eg",
    "problems": [
      { "number": 53, "title": "Maximum Subarray", "slug": "maximum-subarray", "difficulty": "Easy", "link": "https://leetcode.com/problems/maximum-subarray/" },
      { "number": 152, "title": "Maximum Product Subarray", "slug": "maximum-product-subarray", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-product-subarray/" },
      { "number": 918, "title": "Maximum Sum Circular Subarray", "slug": "maximum-sum-circular-subarray", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-sum-circular-subarray/" },
      { "number": 53, "title": "Maximum Subarray (duplicate)", "slug": "maximum-subarray", "difficulty": "Easy", "link": "https://leetcode.com/problems/maximum-subarray/" },
      { "number": 1155, "title": "Number of Dice Rolls With Target Sum", "slug": "number-of-dice-rolls-with-target-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/" },
      { "number": 1423, "title": "Maximum Points You Can Obtain from Cards", "slug": "maximum-points-you-can-obtain-from-cards", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/" },
      { "number": 325, "title": "Maximum Size Subarray Sum Equals k", "slug": "maximum-size-subarray-sum-equals-k", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/" },
      { "number": 1547, "title": "Minimum Cost to Cut a Stick", "slug": "minimum-cost-to-cut-a-stick", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/" },
      { "number": 925, "title": "Long Pressed Name", "slug": "long-pressed-name", "difficulty": "Easy", "link": "https://leetcode.com/problems/long-pressed-name/" },
      { "number": 209, "title": "Minimum Size Subarray Sum", "slug": "minimum-size-subarray-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-size-subarray-sum/" },
      { "number": 1653, "title": "Minimum Deletions to Make Array Beautiful", "slug": "minimum-deletions-to-make-array-beautiful", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-deletions-to-make-array-beautiful/" },
      { "number": 31, "title": "Next Permutation", "slug": "next-permutation", "difficulty": "Medium", "link": "https://leetcode.com/problems/next-permutation/" }
    ]
  },
  {
    "id": "dutch-national-flag",
    "name": "Dutch National Flag",
    "category": "Arrays & Strings",
    "difficulty": "intermediate",
    "description": "Sort array of three distinct elements",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=4RCIcM33nBE",
    "problems": [
      { "number": 75, "title": "Sort Colors", "slug": "sort-colors", "difficulty": "Medium", "link": "https://leetcode.com/problems/sort-colors/" },
      { "number": 215, "title": "Kth Largest Element in an Array", "slug": "kth-largest-element-in-an-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
      { "number": 912, "title": "Sort an Array", "slug": "sort-an-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/sort-an-array/" },
      { "number": 324, "title": "Wiggle Sort II", "slug": "wiggle-sort-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/wiggle-sort-ii/" },
      { "number": 179, "title": "Largest Number", "slug": "largest-number", "difficulty": "Medium", "link": "https://leetcode.com/problems/largest-number/" },
      { "number": 973, "title": "K Closest Points to Origin", "slug": "k-closest-points-to-origin", "difficulty": "Medium", "link": "https://leetcode.com/problems/k-closest-points-to-origin/" },
      { "number": 123, "title": "Best Time to Buy and Sell Stock III", "slug": "best-time-to-buy-and-sell-stock-iii", "difficulty": "Hard", "link": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/" },
      { "number": 27, "title": "Remove Element", "slug": "remove-element", "difficulty": "Easy", "link": "https://leetcode.com/problems/remove-element/" },
      { "number": 217, "title": "Contains Duplicate", "slug": "contains-duplicate", "difficulty": "Easy", "link": "https://leetcode.com/problems/contains-duplicate/" },
    ]
  },
  {
    "id": "merge-intervals",
    "name": "Merge Intervals",
    "category": "Arrays & Strings",
    "difficulty": "intermediate",
    "description": "Merge overlapping intervals",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "youtubeUrl": "https://www.youtube.com/watch?v=44H3cEC2fFM",
    "problems": [
      { "number": 56, "title": "Merge Intervals", "slug": "merge-intervals", "difficulty": "Medium", "link": "https://leetcode.com/problems/merge-intervals/" },
      { "number": 435, "title": "Non-overlapping Intervals", "slug": "non-overlapping-intervals", "difficulty": "Medium", "link": "https://leetcode.com/problems/non-overlapping-intervals/" },
      { "number": 452, "title": "Minimum Number of Arrows to Burst Balloons", "slug": "minimum-number-of-arrows-to-burst-balloons", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },
      { "number": 239, "title": "Sliding Window Maximum", "slug": "sliding-window-maximum", "difficulty": "Hard", "link": "https://leetcode.com/problems/sliding-window-maximum/" },
      { "number": 986, "title": "Interval List Intersections", "slug": "interval-list-intersections", "difficulty": "Medium", "link": "https://leetcode.com/problems/interval-list-intersections/" },
      { "number": 57, "title": "Insert Interval", "slug": "insert-interval", "difficulty": "Medium", "link": "https://leetcode.com/problems/insert-interval/" },
      { "number": 1234, "title": "Replace the Substring for Balanced String", "slug": "replace-the-substring-for-balanced-string", "difficulty": "Hard", "link": "https://leetcode.com/problems/replace-the-substring-for-balanced-string/" },
      { "number": 1094, "title": "Car Pooling", "slug": "car-pooling", "difficulty": "Medium", "link": "https://leetcode.com/problems/car-pooling/" },
      { "number": 636, "title": "Exclusive Time of Functions", "slug": "exclusive-time-of-functions", "difficulty": "Medium", "link": "https://leetcode.com/problems/exclusive-time-of-functions/" },
      { "number": 56, "title": "Merge Intervals (duplicate)", "slug": "merge-intervals", "difficulty": "Medium", "link": "https://leetcode.com/problems/merge-intervals/" },
      { "number": 57, "title": "Insert Interval (duplicate)", "slug": "insert-interval", "difficulty": "Medium", "link": "https://leetcode.com/problems/insert-interval/" },
      { "number": 1438, "title": "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit", "slug": "longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/" },
      { "number": 1235, "title": "Maximum Profit in Job Scheduling", "slug": "maximum-profit-in-job-scheduling", "difficulty": "Hard", "link": "https://leetcode.com/problems/maximum-profit-in-job-scheduling/" },
      { "number": 240, "title": "Search a 2D Matrix II", "slug": "search-a-2d-matrix-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/search-a-2d-matrix-ii/" }
    ]
  },
  {
    "id": "monotonic-stack",
    "name": "Monotonic Stack",
    "category": "Arrays & Strings",
    "difficulty": "advanced",
    "description": "Stack with monotonic properties for efficient queries",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "youtubeUrl": "https://www.youtube.com/watch?v=qkLl7nAwDPo",
    "problems": [
      { "number": 496, "title": "Next Greater Element I", "slug": "next-greater-element-i", "difficulty": "Easy", "link": "https://leetcode.com/problems/next-greater-element-i/" },
      { "number": 503, "title": "Next Greater Element II", "slug": "next-greater-element-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/next-greater-element-ii/" },
      { "number": 739, "title": "Daily Temperatures", "slug": "daily-temperatures", "difficulty": "Medium", "link": "https://leetcode.com/problems/daily-temperatures/" },
      { "number": 42, "title": "Trapping Rain Water", "slug": "trapping-rain-water", "difficulty": "Hard", "link": "https://leetcode.com/problems/trapping-rain-water/" },
      { "number": 901, "title": "Online Stock Span", "slug": "online-stock-span", "difficulty": "Medium", "link": "https://leetcode.com/problems/online-stock-span/" },
      { "number": 85, "title": "Maximal Rectangle", "slug": "maximal-rectangle", "difficulty": "Hard", "link": "https://leetcode.com/problems/maximal-rectangle/" },
      { "number": 84, "title": "Largest Rectangle in Histogram", "slug": "largest-rectangle-in-histogram", "difficulty": "Hard", "link": "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
      { "number": 42, "title": "Trapping Rain Water (duplicate)", "slug": "trapping-rain-water", "difficulty": "Hard", "link": "https://leetcode.com/problems/trapping-rain-water/" },
      { "number": 946, "title": "Validate Stack Sequences", "slug": "validate-stack-sequences", "difficulty": "Medium", "link": "https://leetcode.com/problems/validate-stack-sequences/" },
      { "number": 84, "title": "Largest Rectangle in Histogram (duplicate)", "slug": "largest-rectangle-in-histogram", "difficulty": "Hard", "link": "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
      { "number": 739, "title": "Daily Temperatures (duplicate)", "slug": "daily-temperatures", "difficulty": "Medium", "link": "https://leetcode.com/problems/daily-temperatures/" },

    ]
  },
  {
    "id": "rotate-array",
    "name": "Rotate Array In-Place",
    "category": "Arrays & Strings",
    "difficulty": "beginner",
    "description": "Rotate array elements without extra space",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=BHr381Guz3Y",
    "problems": [
      { "number": 189, "title": "Rotate Array", "slug": "rotate-array", "difficulty": "Easy", "link": "https://leetcode.com/problems/rotate-array/" },
      { "number": 61, "title": "Rotate List", "slug": "rotate-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/rotate-list/" },
      { "number": 283, "title": "Move Zeroes", "slug": "move-zeroes", "difficulty": "Easy", "link": "https://leetcode.com/problems/move-zeroes/" },
      { "number": 485, "title": "Max Consecutive Ones", "slug": "max-consecutive-ones", "difficulty": "Easy", "link": "https://leetcode.com/problems/max-consecutive-ones/" },

    ]
  },
  {
    "id": "cyclic-sort",
    "name": "Cyclic Sort",
    "category": "Arrays & Strings",
    "difficulty": "intermediate",
    "description": "Sort by placing elements at their correct index",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "problems": [
      { "number": 442, "title": "Find All Duplicates in an Array", "slug": "find-all-duplicates-in-an-array", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-all-duplicates-in-an-array/" },
      { "number": 268, "title": "Missing Number", "slug": "missing-number", "difficulty": "Easy", "link": "https://leetcode.com/problems/missing-number/" },
      { "number": 287, "title": "Find the Duplicate Number", "slug": "find-the-duplicate-number", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-the-duplicate-number/" },
      { "number": 41, "title": "First Missing Positive", "slug": "first-missing-positive", "difficulty": "Hard", "link": "https://leetcode.com/problems/first-missing-positive/" },
      { "number": 448, "title": "Find All Numbers Disappeared in an Array", "slug": "find-all-numbers-disappeared-in-an-array", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/" },
      { "number": 287, "title": "Find the Duplicate Number (duplicate)", "slug": "find-the-duplicate-number", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-the-duplicate-number/" },
      { "number": 27, "title": "Remove Element", "slug": "remove-element", "difficulty": "Easy", "link": "https://leetcode.com/problems/remove-element/" },
      { "number": 217, "title": "Contains Duplicate", "slug": "contains-duplicate", "difficulty": "Easy", "link": "https://leetcode.com/problems/contains-duplicate/" }
    ]
  },
  // Linked List
  {
    "id": "fast-slow-pointers",
    "name": "Fast & Slow Pointers",
    "category": "Linked List",
    "difficulty": "intermediate",
    "description": "Detect cycles and find middle using two pointers",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=gBTe7lFR3vc",
    "problems": [
      { "number": 141, "title": "Linked List Cycle", "slug": "linked-list-cycle", "difficulty": "Easy", "link": "https://leetcode.com/problems/linked-list-cycle/" },
      { "number": 142, "title": "Linked List Cycle II", "slug": "linked-list-cycle-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/linked-list-cycle-ii/" },
      { "number": 160, "title": "Intersection of Two Linked Lists", "slug": "intersection-of-two-linked-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
      { "number": 876, "title": "Middle of the Linked List", "slug": "middle-of-the-linked-list", "difficulty": "Easy", "link": "https://leetcode.com/problems/middle-of-the-linked-list/" },
      { "number": 19, "title": "Remove Nth Node From End of List", "slug": "remove-nth-node-from-end-of-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
      { "number": 92, "title": "Reverse Linked List II", "slug": "reverse-linked-list-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/reverse-linked-list-ii/" },
      { "number": 328, "title": "Odd Even Linked List", "slug": "odd-even-linked-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/odd-even-linked-list/" },
      { "number": 61, "title": "Rotate List", "slug": "rotate-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/rotate-list/" },
      { "number": 725, "title": "Split Linked List in Parts", "slug": "split-linked-list-in-parts", "difficulty": "Medium", "link": "https://leetcode.com/problems/split-linked-list-in-parts/" },
      { "number": 143, "title": "Reorder List", "slug": "reorder-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/reorder-list/" },
      { "number": 23, "title": "Merge k Sorted Lists", "slug": "merge-k-sorted-lists", "difficulty": "Hard", "link": "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { "number": 25, "title": "Reverse Nodes in k-Group", "slug": "reverse-nodes-in-k-group", "difficulty": "Hard", "link": "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
      { "number": 148, "title": "Sort List", "slug": "sort-list", "difficulty": "Hard", "link": "https://leetcode.com/problems/sort-list/" },
      { "number": 109, "title": "Convert Sorted List to Binary Search Tree", "slug": "convert-sorted-list-to-binary-search-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/" }
    ]
  },

  {
    "id": "reverse-linked-list",
    "name": "Reverse Linked List",
    "category": "Linked List",
    "difficulty": "beginner",
    "description": "Reverse a singly linked list",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=G0_I-ZF0S38",
    "problems": [
      { "number": 206, "title": "Reverse Linked List", "slug": "reverse-linked-list", "difficulty": "Easy", "link": "https://leetcode.com/problems/reverse-linked-list/" },
      { "number": 92, "title": "Reverse Linked List II", "slug": "reverse-linked-list-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/reverse-linked-list-ii/" },
      { "number": 25, "title": "Reverse Nodes in k-Group", "slug": "reverse-nodes-in-k-group", "difficulty": "Hard", "link": "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
      { "number": 234, "title": "Palindrome Linked List", "slug": "palindrome-linked-list", "difficulty": "Easy", "link": "https://leetcode.com/problems/palindrome-linked-list/" },
      { "number": 92, "title": "Reverse Linked List II (duplicate)", "slug": "reverse-linked-list-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/reverse-linked-list-ii/" },
      { "number": 1669, "title": "Merge In Between Linked Lists", "slug": "merge-in-between-linked-lists", "difficulty": "Medium", "link": "https://leetcode.com/problems/merge-in-between-linked-lists/" },
      { "number": 92, "title": "Reverse Linked List II (third)", "slug": "reverse-linked-list-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/reverse-linked-list-ii/" },
      { "number": 1385, "title": "Find the Distance Value Between Two Arrays", "slug": "find-the-distance-value-between-two-arrays", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-the-distance-value-between-two-arrays/" },
      { "number": 25, "title": "Reverse Nodes in k-Group (duplicate)", "slug": "reverse-nodes-in-k-group", "difficulty": "Hard", "link": "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
      { "number": 92, "title": "Reverse Linked List II (fourth)", "slug": "reverse-linked-list-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/reverse-linked-list-ii/" },
      { "number": 24, "title": "Swap Nodes in Pairs", "slug": "swap-nodes-in-pairs", "difficulty": "Medium", "link": "https://leetcode.com/problems/swap-nodes-in-pairs/" },
      { "number": 328, "title": "Odd Even Linked List", "slug": "odd-even-linked-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/odd-even-linked-list/" },
      { "number": 430, "title": "Flatten a Multilevel Doubly Linked List", "slug": "flatten-a-multilevel-doubly-linked-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/" },
      { "number": 25, "title": "Reverse Nodes in k-Group (third duplicate)", "slug": "reverse-nodes-in-k-group", "difficulty": "Hard", "link": "https://leetcode.com/problems/reverse-nodes-in-k-group/" }
    ]
  },

  {
    "id": "merge-sorted-lists",
    "name": "Merge Two Sorted Lists",
    "category": "Linked List",
    "difficulty": "beginner",
    "description": "Merge two sorted linked lists",
    "timeComplexity": "O(n+m)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=XIdigk956u0",
    "problems": [
      { "number": 21, "title": "Merge Two Sorted Lists", "slug": "merge-two-sorted-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { "number": 23, "title": "Merge k Sorted Lists", "slug": "merge-k-sorted-lists", "difficulty": "Hard", "link": "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { "number": 88, "title": "Merge Sorted Array", "slug": "merge-sorted-array", "difficulty": "Easy", "link": "https://leetcode.com/problems/merge-sorted-array/" },
      { "number": 61, "title": "Rotate List", "slug": "rotate-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/rotate-list/" },
      { "number": 148, "title": "Sort List", "slug": "sort-list", "difficulty": "Hard", "link": "https://leetcode.com/problems/sort-list/" },
      { "number": 21, "title": "Merge Two Sorted Lists (duplicate)", "slug": "merge-two-sorted-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { "number": 23, "title": "Merge k Sorted Lists (duplicate)", "slug": "merge-k-sorted-lists", "difficulty": "Hard", "link": "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { "number": 160, "title": "Intersection of Two Linked Lists", "slug": "intersection-of-two-linked-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
      { "number": 21, "title": "Merge Two Sorted Lists (third)", "slug": "merge-two-sorted-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { "number": 23, "title": "Merge k Sorted Lists (third)", "slug": "merge-k-sorted-lists", "difficulty": "Hard", "link": "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { "number": 23, "title": "Merge k Sorted Lists (fourth)", "slug": "merge-k-sorted-lists", "difficulty": "Hard", "link": "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { "number": 92, "title": "Reverse Linked List II", "slug": "reverse-linked-list-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/reverse-linked-list-ii/" },
      { "number": 21, "title": "Merge Two Sorted Lists (fourth)", "slug": "merge-two-sorted-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { "number": 148, "title": "Sort List (duplicate)", "slug": "sort-list", "difficulty": "Hard", "link": "https://leetcode.com/problems/sort-list/" }
    ]
  },

  {
    "id": "detect-cycle",
    "name": "Detect Cycle",
    "category": "Linked List",
    "difficulty": "intermediate",
    "description": "Floyd's algorithm to detect cycles",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=gBTe7lFR3vc",
    "problems": [
      { "number": 141, "title": "Linked List Cycle", "slug": "linked-list-cycle", "difficulty": "Easy", "link": "https://leetcode.com/problems/linked-list-cycle/" },
      { "number": 142, "title": "Linked List Cycle II", "slug": "linked-list-cycle-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/linked-list-cycle-ii/" },
      { "number": 160, "title": "Intersection of Two Linked Lists", "slug": "intersection-of-two-linked-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
      { "number": 287, "title": "Find the Duplicate Number", "slug": "find-the-duplicate-number", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-the-duplicate-number/" },
      { "number": 142, "title": "Linked List Cycle II (duplicate)", "slug": "linked-list-cycle-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/linked-list-cycle-ii/" },
      { "number": 692, "title": "Top K Frequent Words", "slug": "top-k-frequent-words", "difficulty": "Medium", "link": "https://leetcode.com/problems/top-k-frequent-words/" },
      { "number": 141, "title": "Linked List Cycle (duplicate)", "slug": "linked-list-cycle", "difficulty": "Easy", "link": "https://leetcode.com/problems/linked-list-cycle/" },
      { "number": 142, "title": "Linked List Cycle II (third)", "slug": "linked-list-cycle-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/linked-list-cycle-ii/" },
      { "number": 23, "title": "Merge k Sorted Lists", "slug": "merge-k-sorted-lists", "difficulty": "Hard", "link": "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { "number": 25, "title": "Reverse Nodes in k-Group", "slug": "reverse-nodes-in-k-group", "difficulty": "Hard", "link": "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
      { "number": 109, "title": "Convert Sorted List to Binary Search Tree", "slug": "convert-sorted-list-to-binary-search-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/" },
      { "number": 148, "title": "Sort List", "slug": "sort-list", "difficulty": "Hard", "link": "https://leetcode.com/problems/sort-list/" },
      { "number": 160, "title": "Intersection of Two Linked Lists (duplicate)", "slug": "intersection-of-two-linked-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
      { "number": 827, "title": "Making A Large Island", "slug": "making-a-large-island", "difficulty": "Hard", "link": "https://leetcode.com/problems/making-a-large-island/" }
    ]
  },

  {
    "id": "middle-node",
    "name": "Middle Node",
    "category": "Linked List",
    "difficulty": "beginner",
    "description": "Find middle node using fast and slow pointers",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=A2_ldqM4QcY",
    "problems": [
      { "number": 876, "title": "Middle of the Linked List", "slug": "middle-of-the-linked-list", "difficulty": "Easy", "link": "https://leetcode.com/problems/middle-of-the-linked-list/" },
      { "number": 141, "title": "Linked List Cycle", "slug": "linked-list-cycle", "difficulty": "Easy", "link": "https://leetcode.com/problems/linked-list-cycle/" },
      { "number": 160, "title": "Intersection of Two Linked Lists", "slug": "intersection-of-two-linked-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
      { "number": 19, "title": "Remove Nth Node From End of List", "slug": "remove-nth-node-from-end-of-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
      { "number": 725, "title": "Split Linked List in Parts", "slug": "split-linked-list-in-parts", "difficulty": "Medium", "link": "https://leetcode.com/problems/split-linked-list-in-parts/" },
      { "number": 21, "title": "Merge Two Sorted Lists", "slug": "merge-two-sorted-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { "number": 92, "title": "Reverse Linked List II", "slug": "reverse-linked-list-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/reverse-linked-list-ii/" },
      { "number": 328, "title": "Odd Even Linked List", "slug": "odd-even-linked-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/odd-even-linked-list/" },
      { "number": 142, "title": "Linked List Cycle II", "slug": "linked-list-cycle-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/linked-list-cycle-ii/" },
      { "number": 25, "title": "Reverse Nodes in k-Group", "slug": "reverse-nodes-in-k-group", "difficulty": "Hard", "link": "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
      { "number": 109, "title": "Convert Sorted List to Binary Search Tree", "slug": "convert-sorted-list-to-binary-search-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/" },
      { "number": 148, "title": "Sort List", "slug": "sort-list", "difficulty": "Hard", "link": "https://leetcode.com/problems/sort-list/" },
      { "number": 234, "title": "Palindrome Linked List", "slug": "palindrome-linked-list", "difficulty": "Easy", "link": "https://leetcode.com/problems/palindrome-linked-list/" },
      { "number": 237, "title": "Delete Node in a Linked List", "slug": "delete-node-in-a-linked-list", "difficulty": "Easy", "link": "https://leetcode.com/problems/delete-node-in-a-linked-list/" }
    ]
  },
  // Trees & BSTs

  {
    "id": "dfs-preorder",
    "name": "DFS Preorder",
    "category": "Trees & BSTs",
    "difficulty": "beginner",
    "description": "Visit root, left, then right subtree",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "youtubeUrl": "https://www.youtube.com/watch?v=afTpieEZXck",
    "problems": [
      { "number": 144, "title": "Binary Tree Preorder Traversal", "slug": "binary-tree-preorder-traversal", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-preorder-traversal/" },
      { "number": 94, "title": "Binary Tree Inorder Traversal", "slug": "binary-tree-inorder-traversal", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
      { "number": 100, "title": "Same Tree", "slug": "same-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/same-tree/" },
      { "number": 101, "title": "Symmetric Tree", "slug": "symmetric-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/symmetric-tree/" },
      { "number": 105, "title": "Construct Binary Tree from Preorder and Inorder Traversal", "slug": "construct-binary-tree-from-preorder-and-inorder-traversal", "difficulty": "Medium", "link": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
      { "number": 106, "title": "Construct Binary Tree from Inorder and Postorder Traversal", "slug": "construct-binary-tree-from-inorder-and-postorder-traversal", "difficulty": "Medium", "link": "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/" },
      { "number": 114, "title": "Flatten Binary Tree to Linked List", "slug": "flatten-binary-tree-to-linked-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/" },
      { "number": 1441, "title": "Build an Array With Stack Operations", "slug": "build-an-array-with-stack-operations", "difficulty": "Medium", "link": "https://leetcode.com/problems/build-an-array-with-stack-operations/" },
      { "number": 199, "title": "Binary Tree Right Side View", "slug": "binary-tree-right-side-view", "difficulty": "Medium", "link": "https://leetcode.com/problems/binary-tree-right-side-view/" },
      { "number": 107, "title": "Binary Tree Level Order Traversal II", "slug": "binary-tree-level-order-traversal-ii", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/" },
      { "number": 129, "title": "Sum Root to Leaf Numbers", "slug": "sum-root-to-leaf-numbers", "difficulty": "Medium", "link": "https://leetcode.com/problems/sum-root-to-leaf-numbers/" },
      { "number": 257, "title": "Binary Tree Paths", "slug": "binary-tree-paths", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-paths/" },
      { "number": 124, "title": "Binary Tree Maximum Path Sum", "slug": "binary-tree-maximum-path-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { "number": 297, "title": "Serialize and Deserialize Binary Tree", "slug": "serialize-and-deserialize-binary-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" }
    ]
  },

  {
    "id": "dfs-inorder",
    "name": "DFS Inorder",
    "category": "Trees & BSTs",
    "difficulty": "beginner",
    "description": "Visit left, root, then right subtree",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "youtubeUrl": "https://www.youtube.com/watch?v=g_S5WuasWUE",
    "problems": [
      { "number": 94, "title": "Binary Tree Inorder Traversal", "slug": "binary-tree-inorder-traversal", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
      { "number": 98, "title": "Validate Binary Search Tree", "slug": "validate-binary-search-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/validate-binary-search-tree/" },
      { "number": 450, "title": "Delete Node in a BST", "slug": "delete-node-in-a-bst", "difficulty": "Medium", "link": "https://leetcode.com/problems/delete-node-in-a-bst/" },
      { "number": 230, "title": "Kth Smallest Element in a BST", "slug": "kth-smallest-element-in-a-bst", "difficulty": "Medium", "link": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
      { "number": 99, "title": "Recover Binary Search Tree", "slug": "recover-binary-search-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/recover-binary-search-tree/" },
      { "number": 173, "title": "Binary Search Tree Iterator", "slug": "binary-search-tree-iterator", "difficulty": "Medium", "link": "https://leetcode.com/problems/binary-search-tree-iterator/" },
      { "number": 701, "title": "Insert into a Binary Search Tree", "slug": "insert-into-a-binary-search-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/insert-into-a-binary-search-tree/" },
      { "number": 98, "title": "Validate Binary Search Tree (duplicate)", "slug": "validate-binary-search-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/validate-binary-search-tree/" },
      { "number": 108, "title": "Convert Sorted Array to Binary Search Tree", "slug": "convert-sorted-array-to-binary-search-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/" },
      { "number": 109, "title": "Convert Sorted List to Binary Search Tree", "slug": "convert-sorted-list-to-binary-search-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/" },

      { "number": 124, "title": "Binary Tree Maximum Path Sum", "slug": "binary-tree-maximum-path-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { "number": 99, "title": "Recover Binary Search Tree (duplicate)", "slug": "recover-binary-search-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/recover-binary-search-tree/" }
    ]
  },

  {
    "id": "dfs-postorder",
    "name": "DFS Postorder",
    "category": "Trees & BSTs",
    "difficulty": "beginner",
    "description": "Visit left, right, then root",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "youtubeUrl": "https://www.youtube.com/watch?v=QhszUQhGGlA",
    "problems": [
      { "number": 145, "title": "Binary Tree Postorder Traversal", "slug": "binary-tree-postorder-traversal", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-postorder-traversal/" },
      { "number": 114, "title": "Flatten Binary Tree to Linked List", "slug": "flatten-binary-tree-to-linked-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/" },
      { "number": 124, "title": "Binary Tree Maximum Path Sum", "slug": "binary-tree-maximum-path-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { "number": 199, "title": "Binary Tree Right Side View", "slug": "binary-tree-right-side-view", "difficulty": "Medium", "link": "https://leetcode.com/problems/binary-tree-right-side-view/" },
      { "number": 230, "title": "Kth Smallest Element in a BST", "slug": "kth-smallest-element-in-a-bst", "difficulty": "Medium", "link": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
      { "number": 257, "title": "Binary Tree Paths", "slug": "binary-tree-paths", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-paths/" },
      { "number": 863, "title": "All Nodes Distance K in Binary Tree", "slug": "all-nodes-distance-k-in-binary-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/" },
      { "number": 437, "title": "Path Sum III", "slug": "path-sum-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/path-sum-iii/" },
      { "number": 112, "title": "Path Sum", "slug": "path-sum", "difficulty": "Easy", "link": "https://leetcode.com/problems/path-sum/" },
      { "number": 129, "title": "Sum Root to Leaf Numbers", "slug": "sum-root-to-leaf-numbers", "difficulty": "Medium", "link": "https://leetcode.com/problems/sum-root-to-leaf-numbers/" },
      { "number": 687, "title": "Longest Univalue Path", "slug": "longest-univalue-path", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-univalue-path/" },
      { "number": 297, "title": "Serialize and Deserialize Binary Tree", "slug": "serialize-and-deserialize-binary-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
      { "number": 114, "title": "Flatten Binary Tree to Linked List (duplicate)", "slug": "flatten-binary-tree-to-linked-list", "difficulty": "Medium", "link": "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/" },
      { "number": 889, "title": "Construct Binary Tree from Preorder and Postorder Traversal", "slug": "construct-binary-tree-from-preorder-and-postorder-traversal", "difficulty": "Medium", "link": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/" }
    ]
  },

  {
    "id": "bfs-level-order",
    "name": "BFS Level Order",
    "category": "Trees & BSTs",
    "difficulty": "beginner",
    "description": "Traverse tree level by level",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(w)",
    "youtubeUrl": "https://www.youtube.com/watch?v=6ZnyEApgFYg",
    "problems": [
      { "number": 102, "title": "Binary Tree Level Order Traversal", "slug": "binary-tree-level-order-traversal", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { "number": 107, "title": "Binary Tree Level Order Traversal II", "slug": "binary-tree-level-order-traversal-ii", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/" },
      { "number": 199, "title": "Binary Tree Right Side View", "slug": "binary-tree-right-side-view", "difficulty": "Medium", "link": "https://leetcode.com/problems/binary-tree-right-side-view/" },
      { "number": 429, "title": "N-ary Tree Level Order Traversal", "slug": "n-ary-tree-level-order-traversal", "difficulty": "Medium", "link": "https://leetcode.com/problems/n-ary-tree-level-order-traversal/" },
      { "number": 515, "title": "Find Largest Value in Each Tree Row", "slug": "find-largest-value-in-each-tree-row", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-largest-value-in-each-tree-row/" },
      { "number": 101, "title": "Symmetric Tree", "slug": "symmetric-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/symmetric-tree/" },
      { "number": 637, "title": "Average of Levels in Binary Tree", "slug": "average-of-levels-in-binary-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/average-of-levels-in-binary-tree/" },

      { "number": 116, "title": "Populating Next Right Pointers in Each Node", "slug": "populating-next-right-pointers-in-each-node", "difficulty": "Medium", "link": "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/" },
      { "number": 117, "title": "Populating Next Right Pointers in Each Node II", "slug": "populating-next-right-pointers-in-each-node-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/" },

      { "number": 124, "title": "Binary Tree Maximum Path Sum", "slug": "binary-tree-maximum-path-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { "number": 297, "title": "Serialize and Deserialize Binary Tree", "slug": "serialize-and-deserialize-binary-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" }
    ]
  },

  {
    "id": "bst-insert",
    "name": "BST Insert",
    "category": "Trees & BSTs",
    "difficulty": "intermediate",
    "description": "Insert node in binary search tree",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(h)",
    "problems": [
      { "number": 701, "title": "Insert into a Binary Search Tree", "slug": "insert-into-a-binary-search-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/insert-into-a-binary-search-tree/" },
      { "number": 98, "title": "Validate Binary Search Tree", "slug": "validate-binary-search-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/validate-binary-search-tree/" },
      { "number": 450, "title": "Delete Node in a BST", "slug": "delete-node-in-a-bst", "difficulty": "Medium", "link": "https://leetcode.com/problems/delete-node-in-a-bst/" },
      { "number": 230, "title": "Kth Smallest Element in a BST", "slug": "kth-smallest-element-in-a-bst", "difficulty": "Medium", "link": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
      { "number": 108, "title": "Convert Sorted Array to Binary Search Tree", "slug": "convert-sorted-array-to-binary-search-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/" },
      { "number": 109, "title": "Convert Sorted List to Binary Search Tree", "slug": "convert-sorted-list-to-binary-search-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/" },
      { "number": 272, "title": "Closest Binary Search Tree Value II", "slug": "closest-binary-search-tree-value-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/closest-binary-search-tree-value-ii/" },
      { "number": 653, "title": "Two Sum IV - Input is a BST", "slug": "two-sum-iv-input-is-a-bst", "difficulty": "Easy", "link": "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/" },

      { "number": 333, "title": "Largest BST Subtree", "slug": "largest-bst-subtree", "difficulty": "Medium", "link": "https://leetcode.com/problems/largest-bst-subtree/" },
      { "number": 99, "title": "Recover Binary Search Tree", "slug": "recover-binary-search-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/recover-binary-search-tree/" },

    ]
  },

  {
    "id": "lca",
    "name": "Lowest Common Ancestor",
    "category": "Trees & BSTs",
    "difficulty": "intermediate",
    "description": "Find LCA of two nodes in tree",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "youtubeUrl": "https://www.youtube.com/watch?v=gs2LMfuOR9k",
    "problems": [
      { "number": 236, "title": "Lowest Common Ancestor of a Binary Tree", "slug": "lowest-common-ancestor-of-a-binary-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
      { "number": 235, "title": "Lowest Common Ancestor of a Binary Search Tree", "slug": "lowest-common-ancestor-of-a-binary-search-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
      { "number": 1650, "title": "Lowest Common Ancestor of a Binary Tree III", "slug": "lowest-common-ancestor-of-a-binary-tree-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/" },
      { "number": 1060, "title": "Missing Element in Sorted Array", "slug": "missing-element-in-sorted-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/missing-element-in-sorted-array/" },

      { "number": 124, "title": "Binary Tree Maximum Path Sum", "slug": "binary-tree-maximum-path-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },


    ]
  },

  {
    "id": "recover-bst",
    "name": "Recover BST",
    "category": "Trees & BSTs",
    "difficulty": "advanced",
    "description": "Fix BST with two swapped nodes",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "problems": [
      { "number": 99, "title": "Recover Binary Search Tree", "slug": "recover-binary-search-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/recover-binary-search-tree/" },
      { "number": 98, "title": "Validate Binary Search Tree", "slug": "validate-binary-search-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/validate-binary-search-tree/" },
      { "number": 230, "title": "Kth Smallest Element in a BST", "slug": "kth-smallest-element-in-a-bst", "difficulty": "Medium", "link": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
      { "number": 501, "title": "Find Mode in Binary Search Tree", "slug": "find-mode-in-binary-search-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-mode-in-binary-search-tree/" },

      { "number": 124, "title": "Binary Tree Maximum Path Sum", "slug": "binary-tree-maximum-path-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },

      { "number": 99, "title": "Recover Binary Search Tree (duplicate)", "slug": "recover-binary-search-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/recover-binary-search-tree/" },
      { "number": 98, "title": "Validate Binary Search Tree (duplicate)", "slug": "validate-binary-search-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/validate-binary-search-tree/" },

    ]
  },

  {
    "id": "serialize-tree",
    "name": "Serialize Tree",
    "category": "Trees & BSTs",
    "difficulty": "advanced",
    "description": "Serialize and deserialize binary tree",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "youtubeUrl": "https://www.youtube.com/watch?v=u4JAi2JJhI8",
    "problems": [
      { "number": 297, "title": "Serialize and Deserialize Binary Tree", "slug": "serialize-and-deserialize-binary-tree", "difficulty": "Hard", "link": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },

      { "number": 449, "title": "Serialize and Deserialize BST", "slug": "serialize-and-deserialize-bst", "difficulty": "Medium", "link": "https://leetcode.com/problems/serialize-and-deserialize-bst/" },

      { "number": 173, "title": "Binary Search Tree Iterator", "slug": "binary-search-tree-iterator", "difficulty": "Medium", "link": "https://leetcode.com/problems/binary-search-tree-iterator/" },
      { "number": 95, "title": "Unique Binary Search Trees II", "slug": "unique-binary-search-trees-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/unique-binary-search-trees-ii/" },
      { "number": 96, "title": "Unique Binary Search Trees", "slug": "unique-binary-search-trees", "difficulty": "Medium", "link": "https://leetcode.com/problems/unique-binary-search-trees/" },
      { "number": 124, "title": "Binary Tree Maximum Path Sum", "slug": "binary-tree-maximum-path-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { "number": 129, "title": "Sum Root to Leaf Numbers", "slug": "sum-root-to-leaf-numbers", "difficulty": "Medium", "link": "https://leetcode.com/problems/sum-root-to-leaf-numbers/" },
      { "number": 257, "title": "Binary Tree Paths", "slug": "binary-tree-paths", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-paths/" },

    ]
  },

  {
    "id": "trie",
    "name": "Trie (Prefix Tree)",
    "category": "Trees & BSTs",
    "difficulty": "intermediate",
    "description": "Efficient string storage and retrieval",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(n*m)",
    "youtubeUrl": "https://www.youtube.com/watch?v=oobqoCJlHA0",
    "problems": [
      { "number": 208, "title": "Implement Trie (Prefix Tree)", "slug": "implement-trie-prefix-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/implement-trie-prefix-tree/" },
      { "number": 211, "title": "Design Add and Search Words Data Structure", "slug": "design-add-and-search-words-data-structure", "difficulty": "Medium", "link": "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
      { "number": 212, "title": "Word Search II", "slug": "word-search-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/word-search-ii/" },
      { "number": 720, "title": "Longest Word in Dictionary", "slug": "longest-word-in-dictionary", "difficulty": "Easy", "link": "https://leetcode.com/problems/longest-word-in-dictionary/" },
      { "number": 472, "title": "Concatenated Words", "slug": "concatenated-words", "difficulty": "Hard", "link": "https://leetcode.com/problems/concatenated-words/" },
      { "number": 642, "title": "Design Search Autocomplete System", "slug": "design-search-autocomplete-system", "difficulty": "Hard", "link": "https://leetcode.com/problems/design-search-autocomplete-system/" },
      { "number": 648, "title": "Replace Words", "slug": "replace-words", "difficulty": "Medium", "link": "https://leetcode.com/problems/replace-words/" },

    ]
  },



  // Graphs

  {
    "id": "graph-dfs",
    "name": "Graph DFS",
    "category": "Graphs",
    "difficulty": "intermediate",
    "description": "Depth-first traversal of graphs",
    "timeComplexity": "O(V+E)",
    "spaceComplexity": "O(V)",
    "problems": [
      { "number": 200, "title": "Number of Islands", "slug": "number-of-islands", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-islands/" },
      { "number": 133, "title": "Clone Graph", "slug": "clone-graph", "difficulty": "Medium", "link": "https://leetcode.com/problems/clone-graph/" },
      { "number": 797, "title": "All Paths From Source to Target", "slug": "all-paths-from-source-to-target", "difficulty": "Medium", "link": "https://leetcode.com/problems/all-paths-from-source-to-target/" },
      { "number": 841, "title": "Keys and Rooms", "slug": "keys-and-rooms", "difficulty": "Medium", "link": "https://leetcode.com/problems/keys-and-rooms/" },
      { "number": 1319, "title": "Number of Operations to Make Network Connected", "slug": "number-of-operations-to-make-network-connected", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-operations-to-make-network-connected/" },
      { "number": 403, "title": "Frog Jump", "slug": "frog-jump", "difficulty": "Hard", "link": "https://leetcode.com/problems/frog-jump/" },
      { "number": 785, "title": "Is Graph Bipartite?", "slug": "is-graph-bipartite", "difficulty": "Medium", "link": "https://leetcode.com/problems/is-graph-bipartite/" },
      { "number": 886, "title": "Possible Bipartition", "slug": "possible-bipartition", "difficulty": "Medium", "link": "https://leetcode.com/problems/possible-bipartition/" },
      { "number": 261, "title": "Graph Valid Tree", "slug": "graph-valid-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/graph-valid-tree/" },
      { "number": 207, "title": "Course Schedule", "slug": "course-schedule", "difficulty": "Medium", "link": "https://leetcode.com/problems/course-schedule/" },
      { "number": 210, "title": "Course Schedule II", "slug": "course-schedule-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/course-schedule-ii/" },
      { "number": 502, "title": "IPO", "slug": "ipo", "difficulty": "Hard", "link": "https://leetcode.com/problems/ipo/" },
      { "number": 310, "title": "Minimum Height Trees", "slug": "minimum-height-trees", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-height-trees/" },
      { "number": 997, "title": "Find the Town Judge", "slug": "find-the-town-judge", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-town-judge/" }
    ]
  },

  {
    "id": "graph-bfs",
    "name": "Graph BFS",
    "category": "Graphs",
    "difficulty": "intermediate",
    "description": "Breadth-first traversal of graphs",
    "timeComplexity": "O(V+E)",
    "spaceComplexity": "O(V)",
    "problems": [
      { "number": 102, "title": "Binary Tree Level Order Traversal", "slug": "binary-tree-level-order-traversal", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { "number": 1971, "title": "Find if Path Exists in Graph", "slug": "find-if-path-exists-in-graph", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-if-path-exists-in-graph/" },
      { "number": 133, "title": "Clone Graph", "slug": "clone-graph", "difficulty": "Medium", "link": "https://leetcode.com/problems/clone-graph/" },
      { "number": 269, "title": "Alien Dictionary", "slug": "alien-dictionary", "difficulty": "Hard", "link": "https://leetcode.com/problems/alien-dictionary/" },
      { "number": 329, "title": "Longest Increasing Path in a Matrix", "slug": "longest-increasing-path-in-a-matrix", "difficulty": "Hard", "link": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/" },
      { "number": 279, "title": "Perfect Squares", "slug": "perfect-squares", "difficulty": "Medium", "link": "https://leetcode.com/problems/perfect-squares/" },
      { "number": 1197, "title": "Minimum Knight Moves", "slug": "minimum-knight-moves", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-knight-moves/" },
      { "number": 752, "title": "Open the Lock", "slug": "open-the-lock", "difficulty": "Medium", "link": "https://leetcode.com/problems/open-the-lock/" },
      { "number": 200, "title": "Number of Islands", "slug": "number-of-islands", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-islands/" },
      { "number": 317, "title": "Shortest Distance from All Buildings", "slug": "shortest-distance-from-all-buildings", "difficulty": "Hard", "link": "https://leetcode.com/problems/shortest-distance-from-all-buildings/" },
      { "number": 909, "title": "Snakes and Ladders", "slug": "snakes-and-ladders", "difficulty": "Medium", "link": "https://leetcode.com/problems/snakes-and-ladders/" },
      { "number": 542, "title": "01 Matrix", "slug": "01-matrix", "difficulty": "Medium", "link": "https://leetcode.com/problems/01-matrix/" },
      { "number": 785, "title": "Is Graph Bipartite?", "slug": "is-graph-bipartite", "difficulty": "Medium", "link": "https://leetcode.com/problems/is-graph-bipartite/" },
      { "number": 119, "title": "Pascal's Triangle II", "slug": "pascals-triangle-ii", "difficulty": "Easy", "link": "https://leetcode.com/problems/pascals-triangle-ii/" }
    ]
  },

  {
    "id": "topological-sort",
    "name": "Topological Sort",
    "category": "Graphs",
    "difficulty": "intermediate",
    "description": "Kahn's algorithm for DAG ordering",
    "timeComplexity": "O(V+E)",
    "spaceComplexity": "O(V)",
    "youtubeUrl": "https://www.youtube.com/watch?v=EgI5nU9etnU",
    "problems": [
      { "number": 207, "title": "Course Schedule", "slug": "course-schedule", "difficulty": "Medium", "link": "https://leetcode.com/problems/course-schedule/" },
      { "number": 210, "title": "Course Schedule II", "slug": "course-schedule-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/course-schedule-ii/" },
      { "number": 269, "title": "Alien Dictionary", "slug": "alien-dictionary", "difficulty": "Hard", "link": "https://leetcode.com/problems/alien-dictionary/" },
      { "number": 1462, "title": "Course Schedule IV", "slug": "course-schedule-iv", "difficulty": "Medium", "link": "https://leetcode.com/problems/course-schedule-iv/" },
      { "number": 1190, "title": "Reverse Substrings Between Each Pair of Parentheses", "slug": "reverse-substrings-between-each-pair-of-parentheses", "difficulty": "Medium", "link": "https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses/" },
      { "number": 1203, "title": "Sort Items by Groups Respecting Dependencies", "slug": "sort-items-by-groups-respecting-dependencies", "difficulty": "Hard", "link": "https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies/" },
      { "number": 310, "title": "Minimum Height Trees", "slug": "minimum-height-trees", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-height-trees/" },
      { "number": 997, "title": "Find the Town Judge", "slug": "find-the-town-judge", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-town-judge/" }
    ]
  },

  {
    "id": "union-find",
    "name": "Union-Find",
    "category": "Graphs",
    "difficulty": "intermediate",
    "description": "Disjoint set data structure",
    "timeComplexity": "O(α(n))",
    "spaceComplexity": "O(n)",
    "youtubeUrl": "https://www.youtube.com/watch?v=8f1XPm4WOUc",
    "problems": [
      { "number": 547, "title": "Number of Provinces", "slug": "number-of-provinces", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-provinces/" },
      { "number": 990, "title": "Satisfiability of Equality Equations", "slug": "satisfiability-of-equality-equations", "difficulty": "Medium", "link": "https://leetcode.com/problems/satisfiability-of-equality-equations/" },
      { "number": 305, "title": "Number of Islands II", "slug": "number-of-islands-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/number-of-islands-ii/" },
      { "number": 684, "title": "Redundant Connection", "slug": "redundant-connection", "difficulty": "Medium", "link": "https://leetcode.com/problems/redundant-connection/" },
      { "number": 323, "title": "Number of Connected Components in an Undirected Graph", "slug": "number-of-connected-components-in-an-undirected-graph", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
      { "number": 815, "title": "Bus Routes", "slug": "bus-routes", "difficulty": "Hard", "link": "https://leetcode.com/problems/bus-routes/" },
      { "number": 130, "title": "Surrounded Regions", "slug": "surrounded-regions", "difficulty": "Medium", "link": "https://leetcode.com/problems/surrounded-regions/" },
      { "number": 1061, "title": "Lexicographically Smallest Equivalent String", "slug": "lexicographically-smallest-equivalent-string", "difficulty": "Medium", "link": "https://leetcode.com/problems/lexicographically-smallest-equivalent-string/" },

      { "number": 1192, "title": "Critical Connections in a Network", "slug": "critical-connections-in-a-network", "difficulty": "Hard", "link": "https://leetcode.com/problems/critical-connections-in-a-network/" },
      { "number": 721, "title": "Accounts Merge", "slug": "accounts-merge", "difficulty": "Medium", "link": "https://leetcode.com/problems/accounts-merge/" },
      { "number": 997, "title": "Find the Town Judge", "slug": "find-the-town-judge", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-town-judge/" }
    ]
  },

  {
    "id": "kruskals",
    "name": "Kruskal's Algorithm",
    "category": "Graphs",
    "difficulty": "advanced",
    "description": "Find minimum spanning tree",
    "timeComplexity": "O(E log E)",
    "spaceComplexity": "O(V)",
    "youtubeUrl": "https://www.youtube.com/watch?v=f7JOBJIC-NA",
    "problems": [
      { "number": 1584, "title": "Min Cost to Connect All Points", "slug": "min-cost-to-connect-all-points", "difficulty": "Medium", "link": "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
      { "number": 1168, "title": "Optimize Water Distribution in a Village", "slug": "optimize-water-distribution-in-a-village", "difficulty": "Medium", "link": "https://leetcode.com/problems/optimize-water-distribution-in-a-village/" },
      { "number": 1135, "title": "Connecting Cities With Minimum Cost", "slug": "connecting-cities-with-minimum-cost", "difficulty": "Medium", "link": "https://leetcode.com/problems/connecting-cities-with-minimum-cost/" },
      { "number": 1631, "title": "Path With Minimum Effort", "slug": "path-with-minimum-effort", "difficulty": "Medium", "link": "https://leetcode.com/problems/path-with-minimum-effort/" },
      { "number": 1585, "title": "Check If String Is Transformable With Substring Sort Operations", "slug": "check-if-string-is-transformable-with-substring-sort-operations", "difficulty": "Hard", "link": "https://leetcode.com/problems/check-if-string-is-transformable-with-substring-sort-operations/" },
      { "number": 1584, "title": "Min Cost to Connect All Points (duplicate)", "slug": "min-cost-to-connect-all-points", "difficulty": "Medium", "link": "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
      { "number": 1135, "title": "Connecting Cities With Minimum Cost (duplicate)", "slug": "connecting-cities-with-minimum-cost", "difficulty": "Medium", "link": "https://leetcode.com/problems/connecting-cities-with-minimum-cost/" },
      { "number": 1168, "title": "Optimize Water Distribution in a Village (duplicate)", "slug": "optimize-water-distribution-in-a-village", "difficulty": "Medium", "link": "https://leetcode.com/problems/optimize-water-distribution-in-a-village/" },
      { "number": 997, "title": "Find the Town Judge", "slug": "find-the-town-judge", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-town-judge/" }
    ]
  },

  {
    "id": "prims",
    "name": "Prim's Algorithm",
    "category": "Graphs",
    "difficulty": "advanced",
    "description": "Find MST using greedy approach",
    "timeComplexity": "O(E log V)",
    "spaceComplexity": "O(V)",
    "youtubeUrl": "https://www.youtube.com/watch?v=f7JOBJIC-NA",
    "problems": [
      { "number": 1584, "title": "Min Cost to Connect All Points", "slug": "min-cost-to-connect-all-points", "difficulty": "Medium", "link": "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
      { "number": 1135, "title": "Connecting Cities With Minimum Cost", "slug": "connecting-cities-with-minimum-cost", "difficulty": "Medium", "link": "https://leetcode.com/problems/connecting-cities-with-minimum-cost/" },
      { "number": 1168, "title": "Optimize Water Distribution in a Village", "slug": "optimize-water-distribution-in-a-village", "difficulty": "Medium", "link": "https://leetcode.com/problems/optimize-water-distribution-in-a-village/" },
      { "number": 1585, "title": "Check If String Is Transformable With Substring Sort Operations", "slug": "check-if-string-is-transformable-with-substring-sort-operations", "difficulty": "Hard", "link": "https://leetcode.com/problems/check-if-string-is-transformable-with-substring-sort-operations/" },
      { "number": 997, "title": "Find the Town Judge", "slug": "find-the-town-judge", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-town-judge/" },
      { "number": 1586, "title": "Stone Game VII", "slug": "stone-game-vii", "difficulty": "Medium", "link": "https://leetcode.com/problems/stone-game-vii/" },
      { "number": 113, "title": "Path Sum II", "slug": "path-sum-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/path-sum-ii/" },
      { "number": 1191, "title": "K-Concatenation Maximum Sum", "slug": "k-concatenation-maximum-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/k-concatenation-maximum-sum/" },
    ]
  },

  {
    "id": "dijkstras",
    "name": "Dijkstra's Algorithm",
    "category": "Graphs",
    "difficulty": "advanced",
    "description": "Single-source shortest path",
    "timeComplexity": "O((V+E) log V)",
    "spaceComplexity": "O(V)",
    "youtubeUrl": "https://www.youtube.com/watch?v=EaphyqKU4PQ",
    "problems": [
      { "number": 743, "title": "Network Delay Time", "slug": "network-delay-time", "difficulty": "Medium", "link": "https://leetcode.com/problems/network-delay-time/" },
      { "number": 985, "title": "Sum of Even Numbers After Queries", "slug": "sum-of-even-numbers-after-queries", "difficulty": "Easy", "link": "https://leetcode.com/problems/sum-of-even-numbers-after-queries/" },
      { "number": 1624, "title": "Largest Submatrix With Rearrangements", "slug": "largest-submatrix-with-rearrangements", "difficulty": "Medium", "link": "https://leetcode.com/problems/largest-submatrix-with-rearrangements/" },
      { "number": 787, "title": "Cheapest Flights Within K Stops", "slug": "cheapest-flights-within-k-stops", "difficulty": "Medium", "link": "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
      { "number": 743, "title": "Network Delay Time (duplicate)", "slug": "network-delay-time", "difficulty": "Medium", "link": "https://leetcode.com/problems/network-delay-time/" },
      { "number": 174, "title": "Dungeon Game", "slug": "dungeon-game", "difficulty": "Hard", "link": "https://leetcode.com/problems/dungeon-game/" },
      { "number": 1099, "title": "Two Sum Less Than K", "slug": "two-sum-less-than-k", "difficulty": "Easy", "link": "https://leetcode.com/problems/two-sum-less-than-k/" },
      { "number": 1631, "title": "Path With Minimum Effort", "slug": "path-with-minimum-effort", "difficulty": "Medium", "link": "https://leetcode.com/problems/path-with-minimum-effort/" },
      { "number": 1203, "title": "Sort Items by Groups Respecting Dependencies", "slug": "sort-items-by-groups-respecting-dependencies", "difficulty": "Hard", "link": "https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies/" },
      { "number": 401, "title": "Binary Watch", "slug": "binary-watch", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-watch/" },
      { "number": 316, "title": "Remove Duplicate Letters", "slug": "remove-duplicate-letters", "difficulty": "Hard", "link": "https://leetcode.com/problems/remove-duplicate-letters/" }
    ]
  },

  {
    "id": "bellman-ford",
    "name": "Bellman-Ford",
    "category": "Graphs",
    "difficulty": "advanced",
    "description": "Shortest path with negative weights",
    "timeComplexity": "O(VE)",
    "spaceComplexity": "O(V)",
    "youtubeUrl": "https://www.youtube.com/watch?v=5eIK3zUdYmE",
    "problems": [
      { "number": 787, "title": "Cheapest Flights Within K Stops", "slug": "cheapest-flights-within-k-stops", "difficulty": "Medium", "link": "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
      { "number": 173, "title": "Binary Search Tree Iterator", "slug": "binary-search-tree-iterator", "difficulty": "Medium", "link": "https://leetcode.com/problems/binary-search-tree-iterator/" },
      { "number": 743, "title": "Network Delay Time", "slug": "network-delay-time", "difficulty": "Medium", "link": "https://leetcode.com/problems/network-delay-time/" },
      { "number": 912, "title": "Sort an Array", "slug": "sort-an-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/sort-an-array/" },
      { "number": 1334, "title": "Find the City With the Smallest Number of Neighbors at a Threshold Distance", "slug": "find-city-with-smallest-number-of-neighbors", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/" },
      { "number": 265, "title": "Paint House II", "slug": "paint-house-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/paint-house-ii/" },
      { "number": 1203, "title": "Sort Items by Groups Respecting Dependencies", "slug": "sort-items-by-groups-respecting-dependencies", "difficulty": "Hard", "link": "https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies/" },
      { "number": 997, "title": "Find the Town Judge", "slug": "find-the-town-judge", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-town-judge/" },
      { "number": 205, "title": "Isomorphic Strings", "slug": "isomorphic-strings", "difficulty": "Easy", "link": "https://leetcode.com/problems/isomorphic-strings/" },
      { "number": 1222, "title": "Queens That Can Attack the King", "slug": "queens-that-can-attack-the-king", "difficulty": "Medium", "link": "https://leetcode.com/problems/queens-that-can-attack-the-king/" },

    ]
  },

  {
    "id": "floyd-warshall",
    "name": "Floyd-Warshall",
    "category": "Graphs",
    "difficulty": "advanced",
    "description": "All-pairs shortest paths",
    "timeComplexity": "O(V³)",
    "spaceComplexity": "O(V²)",
    "problems": [
      { "number": 1192, "title": "Critical Connections in a Network", "slug": "critical-connections-in-a-network", "difficulty": "Hard", "link": "https://leetcode.com/problems/critical-connections-in-a-network/" },
      { "number": 310, "title": "Minimum Height Trees", "slug": "minimum-height-trees", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-height-trees/" },
      { "number": 509, "title": "Fibonacci Number", "slug": "fibonacci-number", "difficulty": "Easy", "link": "https://leetcode.com/problems/fibonacci-number/" },
      { "number": 997, "title": "Find the Town Judge", "slug": "find-the-town-judge", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-town-judge/" }
    ]
  },

  {
    "id": "a-star",
    "name": "A* Search",
    "category": "Graphs",
    "difficulty": "advanced",
    "description": "Heuristic pathfinding algorithm",
    "timeComplexity": "O(b^d)",
    "spaceComplexity": "O(b^d)",
    "problems": [
      { "number": 1631, "title": "Path With Minimum Effort", "slug": "path-with-minimum-effort", "difficulty": "Medium", "link": "https://leetcode.com/problems/path-with-minimum-effort/" },
      { "number": 505, "title": "The Maze II", "slug": "the-maze-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/the-maze-ii/" },
      { "number": 490, "title": "The Maze", "slug": "the-maze", "difficulty": "Medium", "link": "https://leetcode.com/problems/the-maze/" }
    ]
  },



  // Dynamic Programming

  {
    "id": "knapsack-01",
    "name": "0/1 Knapsack",
    "category": "Dynamic Programming",
    "difficulty": "intermediate",
    "description": "Maximize value with weight constraint",
    "timeComplexity": "O(nW)",
    "spaceComplexity": "O(nW)",
    "problems": [
      { "number": 70, "title": "Climbing Stairs", "slug": "climbing-stairs", "difficulty": "Easy", "link": "https://leetcode.com/problems/climbing-stairs/" },
      { "number": 198, "title": "House Robber", "slug": "house-robber", "difficulty": "Easy", "link": "https://leetcode.com/problems/house-robber/" },
      { "number": 416, "title": "Partition Equal Subset Sum", "slug": "partition-equal-subset-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/partition-equal-subset-sum/" },
      { "number": 494, "title": "Target Sum", "slug": "target-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/target-sum/" },
      { "number": 474, "title": "Ones and Zeroes", "slug": "ones-and-zeroes", "difficulty": "Medium", "link": "https://leetcode.com/problems/ones-and-zeroes/" },
      { "number": 279, "title": "Perfect Squares", "slug": "perfect-squares", "difficulty": "Medium", "link": "https://leetcode.com/problems/perfect-squares/" },
      { "number": 1049, "title": "Last Stone Weight II", "slug": "last-stone-weight-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/last-stone-weight-ii/" },
      { "number": 879, "title": "Profitable Schemes", "slug": "profitable-schemes", "difficulty": "Hard", "link": "https://leetcode.com/problems/profitable-schemes/" },
      { "number": 231, "title": "Power of Two (helper DP practice)", "slug": "power-of-two", "difficulty": "Easy", "link": "https://leetcode.com/problems/power-of-two/" },
      { "number": 322, "title": "Coin Change", "slug": "coin-change", "difficulty": "Medium", "link": "https://leetcode.com/problems/coin-change/" },
      { "number": 518, "title": "Coin Change 2", "slug": "coin-change-2", "difficulty": "Medium", "link": "https://leetcode.com/problems/coin-change-2/" },
      { "number": 377, "title": "Combination Sum IV", "slug": "combination-sum-iv", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-iv/" },
      { "number": 1048, "title": "Longest String Chain", "slug": "longest-string-chain", "difficulty": "Hard", "link": "https://leetcode.com/problems/longest-string-chain/" }
    ]
  },

  {
    "id": "coin-change",
    "name": "Coin Change",
    "category": "Dynamic Programming",
    "difficulty": "intermediate",
    "description": "Minimum coins for target amount",
    "timeComplexity": "O(nW)",
    "spaceComplexity": "O(W)",
    "youtubeUrl": "https://www.youtube.com/watch?v=H9bfqozjoqs",
    "problems": [
      { "number": 322, "title": "Coin Change", "slug": "coin-change", "difficulty": "Medium", "link": "https://leetcode.com/problems/coin-change/" },
      { "number": 518, "title": "Coin Change 2", "slug": "coin-change-2", "difficulty": "Medium", "link": "https://leetcode.com/problems/coin-change-2/" },
      { "number": 377, "title": "Combination Sum IV", "slug": "combination-sum-iv", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-iv/" },
      { "number": 138, "title": "Copy List with Random Pointer (helper non-DP easy)", "slug": "copy-list-with-random-pointer", "difficulty": "Medium", "link": "https://leetcode.com/problems/copy-list-with-random-pointer/" },
      { "number": 139, "title": "Word Break", "slug": "word-break", "difficulty": "Medium", "link": "https://leetcode.com/problems/word-break/" },
      { "number": 140, "title": "Word Break II", "slug": "word-break-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/word-break-ii/" },
      { "number": 70, "title": "Climbing Stairs", "slug": "climbing-stairs", "difficulty": "Easy", "link": "https://leetcode.com/problems/climbing-stairs/" },
      { "number": 746, "title": "Min Cost Climbing Stairs", "slug": "min-cost-climbing-stairs", "difficulty": "Easy", "link": "https://leetcode.com/problems/min-cost-climbing-stairs/" },
      { "number": 279, "title": "Perfect Squares", "slug": "perfect-squares", "difficulty": "Medium", "link": "https://leetcode.com/problems/perfect-squares/" },
      { "number": 174, "title": "Dungeon Game", "slug": "dungeon-game", "difficulty": "Hard", "link": "https://leetcode.com/problems/dungeon-game/" }
    ]
  },

  {
    "id": "lcs",
    "name": "Longest Common Subsequence",
    "category": "Dynamic Programming",
    "difficulty": "intermediate",
    "description": "Find longest common subsequence",
    "timeComplexity": "O(mn)",
    "spaceComplexity": "O(mn)",
    "youtubeUrl": "https://www.youtube.com/watch?v=Ua0GhsJSlWM",
    "problems": [
      { "number": 1143, "title": "Longest Common Subsequence", "slug": "longest-common-subsequence", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-common-subsequence/" },
      { "number": 97, "title": "Interleaving String", "slug": "interleaving-string", "difficulty": "Hard", "link": "https://leetcode.com/problems/interleaving-string/" },
      { "number": 72, "title": "Edit Distance", "slug": "edit-distance", "difficulty": "Hard", "link": "https://leetcode.com/problems/edit-distance/" },
      { "number": 1092, "title": "Shortest Common Supersequence (related concept)", "slug": "shortest-common-supersequence", "difficulty": "Hard", "link": "https://leetcode.com/problems/shortest-common-supersequence/" },
      { "number": 583, "title": "Delete Operation for Two Strings", "slug": "delete-operation-for-two-strings", "difficulty": "Medium", "link": "https://leetcode.com/problems/delete-operation-for-two-strings/" },
      { "number": 712, "title": "Minimum ASCII Delete Sum for Two Strings", "slug": "minimum-ascii-delete-sum-for-two-strings", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/" },
      { "number": 97, "title": "Interleaving String (duplicate)", "slug": "interleaving-string", "difficulty": "Hard", "link": "https://leetcode.com/problems/interleaving-string/" },
      { "number": 392, "title": "Is Subsequence", "slug": "is-subsequence", "difficulty": "Easy", "link": "https://leetcode.com/problems/is-subsequence/" },
      { "number": 718, "title": "Maximum Length of Repeated Subarray", "slug": "maximum-length-of-repeated-subarray", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-length-of-repeated-subarray/" },
      { "number": 115, "title": "Distinct Subsequences", "slug": "distinct-subsequences", "difficulty": "Hard", "link": "https://leetcode.com/problems/distinct-subsequences/" }
    ]
  },

  {
    "id": "lis",
    "name": "Longest Increasing Subsequence",
    "category": "Dynamic Programming",
    "difficulty": "intermediate",
    "description": "Find LIS in array",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "youtubeUrl": "https://www.youtube.com/watch?v=cjWnW0hdF1Y",
    "problems": [
      { "number": 300, "title": "Longest Increasing Subsequence", "slug": "longest-increasing-subsequence", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-increasing-subsequence/" },
      { "number": 673, "title": "Number of Longest Increasing Subsequence", "slug": "number-of-longest-increasing-subsequence", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-longest-increasing-subsequence/" },
      { "number": 354, "title": "Russian Doll Envelopes", "slug": "russian-doll-envelopes", "difficulty": "Hard", "link": "https://leetcode.com/problems/russian-doll-envelopes/" },
      { "number": 327, "title": "Count of Range Sum", "slug": "count-of-range-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/count-of-range-sum/" },
      { "number": 368, "title": "Largest Divisible Subset", "slug": "largest-divisible-subset", "difficulty": "Medium", "link": "https://leetcode.com/problems/largest-divisible-subset/" },
      { "number": 646, "title": "Maximum Length of Pair Chain", "slug": "maximum-length-of-pair-chain", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-length-of-pair-chain/" },
      { "number": 53, "title": "Maximum Subarray", "slug": "maximum-subarray", "difficulty": "Easy", "link": "https://leetcode.com/problems/maximum-subarray/" }
    ]
  },

  {
    "id": "edit-distance",
    "name": "Edit Distance",
    "category": "Dynamic Programming",
    "difficulty": "advanced",
    "description": "Minimum edits to transform strings",
    "timeComplexity": "O(mn)",
    "spaceComplexity": "O(mn)",
    "youtubeUrl": "https://www.youtube.com/watch?v=XYi2-LPrwm4",
    "problems": [
      { "number": 72, "title": "Edit Distance", "slug": "edit-distance", "difficulty": "Hard", "link": "https://leetcode.com/problems/edit-distance/" },
      { "number": 583, "title": "Delete Operation for Two Strings", "slug": "delete-operation-for-two-strings", "difficulty": "Medium", "link": "https://leetcode.com/problems/delete-operation-for-two-strings/" },
      { "number": 712, "title": "Minimum ASCII Delete Sum for Two Strings", "slug": "minimum-ascii-delete-sum-for-two-strings", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/" },
      { "number": 115, "title": "Distinct Subsequences", "slug": "distinct-subsequences", "difficulty": "Hard", "link": "https://leetcode.com/problems/distinct-subsequences/" },
      { "number": 1143, "title": "Longest Common Subsequence", "slug": "longest-common-subsequence", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-common-subsequence/" },
      { "number": 72, "title": "Edit Distance (duplicate)", "slug": "edit-distance", "difficulty": "Hard", "link": "https://leetcode.com/problems/edit-distance/" },
      { "number": 392, "title": "Is Subsequence", "slug": "is-subsequence", "difficulty": "Easy", "link": "https://leetcode.com/problems/is-subsequence/" },
      { "number": 72, "title": "Edit Distance (third)", "slug": "edit-distance", "difficulty": "Hard", "link": "https://leetcode.com/problems/edit-distance/" },
      { "number": 150, "title": "Evaluate Reverse Polish Notation", "slug": "evaluate-reverse-polish-notation", "difficulty": "Medium", "link": "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
      { "number": 1499, "title": "Max Value of Equation", "slug": "max-value-of-equation", "difficulty": "Medium", "link": "https://leetcode.com/problems/max-value-of-equation/" },
    ]
  },

  {
    "id": "matrix-path-dp",
    "name": "Matrix Path DP",
    "category": "Dynamic Programming",
    "difficulty": "intermediate",
    "description": "Find unique or minimum paths in matrix",
    "timeComplexity": "O(mn)",
    "spaceComplexity": "O(mn)",
    "youtubeUrl": "https://www.youtube.com/watch?v=IlEsdxuD4lY",
    "problems": [
      { "number": 62, "title": "Unique Paths", "slug": "unique-paths", "difficulty": "Medium", "link": "https://leetcode.com/problems/unique-paths/" },
      { "number": 63, "title": "Unique Paths II", "slug": "unique-paths-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/unique-paths-ii/" },
      { "number": 64, "title": "Minimum Path Sum", "slug": "minimum-path-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-path-sum/" },
      { "number": 120, "title": "Triangle", "slug": "triangle", "difficulty": "Medium", "link": "https://leetcode.com/problems/triangle/" },
      { "number": 329, "title": "Longest Increasing Path in a Matrix", "slug": "longest-increasing-path-in-a-matrix", "difficulty": "Hard", "link": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/" },
      { "number": 521, "title": "Longest Uncommon Subsequence I", "slug": "longest-uncommon-subsequence-i", "difficulty": "Easy", "link": "https://leetcode.com/problems/longest-uncommon-subsequence-i/" },
      { "number": 931, "title": "Minimum Falling Path Sum", "slug": "minimum-falling-path-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-falling-path-sum/" },
      { "number": 64, "title": "Minimum Path Sum (duplicate)", "slug": "minimum-path-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-path-sum/" },
      { "number": 980, "title": "Unique Paths III", "slug": "unique-paths-iii", "difficulty": "Hard", "link": "https://leetcode.com/problems/unique-paths-iii/" },
      { "number": 361, "title": "Bomb Enemy", "slug": "bomb-enemy", "difficulty": "Medium", "link": "https://leetcode.com/problems/bomb-enemy/" },
      { "number": 221, "title": "Maximal Square", "slug": "maximal-square", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximal-square/" },
      { "number": 64, "title": "Minimum Path Sum (third)", "slug": "minimum-path-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-path-sum/" },
    ]
  },

  {
    "id": "partition-equal-subset",
    "name": "Partition Equal Subset",
    "category": "Dynamic Programming",
    "difficulty": "intermediate",
    "description": "Check if array can be partitioned equally",
    "timeComplexity": "O(n*sum)",
    "spaceComplexity": "O(sum)",
    "youtubeUrl": "https://www.youtube.com/watch?v=IsvocB5BJhw",
    "problems": [
      { "number": 416, "title": "Partition Equal Subset Sum", "slug": "partition-equal-subset-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/partition-equal-subset-sum/" },
      { "number": 494, "title": "Target Sum", "slug": "target-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/target-sum/" },
      { "number": 198, "title": "House Robber", "slug": "house-robber", "difficulty": "Easy", "link": "https://leetcode.com/problems/house-robber/" },
      { "number": 474, "title": "Ones and Zeroes", "slug": "ones-and-zeroes", "difficulty": "Medium", "link": "https://leetcode.com/problems/ones-and-zeroes/" },
      { "number": 1049, "title": "Last Stone Weight II", "slug": "last-stone-weight-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/last-stone-weight-ii/" },
      { "number": 518, "title": "Coin Change 2", "slug": "coin-change-2", "difficulty": "Medium", "link": "https://leetcode.com/problems/coin-change-2/" },
      { "number": 712, "title": "Minimum ASCII Delete Sum for Two Strings", "slug": "minimum-ascii-delete-sum-for-two-strings", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/" },
      { "number": 377, "title": "Combination Sum IV", "slug": "combination-sum-iv", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-iv/" }
    ]
  },

  {
    "id": "house-robber",
    "name": "House Robber",
    "category": "Dynamic Programming",
    "difficulty": "intermediate",
    "description": "Maximum sum without adjacent elements",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=73r3KWiEvyk",
    "problems": [
      { "number": 198, "title": "House Robber", "slug": "house-robber", "difficulty": "Easy", "link": "https://leetcode.com/problems/house-robber/" },
      { "number": 213, "title": "House Robber II", "slug": "house-robber-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/house-robber-ii/" },
      { "number": 337, "title": "House Robber III", "slug": "house-robber-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/house-robber-iii/" },
      { "number": 740, "title": "Delete and Earn", "slug": "delete-and-earn", "difficulty": "Medium", "link": "https://leetcode.com/problems/delete-and-earn/" },
      { "number": 256, "title": "Paint House", "slug": "paint-house", "difficulty": "Easy", "link": "https://leetcode.com/problems/paint-house/" },
      { "number": 265, "title": "Paint House II", "slug": "paint-house-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/paint-house-ii/" },
      { "number": 300, "title": "Longest Increasing Subsequence (related)", "slug": "longest-increasing-subsequence", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-increasing-subsequence/" }
    ]
  },

  {
    "id": "climbing-stairs",
    "name": "Climbing Stairs",
    "category": "Dynamic Programming",
    "difficulty": "beginner",
    "description": "Count ways to climb n stairs",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y0lT9Fck7qI",
    "problems": [
      { "number": 70, "title": "Climbing Stairs", "slug": "climbing-stairs", "difficulty": "Easy", "link": "https://leetcode.com/problems/climbing-stairs/" },
      { "number": 746, "title": "Min Cost Climbing Stairs", "slug": "min-cost-climbing-stairs", "difficulty": "Easy", "link": "https://leetcode.com/problems/min-cost-climbing-stairs/" },
      { "number": 509, "title": "Fibonacci Number", "slug": "fibonacci-number", "difficulty": "Easy", "link": "https://leetcode.com/problems/fibonacci-number/" },
      { "number": 70, "title": "Climbing Stairs (variant)", "slug": "climbing-stairs-variant", "difficulty": "Easy", "link": "https://leetcode.com/problems/climbing-stairs/" },
      { "number": 300, "title": "Longest Increasing Subsequence", "slug": "longest-increasing-subsequence", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-increasing-subsequence/" },
      { "number": 198, "title": "House Robber (related)", "slug": "house-robber", "difficulty": "Easy", "link": "https://leetcode.com/problems/house-robber/" },
    ]
  },

  {
    "id": "word-break",
    "name": "Word Break",
    "category": "Dynamic Programming",
    "difficulty": "intermediate",
    "description": "Segment string into dictionary words",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(n)",
    "youtubeUrl": "https://www.youtube.com/watch?v=Sx9NNgInc3A",
    "problems": [
      { "number": 139, "title": "Word Break", "slug": "word-break", "difficulty": "Medium", "link": "https://leetcode.com/problems/word-break/" },
      { "number": 140, "title": "Word Break II", "slug": "word-break-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/word-break-ii/" },
      { "number": 472, "title": "Concatenated Words", "slug": "concatenated-words", "difficulty": "Hard", "link": "https://leetcode.com/problems/concatenated-words/" },
      { "number": 648, "title": "Replace Words", "slug": "replace-words", "difficulty": "Medium", "link": "https://leetcode.com/problems/replace-words/" },
      { "number": 341, "title": "Flatten Nested List Iterator", "slug": "flatten-nested-list-iterator", "difficulty": "Medium", "link": "https://leetcode.com/problems/flatten-nested-list-iterator/" },
      { "number": 72, "title": "Edit Distance (related)", "slug": "edit-distance", "difficulty": "Hard", "link": "https://leetcode.com/problems/edit-distance/" },
    ]
  },

  // Greedy

  {
    "id": "activity-selection",
    "name": "Activity Selection",
    "category": "Greedy",
    "difficulty": "intermediate",
    "description": "Select maximum non-overlapping activities",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=nONCGxWoUfM",
    "problems": [
      { "number": 252, "title": "Meeting Rooms", "slug": "meeting-rooms", "difficulty": "Easy", "link": "https://leetcode.com/problems/meeting-rooms/" },
      { "number": 455, "title": "Assign Cookies", "slug": "assign-cookies", "difficulty": "Easy", "link": "https://leetcode.com/problems/assign-cookies/" },
      { "number": 435, "title": "Non-overlapping Intervals", "slug": "non-overlapping-intervals", "difficulty": "Medium", "link": "https://leetcode.com/problems/non-overlapping-intervals/" },
      { "number": 452, "title": "Minimum Number of Arrows to Burst Balloons", "slug": "minimum-number-of-arrows-to-burst-balloons", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },
      { "number": 1353, "title": "Maximum Number of Events That Can Be Attended", "slug": "maximum-number-of-events-that-can-be-attended", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/" },
      { "number": 253, "title": "Meeting Rooms II", "slug": "meeting-rooms-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/meeting-rooms-ii/" },
      { "number": 628, "title": "Maximum Product of Three Numbers", "slug": "maximum-product-of-three-numbers", "difficulty": "Easy", "link": "https://leetcode.com/problems/maximum-product-of-three-numbers/" },
      { "number": 532, "title": "K-diff Pairs in an Array", "slug": "k-diff-pairs-in-an-array", "difficulty": "Easy", "link": "https://leetcode.com/problems/k-diff-pairs-in-an-array/" },
      { "number": 630, "title": "Course Schedule III", "slug": "course-schedule-iii", "difficulty": "Hard", "link": "https://leetcode.com/problems/course-schedule-iii/" },
      { "number": 2099, "title": "Find Subarray With Given XOR (related greedy/interval practice)", "slug": "find-subarray-with-given-xor", "difficulty": "Medium", "link": "https://leetcode.com/problems/" },
      { "number": 1024, "title": "Video Stitching", "slug": "video-stitching", "difficulty": "Medium", "link": "https://leetcode.com/problems/video-stitching/" },
      { "number": 1354, "title": "Construct Target Array With Multiple Sums (hard greediness practice)", "slug": "construct-target-array-with-multiple-sums", "difficulty": "Hard", "link": "https://leetcode.com/problems/construct-target-array-with-multiple-sums/" },

    ]
  },

  {
    "id": "interval-scheduling",
    "name": "Interval Scheduling",
    "category": "Greedy",
    "difficulty": "intermediate",
    "description": "Schedule intervals optimally",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=nONCGxWoUfM",
    "problems": [
      { "number": 435, "title": "Non-overlapping Intervals", "slug": "non-overlapping-intervals", "difficulty": "Medium", "link": "https://leetcode.com/problems/non-overlapping-intervals/" },
      { "number": 452, "title": "Minimum Number of Arrows to Burst Balloons", "slug": "minimum-number-of-arrows-to-burst-balloons", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },
      { "number": 253, "title": "Meeting Rooms II", "slug": "meeting-rooms-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/meeting-rooms-ii/" },
      { "number": 252, "title": "Meeting Rooms", "slug": "meeting-rooms", "difficulty": "Easy", "link": "https://leetcode.com/problems/meeting-rooms/" },
      { "number": 1024, "title": "Video Stitching", "slug": "video-stitching", "difficulty": "Medium", "link": "https://leetcode.com/problems/video-stitching/" },
      { "number": 1094, "title": "Car Pooling", "slug": "car-pooling", "difficulty": "Medium", "link": "https://leetcode.com/problems/car-pooling/" },
      { "number": 1353, "title": "Maximum Number of Events That Can Be Attended", "slug": "maximum-number-of-events-that-can-be-attended", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/" },
      { "number": 1235, "title": "Maximum Profit in Job Scheduling", "slug": "maximum-profit-in-job-scheduling", "difficulty": "Hard", "link": "https://leetcode.com/problems/maximum-profit-in-job-scheduling/" },
      { "number": 4352, "title": "Erase Overlap Intervals (variant) (duplicate)", "slug": "erase-overlap-intervals-variant", "difficulty": "Medium", "link": "https://leetcode.com/problems/non-overlapping-intervals/" },
      { "number": 455, "title": "Assign Cookies", "slug": "assign-cookies", "difficulty": "Easy", "link": "https://leetcode.com/problems/assign-cookies/" }
    ]
  },

  {
    "id": "huffman-encoding",
    "name": "Huffman Encoding",
    "category": "Greedy",
    "difficulty": "advanced",
    "description": "Optimal prefix-free encoding",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "problems": [
      { "number": 347, "title": "Top K Frequent Elements", "slug": "top-k-frequent-elements", "difficulty": "Medium", "link": "https://leetcode.com/problems/top-k-frequent-elements/" },
      { "number": 451, "title": "Sort Characters By Frequency", "slug": "sort-characters-by-frequency", "difficulty": "Medium", "link": "https://leetcode.com/problems/sort-characters-by-frequency/" },
      { "number": 767, "title": "Reorganize String", "slug": "reorganize-string", "difficulty": "Medium", "link": "https://leetcode.com/problems/reorganize-string/" },
      { "number": 264, "title": "Ugly Number II", "slug": "ugly-number-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/ugly-number-ii/" },
      { "number": 659, "title": "Split Array into Consecutive Subsequences", "slug": "split-array-into-consecutive-subsequences", "difficulty": "Medium", "link": "https://leetcode.com/problems/split-array-into-consecutive-subsequences/" },

      { "number": 815, "title": "Bus Routes", "slug": "bus-routes", "difficulty": "Hard", "link": "https://leetcode.com/problems/bus-routes/" },
    ]
  },

  {
    "id": "gas-station",
    "name": "Gas Station",
    "category": "Greedy",
    "difficulty": "intermediate",
    "description": "Find starting station for circular tour",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=lJwbPZGo05A",
    "problems": [
      { "number": 134, "title": "Gas Station", "slug": "gas-station", "difficulty": "Medium", "link": "https://leetcode.com/problems/gas-station/" },
      { "number": 665, "title": "Non-decreasing Array", "slug": "non-decreasing-array", "difficulty": "Easy", "link": "https://leetcode.com/problems/non-decreasing-array/" },
      { "number": 121, "title": "Best Time to Buy and Sell Stock", "slug": "best-time-to-buy-and-sell-stock", "difficulty": "Easy", "link": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { "number": 122, "title": "Best Time to Buy and Sell Stock II", "slug": "best-time-to-buy-and-sell-stock-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/" },
      { "number": 871, "title": "Minimum Number of Refueling Stops", "slug": "minimum-number-of-refueling-stops", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-number-of-refueling-stops/" },
      { "number": 1353, "title": "Maximum Number of Events That Can Be Attended", "slug": "maximum-number-of-events-that-can-be-attended", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/" },
      { "number": 452, "title": "Minimum Number of Arrows to Burst Balloons", "slug": "minimum-number-of-arrows-to-burst-balloons", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },
      { "number": 1342, "title": "Number of Steps to Reduce a Number to Zero (auxiliary)", "slug": "number-of-steps-to-reduce-a-number-to-zero", "difficulty": "Easy", "link": "https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero/" },
      { "number": 1343, "title": "Number of Sub-arrays of Size K and Average at Least Threshold (auxiliary)", "slug": "num-subarrays-size-k-average-at-least-threshold", "difficulty": "Easy", "link": "https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-at-least-threshold/" },
    ]
  },

  // Backtracking

  {
    "id": "subsets",
    "name": "Subsets",
    "category": "Backtracking",
    "difficulty": "intermediate",
    "description": "Generate all subsets of a set",
    "timeComplexity": "O(2^n)",
    "spaceComplexity": "O(n)",
    "youtubeUrl": "https://www.youtube.com/playlist?list=PLot-Xpze53lf5C3HSjCnyFghlW0G1HHXo",
    "problems": [
      { "number": 78, "title": "Subsets", "slug": "subsets", "difficulty": "Medium", "link": "https://leetcode.com/problems/subsets/" },
      { "number": 90, "title": "Subsets II", "slug": "subsets-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/subsets-ii/" },
      { "number": 17, "title": "Letter Combinations of a Phone Number", "slug": "letter-combinations-of-a-phone-number", "difficulty": "Medium", "link": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
      { "number": 784, "title": "Letter Case Permutation", "slug": "letter-case-permutation", "difficulty": "Medium", "link": "https://leetcode.com/problems/letter-case-permutation/" },
      { "number": 401, "title": "Binary Watch", "slug": "binary-watch", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-watch/" },
      { "number": 131, "title": "Palindrome Partitioning", "slug": "palindrome-partitioning", "difficulty": "Medium", "link": "https://leetcode.com/problems/palindrome-partitioning/" },
      { "number": 22, "title": "Generate Parentheses", "slug": "generate-parentheses", "difficulty": "Medium", "link": "https://leetcode.com/problems/generate-parentheses/" },
      { "number": 77, "title": "Combinations", "slug": "combinations", "difficulty": "Medium", "link": "https://leetcode.com/problems/combinations/" },
      { "number": 491, "title": "Increasing Subsequences", "slug": "increasing-subsequences", "difficulty": "Medium", "link": "https://leetcode.com/problems/increasing-subsequences/" },
      { "number": 78, "title": "Subsets (iterative variants / practice)", "slug": "subsets", "difficulty": "Medium", "link": "https://leetcode.com/problems/subsets/" },
      { "number": 526, "title": "Beautiful Arrangement", "slug": "beautiful-arrangement", "difficulty": "Medium", "link": "https://leetcode.com/problems/beautiful-arrangement/" },
      { "number": 216, "title": "Combination Sum III", "slug": "combination-sum-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-iii/" },
    ]
  },

  {
    "id": "permutations",
    "name": "Permutations",
    "category": "Backtracking",
    "difficulty": "intermediate",
    "description": "Generate all permutations",
    "timeComplexity": "O(n!)",
    "spaceComplexity": "O(n)",
    "youtubeUrl": "https://www.youtube.com/watch?v=s7AvT7cGdSo",
    "problems": [
      { "number": 46, "title": "Permutations", "slug": "permutations", "difficulty": "Medium", "link": "https://leetcode.com/problems/permutations/" },
      { "number": 47, "title": "Permutations II", "slug": "permutations-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/permutations-ii/" },
      { "number": 31, "title": "Next Permutation", "slug": "next-permutation", "difficulty": "Medium", "link": "https://leetcode.com/problems/next-permutation/" },
      { "number": 60, "title": "Permutation Sequence", "slug": "permutation-sequence", "difficulty": "Medium", "link": "https://leetcode.com/problems/permutation-sequence/" },
      { "number": 254, "title": "Factor Combinations", "slug": "factor-combinations", "difficulty": "Medium", "link": "https://leetcode.com/problems/factor-combinations/" },
      { "number": 22, "title": "Generate Parentheses", "slug": "generate-parentheses", "difficulty": "Medium", "link": "https://leetcode.com/problems/generate-parentheses/" },
      { "number": 46, "title": "Permutations (recursive & iterative practice)", "slug": "permutations", "difficulty": "Medium", "link": "https://leetcode.com/problems/permutations/" },
      { "number": 1247, "title": "Minimum Swaps to Make Strings Equal", "slug": "minimum-swaps-to-make-strings-equal", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-swaps-to-make-strings-equal/" },
      { "number": 336, "title": "Palindrome Pairs", "slug": "palindrome-pairs", "difficulty": "Hard", "link": "https://leetcode.com/problems/palindrome-pairs/" },
      { "number": 31, "title": "Next Permutation (practice)", "slug": "next-permutation", "difficulty": "Medium", "link": "https://leetcode.com/problems/next-permutation/" },
      { "number": 140, "title": "Word Break II", "slug": "word-break-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/word-break-ii/" },
      { "number": 1086, "title": "High Five (related grouping / ordering practice)", "slug": "high-five", "difficulty": "Easy", "link": "https://leetcode.com/problems/high-five/" },
    ]
  },

  {
    "id": "combinations",
    "name": "Combinations",
    "category": "Backtracking",
    "difficulty": "intermediate",
    "description": "Generate all k-combinations",
    "timeComplexity": "O(C(n,k))",
    "spaceComplexity": "O(k)",
    "youtubeUrl": "https://www.youtube.com/watch?v=q0s6m7AiM7o",
    "problems": [
      { "number": 77, "title": "Combinations", "slug": "combinations", "difficulty": "Medium", "link": "https://leetcode.com/problems/combinations/" },
      { "number": 39, "title": "Combination Sum", "slug": "combination-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum/" },
      { "number": 40, "title": "Combination Sum II", "slug": "combination-sum-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-ii/" },
      { "number": 216, "title": "Combination Sum III", "slug": "combination-sum-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-iii/" },
      { "number": 377, "title": "Combination Sum IV", "slug": "combination-sum-iv", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-iv/" },
      { "number": 698, "title": "Partition to K Equal Sum Subsets", "slug": "partition-to-k-equal-sum-subsets", "difficulty": "Medium", "link": "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/" },
      { "number": 216, "title": "Combination Sum III (practice duplicate)", "slug": "combination-sum-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-iii/" },
      { "number": 59, "title": "Spiral Matrix II", "slug": "spiral-matrix-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/spiral-matrix-ii/" },
      { "number": 15, "title": "3Sum", "slug": "3sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/3sum/" },
      { "number": 77, "title": "Combinations (practice easy variant)", "slug": "combinations", "difficulty": "Easy", "link": "https://leetcode.com/problems/combinations/" },
      { "number": 40, "title": "Combination Sum II (practice)", "slug": "combination-sum-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-ii/" },
    ]
  },

  {
    "id": "combination-sum",
    "name": "Combination Sum",
    "category": "Backtracking",
    "difficulty": "intermediate",
    "description": "Find combinations summing to target",
    "timeComplexity": "O(2^n)",
    "spaceComplexity": "O(target)",
    "youtubeUrl": "https://www.youtube.com/watch?v=GBKI9VSKdGg",
    "problems": [
      { "number": 39, "title": "Combination Sum", "slug": "combination-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum/" },
      { "number": 40, "title": "Combination Sum II", "slug": "combination-sum-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-ii/" },
      { "number": 216, "title": "Combination Sum III", "slug": "combination-sum-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-iii/" },
      { "number": 377, "title": "Combination Sum IV", "slug": "combination-sum-iv", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-iv/" },
      { "number": 494, "title": "Target Sum", "slug": "target-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/target-sum/" },
      { "number": 698, "title": "Partition to K Equal Sum Subsets", "slug": "partition-to-k-equal-sum-subsets", "difficulty": "Medium", "link": "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/" },
      { "number": 216, "title": "Combination Sum III (duplicate practice)", "slug": "combination-sum-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum-iii/" },
      { "number": 39, "title": "Combination Sum (recursive practice)", "slug": "combination-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum/" },
      { "number": 39, "title": "Combination Sum (iterative/backtracking comparison)", "slug": "combination-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/combination-sum/" },

    ]
  },

  {
    "id": "word-search-grid",
    "name": "Word Search",
    "category": "Backtracking",
    "difficulty": "intermediate",
    "description": "Find word in 2D grid",
    "timeComplexity": "O(m*n*4^L)",
    "spaceComplexity": "O(L)",
    "youtubeUrl": "https://www.youtube.com/watch?v=pfiQ_PS1g8E",
    "problems": [
      { "number": 79, "title": "Word Search", "slug": "word-search", "difficulty": "Medium", "link": "https://leetcode.com/problems/word-search/" },
      { "number": 212, "title": "Word Search II", "slug": "word-search-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/word-search-ii/" },
      { "number": 37, "title": "Sudoku Solver", "slug": "sudoku-solver", "difficulty": "Hard", "link": "https://leetcode.com/problems/sudoku-solver/" },
      { "number": 130, "title": "Surrounded Regions", "slug": "surrounded-regions", "difficulty": "Medium", "link": "https://leetcode.com/problems/surrounded-regions/" },
      { "number": 463, "title": "Island Perimeter", "slug": "island-perimeter", "difficulty": "Easy", "link": "https://leetcode.com/problems/island-perimeter/" },
      { "number": 200, "title": "Number of Islands", "slug": "number-of-islands", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-islands/" },
      { "number": 733, "title": "Flood Fill", "slug": "flood-fill", "difficulty": "Easy", "link": "https://leetcode.com/problems/flood-fill/" },
      { "number": 847, "title": "Shortest Path Visiting All Nodes", "slug": "shortest-path-visiting-all-nodes", "difficulty": "Hard", "link": "https://leetcode.com/problems/shortest-path-visiting-all-nodes/" },
      { "number": 827, "title": "Making A Large Island", "slug": "making-a-large-island", "difficulty": "Hard", "link": "https://leetcode.com/problems/making-a-large-island/" },
      { "number": 79, "title": "Word Search (practice variation)", "slug": "word-search", "difficulty": "Medium", "link": "https://leetcode.com/problems/word-search/" },
      { "number": 50, "title": "Pow(x, n) (auxiliary recursive practice)", "slug": "powx-n", "difficulty": "Medium", "link": "https://leetcode.com/problems/powx-n/" },
    ]
  },

  {
    "id": "n-queens",
    "name": "N-Queens",
    "category": "Backtracking",
    "difficulty": "advanced",
    "description": "Place N queens on N×N board",
    "timeComplexity": "O(N!)",
    "spaceComplexity": "O(N)",
    "youtubeUrl": "https://www.youtube.com/watch?v=Ph95IHmRp5M",
    "problems": [
      { "number": 51, "title": "N-Queens", "slug": "n-queens", "difficulty": "Hard", "link": "https://leetcode.com/problems/n-queens/" },
      { "number": 52, "title": "N-Queens II", "slug": "n-queens-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/n-queens-ii/" },
      { "number": 37, "title": "Sudoku Solver", "slug": "sudoku-solver", "difficulty": "Hard", "link": "https://leetcode.com/problems/sudoku-solver/" },
      { "number": 37, "title": "Sudoku Solver (related constraints backtracking)", "slug": "sudoku-solver", "difficulty": "Hard", "link": "https://leetcode.com/problems/sudoku-solver/" },
      { "number": 241, "title": "Different Ways to Add Parentheses", "slug": "different-ways-to-add-parentheses", "difficulty": "Medium", "link": "https://leetcode.com/problems/different-ways-to-add-parentheses/" },
      { "number": 371, "title": "Sum of Two Integers (auxiliary)", "slug": "sum-of-two-integers", "difficulty": "Easy", "link": "https://leetcode.com/problems/sum-of-two-integers/" },
      { "number": 51, "title": "N-Queens (practice duplicate)", "slug": "n-queens", "difficulty": "Hard", "link": "https://leetcode.com/problems/n-queens/" },
      { "number": 247, "title": "Strobogrammatic Number II", "slug": "strobogrammatic-number-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/strobogrammatic-number-ii/" },
    ]
  },

  {
    "id": "sudoku-solver",
    "name": "Sudoku Solver",
    "category": "Backtracking",
    "difficulty": "advanced",
    "description": "Solve Sudoku puzzle",
    "timeComplexity": "O(9^(n*n))",
    "spaceComplexity": "O(n*n)",
    "youtubeUrl": "https://www.youtube.com/watch?v=TV_UepFKHMU",
    "problems": [
      { "number": 37, "title": "Sudoku Solver", "slug": "sudoku-solver", "difficulty": "Hard", "link": "https://leetcode.com/problems/sudoku-solver/" },
      { "number": 36, "title": "Valid Sudoku", "slug": "valid-sudoku", "difficulty": "Medium", "link": "https://leetcode.com/problems/valid-sudoku/" },
      { "number": 221, "title": "Maximal Square", "slug": "maximal-square", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximal-square/" },
      { "number": 130, "title": "Surrounded Regions", "slug": "surrounded-regions", "difficulty": "Medium", "link": "https://leetcode.com/problems/surrounded-regions/" },
      { "number": 289, "title": "Game of Life", "slug": "game-of-life", "difficulty": "Medium", "link": "https://leetcode.com/problems/game-of-life/" },
      { "number": 463, "title": "Island Perimeter", "slug": "island-perimeter", "difficulty": "Easy", "link": "https://leetcode.com/problems/island-perimeter/" },
      { "number": 37, "title": "Sudoku Solver (practice duplicate)", "slug": "sudoku-solver", "difficulty": "Hard", "link": "https://leetcode.com/problems/sudoku-solver/" },
      { "number": 37, "title": "Sudoku variations (conceptual practice)", "slug": "sudoku-solver", "difficulty": "Hard", "link": "https://leetcode.com/problems/sudoku-solver/" },
      { "number": 51, "title": "N-Queens (related constraint-satisfaction)", "slug": "n-queens", "difficulty": "Hard", "link": "https://leetcode.com/problems/n-queens/" },
      { "number": 980, "title": "Unique Paths III", "slug": "unique-paths-iii", "difficulty": "Hard", "link": "https://leetcode.com/problems/unique-paths-iii/" },
      { "number": 286, "title": "Walls and Gates", "slug": "walls-and-gates", "difficulty": "Medium", "link": "https://leetcode.com/problems/walls-and-gates/" },
    ]
  },

  // Bit Manipulation


  {
    "id": "xor-trick",
    "name": "XOR Trick",
    "category": "Bit Manipulation",
    "difficulty": "intermediate",
    "description": "Find single number using XOR",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=qMPX1AOa83k",
    "problems": [
      { "number": 136, "title": "Single Number", "slug": "single-number", "difficulty": "Easy", "link": "https://leetcode.com/problems/single-number/" },
      { "number": 137, "title": "Single Number II", "slug": "single-number-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/single-number-ii/" },
      { "number": 260, "title": "Single Number III", "slug": "single-number-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/single-number-iii/" },
      { "number": 268, "title": "Missing Number", "slug": "missing-number", "difficulty": "Easy", "link": "https://leetcode.com/problems/missing-number/" },
      { "number": 389, "title": "Find the Difference", "slug": "find-the-difference", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-difference/" },
      { "number": 461, "title": "Hamming Distance", "slug": "hamming-distance", "difficulty": "Easy", "link": "https://leetcode.com/problems/hamming-distance/" },
      { "number": 476, "title": "Number Complement", "slug": "number-complement", "difficulty": "Easy", "link": "https://leetcode.com/problems/number-complement/" },
      { "number": 201, "title": "Bitwise AND of Numbers Range", "slug": "bitwise-and-of-numbers-range", "difficulty": "Medium", "link": "https://leetcode.com/problems/bitwise-and-of-numbers-range/" },
      { "number": 190, "title": "Reverse Bits", "slug": "reverse-bits", "difficulty": "Easy", "link": "https://leetcode.com/problems/reverse-bits/" },
      { "number": 191, "title": "Number of 1 Bits", "slug": "number-of-1-bits", "difficulty": "Easy", "link": "https://leetcode.com/problems/number-of-1-bits/" },
      { "number": 231, "title": "Power of Two", "slug": "power-of-two", "difficulty": "Easy", "link": "https://leetcode.com/problems/power-of-two/" },
      { "number": 421, "title": "Maximum XOR of Two Numbers in an Array", "slug": "maximum-xor-of-two-numbers-in-an-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/" },
      { "number": 898, "title": "Bitwise ORs of Subarrays", "slug": "bitwise-ors-of-subarrays", "difficulty": "Medium", "link": "https://leetcode.com/problems/bitwise-ors-of-subarrays/" },
      { "number": 1310, "title": "XOR Queries of a Subarray", "slug": "xor-queries-of-a-subarray", "difficulty": "Medium", "link": "https://leetcode.com/problems/xor-queries-of-a-subarray/" }
    ]
  },

  {
    "id": "count-bits",
    "name": "Count Bits",
    "category": "Bit Manipulation",
    "difficulty": "beginner",
    "description": "Brian Kernighan's algorithm",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=RyBM56RIWrM",
    "problems": [
      { "number": 338, "title": "Counting Bits", "slug": "counting-bits", "difficulty": "Easy", "link": "https://leetcode.com/problems/counting-bits/" },
      { "number": 191, "title": "Number of 1 Bits", "slug": "number-of-1-bits", "difficulty": "Easy", "link": "https://leetcode.com/problems/number-of-1-bits/" },
      { "number": 231, "title": "Power of Two", "slug": "power-of-two", "difficulty": "Easy", "link": "https://leetcode.com/problems/power-of-two/" },
      { "number": 190, "title": "Reverse Bits", "slug": "reverse-bits", "difficulty": "Easy", "link": "https://leetcode.com/problems/reverse-bits/" },
      { "number": 268, "title": "Missing Number", "slug": "missing-number", "difficulty": "Easy", "link": "https://leetcode.com/problems/missing-number/" },
      { "number": 693, "title": "Binary Number with Alternating Bits", "slug": "binary-number-with-alternating-bits", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-number-with-alternating-bits/" },
      { "number": 476, "title": "Number Complement", "slug": "number-complement", "difficulty": "Easy", "link": "https://leetcode.com/problems/number-complement/" },
      { "number": 1009, "title": "Complement of Base 10 Integer", "slug": "complement-of-base-10-integer", "difficulty": "Easy", "link": "https://leetcode.com/problems/complement-of-base-10-integer/" },
      { "number": 461, "title": "Hamming Distance", "slug": "hamming-distance", "difficulty": "Easy", "link": "https://leetcode.com/problems/hamming-distance/" },
      { "number": 1318, "title": "Minimum Flips to Make a OR b Equal to c", "slug": "minimum-flips-to-make-a-or-b-equal-to-c", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/" },
      { "number": 137, "title": "Single Number II", "slug": "single-number-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/single-number-ii/" },
      { "number": 898, "title": "Bitwise ORs of Subarrays", "slug": "bitwise-ors-of-subarrays", "difficulty": "Medium", "link": "https://leetcode.com/problems/bitwise-ors-of-subarrays/" },
      { "number": 201, "title": "Bitwise AND of Numbers Range", "slug": "bitwise-and-of-numbers-range", "difficulty": "Medium", "link": "https://leetcode.com/problems/bitwise-and-of-numbers-range/" },
      { "number": 421, "title": "Maximum XOR of Two Numbers in an Array", "slug": "maximum-xor-of-two-numbers-in-an-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/" }
    ]
  },

  {
    "id": "subset-generation-bits",
    "name": "Subset Generation with Bits",
    "category": "Bit Manipulation",
    "difficulty": "intermediate",
    "description": "Generate subsets using bitmasks",
    "timeComplexity": "O(2^n * n)",
    "spaceComplexity": "O(1)",
    "youtubeUrl": "https://www.youtube.com/watch?v=REOH22Xwdkk",
    "problems": [
      { "number": 78, "title": "Subsets", "slug": "subsets", "difficulty": "Medium", "link": "https://leetcode.com/problems/subsets/" },
      { "number": 90, "title": "Subsets II", "slug": "subsets-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/subsets-ii/" },
      { "number": 46, "title": "Permutations", "slug": "permutations", "difficulty": "Medium", "link": "https://leetcode.com/problems/permutations/" },
      { "number": 47, "title": "Permutations II", "slug": "permutations-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/permutations-ii/" },
      { "number": 401, "title": "Binary Watch", "slug": "binary-watch", "difficulty": "Easy", "link": "https://leetcode.com/problems/binary-watch/" },
      { "number": 78, "title": "Subsets (duplicate for bitmask pattern)", "slug": "subsets", "difficulty": "Medium", "link": "https://leetcode.com/problems/subsets/" },
      { "number": 784, "title": "Letter Case Permutation", "slug": "letter-case-permutation", "difficulty": "Medium", "link": "https://leetcode.com/problems/letter-case-permutation/" },
      { "number": 1986, "title": "Minimum Number of Work Sessions to Finish the Tasks", "slug": "minimum-number-of-work-sessions-to-finish-the-tasks", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/" },
      { "number": 473, "title": "Matchsticks to Square", "slug": "matchsticks-to-square", "difficulty": "Medium", "link": "https://leetcode.com/problems/matchsticks-to-square/" },
      { "number": 1125, "title": "Smallest Sufficient Team", "slug": "smallest-sufficient-team", "difficulty": "Hard", "link": "https://leetcode.com/problems/smallest-sufficient-team/" },
      { "number": 1415, "title": "The k-th Lexicographical String of All Happy Strings of Length n", "slug": "the-k-th-lexicographical-string-of-all-happy-strings-of-length-n", "difficulty": "Medium", "link": "https://leetcode.com/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/" },
      { "number": 1239, "title": "Maximum Length of a Concatenated String with Unique Characters", "slug": "maximum-length-of-a-concatenated-string-with-unique-characters", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/" },
      { "number": 2044, "title": "Count Number of Maximum Bitwise-OR Subsets", "slug": "count-number-of-maximum-bitwise-or-subsets", "difficulty": "Medium", "link": "https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets/" },
      { "number": 980, "title": "Unique Paths III", "slug": "unique-paths-iii", "difficulty": "Hard", "link": "https://leetcode.com/problems/unique-paths-iii/" }
    ]
  },

  // Heap / Priority Queue

  {
    "id": "kth-largest",
    "name": "Kth Largest Element",
    "category": "Heap / Priority Queue",
    "difficulty": "intermediate",
    "description": "Find kth largest using min heap",
    "timeComplexity": "O(n log k)",
    "spaceComplexity": "O(k)",
    "youtubeUrl": "https://www.youtube.com/watch?v=XEmy13g1Qxc",
    "problems": [
      { "number": 215, "title": "Kth Largest Element in an Array", "slug": "kth-largest-element-in-an-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
      { "number": 703, "title": "Kth Largest Element in a Stream", "slug": "kth-largest-element-in-a-stream", "difficulty": "Easy", "link": "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
      { "number": 347, "title": "Top K Frequent Elements", "slug": "top-k-frequent-elements", "difficulty": "Medium", "link": "https://leetcode.com/problems/top-k-frequent-elements/" },
      { "number": 973, "title": "K Closest Points to Origin", "slug": "k-closest-points-to-origin", "difficulty": "Medium", "link": "https://leetcode.com/problems/k-closest-points-to-origin/" },
      { "number": 1046, "title": "Last Stone Weight", "slug": "last-stone-weight", "difficulty": "Easy", "link": "https://leetcode.com/problems/last-stone-weight/" },
      { "number": 692, "title": "Top K Frequent Words", "slug": "top-k-frequent-words", "difficulty": "Medium", "link": "https://leetcode.com/problems/top-k-frequent-words/" },
      { "number": 658, "title": "Find K Closest Elements", "slug": "find-k-closest-elements", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-k-closest-elements/" },
      { "number": 1167, "title": "Minimum Cost to Connect Sticks", "slug": "minimum-cost-to-connect-sticks", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-cost-to-connect-sticks/" },
      { "number": 295, "title": "Find Median from Data Stream", "slug": "find-median-from-data-stream", "difficulty": "Hard", "link": "https://leetcode.com/problems/find-median-from-data-stream/" },
      { "number": 502, "title": "IPO", "slug": "ipo", "difficulty": "Hard", "link": "https://leetcode.com/problems/ipo/" },
      { "number": 239, "title": "Sliding Window Maximum", "slug": "sliding-window-maximum", "difficulty": "Hard", "link": "https://leetcode.com/problems/sliding-window-maximum/" },
      { "number": 480, "title": "Sliding Window Median", "slug": "sliding-window-median", "difficulty": "Hard", "link": "https://leetcode.com/problems/sliding-window-median/" },
      { "number": 373, "title": "Find K Pairs with Smallest Sums", "slug": "find-k-pairs-with-smallest-sums", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/" },
      { "number": 407, "title": "Trapping Rain Water II", "slug": "trapping-rain-water-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/trapping-rain-water-ii/" }
    ]
  },

  {
    "id": "merge-k-lists",
    "name": "Merge K Sorted Lists",
    "category": "Heap / Priority Queue",
    "difficulty": "advanced",
    "description": "Merge using min heap",
    "timeComplexity": "O(N log k)",
    "spaceComplexity": "O(k)",
    "youtubeUrl": "https://www.youtube.com/watch?v=q5a5OiGbT6Q",
    "problems": [
      { "number": 23, "title": "Merge k Sorted Lists", "slug": "merge-k-sorted-lists", "difficulty": "Hard", "link": "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { "number": 21, "title": "Merge Two Sorted Lists", "slug": "merge-two-sorted-lists", "difficulty": "Easy", "link": "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { "number": 373, "title": "Find K Pairs with Smallest Sums", "slug": "find-k-pairs-with-smallest-sums", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/" },
      { "number": 378, "title": "Kth Smallest Element in a Sorted Matrix", "slug": "kth-smallest-element-in-a-sorted-matrix", "difficulty": "Medium", "link": "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/" },
      { "number": 218, "title": "The Skyline Problem", "slug": "the-skyline-problem", "difficulty": "Hard", "link": "https://leetcode.com/problems/the-skyline-problem/" },
      { "number": 1046, "title": "Last Stone Weight", "slug": "last-stone-weight", "difficulty": "Easy", "link": "https://leetcode.com/problems/last-stone-weight/" },
      { "number": 632, "title": "Smallest Range Covering Elements from K Lists", "slug": "smallest-range-covering-elements-from-k-lists", "difficulty": "Hard", "link": "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/" },
      { "number": 264, "title": "Ugly Number II", "slug": "ugly-number-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/ugly-number-ii/" },
      { "number": 373, "title": "K Pairs with Smallest Sums (duplicate for heap merging)", "slug": "find-k-pairs-with-smallest-sums", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/" },
      { "number": 778, "title": "Swim in Rising Water", "slug": "swim-in-rising-water", "difficulty": "Hard", "link": "https://leetcode.com/problems/swim-in-rising-water/" },
      { "number": 23, "title": "Merge k Sorted Lists (repeat for clarity)", "slug": "merge-k-sorted-lists", "difficulty": "Hard", "link": "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { "number": 373, "title": "Find K Pairs with Smallest Sums", "slug": "find-k-pairs-with-smallest-sums", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/" },
      { "number": 451, "title": "Sort Characters By Frequency", "slug": "sort-characters-by-frequency", "difficulty": "Medium", "link": "https://leetcode.com/problems/sort-characters-by-frequency/" },
      { "number": 692, "title": "Top K Frequent Words", "slug": "top-k-frequent-words", "difficulty": "Medium", "link": "https://leetcode.com/problems/top-k-frequent-words/" }
    ]
  },

  {
    "id": "sliding-window-maximum",
    "name": "Sliding Window Maximum",
    "category": "Heap / Priority Queue",
    "difficulty": "advanced",
    "description": "Find max in each window",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(k)",
    "youtubeUrl": "https://www.youtube.com/watch?v=DfljaUwZsOk",
    "problems": [
      { "number": 239, "title": "Sliding Window Maximum", "slug": "sliding-window-maximum", "difficulty": "Hard", "link": "https://leetcode.com/problems/sliding-window-maximum/" },
      { "number": 480, "title": "Sliding Window Median", "slug": "sliding-window-median", "difficulty": "Hard", "link": "https://leetcode.com/problems/sliding-window-median/" },
      { "number": 438, "title": "Find All Anagrams in a String", "slug": "find-all-anagrams-in-a-string", "difficulty": "Medium", "link": "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
      { "number": 567, "title": "Permutation in String", "slug": "permutation-in-string", "difficulty": "Medium", "link": "https://leetcode.com/problems/permutation-in-string/" },
      { "number": 3, "title": "Longest Substring Without Repeating Characters", "slug": "longest-substring-without-repeating-characters", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { "number": 76, "title": "Minimum Window Substring", "slug": "minimum-window-substring", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-window-substring/" },
      { "number": 295, "title": "Find Median from Data Stream", "slug": "find-median-from-data-stream", "difficulty": "Hard", "link": "https://leetcode.com/problems/find-median-from-data-stream/" },
      { "number": 1004, "title": "Max Consecutive Ones III", "slug": "max-consecutive-ones-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/max-consecutive-ones-iii/" },
      { "number": 424, "title": "Longest Repeating Character Replacement", "slug": "longest-repeating-character-replacement", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-repeating-character-replacement/" },
      { "number": 643, "title": "Maximum Average Subarray I", "slug": "maximum-average-subarray-i", "difficulty": "Easy", "link": "https://leetcode.com/problems/maximum-average-subarray-i/" },
      { "number": 1456, "title": "Maximum Number of Vowels in a Substring of Given Length", "slug": "maximum-number-of-vowels-in-a-substring-of-given-length", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/" },
      { "number": 2391, "title": "Minimum Amount of Time to Collect Garbage", "slug": "minimum-amount-of-time-to-collect-garbage", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-amount-of-time-to-collect-garbage/" },
      { "number": 1358, "title": "Number of Substrings Containing All Three Characters", "slug": "number-of-substrings-containing-all-three-characters", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/" },
      { "number": 930, "title": "Binary Subarrays With Sum", "slug": "binary-subarrays-with-sum", "difficulty": "Medium", "link": "https://leetcode.com/problems/binary-subarrays-with-sum/" }
    ]
  },

  // Math & Number Theory

  {
    "id": "gcd-euclidean",
    "name": "GCD (Euclidean)",
    "category": "Math & Number Theory",
    "difficulty": "beginner",
    "description": "Euclid's algorithm for GCD",
    "timeComplexity": "O(log(min(a,b)))",
    "spaceComplexity": "O(1)",
    "problems": [
      { "number": 1071, "title": "Greatest Common Divisor of Strings", "slug": "greatest-common-divisor-of-strings", "difficulty": "Easy", "link": "https://leetcode.com/problems/greatest-common-divisor-of-strings/" },
      { "number": 1979, "title": "Find Greatest Common Divisor of Array", "slug": "find-greatest-common-divisor-of-array", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-greatest-common-divisor-of-array/" },
      { "number": 1250, "title": "Check If It Is a Good Array", "slug": "check-if-it-is-a-good-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/check-if-it-is-a-good-array/" },
      { "number": 2654, "title": "Minimum Number of Operations to Make All Array Elements Equal to 1", "slug": "minimum-number-of-operations-to-make-all-array-elements-equal-to-1", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-number-of-operations-to-make-all-array-elements-equal-to-1/" },
      { "number": 1998, "title": "GCD Sort of an Array", "slug": "gcd-sort-of-an-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/gcd-sort-of-an-array/" },
      { "number": 1146, "title": "Snapshot Array (related arithmetic / structure practice)", "slug": "snapshot-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/snapshot-array/" },
      { "number": 2149, "title": "Rearrange Array Elements by Sign (related practice)", "slug": "rearrange-array-elements-by-sign", "difficulty": "Easy", "link": "https://leetcode.com/problems/rearrange-array-elements-by-sign/" },
      { "number": 2269, "title": "Find the K-Beauty of a Number (related divisibility practice)", "slug": "find-the-k-beauty-of-a-number", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-k-beauty-of-a-number/" },
      { "number": 325, "title": "Maximum Size Subarray Sum Equals k (related number-theory practice)", "slug": "maximum-size-subarray-sum-equals-k", "difficulty": "Medium", "link": "https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/" },
      { "number": 1790, "title": "Check if One String Swap Can Make Strings Equal (auxiliary string/number practice)", "slug": "check-if-one-string-swap-can-make-strings-equal", "difficulty": "Easy", "link": "https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/" },

    ]
  },

  {
    "id": "sieve-eratosthenes",
    "name": "Sieve of Eratosthenes",
    "category": "Math & Number Theory",
    "difficulty": "intermediate",
    "description": "Generate all primes up to n",
    "timeComplexity": "O(n log log n)",
    "spaceComplexity": "O(n)",
    "problems": [
      { "number": 204, "title": "Count Primes", "slug": "count-primes", "difficulty": "Easy", "link": "https://leetcode.com/problems/count-primes/" },
      { "number": 1750, "title": "Minimum Length of String After Deleting Similar Ends (auxiliary)", "slug": "minimum-length-of-string-after-deleting-similar-ends", "difficulty": "Medium", "link": "https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends/" },
      { "number": 2068, "title": "Check Whether Two Strings are Almost Equivalent (auxiliary)", "slug": "check-whether-two-strings-are-almost-equivalent", "difficulty": "Easy", "link": "https://leetcode.com/problems/check-whether-two-strings-are-almost-equivalent/" },
      { "number": 902, "title": "Numbers At Most N Given Digit Set (related counting)", "slug": "numbers-at-most-n-given-digit-set", "difficulty": "Hard", "link": "https://leetcode.com/problems/numbers-at-most-n-given-digit-set/" },
      { "number": 326, "title": "Power of Three", "slug": "power-of-three", "difficulty": "Easy", "link": "https://leetcode.com/problems/power-of-three/" },
      { "number": 263, "title": "Ugly Number (factors practice)", "slug": "ugly-number", "difficulty": "Easy", "link": "https://leetcode.com/problems/ugly-number/" },
      { "number": 1223, "title": "Dice Roll Simulation (related counting practice)", "slug": "dice-roll-simulation", "difficulty": "Medium", "link": "https://leetcode.com/problems/dice-roll-simulation/" },
    ]
  },

  {
    "id": "modular-exponentiation",
    "name": "Modular Exponentiation",
    "category": "Math & Number Theory",
    "difficulty": "intermediate",
    "description": "Fast power with modulo",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "problems": [
      { "number": 50, "title": "Pow(x, n)", "slug": "powx-n", "difficulty": "Medium", "link": "https://leetcode.com/problems/powx-n/" },
      { "number": 372, "title": "Super Pow", "slug": "super-pow", "difficulty": "Medium", "link": "https://leetcode.com/problems/super-pow/" },
      { "number": 897, "title": "Increasing Order Search Tree (auxiliary)", "slug": "increasing-order-search-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/increasing-order-search-tree/" },
      { "number": 976, "title": "Largest Perimeter Triangle (auxiliary)", "slug": "largest-perimeter-triangle", "difficulty": "Easy", "link": "https://leetcode.com/problems/largest-perimeter-triangle/" },
      { "number": 1239, "title": "Maximum Length of a Concatenated String with Unique Characters (auxiliary)", "slug": "maximum-length-of-a-concatenated-string-with-unique-characters", "difficulty": "Hard", "link": "https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/" },
      { "number": 986, "title": "Interval List Intersections (auxiliary)", "slug": "interval-list-intersections", "difficulty": "Medium", "link": "https://leetcode.com/problems/interval-list-intersections/" },
    ]
  },

  {
    "id": "karatsuba",
    "name": "Karatsuba Multiplication",
    "category": "Math & Number Theory",
    "difficulty": "advanced",
    "description": "Fast multiplication algorithm",
    "timeComplexity": "O(n^1.58)",
    "spaceComplexity": "O(n)",
    "problems": [
      { "number": 43, "title": "Multiply Strings", "slug": "multiply-strings", "difficulty": "Medium", "link": "https://leetcode.com/problems/multiply-strings/" },
      { "number": 2, "title": "Add Two Numbers", "slug": "add-two-numbers", "difficulty": "Medium", "link": "https://leetcode.com/problems/add-two-numbers/" },
      { "number": 67, "title": "Add Binary", "slug": "add-binary", "difficulty": "Easy", "link": "https://leetcode.com/problems/add-binary/" },
      { "number": 172, "title": "Factorial Trailing Zeroes (number-theory practice)", "slug": "factorial-trailing-zeroes", "difficulty": "Easy", "link": "https://leetcode.com/problems/factorial-trailing-zeroes/" },
      { "number": 184, "title": "Department Top Three Salaries (auxiliary)", "slug": "department-top-three-salaries", "difficulty": "Medium", "link": "https://leetcode.com/problems/department-top-three-salaries/" },
      { "number": 43, "title": "Multiply Strings (duplicate)", "slug": "multiply-strings", "difficulty": "Medium", "link": "https://leetcode.com/problems/multiply-strings/" },
    ]
  },

  // Advanced
  {
    "id": "segment-tree",
    "name": "Segment Tree",
    "category": "Advanced",
    "difficulty": "advanced",
    "description": "Range query data structure",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(n)",
    "problems": [
      { "number": 307, "title": "Range Sum Query - Mutable", "slug": "range-sum-query-mutable", "difficulty": "Medium", "link": "https://leetcode.com/problems/range-sum-query-mutable/" },
      { "number": 308, "title": "Range Sum Query 2D - Mutable", "slug": "range-sum-query-2d-mutable", "difficulty": "Hard", "link": "https://leetcode.com/problems/range-sum-query-2d-mutable/" },
      { "number": 215, "title": "Kth Largest Element in an Array", "slug": "kth-largest-element-in-an-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/kth-largest-element-in-an-array/" },

      { "number": 699, "title": "Falling Squares", "slug": "falling-squares", "difficulty": "Hard", "link": "https://leetcode.com/problems/falling-squares/" },
      { "number": 327, "title": "Count of Range Sum", "slug": "count-of-range-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/count-of-range-sum/" },
      { "number": 1582, "title": "Special Positions in a Binary Matrix", "slug": "special-positions-in-a-binary-matrix", "difficulty": "Medium", "link": "https://leetcode.com/problems/special-positions-in-a-binary-matrix/" },

      { "number": 315, "title": "Count of Smaller Numbers After Self", "slug": "count-of-smaller-numbers-after-self", "difficulty": "Hard", "link": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" },

      { "number": 2202, "title": "Max Sum of Rectangle No Larger Than K (related range queries)", "slug": "max-sum-of-rectangle-no-larger-than-k", "difficulty": "Hard", "link": "https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/" },

    ]
  },

  {
    "id": "fenwick-tree",
    "name": "Fenwick Tree (BIT)",
    "category": "Advanced",
    "difficulty": "advanced",
    "description": "Binary indexed tree for prefix sums",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(n)",
    "problems": [
      { "number": 315, "title": "Count of Smaller Numbers After Self", "slug": "count-of-smaller-numbers-after-self", "difficulty": "Hard", "link": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" },
      { "number": 307, "title": "Range Sum Query - Mutable", "slug": "range-sum-query-mutable", "difficulty": "Medium", "link": "https://leetcode.com/problems/range-sum-query-mutable/" },
      { "number": 327, "title": "Count of Range Sum", "slug": "count-of-range-sum", "difficulty": "Hard", "link": "https://leetcode.com/problems/count-of-range-sum/" },
    ]
  },

  {
    "id": "sparse-table",
    "name": "Sparse Table",
    "category": "Advanced",
    "difficulty": "advanced",
    "description": "Range minimum query in O(1)",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(n log n)",
    "problems": [
      { "number": 239, "title": "Sliding Window Maximum", "slug": "sliding-window-maximum", "difficulty": "Hard", "link": "https://leetcode.com/problems/sliding-window-maximum/" },
      { "number": 240, "title": "Search a 2D Matrix II", "slug": "search-a-2d-matrix-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/search-a-2d-matrix-ii/" },
      { "number": 225, "title": "Implement Stack using Queues", "slug": "implement-stack-using-queues", "difficulty": "Easy", "link": "https://leetcode.com/problems/implement-stack-using-queues/" },
      { "number": 220, "title": "Contains Duplicate III", "slug": "contains-duplicate-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/contains-duplicate-iii/" },
    ]
  },

  {
    "id": "kmp",
    "name": "KMP String Matching",
    "category": "Advanced",
    "difficulty": "advanced",
    "description": "Linear time pattern matching",
    "timeComplexity": "O(n+m)",
    "spaceComplexity": "O(m)",
    "problems": [
      { "number": 28, "title": "Find the Index of the First Occurrence in a String", "slug": "find-the-index-of-the-first-occurrence-in-a-string", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },
      { "number": 214, "title": "Shortest Palindrome", "slug": "shortest-palindrome", "difficulty": "Hard", "link": "https://leetcode.com/problems/shortest-palindrome/" },
      { "number": 459, "title": "Repeated Substring Pattern", "slug": "repeated-substring-pattern", "difficulty": "Easy", "link": "https://leetcode.com/problems/repeated-substring-pattern/" },
      { "number": 17, "title": "Letter Combinations of a Phone Number", "slug": "letter-combinations-of-a-phone-number", "difficulty": "Medium", "link": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
      { "number": 686, "title": "Repeated String Match (related matching)", "slug": "repeated-string-match", "difficulty": "Medium", "link": "https://leetcode.com/problems/repeated-string-match/" },
      { "number": 28, "title": "strStr() (duplicate)", "slug": "find-the-index-of-the-first-occurrence-in-a-string", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },

    ]
  },

  {
    "id": "rabin-karp",
    "name": "Rabin-Karp",
    "category": "Advanced",
    "difficulty": "advanced",
    "description": "Rolling hash pattern matching",
    "timeComplexity": "O(n+m)",
    "spaceComplexity": "O(1)",
    "problems": [
      { "number": 187, "title": "Repeated DNA Sequences", "slug": "repeated-dna-sequences", "difficulty": "Medium", "link": "https://leetcode.com/problems/repeated-dna-sequences/" },
      { "number": 28, "title": "Find the Index of the First Occurrence in a String", "slug": "find-the-index-of-the-first-occurrence-in-a-string", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },
      { "number": 211, "title": "Design Add and Search Words Data Structure", "slug": "design-add-and-search-words-data-structure", "difficulty": "Medium", "link": "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
      { "number": 459, "title": "Repeated Substring Pattern", "slug": "repeated-substring-pattern", "difficulty": "Easy", "link": "https://leetcode.com/problems/repeated-substring-pattern/" },
      { "number": 727, "title": "Minimum Window Subsequence", "slug": "minimum-window-subsequence", "difficulty": "Hard", "link": "https://leetcode.com/problems/minimum-window-subsequence/" },
      { "number": 214, "title": "Shortest Palindrome", "slug": "shortest-palindrome", "difficulty": "Hard", "link": "https://leetcode.com/problems/shortest-palindrome/" },
    ]
  },

  {
    "id": "manachers",
    "name": "Manacher's Algorithm",
    "category": "Advanced",
    "difficulty": "advanced",
    "description": "Longest palindromic substring",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "problems": [
      { "number": 125, "title": "Valid Palindrome", "slug": "valid-palindrome", "difficulty": "Easy", "link": "https://leetcode.com/problems/valid-palindrome/" },
      { "number": 409, "title": "Longest Palindrome", "slug": "longest-palindrome", "difficulty": "Easy", "link": "https://leetcode.com/problems/longest-palindrome/" },
      { "number": 234, "title": "Palindrome Linked List", "slug": "palindrome-linked-list", "difficulty": "Easy", "link": "https://leetcode.com/problems/palindrome-linked-list/" },
      { "number": 680, "title": "Valid Palindrome II", "slug": "valid-palindrome-ii", "difficulty": "Easy", "link": "https://leetcode.com/problems/valid-palindrome-ii/" },
      { "number": 5, "title": "Longest Palindromic Substring", "slug": "longest-palindromic-substring", "difficulty": "Medium", "link": "https://leetcode.com/problems/longest-palindromic-substring/" },
      { "number": 647, "title": "Palindromic Substrings", "slug": "palindromic-substrings", "difficulty": "Medium", "link": "https://leetcode.com/problems/palindromic-substrings/" },
      { "number": 131, "title": "Palindrome Partitioning", "slug": "palindrome-partitioning", "difficulty": "Medium", "link": "https://leetcode.com/problems/palindrome-partitioning/" },
      { "number": 132, "title": "Palindrome Partitioning II", "slug": "palindrome-partitioning-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/palindrome-partitioning-ii/" },
      { "number": 214, "title": "Shortest Palindrome", "slug": "shortest-palindrome", "difficulty": "Hard", "link": "https://leetcode.com/problems/shortest-palindrome/" },
      { "number": 336, "title": "Palindrome Pairs", "slug": "palindrome-pairs", "difficulty": "Hard", "link": "https://leetcode.com/problems/palindrome-pairs/" },
      { "number": 688, "title": "Knight Probability in Chessboard (string/DP related practice)", "slug": "knight-probability-in-chessboard", "difficulty": "Medium", "link": "https://leetcode.com/problems/knight-probability-in-chessboard/" },
    ]
  },

  {
    "id": "union-by-rank",
    "name": "Union by Rank + Path Compression",
    "category": "Advanced",
    "difficulty": "advanced",
    "description": "Optimized union-find",
    "timeComplexity": "O(α(n))",
    "spaceComplexity": "O(n)",
    "problems": [
      { "number": 997, "title": "Find the Town Judge", "slug": "find-the-town-judge", "difficulty": "Easy", "link": "https://leetcode.com/problems/find-the-town-judge/" },
      { "number": 547, "title": "Number of Provinces", "slug": "number-of-provinces", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-provinces/" },
      { "number": 323, "title": "Number of Connected Components in an Undirected Graph", "slug": "number-of-connected-components-in-an-undirected-graph", "difficulty": "Medium", "link": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
      { "number": 684, "title": "Redundant Connection", "slug": "redundant-connection", "difficulty": "Medium", "link": "https://leetcode.com/problems/redundant-connection/" },
      { "number": 721, "title": "Accounts Merge", "slug": "accounts-merge", "difficulty": "Medium", "link": "https://leetcode.com/problems/accounts-merge/" },
      { "number": 990, "title": "Satisfiability of Equality Equations", "slug": "satisfiability-of-equality-equations", "difficulty": "Medium", "link": "https://leetcode.com/problems/satisfiability-of-equality-equations/" },
      { "number": 305, "title": "Number of Islands II", "slug": "number-of-islands-ii", "difficulty": "Hard", "link": "https://leetcode.com/problems/number-of-islands-ii/" },
      { "number": 1584, "title": "Min Cost to Connect All Points", "slug": "min-cost-to-connect-all-points", "difficulty": "Medium", "link": "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
      { "number": 1135, "title": "Connecting Cities With Minimum Cost", "slug": "connecting-cities-with-minimum-cost", "difficulty": "Medium", "link": "https://leetcode.com/problems/connecting-cities-with-minimum-cost/" },
      { "number": 815, "title": "Bus Routes", "slug": "bus-routes", "difficulty": "Hard", "link": "https://leetcode.com/problems/bus-routes/" },
    ]
  },

  {
    "id": "tarjans",
    "name": "Tarjan's Algorithm",
    "category": "Advanced",
    "difficulty": "advanced",
    "description": "Find strongly connected components",
    "timeComplexity": "O(V+E)",
    "spaceComplexity": "O(V)",
    "problems": [
      { "number": 207, "title": "Course Schedule", "slug": "course-schedule", "difficulty": "Medium", "link": "https://leetcode.com/problems/course-schedule/" },
      { "number": 210, "title": "Course Schedule II", "slug": "course-schedule-ii", "difficulty": "Medium", "link": "https://leetcode.com/problems/course-schedule-ii/" },
      { "number": 1192, "title": "Critical Connections in a Network", "slug": "critical-connections-in-a-network", "difficulty": "Hard", "link": "https://leetcode.com/problems/critical-connections-in-a-network/" },
      { "number": 886, "title": "Possible Bipartition", "slug": "possible-bipartition", "difficulty": "Medium", "link": "https://leetcode.com/problems/possible-bipartition/" },
      { "number": 797, "title": "All Paths From Source to Target", "slug": "all-paths-from-source-to-target", "difficulty": "Medium", "link": "https://leetcode.com/problems/all-paths-from-source-to-target/" },
      { "number": 133, "title": "Clone Graph", "slug": "clone-graph", "difficulty": "Medium", "link": "https://leetcode.com/problems/clone-graph/" },
      { "number": 315, "title": "Count of Smaller Numbers After Self", "slug": "count-of-smaller-numbers-after-self", "difficulty": "Hard", "link": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" },

    ]
  },

  {
    "id": "binary-lifting",
    "name": "Binary Lifting",
    "category": "Advanced",
    "difficulty": "advanced",
    "description": "LCA using binary lifting",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(n log n)",
    "problems": [
      { "number": 236, "title": "Lowest Common Ancestor of a Binary Tree", "slug": "lowest-common-ancestor-of-a-binary-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
      { "number": 235, "title": "Lowest Common Ancestor of a Binary Search Tree", "slug": "lowest-common-ancestor-of-a-binary-search-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
      { "number": 1650, "title": "Lowest Common Ancestor of a Binary Tree III", "slug": "lowest-common-ancestor-of-a-binary-tree-iii", "difficulty": "Medium", "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/" },

      { "number": 110, "title": "Balanced Binary Tree", "slug": "balanced-binary-tree", "difficulty": "Easy", "link": "https://leetcode.com/problems/balanced-binary-tree/" },
      { "number": 1146, "title": "Snapshot Array (related practice)", "slug": "snapshot-array", "difficulty": "Medium", "link": "https://leetcode.com/problems/snapshot-array/" },
      { "number": 1099, "title": "Two Sum Less Than K (auxiliary)", "slug": "two-sum-less-than-k", "difficulty": "Easy", "link": "https://leetcode.com/problems/two-sum-less-than-k/" },
      { "number": 663, "title": "Equal Tree Partition (related tree DP)", "slug": "equal-tree-partition", "difficulty": "Medium", "link": "https://leetcode.com/problems/equal-tree-partition/" },
      { "number": 109, "title": "Convert Sorted List to Binary Search Tree", "slug": "convert-sorted-list-to-binary-search-tree", "difficulty": "Medium", "link": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/" },
      { "number": 888, "title": "Fair Candy Swap (auxiliary)", "slug": "fair-candy-swap", "difficulty": "Easy", "link": "https://leetcode.com/problems/fair-candy-swap/" },
    ]


  }
];
