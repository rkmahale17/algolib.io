export const content = `
# Subqueries: The Box inside a Box! 📦

## 📦 Introduction: The Nested Mystery Boxes

Imagine you are playing a treasure hunt game. You find a big locked chest. 

On the lock, it says: *"To open this chest, you must input the weight of the heaviest stone in the garden."*

To solve this, you have to do **two steps**:
1. **Step 1 (Inner Query):** Walk to the garden, weigh all the stones, and find the heaviest one (it is 12 pounds).
2. **Step 2 (Outer Query):** Walk back to the chest, type "12" into the lock, and open the chest.

In SQL, a **Subquery** is a query nested inside another query! It lets you run an inner query first (find the heaviest stone) and pass that result directly to the outer query (open the chest) in a single instruction.

---

## 🛠️ Types of Subqueries

Subqueries are written inside parentheses \`(...)\` and can be placed in the \`SELECT\`, \`FROM\`, or \`WHERE\` clauses:

\`\`\`
          [Outer Query (SELECT name FROM items)]
                             |
                   (Filters rows where)
                             |
                             v
           [Inner Subquery: (SELECT AVG(price) FROM items)]
                             |
                     (Returns $10.00)
                             |
                             v
           [Outer completes: WHERE price > $10.00]
\`\`\`

### 1. Scalar Subquery (Returns a Single Value)
The inner query returns exactly **one value** (one row and one column).
* *Example:* Find users who score higher than the average score.
  \`\`\`sql
  SELECT username FROM users 
  WHERE score > (SELECT AVG(score) FROM users);
  \`\`\`

### 2. Multi-Row Subquery (Returns a List)
The inner query returns a **list of values** (one column, multiple rows). Used with operators like **\`IN\`**, **\`ANY\`**, or **\`ALL\`**.
* *Example:* Find all employees who work in departments located in 'New York'.
  \`\`\`sql
  SELECT name FROM employees 
  WHERE dept_id IN (SELECT id FROM departments WHERE city = 'New York');
  \`\`\`

### 3. Correlated Subquery (The Interlinked Loop)
The inner query references a column from the outer query. It's like a nested loop in code: the inner query runs once for every row checked by the outer query.

---

## 💻 Code Examples

Let's find products that are priced higher than the average price.

### SQL Nested Query
\`\`\`sql
-- Find items costing more than the average item
SELECT name, price 
FROM items 
WHERE price > (SELECT AVG(price) FROM items);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_subquery_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE users (name TEXT, age INTEGER)")
    cursor.executemany("INSERT INTO users VALUES (?, ?)", [
        ('Alice', 25), ('Bob', 30), ('Charlie', 17), ('Diana', 45)
    ])
    
    # Query: Get users older than average age
    cursor.execute("""
        SELECT name, age 
        FROM users 
        WHERE age > (SELECT AVG(age) FROM users)
    """)
    for name, age in cursor.fetchall():
        print(f"Older than average: {name} ({age})")
        
    conn.close()

run_subquery_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class SubqueryExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE items (name TEXT, price REAL)");
        stmt.execute("INSERT INTO items VALUES ('Pen', 1.50), ('Book', 15.00), ('Laptop', 999.00)");
        
        // Find items cheaper than the maximum price
        ResultSet rs = stmt.executeQuery(
            "SELECT name FROM items WHERE price < (SELECT MAX(price) FROM items)"
        );
        while (rs.next()) {
            System.out.println("Subquery match: " + rs.getString("name"));
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
    std::cout << "Below Max: " << argv[0] << std::endl;
    return 0;
}

void runSubqueries() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE items (name TEXT, val INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO items VALUES ('A', 10), ('B', 50), ('C', 100);", nullptr, nullptr, nullptr);
    
    // Select items where value < max value
    sqlite3_exec(db, "SELECT name FROM items WHERE val < (SELECT MAX(val) FROM items);", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runSubqueries() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE items (name TEXT, val INTEGER)");
        db.run("INSERT INTO items VALUES ('A', 10), ('B', 50)");
        
        db.each("SELECT name FROM items WHERE val > (SELECT AVG(val) FROM items)", (err, row: any) => {
            if (row) {
                console.log("TS Subquery Match:", row.name);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Returning Multiple Columns in Scalar Subqueries
Writing \`WHERE price > (SELECT name, price FROM items)\`. The outer query only expects a single number to compare with \`price\`, so returning a whole table structure causes a crash!
* **Bad:** \`SELECT name FROM products WHERE id = (SELECT id, price FROM cart LIMIT 1);\`
* **Good:** \`SELECT name FROM products WHERE id = (SELECT id FROM cart LIMIT 1);\`

### 2. Poor Performance with Correlated Subqueries
Because a correlated subquery executes the inner SELECT once for every single row scanned by the outer query, it can lock up your database on large tables. Consider rewriting it using a \`JOIN\`.

---

## 🔍 Interview Corner

### Q1: What is the difference between a correlated and non-correlated subquery?
* **Non-correlated subquery:** The inner query is completely independent of the outer query. It runs exactly once first, gets its result, and passes it to the outer query.
* **Correlated subquery:** The inner query references columns from the outer query. It must run repeatedly (once for every single candidate row evaluated by the outer query).

### Q2: What does the EXISTS operator do, and how is it optimized?
The **EXISTS** operator returns \`true\` if the subquery returns any rows at all. It is highly optimized because the database engine stops scanning the moment it finds the first matching row (short-circuiting evaluation).

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Second Highest Paid Employee](/problem/sql/second-highest-salary)
* [Nth Highest Salary](/problem/sql/nth-highest-salary)
* [Delete Duplicate Emails](/problem/sql/delete-duplicate-emails)
* [Consecutive Numbers](/problem/sql/consecutive-numbers)

---

## 📝 Summary

* A **Subquery** is a SELECT statement wrapped inside another SQL query.
* The inner query executes first and passes its results to the outer query.
* Use **\`IN\`**, **\`ANY\`**, or **\`ALL\`** when the subquery returns multiple rows.
`;
