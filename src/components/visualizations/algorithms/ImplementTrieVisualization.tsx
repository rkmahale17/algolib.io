import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  operation: string;
  word: string;
  currentIdx: number;
  trie: Record<string, any>;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const ImplementTrieVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    {
      operation: 'init',
      word: '',
      currentIdx: -1,
      trie: {},
      variables: {},
      message: "Initialize empty Trie (prefix tree)",
      lineNumber: 1
    },
    {
      operation: 'insert',
      word: 'app',
      currentIdx: 0,
      trie: { a: { children: {} } },
      variables: { word: 'app', char: 'a' },
      message: "Insert 'app': Add 'a'",
      lineNumber: 8
    },
    {
      operation: 'insert',
      word: 'app',
      currentIdx: 2,
      trie: { a: { children: { p: { children: { p: { children: {}, isEnd: true } } } } } },
      variables: { word: 'app', complete: true },
      message: "Complete 'app'. Mark end",
      lineNumber: 11
    },
    {
      operation: 'search',
      word: 'app',
      currentIdx: 2,
      trie: { a: { children: { p: { children: { p: { children: {}, isEnd: true } } } } } },
      variables: { word: 'app', found: true },
      message: "Search 'app': Found! Time: O(m), Space: O(n*m)",
      lineNumber: 23
    }
  ];

  const code = `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
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
    node.isEndOfWord = true;
  }
  
  search(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return node.isEndOfWord;
  }
}`;

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(prev => prev + 1);
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };

  const handleReset = () => setCurrentStepIndex(0);
  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleReset} disabled={currentStepIndex === 0}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleStepBack} disabled={currentStepIndex === 0}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleStepForward} disabled={currentStepIndex === steps.length - 1}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm font-medium">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Implement Trie</h3>
          <div className="space-y-4">
            <div className="p-4 bg-primary/20 rounded">
              <div className="font-semibold">{currentStep.operation.toUpperCase()}: "{currentStep.word}"</div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript Code</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers>
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
