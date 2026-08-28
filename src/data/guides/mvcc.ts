export const content = `
# MVCC (Multi-Version Concurrency Control): The Camera Snapshot! 📸

## 📸 Introduction: The Google Doc History

Imagine you are editing a school essay in a shared document:

* **Lock-Based System:** When you want to edit a sentence, the document locks up. All other classmates are blocked from reading the document until you hit save. Everyone stands around waiting.
* **MVCC System (Version Control):** When you edit a sentence, the system leaves the old version untouched for readers. While you are typing the new version, your classmates keep reading the **original snapshot** of the document. The moment you submit your edit, the system switches new readers to view the updated version, keeping the old history on disk.

In databases, **MVCC (Multi-Version Concurrency Control)** is this exact system! Instead of locking rows and making readers wait for writers, the database creates a new copy (version) of a row every time it is updated.

This means **readers never block writers, and writers never block readers!**

---

## ⚙️ How MVCC Works Under the Hood

When you update a row in an MVCC database (like PostgreSQL), the engine doesn't overwrite the data on disk. It inserts a new row version alongside the old one.

Every row has hidden metadata columns to track validity:
* **\`xmin\`**: The Transaction ID that created the row.
* **\`xmax\`**: The Transaction ID that deleted or replaced the row.

\`\`\`
                  ROW VERSIONS ON DISK (Update Alice's location)
+---------+--------------------+-----------------------+------------+------------+
| Version | Username           | Location              | xmin (Min) | xmax (Max) |
+---------+--------------------+-----------------------+------------+------------+
| V1 (Old)| Alice              | New York              | Tx #100    | Tx #101    | <--- Invisible to Tx #102
| V2 (New)| Alice              | San Francisco         | Tx #101    | Null       | <--- Visible to Tx #102
+---------+--------------------+-----------------------+------------+------------+
\`\`\`

### The Life Cycle of an MVCC Update
1. Transaction #101 updates Alice's location from "New York" to "San Francisco".
2. The database writes a new row version (V2) with \`xmin = 101\`.
3. The old row (V1) is marked as deleted/replaced by setting \`xmax = 101\`.
4. Any active transactions older than #101 will continue reading V1. New transactions will read V2.
5. **Garbage Collection (Vacuum):** Once all old transactions finish, the database cleans up the old V1 row to free space (this is called \`VACUUM\` in PostgreSQL).

---

## 💻 Code Examples: Simulating Version Visibility

Let's write a python/code script to simulate how MVCC checks row visibility using Transaction IDs.

### Multi-Language Execution

##### Python
\`\`\`python
class RowVersion:
    def __init__(self, value, xmin, xmax=None):
        self.value = value
        self.xmin = xmin
        self.xmax = xmax

def get_visible_version(versions, reader_tx_id):
    # Returns the value that this specific reader transaction is allowed to see
    for v in versions:
        # Reader can see if transaction was created before reader started,
        # AND it was not yet deleted when reader started
        created_ok = v.xmin <= reader_tx_id
        not_deleted = v.xmax is None or v.xmax > reader_tx_id
        
        if created_ok and not_deleted:
            return v.value
    return None

# Seed versions for 'Alice'
# V1 created by Tx 100, replaced by Tx 105
# V2 created by Tx 105, still active
alice_history = [
    RowVersion("New York", xmin=100, xmax=105),
    RowVersion("San Francisco", xmin=105, xmax=None)
]

print("Tx 102 reads location:", get_visible_version(alice_history, reader_tx_id=102)) # New York
print("Tx 108 reads location:", get_visible_version(alice_history, reader_tx_id=108)) # San Francisco
\`\`\`

##### Java
\`\`\`java
import java.util.*;

class RowVersion {
    String value;
    int xmin;
    Integer xmax;

    RowVersion(String v, int min, Integer max) {
        this.value = v;
        this.xmin = min;
        this.xmax = max;
    }
}

public class MvccDemo {
    public static void main(String[] args) {
        List<RowVersion> history = Arrays.asList(
            new RowVersion("New York", 100, 105),
            new RowVersion("San Francisco", 105, null)
        );

        int readerTx = 102;
        for (RowVersion v : history) {
            boolean created = v.xmin <= readerTx;
            boolean active = v.xmax == null || v.xmax > readerTx;
            if (created && active) {
                System.out.println("Java MVCC Read: " + v.value);
            }
        }
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <vector>

struct RowVersion {
    std::string value;
    int xmin;
    int xmax; // Use -1 for NULL
};

void runMvcc() {
    std::vector<RowVersion> history = {
        {"New York", 100, 105},
        {"San Francisco", 105, -1}
    };
    
    int readerTx = 108;
    for (const auto& v : history) {
        bool created = v.xmin <= readerTx;
        bool active = (v.xmax == -1) || (v.xmax > readerTx);
        if (created && active) {
            std::cout << "C++ MVCC Read: " << v.value << std::endl;
        }
    }
}

int main() {
    runMvcc();
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
interface RowVersion {
    value: string;
    xmin: number;
    xmax: number | null;
}

function runMvcc() {
    const history: RowVersion[] = [
        { value: "New York", xmin: 100, xmax: 105 },
        { value: "San Francisco", xmin: 105, xmax: null }
    ];

    const readerTx = 102;
    const match = history.find(v => {
        const created = v.xmin <= readerTx;
        const active = v.xmax === null || v.xmax > readerTx;
        return created && active;
    });

    console.log("TS MVCC Read:", match?.value);
}
runMvcc();
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Forgetting Vacuum (Bloat accumulation)
In MVCC databases, deletes don't free disk space immediately—they just mark rows dead. If you don't run regular database cleanup (auto-vacuuming), your tables will double in size due to dead row versions ("bloat"), slowing down sequential scans.

### 2. High Transaction ID Wrap-around
Transaction IDs are limited numbers (usually 32-bit integers). If your database runs billions of transactions, the ID counter wraps back to 0. If not managed, the database will freeze to prevent old data from suddenly becoming invisible!

---

## 🔍 Interview Corner

### Q1: What is the main advantage of MVCC over lock-based concurrency control?
In a lock-based system, reading data blocks writing data, and writing data blocks reading data. In **MVCC**, readers do not block writers, and writers do not block readers, enabling high-performance concurrency.

### Q2: What is "bloat" in MVCC databases, and how is it resolved?
**Bloat** refers to the accumulated disk space occupied by deleted or old, replaced row versions that are no longer visible to any active transactions. It is resolved by running a background vacuum cleaner process (Garbage Collection / \`VACUUM\`) to reclaim page space.

---

## 📝 Summary

* **MVCC** enables concurrency by keeping multiple versions of updated rows.
* Readers read isolated consistent **snapshots** without acquiring locks.
* Old versions are cleaned up later by database garbage collection (\`VACUUM\`).
`;
