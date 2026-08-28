export const content = `
# Database Scaling & High Availability: The Restaurant Chef! 🏎️

## 🏎️ Introduction: The Crowded Pizza Shop

Imagine you own a popular pizza shop that goes from **10 customers** a day to **10,000 customers** a day:

* **Vertical Scaling (Bigger Chef):** You fire your chef and hire a super-chef who can cook twice as fast on a massive, expensive stove. But there's a limit: even the best chef only has two hands. If they get sick, your restaurant closes.
* **Horizontal Scaling (More Branches):** You open **10 separate pizza shops** in different neighborhoods. You distribute the hungry crowd across these branches.
* **High Availability (The Backup Chef):** In each kitchen, you hire a **backup chef** who stands in the corner. If the main chef burns their hand, the backup chef instantly grabs the spatula and starts cooking without the customers noticing a thing.

In system design, this is **Database Scaling** and **High Availability (HA)**! 

* Scaling is how you handle more traffic (Vertical vs. Horizontal).
* High Availability is how you keep your database running 24/7, even if servers catch fire!

---

## 🏗️ Scaling and HA Architecture

Let's look at how a high availability cluster manages failover:

\`\`\`
        ACTIVE-PASSIVE HIGH AVAILABILITY CLUSTER
                    Client Application
                            |
                     (Writes / Reads)
                            |
                            v
        +----------------------------------------+
        |   LOAD BALANCER / PROXY (HAProxy)      |  <--- Routes traffic to active node
        +----------------------------------------+
              |                                |
        (Active Path)                   (Standby Sync)
              |                                |
              v                                v
     +-----------------+              +-----------------+
     |   ACTIVE NODE   | ---(WAL Sync)--> |  STANDBY NODE   |
     |   (Primary)     |              |  (Passive)      |
     +-----------------+              +-----------------+
              | (CRASHES!)                     | (PROMOTED!)
              X                                v
      [Traffic cut off]               [Becomes Active Node]
\`\`\`

### Key Performance Metrics
* **RTO (Recovery Time Objective):** How much *time* does it take to recover your database after a crash? (e.g. "We must failover in under 30 seconds").
* **RPO (Recovery Point Objective):** How much *data loss* can you tolerate? (e.g. "We must lose no more than 5 seconds of transaction logs").

---

## 💻 Code Examples: Simulating Failover in Client Connections

Let's write a simple client driver in code that automatically switches connections to a standby server if the active server fails.

### Multi-Language Execution

##### Python
\`\`\`python
import time

class DatabaseCluster:
    def __init__(self):
        self.primary_node = "Active_Node_Server_A"
        self.standby_node = "Standby_Node_Server_B"
        self.primary_alive = True

    def query(self):
        if self.primary_alive:
            try:
                # Simulate a database call
                return f"Success response from {self.primary_node}"
            except Exception:
                self.primary_alive = False
                
        # Failover logic: Route to standby node
        print("ALERT: Primary node down! Triggering Failover...")
        return f"Success response from promoted {self.standby_node}"

cluster = DatabaseCluster()
print(cluster.query())

# Simulate primary node crash
cluster.primary_alive = False
print(cluster.query())
\`\`\`

##### Java
\`\`\`java
public class HighAvailabilityDemo {
    static class Cluster {
        String activeNode = "Server-A";
        String standbyNode = "Server-B";
        boolean activeAlive = true;

        public String execute() {
            if (!activeAlive) {
                System.out.println("HA Alert: Failover triggered to " + standbyNode);
                activeNode = standbyNode; // Promote standby
                activeAlive = true;
            }
            return "Executed on " + activeNode;
        }
    }

    public static void main(String[] args) {
        Cluster c = new Cluster();
        System.out.println(c.execute());
        
        c.activeAlive = false; // Crash
        System.out.println(c.execute());
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>

class HaCluster {
    std::string activeNode = "Primary-Server";
    std::string standbyNode = "Backup-Server";
    bool primaryOnline = true;
public:
    void triggerCrash() { primaryOnline = false; }
    
    std::string query() {
        if (!primaryOnline) {
            std::cout << "Failover: Routing to Standby node." << std::endl;
            activeNode = standbyNode;
            primaryOnline = true;
        }
        return "Query fetched from: " + activeNode;
    }
};

int main() {
    HaCluster cluster;
    std::cout << cluster.query() << std::endl;
    cluster.triggerCrash();
    std::cout << cluster.query() << std::endl;
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
class HaClusterTS {
    private primary = "Server_A";
    private standby = "Server_B";
    private primaryOnline = true;

    public simulateCrash() {
        this.primaryOnline = false;
    }

    public query(): string {
        if (!this.primaryOnline) {
            console.log("TS: Failover triggered.");
            this.primary = this.standby;
            this.primaryOnline = true;
        }
        return \`Result from \${this.primary}\`;
    }
}
const cluster = new HaClusterTS();
console.log(cluster.query());
cluster.simulateCrash();
console.log(cluster.query());
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Split-Brain Scenario
A network partition cuts the connection between the Active node and the Standby node, but both remain connected to the internet. 
* **The Error:** The Standby node thinks the Active node died and promotes itself. Now you have **two active primaries** accepting writes! This corrupts your database files.
* **Good:** Use a **Quorum** system (at least 3 nodes) to vote on who remains primary.

### 2. Manual Failover
Relying on a human systems engineer to wake up at 3:00 AM, log into the server, and promote a replica to primary. Failover must be completely automated using monitoring tools (like Sentinel or ZooKeeper).

---

## 🔍 Interview Corner

### Q1: What is the difference between RTO and RPO in High Availability design?
* **RTO (Recovery Time Objective):** The maximum tolerable *duration of downtime* before the system is restored.
* **RPO (Recovery Point Objective):** The maximum tolerable *amount of data loss* measured in time (e.g. losing 5 minutes of logs) during an outage.

### Q2: What is a "Split-Brain" scenario, and how do you prevent it?
A **Split-Brain** occurs in a cluster during a network partition when nodes split into isolated groups, and multiple nodes promote themselves to be the Active primary. It is prevented by using a **quorum consensus** algorithm (requires a majority of nodes to vote on promotions).

---

## 📝 Summary

* **Vertical scaling** adds CPU/RAM; **Horizontal scaling** adds more database servers.
* **High Availability (HA)** ensures system survival during hardware crashes.
* **Failover** promotes a standby node to active status automatically.
* Protect against **Split-Brain** issues using quorum-based cluster voting.
`;
