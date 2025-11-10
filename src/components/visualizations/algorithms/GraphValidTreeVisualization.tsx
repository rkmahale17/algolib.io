import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  n: number;
  edges: [number, number][];
  visited: Set<number>;
  currentNode: number | null;
  parent: number | null;
  isValid: boolean | null;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const GraphValidTreeVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const n = 5;
  const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 4]];

  const steps: Step[] = [
    {
      n,
      edges,
      visited: new Set(),
      currentNode: null,
      parent: null,
      isValid: null,
      variables: { n: 5, edges: '[[0,1],[0,2],[0,3],[1,4]]' },
      explanation: "Check if undirected graph with 5 nodes forms a valid tree. Tree: connected + no cycles + n-1 edges.",
      highlightedLines: [1],
      lineExecution: "function validTree(n: number, edges: number[][]): boolean"
    },
    {
      n,
      edges,
      visited: new Set(),
      currentNode: null,
      parent: null,
      isValid: null,
      variables: { edgeCount: 4, required: 4 },
      explanation: "Tree must have exactly n-1 edges. Check: 4 === 4? Yes, continue.",
      highlightedLines: [3],
      lineExecution: "if (edges.length !== n - 1) return false; // 4 === 4, continue"
    },
    {
      n,
      edges,
      visited: new Set(),
      currentNode: null,
      parent: null,
      isValid: null,
      variables: { graph: 'Map()' },
      explanation: "Build adjacency list: graph[node] = array of neighbors. Undirected: add both directions.",
      highlightedLines: [6, 7, 8, 9, 10, 11, 12],
      lineExecution: "Build graph: for [u,v]: graph[u].push(v), graph[v].push(u)"
    },
    {
      n,
      edges,
      visited: new Set(),
      currentNode: null,
      parent: null,
      isValid: null,
      variables: { visited: 'Set()' },
      explanation: "Initialize visited set to track explored nodes during DFS.",
      highlightedLines: [15],
      lineExecution: "const visited = new Set<number>();"
    },
    {
      n,
      edges,
      visited: new Set(),
      currentNode: 0,
      parent: -1,
      isValid: null,
      variables: { node: 0, parent: -1 },
      explanation: "Start DFS from node 0 with parent -1 (no parent for root).",
      highlightedLines: [25],
      lineExecution: "dfs(0, -1);"
    },
    {
      n,
      edges,
      visited: new Set([0]),
      currentNode: 0,
      parent: -1,
      isValid: null,
      variables: { visited: '{0}' },
      explanation: "Visit node 0. Mark as visited. Check neighbors: [1,2,3].",
      highlightedLines: [18],
      lineExecution: "visited.add(node); // visited = {0}"
    },
    {
      n,
      edges,
      visited: new Set([0, 1]),
      currentNode: 1,
      parent: 0,
      isValid: null,
      variables: { neighbor: 1, parent: 0 },
      explanation: "Visit neighbor 1. Parent = 0. Recursively call dfs(1, 0). Node 1's neighbors: [0,4].",
      highlightedLines: [20, 21, 22],
      lineExecution: "for (neighbor of graph[0]) if (neighbor !== parent && !visited.has(1)) dfs(1, 0)"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 4]),
      currentNode: 4,
      parent: 1,
      isValid: null,
      variables: { node: 4, visited: '{0,1,4}' },
      explanation: "From node 1, visit neighbor 4. Parent = 1. Mark 4 as visited. Node 4's neighbors: [1].",
      highlightedLines: [18, 20, 21, 22],
      lineExecution: "dfs(4, 1); visited.add(4);"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 4, 2]),
      currentNode: 2,
      parent: 0,
      isValid: null,
      variables: { neighbor: 2, visited: '{0,1,4,2}' },
      explanation: "Back to node 0. Visit neighbor 2. Parent = 0. Node 2's neighbors: [0].",
      highlightedLines: [20, 21, 22],
      lineExecution: "for (neighbor of graph[0]) dfs(2, 0)"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 4, 2, 3]),
      currentNode: 3,
      parent: 0,
      isValid: null,
      variables: { neighbor: 3, visited: '{0,1,2,3,4}' },
      explanation: "Visit neighbor 3. Parent = 0. All nodes visited! Node 3's neighbors: [0].",
      highlightedLines: [20, 21, 22],
      lineExecution: "for (neighbor of graph[0]) dfs(3, 0)"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2, 3, 4]),
      currentNode: null,
      parent: null,
      isValid: null,
      variables: { 'visited.size': 5, n: 5 },
      explanation: "DFS complete. Check connectivity: visited.size (5) === n (5)? Yes!",
      highlightedLines: [28],
      lineExecution: "return visited.size === n; // 5 === 5 -> true"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2, 3, 4]),
      currentNode: null,
      parent: null,
      isValid: true,
      variables: { isValid: true },
      explanation: "Valid tree! Graph is connected (all nodes visited) and has n-1 edges (no cycles).",
      highlightedLines: [28],
      lineExecution: "return true;"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2, 3, 4]),
      currentNode: null,
      parent: null,
      isValid: true,
      variables: { valid: true, complexity: 'O(V+E)' },
      explanation: "Algorithm complete! Tree validation: check edge count + DFS for connectivity. Time: O(V+E), Space: O(V).",
      highlightedLines: [28],
      lineExecution: "Result: true (valid tree)"
    }
  ];

  const code = `function validTree(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  
  const graph = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    graph.set(i, []);
  }
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }
  
  const visited = new Set<number>();
  
  function dfs(node: number, parent: number): void {
    visited.add(node);
    
    for (const neighbor of graph.get(node)!) {
      if (neighbor === parent) continue;
      if (visited.has(neighbor)) return;
      dfs(neighbor, node);
    }
  }
  
  dfs(0, -1);
  
  return visited.size === n;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`nodes-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Nodes (n={step.n})</h3>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: step.n }, (_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      i === step.currentNode
                        ? 'bg-primary text-primary-foreground'
                        : step.visited.has(i)
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : 'bg-muted'
                    }`}
                  >
                    {i}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`edges-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Edges</h3>
              <div className="space-y-1 text-sm font-mono">
                {step.edges.map(([u, v], idx) => (
                  <div key={idx}>
                    {u} ↔ {v}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {step.isValid !== null && (
            <motion.div
              key={`result-${currentStep}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="p-4">
                <div className="text-sm font-semibold mb-2">Valid Tree?</div>
                <div
                  className={`text-3xl font-bold ${
                    step.isValid ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {step.isValid ? 'YES ✓' : 'NO ✗'}
                </div>
              </Card>
            </motion.div>
          )}

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
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
