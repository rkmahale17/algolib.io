import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  board: number[][];
  row: number;
  col: number;
  value: number;
  message: string;
  lineNumber: number;
  solved: boolean;
}

export const SudokuSolverVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef<number | null>(null);

  const code = `function solveSudoku(board: number[][]): boolean {
  function isValid(row: number, col: number, num: number): boolean {
    // Check row and column
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    // Check 3x3 box
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
              board[row][col] = 0; // Backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  return solve();
}`;

  const generateSteps = () => {
    // Simplified 4x4 Sudoku for visualization
    const board = [
      [0, 2, 0, 4],
      [4, 0, 2, 0],
      [0, 4, 0, 2],
      [2, 0, 4, 0]
    ];
    const newSteps: Step[] = [];
    const size = 4;

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
              newSteps.push({
                board: board.map(r => [...r]),
                row,
                col,
                value: num,
                message: `Trying ${num} at (${row}, ${col})`,
                lineNumber: 21,
                solved: false
              });

              if (isValid(row, col, num)) {
                board[row][col] = num;
                newSteps.push({
                  board: board.map(r => [...r]),
                  row,
                  col,
                  value: num,
                  message: `Placed ${num} at (${row}, ${col})`,
                  lineNumber: 23,
                  solved: false
                });

                if (solve()) return true;

                board[row][col] = 0;
                newSteps.push({
                  board: board.map(r => [...r]),
                  row,
                  col,
                  value: 0,
                  message: `Backtrack: Remove from (${row}, ${col})`,
                  lineNumber: 25,
                  solved: false
                });
              }
            }
            return false;
          }
        }
      }
      
      newSteps.push({
        board: board.map(r => [...r]),
        row: -1,
        col: -1,
        value: 0,
        message: 'Sudoku solved!',
        lineNumber: 31,
        solved: true
      });
      return true;
    }

    solve();
    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
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
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">4x4 Sudoku Board (Simplified)</h3>
        
        <div className="grid gap-1 mb-6" style={{ gridTemplateColumns: `repeat(4, minmax(0, 1fr))`, maxWidth: '300px' }}>
          {currentStep.board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`aspect-square flex items-center justify-center rounded border-2 font-bold text-xl transition-all ${
                  r === currentStep.row && c === currentStep.col
                    ? 'bg-primary/20 border-primary scale-110'
                    : cell !== 0
                    ? currentStep.solved ? 'bg-green-500/20 border-green-500' : 'bg-blue-500/20 border-blue-500'
                    : 'bg-card border-border'
                }`}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))
          )}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
             <div className="mt-4 p-4 bg-muted rounded">
               <VariablePanel
        variables={{
          'current row': currentStep.row >= 0 ? currentStep.row : 'done',
          'current col': currentStep.col >= 0 ? currentStep.col : 'done',
          'trying value': currentStep.value || 'none',
          'solved': String(currentStep.solved)
        }}
      />
        </div>

      </div>
      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
</div>
</div>
  );
};
