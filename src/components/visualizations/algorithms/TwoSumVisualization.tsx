import { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return [-1, -1]`,

  typescript: `function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement)!, i];
        }
        seen.set(nums[i], i);
    }
    return [-1, -1];
}`,

  java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[] { seen.get(complement), i };
        }
        seen.put(nums[i], i);
    }
    return new int[] { -1, -1 };
}`,

  cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return { seen[complement], i };
        }
        seen[nums[i]] = i;
    }
    return { -1, -1 };
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const nums = [2, 7, 10, 9, 11];
  const target = 18;
  const steps: Step[] = [];
  const seen = new Map<number, number>();
  
  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  steps.push({
    array: [...nums],
    highlights: [],
    variables: { target, seen: '{}', i: '-', complement: '-' },
    explanation: `Initialize an empty hash map 'seen'. Target is ${target}.`,
    pseudoStep: 'SET seen = {} (empty hash map)',
  });
  addLines(2, 2, 2, 2); // init

  for (let i = 0; i < nums.length; i++) {
    steps.push({
      array: [...nums],
      highlights: [i],
      variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i, 'nums[i]': nums[i], complement: '-' },
      explanation: `Iteration i=${i}: inspect nums[${i}] = ${nums[i]}.`,
      pseudoStep: `FOR i = ${i}: inspect nums[${i}] = ${nums[i]}`,
    });
    addLines(3, 3, 3, 3); // loop

    const complement = target - nums[i];

    steps.push({
      array: [...nums],
      highlights: [i],
      variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i, 'nums[i]': nums[i], complement },
      explanation: `complement = ${target} − ${nums[i]} = ${complement}. This is the value we need to find in 'seen'.`,
      pseudoStep: `SET complement = target − nums[i]  →  ${target} − ${nums[i]} = ${complement}`,
    });
    addLines(4, 4, 4, 4); // compute complement

    steps.push({
      array: [...nums],
      highlights: [i],
      variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i, 'nums[i]': nums[i], complement },
      explanation: `Check if complement (${complement}) is in 'seen'.`,
      pseudoStep: `IF complement (${complement}) IN seen  →  ${seen.has(complement) ? 'YES ✓' : 'NO ✗'}`,
    });
    addLines(5, 5, 5, 5); // check if in seen

    if (seen.has(complement)) {
      const j = seen.get(complement)!;
      steps.push({
        array: [...nums],
        highlights: [j, i],
        variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i, j, 'nums[i]': nums[i], 'nums[j]': nums[j], result: `[${j}, ${i}]` },
        explanation: `Found! nums[${j}] + nums[${i}] = ${target}. Return [${j}, ${i}].`,
        pseudoStep: `FOUND complement at index ${j}  →  RETURN [${j}, ${i}]`,
      });
      addLines(6, 6, 6, 6); // found (return)
      break;
    } else {
      steps.push({
        array: [...nums],
        highlights: [i],
        variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i, 'nums[i]': nums[i], complement },
        explanation: `${complement} not in 'seen'. Store seen[${nums[i]}] = ${i}.`,
        pseudoStep: `ELSE: seen[${nums[i]}] = ${i}  (store num → index)`,
      });
      addLines(8, 7, 8, 8); // store in seen
      seen.set(nums[i], i);
    }
  }

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const TwoSumVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: visual state */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <div className="flex justify-center gap-2 flex-wrap">
              {currentStep.array.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 sm:gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep.highlights.includes(idx)
                      ? 'bg-primary border-primary scale-110 shadow-lg'
                      : 'bg-muted/50 border-border'
                  }`}>
                    <span className="font-semibold text-sm text-foreground">{value}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">[{idx}]</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-sm text-foreground">Hash Map Strategy:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• For each number, calculate complement = target − num</p>
              <p>• If complement is in map → found the pair</p>
              <p>• Otherwise → store current number in map</p>
              <p>• Time: O(n) · Space: O(n)</p>
            </div>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        {/* Right: code / pseudocode panel */}
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
