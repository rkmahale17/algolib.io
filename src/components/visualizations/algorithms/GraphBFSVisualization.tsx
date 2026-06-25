import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { GraphDiagram } from '../GraphDiagram';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  currentNode: number | null;
  activeNeighbor: number | null;
  visited: number[];
  queue: number[];
  result: number[];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function bfs(graph: number[][], start: number): number[] {
    const visited = new Set<number>();
    const queue: number[] = [start];
    const result: number[] = [];
    visited.add(start);
    while (queue.length > 0) {
        const node = queue.shift()!;
        result.push(node);
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    return result;
}`,
  python: `def bfs(graph: list[list[int]], start: int) -> list[int]:
    visited = set()
    queue = [start]
    result = []
    visited.add(start)
    while queue:
        node = queue.pop(0)
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result`,
  java: `class Solution {
    public List<Integer> bfs(List<List<Integer>> graph, int start) {
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        List<Integer> result = new ArrayList<>();
        visited.add(start);
        queue.offer(start);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);
            for (int neighbor : graph.get(node)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
        return result;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> bfs(vector<vector<int>>& graph, int start) {
        unordered_set<int> visited;
        queue<int> q;
        vector<int> result;
        visited.insert(start);
        q.push(start);
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            result.push_back(node);
            for (int neighbor : graph[node]) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    q.push(neighbor);
                }
            }
        }
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
  const queue: number[] = [];
  const result: number[] = [];

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
      activeNeighbor: neighbor,
      visited: Array.from(visited),
      queue: [...queue],
      result: [...result],
      explanation: msg,
      pseudoStep: pseudo,
      variables: {
        node: current !== null ? String(current) : '-',
        neighbor: neighbor !== null ? String(neighbor) : 'none',
        visited: `{${Array.from(visited).join(', ')}}`,
        queue: `[${queue.join(', ')}]`,
        result: `[${result.join(', ')}]`
      }
    });
    addLines(ts, py, java, cpp);
  };

  // Init
  pushStep('Initialize visited set.', 'SET visited = {}', 2, 2, 3, 5, null);
  queue.push(0);
  pushStep('Initialize queue with starting node 0.', 'SET queue = [0]', 3, 3, 4, 6, null);
  pushStep('Initialize empty result array.', 'SET result = []', 4, 4, 5, 7, null);

  visited.add(0);
  pushStep('Mark starting node 0 as visited.', 'visited.add(0)', 5, 5, 6, 8, null);

  while (queue.length > 0) {
    pushStep('Check if queue is not empty.', 'WHILE queue IS NOT EMPTY', 6, 6, 8, 10, null);

    const node = queue.shift()!;
    pushStep(`Dequeue node ${node} to process.`, `SET node = dequeue(queue)  →  ${node}`, 7, 7, 9, 11, node);

    result.push(node);
    pushStep(`Add node ${node} to result array.`, `result.push(${node})`, 8, 8, 10, 12, node);

    const neighbors = graph[node] || [];
    pushStep(`Iterate neighbors of node ${node}: [${neighbors.join(', ')}].`, `FOR neighbor IN neighbors of ${node}`, 9, 9, 11, 13, node);

    for (const neighbor of neighbors) {
      pushStep(`Check if neighbor ${neighbor} is visited.`, `IF neighbor ${neighbor} NOT IN visited`, 10, 10, 12, 14, node, neighbor);

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        pushStep(`Neighbor ${neighbor} not visited. Mark as visited.`, `visited.add(${neighbor})`, 11, 11, 13, 15, node, neighbor);

        queue.push(neighbor);
        pushStep(`Push neighbor ${neighbor} to queue.`, `queue.push(${neighbor})`, 12, 12, 14, 16, node, neighbor);
      } else {
        pushStep(`Neighbor ${neighbor} already visited. Skip.`, `SKIP neighbor ${neighbor}`, 10, 10, 12, 14, node, neighbor);
      }
    }
  }

  pushStep(`BFS traversal complete! Return final order: [${result.join(', ')}].`, `RETURN result  →  [${result.join(', ')}]`, 16, 16, 18, 20, null);

  return { steps, stepLineNumbers };
}

export const GraphBFSVisualization = () => {
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

          <VariablePanel variables={currentStep.variables} />
        </div>

        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
