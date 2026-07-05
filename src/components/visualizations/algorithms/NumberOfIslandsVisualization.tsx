import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Info, CheckCircle2, Droplets } from 'lucide-react';

interface Step {
  r: number | null;
  c: number | null;
  count: number;
  grid: string[][];
  originalGrid: string[][];
  explanation: string;
  isMatch?: boolean;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function numIslands(grid: string[][]): number {
  if (grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  function dfs(r: number, c: number) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') {
      return;
    }
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,

  python: `def numIslands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows = len(grid)
    cols = len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,

  java: `public static class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int rows = grid.length;
        int cols = grid[0].length;
        int count = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(r, c, grid, rows, cols);
                }
            }
        }
        return count;
    }
    private void dfs(int r, int c, char[][] grid, int rows, int cols) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') {
            return;
        }
        grid[r][c] = '0';
        dfs(r + 1, c, grid, rows, cols);
        dfs(r - 1, c, grid, rows, cols);
        dfs(r, c + 1, grid, rows, cols);
        dfs(r, c - 1, grid, rows, cols);
    }
}`,

  cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        int rows = grid.size();
        int cols = grid[0].size();
        int count = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(r, c, grid, rows, cols);
                }
            }
        }
        return count;
    }
private:
    void dfs(int r, int c, vector<vector<char>>& grid, int rows, int cols) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') {
            return;
        }
        grid[r][c] = '0';
        dfs(r + 1, c, grid, rows, cols);
        dfs(r - 1, c, grid, rows, cols);
        dfs(r, c + 1, grid, rows, cols);
        dfs(r, c - 1, grid, rows, cols);
    }
};`
};

export const NumberOfIslandsVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const stepLines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLines.typescript!.push(ts);
      stepLines.python!.push(py);
      stepLines.java!.push(java);
      stepLines.cpp!.push(cpp);
    };

    const gridRaw = [
      ['1', '1', '0'],
      ['0', '0', '0'],
      ['0', '0', '1']
    ];
    const grid = gridRaw.map(r => [...r]);
    const originalGrid = gridRaw.map(r => [...r]);
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;

    const makeSnapshot = (msg: string, pseudo: string, ts: number, py: number, java: number, cpp: number, r: number | null, c: number | null, isMatch: boolean = false) => {
      stepsList.push({
        r, c, count,
        grid: grid.map(row => [...row]),
        originalGrid,
        explanation: msg,
        isMatch,
        pseudoStep: pseudo
      });
      addLines(ts, py, java, cpp);
    };

    // Step 1: Start
    makeSnapshot("Start scanning grid for islands. Check if the grid is empty.", "START numIslands()", 2, 2, 3, 4, null, null);
    makeSnapshot("Initialize count to 0, representing zero islands found so far.", "SET count = 0", 5, 6, 6, 7, null, null);

    function dfs(r: number, c: number) {
      makeSnapshot(
        `DFS: Check if (${r}, ${c}) is within bounds and is a land cell ('1').`,
        `IF outOfBounds OR grid[${r}][${c}] == '0'`,
        7, 8, 18, 20, r, c
      );

      if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') {
        makeSnapshot(
          `DFS: Cell (${r}, ${c}) is either out of bounds or water. Return.`,
          "RETURN",
          8, 9, 19, 21, r, c
        );
        return;
      }

      grid[r][c] = '0';
      makeSnapshot(
        `DFS: Mark (${r}, ${c}) as visited by sinking it (change to '0').`,
        `SET grid[${r}][${c}] = '0'`,
        10, 10, 21, 23, r, c, true
      );

      makeSnapshot(`DFS: Explore cell below (${r + 1}, ${c}).`, `CALL dfs(${r + 1}, ${c})`, 11, 11, 22, 24, r, c);
      dfs(r + 1, c);

      makeSnapshot(`DFS: Explore cell above (${r - 1}, ${c}).`, `CALL dfs(${r - 1}, ${c})`, 12, 12, 23, 25, r, c);
      dfs(r - 1, c);

      makeSnapshot(`DFS: Explore cell to the right (${r}, ${c + 1}).`, `CALL dfs(${r}, ${c + 1})`, 13, 13, 24, 26, r, c);
      dfs(r, c + 1);

      makeSnapshot(`DFS: Explore cell to the left (${r}, ${c - 1}).`, `CALL dfs(${r}, ${c - 1})`, 14, 14, 25, 27, r, c);
      dfs(r, c - 1);
    }

    for (let r = 0; r < rows; r++) {
      makeSnapshot(`Outer Loop: Scan row ${r}.`, `FOR r = ${r}`, 16, 15, 7, 8, r, null);
      for (let c = 0; c < cols; c++) {
        makeSnapshot(`Inner Loop: Visiting cell (${r}, ${c}).`, `FOR c = ${c}`, 17, 16, 8, 9, r, c);

        const isLand = grid[r][c] === '1';
        makeSnapshot(
          `Check if cell (${r}, ${c}) is unvisited land ('1').`,
          `IF grid[${r}][${c}] == '1' → ${isLand ? "YES ✓" : "NO ✗"}`,
          18, 17, 9, 10, r, c
        );

        if (isLand) {
          count++;
          makeSnapshot(
            `New island detected! Increment island count to ${count}.`,
            `SET count = ${count}`,
            19, 18, 10, 11, r, c, true
          );

          makeSnapshot(
            `Call DFS starting from (${r}, ${c}) to submerge all adjacent land cells.`,
            `CALL dfs(${r}, ${c})`,
            20, 19, 11, 12, r, c, true
          );
          dfs(r, c);
        }
      }
    }

    makeSnapshot(`Finished scanning. Total islands found: ${count}.`, "RETURN count", 24, 20, 15, 16, null, null, true);

    return { steps: stepsList, stepLineNumbers: stepLines };
  }, []);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden min-h-[300px] flex flex-col shadow-sm">
            <h3 className="text-sm font-semibold mb-6 flex items-center justify-center gap-2 text-foreground font-sans">
              <Droplets className="w-4 h-4 text-primary" /> Number of Islands Grid
            </h3>

            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col gap-2 p-6 bg-muted/10 border border-border/50 rounded-xl relative">
                <div className="z-10 m-2 space-y-3">
                  {step?.originalGrid && step.originalGrid.map((row, r) => (
                    <div key={r} className="flex gap-3 justify-center">
                      {row.map((val, c) => {
                        const currentVal = step.grid[r][c];
                        const isCurrent = step.r === r && step.c === c;
                        const isOriginalLand = val === '1';
                        const isSubmerged = isOriginalLand && currentVal === '0';
                        const isActiveLand = currentVal === '1';

                        return (
                          <div key={c} className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 z-10 ${
                                isCurrent ? 'scale-110 shadow-md ring-2 ring-primary ring-offset-1 z-20' : ''
                              } ${
                                isSubmerged ? 'bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' : 
                                isActiveLand ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400 font-bold' : 
                                'bg-blue-500/10 border-blue-500/30 text-blue-500/50'
                              }`}
                            >
                              <span className="font-mono">{currentVal}</span>
                            </div>
                            <span className="text-[9px] text-muted-foreground mt-2 opacity-70 font-mono font-bold tracking-wider">[{r},{c}]</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6 border-t border-border/40 pt-4">
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-semibold text-green-600 dark:text-green-400 justify-center">
                 <div className="w-2.5 h-2.5 rounded bg-green-500"></div> Land ('1')
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-semibold text-blue-600 dark:text-blue-400 justify-center">
                 <div className="w-2.5 h-2.5 rounded bg-blue-500/30"></div> Water ('0')
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 justify-center">
                 <div className="w-2.5 h-2.5 rounded bg-indigo-500"></div> Visited / Sunk
              </div>
            </div>
          </Card>

          {/* Commentary Panel */}
          <Card className="p-6 bg-card border-border/50 shadow-sm relative overflow-hidden transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  {step?.isMatch ? <CheckCircle2 className="w-4.5 h-4.5 text-primary" /> : <Info className="w-4.5 h-4.5 text-primary" />}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {step?.explanation || ''}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel
            variables={{
              row: step?.r ?? 'null',
              col: step?.c ?? 'null',
              islands: step?.count || 0
            }}
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
