import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  grid: string[][];
  row: number;
  col: number;
  islandCount: number;
  highlightedLine: number;
  description: string;
}

export const NumIslandsVisualization = () => {
  const initialGrid = [
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1']
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState<Step[]>([]);

  const code = `def numIslands(grid):
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    def dfs(r, c):
        if (r < 0 or r >= rows or 
            c < 0 or c >= cols or 
            grid[r][c] != '1'):
            return
        
        grid[r][c] = '0'  # Mark visited
        
        # Visit all 4 directions
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
    
    return islands`;

  useEffect(() => {
    generateSteps();
  }, []);

  const generateSteps = () => {
    const newSteps: Step[] = [];
    const grid = initialGrid.map(row => [...row]);
    const rows = grid.length;
    const cols = grid[0].length;
    let islands = 0;

    newSteps.push({
      grid: grid.map(row => [...row]),
      row: -1,
      col: -1,
      islandCount: 0,
      highlightedLine: 0,
      description: "Start: Count islands using DFS flood fill"
    });

    const dfs = (r: number, c: number, isFirst: boolean = false) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') {
        return;
      }

      if (isFirst) {
        newSteps.push({
          grid: grid.map(row => [...row]),
          row: r,
          col: c,
          islandCount: islands,
          highlightedLine: 24,
          description: `Found new island starting at (${r}, ${c})`
        });
      }

      grid[r][c] = '0';
      newSteps.push({
        grid: grid.map(row => [...row]),
        row: r,
        col: c,
        islandCount: islands,
        highlightedLine: 13,
        description: `Mark cell (${r}, ${c}) as visited`
      });

      // Visit all 4 directions
      dfs(r + 1, c);
      dfs(r - 1, c);
      dfs(r, c + 1);
      dfs(r, c - 1);
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === '1') {
          islands++;
          newSteps.push({
            grid: grid.map(row => [...row]),
            row: r,
            col: c,
            islandCount: islands,
            highlightedLine: 23,
            description: `Island #${islands} found! Start DFS from (${r}, ${c})`
          });
          dfs(r, c, true);
        }
      }
    }

    newSteps.push({
      grid: grid.map(row => [...row]),
      row: -1,
      col: -1,
      islandCount: islands,
      highlightedLine: 27,
      description: `Complete! Found ${islands} islands`
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  if (steps.length === 0) return <div>Loading...</div>;

  const step = steps[currentStep];

  const getCellColor = (r: number, c: number, value: string) => {
    if (step.row === r && step.col === c) {
      return 'bg-yellow-200 dark:bg-yellow-900 border-yellow-500';
    }
    if (value === '1') {
      return 'bg-green-500 border-green-600';
    }
    return 'bg-blue-200 dark:bg-blue-900 border-blue-400';
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Number of Islands</h3>
        
        <div className="space-y-4">
          <div className="inline-flex flex-col gap-1">
            {step.grid.map((row, r) => (
              <div key={r} className="flex gap-1">
                {row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`w-12 h-12 border-2 flex items-center justify-center font-bold rounded ${getCellColor(r, c, cell)}`}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500 border-2 border-green-600"></div>
              <span className="text-sm">Land (1)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-200 dark:bg-blue-900 border-2 border-blue-400"></div>
              <span className="text-sm">Water/Visited (0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-200 dark:bg-yellow-900 border-2 border-yellow-500"></div>
              <span className="text-sm">Current</span>
            </div>
          </div>

          <div className="text-2xl font-bold text-center p-4 bg-primary/10 rounded">
            Islands Found: {step.islandCount}
          </div>

          <div className="p-3 bg-muted rounded">
            {step.description}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeHighlighter
          code={code}
          highlightedLine={step.highlightedLine}
          language="Python"
        />
        <VariablePanel
          variables={{
            row: step.row >= 0 ? step.row : "null",
            col: step.col >= 0 ? step.col : "null",
            islands: step.islandCount
          }}
        />
      </div>

      <StepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
        onStepBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
        onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </div>
  );
};
