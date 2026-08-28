export const content = `
# CAP Theorem: The Telephone Game! ☎️

## ☎️ Introduction: The Separated Classrooms

Imagine two teachers, **Mrs. Smith (Node A)** and **Mr. Jones (Node B)**, sitting in separate classrooms:

Normally, they have a walkie-talkie to keep their lesson plans in sync:
* **Consistency (C):** If Mrs. Smith changes the homework date, she tells Mr. Jones over the walkie-talkie. If a student asks either teacher, they both give the same date.
* **Availability (A):** If a student asks a teacher a question, the teacher answers immediately. They never say: *"I cannot talk to you right now."*

### The Disaster: A Network Partition (P)
Suddenly, the walkie-talkie battery dies (the network connection is cut!). 

A student walks up to Mr. Jones and asks: *"When is the homework due?"* Mr. Jones cannot contact Mrs. Smith. He must choose:
* **Choice 1 (Consistency / CP):** He says: *"I cannot answer you because my walkie-talkie is down."* (System is consistent, but **not Available**).
* **Choice 2 (Availability / AP):** He guesses based on yesterday's info and gives an answer. (System is available, but **not Consistent** if Mrs. Smith changed the date recently).

This is the **CAP Theorem**! In a distributed database, you **must** choose between Consistency or Availability when a network partition occurs.

---

## 📐 The CAP Theorem Pillars

\`\`\`
                             CAP TRIANGLE
                             Consistent (C)
                             /            \\
                            /              \\
                           /   [Impossible  \\
                          /     in WANs]     \\
                         /                    \\
           Partition (P) ---------------------- Available (A)
\`\`\`

In distributed systems, networks are guaranteed to fail occasionally. Therefore, **Partition Tolerance (P)** is a must. You are left choosing between:

### 1. CP Databases (Consistency + Partition Tolerance)
If a network break occurs, the database blocks write or read operations on isolated nodes to prevent split-brain errors (returning out-of-sync data).
* *Examples:* MongoDB, Google Spanner, HBase.

### 2. AP Databases (Availability + Partition Tolerance)
If a network break occurs, all nodes continue accepting reads and writes, returning stale data if necessary, and sync changes later when the connection heals.
* *Examples:* Cassandra, DynamoDB, CouchDB.

---

## 💻 Code Examples: Simulating CP vs. AP Nodes

Let's write a python/code script simulating how CP and AP nodes behave during a network split.

### Multi-Language Execution

##### Python
\`\`\`python
class DistributedNode:
    def __init__(self, name, mode="AP"):
        self.name = name
        self.mode = mode # AP or CP
        self.data = "Initial Value"
        self.network_connected = True

    def query(self):
        if not self.network_connected:
            if self.mode == "CP":
                # CP: Raise error because we can't guarantee consistency
                raise ConnectionError("Node isolated. Blocking query to maintain consistency!")
            else:
                # AP: Return local stale data
                return f"{self.data} (Warning: Stale AP mode)"
        return self.data

node_cp = DistributedNode("Node-1", mode="CP")
node_ap = DistributedNode("Node-2", mode="AP")

# Simulate network partition
node_cp.network_connected = False
node_ap.network_connected = False

print("AP Node Response:", node_ap.query())
try:
    node_cp.query()
except ConnectionError as e:
    print("CP Node Response:", e)
\`\`\`

##### Java
\`\`\`java
public class CapDemo {
    static class Node {
        String data = "V1";
        boolean modeCP = true;
        boolean partition = false;

        public String read() throws Exception {
            if (partition && modeCP) {
                throw new Exception("CP Mode: Blocked read to prevent stale data.");
            }
            return data + (partition ? " (AP Stale)" : "");
        }
    }

    public static void main(String[] args) {
        Node node = new Node();
        node.partition = true; // Trigger partition
        
        // Test AP
        node.modeCP = false;
        try { System.out.println("AP: " + node.read()); } catch(Exception e){}
        
        // Test CP
        node.modeCP = true;
        try { System.out.println("CP: " + node.read()); } catch(Exception e){
            System.out.println("CP caught: " + e.getMessage());
        }
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <stdexcept>

class Node {
public:
    std::string data = "Version-1";
    bool isCP = true;
    bool isPartitioned = false;

    std::string readData() {
        if (isPartitioned && isCP) {
            throw std::runtime_error("CP: Isolated node query blocked.");
        }
        return data + (isPartitioned ? " (AP Stale)" : "");
    }
};

int main() {
    Node node;
    node.isPartitioned = true;
    
    // Test AP
    node.isCP = false;
    std::cout << "AP Output: " << node.readData() << std::endl;
    
    // Test CP
    node.isCP = true;
    try {
        node.readData();
    } catch (const std::exception& e) {
        std::cout << "CP Output: " << e.what() << std::endl;
    }
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
class CapNode {
    public data = "V1";
    public isCP = true;
    public partitioned = false;

    public query(): string {
        if (this.partitioned && this.isCP) {
            throw new Error("CP Blocked: Cannot guarantee consistency.");
        }
        return this.data + (this.partitioned ? " (AP Stale)" : "");
    }
}
const cn = new CapNode();
cn.partitioned = true;
cn.isCP = false;
console.log("TS AP:", cn.query());
cn.isCP = true;
try { cn.query(); } catch (e: any) { console.log("TS CP:", e.message); }
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Thinking CA Databases exist in the real world
Claiming a distributed database is a **CA** (Consistent and Available) database. In a real-world wide area network (WAN), router connections fail. If a network partition occurs, a database **cannot** choose Consistency and Availability at the same time.

### 2. Confusing ACID Consistency vs. CAP Consistency
* **ACID Consistency:** Your database schema rules are valid (no foreign key violations).
* **CAP Consistency:** Every single node in the cluster returns the exact same data value at the same time.

---

## 🔍 Interview Corner

### Q1: Can a database be CA (Consistent and Available)?
No. In distributed database systems, network partitions (P) are inevitable. When a partition occurs, the system must decide whether to stop isolated nodes (sacrificing Availability) or accept writes on isolated nodes (sacrificing Consistency). Therefore, you must choose either **CP** or **AP**.

### Q2: What is the PACELC theorem?
**PACELC** is an extension of the CAP theorem. It states: **If** there is a **P**artition, how does the system choose between **A**vailability or **C**onsistency? **Else** (when the network is running normally), how does the system choose between **L**atency or **C**onsistency?

---

## 📝 Summary

* **CAP Theorem** dictates tradeoffs in distributed systems during network partitions.
* **Consistency (C):** All nodes see the same data at the same time.
* **Availability (A):** Every request receives a successful response.
* **Partition Tolerance (P):** The system survives connection cuts.
`;
