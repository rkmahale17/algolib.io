import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  grid: number[][];
  row: number;
  col: number;
  message: string;
  lineNumber: number;
}

export const UniquePathsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { grid: [[0,0,0],[0,0,0],[0,0,0]], row: -1, col: -1, message: "3x3 grid. Find paths from top-left to bottom-right (only right/down moves)", lineNumber: 2 },
    { grid: [[1,1,1],[0,0,0],[0,0,0]], row: 0, col: -1, message: "First row: Only 1 way to reach each cell (move right)", lineNumber: 4 },
    { grid: [[1,1,1],[1,0,0],[1,0,0]], row: -1, col: 0, message: "First column: Only 1 way to reach each cell (move down)", lineNumber: 5 },
    { grid: [[1,1,1],[1,2,0],[1,0,0]], row: 1, col: 1, message: "Cell [1,1]: paths = from_top(1) + from_left(1) = 2", lineNumber: 8 },
    { grid: [[1,1,1],[1,2,3],[1,0,0]], row: 1, col: 2, message: "Cell [1,2]: paths = from_top(1) + from_left(2) = 3", lineNumber: 8 },
    { grid: [[1,1,1],[1,2,3],[1,3,0]], row: 2, col: 1, message: "Cell [2,1]: paths = from_top(2) + from_left(1) = 3", lineNumber: 8 },
    { grid: [[1,1,1],[1,2,3],[1,3,6]], row: 2, col: 2, message: "Cell [2,2]: paths = from_top(3) + from_left(3) = 6. Time: O(m*n), Space: O(m*n)", lineNumber: 12 }
  ];

  const code = `function uniquePaths(m: number, n: number): number {
  const dp: number[][] = Array(m).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;
  
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i-1][j] + dp[i][j-1];
    }
  }
  
  return dp[m-1][n-1];
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
          <h3 className="text-lg font-semibold mb-4">Unique Paths</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Grid (number of paths to reach each cell):</div>
              <div className="inline-block border-2 border-border rounded">
                {currentStep.grid.map((row, i) => (
                  <div key={i} className="flex">
                    {row.map((val, j) => (
                      <div key={j} className={`w-20 h-20 border border-border flex items-center justify-center text-2xl font-bold ${
                        i === 0 && j === 0 ? 'bg-green-500/30' :
                        i === currentStep.grid.length - 1 && j === currentStep.grid[0].length - 1 ? 'bg-red-500/30' :
                        i === currentStep.row && j === currentStep.col ? 'bg-primary text-primary-foreground' :
                        val > 0 ? 'bg-secondary' : 'bg-muted'
                      }`}>
                        {val > 0 ? val : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-green-500/30 border border-border"></div> Start</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-red-500/30 border border-border"></div> End</div>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Pattern:</strong> Each cell's path count = paths from top + paths from left
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
