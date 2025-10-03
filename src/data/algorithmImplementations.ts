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
  }
};

// Helper function to get implementation
export function getAlgorithmImplementation(id: string): AlgorithmImplementation | undefined {
  return algorithmImplementations[id];
}
