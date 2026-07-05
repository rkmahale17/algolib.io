import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { GraphDiagram } from '../GraphDiagram';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  currentNode: number | null;
  neighbor: number | null;
  visited: number[];
  recursionStack: number[];
  result: number[];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function dfs(graph: number[][], start: number): number[] {
    const visited = new Set<number>();
    const result: number[] = [];
    function explore(node: number) {
        visited.add(node);
        result.push(node);
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                explore(neighbor);
            }
        }
    }
    explore(start);
    return result;
}`,
  python: `def dfs(graph: list[list[int]], start: int) -> list[int]:
    visited = set()
    result = []
    def explore(node: int):
        visited.add(node)
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                explore(neighbor)
    explore(start)
    return result`,
  java: `class Solution {
    private void explore(List<List<Integer>> graph, int node, Set<Integer> visited, List<Integer> result) {
        visited.add(node);
        result.add(node);
        for (int neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                explore(graph, neighbor, visited, result);
            }
        }
    }
    public List<Integer> dfs(List<List<Integer>> graph, int start) {
        Set<Integer> visited = new HashSet<>();
        List<Integer> result = new ArrayList<>();
        explore(graph, start, visited, result);
        return result;
    }
}`,
  cpp: `class Solution {
private:
    void explore(vector<vector<int>>& graph, int node, unordered_set<int>& visited, vector<int>& result) {
        visited.insert(node);
        result.push_back(node);
        for (int neighbor : graph[node]) {
            if (visited.find(neighbor) == visited.end()) {
                explore(graph, neighbor, visited, result);
            }
        }
    }
public:
    vector<int> dfs(vector<vector<int>>& graph, int start) {
        unordered_set<int> visited;
        vector<int> result;
        explore(graph, start, visited, result);
        return result;
    }
};`,
};

function generateVisualizationData() {
  const graph: number[][] = [
    [1, 2],    // 0
    [0, 3],    // 1
    [0],       // 2
    [1, 4],    // 3
    [3, 5],    // 4
    [4]        // 5
  ];

  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
  const visited = new Set<number>();
  const result: number[] = [];
  const recursionStack: number[] = [];

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  const pushStep = (
    msg: string,
    pseudo: string,
    ts: number,
    py: number,
    java: number,
    cpp: number,
    current: number | null,
    neighbor: number | null = null
  ) => {
    steps.push({
      currentNode: current,
      neighbor,
      visited: Array.from(visited),
      recursionStack: [...recursionStack],
      result: [...result],
      explanation: msg,
      pseudoStep: pseudo,
      variables: {
        node: current !== null ? String(current) : '-',
        neighbor: neighbor !== null ? String(neighbor) : 'none',
        visited: `{${Array.from(visited).join(', ')}}`,
        stack: `[${recursionStack.join(', ')}]`,
        result: `[${result.join(', ')}]`
      }
    });
    addLines(ts, py, java, cpp);
  };

  // Init
  pushStep(
    'Initialize visited set and result array.',
    'SET visited = {}, result = []',
    2, 2, 11, 19,
    null
  );

  const explore = (node: number) => {
    recursionStack.push(node);
    pushStep(
      `Enter explore function for node ${node}. Push to recursion stack.`,
      `CALL explore(${node})`,
      4, 4, 2, 3,
      node
    );

    visited.add(node);
    pushStep(
      `Mark node ${node} as visited.`,
      `visited.add(${node})`,
      5, 5, 3, 4,
      node
    );

    result.push(node);
    pushStep(
      `Add node ${node} to traversal result order.`,
      `result.push(${node})`,
      6, 6, 4, 5,
      node
    );

    const neighbors = graph[node] || [];
    pushStep(
      `Iterating over neighbors of node ${node}: [${neighbors.join(', ')}].`,
      `FOR neighbor IN neighbors of ${node}`,
      7, 7, 5, 6,
      node
    );

    for (const neighbor of neighbors) {
      pushStep(
        `Checking if neighbor ${neighbor} is already visited.`,
        `IF neighbor ${neighbor} NOT IN visited`,
        8, 8, 6, 7,
        node, neighbor
      );

      if (!visited.has(neighbor)) {
        pushStep(
          `Neighbor ${neighbor} not visited. Recursing explore(${neighbor}).`,
          `explore(${neighbor})`,
          9, 9, 7, 8,
          node, neighbor
        );
        explore(neighbor);

        pushStep(
          `Returned from explore(${neighbor}) to node ${node}.`,
          `Returned to explore(${node})`,
          10, 10, 8, 9,
          node
        );
      } else {
        pushStep(
          `Neighbor ${neighbor} already visited. Skip.`,
          `SKIP neighbor ${neighbor}`,
          8, 8, 6, 7,
          node, neighbor
        );
      }
    }

    pushStep(
      `Finished exploring node ${node}. Backtrack and pop from stack.`,
      `BACKTRACK: Pop ${node}`,
      11, 10, 10, 11,
      node
    );
    recursionStack.pop();
  };

  pushStep(
    'Starting DFS traversal from initial node 0.',
    'CALL explore(start_node → 0)',
    13, 11, 13, 21,
    null
  );
  explore(0);

  pushStep(
    `DFS complete! Return final visited order: [${result.join(', ')}].`,
    `RETURN result  →  [${result.join(', ')}]`,
    14, 12, 14, 22,
    null
  );

  return { steps, stepLineNumbers };
}

export const GraphDFSVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const getHighlightEdges = (stack: number[], current: number | null, neighbor: number | null) => {
    const activeEdges = new Set<string>();
    for (let i = 0; i < stack.length - 1; i++) {
      const u = stack[i];
      const v = stack[i + 1];
      activeEdges.add(`${u}-${v}`);
      activeEdges.add(`${v}-${u}`);
    }
    if (current !== null && neighbor !== null) {
      activeEdges.add(`${current}-${neighbor}`);
      activeEdges.add(`${neighbor}-${current}`);
    }
    return activeEdges;
  };

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex flex-col items-center justify-center">
            <GraphDiagram
              data={[[1, 2], [0, 3], [0], [1, 4], [3, 5], [4]]}
              currentNode={currentStep.currentNode}
              highlightNodes={new Set(currentStep.visited)}
              highlightEdges={getHighlightEdges(currentStep.recursionStack, currentStep.currentNode, currentStep.neighbor)}
              className="h-[260px] w-full"
            />
            <div className="flex gap-4 text-xs justify-center pt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary"></div>
                <span>Current Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500/20 border-2 border-green-500"></div>
                <span>Visited</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

        </div>

        {/* Right Column: Code & Pseudocode Display and Variables */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      </div>
    </div>
  );
};
