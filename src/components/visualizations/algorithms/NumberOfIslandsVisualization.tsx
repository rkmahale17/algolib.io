import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const NumberOfIslandsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      current: null,
      islandCount: 0,
      explanation: "4×4 grid. '1' = land, '0' = water. Count connected islands using DFS flood-fill.",
      highlightedLine: 2
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,false,false],[false,false,false,false]],
      current: [0, 0],
      islandCount: 1,
      explanation: "Found island at (0,0). DFS to mark entire connected component. Island #1 marked.",
      highlightedLine: 10
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,true,false],[false,false,false,false]],
      current: [2, 2],
      islandCount: 2,
      explanation: "Found new island at (2,2). DFS marks this cell. Island #2.",
      highlightedLine: 10
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,true,false],[false,false,false,true]],
      current: [3, 3],
      islandCount: 3,
      explanation: "Found new island at (3,3). Single cell island. Island #3.",
      highlightedLine: 10
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,true,false],[false,false,false,true]],
      current: null,
      islandCount: 3,
      explanation: "Complete! Found 3 islands. Time: O(m×n), Space: O(m×n).",
      highlightedLine: 16
    }
  ];

  const code = `function numIslands(grid: string[][]): number {
  const m = grid.length, n = grid[0].length;
  let count = 0;
  
  function dfs(r: number, c: number) {
    // Boundary check and water check
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === '0') {
      return;
    }
    
    // Mark as visited by changing to '0'
    grid[r][c] = '0';
    
    // Visit all 4 neighbors
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);  // Mark entire island
      }
    }
  }
  
  return count;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">Number of Islands</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-2">
                  {step.grid.map((row, i) => (
                    <div key={i} className="flex gap-2">
                      {row.map((cell, j) => (
                        <div key={j} className={`w-14 h-14 rounded flex items-center justify-center font-bold text-lg ${
                          step.current && step.current[0] === i && step.current[1] === j
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                            : step.visited[i][j]
                              ? cell === '1' ? 'bg-green-500/30' : 'bg-blue-500/10'
                              : cell === '1'
                                ? 'bg-green-500/50'
                                : 'bg-blue-500/20'
                        }`}>
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-primary/20 rounded">
                  <div className="text-center font-bold text-2xl">
                    Islands Found: {step.islandCount}
                  </div>
                </div>

                <div className="flex gap-4 justify-center text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-500/50 rounded"></div>
                    <span>Land (1)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-500/20 rounded"></div>
                    <span>Water (0)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-500/30 rounded"></div>
                    <span>Visited</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-center p-4 bg-muted/50 rounded">
                {step.explanation}
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
                <strong>DFS Flood-fill:</strong> When finding '1', increment count and DFS to mark entire connected component.
              </div>
            </div>
          </Card>
          <VariablePanel variables={{ islands: step.islandCount, current: step.current ? `(${step.current[0]},${step.current[1]})` : 'None' }} />
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
