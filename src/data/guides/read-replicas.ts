export const content = `
# Read Replicas: The Movie Streaming Screens! 📺

## 📺 Introduction: The Cinema Screens

Imagine a popular theater showing a new block-buster movie:

* **The Projection Booth (Primary):** The projectionist has the single master digital tape of the movie. 
* **The Screens (Read Replicas):** Instead of crowding 5,000 viewers into the projection booth to look at the tiny tape viewer, the theater projects the video onto **10 separate screens** in different halls. 
* **Scaling Views:** The master tape is never modified. The projectionist simply streams (replicates) the video to the 10 screens. Millions of viewers can read (watch) the movie simultaneously without overloading the booth.

In system design, **Read Replicas** are these separate screens! They are dedicated copy servers used strictly to handle read-heavy traffic (like SELECT queries), saving your primary write database from crashing under heavy traffic.

---

## 🏗️ Read Replica Architecture

In standard web applications, read traffic is 90% of the load, while write traffic is only 10%. We use Read Replicas to scale this load:

\`\`\`
                          Client Application
                           /              \\
             (Write Queries)              (Read Queries)
                   |                              |
                   v                              v
        +-------------------+           +-------------------+
        |   PRIMARY NODE    |           |   LOAD BALANCER   |
        +-------------------+           +-------------------+
                   |                         /     |     \\
             (Replicates Log)               v      v      v
                   |              +-----------------------------+
                   +------------> |       READ REPLICAS         |
                                  +-----------------------------+
\`\`\`

### Routing Read/Write Traffic

Your application backend must be configured to split connections:
* **Writes (\`INSERT\`, \`UPDATE\`, \`DELETE\`):** Routed strictly to the **Primary** node.
* **Reads (\`SELECT\`):** Distributed evenly across the **Read Replicas** using a Load Balancer (round-robin routing).

---

## 💻 Code Examples: Connection Splitting in Code

Let's write a simple client controller that automatically routes queries based on read/write keywords.

### Multi-Language Execution

##### Python
\`\`\`python
class SimulatedDatabasePool:
    def __init__(self):
        self.primary = "Connection: Primary Write Node"
        self.replicas = ["Connection: Replica Read-1", "Connection: Replica Read-2"]
        self.read_counter = 0

    def get_connection(self, sql_query):
        query_upper = sql_query.strip().upper()
        
        # Route writes to primary
        if any(query_upper.startswith(w) for w in ["INSERT", "UPDATE", "DELETE"]):
            return self.primary
            
        # Route reads to replicas (round-robin)
        conn = self.replicas[self.read_counter % len(self.replicas)]
        self.read_counter += 1
        return conn

pool = SimulatedDatabasePool()
print(pool.get_connection("UPDATE users SET name = 'Bob'")) # Routes to Primary
print(pool.get_connection("SELECT * FROM users"))            # Routes to Replica 1
print(pool.get_connection("SELECT name FROM products"))     # Routes to Replica 2
\`\`\`

##### Java
\`\`\`java
import java.util.*;

public class ReadWriteRouter {
    private final String primary = "Primary-Write-Node";
    private final List<String> replicas = Arrays.asList("Replica-Read-1", "Replica-Read-2");
    private int counter = 0;

    public String routeQuery(String sql) {
        String cleanSql = sql.trim().toUpperCase();
        if (cleanSql.startsWith("SELECT")) {
            // Load balance reads
            String node = replicas.get(counter % replicas.size());
            counter++;
            return node;
        }
        return primary; // Default write node
    }

    public static void main(String[] args) {
        ReadWriteRouter router = new ReadWriteRouter();
        System.out.println("Route SELECT: " + router.routeQuery("SELECT * FROM users"));
        System.out.println("Route UPDATE: " + router.routeQuery("UPDATE users SET age = 20"));
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class DbRouter {
    std::string primary = "Primary_Write";
    std::vector<std::string> replicas = {"Replica_1", "Replica_2"};
    int counter = 0;
public:
    std::string routeQuery(const std::string& query) {
        std::string clean = query;
        std::transform(clean.begin(), clean.end(), clean.begin(), ::toupper);
        
        if (clean.find("SELECT") == 0) {
            std::string node = replicas[counter % replicas.size()];
            counter++;
            return node;
        }
        return primary;
    }
};

int main() {
    DbRouter router;
    std::cout << "Route SELECT: " << router.routeQuery("SELECT * FROM test;") << std::endl;
    std::cout << "Route INSERT: " << router.routeQuery("INSERT INTO test VALUES (1);") << std::endl;
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
class DbRouterTS {
    private primary = "Primary_Node";
    private replicas = ["Replica_Node_1", "Replica_Node_2"];
    private counter = 0;

    public route(sql: string): string {
        const clean = sql.trim().toUpperCase();
        if (clean.startsWith("SELECT")) {
            const node = this.replicas[this.counter % this.replicas.size];
            this.counter++;
            return node;
        }
        return this.primary;
    }
}
const router = new DbRouterTS();
console.log("TS Route SELECT:", router.route("SELECT * FROM table"));
console.log("TS Route DELETE:", router.route("DELETE FROM table"));
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Hardcoding Database Connections
Connecting your application code to only one database endpoint. Scaling reads requires setting up two connection strings in your configuration file: \`DATABASE_WRITE_URL\` and \`DATABASE_READ_URL\`.

### 2. Reading Your Own Writes (The Lag Issue)
A user signs up (write is sent to primary), and the application immediately redirects them to their profile page (read is fetched from a replica). Because of replication lag, the profile query arrives at the replica *before* the sync log. The profile page throws a "User Not Found" error!
* **Good:** Force read queries to go to the primary node for 2 seconds immediately after a write action.

---

## 🔍 Interview Corner

### Q1: What is the primary purpose of a Read Replica?
The primary purpose is **Read Scaling**. By offloading read-only queries (\`SELECT\`) to replicas, you reduce the CPU and I/O load on the primary node, allowing it to handle more write transactions.

### Q2: How does an application handle the "read-your-own-writes" problem with replication lag?
The standard solution is **Sticky Routing** (or Session Pinning): after a user performs a write operation, the application forces all subsequent read queries from that user's session to be routed to the **Primary** node for a short grace period (e.g. 2-5 seconds) before falling back to read replicas.

---

## 📝 Summary

* **Read Replicas** scale read-heavy workloads by copying data from the primary node.
* Application code must split traffic: **Writes** go to Primary, **Reads** go to Replicas.
* Watch out for **Replication Lag** errors when reading data immediately after writing it.
`;
