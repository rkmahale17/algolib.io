export const content = `
# JOINs: Snapping Puzzle Pieces Together! 🧩

## 🧩 Introduction: The Puzzle Pieces

Imagine you have two separate boxes of jigsaw puzzle pieces:
* **Box 1 (Left Pieces):** Pieces representing **Students** (e.g., Alice, Bob, Charlie).
* **Box 2 (Right Pieces):** Pieces representing **Lockers** (e.g., Locker 101, Locker 102).

To see who owns which locker, you have to **snap matching pieces together** where the edges align.

In SQL, this is exactly what a **\`JOIN\`** does! It takes two separate tables and draws virtual lines between rows that share a matching value (like a student's ID number).

---

## 🗺️ The Map of JOIN Types

There are four primary ways to snap tables together:

\`\`\`
    INNER JOIN                          LEFT JOIN
  +----+  +----+                     +----+  +----+
  | A  |  | B  |                     | A  |  | B  |
  |  [Match]   |                     | [Match]    |
  +----+  +----+                     +----+  +----+
 (Matching rows only)               (All A, matching B)

    RIGHT JOIN                         FULL OUTER JOIN
  +----+  +----+                     +----+  +----+
  | A  |  | B  |                     | A  |  | B  |
  |    [Match] |                     |  [Match]   |
  +----+  +----+                     +----+  +----+
 (All B, matching A)                (All rows from both)
\`\`\`

### 1. INNER JOIN (The Perfect Matches Only)
Only returns rows where there is a match in **both** tables.
* *Result:* You only see students who have lockers, and lockers that have students. Unassigned students or empty lockers are hidden.

### 2. LEFT JOIN (Keep the Left Side)
Returns **all** rows from the left table, plus matching rows from the right table. If there is no match on the right, it fills the empty spot with **\`NULL\`**.
* *Result:* You see every student, even if they don't have a locker!

### 3. RIGHT JOIN (Keep the Right Side)
Returns **all** rows from the right table, plus matching rows from the left table. If there is no match, it fills with **\`NULL\`**.
* *Result:* You see every locker, even if it is empty!

### 4. FULL OUTER JOIN (Keep Everything)
Returns rows when there is a match in **either** the left or right table.
* *Result:* You see all students and all lockers, matched where possible, and padded with \`NULL\` where there is no connection.

### 5. CROSS JOIN (Cartesian Product)
Matches **every single row** of the left table with **every single row** of the right table. It is like listing all possible combinations!

---

## 💻 Code Examples

Let's join a table of students with a table of locker assignments.

### SQL Setup & Queries
\`\`\`sql
-- Schema Setup
CREATE TABLE students (id INT, name TEXT);
CREATE TABLE lockers (student_id INT, locker_number TEXT);

INSERT INTO students VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie');
INSERT INTO lockers VALUES (1, 'L-101'), (2, 'L-102'); -- Charlie has no locker

-- 1. INNER JOIN
SELECT s.name, l.locker_number 
FROM students s 
INNER JOIN lockers l ON s.id = l.student_id;
-- Results: Alice (L-101), Bob (L-102)

-- 2. LEFT JOIN
SELECT s.name, l.locker_number 
FROM students s 
LEFT JOIN lockers l ON s.id = l.student_id;
-- Results: Alice (L-101), Bob (L-102), Charlie (NULL)
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_joins_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE students (id INT, name TEXT)")
    cursor.execute("CREATE TABLE lockers (student_id INT, num TEXT)")
    
    cursor.executemany("INSERT INTO students VALUES (?, ?)", [(1, 'Alice'), (2, 'Bob')])
    cursor.executemany("INSERT INTO lockers VALUES (?, ?)", [(1, 'L-101')]) # Bob has no locker
    
    # Run LEFT JOIN
    cursor.execute("""
        SELECT s.name, l.num 
        FROM students s 
        LEFT JOIN lockers l ON s.id = l.student_id
    """)
    for name, num in cursor.fetchall():
        print(f"Student: {name}, Locker: {num}") # num will be None/NULL for Bob
        
    conn.close()

run_joins_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class JoinsExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE students (id INT, name TEXT)");
        stmt.execute("CREATE TABLE lockers (student_id INT, num TEXT)");
        stmt.execute("INSERT INTO students VALUES (1, 'Alice')");
        stmt.execute("INSERT INTO lockers VALUES (1, 'L-101')");
        
        ResultSet rs = stmt.executeQuery(
            "SELECT s.name, l.num FROM students s INNER JOIN lockers l ON s.id = l.student_id"
        );
        while (rs.next()) {
            System.out.println("Match: " + rs.getString("name") + " -> " + rs.getString("num"));
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
    std::cout << argv[0] << " matches locker " << (argv[1] ? argv[1] : "NONE") << std::endl;
    return 0;
}

void runJoins() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE students (id INT, name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE lockers (student_id INT, num TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO students VALUES (1, 'Alice'), (2, 'Bob');", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO lockers VALUES (1, '101');", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "SELECT s.name, l.num FROM students s LEFT JOIN lockers l ON s.id = l.student_id;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runJoins() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE students (id INTEGER, name TEXT)");
        db.run("CREATE TABLE lockers (student_id INTEGER, num TEXT)");
        db.run("INSERT INTO students VALUES (1, 'Alice')");
        
        db.each(\`
            SELECT s.name, l.num 
            FROM students s 
            LEFT JOIN lockers l ON s.id = l.student_id
        \`, (err, row: any) => {
            if (row) {
                console.log("TS JOIN result:", row.name, row.num);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. The Cartesian Product Disaster (CROSS JOIN by accident)
Forgetting to write the \`ON\` condition (e.g. \`SELECT * FROM tableA JOIN tableB;\`). This causes the database to match **every single row** of Table A with **every single row** of Table B. If both tables have 10,000 rows, your database locks up trying to generate 100,000,000 rows!
* **Bad:** \`SELECT * FROM students JOIN lockers;\`
* **Good:** \`SELECT * FROM students s JOIN lockers l ON s.id = l.student_id;\`

### 2. Ambiguous Column Names
Forgetting to prefix column names with table letters (like \`s.name\` or \`l.student_id\`) when joining tables that have identical column names.

---

## 🔍 Interview Corner

### Q1: What is the difference between INNER JOIN and LEFT JOIN?
* **INNER JOIN** returns only the rows where there is a match in both joined tables (if a record doesn't match, it is filtered out).
* **LEFT JOIN** returns all rows from the left table, plus any matching rows from the right table. If there is no match on the right, it prints \`NULL\` for the right columns.

### Q2: What is a Self JOIN, and when is it useful?
A **Self JOIN** is a query that joins a table to itself. It is useful when comparing rows within the same table, such as finding employees who earn more than their managers where both manager and employee data live in the same \`employees\` table.

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Combine Two Tables](/problem/sql/combine-two-tables)
* [Employee Bonus](/problem/sql/employee-bonus)

---

## 📝 Summary

* **\`JOINs\`** connect rows across tables based on common matching values.
* **\`INNER JOIN\`** returns matching pairs only.
* **\`LEFT JOIN\`** keeps all rows from the left table, printing \`NULL\` for missing matches.
* Always specify the matching columns using the **\`ON\`** clause.
`;
