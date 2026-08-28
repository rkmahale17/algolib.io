export const content = `
# Set Operations: The Magic Sorting Rings! ⭕

## ⭕ Introduction: The Venn Diagram Ice Cream Club

Imagine you and your best friend are organizing an ice cream party:

* **Your Favorite Flavors (Set A):** Vanilla, Chocolate, Strawberry.
* **Friend's Favorite Flavors (Set B):** Chocolate, Mint, Cookie Dough.

To merge your lists, you use **four sorting rings**:
1. **The Combined Menu (UNION):** You merge both lists, but you don't list Chocolate twice. (Result: Vanilla, Chocolate, Strawberry, Mint, Cookie Dough).
2. **The Double Menu (UNION ALL):** You merge both lists, keeping duplicates. (Result: Chocolate listed twice).
3. **The Shared Match (INTERSECT):** You only list flavors you **both** agree on. (Result: Chocolate).
4. **Your Exclusive List (EXCEPT):** You list flavors you like **but your friend doesn't**. (Result: Vanilla, Strawberry).

In SQL, these are **Set Operations**! They let you combine the rows of two separate SELECT queries vertically.

---

## 🛠️ The Four Set Operations

For Set Operations to work, both queries **must** have:
1. The **same number of columns**.
2. **Compatible data types** in the same order.

\`\`\`
       UNION (Deduplicated)                   UNION ALL (Duplicates Kept)
   +---------+     +---------+              +---------+     +---------+
   | Table A |  +  | Table B |              | Table A |  +  | Table B |
   +---------+     +---------+              +---------+     +---------+
   | Apple   |     | Apple   |              | Apple   |     | Apple   |
   | Orange  |     | Banana  |              | Orange  |     | Banana  |
   +---------+     +---------+              +---------+     +---------+
        |                                        |
        v                                        v
   [Apple, Orange, Banana]                  [Apple, Orange, Apple, Banana]
\`\`\`

* **\`UNION\`**: Combines rows from both queries and **removes duplicates**.
* **\`UNION ALL\`**: Combines rows from both queries, **keeping duplicates**. (This is much faster because the database doesn't have to sort and remove duplicates!).
* **\`INTERSECT\`**: Returns only rows that exist in **both** query results.
* **\`EXCEPT\`** (or \`MINUS\` in Oracle): Returns rows from the first query that **do not** exist in the second query.

---

## 💻 Code Examples

Let's combine lists of students from two different clubs.

### SQL Set Queries
\`\`\`sql
-- UNION: Get all unique student names in either club
SELECT name FROM chess_club
UNION
SELECT name FROM coding_club;

-- INTERSECT: Get students who are in BOTH clubs
SELECT name FROM chess_club
INTERSECT
SELECT name FROM coding_club;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_set_operations():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE listA (name TEXT)")
    cursor.execute("CREATE TABLE listB (name TEXT)")
    
    cursor.executemany("INSERT INTO listA VALUES (?)", [('Alice',), ('Bob',)])
    cursor.executemany("INSERT INTO listB VALUES (?)", [('Bob',), ('Charlie',)])
    
    # Run INTERSECT
    cursor.execute("SELECT name FROM listA INTERSECT SELECT name FROM listB")
    print("Intersect:", [row[0] for row in cursor.fetchall()]) # ['Bob']
    
    # Run UNION (deduplicated)
    cursor.execute("SELECT name FROM listA UNION SELECT name FROM listB")
    print("Union:", [row[0] for row in cursor.fetchall()]) # ['Alice', 'Bob', 'Charlie']
    
    conn.close()

run_set_operations()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class SetOperationsExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE a (val INT)");
        stmt.execute("CREATE TABLE b (val INT)");
        stmt.execute("INSERT INTO a VALUES (1), (2)");
        stmt.execute("INSERT INTO b VALUES (2), (3)");
        
        // UNION query
        ResultSet rs = stmt.executeQuery("SELECT val FROM a UNION ALL SELECT val FROM b");
        while (rs.next()) {
            System.out.println("Union All Val: " + rs.getInt(1)); // Outputs 1, 2, 2, 3
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
    std::cout << "Except Val: " << argv[0] << std::endl;
    return 0;
}

void runSetOperations() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE t1 (val INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE t2 (val INT);", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "INSERT INTO t1 VALUES (1), (2);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO t2 VALUES (2), (3);", nullptr, nullptr, nullptr);
    
    // EXCEPT query: values in t1 that are NOT in t2
    sqlite3_exec(db, "SELECT val FROM t1 EXCEPT SELECT val FROM t2;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runSetOperations() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE t1 (val INTEGER)");
        db.run("CREATE TABLE t2 (val INTEGER)");
        db.run("INSERT INTO t1 VALUES (1), (2)");
        db.run("INSERT INTO t2 VALUES (2), (3)");
        
        db.all("SELECT val FROM t1 INTERSECT SELECT val FROM t2", (err, rows: any[]) => {
            rows.forEach(row => console.log("TS Intersect:", row.val));
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Mismatched Column Counts
Running \`SELECT name FROM listA UNION SELECT name, email FROM listB\`. This will fail because the database engine cannot align a 1-column query on top of a 2-column query!

### 2. Confusing UNION vs. JOIN
Remember: **JOINs** expand tables horizontally (adding columns from other tables side-by-side). **UNIONs** expand tables vertically (stacking rows from different queries on top of each other).

---

## 🔍 Interview Corner

### Q1: What is the difference between UNION and UNION ALL?
* **\`UNION\`** merges the results of two queries, sorts the merged set, and deletes any duplicate rows. This sorting action uses CPU and memory.
* **\`UNION ALL\`** simply stacks the results of both queries directly without sorting or deduplication. It is much faster and should be preferred unless deduplication is required.

### Q2: How does the EXCEPT operator work?
The **\`EXCEPT\`** operator (known as \`MINUS\` in Oracle) returns all unique rows from the first query that are not present in the results of the second query.

---

## 📝 Summary

* Set operations combine rows from separate queries **vertically**.
* **\`UNION\`**: Merges lists and removes duplicates.
* **\`UNION ALL\`**: Merges lists, keeping duplicates (fastest).
* **\`INTERSECT\`**: Returns matching rows only.
* **\`EXCEPT\`**: Returns rows from list A that don't exist in list B.
`;
