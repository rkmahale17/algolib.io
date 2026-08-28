export const content = `
# ACID Properties: The Vending Machine! 🛡️

## 🛡️ Introduction: The Automatic Vending Machine

Imagine you walk up to a soda vending machine in the mall:

* **Atomicity (All-or-Nothing):** You insert a coin, select a drink, and the machine drops the soda. If the machine jams at the last second, it doesn't keep your money. It rolls back and spits your coin back out. You either get both the soda and lose the coin, or get nothing.
* **Consistency (Valid Rules):** The machine requires exactly $1.50 for a soda. You cannot cheat the machine and buy a drink with a $1.00 coin. It enforces rules.
* **Isolation (Private Swapping):** If two people try to buy a soda at the same time, the machine doesn't mix up their transactions. It processes one person, completes their swap, and then processes the next person.
* **Durability (Permanence):** Once the soda falls into the pickup bin, it is yours. Even if the mall loses power or the machine crashes a second later, the soda is physically in your hand.

In databases, **ACID** is the set of safety guarantees that ensure transactions are reliable and safe!

---

## 🏗️ The Four Pillars of ACID

A transaction must satisfy all four properties to be considered safe:

\`\`\`
                                  ACID TRUST
        +-------------------------------------------------------------+
        |  ATOMICITY     |  CONSISTENCY   |  ISOLATION     |  DURABILITY  |
        +----------------+----------------+----------------+--------------+
        | All-or-Nothing | Strict Schema  | Private Transactions| Saved to Disk|
        | Rollback on err| Constraints    | Locking/MVCC   | Write-Ahead  |
        |                |                |                | Log (WAL)    |
        +-------------------------------------------------------------+
\`\`\`

### 1. Atomicity (All-or-Nothing)
If any statement in a transaction fails, the entire transaction is aborted, and previous edits are rolled back.
* *How it works:* The database writes modifications to a temporary log before applying them to data pages. If a rollback is triggered, it reads the log backwards and reverses the writes.

### 2. Consistency (Rules & Constraints)
A transaction can only transition the database from one valid state (obeying all constraints, checks, and foreign keys) to another.
* *How it works:* If you try to insert an order with an invalid \`customer_id\` (constraint violation), the transaction is rejected.

### 3. Isolation (Concurrency Control)
Ensures that concurrent execution of transactions leaves the database in the same state as if they were executed sequentially.
* *How it works:* Implemented using locking mechanisms or version controls (MVCC).

### 4. Durability (Disk Safes)
Guarantees that once a transaction commits, it will survive system crashes or power losses.
* *How it works:* The database uses a **Write-Ahead Log (WAL)**. Changes are written to a sequential log file on disk *before* they are updated in memory pages, ensuring recovery on reboot.

---

## 💻 Code Examples: Transaction Isolation and Rollback

Let's simulate a transactional database operation with rollback handling.

### SQL Syntax
\`\`\`sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- Changes are saved and made durable!
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_acid_transaction():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE bank (name TEXT, balance REAL)")
    cursor.execute("INSERT INTO bank VALUES ('Alice', 100.0)")
    cursor.execute("INSERT INTO bank VALUES ('Bob', 50.0)")
    conn.commit()
    
    try:
        cursor.execute("BEGIN TRANSACTION")
        cursor.execute("UPDATE bank SET balance = balance - 20 WHERE name = 'Alice'")
        cursor.execute("UPDATE bank SET balance = balance + 20 WHERE name = 'Bob'")
        
        # Simulate check violation
        cursor.execute("SELECT balance FROM bank WHERE name = 'Alice'")
        if cursor.fetchone()[0] < 0:
            raise ValueError("Insufficient funds!")
            
        conn.commit()
        print("Transaction Successful.")
    except Exception as e:
        conn.rollback() # Atomicity: Rollback on error
        print(f"Transaction Aborted and Rolled Back: {e}")
        
    cursor.execute("SELECT * FROM bank")
    print("Balances:", cursor.fetchall())
    conn.close()

run_acid_transaction()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class AcidDemo {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        stmt.execute("CREATE TABLE bank (name TEXT, bal REAL)");
        stmt.execute("INSERT INTO bank VALUES ('Alice', 100.0), ('Bob', 50.0)");
        
        conn.setAutoCommit(false); // Enable manual transactions
        try {
            stmt.executeUpdate("UPDATE bank SET bal = bal - 20 WHERE name = 'Alice'");
            stmt.executeUpdate("UPDATE bank SET bal = bal + 20 WHERE name = 'Bob'");
            conn.commit(); // Durability: Save to disk
        } catch (SQLException e) {
            conn.rollback(); // Atomicity
        }
        conn.close();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

void runAcid() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE bank (name TEXT, bal REAL);", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO bank VALUES ('Alice', 100.0);", nullptr, nullptr, nullptr);
    
    // Rollback simulation
    sqlite3_exec(db, "ROLLBACK;", nullptr, nullptr, nullptr);
    
    // Table should be empty now
    auto callback = [](void*, int argc, char**, char**) {
        std::cout << "Rows found: " << argc << std::endl;
        return 0;
    };
    sqlite3_exec(db, "SELECT * FROM bank;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}

int main() {
    runAcid();
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runAcid() {
    const db = new Database(':memory:');
    db.serialize(() => {
        db.run("CREATE TABLE bank (name TEXT, bal REAL)");
        db.run("BEGIN TRANSACTION");
        db.run("INSERT INTO bank VALUES ('Alice', 100.0)");
        db.run("ROLLBACK", (err) => {
            if (!err) {
                console.log("TS: Transaction aborted successfully.");
            }
        });
    });
    db.close();
}
runAcid();
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Assuming Auto-Commit is Transaction Safe
Running multiple SQL queries in your code without wrapping them in \`BEGIN TRANSACTION\` and \`COMMIT\`. If your server crashes between query 1 and query 2, your database is corrupted!

### 2. Disabling Write-Ahead Logging (WAL)
Some developers disable WAL or set sync modes to off to speed up inserts. This breaks **Durability**—if the power cuts out, your database files will get corrupted and lose data.

---

## 🔍 Interview Corner

### Q1: What does the "Atomicity" property of ACID guarantee?
**Atomicity** guarantees that a transaction is treated as a single, indivisible unit of work. Either all SQL operations within the transaction execute successfully, or the database is rolled back to its original state, leaving no half-finished updates.

### Q2: What is the Write-Ahead Log (WAL), and which ACID property does it support?
The **Write-Ahead Log (WAL)** is a disk file where transactions are appended in order *before* they are applied to the database pages in memory. It supports **Durability** because it allows the database to replay the logs and recover unwritten changes after a crash.

---

## 📝 Summary

* **ACID** properties are the cornerstone of reliable database transaction design.
* **Atomicity:** All-or-nothing rollback.
* **Consistency:** Schema rules are maintained.
* **Isolation:** Transactions execute without interference.
* **Durability:** Committed data is safe on disk.
`;
