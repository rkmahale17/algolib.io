export const content = `
# GROUP BY & HAVING: Sorting Candy by Color! 🍬

## 🍬 Introduction: The Skittles Pile

Imagine you buy a giant bag of Skittles candy. You dump them all on the table:

1. **The Pile Sorter (GROUP BY):** You don't count them all in one big pile. Instead, you push them into **separate color piles**: a red pile, a green pile, and a yellow pile.
2. **The Counter (COUNT):** You count the candies in each separate pile.
3. **The Pile Filter (HAVING):** Now, you set a filter rule for your piles: *"Only show me piles that contain **more than 10 candies**."* You throw away the small yellow pile, leaving only red and green.

In SQL, this is exactly what **\`GROUP BY\`** and **\`HAVING\`** do! 
* \`GROUP BY\` splits your rows into sub-piles.
* \`HAVING\` filters those sub-piles *after* they have been counted or summarized!

---

## 🔍 WHERE vs. HAVING: The Ultimate Difference

\`\`\`
                      10,000 Candies
                            |
                            v
                 +----------------------+
                 |     WHERE Clause     |  <--- Filters out broken candies (early row sifting)
                 +----------------------+
                            |
                  (Clean Candies Only)
                            |
                            v
                 +----------------------+
                 |    GROUP BY color    |  <--- Creates color piles
                 +----------------------+
                            |
                   (Red, Green, Blue piles)
                            |
                            v
                 +----------------------+
                 |    HAVING Count > 10 |  <--- Discards small piles
                 +----------------------+
                            |
                            v
                    Output Groups
\`\`\`

* **\`WHERE\` (Row Filter):** Filters individual rows **before** they are grouped into piles. (e.g., *"Throw away all broken candies first."*)
* **\`HAVING\` (Pile Filter):** Filters the grouped piles **after** aggregate calculations have occurred. (e.g., *"Only keep piles with > 10 candies."*)

### Order of Execution (Under the Hood)
1. **\`FROM\`**: Load target table.
2. **\`WHERE\`**: Filter individual rows.
3. **\`GROUP BY\`**: Group remaining rows into subsets.
4. **\`HAVING\`**: Filter subsets based on aggregations.
5. **\`SELECT\`**: Pick target columns and run formulas.
6. **\`ORDER BY\`**: Sort output rows.
7. **\`LIMIT\`**: Truncate list size.

---

## 💻 Code Examples

Let's group items by category and find categories with high average prices.

### SQL Query
\`\`\`sql
-- Group products by category, calculating average price,
-- but only return categories where average price is higher than $10
SELECT category, AVG(price) AS avg_price, COUNT(id) AS total_items
FROM products
WHERE status = 'available' -- Filters individual rows first
GROUP BY category
HAVING AVG(price) > 10.00;  -- Filters groups after calculation
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_groupby_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE sales (department TEXT, amount REAL)")
    cursor.executemany("INSERT INTO sales VALUES (?, ?)", [
        ('Toys', 15.00), ('Toys', 30.00),
        ('Books', 8.00),  ('Books', 12.00),
        ('Electronics', 120.00)
    ])
    
    # Calculate sum of sales by department, only keeping departments with > $30 sales
    cursor.execute("""
        SELECT department, SUM(amount) 
        FROM sales 
        GROUP BY department 
        HAVING SUM(amount) > 30.00
    """)
    for dept, total in cursor.fetchall():
        print(f"Department: {dept}, Total Sales: \${total:.2f}")
        
    conn.close()

run_groupby_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class GroupByExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE sales (department TEXT, amount REAL)");
        stmt.execute("INSERT INTO sales VALUES ('Toys', 15.0), ('Toys', 30.0), ('Books', 8.0)");
        
        // Query using GROUP BY and HAVING
        ResultSet rs = stmt.executeQuery(
            "SELECT department, COUNT(*) FROM sales GROUP BY department HAVING COUNT(*) >= 2"
        );
        while (rs.next()) {
            System.out.println("Dept with multiple sales: " + rs.getString(1) + " (Count: " + rs.getInt(2) + ")");
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
    std::cout << "Dept: " << argv[0] << ", Total: " << argv[1] << std::endl;
    return 0;
}

void runGroupBy() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE sales (dept TEXT, amt REAL);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO sales VALUES ('Toys', 10.0), ('Toys', 25.0), ('Books', 12.0);", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "SELECT dept, SUM(amt) FROM sales GROUP BY dept HAVING SUM(amt) > 20.0;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runGroupBy() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE sales (dept TEXT, amt REAL)");
        db.run("INSERT INTO sales VALUES ('Toys', 10.0), ('Toys', 25.0), ('Books', 12.0)");
        
        db.all("SELECT dept, SUM(amt) AS total FROM sales GROUP BY dept HAVING SUM(amt) > 20.0", (err, rows: any[]) => {
            rows.forEach(row => console.log("TS Group Match:", row.dept, row.total));
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Putting aggregations in WHERE
Trying to run \`SELECT category FROM products WHERE AVG(price) > 10.00\`. This fails because \`WHERE\` acts on single rows before they are grouped!
* **Bad:** \`SELECT category FROM products WHERE COUNT(id) > 5 GROUP BY category;\`
* **Good:** \`SELECT category FROM products GROUP BY category HAVING COUNT(id) > 5;\`

### 2. Missing Columns in GROUP BY
Selecting non-aggregated columns that are not included in the \`GROUP BY\` clause (e.g. \`SELECT category, item_name, SUM(price) ... GROUP BY category\`). The database doesn't know which \`item_name\` to show for the category group.

---

## 🔍 Interview Corner

### Q1: What is the difference between WHERE and HAVING?
* **WHERE** is used to filter individual rows **before** any grouping or aggregate calculations take place.
* **HAVING** is used to filter grouped rows (summaries) **after** the \`GROUP BY\` clause has completed. (It requires aggregate functions).

### Q2: Why can't we use column aliases in the HAVING clause in some RDBMS?
Under the standard SQL order of operations, the \`HAVING\` clause is evaluated **before** the \`SELECT\` clause. Since column aliases are defined in \`SELECT\`, they do not exist yet when \`HAVING\` runs. (Note: some modern databases like MySQL allow it as an extension, but PostgreSQL and SQL Server strictly forbid it).

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Duplicate Emails](/problem/sql/duplicate-emails)

---

## 📝 Summary

* **\`GROUP BY\`** organizes query results into summarized categories.
* **\`HAVING\`** acts as a filter on grouped categories (requires aggregate functions like \`SUM\`, \`AVG\`, etc.).
* Use **\`WHERE\`** to filter rows first, then **\`GROUP BY\`** to create piles, then **\`HAVING\`** to filter those piles.
`;
