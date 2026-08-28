export const content = `
# Database Partitioning: The Filing Cabinet Drawers! 🗄️

## 🗄️ Introduction: The Oversized Drawer

Imagine you have a single physical filing cabinet drawer where you keep **every invoice** your business has ever sent over the last 10 years:

* **The Problem:** The drawer is bulging. To find an invoice from **March 2025**, you have to pull open the heavy drawer and search through 50,000 files.
* **The Solution:** You buy a cabinet with **12 drawers**, one for each month. 
  * You file all January invoices in Drawer 1, February in Drawer 2, and so on.
  * When searching for the March 2025 invoice, you go straight to **Drawer 3**. You don't even touch or look at the other 11 drawers!

In databases, this is **Partitioning**! It is the process of splitting one giant logical table into smaller, more manageable physical sub-tables (partitions) on the same disk server.

---

## 🏗️ Horizontal vs. Vertical Partitioning

There are two primary ways to slice a giant table:

### 1. Horizontal Partitioning (Shredding Rows)
Splitting a table by **Rows**. This is what most people mean by partitioning.
* *Example:* Splitting a \`sales\` table into \`sales_2024\`, \`sales_2025\`, and \`sales_2026\` based on the date.

\`\`\`
       UNPARTITIONED TABLE                          PARTITIONED TABLE
+-----+------------+--------+              +---------------------------------+
| ID  | Date       | Amount |              | PARTITION MASTER (Sales)        |
+-----+------------+--------+              +---------------------------------+
| 1   | 2024-05-12 | $50    |                     /         |         \\
| 2   | 2025-02-20 | $120   |                    v          v          v
| 3   | 2026-01-10 | $80    |             [Sales_2024] [Sales_2025] [Sales_2026]
+-----+------------+--------+             | ID: 1      | ID: 2      | ID: 3      |
                                          +------------+------------+------------+
\`\`\`

### 2. Vertical Partitioning (Shredding Columns)
Splitting a table by **Columns**.
* *Example:* Splitting a \`users\` table with large binary images into:
  1. \`users_core\` (ID, Name, Email) - Small size, fast to search.
  2. \`users_blobs\` (ID, Profile_Picture_Raw) - Large size, rarely queried.

### Partition Pruning (The Speed Secret)
When you query a partitioned table:
\`\`\`sql
SELECT * FROM sales WHERE sale_date >= '2025-01-01' AND sale_date <= '2025-12-31';
\`\`\`
The database engine automatically ignores the \`sales_2024\` and \`sales_2026\` partitions. It reads data **only** from the \`sales_2025\` partition. This bypass is called **Partition Pruning**!

---

## 💻 Code Examples

Let's see how we define partitioned tables in SQL and simulate range partitions in code.

### SQL Setup (PostgreSQL Range Partitioning)
\`\`\`sql
-- Create parent table
CREATE TABLE sales (
    id INT,
    amount DECIMAL,
    sale_date DATE
) PARTITION BY RANGE (sale_date);

-- Create individual partitions
CREATE TABLE sales_y2025 PARTITION OF sales
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE sales_y2026 PARTITION OF sales
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
class PartitionedTableSim:
    def __init__(self):
        # Simulated partitions based on range key (Year)
        self.partitions = {
            2024: [],
            2025: [],
            2026: []
        }

    def insert_sale(self, id, amount, date_year):
        if date_year in self.partitions:
            self.partitions[date_year].append({"id": id, "amount": amount})
            print(f"Saved to partition_{date_year}")
        else:
            raise ValueError("No matching partition found!")

    def query_sales(self, target_year):
        # Partition Pruning: We only check the specific array!
        print(f"Pruning active. Reading partition_{target_year} only:")
        return self.partitions[target_year]

db = PartitionedTableSim()
db.insert_sale(1, 100, 2025)
db.insert_sale(2, 250, 2026)

print(db.query_sales(2025))
\`\`\`

##### Java
\`\`\`java
import java.util.*;

public class PartitionDemo {
    private final Map<Integer, List<String>> partitions = new HashMap<>();

    public PartitionDemo() {
        partitions.put(2024, new ArrayList<>());
        partitions.put(2025, new ArrayList<>());
    }

    public void insert(int year, String record) {
        if (partitions.containsKey(year)) {
            partitions.get(year).add(record);
        }
    }

    public List<String> query(int year) {
        // Prune other years
        return partitions.getOrDefault(year, Collections.emptyList());
    }

    public static void main(String[] args) {
        PartitionDemo demo = new PartitionDemo();
        demo.insert(2025, "Sale #1: $50");
        System.out.println("Java Query Result: " + demo.query(2025));
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <unordered_map>
#include <vector>

class PartitionTable {
    std::unordered_map<int, std::vector<std::string>> partitions;
public:
    void insert(int year, const std::string& val) {
        partitions[year].push_back(val);
    }
    
    std::vector<std::string> query(int year) {
        // Prune other branches
        return partitions[year];
    }
};

int main() {
    PartitionTable table;
    table.insert(2025, "Invoice A - $20");
    std::cout << "C++ Partition Size: " << table.query(2025).size() << std::endl;
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
class PartitionedTableTS {
    private partitions = new Map<number, string[]>();

    constructor() {
        this.partitions.set(2024, []);
        this.partitions.set(2025, []);
    }

    public insert(year: number, val: string) {
        if (this.partitions.has(year)) {
            this.partitions.get(year)!.push(val);
        }
    }

    public query(year: number): string[] {
        // Prune unneeded keys
        return this.partitions.get(year) || [];
    }
}
const p = new PartitionedTableTS();
p.insert(2025, "Invoice B");
console.log("TS Partition Fetch:", p.query(2025));
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Choosing the Wrong Partition Key
Partitioning on a column that is rarely filtered in your query \`WHERE\` clauses (e.g. partitioning by \`user_id\` but running queries like \`WHERE country = 'USA'\`). The database cannot prune partitions and has to search *every single partition* anyway, making the query slower than a standard table query!

### 2. Over-partitioning
Splitting your table into thousands of daily partitions. This forces the database to maintain thousands of active file descriptors, depleting memory and slowing down general connection queries.

---

## 🔍 Interview Corner

### Q1: What is "Partition Pruning"?
**Partition Pruning** is a performance optimization technique where the database query optimizer analyzes the \`WHERE\` clause conditions and ignores any physical partitions that do not contain matching data, reducing disk I/O.

### Q2: What is the difference between Horizontal and Vertical Partitioning?
* **Horizontal Partitioning** splits a table's **rows** across multiple sub-tables (e.g. grouping by year).
* **Vertical Partitioning** splits a table's **columns** across multiple sub-tables (e.g. separating frequently queried text columns from heavy binary image columns).

---

## 📝 Summary

* **Partitioning** splits a giant table into smaller sub-tables on the same server.
* **Horizontal** partitioning splits rows; **Vertical** partitioning splits columns.
* **Partition Pruning** speeds up queries by reading only matching partitions.
`;
