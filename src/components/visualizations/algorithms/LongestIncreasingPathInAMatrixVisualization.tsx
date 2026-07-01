import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info, HelpCircle } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  r: number;
  c: number;
  prevVal: number;
  activeStack: [number, number][];
  dp: Record<string, number>;
  ans: number;
  explanation: string;
  pseudoStep: string;
  res?: number;
  variables: Record<string, any>;
  neighborExplored?: [number, number] | null;
}

const languages: VisualizationLanguageMap = {
  typescript: `function longestIncreasingPath(matrix: number[][]): number {
  const ROWS = matrix.length;
  const COLS = matrix[0].length;
  const dp: Record<string, number> = {};
  function dfs(r: number, c: number, prevVal: number): number {
    if (
      r < 0 ||
      r >= ROWS ||
      c < 0 ||
      c >= COLS ||
      matrix[r][c] <= prevVal
    ) {
      return 0;
    }
    const key = \`\${r},\${c}\`;
    if (key in dp) {
      return dp[key];
    }
    let res = 1;
    res = Math.max(res, 1 + dfs(r + 1, c, matrix[r][c]));
    res = Math.max(res, 1 + dfs(r - 1, c, matrix[r][c]));
    res = Math.max(res, 1 + dfs(r, c + 1, matrix[r][c]));
    res = Math.max(res, 1 + dfs(r, c - 1, matrix[r][c]));
    dp[key] = res;
    return res;
  }
  let ans = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ans = Math.max(ans, dfs(r, c, -1));
    }
  }
  return ans;
}`,
  python: `def longestIncreasingPath(matrix: list[list[int]]) -> int:
    ROWS, COLS = len(matrix), len(matrix[0])
    dp = {}
    def dfs(r: int, c: int, prevVal: int) -> int:
        if (
            r < 0
            or r >= ROWS
            or c < 0
            or c >= COLS
            or matrix[r][c] <= prevVal
        ):
            return 0
        if (r, c) in dp:
            return dp[(r, c)]
        res = 1
        res = max(res, 1 + dfs(r + 1, c, matrix[r][c]))
        res = max(res, 1 + dfs(r - 1, c, matrix[r][c]))
        res = max(res, 1 + dfs(r, c + 1, matrix[r][c]))
        res = max(res, 1 + dfs(r, c - 1, matrix[r][c]))
        dp[(r, c)] = res
        return res
    ans = 0
    for r in range(ROWS):
        for c in range(COLS):
            ans = max(ans, dfs(r, c, -1))
    return ans`,
  java: `public static class Solution {
    private int ROWS;
    private int COLS;
    private int[][] matrix;
    private Map<String, Integer> dp;
    public int longestIncreasingPath(int[][] matrix) {
        this.matrix = matrix;
        this.ROWS = matrix.length;
        this.COLS = matrix[0].length;
        this.dp = new HashMap<>();
        int ans = 0;
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                ans = Math.max(ans, dfs(r, c, -1));
            }
        }
        return ans;
    }
    private int dfs(int r, int c, int prevVal) {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS || matrix[r][c] <= prevVal) {
            return 0;
        }
        String key = r + "," + c;
        if (dp.containsKey(key)) {
            return dp.get(key);
        }
        int res = 1;
        res = Math.max(res, 1 + dfs(r + 1, c, matrix[r][c]));
        res = Math.max(res, 1 + dfs(r - 1, c, matrix[r][c]));
        res = Math.max(res, 1 + dfs(r, c + 1, matrix[r][c]));
        res = Math.max(res, 1 + dfs(r, c - 1, matrix[r][c]));
        dp.put(key, res);
        return res;
    }
}`,
  cpp: `class Solution {
private:
    int ROWS;
    int COLS;
    vector<vector<int>> matrix;
    vector<vector<int>> dp;
    int dfs(int r, int c, int prevVal) {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) {
            return 0;
        }
        if (matrix[r][c] <= prevVal) {
            return 0;
        }
        if (dp[r][c] != -1) {
            return dp[r][c];
        }
        int res = 1;
        res = max(res, 1 + dfs(r + 1, c, matrix[r][c]));
        res = max(res, 1 + dfs(r - 1, c, matrix[r][c]));
        res = max(res, 1 + dfs(r, c + 1, matrix[r][c]));
        res = max(res, 1 + dfs(r, c - 1, matrix[r][c]));
        dp[r][c] = res;
        return res;
    }
public:
    int longestIncreasingPath(vector<vector<int>>& matrixInput) {
        this->matrix = matrixInput;
        ROWS = matrix.size();
        COLS = matrix[0].size();
        dp.assign(ROWS, vector<int>(COLS, -1));
        int ans = 0;
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                ans = max(ans, dfs(r, c, -1));
            }
        }
        return ans;
    }
};`
};

export const LongestIncreasingPathInAMatrixVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const matrix = useMemo(() => [
    [9, 9, 4],
    [6, 6, 8],
    [2, 1, 1]
  ], []);

  const ROWS = 3;
  const COLS = 3;

  const { steps, stepLineNumbers } = useMemo(() => {
    const tempSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const dpState: Record<string, number> = {};
    const activeStack: [number, number][] = [];
    let currentAns = 0;

    const pushStep = (
      ts: number, py: number, jv: number, cp: number,
      explanation: string,
      pseudo: string,
      r: number, c: number, prevVal: number,
      opts: { localRes?: number; neighborExplored?: [number, number] | null } = {}
    ) => {
      tempSteps.push({
        r,
        c,
        prevVal,
        activeStack: [...activeStack],
        dp: { ...dpState },
        ans: currentAns,
        explanation,
        pseudoStep: pseudo,
        res: opts.localRes,
        neighborExplored: opts.neighborExplored,
        variables: {
          "Current Cell": r >= 0 && r < ROWS && c >= 0 && c < COLS ? `(${r}, ${c}) = ${matrix[r][c]}` : "None",
          "Previous Value": prevVal,
          "Active Stack Path": activeStack.map(([row, col]) => `(${row},${col})[${matrix[row][col]}]`).join(" → ") || "Empty",
          "Global Max Path (ans)": currentAns,
          "DP Cache Size": Object.keys(dpState).length
        }
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      1, 1, 6, 26,
      "We initialize the helper variables and prepare to find the longest increasing path from any cell.",
      "longestIncreasingPath(matrix)",
      -1, -1, -1
    );

    pushStep(
      4, 3, 10, 30,
      "Initialize DP cache (dp) to store results of subproblems to avoid redundant DFS traversals.",
      "dp = {}",
      -1, -1, -1
    );

    const dfsSim = (r: number, c: number, prevVal: number): number => {
      // dfs entry step
      pushStep(
        5, 4, 19, 7,
        `dfs(r=${r}, c=${c}, prevVal=${prevVal}) is invoked.`,
        `dfs(r=${r}, c=${c}, prevVal=${prevVal})`,
        r, c, prevVal
      );

      // base case check
      pushStep(
        6, 5, 20, 8,
        `Check bounds and strictly increasing property: Is (${r}, ${c}) out of bounds or matrix[${r}][${c}] <= ${prevVal}?`,
        `IF r, c out of bounds OR matrix[r][c] <= prevVal`,
        r, c, prevVal
      );

      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || matrix[r][c] <= prevVal) {
        pushStep(
          13, 12, 21, 9,
          `Condition met! Either cell is out of bounds or not strictly increasing. Return 0.`,
          `RETURN 0`,
          r, c, prevVal
        );
        return 0;
      }

      const key = `${r},${c}`;
      activeStack.push([r, c]);

      // memo check
      pushStep(
        16, 13, 24, 14,
        `Check if cell (${r}, ${c}) is already cached in dp map.`,
        `IF key="${key}" in dp`,
        r, c, prevVal
      );

      if (key in dpState) {
        pushStep(
          17, 14, 25, 15,
          `Memo hit! The longest path starting from (${r}, ${c}) is already computed as ${dpState[key]}. Return cached result.`,
          `RETURN dp["${key}"]  →  ${dpState[key]}`,
          r, c, prevVal
        );
        activeStack.pop();
        return dpState[key];
      }

      let res = 1;
      pushStep(
        19, 15, 27, 17,
        `Initialize path length res = 1 for cell (${r}, ${c}) = ${matrix[r][c]}.`,
        `res = 1`,
        r, c, prevVal,
        { localRes: res }
      );

      // Down: (r + 1, c)
      pushStep(
        20, 16, 28, 18,
        `Explore down neighbor: dfs(r=${r+1}, c=${c}, prevVal=${matrix[r][c]}).`,
        `dfs(r=${r+1}, c=${c}, prevVal=${matrix[r][c]})`,
        r, c, prevVal,
        { localRes: res, neighborExplored: [r + 1, c] }
      );
      const down = dfsSim(r + 1, c, matrix[r][c]);
      res = Math.max(res, 1 + down);
      pushStep(
        20, 16, 28, 18,
        `dfs(r=${r+1}, c=${c}) returned ${down}. Update res = max(res, 1 + ${down}) = ${res}.`,
        `res = max(res, 1 + dfs_down)  →  ${res}`,
        r, c, prevVal,
        { localRes: res }
      );

      // Up: (r - 1, c)
      pushStep(
        21, 17, 29, 19,
        `Explore up neighbor: dfs(r=${r-1}, c=${c}, prevVal=${matrix[r][c]}).`,
        `dfs(r=${r-1}, c=${c}, prevVal=${matrix[r][c]})`,
        r, c, prevVal,
        { localRes: res, neighborExplored: [r - 1, c] }
      );
      const up = dfsSim(r - 1, c, matrix[r][c]);
      res = Math.max(res, 1 + up);
      pushStep(
        21, 17, 29, 19,
        `dfs(r=${r-1}, c=${c}) returned ${up}. Update res = max(res, 1 + ${up}) = ${res}.`,
        `res = max(res, 1 + dfs_up)  →  ${res}`,
        r, c, prevVal,
        { localRes: res }
      );

      // Right: (r, c + 1)
      pushStep(
        22, 18, 30, 20,
        `Explore right neighbor: dfs(r=${r}, c=${c+1}, prevVal=${matrix[r][c]}).`,
        `dfs(r=${r}, c=${c+1}, prevVal=${matrix[r][c]})`,
        r, c, prevVal,
        { localRes: res, neighborExplored: [r, c + 1] }
      );
      const right = dfsSim(r, c + 1, matrix[r][c]);
      res = Math.max(res, 1 + right);
      pushStep(
        22, 18, 30, 20,
        `dfs(r=${r}, c=${c+1}) returned ${right}. Update res = max(res, 1 + ${right}) = ${res}.`,
        `res = max(res, 1 + dfs_right)  →  ${res}`,
        r, c, prevVal,
        { localRes: res }
      );

      // Left: (r, c - 1)
      pushStep(
        23, 19, 31, 21,
        `Explore left neighbor: dfs(r=${r}, c=${c-1}, prevVal=${matrix[r][c]}).`,
        `dfs(r=${r}, c=${c-1}, prevVal=${matrix[r][c]})`,
        r, c, prevVal,
        { localRes: res, neighborExplored: [r, c - 1] }
      );
      const left = dfsSim(r, c - 1, matrix[r][c]);
      res = Math.max(res, 1 + left);
      pushStep(
        23, 19, 31, 21,
        `dfs(r=${r}, c=${c-1}) returned ${left}. Update res = max(res, 1 + ${left}) = ${res}.`,
        `res = max(res, 1 + dfs_left)  →  ${res}`,
        r, c, prevVal,
        { localRes: res }
      );

      dpState[key] = res;
      pushStep(
        24, 20, 32, 22,
        `Memoize the result: dp["${key}"] = ${res}.`,
        `dp["${key}"] = ${res}`,
        r, c, prevVal,
        { localRes: res }
      );

      pushStep(
        25, 21, 33, 23,
        `Return computed path length ${res} for cell (${r}, ${c}).`,
        `RETURN ${res}`,
        r, c, prevVal,
        { localRes: res }
      );

      activeStack.pop();
      return res;
    };

    // Outer loops
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        pushStep(
          28, 23, 12, 32,
          `Iterate to cell (${r}, ${c}). Try starting a new longest path from here.`,
          `FOR r=${r}, c=${c}`,
          r, c, -1
        );

        pushStep(
          30, 25, 14, 34,
          `Call dfs(r=${r}, c=${c}, prevVal=-1) to compute the longest increasing path starting at (${r}, ${c}).`,
          `dfs(r=${r}, c=${c}, prevVal=-1)`,
          r, c, -1
        );

        const pathLen = dfsSim(r, c, -1);
        const oldAns = currentAns;
        currentAns = Math.max(currentAns, pathLen);

        pushStep(
          30, 25, 14, 34,
          `dfs(r=${r}, c=${c}) returned ${pathLen}. Update global max path length: max(${oldAns}, ${pathLen}) = ${currentAns}.`,
          `ans = max(ans, ${pathLen})  →  ${currentAns}`,
          r, c, -1
        );
      }
    }

    pushStep(
      33, 26, 17, 37,
      `All cells checked! The longest increasing path in the matrix has length ${currentAns}.`,
      `RETURN ans  →  ${currentAns}`,
      -1, -1, -1
    );

    return { steps: tempSteps, stepLineNumbers: lines };
  }, [matrix]);

  const step = steps[currentStep] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  // Coordinates of cell center relative to grid wrapper
  const getCellCenter = (r: number, c: number) => {
    const cellSize = 64;
    const gap = 8;
    // border & padding offset
    const x = c * (cellSize + gap) + cellSize / 2 + 16;
    const y = r * (cellSize + gap) + cellSize / 2 + 16;
    return { x, y };
  };

  return (
    <div className="space-y-6">
      <VisualizationLayout
        controls={
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
        }
        leftContent={
          <div className="space-y-6">
            {/* Matrix Grid Card */}
            <Card className="p-6 bg-card border border-border shadow-sm flex flex-col items-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 self-start">
                Matrix Grid & Paths
              </span>

              <div className="relative p-4 bg-muted/10 border border-border/30 rounded-2xl select-none">
                {/* SVG Connections Overlay */}
                {step.activeStack.length > 1 && (
                  <svg className="absolute inset-0 pointer-events-none w-full h-full z-10">
                    <defs>
                      <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 2 L 10 5 L 0 8 z" fill="rgb(59 130 246)" />
                      </marker>
                    </defs>
                    {step.activeStack.map((curr, idx) => {
                      if (idx === 0) return null;
                      const prev = step.activeStack[idx - 1];
                      const start = getCellCenter(prev[0], prev[1]);
                      const end = getCellCenter(curr[0], curr[1]);
                      
                      const dx = end.x - start.x;
                      const dy = end.y - start.y;
                      const len = Math.sqrt(dx * dx + dy * dy);
                      const shrink = 18;
                      const sx = start.x + (dx / len) * shrink;
                      const sy = start.y + (dy / len) * shrink;
                      const ex = end.x - (dx / len) * shrink;
                      const ey = end.y - (dy / len) * shrink;

                      return (
                        <line
                          key={idx}
                          x1={sx}
                          y1={sy}
                          x2={ex}
                          y2={ey}
                          stroke="rgb(59 130 246)"
                          strokeWidth="3"
                          markerEnd="url(#arrow)"
                        />
                      );
                    })}
                  </svg>
                )}

                <div className="grid grid-cols-3 gap-2">
                  {matrix.map((row, r) =>
                    row.map((val, c) => {
                      const isCurrent = step.r === r && step.c === c;
                      const isStackIdx = step.activeStack.findIndex(([sr, sc]) => sr === r && sc === c);
                      const inStack = isStackIdx !== -1;
                      const memoVal = step.dp[`${r},${c}`];
                      const hasMemo = memoVal !== undefined;
                      const isNeighbor = step.neighborExplored && step.neighborExplored[0] === r && step.neighborExplored[1] === c;

                      let cellBorder = 'border-border/50';
                      let cellBg = 'bg-card';
                      let textClass = 'text-foreground/80';

                      if (isCurrent && !inStack) {
                        cellBg = 'bg-amber-500/10 dark:bg-amber-500/5';
                        cellBorder = 'border-amber-500 ring-2 ring-amber-500/20';
                      } else if (inStack) {
                        cellBg = isStackIdx === step.activeStack.length - 1
                          ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/30'
                          : 'bg-blue-500/10 border-blue-400';
                        textClass = 'text-blue-600 dark:text-blue-400 font-extrabold';
                      } else if (isNeighbor) {
                        cellBg = 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/20';
                        textClass = 'text-rose-500 font-bold';
                      }

                      return (
                        <div
                          key={`${r}-${c}`}
                          className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center relative font-mono text-lg font-bold transition-all duration-200 ${cellBg} ${cellBorder}`}
                        >
                          <span className={textClass}>{val}</span>

                          {/* Memo Badge */}
                          {hasMemo && (
                            <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[8px] font-black tracking-tighter">
                              len={memoVal}
                            </span>
                          )}

                          {/* Stack Position Badge */}
                          {inStack && (
                            <span className="absolute bottom-1 left-1 text-[8px] font-semibold text-blue-500">
                              #{isStackIdx + 1}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex gap-4 text-xs mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500" />
                  <span className="text-muted-foreground">Active DFS Path</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
                  <span className="text-muted-foreground">DP Memoized</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-500/10 border border-amber-500" />
                  <span className="text-muted-foreground">Current Root</span>
                </div>
              </div>
            </Card>

            {/* Explanation card */}
            <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm flex items-center min-h-[70px]">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Narrative
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
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
            activeStepIndex={currentStep}
            onLanguageChange={() => setCurrentStep(0)}
          />
        }
      />
    </div>
  );
};
export default LongestIncreasingPathInAMatrixVisualization;
