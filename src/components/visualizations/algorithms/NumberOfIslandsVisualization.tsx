import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  grid: string[][];
  visited: boolean[][];
  current: [number, number] | null;
  islandCount: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const NumberOfIslandsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      current: null,
      islandCount: 0,
      variables: { m: 4, n: 4 },
      explanation: "4×4 grid. '1' = land, '0' = water. Count number of islands (connected land cells). Use DFS flood-fill.",
      highlightedLines: [1],
      lineExecution: "function numIslands(grid: string[][]): number"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      current: null,
      islandCount: 0,
      variables: { m: 4, n: 4, count: 0 },
      explanation: "Get grid dimensions: m = 4 rows, n = 4 columns. Initialize island count = 0.",
      highlightedLines: [2, 3],
      lineExecution: "const m = grid.length, n = grid[0].length; let count = 0;"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      current: null,
      islandCount: 0,
      variables: {},
      explanation: "Define DFS helper: marks current cell as visited (change '1' to '0') and recursively visits all 4 neighbors.",
      highlightedLines: [5, 6, 7, 8],
      lineExecution: "function dfs(r: number, c: number)"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      current: [0, 0],
      islandCount: 0,
      variables: { i: 0, j: 0 },
      explanation: "Start nested loop at (0,0). Check: grid[0][0] === '1'? Yes, found land!",
      highlightedLines: [20, 21, 22],
      lineExecution: "for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (grid[i][j] === '1')"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      current: [0, 0],
      islandCount: 1,
      variables: { count: 1 },
      explanation: "Found new island! Increment count: count = 1. Start DFS to mark entire island.",
      highlightedLines: [23],
      lineExecution: "count++; // count = 1"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,false,false],[false,false,false,false]],
      current: [0, 0],
      islandCount: 1,
      variables: { markedCells: 4 },
      explanation: "DFS from (0,0): mark (0,0), (0,1), (1,0), (1,1) as visited. Entire first island marked.",
      highlightedLines: [24],
      lineExecution: "dfs(i, j); // marks all connected '1' cells"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,false,false],[false,false,false,false]],
      current: [0, 2],
      islandCount: 1,
      variables: { i: 0, j: 2 },
      explanation: "Continue loop: (0,2). Check: grid[0][2] === '1'? No, it's '0' (water). Skip.",
      highlightedLines: [20, 21, 22],
      lineExecution: "if (grid[0][2] === '1') // false, skip"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,false,false],[false,false,false,false]],
      current: [2, 2],
      islandCount: 1,
      variables: { i: 2, j: 2 },
      explanation: "Continue to (2,2). Check: grid[2][2] === '1'? Yes, found new land!",
      highlightedLines: [20, 21, 22],
      lineExecution: "if (grid[2][2] === '1') // true"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,false,false],[false,false,false,false]],
      current: [2, 2],
      islandCount: 2,
      variables: { count: 2 },
      explanation: "Found second island! Increment count: count = 2. Start DFS from (2,2).",
      highlightedLines: [23],
      lineExecution: "count++; // count = 2"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,true,false],[false,false,false,false]],
      current: [2, 2],
      islandCount: 2,
      variables: { markedCells: 1 },
      explanation: "DFS from (2,2): mark only (2,2). Single cell island. No adjacent land cells.",
      highlightedLines: [24],
      lineExecution: "dfs(2, 2); // marks (2,2)"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,true,false],[false,false,false,false]],
      current: [3, 3],
      islandCount: 2,
      variables: { i: 3, j: 3 },
      explanation: "Continue to (3,3). Check: grid[3][3] === '1'? Yes, found third land area!",
      highlightedLines: [20, 21, 22],
      lineExecution: "if (grid[3][3] === '1') // true"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,true,false],[false,false,false,false]],
      current: [3, 3],
      islandCount: 3,
      variables: { count: 3 },
      explanation: "Found third island! Increment count: count = 3. Start DFS from (3,3).",
      highlightedLines: [23],
      lineExecution: "count++; // count = 3"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,true,false],[false,false,false,true]],
      current: [3, 3],
      islandCount: 3,
      variables: { markedCells: 1 },
      explanation: "DFS from (3,3): mark only (3,3). Another single cell island.",
      highlightedLines: [24],
      lineExecution: "dfs(3, 3); // marks (3,3)"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,true,false],[false,false,false,true]],
      current: null,
      islandCount: 3,
      variables: { i: 4, m: 4 },
      explanation: "Check loop condition: i (4) < m (4)? No, exit nested loops.",
      highlightedLines: [20],
      lineExecution: "for (let i = 4; i < m; i++) // 4 < 4 -> false"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,true,false],[false,false,false,true]],
      current: null,
      islandCount: 3,
      variables: { result: 3 },
      explanation: "Return count = 3. Found 3 islands total.",
      highlightedLines: [29],
      lineExecution: "return count; // 3"
    },
    {
      grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
      visited: [[true,true,false,false],[true,true,false,false],[false,false,true,false],[false,false,false,true]],
      current: null,
      islandCount: 3,
      variables: { islands: 3, complexity: 'O(m×n)' },
      explanation: "Algorithm complete! DFS flood-fill. Each '1' cell visited at most once. Time: O(m×n), Space: O(m×n).",
      highlightedLines: [29],
      lineExecution: "Result: 3 islands"
    }
  ];

  const code = `function numIslands(grid: string[][]): number {
  const m = grid.length, n = grid[0].length;
  let count = 0;
  
  function dfs(r: number, c: number) {
    if (r < 0 || r >= m || c < 0 || c >= n || 
        grid[r][c] === '0') {
      return;
    }
    
    grid[r][c] = '0';
    
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
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
          <motion.div
            key={`grid-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3 text-center">Number of Islands</h3>
              <div className="flex flex-col items-center gap-2">
                {step.grid.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    {row.map((cell, j) => (
                      <div
                        key={j}
                        className={`w-14 h-14 rounded flex items-center justify-center font-bold text-lg ${
                          step.current && step.current[0] === i && step.current[1] === j
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                            : step.visited[i][j]
                            ? cell === '1'
                              ? 'bg-green-500/30'
                              : 'bg-blue-500/10'
                            : cell === '1'
                            ? 'bg-green-500/50'
                            : 'bg-blue-500/20'
                        }`}
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center text-xs mt-3">
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
            </Card>
          </motion.div>

          <motion.div
            key={`count-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-4">
              <div className="p-3 bg-primary/20 rounded">
                <div className="text-center font-bold text-2xl">
                  Islands Found: {step.islandCount}
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
              <h3 className="font-semibold mb-2 text-sm">DFS Flood-fill:</h3>
              <div className="text-xs text-muted-foreground">
                When finding '1', increment island count and run DFS to mark entire connected component as visited (change to '0'). Prevents double counting.
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
