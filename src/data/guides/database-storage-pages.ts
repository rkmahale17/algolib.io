export const content = `
# Database Storage & Pages: The Loose-Leaf Binder! 📑

## 📑 Introduction: The Notebook of Fixed Sheets

Imagine you are keeping a physical logbook of sales, but you are forced to use a **loose-leaf binder** where every page is exactly **8 lines long**:

* **Writing a Record:** A single record takes up 2 lines. You write it on page 1.
* **Running Out of Space:** If you have written 3 records (6 lines) and want to write a 4th record (which needs 3 lines), it won't fit! You cannot write 2 lines on page 1 and 1 line on page 2. You must leave page 1 half-blank and write the entire record on page 2.
* **Looking Up Records:** To read a record, you don't load individual lines. You open the book and read the **entire page** at once.

In databases, **disk storage** works exactly like this binder! Data is not written to disk row-by-row. Instead, the database splits files into fixed-size blocks called **Pages** (typically **8KB** in size, like in PostgreSQL).

---

## 🏗️ The Anatomy of a Database Page

A single database page contains several sections to keep track of its data slots:

\`\`\`
+-------------------------------------------------------------+
| PAGE HEADER (Page metadata, LSN, free space pointers)        |
+-------------------------------------------------------------+
| SLOT DIRECTORY (Pointers directing to row start locations)   |
| [Slot 1 offset]   [Slot 2 offset]                           |
+-------------------------------------------------------------+
|                      < FREE SPACE >                         |
| (Grows downwards as slots are added)                        |
+-------------------------------------------------------------+
|                                                             |
|                              [Tuple 2 Data: Bob, Canada]    |
| [Tuple 1 Data: Alice, UK]                                   |
| (Data tuples grow upwards from the bottom of the page)      |
+-------------------------------------------------------------+
\`\`\`

### 1. Page Header (Metadata)
Holds general info about the page (e.g. page size, transaction details, and offsets to where the free space starts and ends).

### 2. Slot Directory (Line Pointers)
An array of offsets pointing to the exact byte location of each row (tuple) at the bottom of the page.

### 3. Free Space
The empty space in the middle of the page. When you insert a row, the directory offset is written at the top, and the actual row data is written at the bottom. The free space shrinks from both sides!

### 4. Row Data (Tuples)
The actual raw column values stored as bytes.

---

## 💻 Code Examples: Simulating Page Storage

Let's write a simple simulation of a page-buffer allocating slots in memory.

### SQL Engine Details
\`\`\`sql
-- Databases read and write pages, not rows.
-- If a row is 100 bytes, a 8KB page can fit about 80 rows.
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
class SimpleDatabasePage:
    def __init__(self, page_size=8192):
        self.page_size = page_size
        self.header_size = 64
        # Slot directory takes 4 bytes per row pointer
        self.slots = []
        self.data_bytes = bytearray()
        
    def add_row(self, row_data_str):
        row_bytes = row_data_str.encode('utf-8')
        needed_space = len(row_bytes) + 4 # Data size + slot directory pointer
        
        current_free = self.page_size - (self.header_size + len(self.slots)*4 + len(self.data_bytes))
        if needed_space > current_free:
            return False # Page Full! Must allocate a new page.
            
        self.slots.append(len(self.data_bytes))
        self.data_bytes.extend(row_bytes)
        return True

page = SimpleDatabasePage()
print("Insert Row 1:", page.add_row("id=1,name=Alice"))
print("Total slots allocated:", len(page.slots))
\`\`\`

##### Java
\`\`\`java
import java.util.*;

public class PageSimulation {
    private static final int PAGE_SIZE = 8192;
    private int freeSpace = PAGE_SIZE - 64; // Excluding header
    private List<Integer> slots = new ArrayList<>();

    public boolean insertRow(int rowSizeBytes) {
        int spaceNeeded = rowSizeBytes + 4; // Data + Slot pointer
        if (spaceNeeded > freeSpace) {
            return false; // Out of memory on page
        }
        slots.add(PAGE_SIZE - freeSpace);
        freeSpace -= spaceNeeded;
        return true;
    }

    public static void main(String[] args) {
        PageSimulation sim = new PageSimulation();
        System.out.println("Insert 200B row: " + sim.insertRow(200));
        System.out.println("Slots: " + sim.slots.size());
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <vector>

class PageSim {
    int pageSize = 8192;
    int freeSpace = 8192 - 64;
    std::vector<int> slots;
public:
    bool insertRow(int size) {
        int needed = size + 4;
        if (needed > freeSpace) return false;
        slots.push_back(pageSize - freeSpace);
        freeSpace -= needed;
        return true;
    }
    int getSlotCount() { return slots.size(); }
};

int main() {
    PageSim sim;
    std::cout << "Insert 100-byte row: " << std::boolalpha << sim.insertRow(100) << std::endl;
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
class PageSim {
    private pageSize = 8192;
    private freeSpace = 8192 - 64;
    private slots: number[] = [];

    public insertRow(size: number): boolean {
        const needed = size + 4;
        if (needed > this.freeSpace) return false;
        this.slots.push(this.pageSize - this.freeSpace);
        this.freeSpace -= needed;
        return true;
    }
}
const sim = new PageSim();
console.log("TS Page Insert:", sim.insertRow(500));
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Over-sized Rows (Page Overflow)
Creating tables with dozens of large text columns. If a single row exceeds 8KB, it cannot fit on a standard page, forcing the database to split the row across multiple **Overflow Pages** (TOAST pages). This causes double disk reads, slowing queries down!

### 2. Under-estimating Page Fragmentation
Frequently updating rows with longer text. The old row space on the page is marked dead (bloat) and cannot be recovered instantly without running database cleanups (like \`VACUUM\` or \`OPTIMIZE\`).

---

## 🔍 Interview Corner

### Q1: What is a page inside a database storage engine?
A **Page** (or block) is the smallest physical unit of data transfer between the database disk storage and main memory (RAM). Even if a query asks for a single row, the database must read the entire page containing that row from the disk.

### Q2: What happens if a database row size exceeds the page size?
If a row size is too large to fit in a single page (e.g. storing large binary blobs or long blog texts), the database uses **Overflow Pages**. The primary page stores a pointer to a separate list of overflow pages (e.g. TOAST tables in PostgreSQL) where the rest of the column data is saved.

---

## 📝 Summary

* Databases organize disk files into fixed-size blocks called **Pages** (typically **8KB**).
* Pages read and write data in entire blocks to maximize hardware performance.
* Pages consist of a **Header**, **Slot Directory**, **Free Space**, and **Data Tuples**.
`;
