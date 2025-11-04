import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  words: string[];
  graph: Map<string, Set<string>>;
  inDegree: Map<string, number>;
  queue: string[];
  result: string[];
  currentPair: [string, string] | null;
  message: string;
  lineNumber: number;
}

export const AlienDictionaryVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function alienOrder(words: string[]): string {
  // Build graph
  const graph = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();
  
  // Initialize
  for (const word of words) {
    for (const char of word) {
      graph.set(char, new Set());
      inDegree.set(char, 0);
    }
  }
  
  // Build edges from adjacent words
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i], w2 = words[i + 1];
    const minLen = Math.min(w1.length, w2.length);
    
    for (let j = 0; j < minLen; j++) {
      if (w1[j] !== w2[j]) {
        if (!graph.get(w1[j])!.has(w2[j])) {
          graph.get(w1[j])!.add(w2[j]);
          inDegree.set(w2[j], inDegree.get(w2[j])! + 1);
        }
        break;  // Only first difference matters
      }
    }
  }
  
  // Topological sort (BFS)
  const queue: string[] = [];
  for (const [char, degree] of inDegree) {
    if (degree === 0) queue.push(char);
  }
  
  const result: string[] = [];
  while (queue.length > 0) {
    const char = queue.shift()!;
    result.push(char);
    
    for (const neighbor of graph.get(char)!) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  return result.length === inDegree.size ? result.join('') : '';
}`;

  const generateSteps = () => {
    const words = ['wrt', 'wrf', 'er', 'ett', 'rftt'];
    const newSteps: Step[] = [];

    const graph = new Map<string, Set<string>>();
    const inDegree = new Map<string, number>();

    // Initial
    newSteps.push({
      words: [...words],
      graph: new Map(),
      inDegree: new Map(),
      queue: [],
      result: [],
      currentPair: null,
      message: "Input: ['wrt','wrf','er','ett','rftt']. Find alien dictionary order.",
      lineNumber: 0
    });

    // Initialize graph
    for (const word of words) {
      for (const char of word) {
        if (!graph.has(char)) {
          graph.set(char, new Set());
          inDegree.set(char, 0);
        }
      }
    }

    newSteps.push({
      words: [...words],
      graph: new Map(Array.from(graph.entries()).map(([k, v]) => [k, new Set(v)])),
      inDegree: new Map(inDegree),
      queue: [],
      result: [],
      currentPair: null,
      message: `Initialize graph with all unique characters: ${Array.from(graph.keys()).join(', ')}`,
      lineNumber: 6
    });

    // Build edges
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i], w2 = words[i + 1];
      
      newSteps.push({
        words: [...words],
        graph: new Map(Array.from(graph.entries()).map(([k, v]) => [k, new Set(v)])),
        inDegree: new Map(inDegree),
        queue: [],
        result: [],
        currentPair: [w1, w2],
        message: `Compare '${w1}' and '${w2}'`,
        lineNumber: 14
      });

      const minLen = Math.min(w1.length, w2.length);
      for (let j = 0; j < minLen; j++) {
        if (w1[j] !== w2[j]) {
          if (!graph.get(w1[j])!.has(w2[j])) {
            graph.get(w1[j])!.add(w2[j]);
            inDegree.set(w2[j], inDegree.get(w2[j])! + 1);
            
            newSteps.push({
              words: [...words],
              graph: new Map(Array.from(graph.entries()).map(([k, v]) => [k, new Set(v)])),
              inDegree: new Map(inDegree),
              queue: [],
              result: [],
              currentPair: [w1, w2],
              message: `'${w1[j]}' comes before '${w2[j]}'. Add edge ${w1[j]}→${w2[j]}`,
              lineNumber: 20
            });
          }
          break;
        }
      }
    }

    // Topological sort
    const queue: string[] = [];
    for (const [char, degree] of inDegree) {
      if (degree === 0) queue.push(char);
    }

    newSteps.push({
      words: [...words],
      graph: new Map(Array.from(graph.entries()).map(([k, v]) => [k, new Set(v)])),
      inDegree: new Map(inDegree),
      queue: [...queue],
      result: [],
      currentPair: null,
      message: `Start with characters having inDegree 0: ${queue.join(', ')}`,
      lineNumber: 31
    });

    const result: string[] = [];
    while (queue.length > 0) {
      const char = queue.shift()!;
      result.push(char);

      newSteps.push({
        words: [...words],
        graph: new Map(Array.from(graph.entries()).map(([k, v]) => [k, new Set(v)])),
        inDegree: new Map(inDegree),
        queue: [...queue],
        result: [...result],
        currentPair: null,
        message: `Process '${char}', add to result: ${result.join('')}`,
        lineNumber: 37
      });

      for (const neighbor of graph.get(char)!) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }

      if (queue.length > 0) {
        newSteps.push({
          words: [...words],
          graph: new Map(Array.from(graph.entries()).map(([k, v]) => [k, new Set(v)])),
          inDegree: new Map(inDegree),
          queue: [...queue],
          result: [...result],
          currentPair: null,
          message: `Updated inDegrees. Queue now: ${queue.join(', ')}`,
          lineNumber: 40
        });
      }
    }

    // Final
    newSteps.push({
      words: [...words],
      graph: new Map(Array.from(graph.entries()).map(([k, v]) => [k, new Set(v)])),
      inDegree: new Map(inDegree),
      queue: [],
      result: [...result],
      currentPair: null,
      message: `Complete! Alien order: "${result.join('')}". Time: O(V+E), Space: O(V+E)`,
      lineNumber: 48
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
      setCurrentStepIndex((prev) => prev + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) {
    return <div>Loading...</div>;
  }

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              disabled={currentStepIndex === 0}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={currentStepIndex === steps.length - 1}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleStepForward}
              disabled={currentStepIndex === steps.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Speed:</span>
            <Button
              variant={speed === 2000 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(2000)}
            >
              0.5x
            </Button>
            <Button
              variant={speed === 1000 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(1000)}
            >
              1x
            </Button>
            <Button
              variant={speed === 500 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(500)}
            >
              2x
            </Button>
          </div>
          <div className="text-sm font-medium">
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Visualization */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Alien Dictionary</h3>
            
            <div className="space-y-4">
              {/* Words */}
              <div>
                <div className="text-sm font-semibold mb-2">Words:</div>
                <div className="space-y-1">
                  {currentStep.words.map((word, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-1 rounded font-mono text-sm ${
                        currentStep.currentPair && 
                        (word === currentStep.currentPair[0] || word === currentStep.currentPair[1])
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </div>

              {/* Graph */}
              {currentStep.graph.size > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Graph (edges):</div>
                  <div className="space-y-1 text-sm">
                    {Array.from(currentStep.graph.entries()).map(([char, neighbors]) => (
                      <div key={char} className="font-mono">
                        {char} → {neighbors.size > 0 ? Array.from(neighbors).join(', ') : '∅'}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Result */}
              {currentStep.result.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Result:</div>
                  <div className="text-2xl font-bold text-green-500">
                    {currentStep.result.join('')}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded text-sm">
              {currentStep.message}
            </div>
          </Card>
        </div>

        {/* Code */}
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript Code</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber) => ({
                style: {
                  backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent',
                  display: 'block',
                  width: '100%'
                }
              })}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
