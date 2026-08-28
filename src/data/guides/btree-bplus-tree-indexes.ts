export const content = `
# B-Tree & B+ Tree Indexes: The Folder Tree! 📂

## 📂 Introduction: The Nested File Cabinet

Imagine you have a giant filing system containing **10,000 files**:

Instead of putting them all in one drawer, you organize them:
1. **The Root Drawer (Level 1):** You open a cabinet labeled \`A-Z\`. Inside, you see three folders: \`A-H\`, \`I-P\`, and \`Q-Z\`.
2. **The Sub-Folders (Level 2):** You click \`A-H\` and see subfolders like \`A-D\` and \`E-H\`.
3. **The Leaf Folder (Level 3):** You open \`E-H\` and find the exact file you wanted.

This multi-level grouping structure is a **B-Tree**! In databases, B-Trees and **B+ Trees** are the primary algorithms used to keep indexes organized, balanced, and lightning-fast to traverse.

---

## 🏗️ B-Tree vs. B+ Tree: The Mechanics

Relational databases prefer **B+ Trees** over standard B-Trees. Here is the visual difference:

### 1. Standard B-Tree
Keys and actual row data/pointers are scattered across **all** nodes (root, branches, and leaves).

\`\`\`
                      [Node: 15 (Data)]
                      /               \\
            [Node: 8 (Data)]     [Node: 20 (Data)]
\`\`\`

### 2. B+ Tree (Used by PostgreSQL, MySQL, SQL Server)
* **Root and Branches:** Only store keys (routing numbers) to direct searches. They do not store row data or pointers, allowing them to hold more keys (higher fan-out).
* **Leaves:** Store all actual row data/pointers.
* **Leaf Links:** All leaf nodes are linked sequentially in a **linked list** for fast range scans.

\`\`\`
                         [Root Node: 15]
                         /              \\
            [Branch: 8]                    [Branch: 20]
            /         \\                    /          \\
    [Leaf: 1..7] <-> [Leaf: 8..14] <-> [Leaf: 15..19] <-> [Leaf: 20..30]
         (All data lives here at the bottom, linked side-by-side!)
\`\`\`

### Why B+ Trees are Better for Databases:
1. **Higher Fan-out:** Because branch nodes don't store data, they can hold thousands of routing keys, requiring fewer tree levels (usually 3 or 4 levels max for millions of rows).
2. **Fast Range Queries:** To find values between 5 and 20, you just traverse down to Leaf 5, and then walk the linked list pointers sideways directly to 20 without going back up the tree branches!

---

## 💻 Code Examples: Simulation of Tree Traversal

Let's look at how we traverse balanced indexes in code.

### SQL Index Query
\`\`\`sql
-- B+ Tree indexes are automatically created for Primary Keys
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
class BPlusLeafNode:
    def __init__(self):
        self.keys = []
        self.values = []
        self.next = None  # Pointer to next leaf node (Linked List)

class SimpleBPlusTree:
    def __init__(self):
        self.root = BPlusLeafNode()
        # Seed leaf node values in sorted order
        self.root.keys = [10, 20, 30]
        self.root.values = ["Alice", "Bob", "Charlie"]

    def find(self, key):
        # Traverse sorted keys
        for idx, k in enumerate(self.root.keys):
            if k == key:
                return self.root.values[idx]
        return None

tree = SimpleBPlusTree()
print("Search 20:", tree.find(20)) # Bob
\`\`\`

##### Java
\`\`\`java
import java.util.*;

class LeafNode {
    List<Integer> keys = new ArrayList<>();
    List<String> values = new ArrayList<>();
    LeafNode next = null; // Linked list pointer
}

public class BPlusTreeDemo {
    public static void main(String[] args) {
        LeafNode leaf = new LeafNode();
        leaf.keys.addAll(Arrays.asList(10, 20, 30));
        leaf.values.addAll(Arrays.asList("Alice", "Bob", "Charlie"));
        
        // Search
        int searchKey = 30;
        int idx = leaf.keys.indexOf(searchKey);
        if (idx != -1) {
            System.out.println("Java Node Value: " + leaf.values.get(idx));
        }
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>

struct LeafNode {
    std::vector<int> keys;
    std::vector<std::string> values;
    LeafNode* next = nullptr;
};

void runBPlusTree() {
    LeafNode leaf;
    leaf.keys = {10, 20, 30};
    leaf.values = {"Alice", "Bob", "Charlie"};
    
    auto it = std::find(leaf.keys.begin(), leaf.keys.end(), 20);
    if (it != leaf.keys.end()) {
        int idx = std::distance(leaf.keys.begin(), it);
        std::cout << "C++ Node Found: " << leaf.values[idx] << std::endl;
    }
}

int main() {
    runBPlusTree();
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
interface BPlusNode {
    keys: number[];
    values: string[];
    next: BPlusNode | null;
}

function runBPlus() {
    const leaf: BPlusNode = {
        keys: [10, 20, 30],
        values: ["Alice", "Bob", "Charlie"],
        next: null
    };
    
    const idx = leaf.keys.indexOf(20);
    if (idx !== -1) {
        console.log("TS B+ Tree Value:", leaf.values[idx]);
    }
}
runBPlus();
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Assuming Index order matches Insert order
B-Trees are self-balancing. When you insert a row, the database splits nodes and shifts keys to keep tree depth equal. Never assume inserting row #100 after row #99 means they are stored side-by-side physically.

### 2. Scanning the Tree for Large Datasets
Using functions like \`WHERE score + 5 > 10\`. This blocks the B-Tree index scan because the database has to calculate the formula for every row, resorting to a full Table Scan.

---

## 🔍 Interview Corner

### Q1: What is the main difference between a B-Tree and a B+ Tree?
* In a **B-Tree**, both keys and data pointers are stored in all nodes (root, internal, and leaf).
* In a **B+ Tree**, data pointers are stored **only in leaf nodes**, while internal/root nodes only hold search keys. Leaves are also linked in a sequential list for fast range traversals.

### Q2: Why are B+ Trees preferred over Binary Search Trees (BST) in databases?
Binary Search Trees have a fan-out of 2, making them very deep (many levels) for large tables. This requires many slow disk reads. B+ Trees have a fan-out of hundreds or thousands, keeping tree levels extremely flat (usually 3-4 levels) and minimizing disk I/O.

---

## 📝 Summary

* **B+ Trees** are the standard data structures for relational database indexes.
* Branch nodes route searches, while **Leaf nodes** hold all actual data pointers.
* Leaf nodes link sequentially, enabling high-speed range queries (\`BETWEEN\`, \`>\`, \`<\`).
`;
