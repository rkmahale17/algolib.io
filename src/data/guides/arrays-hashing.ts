export const content = `
# Arrays & Hashing Deep Dive

## Introduction: The Magic Toybox and the Label Maker

Imagine you have a **giant toy playroom** with 10,000 secret colorful cubbies. You have thousands of toys: action figures, teddy bears, puzzle pieces, and crayons. One sunny afternoon, you want to find your favorite **"Shiny Red Toy Robot"**. 

How would you find it? You have two choices:

1. **The Long Slow Walk (Linear Search)**: You walk down the room, opening cubby #1, then cubby #2, then cubby #3, checking every single box. If your robot is in the very last cubby (cubby #10,000), you will have taken 10,000 steps! In computer science, this is called an \`O(n)\` search. It works, but it's super slow and makes your feet tired!
2. **The Magic Label Maker (Hash Map)**: You walk up to a friendly magical robot sitting at a desk. You type the word **"Shiny Red Toy Robot"** into its magic label maker keyboard. The machine does a silly sound (*beep-boop-bop!*) and prints: *"Go to Cubby #42!"*. You walk straight to Cubby #42, open it, and pull out your robot! You found it in just one step! This is a **Hash Table** (or Hash Map) approach, achieving \`O(1)\` constant lookup time.

The magical keyboard uses a secret mathematical recipe called a **Hash Function**. It takes any word (like "Shiny Red Toy Robot") and turns it into a secret cubby number (like 42) so you can store and retrieve your toys instantly!

In this guide, we will explore how these toy cubbies work, how they solve tricky problems, and how they help us build super fast programs.

---

## Anatomy of Arrays

Before we look at the magic keyboard, we must understand the fundamental data structure that lies underneath it: the **Array**.

An array is a row of toy cubbies glued together in a single straight line.

\`\`\`
Memory Address:  [ 1000 ]   [ 1004 ]   [ 1008 ]   [ 1012 ]   [ 1016 ]
Array Index:         0          1          2          3          4
Toy Value:         [  ]     [  ]     [  ]     [  ]     [   ]
\`\`\`

### 1. Static Arrays (The Glued Wood Cubbies)
A **Static Array** is like a row of toy cubbies made of solid wood that can never change its size.
* **Random Access**: Because the cubbies are glued side-by-side, the computer can instantly jump to any cubby index. If each cubby is 4 inches wide, to look at cubby #3, the computer does a quick math: \`Start Address + (Index * Width)\`. For index 3: \`1000 + (3 * 4) = 1012\`. This calculation takes a tiny fraction of a second: \`O(1)\` time!
* **Insertion and Deletion**: Adding or removing toys in the middle is slow. If you want to squeeze a new toy into Cubby #1, you must first move the toy in Cubby #1 to Cubby #2, the toy in Cubby #2 to Cubby #3, and so on, to make room! Shifting all those toys takes linear time: \`O(n)\`.

\`\`\`array
[10, 20, 30, 40, 50]
\`\`\`

### 2. Dynamic Arrays (The Stretchy Cubbies)
Since solid wood cubbies cannot grow, modern programming languages give us **Dynamic Arrays** (like Python lists or JavaScript arrays).
* **Under the Hood**: A dynamic array starts as a small static array. When you add too many toys and run out of space, the computer magically creates a **brand new set of cubbies that is twice as large**, copies all your old toys into the new cubbies, and throws the old set away!
* **Amortized Complexity**: Even though copying \`N\` toys takes \`O(n)\` time, this resizing double-growth doesn't happen very often. On average, adding a new toy to the end of the dynamic array still takes constant time: \`O(1)\`. We call this **Amortized Constant Time**.

---

## Anatomy of Hash Maps and Hash Sets

A **Hash Map** is a magical chest of drawers that stores **{Key: Value}** pairs (like \`{"Shiny Red Toy Robot": "Cubby #42"}\`). Under the hood, a Hash Map is simply a large array of drawers. To find out which drawer a key belongs to, we use our magic keyboard (the Hash Function).

\`\`\`
Toy Name ("apple") ---> [ Magic Label Maker ] ---> Secret Code (98234) ---> [ Modulo Table Size (10) ] ---> Drawer #4
\`\`\`

### 1. Hash Functions
Our magic label maker has to follow three golden rules:
1. **Deterministic**: If you type "apple" today, tomorrow, or next year, it must *always* give you the exact same drawer number.
2. **Fast**: It shouldn't take hours to compute the number. It must run instantly: \`O(1)\` time.
3. **Uniform Distribution**: It should spread toys evenly across all drawers so drawers don't get messy and overcrowded.

### 2. Collision Resolution (Drawer Traffic Jams!)
Sometimes, two different toys (like "apple" and "orange") are typed into the machine, and the mathematical formula gives them the **exact same drawer number** (e.g. Drawer #4). This is called a **Collision**!

We have two clever ways to solve collisions:
* **Separate Chaining (Open Hashing)**: Each drawer has a hanging chain of little plastic baggies. If "apple" and "orange" both land in Drawer #4, we put them both in baggies and chain them together inside Drawer #4:
  \`\`\`
  Drawer 0: empty
  Drawer 1: [ "apple":  ] -> [ "orange":  ] -> empty
  Drawer 2: empty
  \`\`\`
* **Open Addressing (Closed Hashing)**: All elements must go directly into their own drawer. If Drawer #4 is already taken by the "apple", the "orange" goes looking for another empty drawer using a specific path:
  * *Linear Probing*: Look at Drawer #5, then Drawer #6, then Drawer #7, until an empty drawer is found.
  * *Quadratic Probing*: Look at Drawer #5 (1 step away), then Drawer #8 (4 steps away), then Drawer #13 (9 steps away).
  * *Double Hashing*: Type the toy's name into a second magic keyboard to find a custom step size!

### 3. Load Factor and Re-hashing (Time to Get a Bigger Chest of Drawers)
If you stuff too many toys into your chest of drawers, it gets crowded, collisions happen constantly, and searching for a toy becomes slow (\`O(n)\`). We measure how full the chest is using the **Load Factor**:
\`\`\`
Load Factor (λ) = (Number of toys stored) / (Total number of drawers)
\`\`\`

When the chest is more than **75% full** (λ > 0.75), the chest magically doubles its number of drawers! The magic machine then re-calculates new drawer numbers for all your toys and moves them to their new homes. This is called **Re-hashing**.

### 4. Hash Set vs. Hash Map
* A **Hash Map** stores pairs of \`{Key: Value}\`. You use this when you want to retrieve a secret package (Value) using a label (Key).
* A **Hash Set** stores only \`Keys\` with no values at all. You use this to quickly check: *"Have I seen this toy before?"* in \`O(1)\` time!

---
--

## Detailed Operations & Time Complexities

Here is the comparison of time complexities across different array and hash configurations:

| Operation | Array (Unsorted) | Array (Sorted) | Hash Map (Average Case) | Hash Map (Worst Case - Collisions) |
| :--- | :--- | :--- | :--- | :--- |
| **Access by Index** | O(1) | O(1) | N/A | N/A |
| **Search by Key/Value** | O(n) | O(log n) (Binary Search) | O(1) | O(n) |
| **Insert at End** | O(1) (Amortized) | O(n) | O(1) (Amortized) | O(n) |
| **Insert in Middle** | O(n) | O(n) | O(1) | O(n) |
| **Delete** | O(n) | O(n) | O(1) | O(n) |

---

## Core Algorithmic Patterns and Templates

Mastering arrays and hashing relies on three patterns:

### Pattern 1: Frequency Counters
When you need to compare two groups of items, count occurrences, or find duplicates, do not use nested loops. Instead, iterate through the collection once and store the counts of each item in a Hash Map. This reduces the complexity from \`O(n^2)\` to \`O(n)\` time.

#### Valid Anagram
Given two strings \`S\` and \`T\`, return \`true\` if \`T\` is an anagram of \`S\`, and \`false\` otherwise.

[Visualize Valid Anagram in the Interactive Simulator](viz:valid-anagram)

##### Python
\`\`\`python
def is_anagram(s: str, t: str) -> bool:
    # If the strings have different lengths, they cannot be anagrams
    if len(s) != len(t):
        return False
    
    # Hash maps to store the character counts for both strings
    count_s, count_t = {}, {}
    
    # Iterate through both strings simultaneously
    for i in range(len(s)):
        # Increment the count for the character from string 's'
        count_s[s[i]] = count_s.get(s[i], 0) + 1
        
        # Increment the count for the character from string 't'
        count_t[t[i]] = count_t.get(t[i], 0) + 1
        
    # Python dictionaries can be compared directly for equality
    return count_s == count_t
\`\`\`

##### Java
\`\`\`java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    public boolean isAnagram(String s, String t) {
        // If lengths differ, it's impossible to be an anagram
        if (s.length() != t.length()) {
            return false;
        }
        
        // Maps to hold frequency of each character
        Map<Character, Integer> countS = new HashMap<>();
        Map<Character, Integer> countT = new HashMap<>();
        
        for (int i = 0; i < s.length(); i++) {
            // Get characters at the current index
            char charS = s.charAt(i);
            char charT = t.charAt(i);
            
            // Update counts for string 's'
            countS.put(charS, countS.getOrDefault(charS, 0) + 1);
            
            // Update counts for string 't'
            countT.put(charT, countT.getOrDefault(charT, 0) + 1);
        }
        
        // HashMap's equals() method compares all keys and values
        return countS.equals(countT);
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <string>
#include <unordered_map>

class Solution {
public:
    bool isAnagram(std::string s, std::string t) {
        // Guard against mismatched lengths
        if (s.length() != t.length()) {
            return false;
        }
        
        // Unordered maps for character frequencies
        std::unordered_map<char, int> countS;
        std::unordered_map<char, int> countT;
        
        for (int i = 0; i < s.length(); ++i) {
            // Increment the frequency of characters at index 'i'
            countS[s[i]]++;
            countT[t[i]]++;
        }
        
        // Unordered maps support direct equality comparison in C++
        return countS == countT;
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function isAnagram(s: string, t: string): boolean {
  // Guard clause for length mismatch
  if (s.length !== t.length) {
    return false;
  }

  // Maps to record the frequency of each character
  const countS = new Map<string, number>();
  const countT = new Map<string, number>();

  for (let i = 0; i < s.length; i++) {
    // Add or update the character count for string 's'
    countS.set(s[i], (countS.get(s[i]) || 0) + 1);
    
    // Add or update the character count for string 't'
    countT.set(t[i], (countT.get(t[i]) || 0) + 1);
  }

  // In TypeScript/JavaScript, Maps cannot be compared with \`===\`.
  // We must verify that all keys and values in countS match countT.
  if (countS.size !== countT.size) return false;
  
  for (const [char, count] of countS) {
    if (countT.get(char) !== count) {
      return false;
    }
  }

  return true;
}
\`\`\`

##### Trace Table of Character Counts for \`s = "rat"\`, \`t = "car"\`
*Length check passes (both are length 3).*

| Step | Index | s[i] | t[i] | count_s state | count_t state |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0** | - | - | - | \`{}\` | \`{}\` |
| **1** | 0 | 'r' | 'c' | \`{'r': 1}\` | \`{'c': 1}\` |
| **2** | 1 | 'a' | 'a' | \`{'r': 1, 'a': 1}\` | \`{'c': 1, 'a': 1}\` |
| **3** | 2 | 't' | 'r' | \`{'r': 1, 'a': 1, 't': 1}\` | \`{'c': 1, 'a': 1, 'r': 1}\` |

*After loop, \`count_s == count_t\` comparison is executed. Since \`count_s\` has key 't' (which \`count_t\` lacks) and \`count_t\` has key 'c', the comparison returns \`False\`.*

---

### Pattern 2: The Complement Lookup (Two-Sum)
When searching for a pair of numbers that satisfy an equation (like \`A + B = Target\`), you can rewrite the equation as \`B = Target - A\`. 
As you iterate through the array, treat the current element as \`A\`. Calculate the complement \`B\` and check if you have already stored \`B\` in your Hash Map. If yes, you have found the pair. If no, add \`A\` to the Hash Map.

[Visualize Two Sum in the Interactive Simulator](viz:two-sum)

#### Two Sum
Find the indexes of the two numbers that add up to \`target\`.

##### Python
\`\`\`python
def two_sum(nums: List[int], target: int) -> List[int]:
    # Dictionary to store the value as the key and its index as the value
    seen = {}
    
    for i, num in enumerate(nums):
        # Calculate the complement we need to reach the target
        complement = target - num
        
        # If the complement is already in our dictionary, we found a valid pair
        if complement in seen:
            return [seen[complement], i]
            
        # Otherwise, record the current number and its index for future numbers to check against
        seen[num] = i
        
    return []
\`\`\`

##### Java
\`\`\`java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // HashMap to store the numbers we've seen and their original indices
        Map<Integer, Integer> seen = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            // The value we need to find to sum up to the target
            int complement = target - nums[i];
            
            // Check if we've encountered the required complement before
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            
            // Record the current number and index into the map
            seen.put(nums[i], i);
        }
        
        return new int[0];
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Hash map for O(1) lookups of complement values
        std::unordered_map<int, int> seen;
        
        for (int i = 0; i < nums.size(); ++i) {
            // What number do we need to reach the target?
            int complement = target - nums[i];
            
            // If the complement is in the map, return both indices
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            
            // Record the current value and index
            seen[nums[i]] = i;
        }
        return {};
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function twoSum(nums: number[], target: number): number[] {
  // Map stores value -> index
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    // The value we need to find to sum up to the target
    const complement = target - nums[i];
    
    // Check if we've seen the complement before
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    
    // Add current number and its index to the map
    seen.set(nums[i], i);
  }

  return [];
}
\`\`\`

##### Trace Table for \`nums = [3, 2, 4]\`, \`target = 6\`

| Step | Index | Num | Complement Calculation | Complement in Map? | Action | Map State (Val -> Index) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **0** | - | - | - | - | Initial Setup | \`{}\` |
| **1** | 0 | 3 | \`6 - 3 = 3\` | No | Add 3 to Map | \`{3: 0}\` |
| **2** | 1 | 2 | \`6 - 2 = 4\` | No | Add 2 to Map | \`{3: 0, 2: 1}\` |
| **3** | 2 | 4 | \`6 - 4 = 2\` | Yes! Index is 1 | Return \`[1, 2]\` | \`{3: 0, 2: 1}\` |

---

### Pattern 3: Prefix Sum and Map Coordination
This pattern tracks a running sum (cumulative sum) as we traverse an array. By combining this running sum with a Hash Map that stores \`{Prefix Sum: Index}\`, we can find subarrays that sum to a specific value \`K\` in \`O(n)\` time.

The logic is: if the difference between our current prefix sum and a past prefix sum is equal to \`K\`, then the subarray between those two points must sum to \`K\`.
\`\`\`
Current Sum - Past Sum = K  ==>  Past Sum = Current Sum - K
\`\`\`

#### Subarray Sum Equals K

[Visualize Prefix Sum in the Interactive Simulator](viz:prefix-sum)

##### Python
\`\`\`python
def subarray_sum(nums: List[int], k: int) -> int:
    count = 0
    current_sum = 0
    # Dictionary to store the frequency of each prefix sum we've seen.
    # Base case: a prefix sum of 0 has been seen exactly once (empty subarray).
    prefix_sums = {0: 1}
    
    for num in nums:
        # Update the running sum with the current element.
        current_sum += num
        
        # We want to find if there was a past prefix sum such that:
        # current_sum - past_sum = k
        # Which algebraically means: past_sum = current_sum - k
        difference = current_sum - k
        
        # If we have seen this past prefix sum, it means the subarray between
        # that past point and our current point exactly sums up to 'k'.
        if difference in prefix_sums:
            # Add the number of times we've seen this past sum to our total count.
            count += prefix_sums[difference]
            
        # Record the current prefix sum into our dictionary for future elements to use.
        prefix_sums[current_sum] = prefix_sums.get(current_sum, 0) + 1
        
    return count
\`\`\`

##### Java
\`\`\`java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    public int subarraySum(int[] nums, int k) {
        int count = 0;
        int currentSum = 0;
        
        // HashMap to track the frequencies of prefix sums.
        Map<Integer, Integer> prefixSums = new HashMap<>();
        
        // Base case: a prefix sum of 0 is seen exactly once initially.
        prefixSums.put(0, 1);
        
        for (int num : nums) {
            // Update the running total.
            currentSum += num;
            
            // Calculate the prefix sum we need to have seen in the past
            // in order for the current subarray to sum to k.
            int difference = currentSum - k;
            
            // If the required past prefix sum exists, add its frequency to our answer count.
            if (prefixSums.containsKey(difference)) {
                count += prefixSums.get(difference);
            }
            
            // Add the current prefix sum to the map, incrementing its count.
            prefixSums.put(currentSum, prefixSums.getOrDefault(currentSum, 0) + 1);
        }
        
        return count;
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <vector>
#include <unordered_map>

class Solution {
public:
    int subarraySum(std::vector<int>& nums, int k) {
        int count = 0;
        int currentSum = 0;
        
        // Unordered map for O(1) average time lookups of prefix sum frequencies.
        std::unordered_map<int, int> prefixSums;
        
        // Initialize base case: prefix sum 0 has occurred 1 time.
        prefixSums[0] = 1;
        
        for (int num : nums) {
            // Continuously add elements to our running sum.
            currentSum += num;
            
            // The required past sum that would make the difference equal to k.
            int difference = currentSum - k;
            
            // Check if we have previously encountered this exact prefix sum.
            if (prefixSums.find(difference) != prefixSums.end()) {
                // Increment our count by the number of times this past sum occurred.
                count += prefixSums[difference];
            }
            
            // Update the frequency of our current running sum.
            prefixSums[currentSum]++;
        }
        
        return count;
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function subarraySum(nums: number[], k: number): number {
  let count = 0;
  let currentSum = 0;
  
  // Map stores frequency of each prefix sum.
  const prefixSums = new Map<number, number>();
  
  // Base case: a sum of 0 is seen once before processing any elements.
  prefixSums.set(0, 1);
  
  for (const num of nums) {
    // Add current element to the cumulative sum.
    currentSum += num;
    
    // We want: currentSum - pastSum = k
    // Therefore: pastSum = currentSum - k
    const difference = currentSum - k;
    
    // If we've seen this 'pastSum' before, valid subarrays exist!
    if (prefixSums.has(difference)) {
      // Increase our answer by the number of valid past subarrays.
      count += prefixSums.get(difference)!;
    }
    
    // Record the current sum for future elements to use.
    prefixSums.set(currentSum, (prefixSums.get(currentSum) || 0) + 1);
  }
  
  return count;
}
\`\`\`

---

## Complete Implementations: Valid Anagram

Here is the code to check if two strings are anagrams of each other:

##### Python
\`\`\`python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # If lengths differ, they cannot be anagrams
        if len(s) != len(t):
            return False
        
        # Hash map to count character frequencies
        count = {}
        
        # Build frequency map for the first string
        for char in s:
            count[char] = count.get(char, 0) + 1
            
        # Decrement counts using the second string
        for char in t:
            # If char is missing or count drops below 0, not an anagram
            if char not in count or count[char] == 0:
                return False
            count[char] -= 1
            
        return True
\`\`\`

##### Java
\`\`\`java
import java.util.HashMap;

public class Solution {
    public boolean isAnagram(String s, String t) {
        // If lengths differ, they cannot be anagrams
        if (s.length() != t.length()) {
            return false;
        }
        
        // Use an array of size 26 for constant space O(1) character counting
        int[] counts = new int[26]; 
        
        // Increment for string s and decrement for string t
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
            counts[t.charAt(i) - 'a']--;
        }
        
        // If all counts are zero, the strings are anagrams
        for (int count : counts) {
            if (count != 0) {
                return false;
            }
        }
        return true;
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <string>
#include <vector>

class Solution {
public:
    bool isAnagram(std::string s, std::string t) {
        // If lengths differ, they cannot be anagrams
        if (s.length() != t.length()) {
            return false;
        }
        
        // Track frequencies of 26 lowercase English letters
        int counts[26] = {0};
        
        // Tally up characters from s, and subtract characters from t
        for (int i = 0; i < s.length(); ++i) {
            counts[s[i] - 'a']++;
            counts[t[i] - 'a']--;
        }
        
        // Check if any character count is unbalanced
        for (int count : counts) {
            if (count != 0) {
                return false;
            }
        }
        return true;
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function isAnagram(s: string, s2: string): boolean {
  // If lengths differ, they cannot be anagrams
  if (s.length !== s2.length) {
    return false;
  }

  // Hash map to count occurrences of each character
  const charCounts = new Map<string, number>();

  // Count characters in the first string
  for (const char of s) {
    charCounts.set(char, (charCounts.get(char) || 0) + 1);
  }

  // Subtract counts using the second string
  for (const char of s2) {
    // If char doesn't exist or is already 0, strings don't match
    if (!charCounts.has(char) || charCounts.get(char) === 0) {
      return false;
    }
    charCounts.set(char, charCounts.get(char)! - 1);
  }

  return true;
}
\`\`\`

---

## Complete Implementations: Two Sum

Here is the code to solve the Two Sum problem using a Hash Map:

##### Python
\`\`\`python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Hash map to store the value and its index
        seen = {}
        
        # Iterate through the array once (O(n) time)
        for i, num in enumerate(nums):
            # The number we need to reach the target
            complement = target - num
            
            # If the complement is already in the map, we found our pair!
            if complement in seen:
                return [seen[complement], i]
            
            # Otherwise, add the current number and its index to the map
            seen[num] = i
            
        return []
\`\`\`

##### Java
\`\`\`java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Hash map to store previously seen numbers and their indices
        Map<Integer, Integer> seen = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            // Calculate the required complement for the current number
            int complement = target - nums[i];
            
            // Check if we have already encountered the complement
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            
            // Store the current number and index for future lookups
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Hash map for O(1) lookups of complement values
        std::unordered_map<int, int> seen;
        
        for (int i = 0; i < nums.size(); ++i) {
            // What number do we need to reach the target?
            int complement = target - nums[i];
            
            // If the complement is in the map, return both indices
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            
            // Record the current value and index
            seen[nums[i]] = i;
        }
        return {};
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function twoSum(nums: number[], target: number): number[] {
  // Map stores value -> index
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    // The value we need to find to sum up to the target
    const complement = target - nums[i];
    
    // Check if we've seen the complement before
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    
    // Add current number and its index to the map
    seen.set(nums[i], i);
  }

  return [];
}
\`\`\`

## Common Interview Pitfalls and Debugging Strategies

Avoid these typical mistakes during interviews:

### 1. Modifying a Key While It Is in a Hash Map
* **The Problem**: You cannot locate an object in the Hash Map even though it was just added.
* **Why it happens**: If you use a mutable object (like a list or custom class) as a key, and change its internal value, its hash code changes. The Hash Map will now look for it in a different bucket, making it unretrievable.
* **The Fix**: Only use **immutable** data types (strings, numbers, tuples) as keys.

### 2. Using JavaScript Objects as Maps
* **The Problem**: Unexpected key properties or keys casting to string representations.
* **Why it happens**: Plain JS objects (\`{}\`) automatically cast all keys to strings (e.g. a key of number \`5\` becomes string \`"5"\`, and a key of an object becomes \`"[object Object]"\`). Additionally, plain objects inherit properties from the prototype chain.
* **The Fix**: Always use the native \`Map\` or \`Set\` constructors in JS/TS for key-value logic, as they support any data type as keys and have no default prototype collisions.

---

## Practice Problems & Website Verifications

Verify your arrays and hashing knowledge with these interactive problems:
* [Two Sum](/problem/two-sum) — Match values in a single pass using a target check.
* [Valid Anagram](/problem/valid-anagram) — Compare frequency structures of two text strings.
* [Group Anagrams](/problem/group-anagrams) — Hash sorted words to group anagram buckets.
* [Longest Consecutive Sequence](/problem/longest-consecutive-sequence) — Use a Hash Set for instant lookup intervals.
`;

