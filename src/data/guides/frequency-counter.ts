export const content = `
# Frequency Counter Deep Dive Guide

## Introduction: The Halloween Candy Sorting Notebook

Imagine it is Halloween night! You and your best friend just got home with big pillowcases full of yummy treats. You want to see if your friend got the **exact same mix of candies** as you!

You have two choices to solve this mystery:

1. **The Slow Candy-by-Candy Search (Brute Force)**: You pull out a Lollipop from your bag. You reach into your friend's bag and search through every single candy one-by-one until you find a Lollipop. If you find one, you cross both off and grab a Hershey Bar, searching their bag all over again. If you both have \`N\` candies, this takes forever: up to \`N * N\` operations! In computer science, this is \`O(n^2)\` time complexity. Your candy will melt before you finish!
2. **The Candy Inventory Notebook (Frequency Counter)**: You grab a small notebook. You empty your bag and go through your candy pile *just once*, making a quick tally mark next to a drawing of each candy: \`{: 5, : 2, : 7}\`. This is super fast: \`O(n)\` linear time! Your friend does the exact same thing with their bag in another list. Finally, you just sit back and compare the two lists in your notebook. You'll be done in minutes!

In computer science, the **Frequency Counter** pattern is a neat trick where we use a notebook (like a Hash Map, a Hash Set, or a fixed-size array) to keep track of **how many times** each item appears in a collection. By using this notebook, we avoid nesting loops (\`O(n^2)\`) and instead check everything in a single, fast, linear pass (\`O(n)\`).

---

## Anatomy and Mechanics of Frequency Counting

Depending on what we are counting, we write our notebook using one of two structures:

### 1. Hash Maps (For Any Kind of Keys)
Use this when your keys are dynamic and unpredictable, like words, large numbers, or custom objects.
* **How it works**: You start with an empty map. For each item you see, you ask: *"Is this already in my map?"* If yes, you add 1 to its count. If no, you write it down with a count of 1.
* **Speed**: Super fast! Finding or updating a key takes \`O(1)\` constant time on average.

### 2. Fixed-Size Arrays (For Constrained Alphabets)
If you are only counting simple, limited things—like lowercase English letters (\`a\` to \`z\`)—you don't even need a full Hash Map. You can draw 26 chalk circles on the sidewalk, labeled 0 to 25!
* **How it works**: An array of size 26 is initialized to all zeros. You map each letter to a number index by subtracting the base character's ASCII value (e.g., \`char - 'a'\`).
* **Why it's awesome**: It uses almost zero memory, requires no complex hashing calculations, and is incredibly fast!

\`\`\`
Sidewalk Chalk Circle:   'a'    'b'    'c'   ...    'z'
Array Index Map:         0      1      2    ...     25
Candy Count:           [ 5 ]  [ 0 ]  [ 2 ]  ...   [ 1 ]
\`\`\`

---

## Operations & Complexity Profile

Here is how a frequency counter notebook beats brute force nested loops:

| Scenario / Problem | Brute Force Complexity | Frequency Counter Complexity | Auxiliary Space (Brute Force) | Auxiliary Space (Frequency Counter) |
| :--- | :--- | :--- | :--- | :--- |
| **Checking Anagrams** | O(n log n) (sorting) | O(n) | O(1) | O(k) (character set size) |
| **Finding Duplicates** | O(n^2) | O(n) | O(1) | O(n) |
| **Grouping Elements** | O(n^2 * L) | O(n * L) (L = word length) | O(1) | O(n * L) |

---

## Core Algorithmic Patterns and Templates

Let's master the three primary interview variations of the Frequency Counter pattern.

### Pattern 1: Multi-Collection Frequency Matching (Valid Anagram)

Given two strings \`S\` and \`T\`, return \`true\` if \`T\` is an anagram of \`S\` (rearranged characters), and \`false\` otherwise.

#### The Strategy
1. If the strings have different lengths, return \`false\` immediately.
2. Build a frequency tally of the characters in the first string.
3. Iterate through the second string, decrementing the counts in your tally. If a character is not in the tally or its count drops below 0, return \`false\`.
4. If the loop completes successfully, return \`true\`.

#### Complete Implementations

##### Python
\`\`\`python
def isAnagram(s: str, t: str) -> bool:
    # If the lengths are different, they cannot be anagrams
    if len(s) != len(t):
        return False
        
    # Create a frequency counter notebook
    counts = {}
    
    # Tally up every character in the first string
    for char in s:
        counts[char] = counts.get(char, 0) + 1
        
    # Check the second string against our tally
    for char in t:
        # If we see a character not in our tally, or we've seen it too many times
        if char not in counts or counts[char] == 0:
            return False
            
        # Cross off one occurrence of this character
        counts[char] -= 1
        
    # If we haven't failed by now, they are perfectly matched anagrams
    return True
\`\`\`

##### Java
\`\`\`java
public class Solution {
    public boolean isAnagram(String s, String t) {
        // If the lengths are different, they cannot be anagrams
        if (s.length() != t.length()) {
            return false;
        }
        
        // Use an array of 26 integers to tally lowercase English letters
        int[] counts = new int[26];
        
        // Tally up every character in the first string
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
        }
        
        // Check the second string against our tally
        for (int i = 0; i < t.length(); i++) {
            int idx = t.charAt(i) - 'a';
            
            // If the count drops below zero, there's a mismatch
            if (counts[idx] == 0) {
                return false;
            }
            
            // Cross off one occurrence of this character
            counts[idx]--;
        }
        
        // If we haven't failed by now, they are perfectly matched anagrams
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
        // If the lengths are different, they cannot be anagrams
        if (s.length() != t.length()) {
            return false;
        }
        
        // Use an array of 26 integers to tally lowercase English letters
        std::vector<int> counts(26, 0);
        
        // Tally up every character in the first string
        for (char c : s) {
            counts[c - 'a']++;
        }
        
        // Check the second string against our tally
        for (char c : t) {
            // If the count drops below zero, there's a mismatch
            if (counts[c - 'a'] == 0) {
                return false;
            }
            
            // Cross off one occurrence of this character
            counts[c - 'a']--;
        }
        
        // If we haven't failed by now, they are perfectly matched anagrams
        return true;
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function isAnagram(s: string, t: string): boolean {
  // If the lengths are different, they cannot be anagrams
  if (s.length !== t.length) {
    return false;
  }

  // Create a frequency counter map
  const counts = new Map<string, number>();
  
  // Tally up every character in the first string
  for (const char of s) {
    counts.set(char, (counts.get(char) || 0) + 1);
  }

  // Check the second string against our tally
  for (const char of t) {
    const currentCount = counts.get(char) || 0;
    
    // If we see a character not in our tally, or we've seen it too many times
    if (currentCount === 0) {
      return false;
    }
    
    // Cross off one occurrence of this character
    counts.set(char, currentCount - 1);
  }

  // If we haven't failed by now, they are perfectly matched anagrams
  return true;
}
\`\`\`

##### Trace Table: \`s = "anagram"\`, \`t = "nagaram"\`

| Step | Operation | Key | State of Tally | Return Status |
| :--- | :--- | :--- | :--- | :--- |
| **0** | Init | - | \`{}\` | Running |
| **1** | Add \`s[0]\` | 'a' | \`{'a': 1}\` | Running |
| **2** | Add \`s[1]\` | 'n' | \`{'a': 1, 'n': 1}\` | Running |
| **3** | Add \`s[2]\` | 'a' | \`{'a': 2, 'n': 1}\` | Running |
| **4** | Add \`s[3..6]\` | 'g', 'r', 'a', 'm' | \`{'a': 3, 'n': 1, 'g': 1, 'r': 1, 'm': 1}\` | Running |
| **5** | Dec \`t[0]\` | 'n' | \`{'a': 3, 'n': 0, 'g': 1, 'r': 1, 'm': 1}\` | Running |
| **6** | Dec \`t[1]\` | 'a' | \`{'a': 2, 'n': 0, 'g': 1, 'r': 1, 'm': 1}\` | Running |
| **7** | Dec \`t[2..6]\` | 'g', 'a', 'r', 'a', 'm' | \`{'a': 0, 'n': 0, 'g': 0, 'r': 0, 'm': 0}\` | **True** |

---

### Pattern 2: Category Hash Grouping (Group Anagrams)

Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

#### The Strategy
1. We need a way to represent the frequency "signature" of a word.
2. Since words that are anagrams share the exact same character counts, we can create a signature array of size 26 for each word, convert it to a tuple or string (e.g., \`"1,0,3,...0"\`), and use that signature as a Hash Map key.
3. Group each word under its signature list in the Hash Map, then return the map's grouped values.

#### Complete Implementations

##### Python
\`\`\`python
def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Map from character count signature to list of anagrams
    groups = {}
    
    for word in strs:
        # Create a signature array of 26 letters (a-z)
        count = [0] * 26
        for char in word:
            count[ord(char) - ord('a')] += 1
            
        # Convert list to tuple to use as dictionary key (lists are unhashable)
        signature = tuple(count)
        
        # If this is a new signature, initialize an empty list
        if signature not in groups:
            groups[signature] = []
            
        # Add the current word to its anagram group
        groups[signature].append(word)
        
    # Return all grouped anagrams
    return list(groups.values())
\`\`\`

##### Java
\`\`\`java
import java.util.*;

public class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Map from character count signature to list of anagrams
        Map<String, List<String>> groups = new HashMap<>();
        
        for (String word : strs) {
            // Create a signature array of 26 letters (a-z)
            int[] count = new int[26];
            for (char c : word.toCharArray()) {
                count[c - 'a']++;
            }
            
            // Build signature string: "#1#0#2..." so it can be a Hash Map key
            StringBuilder sb = new StringBuilder();
            for (int val : count) {
                sb.append('#').append(val);
            }
            String signature = sb.toString();
            
            // If this is a new signature, initialize an empty list
            if (!groups.containsKey(signature)) {
                groups.put(signature, new ArrayList<>());
            }
            
            // Add the current word to its anagram group
            groups.get(signature).add(word);
        }
        
        // Return all grouped anagrams
        return new ArrayList<>(groups.values());
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <vector>
#include <string>
#include <unordered_map>

class Solution {
public:
    std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
        // Map from character count signature to list of anagrams
        std::unordered_map<std::string, std::vector<std::string>> groups;
        
        for (const std::string& word : strs) {
            // Create a signature array of 26 letters (a-z)
            std::vector<int> count(26, 0);
            for (char c : word) {
                count[c - 'a']++;
            }
            
            // Build signature key so it can be used in the hash map
            std::string signature = "";
            for (int val : count) {
                signature += "#" + std::to_string(val);
            }
            
            // Add the current word to its anagram group
            groups[signature].push_back(word);
        }
        
        // Return all grouped anagrams
        std::vector<std::vector<std::string>> result;
        for (auto& pair : groups) {
            result.push_back(pair.second);
        }
        return result;
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function groupAnagrams(strs: string[]): string[][] {
  // Map from character count signature to list of anagrams
  const groups = new Map<string, string[]>();

  for (const word of strs) {
    // Create a signature array of 26 letters (a-z)
    const count = new Array(26).fill(0);
    for (let i = 0; i < word.length; i++) {
      count[word.charCodeAt(i) - 97]++; // 'a' is ASCII 97
    }

    // Convert list to a comma-separated string to use as a Map key
    const signature = count.join(',');
    
    // If this is a new signature, initialize an empty list
    if (!groups.has(signature)) {
      groups.set(signature, []);
    }
    
    // Add the current word to its anagram group
    groups.get(signature)!.push(word);
  }

  // Return all grouped anagrams
  return Array.from(groups.values());
}
\`\`\`

---

## Common Interview Pitfalls and Debugging Strategies

Frequency counters are highly efficient but can break due to language-specific map behaviors:

### 1. Key Conversion / Comparison Failures
* **The Pitfall**: In JavaScript/TypeScript, using an array as a map key checks reference identity, not content. Thus, \`map.set([1, 2], 'val')\` and \`map.get([1, 2])\` will return \`undefined\` because the two arrays have different memory references.
* **The Solution**: Always convert your array or object signatures into primitive data structures (like a string or comma-separated list: \`count.join(',')\`) when using them as keys in JavaScript/TypeScript. In Python, use immutable tuples: \`tuple(count)\`.

### 2. Missing Defaults on Map Retrievals
* **The Pitfall**: Trying to increment a count for a key that does not exist in the map yet, causing null pointer references or NaN errors.
* **The Solution**: Always utilize fallback accessors: \`counts[char] = counts.get(char, 0) + 1\` in Python/Java, or check membership before updating: \`counts.set(char, (counts.get(char) || 0) + 1)\` in TS/JS.

---

[Visualize Top K Frequent Elements in the Interactive Simulator](viz:top-k-frequent-elements)

## Practice Problems & Website Verifications

Verify your frequency counter implementations with these interactive challenges:
* [Valid Anagram](/problem/valid-anagram) — Standard element count matching.
* [Two Sum](/problem/two-sum) — Single pass dictionary index caching.
* [Group Anagrams](/problem/group-anagrams) — Count array signature mapping.
* [Top K Frequent Elements](/problem/top-k-frequent-elements) — Frequency counting with bucket-sort distribution.
`;
