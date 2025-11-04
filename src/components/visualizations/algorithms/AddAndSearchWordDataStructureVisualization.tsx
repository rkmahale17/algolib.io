import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  operation: string;
  word: string;
  trie: string[];
  searching: string;
  result: boolean | null;
  message: string;
  lineNumber: number;
}

export const AddAndSearchWordDataStructureVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { operation: "addWord", word: "bad", trie: [], searching: "", result: null, message: "Add 'bad' to Trie. Insert each character as nodes", lineNumber: 8 },
    { operation: "addWord", word: "bad", trie: ["b","ba","bad"], searching: "", result: null, message: "Complete 'bad': b→a→d, mark end. Trie: ['bad']", lineNumber: 13 },
    { operation: "addWord", word: "dad", trie: ["b","ba","bad","d","da","dad"], searching: "", result: null, message: "Add 'dad': d→a→d. Trie: ['bad', 'dad']", lineNumber: 13 },
    { operation: "addWord", word: "mad", trie: ["b","ba","bad","d","da","dad","m","ma","mad"], searching: "", result: null, message: "Add 'mad': m→a→d. Trie: ['bad', 'dad', 'mad']", lineNumber: 13 },
    { operation: "search", word: ".ad", trie: ["b","ba","bad","d","da","dad","m","ma","mad"], searching: "bad", result: true, message: "Search '.ad': '.' matches any char. Try b/d/m + 'ad'. Found 'bad'! ✓", lineNumber: 20 },
    { operation: "search", word: "b..", trie: ["b","ba","bad","d","da","dad","m","ma","mad"], searching: "bad", result: true, message: "Search 'b..': 'b' + any 2 chars. Matches 'bad'! ✓", lineNumber: 20 },
    { operation: "search", word: "..d", trie: ["b","ba","bad","d","da","dad","m","ma","mad"], searching: "bad", result: true, message: "Search '..d': any 2 + 'd'. Matches 'bad', 'dad', 'mad'! ✓ Time: O(m), Space: O(n)", lineNumber: 20 }
  ];

  const code = `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd: boolean = false;
}

class WordDictionary {
  root = new TrieNode();
  
  addWord(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEnd = true;
  }
  
  search(word: string): boolean {
    return this.dfs(word, 0, this.root);
  }
  
  private dfs(word: string, index: number, node: TrieNode): boolean {
    if (index === word.length) return node.isEnd;
    
    const char = word[index];
    if (char === '.') {
      for (const child of node.children.values()) {
        if (this.dfs(word, index + 1, child)) return true;
      }
      return false;
    }
    
    if (!node.children.has(char)) return false;
    return this.dfs(word, index + 1, node.children.get(char)!);
  }
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
          <h3 className="text-lg font-semibold mb-4">Add and Search Word</h3>
          <div className="space-y-4">
            <div className="p-3 bg-primary/10 rounded">
              <div className="text-sm"><strong>Operation:</strong> {currentStep.operation}("{currentStep.word}")</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Words in Trie:</div>
              <div className="flex gap-2 flex-wrap">
                {["bad", "dad", "mad"].filter((_, idx) => idx < currentStep.trie.filter(t => t.length === 3).length / 3).map((word, idx) => (
                  <div key={idx} className={`px-3 py-2 rounded font-mono ${
                    currentStep.searching === word ? 'bg-green-500/30 text-green-700 font-bold ring-2 ring-green-500' : 'bg-secondary'
                  }`}>
                    {word}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Search Pattern:</div>
              <div className="flex gap-1">
                {currentStep.word.split('').map((char, idx) => (
                  <div key={idx} className={`px-4 py-3 rounded font-mono text-xl font-bold ${
                    char === '.' ? 'bg-yellow-500/20 text-yellow-700' : 'bg-primary/20 text-primary'
                  }`}>
                    {char}
                  </div>
                ))}
              </div>
              {currentStep.word.includes('.') && (
                <div className="text-xs text-muted-foreground mt-2">
                  '.' = wildcard (matches any character)
                </div>
              )}
            </div>
            {currentStep.result !== null && (
              <div className={`p-4 rounded text-center ${
                currentStep.result ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <div className={`text-lg font-bold ${
                  currentStep.result ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentStep.result ? 'Found ✓' : 'Not Found ✗'}
                </div>
              </div>
            )}
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
