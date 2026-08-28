export const content = `
# Tables, Rows & Columns: The Grade School Sticker Chart! 📊

## 🏫 Introduction: The Teacher's Sticker Chart

Imagine a teacher's sticker chart hanging on the classroom wall to track weekly tasks.

* **The Whole Chart (Table):** The entire cardboard grid labeled "Weekly Homework Chart".
* **The Columns (Fields):** The vertical dividers. One column is labeled "Student Name", another is "Homework Done", and a third is "Reading Minutes".
* **The Rows (Records / Tuples):** The horizontal lines. Each line belongs to one student (e.g., "Alice | Yes | 30 mins").
* **A Single Square (Cell / Value):** The exact box where a row and a column meet. For Alice under "Reading Minutes", it says "30".

In a database, this is exactly how we store information! Tables hold lists of things, columns define the categories of information, and rows hold the actual information for each item.

---

## 🔍 Breaking Down the Parts

\`\`\`
                      COLUMNS (Fields)
             +---------------+-------------+-----------+
             | student_name  | homework_ok | read_mins |
+------------+---------------+-------------+-----------+
| Row 1 (Rec)| Alice         | TRUE        | 30        | <--- ROW (Record / Tuple)
+------------+---------------+-------------+-----------+
| Row 2 (Rec)| Bob           | FALSE       | 15        |
+------------+---------------+-------------+-----------+
             |               |             |
             +-------------> | <-----------+
                         CELL VALUE
\`\`\`

### 1. Table (Relation)
A **Table** is a collection of data organized in a grid. It represents a single type of object or concept (like Users, Products, or Orders). In relational algebra, a table is called a **Relation**.

### 2. Column (Field / Attribute)
A **Column** runs vertically. It represents a single property that all records in the table share. Every column has:
* A **Name** (e.g., \`email\`, \`created_at\`).
* A **Data Type** (e.g., Text, Integer, Float, Boolean, Date) which restricts what can be typed into that slot.
* **Constraints** (e.g. \`NOT NULL\`, \`DEFAULT\`).

### 3. Row (Record / Tuple)
A **Row** runs horizontally. It represents a single, unique instance of an item in the table. If you have 500 products in your store, your \`products\` table will have 500 rows. In formal terms, a row is called a **Record** or a **Tuple**.

---

## 💻 Code Examples

Let's see how to create a sticker chart table and read its structure and contents.

### SQL Setup
\`\`\`sql
-- Define the table and columns with their types
CREATE TABLE homework_chart (
    student_id INTEGER PRIMARY KEY,
    student_name TEXT NOT NULL,
    homework_completed BOOLEAN,
    reading_minutes INTEGER
);

-- Insert rows into the table
INSERT INTO homework_chart (student_name, homework_completed, reading_minutes) 
VALUES ('Alice', 1, 30);

INSERT INTO homework_chart (student_name, homework_completed, reading_minutes) 
VALUES ('Bob', 0, 15);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_tables_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Create the table
    cursor.execute("""
        CREATE TABLE homework_chart (
            id INTEGER PRIMARY KEY,
            name TEXT,
            completed INTEGER,
            minutes INTEGER
        )
    """)
    
    # Insert rows (records)
    cursor.execute("INSERT INTO homework_chart (name, completed, minutes) VALUES ('Alice', 1, 30)")
    conn.commit()
    
    # Query rows and print individual column values
    cursor.execute("SELECT name, completed, minutes FROM homework_chart")
    for row in cursor.fetchall():
        print(f"Student: {row[0]}, Done: {bool(row[1])}, Mins: {row[2]}")
        
    conn.close()

run_tables_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class TablesExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE homework_chart (id INTEGER PRIMARY KEY, name TEXT, completed INT, minutes INT)");
        stmt.execute("INSERT INTO homework_chart (name, completed, minutes) VALUES ('Alice', 1, 30)");
        
        ResultSet rs = stmt.executeQuery("SELECT name, completed, minutes FROM homework_chart");
        while (rs.next()) {
            System.out.println(
                "Student: " + rs.getString("name") + 
                ", Completed: " + rs.getInt("completed") + 
                ", Minutes: " + rs.getInt("minutes")
            );
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
    for (int i = 0; i < argc; ++i) {
        std::cout << azColName[i] << ": " << (argv[i] ? argv[i] : "NULL") << " ";
    }
    std::cout << std::endl;
    return 0;
}

void runTablesExample() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE homework (id INT PRIMARY KEY, name TEXT, mins INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO homework (name, mins) VALUES ('Alice', 30);", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "SELECT * FROM homework;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runTablesExample() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE homework_chart (id INTEGER PRIMARY KEY, name TEXT, mins INTEGER)");
        db.run("INSERT INTO homework_chart (name, mins) VALUES ('Alice', 30)");
        
        db.each("SELECT name, mins FROM homework_chart", (err, row: any) => {
            if (err) console.error(err);
            else console.log(\`Student: \${row.name}, Minutes: \${row.mins}\`);
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Changing Column Types Mid-way
Unlike Javascript or Python, SQL columns are strictly typed. Once you declare a column as an \`INTEGER\`, you shouldn't try to store text inside it. 
* **Bad (SQLite allows it but PostgreSQL fails):** Inserting text "thirty" in an integer column.
* **Good:** Always write numbers: \`30\`.

### 2. Allowing NULLs Everywhere
If you don't mark critical columns \`NOT NULL\`, you will end up with incomplete records (e.g. a student row without a name).
* **Bad:** \`student_name TEXT\`
* **Good:** \`student_name TEXT NOT NULL\`

---

## 🔍 Interview Corner

### Q1: What is the difference between a table, a row, and a column?
* A **Table** is the entire relation structure storing all data on a single object.
* A **Column** represents an attribute or field defining the data type.
* A **Row** is a single record (tuple) representing a unique instance of that object.

### Q2: What are the differences between Char, Varchar, and Text data types?
* **CHAR(N):** Fixed-length text. Always uses $N$ bytes of storage (spaces are padded if the text is shorter).
* **VARCHAR(N):** Variable-length text up to size $N$. Only uses space for characters actually written.
* **TEXT:** Unlimited variable-length text. Best for blog posts or notes.

---

## 📝 Summary

* **Tables** represent the entire database sheets/grids.
* **Columns** are the vertical labels that set the data types and attributes.
* **Rows** are the horizontal records representing a single item.
`;
