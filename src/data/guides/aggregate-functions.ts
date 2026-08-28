export const content = `
# Aggregate Functions: The Math Wizard! 🧙

## 🧙 Introduction: The Treasure Chest Wizard

Imagine you are an adventurer who finds a treasure chest containing **hundreds of gold coins**. 

Instead of sitting on the floor counting and weighing every single coin for hours, you summon a **Math Wizard**:
* You ask: *"Wizard, how many coins are there?"* The wizard chants: **\`COUNT\`**! and says: *"150 coins."*
* You ask: *"What is the total weight?"* The wizard chants: **\`SUM\`**! and says: *"300 ounces."*
* You ask: *"What is the average value?"* The wizard chants: **\`AVG\`**! and says: *"2 gold coins."*
* You ask: *"What is the heaviest coin?"* The wizard chants: **\`MAX\`**! and says: *"5 ounces."*

In SQL, **Aggregate Functions** are this math wizard! They take multiple rows of data and compute a single summary value from them.

---

## 📊 The Big Five Aggregate Functions

Relational databases support these five fundamental math tools:

\`\`\`
          Multiple Detail Rows                      Single Summary Value
     +----------------------------+
     | item_id | name   | price   |
     +---------+--------+---------+
     | 1       | Pen    | 1.50    |
     | 2       | Book   | 15.00   | ======>  SUM(price)  =====>  $1,015.50
     | 3       | Laptop | 999.00  |
     +----------------------------+
\`\`\`

1. **\`COUNT(column)\`**: Counts the number of non-null values in a column.
2. **\`SUM(column)\`**: Adds up all the values in a numeric column.
3. **\`AVG(column)\`**: Computes the average value of a numeric column.
4. **\`MIN(column)\`**: Finds the smallest value.
5. **\`MAX(column)\`**: Finds the largest value.

---

## 💻 Code Examples

Let's write queries to summarize statistics for a table of items.

### SQL Aggregate Queries
\`\`\`sql
-- Calculate sum, average, min, and max price of products
SELECT 
    COUNT(id) AS total_items,
    SUM(price) AS total_value,
    AVG(price) AS average_price,
    MIN(price) AS cheapest_item,
    MAX(price) AS most_expensive
FROM inventory;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_aggregate_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE inventory (name TEXT, price REAL)")
    cursor.executemany("INSERT INTO inventory VALUES (?, ?)", [
        ('Apple', 1.50),
        ('Banana', 0.80),
        ('Orange', 2.00)
    ])
    
    # Calculate statistics
    cursor.execute("SELECT COUNT(*), SUM(price), AVG(price) FROM inventory")
    count, total, average = cursor.fetchone()
    
    print(f"Total Items: {count}")
    print(f"Total Value: \${total:.2f}")
    print(f"Average Price: \${average:.2f}")
    
    conn.close()

run_aggregate_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class AggregateExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE inventory (name TEXT, price REAL)");
        stmt.execute("INSERT INTO inventory VALUES ('Sword', 150.0), ('Shield', 80.0)");
        
        ResultSet rs = stmt.executeQuery("SELECT MAX(price), MIN(price) FROM inventory");
        if (rs.next()) {
            System.out.println("Max Price: " + rs.getDouble(1));
            System.out.println("Min Price: " + rs.getDouble(2));
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
    std::cout << "Sum: " << argv[0] << ", Avg: " << argv[1] << std::endl;
    return 0;
}

void runAggregate() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE sales (id INT, amt REAL);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO sales VALUES (1, 10.0), (2, 20.0);", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "SELECT SUM(amt), AVG(amt) FROM sales;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runAggregate() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE sales (id INTEGER, amt REAL)");
        db.run("INSERT INTO sales VALUES (1, 10.0), (2, 20.0)");
        
        db.get("SELECT COUNT(amt) AS cnt FROM sales", (err, row: any) => {
            if (row) {
                console.log("TS Aggregate Count:", row.cnt);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Combining Aggregate and Non-Aggregate Columns
Running \`SELECT name, SUM(price) FROM products\`. The database gets confused because \`SUM(price)\` returns one single row, but \`name\` represents multiple rows.
* **Bad:** \`SELECT category, AVG(price) FROM products;\` (Crashes in most database engines).
* **Good:** Use \`GROUP BY category\`.

### 2. Confusing COUNT(column) vs. COUNT(*)
\`COUNT(column)\` ignores rows where that column is \`NULL\`. \`COUNT(*)\` counts every single row in the table, including empty ones.

---

## 🔍 Interview Corner

### Q1: How do aggregate functions treat NULL values?
All aggregate functions (like \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`, and \`COUNT(column)\`) automatically ignore \`NULL\` values when performing calculations. The only exception is \`COUNT(*)\` which counts the entire row size, including \`NULL\` values.

### Q2: What is the difference between COUNT(1) and COUNT(*)?
In modern database engines (like PostgreSQL, MySQL, and SQL Server), there is **no difference** in performance or result between \`COUNT(1)\` and \`COUNT(*)\`. The query optimizer treats them identically.

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Game Play Analysis I](/problem/sql/game-play-analysis-i)

---

## 📝 Summary

* **Aggregate Functions** summarize data rows into a single numeric result.
* The main functions are **\`COUNT\`**, **\`SUM\`**, **\`AVG\`**, **\`MIN\`**, and **\`MAX\`**.
* They skip \`NULL\` values automatically (except \`COUNT(*)\`).
`;
