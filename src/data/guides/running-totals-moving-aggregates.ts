export const content = `
# Running Totals & Moving Aggregates: The Piggy Bank Tracker! 🐖

## 🐖 Introduction: Saving Up Day by Day

Imagine you have a piggy bank, and you add money to it every day:
* **Monday:** You add **$5**.
* **Tuesday:** You add **$10**.
* **Wednesday:** You add **$3**.

To track your money, you write down two things:
1. **The Daily Deposit:** $5, $10, $3.
2. **The Running Total:** Monday: $5. Tuesday: $15 ($5 + $10). Wednesday: $18 ($15 + $3). This cumulative number is the **Running Total**.
3. **The 3-Day Trend (Moving Average):** To see how well you saved this week, you calculate the average savings of the *current day plus the past two days*.

In SQL, we can calculate these running sums and moving averages dynamically using window frame specifications!

---

## 🛠️ The Window Frame Syntax

To build a running total or moving average, we sort our rows (usually by date) and define a **Frame** of rows to calculate over:

\`\`\`
    RUNNING TOTAL (UNBOUNDED PRECEDING TO CURRENT ROW)
    +-----------------------------------------------+
    | Row 1: Mon ($5)  <--- Start here              |
    | Row 2: Tue ($10)                              |
    | Row 3: Wed ($3)  <--- Stop here (Current Row) | ===> SUM = $18
    +-----------------------------------------------+
    
    MOVING AVERAGE (2 PRECEDING TO CURRENT ROW)
    +-----------------------------------------------+
    | Row 1: Mon ($5)  [Excluded from 3-day frame]  |
    +-----------------------------------------------+
    | Row 2: Tue ($10) <--- Start here (2 Preceding)|
    | Row 3: Wed ($3)                               |
    | Row 4: Thu ($8)  <--- Stop here (Current Row) | ===> AVG = ($10+$3+$8)/3
    +-----------------------------------------------+
\`\`\`

\`\`\`sql
SUM(amount) OVER(
    ORDER BY transaction_date 
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
) AS running_total
\`\`\`

### Frame Boundary Keywords:
* **\`UNBOUNDED PRECEDING\`**: Start from the very first row in the table.
* **\`CURRENT ROW\`**: Stop calculating at the row we are currently looking at.
* **\`n PRECEDING\`**: Look back $n$ rows before the current row (e.g. \`2 PRECEDING\` for a 3-day window).
* **\`n FOLLOWING\`**: Look forward $n$ rows after the current row.

---

## 💻 Code Examples

Let's calculate running sales totals and a 3-day moving average.

### SQL Queries
\`\`\`sql
-- 1. Running Total
SELECT date, sales,
    SUM(sales) OVER(ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM daily_sales;

-- 2. 3-Day Moving Average
SELECT date, sales,
    AVG(sales) OVER(ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg
FROM daily_sales;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_running_totals():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE deposits (day TEXT, amount REAL)")
    cursor.executemany("INSERT INTO deposits VALUES (?, ?)", [
        ('Mon', 5.0), ('Tue', 10.0), ('Wed', 3.0)
    ])
    
    # Running total query
    cursor.execute("""
        SELECT day, amount,
               SUM(amount) OVER (ORDER BY rowid ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
        FROM deposits
    """)
    for day, amt, total in cursor.fetchall():
        print(f"{day}: Added \${amt:.2f}, Running Total: \${total:.2f}")
        
    conn.close()

run_running_totals()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class RunningTotalsExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE deposits (day TEXT, amount REAL)");
        stmt.execute("INSERT INTO deposits VALUES ('Mon', 5.0), ('Tue', 10.0), ('Wed', 3.0)");
        
        // Cumulative sum in Java
        String sql = "SELECT day, SUM(amount) OVER(ORDER BY rowid) FROM deposits";
        ResultSet rs = stmt.executeQuery(sql);
        while (rs.next()) {
            System.out.println("Day: " + rs.getString(1) + ", Running: " + rs.getDouble(2));
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
    std::cout << argv[0] << " - Deposit: " << argv[1] << ", Cumulative: " << argv[2] << std::endl;
    return 0;
}

void runRunningTotals() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE deposits (day TEXT, amt REAL);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO deposits VALUES ('Mon', 5.0), ('Tue', 10.0), ('Wed', 3.0);", nullptr, nullptr, nullptr);
    
    const char* sql = "SELECT day, amt, SUM(amt) OVER(ORDER BY rowid) FROM deposits;";
    sqlite3_exec(db, sql, callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runRunningTotals() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE deposits (day TEXT, amt REAL)");
        db.run("INSERT INTO deposits VALUES ('Mon', 5.0), ('Tue', 10.0)");
        
        db.all("SELECT day, amt, SUM(amt) OVER(ORDER BY rowid) AS running FROM deposits", (err, rows: any[]) => {
            rows.forEach(row => console.log("TS Running:", row.day, row.amt, row.running));
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Forgetting ORDER BY in running sums
If you write \`SUM(val) OVER (PARTITION BY group)\` without \`ORDER BY\`, SQL will add up the *entire partition* and print the same total for every row, instead of a cumulative sum.
* **Bad:** \`SELECT day, SUM(amt) OVER() FROM deposits;\`
* **Good:** \`SELECT day, SUM(amt) OVER(ORDER BY day) FROM deposits;\`

### 2. Confusing ROWS vs. RANGE
\`ROWS\` counts physical rows (like 2 preceding). \`RANGE\` looks at value differences (like date ranges), which can be much slower if not indexed.

---

## 🔍 Interview Corner

### Q1: What is the default window frame if ORDER BY is specified but the frame clause is omitted?
If an \`ORDER BY\` is specified but the frame boundary clause is omitted, the default frame is **\`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`**. This can lead to unexpected duplicate sum values if the ordered column has duplicate values!

### Q2: How do you calculate a YTD (Year-To-Date) sum using window functions?
You can partition by the calendar year, and then order by the date:
\`\`\`sql
SELECT transaction_date, amount,
       SUM(amount) OVER(PARTITION BY EXTRACT(YEAR FROM transaction_date) ORDER BY transaction_date) AS ytd_sum
FROM transactions;
\`\`\`

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Game Play Analysis IV](/problem/sql/game-play-analysis-iv)

---

## 📝 Summary

* A **Running Total** keeps adding values cumulatively from row to row.
* A **Moving Average** averages values over a sliding window frame (like the last 3 days).
* Use the **\`ROWS BETWEEN ... AND ...\`** clause to control the boundary frame.
`;
