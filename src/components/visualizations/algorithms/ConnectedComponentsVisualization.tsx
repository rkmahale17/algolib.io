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
  componentCount: number;
  currentComponent: Set<number>;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const ConnectedComponentsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const n = 5;
  const edges: [number, number][] = [[0, 1], [1, 2], [3, 4]];

  const steps: Step[] = [
    {
      n,
      edges,
      visited: new Set(),
      currentNode: null,
      componentCount: 0,
      currentComponent: new Set(),
      variables: { n: 5, edges: '[[0,1],[1,2],[3,4]]' },
      explanation: "Count connected components in undirected graph with 5 nodes. Edges: 0↔1, 1↔2, 3↔4.",
      highlightedLines: [1],
      lineExecution: "function countComponents(n: number, edges: number[][]): number"
    },
    {
      n,
      edges,
      visited: new Set(),
      currentNode: null,
      componentCount: 0,
      currentComponent: new Set(),
      variables: { graph: 'Map()' },
      explanation: "Build adjacency list from edges. Each node stores list of neighbors.",
      highlightedLines: [3, 4, 5, 6, 7, 8, 9],
      lineExecution: "const graph = new Map(); for edges: graph[u].push(v), graph[v].push(u)"
    },
    {
      n,
      edges,
      visited: new Set(),
      currentNode: null,
      componentCount: 0,
      currentComponent: new Set(),
      variables: { visited: 'Set()', count: 0 },
      explanation: "Initialize visited set and component counter.",
      highlightedLines: [12, 13],
      lineExecution: "const visited = new Set(); let count = 0;"
    },
    {
      n,
      edges,
      visited: new Set(),
      currentNode: 0,
      componentCount: 0,
      currentComponent: new Set(),
      variables: { i: 0, 'visited.has(0)': false },
      explanation: "Check node 0: not visited. Start DFS for new component.",
      highlightedLines: [25, 26],
      lineExecution: "for (let i = 0; i < n; i++) if (!visited.has(i)) // i=0"
    },
    {
      n,
      edges,
      visited: new Set([0]),
      currentNode: 0,
      componentCount: 0,
      currentComponent: new Set([0]),
      variables: { node: 0, visited: '{0}' },
      explanation: "DFS visits node 0. Mark as visited. Check neighbors: [1].",
      highlightedLines: [16, 17],
      lineExecution: "function dfs(node: number) visited.add(node); // visited = {0}"
    },
    {
      n,
      edges,
      visited: new Set([0, 1]),
      currentNode: 1,
      componentCount: 0,
      currentComponent: new Set([0, 1]),
      variables: { node: 1, neighbor: 1 },
      explanation: "Visit neighbor 1. Mark as visited. Node 1's neighbors: [0, 2].",
      highlightedLines: [18, 19, 20, 21],
      lineExecution: "for (neighbor of graph[0]) if (!visited.has(1)) dfs(1)"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2]),
      currentNode: 2,
      componentCount: 0,
      currentComponent: new Set([0, 1, 2]),
      variables: { node: 2, component: '{0,1,2}' },
      explanation: "Visit neighbor 2. Mark as visited. Node 2's neighbor: [1] (already visited). Component: {0,1,2}.",
      highlightedLines: [18, 19, 20, 21],
      lineExecution: "for (neighbor of graph[1]) if (!visited.has(2)) dfs(2)"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2]),
      currentNode: null,
      componentCount: 1,
      currentComponent: new Set([0, 1, 2]),
      variables: { count: 1 },
      explanation: "Component {0,1,2} complete. Increment count = 1.",
      highlightedLines: [27, 28],
      lineExecution: "dfs(i); count++; // count = 1"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2]),
      currentNode: 3,
      componentCount: 1,
      currentComponent: new Set(),
      variables: { i: 3, 'visited.has(3)': false },
      explanation: "Check node 3: not visited. Start DFS for second component.",
      highlightedLines: [25, 26],
      lineExecution: "for (let i = 3; i < n; i++) if (!visited.has(i)) // i=3"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2, 3]),
      currentNode: 3,
      componentCount: 1,
      currentComponent: new Set([3]),
      variables: { node: 3, visited: '{0,1,2,3}' },
      explanation: "Visit node 3. Mark as visited. Check neighbors: [4].",
      highlightedLines: [16, 17],
      lineExecution: "dfs(3); visited.add(3);"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2, 3, 4]),
      currentNode: 4,
      componentCount: 1,
      currentComponent: new Set([3, 4]),
      variables: { node: 4, component: '{3,4}' },
      explanation: "Visit neighbor 4. Mark as visited. Component: {3,4}.",
      highlightedLines: [18, 19, 20, 21],
      lineExecution: "for (neighbor of graph[3]) if (!visited.has(4)) dfs(4)"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2, 3, 4]),
      currentNode: null,
      componentCount: 2,
      currentComponent: new Set([3, 4]),
      variables: { count: 2 },
      explanation: "Component {3,4} complete. Increment count = 2.",
      highlightedLines: [27, 28],
      lineExecution: "dfs(i); count++; // count = 2"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2, 3, 4]),
      currentNode: null,
      componentCount: 2,
      currentComponent: new Set(),
      variables: { i: 5, n: 5 },
      explanation: "Check: i (5) < n (5)? No. All nodes visited. Exit loop.",
      highlightedLines: [25],
      lineExecution: "for (let i = 5; i < n; i++) // 5 < 5 -> false"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2, 3, 4]),
      currentNode: null,
      componentCount: 2,
      currentComponent: new Set(),
      variables: { result: 2 },
      explanation: "Return count = 2. Found components: {0,1,2} and {3,4}.",
      highlightedLines: [31],
      lineExecution: "return count; // 2"
    },
    {
      n,
      edges,
      visited: new Set([0, 1, 2, 3, 4]),
      currentNode: null,
      componentCount: 2,
      currentComponent: new Set(),
      variables: { components: 2, complexity: 'O(V+E)' },
      explanation: "Algorithm complete! DFS to explore each component. Time: O(V+E), Space: O(V).",
      highlightedLines: [31],
      lineExecution: "Result: 2 connected components"
    }
  ];

  const code = `function countComponents(n: number, edges: number[][]): number {
  const graph = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    graph.set(i, []);
  }
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }
  
  const visited = new Set<number>();
  let count = 0;
  
  function dfs(node: number): void {
    visited.add(node);
    
    for (const neighbor of graph.get(node)!) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }
  
  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      dfs(i);
      count++;
    }
  }
  
  return count;
}`;

  const step = steps[currentStep];

  const getNodeColor = (nodeIdx: number) => {
    if (nodeIdx === step.currentNode) {
      return 'bg-primary text-primary-foreground';
    }
    if (step.currentComponent.has(nodeIdx)) {
      return 'bg-accent text-accent-foreground border-2 border-accent';
    }
    if (step.visited.has(nodeIdx)) {
      return 'bg-green-500/20 border-2 border-green-500';
    }
    return 'bg-muted';
  };

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
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getNodeColor(
                      i
                    )}`}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-accent text-accent-foreground border-2 border-accent rounded-full"></div>{' '}
                  Current Component
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-500/20 border-2 border-green-500 rounded-full"></div>{' '}
                  Visited
                </div>
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

          {step.componentCount > 0 && (
            <motion.div
              key={`count-${currentStep}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="p-4">
                <div className="text-sm font-semibold mb-2">Components Found</div>
                <div className="text-3xl font-bold text-primary">{step.componentCount}</div>
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
