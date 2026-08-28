export const content = `
# Common Table Expressions (CTEs): The Scratch Paper Workspace! 📝

## 📝 Introduction: The Math Scratch Paper

Imagine you are solving a giant math problem that takes 10 steps to complete.

Instead of writing one massive, confusing equation with 50 sets of parentheses, you use a piece of **scratch paper**:
1. You calculate the first part, get the number 42, and write: *"Let's call this step **A**."*
2. You calculate the second part, get the number 10, and write: *"Let's call this step **B**."*
3. Finally, on your main sheet, you just write: **\`A + B\`**.

This is exactly what a **CTE (Common Table Expression)** does in SQL! It lets you write a temporary query, give it a name (like scratch paper), and then use it immediately inside your main SQL query.

---

## 🛠️ The CTE Syntax

A CTE is defined using the **\`WITH\`** keyword:

\`\`\`
    +-----------------------------------------------+
    | WITH cte_name AS (                            |
    |     SELECT id, name FROM items WHERE price > 5|
    | )                                             | <--- CTE definition
    +-----------------------------------------------+
                           |
                           v
    +-----------------------------------------------+
    | SELECT * FROM cte_name;                       | <--- Main Query
    +-----------------------------------------------+
\`\`\`

\`\`\`sql
WITH scratch_paper_name AS (
    -- Your temporary query here
    SELECT id, name, price 
    FROM items 
    WHERE price > 100
)
-- Main query referencing the CTE
SELECT * 
FROM scratch_paper_name 
WHERE name LIKE 'A%';
\`\`\`

### Why use CTEs instead of Subqueries?

* **Readability:** CTEs are read from top to bottom, which makes them much easier for humans to follow than deeply nested subqueries (which must be read from the inside out).
* **Reusability:** You can reference the same CTE multiple times in the main query's JOINs without duplicating the query text.
* **Organized Structure:** It separates database retrieval logic from the main formatting block.

---

## 💻 Code Examples

Let's use a CTE to calculate averages and filter items.

### SQL Query with CTE
\`\`\`sql
WITH avg_prices AS (
    SELECT AVG(price) AS overall_avg 
    FROM products
)
SELECT name, price 
FROM products, avg_prices 
WHERE price > avg_prices.overall_avg;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_cte_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE orders (id INT, item TEXT, amt REAL)")
    cursor.executemany("INSERT INTO orders VALUES (?, ?, ?)", [
        (1, 'Laptop', 1000.0),
        (2, 'Mouse', 20.0),
        (3, 'Keyboard', 80.0)
    ])
    
    # Define a CTE to filter expensive orders, then query it
    cursor.execute("""
        WITH expensive_orders AS (
            SELECT item, amt 
            FROM orders 
            WHERE amt > 50.0
        )
        SELECT item FROM expensive_orders ORDER BY amt DESC
    """)
    for row in cursor.fetchall():
        print(f"Expensive: {row[0]}")
        
    conn.close()

run_cte_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class CteExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE orders (item TEXT, amt REAL)");
        stmt.execute("INSERT INTO orders VALUES ('Laptop', 1200.0), ('Keyboard', 75.0)");
        
        // Run CTE query in Java
        String sql = "WITH large_orders AS (SELECT item FROM orders WHERE amt > 100) SELECT * FROM large_orders";
        ResultSet rs = stmt.executeQuery(sql);
        while (rs.next()) {
            System.out.println("CTE Item: " + rs.getString("item"));
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
    std::cout << "CTE Output: " << argv[0] << std::endl;
    return 0;
}

void runCte() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE sales (dept TEXT, val INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO sales VALUES ('Toys', 100), ('Books', 50);", nullptr, nullptr, nullptr);
    
    const char* sql = "WITH big_sales AS (SELECT dept FROM sales WHERE val > 75) SELECT * FROM big_sales;";
    sqlite3_exec(db, sql, callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runCte() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE sales (dept TEXT, val INTEGER)");
        db.run("INSERT INTO sales VALUES ('Toys', 100), ('Books', 50)");
        
        db.each("WITH big_sales AS (SELECT dept FROM sales WHERE val > 75) SELECT * FROM big_sales", (err, row: any) => {
            if (row) {
                console.log("TS CTE Match:", row.dept);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Forgetting Parentheses Around the CTE Query
Writing \`WITH cte_name AS SELECT ...\` instead of wrapping the query in parentheses.
* **Bad:** \`WITH my_cte AS SELECT * FROM users SELECT * FROM my_cte;\`
* **Good:** \`WITH my_cte AS (SELECT * FROM users) SELECT * FROM my_cte;\`

### 2. Thinking CTEs Persist Beyond a Single Query
CTEs are strictly **temporary**. They only exist during the execution of the query they are attached to. You cannot run a separate SELECT query against a CTE later.

---

## 🔍 Interview Corner

### Q1: What is the main difference between a CTE and a View?
* A **CTE (Common Table Expression)** is defined within a query and only exists during the lifetime of that single query. It is not saved in the database catalog.
* A **View** is a permanent database object saved in the schema catalog. It can be queried by any connection at any time, just like a table.

### Q2: What is a Recursive CTE, and what is its use case?
A **Recursive CTE** is a CTE that references itself. It is used to traverse hierarchical structures (like organizational reporting trees, folder hierarchies, or networks of linked nodes) by looping until a termination check is met.

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Nth Highest Salary](/problem/sql/nth-highest-salary)

---

## 📝 Summary

* A **CTE (Common Table Expression)** creates a named, temporary result set.
* It is declared at the top of your query using the **\`WITH\`** keyword.
* CTEs split complex queries into cleaner, readable steps.
`;
