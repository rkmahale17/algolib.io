export const content = `
# Backtracking: The Art of Trying Every Path!

##  Introduction: The Great Maze Adventure

Imagine you are a brave explorer trapped inside a giant, mysterious hedge maze. Your goal is to find the hidden treasure chest right in the center. But there's a problem: you don't have a map! All you have is a pocket full of shiny breadcrumbs.

How do you find the treasure without getting lost forever?

You start walking down the first path you see. Whenever you reach a crossroad where the path splits into left, right, and straight, you just pick one—let's say the left path. As you walk, you drop breadcrumbs behind you so you know exactly where you've been.

Suddenly, oh no! A dead end! A giant wall of leaves blocks your way. 

Do you sit down and cry? No! You are a smart explorer. You turn around and follow your breadcrumbs **backwards** until you reach the last crossroad you were at. Then, instead of going left (because you know that leads to a dead end), you try the right path!

You keep doing this: trying a path, hitting a dead end, going back a few steps, and trying a different path. Because you are checking every single path one by one, you are guaranteed to find the treasure!

In computer science, this clever strategy is called **Backtracking**!

---

##  What Exactly IS Backtracking?

Backtracking is a super smart way to solve puzzles by testing out possibilities one by one. It is closely related to **Recursion** (when a function calls itself to do a repetitive job).

Think about doing a jigsaw puzzle. You pick up a blue puzzle piece and try to fit it into the sky section. If it doesn't fit, you don't throw the whole puzzle away, right? You just take the piece out (you backtrack!), put it back on the table, and try a different blue piece.

Backtracking means making a choice, moving forward, and if you realize later that your choice was wrong (or if you just want to see all the other options), you **"undo"** that choice and try something else.

---

##  Why Do We Need To Learn It?

You might be thinking, "Can't I just use simple loops to solve problems?"

For simple math, yes! But what if you are trying to write a computer program that plays **Chess**? Or solves a **Sudoku** puzzle? Or finds the fastest route for a delivery truck? 

Loops are terrible at making complicated choices. If a Sudoku puzzle requires guessing a number, and then guessing 50 more numbers based on that first guess, a simple loop would break. 

We need Backtracking because it gives computers the superpower to **explore millions of different futures**! It lets the computer say: *"Let's pretend I put a 5 here. What happens next? Oh, I lose the game. Let me erase the 5 and pretend I put a 6 instead."* 

It is the foundation of Artificial Intelligence in board games!

---

##  The Three Magic Steps of Backtracking

Every backtracking algorithm follows three magical steps. We call them: **Choose, Explore, and Un-choose**. Let's look at how they work using an Ice Cream Shop example.

You want to make a 2-scoop sundae. The flavors are Vanilla, Chocolate, and Strawberry. We want to find *every possible combination*.

### 1. Choose (Make a guess)
At any point, you have options. You pick the very first option available. 
* *Example:* You put a scoop of Vanilla in your bowl.

### 2. Explore (Keep going!)
Now that you made a choice, you keep moving forward. You use **Recursion** to call your function again to pick the next scoop.
* *Example:* You keep the Vanilla in the bowl and ask yourself, "What should my second scoop be?" You pick Chocolate. Your sundae is [Vanilla, Chocolate]!

### 3. Un-choose (Undo the mistake)
If your exploration leads to a dead end, or if you already explored everything down that path, you have to clean up after yourself. You take back the choice you made in step 1. 
* *Example:* To find the next combination, you take the Chocolate scoop OUT of the bowl. Your bowl goes back to just [Vanilla]. Now you are ready to choose Strawberry instead!

---

##  Problem 1: Picking Your Toys (Subsets)

Imagine you have a toy box with a Car, a Ball, and a Doll. You want to know every possible group of toys you can pull out to play with. You could pull out nothing, just the Car, the Car and the Doll, or all three!

[Visualize Subsets in the Interactive Simulator](viz:subsets)

### The Strategy
At every toy, we have a simple choice:
1. **Include** the toy in our current group.
2. **Skip** the toy.

We use our three magic steps! We **choose** the toy, **explore** what happens next, then take the toy back out (**un-choose**), and **explore** what happens if we skip it.

#### Complete Implementations

##### Python
\`\`\`python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        res = []
        
        def backtrack(i, current_subset):
            # Base Case: We've made a choice for every single toy
            if i >= len(nums):
                # Save a copy of our current group
                res.append(current_subset.copy())
                return
                
            # Magic Step 1: CHOOSE (Let's play with this toy!)
            current_subset.append(nums[i])
            
            # Magic Step 2: EXPLORE (Move to the next toy)
            backtrack(i + 1, current_subset)
            
            # Magic Step 3: UN-CHOOSE (Put the toy back in the box)
            current_subset.pop()
            
            # Magic Step 2 (Again): EXPLORE (What if we skip this toy entirely?)
            backtrack(i + 1, current_subset)
            
        # Start at toy 0, with an empty group
        backtrack(0, [])
        return res
\`\`\`

##### Java
\`\`\`java
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(0, new ArrayList<>(), nums, res);
        return res;
    }
    
    private void backtrack(int i, List<Integer> currentSubset, int[] nums, List<List<Integer>> res) {
        if (i >= nums.length) {
            res.add(new ArrayList<>(currentSubset));
            return;
        }
        
        // Magic Step 1: CHOOSE
        currentSubset.add(nums[i]);
        
        // Magic Step 2: EXPLORE
        backtrack(i + 1, currentSubset, nums, res);
        
        // Magic Step 3: UN-CHOOSE
        currentSubset.remove(currentSubset.size() - 1);
        
        // Magic Step 2 (Again): EXPLORE (Skip the item)
        backtrack(i + 1, currentSubset, nums, res);
    }
}
\`\`\`

##### C++
\`\`\`cpp
class Solution {
public:
    std::vector<std::vector<int>> subsets(std::vector<int>& nums) {
        std::vector<std::vector<int>> res;
        std::vector<int> currentSubset;
        backtrack(0, currentSubset, nums, res);
        return res;
    }
    
private:
    void backtrack(int i, std::vector<int>& currentSubset, std::vector<int>& nums, std::vector<std::vector<int>>& res) {
        if (i >= nums.size()) {
            res.push_back(currentSubset);
            return;
        }
        
        // Magic Step 1: CHOOSE
        currentSubset.push_back(nums[i]);
        
        // Magic Step 2: EXPLORE
        backtrack(i + 1, currentSubset, nums, res);
        
        // Magic Step 3: UN-CHOOSE
        currentSubset.pop_back();
        
        // Magic Step 2 (Again): EXPLORE (Skip the item)
        backtrack(i + 1, currentSubset, nums, res);
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function subsets(nums: number[]): number[][] {
    const res: number[][] = [];
    
    function backtrack(i: number, currentSubset: number[]) {
        if (i >= nums.length) {
            res.push([...currentSubset]);
            return;
        }
        
        // Magic Step 1: CHOOSE
        currentSubset.push(nums[i]);
        
        // Magic Step 2: EXPLORE
        backtrack(i + 1, currentSubset);
        
        // Magic Step 3: UN-CHOOSE
        currentSubset.pop();
        
        // Magic Step 2 (Again): EXPLORE (Skip the item)
        backtrack(i + 1, currentSubset);
    }
    
    backtrack(0, []);
    return res;
}
\`\`\`

---

##  Problem 2: The Magic Lineup (Permutations)

Given a list of numbers (or people), return every possible order they can stand in line! This is called a **Permutation**.

[Visualize Permutations in the Interactive Simulator](viz:permutations)

### The Strategy
Instead of just "include or skip", we look at our empty spots in the line. We loop through all our people, picking an available person to stand in the current spot.
1. Loop through all people.
2. If the person is already standing in our line, skip them.
3. Otherwise, **choose** them for this spot.
4. **Explore** the rest of the line.
5. **Un-choose** them (ask them to step out of line so someone else can have a turn at that spot).

#### Complete Implementations

##### Python
\`\`\`python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        res = []
        
        def backtrack(current_perm):
            # Base case: We have placed all numbers in the current permutation
            if len(current_perm) == len(nums):
                res.append(current_perm.copy())
                return
                
            # Iterate over all possible candidates
            for n in nums:
                # Skip candidates that are already in our current permutation
                if n not in current_perm:
                    # STEP 1: CHOOSE - Add candidate to the current path
                    current_perm.append(n)
                    
                    # STEP 2: EXPLORE - Recurse with the new element added
                    backtrack(current_perm)
                    
                    # STEP 3: UN-CHOOSE - Remove candidate to backtrack and try the next one
                    current_perm.pop()
                    
        # Start backtracking with an empty path
        backtrack([])
        return res
\`\`\`

##### Java
\`\`\`java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(new ArrayList<>(), nums, res);
        return res;
    }
    
    private void backtrack(List<Integer> currentPerm, int[] nums, List<List<Integer>> res) {
        // Base case: We have placed all numbers in the current permutation
        if (currentPerm.size() == nums.length) {
            res.add(new ArrayList<>(currentPerm));
            return;
        }
        
        // Iterate over all possible candidates
        for (int n : nums) {
            // Skip candidates that are already in our current permutation
            if (!currentPerm.contains(n)) {
                // STEP 1: CHOOSE - Add candidate to the current path
                currentPerm.add(n);
                
                // STEP 2: EXPLORE - Recurse with the new element added
                backtrack(currentPerm, nums, res);
                
                // STEP 3: UN-CHOOSE - Remove candidate to backtrack and try the next one
                currentPerm.remove(currentPerm.size() - 1);
            }
        }
    }
}
\`\`\`

##### C++
\`\`\`cpp
class Solution {
public:
    std::vector<std::vector<int>> permute(std::vector<int>& nums) {
        std::vector<std::vector<int>> res;
        std::vector<int> currentPerm;
        backtrack(currentPerm, nums, res);
        return res;
    }
    
private:
    void backtrack(std::vector<int>& currentPerm, std::vector<int>& nums, std::vector<std::vector<int>>& res) {
        // Base case: We have placed all numbers in the current permutation
        if (currentPerm.size() == nums.size()) {
            res.push_back(currentPerm);
            return;
        }
        
        // Iterate over all possible candidates
        for (int n : nums) {
            // Skip candidates that are already in our current permutation
            if (std::find(currentPerm.begin(), currentPerm.end(), n) == currentPerm.end()) {
                // STEP 1: CHOOSE - Add candidate to the current path
                currentPerm.push_back(n);
                
                // STEP 2: EXPLORE - Recurse with the new element added
                backtrack(currentPerm, nums, res);
                
                // STEP 3: UN-CHOOSE - Remove candidate to backtrack and try the next one
                currentPerm.pop_back();
            }
        }
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function permute(nums: number[]): number[][] {
    const res: number[][] = [];
    
    function backtrack(currentPerm: number[]) {
        // Base case: We have placed all numbers in the current permutation
        if (currentPerm.length === nums.length) {
            res.push([...currentPerm]);
            return;
        }
        
        // Iterate over all possible candidates
        for (const n of nums) {
            // Skip candidates that are already in our current permutation
            if (!currentPerm.includes(n)) {
                // STEP 1: CHOOSE - Add candidate to the current path
                currentPerm.push(n);
                
                // STEP 2: EXPLORE - Recurse with the new element added
                backtrack(currentPerm);
                
                // STEP 3: UN-CHOOSE - Remove candidate to backtrack and try the next one
                currentPerm.pop();
            }
        }
    }
    
    // Start backtracking with an empty path
    backtrack([]);
    return res;
}
\`\`\`

---

##  Common Mistakes (The Forgetting Trap)

The most common mistake when writing backtracking code is forgetting to **Un-choose**. 

If you put the Chocolate scoop in your bowl, explore what happens, and then forget to take it out... your bowl will just keep getting bigger and bigger! You will end up with a sundae that is just \`[Vanilla, Chocolate, Strawberry, Chocolate, Vanilla...]\` and your code will give you completely wrong answers.

Always remember: if you add something to an array before you explore, you MUST \`pop()\` or \`remove()\` it after the exploration is finished!

---

##  Summary
* **Backtracking** explores all possibilities to solve a problem by systematically testing choices.
* It's required for puzzles like Sudoku, finding all combinations, and game AI.
* The golden rule is the three steps: **Choose, Explore, Un-choose**.
* Always remember to clean up your choices (un-choose) so the next option has a clean slate!

---

##  Practice Problems & Website Verifications

Verify your backtracking logic by solving these interactive problems on our platform:
* [Combination Sum](/problem/combination-sum) — Learn to backtrack with an unlimited supply of elements.
* [Word Search](/problem/word-search) — Practice backtracking through a 2D grid of characters.
`;
