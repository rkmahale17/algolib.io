export const content = `
# Database Sharding: The Library Campuses! 🏫

## 🏫 Introduction: The Multi-Building Library

Imagine you are running the central library of a massive city. 

* **The Problem:** The library gets so popular that you have **10 million books**. The building is overflowing. The walls are cracking, and you cannot buy a larger plot of land in the center of town.
* **The Solution (Sharding):** You build **three separate library campuses** in different parts of the city:
  * **Campus East (Shard 1):** Stores books written by authors starting with **A to H**.
  * **Campus North (Shard 2):** Stores books written by authors starting with **I to P**.
  * **Campus West (Shard 3):** Stores books written by authors starting with **Q to Z**.
* **The Search:** If a reader wants to borrow a book by "J.K. Rowling" (starts with J), they look at the map and go directly to **Campus North**. 

In system design, this is **Database Sharding**! It is the process of splitting one giant database table horizontally and storing the pieces across **multiple independent physical database servers**.

---

## 🏗️ Partitioning vs. Sharding: The Mechanics

\`\`\`
    PARTITIONING (Single Server, Multi-files)
    +-----------------------------------------------+
    |                  SERVER #1                    |
    |  [sales_2024]   [sales_2025]   [sales_2026]   | <--- Slices remain on same hardware
    +-----------------------------------------------+
    
    SHARDING (Multi-Servers, Isolated Hardware)
                    Client Application
                            |
                   (Routes query to Shard)
                            |
         +------------------+------------------+
         |                  |                  |
         v                  v                  v
   +------------+     +------------+     +------------+
   | SERVER #1  |     | SERVER #2  |     | SERVER #3  |
   | (Shard A)  |     | (Shard B)  |     | (Shard C)  | <--- Slices are on separate servers!
   | User A-H   |     | User I-P   |     | User Q-Z   |
   +------------+     +------------+     +------------+
\`\`\`

### The Key Tradeoffs of Sharding

Sharding is the ultimate way to scale databases to infinity, but it has severe costs:
1. **No Joins Across Shards:** You cannot run a standard SQL \`JOIN\` between a table on Shard 1 and a table on Shard 2. You have to join them in your application code, which is very slow.
2. **Distributed Transactions:** Running transactions that update rows on multiple shards requires complex protocols like **Two-Phase Commit (2PC)**, which degrades performance.
3. **Re-sharding Complexity:** If Shard A fills up, you have to split it again and relocate millions of rows across servers without taking the site offline.

---

## 💻 Code Examples: Consistent Hash Routing Simulation

Let's build a simple database shard router in code using a **Shard Key** modulo check.

### Multi-Language Execution

##### Python
\`\`\`python
import hashlib

class DatabaseShardRouter:
    def __init__(self):
        # Simulated independent server database pools
        self.shards = ["Server_Shard_0", "Server_Shard_1", "Server_Shard_2"]

    def get_shard(self, shard_key):
        # Hash the key to get a consistent integer representation
        key_hash = int(hashlib.md5(shard_key.encode('utf-8')).hexdigest(), 16)
        # Modulo distributes keys evenly across shards
        shard_idx = key_hash % len(self.shards)
        return self.shards[shard_idx]

router = DatabaseShardRouter()
print("Alice profile routes to:", router.get_shard("Alice"))
print("Bob profile routes to:", router.get_shard("Bob"))
print("Charlie profile routes to:", router.get_shard("Charlie"))
\`\`\`

##### Java
\`\`\`java
import java.util.*;

public class ShardRouter {
    private final List<String> shards = Arrays.asList("Server-0", "Server-1", "Server-2");

    public String routeKey(String shardKey) {
        int hash = Math.abs(shardKey.hashCode());
        int shardIndex = hash % shards.size();
        return shards.get(shardIndex);
    }

    public static void main(String[] args) {
        ShardRouter router = new ShardRouter();
        System.out.println("Route 'User101': " + router.routeKey("User101"));
        System.out.println("Route 'User999': " + router.routeKey("User999"));
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <vector>
#include <string>

class ShardRouter {
    std::vector<std::string> shards = {"Server-Shard-0", "Server-Shard-1", "Server-Shard-2"};
public:
    std::string routeKey(const std::string& key) {
        size_t hashVal = std::hash<std::string>{}(key);
        size_t index = hashVal % shards.size();
        return shards[index];
    }
};

int main() {
    ShardRouter router;
    std::cout << "Route 'User1': " << router.routeKey("User1") << std::endl;
    std::cout << "Route 'User2': " << router.routeKey("User2") << std::endl;
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
class ShardRouterTS {
    private shards = ["Server-0", "Server-1", "Server-2"];

    private getHashCode(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    public route(shardKey: string): string {
        const hash = this.getHashCode(shardKey);
        const idx = hash % this.shards.length;
        return this.shards[idx];
    }
}
const router = new ShardRouterTS();
console.log("TS Router route 'Alice':", router.route("Alice"));
console.log("TS Router route 'Bob':", router.route("Bob"));
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Choosing an Uneven Shard Key
Choosing a column with a skewed distribution (e.g. sharding an e-commerce database by \`country\`). If 95% of your customers live in the "USA", Shard 1 will crash under heavy traffic while Shards 2 and 3 sit completely idle. This creates a **Hot Spot**!

### 2. Sharding Too Early
Splitting your database when your table only contains 50,000 rows. Sharding introduces massive network and transactional complexity. Never shard until you have exhausted all other optimization techniques (like indexing, caching, replica scaling, and vertical scaling).

---

## 🔍 Interview Corner

### Q1: What is the difference between Partitioning and Sharding?
* **Partitioning** splits a table horizontally but keeps all the partitions on the **same physical server**.
* **Sharding** splits a table horizontally and distributes the shards across **multiple physical servers**, enabling horizontal scaling of both storage and computing resources.

### Q2: What is a "Hot Spot" in database sharding, and how do you prevent it?
A **Hot Spot** occurs when a shard key distributes an uneven amount of traffic or data to a single shard (e.g., sharding by date where today's shard gets all traffic). It is prevented by choosing a high-cardinality, evenly-distributed shard key (like a hash of user ID).

---

## 📝 Summary

* **Sharding** distributes database rows across multiple physical servers to scale horizontally.
* It requires a **Shard Key** and a routing mechanism to locate row coordinates.
* Tradeoffs include the loss of **cross-shard JOINs** and complex distributed transactions.
`;
