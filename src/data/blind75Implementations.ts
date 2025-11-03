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
    "merge-intervals": {
        python: `def merge(intervals: List[List[int]]) -> List[List[int]]:
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    result = [intervals[0]]
    
    for start, end in intervals[1:]:
        last_end = result[-1][1]
        
        if start <= last_end:
            # Overlapping, merge
            result[-1][1] = max(last_end, end)
        else:
            # No overlap, add new interval
            result.append([start, end])
    
    return result`,
        java: `public int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return new int[0][];
    
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    
    List<int[]> result = new ArrayList<>();
    result.add(intervals[0]);
    
    for (int i = 1; i < intervals.length; i++) {
        int[] current = intervals[i];
        int[] last = result.get(result.size() - 1);
        
        if (current[0] <= last[1]) {
            // Overlapping, merge
            last[1] = Math.max(last[1], current[1]);
        } else {
            // No overlap, add new interval
            result.add(current);
        }
    }
    
    return result.toArray(new int[result.size()][]);
}`,
        cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    
    sort(intervals.begin(), intervals.end());
    
    vector<vector<int>> result;
    result.push_back(intervals[0]);
    
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= result.back()[1]) {
            // Overlapping, merge
            result.back()[1] = max(result.back()[1], intervals[i][1]);
        } else {
            // No overlap, add new interval
            result.push_back(intervals[i]);
        }
    }
    
    return result;
}`,
        typescript: `function merge(intervals: number[][]): number[][] {
    if (!intervals.length) return [];
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result: number[][] = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const [start, end] = intervals[i];
        const lastEnd = result[result.length - 1][1];
        
        if (start <= lastEnd) {
            // Overlapping, merge
            result[result.length - 1][1] = Math.max(lastEnd, end);
        } else {
            // No overlap, add new interval
            result.push([start, end]);
        }
    }
    
    return result;
}`,
        explanation: "Sort intervals by start time. Iterate through sorted intervals: if current overlaps with last result (start <= last end), merge them by updating end time. Otherwise add as new interval. O(n log n) for sorting."
    },
    "longest-substring-without-repeating-characters": {
        python: `def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}
    max_length = 0
    left = 0
    
    for right in range(len(s)):
        # If char seen and in current window
        if s[right] in char_index and char_index[s[right]] >= left:
            left = char_index[s[right]] + 1
        
        char_index[s[right]] = right
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
        java: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> charIndex = new HashMap<>();
    int maxLength = 0;
    int left = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        
        if (charIndex.containsKey(c) && charIndex.get(c) >= left) {
            left = charIndex.get(c) + 1;
        }
        
        charIndex.put(c, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
        cpp: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> charIndex;
    int maxLength = 0;
    int left = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s[right];
        
        if (charIndex.find(c) != charIndex.end() && charIndex[c] >= left) {
            left = charIndex[c] + 1;
        }
        
        charIndex[c] = right;
        maxLength = max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
        typescript: `function lengthOfLongestSubstring(s: string): number {
    const charIndex = new Map<string, number>();
    let maxLength = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        
        if (charIndex.has(c) && charIndex.get(c)! >= left) {
            left = charIndex.get(c)! + 1;
        }
        
        charIndex.set(c, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
        explanation: "Sliding window with hashmap. Track last seen index of each character. When duplicate found in current window, move left pointer past previous occurrence. Track maximum window size. O(n) time."
    },
    "valid-anagram": {
        python: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    
    count = {}
    
    for char in s:
        count[char] = count.get(char, 0) + 1
    
    for char in t:
        if char not in count:
            return False
        count[char] -= 1
        if count[char] < 0:
            return False
    
    return True`,
        java: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) {
        return false;
    }
    
    int[] count = new int[26];
    
    for (char c : s.toCharArray()) {
        count[c - 'a']++;
    }
    
    for (char c : t.toCharArray()) {
        count[c - 'a']--;
        if (count[c - 'a'] < 0) {
            return false;
        }
    }
    
    return true;
}`,
        cpp: `bool isAnagram(string s, string t) {
    if (s.length() != t.length()) {
        return false;
    }
    
    vector<int> count(26, 0);
    
    for (char c : s) {
        count[c - 'a']++;
    }
    
    for (char c : t) {
        count[c - 'a']--;
        if (count[c - 'a'] < 0) {
            return false;
        }
    }
    
    return true;
}`,
        typescript: `function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) {
        return false;
    }
    
    const count = new Array(26).fill(0);
    
    for (const c of s) {
        count[c.charCodeAt(0) - 'a'.charCodeAt(0)]++;
    }
    
    for (const c of t) {
        count[c.charCodeAt(0) - 'a'.charCodeAt(0)]--;
        if (count[c.charCodeAt(0) - 'a'.charCodeAt(0)] < 0) {
            return false;
        }
    }
    
    return true;
}`,
        explanation: "Count character frequencies. For lowercase English letters, use array of size 26. Increment for s, decrement for t. If any goes negative or lengths differ, not anagram. O(n) time, O(1) space."
    },
    "group-anagrams": {
        python: `def groupAnagrams(strs: List[str]) -> List[List[str]]:
    anagrams = {}
    
    for s in strs:
        # Sort string as key
        key = ''.join(sorted(s))
        
        if key not in anagrams:
            anagrams[key] = []
        anagrams[key].append(s)
    
    return list(anagrams.values())`,
        java: `public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> anagrams = new HashMap<>();
    
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        
        anagrams.putIfAbsent(key, new ArrayList<>());
        anagrams.get(key).add(s);
    }
    
    return new ArrayList<>(anagrams.values());
}`,
        cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> anagrams;
    
    for (const string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        anagrams[key].push_back(s);
    }
    
    vector<vector<string>> result;
    for (auto& [key, group] : anagrams) {
        result.push_back(group);
    }
    
    return result;
}`,
        typescript: `function groupAnagrams(strs: string[]): string[][] {
    const anagrams = new Map<string, string[]>();
    
    for (const s of strs) {
        const key = s.split('').sort().join('');
        
        if (!anagrams.has(key)) {
            anagrams.set(key, []);
        }
        anagrams.get(key)!.push(s);
    }
    
    return Array.from(anagrams.values());
}`,
        explanation: "Use sorted string as key in hashmap. All anagrams have same sorted form. Group strings with same key. O(n × k log k) where n = number of strings, k = max length. Alternative: use character count array as key for O(n × k)."
    },
    "valid-parentheses": {
        python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            # Closing bracket
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
        else:
            # Opening bracket
            stack.append(char)
    
    return len(stack) == 0`,
        java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put('}', '{');
    mapping.put(']', '[');
    
    for (char c : s.toCharArray()) {
        if (mapping.containsKey(c)) {
            if (stack.isEmpty() || stack.pop() != mapping.get(c)) {
                return false;
            }
        } else {
            stack.push(c);
        }
    }
    
    return stack.isEmpty();
}`,
        cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> mapping = {
        {')', '('}, {'}', '{'}, {']', '['}
    };
    
    for (char c : s) {
        if (mapping.find(c) != mapping.end()) {
            if (st.empty() || st.top() != mapping[c]) {
                return false;
            }
            st.pop();
        } else {
            st.push(c);
        }
    }
    
    return st.empty();
}`,
        typescript: `function isValid(s: string): boolean {
    const stack: string[] = [];
    const mapping: { [key: string]: string } = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (const char of s) {
        if (char in mapping) {
            if (!stack.length || stack.pop() !== mapping[char]) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}`,
        explanation: "Use stack. Push opening brackets. For closing brackets, check if stack top matches corresponding opening bracket. Pop if match, return false if not. At end, stack should be empty. O(n) time, O(n) space."
    },
    "set-matrix-zeroes": {
        python: `def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    prev = None
    current = head
    
    while current:
        # Save next node
        next_temp = current.next
        
        # Reverse the link
        current.next = prev
        
        # Move pointers forward
        prev = current
        current = next_temp
    
    return prev`,
        java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        ListNode nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}`,
        cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    
    while (current) {
        ListNode* nextTemp = current->next;
        current->next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}`,
        typescript: `function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let current = head;
    
    while (current) {
        const nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}`,
        explanation: "Use three pointers: prev (initially null), current (head), and next. Iterate through list: save next node, reverse current's pointer to prev, move prev and current forward. Return prev (new head)."
    },
    "detect-cycle-in-a-linked-list": {
        python: `def hasCycle(head: Optional[ListNode]) -> bool:
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False`,
        java: `public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) {
        return false;
    }
    
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow == fast) {
            return true;
        }
    }
    
    return false;
}`,
        cpp: `bool hasCycle(ListNode *head) {
    if (!head || !head->next) {
        return false;
    }
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            return true;
        }
    }
    
    return false;
}`,
        typescript: `function hasCycle(head: ListNode | null): boolean {
    if (!head || !head.next) {
        return false;
    }
    
    let slow: ListNode | null = head;
    let fast: ListNode | null = head;
    
    while (fast && fast.next) {
        slow = slow!.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            return true;
        }
    }
    
    return false;
}`,
        explanation: "Floyd's Cycle Detection (Tortoise and Hare): use two pointers, slow (moves 1 step) and fast (moves 2 steps). If they meet, there's a cycle. If fast reaches end, no cycle. O(n) time, O(1) space."
    },
    "merge-two-sorted-lists": {
        python: `def mergeTwoLists(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        if l1.val < l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    # Attach remaining nodes
    current.next = l1 if l1 else l2
    
    return dummy.next`,
        java: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode current = dummy;
    
    while (l1 != null && l2 != null) {
        if (l1.val < l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    current.next = (l1 != null) ? l1 : l2;
    
    return dummy.next;
}`,
        cpp: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode* dummy = new ListNode(0);
    ListNode* current = dummy;
    
    while (l1 && l2) {
        if (l1->val < l2->val) {
            current->next = l1;
            l1 = l1->next;
        } else {
            current->next = l2;
            l2 = l2->next;
        }
        current = current->next;
    }
    
    current->next = l1 ? l1 : l2;
    
    return dummy->next;
}`,
        typescript: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummy = new ListNode(0);
    let current = dummy;
    
    while (l1 && l2) {
        if (l1.val < l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    current.next = l1 || l2;
    
    return dummy.next;
}`,
        explanation: "Use dummy node to simplify edge cases. Compare values from both lists, attach smaller to result, advance that pointer. After loop, attach remaining list. Return dummy.next."
    },
    "merge-k-sorted-lists": {
        python: `import heapq

def mergeKLists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    # Min heap: (value, index, node)
    heap = []
    
    # Add first node from each list
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        # Add next node from same list
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next`,
        java: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);
    
    // Add first node from each list
    for (ListNode head : lists) {
        if (head != null) {
            heap.offer(head);
        }
    }
    
    ListNode dummy = new ListNode(0);
    ListNode current = dummy;
    
    while (!heap.isEmpty()) {
        ListNode node = heap.poll();
        current.next = node;
        current = current.next;
        
        if (node.next != null) {
            heap.offer(node.next);
        }
    }
    
    return dummy.next;
}`,
        cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> heap(cmp);
    
    // Add first node from each list
    for (ListNode* head : lists) {
        if (head) {
            heap.push(head);
        }
    }
    
    ListNode* dummy = new ListNode(0);
    ListNode* current = dummy;
    
    while (!heap.empty()) {
        ListNode* node = heap.top();
        heap.pop();
        current->next = node;
        current = current->next;
        
        if (node->next) {
            heap.push(node->next);
        }
    }
    
    return dummy->next;
}`,
        typescript: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    const heap: Array<ListNode> = [];
    
    // Min heap operations
    const parent = (i: number) => Math.floor((i - 1) / 2);
    const left = (i: number) => 2 * i + 1;
    const right = (i: number) => 2 * i + 2;
    
    const swap = (i: number, j: number) => {
        [heap[i], heap[j]] = [heap[j], heap[i]];
    };
    
    const heapifyUp = (i: number) => {
        while (i > 0 && heap[parent(i)].val > heap[i].val) {
            swap(i, parent(i));
            i = parent(i);
        }
    };
    
    const heapifyDown = (i: number) => {
        let minIndex = i;
        const l = left(i), r = right(i);
        
        if (l < heap.length && heap[l].val < heap[minIndex].val) minIndex = l;
        if (r < heap.length && heap[r].val < heap[minIndex].val) minIndex = r;
        
        if (i !== minIndex) {
            swap(i, minIndex);
            heapifyDown(minIndex);
        }
    };
    
    const push = (node: ListNode) => {
        heap.push(node);
        heapifyUp(heap.length - 1);
    };
    
    const pop = (): ListNode => {
        const min = heap[0];
        heap[0] = heap[heap.length - 1];
        heap.pop();
        if (heap.length > 0) heapifyDown(0);
        return min;
    };
    
    // Add first node from each list
    for (const head of lists) {
        if (head) push(head);
    }
    
    const dummy = new ListNode(0);
    let current = dummy;
    
    while (heap.length > 0) {
        const node = pop();
        current.next = node;
        current = current.next;
        
        if (node.next) push(node.next);
    }
    
    return dummy.next;
}`,
        explanation: "Use min-heap to efficiently find smallest among k lists. Add first node from each list to heap. Pop minimum, add to result, push its next node to heap. Repeat until heap empty. O(N log k) time where N = total nodes."
    },
    "remove-nth-node-from-end-of-list": {
        python: `def removeNthFromEnd(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    dummy = ListNode(0)
    dummy.next = head
    fast = slow = dummy
    
    # Move fast n+1 steps ahead
    for _ in range(n + 1):
        if fast:
            fast = fast.next
    
    # Move both until fast reaches end
    while fast:
        fast = fast.next
        slow = slow.next
    
    # Remove nth node
    slow.next = slow.next.next
    
    return dummy.next`,
        java: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode fast = dummy;
    ListNode slow = dummy;
    
    // Move fast n+1 steps ahead
    for (int i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    // Move both until fast reaches end
    while (fast != null) {
        fast = fast.next;
        slow = slow.next;
    }
    
    // Remove nth node
    slow.next = slow.next.next;
    
    return dummy.next;
}`,
        cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode* dummy = new ListNode(0);
    dummy->next = head;
    ListNode* fast = dummy;
    ListNode* slow = dummy;
    
    // Move fast n+1 steps ahead
    for (int i = 0; i <= n; i++) {
        fast = fast->next;
    }
    
    // Move both until fast reaches end
    while (fast) {
        fast = fast->next;
        slow = slow->next;
    }
    
    // Remove nth node
    slow->next = slow->next->next;
    
    return dummy->next;
}`,
        typescript: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    const dummy = new ListNode(0);
    dummy.next = head;
    let fast: ListNode | null = dummy;
    let slow: ListNode | null = dummy;
    
    // Move fast n+1 steps ahead
    for (let i = 0; i <= n; i++) {
        if (fast) fast = fast.next;
    }
    
    // Move both until fast reaches end
    while (fast) {
        fast = fast.next;
        slow = slow!.next;
    }
    
    // Remove nth node
    slow!.next = slow!.next!.next;
    
    return dummy.next;
}`,
        explanation: "Two-pointer technique: use dummy node. Move fast pointer n+1 steps ahead, then move both pointers together. When fast reaches end, slow is before node to remove. One pass, O(1) space."
    },
    "reorder-list": {
        python: `def reorderList(head: Optional[ListNode]) -> None:
    if not head or not head.next:
        return
    
    # Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    second = slow.next
    slow.next = None
    prev = None
    while second:
        temp = second.next
        second.next = prev
        prev = second
        second = temp
    
    # Merge two halves
    first = head
    second = prev
    while second:
        tmp1 = first.next
        tmp2 = second.next
        first.next = second
        second.next = tmp1
        first = tmp1
        second = tmp2`,
        java: `public void reorderList(ListNode head) {
    if (head == null || head.next == null) return;
    
    // Find middle
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Reverse second half
    ListNode second = slow.next;
    slow.next = null;
    ListNode prev = null;
    while (second != null) {
        ListNode temp = second.next;
        second.next = prev;
        prev = second;
        second = temp;
    }
    
    // Merge two halves
    ListNode first = head;
    second = prev;
    while (second != null) {
        ListNode tmp1 = first.next;
        ListNode tmp2 = second.next;
        first.next = second;
        second.next = tmp1;
        first = tmp1;
        second = tmp2;
    }
}`,
        cpp: `void reorderList(ListNode* head) {
    if (!head || !head->next) return;
    
    // Find middle
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    // Reverse second half
    ListNode* second = slow->next;
    slow->next = nullptr;
    ListNode* prev = nullptr;
    while (second) {
        ListNode* temp = second->next;
        second->next = prev;
        prev = second;
        second = temp;
    }
    
    // Merge two halves
    ListNode* first = head;
    second = prev;
    while (second) {
        ListNode* tmp1 = first->next;
        ListNode* tmp2 = second->next;
        first->next = second;
        second->next = tmp1;
        first = tmp1;
        second = tmp2;
    }
}`,
        typescript: `function reorderList(head: ListNode | null): void {
    if (!head || !head.next) return;
    
    // Find middle
    let slow = head, fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next!;
        fast = fast.next.next;
    }
    
    // Reverse second half
    let second: ListNode | null = slow.next;
    slow.next = null;
    let prev: ListNode | null = null;
    while (second) {
        const temp = second.next;
        second.next = prev;
        prev = second;
        second = temp;
    }
    
    // Merge two halves
    let first: ListNode | null = head;
    second = prev;
    while (second) {
        const tmp1 = first!.next;
        const tmp2 = second.next;
        first!.next = second;
        second.next = tmp1;
        first = tmp1;
        second = tmp2;
    }
}`,
        explanation: "Three steps: 1) Find middle using slow/fast pointers. 2) Reverse second half. 3) Merge alternately. L0→L1→...→Ln becomes L0→Ln→L1→Ln-1→.... O(n) time, O(1) space."
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
    },
    "same-tree": {
        python: `def isSameTree(p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
    # Both empty
    if not p and not q:
        return True
    
    # One empty, one not
    if not p or not q:
        return False
    
    # Values different
    if p.val != q.val:
        return False
    
    # Recursively check left and right subtrees
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)`,
        java: `public boolean isSameTree(TreeNode p, TreeNode q) {
    // Both empty
    if (p == null && q == null) {
        return true;
    }
    
    // One empty, one not
    if (p == null || q == null) {
        return false;
    }
    
    // Values different
    if (p.val != q.val) {
        return false;
    }
    
    // Recursively check left and right subtrees
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
        cpp: `bool isSameTree(TreeNode* p, TreeNode* q) {
    // Both empty
    if (!p && !q) {
        return true;
    }
    
    // One empty, one not
    if (!p || !q) {
        return false;
    }
    
    // Values different
    if (p->val != q->val) {
        return false;
    }
    
    // Recursively check left and right subtrees
    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
}`,
        typescript: `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    // Both empty
    if (!p && !q) {
        return true;
    }
    
    // One empty, one not
    if (!p || !q) {
        return false;
    }
    
    // Values different
    if (p.val !== q.val) {
        return false;
    }
    
    // Recursively check left and right subtrees
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
        explanation: "Use DFS recursion to compare trees node by node. Check: both null (same), one null (different), values different (different), then recurse on left and right subtrees."
    },
    "invert-binary-tree": {
        python: `def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:
    if not root:
        return None
    
    # Swap left and right children
    root.left, root.right = root.right, root.left
    
    # Recursively invert subtrees
    invertTree(root.left)
    invertTree(root.right)
    
    return root`,
        java: `public TreeNode invertTree(TreeNode root) {
    if (root == null) {
        return null;
    }
    
    // Swap left and right children
    TreeNode temp = root.left;
    root.left = root.right;
    root.right = temp;
    
    // Recursively invert subtrees
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
}`,
        cpp: `TreeNode* invertTree(TreeNode* root) {
    if (!root) {
        return nullptr;
    }
    
    // Swap left and right children
    TreeNode* temp = root->left;
    root->left = root->right;
    root->right = temp;
    
    // Recursively invert subtrees
    invertTree(root->left);
    invertTree(root->right);
    
    return root;
}`,
        typescript: `function invertTree(root: TreeNode | null): TreeNode | null {
    if (!root) {
        return null;
    }
    
    // Swap left and right children
    [root.left, root.right] = [root.right, root.left];
    
    // Recursively invert subtrees
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
}`,
        explanation: "For each node, swap its left and right children, then recursively invert the left and right subtrees. Simple DFS approach."
    },
    "binary-tree-maximum-path-sum": {
        python: `def maxPathSum(root: Optional[TreeNode]) -> int:
    max_sum = float('-inf')
    
    def dfs(node):
        nonlocal max_sum
        
        if not node:
            return 0
        
        # Get max sum from left and right (ignore negative paths)
        left = max(0, dfs(node.left))
        right = max(0, dfs(node.right))
        
        # Update global max considering path through this node
        max_sum = max(max_sum, node.val + left + right)
        
        # Return max path sum including this node to parent
        return node.val + max(left, right)
    
    dfs(root)
    return max_sum`,
        java: `private int maxSum = Integer.MIN_VALUE;

public int maxPathSum(TreeNode root) {
    dfs(root);
    return maxSum;
}

private int dfs(TreeNode node) {
    if (node == null) {
        return 0;
    }
    
    // Get max sum from left and right (ignore negative paths)
    int left = Math.max(0, dfs(node.left));
    int right = Math.max(0, dfs(node.right));
    
    // Update global max considering path through this node
    maxSum = Math.max(maxSum, node.val + left + right);
    
    // Return max path sum including this node to parent
    return node.val + Math.max(left, right);
}`,
        cpp: `int maxSum = INT_MIN;

int maxPathSum(TreeNode* root) {
    dfs(root);
    return maxSum;
}

int dfs(TreeNode* node) {
    if (!node) {
        return 0;
    }
    
    // Get max sum from left and right (ignore negative paths)
    int left = max(0, dfs(node->left));
    int right = max(0, dfs(node->right));
    
    // Update global max considering path through this node
    maxSum = max(maxSum, node->val + left + right);
    
    // Return max path sum including this node to parent
    return node->val + max(left, right);
}`,
        typescript: `function maxPathSum(root: TreeNode | null): number {
    let maxSum = -Infinity;
    
    function dfs(node: TreeNode | null): number {
        if (!node) {
            return 0;
        }
        
        // Get max sum from left and right (ignore negative paths)
        const left = Math.max(0, dfs(node.left));
        const right = Math.max(0, dfs(node.right));
        
        // Update global max considering path through this node
        maxSum = Math.max(maxSum, node.val + left + right);
        
        // Return max path sum including this node to parent
        return node.val + Math.max(left, right);
    }
    
    dfs(root);
    return maxSum;
}`,
        explanation: "For each node, calculate max path sum through it (left + node + right). Track global maximum. Return to parent the max single-path sum (node + max of left or right). Ignore negative contributions."
    },
    "binary-tree-level-order-traversal": {
        python: `def levelOrder(root: Optional[TreeNode]) -> List[List[int]]:
    if not root:
        return []
    
    result = []
    queue = [root]
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.pop(0)
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result`,
        java: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    
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
}`,
        cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    
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
        explanation: "Use BFS with a queue. Process level by level: store current level size, pop that many nodes, collect values, add children to queue. Each iteration processes one complete level."
    },
    "serialize-and-deserialize-binary-tree": {
        python: `class Codec:
    def serialize(self, root):
        if not root:
            return "null"
        
        # Preorder traversal with null markers
        return str(root.val) + "," + self.serialize(root.left) + "," + self.serialize(root.right)
    
    def deserialize(self, data):
        def dfs(vals):
            val = next(vals)
            if val == "null":
                return None
            
            node = TreeNode(int(val))
            node.left = dfs(vals)
            node.right = dfs(vals)
            return node
        
        return dfs(iter(data.split(",")))`,
        java: `public class Codec {
    public String serialize(TreeNode root) {
        if (root == null) return "null";
        
        return root.val + "," + serialize(root.left) + "," + serialize(root.right);
    }
    
    public TreeNode deserialize(String data) {
        Queue<String> queue = new LinkedList<>(Arrays.asList(data.split(",")));
        return dfs(queue);
    }
    
    private TreeNode dfs(Queue<String> queue) {
        String val = queue.poll();
        if (val.equals("null")) return null;
        
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = dfs(queue);
        node.right = dfs(queue);
        return node;
    }
}`,
        cpp: `class Codec {
public:
    string serialize(TreeNode* root) {
        if (!root) return "null";
        
        return to_string(root->val) + "," + serialize(root->left) + "," + serialize(root->right);
    }
    
    TreeNode* deserialize(string data) {
        queue<string> q;
        stringstream ss(data);
        string val;
        while (getline(ss, val, ',')) {
            q.push(val);
        }
        return dfs(q);
    }
    
    TreeNode* dfs(queue<string>& q) {
        string val = q.front();
        q.pop();
        if (val == "null") return nullptr;
        
        TreeNode* node = new TreeNode(stoi(val));
        node->left = dfs(q);
        node->right = dfs(q);
        return node;
    }
};`,
        typescript: `class Codec {
    serialize(root: TreeNode | null): string {
        if (!root) return "null";
        
        return root.val + "," + this.serialize(root.left) + "," + this.serialize(root.right);
    }
    
    deserialize(data: string): TreeNode | null {
        const vals = data.split(",");
        let index = 0;
        
        const dfs = (): TreeNode | null => {
            const val = vals[index++];
            if (val === "null") return null;
            
            const node = new TreeNode(parseInt(val));
            node.left = dfs();
            node.right = dfs();
            return node;
        };
        
        return dfs();
    }
}`,
        explanation: "Serialize: use preorder traversal (root, left, right) with 'null' markers for empty nodes. Deserialize: reconstruct using the same preorder sequence by consuming values from queue/iterator."
    },
    "subtree-of-another-tree": {
        python: `def isSubtree(root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
    def isSame(p, q):
        if not p and not q:
            return True
        if not p or not q:
            return False
        return p.val == q.val and isSame(p.left, q.left) and isSame(p.right, q.right)
    
    if not root:
        return False
    
    # Check if trees are same starting from current root
    if isSame(root, subRoot):
        return True
    
    # Check left and right subtrees
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)`,
        java: `public boolean isSubtree(TreeNode root, TreeNode subRoot) {
    if (root == null) return false;
    
    if (isSame(root, subRoot)) return true;
    
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

private boolean isSame(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null) return false;
    
    return p.val == q.val && isSame(p.left, q.left) && isSame(p.right, q.right);
}`,
        cpp: `bool isSame(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q) return false;
    
    return p->val == q->val && isSame(p->left, q->left) && isSame(p->right, q->right);
}

bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    if (!root) return false;
    
    if (isSame(root, subRoot)) return true;
    
    return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
}`,
        typescript: `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
    function isSame(p: TreeNode | null, q: TreeNode | null): boolean {
        if (!p && !q) return true;
        if (!p || !q) return false;
        
        return p.val === q.val && isSame(p.left, q.left) && isSame(p.right, q.right);
    }
    
    if (!root) return false;
    
    if (isSame(root, subRoot)) return true;
    
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}`,
        explanation: "For each node in root, check if the tree starting at that node is identical to subRoot using a helper function. Use DFS to traverse all nodes in root tree."
    },
    "construct-binary-tree-from-preorder-and-inorder-traversal": {
        python: `def buildTree(preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
    if not preorder or not inorder:
        return None
    
    # First element in preorder is root
    root = TreeNode(preorder[0])
    
    # Find root in inorder to split left/right
    mid = inorder.index(preorder[0])
    
    # Recursively build left and right subtrees
    root.left = buildTree(preorder[1:mid+1], inorder[:mid])
    root.right = buildTree(preorder[mid+1:], inorder[mid+1:])
    
    return root`,
        java: `private int preIndex = 0;
private Map<Integer, Integer> inorderMap = new HashMap<>();

public TreeNode buildTree(int[] preorder, int[] inorder) {
    for (int i = 0; i < inorder.length; i++) {
        inorderMap.put(inorder[i], i);
    }
    return build(preorder, 0, inorder.length - 1);
}

private TreeNode build(int[] preorder, int left, int right) {
    if (left > right) return null;
    
    int rootVal = preorder[preIndex++];
    TreeNode root = new TreeNode(rootVal);
    
    int mid = inorderMap.get(rootVal);
    
    root.left = build(preorder, left, mid - 1);
    root.right = build(preorder, mid + 1, right);
    
    return root;
}`,
        cpp: `TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    unordered_map<int, int> inMap;
    for (int i = 0; i < inorder.size(); i++) {
        inMap[inorder[i]] = i;
    }
    
    int preIndex = 0;
    function<TreeNode*(int, int)> build = [&](int left, int right) -> TreeNode* {
        if (left > right) return nullptr;
        
        int rootVal = preorder[preIndex++];
        TreeNode* root = new TreeNode(rootVal);
        
        int mid = inMap[rootVal];
        
        root->left = build(left, mid - 1);
        root->right = build(mid + 1, right);
        
        return root;
    };
    
    return build(0, inorder.size() - 1);
}`,
        typescript: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    const inMap = new Map<number, number>();
    inorder.forEach((val, i) => inMap.set(val, i));
    
    let preIndex = 0;
    
    function build(left: number, right: number): TreeNode | null {
        if (left > right) return null;
        
        const rootVal = preorder[preIndex++];
        const root = new TreeNode(rootVal);
        
        const mid = inMap.get(rootVal)!;
        
        root.left = build(left, mid - 1);
        root.right = build(mid + 1, right);
        
        return root;
    }
    
    return build(0, inorder.length - 1);
}`,
        explanation: "Use preorder to get root (first element), find root in inorder to determine left/right boundaries. Recursively build left subtree with elements before root in inorder, right subtree with elements after. Use hashmap for O(1) lookups."
    },
    "validate-binary-search-tree": {
        python: `def isValidBST(root: Optional[TreeNode]) -> bool:
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        # Check if current node violates BST property
        if node.val <= min_val or node.val >= max_val:
            return False
        
        # Validate left subtree (all values < node.val)
        # and right subtree (all values > node.val)
        return (validate(node.left, min_val, node.val) and 
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))`,
        java: `public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean validate(TreeNode node, long min, long max) {
    if (node == null) return true;
    
    if (node.val <= min || node.val >= max) {
        return false;
    }
    
    return validate(node.left, min, node.val) && 
           validate(node.right, node.val, max);
}`,
        cpp: `bool validate(TreeNode* node, long min, long max) {
    if (!node) return true;
    
    if (node->val <= min || node->val >= max) {
        return false;
    }
    
    return validate(node->left, min, node->val) && 
           validate(node->right, node->val, max);
}

bool isValidBST(TreeNode* root) {
    return validate(root, LONG_MIN, LONG_MAX);
}`,
        typescript: `function isValidBST(root: TreeNode | null): boolean {
    function validate(node: TreeNode | null, min: number, max: number): boolean {
        if (!node) return true;
        
        if (node.val <= min || node.val >= max) {
            return false;
        }
        
        return validate(node.left, min, node.val) && 
               validate(node.right, node.val, max);
    }
    
    return validate(root, -Infinity, Infinity);
}`,
        explanation: "Use DFS with valid range constraints. For each node, check if value is within (min, max). Pass updated ranges to children: left gets (min, node.val), right gets (node.val, max)."
    },
    "kth-smallest-element-in-a-bst": {
        python: `def kthSmallest(root: Optional[TreeNode], k: int) -> int:
    # Inorder traversal of BST gives sorted order
    stack = []
    curr = root
    
    while True:
        # Go left as far as possible
        while curr:
            stack.append(curr)
            curr = curr.left
        
        # Process node
        curr = stack.pop()
        k -= 1
        
        if k == 0:
            return curr.val
        
        # Go right
        curr = curr.right`,
        java: `public int kthSmallest(TreeNode root, int k) {
    Stack<TreeNode> stack = new Stack<>();
    TreeNode curr = root;
    
    while (true) {
        while (curr != null) {
            stack.push(curr);
            curr = curr.left;
        }
        
        curr = stack.pop();
        k--;
        
        if (k == 0) {
            return curr.val;
        }
        
        curr = curr.right;
    }
}`,
        cpp: `int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    TreeNode* curr = root;
    
    while (true) {
        while (curr) {
            st.push(curr);
            curr = curr->left;
        }
        
        curr = st.top();
        st.pop();
        k--;
        
        if (k == 0) {
            return curr->val;
        }
        
        curr = curr->right;
    }
}`,
        typescript: `function kthSmallest(root: TreeNode | null, k: number): number {
    const stack: TreeNode[] = [];
    let curr = root;
    
    while (true) {
        while (curr) {
            stack.push(curr);
            curr = curr.left;
        }
        
        curr = stack.pop()!;
        k--;
        
        if (k === 0) {
            return curr.val;
        }
        
        curr = curr.right;
    }
}`,
        explanation: "Use iterative inorder traversal (left, root, right). In a BST, inorder gives sorted sequence. Stop when we've visited k nodes. Use stack to simulate recursion."
    },
    "lowest-common-ancestor-of-bst": {
        python: `def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    curr = root
    
    while curr:
        # Both p and q are in left subtree
        if p.val < curr.val and q.val < curr.val:
            curr = curr.left
        # Both p and q are in right subtree
        elif p.val > curr.val and q.val > curr.val:
            curr = curr.right
        # Split point found (or one is ancestor of other)
        else:
            return curr
    
    return None`,
        java: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    TreeNode curr = root;
    
    while (curr != null) {
        if (p.val < curr.val && q.val < curr.val) {
            curr = curr.left;
        } else if (p.val > curr.val && q.val > curr.val) {
            curr = curr.right;
        } else {
            return curr;
        }
    }
    
    return null;
}`,
        cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    TreeNode* curr = root;
    
    while (curr) {
        if (p->val < curr->val && q->val < curr->val) {
            curr = curr->left;
        } else if (p->val > curr->val && q->val > curr->val) {
            curr = curr->right;
        } else {
            return curr;
        }
    }
    
    return nullptr;
}`,
        typescript: `function lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode): TreeNode {
    let curr: TreeNode | null = root;
    
    while (curr) {
        if (p.val < curr.val && q.val < curr.val) {
            curr = curr.left;
        } else if (p.val > curr.val && q.val > curr.val) {
            curr = curr.right;
        } else {
            return curr;
        }
    }
    
    return curr!;
}`,
        explanation: "Leverage BST property: if both nodes are smaller than current, go left; if both larger, go right; otherwise current node is the LCA (split point). No recursion needed."
    },
    "implement-trie": {
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
    
    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`,
        java: `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEnd = false;
}

class Trie {
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
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
            if (!node.children.containsKey(c)) {
                return false;
            }
            node = node.children.get(c);
        }
        return node.isEnd;
    }
    
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return false;
            }
            node = node.children.get(c);
        }
        return true;
    }
}`,
        cpp: `class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
private:
    TrieNode* root;
    
public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isEnd = true;
    }
    
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            node = node->children[c];
        }
        return node->isEnd;
    }
    
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            node = node->children[c];
        }
        return true;
    }
};`,
        typescript: `class TrieNode {
    children: Map<string, TrieNode> = new Map();
    isEnd: boolean = false;
}

class Trie {
    private root: TrieNode;
    
    constructor() {
        this.root = new TrieNode();
    }
    
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
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char)!;
        }
        return node.isEnd;
    }
    
    startsWith(prefix: string): boolean {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char)!;
        }
        return true;
    }
}`,
        explanation: "Trie is a tree where each node represents a character. Each node has a map of children and an isEnd flag. Insert: traverse/create path. Search: traverse and check isEnd. StartsWith: just traverse."
    },
    "add-and-search-word": {
        python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()
    
    def addWord(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word: str) -> bool:
        def dfs(node, i):
            if i == len(word):
                return node.is_end
            
            if word[i] == '.':
                # Try all children
                for child in node.children.values():
                    if dfs(child, i + 1):
                        return True
                return False
            else:
                if word[i] not in node.children:
                    return False
                return dfs(node.children[word[i]], i + 1)
        
        return dfs(self.root, 0)`,
        java: `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEnd = false;
}

class WordDictionary {
    private TrieNode root;
    
    public WordDictionary() {
        root = new TrieNode();
    }
    
    public void addWord(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.isEnd = true;
    }
    
    public boolean search(String word) {
        return dfs(root, word, 0);
    }
    
    private boolean dfs(TrieNode node, String word, int i) {
        if (i == word.length()) {
            return node.isEnd;
        }
        
        char c = word.charAt(i);
        if (c == '.') {
            for (TrieNode child : node.children.values()) {
                if (dfs(child, word, i + 1)) {
                    return true;
                }
            }
            return false;
        } else {
            if (!node.children.containsKey(c)) {
                return false;
            }
            return dfs(node.children.get(c), word, i + 1);
        }
    }
}`,
        cpp: `class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class WordDictionary {
private:
    TrieNode* root;
    
    bool dfs(TrieNode* node, const string& word, int i) {
        if (i == word.length()) {
            return node->isEnd;
        }
        
        char c = word[i];
        if (c == '.') {
            for (auto& [ch, child] : node->children) {
                if (dfs(child, word, i + 1)) {
                    return true;
                }
            }
            return false;
        } else {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            return dfs(node->children[c], word, i + 1);
        }
    }
    
public:
    WordDictionary() {
        root = new TrieNode();
    }
    
    void addWord(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isEnd = true;
    }
    
    bool search(string word) {
        return dfs(root, word, 0);
    }
};`,
        typescript: `class TrieNode {
    children: Map<string, TrieNode> = new Map();
    isEnd: boolean = false;
}

class WordDictionary {
    private root: TrieNode;
    
    constructor() {
        this.root = new TrieNode();
    }
    
    addWord(word: string): void {
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
        const dfs = (node: TrieNode, i: number): boolean => {
            if (i === word.length) {
                return node.isEnd;
            }
            
            const char = word[i];
            if (char === '.') {
                for (const child of node.children.values()) {
                    if (dfs(child, i + 1)) {
                        return true;
                    }
                }
                return false;
            } else {
                if (!node.children.has(char)) {
                    return false;
                }
                return dfs(node.children.get(char)!, i + 1);
            }
        };
        
        return dfs(this.root, 0);
    }
}`,
        explanation: "Same as Trie but search uses DFS. When encountering '.', try all possible children recursively. For regular characters, follow standard Trie search path."
    },
    "word-search-ii": {
        python: `def findWords(board: List[List[str]], words: List[str]) -> List[str]:
    # Build Trie
    trie = {}
    for word in words:
        node = trie
        for char in word:
            if char not in node:
                node[char] = {}
            node = node[char]
        node['$'] = word  # Mark end with actual word
    
    rows, cols = len(board), len(board[0])
    result = set()
    
    def dfs(r, c, node):
        char = board[r][c]
        if char not in node:
            return
        
        node = node[char]
        
        # Found a complete word
        if '$' in node:
            result.add(node['$'])
        
        # Mark visited
        board[r][c] = '#'
        
        # Explore neighbors
        for dr, dc in [(0,1), (1,0), (0,-1), (-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                dfs(nr, nc, node)
        
        # Restore
        board[r][c] = char
    
    for r in range(rows):
        for c in range(cols):
            dfs(r, c, trie)
    
    return list(result)`,
        java: `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    String word = null;
}

public List<String> findWords(char[][] board, String[] words) {
    // Build Trie
    TrieNode root = new TrieNode();
    for (String word : words) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.word = word;
    }
    
    Set<String> result = new HashSet<>();
    int rows = board.length, cols = board[0].length;
    
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            dfs(board, r, c, root, result);
        }
    }
    
    return new ArrayList<>(result);
}

private void dfs(char[][] board, int r, int c, TrieNode node, Set<String> result) {
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
    
    char ch = board[r][c];
    if (ch == '#' || !node.children.containsKey(ch)) return;
    
    node = node.children.get(ch);
    if (node.word != null) {
        result.add(node.word);
    }
    
    board[r][c] = '#';
    dfs(board, r+1, c, node, result);
    dfs(board, r-1, c, node, result);
    dfs(board, r, c+1, node, result);
    dfs(board, r, c-1, node, result);
    board[r][c] = ch;
}`,
        cpp: `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    string word = "";
};

void dfs(vector<vector<char>>& board, int r, int c, TrieNode* node, set<string>& result) {
    if (r < 0 || r >= board.size() || c < 0 || c >= board[0].size()) return;
    
    char ch = board[r][c];
    if (ch == '#' || node->children.find(ch) == node->children.end()) return;
    
    node = node->children[ch];
    if (!node->word.empty()) {
        result.insert(node->word);
    }
    
    board[r][c] = '#';
    dfs(board, r+1, c, node, result);
    dfs(board, r-1, c, node, result);
    dfs(board, r, c+1, node, result);
    dfs(board, r, c-1, node, result);
    board[r][c] = ch;
}

vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    TrieNode* root = new TrieNode();
    for (const string& word : words) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->word = word;
    }
    
    set<string> result;
    for (int r = 0; r < board.size(); r++) {
        for (int c = 0; c < board[0].size(); c++) {
            dfs(board, r, c, root, result);
        }
    }
    
    return vector<string>(result.begin(), result.end());
}`,
        typescript: `function findWords(board: string[][], words: string[]): string[] {
    class TrieNode {
        children: Map<string, TrieNode> = new Map();
        word: string | null = null;
    }
    
    // Build Trie
    const root = new TrieNode();
    for (const word of words) {
        let node = root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char)!;
        }
        node.word = word;
    }
    
    const result = new Set<string>();
    const rows = board.length, cols = board[0].length;
    
    function dfs(r: number, c: number, node: TrieNode): void {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        
        const char = board[r][c];
        if (char === '#' || !node.children.has(char)) return;
        
        node = node.children.get(char)!;
        if (node.word) {
            result.add(node.word);
        }
        
        board[r][c] = '#';
        dfs(r+1, c, node);
        dfs(r-1, c, node);
        dfs(r, c+1, node);
        dfs(r, c-1, node);
        board[r][c] = char;
    }
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dfs(r, c, root);
        }
    }
    
    return Array.from(result);
}`,
        explanation: "Build Trie from all words. For each cell, do DFS backtracking guided by Trie. Only explore paths that match Trie prefixes. Mark cells visited during DFS. When reaching a word end in Trie, add to results."
    },
    "top-k-frequent-elements": {
        python: `def topKFrequent(nums: List[int], k: int) -> List[int]:
    # Count frequencies
    count = {}
    for num in nums:
        count[num] = count.get(num, 0) + 1
    
    # Bucket sort: index = frequency, value = list of numbers
    freq = [[] for _ in range(len(nums) + 1)]
    for num, c in count.items():
        freq[c].append(num)
    
    # Collect top k from highest frequency
    result = []
    for i in range(len(freq) - 1, 0, -1):
        for num in freq[i]:
            result.append(num)
            if len(result) == k:
                return result
    
    return result`,
        java: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int num : nums) {
        count.put(num, count.getOrDefault(num, 0) + 1);
    }
    
    List<Integer>[] freq = new List[nums.length + 1];
    for (int i = 0; i <= nums.length; i++) {
        freq[i] = new ArrayList<>();
    }
    
    for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
        freq[entry.getValue()].add(entry.getKey());
    }
    
    int[] result = new int[k];
    int idx = 0;
    
    for (int i = freq.length - 1; i >= 0 && idx < k; i--) {
        for (int num : freq[i]) {
            result[idx++] = num;
            if (idx == k) return result;
        }
    }
    
    return result;
}`,
        cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> count;
    for (int num : nums) {
        count[num]++;
    }
    
    vector<vector<int>> freq(nums.size() + 1);
    for (auto& [num, c] : count) {
        freq[c].push_back(num);
    }
    
    vector<int> result;
    for (int i = freq.size() - 1; i >= 0 && result.size() < k; i--) {
        for (int num : freq[i]) {
            result.push_back(num);
            if (result.size() == k) return result;
        }
    }
    
    return result;
}`,
        typescript: `function topKFrequent(nums: number[], k: number): number[] {
    const count = new Map<number, number>();
    for (const num of nums) {
        count.set(num, (count.get(num) || 0) + 1);
    }
    
    const freq: number[][] = Array.from({ length: nums.length + 1 }, () => []);
    for (const [num, c] of count) {
        freq[c].push(num);
    }
    
    const result: number[] = [];
    for (let i = freq.length - 1; i >= 0 && result.length < k; i--) {
        for (const num of freq[i]) {
            result.push(num);
            if (result.length === k) return result;
        }
    }
    
    return result;
}`,
        explanation: "Use bucket sort for O(n) solution. Count frequencies, then create buckets where index=frequency. Iterate from highest frequency bucket collecting elements until we have k elements."
    },
    "find-median-from-data-stream": {
        python: `import heapq

class MedianFinder:
    def __init__(self):
        # Max heap for smaller half (negate values)
        self.small = []
        # Min heap for larger half
        self.large = []
    
    def addNum(self, num: int) -> None:
        # Add to small heap (max heap using negation)
        heapq.heappush(self.small, -num)
        
        # Balance: ensure max of small <= min of large
        if self.small and self.large and (-self.small[0] > self.large[0]):
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        
        # Balance sizes (small can have at most 1 more element)
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        if len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)
    
    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2.0`,
        java: `class MedianFinder {
    private PriorityQueue<Integer> small; // max heap
    private PriorityQueue<Integer> large; // min heap
    
    public MedianFinder() {
        small = new PriorityQueue<>((a, b) -> b - a);
        large = new PriorityQueue<>();
    }
    
    public void addNum(int num) {
        small.offer(num);
        
        if (!small.isEmpty() && !large.isEmpty() && small.peek() > large.peek()) {
            large.offer(small.poll());
        }
        
        if (small.size() > large.size() + 1) {
            large.offer(small.poll());
        }
        if (large.size() > small.size()) {
            small.offer(large.poll());
        }
    }
    
    public double findMedian() {
        if (small.size() > large.size()) {
            return small.peek();
        }
        return (small.peek() + large.peek()) / 2.0;
    }
}`,
        cpp: `class MedianFinder {
private:
    priority_queue<int> small; // max heap
    priority_queue<int, vector<int>, greater<int>> large; // min heap
    
public:
    MedianFinder() {}
    
    void addNum(int num) {
        small.push(num);
        
        if (!small.empty() && !large.empty() && small.top() > large.top()) {
            large.push(small.top());
            small.pop();
        }
        
        if (small.size() > large.size() + 1) {
            large.push(small.top());
            small.pop();
        }
        if (large.size() > small.size()) {
            small.push(large.top());
            large.pop();
        }
    }
    
    double findMedian() {
        if (small.size() > large.size()) {
            return small.top();
        }
        return (small.top() + large.top()) / 2.0;
    }
};`,
        typescript: `class MedianFinder {
    private small: MaxHeap;  // smaller half
    private large: MinHeap;  // larger half
    
    constructor() {
        this.small = new MaxHeap();
        this.large = new MinHeap();
    }
    
    addNum(num: number): void {
        this.small.push(num);
        
        if (this.small.size() > 0 && this.large.size() > 0 && 
            this.small.peek()! > this.large.peek()!) {
            this.large.push(this.small.pop()!);
        }
        
        if (this.small.size() > this.large.size() + 1) {
            this.large.push(this.small.pop()!);
        }
        if (this.large.size() > this.small.size()) {
            this.small.push(this.large.pop()!);
        }
    }
    
    findMedian(): number {
        if (this.small.size() > this.large.size()) {
            return this.small.peek()!;
        }
        return (this.small.peek()! + this.large.peek()!) / 2.0;
    }
}`,
        explanation: "Use two heaps: max heap for smaller half, min heap for larger half. Keep sizes balanced (small can have 1 more). Median is either top of small (odd count) or average of both tops (even count). O(log n) per operation."
    },
    "spiral-matrix": {
        python: `def spiralOrder(matrix: List[List[int]]) -> List[int]:
    result = []
    if not matrix:
        return result
    
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Right
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        
        # Down
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        
        if top <= bottom:
            # Left
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
        
        if left <= right:
            # Up
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    
    return result`,
        java: `public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> result = new ArrayList<>();
    if (matrix.length == 0) return result;
    
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) {
            result.add(matrix[top][j]);
        }
        top++;
        
        for (int i = top; i <= bottom; i++) {
            result.add(matrix[i][right]);
        }
        right--;
        
        if (top <= bottom) {
            for (int j = right; j >= left; j--) {
                result.add(matrix[bottom][j]);
            }
            bottom--;
        }
        
        if (left <= right) {
            for (int i = bottom; i >= top; i--) {
                result.add(matrix[i][left]);
            }
            left++;
        }
    }
    
    return result;
}`,
        cpp: `vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> result;
    if (matrix.empty()) return result;
    
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) {
            result.push_back(matrix[top][j]);
        }
        top++;
        
        for (int i = top; i <= bottom; i++) {
            result.push_back(matrix[i][right]);
        }
        right--;
        
        if (top <= bottom) {
            for (int j = right; j >= left; j--) {
                result.push_back(matrix[bottom][j]);
            }
            bottom--;
        }
        
        if (left <= right) {
            for (int i = bottom; i >= top; i--) {
                result.push_back(matrix[i][left]);
            }
            left++;
        }
    }
    
    return result;
}`,
        typescript: `function spiralOrder(matrix: number[][]): number[] {
    const result: number[] = [];
    if (!matrix.length) return result;
    
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) {
            result.push(matrix[top][j]);
        }
        top++;
        
        for (let i = top; i <= bottom; i++) {
            result.push(matrix[i][right]);
        }
        right--;
        
        if (top <= bottom) {
            for (let j = right; j >= left; j--) {
                result.push(matrix[bottom][j]);
            }
            bottom--;
        }
        
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                result.push(matrix[i][left]);
            }
            left++;
        }
    }
    
    return result;
}`,
        explanation: "Track four boundaries: top, bottom, left, right. Traverse right→down→left→up in spiral, shrinking boundaries after each direction. Check boundaries before left/up to avoid duplicates. O(m×n) time, O(1) space."
    },
    "rotate-image": {
        python: `def rotate(matrix: List[List[int]]) -> None:
    n = len(matrix)
    
    # Transpose matrix
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Reverse each row
    for i in range(n):
        matrix[i].reverse()`,
        java: `public void rotate(int[][] matrix) {
    int n = matrix.length;
    
    // Transpose
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    
    // Reverse each row
    for (int i = 0; i < n; i++) {
        int left = 0, right = n - 1;
        while (left < right) {
            int temp = matrix[i][left];
            matrix[i][left] = matrix[i][right];
            matrix[i][right] = temp;
            left++;
            right--;
        }
    }
}`,
        cpp: `void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    
    // Transpose
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }
    
    // Reverse each row
    for (int i = 0; i < n; i++) {
        reverse(matrix[i].begin(), matrix[i].end());
    }
}`,
        typescript: `function rotate(matrix: number[][]): void {
    const n = matrix.length;
    
    // Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    // Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
}`,
        explanation: "Two steps for 90° clockwise rotation: 1) Transpose matrix (swap matrix[i][j] with matrix[j][i]). 2) Reverse each row. For counter-clockwise, reverse columns instead. O(n²) time, O(1) space."
    },
    "word-search": {
        python: `def exist(board: List[List[str]], word: str) -> bool:
    m, n = len(board), len(board[0])
    
    def dfs(r, c, index):
        if index == len(word):
            return True
        
        if (r < 0 or r >= m or c < 0 or c >= n or 
            board[r][c] != word[index]):
            return False
        
        # Mark as visited
        temp = board[r][c]
        board[r][c] = '#'
        
        # Try all 4 directions
        found = (dfs(r+1, c, index+1) or dfs(r-1, c, index+1) or
                 dfs(r, c+1, index+1) or dfs(r, c-1, index+1))
        
        # Backtrack
        board[r][c] = temp
        return found
    
    for i in range(m):
        for j in range(n):
            if dfs(i, j, 0):
                return True
    
    return False`,
        java: `public boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (dfs(board, word, i, j, 0)) {
                return true;
            }
        }
    }
    
    return false;
}

private boolean dfs(char[][] board, String word, int r, int c, int index) {
    if (index == word.length()) return true;
    
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length ||
        board[r][c] != word.charAt(index)) {
        return false;
    }
    
    char temp = board[r][c];
    board[r][c] = '#';
    
    boolean found = dfs(board, word, r+1, c, index+1) ||
                    dfs(board, word, r-1, c, index+1) ||
                    dfs(board, word, r, c+1, index+1) ||
                    dfs(board, word, r, c-1, index+1);
    
    board[r][c] = temp;
    return found;
}`,
        cpp: `bool dfs(vector<vector<char>>& board, string& word, int r, int c, int index) {
    if (index == word.length()) return true;
    
    if (r < 0 || r >= board.size() || c < 0 || c >= board[0].size() ||
        board[r][c] != word[index]) {
        return false;
    }
    
    char temp = board[r][c];
    board[r][c] = '#';
    
    bool found = dfs(board, word, r+1, c, index+1) ||
                 dfs(board, word, r-1, c, index+1) ||
                 dfs(board, word, r, c+1, index+1) ||
                 dfs(board, word, r, c-1, index+1);
    
    board[r][c] = temp;
    return found;
}

bool exist(vector<vector<char>>& board, string word) {
    for (int i = 0; i < board.size(); i++) {
        for (int j = 0; j < board[0].size(); j++) {
            if (dfs(board, word, i, j, 0)) {
                return true;
            }
        }
    }
    return false;
}`,
        typescript: `function exist(board: string[][], word: string): boolean {
    const m = board.length, n = board[0].length;
    
    function dfs(r: number, c: number, index: number): boolean {
        if (index === word.length) return true;
        
        if (r < 0 || r >= m || c < 0 || c >= n ||
            board[r][c] !== word[index]) {
            return false;
        }
        
        const temp = board[r][c];
        board[r][c] = '#';
        
        const found = dfs(r+1, c, index+1) || dfs(r-1, c, index+1) ||
                     dfs(r, c+1, index+1) || dfs(r, c-1, index+1);
        
        board[r][c] = temp;
        return found;
    }
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) return true;
        }
    }
    
    return false;
}`,
        explanation: "Backtracking DFS. For each cell, if it matches word[0], start DFS. Mark visited cells, try 4 directions. If path found, return true. Backtrack by unmarking. O(m×n×4^L) worst case."
    },
    "longest-repeating-character-replacement": {
        python: `def characterReplacement(s: str, k: int) -> int:
    count = {}
    max_length = 0
    max_count = 0
    left = 0
    
    for right in range(len(s)):
        count[s[right]] = count.get(s[right], 0) + 1
        max_count = max(max_count, count[s[right]])
        
        # If window invalid, shrink from left
        while (right - left + 1) - max_count > k:
            count[s[left]] -= 1
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
        java: `public int characterReplacement(String s, int k) {
    int[] count = new int[26];
    int maxLength = 0;
    int maxCount = 0;
    int left = 0;
    
    for (int right = 0; right < s.length(); right++) {
        count[s.charAt(right) - 'A']++;
        maxCount = Math.max(maxCount, count[s.charAt(right) - 'A']);
        
        while ((right - left + 1) - maxCount > k) {
            count[s.charAt(left) - 'A']--;
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
        cpp: `int characterReplacement(string s, int k) {
    vector<int> count(26, 0);
    int maxLength = 0;
    int maxCount = 0;
    int left = 0;
    
    for (int right = 0; right < s.length(); right++) {
        count[s[right] - 'A']++;
        maxCount = max(maxCount, count[s[right] - 'A']);
        
        while ((right - left + 1) - maxCount > k) {
            count[s[left] - 'A']--;
            left++;
        }
        
        maxLength = max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
        typescript: `function characterReplacement(s: string, k: number): number {
    const count = new Array(26).fill(0);
    let maxLength = 0;
    let maxCount = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        count[s.charCodeAt(right) - 65]++;
        maxCount = Math.max(maxCount, count[s.charCodeAt(right) - 65]);
        
        while ((right - left + 1) - maxCount > k) {
            count[s.charCodeAt(left) - 65]--;
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
        explanation: "Sliding window. Track count of most frequent char in window. If (window size - max frequency) > k, shrink window. Window is valid if we can replace remaining chars within k changes. O(n) time."
    },
    "minimum-window-substring": {
        python: `def minWindow(s: str, t: str) -> str:
    if not s or not t:
        return ""
    
    need = {}
    for c in t:
        need[c] = need.get(c, 0) + 1
    
    required = len(need)
    formed = 0
    window = {}
    
    left = 0
    min_len = float('inf')
    min_left = 0
    
    for right in range(len(s)):
        char = s[right]
        window[char] = window.get(char, 0) + 1
        
        if char in need and window[char] == need[char]:
            formed += 1
        
        # Shrink window
        while left <= right and formed == required:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_left = left
            
            char = s[left]
            window[char] -= 1
            if char in need and window[char] < need[char]:
                formed -= 1
            left += 1
    
    return "" if min_len == float('inf') else s[min_left:min_left + min_len]`,
        java: `public String minWindow(String s, String t) {
    if (s.length() == 0 || t.length() == 0) return "";
    
    Map<Character, Integer> need = new HashMap<>();
    for (char c : t.toCharArray()) {
        need.put(c, need.getOrDefault(c, 0) + 1);
    }
    
    int required = need.size();
    int formed = 0;
    Map<Character, Integer> window = new HashMap<>();
    
    int left = 0;
    int minLen = Integer.MAX_VALUE;
    int minLeft = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        window.put(c, window.getOrDefault(c, 0) + 1);
        
        if (need.containsKey(c) && window.get(c).intValue() == need.get(c).intValue()) {
            formed++;
        }
        
        while (left <= right && formed == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minLeft = left;
            }
            
            char leftChar = s.charAt(left);
            window.put(leftChar, window.get(leftChar) - 1);
            if (need.containsKey(leftChar) && window.get(leftChar) < need.get(leftChar)) {
                formed--;
            }
            left++;
        }
    }
    
    return minLen == Integer.MAX_VALUE ? "" : s.substring(minLeft, minLeft + minLen);
}`,
        cpp: `string minWindow(string s, string t) {
    if (s.empty() || t.empty()) return "";
    
    unordered_map<char, int> need, window;
    for (char c : t) {
        need[c]++;
    }
    
    int required = need.size();
    int formed = 0;
    
    int left = 0;
    int minLen = INT_MAX;
    int minLeft = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s[right];
        window[c]++;
        
        if (need.find(c) != need.end() && window[c] == need[c]) {
            formed++;
        }
        
        while (left <= right && formed == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minLeft = left;
            }
            
            char leftChar = s[left];
            window[leftChar]--;
            if (need.find(leftChar) != need.end() && window[leftChar] < need[leftChar]) {
                formed--;
            }
            left++;
        }
    }
    
    return minLen == INT_MAX ? "" : s.substr(minLeft, minLen);
}`,
        typescript: `function minWindow(s: string, t: string): string {
    if (!s || !t) return "";
    
    const need = new Map<string, number>();
    for (const c of t) {
        need.set(c, (need.get(c) || 0) + 1);
    }
    
    const required = need.size;
    let formed = 0;
    const window = new Map<string, number>();
    
    let left = 0;
    let minLen = Infinity;
    let minLeft = 0;
    
    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        window.set(c, (window.get(c) || 0) + 1);
        
        if (need.has(c) && window.get(c) === need.get(c)) {
            formed++;
        }
        
        while (left <= right && formed === required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minLeft = left;
            }
            
            const leftChar = s[left];
            window.set(leftChar, window.get(leftChar)! - 1);
            if (need.has(leftChar) && window.get(leftChar)! < need.get(leftChar)!) {
                formed--;
            }
            left++;
        }
    }
    
    return minLen === Infinity ? "" : s.substring(minLeft, minLeft + minLen);
}`,
        explanation: "Sliding window with two hashmaps. Expand right to include chars from t. When window contains all required chars, shrink from left while valid. Track minimum window. O(m+n) time where m,n are lengths of s,t."
    },
    "valid-palindrome": {
        python: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        # Compare
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True`,
        java: `public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
            left++;
        }
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
            right--;
        }
        
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}`,
        cpp: `bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        while (left < right && !isalnum(s[left])) {
            left++;
        }
        while (left < right && !isalnum(s[right])) {
            right--;
        }
        
        if (tolower(s[left]) != tolower(s[right])) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}`,
        typescript: `function isPalindrome(s: string): boolean {
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }
        while (left < right && !isAlphanumeric(s[right])) {
            right--;
        }
        
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}

function isAlphanumeric(c: string): boolean {
    return /^[a-zA-Z0-9]$/.test(c);
}`,
        explanation: "Two pointers from both ends. Skip non-alphanumeric chars. Compare lowercase versions. Move pointers inward. If any mismatch, not palindrome. O(n) time, O(1) space."
    },
    "longest-palindromic-substring": {
        python: `def longestPalindrome(s: str) -> str:
    if not s:
        return ""
    
    def expand_around_center(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1
    
    start = 0
    max_len = 0
    
    for i in range(len(s)):
        # Odd length palindromes
        len1 = expand_around_center(i, i)
        # Even length palindromes
        len2 = expand_around_center(i, i + 1)
        
        length = max(len1, len2)
        
        if length > max_len:
            max_len = length
            start = i - (length - 1) // 2
    
    return s[start:start + max_len]`,
        java: `public String longestPalindrome(String s) {
    if (s == null || s.length() == 0) return "";
    
    int start = 0, maxLen = 0;
    
    for (int i = 0; i < s.length(); i++) {
        int len1 = expandAroundCenter(s, i, i);
        int len2 = expandAroundCenter(s, i, i + 1);
        int len = Math.max(len1, len2);
        
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }
    
    return s.substring(start, start + maxLen);
}

private int expandAroundCenter(String s, int left, int right) {
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;
}`,
        cpp: `int expandAroundCenter(string& s, int left, int right) {
    while (left >= 0 && right < s.length() && s[left] == s[right]) {
        left--;
        right++;
    }
    return right - left - 1;
}

string longestPalindrome(string s) {
    if (s.empty()) return "";
    
    int start = 0, maxLen = 0;
    
    for (int i = 0; i < s.length(); i++) {
        int len1 = expandAroundCenter(s, i, i);
        int len2 = expandAroundCenter(s, i, i + 1);
        int len = max(len1, len2);
        
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }
    
    return s.substr(start, maxLen);
}`,
        typescript: `function longestPalindrome(s: string): string {
    if (!s) return "";
    
    function expandAroundCenter(left: number, right: number): number {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }
    
    let start = 0, maxLen = 0;
    
    for (let i = 0; i < s.length; i++) {
        const len1 = expandAroundCenter(i, i);
        const len2 = expandAroundCenter(i, i + 1);
        const len = Math.max(len1, len2);
        
        if (len > maxLen) {
            maxLen = len;
            start = i - Math.floor((len - 1) / 2);
        }
    }
    
    return s.substring(start, start + maxLen);
}`,
        explanation: "Expand around center approach. For each position, try both odd (single center) and even (two centers) length palindromes. Expand outward while chars match. Track longest. O(n²) time, O(1) space."
    },
    "palindromic-substrings": {
        python: `def countSubstrings(s: str) -> int:
    count = 0
    
    def expand_around_center(left, right):
        nonlocal count
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
    
    for i in range(len(s)):
        # Odd length
        expand_around_center(i, i)
        # Even length
        expand_around_center(i, i + 1)
    
    return count`,
        java: `public int countSubstrings(String s) {
    int count = 0;
    
    for (int i = 0; i < s.length(); i++) {
        count += expandAroundCenter(s, i, i);
        count += expandAroundCenter(s, i, i + 1);
    }
    
    return count;
}

private int expandAroundCenter(String s, int left, int right) {
    int count = 0;
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        count++;
        left--;
        right++;
    }
    return count;
}`,
        cpp: `int expandAroundCenter(string& s, int left, int right) {
    int count = 0;
    while (left >= 0 && right < s.length() && s[left] == s[right]) {
        count++;
        left--;
        right++;
    }
    return count;
}

int countSubstrings(string s) {
    int count = 0;
    
    for (int i = 0; i < s.length(); i++) {
        count += expandAroundCenter(s, i, i);
        count += expandAroundCenter(s, i, i + 1);
    }
    
    return count;
}`,
        typescript: `function countSubstrings(s: string): number {
    let count = 0;
    
    function expandAroundCenter(left: number, right: number): void {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            count++;
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i);
        expandAroundCenter(i, i + 1);
    }
    
    return count;
}`,
        explanation: "Similar to longest palindromic substring but count all instead of tracking max. For each center, expand and count valid palindromes. O(n²) time, O(1) space."
    },
    "encode-and-decode-strings": {
        python: `def encode(strs: List[str]) -> str:
    result = ""
    for s in strs:
        result += str(len(s)) + "#" + s
    return result

def decode(s: str) -> List[str]:
    result = []
    i = 0
    
    while i < len(s):
        # Find delimiter
        j = i
        while s[j] != '#':
            j += 1
        
        # Get length
        length = int(s[i:j])
        
        # Extract string
        result.append(s[j+1:j+1+length])
        i = j + 1 + length
    
    return result`,
        java: `public String encode(List<String> strs) {
    StringBuilder result = new StringBuilder();
    for (String s : strs) {
        result.append(s.length()).append("#").append(s);
    }
    return result.toString();
}

public List<String> decode(String s) {
    List<String> result = new ArrayList<>();
    int i = 0;
    
    while (i < s.length()) {
        int j = i;
        while (s.charAt(j) != '#') {
            j++;
        }
        
        int length = Integer.parseInt(s.substring(i, j));
        result.add(s.substring(j + 1, j + 1 + length));
        i = j + 1 + length;
    }
    
    return result;
}`,
        cpp: `string encode(vector<string>& strs) {
    string result;
    for (const string& s : strs) {
        result += to_string(s.length()) + "#" + s;
    }
    return result;
}

vector<string> decode(string s) {
    vector<string> result;
    int i = 0;
    
    while (i < s.length()) {
        int j = i;
        while (s[j] != '#') {
            j++;
        }
        
        int length = stoi(s.substr(i, j - i));
        result.push_back(s.substr(j + 1, length));
        i = j + 1 + length;
    }
    
    return result;
}`,
        typescript: `function encode(strs: string[]): string {
    let result = "";
    for (const s of strs) {
        result += s.length + "#" + s;
    }
    return result;
}

function decode(s: string): string[] {
    const result: string[] = [];
    let i = 0;
    
    while (i < s.length) {
        let j = i;
        while (s[j] !== '#') {
            j++;
        }
        
        const length = parseInt(s.substring(i, j));
        result.push(s.substring(j + 1, j + 1 + length));
        i = j + 1 + length;
    }
    
    return result;
}`,
        explanation: "Length-prefixed encoding: for each string, prepend length + delimiter (#). To decode: read length, skip delimiter, extract that many chars. Handles any characters including delimiters. O(n) time for both."
    }
};
