export const content = `
# NULL Handling: The Invisible Ghost Values! 👻

## 👻 Introduction: The Blank Sticky Note

Imagine you are gathering sign-up forms for a club. The form has a box labeled *"Middle Name (Optional)"*:

* **Alice** writes: *"Jane"*.
* **Bob** leaves it completely empty.

When you look at Bob's form, the middle name isn't the word "None" or "Blank". It is an **empty slot of missing information**.

In databases, this empty state is called **\`NULL\`**. 

\`NULL\` is a special value that represents **unknown, missing, or inapplicable data**. Because it is a "ghost" value, it behaves very strangely: if you add 5 to \`NULL\`, the result is still \`NULL\` (because 5 plus an unknown number is still unknown!).

---

## 🛠️ Handling NULLs and Three-Valued Logic

In normal programming languages, logic has two values: **True** and **False**.
SQL uses **Three-Valued Logic**: **True**, **False**, and **Unknown (NULL)**.

\`\`\`
       THREE-VALUED LOGIC (AND truth table with NULL)
+---------+---------+---------+---------+
| AND     | TRUE    | FALSE   | NULL    |
+---------+---------+---------+---------+
| TRUE    | TRUE    | FALSE   | NULL    |
| FALSE   | FALSE   | FALSE   | FALSE   |
| NULL    | NULL    | FALSE   | NULL    |
+---------+---------+---------+---------+
\`\`\`

### 1. Checking for NULLs: \`IS NULL\` and \`IS NOT NULL\`
* *Bad:* \`WHERE middle_name = NULL\` (This will return 0 rows because nothing can equal an unknown!).
* *Good:* \`WHERE middle_name IS NULL\` (Checks if the box is empty).

### 2. The Fallback Savior: \`COALESCE()\`
The \`COALESCE()\` function takes a list of columns and returns the **first value that is not NULL**. It's the ultimate fallback tool!
* *Example:* \`COALESCE(middle_name, 'No Middle Name')\` returns the student's middle name, but if it is empty, it outputs "No Middle Name" instead.

### 3. The Equality Eraser: \`NULLIF()\`
\`NULLIF(val1, val2)\` returns \`NULL\` if \`val1 = val2\`. Otherwise, it returns \`val1\`. (Great for preventing division-by-zero errors: \`amount / NULLIF(items, 0)\`).

---

## 💻 Code Examples

Let's query users and replace missing email addresses with a default placeholder.

### SQL NULL Queries
\`\`\`sql
-- Find users who haven't entered an email
SELECT username FROM users WHERE email IS NULL;

-- Retrieve names, substituting missing nicknames with the username
SELECT username, COALESCE(nickname, username, 'Anonymous') AS display_name 
FROM users;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_null_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE users (name TEXT, nickname TEXT)")
    cursor.executemany("INSERT INTO users VALUES (?, ?)", [
        ('Alice', 'Ali'),
        ('Bob', None) # Bob has no nickname (NULL)
    ])
    
    # Use COALESCE to fallback to name if nickname is NULL
    cursor.execute("SELECT name, COALESCE(nickname, 'No Nickname') FROM users")
    for name, nick in cursor.fetchall():
        print(f"User: {name}, Nick: {nick}")
        
    conn.close()

run_null_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class NullExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE inventory (item TEXT, quantity INT)");
        // Insert item with NULL quantity
        stmt.execute("INSERT INTO inventory VALUES ('Screws', NULL)");
        
        // Coalesce in Java query
        ResultSet rs = stmt.executeQuery("SELECT item, COALESCE(quantity, 0) FROM inventory");
        if (rs.next()) {
            System.out.println("Item: " + rs.getString(1) + ", Qty: " + rs.getInt(2));
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
    std::cout << "Item: " << argv[0] << ", Qty: " << (argv[1] ? argv[1] : "NULL") << std::endl;
    return 0;
}

void runNullExample() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE stock (item TEXT, qty INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO stock VALUES ('Nails', NULL);", nullptr, nullptr, nullptr);
    
    // Select without coalesce, callback will check for C++ null pointer
    sqlite3_exec(db, "SELECT item, qty FROM stock;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runNullExample() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE stock (item TEXT, qty INTEGER)");
        db.run("INSERT INTO stock VALUES ('Nails', NULL)");
        
        db.each("SELECT item, COALESCE(qty, 0) AS qty FROM stock", (err, row: any) => {
            if (row) {
                console.log("TS Stock:", row.item, row.qty);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Comparing NULL with standard Operators
Writing \`WHERE status = NULL\` or \`WHERE status <> NULL\`. In SQL, evaluating \`NULL = NULL\` results in \`NULL\` (Unknown), not True! Always use \`IS NULL\` instead.
* **Bad:** \`SELECT * FROM users WHERE email = NULL;\`
* **Good:** \`SELECT * FROM users WHERE email IS NULL;\`

### 2. Math Operations with NULLs
Forgetting that operations like \`price + tax\` will result in \`NULL\` if either column is \`NULL\`. Wrap nullable columns inside \`COALESCE(column, 0)\` before doing arithmetic.

---

## 🔍 Interview Corner

### Q1: What is the result of NULL = NULL in SQL, and why?
The result of \`NULL = NULL\` is **\`NULL\`** (Unknown). This is because \`NULL\` represents an unknown or missing value, and two unknown values cannot be asserted as equal.

### Q2: What is the difference between COALESCE and ISNULL/IFNULL?
* **\`COALESCE()\`** is standard ANSI SQL and accepts **any number of parameters**, returning the first non-null value in the list.
* **\`IFNULL()\` (MySQL/SQLite)** or **\`ISNULL()\` (SQL Server)** are vendor-specific functions that accept **exactly two parameters** only.

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Customers Who Never Order](/problem/sql/customers-who-never-order)
* [Employee Bonus](/problem/sql/employee-bonus)

---

## 📝 Summary

* **\`NULL\`** represents missing, empty, or unknown values.
* Never use \`=\` to check for \`NULL\`. Use **\`IS NULL\`** or **\`IS NOT NULL\`**.
* Use **\`COALESCE(val1, val2, ...)\`** to set a fallback default value for empty fields.
`;
