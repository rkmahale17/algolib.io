import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface DLLNode {
  key: number;
  value: number;
  prev: number | null;
  next: number | null;
}

interface Step {
  type: "get" | "put";
  key: number;
  value?: number;
  result?: number;
  hashMap: Map<number, number>;
  nodes: DLLNode[];
  head: number | null;
  tail: number | null;
  message: string;
  detailedMessage: string;
  explanation: string;
  pseudoStep: string;
  highlightedNode?: number;
  highlightedHashMapKey?: number;
  evictedNode?: number;
  operation: string;
  substep: number;
  totalSubsteps: number;
  animationType: "none" | "move" | "create" | "delete" | "update" | "search";
}

const languages: VisualizationLanguageMap = {
  typescript: `class LRUCache {
  private capacity: number;
  private cache: Map<number, DLLNode>;
  private head: DLLNode | null;
  private tail: DLLNode | null;
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = null;
    this.tail = null;
  }
  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key)!;
    this.moveToHead(node);
    return node.value;
  }
  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.value = value;
      this.moveToHead(node);
    } else {
      const newNode = { key, value, prev: null, next: null };
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      if (this.cache.size > this.capacity) {
        const removed = this.removeTail();
        this.cache.delete(removed.key);
      }
    }
  }
  private moveToHead(node: DLLNode): void {
    this.removeNode(node);
    this.addToHead(node);
  }
  private removeNode(node: DLLNode): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;
  }
  private addToHead(node: DLLNode): void {
    node.next = this.head;
    node.prev = null;
    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
  }
  private removeTail(): DLLNode {
    const removed = this.tail!;
    this.removeNode(removed);
    return removed;
  }
}
interface DLLNode {
  key: number;
  value: number;
  prev: DLLNode | null;
  next: DLLNode | null;
}`,
  python: `class DLLNode:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None
class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = None
        self.tail = None
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._move_to_head(node)
        return node.value
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.value = value
            self._move_to_head(node)
        else:
            new_node = DLLNode(key, value)
            self.cache[key] = new_node
            self._add_to_head(new_node)
            if len(self.cache) > self.capacity:
                removed_node = self._remove_tail()
                del self.cache[removed_node.key]
    def _move_to_head(self, node: DLLNode) -> None:
        self._remove_node(node)
        self._add_to_head(node)
    def _remove_node(self, node: DLLNode) -> None:
        if node.prev:
            node.prev.next = node.next
        if node.next:
            node.next.prev = node.prev
        if node == self.head:
            self.head = node.next
        if node == self.tail:
            self.tail = node.prev
    def _add_to_head(self, node: DLLNode) -> None:
        node.next = self.head
        node.prev = None
        if self.head:
            self.head.prev = node
        self.head = node
        if not self.tail:
            self.tail = node
    def _remove_tail(self) -> DLLNode:
        removed_node = self.tail
        self._remove_node(removed_node)
        return removed_node`,
  java: `import java.util.HashMap;
import java.util.Map;
class LRUCache {
    private int capacity;
    private Map<Integer, Node> cache;
    private Node head, tail;
    class Node {
        int key, value;
        Node prev, next;
        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();
        this.head = null;
        this.tail = null;
    }
    public int get(int key) {
        if (!cache.containsKey(key)) {
            return -1;
        }
        Node node = cache.get(key);
        moveToHead(node);
        return node.value;
    }
    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            Node node = cache.get(key);
            node.value = value;
            moveToHead(node);
        } else {
            Node newNode = new Node(key, value);
            cache.put(key, newNode);
            addToHead(newNode);
            if (cache.size() > capacity) {
                Node removed = removeTail();
                cache.remove(removed.key);
            }
        }
    }
    private void moveToHead(Node node) {
        removeNode(node);
        addToHead(node);
    }
    private void removeNode(Node node) {
        if (node.prev != null) {
            node.prev.next = node.next;
        } else {
            head = node.next;
        }
        if (node.next != null) {
            node.next.prev = node.prev;
        } else {
            tail = node.prev;
        }
    }
    private void addToHead(Node node) {
        node.next = head;
        node.prev = null;
        if (head != null) {
            head.prev = node;
        }
        head = node;
        if (tail == null) {
            tail = node;
        }
    }
    private Node removeTail() {
        Node removed = tail;
        removeNode(tail);
        return removed;
    }
}`,
  cpp: `#include <unordered_map>
using namespace std;
class DLLNode {
  public:
    int key;
    int value;
    DLLNode* prev;
    DLLNode* next;
  DLLNode(int k, int v): key(k), value(v), prev(nullptr), next(nullptr) { }
};
class LRUCache {
  private:
    int capacity;
    unordered_map<int, DLLNode*> cache;
    DLLNode* head;
    DLLNode* tail;
  public:
    LRUCache(int capacity) {
      this->capacity = capacity;
      head = nullptr;
      tail = nullptr;
    }
    int get(int key) {
      if (cache.find(key) == cache.end()) {
        return -1;
      }
      DLLNode* node = cache[key];
      moveToHead(node);
      return node->value;
    }
    void put(int key, int value) {
      if (cache.find(key) != cache.end()) {
        DLLNode* node = cache[key];
        node->value = value;
        moveToHead(node);
      } else {
        DLLNode* newNode = new DLLNode(key, value);
        cache[key] = newNode;
        addToHead(newNode);
        if (cache.size() > capacity) {
          DLLNode* removed = removeTail();
          cache.erase(removed->key);
          delete removed;
        }
      }
    }
  private:
    void moveToHead(DLLNode* node) {
      removeNode(node);
      addToHead(node);
    }
    void removeNode(DLLNode* node) {
      if (node->prev) node->prev->next = node->next;
      if (node->next) node->next->prev = node->prev;
      if (node == head) head = node->next;
      if (node == tail) tail = node->prev;
    }
    void addToHead(DLLNode* node) {
      node->next = head;
      node->prev = nullptr;
      if (head) head->prev = node;
      head = node;
      if (!tail) tail = node;
    }
    DLLNode* removeTail() {
      DLLNode* removed = tail;
      removeNode(removed);
      return removed;
    }
};`,
};

export const LRUCacheVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({
    typescript: [],
    python: [],
    java: [],
    cpp: [],
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const capacity = 3;
    const operations = [
      { type: "put" as const, key: 1, value: 1 },
      { type: "put" as const, key: 2, value: 2 },
      { type: "put" as const, key: 3, value: 3 },
      { type: "get" as const, key: 2 },
      { type: "put" as const, key: 4, value: 4 },
      { type: "get" as const, key: 1 },
      { type: "get" as const, key: 3 },
      { type: "put" as const, key: 5, value: 5 },
    ];

    const generatedSteps: Step[] = [];
    const stepLines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: [],
    };

    const cache = new Map<number, number>();
    let nodes: DLLNode[] = [];
    let head: number | null = null;
    let tail: number | null = null;

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLines.typescript!.push(ts);
      stepLines.python!.push(py);
      stepLines.java!.push(java);
      stepLines.cpp!.push(cpp);
    };

    const createStep = (
      type: "get" | "put",
      key: number,
      value: number | undefined,
      message: string,
      detailedMessage: string,
      pseudoStep: string,
      substep: number,
      totalSubsteps: number,
      animationType: Step["animationType"],
      result?: number,
      highlightedNode?: number,
      highlightedHashMapKey?: number,
      evictedNode?: number
    ): Step => {
      return {
        type,
        key,
        value,
        result,
        hashMap: new Map(cache),
        nodes: JSON.parse(JSON.stringify(nodes)),
        head,
        tail,
        message,
        detailedMessage,
        explanation: detailedMessage,
        pseudoStep,
        highlightedNode,
        highlightedHashMapKey,
        evictedNode,
        operation: type === "get" ? `get(${key})` : `put(${key}, ${value})`,
        substep,
        totalSubsteps,
        animationType,
      };
    };

    const generateGetSteps = (key: number) => {
      const hasKey = cache.has(key);
      if (hasKey) {
        const nodeIdx = cache.get(key)!;
        const val = nodes[nodeIdx].value;
        let substep = 1;
        const totalSubsteps = 11;

        generatedSteps.push(
          createStep(
            "get",
            key,
            undefined,
            `Called get(${key})`,
            `Starting GET operation for key ${key}`,
            `CALL get(key = ${key})`,
            substep++,
            totalSubsteps,
            "none"
          )
        );
        addLines(12, 13, 21, 23);

        generatedSteps.push(
          createStep(
            "get",
            key,
            undefined,
            `Checking HashMap for key ${key}...`,
            `Searching in HashMap to see if key ${key} exists`,
            `IF key = ${key} IN cache`,
            substep++,
            totalSubsteps,
            "search",
            undefined,
            undefined,
            key
          )
        );
        addLines(13, 14, 22, 24);

        generatedSteps.push(
          createStep(
            "get",
            key,
            undefined,
            `Key ${key} found in HashMap!`,
            `HashMap contains key ${key}, pointing to node at index ${nodeIdx}`,
            `node = cache[${key}] → FOUND ✓`,
            substep++,
            totalSubsteps,
            "search",
            undefined,
            nodeIdx,
            key
          )
        );
        addLines(14, 16, 25, 27);

        generatedSteps.push(
          createStep(
            "get",
            key,
            undefined,
            `Retrieved node from HashMap`,
            `Got reference to node: {key: ${key}, value: ${val}}`,
            `SET node = cache[${key}]`,
            substep++,
            totalSubsteps,
            "update",
            undefined,
            nodeIdx
          )
        );
        addLines(14, 16, 25, 27);

        generatedSteps.push(
          createStep(
            "get",
            key,
            undefined,
            `Need to move node to HEAD`,
            `Mark this node as most recently used by moving it to the front of the list`,
            `CALL moveToHead(node)`,
            substep++,
            totalSubsteps,
            "none",
            undefined,
            nodeIdx
          )
        );
        addLines(15, 17, 26, 28);

        const node = nodes[nodeIdx];
        const isAlreadyHead = head === nodeIdx;

        if (!isAlreadyHead) {
          generatedSteps.push(
            createStep(
              "get",
              key,
              undefined,
              `Disconnecting node from current position...`,
              `Removing node from its current position in the doubly linked list`,
              `CALL removeNode(node)`,
              substep++,
              totalSubsteps,
              "delete",
              undefined,
              nodeIdx
            )
          );
          addLines(37, 34, 48, 52);

          if (node.prev !== null) {
            generatedSteps.push(
              createStep(
                "get",
                key,
                undefined,
                `Updating previous node's next pointer`,
                `Setting node[${node.prev}].next = ${node.next}`,
                `SET node.prev.next = node.next`,
                substep++,
                totalSubsteps,
                "update",
                undefined,
                node.prev
              )
            );
            addLines(38, 36, 50, 53);
            nodes[node.prev].next = node.next;
          }
          if (node.next !== null) {
            generatedSteps.push(
              createStep(
                "get",
                key,
                undefined,
                `Updating next node's prev pointer`,
                `Setting node[${node.next}].prev = ${node.prev}`,
                `SET node.next.prev = node.prev`,
                substep++,
                totalSubsteps,
                "update",
                undefined,
                node.next
              )
            );
            addLines(39, 38, 55, 54);
            nodes[node.next].prev = node.prev;
          }
          if (head === nodeIdx) head = node.next;
          if (tail === nodeIdx) tail = node.prev;

          generatedSteps.push(
            createStep(
              "get",
              key,
              undefined,
              `Reconnecting node at HEAD position...`,
              `Adding node to the front of the doubly linked list`,
              `CALL addToHead(node)`,
              substep++,
              totalSubsteps,
              "create",
              undefined,
              nodeIdx
            )
          );
          addLines(43, 43, 60, 58);

          node.next = head;
          node.prev = null;
          if (head !== null) nodes[head].prev = nodeIdx;
          head = nodeIdx;
          if (tail === null) tail = nodeIdx;

          generatedSteps.push(
            createStep(
              "get",
              key,
              undefined,
              `Updated HEAD pointer and reconnected links`,
              `Node is now at HEAD position with all pointers correctly updated`,
              `SET head = node`,
              substep++,
              totalSubsteps,
              "update",
              undefined,
              head!
            )
          );
          addLines(47, 48, 66, 62);
        } else {
          generatedSteps.push(
            createStep(
              "get",
              key,
              undefined,
              `Node already at HEAD position`,
              `No movement needed - node is already the most recently used`,
              `node IS ALREADY head → SKIP`,
              substep++,
              totalSubsteps,
              "none",
              undefined,
              nodeIdx
            )
          );
          addLines(15, 17, 26, 28);
        }

        generatedSteps.push(
          createStep(
            "get",
            key,
            undefined,
            `Returning value: ${val}`,
            `GET operation complete - returning node value ${val}`,
            `RETURN node.value → ${val}`,
            substep++,
            totalSubsteps,
            "none",
            val,
            nodeIdx
          )
        );
        addLines(16, 18, 27, 29);
      } else {
        let substep = 1;
        const totalSubsteps = 3;
        generatedSteps.push(
          createStep(
            "get",
            key,
            undefined,
            `Checking HashMap for key ${key}...`,
            `Searching in HashMap to see if key ${key} exists`,
            `IF key = ${key} IN cache`,
            substep++,
            totalSubsteps,
            "search"
          )
        );
        addLines(13, 14, 22, 24);

        generatedSteps.push(
          createStep(
            "get",
            key,
            undefined,
            `Key ${key} not found in cache!`,
            `HashMap does not contain key ${key} - cache miss`,
            `node NOT IN cache → MISS ✗`,
            substep++,
            totalSubsteps,
            "none",
            -1
          )
        );
        addLines(13, 14, 23, 25);

        generatedSteps.push(
          createStep(
            "get",
            key,
            undefined,
            `Returning -1 (cache miss)`,
            `GET operation complete - key not found, returning -1`,
            `RETURN -1`,
            substep++,
            totalSubsteps,
            "none",
            -1
          )
        );
        addLines(13, 15, 23, 25);
      }
    };

    const generatePutSteps = (key: number, val: number) => {
      const hasKey = cache.has(key);
      if (hasKey) {
        const nodeIdx = cache.get(key)!;
        let substep = 1;
        const totalSubsteps = 10;

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Called put(${key}, ${val})`,
            `Starting PUT operation for key ${key} with value ${val}`,
            `CALL put(key = ${key}, value = ${val})`,
            substep++,
            totalSubsteps,
            "none"
          )
        );
        addLines(18, 19, 29, 31);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Checking if key ${key} exists...`,
            `Searching HashMap to check if key already exists in cache`,
            `IF key = ${key} IN cache`,
            substep++,
            totalSubsteps,
            "search",
            undefined,
            undefined,
            key
          )
        );
        addLines(19, 20, 30, 32);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Key ${key} found in cache`,
            `Key exists - will update the value instead of creating new node`,
            `node = cache[${key}] → FOUND ✓`,
            substep++,
            totalSubsteps,
            "search",
            undefined,
            nodeIdx,
            key
          )
        );
        addLines(19, 20, 30, 32);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Retrieved node from HashMap`,
            `Got reference to existing node at index ${nodeIdx}`,
            `SET node = cache[${key}]`,
            substep++,
            totalSubsteps,
            "update",
            undefined,
            nodeIdx
          )
        );
        addLines(20, 21, 31, 33);

        const oldValue = nodes[nodeIdx].value;
        nodes[nodeIdx].value = val;
        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Updated value: ${oldValue} → ${val}`,
            `Changed node value from ${oldValue} to ${val}`,
            `SET node.value = ${val}`,
            substep++,
            totalSubsteps,
            "update",
            undefined,
            nodeIdx
          )
        );
        addLines(21, 22, 32, 34);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Moving node to HEAD...`,
            `Mark this node as most recently used by moving to front`,
            `CALL moveToHead(node)`,
            substep++,
            totalSubsteps,
            "move",
            undefined,
            nodeIdx
          )
        );
        addLines(22, 23, 33, 35);

        const node = nodes[nodeIdx];
        const isAlreadyHead = head === nodeIdx;

        if (!isAlreadyHead) {
          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Disconnecting from current position...`,
              `Removing node from its current position in the list`,
              `CALL removeNode(node)`,
              substep++,
              totalSubsteps,
              "delete",
              undefined,
              nodeIdx
            )
          );
          addLines(37, 34, 48, 52);

          if (node.prev !== null) nodes[node.prev].next = node.next;
          if (node.next !== null) nodes[node.next].prev = node.prev;
          if (head === nodeIdx) head = node.next;
          if (tail === nodeIdx) tail = node.prev;

          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Reconnecting at HEAD position...`,
              `Adding node to front of the doubly linked list`,
              `CALL addToHead(node)`,
              substep++,
              totalSubsteps,
              "create",
              undefined,
              nodeIdx
            )
          );
          addLines(43, 43, 60, 58);

          node.next = head;
          node.prev = null;
          if (head !== null) nodes[head].prev = nodeIdx;
          head = nodeIdx;
          if (tail === null) tail = nodeIdx;

          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Updated HEAD and all pointers`,
              `Node is now at HEAD with all links correctly set`,
              `SET head = node`,
              substep++,
              totalSubsteps,
              "update",
              undefined,
              head!
            )
          );
          addLines(47, 48, 66, 62);
        } else {
          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Node already at HEAD`,
              `No movement needed - already most recently used`,
              `node IS ALREADY head → SKIP`,
              substep++,
              totalSubsteps,
              "none",
              undefined,
              nodeIdx
            )
          );
          addLines(22, 23, 33, 35);
        }

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `PUT operation complete`,
            `Successfully updated key ${key} with value ${val}`,
            `RETURN`,
            substep++,
            totalSubsteps,
            "none",
            undefined,
            head!
          )
        );
        addLines(22, 23, 33, 35);
      } else {
        const needsEviction = cache.size >= capacity;
        const totalSubsteps = needsEviction ? 18 : 12;
        let substep = 1;

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Called put(${key}, ${val})`,
            `Starting PUT operation for new key ${key} with value ${val}`,
            `CALL put(key = ${key}, value = ${val})`,
            substep++,
            totalSubsteps,
            "none"
          )
        );
        addLines(18, 19, 29, 31);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Checking if key ${key} exists...`,
            `Searching HashMap to check if key already in cache`,
            `IF key = ${key} IN cache`,
            substep++,
            totalSubsteps,
            "search"
          )
        );
        addLines(19, 20, 30, 32);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Key ${key} not found - creating new node`,
            `Key doesn't exist, will create and insert new node`,
            `new_node = DLLNode(${key}, ${val})`,
            substep++,
            totalSubsteps,
            "none"
          )
        );
        addLines(24, 25, 35, 37);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Creating new node {key: ${key}, value: ${val}}`,
            `Allocating new doubly linked list node with provided key and value`,
            `SET cache[${key}] = new_node`,
            substep++,
            totalSubsteps,
            "create"
          )
        );
        addLines(24, 25, 35, 37);

        const newIdx = nodes.length;
        const newNode: DLLNode = { key, value: val, prev: null, next: head };
        nodes.push(newNode);
        cache.set(key, newIdx);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Added entry to HashMap: ${key} → node[${newIdx}]`,
            `HashMap now maps key ${key} to node index ${newIdx}`,
            `SET cache[${key}] = new_node`,
            substep++,
            totalSubsteps,
            "create",
            undefined,
            newIdx,
            key
          )
        );
        addLines(25, 26, 36, 38);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Adding new node to HEAD of DLL...`,
            `Inserting node at the front of the doubly linked list`,
            `CALL addToHead(new_node)`,
            substep++,
            totalSubsteps,
            "create",
            undefined,
            newIdx
          )
        );
        addLines(26, 27, 37, 39);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Setting node.next = ${head !== null ? `node[${head}]` : "null"}`,
            `New node's next pointer points to current HEAD`,
            `SET new_node.next = head`,
            substep++,
            totalSubsteps,
            "update",
            undefined,
            newIdx
          )
        );
        addLines(44, 44, 61, 59);

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Setting node.prev = null`,
            `New node's prev pointer is null (it will be the first node)`,
            `SET new_node.prev = null`,
            substep++,
            totalSubsteps,
            "update",
            undefined,
            newIdx
          )
        );
        addLines(45, 45, 62, 60);

        if (head !== null) {
          nodes[head].prev = newIdx;
          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Updating old HEAD's prev pointer`,
              `Old HEAD node[${head}] now points back to new node`,
              `SET head.prev = new_node`,
              substep++,
              totalSubsteps,
              "update",
              undefined,
              head
            )
          );
          addLines(46, 47, 64, 61);
        }

        head = newIdx;
        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `Updated HEAD pointer to node[${newIdx}]`,
            `HEAD now points to the newly inserted node`,
            `SET head = new_node`,
            substep++,
            totalSubsteps,
            "update",
            undefined,
            head
          )
        );
        addLines(47, 48, 66, 62);

        if (tail === null) {
          tail = newIdx;
          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Updated TAIL pointer (list was empty)`,
              `TAIL also points to node[${newIdx}] since it's the only node`,
              `SET tail = new_node`,
              substep++,
              totalSubsteps,
              "update",
              undefined,
              tail
            )
          );
          addLines(48, 50, 68, 63);
        }

        if (cache.size > capacity) {
          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Cache full (size > ${capacity}). Evicting LRU item...`,
              `Number of items exceeds capacity - need to remove the least recently used node`,
              `IF cache.size > capacity`,
              substep++,
              totalSubsteps,
              "none"
            )
          );
          addLines(27, 28, 38, 40);

          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Identifying node to remove (TAIL node)...`,
              `The node at the end of the list (TAIL) is the least recently used`,
              `SET removed = removeTail()`,
              substep++,
              totalSubsteps,
              "none",
              undefined,
              tail!
            )
          );
          addLines(28, 29, 39, 41);

          const tailIdx = tail!;
          const tailNode = nodes[tailIdx];

          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Removing TAIL node from DLL...`,
              `Calling removeTail() to disconnect the node at the end`,
              `CALL removeTail()`,
              substep++,
              totalSubsteps,
              "delete",
              undefined,
              tailIdx
            )
          );
          addLines(50, 51, 71, 65);

          if (tailNode.prev !== null) {
            generatedSteps.push(
              createStep(
                "put",
                key,
                val,
                `Updating previous node's next pointer`,
                `Setting node[${tailNode.prev}].next = null`,
                `SET tail.prev.next = null`,
                substep++,
                totalSubsteps,
                "update",
                undefined,
                tailNode.prev
              )
            );
            addLines(38, 36, 50, 53);
            nodes[tailNode.prev].next = null;
          }
          tail = tailNode.prev;

          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Updated TAIL pointer to previous node`,
              `TAIL now points to node[${tail}]`,
              `SET tail = tail.prev`,
              substep++,
              totalSubsteps,
              "update",
              undefined,
              tail!
            )
          );
          addLines(41, 42, 57, 56);

          generatedSteps.push(
            createStep(
              "put",
              key,
              val,
              `Deleting key ${tailNode.key} from HashMap`,
              `HashMap entry removed - eviction complete`,
              `DELETE cache[removed.key]`,
              substep++,
              totalSubsteps,
              "delete",
              undefined,
              tailIdx,
              undefined,
              tailIdx
            )
          );
          addLines(29, 30, 40, 42);
          cache.delete(tailNode.key);
        }

        generatedSteps.push(
          createStep(
            "put",
            key,
            val,
            `PUT operation complete`,
            `Successfully inserted new key ${key}`,
            `RETURN`,
            substep++,
            totalSubsteps,
            "none",
            undefined,
            head!
          )
        );
        addLines(18, 19, 29, 31);
      }
    };

    operations.forEach((op) => {
      if (op.type === "get") {
        generateGetSteps(op.key);
      } else {
        generatePutSteps(op.key, op.value!);
      }
    });

    setSteps(generatedSteps);
    setStepLineNumbers(stepLines);
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  // Traverse doubly linked list in actual sequence from HEAD to TAIL
  const orderedNodes: number[] = [];
  let currentIdx = currentStep.head;
  const visited = new Set<number>();
  while (currentIdx !== null && !visited.has(currentIdx)) {
    visited.add(currentIdx);
    orderedNodes.push(currentIdx);
    currentIdx = currentStep.nodes[currentIdx].next;
  }

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            {/* Operation Display */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-4">
              <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-widest">
                Current Operation
              </h3>
              <p className="text-xl font-mono text-primary mb-2">
                {currentStep.operation}
              </p>
              <div className="text-xs text-muted-foreground">
                Substep {currentStep.substep} of {currentStep.totalSubsteps}
              </div>
            </Card>

            {/* HashMap Visualization */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-4">
              <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-widest">
                HashMap (Cache Map)
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {Array.from(currentStep.hashMap.entries()).map(([key, nodeIdx]) => (
                  <div
                    key={key}
                    className={`p-2 rounded border-2 transition-all ${
                      currentStep.highlightedHashMapKey === key
                        ? "border-primary bg-primary/20 scale-105"
                        : currentStep.highlightedNode === nodeIdx
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="text-[10px] text-muted-foreground">Key</div>
                    <div className="font-mono font-bold text-sm">{key}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      → node[{nodeIdx}]
                    </div>
                  </div>
                ))}
              </div>
              {currentStep.hashMap.size === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Empty cache
                </p>
              )}
            </Card>

            {/* Doubly Linked List Visualization */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-widest">
                Doubly Linked List (Most to Least Recently Used)
              </h3>
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {currentStep.head !== null && (
                  <div className="text-xs text-primary font-semibold whitespace-nowrap bg-primary/10 px-2 py-1 rounded">
                    HEAD
                  </div>
                )}
                {orderedNodes.map((nodeIdx, displayIdx) => {
                  const node = currentStep.nodes[nodeIdx];
                  const isHighlighted = currentStep.highlightedNode === nodeIdx;
                  const isEvicted = currentStep.evictedNode === nodeIdx;
                  const animType = currentStep.animationType;

                  let colorClass = "border-border bg-muted/30";
                  if (isEvicted) {
                    colorClass = "border-destructive bg-destructive/20 animate-pulse scale-95";
                  } else if (isHighlighted) {
                    if (animType === "create") {
                      colorClass = "border-green-500 bg-green-500/10 scale-105";
                    } else if (animType === "delete") {
                      colorClass = "border-destructive bg-destructive/10 scale-95";
                    } else if (animType === "move") {
                      colorClass = "border-primary bg-primary/20 scale-105";
                    } else if (animType === "update") {
                      colorClass = "border-amber-500 bg-amber-500/10 scale-105";
                    } else if (animType === "search") {
                      colorClass = "border-blue-500 bg-blue-500/10 scale-105";
                    } else {
                      colorClass = "border-primary bg-primary/15 scale-105";
                    }
                  }

                  return (
                    <div key={nodeIdx} className="flex items-center gap-2">
                      {displayIdx > 0 && (
                        <div className="text-muted-foreground font-bold">⇄</div>
                      )}
                      <div
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all min-w-[90px] ${colorClass}`}
                      >
                        <div className="text-[10px] text-muted-foreground">
                          Key: {node.key}
                        </div>
                        <div className="font-mono text-sm font-bold">
                          Val: {node.value}
                        </div>
                        <div className="text-[9px] text-muted-foreground font-mono mt-1">
                          [{nodeIdx}]
                        </div>
                      </div>
                    </div>
                  );
                })}
                {currentStep.tail !== null && (
                  <div className="text-xs text-destructive font-semibold whitespace-nowrap bg-destructive/10 px-2 py-1 rounded">
                    TAIL
                  </div>
                )}
                {currentStep.head === null && (
                  <p className="text-xs text-muted-foreground text-center py-2 w-full">
                    Empty list
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Commentary & Variable Panel in mt-auto */}
          <div className="mt-auto space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                Step Explanation
              </h4>
              <p className="text-sm font-medium leading-relaxed min-h-[40px]">
                {currentStep.explanation}
              </p>
            </Card>
            <VariablePanel
              variables={{
                capacity: 3,
                size: currentStep.hashMap.size,
                head:
                  currentStep.head !== null
                    ? `node[${currentStep.head}] (key: ${currentStep.nodes[currentStep.head].key})`
                    : "null",
                tail:
                  currentStep.tail !== null
                    ? `node[${currentStep.tail}] (key: ${currentStep.nodes[currentStep.tail].key})`
                    : "null",
              }}
            />
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
      }
    />
  );
};
