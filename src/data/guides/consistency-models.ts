export const content = `
# Consistency Models: The Social Media Post! 📱

## 📱 Introduction: The Instagram Post

Imagine you are sitting next to a friend at a coffee shop, and you post a **photo of your latte** to Instagram:

* **Strong Consistency (Instant Sync):** The moment you tap "Post", the image is saved to all servers instantly. If your friend refreshes their screen a millisecond later, they see your photo immediately. Both of you see the exact same view of the world.
* **Eventual Consistency (Delayed Sync):** You tap "Post". The image is saved on the local California server, but it takes **10 seconds** to replicate to the London server where your friend's account is routed. If your friend refreshes immediately, they see nothing. If they wait 10 seconds, the photo *eventually* appears.

In distributed databases, **Consistency Models** define the rules for when and how different nodes in your system see updates to data.

---

## 🏗️ Types of Consistency Models

Distributed databases use different rules depending on performance requirements:

\`\`\`
    STRONG CONSISTENCY (Atomic Sync)
    Tx 1 Write "A" ---> [Node 1] --(Blocks Reads)---> [Node 2] ---> Success
    Tx 2 Read          [Node 1] -------------------> Returns "A"
    
    EVENTUAL CONSISTENCY (Lazy Sync)
    Tx 1 Write "A" ---> [Node 1] ---------------------------------> Success
                           |
                           +---(Syncs in background)---> [Node 2]
    Tx 2 Read                                            [Node 2] -> Returns "Old Val" (Lag)
\`\`\`

### 1. Strong Consistency (Linearizability)
All read operations are guaranteed to return the value of the most recent write, regardless of which database node is queried.
* *Tradeoff:* High latency. All writes must lock reads across all nodes during sync.

### 2. Eventual Consistency
Replication logs are copied in the background. If no new updates are made, all replicas will *eventually* sync up and return identical values.
* *Tradeoff:* Blazing-fast write speeds, but readers will occasionally see stale data.

### 3. Causal Consistency
Guarantees that operations that are causally related (e.g. a reply to a message) will be seen in the same correct order by all readers.
* *Example:* You cannot see the comment reply before the main comment is visible.

---

## 💻 Code Examples: Simulating Read-After-Write

Let's simulate how eventual consistency displays delayed data updates.

### Multi-Language Execution

##### Python
\`\`\`python
import time

class EventualConsistencyDB:
    def __init__(self):
        self.primary = "V1"
        self.replica = "V1"
        self.last_write_time = 0
        self.sync_delay = 1.0 # 1 second sync lag

    def write(self, value):
        self.primary = value
        self.last_write_time = time.time()
        print(f"Primary updated to {value}")

    def read_replica(self):
        # Check if background replication has completed
        if time.time() - self.last_write_time >= self.sync_delay:
            self.replica = self.primary
        return self.replica

db = EventualConsistencyDB()
db.write("V2")

print("Read immediately (stale):", db.read_replica()) # V1
time.sleep(1.1)
print("Read after delay (eventual sync):", db.read_replica()) # V2
\`\`\`

##### Java
\`\`\`java
public class ConsistencyDemo {
    static class EventualDb {
        String primary = "V1";
        String replica = "V1";
        long writeTime = 0;

        void write(String val) {
            primary = val;
            writeTime = System.currentTimeMillis();
        }

        String readReplica() {
            // Replicate after 100ms
            if (System.currentTimeMillis() - writeTime >= 100) {
                replica = primary;
            }
            return replica;
        }
    }

    public static void main(String[] args) throws Exception {
        EventualDb db = new EventualDb();
        db.write("V2");
        System.out.println("Java Instant Read: " + db.readReplica()); // V1
        Thread.sleep(110);
        System.out.println("Java Delayed Read: " + db.readReplica()); // V2
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <thread>
#include <chrono>

class EventualDb {
    std::string primary = "V1";
    std::string replica = "V1";
    std::chrono::steady_clock::time_point writeTime;
public:
    void write(const std::string& val) {
        primary = val;
        writeTime = std::chrono::steady_clock::now();
    }
    
    std::string readReplica() {
        auto now = std::chrono::steady_clock::now();
        if (std::chrono::duration_cast<std::chrono::milliseconds>(now - writeTime).count() >= 100) {
            replica = primary;
        }
        return replica;
    }
};

int main() {
    EventualDb db;
    db.write("V2");
    std::cout << "C++ Instant: " << db.readReplica() << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(110));
    std::cout << "C++ Delayed: " << db.readReplica() << std::endl;
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
class EventualDbTS {
    private primary = "V1";
    private replica = "V1";
    private writeTime = 0;

    public write(val: string) {
        this.primary = val;
        this.writeTime = Date.now();
    }

    public readReplica(): string {
        if (Date.now() - this.writeTime >= 100) {
            this.replica = this.primary;
        }
        return this.replica;
    }
}
const db = new EventualDbTS();
db.write("V2");
console.log("TS Instant:", db.readReplica()); // V1
setTimeout(() => {
    console.log("TS Delayed:", db.readReplica()); // V2
}, 110);
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Assuming Eventual Consistency is instant
Writing code that depends on immediate consistency (like checking account balance directly from a replica node immediately after a withdraw action). The user can over-draw because the replica shows outdated cash totals.

### 2. Ignoring Causal Consistency in Message Apps
Allowing comment replies to display on the screen before the main message has synced, making chat rooms look completely disorganized.

---

## 🔍 Interview Corner

### Q1: What is "Eventual Consistency"?
**Eventual Consistency** is a weak consistency model in distributed systems where replicas receive background updates. If no further writes are made, all replicas will eventually synchronize and return the identical data value, trading temporary data staleness for low latency.

### Q2: What is Causal Consistency?
**Causal Consistency** is a consistency model that guarantees that operations that are causally related (e.g., a question followed by an answer) are seen in the same order by all nodes in the system. Operations that are not causally related are evaluated concurrently.

---

## 📝 Summary

* **Consistency Models** define how nodes see updates in a distributed system.
* **Strong Consistency** guarantees instant synchronization but is slow.
* **Eventual Consistency** enables fast writes but allows temporary reading of stale data.
`;
