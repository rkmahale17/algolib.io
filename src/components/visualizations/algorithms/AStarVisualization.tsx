import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Cell {
  x: number;
  y: number;
  f: number;
  g: number;
  h: number;
}

interface Step {
  grid: string[][];
  openSet: Cell[];
  closedSet: Cell[];
  current: Cell | null;
  path: Cell[];
  message: string;
  lineNumber: number;
}

export const AStarVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function aStar(grid, start, goal) {
  const openSet = [start];
  const closedSet = [];
  
  while (openSet.length > 0) {
    const current = openSet.reduce((min, node) => 
      node.f < min.f ? node : min
    );
    
    if (current === goal) return reconstructPath();
    
    openSet.remove(current);
    closedSet.add(current);
    
    for (const neighbor of getNeighbors(current)) {
      if (closedSet.has(neighbor)) continue;
      
      const tentativeG = current.g + 1;
      if (!openSet.has(neighbor) || tentativeG < neighbor.g) {
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, goal);
        neighbor.f = neighbor.g + neighbor.h;
        if (!openSet.has(neighbor)) openSet.add(neighbor);
      }
    }
  }
}`;

  const generateSteps = () => {
    const rows = 6;
    const cols = 8;
    const grid = Array(rows).fill(0).map(() => Array(cols).fill('.'));
    
    // Add obstacles
    grid[2][3] = '#';
    grid[2][4] = '#';
    grid[3][4] = '#';

    const start = { x: 0, y: 0, f: 0, g: 0, h: 0 };
    const goal = { x: 7, y: 5, f: 0, g: 0, h: 0 };

    const heuristic = (a: Cell, b: Cell) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

    const newSteps: Step[] = [];
    const openSet: Cell[] = [{ ...start, h: heuristic(start, goal), f: heuristic(start, goal) }];
    const closedSet: Cell[] = [];
    const cameFrom = new Map<string, Cell>();

    newSteps.push({
      grid: grid.map(row => [...row]),
      openSet: [...openSet],
      closedSet: [],
      current: null,
      path: [],
      message: 'Initialize A* from start to goal',
      lineNumber: 1
    });

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      closedSet.push(current);

      newSteps.push({
        grid: grid.map(row => [...row]),
        openSet: [...openSet],
        closedSet: [...closedSet],
        current,
        path: [],
        message: `Explore cell (${current.x}, ${current.y}) with f=${current.f}`,
        lineNumber: 6
      });

      if (current.x === goal.x && current.y === goal.y) {
        const path: Cell[] = [];
        let curr: Cell | undefined = current;
        while (curr) {
          path.unshift(curr);
          curr = cameFrom.get(`${curr.x},${curr.y}`);
        }

        newSteps.push({
          grid: grid.map(row => [...row]),
          openSet: [],
          closedSet: [...closedSet],
          current,
          path,
          message: 'Goal reached! Path found',
          lineNumber: 9
        });
        break;
      }

      const neighbors: { x: number; y: number }[] = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
      ];

      for (const neighbor of neighbors) {
        if (neighbor.x < 0 || neighbor.x >= cols || neighbor.y < 0 || neighbor.y >= rows) continue;
        if (grid[neighbor.y][neighbor.x] === '#') continue;
        if (closedSet.some(c => c.x === neighbor.x && c.y === neighbor.y)) continue;

        const tentativeG = current.g + 1;
        const existingOpen = openSet.find(c => c.x === neighbor.x && c.y === neighbor.y);

        if (!existingOpen || tentativeG < existingOpen.g) {
          const neighborCell: Cell = { x: neighbor.x, y: neighbor.y, g: tentativeG, h: 0, f: 0 };
          const h = heuristic(neighborCell, goal);
          neighborCell.h = h;
          neighborCell.f = tentativeG + h;
          
          cameFrom.set(`${neighbor.x},${neighbor.y}`, current);

          if (!existingOpen) {
            openSet.push(neighborCell);
          } else {
            Object.assign(existingOpen, neighborCell);
          }

          newSteps.push({
            grid: grid.map(row => [...row]),
            openSet: [...openSet],
            closedSet: [...closedSet],
            current,
            path: [],
            message: `Add neighbor (${neighbor.x}, ${neighbor.y}) with g=${tentativeG}, h=${h}`,
            lineNumber: 19
          });
        }
      }
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-x-auto">
            <div className="inline-block ">
              {currentStep.grid.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => {
                    const isStart = x === 0 && y === 0;
                    const isGoal = x === 7 && y === 5;
                    const isCurrent = currentStep.current?.x === x && currentStep.current?.y === y;
                    const inPath = currentStep.path.some(p => p.x === x && p.y === y);
                    const inOpen = currentStep.openSet.some(c => c.x === x && c.y === y);
                    const inClosed = currentStep.closedSet.some(c => c.x === x && c.y === y);

                    return (
                      <div
                        key={x}
                        className={`w-10 h-10 border border-border flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          cell === '#'
                            ? 'bg-gray-800'
                            : inPath
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-primary text-white'
                            : isStart
                            ? 'bg-blue-500 text-white'
                            : isGoal
                            ? 'bg-red-500 text-white'
                            : inOpen
                            ? 'bg-yellow-500/30'
                            : inClosed
                            ? 'bg-gray-500/30'
                            : 'bg-muted/20'
                        }`}
                      >
                        {cell === '#' ? '#' : isStart ? 'S' : isGoal ? 'G' : ''}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
          <div className="rounded-lg">
             <VariablePanel
            variables={{
              'Open Set': currentStep.openSet.length,
              'Closed Set': currentStep.closedSet.length,
              'Path Length': currentStep.path.length
            }}
          />
          </div>
        </div>

        <div className="space-y-4">
         
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
        </div>
      </div>
    </div>
  );
};
