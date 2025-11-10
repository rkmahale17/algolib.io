import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  words: string[];
  graph: Map<string, Set<string>>;
  inDegree: Map<string, number>;
  queue: string[];
  result: string[];
  currentPair: [string, string] | null;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const AlienDictionaryVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const words = ['wrt', 'wrf', 'er', 'ett', 'rftt'];

  const steps: Step[] = [
    {
      words,
      graph: new Map(),
      inDegree: new Map(),
      queue: [],
      result: [],
      currentPair: null,
      variables: { words: "['wrt','wrf','er','ett','rftt']" },
      explanation: "Given words in alien dictionary order. Find character ordering using topological sort.",
      highlightedLines: [1],
      lineExecution: "function alienOrder(words: string[]): string"
    },
    {
      words,
      graph: new Map(),
      inDegree: new Map(),
      queue: [],
      result: [],
      currentPair: null,
      variables: { graph: 'Map()', inDegree: 'Map()' },
      explanation: "Initialize graph (adjacency list) and inDegree map for topological sort.",
      highlightedLines: [3, 4],
      lineExecution: "const graph = new Map(); const inDegree = new Map();"
    },
    {
      words,
      graph: new Map([['w', new Set()], ['r', new Set()], ['t', new Set()], ['f', new Set()], ['e', new Set()]]),
      inDegree: new Map([['w', 0], ['r', 0], ['t', 0], ['f', 0], ['e', 0]]),
      queue: [],
      result: [],
      currentPair: null,
      variables: { chars: '{w,r,t,f,e}' },
      explanation: "Extract all unique characters from words. Initialize graph and inDegree for each char.",
      highlightedLines: [7, 8, 9, 10, 11],
      lineExecution: "for word in words: for char in word: graph[char] = Set(), inDegree[char] = 0"
    },
    {
      words,
      graph: new Map([['w', new Set()], ['r', new Set()], ['t', new Set()], ['f', new Set()], ['e', new Set()]]),
      inDegree: new Map([['w', 0], ['r', 0], ['t', 0], ['f', 0], ['e', 0]]),
      queue: [],
      result: [],
      currentPair: ['wrt', 'wrf'],
      variables: { i: 0, w1: 'wrt', w2: 'wrf' },
      explanation: "Compare adjacent words: 'wrt' vs 'wrf'. Find first differing character.",
      highlightedLines: [15, 16],
      lineExecution: "for i=0: w1='wrt', w2='wrf'"
    },
    {
      words,
      graph: new Map([['w', new Set()], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set()]]),
      inDegree: new Map([['w', 0], ['r', 0], ['t', 0], ['f', 1], ['e', 0]]),
      queue: [],
      result: [],
      currentPair: ['wrt', 'wrf'],
      variables: { diff: "t vs f", edge: 't→f' },
      explanation: "Found difference at position 2: 't' vs 'f'. In alien order: t comes before f. Add edge t→f.",
      highlightedLines: [20, 21, 22, 23],
      lineExecution: "if (w1[j] !== w2[j]) graph[t].add(f); inDegree[f]++;"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 1], ['t', 0], ['f', 1], ['e', 1]]),
      queue: [],
      result: [],
      currentPair: null,
      variables: { edges: '{w→e, e→r, t→f}' },
      explanation: "Continue comparing all adjacent word pairs. Build graph: w→e, e→r, t→f.",
      highlightedLines: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      lineExecution: "Compare all pairs, build edges based on first difference"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 1], ['t', 0], ['f', 1], ['e', 1]]),
      queue: ['w', 't'],
      result: [],
      currentPair: null,
      variables: { queue: '[w,t]', inDegree0: '{w,t}' },
      explanation: "Topological sort: start with chars having inDegree 0. Queue: [w, t].",
      highlightedLines: [29, 30, 31],
      lineExecution: "const queue = []; for (char, degree) if (degree === 0) queue.push(char)"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 1], ['t', 0], ['f', 1], ['e', 0]]),
      queue: ['t'],
      result: ['w'],
      currentPair: null,
      variables: { char: 'w', result: 'w' },
      explanation: "Process 'w' from queue. Add to result: 'w'. Update neighbors: e's inDegree: 1→0.",
      highlightedLines: [35, 36, 37, 38, 39, 40],
      lineExecution: "char = queue.shift(); result.push(char); for neighbor: inDegree[e]--"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 1], ['t', 0], ['f', 0], ['e', 0]]),
      queue: ['t', 'e'],
      result: ['w'],
      currentPair: null,
      variables: { queue: '[t,e]' },
      explanation: "e's inDegree now 0. Add to queue: [t, e].",
      highlightedLines: [40, 41, 42],
      lineExecution: "if (inDegree[neighbor] === 0) queue.push(neighbor);"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 1], ['t', 0], ['f', 0], ['e', 0]]),
      queue: ['e', 'f'],
      result: ['w', 't'],
      currentPair: null,
      variables: { char: 't', result: 'wt' },
      explanation: "Process 't'. Result: 'wt'. Update neighbors: f's inDegree: 1→0. Add f to queue.",
      highlightedLines: [35, 36, 37, 38, 39, 40, 41, 42],
      lineExecution: "char = queue.shift(); result.push('t'); inDegree[f]--; queue.push('f')"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 0], ['t', 0], ['f', 0], ['e', 0]]),
      queue: ['f', 'r'],
      result: ['w', 't', 'e'],
      currentPair: null,
      variables: { char: 'e', result: 'wte' },
      explanation: "Process 'e'. Result: 'wte'. Update neighbors: r's inDegree: 1→0. Add r to queue.",
      highlightedLines: [35, 36, 37, 38, 39, 40, 41, 42],
      lineExecution: "char = queue.shift(); result.push('e'); inDegree[r]--; queue.push('r')"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 0], ['t', 0], ['f', 0], ['e', 0]]),
      queue: ['r'],
      result: ['w', 't', 'e', 'f'],
      currentPair: null,
      variables: { char: 'f', result: 'wtef' },
      explanation: "Process 'f'. Result: 'wtef'. f has no neighbors.",
      highlightedLines: [35, 36, 37],
      lineExecution: "char = queue.shift(); result.push('f');"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 0], ['t', 0], ['f', 0], ['e', 0]]),
      queue: [],
      result: ['w', 't', 'e', 'f', 'r'],
      currentPair: null,
      variables: { char: 'r', result: 'wtefr' },
      explanation: "Process 'r'. Result: 'wtefr'. Queue empty, all chars processed.",
      highlightedLines: [35, 36, 37],
      lineExecution: "char = queue.shift(); result.push('r'); // queue empty"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 0], ['t', 0], ['f', 0], ['e', 0]]),
      queue: [],
      result: ['w', 't', 'e', 'f', 'r'],
      currentPair: null,
      variables: { 'result.length': 5, 'inDegree.size': 5 },
      explanation: "Check validity: result.length (5) === inDegree.size (5)? Yes! Valid ordering.",
      highlightedLines: [46],
      lineExecution: "return result.length === inDegree.size ? result.join('') : ''; // true"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 0], ['t', 0], ['f', 0], ['e', 0]]),
      queue: [],
      result: ['w', 't', 'e', 'f', 'r'],
      currentPair: null,
      variables: { order: 'wtefr' },
      explanation: "Return 'wtefr'. Alien alphabet order found!",
      highlightedLines: [46],
      lineExecution: "return 'wtefr';"
    },
    {
      words,
      graph: new Map([['w', new Set(['e'])], ['r', new Set()], ['t', new Set(['f'])], ['f', new Set()], ['e', new Set(['r'])]]),
      inDegree: new Map([['w', 0], ['r', 0], ['t', 0], ['f', 0], ['e', 0]]),
      queue: [],
      result: ['w', 't', 'e', 'f', 'r'],
      currentPair: null,
      variables: { order: 'wtefr', complexity: 'O(C)' },
      explanation: "Algorithm complete! Build graph from word pairs, topological sort. Time: O(C) where C=total chars, Space: O(1) (max 26 chars).",
      highlightedLines: [46],
      lineExecution: "Result: 'wtefr'"
    }
  ];

  const code = `function alienOrder(words: string[]): string {
  const graph = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();
  
  for (const word of words) {
    for (const char of word) {
      graph.set(char, new Set());
      inDegree.set(char, 0);
    }
  }
  
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i], w2 = words[i + 1];
    const minLen = Math.min(w1.length, w2.length);
    
    for (let j = 0; j < minLen; j++) {
      if (w1[j] !== w2[j]) {
        if (!graph.get(w1[j])!.has(w2[j])) {
          graph.get(w1[j])!.add(w2[j]);
          inDegree.set(w2[j], inDegree.get(w2[j])! + 1);
        }
        break;
      }
    }
  }
  
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

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`words-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Words</h3>
              <div className="space-y-1">
                {step.words.map((word, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1 rounded font-mono text-sm ${
                      step.currentPair &&
                      (word === step.currentPair[0] || word === step.currentPair[1])
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {step.graph.size > 0 && (
            <motion.div
              key={`graph-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Graph (edges)</h3>
                <div className="space-y-1 text-sm">
                  {Array.from(step.graph.entries()).map(([char, neighbors]) => (
                    <div key={char} className="font-mono">
                      {char} → {neighbors.size > 0 ? Array.from(neighbors).join(', ') : '∅'}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {step.result.length > 0 && (
            <motion.div
              key={`result-${currentStep}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Alien Order</h3>
                <div className="text-2xl font-bold text-green-500">{step.result.join('')}</div>
              </Card>
            </motion.div>
          )}

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
