import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  board: string[][];
  word: string;
  visited: boolean[][];
  currentPos: [number, number] | null;
  wordIndex: number;
  found: boolean;
  message: string;
  lineNumber: number;
}

export const WordSearchVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function exist(board: string[][], word: string): boolean {
  const rows = board.length;
  const cols = board[0].length;
  const visited: boolean[][] = Array(rows).fill(0).map(() => Array(cols).fill(false));
  
  function dfs(row: number, col: number, index: number): boolean {
    if (index === word.length) return true;
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
    if (visited[row][col] || board[row][col] !== word[index]) return false;
    
    visited[row][col] = true;
    const found = dfs(row + 1, col, index + 1) || dfs(row - 1, col, index + 1) ||
                  dfs(row, col + 1, index + 1) || dfs(row, col - 1, index + 1);
    visited[row][col] = false;
    return found;
  }
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`;

  const generateSteps = () => {
    const board = [
      ['A', 'B', 'C'],
      ['S', 'F', 'E'],
      ['A', 'D', 'E']
    ];
    const word = 'SEE';
    const newSteps: Step[] = [];
    const rows = board.length;
    const cols = board[0].length;
    const visited: boolean[][] = Array(rows).fill(0).map(() => Array(cols).fill(false));
    let found = false;

    function dfs(row: number, col: number, index: number): boolean {
      if (index === word.length) {
        found = true;
        newSteps.push({
          board,
          word,
          visited: visited.map(r => [...r]),
          currentPos: [row, col],
          wordIndex: index,
          found: true,
          message: `Word "${word}" found!`,
          lineNumber: 6
        });
        return true;
      }

      if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
      if (visited[row][col] || board[row][col] !== word[index]) {
        newSteps.push({
          board,
          word,
          visited: visited.map(r => [...r]),
          currentPos: [row, col],
          wordIndex: index,
          found: false,
          message: `Mismatch at (${row},${col}): expected '${word[index]}', got '${board[row]?.[col] || 'out of bounds'}'`,
          lineNumber: 8
        });
        return false;
      }

      visited[row][col] = true;
      newSteps.push({
        board,
        word,
        visited: visited.map(r => [...r]),
        currentPos: [row, col],
        wordIndex: index,
        found: false,
        message: `Match '${board[row][col]}' at (${row},${col}), index ${index}`,
        lineNumber: 10
      });

      const result = dfs(row + 1, col, index + 1) || dfs(row - 1, col, index + 1) ||
                     dfs(row, col + 1, index + 1) || dfs(row, col - 1, index + 1);

      visited[row][col] = false;
      if (!found) {
        newSteps.push({
          board,
          word,
          visited: visited.map(r => [...r]),
          currentPos: [row, col],
          wordIndex: index,
          found: false,
          message: `Backtrack from (${row},${col})`,
          lineNumber: 13
        });
      }
      return result;
    }

    for (let r = 0; r < rows && !found; r++) {
      for (let c = 0; c < cols && !found; c++) {
        if (board[r][c] === word[0]) {
          newSteps.push({
            board,
            word,
            visited: visited.map(row => [...row]),
            currentPos: [r, c],
            wordIndex: 0,
            found: false,
            message: `Starting search from (${r},${c})`,
            lineNumber: 18
          });
          if (dfs(r, c, 0)) break;
        }
      }
    }

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

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
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
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

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Search for: "{currentStep.word}"</h3>
        
        <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${currentStep.board[0].length}, minmax(0, 1fr))` }}>
          {currentStep.board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all ${
                  currentStep.currentPos && currentStep.currentPos[0] === r && currentStep.currentPos[1] === c
                    ? 'bg-primary/20 border-primary scale-110'
                    : currentStep.visited[r][c]
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-card border-border'
                }`}
              >
                {cell}
              </div>
            ))
          )}
        </div>

        <h3 className="text-lg font-semibold mb-4">Word Progress</h3>
        <div className="flex gap-2 mb-6">
          {currentStep.word.split('').map((char, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold ${
                idx < currentStep.wordIndex ? 'bg-green-500/20 border-green-500' :
                idx === currentStep.wordIndex ? 'bg-blue-500/20 border-blue-500' :
                'bg-card border-border'
              }`}
            >
              {char}
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'word': currentStep.word,
          'current index': currentStep.wordIndex,
          'position': currentStep.currentPos ? `(${currentStep.currentPos[0]}, ${currentStep.currentPos[1]})` : 'none',
          'found': String(currentStep.found)
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
