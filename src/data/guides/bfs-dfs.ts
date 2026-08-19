export const content = `
# BFS and DFS: Exploring the Unknown 🗺️

## 🏰 Introduction: The Castle Maze

Imagine you are exploring a giant, dark castle looking for a hidden treasure chest. The castle has many rooms, and each room has doors leading to other rooms. 

You have two different strategies to search the castle:

**Strategy 1: The Fearless Diver (DFS - Depth First Search)**
You choose one door and run through it. You keep picking a new door in every room and running as deep into the castle as you possibly can until you hit a dead end. When you hit a wall, you back up one room and try a different door. You are diving deep!

**Strategy 2: The Careful Mapper (BFS - Breadth First Search)**
You start in the entrance. First, you peek into *all* the rooms immediately connected to the entrance (Level 1). Only after you have checked all those nearby rooms do you step forward and check all the rooms connected to *them* (Level 2). You explore outwards like a ripple in a pond!

---

## 🤔 What are BFS and DFS?

**DFS (Depth First Search)** and **BFS (Breadth First Search)** are the two most famous algorithms for exploring **Trees** and **Graphs** (networks of connected data). 

* **DFS uses a Stack** (or Recursion). It goes deep first. It is great for finding *any* path to a goal, or exploring every single possibility (like solving a maze or Sudoku).
* **BFS uses a Queue**. It goes wide first. It is the absolute best way to find the **Shortest Path** between two points, because it checks everything 1 step away, then 2 steps away, and so on.

---

## ✨ The Core Strategies

### The DFS Formula (Recursion is your friend!)
1. Visit the current room.
2. Mark it as "Visited" (so you don't walk in circles).
3. Look at all connected doors.
4. For each door, recursively cast the DFS spell to dive into it!

### The BFS Formula (Use a Line/Queue!)
1. Put your starting room into a Queue (a line).
2. While the line is not empty:
   - Take the first room out of the line.
   - Mark it "Visited".
   - Put all of its unvisited neighbors at the *back* of the line.

---

## 🎟️ Real-World Example: Finding a Friend's Phone Number

Imagine you need to find the phone number of someone named "Dave", and you can only ask your friends.

* **DFS Way**: You ask your best friend Alice. Alice doesn't know, so she asks her best friend Bob. Bob asks Charlie. You follow one single chain of friends as far as it goes until someone knows Dave.
* **BFS Way**: You send a text message to ALL of your immediate friends first. If none of them know Dave, you ask them to text ALL of their friends. You are searching in expanding circles!

---

## 🧩 Problem Walkthrough: Number of Islands

Imagine a grid (a map) of \`1\`s (land) and \`0\`s (water). We want to count how many separate islands there are. 

[Visualize Number of Islands in the Interactive Simulator](viz:number-of-islands)

### The Strategy (Using DFS)
We will scan the map. Whenever we find a piece of land (\`1\`), we found a new island! We add 1 to our count. 
BUT, we then use **DFS** to explore that entire island and sink it (turn the \`1\`s into \`0\`s). We do this so we don't accidentally count the same island twice!

#### Python
\`\`\`python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid:
            return 0
            
        islands = 0
        rows, cols = len(grid), len(grid[0])
        
        # The DFS Spell: Explores and sinks an island
        def dfs(r, c):
            # Base Case: If we go off the map, or hit water, stop!
            if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == "0":
                return
                
            # Sink the land! (Mark as visited)
            grid[r][c] = "0"
            
            # Dive into all 4 directions!
            dfs(r + 1, c) # Down
            dfs(r - 1, c) # Up
            dfs(r, c + 1) # Right
            dfs(r, c - 1) # Left

        # Scan the whole map
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == "1":
                    # We found land! Count it, then sink the whole island.
                    islands += 1
                    dfs(r, c)
                    
        return islands
\`\`\`

#### Java
\`\`\`java
class Solution {
    public int numIslands(char[][] grid) {
        int islands = 0;
        
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    islands++;
                    dfs(grid, r, c); // Sink the island
                }
            }
        }
        return islands;
    }
    
    private void dfs(char[][] grid, int r, int c) {
        // Base Case: Out of bounds or water
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0') {
            return;
        }
        
        // Sink the land
        grid[r][c] = '0';
        
        // Explore 4 directions
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}
\`\`\`

#### C++
\`\`\`cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int islands = 0;
        for (int r = 0; r < grid.size(); r++) {
            for (int c = 0; c < grid[0].size(); c++) {
                if (grid[r][c] == '1') {
                    islands++;
                    dfs(grid, r, c);
                }
            }
        }
        return islands;
    }
    
private:
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] == '0') {
            return;
        }
        
        grid[r][c] = '0'; // Sink it
        
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
};
\`\`\`

#### TypeScript
\`\`\`typescript
function numIslands(grid: string[][]): number {
    let islands = 0;
    
    const dfs = (r: number, c: number) => {
        // Out of bounds or water
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === '0') {
            return;
        }
        
        // Sink the land
        grid[r][c] = '0';
        
        // Explore all 4 directions
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    };

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === '1') {
                islands++;
                dfs(r, c); // Sink the entire island
            }
        }
    }
    
    return islands;
}
\`\`\`

---

## 🚫 Common Mistakes 

1. **Forgetting to mark as Visited**: If you don't change the \`1\` to a \`0\` (or keep a visited set), your DFS will bounce back and forth between two pieces of land forever! 
2. **Using DFS for Shortest Path**: DFS will find *a* path, but rarely the *shortest* path. If a problem asks for the "shortest", "closest", or "minimum steps", you almost always want to use **BFS**.

---

## 🎮 Practice Problems

* [Number of Islands](/problem/number-of-islands) — Practice grid DFS.
* [Max Area of Island](/problem/max-area-of-island) — A small twist on counting islands.
* [Rotting Oranges](/problem/rotting-oranges) — A perfect example of why BFS is used for spreading over time.
`;
