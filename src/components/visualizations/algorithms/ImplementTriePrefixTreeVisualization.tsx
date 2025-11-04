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
  currentPath: string;
  result: boolean | null;
  message: string;
  lineNumber: number;
}

export const ImplementTriePrefixTreeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { operation: "insert", word: "apple", trie: [], currentPath: "", result: null, message: "Insert 'apple' into empty Trie. Create nodes for each character", lineNumber: 3 },
    { operation: "insert", word: "apple", trie: ["a"], currentPath: "a", result: null, message: "Insert 'a': Create new TrieNode. children['a'] = new node", lineNumber: 5 },
    { operation: "insert", word: "apple", trie: ["a","ap","app"], currentPath: "app", result: null, message: "Continue path: a→p→p. Each character gets a node", lineNumber: 5 },
    { operation: "insert", word: "apple", trie: ["a","ap","app","appl","apple"], currentPath: "apple", result: null, message: "Complete 'apple': Mark last node as word end (isEnd=true)", lineNumber: 7 },
    { operation: "search", word: "apple", trie: ["a","ap","app","appl","apple"], currentPath: "apple", result: true, message: "Search 'apple': Found path and isEnd=true. Return true", lineNumber: 12 },
    { operation: "search", word: "app", trie: ["a","ap","app","appl","apple"], currentPath: "app", result: false, message: "Search 'app': Path exists but isEnd=false. Return false", lineNumber: 14 },
    { operation: "startsWith", word: "app", trie: ["a","ap","app","appl","apple"], currentPath: "app", result: true, message: "Prefix 'app' exists in Trie. Return true. Time: O(m), Space: O(1)", lineNumber: 20 }
  ];

  const code = `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd: boolean = false;
}

class Trie {
  root = new TrieNode();
  
  insert(word: string): void {
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
    const node = this.traverse(word);
    return node !== null && node.isEnd;
  }
  
  startsWith(prefix: string): boolean {
    return this.traverse(prefix) !== null;
  }
  
  private traverse(word: string): TrieNode | null {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return null;
      node = node.children.get(char)!;
    }
    return node;
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
          <h3 className="text-lg font-semibold mb-4">Implement Trie (Prefix Tree)</h3>
          <div className="space-y-4">
            <div className="p-3 bg-primary/10 rounded">
              <div className="text-sm"><strong>Operation:</strong> {currentStep.operation}("{currentStep.word}")</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Trie Structure:</div>
              <div className="p-4 bg-muted/30 rounded">
                <div className="font-mono text-sm">
                  <div className="mb-2 text-primary font-bold">root</div>
                  {currentStep.trie.map((path, idx) => (
                    <div key={idx} className={`ml-${(idx + 1) * 2} mb-1 ${
                      currentStep.currentPath === path ? 'text-primary font-bold' : ''
                    }`}>
                      └─ {path.charAt(path.length - 1)} {path === "apple" ? "(isEnd ✓)" : ""}
                    </div>
                  ))}
                  {currentStep.trie.length === 0 && <div className="text-muted-foreground text-xs">Empty</div>}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Current Path:</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.currentPath.split('').map((char, idx) => (
                  <div key={idx} className="px-3 py-2 rounded font-mono bg-primary/20 text-primary font-bold">
                    {char}
                  </div>
                ))}
                {!currentStep.currentPath && <span className="text-muted-foreground text-sm">—</span>}
              </div>
            </div>
            {currentStep.result !== null && (
              <div className={`p-4 rounded text-center ${
                currentStep.result ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <div className={`text-lg font-bold ${
                  currentStep.result ? 'text-green-600' : 'text-red-600'
                }`}>
                  Result: {currentStep.result ? 'true ✓' : 'false ✗'}
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
