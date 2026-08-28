export const content = `
# Sorting & Limiting Results: The High Score Leaderboard! 🏆

## 🏆 Introduction: The Arcade Machine

Imagine you are playing an arcade racing game. When the game ends, it displays the **Top 5 High Scores**:

1. **The Order (ORDER BY):** The scores aren't listed in the order they were achieved. The computer sorts them from **highest to lowest** (Descending order).
2. **The Cutoff (LIMIT):** Even if 1,000,000 games have been played, the screen has only enough room to show **exactly 5 rows**.
3. **The Next Page (OFFSET):** If you click "Next Page", the game skips the top 5 scores (OFFSET 5) and displays ranks 6 to 10.

In SQL, this is exactly how we use **\`ORDER BY\`**, **\`LIMIT\`**, and **\`OFFSET\`**! They clean up our lists and let us paginate through massive sets of rows.

---

## 🛠️ The Syntax and Options

\`\`\`
                     Unsorted Rows
                          |
                          v
               +----------------------+
               |    ORDER BY score    |  <--- Sorts rows (e.g. score DESC)
               +----------------------+
                          |
                     Sorted Rows
                          |
                          v
               +----------------------+
               |    LIMIT 5 OFFSET 5  |  <--- Skips first 5, grabs next 5
               +----------------------+
                          |
                          v
                     Output Rows
\`\`\`

### 1. Sorting: \`ORDER BY\`
Sorts the output rows based on one or more columns.
* **\`ASC\`**: Sorts ascending (A to Z, 1 to 10). This is the default if you omit it.
* **\`DESC\`**: Sorts descending (Z to A, 10 to 1).

### 2. Truncating: \`LIMIT\`
Caps the maximum number of rows returned by the query.

### 3. Paging: \`OFFSET\`
Skips a specific number of rows before it starts returning results.
* *Formula:* To get page $P$ with size $S$, use: \`LIMIT S OFFSET (P - 1) * S\`.

---

## 💻 Code Examples

Let's retrieve the top 3 highest-scoring players from our leaderboard table.

### SQL Query
\`\`\`sql
-- Get the top 3 scores, sorted highest first
SELECT username, score 
FROM leaderboard 
ORDER BY score DESC 
LIMIT 3;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_sorting_limiting():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE scores (username TEXT, score INTEGER)")
    cursor.executemany("INSERT INTO scores VALUES (?, ?)", [
        ('Speedy', 900),
        ('Ninja', 1200),
        ('ProPlayer', 1500),
        ('NoobCoder', 300)
    ])
    
    # Order by score DESC, and show only the top 2
    cursor.execute("SELECT username, score FROM scores ORDER BY score DESC LIMIT 2")
    for name, score in cursor.fetchall():
        print(f"Leaderboard: {name} ({score})")
        
    conn.close()

run_sorting_limiting()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class SortingLimitingExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE scores (username TEXT, score INT)");
        stmt.execute("INSERT INTO scores VALUES ('Alice', 100), ('Bob', 250), ('Charlie', 180)");
        
        // Get the 2nd highest score (Skip 1, limit 1)
        ResultSet rs = stmt.executeQuery("SELECT username, score FROM scores ORDER BY score DESC LIMIT 1 OFFSET 1");
        if (rs.next()) {
            System.out.println("2nd Place: " + rs.getString("username") + " (" + rs.getInt("score") + ")");
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
    std::cout << "Rank: " << argv[0] << " - " << argv[1] << std::endl;
    return 0;
}

void runSorting() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE scores (name TEXT, points INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO scores VALUES ('Dave', 500);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO scores VALUES ('Eve', 700);", nullptr, nullptr, nullptr);
    
    // Sort and limit
    sqlite3_exec(db, "SELECT name, points FROM scores ORDER BY points DESC LIMIT 1;", callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runSorting() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE scores (name TEXT, points INTEGER)");
        db.run("INSERT INTO scores VALUES ('Frank', 450), ('Grace', 600)");
        
        db.all("SELECT name, points FROM scores ORDER BY points DESC LIMIT 1", (err, rows: any[]) => {
            if (rows.length > 0) {
                console.log("TS Winner:", rows[0].name);
            }
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. OFFSET without ORDER BY
Using \`LIMIT 5 OFFSET 5\` without specifying an \`ORDER BY\`. Without sorting, the database order is unpredictable, and you might get duplicate or missing items across pages!
* **Bad:** \`SELECT * FROM users LIMIT 10 OFFSET 10;\` (Unstable result).
* **Good:** \`SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 10;\` (Stable result).

### 2. Slow Offsets (Deep Pagination)
Using a massive \`OFFSET\` (like \`OFFSET 1000000\`). The database still has to read and discard 1,000,000 rows, which makes the query very slow. Use keyset pagination (cursor-based paging) for huge lists!

---

## 🔍 Interview Corner

### Q1: What is the difference between OFFSET pagination and Keysets (Cursor) pagination?
* **OFFSET pagination** works by skipping $N$ rows. It is simple but gets slower as $N$ grows because the database must scan all skipped rows.
* **Keyset pagination** works by filtering on a unique sorted key (e.g. \`WHERE id > last_seen_id LIMIT 10\`). It is extremely fast ($O(\log N)$ with index) and does not degrade at scale.

### Q2: How do you sort by multiple columns?
You can pass multiple columns separated by commas to the \`ORDER BY\` clause. The database sorts by the first column first, and then resolves ties using the second column:
\`\`\`sql
SELECT name, department, score FROM employees ORDER BY department ASC, score DESC;
\`\`\`

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Second Highest Paid Employee](/problem/sql/second-highest-salary)

---

## 📝 Summary

* Use **\`ORDER BY column [ASC/DESC]\`** to sort your data.
* Use **\`LIMIT n\`** to cap the maximum number of rows.
* Use **\`OFFSET n\`** to skip rows, which is essential for list pagination.
`;
