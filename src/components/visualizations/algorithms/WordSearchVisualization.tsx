import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { Search } from 'lucide-react';

interface Step {
  board: string[][];
  word: string;
  r: number;
  c: number;
  i: number;
  path: Set<string>;
  found: boolean;
  message: string;
  lineNumber: number;
  phase: 'init' | 'loop' | 'dfs' | 'backtrack' | 'result';
}

export const WordSearchVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function exist(board: string[][], word: string): boolean {
    const ROWS = board.length;
    const COLS = board[0].length;
    const path = new Set<string>();

    function dfs(r: number, c: number, i: number): boolean {
        if (i === word.length) {
            return true;
        }

        if (
            r < 0 ||
            c < 0 ||
            r >= ROWS ||
            c >= COLS ||
            board[r][c] !== word[i] ||
            path.has(\`\${r},\${c}\`)
        ) {
            return false;
        }

        path.add(\`\${r},\${c}\`);

        const res = 
            dfs(r + 1, c, i + 1) ||
            dfs(r - 1, c, i + 1) ||
            dfs(r, c + 1, i + 1) ||
            dfs(r, c - 1, i + 1);

        path.delete(\`\${r},\${c}\`);

        return res;
    }

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (dfs(r, c, 0)) {
                return true;
            }
        }
    }

    return false;
}`;

  const generateSteps = () => {
    const board = [
      ['A', 'B', 'C', 'E'],
      ['S', 'F', 'C', 'S'],
      ['A', 'D', 'E', 'E']
    ];
    const word = 'ABCCED';
    const ROWS = board.length;
    const COLS = board[0].length;
    const path = new Set<string>();
    const newSteps: Step[] = [];

    newSteps.push({
      board, word, r: -1, c: -1, i: 0, path: new Set(), found: false,
      message: "Initialize ROWS, COLS and empty path Set.",
      lineNumber: 1, phase: 'init'
    });

    function dfs(r: number, c: number, i: number): boolean {
      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `dfs(r=${r}, c=${c}, i=${i}) called. ${i < word.length ? `Checking word[${i}] = '${word[i]}'` : 'All characters found!'}`,
        lineNumber: 6, phase: 'dfs'
      });

      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `Check base case: All characters found? (i === word.length)`,
        lineNumber: 7, phase: 'dfs'
      });

      if (i === word.length) {
        newSteps.push({
          board, word, r, c, i, path: new Set(path), found: true,
          message: "Full word found!",
          lineNumber: 8, phase: 'result'
        });
        return true;
      }

      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: "Verify bounds, character match, and cycle check.",
        lineNumber: 11, phase: 'dfs'
      });

      if (
        r < 0 || c < 0 || r >= ROWS || c >= COLS ||
        board[r][c] !== word[i] || path.has(`${r},${c}`)
      ) {
        let reason = "";
        if (r < 0 || c < 0 || r >= ROWS || c >= COLS) reason = "Out of bounds.";
        else if (board[r][c] !== word[i]) reason = `Character '${board[r][c]}' does not match '${word[i]}'.`;
        else if (path.has(`${r},${c}`)) reason = "Cell already in current path.";

        newSteps.push({
          board, word, r, c, i, path: new Set(path), found: false,
          message: `Check failed: ${reason}`,
          lineNumber: 19, phase: 'backtrack'
        });
        return false;
      }

      path.add(`${r},${c}`);
      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `Match! Added [${r}, ${c}] to path. Current path: ${Array.from(path).join(' -> ')}`,
        lineNumber: 22, phase: 'dfs'
      });

      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: "Explore neighbors: Down, Up, Right, Left",
        lineNumber: 24, phase: 'dfs'
      });

      const res =
        dfs(r + 1, c, i + 1) ||
        dfs(r - 1, c, i + 1) ||
        dfs(r, c + 1, i + 1) ||
        dfs(r, c - 1, i + 1);

      if (res) return true;

      path.delete(`${r},${c}`);
      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `No path found from [${r}, ${c}]. Removing from path (backtrack).`,
        lineNumber: 30, phase: 'backtrack'
      });

      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: "Return result from this DFS branch.",
        lineNumber: 32, phase: 'backtrack'
      });

      return res;
    }

    // To keep visualization short, we might skip some unsuccessful start points
    // But for full accuracy, we'll try to follow the loop.
    let found = false;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (found) break;
        newSteps.push({
          board, word, r, c, i: 0, path: new Set(), found: false,
          message: `Trying starting cell [${r}, ${c}]`,
          lineNumber: 35, phase: 'loop'
        });
        if (dfs(r, c, 0)) {
          found = true;
          break;
        }
      }
    }

    if (!found) {
      newSteps.push({
        board, word, r: -1, c: -1, i: 0, path: new Set(), found: false,
        message: "Word not found in the board.",
        lineNumber: 43, phase: 'result'
      });
    }

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const currentStep = steps[currentStepIndex] || steps[0];
  if (!currentStep) return null;

  const isCellInPath = (r: number, c: number) => currentStep.path.has(`${r},${c}`);

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={() => currentStepIndex < steps.length - 1 && setCurrentStepIndex(currentStepIndex + 1)}
        onStepBack={() => currentStepIndex > 0 && setCurrentStepIndex(currentStepIndex - 1)}
        onReset={() => { setCurrentStepIndex(0); setIsPlaying(false); }}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-3 sm:p-6 border-2">
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">Word Search Board</h3>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="p-2 sm:p-4 bg-primary/20 rounded-xl border border-border shadow-inner overflow-x-auto max-w-full">
                {currentStep.board.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-2 mb-2 last:mb-0">
                    {row.map((char, cIdx) => (
                      <motion.div
                        key={`${rIdx}-${cIdx}`}
                        animate={{
                          scale: (currentStep.r === rIdx && currentStep.c === cIdx) ? 1.15 : 1,
                          backgroundColor: isCellInPath(rIdx, cIdx)
                            ? "green"
                            : (currentStep.r === rIdx && currentStep.c === cIdx)
                              ? "var(--accent)"
                              : "var(--card)",
                          borderColor: isCellInPath(rIdx, cIdx) ? "var(--primary)" : "var(--border)"
                        }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg border-2 font-bold text-base sm:text-lg md:text-xl transition-all shadow-md
                          ${isCellInPath(rIdx, cIdx) ? 'text-primary-foreground' : 'text-foreground'}
                          ${(currentStep.r === rIdx && currentStep.c === cIdx) ? 'border-primary ring-4 ring-primary/30 z-10' : ''}
                        `}
                      >
                        {char}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-2 ">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Target Word</span>
                <div className="flex gap-1">
                  {currentStep.word.split('').map((char, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        opacity: 1,
                        scale: idx === currentStep.i ? 1.2 : 1,
                        y: idx === currentStep.i ? -4 : 0,
                        backgroundColor: idx < currentStep.i ? "var(--primary)" :
                          idx === currentStep.i ? "var(--accent)" : "var(--muted)",
                        color: idx < currentStep.i ? "var(--primary-foreground)" :
                          idx === currentStep.i ? "var(--accent-foreground)" : "var(--muted-foreground)"
                      }}
                      className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md border-2 font-bold text-sm sm:text-base md:text-lg shadow-sm
                        ${idx === currentStep.i ? 'border-accent' : idx < currentStep.i ? 'border-primary' : 'border-border'}
                      `}
                    >
                      {char}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium leading-relaxed">{currentStep.message}</p>
              </div>

              <VariablePanel
                variables={{
                  'r': currentStep.r,
                  'c': currentStep.c,
                  'i (index)': currentStep.i,
                  'char': currentStep.board[currentStep.r]?.[currentStep.c] || 'N/A',
                  'target': currentStep.word[currentStep.i] || 'DONE',
                  'path size': currentStep.path.size,
                  'found': currentStep.found.toString()
                }}
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4 overflow-hidden">
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