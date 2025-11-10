export interface Blind75Problem {
  id: number;
  slug: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  leetcodeSearch: string;
  timeComplexity: string;
  spaceComplexity: string;
  companies: string[];
  tags: string[];
  algorithmId?: string; // Link to existing algorithm for visualization
  youtubeUrl?: string; // NeetCode video URL
  useCases?: string[]; // Real-world use cases
}

export const blind75Problems: Blind75Problem[] = [
  {
    "id": 1,
    "slug": "two-sum",
    "title": "Two Sum",
    "category": "Array",
    "difficulty": "easy",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nExample 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\nConstraints:\n• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.",
    "leetcodeSearch": "https://leetcode.com/problems/two-sum/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Amazon",
      "Google",
      "Facebook",
      "Microsoft"
    ],
    "tags": [
      "Hash Table",
      "Array"
    ],
    "algorithmId": "two-sum",
    "youtubeUrl": "https://www.youtube.com/watch?v=KLlXCFG5TnA",
    "useCases": [
      "Finding pairs in datasets",
      "Complement search in databases",
      "Financial transaction matching"
    ]
  },
  {
    "id": 2,
    "slug": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy and Sell Stock",
    "category": "Array",
    "difficulty": "easy",
    "description": "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nExample 1:\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\n\nExample 2:\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: No transactions are done and the max profit = 0.\n\nConstraints:\n• 1 <= prices.length <= 10^5\n• 0 <= prices[i] <= 10^4",
    "leetcodeSearch": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "algorithmId": "best-time-to-buy-and-sell-stock",
    "youtubeUrl": "https://www.youtube.com/watch?v=1pkOgXD63yU",
    "useCases": [
      "Stock trading algorithms",
      "Price optimization",
      "Timing market entries"
    ]
  },
  {
    "id": 3,
    "slug": "contains-duplicate",
    "title": "Contains Duplicate",
    "category": "Array",
    "difficulty": "easy",
    "description": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.\n\nExample 1:\nInput: nums = [1,2,3,1]\nOutput: true\n\nExample 2:\nInput: nums = [1,2,3,4]\nOutput: false\n\nExample 3:\nInput: nums = [1,1,1,3,3,4,3,2,4,2]\nOutput: true\n\nConstraints:\n• 1 <= nums.length <= 10^5\n• -10^9 <= nums[i] <= 10^9",
    "leetcodeSearch": "https://leetcode.com/problems/contains-duplicate/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Amazon",
      "Apple",
      "Adobe"
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Sorting"
    ],
    "algorithmId": "contains-duplicate",
    "youtubeUrl": "https://www.youtube.com/watch?v=3OamzN90kPg",
    "useCases": [
      "Duplicate detection in databases",
      "Data validation",
      "Unique constraint checking"
    ]
  },
  {
    "id": 4,
    "slug": "product-of-array-except-self",
    "title": "Product of Array Except Self",
    "category": "Array",
    "difficulty": "medium",
    "description": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.\n\nExample 1:\nInput: nums = [1,2,3,4]\nOutput: [24,12,8,6]\n\nExample 2:\nInput: nums = [-1,1,0,-3,3]\nOutput: [0,0,9,0,0]\n\nConstraints:\n• 2 <= nums.length <= 10^5\n• -30 <= nums[i] <= 30\n• The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nFollow up: Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space.)",
    "leetcodeSearch": "https://leetcode.com/problems/product-of-array-except-self/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "tags": [
      "Array",
      "Prefix Sum"
    ],
    "algorithmId": "product-of-array-except-self",
    "youtubeUrl": "https://www.youtube.com/watch?v=bNvIQI2wAjk",
    "useCases": [
      "Statistical calculations",
      "Array transformations",
      "Mathematical computations"
    ]
  },
  {
    "id": 5,
    "slug": "maximum-subarray",
    "title": "Maximum Subarray",
    "category": "Array",
    "difficulty": "medium",
    "description": "Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.\n\nExample 1:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n\nExample 2:\nInput: nums = [1]\nOutput: 1\nExplanation: The subarray [1] has the largest sum 1.\n\nExample 3:\nInput: nums = [5,4,-1,7,8]\nOutput: 23\nExplanation: The subarray [5,4,-1,7,8] has the largest sum 23.\n\nConstraints:\n• 1 <= nums.length <= 10^5\n• -10^4 <= nums[i] <= 10^4\n\nFollow up: If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach.",
    "leetcodeSearch": "https://leetcode.com/problems/maximum-subarray/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft",
      "LinkedIn"
    ],
    "tags": [
      "Array",
      "Dynamic Programming",
      "Divide and Conquer"
    ],
    "algorithmId": "maximum-subarray",
    "youtubeUrl": "https://www.youtube.com/watch?v=5WZl3MMT0Eg",
    "useCases": [
      "Financial analysis",
      "Maximum profit calculation",
      "Pattern recognition in data"
    ]
  },
  {
    "id": 6,
    "slug": "maximum-product-subarray",
    "title": "Maximum Product Subarray",
    "category": "Array",
    "difficulty": "medium",
    "description": "Given an integer array nums, find a subarray that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a 32-bit integer.\n\nExample 1:\nInput: nums = [2,3,-2,4]\nOutput: 6\nExplanation: [2,3] has the largest product 6.\n\nExample 2:\nInput: nums = [-2,0,-1]\nOutput: 0\nExplanation: The result cannot be 2, because [-2,-1] is not a subarray.\n\nConstraints:\n• 1 <= nums.length <= 2 * 10^4\n• -10 <= nums[i] <= 10\n• The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
    "leetcodeSearch": "https://leetcode.com/problems/maximum-product-subarray/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "LinkedIn"
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "algorithmId": "maximum-product-subarray",
    "youtubeUrl": "https://www.youtube.com/watch?v=lXVy6YWFcRM",
    "useCases": [
      "Optimization problems",
      "Product calculations",
      "Dynamic programming applications"
    ]
  },
  {
    "id": 7,
    "slug": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum in Rotated Sorted Array",
    "category": "Array",
    "difficulty": "medium",
    "description": "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:\n\n• [4,5,6,7,0,1,2] if it was rotated 4 times.\n• [0,1,2,4,5,6,7] if it was rotated 7 times.\n\nGiven the sorted rotated array nums of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.\n\nExample 1:\nInput: nums = [3,4,5,1,2]\nOutput: 1\nExplanation: The original array was [1,2,3,4,5] rotated 3 times.\n\nExample 2:\nInput: nums = [4,5,6,7,0,1,2]\nOutput: 0\nExplanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.\n\nExample 3:\nInput: nums = [11,13,15,17]\nOutput: 11\nExplanation: The original array was [11,13,15,17] and it was rotated 4 times.\n\nConstraints:\n• n == nums.length\n• 1 <= n <= 5000\n• -5000 <= nums[i] <= 5000\n• All the integers of nums are unique.\n• nums is sorted and rotated between 1 and n times.",
    "leetcodeSearch": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "tags": [
      "Array",
      "Binary Search"
    ],
    "algorithmId": "find-minimum-in-rotated-sorted-array",
    "youtubeUrl": "https://www.youtube.com/watch?v=nIVW4P8b1VA",
    "useCases": [
      "Rotated array operations",
      "Circular buffer search",
      "Optimized search algorithms"
    ]
  },
  {
    "id": 8,
    "slug": "search-in-rotated-sorted-array",
    "title": "Search in Rotated Sorted Array",
    "category": "Array",
    "difficulty": "medium",
    "description": "There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.\n\nExample 1:\nInput: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\n\nExample 2:\nInput: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\n\nExample 3:\nInput: nums = [1], target = 0\nOutput: -1\n\nConstraints:\n• 1 <= nums.length <= 5000\n• -10^4 <= nums[i] <= 10^4\n• All values of nums are unique.\n• nums is an ascending array that is possibly rotated.\n• -10^4 <= target <= 10^4",
    "leetcodeSearch": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Facebook",
      "Microsoft",
      "Amazon"
    ],
    "tags": [
      "Array",
      "Binary Search"
    ],
    "algorithmId": "search-in-rotated-sorted-array",
    "youtubeUrl": "https://www.youtube.com/watch?v=U8XENwh8Oy8",
    "useCases": [
      "Circular buffer search",
      "Rotated data structures",
      "Database indexing"
    ]
  },
  {
    "id": 9,
    "slug": "3sum",
    "title": "3Sum",
    "category": "Array",
    "difficulty": "medium",
    "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.\n\nExample 1:\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\nExplanation: \nnums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.\nThe distinct triplets are [-1,0,1] and [-1,-1,2].\n\nExample 2:\nInput: nums = [0,1,1]\nOutput: []\nExplanation: The only possible triplet does not sum up to 0.\n\nExample 3:\nInput: nums = [0,0,0]\nOutput: [[0,0,0]]\n\nConstraints:\n• 3 <= nums.length <= 3000\n• -10^5 <= nums[i] <= 10^5",
    "leetcodeSearch": "https://leetcode.com/problems/3sum/",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Sorting"
    ],
    "algorithmId": "3sum",
    "youtubeUrl": "https://www.youtube.com/watch?v=jzZsG8n2R9A",
    "useCases": [
      "Finding triplets in datasets",
      "Combinatorial searches",
      "Financial reconciliation"
    ]
  },
  {
    "id": 10,
    "slug": "container-with-most-water",
    "title": "Container With Most Water",
    "category": "Array",
    "difficulty": "medium",
    "description": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nNotice that you may not slant the container.\n\nExample 1:\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. The max area of water is 49.\n\nExample 2:\nInput: height = [1,1]\nOutput: 1\n\nConstraints:\n• n == height.length\n• 2 <= n <= 10^5\n• 0 <= height[i] <= 10^4",
    "leetcodeSearch": "https://leetcode.com/problems/container-with-most-water/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Google",
      "Facebook"
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Greedy"
    ],
    "algorithmId": "container-with-most-water",
    "youtubeUrl": "https://www.youtube.com/watch?v=UuiTKBwPgAo",
    "useCases": [
      "Area optimization",
      "Resource allocation",
      "Capacity planning"
    ]
  },
  {
    "id": 11,
    "slug": "sum-of-two-integers",
    "title": "Sum of Two Integers",
    "category": "Binary",
    "difficulty": "medium",
    "description": "Given two integers a and b, return the sum of the two integers without using the operators + and -.\n\nExample 1:\nInput: a = 1, b = 2\nOutput: 3\n\nExample 2:\nInput: a = 2, b = 3\nOutput: 5\n\nNotes: Use bitwise operations (XOR and AND with shifts) to simulate addition without using + or -.",
    "leetcodeSearch": "https://leetcode.com/problems/sum-of-two-integers/",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon"
    ],
    "tags": [
      "Math",
      "Bit Manipulation"
    ],
    "algorithmId": "sum-of-two-integers",
    "youtubeUrl": "https://www.youtube.com/watch?v=gVUrDV4tZfY",
    "useCases": [
      "Low-level arithmetic",
      "Embedded systems",
      "Bit manipulation practice"
    ]
  },
  {
    "id": 12,
    "slug": "number-of-1-bits",
    "title": "Number of 1 Bits",
    "category": "Binary",
    "difficulty": "easy",
    "description": "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).\n\nExample 1:\nInput: n = 00000000000000000000000000001011\nOutput: 3\nExplanation: The binary representation has three '1' bits.\n\nExample 2:\nInput: n = 00000000000000000000000010000000\nOutput: 1\n\nConstraints: The input is a 32-bit unsigned integer.",
    "leetcodeSearch": "https://leetcode.com/problems/number-of-1-bits/",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Apple",
      "Microsoft"
    ],
    "tags": [
      "Bit Manipulation"
    ],
    "algorithmId": "number-of-1-bits",
    "youtubeUrl": "https://www.youtube.com/watch?v=gVUrDV4tZfY",
    "useCases": [
      "Hamming weight calculation",
      "Error detection",
      "Binary analysis"
    ]
  },
  {
    "id": 13,
    "slug": "counting-bits",
    "title": "Counting Bits",
    "category": "Binary",
    "difficulty": "easy",
    "description": "Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.\n\nExample 1:\nInput: n = 2\nOutput: [0,1,1]\n\nExample 2:\nInput: n = 5\nOutput: [0,1,1,2,1,2]\n\nFollow-up: Can you do it in O(n) time? Use DP relationships between numbers to compute counts efficiently.",
    "leetcodeSearch": "https://leetcode.com/problems/counting-bits/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon"
    ],
    "tags": [
      "Dynamic Programming",
      "Bit Manipulation"
    ],
    "algorithmId": "counting-bits",
    "youtubeUrl": "https://www.youtube.com/watch?v=RyBM56RIWrM",
    "useCases": [
      "Dynamic programming",
      "Bit counting",
      "Pattern recognition"
    ]
  },
  {
    "id": 14,
    "slug": "missing-number",
    "title": "Missing Number",
    "category": "Binary",
    "difficulty": "easy",
    "description": "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.\n\nExample 1:\nInput: nums = [3,0,1]\nOutput: 2\n\nExample 2:\nInput: nums = [0,1]\nOutput: 2\n\nConstraints: You can solve it in O(n) time and O(1) additional space using XOR or arithmetic sum formula.",
    "leetcodeSearch": "https://leetcode.com/problems/missing-number/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "tags": [
      "Array",
      "Math",
      "Bit Manipulation"
    ],
    "algorithmId": "missing-number",
    "youtubeUrl": "https://www.youtube.com/watch?v=WnPLSRLSANE",
    "useCases": [
      "Data validation",
      "Sequence verification",
      "XOR properties"
    ]
  },
  {
    "id": 15,
    "slug": "reverse-bits",
    "title": "Reverse Bits",
    "category": "Binary",
    "difficulty": "easy",
    "description": "Reverse bits of a given 32 bits unsigned integer and return the resulting unsigned integer.\n\nExample 1:\nInput: n = 00000010100101000001111010011100\nOutput: 00111001011110000010100101000000 (which is 964176192 in decimal)\n\nExample 2:\nInput: n = 11111111111111111111111111111101\nOutput: 10111111111111111111111111111111\n\nNote: Consider bit-by-bit reversal; for multiple calls, use caching / lookup table to optimize.",
    "leetcodeSearch": "https://leetcode.com/problems/reverse-bits/",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Apple"
    ],
    "tags": [
      "Bit Manipulation",
      "Divide and Conquer"
    ],
    "algorithmId": "reverse-bits",
    "youtubeUrl": "https://www.youtube.com/watch?v=UcoN6UjAI64",
    "useCases": [
      "Bit reversal",
      "Network protocols",
      "Low-level operations"
    ]
  },
  {
    "id": 16,
    "slug": "climbing-stairs",
    "title": "Climbing Stairs",
    "category": "Dynamic Programming",
    "difficulty": "easy",
    "description": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nExample 1:\nInput: n = 2\nOutput: 2\nExplanation: (1+1), (2)\n\nExample 2:\nInput: n = 3\nOutput: 3\nExplanation: (1+1+1), (1+2), (2+1)\n\nNote: This is equivalent to computing Fibonacci numbers; you can solve with O(n) time and O(1) space.",
    "leetcodeSearch": "https://leetcode.com/problems/climbing-stairs/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Google",
      "Adobe"
    ],
    "tags": [
      "Dynamic Programming",
      "Math",
      "Memoization"
    ],
    "algorithmId": "climbing-stairs",
    "youtubeUrl": "https://www.youtube.com/watch?v=Y0lT9Fck7qI",
    "useCases": [
      "Fibonacci variations",
      "Path counting",
      "Dynamic programming intro"
    ]
  },
  {
    "id": 17,
    "slug": "coin-change",
    "title": "Coin Change",
    "category": "Dynamic Programming",
    "difficulty": "medium",
    "description": "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up by any combination of the coins, return -1.\n\nExample 1:\nInput: coins = [1,2,5], amount = 11\nOutput: 3\nExplanation: 11 = 5 + 5 + 1\n\nExample 2:\nInput: coins = [2], amount = 3\nOutput: -1\n\nConstraints: Use DP (unbounded knapsack style) building solutions from 0→amount to get O(n × amount) time and O(amount) space.",
    "leetcodeSearch": "https://leetcode.com/problems/coin-change/",
    "timeComplexity": "O(n × amount)",
    "spaceComplexity": "O(amount)",
    "companies": [
      "Amazon",
      "Bloomberg"
    ],
    "tags": [
      "Array",
      "Dynamic Programming",
      "BFS"
    ],
    "algorithmId": "coin-change",
    "youtubeUrl": "https://www.youtube.com/watch?v=H9bfqozjoqs",
    "useCases": [
      "Change making",
      "Minimum resource allocation",
      "Unbounded knapsack"
    ]
  },
  {
    "id": 18,
    "slug": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "category": "Dynamic Programming",
    "difficulty": "medium",
    "description": "Given an integer array nums, return the length of the longest strictly increasing subsequence.\n\nExample 1:\nInput: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: The longest increasing subsequence is [2,3,7,101]\n\nNote: Optimal O(n log n) solution uses patience sorting / tails array with binary search; DP is O(n²).",
    "leetcodeSearch": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "tags": [
      "Array",
      "Dynamic Programming",
      "Binary Search"
    ],
    "algorithmId": "longest-increasing-subsequence",
    "youtubeUrl": "https://www.youtube.com/watch?v=cjWnW0hdF1Y",
    "useCases": [
      "Patience sorting",
      "Stock trading patterns",
      "Sequence analysis"
    ]
  },
  {
    "id": 19,
    "slug": "longest-common-subsequence",
    "title": "Longest Common Subsequence",
    "category": "Dynamic Programming",
    "difficulty": "medium",
    "description": "Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.\n\nExample 1:\nInput: text1 = \"abcde\", text2 = \"ace\"\nOutput: 3\nExplanation: The longest common subsequence is \"ace\".\n\nNote: Typical DP builds a 2D table dp[i][j] representing LCS length for prefixes; time O(m × n) and space O(m × n) (can be optimized to O(min(m,n))).",
    "leetcodeSearch": "https://leetcode.com/problems/longest-common-subsequence/",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(m × n)",
    "companies": [
      "Google",
      "Amazon"
    ],
    "tags": [
      "String",
      "Dynamic Programming"
    ],
    "algorithmId": "longest-common-subsequence",
    "youtubeUrl": "https://www.youtube.com/watch?v=Ua0GhsJSlWM",
    "useCases": [
      "Diff algorithms",
      "DNA sequence alignment",
      "Text comparison"
    ]
  },
  {
    "id": 20,
    "slug": "word-break-problem",
    "title": "Word Break Problem",
    "category": "Dynamic Programming",
    "difficulty": "medium",
    "description": "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.\n\nExample 1:\nInput: s = \"leetcode\", wordDict = [\"leet\",\"code\"]\nOutput: true\n\nExample 2:\nInput: s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]\nOutput: true\n\nConstraints: Use DP with a boolean dp array where dp[i] indicates whether s[0:i] can be segmented; optimize with a Trie or limiting check lengths for speed.",
    "leetcodeSearch": "https://leetcode.com/problems/word-break/",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Amazon",
      "Facebook",
      "Google"
    ],
    "tags": [
      "Hash Table",
      "String",
      "Dynamic Programming"
    ],
    "algorithmId": "word-break",
    "youtubeUrl": "https://www.youtube.com/watch?v=Sx9NNgInc3A",
    "useCases": [
      "Text tokenization",
      "String segmentation",
      "Dictionary lookup"
    ]
  },
  {
    "id": 21,
    "slug": "combination-sum",
    "title": "Combination Sum",
    "category": "Dynamic Programming",
    "difficulty": "medium",
    "description": "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.\n\nYou may return the combinations in any order. The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.\n\nThe test cases are generated such that the number of unique combinations that sum up to target is less than 150 for the given input.\n\nExample:\nInput: candidates = [2,3,6,7], target = 7\nOutput: [[2,2,3],[7]]\n\nConstraints:\n• 1 <= candidates.length <= 30\n• 1 <= candidates[i] <= 200\n• All elements of candidates are distinct\n• 1 <= target <= 500",
    "leetcodeSearch": "https://leetcode.com/problems/combination-sum/",
    "timeComplexity": "O(n^(target/minCandidate + 1)) (worst-case backtracking)",
    "spaceComplexity": "O(target/minCandidate) + output size",
    "companies": [
      "Amazon",
      "Facebook"
    ],
    "tags": [
      "Array",
      "Backtracking"
    ],
    "algorithmId": "combination-sum",
    "youtubeUrl": "https://www.youtube.com/watch?v=GBKI9VSKdGg",
    "useCases": [
      "Subset problems",
      "Backtracking patterns",
      "Combinatorial search"
    ]
  },
  {
    "id": 22,
    "slug": "house-robber",
    "title": "House Robber",
    "category": "Dynamic Programming",
    "difficulty": "medium",
    "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected that will alert the police if two adjacent houses are broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.\n\nExample:\nInput: nums = [2,7,9,3,1]\nOutput: 12\nExplanation: Rob houses with values 2, 9, 1 (or 7, 3, 1) depending on indices.\n\nConstraints:\n• 1 <= nums.length <= 100\n• 0 <= nums[i] <= 400\n\nNote: A common DP solution uses dp[i] = max(dp[i-1], dp[i-2] + nums[i]) and can be optimized to O(1) space by tracking two variables.",
    "leetcodeSearch": "https://leetcode.com/problems/house-robber/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "LinkedIn"
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "algorithmId": "house-robber",
    "youtubeUrl": "https://www.youtube.com/watch?v=73r3KWiEvyk"
  },
  {
    "id": 23,
    "slug": "house-robber-ii",
    "title": "House Robber II",
    "category": "Dynamic Programming",
    "difficulty": "medium",
    "description": "All houses are arranged in a circle. That means the first house is the neighbor of the last one. Adjacent houses cannot both be robbed.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob without alerting the police.\n\nBecause of the circular arrangement, you cannot rob both the first and last houses; the typical approach splits into two linear cases: rob houses from index 0..n-2 or 1..n-1 and take the max.\n\nExample:\nInput: nums = [2,3,2]\nOutput: 3\n\nConstraints:\n• 1 <= nums.length <= 100\n• 0 <= nums[i] <= 1000",
    "leetcodeSearch": "https://leetcode.com/problems/house-robber-ii/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "algorithmId": "house-robber-ii",
    "youtubeUrl": "https://www.youtube.com/watch?v=rWAJCfYYOvM"
  },
  {
    "id": 24,
    "slug": "decode-ways",
    "title": "Decode Ways",
    "category": "Dynamic Programming",
    "difficulty": "medium",
    "description": "A message containing letters from A–Z can be encoded into numbers using the mapping 'A' -> \"1\", 'B' -> \"2\", ..., 'Z' -> \"26\".\n\nGiven a string s containing only digits, return the number of ways to decode it. The answer is guaranteed to fit in a 32-bit integer.\n\nExample:\nInput: s = \"12\"\nOutput: 2\nExplanation: \"AB\" or \"L\".\n\nInput: s = \"226\"\nOutput: 3\nExplanation: \"BZ\", \"VF\", \"BBF\".\n\nConstraints:\n• 1 <= s.length <= 100\n• s contains only digits and may include '0' which has special handling (e.g., '0' cannot be decoded alone).\n\nTypical DP recurrence: ways[i] = ways[i-1] (if s[i] is valid single-digit) + ways[i-2] (if s[i-1..i] is a valid two-digit decode between 10 and 26).",
    "leetcodeSearch": "https://leetcode.com/problems/decode-ways/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Facebook",
      "Google"
    ],
    "tags": [
      "String",
      "Dynamic Programming"
    ],
    "algorithmId": "decode-ways",
    "youtubeUrl": "https://www.youtube.com/watch?v=6aEyTjOwlJU"
  },
  {
    "id": 25,
    "slug": "unique-paths",
    "title": "Unique Paths",
    "category": "Dynamic Programming",
    "difficulty": "medium",
    "description": "There is a robot on an m × n grid. The robot is initially located at the top-left corner (0, 0). The robot tries to move to the bottom-right corner (m-1, n-1). The robot can only move either down or right at any point in time.\n\nGiven the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.\n\nExample:\nInput: m = 3, n = 7\nOutput: 28\n\nConstraints:\n• 1 <= m, n <= 100\n\nSolutions: DP with dp[i][j] = dp[i-1][j] + dp[i][j-1] or combinatorics using binomial coefficients C(m+n-2, m-1). Time: O(m × n).",
    "leetcodeSearch": "https://leetcode.com/problems/unique-paths/",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(m × n)",
    "companies": [
      "Google",
      "Bloomberg"
    ],
    "tags": [
      "Math",
      "Dynamic Programming",
      "Combinatorics"
    ],
    "algorithmId": "unique-paths",
    "youtubeUrl": "https://www.youtube.com/watch?v=IlEsdxuD4lY",
    "useCases": [
      "Grid path counting",
      "Robot navigation",
      "Combinatorics"
    ]
  },
  {
    "id": 26,
    "slug": "jump-game",
    "title": "Jump Game",
    "category": "Dynamic Programming",
    "difficulty": "medium",
    "description": "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.\n\nExample:\nInput: nums = [2,3,1,1,4]\nOutput: true\n\nInput: nums = [3,2,1,0,4]\nOutput: false\n\nConstraints:\n• 1 <= nums.length <= 10^4\n• 0 <= nums[i] <= 10^5\n\nCommon greedy solution: track the farthest reachable index while iterating; if at any index i the farthest reachable index < i, return false.",
    "leetcodeSearch": "https://leetcode.com/problems/jump-game/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "tags": [
      "Array",
      "Dynamic Programming",
      "Greedy"
    ],
    "algorithmId": "jump-game",
    "youtubeUrl": "https://www.youtube.com/watch?v=Yan0cv2cLy8"
  },
  {
    "id": 27,
    "slug": "clone-graph",
    "title": "Clone Graph",
    "category": "Graph",
    "difficulty": "medium",
    "description": "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value and a list (or array) of its neighbors. You must return the cloned node corresponding to the given node.\n\nThe graph is represented using adjacency lists and each node's value is unique.\n\nExample:\nInput: adjacency list = [[2,4],[1,3],[2,4],[1,3]]\nOutput: deep copy of the same adjacency structure.\n\nConstraints:\n• 1 <= number of nodes <= 100\n• Node values are 1..100\n\nTypical solutions: use DFS or BFS with a hashmap mapping original node -> cloned node to avoid revisiting nodes and to handle cycles.",
    "leetcodeSearch": "https://leetcode.com/problems/clone-graph/",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "companies": [
      "Facebook",
      "Amazon",
      "Google"
    ],
    "tags": [
      "Hash Table",
      "DFS",
      "BFS",
      "Graph"
    ],
    "algorithmId": "clone-graph",
    "youtubeUrl": "https://www.youtube.com/watch?v=mQeF6bN8hMk",
    "useCases": [
      "Deep copying",
      "Graph traversal",
      "Object cloning"
    ]
  },
  {
    "id": 28,
    "slug": "course-schedule",
    "title": "Course Schedule",
    "category": "Graph",
    "difficulty": "medium",
    "description": "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nReturn true if you can finish all courses. Otherwise, return false. This is equivalent to detecting whether the directed graph of prerequisites contains a cycle.\n\nExample:\nInput: numCourses = 2, prerequisites = [[1,0]]\nOutput: true\n\nConstraints:\n• 1 <= numCourses <= 10^5\n• 0 <= prerequisites.length <= 10^5\n\nTypical approaches: Kahn's algorithm (topological sort / indegree) or DFS cycle detection.",
    "leetcodeSearch": "https://leetcode.com/problems/course-schedule/",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "companies": [
      "Amazon",
      "Facebook",
      "Google"
    ],
    "tags": [
      "DFS",
      "BFS",
      "Graph",
      "Topological Sort"
    ],
    "algorithmId": "course-schedule",
    "youtubeUrl": "https://www.youtube.com/watch?v=EgI5nU9etnU",
    "useCases": [
      "Cycle detection",
      "Topological sorting",
      "Dependency resolution"
    ]
  },
  {
    "id": 29,
    "slug": "pacific-atlantic-water-flow",
    "title": "Pacific Atlantic Water Flow",
    "category": "Graph",
    "difficulty": "medium",
    "description": "There is an m × n rectangular grid heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c). The island touches both the Pacific and Atlantic oceans: the Pacific ocean touches the island's left and top edges, and the Atlantic ocean touches the island's right and bottom edges.\n\nWater can only flow from a cell to neighboring cells (north, south, east, west) with height less than or equal to the current cell's height. Return a list of grid coordinates where water can flow to both the Pacific and Atlantic oceans.\n\nExample:\nInput:\nheights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\nOutput: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]\n\nConstraints:\n• 1 <= m, n <= 200\n\nStandard solution: run two BFS/DFS traversals from the ocean borders (one for Pacific, one for Atlantic) marking reachable cells and return cells reachable in both.",
    "leetcodeSearch": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(m × n)",
    "companies": [
      "Google",
      "Amazon"
    ],
    "tags": [
      "Array",
      "DFS",
      "BFS",
      "Matrix"
    ],
    "algorithmId": "pacific-atlantic",
    "youtubeUrl": "https://www.youtube.com/watch?v=s-VkcjHqkGI",
    "useCases": [
      "Water flow simulation",
      "Multi-source BFS/DFS",
      "Grid traversal"
    ]
  },
  {
    "id": 30,
    "slug": "number-of-islands",
    "title": "Number of Islands",
    "category": "Graph",
    "difficulty": "medium",
    "description": "Given an m × n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\nExample:\nInput:\ngrid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]\nOutput: 3\n\nConstraints:\n• m == grid.length\n• n == grid[i].length\n• 1 <= m, n <= 300\n• grid[i][j] is '0' or '1'\n\nTypical solutions: DFS or BFS flood-fill to mark visited land, or Union-Find.",
    "leetcodeSearch": "https://leetcode.com/problems/number-of-islands/",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(m × n)",
    "companies": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "tags": [
      "Array",
      "DFS",
      "BFS",
      "Union Find",
      "Matrix"
    ],
    "algorithmId": "num-islands",
    "youtubeUrl": "https://www.youtube.com/watch?v=pV2kpPD66nE",
    "useCases": [
      "Connected components",
      "Flood fill",
      "Image processing"
    ]
  },
  {
    "id": 31,
    "slug": "longest-consecutive-sequence",
    "title": "Longest Consecutive Sequence",
    "category": "Graph",
    "difficulty": "medium",
    "description": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.\n\nExample:\nInput: nums = [100,4,200,1,3,2]\nOutput: 4\nExplanation: The longest consecutive sequence is [1,2,3,4].\n\nConstraints:\n• Use a hash set to allow O(1) checks for sequence starts and expand from starts to get O(n) time.",
    "leetcodeSearch": "https://leetcode.com/problems/longest-consecutive-sequence/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Amazon",
      "Google",
      "Facebook"
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Union Find"
    ],
    "algorithmId": "longest-consecutive-sequence",
    "youtubeUrl": "https://www.youtube.com/watch?v=P6RZZMu_maU"
  },
  {
    "id": 32,
    "slug": "alien-dictionary",
    "title": "Alien Dictionary (Leetcode Premium)",
    "category": "Graph",
    "difficulty": "hard",
    "description": "There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you.\n\nYou are given a list of strings words from the alien language's dictionary, where the strings in words are sorted lexicographically by the rules of this new language. Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. If the ordering is invalid, return \"\".\n\nExample:\nInput: words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]\nOutput: \"wertf\"\n\nConstraints:\n• Typical time: O(V + E) where V = number of unique letters and E = constraints between letters\n\nNotes: build a graph of letter orderings and perform topological sort; detect cycles for invalid ordering.",
    "leetcodeSearch": "https://leetcode.com/problems/alien-dictionary/",
    "timeComplexity": "O(C) (≈ O(V + E))",
    "spaceComplexity": "O(V + E)",
    "companies": [
      "Facebook",
      "Google",
      "Airbnb"
    ],
    "tags": [
      "Array",
      "String",
      "DFS",
      "BFS",
      "Graph",
      "Topological Sort"
    ],
    "algorithmId": "alien-dictionary",
    "youtubeUrl": "https://www.youtube.com/watch?v=6kTZYvNNyps"
  },
  {
    "id": 33,
    "slug": "graph-valid-tree",
    "title": "Graph Valid Tree (Leetcode Premium)",
    "category": "Graph",
    "difficulty": "medium",
    "description": "You have a graph of n nodes labeled from 0 to n - 1. You are given an integer n and a list of edges where edges[i] = [ai, bi] indicates that there is an undirected edge between nodes ai and bi in the graph.\n\nReturn true if the edges of the given graph make up a valid tree, and false otherwise. A valid tree must be connected and contain no cycles.\n\nExample:\nInput: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]\nOutput: true\n\nTypical approaches: check that edges = n-1 and graph is connected (via DFS/BFS) or use Union-Find to detect cycles and connectivity.",
    "leetcodeSearch": "https://leetcode.com/problems/graph-valid-tree/",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "companies": [
      "Facebook",
      "Google",
      "Amazon"
    ],
    "tags": [
      "DFS",
      "BFS",
      "Union Find",
      "Graph"
    ],
    "algorithmId": "graph-valid-tree",
    "youtubeUrl": "https://www.youtube.com/watch?v=bXsUuownnoQ"
  },
  {
    "id": 34,
    "slug": "number-of-connected-components-in-an-undirected-graph",
    "title": "Number of Connected Components in an Undirected Graph (Leetcode Premium)",
    "category": "Graph",
    "difficulty": "medium",
    "description": "You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph.\n\nReturn the number of connected components in the graph.\n\nExample:\nInput: n = 5, edges = [[0,1],[1,2],[3,4]]\nOutput: 2\n\nTypical solutions: DFS/BFS to count components or Union-Find for efficient union operations.",
    "leetcodeSearch": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "companies": [
      "Amazon",
      "Facebook",
      "Google"
    ],
    "tags": [
      "DFS",
      "BFS",
      "Union Find",
      "Graph"
    ],
    "algorithmId": "connected-components",
    "youtubeUrl": "https://www.youtube.com/watch?v=8f1XPm4WOUc"
  },
  {
    "id": 35,
    "slug": "insert-interval",
    "title": "Insert Interval",
    "category": "Interval",
    "difficulty": "medium",
    "description": "You are given an array of non-overlapping intervals where intervals[i] = [starti, endi] represent the start and the end of the i-th interval and intervals is sorted in ascending order by starti.\n\nYou are also given an interval newInterval = [start, end] that represents the start and end of another interval. Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge if necessary).\n\nExample:\nInput: intervals = [[1,3],[6,9]], newInterval = [2,5]\nOutput: [[1,5],[6,9]]",
    "leetcodeSearch": "https://leetcode.com/problems/insert-interval/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Facebook",
      "Google",
      "LinkedIn"
    ],
    "tags": [
      "Array"
    ],
    "algorithmId": "insert-interval",
    "youtubeUrl": "https://www.youtube.com/watch?v=A8NUOmlwOlM"
  },
  {
    "id": 36,
    "slug": "merge-intervals",
    "title": "Merge Intervals",
    "category": "Interval",
    "difficulty": "medium",
    "description": "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\nExample:\nInput: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]",
    "leetcodeSearch": "https://leetcode.com/problems/merge-intervals/",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Facebook",
      "Amazon",
      "Google"
    ],
    "tags": [
      "Array",
      "Sorting"
    ],
    "algorithmId": "merge-intervals",
    "youtubeUrl": "https://www.youtube.com/watch?v=44H3cEC2fFM"
  },
  {
    "id": 37,
    "slug": "non-overlapping-intervals",
    "title": "Non-overlapping Intervals",
    "category": "Interval",
    "difficulty": "medium",
    "description": "Given an array of intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.\n\nNote: intervals that only touch at a point are non-overlapping.\n\nExample:\nInput: intervals = [[1,2],[2,3],[3,4],[1,3]]\nOutput: 1",
    "leetcodeSearch": "https://leetcode.com/problems/non-overlapping-intervals/",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Facebook",
      "Amazon"
    ],
    "tags": [
      "Array",
      "Dynamic Programming",
      "Greedy",
      "Sorting"
    ],
    "algorithmId": "non-overlapping-intervals",
    "youtubeUrl": "https://www.youtube.com/watch?v=nONCGxWoUfM"
  },
  {
    "id": 38,
    "slug": "meeting-rooms",
    "title": "Meeting Rooms (Leetcode Premium)",
    "category": "Interval",
    "difficulty": "easy",
    "description": "Given an array of meeting time intervals where intervals[i] = [starti, endi], determine if a person could attend all meetings (i.e., the intervals do not overlap).\n\nExample:\nInput: intervals = [[0,30],[5,10],[15,20]]\nOutput: false\n\nTypical approach: sort intervals by start time and check for overlaps.",
    "leetcodeSearch": "https://leetcode.com/problems/meeting-rooms/",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Facebook",
      "Amazon"
    ],
    "tags": [
      "Array",
      "Sorting"
    ],
    "algorithmId": "meeting-rooms",
    "youtubeUrl": "https://www.youtube.com/watch?v=PaJxqZVPhbg&t=67s"
  },
  {
    "id": 39,
    "slug": "meeting-rooms-ii",
    "title": "Meeting Rooms II (Leetcode Premium)",
    "category": "Interval",
    "difficulty": "medium",
    "description": "Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.\n\nExample:\nInput: intervals = [[0,30],[5,10],[15,20]]\nOutput: 2\n\nTypical approach: sort by start time and use a min-heap of end times or two-pointer sweep.",
    "leetcodeSearch": "https://leetcode.com/problems/meeting-rooms-ii/",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Facebook",
      "Amazon",
      "Google"
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Greedy",
      "Sorting",
      "Heap"
    ],
    "algorithmId": "meeting-rooms-ii",
    "youtubeUrl": "https://www.youtube.com/watch?v=FdzJmTCVyJU"
  },
  {
    "id": 40,
    "slug": "reverse-linked-list",
    "title": "Reverse a Linked List",
    "category": "Linked List",
    "difficulty": "easy",
    "description": "Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nExample:\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]\n\nApproaches: iterative pointer reversal (prev, curr, next) or recursion.",
    "leetcodeSearch": "https://leetcode.com/problems/reverse-linked-list/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft",
      "Apple"
    ],
    "tags": [
      "Linked List",
      "Recursion"
    ],
    "algorithmId": "reverse-linked-list",
    "youtubeUrl": "https://www.youtube.com/watch?v=G0_I-ZF0S38"
  },
  {
    "id": 41,
    "slug": "detect-cycle-in-a-linked-list",
    "title": "Detect Cycle in a Linked List",
    "category": "Linked List",
    "difficulty": "easy",
    "description": "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.\n\nExample:\nInput: head = [3,2,0,-4] with pos = 1\nOutput: true\n\nTypical solution: Floyd's Tortoise and Hare (two-pointer) or use a visited set.",
    "leetcodeSearch": "https://leetcode.com/problems/linked-list-cycle/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft",
      "Bloomberg"
    ],
    "tags": [
      "Hash Table",
      "Linked List",
      "Two Pointers"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=gBTe7lFR3vc"
  },
  {
    "id": 42,
    "slug": "merge-two-sorted-lists",
    "title": "Merge Two Sorted Lists",
    "category": "Linked List",
    "difficulty": "easy",
    "description": "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\nExample:\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]",
    "leetcodeSearch": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "timeComplexity": "O(n + m)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "tags": [
      "Linked List",
      "Recursion"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=XIdigk956u0"
  },
  {
    "id": 43,
    "slug": "merge-k-sorted-lists",
    "title": "Merge K Sorted Lists",
    "category": "Linked List",
    "difficulty": "hard",
    "description": "You are given an array of k sorted linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.\n\nExample:\nInput: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]\n\nApproaches: use a min-heap (priority queue) or divide and conquer merging.",
    "leetcodeSearch": "https://leetcode.com/problems/merge-k-sorted-lists/",
    "timeComplexity": "O(N log k)",
    "spaceComplexity": "O(k)",
    "companies": [
      "Amazon",
      "Facebook",
      "Google"
    ],
    "tags": [
      "Linked List",
      "Divide and Conquer",
      "Heap",
      "Merge Sort"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=XIdigk956u0"
  },
  {
    "id": 44,
    "slug": "remove-nth-node-from-end-of-list",
    "title": "Remove Nth Node From End Of List",
    "category": "Linked List",
    "difficulty": "medium",
    "description": "Given the head of a linked list, remove the nth node from the end of the list and return its head.\n\nExample:\nInput: head = [1,2,3,4,5], n = 2\nOutput: [1,2,3,5]\n\nOne-pass solution: dummy node + two pointers spaced n apart.",
    "leetcodeSearch": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "tags": [
      "Linked List",
      "Two Pointers"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=XVuQxVej6y8"
  },
  {
    "id": 45,
    "slug": "reorder-list",
    "title": "Reorder List",
    "category": "Linked List",
    "difficulty": "medium",
    "description": "You are given the head of a singly linked-list. The list can be represented as: L0 → L1 → … → Ln-1 → Ln.\n\nReorder the list to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …. You must do this in-place without altering the nodes' values.\n\nTypical approach: find middle with fast/slow, reverse second half, then merge the halves alternately.",
    "leetcodeSearch": "https://leetcode.com/problems/reorder-list/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Facebook",
      "Amazon"
    ],
    "tags": [
      "Linked List",
      "Two Pointers",
      "Stack",
      "Recursion"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=S5bfdUTrKLM"
  },
  {
    "id": 46,
    "slug": "set-matrix-zeroes",
    "title": "Set Matrix Zeroes",
    "category": "Matrix",
    "difficulty": "medium",
    "description": "Given an m × n integer matrix, if an element is 0, set its entire row and column to 0s. You must do it in place.\n\nExample:\nInput: matrix = [[1,1,1],[1,0,1],[1,1,1]]\nOutput: [[1,0,1],[0,0,0],[1,0,1]]\n\nApproach: use first row/column as markers or two boolean arrays; handle first row/col specially to avoid overwriting markers.",
    "leetcodeSearch": "https://leetcode.com/problems/set-matrix-zeroes/",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Matrix"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=T41rL0L3Pnw"
  },
  {
    "id": 47,
    "slug": "spiral-matrix",
    "title": "Spiral Matrix",
    "category": "Matrix",
    "difficulty": "medium",
    "description": "Given an m × n matrix, return all elements of the matrix in spiral order.\n\nExample:\nInput: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1,2,3,6,9,8,7,4,5]\n\nApproach: maintain top, bottom, left, right boundaries and traverse right → down → left → up while shrinking boundaries.",
    "leetcodeSearch": "https://leetcode.com/problems/spiral-matrix/",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "tags": [
      "Array",
      "Matrix",
      "Simulation"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=BJnMZNwUk1M"
  },
  {
    "id": 48,
    "slug": "rotate-image",
    "title": "Rotate Image",
    "category": "Matrix",
    "difficulty": "medium",
    "description": "You are given an n × n 2D matrix representing an image. Rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.\n\nExample:\nInput: [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]\n\nNote: Do not allocate another 2D matrix. (source: https://leetcode.com/problems/rotate-image/)",
    "leetcodeSearch": "https://leetcode.com/problems/rotate-image/",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft",
      "Apple"
    ],
    "tags": [
      "Array",
      "Math",
      "Matrix"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=fMSJSS7eO1w"
  },
  {
    "id": 49,
    "slug": "word-search",
    "title": "Word Search",
    "category": "Matrix",
    "difficulty": "medium",
    "description": "Given an m × n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same cell may not be used more than once.\n\nExample:\nInput: board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'\nOutput: true\n\n(source: https://leetcode.com/problems/word-search/)",
    "leetcodeSearch": "https://leetcode.com/problems/word-search/",
    "timeComplexity": "O(m × n × 4^L)",
    "spaceComplexity": "O(L)",
    "companies": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "tags": [
      "Array",
      "Backtracking",
      "Matrix"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=pfiQ_PS1g8E"
  },
  {
    "id": 50,
    "slug": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "category": "String",
    "difficulty": "medium",
    "description": "Given a string s, find the length of the longest substring in which no character appears more than once.\n\nExample 1:\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with length 3.\n\nExample 2:\nInput: s = \"bbbbb\"\nOutput: 1\nExplanation: The answer is \"b\", with length 1.\n\nConstraints: 0 <= s.length <= 5 * 10^4; s consists of English letters, digits, symbols and spaces.",
    "leetcodeSearch": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(min(m,n))",
    "companies": [
      "Amazon",
      "Facebook",
      "Bloomberg"
    ],
    "tags": [
      "Hash Table",
      "String",
      "Sliding Window"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=wiGpQwVHdE0"
  },
  {
    "id": 51,
    "slug": "longest-repeating-character-replacement",
    "title": "Longest Repeating Character Replacement",
    "category": "String",
    "difficulty": "medium",
    "description": "You are given a string s and an integer k. You may change at most k characters in s; each change converts one character to any other uppercase English letter. Return the length of the longest substring containing the same letter you can obtain after performing at most k changes.\n\nExample 1:\nInput: s = \"ABAB\", k = 2\nOutput: 4\nExplanation: Replace the two 'A's with 'B's or vice versa to obtain \"BBBB\" or \"AAAA\" of length 4.\n\nExample 2:\nInput: s = \"AABABBA\", k = 1\nOutput: 4\nExplanation: Replace the one 'A' in the substring \"ABBA\" to get \"BBBB\".\n\nConstraints: 1 <= s.length <= 10^5; s consists of uppercase English letters; 0 <= k <= s.length.",
    "leetcodeSearch": "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Google"
    ],
    "tags": [
      "Hash Table",
      "String",
      "Sliding Window"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=gqXU1UyA8pk"
  },
  {
    "id": 52,
    "slug": "minimum-window-substring",
    "title": "Minimum Window Substring",
    "category": "String",
    "difficulty": "hard",
    "description": "Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".\n\nExample 1:\nInput: s = \"ADOBECODEBANC\", t = \"ABC\"\nOutput: \"BANC\"\n\nExample 2:\nInput: s = \"a\", t = \"a\"\nOutput: \"a\"\n\nConstraints: 1 <= s.length, t.length <= 10^5; s and t consist of ASCII characters.",
    "leetcodeSearch": "https://leetcode.com/problems/minimum-window-substring/",
    "timeComplexity": "O(m + n)",
    "spaceComplexity": "O(m + n)",
    "companies": [
      "Facebook",
      "Amazon",
      "LinkedIn"
    ],
    "tags": [
      "Hash Table",
      "String",
      "Sliding Window"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=jSto0O4AJbM"
  },
  {
    "id": 53,
    "slug": "valid-anagram",
    "title": "Valid Anagram",
    "category": "String",
    "difficulty": "easy",
    "description": "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram means the two strings contain the same characters with the same frequencies.\n\nExample 1:\nInput: s = \"anagram\", t = \"nagaram\"\nOutput: true\n\nExample 2:\nInput: s = \"rat\", t = \"car\"\nOutput: false\n\nConstraints: 1 <= s.length, t.length <= 5 * 10^4; s and t consist of lowercase English letters.",
    "leetcodeSearch": "https://leetcode.com/problems/valid-anagram/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Facebook",
      "Bloomberg"
    ],
    "tags": [
      "Hash Table",
      "String",
      "Sorting"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=9UtInBqnCgA"
  },
  {
    "id": 54,
    "slug": "group-anagrams",
    "title": "Group Anagrams",
    "category": "String",
    "difficulty": "medium",
    "description": "Given an array of strings strs, group the anagrams together. You may return the answer in any order.\n\nExample 1:\nInput: strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\nOutput: [[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]\n\nConstraints: 1 <= strs.length <= 10^4; 0 <= strs[i].length <= 100; strs[i] consists of lowercase English letters. The sum of all strs[i].length is ≤ 10^5.",
    "leetcodeSearch": "https://leetcode.com/problems/group-anagrams/",
    "timeComplexity": "O(n × k log k)",
    "spaceComplexity": "O(n × k)",
    "companies": [
      "Amazon",
      "Facebook",
      "Bloomberg"
    ],
    "tags": [
      "Array",
      "Hash Table",
      "String",
      "Sorting"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=vzdNOK2oB2E&t=1s"
  },
  {
    "id": 55,
    "slug": "valid-parentheses",
    "title": "Valid Parentheses",
    "category": "String",
    "difficulty": "easy",
    "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: (1) Open brackets are closed by the same type of brackets, and (2) Open brackets are closed in the correct order.\n\nExample 1:\nInput: s = \"()\"\nOutput: true\n\nExample 2:\nInput: s = \"([)]\"\nOutput: false\n\nConstraints: 1 <= s.length <= 10^4; s consists only of the characters '(', ')', '{', '}', '[' and ']'.",
    "leetcodeSearch": "https://leetcode.com/problems/valid-parentheses/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Amazon",
      "Facebook",
      "Bloomberg"
    ],
    "tags": [
      "String",
      "Stack"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=WTzjTskDFMg"
  },
  {
    "id": 56,
    "slug": "valid-palindrome",
    "title": "Valid Palindrome",
    "category": "String",
    "difficulty": "easy",
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.\n\nExample 1:\nInput: s = \"A man, a plan, a canal: Panama\"\nOutput: true\n\nExample 2:\nInput: s = \"race a car\"\nOutput: false\n\nConstraints: 1 <= s.length <= 2 * 10^5; s consists of printable ASCII characters.",
    "leetcodeSearch": "https://leetcode.com/problems/valid-palindrome/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Facebook",
      "Amazon",
      "Microsoft"
    ],
    "tags": [
      "Two Pointers",
      "String"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=jJXJ16kPFWg&t=25s"
  },
  {
    "id": 57,
    "slug": "longest-palindromic-substring",
    "title": "Longest Palindromic Substring",
    "category": "String",
    "difficulty": "medium",
    "description": "Given a string s, return the longest palindromic substring in s.\n\nExample 1:\nInput: s = \"babad\"\nOutput: \"bab\"\nNote: \"aba\" is also a valid answer.\n\nExample 2:\nInput: s = \"cbbd\"\nOutput: \"bb\"\n\nConstraints: 1 <= s.length <= 1000; s consists of only ASCII characters.",
    "leetcodeSearch": "https://leetcode.com/problems/longest-palindromic-substring/",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "tags": [
      "String",
      "Dynamic Programming"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=XYQecbcd6_c"
  },
  {
    "id": 58,
    "slug": "palindromic-substrings",
    "title": "Palindromic Substrings",
    "category": "String",
    "difficulty": "medium",
    "description": "Given a string s, return the number of palindromic substrings in it. A substring is palindromic if it reads the same backward as forward.\n\nExample 1:\nInput: s = \"abc\"\nOutput: 3\nExplanation: Three palindromic substrings: \"a\", \"b\", \"c\".\n\nExample 2:\nInput: s = \"aaa\"\nOutput: 6\nExplanation: Six palindromic substrings: \"a\",\"a\",\"a\",\"aa\",\"aa\",\"aaa\".\n\nConstraints: 1 <= s.length <= 1000; s consists of lowercase English letters.",
    "leetcodeSearch": "https://leetcode.com/problems/palindromic-substrings/",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Facebook",
      "Amazon"
    ],
    "tags": [
      "String",
      "Dynamic Programming"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=4RACzI5-du8"
  },
  {
    "id": 59,
    "slug": "encode-and-decode-strings",
    "title": "Encode and Decode Strings (LeetCode Premium)",
    "category": "String",
    "difficulty": "medium",
    "description": "Design an algorithm to encode a list of strings to a single string. The encoded string is sent over the network and should be decoded back to the original list of strings.\n\nExample:\nInput: [\"lint\",\"code\",\"love\",\"you\"]\nOutput (one possible encoding): \"4#lint4#code4#love3#you\"\n\nConstraints: 1 <= total length of all strings <= 10^5; Strings may contain any characters.",
    "leetcodeSearch": "https://leetcode.com/problems/encode-and-decode-strings/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "companies": [
      "Google",
      "Facebook"
    ],
    "tags": [
      "Array",
      "String",
      "Design"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=B1k_sxOSgv8"
  },
  {
    "id": 60,
    "slug": "maximum-depth-of-binary-tree",
    "title": "Maximum Depth of Binary Tree",
    "category": "Tree",
    "difficulty": "easy",
    "description": "Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\nExample 1:\nInput: root = [3,9,20,null,null,15,7]\nOutput: 3\n\nConstraints: The number of nodes in the tree is in the range [0, 10^4]; -1000 <= Node.val <= 1000.",
    "leetcodeSearch": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "companies": [
      "Amazon",
      "LinkedIn"
    ],
    "tags": [
      "Tree",
      "DFS",
      "BFS"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=hTM3phVI6YQ"
  },
  {
    "id": 61,
    "slug": "same-tree",
    "title": "Same Tree",
    "category": "Tree",
    "difficulty": "easy",
    "description": "Given the roots of two binary trees p and q, write a function to check if they are the same tree. Two binary trees are the same if they are structurally identical and the nodes have the same values.\n\nExample 1:\nInput: p = [1,2,3], q = [1,2,3]\nOutput: true\n\nExample 2:\nInput: p = [1,2], q = [1,null,2]\nOutput: false\n\nConstraints: The number of nodes in both trees is in the range [0, 100]; -10^4 <= Node.val <= 10^4.",
    "leetcodeSearch": "https://leetcode.com/problems/same-tree/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "companies": [
      "Amazon",
      "Bloomberg"
    ],
    "tags": [
      "Tree",
      "DFS",
      "BFS"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=vRbbcKXCxOw"
  },
  {
    "id": 62,
    "slug": "invert-binary-tree",
    "title": "Invert/Flip Binary Tree",
    "category": "Tree",
    "difficulty": "easy",
    "description": "Given the root of a binary tree, invert the tree and return its root.\n\nExample 1:\nInput: root = [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]\n\nConstraints: The number of nodes in the tree is in the range [0, 100]; -100 <= Node.val <= 100.",
    "leetcodeSearch": "https://leetcode.com/problems/invert-binary-tree/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "companies": [
      "Google",
      "Amazon",
      "Bloomberg"
    ],
    "tags": [
      "Tree",
      "DFS",
      "BFS"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=OnSn2XEQ4MY"
  },
  {
    "id": 63,
    "slug": "binary-tree-maximum-path-sum",
    "title": "Binary Tree Maximum Path Sum",
    "category": "Tree",
    "difficulty": "hard",
    "description": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node may appear at most once in the sequence. Given the root of a binary tree, return the maximum path sum of any non-empty path.\n\nExample 1:\nInput: root = [1,2,3]\nOutput: 6\n\nExample 2:\nInput: root = [-10,9,20,null,null,15,7]\nOutput: 42\n\nConstraints: The number of nodes in the tree is in the range [1, 3 * 10^4]; -1000 <= Node.val <= 1000.",
    "leetcodeSearch": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "companies": [
      "Facebook",
      "Amazon",
      "Microsoft"
    ],
    "tags": [
      "Dynamic Programming",
      "Tree",
      "DFS"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=Hr5cWUld4vU"
  },
  {
    "id": 64,
    "slug": "binary-tree-level-order-traversal",
    "title": "Binary Tree Level Order Traversal",
    "category": "Tree",
    "difficulty": "medium",
    "description": "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).\n\nExample 1:\nInput: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]\n\nConstraints: The number of nodes in the tree is in the range [0, 10^4].",
    "leetcodeSearch": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "tags": [
      "Tree",
      "BFS"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=6ZnyEApgFYg"
  },
  {
    "id": 65,
    "slug": "serialize-and-deserialize-binary-tree",
    "title": "Serialize and Deserialize Binary Tree",
    "category": "Tree",
    "difficulty": "hard",
    "description": "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored or transmitted. Design an algorithm to serialize a binary tree to a string and deserialize the string to reconstruct the original tree. There is no restriction on how your serialization/deserialization should work, but they must be consistent.\n\nExample:\nInput: root = [1,2,3,null,null,4,5]\nOutput: (serialized string and then tree reconstructed to original)\n\nConstraints: The number of nodes in the tree is in the range [0, 10^4]; -1000 <= Node.val <= 1000.",
    "leetcodeSearch": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Amazon",
      "Facebook",
      "Google"
    ],
    "tags": [
      "String",
      "Tree",
      "DFS",
      "BFS",
      "Design"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=u4JAi2JJhI8"
  },
  {
    "id": 66,
    "slug": "subtree-of-another-tree",
    "title": "Subtree of Another Tree",
    "category": "Tree",
    "difficulty": "easy",
    "description": "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root that has the same structure and node values as subRoot, otherwise return false.\n\nExample:\nInput: root = [3,4,5,1,2], subRoot = [4,1,2]\nOutput: true\n\nConstraints: The number of nodes in both trees is in the range [0, 2000]; -10^4 <= Node.val <= 10^4.",
    "leetcodeSearch": "https://leetcode.com/problemset/all/?search=Subtree%20of%20Another%20Tree",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(h)",
    "companies": [
      "Facebook",
      "Amazon"
    ],
    "tags": [
      "Tree",
      "DFS",
      "String Matching"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=E36O5SWp-LE"
  },
  {
    "id": 67,
    "slug": "construct-binary-tree-from-preorder-and-inorder-traversal",
    "title": "Construct Binary Tree from Preorder and Inorder Traversal",
    "category": "Tree",
    "difficulty": "medium",
    "description": "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.\n\nExample:\nInput: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]\nOutput: [3,9,20,null,null,15,7]\n\nConstraints: 1 <= preorder.length <= 3000; inorder.length == preorder.length; -3000 <= Node.val <= 3000; preorder and inorder consist of unique values.",
    "leetcodeSearch": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Facebook",
      "Amazon",
      "Microsoft"
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Divide and Conquer",
      "Tree"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=ihj4IQGZ2zc"
  },
  {
    "id": 68,
    "slug": "validate-binary-search-tree",
    "title": "Validate Binary Search Tree",
    "category": "Tree",
    "difficulty": "medium",
    "description": "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST requires that for every node, all nodes in the left subtree have values less than the node's value, and all nodes in the right subtree have values greater than the node's value.\n\nExample 1:\nInput: root = [2,1,3]\nOutput: true\n\nExample 2:\nInput: root = [5,1,4,null,null,3,6]\nOutput: false\n\nConstraints: The number of nodes in the tree is in the range [1, 10^4]; -2^31 <= Node.val <= 2^31 - 1.",
    "leetcodeSearch": "https://leetcode.com/problems/validate-binary-search-tree/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "companies": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "tags": [
      "Tree",
      "DFS",
      "BFS"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=s6ATEkipzow"
  },
  {
    "id": 69,
    "slug": "kth-smallest-element-in-a-bst",
    "title": "Kth Smallest Element in a BST",
    "category": "Tree",
    "difficulty": "medium",
    "description": "Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed) of all the node values in the tree.\n\nExample:\nInput: root = [3,1,4,null,2], k = 1\nOutput: 1\n\nConstraints: The number of nodes in the tree is in the range [1, 10^4]; 1 <= k <= number of nodes; -10^4 <= Node.val <= 10^4.",
    "leetcodeSearch": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "companies": [
      "Amazon",
      "Facebook",
      "Bloomberg"
    ],
    "tags": [
      "Tree",
      "DFS",
      "BFS"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=5LUXSvjmGCw"
  },
  {
    "id": 70,
    "slug": "lowest-common-ancestor-of-bst",
    "title": "Lowest Common Ancestor of BST",
    "category": "Tree",
    "difficulty": "medium",
    "description": "Given a binary search tree (BST) and two nodes p and q, find the lowest common ancestor (LCA) — the deepest node in the tree that has both p and q as descendants (where a node may be a descendant of itself).\n\nExample:\nInput: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8\nOutput: 6\n\nConstraints: The number of nodes in the tree is in the range [2, 10^4]; -10^5 <= Node.val <= 10^5. p and q will exist in the tree and all Node.val are unique.",
    "leetcodeSearch": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "timeComplexity": "O(h)",
    "spaceComplexity": "O(h)",
    "companies": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "tags": [
      "Tree",
      "DFS",
      "BFS"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=gs2LMfuOR9k"
  },
  {
    "id": 71,
    "slug": "implement-trie",
    "title": "Implement Trie (Prefix Tree)",
    "category": "Tree",
    "difficulty": "medium",
    "description": "Implement the Trie (Prefix Tree) data structure with methods insert(word), search(word) and startsWith(prefix).\n\nExample:\nInput:\n[\"Trie\",\"insert\",\"search\",\"search\",\"startsWith\"]\n[[],[\"apple\"],[\"apple\"],[\"app\"],[\"app\"]]\nOutput:\n[null,null,true,false,true]\n\nConstraints: 1 <= word.length, prefix.length <= 2000 across all calls; words consist of lowercase English letters; At most 3 * 10^4 calls will be made to the Trie methods.",
    "leetcodeSearch": "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(m)",
    "companies": [
      "Amazon",
      "Google",
      "Facebook"
    ],
    "tags": [
      "Hash Table",
      "String",
      "Design",
      "Trie"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=oobqoCJlHA0"
  },
  {
    "id": 72,
    "slug": "add-and-search-word",
    "title": "Add and Search Word",
    "category": "Tree",
    "difficulty": "medium",
    "description": "Design a data structure that supports adding new words and searching for a string, where the search string may contain the wildcard character '.' that matches any single character. Implement the WordDictionary class with methods addWord(word) and search(word).\n\nExample:\nInput:\n[\"WordDictionary\",\"addWord\",\"addWord\",\"addWord\",\"search\",\"search\",\"search\",\"search\"]\n[[],[\"bad\"],[\"dad\"],[\"mad\"],[\"pad\"],[\"bad\"],[\".ad\"],[\"b..\"]]\nOutput:\n[null,null,null,null,false,true,true,true]\n\nConstraints: 1 <= word.length <= 500 across calls; At most 5 * 10^4 calls will be made to addWord and search.",
    "leetcodeSearch": "https://leetcode.com/problems/add-and-search-word-data-structure-design/",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(m)",
    "companies": [
      "Facebook",
      "Amazon"
    ],
    "tags": [
      "String",
      "DFS",
      "Design",
      "Trie"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=BTf05gs_8iU"
  },
  {
    "id": 73,
    "slug": "word-search-ii",
    "title": "Word Search II",
    "category": "Tree",
    "difficulty": "hard",
    "description": "Given an m × n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontal or vertical). The same cell may not be used more than once per word.\n\nExample:\nInput: board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]\nOutput: [\"oath\",\"eat\"]\n\nConstraints: m == board.length; n == board[i].length; 1 <= m, n <= 12; 1 <= words.length <= 3 * 10^4; 1 <= words[i].length <= 10; board and words consist of lowercase English letters.",
    "leetcodeSearch": "https://leetcode.com/problems/word-search-ii/",
    "timeComplexity": "O(m × n × 4^L)",
    "spaceComplexity": "O(k)",
    "companies": [
      "Amazon",
      "Google",
      "Airbnb"
    ],
    "tags": [
      "Array",
      "String",
      "Backtracking",
      "Trie",
      "Matrix"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=asbcE9mZz_U"
  },
  {
    "id": 74,
    "slug": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "category": "Heap",
    "difficulty": "medium",
    "description": "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.\n\nExample 1:\nInput: nums = [1,1,1,2,2,3], k = 2\nOutput: [1,2]\n\nConstraints: 1 <= nums.length <= 10^5; k is in the range [1, number of unique elements]; Answer is guaranteed to exist.",
    "leetcodeSearch": "https://leetcode.com/problems/top-k-frequent-elements/",
    "timeComplexity": "O(n log k)",
    "spaceComplexity": "O(n + k)",
    "companies": [
      "Amazon",
      "Facebook",
      "Yelp"
    ],
    "tags": [
      "Array",
      "Hash Table",
      "Divide and Conquer",
      "Sorting",
      "Heap",
      "Bucket Sort"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=YPTqKIgVk-k"
  },
  {
    "id": 75,
    "slug": "find-median-from-data-stream",
    "title": "Find Median from Data Stream",
    "category": "Heap",
    "difficulty": "hard",
    "description": "Design a data structure that supports adding numbers from a data stream and finding the median of all numbers seen so far efficiently.\n\nExample:\naddNum(1)\naddNum(2)\nfindMedian() -> 1.5\naddNum(3)\nfindMedian() -> 2\n\nConstraints: At most 10^5 calls will be made to addNum and findMedian; Values are 32-bit signed integers.",
    "leetcodeSearch": "https://leetcode.com/problems/find-median-from-data-stream/",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(n)",
    "companies": [
      "Amazon",
      "Google",
      "Facebook"
    ],
    "tags": [
      "Two Pointers",
      "Design",
      "Sorting",
      "Heap",
      "Data Stream"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=itmhHWaHupI"
  }
];

export const blind75Categories = Array.from(new Set(blind75Problems.map(p => p.category)));
