export const content = `
# Primary Keys & Foreign Keys: The Dog Collar & Leash! 🐕

## 🐕 Introduction: Dogs and Owners

Imagine a neighborhood with lots of dogs and owners.

1. **The Dog Collar (Primary Key):** Every dog has a collar with a unique ID code engraved on it (like "DOG-101"). No two dogs can ever have the same collar code. This is the **Primary Key**. It uniquely identifies each dog.
2. **The Owner ID Badge:** Each owner has a unique badge (like "OWNER-50").
3. **The Leash (Foreign Key):** To know which dog belongs to which owner, we attach a tag to the dog's collar that says: *"Belongs to Owner ID: OWNER-50"*. 
   * This owner code on the dog's collar points directly to the Owners table. 
   * In databases, this pointer is called a **Foreign Key**.

With these keys, we can perfectly link dogs to owners without ever mixing them up!

---

## 🔑 Key Concepts and Visual Mapping

\`\`\`
     OWNERS TABLE (Parent)                      DOGS TABLE (Child)
+--------------------------+               +--------------------------+
| owner_id (PK)  [1] <-----+-------------+ | dog_id (PK)              |
| owner_name               |               | dog_name                 |
+--------------------------+               | owner_id (FK)  [1]       |
                                           +--------------------------+
\`\`\`

### Primary Key (PK) vs. Foreign Key (FK)

| Rule | Primary Key (PK) | Foreign Key (FK) |
| :--- | :--- | :--- |
| **Purpose** | Uniquely identifies a row in its own table. | Links a row to another table (usually a PK). |
| **Uniqueness** | Must be 100% unique. No duplicates allowed. | Can contain duplicate values (multiple dogs can belong to the same owner). |
| **Empty Values** | Cannot be empty (\`NULL\` is forbidden). | Can be empty (\`NULL\` allowed if a dog has no owner). |
| **Count** | Only one Primary Key per table. | A table can have multiple Foreign Keys pointing to different tables. |

### Types of Primary Keys:
* **Surrogate Key:** A system-generated number (like an auto-incrementing ID: 1, 2, 3...) that has no real-world meaning but is guaranteed to be unique.
* **Natural Key:** A real-world unique attribute (like a Social Security Number or vehicle VIN).
* **Composite Key:** A primary key made of two or more columns combined (e.g. \`student_id\` + \`course_id\` in a registration table).

---

## 💻 Code Examples

Let's see how we write SQL to define these keys and run query matches.

### SQL Setup
\`\`\`sql
-- Owners Table
CREATE TABLE owners (
    owner_id INTEGER PRIMARY KEY, -- Primary Key
    owner_name TEXT NOT NULL
);

-- Dogs Table
CREATE TABLE dogs (
    dog_id INTEGER PRIMARY KEY, -- Primary Key
    dog_name TEXT NOT NULL,
    owner_id INTEGER,           -- Foreign Key column
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id)
);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_keys_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Enable foreign key support in SQLite (disabled by default!)
    cursor.execute("PRAGMA foreign_keys = ON")
    
    cursor.execute("CREATE TABLE owners (id INTEGER PRIMARY KEY, name TEXT)")
    cursor.execute("""
        CREATE TABLE dogs (
            id INTEGER PRIMARY KEY, 
            name TEXT, 
            owner_id INTEGER,
            FOREIGN KEY(owner_id) REFERENCES owners(id)
        )
    """)
    
    cursor.execute("INSERT INTO owners VALUES (1, 'Alice')")
    cursor.execute("INSERT INTO dogs VALUES (101, 'Rex', 1)")
    
    # Trying to insert a dog with a non-existent owner will fail!
    try:
        cursor.execute("INSERT INTO dogs VALUES (102, 'Fido', 99)")
    except sqlite3.IntegrityError as e:
        print(f"Blocked insert successfully: {e}")
        
    conn.close()

run_keys_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class KeysExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("PRAGMA foreign_keys = ON");
        stmt.execute("CREATE TABLE owners (id INTEGER PRIMARY KEY, name TEXT)");
        stmt.execute("CREATE TABLE dogs (id INTEGER PRIMARY KEY, name TEXT, owner_id INTEGER, FOREIGN KEY(owner_id) REFERENCES owners(id))");
        
        stmt.execute("INSERT INTO owners VALUES (1, 'Bob')");
        stmt.execute("INSERT INTO dogs VALUES (101, 'Sparky', 1)");
        
        try {
            stmt.execute("INSERT INTO dogs VALUES (102, 'Rover', 99)");
        } catch (SQLException e) {
            System.out.println("Java caught foreign key violation: " + e.getMessage());
        }
        conn.close();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

void runKeysExample() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "PRAGMA foreign_keys = ON;", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE owners (id INT PRIMARY KEY, name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE dogs (id INT PRIMARY KEY, name TEXT, owner_id INT, FOREIGN KEY(owner_id) REFERENCES owners(id));", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "INSERT INTO owners VALUES (1, 'Alice');", nullptr, nullptr, nullptr);
    
    // This will fail because owner_id 99 doesn't exist
    int rc = sqlite3_exec(db, "INSERT INTO dogs VALUES (102, 'Fido', 99);", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cout << "Constraint violated: Invalid Foreign Key inserted." << std::endl;
    }
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runKeysExample() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("PRAGMA foreign_keys = ON");
        db.run("CREATE TABLE owners (id INTEGER PRIMARY KEY, name TEXT)");
        db.run("CREATE TABLE dogs (id INTEGER PRIMARY KEY, name TEXT, owner_id INTEGER, FOREIGN KEY(owner_id) REFERENCES owners(id))");
        
        db.run("INSERT INTO owners VALUES (1, 'Charlie')");
        
        // This will trigger an error callback due to the foreign key constraint
        db.run("INSERT INTO dogs VALUES (102, 'Buddy', 99)", (err) => {
            if (err) {
                console.log("TypeScript received error on foreign key check:", err.message);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Orphaned Child Rows
Deleting an owner (parent) but leaving their dogs (children) behind with an ID pointing to nothing.
* **Bad:** Default deletes that leaves dangling pointers.
* **Good:** Use \`ON DELETE CASCADE\` to automatically delete the dogs when their owner is removed:
  \`\`\`sql
  FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
  \`\`\`

### 2. Using Changing Attributes as Primary Keys
Using username or email as a Primary Key. If the user changes their email, you have to update the foreign keys in all other tables, which is slow and prone to errors. Use a stable system ID instead.

---

## 🔍 Interview Corner

### Q1: What is a Composite Primary Key, and when should you use it?
A **Composite Primary Key** is a primary key that consists of two or more columns. It is used when no single column can guarantee uniqueness, but their combination does. A classic example is a \`course_registrations\` table where the primary key is \`(student_id, course_id)\`.

### Q2: What is the difference between a Surrogate Key and a Natural Key?
* A **Natural Key** is a unique attribute that already exists in the real world (like a barcode or Passport Number).
* A **Surrogate Key** is a synthetic, artificial value created by the database engine (like an auto-incrementing integer or UUID) solely to act as the primary key.

---

## 📝 Summary

* A **Primary Key** is a unique barcode tag for a single row.
* A **Foreign Key** is a leash that connects a row to a primary key in another table.
* Enforcing foreign keys prevents broken links inside your database.
`;
