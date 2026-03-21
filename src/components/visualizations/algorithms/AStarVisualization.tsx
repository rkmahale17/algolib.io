import { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

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

  const code = `function aStar(grid: number[][], start: [number, number], goal: [number, number]): [number, number][] {
  const rows = grid.length
  const cols = grid[0].length

  const heuristic = (x: number, y: number) =>
    Math.abs(x - goal[0]) + Math.abs(y - goal[1])

  const dirs = [[0,1],[1,0],[0,-1],[-1,0]]

  const openSet: [number, number, number][] = [[heuristic(...start), start[0], start[1]]]

  const cameFrom = new Map<number, number>()
  const gScore = new Map<number, number>()
  const closedSet = new Set<number>()

  const startKey = start[0]*cols + start[1]
  gScore.set(startKey, 0)

  while(openSet.length) {
    openSet.sort((a,b)=>a[0]-b[0])
    const [, x, y] = openSet.shift()!

    const key = x*cols + y

    if(closedSet.has(key)) continue
    closedSet.add(key)

    if(x === goal[0] && y === goal[1]) {
      const path: [number,number][] = []
      let curr = key

      while(curr !== startKey) {
        const cx = Math.floor(curr/cols)
        const cy = curr%cols
        path.unshift([cx,cy])
        curr = cameFrom.get(curr)!
      }

      path.unshift(start)
      return path
    }

    for(const [dx,dy] of dirs) {
      const nx = x+dx
      const ny = y+dy

      if(nx<0 || ny<0 || nx>=rows || ny>=cols || grid[nx][ny]===1) continue

      const neighborKey = nx*cols+ny
      const tentative = gScore.get(key)! + 1

      if(!gScore.has(neighborKey) || tentative < gScore.get(neighborKey)!) {
        cameFrom.set(neighborKey, key)
        gScore.set(neighborKey, tentative)

        const f = tentative + heuristic(nx,ny)
        openSet.push([f,nx,ny])
      }
    }
  }

  return []
}`;

  const generateSteps = () => {
    const rows = 6;
    const cols = 8;
    const grid = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill("."));

    // Add obstacles matching the '1' representation in user's TS code.
    // In our visually mapped logic, "#" translates to obstacle in UI rendering block.
    grid[2][3] = "#";
    grid[2][4] = "#";
    grid[3][4] = "#";

    const start: [number, number] = [0, 0];
    const goal: [number, number] = [5, 7];

    const heuristic = (x: number, y: number) =>
      Math.abs(x - goal[0]) + Math.abs(y - goal[1]);

    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    const newSteps: Step[] = [];
    const openSet: [number, number, number][] = [
      [heuristic(start[0], start[1]), start[0], start[1]],
    ];

    // We preserve Cell structure for UI mappings 
    const openSetCells = new Map<number, Cell>();
    openSetCells.set(start[0] * cols + start[1], { x: start[0], y: start[1], f: heuristic(start[0], start[1]), g: 0, h: heuristic(start[0], start[1]) });

    const closedSet = new Set<number>();
    const cameFrom = new Map<number, number>();
    const gScore = new Map<number, number>();

    const startKey = start[0] * cols + start[1];
    gScore.set(startKey, 0);

    newSteps.push({
      grid: grid.map((row) => [...row]),
      openSet: Array.from(openSetCells.values()),
      closedSet: [],
      current: null,
      path: [],
      message: "Initialize A* structures: start, open set, closed set, scores",
      lineNumber: 17,
    });

    while (openSet.length > 0) {
      newSteps.push({
        grid: grid.map((row) => [...row]),
        openSet: Array.from(openSetCells.values()),
        closedSet: Array.from(closedSet).map(k => ({ x: Math.floor(k / cols), y: k % cols, f: 0, g: 0, h: 0 })),
        current: null,
        path: [],
        message: "Sort openSet by lowest f-score",
        lineNumber: 20,
      });

      openSet.sort((a, b) => a[0] - b[0]);
      const [fScore, x, y] = openSet.shift()!;

      const key = x * cols + y;
      const currentCell = openSetCells.get(key) || { x, y, f: fScore, g: gScore.get(key) || 0, h: heuristic(x, y) };
      openSetCells.delete(key);

      newSteps.push({
        grid: grid.map((row) => [...row]),
        openSet: Array.from(openSetCells.values()),
        closedSet: Array.from(closedSet).map(k => ({ x: Math.floor(k / cols), y: k % cols, f: 0, g: 0, h: 0 })),
        current: currentCell,
        path: [],
        message: `Current node (${x}, ${y}) with f=${currentCell.f}`,
        lineNumber: 21,
      });

      if (closedSet.has(key)) {
        newSteps.push({
          grid: grid.map((row) => [...row]),
          openSet: Array.from(openSetCells.values()),
          closedSet: Array.from(closedSet).map(k => ({ x: Math.floor(k / cols), y: k % cols, f: 0, g: 0, h: 0 })),
          current: currentCell,
          path: [],
          message: `Node (${x}, ${y}) already evaluated (closed), skipping`,
          lineNumber: 25,
        });
        continue;
      }

      closedSet.add(key);
      newSteps.push({
        grid: grid.map((row) => [...row]),
        openSet: Array.from(openSetCells.values()),
        closedSet: Array.from(closedSet).map(k => ({ x: Math.floor(k / cols), y: k % cols, f: 0, g: 0, h: 0 })),
        current: currentCell,
        path: [],
        message: `Marking node (${x}, ${y}) as evaluated (added to closed set)`,
        lineNumber: 26,
      });

      if (x === goal[0] && y === goal[1]) {
        const path: Cell[] = [];
        let curr = key;
        while (curr !== startKey) {
          const cx = Math.floor(curr / cols);
          const cy = curr % cols;
          path.unshift({ x: cx, y: cy, f: 0, g: 0, h: 0 });
          curr = cameFrom.get(curr)!;
        }
        path.unshift({ x: start[0], y: start[1], f: 0, g: 0, h: 0 });

        newSteps.push({
          grid: grid.map((row) => [...row]),
          openSet: Array.from(openSetCells.values()),
          closedSet: Array.from(closedSet).map(k => ({ x: Math.floor(k / cols), y: k % cols, f: 0, g: 0, h: 0 })),
          current: currentCell,
          path,
          message: "Goal reached! Reconstructed path by backtracking via cameFrom",
          lineNumber: 28,
        });
        break;
      }

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        // Skip bounds and obstacles 
        if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] === "#") {
          continue;
        }

        newSteps.push({
          grid: grid.map((row) => [...row]),
          openSet: Array.from(openSetCells.values()),
          closedSet: Array.from(closedSet).map(k => ({ x: Math.floor(k / cols), y: k % cols, f: 0, g: 0, h: 0 })),
          current: currentCell,
          path: [],
          message: `Checking neighbor (${nx}, ${ny})`,
          lineNumber: 43,
        });

        const neighborKey = nx * cols + ny;
        const tentative = gScore.get(key)! + 1;

        if (!gScore.has(neighborKey) || tentative < gScore.get(neighborKey)!) {
          cameFrom.set(neighborKey, key);
          gScore.set(neighborKey, tentative);

          const f = tentative + heuristic(nx, ny);
          openSet.push([f, nx, ny]);

          openSetCells.set(neighborKey, { x: nx, y: ny, g: tentative, h: heuristic(nx, ny), f });

          newSteps.push({
            grid: grid.map((row) => [...row]),
            openSet: Array.from(openSetCells.values()),
            closedSet: Array.from(closedSet).map(k => ({ x: Math.floor(k / cols), y: k % cols, f: 0, g: 0, h: 0 })),
            current: currentCell,
            path: [],
            message: `Updated better path to neighbor (${nx}, ${ny}): g=${tentative}, h=${heuristic(nx, ny)}, f=${f}`,
            lineNumber: 57,
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
        setCurrentStepIndex((prev) => {
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
  const handleStepForward = () =>
    currentStepIndex < steps.length - 1 &&
    setCurrentStepIndex((prev) => prev + 1);
  const handleStepBack = () =>
    currentStepIndex > 0 && setCurrentStepIndex((prev) => prev - 1);
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-hidden flex justify-center w-full">
            <div className="inline-block max-w-[400px]">
              {currentStep.grid.map((row, rowIdx) => (
                <div key={rowIdx} className="flex">
                  {row.map((cell, colIdx) => {
                    const isStart = rowIdx === 0 && colIdx === 0;
                    const isGoal = rowIdx === 5 && colIdx === 7;
                    const isCurrent =
                      currentStep.current?.x === rowIdx &&
                      currentStep.current?.y === colIdx;
                    const inPath = currentStep.path.some(
                      (p) => p.x === rowIdx && p.y === colIdx,
                    );
                    const inOpen = currentStep.openSet.some(
                      (c) => c.x === rowIdx && c.y === colIdx,
                    );
                    const inClosed = currentStep.closedSet.some(
                      (c) => c.x === rowIdx && c.y === colIdx,
                    );

                    return (
                      <div
                        key={colIdx}
                        className={`w-8 h-8 md:w-10 md:h-10 border border-border flex items-center justify-center text-xs font-semibold transition-all duration-300 ${cell === "#"
                          ? "bg-slate-700 text-transparent"
                          : inPath
                            ? "bg-green-500 text-white"
                            : isCurrent
                              ? "bg-primary text-white"
                              : isStart
                                ? "bg-blue-500 text-white"
                                : isGoal
                                  ? "bg-red-500 text-white"
                                  : inOpen
                                    ? "bg-yellow-500/30"
                                    : inClosed
                                      ? "bg-gray-500/30"
                                      : "bg-muted/20"
                          }`}
                      >
                        {cell === "#" ? "" : isStart ? "S" : isGoal ? "G" : ""}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">
              {currentStep.message}
            </p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
              variables={{
                "Open Set": currentStep.openSet.length,
                "Closed Set": currentStep.closedSet.length,
                "Path Length": currentStep.path.length,
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[currentStep.lineNumber]}
            language="typescript"
          />
        </div>
      </div>
    </div>
  );
};
