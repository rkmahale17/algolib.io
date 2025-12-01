
export interface AlgorithmDB {
  id: string;
  name: string;
  category: string;
  title: string;
  explanation: {
    problemStatement: string;
    io: { input: string; output: string }[];
    constraints: string[];
    note: string;
    steps: string[];
    useCase: string;
    tips: string[];
  };
  companyTags: string[];
  difficulty: 'easy' | 'intermediate' | 'advance' | 'MandatoryTODO';
  listType: 'coreAlgo' | 'blind75' | 'core+Blind75';
  visualizationUrl: string;
  commonNotes: string;
  commonWhiteBoard: string;
  implementations: {
    lang: 'java' | 'typeScript' | 'python' | 'cpp';
    code: {
      codeType: string;
      code: string;
    }[];
  }[];
  overview: string;
  timeComplexity: string;
  spaceComplexity: string;
  tutorials: {
    type: 'youtube';
    url: string;
    examples?: any;
    credits: string;
    moreInfo: string;
  }[];
  likes: number;
  dislikes: number;
  problemsToSolve: {
    internal: { type: string; url: string; title: string }[];
    external: { type: string; url: string; title: string }[];
  };
  imageUrls: { name: string; alt: string; url: string; size: string }[];
  testCases: { input: any; output?: any; expectedOutput?: any; complexityExpected?: { space: string; time: string }, description?: string }[];
  inputSchema: { name: string; type: string; label?: string }[];
  availableLanguages: string;
  editorialId: string;
  userCompletionGraphData: {
    attempted: number;
    completed: number;
  };
  shareCount: number;
}

export const algorithmsDB: Record<string, AlgorithmDB> = {
  "two-pointers": {
    "id": "two-pointers",
    "name": "Two Pointers",
    "title": "Two Pointers",
    "category": "Arrays & Strings",
    "explanation": {
      "problemStatement": "Use two pointers to traverse arrays efficiently",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize two pointers: left at the start (index 0) and right at the end (last index)",
        "Calculate the sum of elements at both pointer positions",
        "If sum equals target, return the indices",
        "If sum is less than target, move left pointer right to increase sum",
        "If sum is greater than target, move right pointer left to decrease sum",
        "Continue until pointers meet or target is found"
      ],
      "useCase": "Perfect for problems involving sorted arrays where you need to find pairs, remove duplicates, or partition arrays. Common in problems like two sum, container with most water, and palindrome checking.",
      "tips": [
        "Works best on sorted arrays",
        "Time complexity: O(n) - single pass",
        "Space complexity: O(1) - no extra space",
        "Can be extended to three pointers for more complex problems"
      ]
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function twoPointers(arr: number[], target: number): number[] {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left < right) {\n    const sum = arr[left] + arr[right];\n    \n    if (sum === target) {\n      return [left, right];\n    } else if (sum < target) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  \n  return [-1, -1];\n}"
          },
          {
            "codeType": "starter",
            "code": "function twoPointers(arr: number[], target: number): number[] {\n  // TODO: Implement the Two Pointers algorithm to find indices of two numbers that add up to target\n  // Return the indices [index1, index2] (1-based or 0-based depending on problem)\n  \n  return [-1, -1];\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def two_pointers(arr: List[int], target: int) -> List[int]:\n    left = 0\n    right = len(arr) - 1\n    \n    while left < right:\n        total = arr[left] + arr[right]\n        \n        if total == target:\n            return [left, right]\n        elif total < target:\n            left += 1\n        else:\n            right -= 1\n    \n    return [-1, -1]"
          },
          {
            "codeType": "starter",
            "code": "def two_pointers(arr: List[int], target: int) -> List[int]:\n    # TODO: Implement the Two Pointers algorithm to find indices of two numbers that add up to target\n    # Return the indices [index1, index2]\n    \n    return [-1, -1]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int[] twoPointers(int[] arr, int target) {\n    int left = 0;\n    int right = arr.length - 1;\n    \n    while (left < right) {\n        int sum = arr[left] + arr[right];\n        \n        if (sum == target) {\n            return new int[]{left, right};\n        } else if (sum < target) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    \n    return new int[]{-1, -1};\n}"
          },
          {
            "codeType": "starter",
            "code": "public int[] twoPointers(int[] arr, int target) {\n    // TODO: Implement the Two Pointers algorithm\n    // Return the indices new int[]{index1, index2}\n    \n    return new int[]{-1, -1};\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector<int> twoPointers(vector<int>& arr, int target) {\n    int left = 0;\n    int right = arr.size() - 1;\n    \n    while (left < right) {\n        int sum = arr[left] + arr[right];\n        \n        if (sum == target) {\n            return {left, right};\n        } else if (sum < target) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    \n    return {-1, -1};\n}"
          },
          {
            "codeType": "starter",
            "code": "vector<int> twoPointers(vector<int>& arr, int target) {\n    // TODO: Implement the Two Pointers algorithm\n    // Return the indices {index1, index2}\n    \n    return {-1, -1};\n}"
          }
        ]
      }
    ],
    "overview": "Two pointers technique uses two references that traverse the array from different positions, typically from both ends moving toward each other or both from the start at different speeds.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=_d0T_2Lk2qA",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
          "title": "Two Sum II - Input Array Is Sorted"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/two-sum/",
          "title": "Two Sum"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/move-zeroes/",
          "title": "Move Zeroes"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/reverse-string/",
          "title": "Reverse String"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/3sum/",
          "title": "3Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/3sum-closest/",
          "title": "3Sum Closest"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/container-with-most-water/",
          "title": "Container With Most Water"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/boats-to-save-people/",
          "title": "Boats to Save People"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/richest-customer-wealth/",
          "title": "Richest Customer Wealth"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/subarrays-with-k-different-integers/",
          "title": "Subarrays With K Different Integers"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sliding-window-maximum/",
          "title": "Sliding Window Maximum"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/trapping-rain-water/",
          "title": "Trapping Rain Water"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-size-subarray-sum/",
          "title": "Minimum Size Subarray Sum"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
          "title": "Intersection of Two Linked Lists"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [
      {
        input: [[2, 7, 11, 15], 9],
        complexityExpected: {
          space: '',
          time: ''
        },
        output: [0, 1],
        description: "Basic case - first two elements"
      },
      {
        input: [[3, 2, 4], 6],
        output: [1, 2],
        complexityExpected: {
          space: '',
          time: ''
        },
        description: "Elements in middle"
      },
      {
        input: [[3, 3], 6],
        output: [0, 1],
        complexityExpected: {
          space: '',
          time: ''
        },
        description: "Duplicate numbers"
      },
      {
        input: [[-1, -2, -3, -4, -5], -8],
        output: [2, 4],
        complexityExpected: {
          space: '',
          time: ''
        },
        description: "Negative numbers"
      },
      {
        input: [[1, 5, 3, 7, 9, 2], 10],
        output: [0, 4],
        complexityExpected: {
          space: '',
          time: ''
        },
        description: "Larger array"
      },
      {
        input: [[0, 4, 3, 0], 0],
        output: [0, 3],
        complexityExpected: {
          space: '',
          time: ''
        },
        description: "Target is zero"
      }
    ],
    "inputSchema": [
      {
        "name": "arr",
        "type": "number[]",
        "label": "Array (nums)"
      },
      {
        "name": "target",
        "type": "number",
        "label": "Target"
      }
    ],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "sliding-window": {
    "id": "sliding-window",
    "name": "Sliding Window",
    "title": "Sliding Window",
    "category": "Arrays & Strings",
    "explanation": {
      "problemStatement": "Maintain a window of elements for efficient computation",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Define window size k",
        "Calculate the sum/result for the first window of k elements",
        "Slide the window one position: remove leftmost element, add new rightmost element",
        "Update the result based on the new window",
        "Continue until the window reaches the end of the array",
        "Return the optimal result found"
      ],
      "useCase": "Ideal for problems involving contiguous subarrays or substrings: maximum sum, minimum length, longest substring with K distinct characters, or finding patterns within fixed/variable window sizes.",
      "tips": [
        "Fixed window: size remains constant",
        "Variable window: size changes based on conditions",
        "Time complexity: O(n) - each element visited at most twice",
        "Avoids nested loops for subarray problems"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function maxSumSubarray(arr: number[], k: number): number {\n  let maxSum = 0;\n  let windowSum = 0;\n\n  for (let i = 0; i < k; i++) {\n    windowSum += arr[i];\n  }\n  maxSum = windowSum;\n\n  for (let i = k; i < arr.length; i++) {\n    windowSum = windowSum - arr[i - k] + arr[i];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n\n  return maxSum;\n}"
          },
          {
            "codeType": "starter",
            "code": "function maxSumSubarray(arr: number[], k: number): number {\n  // TODO: Implement Sliding Window to find maximum sum of a subarray of size k\n\n  return 0;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def max_sum_subarray(arr: List[int], k: int) -> int:\n    max_sum = 0\n    window_sum = 0\n\n    for i in range(k):\n        window_sum += arr[i]\n    max_sum = window_sum\n\n    for i in range(k, len(arr)):\n        window_sum = window_sum - arr[i - k] + arr[i]\n        max_sum = max(max_sum, window_sum)\n\n    return max_sum"
          },
          {
            "codeType": "starter",
            "code": "def max_sum_subarray(arr: List[int], k: int) -> int:\n    # TODO: Implement Sliding Window to find maximum sum of a subarray of size k\n\n    return 0"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int maxSumSubarray(int[] arr, int k) {\n    int maxSum = 0, windowSum = 0;\n\n    for (int i = 0; i < k; i++) {\n        windowSum += arr[i];\n    }\n    maxSum = windowSum;\n\n    for (int i = k; i < arr.length; i++) {\n        windowSum = windowSum - arr[i - k] + arr[i];\n        maxSum = Math.max(maxSum, windowSum);\n    }\n\n    return maxSum;\n}"
          },
          {
            "codeType": "starter",
            "code": "public int maxSumSubarray(int[] arr, int k) {\n  // TODO: Implement Sliding Window to find maximum sum of a subarray of size k\n\n  return 0;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int maxSumSubarray(vector<int> & arr, int k) {\n    int maxSum = 0, windowSum = 0;\n\n    for (int i = 0; i < k; i++) {\n        windowSum += arr[i];\n    }\n    maxSum = windowSum;\n\n    for (int i = k; i < arr.size(); i++) {\n        windowSum = windowSum - arr[i - k] + arr[i];\n        maxSum = max(maxSum, windowSum);\n    }\n\n    return maxSum;\n}"
          },
          {
            "codeType": "starter",
            "code": "int maxSumSubarray(vector<int> & arr, int k) {\n  // TODO: Implement Sliding Window to find maximum sum of a subarray of size k\n\n  return 0;\n}"
          }
        ]
      }
    ],
    "overview": "Sliding window maintains a subset of elements and slides through the array, efficiently computing results for each window position without recalculating from scratch.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(k)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=wiGpQwVHdE0&list=PLot-Xpze53leOBgcVsJBEGrHPd_7x_koV&index=2",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
          "title": "Longest Substring Without Repeating Characters"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-window-substring/",
          "title": "Minimum Window Substring"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-size-subarray-sum/",
          "title": "Minimum Size Subarray Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
          "title": "Find All Anagrams in a String"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-window-substring/",
          "title": "Minimum Window Substring (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/fruit-into-baskets/",
          "title": "Fruit Into Baskets"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/",
          "title": "Longest Substring with At Most Two Distinct Characters"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-window-substring/",
          "title": "Minimum Window Substring (again)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/valid-palindrome/",
          "title": "Valid Palindrome"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reconstruct-a-2-row-binary-matrix/",
          "title": "Reconstruct a 2-Row Binary Matrix"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-window-substring/",
          "title": "Minimum Window Substring (canonical)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-window-substring/",
          "title": "Minimum Window Substring (canonical duplicate)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-window-subsequence/",
          "title": "Minimum Window Subsequence"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-window-substring/",
          "title": "Minimum Window Substring (placeholder)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [
      {
        "name": "arr",
        "type": "number[]",
        "label": "Array"
      },
      {
        "name": "k",
        "type": "number",
        "label": "Window Size (k)"
      }
    ],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "prefix-sum": {
    "id": "prefix-sum",
    "name": "Prefix Sum",
    "title": "Prefix Sum",
    "category": "Arrays & Strings",
    "explanation": {
      "problemStatement": "Pre-compute cumulative sums for range queries",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize prefix array with first element",
        "For each position i, compute prefix[i] = prefix[i-1] + arr[i]",
        "To query range [left, right]: return prefix[right] - prefix[left-1]",
        "Handle edge case when left = 0",
        "Can be extended to 2D matrices for submatrix queries"
      ],
      "useCase": "Essential for range query problems, subarray sum problems, finding equilibrium indices, and optimization problems requiring quick sum calculations.",
      "tips": [
        "Preprocessing: O(n) time",
        "Query: O(1) time",
        "Space: O(n)",
        "Can be combined with hash maps for subarray sum problems"
      ]
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function prefixSum(arr: number[]): number[] {\n  const prefix: number[] = [arr[0]];\n\n  for (let i = 1; i < arr.length; i++) {\n    prefix[i] = prefix[i - 1] + arr[i];\n  }\n\n  return prefix;\n}\n\nfunction rangeSum(prefix: number[], left: number, right: number): number {\n  if (left === 0) return prefix[right];\n  return prefix[right] - prefix[left - 1];\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def prefix_sum(arr: List[int]) -> List[int]:\nprefix = [arr[0]]\n\nfor i in range(1, len(arr)):\n  prefix.append(prefix[-1] + arr[i])\n\nreturn prefix\n\ndef range_sum(prefix: List[int], left: int, right: int) -> int:\nif left == 0:\n  return prefix[right]\nreturn prefix[right] - prefix[left - 1]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int[] prefixSum(int[] arr) {\n  int[] prefix = new int[arr.length];\n  prefix[0] = arr[0];\n\n  for (int i = 1; i < arr.length; i++) {\n    prefix[i] = prefix[i - 1] + arr[i];\n  }\n\n  return prefix;\n}\n\npublic int rangeSum(int[] prefix, int left, int right) {\n  if (left == 0) return prefix[right];\n  return prefix[right] - prefix[left - 1];\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector < int > prefixSum(vector<int> & arr) {\n  vector < int > prefix(arr.size());\n  prefix[0] = arr[0];\n\n  for (int i = 1; i < arr.size(); i++) {\n    prefix[i] = prefix[i - 1] + arr[i];\n  }\n\n  return prefix;\n}\n\nint rangeSum(vector<int> & prefix, int left, int right) {\n  if (left == 0) return prefix[right];\n  return prefix[right] - prefix[left - 1];\n} "
          }
        ]
      }
    ],
    "overview": "Prefix sum pre-computes cumulative sums allowing O(1) range sum queries after O(n) preprocessing.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=fFVZt-6sgyo",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-pivot-index/",
          "title": "Find Pivot Index"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/subarray-sum-equals-k/",
          "title": "Subarray Sum Equals K"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/continuous-subarray-sum/",
          "title": "Continuous Subarray Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/binary-subarrays-with-sum/",
          "title": "Binary Subarrays With Sum"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/make-the-string-great/",
          "title": "Make The String Great"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/contiguous-array/",
          "title": "Contiguous Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/binary-subarrays-with-sum/",
          "title": "Binary Subarrays With Sum (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/subarray-sums-divisible-by-k/",
          "title": "Subarray Sums Divisible by K"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/subarray-sum-equals-k/",
          "title": "Subarray Sum Equals K (duplicate)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/replace-the-substring-for-balanced-string/",
          "title": "Replace the Substring for Balanced String"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "binary-search": {
    "id": "binary-search",
    "name": "Binary Search",
    "title": "Binary Search",
    "category": "Arrays & Strings",
    "explanation": {
      "problemStatement": "Search in sorted arrays in logarithmic time",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize left and right pointers",
        "Calculate middle index",
        "Compare target with middle element",
        "If equal, return index",
        "If target greater, search right half",
        "If target smaller, search left half",
        "Repeat until found or search space exhausted"
      ],
      "useCase": "Essential for searching in sorted data, finding boundaries, search space reduction problems.",
      "tips": [
        "Array must be sorted",
        "O(log n) time complexity",
        "Use left + (right - left) / 2 to avoid overflow",
        "Can be applied to answer space"
      ]
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function binarySearch(arr: number[], target: number): number {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n\n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n\n  return -1;\n} "
          },
          {
            "codeType": "starter",
            "code": "function binarySearch(arr: number[], target: number): number {\n  // TODO: Implement Binary Search to find the index of target\n  // Return -1 if not found\n\n  return -1;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def binary_search(arr: List[int], target: int) -> int:\nleft, right = 0, len(arr) - 1\n\nwhile left <= right:\n  mid = (left + right) // 2\n\nif arr[mid] == target:\n  return mid\n        elif arr[mid] < target:\nleft = mid + 1\n        else:\nright = mid - 1\n\nreturn -1"
          },
          {
            "codeType": "starter",
            "code": "def binary_search(arr: List[int], target: int) -> int:\n    # TODO: Implement Binary Search to find the index of target\n    # Return - 1 if not found\n\nreturn -1"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n\n  while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n    if (arr[mid] == target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n\n  return -1;\n} "
          },
          {
            "codeType": "starter",
            "code": "public int binarySearch(int[] arr, int target) {\n  // TODO: Implement Binary Search\n  // Return -1 if not found\n\n  return -1;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int binarySearch(vector<int> & arr, int target) {\n    int left = 0, right = arr.size() - 1;\n\n  while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n    if (arr[mid] == target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n\n  return -1;\n} "
          },
          {
            "codeType": "starter",
            "code": "int binarySearch(vector<int> & arr, int target) {\n  // TODO: Implement Binary Search\n  // Return -1 if not found\n\n  return -1;\n} "
          }
        ]
      }
    ],
    "overview": "Binary search efficiently finds an element in a sorted array by repeatedly dividing the search interval in half.",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=s4DPM8ct1pI",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-search/",
          "title": "Binary Search"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
          "title": "Search in Rotated Sorted Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
          "title": "Find Minimum in Rotated Sorted Array"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
          "title": "Find First and Last Position of Element in Sorted Array"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/sqrtx/",
          "title": "Sqrt(x)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/first-bad-version/",
          "title": "First Bad Version"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-k-closest-elements/",
          "title": "Find K Closest Elements"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-peak-element/",
          "title": "Find Peak Element"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-smallest-letter-greater-than-target/",
          "title": "Find Smallest Letter Greater Than Target"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/koko-eating-bananas/",
          "title": "Koko Eating Bananas"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [
      {
        "name": "arr",
        "type": "number[]",
        "label": "Sorted Array"
      },
      {
        "name": "target",
        "type": "number",
        "label": "Target"
      }
    ],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "kadanes-algorithm": {
    "id": "kadanes-algorithm",
    "name": "Kadane's Algorithm",
    "title": "Kadane's Algorithm",
    "category": "Arrays & Strings",
    "explanation": {
      "problemStatement": "Find maximum subarray sum efficiently",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize maxSum and currentSum with first element",
        "For each element, decide: start new subarray or extend current",
        "currentSum = max(element, currentSum + element)",
        "Update maxSum if currentSum is larger",
        "Continue through entire array",
        "Return maxSum"
      ],
      "useCase": "Classic DP problem for maximum subarray sum, stock profit problems, and optimization problems.",
      "tips": [
        "O(n) time, O(1) space",
        "Works with negative numbers",
        "Can be modified to track indices",
        "Foundation for many DP problems"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function maxSubArray(nums: number[]): number {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n\n  return maxSum;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def max_sub_array(nums: List[int]) -> int:\nmax_sum = current_sum = nums[0]\n\nfor num in nums[1:]:\ncurrent_sum = max(num, current_sum + num)\nmax_sum = max(max_sum, current_sum)\n\nreturn max_sum"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int maxSubArray(int[] nums) {\n    int maxSum = nums[0];\n    int currentSum = nums[0];\n\n  for (int i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n\n  return maxSum;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int maxSubArray(vector<int> & nums) {\n    int maxSum = nums[0];\n    int currentSum = nums[0];\n\n  for (int i = 1; i < nums.size(); i++) {\n    currentSum = max(nums[i], currentSum + nums[i]);\n    maxSum = max(maxSum, currentSum);\n  }\n\n  return maxSum;\n} "
          }
        ]
      }
    ],
    "overview": "Kadane's algorithm finds the maximum sum of a contiguous subarray in O(n) time using dynamic programming.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=5WZl3MMT0Eg",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/maximum-subarray/",
          "title": "Maximum Subarray"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-product-subarray/",
          "title": "Maximum Product Subarray"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-sum-circular-subarray/",
          "title": "Maximum Sum Circular Subarray"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/maximum-subarray/",
          "title": "Maximum Subarray (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/",
          "title": "Number of Dice Rolls With Target Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",
          "title": "Maximum Points You Can Obtain from Cards"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/",
          "title": "Maximum Size Subarray Sum Equals k"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",
          "title": "Minimum Cost to Cut a Stick"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/long-pressed-name/",
          "title": "Long Pressed Name"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-size-subarray-sum/",
          "title": "Minimum Size Subarray Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-deletions-to-make-array-beautiful/",
          "title": "Minimum Deletions to Make Array Beautiful"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/next-permutation/",
          "title": "Next Permutation"
        }
      ]
    },
    "imageUrls": [],
    testCases: [
      {
        input: [[2, 7, 11, 15], 9],
        output: [0, 1],
        description: "Basic case - first two elements"
      },
      {
        input: [[3, 2, 4], 6],
        output: [1, 2],
        description: "Elements in middle"
      },
      {
        input: [[3, 3], 6],
        output: [0, 1],
        description: "Duplicate numbers"
      },
      {
        input: [[-1, -2, -3, -4, -5], -8],
        expectedOutput: [2, 4],
        description: "Negative numbers"
      },
      {
        input: [[1, 5, 3, 7, 9, 2], 10],
        expectedOutput: [0, 4],
        description: "Larger array"
      },
      {
        input: [[0, 4, 3, 0], 0],
        expectedOutput: [0, 3],
        description: "Target is zero"
      }
    ],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "dutch-national-flag": {
    "id": "dutch-national-flag",
    "name": "Dutch National Flag",
    "title": "Dutch National Flag",
    "category": "Arrays & Strings",
    "explanation": {
      "problemStatement": "Sort array of three distinct elements",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize three pointers: low, mid, high",
        "Low tracks position for 0s, high for 2s",
        "Mid scans the array",
        "If 0: swap with low, increment both",
        "If 1: just move mid forward",
        "If 2: swap with high, decrement high",
        "Continue until mid crosses high"
      ],
      "useCase": "Sorting arrays with limited distinct values, three-way partitioning, color sorting problems.",
      "tips": [
        "O(n) time, single pass",
        "O(1) space, in-place",
        "Don't increment mid when swapping with high",
        "Also called 3-way partition"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function sortColors(nums: number[]): void {\n  let low = 0, mid = 0, high = nums.length - 1;\n\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++;\n      mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def sort_colors(nums: List[int]) -> None:\nlow = mid = 0\nhigh = len(nums) - 1\n\nwhile mid <= high:\n  if nums[mid] == 0:\n    nums[low], nums[mid] = nums[mid], nums[low]\nlow += 1\nmid += 1\n        elif nums[mid] == 1:\nmid += 1\n        else:\nnums[mid], nums[high] = nums[high], nums[mid]\nhigh -= 1"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public void sortColors(int[] nums) {\n    int low = 0, mid = 0, high = nums.length - 1;\n\n  while (mid <= high) {\n    if (nums[mid] == 0) {\n      swap(nums, low++, mid++);\n    } else if (nums[mid] == 1) {\n      mid++;\n    } else {\n      swap(nums, mid, high--);\n    }\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void sortColors(vector<int> & nums) {\n    int low = 0, mid = 0, high = nums.size() - 1;\n\n  while (mid <= high) {\n    if (nums[mid] == 0) {\n      swap(nums[low++], nums[mid++]);\n    } else if (nums[mid] == 1) {\n      mid++;\n    } else {\n      swap(nums[mid], nums[high--]);\n    }\n  }\n} "
          }
        ]
      }
    ],
    "overview": "Three-way partitioning algorithm that sorts an array containing three distinct values in one pass.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=4RCIcM33nBE",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/sort-colors/",
          "title": "Sort Colors"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
          "title": "Kth Largest Element in an Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/sort-an-array/",
          "title": "Sort an Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/wiggle-sort-ii/",
          "title": "Wiggle Sort II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/largest-number/",
          "title": "Largest Number"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/k-closest-points-to-origin/",
          "title": "K Closest Points to Origin"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
          "title": "Best Time to Buy and Sell Stock III"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/remove-element/",
          "title": "Remove Element"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/contains-duplicate/",
          "title": "Contains Duplicate"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "merge-intervals": {
    "id": "merge-intervals",
    "name": "Merge Intervals",
    "title": "Merge Intervals",
    "category": "Arrays & Strings",
    "explanation": {
      "problemStatement": "Merge overlapping intervals",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Sort intervals by start time",
        "Initialize result with first interval",
        "For each interval, check if it overlaps with last in result",
        "If overlaps, extend the last interval's end",
        "If no overlap, add as new interval",
        "Return merged intervals"
      ],
      "useCase": "Meeting rooms, calendar scheduling, time range consolidation.",
      "tips": [
        "Always sort first",
        "O(n log n) due to sorting",
        "Compare curr start with last end",
        "Update end to maximum of both"
      ]
    },
    "companyTags": [
      "Facebook",
      "Amazon",
      "Google"
    ],
    "difficulty": "intermediate",
    "listType": "core+Blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function merge(intervals: number[][]): number[][] {\n  if (intervals.length === 0) return [];\n\n  intervals.sort((a, b) => a[0] - b[0]);\n  const result: number[][] = [intervals[0]];\n\n  for (let i = 1; i < intervals.length; i++) {\n    const last = result[result.length - 1];\n    const curr = intervals[i];\n\n    if (curr[0] <= last[1]) {\n      last[1] = Math.max(last[1], curr[1]);\n    } else {\n      result.push(curr);\n    }\n  }\n\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def merge(intervals: list[List[int]]) -> list[List[int]]:\nif not intervals:\n  return []\n\nintervals.sort(key = lambda x: x[0])\nresult = [intervals[0]]\n\nfor curr in intervals[1:]:\nlast = result[-1]\n\nif curr[0] <= last[1]:\n  last[1] = max(last[1], curr[1])\nelse:\nresult.append(curr)\n\nreturn result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int[][] merge(int[][] intervals) {\n  if (intervals.length == 0) return new int[0][];\n\n  Arrays.sort(intervals, (a, b) -> a[0] - b[0]);\n  List < int[] > result = new ArrayList<>();\n  result.add(intervals[0]);\n\n  for (int i = 1; i < intervals.length; i++) {\n    int[] last = result.get(result.size() - 1);\n    int[] curr = intervals[i];\n\n    if (curr[0] <= last[1]) {\n      last[1] = Math.max(last[1], curr[1]);\n    } else {\n      result.add(curr);\n    }\n  }\n\n  return result.toArray(new int[result.size()][]);\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector < vector < int >> merge(vector<vector<int>> & intervals) {\n  if (intervals.empty()) return {};\n\n  sort(intervals.begin(), intervals.end());\n  vector < vector < int >> result = { intervals[0] };\n\n  for (int i = 1; i < intervals.size(); i++) {\n    auto & last = result.back();\n    auto & curr = intervals[i];\n\n    if (curr[0] <= last[1]) {\n      last[1] = max(last[1], curr[1]);\n    } else {\n      result.push_back(curr);\n    }\n  }\n\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "Merge overlapping intervals by sorting and combining consecutive overlapping intervals.",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=44H3cEC2fFM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/merge-intervals/",
          "title": "Merge Intervals"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/non-overlapping-intervals/",
          "title": "Non-overlapping Intervals"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
          "title": "Minimum Number of Arrows to Burst Balloons"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sliding-window-maximum/",
          "title": "Sliding Window Maximum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/interval-list-intersections/",
          "title": "Interval List Intersections"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/insert-interval/",
          "title": "Insert Interval"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/replace-the-substring-for-balanced-string/",
          "title": "Replace the Substring for Balanced String"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/car-pooling/",
          "title": "Car Pooling"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/exclusive-time-of-functions/",
          "title": "Exclusive Time of Functions"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/merge-intervals/",
          "title": "Merge Intervals (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/insert-interval/",
          "title": "Insert Interval (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/",
          "title": "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
          "title": "Maximum Profit in Job Scheduling"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/search-a-2d-matrix-ii/",
          "title": "Search a 2D Matrix II"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "monotonic-stack": {
    "id": "monotonic-stack",
    "name": "Monotonic Stack",
    "title": "Monotonic Stack",
    "category": "Arrays & Strings",
    "explanation": {
      "problemStatement": "Stack with monotonic properties for efficient queries",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Iterate through array",
        "While stack top is smaller than current (for increasing stack)",
        "Pop and process the top",
        "Push current index",
        "Stack maintains increasing/decreasing order"
      ],
      "useCase": "Next greater/smaller element, histogram problems, temperature problems.",
      "tips": [
        "O(n) time - each element pushed/popped once",
        "Store indices not values",
        "Increasing stack: pop when curr > top",
        "Decreasing stack: pop when curr < top"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function nextGreaterElement(nums: number[]): number[] {\n  const result = new Array(nums.length).fill(-1);\n  const stack: number[] = [];\n\n  for (let i = 0; i < nums.length; i++) {\n    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {\n      const idx = stack.pop()!;\n      result[idx] = nums[i];\n    }\n    stack.push(i);\n  }\n\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def next_greater_element(nums: List[int]) -> List[int]:\nresult = [-1] * len(nums)\nstack = []\n\nfor i, num in enumerate(nums):\n  while stack and num > nums[stack[-1]]:\nidx = stack.pop()\nresult[idx] = num\nstack.append(i)\n\nreturn result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int[] nextGreaterElement(int[] nums) {\n    int n = nums.length;\n  int[] result = new int[n];\n  Arrays.fill(result, -1);\n  Stack < Integer > stack = new Stack<>();\n\n  for (int i = 0; i < n; i++) {\n    while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {\n      result[stack.pop()] = nums[i];\n    }\n    stack.push(i);\n  }\n\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector < int > nextGreaterElement(vector<int> & nums) {\n    int n = nums.size();\n  vector < int > result(n, -1);\n  stack < int > st;\n\n  for (int i = 0; i < n; i++) {\n    while (!st.empty() && nums[i] > nums[st.top()]) {\n      result[st.top()] = nums[i];\n      st.pop();\n    }\n    st.push(i);\n  }\n\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "Stack that maintains elements in monotonic order to efficiently solve range query problems.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=qkLl7nAwDPo",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/next-greater-element-i/",
          "title": "Next Greater Element I"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/next-greater-element-ii/",
          "title": "Next Greater Element II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/daily-temperatures/",
          "title": "Daily Temperatures"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/trapping-rain-water/",
          "title": "Trapping Rain Water"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/online-stock-span/",
          "title": "Online Stock Span"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/maximal-rectangle/",
          "title": "Maximal Rectangle"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
          "title": "Largest Rectangle in Histogram"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/trapping-rain-water/",
          "title": "Trapping Rain Water (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/validate-stack-sequences/",
          "title": "Validate Stack Sequences"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
          "title": "Largest Rectangle in Histogram (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/daily-temperatures/",
          "title": "Daily Temperatures (duplicate)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "rotate-array": {
    "id": "rotate-array",
    "name": "Rotate Array In-Place",
    "title": "Rotate Array In-Place",
    "category": "Arrays & Strings",
    "explanation": {
      "problemStatement": "Rotate array elements without extra space",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Normalize k by taking modulo with array length",
        "Reverse entire array",
        "Reverse first k elements",
        "Reverse remaining elements",
        "Array is now rotated k positions"
      ],
      "useCase": "Array rotation, circular arrays, cyclic shifts.",
      "tips": [
        "O(n) time, O(1) space",
        "Three reversals trick",
        "Handle k > n with modulo",
        "Works for both left and right rotation"
      ]
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function rotate(nums: number[], k: number): void {\n  k = k % nums.length;\n  reverse(nums, 0, nums.length - 1);\n  reverse(nums, 0, k - 1);\n  reverse(nums, k, nums.length - 1);\n}\n\nfunction reverse(nums: number[], left: number, right: number): void {\n  while (left < right) {\n    [nums[left], nums[right]] = [nums[right], nums[left]];\n    left++;\n    right--;\n  }\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def rotate(nums: List[int], k: int) -> None:\nk = k % len(nums)\nreverse(nums, 0, len(nums) - 1)\nreverse(nums, 0, k - 1)\nreverse(nums, k, len(nums) - 1)\n\ndef reverse(nums: List[int], left: int, right: int) -> None:\nwhile left < right:\n  nums[left], nums[right] = nums[right], nums[left]\nleft += 1\nright -= 1"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public void rotate(int[] nums, int k) {\n  k = k % nums.length;\n  reverse(nums, 0, nums.length - 1);\n  reverse(nums, 0, k - 1);\n  reverse(nums, k, nums.length - 1);\n}\n\nprivate void reverse(int[] nums, int left, int right) {\n  while (left < right) {\n        int temp = nums[left];\n    nums[left++] = nums[right];\n    nums[right--] = temp;\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void reverse(vector<int> & nums, int left, int right) {\n  while (left < right) {\n    swap(nums[left++], nums[right--]);\n  }\n}\n\nvoid rotate(vector<int> & nums, int k) {\n  k = k % nums.size();\n  reverse(nums, 0, nums.size() - 1);\n  reverse(nums, 0, k - 1);\n  reverse(nums, k, nums.size() - 1);\n} "
          }
        ]
      }
    ],
    "overview": "Rotate array k positions to the right using three reversals - elegant O(1) space solution.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=BHr381Guz3Y",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/rotate-array/",
          "title": "Rotate Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/rotate-list/",
          "title": "Rotate List"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/move-zeroes/",
          "title": "Move Zeroes"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/max-consecutive-ones/",
          "title": "Max Consecutive Ones"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "cyclic-sort": {
    "id": "cyclic-sort",
    "name": "Cyclic Sort",
    "title": "Cyclic Sort",
    "category": "Arrays & Strings",
    "explanation": {
      "problemStatement": "Sort by placing elements at their correct index",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Iterate through array with index i",
        "Calculate correct position for nums[i]",
        "If number not at correct position, swap it",
        "If already correct, move to next index",
        "Continue until all numbers placed correctly"
      ],
      "useCase": "Finding missing/duplicate numbers, array with numbers in specific range.",
      "tips": [
        "O(n) time, O(1) space",
        "Only works for numbers 1 to n",
        "Each number visited at most twice",
        "Great for missing number problems"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function cyclicSort(nums: number[]): void {\n  let i = 0;\n  while (i < nums.length) {\n    const correctIdx = nums[i] - 1;\n    if (nums[i] !== nums[correctIdx]) {\n      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];\n    } else {\n      i++;\n    }\n  }\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def cyclic_sort(nums: List[int]) -> None:\ni = 0\nwhile i < len(nums):\n  correct_idx = nums[i] - 1\nif nums[i] != nums[correct_idx]:\n  nums[i], nums[correct_idx] = nums[correct_idx], nums[i]\nelse:\ni += 1"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public void cyclicSort(int[] nums) {\n    int i = 0;\n  while (i < nums.length) {\n        int correctIdx = nums[i] - 1;\n    if (nums[i] != nums[correctIdx]) {\n            int temp = nums[i];\n      nums[i] = nums[correctIdx];\n      nums[correctIdx] = temp;\n    } else {\n      i++;\n    }\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void cyclicSort(vector<int> & nums) {\n    int i = 0;\n  while (i < nums.size()) {\n        int correctIdx = nums[i] - 1;\n    if (nums[i] != nums[correctIdx]) {\n      swap(nums[i], nums[correctIdx]);\n    } else {\n      i++;\n    }\n  }\n} "
          }
        ]
      }
    ],
    "overview": "Sort array containing numbers in range [1, n] by placing each number at its correct index.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
          "title": "Find All Duplicates in an Array"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/missing-number/",
          "title": "Missing Number"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-the-duplicate-number/",
          "title": "Find the Duplicate Number"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/first-missing-positive/",
          "title": "First Missing Positive"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
          "title": "Find All Numbers Disappeared in an Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-the-duplicate-number/",
          "title": "Find the Duplicate Number (duplicate)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/remove-element/",
          "title": "Remove Element"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/contains-duplicate/",
          "title": "Contains Duplicate"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "fast-slow-pointers": {
    "id": "fast-slow-pointers",
    "name": "Fast & Slow Pointers",
    "title": "Fast & Slow Pointers",
    "category": "Linked List",
    "explanation": {
      "problemStatement": "Detect cycles and find middle using two pointers",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize slow and fast pointers at head",
        "Move slow by 1 step, fast by 2 steps",
        "For cycle detection: if pointers meet, cycle exists",
        "For middle: when fast reaches end, slow is at middle",
        "Works because fast catches up to slow in a cycle",
        "O(n) time, O(1) space"
      ],
      "useCase": "Cycle detection, finding middle node, detecting intersections, linked list problems.",
      "tips": [
        "Check fast and fast.next for null",
        "Tortoise and hare analogy",
        "Can find cycle start with additional logic",
        "Foundation for many linked list algorithms"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function hasCycle(head: ListNode | null): boolean {\n  let slow = head;\n  let fast = head;\n\n  while (fast !== null && fast.next !== null) {\n    slow = slow!.next;\n    fast = fast.next.next;\n\n    if (slow === fast) {\n      return true;\n    }\n  }\n\n  return false;\n}\n\nfunction findMiddle(head: ListNode | null): ListNode | null {\n  let slow = head;\n  let fast = head;\n\n  while (fast !== null && fast.next !== null) {\n    slow = slow!.next;\n    fast = fast.next.next;\n  }\n\n  return slow;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def has_cycle(head: ListNode) -> bool:\nslow = fast = head\n\nwhile fast and fast.next:\nslow = slow.next\nfast = fast.next.next\n\nif slow == fast:\n  return True\n\nreturn False\n\ndef find_middle(head: ListNode) -> ListNode:\nslow = fast = head\n\nwhile fast and fast.next:\nslow = slow.next\nfast = fast.next.next\n\nreturn slow"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public boolean hasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n\n  while (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n\n    if (slow == fast) return true;\n  }\n\n  return false;\n}\n\npublic ListNode findMiddle(ListNode head) {\n    ListNode slow = head, fast = head;\n\n  while (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n\n  return slow;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "bool hasCycle(ListNode * head) {\n  ListNode * slow = head, * fast = head;\n\n  while (fast && fast -> next) {\n    slow = slow -> next;\n    fast = fast -> next -> next;\n\n    if (slow == fast) return true;\n  }\n\n  return false;\n}\n\nListNode * findMiddle(ListNode * head) {\n  ListNode * slow = head, * fast = head;\n\n  while (fast && fast -> next) {\n    slow = slow -> next;\n    fast = fast -> next -> next;\n  }\n\n  return slow;\n} "
          }
        ]
      }
    ],
    "overview": "Floyd's algorithm using two pointers moving at different speeds to detect cycles and find middle nodes.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=gBTe7lFR3vc",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/linked-list-cycle/",
          "title": "Linked List Cycle"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
          "title": "Linked List Cycle II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
          "title": "Intersection of Two Linked Lists"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/middle-of-the-linked-list/",
          "title": "Middle of the Linked List"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
          "title": "Remove Nth Node From End of List"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reverse-linked-list-ii/",
          "title": "Reverse Linked List II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/odd-even-linked-list/",
          "title": "Odd Even Linked List"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/rotate-list/",
          "title": "Rotate List"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/split-linked-list-in-parts/",
          "title": "Split Linked List in Parts"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reorder-list/",
          "title": "Reorder List"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
          "title": "Merge k Sorted Lists"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
          "title": "Reverse Nodes in k-Group"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sort-list/",
          "title": "Sort List"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/",
          "title": "Convert Sorted List to Binary Search Tree"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "reverse-linked-list": {
    "id": "reverse-linked-list",
    "name": "Reverse Linked List",
    "title": "Reverse Linked List",
    "category": "Linked List",
    "explanation": {
      "problemStatement": "Reverse a singly linked list",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize prev as null and curr as head",
        "Save curr.next in temporary variable",
        "Reverse the link: curr.next = prev",
        "Move prev forward to curr",
        "Move curr forward to next",
        "Repeat until curr is null",
        "Return prev as new head"
      ],
      "useCase": "Fundamental linked list operation, building block for complex list manipulations.",
      "tips": [
        "O(n) time, O(1) space",
        "Can be done recursively",
        "Remember to save next before changing pointers",
        "Practice until automatic"
      ]
    },
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Apple"
    ],
    "difficulty": "easy",
    "listType": "core+Blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "class ListNode {\n  val: number;\n  next: ListNode | null;\n  constructor(val?: number, next?: ListNode | null) {\n    this.val = val === undefined ? 0 : val;\n    this.next = next === undefined ? null : next;\n  }\n}\n\nfunction reverseList(head: ListNode | null): ListNode | null {\n  let prev: ListNode | null = null;\n  let curr = head;\n\n  while (curr !== null) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n\n  return prev;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "class ListNode:\n    def __init__(self, val = 0, next = None):\nself.val = val\nself.next = next\n\ndef reverse_list(head: ListNode) -> ListNode:\nprev = None\ncurr = head\n\nwhile curr:\n  next_node = curr.next\ncurr.next = prev\nprev = curr\ncurr = next_node\n\nreturn prev"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "class ListNode {\n    int val;\n    ListNode next;\n  ListNode(int x) { val = x; }\n}\n\npublic ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode curr = head;\n\n  while (curr != null) {\n        ListNode next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n\n  return prev;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "struct ListNode {\n    int val;\n  ListNode * next;\n  ListNode(int x) : val(x), next(NULL) { }\n};\n\nListNode * reverseList(ListNode * head) {\n  ListNode * prev = nullptr;\n  ListNode * curr = head;\n\n  while (curr != nullptr) {\n    ListNode * next = curr -> next;\n    curr -> next = prev;\n    prev = curr;\n    curr = next;\n  }\n\n  return prev;\n} "
          }
        ]
      }
    ],
    "overview": "Reverse a linked list by iteratively changing the direction of next pointers.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=G0_I-ZF0S38",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/reverse-linked-list/",
          "title": "Reverse Linked List"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reverse-linked-list-ii/",
          "title": "Reverse Linked List II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
          "title": "Reverse Nodes in k-Group"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/palindrome-linked-list/",
          "title": "Palindrome Linked List"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reverse-linked-list-ii/",
          "title": "Reverse Linked List II (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/merge-in-between-linked-lists/",
          "title": "Merge In Between Linked Lists"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reverse-linked-list-ii/",
          "title": "Reverse Linked List II (third)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-the-distance-value-between-two-arrays/",
          "title": "Find the Distance Value Between Two Arrays"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
          "title": "Reverse Nodes in k-Group (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reverse-linked-list-ii/",
          "title": "Reverse Linked List II (fourth)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/swap-nodes-in-pairs/",
          "title": "Swap Nodes in Pairs"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/odd-even-linked-list/",
          "title": "Odd Even Linked List"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/",
          "title": "Flatten a Multilevel Doubly Linked List"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
          "title": "Reverse Nodes in k-Group (third duplicate)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "merge-sorted-lists": {
    "id": "merge-sorted-lists",
    "name": "Merge Two Sorted Lists",
    "title": "Merge Two Sorted Lists",
    "category": "Linked List",
    "explanation": {
      "problemStatement": "Merge two sorted linked lists",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Create dummy node to simplify edge cases",
        "Compare heads of both lists",
        "Attach smaller node to result",
        "Move pointer of chosen list forward",
        "When one list exhausted, attach remaining list",
        "Return dummy.next"
      ],
      "useCase": "Merge operations, sorted list manipulation, merge sort for linked lists.",
      "tips": [
        "O(n + m) time",
        "Use dummy node pattern",
        "Don't forget to attach remaining list",
        "Can be done recursively too"
      ]
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {\n  const dummy = new ListNode(0);\n  let curr = dummy;\n\n  while (l1 && l2) {\n    if (l1.val <= l2.val) {\n      curr.next = l1;\n      l1 = l1.next;\n    } else {\n      curr.next = l2;\n      l2 = l2.next;\n    }\n    curr = curr.next;\n  }\n\n  curr.next = l1 || l2;\n  return dummy.next;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def merge_two_lists(l1: ListNode, l2: ListNode) -> ListNode:\ndummy = ListNode(0)\ncurr = dummy\n\nwhile l1 and l2:\nif l1.val <= l2.val:\n  curr.next = l1\nl1 = l1.next\n        else:\ncurr.next = l2\nl2 = l2.next\ncurr = curr.next\n\ncurr.next = l1 or l2\nreturn dummy.next"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n    ListNode dummy = new ListNode(0);\n    ListNode curr = dummy;\n\n  while (l1 != null && l2 != null) {\n    if (l1.val <= l2.val) {\n      curr.next = l1;\n      l1 = l1.next;\n    } else {\n      curr.next = l2;\n      l2 = l2.next;\n    }\n    curr = curr.next;\n  }\n\n  curr.next = l1 != null ? l1 : l2;\n  return dummy.next;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "ListNode * mergeTwoLists(ListNode * l1, ListNode * l2) {\n    ListNode dummy(0);\n  ListNode * curr = & dummy;\n\n  while (l1 && l2) {\n    if (l1 -> val <= l2 -> val) {\n      curr -> next = l1;\n      l1 = l1 -> next;\n    } else {\n      curr -> next = l2;\n      l2 = l2 -> next;\n    }\n    curr = curr -> next;\n  }\n\n  curr -> next = l1 ? l1 : l2;\n  return dummy.next;\n} "
          }
        ]
      }
    ],
    "overview": "Merge two sorted linked lists into one sorted list using two pointers.",
    "timeComplexity": "O(n+m)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=XIdigk956u0",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/merge-two-sorted-lists/",
          "title": "Merge Two Sorted Lists"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
          "title": "Merge k Sorted Lists"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/merge-sorted-array/",
          "title": "Merge Sorted Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/rotate-list/",
          "title": "Rotate List"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sort-list/",
          "title": "Sort List"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/merge-two-sorted-lists/",
          "title": "Merge Two Sorted Lists (duplicate)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
          "title": "Merge k Sorted Lists (duplicate)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
          "title": "Intersection of Two Linked Lists"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/merge-two-sorted-lists/",
          "title": "Merge Two Sorted Lists (third)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
          "title": "Merge k Sorted Lists (third)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
          "title": "Merge k Sorted Lists (fourth)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reverse-linked-list-ii/",
          "title": "Reverse Linked List II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/merge-two-sorted-lists/",
          "title": "Merge Two Sorted Lists (fourth)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sort-list/",
          "title": "Sort List (duplicate)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "detect-cycle": {
    "id": "detect-cycle",
    "name": "Detect Cycle",
    "title": "Detect Cycle",
    "category": "Linked List",
    "explanation": {
      "problemStatement": "Floyd's algorithm to detect cycles",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Use fast and slow pointers",
        "Fast moves 2 steps, slow moves 1 step",
        "If they meet, cycle exists",
        "Reset one pointer to head",
        "Move both one step at a time",
        "They meet at cycle start"
      ],
      "useCase": "Cycle detection, finding cycle entry point, linked list problems.",
      "tips": [
        "O(n) time, O(1) space",
        "Two-phase algorithm",
        "Mathematical proof behind meeting point",
        "Also called Floyd's tortoise and hare"
      ]
    },
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Bloomberg"
    ],
    "difficulty": "intermediate",
    "listType": "core+Blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function detectCycle(head: ListNode | null): ListNode | null {\n  let slow = head;\n  let fast = head;\n\n  while (fast && fast.next) {\n    slow = slow!.next;\n    fast = fast.next.next;\n\n    if (slow === fast) {\n      let ptr = head;\n      while (ptr !== slow) {\n        ptr = ptr!.next;\n        slow = slow!.next;\n      }\n      return ptr;\n    }\n  }\n\n  return null;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def detect_cycle(head: ListNode) -> ListNode:\nslow = fast = head\n\nwhile fast and fast.next:\nslow = slow.next\nfast = fast.next.next\n\nif slow == fast:\n  ptr = head\nwhile ptr != slow:\n  ptr = ptr.next\nslow = slow.next\nreturn ptr\n\nreturn None"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public ListNode detectCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n\n  while (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n\n    if (slow == fast) {\n            ListNode ptr = head;\n      while (ptr != slow) {\n        ptr = ptr.next;\n        slow = slow.next;\n      }\n      return ptr;\n    }\n  }\n\n  return null;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "ListNode * detectCycle(ListNode * head) {\n  ListNode * slow = head, * fast = head;\n\n  while (fast && fast -> next) {\n    slow = slow -> next;\n    fast = fast -> next -> next;\n\n    if (slow == fast) {\n      ListNode * ptr = head;\n      while (ptr != slow) {\n        ptr = ptr -> next;\n        slow = slow -> next;\n      }\n      return ptr;\n    }\n  }\n\n  return nullptr;\n} "
          }
        ]
      }
    ],
    "overview": "Floyd's cycle detection algorithm finds the start of a cycle in a linked list.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=gBTe7lFR3vc",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/linked-list-cycle/",
          "title": "Linked List Cycle"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
          "title": "Linked List Cycle II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
          "title": "Intersection of Two Linked Lists"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-the-duplicate-number/",
          "title": "Find the Duplicate Number"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
          "title": "Linked List Cycle II (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/top-k-frequent-words/",
          "title": "Top K Frequent Words"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/linked-list-cycle/",
          "title": "Linked List Cycle (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
          "title": "Linked List Cycle II (third)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
          "title": "Merge k Sorted Lists"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
          "title": "Reverse Nodes in k-Group"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/",
          "title": "Convert Sorted List to Binary Search Tree"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sort-list/",
          "title": "Sort List"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
          "title": "Intersection of Two Linked Lists (duplicate)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/making-a-large-island/",
          "title": "Making A Large Island"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "middle-node": {
    "id": "middle-node",
    "name": "Middle Node",
    "title": "Middle Node",
    "category": "Linked List",
    "explanation": {
      "problemStatement": "Find middle node using fast and slow pointers",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize both pointers at head",
        "Move slow 1 step, fast 2 steps",
        "When fast reaches end, slow is at middle",
        "For even length, returns second middle",
        "Single pass solution"
      ],
      "useCase": "Finding middle of list, partitioning lists, palindrome check.",
      "tips": [
        "O(n) time, O(1) space",
        "No need to count length",
        "Fast and slow pointer pattern",
        "Returns second middle for even length"
      ]
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function middleNode(head: ListNode | null): ListNode | null {\n  let slow = head;\n  let fast = head;\n\n  while (fast && fast.next) {\n    slow = slow!.next;\n    fast = fast.next.next;\n  }\n\n  return slow;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def middle_node(head: ListNode) -> ListNode:\nslow = fast = head\n\nwhile fast and fast.next:\nslow = slow.next\nfast = fast.next.next\n\nreturn slow"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public ListNode middleNode(ListNode head) {\n    ListNode slow = head, fast = head;\n\n  while (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n\n  return slow;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "ListNode * middleNode(ListNode * head) {\n  ListNode * slow = head, * fast = head;\n\n  while (fast && fast -> next) {\n    slow = slow -> next;\n    fast = fast -> next -> next;\n  }\n\n  return slow;\n} "
          }
        ]
      }
    ],
    "overview": "Find middle node of linked list using fast and slow pointers in single pass.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=A2_ldqM4QcY",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/middle-of-the-linked-list/",
          "title": "Middle of the Linked List"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/linked-list-cycle/",
          "title": "Linked List Cycle"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
          "title": "Intersection of Two Linked Lists"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
          "title": "Remove Nth Node From End of List"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/split-linked-list-in-parts/",
          "title": "Split Linked List in Parts"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/merge-two-sorted-lists/",
          "title": "Merge Two Sorted Lists"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reverse-linked-list-ii/",
          "title": "Reverse Linked List II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/odd-even-linked-list/",
          "title": "Odd Even Linked List"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
          "title": "Linked List Cycle II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
          "title": "Reverse Nodes in k-Group"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/",
          "title": "Convert Sorted List to Binary Search Tree"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sort-list/",
          "title": "Sort List"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/palindrome-linked-list/",
          "title": "Palindrome Linked List"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/delete-node-in-a-linked-list/",
          "title": "Delete Node in a Linked List"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "dfs-preorder": {
    "id": "dfs-preorder",
    "name": "DFS Preorder",
    "title": "DFS Preorder",
    "category": "Trees & BSTs",
    "explanation": {
      "problemStatement": "Visit root, left, then right subtree",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Visit and process current node",
        "Recursively traverse left subtree",
        "Recursively traverse right subtree",
        "Base case: return if node is null",
        "Collect values in preorder sequence"
      ],
      "useCase": "Tree serialization, creating copy of tree, prefix expression evaluation.",
      "tips": [
        "O(n) time - visits each node once",
        "O(h) space - recursion depth",
        "Can use stack for iterative version",
        "Process parent before children"
      ]
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "class TreeNode {\n  val: number;\n  left: TreeNode | null;\n  right: TreeNode | null;\n}\n\nfunction preorderTraversal(root: TreeNode | null): number[] {\n  const result: number[] = [];\n\n  function dfs(node: TreeNode | null) {\n    if (!node) return;\n    result.push(node.val);\n    dfs(node.left);\n    dfs(node.right);\n  }\n\n  dfs(root);\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def preorder_traversal(root: TreeNode) -> List[int]:\nresult = []\n    \n    def dfs(node):\nif not node:\n  return\nresult.append(node.val)\ndfs(node.left)\ndfs(node.right)\n\ndfs(root)\nreturn result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List < Integer > preorderTraversal(TreeNode root) {\n  List < Integer > result = new ArrayList<>();\n  dfs(root, result);\n  return result;\n}\n\nprivate void dfs(TreeNode node, List < Integer > result) {\n  if (node == null) return;\n  result.add(node.val);\n  dfs(node.left, result);\n  dfs(node.right, result);\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void dfs(TreeNode * node, vector<int> & result) {\n  if (!node) return;\n  result.push_back(node -> val);\n  dfs(node -> left, result);\n  dfs(node -> right, result);\n}\n\nvector < int > preorderTraversal(TreeNode * root) {\n  vector < int > result;\n  dfs(root, result);\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "Preorder DFS visits root first, then left subtree, then right subtree (Root → Left → Right).",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=afTpieEZXck",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-preorder-traversal/",
          "title": "Binary Tree Preorder Traversal"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-inorder-traversal/",
          "title": "Binary Tree Inorder Traversal"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/same-tree/",
          "title": "Same Tree"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/symmetric-tree/",
          "title": "Symmetric Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
          "title": "Construct Binary Tree from Preorder and Inorder Traversal"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
          "title": "Construct Binary Tree from Inorder and Postorder Traversal"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
          "title": "Flatten Binary Tree to Linked List"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/build-an-array-with-stack-operations/",
          "title": "Build an Array With Stack Operations"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/binary-tree-right-side-view/",
          "title": "Binary Tree Right Side View"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/",
          "title": "Binary Tree Level Order Traversal II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/sum-root-to-leaf-numbers/",
          "title": "Sum Root to Leaf Numbers"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-paths/",
          "title": "Binary Tree Paths"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
          "title": "Binary Tree Maximum Path Sum"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
          "title": "Serialize and Deserialize Binary Tree"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "dfs-inorder": {
    "id": "dfs-inorder",
    "name": "DFS Inorder",
    "title": "DFS Inorder",
    "category": "Trees & BSTs",
    "explanation": {
      "problemStatement": "Visit left, root, then right subtree",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Recursively traverse left subtree",
        "Visit and process current node",
        "Recursively traverse right subtree",
        "Base case: return if node is null",
        "For BST, produces sorted sequence"
      ],
      "useCase": "Get sorted values from BST, validate BST, expression tree evaluation.",
      "tips": [
        "BST inorder gives sorted values",
        "O(n) time, O(h) space",
        "Morris traversal for O(1) space",
        "Most common tree traversal"
      ]
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function inorderTraversal(root: TreeNode | null): number[] {\n  const result: number[] = [];\n\n  function dfs(node: TreeNode | null) {\n    if (!node) return;\n    dfs(node.left);\n    result.push(node.val);\n    dfs(node.right);\n  }\n\n  dfs(root);\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def inorder_traversal(root: TreeNode) -> List[int]:\nresult = []\n    \n    def dfs(node):\nif not node:\n  return\ndfs(node.left)\nresult.append(node.val)\ndfs(node.right)\n\ndfs(root)\nreturn result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List < Integer > inorderTraversal(TreeNode root) {\n  List < Integer > result = new ArrayList<>();\n  dfs(root, result);\n  return result;\n}\n\nprivate void dfs(TreeNode node, List < Integer > result) {\n  if (node == null) return;\n  dfs(node.left, result);\n  result.add(node.val);\n  dfs(node.right, result);\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void dfs(TreeNode * node, vector<int> & result) {\n  if (!node) return;\n  dfs(node -> left, result);\n  result.push_back(node -> val);\n  dfs(node -> right, result);\n}\n\nvector < int > inorderTraversal(TreeNode * root) {\n  vector < int > result;\n  dfs(root, result);\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "Inorder DFS visits left subtree, then root, then right subtree (Left → Root → Right). Gives sorted order for BST.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=g_S5WuasWUE",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-inorder-traversal/",
          "title": "Binary Tree Inorder Traversal"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/validate-binary-search-tree/",
          "title": "Validate Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/delete-node-in-a-bst/",
          "title": "Delete Node in a BST"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
          "title": "Kth Smallest Element in a BST"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/recover-binary-search-tree/",
          "title": "Recover Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/binary-search-tree-iterator/",
          "title": "Binary Search Tree Iterator"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
          "title": "Insert into a Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/validate-binary-search-tree/",
          "title": "Validate Binary Search Tree (duplicate)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
          "title": "Convert Sorted Array to Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/",
          "title": "Convert Sorted List to Binary Search Tree"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
          "title": "Binary Tree Maximum Path Sum"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/recover-binary-search-tree/",
          "title": "Recover Binary Search Tree (duplicate)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "dfs-postorder": {
    "id": "dfs-postorder",
    "name": "DFS Postorder",
    "title": "DFS Postorder",
    "category": "Trees & BSTs",
    "explanation": {
      "problemStatement": "Visit left, right, then root",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Recursively traverse left subtree",
        "Recursively traverse right subtree",
        "Visit and process current node",
        "Base case: return if node is null",
        "Process children before parent"
      ],
      "useCase": "Tree deletion, postfix expression evaluation, calculating subtree properties.",
      "tips": [
        "Process children before parent",
        "Good for bottom-up calculations",
        "Used in tree destruction",
        "O(n) time, O(h) space"
      ]
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function postorderTraversal(root: TreeNode | null): number[] {\n  const result: number[] = [];\n\n  function dfs(node: TreeNode | null) {\n    if (!node) return;\n    dfs(node.left);\n    dfs(node.right);\n    result.push(node.val);\n  }\n\n  dfs(root);\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def postorder_traversal(root: TreeNode) -> List[int]:\nresult = []\n    \n    def dfs(node):\nif not node:\n  return\ndfs(node.left)\ndfs(node.right)\nresult.append(node.val)\n\ndfs(root)\nreturn result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List < Integer > postorderTraversal(TreeNode root) {\n  List < Integer > result = new ArrayList<>();\n  dfs(root, result);\n  return result;\n}\n\nprivate void dfs(TreeNode node, List < Integer > result) {\n  if (node == null) return;\n  dfs(node.left, result);\n  dfs(node.right, result);\n  result.add(node.val);\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void dfs(TreeNode * node, vector<int> & result) {\n  if (!node) return;\n  dfs(node -> left, result);\n  dfs(node -> right, result);\n  result.push_back(node -> val);\n}\n\nvector < int > postorderTraversal(TreeNode * root) {\n  vector < int > result;\n  dfs(root, result);\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "Postorder DFS visits left subtree, then right subtree, then root (Left → Right → Root).",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=QhszUQhGGlA",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-postorder-traversal/",
          "title": "Binary Tree Postorder Traversal"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
          "title": "Flatten Binary Tree to Linked List"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
          "title": "Binary Tree Maximum Path Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/binary-tree-right-side-view/",
          "title": "Binary Tree Right Side View"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
          "title": "Kth Smallest Element in a BST"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-paths/",
          "title": "Binary Tree Paths"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
          "title": "All Nodes Distance K in Binary Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/path-sum-iii/",
          "title": "Path Sum III"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/path-sum/",
          "title": "Path Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/sum-root-to-leaf-numbers/",
          "title": "Sum Root to Leaf Numbers"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-univalue-path/",
          "title": "Longest Univalue Path"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
          "title": "Serialize and Deserialize Binary Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
          "title": "Flatten Binary Tree to Linked List (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/",
          "title": "Construct Binary Tree from Preorder and Postorder Traversal"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "bfs-level-order": {
    "id": "bfs-level-order",
    "name": "BFS Level Order",
    "title": "BFS Level Order",
    "category": "Trees & BSTs",
    "explanation": {
      "problemStatement": "Traverse tree level by level",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize queue with root",
        "Process current level completely",
        "Track level size to separate levels",
        "Dequeue nodes and add children",
        "Collect values by level",
        "Continue until queue empty"
      ],
      "useCase": "Level-order problems, finding level averages, zigzag traversal, tree width.",
      "tips": [
        "Use queue for BFS",
        "Track level size for grouping",
        "O(n) time, O(w) space where w is width",
        "Natural for tree width/depth problems"
      ]
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function levelOrder(root: TreeNode | null): number[][] {\n  if (!root) return [];\n\n  const result: number[][] = [];\n  const queue: TreeNode[] = [root];\n\n  while (queue.length > 0) {\n    const levelSize = queue.length;\n    const level: number[] = [];\n\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue.shift()!;\n      level.push(node.val);\n\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n\n    result.push(level);\n  }\n\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "from collections import deque\n\ndef level_order(root: TreeNode) -> list[List[int]]:\nif not root:\n  return []\n\nresult = []\nqueue = deque([root])\n\nwhile queue:\n  level_size = len(queue)\nlevel = []\n\nfor _ in range(level_size):\n  node = queue.popleft()\nlevel.append(node.val)\n\nif node.left:\n  queue.append(node.left)\nif node.right:\n  queue.append(node.right)\n\nresult.append(level)\n\nreturn result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List < List < Integer >> levelOrder(TreeNode root) {\n  if (root == null) return new ArrayList<>();\n\n  List < List < Integer >> result = new ArrayList<>();\n  Queue < TreeNode > queue = new LinkedList<>();\n  queue.offer(root);\n\n  while (!queue.isEmpty()) {\n        int levelSize = queue.size();\n    List < Integer > level = new ArrayList<>();\n\n    for (int i = 0; i < levelSize; i++) {\n            TreeNode node = queue.poll();\n      level.add(node.val);\n\n      if (node.left != null) queue.offer(node.left);\n      if (node.right != null) queue.offer(node.right);\n    }\n\n    result.add(level);\n  }\n\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector < vector < int >> levelOrder(TreeNode * root) {\n  if (!root) return {};\n\n  vector < vector < int >> result;\n  queue < TreeNode *> q;\n  q.push(root);\n\n  while (!q.empty()) {\n        int levelSize = q.size();\n    vector < int > level;\n\n    for (int i = 0; i < levelSize; i++) {\n      TreeNode * node = q.front();\n      q.pop();\n      level.push_back(node -> val);\n\n      if (node -> left) q.push(node -> left);\n      if (node -> right) q.push(node -> right);\n    }\n\n    result.push_back(level);\n  }\n\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "BFS traverses tree level by level using a queue, processing all nodes at each depth before moving deeper.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(w)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=6ZnyEApgFYg",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
          "title": "Binary Tree Level Order Traversal"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/",
          "title": "Binary Tree Level Order Traversal II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/binary-tree-right-side-view/",
          "title": "Binary Tree Right Side View"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/n-ary-tree-level-order-traversal/",
          "title": "N-ary Tree Level Order Traversal"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-largest-value-in-each-tree-row/",
          "title": "Find Largest Value in Each Tree Row"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/symmetric-tree/",
          "title": "Symmetric Tree"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/average-of-levels-in-binary-tree/",
          "title": "Average of Levels in Binary Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/",
          "title": "Populating Next Right Pointers in Each Node"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/",
          "title": "Populating Next Right Pointers in Each Node II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
          "title": "Binary Tree Maximum Path Sum"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
          "title": "Serialize and Deserialize Binary Tree"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "bst-insert": {
    "id": "bst-insert",
    "name": "BST Insert",
    "title": "BST Insert",
    "category": "Trees & BSTs",
    "explanation": {
      "problemStatement": "Insert node in binary search tree",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "If tree is empty, create new node",
        "Compare value with root",
        "If less, recursively insert in left subtree",
        "If greater, recursively insert in right subtree",
        "Return root after insertion"
      ],
      "useCase": "Building BST, maintaining sorted data, dynamic insertion.",
      "tips": [
        "O(log n) average, O(n) worst case",
        "Maintains BST property",
        "Can be done iteratively",
        "Consider balancing for large datasets"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {\n  if (!root) return new TreeNode(val);\n\n  if (val < root.val) {\n    root.left = insertIntoBST(root.left, val);\n  } else {\n    root.right = insertIntoBST(root.right, val);\n  }\n\n  return root;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def insert_into_bst(root: TreeNode, val: int) -> TreeNode:\nif not root:\n  return TreeNode(val)\n\nif val < root.val:\n  root.left = insert_into_bst(root.left, val)\nelse:\nroot.right = insert_into_bst(root.right, val)\n\nreturn root"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public TreeNode insertIntoBST(TreeNode root, int val) {\n  if (root == null) return new TreeNode(val);\n\n  if (val < root.val) {\n    root.left = insertIntoBST(root.left, val);\n  } else {\n    root.right = insertIntoBST(root.right, val);\n  }\n\n  return root;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "TreeNode * insertIntoBST(TreeNode * root, int val) {\n  if (!root) return new TreeNode(val);\n\n  if (val < root -> val) {\n    root -> left = insertIntoBST(root -> left, val);\n  } else {\n    root -> right = insertIntoBST(root -> right, val);\n  }\n\n  return root;\n} "
          }
        ]
      }
    ],
    "overview": "Insert a value into BST while maintaining BST property (left < root < right).",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(h)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
          "title": "Insert into a Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/validate-binary-search-tree/",
          "title": "Validate Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/delete-node-in-a-bst/",
          "title": "Delete Node in a BST"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
          "title": "Kth Smallest Element in a BST"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
          "title": "Convert Sorted Array to Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/",
          "title": "Convert Sorted List to Binary Search Tree"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/closest-binary-search-tree-value-ii/",
          "title": "Closest Binary Search Tree Value II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/",
          "title": "Two Sum IV - Input is a BST"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/largest-bst-subtree/",
          "title": "Largest BST Subtree"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/recover-binary-search-tree/",
          "title": "Recover Binary Search Tree"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "lca": {
    "id": "lca",
    "name": "Lowest Common Ancestor",
    "title": "Lowest Common Ancestor",
    "category": "Trees & BSTs",
    "explanation": {
      "problemStatement": "Find LCA of two nodes in tree",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Base case: if root is null or equals p or q, return root",
        "Recursively search left and right subtrees",
        "If both return non-null, root is LCA",
        "If only one returns non-null, that's the LCA",
        "Elegant post-order traversal solution"
      ],
      "useCase": "Finding common ancestor, tree relationships, distance calculations.",
      "tips": [
        "O(n) time, single pass",
        "O(h) space for recursion",
        "Works for both BST and binary tree",
        "Post-order traversal pattern"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {\n  if (!root || root === p || root === q) return root;\n\n  const left = lowestCommonAncestor(root.left, p, q);\n  const right = lowestCommonAncestor(root.right, p, q);\n\n  if (left && right) return root;\n  return left || right;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:\nif not root or root == p or root == q:\nreturn root\n\nleft = lowest_common_ancestor(root.left, p, q)\nright = lowest_common_ancestor(root.right, p, q)\n\nif left and right:\nreturn root\nreturn left or right"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n  if (root == null || root == p || root == q) return root;\n    \n    TreeNode left = lowestCommonAncestor(root.left, p, q);\n    TreeNode right = lowestCommonAncestor(root.right, p, q);\n\n  if (left != null && right != null) return root;\n  return left != null ? left : right;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "TreeNode * lowestCommonAncestor(TreeNode * root, TreeNode * p, TreeNode * q) {\n  if (!root || root == p || root == q) return root;\n\n  TreeNode * left = lowestCommonAncestor(root -> left, p, q);\n  TreeNode * right = lowestCommonAncestor(root -> right, p, q);\n\n  if (left && right) return root;\n  return left ? left : right;\n} "
          }
        ]
      }
    ],
    "overview": "Find lowest common ancestor of two nodes in binary tree using recursion.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=gs2LMfuOR9k",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
          "title": "Lowest Common Ancestor of a Binary Tree"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
          "title": "Lowest Common Ancestor of a Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/",
          "title": "Lowest Common Ancestor of a Binary Tree III"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/missing-element-in-sorted-array/",
          "title": "Missing Element in Sorted Array"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
          "title": "Binary Tree Maximum Path Sum"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "recover-bst": {
    "id": "recover-bst",
    "name": "Recover BST",
    "title": "Recover BST",
    "category": "Trees & BSTs",
    "explanation": {
      "problemStatement": "Fix BST with two swapped nodes",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Do inorder traversal (should be sorted in BST)",
        "Find first violation: prev.val > curr.val",
        "Mark first as prev, continue searching",
        "Find second violation (or update second)",
        "Swap values of first and second nodes"
      ],
      "useCase": "Fix corrupted BST, data structure repair, validation and correction.",
      "tips": [
        "Inorder of BST is sorted",
        "Two violations for adjacent swaps, one for distant",
        "O(1) space with Morris traversal",
        "Keep track of previous node"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function recoverTree(root: TreeNode | null): void {\n  let first: TreeNode | null = null;\n  let second: TreeNode | null = null;\n  let prev: TreeNode | null = null;\n  \n  function inorder(node: TreeNode | null): void {\n    if (!node) return;\n    \n    inorder(node.left);\n    \n    if (prev && prev.val > node.val) {\n      if (!first) first = prev;\n      second = node;\n    }\n    prev = node;\n    \n    inorder(node.right);\n  }\n  \n  inorder(root);\n  if (first && second) {\n    [first.val, second.val] = [second.val, first.val];\n  }\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def recoverTree(root):\n    first = second = prev = None\n    \n    def inorder(node):\n        nonlocal first, second, prev\n        if not node:\n            return\n        \n        inorder(node.left)\n        \n        if prev and prev.val > node.val:\n            if not first:\n                first = prev\n            second = node\n        prev = node\n        \n        inorder(node.right)\n    \n    inorder(root)\n    if first and second:\n        first.val, second.val = second.val, first.val"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "private TreeNode first = null;\nprivate TreeNode second = null;\nprivate TreeNode prev = null;\n\npublic void recoverTree(TreeNode root) {\n    inorder(root);\n    if (first != null && second != null) {\n        int temp = first.val;\n        first.val = second.val;\n        second.val = temp;\n    }\n}\n\nprivate void inorder(TreeNode node) {\n    if (node == null) return;\n    \n    inorder(node.left);\n    \n    if (prev != null && prev.val > node.val) {\n        if (first == null) first = prev;\n        second = node;\n    }\n    prev = node;\n    \n    inorder(node.right);\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void recoverTree(TreeNode* root) {\n    TreeNode *first = nullptr, *second = nullptr, *prev = nullptr;\n    \n    function<void(TreeNode*)> inorder = [&](TreeNode* node) {\n        if (!node) return;\n        \n        inorder(node->left);\n        \n        if (prev && prev->val > node->val) {\n            if (!first) first = prev;\n            second = node;\n        }\n        prev = node;\n        \n        inorder(node->right);\n    };\n    \n    inorder(root);\n    if (first && second) {\n        swap(first->val, second->val);\n    }\n}"
          }
        ]
      }
    ],
    "overview": "Two nodes of a BST are swapped by mistake. Recover the tree without changing its structure by finding and swapping the two nodes.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/recover-binary-search-tree/",
          "title": "Recover Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/validate-binary-search-tree/",
          "title": "Validate Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
          "title": "Kth Smallest Element in a BST"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-mode-in-binary-search-tree/",
          "title": "Find Mode in Binary Search Tree"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
          "title": "Binary Tree Maximum Path Sum"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/recover-binary-search-tree/",
          "title": "Recover Binary Search Tree (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/validate-binary-search-tree/",
          "title": "Validate Binary Search Tree (duplicate)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "serialize-tree": {
    "id": "serialize-tree",
    "name": "Serialize Tree",
    "title": "Serialize Tree",
    "category": "Trees & BSTs",
    "explanation": {
      "problemStatement": "Serialize and deserialize binary tree",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Serialize: Use preorder DFS, add 'null' for empty nodes",
        "Create comma-separated string of values",
        "Deserialize: Split string and rebuild tree",
        "Use index to track position in array",
        "Recursively build left and right subtrees"
      ],
      "useCase": "Save tree to file, network transmission, deep copy of tree structure.",
      "tips": [
        "Preorder traversal maintains structure",
        "Handle null nodes explicitly",
        "Use index pointer for parsing",
        "BFS serialization also works"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function serialize(root: TreeNode | null): string {\n  if (!root) return 'null';\n  return `${root.val},${serialize(root.left)},${serialize(root.right)}`;\n}\n\nfunction deserialize(data: string): TreeNode | null {\n  const values = data.split(',');\n  let index = 0;\n  \n  function build(): TreeNode | null {\n    if (index >= values.length || values[index] === 'null') {\n      index++;\n      return null;\n    }\n    const node = new TreeNode(parseInt(values[index++]));\n    node.left = build();\n    node.right = build();\n    return node;\n  }\n  \n  return build();\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def serialize(root):\n    if not root:\n        return 'null'\n    return f\"{root.val},{serialize(root.left)},{serialize(root.right)}\"\n\ndef deserialize(data):\n    values = data.split(',')\n    index = [0]\n    \n    def build():\n        if index[0] >= len(values) or values[index[0]] == 'null':\n            index[0] += 1\n            return None\n        node = TreeNode(int(values[index[0]]))\n        index[0] += 1\n        node.left = build()\n        node.right = build()\n        return node\n    \n    return build()"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public String serialize(TreeNode root) {\n    if (root == null) return \"null\";\n    return root.val + \",\" + serialize(root.left) + \",\" + serialize(root.right);\n}\n\npublic TreeNode deserialize(String data) {\n    String[] values = data.split(\",\");\n    int[] index = {0};\n    return build(values, index);\n}\n\nprivate TreeNode build(String[] values, int[] index) {\n    if (index[0] >= values.length || values[index[0]].equals(\"null\")) {\n        index[0]++;\n        return null;\n    }\n    TreeNode node = new TreeNode(Integer.parseInt(values[index[0]++]));\n    node.left = build(values, index);\n    node.right = build(values, index);\n    return node;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "string serialize(TreeNode* root) {\n    if (!root) return \"null\";\n    return to_string(root->val) + \",\" + serialize(root->left) + \",\" + serialize(root->right);\n}\n\nTreeNode* deserialize(string data) {\n    stringstream ss(data);\n    string val;\n    vector<string> values;\n    while (getline(ss, val, ',')) {\n        values.push_back(val);\n    }\n    int index = 0;\n    return build(values, index);\n}\n\nTreeNode* build(vector<string>& values, int& index) {\n    if (index >= values.size() || values[index] == \"null\") {\n        index++;\n        return nullptr;\n    }\n    TreeNode* node = new TreeNode(stoi(values[index++]));\n    node->left = build(values, index);\n    node->right = build(values, index);\n    return node;\n}"
          }
        ]
      }
    ],
    "overview": "Serialize a binary tree to a string and deserialize it back. Uses preorder traversal with null markers.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=u4JAi2JJhI8",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
          "title": "Serialize and Deserialize Binary Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/serialize-and-deserialize-bst/",
          "title": "Serialize and Deserialize BST"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/binary-search-tree-iterator/",
          "title": "Binary Search Tree Iterator"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/unique-binary-search-trees-ii/",
          "title": "Unique Binary Search Trees II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/unique-binary-search-trees/",
          "title": "Unique Binary Search Trees"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
          "title": "Binary Tree Maximum Path Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/sum-root-to-leaf-numbers/",
          "title": "Sum Root to Leaf Numbers"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-paths/",
          "title": "Binary Tree Paths"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "trie": {
    "id": "trie",
    "name": "Trie (Prefix Tree)",
    "title": "Trie (Prefix Tree)",
    "category": "Trees & BSTs",
    "explanation": {
      "problemStatement": "Efficient string storage and retrieval",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Each node represents a character",
        "Children are stored in hash map",
        "isEnd flag marks complete words",
        "Insert: traverse and create nodes",
        "Search: traverse and check isEnd",
        "Prefix search: traverse only"
      ],
      "useCase": "Autocomplete, spell checker, IP routing, dictionary implementation.",
      "tips": [
        "O(m) operations where m is word length",
        "Space efficient for shared prefixes",
        "Faster than hash for prefix operations",
        "Can store additional data in nodes"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "class TrieNode {\n  children: Map<string, TrieNode> = new Map();\n  isEnd: boolean = false;\n}\n\nclass Trie {\n  root = new TrieNode();\n\n  insert(word: string): void {\n    let node = this.root;\n    for (const char of word) {\n      if (!node.children.has(char)) {\n        node.children.set(char, new TrieNode());\n      }\n      node = node.children.get(char)!;\n    }\n    node.isEnd = true;\n  }\n\n  search(word: string): boolean {\n    let node = this.root;\n    for (const char of word) {\n      if (!node.children.has(char)) return false;\n      node = node.children.get(char)!;\n    }\n    return node.isEnd;\n  }\n\n  startsWith(prefix: string): boolean {\n    let node = this.root;\n    for (const char of prefix) {\n      if (!node.children.has(char)) return false;\n      node = node.children.get(char)!;\n    }\n    return true;\n  }\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "class TrieNode:\n    def __init__(self):\nself.children = {}\nself.is_end = False\n\nclass Trie:\n    def __init__(self):\nself.root = TrieNode()\n    \n    def insert(self, word: str) -> None:\nnode = self.root\nfor char in word:\n  if char not in node.children:\nnode.children[char] = TrieNode()\nnode = node.children[char]\nnode.is_end = True\n    \n    def search(self, word: str) -> bool:\nnode = self.root\nfor char in word:\n  if char not in node.children:\nreturn False\nnode = node.children[char]\nreturn node.is_end\n    \n    def starts_with(self, prefix: str) -> bool:\nnode = self.root\nfor char in prefix:\n  if char not in node.children:\nreturn False\nnode = node.children[char]\nreturn True"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "class TrieNode {\n  Map<Character, TrieNode> children = new HashMap<>();\n    boolean isEnd = false;\n}\n\nclass Trie {\n    TrieNode root = new TrieNode();\n\n  public void insert(String word) {\n        TrieNode node = root;\n    for (char c : word.toCharArray()) {\n      node.children.putIfAbsent(c, new TrieNode());\n      node = node.children.get(c);\n    }\n    node.isEnd = true;\n  }\n\n  public boolean search(String word) {\n        TrieNode node = root;\n    for (char c : word.toCharArray()) {\n      node = node.children.get(c);\n      if (node == null) return false;\n    }\n    return node.isEnd;\n  }\n\n  public boolean startsWith(String prefix) {\n        TrieNode node = root;\n    for (char c : prefix.toCharArray()) {\n      node = node.children.get(c);\n      if (node == null) return false;\n    }\n    return true;\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "class TrieNode {\n  public:\n    unordered_map<char, TrieNode*> children;\n    bool isEnd = false;\n};\n\nclass Trie {\n    TrieNode* root;\n  public:\n    Trie() { root = new TrieNode(); }\n\nvoid insert(string word) {\n  TrieNode * node = root;\n  for (char c : word) {\n    if (!node -> children[c]) {\n      node -> children[c] = new TrieNode();\n    }\n    node = node -> children[c];\n  }\n  node -> isEnd = true;\n}\n    \n    bool search(string word) {\n  TrieNode * node = root;\n  for (char c : word) {\n    if (!node -> children[c]) return false;\n    node = node -> children[c];\n  }\n  return node -> isEnd;\n}\n    \n    bool startsWith(string prefix) {\n  TrieNode * node = root;\n  for (char c : prefix) {\n    if (!node -> children[c]) return false;\n    node = node -> children[c];\n  }\n  return true;\n}\n}; "
          }
        ]
      }
    ],
    "overview": "Prefix tree data structure for efficient string storage and retrieval with common prefixes.",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(n*m)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=oobqoCJlHA0",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/implement-trie-prefix-tree/",
          "title": "Implement Trie (Prefix Tree)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
          "title": "Design Add and Search Words Data Structure"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/word-search-ii/",
          "title": "Word Search II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/longest-word-in-dictionary/",
          "title": "Longest Word in Dictionary"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/concatenated-words/",
          "title": "Concatenated Words"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/design-search-autocomplete-system/",
          "title": "Design Search Autocomplete System"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/replace-words/",
          "title": "Replace Words"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "graph-dfs": {
    "id": "graph-dfs",
    "name": "Graph DFS",
    "title": "Graph DFS",
    "category": "Graphs",
    "explanation": {
      "problemStatement": "Depth-first traversal of graphs",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Mark current node as visited",
        "Process current node",
        "Recursively visit all unvisited neighbors",
        "Backtrack when no unvisited neighbors",
        "Continue until all reachable nodes visited"
      ],
      "useCase": "Path finding, cycle detection, topological sort, connected components.",
      "tips": [
        "O(V + E) time complexity",
        "Use recursion or explicit stack",
        "Mark visited to avoid cycles",
        "Good for pathfinding problems"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function dfs(graph: number[][], start: number): number[] {\n  const visited = new Set<number>();\n  const result: number[] = [];\n\n  function explore(node: number) {\n    visited.add(node);\n    result.push(node);\n\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        explore(neighbor);\n      }\n    }\n  }\n\n  explore(start);\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def dfs(graph: list[List[int]], start: int) -> List[int]:\nvisited = set()\nresult = []\n    \n    def explore(node):\nvisited.add(node)\nresult.append(node)\n\nfor neighbor in graph[node]:\n  if neighbor not in visited:\nexplore(neighbor)\n\nexplore(start)\nreturn result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List < Integer > dfs(List < List < Integer >> graph, int start) {\n  Set < Integer > visited = new HashSet<>();\n  List < Integer > result = new ArrayList<>();\n  explore(start, graph, visited, result);\n  return result;\n}\n\nprivate void explore(int node, List < List < Integer >> graph,\n  Set < Integer > visited, List < Integer > result) {\n  visited.add(node);\n  result.add(node);\n\n  for (int neighbor : graph.get(node)) {\n    if (!visited.contains(neighbor)) {\n      explore(neighbor, graph, visited, result);\n    }\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void explore(int node, vector<vector<int>> & graph,\n  unordered_set<int> & visited, vector<int> & result) {\n  visited.insert(node);\n  result.push_back(node);\n\n  for (int neighbor : graph[node]) {\n    if (visited.find(neighbor) == visited.end()) {\n      explore(neighbor, graph, visited, result);\n    }\n  }\n}\n\nvector < int > dfs(vector<vector<int>> & graph, int start) {\n  unordered_set < int > visited;\n  vector < int > result;\n  explore(start, graph, visited, result);\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "DFS explores graph by going as deep as possible before backtracking, using recursion or stack.",
    "timeComplexity": "O(V+E)",
    "spaceComplexity": "O(V)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-islands/",
          "title": "Number of Islands"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/clone-graph/",
          "title": "Clone Graph"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/all-paths-from-source-to-target/",
          "title": "All Paths From Source to Target"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/keys-and-rooms/",
          "title": "Keys and Rooms"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
          "title": "Number of Operations to Make Network Connected"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/frog-jump/",
          "title": "Frog Jump"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/is-graph-bipartite/",
          "title": "Is Graph Bipartite?"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/possible-bipartition/",
          "title": "Possible Bipartition"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/graph-valid-tree/",
          "title": "Graph Valid Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/course-schedule/",
          "title": "Course Schedule"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/course-schedule-ii/",
          "title": "Course Schedule II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/ipo/",
          "title": "IPO"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-height-trees/",
          "title": "Minimum Height Trees"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-town-judge/",
          "title": "Find the Town Judge"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "graph-bfs": {
    "id": "graph-bfs",
    "name": "Graph BFS",
    "title": "Graph BFS",
    "category": "Graphs",
    "explanation": {
      "problemStatement": "Breadth-first traversal of graphs",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize queue with start node",
        "Mark start as visited",
        "Dequeue node and process",
        "Enqueue all unvisited neighbors",
        "Mark neighbors as visited when adding to queue",
        "Continue until queue empty"
      ],
      "useCase": "Shortest path in unweighted graphs, level-based problems, minimum steps.",
      "tips": [
        "Use queue (FIFO)",
        "O(V + E) time, O(V) space",
        "Mark visited when adding to queue",
        "Guarantees shortest path in unweighted graphs"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function bfs(graph: number[][], start: number): number[] {\n  const visited = new Set<number>();\n  const queue: number[] = [start];\n  const result: number[] = [];\n\n  visited.add(start);\n\n  while (queue.length > 0) {\n    const node = queue.shift()!;\n    result.push(node);\n\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "from collections import deque\n\ndef bfs(graph: list[List[int]], start: int) -> List[int]:\nvisited = set([start])\nqueue = deque([start])\nresult = []\n\nwhile queue:\n  node = queue.popleft()\nresult.append(node)\n\nfor neighbor in graph[node]:\n  if neighbor not in visited:\nvisited.add(neighbor)\nqueue.append(neighbor)\n\nreturn result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List < Integer > bfs(List < List < Integer >> graph, int start) {\n  Set < Integer > visited = new HashSet<>();\n  Queue < Integer > queue = new LinkedList<>();\n  List < Integer > result = new ArrayList<>();\n\n  visited.add(start);\n  queue.offer(start);\n\n  while (!queue.isEmpty()) {\n        int node = queue.poll();\n    result.add(node);\n\n    for (int neighbor : graph.get(node)) {\n      if (!visited.contains(neighbor)) {\n        visited.add(neighbor);\n        queue.offer(neighbor);\n      }\n    }\n  }\n\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector < int > bfs(vector<vector<int>> & graph, int start) {\n  unordered_set < int > visited;\n  queue < int > q;\n  vector < int > result;\n\n  visited.insert(start);\n  q.push(start);\n\n  while (!q.empty()) {\n        int node = q.front();\n    q.pop();\n    result.push_back(node);\n\n    for (int neighbor : graph[node]) {\n      if (visited.find(neighbor) == visited.end()) {\n        visited.insert(neighbor);\n        q.push(neighbor);\n      }\n    }\n  }\n\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "BFS explores graph level by level using a queue, finding shortest paths in unweighted graphs.",
    "timeComplexity": "O(V+E)",
    "spaceComplexity": "O(V)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
          "title": "Binary Tree Level Order Traversal"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-if-path-exists-in-graph/",
          "title": "Find if Path Exists in Graph"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/clone-graph/",
          "title": "Clone Graph"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/alien-dictionary/",
          "title": "Alien Dictionary"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
          "title": "Longest Increasing Path in a Matrix"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/perfect-squares/",
          "title": "Perfect Squares"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-knight-moves/",
          "title": "Minimum Knight Moves"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/open-the-lock/",
          "title": "Open the Lock"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-islands/",
          "title": "Number of Islands"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/shortest-distance-from-all-buildings/",
          "title": "Shortest Distance from All Buildings"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/snakes-and-ladders/",
          "title": "Snakes and Ladders"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/01-matrix/",
          "title": "01 Matrix"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/is-graph-bipartite/",
          "title": "Is Graph Bipartite?"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/pascals-triangle-ii/",
          "title": "Pascal's Triangle II"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "topological-sort": {
    "id": "topological-sort",
    "name": "Topological Sort",
    "title": "Topological Sort",
    "category": "Graphs",
    "explanation": {
      "problemStatement": "Kahn's algorithm for DAG ordering",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Build adjacency list and calculate in-degrees",
        "Add all nodes with in-degree 0 to queue",
        "Process nodes from queue",
        "Reduce in-degree of neighbors",
        "Add neighbors with in-degree 0 to queue",
        "If all nodes processed, return order; else cycle exists"
      ],
      "useCase": "Course scheduling, task dependencies, build systems, compilation order.",
      "tips": [
        "O(V + E) time complexity",
        "Detects cycles (empty result)",
        "BFS-based (Kahn's algorithm)",
        "Can also use DFS approach"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function topologicalSort(numCourses: number, prerequisites: number[][]): number[] {\n  const graph: number[][] = Array(numCourses).fill(0).map(() => []);\n  const inDegree = new Array(numCourses).fill(0);\n\n  for (const [course, prereq] of prerequisites) {\n    graph[prereq].push(course);\n    inDegree[course]++;\n  }\n\n  const queue: number[] = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n\n  const result: number[] = [];\n  while (queue.length > 0) {\n    const node = queue.shift()!;\n    result.push(node);\n\n    for (const neighbor of graph[node]) {\n      inDegree[neighbor]--;\n      if (inDegree[neighbor] === 0) {\n        queue.push(neighbor);\n      }\n    }\n  }\n\n  return result.length === numCourses ? result : [];\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "from collections import deque\n\ndef topological_sort(num_courses: int, prerequisites: list[List[int]]) -> List[int]:\ngraph = [[] for _ in range(num_courses)]\nin_degree = [0] * num_courses\n\nfor course, prereq in prerequisites:\n  graph[prereq].append(course)\nin_degree[course] += 1\n\nqueue = deque([i for i in range(num_courses) if in_degree[i] == 0])\nresult = []\n\nwhile queue:\n  node = queue.popleft()\nresult.append(node)\n\nfor neighbor in graph[node]:\n  in_degree[neighbor] -= 1\nif in_degree[neighbor] == 0:\n  queue.append(neighbor)\n\nreturn result if len(result) == num_courses else[]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int[] topologicalSort(int numCourses, int[][] prerequisites) {\n  List < List < Integer >> graph = new ArrayList<>();\n  for (int i = 0; i < numCourses; i++) {\n    graph.add(new ArrayList<>());\n  }\n  int[] inDegree = new int[numCourses];\n\n  for (int[] p : prerequisites) {\n    graph.get(p[1]).add(p[0]);\n    inDegree[p[0]]++;\n  }\n\n  Queue < Integer > queue = new LinkedList<>();\n  for (int i = 0; i < numCourses; i++) {\n    if (inDegree[i] == 0) queue.offer(i);\n  }\n\n  int[] result = new int[numCourses];\n    int idx = 0;\n\n  while (!queue.isEmpty()) {\n        int node = queue.poll();\n    result[idx++] = node;\n\n    for (int neighbor : graph.get(node)) {\n      if (--inDegree[neighbor] == 0) {\n        queue.offer(neighbor);\n      }\n    }\n  }\n\n  return idx == numCourses ? result : new int[0];\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector < int > topologicalSort(int numCourses, vector<vector<int>> & prerequisites) {\n  vector < vector < int >> graph(numCourses);\n  vector < int > inDegree(numCourses, 0);\n\n  for (auto & p : prerequisites) {\n    graph[p[1]].push_back(p[0]);\n    inDegree[p[0]]++;\n  }\n\n  queue < int > q;\n  for (int i = 0; i < numCourses; i++) {\n    if (inDegree[i] == 0) q.push(i);\n  }\n\n  vector < int > result;\n  while (!q.empty()) {\n        int node = q.front();\n    q.pop();\n    result.push_back(node);\n\n    for (int neighbor : graph[node]) {\n      if (--inDegree[neighbor] == 0) {\n        q.push(neighbor);\n      }\n    }\n  }\n\n  return result.size() == numCourses ? result : vector<int>();\n} "
          }
        ]
      }
    ],
    "overview": "Kahn's algorithm for topological sorting using BFS and in-degree tracking.",
    "timeComplexity": "O(V+E)",
    "spaceComplexity": "O(V)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=EgI5nU9etnU",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/course-schedule/",
          "title": "Course Schedule"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/course-schedule-ii/",
          "title": "Course Schedule II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/alien-dictionary/",
          "title": "Alien Dictionary"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/course-schedule-iv/",
          "title": "Course Schedule IV"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses/",
          "title": "Reverse Substrings Between Each Pair of Parentheses"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies/",
          "title": "Sort Items by Groups Respecting Dependencies"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-height-trees/",
          "title": "Minimum Height Trees"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-town-judge/",
          "title": "Find the Town Judge"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "union-find": {
    "id": "union-find",
    "name": "Union-Find",
    "title": "Union-Find",
    "category": "Graphs",
    "explanation": {
      "problemStatement": "Disjoint set data structure",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize: each element is its own parent",
        "Find: recursively find root with path compression",
        "Union: connect roots of two sets",
        "Union by rank: attach smaller tree to larger",
        "Path compression flattens tree structure",
        "Near O(1) amortized time"
      ],
      "useCase": "Connected components, cycle detection, Kruskal's MST, network connectivity.",
      "tips": [
        "O(α(n)) amortized time per operation",
        "Path compression in find",
        "Union by rank for balance",
        "Essential for graph algorithms"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "class UnionFind {\n  parent: number[];\n  rank: number[];\n\n  constructor(n: number) {\n    this.parent = Array(n).fill(0).map(() => i);\n    this.rank = Array(n).fill(1);\n  }\n\n  find(x: number): number {\n    if (this.parent[x] !== x) {\n      this.parent[x] = this.find(this.parent[x]);\n    }\n    return this.parent[x];\n  }\n\n  union(x: number, y: number): boolean {\n    const rootX = this.find(x);\n    const rootY = this.find(y);\n\n    if (rootX === rootY) return false;\n\n    if (this.rank[rootX] < this.rank[rootY]) {\n      this.parent[rootX] = rootY;\n    } else if (this.rank[rootX] > this.rank[rootY]) {\n      this.parent[rootY] = rootX;\n    } else {\n      this.parent[rootY] = rootX;\n      this.rank[rootX]++;\n    }\n\n    return true;\n  }\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "class UnionFind:\n    def __init__(self, n: int):\nself.parent = list(range(n))\nself.rank = [1] * n\n    \n    def find(self, x: int) -> int:\nif self.parent[x] != x:\n  self.parent[x] = self.find(self.parent[x])\nreturn self.parent[x]\n    \n    def union(self, x: int, y: int) -> bool:\nroot_x = self.find(x)\nroot_y = self.find(y)\n\nif root_x == root_y:\n  return False\n\nif self.rank[root_x] < self.rank[root_y]:\n  self.parent[root_x] = root_y\n        elif self.rank[root_x] > self.rank[root_y]:\nself.parent[root_y] = root_x\n        else:\nself.parent[root_y] = root_x\nself.rank[root_x] += 1\n\nreturn True"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "class UnionFind {\n    int[] parent, rank;\n\n  public UnionFind(int n) {\n    parent = new int[n];\n    rank = new int[n];\n    for (int i = 0; i < n; i++) {\n      parent[i] = i;\n      rank[i] = 1;\n    }\n  }\n\n  public int find(int x) {\n    if (parent[x] != x) {\n      parent[x] = find(parent[x]);\n    }\n    return parent[x];\n  }\n\n  public boolean union(int x, int y) {\n        int rootX = find(x), rootY = find(y);\n\n    if (rootX == rootY) return false;\n\n    if (rank[rootX] < rank[rootY]) {\n      parent[rootX] = rootY;\n    } else if (rank[rootX] > rank[rootY]) {\n      parent[rootY] = rootX;\n    } else {\n      parent[rootY] = rootX;\n      rank[rootX]++;\n    }\n\n    return true;\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "class UnionFind {\n  vector<int> parent, rank;\n  public:\n    UnionFind(int n) : parent(n), rank(n, 1) {\n      iota(parent.begin(), parent.end(), 0);\n    }\n    \n    int find(int x) {\n    if (parent[x] != x) {\n      parent[x] = find(parent[x]);\n    }\n    return parent[x];\n  }\n    \n    bool unite(int x, int y) {\n        int rootX = find(x), rootY = find(y);\n\n    if (rootX == rootY) return false;\n\n    if (rank[rootX] < rank[rootY]) {\n      parent[rootX] = rootY;\n    } else if (rank[rootX] > rank[rootY]) {\n      parent[rootY] = rootX;\n    } else {\n      parent[rootY] = rootX;\n      rank[rootX]++;\n    }\n\n    return true;\n  }\n}; "
          }
        ]
      }
    ],
    "overview": "Disjoint set data structure with path compression and union by rank for efficient set operations.",
    "timeComplexity": "O(α(n))",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=8f1XPm4WOUc",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-provinces/",
          "title": "Number of Provinces"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/satisfiability-of-equality-equations/",
          "title": "Satisfiability of Equality Equations"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/number-of-islands-ii/",
          "title": "Number of Islands II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/redundant-connection/",
          "title": "Redundant Connection"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
          "title": "Number of Connected Components in an Undirected Graph"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/bus-routes/",
          "title": "Bus Routes"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/surrounded-regions/",
          "title": "Surrounded Regions"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/lexicographically-smallest-equivalent-string/",
          "title": "Lexicographically Smallest Equivalent String"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/critical-connections-in-a-network/",
          "title": "Critical Connections in a Network"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/accounts-merge/",
          "title": "Accounts Merge"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-town-judge/",
          "title": "Find the Town Judge"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "kruskals": {
    "id": "kruskals",
    "name": "Kruskal's Algorithm",
    "title": "Kruskal's Algorithm",
    "category": "Graphs",
    "explanation": {
      "problemStatement": "Find minimum spanning tree",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Sort all edges by weight in ascending order",
        "Initialize Union-Find data structure",
        "For each edge, check if it connects different components",
        "If yes, add to MST and union the components",
        "Continue until MST has n-1 edges"
      ],
      "useCase": "Network design, clustering, circuit design, minimum cost infrastructure.",
      "tips": [
        "Greedy approach with sorting",
        "Use Union-Find for cycle detection",
        "O(E log E) time complexity",
        "Works on edge list representation"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function kruskalMST(n: number, flatEdges: number[]): number {\n  const edges: [number, number, number][] = [];\n  for (let i = 0; i < flatEdges.length; i += 3) {\n    edges.push([flatEdges[i], flatEdges[i+1], flatEdges[i+2]]);\n  }\n  \n  return kruskalMSTInternal(n, edges);\n}\n\nfunction kruskalMSTInternal(n: number, edges: [number, number, number][]): number {\n  // Sort edges by weight\n  edges.sort((a, b) => a[2] - b[2]);\n  \n  const parent = Array.from({length: n}, (_, i) => i);\n  const rank = Array(n).fill(0);\n  \n  function find(x: number): number {\n    if (parent[x] !== x) parent[x] = find(parent[x]);\n    return parent[x];\n  }\n  \n  function union(x: number, y: number): boolean {\n    const px = find(x), py = find(y);\n    if (px === py) return false;\n    \n    if (rank[px] < rank[py]) parent[px] = py;\n    else if (rank[px] > rank[py]) parent[py] = px;\n    else { parent[py] = px; rank[px]++; }\n    return true;\n  }\n  \n  const mst: [number, number][] = [];\n  let totalWeight = 0;\n  \n  for (const [u, v, w] of edges) {\n    if (union(u, v)) {\n      mst.push([u, v]);\n      totalWeight += w;\n      if (mst.length === n - 1) break;\n    }\n  }\n  \n  return totalWeight;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def kruskal_mst(n: int, flat_edges: List[int]) -> int:\n    edges = []\n    for i in range(0, len(flat_edges), 3):\n        edges.append((flat_edges[i], flat_edges[i+1], flat_edges[i+2]))\n    \n    return kruskal_mst_internal(n, edges)\n\ndef kruskal_mst_internal(n, edges):\n    edges.sort(key=lambda x: x[2])\n    \n    parent = list(range(n))\n    rank = [0] * n\n    \n    def find(x):\n        if parent[x] != x:\n            parent[x] = find(parent[x])\n        return parent[x]\n    \n    def union(x, y):\n        px, py = find(x), find(y)\n        if px == py:\n            return False\n        \n        if rank[px] < rank[py]:\n            parent[px] = py\n        elif rank[px] > rank[py]:\n            parent[py] = px\n        else:\n            parent[py] = px\n            rank[px] += 1\n        return True\n    \n    mst = []\n    total_weight = 0\n    \n    for u, v, w in edges:\n        if union(u, v):\n            mst.append((u, v))\n            total_weight += w\n            if len(mst) == n - 1:\n                break\n    \n    return total_weight"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int kruskalMST(int n, int[] flatEdges) {\n    int[][] edges = new int[flatEdges.length / 3][3];\n    for (int i = 0, j = 0; i < flatEdges.length; i += 3, j++) {\n        edges[j] = new int[]{flatEdges[i], flatEdges[i+1], flatEdges[i+2]};\n    }\n    return kruskalMSTInternal(n, edges);\n}\n\npublic int kruskalMSTInternal(int n, int[][] edges) {\n    Arrays.sort(edges, (a, b) -> a[2] - b[2]);\n    \n    UnionFind uf = new UnionFind(n);\n    int totalWeight = 0;\n    int edgeCount = 0;\n    \n    for (int[] edge : edges) {\n        if (uf.union(edge[0], edge[1])) {\n            totalWeight += edge[2];\n            edgeCount++;\n            if (edgeCount == n - 1) break;\n        }\n    }\n    \n    return totalWeight;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "class UnionFind {\npublic:\n    vector<int> parent, rank;\n    UnionFind(int n) : parent(n), rank(n, 0) {\n        iota(parent.begin(), parent.end(), 0);\n    }\n    \n    int find(int x) {\n        if (parent[x] != x) parent[x] = find(parent[x]);\n        return parent[x];\n    }\n    \n    bool unite(int x, int y) {\n        int px = find(x), py = find(y);\n        if (px == py) return false;\n        \n        if (rank[px] < rank[py]) parent[px] = py;\n        else if (rank[px] > rank[py]) parent[py] = px;\n        else { parent[py] = px; rank[px]++; }\n        return true;\n    }\n};\n\nint kruskalMST(int n, vector<int>& flatEdges) {\n    vector<array<int,3>> edges;\n    for (size_t i = 0; i < flatEdges.size(); i += 3) {\n        edges.push_back({flatEdges[i], flatEdges[i+1], flatEdges[i+2]});\n    }\n    return kruskalMSTInternal(n, edges);\n}\n\nint kruskalMSTInternal(int n, vector<array<int,3>>& edges) {\n    sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a[2] < b[2]; });\n    \n    UnionFind uf(n);\n    int totalWeight = 0;\n    int edgeCount = 0;\n    \n    for (auto& [u, v, w] : edges) {\n        if (uf.unite(u, v)) {\n            totalWeight += w;\n            edgeCount++;\n            if (edgeCount == n - 1) break;\n        }\n    }\n    \n    return totalWeight;\n}"
          }
        ]
      }
    ],
    "overview": "Kruskal's algorithm finds the Minimum Spanning Tree by greedily selecting smallest edges that don't form cycles, using Union-Find.",
    "timeComplexity": "O(E log E)",
    "spaceComplexity": "O(V)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=f7JOBJIC-NA",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
          "title": "Min Cost to Connect All Points"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/optimize-water-distribution-in-a-village/",
          "title": "Optimize Water Distribution in a Village"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/connecting-cities-with-minimum-cost/",
          "title": "Connecting Cities With Minimum Cost"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/path-with-minimum-effort/",
          "title": "Path With Minimum Effort"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/check-if-string-is-transformable-with-substring-sort-operations/",
          "title": "Check If String Is Transformable With Substring Sort Operations"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
          "title": "Min Cost to Connect All Points (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/connecting-cities-with-minimum-cost/",
          "title": "Connecting Cities With Minimum Cost (duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/optimize-water-distribution-in-a-village/",
          "title": "Optimize Water Distribution in a Village (duplicate)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-town-judge/",
          "title": "Find the Town Judge"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [
      {
        "name": "n",
        "type": "number",
        "label": "Number of Nodes"
      },
      {
        "name": "flatEdges",
        "type": "number[]",
        "label": "Edges (u1, v1, w1, u2, v2, w2...)"
      }
    ],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "prims": {
    "id": "prims",
    "name": "Prim's Algorithm",
    "title": "Prim's Algorithm",
    "category": "Graphs",
    "explanation": {
      "problemStatement": "Find MST using greedy approach",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Start from any vertex (usually vertex 0)",
        "Mark it as visited",
        "Add all edges from visited to unvisited nodes to min heap",
        "Pick minimum weight edge to unvisited node",
        "Repeat until all nodes are visited"
      ],
      "useCase": "Dense graphs, network design, when graph is given as adjacency list.",
      "tips": [
        "Uses priority queue for efficiency",
        "O(E log V) with binary heap",
        "Better for dense graphs",
        "Builds MST incrementally from one node"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function primMST(n: number, graph: number[][][]): [number, [number, number][]] {\n  const visited = new Array(n).fill(false);\n  const minHeap: [number, number, number][] = [[0, 0, -1]]; // [weight, node, parent]\n  const mst: [number, number][] = [];\n  let totalWeight = 0;\n  \n  while (minHeap.length && mst.length < n - 1) {\n    minHeap.sort((a, b) => a[0] - b[0]);\n    const [weight, node, parent] = minHeap.shift()!;\n    \n    if (visited[node]) continue;\n    visited[node] = true;\n    \n    if (parent !== -1) {\n      mst.push([parent, node]);\n      totalWeight += weight;\n    }\n    \n    for (const [neighbor, w] of graph[node]) {\n      if (!visited[neighbor]) {\n        minHeap.push([w, neighbor, node]);\n      }\n    }\n  }\n  \n  return [totalWeight, mst];\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "import heapq\n\ndef prim_mst(n, graph):\n    visited = [False] * n\n    min_heap = [(0, 0, -1)]  # (weight, node, parent)\n    mst = []\n    total_weight = 0\n    \n    while min_heap and len(mst) < n - 1:\n        weight, node, parent = heapq.heappop(min_heap)\n        \n        if visited[node]:\n            continue\n        visited[node] = True\n        \n        if parent != -1:\n            mst.append((parent, node))\n            total_weight += weight\n        \n        for neighbor, w in graph[node]:\n            if not visited[neighbor]:\n                heapq.heappush(min_heap, (w, neighbor, node))\n    \n    return total_weight, mst"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int[] primMST(int n, List<int[]>[] graph) {\n    boolean[] visited = new boolean[n];\n    PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n    minHeap.offer(new int[]{0, 0, -1}); // {weight, node, parent}\n    \n    List<int[]> mst = new ArrayList<>();\n    int totalWeight = 0;\n    \n    while (!minHeap.isEmpty() && mst.size() < n - 1) {\n        int[] curr = minHeap.poll();\n        int weight = curr[0], node = curr[1], parent = curr[2];\n        \n        if (visited[node]) continue;\n        visited[node] = true;\n        \n        if (parent != -1) {\n            mst.add(new int[]{parent, node});\n            totalWeight += weight;\n        }\n        \n        for (int[] edge : graph[node]) {\n            if (!visited[edge[0]]) {\n                minHeap.offer(new int[]{edge[1], edge[0], node});\n            }\n        }\n    }\n    \n    return new int[]{totalWeight};\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "pair<int, vector<pair<int,int>>> primMST(int n, vector<vector<pair<int,int>>>& graph) {\n    vector<bool> visited(n, false);\n    priority_queue<array<int,3>, vector<array<int,3>>, greater<>> minHeap;\n    minHeap.push({0, 0, -1}); // {weight, node, parent}\n    \n    vector<pair<int,int>> mst;\n    int totalWeight = 0;\n    \n    while (!minHeap.empty() && mst.size() < n - 1) {\n        auto [weight, node, parent] = minHeap.top();\n        minHeap.pop();\n        \n        if (visited[node]) continue;\n        visited[node] = true;\n        \n        if (parent != -1) {\n            mst.push_back({parent, node});\n            totalWeight += weight;\n        }\n        \n        for (auto [neighbor, w] : graph[node]) {\n            if (!visited[neighbor]) {\n                minHeap.push({w, neighbor, node});\n            }\n        }\n    }\n    \n    return {totalWeight, mst};\n}"
          }
        ]
      }
    ],
    "overview": "Prim's algorithm builds MST by starting from a node and greedily adding the minimum weight edge connecting to unvisited nodes.",
    "timeComplexity": "O(E log V)",
    "spaceComplexity": "O(V)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=f7JOBJIC-NA",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
          "title": "Min Cost to Connect All Points"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/connecting-cities-with-minimum-cost/",
          "title": "Connecting Cities With Minimum Cost"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/optimize-water-distribution-in-a-village/",
          "title": "Optimize Water Distribution in a Village"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/check-if-string-is-transformable-with-substring-sort-operations/",
          "title": "Check If String Is Transformable With Substring Sort Operations"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-town-judge/",
          "title": "Find the Town Judge"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/stone-game-vii/",
          "title": "Stone Game VII"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/path-sum-ii/",
          "title": "Path Sum II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/k-concatenation-maximum-sum/",
          "title": "K-Concatenation Maximum Sum"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "dijkstras": {
    "id": "dijkstras",
    "name": "Dijkstra's Algorithm",
    "title": "Dijkstra's Algorithm",
    "category": "Graphs",
    "explanation": {
      "problemStatement": "Single-source shortest path",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize distances to infinity except source (0)",
        "Use min-heap priority queue",
        "Extract minimum distance node",
        "Relax all neighbors (update if shorter path found)",
        "Add updated neighbors to queue",
        "Continue until queue empty"
      ],
      "useCase": "GPS navigation, network routing, flight paths, any shortest path problem.",
      "tips": [
        "O((V+E) log V) with binary heap",
        "Greedy algorithm",
        "Doesn't work with negative weights",
        "Can track paths with parent array"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function dijkstra(graph: number[][][], start: number): number[] {\n  const n = graph.length;\n  const dist = new Array(n).fill(Infinity);\n  dist[start] = 0;\n\n  const pq: [number, number][] = [[0, start]]; // [distance, node]\n\n  while (pq.length > 0) {\n    pq.sort((a, b) => a[0] - b[0]);\n    const [d, u] = pq.shift()!;\n\n    if (d > dist[u]) continue;\n\n    for (const [v, weight] of graph[u]) {\n      const newDist = dist[u] + weight;\n      if (newDist < dist[v]) {\n        dist[v] = newDist;\n        pq.push([newDist, v]);\n      }\n    }\n  }\n\n  return dist;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "import heapq\n\ndef dijkstra(graph: list[list[tuple[int, int]]], start: int) -> List[int]:\nn = len(graph)\ndist = [float('inf')] * n\ndist[start] = 0\n\npq = [(0, start)]  #(distance, node)\n\nwhile pq:\n  d, u = heapq.heappop(pq)\n\nif d > dist[u]:\n  continue\n\nfor v, weight in graph[u]:\n  new_dist = dist[u] + weight\nif new_dist < dist[v]:\n  dist[v] = new_dist\nheapq.heappush(pq, (new_dist, v))\n\nreturn dist"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int[] dijkstra(List < List < int[] >> graph, int start) {\n    int n = graph.size();\n  int[] dist = new int[n];\n  Arrays.fill(dist, Integer.MAX_VALUE);\n  dist[start] = 0;\n\n  PriorityQueue < int[] > pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n  pq.offer(new int[]{ 0, start });\n\n  while (!pq.isEmpty()) {\n    int[] curr = pq.poll();\n        int d = curr[0], u = curr[1];\n\n    if (d > dist[u]) continue;\n\n    for (int[] edge : graph.get(u)) {\n            int v = edge[0], weight = edge[1];\n            int newDist = dist[u] + weight;\n      if (newDist < dist[v]) {\n        dist[v] = newDist;\n        pq.offer(new int[]{ newDist, v });\n      }\n    }\n  }\n\n  return dist;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector < int > dijkstra(vector<vector<pair<int, int>>> & graph, int start) {\n    int n = graph.size();\n  vector < int > dist(n, INT_MAX);\n  dist[start] = 0;\n\n  priority_queue < pair<int, int>, vector<pair<int, int>>, greater <>> pq;\n  pq.push({ 0, start });\n\n  while (!pq.empty()) {\n    auto[d, u] = pq.top();\n    pq.pop();\n\n    if (d > dist[u]) continue;\n\n    for (auto[v, weight] : graph[u]) {\n            int newDist = dist[u] + weight;\n      if (newDist < dist[v]) {\n        dist[v] = newDist;\n        pq.push({ newDist, v });\n      }\n    }\n  }\n\n  return dist;\n} "
          }
        ]
      }
    ],
    "overview": "Finds shortest paths from source to all vertices in weighted graph using greedy approach with priority queue.",
    "timeComplexity": "O((V+E) log V)",
    "spaceComplexity": "O(V)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=EaphyqKU4PQ",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/network-delay-time/",
          "title": "Network Delay Time"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/sum-of-even-numbers-after-queries/",
          "title": "Sum of Even Numbers After Queries"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/largest-submatrix-with-rearrangements/",
          "title": "Largest Submatrix With Rearrangements"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
          "title": "Cheapest Flights Within K Stops"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/network-delay-time/",
          "title": "Network Delay Time (duplicate)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/dungeon-game/",
          "title": "Dungeon Game"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/two-sum-less-than-k/",
          "title": "Two Sum Less Than K"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/path-with-minimum-effort/",
          "title": "Path With Minimum Effort"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies/",
          "title": "Sort Items by Groups Respecting Dependencies"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-watch/",
          "title": "Binary Watch"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/remove-duplicate-letters/",
          "title": "Remove Duplicate Letters"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "bellman-ford": {
    "id": "bellman-ford",
    "name": "Bellman-Ford",
    "title": "Bellman-Ford",
    "category": "Graphs",
    "explanation": {
      "problemStatement": "Shortest path with negative weights",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize distances: source = 0, others = infinity",
        "Relax all edges V-1 times",
        "For each edge (u,v,w): if dist[u] + w < dist[v], update dist[v]",
        "Run one more iteration to detect negative cycles",
        "If any distance updates, negative cycle exists"
      ],
      "useCase": "Graphs with negative weights, currency arbitrage, detecting negative cycles.",
      "tips": [
        "Handles negative edge weights",
        "Detects negative cycles",
        "O(VE) time complexity",
        "Slower than Dijkstra but more versatile"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function bellmanFord(n: number, edges: [number, number, number][], source: number): number[] | null {\n  const dist = Array(n).fill(Infinity);\n  dist[source] = 0;\n  \n  // Relax edges n-1 times\n  for (let i = 0; i < n - 1; i++) {\n    for (const [u, v, w] of edges) {\n      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n      }\n    }\n  }\n  \n  // Check for negative cycles\n  for (const [u, v, w] of edges) {\n    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {\n      return null; // Negative cycle detected\n    }\n  }\n  \n  return dist;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def bellman_ford(n, edges, source):\n    dist = [float('inf')] * n\n    dist[source] = 0\n    \n    # Relax edges n-1 times\n    for _ in range(n - 1):\n        for u, v, w in edges:\n            if dist[u] != float('inf') and dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    \n    # Check for negative cycles\n    for u, v, w in edges:\n        if dist[u] != float('inf') and dist[u] + w < dist[v]:\n            return None  # Negative cycle detected\n    \n    return dist"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int[] bellmanFord(int n, int[][] edges, int source) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[source] = 0;\n    \n    // Relax edges n-1 times\n    for (int i = 0; i < n - 1; i++) {\n        for (int[] edge : edges) {\n            int u = edge[0], v = edge[1], w = edge[2];\n            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n            }\n        }\n    }\n    \n    // Check for negative cycles\n    for (int[] edge : edges) {\n        int u = edge[0], v = edge[1], w = edge[2];\n        if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {\n            return null; // Negative cycle detected\n        }\n    }\n    \n    return dist;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector<int> bellmanFord(int n, vector<array<int,3>>& edges, int source) {\n    vector<int> dist(n, INT_MAX);\n    dist[source] = 0;\n    \n    // Relax edges n-1 times\n    for (int i = 0; i < n - 1; i++) {\n        for (auto& [u, v, w] : edges) {\n            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n            }\n        }\n    }\n    \n    // Check for negative cycles\n    for (auto& [u, v, w] : edges) {\n        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {\n            return {}; // Negative cycle detected\n        }\n    }\n    \n    return dist;\n}"
          }
        ]
      }
    ],
    "overview": "Bellman-Ford finds shortest paths from source to all vertices, handles negative weights, and detects negative cycles.",
    "timeComplexity": "O(VE)",
    "spaceComplexity": "O(V)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=5eIK3zUdYmE",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
          "title": "Cheapest Flights Within K Stops"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/binary-search-tree-iterator/",
          "title": "Binary Search Tree Iterator"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/network-delay-time/",
          "title": "Network Delay Time"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/sort-an-array/",
          "title": "Sort an Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/",
          "title": "Find the City With the Smallest Number of Neighbors at a Threshold Distance"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/paint-house-ii/",
          "title": "Paint House II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies/",
          "title": "Sort Items by Groups Respecting Dependencies"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-town-judge/",
          "title": "Find the Town Judge"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/isomorphic-strings/",
          "title": "Isomorphic Strings"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/queens-that-can-attack-the-king/",
          "title": "Queens That Can Attack the King"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "floyd-warshall": {
    "id": "floyd-warshall",
    "name": "Floyd-Warshall",
    "title": "Floyd-Warshall",
    "category": "Graphs",
    "explanation": {
      "problemStatement": "All-pairs shortest paths",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Initialize dist[i][j] = edge weight or infinity",
        "Set dist[i][i] = 0 for all i",
        "For each intermediate vertex k",
        "Try using k as intermediate: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])",
        "After k iterations, dist contains all shortest paths"
      ],
      "useCase": "All-pairs shortest paths, transitive closure, graph reachability.",
      "tips": [
        "O(V³) time and O(V²) space",
        "Works with negative edges (not negative cycles)",
        "Simple triple nested loop",
        "Can detect negative cycles"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function floydWarshall(n: number, edges: [number, number, number][]): number[][] {\n  const dist: number[][] = Array.from({length: n}, () => Array(n).fill(Infinity));\n  \n  // Initialize distances\n  for (let i = 0; i < n; i++) dist[i][i] = 0;\n  for (const [u, v, w] of edges) dist[u][v] = w;\n  \n  // Floyd-Warshall\n  for (let k = 0; k < n; k++) {\n    for (let i = 0; i < n; i++) {\n      for (let j = 0; j < n; j++) {\n        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {\n          dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);\n        }\n      }\n    }\n  }\n  \n  return dist;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def floyd_warshall(n, edges):\n    dist = [[float('inf')] * n for _ in range(n)]\n    \n    # Initialize distances\n    for i in range(n):\n        dist[i][i] = 0\n    for u, v, w in edges:\n        dist[u][v] = w\n    \n    # Floyd-Warshall\n    for k in range(n):\n        for i in range(n):\n            for j in range(n):\n                if dist[i][k] != float('inf') and dist[k][j] != float('inf'):\n                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])\n    \n    return dist"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int[][] floydWarshall(int n, int[][] edges) {\n    int[][] dist = new int[n][n];\n    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE / 2);\n    \n    // Initialize distances\n    for (int i = 0; i < n; i++) dist[i][i] = 0;\n    for (int[] edge : edges) {\n        dist[edge[0]][edge[1]] = edge[2];\n    }\n    \n    // Floyd-Warshall\n    for (int k = 0; k < n; k++) {\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);\n            }\n        }\n    }\n    \n    return dist;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector<vector<int>> floydWarshall(int n, vector<array<int,3>>& edges) {\n    vector<vector<int>> dist(n, vector<int>(n, INT_MAX / 2));\n    \n    // Initialize distances\n    for (int i = 0; i < n; i++) dist[i][i] = 0;\n    for (auto& [u, v, w] : edges) dist[u][v] = w;\n    \n    // Floyd-Warshall\n    for (int k = 0; k < n; k++) {\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);\n            }\n        }\n    }\n    \n    return dist;\n}"
          }
        ]
      }
    ],
    "overview": "Floyd-Warshall computes shortest paths between all pairs of vertices using dynamic programming.",
    "timeComplexity": "O(V³)",
    "spaceComplexity": "O(V²)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/critical-connections-in-a-network/",
          "title": "Critical Connections in a Network"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-height-trees/",
          "title": "Minimum Height Trees"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/fibonacci-number/",
          "title": "Fibonacci Number"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-town-judge/",
          "title": "Find the Town Judge"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "a-star": {
    "id": "a-star",
    "name": "A* Search",
    "title": "A* Search",
    "category": "Graphs",
    "explanation": {
      "problemStatement": "Heuristic pathfinding algorithm",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Use f(n) = g(n) + h(n) where g is cost so far, h is heuristic",
        "Start with source in open set",
        "Pop node with minimum f score",
        "If goal, reconstruct path",
        "Explore neighbors, update g and f scores"
      ],
      "useCase": "Pathfinding in games, GPS navigation, robotics, AI planning.",
      "tips": [
        "Heuristic must be admissible (never overestimate)",
        "Manhattan distance for grid, Euclidean for continuous",
        "Better than Dijkstra with good heuristic",
        "Optimal if heuristic is consistent"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function aStar(grid: number[][], start: [number, number], goal: [number, number]): [number, number][] {\n  const rows = grid.length, cols = grid[0].length;\n  const heuristic = (a: [number, number], b: [number, number]) => \n    Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);\n  \n  const openSet: [number, [number, number]][] = [[heuristic(start, goal), start]];\n  const cameFrom = new Map<string, [number, number]>();\n  const gScore = new Map<string, number>();\n  gScore.set(`${start[0]},${start[1]}`, 0);\n  \n  while (openSet.length) {\n    openSet.sort((a, b) => a[0] - b[0]);\n    const [, current] = openSet.shift()!;\n    const key = `${current[0]},${current[1]}`;\n    \n    if (current[0] === goal[0] && current[1] === goal[1]) {\n      const path: [number, number][] = [current];\n      let curr = current;\n      while (cameFrom.has(`${curr[0]},${curr[1]}`)) {\n        curr = cameFrom.get(`${curr[0]},${curr[1]}`)!;\n        path.unshift(curr);\n      }\n      return path;\n    }\n    \n    const dirs = [[0,1], [1,0], [0,-1], [-1,0]];\n    for (const [dx, dy] of dirs) {\n      const [nx, ny] = [current[0] + dx, current[1] + dy];\n      if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] === 1) continue;\n      \n      const neighborKey = `${nx},${ny}`;\n      const tentativeG = gScore.get(key)! + 1;\n      \n      if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)!) {\n        cameFrom.set(neighborKey, current);\n        gScore.set(neighborKey, tentativeG);\n        const fScore = tentativeG + heuristic([nx, ny], goal);\n        openSet.push([fScore, [nx, ny]]);\n      }\n    }\n  }\n  \n  return [];\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "import heapq\n\ndef a_star(grid, start, goal):\n    rows, cols = len(grid), len(grid[0])\n    heuristic = lambda a, b: abs(a[0] - b[0]) + abs(a[1] - b[1])\n    \n    open_set = [(heuristic(start, goal), start)]\n    came_from = {}\n    g_score = {start: 0}\n    \n    while open_set:\n        _, current = heapq.heappop(open_set)\n        \n        if current == goal:\n            path = [current]\n            while current in came_from:\n                current = came_from[current]\n                path.append(current)\n            return path[::-1]\n        \n        for dx, dy in [(0,1), (1,0), (0,-1), (-1,0)]:\n            nx, ny = current[0] + dx, current[1] + dy\n            if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] != 1:\n                neighbor = (nx, ny)\n                tentative_g = g_score[current] + 1\n                \n                if neighbor not in g_score or tentative_g < g_score[neighbor]:\n                    came_from[neighbor] = current\n                    g_score[neighbor] = tentative_g\n                    f_score = tentative_g + heuristic(neighbor, goal)\n                    heapq.heappush(open_set, (f_score, neighbor))\n    \n    return []"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List<int[]> aStar(int[][] grid, int[] start, int[] goal) {\n    int rows = grid.length, cols = grid[0].length;\n    PriorityQueue<Node> openSet = new PriorityQueue<>((a, b) -> a.f - b.f);\n    openSet.offer(new Node(start[0], start[1], 0, heuristic(start, goal)));\n    \n    Map<String, int[]> cameFrom = new HashMap<>();\n    Map<String, Integer> gScore = new HashMap<>();\n    gScore.put(start[0] + \",\" + start[1], 0);\n    \n    int[][] dirs = {{0,1}, {1,0}, {0,-1}, {-1,0}};\n    \n    while (!openSet.isEmpty()) {\n        Node current = openSet.poll();\n        if (current.x == goal[0] && current.y == goal[1]) {\n            return reconstructPath(cameFrom, current);\n        }\n        \n        for (int[] dir : dirs) {\n            int nx = current.x + dir[0], ny = current.y + dir[1];\n            if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] == 1) continue;\n            \n            String key = nx + \",\" + ny;\n            int tentativeG = gScore.get(current.x + \",\" + current.y) + 1;\n            \n            if (!gScore.containsKey(key) || tentativeG < gScore.get(key)) {\n                cameFrom.put(key, new int[]{current.x, current.y});\n                gScore.put(key, tentativeG);\n                int f = tentativeG + heuristic(new int[]{nx, ny}, goal);\n                openSet.offer(new Node(nx, ny, tentativeG, f));\n            }\n        }\n    }\n    \n    return new ArrayList<>();\n}\n\nprivate int heuristic(int[] a, int[] b) {\n    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector<pair<int,int>> aStar(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> goal) {\n    int rows = grid.size(), cols = grid[0].size();\n    auto heuristic = [](auto a, auto b) {\n        return abs(a.first - b.first) + abs(a.second - b.second);\n    };\n    \n    priority_queue<pair<int, pair<int,int>>, vector<pair<int, pair<int,int>>>, greater<>> openSet;\n    openSet.push({heuristic(start, goal), start});\n    \n    map<pair<int,int>, pair<int,int>> cameFrom;\n    map<pair<int,int>, int> gScore;\n    gScore[start] = 0;\n    \n    int dirs[][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};\n    \n    while (!openSet.empty()) {\n        auto [_, current] = openSet.top();\n        openSet.pop();\n        \n        if (current == goal) {\n            vector<pair<int,int>> path = {current};\n            while (cameFrom.count(current)) {\n                current = cameFrom[current];\n                path.insert(path.begin(), current);\n            }\n            return path;\n        }\n        \n        for (auto [dx, dy] : dirs) {\n            int nx = current.first + dx, ny = current.second + dy;\n            if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] == 1) continue;\n            \n            pair<int,int> neighbor = {nx, ny};\n            int tentativeG = gScore[current] + 1;\n            \n            if (!gScore.count(neighbor) || tentativeG < gScore[neighbor]) {\n                cameFrom[neighbor] = current;\n                gScore[neighbor] = tentativeG;\n                int fScore = tentativeG + heuristic(neighbor, goal);\n                openSet.push({fScore, neighbor});\n            }\n        }\n    }\n    \n    return {};\n}"
          }
        ]
      }
    ],
    "overview": "A* is an informed search algorithm using heuristics to find shortest path efficiently. Combines Dijkstra with heuristic guidance.",
    "timeComplexity": "O(b^d)",
    "spaceComplexity": "O(b^d)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/path-with-minimum-effort/",
          "title": "Path With Minimum Effort"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/the-maze-ii/",
          "title": "The Maze II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/the-maze/",
          "title": "The Maze"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "knapsack-01": {
    "id": "knapsack-01",
    "name": "0/1 Knapsack",
    "title": "0/1 Knapsack",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Maximize value with weight constraint",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Create DP table: dp[i][w] = max value with first i items and capacity w",
        "For each item and capacity combination",
        "If item fits: choose max of including or excluding it",
        "If doesn't fit: take value without this item",
        "Build solution bottom-up",
        "Return dp[n][capacity]"
      ],
      "useCase": "Resource allocation, subset selection with constraints, optimization problems.",
      "tips": [
        "O(nW) time where W is capacity",
        "Can optimize space to O(W)",
        "Foundation for many DP problems",
        "Can reconstruct which items to take"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function knapsack(weights: number[], values: number[], capacity: number): number {\n  const n = weights.length;\n  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));\n\n  for (let i = 1; i <= n; i++) {\n    for (let w = 0; w <= capacity; w++) {\n      if (weights[i - 1] <= w) {\n        dp[i][w] = Math.max(\n          values[i - 1] + dp[i - 1][w - weights[i - 1]],\n          dp[i - 1][w]\n        );\n      } else {\n        dp[i][w] = dp[i - 1][w];\n      }\n    }\n  }\n\n  return dp[n][capacity];\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def knapsack(weights: List[int], values: List[int], capacity: int) -> int:\nn = len(weights)\ndp = [[0] * (capacity + 1) for _ in range(n + 1)]\n\nfor i in range(1, n + 1):\n  for w in range(capacity + 1):\n    if weights[i - 1] <= w:\n      dp[i][w] = max(\n        values[i - 1] + dp[i - 1][w - weights[i - 1]],\n        dp[i - 1][w]\n      )\n    else:\n    dp[i][w] = dp[i - 1][w]\n\nreturn dp[n][capacity]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int knapsack(int[] weights, int[] values, int capacity) {\n    int n = weights.length;\n  int[][] dp = new int[n + 1][capacity + 1];\n\n  for (int i = 1; i <= n; i++) {\n    for (int w = 0; w <= capacity; w++) {\n      if (weights[i - 1] <= w) {\n        dp[i][w] = Math.max(\n          values[i - 1] + dp[i - 1][w - weights[i - 1]],\n          dp[i - 1][w]\n        );\n      } else {\n        dp[i][w] = dp[i - 1][w];\n      }\n    }\n  }\n\n  return dp[n][capacity];\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int knapsack(vector<int> & weights, vector<int> & values, int capacity) {\n    int n = weights.size();\n  vector < vector < int >> dp(n + 1, vector<int>(capacity + 1, 0));\n\n  for (int i = 1; i <= n; i++) {\n    for (int w = 0; w <= capacity; w++) {\n      if (weights[i - 1] <= w) {\n        dp[i][w] = max(\n          values[i - 1] + dp[i - 1][w - weights[i - 1]],\n          dp[i - 1][w]\n        );\n      } else {\n        dp[i][w] = dp[i - 1][w];\n      }\n    }\n  }\n\n  return dp[n][capacity];\n} "
          }
        ]
      }
    ],
    "overview": "Classic DP problem: maximize value of items in knapsack without exceeding weight capacity. Each item used once.",
    "timeComplexity": "O(nW)",
    "spaceComplexity": "O(nW)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/climbing-stairs/",
          "title": "Climbing Stairs"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/house-robber/",
          "title": "House Robber"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/partition-equal-subset-sum/",
          "title": "Partition Equal Subset Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/target-sum/",
          "title": "Target Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/ones-and-zeroes/",
          "title": "Ones and Zeroes"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/perfect-squares/",
          "title": "Perfect Squares"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/last-stone-weight-ii/",
          "title": "Last Stone Weight II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/profitable-schemes/",
          "title": "Profitable Schemes"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/power-of-two/",
          "title": "Power of Two (helper DP practice)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/coin-change/",
          "title": "Coin Change"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/coin-change-2/",
          "title": "Coin Change 2"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-iv/",
          "title": "Combination Sum IV"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/longest-string-chain/",
          "title": "Longest String Chain"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "coin-change": {
    "id": "coin-change",
    "name": "Coin Change",
    "title": "Coin Change",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Minimum coins for target amount",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Create DP array of size amount + 1",
        "Initialize dp[0] = 0, others = infinity",
        "For each amount from 1 to target",
        "Try each coin denomination",
        "Update minimum coins needed",
        "Return dp[amount] or -1 if impossible"
      ],
      "useCase": "Making change, resource optimization, unbounded knapsack variant.",
      "tips": [
        "O(amount * coins) time",
        "O(amount) space",
        "Bottom-up DP",
        "Can track which coins used"
      ]
    },
    "companyTags": [
      "Amazon",
      "Bloomberg"
    ],
    "difficulty": "intermediate",
    "listType": "core+Blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function coinChange(coins: number[], amount: number): number {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i >= coin) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n\n  return dp[amount] === Infinity ? -1 : dp[amount];\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def coin_change(coins: List[int], amount: int) -> int:\ndp = [float('inf')] * (amount + 1)\ndp[0] = 0\n\nfor i in range(1, amount + 1):\n  for coin in coins:\n    if i >= coin:\n      dp[i] = min(dp[i], dp[i - coin] + 1)\n\nreturn dp[amount] if dp[amount] != float('inf') else -1"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int coinChange(int[] coins, int amount) {\n  int[] dp = new int[amount + 1];\n  Arrays.fill(dp, Integer.MAX_VALUE);\n  dp[0] = 0;\n\n  for (int i = 1; i <= amount; i++) {\n    for (int coin : coins) {\n      if (i >= coin && dp[i - coin] != Integer.MAX_VALUE) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n\n  return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int coinChange(vector<int> & coins, int amount) {\n  vector < int > dp(amount + 1, INT_MAX);\n  dp[0] = 0;\n\n  for (int i = 1; i <= amount; i++) {\n    for (int coin : coins) {\n      if (i >= coin && dp[i - coin] != INT_MAX) {\n        dp[i] = min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n\n  return dp[amount] == INT_MAX ? -1 : dp[amount];\n} "
          }
        ]
      }
    ],
    "overview": "Find minimum number of coins needed to make amount using dynamic programming.",
    "timeComplexity": "O(nW)",
    "spaceComplexity": "O(W)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=H9bfqozjoqs",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/coin-change/",
          "title": "Coin Change"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/coin-change-2/",
          "title": "Coin Change 2"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-iv/",
          "title": "Combination Sum IV"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/copy-list-with-random-pointer/",
          "title": "Copy List with Random Pointer (helper non-DP easy)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/word-break/",
          "title": "Word Break"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/word-break-ii/",
          "title": "Word Break II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/climbing-stairs/",
          "title": "Climbing Stairs"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/min-cost-climbing-stairs/",
          "title": "Min Cost Climbing Stairs"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/perfect-squares/",
          "title": "Perfect Squares"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/dungeon-game/",
          "title": "Dungeon Game"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "lcs": {
    "id": "lcs",
    "name": "Longest Common Subsequence",
    "title": "Longest Common Subsequence",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Find longest common subsequence",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Create (m+1) x (n+1) DP table",
        "If characters match: dp[i][j] = dp[i-1][j-1] + 1",
        "If don't match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
        "Build solution bottom-up",
        "Return dp[m][n]",
        "Can reconstruct actual subsequence"
      ],
      "useCase": "Diff tools, DNA sequence alignment, version control, text comparison.",
      "tips": [
        "O(mn) time and space",
        "Can optimize space to O(min(m,n))",
        "Classic 2D DP",
        "Similar to edit distance"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function longestCommonSubsequence(text1: string, text2: string): number {\n  const m = text1.length, n = text2.length;\n  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1] + 1;\n      } else {\n        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n      }\n    }\n  }\n\n  return dp[m][n];\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def longest_common_subsequence(text1: str, text2: str) -> int:\nm, n = len(text1), len(text2)\ndp = [[0] * (n + 1) for _ in range(m + 1)]\n\nfor i in range(1, m + 1):\n  for j in range(1, n + 1):\n    if text1[i - 1] == text2[j - 1]:\n      dp[i][j] = dp[i - 1][j - 1] + 1\n    else:\n    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n\nreturn dp[m][n]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int longestCommonSubsequence(String text1, String text2) {\n    int m = text1.length(), n = text2.length();\n  int[][] dp = new int[m + 1][n + 1];\n\n  for (int i = 1; i <= m; i++) {\n    for (int j = 1; j <= n; j++) {\n      if (text1.charAt(i - 1) == text2.charAt(j - 1)) {\n        dp[i][j] = dp[i - 1][j - 1] + 1;\n      } else {\n        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n      }\n    }\n  }\n\n  return dp[m][n];\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int longestCommonSubsequence(string text1, string text2) {\n    int m = text1.length(), n = text2.length();\n  vector < vector < int >> dp(m + 1, vector<int>(n + 1, 0));\n\n  for (int i = 1; i <= m; i++) {\n    for (int j = 1; j <= n; j++) {\n      if (text1[i - 1] == text2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1] + 1;\n      } else {\n        dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);\n      }\n    }\n  }\n\n  return dp[m][n];\n} "
          }
        ]
      }
    ],
    "overview": "Find length of longest subsequence common to both strings using 2D DP.",
    "timeComplexity": "O(mn)",
    "spaceComplexity": "O(mn)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=Ua0GhsJSlWM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-common-subsequence/",
          "title": "Longest Common Subsequence"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/interleaving-string/",
          "title": "Interleaving String"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/edit-distance/",
          "title": "Edit Distance"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/shortest-common-supersequence/",
          "title": "Shortest Common Supersequence (related concept)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/delete-operation-for-two-strings/",
          "title": "Delete Operation for Two Strings"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/",
          "title": "Minimum ASCII Delete Sum for Two Strings"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/interleaving-string/",
          "title": "Interleaving String (duplicate)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/is-subsequence/",
          "title": "Is Subsequence"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-length-of-repeated-subarray/",
          "title": "Maximum Length of Repeated Subarray"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/distinct-subsequences/",
          "title": "Distinct Subsequences"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "lis": {
    "id": "lis",
    "name": "Longest Increasing Subsequence",
    "title": "Longest Increasing Subsequence",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Find LIS in array",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Maintain array of smallest tail elements",
        "For each number, binary search for position",
        "If larger than all, append",
        "Otherwise, replace element at found position",
        "Length of tails array is LIS length",
        "Patience sorting algorithm"
      ],
      "useCase": "Sequence analysis, stock trading, scheduling problems.",
      "tips": [
        "O(n log n) optimal time",
        "Binary search optimization",
        "Tails array not actual LIS",
        "Can reconstruct actual sequence with extra work"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function lengthOfLIS(nums: number[]): number {\n  const tails: number[] = [];\n\n  for (const num of nums) {\n    let left = 0, right = tails.length;\n\n    while (left < right) {\n      const mid = Math.floor((left + right) / 2);\n      if (tails[mid] < num) {\n        left = mid + 1;\n      } else {\n        right = mid;\n      }\n    }\n\n    if (left === tails.length) {\n      tails.push(num);\n    } else {\n      tails[left] = num;\n    }\n  }\n\n  return tails.length;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def length_of_lis(nums: List[int]) -> int:\ntails = []\n\nfor num in nums:\n  left, right = 0, len(tails)\n\nwhile left < right:\n  mid = (left + right) // 2\nif tails[mid] < num:\n  left = mid + 1\nelse:\nright = mid\n\nif left == len(tails):\n  tails.append(num)\nelse:\ntails[left] = num\n\nreturn len(tails)"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int lengthOfLIS(int[] nums) {\n  List < Integer > tails = new ArrayList<>();\n\n  for (int num : nums) {\n        int left = 0, right = tails.size();\n\n    while (left < right) {\n            int mid = (left + right) / 2;\n      if (tails.get(mid) < num) {\n        left = mid + 1;\n      } else {\n        right = mid;\n      }\n    }\n\n    if (left == tails.size()) {\n      tails.add(num);\n    } else {\n      tails.set(left, num);\n    }\n  }\n\n  return tails.size();\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int lengthOfLIS(vector<int> & nums) {\n  vector < int > tails;\n\n  for (int num : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), num);\n\n    if (it == tails.end()) {\n      tails.push_back(num);\n    } else {\n            * it = num;\n    }\n  }\n\n  return tails.size();\n} "
          }
        ]
      }
    ],
    "overview": "Find length of longest increasing subsequence using binary search approach for O(n log n) time.",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=cjWnW0hdF1Y",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-increasing-subsequence/",
          "title": "Longest Increasing Subsequence"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",
          "title": "Number of Longest Increasing Subsequence"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/russian-doll-envelopes/",
          "title": "Russian Doll Envelopes"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/count-of-range-sum/",
          "title": "Count of Range Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/largest-divisible-subset/",
          "title": "Largest Divisible Subset"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-length-of-pair-chain/",
          "title": "Maximum Length of Pair Chain"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/maximum-subarray/",
          "title": "Maximum Subarray"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "edit-distance": {
    "id": "edit-distance",
    "name": "Edit Distance",
    "title": "Edit Distance",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Minimum edits to transform strings",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Create (m+1) x (n+1) DP table",
        "Initialize base cases (empty string conversions)",
        "If characters match: copy diagonal value",
        "If differ: 1 + min(insert, delete, replace)",
        "Build bottom-up",
        "Return dp[m][n]"
      ],
      "useCase": "Spell checkers, DNA analysis, plagiarism detection, fuzzy matching.",
      "tips": [
        "O(mn) time and space",
        "Also called Levenshtein distance",
        "Can optimize space to O(min(m,n))",
        "Three operations: insert, delete, replace"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function minDistance(word1: string, word2: string): number {\n  const m = word1.length, n = word2.length;\n  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));\n\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1];\n      } else {\n        dp[i][j] = Math.min(\n          dp[i - 1][j],     // delete\n          dp[i][j - 1],     // insert\n          dp[i - 1][j - 1]  // replace\n        ) + 1;\n      }\n    }\n  }\n\n  return dp[m][n];\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def min_distance(word1: str, word2: str) -> int:\nm, n = len(word1), len(word2)\ndp = [[0] * (n + 1) for _ in range(m + 1)]\n\nfor i in range(m + 1):\n  dp[i][0] = i\nfor j in range(n + 1):\n  dp[0][j] = j\n\nfor i in range(1, m + 1):\n  for j in range(1, n + 1):\n    if word1[i - 1] == word2[j - 1]:\n      dp[i][j] = dp[i - 1][j - 1]\n    else:\n    dp[i][j] = min(\n      dp[i - 1][j],      # delete\n    dp[i][j - 1],      # insert\n                    dp[i - 1][j - 1]   # replace\n    ) + 1\n\nreturn dp[m][n]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int minDistance(String word1, String word2) {\n    int m = word1.length(), n = word2.length();\n  int[][] dp = new int[m + 1][n + 1];\n\n  for (int i = 0; i <= m; i++) dp[i][0] = i;\n  for (int j = 0; j <= n; j++) dp[0][j] = j;\n\n  for (int i = 1; i <= m; i++) {\n    for (int j = 1; j <= n; j++) {\n      if (word1.charAt(i - 1) == word2.charAt(j - 1)) {\n        dp[i][j] = dp[i - 1][j - 1];\n      } else {\n        dp[i][j] = Math.min(Math.min(\n          dp[i - 1][j],\n          dp[i][j - 1]),\n          dp[i - 1][j - 1]\n        ) + 1;\n      }\n    }\n  }\n\n  return dp[m][n];\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int minDistance(string word1, string word2) {\n    int m = word1.length(), n = word2.length();\n  vector < vector < int >> dp(m + 1, vector<int>(n + 1));\n\n  for (int i = 0; i <= m; i++) dp[i][0] = i;\n  for (int j = 0; j <= n; j++) dp[0][j] = j;\n\n  for (int i = 1; i <= m; i++) {\n    for (int j = 1; j <= n; j++) {\n      if (word1[i - 1] == word2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1];\n      } else {\n        dp[i][j] = min({\n          dp[i - 1][j],\n          dp[i][j - 1],\n          dp[i - 1][j - 1]\n        }) + 1;\n      }\n    }\n  }\n\n  return dp[m][n];\n} "
          }
        ]
      }
    ],
    "overview": "Levenshtein distance: minimum edits (insert, delete, replace) to transform one string to another.",
    "timeComplexity": "O(mn)",
    "spaceComplexity": "O(mn)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=XYi2-LPrwm4",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/edit-distance/",
          "title": "Edit Distance"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/delete-operation-for-two-strings/",
          "title": "Delete Operation for Two Strings"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/",
          "title": "Minimum ASCII Delete Sum for Two Strings"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/distinct-subsequences/",
          "title": "Distinct Subsequences"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-common-subsequence/",
          "title": "Longest Common Subsequence"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/edit-distance/",
          "title": "Edit Distance (duplicate)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/is-subsequence/",
          "title": "Is Subsequence"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/edit-distance/",
          "title": "Edit Distance (third)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
          "title": "Evaluate Reverse Polish Notation"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/max-value-of-equation/",
          "title": "Max Value of Equation"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [
      {
        "name": "word1",
        "type": "string",
        "label": "Word 1"
      },
      {
        "name": "word2",
        "type": "string",
        "label": "Word 2"
      }
    ],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "matrix-path-dp": {
    "id": "matrix-path-dp",
    "name": "Matrix Path DP",
    "title": "Matrix Path DP",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Find unique or minimum paths in matrix",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Create DP table same size as matrix",
        "Initialize base cases (first row/column)",
        "For each cell, compute based on where you can come from",
        "dp[i][j] = operation(dp[i-1][j], dp[i][j-1])",
        "Answer is at dp[m-1][n-1]"
      ],
      "useCase": "Grid path problems, robot movement, minimum cost paths, counting paths.",
      "tips": [
        "Can optimize space to O(n)",
        "Base cases are crucial",
        "Direction constraints affect recurrence",
        "Works for obstacles too"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function uniquePaths(m: number, n: number): number {\n  const dp: number[][] = Array.from({length: m}, () => Array(n).fill(0));\n  \n  // Base case: first row and column\n  for (let i = 0; i < m; i++) dp[i][0] = 1;\n  for (let j = 0; j < n; j++) dp[0][j] = 1;\n  \n  // Fill DP table\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[i][j] = dp[i-1][j] + dp[i][j-1];\n    }\n  }\n  \n  return dp[m-1][n-1];\n}\n\nfunction minPathSum(grid: number[][]): number {\n  const m = grid.length, n = grid[0].length;\n  const dp: number[][] = Array.from({length: m}, () => Array(n).fill(0));\n  \n  dp[0][0] = grid[0][0];\n  for (let i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];\n  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];\n  \n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1]);\n    }\n  }\n  \n  return dp[m-1][n-1];\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def unique_paths(m, n):\n    dp = [[0] * n for _ in range(m)]\n    \n    for i in range(m):\n        dp[i][0] = 1\n    for j in range(n):\n        dp[0][j] = 1\n    \n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = dp[i-1][j] + dp[i][j-1]\n    \n    return dp[m-1][n-1]\n\ndef min_path_sum(grid):\n    m, n = len(grid), len(grid[0])\n    dp = [[0] * n for _ in range(m)]\n    \n    dp[0][0] = grid[0][0]\n    for i in range(1, m):\n        dp[i][0] = dp[i-1][0] + grid[i][0]\n    for j in range(1, n):\n        dp[0][j] = dp[0][j-1] + grid[0][j]\n    \n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])\n    \n    return dp[m-1][n-1]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int uniquePaths(int m, int n) {\n    int[][] dp = new int[m][n];\n    \n    for (int i = 0; i < m; i++) dp[i][0] = 1;\n    for (int j = 0; j < n; j++) dp[0][j] = 1;\n    \n    for (int i = 1; i < m; i++) {\n        for (int j = 1; j < n; j++) {\n            dp[i][j] = dp[i-1][j] + dp[i][j-1];\n        }\n    }\n    \n    return dp[m-1][n-1];\n}\n\npublic int minPathSum(int[][] grid) {\n    int m = grid.length, n = grid[0].length;\n    int[][] dp = new int[m][n];\n    \n    dp[0][0] = grid[0][0];\n    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];\n    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];\n    \n    for (int i = 1; i < m; i++) {\n        for (int j = 1; j < n; j++) {\n            dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1]);\n        }\n    }\n    \n    return dp[m-1][n-1];\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int uniquePaths(int m, int n) {\n    vector<vector<int>> dp(m, vector<int>(n, 0));\n    \n    for (int i = 0; i < m; i++) dp[i][0] = 1;\n    for (int j = 0; j < n; j++) dp[0][j] = 1;\n    \n    for (int i = 1; i < m; i++) {\n        for (int j = 1; j < n; j++) {\n            dp[i][j] = dp[i-1][j] + dp[i][j-1];\n        }\n    }\n    \n    return dp[m-1][n-1];\n}\n\nint minPathSum(vector<vector<int>>& grid) {\n    int m = grid.size(), n = grid[0].size();\n    vector<vector<int>> dp(m, vector<int>(n));\n    \n    dp[0][0] = grid[0][0];\n    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];\n    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];\n    \n    for (int i = 1; i < m; i++) {\n        for (int j = 1; j < n; j++) {\n            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]);\n        }\n    }\n    \n    return dp[m-1][n-1];\n}"
          }
        ]
      }
    ],
    "overview": "Use dynamic programming to count unique paths or find minimum/maximum path sum in a matrix with movement constraints.",
    "timeComplexity": "O(mn)",
    "spaceComplexity": "O(mn)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=IlEsdxuD4lY",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/unique-paths/",
          "title": "Unique Paths"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/unique-paths-ii/",
          "title": "Unique Paths II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-path-sum/",
          "title": "Minimum Path Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/triangle/",
          "title": "Triangle"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
          "title": "Longest Increasing Path in a Matrix"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/longest-uncommon-subsequence-i/",
          "title": "Longest Uncommon Subsequence I"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-falling-path-sum/",
          "title": "Minimum Falling Path Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-path-sum/",
          "title": "Minimum Path Sum (duplicate)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/unique-paths-iii/",
          "title": "Unique Paths III"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/bomb-enemy/",
          "title": "Bomb Enemy"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximal-square/",
          "title": "Maximal Square"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-path-sum/",
          "title": "Minimum Path Sum (third)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "partition-equal-subset": {
    "id": "partition-equal-subset",
    "name": "Partition Equal Subset",
    "title": "Partition Equal Subset",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Check if array can be partitioned equally",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Calculate total sum, if odd return false",
        "Target is sum/2",
        "Use DP array: dp[i] = can we make sum i",
        "For each number, update dp in reverse order",
        "dp[j] = dp[j] OR dp[j - num]"
      ],
      "useCase": "Subset sum problems, fair division, resource allocation.",
      "tips": [
        "Early exit if sum is odd",
        "Space optimized to O(sum)",
        "Reverse iteration prevents reuse",
        "Similar to 0/1 knapsack"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function canPartition(nums: number[]): boolean {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if (total % 2 !== 0) return false;\n  \n  const target = total / 2;\n  const dp: boolean[] = Array(target + 1).fill(false);\n  dp[0] = true;\n  \n  for (const num of nums) {\n    for (let j = target; j >= num; j--) {\n      dp[j] = dp[j] || dp[j - num];\n    }\n  }\n  \n  return dp[target];\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def can_partition(nums):\n    total = sum(nums)\n    if total % 2 != 0:\n        return False\n    \n    target = total // 2\n    dp = [False] * (target + 1)\n    dp[0] = True\n    \n    for num in nums:\n        for j in range(target, num - 1, -1):\n            dp[j] = dp[j] or dp[j - num]\n    \n    return dp[target]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public boolean canPartition(int[] nums) {\n    int total = 0;\n    for (int num : nums) total += num;\n    if (total % 2 != 0) return false;\n    \n    int target = total / 2;\n    boolean[] dp = new boolean[target + 1];\n    dp[0] = true;\n    \n    for (int num : nums) {\n        for (int j = target; j >= num; j--) {\n            dp[j] = dp[j] || dp[j - num];\n        }\n    }\n    \n    return dp[target];\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "bool canPartition(vector<int>& nums) {\n    int total = accumulate(nums.begin(), nums.end(), 0);\n    if (total % 2 != 0) return false;\n    \n    int target = total / 2;\n    vector<bool> dp(target + 1, false);\n    dp[0] = true;\n    \n    for (int num : nums) {\n        for (int j = target; j >= num; j--) {\n            dp[j] = dp[j] || dp[j - num];\n        }\n    }\n    \n    return dp[target];\n}"
          }
        ]
      }
    ],
    "overview": "Determine if an array can be partitioned into two subsets with equal sum. This is a variant of the 0/1 knapsack problem.",
    "timeComplexity": "O(n*sum)",
    "spaceComplexity": "O(sum)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=IsvocB5BJhw",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/partition-equal-subset-sum/",
          "title": "Partition Equal Subset Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/target-sum/",
          "title": "Target Sum"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/house-robber/",
          "title": "House Robber"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/ones-and-zeroes/",
          "title": "Ones and Zeroes"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/last-stone-weight-ii/",
          "title": "Last Stone Weight II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/coin-change-2/",
          "title": "Coin Change 2"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/",
          "title": "Minimum ASCII Delete Sum for Two Strings"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-iv/",
          "title": "Combination Sum IV"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "house-robber": {
    "id": "house-robber",
    "name": "House Robber",
    "title": "House Robber",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Maximum sum without adjacent elements",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "For each house, decide: rob it or skip it",
        "If rob: take value + max from 2 houses back",
        "If skip: take max from previous house",
        "Use two variables to track previous states",
        "Space optimized from O(n) to O(1)",
        "Return final maximum"
      ],
      "useCase": "Non-adjacent selection, scheduling with constraints, optimization.",
      "tips": [
        "O(n) time, O(1) space",
        "Space-optimized DP",
        "Only need last two states",
        "Can extend to circular array"
      ]
    },
    "companyTags": [
      "Amazon",
      "LinkedIn"
    ],
    "difficulty": "intermediate",
    "listType": "core+Blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function rob(nums: number[]): number {\n  if (nums.length === 0) return 0;\n  if (nums.length === 1) return nums[0];\n\n  let prev2 = 0;\n  let prev1 = 0;\n\n  for (const num of nums) {\n    const temp = prev1;\n    prev1 = Math.max(prev1, prev2 + num);\n    prev2 = temp;\n  }\n\n  return prev1;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def rob(nums: List[int]) -> int:\nif not nums:\n  return 0\nif len(nums) == 1:\n  return nums[0]\n\nprev2, prev1 = 0, 0\n\nfor num in nums:\n  prev2, prev1 = prev1, max(prev1, prev2 + num)\n\nreturn prev1"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int rob(int[] nums) {\n  if (nums.length == 0) return 0;\n  if (nums.length == 1) return nums[0];\n    \n    int prev2 = 0, prev1 = 0;\n\n  for (int num : nums) {\n        int temp = prev1;\n    prev1 = Math.max(prev1, prev2 + num);\n    prev2 = temp;\n  }\n\n  return prev1;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int rob(vector<int> & nums) {\n  if (nums.empty()) return 0;\n  if (nums.size() == 1) return nums[0];\n    \n    int prev2 = 0, prev1 = 0;\n\n  for (int num : nums) {\n        int temp = prev1;\n    prev1 = max(prev1, prev2 + num);\n    prev2 = temp;\n  }\n\n  return prev1;\n} "
          }
        ]
      }
    ],
    "overview": "Maximum sum without taking adjacent elements using DP with O(1) space optimization.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=73r3KWiEvyk",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/house-robber/",
          "title": "House Robber"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/house-robber-ii/",
          "title": "House Robber II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/house-robber-iii/",
          "title": "House Robber III"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/delete-and-earn/",
          "title": "Delete and Earn"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/paint-house/",
          "title": "Paint House"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/paint-house-ii/",
          "title": "Paint House II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-increasing-subsequence/",
          "title": "Longest Increasing Subsequence (related)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [
      {
        "name": "nums",
        "type": "number[]",
        "label": "House Values"
      }
    ],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "climbing-stairs": {
    "id": "climbing-stairs",
    "name": "Climbing Stairs",
    "title": "Climbing Stairs",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Count ways to climb n stairs",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Base cases: 1 way for 1 stair, 2 ways for 2 stairs",
        "For each stair: ways = ways[i-1] + ways[i-2]",
        "Can reach from 1 step back or 2 steps back",
        "Use two variables (space optimization)",
        "Fibonacci pattern",
        "Return final count"
      ],
      "useCase": "Counting problems, path counting, Fibonacci applications.",
      "tips": [
        "O(n) time, O(1) space",
        "Fibonacci sequence in disguise",
        "Can extend to k steps",
        "Simple intro to DP"
      ]
    },
    "companyTags": [
      "Amazon",
      "Google",
      "Adobe"
    ],
    "difficulty": "easy",
    "listType": "core+Blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function climbStairs(n: number): number {\n  if (n <= 2) return n;\n\n  let prev2 = 1;\n  let prev1 = 2;\n\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n\n  return prev1;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def climb_stairs(n: int) -> int:\nif n <= 2:\n  return n\n\nprev2, prev1 = 1, 2\n\nfor i in range(3, n + 1):\n  prev2, prev1 = prev1, prev1 + prev2\n\nreturn prev1"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int climbStairs(int n) {\n  if (n <= 2) return n;\n    \n    int prev2 = 1, prev1 = 2;\n\n  for (int i = 3; i <= n; i++) {\n        int curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n\n  return prev1;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int climbStairs(int n) {\n  if (n <= 2) return n;\n    \n    int prev2 = 1, prev1 = 2;\n\n  for (int i = 3; i <= n; i++) {\n        int curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n\n  return prev1;\n} "
          }
        ]
      }
    ],
    "overview": "Count ways to climb n stairs (1 or 2 steps at a time) - basically Fibonacci sequence.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=Y0lT9Fck7qI",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/climbing-stairs/",
          "title": "Climbing Stairs"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/min-cost-climbing-stairs/",
          "title": "Min Cost Climbing Stairs"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/fibonacci-number/",
          "title": "Fibonacci Number"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/climbing-stairs/",
          "title": "Climbing Stairs (variant)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-increasing-subsequence/",
          "title": "Longest Increasing Subsequence"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/house-robber/",
          "title": "House Robber (related)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [
      {
        "name": "n",
        "type": "number",
        "label": "Number of Stairs"
      }
    ],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "word-break": {
    "id": "word-break",
    "name": "Word Break",
    "title": "Word Break",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Segment string into dictionary words",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "dp[i] = can we break s[0..i-1]",
        "dp[0] = true (empty string)",
        "For each position i, check all j < i",
        "If dp[j] is true and s[j..i-1] is in dict, dp[i] = true",
        "Return dp[n]"
      ],
      "useCase": "Text segmentation, natural language processing, spell checking.",
      "tips": [
        "Use set for O(1) lookup",
        "Break early when found",
        "Can be optimized with trie",
        "DFS with memoization also works"
      ]
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Google"
    ],
    "difficulty": "intermediate",
    "listType": "core+Blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function wordBreak(s: string, wordDict: string[]): boolean {\n  const wordSet = new Set(wordDict);\n  const dp: boolean[] = Array(s.length + 1).fill(false);\n  dp[0] = true;\n  \n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (dp[j] && wordSet.has(s.substring(j, i))) {\n        dp[i] = true;\n        break;\n      }\n    }\n  }\n  \n  return dp[s.length];\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def word_break(s, word_dict):\n    word_set = set(word_dict)\n    dp = [False] * (len(s) + 1)\n    dp[0] = True\n    \n    for i in range(1, len(s) + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in word_set:\n                dp[i] = True\n                break\n    \n    return dp[len(s)]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public boolean wordBreak(String s, List<String> wordDict) {\n    Set<String> wordSet = new HashSet<>(wordDict);\n    boolean[] dp = new boolean[s.length() + 1];\n    dp[0] = true;\n    \n    for (int i = 1; i <= s.length(); i++) {\n        for (int j = 0; j < i; j++) {\n            if (dp[j] && wordSet.contains(s.substring(j, i))) {\n                dp[i] = true;\n                break;\n            }\n        }\n    }\n    \n    return dp[s.length()];\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "bool wordBreak(string s, vector<string>& wordDict) {\n    unordered_set<string> wordSet(wordDict.begin(), wordDict.end());\n    vector<bool> dp(s.length() + 1, false);\n    dp[0] = true;\n    \n    for (int i = 1; i <= s.length(); i++) {\n        for (int j = 0; j < i; j++) {\n            if (dp[j] && wordSet.count(s.substr(j, i - j))) {\n                dp[i] = true;\n                break;\n            }\n        }\n    }\n    \n    return dp[s.length()];\n}"
          }
        ]
      }
    ],
    "overview": "Determine if a string can be segmented into words from a dictionary using dynamic programming.",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=Sx9NNgInc3A",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/word-break/",
          "title": "Word Break"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/word-break-ii/",
          "title": "Word Break II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/concatenated-words/",
          "title": "Concatenated Words"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/replace-words/",
          "title": "Replace Words"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/flatten-nested-list-iterator/",
          "title": "Flatten Nested List Iterator"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/edit-distance/",
          "title": "Edit Distance (related)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "activity-selection": {
    "id": "activity-selection",
    "name": "Activity Selection",
    "title": "Activity Selection",
    "category": "Greedy",
    "explanation": {
      "problemStatement": "Select maximum non-overlapping activities",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Sort activities by finish time",
        "Pick first activity",
        "For each activity, if start >= last finish, pick it",
        "Update last finish time",
        "Count selected activities"
      ],
      "useCase": "Scheduling meetings, resource allocation, interval selection.",
      "tips": [
        "Sort by finish time, not start",
        "Greedy choice property",
        "O(n log n) due to sorting",
        "Proves optimal substructure"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function activitySelection(start: number[], finish: number[]): number {\n  const n = start.length;\n  const activities: [number, number][] = start.map((s, i) => [s, finish[i]]);\n  activities.sort((a, b) => a[1] - b[1]);\n  \n  let count = 1;\n  let lastFinish = activities[0][1];\n  \n  for (let i = 1; i < n; i++) {\n    if (activities[i][0] >= lastFinish) {\n      count++;\n      lastFinish = activities[i][1];\n    }\n  }\n  \n  return count;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def activity_selection(start, finish):\n    activities = sorted(zip(start, finish), key=lambda x: x[1])\n    \n    count = 1\n    last_finish = activities[0][1]\n    \n    for s, f in activities[1:]:\n        if s >= last_finish:\n            count += 1\n            last_finish = f\n    \n    return count"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int activitySelection(int[] start, int[] finish) {\n    int n = start.length;\n    int[][] activities = new int[n][2];\n    for (int i = 0; i < n; i++) {\n        activities[i] = new int[]{start[i], finish[i]};\n    }\n    Arrays.sort(activities, (a, b) -> a[1] - b[1]);\n    \n    int count = 1;\n    int lastFinish = activities[0][1];\n    \n    for (int i = 1; i < n; i++) {\n        if (activities[i][0] >= lastFinish) {\n            count++;\n            lastFinish = activities[i][1];\n        }\n    }\n    \n    return count;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int activitySelection(vector<int>& start, vector<int>& finish) {\n    int n = start.size();\n    vector<pair<int,int>> activities;\n    for (int i = 0; i < n; i++) {\n        activities.push_back({finish[i], start[i]});\n    }\n    sort(activities.begin(), activities.end());\n    \n    int count = 1;\n    int lastFinish = activities[0].first;\n    \n    for (int i = 1; i < n; i++) {\n        if (activities[i].second >= lastFinish) {\n            count++;\n            lastFinish = activities[i].first;\n        }\n    }\n    \n    return count;\n}"
          }
        ]
      }
    ],
    "overview": "Select maximum number of non-overlapping activities. Greedy approach: always pick activity that finishes earliest.",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=nONCGxWoUfM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/meeting-rooms/",
          "title": "Meeting Rooms"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/assign-cookies/",
          "title": "Assign Cookies"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/non-overlapping-intervals/",
          "title": "Non-overlapping Intervals"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
          "title": "Minimum Number of Arrows to Burst Balloons"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/",
          "title": "Maximum Number of Events That Can Be Attended"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/meeting-rooms-ii/",
          "title": "Meeting Rooms II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/maximum-product-of-three-numbers/",
          "title": "Maximum Product of Three Numbers"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/k-diff-pairs-in-an-array/",
          "title": "K-diff Pairs in an Array"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/course-schedule-iii/",
          "title": "Course Schedule III"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/",
          "title": "Find Subarray With Given XOR (related greedy/interval practice)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/video-stitching/",
          "title": "Video Stitching"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/construct-target-array-with-multiple-sums/",
          "title": "Construct Target Array With Multiple Sums (hard greediness practice)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "interval-scheduling": {
    "id": "interval-scheduling",
    "name": "Interval Scheduling",
    "title": "Interval Scheduling",
    "category": "Greedy",
    "explanation": {
      "problemStatement": "Schedule intervals optimally",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Sort intervals by end time",
        "Select first interval",
        "Iterate through remaining intervals",
        "If interval starts after last selected ends, add it",
        "Update last end time"
      ],
      "useCase": "Meeting scheduling, resource booking, event planning.",
      "tips": [
        "Same as activity selection",
        "Greedy choice is optimal",
        "Sort by end time crucial",
        "O(n log n) complexity"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function intervalScheduling(intervals: [number, number][]): [number, number][] {\n  intervals.sort((a, b) => a[1] - b[1]);\n  \n  const selected: [number, number][] = [intervals[0]];\n  let lastEnd = intervals[0][1];\n  \n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] >= lastEnd) {\n      selected.push(intervals[i]);\n      lastEnd = intervals[i][1];\n    }\n  }\n  \n  return selected;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def interval_scheduling(intervals):\n    intervals.sort(key=lambda x: x[1])\n    \n    selected = [intervals[0]]\n    last_end = intervals[0][1]\n    \n    for start, end in intervals[1:]:\n        if start >= last_end:\n            selected.append((start, end))\n            last_end = end\n    \n    return selected"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List<int[]> intervalScheduling(int[][] intervals) {\n    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);\n    \n    List<int[]> selected = new ArrayList<>();\n    selected.add(intervals[0]);\n    int lastEnd = intervals[0][1];\n    \n    for (int i = 1; i < intervals.length; i++) {\n        if (intervals[i][0] >= lastEnd) {\n            selected.add(intervals[i]);\n            lastEnd = intervals[i][1];\n        }\n    }\n    \n    return selected;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector<pair<int,int>> intervalScheduling(vector<pair<int,int>>& intervals) {\n    sort(intervals.begin(), intervals.end(), \n         [](auto& a, auto& b) { return a.second < b.second; });\n    \n    vector<pair<int,int>> selected = {intervals[0]};\n    int lastEnd = intervals[0].second;\n    \n    for (int i = 1; i < intervals.size(); i++) {\n        if (intervals[i].first >= lastEnd) {\n            selected.push_back(intervals[i]);\n            lastEnd = intervals[i].second;\n        }\n    }\n    \n    return selected;\n}"
          }
        ]
      }
    ],
    "overview": "Schedule maximum number of non-overlapping intervals. Greedy algorithm that selects intervals finishing earliest.",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=nONCGxWoUfM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/non-overlapping-intervals/",
          "title": "Non-overlapping Intervals"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
          "title": "Minimum Number of Arrows to Burst Balloons"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/meeting-rooms-ii/",
          "title": "Meeting Rooms II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/meeting-rooms/",
          "title": "Meeting Rooms"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/video-stitching/",
          "title": "Video Stitching"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/car-pooling/",
          "title": "Car Pooling"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/",
          "title": "Maximum Number of Events That Can Be Attended"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
          "title": "Maximum Profit in Job Scheduling"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/non-overlapping-intervals/",
          "title": "Erase Overlap Intervals (variant) (duplicate)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/assign-cookies/",
          "title": "Assign Cookies"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "huffman-encoding": {
    "id": "huffman-encoding",
    "name": "Huffman Encoding",
    "title": "Huffman Encoding",
    "category": "Greedy",
    "explanation": {
      "problemStatement": "Optimal prefix-free encoding",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Count frequency of each character",
        "Create leaf nodes and add to min heap",
        "While heap has >1 node, pop two minimum",
        "Create parent with combined frequency",
        "Build codes by traversing tree (0 left, 1 right)"
      ],
      "useCase": "Data compression (ZIP, JPEG), encoding optimization, file compression.",
      "tips": [
        "Greedy algorithm is optimal",
        "Use min heap for efficiency",
        "More frequent = shorter code",
        "Prefix-free property crucial"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "class HuffmanNode {\n  constructor(\n    public char: string,\n    public freq: number,\n    public left: HuffmanNode | null = null,\n    public right: HuffmanNode | null = null\n  ) {}\n}\n\nfunction huffmanEncoding(text: string): Map<string, string> {\n  const freqMap = new Map<string, number>();\n  for (const char of text) {\n    freqMap.set(char, (freqMap.get(char) || 0) + 1);\n  }\n  \n  const heap: HuffmanNode[] = Array.from(freqMap.entries())\n    .map(([char, freq]) => new HuffmanNode(char, freq));\n  \n  while (heap.length > 1) {\n    heap.sort((a, b) => a.freq - b.freq);\n    const left = heap.shift()!;\n    const right = heap.shift()!;\n    const parent = new HuffmanNode('', left.freq + right.freq, left, right);\n    heap.push(parent);\n  }\n  \n  const codes = new Map<string, string>();\n  function buildCodes(node: HuffmanNode | null, code: string): void {\n    if (!node) return;\n    if (!node.left && !node.right) {\n      codes.set(node.char, code || '0');\n      return;\n    }\n    buildCodes(node.left, code + '0');\n    buildCodes(node.right, code + '1');\n  }\n  buildCodes(heap[0], '');\n  \n  return codes;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "import heapq\n\nclass HuffmanNode:\n    def __init__(self, char, freq, left=None, right=None):\n        self.char = char\n        self.freq = freq\n        self.left = left\n        self.right = right\n    \n    def __lt__(self, other):\n        return self.freq < other.freq\n\ndef huffman_encoding(text):\n    freq_map = {}\n    for char in text:\n        freq_map[char] = freq_map.get(char, 0) + 1\n    \n    heap = [HuffmanNode(char, freq) for char, freq in freq_map.items()]\n    heapq.heapify(heap)\n    \n    while len(heap) > 1:\n        left = heapq.heappop(heap)\n        right = heapq.heappop(heap)\n        parent = HuffmanNode('', left.freq + right.freq, left, right)\n        heapq.heappush(heap, parent)\n    \n    codes = {}\n    def build_codes(node, code):\n        if not node:\n            return\n        if not node.left and not node.right:\n            codes[node.char] = code or '0'\n            return\n        build_codes(node.left, code + '0')\n        build_codes(node.right, code + '1')\n    \n    build_codes(heap[0], '')\n    return codes"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "class HuffmanNode implements Comparable<HuffmanNode> {\n    char ch;\n    int freq;\n    HuffmanNode left, right;\n    \n    HuffmanNode(char c, int f) {\n        ch = c;\n        freq = f;\n    }\n    \n    public int compareTo(HuffmanNode other) {\n        return this.freq - other.freq;\n    }\n}\n\npublic Map<Character, String> huffmanEncoding(String text) {\n    Map<Character, Integer> freqMap = new HashMap<>();\n    for (char c : text.toCharArray()) {\n        freqMap.put(c, freqMap.getOrDefault(c, 0) + 1);\n    }\n    \n    PriorityQueue<HuffmanNode> minHeap = new PriorityQueue<>();\n    for (Map.Entry<Character, Integer> entry : freqMap.entrySet()) {\n        minHeap.offer(new HuffmanNode(entry.getKey(), entry.getValue()));\n    }\n    \n    while (minHeap.size() > 1) {\n        HuffmanNode left = minHeap.poll();\n        HuffmanNode right = minHeap.poll();\n        HuffmanNode parent = new HuffmanNode('\\0', left.freq + right.freq);\n        parent.left = left;\n        parent.right = right;\n        minHeap.offer(parent);\n    }\n    \n    Map<Character, String> codes = new HashMap<>();\n    buildCodes(minHeap.poll(), \"\", codes);\n    return codes;\n}\n\nprivate void buildCodes(HuffmanNode node, String code, Map<Character, String> codes) {\n    if (node == null) return;\n    if (node.left == null && node.right == null) {\n        codes.put(node.ch, code.isEmpty() ? \"0\" : code);\n        return;\n    }\n    buildCodes(node.left, code + \"0\", codes);\n    buildCodes(node.right, code + \"1\", codes);\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "struct HuffmanNode {\n    char ch;\n    int freq;\n    HuffmanNode *left, *right;\n    \n    HuffmanNode(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}\n};\n\nstruct Compare {\n    bool operator()(HuffmanNode* a, HuffmanNode* b) {\n        return a->freq > b->freq;\n    }\n};\n\nmap<char, string> huffmanEncoding(string text) {\n    map<char, int> freqMap;\n    for (char c : text) freqMap[c]++;\n    \n    priority_queue<HuffmanNode*, vector<HuffmanNode*>, Compare> minHeap;\n    for (auto [ch, freq] : freqMap) {\n        minHeap.push(new HuffmanNode(ch, freq));\n    }\n    \n    while (minHeap.size() > 1) {\n        auto left = minHeap.top(); minHeap.pop();\n        auto right = minHeap.top(); minHeap.pop();\n        auto parent = new HuffmanNode('\\0', left->freq + right->freq);\n        parent->left = left;\n        parent->right = right;\n        minHeap.push(parent);\n    }\n    \n    map<char, string> codes;\n    function<void(HuffmanNode*, string)> buildCodes = [&](HuffmanNode* node, string code) {\n        if (!node) return;\n        if (!node->left && !node->right) {\n            codes[node->ch] = code.empty() ? \"0\" : code;\n            return;\n        }\n        buildCodes(node->left, code + \"0\");\n        buildCodes(node->right, code + \"1\");\n    };\n    buildCodes(minHeap.top(), \"\");\n    \n    return codes;\n}"
          }
        ]
      }
    ],
    "overview": "Huffman encoding creates optimal prefix-free codes for data compression using a greedy algorithm with a priority queue.",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/top-k-frequent-elements/",
          "title": "Top K Frequent Elements"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/sort-characters-by-frequency/",
          "title": "Sort Characters By Frequency"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reorganize-string/",
          "title": "Reorganize String"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/ugly-number-ii/",
          "title": "Ugly Number II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/split-array-into-consecutive-subsequences/",
          "title": "Split Array into Consecutive Subsequences"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/bus-routes/",
          "title": "Bus Routes"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "gas-station": {
    "id": "gas-station",
    "name": "Gas Station",
    "title": "Gas Station",
    "category": "Greedy",
    "explanation": {
      "problemStatement": "Find starting station for circular tour",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Track total gas vs total cost to check if solution exists",
        "Maintain current gas tank and starting position",
        "At each station, add net gas (gas[i] - cost[i])",
        "If current gas becomes negative, reset start to next station",
        "Continue through all stations once",
        "Return start index if total gas >= total cost, else -1"
      ],
      "useCase": "Circular array problems, greedy optimization, resource allocation problems.",
      "tips": [
        "Time complexity: O(n) - single pass",
        "Space complexity: O(1)",
        "Key insight: if total gas >= total cost, solution exists",
        "No need to check multiple starting points"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function canCompleteCircuit(gas: number[], cost: number[]): number {\n  let totalGas = 0;\n  let totalCost = 0;\n  let currentGas = 0;\n  let startIndex = 0;\n\n  for (let i = 0; i < gas.length; i++) {\n    totalGas += gas[i];\n    totalCost += cost[i];\n    currentGas += gas[i] - cost[i];\n\n    // If current gas becomes negative, reset start\n    if (currentGas < 0) {\n      startIndex = i + 1;\n      currentGas = 0;\n    }\n  }\n\n  // If total gas < total cost, no solution exists\n  return totalGas >= totalCost ? startIndex : -1;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def can_complete_circuit(gas: List[int], cost: List[int]) -> int:\ntotal_gas = 0\ntotal_cost = 0\ncurrent_gas = 0\nstart_index = 0\n\nfor i in range(len(gas)):\n  total_gas += gas[i]\ntotal_cost += cost[i]\ncurrent_gas += gas[i] - cost[i]\n        \n        # If current gas becomes negative, reset start\nif current_gas < 0:\n  start_index = i + 1\ncurrent_gas = 0\n    \n    # If total gas < total cost, no solution exists\nreturn start_index if total_gas >= total_cost else -1"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int canCompleteCircuit(int[] gas, int[] cost) {\n    int totalGas = 0;\n    int totalCost = 0;\n    int currentGas = 0;\n    int startIndex = 0;\n\n  for (int i = 0; i < gas.length; i++) {\n    totalGas += gas[i];\n    totalCost += cost[i];\n    currentGas += gas[i] - cost[i];\n\n    // If current gas becomes negative, reset start\n    if (currentGas < 0) {\n      startIndex = i + 1;\n      currentGas = 0;\n    }\n  }\n\n  // If total gas < total cost, no solution exists\n  return totalGas >= totalCost ? startIndex : -1;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "int canCompleteCircuit(vector<int> & gas, vector<int> & cost) {\n    int totalGas = 0;\n    int totalCost = 0;\n    int currentGas = 0;\n    int startIndex = 0;\n\n  for (int i = 0; i < gas.size(); i++) {\n    totalGas += gas[i];\n    totalCost += cost[i];\n    currentGas += gas[i] - cost[i];\n\n    // If current gas becomes negative, reset start\n    if (currentGas < 0) {\n      startIndex = i + 1;\n      currentGas = 0;\n    }\n  }\n\n  // If total gas < total cost, no solution exists\n  return totalGas >= totalCost ? startIndex : -1;\n} "
          }
        ]
      }
    ],
    "overview": "Gas Station problem uses a greedy approach to find the starting point for completing a circular route, where each station provides gas and requires cost to reach the next station.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=lJwbPZGo05A",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/gas-station/",
          "title": "Gas Station"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/non-decreasing-array/",
          "title": "Non-decreasing Array"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
          "title": "Best Time to Buy and Sell Stock"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
          "title": "Best Time to Buy and Sell Stock II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-number-of-refueling-stops/",
          "title": "Minimum Number of Refueling Stops"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/",
          "title": "Maximum Number of Events That Can Be Attended"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
          "title": "Minimum Number of Arrows to Burst Balloons"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero/",
          "title": "Number of Steps to Reduce a Number to Zero (auxiliary)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-at-least-threshold/",
          "title": "Number of Sub-arrays of Size K and Average at Least Threshold (auxiliary)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "subsets": {
    "id": "subsets",
    "name": "Subsets",
    "title": "Subsets",
    "category": "Backtracking",
    "explanation": {
      "problemStatement": "Generate all subsets of a set",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Add current path to result (including empty set)",
        "For each remaining element",
        "Include element in path",
        "Recursively explore further",
        "Backtrack by removing element",
        "Continue to next element"
      ],
      "useCase": "Combinatorial problems, power set generation, selection problems.",
      "tips": [
        "O(2^n * n) time - 2^n subsets",
        "Backtracking template",
        "Add result at each step",
        "Can also use bit manipulation"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function subsets(nums: number[]): number[][] {\n  const result: number[][] = [];\n\n  function backtrack(start: number, path: number[]) {\n    result.push([...path]);\n\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n\n  backtrack(0, []);\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def subsets(nums: List[int]) -> list[List[int]]:\nresult = []\n    \n    def backtrack(start: int, path: List[int]):\nresult.append(path[:])\n\nfor i in range(start, len(nums)):\n  path.append(nums[i])\nbacktrack(i + 1, path)\npath.pop()\n\nbacktrack(0, [])\nreturn result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List < List < Integer >> subsets(int[] nums) {\n  List < List < Integer >> result = new ArrayList<>();\n  backtrack(nums, 0, new ArrayList<>(), result);\n  return result;\n}\n\nprivate void backtrack(int[] nums, int start, List < Integer > path,\n  List < List < Integer >> result) {\n  result.add(new ArrayList<>(path));\n\n  for (int i = start; i < nums.length; i++) {\n    path.add(nums[i]);\n    backtrack(nums, i + 1, path, result);\n    path.remove(path.size() - 1);\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void backtrack(vector<int> & nums, int start, vector<int> & path,\n  vector<vector<int>> & result) {\n  result.push_back(path);\n\n  for (int i = start; i < nums.size(); i++) {\n    path.push_back(nums[i]);\n    backtrack(nums, i + 1, path, result);\n    path.pop_back();\n  }\n}\n\nvector < vector < int >> subsets(vector<int> & nums) {\n  vector < vector < int >> result;\n  vector < int > path;\n  backtrack(nums, 0, path, result);\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "Generate all possible subsets (power set) using backtracking.",
    "timeComplexity": "O(2^n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/playlist?list=PLot-Xpze53lf5C3HSjCnyFghlW0G1HHXo",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/subsets/",
          "title": "Subsets"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/subsets-ii/",
          "title": "Subsets II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
          "title": "Letter Combinations of a Phone Number"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/letter-case-permutation/",
          "title": "Letter Case Permutation"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-watch/",
          "title": "Binary Watch"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/palindrome-partitioning/",
          "title": "Palindrome Partitioning"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/generate-parentheses/",
          "title": "Generate Parentheses"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combinations/",
          "title": "Combinations"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/increasing-subsequences/",
          "title": "Increasing Subsequences"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/subsets/",
          "title": "Subsets (iterative variants / practice)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/beautiful-arrangement/",
          "title": "Beautiful Arrangement"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-iii/",
          "title": "Combination Sum III"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [
      {
        "name": "nums",
        "type": "number[]",
        "label": "Numbers"
      }
    ],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "permutations": {
    "id": "permutations",
    "name": "Permutations",
    "title": "Permutations",
    "category": "Backtracking",
    "explanation": {
      "problemStatement": "Generate all permutations",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Use path array and used boolean array",
        "If path length equals input length, add to result",
        "Try each unused element",
        "Mark as used and add to path",
        "Recursively continue",
        "Backtrack: remove and mark unused"
      ],
      "useCase": "Arrangement problems, scheduling, ordering problems.",
      "tips": [
        "O(n! * n) time complexity",
        "n! permutations total",
        "Track used elements",
        "Classic backtracking"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function permute(nums: number[]): number[][] {\n  const result: number[][] = [];\n\n  function backtrack(path: number[], used: boolean[]) {\n    if (path.length === nums.length) {\n      result.push([...path]);\n      return;\n    }\n\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n\n      path.push(nums[i]);\n      used[i] = true;\n      backtrack(path, used);\n      path.pop();\n      used[i] = false;\n    }\n  }\n\n  backtrack([], new Array(nums.length).fill(false));\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def permute(nums: List[int]) -> list[List[int]]:\nresult = []\n    \n    def backtrack(path: List[int], used: list[bool]):\nif len(path) == len(nums):\n  result.append(path[:])\nreturn\n\nfor i in range(len(nums)):\n  if used[i]:\n    continue\n\npath.append(nums[i])\nused[i] = True\nbacktrack(path, used)\npath.pop()\nused[i] = False\n\nbacktrack([], [False] * len(nums))\nreturn result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List < List < Integer >> permute(int[] nums) {\n  List < List < Integer >> result = new ArrayList<>();\n  backtrack(nums, new ArrayList<>(), new boolean[nums.length], result);\n  return result;\n}\n\nprivate void backtrack(int[] nums, List < Integer > path, boolean[] used,\n  List < List < Integer >> result) {\n  if (path.size() == nums.length) {\n    result.add(new ArrayList<>(path));\n    return;\n  }\n\n  for (int i = 0; i < nums.length; i++) {\n    if (used[i]) continue;\n\n    path.add(nums[i]);\n    used[i] = true;\n    backtrack(nums, path, used, result);\n    path.remove(path.size() - 1);\n    used[i] = false;\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void backtrack(vector<int> & nums, vector<int> & path, vector<bool> & used,\n  vector<vector<int>> & result) {\n  if (path.size() == nums.size()) {\n    result.push_back(path);\n    return;\n  }\n\n  for (int i = 0; i < nums.size(); i++) {\n    if (used[i]) continue;\n\n    path.push_back(nums[i]);\n    used[i] = true;\n    backtrack(nums, path, used, result);\n    path.pop_back();\n    used[i] = false;\n  }\n}\n\nvector < vector < int >> permute(vector<int> & nums) {\n  vector < vector < int >> result;\n  vector < int > path;\n  vector < bool > used(nums.size(), false);\n  backtrack(nums, path, used, result);\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "Generate all permutations using backtracking with used array to track visited elements.",
    "timeComplexity": "O(n!)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=s7AvT7cGdSo",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/permutations/",
          "title": "Permutations"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/permutations-ii/",
          "title": "Permutations II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/next-permutation/",
          "title": "Next Permutation"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/permutation-sequence/",
          "title": "Permutation Sequence"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/factor-combinations/",
          "title": "Factor Combinations"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/generate-parentheses/",
          "title": "Generate Parentheses"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/permutations/",
          "title": "Permutations (recursive & iterative practice)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-swaps-to-make-strings-equal/",
          "title": "Minimum Swaps to Make Strings Equal"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/palindrome-pairs/",
          "title": "Palindrome Pairs"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/next-permutation/",
          "title": "Next Permutation (practice)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/word-break-ii/",
          "title": "Word Break II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/high-five/",
          "title": "High Five (related grouping / ordering practice)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [
      {
        "name": "nums",
        "type": "number[]",
        "label": "Numbers"
      }
    ],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "combinations": {
    "id": "combinations",
    "name": "Combinations",
    "title": "Combinations",
    "category": "Backtracking",
    "explanation": {
      "problemStatement": "Generate all k-combinations",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Use backtracking with start index",
        "If path length equals k, add to result",
        "For each number from start to n",
        "Add to path, recurse with next start",
        "Remove last element (backtrack)"
      ],
      "useCase": "Combinatorics, lottery numbers, team selection, subset problems.",
      "tips": [
        "Pruning: if remaining < needed, skip",
        "Start index prevents duplicates",
        "Time: O(C(n,k))",
        "Space: O(k) for recursion"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function combine(n: number, k: number): number[][] {\n  const result: number[][] = [];\n  \n  function backtrack(start: number, path: number[]): void {\n    if (path.length === k) {\n      result.push([...path]);\n      return;\n    }\n    \n    for (let i = start; i <= n; i++) {\n      path.push(i);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  \n  backtrack(1, []);\n  return result;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def combine(n, k):\n    result = []\n    \n    def backtrack(start, path):\n        if len(path) == k:\n            result.append(path[:])\n            return\n        \n        for i in range(start, n + 1):\n            path.append(i)\n            backtrack(i + 1, path)\n            path.pop()\n    \n    backtrack(1, [])\n    return result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List<List<Integer>> combine(int n, int k) {\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(1, n, k, new ArrayList<>(), result);\n    return result;\n}\n\nprivate void backtrack(int start, int n, int k, List<Integer> path, List<List<Integer>> result) {\n    if (path.size() == k) {\n        result.add(new ArrayList<>(path));\n        return;\n    }\n    \n    for (int i = start; i <= n; i++) {\n        path.add(i);\n        backtrack(i + 1, n, k, path, result);\n        path.remove(path.size() - 1);\n    }\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector<vector<int>> combine(int n, int k) {\n    vector<vector<int>> result;\n    vector<int> path;\n    \n    function<void(int)> backtrack = [&](int start) {\n        if (path.size() == k) {\n            result.push_back(path);\n            return;\n        }\n        \n        for (int i = start; i <= n; i++) {\n            path.push_back(i);\n            backtrack(i + 1);\n            path.pop_back();\n        }\n    };\n    \n    backtrack(1);\n    return result;\n}"
          }
        ]
      }
    ],
    "overview": "Generate all k-combinations from numbers 1 to n using backtracking. Each combination is a unique set of k numbers.",
    "timeComplexity": "O(C(n,k))",
    "spaceComplexity": "O(k)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=q0s6m7AiM7o",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combinations/",
          "title": "Combinations"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum/",
          "title": "Combination Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-ii/",
          "title": "Combination Sum II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-iii/",
          "title": "Combination Sum III"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-iv/",
          "title": "Combination Sum IV"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",
          "title": "Partition to K Equal Sum Subsets"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-iii/",
          "title": "Combination Sum III (practice duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/spiral-matrix-ii/",
          "title": "Spiral Matrix II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/3sum/",
          "title": "3Sum"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/combinations/",
          "title": "Combinations (practice easy variant)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-ii/",
          "title": "Combination Sum II (practice)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "combination-sum": {
    "id": "combination-sum",
    "name": "Combination Sum",
    "title": "Combination Sum",
    "category": "Backtracking",
    "explanation": {
      "problemStatement": "Find combinations summing to target",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Use backtracking with current sum",
        "If sum equals target, add combination",
        "If sum exceeds target, prune branch",
        "For each candidate from start index",
        "Can reuse same element (pass i, not i+1)"
      ],
      "useCase": "Coin change combinations, subset sum, resource allocation.",
      "tips": [
        "Reuse elements: pass same index",
        "Early pruning when sum > target",
        "Sorting helps optimization",
        "Track sum to avoid recalculation"
      ]
    },
    "companyTags": [
      "Amazon",
      "Facebook"
    ],
    "difficulty": "intermediate",
    "listType": "core+Blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function combinationSum(candidates: number[], target: number): number[][] {\n  const result: number[][] = [];\n  \n  function backtrack(start: number, path: number[], sum: number): void {\n    if (sum === target) {\n      result.push([...path]);\n      return;\n    }\n    if (sum > target) return;\n    \n    for (let i = start; i < candidates.length; i++) {\n      path.push(candidates[i]);\n      backtrack(i, path, sum + candidates[i]);\n      path.pop();\n    }\n  }\n  \n  backtrack(0, [], 0);\n  return result;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def combination_sum(candidates, target):\n    result = []\n    \n    def backtrack(start, path, total):\n        if total == target:\n            result.append(path[:])\n            return\n        if total > target:\n            return\n        \n        for i in range(start, len(candidates)):\n            path.append(candidates[i])\n            backtrack(i, path, total + candidates[i])\n            path.pop()\n    \n    backtrack(0, [], 0)\n    return result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List<List<Integer>> combinationSum(int[] candidates, int target) {\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(candidates, target, 0, new ArrayList<>(), 0, result);\n    return result;\n}\n\nprivate void backtrack(int[] candidates, int target, int start, \n                       List<Integer> path, int sum, List<List<Integer>> result) {\n    if (sum == target) {\n        result.add(new ArrayList<>(path));\n        return;\n    }\n    if (sum > target) return;\n    \n    for (int i = start; i < candidates.length; i++) {\n        path.add(candidates[i]);\n        backtrack(candidates, target, i, path, sum + candidates[i], result);\n        path.remove(path.size() - 1);\n    }\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    vector<vector<int>> result;\n    vector<int> path;\n    \n    function<void(int, int)> backtrack = [&](int start, int sum) {\n        if (sum == target) {\n            result.push_back(path);\n            return;\n        }\n        if (sum > target) return;\n        \n        for (int i = start; i < candidates.size(); i++) {\n            path.push_back(candidates[i]);\n            backtrack(i, sum + candidates[i]);\n            path.pop_back();\n        }\n    };\n    \n    backtrack(0, 0);\n    return result;\n}"
          }
        ]
      }
    ],
    "overview": "Find all unique combinations that sum to target. Numbers can be reused unlimited times.",
    "timeComplexity": "O(2^n)",
    "spaceComplexity": "O(target)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=GBKI9VSKdGg",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum/",
          "title": "Combination Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-ii/",
          "title": "Combination Sum II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-iii/",
          "title": "Combination Sum III"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-iv/",
          "title": "Combination Sum IV"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/target-sum/",
          "title": "Target Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",
          "title": "Partition to K Equal Sum Subsets"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum-iii/",
          "title": "Combination Sum III (duplicate practice)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum/",
          "title": "Combination Sum (recursive practice)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/combination-sum/",
          "title": "Combination Sum (iterative/backtracking comparison)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "word-search-grid": {
    "id": "word-search-grid",
    "name": "Word Search",
    "title": "Word Search",
    "category": "Backtracking",
    "explanation": {
      "problemStatement": "Find word in 2D grid",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Try starting from each cell",
        "Use DFS to explore 4 directions",
        "Mark cell as visited temporarily",
        "If word completed, return true",
        "Backtrack: restore cell value"
      ],
      "useCase": "Word games, crossword validation, pattern matching in grids.",
      "tips": [
        "Mark visited with special char",
        "Restore on backtrack",
        "Prune early if char doesn't match",
        "Time: O(m*n*4^L)"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function exist(board: string[][], word: string): boolean {\n  const rows = board.length, cols = board[0].length;\n  \n  function dfs(r: number, c: number, index: number): boolean {\n    if (index === word.length) return true;\n    if (r < 0 || c < 0 || r >= rows || c >= cols || \n        board[r][c] !== word[index]) return false;\n    \n    const temp = board[r][c];\n    board[r][c] = '#';\n    \n    const found = dfs(r+1, c, index+1) || dfs(r-1, c, index+1) ||\n                  dfs(r, c+1, index+1) || dfs(r, c-1, index+1);\n    \n    board[r][c] = temp;\n    return found;\n  }\n  \n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (dfs(r, c, 0)) return true;\n    }\n  }\n  \n  return false;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def exist(board, word):\n    rows, cols = len(board), len(board[0])\n    \n    def dfs(r, c, index):\n        if index == len(word):\n            return True\n        if (r < 0 or c < 0 or r >= rows or c >= cols or \n            board[r][c] != word[index]):\n            return False\n        \n        temp = board[r][c]\n        board[r][c] = '#'\n        \n        found = (dfs(r+1, c, index+1) or dfs(r-1, c, index+1) or\n                 dfs(r, c+1, index+1) or dfs(r, c-1, index+1))\n        \n        board[r][c] = temp\n        return found\n    \n    for r in range(rows):\n        for c in range(cols):\n            if dfs(r, c, 0):\n                return True\n    \n    return False"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public boolean exist(char[][] board, String word) {\n    int rows = board.length, cols = board[0].length;\n    \n    for (int r = 0; r < rows; r++) {\n        for (int c = 0; c < cols; c++) {\n            if (dfs(board, word, r, c, 0)) return true;\n        }\n    }\n    \n    return false;\n}\n\nprivate boolean dfs(char[][] board, String word, int r, int c, int index) {\n    if (index == word.length()) return true;\n    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length || \n        board[r][c] != word.charAt(index)) return false;\n    \n    char temp = board[r][c];\n    board[r][c] = '#';\n    \n    boolean found = dfs(board, word, r+1, c, index+1) || \n                    dfs(board, word, r-1, c, index+1) ||\n                    dfs(board, word, r, c+1, index+1) || \n                    dfs(board, word, r, c-1, index+1);\n    \n    board[r][c] = temp;\n    return found;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "bool exist(vector<vector<char>>& board, string word) {\n    int rows = board.size(), cols = board[0].size();\n    \n    function<bool(int, int, int)> dfs = [&](int r, int c, int index) -> bool {\n        if (index == word.length()) return true;\n        if (r < 0 || c < 0 || r >= rows || c >= cols || \n            board[r][c] != word[index]) return false;\n        \n        char temp = board[r][c];\n        board[r][c] = '#';\n        \n        bool found = dfs(r+1, c, index+1) || dfs(r-1, c, index+1) ||\n                     dfs(r, c+1, index+1) || dfs(r, c-1, index+1);\n        \n        board[r][c] = temp;\n        return found;\n    };\n    \n    for (int r = 0; r < rows; r++) {\n        for (int c = 0; c < cols; c++) {\n            if (dfs(r, c, 0)) return true;\n        }\n    }\n    \n    return false;\n}"
          }
        ]
      }
    ],
    "overview": "Search for a word in a 2D grid using DFS backtracking. Word must be constructed from adjacent cells.",
    "timeComplexity": "O(m*n*4^L)",
    "spaceComplexity": "O(L)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=pfiQ_PS1g8E",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/word-search/",
          "title": "Word Search"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/word-search-ii/",
          "title": "Word Search II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sudoku-solver/",
          "title": "Sudoku Solver"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/surrounded-regions/",
          "title": "Surrounded Regions"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/island-perimeter/",
          "title": "Island Perimeter"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-islands/",
          "title": "Number of Islands"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/flood-fill/",
          "title": "Flood Fill"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/shortest-path-visiting-all-nodes/",
          "title": "Shortest Path Visiting All Nodes"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/making-a-large-island/",
          "title": "Making A Large Island"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/word-search/",
          "title": "Word Search (practice variation)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/powx-n/",
          "title": "Pow(x, n) (auxiliary recursive practice)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "n-queens": {
    "id": "n-queens",
    "name": "N-Queens",
    "title": "N-Queens",
    "category": "Backtracking",
    "explanation": {
      "problemStatement": "Place N queens on N×N board",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(N!)",
    "spaceComplexity": "O(N)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=Ph95IHmRp5M",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/n-queens/",
          "title": "N-Queens"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/n-queens-ii/",
          "title": "N-Queens II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sudoku-solver/",
          "title": "Sudoku Solver"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sudoku-solver/",
          "title": "Sudoku Solver (related constraints backtracking)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/different-ways-to-add-parentheses/",
          "title": "Different Ways to Add Parentheses"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/sum-of-two-integers/",
          "title": "Sum of Two Integers (auxiliary)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/n-queens/",
          "title": "N-Queens (practice duplicate)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/strobogrammatic-number-ii/",
          "title": "Strobogrammatic Number II"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "sudoku-solver": {
    "id": "sudoku-solver",
    "name": "Sudoku Solver",
    "title": "Sudoku Solver",
    "category": "Backtracking",
    "explanation": {
      "problemStatement": "Solve Sudoku puzzle",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Find empty cell ('.')",
        "Try digits 1-9",
        "Check if valid (row, col, 3x3 box)",
        "If valid, place and recurse",
        "If solution found, return true, else backtrack"
      ],
      "useCase": "Puzzle solving, constraint satisfaction, game AI.",
      "tips": [
        "Validate row, column, and 3x3 box",
        "Use backtracking pattern",
        "Optimization: choose cell with fewest options",
        "Memoization can help"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function solveSudoku(board: string[][]): void {\n  function isValid(row: number, col: number, num: string): boolean {\n    for (let i = 0; i < 9; i++) {\n      if (board[row][i] === num || board[i][col] === num) return false;\n      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);\n      const boxCol = 3 * Math.floor(col / 3) + (i % 3);\n      if (board[boxRow][boxCol] === num) return false;\n    }\n    return true;\n  }\n  \n  function solve(): boolean {\n    for (let row = 0; row < 9; row++) {\n      for (let col = 0; col < 9; col++) {\n        if (board[row][col] === '.') {\n          for (let num = 1; num <= 9; num++) {\n            const char = num.toString();\n            if (isValid(row, col, char)) {\n              board[row][col] = char;\n              if (solve()) return true;\n              board[row][col] = '.';\n            }\n          }\n          return false;\n        }\n      }\n    }\n    return true;\n  }\n  \n  solve();\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def solve_sudoku(board):\n    def is_valid(row, col, num):\n        for i in range(9):\n            if board[row][i] == num or board[i][col] == num:\n                return False\n            box_row = 3 * (row // 3) + i // 3\n            box_col = 3 * (col // 3) + i % 3\n            if board[box_row][box_col] == num:\n                return False\n        return True\n    \n    def solve():\n        for row in range(9):\n            for col in range(9):\n                if board[row][col] == '.':\n                    for num in '123456789':\n                        if is_valid(row, col, num):\n                            board[row][col] = num\n                            if solve():\n                                return True\n                            board[row][col] = '.'\n                    return False\n        return True\n    \n    solve()"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public void solveSudoku(char[][] board) {\n    solve(board);\n}\n\nprivate boolean solve(char[][] board) {\n    for (int row = 0; row < 9; row++) {\n        for (int col = 0; col < 9; col++) {\n            if (board[row][col] == '.') {\n                for (char num = '1'; num <= '9'; num++) {\n                    if (isValid(board, row, col, num)) {\n                        board[row][col] = num;\n                        if (solve(board)) return true;\n                        board[row][col] = '.';\n                    }\n                }\n                return false;\n            }\n        }\n    }\n    return true;\n}\n\nprivate boolean isValid(char[][] board, int row, int col, char num) {\n    for (int i = 0; i < 9; i++) {\n        if (board[row][i] == num || board[i][col] == num) return false;\n        int boxRow = 3 * (row / 3) + i / 3;\n        int boxCol = 3 * (col / 3) + i % 3;\n        if (board[boxRow][boxCol] == num) return false;\n    }\n    return true;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "void solveSudoku(vector<vector<char>>& board) {\n    function<bool(int, int, char)> isValid = [&](int row, int col, char num) {\n        for (int i = 0; i < 9; i++) {\n            if (board[row][i] == num || board[i][col] == num) return false;\n            int boxRow = 3 * (row / 3) + i / 3;\n            int boxCol = 3 * (col / 3) + i % 3;\n            if (board[boxRow][boxCol] == num) return false;\n        }\n        return true;\n    };\n    \n    function<bool()> solve = [&]() {\n        for (int row = 0; row < 9; row++) {\n            for (int col = 0; col < 9; col++) {\n                if (board[row][col] == '.') {\n                    for (char num = '1'; num <= '9'; num++) {\n                        if (isValid(row, col, num)) {\n                            board[row][col] = num;\n                            if (solve()) return true;\n                            board[row][col] = '.';\n                        }\n                    }\n                    return false;\n                }\n            }\n        }\n        return true;\n    };\n    \n    solve();\n}"
          }
        ]
      }
    ],
    "overview": "Solve Sudoku puzzle using backtracking. Try each number 1-9 in empty cells, backtrack if invalid.",
    "timeComplexity": "O(9^(n*n))",
    "spaceComplexity": "O(n*n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=TV_UepFKHMU",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sudoku-solver/",
          "title": "Sudoku Solver"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/valid-sudoku/",
          "title": "Valid Sudoku"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximal-square/",
          "title": "Maximal Square"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/surrounded-regions/",
          "title": "Surrounded Regions"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/game-of-life/",
          "title": "Game of Life"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/island-perimeter/",
          "title": "Island Perimeter"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sudoku-solver/",
          "title": "Sudoku Solver (practice duplicate)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sudoku-solver/",
          "title": "Sudoku variations (conceptual practice)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/n-queens/",
          "title": "N-Queens (related constraint-satisfaction)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/unique-paths-iii/",
          "title": "Unique Paths III"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/walls-and-gates/",
          "title": "Walls and Gates"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "xor-trick": {
    "id": "xor-trick",
    "name": "XOR Trick",
    "title": "XOR Trick",
    "category": "Bit Manipulation",
    "explanation": {
      "problemStatement": "Find single number using XOR",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=qMPX1AOa83k",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/single-number/",
          "title": "Single Number"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/single-number-ii/",
          "title": "Single Number II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/single-number-iii/",
          "title": "Single Number III"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/missing-number/",
          "title": "Missing Number"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-difference/",
          "title": "Find the Difference"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/hamming-distance/",
          "title": "Hamming Distance"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/number-complement/",
          "title": "Number Complement"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/bitwise-and-of-numbers-range/",
          "title": "Bitwise AND of Numbers Range"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/reverse-bits/",
          "title": "Reverse Bits"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/number-of-1-bits/",
          "title": "Number of 1 Bits"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/power-of-two/",
          "title": "Power of Two"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
          "title": "Maximum XOR of Two Numbers in an Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/bitwise-ors-of-subarrays/",
          "title": "Bitwise ORs of Subarrays"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/xor-queries-of-a-subarray/",
          "title": "XOR Queries of a Subarray"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "count-bits": {
    "id": "count-bits",
    "name": "Count Bits",
    "title": "Count Bits",
    "category": "Bit Manipulation",
    "explanation": {
      "problemStatement": "Brian Kernighan's algorithm",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=RyBM56RIWrM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/counting-bits/",
          "title": "Counting Bits"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/number-of-1-bits/",
          "title": "Number of 1 Bits"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/power-of-two/",
          "title": "Power of Two"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/reverse-bits/",
          "title": "Reverse Bits"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/missing-number/",
          "title": "Missing Number"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-number-with-alternating-bits/",
          "title": "Binary Number with Alternating Bits"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/number-complement/",
          "title": "Number Complement"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/complement-of-base-10-integer/",
          "title": "Complement of Base 10 Integer"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/hamming-distance/",
          "title": "Hamming Distance"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/",
          "title": "Minimum Flips to Make a OR b Equal to c"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/single-number-ii/",
          "title": "Single Number II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/bitwise-ors-of-subarrays/",
          "title": "Bitwise ORs of Subarrays"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/bitwise-and-of-numbers-range/",
          "title": "Bitwise AND of Numbers Range"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
          "title": "Maximum XOR of Two Numbers in an Array"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "subset-generation-bits": {
    "id": "subset-generation-bits",
    "name": "Subset Generation with Bits",
    "title": "Subset Generation with Bits",
    "category": "Bit Manipulation",
    "explanation": {
      "problemStatement": "Generate subsets using bitmasks",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Iterate from 0 to 2^n - 1",
        "Each number represents a subset",
        "Check each bit position",
        "If bit is 1, include nums[i] in subset",
        "Add subset to result"
      ],
      "useCase": "Subset generation, combinatorics, power set problems.",
      "tips": [
        "2^n total subsets",
        "Bit i represents nums[i]",
        "Elegant iterative solution",
        "No recursion needed"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function subsetsWithBits(nums: number[]): number[][] {\n  const n = nums.length;\n  const result: number[][] = [];\n  \n  for (let mask = 0; mask < (1 << n); mask++) {\n    const subset: number[] = [];\n    for (let i = 0; i < n; i++) {\n      if (mask & (1 << i)) {\n        subset.push(nums[i]);\n      }\n    }\n    result.push(subset);\n  }\n  \n  return result;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def subsets_with_bits(nums):\n    n = len(nums)\n    result = []\n    \n    for mask in range(1 << n):\n        subset = []\n        for i in range(n):\n            if mask & (1 << i):\n                subset.append(nums[i])\n        result.append(subset)\n    \n    return result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List<List<Integer>> subsetsWithBits(int[] nums) {\n    int n = nums.length;\n    List<List<Integer>> result = new ArrayList<>();\n    \n    for (int mask = 0; mask < (1 << n); mask++) {\n        List<Integer> subset = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            if ((mask & (1 << i)) != 0) {\n                subset.add(nums[i]);\n            }\n        }\n        result.add(subset);\n    }\n    \n    return result;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector<vector<int>> subsetsWithBits(vector<int>& nums) {\n    int n = nums.size();\n    vector<vector<int>> result;\n    \n    for (int mask = 0; mask < (1 << n); mask++) {\n        vector<int> subset;\n        for (int i = 0; i < n; i++) {\n            if (mask & (1 << i)) {\n                subset.push_back(nums[i]);\n            }\n        }\n        result.push_back(subset);\n    }\n    \n    return result;\n}"
          }
        ]
      }
    ],
    "overview": "Generate all subsets using bit manipulation. Each bit in a number represents whether to include that element.",
    "timeComplexity": "O(2^n * n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=REOH22Xwdkk",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/subsets/",
          "title": "Subsets"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/subsets-ii/",
          "title": "Subsets II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/permutations/",
          "title": "Permutations"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/permutations-ii/",
          "title": "Permutations II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/binary-watch/",
          "title": "Binary Watch"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/subsets/",
          "title": "Subsets (duplicate for bitmask pattern)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/letter-case-permutation/",
          "title": "Letter Case Permutation"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/",
          "title": "Minimum Number of Work Sessions to Finish the Tasks"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/matchsticks-to-square/",
          "title": "Matchsticks to Square"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/smallest-sufficient-team/",
          "title": "Smallest Sufficient Team"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/",
          "title": "The k-th Lexicographical String of All Happy Strings of Length n"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/",
          "title": "Maximum Length of a Concatenated String with Unique Characters"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets/",
          "title": "Count Number of Maximum Bitwise-OR Subsets"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/unique-paths-iii/",
          "title": "Unique Paths III"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "kth-largest": {
    "id": "kth-largest",
    "name": "Kth Largest Element",
    "title": "Kth Largest Element",
    "category": "Heap / Priority Queue",
    "explanation": {
      "problemStatement": "Find kth largest using min heap",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n log k)",
    "spaceComplexity": "O(k)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=XEmy13g1Qxc",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
          "title": "Kth Largest Element in an Array"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
          "title": "Kth Largest Element in a Stream"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/top-k-frequent-elements/",
          "title": "Top K Frequent Elements"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/k-closest-points-to-origin/",
          "title": "K Closest Points to Origin"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/last-stone-weight/",
          "title": "Last Stone Weight"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/top-k-frequent-words/",
          "title": "Top K Frequent Words"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-k-closest-elements/",
          "title": "Find K Closest Elements"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-cost-to-connect-sticks/",
          "title": "Minimum Cost to Connect Sticks"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/find-median-from-data-stream/",
          "title": "Find Median from Data Stream"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/ipo/",
          "title": "IPO"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sliding-window-maximum/",
          "title": "Sliding Window Maximum"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sliding-window-median/",
          "title": "Sliding Window Median"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
          "title": "Find K Pairs with Smallest Sums"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/trapping-rain-water-ii/",
          "title": "Trapping Rain Water II"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "merge-k-lists": {
    "id": "merge-k-lists",
    "name": "Merge K Sorted Lists",
    "title": "Merge K Sorted Lists",
    "category": "Heap / Priority Queue",
    "explanation": {
      "problemStatement": "Merge using min heap",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Add head of each list to min heap",
        "Extract minimum from heap",
        "Add to result list",
        "Add next node from same list to heap",
        "Repeat until heap is empty"
      ],
      "useCase": "External sorting, merging sorted data streams, distributed systems.",
      "tips": [
        "Min heap of size k",
        "O(N log k) time complexity",
        "N = total nodes",
        "Better than merging pairs"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function mergeKLists(lists: (ListNode | null)[]): ListNode | null {\n  const minHeap: [number, number, ListNode][] = [];\n  \n  for (let i = 0; i < lists.length; i++) {\n    if (lists[i]) {\n      minHeap.push([lists[i].val, i, lists[i]]);\n    }\n  }\n  \n  const dummy = new ListNode(0);\n  let curr = dummy;\n  \n  while (minHeap.length) {\n    minHeap.sort((a, b) => a[0] - b[0]);\n    const [val, listIdx, node] = minHeap.shift()!;\n    \n    curr.next = node;\n    curr = curr.next;\n    \n    if (node.next) {\n      minHeap.push([node.next.val, listIdx, node.next]);\n    }\n  }\n  \n  return dummy.next;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "import heapq\n\ndef merge_k_lists(lists):\n    min_heap = []\n    \n    for i, lst in enumerate(lists):\n        if lst:\n            heapq.heappush(min_heap, (lst.val, i, lst))\n    \n    dummy = ListNode(0)\n    curr = dummy\n    \n    while min_heap:\n        val, list_idx, node = heapq.heappop(min_heap)\n        \n        curr.next = node\n        curr = curr.next\n        \n        if node.next:\n            heapq.heappush(min_heap, (node.next.val, list_idx, node.next))\n    \n    return dummy.next"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public ListNode mergeKLists(ListNode[] lists) {\n    PriorityQueue<ListNode> minHeap = new PriorityQueue<>((a, b) -> a.val - b.val);\n    \n    for (ListNode list : lists) {\n        if (list != null) minHeap.offer(list);\n    }\n    \n    ListNode dummy = new ListNode(0);\n    ListNode curr = dummy;\n    \n    while (!minHeap.isEmpty()) {\n        ListNode node = minHeap.poll();\n        curr.next = node;\n        curr = curr.next;\n        \n        if (node.next != null) {\n            minHeap.offer(node.next);\n        }\n    }\n    \n    return dummy.next;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "ListNode* mergeKLists(vector<ListNode*>& lists) {\n    auto cmp = [](pair<int, ListNode*> a, pair<int, ListNode*> b) {\n        return a.first > b.first;\n    };\n    priority_queue<pair<int, ListNode*>, vector<pair<int, ListNode*>>, decltype(cmp)> minHeap(cmp);\n    \n    for (auto list : lists) {\n        if (list) minHeap.push({list->val, list});\n    }\n    \n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    \n    while (!minHeap.empty()) {\n        auto [val, node] = minHeap.top();\n        minHeap.pop();\n        \n        curr->next = node;\n        curr = curr->next;\n        \n        if (node->next) {\n            minHeap.push({node->next->val, node->next});\n        }\n    }\n    \n    return dummy.next;\n}"
          }
        ]
      }
    ],
    "overview": "Merge k sorted linked lists using a min heap to efficiently find the smallest element among list heads.",
    "timeComplexity": "O(N log k)",
    "spaceComplexity": "O(k)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=q5a5OiGbT6Q",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
          "title": "Merge k Sorted Lists"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/merge-two-sorted-lists/",
          "title": "Merge Two Sorted Lists"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
          "title": "Find K Pairs with Smallest Sums"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
          "title": "Kth Smallest Element in a Sorted Matrix"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/the-skyline-problem/",
          "title": "The Skyline Problem"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/last-stone-weight/",
          "title": "Last Stone Weight"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/",
          "title": "Smallest Range Covering Elements from K Lists"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/ugly-number-ii/",
          "title": "Ugly Number II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
          "title": "K Pairs with Smallest Sums (duplicate for heap merging)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/swim-in-rising-water/",
          "title": "Swim in Rising Water"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
          "title": "Merge k Sorted Lists (repeat for clarity)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
          "title": "Find K Pairs with Smallest Sums"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/sort-characters-by-frequency/",
          "title": "Sort Characters By Frequency"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/top-k-frequent-words/",
          "title": "Top K Frequent Words"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "sliding-window-maximum": {
    "id": "sliding-window-maximum",
    "name": "Sliding Window Maximum",
    "title": "Sliding Window Maximum",
    "category": "Heap / Priority Queue",
    "explanation": {
      "problemStatement": "Find max in each window",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Maintain deque of indices in decreasing order of values",
        "Remove indices outside current window",
        "Remove smaller elements from back",
        "Add current index",
        "Front of deque is maximum for window"
      ],
      "useCase": "Stock price analysis, real-time data monitoring, streaming max queries.",
      "tips": [
        "Monotonic deque pattern",
        "O(n) time complexity",
        "Store indices, not values",
        "Front always has maximum"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function maxSlidingWindow(nums: number[], k: number): number[] {\n  const result: number[] = [];\n  const deque: number[] = [];\n  \n  for (let i = 0; i < nums.length; i++) {\n    // Remove indices outside window\n    while (deque.length && deque[0] < i - k + 1) {\n      deque.shift();\n    }\n    \n    // Remove smaller elements\n    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {\n      deque.pop();\n    }\n    \n    deque.push(i);\n    \n    if (i >= k - 1) {\n      result.push(nums[deque[0]]);\n    }\n  }\n  \n  return result;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "from collections import deque\n\ndef max_sliding_window(nums, k):\n    result = []\n    dq = deque()\n    \n    for i in range(len(nums)):\n        # Remove indices outside window\n        while dq and dq[0] < i - k + 1:\n            dq.popleft()\n        \n        # Remove smaller elements\n        while dq and nums[dq[-1]] < nums[i]:\n            dq.pop()\n        \n        dq.append(i)\n        \n        if i >= k - 1:\n            result.append(nums[dq[0]])\n    \n    return result"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public int[] maxSlidingWindow(int[] nums, int k) {\n    int n = nums.length;\n    int[] result = new int[n - k + 1];\n    Deque<Integer> deque = new LinkedList<>();\n    \n    for (int i = 0; i < n; i++) {\n        // Remove indices outside window\n        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {\n            deque.pollFirst();\n        }\n        \n        // Remove smaller elements\n        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {\n            deque.pollLast();\n        }\n        \n        deque.offerLast(i);\n        \n        if (i >= k - 1) {\n            result[i - k + 1] = nums[deque.peekFirst()];\n        }\n    }\n    \n    return result;\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    vector<int> result;\n    deque<int> dq;\n    \n    for (int i = 0; i < nums.size(); i++) {\n        // Remove indices outside window\n        while (!dq.empty() && dq.front() < i - k + 1) {\n            dq.pop_front();\n        }\n        \n        // Remove smaller elements\n        while (!dq.empty() && nums[dq.back()] < nums[i]) {\n            dq.pop_back();\n        }\n        \n        dq.push_back(i);\n        \n        if (i >= k - 1) {\n            result.push_back(nums[dq.front()]);\n        }\n    }\n    \n    return result;\n}"
          }
        ]
      }
    ],
    "overview": "Find maximum in each sliding window of size k using a monotonic decreasing deque.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(k)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=DfljaUwZsOk",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sliding-window-maximum/",
          "title": "Sliding Window Maximum"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sliding-window-median/",
          "title": "Sliding Window Median"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
          "title": "Find All Anagrams in a String"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/permutation-in-string/",
          "title": "Permutation in String"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
          "title": "Longest Substring Without Repeating Characters"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-window-substring/",
          "title": "Minimum Window Substring"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/find-median-from-data-stream/",
          "title": "Find Median from Data Stream"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/max-consecutive-ones-iii/",
          "title": "Max Consecutive Ones III"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-repeating-character-replacement/",
          "title": "Longest Repeating Character Replacement"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/maximum-average-subarray-i/",
          "title": "Maximum Average Subarray I"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/",
          "title": "Maximum Number of Vowels in a Substring of Given Length"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-amount-of-time-to-collect-garbage/",
          "title": "Minimum Amount of Time to Collect Garbage"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/",
          "title": "Number of Substrings Containing All Three Characters"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/binary-subarrays-with-sum/",
          "title": "Binary Subarrays With Sum"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "gcd-euclidean": {
    "id": "gcd-euclidean",
    "name": "GCD (Euclidean)",
    "title": "GCD (Euclidean)",
    "category": "Math & Number Theory",
    "explanation": {
      "problemStatement": "Euclid's algorithm for GCD",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [],
    "difficulty": "easy",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(log(min(a,b)))",
    "spaceComplexity": "O(1)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/greatest-common-divisor-of-strings/",
          "title": "Greatest Common Divisor of Strings"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-greatest-common-divisor-of-array/",
          "title": "Find Greatest Common Divisor of Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/check-if-it-is-a-good-array/",
          "title": "Check If It Is a Good Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-number-of-operations-to-make-all-array-elements-equal-to-1/",
          "title": "Minimum Number of Operations to Make All Array Elements Equal to 1"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/gcd-sort-of-an-array/",
          "title": "GCD Sort of an Array"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/snapshot-array/",
          "title": "Snapshot Array (related arithmetic / structure practice)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/rearrange-array-elements-by-sign/",
          "title": "Rearrange Array Elements by Sign (related practice)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-k-beauty-of-a-number/",
          "title": "Find the K-Beauty of a Number (related divisibility practice)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/",
          "title": "Maximum Size Subarray Sum Equals k (related number-theory practice)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/",
          "title": "Check if One String Swap Can Make Strings Equal (auxiliary string/number practice)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "sieve-eratosthenes": {
    "id": "sieve-eratosthenes",
    "name": "Sieve of Eratosthenes",
    "title": "Sieve of Eratosthenes",
    "category": "Math & Number Theory",
    "explanation": {
      "problemStatement": "Generate all primes up to n",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Create boolean array of size n+1, all true",
        "Mark 0 and 1 as not prime",
        "For each number i from 2 to √n",
        "If i is prime, mark all multiples as not prime",
        "Start from i² (smaller multiples already marked)",
        "Collect all unmarked numbers"
      ],
      "useCase": "Prime generation, number theory, cryptography, mathematical problems.",
      "tips": [
        "O(n log log n) time",
        "O(n) space",
        "Start marking from i²",
        "Only iterate up to √n"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function sieveOfEratosthenes(n: number): number[] {\n  const isPrime = new Array(n + 1).fill(true);\n  isPrime[0] = isPrime[1] = false;\n\n  for (let i = 2; i * i <= n; i++) {\n    if (isPrime[i]) {\n      for (let j = i * i; j <= n; j += i) {\n        isPrime[j] = false;\n      }\n    }\n  }\n\n  const primes: number[] = [];\n  for (let i = 2; i <= n; i++) {\n    if (isPrime[i]) primes.push(i);\n  }\n\n  return primes;\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def sieve_of_eratosthenes(n: int) -> List[int]:\nis_prime = [True] * (n + 1)\nis_prime[0] = is_prime[1] = False\n\nfor i in range(2, int(n ** 0.5) + 1):\n  if is_prime[i]:\n    for j in range(i * i, n + 1, i):\n      is_prime[j] = False\n\nreturn [i for i in range(2, n + 1) if is_prime[i]]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public List < Integer > sieveOfEratosthenes(int n) {\n  boolean[] isPrime = new boolean[n + 1];\n  Arrays.fill(isPrime, true);\n  isPrime[0] = isPrime[1] = false;\n\n  for (int i = 2; i * i <= n; i++) {\n    if (isPrime[i]) {\n      for (int j = i * i; j <= n; j += i) {\n        isPrime[j] = false;\n      }\n    }\n  }\n\n  List < Integer > primes = new ArrayList<>();\n  for (int i = 2; i <= n; i++) {\n    if (isPrime[i]) primes.add(i);\n  }\n\n  return primes;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "vector < int > sieveOfEratosthenes(int n) {\n  vector < bool > isPrime(n + 1, true);\n  isPrime[0] = isPrime[1] = false;\n\n  for (int i = 2; i * i <= n; i++) {\n    if (isPrime[i]) {\n      for (int j = i * i; j <= n; j += i) {\n        isPrime[j] = false;\n      }\n    }\n  }\n\n  vector < int > primes;\n  for (int i = 2; i <= n; i++) {\n    if (isPrime[i]) primes.push_back(i);\n  }\n\n  return primes;\n} "
          }
        ]
      }
    ],
    "overview": "Ancient algorithm to find all prime numbers up to n by iteratively marking multiples of primes as composite.",
    "timeComplexity": "O(n log log n)",
    "spaceComplexity": "O(n)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/count-primes/",
          "title": "Count Primes"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends/",
          "title": "Minimum Length of String After Deleting Similar Ends (auxiliary)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/check-whether-two-strings-are-almost-equivalent/",
          "title": "Check Whether Two Strings are Almost Equivalent (auxiliary)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/numbers-at-most-n-given-digit-set/",
          "title": "Numbers At Most N Given Digit Set (related counting)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/power-of-three/",
          "title": "Power of Three"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/ugly-number/",
          "title": "Ugly Number (factors practice)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/dice-roll-simulation/",
          "title": "Dice Roll Simulation (related counting practice)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "modular-exponentiation": {
    "id": "modular-exponentiation",
    "name": "Modular Exponentiation",
    "title": "Modular Exponentiation",
    "category": "Math & Number Theory",
    "explanation": {
      "problemStatement": "Fast power with modulo",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/powx-n/",
          "title": "Pow(x, n)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/super-pow/",
          "title": "Super Pow"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/increasing-order-search-tree/",
          "title": "Increasing Order Search Tree (auxiliary)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/largest-perimeter-triangle/",
          "title": "Largest Perimeter Triangle (auxiliary)"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/",
          "title": "Maximum Length of a Concatenated String with Unique Characters (auxiliary)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/interval-list-intersections/",
          "title": "Interval List Intersections (auxiliary)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "karatsuba": {
    "id": "karatsuba",
    "name": "Karatsuba Multiplication",
    "title": "Karatsuba Multiplication",
    "category": "Math & Number Theory",
    "explanation": {
      "problemStatement": "Fast multiplication algorithm",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Split each number into two halves: x = a*10^m + b, y = c*10^m + d",
        "Compute three products: ac, bd, and (a+b)(c+d)",
        "Calculate middle term: adbc = (a+b)(c+d) - ac - bd",
        "Combine results: ac*10^(2m) + adbc*10^m + bd",
        "Base case: multiply directly when numbers are single digits"
      ],
      "useCase": "Efficient multiplication of large numbers, cryptography, polynomial multiplication, FFT-based algorithms.",
      "tips": [
        "Time complexity: O(n^1.585) vs O(n^2) for traditional",
        "Requires only 3 recursive calls instead of 4",
        "Trade-off: more additions but fewer multiplications",
        "Works well with BigInt for very large numbers"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function karatsuba(x: bigint, y: bigint): bigint {\n  // Base case\n  if (x < 10n || y < 10n) {\n    return x * y;\n  }\n  \n  // Calculate size and split point\n  const n = Math.max(x.toString().length, y.toString().length);\n  const m = Math.floor(n / 2);\n  const power = 10n ** BigInt(m);\n  \n  // Split numbers: x = a*10^m + b, y = c*10^m + d\n  const a = x / power;\n  const b = x % power;\n  const c = y / power;\n  const d = y % power;\n  \n  // Three recursive multiplications\n  const ac = karatsuba(a, c);\n  const bd = karatsuba(b, d);\n  const adbc = karatsuba(a + b, c + d) - ac - bd;\n  \n  // Combine results: ac*10^(2m) + adbc*10^m + bd\n  return ac * (10n ** BigInt(2 * m)) + adbc * power + bd;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def karatsuba(x: int, y: int) -> int:\n    # Base case\n    if x < 10 or y < 10:\n        return x * y\n    \n    # Calculate size and split point\n    n = max(len(str(x)), len(str(y)))\n    m = n // 2\n    power = 10 ** m\n    \n    # Split numbers\n    a, b = divmod(x, power)\n    c, d = divmod(y, power)\n    \n    # Three recursive multiplications\n    ac = karatsuba(a, c)\n    bd = karatsuba(b, d)\n    adbc = karatsuba(a + b, c + d) - ac - bd\n    \n    # Combine results\n    return ac * (10 ** (2 * m)) + adbc * power + bd"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public class Solution {\n    public long karatsuba(long x, long y) {\n        // Base case\n        if (x < 10 || y < 10) {\n            return x * y;\n        }\n        \n        // Calculate size and split point\n        int n = Math.max(String.valueOf(x).length(), String.valueOf(y).length());\n        int m = n / 2;\n        long power = (long) Math.pow(10, m);\n        \n        // Split numbers\n        long a = x / power;\n        long b = x % power;\n        long c = y / power;\n        long d = y % power;\n        \n        // Three recursive multiplications\n        long ac = karatsuba(a, c);\n        long bd = karatsuba(b, d);\n        long adbc = karatsuba(a + b, c + d) - ac - bd;\n        \n        // Combine results\n        long power2m = power * power;\n        return ac * power2m + adbc * power + bd;\n    }\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "#include <string>\n#include <algorithm>\nusing namespace std;\n\nlong long karatsuba(long long x, long long y) {\n    // Base case\n    if (x < 10 || y < 10) {\n        return x * y;\n    }\n    \n    // Calculate size and split point\n    int n = max(to_string(x).length(), to_string(y).length());\n    int m = n / 2;\n    long long power = 1;\n    for (int i = 0; i < m; i++) power *= 10;\n    \n    // Split numbers\n    long long a = x / power;\n    long long b = x % power;\n    long long c = y / power;\n    long long d = y % power;\n    \n    // Three recursive multiplications\n    long long ac = karatsuba(a, c);\n    long long bd = karatsuba(b, d);\n    long long adbc = karatsuba(a + b, c + d) - ac - bd;\n    \n    // Combine results\n    long long power2m = power * power;\n    return ac * power2m + adbc * power + bd;\n}"
          }
        ]
      }
    ],
    "overview": "Karatsuba multiplication is a divide-and-conquer algorithm that multiplies two numbers faster than traditional long multiplication by reducing the number of recursive multiplications from 4 to 3.",
    "timeComplexity": "O(n^1.58)",
    "spaceComplexity": "O(n)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/multiply-strings/",
          "title": "Multiply Strings"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/add-two-numbers/",
          "title": "Add Two Numbers"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/add-binary/",
          "title": "Add Binary"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/factorial-trailing-zeroes/",
          "title": "Factorial Trailing Zeroes (number-theory practice)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/department-top-three-salaries/",
          "title": "Department Top Three Salaries (auxiliary)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/multiply-strings/",
          "title": "Multiply Strings (duplicate)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "segment-tree": {
    "id": "segment-tree",
    "name": "Segment Tree",
    "title": "Segment Tree",
    "category": "Advanced",
    "explanation": {
      "problemStatement": "Range query data structure",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Build tree recursively from array",
        "Each node stores aggregate (sum/min/max) of range",
        "Query: combine results from relevant nodes",
        "Update: modify leaf and propagate to root",
        "Tree has 4n nodes for n elements",
        "Supports range queries and point updates"
      ],
      "useCase": "Range sum/min/max queries, dynamic array operations, competitive programming.",
      "tips": [
        "O(log n) query and update",
        "O(n) build time",
        "Needs 4n space",
        "Can handle various aggregate functions"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "class SegmentTree {\n  tree: number[];\n  n: number;\n\n  constructor(arr: number[]) {\n    this.n = arr.length;\n    this.tree = new Array(4 * this.n).fill(0);\n    this.build(arr, 0, 0, this.n - 1);\n  }\n\n  build(arr: number[], node: number, start: number, end: number): void {\n    if (start === end) {\n      this.tree[node] = arr[start];\n      return;\n    }\n\n    const mid = Math.floor((start + end) / 2);\n    this.build(arr, 2 * node + 1, start, mid);\n    this.build(arr, 2 * node + 2, mid + 1, end);\n    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];\n  }\n\n  query(l: number, r: number): number {\n    return this.queryHelper(0, 0, this.n - 1, l, r);\n  }\n\n  queryHelper(node: number, start: number, end: number, l: number, r: number): number {\n    if (r < start || l > end) return 0;\n    if (l <= start && end <= r) return this.tree[node];\n\n    const mid = Math.floor((start + end) / 2);\n    return this.queryHelper(2 * node + 1, start, mid, l, r) +\n      this.queryHelper(2 * node + 2, mid + 1, end, l, r);\n  }\n\n  update(idx: number, val: number): void {\n    this.updateHelper(0, 0, this.n - 1, idx, val);\n  }\n\n  updateHelper(node: number, start: number, end: number, idx: number, val: number): void {\n    if (start === end) {\n      this.tree[node] = val;\n      return;\n    }\n\n    const mid = Math.floor((start + end) / 2);\n    if (idx <= mid) {\n      this.updateHelper(2 * node + 1, start, mid, idx, val);\n    } else {\n      this.updateHelper(2 * node + 2, mid + 1, end, idx, val);\n    }\n    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];\n  }\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "class SegmentTree:\n    def __init__(self, arr: List[int]):\nself.n = len(arr)\nself.tree = [0] * (4 * self.n)\nself.build(arr, 0, 0, self.n - 1)\n    \n    def build(self, arr: List[int], node: int, start: int, end: int):\nif start == end:\n  self.tree[node] = arr[start]\nreturn\n\nmid = (start + end) // 2\nself.build(arr, 2 * node + 1, start, mid)\nself.build(arr, 2 * node + 2, mid + 1, end)\nself.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]\n    \n    def query(self, l: int, r: int) -> int:\nreturn self._query_helper(0, 0, self.n - 1, l, r)\n    \n    def _query_helper(self, node: int, start: int, end: int, l: int, r: int) -> int:\nif r < start or l > end:\nreturn 0\nif l <= start and end <= r:\nreturn self.tree[node]\n\nmid = (start + end) // 2\nreturn (self._query_helper(2 * node + 1, start, mid, l, r) +\n  self._query_helper(2 * node + 2, mid + 1, end, l, r))\n    \n    def update(self, idx: int, val: int):\nself._update_helper(0, 0, self.n - 1, idx, val)\n    \n    def _update_helper(self, node: int, start: int, end: int, idx: int, val: int):\nif start == end:\n  self.tree[node] = val\nreturn\n\nmid = (start + end) // 2\nif idx <= mid:\n  self._update_helper(2 * node + 1, start, mid, idx, val)\nelse:\nself._update_helper(2 * node + 2, mid + 1, end, idx, val)\nself.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "class SegmentTree {\n    int[] tree;\n    int n;\n\n  public SegmentTree(int[] arr) {\n    n = arr.length;\n    tree = new int[4 * n];\n    build(arr, 0, 0, n - 1);\n  }\n\n  private void build(int[] arr, int node, int start, int end) {\n    if (start == end) {\n      tree[node] = arr[start];\n      return;\n    }\n        \n        int mid = (start + end) / 2;\n    build(arr, 2 * node + 1, start, mid);\n    build(arr, 2 * node + 2, mid + 1, end);\n    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];\n  }\n\n  public int query(int l, int r) {\n    return queryHelper(0, 0, n - 1, l, r);\n  }\n\n  private int queryHelper(int node, int start, int end, int l, int r) {\n    if (r < start || l > end) return 0;\n    if (l <= start && end <= r) return tree[node];\n        \n        int mid = (start + end) / 2;\n    return queryHelper(2 * node + 1, start, mid, l, r) +\n      queryHelper(2 * node + 2, mid + 1, end, l, r);\n  }\n\n  public void update(int idx, int val) {\n    updateHelper(0, 0, n - 1, idx, val);\n  }\n\n  private void updateHelper(int node, int start, int end, int idx, int val) {\n    if (start == end) {\n      tree[node] = val;\n      return;\n    }\n        \n        int mid = (start + end) / 2;\n    if (idx <= mid) {\n      updateHelper(2 * node + 1, start, mid, idx, val);\n    } else {\n      updateHelper(2 * node + 2, mid + 1, end, idx, val);\n    }\n    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "class SegmentTree {\n  vector<int> tree;\n    int n;\n    \n    void build(vector<int> & arr, int node, int start, int end) {\n  if (start == end) {\n    tree[node] = arr[start];\n    return;\n  }\n        \n        int mid = (start + end) / 2;\n  build(arr, 2 * node + 1, start, mid);\n  build(arr, 2 * node + 2, mid + 1, end);\n  tree[node] = tree[2 * node + 1] + tree[2 * node + 2];\n}\n    \n    int queryHelper(int node, int start, int end, int l, int r) {\n  if (r < start || l > end) return 0;\n  if (l <= start && end <= r) return tree[node];\n        \n        int mid = (start + end) / 2;\n  return queryHelper(2 * node + 1, start, mid, l, r) +\n    queryHelper(2 * node + 2, mid + 1, end, l, r);\n}\n\nvoid updateHelper(int node, int start, int end, int idx, int val) {\n  if (start == end) {\n    tree[node] = val;\n    return;\n  }\n        \n        int mid = (start + end) / 2;\n  if (idx <= mid) {\n    updateHelper(2 * node + 1, start, mid, idx, val);\n  } else {\n    updateHelper(2 * node + 2, mid + 1, end, idx, val);\n  }\n  tree[node] = tree[2 * node + 1] + tree[2 * node + 2];\n}\n\npublic:\nSegmentTree(vector<int> & arr) {\n  n = arr.size();\n  tree.resize(4 * n);\n  build(arr, 0, 0, n - 1);\n}\n    \n    int query(int l, int r) {\n  return queryHelper(0, 0, n - 1, l, r);\n}\n\nvoid update(int idx, int val) {\n  updateHelper(0, 0, n - 1, idx, val);\n}\n}; "
          }
        ]
      }
    ],
    "overview": "Tree data structure for efficient range queries and updates in O(log n) time.",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(n)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/range-sum-query-mutable/",
          "title": "Range Sum Query - Mutable"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/range-sum-query-2d-mutable/",
          "title": "Range Sum Query 2D - Mutable"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
          "title": "Kth Largest Element in an Array"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/falling-squares/",
          "title": "Falling Squares"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/count-of-range-sum/",
          "title": "Count of Range Sum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/special-positions-in-a-binary-matrix/",
          "title": "Special Positions in a Binary Matrix"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
          "title": "Count of Smaller Numbers After Self"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/",
          "title": "Max Sum of Rectangle No Larger Than K (related range queries)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "fenwick-tree": {
    "id": "fenwick-tree",
    "name": "Fenwick Tree (BIT)",
    "title": "Fenwick Tree (BIT)",
    "category": "Advanced",
    "explanation": {
      "problemStatement": "Binary indexed tree for prefix sums",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(n)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
          "title": "Count of Smaller Numbers After Self"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/range-sum-query-mutable/",
          "title": "Range Sum Query - Mutable"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/count-of-range-sum/",
          "title": "Count of Range Sum"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "sparse-table": {
    "id": "sparse-table",
    "name": "Sparse Table",
    "title": "Sparse Table",
    "category": "Advanced",
    "explanation": {
      "problemStatement": "Range minimum query in O(1)",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Build table with 2^j length ranges",
        "st[i][j] = min of range [i, i+2^j)",
        "For each power of 2, combine smaller ranges",
        "Query: find k where 2^k fits in range",
        "Return min of two overlapping 2^k ranges",
        "Works for idempotent operations (min/max/gcd)"
      ],
      "useCase": "Static RMQ problems, range queries without updates, competitive programming.",
      "tips": [
        "O(1) query time",
        "O(n log n) preprocessing",
        "Only for immutable arrays",
        "Works for overlap-friendly operations"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function solveSparseTable(arr: number[], flatQueries: number[]): number[] {\n  const queries: number[][] = [];\n  for (let i = 0; i < flatQueries.length; i += 2) {\n    queries.push([flatQueries[i], flatQueries[i + 1]]);\n  }\n  const st = new SparseTable(arr);\n  return queries.map(([l, r]) => st.query(l, r));\n}\n\nclass SparseTable {\n  st: number[][];\n  n: number;\n\n  constructor(arr: number[]) {\n    this.n = arr.length;\n    const maxLog = Math.floor(Math.log2(this.n)) + 1;\n    this.st = Array(this.n).fill(0).map(() => Array(maxLog).fill(0));\n\n    for (let i = 0; i < this.n; i++) {\n      this.st[i][0] = arr[i];\n    }\n\n    for (let j = 1; j < maxLog; j++) {\n      for (let i = 0; i + (1 << j) <= this.n; i++) {\n        this.st[i][j] = Math.min(this.st[i][j - 1], this.st[i + (1 << (j - 1))][j - 1]);\n      }\n    }\n  }\n\n  query(l: number, r: number): number {\n    const len = r - l + 1;\n    const k = Math.floor(Math.log2(len));\n    return Math.min(this.st[l][k], this.st[r - (1 << k) + 1][k]);\n  }\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "import math\n\ndef solve_sparse_table(arr: List[int], flat_queries: List[int]) -> List[int]:\nqueries = []\nfor i in range(0, len(flat_queries), 2):\n  queries.append((flat_queries[i], flat_queries[i + 1]))\n\nst = SparseTable(arr)\nreturn [st.query(l, r) for l, r in queries]\n\nclass SparseTable:\n    def __init__(self, arr: List[int]):\nself.n = len(arr)\nmax_log = math.floor(math.log2(self.n)) + 1\nself.st = [[0] * max_log for _ in range(self.n)]\n\nfor i in range(self.n):\n  self.st[i][0] = arr[i]\n\nfor j in range(1, max_log):\n  i = 0\nwhile i + (1 << j) <= self.n:\n  self.st[i][j] = min(self.st[i][j - 1],\n    self.st[i + (1 << (j - 1))][j - 1])\ni += 1\n    \n    def query(self, l: int, r: int) -> int:\nlength = r - l + 1\nk = math.floor(math.log2(length))\nreturn min(self.st[l][k], self.st[r - (1 << k) + 1][k])"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "import java.util.*;\n\nclass SparseTable {\n    int[][] st;\n    int n;\n\n  public SparseTable(int[] arr) {\n    n = arr.length;\n        int maxLog = (int)Math.floor(Math.log(n) / Math.log(2)) + 1;\n    st = new int[n][maxLog];\n\n    for (int i = 0; i < n; i++) {\n      st[i][0] = arr[i];\n    }\n\n    for (int j = 1; j < maxLog; j++) {\n      for (int i = 0; i + (1 << j) <= n; i++) {\n        st[i][j] = Math.min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);\n      }\n    }\n  }\n\n  public int query(int l, int r) {\n        int len = r - l + 1;\n        int k = (int)Math.floor(Math.log(len) / Math.log(2));\n    return Math.min(st[l][k], st[r - (1 << k) + 1][k]);\n  }\n}\n\npublic List < Integer > solveSparseTable(int[] arr, int[] flatQueries) {\n    SparseTable st = new SparseTable(arr);\n  List < Integer > result = new ArrayList<>();\n  for (int i = 0; i < flatQueries.length; i += 2) {\n    result.add(st.query(flatQueries[i], flatQueries[i + 1]));\n  }\n  return result;\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "class SparseTable {\n  vector<vector<int>> st;\n    int n;\n\npublic:\nSparseTable(vector<int> & arr) {\n  n = arr.size();\n        int maxLog = floor(log2(n)) + 1;\n  st.assign(n, vector<int>(maxLog));\n\n  for (int i = 0; i < n; i++) {\n    st[i][0] = arr[i];\n  }\n\n  for (int j = 1; j < maxLog; j++) {\n    for (int i = 0; i + (1 << j) <= n; i++) {\n      st[i][j] = min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);\n    }\n  }\n}\n    \n    int query(int l, int r) {\n        int len = r - l + 1;\n        int k = floor(log2(len));\n  return min(st[l][k], st[r - (1 << k) + 1][k]);\n}\n};\n\nvector < int > solveSparseTable(vector<int> & arr, vector<int> & flatQueries) {\n    SparseTable st(arr);\n  vector < int > result;\n  for (size_t i = 0; i < flatQueries.size(); i += 2) {\n    result.push_back(st.query(flatQueries[i], flatQueries[i + 1]));\n  }\n  return result;\n} "
          }
        ]
      }
    ],
    "overview": "Data structure for O(1) range minimum/maximum queries with O(n log n) preprocessing.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(n log n)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/sliding-window-maximum/",
          "title": "Sliding Window Maximum"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/search-a-2d-matrix-ii/",
          "title": "Search a 2D Matrix II"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/implement-stack-using-queues/",
          "title": "Implement Stack using Queues"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/contains-duplicate-iii/",
          "title": "Contains Duplicate III"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [
      {
        "name": "arr",
        "type": "number[]",
        "label": "Array"
      },
      {
        "name": "flatQueries",
        "type": "number[]",
        "label": "Queries (L1, R1, L2, R2...)"
      }
    ],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "kmp": {
    "id": "kmp",
    "name": "KMP String Matching",
    "title": "KMP String Matching",
    "category": "Advanced",
    "explanation": {
      "problemStatement": "Linear time pattern matching",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n+m)",
    "spaceComplexity": "O(m)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
          "title": "Find the Index of the First Occurrence in a String"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/shortest-palindrome/",
          "title": "Shortest Palindrome"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/repeated-substring-pattern/",
          "title": "Repeated Substring Pattern"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
          "title": "Letter Combinations of a Phone Number"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/repeated-string-match/",
          "title": "Repeated String Match (related matching)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
          "title": "strStr() (duplicate)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "rabin-karp": {
    "id": "rabin-karp",
    "name": "Rabin-Karp",
    "title": "Rabin-Karp",
    "category": "Advanced",
    "explanation": {
      "problemStatement": "Rolling hash pattern matching",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n+m)",
    "spaceComplexity": "O(1)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/repeated-dna-sequences/",
          "title": "Repeated DNA Sequences"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
          "title": "Find the Index of the First Occurrence in a String"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
          "title": "Design Add and Search Words Data Structure"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/repeated-substring-pattern/",
          "title": "Repeated Substring Pattern"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-window-subsequence/",
          "title": "Minimum Window Subsequence"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/shortest-palindrome/",
          "title": "Shortest Palindrome"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "manachers": {
    "id": "manachers",
    "name": "Manacher's Algorithm",
    "title": "Manacher's Algorithm",
    "category": "Advanced",
    "explanation": {
      "problemStatement": "Longest palindromic substring",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Transform string by inserting '#' between characters to handle even/odd lengths uniformly",
        "For each position, track the radius of palindrome centered at that position",
        "Use mirror property: if i is within a known palindrome, use mirror's radius as starting point",
        "Expand around each center only when necessary",
        "Update rightmost boundary and center as we find larger palindromes",
        "Extract the longest palindrome found"
      ],
      "useCase": "Finding longest palindromic substring, palindrome-related string problems, competitive programming.",
      "tips": [
        "Time complexity: O(n) - each character expanded at most once",
        "Space complexity: O(n) for transformed string and radius array",
        "Key insight: avoid redundant comparisons using symmetry",
        "Works for both even and odd length palindromes"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function manacher(s: string): string {\n  // Transform string: \"abc\" -> \"#a#b#c#\"\n  const t = '#' + s.split('').join('#') + '#';\n  const n = t.length;\n  const p = Array(n).fill(0); // p[i] = radius of palindrome centered at i\n  let center = 0, right = 0;\n  let maxLen = 0, maxCenter = 0;\n\n  for (let i = 0; i < n; i++) {\n    // Use previously computed values\n    if (i < right) {\n      const mirror = 2 * center - i;\n      p[i] = Math.min(right - i, p[mirror]);\n    }\n\n    // Expand around center i\n    while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n &&\n      t[i - p[i] - 1] === t[i + p[i] + 1]) {\n      p[i]++;\n    }\n\n    // Update center and right boundary\n    if (i + p[i] > right) {\n      center = i;\n      right = i + p[i];\n    }\n\n    // Track longest palindrome\n    if (p[i] > maxLen) {\n      maxLen = p[i];\n      maxCenter = i;\n    }\n  }\n\n  // Extract longest palindrome from original string\n  const start = Math.floor((maxCenter - maxLen) / 2);\n  return s.substring(start, start + maxLen);\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def manacher(s: str) -> str:\n    # Transform string: \"abc\" -> \"#a#b#c#\"\nt = '#' + '#'.join(s) + '#'\nn = len(t)\np = [0] * n  # p[i] = radius of palindrome centered at i\ncenter = right = 0\nmax_len = max_center = 0\n\nfor i in range(n):\n        # Use previously computed values\nif i < right:\n  mirror = 2 * center - i\np[i] = min(right - i, p[mirror])\n        \n        # Expand around center i\nwhile (i - p[i] - 1 >= 0 and i + p[i] + 1 < n and\nt[i - p[i] - 1] == t[i + p[i] + 1]):\np[i] += 1\n        \n        # Update center and right boundary\nif i + p[i] > right:\n  center = i\nright = i + p[i]\n        \n        # Track longest palindrome\nif p[i] > max_len:\n  max_len = p[i]\nmax_center = i\n    \n    # Extract longest palindrome from original string\nstart = (max_center - max_len) // 2\nreturn s[start: start + max_len]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "public class Solution {\n  public String manacher(String s) {\n        // Transform string\n        StringBuilder t = new StringBuilder(\"#\");\n    for (char c : s.toCharArray()) {\n      t.append(c).append('#');\n    }\n        \n        int n = t.length();\n    int[] p = new int[n];\n        int center = 0, right = 0;\n        int maxLen = 0, maxCenter = 0;\n\n    for (int i = 0; i < n; i++) {\n      // Use previously computed values\n      if (i < right) {\n                int mirror = 2 * center - i;\n        p[i] = Math.min(right - i, p[mirror]);\n      }\n\n      // Expand around center i\n      while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n &&\n        t.charAt(i - p[i] - 1) == t.charAt(i + p[i] + 1)) {\n        p[i]++;\n      }\n\n      // Update center and right boundary\n      if (i + p[i] > right) {\n        center = i;\n        right = i + p[i];\n      }\n\n      // Track longest palindrome\n      if (p[i] > maxLen) {\n        maxLen = p[i];\n        maxCenter = i;\n      }\n    }\n\n        // Extract longest palindrome\n        int start = (maxCenter - maxLen) / 2;\n    return s.substring(start, start + maxLen);\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "#include <string>\n#include <vector>\nusing namespace std;\n\nstring manacher(string s) {\n    // Transform string\n    string t = \"#\";\n  for (char c : s) {\n    t += c;\n    t += '#';\n  }\n    \n    int n = t.length();\n  vector < int > p(n, 0);\n    int center = 0, right = 0;\n    int maxLen = 0, maxCenter = 0;\n\n  for (int i = 0; i < n; i++) {\n    // Use previously computed values\n    if (i < right) {\n            int mirror = 2 * center - i;\n      p[i] = min(right - i, p[mirror]);\n    }\n\n    // Expand around center i\n    while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n &&\n      t[i - p[i] - 1] == t[i + p[i] + 1]) {\n      p[i]++;\n    }\n\n    // Update center and right boundary\n    if (i + p[i] > right) {\n      center = i;\n      right = i + p[i];\n    }\n\n    // Track longest palindrome\n    if (p[i] > maxLen) {\n      maxLen = p[i];\n      maxCenter = i;\n    }\n  }\n\n    // Extract longest palindrome\n    int start = (maxCenter - maxLen) / 2;\n  return s.substr(start, maxLen);\n} "
          }
        ]
      }
    ],
    "overview": "Manacher's algorithm finds the longest palindromic substring in linear O(n) time by cleverly reusing previously computed palindrome information.",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/valid-palindrome/",
          "title": "Valid Palindrome"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/longest-palindrome/",
          "title": "Longest Palindrome"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/palindrome-linked-list/",
          "title": "Palindrome Linked List"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/valid-palindrome-ii/",
          "title": "Valid Palindrome II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-palindromic-substring/",
          "title": "Longest Palindromic Substring"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/palindromic-substrings/",
          "title": "Palindromic Substrings"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/palindrome-partitioning/",
          "title": "Palindrome Partitioning"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/palindrome-partitioning-ii/",
          "title": "Palindrome Partitioning II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/shortest-palindrome/",
          "title": "Shortest Palindrome"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/palindrome-pairs/",
          "title": "Palindrome Pairs"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/knight-probability-in-chessboard/",
          "title": "Knight Probability in Chessboard (string/DP related practice)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "union-by-rank": {
    "id": "union-by-rank",
    "name": "Union by Rank + Path Compression",
    "title": "Union by Rank + Path Compression",
    "category": "Advanced",
    "explanation": {
      "problemStatement": "Optimized union-find",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(α(n))",
    "spaceComplexity": "O(n)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/find-the-town-judge/",
          "title": "Find the Town Judge"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-provinces/",
          "title": "Number of Provinces"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
          "title": "Number of Connected Components in an Undirected Graph"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/redundant-connection/",
          "title": "Redundant Connection"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/accounts-merge/",
          "title": "Accounts Merge"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/satisfiability-of-equality-equations/",
          "title": "Satisfiability of Equality Equations"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/number-of-islands-ii/",
          "title": "Number of Islands II"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
          "title": "Min Cost to Connect All Points"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/connecting-cities-with-minimum-cost/",
          "title": "Connecting Cities With Minimum Cost"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/bus-routes/",
          "title": "Bus Routes"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "tarjans": {
    "id": "tarjans",
    "name": "Tarjan's Algorithm",
    "title": "Tarjan's Algorithm",
    "category": "Advanced",
    "explanation": {
      "problemStatement": "Find strongly connected components",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Perform DFS and assign discovery time (disc) and low-link value (low) to each node",
        "Maintain a stack of visited nodes and track which nodes are on stack",
        "For each neighbor: if unvisited, recurse; if on stack, update low value",
        "When low[u] == disc[u], u is a root of an SCC",
        "Pop stack until u is found to extract the complete SCC",
        "Repeat for all unvisited nodes"
      ],
      "useCase": "Finding strongly connected components, detecting cycles in directed graphs, compiler optimization, analyzing social networks.",
      "tips": [
        "Time complexity: O(V + E)",
        "Space complexity: O(V)",
        "Single pass DFS is more efficient than Kosaraju's",
        "Low-link values track earliest reachable ancestor"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "function tarjanSCC(graph: number[][]): number[][] {\n  const n = graph.length;\n  const disc = Array(n).fill(-1);\n  const low = Array(n).fill(-1);\n      const onStack = Array(n).fill(false);\n      const stack: number[] = [];\n      const sccs: number[][] = [];\n      let time = 0;\n\n      function dfs(u: number) {\n        disc[u] = low[u] = time++;\nstack.push(u);\nonStack[u] = true;\n\nfor (const v of graph[u]) {\n  if (disc[v] === -1) {\n    dfs(v);\n    low[u] = Math.min(low[u], low[v]);\n  } else if (onStack[v]) {\n    low[u] = Math.min(low[u], disc[v]);\n  }\n}\n\n// If u is a root node, pop the stack to find SCC\nif (low[u] === disc[u]) {\n  const scc: number[] = [];\n  let w: number;\n  do {\n    w = stack.pop()!;\n    onStack[w] = false;\n    scc.push(w);\n  } while (w !== u);\n  sccs.push(scc);\n}\n  }\n\nfor (let i = 0; i < n; i++) {\n  if (disc[i] === -1) {\n    dfs(i);\n  }\n}\n\nreturn sccs;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "def tarjan_scc(graph: list[List[int]]) -> list[List[int]]:\nn = len(graph)\ndisc = [-1] * n\nlow = [-1] * n\non_stack = [False] * n\nstack = []\nsccs = []\ntime = [0]\n    \n    def dfs(u: int):\ndisc[u] = low[u] = time[0]\ntime[0] += 1\nstack.append(u)\non_stack[u] = True\n\nfor v in graph[u]:\n  if disc[v] == -1:\n    dfs(v)\nlow[u] = min(low[u], low[v])\n            elif on_stack[v]:\nlow[u] = min(low[u], disc[v])\n        \n        # If u is a root node, pop the stack\nif low[u] == disc[u]:\n  scc = []\nwhile True:\n  w = stack.pop()\non_stack[w] = False\nscc.append(w)\nif w == u:\n  break\nsccs.append(scc)\n\nfor i in range(n):\n  if disc[i] == -1:\n    dfs(i)\n\nreturn sccs"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "import java.util.*;\n\npublic class Solution {\n  private int time;\n  private int[] disc, low;\n  private boolean[] onStack;\n  private Stack<Integer> stack;\n  private List<List<Integer>> sccs;\n    \n    public List < List < Integer >> tarjanSCC(List < List < Integer >> graph) {\n        int n = graph.size();\n  time = 0;\n  disc = new int[n];\n  low = new int[n];\n  onStack = new boolean[n];\n  stack = new Stack<>();\n  sccs = new ArrayList<>();\n  Arrays.fill(disc, -1);\n  Arrays.fill(low, -1);\n\n  for (int i = 0; i < n; i++) {\n    if (disc[i] == -1) {\n      dfs(i, graph);\n    }\n  }\n\n  return sccs;\n}\n    \n    private void dfs(int u, List < List < Integer >> graph) {\n  disc[u] = low[u] = time++;\n  stack.push(u);\n  onStack[u] = true;\n\n  for (int v : graph.get(u)) {\n    if (disc[v] == -1) {\n      dfs(v, graph);\n      low[u] = Math.min(low[u], low[v]);\n    } else if (onStack[v]) {\n      low[u] = Math.min(low[u], disc[v]);\n    }\n  }\n\n  // If u is a root node\n  if (low[u] == disc[u]) {\n    List < Integer > scc = new ArrayList<>();\n            int w;\n    do {\n      w = stack.pop();\n      onStack[w] = false;\n      scc.add(w);\n    } while (w != u);\n    sccs.add(scc);\n  }\n}\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "#include <vector>\n#include <stack>\nusing namespace std;\n\nclass Solution {\n  private:\n    int time;\n  vector<int> disc, low;\n  vector<bool> onStack;\n  stack<int> st;\n  vector<vector<int>> sccs;\n\nvoid dfs(int u, vector<vector<int>> & graph) {\n  disc[u] = low[u] = time++;\n  st.push(u);\n  onStack[u] = true;\n\n  for (int v : graph[u]) {\n    if (disc[v] == -1) {\n      dfs(v, graph);\n      low[u] = min(low[u], low[v]);\n    } else if (onStack[v]) {\n      low[u] = min(low[u], disc[v]);\n    }\n  }\n\n  // If u is a root node\n  if (low[u] == disc[u]) {\n    vector < int > scc;\n            int w;\n    do {\n      w = st.top();\n      st.pop();\n      onStack[w] = false;\n      scc.push_back(w);\n    } while (w != u);\n    sccs.push_back(scc);\n  }\n}\n\npublic:\nvector < vector < int >> tarjanSCC(vector<vector<int>> & graph) {\n        int n = graph.size();\n  time = 0;\n  disc.assign(n, -1);\n  low.assign(n, -1);\n  onStack.assign(n, false);\n\n  for (int i = 0; i < n; i++) {\n    if (disc[i] == -1) {\n      dfs(i, graph);\n    }\n  }\n\n  return sccs;\n}\n}; "
          }
        ]
      }
    ],
    "overview": "Tarjan's algorithm finds all strongly connected components (SCCs) in a directed graph in linear time using a single DFS traversal with a stack.",
    "timeComplexity": "O(V+E)",
    "spaceComplexity": "O(V)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/course-schedule/",
          "title": "Course Schedule"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/course-schedule-ii/",
          "title": "Course Schedule II"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/critical-connections-in-a-network/",
          "title": "Critical Connections in a Network"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/possible-bipartition/",
          "title": "Possible Bipartition"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/all-paths-from-source-to-target/",
          "title": "All Paths From Source to Target"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/clone-graph/",
          "title": "Clone Graph"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
          "title": "Count of Smaller Numbers After Self"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "binary-lifting": {
    "id": "binary-lifting",
    "name": "Binary Lifting",
    "title": "Binary Lifting",
    "category": "Advanced",
    "explanation": {
      "problemStatement": "LCA using binary lifting",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Precompute up[node][j] = 2^j-th ancestor of node using DFS",
        "up[node][0] = parent, up[node][j] = up[up[node][j-1]][j-1]",
        "For k-th ancestor: decompose k in binary, jump by powers of 2",
        "For LCA: equalize depths, then binary search upward",
        "Time: O(n log n) preprocessing, O(log n) per query"
      ],
      "useCase": "Tree queries, LCA problems, range queries on trees, finding distances in trees.",
      "tips": [
        "Preprocessing: O(n log n) time and space",
        "Query: O(log n) for both k-th ancestor and LCA",
        "Key insight: any number can be represented as sum of powers of 2",
        "Essential for competitive programming tree problems"
      ]
    },
    "companyTags": [],
    "difficulty": "advance",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "class BinaryLifting {\n  private n: number;\n  private LOG: number;\n  private up: number[][];\n  private depth: number[];\n\n  constructor(graph: number[][], root: number = 0) {\n    this.n = graph.length;\n    this.LOG = Math.ceil(Math.log2(this.n)) + 1;\n    this.up = Array.from({ length: this.n }, () => Array(this.LOG).fill(-1));\n    this.depth = Array(this.n).fill(0);\n\n    this.dfs(root, -1, graph);\n  }\n\n  private dfs(node: number, parent: number, graph: number[][]) {\n    this.up[node][0] = parent;\n\n    // Precompute ancestors using binary lifting\n    for (let j = 1; j < this.LOG; j++) {\n      if (this.up[node][j - 1] !== -1) {\n        this.up[node][j] = this.up[this.up[node][j - 1]][j - 1];\n      }\n    }\n\n    for (const child of graph[node]) {\n      if (child !== parent) {\n        this.depth[child] = this.depth[node] + 1;\n        this.dfs(child, node, graph);\n      }\n    }\n  }\n\n  // Find k-th ancestor of node\n  kthAncestor(node: number, k: number): number {\n    for (let j = 0; j < this.LOG; j++) {\n      if ((k & (1 << j)) !== 0) {\n        node = this.up[node][j];\n        if (node === -1) break;\n      }\n    }\n    return node;\n  }\n\n  // Find Lowest Common Ancestor (LCA)\n  lca(u: number, v: number): number {\n    if (this.depth[u] < this.depth[v]) [u, v] = [v, u];\n\n    // Bring u to same depth as v\n    const diff = this.depth[u] - this.depth[v];\n    u = this.kthAncestor(u, diff);\n\n    if (u === v) return u;\n\n    // Binary search for LCA\n    for (let j = this.LOG - 1; j >= 0; j--) {\n      if (this.up[u][j] !== this.up[v][j]) {\n        u = this.up[u][j];\n        v = this.up[v][j];\n      }\n    }\n\n    return this.up[u][0];\n  }\n} "
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "class BinaryLifting:\n    def __init__(self, graph: list[List[int]], root: int = 0):\nself.n = len(graph)\nself.LOG = self.n.bit_length()\nself.up = [[-1] * self.LOG for _ in range(self.n)]\nself.depth = [0] * self.n\n\nself._dfs(root, -1, graph)\n    \n    def _dfs(self, node: int, parent: int, graph: list[List[int]]):\nself.up[node][0] = parent\n        \n        # Precompute ancestors using binary lifting\nfor j in range(1, self.LOG):\n  if self.up[node][j - 1] != -1:\n    self.up[node][j] = self.up[self.up[node][j - 1]][j - 1]\n\nfor child in graph[node]:\n  if child != parent:\n    self.depth[child] = self.depth[node] + 1\nself._dfs(child, node, graph)\n    \n    def kth_ancestor(self, node: int, k: int) -> int:\n\"\"\"Find k-th ancestor of node\"\"\"\nfor j in range(self.LOG):\n  if (k & (1 << j)) != 0:\nnode = self.up[node][j]\nif node == -1:\n  break\nreturn node\n    \n    def lca(self, u: int, v: int) -> int:\n\"\"\"Find Lowest Common Ancestor\"\"\"\nif self.depth[u] < self.depth[v]:\n  u, v = v, u\n        \n        # Bring u to same depth as v\ndiff = self.depth[u] - self.depth[v]\nu = self.kth_ancestor(u, diff)\n\nif u == v:\n  return u\n        \n        # Binary search for LCA\n        for j in range(self.LOG - 1, -1, -1):\n    if self.up[u][j] != self.up[v][j]:\n      u = self.up[u][j]\nv = self.up[v][j]\n\nreturn self.up[u][0]"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "import java.util.*;\n\nclass BinaryLifting {\n  private int n, LOG;\n  private int[][] up;\n  private int[] depth;\n\n  public BinaryLifting(List<List<Integer>> graph, int root) {\n  n = graph.size();\n  LOG = (int) Math.ceil(Math.log(n) / Math.log(2)) + 1;\n  up = new int[n][LOG];\n  depth = new int[n];\n\n  for (int i = 0; i < n; i++) {\n    Arrays.fill(up[i], -1);\n  }\n\n  dfs(root, -1, graph);\n}\n    \n    private void dfs(int node, int parent, List < List < Integer >> graph) {\n  up[node][0] = parent;\n\n  // Precompute ancestors\n  for (int j = 1; j < LOG; j++) {\n    if (up[node][j - 1] != -1) {\n      up[node][j] = up[up[node][j - 1]][j - 1];\n    }\n  }\n\n  for (int child : graph.get(node)) {\n    if (child != parent) {\n      depth[child] = depth[node] + 1;\n      dfs(child, node, graph);\n    }\n  }\n}\n\n    // Find k-th ancestor\n    public int kthAncestor(int node, int k) {\n  for (int j = 0; j < LOG; j++) {\n    if ((k & (1 << j)) != 0) {\n      node = up[node][j];\n      if (node == -1) break;\n    }\n  }\n  return node;\n}\n\n    // Find LCA\n    public int lca(int u, int v) {\n  if (depth[u] < depth[v]) {\n            int temp = u;\n    u = v;\n    v = temp;\n  }\n\n        // Bring u to same depth as v\n        int diff = depth[u] - depth[v];\n  u = kthAncestor(u, diff);\n\n  if (u == v) return u;\n\n  // Binary search for LCA\n  for (int j = LOG - 1; j >= 0; j--) {\n    if (up[u][j] != up[v][j]) {\n      u = up[u][j];\n      v = up[v][j];\n    }\n  }\n\n  return up[u][0];\n}\n}"
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "#include <vector>\n#include <cmath>\nusing namespace std;\n\nclass BinaryLifting {\n  private:\n    int n, LOG;\n  vector<vector<int>> up;\nvector < int > depth;\n\nvoid dfs(int node, int parent, vector<vector<int>> & graph) {\n  up[node][0] = parent;\n\n  // Precompute ancestors\n  for (int j = 1; j < LOG; j++) {\n    if (up[node][j - 1] != -1) {\n      up[node][j] = up[up[node][j - 1]][j - 1];\n    }\n  }\n\n  for (int child : graph[node]) {\n    if (child != parent) {\n      depth[child] = depth[node] + 1;\n      dfs(child, node, graph);\n    }\n  }\n}\n\npublic:\nBinaryLifting(vector<vector<int>> & graph, int root = 0) {\n  n = graph.size();\n  LOG = ceil(log2(n)) + 1;\n  up.assign(n, vector<int>(LOG, -1));\n  depth.assign(n, 0);\n\n  dfs(root, -1, graph);\n}\n\n    // Find k-th ancestor\n    int kthAncestor(int node, int k) {\n  for (int j = 0; j < LOG; j++) {\n    if ((k & (1 << j)) != 0) {\n      node = up[node][j];\n      if (node == -1) break;\n    }\n  }\n  return node;\n}\n\n    // Find LCA\n    int lca(int u, int v) {\n  if (depth[u] < depth[v]) swap(u, v);\n\n        // Bring u to same depth as v\n        int diff = depth[u] - depth[v];\n  u = kthAncestor(u, diff);\n\n  if (u == v) return u;\n\n  // Binary search for LCA\n  for (int j = LOG - 1; j >= 0; j--) {\n    if (up[u][j] != up[v][j]) {\n      u = up[u][j];\n      v = up[v][j];\n    }\n  }\n\n  return up[u][0];\n}\n}; "
          }
        ]
      }
    ],
    "overview": "Binary Lifting precomputes ancestors at powers of 2 distances, enabling O(log n) queries for k-th ancestor and Lowest Common Ancestor (LCA) in trees.",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(n log n)",
    "tutorials": [],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
          "title": "Lowest Common Ancestor of a Binary Tree"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
          "title": "Lowest Common Ancestor of a Binary Search Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/",
          "title": "Lowest Common Ancestor of a Binary Tree III"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/balanced-binary-tree/",
          "title": "Balanced Binary Tree"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/snapshot-array/",
          "title": "Snapshot Array (related practice)"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/two-sum-less-than-k/",
          "title": "Two Sum Less Than K (auxiliary)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/equal-tree-partition/",
          "title": "Equal Tree Partition (related tree DP)"
        },
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/",
          "title": "Convert Sorted List to Binary Search Tree"
        },
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/fair-candy-swap/",
          "title": "Fair Candy Swap (auxiliary)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "lru-cache": {
    "id": "lru-cache",
    "name": "LRU Cache",
    "title": "LRU Cache",
    "category": "Advanced",
    "explanation": {
      "problemStatement": "Least Recently Used cache implementation using HashMap and Doubly Linked List",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [
        "Use HashMap to store key-value pairs for O(1) access time",
        "Use Doubly Linked List to track usage order (head = most recent, tail = least recent)",
        "On get(): Return value and move accessed node to head (mark as most recently used)",
        "On put() with existing key: Update value and move to head",
        "On put() with new key: Add to head, if capacity exceeded evict tail node",
        "Maintain both HashMap and DLL in sync during all operations"
      ],
      "useCase": "Caching systems, browser cache, database query cache, operating system page replacement, CDN caching.",
      "tips": [
        "Time complexity: O(1) for both get and put operations",
        "Space complexity: O(capacity) for storing the cache",
        "HashMap provides fast access, DLL maintains order efficiently",
        "Always update both HashMap and DLL together to keep them in sync",
        "Head pointer points to most recently used, tail to least recently used"
      ]
    },
    "companyTags": [],
    "difficulty": "intermediate",
    "listType": "coreAlgo",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [
      {
        "lang": "typeScript",
        "code": [
          {
            "codeType": "optimize",
            "code": "class LRUCache {\n  private capacity: number;\n  private cache: Map<number, DLLNode>;\n  private head: DLLNode | null;\n  private tail: DLLNode | null;\n\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.cache = new Map();\n    this.head = null;\n    this.tail = null;\n  }\n\n  get(key: number): number {\n    if (!this.cache.has(key)) return -1;\n\n    const node = this.cache.get(key)!;\n    this.moveToHead(node);\n    return node.value;\n  }\n\n  put(key: number, value: number): void {\n    if (this.cache.has(key)) {\n      const node = this.cache.get(key)!;\n      node.value = value;\n      this.moveToHead(node);\n    } else {\n      const newNode = { key, value, prev: null, next: null };\n      this.cache.set(key, newNode);\n      this.addToHead(newNode);\n\n      if (this.cache.size > this.capacity) {\n        const removed = this.removeTail();\n        this.cache.delete(removed.key);\n      }\n    }\n  }\n\n  private moveToHead(node: DLLNode): void {\n    this.removeNode(node);\n    this.addToHead(node);\n  }\n\n  private removeNode(node: DLLNode): void {\n    if (node.prev) node.prev.next = node.next;\n    if (node.next) node.next.prev = node.prev;\n    if (node === this.head) this.head = node.next;\n    if (node === this.tail) this.tail = node.prev;\n  }\n\n  private addToHead(node: DLLNode): void {\n    node.next = this.head;\n    node.prev = null;\n    if (this.head) this.head.prev = node;\n    this.head = node;\n    if (!this.tail) this.tail = node;\n  }\n\n  private removeTail(): DLLNode {\n    const removed = this.tail!;\n    this.removeNode(removed);\n    return removed;\n  }\n}\n\ninterface DLLNode {\n  key: number;\n  value: number;\n  prev: DLLNode | null;\n  next: DLLNode | null;\n}"
          }
        ]
      },
      {
        "lang": "python",
        "code": [
          {
            "codeType": "optimize",
            "code": "class DLLNode:\n    def __init__(self, key, value):\nself.key = key\nself.value = value\nself.prev = None\nself.next = None\n\nclass LRUCache:\n    def __init__(self, capacity: int):\nself.capacity = capacity\nself.cache = {}\nself.head = None\nself.tail = None\n\n    def get(self, key: int) -> int:\nif key not in self.cache:\nreturn -1\n\nnode = self.cache[key]\nself._move_to_head(node)\nreturn node.value\n\n    def put(self, key: int, value: int) -> None:\nif key in self.cache:\n  node = self.cache[key]\nnode.value = value\nself._move_to_head(node)\n        else:\nnew_node = DLLNode(key, value)\nself.cache[key] = new_node\nself._add_to_head(new_node)\n\nif len(self.cache) > self.capacity:\n  removed = self._remove_tail()\n                del self.cache[removed.key]\n\n    def _move_to_head(self, node):\nself._remove_node(node)\nself._add_to_head(node)\n\n    def _remove_node(self, node):\nif node.prev:\n  node.prev.next = node.next\nif node.next:\n  node.next.prev = node.prev\nif node == self.head:\n  self.head = node.next\nif node == self.tail:\n  self.tail = node.prev\n\n    def _add_to_head(self, node):\nnode.next = self.head\nnode.prev = None\nif self.head:\n  self.head.prev = node\nself.head = node\nif not self.tail:\nself.tail = node\n\n    def _remove_tail(self):\nremoved = self.tail\nself._remove_node(removed)\nreturn removed"
          }
        ]
      },
      {
        "lang": "java",
        "code": [
          {
            "codeType": "optimize",
            "code": "class DLLNode {\n    int key;\n    int value;\n    DLLNode prev;\n    DLLNode next;\n\n  DLLNode(int key, int value) {\n    this.key = key;\n    this.value = value;\n  }\n}\n\nclass LRUCache {\n  private int capacity;\n  private Map<Integer, DLLNode> cache;\n  private DLLNode head;\n  private DLLNode tail;\n\n  public LRUCache(int capacity) {\n    this.capacity = capacity;\n    this.cache = new HashMap<>();\n    this.head = null;\n    this.tail = null;\n  }\n\n  public int get(int key) {\n    if (!cache.containsKey(key)) {\n      return -1;\n    }\n        \n        DLLNode node = cache.get(key);\n    moveToHead(node);\n    return node.value;\n  }\n\n  public void put(int key, int value) {\n    if (cache.containsKey(key)) {\n            DLLNode node = cache.get(key);\n      node.value = value;\n      moveToHead(node);\n    } else {\n            DLLNode newNode = new DLLNode(key, value);\n      cache.put(key, newNode);\n      addToHead(newNode);\n\n      if (cache.size() > capacity) {\n                DLLNode removed = removeTail();\n        cache.remove(removed.key);\n      }\n    }\n  }\n\n  private void moveToHead(DLLNode node) {\n    removeNode(node);\n    addToHead(node);\n  }\n\n  private void removeNode(DLLNode node) {\n    if (node.prev != null) node.prev.next = node.next;\n    if (node.next != null) node.next.prev = node.prev;\n    if (node == head) head = node.next;\n    if (node == tail) tail = node.prev;\n  }\n\n  private void addToHead(DLLNode node) {\n    node.next = head;\n    node.prev = null;\n    if (head != null) head.prev = node;\n    head = node;\n    if (tail == null) tail = node;\n  }\n\n  private DLLNode removeTail() {\n        DLLNode removed = tail;\n    removeNode(removed);\n    return removed;\n  }\n} "
          }
        ]
      },
      {
        "lang": "cpp",
        "code": [
          {
            "codeType": "optimize",
            "code": "class DLLNode {\n  public:\n    int key;\n    int value;\n    DLLNode* prev;\n    DLLNode* next;\n\n  DLLNode(int k, int v): key(k), value(v), prev(nullptr), next(nullptr) { }\n};\n\nclass LRUCache {\n  private:\n    int capacity;\n  unordered_map<int, DLLNode*> cache;\nDLLNode * head;\nDLLNode * tail;\n\npublic:\nLRUCache(int capacity) {\n  this -> capacity = capacity;\n  head = nullptr;\n  tail = nullptr;\n}\n    \n    int get(int key) {\n  if (cache.find(key) == cache.end()) {\n    return -1;\n  }\n\n  DLLNode * node = cache[key];\n  moveToHead(node);\n  return node -> value;\n}\n\nvoid put(int key, int value) {\n  if (cache.find(key) != cache.end()) {\n    DLLNode * node = cache[key];\n    node -> value = value;\n    moveToHead(node);\n  } else {\n    DLLNode * newNode = new DLLNode(key, value);\n    cache[key] = newNode;\n    addToHead(newNode);\n\n    if (cache.size() > capacity) {\n      DLLNode * removed = removeTail();\n      cache.erase(removed -> key);\n      delete removed;\n    }\n  }\n}\n\nprivate:\nvoid moveToHead(DLLNode * node) {\n  removeNode(node);\n  addToHead(node);\n}\n\nvoid removeNode(DLLNode * node) {\n  if (node -> prev) node -> prev -> next = node -> next;\n  if (node -> next) node -> next -> prev = node -> prev;\n  if (node == head) head = node -> next;\n  if (node == tail) tail = node -> prev;\n}\n\nvoid addToHead(DLLNode * node) {\n  node -> next = head;\n  node -> prev = nullptr;\n  if (head) head -> prev = node;\n  head = node;\n  if (!tail) tail = node;\n}\n\nDLLNode * removeTail() {\n  DLLNode * removed = tail;\n  removeNode(removed);\n  return removed;\n}\n}; "
          }
        ]
      }
    ],
    "overview": "LRU (Least Recently Used) Cache is a data structure that stores a limited number of items and evicts the least recently used item when capacity is reached. It uses a HashMap for O(1) lookups and a Doubly Linked List to maintain LRU order.",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(capacity)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=7ABFKPK2hD4",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/lru-cache/",
          "title": "LRU Cache"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/lfu-cache/",
          "title": "LFU Cache"
        },
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/all-oone-data-structure/",
          "title": "All O`one Data Structure"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "two-sum": {
    "id": "two-sum",
    "name": "Two Sum",
    "title": "Two Sum",
    "category": "Array",
    "explanation": {
      "problemStatement": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nExample 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\nConstraints:\n• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Google",
      "Facebook",
      "Microsoft"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=KLlXCFG5TnA",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/two-sum/",
          "title": "Two Sum"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "best-time-to-buy-and-sell-stock": {
    "id": "best-time-to-buy-and-sell-stock",
    "name": "Best Time to Buy and Sell Stock",
    "title": "Best Time to Buy and Sell Stock",
    "category": "Array",
    "explanation": {
      "problemStatement": "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nExample 1:\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\n\nExample 2:\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: No transactions are done and the max profit = 0.\n\nConstraints:\n• 1 <= prices.length <= 10^5\n• 0 <= prices[i] <= 10^4",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=1pkOgXD63yU",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
          "title": "Best Time to Buy and Sell Stock"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "contains-duplicate": {
    "id": "contains-duplicate",
    "name": "Contains Duplicate",
    "title": "Contains Duplicate",
    "category": "Array",
    "explanation": {
      "problemStatement": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.\n\nExample 1:\nInput: nums = [1,2,3,1]\nOutput: true\n\nExample 2:\nInput: nums = [1,2,3,4]\nOutput: false\n\nExample 3:\nInput: nums = [1,1,1,3,3,4,3,2,4,2]\nOutput: true\n\nConstraints:\n• 1 <= nums.length <= 10^5\n• -10^9 <= nums[i] <= 10^9",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Apple",
      "Adobe"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=3OamzN90kPg",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/contains-duplicate/",
          "title": "Contains Duplicate"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "product-of-array-except-self": {
    "id": "product-of-array-except-self",
    "name": "Product of Array Except Self",
    "title": "Product of Array Except Self",
    "category": "Array",
    "explanation": {
      "problemStatement": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.\n\nExample 1:\nInput: nums = [1,2,3,4]\nOutput: [24,12,8,6]\n\nExample 2:\nInput: nums = [-1,1,0,-3,3]\nOutput: [0,0,9,0,0]\n\nConstraints:\n• 2 <= nums.length <= 10^5\n• -30 <= nums[i] <= 30\n• The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nFollow up: Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space.)",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=bNvIQI2wAjk",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/product-of-array-except-self/",
          "title": "Product of Array Except Self"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "maximum-subarray": {
    "id": "maximum-subarray",
    "name": "Maximum Subarray",
    "title": "Maximum Subarray",
    "category": "Array",
    "explanation": {
      "problemStatement": "Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.\n\nExample 1:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n\nExample 2:\nInput: nums = [1]\nOutput: 1\nExplanation: The subarray [1] has the largest sum 1.\n\nExample 3:\nInput: nums = [5,4,-1,7,8]\nOutput: 23\nExplanation: The subarray [5,4,-1,7,8] has the largest sum 23.\n\nConstraints:\n• 1 <= nums.length <= 10^5\n• -10^4 <= nums[i] <= 10^4\n\nFollow up: If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft",
      "LinkedIn"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=5WZl3MMT0Eg",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-subarray/",
          "title": "Maximum Subarray"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "maximum-product-subarray": {
    "id": "maximum-product-subarray",
    "name": "Maximum Product Subarray",
    "title": "Maximum Product Subarray",
    "category": "Array",
    "explanation": {
      "problemStatement": "Given an integer array nums, find a subarray that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a 32-bit integer.\n\nExample 1:\nInput: nums = [2,3,-2,4]\nOutput: 6\nExplanation: [2,3] has the largest product 6.\n\nExample 2:\nInput: nums = [-2,0,-1]\nOutput: 0\nExplanation: The result cannot be 2, because [-2,-1] is not a subarray.\n\nConstraints:\n• 1 <= nums.length <= 2 * 10^4\n• -10 <= nums[i] <= 10\n• The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "LinkedIn"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=lXVy6YWFcRM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/maximum-product-subarray/",
          "title": "Maximum Product Subarray"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "find-minimum-in-rotated-sorted-array": {
    "id": "find-minimum-in-rotated-sorted-array",
    "name": "Find Minimum in Rotated Sorted Array",
    "title": "Find Minimum in Rotated Sorted Array",
    "category": "Array",
    "explanation": {
      "problemStatement": "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:\n\n• [4,5,6,7,0,1,2] if it was rotated 4 times.\n• [0,1,2,4,5,6,7] if it was rotated 7 times.\n\nGiven the sorted rotated array nums of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.\n\nExample 1:\nInput: nums = [3,4,5,1,2]\nOutput: 1\nExplanation: The original array was [1,2,3,4,5] rotated 3 times.\n\nExample 2:\nInput: nums = [4,5,6,7,0,1,2]\nOutput: 0\nExplanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.\n\nExample 3:\nInput: nums = [11,13,15,17]\nOutput: 11\nExplanation: The original array was [11,13,15,17] and it was rotated 4 times.\n\nConstraints:\n• n == nums.length\n• 1 <= n <= 5000\n• -5000 <= nums[i] <= 5000\n• All the integers of nums are unique.\n• nums is sorted and rotated between 1 and n times.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=nIVW4P8b1VA",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
          "title": "Find Minimum in Rotated Sorted Array"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [
      {
        "input": [
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "output": 1,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ]
        ],
        "output": 0,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            11,
            13,
            15,
            17
          ]
        ],
        "output": 11,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            2,
            1
          ]
        ],
        "output": 1,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            1
          ]
        ],
        "output": 1,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            2,
            3,
            4,
            5,
            1
          ]
        ],
        "output": 1,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      }
    ],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "search-in-rotated-sorted-array": {
    "id": "search-in-rotated-sorted-array",
    "name": "Search in Rotated Sorted Array",
    "title": "Search in Rotated Sorted Array",
    "category": "Array",
    "explanation": {
      "problemStatement": "There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.\n\nExample 1:\nInput: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\n\nExample 2:\nInput: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\n\nExample 3:\nInput: nums = [1], target = 0\nOutput: -1\n\nConstraints:\n• 1 <= nums.length <= 5000\n• -10^4 <= nums[i] <= 10^4\n• All values of nums are unique.\n• nums is an ascending array that is possibly rotated.\n• -10^4 <= target <= 10^4",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Microsoft",
      "Amazon"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=U8XENwh8Oy8",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
          "title": "Search in Rotated Sorted Array"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          0
        ],
        "output": 4,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          3
        ],
        "output": -1,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            1
          ],
          0
        ],
        "output": -1,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            1
          ],
          1
        ],
        "output": 0,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          5
        ],
        "output": 1,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            3,
            1
          ],
          1
        ],
        "output": 1,
        "complexityExpected": {
          "time": "O(log n)",
          "space": "O(1)"
        }
      }
    ],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "3sum": {
    "id": "3sum",
    "name": "3Sum",
    "title": "3Sum",
    "category": "Array",
    "explanation": {
      "problemStatement": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.\n\nExample 1:\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\nExplanation: \nnums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.\nThe distinct triplets are [-1,0,1] and [-1,-1,2].\n\nExample 2:\nInput: nums = [0,1,1]\nOutput: []\nExplanation: The only possible triplet does not sum up to 0.\n\nExample 3:\nInput: nums = [0,0,0]\nOutput: [[0,0,0]]\n\nConstraints:\n• 3 <= nums.length <= 3000\n• -10^5 <= nums[i] <= 10^5",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=jzZsG8n2R9A",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/3sum/",
          "title": "3Sum"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [
      {
        "input": [
          [
            -1,
            0,
            1,
            2,
            -1,
            -4
          ]
        ],
        "output": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ],
        "complexityExpected": {
          "time": "O(n²)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            0,
            1,
            1
          ]
        ],
        "output": [],
        "complexityExpected": {
          "time": "O(n²)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            0,
            0,
            0
          ]
        ],
        "output": [
          [
            0,
            0,
            0
          ]
        ],
        "complexityExpected": {
          "time": "O(n²)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            -2,
            0,
            1,
            1,
            2
          ]
        ],
        "output": [
          [
            -2,
            0,
            2
          ],
          [
            -2,
            1,
            1
          ]
        ],
        "complexityExpected": {
          "time": "O(n²)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            1,
            2,
            -2,
            -1
          ]
        ],
        "output": [],
        "complexityExpected": {
          "time": "O(n²)",
          "space": "O(1)"
        }
      },
      {
        "input": [
          [
            -4,
            -1,
            -1,
            0,
            1,
            2
          ]
        ],
        "output": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ],
        "complexityExpected": {
          "time": "O(n²)",
          "space": "O(1)"
        }
      }
    ],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "container-with-most-water": {
    "id": "container-with-most-water",
    "name": "Container With Most Water",
    "title": "Container With Most Water",
    "category": "Array",
    "explanation": {
      "problemStatement": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nNotice that you may not slant the container.\n\nExample 1:\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. The max area of water is 49.\n\nExample 2:\nInput: height = [1,1]\nOutput: 1\n\nConstraints:\n• n == height.length\n• 2 <= n <= 10^5\n• 0 <= height[i] <= 10^4",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Google",
      "Facebook"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=UuiTKBwPgAo",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/container-with-most-water/",
          "title": "Container With Most Water"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "sum-of-two-integers": {
    "id": "sum-of-two-integers",
    "name": "Sum of Two Integers",
    "title": "Sum of Two Integers",
    "category": "Binary",
    "explanation": {
      "problemStatement": "Given two integers a and b, return the sum of the two integers without using the operators + and -.\n\nExample 1:\nInput: a = 1, b = 2\nOutput: 3\n\nExample 2:\nInput: a = 2, b = 3\nOutput: 5\n\nNotes: Use bitwise operations (XOR and AND with shifts) to simulate addition without using + or -.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=gVUrDV4tZfY",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/sum-of-two-integers/",
          "title": "Sum of Two Integers"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "number-of-1-bits": {
    "id": "number-of-1-bits",
    "name": "Number of 1 Bits",
    "title": "Number of 1 Bits",
    "category": "Binary",
    "explanation": {
      "problemStatement": "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).\n\nExample 1:\nInput: n = 00000000000000000000000000001011\nOutput: 3\nExplanation: The binary representation has three '1' bits.\n\nExample 2:\nInput: n = 00000000000000000000000010000000\nOutput: 1\n\nConstraints: The input is a 32-bit unsigned integer.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Apple",
      "Microsoft"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=gVUrDV4tZfY",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/number-of-1-bits/",
          "title": "Number of 1 Bits"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "counting-bits": {
    "id": "counting-bits",
    "name": "Counting Bits",
    "title": "Counting Bits",
    "category": "Binary",
    "explanation": {
      "problemStatement": "Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.\n\nExample 1:\nInput: n = 2\nOutput: [0,1,1]\n\nExample 2:\nInput: n = 5\nOutput: [0,1,1,2,1,2]\n\nFollow-up: Can you do it in O(n) time? Use DP relationships between numbers to compute counts efficiently.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=RyBM56RIWrM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/counting-bits/",
          "title": "Counting Bits"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "missing-number": {
    "id": "missing-number",
    "name": "Missing Number",
    "title": "Missing Number",
    "category": "Binary",
    "explanation": {
      "problemStatement": "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.\n\nExample 1:\nInput: nums = [3,0,1]\nOutput: 2\n\nExample 2:\nInput: nums = [0,1]\nOutput: 2\n\nConstraints: You can solve it in O(n) time and O(1) additional space using XOR or arithmetic sum formula.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=WnPLSRLSANE",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/missing-number/",
          "title": "Missing Number"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "reverse-bits": {
    "id": "reverse-bits",
    "name": "Reverse Bits",
    "title": "Reverse Bits",
    "category": "Binary",
    "explanation": {
      "problemStatement": "Reverse bits of a given 32 bits unsigned integer and return the resulting unsigned integer.\n\nExample 1:\nInput: n = 00000010100101000001111010011100\nOutput: 00111001011110000010100101000000 (which is 964176192 in decimal)\n\nExample 2:\nInput: n = 11111111111111111111111111111101\nOutput: 10111111111111111111111111111111\n\nNote: Consider bit-by-bit reversal; for multiple calls, use caching / lookup table to optimize.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Apple"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=UcoN6UjAI64",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/reverse-bits/",
          "title": "Reverse Bits"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "longest-increasing-subsequence": {
    "id": "longest-increasing-subsequence",
    "name": "Longest Increasing Subsequence",
    "title": "Longest Increasing Subsequence",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Given an integer array nums, return the length of the longest strictly increasing subsequence.\n\nExample 1:\nInput: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: The longest increasing subsequence is [2,3,7,101]\n\nNote: Optimal O(n log n) solution uses patience sorting / tails array with binary search; DP is O(n²).",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=cjWnW0hdF1Y",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-increasing-subsequence/",
          "title": "Longest Increasing Subsequence"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "longest-common-subsequence": {
    "id": "longest-common-subsequence",
    "name": "Longest Common Subsequence",
    "title": "Longest Common Subsequence",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.\n\nExample 1:\nInput: text1 = \"abcde\", text2 = \"ace\"\nOutput: 3\nExplanation: The longest common subsequence is \"ace\".\n\nNote: Typical DP builds a 2D table dp[i][j] representing LCS length for prefixes; time O(m × n) and space O(m × n) (can be optimized to O(min(m,n))).",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Google",
      "Amazon"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(m × n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=Ua0GhsJSlWM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-common-subsequence/",
          "title": "Longest Common Subsequence"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "house-robber-ii": {
    "id": "house-robber-ii",
    "name": "House Robber II",
    "title": "House Robber II",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "All houses are arranged in a circle. That means the first house is the neighbor of the last one. Adjacent houses cannot both be robbed.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob without alerting the police.\n\nBecause of the circular arrangement, you cannot rob both the first and last houses; the typical approach splits into two linear cases: rob houses from index 0..n-2 or 1..n-1 and take the max.\n\nExample:\nInput: nums = [2,3,2]\nOutput: 3\n\nConstraints:\n• 1 <= nums.length <= 100\n• 0 <= nums[i] <= 1000",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=rWAJCfYYOvM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/house-robber-ii/",
          "title": "House Robber II"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "decode-ways": {
    "id": "decode-ways",
    "name": "Decode Ways",
    "title": "Decode Ways",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "A message containing letters from A–Z can be encoded into numbers using the mapping 'A' -> \"1\", 'B' -> \"2\", ..., 'Z' -> \"26\".\n\nGiven a string s containing only digits, return the number of ways to decode it. The answer is guaranteed to fit in a 32-bit integer.\n\nExample:\nInput: s = \"12\"\nOutput: 2\nExplanation: \"AB\" or \"L\".\n\nInput: s = \"226\"\nOutput: 3\nExplanation: \"BZ\", \"VF\", \"BBF\".\n\nConstraints:\n• 1 <= s.length <= 100\n• s contains only digits and may include '0' which has special handling (e.g., '0' cannot be decoded alone).\n\nTypical DP recurrence: ways[i] = ways[i-1] (if s[i] is valid single-digit) + ways[i-2] (if s[i-1..i] is a valid two-digit decode between 10 and 26).",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Google"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=6aEyTjOwlJU",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/decode-ways/",
          "title": "Decode Ways"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "unique-paths": {
    "id": "unique-paths",
    "name": "Unique Paths",
    "title": "Unique Paths",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "There is a robot on an m × n grid. The robot is initially located at the top-left corner (0, 0). The robot tries to move to the bottom-right corner (m-1, n-1). The robot can only move either down or right at any point in time.\n\nGiven the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.\n\nExample:\nInput: m = 3, n = 7\nOutput: 28\n\nConstraints:\n• 1 <= m, n <= 100\n\nSolutions: DP with dp[i][j] = dp[i-1][j] + dp[i][j-1] or combinatorics using binomial coefficients C(m+n-2, m-1). Time: O(m × n).",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Google",
      "Bloomberg"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(m × n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=IlEsdxuD4lY",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/unique-paths/",
          "title": "Unique Paths"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "jump-game": {
    "id": "jump-game",
    "name": "Jump Game",
    "title": "Jump Game",
    "category": "Dynamic Programming",
    "explanation": {
      "problemStatement": "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.\n\nExample:\nInput: nums = [2,3,1,1,4]\nOutput: true\n\nInput: nums = [3,2,1,0,4]\nOutput: false\n\nConstraints:\n• 1 <= nums.length <= 10^4\n• 0 <= nums[i] <= 10^5\n\nCommon greedy solution: track the farthest reachable index while iterating; if at any index i the farthest reachable index < i, return false.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=Yan0cv2cLy8",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/jump-game/",
          "title": "Jump Game"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "clone-graph": {
    "id": "clone-graph",
    "name": "Clone Graph",
    "title": "Clone Graph",
    "category": "Graph",
    "explanation": {
      "problemStatement": "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value and a list (or array) of its neighbors. You must return the cloned node corresponding to the given node.\n\nThe graph is represented using adjacency lists and each node's value is unique.\n\nExample:\nInput: adjacency list = [[2,4],[1,3],[2,4],[1,3]]\nOutput: deep copy of the same adjacency structure.\n\nConstraints:\n• 1 <= number of nodes <= 100\n• Node values are 1..100\n\nTypical solutions: use DFS or BFS with a hashmap mapping original node -> cloned node to avoid revisiting nodes and to handle cycles.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon",
      "Google"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=mQeF6bN8hMk",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/clone-graph/",
          "title": "Clone Graph"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "course-schedule": {
    "id": "course-schedule",
    "name": "Course Schedule",
    "title": "Course Schedule",
    "category": "Graph",
    "explanation": {
      "problemStatement": "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nReturn true if you can finish all courses. Otherwise, return false. This is equivalent to detecting whether the directed graph of prerequisites contains a cycle.\n\nExample:\nInput: numCourses = 2, prerequisites = [[1,0]]\nOutput: true\n\nConstraints:\n• 1 <= numCourses <= 10^5\n• 0 <= prerequisites.length <= 10^5\n\nTypical approaches: Kahn's algorithm (topological sort / indegree) or DFS cycle detection.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Google"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=EgI5nU9etnU",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/course-schedule/",
          "title": "Course Schedule"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "pacific-atlantic-water-flow": {
    "id": "pacific-atlantic-water-flow",
    "name": "Pacific Atlantic Water Flow",
    "title": "Pacific Atlantic Water Flow",
    "category": "Graph",
    "explanation": {
      "problemStatement": "There is an m × n rectangular grid heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c). The island touches both the Pacific and Atlantic oceans: the Pacific ocean touches the island's left and top edges, and the Atlantic ocean touches the island's right and bottom edges.\n\nWater can only flow from a cell to neighboring cells (north, south, east, west) with height less than or equal to the current cell's height. Return a list of grid coordinates where water can flow to both the Pacific and Atlantic oceans.\n\nExample:\nInput:\nheights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\nOutput: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]\n\nConstraints:\n• 1 <= m, n <= 200\n\nStandard solution: run two BFS/DFS traversals from the ocean borders (one for Pacific, one for Atlantic) marking reachable cells and return cells reachable in both.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Google",
      "Amazon"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(m × n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=s-VkcjHqkGI",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
          "title": "Pacific Atlantic Water Flow"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "number-of-islands": {
    "id": "number-of-islands",
    "name": "Number of Islands",
    "title": "Number of Islands",
    "category": "Graph",
    "explanation": {
      "problemStatement": "Given an m × n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\nExample:\nInput:\ngrid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]\nOutput: 3\n\nConstraints:\n• m == grid.length\n• n == grid[i].length\n• 1 <= m, n <= 300\n• grid[i][j] is '0' or '1'\n\nTypical solutions: DFS or BFS flood-fill to mark visited land, or Union-Find.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(m × n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=pV2kpPD66nE",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-islands/",
          "title": "Number of Islands"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "longest-consecutive-sequence": {
    "id": "longest-consecutive-sequence",
    "name": "Longest Consecutive Sequence",
    "title": "Longest Consecutive Sequence",
    "category": "Graph",
    "explanation": {
      "problemStatement": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.\n\nExample:\nInput: nums = [100,4,200,1,3,2]\nOutput: 4\nExplanation: The longest consecutive sequence is [1,2,3,4].\n\nConstraints:\n• Use a hash set to allow O(1) checks for sequence starts and expand from starts to get O(n) time.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Google",
      "Facebook"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=P6RZZMu_maU",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-consecutive-sequence/",
          "title": "Longest Consecutive Sequence"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "alien-dictionary": {
    "id": "alien-dictionary",
    "name": "Alien Dictionary (Leetcode Premium)",
    "title": "Alien Dictionary (Leetcode Premium)",
    "category": "Graph",
    "explanation": {
      "problemStatement": "There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you.\n\nYou are given a list of strings words from the alien language's dictionary, where the strings in words are sorted lexicographically by the rules of this new language. Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. If the ordering is invalid, return \"\".\n\nExample:\nInput: words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]\nOutput: \"wertf\"\n\nConstraints:\n• Typical time: O(V + E) where V = number of unique letters and E = constraints between letters\n\nNotes: build a graph of letter orderings and perform topological sort; detect cycles for invalid ordering.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Google",
      "Airbnb"
    ],
    "difficulty": "advance",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(C) (≈ O(V + E))",
    "spaceComplexity": "O(V + E)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=6kTZYvNNyps",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/alien-dictionary/",
          "title": "Alien Dictionary (Leetcode Premium)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "graph-valid-tree": {
    "id": "graph-valid-tree",
    "name": "Graph Valid Tree (Leetcode Premium)",
    "title": "Graph Valid Tree (Leetcode Premium)",
    "category": "Graph",
    "explanation": {
      "problemStatement": "You have a graph of n nodes labeled from 0 to n - 1. You are given an integer n and a list of edges where edges[i] = [ai, bi] indicates that there is an undirected edge between nodes ai and bi in the graph.\n\nReturn true if the edges of the given graph make up a valid tree, and false otherwise. A valid tree must be connected and contain no cycles.\n\nExample:\nInput: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]\nOutput: true\n\nTypical approaches: check that edges = n-1 and graph is connected (via DFS/BFS) or use Union-Find to detect cycles and connectivity.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Google",
      "Amazon"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=bXsUuownnoQ",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/graph-valid-tree/",
          "title": "Graph Valid Tree (Leetcode Premium)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "number-of-connected-components-in-an-undirected-graph": {
    "id": "number-of-connected-components-in-an-undirected-graph",
    "name": "Number of Connected Components in an Undirected Graph (Leetcode Premium)",
    "title": "Number of Connected Components in an Undirected Graph (Leetcode Premium)",
    "category": "Graph",
    "explanation": {
      "problemStatement": "You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph.\n\nReturn the number of connected components in the graph.\n\nExample:\nInput: n = 5, edges = [[0,1],[1,2],[3,4]]\nOutput: 2\n\nTypical solutions: DFS/BFS to count components or Union-Find for efficient union operations.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Google"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=8f1XPm4WOUc",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
          "title": "Number of Connected Components in an Undirected Graph (Leetcode Premium)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "insert-interval": {
    "id": "insert-interval",
    "name": "Insert Interval",
    "title": "Insert Interval",
    "category": "Interval",
    "explanation": {
      "problemStatement": "You are given an array of non-overlapping intervals where intervals[i] = [starti, endi] represent the start and the end of the i-th interval and intervals is sorted in ascending order by starti.\n\nYou are also given an interval newInterval = [start, end] that represents the start and end of another interval. Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge if necessary).\n\nExample:\nInput: intervals = [[1,3],[6,9]], newInterval = [2,5]\nOutput: [[1,5],[6,9]]",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Google",
      "LinkedIn"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=A8NUOmlwOlM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/insert-interval/",
          "title": "Insert Interval"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "non-overlapping-intervals": {
    "id": "non-overlapping-intervals",
    "name": "Non-overlapping Intervals",
    "title": "Non-overlapping Intervals",
    "category": "Interval",
    "explanation": {
      "problemStatement": "Given an array of intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.\n\nNote: intervals that only touch at a point are non-overlapping.\n\nExample:\nInput: intervals = [[1,2],[2,3],[3,4],[1,3]]\nOutput: 1",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=nONCGxWoUfM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/non-overlapping-intervals/",
          "title": "Non-overlapping Intervals"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "meeting-rooms": {
    "id": "meeting-rooms",
    "name": "Meeting Rooms (Leetcode Premium)",
    "title": "Meeting Rooms (Leetcode Premium)",
    "category": "Interval",
    "explanation": {
      "problemStatement": "Given an array of meeting time intervals where intervals[i] = [starti, endi], determine if a person could attend all meetings (i.e., the intervals do not overlap).\n\nExample:\nInput: intervals = [[0,30],[5,10],[15,20]]\nOutput: false\n\nTypical approach: sort intervals by start time and check for overlaps.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=PaJxqZVPhbg&t=67s",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/meeting-rooms/",
          "title": "Meeting Rooms (Leetcode Premium)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "meeting-rooms-ii": {
    "id": "meeting-rooms-ii",
    "name": "Meeting Rooms II (Leetcode Premium)",
    "title": "Meeting Rooms II (Leetcode Premium)",
    "category": "Interval",
    "explanation": {
      "problemStatement": "Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.\n\nExample:\nInput: intervals = [[0,30],[5,10],[15,20]]\nOutput: 2\n\nTypical approach: sort by start time and use a min-heap of end times or two-pointer sweep.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon",
      "Google"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=FdzJmTCVyJU",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/meeting-rooms-ii/",
          "title": "Meeting Rooms II (Leetcode Premium)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "merge-two-sorted-lists": {
    "id": "merge-two-sorted-lists",
    "name": "Merge Two Sorted Lists",
    "title": "Merge Two Sorted Lists",
    "category": "Linked List",
    "explanation": {
      "problemStatement": "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\nExample:\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n + m)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=XIdigk956u0",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/merge-two-sorted-lists/",
          "title": "Merge Two Sorted Lists"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "merge-k-sorted-lists": {
    "id": "merge-k-sorted-lists",
    "name": "Merge K Sorted Lists",
    "title": "Merge K Sorted Lists",
    "category": "Linked List",
    "explanation": {
      "problemStatement": "You are given an array of k sorted linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.\n\nExample:\nInput: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]\n\nApproaches: use a min-heap (priority queue) or divide and conquer merging.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Google"
    ],
    "difficulty": "advance",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(N log k)",
    "spaceComplexity": "O(k)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=XIdigk956u0",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
          "title": "Merge K Sorted Lists"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "remove-nth-node-from-end-of-list": {
    "id": "remove-nth-node-from-end-of-list",
    "name": "Remove Nth Node From End Of List",
    "title": "Remove Nth Node From End Of List",
    "category": "Linked List",
    "explanation": {
      "problemStatement": "Given the head of a linked list, remove the nth node from the end of the list and return its head.\n\nExample:\nInput: head = [1,2,3,4,5], n = 2\nOutput: [1,2,3,5]\n\nOne-pass solution: dummy node + two pointers spaced n apart.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=XVuQxVej6y8",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
          "title": "Remove Nth Node From End Of List"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "reorder-list": {
    "id": "reorder-list",
    "name": "Reorder List",
    "title": "Reorder List",
    "category": "Linked List",
    "explanation": {
      "problemStatement": "You are given the head of a singly linked-list. The list can be represented as: L0 → L1 → … → Ln-1 → Ln.\n\nReorder the list to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …. You must do this in-place without altering the nodes' values.\n\nTypical approach: find middle with fast/slow, reverse second half, then merge the halves alternately.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=S5bfdUTrKLM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/reorder-list/",
          "title": "Reorder List"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "set-matrix-zeroes": {
    "id": "set-matrix-zeroes",
    "name": "Set Matrix Zeroes",
    "title": "Set Matrix Zeroes",
    "category": "Matrix",
    "explanation": {
      "problemStatement": "Given an m × n integer matrix, if an element is 0, set its entire row and column to 0s. You must do it in place.\n\nExample:\nInput: matrix = [[1,1,1],[1,0,1],[1,1,1]]\nOutput: [[1,0,1],[0,0,0],[1,0,1]]\n\nApproach: use first row/column as markers or two boolean arrays; handle first row/col specially to avoid overwriting markers.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=T41rL0L3Pnw",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/set-matrix-zeroes/",
          "title": "Set Matrix Zeroes"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "spiral-matrix": {
    "id": "spiral-matrix",
    "name": "Spiral Matrix",
    "title": "Spiral Matrix",
    "category": "Matrix",
    "explanation": {
      "problemStatement": "Given an m × n matrix, return all elements of the matrix in spiral order.\n\nExample:\nInput: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1,2,3,6,9,8,7,4,5]\n\nApproach: maintain top, bottom, left, right boundaries and traverse right → down → left → up while shrinking boundaries.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=BJnMZNwUk1M",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/spiral-matrix/",
          "title": "Spiral Matrix"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "rotate-image": {
    "id": "rotate-image",
    "name": "Rotate Image",
    "title": "Rotate Image",
    "category": "Matrix",
    "explanation": {
      "problemStatement": "You are given an n × n 2D matrix representing an image. Rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.\n\nExample:\nInput: [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]\n\nNote: Do not allocate another 2D matrix. (source: https://leetcode.com/problems/rotate-image/)",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Apple"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=fMSJSS7eO1w",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/rotate-image/",
          "title": "Rotate Image"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "word-search": {
    "id": "word-search",
    "name": "Word Search",
    "title": "Word Search",
    "category": "Matrix",
    "explanation": {
      "problemStatement": "Given an m × n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same cell may not be used more than once.\n\nExample:\nInput: board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'\nOutput: true\n\n(source: https://leetcode.com/problems/word-search/)",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m × n × 4^L)",
    "spaceComplexity": "O(L)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=pfiQ_PS1g8E",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/word-search/",
          "title": "Word Search"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "longest-substring-without-repeating-characters": {
    "id": "longest-substring-without-repeating-characters",
    "name": "Longest Substring Without Repeating Characters",
    "title": "Longest Substring Without Repeating Characters",
    "category": "String",
    "explanation": {
      "problemStatement": "Given a string s, find the length of the longest substring in which no character appears more than once.\n\nExample 1:\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with length 3.\n\nExample 2:\nInput: s = \"bbbbb\"\nOutput: 1\nExplanation: The answer is \"b\", with length 1.\n\nConstraints: 0 <= s.length <= 5 * 10^4; s consists of English letters, digits, symbols and spaces.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Bloomberg"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(min(m,n))",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=wiGpQwVHdE0",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
          "title": "Longest Substring Without Repeating Characters"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "longest-repeating-character-replacement": {
    "id": "longest-repeating-character-replacement",
    "name": "Longest Repeating Character Replacement",
    "title": "Longest Repeating Character Replacement",
    "category": "String",
    "explanation": {
      "problemStatement": "You are given a string s and an integer k. You may change at most k characters in s; each change converts one character to any other uppercase English letter. Return the length of the longest substring containing the same letter you can obtain after performing at most k changes.\n\nExample 1:\nInput: s = \"ABAB\", k = 2\nOutput: 4\nExplanation: Replace the two 'A's with 'B's or vice versa to obtain \"BBBB\" or \"AAAA\" of length 4.\n\nExample 2:\nInput: s = \"AABABBA\", k = 1\nOutput: 4\nExplanation: Replace the one 'A' in the substring \"ABBA\" to get \"BBBB\".\n\nConstraints: 1 <= s.length <= 10^5; s consists of uppercase English letters; 0 <= k <= s.length.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Google"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=gqXU1UyA8pk",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-repeating-character-replacement/",
          "title": "Longest Repeating Character Replacement"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "minimum-window-substring": {
    "id": "minimum-window-substring",
    "name": "Minimum Window Substring",
    "title": "Minimum Window Substring",
    "category": "String",
    "explanation": {
      "problemStatement": "Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".\n\nExample 1:\nInput: s = \"ADOBECODEBANC\", t = \"ABC\"\nOutput: \"BANC\"\n\nExample 2:\nInput: s = \"a\", t = \"a\"\nOutput: \"a\"\n\nConstraints: 1 <= s.length, t.length <= 10^5; s and t consist of ASCII characters.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon",
      "LinkedIn"
    ],
    "difficulty": "advance",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m + n)",
    "spaceComplexity": "O(m + n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=jSto0O4AJbM",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/minimum-window-substring/",
          "title": "Minimum Window Substring"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "valid-anagram": {
    "id": "valid-anagram",
    "name": "Valid Anagram",
    "title": "Valid Anagram",
    "category": "String",
    "explanation": {
      "problemStatement": "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram means the two strings contain the same characters with the same frequencies.\n\nExample 1:\nInput: s = \"anagram\", t = \"nagaram\"\nOutput: true\n\nExample 2:\nInput: s = \"rat\", t = \"car\"\nOutput: false\n\nConstraints: 1 <= s.length, t.length <= 5 * 10^4; s and t consist of lowercase English letters.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Bloomberg"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=9UtInBqnCgA",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/valid-anagram/",
          "title": "Valid Anagram"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "group-anagrams": {
    "id": "group-anagrams",
    "name": "Group Anagrams",
    "title": "Group Anagrams",
    "category": "String",
    "explanation": {
      "problemStatement": "Given an array of strings strs, group the anagrams together. You may return the answer in any order.\n\nExample 1:\nInput: strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\nOutput: [[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]\n\nConstraints: 1 <= strs.length <= 10^4; 0 <= strs[i].length <= 100; strs[i] consists of lowercase English letters. The sum of all strs[i].length is ≤ 10^5.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Bloomberg"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n × k log k)",
    "spaceComplexity": "O(n × k)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=vzdNOK2oB2E&t=1s",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/group-anagrams/",
          "title": "Group Anagrams"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "valid-parentheses": {
    "id": "valid-parentheses",
    "name": "Valid Parentheses",
    "title": "Valid Parentheses",
    "category": "String",
    "explanation": {
      "problemStatement": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: (1) Open brackets are closed by the same type of brackets, and (2) Open brackets are closed in the correct order.\n\nExample 1:\nInput: s = \"()\"\nOutput: true\n\nExample 2:\nInput: s = \"([)]\"\nOutput: false\n\nConstraints: 1 <= s.length <= 10^4; s consists only of the characters '(', ')', '{', '}', '[' and ']'.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Bloomberg"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=WTzjTskDFMg",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/valid-parentheses/",
          "title": "Valid Parentheses"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "valid-palindrome": {
    "id": "valid-palindrome",
    "name": "Valid Palindrome",
    "title": "Valid Palindrome",
    "category": "String",
    "explanation": {
      "problemStatement": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.\n\nExample 1:\nInput: s = \"A man, a plan, a canal: Panama\"\nOutput: true\n\nExample 2:\nInput: s = \"race a car\"\nOutput: false\n\nConstraints: 1 <= s.length <= 2 * 10^5; s consists of printable ASCII characters.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=jJXJ16kPFWg&t=25s",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/valid-palindrome/",
          "title": "Valid Palindrome"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "longest-palindromic-substring": {
    "id": "longest-palindromic-substring",
    "name": "Longest Palindromic Substring",
    "title": "Longest Palindromic Substring",
    "category": "String",
    "explanation": {
      "problemStatement": "Given a string s, return the longest palindromic substring in s.\n\nExample 1:\nInput: s = \"babad\"\nOutput: \"bab\"\nNote: \"aba\" is also a valid answer.\n\nExample 2:\nInput: s = \"cbbd\"\nOutput: \"bb\"\n\nConstraints: 1 <= s.length <= 1000; s consists of only ASCII characters.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Facebook"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=XYQecbcd6_c",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/longest-palindromic-substring/",
          "title": "Longest Palindromic Substring"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "palindromic-substrings": {
    "id": "palindromic-substrings",
    "name": "Palindromic Substrings",
    "title": "Palindromic Substrings",
    "category": "String",
    "explanation": {
      "problemStatement": "Given a string s, return the number of palindromic substrings in it. A substring is palindromic if it reads the same backward as forward.\n\nExample 1:\nInput: s = \"abc\"\nOutput: 3\nExplanation: Three palindromic substrings: \"a\", \"b\", \"c\".\n\nExample 2:\nInput: s = \"aaa\"\nOutput: 6\nExplanation: Six palindromic substrings: \"a\",\"a\",\"a\",\"aa\",\"aa\",\"aaa\".\n\nConstraints: 1 <= s.length <= 1000; s consists of lowercase English letters.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=4RACzI5-du8",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/palindromic-substrings/",
          "title": "Palindromic Substrings"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "encode-and-decode-strings": {
    "id": "encode-and-decode-strings",
    "name": "Encode and Decode Strings (LeetCode Premium)",
    "title": "Encode and Decode Strings (LeetCode Premium)",
    "category": "String",
    "explanation": {
      "problemStatement": "Design an algorithm to encode a list of strings to a single string. The encoded string is sent over the network and should be decoded back to the original list of strings.\n\nExample:\nInput: [\"lint\",\"code\",\"love\",\"you\"]\nOutput (one possible encoding): \"4#lint4#code4#love3#you\"\n\nConstraints: 1 <= total length of all strings <= 10^5; Strings may contain any characters.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Google",
      "Facebook"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=B1k_sxOSgv8",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/encode-and-decode-strings/",
          "title": "Encode and Decode Strings (LeetCode Premium)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "maximum-depth-of-binary-tree": {
    "id": "maximum-depth-of-binary-tree",
    "name": "Maximum Depth of Binary Tree",
    "title": "Maximum Depth of Binary Tree",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\nExample 1:\nInput: root = [3,9,20,null,null,15,7]\nOutput: 3\n\nConstraints: The number of nodes in the tree is in the range [0, 10^4]; -1000 <= Node.val <= 1000.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "LinkedIn"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=hTM3phVI6YQ",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
          "title": "Maximum Depth of Binary Tree"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "same-tree": {
    "id": "same-tree",
    "name": "Same Tree",
    "title": "Same Tree",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Given the roots of two binary trees p and q, write a function to check if they are the same tree. Two binary trees are the same if they are structurally identical and the nodes have the same values.\n\nExample 1:\nInput: p = [1,2,3], q = [1,2,3]\nOutput: true\n\nExample 2:\nInput: p = [1,2], q = [1,null,2]\nOutput: false\n\nConstraints: The number of nodes in both trees is in the range [0, 100]; -10^4 <= Node.val <= 10^4.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Bloomberg"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=vRbbcKXCxOw",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/same-tree/",
          "title": "Same Tree"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "invert-binary-tree": {
    "id": "invert-binary-tree",
    "name": "Invert/Flip Binary Tree",
    "title": "Invert/Flip Binary Tree",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Given the root of a binary tree, invert the tree and return its root.\n\nExample 1:\nInput: root = [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]\n\nConstraints: The number of nodes in the tree is in the range [0, 100]; -100 <= Node.val <= 100.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Google",
      "Amazon",
      "Bloomberg"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=OnSn2XEQ4MY",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problems/invert-binary-tree/",
          "title": "Invert/Flip Binary Tree"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "binary-tree-maximum-path-sum": {
    "id": "binary-tree-maximum-path-sum",
    "name": "Binary Tree Maximum Path Sum",
    "title": "Binary Tree Maximum Path Sum",
    "category": "Tree",
    "explanation": {
      "problemStatement": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node may appear at most once in the sequence. Given the root of a binary tree, return the maximum path sum of any non-empty path.\n\nExample 1:\nInput: root = [1,2,3]\nOutput: 6\n\nExample 2:\nInput: root = [-10,9,20,null,null,15,7]\nOutput: 42\n\nConstraints: The number of nodes in the tree is in the range [1, 3 * 10^4]; -1000 <= Node.val <= 1000.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "advance",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=Hr5cWUld4vU",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
          "title": "Binary Tree Maximum Path Sum"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "binary-tree-level-order-traversal": {
    "id": "binary-tree-level-order-traversal",
    "name": "Binary Tree Level Order Traversal",
    "title": "Binary Tree Level Order Traversal",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).\n\nExample 1:\nInput: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]\n\nConstraints: The number of nodes in the tree is in the range [0, 10^4].",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=6ZnyEApgFYg",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
          "title": "Binary Tree Level Order Traversal"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "serialize-and-deserialize-binary-tree": {
    "id": "serialize-and-deserialize-binary-tree",
    "name": "Serialize and Deserialize Binary Tree",
    "title": "Serialize and Deserialize Binary Tree",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored or transmitted. Design an algorithm to serialize a binary tree to a string and deserialize the string to reconstruct the original tree. There is no restriction on how your serialization/deserialization should work, but they must be consistent.\n\nExample:\nInput: root = [1,2,3,null,null,4,5]\nOutput: (serialized string and then tree reconstructed to original)\n\nConstraints: The number of nodes in the tree is in the range [0, 10^4]; -1000 <= Node.val <= 1000.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Google"
    ],
    "difficulty": "advance",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=u4JAi2JJhI8",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
          "title": "Serialize and Deserialize Binary Tree"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "subtree-of-another-tree": {
    "id": "subtree-of-another-tree",
    "name": "Subtree of Another Tree",
    "title": "Subtree of Another Tree",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root that has the same structure and node values as subRoot, otherwise return false.\n\nExample:\nInput: root = [3,4,5,1,2], subRoot = [4,1,2]\nOutput: true\n\nConstraints: The number of nodes in both trees is in the range [0, 2000]; -10^4 <= Node.val <= 10^4.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon"
    ],
    "difficulty": "easy",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m × n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=E36O5SWp-LE",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "easy",
          "url": "https://leetcode.com/problemset/all/?search=Subtree%20of%20Another%20Tree",
          "title": "Subtree of Another Tree"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "construct-binary-tree-from-preorder-and-inorder-traversal": {
    "id": "construct-binary-tree-from-preorder-and-inorder-traversal",
    "name": "Construct Binary Tree from Preorder and Inorder Traversal",
    "title": "Construct Binary Tree from Preorder and Inorder Traversal",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.\n\nExample:\nInput: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]\nOutput: [3,9,20,null,null,15,7]\n\nConstraints: 1 <= preorder.length <= 3000; inorder.length == preorder.length; -3000 <= Node.val <= 3000; preorder and inorder consist of unique values.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=ihj4IQGZ2zc",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
          "title": "Construct Binary Tree from Preorder and Inorder Traversal"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "validate-binary-search-tree": {
    "id": "validate-binary-search-tree",
    "name": "Validate Binary Search Tree",
    "title": "Validate Binary Search Tree",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST requires that for every node, all nodes in the left subtree have values less than the node's value, and all nodes in the right subtree have values greater than the node's value.\n\nExample 1:\nInput: root = [2,1,3]\nOutput: true\n\nExample 2:\nInput: root = [5,1,4,null,null,3,6]\nOutput: false\n\nConstraints: The number of nodes in the tree is in the range [1, 10^4]; -2^31 <= Node.val <= 2^31 - 1.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=s6ATEkipzow",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/validate-binary-search-tree/",
          "title": "Validate Binary Search Tree"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "kth-smallest-element-in-a-bst": {
    "id": "kth-smallest-element-in-a-bst",
    "name": "Kth Smallest Element in a BST",
    "title": "Kth Smallest Element in a BST",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed) of all the node values in the tree.\n\nExample:\nInput: root = [3,1,4,null,2], k = 1\nOutput: 1\n\nConstraints: The number of nodes in the tree is in the range [1, 10^4]; 1 <= k <= number of nodes; -10^4 <= Node.val <= 10^4.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Bloomberg"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=5LUXSvjmGCw",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
          "title": "Kth Smallest Element in a BST"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "lowest-common-ancestor-of-bst": {
    "id": "lowest-common-ancestor-of-bst",
    "name": "Lowest Common Ancestor of BST",
    "title": "Lowest Common Ancestor of BST",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Given a binary search tree (BST) and two nodes p and q, find the lowest common ancestor (LCA) — the deepest node in the tree that has both p and q as descendants (where a node may be a descendant of itself).\n\nExample:\nInput: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8\nOutput: 6\n\nConstraints: The number of nodes in the tree is in the range [2, 10^4]; -10^5 <= Node.val <= 10^5. p and q will exist in the tree and all Node.val are unique.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Microsoft"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(h)",
    "spaceComplexity": "O(h)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=gs2LMfuOR9k",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
          "title": "Lowest Common Ancestor of BST"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "implement-trie": {
    "id": "implement-trie",
    "name": "Implement Trie (Prefix Tree)",
    "title": "Implement Trie (Prefix Tree)",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Implement the Trie (Prefix Tree) data structure with methods insert(word), search(word) and startsWith(prefix).\n\nExample:\nInput:\n[\"Trie\",\"insert\",\"search\",\"search\",\"startsWith\"]\n[[],[\"apple\"],[\"apple\"],[\"app\"],[\"app\"]]\nOutput:\n[null,null,true,false,true]\n\nConstraints: 1 <= word.length, prefix.length <= 2000 across all calls; words consist of lowercase English letters; At most 3 * 10^4 calls will be made to the Trie methods.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Google",
      "Facebook"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(m)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=oobqoCJlHA0",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/implement-trie-prefix-tree/",
          "title": "Implement Trie (Prefix Tree)"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "add-and-search-word": {
    "id": "add-and-search-word",
    "name": "Add and Search Word",
    "title": "Add and Search Word",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Design a data structure that supports adding new words and searching for a string, where the search string may contain the wildcard character '.' that matches any single character. Implement the WordDictionary class with methods addWord(word) and search(word).\n\nExample:\nInput:\n[\"WordDictionary\",\"addWord\",\"addWord\",\"addWord\",\"search\",\"search\",\"search\",\"search\"]\n[[],[\"bad\"],[\"dad\"],[\"mad\"],[\"pad\"],[\"bad\"],[\".ad\"],[\"b..\"]]\nOutput:\n[null,null,null,null,false,true,true,true]\n\nConstraints: 1 <= word.length <= 500 across calls; At most 5 * 10^4 calls will be made to addWord and search.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Facebook",
      "Amazon"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m)",
    "spaceComplexity": "O(m)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=BTf05gs_8iU",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/add-and-search-word-data-structure-design/",
          "title": "Add and Search Word"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "word-search-ii": {
    "id": "word-search-ii",
    "name": "Word Search II",
    "title": "Word Search II",
    "category": "Tree",
    "explanation": {
      "problemStatement": "Given an m × n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontal or vertical). The same cell may not be used more than once per word.\n\nExample:\nInput: board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]\nOutput: [\"oath\",\"eat\"]\n\nConstraints: m == board.length; n == board[i].length; 1 <= m, n <= 12; 1 <= words.length <= 3 * 10^4; 1 <= words[i].length <= 10; board and words consist of lowercase English letters.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Google",
      "Airbnb"
    ],
    "difficulty": "advance",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(m × n × 4^L)",
    "spaceComplexity": "O(k)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=asbcE9mZz_U",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/word-search-ii/",
          "title": "Word Search II"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "top-k-frequent-elements": {
    "id": "top-k-frequent-elements",
    "name": "Top K Frequent Elements",
    "title": "Top K Frequent Elements",
    "category": "Heap",
    "explanation": {
      "problemStatement": "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.\n\nExample 1:\nInput: nums = [1,1,1,2,2,3], k = 2\nOutput: [1,2]\n\nConstraints: 1 <= nums.length <= 10^5; k is in the range [1, number of unique elements]; Answer is guaranteed to exist.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Facebook",
      "Yelp"
    ],
    "difficulty": "intermediate",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(n log k)",
    "spaceComplexity": "O(n + k)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=YPTqKIgVk-k",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "intermediate",
          "url": "https://leetcode.com/problems/top-k-frequent-elements/",
          "title": "Top K Frequent Elements"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  },
  "find-median-from-data-stream": {
    "id": "find-median-from-data-stream",
    "name": "Find Median from Data Stream",
    "title": "Find Median from Data Stream",
    "category": "Heap",
    "explanation": {
      "problemStatement": "Design a data structure that supports adding numbers from a data stream and finding the median of all numbers seen so far efficiently.\n\nExample:\naddNum(1)\naddNum(2)\nfindMedian() -> 1.5\naddNum(3)\nfindMedian() -> 2\n\nConstraints: At most 10^5 calls will be made to addNum and findMedian; Values are 32-bit signed integers.",
      "io": [],
      "constraints": [],
      "note": "",
      "steps": [],
      "useCase": "",
      "tips": []
    },
    "companyTags": [
      "Amazon",
      "Google",
      "Facebook"
    ],
    "difficulty": "advance",
    "listType": "blind75",
    "visualizationUrl": "",
    "commonNotes": "",
    "commonWhiteBoard": "",
    "implementations": [],
    "overview": "",
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(n)",
    "tutorials": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=itmhHWaHupI",
        "credits": "",
        "moreInfo": ""
      }
    ],
    "likes": 0,
    "dislikes": 0,
    "problemsToSolve": {
      "internal": [],
      "external": [
        {
          "type": "advance",
          "url": "https://leetcode.com/problems/find-median-from-data-stream/",
          "title": "Find Median from Data Stream"
        }
      ]
    },
    "imageUrls": [],
    "testCases": [],
    "inputSchema": [],
    "availableLanguages": "",
    "editorialId": "",
    "userCompletionGraphData": {
      "attempted": 0,
      "completed": 0
    },
    "shareCount": 0
  }
};
