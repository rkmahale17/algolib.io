import React, { useState, useEffect, useRef } from "react";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface Step {
  board: number[][];
  row: number;
  col: number;
  value: number;
  message: string;
  solved: boolean;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function solveSudoku(board: number[][]): boolean {
  function isValid(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  }
  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(row, col, num)) {
              board[row][col] = num;
              if (solve()) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  return solve();
}`,
  python: `def solveSudoku(board):
    def isValid(row, col, num):
        for i in range(9):
            if board[row][i] == num or board[i][col] == num:
                return False
        boxRow = (row // 3) * 3
        boxCol = (col // 3) * 3
        for i in range(3):
            for j in range(3):
                if board[boxRow + i][boxCol + j] == num:
                    return False
        return True
    def solve():
        for r in range(9):
            for c in range(9):
                if board[r][c] == 0:
                    for num in range(1, 10):
                        if isValid(r, c, num):
                            board[r][c] = num
                            if solve():
                                return True
                            board[r][c] = 0
                    return False
        return True
    solve()`,
  java: `public static class Solution {
    public void solveSudoku(int[][] board) {
        solve(board);
    }
    private boolean solve(int[][] board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == 0) {
                    for (int num = 1; num <= 9; num++) {
                        if (isValid(board, r, c, num)) {
                            board[r][c] = num;
                            if (solve(board)) return true;
                            board[r][c] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    private boolean isValid(int[][] board, int row, int col, int num) {
        for (int i = 0; i < 9; i++) {
            if (board[row][i] == num || board[i][col] == num) return false;
        }
        int boxRow = (row / 3) * 3;
        int boxCol = (col / 3) * 3;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] == num) return false;
            }
        }
        return true;
    }
}`,
  cpp: `class Solution {
public:
    void solveSudoku(vector<vector<int>>& board) {
        solve(board);
    }
private:
    bool solve(vector<vector<int>>& board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == 0) {
                    for (int num = 1; num <= 9; num++) {
                        if (isValid(board, r, c, num)) {
                            board[r][c] = num;
                            if (solve(board)) return true;
                            board[r][c] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    bool isValid(vector<vector<int>>& board, int row, int col, int num) {
        for (int i = 0; i < 9; i++) {
            if (board[row][i] == num || board[i][col] == num) return false;
        }
        int boxRow = (row / 3) * 3;
        int boxCol = (col / 3) * 3;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] == num) return false;
            }
        }
        return true;
    }
};`
};

export const SudokuSolverVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateStepsData = () => {
    const board = [
      [0, 2, 0, 4],
      [4, 0, 2, 0],
      [0, 4, 0, 2],
      [2, 0, 4, 0]
    ];
    const steps: Step[] = [];
    const size = 4;
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

    function isValid(row: number, col: number, num: number): boolean {
      for (let i = 0; i < size; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
      }
      const boxRow = Math.floor(row / 2) * 2;
      const boxCol = Math.floor(col / 2) * 2;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          if (board[boxRow + i][boxCol + j] === num) return false;
        }
      }
      return true;
    }

    function solve(): boolean {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= size; num++) {
              steps.push({
                board: board.map(r => [...r]),
                row,
                col,
                value: num,
                message: `Checking if ${num} is valid at (${row}, ${col})`,
                solved: false,
                pseudoStep: `IF isValid(row = ${row}, col = ${col}, num = ${num})`
              });
              addLines(20, 18, 10, 12);

              if (isValid(row, col, num)) {
                board[row][col] = num;
                steps.push({
                  board: board.map(r => [...r]),
                  row,
                  col,
                  value: num,
                  message: `Placed ${num} at (${row}, ${col})`,
                  solved: false,
                  pseudoStep: `SET board[${row}][${col}] = ${num}`
                });
                addLines(21, 19, 11, 13);

                steps.push({
                  board: board.map(r => [...r]),
                  row,
                  col,
                  value: num,
                  message: `Recursively solve Sudoku with updated board`,
                  solved: false,
                  pseudoStep: `CALL solve()`
                });
                addLines(22, 20, 12, 14);

                if (solve()) return true;

                board[row][col] = 0;
                steps.push({
                  board: board.map(r => [...r]),
                  row,
                  col,
                  value: 0,
                  message: `Backtrack: Remove ${num} from (${row}, ${col})`,
                  solved: false,
                  pseudoStep: `SET board[${row}][${col}] = 0 (backtrack)`
                });
                addLines(23, 22, 13, 15);
              }
            }
            return false;
          }
        }
      }

      steps.push({
        board: board.map(r => [...r]),
        row: -1,
        col: -1,
        value: 0,
        message: "Sudoku solved!",
        solved: true,
        pseudoStep: "RETURN True"
      });
      addLines(30, 24, 20, 22);
      return true;
    }

    solve();

    const lastStep = steps[steps.length - 1];
    steps.push({
      ...lastStep,
      message: "Solving process complete.",
      pseudoStep: "DONE"
    });
    addLines(30, 24, 20, 22);

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
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">4x4 Sudoku Board (Simplified)</h3>

            <div className="grid gap-1 mb-6 mx-auto" style={{ gridTemplateColumns: `repeat(4, minmax(0, 1fr))`, maxWidth: "240px" }}>
              {currentStep.board.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square flex items-center justify-center rounded border-2 font-bold text-xl transition-all ${
                      r === currentStep.row && c === currentStep.col
                        ? "bg-primary/20 border-primary scale-110 text-foreground z-10"
                        : cell !== 0
                        ? currentStep.solved
                          ? "bg-green-500/20 border-green-500 text-green-600 dark:text-green-400"
                          : "bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "bg-card border-border text-foreground"
                    }`}
                  >
                    {cell !== 0 ? cell : ""}
                  </div>
                ))
              )}
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
              "current row": currentStep.row >= 0 ? currentStep.row : "done",
              "current col": currentStep.col >= 0 ? currentStep.col : "done",
              "trying value": currentStep.value || "none",
              "solved": String(currentStep.solved)
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
