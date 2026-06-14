import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  s: string;
  lastIndex: Record<string, number>;
  result: number[];
  currentPartitionSize: number;
  farthestReach: number;
  currentI: number;
  phase: 'init' | 'buildMap' | 'initPartition' | 'partition' | 'done';
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  variables: Record<string, any>;
}

export const PartitionLabelsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const code = `function partitionLabels(s: string): number[] {
  const lastIndex = new Map<string, number>();

  for (let i = 0; i < s.length; i++) {
    lastIndex.set(s[i], i);
  }

  const result: number[] = [];
  let currentPartitionSize = 0;
  let farthestReach = 0;

  for (let i = 0; i < s.length; i++) {
    currentPartitionSize++;
    farthestReach = Math.max(farthestReach, lastIndex.get(s[i])!);

    if (i === farthestReach) {
      result.push(currentPartitionSize);
      currentPartitionSize = 0;
    }
  }

  return result;
}`;

  const generateSteps = () => {
    const s = "abacbdeed";
    const newSteps: Step[] = [];
    const lastIndex: Record<string, number> = {};
    
    newSteps.push({
      s,
      lastIndex: { ...lastIndex },
      result: [],
      currentPartitionSize: 0,
      farthestReach: 0,
      currentI: -1,
      phase: 'init',
      explanation: "To ensure each letter appears in at most one part, we first need to know the absolute LAST time every character appears in the string. We initialize an empty map 'lastIndex' to record this.",
      highlightedLines: [2],
      lineExecution: "const lastIndex = new Map<string, number>();",
      variables: {}
    });

    for (let i = 0; i < s.length; i++) {
      lastIndex[s[i]] = i;
      newSteps.push({
        s,
        lastIndex: { ...lastIndex },
        result: [],
        currentPartitionSize: 0,
        farthestReach: 0,
        currentI: i,
        phase: 'buildMap',
        explanation: `Scanning the string to record the latest index for each character. For '${s[i]}', we update its last known index to ${i}. This tells us that any partition containing '${s[i]}' CANNOT be closed before index ${i}.`,
        highlightedLines: [4, 5],
        lineExecution: `lastIndex.set('${s[i]}', ${i});`,
        variables: { i, 's[i]': s[i] }
      });
    }

    const result: number[] = [];
    let currentPartitionSize = 0;
    let farthestReach = 0;

    newSteps.push({
      s,
      lastIndex: { ...lastIndex },
      result: [...result],
      currentPartitionSize,
      farthestReach,
      currentI: -1,
      phase: 'initPartition',
      explanation: "Now that we know the last occurrence of every character, we can greedily build partitions. We use 'farthestReach' to track how far the current partition MUST stretch to safely include all its characters.",
      highlightedLines: [8, 9, 10],
      lineExecution: "const result = []; let currentPartitionSize = 0; let farthestReach = 0;",
      variables: { currentPartitionSize, farthestReach }
    });

    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      currentPartitionSize++;
      
      newSteps.push({
        s,
        lastIndex: { ...lastIndex },
        result: [...result],
        currentPartitionSize,
        farthestReach,
        currentI: i,
        phase: 'partition',
        explanation: `At index ${i}, we encounter '${char}'. Our current partition size grows to ${currentPartitionSize}.`,
        highlightedLines: [12, 13],
        lineExecution: `currentPartitionSize++; // ${currentPartitionSize}`,
        variables: { i, char, currentPartitionSize, farthestReach }
      });

      const lastOcc = lastIndex[char];
      const prevFarthest = farthestReach;
      farthestReach = Math.max(farthestReach, lastOcc);

      newSteps.push({
        s,
        lastIndex: { ...lastIndex },
        result: [...result],
        currentPartitionSize,
        farthestReach,
        currentI: i,
        phase: 'partition',
        explanation: `We look up '${char}' in our map. Its very last appearance in the entire string is at index ${lastOcc}. Therefore, this current partition CANNOT be closed until at least index ${lastOcc}. We expand 'farthestReach' to max(${prevFarthest}, ${lastOcc}) = ${farthestReach}.`,
        highlightedLines: [14],
        lineExecution: `farthestReach = Math.max(${prevFarthest}, ${lastOcc}); // ${farthestReach}`,
        variables: { i, char, currentPartitionSize, farthestReach, lastOcc }
      });

      newSteps.push({
        s,
        lastIndex: { ...lastIndex },
        result: [...result],
        currentPartitionSize,
        farthestReach,
        currentI: i,
        phase: 'partition',
        explanation: `Are we allowed to close the partition here? We check if our current index ${i} has caught up to 'farthestReach' (${farthestReach}).`,
        highlightedLines: [16],
        lineExecution: `if (${i} === ${farthestReach})`,
        variables: { i, farthestReach, isMatch: i === farthestReach }
      });

      if (i === farthestReach) {
        result.push(currentPartitionSize);
        newSteps.push({
          s,
          lastIndex: { ...lastIndex },
          result: [...result],
          currentPartitionSize: 0,
          farthestReach,
          currentI: i,
          phase: 'partition',
          explanation: `Yes, ${i} === ${farthestReach}! This means every character we've seen so far in this partition does NOT appear anywhere later in the string. We can safely seal this partition. We record its size (${currentPartitionSize}) and prepare for a new one.`,
          highlightedLines: [17, 18],
          lineExecution: `result.push(${currentPartitionSize}); currentPartitionSize = 0;`,
          variables: { result: JSON.stringify(result) }
        });
        currentPartitionSize = 0;
      }
    }

    newSteps.push({
      s,
      lastIndex: { ...lastIndex },
      result: [...result],
      currentPartitionSize,
      farthestReach,
      currentI: -1,
      phase: 'done',
      explanation: `We have processed all characters. Our greedy strategy successfully found the optimal cuts. The final partition sizes are: ${JSON.stringify(result)}.`,
      highlightedLines: [22],
      lineExecution: "return result;",
      variables: { result: JSON.stringify(result) }
    });

    setSteps(newSteps);
    setCurrentStep(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  if (steps.length === 0) return null;
  const step = steps[currentStep];

  const renderString = () => {
    const { s, result, currentI, farthestReach, phase } = step;
    
    let start = 0;
    for (let size of result) {
      start += size;
    }
    
    return (
      <div className="flex flex-wrap gap-2 pb-4">
        {s.split('').map((char, idx) => {
          let isFinalized = idx < start;
          let isCurrent = idx === currentI;
          let inFarthestReach = phase === 'partition' && !isFinalized && idx <= farthestReach && idx >= start;
          let isCurrentPartition = !isFinalized && idx >= start && idx <= (phase === 'partition' ? Math.max(currentI, farthestReach) : start - 1);
          
          let bgClass = "bg-secondary/50 text-foreground";
          let borderClass = "border-border";
          
          if (isCurrent) {
            bgClass = "bg-primary text-primary-foreground";
            borderClass = "border-primary";
          } else if (isFinalized) {
            bgClass = "bg-green-500/20 text-green-700 dark:text-green-400";
            borderClass = "border-green-500/30";
          } else if (isCurrentPartition) {
            bgClass = "bg-blue-500/10 text-blue-700 dark:text-blue-400";
            borderClass = "border-blue-500/30";
          }
          
          return (
            <div key={idx} className={`relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-md border shadow-sm font-mono text-lg sm:text-xl transition-all ${bgClass} ${borderClass}`}>
              {char}
              {inFarthestReach && (
                <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full shadow-sm" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMap = () => {
    const entries = Object.entries(step.lastIndex);
    if (entries.length === 0) {
      return <div className="text-muted-foreground text-sm italic">Map is empty</div>;
    }
    const currentHighlightedChar = step.currentI >= 0 && step.currentI < step.s.length ? step.s[step.currentI] : null;

    return (
      <div className="flex flex-wrap gap-3">
        {entries.map(([char, index]) => (
          <div key={char} className={`flex items-center border rounded-md px-2 py-1 transition-all ${char === currentHighlightedChar ? 'bg-primary/20 border-primary scale-105' : 'bg-secondary/30 border-border'}`}>
             <span className="font-mono text-muted-foreground mr-2">'{char}':</span>
             <span className="font-mono font-bold text-foreground">{index}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">String Partitioning</h3>
            {renderString()}
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Last Index Map</h3>
            {renderMap()}
          </Card>

          {step.result.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Result</h3>
              <div className="flex gap-2 text-lg">
                <span className="text-muted-foreground font-mono">[</span>
                {step.result.map((val, idx) => (
                  <div key={idx} className="flex">
                    <span className="font-mono text-green-600 dark:text-green-400 font-bold">{val}</span>
                    {idx < step.result.length - 1 && <span className="text-muted-foreground font-mono">, </span>}
                  </div>
                ))}
                <span className="text-muted-foreground font-mono">]</span>
              </div>
            </Card>
          )}

          <div key={`execution-${currentStep}`}>
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </div>

          <div key={`variables-${currentStep}`}>
            <VariablePanel variables={step.variables} />
          </div>
        </div>
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
