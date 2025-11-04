import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const PacificAtlanticVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const grid = [[1, 2, 3], [8, 9, 4], [7, 6, 5]];
  
  const steps = [
    {
      grid,
      pacific: [[false, false, false], [false, false, false], [false, false, false]],
      atlantic: [[false, false, false], [false, false, false], [false, false, false]],
      current: null,
      explanation: "3×3 grid. Pacific touches top/left edges. Atlantic touches bottom/right. Find cells that flow to both.",
      highlightedLine: 2
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, false], [false, false, false], [false, false, false]],
      current: [0, 0],
      explanation: "Run DFS from Pacific borders (top row, left column). Mark all reachable cells.",
      highlightedLine: 10
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, true], [false, false, true], [true, true, true]],
      current: [2, 2],
      explanation: "Run DFS from Atlantic borders (bottom row, right column). Mark all reachable cells.",
      highlightedLine: 11
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, true], [false, false, true], [true, true, true]],
      current: null,
      explanation: "Find intersection: cells reachable by BOTH oceans. Result: [[0,2], [2,0]] in this example.",
      highlightedLine: 14
    }
  ];

  const code = `function pacificAtlantic(heights: number[][]): number[][] {
  const m = heights.length, n = heights[0].length;
  const pacific = Array(m).fill(0).map(() => Array(n).fill(false));
  const atlantic = Array(m).fill(0).map(() => Array(n).fill(false));
  
  function dfs(r: number, c: number, visited: boolean[][]) {
    if (visited[r][c]) return;
    visited[r][c] = true;
    
    // Visit neighbors with height >= current
    const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && heights[nr][nc] >= heights[r][c]) {
        dfs(nr, nc, visited);
      }
    }
  }
  
  // DFS from Pacific borders
  for (let i = 0; i < m; i++) dfs(i, 0, pacific);
  for (let j = 0; j < n; j++) dfs(0, j, pacific);
  
  // DFS from Atlantic borders
  for (let i = 0; i < m; i++) dfs(i, n-1, atlantic);
  for (let j = 0; j < n; j++) dfs(m-1, j, atlantic);
  
  // Find intersection
  const result: number[][] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (pacific[i][j] && atlantic[i][j]) {
        result.push([i, j]);
      }
    }
  }
  return result;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">Pacific Atlantic Water Flow</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-2">
                  {step.grid.map((row, i) => (
                    <div key={i} className="flex gap-2">
                      {row.map((height, j) => {
                        const isPacific = step.pacific[i][j];
                        const isAtlantic = step.atlantic[i][j];
                        const isBoth = isPacific && isAtlantic;
                        return (
                          <div key={j} className={`w-16 h-16 rounded flex flex-col items-center justify-center text-xs ${
                            isBoth
                              ? 'bg-purple-500/30 ring-2 ring-purple-500'
                              : isPacific
                                ? 'bg-blue-500/20'
                                : isAtlantic
                                  ? 'bg-orange-500/20'
                                  : 'bg-muted'
                          }`}>
                            <div className="font-bold text-lg">{height}</div>
                            <div className="text-[10px] text-muted-foreground">({i},{j})</div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 justify-center text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-500/20 rounded"></div>
                    <span>Pacific</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-orange-500/20 rounded"></div>
                    <span>Atlantic</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-purple-500/30 rounded ring-2 ring-purple-500"></div>
                    <span>Both</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-center p-4 bg-muted/50 rounded">
                {step.explanation}
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
                <strong>Approach:</strong> DFS from each ocean's borders inward (water flows uphill in reverse). Find cells reachable by both.
              </div>
            </div>
          </Card>
          <VariablePanel variables={{ current: step.current ? `(${step.current[0]},${step.current[1]})` : 'None' }} />
        </>
      }
      rightContent={
        <CodeHighlighter
          code={code}
          highlightedLine={step.highlightedLine}
          language="TypeScript"
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
