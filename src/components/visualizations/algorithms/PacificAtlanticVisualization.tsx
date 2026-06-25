import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Info, CheckCircle2 } from 'lucide-react';

interface Step {
  r: number | null;
  c: number | null;
  pac: string[];
  atl: string[];
  explanation: string;
  res: number[][];
  isMatch?: boolean;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function pacificAtlantic(heights: number[][]): number[][] {
  const ROWS = heights.length;
  const COLS = heights[0].length;
  const pac = new Set<string>();
  const atl = new Set<string>();
  function dfs(r: number, c: number, visit: Set<string>, prevHeight: number) {
    const key = \`\${r},\${c}\`;
    if (visit.has(key) || r < 0 || c < 0 || r >= ROWS || c >= COLS || heights[r][c] < prevHeight) {
      return;
    }
    visit.add(key);
    dfs(r + 1, c, visit, heights[r][c]);
    dfs(r - 1, c, visit, heights[r][c]);
    dfs(r, c + 1, visit, heights[r][c]);
    dfs(r, c - 1, visit, heights[r][c]);
  }
  for (let c = 0; c < COLS; c++) {
    dfs(0, c, pac, heights[0][c]);
    dfs(ROWS - 1, c, atl, heights[ROWS - 1][c]);
  }
  for (let r = 0; r < ROWS; r++) {
    dfs(r, 0, pac, heights[r][0]);
    dfs(r, COLS - 1, atl, heights[r][COLS - 1]);
  }
  const res: number[][] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const key = \`\${r},\${c}\`;
      if (pac.has(key) && atl.has(key)) {
        res.push([r, c]);
      }
    }
  }
  return res;
}`,

  python: `def pacificAtlantic(heights: list[list[int]]) -> list[list[int]]:
    ROWS = len(heights)
    COLS = len(heights[0])
    pac = set()
    atl = set()
    def dfs(r, c, visit, prevHeight):
        if (r, c) in visit or r < 0 or c < 0 or r >= ROWS or c >= COLS or heights[r][c] < prevHeight:
            return
        visit.add((r, c))
        dfs(r + 1, c, visit, heights[r][c])
        dfs(r - 1, c, visit, heights[r][c])
        dfs(r, c + 1, visit, heights[r][c])
        dfs(r, c - 1, visit, heights[r][c])
    for c in range(COLS):
        dfs(0, c, pac, heights[0][c])
        dfs(ROWS - 1, c, atl, heights[ROWS - 1][c])
    for r in range(ROWS):
        dfs(r, 0, pac, heights[r][0])
        dfs(r, COLS - 1, atl, heights[r][COLS - 1])
    res = []
    for r in range(ROWS):
        for c in range(COLS):
            if (r, c) in pac and (r, c) in atl:
                res.append([r, c])
    return res`,

  java: `public static class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        if (heights == null || heights.length == 0) return new ArrayList<>();
        int ROWS = heights.length;
        int COLS = heights[0].length;
        Set<String> pac = new HashSet<>();
        Set<String> atl = new HashSet<>();
        for (int c = 0; c < COLS; c++) {
            dfs(0, c, pac, heights, heights[0][c], ROWS, COLS);
            dfs(ROWS - 1, c, atl, heights, heights[ROWS - 1][c], ROWS, COLS);
        }
        for (int r = 0; r < ROWS; r++) {
            dfs(r, 0, pac, heights, heights[r][0], ROWS, COLS);
            dfs(r, COLS - 1, atl, heights, heights[r][COLS - 1], ROWS, COLS);
        }
        List<List<Integer>> result = new ArrayList<>();
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                String key = r + "," + c;
                if (pac.contains(key) && atl.contains(key)) {
                    result.add(Arrays.asList(r, c));
                }
            }
        }
        return result;
    }
    private void dfs(int r, int c, Set<String> visit, int[][] heights, int prevHeight, int ROWS, int COLS) {
        if (r < 0 || c < 0 || r >= ROWS || c >= COLS) return;
        String key = r + "," + c;
        if (visit.contains(key) || heights[r][c] < prevHeight) return;
        visit.add(key);
        dfs(r + 1, c, visit, heights, heights[r][c], ROWS, COLS);
        dfs(r - 1, c, visit, heights, heights[r][c], ROWS, COLS);
        dfs(r, c + 1, visit, heights, heights[r][c], ROWS, COLS);
        dfs(r, c - 1, visit, heights, heights[r][c], ROWS, COLS);
    }
}`,

  cpp: `class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        if (heights.empty()) return {};
        int ROWS = heights.size();
        int COLS = heights[0].size();
        unordered_set<string> pac;
        unordered_set<string> atl;
        for (int c = 0; c < COLS; c++) {
            dfs(0, c, pac, heights, heights[0][c], ROWS, COLS);
            dfs(ROWS - 1, c, atl, heights, heights[ROWS - 1][c], ROWS, COLS);
        }
        for (int r = 0; r < ROWS; r++) {
            dfs(r, 0, pac, heights, heights[r][0], ROWS, COLS);
            dfs(r, COLS - 1, atl, heights, heights[r][COLS - 1], ROWS, COLS);
        }
        vector<vector<int>> result;
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                string key = to_string(r) + "," + to_string(c);
                if (pac.count(key) && atl.count(key)) {
                    result.push_back({r, c});
                }
            }
        }
        return result;
    }
private:
    void dfs(int r, int c, unordered_set<string>& visit, vector<vector<int>>& heights, int prevHeight, int ROWS, int COLS) {
        string key = to_string(r) + "," + to_string(c);
        if (r < 0 || c < 0 || r >= ROWS || c >= COLS || visit.count(key) || heights[r][c] < prevHeight) {
            return;
        }
        visit.insert(key);
        dfs(r + 1, c, visit, heights, heights[r][c], ROWS, COLS);
        dfs(r - 1, c, visit, heights, heights[r][c], ROWS, COLS);
        dfs(r, c + 1, visit, heights, heights[r][c], ROWS, COLS);
        dfs(r, c - 1, visit, heights, heights[r][c], ROWS, COLS);
    }
};`
};

export const PacificAtlanticVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const heights = useMemo(() => [[2, 1], [1, 2]], []);

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

    const ROWS = heights.length;
    const COLS = heights[0].length;
    const pac = new Set<string>();
    const atl = new Set<string>();
    const res: number[][] = [];

    const snapshot = (msg: string, pseudo: string, ts: number, py: number, java: number, cpp: number, r: number | null, c: number | null, isMatch: boolean = false) => {
      stepsList.push({
        r, c,
        pac: Array.from(pac),
        atl: Array.from(atl),
        explanation: msg,
        res: [...res.map(x => [...x])],
        isMatch,
        pseudoStep: pseudo
      });
      addLines(ts, py, java, cpp);
    };

    snapshot("Initialize dimensions ROWS = 2, COLS = 2.", "SET ROWS=2, COLS=2", 2, 2, 4, 5, null, null);
    snapshot("Initialize sets pac and atl to keep track of reachable cells.", "SET pac = {}, atl = {}", 4, 4, 6, 7, null, null);

    function dfs(r: number, c: number, visitSet: 'pac' | 'atl', prevHeight: number) {
      const visit = visitSet === 'pac' ? pac : atl;
      const key = `${r},${c}`;

      if (r < 0 || c < 0 || r >= ROWS || c >= COLS) return;
      if (visit.has(key)) return;

      if (heights[r][c] < prevHeight) {
        snapshot(
          `Water cannot flow uphill in reverse. Height at (${r}, ${c}) is ${heights[r][c]}, which is less than ${prevHeight}.`,
          `IF heights[${r}][${c}] < prevHeight → ${heights[r][c]} < ${prevHeight} → YES ✗`,
          8, 7, 30, 31, r, c
        );
        return;
      }

      visit.add(key);
      snapshot(
        `Added (${r}, ${c}) to ${visitSet === 'pac' ? 'Pacific' : 'Atlantic'} reachable set.`,
        `visit.add((${r}, ${c}))`,
        11, 9, 31, 34, r, c, true
      );

      dfs(r + 1, c, visitSet, heights[r][c]);
      dfs(r - 1, c, visitSet, heights[r][c]);
      dfs(r, c + 1, visitSet, heights[r][c]);
      dfs(r, c - 1, visitSet, heights[r][c]);
    }

    // Iterate columns (top & bottom edges)
    for (let c = 0; c < COLS; c++) {
      snapshot(`Process column ${c} for top/bottom edge starts.`, `FOR c = ${c}`, 17, 14, 8, 9, null, null);
      
      snapshot(`Start Pacific DFS from top edge (0, ${c})`, `CALL dfs(0, ${c}, Pacific)`, 18, 15, 9, 10, 0, c);
      dfs(0, c, 'pac', heights[0][c]);

      snapshot(`Start Atlantic DFS from bottom edge (${ROWS - 1}, ${c})`, `CALL dfs(${ROWS - 1}, ${c}, Atlantic)`, 19, 16, 10, 11, ROWS - 1, c);
      dfs(ROWS - 1, c, 'atl', heights[ROWS - 1][c]);
    }

    // Iterate rows (left & right edges)
    for (let r = 0; r < ROWS; r++) {
      snapshot(`Process row ${r} for left/right edge starts.`, `FOR r = ${r}`, 21, 17, 12, 13, null, null);

      snapshot(`Start Pacific DFS from left edge (${r}, 0)`, `CALL dfs(${r}, 0, Pacific)`, 22, 18, 13, 14, r, 0);
      dfs(r, 0, 'pac', heights[r][0]);

      snapshot(`Start Atlantic DFS from right edge (${r}, ${COLS - 1})`, `CALL dfs(${r}, ${COLS - 1}, Atlantic)`, 23, 19, 14, 15, r, COLS - 1);
      dfs(r, COLS - 1, 'atl', heights[r][COLS - 1]);
    }

    snapshot("Initialize result array. Iterate to find intersections.", "SET res = []", 25, 20, 16, 17, null, null);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const key = `${r},${c}`;
        const hasBoth = pac.has(key) && atl.has(key);
        
        snapshot(
          `Check if (${r}, ${c}) is in both pac and atl sets.`,
          `IF (${r}, ${c}) in pac AND atl → ${hasBoth ? "YES ✓" : "NO ✗"}`,
          29, 23, 20, 21, r, c
        );

        if (hasBoth) {
          res.push([r, c]);
          snapshot(
            `Cell (${r}, ${c}) can flow to both oceans. Add to results.`,
            `res.push([${r}, ${c}])`,
            30, 24, 21, 22, r, c, true
          );
        }
      }
    }

    snapshot(`Completed. Return list of cells: ${JSON.stringify(res)}`, "RETURN res", 34, 25, 25, 26, null, null, true);

    return { steps: stepsList, stepLineNumbers: stepLines };
  }, [heights]);

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
              Grid Water Flow Simulation
            </h3>

            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col gap-2 p-6 bg-muted/10 border border-border/50 rounded-xl relative">
                {/* Visual Ocean Borders */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500/80 rounded-t-xl" title="Pacific Boundary"></div>
                <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-500/80 rounded-l-xl" title="Pacific Boundary"></div>
                
                <div className="absolute bottom-0 right-0 w-full h-1.5 bg-orange-500/80 rounded-b-xl" title="Atlantic Boundary"></div>
                <div className="absolute bottom-0 right-0 h-full w-1.5 bg-orange-500/80 rounded-r-xl" title="Atlantic Boundary"></div>

                <div className="z-10 m-2 mt-4 space-y-3">
                  {heights.map((row, r) => (
                    <div key={r} className="flex gap-3 justify-center">
                      {row.map((val, c) => {
                        const key = `${r},${c}`;
                        const pacSet = step?.pac || [];
                        const atlSet = step?.atl || [];
                        
                        const isPac = pacSet.includes(key);
                        const isAtl = atlSet.includes(key);
                        const isBoth = isPac && isAtl;
                        const isCurrent = step?.r === r && step?.c === c;

                        return (
                          <div key={c} className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 z-10 ${
                                isCurrent ? 'scale-110 shadow-md ring-2 ring-primary ring-offset-1 z-20' : ''
                              } ${
                                isBoth ? 'bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' : 
                                isPac ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400' : 
                                isAtl ? 'bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-400' : 
                                'bg-muted/50 border-border text-foreground'
                              }`}
                            >
                              <span className="font-mono">{val}</span>
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
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-semibold text-blue-600 dark:text-blue-400 justify-center">
                 <div className="w-2.5 h-2.5 rounded bg-blue-500"></div> Pacific
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[10px] font-semibold text-orange-600 dark:text-orange-400 justify-center">
                 <div className="w-2.5 h-2.5 rounded bg-orange-500"></div> Atlantic
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 justify-center">
                 <div className="w-2.5 h-2.5 rounded bg-indigo-500"></div> Both
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

          <VariablePanel
            variables={{
              row: step?.r ?? 'null',
              col: step?.c ?? 'null',
              "pac.size": step?.pac?.length || 0,
              "atl.size": step?.atl?.length || 0,
              res: JSON.stringify(step?.res || [])
            }}
          />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
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
  );
};
