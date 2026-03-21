import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";

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
  highlightedLine: number;
  highlightedNode?: number;
  highlightedHashMapKey?: number;
  evictedNode?: number;
  operation: string;
  substep: number;
  totalSubsteps: number;
  animationType: "none" | "move" | "create" | "delete" | "update" | "search";
}

const codeExamples = {
  typescript: `class LRUCache {
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
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
};

export const LRUCacheVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState<
    "typescript" | "python" | "java" | "cpp"
  >("typescript");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate granular steps for demonstration
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
    const cache = new Map<number, number>();
    let nodes: DLLNode[] = [];
    let head: number | null = null;
    let tail: number | null = null;

    const createStep = (
      type: "get" | "put",
      key: number,
      value: number | undefined,
      message: string,
      detailedMessage: string,
      highlightedLine: number,
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
        highlightedLine,
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
        const value = nodes[nodeIdx].value;
        let substep = 1;
        const totalSubsteps = 11;

        generatedSteps.push(createStep("get", key, undefined, `Called get(${key})`, `Starting GET operation for key ${key}`, 7, substep++, totalSubsteps, "none"));
        generatedSteps.push(createStep("get", key, undefined, `Checking HashMap for key ${key}...`, `Searching in HashMap to see if key ${key} exists`, 8, substep++, totalSubsteps, "search", undefined, undefined, key));
        generatedSteps.push(createStep("get", key, undefined, `Key ${key} found in HashMap!`, `HashMap contains key ${key}, pointing to node at index ${nodeIdx}`, 8, substep++, totalSubsteps, "search", undefined, nodeIdx, key));
        generatedSteps.push(createStep("get", key, undefined, `Retrieved node from HashMap`, `Got reference to node: {key: ${key}, value: ${value}}`, 9, substep++, totalSubsteps, "update", undefined, nodeIdx));
        generatedSteps.push(createStep("get", key, undefined, `Need to move node to HEAD`, `Mark this node as most recently used by moving it to the front of the list`, 10, substep++, totalSubsteps, "none", undefined, nodeIdx));

        const node = nodes[nodeIdx];
        const isAlreadyHead = head === nodeIdx;

        if (!isAlreadyHead) {
          generatedSteps.push(createStep("get", key, undefined, `Disconnecting node from current position...`, `Removing node from its current position in the doubly linked list`, 31, substep++, totalSubsteps, "delete", undefined, nodeIdx));

          if (node.prev !== null) {
            generatedSteps.push(createStep("get", key, undefined, `Updating previous node's next pointer`, `Setting node[${node.prev}].next = ${node.next}`, 36, substep++, totalSubsteps, "update", undefined, node.prev));
            nodes[node.prev].next = node.next;
          }
          if (node.next !== null) {
            generatedSteps.push(createStep("get", key, undefined, `Updating next node's prev pointer`, `Setting node[${node.next}].prev = ${node.prev}`, 37, substep++, totalSubsteps, "update", undefined, node.next));
            nodes[node.next].prev = node.prev;
          }
          if (head === nodeIdx) head = node.next;
          if (tail === nodeIdx) tail = node.prev;

          generatedSteps.push(createStep("get", key, undefined, `Reconnecting node at HEAD position...`, `Adding node to the front of the doubly linked list`, 32, substep++, totalSubsteps, "create", undefined, nodeIdx));

          node.next = head;
          node.prev = null;
          if (head !== null) nodes[head].prev = nodeIdx;
          head = nodeIdx;
          if (tail === null) tail = nodeIdx;

          generatedSteps.push(createStep("get", key, undefined, `Updated HEAD pointer and reconnected links`, `Node is now at HEAD position with all pointers correctly updated`, 40, substep++, totalSubsteps, "update", undefined, head!));
        } else {
          generatedSteps.push(createStep("get", key, undefined, `Node already at HEAD position`, `No movement needed - node is already the most recently used`, 18, substep++, totalSubsteps, "none", undefined, nodeIdx));
        }

        generatedSteps.push(createStep("get", key, undefined, `Returning value: ${value}`, `GET operation complete - returning node value ${value}`, 11, substep++, totalSubsteps, "none", value, nodeIdx));
      } else {
        let substep = 1;
        const totalSubsteps = 3;
        generatedSteps.push(createStep("get", key, undefined, `Checking HashMap for key ${key}...`, `Searching in HashMap to see if key ${key} exists`, 8, substep++, totalSubsteps, "search"));
        generatedSteps.push(createStep("get", key, undefined, `Key ${key} not found in cache!`, `HashMap does not contain key ${key} - cache miss`, 8, substep++, totalSubsteps, "none", -1));
        generatedSteps.push(createStep("get", key, undefined, `Returning -1 (cache miss)`, `GET operation complete - key not found, returning -1`, 8, substep++, totalSubsteps, "none", -1));
      }
    };

    const generatePutSteps = (key: number, value: number) => {
      const hasKey = cache.has(key);

      if (hasKey) {
        const nodeIdx = cache.get(key)!;
        let substep = 1;
        const totalSubsteps = 10;

        generatedSteps.push(createStep("put", key, value, `Called put(${key}, ${value})`, `Starting PUT operation for key ${key} with value ${value}`, 14, substep++, totalSubsteps, "none"));
        generatedSteps.push(createStep("put", key, value, `Checking if key ${key} exists...`, `Searching HashMap to check if key already exists in cache`, 15, substep++, totalSubsteps, "search", undefined, undefined, key));
        generatedSteps.push(createStep("put", key, value, `Key ${key} found in cache`, `Key exists - will update the value instead of creating new node`, 15, substep++, totalSubsteps, "search", undefined, nodeIdx, key));
        generatedSteps.push(createStep("put", key, value, `Retrieved node from HashMap`, `Got reference to existing node at index ${nodeIdx}`, 16, substep++, totalSubsteps, "update", undefined, nodeIdx));

        const oldValue = nodes[nodeIdx].value;
        nodes[nodeIdx].value = value;
        generatedSteps.push(createStep("put", key, value, `Updated value: ${oldValue} → ${value}`, `Changed node value from ${oldValue} to ${value}`, 17, substep++, totalSubsteps, "update", undefined, nodeIdx));
        generatedSteps.push(createStep("put", key, value, `Moving node to HEAD...`, `Mark this node as most recently used by moving to front`, 18, substep++, totalSubsteps, "move", undefined, nodeIdx));

        const node = nodes[nodeIdx];
        const isAlreadyHead = head === nodeIdx;

        if (!isAlreadyHead) {
          generatedSteps.push(createStep("put", key, value, `Disconnecting from current position...`, `Removing node from its current position in the list`, 31, substep++, totalSubsteps, "delete", undefined, nodeIdx));

          if (node.prev !== null) nodes[node.prev].next = node.next;
          if (node.next !== null) nodes[node.next].prev = node.prev;
          if (head === nodeIdx) head = node.next;
          if (tail === nodeIdx) tail = node.prev;

          generatedSteps.push(createStep("put", key, value, `Reconnecting at HEAD position...`, `Adding node to front of the doubly linked list`, 32, substep++, totalSubsteps, "create", undefined, nodeIdx));

          node.next = head;
          node.prev = null;
          if (head !== null) nodes[head].prev = nodeIdx;
          head = nodeIdx;
          if (tail === null) tail = nodeIdx;

          generatedSteps.push(createStep("put", key, value, `Updated HEAD and all pointers`, `Node is now at HEAD with all links correctly set`, 40, substep++, totalSubsteps, "update", undefined, head!));
        } else {
          generatedSteps.push(createStep("put", key, value, `Node already at HEAD`, `No movement needed - already most recently used`, 25, substep++, totalSubsteps, "none", undefined, nodeIdx));
        }

        generatedSteps.push(createStep("put", key, value, `PUT operation complete`, `Successfully updated key ${key} with value ${value}`, 18, substep++, totalSubsteps, "none", undefined, head!));
      } else {
        const needsEviction = cache.size >= capacity;
        const totalSubsteps = needsEviction ? 18 : 12;
        let substep = 1;

        generatedSteps.push(createStep("put", key, value, `Called put(${key}, ${value})`, `Starting PUT operation for new key ${key} with value ${value}`, 14, substep++, totalSubsteps, "none"));
        generatedSteps.push(createStep("put", key, value, `Checking if key ${key} exists...`, `Searching HashMap to check if key already in cache`, 15, substep++, totalSubsteps, "search"));
        generatedSteps.push(createStep("put", key, value, `Key ${key} not found - creating new node`, `Key doesn't exist, will create and insert new node`, 20, substep++, totalSubsteps, "none"));
        generatedSteps.push(createStep("put", key, value, `Creating new node {key: ${key}, value: ${value}}`, `Allocating new doubly linked list node with provided key and value`, 20, substep++, totalSubsteps, "create"));

        const newIdx = nodes.length;
        const newNode: DLLNode = { key, value, prev: null, next: head };
        nodes.push(newNode);
        cache.set(key, newIdx);

        generatedSteps.push(createStep("put", key, value, `Added entry to HashMap: ${key} → node[${newIdx}]`, `HashMap now maps key ${key} to node index ${newIdx}`, 21, substep++, totalSubsteps, "create", undefined, newIdx, key));
        generatedSteps.push(createStep("put", key, value, `Adding new node to HEAD of DLL...`, `Inserting node at the front of the doubly linked list`, 22, substep++, totalSubsteps, "create", undefined, newIdx));
        generatedSteps.push(createStep("put", key, value, `Setting node.next = ${head !== null ? `node[${head}]` : "null"}`, `New node's next pointer points to current HEAD`, 43, substep++, totalSubsteps, "update", undefined, newIdx));
        generatedSteps.push(createStep("put", key, value, `Setting node.prev = null`, `New node's prev pointer is null (it will be the first node)`, 44, substep++, totalSubsteps, "update", undefined, newIdx));

        if (head !== null) {
          nodes[head].prev = newIdx;
          generatedSteps.push(createStep("put", key, value, `Updating old HEAD's prev pointer`, `Old HEAD node[${head}] now points back to new node`, 45, substep++, totalSubsteps, "update", undefined, head));
        }

        head = newIdx;
        generatedSteps.push(createStep("put", key, value, `Updated HEAD pointer to node[${newIdx}]`, `HEAD now points to the newly inserted node`, 46, substep++, totalSubsteps, "update", undefined, head));

        if (tail === null) {
          tail = newIdx;
          generatedSteps.push(createStep("put", key, value, `Updated TAIL pointer (list was empty)`, `TAIL also points to node[${newIdx}] since it's the only node`, 47, substep++, totalSubsteps, "update", undefined, tail));
        }

        if (cache.size > capacity) {
          generatedSteps.push(createStep("put", key, value, `Cache full (size > ${capacity}). Evicting LRU item...`, `Number of items exceeds capacity - need to remove the least recently used node`, 23, substep++, totalSubsteps, "none"));
          generatedSteps.push(createStep("put", key, value, `Identifying node to remove (TAIL node)...`, `The node at the end of the list (TAIL) is the least recently used`, 24, substep++, totalSubsteps, "none", undefined, tail!));

          const tailIdx = tail!;
          const tailNode = nodes[tailIdx];

          generatedSteps.push(createStep("put", key, value, `Removing TAIL node from DLL...`, `Calling removeTail() to disconnect the node at the end`, 41, substep++, totalSubsteps, "delete", undefined, tailIdx));

          // removeNode logic
          if (tailNode.prev !== null) {
            generatedSteps.push(createStep("put", key, value, `Updating previous node's next pointer`, `Setting node[${tailNode.prev}].next = null`, 36, substep++, totalSubsteps, "update", undefined, tailNode.prev));
            nodes[tailNode.prev].next = null;
          }
          tail = tailNode.prev;

          generatedSteps.push(createStep("put", key, value, `Updated TAIL pointer to previous node`, `TAIL now points to node[${tail}]`, 39, substep++, totalSubsteps, "update", undefined, tail!));

          generatedSteps.push(createStep("put", key, value, `Deleting key ${tailNode.key} from HashMap`, `HashMap entry removed - eviction complete`, 25, substep++, totalSubsteps, "delete", undefined, tailIdx, undefined, tailIdx));
          cache.delete(tailNode.key);
        }

        generatedSteps.push(createStep("put", key, value, `PUT operation complete`, `Successfully inserted new key ${key}`, 27, substep++, totalSubsteps, "none", undefined, head!));
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
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
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
      setCurrentStepIndex((prev) => prev + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
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
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
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
            <p className="text-lg font-mono text-primary">
              {currentStep.operation}
            </p>
            <p className="text-base font-semibold text-foreground mt-2">
              {currentStep.message}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {currentStep.detailedMessage}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Substep {currentStep.substep} of {currentStep.totalSubsteps}
            </div>
          </div>

          {/* HashMap Visualization */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">HashMap (Cache)</h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from(currentStep.hashMap.entries()).map(
                ([key, nodeIdx]) => (
                  <div
                    key={key}
                    className={`p-2 rounded border-2 transition-all ${currentStep.highlightedHashMapKey === key
                      ? "border-primary bg-primary/20 scale-110 animate-pulse"
                      : currentStep.highlightedNode === nodeIdx
                        ? "border-secondary bg-secondary/20 scale-105"
                        : "border-border bg-muted/30"
                      }`}
                  >
                    <div className="text-xs text-muted-foreground">Key</div>
                    <div className="font-mono font-">{key}</div>
                    <div className="text-xs text-muted-foreground mt-1">→ node[{nodeIdx}]</div>
                  </div>
                )
              )}
            </div>
            {currentStep.hashMap.size === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Empty cache
              </p>
            )}
          </div>

          {/* Doubly Linked List Visualization */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">
              Doubly Linked List (LRU Order)
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {currentStep.head !== null && (
                <div className="text-xs text-primary font-semibold whitespace-nowrap">
                  HEAD →
                </div>
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
                const animType = currentStep.animationType;

                let colorClass = "border-border bg-muted/30";
                if (isEvicted) {
                  colorClass = "border-destructive bg-destructive/20 animate-pulse";
                } else if (isHighlighted) {
                  if (animType === "create") {
                    colorClass = "border-success bg-success/20 scale-110";
                  } else if (animType === "delete") {
                    colorClass = "border-destructive bg-destructive/10 scale-90";
                  } else if (animType === "move") {
                    colorClass = "border-primary bg-primary/20 scale-105 animate-pulse";
                  } else if (animType === "update") {
                    colorClass = "border-secondary bg-secondary/20 scale-105";
                  } else if (animType === "search") {
                    colorClass = "border-primary bg-primary/10 scale-105";
                  } else {
                    colorClass = "border-primary bg-primary/20 scale-110 shadow-lg";
                  }
                }

                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all min-w-[80px] ${colorClass}`}
                    >
                      <div className="text-xs text-muted-foreground">
                        K: {node.key}
                      </div>
                      <div className="font-mono font- text-lg">
                        V: {node.value}
                      </div>
                      {node.prev !== null && (
                        <div className="text-xs text-muted-foreground">
                          ← prev
                        </div>
                      )}
                      {node.next !== null && (
                        <div className="text-xs text-muted-foreground">
                          next →
                        </div>
                      )}
                    </div>
                    {node.next !== null && orderedNodes.includes(node.next) && (
                      <div className="text-xl text-muted-foreground">↔</div>
                    )}
                  </div>
                );
              })}
              {currentStep.tail !== null && (
                <div className="text-xs text-destructive font-semibold whitespace-nowrap">
                  ← TAIL
                </div>
              )}
            </div>
            {currentStep.head === null && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Empty list
              </p>
            )}
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <AnimatedCodeEditor
            code={codeExamples[language]}
            language={language === "cpp" ? "cpp" : language}
            highlightedLines={[currentStep.highlightedLine]}
          />
          <VariablePanel
            variables={{
              Capacity: 3,
              Size: currentStep.hashMap.size,
              "Head Key":
                currentStep.head !== null
                  ? currentStep.nodes[currentStep.head].key
                  : "null",
              "Tail Key":
                currentStep.tail !== null
                  ? currentStep.nodes[currentStep.tail].key
                  : "null",
            }}
          />
        </div>
      }
    />
  );
};
