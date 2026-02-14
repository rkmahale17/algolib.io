import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  grid: number[][];
  pacific: boolean[][];
  atlantic: boolean[][];
  current: [number, number] | null;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const PacificAtlanticVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const grid = [[1, 2, 3], [8, 9, 4], [7, 6, 5]];

  const steps: Step[] = [
    {
      grid,
      pacific: [[false, false, false], [false, false, false], [false, false, false]],
      atlantic: [[false, false, false], [false, false, false], [false, false, false]],
      current: null,
      variables: { m: 3, n: 3 },
      explanation: "3×3 height grid. Pacific Ocean touches top and left edges. Atlantic Ocean touches bottom and right edges. Find cells where water can flow to BOTH oceans.",
      highlightedLines: [1, 2, 3],
      lineExecution: "function pacificAtlantic(heights: number[][]): number[][]"
    },
    {
      grid,
      pacific: [[false, false, false], [false, false, false], [false, false, false]],
      atlantic: [[false, false, false], [false, false, false], [false, false, false]],
      current: null,
      variables: { m: 3, n: 3 },
      explanation: "Get grid dimensions: m = 3 rows, n = 3 columns.",
      highlightedLines: [4],
      lineExecution: "const m = heights.length, n = heights[0].length; // m=3, n=3"
    },
    {
      grid,
      pacific: [[false, false, false], [false, false, false], [false, false, false]],
      atlantic: [[false, false, false], [false, false, false], [false, false, false]],
      current: null,
      variables: { pacificSize: '3×3', atlanticSize: '3×3' },
      explanation: "Create two boolean grids to track cells reachable by each ocean.",
      highlightedLines: [5, 6],
      lineExecution: "const pacific = Array(m).fill(0).map(() => Array(n).fill(false));"
    },
    {
      grid,
      pacific: [[false, false, false], [false, false, false], [false, false, false]],
      atlantic: [[false, false, false], [false, false, false], [false, false, false]],
      current: null,
      variables: {},
      explanation: "Define DFS helper: marks all cells reachable from current cell where water can flow (height increases or stays same).",
      highlightedLines: [8, 9, 10],
      lineExecution: "function dfs(r: number, c: number, visited: boolean[][])"
    },
    {
      grid,
      pacific: [[true, false, false], [false, false, false], [false, false, false]],
      atlantic: [[false, false, false], [false, false, false], [false, false, false]],
      current: [0, 0],
      variables: { r: 0, c: 0 },
      explanation: "Start DFS from Pacific borders. Begin at (0,0) - top-left corner. Mark as Pacific-reachable.",
      highlightedLines: [22, 23],
      lineExecution: "for (let i = 0; i < m; i++) dfs(i, 0, pacific); // i=0"
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, false], [false, false, false], [false, false, false]],
      current: [1, 0],
      variables: { pacificCells: 5 },
      explanation: "Continue DFS from all Pacific borders (top row and left column). Mark all cells where water can flow to Pacific.",
      highlightedLines: [22, 23, 24],
      lineExecution: "DFS from all Pacific borders (top & left)"
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, false], [false, false, false], [false, false, false]],
      current: null,
      variables: { pacificCount: 5 },
      explanation: "Pacific DFS complete. 5 cells can reach Pacific Ocean.",
      highlightedLines: [22, 23, 24],
      lineExecution: "Pacific borders processed"
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, true], [false, false, false], [false, false, false]],
      current: [0, 2],
      variables: { r: 0, c: 2 },
      explanation: "Start DFS from Atlantic borders. Begin at (0,2) - top-right corner. Mark as Atlantic-reachable.",
      highlightedLines: [26, 27],
      lineExecution: "for (let i = 0; i < m; i++) dfs(i, n-1, atlantic); // i=0"
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, true], [false, false, true], [true, true, true]],
      current: [2, 2],
      variables: { atlanticCells: 5 },
      explanation: "Continue DFS from all Atlantic borders (bottom row and right column). Mark all cells where water can flow to Atlantic.",
      highlightedLines: [26, 27, 28],
      lineExecution: "DFS from all Atlantic borders (bottom & right)"
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, true], [false, false, true], [true, true, true]],
      current: null,
      variables: { atlanticCount: 5 },
      explanation: "Atlantic DFS complete. 5 cells can reach Atlantic Ocean.",
      highlightedLines: [26, 27, 28],
      lineExecution: "Atlantic borders processed"
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, true], [false, false, true], [true, true, true]],
      current: [0, 2],
      variables: { cell: '(0,2)', bothOceans: true },
      explanation: "Find intersection: check each cell. (0,2): pacific[0][2]=true AND atlantic[0][2]=true. Add to result!",
      highlightedLines: [30, 31, 32, 33, 34],
      lineExecution: "if (pacific[0][2] && atlantic[0][2]) result.push([0,2]);"
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, true], [false, false, true], [true, true, true]],
      current: [2, 0],
      variables: { cell: '(2,0)', bothOceans: true },
      explanation: "Cell (2,0): pacific[2][0]=true AND atlantic[2][0]=true. Add to result!",
      highlightedLines: [30, 31, 32, 33, 34],
      lineExecution: "if (pacific[2][0] && atlantic[2][0]) result.push([2,0]);"
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, true], [false, false, true], [true, true, true]],
      current: null,
      variables: { result: '[[0,2],[2,0]]' },
      explanation: "Return result: [[0,2], [2,0]]. These 2 cells can reach BOTH oceans.",
      highlightedLines: [37],
      lineExecution: "return result; // [[0,2],[2,0]]"
    },
    {
      grid,
      pacific: [[true, true, true], [true, false, false], [true, false, false]],
      atlantic: [[false, false, true], [false, false, true], [true, true, true]],
      current: null,
      variables: { cells: 2, complexity: 'O(m×n)' },
      explanation: "Algorithm complete! DFS from borders inward (reverse flow). Find cells reachable by both. Time: O(m×n), Space: O(m×n).",
      highlightedLines: [37],
      lineExecution: "Result: 2 cells reach both oceans"
    }
  ];

  const code = `function pacificAtlantic(
  heights: number[][]
): number[][] {
  const m = heights.length, n = heights[0].length;
  const pacific = Array(m).fill(0).map(() => Array(n).fill(false));
  const atlantic = Array(m).fill(0).map(() => Array(n).fill(false));
  
  function dfs(r: number, c: number, visited: boolean[][]) {
    if (visited[r][c]) return;
    visited[r][c] = true;
    
    const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && 
          heights[nr][nc] >= heights[r][c]) {
        dfs(nr, nc, visited);
      }
    }
  }
  
  for (let i = 0; i < m; i++) dfs(i, 0, pacific);
  for (let j = 0; j < n; j++) dfs(0, j, pacific);
  
  for (let i = 0; i < m; i++) dfs(i, n-1, atlantic);
  for (let j = 0; j < n; j++) dfs(m-1, j, atlantic);
  
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
          <motion.div
            key={`grid-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3 text-center">Pacific Atlantic Water Flow</h3>
              <div className="flex flex-col items-center gap-2">
                {step.grid.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    {row.map((height, j) => {
                      const isPacific = step.pacific[i][j];
                      const isAtlantic = step.atlantic[i][j];
                      const isBoth = isPacific && isAtlantic;
                      const isCurrent = step.current && step.current[0] === i && step.current[1] === j;
                      return (
                        <div
                          key={j}
                          className={`w-16 h-16 rounded flex flex-col items-center justify-center text-xs ${
                            isCurrent
                              ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                              : isBoth
                              ? 'bg-blue-500/30 ring-2 ring-blue-500'
                              : isPacific
                              ? 'bg-blue-500/20'
                              : isAtlantic
                              ? 'bg-orange-500/20'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="font-bold text-lg">{height}</div>
                          <div className="text-[10px] text-muted-foreground">
                            ({i},{j})
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center text-xs mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500/20 rounded"></div>
                  <span>Pacific</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-orange-500/20 rounded"></div>
                  <span>Atlantic</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500/30 rounded ring-2 ring-blue-500"></div>
                  <span>Both</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`algo-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-4 bg-blue-500/10">
              <h3 className="font-semibold mb-2 text-sm">Approach:</h3>
              <div className="text-xs text-muted-foreground">
                DFS from each ocean's borders inward. Water flows "uphill" in reverse (from lower to higher or equal). Find intersection of both reachable sets.
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
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
