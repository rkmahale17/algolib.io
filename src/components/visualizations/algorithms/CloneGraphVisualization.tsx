import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  currentNode: number;
  visited: number[];
  cloned: number[];
  mapSize: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const CloneGraphVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      currentNode: -1,
      visited: [],
      cloned: [],
      mapSize: 0,
      variables: { graph: '1--2--3--4--1' },
      explanation: "Graph: 1 connects to 2, 2 to 3, 3 to 4, 4 back to 1 (cycle). Clone entire graph structure.",
      highlightedLines: [1, 2],
      lineExecution: "function cloneGraph(node: Node | null): Node | null"
    },
    {
      currentNode: -1,
      visited: [],
      cloned: [],
      mapSize: 0,
      variables: { node: 'null?' },
      explanation: "Check if input node is null. If so, return null immediately.",
      highlightedLines: [3],
      lineExecution: "if (!node) return null; // node exists, continue"
    },
    {
      currentNode: -1,
      visited: [],
      cloned: [],
      mapSize: 0,
      variables: { map: 'new Map()' },
      explanation: "Create HashMap to store original -> clone mappings. Prevents infinite loops in cyclic graphs.",
      highlightedLines: [4],
      lineExecution: "const map = new Map<Node, Node>();"
    },
    {
      currentNode: 1,
      visited: [],
      cloned: [],
      mapSize: 0,
      variables: { node: 1 },
      explanation: "Start DFS from node 1. Define dfs helper function.",
      highlightedLines: [6],
      lineExecution: "function dfs(node: Node): Node"
    },
    {
      currentNode: 1,
      visited: [],
      cloned: [],
      mapSize: 0,
      variables: { 'map.has(1)': false },
      explanation: "Check if node 1 already cloned: map.has(node)? No, continue cloning.",
      highlightedLines: [7],
      lineExecution: "if (map.has(node)) return map.get(node)!; // false"
    },
    {
      currentNode: 1,
      visited: [],
      cloned: [1],
      mapSize: 0,
      variables: { clone: 'Node(1)' },
      explanation: "Create clone of node 1: new Node(1). Clone has same value but no neighbors yet.",
      highlightedLines: [9],
      lineExecution: "const clone = new Node(node.val); // Node(1)"
    },
    {
      currentNode: 1,
      visited: [1],
      cloned: [1],
      mapSize: 1,
      variables: { 'map.size': 1 },
      explanation: "Add to map: map.set(node1, clone1). Now node 1 is marked as cloned.",
      highlightedLines: [10],
      lineExecution: "map.set(node, clone); // map: {1 -> clone1}"
    },
    {
      currentNode: 2,
      visited: [1],
      cloned: [1],
      mapSize: 1,
      variables: { neighbor: 2 },
      explanation: "Process neighbor 2 of node 1. Recursively call dfs(2).",
      highlightedLines: [12, 13],
      lineExecution: "for (const neighbor of node.neighbors) // neighbor = 2"
    },
    {
      currentNode: 2,
      visited: [1],
      cloned: [1, 2],
      mapSize: 1,
      variables: { clone: 'Node(2)' },
      explanation: "Node 2 not in map. Create clone: new Node(2).",
      highlightedLines: [9],
      lineExecution: "const clone = new Node(node.val); // Node(2)"
    },
    {
      currentNode: 2,
      visited: [1, 2],
      cloned: [1, 2],
      mapSize: 2,
      variables: { 'map.size': 2 },
      explanation: "Add to map: map.set(node2, clone2). Node 2 marked as cloned.",
      highlightedLines: [10],
      lineExecution: "map.set(node, clone); // map: {1 -> clone1, 2 -> clone2}"
    },
    {
      currentNode: 3,
      visited: [1, 2],
      cloned: [1, 2, 3],
      mapSize: 3,
      variables: { neighbor: 3 },
      explanation: "Process neighbor 3 of node 2. Create clone: Node(3). Add to map.",
      highlightedLines: [9, 10, 12, 13],
      lineExecution: "dfs(3) -> clone Node(3), map.set(3, clone3)"
    },
    {
      currentNode: 4,
      visited: [1, 2, 3],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { neighbor: 4 },
      explanation: "Process neighbor 4 of node 3. Create clone: Node(4). Add to map.",
      highlightedLines: [9, 10, 12, 13],
      lineExecution: "dfs(4) -> clone Node(4), map.set(4, clone4)"
    },
    {
      currentNode: 1,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { neighbor: 1, 'map.has(1)': true },
      explanation: "Node 4's neighbor is 1 (cycle!). Check map: node 1 already cloned. Return existing clone.",
      highlightedLines: [7],
      lineExecution: "if (map.has(node)) return map.get(node)!; // true, return clone1"
    },
    {
      currentNode: 4,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { 'clone4.neighbors': '[clone1]' },
      explanation: "Add clone1 to clone4's neighbors. Completes the cycle in cloned graph.",
      highlightedLines: [13],
      lineExecution: "clone.neighbors.push(dfs(neighbor)); // clone4.neighbors = [clone1]"
    },
    {
      currentNode: -1,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { result: 'clone1' },
      explanation: "Return clone of starting node (clone1). All neighbors recursively cloned.",
      highlightedLines: [16, 19],
      lineExecution: "return clone; // return clone1"
    },
    {
      currentNode: -1,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { nodes: 4, edges: 4, complexity: 'O(V+E)' },
      explanation: "Algorithm complete! Cloned all nodes and edges. HashMap prevents infinite loops. Time: O(V+E), Space: O(V).",
      highlightedLines: [19],
      lineExecution: "Result: cloned graph with same structure"
    }
  ];

  const code = `function cloneGraph(
  node: Node | null
): Node | null {
  if (!node) return null;
  const map = new Map<Node, Node>();
  
  function dfs(node: Node): Node {
    if (map.has(node)) return map.get(node)!;
    
    const clone = new Node(node.val);
    map.set(node, clone);
    
    for (const neighbor of node.neighbors) {
      clone.neighbors.push(dfs(neighbor));
    }
    
    return clone;
  }
  
  return dfs(node);
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`graph-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Original Graph</h3>
              <div className="flex items-center justify-center gap-8 p-6 bg-muted/30 rounded">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    step.currentNode === 1
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary'
                      : 'bg-secondary'
                  }`}
                >
                  1
                </div>
                <div className="text-2xl">—</div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    step.currentNode === 2
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary'
                      : 'bg-secondary'
                  }`}
                >
                  2
                </div>
              </div>
              <div className="flex items-center justify-center gap-8 p-6 bg-muted/30 rounded mt-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    step.currentNode === 4
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary'
                      : 'bg-secondary'
                  }`}
                >
                  4
                </div>
                <div className="text-2xl">—</div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    step.currentNode === 3
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary'
                      : 'bg-secondary'
                  }`}
                >
                  3
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`cloned-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Cloned Nodes</h3>
              <div className="flex gap-2 flex-wrap">
                {step.cloned.length === 0 ? (
                  <div className="text-sm text-muted-foreground">None yet</div>
                ) : (
                  step.cloned.map((node, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 rounded-full bg-green-500/20 text-green-600 font-bold"
                    >
                      {node}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`algo-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-4 bg-blue-500/10">
              <h3 className="font-semibold mb-2 text-sm">Key Insight:</h3>
              <div className="text-xs text-muted-foreground">
                Use HashMap to track original → clone mappings. When revisiting a node (cycle
                detection), return existing clone instead of creating new one.
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
