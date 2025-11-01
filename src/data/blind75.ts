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
}

export const blind75Problems: Blind75Problem[] = [
  {
    id: 1,
    slug: "two-sum",
    title: "Two Sum",
    category: "Array",
    difficulty: "easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Two%20Sum",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Google", "Facebook", "Microsoft"],
    tags: ["Hash Table", "Array"]
  },
  {
    id: 2,
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    category: "Array",
    difficulty: "easy",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Best%20Time%20to%20Buy%20and%20Sell%20Stock",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Facebook"],
    tags: ["Array", "Dynamic Programming"]
  },
  {
    id: 3,
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    category: "Array",
    difficulty: "easy",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Contains%20Duplicate",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    companies: ["Amazon", "Apple", "Adobe"],
    tags: ["Array", "Hash Table", "Sorting"]
  },
  {
    id: 4,
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    category: "Array",
    difficulty: "medium",
    description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The algorithm should run in O(n) time and without using the division operation.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Product%20of%20Array%20Except%20Self",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Facebook", "Microsoft"],
    tags: ["Array", "Prefix Sum"]
  },
  {
    id: 5,
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    category: "Array",
    difficulty: "medium",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum. This is the famous Kadane's Algorithm problem.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Maximum%20Subarray",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "LinkedIn"],
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"]
  },
  {
    id: 6,
    slug: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    category: "Array",
    difficulty: "medium",
    description: "Given an integer array nums, find a subarray that has the largest product, and return the product.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Maximum%20Product%20Subarray",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "LinkedIn"],
    tags: ["Array", "Dynamic Programming"]
  },
  {
    id: 7,
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    category: "Array",
    difficulty: "medium",
    description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Find%20Minimum%20in%20Rotated%20Sorted%20Array",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft"],
    tags: ["Array", "Binary Search"]
  },
  {
    id: 8,
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    category: "Array",
    difficulty: "medium",
    description: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is rotated at an unknown pivot index. Given the array nums after the rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Search%20in%20Rotated%20Sorted%20Array",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    companies: ["Facebook", "Microsoft", "Amazon"],
    tags: ["Array", "Binary Search"]
  },
  {
    id: 9,
    slug: "3sum",
    title: "3Sum",
    category: "Array",
    difficulty: "medium",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=3Sum",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Facebook", "Microsoft"],
    tags: ["Array", "Two Pointers", "Sorting"]
  },
  {
    id: 10,
    slug: "container-with-most-water",
    title: "Container With Most Water",
    category: "Array",
    difficulty: "medium",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Container%20With%20Most%20Water",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Google", "Facebook"],
    tags: ["Array", "Two Pointers", "Greedy"]
  },
  // Add more problems with basic info - implementations will be added separately
  {
    id: 11,
    slug: "sum-of-two-integers",
    title: "Sum of Two Integers",
    category: "Binary",
    difficulty: "medium",
    description: "Given two integers a and b, return the sum of the two integers without using the operators + and -.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Sum%20of%20Two%20Integers",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    companies: ["Amazon"],
    tags: ["Math", "Bit Manipulation"]
  },
  {
    id: 12,
    slug: "number-of-1-bits",
    title: "Number of 1 Bits",
    category: "Binary",
    difficulty: "easy",
    description: "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Number%20of%201%20Bits",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    companies: ["Apple", "Microsoft"],
    tags: ["Bit Manipulation"]
  },
  {
    id: 13,
    slug: "counting-bits",
    title: "Counting Bits",
    category: "Binary",
    difficulty: "easy",
    description: "Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Counting%20Bits",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon"],
    tags: ["Dynamic Programming", "Bit Manipulation"]
  },
  {
    id: 14,
    slug: "missing-number",
    title: "Missing Number",
    category: "Binary",
    difficulty: "easy",
    description: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Missing%20Number",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft"],
    tags: ["Array", "Math", "Bit Manipulation"]
  },
  {
    id: 15,
    slug: "reverse-bits",
    title: "Reverse Bits",
    category: "Binary",
    difficulty: "easy",
    description: "Reverse bits of a given 32 bits unsigned integer.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Reverse%20Bits",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Apple"],
    tags: ["Bit Manipulation", "Divide and Conquer"]
  },
  {
    id: 16,
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    category: "Dynamic Programming",
    difficulty: "easy",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Climbing%20Stairs",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Google", "Adobe"],
    tags: ["Dynamic Programming", "Math", "Memoization"]
  },
  {
    id: 17,
    slug: "coin-change",
    title: "Coin Change",
    category: "Dynamic Programming",
    difficulty: "medium",
    description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Coin%20Change",
    timeComplexity: "O(n × amount)",
    spaceComplexity: "O(amount)",
    companies: ["Amazon", "Bloomberg"],
    tags: ["Array", "Dynamic Programming", "BFS"]
  },
  {
    id: 40,
    slug: "reverse-linked-list",
    title: "Reverse a Linked List",
    category: "Linked List",
    difficulty: "easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Reverse%20Linked%20List",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    companies: ["Amazon", "Microsoft", "Apple"],
    tags: ["Linked List", "Recursion"]
  },
  {
    id: 50,
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    category: "String",
    difficulty: "medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Longest%20Substring%20Without%20Repeating%20Characters",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))",
    companies: ["Amazon", "Facebook", "Bloomberg"],
    tags: ["Hash Table", "String", "Sliding Window"]
  },
  {
    id: 60,
    slug: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    category: "Tree",
    difficulty: "easy",
    description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    leetcodeSearch: "https://leetcode.com/problemset/all/?search=Maximum%20Depth%20of%20Binary%20Tree",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    companies: ["Amazon", "LinkedIn"],
    tags: ["Tree", "DFS", "BFS"]
  }
];

export const blind75Categories = Array.from(new Set(blind75Problems.map(p => p.category)));
