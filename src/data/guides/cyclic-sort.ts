export const content = `
# Cyclic Sort: The Perfect Seating Chart!

##  Introduction: The Scrambled Classroom

Imagine you are a teacher, and you have a classroom with exactly 5 students. Their names are just numbers: **1, 2, 3, 4, and 5**. 

You also have 5 desks, nicely numbered **1 through 5**. 

One day, you walk into the classroom and the students are completely scrambled! Student #4 is sitting at Desk #1. Student #2 is at Desk #5. It's chaos! How do you get everyone into their correct desk as quickly as possible?

Here is the magic trick:
1. You walk up to the first desk (Desk #1). 
2. You look at the student sitting there. Let's say it is Student #4.
3. You tell Student #4, *"Hey, you belong at Desk #4! Let's swap you with whoever is sitting there right now."*
4. You swap them. Now Student #4 is happily in Desk #4! 
5. But what about the student you just brought back to Desk #1? You look at their number and swap them to *their* correct desk!
6. You keep doing this until Student #1 is finally sitting at Desk #1. Then, you just move on to Desk #2 and make sure the right student is there.

This simple but incredibly powerful trick is called **Cyclic Sort**!

---

##  What Exactly IS Cyclic Sort?

Cyclic Sort is a special pattern used to sort an array of numbers when you know the numbers are in a specific, continuous range—like **1 to N** or **0 to N**. 

Because you know exactly where each number *should* go (Number 1 belongs at index 0, Number 2 belongs at index 1, etc.), you don't need a complex sorting algorithm. You just look at the number, figure out its correct "desk" (index), and swap it into place!

---

##  Why Do We Need To Learn It?

If you ever see a problem that says:
* *"Find the missing number in an array from 1 to N"*
* *"Find the duplicate number in an array of size N"*
* *"Find the smallest missing positive integer"*

...then **Cyclic Sort** is your secret weapon! 

It allows you to sort the array and find missing or duplicate numbers in **O(n) time** without using any extra memory (**O(1) space**). It's incredibly fast because each number gets swapped to its correct spot at most one time.

---

##  The Golden Rule of Cyclic Sort

The core rule of Cyclic Sort is: **"Put the number in its correct index."**

If we are dealing with numbers from \`1\` to \`N\`, then:
* The number \`1\` belongs at index \`0\`.
* The number \`2\` belongs at index \`1\`.
* The number \`val\` belongs at index \`val - 1\`.

We just loop through the array. If the number at the current index is NOT in its correct "desk", we swap it with the person who is sitting at that desk. If it IS in the correct desk, we just move to the next desk!

---

##  Let's Look at Some Code! (The Cyclic Sort Template)

Here is the standard template to sort an array of numbers from \`1\` to \`n\`.

#### Complete Implementations

##### Python
\`\`\`python
def cyclic_sort(nums: list[int]) -> list[int]:
    i = 0
    while i < len(nums):
        # Calculate the correct index for the current number
        # If nums contains 1 to N, then value '3' belongs at index '2'
        correct_index = nums[i] - 1
        
        # If the number is valid and NOT at its correct index, swap it!
        if nums[i] != nums[correct_index]:
            # Swap the two numbers
            nums[i], nums[correct_index] = nums[correct_index], nums[i]
        else:
            # The number is correct, let's move to the next desk!
            i += 1
            
    return nums
\`\`\`

##### Java
\`\`\`java
class Solution {
    public void cyclicSort(int[] nums) {
        int i = 0;
        while (i < nums.length) {
            // Calculate the correct index for the current number
            // Value '3' belongs at index '2'
            int correctIndex = nums[i] - 1;
            
            // If the number is valid and NOT at its correct index, swap it!
            if (nums[i] != nums[correctIndex]) {
                // Swap the two numbers
                int temp = nums[i];
                nums[i] = nums[correctIndex];
                nums[correctIndex] = temp;
            } else {
                // The number is correct, let's move to the next desk!
                i++;
            }
        }
    }
}
\`\`\`

##### C++
\`\`\`cpp
class Solution {
public:
    void cyclicSort(vector<int>& nums) {
        int i = 0;
        while (i < nums.size()) {
            // Calculate the correct index for the current number
            int correctIndex = nums[i] - 1;
            
            // If the number is valid and NOT at its correct index, swap it!
            if (nums[i] != nums[correctIndex]) {
                swap(nums[i], nums[correctIndex]);
            } else {
                // The number is correct, let's move to the next desk!
                i++;
            }
        }
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function cyclicSort(nums: number[]): void {
    let i = 0;
    while (i < nums.length) {
        // Calculate the correct index for the current number
        const correctIndex = nums[i] - 1;
        
        // If the number is valid and NOT at its correct index, swap it!
        if (nums[i] !== nums[correctIndex]) {
            // Swap the two numbers
            const temp = nums[i];
            nums[i] = nums[correctIndex];
            nums[correctIndex] = temp;
        } else {
            // The number is correct, let's move to the next desk!
            i++;
        }
    }
}
\`\`\`

---

##  Problem 1: Missing Number

You are given an array containing \`n\` distinct numbers taken from the range \`0\` to \`n\`. Since the array has only \`n\` numbers out of a total of \`n + 1\` possible numbers, one number is missing. Find it!

[Visualize Missing Number in the Interactive Simulator](viz:missing-number)

### The Strategy
Notice the numbers are from \`0\` to \`n\`. This perfectly fits our Cyclic Sort pattern! 
Because the range is \`0\` to \`n\`, the number \`val\` belongs at index \`val\` (e.g., number 2 belongs at index 2).

We will sort the array using Cyclic Sort. Sometimes, we might see the number \`n\` itself. Since our array only goes up to index \`n - 1\`, the number \`n\` doesn't have a desk! If we see it, we just ignore it and move on.

After sorting, we just walk down the row of desks. The first desk that DOES NOT have the right student sitting in it is our missing number!

#### Complete Implementations

##### Python
\`\`\`python
class Solution:
    def missingNumber(self, nums: list[int]) -> int:
        i = 0
        n = len(nums)
        
        # Step 1: Cyclic Sort
        while i < n:
            correct_index = nums[i]
            # Ensure the number is within bounds and not in its correct spot
            if nums[i] < n and nums[i] != nums[correct_index]:
                nums[i], nums[correct_index] = nums[correct_index], nums[i]
            else:
                i += 1
                
        # Step 2: Find the first desk with the wrong student
        for i in range(n):
            if nums[i] != i:
                return i
                
        # If all desks are correct, the missing number is n
        return n
\`\`\`

##### Java
\`\`\`java
class Solution {
    public int missingNumber(int[] nums) {
        int i = 0;
        int n = nums.length;
        
        // Step 1: Cyclic Sort
        while (i < n) {
            int correctIndex = nums[i];
            // Ensure the number is within bounds and not in its correct spot
            if (nums[i] < n && nums[i] != nums[correctIndex]) {
                int temp = nums[i];
                nums[i] = nums[correctIndex];
                nums[correctIndex] = temp;
            } else {
                i++;
            }
        }
        
        // Step 2: Find the first desk with the wrong student
        for (i = 0; i < n; i++) {
            if (nums[i] != i) {
                return i;
            }
        }
        
        // If all desks are correct, the missing number is n
        return n;
    }
}
\`\`\`

##### C++
\`\`\`cpp
class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int i = 0;
        int n = nums.size();
        
        // Step 1: Cyclic Sort
        while (i < n) {
            int correctIndex = nums[i];
            // Ensure the number is within bounds and not in its correct spot
            if (nums[i] < n && nums[i] != nums[correctIndex]) {
                swap(nums[i], nums[correctIndex]);
            } else {
                i++;
            }
        }
        
        // Step 2: Find the first desk with the wrong student
        for (i = 0; i < n; i++) {
            if (nums[i] != i) {
                return i;
            }
        }
        
        // If all desks are correct, the missing number is n
        return n;
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function missingNumber(nums: number[]): number {
    let i = 0;
    const n = nums.length;
    
    // Step 1: Cyclic Sort
    while (i < n) {
        const correctIndex = nums[i];
        // Ensure the number is within bounds and not in its correct spot
        if (nums[i] < n && nums[i] !== nums[correctIndex]) {
            const temp = nums[i];
            nums[i] = nums[correctIndex];
            nums[correctIndex] = temp;
        } else {
            i++;
        }
    }
    
    // Step 2: Find the first desk with the wrong student
    for (i = 0; i < n; i++) {
        if (nums[i] !== i) {
            return i;
        }
    }
    
    // If all desks are correct, the missing number is n
    return n;
}
\`\`\`

---

##  Common Mistakes (The Infinite Swap Loop!)

Here are the biggest traps to avoid with Cyclic Sort:

1. **Infinite Swaps with Duplicates**: If there are duplicate numbers in the array, and you try to swap them, you will swap the exact same numbers over and over forever! **Always check \`nums[i] != nums[correct_index]\` before swapping.** This ensures you only swap if the number at the destination is different.
2. **Out of Bounds Errors**: Sometimes the array will contain numbers that don't fit into the desks (like negative numbers, or numbers larger than the array size). You MUST check \`nums[i] < nums.length\` and \`nums[i] >= 0\` (or \`> 0\` depending on 1-based indexing) before calculating the \`correct_index\` to avoid crashing your code.

---

##  Summary
* **Cyclic Sort** is a powerful trick used when numbers belong in a specific, continuous range (like 1 to N or 0 to N).
* Like a teacher fixing a seating chart, you look at a number and immediately swap it to its "correct desk".
* It runs in incredibly fast **O(n) time** without using any extra memory.
* It is the #1 tool for finding missing or duplicate numbers in a known range.

---

##  Practice Problems & Website Verifications

Verify your Cyclic Sort logic by solving these problems on our platform:
* [Missing Number](/problem/missing-number) — Find the one missing student from the seating chart!
* [Find the Duplicate Number](/problem/find-the-duplicate-number) — Two students are trying to sit at the same desk! Find out who.
`;
