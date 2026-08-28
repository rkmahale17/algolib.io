export const content = `
# Stored Procedures & Functions: The Microwave! 🍲

## 🍲 Introduction: The Microwave Popcorn Button

Imagine you want to make microwave popcorn:

* **The Manual Way:** Open the microwave door, calculate weight, set heat level to 70%, type in \`2:30\` minutes, hit start. If you make popcorn 5 times a day, repeating these steps gets annoying!
* **The Microwave Way (Preset):** You put the bag inside and press the single button labeled **"Popcorn"**. The microwave runs all the complex heat and timer calculations automatically.

In databases, **Stored Procedures** and **Functions** are these popcorn buttons! They let you save a long block of complex SQL statements directly in the database engine. Instead of sending 20 SQL lines from your web app over the network, you just type: **\`CALL cook_popcorn()\`**!

---

## ⚙️ Stored Procedures vs. Functions

While both represent stored code, they have very different rules:

\`\`\`
    Stored Procedure (CALL proc_name)       User-Defined Function (SELECT func_name)
  +----------------------------------+    +----------------------------------+
  | - Can run multiple SQL updates   |    | - Must return a single value     |
  | - Supports transactions          |    | - No transactions allowed        |
  | - Does not return a single val   |    | - Can be used directly in SELECT |
  +----------------------------------+    +----------------------------------+
\`\`\`

| Feature | Stored Procedure | User-Defined Function (UDF) |
| :--- | :--- | :--- |
| **Call style** | Invoked using the \`CALL\` keyword. | Called inline within standard queries (like \`SUM()\`). |
| **Return Value**| Optional. Can return multiple outputs. | **Must** return exactly one value. |
| **Transaction Control** | Can start, commit, or rollback transactions. | Cannot manage transactions (read-only transactions). |
| **Usage** | Used to group large business logic writes. | Used for mathematical or string formatting tasks. |

---

## 💻 Code Examples

Let's write a stored function to calculate a tax rate and a procedure to complete a transfer.

### SQL Setup & Queries
\`\`\`sql
-- 1. Create a Stored Function (UDF)
CREATE FUNCTION get_tax(price DECIMAL) 
RETURNS DECIMAL AS $$
BEGIN
    RETURN price * 0.08;
END;
$$ LANGUAGE plpgsql;

-- Call the function directly in a SELECT statement!
SELECT name, get_tax(price) FROM products;

-- 2. Create a Stored Procedure
CREATE PROCEDURE process_purchase(user_id INT, amount INT) AS $$
BEGIN
    UPDATE accounts SET balance = balance - amount WHERE id = user_id;
    INSERT INTO audits (user_id, action) VALUES (user_id, 'Purchase completed');
    COMMIT;
END;
$$ LANGUAGE plpgsql;

-- Execute the procedure
CALL process_purchase(101, 50);
\`\`\`

### Multi-Language Execution

##### Python (SQLite doesn't support procedures, but UDFs are super easy!)
\`\`\`python
import sqlite3

def run_udf_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Define a custom python function to register as UDF
    def get_tax(price):
        return price * 0.08
        
    # Register the function under a SQL name
    conn.create_function("get_tax", 1, get_tax)
    
    cursor.execute("CREATE TABLE items (name TEXT, price REAL)")
    cursor.execute("INSERT INTO items VALUES ('Book', 10.00)")
    
    # Query calling the custom SQL function
    cursor.execute("SELECT name, get_tax(price) FROM items")
    name, tax = cursor.fetchone()
    print(f"Item: {name}, Tax: \${tax:.2f}")
    
    conn.close()

run_udf_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class ProceduresExample {
    public static void main(String[] args) throws Exception {
        // SQLite does not support stored procedures.
        // In real systems like PostgreSQL or MySQL, we run them via CallableStatements!
        System.out.println("Java Stored Procedures are called using: CallableStatement cstmt = conn.prepareCall(\\\"{call process_purchase(?, ?)}\\\");");
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

// Helper to register C++ callbacks as SQLite custom functions
void customTax(sqlite3_context* context, int argc, sqlite3_value** argv) {
    if (argc == 1) {
        double val = sqlite3_value_double(argv[0]);
        sqlite3_result_double(context, val * 0.08);
    }
}

void runProcedures() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    // Register custom function "get_tax" in SQLite engine
    sqlite3_create_function(db, "get_tax", 1, SQLITE_UTF8, nullptr, customTax, nullptr, nullptr);
    
    sqlite3_exec(db, "CREATE TABLE items (name TEXT, price REAL);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO items VALUES ('Laptop', 1000.0);", nullptr, nullptr, nullptr);
    
    // Test the UDF
    auto callback = [](void*, int, char** argv, char**) {
        std::cout << "C++ UDF: " << argv[0] << " - Tax: " << argv[1] << std::endl;
        return 0;
    };
    sqlite3_exec(db, "SELECT name, get_tax(price) FROM items;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runProcedures() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE items (name TEXT, price REAL)");
        db.run("INSERT INTO items VALUES ('Desk', 100.0)");
        
        // SQLite doesn't natively define SQL-written stored functions,
        // but Node/JS APIs allow registering JS callback functions inside the engine!
        // This is a powerful way to inject TypeScript logic directly into SQL.
        console.log("TypeScript can register custom functions using driver-specific hooks.");
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Putting Transaction blocks inside Functions
Trying to run \`COMMIT\` or \`ROLLBACK\` inside a user-defined function. Functions are meant to be pure arithmetic calculations; they cannot control database transaction boundaries! Use a Stored Procedure instead.

### 2. Overusing Procedures for simple updates
Wrapping simple queries in procedures. This makes database schemas heavy and difficult to deploy under version control systems. Keep logic in your application unless you explicitly need database-level performance or security isolation.

---

## 🔍 Interview Corner

### Q1: What is the main difference between a Stored Procedure and a User-Defined Function (UDF)?
* **User-Defined Functions** must return a single value and can be called directly inside queries (e.g., in a \`SELECT\` or \`WHERE\` clause). They cannot modify database state or run transactions.
* **Stored Procedures** do not need to return a value, are called using \`CALL\`, and can manage transactions (\`COMMIT\`/\`ROLLBACK\`).

### Q2: Why are stored procedures considered good for security?
Procedures allow users to execute specific business actions (like \`transfer_funds\`) without giving them direct SELECT or UPDATE permissions on the raw tables (like the \`accounts\` table). This prevents SQL injection attacks and enforces secure execution policies.

---

## 🔍 Practice Links

Explore related coding challenges on the platform:
* [Nth Highest Salary](/problem/sql/nth-highest-salary)

---

## 📝 Summary

* **Functions** return exactly one value and can run inline within SQL queries.
* **Stored Procedures** run multiple SQL lines and support transactions via the \`CALL\` statement.
* Stored code reduces network traffic between your app and the database.
`;
