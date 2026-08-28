export const content = `
# How Database Indexes Work: The Dictionary Tabs! 📖

## 📖 Introduction: The Giant Word Book

Imagine you are looking up the word **"Sky"** in a giant 1,000-page paper dictionary:

* **Without Tabs (Table Scan):** You open page 1, read the words, flip to page 2, read the words... all the way to page 800. This takes you 30 minutes.
* **With Side Tabs (Indexes):** The dictionary has letters printed on the side edge (\`A\`, \`B\`, \`C\`...). You put your thumb on the \`S\` tab, flip directly to the \`S\` section, and quickly scan for "Sky". This takes you 5 seconds!

In databases, an **Index** is this exact side tab! It is a separate, highly organized helper structure that points directly to where the actual data rows are stored.

---

## 🛠️ The Mechanics of Index Lookups

Normally, database tables are stored as a disorganized pile of rows called a **Heap**. When you look for a row, the database has to scan the entire pile (Table Scan).

An index is a sorted copy of a specific column (e.g. \`username\`), along with pointers (address IDs) back to the original rows:

\`\`\`
        INDEX STRUCTURE (Sorted)                   DATA TABLE (Disorganized Heap)
    +-----------------+---------+              +-----+----------+--------------+
    | Username (Key)  | Pointer |              | ID  | Username | Country      |
    +-----------------+---------+              +-----+----------+--------------+
    | Alice           | Row #3  | --------+    | 1   | Charlie  | USA          |
    | Bob             | Row #2  | ------+ |    | 2   | Bob      | Canada       | <---+
    | Charlie         | Row #1  | ----+ | |    | 3   | Alice    | UK           | <-----+
    +-----------------+---------+     | | |    +-----+----------+--------------+
                                      | | |
                                      | | +--> Points to Alice's row (Fast!)
                                      | +----> Points to Bob's row
                                      +------> Points to Charlie's row
\`\`\`

Whenever you run a query filtering on \`username\`, the database engine looks up the value in the sorted index first, finds the physical address pointer, and jumps directly to that spot on the disk!

---

## 💻 Code Examples

Let's see how indexes improve lookup times in different languages.

### SQL Index Creation
\`\`\`sql
-- Standard index on a single column
CREATE INDEX idx_user_emails ON users(email);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3
import time

def run_index_demo():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT)")
    
    # Insert 10,000 users
    users = [(i, f"user{i}@test.com") for i in range(10000)]
    cursor.executemany("INSERT INTO users VALUES (?, ?)", users)
    conn.commit()
    
    # Query without index
    start = time.perf_counter()
    cursor.execute("SELECT * FROM users WHERE email = 'user8888@test.com'")
    cursor.fetchone()
    no_index_time = time.perf_counter() - start
    
    # Create Index
    cursor.execute("CREATE INDEX idx_email ON users(email)")
    conn.commit()
    
    # Query with index
    start = time.perf_counter()
    cursor.execute("SELECT * FROM users WHERE email = 'user8888@test.com'")
    cursor.fetchone()
    index_time = time.perf_counter() - start
    
    print(f"Without Index: {no_index_time:.6f} seconds")
    print(f"With Index: {index_time:.6f} seconds")
    conn.close()

run_index_demo()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class IndexDemo {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        stmt.execute("CREATE TABLE users (id INT PRIMARY KEY, email TEXT)");
        stmt.execute("CREATE INDEX idx_email ON users(email)");
        
        // Let's explain query plan in Java
        ResultSet rs = stmt.executeQuery("EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'test@test.com'");
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
    for(int i = 0; i < argc; i++) {
        if (std::string(azColName[i]) == "detail") {
            std::cout << "C++ Plan Detail: " << argv[i] << std::endl;
        }
    }
    return 0;
}

void runIndex() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    sqlite3_exec(db, "CREATE TABLE users (id INT PRIMARY KEY, name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE INDEX idx_name ON users(name);", nullptr, nullptr, nullptr);
    
    // Check query plan
    sqlite3_exec(db, "EXPLAIN QUERY PLAN SELECT * FROM users WHERE name = 'Alice';", callback, nullptr, nullptr);
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runIndex() {
    const db = new Database(':memory:');
    db.serialize(() => {
        db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
        db.run("CREATE INDEX idx_name ON users(name)");
        
        db.each("EXPLAIN QUERY PLAN SELECT * FROM users WHERE name = 'Alice'", (err, row: any) => {
            if (row) {
                console.log("TypeScript Index Scan:", row.detail);
            }
        });
    });
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Forgetting to Index Foreign Keys
JOIN queries require matching rows across tables. If you don't index foreign key columns, the database has to scan the entire parent and child tables recursively, freezing operations!

### 2. Over-indexing Tables
Creating indexes on columns that are rarely queried. Remember, every index must be rewritten during \`INSERT\`, \`UPDATE\`, and \`DELETE\` queries, which degrades write performance.

---

## 🔍 Interview Corner

### Q1: When should you NOT create an index on a column?
Do not index columns with **low cardinality** (columns containing very few unique options, such as \`gender\` or \`is_active\` flags). The query optimizer will skip the index tree and run a sequential table scan because it's faster.

### Q2: What is the difference between a Table Scan and an Index Scan?
* **Table Scan (Seq Scan):** The database reads every single row on disk to find matches.
* **Index Scan:** The database navigates a sorted tree index to locate specific pointers, retrieving rows directly.

---

## 📝 Summary

* **Indexes** are separate, sorted maps of columns that speed up read searches.
* They store values and **pointers** directly linking back to rows in the raw table heap.
* Indexes speed up queries but slow down write operations due to tree rebalancing.
`;
