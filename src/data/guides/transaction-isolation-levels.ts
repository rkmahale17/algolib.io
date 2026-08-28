export const content = `
# Transaction Isolation Levels: The Dressing Rooms! 👗

## 👗 Introduction: The Store Dressing Rooms

Imagine you are trying on outfits in a clothing store dressing room:

* **Level 1: Read Uncommitted (No Door):** The room has no curtain. Anyone walking by can see what outfit you are holding, even if you decide not to buy it and throw it away.
* **Level 2: Read Committed (Curtain Door):** The room has a curtain. People can only see your outfit when you walk out to show your friends (after you commit). If someone checks, they won't see you half-changed.
* **Level 3: Repeatable Read (Locked Box):** You lock the dressing room door. If you look at a shirt on your hanger, look away, and look back, the shirt is guaranteed to be there. No one can steal or swap it.
* **Level 4: Serializable (One-Person Store):** The store is completely locked for everyone else. Only you can walk around and browse the racks. It is 100% private, but everyone else has to wait outside in a long queue.

In databases, **Transaction Isolation Levels** define how isolated transaction sessions are from the edits of other concurrent users.

---

## 🛑 The Three Concurrency Anomalies

Isolation levels prevent three famous data errors:

1. **Dirty Read:** Transaction A reads changes made by Transaction B before Transaction B commits. If Transaction B aborts/rolls back later, Transaction A has read fake data!
2. **Non-Repeatable Read:** Transaction A reads a row value, Transaction B updates that row and commits. Transaction A reads the row again and gets a **different value**.
3. **Phantom Read:** Transaction A queries a range of rows (e.g. \`score > 80\`). Transaction B inserts a *new row* that fits this range and commits. Transaction A runs the range query again and finds a new "phantom" row that wasn't there before!

---

## 🛠️ The Four Isolation Levels

Here is how databases trade off safety (anomalies blocked) for speed (concurrency):

\`\`\`
                       ISOLATION LEVEL TRADEOFFS
+-------------------+-------------------+-------------------+-------------------+
| Isolation Level   | Dirty Reads       | Non-Rep. Reads    | Phantom Reads     |
+-------------------+-------------------+-------------------+-------------------+
| Read Uncommitted  | ALLOWED (Fastest) | ALLOWED           | ALLOWED           |
| Read Committed    | BLOCKED           | ALLOWED           | ALLOWED           |
| Repeatable Read   | BLOCKED           | BLOCKED           | ALLOWED           |
| Serializable      | BLOCKED           | BLOCKED           | BLOCKED (Slowest) |
+-------------------+-------------------+-------------------+-------------------+
\`\`\`

---

## 💻 Code Examples

Let's see how we adjust the transaction isolation level in different languages.

### SQL Configuration
\`\`\`sql
-- Set isolation level for the current session
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

BEGIN TRANSACTION;
-- Queries run here are protected from Non-Repeatable Reads!
SELECT * FROM users WHERE id = 1;
COMMIT;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_isolation_demo():
    # Note: SQLite only supports Serialized and Read Uncommitted (via shared cache)
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Configure SQLite journal mode and isolation
    cursor.execute("PRAGMA read_uncommitted = TRUE")
    
    cursor.execute("CREATE TABLE test (val TEXT)")
    cursor.execute("INSERT INTO test VALUES ('Original')")
    conn.commit()
    
    # Session reads uncommitted values if configured
    cursor.execute("SELECT * FROM test")
    print("Value read:", cursor.fetchone()[0])
    
    conn.close()

run_isolation_demo()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class IsolationDemo {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        
        // Check supported isolation levels in JDBC
        DatabaseMetaData meta = conn.getMetaData();
        System.out.println("Supports Read Committed? " + meta.supportsTransactionIsolationLevel(Connection.TRANSACTION_READ_COMMITTED));
        
        // Set Transaction Isolation Level to Repeatable Read (in JDBC)
        conn.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
        
        conn.close();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

void runIsolation() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    // Set isolation via SQL statement
    sqlite3_exec(db, "PRAGMA read_uncommitted = ON;", nullptr, nullptr, nullptr);
    std::cout << "C++ Transaction read_uncommitted configured." << std::endl;
    
    sqlite3_close(db);
}

int main() {
    runIsolation();
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runIsolation() {
    const db = new Database(':memory:');
    db.serialize(() => {
        db.run("PRAGMA read_uncommitted = ON");
        console.log("TS read_uncommitted initialized.");
    });
    db.close();
}
runIsolation();
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Defaulting to Serializable
Setting your database's default isolation level to **Serializable** because it is the safest. This causes massive transaction lock queues and crashes your database under heavy web traffic. Use **Read Committed** (default in PostgreSQL) or **Repeatable Read** (default in MySQL) instead.

### 2. Under-estimating Read Committed anomalies
Writing reporting scripts that sum sales rows multiple times under **Read Committed**. Because other transactions are committing sales in parallel, your calculations will end up out of sync across pages.

---

## 🔍 Interview Corner

### Q1: What is a "Dirty Read" in database transactions?
A **Dirty Read** occurs when Transaction A reads modifications made by Transaction B before Transaction B has actually committed. If Transaction B rolls back later, the data read by Transaction A is invalid (it never existed permanently).

### Q2: What is the difference between Repeatable Read and Serializable?
* **Repeatable Read** guarantees that any row read during a transaction will return the identical values if read again. However, it is vulnerable to **Phantom Reads** (where new rows inserted by other transactions match the range filters).
* **Serializable** guarantees total transaction isolation, preventing all anomalies by locking ranges or using serialization checks, at the cost of concurrency speed.

---

## 📝 Summary

* **Isolation Levels** define how protected transactions are from concurrent edits.
* **Dirty Reads**, **Non-Repeatable Reads**, and **Phantom Reads** are the three main data errors.
* Isolation scales from **Read Uncommitted** (fastest/riskiest) to **Serializable** (slowest/safest).
`;
