export const content = `
# Merge Sort: Divide and Conquer!

##  Introduction: The Giant Stack of Cards

Imagine you have a giant stack of 100 messy, completely unorganized playing cards, and your job is to sort them from smallest to largest. If you try to look at all 100 cards at once, your brain will hurt!

But what if you use a clever trick called **Divide and Conquer**?

Here is the trick:
1. **Divide (Split):** You cut the giant stack of 100 cards exactly in half. Now you have two stacks of 50. Still too big? Cut them in half again! Now you have four stacks of 25. You keep chopping the stacks in half until you have 100 tiny stacks, and each stack has exactly **1 card** in it.
2. **Conquer (Base Case):** Ask yourself: Is a stack with only 1 card sorted? YES! A single card is always perfectly sorted.
3. **Combine (Merge):** Now, the magic happens. You take two tiny stacks (1 card each) and **merge** them together into a sorted stack of 2 cards. Then, you take two sorted stacks of 2 cards, and merge them into a sorted stack of 4 cards. You keep zipping these sorted stacks together until you are back to one giant, perfectly sorted stack of 100 cards!

This super-fast, incredibly reliable trick is called **Merge Sort**.

---

##  What Exactly IS Merge Sort?

Merge Sort is a classic **sorting algorithm** that uses the power of Recursion. It follows the "Divide and Conquer" strategy. 

Instead of trying to sort a massive array all at once, it breaks the array down into microscopic pieces (arrays of size 1), and then builds it back up by carefully zipping (merging) the small sorted arrays together.

---

##  Why Do We Need To Learn It?

If you ever see a problem that says:
* *"Sort this array in $O(n \\log n)$ time"*
* *"Merge two sorted lists"*
* *"Count the number of inversions in an array"*

...then **Merge Sort** or its helper function (the \`merge\` step) is exactly what you need! 

While simple sorting loops (like Bubble Sort or Insertion Sort) get incredibly slow when you have a million items (they take $O(n^2)$ time), Merge Sort easily handles massive amounts of data because it runs in a blazing fast **$O(n \\log n)$ time**!

---

##  The Two Magical Steps of Merge Sort

Every Merge Sort algorithm has two main parts:

### 1. The \`mergeSort\` Function (The Chopper)
This function is a Recursive function. Its only job is to chop the array in half, cast the \`mergeSort\` magic spell on the left half, cast it on the right half, and then hand the two sorted halves to the \`merge\` helper function.
* **The Base Case:** If the array has 1 or 0 elements, just return it. It is already sorted!

### 2. The \`merge\` Function (The Zipper)
This is the real workhorse. It takes two arrays that are *already sorted* and zips them together into one big sorted array. It does this by pointing a finger at the start of both arrays, comparing the two numbers, and taking the smaller one.

---

##  Let's Look at Some Code! (The Merge Sort Template)

Here is how you implement Merge Sort to sort an array of numbers. Notice how we use a helper function to do the merging!

#### Complete Implementations

##### Python
\`\`\`python
def merge_sort(nums: list[int]) -> list[int]:
    # Rule 1: The Base Case (The Tiniest Stack)
    if len(nums) <= 1:
        return nums
        
    # The Chopper: Find the middle and split the array
    mid = len(nums) // 2
    left_half = merge_sort(nums[:mid])
    right_half = merge_sort(nums[mid:])
    
    # The Zipper: Merge the two sorted halves
    return merge(left_half, right_half)

def merge(left: list[int], right: list[int]) -> list[int]:
    sorted_array = []
    i = 0  # Finger for the left array
    j = 0  # Finger for the right array
    
    # Compare elements from both arrays and take the smaller one
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            sorted_array.append(left[i])
            i += 1
        else:
            sorted_array.append(right[j])
            j += 1
            
    # If there are leftovers in the left array, grab them all
    while i < len(left):
        sorted_array.append(left[i])
        i += 1
        
    # If there are leftovers in the right array, grab them all
    while j < len(right):
        sorted_array.append(right[j])
        j += 1
        
    return sorted_array
\`\`\`

##### Java
\`\`\`java
class Solution {
    public int[] sortArray(int[] nums) {
        // Base Case
        if (nums.length <= 1) return nums;
        
        // The Chopper
        int mid = nums.length / 2;
        int[] left = Arrays.copyOfRange(nums, 0, mid);
        int[] right = Arrays.copyOfRange(nums, mid, nums.length);
        
        return merge(sortArray(left), sortArray(right));
    }
    
    private int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        
        // The Zipper
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }
        
        // Grab leftovers
        while (i < left.length) result[k++] = left[i++];
        while (j < right.length) result[k++] = right[j++];
        
        return result;
    }
}
\`\`\`

##### C++
\`\`\`cpp
class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        if (nums.size() <= 1) return nums;
        
        int mid = nums.size() / 2;
        vector<int> left(nums.begin(), nums.begin() + mid);
        vector<int> right(nums.begin() + mid, nums.end());
        
        left = sortArray(left);
        right = sortArray(right);
        
        return merge(left, right);
    }
    
private:
    vector<int> merge(const vector<int>& left, const vector<int>& right) {
        vector<int> result;
        int i = 0, j = 0;
        
        while (i < left.size() && j < right.size()) {
            if (left[i] <= right[j]) {
                result.push_back(left[i++]);
            } else {
                result.push_back(right[j++]);
            }
        }
        
        while (i < left.size()) result.push_back(left[i++]);
        while (j < right.size()) result.push_back(right[j++]);
        
        return result;
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function sortArray(nums: number[]): number[] {
    // Base Case
    if (nums.length <= 1) return nums;
    
    // The Chopper
    const mid = Math.floor(nums.length / 2);
    const left = sortArray(nums.slice(0, mid));
    const right = sortArray(nums.slice(mid));
    
    return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    
    // The Zipper
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    // Grab leftovers
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }
    
    return result;
}
\`\`\`

---

##  Problem 1: Merge Two Sorted Lists

The most common real-world use of the Merge Sort concept is the \`merge\` helper function itself! Often, you will be given two separate lists that are already sorted, and asked to combine them into one.

[Visualize Merge Two Sorted Lists in the Interactive Simulator](viz:merge-two-sorted-lists)

### The Strategy
We don't need the "Chopper" step here because the lists are already separated and sorted. We just need the "Zipper"! 

We use a "Dummy Node" to hold the start of our new merged list. Then, we look at the heads of both lists. Whoever is smaller gets attached to our merged list, and we move that list's pointer forward.

#### Complete Implementations

##### Python
\`\`\`python
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        # Create a dummy node to act as the start of our new zipper list
        dummy = ListNode()
        tail = dummy
        
        # While both lists still have nodes to compare
        while list1 and list2:
            if list1.val < list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
            
        # If one list ran out, attach all the leftovers of the other list
        if list1:
            tail.next = list1
        elif list2:
            tail.next = list2
            
        # Return the actual start of the merged list
        return dummy.next
\`\`\`

##### Java
\`\`\`java
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Create a dummy node to act as the start of our new zipper list
        ListNode dummy = new ListNode();
        ListNode tail = dummy;
        
        // While both lists still have nodes to compare
        while (list1 != null && list2 != null) {
            if (list1.val < list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }
        
        // If one list ran out, attach all the leftovers of the other list
        if (list1 != null) {
            tail.next = list1;
        } else if (list2 != null) {
            tail.next = list2;
        }
        
        // Return the actual start of the merged list
        return dummy.next;
    }
}
\`\`\`

---

##  Common Mistakes (The Infinite Recursion Monster!)

Here are the biggest traps to avoid when writing Merge Sort:

1. **Forgetting the Base Case**: Just like in our Recursion guide, if you forget \`if (len <= 1) return;\`, your computer will try to chop arrays in half forever until it crashes with a Stack Overflow!
2. **Missing the Leftovers**: In the \`merge\` zipper function, the \`while\` loop stops as soon as *one* of the arrays runs out of numbers. You MUST remember to write the extra \`while\` loops at the end to grab any leftover numbers from the other array!
3. **Space Complexity**: Merge Sort is incredibly fast ($O(n \\log n)$), but because it creates new arrays during the "Zipper" phase, it requires $O(n)$ extra memory (Space Complexity).

---

##  Summary
* **Merge Sort** uses "Divide and Conquer" to chop a huge problem into tiny, easy pieces.
* It uses a Recursive **Chopper** to split the array down to single elements.
* It uses a **Zipper** helper function to merge sorted halves back together.
* It runs in blazing fast **$O(n \\log n)$ time**.

---

##  Practice Problems & Website Verifications

Verify your Merge Sort logic by solving these problems on our platform:
* [Sort an Array](/problem/sort-an-array) — Practice the full Merge Sort template from scratch.
* [Merge Two Sorted Lists](/problem/merge-two-sorted-lists) — Master the "Zipper" step using Linked Lists!
`;
