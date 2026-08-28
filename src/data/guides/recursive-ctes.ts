export const content = `
# Recursive CTEs: The Climbing Ladder! 🪜

## 🪜 Introduction: Climbing the Ladder

Imagine you want to climb to the top of a **10-step ladder**:

How do you climb it?
1. **The Starting Foot (Anchor):** You step onto the first rung of the ladder (Rung #1).
2. **The Step-Up Rule (Recursion):** To get to the next rung, you look at where you are standing and add 1 step: \`Next = Current + 1\`.
3. **The Stop Sign (Termination):** You keep stepping up until you reach Rung #10, then you stop climbing.

In SQL, a **Recursive CTE** is this exact ladder! It is a special query that references **itself** to repeat a calculation. It is perfect for generating lists of numbers, finding paths in hierarchies, or traversing organizational charts!

---

## 🛠️ The Anatomy of a Recursive CTE

A recursive CTE has three core parts inside its \`WITH\` block:

\`\`\`
                  +--------------------------------+
                  |  ANCHOR MEMBER (Start at 1)    |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
        +-------> |  RECURSIVE JOIN (Current + 1)  |
        |         +--------------------------------+
        |                         |
  (Looping)                (Meets check?)
        |                    /          \
        |                 YES            NO
        |                 /                \
        +----------------+                  v
                                        [STOP / EXIT]
\`\`\`

\`\`\`sql
WITH RECURSIVE ladder AS (
    -- 1. Anchor Member (Base starting case)
    SELECT 1 AS rung
    
    UNION ALL
    
    -- 2. Recursive Member (Refers to itself: ladder)
    SELECT rung + 1 
    FROM ladder
    -- 3. Termination Condition (Prevents infinite loops)
    WHERE rung < 10
)
SELECT * FROM ladder;
\`\`\`

---

## 💻 Code Examples

Let's use a recursive CTE to traverse a manager-employee hierarchy.

### SQL Organizational Hierarchy Query
\`\`\`sql
-- Find all employees under Manager #1 (Alice)
WITH RECURSIVE org_chart AS (
    -- Anchor: Start with the manager
    SELECT emp_id, name, manager_id, 1 AS level
    FROM employees
    WHERE emp_id = 1
    
    UNION ALL
    
    -- Recursive: Find everyone reporting to the previous level
    SELECT e.emp_id, e.name, e.manager_id, o.level + 1
    FROM employees e
    JOIN org_chart o ON e.manager_id = o.emp_id
)
SELECT * FROM org_chart;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_recursive_cte():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE employees (id INT, name TEXT, boss_id INT)")
    cursor.executemany("INSERT INTO employees VALUES (?, ?, ?)", [
        (1, 'Alice', None),  # CEO
        (2, 'Bob', 1),       # Reports to Alice
        (3, 'Charlie', 2)    # Reports to Bob
    ])
    
    # Trace boss hierarchy using recursive CTE
    cursor.execute("""
        WITH RECURSIVE boss_chain AS (
            SELECT id, name, boss_id, 1 AS depth
            FROM employees WHERE name = 'Charlie'
            
            UNION ALL
            
            SELECT e.id, e.name, e.boss_id, bc.depth + 1
            FROM employees e
            JOIN boss_chain bc ON e.id = bc.boss_id
        )
        SELECT name, depth FROM boss_chain
    """)
    for name, depth in cursor.fetchall():
        print(f"Charlie's Boss: {name} (Level Up: {depth-1})")
        
    conn.close()

run_recursive_cte()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class RecursiveCteExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        // Generate numbers 1 to 5 using recursion
        String sql = "WITH RECURSIVE count_to_five AS (" +
                     "  SELECT 1 AS num " +
                     "  UNION ALL " +
                     "  SELECT num + 1 FROM count_to_five WHERE num < 5" +
                     ") SELECT num FROM count_to_five";
                     
        ResultSet rs = stmt.executeQuery(sql);
        while (rs.next()) {
            System.out.println("Recursion Step: " + rs.getInt("num"));
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
    std::cout << "Step: " << argv[0] << std::endl;
    return 0;
}

void runRecursive() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    const char* sql = "WITH RECURSIVE count(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM count WHERE x<3) SELECT * FROM count;";
    sqlite3_exec(db, sql, callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runRecursive() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.each(\`
            WITH RECURSIVE count(x) AS (
                SELECT 1 
                UNION ALL 
                SELECT x+1 FROM count WHERE x < 3
            ) 
            SELECT * FROM count
        \`, (err, row: any) => {
            if (row) {
                console.log("TS Recursion:", row.x);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Infinite Loops
Forgetting to write the termination condition (\`WHERE count < 10\`), or writing a condition that is never satisfied. The query will loop forever, freezing your database and eating up all available RAM.
* **Bad:** \`WITH RECURSIVE c(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM c) SELECT * FROM c;\` (Crashes).
* **Good:** \`WITH RECURSIVE c(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM c WHERE x < 100) SELECT * FROM c;\` (Safe).

### 2. Missing the RECURSIVE keyword
Many databases (like PostgreSQL and MySQL) strictly require the \`RECURSIVE\` keyword explicitly to enable self-referencing CTE queries.

---

## 🔍 Interview Corner

### Q1: What are the two main parts of a recursive CTE?
A recursive CTE contains:
1. **Anchor Member:** The base query that initializes the recursive loop (starts the ladder).
2. **Recursive Member:** The query that references the CTE name and defines how to step up/progess (UNIONed to the anchor). It must have a termination filter.

### Q2: What happens under the hood during a recursive CTE execution?
1. The engine runs the Anchor member and stores results in a temporary work table.
2. The engine evaluates the Recursive member, joining the work table to find the next level, replacing the work table contents.
3. This repeats until the Recursive member returns an empty set.
4. All intermediate results are merged via \`UNION ALL\` and returned.

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Consecutive Numbers](/problem/sql/consecutive-numbers)

---

## 📝 Summary

* **Recursive CTEs** are queries that reference themselves to loop through calculations.
* They start with an **Anchor query** (the starting rung).
* They use **\`UNION ALL\`** to merge subsequent step results.
* They must contain a **Termination condition** to prevent infinite crashes.
`;
