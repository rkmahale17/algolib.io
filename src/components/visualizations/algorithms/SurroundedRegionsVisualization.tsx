import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { Info, CheckCircle2, Grid } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  board: string[][];
  r: number | null;
  c: number | null;
  message: string;
  isMatch?: boolean;
  activeDFSPath: [number, number][];
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function solve(board: string[][]): void {
  if (board.length === 0 || board[0].length === 0) return;
  const ROWS = board.length;
  const COLS = board[0].length;
  const capture = (r: number, c: number): void => {
    if (r < 0 || c < 0 || r >= ROWS || c >= COLS || board[r][c] !== "O") {
      return;
    }
    board[r][c] = "T";
    capture(r + 1, c);
    capture(r - 1, c);
    capture(r, c + 1);
    capture(r, c - 1);
  };
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === "O") capture(0, c);
    if (board[ROWS - 1][c] === "O") capture(ROWS - 1, c);
  }
  for (let r = 0; r < ROWS; r++) {
    if (board[r][0] === "O") capture(r, 0);
    if (board[r][COLS - 1] === "O") capture(r, COLS - 1);
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === "O") {
        board[r][c] = "X";
      } else if (board[r][c] === "T") {
        board[r][c] = "O";
      }
    }
  }
}`,
  python: `def solve(board: List[List[str]]) -> None:
    if not board or not board[0]:
        return
    rows, cols = len(board), len(board[0])
    def capture(r: int, c: int) -> None:
        if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != "O":
            return
        board[r][c] = "T"
        capture(r + 1, c)
        capture(r - 1, c)
        capture(r, c + 1)
        capture(r, c - 1)
    for r in range(rows):
        if board[r][0] == "O":
            capture(r, 0)
        if board[r][cols - 1] == "O":
            capture(r, cols - 1)
    for c in range(cols):
        if board[0][c] == "O":
            capture(0, c)
        if board[rows - 1][c] == "O":
            capture(rows - 1, c)
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == "O":
                board[r][c] = "X"
            elif board[r][c] == "T":
                board[r][c] = "O"`,
  java: `public static class Solution {
    private int ROWS;
    private int COLS;
    private void capture(char[][] board, int r, int c) {
        if (r < 0 || c < 0 || r >= ROWS || c >= COLS || board[r][c] != 'O') {
            return;
        }
        board[r][c] = 'T';
        capture(board, r + 1, c);
        capture(board, r - 1, c);
        capture(board, r, c + 1);
        capture(board, r, c - 1);
    }
    public void solve(char[][] board) {
        if (board == null || board.length == 0 || board[0].length == 0) {
            return;
        }
        ROWS = board.length;
        COLS = board[0].length;
        for (int c = 0; c < COLS; c++) {
            if (board[0][c] == 'O') {
                capture(board, 0, c);
            }
            if (board[ROWS - 1][c] == 'O') {
                capture(board, ROWS - 1, c);
            }
        }
        for (int r = 0; r < ROWS; r++) {
            if (board[r][0] == 'O') {
                capture(board, r, 0);
            }
            if (board[r][COLS - 1] == 'O') {
                capture(board, r, COLS - 1);
            }
        }
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                if (board[r][c] == 'O') {
                    board[r][c] = 'X';
                } else if (board[r][c] == 'T') {
                    board[r][c] = 'O';
                }
            }
        }
    }
}`,
  cpp: `class Solution {
public:
    int ROWS;
    int COLS;
    void capture(vector<vector<char>>& board, int r, int c) {
        if (r < 0 || c < 0 || r >= ROWS || c >= COLS || board[r][c] != 'O') {
            return;
        }
        board[r][c] = 'T';
        capture(board, r + 1, c);
        capture(board, r - 1, c);
        capture(board, r, c + 1);
        capture(board, r, c - 1);
    }
    void solve(vector<vector<char>>& board) {
        if (board.empty() || board[0].empty()) {
            return;
        }
        ROWS = board.size();
        COLS = board[0].size();
        for (int c = 0; c < COLS; ++c) {
            if (board[0][c] == 'O') {
                capture(board, 0, c);
            }
            if (board[ROWS - 1][c] == 'O') {
                capture(board, ROWS - 1, c);
            }
        }
        for (int r = 0; r < ROWS; ++r) {
            if (board[r][0] == 'O') {
                capture(board, r, 0);
            }
            if (board[r][COLS - 1] == 'O') {
                capture(board, r, COLS - 1);
            }
        }
        for (int r = 0; r < ROWS; ++r) {
            for (int c = 0; c < COLS; ++c) {
                if (board[r][c] == 'O') {
                    board[r][c] = 'X';
                } else if (board[r][c] == 'T') {
                    board[r][c] = 'O';
                }
            }
        }
    }
};`
};

export const SurroundedRegionsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const board = [
      ["X", "X", "X", "X"],
      ["X", "O", "O", "X"],
      ["X", "X", "O", "X"],
      ["X", "O", "X", "X"]
    ].map(row => [...row]);

    const ROWS = board.length;
    const COLS = board[0].length;

    const addStep = (
      msg: string,
      pseudo: string,
      r: number | null,
      c: number | null,
      isMatch: boolean = false,
      activeDFS: [number, number][] = [],
      ts: number, py: number, jv: number, cp: number
    ) => {
      s.push({
        board: board.map(row => [...row]),
        r,
        c,
        message: msg,
        pseudoStep: pseudo,
        isMatch,
        activeDFSPath: [...activeDFS],
        variables: {
          row_r: r ?? 'N/A',
          col_c: c ?? 'N/A',
          active_dfs_depth: activeDFS.length,
          board_state: r !== null && c !== null && board[r]?.[c] !== undefined ? `'${board[r][c]}'` : 'N/A'
        }
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      "Initialize board state of size 4x4.",
      "solve(board)",
      null, null, false, [],
      1, 1, 14, 15
    );
    addStep(
      "Get ROWS = 4 and COLS = 4 from the board dimensions.",
      "SET rows = len(board), cols = len(board[0])",
      null, null, false, [],
      3, 4, 18, 19
    );

    const captureHelper = (currR: number, currC: number, path: [number, number][]) => {
      const newPath = [...path, [currR, currC] as [number, number]];
      
      addStep(
        `[DFS] Checking cell (${currR}, ${currC}) in recursion.`,
        `capture(r=${currR}, c=${currC})`,
        currR, currC, false, newPath,
        6, 6, 5, 6
      );

      if (
        currR < 0 ||
        currC < 0 ||
        currR >= ROWS ||
        currC >= COLS
      ) {
        addStep(
          `[DFS] Cell (${currR}, ${currC}) is out of bounds. Return.`,
          "IF out_of_bounds  →  RETURN",
          currR, currC, false, path,
          7, 7, 6, 7
        );
        return;
      }

      if (board[currR][currC] !== "O") {
        addStep(
          `[DFS] Cell (${currR}, ${currC}) is '${board[currR][currC]}' (not 'O'). Return.`,
          `IF board[r][c] != "O"  →  RETURN`,
          currR, currC, false, path,
          7, 7, 6, 7
        );
        return;
      }

      board[currR][currC] = "T";
      addStep(
        `[DFS] Passed! Mark cell (${currR}, ${currC}) as 'T' (connected to border).`,
        `board[r][c] = "T"`,
        currR, currC, true, newPath,
        9, 8, 8, 9
      );

      addStep(
        `[DFS] Recurse Down from (${currR}, ${currC}).`,
        "capture(r + 1, c)",
        currR, currC, false, newPath,
        10, 9, 9, 10
      );
      captureHelper(currR + 1, currC, newPath);

      addStep(
        `[DFS] Recurse Up from (${currR}, ${currC}).`,
        "capture(r - 1, c)",
        currR, currC, false, newPath,
        11, 10, 10, 11
      );
      captureHelper(currR - 1, currC, newPath);

      addStep(
        `[DFS] Recurse Right from (${currR}, ${currC}).`,
        "capture(r, c + 1)",
        currR, currC, false, newPath,
        12, 11, 11, 12
      );
      captureHelper(currR, currC + 1, newPath);

      addStep(
        `[DFS] Recurse Left from (${currR}, ${currC}).`,
        "capture(r, c - 1)",
        currR, currC, false, newPath,
        13, 12, 12, 13
      );
      captureHelper(currR, currC - 1, newPath);
      
      addStep(
        `[DFS] Finished exploring neighbors of (${currR}, ${currC}). Backtracking.`,
        "RETURN // backtrack",
        currR, currC, false, path,
        14, 12, 13, 14
      );
    };

    addStep(
      "Phase 1: Scan the top and bottom borders of the board for any 'O' cells.",
      "FOR c = 0 TO cols - 1",
      null, null, false, [],
      15, 18, 20, 21
    );
    for (let c = 0; c < COLS; c++) {
      addStep(
        `Phase 1: Check top border cell at (0, ${c}).`,
        `IF board[0][${c}] == "O"`,
        0, c, false, [],
        16, 19, 21, 22
      );
      if (board[0][c] === "O") {
        addStep(
          `Phase 1: Found border 'O' at (0, ${c})! Starting DFS.`,
          `capture(0, ${c})`,
          0, c, true, [],
          16, 20, 22, 23
        );
        captureHelper(0, c, []);
      }

      addStep(
        `Phase 1: Check bottom border cell at (${ROWS - 1}, ${c}).`,
        `IF board[rows - 1][${c}] == "O"`,
        ROWS - 1, c, false, [],
        17, 21, 24, 25
      );
      if (board[ROWS - 1][c] === "O") {
        addStep(
          `Phase 1: Found border 'O' at (${ROWS - 1}, ${c})! Starting DFS.`,
          `capture(rows - 1, ${c})`,
          ROWS - 1, c, true, [],
          17, 22, 25, 26
        );
        captureHelper(ROWS - 1, c, []);
      }
    }

    addStep(
      "Phase 1: Scan the left and right borders of the board for any remaining border 'O's.",
      "FOR r = 0 TO rows - 1",
      null, null, false, [],
      19, 13, 28, 29
    );
    for (let r = 0; r < ROWS; r++) {
      addStep(
        `Phase 1: Check left border cell at (${r}, 0).`,
        `IF board[${r}][0] == "O"`,
        r, 0, false, [],
        20, 14, 29, 30
      );
      if (board[r][0] === "O") {
        addStep(
          `Phase 1: Found border 'O' at (${r}, 0)! Starting DFS to trace connectivity.`,
          `capture(${r}, 0)`,
          r, 0, true, [],
          20, 15, 30, 31
        );
        captureHelper(r, 0, []);
      }

      addStep(
        `Phase 1: Check right border cell at (${r}, ${COLS - 1}).`,
        `IF board[${r}][cols - 1] == "O"`,
        r, COLS - 1, false, [],
        21, 16, 32, 33
      );
      if (board[r][COLS - 1] === "O") {
        addStep(
          `Phase 1: Found border 'O' at (${r}, ${COLS - 1})! Starting DFS to trace connectivity.`,
          `capture(${r}, cols - 1)`,
          r, COLS - 1, true, [],
          21, 17, 33, 34
        );
        captureHelper(r, COLS - 1, []);
      }
    }

    addStep(
      "Phase 2: Iterate through every cell. Capture surrounded 'O's to 'X', and restore 'T's back to 'O'.",
      "FOR r = 0 TO rows - 1, c = 0 TO cols - 1",
      null, null, false, [],
      23, 23, 36, 37
    );
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cellVal = board[r][c];
        addStep(
          `Phase 2: Inspecting cell (${r}, ${c}) with value '${cellVal}'.`,
          `board[${r}][${c}]  →  '${cellVal}'`,
          r, c, false, [],
          24, 24, 37, 38
        );
        if (cellVal === "O") {
          board[r][c] = "X";
          addStep(
            `Phase 2: Cell (${r}, ${c}) is 'O'. Since it was not connected to any border, it is captured! Changing to 'X'.`,
            `board[r][c] = "X"`,
            r, c, true, [],
            26, 26, 39, 40
          );
        } else if (cellVal === "T") {
          board[r][c] = "O";
          addStep(
            `Phase 2: Cell (${r}, ${c}) is 'T'. This is a border-connected 'O', so it survives. Restoring to 'O'.`,
            `board[r][c] = "O"`,
            r, c, true, [],
            28, 28, 41, 42
          );
        }
      }
    }

    addStep(
      "Completed Surrounded Regions execution! All surrounded regions are captured, and border-connected regions are preserved.",
      "// solve completed",
      null, null, true, [],
      32, 28, 45, 46
    );

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[400px] flex flex-col shadow-lg shadow-primary/5">
            <h3 className="text-sm font-semibold mb-6 flex items-center justify-center gap-2 text-muted-foreground uppercase tracking-widest">
              <Grid className="w-4 h-4 text-primary" /> Surrounded Regions Grid
            </h3>

            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col gap-2 p-6 bg-muted/10 border border-border/50 rounded-xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 rounded-t-xl"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 rounded-b-xl"></div>
                <div className="absolute top-0 left-0 h-full w-1 bg-primary/20 rounded-l-xl"></div>
                <div className="absolute top-0 right-0 h-full w-1 bg-primary/20 rounded-r-xl"></div>

                <div className="z-10 m-2 space-y-3">
                  {step?.board && step.board.map((row, r) => (
                    <div key={r} className="flex gap-3 justify-center">
                      {row.map((val, c) => {
                        const isCurrent = step.r === r && step.c === c;
                        const isDFSPath = step.activeDFSPath?.some(([pr, pc]) => pr === r && pc === c);
                        
                        let cellStyle = "bg-muted/50 border-border text-foreground";
                        if (val === "X") {
                          cellStyle = "bg-slate-200 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300";
                        } else if (val === "O") {
                          cellStyle = "bg-blue-500/20 border-blue-500/60 text-blue-950 dark:text-blue-200";
                        } else if (val === "T") {
                          cellStyle = "bg-amber-500/20 border-amber-500/60 text-amber-700 dark:text-amber-300 font-bold";
                        }

                        return (
                          <div key={c} className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 z-10 
                                ${isCurrent ? 'scale-125 shadow-xl ring-4 ring-primary ring-offset-2 ring-offset-background z-20' : ''} 
                                ${isDFSPath && !isCurrent ? 'ring-2 ring-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : ''} 
                                ${cellStyle}`}
                            >
                              {val}
                            </div>
                            <span className="text-[9px] text-muted-foreground mt-1.5 opacity-75 font-mono font-bold tracking-wider">
                              [{r},{c}]
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
                 <div className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-600 shrink-0"></div> Wall / Captured (X)
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 shrink-0">
                 <div className="w-3 h-3 rounded bg-blue-500/40 shrink-0"></div> Open Space (O)
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 shrink-0">
                 <div className="w-3 h-3 rounded bg-amber-500/40 shrink-0"></div> Safe / Border Trace (T)
              </div>
            </div>
          </Card>

          <Card className={`p-5 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm min-h-[120px] flex items-center ${step?.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${step?.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                {step?.isMatch ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Logic
                </h4>
                <p className="text-[14px] font-medium leading-relaxed text-foreground/90">
                  {step?.message || ''}
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
  );
};
export default SurroundedRegionsVisualization;
