import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGameAudio } from "./useGameAudio";

export type WindowMode = "maxSum" | "distinct" | "substring" | "targetSum";

interface WindowState {
  left: number;
  right: number;
  array: number[];
  mode: WindowMode;
  level: number;
  target: number;
  score: number;
  moves: number;
  correctChecks: number;
  wrongChecks: number;
  hintsUsed: number;
  hintsRemaining: number;
  isComplete: boolean;
  message: string;
  messageType: "success" | "error" | "info" | null;
}

// Generate random array based on mode and level
const generateArray = (mode: WindowMode, level: number): number[] => {
  const size = Math.min(6 + level, 12);
  
  switch (mode) {
    case "maxSum":
    case "targetSum":
      return Array.from({ length: size }, () => Math.floor(Math.random() * 10) + 1);
    case "distinct":
      // Mix of duplicates and unique values
      const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 8) + 1);
      return arr;
    case "substring":
      // Generate as "string indices" but show as numbers
      return Array.from({ length: size }, () => Math.floor(Math.random() * 5) + 1);
    default:
      return Array.from({ length: size }, () => Math.floor(Math.random() * 10) + 1);
  }
};

// Generate target based on mode and array
const generateTarget = (mode: WindowMode, array: number[], level: number): number => {
  switch (mode) {
    case "maxSum": {
      const totalSum = array.reduce((a, b) => a + b, 0);
      return Math.floor(totalSum * (0.4 + level * 0.1));
    }
    case "targetSum": {
      // Pick a random subarray sum
      const start = Math.floor(Math.random() * (array.length - 2));
      const end = start + 2 + Math.floor(Math.random() * 3);
      return array.slice(start, Math.min(end, array.length)).reduce((a, b) => a + b, 0);
    }
    case "distinct":
      return Math.min(3 + level, 6); // Target distinct count
    case "substring":
      return Math.min(4 + level, 8); // Target length
    default:
      return 10;
  }
};

export const useSlidingWindowGame = (mode: WindowMode, level: number) => {
  const { playSuccess, playError } = useGameAudio();
  
  const initializeGame = (): WindowState => {
    const array = generateArray(mode, level);
    const target = generateTarget(mode, array, level);
    
    return {
      left: 0,
      right: 1,
      array,
      mode,
      level,
      target,
      score: 0,
      moves: 0,
      correctChecks: 0,
      wrongChecks: 0,
      hintsUsed: 0,
      hintsRemaining: 3,
      isComplete: false,
      message: "",
      messageType: null,
    };
  };
  
  const [gameState, setGameState] = useState<WindowState>(initializeGame);
  
  useEffect(() => {
    setGameState(initializeGame());
  }, [mode, level]);
  
  // Calculate current window properties
  const windowData = useMemo(() => {
    const { left, right, array, mode: currentMode } = gameState;
    const windowArray = array.slice(left, right + 1);
    const sum = windowArray.reduce((a, b) => a + b, 0);
    const distinct = new Set(windowArray).size;
    const length = windowArray.length;
    
    return { windowArray, sum, distinct, length };
  }, [gameState.left, gameState.right, gameState.array, gameState.mode]);
  
  // Check if current window meets the condition
  const checkCondition = (): { met: boolean; optimal: boolean; message: string } => {
    const { mode: currentMode, target, left, right, array } = gameState;
    const { sum, distinct, length, windowArray } = windowData;
    
    switch (currentMode) {
      case "maxSum": {
        if (sum > target) {
          return { met: false, optimal: false, message: `Sum ${sum} > ${target}. Too high!` };
        }
        // Check if this is close to optimal (within 90%)
        const optimal = sum >= target * 0.9;
        return {
          met: true,
          optimal,
          message: optimal ? `Great! Sum = ${sum}` : `Valid but can improve. Sum = ${sum}`,
        };
      }
      case "targetSum": {
        if (sum === target) {
          return { met: true, optimal: true, message: `Perfect! Sum = ${target}` };
        }
        return {
          met: false,
          optimal: false,
          message: sum > target ? `Sum ${sum} > ${target}` : `Sum ${sum} < ${target}`,
        };
      }
      case "distinct": {
        const hasDuplicates = distinct < windowArray.length;
        if (hasDuplicates) {
          return { met: false, optimal: false, message: `Has duplicates! ${distinct} distinct only` };
        }
        const optimal = distinct >= target;
        return {
          met: true,
          optimal,
          message: optimal ? `Excellent! ${distinct} distinct elements` : `Good! ${distinct} distinct`,
        };
      }
      case "substring": {
        const hasDuplicates = distinct < windowArray.length;
        if (hasDuplicates) {
          return { met: false, optimal: false, message: `Repeating elements found!` };
        }
        const optimal = length >= target;
        return {
          met: true,
          optimal,
          message: optimal ? `Amazing! Length = ${length}` : `Good! Length = ${length}`,
        };
      }
      default:
        return { met: false, optimal: false, message: "" };
    }
  };
  
  const calculateScore = useMemo(() => {
    const { correctChecks, wrongChecks, moves, hintsUsed } = gameState;
    
    const baseScore = correctChecks * 50;
    const penalty = wrongChecks * 20 + moves + hintsUsed * 30;
    const total = Math.max(0, baseScore - penalty);
    
    return Math.round(total);
  }, [gameState.correctChecks, gameState.wrongChecks, gameState.moves, gameState.hintsUsed]);
  
  const getAccuracy = () => {
    const total = gameState.correctChecks + gameState.wrongChecks;
    return total === 0 ? 100 : Math.round((gameState.correctChecks / total) * 100);
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
        game_type: "sliding_window",
        mode: gameState.mode,
        level: gameState.level,
        score: calculateScore,
        moves: gameState.moves,
        errors: gameState.wrongChecks,
        grade,
      });
    } catch (error) {
      console.error("Failed to save game session:", error);
    }
  };
  
  const expand = () => {
    setGameState(prev => {
      if (prev.right >= prev.array.length - 1) {
        return { ...prev, message: "Cannot expand further!", messageType: "info" };
      }
      
      return {
        ...prev,
        right: prev.right + 1,
        moves: prev.moves + 1,
        message: "",
        messageType: null,
      };
    });
  };
  
  const shrink = () => {
    setGameState(prev => {
      if (prev.left >= prev.right) {
        return { ...prev, message: "Window too small!", messageType: "info" };
      }
      
      return {
        ...prev,
        left: prev.left + 1,
        moves: prev.moves + 1,
        message: "",
        messageType: null,
      };
    });
  };
  
  const check = () => {
    const result = checkCondition();
    
    setGameState(prev => {
      if (result.met) {
        playSuccess();
        const bonusScore = result.optimal ? 100 : 0;
        const newCorrectChecks = prev.correctChecks + 1;
        
        // Complete if optimal or after multiple correct checks
        const isComplete = result.optimal || newCorrectChecks >= 3;
        
        if (isComplete) {
          saveGameSession();
        }
        
        return {
          ...prev,
          correctChecks: newCorrectChecks,
          score: prev.score + 50 + bonusScore,
          isComplete,
          message: result.message,
          messageType: "success",
        };
      } else {
        playError();
        return {
          ...prev,
          wrongChecks: prev.wrongChecks + 1,
          score: Math.max(0, prev.score - 20),
          message: result.message,
          messageType: "error",
        };
      }
    });
  };
  
  const useHint = () => {
    if (gameState.hintsRemaining <= 0) return;
    
    const { mode: currentMode, target, array, left, right } = gameState;
    const { sum, distinct, windowArray } = windowData;
    
    let hintMessage = "";
    
    switch (currentMode) {
      case "maxSum":
        hintMessage = sum > target ? "Try shrinking from the left" : "Try expanding to the right";
        break;
      case "targetSum":
        hintMessage = sum > target ? "Shrink to reduce sum" : sum < target ? "Expand to increase sum" : "Check now!";
        break;
      case "distinct":
        hintMessage = distinct < windowArray.length ? "Shrink to remove duplicates" : "Expand carefully";
        break;
      case "substring":
        hintMessage = distinct < windowArray.length ? "Shrink to remove repeats" : "Expand for longer window";
        break;
    }
    
    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      hintsRemaining: prev.hintsRemaining - 1,
      message: `Hint: ${hintMessage}`,
      messageType: "info",
    }));
    
    playSuccess();
  };
  
  const reset = () => {
    setGameState(initializeGame());
  };
  
  return {
    gameState: { ...gameState, score: calculateScore },
    windowData,
    expand,
    shrink,
    check,
    useHint,
    reset,
    getAccuracy,
    checkCondition,
  };
};
