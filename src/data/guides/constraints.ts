export const content = `
# Constraints: The Amusement Park Height Checker! 🎢

## 🎢 Introduction: The Roller Coaster Guard

Imagine you go to a theme park to ride a giant roller coaster. Before you can enter, there is a ride operator standing at the gate with a wooden ruler:

1. **The Height Rule (CHECK):** *"You must be at least 48 inches tall to ride!"* If you are shorter, the operator stops you.
2. **The Ticket Rule (NOT NULL):** *"You must have a physical ticket!"* If your hand is empty, you cannot enter.
3. **The Seat Rule (UNIQUE):** *"Only one person can sit in seat number 12!"* Two people cannot occupy the same seat.

In a database, **Constraints** are these exact rules! They stand at the gates of your tables and examine every piece of data trying to enter. If a piece of data breaks the rules, the database operator rejects it!

---

## 🛡️ Types of Database Constraints

Constraints keep your data clean, accurate, and reliable. Without them, your database would slowly fill with junk data.

\`\`\`
       Incoming Data (INSERT / UPDATE)
                   |
                   v
      +-------------------------+
      |       CONSTRAINTS       |
      |  [NOT NULL]   [UNIQUE]  | <--- Gates checking data properties
      |   [CHECK]    [DEFAULT]  |
      +-------------------------+
                   |
          (Passed checks?)
          /             \
       YES               NO
        /                 \
       v                   v
[Saved in Table]    [Rejected / Error]
\`\`\`

* **\`NOT NULL\`**: This column cannot be empty. Every row must have a value here.
* **\`UNIQUE\`**: No two rows can have the same value in this column (like an email address or license plate).
* **\`DEFAULT\`**: If you don't provide a value, the database fills it in automatically (e.g., setting the signup date to "Today").
* **\`CHECK\`**: Makes sure the value satisfies a mathematical or logical condition (e.g., \`age >= 18\` or \`price > 0\`).
* **\`PRIMARY KEY\`**: A combination of \`NOT NULL\` and \`UNIQUE\`.
* **\`FOREIGN KEY\`**: Ensures the value matches a key in another table.

---

## 💻 Code Examples

Let's see how we write SQL constraints and handle validation failures.

### SQL Setup
\`\`\`sql
CREATE TABLE coaster_riders (
    rider_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,                  -- Must have a name
    email TEXT UNIQUE,                   -- Emails must be unique
    height_inches INTEGER CHECK(height_inches >= 48), -- Must be tall enough
    status TEXT DEFAULT 'waiting'        -- Automatic default value
);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_constraints_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE coaster_riders (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            height INTEGER CHECK(height >= 48)
        )
    """)
    
    # Successful insert
    cursor.execute("INSERT INTO coaster_riders (name, height) VALUES ('Alice', 52)")
    
    # Try inserting someone too short (breaks CHECK constraint)
    try:
        cursor.execute("INSERT INTO coaster_riders (name, height) VALUES ('Timmy', 40)")
    except sqlite3.IntegrityError as e:
        print(f"Blocked Timmy: {e}")
        
    # Try inserting a row without a name (breaks NOT NULL constraint)
    try:
        cursor.execute("INSERT INTO coaster_riders (height) VALUES (50)")
    except sqlite3.IntegrityError as e:
        print(f"Blocked empty name: {e}")
        
    conn.close()

run_constraints_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class ConstraintsExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE coaster_riders (id INTEGER PRIMARY KEY, name TEXT NOT NULL, height INT CHECK(height >= 48))");
        
        // Let's test the CHECK constraint in Java
        try {
            stmt.execute("INSERT INTO coaster_riders (name, height) VALUES ('Billy', 42)");
        } catch (SQLException e) {
            System.out.println("Java caught validation error: " + e.getMessage());
        }
        conn.close();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

void runConstraintsExample() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE coaster (id INT PRIMARY KEY, name TEXT NOT NULL, height INT CHECK(height >= 48));", nullptr, nullptr, nullptr);
    
    // Attempt invalid insert
    int rc = sqlite3_exec(db, "INSERT INTO coaster (name, height) VALUES ('Timmy', 40);", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cout << "Database successfully blocked invalid insert (Height too small)." << std::endl;
    }
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runConstraintsExample() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE coaster (id INTEGER PRIMARY KEY, name TEXT NOT NULL, height INTEGER CHECK(height >= 48))");
        
        // This will trigger an integrity violation error
        db.run("INSERT INTO coaster (height) VALUES (52)", (err) => {
            if (err) {
                console.log("TypeScript received block notification:", err.message);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Relying on Frontend Checks Only
Thinking your website's forms (HTML/JS) are enough. Hackers can bypass your browser and send bad data directly. Always set constraints in your database as the final line of defense!
* **Bad:** Relying on client-side JS validators only.
* **Good:** Set database checks on critical numeric values.

### 2. Constraints That are Too Rigid
Setting a constraint that prevents legitimate user inputs. For example, forcing phone numbers to match a strict check of exactly 10 digits, which blocks international country codes!

---

## 🔍 Interview Corner

### Q1: What is the difference between a UNIQUE constraint and a PRIMARY KEY?
* A **PRIMARY KEY** uniquely identifies each row and **cannot** contain \`NULL\` values. You can have only **one** PRIMARY KEY per table.
* A **UNIQUE** constraint also guarantees unique values but **can** contain \`NULL\` values. You can set multiple UNIQUE constraints on different columns.

### Q2: What is a CHECK constraint, and when should you use it?
A **CHECK** constraint is a logical rule that validates values before they are written. It is used to enforce range logic (e.g. \`balance >= 0\`, \`age >= 18\`, \`status IN ('pending', 'completed')\`).

---

## 📝 Summary

* **Constraints** are safety guardrails built directly into your database schema.
* Common checks include **\`NOT NULL\`**, **\`UNIQUE\`**, **\`DEFAULT\`**, and **\`CHECK\`**.
* The database engine automatically rejects transactions that violate these rules.
`;
