import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  board: string[][];
  words: string[];
  found: string[];
  currentPos: [number, number] | null;
  currentWord: string;
  message: string;
  lineNumber: number;
}

export const WordSearchIIVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { board: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words: ["oath","pea","eat","rain"], found: [], currentPos: null, currentWord: "", message: "Find all words from list in board. Use Trie + DFS backtracking", lineNumber: 1 },
    { board: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words: ["oath","pea","eat","rain"], found: [], currentPos: [0,0], currentWord: "o", message: "Start DFS from (0,0): 'o'. Check Trie for prefix 'o'", lineNumber: 15 },
    { board: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words: ["oath","pea","eat","rain"], found: [], currentPos: [1,0], currentWord: "oe", message: "Continue: 'o'→'e'. Prefix 'oe' exists, keep searching", lineNumber: 18 },
    { board: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words: ["oath","pea","eat","rain"], found: [], currentPos: [1,1], currentWord: "oat", message: "Path: o→e→t = 'oat'. Check for 'oath'...", lineNumber: 18 },
    { board: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words: ["oath","pea","eat","rain"], found: ["oath"], currentPos: [2,1], currentWord: "oath", message: "Found 'oath'! o→a→t→h at (0,0)→(1,0)→(1,1)→(2,1) ✓", lineNumber: 21 },
    { board: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words: ["oath","pea","eat","rain"], found: ["oath","eat"], currentPos: [1,2], currentWord: "eat", message: "Found 'eat'! e→a→t at (1,0)→(1,1)→(1,2) ✓", lineNumber: 21 },
    { board: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words: ["oath","pea","eat","rain"], found: ["oath","eat"], currentPos: null, currentWord: "", message: "Complete! Found 2 words. Trie pruning optimizes search. Time: O(m*n*4^L)", lineNumber: 25 }
  ];

  const code = `function findWords(board: string[][], words: string[]): string[] {
  const trie = buildTrie(words);
  const result: string[] = [];
  const rows = board.length, cols = board[0].length;
  
  function dfs(r: number, c: number, node: TrieNode, path: string) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    
    const char = board[r][c];
    if (char === '#' || !node.children.has(char)) return;
    
    const next = node.children.get(char)!;
    const newPath = path + char;
    
    if (next.isEnd) {
      result.push(newPath);
      next.isEnd = false; // avoid duplicates
    }
    
    board[r][c] = '#'; // mark visited
    dfs(r+1, c, next, newPath);
    dfs(r-1, c, next, newPath);
    dfs(r, c+1, next, newPath);
    dfs(r, c-1, next, newPath);
    board[r][c] = char; // backtrack
  }
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, trie, '');
    }
  }
  
  return result;
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(0)} disabled={currentStepIndex === 0}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0}><SkipBack className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1}><SkipForward className="h-4 w-4" /></Button>
          </div>
          <div className="text-sm">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Word Search II</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Board:</div>
              <div className="inline-flex flex-col gap-1">
                {currentStep.board.map((row, r) => (
                  <div key={r} className="flex gap-1">
                    {row.map((cell, c) => (
                      <div key={c} className={`w-10 h-10 rounded flex items-center justify-center font-mono font-bold ${
                        currentStep.currentPos && currentStep.currentPos[0] === r && currentStep.currentPos[1] === c
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary'
                          : 'bg-secondary'
                      }`}>
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Words to Find:</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.words.map((word, idx) => (
                  <div key={idx} className={`px-3 py-2 rounded font-mono ${
                    currentStep.found.includes(word)
                      ? 'bg-green-500/30 text-green-700 line-through'
                      : 'bg-muted'
                  }`}>
                    {word}
                  </div>
                ))}
              </div>
            </div>
            {currentStep.currentWord && (
              <div className="p-3 bg-blue-500/10 rounded">
                <div className="text-sm"><strong>Current Path:</strong> "{currentStep.currentWord}"</div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium mb-2">Found Words:</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.found.map((word, idx) => (
                  <div key={idx} className="px-3 py-2 rounded font-mono bg-green-500/30 text-green-700 font-bold">
                    {word} ✓
                  </div>
                ))}
                {currentStep.found.length === 0 && <span className="text-muted-foreground text-sm">—</span>}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers lineProps={(lineNumber) => ({ style: { backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent', display: 'block' } })}>
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
