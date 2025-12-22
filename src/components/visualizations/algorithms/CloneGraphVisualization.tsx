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
      highlightedLines: [1],
      lineExecution: "function cloneGraph(node: Node | null): Node | null"
    },
    {
      currentNode: -1,
      visited: [],
      cloned: [],
      mapSize: 0,
      variables: { oldToNew: 'new Map()' },
      explanation: "Initialize Map to store mappings between original nodes and their clones.",
      highlightedLines: [3],
      lineExecution: "const oldToNew = new Map<Node, Node>();"
    },
    {
      currentNode: -1,
      visited: [],
      cloned: [],
      mapSize: 0,
      variables: { node: 1 },
      explanation: "Start DFS from the input node (Node 1).",
      highlightedLines: [33],
      lineExecution: "return node ? dfs(node) : null;"
    },
    {
      currentNode: 1,
      visited: [],
      cloned: [],
      mapSize: 0,
      variables: { node: 1 },
      explanation: "Enter dfs function check if node is null.",
      highlightedLines: [6, 8],
      lineExecution: "if (!node) { return null; }"
    },
    {
      currentNode: 1,
      visited: [],
      cloned: [],
      mapSize: 0,
      variables: { 'oldToNew.has(1)': false },
      explanation: "Check if node 1 is already in the map. It's not.",
      highlightedLines: [13],
      lineExecution: "if (oldToNew.has(node))"
    },
    {
      currentNode: 1,
      visited: [],
      cloned: [1],
      mapSize: 0,
      variables: { copy: 'Node(1)' },
      explanation: "Create a new copy of Node 1.",
      highlightedLines: [18],
      lineExecution: "const copy = new Node(node.val);"
    },
    {
      currentNode: 1,
      visited: [1],
      cloned: [1],
      mapSize: 1,
      variables: { 'oldToNew.size': 1 },
      explanation: "Store mapping: 1 -> copy(1) in oldToNew map.",
      highlightedLines: [21],
      lineExecution: "oldToNew.set(node, copy);"
    },
    {
      currentNode: 1,
      visited: [1],
      cloned: [1],
      mapSize: 1,
      variables: { neighbor: 2 },
      explanation: "Iterate over neighbors of Node 1. First neighbor is 2.",
      highlightedLines: [24],
      lineExecution: "for (const neighbor of node.neighbors)"
    },
    {
      currentNode: 1,
      visited: [1],
      cloned: [1],
      mapSize: 1,
      variables: { neighbor: 2 },
      explanation: "Recursively call dfs for neighbor 2.",
      highlightedLines: [25],
      lineExecution: "copy.neighbors.push(dfs(neighbor));"
    },
    {
      currentNode: 2,
      visited: [1],
      cloned: [1],
      mapSize: 1,
      variables: { node: 2 },
      explanation: "Enter dfs(2). Check if node is null (no) and if in map (no).",
      highlightedLines: [8, 13],
      lineExecution: "if (!node)... if (oldToNew.has(node))..."
    },
    {
      currentNode: 2,
      visited: [1],
      cloned: [1, 2],
      mapSize: 1,
      variables: { copy: 'Node(2)' },
      explanation: "Create copy of Node 2.",
      highlightedLines: [18],
      lineExecution: "const copy = new Node(node.val);"
    },
    {
      currentNode: 2,
      visited: [1, 2],
      cloned: [1, 2],
      mapSize: 2,
      variables: { 'oldToNew.size': 2 },
      explanation: "Store mapping: 2 -> copy(2) in oldToNew map.",
      highlightedLines: [21],
      lineExecution: "oldToNew.set(node, copy);"
    },
    {
      currentNode: 2,
      visited: [1, 2],
      cloned: [1, 2],
      mapSize: 2,
      variables: { neighbor: 3 },
      explanation: "Recursively call dfs for neighbor 3.",
      highlightedLines: [24, 25],
      lineExecution: "copy.neighbors.push(dfs(neighbor)); // neighbor 3"
    },
    {
      currentNode: 3,
      visited: [1, 2],
      cloned: [1, 2, 3],
      mapSize: 2,
      variables: { copy: 'Node(3)' },
      explanation: "Inside dfs(3): Create copy of Node 3.",
      highlightedLines: [18],
      lineExecution: "const copy = new Node(3);"
    },
    {
      currentNode: 3,
      visited: [1, 2, 3],
      cloned: [1, 2, 3],
      mapSize: 3,
      variables: { 'oldToNew.size': 3 },
      explanation: "Store mapping: 3 -> copy(3) in oldToNew map.",
      highlightedLines: [21],
      lineExecution: "oldToNew.set(node, copy);"
    },
    {
      currentNode: 3,
      visited: [1, 2, 3],
      cloned: [1, 2, 3],
      mapSize: 3,
      variables: { neighbor: 4 },
      explanation: "Recursively call dfs for neighbor 4.",
      highlightedLines: [24, 25],
      lineExecution: "copy.neighbors.push(dfs(neighbor)); // neighbor 4"
    },
    {
      currentNode: 4,
      visited: [1, 2, 3],
      cloned: [1, 2, 3, 4],
      mapSize: 3,
      variables: { copy: 'Node(4)' },
      explanation: "Inside dfs(4): Create copy of Node 4.",
      highlightedLines: [18],
      lineExecution: "const copy = new Node(4);"
    },
    {
      currentNode: 4,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { 'oldToNew.size': 4 },
      explanation: "Store mapping: 4 -> copy(4).",
      highlightedLines: [21],
      lineExecution: "oldToNew.set(node, copy);"
    },
    {
      currentNode: 4,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { neighbor: 1 },
      explanation: "Neighbor of 4 is 1. Recursively call dfs(1).",
      highlightedLines: [24, 25],
      lineExecution: "copy.neighbors.push(dfs(neighbor)); // neighbor 1"
    },
    {
      currentNode: 1,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { node: 1, 'oldToNew.has(1)': true },
      explanation: "Inside dfs(1): Check map. Node 1 is already cloned!",
      highlightedLines: [13],
      lineExecution: "if (oldToNew.has(node))"
    },
    {
      currentNode: 1,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { return: 'copy(1)' },
      explanation: "Return existing clone of Node 1 from map.",
      highlightedLines: [14],
      lineExecution: "return oldToNew.get(node) || null;"
    },
    {
      currentNode: 4,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { 'copy(4).neighbors': '[copy(1)]' },
      explanation: "Back in dfs(4): Added copy(1) to copy(4)'s neighbors.",
      highlightedLines: [25],
      lineExecution: "copy.neighbors.push(dfs(neighbor)); // pushed copy(1)"
    },
    {
      currentNode: 4,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { return: 'copy(4)' },
      explanation: "Return copy(4) to caller (dfs(3)).",
      highlightedLines: [29],
      lineExecution: "return copy;"
    },
    {
      currentNode: 3,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { 'copy(3).neighbors': '[copy(4)]' },
      explanation: "Back in dfs(3): Added copy(4) to copy(3)'s neighbors. Return copy(3).",
      highlightedLines: [29],
      lineExecution: "return copy;"
    },
    {
      currentNode: 2,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { 'copy(2).neighbors': '[copy(3)]' },
      explanation: "Back in dfs(2): Added copy(3) to copy(2)'s neighbors. Return copy(2).",
      highlightedLines: [29],
      lineExecution: "return copy;"
    },
    {
      currentNode: 1,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { 'copy(1).neighbors': '[copy(2)]' },
      explanation: "Back in dfs(1): Added copy(2) to copy(1)'s neighbors. Recursion complete for this branch.",
      highlightedLines: [25],
      lineExecution: "copy.neighbors.push(dfs(neighbor)); // pushed copy(2)"
    },
    {
      currentNode: -1,
      visited: [1, 2, 3, 4],
      cloned: [1, 2, 3, 4],
      mapSize: 4,
      variables: { result: 'copy(1)' },
      explanation: "Return copy(1). Deep copy complete.",
      highlightedLines: [33],
      lineExecution: "return dfs(node);"
    }
  ];

  const code = `function cloneGraph(node: Node | null): Node | null {
  // Use a Map to store the mapping between original nodes and their clones.
  const oldToNew = new Map<Node, Node>();

  // Define a Depth-First Search (DFS) function to recursively clone the graph.
  function dfs(node: Node | null): Node | null {
    // If the node is null, return null.
    if (!node) {
      return null;
    }

    // If the node has already been cloned, return the clone from the map.
    if (oldToNew.has(node)) {
      return oldToNew.get(node) || null; // Ensure to return null if undefined
    }

    // Create a new node with the same value as the original node.
    const copy = new Node(node.val);

    // Store the mapping between the original node and its clone in the map.
    oldToNew.set(node, copy);

    // Iterate over the neighbors of the original node and recursively clone them.
    for (const neighbor of node.neighbors) {
      copy.neighbors.push(dfs(neighbor)); // Correctly push the cloned neighbors
    }

    // Return the cloned node.
    return copy;
  }

  // If the input node is null, return null. Otherwise, start the DFS from the input node.
  return node ? dfs(node) : null;
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
                Use HashMap (oldToNew) to track original → clone mappings. If we encounter a node that's already in the
                map (like when closing a cycle), we return the existing clone instead of creating a new one.
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
