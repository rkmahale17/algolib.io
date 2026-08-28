export const content = `
# NoSQL Databases: The Warehouse Boxes! 📦

## 📦 Introduction: The Vending Machine vs. The Custom Basket

Imagine buying snacks in two different ways:

* **The Vending Machine (SQL):** Everything is strictly catalogued. Slot A1 contains Snickers, A2 contains Twix. You can only get snacks by putting in coins and typing the code. You cannot put a Snickers, a sandwich, and a toy inside the same slot.
* **The Custom Storage Basket (NoSQL):** You grab a giant plastic bin. You throw in a bag of chips, a book, a jacket, and a customized toy. There are no slots or dividers. You just throw in whatever fits!

In databases, **NoSQL** represents this custom basket! It is a class of non-relational databases that store data without using rigid table-and-column grids. They are designed to scale horizontally across hundreds of servers easily.

---

## 🛠️ The Four Kinds of NoSQL

NoSQL databases are grouped into four main architectural patterns:

\`\`\`
    KEY-VALUE (Redis)                     DOCUMENT (MongoDB)
+-----------------------+              +-----------------------+
| Key: "User-42"        |              | {                     |
| Val: "Bob, 25, USA"   |              |   "name": "Bob",      |
+-----------------------+              |   "skills": ["SQL"]   |
                                       | }                     |
                                       +-----------------------+
                                       
    COLUMN-FAMILY (Cassandra)             GRAPH (Neo4j)
+-----------------------+              +-----------------------+
| User-42:              |              | [Alice] --(Friend)--> |
| - name: "Bob"         |              |        \              |
| - age: 25             |              |         v             |
+-----------------------+              |      [Bob]            |
\`\`\`

### 1. Key-Value Stores (The Fast Map)
Stores data as simple key-value pairs (like a hash map).
* *Primary use:* Caching, session storage.
* *Example:* **Redis**, Memcached.

### 2. Document Databases (The JSON Box)
Stores data as structured documents (usually JSON). Each row can have completely different fields!
* *Primary use:* E-commerce catalogs, user profiles.
* *Example:* **MongoDB**, CouchDB.

### 3. Column-Family (Wide-Column) Stores
Stores columns of data grouped together on disk instead of rows. Excellent for writing massive log files.
* *Primary use:* Time-series data, heavy write logging.
* *Example:* **Cassandra**, ScyllaDB.

### 4. Graph Databases (The Social Network)
Stores data as **Nodes** (objects) and **Edges** (relationships between them). Great for pathfinding.
* *Primary use:* Social networks, recommendation engines, fraud detection.
* *Example:* **Neo4j**.

---

## 💻 Code Examples: Document Storage Simulation

Let's simulate a NoSQL Document collection storing arbitrary JSON objects in code.

### Multi-Language Execution

##### Python
\`\`\`python
class DocumentCollectionSim:
    def __init__(self):
        # Simulated NoSQL Document store
        self.documents = {}

    def insert_document(self, doc_id, doc_json):
        # NoSQL is schema-less: We can insert any dictionary!
        self.documents[doc_id] = doc_json

    def find(self, doc_id):
        return self.documents.get(doc_id)

db = DocumentCollectionSim()

# Insert user with custom fields
db.insert_document("user_101", {
    "name": "Alice",
    "skills": ["Python", "NoSQL"]
})
# Insert another user with different fields (Impossible in relational SQL!)
db.insert_document("user_102", {
    "name": "Bob",
    "favorite_color": "Blue",
    "age": 25
})

print("Alice Document:", db.find("user_101"))
print("Bob Document:", db.find("user_102"))
\`\`\`

##### Java
\`\`\`java
import java.util.*;

public class NoSqlDemo {
    public static void main(String[] args) {
        // Document store simulated using maps of maps
        Map<String, Map<String, Object>> collection = new HashMap<>();

        // Document 1
        Map<String, Object> doc1 = new HashMap<>();
        doc1.put("name", "Alice");
        doc1.put("skills", Arrays.asList("Java", "Redis"));
        collection.put("user_1", doc1);

        // Document 2 (Completely different schema!)
        Map<String, Object> doc2 = new HashMap<>();
        doc2.put("name", "Bob");
        doc2.put("age", 30);
        collection.put("user_2", doc2);

        System.out.println("Java NoSQL Read User 2: " + collection.get("user_2"));
    }
}
\`\`\`

##### C++
\`\`\`cpp
#include <iostream>
#include <unordered_map>
#include <vector>
#include <any>

class DocumentStore {
    // std::any allows storing different types of data fields (schema-less)
    std::unordered_map<std::string, std::unordered_map<std::string, std::any>> store;
public:
    void insertDoc(const std::string& id, const std::unordered_map<std::string, std::any>& doc) {
        store[id] = doc;
    }
    
    std::any getField(const std::string& id, const std::string& key) {
        return store[id][key];
    }
};

int main() {
    DocumentStore db;
    db.insertDoc("user1", {{"name", std::string("Alice")}, {"age", 25}});
    std::cout << "C++ NoSQL Name: " << std::any_cast<std::string>(db.getField("user1", "name")) << std::endl;
    return 0;
}
\`\`\`

##### TypeScript
\`\`\`typescript
class DocumentStoreTS {
    // schema-less map
    private store = new Map<string, Record<string, any>>();

    public insert(id: string, doc: Record<string, any>) {
        this.store.set(id, doc);
    }

    public get(id: string): Record<string, any> | undefined {
        return this.store.get(id);
    }
}
const nosql = new DocumentStoreTS();
nosql.insert("user1", { name: "Alice", skills: ["TypeScript"] });
nosql.insert("user2", { name: "Bob", age: 30 }); // Different fields

console.log("TS Document 1:", nosql.get("user1"));
console.log("TS Document 2:", nosql.get("user2"));
\`\`\`

---

## ⚠️ Common Mistakes

### 1. Using NoSQL for highly relational data
Choosing MongoDB when your app requires deep queries joining 5 different tables. Because NoSQL doesn't support JOINs efficiently, you have to write slow nested queries in your application code, causing N+1 query lag.

### 2. Assuming NoSQL has ACID Transactions
Assuming Cassandra or Redis supports standard transaction rollbacks natively. Many NoSQL databases prioritize speed and scale, sacrificing ACID rules for **Eventual Consistency** (BASE transactions).

---

## 🔍 Interview Corner

### Q1: When should you choose a NoSQL database over a Relational SQL database?
Choose **NoSQL** when your data has no strict schema (e.g. log streams, variable product properties), when you need to scale horizontally across hundreds of servers easily, or when you require extremely high write speeds for simple key-value datasets.

### Q2: What are the four main types of NoSQL databases?
1. **Key-Value Stores** (e.g., Redis)
2. **Document Databases** (e.g., MongoDB)
3. **Column-Family / Wide-Column** (e.g., Cassandra)
4. **Graph Databases** (e.g., Neo4j)

---

## 📝 Summary

* **NoSQL** databases are non-relational, horizontal-scaling, and schema-free.
* The 4 categories are **Key-Value**, **Document**, **Column-Family**, and **Graph**.
* They trade strict ACID rules and JOIN operations for blazing write speeds and scale.
`;
