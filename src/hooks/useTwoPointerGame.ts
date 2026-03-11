import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGameAudio } from "./useGameAudio";

export type PointerMode = "sum" | "difference" | "product";

interface PointerGameState {
  left: number;
  right: number;
  array: number[];
  mode: PointerMode;
  level: number;
  target: number;
  score: number;
  moves: number;
  pairsFound: number;
  totalPairs: number;
  correctChecks: number;
  wrongChecks: number;
  hintsUsed: number;
  hintsRemaining: number;
  isComplete: boolean;
  message: string;
  messageType: "success" | "error" | "info" | null;
  foundPairs: string[];
}

// Generate sorted array
const generateArray = (level: number): number[] => {
  const size = Math.min(6 + level, 12);
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1);
  return arr.sort((a, b) => a - b);
};

// Find all valid pairs for the target
const findAllPairs = (arr: number[], target: number, mode: PointerMode): string[] => {
  const pairs: string[] = [];
  
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      let isValid = false;
      
      switch (mode) {
        case "sum":
          isValid = arr[i] + arr[j] === target;
          break;
        case "difference":
          isValid = Math.abs(arr[i] - arr[j]) === target;
          break;
        case "product":
          isValid = arr[i] * arr[j] === target;
          break;
      }
      
      if (isValid) {
        pairs.push(`${arr[i]},${arr[j]}`);
      }
    }
  }
  
  return pairs;
};

// Generate target based on array and mode
const generateTarget = (arr: number[], mode: PointerMode, level: number): number => {
  const mid = Math.floor(arr.length / 2);
  
  switch (mode) {
    case "sum":
      return arr[mid] + arr[arr.length - 1 - mid];
    case "difference":
      return Math.abs(arr[arr.length - 1] - arr[0]) - level;
    case "product":
      return arr[mid] * arr[mid + 1];
    default:
      return 10;
  }
};

export const useTwoPointerGame = (mode: PointerMode, level: number) => {
  const { playSuccess, playError } = useGameAudio();
  
  const initializeGame = (): PointerGameState => {
    const array = generateArray(level);
    const target = generateTarget(array, mode, level);
    const allPairs = findAllPairs(array, target, mode);
    
    return {
      left: 0,
      right: array.length - 1,
      array,
      mode,
      level,
      target,
      score: 0,
      moves: 0,
      pairsFound: 0,
      totalPairs: allPairs.length,
      correctChecks: 0,
      wrongChecks: 0,
      hintsUsed: 0,
      hintsRemaining: 3,
      isComplete: false,
      message: "",
      messageType: null,
      foundPairs: [],
    };
  };
  
  const [gameState, setGameState] = useState<PointerGameState>(initializeGame);
  
  useEffect(() => {
    setGameState(initializeGame());
  }, [mode, level]);
  
  // Calculate current value based on mode
  const currentValue = useMemo(() => {
    const { left, right, array, mode: currentMode } = gameState;
    
    switch (currentMode) {
      case "sum":
        return array[left] + array[right];
      case "difference":
        return Math.abs(array[left] - array[right]);
      case "product":
        return array[left] * array[right];
      default:
        return 0;
    }
  }, [gameState.left, gameState.right, gameState.array, gameState.mode]);
  
  const calculateScore = useMemo(() => {
    const { pairsFound, wrongChecks, moves, hintsUsed, totalPairs } = gameState;
    
    const baseScore = pairsFound * 100;
    const penalty = wrongChecks * 20 + moves + hintsUsed * 10;
    const completionBonus = pairsFound === totalPairs ? 50 : 0;
    
    return Math.max(0, Math.round(baseScore - penalty + completionBonus));
  }, [gameState.pairsFound, gameState.wrongChecks, gameState.moves, gameState.hintsUsed, gameState.totalPairs]);
  
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
        game_type: "two_pointer",
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
  
  const moveLeftPointer = (direction: "right" | "left") => {
    setGameState(prev => {
      if (direction === "right" && prev.left >= prev.right - 1) {
        return { ...prev, message: "Cannot move further!", messageType: "info" };
      }
      if (direction === "left" && prev.left <= 0) {
        return { ...prev, message: "Cannot move further!", messageType: "info" };
      }
      
      return {
        ...prev,
        left: direction === "right" ? prev.left + 1 : prev.left - 1,
        moves: prev.moves + 1,
        message: "",
        messageType: null,
      };
    });
  };
  
  const moveRightPointer = (direction: "right" | "left") => {
    setGameState(prev => {
      if (direction === "left" && prev.right <= prev.left + 1) {
        return { ...prev, message: "Cannot move further!", messageType: "info" };
      }
      if (direction === "right" && prev.right >= prev.array.length - 1) {
        return { ...prev, message: "Cannot move further!", messageType: "info" };
      }
      
      return {
        ...prev,
        right: direction === "left" ? prev.right - 1 : prev.right + 1,
        moves: prev.moves + 1,
        message: "",
        messageType: null,
      };
    });
  };
  
  const checkPair = () => {
    const { left, right, array, target, foundPairs, totalPairs } = gameState;
    const pairKey = `${array[left]},${array[right]}`;
    
    // Check if already found
    if (foundPairs.includes(pairKey)) {
      setGameState(prev => ({
        ...prev,
        message: "Pair already found!",
        messageType: "info",
      }));
      return;
    }
    
    // Check if current value matches target
    if (currentValue === target) {
      playSuccess();
      
      const newFoundPairs = [...foundPairs, pairKey];
      const newPairsFound = newFoundPairs.length;
      const isComplete = newPairsFound === totalPairs;
      
      if (isComplete) {
        saveGameSession();
      }
      
      setGameState(prev => ({
        ...prev,
        correctChecks: prev.correctChecks + 1,
        pairsFound: newPairsFound,
        foundPairs: newFoundPairs,
        isComplete,
        message: `Correct! Found pair (${array[left]}, ${array[right]})`,
        messageType: "success",
      }));
    } else {
      playError();
      
      let hint = "";
      if (currentValue < target) {
        hint = mode === "sum" ? "Too low! Move left pointer right" : "Try different positions";
      } else {
        hint = mode === "sum" ? "Too high! Move right pointer left" : "Try different positions";
      }
      
      setGameState(prev => ({
        ...prev,
        wrongChecks: prev.wrongChecks + 1,
        message: `Wrong! Current ${mode}: ${currentValue}. ${hint}`,
        messageType: "error",
      }));
    }
  };
  
  const useHint = () => {
    if (gameState.hintsRemaining <= 0) return;
    
    const { target } = gameState;
    let hintMessage = "";
    
    if (currentValue < target) {
      hintMessage = mode === "sum" ? "Move left pointer right to increase" : "Try moving pointers closer";
    } else if (currentValue > target) {
      hintMessage = mode === "sum" ? "Move right pointer left to decrease" : "Try moving pointers apart";
    } else {
      hintMessage = "Perfect match! Click Check to confirm";
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
    currentValue,
    moveLeftPointer,
    moveRightPointer,
    checkPair,
    useHint,
    reset,
    getAccuracy,
  };
};
