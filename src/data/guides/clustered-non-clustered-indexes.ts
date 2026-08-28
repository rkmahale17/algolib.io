export const content = `
# Clustered vs Non-Clustered Indexes: The Phone Book vs the Book Index! 📖

## 📖 Introduction: The Two Ways to Organize a Library

Imagine you are organizing a school library containing **1,000 books**:

* **Organizing Method A (Clustered Index):** You physically arrange the books on the shelves alphabetically by their title. The physical books *themselves* are sorted in order. If you want to find "The Hobbit", you walk directly to the \`H\` section on the shelf.
* **Organizing Method B (Non-Clustered Index):** The books are put on the shelves in random order (as they arrive). But you keep a **separate catalog book** on your desk. The catalog is sorted alphabetically: it lists "The Hobbit" and says *"Shelf 4, Position 12"*. You look up the catalog, then walk to that exact shelf coordinate to get the book.

In databases:
* A **Clustered Index** determines the physical storage order of the rows in the table.
* A **Non-Clustered Index** is a separate lookup map pointing to the row location.

---

## 🛠️ The Mechanics of Index Types

Let's compare how they look on disk:

\`\`\`
CLUSTERED INDEX (The Table IS the Index)
+------------------------------------------+
| Root Node -> Branch Nodes -> Leaf Nodes  |
+------------------------------------------+
| Leaf Nodes contain the ACTUAL ROW DATA:  |
| - ID: 1, Name: Alice, Country: UK        |
| - ID: 2, Name: Bob, Country: Canada      |
+------------------------------------------+

NON-CLUSTERED INDEX (Separate Map pointing to Table)
   INDEX STRUCTURE (Sorted Names)                 RAW DATA TABLE
+-----------------+---------------+            +----+---------+--------+
| Name (Key)      | Row Address   |            | ID | Name    | Country|
+-----------------+---------------+            +----+---------+--------+
| Alice           | Address #103  | ---------> | 101| Charlie | USA    |
| Bob             | Address #102  | ---------> | 102| Bob     | Canada |
+-----------------+---------------+            | 103| Alice   | UK     |
                                               +----+---------+--------+
\`\`\`

### The Key Differences

| Feature | Clustered Index | Non-Clustered Index |
| :--- | :--- | :--- |
| **Data Storage** | Leaf nodes contain actual data rows. | Leaf nodes contain pointers/RID to data rows. |
| **Count** | Limit of **one** per table. | Can have **multiple** per table. |
| **Physical Order**| Defines physical disk storage order. | Independent of physical disk storage order. |
| **Lookup Speed** | Fastest (no extra lookup step). | Slightly slower (requires jumping from index to row). |

---

## 💻 Code Examples

Let's see how we create both index styles in SQL databases and inspect performance.

### SQL Index Configuration
\`\`\`sql
-- 1. Clustered Index (created automatically when defining a Primary Key in most RDBMS)
CREATE TABLE members (
    member_id INT PRIMARY KEY, -- Clustered Index
    name VARCHAR(50)
);

-- 2. Non-Clustered Index
CREATE INDEX idx_member_names ON members(name);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_index_comparison():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # SQLite uses Clustered Indexes automatically for INTEGER PRIMARY KEY (Rowid tables)
    cursor.execute("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT)")
    
    # Create Non-Clustered Index
    cursor.execute("CREATE INDEX idx_student_name ON students(name)")
    
    # Query using primary key (Clustered search)
    cursor.execute("EXPLAIN QUERY PLAN SELECT * FROM students WHERE id = 10")
    print("Primary Key Search:", cursor.fetchone()[3])
    
    # Query using name (Non-Clustered search)
    cursor.execute("EXPLAIN QUERY PLAN SELECT * FROM students WHERE name = 'Alice'")
    print("Name Index Search:", cursor.fetchone()[3])
    
    conn.close()

run_index_comparison()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class ClusteredDemo {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        stmt.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT)");
        stmt.execute("CREATE INDEX idx_email ON users(email)");
        
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
    for (int i = 0; i < argc; ++i) {
        if (std::string(azColName[i]) == "detail") {
            std::cout << "C++ Index usage: " << argv[i] << std::endl;
        }
    }
    return 0;
}

void runClustered() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    sqlite3_exec(db, "CREATE TABLE users (id INT PRIMARY KEY, name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE INDEX idx_name ON users(name);", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "EXPLAIN QUERY PLAN SELECT * FROM users WHERE name = 'Alice';", callback, nullptr, nullptr);
    sqlite3_close(db);
}

int main() {
    runClustered();
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runClustered() {
    const db = new Database(':memory:');
    db.serialize(() => {
        db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
        db.run("CREATE INDEX idx_name ON users(name)");
        
        db.each("EXPLAIN QUERY PLAN SELECT * FROM users WHERE name = 'Alice'", (err, row: any) => {
            if (row) {
                console.log("TS Index search path:", row.detail);
            }
        });
    });
    db.close();
}
runClustered();
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Re-Creating Clustered Indexes on Autoincrement Keys
In read-heavy tables, setting your Clustered Index on a UUID or random value causes the database to continuously shuffle physical rows on disk to keep them sorted (page splits). Auto-incrementing numbers are best for clustered keys because new rows are always appended to the end of the file.

### 2. Thinking Non-Clustered Indexes are Free
Every non-clustered index uses extra storage space and adds write latency during inserts because both the table and index structure must be modified.

---

## 🔍 Interview Corner

### Q1: Why can a database table have only one Clustered Index?
A **Clustered Index** defines the physical sorting order of the rows on the disk. Because a table's physical rows can only be sorted in one order at a time (e.g. either alphabetically by Name OR numerically by ID), you can only have one clustered index per table.

### Q2: What is a "Covering Query", and how does it speed up queries?
A **Covering Query** is a SELECT statement where the index tree contains all the columns requested in the query. The database engine returns results directly from the index tree, completely skipping the slow disk I/O step of fetching rows from the data table.

---

## 📝 Summary

* A **Clustered Index** physically sorts the table rows on disk. Only **one** is allowed per table.
* A **Non-Clustered Index** is a separate lookup map pointing to the rows. **Multiple** are allowed.
* Choose clustered keys carefully (like auto-increment IDs) to prevent performance-killing page splits.
`;
