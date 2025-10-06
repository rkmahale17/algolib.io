export interface AlgorithmImplementation {
  id: string;
  code: {
    typescript: string;
    python: string;
    cpp: string;
    java: string;
  };
  explanation: {
    overview: string;
    steps: string[];
    useCase: string;
    tips: string[];
  };
  visualizationType: 'array' | 'linkedList' | 'tree' | 'graph' | 'matrix' | 'none';
  practiceProblems?: Array<{
    title: string;
    url: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}

export const algorithmImplementations: Record<string, AlgorithmImplementation> = {
  'two-pointers': {
    id: 'two-pointers',
    code: {
      typescript: `function twoPointers(arr: number[], target: number): number[] {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [-1, -1];
}`,
      python: `def two_pointers(arr: list[int], target: int) -> list[int]:
    left = 0
    right = len(arr) - 1
    
    while left < right:
        total = arr[left] + arr[right]
        
        if total == target:
            return [left, right]
        elif total < target:
            left += 1
        else:
            right -= 1
    
    return [-1, -1]`,
      cpp: `#include <vector>
using namespace std;

vector<int> twoPointers(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left < right) {
        int sum = arr[left] + arr[right];
        
        if (sum == target) {
            return {left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return {-1, -1};
}`,
      java: `public class Solution {
    public int[] twoPointers(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left < right) {
            int sum = arr[left] + arr[right];
            
            if (sum == target) {
                return new int[]{left, right};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return new int[]{-1, -1};
    }
}`
    },
    explanation: {
      overview: "Two pointers technique uses two references that traverse the array from different positions, typically from both ends moving toward each other or both from the start at different speeds.",
      steps: [
        "Initialize two pointers: left at the start (index 0) and right at the end (last index)",
        "Calculate the sum of elements at both pointer positions",
        "If sum equals target, return the indices",
        "If sum is less than target, move left pointer right to increase sum",
        "If sum is greater than target, move right pointer left to decrease sum",
        "Continue until pointers meet or target is found"
      ],
      useCase: "Perfect for problems involving sorted arrays where you need to find pairs, remove duplicates, or partition arrays. Common in problems like two sum, container with most water, and palindrome checking.",
      tips: [
        "Works best on sorted arrays",
        "Time complexity: O(n) - single pass",
        "Space complexity: O(1) - no extra space",
        "Can be extended to three pointers for more complex problems"
      ]
    },
    visualizationType: 'array'
  },
  'sliding-window': {
    id: 'sliding-window',
    code: {
      typescript: `function maxSumSubarray(arr: number[], k: number): number {
  let maxSum = 0;
  let windowSum = 0;
  
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}`,
      python: `def max_sum_subarray(arr: list[int], k: int) -> int:
    max_sum = 0
    window_sum = 0
    
    for i in range(k):
        window_sum += arr[i]
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum`,
      cpp: `int maxSumSubarray(vector<int>& arr, int k) {
    int maxSum = 0, windowSum = 0;
    
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    for (int i = k; i < arr.size(); i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}`,
      java: `public int maxSumSubarray(int[] arr, int k) {
    int maxSum = 0, windowSum = 0;
    
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    for (int i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}`
    },
    explanation: {
      overview: "Sliding window maintains a subset of elements and slides through the array, efficiently computing results for each window position without recalculating from scratch.",
      steps: [
        "Define window size k",
        "Calculate the sum/result for the first window of k elements",
        "Slide the window one position: remove leftmost element, add new rightmost element",
        "Update the result based on the new window",
        "Continue until the window reaches the end of the array",
        "Return the optimal result found"
      ],
      useCase: "Ideal for problems involving contiguous subarrays or substrings: maximum sum, minimum length, longest substring with K distinct characters, or finding patterns within fixed/variable window sizes.",
      tips: [
        "Fixed window: size remains constant",
        "Variable window: size changes based on conditions",
        "Time complexity: O(n) - each element visited at most twice",
        "Avoids nested loops for subarray problems"
      ]
    },
    visualizationType: 'array'
  },
  'prefix-sum': {
    id: 'prefix-sum',
    code: {
      typescript: `function prefixSum(arr: number[]): number[] {
  const prefix: number[] = [arr[0]];
  
  for (let i = 1; i < arr.length; i++) {
    prefix[i] = prefix[i - 1] + arr[i];
  }
  
  return prefix;
}

function rangeSum(prefix: number[], left: number, right: number): number {
  if (left === 0) return prefix[right];
  return prefix[right] - prefix[left - 1];
}`,
      python: `def prefix_sum(arr: list[int]) -> list[int]:
    prefix = [arr[0]]
    
    for i in range(1, len(arr)):
        prefix.append(prefix[-1] + arr[i])
    
    return prefix

def range_sum(prefix: list[int], left: int, right: int) -> int:
    if left == 0:
        return prefix[right]
    return prefix[right] - prefix[left - 1]`,
      cpp: `vector<int> prefixSum(vector<int>& arr) {
    vector<int> prefix(arr.size());
    prefix[0] = arr[0];
    
    for (int i = 1; i < arr.size(); i++) {
        prefix[i] = prefix[i - 1] + arr[i];
    }
    
    return prefix;
}

int rangeSum(vector<int>& prefix, int left, int right) {
    if (left == 0) return prefix[right];
    return prefix[right] - prefix[left - 1];
}`,
      java: `public int[] prefixSum(int[] arr) {
    int[] prefix = new int[arr.length];
    prefix[0] = arr[0];
    
    for (int i = 1; i < arr.length; i++) {
        prefix[i] = prefix[i - 1] + arr[i];
    }
    
    return prefix;
}

public int rangeSum(int[] prefix, int left, int right) {
    if (left == 0) return prefix[right];
    return prefix[right] - prefix[left - 1];
}`
    },
    explanation: {
      overview: "Prefix sum pre-computes cumulative sums allowing O(1) range sum queries after O(n) preprocessing.",
      steps: [
        "Initialize prefix array with first element",
        "For each position i, compute prefix[i] = prefix[i-1] + arr[i]",
        "To query range [left, right]: return prefix[right] - prefix[left-1]",
        "Handle edge case when left = 0",
        "Can be extended to 2D matrices for submatrix queries"
      ],
      useCase: "Essential for range query problems, subarray sum problems, finding equilibrium indices, and optimization problems requiring quick sum calculations.",
      tips: [
        "Preprocessing: O(n) time",
        "Query: O(1) time",
        "Space: O(n)",
        "Can be combined with hash maps for subarray sum problems"
      ]
    },
    visualizationType: 'array'
  },
  'binary-search': {
    id: 'binary-search',
    code: {
      typescript: `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
      python: `def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
      cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`,
      java: `public int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`
    },
    explanation: {
      overview: "Binary search efficiently finds an element in a sorted array by repeatedly dividing the search interval in half.",
      steps: [
        "Initialize left and right pointers",
        "Calculate middle index",
        "Compare target with middle element",
        "If equal, return index",
        "If target greater, search right half",
        "If target smaller, search left half",
        "Repeat until found or search space exhausted"
      ],
      useCase: "Essential for searching in sorted data, finding boundaries, search space reduction problems.",
      tips: [
        "Array must be sorted",
        "O(log n) time complexity",
        "Use left + (right - left) / 2 to avoid overflow",
        "Can be applied to answer space"
      ]
    },
    visualizationType: 'array'
  },
  'kadanes-algorithm': {
    id: 'kadanes-algorithm',
    code: {
      typescript: `function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}`,
      python: `def max_sub_array(nums: list[int]) -> int:
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
      cpp: `int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
      java: `public int maxSubArray(int[] nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`
    },
    explanation: {
      overview: "Kadane's algorithm finds the maximum sum of a contiguous subarray in O(n) time using dynamic programming.",
      steps: [
        "Initialize maxSum and currentSum with first element",
        "For each element, decide: start new subarray or extend current",
        "currentSum = max(element, currentSum + element)",
        "Update maxSum if currentSum is larger",
        "Continue through entire array",
        "Return maxSum"
      ],
      useCase: "Classic DP problem for maximum subarray sum, stock profit problems, and optimization problems.",
      tips: [
        "O(n) time, O(1) space",
        "Works with negative numbers",
        "Can be modified to track indices",
        "Foundation for many DP problems"
      ]
    },
    visualizationType: 'array'
  },
  'dutch-national-flag': {
    id: 'dutch-national-flag',
    code: {
      typescript: `function sortColors(nums: number[]): void {
  let low = 0, mid = 0, high = nums.length - 1;
  
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`,
      python: `def sort_colors(nums: list[int]) -> None:
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,
      cpp: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low++], nums[mid++]);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high--]);
        }
    }
}`,
      java: `public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums, low++, mid++);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums, mid, high--);
        }
    }
}`
    },
    explanation: {
      overview: "Three-way partitioning algorithm that sorts an array containing three distinct values in one pass.",
      steps: [
        "Initialize three pointers: low, mid, high",
        "Low tracks position for 0s, high for 2s",
        "Mid scans the array",
        "If 0: swap with low, increment both",
        "If 1: just move mid forward",
        "If 2: swap with high, decrement high",
        "Continue until mid crosses high"
      ],
      useCase: "Sorting arrays with limited distinct values, three-way partitioning, color sorting problems.",
      tips: [
        "O(n) time, single pass",
        "O(1) space, in-place",
        "Don't increment mid when swapping with high",
        "Also called 3-way partition"
      ]
    },
    visualizationType: 'array'
  },
  'reverse-linked-list': {
    id: 'reverse-linked-list',
    code: {
      typescript: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  
  return prev;
}`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    
    return prev`,
      cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    
    while (curr != nullptr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    
    return prev;
}`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    
    return prev;
}`
    },
    explanation: {
      overview: "Reverse a linked list by iteratively changing the direction of next pointers.",
      steps: [
        "Initialize prev as null and curr as head",
        "Save curr.next in temporary variable",
        "Reverse the link: curr.next = prev",
        "Move prev forward to curr",
        "Move curr forward to next",
        "Repeat until curr is null",
        "Return prev as new head"
      ],
      useCase: "Fundamental linked list operation, building block for complex list manipulations.",
      tips: [
        "O(n) time, O(1) space",
        "Can be done recursively",
        "Remember to save next before changing pointers",
        "Practice until automatic"
      ]
    },
    visualizationType: 'linkedList'
  },
  'fast-slow-pointers': {
    id: 'fast-slow-pointers',
    code: {
      typescript: `function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;
  
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    
    if (slow === fast) {
      return true;
    }
  }
  
  return false;
}

function findMiddle(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  
  return slow;
}`,
      python: `def has_cycle(head: ListNode) -> bool:
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False

def find_middle(head: ListNode) -> ListNode:
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow`,
      cpp: `bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) return true;
    }
    
    return false;
}

ListNode* findMiddle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;
}`,
      java: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow == fast) return true;
    }
    
    return false;
}

public ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}`
    },
    explanation: {
      overview: "Floyd's algorithm using two pointers moving at different speeds to detect cycles and find middle nodes.",
      steps: [
        "Initialize slow and fast pointers at head",
        "Move slow by 1 step, fast by 2 steps",
        "For cycle detection: if pointers meet, cycle exists",
        "For middle: when fast reaches end, slow is at middle",
        "Works because fast catches up to slow in a cycle",
        "O(n) time, O(1) space"
      ],
      useCase: "Cycle detection, finding middle node, detecting intersections, linked list problems.",
      tips: [
        "Check fast and fast.next for null",
        "Tortoise and hare analogy",
        "Can find cycle start with additional logic",
        "Foundation for many linked list algorithms"
      ]
    },
    visualizationType: 'linkedList'
  },
  'dfs-preorder': {
    id: 'dfs-preorder',
    code: {
      typescript: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  
  function dfs(node: TreeNode | null) {
    if (!node) return;
    result.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  
  dfs(root);
  return result;
}`,
      python: `def preorder_traversal(root: TreeNode) -> list[int]:
    result = []
    
    def dfs(node):
        if not node:
            return
        result.append(node.val)
        dfs(node.left)
        dfs(node.right)
    
    dfs(root)
    return result`,
      cpp: `void dfs(TreeNode* node, vector<int>& result) {
    if (!node) return;
    result.push_back(node->val);
    dfs(node->left, result);
    dfs(node->right, result);
}

vector<int> preorderTraversal(TreeNode* root) {
    vector<int> result;
    dfs(root, result);
    return result;
}`,
      java: `public List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}

private void dfs(TreeNode node, List<Integer> result) {
    if (node == null) return;
    result.add(node.val);
    dfs(node.left, result);
    dfs(node.right, result);
}`
    },
    explanation: {
      overview: "Preorder DFS visits root first, then left subtree, then right subtree (Root → Left → Right).",
      steps: [
        "Visit and process current node",
        "Recursively traverse left subtree",
        "Recursively traverse right subtree",
        "Base case: return if node is null",
        "Collect values in preorder sequence"
      ],
      useCase: "Tree serialization, creating copy of tree, prefix expression evaluation.",
      tips: [
        "O(n) time - visits each node once",
        "O(h) space - recursion depth",
        "Can use stack for iterative version",
        "Process parent before children"
      ]
    },
    visualizationType: 'tree'
  },
  'dfs-inorder': {
    id: 'dfs-inorder',
    code: {
      typescript: `function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  
  function dfs(node: TreeNode | null) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  
  dfs(root);
  return result;
}`,
      python: `def inorder_traversal(root: TreeNode) -> list[int]:
    result = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)
    
    dfs(root)
    return result`,
      cpp: `void dfs(TreeNode* node, vector<int>& result) {
    if (!node) return;
    dfs(node->left, result);
    result.push_back(node->val);
    dfs(node->right, result);
}

vector<int> inorderTraversal(TreeNode* root) {
    vector<int> result;
    dfs(root, result);
    return result;
}`,
      java: `public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}

private void dfs(TreeNode node, List<Integer> result) {
    if (node == null) return;
    dfs(node.left, result);
    result.add(node.val);
    dfs(node.right, result);
}`
    },
    explanation: {
      overview: "Inorder DFS visits left subtree, then root, then right subtree (Left → Root → Right). Gives sorted order for BST.",
      steps: [
        "Recursively traverse left subtree",
        "Visit and process current node",
        "Recursively traverse right subtree",
        "Base case: return if node is null",
        "For BST, produces sorted sequence"
      ],
      useCase: "Get sorted values from BST, validate BST, expression tree evaluation.",
      tips: [
        "BST inorder gives sorted values",
        "O(n) time, O(h) space",
        "Morris traversal for O(1) space",
        "Most common tree traversal"
      ]
    },
    visualizationType: 'tree'
  },
  'dfs-postorder': {
    id: 'dfs-postorder',
    code: {
      typescript: `function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  
  function dfs(node: TreeNode | null) {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    result.push(node.val);
  }
  
  dfs(root);
  return result;
}`,
      python: `def postorder_traversal(root: TreeNode) -> list[int]:
    result = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        dfs(node.right)
        result.append(node.val)
    
    dfs(root)
    return result`,
      cpp: `void dfs(TreeNode* node, vector<int>& result) {
    if (!node) return;
    dfs(node->left, result);
    dfs(node->right, result);
    result.push_back(node->val);
}

vector<int> postorderTraversal(TreeNode* root) {
    vector<int> result;
    dfs(root, result);
    return result;
}`,
      java: `public List<Integer> postorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}

private void dfs(TreeNode node, List<Integer> result) {
    if (node == null) return;
    dfs(node.left, result);
    dfs(node.right, result);
    result.add(node.val);
}`
    },
    explanation: {
      overview: "Postorder DFS visits left subtree, then right subtree, then root (Left → Right → Root).",
      steps: [
        "Recursively traverse left subtree",
        "Recursively traverse right subtree",
        "Visit and process current node",
        "Base case: return if node is null",
        "Process children before parent"
      ],
      useCase: "Tree deletion, postfix expression evaluation, calculating subtree properties.",
      tips: [
        "Process children before parent",
        "Good for bottom-up calculations",
        "Used in tree destruction",
        "O(n) time, O(h) space"
      ]
    },
    visualizationType: 'tree'
  },
  'bfs-level-order': {
    id: 'bfs-level-order',
    code: {
      typescript: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}`,
      python: `from collections import deque

def level_order(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result`,
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> level;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            level.push_back(node->val);
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        result.push_back(level);
    }
    
    return result;
}`,
      java: `public List<List<Integer>> levelOrder(TreeNode root) {
    if (root == null) return new ArrayList<>();
    
    List<List<Integer>> result = new ArrayList<>();
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> level = new ArrayList<>();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        
        result.add(level);
    }
    
    return result;
}`
    },
    explanation: {
      overview: "BFS traverses tree level by level using a queue, processing all nodes at each depth before moving deeper.",
      steps: [
        "Initialize queue with root",
        "Process current level completely",
        "Track level size to separate levels",
        "Dequeue nodes and add children",
        "Collect values by level",
        "Continue until queue empty"
      ],
      useCase: "Level-order problems, finding level averages, zigzag traversal, tree width.",
      tips: [
        "Use queue for BFS",
        "Track level size for grouping",
        "O(n) time, O(w) space where w is width",
        "Natural for tree width/depth problems"
      ]
    },
    visualizationType: 'tree'
  },
  'graph-dfs': {
    id: 'graph-dfs',
    code: {
      typescript: `function dfs(graph: number[][], start: number): number[] {
  const visited = new Set<number>();
  const result: number[] = [];
  
  function explore(node: number) {
    visited.add(node);
    result.push(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        explore(neighbor);
      }
    }
  }
  
  explore(start);
  return result;
}`,
      python: `def dfs(graph: list[list[int]], start: int) -> list[int]:
    visited = set()
    result = []
    
    def explore(node):
        visited.add(node)
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                explore(neighbor)
    
    explore(start)
    return result`,
      cpp: `void explore(int node, vector<vector<int>>& graph, 
             unordered_set<int>& visited, vector<int>& result) {
    visited.insert(node);
    result.push_back(node);
    
    for (int neighbor : graph[node]) {
        if (visited.find(neighbor) == visited.end()) {
            explore(neighbor, graph, visited, result);
        }
    }
}

vector<int> dfs(vector<vector<int>>& graph, int start) {
    unordered_set<int> visited;
    vector<int> result;
    explore(start, graph, visited, result);
    return result;
}`,
      java: `public List<Integer> dfs(List<List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    List<Integer> result = new ArrayList<>();
    explore(start, graph, visited, result);
    return result;
}

private void explore(int node, List<List<Integer>> graph,
                    Set<Integer> visited, List<Integer> result) {
    visited.add(node);
    result.add(node);
    
    for (int neighbor : graph.get(node)) {
        if (!visited.contains(neighbor)) {
            explore(neighbor, graph, visited, result);
        }
    }
}`
    },
    explanation: {
      overview: "DFS explores graph by going as deep as possible before backtracking, using recursion or stack.",
      steps: [
        "Mark current node as visited",
        "Process current node",
        "Recursively visit all unvisited neighbors",
        "Backtrack when no unvisited neighbors",
        "Continue until all reachable nodes visited"
      ],
      useCase: "Path finding, cycle detection, topological sort, connected components.",
      tips: [
        "O(V + E) time complexity",
        "Use recursion or explicit stack",
        "Mark visited to avoid cycles",
        "Good for pathfinding problems"
      ]
    },
    visualizationType: 'graph'
  },
  'graph-bfs': {
    id: 'graph-bfs',
    code: {
      typescript: `function bfs(graph: number[][], start: number): number[] {
  const visited = new Set<number>();
  const queue: number[] = [start];
  const result: number[] = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
      python: `from collections import deque

def bfs(graph: list[list[int]], start: int) -> list[int]:
    visited = set([start])
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result`,
      cpp: `vector<int> bfs(vector<vector<int>>& graph, int start) {
    unordered_set<int> visited;
    queue<int> q;
    vector<int> result;
    
    visited.insert(start);
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        result.push_back(node);
        
        for (int neighbor : graph[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    
    return result;
}`,
      java: `public List<Integer> bfs(List<List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    List<Integer> result = new ArrayList<>();
    
    visited.add(start);
    queue.offer(start);
    
    while (!queue.isEmpty()) {
        int node = queue.poll();
        result.add(node);
        
        for (int neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.offer(neighbor);
            }
        }
    }
    
    return result;
}`
    },
    explanation: {
      overview: "BFS explores graph level by level using a queue, finding shortest paths in unweighted graphs.",
      steps: [
        "Initialize queue with start node",
        "Mark start as visited",
        "Dequeue node and process",
        "Enqueue all unvisited neighbors",
        "Mark neighbors as visited when adding to queue",
        "Continue until queue empty"
      ],
      useCase: "Shortest path in unweighted graphs, level-based problems, minimum steps.",
      tips: [
        "Use queue (FIFO)",
        "O(V + E) time, O(V) space",
        "Mark visited when adding to queue",
        "Guarantees shortest path in unweighted graphs"
      ]
    },
    visualizationType: 'graph'
  },
  'knapsack-01': {
    id: 'knapsack-01',
    code: {
      typescript: `function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}`,
      python: `def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                )
            else:
                dp[i][w] = dp[i - 1][w]
    
    return dp[n][capacity]`,
      cpp: `int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][capacity];
}`,
      java: `public int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];
    
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][capacity];
}`
    },
    explanation: {
      overview: "Classic DP problem: maximize value of items in knapsack without exceeding weight capacity. Each item used once.",
      steps: [
        "Create DP table: dp[i][w] = max value with first i items and capacity w",
        "For each item and capacity combination",
        "If item fits: choose max of including or excluding it",
        "If doesn't fit: take value without this item",
        "Build solution bottom-up",
        "Return dp[n][capacity]"
      ],
      useCase: "Resource allocation, subset selection with constraints, optimization problems.",
      tips: [
        "O(nW) time where W is capacity",
        "Can optimize space to O(W)",
        "Foundation for many DP problems",
        "Can reconstruct which items to take"
      ]
    },
    visualizationType: 'matrix'
  },
  'merge-intervals': {
    id: 'merge-intervals',
    code: {
      typescript: `function merge(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];
  
  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[][] = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const curr = intervals[i];
    
    if (curr[0] <= last[1]) {
      last[1] = Math.max(last[1], curr[1]);
    } else {
      result.push(curr);
    }
  }
  
  return result;
}`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]
    
    for curr in intervals[1:]:
        last = result[-1]
        
        if curr[0] <= last[1]:
            last[1] = max(last[1], curr[1])
        else:
            result.append(curr)
    
    return result`,
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> result = {intervals[0]};
    
    for (int i = 1; i < intervals.size(); i++) {
        auto& last = result.back();
        auto& curr = intervals[i];
        
        if (curr[0] <= last[1]) {
            last[1] = max(last[1], curr[1]);
        } else {
            result.push_back(curr);
        }
    }
    
    return result;
}`,
      java: `public int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return new int[0][];
    
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> result = new ArrayList<>();
    result.add(intervals[0]);
    
    for (int i = 1; i < intervals.length; i++) {
        int[] last = result.get(result.size() - 1);
        int[] curr = intervals[i];
        
        if (curr[0] <= last[1]) {
            last[1] = Math.max(last[1], curr[1]);
        } else {
            result.add(curr);
        }
    }
    
    return result.toArray(new int[result.size()][]);
}`
    },
    explanation: {
      overview: "Merge overlapping intervals by sorting and combining consecutive overlapping intervals.",
      steps: [
        "Sort intervals by start time",
        "Initialize result with first interval",
        "For each interval, check if it overlaps with last in result",
        "If overlaps, extend the last interval's end",
        "If no overlap, add as new interval",
        "Return merged intervals"
      ],
      useCase: "Meeting rooms, calendar scheduling, time range consolidation.",
      tips: [
        "Always sort first",
        "O(n log n) due to sorting",
        "Compare curr start with last end",
        "Update end to maximum of both"
      ]
    },
    visualizationType: 'array'
  },
  'monotonic-stack': {
    id: 'monotonic-stack',
    code: {
      typescript: `function nextGreaterElement(nums: number[]): number[] {
  const result = new Array(nums.length).fill(-1);
  const stack: number[] = [];
  
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop()!;
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  
  return result;
}`,
      python: `def next_greater_element(nums: list[int]) -> list[int]:
    result = [-1] * len(nums)
    stack = []
    
    for i, num in enumerate(nums):
        while stack and num > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = num
        stack.append(i)
    
    return result`,
      cpp: `vector<int> nextGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;
    
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[i] > nums[st.top()]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    
    return result;
}`,
      java: `public int[] nextGreaterElement(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Stack<Integer> stack = new Stack<>();
    
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
            result[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    
    return result;
}`
    },
    explanation: {
      overview: "Stack that maintains elements in monotonic order to efficiently solve range query problems.",
      steps: [
        "Iterate through array",
        "While stack top is smaller than current (for increasing stack)",
        "Pop and process the top",
        "Push current index",
        "Stack maintains increasing/decreasing order"
      ],
      useCase: "Next greater/smaller element, histogram problems, temperature problems.",
      tips: [
        "O(n) time - each element pushed/popped once",
        "Store indices not values",
        "Increasing stack: pop when curr > top",
        "Decreasing stack: pop when curr < top"
      ]
    },
    visualizationType: 'array'
  },
  'rotate-array': {
    id: 'rotate-array',
    code: {
      typescript: `function rotate(nums: number[], k: number): void {
  k = k % nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}

function reverse(nums: number[], left: number, right: number): void {
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
}`,
      python: `def rotate(nums: list[int], k: int) -> None:
    k = k % len(nums)
    reverse(nums, 0, len(nums) - 1)
    reverse(nums, 0, k - 1)
    reverse(nums, k, len(nums) - 1)

def reverse(nums: list[int], left: int, right: int) -> None:
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1`,
      cpp: `void reverse(vector<int>& nums, int left, int right) {
    while (left < right) {
        swap(nums[left++], nums[right--]);
    }
}

void rotate(vector<int>& nums, int k) {
    k = k % nums.size();
    reverse(nums, 0, nums.size() - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, nums.size() - 1);
}`,
      java: `public void rotate(int[] nums, int k) {
    k = k % nums.length;
    reverse(nums, 0, nums.length - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, nums.length - 1);
}

private void reverse(int[] nums, int left, int right) {
    while (left < right) {
        int temp = nums[left];
        nums[left++] = nums[right];
        nums[right--] = temp;
    }
}`
    },
    explanation: {
      overview: "Rotate array k positions to the right using three reversals - elegant O(1) space solution.",
      steps: [
        "Normalize k by taking modulo with array length",
        "Reverse entire array",
        "Reverse first k elements",
        "Reverse remaining elements",
        "Array is now rotated k positions"
      ],
      useCase: "Array rotation, circular arrays, cyclic shifts.",
      tips: [
        "O(n) time, O(1) space",
        "Three reversals trick",
        "Handle k > n with modulo",
        "Works for both left and right rotation"
      ]
    },
    visualizationType: 'array'
  },
  'cyclic-sort': {
    id: 'cyclic-sort',
    code: {
      typescript: `function cyclicSort(nums: number[]): void {
  let i = 0;
  while (i < nums.length) {
    const correctIdx = nums[i] - 1;
    if (nums[i] !== nums[correctIdx]) {
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
    } else {
      i++;
    }
  }
}`,
      python: `def cyclic_sort(nums: list[int]) -> None:
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1`,
      cpp: `void cyclicSort(vector<int>& nums) {
    int i = 0;
    while (i < nums.size()) {
        int correctIdx = nums[i] - 1;
        if (nums[i] != nums[correctIdx]) {
            swap(nums[i], nums[correctIdx]);
        } else {
            i++;
        }
    }
}`,
      java: `public void cyclicSort(int[] nums) {
    int i = 0;
    while (i < nums.length) {
        int correctIdx = nums[i] - 1;
        if (nums[i] != nums[correctIdx]) {
            int temp = nums[i];
            nums[i] = nums[correctIdx];
            nums[correctIdx] = temp;
        } else {
            i++;
        }
    }
}`
    },
    explanation: {
      overview: "Sort array containing numbers in range [1, n] by placing each number at its correct index.",
      steps: [
        "Iterate through array with index i",
        "Calculate correct position for nums[i]",
        "If number not at correct position, swap it",
        "If already correct, move to next index",
        "Continue until all numbers placed correctly"
      ],
      useCase: "Finding missing/duplicate numbers, array with numbers in specific range.",
      tips: [
        "O(n) time, O(1) space",
        "Only works for numbers 1 to n",
        "Each number visited at most twice",
        "Great for missing number problems"
      ]
    },
    visualizationType: 'array'
  },
  'merge-sorted-lists': {
    id: 'merge-sorted-lists',
    code: {
      typescript: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  
  curr.next = l1 || l2;
  return dummy.next;
}`,
      python: `def merge_two_lists(l1: ListNode, l2: ListNode) -> ListNode:
    dummy = ListNode(0)
    curr = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    
    curr.next = l1 or l2
    return dummy.next`,
      cpp: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* curr = &dummy;
    
    while (l1 && l2) {
        if (l1->val <= l2->val) {
            curr->next = l1;
            l1 = l1->next;
        } else {
            curr->next = l2;
            l2 = l2->next;
        }
        curr = curr->next;
    }
    
    curr->next = l1 ? l1 : l2;
    return dummy.next;
}`,
      java: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode curr = dummy;
    
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }
    
    curr.next = l1 != null ? l1 : l2;
    return dummy.next;
}`
    },
    explanation: {
      overview: "Merge two sorted linked lists into one sorted list using two pointers.",
      steps: [
        "Create dummy node to simplify edge cases",
        "Compare heads of both lists",
        "Attach smaller node to result",
        "Move pointer of chosen list forward",
        "When one list exhausted, attach remaining list",
        "Return dummy.next"
      ],
      useCase: "Merge operations, sorted list manipulation, merge sort for linked lists.",
      tips: [
        "O(n + m) time",
        "Use dummy node pattern",
        "Don't forget to attach remaining list",
        "Can be done recursively too"
      ]
    },
    visualizationType: 'linkedList'
  },
  'detect-cycle': {
    id: 'detect-cycle',
    code: {
      typescript: `function detectCycle(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    
    if (slow === fast) {
      let ptr = head;
      while (ptr !== slow) {
        ptr = ptr!.next;
        slow = slow!.next;
      }
      return ptr;
    }
  }
  
  return null;
}`,
      python: `def detect_cycle(head: ListNode) -> ListNode:
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            ptr = head
            while ptr != slow:
                ptr = ptr.next
                slow = slow.next
            return ptr
    
    return None`,
      cpp: `ListNode* detectCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            ListNode* ptr = head;
            while (ptr != slow) {
                ptr = ptr->next;
                slow = slow->next;
            }
            return ptr;
        }
    }
    
    return nullptr;
}`,
      java: `public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow == fast) {
            ListNode ptr = head;
            while (ptr != slow) {
                ptr = ptr.next;
                slow = slow.next;
            }
            return ptr;
        }
    }
    
    return null;
}`
    },
    explanation: {
      overview: "Floyd's cycle detection algorithm finds the start of a cycle in a linked list.",
      steps: [
        "Use fast and slow pointers",
        "Fast moves 2 steps, slow moves 1 step",
        "If they meet, cycle exists",
        "Reset one pointer to head",
        "Move both one step at a time",
        "They meet at cycle start"
      ],
      useCase: "Cycle detection, finding cycle entry point, linked list problems.",
      tips: [
        "O(n) time, O(1) space",
        "Two-phase algorithm",
        "Mathematical proof behind meeting point",
        "Also called Floyd's tortoise and hare"
      ]
    },
    visualizationType: 'linkedList'
  },
  'middle-node': {
    id: 'middle-node',
    code: {
      typescript: `function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  
  return slow;
}`,
      python: `def middle_node(head: ListNode) -> ListNode:
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow`,
      cpp: `ListNode* middleNode(ListNode* head) {
    ListNode *slow = head, *fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;
}`,
      java: `public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}`
    },
    explanation: {
      overview: "Find middle node of linked list using fast and slow pointers in single pass.",
      steps: [
        "Initialize both pointers at head",
        "Move slow 1 step, fast 2 steps",
        "When fast reaches end, slow is at middle",
        "For even length, returns second middle",
        "Single pass solution"
      ],
      useCase: "Finding middle of list, partitioning lists, palindrome check.",
      tips: [
        "O(n) time, O(1) space",
        "No need to count length",
        "Fast and slow pointer pattern",
        "Returns second middle for even length"
      ]
    },
    visualizationType: 'linkedList'
  },
  'bst-insert': {
    id: 'bst-insert',
    code: {
      typescript: `function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {
  if (!root) return new TreeNode(val);
  
  if (val < root.val) {
    root.left = insertIntoBST(root.left, val);
  } else {
    root.right = insertIntoBST(root.right, val);
  }
  
  return root;
}`,
      python: `def insert_into_bst(root: TreeNode, val: int) -> TreeNode:
    if not root:
        return TreeNode(val)
    
    if val < root.val:
        root.left = insert_into_bst(root.left, val)
    else:
        root.right = insert_into_bst(root.right, val)
    
    return root`,
      cpp: `TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    
    if (val < root->val) {
        root->left = insertIntoBST(root->left, val);
    } else {
        root->right = insertIntoBST(root->right, val);
    }
    
    return root;
}`,
      java: `public TreeNode insertIntoBST(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    
    if (val < root.val) {
        root.left = insertIntoBST(root.left, val);
    } else {
        root.right = insertIntoBST(root.right, val);
    }
    
    return root;
}`
    },
    explanation: {
      overview: "Insert a value into BST while maintaining BST property (left < root < right).",
      steps: [
        "If tree is empty, create new node",
        "Compare value with root",
        "If less, recursively insert in left subtree",
        "If greater, recursively insert in right subtree",
        "Return root after insertion"
      ],
      useCase: "Building BST, maintaining sorted data, dynamic insertion.",
      tips: [
        "O(log n) average, O(n) worst case",
        "Maintains BST property",
        "Can be done iteratively",
        "Consider balancing for large datasets"
      ]
    },
    visualizationType: 'tree'
  },
  'lca': {
    id: 'lca',
    code: {
      typescript: `function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (!root || root === p || root === q) return root;
  
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  if (left && right) return root;
  return left || right;
}`,
      python: `def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    if not root or root == p or root == q:
        return root
    
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    
    if left and right:
        return root
    return left or right`,
      cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    
    if (left && right) return root;
    return left ? left : right;
}`,
      java: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    
    if (left != null && right != null) return root;
    return left != null ? left : right;
}`
    },
    explanation: {
      overview: "Find lowest common ancestor of two nodes in binary tree using recursion.",
      steps: [
        "Base case: if root is null or equals p or q, return root",
        "Recursively search left and right subtrees",
        "If both return non-null, root is LCA",
        "If only one returns non-null, that's the LCA",
        "Elegant post-order traversal solution"
      ],
      useCase: "Finding common ancestor, tree relationships, distance calculations.",
      tips: [
        "O(n) time, single pass",
        "O(h) space for recursion",
        "Works for both BST and binary tree",
        "Post-order traversal pattern"
      ]
    },
    visualizationType: 'tree'
  },
  'trie': {
    id: 'trie',
    code: {
      typescript: `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd: boolean = false;
}

class Trie {
  root = new TrieNode();
  
  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEnd = true;
  }
  
  search(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return node.isEnd;
  }
  
  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return true;
  }
}`,
      python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word: str) -> bool:
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end
    
    def starts_with(self, prefix: str) -> bool:
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`,
      cpp: `class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children[c]) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isEnd = true;
    }
    
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children[c]) return false;
            node = node->children[c];
        }
        return node->isEnd;
    }
    
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->children[c]) return false;
            node = node->children[c];
        }
        return true;
    }
};`,
      java: `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEnd = false;
}

class Trie {
    TrieNode root = new TrieNode();
    
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.isEnd = true;
    }
    
    public boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node = node.children.get(c);
            if (node == null) return false;
        }
        return node.isEnd;
    }
    
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            node = node.children.get(c);
            if (node == null) return false;
        }
        return true;
    }
}`
    },
    explanation: {
      overview: "Prefix tree data structure for efficient string storage and retrieval with common prefixes.",
      steps: [
        "Each node represents a character",
        "Children are stored in hash map",
        "isEnd flag marks complete words",
        "Insert: traverse and create nodes",
        "Search: traverse and check isEnd",
        "Prefix search: traverse only"
      ],
      useCase: "Autocomplete, spell checker, IP routing, dictionary implementation.",
      tips: [
        "O(m) operations where m is word length",
        "Space efficient for shared prefixes",
        "Faster than hash for prefix operations",
        "Can store additional data in nodes"
      ]
    },
    visualizationType: 'tree'
  },
  'topological-sort': {
    id: 'topological-sort',
    code: {
      typescript: `function topologicalSort(numCourses: number, prerequisites: number[][]): number[] {
  const graph: number[][] = Array(numCourses).fill(0).map(() => []);
  const inDegree = new Array(numCourses).fill(0);
  
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }
  
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  
  const result: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    
    for (const neighbor of graph[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  return result.length === numCourses ? result : [];
}`,
      python: `from collections import deque

def topological_sort(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    graph = [[] for _ in range(num_courses)]
    in_degree = [0] * num_courses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == num_courses else []`,
      cpp: `vector<int> topologicalSort(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> inDegree(numCourses, 0);
    
    for (auto& p : prerequisites) {
        graph[p[1]].push_back(p[0]);
        inDegree[p[0]]++;
    }
    
    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) q.push(i);
    }
    
    vector<int> result;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        result.push_back(node);
        
        for (int neighbor : graph[node]) {
            if (--inDegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }
    
    return result.size() == numCourses ? result : vector<int>();
}`,
      java: `public int[] topologicalSort(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) {
        graph.add(new ArrayList<>());
    }
    int[] inDegree = new int[numCourses];
    
    for (int[] p : prerequisites) {
        graph.get(p[1]).add(p[0]);
        inDegree[p[0]]++;
    }
    
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) queue.offer(i);
    }
    
    int[] result = new int[numCourses];
    int idx = 0;
    
    while (!queue.isEmpty()) {
        int node = queue.poll();
        result[idx++] = node;
        
        for (int neighbor : graph.get(node)) {
            if (--inDegree[neighbor] == 0) {
                queue.offer(neighbor);
            }
        }
    }
    
    return idx == numCourses ? result : new int[0];
}`
    },
    explanation: {
      overview: "Kahn's algorithm for topological sorting using BFS and in-degree tracking.",
      steps: [
        "Build adjacency list and calculate in-degrees",
        "Add all nodes with in-degree 0 to queue",
        "Process nodes from queue",
        "Reduce in-degree of neighbors",
        "Add neighbors with in-degree 0 to queue",
        "If all nodes processed, return order; else cycle exists"
      ],
      useCase: "Course scheduling, task dependencies, build systems, compilation order.",
      tips: [
        "O(V + E) time complexity",
        "Detects cycles (empty result)",
        "BFS-based (Kahn's algorithm)",
        "Can also use DFS approach"
      ]
    },
    visualizationType: 'graph'
  },
  'union-find': {
    id: 'union-find',
    code: {
      typescript: `class UnionFind {
  parent: number[];
  rank: number[];
  
  constructor(n: number) {
    this.parent = Array(n).fill(0).map((_, i) => i);
    this.rank = Array(n).fill(1);
  }
  
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  
  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return false;
    
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    
    return true;
  }
}`,
      python: `class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [1] * n
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        return True`,
      cpp: `class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int rootX = find(x), rootY = find(y);
        
        if (rootX == rootY) return false;
        
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        return true;
    }
};`,
      java: `class UnionFind {
    int[] parent, rank;
    
    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 1;
        }
    }
    
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    public boolean union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        
        if (rootX == rootY) return false;
        
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        return true;
    }
}`
    },
    explanation: {
      overview: "Disjoint set data structure with path compression and union by rank for efficient set operations.",
      steps: [
        "Initialize: each element is its own parent",
        "Find: recursively find root with path compression",
        "Union: connect roots of two sets",
        "Union by rank: attach smaller tree to larger",
        "Path compression flattens tree structure",
        "Near O(1) amortized time"
      ],
      useCase: "Connected components, cycle detection, Kruskal's MST, network connectivity.",
      tips: [
        "O(α(n)) amortized time per operation",
        "Path compression in find",
        "Union by rank for balance",
        "Essential for graph algorithms"
      ]
    },
    visualizationType: 'graph'
  },
  'dijkstras': {
    id: 'dijkstras',
    code: {
      typescript: `function dijkstra(graph: number[][][], start: number): number[] {
  const n = graph.length;
  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;
  
  const pq: [number, number][] = [[0, start]]; // [distance, node]
  
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    
    if (d > dist[u]) continue;
    
    for (const [v, weight] of graph[u]) {
      const newDist = dist[u] + weight;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        pq.push([newDist, v]);
      }
    }
  }
  
  return dist;
}`,
      python: `import heapq

def dijkstra(graph: list[list[tuple[int, int]]], start: int) -> list[int]:
    n = len(graph)
    dist = [float('inf')] * n
    dist[start] = 0
    
    pq = [(0, start)]  # (distance, node)
    
    while pq:
        d, u = heapq.heappop(pq)
        
        if d > dist[u]:
            continue
        
        for v, weight in graph[u]:
            new_dist = dist[u] + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(pq, (new_dist, v))
    
    return dist`,
      cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>>& graph, int start) {
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    dist[start] = 0;
    
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, start});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        
        if (d > dist[u]) continue;
        
        for (auto [v, weight] : graph[u]) {
            int newDist = dist[u] + weight;
            if (newDist < dist[v]) {
                dist[v] = newDist;
                pq.push({newDist, v});
            }
        }
    }
    
    return dist;
}`,
      java: `public int[] dijkstra(List<List<int[]>> graph, int start) {
    int n = graph.size();
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;
    
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, start});
    
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0], u = curr[1];
        
        if (d > dist[u]) continue;
        
        for (int[] edge : graph.get(u)) {
            int v = edge[0], weight = edge[1];
            int newDist = dist[u] + weight;
            if (newDist < dist[v]) {
                dist[v] = newDist;
                pq.offer(new int[]{newDist, v});
            }
        }
    }
    
    return dist;
}`
    },
    explanation: {
      overview: "Finds shortest paths from source to all vertices in weighted graph using greedy approach with priority queue.",
      steps: [
        "Initialize distances to infinity except source (0)",
        "Use min-heap priority queue",
        "Extract minimum distance node",
        "Relax all neighbors (update if shorter path found)",
        "Add updated neighbors to queue",
        "Continue until queue empty"
      ],
      useCase: "GPS navigation, network routing, flight paths, any shortest path problem.",
      tips: [
        "O((V+E) log V) with binary heap",
        "Greedy algorithm",
        "Doesn't work with negative weights",
        "Can track paths with parent array"
      ]
    },
    visualizationType: 'graph'
  },
  'coin-change': {
    id: 'coin-change',
    code: {
      typescript: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if i >= coin:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1`,
      cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i >= coin && dp[i - coin] != INT_MAX) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
      java: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i >= coin && dp[i - coin] != Integer.MAX_VALUE) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
}`
    },
    explanation: {
      overview: "Find minimum number of coins needed to make amount using dynamic programming.",
      steps: [
        "Create DP array of size amount + 1",
        "Initialize dp[0] = 0, others = infinity",
        "For each amount from 1 to target",
        "Try each coin denomination",
        "Update minimum coins needed",
        "Return dp[amount] or -1 if impossible"
      ],
      useCase: "Making change, resource optimization, unbounded knapsack variant.",
      tips: [
        "O(amount * coins) time",
        "O(amount) space",
        "Bottom-up DP",
        "Can track which coins used"
      ]
    },
    visualizationType: 'matrix'
  },
  'lcs': {
    id: 'lcs',
    code: {
      typescript: `function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`,
      python: `def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[m][n]`,
      cpp: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.length(), n = text2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}`,
      java: `public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}`
    },
    explanation: {
      overview: "Find length of longest subsequence common to both strings using 2D DP.",
      steps: [
        "Create (m+1) x (n+1) DP table",
        "If characters match: dp[i][j] = dp[i-1][j-1] + 1",
        "If don't match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
        "Build solution bottom-up",
        "Return dp[m][n]",
        "Can reconstruct actual subsequence"
      ],
      useCase: "Diff tools, DNA sequence alignment, version control, text comparison.",
      tips: [
        "O(mn) time and space",
        "Can optimize space to O(min(m,n))",
        "Classic 2D DP",
        "Similar to edit distance"
      ]
    },
    visualizationType: 'matrix'
  },
  'lis': {
    id: 'lis',
    code: {
      typescript: `function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];
  
  for (const num of nums) {
    let left = 0, right = tails.length;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }
  
  return tails.length;
}`,
      python: `def length_of_lis(nums: list[int]) -> int:
    tails = []
    
    for num in nums:
        left, right = 0, len(tails)
        
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid
        
        if left == len(tails):
            tails.append(num)
        else:
            tails[left] = num
    
    return len(tails)`,
      cpp: `int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    
    for (int num : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), num);
        
        if (it == tails.end()) {
            tails.push_back(num);
        } else {
            *it = num;
        }
    }
    
    return tails.size();
}`,
      java: `public int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    
    for (int num : nums) {
        int left = 0, right = tails.size();
        
        while (left < right) {
            int mid = (left + right) / 2;
            if (tails.get(mid) < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        if (left == tails.size()) {
            tails.add(num);
        } else {
            tails.set(left, num);
        }
    }
    
    return tails.size();
}`
    },
    explanation: {
      overview: "Find length of longest increasing subsequence using binary search approach for O(n log n) time.",
      steps: [
        "Maintain array of smallest tail elements",
        "For each number, binary search for position",
        "If larger than all, append",
        "Otherwise, replace element at found position",
        "Length of tails array is LIS length",
        "Patience sorting algorithm"
      ],
      useCase: "Sequence analysis, stock trading, scheduling problems.",
      tips: [
        "O(n log n) optimal time",
        "Binary search optimization",
        "Tails array not actual LIS",
        "Can reconstruct actual sequence with extra work"
      ]
    },
    visualizationType: 'array'
  },
  'edit-distance': {
    id: 'edit-distance',
    code: {
      typescript: `function minDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length;
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j],     // delete
          dp[i][j - 1],     // insert
          dp[i - 1][j - 1]  // replace
        ) + 1;
      }
    }
  }
  
  return dp[m][n];
}`,
      python: `def min_distance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = min(
                    dp[i - 1][j],      # delete
                    dp[i][j - 1],      # insert
                    dp[i - 1][j - 1]   # replace
                ) + 1
    
    return dp[m][n]`,
      cpp: `int minDistance(string word1, string word2) {
    int m = word1.length(), n = word2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));
    
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = min({
                    dp[i - 1][j],
                    dp[i][j - 1],
                    dp[i - 1][j - 1]
                }) + 1;
            }
        }
    }
    
    return dp[m][n];
}`,
      java: `public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(Math.min(
                    dp[i - 1][j],
                    dp[i][j - 1]),
                    dp[i - 1][j - 1]
                ) + 1;
            }
        }
    }
    
    return dp[m][n];
}`
    },
    explanation: {
      overview: "Levenshtein distance: minimum edits (insert, delete, replace) to transform one string to another.",
      steps: [
        "Create (m+1) x (n+1) DP table",
        "Initialize base cases (empty string conversions)",
        "If characters match: copy diagonal value",
        "If differ: 1 + min(insert, delete, replace)",
        "Build bottom-up",
        "Return dp[m][n]"
      ],
      useCase: "Spell checkers, DNA analysis, plagiarism detection, fuzzy matching.",
      tips: [
        "O(mn) time and space",
        "Also called Levenshtein distance",
        "Can optimize space to O(min(m,n))",
        "Three operations: insert, delete, replace"
      ]
    },
    visualizationType: 'matrix'
  },
  'house-robber': {
    id: 'house-robber',
    code: {
      typescript: `function rob(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  let prev2 = 0;
  let prev1 = 0;
  
  for (const num of nums) {
    const temp = prev1;
    prev1 = Math.max(prev1, prev2 + num);
    prev2 = temp;
  }
  
  return prev1;
}`,
      python: `def rob(nums: list[int]) -> int:
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2, prev1 = 0, 0
    
    for num in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + num)
    
    return prev1`,
      cpp: `int rob(vector<int>& nums) {
    if (nums.empty()) return 0;
    if (nums.size() == 1) return nums[0];
    
    int prev2 = 0, prev1 = 0;
    
    for (int num : nums) {
        int temp = prev1;
        prev1 = max(prev1, prev2 + num);
        prev2 = temp;
    }
    
    return prev1;
}`,
      java: `public int rob(int[] nums) {
    if (nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];
    
    int prev2 = 0, prev1 = 0;
    
    for (int num : nums) {
        int temp = prev1;
        prev1 = Math.max(prev1, prev2 + num);
        prev2 = temp;
    }
    
    return prev1;
}`
    },
    explanation: {
      overview: "Maximum sum without taking adjacent elements using DP with O(1) space optimization.",
      steps: [
        "For each house, decide: rob it or skip it",
        "If rob: take value + max from 2 houses back",
        "If skip: take max from previous house",
        "Use two variables to track previous states",
        "Space optimized from O(n) to O(1)",
        "Return final maximum"
      ],
      useCase: "Non-adjacent selection, scheduling with constraints, optimization.",
      tips: [
        "O(n) time, O(1) space",
        "Space-optimized DP",
        "Only need last two states",
        "Can extend to circular array"
      ]
    },
    visualizationType: 'array'
  },
  'climbing-stairs': {
    id: 'climbing-stairs',
    code: {
      typescript: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  
  let prev2 = 1;
  let prev1 = 2;
  
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  
  return prev1;
}`,
      python: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    
    return prev1`,
      cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    
    int prev2 = 1, prev1 = 2;
    
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}`,
      java: `public int climbStairs(int n) {
    if (n <= 2) return n;
    
    int prev2 = 1, prev1 = 2;
    
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}`
    },
    explanation: {
      overview: "Count ways to climb n stairs (1 or 2 steps at a time) - basically Fibonacci sequence.",
      steps: [
        "Base cases: 1 way for 1 stair, 2 ways for 2 stairs",
        "For each stair: ways = ways[i-1] + ways[i-2]",
        "Can reach from 1 step back or 2 steps back",
        "Use two variables (space optimization)",
        "Fibonacci pattern",
        "Return final count"
      ],
      useCase: "Counting problems, path counting, Fibonacci applications.",
      tips: [
        "O(n) time, O(1) space",
        "Fibonacci sequence in disguise",
        "Can extend to k steps",
        "Simple intro to DP"
      ]
    },
    visualizationType: 'array'
  },
  'subsets': {
    id: 'subsets',
    code: {
      typescript: `function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  
  function backtrack(start: number, path: number[]) {
    result.push([...path]);
    
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  
  backtrack(0, []);
  return result;
}`,
      python: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    
    def backtrack(start: int, path: list[int]):
        result.append(path[:])
        
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result`,
      cpp: `void backtrack(vector<int>& nums, int start, vector<int>& path, 
                vector<vector<int>>& result) {
    result.push_back(path);
    
    for (int i = start; i < nums.size(); i++) {
        path.push_back(nums[i]);
        backtrack(nums, i + 1, path, result);
        path.pop_back();
    }
}

vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result;
    vector<int> path;
    backtrack(nums, 0, path, result);
    return result;
}`,
      java: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] nums, int start, List<Integer> path, 
                       List<List<Integer>> result) {
    result.add(new ArrayList<>(path));
    
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(nums, i + 1, path, result);
        path.remove(path.size() - 1);
    }
}`
    },
    explanation: {
      overview: "Generate all possible subsets (power set) using backtracking.",
      steps: [
        "Add current path to result (including empty set)",
        "For each remaining element",
        "Include element in path",
        "Recursively explore further",
        "Backtrack by removing element",
        "Continue to next element"
      ],
      useCase: "Combinatorial problems, power set generation, selection problems.",
      tips: [
        "O(2^n * n) time - 2^n subsets",
        "Backtracking template",
        "Add result at each step",
        "Can also use bit manipulation"
      ]
    },
    visualizationType: 'none'
  },
  'permutations': {
    id: 'permutations',
    code: {
      typescript: `function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  
  function backtrack(path: number[], used: boolean[]) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      
      path.push(nums[i]);
      used[i] = true;
      backtrack(path, used);
      path.pop();
      used[i] = false;
    }
  }
  
  backtrack([], new Array(nums.length).fill(false));
  return result;
}`,
      python: `def permute(nums: list[int]) -> list[list[int]]:
    result = []
    
    def backtrack(path: list[int], used: list[bool]):
        if len(path) == len(nums):
            result.append(path[:])
            return
        
        for i in range(len(nums)):
            if used[i]:
                continue
            
            path.append(nums[i])
            used[i] = True
            backtrack(path, used)
            path.pop()
            used[i] = False
    
    backtrack([], [False] * len(nums))
    return result`,
      cpp: `void backtrack(vector<int>& nums, vector<int>& path, vector<bool>& used,
                vector<vector<int>>& result) {
    if (path.size() == nums.size()) {
        result.push_back(path);
        return;
    }
    
    for (int i = 0; i < nums.size(); i++) {
        if (used[i]) continue;
        
        path.push_back(nums[i]);
        used[i] = true;
        backtrack(nums, path, used, result);
        path.pop_back();
        used[i] = false;
    }
}

vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> result;
    vector<int> path;
    vector<bool> used(nums.size(), false);
    backtrack(nums, path, used, result);
    return result;
}`,
      java: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, new ArrayList<>(), new boolean[nums.length], result);
    return result;
}

private void backtrack(int[] nums, List<Integer> path, boolean[] used,
                       List<List<Integer>> result) {
    if (path.size() == nums.length) {
        result.add(new ArrayList<>(path));
        return;
    }
    
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        
        path.add(nums[i]);
        used[i] = true;
        backtrack(nums, path, used, result);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}`
    },
    explanation: {
      overview: "Generate all permutations using backtracking with used array to track visited elements.",
      steps: [
        "Use path array and used boolean array",
        "If path length equals input length, add to result",
        "Try each unused element",
        "Mark as used and add to path",
        "Recursively continue",
        "Backtrack: remove and mark unused"
      ],
      useCase: "Arrangement problems, scheduling, ordering problems.",
      tips: [
        "O(n! * n) time complexity",
        "n! permutations total",
        "Track used elements",
        "Classic backtracking"
      ]
    },
    visualizationType: 'none'
  },
  'n-queens': {
    id: 'n-queens',
    code: {
      typescript: `function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const board: string[][] = Array(n).fill(0).map(() => Array(n).fill('.'));
  
  function isValid(row: number, col: number): boolean {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    return true;
  }
  
  function backtrack(row: number) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.';
      }
    }
  }
  
  backtrack(0);
  return result;
}`,
      python: `def solve_n_queens(n: int) -> list[list[str]]:
    result = []
    board = [['.'] * n for _ in range(n)]
    
    def is_valid(row: int, col: int) -> bool:
        for i in range(row):
            if board[i][col] == 'Q':
                return False
        i, j = row - 1, col - 1
        while i >= 0 and j >= 0:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j -= 1
        i, j = row - 1, col + 1
        while i >= 0 and j < n:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j += 1
        return True
    
    def backtrack(row: int):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        
        for col in range(n):
            if is_valid(row, col):
                board[row][col] = 'Q'
                backtrack(row + 1)
                board[row][col] = '.'
    
    backtrack(0)
    return result`,
      cpp: `class Solution {
    vector<vector<string>> result;
    
    bool isValid(vector<string>& board, int row, int col, int n) {
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q') return false;
        }
        return true;
    }
    
    void backtrack(vector<string>& board, int row, int n) {
        if (row == n) {
            result.push_back(board);
            return;
        }
        
        for (int col = 0; col < n; col++) {
            if (isValid(board, row, col, n)) {
                board[row][col] = 'Q';
                backtrack(board, row + 1, n);
                board[row][col] = '.';
            }
        }
    }
    
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<string> board(n, string(n, '.'));
        backtrack(board, 0, n);
        return result;
    }
};`,
      java: `public List<List<String>> solveNQueens(int n) {
    List<List<String>> result = new ArrayList<>();
    char[][] board = new char[n][n];
    for (char[] row : board) Arrays.fill(row, '.');
    backtrack(board, 0, result);
    return result;
}

private boolean isValid(char[][] board, int row, int col) {
    int n = board.length;
    for (int i = 0; i < row; i++) {
        if (board[i][col] == 'Q') return false;
    }
    for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 'Q') return false;
    }
    for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
        if (board[i][j] == 'Q') return false;
    }
    return true;
}

private void backtrack(char[][] board, int row, List<List<String>> result) {
    if (row == board.length) {
        List<String> config = new ArrayList<>();
        for (char[] r : board) config.add(new String(r));
        result.add(config);
        return;
    }
    
    for (int col = 0; col < board.length; col++) {
        if (isValid(board, row, col)) {
            board[row][col] = 'Q';
            backtrack(board, row + 1, result);
            board[row][col] = '.';
        }
    }
}`
    },
    explanation: {
      overview: "Place N queens on N×N board so no two queens attack each other using backtracking.",
      steps: [
        "Place queens row by row",
        "For each column in current row",
        "Check if position is valid (no attacks)",
        "Check column, diagonal, anti-diagonal",
        "If valid, place queen and recurse",
        "Backtrack if no solution found"
      ],
      useCase: "Classic constraint satisfaction, puzzle solving, backtracking practice.",
      tips: [
        "O(N!) time complexity",
        "Check columns and diagonals",
        "Can optimize with sets for attacks",
        "Famous computer science problem"
      ]
    },
    visualizationType: 'matrix'
  },
  'xor-trick': {
    id: 'xor-trick',
    code: {
      typescript: `function singleNumber(nums: number[]): number {
  let result = 0;
  for (const num of nums) {
    result ^= num;
  }
  return result;
}`,
      python: `def single_number(nums: list[int]) -> int:
    result = 0
    for num in nums:
        result ^= num
    return result`,
      cpp: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num;
    }
    return result;
}`,
      java: `public int singleNumber(int[] nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num;
    }
    return result;
}`
    },
    explanation: {
      overview: "XOR all elements to find the single non-duplicate number - elegant bit manipulation trick.",
      steps: [
        "Initialize result to 0",
        "XOR result with each number",
        "Duplicates cancel out (a XOR a = 0)",
        "0 XOR a = a",
        "Single number remains",
        "O(1) space solution"
      ],
      useCase: "Finding unique element, bit manipulation problems, space optimization.",
      tips: [
        "O(n) time, O(1) space",
        "XOR properties: a^a=0, a^0=a",
        "Commutative and associative",
        "Works for any odd occurrence"
      ]
    },
    visualizationType: 'array'
  },
  'count-bits': {
    id: 'count-bits',
    code: {
      typescript: `function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n &= (n - 1);
    count++;
  }
  return count;
}`,
      python: `def hamming_weight(n: int) -> int:
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count`,
      cpp: `int hammingWeight(uint32_t n) {
    int count = 0;
    while (n) {
        n &= (n - 1);
        count++;
    }
    return count;
}`,
      java: `public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}`
    },
    explanation: {
      overview: "Brian Kernighan's algorithm to count set bits by repeatedly clearing rightmost 1.",
      steps: [
        "While n is not zero",
        "Do n &= (n-1) to clear rightmost 1 bit",
        "Increment counter",
        "Repeat until all bits cleared",
        "Return count"
      ],
      useCase: "Counting set bits, bit manipulation, Hamming weight calculation.",
      tips: [
        "O(number of 1-bits) time",
        "More efficient than checking each bit",
        "n & (n-1) removes rightmost 1",
        "Named after Brian Kernighan"
      ]
    },
    visualizationType: 'none'
  },
  'kth-largest': {
    id: 'kth-largest',
    code: {
      typescript: `function findKthLargest(nums: number[], k: number): number {
  const minHeap: number[] = [];
  
  function heapify() {
    for (let i = Math.floor(minHeap.length / 2) - 1; i >= 0; i--) {
      siftDown(i);
    }
  }
  
  function siftDown(i: number) {
    const n = minHeap.length;
    let smallest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && minHeap[left] < minHeap[smallest]) smallest = left;
    if (right < n && minHeap[right] < minHeap[smallest]) smallest = right;
    
    if (smallest !== i) {
      [minHeap[i], minHeap[smallest]] = [minHeap[smallest], minHeap[i]];
      siftDown(smallest);
    }
  }
  
  for (const num of nums) {
    minHeap.push(num);
    if (minHeap.length > k) {
      heapify();
      minHeap[0] = minHeap[minHeap.length - 1];
      minHeap.pop();
      siftDown(0);
    }
  }
  
  return minHeap[0];
}`,
      python: `import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    min_heap = []
    
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    
    return min_heap[0]`,
      cpp: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    
    return minHeap.top();
}`,
      java: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }
    
    return minHeap.peek();
}`
    },
    explanation: {
      overview: "Find kth largest element using min heap of size k - efficient O(n log k) solution.",
      steps: [
        "Maintain min heap of size k",
        "Add each element to heap",
        "If size exceeds k, remove smallest",
        "Heap always contains k largest elements",
        "Root is kth largest",
        "Return heap top"
      ],
      useCase: "Top-K problems, finding medians, streaming data analysis.",
      tips: [
        "O(n log k) time",
        "O(k) space",
        "Use min heap not max heap",
        "QuickSelect is O(n) average"
      ]
    },
    visualizationType: 'array'
  },
  'gcd-euclidean': {
    id: 'gcd-euclidean',
    code: {
      typescript: `function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}`,
      python: `def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a`,
      cpp: `int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`,
      java: `public int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`
    },
    explanation: {
      overview: "Euclid's algorithm for finding greatest common divisor using remainder operation.",
      steps: [
        "While b is not zero",
        "Calculate remainder a % b",
        "Replace a with b",
        "Replace b with remainder",
        "When b becomes 0, a is GCD",
        "Based on gcd(a,b) = gcd(b, a%b)"
      ],
      useCase: "Fraction simplification, cryptography, number theory problems.",
      tips: [
        "O(log(min(a,b))) time",
        "Ancient algorithm (300 BC)",
        "Can be done recursively",
        "Foundation for many algorithms"
      ]
    },
    visualizationType: 'none'
  },
  'sieve-eratosthenes': {
    id: 'sieve-eratosthenes',
    code: {
      typescript: `function sieveOfEratosthenes(n: number): number[] {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  
  return primes;
}`,
      python: `def sieve_of_eratosthenes(n: int) -> list[int]:
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
    
    return [i for i in range(2, n + 1) if is_prime[i]]`,
      cpp: `vector<int> sieveOfEratosthenes(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    
    for (int i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    vector<int> primes;
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push_back(i);
    }
    
    return primes;
}`,
      java: `public List<Integer> sieveOfEratosthenes(int n) {
    boolean[] isPrime = new boolean[n + 1];
    Arrays.fill(isPrime, true);
    isPrime[0] = isPrime[1] = false;
    
    for (int i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    List<Integer> primes = new ArrayList<>();
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.add(i);
    }
    
    return primes;
}`
    },
    explanation: {
      overview: "Ancient algorithm to find all prime numbers up to n by iteratively marking multiples of primes as composite.",
      steps: [
        "Create boolean array of size n+1, all true",
        "Mark 0 and 1 as not prime",
        "For each number i from 2 to √n",
        "If i is prime, mark all multiples as not prime",
        "Start from i² (smaller multiples already marked)",
        "Collect all unmarked numbers"
      ],
      useCase: "Prime generation, number theory, cryptography, mathematical problems.",
      tips: [
        "O(n log log n) time",
        "O(n) space",
        "Start marking from i²",
        "Only iterate up to √n"
      ]
    },
    visualizationType: 'array'
  },
  'segment-tree': {
    id: 'segment-tree',
    code: {
      typescript: `class SegmentTree {
  tree: number[];
  n: number;
  
  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(arr, 0, 0, this.n - 1);
  }
  
  build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }
    
    const mid = Math.floor((start + end) / 2);
    this.build(arr, 2 * node + 1, start, mid);
    this.build(arr, 2 * node + 2, mid + 1, end);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }
  
  query(l: number, r: number): number {
    return this.queryHelper(0, 0, this.n - 1, l, r);
  }
  
  queryHelper(node: number, start: number, end: number, l: number, r: number): number {
    if (r < start || l > end) return 0;
    if (l <= start && end <= r) return this.tree[node];
    
    const mid = Math.floor((start + end) / 2);
    return this.queryHelper(2 * node + 1, start, mid, l, r) +
           this.queryHelper(2 * node + 2, mid + 1, end, l, r);
  }
  
  update(idx: number, val: number): void {
    this.updateHelper(0, 0, this.n - 1, idx, val);
  }
  
  updateHelper(node: number, start: number, end: number, idx: number, val: number): void {
    if (start === end) {
      this.tree[node] = val;
      return;
    }
    
    const mid = Math.floor((start + end) / 2);
    if (idx <= mid) {
      this.updateHelper(2 * node + 1, start, mid, idx, val);
    } else {
      this.updateHelper(2 * node + 2, mid + 1, end, idx, val);
    }
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }
}`,
      python: `class SegmentTree:
    def __init__(self, arr: list[int]):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.build(arr, 0, 0, self.n - 1)
    
    def build(self, arr: list[int], node: int, start: int, end: int):
        if start == end:
            self.tree[node] = arr[start]
            return
        
        mid = (start + end) // 2
        self.build(arr, 2 * node + 1, start, mid)
        self.build(arr, 2 * node + 2, mid + 1, end)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def query(self, l: int, r: int) -> int:
        return self._query_helper(0, 0, self.n - 1, l, r)
    
    def _query_helper(self, node: int, start: int, end: int, l: int, r: int) -> int:
        if r < start or l > end:
            return 0
        if l <= start and end <= r:
            return self.tree[node]
        
        mid = (start + end) // 2
        return (self._query_helper(2 * node + 1, start, mid, l, r) +
                self._query_helper(2 * node + 2, mid + 1, end, l, r))
    
    def update(self, idx: int, val: int):
        self._update_helper(0, 0, self.n - 1, idx, val)
    
    def _update_helper(self, node: int, start: int, end: int, idx: int, val: int):
        if start == end:
            self.tree[node] = val
            return
        
        mid = (start + end) // 2
        if idx <= mid:
            self._update_helper(2 * node + 1, start, mid, idx, val)
        else:
            self._update_helper(2 * node + 2, mid + 1, end, idx, val)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]`,
      cpp: `class SegmentTree {
    vector<int> tree;
    int n;
    
    void build(vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        
        int mid = (start + end) / 2;
        build(arr, 2 * node + 1, start, mid);
        build(arr, 2 * node + 2, mid + 1, end);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
    
    int queryHelper(int node, int start, int end, int l, int r) {
        if (r < start || l > end) return 0;
        if (l <= start && end <= r) return tree[node];
        
        int mid = (start + end) / 2;
        return queryHelper(2 * node + 1, start, mid, l, r) +
               queryHelper(2 * node + 2, mid + 1, end, l, r);
    }
    
    void updateHelper(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
            return;
        }
        
        int mid = (start + end) / 2;
        if (idx <= mid) {
            updateHelper(2 * node + 1, start, mid, idx, val);
        } else {
            updateHelper(2 * node + 2, mid + 1, end, idx, val);
        }
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
    
public:
    SegmentTree(vector<int>& arr) {
        n = arr.size();
        tree.resize(4 * n);
        build(arr, 0, 0, n - 1);
    }
    
    int query(int l, int r) {
        return queryHelper(0, 0, n - 1, l, r);
    }
    
    void update(int idx, int val) {
        updateHelper(0, 0, n - 1, idx, val);
    }
};`,
      java: `class SegmentTree {
    int[] tree;
    int n;
    
    public SegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        build(arr, 0, 0, n - 1);
    }
    
    private void build(int[] arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        
        int mid = (start + end) / 2;
        build(arr, 2 * node + 1, start, mid);
        build(arr, 2 * node + 2, mid + 1, end);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
    
    public int query(int l, int r) {
        return queryHelper(0, 0, n - 1, l, r);
    }
    
    private int queryHelper(int node, int start, int end, int l, int r) {
        if (r < start || l > end) return 0;
        if (l <= start && end <= r) return tree[node];
        
        int mid = (start + end) / 2;
        return queryHelper(2 * node + 1, start, mid, l, r) +
               queryHelper(2 * node + 2, mid + 1, end, l, r);
    }
    
    public void update(int idx, int val) {
        updateHelper(0, 0, n - 1, idx, val);
    }
    
    private void updateHelper(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
            return;
        }
        
        int mid = (start + end) / 2;
        if (idx <= mid) {
            updateHelper(2 * node + 1, start, mid, idx, val);
        } else {
            updateHelper(2 * node + 2, mid + 1, end, idx, val);
        }
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
}`
    },
    explanation: {
      overview: "Tree data structure for efficient range queries and updates in O(log n) time.",
      steps: [
        "Build tree recursively from array",
        "Each node stores aggregate (sum/min/max) of range",
        "Query: combine results from relevant nodes",
        "Update: modify leaf and propagate to root",
        "Tree has 4n nodes for n elements",
        "Supports range queries and point updates"
      ],
      useCase: "Range sum/min/max queries, dynamic array operations, competitive programming.",
      tips: [
        "O(log n) query and update",
        "O(n) build time",
        "Needs 4n space",
        "Can handle various aggregate functions"
      ]
    },
    visualizationType: 'tree'
  },
  'sparse-table': {
    id: 'sparse-table',
    code: {
      typescript: `class SparseTable {
  st: number[][];
  n: number;
  
  constructor(arr: number[]) {
    this.n = arr.length;
    const maxLog = Math.floor(Math.log2(this.n)) + 1;
    this.st = Array(this.n).fill(0).map(() => Array(maxLog).fill(0));
    
    for (let i = 0; i < this.n; i++) {
      this.st[i][0] = arr[i];
    }
    
    for (let j = 1; j < maxLog; j++) {
      for (let i = 0; i + (1 << j) <= this.n; i++) {
        this.st[i][j] = Math.min(this.st[i][j - 1], this.st[i + (1 << (j - 1))][j - 1]);
      }
    }
  }
  
  query(l: number, r: number): number {
    const len = r - l + 1;
    const k = Math.floor(Math.log2(len));
    return Math.min(this.st[l][k], this.st[r - (1 << k) + 1][k]);
  }
}`,
      python: `import math

class SparseTable:
    def __init__(self, arr: list[int]):
        self.n = len(arr)
        max_log = math.floor(math.log2(self.n)) + 1
        self.st = [[0] * max_log for _ in range(self.n)]
        
        for i in range(self.n):
            self.st[i][0] = arr[i]
        
        for j in range(1, max_log):
            i = 0
            while i + (1 << j) <= self.n:
                self.st[i][j] = min(self.st[i][j - 1], 
                                    self.st[i + (1 << (j - 1))][j - 1])
                i += 1
    
    def query(self, l: int, r: int) -> int:
        length = r - l + 1
        k = math.floor(math.log2(length))
        return min(self.st[l][k], self.st[r - (1 << k) + 1][k])`,
      cpp: `class SparseTable {
    vector<vector<int>> st;
    int n;
    
public:
    SparseTable(vector<int>& arr) {
        n = arr.size();
        int maxLog = floor(log2(n)) + 1;
        st.assign(n, vector<int>(maxLog));
        
        for (int i = 0; i < n; i++) {
            st[i][0] = arr[i];
        }
        
        for (int j = 1; j < maxLog; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                st[i][j] = min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);
            }
        }
    }
    
    int query(int l, int r) {
        int len = r - l + 1;
        int k = floor(log2(len));
        return min(st[l][k], st[r - (1 << k) + 1][k]);
    }
};`,
      java: `class SparseTable {
    int[][] st;
    int n;
    
    public SparseTable(int[] arr) {
        n = arr.length;
        int maxLog = (int)Math.floor(Math.log(n) / Math.log(2)) + 1;
        st = new int[n][maxLog];
        
        for (int i = 0; i < n; i++) {
            st[i][0] = arr[i];
        }
        
        for (int j = 1; j < maxLog; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                st[i][j] = Math.min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);
            }
        }
    }
    
    public int query(int l, int r) {
        int len = r - l + 1;
        int k = (int)Math.floor(Math.log(len) / Math.log(2));
        return Math.min(st[l][k], st[r - (1 << k) + 1][k]);
    }
}`
    },
    explanation: {
      overview: "Data structure for O(1) range minimum/maximum queries with O(n log n) preprocessing.",
      steps: [
        "Build table with 2^j length ranges",
        "st[i][j] = min of range [i, i+2^j)",
        "For each power of 2, combine smaller ranges",
        "Query: find k where 2^k fits in range",
        "Return min of two overlapping 2^k ranges",
        "Works for idempotent operations (min/max/gcd)"
      ],
      useCase: "Static RMQ problems, range queries without updates, competitive programming.",
      tips: [
        "O(1) query time",
        "O(n log n) preprocessing",
        "Only for immutable arrays",
        "Works for overlap-friendly operations"
      ]
    },
    visualizationType: 'matrix'
  },
  'serialize-tree': {
    id: 'serialize-tree',
    code: {
      typescript: `function serialize(root: TreeNode | null): string {
  if (!root) return 'null';
  return \`\${root.val},\${serialize(root.left)},\${serialize(root.right)}\`;
}

function deserialize(data: string): TreeNode | null {
  const values = data.split(',');
  let index = 0;
  
  function build(): TreeNode | null {
    if (index >= values.length || values[index] === 'null') {
      index++;
      return null;
    }
    const node = new TreeNode(parseInt(values[index++]));
    node.left = build();
    node.right = build();
    return node;
  }
  
  return build();
}`,
      python: `def serialize(root):
    if not root:
        return 'null'
    return f"{root.val},{serialize(root.left)},{serialize(root.right)}"

def deserialize(data):
    values = data.split(',')
    index = [0]
    
    def build():
        if index[0] >= len(values) or values[index[0]] == 'null':
            index[0] += 1
            return None
        node = TreeNode(int(values[index[0]]))
        index[0] += 1
        node.left = build()
        node.right = build()
        return node
    
    return build()`,
      cpp: `string serialize(TreeNode* root) {
    if (!root) return "null";
    return to_string(root->val) + "," + serialize(root->left) + "," + serialize(root->right);
}

TreeNode* deserialize(string data) {
    stringstream ss(data);
    string val;
    vector<string> values;
    while (getline(ss, val, ',')) {
        values.push_back(val);
    }
    int index = 0;
    return build(values, index);
}

TreeNode* build(vector<string>& values, int& index) {
    if (index >= values.size() || values[index] == "null") {
        index++;
        return nullptr;
    }
    TreeNode* node = new TreeNode(stoi(values[index++]));
    node->left = build(values, index);
    node->right = build(values, index);
    return node;
}`,
      java: `public String serialize(TreeNode root) {
    if (root == null) return "null";
    return root.val + "," + serialize(root.left) + "," + serialize(root.right);
}

public TreeNode deserialize(String data) {
    String[] values = data.split(",");
    int[] index = {0};
    return build(values, index);
}

private TreeNode build(String[] values, int[] index) {
    if (index[0] >= values.length || values[index[0]].equals("null")) {
        index[0]++;
        return null;
    }
    TreeNode node = new TreeNode(Integer.parseInt(values[index[0]++]));
    node.left = build(values, index);
    node.right = build(values, index);
    return node;
}`
    },
    explanation: {
      overview: "Serialize a binary tree to a string and deserialize it back. Uses preorder traversal with null markers.",
      steps: [
        "Serialize: Use preorder DFS, add 'null' for empty nodes",
        "Create comma-separated string of values",
        "Deserialize: Split string and rebuild tree",
        "Use index to track position in array",
        "Recursively build left and right subtrees"
      ],
      useCase: "Save tree to file, network transmission, deep copy of tree structure.",
      tips: [
        "Preorder traversal maintains structure",
        "Handle null nodes explicitly",
        "Use index pointer for parsing",
        "BFS serialization also works"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Serialize and Deserialize Binary Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", difficulty: "hard" }
    ]
  },
  'recover-bst': {
    id: 'recover-bst',
    code: {
      typescript: `function recoverTree(root: TreeNode | null): void {
  let first: TreeNode | null = null;
  let second: TreeNode | null = null;
  let prev: TreeNode | null = null;
  
  function inorder(node: TreeNode | null): void {
    if (!node) return;
    
    inorder(node.left);
    
    if (prev && prev.val > node.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
    
    inorder(node.right);
  }
  
  inorder(root);
  if (first && second) {
    [first.val, second.val] = [second.val, first.val];
  }
}`,
      python: `def recoverTree(root):
    first = second = prev = None
    
    def inorder(node):
        nonlocal first, second, prev
        if not node:
            return
        
        inorder(node.left)
        
        if prev and prev.val > node.val:
            if not first:
                first = prev
            second = node
        prev = node
        
        inorder(node.right)
    
    inorder(root)
    if first and second:
        first.val, second.val = second.val, first.val`,
      cpp: `void recoverTree(TreeNode* root) {
    TreeNode *first = nullptr, *second = nullptr, *prev = nullptr;
    
    function<void(TreeNode*)> inorder = [&](TreeNode* node) {
        if (!node) return;
        
        inorder(node->left);
        
        if (prev && prev->val > node->val) {
            if (!first) first = prev;
            second = node;
        }
        prev = node;
        
        inorder(node->right);
    };
    
    inorder(root);
    if (first && second) {
        swap(first->val, second->val);
    }
}`,
      java: `private TreeNode first = null;
private TreeNode second = null;
private TreeNode prev = null;

public void recoverTree(TreeNode root) {
    inorder(root);
    if (first != null && second != null) {
        int temp = first.val;
        first.val = second.val;
        second.val = temp;
    }
}

private void inorder(TreeNode node) {
    if (node == null) return;
    
    inorder(node.left);
    
    if (prev != null && prev.val > node.val) {
        if (first == null) first = prev;
        second = node;
    }
    prev = node;
    
    inorder(node.right);
}`
    },
    explanation: {
      overview: "Two nodes of a BST are swapped by mistake. Recover the tree without changing its structure by finding and swapping the two nodes.",
      steps: [
        "Do inorder traversal (should be sorted in BST)",
        "Find first violation: prev.val > curr.val",
        "Mark first as prev, continue searching",
        "Find second violation (or update second)",
        "Swap values of first and second nodes"
      ],
      useCase: "Fix corrupted BST, data structure repair, validation and correction.",
      tips: [
        "Inorder of BST is sorted",
        "Two violations for adjacent swaps, one for distant",
        "O(1) space with Morris traversal",
        "Keep track of previous node"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Recover Binary Search Tree", url: "https://leetcode.com/problems/recover-binary-search-tree/", difficulty: "medium" }
    ]
  },
  'kruskals': {
    id: 'kruskals',
    code: {
      typescript: `function kruskalMST(n: number, edges: [number, number, number][]): [number, [number, number][]] {
  // Sort edges by weight
  edges.sort((a, b) => a[2] - b[2]);
  
  const parent = Array.from({length: n}, (_, i) => i);
  const rank = Array(n).fill(0);
  
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  
  function union(x: number, y: number): boolean {
    const px = find(x), py = find(y);
    if (px === py) return false;
    
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else { parent[py] = px; rank[px]++; }
    return true;
  }
  
  const mst: [number, number][] = [];
  let totalWeight = 0;
  
  for (const [u, v, w] of edges) {
    if (union(u, v)) {
      mst.push([u, v]);
      totalWeight += w;
      if (mst.length === n - 1) break;
    }
  }
  
  return [totalWeight, mst];
}`,
      python: `def kruskal_mst(n, edges):
    edges.sort(key=lambda x: x[2])
    
    parent = list(range(n))
    rank = [0] * n
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        
        if rank[px] < rank[py]:
            parent[px] = py
        elif rank[px] > rank[py]:
            parent[py] = px
        else:
            parent[py] = px
            rank[px] += 1
        return True
    
    mst = []
    total_weight = 0
    
    for u, v, w in edges:
        if union(u, v):
            mst.append((u, v))
            total_weight += w
            if len(mst) == n - 1:
                break
    
    return total_weight, mst`,
      cpp: `class UnionFind {
public:
    vector<int> parent, rank;
    UnionFind(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        
        if (rank[px] < rank[py]) parent[px] = py;
        else if (rank[px] > rank[py]) parent[py] = px;
        else { parent[py] = px; rank[px]++; }
        return true;
    }
};

pair<int, vector<pair<int,int>>> kruskalMST(int n, vector<array<int,3>>& edges) {
    sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a[2] < b[2]; });
    
    UnionFind uf(n);
    vector<pair<int,int>> mst;
    int totalWeight = 0;
    
    for (auto& [u, v, w] : edges) {
        if (uf.unite(u, v)) {
            mst.push_back({u, v});
            totalWeight += w;
            if (mst.size() == n - 1) break;
        }
    }
    
    return {totalWeight, mst};
}`,
      java: `public int[] kruskalMST(int n, int[][] edges) {
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);
    
    UnionFind uf = new UnionFind(n);
    List<int[]> mst = new ArrayList<>();
    int totalWeight = 0;
    
    for (int[] edge : edges) {
        if (uf.union(edge[0], edge[1])) {
            mst.add(new int[]{edge[0], edge[1]});
            totalWeight += edge[2];
            if (mst.size() == n - 1) break;
        }
    }
    
    return new int[]{totalWeight};
}`
    },
    explanation: {
      overview: "Kruskal's algorithm finds the Minimum Spanning Tree by greedily selecting smallest edges that don't form cycles, using Union-Find.",
      steps: [
        "Sort all edges by weight in ascending order",
        "Initialize Union-Find data structure",
        "For each edge, check if it connects different components",
        "If yes, add to MST and union the components",
        "Continue until MST has n-1 edges"
      ],
      useCase: "Network design, clustering, circuit design, minimum cost infrastructure.",
      tips: [
        "Greedy approach with sorting",
        "Use Union-Find for cycle detection",
        "O(E log E) time complexity",
        "Works on edge list representation"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Min Cost to Connect All Points", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/", difficulty: "medium" }
    ]
  },
  'prims': {
    id: 'prims',
    code: {
      typescript: `function primMST(n: number, graph: number[][][]): [number, [number, number][]] {
  const visited = new Array(n).fill(false);
  const minHeap: [number, number, number][] = [[0, 0, -1]]; // [weight, node, parent]
  const mst: [number, number][] = [];
  let totalWeight = 0;
  
  while (minHeap.length && mst.length < n - 1) {
    minHeap.sort((a, b) => a[0] - b[0]);
    const [weight, node, parent] = minHeap.shift()!;
    
    if (visited[node]) continue;
    visited[node] = true;
    
    if (parent !== -1) {
      mst.push([parent, node]);
      totalWeight += weight;
    }
    
    for (const [neighbor, w] of graph[node]) {
      if (!visited[neighbor]) {
        minHeap.push([w, neighbor, node]);
      }
    }
  }
  
  return [totalWeight, mst];
}`,
      python: `import heapq

def prim_mst(n, graph):
    visited = [False] * n
    min_heap = [(0, 0, -1)]  # (weight, node, parent)
    mst = []
    total_weight = 0
    
    while min_heap and len(mst) < n - 1:
        weight, node, parent = heapq.heappop(min_heap)
        
        if visited[node]:
            continue
        visited[node] = True
        
        if parent != -1:
            mst.append((parent, node))
            total_weight += weight
        
        for neighbor, w in graph[node]:
            if not visited[neighbor]:
                heapq.heappush(min_heap, (w, neighbor, node))
    
    return total_weight, mst`,
      cpp: `pair<int, vector<pair<int,int>>> primMST(int n, vector<vector<pair<int,int>>>& graph) {
    vector<bool> visited(n, false);
    priority_queue<array<int,3>, vector<array<int,3>>, greater<>> minHeap;
    minHeap.push({0, 0, -1}); // {weight, node, parent}
    
    vector<pair<int,int>> mst;
    int totalWeight = 0;
    
    while (!minHeap.empty() && mst.size() < n - 1) {
        auto [weight, node, parent] = minHeap.top();
        minHeap.pop();
        
        if (visited[node]) continue;
        visited[node] = true;
        
        if (parent != -1) {
            mst.push_back({parent, node});
            totalWeight += weight;
        }
        
        for (auto [neighbor, w] : graph[node]) {
            if (!visited[neighbor]) {
                minHeap.push({w, neighbor, node});
            }
        }
    }
    
    return {totalWeight, mst};
}`,
      java: `public int[] primMST(int n, List<int[]>[] graph) {
    boolean[] visited = new boolean[n];
    PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    minHeap.offer(new int[]{0, 0, -1}); // {weight, node, parent}
    
    List<int[]> mst = new ArrayList<>();
    int totalWeight = 0;
    
    while (!minHeap.isEmpty() && mst.size() < n - 1) {
        int[] curr = minHeap.poll();
        int weight = curr[0], node = curr[1], parent = curr[2];
        
        if (visited[node]) continue;
        visited[node] = true;
        
        if (parent != -1) {
            mst.add(new int[]{parent, node});
            totalWeight += weight;
        }
        
        for (int[] edge : graph[node]) {
            if (!visited[edge[0]]) {
                minHeap.offer(new int[]{edge[1], edge[0], node});
            }
        }
    }
    
    return new int[]{totalWeight};
}`
    },
    explanation: {
      overview: "Prim's algorithm builds MST by starting from a node and greedily adding the minimum weight edge connecting to unvisited nodes.",
      steps: [
        "Start from any vertex (usually vertex 0)",
        "Mark it as visited",
        "Add all edges from visited to unvisited nodes to min heap",
        "Pick minimum weight edge to unvisited node",
        "Repeat until all nodes are visited"
      ],
      useCase: "Dense graphs, network design, when graph is given as adjacency list.",
      tips: [
        "Uses priority queue for efficiency",
        "O(E log V) with binary heap",
        "Better for dense graphs",
        "Builds MST incrementally from one node"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Min Cost to Connect All Points", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/", difficulty: "medium" }
    ]
  },
  'bellman-ford': {
    id: 'bellman-ford',
    code: {
      typescript: `function bellmanFord(n: number, edges: [number, number, number][], source: number): number[] | null {
  const dist = Array(n).fill(Infinity);
  dist[source] = 0;
  
  // Relax edges n-1 times
  for (let i = 0; i < n - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  
  // Check for negative cycles
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      return null; // Negative cycle detected
    }
  }
  
  return dist;
}`,
      python: `def bellman_ford(n, edges, source):
    dist = [float('inf')] * n
    dist[source] = 0
    
    # Relax edges n-1 times
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    # Check for negative cycles
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return None  # Negative cycle detected
    
    return dist`,
      cpp: `vector<int> bellmanFord(int n, vector<array<int,3>>& edges, int source) {
    vector<int> dist(n, INT_MAX);
    dist[source] = 0;
    
    // Relax edges n-1 times
    for (int i = 0; i < n - 1; i++) {
        for (auto& [u, v, w] : edges) {
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // Check for negative cycles
    for (auto& [u, v, w] : edges) {
        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            return {}; // Negative cycle detected
        }
    }
    
    return dist;
}`,
      java: `public int[] bellmanFord(int n, int[][] edges, int source) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[source] = 0;
    
    // Relax edges n-1 times
    for (int i = 0; i < n - 1; i++) {
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // Check for negative cycles
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
            return null; // Negative cycle detected
        }
    }
    
    return dist;
}`
    },
    explanation: {
      overview: "Bellman-Ford finds shortest paths from source to all vertices, handles negative weights, and detects negative cycles.",
      steps: [
        "Initialize distances: source = 0, others = infinity",
        "Relax all edges V-1 times",
        "For each edge (u,v,w): if dist[u] + w < dist[v], update dist[v]",
        "Run one more iteration to detect negative cycles",
        "If any distance updates, negative cycle exists"
      ],
      useCase: "Graphs with negative weights, currency arbitrage, detecting negative cycles.",
      tips: [
        "Handles negative edge weights",
        "Detects negative cycles",
        "O(VE) time complexity",
        "Slower than Dijkstra but more versatile"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/", difficulty: "medium" },
      { title: "Cheapest Flights Within K Stops", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", difficulty: "medium" }
    ]
  },
  'floyd-warshall': {
    id: 'floyd-warshall',
    code: {
      typescript: `function floydWarshall(n: number, edges: [number, number, number][]): number[][] {
  const dist: number[][] = Array.from({length: n}, () => Array(n).fill(Infinity));
  
  // Initialize distances
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) dist[u][v] = w;
  
  // Floyd-Warshall
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
        }
      }
    }
  }
  
  return dist;
}`,
      python: `def floyd_warshall(n, edges):
    dist = [[float('inf')] * n for _ in range(n)]
    
    # Initialize distances
    for i in range(n):
        dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = w
    
    # Floyd-Warshall
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != float('inf') and dist[k][j] != float('inf'):
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    
    return dist`,
      cpp: `vector<vector<int>> floydWarshall(int n, vector<array<int,3>>& edges) {
    vector<vector<int>> dist(n, vector<int>(n, INT_MAX / 2));
    
    // Initialize distances
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (auto& [u, v, w] : edges) dist[u][v] = w;
    
    // Floyd-Warshall
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }
    
    return dist;
}`,
      java: `public int[][] floydWarshall(int n, int[][] edges) {
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE / 2);
    
    // Initialize distances
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] edge : edges) {
        dist[edge[0]][edge[1]] = edge[2];
    }
    
    // Floyd-Warshall
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }
    
    return dist;
}`
    },
    explanation: {
      overview: "Floyd-Warshall computes shortest paths between all pairs of vertices using dynamic programming.",
      steps: [
        "Initialize dist[i][j] = edge weight or infinity",
        "Set dist[i][i] = 0 for all i",
        "For each intermediate vertex k",
        "Try using k as intermediate: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])",
        "After k iterations, dist contains all shortest paths"
      ],
      useCase: "All-pairs shortest paths, transitive closure, graph reachability.",
      tips: [
        "O(V³) time and O(V²) space",
        "Works with negative edges (not negative cycles)",
        "Simple triple nested loop",
        "Can detect negative cycles"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance", url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/", difficulty: "medium" }
    ]
  },
  'a-star': {
    id: 'a-star',
    code: {
      typescript: `function aStar(grid: number[][], start: [number, number], goal: [number, number]): [number, number][] {
  const rows = grid.length, cols = grid[0].length;
  const heuristic = (a: [number, number], b: [number, number]) => 
    Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  
  const openSet: [number, [number, number]][] = [[heuristic(start, goal), start]];
  const cameFrom = new Map<string, [number, number]>();
  const gScore = new Map<string, number>();
  gScore.set(\`\${start[0]},\${start[1]}\`, 0);
  
  while (openSet.length) {
    openSet.sort((a, b) => a[0] - b[0]);
    const [, current] = openSet.shift()!;
    const key = \`\${current[0]},\${current[1]}\`;
    
    if (current[0] === goal[0] && current[1] === goal[1]) {
      const path: [number, number][] = [current];
      let curr = current;
      while (cameFrom.has(\`\${curr[0]},\${curr[1]}\`)) {
        curr = cameFrom.get(\`\${curr[0]},\${curr[1]}\`)!;
        path.unshift(curr);
      }
      return path;
    }
    
    const dirs = [[0,1], [1,0], [0,-1], [-1,0]];
    for (const [dx, dy] of dirs) {
      const [nx, ny] = [current[0] + dx, current[1] + dy];
      if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] === 1) continue;
      
      const neighborKey = \`\${nx},\${ny}\`;
      const tentativeG = gScore.get(key)! + 1;
      
      if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)!) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        const fScore = tentativeG + heuristic([nx, ny], goal);
        openSet.push([fScore, [nx, ny]]);
      }
    }
  }
  
  return [];
}`,
      python: `import heapq

def a_star(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    heuristic = lambda a, b: abs(a[0] - b[0]) + abs(a[1] - b[1])
    
    open_set = [(heuristic(start, goal), start)]
    came_from = {}
    g_score = {start: 0}
    
    while open_set:
        _, current = heapq.heappop(open_set)
        
        if current == goal:
            path = [current]
            while current in came_from:
                current = came_from[current]
                path.append(current)
            return path[::-1]
        
        for dx, dy in [(0,1), (1,0), (0,-1), (-1,0)]:
            nx, ny = current[0] + dx, current[1] + dy
            if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] != 1:
                neighbor = (nx, ny)
                tentative_g = g_score[current] + 1
                
                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score = tentative_g + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f_score, neighbor))
    
    return []`,
      cpp: `vector<pair<int,int>> aStar(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> goal) {
    int rows = grid.size(), cols = grid[0].size();
    auto heuristic = [](auto a, auto b) {
        return abs(a.first - b.first) + abs(a.second - b.second);
    };
    
    priority_queue<pair<int, pair<int,int>>, vector<pair<int, pair<int,int>>>, greater<>> openSet;
    openSet.push({heuristic(start, goal), start});
    
    map<pair<int,int>, pair<int,int>> cameFrom;
    map<pair<int,int>, int> gScore;
    gScore[start] = 0;
    
    int dirs[][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};
    
    while (!openSet.empty()) {
        auto [_, current] = openSet.top();
        openSet.pop();
        
        if (current == goal) {
            vector<pair<int,int>> path = {current};
            while (cameFrom.count(current)) {
                current = cameFrom[current];
                path.insert(path.begin(), current);
            }
            return path;
        }
        
        for (auto [dx, dy] : dirs) {
            int nx = current.first + dx, ny = current.second + dy;
            if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] == 1) continue;
            
            pair<int,int> neighbor = {nx, ny};
            int tentativeG = gScore[current] + 1;
            
            if (!gScore.count(neighbor) || tentativeG < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeG;
                int fScore = tentativeG + heuristic(neighbor, goal);
                openSet.push({fScore, neighbor});
            }
        }
    }
    
    return {};
}`,
      java: `public List<int[]> aStar(int[][] grid, int[] start, int[] goal) {
    int rows = grid.length, cols = grid[0].length;
    PriorityQueue<Node> openSet = new PriorityQueue<>((a, b) -> a.f - b.f);
    openSet.offer(new Node(start[0], start[1], 0, heuristic(start, goal)));
    
    Map<String, int[]> cameFrom = new HashMap<>();
    Map<String, Integer> gScore = new HashMap<>();
    gScore.put(start[0] + "," + start[1], 0);
    
    int[][] dirs = {{0,1}, {1,0}, {0,-1}, {-1,0}};
    
    while (!openSet.isEmpty()) {
        Node current = openSet.poll();
        if (current.x == goal[0] && current.y == goal[1]) {
            return reconstructPath(cameFrom, current);
        }
        
        for (int[] dir : dirs) {
            int nx = current.x + dir[0], ny = current.y + dir[1];
            if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] == 1) continue;
            
            String key = nx + "," + ny;
            int tentativeG = gScore.get(current.x + "," + current.y) + 1;
            
            if (!gScore.containsKey(key) || tentativeG < gScore.get(key)) {
                cameFrom.put(key, new int[]{current.x, current.y});
                gScore.put(key, tentativeG);
                int f = tentativeG + heuristic(new int[]{nx, ny}, goal);
                openSet.offer(new Node(nx, ny, tentativeG, f));
            }
        }
    }
    
    return new ArrayList<>();
}

private int heuristic(int[] a, int[] b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}`
    },
    explanation: {
      overview: "A* is an informed search algorithm using heuristics to find shortest path efficiently. Combines Dijkstra with heuristic guidance.",
      steps: [
        "Use f(n) = g(n) + h(n) where g is cost so far, h is heuristic",
        "Start with source in open set",
        "Pop node with minimum f score",
        "If goal, reconstruct path",
        "Explore neighbors, update g and f scores"
      ],
      useCase: "Pathfinding in games, GPS navigation, robotics, AI planning.",
      tips: [
        "Heuristic must be admissible (never overestimate)",
        "Manhattan distance for grid, Euclidean for continuous",
        "Better than Dijkstra with good heuristic",
        "Optimal if heuristic is consistent"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Shortest Path in Binary Matrix", url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/", difficulty: "medium" }
    ]
  },
  'matrix-path-dp': {
    id: 'matrix-path-dp',
    code: {
      typescript: `function uniquePaths(m: number, n: number): number {
  const dp: number[][] = Array.from({length: m}, () => Array(n).fill(0));
  
  // Base case: first row and column
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;
  
  // Fill DP table
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i-1][j] + dp[i][j-1];
    }
  }
  
  return dp[m-1][n-1];
}

function minPathSum(grid: number[][]): number {
  const m = grid.length, n = grid[0].length;
  const dp: number[][] = Array.from({length: m}, () => Array(n).fill(0));
  
  dp[0][0] = grid[0][0];
  for (let i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];
  
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1]);
    }
  }
  
  return dp[m-1][n-1];
}`,
      python: `def unique_paths(m, n):
    dp = [[0] * n for _ in range(m)]
    
    for i in range(m):
        dp[i][0] = 1
    for j in range(n):
        dp[0][j] = 1
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]

def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    
    dp[0][0] = grid[0][0]
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
    
    return dp[m-1][n-1]`,
      cpp: `int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 0));
    
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}

int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp(m, vector<int>(n));
    
    dp[0][0] = grid[0][0];
    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]);
        }
    }
    
    return dp[m-1][n-1];
}`,
      java: `public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}

public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    
    dp[0][0] = grid[0][0];
    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = grid[i][j] + Math.min(dp[i-1][j], dp[i][j-1]);
        }
    }
    
    return dp[m-1][n-1];
}`
    },
    explanation: {
      overview: "Use dynamic programming to count unique paths or find minimum/maximum path sum in a matrix with movement constraints.",
      steps: [
        "Create DP table same size as matrix",
        "Initialize base cases (first row/column)",
        "For each cell, compute based on where you can come from",
        "dp[i][j] = operation(dp[i-1][j], dp[i][j-1])",
        "Answer is at dp[m-1][n-1]"
      ],
      useCase: "Grid path problems, robot movement, minimum cost paths, counting paths.",
      tips: [
        "Can optimize space to O(n)",
        "Base cases are crucial",
        "Direction constraints affect recurrence",
        "Works for obstacles too"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Unique Paths", url: "https://leetcode.com/problems/unique-paths/", difficulty: "medium" },
      { title: "Minimum Path Sum", url: "https://leetcode.com/problems/minimum-path-sum/", difficulty: "medium" }
    ]
  },
  'partition-equal-subset': {
    id: 'partition-equal-subset',
    code: {
      typescript: `function canPartition(nums: number[]): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  
  const target = total / 2;
  const dp: boolean[] = Array(target + 1).fill(false);
  dp[0] = true;
  
  for (const num of nums) {
    for (let j = target; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
  }
  
  return dp[target];
}`,
      python: `def can_partition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    
    return dp[target]`,
      cpp: `bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2 != 0) return false;
    
    int target = total / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    
    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    
    return dp[target];
}`,
      java: `public boolean canPartition(int[] nums) {
    int total = 0;
    for (int num : nums) total += num;
    if (total % 2 != 0) return false;
    
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    
    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    
    return dp[target];
}`
    },
    explanation: {
      overview: "Determine if an array can be partitioned into two subsets with equal sum. This is a variant of the 0/1 knapsack problem.",
      steps: [
        "Calculate total sum, if odd return false",
        "Target is sum/2",
        "Use DP array: dp[i] = can we make sum i",
        "For each number, update dp in reverse order",
        "dp[j] = dp[j] OR dp[j - num]"
      ],
      useCase: "Subset sum problems, fair division, resource allocation.",
      tips: [
        "Early exit if sum is odd",
        "Space optimized to O(sum)",
        "Reverse iteration prevents reuse",
        "Similar to 0/1 knapsack"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Partition Equal Subset Sum", url: "https://leetcode.com/problems/partition-equal-subset-sum/", difficulty: "medium" }
    ]
  },
  'word-break': {
    id: 'word-break',
    code: {
      typescript: `function wordBreak(s: string, wordDict: string[]): boolean {
  const wordSet = new Set(wordDict);
  const dp: boolean[] = Array(s.length + 1).fill(false);
  dp[0] = true;
  
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  
  return dp[s.length];
}`,
      python: `def word_break(s, word_dict):
    word_set = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[len(s)]`,
      cpp: `bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
    vector<bool> dp(s.length() + 1, false);
    dp[0] = true;
    
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.count(s.substr(j, i - j))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[s.length()];
}`,
      java: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;
    
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[s.length()];
}`
    },
    explanation: {
      overview: "Determine if a string can be segmented into words from a dictionary using dynamic programming.",
      steps: [
        "dp[i] = can we break s[0..i-1]",
        "dp[0] = true (empty string)",
        "For each position i, check all j < i",
        "If dp[j] is true and s[j..i-1] is in dict, dp[i] = true",
        "Return dp[n]"
      ],
      useCase: "Text segmentation, natural language processing, spell checking.",
      tips: [
        "Use set for O(1) lookup",
        "Break early when found",
        "Can be optimized with trie",
        "DFS with memoization also works"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Word Break", url: "https://leetcode.com/problems/word-break/", difficulty: "medium" },
      { title: "Word Break II", url: "https://leetcode.com/problems/word-break-ii/", difficulty: "hard" }
    ]
  },
  'activity-selection': {
    id: 'activity-selection',
    code: {
      typescript: `function activitySelection(start: number[], finish: number[]): number {
  const n = start.length;
  const activities: [number, number][] = start.map((s, i) => [s, finish[i]]);
  activities.sort((a, b) => a[1] - b[1]);
  
  let count = 1;
  let lastFinish = activities[0][1];
  
  for (let i = 1; i < n; i++) {
    if (activities[i][0] >= lastFinish) {
      count++;
      lastFinish = activities[i][1];
    }
  }
  
  return count;
}`,
      python: `def activity_selection(start, finish):
    activities = sorted(zip(start, finish), key=lambda x: x[1])
    
    count = 1
    last_finish = activities[0][1]
    
    for s, f in activities[1:]:
        if s >= last_finish:
            count += 1
            last_finish = f
    
    return count`,
      cpp: `int activitySelection(vector<int>& start, vector<int>& finish) {
    int n = start.size();
    vector<pair<int,int>> activities;
    for (int i = 0; i < n; i++) {
        activities.push_back({finish[i], start[i]});
    }
    sort(activities.begin(), activities.end());
    
    int count = 1;
    int lastFinish = activities[0].first;
    
    for (int i = 1; i < n; i++) {
        if (activities[i].second >= lastFinish) {
            count++;
            lastFinish = activities[i].first;
        }
    }
    
    return count;
}`,
      java: `public int activitySelection(int[] start, int[] finish) {
    int n = start.length;
    int[][] activities = new int[n][2];
    for (int i = 0; i < n; i++) {
        activities[i] = new int[]{start[i], finish[i]};
    }
    Arrays.sort(activities, (a, b) -> a[1] - b[1]);
    
    int count = 1;
    int lastFinish = activities[0][1];
    
    for (int i = 1; i < n; i++) {
        if (activities[i][0] >= lastFinish) {
            count++;
            lastFinish = activities[i][1];
        }
    }
    
    return count;
}`
    },
    explanation: {
      overview: "Select maximum number of non-overlapping activities. Greedy approach: always pick activity that finishes earliest.",
      steps: [
        "Sort activities by finish time",
        "Pick first activity",
        "For each activity, if start >= last finish, pick it",
        "Update last finish time",
        "Count selected activities"
      ],
      useCase: "Scheduling meetings, resource allocation, interval selection.",
      tips: [
        "Sort by finish time, not start",
        "Greedy choice property",
        "O(n log n) due to sorting",
        "Proves optimal substructure"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Non-overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals/", difficulty: "medium" }
    ]
  },
  'interval-scheduling': {
    id: 'interval-scheduling',
    code: {
      typescript: `function intervalScheduling(intervals: [number, number][]): [number, number][] {
  intervals.sort((a, b) => a[1] - b[1]);
  
  const selected: [number, number][] = [intervals[0]];
  let lastEnd = intervals[0][1];
  
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= lastEnd) {
      selected.push(intervals[i]);
      lastEnd = intervals[i][1];
    }
  }
  
  return selected;
}`,
      python: `def interval_scheduling(intervals):
    intervals.sort(key=lambda x: x[1])
    
    selected = [intervals[0]]
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    
    return selected`,
      cpp: `vector<pair<int,int>> intervalScheduling(vector<pair<int,int>>& intervals) {
    sort(intervals.begin(), intervals.end(), 
         [](auto& a, auto& b) { return a.second < b.second; });
    
    vector<pair<int,int>> selected = {intervals[0]};
    int lastEnd = intervals[0].second;
    
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i].first >= lastEnd) {
            selected.push_back(intervals[i]);
            lastEnd = intervals[i].second;
        }
    }
    
    return selected;
}`,
      java: `public List<int[]> intervalScheduling(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    
    List<int[]> selected = new ArrayList<>();
    selected.add(intervals[0]);
    int lastEnd = intervals[0][1];
    
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= lastEnd) {
            selected.add(intervals[i]);
            lastEnd = intervals[i][1];
        }
    }
    
    return selected;
}`
    },
    explanation: {
      overview: "Schedule maximum number of non-overlapping intervals. Greedy algorithm that selects intervals finishing earliest.",
      steps: [
        "Sort intervals by end time",
        "Select first interval",
        "Iterate through remaining intervals",
        "If interval starts after last selected ends, add it",
        "Update last end time"
      ],
      useCase: "Meeting scheduling, resource booking, event planning.",
      tips: [
        "Same as activity selection",
        "Greedy choice is optimal",
        "Sort by end time crucial",
        "O(n log n) complexity"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Non-overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals/", difficulty: "medium" }
    ]
  },
  'huffman-encoding': {
    id: 'huffman-encoding',
    code: {
      typescript: `class HuffmanNode {
  constructor(
    public char: string,
    public freq: number,
    public left: HuffmanNode | null = null,
    public right: HuffmanNode | null = null
  ) {}
}

function huffmanEncoding(text: string): Map<string, string> {
  const freqMap = new Map<string, number>();
  for (const char of text) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }
  
  const heap: HuffmanNode[] = Array.from(freqMap.entries())
    .map(([char, freq]) => new HuffmanNode(char, freq));
  
  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq);
    const left = heap.shift()!;
    const right = heap.shift()!;
    const parent = new HuffmanNode('', left.freq + right.freq, left, right);
    heap.push(parent);
  }
  
  const codes = new Map<string, string>();
  function buildCodes(node: HuffmanNode | null, code: string): void {
    if (!node) return;
    if (!node.left && !node.right) {
      codes.set(node.char, code || '0');
      return;
    }
    buildCodes(node.left, code + '0');
    buildCodes(node.right, code + '1');
  }
  buildCodes(heap[0], '');
  
  return codes;
}`,
      python: `import heapq

class HuffmanNode:
    def __init__(self, char, freq, left=None, right=None):
        self.char = char
        self.freq = freq
        self.left = left
        self.right = right
    
    def __lt__(self, other):
        return self.freq < other.freq

def huffman_encoding(text):
    freq_map = {}
    for char in text:
        freq_map[char] = freq_map.get(char, 0) + 1
    
    heap = [HuffmanNode(char, freq) for char, freq in freq_map.items()]
    heapq.heapify(heap)
    
    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        parent = HuffmanNode('', left.freq + right.freq, left, right)
        heapq.heappush(heap, parent)
    
    codes = {}
    def build_codes(node, code):
        if not node:
            return
        if not node.left and not node.right:
            codes[node.char] = code or '0'
            return
        build_codes(node.left, code + '0')
        build_codes(node.right, code + '1')
    
    build_codes(heap[0], '')
    return codes`,
      cpp: `struct HuffmanNode {
    char ch;
    int freq;
    HuffmanNode *left, *right;
    
    HuffmanNode(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
};

struct Compare {
    bool operator()(HuffmanNode* a, HuffmanNode* b) {
        return a->freq > b->freq;
    }
};

map<char, string> huffmanEncoding(string text) {
    map<char, int> freqMap;
    for (char c : text) freqMap[c]++;
    
    priority_queue<HuffmanNode*, vector<HuffmanNode*>, Compare> minHeap;
    for (auto [ch, freq] : freqMap) {
        minHeap.push(new HuffmanNode(ch, freq));
    }
    
    while (minHeap.size() > 1) {
        auto left = minHeap.top(); minHeap.pop();
        auto right = minHeap.top(); minHeap.pop();
        auto parent = new HuffmanNode('\\0', left->freq + right->freq);
        parent->left = left;
        parent->right = right;
        minHeap.push(parent);
    }
    
    map<char, string> codes;
    function<void(HuffmanNode*, string)> buildCodes = [&](HuffmanNode* node, string code) {
        if (!node) return;
        if (!node->left && !node->right) {
            codes[node->ch] = code.empty() ? "0" : code;
            return;
        }
        buildCodes(node->left, code + "0");
        buildCodes(node->right, code + "1");
    };
    buildCodes(minHeap.top(), "");
    
    return codes;
}`,
      java: `class HuffmanNode implements Comparable<HuffmanNode> {
    char ch;
    int freq;
    HuffmanNode left, right;
    
    HuffmanNode(char c, int f) {
        ch = c;
        freq = f;
    }
    
    public int compareTo(HuffmanNode other) {
        return this.freq - other.freq;
    }
}

public Map<Character, String> huffmanEncoding(String text) {
    Map<Character, Integer> freqMap = new HashMap<>();
    for (char c : text.toCharArray()) {
        freqMap.put(c, freqMap.getOrDefault(c, 0) + 1);
    }
    
    PriorityQueue<HuffmanNode> minHeap = new PriorityQueue<>();
    for (Map.Entry<Character, Integer> entry : freqMap.entrySet()) {
        minHeap.offer(new HuffmanNode(entry.getKey(), entry.getValue()));
    }
    
    while (minHeap.size() > 1) {
        HuffmanNode left = minHeap.poll();
        HuffmanNode right = minHeap.poll();
        HuffmanNode parent = new HuffmanNode('\\0', left.freq + right.freq);
        parent.left = left;
        parent.right = right;
        minHeap.offer(parent);
    }
    
    Map<Character, String> codes = new HashMap<>();
    buildCodes(minHeap.poll(), "", codes);
    return codes;
}

private void buildCodes(HuffmanNode node, String code, Map<Character, String> codes) {
    if (node == null) return;
    if (node.left == null && node.right == null) {
        codes.put(node.ch, code.isEmpty() ? "0" : code);
        return;
    }
    buildCodes(node.left, code + "0", codes);
    buildCodes(node.right, code + "1", codes);
}`
    },
    explanation: {
      overview: "Huffman encoding creates optimal prefix-free codes for data compression using a greedy algorithm with a priority queue.",
      steps: [
        "Count frequency of each character",
        "Create leaf nodes and add to min heap",
        "While heap has >1 node, pop two minimum",
        "Create parent with combined frequency",
        "Build codes by traversing tree (0 left, 1 right)"
      ],
      useCase: "Data compression (ZIP, JPEG), encoding optimization, file compression.",
      tips: [
        "Greedy algorithm is optimal",
        "Use min heap for efficiency",
        "More frequent = shorter code",
        "Prefix-free property crucial"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Huffman Coding", url: "https://practice.geeksforgeeks.org/problems/huffman-encoding/0", difficulty: "medium" }
    ]
  },
  'combinations': {
    id: 'combinations',
    code: {
      typescript: `function combine(n: number, k: number): number[][] {
  const result: number[][] = [];
  
  function backtrack(start: number, path: number[]): void {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    
    for (let i = start; i <= n; i++) {
      path.push(i);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  
  backtrack(1, []);
  return result;
}`,
      python: `def combine(n, k):
    result = []
    
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        
        for i in range(start, n + 1):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(1, [])
    return result`,
      cpp: `vector<vector<int>> combine(int n, int k) {
    vector<vector<int>> result;
    vector<int> path;
    
    function<void(int)> backtrack = [&](int start) {
        if (path.size() == k) {
            result.push_back(path);
            return;
        }
        
        for (int i = start; i <= n; i++) {
            path.push_back(i);
            backtrack(i + 1);
            path.pop_back();
        }
    };
    
    backtrack(1);
    return result;
}`,
      java: `public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(1, n, k, new ArrayList<>(), result);
    return result;
}

private void backtrack(int start, int n, int k, List<Integer> path, List<List<Integer>> result) {
    if (path.size() == k) {
        result.add(new ArrayList<>(path));
        return;
    }
    
    for (int i = start; i <= n; i++) {
        path.add(i);
        backtrack(i + 1, n, k, path, result);
        path.remove(path.size() - 1);
    }
}`
    },
    explanation: {
      overview: "Generate all k-combinations from numbers 1 to n using backtracking. Each combination is a unique set of k numbers.",
      steps: [
        "Use backtracking with start index",
        "If path length equals k, add to result",
        "For each number from start to n",
        "Add to path, recurse with next start",
        "Remove last element (backtrack)"
      ],
      useCase: "Combinatorics, lottery numbers, team selection, subset problems.",
      tips: [
        "Pruning: if remaining < needed, skip",
        "Start index prevents duplicates",
        "Time: O(C(n,k))",
        "Space: O(k) for recursion"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Combinations", url: "https://leetcode.com/problems/combinations/", difficulty: "medium" }
    ]
  },
  'combination-sum': {
    id: 'combination-sum',
    code: {
      typescript: `function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  
  function backtrack(start: number, path: number[], sum: number): void {
    if (sum === target) {
      result.push([...path]);
      return;
    }
    if (sum > target) return;
    
    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      backtrack(i, path, sum + candidates[i]);
      path.pop();
    }
  }
  
  backtrack(0, [], 0);
  return result;
}`,
      python: `def combination_sum(candidates, target):
    result = []
    
    def backtrack(start, path, total):
        if total == target:
            result.append(path[:])
            return
        if total > target:
            return
        
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, path, total + candidates[i])
            path.pop()
    
    backtrack(0, [], 0)
    return result`,
      cpp: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    vector<vector<int>> result;
    vector<int> path;
    
    function<void(int, int)> backtrack = [&](int start, int sum) {
        if (sum == target) {
            result.push_back(path);
            return;
        }
        if (sum > target) return;
        
        for (int i = start; i < candidates.size(); i++) {
            path.push_back(candidates[i]);
            backtrack(i, sum + candidates[i]);
            path.pop_back();
        }
    };
    
    backtrack(0, 0);
    return result;
}`,
      java: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(candidates, target, 0, new ArrayList<>(), 0, result);
    return result;
}

private void backtrack(int[] candidates, int target, int start, 
                       List<Integer> path, int sum, List<List<Integer>> result) {
    if (sum == target) {
        result.add(new ArrayList<>(path));
        return;
    }
    if (sum > target) return;
    
    for (int i = start; i < candidates.length; i++) {
        path.add(candidates[i]);
        backtrack(candidates, target, i, path, sum + candidates[i], result);
        path.remove(path.size() - 1);
    }
}`
    },
    explanation: {
      overview: "Find all unique combinations that sum to target. Numbers can be reused unlimited times.",
      steps: [
        "Use backtracking with current sum",
        "If sum equals target, add combination",
        "If sum exceeds target, prune branch",
        "For each candidate from start index",
        "Can reuse same element (pass i, not i+1)"
      ],
      useCase: "Coin change combinations, subset sum, resource allocation.",
      tips: [
        "Reuse elements: pass same index",
        "Early pruning when sum > target",
        "Sorting helps optimization",
        "Track sum to avoid recalculation"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/", difficulty: "medium" },
      { title: "Combination Sum II", url: "https://leetcode.com/problems/combination-sum-ii/", difficulty: "medium" }
    ]
  },
  'word-search-grid': {
    id: 'word-search-grid',
    code: {
      typescript: `function exist(board: string[][], word: string): boolean {
  const rows = board.length, cols = board[0].length;
  
  function dfs(r: number, c: number, index: number): boolean {
    if (index === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols || 
        board[r][c] !== word[index]) return false;
    
    const temp = board[r][c];
    board[r][c] = '#';
    
    const found = dfs(r+1, c, index+1) || dfs(r-1, c, index+1) ||
                  dfs(r, c+1, index+1) || dfs(r, c-1, index+1);
    
    board[r][c] = temp;
    return found;
  }
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  
  return false;
}`,
      python: `def exist(board, word):
    rows, cols = len(board), len(board[0])
    
    def dfs(r, c, index):
        if index == len(word):
            return True
        if (r < 0 or c < 0 or r >= rows or c >= cols or 
            board[r][c] != word[index]):
            return False
        
        temp = board[r][c]
        board[r][c] = '#'
        
        found = (dfs(r+1, c, index+1) or dfs(r-1, c, index+1) or
                 dfs(r, c+1, index+1) or dfs(r, c-1, index+1))
        
        board[r][c] = temp
        return found
    
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    
    return False`,
      cpp: `bool exist(vector<vector<char>>& board, string word) {
    int rows = board.size(), cols = board[0].size();
    
    function<bool(int, int, int)> dfs = [&](int r, int c, int index) -> bool {
        if (index == word.length()) return true;
        if (r < 0 || c < 0 || r >= rows || c >= cols || 
            board[r][c] != word[index]) return false;
        
        char temp = board[r][c];
        board[r][c] = '#';
        
        bool found = dfs(r+1, c, index+1) || dfs(r-1, c, index+1) ||
                     dfs(r, c+1, index+1) || dfs(r, c-1, index+1);
        
        board[r][c] = temp;
        return found;
    };
    
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }
    
    return false;
}`,
      java: `public boolean exist(char[][] board, String word) {
    int rows = board.length, cols = board[0].length;
    
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (dfs(board, word, r, c, 0)) return true;
        }
    }
    
    return false;
}

private boolean dfs(char[][] board, String word, int r, int c, int index) {
    if (index == word.length()) return true;
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length || 
        board[r][c] != word.charAt(index)) return false;
    
    char temp = board[r][c];
    board[r][c] = '#';
    
    boolean found = dfs(board, word, r+1, c, index+1) || 
                    dfs(board, word, r-1, c, index+1) ||
                    dfs(board, word, r, c+1, index+1) || 
                    dfs(board, word, r, c-1, index+1);
    
    board[r][c] = temp;
    return found;
}`
    },
    explanation: {
      overview: "Search for a word in a 2D grid using DFS backtracking. Word must be constructed from adjacent cells.",
      steps: [
        "Try starting from each cell",
        "Use DFS to explore 4 directions",
        "Mark cell as visited temporarily",
        "If word completed, return true",
        "Backtrack: restore cell value"
      ],
      useCase: "Word games, crossword validation, pattern matching in grids.",
      tips: [
        "Mark visited with special char",
        "Restore on backtrack",
        "Prune early if char doesn't match",
        "Time: O(m*n*4^L)"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Word Search", url: "https://leetcode.com/problems/word-search/", difficulty: "medium" },
      { title: "Word Search II", url: "https://leetcode.com/problems/word-search-ii/", difficulty: "hard" }
    ]
  },
  'sudoku-solver': {
    id: 'sudoku-solver',
    code: {
      typescript: `function solveSudoku(board: string[][]): void {
  function isValid(row: number, col: number, num: string): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxCol = 3 * Math.floor(col / 3) + (i % 3);
      if (board[boxRow][boxCol] === num) return false;
    }
    return true;
  }
  
  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            const char = num.toString();
            if (isValid(row, col, char)) {
              board[row][col] = char;
              if (solve()) return true;
              board[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  solve();
}`,
      python: `def solve_sudoku(board):
    def is_valid(row, col, num):
        for i in range(9):
            if board[row][i] == num or board[i][col] == num:
                return False
            box_row = 3 * (row // 3) + i // 3
            box_col = 3 * (col // 3) + i % 3
            if board[box_row][box_col] == num:
                return False
        return True
    
    def solve():
        for row in range(9):
            for col in range(9):
                if board[row][col] == '.':
                    for num in '123456789':
                        if is_valid(row, col, num):
                            board[row][col] = num
                            if solve():
                                return True
                            board[row][col] = '.'
                    return False
        return True
    
    solve()`,
      cpp: `void solveSudoku(vector<vector<char>>& board) {
    function<bool(int, int, char)> isValid = [&](int row, int col, char num) {
        for (int i = 0; i < 9; i++) {
            if (board[row][i] == num || board[i][col] == num) return false;
            int boxRow = 3 * (row / 3) + i / 3;
            int boxCol = 3 * (col / 3) + i % 3;
            if (board[boxRow][boxCol] == num) return false;
        }
        return true;
    };
    
    function<bool()> solve = [&]() {
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {
                if (board[row][col] == '.') {
                    for (char num = '1'; num <= '9'; num++) {
                        if (isValid(row, col, num)) {
                            board[row][col] = num;
                            if (solve()) return true;
                            board[row][col] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };
    
    solve();
}`,
      java: `public void solveSudoku(char[][] board) {
    solve(board);
}

private boolean solve(char[][] board) {
    for (int row = 0; row < 9; row++) {
        for (int col = 0; col < 9; col++) {
            if (board[row][col] == '.') {
                for (char num = '1'; num <= '9'; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solve(board)) return true;
                        board[row][col] = '.';
                    }
                }
                return false;
            }
        }
    }
    return true;
}

private boolean isValid(char[][] board, int row, int col, char num) {
    for (int i = 0; i < 9; i++) {
        if (board[row][i] == num || board[i][col] == num) return false;
        int boxRow = 3 * (row / 3) + i / 3;
        int boxCol = 3 * (col / 3) + i % 3;
        if (board[boxRow][boxCol] == num) return false;
    }
    return true;
}`
    },
    explanation: {
      overview: "Solve Sudoku puzzle using backtracking. Try each number 1-9 in empty cells, backtrack if invalid.",
      steps: [
        "Find empty cell ('.')",
        "Try digits 1-9",
        "Check if valid (row, col, 3x3 box)",
        "If valid, place and recurse",
        "If solution found, return true, else backtrack"
      ],
      useCase: "Puzzle solving, constraint satisfaction, game AI.",
      tips: [
        "Validate row, column, and 3x3 box",
        "Use backtracking pattern",
        "Optimization: choose cell with fewest options",
        "Memoization can help"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Sudoku Solver", url: "https://leetcode.com/problems/sudoku-solver/", difficulty: "hard" },
      { title: "Valid Sudoku", url: "https://leetcode.com/problems/valid-sudoku/", difficulty: "medium" }
    ]
  },
  'subset-generation-bits': {
    id: 'subset-generation-bits',
    code: {
      typescript: `function subsetsWithBits(nums: number[]): number[][] {
  const n = nums.length;
  const result: number[][] = [];
  
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset: number[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subset.push(nums[i]);
      }
    }
    result.push(subset);
  }
  
  return result;
}`,
      python: `def subsets_with_bits(nums):
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result`,
      cpp: `vector<vector<int>> subsetsWithBits(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> result;
    
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> subset;
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push_back(nums[i]);
            }
        }
        result.push_back(subset);
    }
    
    return result;
}`,
      java: `public List<List<Integer>> subsetsWithBits(int[] nums) {
    int n = nums.length;
    List<List<Integer>> result = new ArrayList<>();
    
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> subset = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                subset.add(nums[i]);
            }
        }
        result.add(subset);
    }
    
    return result;
}`
    },
    explanation: {
      overview: "Generate all subsets using bit manipulation. Each bit in a number represents whether to include that element.",
      steps: [
        "Iterate from 0 to 2^n - 1",
        "Each number represents a subset",
        "Check each bit position",
        "If bit is 1, include nums[i] in subset",
        "Add subset to result"
      ],
      useCase: "Subset generation, combinatorics, power set problems.",
      tips: [
        "2^n total subsets",
        "Bit i represents nums[i]",
        "Elegant iterative solution",
        "No recursion needed"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Subsets", url: "https://leetcode.com/problems/subsets/", difficulty: "medium" }
    ]
  },
  'merge-k-lists': {
    id: 'merge-k-lists',
    code: {
      typescript: `function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  const minHeap: [number, number, ListNode][] = [];
  
  for (let i = 0; i < lists.length; i++) {
    if (lists[i]) {
      minHeap.push([lists[i].val, i, lists[i]]);
    }
  }
  
  const dummy = new ListNode(0);
  let curr = dummy;
  
  while (minHeap.length) {
    minHeap.sort((a, b) => a[0] - b[0]);
    const [val, listIdx, node] = minHeap.shift()!;
    
    curr.next = node;
    curr = curr.next;
    
    if (node.next) {
      minHeap.push([node.next.val, listIdx, node.next]);
    }
  }
  
  return dummy.next;
}`,
      python: `import heapq

def merge_k_lists(lists):
    min_heap = []
    
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(min_heap, (lst.val, i, lst))
    
    dummy = ListNode(0)
    curr = dummy
    
    while min_heap:
        val, list_idx, node = heapq.heappop(min_heap)
        
        curr.next = node
        curr = curr.next
        
        if node.next:
            heapq.heappush(min_heap, (node.next.val, list_idx, node.next))
    
    return dummy.next`,
      cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](pair<int, ListNode*> a, pair<int, ListNode*> b) {
        return a.first > b.first;
    };
    priority_queue<pair<int, ListNode*>, vector<pair<int, ListNode*>>, decltype(cmp)> minHeap(cmp);
    
    for (auto list : lists) {
        if (list) minHeap.push({list->val, list});
    }
    
    ListNode dummy(0);
    ListNode* curr = &dummy;
    
    while (!minHeap.empty()) {
        auto [val, node] = minHeap.top();
        minHeap.pop();
        
        curr->next = node;
        curr = curr->next;
        
        if (node->next) {
            minHeap.push({node->next->val, node->next});
        }
    }
    
    return dummy.next;
}`,
      java: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> minHeap = new PriorityQueue<>((a, b) -> a.val - b.val);
    
    for (ListNode list : lists) {
        if (list != null) minHeap.offer(list);
    }
    
    ListNode dummy = new ListNode(0);
    ListNode curr = dummy;
    
    while (!minHeap.isEmpty()) {
        ListNode node = minHeap.poll();
        curr.next = node;
        curr = curr.next;
        
        if (node.next != null) {
            minHeap.offer(node.next);
        }
    }
    
    return dummy.next;
}`
    },
    explanation: {
      overview: "Merge k sorted linked lists using a min heap to efficiently find the smallest element among list heads.",
      steps: [
        "Add head of each list to min heap",
        "Extract minimum from heap",
        "Add to result list",
        "Add next node from same list to heap",
        "Repeat until heap is empty"
      ],
      useCase: "External sorting, merging sorted data streams, distributed systems.",
      tips: [
        "Min heap of size k",
        "O(N log k) time complexity",
        "N = total nodes",
        "Better than merging pairs"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", difficulty: "hard" }
    ]
  },
  'sliding-window-maximum': {
    id: 'sliding-window-maximum',
    code: {
      typescript: `function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  const deque: number[] = [];
  
  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (deque.length && deque[0] < i - k + 1) {
      deque.shift();
    }
    
    // Remove smaller elements
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    
    deque.push(i);
    
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  
  return result;
}`,
      python: `from collections import deque

def max_sliding_window(nums, k):
    result = []
    dq = deque()
    
    for i in range(len(nums)):
        # Remove indices outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove smaller elements
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result`,
      cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    vector<int> result;
    deque<int> dq;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove indices outside window
        while (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }
        
        // Remove smaller elements
        while (!dq.empty() && nums[dq.back()] < nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    
    return result;
}`,
      java: `public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> deque = new LinkedList<>();
    
    for (int i = 0; i < n; i++) {
        // Remove indices outside window
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.pollFirst();
        }
        
        // Remove smaller elements
        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
            deque.pollLast();
        }
        
        deque.offerLast(i);
        
        if (i >= k - 1) {
            result[i - k + 1] = nums[deque.peekFirst()];
        }
    }
    
    return result;
}`
    },
    explanation: {
      overview: "Find maximum in each sliding window of size k using a monotonic decreasing deque.",
      steps: [
        "Maintain deque of indices in decreasing order of values",
        "Remove indices outside current window",
        "Remove smaller elements from back",
        "Add current index",
        "Front of deque is maximum for window"
      ],
      useCase: "Stock price analysis, real-time data monitoring, streaming max queries.",
      tips: [
        "Monotonic deque pattern",
        "O(n) time complexity",
        "Store indices, not values",
        "Front always has maximum"
      ]
    },
    visualizationType: 'none',
    practiceProblems: [
      { title: "Sliding Window Maximum", url: "https://leetcode.com/problems/sliding-window-maximum/", difficulty: "hard" }
    ]
  },
  'sieve-of-eratosthenes': {
    id: 'sieve-of-eratosthenes',
    code: {
      typescript: `function sieveOfEratosthenes(n: number): number[] {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  
  return isPrime.map((prime, i) => prime ? i : -1).filter(x => x !== -1);
}`,
      python: `def sieve_of_eratosthenes(n: int) -> list[int]:
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n + 1, i):
                is_prime[j] = False
    
    return [i for i, prime in enumerate(is_prime) if prime]`,
      cpp: `#include <vector>
using namespace std;

vector<int> sieveOfEratosthenes(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    
    for (int i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    vector<int> primes;
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push_back(i);
    }
    return primes;
}`,
      java: `import java.util.*;

public List<Integer> sieveOfEratosthenes(int n) {
    boolean[] isPrime = new boolean[n + 1];
    Arrays.fill(isPrime, true);
    isPrime[0] = isPrime[1] = false;
    
    for (int i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    List<Integer> primes = new ArrayList<>();
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.add(i);
    }
    return primes;
}`
    },
    explanation: {
      overview: 'Efficiently finds all prime numbers up to n by iteratively marking multiples of each prime.',
      steps: [
        'Create boolean array marking all as prime',
        'Mark 0 and 1 as non-prime',
        'For each prime p, mark all multiples starting from p² as composite',
        'Continue until p² > n',
        'Collect all remaining marked primes'
      ],
      useCase: 'Prime generation, cryptography, number theory problems.',
      tips: [
        'Time: O(n log log n)',
        'Space: O(n)',
        'Start marking from i² for efficiency',
        'Only check up to √n'
      ]
    },
    visualizationType: 'array'
  }
};

// Helper function to get implementation
export function getAlgorithmImplementation(id: string): AlgorithmImplementation | undefined {
  return algorithmImplementations[id];
}
