import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface TrieNodeData {
  children: { [key: string]: TrieNodeData };
  isWord: boolean;
  char?: string;
  isActive?: boolean;
  isVisited?: boolean;
}

interface Step {
  message: string;
  lineNumber: number[];
  variables: Record<string, any>;
  trie: TrieNodeData;
  activePath: string[];
  operation: 'add' | 'search';
  currentWord: string;
  dfsDepth?: number;
}

export const AddAndSearchWordVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState<Step[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isWord: boolean = false;
}

class WordDictionary {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  addWord(word: string): void {
    let cur = this.root;
    for (const c of word) {
      if (!cur.children.has(c)) {
        cur.children.set(c, new TrieNode());
      }
      cur = cur.children.get(c)!;
    }
    cur.isWord = true;
  }

  search(word: string): boolean {
    const dfs = (j: number, node: TrieNode): boolean => {
      let cur = node;
      for (let i = j; i < word.length; i++) {
        const c = word[i];
        if (c === ".") {
          for (const child of cur.children.values()) {
            if (dfs(i + 1, child)) {
              return true;
            }
          }
          return false;
        } else {
          if (!cur.children.has(c)) {
            return false;
          }
          cur = cur.children.get(c)!;
        }
      }
      return cur.isWord;
    };
    return dfs(0, this.root);
  }
}`;

  const generateSteps = () => {
    const newSteps: Step[] = [];
    const root: TrieNodeData = { children: {}, isWord: false };

    const deepCopy = (node: TrieNodeData): TrieNodeData => {
      const newNode: TrieNodeData = { ...node, children: {} };
      for (const char in node.children) {
        newNode.children[char] = deepCopy(node.children[char]);
      }
      return newNode;
    };

    // addWord("bad")
    let currentTrie = deepCopy(root);
    newSteps.push({
      operation: 'add',
      currentWord: 'bad',
      message: 'Initialize pointer at root',
      lineNumber: [14],
      variables: { word: 'bad', cur: 'root' },
      trie: deepCopy(currentTrie),
      activePath: []
    });

    let curPath: string[] = [];
    let curPointer = currentTrie;
    for (const c of 'bad') {
      newSteps.push({
        operation: 'add',
        currentWord: 'bad',
        message: `Iterate through characters: checking '${c}'`,
        lineNumber: [15],
        variables: { word: 'bad', c, cur: curPath.join('') || 'root' },
        trie: deepCopy(currentTrie),
        activePath: [...curPath]
      });

      newSteps.push({
        operation: 'add',
        currentWord: 'bad',
        message: `Check if character '${c}' exists in current node's children`,
        lineNumber: [16],
        variables: { word: 'bad', c, cur: curPath.join('') || 'root' },
        trie: deepCopy(currentTrie),
        activePath: [...curPath]
      });

      if (!curPointer.children[c]) {
        curPointer.children[c] = { children: {}, isWord: false, char: c };
        newSteps.push({
          operation: 'add',
          currentWord: 'bad',
          message: `Character '${c}' not found. Creating new TrieNode.`,
          lineNumber: [17],
          variables: { word: 'bad', c, cur: curPath.join('') || 'root' },
          trie: deepCopy(currentTrie),
          activePath: [...curPath]
        });
      }

      curPointer = curPointer.children[c];
      curPath.push(c);
      newSteps.push({
        operation: 'add',
        currentWord: 'bad',
        message: `Move current pointer to node segment '${curPath.join('')}'`,
        lineNumber: [19],
        variables: { word: 'bad', c, cur: curPath.join('') },
        trie: deepCopy(currentTrie),
        activePath: [...curPath]
      });
    }
    curPointer.isWord = true;
    newSteps.push({
      operation: 'add',
      currentWord: 'bad',
      message: `Finished word "bad". Mark 'isWord' as true.`,
      lineNumber: [21],
      variables: { word: 'bad', cur: 'bad', isWord: true },
      trie: deepCopy(currentTrie),
      activePath: ['b', 'a', 'd']
    });

    // addWord("dad")
    newSteps.push({
      operation: 'add',
      currentWord: 'dad',
      message: 'Start adding word "dad"',
      lineNumber: [14],
      variables: { word: 'dad', cur: 'root' },
      trie: deepCopy(currentTrie),
      activePath: []
    });

    curPath = [];
    curPointer = currentTrie;
    for (const c of 'dad') {
      if (!curPointer.children[c]) {
        curPointer.children[c] = { children: {}, isWord: false, char: c };
      }
      curPointer = curPointer.children[c];
      curPath.push(c);
    }
    curPointer.isWord = true;
    newSteps.push({
      operation: 'add',
      currentWord: 'dad',
      message: 'Successfully added "dad" to the dictionary.',
      lineNumber: [22],
      variables: { word: 'dad', status: 'completed' },
      trie: deepCopy(currentTrie),
      activePath: ['d', 'a', 'd']
    });

    // search(".ad")
    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Search pattern ".ad": start DFS from root',
      lineNumber: [45],
      variables: { word: '.ad', j: 0 },
      trie: deepCopy(currentTrie),
      activePath: []
    });

    // DFS Simulation for ".ad"
    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'DFS start: initialize local pointer "cur" to current node',
      lineNumber: [26],
      variables: { word: '.ad', i: 0, cur: 'root' },
      trie: deepCopy(currentTrie),
      activePath: []
    });

    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Iterate pattern: current index 0',
      lineNumber: [27],
      variables: { word: '.ad', i: 0 },
      trie: deepCopy(currentTrie),
      activePath: []
    });

    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Pattern at index 0 is a wildcard "."',
      lineNumber: [29],
      variables: { word: '.ad', c: '.' },
      trie: deepCopy(currentTrie),
      activePath: []
    });

    // Try child 'b'
    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Wildcard found: iterating through all children. Trying "b"',
      lineNumber: [30],
      variables: { word: '.ad', i: 0, child: 'b' },
      trie: deepCopy(currentTrie),
      activePath: ['b'],
      dfsDepth: 1
    });

    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Recursively call DFS for child "b" with index 1',
      lineNumber: [31],
      variables: { word: '.ad', i: 0, child: 'b', nextIndex: 1 },
      trie: deepCopy(currentTrie),
      activePath: ['b'],
      dfsDepth: 1
    });

    // Recursive DFS for 'b' at index 1
    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'DFS inner: pointer "cur" at node "b"',
      lineNumber: [26],
      variables: { word: '.ad', i: 1, c: 'a', cur: 'b' },
      trie: deepCopy(currentTrie),
      activePath: ['b']
    });

    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Iterate pattern: index 1',
      lineNumber: [27],
      variables: { word: '.ad', i: 1 },
      trie: deepCopy(currentTrie),
      activePath: ['b']
    });

    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Pattern at index 1 is "a"',
      lineNumber: [29],
      variables: { word: '.ad', c: 'a' },
      trie: deepCopy(currentTrie),
      activePath: ['b']
    });

    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Move pointer to child node "a"',
      lineNumber: [40],
      variables: { word: '.ad', i: 1, c: 'a', curPath: 'ba' },
      trie: deepCopy(currentTrie),
      activePath: ['b', 'a']
    });

    // Moving to index 2
    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Iterate pattern: index 2',
      lineNumber: [27],
      variables: { word: '.ad', i: 2 },
      trie: deepCopy(currentTrie),
      activePath: ['b', 'a']
    });

    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Pattern at index 2 is "d"',
      lineNumber: [29],
      variables: { word: '.ad', c: 'd' },
      trie: deepCopy(currentTrie),
      activePath: ['b', 'a']
    });

    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Move pointer to child node "d"',
      lineNumber: [40],
      variables: { word: '.ad', i: 2, c: 'd', curPath: 'bad' },
      trie: deepCopy(currentTrie),
      activePath: ['b', 'a', 'd']
    });

    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'Reached end of search pattern. Returning node "isWord" property.',
      lineNumber: [43],
      variables: { word: '.ad', isWord: true },
      trie: deepCopy(currentTrie),
      activePath: ['b', 'a', 'd']
    });

    newSteps.push({
      operation: 'search',
      currentWord: '.ad',
      message: 'DFS returned true for child "b". Return true for pattern ".ad".',
      lineNumber: [32],
      variables: { word: '.ad', result: true },
      trie: deepCopy(currentTrie),
      activePath: ['b', 'a', 'd']
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(prev => prev + 1);
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  const renderTrie = (node: TrieNodeData, prefix = '', pathChars: string[] = []): JSX.Element => {
    const sortedChars = Object.keys(node.children).sort();
    const isActive = currentStep.activePath.join('') === prefix;

    return (
      <div className="flex flex-col items-center">
        <div 
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            isActive 
              ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg' 
              : node.isWord 
                  ? 'bg-secondary border-green-500 text-green-600'
                  : 'bg-card border-muted-foreground/30 text-muted-foreground'
          }`}
          title={prefix || 'root'}
        >
          {node.char || 'R'}
          {node.isWord && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />}
        </div>
        {sortedChars.length > 0 && (
          <div className="flex gap-4 mt-4 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-muted-foreground/20" />
            {sortedChars.map(char => (
              <div key={char} className="relative pt-4">
                <div className="absolute top-0 left-0 right-0 h-px bg-muted-foreground/20" />
                {renderTrie(node.children[char], prefix + char, [...pathChars, char])}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-4 h-full overflow-hidden">
      <StepControls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex + 1}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col gap-6 overflow-auto pr-2">
          <Card className="p-6 shrink-0">
            <h3 className="text-lg font-semibold mb-2">
              {currentStep.operation === 'add' ? 'Operation: addWord' : 'Operation: search'}
              <span className="ml-2 text-primary font-mono">("{currentStep.currentWord}")</span>
            </h3>
            <p className="text-sm text-balance leading-relaxed h-12">
              {currentStep.message}
            </p>
          </Card>

          <Card className="p-6 flex-1 flex flex-col items-center justify-center bg-muted/5 min-h-[400px]">
            <div className="w-full flex justify-center overflow-auto p-4">
               {renderTrie(currentStep.trie)}
            </div>
          </Card>

          <VariablePanel
            variables={currentStep.variables}
          />
        </div>

        <div className="h-full min-h-0">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={currentStep.lineNumber}
            language="typescript"
          />
        </div>
      </div>
    </div>
  );
};
