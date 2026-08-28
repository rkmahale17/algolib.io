export const content = `
# Database Replication: The Assistant Notebooks! 📝

## 📝 Introduction: The Scribe Assistants

Imagine you are a teacher writing notes on a chalkboard in front of a class:

* **The Primary Chalkboard (Primary Node):** You are the only person allowed to write on the board. You write down the homework tasks.
* **The Scribes (Replica Nodes):** There are three assistant teachers sitting in the room. Every time you write a line on the board, they immediately write it down in their personal notebooks.
* **The Read Load:** When students want to check the homework, they don't crowd around your chalkboard. They walk to the assistant teachers and read their notebooks instead.
* **Failover:** If you suddenly get sick and leave, one of the assistant teachers steps up, grabs the chalk, and becomes the new writer.

In system design, this is **Database Replication**! It is the process of copying data from one primary database server to one or more replica database servers.

---

## 🏗️ Active-Passive Replication: The Mechanics

Here is how write logs move between servers across the network:

\`\`\`
        Client Writes (INSERT / UPDATE)
                   |
                   v
        +-----------------------+
        |     PRIMARY NODE      |  <--- Handles all writes, appends to WAL
        +-----------------------+
                   |
             (Sends WAL Logs)
             /     |     \\
            v      v      v
      +-----------------------------+
      |        REPLICA NODES        |  <--- Replay logs in background, handle reads
      +-----------------------------+
\`\`\`

### Synchronous vs. Asynchronous Replication

Replication can be set up in two ways:

#### 1. Synchronous Replication (Safety First)
The Primary writes the change and waits for **all replicas** to confirm they have copied it before replying "Success" to the client.
* *Advantage:* Zero data loss if the primary crashes.
* *Disadvantage:* Very slow! If one replica server gets slow or drops network packets, write queries hang.

#### 2. Asynchronous Replication (Speed First)
The Primary writes the change, replies "Success" to the client immediately, and sends the update logs to replicas in the background.
* *Advantage:* Blazing-fast write queries!
* *Disadvantage:* **Replication Lag**. If the primary crashes before replicas copy the last changes, those changes are lost forever.

---

## 💻 Code Examples: Simulating Replication Lag

Let's write a python/code script to simulate how asynchronous replication lag occurs.

### Multi-Language Execution

##### Python
\`\`\`python
import time
import queue

class DatabaseNode:
    def __init__(self, name):
        self.name = name
        self.store = {}

class ReplicationManager:
    def __init__(self):
        self.primary = DatabaseNode("Primary")
        self.replicas = [DatabaseNode("Replica-1"), DatabaseNode("Replica-2")]
        self.log_queue = queue.Queue()

    def write_to_primary(self, key, value):
        # 1. Update primary store immediately
        self.primary.store[key] = value
        # 2. Queue replication log asynchronously
        self.log_queue.put((key, value))
        print(f"Primary saved: {key} = {value}")

    def process_replication(self):
        # Simulate background queue processing
        if not self.log_queue.empty():
            key, val = self.log_queue.get()
            for r in self.replicas:
                r.store[key] = val
                print(f"  {r.name} replicated: {key} = {val}")

rep = ReplicationManager()
rep.write_to_primary("session_id", "XYZ-42")

# Read immediately from replica (Lag simulation)
print("Replica-1 read before sync:", rep.replicas[0].store.get("session_id")) # None! (Lag)

# Trigger sync
rep.process_replication()
print("Replica-1 read after sync:", rep.replicas[0].store.get("session_id")) # XYZ-42
\`\`\`

##### Java
\`\`\`java
import java.util.*;
import java.util.concurrent.*;

public class ReplicationDemo {
    public static void main(String[] args) throws Exception {
        Map<String, String> primaryStore = new ConcurrentHashMap<>();
        Map<String, String> replicaStore = new ConcurrentHashMap<>();
        BlockingQueue<Map.Entry<String, String>> walQueue = new LinkedBlockingQueue<>();

        // Write
        primaryStore.put("user_1", "Active");
        walQueue.put(new AbstractMap.SimpleEntry<>("user_1", "Active"));

        // Read replica immediately (Simulating replication lag)
        System.out.println("Replica status (instant): " + replicaStore.get("user_1")); // Null

        // Process WAL
        Map.Entry<String, String> log = walQueue.take();
        replicaStore.put(log.getKey(), log.getValue());
        System.out.println("Replica status (sync): " + replicaStore.get("user_1")); // Active
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <unordered_map>
#include <queue>

void runReplication() {
    std::unordered_map<std::string, std::string> primary;
    std::unordered_map<std::string, std::string> replica;
    std::queue<std::pair<std::string, std::string>> wal;
    
    // Write to Primary
    primary["user_1"] = "Logged In";
    wal.push({"user_1", "Logged In"});
    
    std::cout << "Replica check: " << (replica.count("user_1") ? replica["user_1"] : "NULL") << std::endl;
    
    // Sync WAL
    auto update = wal.front();
    wal.pop();
    replica[update.first] = update.second;
    
    std::cout << "Replica sync: " << replica["user_1"] << std::endl;
}

int main() {
    runReplication();
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
class ReplicationSim {
    public primary: Record<string, string> = {};
    public replica: Record<string, string> = {};
    private wal: Array<[string, string]> = [];

    public write(key: string, val: string) {
        this.primary[key] = val;
        this.wal.push([key, val]);
    }

    public sync() {
        const update = this.wal.shift();
        if (update) {
            this.replica[update[0]] = update[1];
        }
    }
}
const sim = new ReplicationSim();
sim.write("token", "12345");
console.log("TS replica before sync:", sim.replica["token"]); // undefined
sim.sync();
console.log("TS replica after sync:", sim.replica["token"]); // 12345
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Directing Write Queries to Replicas
Configuring application code to send \`INSERT\` or \`UPDATE\` queries to read replica nodes. Replicas are read-only; they will reject write queries, throwing connection exceptions!

### 2. Not Handling Replication Lag
Assuming replica nodes are always in sync. If a user changes their password on the primary, and is immediately redirected to login via a read replica node, they will get a "Wrong Password" error because the sync log hasn't arrived yet!

---

## 🔍 Interview Corner

### Q1: What is the difference between Synchronous and Asynchronous replication?
* **Synchronous replication** requires the primary to wait for confirmation from replicas that the write log has been copied before returning success to the client, guaranteeing zero data loss at the cost of write speed.
* **Asynchronous replication** returns success immediately after the primary saves the write, copying data to replicas in the background, which is faster but subject to replication lag and potential data loss on crash.

### Q2: What is "Failover" in database replication?
**Failover** is the process where a monitoring system detects that the primary database node has crashed, automatically promotes one of the read replicas to be the new primary node, and updates DNS records to route write traffic to it.

---

## 📝 Summary

* **Replication** copies data from one primary database node to multiple replica nodes.
* **Primary** handles write operations; **Replicas** handle read operations, enabling read scaling.
* **Asynchronous** replication is fast but suffers from replication lag.
`;
