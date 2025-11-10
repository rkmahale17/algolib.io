import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { Search } from 'lucide-react';

interface Step {
  board: string[][];
  word: string;
  currentRow: number;
  currentCol: number;
  targetChar: string;
  visited: boolean[][];
  path: [number, number][];
  found: boolean;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  phase: string;
}

export const WordSearchVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const board = [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E']
  ];

  const steps: Step[] = [
    {
      board,
      word: 'ABCCED',
      currentRow: -1,
      currentCol: -1,
      targetChar: '',
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      path: [],
      found: false,
      variables: { board: '3x4', word: 'ABCCED', length: 6 },
      explanation: "Search for word 'ABCCED' in the board. Use DFS with backtracking to explore all paths.",
      highlightedLines: [1],
      lineExecution: "function exist(board: string[][], word: string)",
      phase: "init"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: -1,
      currentCol: -1,
      targetChar: '',
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      path: [],
      found: false,
      variables: { m: 3, n: 4 },
      explanation: "Get board dimensions: 3 rows, 4 columns.",
      highlightedLines: [2],
      lineExecution: "const m = board.length, n = board[0].length;",
      phase: "init"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 0,
      currentCol: 0,
      targetChar: 'A',
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      path: [],
      found: false,
      variables: { start: '[0,0]', char: 'A', target: 'A' },
      explanation: "Start DFS from board[0][0] = 'A'. Looking for first character 'A' of word.",
      highlightedLines: [8],
      lineExecution: "for (let i = 0; i < m; i++)",
      phase: "search"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 0,
      currentCol: 0,
      targetChar: 'A',
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      path: [],
      found: false,
      variables: { match: 'A === A', calling: 'dfs(0,0,0)' },
      explanation: "board[0][0] = 'A' matches word[0] = 'A'. Call dfs(0, 0, 0) to continue search.",
      highlightedLines: [10],
      lineExecution: "if (dfs(i, j, 0)) return true;",
      phase: "search"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 0,
      currentCol: 0,
      targetChar: 'A',
      visited: [[true,false,false,false],[false,false,false,false],[false,false,false,false]],
      path: [[0,0]],
      found: false,
      variables: { row: 0, col: 0, idx: 0, visited: '[0,0]' },
      explanation: "Inside dfs(0,0,0). Mark [0,0] as visited. Current path: A",
      highlightedLines: [17],
      lineExecution: "visited[row][col] = true;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 0,
      currentCol: 0,
      targetChar: 'B',
      visited: [[true,false,false,false],[false,false,false,false],[false,false,false,false]],
      path: [[0,0]],
      found: false,
      variables: { nextChar: 'B', idx: 1, exploring: 'neighbors' },
      explanation: "Found 'A'. Now search for next character 'B' from neighbors of [0,0].",
      highlightedLines: [20],
      lineExecution: "for (const [dr, dc] of directions)",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 0,
      currentCol: 1,
      targetChar: 'B',
      visited: [[true,false,false,false],[false,false,false,false],[false,false,false,false]],
      path: [[0,0]],
      found: false,
      variables: { checking: '[0,1]', char: 'B', match: 'B === B' },
      explanation: "Check right neighbor [0,1] = 'B'. It matches word[1] = 'B'!",
      highlightedLines: [21],
      lineExecution: "const newRow = row + dr, newCol = col + dc;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 0,
      currentCol: 1,
      targetChar: 'B',
      visited: [[true,true,false,false],[false,false,false,false],[false,false,false,false]],
      path: [[0,0],[0,1]],
      found: false,
      variables: { visited: '[0,1]', path: 'AB', idx: 1 },
      explanation: "Move to [0,1]. Mark visited. Current path: AB. Continue DFS.",
      highlightedLines: [17],
      lineExecution: "visited[row][col] = true;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 0,
      currentCol: 2,
      targetChar: 'C',
      visited: [[true,true,false,false],[false,false,false,false],[false,false,false,false]],
      path: [[0,0],[0,1]],
      found: false,
      variables: { checking: '[0,2]', char: 'C', target: 'C' },
      explanation: "From [0,1], check right neighbor [0,2] = 'C'. Matches word[2] = 'C'!",
      highlightedLines: [21],
      lineExecution: "const newRow = row + dr, newCol = col + dc;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 0,
      currentCol: 2,
      targetChar: 'C',
      visited: [[true,true,true,false],[false,false,false,false],[false,false,false,false]],
      path: [[0,0],[0,1],[0,2]],
      found: false,
      variables: { visited: '[0,2]', path: 'ABC', idx: 2 },
      explanation: "Move to [0,2]. Mark visited. Current path: ABC.",
      highlightedLines: [17],
      lineExecution: "visited[row][col] = true;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 1,
      currentCol: 2,
      targetChar: 'C',
      visited: [[true,true,true,false],[false,false,false,false],[false,false,false,false]],
      path: [[0,0],[0,1],[0,2]],
      found: false,
      variables: { checking: '[1,2]', char: 'C', target: 'C' },
      explanation: "From [0,2], check down neighbor [1,2] = 'C'. Matches word[3] = 'C'!",
      highlightedLines: [21],
      lineExecution: "const newRow = row + dr, newCol = col + dc;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 1,
      currentCol: 2,
      targetChar: 'C',
      visited: [[true,true,true,false],[false,false,true,false],[false,false,false,false]],
      path: [[0,0],[0,1],[0,2],[1,2]],
      found: false,
      variables: { visited: '[1,2]', path: 'ABCC', idx: 3 },
      explanation: "Move to [1,2]. Mark visited. Current path: ABCC.",
      highlightedLines: [17],
      lineExecution: "visited[row][col] = true;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 2,
      currentCol: 2,
      targetChar: 'E',
      visited: [[true,true,true,false],[false,false,true,false],[false,false,false,false]],
      path: [[0,0],[0,1],[0,2],[1,2]],
      found: false,
      variables: { checking: '[2,2]', char: 'E', target: 'E' },
      explanation: "From [1,2], check down neighbor [2,2] = 'E'. Matches word[4] = 'E'!",
      highlightedLines: [21],
      lineExecution: "const newRow = row + dr, newCol = col + dc;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 2,
      currentCol: 2,
      targetChar: 'E',
      visited: [[true,true,true,false],[false,false,true,false],[false,false,true,false]],
      path: [[0,0],[0,1],[0,2],[1,2],[2,2]],
      found: false,
      variables: { visited: '[2,2]', path: 'ABCCE', idx: 4 },
      explanation: "Move to [2,2]. Mark visited. Current path: ABCCE. One more character!",
      highlightedLines: [17],
      lineExecution: "visited[row][col] = true;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 2,
      currentCol: 1,
      targetChar: 'D',
      visited: [[true,true,true,false],[false,false,true,false],[false,false,true,false]],
      path: [[0,0],[0,1],[0,2],[1,2],[2,2]],
      found: false,
      variables: { checking: '[2,1]', char: 'D', target: 'D' },
      explanation: "From [2,2], check left neighbor [2,1] = 'D'. Matches word[5] = 'D'!",
      highlightedLines: [21],
      lineExecution: "const newRow = row + dr, newCol = col + dc;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 2,
      currentCol: 1,
      targetChar: 'D',
      visited: [[true,true,true,false],[false,false,true,false],[false,true,true,false]],
      path: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,1]],
      found: false,
      variables: { visited: '[2,1]', path: 'ABCCED', idx: 5 },
      explanation: "Move to [2,1]. Mark visited. Current path: ABCCED. Complete word found!",
      highlightedLines: [17],
      lineExecution: "visited[row][col] = true;",
      phase: "dfs"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 2,
      currentCol: 1,
      targetChar: 'D',
      visited: [[true,true,true,false],[false,false,true,false],[false,true,true,false]],
      path: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,1]],
      found: true,
      variables: { idx: 6, wordLen: 6, found: 'true' },
      explanation: "idx = 6 equals word.length. Complete word 'ABCCED' found! Return true.",
      highlightedLines: [15],
      lineExecution: "if (idx === word.length) return true;",
      phase: "found"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: 2,
      currentCol: 1,
      targetChar: 'D',
      visited: [[true,true,true,false],[false,false,true,false],[false,true,true,false]],
      path: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,1]],
      found: true,
      variables: { result: 'true', path: 'A→B→C→C→E→D' },
      explanation: "Word search successful! Path found: [0,0]→[0,1]→[0,2]→[1,2]→[2,2]→[2,1]",
      highlightedLines: [10],
      lineExecution: "return true;",
      phase: "complete"
    },
    {
      board,
      word: 'ABCCED',
      currentRow: -1,
      currentCol: -1,
      targetChar: '',
      visited: [[false,false,false,false],[false,false,false,false],[false,false,false,false]],
      path: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,1]],
      found: true,
      variables: { time: 'O(m×n×4^L)', space: 'O(L)', L: 'word length' },
      explanation: "Algorithm complete! Time: O(m×n×4^L) for DFS from each cell. Space: O(L) for recursion stack.",
      highlightedLines: [1],
      lineExecution: "// Done",
      phase: "complete"
    }
  ];

  const code = `function exist(board: string[][], word: string): boolean {
  const m = board.length, n = board[0].length;
  const visited: boolean[][] = Array(m).fill(0).map(() => Array(n).fill(false));
  
  const dfs = (row: number, col: number, idx: number): boolean => {
    if (idx === word.length) return true;
    if (row < 0 || row >= m || col < 0 || col >= n || 
        visited[row][col] || board[row][col] !== word[idx]) return false;
    
    visited[row][col] = true;
    const directions = [[-1,0],[1,0],[0,-1],[0,1]];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr, newCol = col + dc;
      if (dfs(newRow, newCol, idx + 1)) {
        return true;
      }
    }
    
    visited[row][col] = false;
    return false;
  };
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }
  
  return false;
}`;

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  const getCellColor = (row: number, col: number) => {
    if (!currentStep?.board || !currentStep?.visited?.[row]) return 'bg-muted text-muted-foreground border-border';
    
    const isInPath = currentStep.path.some(([r, c]) => r === row && c === col);
    const isCurrent = row === currentStep.currentRow && col === currentStep.currentCol;
    const isVisited = currentStep.visited[row][col];
    
    if (isCurrent) {
      return 'bg-primary text-primary-foreground border-primary shadow-lg scale-110';
    }
    if (isInPath) {
      return 'bg-secondary text-secondary-foreground border-secondary';
    }
    if (isVisited) {
      return 'bg-muted/70 text-muted-foreground border-muted-foreground/30';
    }
    return 'bg-card text-foreground border-border';
  };

  if (!currentStep?.board) {
    return <div className="p-4 text-center">Loading visualization...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Word Search DFS
          </h3>
          <div className="space-y-4">
            <motion.div 
              key={`board-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="text-sm font-medium text-muted-foreground">
                Phase: <span className="text-primary font-mono">{currentStep.phase}</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Target Word: <span className="text-primary font-mono text-lg">{currentStep.word}</span>
              </div>
              <div className="inline-block bg-card p-4 rounded-lg border">
                {currentStep.board.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1">
                    {row.map((cell, colIdx) => (
                      <motion.div
                        key={`${rowIdx}-${colIdx}`}
                        initial={{ scale: 0.8 }}
                        animate={{ 
                          scale: (rowIdx === currentStep.currentRow && colIdx === currentStep.currentCol) ? 1.15 : 1 
                        }}
                        className={`w-14 h-14 flex items-center justify-center font-mono font-bold text-lg rounded border-2 transition-all ${getCellColor(rowIdx, colIdx)}`}
                      >
                        {cell}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>

            {currentStep.path.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-secondary/10 rounded border-2 border-secondary/30"
              >
                <div className="text-sm font-medium text-secondary-foreground">
                  Current Path: <span className="font-mono text-primary">
                    {currentStep.path.map(([r, c]) => currentStep.board[r][c]).join(' → ')}
                  </span>
                </div>
              </motion.div>
            )}

            <motion.div
              key={`execution-${currentStepIndex}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-secondary/30 rounded border-l-4 border-secondary"
            >
              <div className="text-xs font-semibold text-secondary-foreground mb-1">Executing:</div>
              <code className="text-xs text-foreground font-mono">{currentStep.lineExecution}</code>
            </motion.div>

            <motion.div
              key={`explanation-${currentStepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-muted/50 rounded text-sm leading-relaxed"
            >
              {currentStep.explanation}
            </motion.div>

            <motion.div
              key={`variables-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VariablePanel variables={currentStep.variables} />
            </motion.div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Implementation</h3>
          <div className="flex-1 overflow-auto">
            <AnimatedCodeEditor 
              code={code} 
              language="typescript" 
              highlightedLines={(currentStep.highlightedLines || []).filter((n) => n >= 1 && n <= code.split('\n').length)}
            />
          </div>
        </Card>
      </div>

      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />
    </div>
  );
};