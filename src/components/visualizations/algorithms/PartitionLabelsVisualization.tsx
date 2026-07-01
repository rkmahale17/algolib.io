import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  s: string;
  lastIndex: Record<string, number>;
  result: number[];
  currentPartitionSize: number;
  farthestReach: number;
  currentI: number;
  phase: 'init' | 'buildMap' | 'initPartition' | 'partition' | 'done';
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function partitionLabels(s: string): number[] {
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
}`,
  python: `def partitionLabels(s: str) -> list[int]:
    last_index = {}
    for i, char in enumerate(s):
        last_index[char] = i
    result = []
    size = 0
    end = 0
    for i, char in enumerate(s):
        size += 1
        end = max(end, last_index[char])
        if i == end:
            result.append(size)
            size = 0
    return result`,
  java: `public static class Solution {
    public List<Integer> partitionLabels(String s) {
        Map<Character, Integer> lastIndex = new HashMap<>();
        for (int i = 0; i < s.length; i++) {
            lastIndex.put(s.charAt(i), i);
        }
        List<Integer> result = new ArrayList<>();
        int currentPartitionSize = 0;
        int farthestReach = 0;
        for (int i = 0; i < s.length; i++) {
            currentPartitionSize++;
            farthestReach = Math.max(farthestReach, lastIndex.get(s.charAt(i)));
            if (i == farthestReach) {
                result.add(currentPartitionSize);
                currentPartitionSize = 0;
            }
        }
        return result;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> partitionLabels(string s) {
        vector<int> lastIndex(26, 0);
        for (int i = 0; i < s.length; ++i) {
            lastIndex[s[i] - 'a'] = i;
        }
        vector<int> result;
        int partitionSize = 0;
        int currentPartitionEnd = 0;
        for (int i = 0; i < s.length; ++i) {
            partitionSize++;
            currentPartitionEnd = max(currentPartitionEnd, lastIndex[s[i] - 'a']);
            if (i == currentPartitionEnd) {
                result.push_back(partitionSize);
                partitionSize = 0;
            }
        }
        return result;
    }
};`
};

export const PartitionLabelsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const sWord = "abacbdeed";

  const { steps, stepLineNumbers } = useMemo(() => {
    const s = sWord;
    const newSteps: Step[] = [];
    const lastIndex: Record<string, number> = {};
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const addStep = (
      phase: 'init' | 'buildMap' | 'initPartition' | 'partition' | 'done',
      explanation: string,
      pseudo: string,
      vars: any,
      currI: number,
      cps: number,
      fr: number,
      resArr: number[],
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        s,
        lastIndex: { ...lastIndex },
        result: [...resArr],
        currentPartitionSize: cps,
        farthestReach: fr,
        currentI: currI,
        phase,
        explanation,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      'init',
      "To ensure each letter appears in at most one part, we first need to know the absolute LAST time every character appears in the string.",
      `partitionLabels(s="${s}")`,
      { s: `"${s}"` },
      -1, 0, 0, [],
      1, 1, 2, 3
    );

    addStep(
      'init',
      "Initialize lastIndex map.",
      "SET last_index = {}",
      { last_index: "{}" },
      -1, 0, 0, [],
      2, 2, 3, 4
    );

    for (let i = 0; i < s.length; i++) {
      lastIndex[s[i]] = i;
      addStep(
        'buildMap',
        `Scanning: For '${s[i]}', we update its last known index to ${i}. Any partition containing '${s[i]}' cannot close before index ${i}.`,
        `FOR i, char IN enumerate(s)  →  last_index['${s[i]}'] = ${i}`,
        { i, char: s[i], last_index: JSON.stringify(lastIndex) },
        i, 0, 0, [],
        4, 4, 5, 6
      );
    }

    const result: number[] = [];
    let currentPartitionSize = 0;
    let farthestReach = 0;

    addStep(
      'initPartition',
      "Initialize partitioning variables: result list, current size accumulator, and farthestReach pointer.",
      "SET result = [], size = 0, end = 0",
      { size: currentPartitionSize, end: farthestReach },
      -1, currentPartitionSize, farthestReach, result,
      7, 5, 8, 9
    );

    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      currentPartitionSize++;
      
      addStep(
        'partition',
        `At index ${i}, we encounter '${char}'. Our current partition size grows to ${currentPartitionSize}.`,
        `FOR i, char IN enumerate(s)  →  size += 1  →  size = ${currentPartitionSize}`,
        { i, char, size: currentPartitionSize, end: farthestReach },
        i, currentPartitionSize, farthestReach, result,
        10, 9, 11, 12
      );

      const lastOcc = lastIndex[char];
      const prevFarthest = farthestReach;
      farthestReach = Math.max(farthestReach, lastOcc);

      addStep(
        'partition',
        `We look up '${char}' in our map. Its last appearance is at index ${lastOcc}. We expand 'farthestReach' to max(${prevFarthest}, ${lastOcc}) = ${farthestReach}.`,
        `SET end = max(end, last_index['${char}'])  →  end = ${farthestReach}`,
        { i, char, size: currentPartitionSize, end: farthestReach, lastOcc },
        i, currentPartitionSize, farthestReach, result,
        11, 10, 12, 13
      );

      addStep(
        'partition',
        `Are we allowed to close the partition here? We check if our current index ${i} has caught up to 'farthestReach' (${farthestReach}).`,
        `IF i == end  →  ${i} == ${farthestReach}`,
        { i, end: farthestReach, match: i === farthestReach },
        i, currentPartitionSize, farthestReach, result,
        12, 11, 13, 14
      );

      if (i === farthestReach) {
        result.push(currentPartitionSize);
        currentPartitionSize = 0;
        addStep(
          'partition',
          `Yes, ${i} === ${farthestReach}! Every character in this partition does not appear later. We record its size (${result[result.length - 1]}) and reset size for the next partition.`,
          `result.append(size)  →  size = 0`,
          { result: JSON.stringify(result) },
          i, currentPartitionSize, farthestReach, result,
          14, 13, 15, 16
        );
      }
    }

    addStep(
      'done',
      `We have processed all characters. The final partition sizes are: ${JSON.stringify(result)}.`,
      `RETURN result  →  ${JSON.stringify(result)}`,
      { result: JSON.stringify(result) },
      -1, currentPartitionSize, farthestReach, result,
      17, 14, 18, 19
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [sWord]);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

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
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-3">String Partitioning</h3>
            {renderString()}
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-3">Last Index Map</h3>
            {renderMap()}
          </Card>

          {step.result.length > 0 && (
            <Card className="p-6">
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

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <VariablePanel
            variables={{
              i: step.currentI !== -1 ? step.currentI : '-',
              num: step.currentI >= 0 && step.currentI < step.s.length ? step.s[step.currentI] : '-',
              farthestReach: step.farthestReach,
              currentPartitionSize: step.currentPartitionSize
            }}
          />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
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
export default PartitionLabelsVisualization;
