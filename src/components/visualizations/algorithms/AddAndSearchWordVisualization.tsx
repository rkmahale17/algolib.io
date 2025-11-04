import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const AddAndSearchWordVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { operation: 'add', word: 'bad', message: "Add 'bad' to dictionary", lineNumber: 8 },
    { operation: 'search', word: 'bad', result: true, message: "Search 'bad': Found!", lineNumber: 18 },
    { operation: 'search', word: '.ad', result: true, message: "Search '.ad': '.' matches any char. Found!", lineNumber: 18 },
  ];

  const code = `class WordDictionary {
  root = new TrieNode();
  
  addWord(word: string): void {
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
    const dfs = (index: number, node: TrieNode): boolean => {
      if (index === word.length) return node.isEndOfWord;
      
      const char = word[index];
      if (char === '.') {
        for (const child of node.children.values()) {
          if (dfs(index + 1, child)) return true;
        }
        return false;
      }
      
      if (!node.children.has(char)) return false;
      return dfs(index + 1, node.children.get(char)!);
    };
    
    return dfs(0, this.root);
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
          <div className="text-sm font-medium">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add & Search Word</h3>
          <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript Code</h3>
          <div className="flex-1 overflow-auto"><SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers>{code}</SyntaxHighlighter></div>
        </Card>
      </div>
    </div>
  );
};
