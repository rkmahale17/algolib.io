import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
      message: "Initialize dimensions and the path tracker for word search.",
      lineNumber: 1
    });

    function dfs(r: number, c: number, i: number): boolean {
      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `Visiting [${r}, ${c}]. Checking if board character matches target word index ${i}.`,
        lineNumber: 6
      });

      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `Base case check: If index ${i} equals word length, we've found the entire word.`,
        lineNumber: 7
      });

      if (i === word.length) {
        newSteps.push({
          board, word, r, c, i, path: new Set(path), found: true,
          message: "Success! Every character in the word has been found in sequence.",
          lineNumber: 8
        });
        return true;
      }

      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: "Verifying current cell: checking boundaries, matching character, and avoiding revisited cells.",
        lineNumber: 11
      });

      if (
        r < 0 || c < 0 || r >= ROWS || c >= COLS ||
        board[r][c] !== word[i] || path.has(`${r},${c}`)
      ) {
        let reason = "";
        if (r < 0 || c < 0 || r >= ROWS || c >= COLS) reason = "out of bounds";
        else if (board[r][c] !== word[i]) reason = `character '${board[r][c]}' does not match '${word[i]}'`;
        else if (path.has(`${r},${c}`)) reason = "cell already used in current path";

        newSteps.push({
          board, word, r, c, i, path: new Set(path), found: false,
          message: `Backtrack: current path is invalid because ${reason}.`,
          lineNumber: 19
        });
        return false;
      }

      path.add(`${r},${c}`);
      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `Character match found! Adding [${r}, ${c}] to the visited path and exploring neighbors.`,
        lineNumber: 22
      });

      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: "Initiating recursive search in all 4 adjacent directions (Down, Up, Right, Left).",
        lineNumber: 24
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
        message: `Cleaning up: All neighbors failed from [${r}, ${c}]. Removing cell from path (backtracking).`,
        lineNumber: 30
      });

      newSteps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: "Returning from this recursive call to try other options.",
        lineNumber: 32
      });

      return res;
    }

    let found = false;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (found) break;
        newSteps.push({
          board, word, r, c, i: 0, path: new Set(), found: false,
          message: `Starting a new DFS traversal from starting board cell [${r}, ${c}].`,
          lineNumber: 37
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
        message: "Traversal complete. The word was not found anywhere on the board.",
        lineNumber: 43
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
    <div className="flex flex-col gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-2">
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">Word Search Visualizer</h3>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 bg-primary/5 rounded-2xl border-2 border-primary/20 shadow-lg w-full max-w-md mx-auto">
                <div 
                  className="grid gap-2"
                  style={{ 
                    gridTemplateColumns: `repeat(${currentStep.board[0].length}, minmax(0, 1fr))` 
                  }}
                >
                  {currentStep.board.map((row, rIdx) => (
                    row.map((char, cIdx) => {
                      const isInPath = isCellInPath(rIdx, cIdx);
                      const isCurrent = currentStep.r === rIdx && currentStep.c === cIdx;
                      
                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`aspect-square flex items-center justify-center rounded-xl border-2 font-bold text-lg transition-colors duration-200
                            ${isInPath ? 'bg-green-500/20 border-green-500/50 text-black dark:text-gray-100' : 
                              isCurrent ? 'bg-primary/20 border-primary text-black dark:text-gray-100' : 
                              'bg-card border-border text-black dark:text-gray-100'}
                            ${isCurrent ? 'ring-4 ring-primary/20 z-10 scale-105' : ''}
                          `}
                        >
                          {char}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 w-full">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Target String</span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {currentStep.word.split('').map((char, idx) => {
                    const isFound = idx < currentStep.i;
                    const isCurrent = idx === currentStep.i;
                    
                    return (
                      <div
                        key={idx}
                        className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border-2 font-bold text-sm sm:text-base transition-all duration-200
                          ${isFound ? 'bg-primary border-primary text-primary-foreground' : 
                            isCurrent ? 'bg-accent border-accent text-accent-foreground scale-110 shadow-md' : 
                            'bg-muted border-border text-muted-foreground'}
                        `}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 min-h-[80px] flex items-center">
                <p className="text-sm font-medium leading-relaxed text-foreground/90">
                  {currentStep.message}
                </p>
              </div>

              <VariablePanel
                variables={{
                  'row': currentStep.r !== -1 ? currentStep.r : 'none',
                  'col': currentStep.c !== -1 ? currentStep.c : 'none',
                  'index': currentStep.i,
                  'char': currentStep.board[currentStep.r]?.[currentStep.c] || 'N/A',
                  'target': currentStep.word[currentStep.i] || 'DONE',
                  'path length': currentStep.path.size
                }}
              />
            </div>
          </div>
        </Card>

        <Card className="border-2 overflow-hidden bg-card">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[currentStep.lineNumber]}
            language="typescript"
          />
        </Card>
      </div>
    </div>
  );
};