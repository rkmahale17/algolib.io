import { useState, useCallback, useEffect } from "react";
import { SortMode } from "@/pages/SortHero";
import { supabase } from "@/integrations/supabase/client";
import { useGameAudio } from "./useGameAudio";

export interface GameState {
  numbers: number[];
  moves: number;
  hintsUsed: number;
  selectedIndex: number | null;
  highlightIndices: number[];
  pivotIndex: number | null;
  isComplete: boolean;
  errors: number;
  score: number;
  startTime: number;
}

const generateNumbers = (count: number): number[] => {
  const numbers = Array.from({ length: count }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
};

const isSorted = (arr: number[]): boolean => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
};

export const useSortGame = (mode: SortMode, level: number) => {
  const { playSuccess, playError, playLevelComplete } = useGameAudio();
  const numberCount = 4 + (level - 1) * 2;
  
  const calculateScore = useCallback((moves: number, errors: number, hintsUsed: number, level: number) => {
    const baseScore = 100 * level;
    const movePenalty = moves * 2;
    const errorPenalty = errors * 10;
    const hintPenalty = hintsUsed * 15;
    return Math.max(0, Math.min(1000, baseScore - movePenalty - errorPenalty - hintPenalty));
  }, []);

  const saveGameSession = useCallback(async (finalState: GameState) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const durationSeconds = Math.floor((Date.now() - finalState.startTime) / 1000);
    const grade = finalState.errors === 0 && finalState.moves / finalState.numbers.length <= 2 
      ? "A+" 
      : finalState.errors <= 2 && finalState.moves / finalState.numbers.length <= 3 
      ? "A" 
      : finalState.errors <= 5 
      ? "B" 
      : "C";

    await supabase.from('game_sessions').insert({
      user_id: user.id,
      game_type: 'sort_hero',
      score: finalState.score,
      level,
      moves: finalState.moves,
      errors: finalState.errors,
      hints_used: finalState.hintsUsed,
      grade,
      duration_seconds: durationSeconds,
    });
  }, [level]);
  
  const [gameState, setGameState] = useState<GameState>({
    numbers: generateNumbers(numberCount),
    moves: 0,
    hintsUsed: 0,
    selectedIndex: null,
    highlightIndices: [],
    pivotIndex: mode === "quick" ? Math.floor(numberCount / 2) : null,
    isComplete: false,
    errors: 0,
    score: 0,
    startTime: Date.now(),
  });

  useEffect(() => {
    setGameState({
      numbers: generateNumbers(numberCount),
      moves: 0,
      hintsUsed: 0,
      selectedIndex: null,
      highlightIndices: [],
      pivotIndex: mode === "quick" ? Math.floor(numberCount / 2) : null,
      isComplete: false,
      errors: 0,
      score: 0,
      startTime: Date.now(),
    });
  }, [level, mode, numberCount]);

  useEffect(() => {
    if (gameState.isComplete) {
      const finalScore = calculateScore(gameState.moves, gameState.errors, gameState.hintsUsed, level);
      const finalState = { ...gameState, score: finalScore };
      setGameState(prev => ({ ...prev, score: finalScore }));
      saveGameSession(finalState);
      playLevelComplete();
    }
  }, [gameState.isComplete, gameState.moves, gameState.errors, gameState.hintsUsed, level, calculateScore, saveGameSession, playLevelComplete]);

  const selectTile = useCallback((index: number) => {
    setGameState(prev => ({
      ...prev,
      selectedIndex: prev.selectedIndex === index ? null : index,
      highlightIndices: prev.selectedIndex === index ? [] : [index],
    }));
  }, []);

  const swapTiles = useCallback((index1: number, index2: number) => {
    setGameState(prev => {
      const newNumbers = [...prev.numbers];
      
      // Validate move based on mode
      let isValid = false;
      if (mode === "bubble") {
        isValid = Math.abs(index1 - index2) === 1 && newNumbers[index1] > newNumbers[index2];
      } else if (mode === "selection") {
        const minIndex = prev.numbers.indexOf(Math.min(...prev.numbers.slice(prev.moves)));
        isValid = index1 === minIndex && index2 === prev.moves;
      } else if (mode === "quick" && prev.pivotIndex !== null) {
        const pivot = newNumbers[prev.pivotIndex];
        isValid = (newNumbers[index1] < pivot && index2 < prev.pivotIndex) ||
                  (newNumbers[index1] > pivot && index2 > prev.pivotIndex);
      }

      if (!isValid) {
        playError();
      } else {
        playSuccess();
      }

      [newNumbers[index1], newNumbers[index2]] = [newNumbers[index2], newNumbers[index1]];
      
      const sorted = isSorted(newNumbers);
      
      return {
        ...prev,
        numbers: newNumbers,
        moves: prev.moves + 1,
        selectedIndex: null,
        highlightIndices: [],
        isComplete: sorted,
        errors: isValid ? prev.errors : prev.errors + 1,
      };
    });
  }, [mode, playSuccess, playError]);

  const useHint = useCallback(() => {
    setGameState(prev => {
      if (prev.hintsUsed >= 3) return prev;

      let highlightIndices: number[] = [];

      if (mode === "bubble") {
        for (let i = 0; i < prev.numbers.length - 1; i++) {
          if (prev.numbers[i] > prev.numbers[i + 1]) {
            highlightIndices = [i, i + 1];
            break;
          }
        }
      } else if (mode === "selection") {
        const unsorted = prev.numbers.slice(prev.moves);
        const minValue = Math.min(...unsorted);
        const minIndex = prev.numbers.indexOf(minValue, prev.moves);
        highlightIndices = [minIndex, prev.moves];
      } else if (mode === "quick" && prev.pivotIndex !== null) {
        highlightIndices = [prev.pivotIndex];
      }

      return {
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        highlightIndices,
      };
    });
  }, [mode]);

  const reset = useCallback(() => {
    setGameState({
      numbers: generateNumbers(numberCount),
      moves: 0,
      hintsUsed: 0,
      selectedIndex: null,
      highlightIndices: [],
      pivotIndex: mode === "quick" ? Math.floor(numberCount / 2) : null,
      isComplete: false,
      errors: 0,
      score: 0,
      startTime: Date.now(),
    });
  }, [mode, numberCount]);

  const undo = useCallback(() => {
    // Simple implementation - in production would need history stack
    reset();
  }, [reset]);

  return {
    gameState,
    selectTile,
    swapTiles,
    useHint,
    reset,
    undo,
  };
};
