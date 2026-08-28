export const content = `
# Denormalization: The Speed Runner's Shortcut! 🏃

## 🏃 Introduction: The Chef's Countertop

Imagine you are a chef making pizzas in a busy restaurant.

* **Normalized Kitchen:** Every time you make a pizza, you have to walk to the pantry for flour, walk to the fridge for cheese, and walk to the cellar for tomatoes. It is super neat and organized, but walking to 3 places for every single pizza makes you **slow**!
* **Denormalized Kitchen:** You duplicate some ingredients and keep a container of flour, cheese, and tomatoes **right next to your cooking table**. Now you can make pizzas in seconds! 

In databases, **Denormalization** is the process of copying data from one table to another on purpose. We do this to avoid doing slow JOIN queries, making our database **read data super fast**!

---

## ⚖️ Normalization vs. Denormalization

\`\`\`
NORMALIZED DESIGN (Slow Reads, Clean Writes)
[Books Table]                       [Authors Table]
| title        | author_id |  ===>  | id | name        |
| Harry Pot... | 1         |  ===>  | 1  | J.K.Rowling |
                                    (Must JOIN to count books)

DENORMALIZED DESIGN (Fast Reads, Complex Writes)
[Authors Table] (Duplicates counts directly)
| id | name        | book_count |
| 1  | J.K.Rowling | 5          | <--- Counter is cached here!
\`\`\`

| Feature | Normalization | Denormalization |
| :--- | :--- | :--- |
| **Primary Goal** | Minimize redundant data & save space. | Maximize read speed & query efficiency. |
| **Write Speed** | Fast. You only write data in one place. | Slower. You have to update data in multiple tables. |
| **Read Speed** | Slower (requires complex table JOINs). | Super fast (reads from one flat table). |
| **Data Integrity**| High. No risk of out-of-sync values. | Risk of data mismatch if updates fail. |

---

## 💻 Code Examples

Let's see how denormalization works by storing a pre-calculated count directly.

### The Normalized Approach
To find the number of books an author has written, we must scan the entire books table:
\`\`\`sql
SELECT name, COUNT(books.id) 
FROM authors 
LEFT JOIN books ON authors.id = books.author_id 
GROUP BY authors.id;
\`\`\`

### The Denormalized Approach
We add a \`book_count\` column directly to the \`authors\` table. No JOIN is needed!
\`\`\`sql
-- Simply read from a single table directly
SELECT name, book_count FROM authors;
\`\`\`

Let's see how we manage the denormalized count updates in multiple languages.

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_denormalization_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Authors table holding denormalized count
    cursor.execute("""
        CREATE TABLE authors (
            id INTEGER PRIMARY KEY,
            name TEXT,
            book_count INTEGER DEFAULT 0
        )
    """)
    cursor.execute("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author_id INTEGER)")
    
    # Insert author
    cursor.execute("INSERT INTO authors (id, name) VALUES (1, 'J.K. Rowling')")
    
    # Helper function to add book and update count
    def add_book(title, author_id):
        cursor.execute("INSERT INTO books (title, author_id) VALUES (?, ?)", (title, author_id))
        # Denormalized write: We must update the count!
        cursor.execute("UPDATE authors SET book_count = book_count + 1 WHERE id = ?", (author_id,))
        conn.commit()
        
    add_book('Harry Potter 1', 1)
    add_book('Harry Potter 2', 1)
    
    # Instant query without JOIN
    cursor.execute("SELECT name, book_count FROM authors WHERE id = 1")
    author, count = cursor.fetchone()
    print(f"Author: {author}, Total Books: {count}")
    
    conn.close()

run_denormalization_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class DenormalizationExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE authors (id INT PRIMARY KEY, name TEXT, book_count INT DEFAULT 0)");
        stmt.execute("CREATE TABLE books (id INT PRIMARY KEY, title TEXT, author_id INT)");
        
        // Transaction to ensure both writes succeed together
        conn.setAutoCommit(false);
        try {
            stmt.execute("INSERT INTO authors VALUES (1, 'Tolkien', 0)");
            stmt.execute("INSERT INTO books VALUES (101, 'The Hobbit', 1)");
            stmt.execute("UPDATE authors SET book_count = book_count + 1 WHERE id = 1");
            conn.commit();
        } catch (Exception e) {
            conn.rollback();
        }
        
        ResultSet rs = stmt.executeQuery("SELECT name, book_count FROM authors");
        if (rs.next()) {
            System.out.println("Author: " + rs.getString("name") + ", Books: " + rs.getInt("book_count"));
        }
        conn.close();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

void runDenormalization() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE authors (id INT PRIMARY KEY, name TEXT, book_count INT DEFAULT 0);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE books (id INT PRIMARY KEY, title TEXT, author_id INT);", nullptr, nullptr, nullptr);
    
    // Simulate transactional update of denormalized counter
    sqlite3_exec(db, "BEGIN TRANSACTION;", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO authors VALUES (1, 'Rowling', 0);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO books VALUES (101, 'Harry Potter', 1);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "UPDATE authors SET book_count = book_count + 1 WHERE id = 1;", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "COMMIT;", nullptr, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runDenormalization() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT, book_count INTEGER DEFAULT 0)");
        db.run("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author_id INTEGER)");
        
        db.run("INSERT INTO authors VALUES (1, 'Stephen King', 0)");
        
        // Update both tables
        db.run("INSERT INTO books VALUES (101, 'The Shining', 1)");
        db.run("UPDATE authors SET book_count = book_count + 1 WHERE id = 1");
        
        db.get("SELECT name, book_count FROM authors WHERE id = 1", (err, row: any) => {
            if (row) {
                console.log(\`Author: \${row.name}, Denormalized Count: \${row.book_count}\`);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Out-of-Sync Data
Updating the child table (adding/deleting rows) but forgetting to update the denormalized summary or count column in the parent table.
* **Bad:** Adding a book and failing to increment the author's count.
* **Good:** Wrap updates inside database triggers or explicit transactions to guarantee sync.

### 2. Denormalizing Prematurely
Applying denormalization in early stages. Always start fully normalized. Only denormalize when real-world profiling shows query performance is lagging due to deep JOIN operations.

---

## 🔍 Interview Corner

### Q1: What is denormalization, and why is it used?
**Denormalization** is a performance optimization technique where redundant data is deliberately added to a normalized database to reduce expensive table JOINs. It is used in read-heavy applications to speed up data retrieval.

### Q2: What are the main disadvantages of denormalization?
1. **Consistency Risks:** Data must be updated in multiple places; failure leads to mismatch errors.
2. **Slower Writes:** Insert, Update, and Delete operations take longer because multiple tables must be modified.
3. **Extra Storage:** Redundant data copies eat up additional disk space.

---

## 📝 Summary

* **Denormalization** copies or summarizes data in advance to speed up read queries.
* It trades **faster reads** for **slower writes** and potential synchronization bugs.
* Always use transactions or database triggers to keep denormalized tables in sync.
`;
