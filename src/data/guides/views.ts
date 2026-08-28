export const content = `
# Views: The Magic Window Goggles! 👓

## 👓 Introduction: The Colored Goggles

Imagine you work in a giant warehouse containing **millions of boxes**. 

* **The Problem:** The warehouse is super complex. If you want to count only the *fragile items*, you have to wander through 10 aisles, look for red labels, and check box weights. This is exhausting!
* **The Solution:** The warehouse manager hands you a pair of **magic window goggles** labeled *"Fragile Goggles"*. When you put them on, the complex walls disappear. You only see the fragile boxes floating in front of you. The rest of the warehouse is hidden!

In databases, a **View** is this pair of magic goggles! It is a **saved SQL query** that looks and acts just like a real table. You can query a view using simple SELECT statements, hiding all the complex JOINs and math formulas under the hood.

---

## 🏗️ How Views Work

A view is **not** a real table. It does not store a copy of the data. Instead, it is just a saved formula. Every time you query the view, the database runs the saved query behind the scenes!

\`\`\`
   [Your Simple SELECT Query] (e.g. SELECT * FROM active_employees)
              |
              v
     +-----------------+
     |   SQL VIEW      |  <--- The saved query template goggles
     +-----------------+
              |
    (Runs saved query definition under the hood)
              |
              v
   [Complex Table JOINs] (e.g. employees JOIN departments JOIN salaries)
\`\`\`

### Standard Views vs. Materialized Views

* **Standard View:** A virtual table. It runs its stored query **every single time** you SELECT from it. It takes up no disk space.
* **Materialized View:** Actually saves the result rows to disk, like a real table. It is incredibly fast to read but must be **refreshed** periodically when the underlying tables change. (Perfect for slow, heavy reports!).

---

## 💻 Code Examples

Let's create a view that hides employee salary data but exposes their departments.

### SQL Setup & Query
\`\`\`sql
-- Create a view containing only public info
CREATE VIEW public_staff AS
SELECT e.id, e.name, d.department_name
FROM employees e
JOIN departments d ON e.dept_id = d.id;

-- Query the view just like a normal table!
SELECT name FROM public_staff WHERE department_name = 'Engineering';
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_views_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("CREATE TABLE users (id INT, name TEXT, salary REAL)")
    cursor.execute("INSERT INTO users VALUES (1, 'Alice', 95000), (2, 'Bob', 50000)")
    
    # Create a VIEW that hides sensitive salary data
    cursor.execute("CREATE VIEW public_users AS SELECT id, name FROM users")
    
    # Read from view
    cursor.execute("SELECT name FROM public_users")
    for name in cursor.fetchall():
        print(f"Public View Name: {name[0]}") # Alice, Bob
        
    conn.close()

run_views_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class ViewsExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE users (id INT, name TEXT, salary REAL)");
        stmt.execute("INSERT INTO users VALUES (1, 'Alice', 90.0)");
        stmt.execute("CREATE VIEW public_users AS SELECT id, name FROM users");
        
        // Read view in Java
        ResultSet rs = stmt.executeQuery("SELECT name FROM public_users");
        while (rs.next()) {
            System.out.println("View Row: " + rs.getString("name"));
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
    std::cout << "User in View: " << argv[0] << std::endl;
    return 0;
}

void runViews() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE users (id INT, name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO users VALUES (1, 'Alice');", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE VIEW public_users AS SELECT name FROM users;", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "SELECT * FROM public_users;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runViews() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE users (id INTEGER, name TEXT)");
        db.run("INSERT INTO users VALUES (1, 'Alice')");
        db.run("CREATE VIEW public_users AS SELECT name FROM users");
        
        db.all("SELECT * FROM public_users", (err, rows: any[]) => {
            rows.forEach(row => console.log("TS View:", row.name));
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Modifying Views (Updateable Views restriction)
Trying to run \`UPDATE\` or \`INSERT\` statements on a view that aggregates rows or joins multiple tables. Most database engines will reject this because they don't know how to split the change back into the original tables!
* **Bad:** \`INSERT INTO view_with_joins VALUES ('Alice');\` (Fails).
* **Good:** Always write insert statements directly against the base tables instead of a view.

### 2. Nesting Views Deeply
Creating View B based on View A, and View C based on View B. This creates a chain of hidden JOIN queries that becomes incredibly slow and impossible for database engines to optimize.

---

## 🔍 Interview Corner

### Q1: What is the difference between a View and a Materialized View?
* A **Standard View** is a virtual table that runs its underlying query from scratch **every single time** you query it. It uses no disk storage.
* A **Materialized View** pre-computes the query result and stores the actual rows on disk. It is fast to query but must be manually or automatically **refreshed** when the source tables change.

### Q2: Why are views useful for database security?
Views allow database administrators to expose only specific columns or rows of a table to certain database users while completely restricting access to the main table. For example, a payroll clerk can be given access to a view that hides salary amounts but shows employee IDs and department mappings.

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Department Highest Salary](/problem/sql/department-highest-salary)

---

## 📝 Summary

* A **View** is a saved query that acts like a virtual table.
* Standard views compute results on-the-fly and take up no storage space.
* Views simplify complex queries and help secure sensitive data tables.
`;
