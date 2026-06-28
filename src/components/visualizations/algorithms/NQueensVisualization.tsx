import React, { useState, useEffect, useRef } from "react";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface Step {
  n: number;
  board: string[][];
  row: number;
  col: number;
  colSet: number[];
  posDiagSet: number[];
  negDiagSet: number[];
  allSolutions: string[][];
  message: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function solveNQueens(n: number): string[][] {
  const col = new Set<number>();
  const posDiag = new Set<number>();
  const negDiag = new Set<number>();
  const res: string[][] = [];
  const board: string[][] = Array.from({ length: n }, () => Array(n).fill('.'));
  function backtrack(r: number): void {
    if (r === n) {
      const copy = board.map(row => row.join(""));
      res.push(copy);
      return;
    }
    for (let c = 0; c < n; c++) {
      if (col.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) {
        continue;
      }
      col.add(c);
      posDiag.add(r + c);
      negDiag.add(r - c);
      board[r][c] = "Q";
      backtrack(r + 1);
      col.delete(c);
      posDiag.delete(r + c);
      negDiag.delete(r - c);
      board[r][c] = ".";
    }
  }
  backtrack(0);
  return res;
}`,
  python: `def solveNQueens(n):
    col = set()
    posDiag = set()
    negDiag = set()
    res = []
    board = [['.'] * n for _ in range(n)]
    def backtrack(r):
        if r == n:
            copy = [''.join(row) for row in board]
            res.append(copy)
            return
        for c in range(n):
            if c in col or (r + c) in posDiag or (r - c) in negDiag:
                continue
            col.add(c)
            posDiag.add(r + c)
            negDiag.add(r - c)
            board[r][c] = 'Q'
            backtrack(r + 1)
            col.remove(c)
            posDiag.remove(r + c)
            negDiag.remove(r - c)
            board[r][c] = '.'
    backtrack(0)
    return res`,
  java: `public static class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        char[][] board = new char[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                board[i][j] = '.';
            }
        }
        Set<Integer> col = new HashSet<>();
        Set<Integer> posDiag = new HashSet<>();
        Set<Integer> negDiag = new HashSet<>();
        backtrack(board, 0, col, posDiag, negDiag, res, n);
        return res;
    }
    private void backtrack(char[][] board, int r, Set<Integer> col, Set<Integer> posDiag, Set<Integer> negDiag, List<List<String>> res, int n) {
        if (r == n) {
            List<String> solution = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                solution.add(new String(board[i]));
            }
            res.add(solution);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (col.contains(c) || posDiag.contains(r + c) || negDiag.contains(r - c)) {
                continue;
            }
            col.add(c);
            posDiag.add(r + c);
            negDiag.add(r - c);
            board[r][c] = 'Q';
            backtrack(board, r + 1, col, posDiag, negDiag, res, n);
            col.remove(c);
            posDiag.remove(r + c);
            negDiag.remove(r - c);
            board[r][c] = '.';
        }
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> res;
        vector<string> board(n, string(n, '.'));
        unordered_set<int> col;
        unordered_set<int> posDiag;
        unordered_set<int> negDiag;
        backtrack(board, 0, col, posDiag, negDiag, res, n);
        return res;
    }
private:
    void backtrack(vector<string>& board,
                   int r,
                   unordered_set<int>& col,
                   unordered_set<int>& posDiag,
                   unordered_set<int>& negDiag,
                   vector<vector<string>>& res,
                   int n) {
        if (r == n) {
            res.push_back(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (col.count(c) || posDiag.count(r + c) || negDiag.count(r - c)) {
                continue;
            }
            col.insert(c);
            posDiag.insert(r + c);
            negDiag.insert(r - c);
            board[r][c] = 'Q';
            backtrack(board, r + 1, col, posDiag, negDiag, res, n);
            col.erase(c);
            posDiag.erase(r + c);
            negDiag.erase(r - c);
            board[r][c] = '.';
        }
    }
};`
};

export const NQueensVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateStepsData = () => {
    const n = 4;
    const steps: Step[] = [];
    const col = new Set<number>();
    const posDiag = new Set<number>();
    const negDiag = new Set<number>();
    const res: string[][] = [];
    const board: string[][] = Array.from({ length: n }, () => Array(n).fill('.'));
    const stepLineNumbers: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLineNumbers.typescript!.push(ts);
      stepLineNumbers.python!.push(py);
      stepLineNumbers.java!.push(java);
      stepLineNumbers.cpp!.push(cpp);
    };

    const addStep = (row: number, c: number, message: string, pseudoStep: string, ts: number, py: number, java: number, cpp: number) => {
      steps.push({
        n,
        board: board.map(r => [...r]),
        row,
        col: c,
        colSet: Array.from(col),
        posDiagSet: Array.from(posDiag),
        negDiagSet: Array.from(negDiag),
        allSolutions: [...res],
        message,
        pseudoStep
      });
      addLines(ts, py, java, cpp);
    };

    function backtrack(r: number): void {
      addStep(r, -1, `Checking row ${r}`, `CALL backtrack(r = ${r})`, 7, 7, 16, 13);

      addStep(r, -1, `Check base case: r === n`, `IF r === n  →  ${r} === ${n} ?`, 8, 8, 17, 20);

      if (r === n) {
        const copy = board.map(row => row.join(""));
        res.push(copy);
        addStep(r, -1, `Found a solution! Added to solutions list.`, `ADD board configuration to res`, 10, 10, 22, 21);
        addStep(r, -1, `Return from recursive call.`, `RETURN`, 11, 11, 23, 22);
        return;
      }

      for (let c = 0; c < n; c++) {
        addStep(r, c, `Checking column ${c} in row ${r}`, `FOR c = ${c} to ${n - 1}`, 13, 12, 25, 24);

        addStep(r, c, `Checking if cell (${r}, ${c}) is under attack`, `IF col(${c}) OR posDiag(${r + c}) OR negDiag(${r - c}) IN sets`, 14, 13, 26, 25);

        if (col.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) {
          addStep(r, c, `Cell (${r}, ${c}) is under attack. Skipping.`, `CONTINUE`, 15, 14, 27, 26);
          continue;
        }

        col.add(c);
        posDiag.add(r + c);
        negDiag.add(r - c);
        board[r][c] = "Q";
        addStep(r, c, `Placing queen at (${r}, ${c}) and updating constraint sets`, `SET board[${r}][${c}] = 'Q'`, 20, 18, 32, 31);

        addStep(r, c, `Recursively solve for next row r = ${r + 1}`, `CALL backtrack(r = ${r + 1})`, 21, 19, 33, 32);
        backtrack(r + 1);

        col.delete(c);
        posDiag.delete(r + c);
        negDiag.delete(r - c);
        board[r][c] = ".";
        addStep(r, c, `Backtrack: Removing queen from (${r}, ${c})`, `RESET board[${r}][${c}] = '.'`, 25, 23, 37, 36);
      }
    }

    addStep(-1, -1, `Starting N-Queens algorithm for n = ${n}`, `CALL solveNQueens(n = ${n})`, 1, 1, 2, 3);
    addStep(-1, -1, `Initializing sets and empty board`, `SET col = {}, posDiag = {}, negDiag = {}, board = [${n}x${n}]`, 2, 2, 4, 4);
    addStep(0, -1, `Calling backtrack(r = 0)`, `CALL backtrack(r = 0)`, 28, 24, 13, 9);
    backtrack(0);
    addStep(-1, -1, `Algorithm complete. Found ${res.length} solutions.`, `RETURN res`, 29, 25, 14, 10);

    const lastStep = steps[steps.length - 1];
    steps.push({
      ...lastStep,
      message: `Complete! Total solutions found: ${res.length}`,
      pseudoStep: "DONE"
    });
    addLines(29, 25, 14, 10);

    return { steps, stepLineNumbers };
  };

  const { steps, stepLineNumbers } = generateStepsData();

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
        speed={speed}
        onSpeedChange={setSpeed}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">{currentStep.n}-Queens Board</h3>

            <div className="grid gap-1 mb-6 mx-auto" style={{ gridTemplateColumns: `repeat(${currentStep.n}, minmax(0, 1fr))`, maxWidth: "320px" }}>
              {currentStep.board.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square flex items-center justify-center rounded border-2 text-2xl transition-all ${
                      r === currentStep.row && c === currentStep.col
                        ? "bg-primary/20 border-primary animate-pulse text-foreground"
                        : cell === "Q"
                        ? "bg-green-500/20 border-green-500 text-green-600 dark:text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                        : (r + c) % 2 === 0
                        ? "bg-muted/30 border-border text-foreground"
                        : "bg-card border-border text-foreground"
                    }`}
                  >
                    {cell === "Q" ? "♛" : ""}
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Occupied Sets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2 bg-muted/50 rounded border text-xs text-foreground">
                    <span className="font-semibold block mb-1">col:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentStep.colSet.length > 0
                        ? currentStep.colSet.map(v => <span key={v} className="px-1 bg-blue-500/20 rounded border border-blue-500/30">{v}</span>)
                        : "-"}
                    </div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded border text-xs text-foreground">
                    <span className="font-semibold block mb-1">posDiag (r+c):</span>
                    <div className="flex flex-wrap gap-1">
                      {currentStep.posDiagSet.length > 0
                        ? currentStep.posDiagSet.map(v => <span key={v} className="px-1 bg-purple-500/20 rounded border border-purple-500/30">{v}</span>)
                        : "-"}
                    </div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded border text-xs text-foreground">
                    <span className="font-semibold block mb-1">negDiag (r-c):</span>
                    <div className="flex flex-wrap gap-1">
                      {currentStep.negDiagSet.length > 0
                        ? currentStep.negDiagSet.map(v => <span key={v} className="px-1 bg-orange-500/20 rounded border border-orange-500/30">{v}</span>)
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Solutions Found: {currentStep.allSolutions.length}</h3>
                <div className="flex flex-wrap gap-4 max-h-48 overflow-y-auto p-2 border rounded bg-muted/20">
                  {currentStep.allSolutions.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No solutions found yet...</p>
                  )}
                  {currentStep.allSolutions.map((solution, idx) => (
                    <div key={idx} className="p-2 bg-card rounded border shadow-sm">
                      <div className="text-[10px] mb-1 font-medium text-foreground">Solution {idx + 1}</div>
                      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${currentStep.n}, minmax(0, 1fr))`, width: "60px" }}>
                        {solution.map((row, r) =>
                          row.split("").map((cell, c) => (
                            <div
                              key={`${r}-${c}`}
                              className={`aspect-square flex items-center justify-center text-[10px] ${
                                cell === "Q" ? "bg-green-500/40 text-green-700" : (r + c) % 2 === 0 ? "bg-muted" : "bg-background"
                              }`}
                            >
                              {cell === "Q" ? "♛" : ""}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {currentStep.message}
            </p>
          </div>

          <VariablePanel
            variables={{
              'n': currentStep.n,
              'currentRow': currentStep.row === -1 ? 'N/A' : currentStep.row,
              'currentCol': currentStep.col === -1 ? 'N/A' : currentStep.col,
              'colSetSize': currentStep.colSet.length,
              'solutions': currentStep.allSolutions.length
            }}
          />
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
