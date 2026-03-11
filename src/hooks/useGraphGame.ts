import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGameAudio } from "./useGameAudio";

export type GraphMode = "bfs" | "dfs";

export interface Cell {
  x: number;
  y: number;
  isWall: boolean;
  visited: boolean;
  inFrontier: boolean;
  isPath: boolean;
  visitOrder: number;
}

export interface GraphGameState {
  grid: Cell[][];
  startPos: { x: number; y: number };
  goalPos: { x: number; y: number };
  currentPos: { x: number; y: number } | null;
  frontier: { x: number; y: number }[];
  visited: Set<string>;
  moves: number;
  hintsUsed: number;
  isComplete: boolean;
  isPlaying: boolean;
  path: { x: number; y: number }[];
  score: number;
  startTime: number;
  visitOrder: number;
}

const createEmptyGrid = (size: number): Cell[][] => {
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => ({
      x,
      y,
      isWall: false,
      visited: false,
      inFrontier: false,
      isPath: false,
      visitOrder: -1,
    }))
  );
};

const generateMaze = (size: number): { grid: Cell[][], start: { x: number; y: number }, goal: { x: number; y: number } } => {
  const grid = createEmptyGrid(size);
  
  // Add random walls (20-30% of cells)
  const wallProbability = 0.25;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (Math.random() < wallProbability) {
        grid[y][x].isWall = true;
      }
    }
  }
  
  // Set start (top-left area) and goal (bottom-right area)
  const start = { x: 0, y: 0 };
  const goal = { x: size - 1, y: size - 1 };
  
  // Ensure start and goal are not walls
  grid[start.y][start.x].isWall = false;
  grid[goal.y][goal.x].isWall = false;
  
  // Ensure there's a path by clearing some cells along a diagonal
  for (let i = 0; i < size; i++) {
    if (Math.random() > 0.3) {
      grid[i][i].isWall = false;
    }
  }
  
  return { grid, start, goal };
};

const getNeighbors = (pos: { x: number; y: number }, grid: Cell[][]): { x: number; y: number }[] => {
  const neighbors = [];
  const size = grid.length;
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 },  // right
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }, // left
  ];
  
  for (const dir of directions) {
    const newX = pos.x + dir.x;
    const newY = pos.y + dir.y;
    
    if (newX >= 0 && newX < size && newY >= 0 && newY < size && !grid[newY][newX].isWall) {
      neighbors.push({ x: newX, y: newY });
    }
  }
  
  return neighbors;
};

export const useGraphGame = (mode: GraphMode, level: number) => {
  const { playSuccess, playError, playLevelComplete } = useGameAudio();
  const gridSize = Math.min(5 + level, 12); // Start at 5x5, max 12x12
  
  const calculateScore = useCallback((moves: number, hintsUsed: number, pathLength: number, gridSize: number, foundGoal: boolean) => {
    if (!foundGoal) return 0;
    
    const baseScore = 300;
    const optimalMoves = gridSize * 2;
    const moveEfficiency = Math.max(0, 1 - (moves - optimalMoves) / optimalMoves);
    const efficiencyBonus = Math.floor(moveEfficiency * 400);
    const pathBonus = Math.max(0, 200 - pathLength * 5);
    const hintPenalty = hintsUsed * 50;
    
    return Math.max(0, Math.min(1000, Math.floor(baseScore + efficiencyBonus + pathBonus - hintPenalty)));
  }, []);

  const saveGameSession = useCallback(async (finalState: GraphGameState) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const durationSeconds = Math.floor((Date.now() - finalState.startTime) / 1000);
    const grade = finalState.score >= 800 ? "A+" : finalState.score >= 600 ? "A" : finalState.score >= 400 ? "B" : "C";

    await supabase.from('game_sessions').insert({
      user_id: user.id,
      game_type: 'graph_explorer',
      score: finalState.score,
      level,
      moves: finalState.moves,
      errors: 0,
      hints_used: finalState.hintsUsed,
      grade,
      duration_seconds: durationSeconds,
    });
  }, [level]);
  
  const initializeGame = useCallback(() => {
    const { grid, start, goal } = generateMaze(gridSize);
    return {
      grid,
      startPos: start,
      goalPos: goal,
      currentPos: null,
      frontier: [],
      visited: new Set<string>(),
      moves: 0,
      hintsUsed: 0,
      isComplete: false,
      isPlaying: false,
      path: [],
      score: 0,
      startTime: Date.now(),
      visitOrder: 0,
    };
  }, [gridSize]);
  
  const [gameState, setGameState] = useState<GraphGameState>(initializeGame());

  useEffect(() => {
    setGameState(initializeGame());
  }, [level, mode, initializeGame]);

  useEffect(() => {
    if (gameState.isComplete) {
      const finalScore = calculateScore(
        gameState.moves,
        gameState.hintsUsed,
        gameState.path.length,
        gridSize,
        true
      );
      const finalState = { ...gameState, score: finalScore };
      setGameState(prev => ({ ...prev, score: finalScore }));
      saveGameSession(finalState);
      playLevelComplete();
    }
  }, [gameState.isComplete, gameState.moves, gameState.hintsUsed, gameState.path.length, gridSize, calculateScore, saveGameSession, playLevelComplete]);

  const startAlgorithm = useCallback(() => {
    setGameState(prev => {
      const newGrid = prev.grid.map(row => row.map(cell => ({ ...cell })));
      newGrid[prev.startPos.y][prev.startPos.x].visited = true;
      newGrid[prev.startPos.y][prev.startPos.x].inFrontier = true;
      newGrid[prev.startPos.y][prev.startPos.x].visitOrder = 0;
      
      return {
        ...prev,
        grid: newGrid,
        currentPos: prev.startPos,
        frontier: [prev.startPos],
        visited: new Set([`${prev.startPos.x},${prev.startPos.y}`]),
        isPlaying: true,
        visitOrder: 1,
      };
    });
  }, []);

  const step = useCallback(() => {
    setGameState(prev => {
      if (prev.frontier.length === 0 || prev.isComplete) {
        return prev;
      }

      const newGrid = prev.grid.map(row => row.map(cell => ({ ...cell })));
      const newFrontier = [...prev.frontier];
      const newVisited = new Set(prev.visited);
      
      // Get next position based on mode
      const currentPos = mode === "bfs" ? newFrontier.shift()! : newFrontier.pop()!;
      
      // Check if reached goal
      if (currentPos.x === prev.goalPos.x && currentPos.y === prev.goalPos.y) {
        playSuccess();
        return {
          ...prev,
          currentPos,
          isComplete: true,
          isPlaying: false,
          path: [currentPos],
        };
      }
      
      // Get neighbors
      const neighbors = getNeighbors(currentPos, newGrid);
      
      for (const neighbor of neighbors) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (!newVisited.has(key)) {
          newVisited.add(key);
          newFrontier.push(neighbor);
          newGrid[neighbor.y][neighbor.x].visited = true;
          newGrid[neighbor.y][neighbor.x].inFrontier = true;
          newGrid[neighbor.y][neighbor.x].visitOrder = prev.visitOrder;
        }
      }
      
      // Update current position
      newGrid[currentPos.y][currentPos.x].inFrontier = false;
      
      playSuccess();
      
      return {
        ...prev,
        grid: newGrid,
        currentPos,
        frontier: newFrontier,
        visited: newVisited,
        moves: prev.moves + 1,
        visitOrder: prev.visitOrder + 1,
      };
    });
  }, [mode, playSuccess]);

  const autoPlay = useCallback(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.frontier.length === 0 || prev.isComplete) {
          clearInterval(interval);
          return { ...prev, isPlaying: false };
        }
        return prev;
      });
      step();
    }, 300);
    
    return () => clearInterval(interval);
  }, [step]);

  const useHint = useCallback(() => {
    setGameState(prev => {
      if (prev.hintsUsed >= 3 || prev.frontier.length === 0) {
        return prev;
      }
      
      const nextPos = mode === "bfs" ? prev.frontier[0] : prev.frontier[prev.frontier.length - 1];
      const newGrid = prev.grid.map(row => row.map(cell => ({ ...cell })));
      newGrid[nextPos.y][nextPos.x].inFrontier = true;
      
      return {
        ...prev,
        grid: newGrid,
        hintsUsed: prev.hintsUsed + 1,
      };
    });
  }, [mode]);

  const reset = useCallback(() => {
    setGameState(initializeGame());
  }, [initializeGame]);

  return {
    gameState,
    startAlgorithm,
    step,
    autoPlay,
    useHint,
    reset,
  };
};
