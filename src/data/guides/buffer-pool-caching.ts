export const content = `
# Buffer Pool & Caching: The Study Desk! 🗄️

## 🗄️ Introduction: The Study Desk vs. The Attic

Imagine you are writing a research paper in a house with a massive library:

* **The Attic (Disk):** You have 10,000 reference books stored in boxes in the attic. To fetch a book, you have to walk up 3 flights of stairs, open the box, and walk back down. This takes you 5 minutes.
* **The Study Desk (RAM / Buffer Pool):** Your desk has space to hold **exactly 5 books**. You fetch 5 books from the attic and lay them on your desk. When you need to read a page, you look at your desk instantly (takes 1 second!).
* **Eviction (LRU):** If your desk is full and you need a 6th book from the attic, you must choose one book currently on your desk and walk it back to the attic to make room.

In databases, the **Buffer Pool** is this study desk! It is a dedicated region of physical memory (RAM) where the database caches active data pages so it doesn't have to perform slow disk reads for every query.

---

## 🏗️ The Buffer Pool Manager

When a query requests Page #99, the database goes through this lookup loop:

\`\`\`
                      Query Requests Page #99
                                 |
                                 v
                     +-----------------------+
                     |    IS PAGE IN RAM?    |
                     +-----------------------+
                     /                       \\
                  YES                         NO (Cache Miss)
                  /                             \\
                 v                               v
         [BUFFER POOL HIT]             [LOAD FROM DISK]
          (Instant Read)                         |
                                       (Is Buffer Pool Full?)
                                       /                     \\
                                    YES                       NO
                                    /                           \\
                                   v                             v
                           [Evict Page (LRU)]            [Put Page in RAM]
\`\`\`

### Key Concepts

* **Clean Page:** A page in the buffer pool that matches the page stored on disk.
* **Dirty Page:** A page that has been updated in RAM but has **not yet** been written (flushed) back to the disk.
* **LRU (Least Recently Used):** The standard algorithm used to evict pages. It removes the page that has not been read for the longest duration to make room for new pages.
* **Flushing:** The background process of writing dirty pages from RAM back to the disk, converting them back to clean pages.

---

## 💻 Code Examples: Simulating LRU Cache Eviction

Let's build a simple LRU cache in different languages to simulate a buffer pool manager.

### Multi-Language Execution

##### Python
\`\`\`python
from collections import OrderedDict

class BufferPoolSim:
    def __init__(self, capacity):
        self.pool = OrderedDict()
        self.capacity = capacity

    def get_page(self, page_id):
        if page_id in self.pool:
            # Hit: Move to end to mark as recently used
            self.pool.move_to_end(page_id)
            return f"RAM_Hit: Page {page_id}"
            
        # Miss: Fetch from simulated disk
        if len(self.pool) >= self.capacity:
            # Evict the oldest item (first item in OrderedDict)
            evicted, _ = self.pool.popitem(last=False)
            print(f"Pool Full! Evicting Page {evicted}")
            
        self.pool[page_id] = f"Disk_Loaded_Data_for_Page_{page_id}"
        return f"Disk_Fetch: Page {page_id}"

pool = BufferPoolSim(3)
print(pool.get_page(1))
print(pool.get_page(2))
print(pool.get_page(3))
print(pool.get_page(4)) # Triggers Eviction of Page 1
\`\`\`

##### Java
\`\`\`java
import java.util.LinkedHashMap;
import java.util.Map;

public class BufferPool<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public BufferPool(int capacity) {
        // true activates access-order sorting (LRU)
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        if (size() > capacity) {
            System.out.println("Java Evicting Page: " + eldest.getKey());
            return true;
        }
        return false;
    }

    public static void main(String[] args) {
        BufferPool<Integer, String> pool = new BufferPool<>(3);
        pool.put(1, "Page 1");
        pool.put(2, "Page 2");
        pool.put(3, "Page 3");
        pool.put(4, "Page 4"); // Evicts Page 1
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <list>
#include <unordered_map>

class BufferPool {
    int capacity;
    std::list<int> lruList; // Holds page keys in access order
    std::unordered_map<int, std::list<int>::iterator> poolMap;
public:
    BufferPool(int cap) : capacity(cap) {}
    
    void accessPage(int pageId) {
        if (poolMap.find(pageId) != poolMap.end()) {
            lruList.erase(poolMap[pageId]);
            lruList.push_back(pageId);
            poolMap[pageId] = --lruList.end();
            std::cout << "Hit Page " << pageId << std::endl;
            return;
        }
        
        if (lruList.size() >= capacity) {
            int oldest = lruList.front();
            lruList.pop_front();
            poolMap.erase(oldest);
            std::cout << "Evicting Page " << oldest << std::endl;
        }
        
        lruList.push_back(pageId);
        poolMap[pageId] = --lruList.end();
        std::cout << "Loaded Page " << pageId << std::endl;
    }
};

int main() {
    BufferPool pool(3);
    pool.accessPage(1);
    pool.accessPage(2);
    pool.accessPage(3);
    pool.accessPage(4); // Evicts Page 1
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
class BufferPoolTS {
    private capacity: number;
    private pool = new Map<number, string>();

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    public getPage(pageId: number): string {
        if (this.pool.has(pageId)) {
            const val = this.pool.get(pageId)!;
            this.pool.delete(pageId); // Refresh position
            this.pool.set(pageId, val);
            return \`Hit: \${pageId}\`;
        }

        if (this.pool.size >= this.capacity) {
            const oldestKey = this.pool.keys().next().value;
            this.pool.delete(oldestKey!);
            console.log(\`TS Evicted Page: \${oldestKey}\`);
        }

        this.pool.set(pageId, \`Data \${pageId}\`);
        return \`Loaded: \${pageId}\`;
    }
}
const pool = new BufferPoolTS(3);
pool.getPage(1);
pool.getPage(2);
pool.getPage(3);
pool.getPage(4); // Evicts Page 1
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Sizing Buffer Pools Incorrectly
Allocating 95% of your server's RAM to the database buffer pool. This leaves no memory for the operating system, which triggers disk-swapping, making the entire system crawl!

### 2. Not Monitoring Cache Hit Ratio
If your **Buffer Pool Hit Ratio** falls below 95%, it means your database is frequently reading from disk. You need to allocate more RAM or optimize your query structures to read fewer pages.

---

## 🔍 Interview Corner

### Q1: What is a "Dirty Page" in the context of a database buffer pool?
A **Dirty Page** is a database page loaded in RAM that has been modified by an \`UPDATE\` or \`INSERT\` query, but has not yet been written back to disk.

### Q2: What is the LRU eviction policy, and why is it used?
**LRU (Least Recently Used)** is an eviction policy that removes the page that hasn't been accessed for the longest duration when the buffer pool is full. It is used because past access is a strong predictor of future access, maximizing cache hit ratios.

---

## 📝 Summary

* The **Buffer Pool** caches database pages in RAM to prevent slow disk reads.
* The database engine uses **LRU** algorithms to evict clean pages to make room.
* **Dirty Pages** must be flushed back to disk to guarantee durability.
`;
