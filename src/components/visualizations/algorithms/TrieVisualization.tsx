import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface TrieNode {
  char: string;
  children: Map<string, TrieNode>;
  isEnd: boolean;
  x?: number;
  y?: number;
}

interface Step {
  currentNode: string[];
  operation: 'insert' | 'search';
  word: string;
  currentIndex: number;
  found: boolean | null;
  message: string;
  lineNumber: number;
}

export const TrieVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  
  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }
  
  search(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return node.isEndOfWord;
  }
}`;

  const generateSteps = () => {
    const newSteps: Step[] = [];
    const words = ['cat', 'car', 'card'];
    
    // Insert operations
    words.forEach(word => {
      const path: string[] = [];
      for (let i = 0; i < word.length; i++) {
        path.push(word[i]);
        newSteps.push({
          currentNode: [...path],
          operation: 'insert',
          word,
          currentIndex: i,
          found: null,
          message: `Inserting "${word}": Adding character '${word[i]}'`,
          lineNumber: 13
        });
      }
      newSteps.push({
        currentNode: [...path],
        operation: 'insert',
        word,
        currentIndex: word.length,
        found: null,
        message: `Inserted "${word}": Marked as end of word`,
        lineNumber: 16
      });
    });

    // Search operations
    ['cat', 'cap'].forEach(word => {
      const path: string[] = [];
      let found = true;
      for (let i = 0; i < word.length; i++) {
        path.push(word[i]);
        const exists = (word === 'cat') || (i < 2);
        if (!exists) found = false;
        
        newSteps.push({
          currentNode: [...path],
          operation: 'search',
          word,
          currentIndex: i,
          found: exists ? null : false,
          message: exists 
            ? `Searching "${word}": Found '${word[i]}'`
            : `Searching "${word}": Character '${word[i]}' not found`,
          lineNumber: 22
        });
        
        if (!exists) break;
      }
      
      if (found) {
        newSteps.push({
          currentNode: [...path],
          operation: 'search',
          word,
          currentIndex: word.length,
          found: true,
          message: `Search "${word}": Found!`,
          lineNumber: 27
        });
      }
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div className="bg-card rounded-lg p-6 border space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          {currentStep.operation === 'insert' ? 'Inserting' : 'Searching'}: {currentStep.word}
        </h3>
        <div className="bg-muted/30 rounded p-4 min-h-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-mono text-muted-foreground">Trie Structure</div>
            <div className="flex gap-2">
              {currentStep.currentNode.map((char, idx) => (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all ${
                    idx === currentStep.currentIndex
                      ? 'bg-primary/20 border-primary text-primary scale-110'
                      : 'bg-card border-border'
                  }`}
                >
                  {char}
                </div>
              ))}
            </div>
            {currentStep.found !== null && (
              <div className={`mt-4 px-4 py-2 rounded-lg ${
                currentStep.found ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
              }`}>
                {currentStep.found ? '✓ Found' : '✗ Not Found'}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div> 
           <VariablePanel
        variables={{
          operation: currentStep.operation,
          word: currentStep.word,
          currentChar: currentStep.currentIndex < currentStep.word.length 
            ? currentStep.word[currentStep.currentIndex] 
            : 'end',
          found: currentStep.found !== null ? String(currentStep.found) : 'searching...'
        }}
      />
      </div>
        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />

     </div>
   


    </div>
  );
};
