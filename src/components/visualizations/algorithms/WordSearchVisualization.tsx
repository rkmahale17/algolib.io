import React, { useState, useEffect, useRef } from "react";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";
import { Search } from "lucide-react";

interface Step {
  board: string[][];
  word: string;
  r: number;
  c: number;
  i: number;
  path: Set<string>;
  found: boolean;
  message: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function exist(board: string[][], word: string): boolean {
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
}`,
  python: `def exist(board: list[list[str]], word: str) -> bool:
    ROWS, COLS = len(board), len(board[0])
    path = set()
    def dfs(r, c, i):
        if i == len(word):
            return True
        if (r < 0 or c < 0 or r >= ROWS or c >= COLS or
            board[r][c] != word[i] or (r, c) in path):
            return False
        path.add((r, c))
        res = (dfs(r + 1, c, i + 1) or
               dfs(r - 1, c, i + 1) or
               dfs(r, c + 1, i + 1) or
               dfs(r, c - 1, i + 1))
        path.remove((r, c))
        return res
    for r in range(ROWS):
        for c in range(COLS):
            if dfs(r, c, 0):
                return True
    return False`,
  java: `public static class Solution {
    public boolean exist(char[][] board, String word) {
        int ROWS = board.length;
        int COLS = board[0].length;
        boolean[][] path = new boolean[ROWS][COLS];
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                if (dfs(board, r, c, word, 0, path)) {
                    return true;
                }
            }
        }
        return false;
    }
    private boolean dfs(char[][] board, int r, int c, String word, int i, boolean[][] path) {
        if (i == word.length()) {
            return true;
        }
        if (
            r < 0 ||
            c < 0 ||
            r >= board.length ||
            c >= board[0].length ||
            board[r][c] != word.charAt(i) ||
            path[r][c]
        ) {
            return false;
        }
        path[r][c] = true;
        boolean res =
            dfs(board, r + 1, c, word, i + 1, path) ||
            dfs(board, r - 1, c, word, i + 1, path) ||
            dfs(board, r, c + 1, word, i + 1, path) ||
            dfs(board, r, c - 1, word, i + 1, path);
        path[r][c] = false;
        return res;
    }
}`,
  cpp: `class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        int ROWS = board.size();
        int COLS = board[0].size();
        vector<vector<bool>> path(ROWS, vector<bool>(COLS, false));
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                if (dfs(board, r, c, word, 0, path)) {
                    return true;
                }
            }
        }
        return false;
    }
private:
    bool dfs(vector<vector<char>>& board, int r, int c, string& word, int i, vector<vector<bool>>& path) {
        if (i == word.length()) {
            return true;
        }
        if (
            r < 0 ||
            c < 0 ||
            r >= board.size() ||
            c >= board[0].size() ||
            board[r][c] != word[i] ||
            path[r][c]
        ) {
            return false;
        }
        path[r][c] = true;
        bool res =
            dfs(board, r + 1, c, word, i + 1, path) ||
            dfs(board, r - 1, c, word, i + 1, path) ||
            dfs(board, r, c + 1, word, i + 1, path) ||
            dfs(board, r, c - 1, word, i + 1, path);
        path[r][c] = false;
        return res;
    }
};`
};

export const WordSearchVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateStepsData = () => {
    const board = [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"]
    ];
    const word = "ABCCED";
    const ROWS = board.length;
    const COLS = board[0].length;
    const path = new Set<string>();
    const steps: Step[] = [];
    const stepLineNumbers: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLineNumbers.typescript!.push(ts);
      stepLineNumbers.python!.push(py);
      stepLineNumbers.java!.push(java);
      stepLineNumbers.cpp!.push(cpp);
    };

    steps.push({
      board, word, r: -1, c: -1, i: 0, path: new Set(), found: false,
      message: "Initialize dimensions and the path tracker for word search.",
      pseudoStep: "SET ROWS = board.length, COLS = board[0].length, path = {}"
    });
    addLines(2, 2, 3, 4);

    function dfs(r: number, c: number, i: number): boolean {
      steps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `dfs(r = ${r}, c = ${c}, i = ${i}) called`,
        pseudoStep: `CALL dfs(r = ${r}, c = ${c}, i = ${i})`
      });
      addLines(5, 4, 15, 17);

      steps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `Check base case: i === word.length (${i} === ${word.length})`,
        pseudoStep: `IF i == word.length  →  ${i} == ${word.length} ?`
      });
      addLines(6, 5, 16, 18);

      if (i === word.length) {
        steps.push({
          board, word, r, c, i, path: new Set(path), found: true,
          message: "Success! Every character in the word has been found in sequence.",
          pseudoStep: "RETURN True"
        });
        addLines(7, 6, 17, 19);
        return true;
      }

      steps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `Validate cell [${r}, ${c}]`,
        pseudoStep: `IF outOfBounds OR charMismatch OR alreadyVisited`
      });
      addLines(9, 7, 19, 21);

      if (
        r < 0 || c < 0 || r >= ROWS || c >= COLS ||
        board[r][c] !== word[i] || path.has(`${r},${c}`)
      ) {
        let reason = "";
        if (r < 0 || c < 0 || r >= ROWS || c >= COLS) reason = "out of bounds";
        else if (board[r][c] !== word[i]) reason = `char '${board[r][c]}' != '${word[i]}'`;
        else if (path.has(`${r},${c}`)) reason = "already in path";

        steps.push({
          board, word, r, c, i, path: new Set(path), found: false,
          message: `Backtrack: Cell [${r}, ${c}] invalid because: ${reason}.`,
          pseudoStep: "RETURN False"
        });
        addLines(17, 9, 27, 29);
        return false;
      }

      path.add(`${r},${c}`);
      steps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `Character match found! Adding [${r}, ${c}] to the visited path.`,
        pseudoStep: `SET path = path ∪ {(${r}, ${c})}`
      });
      addLines(19, 10, 29, 31);

      steps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: "Recursive search in Down, Up, Right, Left directions.",
        pseudoStep: `SET res = dfs(r+1,c) OR dfs(r-1,c) OR dfs(r,c+1) OR dfs(r,c-1)`
      });
      addLines(20, 11, 30, 32);

      const res =
        dfs(r + 1, c, i + 1) ||
        dfs(r - 1, c, i + 1) ||
        dfs(r, c + 1, i + 1) ||
        dfs(r, c - 1, i + 1);

      if (res) return true;

      path.delete(`${r},${c}`);
      steps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: `All neighbors failed from [${r}, ${c}]. Removing cell from path (backtracking).`,
        pseudoStep: `SET path = path - {(${r}, ${c})}`
      });
      addLines(25, 15, 35, 37);

      steps.push({
        board, word, r, c, i, path: new Set(path), found: false,
        message: "Returning from this call.",
        pseudoStep: "RETURN False"
      });
      addLines(26, 16, 36, 38);

      return res;
    }

    let found = false;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (found) break;
        steps.push({
          board, word, r, c, i: 0, path: new Set(), found: false,
          message: `Starting a new DFS traversal from cell [${r}, ${c}].`,
          pseudoStep: `FOR [r, c] = [${r}, ${c}]  →  CALL dfs(${r}, ${c}, 0)`
        });
        addLines(30, 19, 8, 9);
        if (dfs(r, c, 0)) {
          found = true;
          break;
        }
      }
    }

    if (!found) {
      steps.push({
        board, word, r: -1, c: -1, i: 0, path: new Set(), found: false,
        message: "Traversal complete. The word was not found.",
        pseudoStep: "RETURN False"
      });
      addLines(35, 21, 13, 14);
    }

    const lastStep = steps[steps.length - 1];
    steps.push({
      ...lastStep,
      message: found ? "Word found!" : "Word not found.",
      pseudoStep: "DONE"
    });
    addLines(found ? 31 : 35, found ? 20 : 21, found ? 9 : 13, found ? 10 : 14);

    return { steps, stepLineNumbers };
  };

  const { steps, stepLineNumbers } = generateStepsData();

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);
  const isCellInPath = (r: number, c: number) => currentStep.path.has(`${r},${c}`);

  return (
    <div className="flex flex-col gap-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Word Search Grid</h3>
            </div>

            <div className="flex flex-col gap-6">
              <div className="p-4 bg-primary/5 rounded-2xl border border-border w-full max-w-xs mx-auto">
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
                          className={`aspect-square flex items-center justify-center rounded-xl border-2 font-bold text-lg transition-all duration-200
                            ${isInPath ? 'bg-green-500/20 border-green-500/50 text-foreground' : 
                              isCurrent ? 'bg-primary/20 border-primary text-foreground' : 
                              'bg-card border-border text-foreground'}
                            ${isCurrent ? 'ring-4 ring-primary/20 z-10 scale-105 shadow-md' : ''}
                          `}
                        >
                          {char}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target String</span>
                <div className="flex justify-center gap-1.5">
                  {currentStep.word.split('').map((char, idx) => {
                    const isFound = idx < currentStep.i;
                    const isCurrent = idx === currentStep.i;
                    
                    return (
                      <div
                        key={idx}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 font-bold text-sm transition-all duration-200
                          ${isFound ? 'bg-primary border-primary text-primary-foreground' : 
                            isCurrent ? 'bg-accent border-accent text-accent-foreground scale-110 shadow-md animate-pulse' : 
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
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">
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