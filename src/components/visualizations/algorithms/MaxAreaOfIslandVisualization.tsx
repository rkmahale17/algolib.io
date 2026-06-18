import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info, CheckCircle2, Map, Waves, Trees } from 'lucide-react';

interface SimStep {
  r: number | null;
  c: number | null;
  visited: string[];
  maxArea: number;
  currentIslandArea: number;
  message: string;
  lineNumber: number;
  isMatch?: boolean;
  dfsStack: { r: number; c: number }[];
  activeCell: { r: number; c: number } | null;
  neighborExploration: { r: number; c: number; dir: string } | null;
  grid: number[][];
}

export const MaxAreaOfIslandVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const grid = useMemo(() => [
    [0, 1, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 0, 0]
  ], []);

  const code = `function maxAreaOfIsland(grid: number[][]): number {
    const ROWS = grid.length;
    const COLS = grid[0].length;
    const visited = new Set<string>();

    function dfs(r: number, c: number): number {
        if (
            r < 0 ||
            r >= ROWS ||
            c < 0 ||
            c >= COLS ||
            grid[r][c] === 0 ||
            visited.has(\`\${r},\${c}\`)
        ) {
            return 0;
        }

        visited.add(\`\${r},\${c}\`);

        return (
            1 +
            dfs(r + 1, c) +
            dfs(r - 1, c) +
            dfs(r, c + 1) +
            dfs(r, c - 1)
        );
    }

    let area = 0;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            area = Math.max(area, dfs(r, c));
        }
    }

    return area;
}`;

  const steps = useMemo(() => {
    const s: SimStep[] = [];
    const visited = new Set<string>();
    let maxArea = 0;
    const ROWS = grid.length;
    const COLS = grid[0].length;
    let dfsStack: { r: number; c: number }[] = [];
    let currentIslandVisitedStart = 0;

    const record = (line: number, msg: string, options: Partial<SimStep> = {}) => {
      s.push({
        r: options.r !== undefined ? options.r : (dfsStack.length > 0 ? dfsStack[dfsStack.length - 1].r : null),
        c: options.c !== undefined ? options.c : (dfsStack.length > 0 ? dfsStack[dfsStack.length - 1].c : null),
        visited: Array.from(visited),
        maxArea,
        currentIslandArea: options.currentIslandArea ?? (visited.size - currentIslandVisitedStart),
        message: msg,
        lineNumber: line,
        isMatch: options.isMatch || false,
        dfsStack: [...dfsStack],
        activeCell: options.activeCell !== undefined ? options.activeCell : (dfsStack.length > 0 ? dfsStack[dfsStack.length - 1] : null),
        neighborExploration: options.neighborExploration || null,
        grid: grid.map(row => [...row])
      });
    };

    record(2, "Initialize matrix row count: ROWS = 4.", { currentIslandArea: 0 });
    record(3, "Initialize matrix column count: COLS = 4.", { currentIslandArea: 0 });
    record(4, "Initialize visited Set to keep track of explored cells.", { currentIslandArea: 0 });

    function dfs(r: number, c: number, fromDir?: string): number {
      const activeCell = { r, c };
      dfsStack.push(activeCell);

      const dirMsg = fromDir ? ` (explored from ${fromDir})` : "";
      record(7, `DFS entry check for cell (${r}, ${c})${dirMsg}. Checking boundaries, water, and visited status.`, {
        activeCell
      });

      if (
        r < 0 ||
        r >= ROWS ||
        c < 0 ||
        c >= COLS
      ) {
        let outReason = "";
        if (r < 0) outReason = "r < 0 (above grid)";
        else if (r >= ROWS) outReason = `r >= ROWS (below grid)`;
        else if (c < 0) outReason = "c < 0 (left of grid)";
        else if (c >= COLS) outReason = `c >= COLS (right of grid)`;

        record(15, `Cell (${r}, ${c}) is out of bounds [${outReason}]. Return 0.`, {
          activeCell
        });
        dfsStack.pop();
        return 0;
      }

      if (grid[r][c] === 0) {
        record(15, `Cell (${r}, ${c}) is water (0). Return 0.`, {
          activeCell
        });
        dfsStack.pop();
        return 0;
      }

      if (visited.has(`${r},${c}`)) {
        record(15, `Cell (${r}, ${c}) has already been visited. Return 0.`, {
          activeCell
        });
        dfsStack.pop();
        return 0;
      }

      visited.add(`${r},${c}`);
      record(18, `Cell (${r}, ${c}) is unvisited land. Marking as visited.`, {
        activeCell,
        isMatch: true
      });

      record(20, `Summing area of island starting at (${r}, ${c}): 1 + neighbors.`, {
        activeCell
      });

      record(22, `Recurse South: dfs(${r + 1}, ${c}) from (${r}, ${c}).`, {
        activeCell,
        neighborExploration: { r: r + 1, c, dir: "South" }
      });
      const down = dfs(r + 1, c, "North");

      record(23, `Recurse North: dfs(${r - 1}, ${c}) from (${r}, ${c}).`, {
        activeCell,
        neighborExploration: { r: r - 1, c, dir: "North" }
      });
      const up = dfs(r - 1, c, "South");

      record(24, `Recurse East: dfs(${r}, ${c + 1}) from (${r}, ${c}).`, {
        activeCell,
        neighborExploration: { r, c: c + 1, dir: "East" }
      });
      const right = dfs(r, c + 1, "West");

      record(25, `Recurse West: dfs(${r}, ${c - 1}) from (${r}, ${c}).`, {
        activeCell,
        neighborExploration: { r, c: c - 1, dir: "West" }
      });
      const left = dfs(r, c - 1, "East");

      const total = 1 + down + up + right + left;
      record(26, `Calculated area for sub-tree at (${r}, ${c}): 1 + ${down} (S) + ${up} (N) + ${right} (E) + ${left} (W) = ${total}.`, {
        activeCell
      });

      dfsStack.pop();
      return total;
    }

    record(29, "Initialize global maximum area to 0.", { currentIslandArea: 0 });

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const isVisited = visited.has(`${r},${c}`);
        const isLand = grid[r][c] === 1;

        record(31, `Outer loop scan: checking cell (${r}, ${c}).`, {
          r, c,
          activeCell: { r, c },
          currentIslandArea: 0
        });

        if (isLand && !isVisited) {
          currentIslandVisitedStart = visited.size;
          record(33, `Unvisited land found at (${r}, ${c}). Initiating DFS search.`, {
            r, c,
            activeCell: { r, c },
            isMatch: true,
            currentIslandArea: 0
          });

          const islandArea = dfs(r, c);
          const oldMax = maxArea;
          maxArea = Math.max(maxArea, islandArea);

          record(33, `DFS completed for island starting at (${r}, ${c}). Area is ${islandArea}. Updating global max area: max(${oldMax}, ${islandArea}) = ${maxArea}.`, {
            r, c,
            activeCell: { r, c },
            isMatch: true,
            currentIslandArea: islandArea
          });
        } else {
          let skipReason = isVisited ? "already visited land" : "water cell";
          record(32, `Skipping cell (${r}, ${c}) because it is a ${skipReason}.`, {
            r, c,
            activeCell: { r, c },
            currentIslandArea: 0
          });
        }
      }
    }

    record(37, `Scan completed. Returning final maximum island area: ${maxArea}.`, {
      r: null, c: null,
      activeCell: null,
      currentIslandArea: 0,
      isMatch: true
    });

    return s;
  }, [grid]);

  const step = steps[currentStep] || steps[0];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          {/* Visual Grid Container */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[420px] flex flex-col shadow-lg shadow-primary/5">
            <h3 className="text-sm font-semibold mb-6 flex items-center justify-center gap-2 text-muted-foreground uppercase tracking-widest">
              <Map className="w-4 h-4 text-emerald-500" /> Max Area of Island Grid
            </h3>

            {/* Grid with Axis Labels */}
            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col items-center">
                {/* Column Labels */}
                <div className="flex gap-3 pl-8 mb-2">
                  {[0, 1, 2, 3].map(colIdx => (
                    <div key={colIdx} className="w-14 text-center text-xs font-mono font-semibold text-muted-foreground/60">
                      c={colIdx}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {[0, 1, 2, 3].map(rowIdx => (
                    <div key={rowIdx} className="flex items-center gap-3">
                      {/* Row Label */}
                      <div className="w-5 text-right text-xs font-mono font-semibold text-muted-foreground/60 mr-1">
                        r={rowIdx}
                      </div>
                      
                      {/* Cells */}
                      <div className="flex gap-3">
                        {[0, 1, 2, 3].map(colIdx => {
                          const val = grid[rowIdx][colIdx];
                          const cellStr = `${rowIdx},${colIdx}`;
                          
                          const isVisited = step.visited.includes(cellStr);
                          const isActive = step.activeCell && step.activeCell.r === rowIdx && step.activeCell.c === colIdx;
                          const isNeighborCheck = step.neighborExploration && step.neighborExploration.r === rowIdx && step.neighborExploration.c === colIdx;

                          let cellClasses = "";
                          if (isActive) {
                            cellClasses = "bg-amber-500/30 border-amber-500 text-amber-800 dark:text-amber-300 scale-110 shadow-lg ring-2 ring-amber-500 ring-offset-2 ring-offset-background z-10";
                          } else if (isNeighborCheck) {
                            cellClasses = "bg-sky-500/20 border-sky-400 text-sky-700 dark:text-sky-300 scale-105 animate-pulse z-10";
                          } else if (isVisited) {
                            cellClasses = "bg-violet-500/25 border-violet-500/50 text-violet-800 dark:text-violet-200";
                          } else if (val === 1) {
                            cellClasses = "bg-emerald-500/20 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-500/30";
                          } else {
                            cellClasses = "bg-blue-500/5 border-blue-500/10 text-blue-900/20 dark:text-blue-300/20";
                          }

                          return (
                            <div
                              key={colIdx}
                              className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg border-2 transition-all duration-200 ${cellClasses}`}
                            >
                              {val}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[11px] font-medium text-blue-900/60 dark:text-blue-300/60">
                 <Waves className="w-3.5 h-3.5 text-blue-500/60" /> Water (0)
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                 <Trees className="w-3.5 h-3.5 text-emerald-500" /> Land (1)
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[11px] font-medium text-violet-700 dark:text-violet-300">
                 <div className="w-3 h-3 rounded-full bg-violet-500/60" /> Visited Land
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                 <div className="w-3 h-3 rounded-full bg-amber-500/60 animate-ping" /> Active Cell
              </div>
            </div>
          </Card>

          {/* DFS Call Stack Visualizer */}
          <Card className="p-4 bg-card/40 border-primary/10 shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> DFS Call Stack
            </h4>
            <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/20 border border-border/50 rounded-xl min-h-[52px]">
              {step.dfsStack.length === 0 ? (
                <span className="text-xs text-muted-foreground italic font-medium">Stack is empty (no active DFS recursion)</span>
              ) : (
                step.dfsStack.map((frame, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-muted-foreground/30 text-sm font-bold">➔</span>}
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border shadow-sm transition-all duration-200 ${
                      idx === step.dfsStack.length - 1 
                        ? 'bg-amber-500/25 border-amber-500 text-amber-700 dark:text-amber-300 scale-105' 
                        : 'bg-background border-border text-foreground/70'
                    }`}>
                      dfs({frame.r}, {frame.c})
                    </div>
                  </React.Fragment>
                ))
              )}
            </div>
          </Card>

          {/* Commentary Box */}
          <Card className={`p-5 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm min-h-[110px] flex items-center ${
            step.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/40 border-primary/40'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl shrink-0 ${step.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/15 text-primary'}`}>
                {step.isMatch ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Logic
                </h4>
                <p className="text-[14px] font-medium leading-relaxed text-foreground/90">
                  {step.message}
                </p>
              </div>
            </div>
          </Card>

          {/* Variable Panel - Placed below Commentary Box */}
          <VariablePanel
            variables={{
              'Current Row (r)': step.r !== null ? `${step.r}` : 'N/A',
              'Current Col (c)': step.c !== null ? `${step.c}` : 'N/A',
              'Visited Set Size': `${step.visited.length}`,
              'Current Island Area': `${step.currentIslandArea}`,
              'Maximum Area (maxArea)': `${step.maxArea}`
            }}
          />
        </div>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          highlightedLines={[step.lineNumber]}
          language="typescript"
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
