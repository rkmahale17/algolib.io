export const content = `
# CASE Expressions: The Sorting Hat! 🧙‍♂️

## 🧙‍♂️ Introduction: The School Sorting Hat

Imagine you are a freshman entering wizarding school, and you sit on a stool to put on the **Sorting Hat**:

The hat runs a list of checks:
* **Rule 1:** *"IF student is Brave, THEN put them in Gryffindor!"*
* **Rule 2:** *"IF student is Smart, THEN put them in Ravenclaw!"*
* **Rule 3:** *"For anyone ELSE, put them in Hufflepuff!"*

In SQL, a **\`CASE\`** expression is this exact Sorting Hat! It inspects columns in your rows and assigns a new label or value based on whether they meet your "if-then" rules.

---

## 🛠️ The CASE Syntax and Kinds

\`\`\`
                    Row Data Column
                          |
                  (Meets Rule 1?)
                  /             \
               YES               NO
        /                         \
       v                           v
 [Assign Val 1]             (Meets Rule 2?)
                            /             \
                         YES               NO
                  /                         \
                 v                           v
           [Assign Val 2]             [Assign ELSE Val]
\`\`\`

SQL supports two main styles of writing CASE expressions:

### 1. Searched CASE (Most Flexible)
Evaluates custom logical comparison checks for each branch:
\`\`\`sql
SELECT name,
    CASE 
        WHEN score >= 90 THEN 'A'
        WHEN score >= 80 THEN 'B'
        ELSE 'C'
    END AS grade
FROM students;
\`\`\`

### 2. Simple CASE (Equivalency Check)
Compares a single column directly with specific candidate values (like a switch-case statement):
\`\`\`sql
SELECT name,
    CASE department
        WHEN 'HR' THEN 'Human Resources'
        WHEN 'ENG' THEN 'Engineering'
        ELSE 'Other'
    END AS dept_name
FROM employees;
\`\`\`

---

## 💻 Code Examples

Let's categorize items into discount levels based on price.

### SQL CASE Query
\`\`\`sql
SELECT name, price,
    CASE 
        WHEN price >= 100.00 THEN 'Expensive'
        WHEN price >= 50.00 THEN 'Moderate'
        ELSE 'Cheap'
    END AS price_category
FROM products;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_case_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE users (name TEXT, age INTEGER)")
    cursor.executemany("INSERT INTO users VALUES (?, ?)", [
        ('Alice', 12), ('Bob', 20), ('Charlie', 70)
    ])
    
    # Select age category using CASE
    cursor.execute("""
        SELECT name,
            CASE 
                WHEN age < 18 THEN 'Child'
                WHEN age < 65 THEN 'Adult'
                ELSE 'Senior'
            END
        FROM users
    """)
    for name, category in cursor.fetchall():
        print(f"User: {name} is categorized as {category}")
        
    conn.close()

run_case_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class CaseExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE products (name TEXT, stock INT)");
        stmt.execute("INSERT INTO products VALUES ('Apples', 0), ('Bananas', 15)");
        
        // Categorize stock levels
        String sql = "SELECT name, CASE WHEN stock = 0 THEN 'Out of Stock' ELSE 'In Stock' END FROM products";
        ResultSet rs = stmt.executeQuery(sql);
        while (rs.next()) {
            System.out.println("Product: " + rs.getString(1) + " status: " + rs.getString(2));
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
    std::cout << "Item: " << argv[0] << " - Status: " << argv[1] << std::endl;
    return 0;
}

void runCase() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE items (name TEXT, qty INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO items VALUES ('A', 0), ('B', 5);", nullptr, nullptr, nullptr);
    
    const char* sql = "SELECT name, CASE WHEN qty = 0 THEN 'EMPTY' ELSE 'FULL' END FROM items;";
    sqlite3_exec(db, sql, callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runCase() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE items (name TEXT, qty INTEGER)");
        db.run("INSERT INTO items VALUES ('A', 0), ('B', 5)");
        
        db.each("SELECT name, CASE WHEN qty = 0 THEN 'EMPTY' ELSE 'FULL' END AS status FROM items", (err, row: any) => {
            if (row) {
                console.log("TS Status:", row.name, row.status);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Forgetting the END Keyword
Leaving off the closing \`END\` keyword. The SQL parser will report a syntax error because it can't find where the conditional block terminates!
* **Bad:** \`CASE WHEN score > 50 THEN 'Pass' ELSE 'Fail';\`
* **Good:** \`CASE WHEN score > 50 THEN 'Pass' ELSE 'Fail' END;\`

### 2. Misordering Overlapping Conditions
SQL checks conditions in order from top to bottom and stops at the **first matching rule**. If you write ranges in the wrong order, you will get wrong categories!
* **Bad:**
  \`\`\`sql
  CASE 
      WHEN score >= 50 THEN 'Average'
      WHEN score >= 90 THEN 'Excellent' -- NEVER REACHED!
  END
  \`\`\`
* **Good:**
  \`\`\`sql
  CASE 
      WHEN score >= 90 THEN 'Excellent'
      WHEN score >= 50 THEN 'Average'
  END
  \`\`\`

---

## 🔍 Interview Corner

### Q1: Can you use aggregate functions inside a CASE expression?
Yes, you can use aggregate functions inside CASE statements. This is commonly used to do **conditional aggregation** (e.g. summing sales only for a specific region):
\`\`\`sql
SELECT department,
       SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) AS completed_sales
FROM sales GROUP BY department;
\`\`\`

### Q2: What happens if none of the WHEN conditions are met and there is no ELSE clause?
If none of the \`WHEN\` conditions evaluate to true, and no \`ELSE\` fallback branch is specified, the \`CASE\` expression will return **\`NULL\`**.

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Trips and Users](/problem/sql/trips-and-users)

---

## 📝 Summary

* **\`CASE\`** is SQL's version of an \`if-then-else\` statement.
* It lets you create new labels or compute conditional values inline inside a query.
* Always terminate the expression block using the **\`END\`** keyword.
`;
