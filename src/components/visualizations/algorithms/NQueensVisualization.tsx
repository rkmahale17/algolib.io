import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  n: number;
  board: number[][];
  row: number;
  col: number;
  allSolutions: number[][][];
  message: string;
  lineNumber: number;
}

export const NQueensVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const board: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  function isSafe(row: number, col: number): boolean {
    // Check column and diagonals
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
      if (col - (row - i) >= 0 && board[i][col - (row - i)] === 1) return false;
      if (col + (row - i) < n && board[i][col + (row - i)] === 1) return false;
    }
    return true;
  }
  
  function solve(row: number) {
    if (row === n) {
      result.push(board.map(r => r.map(c => c === 1 ? 'Q' : '.').join('')));
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 1;
        solve(row + 1);
        board[row][col] = 0;
      }
    }
  }
  
  solve(0);
  return result;
}`;

  const generateSteps = () => {
    const n = 4;
    const newSteps: Step[] = [];
    const result: number[][][] = [];
    const board: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    function isSafe(row: number, col: number): boolean {
      for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false;
        if (col - (row - i) >= 0 && board[i][col - (row - i)] === 1) return false;
        if (col + (row - i) < n && board[i][col + (row - i)] === 1) return false;
      }
      return true;
    }

    function solve(row: number) {
      if (row === n) {
        result.push(board.map(r => [...r]));
        newSteps.push({
          n,
          board: board.map(r => [...r]),
          row: n,
          col: -1,
          allSolutions: result.map(s => s.map(r => [...r])),
          message: `Found solution ${result.length}!`,
          lineNumber: 14
        });
        return;
      }

      for (let col = 0; col < n; col++) {
        newSteps.push({
          n,
          board: board.map(r => [...r]),
          row,
          col,
          allSolutions: result.map(s => s.map(r => [...r])),
          message: `Trying to place queen at row ${row}, col ${col}`,
          lineNumber: 19
        });

        if (isSafe(row, col)) {
          board[row][col] = 1;
          newSteps.push({
            n,
            board: board.map(r => [...r]),
            row,
            col,
            allSolutions: result.map(s => s.map(r => [...r])),
            message: `Placed queen at (${row}, ${col})`,
            lineNumber: 21
          });

          solve(row + 1);

          board[row][col] = 0;
          newSteps.push({
            n,
            board: board.map(r => [...r]),
            row,
            col,
            allSolutions: result.map(s => s.map(r => [...r])),
            message: `Backtrack: Remove queen from (${row}, ${col})`,
            lineNumber: 23
          });
        } else {
          newSteps.push({
            n,
            board: board.map(r => [...r]),
            row,
            col,
            allSolutions: result.map(s => s.map(r => [...r])),
            message: `Position (${row}, ${col}) is not safe`,
            lineNumber: 20
          });
        }
      }
    }

    solve(0);
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
        <h3 className="text-lg font-semibold mb-4">{currentStep.n}-Queens Board</h3>
        
        <div className="grid gap-1 mb-6" style={{ gridTemplateColumns: `repeat(${currentStep.n}, minmax(0, 1fr))`, maxWidth: '400px' }}>
          {currentStep.board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`aspect-square flex items-center justify-center rounded border-2 font-bold text-2xl transition-all ${
                  r === currentStep.row && c === currentStep.col
                    ? 'bg-primary/20 border-primary'
                    : cell === 1
                    ? 'bg-green-500/20 border-green-500'
                    : (r + c) % 2 === 0
                    ? 'bg-muted/30 border-border'
                    : 'bg-card border-border'
                }`}
              >
                {cell === 1 ? '♛' : ''}
              </div>
            ))
          )}
        </div>

        <h3 className="text-lg font-semibold mb-4">Solutions Found: {currentStep.allSolutions.length}</h3>
        <div className="flex flex-wrap gap-4">
          {currentStep.allSolutions.map((solution, idx) => (
            <div key={idx} className="p-2 bg-muted rounded border">
              <div className="text-xs mb-1">Solution {idx + 1}</div>
              <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${currentStep.n}, minmax(0, 1fr))`, width: '80px' }}>
                {solution.map((row, r) =>
                  row.map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={`aspect-square flex items-center justify-center text-xs ${
                        cell === 1 ? 'bg-green-500/40' : (r + c) % 2 === 0 ? 'bg-muted' : 'bg-card'
                      }`}
                    >
                      {cell === 1 ? '♛' : ''}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
    <div className="mt-4 p-4 bg-muted rounded">
              <VariablePanel
        variables={{
          'n': currentStep.n,
          'current row': currentStep.row,
          'current col': currentStep.col,
          'solutions found': currentStep.allSolutions.length
        }}
      />
      </div>
      </div>
      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />

      </div>



    </div>
  );
};
