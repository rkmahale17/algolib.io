export const content = `
# Database Relationships: The School Dance Map! 💃

## 💃 Introduction: The School Dance

Imagine you are organizing a school dance. To keep track of who is hanging out with whom, you notice three types of groups:

1. **One-to-One (1:1) - The Dance Partners:** Alice is dancing with Bob. One student is paired with exactly one other student.
2. **One-to-Many (1:M) - The Class Teacher:** Mrs. Smith is supervising 15 students in the gym. One teacher is linked to many students, but each student only has one supervisor.
3. **Many-to-Many (N:M) - The Snack Bar & Students:** Students are eating snacks, and snacks are eaten by students. Alice eats cupcakes and chips. Cupcakes are eaten by Alice, Bob, and Charlie. 

In databases, these are **Relationships**! They define how tables draw lines to connect with each other.

---

## 🔀 The Three Types of Relationships

Here is how we map relationships in database models:

\`\`\`
1-to-1 Relationship
[Users] (1) <------------------------> (1) [UserProfiles]
(One user has one profile; profile has one user)

1-to-Many Relationship
[Departments] (1) <------------------ (M) [Employees]
(One department has many employees; employee belongs to one dept)

Many-to-Many Relationship (Requires Junction Table)
[Students] (N) <--> [StudentClubs] <-- (M) [Clubs]
                      | student_id |
                      | club_id    |
\`\`\`

### 1. One-to-One (1:1)
Each row in Table A matches exactly one row in Table B.
* *Example:* A \`User\` and their \`User_Profile\`. 
* *How to build:* Put the foreign key in either table and make it **UNIQUE**.

### 2. One-to-Many (1:M or 1:N)
Each row in Table A can match many rows in Table B, but a row in Table B can only match one row in Table A.
* *Example:* An \`Author\` has many \`Books\`.
* *How to build:* Put the foreign key in the "Many" table (e.g., the \`author_id\` goes in the \`books\` table).

### 3. Many-to-Many (N:M)
Multiple rows in Table A can match multiple rows in Table B.
* *Example:* \`Students\` and \`Clubs\`. A student can join many clubs; a club can have many students.
* *How to build:* You **must** use a third helper table called a **Junction Table** (or Bridge Table) that holds two foreign keys!

---

## 💻 Code Examples

Let's see how we set up a Many-to-Many relationship using a junction table in SQL and code.

### SQL Setup (Many-to-Many)
\`\`\`sql
-- Students Table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

-- Clubs Table
CREATE TABLE clubs (
    club_id INTEGER PRIMARY KEY,
    club_name TEXT NOT NULL
);

-- Junction Table linking Students and Clubs
CREATE TABLE student_clubs (
    student_id INTEGER,
    club_id INTEGER,
    PRIMARY KEY (student_id, club_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (club_id) REFERENCES clubs(club_id)
);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_relationships_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Create schema
    cursor.execute("CREATE TABLE students (id INT PRIMARY KEY, name TEXT)")
    cursor.execute("CREATE TABLE clubs (id INT PRIMARY KEY, name TEXT)")
    cursor.execute("CREATE TABLE student_clubs (student_id INT, club_id INT)")
    
    # Insert students and clubs
    cursor.execute("INSERT INTO students VALUES (1, 'Alice'), (2, 'Bob')")
    cursor.execute("INSERT INTO clubs VALUES (10, 'Coding'), (20, 'Chess')")
    
    # Link them in junction table
    cursor.execute("INSERT INTO student_clubs VALUES (1, 10)") # Alice joins Coding
    cursor.execute("INSERT INTO student_clubs VALUES (1, 20)") # Alice joins Chess
    cursor.execute("INSERT INTO student_clubs VALUES (2, 20)") # Bob joins Chess
    conn.commit()
    
    # Find all clubs Alice joined
    cursor.execute("""
        SELECT c.name 
        FROM clubs c
        JOIN student_clubs sc ON c.id = sc.club_id
        JOIN students s ON s.id = sc.student_id
        WHERE s.name = 'Alice'
    """)
    print("Alice's Clubs:", [row[0] for row in cursor.fetchall()])
    conn.close()

run_relationships_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class RelationshipsExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE students (id INT PRIMARY KEY, name TEXT)");
        stmt.execute("CREATE TABLE clubs (id INT PRIMARY KEY, name TEXT)");
        stmt.execute("CREATE TABLE student_clubs (student_id INT, club_id INT)");
        
        stmt.execute("INSERT INTO students VALUES (1, 'Alice')");
        stmt.execute("INSERT INTO clubs VALUES (10, 'Coding')");
        stmt.execute("INSERT INTO student_clubs VALUES (1, 10)");
        
        ResultSet rs = stmt.executeQuery(
            "SELECT s.name, c.name FROM students s " +
            "JOIN student_clubs sc ON s.id = sc.student_id " +
            "JOIN clubs c ON c.id = sc.club_id"
        );
        while (rs.next()) {
            System.out.println(rs.getString(1) + " is in " + rs.getString(2) + " club");
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
    std::cout << argv[0] << " is in " << argv[1] << std::endl;
    return 0;
}

void runRelationships() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE students (id INT PRIMARY KEY, name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE clubs (id INT PRIMARY KEY, name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE sc (student_id INT, club_id INT);", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "INSERT INTO students VALUES (1, 'Alice');", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO clubs VALUES (10, 'Coding');", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO sc VALUES (1, 10);", nullptr, nullptr, nullptr);
    
    const char* sql = "SELECT s.name, c.name FROM students s JOIN sc ON s.id = sc.student_id JOIN clubs c ON c.id = sc.club_id;";
    sqlite3_exec(db, sql, callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runRelationships() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT)");
        db.run("CREATE TABLE clubs (id INTEGER PRIMARY KEY, name TEXT)");
        db.run("CREATE TABLE student_clubs (student_id INTEGER, club_id INTEGER)");
        
        db.run("INSERT INTO students VALUES (1, 'Alice')");
        db.run("INSERT INTO clubs VALUES (10, 'Coding')");
        db.run("INSERT INTO student_clubs VALUES (1, 10)");
        
        db.each(\`
            SELECT s.name, c.name 
            FROM students s 
            JOIN student_clubs sc ON s.id = sc.student_id 
            JOIN clubs c ON c.id = sc.club_id
        \`, (err, row: any) => {
            if (row) {
                console.log(\\\`\\\${row.name} is in \\\${row.name_1 ?? row.name} club\\\`);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Storing Comma-Separated Values
Trying to implement a Many-to-Many relationship by storing a comma-separated list of IDs in a single column (e.g. \`club_ids = "10,20,30"\`). This violates 1NF, makes index lookups impossible, and makes filtering extremely slow!
* **Bad:** \`club_ids TEXT\` with value \`"10,20"\`.
* **Good:** Use a proper junction table \`student_clubs\`.

### 2. Forgetting CASCADE Constraints
If you delete a club, but leave student associations in the junction table, you violate foreign key referential integrity.

---

## 🔍 Interview Corner

### Q1: How do you design a Many-to-Many relationship in a relational database?
To design a **Many-to-Many** relationship, you must create a separate table called a **Junction Table** (or bridge table). This table contains two foreign keys pointing to the primary keys of the related tables. The composite primary key of the junction table is typically the combination of both foreign keys.

### Q2: What is the difference between a 1:1 and a 1:M relationship?
* In **1:1**, a record in Table A is linked to at most one record in Table B (created by making the foreign key column \`UNIQUE\`).
* In **1:M**, a record in Table A can be linked to multiple records in Table B, but each record in Table B links to only one record in Table A.

---

## 📝 Summary

* **1:1:** Put the foreign key in either table with a **\`UNIQUE\`** constraint.
* **1:M:** Put the foreign key in the **"Many"** table.
* **N:M:** Create a separate **Junction Table** holding references to both.
`;
