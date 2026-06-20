import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { Share2 } from 'lucide-react';

interface Step {
  queue: string[];
  visited: string[];
  level: number;
  currentWord: string | null;
  currentPattern: string | null;
  neighbors: Record<string, string[]>;
  message: string;
  lineNumber: number;
  found: boolean;
  resultLevel: number;
}

export const WordLadderVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const intervalRef = useRef<number | null>(null);

  const code = `function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
    if (!wordList.includes(endWord)) {
        return 0;
    }

    const neighbors = new Map<string, string[]>();
    const words = [...wordList, beginWord];

    for (const word of words) {
        for (let j = 0; j < word.length; j++) {
            const pattern = word.slice(0, j) + "*" + word.slice(j + 1);
            if (!neighbors.has(pattern)) {
                neighbors.set(pattern, []);
            }
            neighbors.get(pattern)!.push(word);
        }
    }

    const visited = new Set<string>([beginWord]);
    const queue: string[] = [beginWord];
    let level = 1;

    while (queue.length > 0) {
        const size = queue.length;
        for (let i = 0; i < size; i++) {
            const word = queue.shift()!;
            if (word === endWord) {
                return level;
            }
            for (let j = 0; j < word.length; j++) {
                const pattern = word.slice(0, j) + "*" + word.slice(j + 1);
                const nextWords = neighbors.get(pattern) || [];
                for (const nextWord of nextWords) {
                    if (!visited.has(nextWord)) {
                        visited.add(nextWord);
                        queue.push(nextWord);
                    }
                }
            }
        }
        level++;
    }

    return 0;
}`;

  const beginWord = "hit";
  const endWord = "cog";
  const wordList = ["hot", "dot", "dog", "lot", "log", "cog"];

  const generateSteps = () => {
    const newSteps: Step[] = [];
    const neighbors: Record<string, string[]> = {};
    const visited = new Set<string>();
    const queue: string[] = [];

    const addStep = (
      message: string,
      lineNumber: number,
      currentWord: string | null = null,
      currentPattern: string | null = null,
      found: boolean = false,
      resultLevel: number = 0
    ) => {
      newSteps.push({
        queue: [...queue],
        visited: Array.from(visited),
        level,
        currentWord,
        currentPattern,
        neighbors: JSON.parse(JSON.stringify(neighbors)),
        message,
        lineNumber,
        found,
        resultLevel
      });
    };

    let level = 1;

    addStep(`Check if wordList contains endWord "${endWord}".`, 2);
    if (!wordList.includes(endWord)) {
      addStep(`endWord not found in wordList. Return 0.`, 3);
      setSteps(newSteps);
      return;
    }

    addStep(`Initialize neighbors map to store patterns.`, 6);
    const words = [...wordList, beginWord];
    addStep(`Combine wordList and beginWord for preprocessing.`, 7);

    addStep(`Start building the generalized graph using one-character-wildcard patterns.`, 9);
    for (const word of words) {
      for (let j = 0; j < word.length; j++) {
        const pattern = word.slice(0, j) + "*" + word.slice(j + 1);
        if (!neighbors[pattern]) {
          neighbors[pattern] = [];
        }
        neighbors[pattern].push(word);
      }
    }
    addStep(`Graph construction complete. All wildcard patterns are mapped to their matching words.`, 16);

    visited.add(beginWord);
    addStep(`Initialize visited set with beginWord "${beginWord}" to prevent cycles.`, 18);

    queue.push(beginWord);
    addStep(`Initialize BFS queue with beginWord "${beginWord}".`, 19);
    
    addStep(`Set initial ladder length (level) to 1.`, 20);

    addStep(`Begin main BFS loop while queue is not empty.`, 22);
    while (queue.length > 0) {
      const size = queue.length;
      addStep(`Level ${level}: Get the number of nodes at the current level (size = ${size}).`, 23);

      for (let i = 0; i < size; i++) {
        const word = queue.shift()!;
        addStep(`Dequeue "${word}" to process.`, 25, word);

        addStep(`Check if current word "${word}" is the endWord "${endWord}".`, 26, word);
        if (word === endWord) {
          addStep(`Found endWord! Return current level ${level} as the shortest transformation sequence length.`, 27, word, null, true, level);
          setSteps(newSteps);
          return;
        }

        addStep(`Generate all possible patterns for "${word}" to find its neighbors.`, 29, word);
        for (let j = 0; j < word.length; j++) {
          const pattern = word.slice(0, j) + "*" + word.slice(j + 1);
          const nextWords = neighbors[pattern] || [];
          addStep(`Pattern "${pattern}": Found ${nextWords.length} potential neighbors.`, 31, word, pattern);

          for (const nextWord of nextWords) {
            addStep(`Check if neighbor "${nextWord}" has been visited.`, 33, word, pattern);
            if (!visited.has(nextWord)) {
              visited.add(nextWord);
              addStep(`Mark "${nextWord}" as visited.`, 34, word, pattern);
              
              queue.push(nextWord);
              addStep(`Enqueue "${nextWord}" for the next level.`, 35, word, pattern);
            } else {
              addStep(`Neighbor "${nextWord}" is already visited. Skip to avoid cycles.`, 33, word, pattern);
            }
          }
        }
      }

      level++;
      addStep(`Finished processing level. Increment level to ${level}.`, 40);
    }

    addStep(`Queue is empty and endWord was not reached. Return 0.`, 43, null, null, false, 0);
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
        <Card className="p-6 border-2 flex flex-col gap-8">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">Word Ladder BFS</h3>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            {/* Visual State Representation */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-muted-foreground mr-2">Begin:</span>
                  <span className="px-2 py-1 bg-muted rounded-md font-mono text-foreground">{beginWord}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground mr-2">End:</span>
                  <span className="px-2 py-1 bg-muted rounded-md font-mono text-foreground">{endWord}</span>
                </div>
              </div>

              {/* Current Context */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Word</span>
                  <div className="flex gap-1 h-10">
                    {currentStep.currentWord ? (
                      currentStep.currentWord.split('').map((char, i) => (
                        <div key={i} className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary border border-primary/30 rounded font-mono font-bold">
                          {char}
                        </div>
                      ))
                    ) : (
                      <div className="h-8 flex items-center text-muted-foreground italic text-sm">None</div>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Pattern</span>
                  <div className="flex gap-1 h-10">
                    {currentStep.currentPattern ? (
                      currentStep.currentPattern.split('').map((char, i) => (
                        <div key={i} className={`w-8 h-8 flex items-center justify-center border rounded font-mono font-bold
                          ${char === '*' ? 'bg-amber-500/20 text-amber-600 border-amber-500/30' : 'bg-muted text-foreground border-border'}
                        `}>
                          {char}
                        </div>
                      ))
                    ) : (
                      <div className="h-8 flex items-center text-muted-foreground italic text-sm">None</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Queue Visualization */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">BFS Queue (Level {currentStep.level})</span>
                <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-xl min-h-[64px] border border-border items-center">
                  {currentStep.queue.length === 0 ? (
                    <span className="text-sm text-muted-foreground italic">Queue is empty</span>
                  ) : (
                    currentStep.queue.map((w, idx) => (
                      <div key={idx} className="px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-md font-mono text-sm shadow-sm flex items-center gap-2">
                        {w}
                        {idx === 0 && <span className="flex w-2 h-2 rounded-full bg-blue-500"></span>}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Visited Set */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Visited Words</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentStep.visited.length === 0 ? (
                    <span className="text-sm text-muted-foreground italic">None</span>
                  ) : (
                    currentStep.visited.map((w, idx) => (
                      <div key={idx} className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded font-mono text-xs">
                        {w}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Commentary & Variables */}
            <div className="mt-auto flex flex-col gap-4">
              <div className={`p-4 rounded-xl border flex items-center min-h-[80px] transition-colors duration-300
                ${currentStep.found ? 'bg-green-500/10 border-green-500/30' : 'bg-primary/5 border-primary/10'}`}>
                <p className="text-sm font-medium leading-relaxed text-foreground/90">
                  {currentStep.message}
                </p>
              </div>

              <VariablePanel
                variables={{
                  'level': currentStep.level,
                  'queue size': currentStep.queue.length,
                  'visited count': currentStep.visited.length,
                  'result': currentStep.found ? currentStep.resultLevel : (currentStep.resultLevel === 0 && currentStepIndex === steps.length - 1 ? 0 : 'pending')
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
