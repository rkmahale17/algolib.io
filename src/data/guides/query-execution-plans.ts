export const content = `
# Query Execution Plans: The GPS Map! 🗺️

## 🗺️ Introduction: The Commute Route Planner

Imagine you want to drive from **your house** to **the airport**:

You open your GPS map app. The app doesn't just guess a route. It evaluates different choices:
* **Option A:** Drive down local side streets (slow, lots of stoplights).
* **Option B:** Take the highway (faster, but has tolls).
* **Option C:** A combination of backroads and highways.

The GPS calculates the travel times, chooses the fastest path, and prints out step-by-step turn directions.

In databases, a **Query Execution Plan** is this exact GPS route! When you write a SQL query, the database **Query Optimizer** builds a step-by-step execution path detailing how it will retrieve your data (e.g. using index scans, table scans, or hash joins).

---

## 🏗️ The Execution Lifecycle

Every SQL statement goes through a processing pipeline before it returns data:

\`\`\`
        Raw SQL Query (e.g., SELECT name FROM users WHERE age = 30)
                            |
                            v
               +--------------------------+
               |      PARSER & LEXER      |  <--- Checks SQL syntax rules
               +--------------------------+
                            |
                  (Syntactically Valid)
                            |
                            v
               +--------------------------+
               |     QUERY OPTIMIZER      |  <--- Calculates costs of multiple routes
               +--------------------------+
                            |
                     (Selected Route)
                            |
                            v
               +--------------------------+
               |  QUERY EXECUTION PLAN    |  <--- Step-by-step directions
               +--------------------------+
                            |
                            v
                    Database Engine
\`\`\`

### Common Plan Nodes to Look For:
1. **Seq Scan (Sequential/Table Scan):** Scanning the table page-by-page. Extremely slow for large tables.
2. **Index Scan:** Traversing a B-Tree index to locate specific row keys.
3. **Index Only Scan:** Reading data directly from the index tree without loading table blocks from disk (covering query).
4. **Nested Loop Join:** Joining tables by loops: for every row in Table A, scan Table B. Fast for small tables.
5. **Hash Join:** Building a temporary hash table in memory from one table, and mapping the other table to it. Fast for large tables.

---

## 💻 Code Examples

Let's inspect the execution plan of a query using the \`EXPLAIN\` prefix.

### SQL Syntax
\`\`\`sql
-- Ask the database to output its route choice without executing the query
EXPLAIN SELECT * FROM users WHERE id = 10;

-- Ask the database to run the query, measure timing, and print the actual plan
EXPLAIN ANALYZE SELECT * FROM users WHERE id = 10;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_explain_demo():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE log (id INTEGER PRIMARY KEY, msg TEXT)")
    
    # Check plan for primary key filter (Index Search)
    cursor.execute("EXPLAIN QUERY PLAN SELECT * FROM log WHERE id = 5")
    print("PK Query Plan:", cursor.fetchone()[3]) # USING INTEGER PRIMARY KEY
    
    # Check plan for text filter (Sequential scan)
    cursor.execute("EXPLAIN QUERY PLAN SELECT * FROM log WHERE msg = 'test'")
    print("Text Query Plan:", cursor.fetchone()[3]) # SCAN TABLE log
    
    conn.close()

run_explain_demo()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class ExplainDemo {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        stmt.execute("CREATE TABLE logs (id INT PRIMARY KEY, level TEXT)");
        
        ResultSet rs = stmt.executeQuery("EXPLAIN QUERY PLAN SELECT * FROM logs WHERE level = 'ERROR'");
        while (rs.next()) {
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
            std::cout << "C++ Plan Step: " << argv[i] << std::endl;
        }
    }
    return 0;
}

void runExplain() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    sqlite3_exec(db, "CREATE TABLE users (id INT PRIMARY KEY, val TEXT);", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "EXPLAIN QUERY PLAN SELECT * FROM users WHERE val = 'A';", callback, nullptr, nullptr);
    sqlite3_close(db);
}

int main() {
    runExplain();
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runExplain() {
    const db = new Database(':memory:');
    db.serialize(() => {
        db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, val TEXT)");
        
        db.each("EXPLAIN QUERY PLAN SELECT * FROM users WHERE val = 'A'", (err, row: any) => {
            if (row) {
                console.log("TS Query Plan:", row.detail);
            }
        });
    });
    db.close();
}
runExplain();
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Ignoring Cost Parameters
Relying strictly on query syntaxes instead of executing \`EXPLAIN ANALYZE\`. Sometimes queries look correct but trigger slow sequential scans because the optimizer believes the index cost is too high.

### 2. Not Updating Database Statistics
The query optimizer relies on cached table statistics (like row counts and value distributions) to choose the best plan. If you insert millions of rows but forget to run \`ANALYZE\`, the optimizer will choose outdated, slow query plans!

---

## 🔍 Interview Corner

### Q1: What is the difference between EXPLAIN and EXPLAIN ANALYZE?
* **\`EXPLAIN\`** generates and displays the query execution plan containing cost estimates, but does **not** execute the query.
* **\`EXPLAIN ANALYZE\`** actually executes the query, records real execution times, and outputs both the optimizer estimates and the actual performance metrics.

### Q2: What does a "Seq Scan" (Sequential Scan) in an execution plan mean?
A **Seq Scan** means the database engine has to read the entire table page-by-page from disk. For large tables, this is very slow and indicates a missing index on the columns queried in the \`WHERE\` filter.

---

## 📝 Summary

* **Query Execution Plans** are step-by-step maps detailing how queries are executed.
* Prepended using **\`EXPLAIN\`** or **\`EXPLAIN ANALYZE\`**.
* Watch out for slow operations like **Seq Scan** or **Nested Loop** on large tables.
`;
