export const content = `
# Window Functions: The Classroom Window View! 🪟

## 🪟 Introduction: The Sliding Window Frame

Imagine you are sitting in a classroom looking out a window at a **parade of students** walking by in a single line.

* **Normal Aggregates (GROUP BY):** You gather all students, put them in a blender, and output their average height. The individual students are gone—you only have one summary number.
* **Window Functions (OVER):** You keep all individual students standing in line, but as each student passes the window, you look at them and **compare them** to the students immediately in front of or behind them. 

In SQL, a **Window Function** performs calculations across a set of rows related to the current row, but **without collapsing the rows**! You get to keep all your detailed rows while calculating running math on the side.

---

## 🛠️ The Window Function Syntax

A window function is identified by the **\`OVER\`** keyword:

\`\`\`
        DETAIL ROWS                             WINDOW FRAME CALCULATION
   +-----------------------+
   | name  | dept  | sales |
   +-------+-------+-------+
   | Alice | Sales | 5,000 | ------> OVER (PARTITION BY dept) ====> Sales Avg: $4,000
   | Bob   | Sales | 3,000 | ------> OVER (PARTITION BY dept) ====> Sales Avg: $4,000
   | Chem  | Mktg  | 2,000 | ------> OVER (PARTITION BY dept) ====> Mktg Avg:  $2,000
   +-----------------------+
   (Rows remain un-collapsed, but department average is calculated for each row!)
\`\`\`

\`\`\`sql
SELECT employee_name, department, salary,
    AVG(salary) OVER(PARTITION BY department) AS dept_avg_salary
FROM employees;
\`\`\`

* **\`PARTITION BY\`**: Splits the rows into groups or "windows" (like grouping by department).
* **\`ORDER BY\`**: Sorts the rows inside each window frame (essential for running aggregates).
* **\`OVER()\`**: Tells SQL to run this as a window function rather than a standard group aggregation.

### Window Frames (Moving Boundaries)
You can define exact row boundaries using the \`ROWS\` or \`RANGE\` clauses:
* \`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\`: Computes over the current row and the two rows before it.
* \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`: Standard running total frame.

---

## 💻 Code Examples

Let's compute the average salary of departments alongside individual employee rows.

### SQL Query
\`\`\`sql
SELECT name, department, salary,
    AVG(salary) OVER(PARTITION BY department) AS dept_average
FROM employees;
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import sqlite3

def run_window_example():
    # Note: Window functions require SQLite 3.25.0 or newer
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE staff (name TEXT, dept TEXT, sales REAL)")
    cursor.executemany("INSERT INTO staff VALUES (?, ?, ?)", [
        ('Alice', 'Sales', 5000),
        ('Bob', 'Sales', 3000),
        ('Charlie', 'Marketing', 4000)
    ])
    
    # Calculate average department sales alongside each staff member
    cursor.execute("""
        SELECT name, dept, sales,
               AVG(sales) OVER(PARTITION BY dept) 
        FROM staff
    """)
    for name, dept, sales, avg_sales in cursor.fetchall():
        print(f"{name} ({dept}) Sales: {sales}, Dept Avg: {avg_sales}")
        
    conn.close()

run_window_example()
\`\`\`

##### Java
\`\`\`java
import java.sql.*;

public class WindowExample {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite::memory:");
        Statement stmt = conn.createStatement();
        
        stmt.execute("CREATE TABLE employees (name TEXT, salary INT)");
        stmt.execute("INSERT INTO employees VALUES ('Alice', 5000), ('Bob', 6000)");
        
        // Window sum calculation
        String sql = "SELECT name, SUM(salary) OVER() FROM employees";
        ResultSet rs = stmt.executeQuery(sql);
        while (rs.next()) {
            System.out.println("Name: " + rs.getString(1) + ", Total Company Payroll: " + rs.getInt(2));
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
    std::cout << argv[0] << " - Salary: " << argv[1] << ", Total: " << argv[2] << std::endl;
    return 0;
}

void runWindow() {
    sqlite3* db;
    sqlite3_open(":memory:", &db);
    
    sqlite3_exec(db, "CREATE TABLE staff (name TEXT, salary INT);", nullptr, nullptr, nullptr);
    sqlite3_exec(db, "INSERT INTO staff VALUES ('Alice', 5000), ('Bob', 6000);", nullptr, nullptr, nullptr);
    
    // Window function
    const char* sql = "SELECT name, salary, SUM(salary) OVER() FROM staff;";
    sqlite3_exec(db, sql, callback, nullptr, nullptr);
    
    sqlite3_close(db);
}
\`\`\`

##### TypeScript
\`\`\`typescript
import { Database } from 'sqlite3';

function runWindow() {
    const db = new Database(':memory:');
    
    db.serialize(() => {
        db.run("CREATE TABLE staff (name TEXT, salary INTEGER)");
        db.run("INSERT INTO staff VALUES ('Alice', 5000), ('Bob', 6000)");
        
        db.all("SELECT name, salary, SUM(salary) OVER() AS total FROM staff", (err, rows: any[]) => {
            rows.forEach(row => {
                console.log("TS Window row:", row.name, row.salary, row.total);
            });
        });
    });
    
    db.close();
}
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Trying to use Window Results in WHERE
Writing \`SELECT name FROM employees WHERE AVG(salary) OVER() > 5000\`. The database engine executes \`WHERE\` filters **before** window functions run. To filter based on window outputs, you must wrap the query inside a CTE or subquery!
* **Bad:** \`SELECT name, RANK() OVER(...) AS rnk FROM users WHERE rnk = 1;\`
* **Good:** \`WITH c AS (SELECT name, RANK() OVER(...) AS rnk FROM users) SELECT name FROM c WHERE rnk = 1;\`

### 2. Confusing GROUP BY vs. PARTITION BY
Remember: \`GROUP BY\` collapses your rows into a single summary row. \`PARTITION BY\` does not collapse any rows.

---

## 🔍 Interview Corner

### Q1: What is the main difference between GROUP BY and Window Functions?
* **\`GROUP BY\`** collapses individual rows into a single aggregated row for each unique group key. You lose access to individual row detail.
* **\`Window Functions\`** perform calculations across a group of rows (partition) but **keep individual rows uncollapsed**, allowing you to see detail fields alongside the aggregate values.

### Q2: What is the difference between ROWS and RANGE inside a window frame?
* **\`ROWS\`** specifies the frame boundary by counting a physical number of rows before or after the current row (e.g. \`1 PRECEDING\`).
* **\`RANGE\`** specifies the boundary by comparing values relative to the current row value (e.g. all rows with a date value within 7 days of the current row's date).

---

## 📝 Practice Links

Explore related coding challenges on the platform:
* [Nth Highest Salary](/problem/sql/nth-highest-salary)
* [Department Top Three Salaries](/problem/sql/department-top-three-salaries)
* [Consecutive Numbers](/problem/sql/consecutive-numbers)

---

## 📝 Summary

* **Window Functions** compute running or grouped calculations without collapsing detail rows.
* They are identified by the **\`OVER()\`** keyword.
* Use **\`PARTITION BY\`** to define the subgroup boundaries for calculations.
`;
