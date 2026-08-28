export const content = `
# Ranking Functions: The Medal Ceremony! 🥇

## 🥇 Introduction: The Tied Race

Imagine you are refereeing a school footrace with 4 runners: Alice, Bob, Charlie, and Dave.

Alice crosses the finish line first. She gets **1st place**.
Bob and Charlie cross the line at the exact same millisecond! They tie!
How do you assign the medals?
* **Option A (ROW_NUMBER):** You don't care about ties. You just hand out badges sequentially: Alice is #1, Bob is #2, Charlie is #3, Dave is #4.
* **Option B (RANK):** You give Bob and Charlie both **2nd place**. But because they took up two spots, Dave gets **4th place** (skipping 3rd place!).
* **Option C (DENSE_RANK):** You give Bob and Charlie both **2nd place**. But you don't want to skip numbers, so Dave gets **3rd place** (the rank numbers are dense/consecutive!).

In SQL, these are our three primary **Ranking Functions**! They help us assign ranks to our rows based on ordering.

---

## 🛠️ The Three Ranking Functions

\`\`\`
   Test Score Data                     Ranking Window Functions
+-------------------+      +-------------------+----------+------------+
| name    | score   |      | ROW_NUMBER()      | RANK()   | DENSE_RANK |
+---------+---------+      +-------------------+----------+------------+
| Alice   | 95      | ===> | 1                 | 1        | 1          |
| Bob     | 90      | ===> | 2                 | 2        | 2          |
| Charlie | 90      | ===> | 3                 | 2        | 2          |
| Dave    | 85      | ===> | 4                 | 4        | 3          |
+---------+---------+      +-------------------+----------+------------+
\`\`\`

Here is how the functions rank the runners Alice (10s), Bob (12s), Charlie (12s), and Dave (15s):

| Runner | Time | \`ROW_NUMBER()\` | \`RANK()\` | \`DENSE_RANK()\` |
| :--- | :--- | :--- | :--- | :--- |
| **Alice** | 10s | 1 | 1 | 1 |
| **Bob** | 12s | 2 | 2 | 2 |
| **Charlie**| 12s | 3 | 2 | 2 |
| **Dave** | 15s | 4 | 4 | 3 |

* **\`ROW_NUMBER()\`**: Simply numbers rows sequentially from 1. If two values are identical, it still assigns sequential different integers based on internal table retrieval order.
* **\`RANK()\`**: Leaves gaps after a tie. If two rows tie for rank 2, the next rank assigned is 4.
* **\`DENSE_RANK()\`**: Leaves no gaps. If two rows tie for rank 2, the next rank assigned is 3.

---

## 💻 Code Examples

Let's write a query to rank students based on their test scores.

### SQL Query
\`\`\`sql
SELECT name, score,
    ROW_NUMBER() OVER(ORDER BY score DESC) AS row_num,
    RANK() OVER(ORDER BY score DESC) AS rnk,
    DENSE_RANK() OVER(ORDER BY score DESC) AS dense_rnk
FROM exam_results;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_ranking_example():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE students (name TEXT, score INTEGER)")
    cursor.executemany("INSERT INTO students VALUES (?, ?)", [
        ('Alice', 95), ('Bob', 90), ('Charlie', 90), ('Diana', 85)
    ])
    
    # Calculate different ranks using window functions
    cursor.execute("""
        SELECT name, score,
               RANK() OVER(ORDER BY score DESC),
               DENSE_RANK() OVER(ORDER BY score DESC)
        FROM students
    """)
    for name, score, rnk, dense_rnk in cursor.fetchall():
        print(f"Name: {name}, Score: {score}, Rank: {rnk}, Dense: {dense_rnk}")
        
    conn.close()

run_ranking_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class RankingExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE exam (name TEXT, score INT)");
        stmt.execute("INSERT INTO exam VALUES ('Alice', 90), ('Bob', 90), ('Charlie', 80)");
        
        // Query dense rank
        ResultSet rs = stmt.executeQuery(
            "SELECT name, DENSE_RANK() OVER(ORDER BY score DESC) FROM exam"
        );
        while (rs.next()) {
            System.out.println("Student: " + rs.getString(1) + ", Rank: " + rs.getInt(2));
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
    std::cout << argv[0] << " - Rank: " << argv[1] << std::endl;
    return 0;
}

void runRanking() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE exam (name TEXT, score INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO exam VALUES ('Alice', 90), ('Bob', 90), ('Charlie', 80);", nullptr, nullptr, nullptr);
    
    // Rank query
    const char* sql = "SELECT name, RANK() OVER(ORDER BY score DESC) FROM exam;";
    sqlite3_exec(db, sql, callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runRanking() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE exam (name TEXT, score INTEGER)");
        db.run("INSERT INTO exam VALUES ('Alice', 90), ('Bob', 90), ('Charlie', 80)");
        
        db.all("SELECT name, DENSE_RANK() OVER(ORDER BY score DESC) AS rnk FROM exam", (err, rows: any[]) => {
            rows.forEach(row => console.log("TS Rank:", row.name, row.rnk));
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Forgetting ORDER BY inside OVER()
Writing \`RANK() OVER()\` without specifying an order. The database will treat all rows as equal and assign everyone the rank of 1!
* **Bad:** \`SELECT name, RANK() OVER() FROM exam;\`
* **Good:** \`SELECT name, RANK() OVER(ORDER BY score DESC) FROM exam;\`

### 2. Using ROW_NUMBER as a permanent ID
Using \`ROW_NUMBER()\` to tag records in transactions. If a row is deleted or inserted, the row numbers of all other records will shift, breaking your application mappings!

---

## 🔍 Interview Corner

### Q1: What is the difference between RANK() and DENSE_RANK()?
Both assign the same rank to identical values (ties). However:
* **\`RANK()\`** leaves gaps in ranking numbers after a tie (e.g. if two rows share rank 2, the next row gets rank 4).
* **\`DENSE_RANK()\`** does not leave gaps (e.g. if two rows share rank 2, the next row gets rank 3).

### Q2: What is NTILE(N) and what is it used for?
**\`NTILE(N)\`** is a ranking function that divides the sorted rows in a partition into $N$ roughly equal buckets and returns the bucket number (1 to $N$) for each row. It is commonly used to find percentiles (e.g. \`NTILE(100)\` for percentiles, or \`NTILE(4)\` to split data into quartiles).

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Rank Scores](/problem/sql/rank-scores)
* [Department Top Three Salaries](/problem/sql/department-top-three-salaries)

---

## 📝 Summary

* **\`ROW_NUMBER()\`** numbers rows consecutively from 1 to $N$, ignoring ties.
* **\`RANK()\`** assigns identical ranks to ties, skipping subsequent ranks.
* **\`DENSE_RANK()\`** assigns identical ranks to ties without skipping any numbers.
`;
