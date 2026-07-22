import { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums: number[];
  i: number | null;
  candidate: number | null;
  count: number;
  readIdx: number | null;
  comparisonResult: 'equal' | 'not_equal' | 'new_candidate' | null;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  python: `def majorityElement(nums: list[int]) -> int:
    candidate = 0
    count = 0
    for num in nums:
        if count == 0:
            candidate = num
            count = 1
        elif num == candidate:
            count += 1
        else:
            count -= 1
    return candidate`,

  typescript: `function majorityElement(nums: number[]): number {
    let candidate: number = 0;
    let count: number = 0;
    for (let i = 0; i < nums.length; i++) {
        if (count === 0) {
            candidate = nums[i];
            count = 1;
        } else if (nums[i] === candidate) {
            count++;
        } else {
            count--;
        }
    }
    return candidate;
}`,

  java: `public int majorityElement(int[] nums) {
    int candidate = 0;
    int count = 0;
    for (int num : nums) {
        if (count == 0) {
            candidate = num;
        }
        if (num == candidate) {
            count++;
        } else {
            count--;
        }
    }
    return candidate;
}`,

  cpp: `int majorityElement(vector<int>& nums) {
    int candidate = 0;
    int count = 0;
    for (int num : nums) {
        if (count == 0) {
            candidate = num;
        }
        if (num == candidate) {
            count++;
        } else {
            count--;
        }
    }
    return candidate;
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const nums = [2, 2, 1, 1, 1, 2, 2];
  const steps: Step[] = [];
  
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

  let candidate = 0;
  let count = 0;

  // Init step
  steps.push({
    nums,
    i: null,
    candidate: null,
    count: 0,
    readIdx: null,
    comparisonResult: null,
    variables: { candidate: '-', count: 0, i: '-', 'nums[i]': '-' },
    explanation: 'Initialize candidate = 0 and count = 0.',
    pseudoStep: 'SET candidate = 0, count = 0'
  });
  addLines(2, 2, 2, 2);

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Loop Header / Read step
    steps.push({
      nums,
      i,
      candidate: count === 0 ? null : candidate,
      count,
      readIdx: i,
      comparisonResult: null,
      variables: { candidate: count === 0 ? '-' : candidate, count, i, 'nums[i]': num },
      explanation: `Inspect element nums[${i}] = ${num}.`,
      pseudoStep: `FOR i = ${i}, num = ${num}:`
    });
    addLines(4, 4, 4, 4);

    // Check count == 0
    steps.push({
      nums,
      i,
      candidate: count === 0 ? null : candidate,
      count,
      readIdx: i,
      comparisonResult: null,
      variables: { candidate: count === 0 ? '-' : candidate, count, i, 'nums[i]': num },
      explanation: `Check if count is 0 → ${count === 0 ? 'YES' : 'NO'}.`,
      pseudoStep: `IF count == 0 → ${count === 0 ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(5, 5, 5, 5);

    if (count === 0) {
      candidate = num;
      // Elect candidate step
      steps.push({
        nums,
        i,
        candidate,
        count: 0,
        readIdx: i,
        comparisonResult: 'new_candidate',
        variables: { candidate, count: 0, i, 'nums[i]': num },
        explanation: `Count is 0, so elect ${num} as the new candidate.`,
        pseudoStep: `SET candidate = ${num}`
      });
      addLines(6, 6, 6, 6);

      count = 1;
      // Set count = 1 step
      steps.push({
        nums,
        i,
        candidate,
        count,
        readIdx: i,
        comparisonResult: 'new_candidate',
        variables: { candidate, count, i, 'nums[i]': num },
        explanation: `Set count to 1 for the new candidate.`,
        pseudoStep: 'SET count = 1'
      });
      addLines(7, 7, 9, 9);
    } else {
      const isMatch = num === candidate;
      
      // Compare step
      steps.push({
        nums,
        i,
        candidate,
        count,
        readIdx: i,
        comparisonResult: isMatch ? 'equal' : 'not_equal',
        variables: { candidate, count, i, 'nums[i]': num },
        explanation: `Compare num (${num}) with candidate (${candidate}) → ${isMatch ? 'Match' : 'Mismatch'}.`,
        pseudoStep: `IF num == candidate (${num} == ${candidate}) → ${isMatch ? 'YES ✓' : 'NO ✗'}`
      });
      addLines(8, 8, 8, 8);

      if (isMatch) {
        count++;
        // Increment count step
        steps.push({
          nums,
          i,
          candidate,
          count,
          readIdx: i,
          comparisonResult: 'equal',
          variables: { candidate, count, i, 'nums[i]': num },
          explanation: `num matches candidate. Increment count to ${count}.`,
          pseudoStep: `INCREMENT count → ${count}`
        });
        addLines(9, 9, 9, 9);
      } else {
        count--;
        // Decrement count step
        steps.push({
          nums,
          i,
          candidate,
          count,
          readIdx: i,
          comparisonResult: 'not_equal',
          variables: { candidate, count, i, 'nums[i]': num },
          explanation: `num does not match candidate. Decrement count to ${count}.`,
          pseudoStep: `DECREMENT count → ${count}`
        });
        addLines(11, 11, 11, 11);
      }
    }
  }

  // Final return step
  steps.push({
    nums,
    i: null,
    candidate,
    count,
    readIdx: null,
    comparisonResult: null,
    variables: { candidate, count, i: '-', 'nums[i]': '-' },
    explanation: `Finished scanning the array. The final majority element candidate is ${candidate}.`,
    pseudoStep: `RETURN candidate (${candidate})`
  });
  addLines(14, 12, 14, 14);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const MajorityElementVisualization = () => {
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex flex-col gap-8">
            
            {/* Array State */}
            <div>
              <h3 className="font-semibold mb-6 text-sm text-foreground">Array State</h3>
              <div className="flex flex-col gap-8 items-start relative pt-10 pb-4">
                <div className="flex justify-start gap-4">
                  {currentStep.nums.map((value, idx) => {
                    let borderClass = 'border-border';
                    let bgClass = 'bg-muted/50';
                    let textClass = 'text-foreground';
                    let isSpecial = false;

                    // Highlight currently inspected element
                    if (idx === currentStep.readIdx) {
                      bgClass = 'bg-primary border-primary scale-110 shadow-lg';
                      textClass = 'text-primary-foreground';
                      isSpecial = true;

                      if (currentStep.comparisonResult === 'equal') {
                        bgClass = 'bg-emerald-500 border-emerald-500 scale-110 shadow-lg';
                        textClass = 'text-white';
                      } else if (currentStep.comparisonResult === 'not_equal') {
                        bgClass = 'bg-destructive border-destructive scale-110 shadow-lg';
                        textClass = 'text-white';
                      } else if (currentStep.comparisonResult === 'new_candidate') {
                        bgClass = 'bg-blue-500 border-blue-500 scale-110 shadow-lg';
                        textClass = 'text-white';
                      }
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 relative">
                        {currentStep.i === idx && (
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary whitespace-nowrap bg-background px-1.5 py-0.5 rounded border border-primary/30 shadow-sm z-20 animate-pulse">
                            i (read)
                          </span>
                        )}

                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${bgClass} ${borderClass} ${isSpecial ? 'z-10' : ''}`}>
                          <span className={`font-semibold text-sm ${textClass}`}>{value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Voting Metrics Panel */}
            <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-6">
              
              {/* Candidate Info */}
              <div className="flex flex-col gap-2 p-4 rounded-lg bg-background border border-border">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Candidate</span>
                <div className="flex items-center gap-3">
                  {currentStep.candidate === null ? (
                    <span className="text-lg font-bold text-muted-foreground italic">None</span>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-primary bg-primary/10">
                        <span className="font-bold text-sm text-foreground">{currentStep.candidate}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">Active Candidate</span>
                    </>
                  )}
                </div>
              </div>

              {/* Vote Count Info */}
              <div className="flex flex-col gap-2 p-4 rounded-lg bg-background border border-border">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Candidate Count</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-foreground">{currentStep.count}</span>
                    <span className="text-xs text-muted-foreground">votes</span>
                  </div>
                  {/* Visual Vote Count Bar/Blocks */}
                  <div className="flex gap-1 h-2 items-center">
                    {Array.from({ length: 7 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-full w-3 rounded-sm transition-colors duration-200 ${
                          idx < currentStep.count
                            ? 'bg-emerald-500'
                            : 'bg-muted border border-border/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

        </div>

        {/* Right column: code */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      </div>
    </div>
  );
};
