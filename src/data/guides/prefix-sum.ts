export const content = `
# Prefix Sum: The Magic Diary of Totals!

##  Introduction: The Piggy Bank Problem

Imagine you have a piggy bank, and every day you put some coins in it. 

* **Day 1:** 3 coins
* **Day 2:** 2 coins
* **Day 3:** 4 coins
* **Day 4:** 1 coin
* **Day 5:** 5 coins

If your friend asks, *"How many coins did you put in from Day 1 to Day 3?"*, you would have to add them up: \`3 + 2 + 4 = 9\`.

Then your friend asks, *"How about from Day 2 to Day 5?"*. You have to add them up again: \`2 + 4 + 1 + 5 = 12\`.

If your piggy bank had 100 days of coins, adding them up over and over again for different days would be super slow and make your brain hurt!

What if there was a magic trick to find the answer instantly without doing all that adding?

##  The Magic Diary (Prefix Sum)

Instead of just writing down how many coins you added each day, what if you kept a special diary? In this diary, you write down the **TOTAL** number of coins currently in the piggy bank at the end of each day!

Let's make our special diary:
* **Day 1:** 3 coins -> **Total: 3**
* **Day 2:** 2 coins -> (3 + 2) = **Total: 5**
* **Day 3:** 4 coins -> (5 + 4) = **Total: 9**
* **Day 4:** 1 coin -> (9 + 1) = **Total: 10**
* **Day 5:** 5 coins -> (10 + 5) = **Total: 15**

This special "Total Diary" is what programmers call a **Prefix Sum** array! 

##  How to Use the Magic Diary

Now, if your friend asks, *"How many coins did you add from Day 2 to Day 4?"*

You don't need to add Day 2 + Day 3 + Day 4 anymore! You just do one simple math problem using your diary:

1. Look at the total on **Day 4** (which is 10). This is all the coins from the very beginning.
2. We only want coins starting from Day 2, so we need to throw away the coins from Day 1. Look at the total on **Day 1** (which is 3).
3. Subtract them! \`10 - 3 = 7\` coins!

You found the answer instantly! 
**Formula:** \`Sum from Day A to Day B = Total at Day B - Total right before Day A\`

---

##  Why Do We Need To Learn It?

In computer programming, we often have huge lists (arrays) with millions of numbers. Sometimes, the computer gets asked thousands of questions like *"What is the sum of numbers from index 100 to index 5000?"*

If the computer adds them up one by one every single time, it will take forever! (This is called **O(N)** time). 

But if we spend a little time at the beginning to build our "Magic Diary" (Prefix Sum array), we can answer any question instantly in just one step! (This is called **O(1)** time). It makes our programs lightning fast!

---

##  Let's Look at Some Code! (Building the Diary)

Let's write code to take a normal array of numbers and turn it into a Prefix Sum array.

[Visualize Prefix Sum in the Interactive Simulator](viz:prefix-sum)

#### Complete Implementations

##### Python
\`\`\`python
def build_prefix_sum(nums: list[int]) -> list[int]:
    # We make a new array for our diary, same size as nums
    prefix = [0] * len(nums)
    
    # Day 1 total is just Day 1's coins
    prefix[0] = nums[0]
    
    # For the rest of the days, add today's coins to yesterday's total
    for i in range(1, len(nums)):
        prefix[i] = prefix[i - 1] + nums[i]
        
    return prefix

# Example:
# nums   = [3, 2, 4, 1, 5]
# prefix = [3, 5, 9, 10, 15]
\`\`\`

##### Java
\`\`\`java
class Solution {
    public int[] buildPrefixSum(int[] nums) {
        int n = nums.length;
        // We make a new array for our diary
        int[] prefix = new int[n];
        
        // Day 1 total is just Day 1's coins
        prefix[0] = nums[0];
        
        // For the rest of the days, add today's coins to yesterday's total
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] + nums[i];
        }
        
        return prefix;
    }
}
\`\`\`

##### C++
\`\`\`cpp
class Solution {
public:
    vector<int> buildPrefixSum(vector<int>& nums) {
        int n = nums.size();
        // We make a new array for our diary
        vector<int> prefix(n);
        
        // Day 1 total is just Day 1's coins
        prefix[0] = nums[0];
        
        // For the rest of the days, add today's coins to yesterday's total
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] + nums[i];
        }
        
        return prefix;
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function buildPrefixSum(nums: number[]): number[] {
    const n = nums.length;
    // We make a new array for our diary
    const prefix = new Array(n).fill(0);
    
    // Day 1 total is just Day 1's coins
    prefix[0] = nums[0];
    
    // For the rest of the days, add today's coins to yesterday's total
    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] + nums[i];
    }
    
    return prefix;
}
\`\`\`

---

##  Problem 1: Range Sum Query

This is exactly like the piggy bank problem! You are given an array of numbers. Then, you will be asked many times to find the sum of numbers between two indices \`left\` and \`right\`.

### The Strategy
1. First, build the Prefix Sum array (the magic diary).
2. When asked for the sum from \`left\` to \`right\`:
   - If \`left\` is 0, just return \`prefix[right]\`.
   - Otherwise, return \`prefix[right] - prefix[left - 1]\`. (Take the big total and subtract the part we don't want!)

#### Complete Implementations

##### Python
\`\`\`python
class NumArray:
    def __init__(self, nums: list[int]):
        # This list will act as our "magic diary" to store cumulative totals
        self.prefix = []
        current_total = 0
        
        # Loop through the numbers to build the prefix sum array
        for num in nums:
            current_total += num
            self.prefix.append(current_total)

    def sumRange(self, left: int, right: int) -> int:
        # If left is 0, we just need the total up to 'right', no subtraction needed
        if left == 0:
            return self.prefix[right]
            
        # Otherwise, take the big total at 'right' and subtract the part before 'left'
        return self.prefix[right] - self.prefix[left - 1]
\`\`\`

##### Java
\`\`\`java
class NumArray {
    // Array to store our cumulative totals
    int[] prefix;

    public NumArray(int[] nums) {
        // Initialize our magic diary with the same length
        prefix = new int[nums.length];
        prefix[0] = nums[0]; // First element is always just itself
        
        // Build the prefix sum by adding current number to previous total
        for (int i = 1; i < nums.length; i++) {
            prefix[i] = prefix[i - 1] + nums[i];
        }
    }
    
    public int sumRange(int left, int right) {
        // If left is 0, just return the total accumulated so far
        if (left == 0) {
            return prefix[right];
        }
        // Subtract the unwanted sum that comes before our 'left' index
        return prefix[right] - prefix[left - 1];
    }
}
\`\`\`

##### C++
\`\`\`cpp
class NumArray {
private:
    // This vector will hold our pre-calculated running totals
    vector<int> prefix;
public:
    NumArray(vector<int>& nums) {
        // Set the size to match the input array
        prefix.resize(nums.size());
        prefix[0] = nums[0];
        
        // Loop through and calculate the running sum at each step
        for (int i = 1; i < nums.size(); i++) {
            prefix[i] = prefix[i - 1] + nums[i];
        }
    }
    
    int sumRange(int left, int right) {
        // Base case: if we start from the very beginning
        if (left == 0) return prefix[right];
        
        // General case: subtract the prefix sum just before our left bound
        return prefix[right] - prefix[left - 1];
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
class NumArray {
    // Array that serves as our "magic diary" for quick lookups
    private prefix: number[];

    constructor(nums: number[]) {
        this.prefix = new Array(nums.length);
        this.prefix[0] = nums[0];
        
        // Populate the diary with cumulative sums
        for (let i = 1; i < nums.length; i++) {
            this.prefix[i] = this.prefix[i - 1] + nums[i];
        }
    }

    sumRange(left: number, right: number): number {
        // If starting from index 0, the sum is directly in the diary at 'right'
        if (left === 0) {
            return this.prefix[right];
        }
        
        // Otherwise, take the big sum and subtract the sum of elements before 'left'
        return this.prefix[right] - this.prefix[left - 1];
    }
}
\`\`\`

---

##  Common Mistakes

1. **Off-by-One Errors**: When subtracting, remember to subtract \`prefix[left - 1]\`, NOT \`prefix[left]\`. If you subtract \`prefix[left]\`, you accidentally throw away the starting number too!
2. **Left is Zero**: If \`left\` is 0, \`left - 1\` is -1, which will crash your program. Always handle the \`left == 0\` case separately!

---

##  Summary
* **Prefix Sum** is like a magic diary that keeps track of a running total.
* It changes slow O(N) addition into lightning-fast O(1) subtraction.
* Formula: \`Sum(left, right) = Prefix[right] - Prefix[left - 1]\`.

---

##  Practice Problems & Website Verifications

Verify your prefix sum logic by solving these interactive problems on our platform:
* [Product of Array Except Self](/problem/product-of-array-except-self) — Learn to use prefix and suffix arrays together!
* [Maximum Subarray](/problem/maximum-subarray) — Kadane's algorithm, a variation of prefix sum logic.
`;
