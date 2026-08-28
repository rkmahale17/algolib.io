export const content = `
# Indexes — Fundamentals: The Book's Index! 📖

## 📖 Introduction: The 500-Page Animal Book

Imagine you have a giant book about all the animals in the world. It has 500 pages. You want to find the page about **Dinosaurs**:

* **Option A (No Index):** You start at page 1. You flip to page 2, page 3, page 4... and read every page until you find "Dinosaurs" on page 412. This takes you 15 minutes! In databases, this is called a **Table Scan** (scanning every row).
* **Option B (With an Index):** You flip to the very back of the book where there is an alphabetical **Index**. You look up the letter "D", find "Dinosaurs", and it says: \`Page 412\`. You jump straight to page 412! This takes you 5 seconds.

In databases, an **Index** is this exact helper list! It is a special lookup table that the database uses to find rows instantly without scanning the whole table.

---

## ⚙️ How Indexes Work Under the Hood

When you create an index on a column, the database builds a hidden tree structure (usually a **B-Tree**) containing that column's values, sorted in order.

\`\`\`
                  [Root Node] (Value: M)
                   /                 \
                  /                   \
        [Branch: G]                   [Branch: T]
        /         \                   /         \
    [Leaf: A..F] [Leaf: H..L]     [Leaf: N..S] [Leaf: U..Z]
\`\`\`

To search for the name "Rex" (starts with R):
1. **Compare with Root (M):** R comes after M. Follow the right branch to T.
2. **Compare with Branch (T):** R comes before T. Follow the left leaf (N..S).
3. **Scan Leaf Node:** Scan the sorted leaf list and locate "Rex" instantly!
This takes 3 steps instead of scanning millions of rows!

### Clustered vs. Non-Clustered Indexes
* **Clustered Index:** The index defines the physical order in which rows are stored on disk. You can have only **one** clustered index per table (typically the Primary Key).
* **Non-Clustered Index:** A separate structure that stores the sorted indexed column values alongside a pointer (address) to the actual data row. You can have many non-clustered indexes.

### The Trade-off: The Cost of Speed

Indexes are awesome, but they aren't free! They have two main costs:
1. **Extra Space:** Indexes take up disk space because they store a separate sorted copy of the column.
2. **Slower Writes (Insert/Update/Delete):** Every time you add a new row, the database must write the data to the table **and** update the index tree to keep it sorted!

---

## 💻 Code Examples

Let's see how to create an index and check its impact on query performance.

### SQL Setup
\`\`\`sql
-- Create a basic table
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT
);

-- Create an Index on the category column to make category searches super fast!
CREATE INDEX idx_products_category ON products(category);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3
import time

def run_indexes_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT)")
    
    # Let's populate 10,000 dummy rows
    users = [(i, f"user{i}@example.com") for i in range(10000)]
    cursor.executemany("INSERT INTO users VALUES (?, ?)", users)
    conn.commit()
    
    # Query without index on 'email'
    start_time = time.perf_counter()
    cursor.execute("SELECT * FROM users WHERE email = 'user9999@example.com'")
    cursor.fetchone()
    no_index_time = time.perf_counter() - start_time
    
    # Create the index
    cursor.execute("CREATE INDEX idx_users_email ON users(email)")
    
    # Query with index
    start_time = time.perf_counter()
    cursor.execute("SELECT * FROM users WHERE email = 'user9999@example.com'")
    cursor.fetchone()
    index_time = time.perf_counter() - start_time
    
    print(f"Time without index: {no_index_time:.6f} sec")
    print(f"Time with index: {index_time:.6f} sec")
    
    conn.close()

run_indexes_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class IndexesExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT)");
        
        // Execute indexing statement
        stmt.execute("CREATE INDEX idx_users_email ON users(email)");
        
        // Explain query plan shows us if index is used
        ResultSet rs = stmt.executeQuery("EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'test@example.com'");
        if (rs.next()) {
            System.out.println("Query Plan: " + rs.getString("detail"));
        }
        conn.close();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

int planCallback(void* data, int argc, char** argv, char** azColName) {
    for (int i = 0; i < argc; ++i) {
        if (std::string(azColName[i]) == "detail") {
            std::cout << "Database Query Plan: " << argv[i] << std::endl;
        }
    }
    return 0;
}

void runIndexesExample() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE logs (id INT PRIMARY KEY, level TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE INDEX idx_logs_level ON logs(level);", nullptr, nullptr, nullptr);
    
    // Check if query is using the index
    sqlite3_exec(db, "EXPLAIN QUERY PLAN SELECT * FROM logs WHERE level = 'ERROR';", planCallback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runIndexesExample() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE logs (id INTEGER PRIMARY KEY, level TEXT)");
        db.run("CREATE INDEX idx_logs_level ON logs(level)");
        
        db.each("EXPLAIN QUERY PLAN SELECT * FROM logs WHERE level = 'INFO'", (err, row: any) => {
            if (row) {
                console.log("TypeScript Index Usage:", row.detail);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Indexing Columns with Low Selectivity
Creating an index on a boolean or enum column (like \`is_active\` which is either true or false, or \`gender\`). Because there are only 2 possible options, the database engine will ignore the index and scan the table anyway.

### 2. Over-Indexing
Adding indexes to every single column in your tables. This causes write queries (\`INSERT\`, \`UPDATE\`, \`DELETE\`) to become incredibly slow because the database must update 10 different index trees for every single row changed!

---

## 🔍 Interview Corner

### Q1: What is the difference between a Clustered Index and a Non-Clustered Index?
* A **Clustered Index** physically reorders the rows on the disk to match the index order. You can only have **one** clustered index per table.
* A **Non-Clustered Index** is a separate data structure that stores the sorted column values and points to the physical location of the row data. You can have **multiple** non-clustered indexes.

### Q2: Why do indexes make insert operations slower?
Whenever a new row is inserted, the database must write the data to the main data pages **and** find the correct spot in each index tree to insert the new value. It has to rebalance the B-Tree structures, which requires additional CPU and I/O cycles.

---

## 📝 Summary

* An **Index** is a sorted B-Tree structure that speeds up database read searches.
* It works like a book index: jumps straight to the data instead of scanning the table.
* Indexes speed up **Reads** but slow down **Writes** and use extra storage.
`;
