import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Info } from 'lucide-react';

interface NodeState {
  id: number;
  cloned: boolean;
  highlighted: boolean;
}

interface Step {
  originalNodes: NodeState[];
  clonedNodes: NodeState[];
  dfsStack: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `class Node {
  val: number
  neighbors: Node[]
  constructor(val?: number, neighbors?: Node[]) {
    this.val = val === undefined ? 0 : val
    this.neighbors = neighbors === undefined ? [] : neighbors
  }
}
function cloneGraph(node: Node | null): Node | null {
  const oldToNew = new Map<Node, Node>()
  function dfs(node: Node): Node {
    if (oldToNew.has(node)) {
      return oldToNew.get(node)!
    }
    const copy = new Node(node.val)
    oldToNew.set(node, copy)
    for (const nei of node.neighbors) {
      copy.neighbors.push(dfs(nei))
    }
    return copy
  }
  return node ? dfs(node) : null
}`,

  python: `class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def cloneGraph(node: 'Node') -> 'Node':
    oldToNew = {}
    def dfs(node):
        if node in oldToNew:
            return oldToNew[node]
        copy = Node(node.val)
        oldToNew[node] = copy
        for nei in node.neighbors:
            copy.neighbors.append(dfs(nei))
        return copy
    return dfs(node) if node else None`,

  java: `public static class Solution {
    private Map<Node, Node> oldToNew = new HashMap<>();
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        return dfs(node);
    }
    private Node dfs(Node node) {
        if (oldToNew.containsKey(node)) {
            return oldToNew.get(node);
        }
        Node copy = new Node(node.val);
        oldToNew.put(node, copy);
        for (Node nei : node.neighbors) {
            copy.neighbors.add(dfs(nei));
        }
        return copy;
    }
}`,

  cpp: `class Solution {
public:
    unordered_map<Node*, Node*> visited;
    Node* dfs(Node* node) {
        if (visited.count(node)) {
            return visited[node];
        }
        Node* clone = new Node(node->val);
        visited[node] = clone;
        for (Node* neighbor : node->neighbors) {
            clone->neighbors.push_back(dfs(neighbor));
        }
        return clone;
    }
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        return dfs(node);
    }
};`
};

export const CloneGraphVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const stepLines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLines.typescript!.push(ts);
      stepLines.python!.push(py);
      stepLines.java!.push(java);
      stepLines.cpp!.push(cpp);
    };

    const adjList: Record<number, number[]> = {
      1: [2, 4],
      2: [1, 3],
      3: [2, 4],
      4: [1, 3]
    };
    
    const oldToNew = new Map<number, boolean>();
    const stack: number[] = [];

    const makeStep = (explanation: string, pseudoStep: string, ts: number, py: number, java: number, cpp: number, currentId: number | null): Step => {
      return {
        originalNodes: [1, 2, 3, 4].map(id => ({ id, cloned: oldToNew.has(id), highlighted: id === currentId })),
        clonedNodes: [1, 2, 3, 4].filter(id => oldToNew.has(id)).map(id => ({ id, cloned: true, highlighted: id === currentId })),
        dfsStack: [...stack],
        variables: { 
          node: currentId ? `Node(${currentId})` : "null", 
          "oldToNew.size": oldToNew.size,
          stack: stack.join(" → ") || "empty"
        },
        explanation,
        pseudoStep
      };
    };

    // Step 1: Start
    stepsList.push(makeStep(
      "Given a reference to Node 1 in a connected cyclic graph. Deep copy the entire graph.",
      "START cloneGraph(node=1)",
      22, 16, 4, 16, null
    ));
    addLines(22, 16, 4, 16);

    // Step 2: Init map
    stepsList.push(makeStep(
      "Initialize oldToNew Map to keep track of mapping between original nodes and their cloned nodes.",
      "SET oldToNew = {}",
      10, 6, 2, 3, null
    ));
    addLines(10, 6, 2, 3);

    const solve = (id: number) => {
      stack.push(id);
      
      // Step 3: Enter DFS
      stepsList.push(makeStep(
        `Enter dfs(Node ${id}).`,
        `CALL dfs(node=${id})`,
        11, 7, 7, 4, id
      ));
      addLines(11, 7, 7, 4);

      // Step 4: Check if already cloned
      const exists = oldToNew.has(id);
      stepsList.push(makeStep(
        `Check if Node ${id} has already been cloned.`,
        `IF oldToNew has node ${id} → ${exists ? "YES ✓" : "NO ✗"}`,
        12, 8, 8, 5, id
      ));
      addLines(12, 8, 8, 5);

      if (exists) {
        stepsList.push(makeStep(
          `Node ${id} is already in the map. Return the cloned copy to prevent infinite loops.`,
          `RETURN oldToNew[${id}]`,
          13, 9, 9, 6, id
        ));
        addLines(13, 9, 9, 6);
        stack.pop();
        return;
      }

      // Step 6: Create copy
      stepsList.push(makeStep(
        `Node ${id} not found in map. Create a new cloned Node with value ${id}.`,
        `SET copy = Node(${id})`,
        15, 10, 11, 8, id
      ));
      addLines(15, 10, 11, 8);

      // Step 7: Store mapping
      oldToNew.set(id, true);
      stepsList.push(makeStep(
        `Map Node ${id} to its clone copy.`,
        `oldToNew[${id}] = copy`,
        16, 11, 12, 9, id
      ));
      addLines(16, 11, 12, 9);

      // Step 8: Loop neighbors
      for (const nei of adjList[id]) {
        stepsList.push(makeStep(
          `Iterate neighbors: current neighbor is Node ${nei}.`,
          `FOR neighbor of Node ${id} → neighbor = ${nei}`,
          17, 12, 13, 10, id
        ));
        addLines(17, 12, 13, 10);

        stepsList.push(makeStep(
          `Call dfs recursively for neighbor Node ${nei}.`,
          `CALL dfs(node=${nei})`,
          18, 13, 14, 11, id
        ));
        addLines(18, 13, 14, 11);

        solve(nei);

        stepsList.push(makeStep(
          `Returned from dfs(${nei}). Link cloned neighbor Node ${nei} to copy of Node ${id}.`,
          `LINK neighbor ${nei} to copy of ${id}`,
          18, 13, 14, 11, id
        ));
        addLines(18, 13, 14, 11);
      }

      // Step 10: Return copy
      stepsList.push(makeStep(
        `DFS complete for Node ${id}. Return the cloned copy.`,
        `RETURN copy of ${id}`,
        20, 14, 16, 13, id
      ));
      addLines(20, 14, 16, 13);
      stack.pop();
    };

    solve(1);

    stepsList.push(makeStep(
      "Final cloned Graph of Node 1 returned successfully.",
      "RETURN copy of Node 1",
      22, 16, 5, 17, null
    ));
    addLines(22, 16, 5, 17);

    return { steps: stepsList, stepLineNumbers: stepLines };
  }, []);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Original Graph */}
            <Card className="p-4 border-border/50 bg-card/60 backdrop-blur shadow-sm relative overflow-hidden">
              <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-4 text-center">Original Graph</h4>
              <div className="grid grid-cols-2 gap-6 justify-items-center relative py-4">
                {step.originalNodes.map((node) => (
                  <div 
                    key={node.id}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black transition-all duration-300 relative ${
                      node.highlighted ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-md scale-110 z-10" :
                      node.cloned ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                      "border-border bg-muted/20 text-muted-foreground/40"
                    }`}
                  >
                    <span className="text-xs font-mono">{node.id}</span>
                    {node.id === 1 && <div className="absolute -top-4 text-[7px] font-bold text-primary uppercase">Start</div>}
                  </div>
                ))}
                {/* SVG Connections for a square graph */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
                    <line x1="25%" y1="25%" x2="75%" y2="25%" stroke="currentColor" strokeWidth="2" />
                    <line x1="75%" y1="25%" x2="75%" y2="75%" stroke="currentColor" strokeWidth="2" />
                    <line x1="75%" y1="75%" x2="25%" y2="75%" stroke="currentColor" strokeWidth="2" />
                    <line x1="25%" y1="75%" x2="25%" y2="25%" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </Card>

            {/* Cloned Graph Nodes */}
            <Card className="p-4 border-blue-500/20 bg-blue-500/5 shadow-sm relative overflow-hidden">
              <h4 className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 mb-4 text-center">Cloned Nodes</h4>
              <div className="grid grid-cols-2 gap-6 justify-items-center py-4">
                {[1, 2, 3, 4].map((id) => {
                  const clonedNode = step.clonedNodes.find(n => n.id === id);
                  return (
                    <div 
                      key={id}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black transition-all duration-300 ${
                        clonedNode ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 shadow-sm" :
                        "border-dashed border-border/30 bg-transparent text-transparent"
                      }`}
                    >
                      <span className="text-xs font-mono">{clonedNode ? id : ""}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {step.dfsStack.length > 0 && (
            <Card className="p-4 border-border/50 bg-card/60 backdrop-blur shadow-sm">
              <h4 className="text-[8px] font-bold uppercase text-muted-foreground mb-3">Recursion Stack</h4>
              <div className="flex gap-2 flex-wrap items-center">
                {step.dfsStack.map((id, pos) => (
                  <React.Fragment key={pos}>
                    <div className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold border border-primary/20 shadow-sm">
                      dfs({id})
                    </div>
                    {pos < step.dfsStack.length - 1 && <span className="text-muted-foreground/30 text-xs font-bold">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </Card>
          )}

          {/* Commentary Panel */}
          <Card className="p-6 bg-card border-border/50 shadow-sm relative overflow-hidden transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {step.explanation}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
