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
  },
  "product-of-array-except-self": {
    python: `def productExceptSelf(nums: List[int]) -> List[int]:
    n = len(nums)
    result = [1] * n
    
    # Calculate left products
    left_product = 1
    for i in range(n):
        result[i] = left_product
        left_product *= nums[i]
    
    # Calculate right products and multiply with left
    right_product = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right_product
        right_product *= nums[i]
    
    return result`,
    java: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, 1);
    
    // Calculate left products
    int leftProduct = 1;
    for (int i = 0; i < n; i++) {
        result[i] = leftProduct;
        leftProduct *= nums[i];
    }
    
    // Calculate right products and multiply with left
    int rightProduct = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= rightProduct;
        rightProduct *= nums[i];
    }
    
    return result;
}`,
    cpp: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, 1);
    
    // Calculate left products
    int leftProduct = 1;
    for (int i = 0; i < n; i++) {
        result[i] = leftProduct;
        leftProduct *= nums[i];
    }
    
    // Calculate right products and multiply with left
    int rightProduct = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= rightProduct;
        rightProduct *= nums[i];
    }
    
    return result;
}`,
    typescript: `function productExceptSelf(nums: number[]): number[] {
    const n = nums.length;
    const result = new Array(n).fill(1);
    
    // Calculate left products
    let leftProduct = 1;
    for (let i = 0; i < n; i++) {
        result[i] = leftProduct;
        leftProduct *= nums[i];
    }
    
    // Calculate right products and multiply with left
    let rightProduct = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= rightProduct;
        rightProduct *= nums[i];
    }
    
    return result;
}`,
    explanation: "Two-pass approach: First pass calculates product of all elements to the left of each index. Second pass calculates product of all elements to the right and multiplies with left products. This avoids division and achieves O(1) space (excluding output array)."
  },
  "maximum-product-subarray": {
    python: `def maxProduct(nums: List[int]) -> int:
    if not nums:
        return 0
    
    max_product = nums[0]
    current_max = nums[0]
    current_min = nums[0]
    
    for i in range(1, len(nums)):
        num = nums[i]
        
        # Store current_max before updating
        temp_max = current_max
        
        # Update max and min
        current_max = max(num, num * current_max, num * current_min)
        current_min = min(num, num * temp_max, num * current_min)
        
        # Update global maximum
        max_product = max(max_product, current_max)
    
    return max_product`,
    java: `public int maxProduct(int[] nums) {
    if (nums.length == 0) return 0;
    
    int maxProduct = nums[0];
    int currentMax = nums[0];
    int currentMin = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        int num = nums[i];
        
        // Store currentMax before updating
        int tempMax = currentMax;
        
        // Update max and min
        currentMax = Math.max(num, Math.max(num * currentMax, num * currentMin));
        currentMin = Math.min(num, Math.min(num * tempMax, num * currentMin));
        
        // Update global maximum
        maxProduct = Math.max(maxProduct, currentMax);
    }
    
    return maxProduct;
}`,
    cpp: `int maxProduct(vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int maxProduct = nums[0];
    int currentMax = nums[0];
    int currentMin = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        int num = nums[i];
        
        // Store currentMax before updating
        int tempMax = currentMax;
        
        // Update max and min
        currentMax = max({num, num * currentMax, num * currentMin});
        currentMin = min({num, num * tempMax, num * currentMin});
        
        // Update global maximum
        maxProduct = max(maxProduct, currentMax);
    }
    
    return maxProduct;
}`,
    typescript: `function maxProduct(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    let maxProduct = nums[0];
    let currentMax = nums[0];
    let currentMin = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        const num = nums[i];
        
        // Store currentMax before updating
        const tempMax = currentMax;
        
        // Update max and min
        currentMax = Math.max(num, num * currentMax, num * currentMin);
        currentMin = Math.min(num, num * tempMax, num * currentMin);
        
        // Update global maximum
        maxProduct = Math.max(maxProduct, currentMax);
    }
    
    return maxProduct;
}`,
    explanation: "Track both maximum and minimum products at each position. A negative number can turn the minimum into maximum and vice versa. At each step, consider: the current number alone, current number × current max, or current number × current min."
  },
  "find-minimum-in-rotated-sorted-array": {
    python: `def findMin(nums: List[int]) -> int:
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = (left + right) // 2
        
        # If mid element is greater than right element,
        # minimum must be in right half
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            # Minimum is in left half (including mid)
            right = mid
    
    return nums[left]`,
    java: `public int findMin(int[] nums) {
    int left = 0, right = nums.length - 1;
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        // If mid element is greater than right element,
        // minimum must be in right half
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            // Minimum is in left half (including mid)
            right = mid;
        }
    }
    
    return nums[left];
}`,
    cpp: `int findMin(vector<int>& nums) {
    int left = 0, right = nums.size() - 1;
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        // If mid element is greater than right element,
        // minimum must be in right half
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            // Minimum is in left half (including mid)
            right = mid;
        }
    }
    
    return nums[left];
}`,
    typescript: `function findMin(nums: number[]): number {
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // If mid element is greater than right element,
        // minimum must be in right half
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            // Minimum is in left half (including mid)
            right = mid;
        }
    }
    
    return nums[left];
}`,
    explanation: "Binary search approach. Compare mid element with right element. If mid > right, rotation point (and minimum) is in right half. Otherwise, minimum is in left half. Converge until left equals right."
  },
  "search-in-rotated-sorted-array": {
    python: `def search(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        
        # Determine which half is sorted
        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1`,
    java: `public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        }
        
        // Determine which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}`,
    cpp: `int search(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        }
        
        // Determine which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}`,
    typescript: `function search(nums: number[], target: number): number {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // Determine which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}`,
    explanation: "Modified binary search. At each step, determine which half is properly sorted by comparing endpoints. If target is in the sorted half's range, search that half. Otherwise, search the other half. This maintains O(log n) time."
  },
  "3sum": {
    python: `def threeSum(nums: List[int]) -> List[List[int]]:
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        # Skip duplicates for first number
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        left, right = i + 1, len(nums) - 1
        target = -nums[i]
        
        while left < right:
            current_sum = nums[left] + nums[right]
            
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates for second and third numbers
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    
    return result`,
    java: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    
    for (int i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for first number
        if (i > 0 && nums[i] == nums[i - 1]) {
            continue;
        }
        
        int left = i + 1, right = nums.length - 1;
        int target = -nums[i];
        
        while (left < right) {
            int currentSum = nums[left] + nums[right];
            
            if (currentSum == target) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                
                // Skip duplicates for second and third numbers
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}`,
    cpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    
    for (int i = 0; i < nums.size() - 2; i++) {
        // Skip duplicates for first number
        if (i > 0 && nums[i] == nums[i - 1]) {
            continue;
        }
        
        int left = i + 1, right = nums.size() - 1;
        int target = -nums[i];
        
        while (left < right) {
            int currentSum = nums[left] + nums[right];
            
            if (currentSum == target) {
                result.push_back({nums[i], nums[left], nums[right]});
                
                // Skip duplicates for second and third numbers
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}`,
    typescript: `function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for first number
        if (i > 0 && nums[i] === nums[i - 1]) {
            continue;
        }
        
        let left = i + 1, right = nums.length - 1;
        const target = -nums[i];
        
        while (left < right) {
            const currentSum = nums[left] + nums[right];
            
            if (currentSum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                
                // Skip duplicates for second and third numbers
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}`,
    explanation: "Sort array first. For each number, use two pointers to find pairs that sum to its negative. Skip duplicates to avoid duplicate triplets. Time: O(n²), Space: O(1) excluding output."
  },
  "container-with-most-water": {
    python: `def maxArea(height: List[int]) -> int:
    left, right = 0, len(height) - 1
    max_area = 0
    
    while left < right:
        # Calculate current area
        width = right - left
        current_height = min(height[left], height[right])
        current_area = width * current_height
        
        # Update maximum area
        max_area = max(max_area, current_area)
        
        # Move pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area`,
    java: `public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxArea = 0;
    
    while (left < right) {
        // Calculate current area
        int width = right - left;
        int currentHeight = Math.min(height[left], height[right]);
        int currentArea = width * currentHeight;
        
        // Update maximum area
        maxArea = Math.max(maxArea, currentArea);
        
        // Move pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxArea;
}`,
    cpp: `int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxArea = 0;
    
    while (left < right) {
        // Calculate current area
        int width = right - left;
        int currentHeight = min(height[left], height[right]);
        int currentArea = width * currentHeight;
        
        // Update maximum area
        maxArea = max(maxArea, currentArea);
        
        // Move pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxArea;
}`,
    typescript: `function maxArea(height: number[]): number {
    let left = 0, right = height.length - 1;
    let maxArea = 0;
    
    while (left < right) {
        // Calculate current area
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const currentArea = width * currentHeight;
        
        // Update maximum area
        maxArea = Math.max(maxArea, currentArea);
        
        // Move pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxArea;
}`,
    explanation: "Two pointers from both ends. Area is determined by min(height[left], height[right]) × width. Always move the pointer with smaller height inward, as moving the taller one can only decrease area. This greedy approach finds the maximum in O(n) time."
  },
  "combination-sum": {
    python: `def combinationSum(candidates: List[int], target: int) -> List[List[int]]:
    result = []
    
    def backtrack(start, current, total):
        # Base case: found valid combination
        if total == target:
            result.append(current[:])
            return
        
        # Base case: exceeded target
        if total > target:
            return
        
        # Try each candidate starting from 'start' index
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            # Can reuse same element, so pass 'i' not 'i+1'
            backtrack(i, current, total + candidates[i])
            current.pop()
    
    backtrack(0, [], 0)
    return result`,
    java: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(candidates, target, 0, new ArrayList<>(), 0, result);
    return result;
}

private void backtrack(int[] candidates, int target, int start, 
                       List<Integer> current, int total, 
                       List<List<Integer>> result) {
    // Base case: found valid combination
    if (total == target) {
        result.add(new ArrayList<>(current));
        return;
    }
    
    // Base case: exceeded target
    if (total > target) {
        return;
    }
    
    // Try each candidate starting from 'start' index
    for (int i = start; i < candidates.length; i++) {
        current.add(candidates[i]);
        // Can reuse same element, so pass 'i' not 'i+1'
        backtrack(candidates, target, i, current, total + candidates[i], result);
        current.remove(current.size() - 1);
    }
}`,
    cpp: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    vector<vector<int>> result;
    vector<int> current;
    backtrack(candidates, target, 0, current, 0, result);
    return result;
}

void backtrack(vector<int>& candidates, int target, int start, 
               vector<int>& current, int total, 
               vector<vector<int>>& result) {
    // Base case: found valid combination
    if (total == target) {
        result.push_back(current);
        return;
    }
    
    // Base case: exceeded target
    if (total > target) {
        return;
    }
    
    // Try each candidate starting from 'start' index
    for (int i = start; i < candidates.size(); i++) {
        current.push_back(candidates[i]);
        // Can reuse same element, so pass 'i' not 'i+1'
        backtrack(candidates, target, i, current, total + candidates[i], result);
        current.pop_back();
    }
}`,
    typescript: `function combinationSum(candidates: number[], target: number): number[][] {
    const result: number[][] = [];
    
    function backtrack(start: number, current: number[], total: number) {
        // Base case: found valid combination
        if (total === target) {
            result.push([...current]);
            return;
        }
        
        // Base case: exceeded target
        if (total > target) {
            return;
        }
        
        // Try each candidate starting from 'start' index
        for (let i = start; i < candidates.length; i++) {
            current.push(candidates[i]);
            // Can reuse same element, so pass 'i' not 'i+1'
            backtrack(i, current, total + candidates[i]);
            current.pop();
        }
    }
    
    backtrack(0, [], 0);
    return result;
}`,
    explanation: "Use backtracking to explore all combinations. Key insight: since we can reuse elements, pass current index 'i' (not i+1) in recursion. Sort candidates first for optimization (optional). Prune branches when total exceeds target."
  },
  "house-robber": {
    python: `def rob(nums: List[int]) -> int:
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # Track max money from two previous houses
    prev2 = 0  # i-2
    prev1 = 0  # i-1
    
    for num in nums:
        # Either rob current + i-2, or skip current (take i-1)
        temp = max(num + prev2, prev1)
        prev2 = prev1
        prev1 = temp
    
    return prev1`,
    java: `public int rob(int[] nums) {
    if (nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];
    
    // Track max money from two previous houses
    int prev2 = 0;  // i-2
    int prev1 = 0;  // i-1
    
    for (int num : nums) {
        // Either rob current + i-2, or skip current (take i-1)
        int temp = Math.max(num + prev2, prev1);
        prev2 = prev1;
        prev1 = temp;
    }
    
    return prev1;
}`,
    cpp: `int rob(vector<int>& nums) {
    if (nums.empty()) return 0;
    if (nums.size() == 1) return nums[0];
    
    // Track max money from two previous houses
    int prev2 = 0;  // i-2
    int prev1 = 0;  // i-1
    
    for (int num : nums) {
        // Either rob current + i-2, or skip current (take i-1)
        int temp = max(num + prev2, prev1);
        prev2 = prev1;
        prev1 = temp;
    }
    
    return prev1;
}`,
    typescript: `function rob(nums: number[]): number {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    // Track max money from two previous houses
    let prev2 = 0;  // i-2
    let prev1 = 0;  // i-1
    
    for (const num of nums) {
        // Either rob current + i-2, or skip current (take i-1)
        const temp = Math.max(num + prev2, prev1);
        prev2 = prev1;
        prev1 = temp;
    }
    
    return prev1;
}`,
    explanation: "DP pattern: at each house, decide to rob (add current + best from i-2) or skip (keep best from i-1). Use two variables instead of array for O(1) space. Formula: dp[i] = max(nums[i] + dp[i-2], dp[i-1])."
  },
  "house-robber-ii": {
    python: `def rob(nums: List[int]) -> int:
    if len(nums) == 1:
        return nums[0]
    
    # Helper function from House Robber I
    def rob_linear(houses):
        prev2, prev1 = 0, 0
        for num in houses:
            temp = max(num + prev2, prev1)
            prev2 = prev1
            prev1 = temp
        return prev1
    
    # Case 1: Rob houses 0 to n-2 (exclude last)
    # Case 2: Rob houses 1 to n-1 (exclude first)
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))`,
    java: `public int rob(int[] nums) {
    if (nums.length == 1) return nums[0];
    
    // Case 1: Rob houses 0 to n-2 (exclude last)
    // Case 2: Rob houses 1 to n-1 (exclude first)
    return Math.max(robLinear(nums, 0, nums.length - 2),
                    robLinear(nums, 1, nums.length - 1));
}

private int robLinear(int[] nums, int start, int end) {
    int prev2 = 0, prev1 = 0;
    for (int i = start; i <= end; i++) {
        int temp = Math.max(nums[i] + prev2, prev1);
        prev2 = prev1;
        prev1 = temp;
    }
    return prev1;
}`,
    cpp: `int rob(vector<int>& nums) {
    if (nums.size() == 1) return nums[0];
    
    // Case 1: Rob houses 0 to n-2 (exclude last)
    // Case 2: Rob houses 1 to n-1 (exclude first)
    return max(robLinear(nums, 0, nums.size() - 2),
               robLinear(nums, 1, nums.size() - 1));
}

int robLinear(vector<int>& nums, int start, int end) {
    int prev2 = 0, prev1 = 0;
    for (int i = start; i <= end; i++) {
        int temp = max(nums[i] + prev2, prev1);
        prev2 = prev1;
        prev1 = temp;
    }
    return prev1;
}`,
    typescript: `function rob(nums: number[]): number {
    if (nums.length === 1) return nums[0];
    
    const robLinear = (start: number, end: number): number => {
        let prev2 = 0, prev1 = 0;
        for (let i = start; i <= end; i++) {
            const temp = Math.max(nums[i] + prev2, prev1);
            prev2 = prev1;
            prev1 = temp;
        }
        return prev1;
    };
    
    // Case 1: Rob houses 0 to n-2 (exclude last)
    // Case 2: Rob houses 1 to n-1 (exclude first)
    return Math.max(robLinear(0, nums.length - 2),
                    robLinear(1, nums.length - 1));
}`,
    explanation: "Houses are circular: can't rob both first and last. Split into two cases: (1) rob houses 0..n-2, (2) rob houses 1..n-1. Apply House Robber I logic to each case and take maximum."
  },
  "decode-ways": {
    python: `def numDecodings(s: str) -> int:
    if not s or s[0] == '0':
        return 0
    
    # dp[i] = number of ways to decode s[:i]
    n = len(s)
    prev2 = 1  # dp[i-2]
    prev1 = 1  # dp[i-1]
    
    for i in range(1, n):
        current = 0
        
        # Single digit decode (1-9)
        if s[i] != '0':
            current += prev1
        
        # Two digit decode (10-26)
        two_digit = int(s[i-1:i+1])
        if 10 <= two_digit <= 26:
            current += prev2
        
        prev2 = prev1
        prev1 = current
    
    return prev1`,
    java: `public int numDecodings(String s) {
    if (s == null || s.length() == 0 || s.charAt(0) == '0') {
        return 0;
    }
    
    int n = s.length();
    int prev2 = 1;  // dp[i-2]
    int prev1 = 1;  // dp[i-1]
    
    for (int i = 1; i < n; i++) {
        int current = 0;
        
        // Single digit decode (1-9)
        if (s.charAt(i) != '0') {
            current += prev1;
        }
        
        // Two digit decode (10-26)
        int twoDigit = Integer.parseInt(s.substring(i-1, i+1));
        if (twoDigit >= 10 && twoDigit <= 26) {
            current += prev2;
        }
        
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}`,
    cpp: `int numDecodings(string s) {
    if (s.empty() || s[0] == '0') {
        return 0;
    }
    
    int n = s.length();
    int prev2 = 1;  // dp[i-2]
    int prev1 = 1;  // dp[i-1]
    
    for (int i = 1; i < n; i++) {
        int current = 0;
        
        // Single digit decode (1-9)
        if (s[i] != '0') {
            current += prev1;
        }
        
        // Two digit decode (10-26)
        int twoDigit = stoi(s.substr(i-1, 2));
        if (twoDigit >= 10 && twoDigit <= 26) {
            current += prev2;
        }
        
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}`,
    typescript: `function numDecodings(s: string): number {
    if (!s || s[0] === '0') {
        return 0;
    }
    
    const n = s.length;
    let prev2 = 1;  // dp[i-2]
    let prev1 = 1;  // dp[i-1]
    
    for (let i = 1; i < n; i++) {
        let current = 0;
        
        // Single digit decode (1-9)
        if (s[i] !== '0') {
            current += prev1;
        }
        
        // Two digit decode (10-26)
        const twoDigit = parseInt(s.substring(i-1, i+1));
        if (twoDigit >= 10 && twoDigit <= 26) {
            current += prev2;
        }
        
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}`,
    explanation: "DP: at position i, we can decode as single digit (if 1-9) using dp[i-1] ways, or as two digits (if 10-26) using dp[i-2] ways. Handle '0' carefully - it can only be part of 10 or 20. Optimize to O(1) space with two variables."
  },
  "unique-paths": {
    python: `def uniquePaths(m: int, n: int) -> int:
    # Create DP table
    dp = [[1] * n for _ in range(m)]
    
    # Fill DP table
    for i in range(1, m):
        for j in range(1, n):
            # Paths from top + paths from left
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]`,
    java: `public int uniquePaths(int m, int n) {
    // Create DP table
    int[][] dp = new int[m][n];
    
    // Initialize first row and column
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;
    
    // Fill DP table
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            // Paths from top + paths from left
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}`,
    cpp: `int uniquePaths(int m, int n) {
    // Create DP table
    vector<vector<int>> dp(m, vector<int>(n, 1));
    
    // Fill DP table
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            // Paths from top + paths from left
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}`,
    typescript: `function uniquePaths(m: number, n: number): number {
    // Create DP table
    const dp: number[][] = Array(m).fill(0).map(() => Array(n).fill(1));
    
    // Fill DP table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            // Paths from top + paths from left
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}`,
    explanation: "2D DP: dp[i][j] = paths to reach cell (i,j). Since we can only move right or down, dp[i][j] = dp[i-1][j] + dp[i][j-1]. First row and column are all 1s. Can optimize to O(n) space using 1D array."
  },
  "jump-game": {
    python: `def canJump(nums: List[int]) -> bool:
    # Track the farthest position we can reach
    max_reach = 0
    
    for i in range(len(nums)):
        # If current position is beyond max reach, can't proceed
        if i > max_reach:
            return False
        
        # Update max reach from current position
        max_reach = max(max_reach, i + nums[i])
        
        # Early exit if we can reach the end
        if max_reach >= len(nums) - 1:
            return True
    
    return True`,
    java: `public boolean canJump(int[] nums) {
    // Track the farthest position we can reach
    int maxReach = 0;
    
    for (int i = 0; i < nums.length; i++) {
        // If current position is beyond max reach, can't proceed
        if (i > maxReach) {
            return false;
        }
        
        // Update max reach from current position
        maxReach = Math.max(maxReach, i + nums[i]);
        
        // Early exit if we can reach the end
        if (maxReach >= nums.length - 1) {
            return true;
        }
    }
    
    return true;
}`,
    cpp: `bool canJump(vector<int>& nums) {
    // Track the farthest position we can reach
    int maxReach = 0;
    
    for (int i = 0; i < nums.size(); i++) {
        // If current position is beyond max reach, can't proceed
        if (i > maxReach) {
            return false;
        }
        
        // Update max reach from current position
        maxReach = max(maxReach, i + nums[i]);
        
        // Early exit if we can reach the end
        if (maxReach >= nums.size() - 1) {
            return true;
        }
    }
    
    return true;
}`,
    typescript: `function canJump(nums: number[]): boolean {
    // Track the farthest position we can reach
    let maxReach = 0;
    
    for (let i = 0; i < nums.length; i++) {
        // If current position is beyond max reach, can't proceed
        if (i > maxReach) {
            return false;
        }
        
        // Update max reach from current position
        maxReach = Math.max(maxReach, i + nums[i]);
        
        // Early exit if we can reach the end
        if (maxReach >= nums.length - 1) {
            return true;
        }
    }
    
    return true;
}`,
    explanation: "Greedy approach: track the farthest index reachable. At each position, if current index > maxReach, we're stuck. Otherwise, update maxReach = max(maxReach, i + nums[i]). If maxReach >= last index, return true."
  },
  "clone-graph": {
    python: `def cloneGraph(node: 'Node') -> 'Node':
    if not node:
        return None
    
    # Map original node to cloned node
    cloned = {}
    
    def dfs(node):
        # If already cloned, return the clone
        if node in cloned:
            return cloned[node]
        
        # Create clone of current node
        clone = Node(node.val)
        cloned[node] = clone
        
        # Clone all neighbors recursively
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)`,
    java: `public Node cloneGraph(Node node) {
    if (node == null) return null;
    
    // Map original node to cloned node
    Map<Node, Node> cloned = new HashMap<>();
    return dfs(node, cloned);
}

private Node dfs(Node node, Map<Node, Node> cloned) {
    // If already cloned, return the clone
    if (cloned.containsKey(node)) {
        return cloned.get(node);
    }
    
    // Create clone of current node
    Node clone = new Node(node.val);
    cloned.put(node, clone);
    
    // Clone all neighbors recursively
    for (Node neighbor : node.neighbors) {
        clone.neighbors.add(dfs(neighbor, cloned));
    }
    
    return clone;
}`,
    cpp: `Node* cloneGraph(Node* node) {
    if (!node) return nullptr;
    
    // Map original node to cloned node
    unordered_map<Node*, Node*> cloned;
    return dfs(node, cloned);
}

Node* dfs(Node* node, unordered_map<Node*, Node*>& cloned) {
    // If already cloned, return the clone
    if (cloned.count(node)) {
        return cloned[node];
    }
    
    // Create clone of current node
    Node* clone = new Node(node->val);
    cloned[node] = clone;
    
    // Clone all neighbors recursively
    for (Node* neighbor : node->neighbors) {
        clone->neighbors.push_back(dfs(neighbor, cloned));
    }
    
    return clone;
}`,
    typescript: `function cloneGraph(node: Node | null): Node | null {
    if (!node) return null;
    
    // Map original node to cloned node
    const cloned = new Map<Node, Node>();
    
    function dfs(node: Node): Node {
        // If already cloned, return the clone
        if (cloned.has(node)) {
            return cloned.get(node)!;
        }
        
        // Create clone of current node
        const clone = new Node(node.val);
        cloned.set(node, clone);
        
        // Clone all neighbors recursively
        for (const neighbor of node.neighbors) {
            clone.neighbors.push(dfs(neighbor));
        }
        
        return clone;
    }
    
    return dfs(node);
}`,
    explanation: "Use DFS with a hashmap to track original->clone mappings. For each node: if already cloned, return clone; otherwise create new node, store mapping, then recursively clone all neighbors. BFS works similarly with a queue."
  },
  "course-schedule": {
    python: `def canFinish(numCourses: int, prerequisites: List[List[int]]) -> bool:
    # Build adjacency list
    graph = [[] for _ in range(numCourses)]
    for course, prereq in prerequisites:
        graph[course].append(prereq)
    
    # Track visit states: 0=unvisited, 1=visiting, 2=visited
    visit = [0] * numCourses
    
    def has_cycle(course):
        if visit[course] == 1:  # Cycle detected
            return True
        if visit[course] == 2:  # Already processed
            return False
        
        visit[course] = 1  # Mark as visiting
        for prereq in graph[course]:
            if has_cycle(prereq):
                return True
        visit[course] = 2  # Mark as visited
        return False
    
    # Check for cycles in each component
    for course in range(numCourses):
        if has_cycle(course):
            return False
    
    return True`,
    java: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    // Build adjacency list
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) {
        graph.add(new ArrayList<>());
    }
    for (int[] prereq : prerequisites) {
        graph.get(prereq[0]).add(prereq[1]);
    }
    
    // Track visit states: 0=unvisited, 1=visiting, 2=visited
    int[] visit = new int[numCourses];
    
    // Check for cycles in each component
    for (int course = 0; course < numCourses; course++) {
        if (hasCycle(course, graph, visit)) {
            return false;
        }
    }
    
    return true;
}

private boolean hasCycle(int course, List<List<Integer>> graph, int[] visit) {
    if (visit[course] == 1) return true;   // Cycle detected
    if (visit[course] == 2) return false;  // Already processed
    
    visit[course] = 1;  // Mark as visiting
    for (int prereq : graph.get(course)) {
        if (hasCycle(prereq, graph, visit)) {
            return true;
        }
    }
    visit[course] = 2;  // Mark as visited
    return false;
}`,
    cpp: `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    // Build adjacency list
    vector<vector<int>> graph(numCourses);
    for (auto& prereq : prerequisites) {
        graph[prereq[0]].push_back(prereq[1]);
    }
    
    // Track visit states: 0=unvisited, 1=visiting, 2=visited
    vector<int> visit(numCourses, 0);
    
    function<bool(int)> hasCycle = [&](int course) {
        if (visit[course] == 1) return true;   // Cycle detected
        if (visit[course] == 2) return false;  // Already processed
        
        visit[course] = 1;  // Mark as visiting
        for (int prereq : graph[course]) {
            if (hasCycle(prereq)) {
                return true;
            }
        }
        visit[course] = 2;  // Mark as visited
        return false;
    };
    
    // Check for cycles in each component
    for (int course = 0; course < numCourses; course++) {
        if (hasCycle(course)) {
            return false;
        }
    }
    
    return true;
}`,
    typescript: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    // Build adjacency list
    const graph: number[][] = Array(numCourses).fill(0).map(() => []);
    for (const [course, prereq] of prerequisites) {
        graph[course].push(prereq);
    }
    
    // Track visit states: 0=unvisited, 1=visiting, 2=visited
    const visit: number[] = Array(numCourses).fill(0);
    
    function hasCycle(course: number): boolean {
        if (visit[course] === 1) return true;   // Cycle detected
        if (visit[course] === 2) return false;  // Already processed
        
        visit[course] = 1;  // Mark as visiting
        for (const prereq of graph[course]) {
            if (hasCycle(prereq)) {
                return true;
            }
        }
        visit[course] = 2;  // Mark as visited
        return false;
    }
    
    // Check for cycles in each component
    for (let course = 0; course < numCourses; course++) {
        if (hasCycle(course)) {
            return false;
        }
    }
    
    return true;
}`,
    explanation: "Cycle detection in directed graph using DFS. Use 3 states: unvisited(0), visiting(1), visited(2). If we encounter a node in 'visiting' state during DFS, there's a cycle. Build adjacency list from prerequisites and check all nodes."
  },
  "pacific-atlantic-water-flow": {
    python: `def pacificAtlantic(heights: List[List[int]]) -> List[List[int]]:
    if not heights:
        return []
    
    m, n = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()
    
    def dfs(r, c, visited, prev_height):
        if (r < 0 or r >= m or c < 0 or c >= n or
            (r, c) in visited or heights[r][c] < prev_height):
            return
        
        visited.add((r, c))
        for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
            dfs(r + dr, c + dc, visited, heights[r][c])
    
    # DFS from Pacific borders (top and left)
    for i in range(m):
        dfs(i, 0, pacific, heights[i][0])
    for j in range(n):
        dfs(0, j, pacific, heights[0][j])
    
    # DFS from Atlantic borders (bottom and right)
    for i in range(m):
        dfs(i, n-1, atlantic, heights[i][n-1])
    for j in range(n):
        dfs(m-1, j, atlantic, heights[m-1][j])
    
    # Find cells reachable by both oceans
    return [[r, c] for r in range(m) for c in range(n) 
            if (r, c) in pacific and (r, c) in atlantic]`,
    java: `public List<List<Integer>> pacificAtlantic(int[][] heights) {
    List<List<Integer>> result = new ArrayList<>();
    if (heights == null || heights.length == 0) return result;
    
    int m = heights.length, n = heights[0].length;
    boolean[][] pacific = new boolean[m][n];
    boolean[][] atlantic = new boolean[m][n];
    
    // DFS from Pacific borders
    for (int i = 0; i < m; i++) {
        dfs(heights, pacific, i, 0);
    }
    for (int j = 0; j < n; j++) {
        dfs(heights, pacific, 0, j);
    }
    
    // DFS from Atlantic borders
    for (int i = 0; i < m; i++) {
        dfs(heights, atlantic, i, n-1);
    }
    for (int j = 0; j < n; j++) {
        dfs(heights, atlantic, m-1, j);
    }
    
    // Find cells reachable by both oceans
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (pacific[i][j] && atlantic[i][j]) {
                result.add(Arrays.asList(i, j));
            }
        }
    }
    
    return result;
}

private void dfs(int[][] heights, boolean[][] visited, int r, int c) {
    int m = heights.length, n = heights[0].length;
    visited[r][c] = true;
    
    int[][] dirs = {{0,1}, {0,-1}, {1,0}, {-1,0}};
    for (int[] dir : dirs) {
        int nr = r + dir[0], nc = c + dir[1];
        if (nr >= 0 && nr < m && nc >= 0 && nc < n &&
            !visited[nr][nc] && heights[nr][nc] >= heights[r][c]) {
            dfs(heights, visited, nr, nc);
        }
    }
}`,
    cpp: `vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    vector<vector<int>> result;
    if (heights.empty()) return result;
    
    int m = heights.size(), n = heights[0].size();
    vector<vector<bool>> pacific(m, vector<bool>(n, false));
    vector<vector<bool>> atlantic(m, vector<bool>(n, false));
    
    function<void(int, int, vector<vector<bool>>&)> dfs = 
        [&](int r, int c, vector<vector<bool>>& visited) {
        visited[r][c] = true;
        vector<pair<int,int>> dirs = {{0,1}, {0,-1}, {1,0}, {-1,0}};
        for (auto [dr, dc] : dirs) {
            int nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n &&
                !visited[nr][nc] && heights[nr][nc] >= heights[r][c]) {
                dfs(nr, nc, visited);
            }
        }
    };
    
    // DFS from borders
    for (int i = 0; i < m; i++) {
        dfs(i, 0, pacific);
        dfs(i, n-1, atlantic);
    }
    for (int j = 0; j < n; j++) {
        dfs(0, j, pacific);
        dfs(m-1, j, atlantic);
    }
    
    // Find intersection
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (pacific[i][j] && atlantic[i][j]) {
                result.push_back({i, j});
            }
        }
    }
    
    return result;
}`,
    typescript: `function pacificAtlantic(heights: number[][]): number[][] {
    if (!heights.length) return [];
    
    const m = heights.length, n = heights[0].length;
    const pacific = Array(m).fill(0).map(() => Array(n).fill(false));
    const atlantic = Array(m).fill(0).map(() => Array(n).fill(false));
    
    function dfs(r: number, c: number, visited: boolean[][]) {
        visited[r][c] = true;
        const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n &&
                !visited[nr][nc] && heights[nr][nc] >= heights[r][c]) {
                dfs(nr, nc, visited);
            }
        }
    }
    
    // DFS from borders
    for (let i = 0; i < m; i++) {
        dfs(i, 0, pacific);
        dfs(i, n-1, atlantic);
    }
    for (let j = 0; j < n; j++) {
        dfs(0, j, pacific);
        dfs(m-1, j, atlantic);
    }
    
    // Find intersection
    const result: number[][] = [];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (pacific[i][j] && atlantic[i][j]) {
                result.push([i, j]);
            }
        }
    }
    
    return result;
}`,
    explanation: "Reverse thinking: instead of checking if water flows to oceans from each cell, DFS from ocean borders inward (water can flow uphill in reverse). Mark cells reachable from Pacific and Atlantic. Cells in both sets can reach both oceans."
  },
  "number-of-islands": {
    python: `def numIslands(grid: List[List[str]]) -> int:
    if not grid:
        return 0
    
    m, n = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        if (r < 0 or r >= m or c < 0 or c >= n or 
            grid[r][c] != '1'):
            return
        
        # Mark as visited by changing to '0'
        grid[r][c] = '0'
        
        # Visit all 4 directions
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                count += 1
                dfs(i, j)  # Sink the island
    
    return count`,
    java: `public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    
    int m = grid.length, n = grid[0].length;
    int count = 0;
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                count++;
                dfs(grid, i, j);  // Sink the island
            }
        }
    }
    
    return count;
}

private void dfs(char[][] grid, int r, int c) {
    int m = grid.length, n = grid[0].length;
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') {
        return;
    }
    
    // Mark as visited
    grid[r][c] = '0';
    
    // Visit all 4 directions
    dfs(grid, r+1, c);
    dfs(grid, r-1, c);
    dfs(grid, r, c+1);
    dfs(grid, r, c-1);
}`,
    cpp: `int numIslands(vector<vector<char>>& grid) {
    if (grid.empty()) return 0;
    
    int m = grid.size(), n = grid[0].size();
    int count = 0;
    
    function<void(int, int)> dfs = [&](int r, int c) {
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') {
            return;
        }
        
        // Mark as visited
        grid[r][c] = '0';
        
        // Visit all 4 directions
        dfs(r+1, c);
        dfs(r-1, c);
        dfs(r, c+1);
        dfs(r, c-1);
    };
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                count++;
                dfs(i, j);  // Sink the island
            }
        }
    }
    
    return count;
}`,
    typescript: `function numIslands(grid: string[][]): number {
    if (!grid.length) return 0;
    
    const m = grid.length, n = grid[0].length;
    let count = 0;
    
    function dfs(r: number, c: number) {
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') {
            return;
        }
        
        // Mark as visited
        grid[r][c] = '0';
        
        // Visit all 4 directions
        dfs(r+1, c);
        dfs(r-1, c);
        dfs(r, c+1);
        dfs(r, c-1);
    }
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                count++;
                dfs(i, j);  // Sink the island
            }
        }
    }
    
    return count;
}`,
    explanation: "For each unvisited land cell ('1'), increment island count and DFS to mark entire connected island as visited (change to '0'). This flood-fill approach ensures each connected component is counted once. Can use BFS or Union-Find as alternatives."
  },
  "longest-consecutive-sequence": {
    python: `def longestConsecutive(nums: List[int]) -> int:
    if not nums:
        return 0
    
    num_set = set(nums)
    max_length = 0
    
    for num in num_set:
        # Only start sequence from the smallest number
        if num - 1 not in num_set:
            current = num
            length = 1
            
            # Count consecutive numbers
            while current + 1 in num_set:
                current += 1
                length += 1
            
            max_length = max(max_length, length)
    
    return max_length`,
    java: `public int longestConsecutive(int[] nums) {
    if (nums.length == 0) return 0;
    
    Set<Integer> numSet = new HashSet<>();
    for (int num : nums) {
        numSet.add(num);
    }
    
    int maxLength = 0;
    
    for (int num : numSet) {
        // Only start sequence from the smallest number
        if (!numSet.contains(num - 1)) {
            int current = num;
            int length = 1;
            
            // Count consecutive numbers
            while (numSet.contains(current + 1)) {
                current++;
                length++;
            }
            
            maxLength = Math.max(maxLength, length);
        }
    }
    
    return maxLength;
}`,
    cpp: `int longestConsecutive(vector<int>& nums) {
    if (nums.empty()) return 0;
    
    unordered_set<int> numSet(nums.begin(), nums.end());
    int maxLength = 0;
    
    for (int num : numSet) {
        // Only start sequence from the smallest number
        if (numSet.find(num - 1) == numSet.end()) {
            int current = num;
            int length = 1;
            
            // Count consecutive numbers
            while (numSet.find(current + 1) != numSet.end()) {
                current++;
                length++;
            }
            
            maxLength = max(maxLength, length);
        }
    }
    
    return maxLength;
}`,
    typescript: `function longestConsecutive(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    const numSet = new Set(nums);
    let maxLength = 0;
    
    for (const num of numSet) {
        // Only start sequence from the smallest number
        if (!numSet.has(num - 1)) {
            let current = num;
            let length = 1;
            
            // Count consecutive numbers
            while (numSet.has(current + 1)) {
                current++;
                length++;
            }
            
            maxLength = Math.max(maxLength, length);
        }
    }
    
    return maxLength;
}`,
    explanation: "Use hash set for O(1) lookups. Key insight: only start counting from sequence beginnings (when num-1 not in set). This ensures each number is visited at most twice, achieving O(n) time despite nested loops."
  },
  "alien-dictionary": {
    python: `def alienOrder(words: List[str]) -> str:
    # Build graph and indegree
    graph = {c: set() for word in words for c in word}
    indegree = {c: 0 for word in words for c in word}
    
    # Compare adjacent words to find ordering
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i+1]
        min_len = min(len(w1), len(w2))
        
        # Check for invalid case: prefix word comes after longer word
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""
        
        # Find first differing character
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in graph[w1[j]]:
                    graph[w1[j]].add(w2[j])
                    indegree[w2[j]] += 1
                break
    
    # Topological sort using Kahn's algorithm
    queue = deque([c for c in indegree if indegree[c] == 0])
    result = []
    
    while queue:
        char = queue.popleft()
        result.append(char)
        
        for neighbor in graph[char]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycle
    if len(result) != len(indegree):
        return ""
    
    return ''.join(result)`,
    java: `public String alienOrder(String[] words) {
    // Build graph
    Map<Character, Set<Character>> graph = new HashMap<>();
    Map<Character, Integer> indegree = new HashMap<>();
    
    for (String word : words) {
        for (char c : word.toCharArray()) {
            graph.putIfAbsent(c, new HashSet<>());
            indegree.putIfAbsent(c, 0);
        }
    }
    
    // Find ordering from adjacent words
    for (int i = 0; i < words.length - 1; i++) {
        String w1 = words[i], w2 = words[i+1];
        int minLen = Math.min(w1.length(), w2.length());
        
        if (w1.length() > w2.length() && w1.startsWith(w2)) {
            return "";
        }
        
        for (int j = 0; j < minLen; j++) {
            if (w1.charAt(j) != w2.charAt(j)) {
                char from = w1.charAt(j), to = w2.charAt(j);
                if (!graph.get(from).contains(to)) {
                    graph.get(from).add(to);
                    indegree.put(to, indegree.get(to) + 1);
                }
                break;
            }
        }
    }
    
    // Topological sort
    Queue<Character> queue = new LinkedList<>();
    for (char c : indegree.keySet()) {
        if (indegree.get(c) == 0) {
            queue.offer(c);
        }
    }
    
    StringBuilder result = new StringBuilder();
    while (!queue.isEmpty()) {
        char c = queue.poll();
        result.append(c);
        
        for (char neighbor : graph.get(c)) {
            indegree.put(neighbor, indegree.get(neighbor) - 1);
            if (indegree.get(neighbor) == 0) {
                queue.offer(neighbor);
            }
        }
    }
    
    return result.length() == indegree.size() ? result.toString() : "";
}`,
    cpp: `string alienOrder(vector<string>& words) {
    // Build graph
    unordered_map<char, unordered_set<char>> graph;
    unordered_map<char, int> indegree;
    
    for (const string& word : words) {
        for (char c : word) {
            graph[c] = {};
            indegree[c] = 0;
        }
    }
    
    // Find ordering
    for (int i = 0; i < words.size() - 1; i++) {
        string w1 = words[i], w2 = words[i+1];
        int minLen = min(w1.length(), w2.length());
        
        if (w1.length() > w2.length() && w1.substr(0, minLen) == w2) {
            return "";
        }
        
        for (int j = 0; j < minLen; j++) {
            if (w1[j] != w2[j]) {
                if (graph[w1[j]].find(w2[j]) == graph[w1[j]].end()) {
                    graph[w1[j]].insert(w2[j]);
                    indegree[w2[j]]++;
                }
                break;
            }
        }
    }
    
    // Topological sort
    queue<char> q;
    for (auto& [c, deg] : indegree) {
        if (deg == 0) q.push(c);
    }
    
    string result;
    while (!q.empty()) {
        char c = q.front();
        q.pop();
        result += c;
        
        for (char neighbor : graph[c]) {
            if (--indegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }
    
    return result.length() == indegree.size() ? result : "";
}`,
    typescript: `function alienOrder(words: string[]): string {
    // Build graph
    const graph = new Map<string, Set<string>>();
    const indegree = new Map<string, number>();
    
    for (const word of words) {
        for (const c of word) {
            if (!graph.has(c)) {
                graph.set(c, new Set());
                indegree.set(c, 0);
            }
        }
    }
    
    // Find ordering
    for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i], w2 = words[i+1];
        const minLen = Math.min(w1.length, w2.length);
        
        if (w1.length > w2.length && w1.startsWith(w2)) {
            return "";
        }
        
        for (let j = 0; j < minLen; j++) {
            if (w1[j] !== w2[j]) {
                if (!graph.get(w1[j])!.has(w2[j])) {
                    graph.get(w1[j])!.add(w2[j]);
                    indegree.set(w2[j], indegree.get(w2[j])! + 1);
                }
                break;
            }
        }
    }
    
    // Topological sort
    const queue: string[] = [];
    for (const [c, deg] of indegree) {
        if (deg === 0) queue.push(c);
    }
    
    let result = "";
    while (queue.length) {
        const c = queue.shift()!;
        result += c;
        
        for (const neighbor of graph.get(c)!) {
            indegree.set(neighbor, indegree.get(neighbor)! - 1);
            if (indegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    return result.length === indegree.size ? result : "";
}`,
    explanation: "Build directed graph from adjacent word pairs: first differing character creates edge (c1 -> c2 means c1 before c2). Use topological sort (Kahn's algorithm) with indegree tracking. Invalid if result length ≠ unique chars (cycle exists)."
  },
  "graph-valid-tree": {
    python: `def validTree(n: int, edges: List[List[int]]) -> bool:
    # Tree must have exactly n-1 edges
    if len(edges) != n - 1:
        return False
    
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    # Check if graph is connected using DFS
    visited = set()
    
    def dfs(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
    
    dfs(0)
    
    # Valid tree if all nodes are visited
    return len(visited) == n`,
    java: `public boolean validTree(int n, int[][] edges) {
    // Tree must have exactly n-1 edges
    if (edges.length != n - 1) {
        return false;
    }
    
    // Build adjacency list
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        graph.add(new ArrayList<>());
    }
    for (int[] edge : edges) {
        graph.get(edge[0]).add(edge[1]);
        graph.get(edge[1]).add(edge[0]);
    }
    
    // Check if graph is connected using DFS
    Set<Integer> visited = new HashSet<>();
    dfs(0, graph, visited);
    
    // Valid tree if all nodes are visited
    return visited.size() == n;
}

private void dfs(int node, List<List<Integer>> graph, Set<Integer> visited) {
    visited.add(node);
    for (int neighbor : graph.get(node)) {
        if (!visited.contains(neighbor)) {
            dfs(neighbor, graph, visited);
        }
    }
}`,
    cpp: `bool validTree(int n, vector<vector<int>>& edges) {
    // Tree must have exactly n-1 edges
    if (edges.size() != n - 1) {
        return false;
    }
    
    // Build adjacency list
    vector<vector<int>> graph(n);
    for (auto& edge : edges) {
        graph[edge[0]].push_back(edge[1]);
        graph[edge[1]].push_back(edge[0]);
    }
    
    // Check if graph is connected using DFS
    unordered_set<int> visited;
    
    function<void(int)> dfs = [&](int node) {
        visited.insert(node);
        for (int neighbor : graph[node]) {
            if (visited.find(neighbor) == visited.end()) {
                dfs(neighbor);
            }
        }
    };
    
    dfs(0);
    
    // Valid tree if all nodes are visited
    return visited.size() == n;
}`,
    typescript: `function validTree(n: number, edges: number[][]): boolean {
    // Tree must have exactly n-1 edges
    if (edges.length !== n - 1) {
        return false;
    }
    
    // Build adjacency list
    const graph: number[][] = Array(n).fill(0).map(() => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    // Check if graph is connected using DFS
    const visited = new Set<number>();
    
    function dfs(node: number) {
        visited.add(node);
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
            }
        }
    }
    
    dfs(0);
    
    // Valid tree if all nodes are visited
    return visited.size === n;
}`,
    explanation: "A valid tree with n nodes must have exactly n-1 edges (no cycles) and be fully connected. Check: (1) edges.length === n-1, (2) all nodes reachable from any starting node via DFS/BFS. Union-Find alternative checks for cycles during edge addition."
  },
  "number-of-connected-components-in-an-undirected-graph": {
    python: `def countComponents(n: int, edges: List[List[int]]) -> int:
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = set()
    count = 0
    
    def dfs(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
    
    # Count components by DFS
    for i in range(n):
        if i not in visited:
            dfs(i)
            count += 1
    
    return count`,
    java: `public int countComponents(int n, int[][] edges) {
    // Build adjacency list
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        graph.add(new ArrayList<>());
    }
    for (int[] edge : edges) {
        graph.get(edge[0]).add(edge[1]);
        graph.get(edge[1]).add(edge[0]);
    }
    
    boolean[] visited = new boolean[n];
    int count = 0;
    
    // Count components by DFS
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i, graph, visited);
            count++;
        }
    }
    
    return count;
}

private void dfs(int node, List<List<Integer>> graph, boolean[] visited) {
    visited[node] = true;
    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
            dfs(neighbor, graph, visited);
        }
    }
}`,
    cpp: `int countComponents(int n, vector<vector<int>>& edges) {
    // Build adjacency list
    vector<vector<int>> graph(n);
    for (auto& edge : edges) {
        graph[edge[0]].push_back(edge[1]);
        graph[edge[1]].push_back(edge[0]);
    }
    
    vector<bool> visited(n, false);
    int count = 0;
    
    function<void(int)> dfs = [&](int node) {
        visited[node] = true;
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor);
            }
        }
    };
    
    // Count components by DFS
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i);
            count++;
        }
    }
    
    return count;
}`,
    typescript: `function countComponents(n: number, edges: number[][]): number {
    // Build adjacency list
    const graph: number[][] = Array(n).fill(0).map(() => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const visited = new Set<number>();
    let count = 0;
    
    function dfs(node: number) {
        visited.add(node);
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
            }
        }
    }
    
    // Count components by DFS
    for (let i = 0; i < n; i++) {
        if (!visited.has(i)) {
            dfs(i);
            count++;
        }
    }
    
    return count;
}`,
    explanation: "Build adjacency list from edges. For each unvisited node, start DFS to mark entire component as visited, increment count. Union-Find is more efficient for dynamic graphs with frequent connectivity queries."
  },
  "insert-interval": {
    python: `def insert(intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
    result = []
    i = 0
    n = len(intervals)
    
    # Add all intervals before newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Merge overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Add remaining intervals
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result`,
    java: `public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> result = new ArrayList<>();
    int i = 0, n = intervals.length;
    
    // Add all intervals before newInterval
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.add(intervals[i]);
        i++;
    }
    
    // Merge overlapping intervals
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.add(newInterval);
    
    // Add remaining intervals
    while (i < n) {
        result.add(intervals[i]);
        i++;
    }
    
    return result.toArray(new int[result.size()][]);
}`,
    cpp: `vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    vector<vector<int>> result;
    int i = 0, n = intervals.size();
    
    // Add all intervals before newInterval
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.push_back(intervals[i]);
        i++;
    }
    
    // Merge overlapping intervals
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = min(newInterval[0], intervals[i][0]);
        newInterval[1] = max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push_back(newInterval);
    
    // Add remaining intervals
    while (i < n) {
        result.push_back(intervals[i]);
        i++;
    }
    
    return result;
}`,
    typescript: `function insert(intervals: number[][], newInterval: number[]): number[][] {
    const result: number[][] = [];
    let i = 0;
    const n = intervals.length;
    
    // Add all intervals before newInterval
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
    }
    
    // Merge overlapping intervals
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push(newInterval);
    
    // Add remaining intervals
    while (i < n) {
        result.push(intervals[i]);
        i++;
    }
    
    return result;
}`,
    explanation: "Three-phase approach: (1) Add all intervals ending before newInterval starts, (2) Merge all overlapping intervals by expanding newInterval's bounds, (3) Add remaining intervals. Linear scan in O(n) time since intervals are pre-sorted."
  },
  "non-overlapping-intervals": {
    python: `def eraseOverlapIntervals(intervals: List[List[int]]) -> int:
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 0
    end = float('-inf')
    
    for start, curr_end in intervals:
        if start >= end:
            # No overlap, keep this interval
            end = curr_end
        else:
            # Overlap detected, remove one interval
            count += 1
    
    return count`,
    java: `public int eraseOverlapIntervals(int[][] intervals) {
    // Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    
    int count = 0;
    int end = Integer.MIN_VALUE;
    
    for (int[] interval : intervals) {
        if (interval[0] >= end) {
            // No overlap, keep this interval
            end = interval[1];
        } else {
            // Overlap detected, remove one interval
            count++;
        }
    }
    
    return count;
}`,
    cpp: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    // Sort by end time
    sort(intervals.begin(), intervals.end(), 
         [](const vector<int>& a, const vector<int>& b) {
             return a[1] < b[1];
         });
    
    int count = 0;
    int end = INT_MIN;
    
    for (const auto& interval : intervals) {
        if (interval[0] >= end) {
            // No overlap, keep this interval
            end = interval[1];
        } else {
            // Overlap detected, remove one interval
            count++;
        }
    }
    
    return count;
}`,
    typescript: `function eraseOverlapIntervals(intervals: number[][]): number {
    // Sort by end time
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 0;
    let end = -Infinity;
    
    for (const [start, currEnd] of intervals) {
        if (start >= end) {
            // No overlap, keep this interval
            end = currEnd;
        } else {
            // Overlap detected, remove one interval
            count++;
        }
    }
    
    return count;
}`,
    explanation: "Greedy approach: sort by end time and keep intervals that don't overlap. By always keeping the interval with earliest end time, we maximize room for future intervals. Count overlaps as removals."
  },
  "meeting-rooms": {
    python: `def canAttendMeetings(intervals: List[List[int]]) -> bool:
    # Sort intervals by start time
    intervals.sort(key=lambda x: x[0])
    
    # Check for overlaps
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False
    
    return True`,
    java: `public boolean canAttendMeetings(int[][] intervals) {
    // Sort intervals by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    
    // Check for overlaps
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i-1][1]) {
            return false;
        }
    }
    
    return true;
}`,
    cpp: `bool canAttendMeetings(vector<vector<int>>& intervals) {
    // Sort intervals by start time
    sort(intervals.begin(), intervals.end());
    
    // Check for overlaps
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] < intervals[i-1][1]) {
            return false;
        }
    }
    
    return true;
}`,
    typescript: `function canAttendMeetings(intervals: number[][]): boolean {
    // Sort intervals by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Check for overlaps
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i-1][1]) {
            return false;
        }
    }
    
    return true;
}`,
    explanation: "Sort meetings by start time. If any meeting starts before the previous one ends, there's an overlap and we can't attend all meetings. Simple O(n log n) solution."
  },
  "meeting-rooms-ii": {
    python: `def minMeetingRooms(intervals: List[List[int]]) -> int:
    if not intervals:
        return 0
    
    # Separate start and end times
    start_times = sorted([i[0] for i in intervals])
    end_times = sorted([i[1] for i in intervals])
    
    rooms = 0
    max_rooms = 0
    s = e = 0
    
    # Two-pointer approach
    while s < len(intervals):
        if start_times[s] < end_times[e]:
            # Meeting starts, need a room
            rooms += 1
            max_rooms = max(max_rooms, rooms)
            s += 1
        else:
            # Meeting ends, free a room
            rooms -= 1
            e += 1
    
    return max_rooms`,
    java: `public int minMeetingRooms(int[][] intervals) {
    if (intervals.length == 0) return 0;
    
    int n = intervals.length;
    int[] start = new int[n];
    int[] end = new int[n];
    
    for (int i = 0; i < n; i++) {
        start[i] = intervals[i][0];
        end[i] = intervals[i][1];
    }
    
    Arrays.sort(start);
    Arrays.sort(end);
    
    int rooms = 0, maxRooms = 0;
    int s = 0, e = 0;
    
    while (s < n) {
        if (start[s] < end[e]) {
            rooms++;
            maxRooms = Math.max(maxRooms, rooms);
            s++;
        } else {
            rooms--;
            e++;
        }
    }
    
    return maxRooms;
}`,
    cpp: `int minMeetingRooms(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    
    vector<int> start, end;
    for (const auto& interval : intervals) {
        start.push_back(interval[0]);
        end.push_back(interval[1]);
    }
    
    sort(start.begin(), start.end());
    sort(end.begin(), end.end());
    
    int rooms = 0, maxRooms = 0;
    int s = 0, e = 0;
    
    while (s < intervals.size()) {
        if (start[s] < end[e]) {
            rooms++;
            maxRooms = max(maxRooms, rooms);
            s++;
        } else {
            rooms--;
            e++;
        }
    }
    
    return maxRooms;
}`,
    typescript: `function minMeetingRooms(intervals: number[][]): number {
    if (intervals.length === 0) return 0;
    
    const start = intervals.map(i => i[0]).sort((a, b) => a - b);
    const end = intervals.map(i => i[1]).sort((a, b) => a - b);
    
    let rooms = 0, maxRooms = 0;
    let s = 0, e = 0;
    
    while (s < intervals.length) {
        if (start[s] < end[e]) {
            rooms++;
            maxRooms = Math.max(maxRooms, rooms);
            s++;
        } else {
            rooms--;
            e++;
        }
    }
    
    return maxRooms;
}`,
    explanation: "Two-pointer sweep line algorithm: separate and sort start/end times. When a meeting starts before another ends, we need an additional room. Track maximum concurrent meetings needed."
  }
};
