import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

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
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function aStar(grid: number[][], start: [number, number], goal: [number, number]): [number, number][] {
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
}`,
  python: `def a_star(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    def heuristic(row, col):
        return abs(row - goal[0]) + abs(col - goal[1])
    directions = [(0,1),(1,0),(0,-1),(-1,0)]
    open_set = [[heuristic(start[0], start[1]), start[0], start[1]]]
    parent = {}
    g_score = {}
    closed_set = set()
    start_key = start[0] * cols + start[1]
    g_score[start_key] = 0
    while open_set:
        open_set.sort(key=lambda x: x[0])
        _, current_row, current_col = open_set.pop(0)
        current_key = current_row * cols + current_col
        if current_key in closed_set:
            continue
        closed_set.add(current_key)
        if current_row == goal[0] and current_col == goal[1]:
            path = []
            current = current_key
            while current != start_key:
                row = current // cols
                col = current % cols
                path.insert(0, [row, col])
                current = parent[current]
            path.insert(0, start)
            return path
        for direction_row, direction_col in directions:
            neighbor_row = current_row + direction_row
            neighbor_col = current_col + direction_col
            if (
                neighbor_row < 0 or
                neighbor_col < 0 or
                neighbor_row >= rows or
                neighbor_col >= cols or
                grid[neighbor_row][neighbor_col] == 1
            ):
                continue
            neighbor_key = neighbor_row * cols + neighbor_col
            tentative_g = g_score[current_key] + 1
            if (
                neighbor_key not in g_score or
                tentative_g < g_score[neighbor_key]
            ):
                parent[neighbor_key] = current_key
                g_score[neighbor_key] = tentative_g
                f_score = tentative_g + heuristic(neighbor_row, neighbor_col)
                open_set.append(
                    [f_score, neighbor_row, neighbor_col]
                )
    return []`,
  java: `public static class Solution {
    int orderCounter = 0;
    public List<int[]> aStar(int[][] grid, int[] start, int[] goal) {
        int rows = grid.length, cols = grid[0].length;
        PriorityQueue<Node> openSet =
          new PriorityQueue<>((a, b) -> a.fScore != b.fScore ? a.fScore - b.fScore : a.order - b.order);
        Map<Integer, Integer> gScore = new HashMap<>();
        Map<Integer, Integer> parent = new HashMap<>();
        boolean[][] closed = new boolean[rows][cols];
        int startKey = start[0] * cols + start[1];
        int goalKey = goal[0] * cols + goal[1];
        gScore.put(startKey, 0);
        openSet.add(new Node(start[0], start[1], heuristic(start, goal), orderCounter++));
        int[][] directions = {{0,1},{1,0},{0,-1},{-1,0}};
        while (!openSet.isEmpty()) {
            Node current = openSet.poll();
            if (closed[current.row][current.col])
                continue;
            int currentKey = current.row * cols + current.col;
            if (currentKey == goalKey)
                return buildPath(parent, currentKey, cols);
            closed[current.row][current.col] = true;
            for (int[] direction : directions) {
                int neighborRow = current.row + direction[0];
                int neighborCol = current.col + direction[1];
                if (
                  neighborRow < 0 ||
                  neighborCol < 0 ||
                  neighborRow >= rows ||
                  neighborCol >= cols ||
                  grid[neighborRow][neighborCol] == 1
                ) continue;
                int neighborKey = neighborRow * cols + neighborCol;
                int newGScore = gScore.get(currentKey) + 1;
                if (
                  !gScore.containsKey(neighborKey) ||
                  newGScore < gScore.get(neighborKey)
                ) {
                    gScore.put(neighborKey, newGScore);
                    parent.put(neighborKey, currentKey);
                    int fScore =
                      newGScore +
                      Math.abs(neighborRow - goal[0]) +
                      Math.abs(neighborCol - goal[1]);
                    openSet.add(
                      new Node(
                        neighborRow,
                        neighborCol,
                        fScore,
                        orderCounter++
                      )
                    );
                }
            }
        }
        return new ArrayList<>();
    }
    int heuristic(int[] a, int[] b) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }
    List<int[]> buildPath(Map<Integer,Integer> parent, int currentKey, int cols) {
        List<int[]> path = new ArrayList<>();
        while (true) {
            path.add(0, new int[]{currentKey / cols, currentKey % cols});
            if (!parent.containsKey(currentKey)) break;
            currentKey = parent.get(currentKey);
        }
        return path;
    }
    static class Node {
        int row;
        int col;
        int fScore;
        int order;
        Node(int row, int col, int fScore, int order) {
          this.row = row;
          this.col = col;
          this.fScore = fScore;
          this.order = order;
        }
    }
}`,
  cpp: `class Solution {
public:
    int orderCounter = 0;
    struct AStarNode {
        int row, col, fScore, order;
    };
    struct Compare {
        bool operator()(const AStarNode& a, const AStarNode& b) const {
            if (a.fScore != b.fScore) return a.fScore > b.fScore;
            return a.order > b.order;
        }
    };
    vector<vector<int>> aStar(vector<vector<int>>& grid, vector<int>& start, vector<int>& goal) {
        int rows = grid.size(), cols = grid[0].size();
        priority_queue<AStarNode, vector<AStarNode>, Compare> openSet;
        unordered_map<int,int> gScore;
        unordered_map<int,int> parent;
        vector<vector<bool>> closed(rows, vector<bool>(cols, false));
        int startKey = start[0] * cols + start[1];
        int goalKey = goal[0] * cols + goal[1];
        gScore[startKey] = 0;
        openSet.push({start[0], start[1], heuristic(start, goal), orderCounter++});
        int directions[4][2] = {{0,1},{1,0},{0,-1},{-1,0}};
        while (!openSet.empty()) {
            AStarNode current = openSet.top();
            openSet.pop();
            if (closed[current.row][current.col])
                continue;
            int currentKey = current.row * cols + current.col;
            if (currentKey == goalKey)
                return buildPath(parent, currentKey, cols);
            closed[current.row][current.col] = true;
            for (auto& d : directions) {
                int nr = current.row + d[0];
                int nc = current.col + d[1];
                if (
                    nr < 0 || nc < 0 ||
                    nr >= rows || nc >= cols ||
                    grid[nr][nc] == 1
                ) continue;
                int key = nr * cols + nc;
                int newG = gScore[currentKey] + 1;
                if (!gScore.count(key) || newG < gScore[key]) {
                    gScore[key] = newG;
                    parent[key] = currentKey;
                    int f = newG + abs(nr - goal[0]) + abs(nc - goal[1]);
                    openSet.push({nr, nc, f, orderCounter++});
                }
            }
        }
        return {};
    }
    int heuristic(vector<int>& a, vector<int>& b) {
        return abs(a[0] - b[0]) + abs(a[1] - b[1]);
    }
    vector<vector<int>> buildPath(unordered_map<int,int>& parent, int key, int cols) {
        vector<vector<int>> path;
        while (true) {
            path.insert(path.begin(), { key / cols, key % cols });
            if (!parent.count(key)) break;
            key = parent[key];
        }
        return path;
    }
};`,
};

function generateVisualizationData() {
  const rows = 6;
  const cols = 8;
  const grid = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill('.'));

  // Obstacles mapping
  grid[2][3] = '#';
  grid[2][4] = '#';
  grid[3][4] = '#';

  const start: [number, number] = [0, 0];
  const goal: [number, number] = [5, 7];

  const heuristic = (x: number, y: number) => Math.abs(x - goal[0]) + Math.abs(y - goal[1]);
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  const openSet: [number, number, number][] = [];
  const openSetCells = new Map<number, Cell>();
  const closedSet = new Set<number>();
  const cameFrom = new Map<number, number>();
  const gScore = new Map<number, number>();

  const startKey = start[0] * cols + start[1];
  gScore.set(startKey, 0);
  const startF = heuristic(start[0], start[1]);
  openSet.push([startF, start[0], start[1]]);
  openSetCells.set(startKey, { x: start[0], y: start[1], g: 0, h: startF, f: startF });

  steps.push({
    grid: grid.map(row => [...row]),
    openSet: Array.from(openSetCells.values()),
    closedSet: [],
    current: null,
    path: [],
    explanation: 'Initialize open set with start node S and closed set as empty.',
    pseudoStep: 'Initialize openSet, closedSet, gScore, cameFrom',
    variables: { openSetSize: 1, closedSetSize: 0, current: 'None', gScore: 0 }
  });
  addLines(7, 6, 13, 22);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a[0] - b[0]);
    const [fScore, x, y] = openSet.shift()!;
    const key = x * cols + y;
    
    const currentCell = openSetCells.get(key) || { x, y, g: gScore.get(key) || 0, h: heuristic(x, y), f: fScore };
    openSetCells.delete(key);

    steps.push({
      grid: grid.map(row => [...row]),
      openSet: Array.from(openSetCells.values()),
      closedSet: Array.from(closedSet).map(k => {
        const cx = Math.floor(k / cols);
        const cy = k % cols;
        return { x: cx, y: cy, g: gScore.get(k) || 0, h: heuristic(cx, cy), f: (gScore.get(k) || 0) + heuristic(cx, cy) };
      }),
      current: currentCell,
      path: [],
      explanation: `Select node (${x}, ${y}) with the lowest f-score = ${currentCell.f} (g = ${currentCell.g}, h = ${currentCell.h}) from the open set.`,
      pseudoStep: 'Pop node with lowest f-score from openSet',
      variables: { openSetSize: openSet.length, closedSetSize: closedSet.size, current: `(${x}, ${y})`, f: currentCell.f, g: currentCell.g, h: currentCell.h }
    });
    addLines(15, 14, 16, 25);

    if (closedSet.has(key)) {
      steps.push({
        grid: grid.map(row => [...row]),
        openSet: Array.from(openSetCells.values()),
        closedSet: Array.from(closedSet).map(k => {
          const cx = Math.floor(k / cols);
          const cy = k % cols;
          return { x: cx, y: cy, g: gScore.get(k) || 0, h: heuristic(cx, cy), f: (gScore.get(k) || 0) + heuristic(cx, cy) };
        }),
        current: currentCell,
        path: [],
        explanation: `Node (${x}, ${y}) has already been evaluated and is in the closed set. Skip it.`,
        pseudoStep: 'IF current in closedSet THEN continue',
        variables: { openSetSize: openSet.length, closedSetSize: closedSet.size, current: `(${x}, ${y})` }
      });
      addLines(17, 16, 17, 27);
      continue;
    }

    closedSet.add(key);
    steps.push({
      grid: grid.map(row => [...row]),
      openSet: Array.from(openSetCells.values()),
      closedSet: Array.from(closedSet).map(k => {
        const cx = Math.floor(k / cols);
        const cy = k % cols;
        return { x: cx, y: cy, g: gScore.get(k) || 0, h: heuristic(cx, cy), f: (gScore.get(k) || 0) + heuristic(cx, cy) };
      }),
      current: currentCell,
      path: [],
      explanation: `Add node (${x}, ${y}) to the closed set.`,
      pseudoStep: 'Add current to closedSet',
      variables: { openSetSize: openSet.length, closedSetSize: closedSet.size, current: `(${x}, ${y})` }
    });
    addLines(18, 18, 22, 32);

    if (x === goal[0] && y === goal[1]) {
      const path: Cell[] = [];
      let curr = key;
      while (curr !== startKey) {
        const cx = Math.floor(curr / cols);
        const cy = curr % cols;
        path.unshift({ x: cx, y: cy, g: gScore.get(curr) || 0, h: heuristic(cx, cy), f: (gScore.get(curr) || 0) + heuristic(cx, cy) });
        curr = cameFrom.get(curr)!;
      }
      path.unshift({ x: start[0], y: start[1], g: 0, h: heuristic(start[0], start[1]), f: heuristic(start[0], start[1]) });

      steps.push({
        grid: grid.map(row => [...row]),
        openSet: Array.from(openSetCells.values()),
        closedSet: Array.from(closedSet).map(k => {
          const cx = Math.floor(k / cols);
          const cy = k % cols;
          return { x: cx, y: cy, g: gScore.get(k) || 0, h: heuristic(cx, cy), f: (gScore.get(k) || 0) + heuristic(cx, cy) };
        }),
        current: currentCell,
        path,
        explanation: 'Goal reached! Reconstructed path by backtracking via cameFrom parent pointers.',
        pseudoStep: 'Reconstruct path from goal to start',
        variables: { openSetSize: openSet.length, closedSetSize: closedSet.size, current: `(${x}, ${y})`, pathLength: path.length }
      });
      addLines(19, 19, 20, 30);
      break;
    }

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] === '#') {
        continue;
      }

      const neighborKey = nx * cols + ny;
      const tentative = (gScore.get(key) || 0) + 1;

      steps.push({
        grid: grid.map(row => [...row]),
        openSet: Array.from(openSetCells.values()),
        closedSet: Array.from(closedSet).map(k => {
          const cx = Math.floor(k / cols);
          const cy = k % cols;
          return { x: cx, y: cy, g: gScore.get(k) || 0, h: heuristic(cx, cy), f: (gScore.get(k) || 0) + heuristic(cx, cy) };
        }),
        current: currentCell,
        path: [],
        explanation: `Evaluate neighbor (${nx}, ${ny}). Tentative g-score: ${tentative}.`,
        pseudoStep: `Check neighbor (${nx}, ${ny})`,
        variables: { openSetSize: openSet.length, closedSetSize: closedSet.size, current: `(${x}, ${y})`, neighbor: `(${nx}, ${ny})`, tentativeG: tentative }
      });
      addLines(31, 29, 23, 33);

      if (!gScore.has(neighborKey) || tentative < (gScore.get(neighborKey) || 0)) {
        cameFrom.set(neighborKey, key);
        gScore.set(neighborKey, tentative);

        const f = tentative + heuristic(nx, ny);
        openSet.push([f, nx, ny]);
        openSetCells.set(neighborKey, { x: nx, y: ny, g: tentative, h: heuristic(nx, ny), f });

        steps.push({
          grid: grid.map(row => [...row]),
          openSet: Array.from(openSetCells.values()),
          closedSet: Array.from(closedSet).map(k => {
            const cx = Math.floor(k / cols);
            const cy = k % cols;
            return { x: cx, y: cy, g: gScore.get(k) || 0, h: heuristic(cx, cy), f: (gScore.get(k) || 0) + heuristic(cx, cy) };
          }),
          current: currentCell,
          path: [],
          explanation: `Updated shorter path to neighbor (${nx}, ${ny}): g = ${tentative}, h = ${heuristic(nx, ny)}, f = ${f}. Add to open set.`,
          pseudoStep: `Update neighbor: gScore = ${tentative}, fScore = ${f}`,
          variables: { openSetSize: openSet.length, closedSetSize: closedSet.size, current: `(${x}, ${y})`, neighbor: `(${nx}, ${ny})`, fScore: f }
        });
        addLines(41, 49, 45, 47);
      }
    }
  }

  return { steps, stepLineNumbers };
}

export const AStarVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cols = 8;

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
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex flex-col items-center justify-center relative">
            <h4 className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider text-center">A* Grid Map</h4>
            <div className="overflow-x-auto w-full flex justify-center">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {currentStep.grid.map((row, rowIdx) =>
                  row.map((cell, colIdx) => {
                    const isStart = rowIdx === 0 && colIdx === 0;
                    const isGoal = rowIdx === 5 && colIdx === 7;
                    const isCurrent = currentStep.current?.x === rowIdx && currentStep.current?.y === colIdx;
                    const inPath = currentStep.path.some(p => p.x === rowIdx && p.y === colIdx);
                    const openCell = currentStep.openSet.find(c => c.x === rowIdx && c.y === colIdx);
                    const closedCell = currentStep.closedSet.find(c => c.x === rowIdx && c.y === colIdx);
                    const isObstacle = cell === '#';

                    let cellClass = 'bg-card text-muted-foreground border-border';
                    if (isObstacle) {
                      cellClass = 'bg-slate-800 text-transparent border-slate-700 select-none shadow-inner';
                    } else if (inPath) {
                      cellClass = 'bg-green-500 text-white border-green-600 font-bold shadow-md';
                    } else if (isCurrent) {
                      cellClass = 'bg-primary text-primary-foreground border-primary-foreground font-bold ring-2 ring-primary ring-offset-2 ring-offset-background';
                    } else if (isStart) {
                      cellClass = 'bg-blue-500 text-white border-blue-600 font-bold';
                    } else if (isGoal) {
                      cellClass = 'bg-red-500 text-white border-red-600 font-bold';
                    } else if (openCell) {
                      cellClass = 'bg-amber-500/10 text-amber-500 border-amber-500/50 shadow-sm';
                    } else if (closedCell) {
                      cellClass = 'bg-slate-500/10 text-slate-400 border-slate-500/30';
                    }

                    const cellData = openCell || closedCell || (isCurrent ? currentStep.current : null) || (inPath ? currentStep.path.find(p => p.x === rowIdx && p.y === colIdx) : null);

                    return (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        className={`w-12 h-12 sm:w-16 sm:h-16 border rounded flex flex-col justify-between p-1 text-center transition-all duration-150 relative ${cellClass}`}
                      >
                        {!isObstacle && cellData && (
                          <div className="flex justify-between w-full text-[8px] opacity-75 font-mono select-none">
                            <span>g:{cellData.g}</span>
                            <span>h:{cellData.h}</span>
                          </div>
                        )}
                        
                        <div className="flex-1 flex items-center justify-center font-bold text-xs sm:text-sm">
                          {isStart ? 'S' : isGoal ? 'G' : isObstacle ? '' : cellData ? cellData.f : ''}
                        </div>

                        {!isObstacle && (
                          <div className="text-[7px] opacity-50 font-mono select-none text-right">
                            {rowIdx},{colIdx}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-[10px] text-muted-foreground border-t border-border/50 pt-4 w-full">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 border border-blue-600 rounded-sm" /> Start (S)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 border border-red-600 rounded-sm" /> Goal (G)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary border border-primary-foreground rounded-sm" /> Current</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 border border-green-600 rounded-sm" /> Shortest Path</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500/10 border border-amber-500/50 rounded-sm" /> Open Set</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-500/10 border border-slate-500/30 rounded-sm" /> Closed Set</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-800 border border-slate-700 rounded-sm" /> Obstacle</span>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <VariablePanel
            variables={{
              'Current Node': currentStep.current ? `(${currentStep.current.x}, ${currentStep.current.y})` : 'None',
              'Open Set Size': currentStep.openSet.length,
              'Closed Set Size': currentStep.closedSet.length,
              ...currentStep.variables
            }}
          />
        </div>

        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
