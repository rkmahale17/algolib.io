import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { Info, CheckCircle2, Grid } from 'lucide-react';

interface Step {
  board: string[][];
  r: number | null;
  c: number | null;
  message: string;
  lineNumber: number;
  isMatch?: boolean;
  activeDFSPath: [number, number][];
}

export const SurroundedRegionsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function solve(board: string[][]): void {
  const ROWS = board.length;
  const COLS = board[0].length;

  const capture = (r: number, c: number): void => {
    if (
      r < 0 ||
      c < 0 ||
      r >= ROWS ||
      c >= COLS ||
      board[r][c] !== "O"
    ) {
      return;
    }

    board[r][c] = "T";

    capture(r + 1, c);
    capture(r - 1, c);
    capture(r, c + 1);
    capture(r, c - 1);
  };

  for (let r = 0; r < ROWS; r++) {
    if (board[r][0] === "O") {
      capture(r, 0);
    }
    if (board[r][COLS - 1] === "O") {
      capture(r, COLS - 1);
    }
  }

  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === "O") {
      capture(0, c);
    }
    if (board[ROWS - 1][c] === "O") {
      capture(ROWS - 1, c);
    }
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
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const board = [
      ["X", "X", "X", "X"],
      ["X", "O", "O", "X"],
      ["X", "X", "O", "X"],
      ["X", "O", "X", "X"]
    ].map(row => [...row]);

    const ROWS = board.length;
    const COLS = board[0].length;

    const snapshot = (
      msg: string,
      line: number,
      r: number | null,
      c: number | null,
      isMatch: boolean = false,
      activeDFS: [number, number][] = []
    ) => {
      s.push({
        board: board.map(row => [...row]),
        r,
        c,
        message: msg,
        lineNumber: line,
        isMatch,
        activeDFSPath: [...activeDFS]
      });
    };

    snapshot("Initialize board state of size 4x4.", 1, null, null);
    snapshot("Get ROWS = 4 and COLS = 4 from the board dimensions.", 2, null, null);

    const captureHelper = (currR: number, currC: number, path: [number, number][]) => {
      const newPath = [...path, [currR, currC] as [number, number]];
      
      snapshot(`[DFS] Checking cell (${currR}, ${currC}) in recursion.`, 6, currR, currC, false, newPath);

      if (
        currR < 0 ||
        currC < 0 ||
        currR >= ROWS ||
        currC >= COLS
      ) {
        snapshot(`[DFS] Cell (${currR}, ${currC}) is out of bounds. Return.`, 7, currR, currC, false, path);
        return;
      }

      if (board[currR][currC] !== "O") {
        snapshot(`[DFS] Cell (${currR}, ${currC}) is '${board[currR][currC]}' (not 'O'). Return.`, 11, currR, currC, false, path);
        return;
      }

      board[currR][currC] = "T";
      snapshot(`[DFS] Passed! Mark cell (${currR}, ${currC}) as 'T' (connected to border).`, 16, currR, currC, true, newPath);

      snapshot(`[DFS] Recurse Down from (${currR}, ${currC}).`, 18, currR, currC, false, newPath);
      captureHelper(currR + 1, currC, newPath);

      snapshot(`[DFS] Recurse Up from (${currR}, ${currC}).`, 19, currR, currC, false, newPath);
      captureHelper(currR - 1, currC, newPath);

      snapshot(`[DFS] Recurse Right from (${currR}, ${currC}).`, 20, currR, currC, false, newPath);
      captureHelper(currR, currC + 1, newPath);

      snapshot(`[DFS] Recurse Left from (${currR}, ${currC}).`, 21, currR, currC, false, newPath);
      captureHelper(currR, currC - 1, newPath);
      
      snapshot(`[DFS] Finished exploring neighbors of (${currR}, ${currC}). Backtracking.`, 22, currR, currC, false, path);
    };

    snapshot("Phase 1: Scan the left and right borders of the board for any 'O' cells.", 24, null, null);
    for (let r = 0; r < ROWS; r++) {
      snapshot(`Phase 1: Check left border cell at (${r}, 0).`, 25, r, 0);
      if (board[r][0] === "O") {
        snapshot(`Phase 1: Found border 'O' at (${r}, 0)! Starting DFS to trace connectivity.`, 26, r, 0, true);
        captureHelper(r, 0, []);
      }

      snapshot(`Phase 1: Check right border cell at (${r}, ${COLS - 1}).`, 28, r, COLS - 1);
      if (board[r][COLS - 1] === "O") {
        snapshot(`Phase 1: Found border 'O' at (${r}, ${COLS - 1})! Starting DFS to trace connectivity.`, 29, r, COLS - 1, true);
        captureHelper(r, COLS - 1, []);
      }
    }

    snapshot("Phase 1: Scan the top and bottom borders of the board for any remaining border 'O's.", 33, null, null);
    for (let c = 0; c < COLS; c++) {
      snapshot(`Phase 1: Check top border cell at (0, ${c}).`, 34, 0, c);
      if (board[0][c] === "O") {
        snapshot(`Phase 1: Found border 'O' at (0, ${c})! Starting DFS.`, 35, 0, c, true);
        captureHelper(0, c, []);
      }

      snapshot(`Phase 1: Check bottom border cell at (${ROWS - 1}, ${c}).`, 37, ROWS - 1, c);
      if (board[ROWS - 1][c] === "O") {
        snapshot(`Phase 1: Found border 'O' at (${ROWS - 1}, ${c})! Starting DFS.`, 38, ROWS - 1, c, true);
        captureHelper(ROWS - 1, c, []);
      }
    }

    snapshot("Phase 2: Iterate through every cell. Capture surrounded 'O's to 'X', and restore 'T's back to 'O'.", 42, null, null);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cellVal = board[r][c];
        snapshot(`Phase 2: Inspecting cell (${r}, ${c}) with value '${cellVal}'.`, 43, r, c);
        if (cellVal === "O") {
          board[r][c] = "X";
          snapshot(`Phase 2: Cell (${r}, ${c}) is 'O'. Since it was not connected to any border, it is captured! Changing to 'X'.`, 45, r, c, true);
        } else if (cellVal === "T") {
          board[r][c] = "O";
          snapshot(`Phase 2: Cell (${r}, ${c}) is 'T'. This is a border-connected 'O', so it survives. Restoring to 'O'.`, 47, r, c, true);
        }
      }
    }

    snapshot("Completed Surrounded Regions execution! All surrounded regions are captured, and border-connected regions are preserved.", 51, null, null, true);

    return s;
  }, []);

  const step = steps[currentStepIndex];

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
                {/* Visual Border Overlay */}
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

          {/* Commentary Box placed AT THE BOTTOM of the visualization */}
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

          {/* VariablePanel MUST be placed BELOW the commentary box */}
          <VariablePanel
            variables={{
              row_r: step?.r ?? 'N/A',
              col_c: step?.c ?? 'N/A',
              active_dfs_depth: step?.activeDFSPath?.length || 0,
              board_state: step?.r !== null && step?.c !== null && step.board[step.r]?.[step.c] !== undefined ? `'${step.board[step.r][step.c]}'` : 'N/A'
            }}
          />
        </div>
      }
      rightContent={
        <div className="space-y-4 h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[step?.lineNumber || 1]}
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
