export const content = `
# Normalization: The Neat Dresser Drawer! 👕

## 👕 Introduction: The Messy Clothes Drawer

Imagine you have a single dresser drawer where you throw **all your clothes**: shirts, pants, socks, coats, and shoes are just one massive pile. 

When you want to grab socks, you have to dig through the whole pile. If you paint a pair of shoes blue, paint drips onto your white shirts (this is a data update mess!).

What is the solution? **Normalization!** 

Normalization is the process of splitting one giant, messy table into smaller, specialized tables and linking them together. It's like putting dividers in your drawer: shirts go in the shirt section, socks in the socks compartment, and shoes on the rack.

---

## 📐 The Three Steps (Normal Forms)

Normalization aims to eliminate three anomalies:
1. **Insert Anomaly:** You can't add an author without them having written a book.
2. **Update Anomaly:** If you change an author's address, you have to update it in 1,000 book rows.
3. **Delete Anomaly:** Deleting a book deletes the author entirely.

To prevent this, we normalize database tables by following **Normal Forms**:

\`\`\`
[Unnormalized Table] 
(Repeated data, multi-valued fields)
          |
          |  1NF (Make values atomic / unique PK)
          v
      [1NF Table]
          |
          |  2NF (Remove partial dependencies on composite keys)
          v
      [2NF Table]
          |
          |  3NF (Remove transitive dependencies / non-key columns)
          v
      [3NF Tables] (Fully clean, modular tables)
\`\`\`

### 1. First Normal Form (1NF): No Multi-values
Every box (cell) in your table must contain only **one single item** (atomic value). You cannot store a list of values in one cell.
* *Bad:* Alice's phone number column is \`"555-1234, 555-5678"\`.
* *Good:* Move phone numbers to a separate table where each number gets its own row.

### 2. Second Normal Form (2NF): Meet 1NF + Match the Key
Every column in the table must describe the **whole primary key**, not just a part of it. This applies to tables with composite keys (keys made of multiple columns).
* *Bad:* In a \`Course_Registration(student_id, course_id, student_name)\` table, \`student_name\` only depends on \`student_id\`, not on the \`course_id\`.
* *Good:* Split it into a \`Students(student_id, student_name)\` table and a \`Registrations(student_id, course_id)\` table.

### 3. Third Normal Form (3NF): Meet 2NF + No Gossip (No Transitive Dependency)
No column should depend on a non-key column. Columns shouldn't be "gossiping" through middle-men.
* *Bad:* In a \`Schools(student_id, school_name, school_address)\` table, \`school_address\` depends on \`school_name\`, which then depends on \`student_id\`.
* *Good:* Split it into \`Students(student_id, school_id)\` and \`Schools(school_id, school_name, school_address)\`.

---

## 💻 Code Examples

Let's see the before (unnormalized) and after (normalized) data design.

### Unnormalized Database Setup
\`\`\`sql
-- Problem: Storing student and school details in a single table (3NF Violation)
CREATE TABLE messy_students (
    student_id INTEGER PRIMARY KEY,
    student_name TEXT,
    school_name TEXT,
    school_address TEXT -- Redundant! If 1,000 students go here, we repeat this address 1,000 times!
);
\`\`\`

### Normalized Database Setup (3NF Compliant)
\`\`\`sql
-- Solution: Split into two tables linked by a key
CREATE TABLE schools (
    school_id INTEGER PRIMARY KEY,
    school_name TEXT NOT NULL,
    school_address TEXT NOT NULL
);

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    student_name TEXT NOT NULL,
    school_id INTEGER,
    FOREIGN KEY (school_id) REFERENCES schools(school_id)
);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_normalization_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Create normalized tables
    cursor.execute("CREATE TABLE schools (id INTEGER PRIMARY KEY, name TEXT, address TEXT)")
    cursor.execute("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, school_id INTEGER)")
    
    # Insert data once
    cursor.execute("INSERT INTO schools VALUES (10, 'Greenwood High', '123 Forest Rd')")
    cursor.execute("INSERT INTO students VALUES (1, 'Alice', 10)")
    cursor.execute("INSERT INTO students VALUES (2, 'Bob', 10)")
    conn.commit()
    
    # Query student and their school info using JOIN
    cursor.execute("""
        SELECT s.name, sc.name, sc.address 
        FROM students s 
        JOIN schools sc ON s.school_id = sc.id
    """)
    for row in cursor.fetchall():
        print(f"Student: {row[0]}, School: {row[1]}, Address: {row[2]}")
        
    conn.close()

run_normalization_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class NormalizationExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE schools (id INT PRIMARY KEY, name TEXT, address TEXT)");
        stmt.execute("CREATE TABLE students (id INT PRIMARY KEY, name TEXT, school_id INT)");
        
        stmt.execute("INSERT INTO schools VALUES (1, 'Hogwarts', 'Scotland')");
        stmt.execute("INSERT INTO students VALUES (101, 'Harry', 1)");
        
        ResultSet rs = stmt.executeQuery(
            "SELECT s.name, sc.name FROM students s JOIN schools sc ON s.school_id = sc.id"
        );
        while (rs.next()) {
            System.out.println("Student: " + rs.getString(1) + ", School: " + rs.getString(2));
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
    std::cout << "Student: " << argv[0] << ", School: " << argv[1] << std::endl;
    return 0;
}

void runNormalization() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE schools (id INT PRIMARY KEY, name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE students (id INT PRIMARY KEY, name TEXT, school_id INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO schools VALUES (1, 'Starfleet');", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO students VALUES (101, 'Kirk', 1);", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "SELECT s.name, sc.name FROM students s JOIN schools sc ON s.school_id = sc.id;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runNormalization() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE schools (id INTEGER PRIMARY KEY, name TEXT)");
        db.run("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, school_id INTEGER)");
        
        db.run("INSERT INTO schools VALUES (1, 'Xavier School')");
        db.run("INSERT INTO students VALUES (101, 'Logan', 1)");
        
        db.each("SELECT s.name, sc.name FROM students s JOIN schools sc ON s.school_id = sc.id", (err, row: any) => {
            if (!err) {
                console.log(\`Student: \${row.name}, School: \${row.name_1 ?? row.name}\`);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Over-Normalization
Splitting tables too much. This creates a massive collection of 1-column tables, which requires writing extremely slow and long queries with 10 JOIN statements just to render a simple webpage.

### 2. Update Anomalies in messy structures
Keeping unnormalized tables where updates to redundant details fail. For example, if you update the school name but forget to update it in all 500 student rows, your database is corrupted!

---

## 🔍 Interview Corner

### Q1: What is 3NF, and how does it differ from 2NF?
* **2NF (Second Normal Form)** requires the table to be in 1NF and all non-key attributes must be fully dependent on the primary key (no partial dependencies on composite keys).
* **3NF (Third Normal Form)** requires the table to be in 2NF and all attributes must be dependent **only** on the primary key, meaning there are no transitive dependencies (where a non-key column depends on another non-key column).

### Q2: What are database anomalies?
1. **Insert Anomaly:** Being unable to insert data because other dependent data does not exist yet.
2. **Update Anomaly:** Inconsistent data resulting from updating a value in some rows but missing others.
3. **Delete Anomaly:** Losing critical data by deleting a record (e.g. deleting the last student enrolled in a class deletes the course detail).

---

## 📝 Summary

* **Normalization** reduces redundant data and keeps your database clean.
* **1NF:** Atomic values only.
* **2NF:** No partial dependencies on the primary key.
* **3NF:** No transitive dependencies (no non-key columns depending on other non-key columns).
`;
