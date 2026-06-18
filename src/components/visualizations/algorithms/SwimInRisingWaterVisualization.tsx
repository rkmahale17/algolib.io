import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info, CheckCircle2, Navigation, Layers, Compass, Waves } from 'lucide-react';

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
  lineExecution: string;
  highlightedLines: number[];
  isMatch?: boolean;
}

export const SwimInRisingWaterVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function swimInWater(grid: number[][]): number {
    const N = grid.length;
    const visited = new Set<string>();

    const minHeap = new MinHeap();
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
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const grid = [
      [0, 1, 3],
      [2, 4, 8],
      [9, 7, 6]
    ];
    const N = grid.length;

    s.push({
      grid,
      visited: [],
      heap: [],
      t: null, r: null, c: null,
      activeCell: null,
      neighborCell: null,
      explanation: "We start at the top-left corner [0, 0] with elevation 0. We want to swim to the bottom-right corner [2, 2] in minimum time (i.e. minimal water elevation).",
      lineExecution: "function swimInWater(grid: number[][]): number {",
      highlightedLines: [1]
    });

    s.push({
      grid,
      visited: [],
      heap: [],
      t: null, r: null, c: null,
      activeCell: null,
      neighborCell: null,
      explanation: "Initialize variables: grid size N = 3, and a `visited` set to keep track of coordinate cells we add to the heap.",
      lineExecution: "const N = grid.length;\nconst visited = new Set<string>();",
      highlightedLines: [2, 3]
    });

    s.push({
      grid,
      visited: [],
      heap: [[grid[0][0], 0, 0]],
      t: null, r: null, c: null,
      activeCell: null,
      neighborCell: null,
      explanation: "Initialize the Min-Heap and push the starting cell [0, 0] with its elevation grid[0][0] = 0.",
      lineExecution: "const minHeap = new MinHeap();\nminHeap.push([grid[0][0], 0, 0]);",
      highlightedLines: [5, 6]
    });

    s.push({
      grid,
      visited: ["0,0"],
      heap: [[0, 0, 0]],
      t: null, r: null, c: null,
      activeCell: null,
      neighborCell: null,
      explanation: "Define 4-directional move offsets (Right, Left, Down, Up) and add the starting position '0,0' to visited.",
      lineExecution: "const directions = [ [0,1], [0,-1], [1,0], [-1,0] ];\nvisited.add(\"0,0\");",
      highlightedLines: [8, 9, 10, 11, 12, 13, 15]
    });

    // Dijkstra variables simulation trace
    const visited = ["0,0"];
    // heap items: [t, r, c]
    let heap: [number, number, number][] = [[0, 0, 0]];
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0]
    ];

    while (heap.length > 0) {
      s.push({
        grid,
        visited: [...visited],
        heap: [...heap],
        t: null, r: null, c: null,
        activeCell: null,
        neighborCell: null,
        explanation: `Check loop condition: minHeap.size() (${heap.length}) > 0. We enter/continue the loop.`,
        lineExecution: "while (minHeap.size() > 0) {",
        highlightedLines: [17]
      });

      // Sort heap to mimic MinHeap pop behavior
      heap.sort((a, b) => a[0] - b[0]);
      const [currT, currR, currC] = heap.shift()!;

      s.push({
        grid,
        visited: [...visited],
        heap: [...heap],
        t: currT, r: currR, c: currC,
        activeCell: [currR, currC],
        neighborCell: null,
        explanation: `Pop the node with the lowest water level/time from the Min-Heap: [t=${currT}, r=${currR}, c=${currC}].`,
        lineExecution: "const [t, r, c] = minHeap.pop();",
        highlightedLines: [18]
      });

      s.push({
        grid,
        visited: [...visited],
        heap: [...heap],
        t: currT, r: currR, c: currC,
        activeCell: [currR, currC],
        neighborCell: null,
        explanation: `Check if we reached the bottom-right corner [2, 2]: r=${currR}, c=${currC}. ` +
          (currR === N - 1 && currC === N - 1 ? "Yes! Destination reached." : "No, continue checking neighbors."),
        lineExecution: "if (r === N - 1 && c === N - 1) { return t; }",
        highlightedLines: [20, 21, 22]
      });

      if (currR === N - 1 && currC === N - 1) {
        s.push({
          grid,
          visited: [...visited],
          heap: [...heap],
          t: currT, r: currR, c: currC,
          activeCell: [currR, currC],
          neighborCell: null,
          explanation: `Since we reached [2, 2], the minimum water level/time required is t = ${currT}. We return this value.`,
          lineExecution: "return t;",
          highlightedLines: [21],
          isMatch: true
        });
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

        s.push({
          grid,
          visited: [...visited],
          heap: [...heap],
          t: currT, r: currR, c: currC,
          activeCell: [currR, currC],
          neighborCell: outOfBounds ? null : [nr, nc],
          explanation: `Inspect adjacent neighbor to the ${dirName} at [${nr}, ${nc}]. ` +
            (outOfBounds ? "It is out of bounds, skipping." :
             isVisited ? "It has already been visited/added to heap, skipping." :
             `It is in bounds and unvisited (elevation ${grid[nr][nc]}). We will visit it.`),
          lineExecution: "if (nr < 0 || nc < 0 || nr >= N || nc >= N || visited.has(`${nr},${nc}`)) { continue; }",
          highlightedLines: [28, 29, 30, 31, 32, 33, 34, 35, 36]
        });

        if (!outOfBounds && !isVisited) {
          visited.push(`${nr},${nc}`);
          const newT = Math.max(currT, grid[nr][nc]);
          heap.push([newT, nr, nc]);

          s.push({
            grid,
            visited: [...visited],
            heap: [...heap],
            t: currT, r: currR, c: currC,
            activeCell: [currR, currC],
            neighborCell: [nr, nc],
            explanation: `Mark [${nr}, ${nc}] as visited. Push it onto the heap with calculated time = max(t=${currT}, grid[${nr}][${nc}]=${grid[nr][nc]}) = ${newT}.`,
            lineExecution: "visited.add(`${nr},${nc}`);\nminHeap.push([ Math.max(t, grid[nr][nc]), nr, nc ]);",
            highlightedLines: [38, 39, 40, 41, 42, 43],
            isMatch: true
          });
        }
      }
    }

    return s;
  }, []);

  const step = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[420px] flex flex-col shadow-lg shadow-primary/5">
            <h3 className="text-sm font-semibold mb-6 flex items-center justify-center gap-2 text-muted-foreground uppercase tracking-widest">
              <Waves className="w-4 h-4 text-blue-500 animate-pulse" /> Swim in Rising Water
            </h3>

            {/* Grid Visualization */}
            <div className="flex-1 flex justify-center items-center py-4">
              <div className="flex flex-col gap-3 p-6 bg-muted/10 border border-border/50 rounded-2xl relative">
                {step.grid.map((row, r) => (
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
                                : 'bg-neutral-800 dark:bg-neutral-900 border-neutral-700/80 text-neutral-300'
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
                <div className="w-2.5 h-2.5 rounded bg-neutral-700"></div> Elevated
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

          {/* Commentary Box - Positioned at the bottom (Rule 13) */}
          <Card className={`p-5 border-l-4 transition-all duration-150 shadow-sm min-h-[90px] flex items-center ${step.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl shrink-0 ${step.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                {step.isMatch ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Narrative
                </h4>
                <p className="text-xs font-semibold leading-relaxed text-foreground/90">
                  {step.explanation}
                </p>
              </div>
            </div>
          </Card>

          {/* VariablePanel - Positioned below commentary box (Rule 13) */}
          <VariablePanel
            variables={{
              N: 3,
              current_time_t: step.t !== null ? step.t : 'N/A',
              current_r: step.r !== null ? step.r : 'N/A',
              current_c: step.c !== null ? step.c : 'N/A',
              visited_size: step.visited.length,
              heap_size: step.heap.length
            }}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={step.highlightedLines}
            language="typescript"
          />
        </div>
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

// Arrow helper icon
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
