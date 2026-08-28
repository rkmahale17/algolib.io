export const content = `
# Hash Indexes: The Coat Check Ticket! 🧥

## 🧥 Introduction: The Coat Check

Imagine you go to a fancy museum and hand your coat to the attendant.

The attendant gives you a tiny plastic ticket with the number **#42** on it.
* When you leave, you hand the attendant ticket **#42**.
* The attendant doesn't browse alphabetically through a list of names, nor do they walk aisle-by-aisle. They walk directly to hanger hook **#42** and grab your coat instantly!

In databases, a **Hash Index** is this exact ticket system! It takes a column value, runs it through a math function to get a unique bucket address (like hanger #42), and jumps straight to the data row in one single step ($O(1)$ time complexity).

---

## ⚙️ How Hash Indexes Work

A Hash Index uses a mathematical function called a **Hash Function** to map keys directly to bucket pointers:

\`\`\`
    Search Key (e.g. "Alice")
              |
              v
     +-----------------+
     |  HASH FUNCTION  |  <--- Mathematical converter (e.g., md5 or modulo)
     +-----------------+
              |
        Calculates 42
              |
              v
       HASH BUCKET LIST                          DATA TABLE
     +------------+----------+              +----+----------+-------------+
     | Bucket ID  | Pointer  |              | ID | Username | Country     |
     +------------+----------+              +----+----------+-------------+
     | 41         | Null     |              | 1  | Bob      | USA         |
     | 42         | Row #2   | -----------> | 2  | Alice    | Canada      |
     | 43         | Row #3   |              | 3  | Charlie  | UK          |
     +------------+----------+              +----+----------+-------------+
\`\`\`

### The Trade-off: Equality vs. Range

Hash indexes are the **fastest possible indexes** for exact match queries, but they have major limitations:

* **Perfect for Equality (\`=\`):** Finding \`WHERE username = 'Alice'\` takes exactly 1 step.
* **Useless for Ranges (\`>\`, \`<\`, \`BETWEEN\`):** Because hash values are scattered randomly, a hash index cannot help you find users with \`age > 21\`. The database has to fall back to a full Table Scan!
* **Useless for Sorting:** The keys in a hash index are not sorted. You cannot use them to speed up \`ORDER BY\` queries.

---

## 💻 Code Examples

Let's simulate a hash index lookup structure in different languages.

### SQL Setup (PostgreSQL example)
\`\`\`sql
-- Create a Hash Index for exact equality checks
CREATE INDEX idx_user_hash_email ON users USING HASH (email);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
class HashIndexDemo:
    def __init__(self):
        # Simulated database row storage
        self.table = [
            {"id": 1, "name": "Bob"},
            {"id": 2, "name": "Alice"},
            {"id": 3, "name": "Charlie"}
        ]
        # Hash Index mapping: Name -> Hashed Array Pointer
        self.index = {}
        for idx, row in enumerate(self.table):
            self.index[hash(row["name"])] = idx

    def find(self, name):
        # Direct O(1) lookup
        name_hash = hash(name)
        if name_hash in self.index:
            row_idx = self.index[name_hash]
            return self.table[row_idx]
        return None

db = HashIndexDemo()
print("Direct Fetch Alice:", db.find("Alice"))
\`\`\`

##### Java
\`\`\`java
import java.util.*;

public class HashIndexDemo {
    public static void main(String[] args) {
        // Simulating hash buckets using a HashMap
        Map<Integer, String> hashIndex = new HashMap<>();
        
        // Simulating insertions
        String name = "Alice";
        int hashBucket = name.hashCode();
        hashIndex.put(hashBucket, "Row Pointer #123");
        
        // O(1) Search
        String pointer = hashIndex.get("Alice".hashCode());
        System.out.println("Java Hash Pointer: " + pointer);
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <unordered_map>

void runHashIndex() {
    // Unordered map is a Hash Table (O(1) lookups)
    std::unordered_map<size_t, std::string> hashIndex;
    
    std::string key = "Alice";
    size_t hashVal = std::hash<std::string>{}(key);
    
    hashIndex[hashVal] = "Data Row #456";
    
    // Direct match
    std::cout << "C++ Hash Map Lookup: " << hashIndex[std::hash<std::string>{}("Alice")] << std::endl;
}

int main() {
    runHashIndex();
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
function runHashIndex() {
    // JS Objects/Map structures act as Hash tables under the hood
    const dataTable = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
    ];
    
    const hashIndex = new Map<string, number>();
    dataTable.forEach((row, idx) => hashIndex.set(row.name, idx));
    
    // Direct match check
    const rowIdx = hashIndex.get("Alice");
    if (rowIdx !== undefined) {
        console.log("TS Hash Fetch:", dataTable[rowIdx]);
    }
}
runHashIndex();
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Using Hash Indexes for Range Queries
Trying to speed up queries like \`WHERE age BETWEEN 18 AND 30\` using a Hash Index. The index cannot help, forcing the database to perform a slow Table Scan. Use a B-Tree index for range queries.

### 2. Hash Collisions
When two different keys generate the exact same hash value. The database has to store both keys in a linked list inside the bucket, slowing down matches if there are many collisions.

---

## 🔍 Interview Corner

### Q1: Why can't we use a Hash Index for range queries like BETWEEN 10 and 20?
A Hash function maps keys to buckets randomly to distribute them evenly (e.g. \`hash(10)\` might be bucket 42, while \`hash(11)\` is bucket 1). Because the values are not sorted, the index cannot locate sequential intermediate values without checking every bucket.

### Q2: What is the time complexity of a Hash Index lookup compared to a B-Tree Index?
* **Hash Index:** Average time complexity is **$O(1)$** (constant time) because it computes the address math directly.
* **B-Tree Index:** Time complexity is **$O(\log N)$** (logarithmic time) because it must traverse the tree levels.

---

## 📝 Summary

* **Hash Indexes** provide $O(1)$ search speeds by using hash mathematical formulas.
* They are excellent for **equality comparisons** (\`=\` or \`IN\`).
* They do not support range queries (\`>\`, \`<\`, \`BETWEEN\`) or sorting.
`;
