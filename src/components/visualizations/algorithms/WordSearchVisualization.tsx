import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  board: string[][];
  currentPos: [number, number] | null;
  visited: boolean[][];
  path: [number, number][];
  wordIndex: number;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const WordSearchVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const board = [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E']
  ];
  const word = "ABCCED";

  const steps: Step[] = [
    { board, currentPos: null, visited: Array(3).fill(null).map(() => Array(4).fill(false)), path: [], wordIndex: 0, variables: { word: 'ABCCED', target: 'A' }, message: "Start DFS search for word 'ABCCED'. Looking for 'A'", lineNumber: 2 },
    { board, currentPos: [0, 0], visited: [[true, false, false, false], [false, false, false, false], [false, false, false, false]], path: [[0, 0]], wordIndex: 1, variables: { found: 'A', target: 'B' }, message: "Found 'A' at (0,0). Mark visited. Next target: 'B'", lineNumber: 8 },
    { board, currentPos: [0, 1], visited: [[true, true, false, false], [false, false, false, false], [false, false, false, false]], path: [[0, 0], [0, 1]], wordIndex: 2, variables: { found: 'B', target: 'C' }, message: "Found 'B' at (0,1). Next target: 'C'", lineNumber: 8 },
    { board, currentPos: [0, 2], visited: [[true, true, true, false], [false, false, false, false], [false, false, false, false]], path: [[0, 0], [0, 1], [0, 2]], wordIndex: 3, variables: { found: 'C', target: 'C' }, message: "Found 'C' at (0,2). Next target: 'C'", lineNumber: 8 },
    { board, currentPos: [1, 2], visited: [[true, true, true, false], [false, false, true, false], [false, false, false, false]], path: [[0, 0], [0, 1], [0, 2], [1, 2]], wordIndex: 4, variables: { found: 'C', target: 'E' }, message: "Found 'C' at (1,2). Next target: 'E'", lineNumber: 8 },
    { board, currentPos: [2, 2], visited: [[true, true, true, false], [false, false, true, false], [false, false, true, false]], path: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], wordIndex: 5, variables: { found: 'E', target: 'D' }, message: "Found 'E' at (2,2). Next target: 'D'", lineNumber: 8 },
    { board, currentPos: [2, 1], visited: [[true, true, true, false], [false, false, true, false], [false, true, true, false]], path: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1]], wordIndex: 6, variables: { found: 'D', result: true }, message: "Found 'D' at (2,1). Complete match! Time: O(m*n*4^L), Space: O(L)", lineNumber: 10 }
  ];

  const code = `function exist(board: string[][], word: string): boolean {
  const rows = board.length, cols = board[0].length;
  
  function dfs(row: number, col: number, index: number): boolean {
    if (index === word.length) return true;
    if (row < 0 || row >= rows || col < 0 || col >= cols || 
        board[row][col] !== word[index]) return false;
    
    const temp = board[row][col];
    board[row][col] = '#'; // mark visited
    
    const found = dfs(row + 1, col, index + 1) || dfs(row - 1, col, index + 1) ||
                  dfs(row, col + 1, index + 1) || dfs(row, col - 1, index + 1);
    
    board[row][col] = temp; // backtrack
    return found;
  }
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(0)} disabled={currentStepIndex === 0}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0}><SkipBack className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1}><SkipForward className="h-4 w-4" /></Button>
          </div>
          <div className="text-sm">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Word Search: "{word}"</h3>
          <div className="space-y-4">
            <div className="inline-block">
              {currentStep.board.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1">
                  {row.map((cell, colIdx) => {
                    const isCurrentPos = currentStep.currentPos?.[0] === rowIdx && currentStep.currentPos?.[1] === colIdx;
                    const isInPath = currentStep.path.some(([r, c]) => r === rowIdx && c === colIdx);
                    const isVisited = currentStep.visited[rowIdx][colIdx];
                    return (
                      <div key={colIdx} className={`w-12 h-12 flex items-center justify-center font-bold text-lg border-2 ${
                        isCurrentPos ? 'bg-blue-500/20 border-blue-500 text-blue-500' :
                        isInPath ? 'bg-green-500/20 border-green-500 text-green-500' :
                        isVisited ? 'bg-yellow-500/20 border-yellow-500' : 'bg-muted border-border'
                      }`}>
                        {cell}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500/20 border-2 border-blue-500"></div>Current</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500/20 border-2 border-green-500"></div>Path</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500/20 border-2 border-yellow-500"></div>Visited</div>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <div className="text-sm mb-2">Progress: {currentStep.path.map(([r, c]) => board[r][c]).join('')}</div>
              <div className="text-sm">{currentStep.message}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers lineProps={(lineNumber) => ({ style: { backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent', display: 'block' } })}>
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
