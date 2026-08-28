export const content = `
# Transactions in SQL: The Candy Bar Trade! 🍫

## 🍫 Introduction: The Playground Swap

Imagine you are on the playground and want to trade your **Snickers bar** for your friend's **Skittles bag**:

* **The Risky Way:** You hand your friend the Snickers bar. But before they hand you the Skittles, the school bell rings, and they run inside! You lost your chocolate and got nothing.
* **The Safe Way (Transaction):** Both of you hold out your candy. You count: *"One, Two, Three, Swap!"* You both exchange candies at the exact same moment. If either of you lets go early, the swap is cancelled, and both keep their original candy.

In databases, this swap is called a **Transaction**! 

A transaction is a group of database commands that are executed as a **single unit of work**. Either **all** the commands succeed together, or **none** of them do (the database rolls back to its original state).

---

## 🛡️ ACID Properties: The Code of Trust

Every transaction follows the **ACID** rules to guarantee safety:

\`\`\`
                  +--------------------------------+
                  |       BEGIN TRANSACTION        |
                  +--------------------------------+
                                  |
                        Execute SQL Writes
                        - Deduct from Account A
                        - Deposit into Account B
                                  |
                     (Any statement failed?)
                     /                     \
                  YES                       NO
                  /                           \
                 v                             v
         [ROLLBACK]                        [COMMIT]
   (All changes erased)              (All changes saved)
\`\`\`

1. **Atomicity (All-or-Nothing):** A transaction is like an atom—it cannot be split. If a transaction has 10 updates, and step 9 fails, all previous 8 steps are erased (**\`ROLLBACK\`**).
2. **Consistency (Valid State):** The database must move from one valid state to another, obeying all constraints (like primary keys and checks).
3. **Isolation (No Peeking):** If multiple users are updating the database at the same time, their transactions are isolated from each other. They cannot see each other's half-finished steps.
4. **Durability (Permanence):** Once a transaction is saved (**\`COMMIT\`**), it is written to non-volatile disk. Even if the server loses power or crashes a millisecond later, your data is safe.

---

## 💻 Code Examples

Let's write a transaction to transfer money between two bank accounts.

### SQL Transaction Script
\`\`\`sql
-- Start the transaction block
BEGIN TRANSACTION;

-- Step 1: Deduct $50 from Alice
UPDATE bank_accounts 
SET balance = balance - 50 
WHERE owner = 'Alice';

-- Step 2: Deposit $50 into Bob
UPDATE bank_accounts 
SET balance = balance + 50 
WHERE owner = 'Bob';

-- If both succeeded, save the changes permanently!
COMMIT;

-- If anything failed, discard changes:
-- ROLLBACK;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_transaction_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE bank (name TEXT, balance REAL)")
    cursor.executemany("INSERT INTO bank VALUES (?, ?)", [
        ('Alice', 100.00), ('Bob', 50.00)
    ])
    conn.commit()
    
    try:
        # Start transaction block
        cursor.execute("BEGIN TRANSACTION")
        
        # Deduct from Alice
        cursor.execute("UPDATE bank SET balance = balance - 40.00 WHERE name = 'Alice'")
        
        # Deposit to Bob
        cursor.execute("UPDATE bank SET balance = balance + 40.00 WHERE name = 'Bob'")
        
        # Simulate a crash or exception inside transaction
        # raise ValueError("Power failure simulation!")
        
        # If everything is ok, commit
        conn.commit()
        print("Transaction committed successfully!")
    except Exception as e:
        # Rollback erases the updates!
        conn.rollback()
        print(f"Transaction failed, rolled back! Error: {e}")
        
    cursor.execute("SELECT * FROM bank")
    print("Balances:", cursor.fetchall()) # Balances will remain unchanged if rolled back!
    conn.close()

run_transaction_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class TransactionsExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE bank (name TEXT, bal REAL)");
        stmt.execute("INSERT INTO bank VALUES ('Alice', 100.0), ('Bob', 50.0)");
        
        // Turn off auto-commit in JDBC to manually manage transaction boundaries!
        conn.setAutoCommit(false);
        try {
            stmt.executeUpdate("UPDATE bank SET bal = bal - 50.0 WHERE name = 'Alice'");
            stmt.executeUpdate("UPDATE bank SET bal = bal + 50.0 WHERE name = 'Bob'");
            conn.commit(); // Save changes
            System.out.println("Java: Transaction Committed.");
        } catch (SQLException e) {
            conn.rollback(); // Discard changes
            System.out.println("Java: Transaction Rolled Back.");
        } finally {
            conn.setAutoCommit(true);
        }
        conn.close();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

void runTransactions() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE bank (name TEXT, bal REAL);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO bank VALUES ('Alice', 100.0), ('Bob', 50.0);", nullptr, nullptr, nullptr);
    
    // SQLite manual transaction boundaries
    sqlite3_exec(db, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "UPDATE bank SET bal = bal - 20.0 WHERE name = 'Alice';", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "UPDATE bank SET bal = bal + 20.0 WHERE name = 'Bob';", nullptr, nullptr, nullptr);
    
    // Commit transaction
    int rc = sqlite3_exec(db, "COMMIT;", nullptr, nullptr, nullptr);
    if (rc == SQLITE_OK) {
        std::cout << "C++ Transaction Completed Successfully." << std::endl;
    }
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runTransactions() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE bank (name TEXT, bal REAL)");
        db.run("INSERT INTO bank VALUES ('Alice', 100.0), ('Bob', 50.0)");
        
        // Begin transaction
        db.run("BEGIN TRANSACTION");
        db.run("UPDATE bank SET bal = bal - 30.0 WHERE name = 'Alice'");
        db.run("UPDATE bank SET bal = bal + 30.0 WHERE name = 'Bob'");
        
        db.run("COMMIT", (err) => {
            if (!err) {
                console.log("TS Transaction Saved.");
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Long-Running Transactions
Leaving a transaction open while waiting for user interaction (e.g. keeping a transaction open while waiting for the user to click a button). This locks the table rows and blocks other database users, freezing the system!

### 2. Nesting Transactions
Trying to call \`BEGIN TRANSACTION\` inside another open transaction. Most databases don't support nested transactions natively and will throw syntax or runtime errors. Use **Savepoints** instead.

---

## 🔍 Interview Corner

### Q1: What is the meaning of ACID in database systems?
* **A - Atomicity:** Complete transaction execution or no execution at all (All-or-Nothing).
* **C - Consistency:** Transactions move the database from one valid state to another, preserving all schemas and checks.
* **I - Isolation:** Concurrent transaction executions do not interfere or read uncommitted edits of each other.
* **D - Durability:** Once committed, changes are written to disk and survive server power failures.

### Q2: What are transaction isolation levels?
Isolation levels control the balance between consistency and performance. The four standard levels are:
1. **Read Uncommitted:** Fast, but allows dirty reads (reading unsaved data).
2. **Read Committed:** Prevents dirty reads (only reads saved data).
3. **Repeatable Read:** Guarantees that reading the same row twice inside a transaction returns the identical values.
4. **Serializable:** Strictly orders transaction executions. Slowest but safest (prevents phantom reads).

---

## 📝 Summary

* A **Transaction** groups multiple database updates into a single atomic block.
* Transations are **All-or-Nothing**: either all succeed (**\`COMMIT\`**) or all fail (**\`ROLLBACK\`**).
* Transactions adhere to the **ACID** properties to guarantee data safety.
`;
