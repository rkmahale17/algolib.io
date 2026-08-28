export const content = `
# Concurrency & Locking: The Shared Notebook! 📓

## 📓 Introduction: The Classroom Journal

Imagine a single physical notebook sitting on a desk in a classroom:

* **Reading (Shared Lock / S-Lock):** Multiple students can walk up and read the open page at the same time. If 5 students are reading, there is no conflict. This is a **Shared Lock**.
* **Writing (Exclusive Lock / X-Lock):** If a student wants to write or correct a paragraph on the page, they must grab the notebook. While they are writing, no one else can read or write in it. They have exclusive control. This is an **Exclusive Lock**.

In databases, **Locking** is the mechanism used to manage concurrency. It ensures that when multiple queries try to read and write to the same rows at the identical millisecond, they don't corrupt the data!

---

## 🔒 Lock Compatibility & Granularity

Database locks have rules about who can access data at the same time:

### Lock Compatibility Matrix
* **Shared (S) Lock:** Compatible with other Shared Locks, but blocks Exclusive Locks.
* **Exclusive (X) Lock:** Blocks both Shared and other Exclusive Locks.

\`\`\`
       LOCK COMPATIBILITY MATRIX
+-------------------+-------------------+-------------------+
| Requested \\ Held   | Shared (S) Lock   | Exclusive (X) Lock|
+-------------------+-------------------+-------------------+
| Shared (S) Lock   | ALLOWED (Read)    | BLOCKED (Write)   |
| Exclusive (X) Lock| BLOCKED (Read)    | BLOCKED (Write)   |
+-------------------+-------------------+-------------------+
\`\`\`

### Lock Granularity (Size of the Gate)
The database can lock data at different levels of size:
1. **Row-Level Lock:** Lock only a single row. High concurrency, but uses more memory for locks.
2. **Page-Level Lock:** Lock an entire 8KB page of rows.
3. **Table-Level Lock:** Lock the entire table. Blocks everyone else entirely, but uses very little locking memory.

---

## 💻 Code Examples: Simulating Read/Write Locks

Let's look at how we acquire exclusive locks in SQL and simulate locks in code.

### SQL Lock Query
\`\`\`sql
-- Lock a row exclusively until the end of the transaction
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE; -- Acquires an Exclusive (X) Lock!
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
COMMIT; -- Lock is released here
\`\`\`

### Multi-Language Execution

##### Python
\`\`\`python
import threading
import time

# Mutual exclusion lock (simulates an Exclusive Lock)
db_lock = threading.Lock()

def write_to_db(thread_name):
    print(f"{thread_name} is waiting for lock...")
    with db_lock: # Acquires exclusive lock
        print(f"{thread_name} acquired lock! Writing data...")
        time.sleep(1) # Simulated write latency
        print(f"{thread_name} finished and released lock.")

t1 = threading.Thread(target=write_to_db, args=("Thread-1",))
t2 = threading.Thread(target=write_to_db, args=("Thread-2",))

t1.start()
t2.start()
t1.join()
t2.join()
\`\`\`

##### Java
\`\`\`java
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class LockDemo {
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();

    public void readData() {
        rwLock.readLock().lock(); // Shared Lock
        try {
            System.out.println(Thread.currentThread().getName() + " is reading...");
        } finally {
            rwLock.readLock().unlock();
        }
    }

    public void writeData() {
        rwLock.writeLock().lock(); // Exclusive Lock
        try {
            System.out.println(Thread.currentThread().getName() + " is writing...");
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    public static void main(String[] args) {
        LockDemo demo = new LockDemo();
        new Thread(demo::readData, "Reader 1").start();
        new Thread(demo::readData, "Reader 2").start();
        new Thread(demo::writeData, "Writer 1").start();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <shared_mutex>
#include <thread>

std::shared_mutex dbMutex; // C++17 Shared Mutex (Read/Write Lock)

void readDb() {
    std::shared_lock<std::shared_mutex> lock(dbMutex); // Shared lock (S-Lock)
    std::cout << "Reader Thread active." << std::endl;
}

void writeDb() {
    std::unique_lock<std::shared_mutex> lock(dbMutex); // Exclusive lock (X-Lock)
    std::cout << "Writer Thread writing data." << std::endl;
}

int main() {
    std::thread t1(readDb);
    std::thread t2(writeDb);
    t1.join();
    t2.join();
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
// TS/JS is single-threaded, but concurrency is simulated using async-mutex libraries
class AsyncLock {
    private promise = Promise.resolve();

    public async acquire(): Promise<() => void> {
        let release: () => void = () => {};
        const nextPromise = new Promise<void>((resolve) => {
            release = resolve;
        });
        const currentPromise = this.promise;
        this.promise = nextPromise;
        await currentPromise;
        return release;
    }
}

async function runTSLock() {
    const lock = new AsyncLock();
    
    const release = await lock.acquire();
    console.log("TS: Exclusive write lock acquired.");
    setTimeout(() => {
        console.log("TS: Write finished, releasing.");
        release();
    }, 500);
}
runTSLock();
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Lock Escalation
Allowing too many individual row locks to accumulate. The database engine will run out of lock memory and automatically escalate those row locks into a single giant Table Lock, blocking everyone else on the server!

### 2. Not Releasing Locks
Leaving transactions open inside scripts without calling \`COMMIT\` or \`ROLLBACK\`. The locked rows remain inaccessible to all other users until the session times out.

---

## 🔍 Interview Corner

### Q1: What is the difference between a Shared Lock (S) and an Exclusive Lock (X)?
* **Shared Lock (S):** Allows multiple read queries to access the same resource simultaneously. It blocks any write operations.
* **Exclusive Lock (X):** Allows only one write query to modify or read the resource, completely blocking all other reads and writes.

### Q2: What is Two-Phase Locking (2PL)?
**Two-Phase Locking (2PL)** is a transaction locking protocol that guarantees serializability. It consists of two phases:
1. **Growing Phase:** The transaction can acquire locks but cannot release any.
2. **Shrinking Phase:** The transaction can release locks but cannot acquire new ones.

---

## 📝 Summary

* **Locks** prevent database transactions from corrupting data during concurrent operations.
* **Shared (S) Locks** permit concurrent reads.
* **Exclusive (X) Locks** isolate writes, blocking all other transactions.
`;
