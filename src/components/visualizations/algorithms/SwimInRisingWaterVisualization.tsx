import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info, CheckCircle2, Navigation, Layers, Waves } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  grid: number[][];
  visited: string[];
  heap: [number, number, number][];
  t: number | null;
  r: number | null;
  c: number | null;
  activeCell: [number, number] | null;
  neighborCell: [number, number] | null;
  explanation: string;
  isMatch?: boolean;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function swimInWater(grid: number[][]): number {
  const N = grid.length;
  const visited = new Set<string>();
  const minHeap = new MinHeap<[number, number, number]>((a, b) => a[0] - b[0]);
  minHeap.push([grid[0][0], 0, 0]);
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ];
  visited.add("0,0");
  while (minHeap.size() > 0) {
    const [t, r, c] = minHeap.pop();
    if (r === N - 1 && c === N - 1) {
      return t;
    }
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr < 0 ||
        nc < 0 ||
        nr >= N ||
        nc >= N ||
        visited.has(\`\${nr},\${nc}\`)
      ) {
        continue;
      }
      visited.add(\`\${nr},\${nc}\`);
      minHeap.push([
        Math.max(t, grid[nr][nc]),
        nr,
        nc
      ]);
    }
  }
  return -1;
}`,
  python: `import heapq

def swimInWater(grid: list[list[int]]) -> int:
    N = len(grid)
    min_heap = []
    heapq.heappush(min_heap, (grid[0][0], 0, 0))
    visited = set()
    visited.add((0, 0))
    directions = [
        (0, 1),
        (0, -1),
        (1, 0),
        (-1, 0)
    ]
    while min_heap:
        t, r, c = heapq.heappop(min_heap)
        if r == N - 1 and c == N - 1:
            return t
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (
                0 <= nr < N and
                0 <= nc < N and
                (nr, nc) not in visited
            ):
                visited.add((nr, nc))
                new_t = max(t, grid[nr][nc])
                heapq.heappush(min_heap, (new_t, nr, nc))
    return -1`,
  java: `public static class Solution {
    public int swimInWater(int[][] grid) {
        int N = grid.length;
        PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        boolean[][] visited = new boolean[N][N];
        minHeap.offer(new int[]{grid[0][0], 0, 0});
        visited[0][0] = true;
        int[][] directions = {
            {0, 1}, {0, -1}, {1, 0}, {-1, 0}
        };
        while (!minHeap.isEmpty()) {
            int[] current = minHeap.poll();
            int t = current[0];
            int r = current[1];
            int c = current[2];
            if (r == N - 1 && c == N - 1) {
                return t;
            }
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];
                if (nr >= 0 && nr < N && nc >= 0 && nc < N && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    minHeap.offer(new int[]{Math.max(t, grid[nr][nc]), nr, nc});
                }
            }
        }
        return -1;
    }
}`,
  cpp: `class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int N = grid.size();
        priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<tuple<int, int, int>>> minHeap;
        vector<vector<bool>> visited(N, vector<bool>(N, false));
        vector<vector<int>> directions = {
            {0, 1},
            {0, -1},
            {1, 0},
            {-1, 0}
        };
        minHeap.push({grid[0][0], 0, 0});
        visited[0][0] = true;
        while (!minHeap.empty()) {
            auto [t, r, c] = minHeap.top();
            minHeap.pop();
            if (r == N - 1 && c == N - 1) {
                return t;
            }
            for (const auto& dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];
                if (nr < 0 || nc < 0 || nr >= N || nc >= N || visited[nr][nc]) {
                    continue;
                }
                visited[nr][nc] = true;
                int newTime = max(t, grid[nr][nc]);
                minHeap.push({newTime, nr, nc});
            }
        }
        return -1;
    }
};`
};

export const SwimInRisingWaterVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const grid = useMemo(() => [
    [0, 1, 3],
    [2, 4, 8],
    [9, 7, 6]
  ], []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const N = 3;

    const getVariables = (t: number | null, r: number | null, c: number | null, visited: string[], heap: [number, number, number][]) => {
      return {
        N: 3,
        current_time_t: t !== null ? t : 'N/A',
        current_r: r !== null ? r : 'N/A',
        current_c: c !== null ? c : 'N/A',
        visited_size: visited.length,
        heap_size: heap.length
      };
    };

    const pushStep = (
      ts: number, py: number, jv: number, cp: number,
      explanation: string,
      pseudo: string,
      currentVisited: string[],
      currentHeap: [number, number, number][],
      t: number | null, r: number | null, c: number | null,
      activeCell: [number, number] | null,
      neighborCell: [number, number] | null,
      isMatch = false
    ) => {
      s.push({
        grid,
        visited: [...currentVisited],
        heap: [...currentHeap],
        t, r, c,
        activeCell,
        neighborCell,
        explanation,
        isMatch,
        pseudoStep: pseudo,
        variables: getVariables(t, r, c, currentVisited, currentHeap)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      1, 3, 2, 3,
      "We start at the top-left corner [0, 0] with elevation 0. We want to swim to the bottom-right corner [2, 2] in minimum time (i.e. minimal water elevation).",
      "swimInWater(grid)",
      [], [], null, null, null, null, null
    );

    pushStep(
      2, 4, 3, 4,
      "Initialize variables: grid size N = 3, and a `visited` set to keep track of coordinate cells we add to the heap.",
      "N = len(grid), visited = set()",
      [], [], null, null, null, null, null
    );

    pushStep(
      4, 5, 4, 5,
      "Initialize the Min-Heap and push the starting cell [0, 0] with its elevation grid[0][0] = 0.",
      "min_heap = [], heapq.heappush(min_heap, (grid[0][0], 0, 0))",
      [], [[0, 0, 0]], null, null, null, null, null
    );

    const visited = ["0,0"];
    let heap: [number, number, number][] = [[0, 0, 0]];
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0]
    ];

    pushStep(
      12, 8, 7, 14,
      "Define 4-directional move offsets (Right, Left, Down, Up) and add the starting position '0,0' to visited.",
      "visited.add((0, 0))",
      visited, heap, null, null, null, null, null
    );

    while (heap.length > 0) {
      pushStep(
        13, 15, 11, 15,
        `Check loop condition: minHeap.size() (${heap.length}) > 0. We enter/continue the loop.`,
        `WHILE min_heap  →  ${heap.length} > 0`,
        visited, heap, null, null, null, null, null
      );

      heap.sort((a, b) => a[0] - b[0]);
      const [currT, currR, currC] = heap.shift()!;

      pushStep(
        14, 16, 12, 16,
        `Pop the node with the lowest water level/time from the Min-Heap: [t=${currT}, r=${currR}, c=${currC}].`,
        `t, r, c = heapq.heappop(min_heap)  →  [t=${currT}, r=${currR}, c=${currC}]`,
        visited, heap, currT, currR, currC, [currR, currC], null
      );

      pushStep(
        15, 17, 16, 18,
        `Check if we reached the bottom-right corner [2, 2]: r=${currR}, c=${currC}. ` +
          (currR === N - 1 && currC === N - 1 ? "Yes! Destination reached." : "No, continue checking neighbors."),
        `IF r == N - 1 AND c == N - 1  →  ${currR} == 2 AND ${currC} == 2`,
        visited, heap, currT, currR, currC, [currR, currC], null
      );

      if (currR === N - 1 && currC === N - 1) {
        pushStep(
          16, 18, 17, 19,
          `Since we reached [2, 2], the minimum water level/time required is t = ${currT}. We return this value.`,
          `RETURN t  →  ${currT}`,
          visited, heap, currT, currR, currC, [currR, currC], null,
          true
        );
        break;
      }

      for (const [dr, dc] of directions) {
        const nr = currR + dr;
        const nc = currC + dc;

        let dirName = "";
        if (dr === 0 && dc === 1) dirName = "Right";
        if (dr === 0 && dc === -1) dirName = "Left";
        if (dr === 1 && dc === 0) dirName = "Down";
        if (dr === -1 && dc === 0) dirName = "Up";

        const outOfBounds = nr < 0 || nc < 0 || nr >= N || nc >= N;
        const isVisited = !outOfBounds && visited.includes(`${nr},${nc}`);

        pushStep(
          21, 20, 19, 21,
          `Inspect adjacent neighbor to the ${dirName} at [${nr}, ${nc}]. ` +
            (outOfBounds ? "It is out of bounds, skipping." :
             isVisited ? "It has already been visited/added to heap, skipping." :
             `It is in bounds and unvisited (elevation ${grid[nr][nc]}). We will visit it.`),
          `// Inspect neighbor at [${nr}, ${nc}]`,
          visited, heap, currT, currR, currC, [currR, currC], outOfBounds ? null : [nr, nc]
        );

        if (!outOfBounds && !isVisited) {
          visited.push(`${nr},${nc}`);
          const newT = Math.max(currT, grid[nr][nc]);
          heap.push([newT, nr, nc]);

          pushStep(
            30, 26, 23, 27,
            `Mark [${nr}, ${nc}] as visited. Push it onto the heap with calculated time = max(t=${currT}, grid[${nr}][${nc}]=${grid[nr][nc]}) = ${newT}.`,
            `visited.add((${nr}, ${nc})), heapq.heappush(min_heap, (${newT}, ${nr}, ${nc}))`,
            visited, heap, currT, currR, currC, [currR, currC], [nr, nc],
            true
          );
        }
      }
    }

    return { steps: s, stepLineNumbers: lines };
  }, [grid]);

  const step = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  return (
    <div className="space-y-6">
      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 relative overflow-hidden min-h-[420px] flex flex-col shadow-lg">
              <h3 className="text-sm font-semibold mb-6 flex items-center justify-center gap-2 text-muted-foreground uppercase tracking-widest">
                <Waves className="w-4 h-4 text-blue-500 animate-pulse" /> Swim in Rising Water
              </h3>

              {/* Grid Visualization */}
              <div className="flex-1 flex justify-center items-center py-4">
                <div className="flex flex-col gap-3 p-6 bg-muted/10 border border-border/50 rounded-2xl relative">
                  {grid.map((row, r) => (
                    <div key={r} className="flex gap-3 justify-center">
                      {row.map((elevation, c) => {
                        const isVisited = step.visited.includes(`${r},${c}`);
                        const isActive = step.activeCell && step.activeCell[0] === r && step.activeCell[1] === c;
                        const isNeighbor = step.neighborCell && step.neighborCell[0] === r && step.neighborCell[1] === c;

                        return (
                          <div key={c} className="flex flex-col items-center">
                            <div
                              className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border transition-all duration-150 relative select-none ${
                                isActive
                                  ? 'scale-110 shadow-2xl ring-4 ring-yellow-400 border-yellow-500 z-20 bg-yellow-500/10'
                                  : isNeighbor
                                  ? 'scale-105 shadow-lg ring-4 ring-orange-500 border-orange-500 z-10'
                                  : isVisited
                                  ? 'bg-blue-500/20 dark:bg-blue-600/25 border-blue-400/50 text-blue-600 dark:text-blue-400 shadow-inner'
                                  : 'bg-neutral-850 dark:bg-neutral-900 border-neutral-700/80 text-neutral-300'
                              }`}
                            >
                              {/* Water backdrop graphic for visited */}
                              {isVisited && !isActive && !isNeighbor && (
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-blue-500/10 to-transparent rounded-b-xl" />
                              )}

                              {/* Active swimmer icon */}
                              {isActive && (
                                <Navigation className="w-4 h-4 text-yellow-500 rotate-45 mb-0.5 animate-bounce" />
                              )}

                              <span className="text-lg font-bold font-mono">
                                {elevation}
                              </span>

                              {/* Coordinate Label */}
                              <span className="absolute bottom-1 right-1 text-[8px] font-mono opacity-50">
                                {r},{c}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heap visual tracker */}
              <div className="mt-4 space-y-2 border-t border-border/40 pt-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Min-Heap Priority Queue (Sorted)
                </span>
                <div className="w-full bg-muted/30 border border-border/50 rounded-xl p-3.5 min-h-[64px] flex items-center gap-2 overflow-x-auto">
                  {step.heap.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic mx-auto">Heap is Empty</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground/70 shrink-0">Min</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                      {[...step.heap].sort((a, b) => a[0] - b[0]).map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col items-center font-mono text-xs px-2.5 py-1.5 rounded-lg border shadow-sm transition-all shrink-0 ${
                            idx === 0
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/25 ring-2 ring-blue-500/20'
                              : 'bg-card text-foreground border-border'
                          }`}
                        >
                          <span className="font-bold text-xs">t: {item[0]}</span>
                          <span className="text-[9px] text-muted-foreground">[{item[1]}, {item[2]}]</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-4 gap-1.5 mt-6">
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-[10px] text-neutral-300 font-semibold justify-center">
                  <div className="w-2.5 h-2.5 rounded bg-neutral-750"></div> Elevated
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-[10px] text-blue-500 font-semibold justify-center">
                  <div className="w-2.5 h-2.5 rounded bg-blue-500/50"></div> Visited
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-600 font-semibold justify-center">
                  <Navigation className="w-2.5 h-2.5 text-yellow-500 rotate-45" /> Active
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-600 font-semibold justify-center">
                  <div className="w-2.5 h-2.5 rounded bg-orange-500"></div> Neighbor
                </div>
              </div>
            </Card>

            {/* Commentary Box */}
            <Card className={`p-4 border-l-4 transition-all duration-300 shadow-sm min-h-[70px] flex items-center ${step.isMatch ? 'bg-primary/10 border-primary' : 'bg-primary/5 border-primary/20'}`}>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Narrative
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90">
                    {step.explanation}
                  </p>
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
            onLanguageChange={() => setCurrentStepIndex(0)}
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
    </div>
  );
};

// Arrow helper icon
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default SwimInRisingWaterVisualization;
