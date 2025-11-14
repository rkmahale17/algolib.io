import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface DLLNode {
  key: number;
  value: number;
  prev: number | null;
  next: number | null;
}

interface Step {
  type: 'get' | 'put';
  key: number;
  value?: number;
  result?: number;
  hashMap: Map<number, number>;
  nodes: DLLNode[];
  head: number | null;
  tail: number | null;
  message: string;
  highlightedLine: number;
  highlightedNode?: number;
  evictedNode?: number;
  operation: string;
}

const codeExamples = {
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
      const newNode = { key, value };
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
                removed = self._remove_tail()
                del self.cache[removed.key]

    def _move_to_head(self, node):
        self._remove_node(node)
        self._add_to_head(node)

    def _remove_node(self, node):
        if node.prev:
            node.prev.next = node.next
        if node.next:
            node.next.prev = node.prev
        if node == self.head:
            self.head = node.next
        if node == self.tail:
            self.tail = node.prev

    def _add_to_head(self, node):
        node.next = self.head
        node.prev = None
        if self.head:
            self.head.prev = node
        self.head = node
        if not self.tail:
            self.tail = node

    def _remove_tail(self):
        removed = self.tail
        self._remove_node(removed)
        return removed`,

  java: `class DLLNode {
    int key;
    int value;
    DLLNode prev;
    DLLNode next;
    
    DLLNode(int key, int value) {
        this.key = key;
        this.value = value;
    }
}

class LRUCache {
    private int capacity;
    private Map<Integer, DLLNode> cache;
    private DLLNode head;
    private DLLNode tail;

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
        
        DLLNode node = cache.get(key);
        moveToHead(node);
        return node.value;
    }
    
    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            DLLNode node = cache.get(key);
            node.value = value;
            moveToHead(node);
        } else {
            DLLNode newNode = new DLLNode(key, value);
            cache.put(key, newNode);
            addToHead(newNode);
            
            if (cache.size() > capacity) {
                DLLNode removed = removeTail();
                cache.remove(removed.key);
            }
        }
    }
    
    private void moveToHead(DLLNode node) {
        removeNode(node);
        addToHead(node);
    }
    
    private void removeNode(DLLNode node) {
        if (node.prev != null) node.prev.next = node.next;
        if (node.next != null) node.next.prev = node.prev;
        if (node == head) head = node.next;
        if (node == tail) tail = node.prev;
    }
    
    private void addToHead(DLLNode node) {
        node.next = head;
        node.prev = null;
        if (head != null) head.prev = node;
        head = node;
        if (tail == null) tail = node;
    }
    
    private DLLNode removeTail() {
        DLLNode removed = tail;
        removeNode(removed);
        return removed;
    }
}`,

  cpp: `class DLLNode {
public:
    int key;
    int value;
    DLLNode* prev;
    DLLNode* next;
    
    DLLNode(int k, int v) : key(k), value(v), prev(nullptr), next(nullptr) {}
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
};`
};

export const LRUCacheVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState<'typescript' | 'python' | 'java' | 'cpp'>('typescript');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate steps for demonstration
  useEffect(() => {
    const capacity = 3;
    const operations = [
      { type: 'put' as const, key: 1, value: 1 },
      { type: 'put' as const, key: 2, value: 2 },
      { type: 'put' as const, key: 3, value: 3 },
      { type: 'get' as const, key: 2 },
      { type: 'put' as const, key: 4, value: 4 },
      { type: 'get' as const, key: 1 },
      { type: 'get' as const, key: 3 },
      { type: 'put' as const, key: 5, value: 5 },
    ];

    const generatedSteps: Step[] = [];
    const cache = new Map<number, number>();
    let nodes: DLLNode[] = [];
    let head: number | null = null;
    let tail: number | null = null;
    let nodeIdCounter = 0;

    const findNodeIndex = (key: number): number => {
      return nodes.findIndex(n => n.key === key);
    };

    const moveToHead = (nodeIdx: number) => {
      const node = nodes[nodeIdx];
      
      // Remove from current position
      if (node.prev !== null) {
        nodes[node.prev].next = node.next;
      }
      if (node.next !== null) {
        nodes[node.next].prev = node.prev;
      }
      if (head === nodeIdx) {
        head = node.next;
      }
      if (tail === nodeIdx) {
        tail = node.prev;
      }

      // Add to head
      node.next = head;
      node.prev = null;
      if (head !== null) {
        nodes[head].prev = nodeIdx;
      }
      head = nodeIdx;
      if (tail === null) {
        tail = nodeIdx;
      }
    };

    const addToHead = (key: number, value: number) => {
      const newNode: DLLNode = {
        key,
        value,
        prev: null,
        next: head,
      };
      
      const newIdx = nodes.length;
      nodes.push(newNode);
      
      if (head !== null) {
        nodes[head].prev = newIdx;
      }
      head = newIdx;
      if (tail === null) {
        tail = newIdx;
      }
      
      cache.set(key, newIdx);
      return newIdx;
    };

    const removeTail = (): number | null => {
      if (tail === null) return null;
      
      const removedKey = nodes[tail].key;
      const newTail = nodes[tail].prev;
      
      if (newTail !== null) {
        nodes[newTail].next = null;
      } else {
        head = null;
      }
      
      cache.delete(removedKey);
      const removedIdx = tail;
      tail = newTail;
      
      return removedIdx;
    };

    operations.forEach((op) => {
      if (op.type === 'get') {
        if (cache.has(op.key)) {
          const nodeIdx = cache.get(op.key)!;
          const value = nodes[nodeIdx].value;
          
          generatedSteps.push({
            type: 'get',
            key: op.key,
            result: value,
            hashMap: new Map(cache),
            nodes: JSON.parse(JSON.stringify(nodes)),
            head,
            tail,
            message: `get(${op.key}) - Key found in cache`,
            highlightedLine: 14,
            highlightedNode: nodeIdx,
            operation: `get(${op.key})`,
          });

          moveToHead(nodeIdx);

          generatedSteps.push({
            type: 'get',
            key: op.key,
            result: value,
            hashMap: new Map(cache),
            nodes: JSON.parse(JSON.stringify(nodes)),
            head,
            tail,
            message: `Moved node to head (most recently used)`,
            highlightedLine: 16,
            highlightedNode: head!,
            operation: `get(${op.key}) → ${value}`,
          });
        } else {
          generatedSteps.push({
            type: 'get',
            key: op.key,
            result: -1,
            hashMap: new Map(cache),
            nodes: JSON.parse(JSON.stringify(nodes)),
            head,
            tail,
            message: `get(${op.key}) - Key not found`,
            highlightedLine: 15,
            operation: `get(${op.key}) → -1`,
          });
        }
      } else {
        // put operation
        if (cache.has(op.key)) {
          const nodeIdx = cache.get(op.key)!;
          nodes[nodeIdx].value = op.value!;
          
          generatedSteps.push({
            type: 'put',
            key: op.key,
            value: op.value,
            hashMap: new Map(cache),
            nodes: JSON.parse(JSON.stringify(nodes)),
            head,
            tail,
            message: `put(${op.key}, ${op.value}) - Updating existing key`,
            highlightedLine: 22,
            highlightedNode: nodeIdx,
            operation: `put(${op.key}, ${op.value})`,
          });

          moveToHead(nodeIdx);

          generatedSteps.push({
            type: 'put',
            key: op.key,
            value: op.value,
            hashMap: new Map(cache),
            nodes: JSON.parse(JSON.stringify(nodes)),
            head,
            tail,
            message: `Moved updated node to head`,
            highlightedLine: 24,
            highlightedNode: head!,
            operation: `put(${op.key}, ${op.value})`,
          });
        } else {
          const newIdx = addToHead(op.key, op.value!);
          
          generatedSteps.push({
            type: 'put',
            key: op.key,
            value: op.value,
            hashMap: new Map(cache),
            nodes: JSON.parse(JSON.stringify(nodes)),
            head,
            tail,
            message: `put(${op.key}, ${op.value}) - Added new node`,
            highlightedLine: 27,
            highlightedNode: newIdx,
            operation: `put(${op.key}, ${op.value})`,
          });

          if (cache.size > capacity) {
            const evictedIdx = removeTail();
            
            generatedSteps.push({
              type: 'put',
              key: op.key,
              value: op.value,
              hashMap: new Map(cache),
              nodes: JSON.parse(JSON.stringify(nodes)),
              head,
              tail,
              message: `Capacity exceeded - Evicted LRU node (key: ${nodes[evictedIdx!].key})`,
              highlightedLine: 31,
              evictedNode: evictedIdx!,
              operation: `put(${op.key}, ${op.value})`,
            });
          }
        }
      }
    });

    setSteps(generatedSteps);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <VisualizationLayout
      controls={
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
              variant="outline"
              size="icon"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={currentStepIndex === steps.length - 1}
              variant="default"
              size="icon"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              onClick={handleStepForward}
              disabled={currentStepIndex === steps.length - 1}
              variant="outline"
              size="icon"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button onClick={handleReset} variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} / {steps.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <Slider
                value={[speed]}
                onValueChange={(val) => setSpeed(val[0])}
                min={0.5}
                max={3}
                step={0.5}
                className="w-24"
              />
              <span className="text-sm font-medium">{speed}x</span>
            </div>
          </div>
        </div>
      }
      leftContent={
        <div className="space-y-4">
          {/* Operation Display */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2">Current Operation</h3>
            <p className="text-lg font-mono text-primary">{currentStep.operation}</p>
            <p className="text-sm text-muted-foreground mt-1">{currentStep.message}</p>
          </div>

          {/* HashMap Visualization */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">HashMap (Cache)</h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from(currentStep.hashMap.entries()).map(([key, nodeIdx]) => (
                <div
                  key={key}
                  className={`p-2 rounded border-2 transition-all ${
                    currentStep.highlightedNode === nodeIdx
                      ? 'border-primary bg-primary/20 scale-105'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className="text-xs text-muted-foreground">Key</div>
                  <div className="font-mono font-bold">{key}</div>
                </div>
              ))}
            </div>
            {currentStep.hashMap.size === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Empty cache</p>
            )}
          </div>

          {/* Doubly Linked List Visualization */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Doubly Linked List (LRU Order)</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {currentStep.head !== null && (
                <div className="text-xs text-primary font-semibold whitespace-nowrap">HEAD →</div>
              )}
              {currentStep.nodes.map((node, idx) => {
                let currentIdx: number | null = currentStep.head;
                const orderedNodes: number[] = [];
                while (currentIdx !== null) {
                  orderedNodes.push(currentIdx);
                  currentIdx = currentStep.nodes[currentIdx].next;
                }

                if (!orderedNodes.includes(idx)) return null;

                const isHighlighted = currentStep.highlightedNode === idx;
                const isEvicted = currentStep.evictedNode === idx;

                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all min-w-[80px] ${
                        isEvicted
                          ? 'border-destructive bg-destructive/20 opacity-50'
                          : isHighlighted
                          ? 'border-primary bg-primary/20 scale-110 shadow-lg'
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">K: {node.key}</div>
                      <div className="font-mono font-bold text-lg">V: {node.value}</div>
                      {node.prev !== null && <div className="text-xs text-muted-foreground">← prev</div>}
                      {node.next !== null && <div className="text-xs text-muted-foreground">next →</div>}
                    </div>
                    {node.next !== null && orderedNodes.includes(node.next) && (
                      <div className="text-xl text-muted-foreground">↔</div>
                    )}
                  </div>
                );
              })}
              {currentStep.tail !== null && (
                <div className="text-xs text-destructive font-semibold whitespace-nowrap">← TAIL</div>
              )}
            </div>
            {currentStep.head === null && (
              <p className="text-sm text-muted-foreground text-center py-4">Empty list</p>
            )}
          </div>

          {/* Variables Panel */}
          <VariablePanel
            variables={{
              'Capacity': 3,
              'Size': currentStep.hashMap.size,
              'Head Key': currentStep.head !== null ? currentStep.nodes[currentStep.head].key : 'null',
              'Tail Key': currentStep.tail !== null ? currentStep.nodes[currentStep.tail].key : 'null',
            }}
          />
        </div>
      }
      rightContent={
        <div className="space-y-4">
          {/* Language Selector */}
          <div className="flex gap-2">
            {(['typescript', 'python', 'java', 'cpp'] as const).map((lang) => (
              <Button
                key={lang}
                onClick={() => setLanguage(lang)}
                variant={language === lang ? 'default' : 'outline'}
                size="sm"
              >
                {lang === 'typescript' ? 'TypeScript' : lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
              </Button>
            ))}
          </div>

          {/* Code Display */}
          <CodeHighlighter
            code={codeExamples[language]}
            language={language === 'cpp' ? 'cpp' : language}
            highlightedLine={currentStep.highlightedLine}
          />
        </div>
      }
    />
  );
};
