export const content = `
# SQL Query Optimization: Tuning Your Race Car! 🏎️

## 🏎️ Introduction: The Race Car Mechanic

Imagine you buy a high-performance **race car**:

If the tires are flat, the engine is clogged with leaves, and the driver takes a route that goes around the block five times instead of driving straight, your car will lose the race.

You have to take the car to a mechanic:
1. **The Route Check (EXPLAIN):** Look at the map and remove unnecessary detours.
2. **The Tires (Indexes):** Put on racing tires so the car grips the road instantly.
3. **The Cargo (SELECT):** Throw away heavy junk from the trunk (don't select columns you don't need!).

In databases, **Query Optimization** is this exact tuning process! It is the art of writing SQL statements so the database engine can find your data in milliseconds instead of minutes.

---

## 🛠️ The Mechanics of Optimization

When you send a query to the database, the **Query Optimizer** writes an execution map called a **Query Plan**. Here is how we make it run faster:

\`\`\`
      Slow SQL Query (Using SELECT * and nested subqueries)
                            |
                            v
               +--------------------------+
               |     QUERY OPTIMIZER      |  <--- Analyzes indexes and structures
               +--------------------------+
                            |
                 (Optimized Query Plan)
                            |
                            v
               +--------------------------+
               |  Index Scans & Joins     |  <--- Executes using minimum I/O
               +--------------------------+
                            |
                            v
                      Fast Response
\`\`\`

### 1. Reading Execution Maps: \`EXPLAIN\`
Prepend \`EXPLAIN\` or \`EXPLAIN ANALYZE\` to your SQL query. The database will describe exactly how it plans to execute the search:
* **Table Scan / Sequential Scan (Seq Scan):** The database is scanning every single row in the table. **Slow!**
* **Index Scan:** The database is jumping straight to the row using a sorted B-Tree index. **Fast!**

### 2. The Golden Rules of SQL Optimization:
* **Don't use SELECT \*:** Only query the specific columns you need. Reading extra columns increases network overhead and disk I/O.
* **Filter early with WHERE:** Filter as many rows as possible early in the query, before performing heavy table JOINs.
* **Avoid Leading Wildcards (\`LIKE '%term%'\`):** This blocks index usage. Use \`LIKE 'term%'\` instead!
* **Use JOINs instead of Subqueries:** Modern optimizers can join tables much faster than executing nested, correlated subqueries.

---

## 💻 Code Examples

Let's optimize a slow query that fetches user details.

### The Slow Query
\`\`\`sql
-- Slow: Grabs all columns and runs a slow nested subquery for every row
SELECT * 
FROM users 
WHERE id IN (
    SELECT user_id 
    FROM orders 
    WHERE amount > 100
);
\`\`\`

### The Optimized Query
\`\`\`sql
-- Fast: Queries only name and email, and joins tables using indexed foreign keys
SELECT DISTINCT u.name, u.email 
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.amount > 100;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_optimization_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT)")
    
    # Analyze query plan to verify optimization
    cursor.execute("EXPLAIN QUERY PLAN SELECT email FROM users WHERE id = 42")
    plan = cursor.fetchone()
    print("SQLite Query Plan Detail:", plan[3]) # Should output: USING PRIMARY KEY INDEX
    
    conn.close()

run_optimization_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class OptimizationExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
        
        // Query plan analysis
        ResultSet rs = stmt.executeQuery("EXPLAIN QUERY PLAN SELECT name FROM users WHERE id = 10");
        if (rs.next()) {
            System.out.println("Java Query Plan: " + rs.getString("detail"));
        }
        conn.close();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

int callback(void* data, int argc, char** argv, char** azColName) {
    for (int i = 0; i < argc; ++i) {
        if (std::string(azColName[i]) == "detail") {
            std::cout << "C++ Optimized Path: " << argv[i] << std::endl;
        }
    }
    return 0;
}

void runOptimization() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE users (id INT PRIMARY KEY, name TEXT);", nullptr, nullptr, nullptr);
    
    // Check if query is using the primary key index
    sqlite3_exec(db, "EXPLAIN QUERY PLAN SELECT name FROM users WHERE id = 1;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runOptimization() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
        
        db.each("EXPLAIN QUERY PLAN SELECT name FROM users WHERE id = 1", (err, row: any) => {
            if (row) {
                console.log("TS Optimization Plan:", row.detail);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Missing Indexes on Foreign Keys
Joining tables on columns that do not have indexes. The database is forced to do slow, full table scans on both tables to find matches. Always index foreign key columns!

### 2. Using Functions on Indexed Columns in WHERE
Writing \`WHERE UPPER(email) = 'ALICE@EXAMPLE.COM'\` on an indexed \`email\` column. The database cannot use the index because the \`UPPER()\` function changes the values at runtime!
* **Bad:** \`WHERE DATE(created_at) = '2026-08-28';\`
* **Good:** \`WHERE created_at BETWEEN '2026-08-28 00:00:00' AND '2026-08-28 23:59:59';\`

---

## 🔍 Interview Corner

### Q1: What is the difference between EXPLAIN and EXPLAIN ANALYZE?
* **\`EXPLAIN\`** displays the execution plan showing how the database optimizer *estimates* it will run the query, without actually executing it.
* **\`EXPLAIN ANALYZE\`** actually executes the query, measures real CPU and memory costs, and displays the *actual* query plan statistics.

### Q2: Why does SELECT * hurt database query performance?
1. **Network Overhead:** Sends redundant column data over the network to your application.
2. **Disk I/O:** Forces the engine to read unnecessary columns from the disk.
3. **Index Blocking:** Prevents the database from running optimized "covering index" queries where it can read results entirely from the index tree without loading table rows.

---

## 📝 Summary

* **Query Optimization** maximizes search speeds and saves database server resources.
* Use **\`EXPLAIN\`** to examine the execution plan.
* Keep queries lean: avoid **\`SELECT * \`** and filter early using indexed columns.
`;
