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
  "sum-of-two-integers": {
    python: `def getSum(a: int, b: int) -> int:
    # Mask to handle 32-bit integers
    mask = 0xFFFFFFFF
    
    while b != 0:
        # Calculate sum without carry
        sum_without_carry = (a ^ b) & mask
        # Calculate carry
        carry = ((a & b) << 1) & mask
        
        a = sum_without_carry
        b = carry
    
    # Handle negative numbers in Python
    if a > 0x7FFFFFFF:
        a = ~(a ^ mask)
    
    return a`,
    java: `public int getSum(int a, int b) {
    while (b != 0) {
        // Calculate sum without carry (XOR)
        int sumWithoutCarry = a ^ b;
        
        // Calculate carry (AND, then shift left)
        int carry = (a & b) << 1;
        
        // Update a and b
        a = sumWithoutCarry;
        b = carry;
    }
    
    return a;
}`,
    cpp: `int getSum(int a, int b) {
    while (b != 0) {
        // Calculate sum without carry (XOR)
        unsigned int sumWithoutCarry = a ^ b;
        
        // Calculate carry (AND, then shift left)
        unsigned int carry = (a & b) << 1;
        
        // Update a and b
        a = sumWithoutCarry;
        b = carry;
    }
    
    return a;
}`,
    typescript: `function getSum(a: number, b: number): number {
    while (b !== 0) {
        // Calculate sum without carry (XOR)
        const sumWithoutCarry = a ^ b;
        
        // Calculate carry (AND, then shift left)
        const carry = (a & b) << 1;
        
        // Update a and b
        a = sumWithoutCarry;
        b = carry;
    }
    
    return a;
}`,
    explanation: "Use bitwise operations: XOR (^) gives sum without carry, AND (&) followed by left shift gives carry. Iterate until carry becomes 0. This simulates binary addition without using + or - operators."
  },
  "number-of-1-bits": {
    python: `def hammingWeight(n: int) -> int:
    count = 0
    
    while n:
        # Check if last bit is 1
        count += n & 1
        # Right shift to check next bit
        n = n >> 1
    
    return count

# Alternative using built-in
# return bin(n).count('1')`,
    java: `public int hammingWeight(int n) {
    int count = 0;
    
    while (n != 0) {
        // Check if last bit is 1
        count += n & 1;
        // Right shift to check next bit (unsigned shift)
        n = n >>> 1;
    }
    
    return count;
}`,
    cpp: `int hammingWeight(uint32_t n) {
    int count = 0;
    
    while (n != 0) {
        // Check if last bit is 1
        count += n & 1;
        // Right shift to check next bit
        n = n >> 1;
    }
    
    return count;
}`,
    typescript: `function hammingWeight(n: number): number {
    let count = 0;
    
    // Convert to unsigned 32-bit
    n = n >>> 0;
    
    while (n !== 0) {
        // Check if last bit is 1
        count += n & 1;
        // Right shift to check next bit (unsigned shift)
        n = n >>> 1;
    }
    
    return count;
}`,
    explanation: "Count set bits by checking each bit position. Use bitwise AND (&) with 1 to check if the last bit is set, then right shift to examine the next bit. Continue until all bits are processed."
  },
  "counting-bits": {
    python: `def countBits(n: int) -> List[int]:
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # i >> 1 is i // 2
        # i & 1 checks if i is odd
        dp[i] = dp[i >> 1] + (i & 1)
    
    return dp`,
    java: `public int[] countBits(int n) {
    int[] dp = new int[n + 1];
    
    for (int i = 1; i <= n; i++) {
        // i >> 1 is i / 2
        // i & 1 checks if i is odd
        dp[i] = dp[i >> 1] + (i & 1);
    }
    
    return dp;
}`,
    cpp: `vector<int> countBits(int n) {
    vector<int> dp(n + 1, 0);
    
    for (int i = 1; i <= n; i++) {
        // i >> 1 is i / 2
        // i & 1 checks if i is odd
        dp[i] = dp[i >> 1] + (i & 1);
    }
    
    return dp;
}`,
    typescript: `function countBits(n: number): number[] {
    const dp = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= n; i++) {
        // i >> 1 is i / 2
        // i & 1 checks if i is odd
        dp[i] = dp[i >> 1] + (i & 1);
    }
    
    return dp;
}`,
    explanation: "Dynamic programming approach: The number of 1s in i equals the number of 1s in i/2 plus whether i is odd. This relationship allows O(n) time computation without recalculating from scratch."
  },
  "missing-number": {
    python: `def missingNumber(nums: List[int]) -> int:
    # XOR approach
    missing = len(nums)
    
    for i, num in enumerate(nums):
        missing ^= i ^ num
    
    return missing

# Alternative: Sum approach
# expected_sum = len(nums) * (len(nums) + 1) // 2
# actual_sum = sum(nums)
# return expected_sum - actual_sum`,
    java: `public int missingNumber(int[] nums) {
    // XOR approach
    int missing = nums.length;
    
    for (int i = 0; i < nums.length; i++) {
        missing ^= i ^ nums[i];
    }
    
    return missing;
}`,
    cpp: `int missingNumber(vector<int>& nums) {
    // XOR approach
    int missing = nums.size();
    
    for (int i = 0; i < nums.size(); i++) {
        missing ^= i ^ nums[i];
    }
    
    return missing;
}`,
    typescript: `function missingNumber(nums: number[]): number {
    // XOR approach
    let missing = nums.length;
    
    for (let i = 0; i < nums.length; i++) {
        missing ^= i ^ nums[i];
    }
    
    return missing;
}`,
    explanation: "XOR approach: XOR all indices and numbers together. Since XOR is commutative and x XOR x = 0, the missing number will be the only one not canceled out. This achieves O(n) time and O(1) space."
  },
  "reverse-bits": {
    python: `def reverseBits(n: int) -> int:
    result = 0
    
    for i in range(32):
        # Extract the i-th bit
        bit = (n >> i) & 1
        # Place it at position (31 - i)
        result |= (bit << (31 - i))
    
    return result`,
    java: `public int reverseBits(int n) {
    int result = 0;
    
    for (int i = 0; i < 32; i++) {
        // Extract the i-th bit
        int bit = (n >> i) & 1;
        // Place it at position (31 - i)
        result |= (bit << (31 - i));
    }
    
    return result;
}`,
    cpp: `uint32_t reverseBits(uint32_t n) {
    uint32_t result = 0;
    
    for (int i = 0; i < 32; i++) {
        // Extract the i-th bit
        int bit = (n >> i) & 1;
        // Place it at position (31 - i)
        result |= (bit << (31 - i));
    }
    
    return result;
}`,
    typescript: `function reverseBits(n: number): number {
    let result = 0;
    
    // Convert to unsigned 32-bit
    n = n >>> 0;
    
    for (let i = 0; i < 32; i++) {
        // Extract the i-th bit
        const bit = (n >> i) & 1;
        // Place it at position (31 - i)
        result |= (bit << (31 - i));
    }
    
    // Convert result to signed 32-bit
    return result | 0;
}`,
    explanation: "Iterate through all 32 bits. For each bit at position i, extract it using (n >> i) & 1, then place it at the mirrored position (31 - i) using bit shift and OR. This reverses all bits."
  },
  "climbing-stairs": {
    python: `def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    
    # Space-optimized: only need last two values
    first, second = 1, 2
    
    for i in range(3, n + 1):
        third = first + second
        first = second
        second = third
    
    return second

# Alternative: DP array
# dp = [0] * (n + 1)
# dp[1], dp[2] = 1, 2
# for i in range(3, n + 1):
#     dp[i] = dp[i-1] + dp[i-2]
# return dp[n]`,
    java: `public int climbStairs(int n) {
    if (n <= 2) return n;
    
    // Space-optimized: only need last two values
    int first = 1, second = 2;
    
    for (int i = 3; i <= n; i++) {
        int third = first + second;
        first = second;
        second = third;
    }
    
    return second;
}`,
    cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    
    // Space-optimized: only need last two values
    int first = 1, second = 2;
    
    for (int i = 3; i <= n; i++) {
        int third = first + second;
        first = second;
        second = third;
    }
    
    return second;
}`,
    typescript: `function climbStairs(n: number): number {
    if (n <= 2) return n;
    
    // Space-optimized: only need last two values
    let first = 1, second = 2;
    
    for (let i = 3; i <= n; i++) {
        const third = first + second;
        first = second;
        second = third;
    }
    
    return second;
}`,
    explanation: "This is equivalent to Fibonacci numbers. Ways to reach step n = ways to reach step (n-1) + ways to reach step (n-2). Use space-optimized DP storing only last two values for O(1) space."
  },
  "coin-change": {
    python: `def coinChange(coins: List[int], amount: int) -> int:
    # dp[i] = minimum coins needed for amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1`,
    java: `public int coinChange(int[] coins, int amount) {
    // dp[i] = minimum coins needed for amount i
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // Initialize with a value > amount
    dp[0] = 0;
    
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    cpp: `int coinChange(vector<int>& coins, int amount) {
    // dp[i] = minimum coins needed for amount i
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] = min(dp[i], dp[i - coin] + 1);
        }
    }
    
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    typescript: `function coinChange(coins: number[], amount: number): number {
    // dp[i] = minimum coins needed for amount i
    const dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    explanation: "Unbounded knapsack DP: For each coin, update dp[i] (minimum coins for amount i) by considering using this coin. dp[i] = min(dp[i], dp[i-coin] + 1). Time: O(n × amount), Space: O(amount)."
  },
  "longest-increasing-subsequence": {
    python: `def lengthOfLIS(nums: List[int]) -> int:
    # Binary search approach - O(n log n)
    tails = []
    
    for num in nums:
        # Binary search for the smallest tail >= num
        left, right = 0, len(tails)
        
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid
        
        # If num is larger than all tails, extend
        if left == len(tails):
            tails.append(num)
        else:
            # Replace the tail at left position
            tails[left] = num
    
    return len(tails)`,
    java: `public int lengthOfLIS(int[] nums) {
    // Binary search approach - O(n log n)
    List<Integer> tails = new ArrayList<>();
    
    for (int num : nums) {
        // Binary search for the smallest tail >= num
        int left = 0, right = tails.size();
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (tails.get(mid) < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // If num is larger than all tails, extend
        if (left == tails.size()) {
            tails.add(num);
        } else {
            // Replace the tail at left position
            tails.set(left, num);
        }
    }
    
    return tails.size();
}`,
    cpp: `int lengthOfLIS(vector<int>& nums) {
    // Binary search approach - O(n log n)
    vector<int> tails;
    
    for (int num : nums) {
        // Binary search for the smallest tail >= num
        auto it = lower_bound(tails.begin(), tails.end(), num);
        
        if (it == tails.end()) {
            tails.push_back(num);
        } else {
            *it = num;
        }
    }
    
    return tails.size();
}`,
    typescript: `function lengthOfLIS(nums: number[]): number {
    // Binary search approach - O(n log n)
    const tails: number[] = [];
    
    for (const num of nums) {
        // Binary search for the smallest tail >= num
        let left = 0, right = tails.length;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // If num is larger than all tails, extend
        if (left === tails.length) {
            tails.push(num);
        } else {
            // Replace the tail at left position
            tails[left] = num;
        }
    }
    
    return tails.length;
}`,
    explanation: "Patience sorting / Binary search: Maintain tails array where tails[i] is the smallest tail of all increasing subsequences of length i+1. For each number, binary search to find where to place it. Time: O(n log n), Space: O(n)."
  },
  "longest-common-subsequence": {
    python: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    
    # dp[i][j] = LCS length of text1[0:i] and text2[0:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[m][n]`,
    java: `public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    
    // dp[i][j] = LCS length of text1[0:i] and text2[0:j]
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
}`,
    cpp: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.length(), n = text2.length();
    
    // dp[i][j] = LCS length of text1[0:i] and text2[0:j]
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
    typescript: `function longestCommonSubsequence(text1: string, text2: string): number {
    const m = text1.length, n = text2.length;
    
    // dp[i][j] = LCS length of text1[0:i] and text2[0:j]
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
    explanation: "2D DP: dp[i][j] represents LCS length of text1[0:i] and text2[0:j]. If characters match, extend LCS. Otherwise, take maximum of excluding one character from either string. Time: O(m × n), Space: O(m × n)."
  },
  "word-break-problem": {
    python: `def wordBreak(s: str, wordDict: List[str]) -> bool:
    word_set = set(wordDict)
    n = len(s)
    
    # dp[i] = True if s[0:i] can be segmented
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string can be segmented
    
    for i in range(1, n + 1):
        for j in range(i):
            # Check if s[j:i] is a word and s[0:j] is valid
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]`,
    java: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    int n = s.length();
    
    // dp[i] = true if s[0:i] can be segmented
    boolean[] dp = new boolean[n + 1];
    dp[0] = true; // Empty string can be segmented
    
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            // Check if s[j:i] is a word and s[0:j] is valid
            if (dp[j] && wordSet.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[n];
}`,
    cpp: `bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
    int n = s.length();
    
    // dp[i] = true if s[0:i] can be segmented
    vector<bool> dp(n + 1, false);
    dp[0] = true; // Empty string can be segmented
    
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            // Check if s[j:i] is a word and s[0:j] is valid
            if (dp[j] && wordSet.count(s.substr(j, i - j))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[n];
}`,
    typescript: `function wordBreak(s: string, wordDict: string[]): boolean {
    const wordSet = new Set(wordDict);
    const n = s.length;
    
    // dp[i] = true if s[0:i] can be segmented
    const dp: boolean[] = new Array(n + 1).fill(false);
    dp[0] = true; // Empty string can be segmented
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            // Check if s[j:i] is a word and s[0:j] is valid
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[n];
}`,
    explanation: "DP approach: dp[i] indicates whether s[0:i] can be segmented. For each position i, check all possible splits j where s[j:i] is a word and s[0:j] is valid. Time: O(n²), Space: O(n)."
  }
};
