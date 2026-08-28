export const content = `
# Relational Databases & RDBMS: The Library's Card Catalog! 📚

## 🏢 Introduction: The Great Town Library

Imagine you walk into a giant library containing **one million books**. 

If all the books were just thrown into a massive pile in the middle of the room, you would never find the book you wanted! You would have to pick up every single book, look at the cover, and put it down. This would take you months.

So, the library uses a highly organized system:
1. **The Shelves (Tables):** Books are grouped by category on different shelves. There's a shelf for \`Books\`, a shelf for \`Authors\`, and a shelf for \`Members\`.
2. **The Card Indexes (Keys):** Every book has a unique code on its spine (like a **Primary Key**). And the member cards list which book codes they have borrowed.
3. **The Head Librarian (RDBMS):** The super-smart librarian who knows exactly where every book is and prevents people from borrowing books that don't exist.

This entire organized system is a **Relational Database**. The Head Librarian program is the **RDBMS** (Relational Database Management System)!

---

## ⚙️ What is an RDBMS?

An **RDBMS** is a software program that lets you create, update, and manage a relational database. It is the "engine" under the hood.

Relational databases store data in grid-like structures called **Tables** (which look like spreadsheets). They are called "relational" because the tables can be linked, or **related**, to each other using common fields.

\`\`\`
   [Authors Table]                  [Books Table]
+------------------+         +--------------------------+
| author_id (PK)   | <-----+ | book_id (PK)             |
| name             |         | title                    |
| country          |         | author_id (FK)           |
+------------------+         +--------------------------+
\`\`\`

### Famous RDBMS Software:
* **PostgreSQL:** Known for being super powerful, extensible, and standards-compliant.
* **MySQL:** The world's most popular open-source database, powering sites like WordPress and Facebook.
* **SQLite:** A lightweight database that stores everything in a single file—great for mobile apps and developer prototyping!

---

## 🛠️ The Core Concept: Table Relations

Let's look at how we connect two tables. We have an \`authors\` table and a \`books\` table:

### Authors Table:
| author_id (PK) | name | country |
| :--- | :--- | :--- |
| 1 | J.K. Rowling | UK |
| 2 | J.R.R. Tolkien | UK |

### Books Table:
| book_id (PK) | title | author_id (FK) |
| :--- | :--- | :--- |
| 101 | Harry Potter | 1 |
| 102 | The Hobbit | 2 |

The \`author_id\` column in the Books table links back to the Authors table. This link is called a **Foreign Key**!

---

## 💻 Code Examples

Let's see how we define this relationship in SQL and query it using different programming languages.

### SQL Setup
\`\`\`sql
-- Create the Authors table
CREATE TABLE authors (
    author_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

-- Create the Books table linked to Authors
CREATE TABLE books (
    book_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author_id INTEGER,
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_rdbms_example():
    # Connect to an in-memory SQLite database
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT)")
    cursor.execute("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author_id INTEGER)")
    
    # Insert rows
    cursor.execute("INSERT INTO authors VALUES (1, 'J.K. Rowling')")
    cursor.execute("INSERT INTO books VALUES (101, 'Harry Potter', 1)")
    conn.commit()
    
    # Query with a JOIN to connect the relation
    cursor.execute(\"\"\"
        SELECT b.title, a.name 
        FROM books b 
        JOIN authors a ON b.author_id = a.id
    \"\"\")
    for row in cursor.fetchall():
        print(f"Book: {row[0]}, Author: {row[1]}")
        
    conn.close()

run_rdbms_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class RdbmsExample {
    public static void main(String[] args) throws Exception {
        // Connect to SQLite in-memory database
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        // Setup schema
        stmt.execute("CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT)");
        stmt.execute("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author_id INTEGER)");
        
        // Insert sample data
        stmt.execute("INSERT INTO authors VALUES (1, 'J.R.R. Tolkien')");
        stmt.execute("INSERT INTO books VALUES (102, 'The Hobbit', 1)");
        
        // Join query
        ResultSet rs = stmt.executeQuery(
            "SELECT b.title, a.name FROM books b JOIN authors a ON b.author_id = a.id"
        );
        while (rs.next()) {
            System.out.println("Book: " + rs.getString("title") + ", Author: " + rs.getString("name"));
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
    std::cout << "Book: " << argv[0] << ", Author: " << argv[1] << std::endl;
    return 0;
}

void runRdbmsExample() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    // Create tables and insert data
    sqlite3_exec(db, "CREATE TABLE authors(id INT PRIMARY KEY, name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE books(id INT PRIMARY KEY, title TEXT, author_id INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO authors VALUES(1, 'J.K. Rowling');", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO books VALUES(101, 'Harry Potter', 1);", nullptr, nullptr, nullptr);
    
    // Query
    const char* query = "SELECT b.title, a.name FROM books b JOIN authors a ON b.author_id = a.id;";
    sqlite3_exec(db, query, callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runRdbmsExample() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT)");
        db.run("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author_id INTEGER)");
        
        db.run("INSERT INTO authors VALUES (1, 'J.K. Rowling')");
        db.run("INSERT INTO books VALUES (101, 'Harry Potter', 1)");
        
        db.each(\`
            SELECT b.title, a.name 
            FROM books b 
            JOIN authors a ON b.author_id = a.id
        \`, (err, row: any) => {
            if (err) console.error(err);
            else console.log(\\\`Book: \\\${row.title}, Author: \\\${row.name}\\\`);
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Forgetting Foreign Key Constraints
If you don't enforce foreign keys, someone might add a book written by Author \`99\`, even if Author \`99\` doesn't exist! This creates "orphan" records that break search results.
* **Bad:** Creating tables without mapping dependencies.
* **Good:** Always write \`FOREIGN KEY (author_id) REFERENCES authors(id)\`.

### 2. Confusing Database vs. RDBMS
Remember, the database is the collection of actual files storing your books on disk. The RDBMS is the software engine (like PostgreSQL or MySQL) that manages those files and parses SQL queries.

### 3. Redundant Data Storage
Storing the author's nationality or country of birth in every single row of the \`books\` table instead of moving it to the \`authors\` table. This causes waste of disk storage and creates update nightmares.

---

## 🔍 Interview Corner

### Q1: What is the difference between a DBMS and an RDBMS?
* **DBMS (Database Management System)** is a general software program to store data in files. It does not enforce relationships between records and has flat data organization.
* **RDBMS (Relational Database Management System)** is a specialized DBMS that organizes data strictly in tables (relations) and enforces data integrity using Primary/Foreign Keys and ACID rules.

### Q2: What are the main features of an RDBMS?
1. **Structured Columns (Schema):** Ensures data matches strict types.
2. **Data Integrity:** Guarantees relations are valid and no orphan rows exist.
3. **Transactions:** Supports ACID properties for safe concurrent operations.

---

## 📝 Summary

* **RDBMS** is the manager program for relational databases.
* Data is stored in **Tables** with rows and columns.
* Tables relate to each other using shared keys like **Primary Keys** and **Foreign Keys**.
`;
