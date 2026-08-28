export const content = `
# Triggers: The Laser Alarm System! 🚨

## 🚨 Introduction: The Laser Alarm System

Imagine you own a bank vault containing **rare gold bars**:

To protect the gold, you install a **laser alarm system**:
1. **The Event:** Someone walks through the vault door (INSERT/UPDATE/DELETE action).
2. **The Timing (BEFORE/AFTER):** The system triggers *before* they touch the gold, or *after* they pick it up.
3. **The Alarm Action (The Trigger):** The system automatically sounds a siren, writes down their name in a logbook, or locks the exits.

In databases, a **Trigger** is this exact alarm system! It is a special block of code that **automatically runs** (fires) whenever someone tries to insert, update, or delete rows in a table. It is perfect for auditing edits, enforcing complex rules, or updating totals.

---

## 🏗️ How Triggers Work

Triggers attach directly to tables and intercept write operations:

\`\`\`
        Write Operation (INSERT / UPDATE / DELETE)
                            |
                            v
               +--------------------------+
               |     TRIGGER GATEWAY      |
               | [BEFORE Trigger Executed] |  <--- Check/modify data before saving
               +--------------------------+
                            |
                     (Write Saved)
                            |
                            v
               +--------------------------+
               |  [AFTER Trigger Executed] |  <--- Audit log or cascade side effects
               +--------------------------+
\`\`\`

### Trigger Timing:
* **\`BEFORE\`**: Fires before the write operation is saved to disk. (Used to validate or change values: e.g., forcing email text to lowercase).
* **\`AFTER\`**: Fires after the write operation has successfully completed. (Used to record history or log changes: e.g., copying the deleted row into an \`audit_log\` table).
* **\`INSTEAD OF\`**: Replaces the write operation entirely. (Used to insert data into views).

### Trigger Scope:
* **\`FOR EACH ROW\`**: Runs once for every single row affected by the update query. (If you update 100 rows, the trigger executes 100 times).
* **\`FOR EACH STATEMENT\`**: Runs only once per query execution, regardless of how many rows are changed.

---

## 💻 Code Examples

Let's write a trigger in SQL that automatically records product price edits in a log table.

### SQL Setup
\`\`\`sql
-- Log table to record price changes
CREATE TABLE price_audit (
    product_id INT,
    old_price DECIMAL,
    new_price DECIMAL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger definition in PostgreSQL
CREATE OR REPLACE FUNCTION log_price_change() 
RETURNS TRIGGER AS $$
BEGIN
    -- Only write a log if the price actually changed!
    IF OLD.price <> NEW.price THEN
        INSERT INTO price_audit(product_id, old_price, new_price)
        VALUES (OLD.id, OLD.price, NEW.price);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to the products table
CREATE TRIGGER audit_products_price
AFTER UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION log_price_change();
\`\`\`

### Multi-Language Execution

##### Python (SQLite supports native SQL triggers!)
\`\`\`python
import sqlite3

def run_trigger_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("CREATE TABLE inventory (item TEXT, qty INTEGER)")
    cursor.execute("CREATE TABLE audit_log (msg TEXT)")
    
    # Create a BEFORE INSERT trigger that forces items to uppercase
    cursor.execute("""
        CREATE TRIGGER clean_item_names
        BEFORE INSERT ON inventory
        FOR EACH ROW
        BEGIN
            UPDATE inventory SET item = UPPER(NEW.item);
        END;
    """)
    
    # SQLite triggers can also be written to insert audit logs
    cursor.execute("""
        CREATE TRIGGER log_inventory_inserts
        AFTER INSERT ON inventory
        FOR EACH ROW
        BEGIN
            INSERT INTO audit_log VALUES ('Added item: ' || NEW.item || ' with qty ' || NEW.qty);
        END;
    """)
    
    cursor.execute("INSERT INTO inventory VALUES ('Screws', 50)")
    conn.commit()
    
    # Check log
    cursor.execute("SELECT * FROM audit_log")
    print("Audit Log:", cursor.fetchone()[0])
    
    conn.close()

run_trigger_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class TriggersExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE users (name TEXT)");
        stmt.execute("CREATE TABLE audit (msg TEXT)");
        
        // Attach audit trigger
        String triggerSql = "CREATE TRIGGER log_user AFTER INSERT ON users BEGIN INSERT INTO audit VALUES ('New user Added'); END;";
        stmt.execute(triggerSql);
        
        stmt.execute("INSERT INTO users VALUES ('Alice')");
        
        ResultSet rs = stmt.executeQuery("SELECT * FROM audit");
        if (rs.next()) {
            System.out.println("Java caught trigger write: " + rs.getString(1));
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
    std::cout << "Trigger Audit: " << argv[0] << std::endl;
    return 0;
}

void runTriggers() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE users (name TEXT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "CREATE TABLE logs (msg TEXT);", nullptr, nullptr, nullptr);
    
    // SQLite trigger definition in C++ SQL execution
    sqlite3_exec(db, "CREATE TRIGGER log_user AFTER INSERT ON users BEGIN INSERT INTO logs VALUES ('User added'); END;", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "INSERT INTO users VALUES ('Alice');", nullptr, nullptr, nullptr);
    
    sqlite3_exec(db, "SELECT * FROM logs;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runTriggers() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE users (name TEXT)");
        db.run("CREATE TABLE logs (msg TEXT)");
        
        db.run(\`
            CREATE TRIGGER log_user 
            AFTER INSERT ON users 
            BEGIN 
                INSERT INTO logs VALUES ('User registered'); 
            END;
        \`);
        
        db.run("INSERT INTO users VALUES ('Bob')");
        
        db.all("SELECT * FROM logs", (err, rows: any[]) => {
            rows.forEach(row => console.log("TS Trigger Output:", row.msg));
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Recursive Trigger Loops (The Infinite Loop)
Creating an \`AFTER UPDATE\` trigger on a table that runs an \`UPDATE\` query on the **same table**. This fires the trigger again, which updates the table again, repeating until the database crashes with a stack overflow error!
* **Bad:** Triggers that edit their own table row inside an \`AFTER\` step.
* **Good:** Use \`BEFORE\` triggers to mutate columns, or block self-referential updates.

### 2. Slower Batch Imports
Imports that write millions of rows are slowed down to a crawl by row-level triggers because the trigger code runs millions of times. Always temporarily disable triggers during bulk imports!

---

## 🔍 Interview Corner

### Q1: What is the difference between BEFORE and AFTER triggers?
* **BEFORE triggers** fire before the database records data changes to disk. They are used to validate input or modify row values (e.g. trimming trailing spaces from text).
* **AFTER triggers** fire after database changes are committed. They are used to trigger actions in other tables (e.g. creating audit trails or updating denormalized columns).

### Q2: What are the OLD and NEW keywords inside trigger functions?
* **\`OLD\`**: Represents the original state of the row **before** the write operation (valid in UPDATE and DELETE triggers).
* **\`NEW\`**: Represents the proposed state of the row **after** the write operation (valid in INSERT and UPDATE triggers).

---

## 📝 Summary

* **Triggers** are automated database operations that run in response to inserts, updates, or deletes.
* Use **\`BEFORE\`** triggers to validate or clean values.
* Use **\`AFTER\`** triggers to log changes or cascade edits to other tables.
`;
