/**
 * platformPreviewData.ts
 * Pre-parsed Two Sum algorithm data for the interactive platform preview on the home page.
 * Data sourced from exmple.json (Supabase export) — stored directly as TS to avoid
 * runtime JSON.parse() failures on truncated strings.
 */

export const platformPreviewData = {
    id: "two-sum",
    name: "Two Sum",
    title: "Two Sum",
    category: "Array",
    difficulty: "intermediate",
    description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nExample 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\nConstraints:\n• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.",
    explanation: {
        io: [
            { input: " nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]" },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "" },
            { input: "nums = [3,3], target = 6", output: " [0,1]", explanation: "" },
        ],
        note: "Follow-up: Can you come up with an algorithm that is less than O(n2) time complexity?",
        tips: "<ul>\n  <li>Use a hashmap to achieve O(1) average lookup time and overall O(n) complexity.</li>\n  <li>Store indices as values in the hashmap so they can be returned immediately.</li>\n  <li>Always check for the complement before inserting the current number to avoid using the same index twice.</li>\n  <li>Be careful with duplicate values; the algorithm handles them naturally when implemented correctly.</li>\n  <li>For performance-critical systems, avoid nested loops—they increase complexity to O(n²).</li>\n  <li>Write tests that include edge cases such as empty arrays, negatives, and duplicates.</li>\n</ul>\n",
        steps: "<ol>\n  <li>Initialize an empty hashmap <code>seen = {}</code> to store value → index mappings.</li>\n  <li>Iterate over the array with index <code>i</code> and value <code>v</code>.</li>\n  <li>Compute the complement as <code>target - v</code>.</li>\n  <li>If the complement exists in <code>seen</code>, return the pair of indices.</li>\n  <li>If not, store the current value and index in <code>seen</code>.</li>\n  <li>Continue until a valid pair is found or return <code>null</code> if none exists.</li>\n</ol>\n",
        useCase: "<ul>\n  <li><strong>Financial systems:</strong> Find two transactions that match a target threshold.</li>\n  <li><strong>Real-time monitoring:</strong> Detect paired events that together reach a critical metric.</li>\n  <li><strong>Data analytics:</strong> Quickly answer queries like \"Which two values reach this total?\"</li>\n  <li><strong>Gaming:</strong> Calculate combinations of items or resources to reach a specific total.</li>\n  <li><strong>System design:</strong> Demonstrates efficient hashing strategies for lookup-heavy tasks.</li>\n</ul>\n",
        constraints: [
            "2 <= nums.length <= 10<sup>4</sup>",
            "-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup>",
            "-10<sup>9</sup> <= target <= 10<sup>9</sup>",
            "Only one valid answer exists.",
        ],
        problemStatement:
            "<p>\n  Given an array of integers <code>nums</code>\n  and an integer <code>target</code>, return indices\n  of the two numbers such that they add up to target.\n</p>\n\n<p>\n  You may assume that each input would have exactly one solution,\n  and you may not use the same element twice.\n  Return [-1,-1] if no target matched.\n</p>\n",
    },
    implementations: [
        {
            lang: "typeScript",
            code: [
                {
                    code: `function twoSum(nums: number[], target: number): number[] {
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
    
    return [-1,-1]; // No solution found
}`,
                    codeType: "optimize",
                    explanationAfter: "",
                    explanationBefore: "<p>\n  <strong>Intuition:</strong><br>\n  Imagine you have a list of numbers and a target value, like wanting two prices that together make ₹10. As you look at each number, you ask yourself: <em>\"What number do I need to pair with this to reach the target?\"</em>\n</p>\n\n<p>\n  For each number, you compute its complement (<code>target - num</code>). If you've seen the complement before, you've found your answer. If not, store the current number and move on.\n</p>\n\n<p>\n  <strong>Time Complexity:</strong> O(n)<br>\n  <strong>Space Complexity:</strong> O(n)\n</p>\n",
                    showExplanationBefore: true,
                },
                {
                    code: `function twoSum(nums: number[], target: number): number[] {
  const n = nums.length;

  // Pick the first number
  for (let i = 0; i < n; i++) {
    // Pair it with every number after it
    for (let j = i + 1; j < n; j++) {
      // Check if the sum matches the target
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }

  // No solution found
  return [-1,-1];
}`,
                    codeType: "brute-force",
                    isVisible: true,
                    explanationAfter: "",
                    explanationBefore:
                        "<p>\n  <strong>Intuition:</strong><br>\n  Try every possible pair. For each number, pair it with every number after it and check if their sum equals the target.\n</p>\n\n<p>\n  <strong>Time Complexity:</strong> O(n²)<br>\n  <strong>Space Complexity:</strong> O(1)\n</p>\n",
                },
                {
                    code: `function twoSum(nums: number[], target: number): number[] {
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
    
    return [-1,-1]; // No solution found

}`,
                    codeType: "starter",
                    explanationAfter: "",
                    explanationBefore: "",
                },
            ],
        },
        {
            lang: "python",
            code: [
                {
                    code: `from typing import List

def twoSum(nums: List[int], target: int) -> List[int]:
    # Hash map to store number and its index
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        # Check if complement exists in hash map
        if complement in seen:
            return [seen[complement], i]
        
        # Store current number and its index
        seen[num] = i
    
    return [-1,-1]  # No solution found`,
                    codeType: "optimize",
                    explanationAfter: "",
                    explanationBefore:
                        "<p>\n  <strong>Intuition:</strong><br>\n  Same one-pass hashmap approach as TypeScript, using Python's dict for O(1) lookups.\n</p>\n\n<p>\n  <strong>Time Complexity:</strong> O(n)<br>\n  <strong>Space Complexity:</strong> O(n)\n</p>\n",
                    showExplanationBefore: true,
                },
                {
                    code: `def twoSum(nums, target):
    # TODO: Implement
    pass`,
                    codeType: "starter",
                    explanationAfter: "",
                    explanationBefore: "",
                },
            ],
        },
        {
            lang: "java",
            code: [
                {
                    code: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            
            seen.put(nums[i], i);
        }
        
        return new int[]{-1, -1};
    }
}`,
                    codeType: "optimize",
                    explanationAfter: "",
                    explanationBefore:
                        "<p>\n  <strong>Intuition:</strong><br>\n  One-pass HashMap solution in Java. HashMap provides O(1) average-time lookups.\n</p>\n\n<p>\n  <strong>Time Complexity:</strong> O(n)<br>\n  <strong>Space Complexity:</strong> O(n)\n</p>\n",
                    showExplanationBefore: true,
                },
            ],
        },
        {
            lang: "cpp",
            code: [
                {
                    code: `#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            
            seen[nums[i]] = i;
        }
        
        return {-1, -1};
    }
};`,
                    codeType: "optimize",
                    explanationAfter: "",
                    explanationBefore:
                        "<p>\n  <strong>Intuition:</strong><br>\n  One-pass unordered_map solution in C++. unordered_map provides O(1) average-time lookups.\n</p>\n\n<p>\n  <strong>Time Complexity:</strong> O(n)<br>\n  <strong>Space Complexity:</strong> O(n)\n</p>\n",
                    showExplanationBefore: true,
                },
            ],
        },
    ],
    problems_to_solve: {
        external: [{ url: "https://leetcode.com/problems/two-sum/", type: "easy", title: "Two sum" }],
        internal: [
            { url: "two-pointers", type: "easy", title: "Two pointer" },
            { url: "3sum", type: "medium", title: "3sum" },
        ],
    },
    test_cases: [
        { input: [[2, 7], 9], output: [0, 1], description: "Basic test", expectedOutput: null },
        { input: [[4, 1, 2, 3], 7], output: [0, 3], description: "", expectedOutput: null },
        { input: [[3, 3], 6], output: [0, 1], description: "", isSubmission: true, expectedOutput: null },
        { input: [[10, 75, 15, 25, 120], 100], output: [1, 3], description: "", isSubmission: true, expectedOutput: null },
        { input: [[1, 5, 4, -1], 3], output: [2, 3], description: "", isSubmission: true, expectedOutput: null },
        { input: [[-3, -5, -4, -2, -1], -8], output: [0, 1], description: "", isSubmission: true, expectedOutput: null },
        { input: [[0, 1, 2, 4], 3], output: [1, 2], description: "", isSubmission: true, expectedOutput: null },
        { input: [[2, 3], 4], output: [-1, -1], description: "", isSubmission: false, expectedOutput: null },
        { input: [[-19, 1, 89, 12], -7], output: [0, 3], description: "", isSubmission: true, expectedOutput: null },
    ],
    input_schema: [
        { name: "nums", type: "number[]", label: "Array" },
        { name: "target", type: "number", label: "Target" },
    ],
    tutorials: [{ url: "https://www.youtube.com/watch?v=KLlXCFG5TnA", type: "youtube", credits: "NeetCode", moreInfo: "" }],
    metadata: {
        likes: 1,
        dislikes: 0,
        listType: "blind75",
        overview:
            "<p>\n  The Two Sum problem requires finding two numbers in an array that add up to a given target. A brute-force approach checks all possible pairs, but this becomes inefficient for large inputs.\n</p>\n\n<p>\n  A more optimized approach uses a hashmap to store previously seen numbers. For each value, we compute the complement (<code>target - current</code>) and look it up in constant time.\n</p>\n",
        imageUrls: [],
        shareCount: 0,
        commonNotes: "",
        companyTags: ["Amazon", "Google", "Facebook", "Microsoft"],
        editorialId: "",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        commonWhiteBoard: "",
        visualizationUrl: "",
        availableLanguages: "typeScript,python,java,cpp",
        userCompletionGraphData: { attempted: 0, completed: 0 },
    },
    controls: {
        tabs: { code: true, history: true, solutions: true, brainstorm: true, description: true, visualization: true },
        header: { timer: true, bug_report: true, next_problem: true, interview_mode: true, random_problem: true },
        social: { share: true, voting: true, favorite: true },
        content: { youtube_tutorial: true, practice_problems: true },
        metadata: { companies: true, difficulty: true, attempted_badge: true },
        solutions: { languages: { cpp: true, java: true, python: true, typescript: true }, approaches: true },
        brainstorm: { notes: true, whiteboard: true },
        code_runner: {
            submit: true,
            run_code: true,
            languages: { cpp: true, java: true, python: true, typescript: true },
            add_test_case: true,
        },
        description: { guides: true, examples: true, overview: true, constraints: true, problem_statement: true },
    },
    serial_no: 301,
    list_type: "blind75",
    time_complexity: "O(n)",
    space_complexity: "O(n)",
};
