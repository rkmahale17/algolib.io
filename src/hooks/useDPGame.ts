import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGameAudio } from "./useGameAudio";

export type DPMode = "fibonacci" | "knapsack" | "lcs" | "coinChange";

interface Cell {
  value: number | null;
  isEditable: boolean;
  isCorrect: boolean | null;
  row: number;
  col: number;
}

interface DPGameState {
  grid: Cell[][];
  mode: DPMode;
  level: number;
  score: number;
  hintsUsed: number;
  hintsRemaining: number;
  wrongAttempts: number;
  correctCells: number;
  totalEditableCells: number;
  isComplete: boolean;
  problemData: ProblemData;
  highlightedCells: { row: number; col: number }[];
  showFormula: boolean;
}

interface ProblemData {
  // For Fibonacci
  fibSequence?: number[];
  // For Knapsack
  weights?: number[];
  values?: number[];
  capacity?: number;
  // For LCS
  string1?: string;
  string2?: string;
  // For Coin Change
  coins?: number[];
  target?: number;
}

// Generate problem data based on mode and level
const generateProblemData = (mode: DPMode, level: number): ProblemData => {
  switch (mode) {
    case "fibonacci":
      return { fibSequence: [0, 1] };
    case "knapsack":
      const itemCount = Math.min(3 + level, 6);
      return {
        weights: Array.from({ length: itemCount }, (_, i) => i + 1),
        values: Array.from({ length: itemCount }, (_, i) => (i + 1) * 2),
        capacity: Math.min(5 + level, 10),
      };
    case "lcs":
      const strings = [
        ["ABCD", "AEBD"],
        ["AGGTAB", "GXTXAYB"],
        ["ABCDEF", "AEBDCF"],
        ["DYNAMIC", "CODING"],
      ];
      const pair = strings[Math.min(level - 1, strings.length - 1)];
      return { string1: pair[0], string2: pair[1] };
    case "coinChange":
      const coinSets = [
        { coins: [1, 2, 3], target: 4 },
        { coins: [1, 2, 5], target: 5 },
        { coins: [1, 3, 4], target: 6 },
        { coins: [2, 3, 5], target: 8 },
      ];
      const set = coinSets[Math.min(level - 1, coinSets.length - 1)];
      return set;
    default:
      return {};
  }
};

// Compute correct DP table
const computeCorrectGrid = (mode: DPMode, data: ProblemData): number[][] => {
  switch (mode) {
    case "fibonacci": {
      const size = 8;
      const dp = Array(size).fill(0);
      dp[0] = 0;
      dp[1] = 1;
      for (let i = 2; i < size; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
      }
      return [dp];
    }
    case "knapsack": {
      const { weights = [], values = [], capacity = 0 } = data;
      const n = weights.length;
      const dp = Array(n + 1)
        .fill(0)
        .map(() => Array(capacity + 1).fill(0));
      
      for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
          if (weights[i - 1] <= w) {
            dp[i][w] = Math.max(
              dp[i - 1][w],
              dp[i - 1][w - weights[i - 1]] + values[i - 1]
            );
          } else {
            dp[i][w] = dp[i - 1][w];
          }
        }
      }
      return dp;
    }
    case "lcs": {
      const { string1 = "", string2 = "" } = data;
      const m = string1.length;
      const n = string2.length;
      const dp = Array(m + 1)
        .fill(0)
        .map(() => Array(n + 1).fill(0));
      
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (string1[i - 1] === string2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
        }
      }
      return dp;
    }
    case "coinChange": {
      const { coins = [], target = 0 } = data;
      const n = coins.length;
      const dp = Array(n + 1)
        .fill(0)
        .map(() => Array(target + 1).fill(0));
      
      // Base case: one way to make 0
      for (let i = 0; i <= n; i++) {
        dp[i][0] = 1;
      }
      
      for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= target; j++) {
          dp[i][j] = dp[i - 1][j];
          if (j >= coins[i - 1]) {
            dp[i][j] += dp[i][j - coins[i - 1]];
          }
        }
      }
      return dp;
    }
    default:
      return [[]];
  }
};

// Create game grid with some cells hidden
const createGameGrid = (correctGrid: number[][], level: number, mode: DPMode): Cell[][] => {
  const rows = correctGrid.length;
  const cols = correctGrid[0]?.length || 0;
  
  // Determine how many cells to hide based on level
  const hiddenCellsCount = Math.min(2 + level * 2, Math.floor(rows * cols * 0.4));
  
  const grid: Cell[][] = correctGrid.map((row, i) =>
    row.map((val, j) => ({
      value: val,
      isEditable: false,
      isCorrect: null,
      row: i,
      col: j,
    }))
  );
  
  // Hide cells (but not base cases)
  let hidden = 0;
  const attempts = hiddenCellsCount * 3; // Try multiple times
  
  for (let attempt = 0; attempt < attempts && hidden < hiddenCellsCount; attempt++) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    // For Fibonacci (1D), only protect first 2 columns (base cases)
    // For 2D problems, protect first row/col
    const isBaseCase = mode === "fibonacci" 
      ? col < 2  // Protect fib[0] and fib[1]
      : (row === 0 || col === 0);  // Protect first row/col for 2D problems
    
    if (isBaseCase || grid[row][col].isEditable) {
      continue;
    }
    
    grid[row][col].value = null;
    grid[row][col].isEditable = true;
    hidden++;
  }
  
  return grid;
};

export const useDPGame = (mode: DPMode, level: number) => {
  const { playSuccess, playError } = useGameAudio();
  
  const initializeGame = (): DPGameState => {
    const problemData = generateProblemData(mode, level);
    const correctGrid = computeCorrectGrid(mode, problemData);
    const grid = createGameGrid(correctGrid, level, mode);
    
    const totalEditableCells = grid.flat().filter(c => c.isEditable).length;
    
    return {
      grid,
      mode,
      level,
      score: 0,
      hintsUsed: 0,
      hintsRemaining: 3,
      wrongAttempts: 0,
      correctCells: 0,
      totalEditableCells,
      isComplete: false,
      problemData,
      highlightedCells: [],
      showFormula: false,
    };
  };
  
  const [gameState, setGameState] = useState<DPGameState>(initializeGame);
  
  useEffect(() => {
    setGameState(initializeGame());
  }, [mode, level]);
  
  const correctGrid = useMemo(
    () => computeCorrectGrid(gameState.mode, gameState.problemData),
    [gameState.mode, gameState.problemData]
  );
  
  const calculateScore = useMemo(() => {
    const { correctCells, totalEditableCells, wrongAttempts, hintsUsed } = gameState;
    
    if (totalEditableCells === 0) return 0;
    
    const baseScore = (correctCells / totalEditableCells) * 500;
    const accuracyBonus = Math.max(0, 200 - wrongAttempts * 10);
    const hintPenalty = hintsUsed * 30;
    const completionBonus = gameState.isComplete ? 300 : 0;
    
    return Math.round(Math.max(0, baseScore + accuracyBonus - hintPenalty + completionBonus));
  }, [gameState]);
  
  const getAccuracy = () => {
    const total = gameState.correctCells + gameState.wrongAttempts;
    return total === 0 ? 100 : Math.round((gameState.correctCells / total) * 100);
  };
  
  const saveGameSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const accuracy = getAccuracy();
      let grade = "F";
      if (accuracy >= 95) grade = "S";
      else if (accuracy >= 90) grade = "A";
      else if (accuracy >= 80) grade = "B";
      else if (accuracy >= 70) grade = "C";
      else if (accuracy >= 60) grade = "D";
      
      await supabase.from("game_sessions").insert({
        user_id: user.id,
        game_type: "dp_puzzle",
        mode: gameState.mode,
        level: gameState.level,
        score: calculateScore,
        moves: gameState.correctCells + gameState.wrongAttempts,
        errors: gameState.wrongAttempts,
        grade,
      });
    } catch (error) {
      console.error("Failed to save game session:", error);
    }
  };
  
  const enterValue = (row: number, col: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) && value !== "") return;
    
    setGameState(prev => {
      const newGrid = prev.grid.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      
      if (!cell.isEditable) return prev;
      
      const correctValue = correctGrid[row][col];
      const parsedValue = value === "" ? null : numValue;
      
      cell.value = parsedValue;
      
      if (parsedValue !== null) {
        const isCorrect = parsedValue === correctValue;
        cell.isCorrect = isCorrect;
        
        if (isCorrect) {
          playSuccess();
          const newCorrectCells = prev.correctCells + 1;
          const isComplete = newCorrectCells === prev.totalEditableCells;
          
          if (isComplete) {
            saveGameSession();
          }
          
          return {
            ...prev,
            grid: newGrid,
            correctCells: newCorrectCells,
            isComplete,
            score: calculateScore,
            highlightedCells: [],
          };
        } else {
          playError();
          return {
            ...prev,
            grid: newGrid,
            wrongAttempts: prev.wrongAttempts + 1,
            highlightedCells: [],
          };
        }
      }
      
      return { ...prev, grid: newGrid };
    });
  };
  
  const useHint = (row: number, col: number) => {
    if (gameState.hintsRemaining <= 0) return;
    
    setGameState(prev => {
      // Highlight parent cells that contribute to this cell
      const highlighted: { row: number; col: number }[] = [];
      
      switch (prev.mode) {
        case "fibonacci":
          if (col > 1) {
            highlighted.push({ row: 0, col: col - 1 });
            highlighted.push({ row: 0, col: col - 2 });
          }
          break;
        case "knapsack":
        case "lcs":
        case "coinChange":
          if (row > 0) highlighted.push({ row: row - 1, col });
          if (col > 0) highlighted.push({ row, col: col - 1 });
          if (row > 0 && col > 0) highlighted.push({ row: row - 1, col: col - 1 });
          break;
      }
      
      return {
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        hintsRemaining: prev.hintsRemaining - 1,
        highlightedCells: highlighted,
        showFormula: true,
      };
    });
    
    playSuccess();
  };
  
  const toggleFormula = () => {
    setGameState(prev => ({ ...prev, showFormula: !prev.showFormula }));
  };
  
  const reset = () => {
    setGameState(initializeGame());
  };
  
  const checkAll = () => {
    setGameState(prev => {
      const newGrid = prev.grid.map(row =>
        row.map(cell => {
          if (cell.isEditable && cell.value !== null) {
            const correctValue = correctGrid[cell.row][cell.col];
            return { ...cell, isCorrect: cell.value === correctValue };
          }
          return cell;
        })
      );
      
      return { ...prev, grid: newGrid };
    });
  };
  
  return {
    gameState: { ...gameState, score: calculateScore },
    correctGrid,
    enterValue,
    useHint,
    toggleFormula,
    reset,
    checkAll,
    getAccuracy,
  };
};
