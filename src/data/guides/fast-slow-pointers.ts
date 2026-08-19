export const content = `
# Fast and Slow Pointers: The Tortoise and the Hare 🐢🐇

## 🏃 Introduction: The Racetrack Mystery

Imagine you and your friend are running on a circular racetrack. Your friend is a super-fast runner (the Hare 🐇), and you are a bit slower (the Tortoise 🐢). 

If you both start at the same time, your fast friend will zoom ahead. But because the track is a circle, eventually, your fast friend will lap you and pass you again! 

If the track was a straight line that ended, your friend would just reach the finish line and wait. But on a circle, they will *always* catch up to you from behind. 

This is the secret behind the **Fast and Slow Pointers** pattern! We use two "runners" (pointers) moving at different speeds to solve mysteries about paths and tracks in our code.

---

## 🤔 What is this Pattern?

In computer science, we often have linked lists or sequences where we don't know if there is an end, or if it loops around in a circle forever (a cycle). 

Instead of leaving breadcrumbs everywhere (which takes up memory), we just send two pointers:
- **Slow Pointer**: Takes 1 step at a time.
- **Fast Pointer**: Takes 2 steps at a time.

If there is a loop, the Fast Pointer will eventually run laps around the loop and crash right into the Slow Pointer. If there is no loop, the Fast Pointer will just reach the end of the road.

---

## ✨ The Core Strategy

1. Start both the \`slow\` and \`fast\` pointers at the very beginning.
2. Use a \`while\` loop that keeps running as long as the \`fast\` pointer can take 2 steps forward.
3. Move \`slow\` forward by 1 step.
4. Move \`fast\` forward by 2 steps.
5. Check if they are standing on the exact same spot! If they are, you found a cycle!

---

## 🎟️ Real-World Example: Finding the Middle

You can also use this pattern to find the exact middle of a line! 

Imagine a long line of 10 people. If you take 1 step per second, and your friend takes 2 steps per second. When your friend reaches the very end of the line (10 steps), you will have only taken 5 steps. You are perfectly in the middle!

---

## 🧩 Problem Walkthrough: Linked List Cycle

Let's write code to figure out if a Linked List has a cycle (a loop).

[Visualize Linked List Cycle in the Interactive Simulator](viz:detect-cycle-in-a-linked-list)

### The Strategy
We will initialize both runners at the head. The slow runner goes 1 node at a time, the fast runner goes 2 nodes. If they ever meet, we return \`true\`. If the fast runner hits \`null\`, we return \`false\`.

#### Python
\`\`\`python
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        # Both runners start at the starting line
        slow = head
        fast = head
        
        # As long as fast can keep running 2 steps...
        while fast and fast.next:
            slow = slow.next          # Tortoise takes 1 step
            fast = fast.next.next     # Hare takes 2 steps
            
            # Did the hare lap the tortoise?
            if slow == fast:
                return True
                
        # The hare reached the finish line! No loop.
        return False
\`\`\`

#### Java
\`\`\`java
public class Solution {
    public boolean hasCycle(ListNode head) {
        // Both runners start at the starting line
        ListNode slow = head;
        ListNode fast = head;
        
        // As long as fast can keep running 2 steps...
        while (fast != null && fast.next != null) {
            slow = slow.next;         // Tortoise takes 1 step
            fast = fast.next.next;    // Hare takes 2 steps
            
            // Did the hare lap the tortoise?
            if (slow == fast) {
                return true;
            }
        }
        // The hare reached the finish line! No loop.
        return false;
    }
}
\`\`\`

#### C++
\`\`\`cpp
class Solution {
public:
    bool hasCycle(ListNode *head) {
        // Both runners start at the starting line
        ListNode *slow = head;
        ListNode *fast = head;
        
        // As long as fast can keep running 2 steps...
        while (fast && fast->next) {
            slow = slow->next;         // Tortoise takes 1 step
            fast = fast->next->next;   // Hare takes 2 steps
            
            // Did the hare lap the tortoise?
            if (slow == fast) {
                return true;
            }
        }
        // The hare reached the finish line! No loop.
        return false;
    }
};
\`\`\`

#### TypeScript
\`\`\`typescript
function hasCycle(head: ListNode | null): boolean {
    // Both runners start at the starting line
    let slow = head;
    let fast = head;
    
    // As long as fast can keep running 2 steps...
    while (fast !== null && fast.next !== null) {
        slow = slow.next;         // Tortoise takes 1 step
        fast = fast.next.next;    // Hare takes 2 steps
        
        // Did the hare lap the tortoise?
        if (slow === fast) {
            return true;
        }
    }
    // The hare reached the finish line! No loop.
    return false;
}
\`\`\`

---

## 🚫 Common Mistakes 

1. **Null Pointer Errors**: Always check \`fast\` AND \`fast.next\` before moving the fast pointer 2 steps! If \`fast.next\` is null, trying to do \`fast.next.next\` will crash your program.
2. **Starting Positions**: Make sure both pointers start at the exact same spot (the \`head\`), or else the math for finding the exact middle of a list won't work out perfectly.

---

## 🎮 Practice Problems

* [Linked List Cycle](/problem/detect-cycle-in-a-linked-list) — The classic Tortoise and Hare problem.
* [Middle of the Linked List](/problem/middle-node) — Use the different speeds to easily find the center.
* [Find the Duplicate Number](/problem/find-the-duplicate-number) — A tricky problem that uses the exact same cycle detection logic!
`;
