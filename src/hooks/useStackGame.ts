import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGameAudio } from "./useGameAudio";

export type StackMode = "parentheses" | "brackets" | "tags" | "speed";

export interface FallingSymbol {
  id: number;
  char: string;
  matchedWith: string;
  y: number;
  speed: number;
  type: 'open' | 'close';
}

export interface StackGameState {
  stack: string[];
  fallingSymbols: FallingSymbol[];
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  correctMoves: number;
  totalMoves: number;
  isPlaying: boolean;
  isGameOver: boolean;
  level: number;
  startTime: number;
  nextSymbolId: number;
}

const symbolPairs: Record<StackMode, Array<{ open: string; close: string }>> = {
  parentheses: [{ open: '(', close: ')' }],
  brackets: [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' }
  ],
  tags: [
    { open: '<div>', close: '</div>' },
    { open: '<p>', close: '</p>' },
    { open: '<span>', close: '</span>' }
  ],
  speed: [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' }
  ]
};

const getSymbolColor = (char: string): string => {
  if (char.includes('(') || char.includes(')')) return 'text-green-500';
  if (char.includes('[') || char.includes(']')) return 'text-blue-500';
  if (char.includes('{') || char.includes('}')) return 'text-orange-500';
  if (char.includes('<')) return 'text-blue-500';
  return 'text-foreground';
};

export const useStackGame = (mode: StackMode) => {
  const { playSuccess, playError, playLevelComplete } = useGameAudio();

  const [gameState, setGameState] = useState<StackGameState>({
    stack: [],
    fallingSymbols: [],
    score: 0,
    lives: 3,
    combo: 0,
    maxCombo: 0,
    correctMoves: 0,
    totalMoves: 0,
    isPlaying: false,
    isGameOver: false,
    level: 1,
    startTime: Date.now(),
    nextSymbolId: 0,
  });

  const animationFrameRef = useRef<number>();
  const lastSpawnTimeRef = useRef<number>(0);

  const getSpawnInterval = useCallback(() => {
    if (mode === 'speed') {
      return Math.max(500, 1500 - gameState.level * 100);
    }
    return Math.max(800, 1500 - gameState.level * 50);
  }, [mode, gameState.level]);

  const generateSymbol = useCallback((): FallingSymbol => {
    const pairs = symbolPairs[mode];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const isOpen = Math.random() > 0.5;

    return {
      id: gameState.nextSymbolId,
      char: isOpen ? pair.open : pair.close,
      matchedWith: isOpen ? pair.close : pair.open,
      y: 0,
      speed: 0.5 + gameState.level * 0.1,
      type: isOpen ? 'open' : 'close'
    };
  }, [mode, gameState.nextSymbolId, gameState.level]);

  const calculateScore = useCallback((correctMoves: number, totalMoves: number, maxCombo: number, level: number) => {
    const accuracy = totalMoves > 0 ? correctMoves / totalMoves : 0;
    const baseScore = correctMoves * 10;
    const comboBonus = maxCombo * 5;
    const levelBonus = level * 50;
    const accuracyBonus = Math.floor(accuracy * 200);

    return Math.max(0, Math.min(1000, Math.floor(baseScore + comboBonus + levelBonus + accuracyBonus)));
  }, []);

  const saveGameSession = useCallback(async (finalState: StackGameState) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const durationSeconds = Math.floor((Date.now() - finalState.startTime) / 1000);
    const accuracy = finalState.totalMoves > 0 ? finalState.correctMoves / finalState.totalMoves : 0;
    const grade = accuracy >= 0.95 ? "A+" : accuracy >= 0.85 ? "A" : accuracy >= 0.7 ? "B" : "C";

    await supabase.from('game_sessions').insert({
      user_id: user.id,
      game_type: 'stack_master',
      score: finalState.score,
      level: finalState.level,
      moves: finalState.totalMoves,
      errors: finalState.totalMoves - finalState.correctMoves,
      hints_used: 0,
      grade,
      duration_seconds: durationSeconds,
    });
  }, []);

  const push = useCallback((symbol: FallingSymbol) => {
    setGameState(prev => {
      const isCorrect = symbol.type === 'open';

      if (isCorrect) {
        playSuccess();
        const newCombo = prev.combo + 1;
        const comboBonus = newCombo >= 10 ? Math.floor(newCombo / 10) * 20 : 0;

        return {
          ...prev,
          stack: [...prev.stack, symbol.char],
          score: prev.score + 10 + comboBonus,
          combo: newCombo,
          maxCombo: Math.max(prev.maxCombo, newCombo),
          correctMoves: prev.correctMoves + 1,
          totalMoves: prev.totalMoves + 1,
          fallingSymbols: prev.fallingSymbols.filter(s => s.id !== symbol.id),
        };
      } else {
        playError();
        const newLives = prev.lives - 1;

        return {
          ...prev,
          lives: newLives,
          combo: 0,
          totalMoves: prev.totalMoves + 1,
          isGameOver: newLives <= 0,
          isPlaying: newLives > 0,
          fallingSymbols: prev.fallingSymbols.filter(s => s.id !== symbol.id),
        };
      }
    });
  }, [playSuccess, playError]);

  const pop = useCallback((symbol: FallingSymbol) => {
    setGameState(prev => {
      const isCorrect = symbol.type === 'close' &&
        prev.stack.length > 0 &&
        prev.stack[prev.stack.length - 1] === symbol.matchedWith;

      if (isCorrect) {
        playSuccess();
        const newStack = [...prev.stack];
        newStack.pop();
        const newCombo = prev.combo + 1;
        const comboBonus = newCombo >= 10 ? Math.floor(newCombo / 10) * 20 : 0;

        return {
          ...prev,
          stack: newStack,
          score: prev.score + 10 + comboBonus,
          combo: newCombo,
          maxCombo: Math.max(prev.maxCombo, newCombo),
          correctMoves: prev.correctMoves + 1,
          totalMoves: prev.totalMoves + 1,
          fallingSymbols: prev.fallingSymbols.filter(s => s.id !== symbol.id),
        };
      } else {
        playError();
        const newLives = prev.lives - 1;

        return {
          ...prev,
          lives: newLives,
          combo: 0,
          totalMoves: prev.totalMoves + 1,
          isGameOver: newLives <= 0,
          isPlaying: newLives > 0,
          fallingSymbols: prev.fallingSymbols.filter(s => s.id !== symbol.id),
        };
      }
    });
  }, [playSuccess, playError]);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      startTime: Date.now(),
    }));
    lastSpawnTimeRef.current = Date.now();
  }, []);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setGameState({
      stack: [],
      fallingSymbols: [],
      score: 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      correctMoves: 0,
      totalMoves: 0,
      isPlaying: false,
      isGameOver: false,
      level: 1,
      startTime: Date.now(),
      nextSymbolId: 0,
    });
    lastSpawnTimeRef.current = 0;
  }, []);

  useEffect(() => {
    if (gameState.isGameOver && gameState.totalMoves > 0) {
      const finalScore = calculateScore(
        gameState.correctMoves,
        gameState.totalMoves,
        gameState.maxCombo,
        gameState.level
      );
      const finalState = { ...gameState, score: finalScore };
      setGameState(prev => ({ ...prev, score: finalScore }));
      saveGameSession(finalState);
      playLevelComplete();
    }
  }, [gameState.isGameOver, gameState.correctMoves, gameState.totalMoves, gameState.maxCombo, gameState.level, calculateScore, saveGameSession, playLevelComplete]);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver) {
      return;
    }

    const animate = () => {
      const now = Date.now();

      // Spawn new symbols
      if (now - lastSpawnTimeRef.current > getSpawnInterval()) {
        const newSymbol = generateSymbol();
        setGameState(prev => ({
          ...prev,
          fallingSymbols: [...prev.fallingSymbols, newSymbol],
          nextSymbolId: prev.nextSymbolId + 1,
        }));
        lastSpawnTimeRef.current = now;
      }

      // Update falling symbols
      setGameState(prev => {
        const updatedSymbols = prev.fallingSymbols
          .map(symbol => ({
            ...symbol,
            y: symbol.y + symbol.speed,
          }))
          .filter(symbol => {
            // Remove symbols that fell too far (miss = lose life)
            if (symbol.y > 100) {
              playError();
              const newLives = prev.lives - 1;
              setGameState(current => ({
                ...current,
                lives: newLives,
                combo: 0,
                isGameOver: newLives <= 0,
                isPlaying: newLives > 0,
              }));
              return false;
            }
            return true;
          });

        // Level up every 20 correct moves
        const newLevel = Math.floor(prev.correctMoves / 20) + 1;

        return {
          ...prev,
          fallingSymbols: updatedSymbols,
          level: newLevel,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isGameOver, generateSymbol, getSpawnInterval, playError]);

  return {
    gameState,
    push,
    pop,
    startGame,
    reset,
    getSymbolColor,
  };
};
