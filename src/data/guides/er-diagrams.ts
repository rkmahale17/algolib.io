export const content = `
# ER Diagrams: The Blueprint of Your Lego Castle! 🏰

## 🏰 Introduction: The Lego Blueprint

Imagine you buy a giant Lego box to build a massive medieval castle. 

If you just dump all 2,000 blocks on the floor and start sticking them together randomly, your castle will fall down!

So, you open the instruction booklet. The booklet has drawings:
1. **The Characters (Entities):** Pictures of the Knight, the Dragon, and the King.
2. **Their Features (Attributes):** The Knight has a Shield and a Sword; the Dragon has Wing Size and Fire Power.
3. **The Snaps (Relationships):** A line showing the Knight *rides* the Dragon.

In database design, this booklet is an **ER Diagram** (Entity-Relationship Diagram)! It is the blueprint we draw on a whiteboard or computer screen before we write any SQL code.

---

## 🎨 Elements of an ER Diagram

An ER Diagram uses simple shapes to model our database structure:

\`\`\`
    [Attribute] (Oval)
         |
         v
    (student_name)
         |
    [Entity] (Rect)  =======>  [Relationship] (Diamond)  =======>  [Entity]
    +------------+                  / \                            +--------------+
    |  STUDENT   |                 /   \  (receives)               | REPORT_CARD  |
    +------------+                 \   /                           +--------------+
                                    \ /
\`\`\`

### 1. Entities (The Nouns)
* Drawn as **Rectangles**.
* An Entity represents a real-world thing or object (like a \`User\`, \`Product\`, or \`Invoice\`).

### 2. Attributes (The Adjectives)
* Drawn as **Ovals**.
* Attributes are the properties of our entities (like \`username\`, \`price\`, or \`date_created\`).
* The **Primary Key** attribute is usually underlined.

### 3. Relationships (The Verbs)
* Drawn as **Diamonds**.
* Relationships show how two entities interact (like User *buys* Product, or Doctor *treats* Patient).

### 4. Cardinality (The Rules)
* Written on the lines connecting shapes (using labels like \`1:1\`, \`1:N\`, or \`N:M\`).
* Modern diagrams often use **Crow's Foot Notation** (using lines, circles, and forks to represent "one", "many", "optional", or "mandatory" relationships).

---

## 💻 Code Examples: From Blueprint to SQL

Let's look at an ER Diagram relationship:
* **Entities:** \`Student\` and \`ReportCard\`
* **Relationship:** Student *receives* ReportCard (1:1 relationship)

Here is how we convert this visual blueprint into code.

### SQL Implementation
\`\`\`sql
-- Students Table (Entity 1)
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY, -- Underlined in ER diagram
    student_name TEXT NOT NULL
);

-- Report Cards Table (Entity 2)
CREATE TABLE report_cards (
    card_id INTEGER PRIMARY KEY,
    grade_gpa REAL NOT NULL,
    student_id INTEGER UNIQUE,      -- UNIQUE ensures 1-to-1 relationship
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_er_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Building tables mapped from our ER Diagram
    cursor.execute("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT)")
    cursor.execute("CREATE TABLE report_cards (id INTEGER PRIMARY KEY, gpa REAL, student_id INTEGER UNIQUE)")
    
    cursor.execute("INSERT INTO students VALUES (1, 'Alice')")
    cursor.execute("INSERT INTO report_cards VALUES (101, 3.8, 1)")
    
    # 1:1 check - trying to give Alice a second report card will fail!
    try:
        cursor.execute("INSERT INTO report_cards VALUES (102, 4.0, 1)")
    except sqlite3.IntegrityError as e:
        print(f"Blocked second card insert: {e}")
        
    conn.close()

run_er_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class ErExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE students (id INT PRIMARY KEY, name TEXT)");
        stmt.execute("CREATE TABLE report_cards (id INT PRIMARY KEY, gpa REAL, student_id INT UNIQUE)");
        
        stmt.execute("INSERT INTO students VALUES (1, 'Bob')");
        stmt.execute("INSERT INTO report_cards VALUES (100, 3.5, 1)");
        
        try {
            stmt.execute("INSERT INTO report_cards VALUES (101, 3.9, 1)"); // Duplicate student_id
        } catch (SQLException e) {
            System.out.println("Blocked: 1:1 relationship violated! " + e.getMessage());
        }
        conn.close();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <sqlite3.h>

void runErExample() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE students (id INT PRIMARY KEY, name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE report_cards (id INT PRIMARY KEY, gpa REAL, student_id INT UNIQUE);", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "INSERT INTO students VALUES (1, 'Charlie');", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO report_cards VALUES (100, 3.2, 1);", nullptr, nullptr, nullptr);
    
    int rc = sqlite3_exec(db, "INSERT INTO report_cards VALUES (101, 3.5, 1);", nullptr, nullptr, nullptr);
    if (rc != SQLITE_OK) {
        std::cout << "Successfully blocked duplicate 1:1 student mapping." << std::endl;
    }
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runErExample() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT)");
        db.run("CREATE TABLE report_cards (id INTEGER PRIMARY KEY, gpa REAL, student_id INTEGER UNIQUE)");
        
        db.run("INSERT INTO students VALUES (1, 'Daisy')");
        db.run("INSERT INTO report_cards VALUES (100, 4.0, 1)");
        
        db.run("INSERT INTO report_cards VALUES (101, 3.7, 1)", (err) => {
            if (err) {
                console.log("TypeScript received error on duplicate 1:1 relation insert:", err.message);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Modeling Actions as Entities
Modeling transient events (like "Checkout Process" or "User Login") as separate primary entity tables. Keep entities focused on persistent business data (like Orders or Logins).

### 2. Multi-Valued Attributes
Putting attributes that can contain multiple values directly inside the entity rectangle without splitting it. For example, a \`phone_numbers\` attribute in \`student\` entity should be represented as a weak child entity connected with a 1:M relationship.

---

## 🔍 Interview Corner

### Q1: What is the difference between a Strong Entity and a Weak Entity?
* A **Strong Entity** can exist independently of other entities in the diagram (e.g. \`Customer\`). It has its own primary key.
* A **Weak Entity** cannot exist without a parent owner entity (e.g. \`Order_Item\` cannot exist without an \`Order\`). Its primary key consists of the parent's foreign key combined with a discriminator.

### Q2: What is Crow's Foot notation?
**Crow's Foot notation** is a graphical standard used in ER Diagrams to show the cardinality of relationships. It uses lines (representing one-to-one), forks (representing many), and circles (representing optionality/zero) at the ends of connection paths.

---

## 📝 Summary

* **ER Diagrams** are the visual blueprints for your database design.
* **Rectangles** represent Entities (nouns).
* **Ovals** represent Attributes (adjectives).
* **Diamonds** represent Relationships (verbs).
`;
