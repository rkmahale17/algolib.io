export const content = `
# Greedy Approach: Grab the Best Thing Now! 

##  Introduction: The Dessert Buffet

Imagine you are at a massive dessert buffet, and you have a plate that can only hold 3 items. You want to get the most delicious plate of desserts possible. 

You could sit down and calculate every single combination of 3 desserts to find the absolute mathematically perfect plate... OR, you could just use the **Greedy Strategy**:
1. Look at all the desserts.
2. Grab the single most delicious one you see.
3. Look at what's left, and grab the most delicious one again.
4. Do it one more time.

By just picking the best option right in front of you at each step, you end up with a pretty amazing plate of dessert without doing any hard thinking!

---

##  What is the Greedy Pattern?

In programming, a **Greedy Algorithm** is a problem-solving strategy that makes the optimal (best) choice at each small step, hoping that these small best choices lead to the global best solution.

It doesn't look into the future. It doesn't double-check past choices. It just asks: *"What is the best move I can make right exactly this second?"*

Sometimes, being greedy is perfect (like giving change for a dollar). Sometimes, it leads you into a trap (like a maze where the shiny path leads to a dead end). But when it works, it is incredibly fast and simple!

---

##  The Core Strategy

1. **Sort or Organize**: Greedy algorithms almost always require you to sort the data first (e.g., sort from biggest to smallest, or by ending time).
2. **Iterate**: Go through the items one by one.
3. **Take the Best**: Make the immediate best choice and add it to your total.
4. **Never Look Back**: Once a choice is made, the greedy algorithm never undoes it.

---

## ️ Real-World Example: Giving Change

If you buy a toy for $3 and give the cashier a $10 bill, they need to give you $7 in change.

How does a cashier do it? They use a Greedy Algorithm!
1. They grab the biggest bill possible without going over $7. (They grab a $5 bill). 
2. Now they owe you $2. They grab the biggest bill possible for $2. (They grab a $1 bill).
3. Now they owe you $1. They grab another $1 bill.

They didn't have to calculate every combination of pennies and nickels. They just grabbed the biggest thing that fit, repeatedly!

---

##  Problem Walkthrough: Assign Cookies

Imagine you have some children, and each child has a "greed factor" (how big of a cookie they want). You also have a pile of cookies of different sizes. You want to make as many children happy as possible.

[Visualize Assign Cookies in the Interactive Simulator](viz:assign-cookies)

### The Strategy
We should give the smallest cookies to the children with the smallest greed factors! Why waste a giant cookie on a kid who would be happy with a tiny one? 

1. Sort the children's greed factors from smallest to largest.
2. Sort the cookies from smallest to largest.
3. Use two pointers to match the smallest happy cookie to the easiest-to-please child.

#### Python
\`\`\`python
class Solution:
    def findContentChildren(self, g: List[int], s: List[int]) -> int:
        # Sort both lists so we can be greedy!
        g.sort()
        s.sort()
        
        child_i = 0
        cookie_i = 0
        
        # Keep going until we run out of kids or cookies
        while child_i < len(g) and cookie_i < len(s):
            # If this cookie is big enough for this child...
            if s[cookie_i] >= g[child_i]:
                # The child is happy! Move to the next child.
                child_i += 1
            
            # No matter what, this cookie is used (or too small for anyone), move on
            cookie_i += 1
            
        # The number of happy children is just our child index!
        return child_i
\`\`\`

#### Java
\`\`\`java
import java.util.Arrays;

class Solution {
    public int findContentChildren(int[] g, int[] s) {
        // Sort both arrays to be greedy!
        Arrays.sort(g);
        Arrays.sort(s);
        
        int childI = 0;
        int cookieI = 0;
        
        while (childI < g.length && cookieI < s.length) {
            // If the cookie satisfies the child's greed
            if (s[cookieI] >= g[childI]) {
                childI++; // Child gets the cookie and is happy
            }
            cookieI++; // Move to next cookie
        }
        
        return childI;
    }
}
\`\`\`

#### C++
\`\`\`cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findContentChildren(vector<int>& g, vector<int>& s) {
        // Sort both arrays
        sort(g.begin(), g.end());
        sort(s.begin(), s.end());
        
        int childI = 0;
        int cookieI = 0;
        
        while (childI < g.size() && cookieI < s.size()) {
            if (s[cookieI] >= g[childI]) {
                childI++;
            }
            cookieI++;
        }
        
        return childI;
    }
};
\`\`\`

#### TypeScript
\`\`\`typescript
function findContentChildren(g: number[], s: number[]): number {
    // Sort arrays in ascending order
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);
    
    let childI = 0;
    let cookieI = 0;
    
    while (childI < g.length && cookieI < s.length) {
        // If the cookie fits the child's greed
        if (s[cookieI] >= g[childI]) {
            childI++;
        }
        cookieI++;
    }
    
    return childI;
}
\`\`\`

---

##  Common Mistakes 

1. **Forgetting to Sort**: A greedy algorithm almost never works on unsorted data. If you just grab the first thing you see without organizing it first, you will make a bad choice.
2. **When Greedy is Wrong**: Greedy doesn't always work! If a problem requires you to look ahead or test multiple overlapping combinations (like the famous Knapsack problem), you might need **Dynamic Programming** instead. 

---

##  Practice Problems

* [Assign Cookies](/problem/assign-cookies) — The classic introductory greedy problem.
* [Jump Game](/problem/jump-game) — Be greedy about how far you can jump!
* [Non-overlapping Intervals](/problem/non-overlapping-intervals) — Sort by end time and greedily pick intervals.
`;
