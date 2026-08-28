export const content = `
# SELECT & Filtering: The Toy Sorting Funnel! 🌪️

## 🌪️ Introduction: The Marble Sifter

Imagine you have a giant bucket containing **10,000 marbles** of all different colors, sizes, and materials.

If you only want to play with the **red glass marbles**, you don't pick them out one-by-one by hand. Instead, you put the bucket through a **sorting funnel**:
1. **The Picker (SELECT):** You tell the funnel: *"Only show me the color and size of the marbles."*
2. **The Funnel (WHERE):** The filters catch everything else. The filter rules are: *"Color must be Red"* **AND** *"Material must be Glass"*.

In SQL, this is exactly what the **\`SELECT\`** statement and **\`WHERE\`** clause do! They filter a mountain of data and return only the columns and rows you care about.

---

## 🔍 The SELECT and WHERE Syntax

\`\`\`
                   10,000 Data Rows
                          |
                          v
               +----------------------+
               |    WHERE FILTER      |  <--- Row sifting (e.g. price < 10)
               +----------------------+
                          |
                (Filtered Data Rows)
                          |
                          v
               +----------------------+
               |    SELECT COLUMNS    |  <--- Column extraction (e.g. name only)
               +----------------------+
                          |
                          v
                    Output Results
\`\`\`

A standard query has three main clauses:
\`\`\`sql
SELECT column1, column2 
FROM table_name 
WHERE condition;
\`\`\`

### Common Filtering Operators

To filter rows inside the \`WHERE\` clause, you can use these tools:
* **\`=\` and \`<>\`:** Equals and Not Equals (some databases use \`!=\` for not equals).
* **\`AND\` & \`OR\`:** Combine multiple conditions.
* **\`IN\`:** Match any value in a list (e.g. \`color IN ('Red', 'Blue', 'Green')\`).
* **\`BETWEEN\`:** Check if a value is in a range (e.g. \`age BETWEEN 5 AND 10\` is inclusive of 5 and 10).
* **\`LIKE\`:** Search for patterns. Uses wildcards:
  * \`%\` represents zero or more characters (e.g. \`name LIKE 'A%'\` finds names starting with A).
  * \`_\` represents a single character (e.g. \`name LIKE '_at'\` finds Cat, Bat, etc.).

---

## 💻 Code Examples

Let's write a query to filter products that are cheap and in a specific category.

### SQL Filter Query
\`\`\`sql
-- Find names and prices of toys that cost less than $10 and are Red
SELECT product_name, price 
FROM products 
WHERE price < 10.00 
  AND color = 'Red';
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_filtering_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE products (name TEXT, price REAL, color TEXT)")
    cursor.executemany("INSERT INTO products VALUES (?, ?, ?)", [
        ('Red Car', 8.50, 'Red'),
        ('Blue Ball', 5.00, 'Blue'),
        ('Red Wagon', 15.00, 'Red'),
        ('Lego Set', 25.00, 'Green')
    ])
    
    # Filter using WHERE
    cursor.execute("""
        SELECT name, price 
        FROM products 
        WHERE price < 10.00 AND color = 'Red'
    """)
    for name, price in cursor.fetchall():
        print(f"Match: {name} - \${price}")
        
    conn.close()

run_filtering_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class FilteringExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE products (name TEXT, price REAL, color TEXT)");
        stmt.execute("INSERT INTO products VALUES ('Red Car', 8.50, 'Red')");
        stmt.execute("INSERT INTO products VALUES ('Red Wagon', 15.00, 'Red')");
        
        // Prepared statements prevent SQL injection when filtering!
        String query = "SELECT name FROM products WHERE price < ? AND color = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(query)) {
            pstmt.setDouble(1, 10.00);
            pstmt.setString(2, "Red");
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                System.out.println("Filtered: " + rs.getString("name"));
            }
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
    std::cout << "Match: " << argv[0] << std::endl;
    return 0;
}

void runFiltering() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE products (name TEXT, price REAL);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO products VALUES ('Toy 1', 5.00);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO products VALUES ('Toy 2', 20.00);", nullptr, nullptr, nullptr);
    
    // Filter out cheap products
    sqlite3_exec(db, "SELECT name FROM products WHERE price < 10.00;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runFiltering() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE products (name TEXT, price REAL)");
        db.run("INSERT INTO products VALUES ('Toy 1', 5.00)");
        db.run("INSERT INTO products VALUES ('Toy 2', 20.00)");
        
        db.all("SELECT name FROM products WHERE price < ?", [10.00], (err, rows: any[]) => {
            rows.forEach(row => console.log("TS Filter Match:", row.name));
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Using SELECT * in Production
Querying all columns (\`*\`) when you only need one or two. This wastes network bandwidth and makes your application slower!
* **Bad:** \`SELECT * FROM users;\`
* **Good:** \`SELECT username, email FROM users;\`

### 2. Wildcard Placement with LIKE
Running queries like \`LIKE '%term%'\`. This forces the database to check every single row (Table Scan) because it cannot use indexes for leading wildcards. Use \`LIKE 'term%'\` instead if possible!

---

## 🔍 Interview Corner

### Q1: What is the difference between = NULL and IS NULL in SQL?
In SQL, \`NULL\` represents an unknown value. Since you cannot compare something to an unknown value, \`email = NULL\` will always evaluate to \`NULL\` (false). You must use the special operator \`IS NULL\` (or \`IS NOT NULL\`) to verify empty fields.

### Q2: What is the difference between AND and OR in a WHERE clause?
* **AND** requires **both** conditions on either side to be true for a row to match.
* **OR** requires **at least one** condition to be true. (When mixing them, always use parentheses to specify precedence!).

---

## 📝 Summary

* **\`SELECT\`** specifies which columns (attributes) you want to see.
* **\`WHERE\`** acts as a filter to check conditions on each row.
* Use operators like **\`AND\`**, **\`OR\`**, **\`IN\`**, **\`BETWEEN\`**, and **\`LIKE\`** to build powerful filters.
`;
