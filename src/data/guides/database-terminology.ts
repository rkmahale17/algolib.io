export const content = `
# Database Terminology: The Yearbook Spreadsheet! 

##  Introduction: The High School Yearbook

Imagine you are in charge of making the High School Yearbook. To keep track of all the students, teachers, and club members, you create a giant spreadsheet document on your computer.

Let's look at how your spreadsheet matches up with standard database terms:

1. **The Spreadsheet Document (The File):** The entire file on your computer containing all sheets. In database terms, this is the **Database**.
2. **A Single Tab/Sheet (e.g., "Students"):** A grid of rows and columns containing only student cards. In database terms, this is a **Table**.
3. **A Vertical Column (e.g., "Favorite Color"):** The category label at the top that tells you what type of info goes in that slot. In database terms, this is a **Column** (or **Field**).
4. **A Horizontal Line (e.g., "Alice, Age 8, Blue"):** A complete set of information about one single student. In database terms, this is a **Row** (or **Record**).
5. **The Sheet's Rules (e.g., "Age must be a number"):** The strict rules that say you can't type a favorite color in the age slot. In database terms, this is the **Schema**.
6. **The Student ID Badge (e.g., "Student #101"):** A unique number that belongs to only one student, making sure we don't mix up two students named "Jack". In database terms, this is the **Primary Key**.

---

## ️ Core Database Terms Explained

Let's examine these terms closely:

### 1. Database
The **Database** is the entire filing cabinet. It is the storage container that holds all your tables, rules, and assistant tools together in one place.

### 2. Table
A **Table** is a collection of related items. For example, in a school database, you would have one table for \`Students\`, another table for \`Teachers\`, and a third table for \`Classrooms\`. Each table holds a list of similar things.

### 3. Column (Field)
A **Column** defines one specific attribute of your items. If a Table is a grid, the Columns are the vertical strips. Every column has:
* A **Name** (like \`email_address\`)
* A **Data Type** (like Text, Number, or Date)

### 4. Row (Record / Tuple)
A **Row** represents a single, complete item in a table. If a table has 100 students, the table has 100 rows. A row contains the specific values for each column (e.g., Row 1: \`Jack, 8, Green\`).

### 5. Schema
The **Schema** (pronounced *Skee-ma*) is the blueprint of the database. It is the architect's drawing that defines what tables exist, what columns they have, and how those tables link together. The database engine uses the schema to block invalid data (like putting letters inside a "Date" column!).

### 6. Primary Key
A **Primary Key** is the most important concept in database design! It is a column (or group of columns) that **MUST be unique** for every single row.
* No two rows in the same table can ever share the same Primary Key.
* Often, we use an auto-incrementing number (1, 2, 3, 4...) or a unique barcode (UUID) as the primary key.
* Once a primary key is set, we can use it to link that row to other tables!

---

##  SQL in Action: Creating a Schema

Here is the SQL query we write to set up our school database. Watch how we define our **Table**, **Columns**, **Data Types**, and **Primary Key**:

\`\`\`sql
-- Define the Schema and Table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY, -- The Primary Key (Unique barcode)
    first_name TEXT NOT NULL,       -- Column for first name (Text only)
    last_name TEXT NOT NULL,        -- Column for last name (Text only)
    age INTEGER,                    -- Column for age (Numbers only)
    favorite_food TEXT              -- Column for food preference
);

-- Insert a Row (Record) into the Table
INSERT INTO students (student_id, first_name, last_name, age, favorite_food)
VALUES (101, 'Alice', 'Smith', 8, 'Pizza');

-- Insert another Row (Record)
INSERT INTO students (student_id, first_name, last_name, age, favorite_food)
VALUES (102, 'Jack', 'Jones', 9, 'Tacos');
\`\`\`

---

##  Complete Code Implementations: Connecting Terminology

Let's see how we run code in multiple languages to build this schema and read columns/rows.

##### Python
\`\`\`python
import sqlite3

def manage_school_database():
    # 1. Database: Establish connection to database file
    conn = sqlite3.connect(":memory:") # Create temporary in-memory database
    cursor = conn.cursor()
    
    # 2. Schema / Table: Create table with columns and Primary Key
    cursor.execute("""
        CREATE TABLE students (
            student_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Primary Key
            name TEXT NOT NULL,                           -- Column (Text)
            score INTEGER                                 -- Column (Number)
        )
    """)
    
    # 3. Row / Record: Insert records
    cursor.execute("INSERT INTO students (name, score) VALUES ('Alice', 100)")
    cursor.execute("INSERT INTO students (name, score) VALUES ('Bob', 95)")
    conn.commit()
    
    # 4. Column / Read: Query specific columns
    cursor.execute("SELECT name, score FROM students")
    rows = cursor.fetchall()
    
    for row in rows:
        # Each row is a tuple: (name, score)
        print(f"Student: {row[0]}, Score: {row[1]}")
        
    conn.close()

manage_school_database()
\`\`\`

##### Java
\`\`\`java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

class SchoolDbManager {
    public void runDatabaseOperations() throws Exception {
        // 1. Database: Connect to in-memory SQLite database
        String url = "jdbc:sqlite::memory:";
        
        try (Connection conn = DriverManager.getConnection(url)) {
            // 2. Table / Schema: Create table using Statement
            try (Statement stmt = conn.createStatement()) {
                String createTableSql = "CREATE TABLE students (" +
                        "student_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                        "name TEXT NOT NULL, " +
                        "score INTEGER)";
                stmt.execute(createTableSql);
            }
            
            // 3. Row / Record: Insert data using PreparedStatement
            String insertSql = "INSERT INTO students (name, score) VALUES (?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(insertSql)) {
                pstmt.setString(1, "Alice");
                pstmt.setInt(2, 100);
                pstmt.executeUpdate();
            }
            
            // 4. Column / Read: Retrieve rows
            String querySql = "SELECT name, score FROM students";
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(querySql)) {
                
                while (rs.next()) {
                    // Extract fields/columns by name
                    String name = rs.getString("name");
                    int score = rs.getInt("score");
                    System.out.println("Student: " + name + ", Score: " + score);
                }
            }
        }
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

using namespace std;

// Callback function to print rows
int printCallback(void* data, int argc, char** argv, char** azColName) {
    // 4. Column / Read: Loop through the fields in the row
    for (int i = 0; i < argc; i++) {
        cout << azColName[i] << ": " << (argv[i] ? argv[i] : "NULL") << " ";
    }
    cout << endl;
    return 0;
}

void manageSchoolDatabase() {
    sqlite3* db;
    char* zErrMsg = nullptr;
    
    // 1. Database: Open in-memory database
    int rc = sqlite3_open(":memory:", &db);
    if (rc) {
        cout << "Can't open database: " << sqlite3_errmsg(db) << endl;
        return;
    }
    
    // 2. Schema / Table: Create table definition
    string createTableSql = "CREATE TABLE students ("
                            "student_id INTEGER PRIMARY KEY AUTOINCREMENT," // Primary Key
                            "name TEXT NOT NULL,"                            // Column
                            "score INTEGER"                                  // Column
                            ");";
    
    sqlite3_exec(db, createTableSql.c_str(), nullptr, nullptr, &zErrMsg);
    
    // 3. Row / Record: Insert rows into table
    string insertSql1 = "INSERT INTO students (name, score) VALUES ('Alice', 100);";
    string insertSql2 = "INSERT INTO students (name, score) VALUES ('Bob', 95);";
    
    sqlite3_exec(db, insertSql1.c_str(), nullptr, nullptr, &zErrMsg);
    sqlite3_exec(db, insertSql2.c_str(), nullptr, nullptr, &zErrMsg);
    
    // 4. Read Rows
    string selectSql = "SELECT name, score FROM students;";
    sqlite3_exec(db, selectSql.c_str(), printCallback, nullptr, &zErrMsg);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function manageSchoolDatabase() {
    // 1. Database: Open database in memory
    const db = new Database(':memory:');
    
    db.serialize(() => {
        // 2. Table / Schema: Create database structure
        db.run(\`
            CREATE TABLE students (
                student_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                score INTEGER
            )
        \`);
        
        // 3. Row / Record: Add records to the table
        const insertStmt = db.prepare("INSERT INTO students (name, score) VALUES (?, ?)");
        insertStmt.run("Alice", 100);
        insertStmt.run("Bob", 95);
        insertStmt.finalize();
        
        // 4. Column / Read: Query the columns
        db.each("SELECT name, score FROM students", (err, row: any) => {
            if (err) {
                console.error(err);
            } else {
                console.log(\`Student: \${row.name}, Score: \${row.score}\`);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

##  Common Mistakes

1. **Forgetting a Primary Key:** Never build a table without a Primary Key! Without it, you cannot reliably update or delete a single row if two students happen to have the exact same name.
2. **Confusing Rows and Columns:** Remember: **C**olumns go up and down (define *what* type of data we store, like "Age"). **R**ows go left to right (represent a *single student's card*, like "Jack, Age 9").
3. **Invalid Data Type Entry:** Don't write letters inside a number column (like putting "nine" instead of \`9\` in age). The database schema will complain and reject it!

---

##  Summary
* **Database:** The entire digital storage unit.
* **Table:** The specific grid category list (like "Students").
* **Column:** The vertical category label and type rules.
* **Row / Record:** One horizontal line representing a single item.
* **Schema:** The overall rulebook/blueprint.
* **Primary Key:** The unique barcode badge stamped on each row.
`;
