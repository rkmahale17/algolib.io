export const content = `
# Deadlocks: The Standoff on the Bridge! 🌉

## 🌉 Introduction: The One-Lane Bridge

Imagine a narrow **one-lane bridge** crossing a river:

* **The Standoff:** Two cars drive onto the bridge from opposite directions. They meet in the middle.
* **The Lock:** 
  * Car A cannot move forward because Car B is in the way.
  * Car B cannot move forward because Car A is in the way.
  * Neither driver is willing to back up.
* **The Result:** Both cars sit in the middle of the bridge forever, frozen in a complete standoff.

In databases, this frozen state is called a **Deadlock**! 

It happens when Transaction A holds a lock on Row 1 and waits to lock Row 2, while Transaction B holds a lock on Row 2 and waits to lock Row 1. Neither transaction can move forward or release its lock, creating an infinite loop of waiting.

---

## 🏗️ The Deadlock Loop: Visual Mapping

Here is how a deadlock loop forms between two concurrent sessions:

\`\`\`
    TRANSACTION A                                TRANSACTION B
+-------------------+                        +-------------------+
| Holds Lock: Row 1 |                        | Holds Lock: Row 2 |
+-------------------+                        +-------------------+
          |                                            |
   (Tries to lock)                              (Tries to lock)
          |                                            |
          v                                            v
+-------------------+                        +-------------------+
| Waits for: Row 2  | <====================> | Waits for: Row 1  |
+-------------------+                        +-------------------+
 (Blocked by Tx B)                            (Blocked by Tx A)
\`\`\`

### How Databases Resolve Deadlocks

Database engines contain a background detector that runs periodically:
1. **Wait-For Graph:** The database draws a virtual diagram of who is waiting for whom.
2. **Cycle Detection:** If it detects a closed loop (a circle of dependency), it identifies a deadlock.
3. **The Sacrifice:** The engine automatically chooses one transaction to be the **victim**, kills/aborts it, and rolls back its changes. This releases its locks, allowing the other transaction to finish!

---

## 💻 Code Examples: Simulating a Deadlock

Let's simulate a deadlock where two threads try to lock the same resources in opposite orders.

### Multi-Language Execution

##### Python
\`\`\`python
import threading
import time

lock1 = threading.Lock()
lock2 = threading.Lock()

def thread_a():
    print("Thread A: Trying to lock Resource 1...")
    with lock1:
        print("Thread A: Locked Resource 1. Sleeping...")
        time.sleep(0.5) # Sleep to let Thread B run
        print("Thread A: Trying to lock Resource 2...")
        with lock2:
            print("Thread A: Finished successfully!")

def thread_b():
    print("Thread B: Trying to lock Resource 2...")
    with lock2:
        print("Thread B: Locked Resource 2. Sleeping...")
        time.sleep(0.5)
        print("Thread B: Trying to lock Resource 1...")
        with lock1:
            print("Thread B: Finished successfully!")

t1 = threading.Thread(target=thread_a)
t2 = threading.Thread(target=thread_b)
t1.start()
t2.start()
t1.join()
t2.join()
# This python script will hang forever because of the deadlock!
\`\`\`

##### Java
\`\`\`java
public class DeadlockDemo {
    private static final Object resource1 = new Object();
    private static final Object resource2 = new Object();

    public static void main(String[] args) {
        // Thread A
        new Thread(() -> {
            synchronized (resource1) {
                System.out.println("Thread 1: Locked R1");
                try { Thread.sleep(50); } catch (Exception e) {}
                System.out.println("Thread 1: Waiting for R2");
                synchronized (resource2) {
                    System.out.println("Thread 1: Locked R2");
                }
            }
        }).start();

        // Thread B
        new Thread(() -> {
            synchronized (resource2) {
                System.out.println("Thread 2: Locked R2");
                try { Thread.sleep(50); } catch (Exception e) {}
                System.out.println("Thread 2: Waiting for R1");
                synchronized (resource1) {
                    System.out.println("Thread 2: Locked R1");
                }
            }
        }).start();
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <mutex>
#include <thread>
#include <chrono>

std::mutex mtx1;
std::mutex mtx2;

void runThread1() {
    std::cout << "T1: Locking mtx1" << std::endl;
    std::unique_lock<std::mutex> lock1(mtx1);
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    std::cout << "T1: Locking mtx2" << std::endl;
    std::unique_lock<std::mutex> lock2(mtx2);
}

void runThread2() {
    std::cout << "T2: Locking mtx2" << std::endl;
    std::unique_lock<std::mutex> lock2(mtx2);
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    std::cout << "T2: Locking mtx1" << std::endl;
    std::unique_lock<std::mutex> lock1(mtx1);
}

int main() {
    std::thread t1(runThread1);
    std::thread t2(runThread2);
    t1.join();
    t2.join();
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
// JS is single-threaded, so standard deadlocks don't hang execution threads.
// However, transaction deadlocks can still occur when resolving async promises in databases!
console.log("TS: Deadlocks are handled at the database client driver level by handling retry loops.");
\`\`\`

---

## ⚠️ Common Mistakes & Deadlock Prevention

### 1. Acquiring Locks in Random Order
* **Bad:** Thread A updates Table X then Table Y; Thread B updates Table Y then Table X. This creates a deadlock loop.
* **Good:** Always lock tables in the **exact same order** across all parts of your application (e.g. always update X first, then Y).

### 2. Not Setting Lock Timeouts
Allowing queries to wait indefinitely for locks. Always configure lock timeouts (e.g. \`SET lock_timeout = '5s'\`). If a lock is not acquired within 5 seconds, the database will fail the query instead of hanging the thread indefinitely.

---

## 🔍 Interview Corner

### Q1: How does a database engine detect a deadlock?
A database engine detects deadlocks by maintaining a **Wait-For Graph** (a map where nodes are active transactions and edges represent lock dependencies). The engine periodically runs a cycle detection algorithm; if a cycle exists, a deadlock has occurred.

### Q2: What is the best strategy to prevent deadlocks in application code?
The most effective strategy is **Lock Ordering**: ensure that all transactions in your code access and modify tables in the exact same sequential order (e.g. always write to \`orders\` first, then \`order_items\`).

---

## 📝 Summary

* A **Deadlock** is a state where two transactions are blocked, each waiting for locks held by the other.
* The database engine resolves this by killing one transaction (the **victim**) and rolling back its changes.
* Prevent deadlocks by enforcing consistent **Lock Ordering** in your application code.
`;
