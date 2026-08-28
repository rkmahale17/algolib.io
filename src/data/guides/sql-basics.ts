export const content = `
# SQL Basics: Talking to Your Database Assistant! 💬

## 💬 Introduction: The Robot Assistant

Imagine you have a super-fast robot assistant named **SQL**. 

You don't need to manually move files around or sort data arrays on your computer. You just give SQL clear, written instructions:

* *"SQL, build a new empty shelf named 'Toys'."* (DDL - Structure)
* *"SQL, put a red ball on the shelf."* (DML - Data)
* *"SQL, show me all the green toys on the shelf."* (Query - Read)

SQL stands for **Structured Query Language**. It is the standard language used by all developers to tell relational databases exactly what to do!

---

## 🏗️ The Sub-Languages of SQL

SQL commands are grouped into different categories based on what they do:

\`\`\`
                            SQL COMMANDS
                                 |
        +------------------------+------------------------+
        |                                                 |
  DDL (Structure)                                  DML (Content)
  - CREATE (Build table)                           - SELECT (Fetch rows)
  - ALTER (Modify columns)                         - INSERT (Add rows)
  - DROP (Delete table)                            - UPDATE (Change rows)
                                                   - DELETE (Remove rows)
\`\`\`

### 1. DDL (Data Definition Language) - The Blueprint Builder
These commands define the **structure** or schema of your database (the tables and columns).
* **\`CREATE\`**: Build a new table or database.
* **\`ALTER\`**: Modify an existing table structure (like adding a column).
* **\`DROP\`**: Delete an entire table from the system.

### 2. DML (Data Manipulation Language) - The Content Worker
These commands work with the **actual rows of data** inside the tables.
* **\`INSERT\`**: Add a new row.
* **\`UPDATE\`**: Change values in an existing row.
* **\`DELETE\`**: Erase a row.
* **\`SELECT\`**: Read or fetch rows (technically a query language, DQL).

### 3. DCL & TCL (Control Languages)
* **DCL (Data Control Language):** Manages access permissions (\`GRANT\`, \`REVOKE\`).
* **TCL (Transaction Control Language):** Manages transaction boundaries (\`COMMIT\`, \`ROLLBACK\`).

---

## 💻 Code Examples

Let's see how we run basic SQL commands and execute them using coding languages.

### SQL Script
\`\`\`sql
-- 1. Create structure (DDL)
CREATE TABLE toys (
    toy_id INTEGER PRIMARY KEY,
    name TEXT,
    color TEXT
);

-- 2. Modify data (DML)
INSERT INTO toys (name, color) VALUES ('Lego Block', 'Green');
INSERT INTO toys (name, color) VALUES ('Teddy Bear', 'Brown');

-- 3. Query data
SELECT name FROM toys WHERE color = 'Green';
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_sql_basics():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # DDL: Create Table
    cursor.execute("CREATE TABLE toys (id INTEGER PRIMARY KEY, name TEXT, color TEXT)")
    
    # DML: Insert Data
    cursor.execute("INSERT INTO toys (name, color) VALUES ('Toy Car', 'Red')")
    conn.commit()
    
    # Query: Select Data
    cursor.execute("SELECT name FROM toys WHERE color = 'Red'")
    print("Python Fetch:", cursor.fetchone()[0])
    
    conn.close()

run_sql_basics()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class SqlBasicsExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        // Execute DDL
        stmt.execute("CREATE TABLE toys (id INT PRIMARY KEY, name TEXT, color TEXT)");
        
        // Execute DML
        stmt.executeUpdate("INSERT INTO toys (name, color) VALUES ('Kite', 'Blue')");
        
        // Execute Query
        ResultSet rs = stmt.executeQuery("SELECT name FROM toys WHERE color = 'Blue'");
        if (rs.next()) {
            System.out.println("Java Fetch: " + rs.getString("name"));
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
    std::cout << "C++ Fetch: " << argv[0] << std::endl;
    return 0;
}

void runSqlBasics() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE toys (id INT PRIMARY KEY, name TEXT, color TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO toys (name, color) VALUES ('Action Figure', 'Green');", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "SELECT name FROM toys WHERE color = 'Green';", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runSqlBasics() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE toys (id INTEGER PRIMARY KEY, name TEXT, color TEXT)");
        db.run("INSERT INTO toys (name, color) VALUES ('YoYo', 'Yellow')");
        
        db.get("SELECT name FROM toys WHERE color = 'Yellow'", (err, row: any) => {
            if (row) {
                console.log("TypeScript Fetch:", row.name);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Forgetting WHERE clauses on UPDATE or DELETE
If you run \`DELETE FROM toys\` without a \`WHERE\` condition, SQL will delete **every single toy** on the shelf! Always double check your query filters before executing writes.
* **Bad:** \`DELETE FROM users;\` (Erases all data).
* **Good:** \`DELETE FROM users WHERE id = 101;\` (Deletes only one record).

### 2. Forgetting Semi-Colons in multi-query scripts
Leaving out the \`;\` separator, which causes query parsers to merge statements together and crash.

---

## 🔍 Interview Corner

### Q1: What is the difference between DDL and DML in SQL?
* **DDL (Data Definition Language)** commands (like \`CREATE\`, \`ALTER\`, \`DROP\`) define and modify the schema structure of the database.
* **DML (Data Manipulation Language)** commands (like \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`SELECT\`) manipulate the actual data rows stored inside the schemas.

### Q2: What is the difference between DELETE and DROP?
* **DELETE** removes rows from a table but keeps the table structure intact (you can still insert new rows into it). It can be rolled back.
* **DROP** completely deletes the table structure, columns, and all its data from the database. It cannot be rolled back.

---

## 📝 Summary

* **SQL** is the universal structured query language for relational databases.
* **DDL** (\`CREATE\`, \`ALTER\`, \`DROP\`) builds the structure/schema.
* **DML** (\`INSERT\`, \`UPDATE\`, \`DELETE\`, \`SELECT\`) manages the data rows.
`;
