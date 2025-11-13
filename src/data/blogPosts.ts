export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  content: BlogContent[];
}

export interface BlogContent {
  type: 'heading' | 'paragraph' | 'image' | 'code' | 'list' | 'quote';
  content?: string;
  language?: string; // for code blocks
  items?: string[]; // for lists
  alt?: string; // for images
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'two-pointer-strategy-guide',
    title: 'Mastering the Two Pointer Strategy: Why and How to Use It',
    subtitle: 'A comprehensive guide to one of the most powerful algorithmic techniques',
    description: 'Learn the two-pointer technique, understand when to use it, and master common patterns like opposite directional pointers, same direction pointers, and sliding windows.',
    author: 'AlgoLib Team',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'DSA Patterns',
    tags: ['Two Pointers', 'Arrays', 'Algorithms', 'Interview Prep'],
    content: [
      {
        type: 'heading',
        content: 'What is the Two Pointer Technique?'
      },
      {
        type: 'paragraph',
        content: 'The two-pointer technique is an algorithmic pattern where we use two pointers to iterate through a data structure (usually an array or linked list) in a smart way. Instead of using nested loops that result in O(n²) time complexity, we can often solve the same problem in O(n) time by using two pointers strategically.'
      },
      {
        type: 'paragraph',
        content: 'This technique is particularly powerful for problems involving arrays, strings, and linked lists where you need to find pairs, triplets, or subarrays that satisfy certain conditions.'
      },
      {
        type: 'heading',
        content: 'Why Use Two Pointers?'
      },
      {
        type: 'paragraph',
        content: 'The two-pointer technique offers several compelling advantages that make it a go-to pattern for many algorithmic challenges:'
      },
      {
        type: 'list',
        items: [
          '✅ Time Complexity: Reduces O(n²) nested loops to O(n) single pass',
          '✅ Space Efficiency: Usually O(1) extra space required',
          '✅ Intuitive Logic: Easy to understand and implement once you grasp the pattern',
          '✅ Versatile: Works for multiple problem types (pairs, subarrays, palindromes)',
          '✅ Interview Favorite: Extremely common in coding interviews'
        ]
      },
      {
        type: 'heading',
        content: 'Common Two Pointer Patterns'
      },
      {
        type: 'paragraph',
        content: 'There are three main patterns of two-pointer techniques, each suited for different types of problems:'
      },
      {
        type: 'heading',
        content: '1. Opposite Directional Pointers'
      },
      {
        type: 'paragraph',
        content: 'Start with one pointer at the beginning (left) and one at the end (right), moving them toward each other. This pattern is ideal for:'
      },
      {
        type: 'list',
        items: [
          'Finding pairs with a target sum in sorted arrays',
          'Checking if a string is a palindrome',
          'Reversing arrays or strings in-place',
          'Container with most water problem'
        ]
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Example: Two Sum in Sorted Array
function twoSum(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const sum = nums[left] + nums[right];
    
    if (sum === target) {
      return [left, right]; // Found the pair!
    } else if (sum < target) {
      left++; // Need a larger sum
    } else {
      right--; // Need a smaller sum
    }
  }
  
  return [-1, -1]; // No pair found
}`
      },
      {
        type: 'heading',
        content: '2. Same Directional Pointers (Fast & Slow)'
      },
      {
        type: 'paragraph',
        content: 'Both pointers start at the same position but move at different speeds. Perfect for:'
      },
      {
        type: 'list',
        items: [
          'Detecting cycles in linked lists',
          'Finding the middle of a linked list',
          'Removing duplicates from sorted arrays',
          'Partition problems'
        ]
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Example: Remove Duplicates from Sorted Array
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  
  let slow = 0; // Position for next unique element
  
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  
  return slow + 1; // Length of unique elements
}`
      },
      {
        type: 'heading',
        content: '3. Sliding Window (Two Pointers with Dynamic Range)'
      },
      {
        type: 'paragraph',
        content: 'Both pointers define a window that expands or contracts based on conditions. Used for:'
      },
      {
        type: 'list',
        items: [
          'Finding maximum/minimum subarray sums',
          'Longest substring without repeating characters',
          'Subarray with target sum',
          'Minimum window substring problems'
        ]
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// Example: Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let left = 0;
  let maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    // Shrink window while we have duplicates
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    
    seen.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`
      },
      {
        type: 'heading',
        content: 'When to Use Two Pointers?'
      },
      {
        type: 'paragraph',
        content: 'Consider using the two-pointer technique when you encounter problems with these characteristics:'
      },
      {
        type: 'list',
        items: [
          '🎯 The data structure is ordered or can be sorted',
          '🎯 You need to find pairs, triplets, or subarrays',
          '🎯 The problem asks about relationships between elements',
          '🎯 You want to optimize from O(n²) to O(n)',
          '🎯 The problem mentions "in-place" or "constant space"'
        ]
      },
      {
        type: 'heading',
        content: 'Practice Problems'
      },
      {
        type: 'paragraph',
        content: 'Ready to practice? Try these problems on AlgoLib to master the two-pointer technique:'
      },
      {
        type: 'list',
        items: [
          '1. Two Sum (Sorted Array) - Perfect for learning opposite directional pointers',
          '2. Valid Palindrome - Great introduction to the pattern',
          '3. Container With Most Water - Classic two-pointer optimization',
          '4. Remove Duplicates - Learn fast & slow pointer pattern',
          '5. 3Sum - Advanced: combine two pointers with iteration'
        ]
      },
      {
        type: 'quote',
        content: '💡 Pro Tip: When stuck on an array problem, ask yourself: "Can I use two pointers to avoid nested loops?" This simple question can lead to elegant O(n) solutions!'
      },
      {
        type: 'heading',
        content: 'Try It Yourself!'
      },
      {
        type: 'paragraph',
        content: 'Want to experience the two-pointer technique in action? Check out our interactive Two Pointer Race game where you can practice finding pairs by moving pointers strategically. It\'s a fun way to build intuition for when to move left, when to move right, and how to think like the algorithm!'
      },
      {
        type: 'paragraph',
        content: 'Happy coding, and may your pointers always find their targets! 🎯'
      }
    ]
  }
];

export const getBlogPost = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getRelatedPosts = (currentSlug: string, limit: number = 3): BlogPost[] => {
  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .slice(0, limit);
};
