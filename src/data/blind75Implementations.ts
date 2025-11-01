export const blind75Implementations: Record<string, {
  python: string;
  java: string;
  cpp: string;
  typescript: string;
  explanation: string;
}> = {
  "two-sum": {
    python: `def twoSum(nums: List[int], target: int) -> List[int]:
    # Hash map to store number and its index
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        # Check if complement exists in hash map
        if complement in seen:
            return [seen[complement], i]
        
        # Store current number and its index
        seen[num] = i
    
    return []  # No solution found`,
    java: `public int[] twoSum(int[] nums, int target) {
    // Hash map to store number and its index
    Map<Integer, Integer> seen = new HashMap<>();
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        
        // Check if complement exists in hash map
        if (seen.containsKey(complement)) {
            return new int[] { seen.get(complement), i };
        }
        
        // Store current number and its index
        seen.put(nums[i], i);
    }
    
    return new int[] {}; // No solution found
}`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Hash map to store number and its index
    unordered_map<int, int> seen;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        // Check if complement exists in hash map
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        
        // Store current number and its index
        seen[nums[i]] = i;
    }
    
    return {}; // No solution found
}`,
    typescript: `function twoSum(nums: number[], target: number): number[] {
    // Hash map to store number and its index
    const seen = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // Check if complement exists in hash map
        if (seen.has(complement)) {
            return [seen.get(complement)!, i];
        }
        
        // Store current number and its index
        seen.set(nums[i], i);
    }
    
    return []; // No solution found
}`,
    explanation: "Use a hash map to store each number and its index as we iterate. For each number, check if its complement (target - current number) exists in the hash map. If found, return both indices. Otherwise, add the current number to the hash map."
  },
  "best-time-to-buy-and-sell-stock": {
    python: `def maxProfit(prices: List[int]) -> int:
    if not prices:
        return 0
    
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        # Update minimum price seen so far
        min_price = min(min_price, price)
        
        # Calculate profit if we sell at current price
        profit = price - min_price
        
        # Update maximum profit
        max_profit = max(max_profit, profit)
    
    return max_profit`,
    java: `public int maxProfit(int[] prices) {
    if (prices.length == 0) return 0;
    
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;
    
    for (int price : prices) {
        // Update minimum price seen so far
        minPrice = Math.min(minPrice, price);
        
        // Calculate profit if we sell at current price
        int profit = price - minPrice;
        
        // Update maximum profit
        maxProfit = Math.max(maxProfit, profit);
    }
    
    return maxProfit;
}`,
    cpp: `int maxProfit(vector<int>& prices) {
    if (prices.empty()) return 0;
    
    int minPrice = INT_MAX;
    int maxProfit = 0;
    
    for (int price : prices) {
        // Update minimum price seen so far
        minPrice = min(minPrice, price);
        
        // Calculate profit if we sell at current price
        int profit = price - minPrice;
        
        // Update maximum profit
        maxProfit = max(maxProfit, profit);
    }
    
    return maxProfit;
}`,
    typescript: `function maxProfit(prices: number[]): number {
    if (prices.length === 0) return 0;
    
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (const price of prices) {
        // Update minimum price seen so far
        minPrice = Math.min(minPrice, price);
        
        // Calculate profit if we sell at current price
        const profit = price - minPrice;
        
        // Update maximum profit
        maxProfit = Math.max(maxProfit, profit);
    }
    
    return maxProfit;
}`,
    explanation: "Track the minimum price seen so far and the maximum profit. For each price, calculate the profit if we sell at that price (current price - minimum price). Update the maximum profit if this profit is greater."
  },
  "contains-duplicate": {
    python: `def containsDuplicate(nums: List[int]) -> bool:
    # Use a set to track seen numbers
    seen = set()
    
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    
    return False

# Alternative one-liner
# return len(nums) != len(set(nums))`,
    java: `public boolean containsDuplicate(int[] nums) {
    // Use a HashSet to track seen numbers
    Set<Integer> seen = new HashSet<>();
    
    for (int num : nums) {
        if (seen.contains(num)) {
            return true;
        }
        seen.add(num);
    }
    
    return false;
}`,
    cpp: `bool containsDuplicate(vector<int>& nums) {
    // Use an unordered_set to track seen numbers
    unordered_set<int> seen;
    
    for (int num : nums) {
        if (seen.find(num) != seen.end()) {
            return true;
        }
        seen.insert(num);
    }
    
    return false;
}`,
    typescript: `function containsDuplicate(nums: number[]): boolean {
    // Use a Set to track seen numbers
    const seen = new Set<number>();
    
    for (const num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    
    return false;
}`,
    explanation: "Use a hash set to track numbers we've seen. As we iterate through the array, if we encounter a number that's already in the set, we have a duplicate. Otherwise, add the number to the set and continue."
  },
  "maximum-subarray": {
    python: `def maxSubArray(nums: List[int]) -> int:
    # Kadane's Algorithm
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        # Either extend the existing subarray or start new
        current_sum = max(nums[i], current_sum + nums[i])
        
        # Update maximum sum found
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
    java: `public int maxSubArray(int[] nums) {
    // Kadane's Algorithm
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        // Either extend the existing subarray or start new
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        
        // Update maximum sum found
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
    cpp: `int maxSubArray(vector<int>& nums) {
    // Kadane's Algorithm
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        // Either extend the existing subarray or start new
        currentSum = max(nums[i], currentSum + nums[i]);
        
        // Update maximum sum found
        maxSum = max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
    typescript: `function maxSubArray(nums: number[]): number {
    // Kadane's Algorithm
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // Either extend the existing subarray or start new
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        
        // Update maximum sum found
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
    explanation: "Kadane's Algorithm: Maintain current sum of subarray. At each element, decide whether to extend the existing subarray or start a new one from the current element. Track the maximum sum seen so far."
  },
  "reverse-linked-list": {
    python: `def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    prev = None
    current = head
    
    while current:
        # Save next node
        next_node = current.next
        
        # Reverse the link
        current.next = prev
        
        # Move pointers forward
        prev = current
        current = next_node
    
    return prev`,
    java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        // Save next node
        ListNode nextNode = current.next;
        
        // Reverse the link
        current.next = prev;
        
        // Move pointers forward
        prev = current;
        current = nextNode;
    }
    
    return prev;
}`,
    cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    
    while (current != nullptr) {
        // Save next node
        ListNode* nextNode = current->next;
        
        // Reverse the link
        current->next = prev;
        
        // Move pointers forward
        prev = current;
        current = nextNode;
    }
    
    return prev;
}`,
    typescript: `function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let current = head;
    
    while (current !== null) {
        // Save next node
        const nextNode = current.next;
        
        // Reverse the link
        current.next = prev;
        
        // Move pointers forward
        prev = current;
        current = nextNode;
    }
    
    return prev;
}`,
    explanation: "Use three pointers: prev, current, and next. Iterate through the list, reversing the link direction by pointing current.next to prev. Move all pointers one step forward until we reach the end."
  }
};
