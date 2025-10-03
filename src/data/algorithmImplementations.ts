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
  
  // Calculate sum of first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}`,
      python: `def max_sum_subarray(arr: list[int], k: int) -> int:
    max_sum = 0
    window_sum = 0
    
    # Calculate sum of first window
    for i in range(k):
        window_sum += arr[i]
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxSumSubarray(vector<int>& arr, int k) {
    int maxSum = 0;
    int windowSum = 0;
    
    // Calculate sum of first window
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    // Slide the window
    for (int i = k; i < arr.size(); i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}`,
      java: `public class Solution {
    public int maxSumSubarray(int[] arr, int k) {
        int maxSum = 0;
        int windowSum = 0;
        
        // Calculate sum of first window
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        maxSum = windowSum;
        
        // Slide the window
        for (int i = k; i < arr.length; i++) {
            windowSum = windowSum - arr[i - k] + arr[i];
            maxSum = Math.max(maxSum, windowSum);
        }
        
        return maxSum;
    }
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
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
      cpp: `#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
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
      java: `public class Solution {
    public int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
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
    }
}`
    },
    explanation: {
      overview: "Binary search efficiently finds an element in a sorted array by repeatedly dividing the search interval in half, eliminating half of the remaining elements in each step.",
      steps: [
        "Start with left pointer at 0 and right pointer at array length - 1",
        "Calculate middle index: mid = (left + right) / 2",
        "Compare target with element at mid",
        "If equal, return mid (found)",
        "If target is greater, search right half (left = mid + 1)",
        "If target is smaller, search left half (right = mid - 1)",
        "Repeat until found or left > right (not found)"
      ],
      useCase: "Essential for searching in sorted data structures. Used in finding elements, finding insertion positions, search rotated arrays, and finding boundaries (first/last occurrence).",
      tips: [
        "Array must be sorted",
        "Time complexity: O(log n)",
        "Space complexity: O(1) iterative, O(log n) recursive",
        "Use left + (right - left) / 2 to avoid overflow"
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

public class Solution {
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
    }
}`
    },
    explanation: {
      overview: "Reverse a linked list by iteratively changing the direction of next pointers, making each node point to its previous node instead of its next node.",
      steps: [
        "Initialize prev as null and curr as head",
        "Save curr.next in a temporary variable (next)",
        "Reverse the link: set curr.next to prev",
        "Move prev forward to curr",
        "Move curr forward to next",
        "Repeat until curr becomes null",
        "Return prev (new head)"
      ],
      useCase: "Fundamental linked list operation used in problems involving list manipulation, palindrome checking, reversing sublists, and as a building block for more complex algorithms.",
      tips: [
        "Time complexity: O(n) - single pass",
        "Space complexity: O(1) - only pointers",
        "Can also be done recursively with O(n) space",
        "Remember to save next before changing pointers"
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
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  
  function dfs(node: TreeNode | null) {
    if (!node) return;
    
    result.push(node.val);  // Visit root
    dfs(node.left);         // Traverse left
    dfs(node.right);        // Traverse right
  }
  
  dfs(root);
  return result;
}`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder_traversal(root: TreeNode) -> list[int]:
    result = []
    
    def dfs(node):
        if not node:
            return
        
        result.append(node.val)  # Visit root
        dfs(node.left)           # Traverse left
        dfs(node.right)          # Traverse right
    
    dfs(root)
    return result`,
      cpp: `#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

void dfs(TreeNode* node, vector<int>& result) {
    if (!node) return;
    
    result.push_back(node->val);  // Visit root
    dfs(node->left, result);      // Traverse left
    dfs(node->right, result);     // Traverse right
}

vector<int> preorderTraversal(TreeNode* root) {
    vector<int> result;
    dfs(root, result);
    return result;
}`,
      java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, result);
        return result;
    }
    
    private void dfs(TreeNode node, List<Integer> result) {
        if (node == null) return;
        
        result.add(node.val);       // Visit root
        dfs(node.left, result);     // Traverse left
        dfs(node.right, result);    // Traverse right
    }
}`
    },
    explanation: {
      overview: "Preorder DFS traverses a tree by visiting the root first, then recursively traversing the left subtree, followed by the right subtree. Order: Root → Left → Right.",
      steps: [
        "Visit and process the current node (root)",
        "Recursively traverse the left subtree",
        "Recursively traverse the right subtree",
        "Base case: return when node is null",
        "Collect values in preorder sequence"
      ],
      useCase: "Used for creating a copy of the tree, prefix expression evaluation, serializing tree structure, and problems where you need to process parent before children.",
      tips: [
        "Time complexity: O(n) - visits each node once",
        "Space complexity: O(h) - recursion stack depth",
        "Can be implemented iteratively using a stack",
        "Remember: Process current before children"
      ]
    },
    visualizationType: 'tree'
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
    visited = set()
    queue = deque([start])
    result = []
    
    visited.add(start)
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result`,
      cpp: `#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

vector<int> bfs(vector<vector<int>>& graph, int start) {
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
      java: `import java.util.*;

public class Solution {
    public List<Integer> bfs(List<List<Integer>> graph, int start) {
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
    }
}`
    },
    explanation: {
      overview: "Breadth-First Search explores a graph level by level, visiting all neighbors of a node before moving to their neighbors. Uses a queue for level-order traversal.",
      steps: [
        "Initialize queue with starting node and mark as visited",
        "Dequeue a node and process it",
        "Add all unvisited neighbors to queue and mark as visited",
        "Repeat until queue is empty",
        "Ensures nodes are visited in order of distance from start"
      ],
      useCase: "Perfect for shortest path in unweighted graphs, level-order operations, finding connected components, and problems requiring minimum steps or distance calculations.",
      tips: [
        "Time complexity: O(V + E) - visits all vertices and edges",
        "Space complexity: O(V) - queue and visited set",
        "Always use a queue (FIFO) for BFS",
        "Mark nodes as visited when adding to queue, not when processing"
      ]
    },
    visualizationType: 'graph'
  }
};

// Helper function to get implementation
export function getAlgorithmImplementation(id: string): AlgorithmImplementation | undefined {
  return algorithmImplementations[id];
}
