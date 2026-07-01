import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info, CheckCircle2, Clock, Inbox, ArrowRight } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  grid: number[][];
  queue: [number, number][];
  fresh: number;
  time: number;
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
  typescript: `function orangesRotting(grid: number[][]): number {
  const queue: [number, number][] = [];
  let fresh = 0;
  let time = 0;
  const ROWS = grid.length;
  const COLS = grid[0].length;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === 1) {
        fresh++;
      } else if (grid[r][c] === 2) {
        queue.push([r, c]);
      }
    }
  }
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ];
  while (queue.length > 0 && fresh > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of directions) {
        const row = r + dr;
        const col = c + dc;
        if (
          row < 0 ||
          row >= ROWS ||
          col < 0 ||
          col >= COLS ||
          grid[row][col] !== 1
        ) {
          continue;
        }
        grid[row][col] = 2;
        queue.push([row, col]);
        fresh--;
      }
    }
    time++;
  }
  return fresh === 0 ? time : -1;
}`,
  python: `from collections import deque

def orangesRotting(grid: list[list[int]]) -> int:
    queue = deque()
    fresh = 0
    time = 0
    ROWS = len(grid)
    COLS = len(grid[0])
    for r in range(ROWS):
        for c in range(COLS):
            if grid[r][c] == 1:
                fresh += 1
            elif grid[r][c] == 2:
                queue.append((r, c))
    directions = [
        (0, 1),
        (0, -1),
        (1, 0),
        (-1, 0),
    ]
    while queue and fresh > 0:
        size = len(queue)
        for _ in range(size):
            r, c = queue.popleft()
            for dr, dc in directions:
                row, col = r + dr, c + dc
                if (
                    0 <= row < ROWS and
                    0 <= col < COLS and
                    grid[row][col] == 1
                ):
                    grid[row][col] = 2
                    queue.append((row, col))
                    fresh -= 1
        time += 1
    return time if fresh == 0 else -1`,
  java: `public static class Solution {
    public int orangesRotting(int[][] grid) {
        Queue<int[]> queue = new LinkedList<>();
        int fresh = 0;
        int time = 0;
        int ROWS = grid.length;
        int COLS = grid[0].length;
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                if (grid[r][c] == 1) {
                    fresh++;
                } else if (grid[r][c] == 2) {
                    queue.add(new int[]{r, c});
                }
            }
        }
        int[][] directions = {
            {0, 1},
            {0, -1},
            {1, 0},
            {-1, 0}
        };
        while (!queue.isEmpty() && fresh > 0) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] current = queue.poll();
                int r = current[0];
                int c = current[1];
                for (int[] dir : directions) {
                    int row = r + dir[0];
                    int col = c + dir[1];
                    if (
                        row < 0 || row >= ROWS ||
                        col < 0 || col >= COLS ||
                        grid[row][col] != 1
                    ) {
                        continue;
                    }
                    grid[row][col] = 2;
                    queue.add(new int[]{row, col});
                    fresh--;
                }
            }
            time++;
        }
        return fresh == 0 ? time : -1;
    }
}`,
  cpp: `class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        queue<pair<int, int>> q;
        int fresh = 0;
        int time = 0;
        int ROWS = grid.size();
        int COLS = grid[0].size();
        for (int r = 0; r < ROWS; ++r) {
            for (int c = 0; c < COLS; ++c) {
                if (grid[r][c] == 1) {
                    fresh++;
                } else if (grid[r][c] == 2) {
                    q.push({r, c});
                }
            }
        }
        vector<vector<int>> directions = {
            {0, 1},
            {0, -1},
            {1, 0},
            {-1, 0}
        };
        while (!q.empty() && fresh > 0) {
            int size = q.size();
            for (int i = 0; i < size; ++i) {
                pair<int, int> current = q.front();
                q.pop();
                int r = current.first;
                int c = current.second;
                for (const auto& dir : directions) {
                    int row = r + dir[0];
                    int col = c + dir[1];
                    if (row >= 0 && row < ROWS && col >= 0 && col < COLS && grid[row][col] == 1) {
                        grid[row][col] = 2;
                        q.push({row, col});
                        fresh--;
                    }
                }
            }
            time++;
        }
        return fresh == 0 ? time : -1;
    }
};`
};

export const RottingOrangesVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const grid = [
      [2, 1, 1],
      [1, 1, 0],
      [0, 1, 1]
    ];
    const ROWS = grid.length;
    const COLS = grid[0].length;

    const getVariables = (r: number | null, c: number | null, fresh: number, time: number, queue: [number, number][]) => {
      return {
        r: r !== null ? r : 'N/A',
        c: c !== null ? c : 'N/A',
        fresh_remaining: fresh,
        time_elapsed: `${time} min`,
        queue_size: queue.length
      };
    };

    const pushStep = (
      explanation: string,
      pseudo: string,
      currentGrid: number[][],
      queue: [number, number][],
      fresh: number,
      time: number,
      r: number | null,
      c: number | null,
      activeCell: [number, number] | null,
      neighborCell: [number, number] | null,
      isMatch = false,
      ts: number, py: number, jv: number, cp: number
    ) => {
      s.push({
        grid: currentGrid.map(row => [...row]),
        queue: [...queue],
        fresh,
        time,
        r,
        c,
        activeCell,
        neighborCell,
        explanation,
        isMatch,
        pseudoStep: pseudo,
        variables: getVariables(r, c, fresh, time, queue)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      "We are given a 3x3 grid. Red oranges are rotten (2), green/orange oranges are fresh (1), and dark cells are empty (0). We start by initializing our state.",
      "orangesRotting(grid)",
      grid, [], 0, 0, null, null, null, null,
      false,
      1, 3, 2, 3
    );

    pushStep(
      "Initialize the BFS queue to hold coordinates of rotten oranges, count of fresh oranges to 0, and elapsed time to 0.",
      "SET queue = [], fresh = 0, time = 0",
      grid, [], 0, 0, null, null, null, null,
      false,
      2, 4, 3, 4
    );

    pushStep(
      "Obtain the dimensions of the grid. Here, ROWS = 3 and COLS = 3.",
      "ROWS = len(grid), COLS = len(grid[0])",
      grid, [], 0, 0, null, null, null, null,
      false,
      5, 7, 6, 7
    );

    let fresh = 0;
    const queue: [number, number][] = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c] === 1) {
          fresh++;
        } else if (grid[r][c] === 2) {
          queue.push([r, c]);
        }
      }
    }

    pushStep(
      `Scan the entire grid. We count ${fresh} fresh oranges and add the rotten orange at [0, 0] to the queue to initiate BFS.`,
      `// Scan grid: count fresh=${fresh}, queue=[[0,0]]`,
      grid, queue, fresh, 0, null, null, null, null,
      false,
      7, 9, 8, 9
    );

    pushStep(
      "Define the 4-directional offsets to represent adjacent cells: Right [0, 1], Left [0, -1], Down [1, 0], and Up [-1, 0].",
      "directions = [(0,1), (0,-1), (1,0), (-1,0)]",
      grid, queue, fresh, 0, null, null, null, null,
      false,
      16, 15, 17, 18
    );

    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0]
    ];

    let time = 0;

    while (queue.length > 0 && fresh > 0) {
      pushStep(
        `Check loop condition: queue length (${queue.length}) > 0 AND fresh count (${fresh}) > 0. Both are true, so BFS proceeds to process this level.`,
        `WHILE queue AND fresh > 0  →  ${queue.length} > 0 AND ${fresh} > 0`,
        grid, queue, fresh, time, null, null, null, null,
        false,
        22, 21, 23, 24
      );

      const size = queue.length;
      pushStep(
        `At the start of this minute, we have size = ${size} rotten orange(s) in the queue. We must process exactly these ${size} orange(s).`,
        `size = len(queue)  →  ${size}`,
        grid, queue, fresh, time, null, null, null, null,
        false,
        23, 22, 24, 25
      );

      for (let i = 0; i < size; i++) {
        const [currR, currC] = queue.shift()!;

        pushStep(
          `Dequeue the next rotten orange at coordinates [${currR}, ${currC}]. We will inspect its 4-directional neighbors.`,
          `r, c = queue.popleft()  →  [${currR}, ${currC}]`,
          grid, queue, fresh, time, currR, currC, [currR, currC], null,
          false,
          25, 24, 26, 27
        );

        for (const [dr, dc] of directions) {
          const nr = currR + dr;
          const nc = currC + dc;
          
          let dirName = "";
          if (dr === 0 && dc === 1) dirName = "Right";
          if (dr === 0 && dc === -1) dirName = "Left";
          if (dr === 1 && dc === 0) dirName = "Down";
          if (dr === -1 && dc === 0) dirName = "Up";

          const outOfBounds = nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS;
          const cellVal = outOfBounds ? null : grid[nr][nc];
          const isFresh = cellVal === 1;

          pushStep(
            `Inspect adjacent cell in the ${dirName} direction at [${nr}, ${nc}]. ` + 
              (outOfBounds ? "It is out of bounds, skipping." : 
               cellVal === 0 ? "It is an empty cell, skipping." : 
               cellVal === 2 ? "It is already rotten, skipping." : 
               "It is a fresh orange! We will infect it with rot and enqueue it."),
            `// Check neighbor at [${nr}, ${nc}]`,
            grid, queue, fresh, time, currR, currC, [currR, currC], [nr, nc],
            false,
            29, 27, 32, 32
          );

          if (!outOfBounds && isFresh) {
            grid[nr][nc] = 2;
            queue.push([nr, nc]);
            fresh--;

            pushStep(
              `Rot the fresh orange at [${nr}, ${nc}]. Enqueue [${nr}, ${nc}] and decrement fresh oranges remaining to ${fresh}.`,
              `grid[row][col] = 2, queue.append((row, col)), fresh -= 1`,
              grid, queue, fresh, time, currR, currC, [currR, currC], [nr, nc],
              true,
              38, 32, 39, 35
            );
          }
        }
      }

      time++;

      pushStep(
        `Finished processing all rotten oranges at the current BFS layer. Increment elapsed time to ${time} minute(s).`,
        `time += 1  →  ${time} min`,
        grid, queue, fresh, time, null, null, null, null,
        false,
        43, 35, 44, 41
      );
    }

    pushStep(
      `Check loop condition: queue length (${queue.length}) > 0 AND fresh count (${fresh}) > 0. Since ` +
        (queue.length === 0 ? "the queue is empty" : "there are no fresh oranges left") +
        `, the loop terminates.`,
      `WHILE queue AND fresh > 0`,
      grid, queue, fresh, time, null, null, null, null,
      false,
      22, 21, 23, 24
    );

    pushStep(
      `Algorithm finished. Check if any fresh oranges remain: fresh = ${fresh}. ` +
        (fresh === 0 ? `Since all fresh oranges rotted, we return the total elapsed time: ${time} minutes.` : `Since ${fresh} fresh orange(s) are unreachable, we return -1.`),
      `RETURN ${fresh === 0 ? time : -1}`,
      grid, queue, fresh, time, null, null, null, null,
      true,
      45, 36, 46, 43
    );

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  return (
    <div className="space-y-6">
      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 relative overflow-hidden min-h-[420px] flex flex-col shadow-lg">
              <h3 className="text-sm font-semibold mb-6 flex items-center justify-center gap-2 text-muted-foreground uppercase tracking-widest">
                <Clock className="w-4 h-4 text-orange-500 animate-pulse" /> Rotting Oranges
              </h3>

              {/* Main simulation grid */}
              <div className="flex-1 flex justify-center items-center py-4">
                <div className="flex flex-col gap-3 p-6 bg-muted/10 border border-border/50 rounded-2xl relative">
                  {step.grid.map((row, r) => (
                    <div key={r} className="flex gap-3 justify-center">
                      {row.map((val, c) => {
                        const isActive = step.activeCell && step.activeCell[0] === r && step.activeCell[1] === c;
                        const isNeighbor = step.neighborCell && step.neighborCell[0] === r && step.neighborCell[1] === c;

                        return (
                          <div key={c} className="flex flex-col items-center">
                            <div
                              className={`w-16 h-16 rounded-xl flex items-center justify-center border transition-all duration-150 relative select-none ${
                                isActive
                                  ? 'scale-110 shadow-2xl ring-4 ring-orange-500 border-orange-500 z-20'
                                  : isNeighbor
                                  ? 'scale-105 shadow-lg ring-4 ring-amber-400 border-amber-400 z-10'
                                  : 'bg-card border-border/80'
                              }`}
                            >
                              {/* Inner node design */}
                              {val === 0 ? (
                                // Empty Cell
                                <div className="w-full h-full rounded-xl bg-muted/5 border-2 border-dashed border-muted-foreground/15 flex items-center justify-center text-[10px] text-muted-foreground/30 font-mono">
                                  0
                                </div>
                              ) : val === 1 ? (
                                // Fresh Orange
                                <div className="flex flex-col items-center justify-center">
                                  <svg className="w-10 h-10 drop-shadow-md" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C13 3 14 5.5 12.5 7C11.5 8 10 7.5 10 7C10 6 11 3 12 2Z" fill="#22c55e" />
                                    <circle cx="12" cy="14" r="7" fill="url(#fresh-orange-grad)" />
                                    <path d="M12 7V9" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
                                    <defs>
                                      <linearGradient id="fresh-orange-grad" x1="8" y1="9" x2="16" y2="19" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#fbbf24" />
                                        <stop offset="100%" stopColor="#ea580c" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </div>
                              ) : (
                                // Rotten Orange
                                <div className="flex flex-col items-center justify-center animate-wiggle">
                                  <svg className="w-10 h-10 drop-shadow-md" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C12.5 3 13 4.5 12.2 5.2C11.6 5.8 10.8 5.5 10.8 5.2C10.8 4.6 11.4 3 12 2Z" fill="#78716c" />
                                    <circle cx="12" cy="14" r="7" fill="url(#rotten-orange-grad)" />
                                    <path d="M12 5V9" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="10" cy="12" r="0.8" fill="#166534" opacity="0.85" />
                                    <circle cx="14" cy="15" r="1.1" fill="#14532d" opacity="0.9" />
                                    <circle cx="11" cy="16" r="0.7" fill="#1e3a1e" opacity="0.8" />
                                    <defs>
                                      <linearGradient id="rotten-orange-grad" x1="8" y1="9" x2="16" y2="19" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#4d7c0f" />
                                        <stop offset="60%" stopColor="#166534" />
                                        <stop offset="100%" stopColor="#1c1917" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </div>
                              )}

                              {/* Label showing coordinates in corner */}
                              <span className="absolute bottom-1 right-1 text-[8px] font-mono text-muted-foreground/60">
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

              {/* Queue Visualization */}
              <div className="mt-4 space-y-2 border-t border-border/40 pt-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Inbox className="w-3.5 h-3.5" /> Queue (FIFO)
                </span>
                <div className="w-full bg-muted/30 border border-border/50 rounded-xl p-3.5 min-h-[64px] flex items-center gap-2 overflow-x-auto">
                  {step.queue.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic mx-auto">Queue is Empty</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground/70 shrink-0">Front</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                      {step.queue.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-1 font-mono text-xs px-2.5 py-1.5 rounded-lg border shadow-sm transition-all shrink-0 ${
                            idx === 0
                              ? 'bg-orange-500/10 text-orange-600 border-orange-500/25 ring-2 ring-orange-500/20'
                              : 'bg-card text-foreground border-border'
                          }`}
                        >
                          [{item[0]}, {item[1]}]
                        </div>
                      ))}
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                      <span className="text-[10px] uppercase font-bold text-muted-foreground/70 shrink-0">Back</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 mt-6">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[11px] text-orange-600 dark:text-orange-500 font-semibold">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div> Fresh (1)
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-900/5 border border-green-950/15 text-[11px] text-green-700 dark:text-green-500 font-semibold">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-700"></div> Rotten (2)
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50 text-[11px] text-muted-foreground font-semibold">
                  <div className="w-2.5 h-2.5 border border-dashed border-muted-foreground/40 rounded bg-muted/20"></div> Empty (0)
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
export default RottingOrangesVisualization;
