import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Card } from '@/components/ui/card';

interface Step {
  nums: number[];
  i: number | null;
  phase: 'normalize' | 'mark' | 'search' | 'finished';
  readIdx: number | null;
  targetIdx: number | null;
  val: number | null;
  targetVal: number | null;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function firstMissingPositive(nums: number[]): number {
    const n = nums.length;
    for (let i = 0; i < n; i++) {
        if (nums[i] < 0) {
            nums[i] = 0;
        }
    }
    for (let i = 0; i < n; i++) {
        const value = Math.abs(nums[i]);
        if (value >= 1 && value <= n) {
            if (nums[value - 1] > 0) {
                nums[value - 1] *= -1;
            } else if (nums[value - 1] === 0) {
                nums[value - 1] = -(n + 1);
            }
        }
    }
    for (let i = 1; i <= n; i++) {
        if (nums[i - 1] >= 0) {
            return i;
        }
    }
    return n + 1;
}`,

  python: `def firstMissingPositive(nums: list[int]) -> int:
    n = len(nums)
    for i in range(n):
        if nums[i] < 0:
            nums[i] = 0
    for i in range(n):
        value = abs(nums[i])
        if 1 <= value <= n:
            if nums[value - 1] > 0:
                nums[value - 1] *= -1
            elif nums[value - 1] == 0:
                nums[value - 1] = -(n + 1)
    for i in range(1, n + 1):
        if nums[i - 1] >= 0:
            return i
    return n + 1`,

  java: `public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        if (nums[i] < 0) {
            nums[i] = 0;
        }
    }
    for (int i = 0; i < n; i++) {
        int value = Math.abs(nums[i]);
        if (value >= 1 && value <= n) {
            if (nums[value - 1] > 0) {
                nums[value - 1] *= -1;
            } else if (nums[value - 1] == 0) {
                nums[value - 1] = -(n + 1);
            }
        }
    }
    for (int i = 1; i <= n; i++) {
        if (nums[i - 1] >= 0) {
            return i;
        }
    }
    return n + 1;
}`,

  cpp: `int firstMissingPositive(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        if (nums[i] < 0) {
            nums[i] = 0;
        }
    }
    for (int i = 0; i < n; i++) {
        int value = abs(nums[i]);
        if (value >= 1 && value <= n) {
            if (nums[value - 1] > 0) {
                nums[value - 1] *= -1;
            } else if (nums[value - 1] == 0) {
                nums[value - 1] = -(n + 1);
            }
        }
    }
    for (int i = 1; i <= n; i++) {
        if (nums[i - 1] >= 0) {
            return i;
        }
    }
    return n + 1;
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const initialNums = [3, 4, -1, 1];
  const nums = [...initialNums];
  const n = nums.length;
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

  // Step 0: Init
  steps.push({
    nums: [...nums],
    i: null,
    phase: 'normalize',
    readIdx: null,
    targetIdx: null,
    val: null,
    targetVal: null,
    variables: { n, i: '-', val: '-' },
    explanation: 'Initialize helper variable n = nums.length. Start normalization of negative numbers.',
    pseudoStep: `SET n = ${n}`
  });
  addLines(2, 2, 2, 2);

  // --- Phase 1: Normalize ---
  for (let i = 0; i < n; i++) {
    steps.push({
      nums: [...nums],
      i,
      phase: 'normalize',
      readIdx: i,
      targetIdx: null,
      val: nums[i],
      targetVal: null,
      variables: { n, i, 'nums[i]': nums[i] },
      explanation: `Normalization: Inspect nums[${i}] = ${nums[i]}. Check if it is negative.`,
      pseudoStep: `FOR i = ${i}: IF nums[i] (${nums[i]}) < 0`
    });
    addLines(3, 3, 3, 3);

    if (nums[i] < 0) {
      nums[i] = 0;
      steps.push({
        nums: [...nums],
        i,
        phase: 'normalize',
        readIdx: i,
        targetIdx: null,
        val: nums[i],
        targetVal: null,
        variables: { n, i, 'nums[i]': nums[i] },
        explanation: `Element is negative. Replace nums[${i}] with 0.`,
        pseudoStep: `SET nums[i] = 0`
      });
      addLines(5, 5, 5, 5);
    }
  }

  // --- Phase 2: Mark ---
  for (let i = 0; i < n; i++) {
    const value = Math.abs(nums[i]);

    // Loop Header
    steps.push({
      nums: [...nums],
      i,
      phase: 'mark',
      readIdx: i,
      targetIdx: null,
      val: nums[i],
      targetVal: null,
      variables: { n, i, 'nums[i]': nums[i], value: '-' },
      explanation: `Marking Phase: Scan index ${i}. Retrieve value = |nums[${i}]| = |${nums[i]}| = ${value}.`,
      pseudoStep: `FOR i = ${i}: value = abs(nums[i]) → ${value}`
    });
    addLines(8, 6, 8, 8);

    // Check bounds
    const inBounds = value >= 1 && value <= n;
    steps.push({
      nums: [...nums],
      i,
      phase: 'mark',
      readIdx: i,
      targetIdx: null,
      val: nums[i],
      targetVal: null,
      variables: { n, i, 'nums[i]': nums[i], value },
      explanation: `Check if value (${value}) is within bounds [1, n] (1 to ${n}) → ${inBounds ? 'YES' : 'NO'}.`,
      pseudoStep: `IF 1 <= value <= ${n} → ${inBounds ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(10, 8, 10, 10);

    if (inBounds) {
      const targetIdx = value - 1;
      const originalTargetVal = nums[targetIdx];

      if (originalTargetVal > 0) {
        nums[targetIdx] *= -1;
        steps.push({
          nums: [...nums],
          i,
          phase: 'mark',
          readIdx: i,
          targetIdx,
          val: nums[i],
          targetVal: nums[targetIdx],
          variables: { n, i, value, targetIdx, 'nums[targetIdx]': originalTargetVal },
          explanation: `Target index = value - 1 = ${targetIdx}. Value at index is positive (${originalTargetVal}). Multiply by -1 to mark ${value} as present.`,
          pseudoStep: `SET nums[${targetIdx}] = nums[${targetIdx}] * -1 → ${nums[targetIdx]}`
        });
        addLines(12, 10, 12, 12);
      } else if (originalTargetVal === 0) {
        nums[targetIdx] = -(n + 1);
        steps.push({
          nums: [...nums],
          i,
          phase: 'mark',
          readIdx: i,
          targetIdx,
          val: nums[i],
          targetVal: nums[targetIdx],
          variables: { n, i, value, targetIdx, 'nums[targetIdx]': originalTargetVal },
          explanation: `Target index = value - 1 = ${targetIdx}. Value at index is 0. Replace with unique marker -(n+1) = -${n+1} to mark ${value} as present.`,
          pseudoStep: `SET nums[${targetIdx}] = -(n+1) → -${n+1}`
        });
        addLines(14, 12, 14, 14);
      }
    }
  }

  // --- Phase 3: Search ---
  let missing = n + 1;
  for (let i = 1; i <= n; i++) {
    steps.push({
      nums: [...nums],
      i: null,
      phase: 'search',
      readIdx: i - 1,
      targetIdx: null,
      val: null,
      targetVal: null,
      variables: { n, i, 'nums[i-1]': nums[i - 1] },
      explanation: `Search Phase: Inspect index ${i - 1} representing positive integer ${i}. Check if nums[${i - 1}] is non-negative.`,
      pseudoStep: `FOR i = ${i} TO ${n}:`
    });
    addLines(18, 13, 18, 18);

    if (nums[i - 1] >= 0) {
      missing = i;
      steps.push({
        nums: [...nums],
        i: null,
        phase: 'search',
        readIdx: i - 1,
        targetIdx: null,
        val: null,
        targetVal: null,
        variables: { n, i, 'nums[i-1]': nums[i - 1] },
        explanation: `nums[${i - 1}] (${nums[i - 1]}) is non-negative, meaning the number ${i} is missing! Return ${i}.`,
        pseudoStep: `RETURN i (${i})`
      });
      addLines(20, 15, 20, 20);
      break;
    }
  }

  if (missing === n + 1) {
    steps.push({
      nums: [...nums],
      i: null,
      phase: 'finished',
      readIdx: null,
      targetIdx: null,
      val: null,
      targetVal: null,
      variables: { n, result: n + 1 },
      explanation: `All values from 1 to ${n} are present. The first missing positive integer is n + 1 = ${n + 1}.`,
      pseudoStep: `RETURN n + 1 (${n + 1})`
    });
    addLines(23, 16, 23, 23);
  }

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const FirstMissingPositiveVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              First Missing Positive (In-place Hashing)
            </h2>
            
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm flex flex-col gap-6">
              
              {/* Phase Header */}
              <div className="flex justify-between items-center bg-muted/30 border border-border/30 rounded-lg px-4 py-2.5">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Phase</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${
                  currentStep.phase === 'normalize' ? 'bg-orange-500' :
                  currentStep.phase === 'mark' ? 'bg-primary' :
                  currentStep.phase === 'search' ? 'bg-violet-500' : 'bg-emerald-500'
                }`}>
                  {currentStep.phase === 'normalize' ? 'Phase 1: Normalize (<0 → 0)' :
                   currentStep.phase === 'mark' ? 'Phase 2: Mark Present' :
                   currentStep.phase === 'search' ? 'Phase 3: Search Missing' : 'Done'}
                </span>
              </div>

              {/* Array State */}
              <div>
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">Array State</h4>
                <div className="flex flex-wrap gap-4 relative pt-6 pb-6">
                  {currentStep.nums.map((value, idx) => {
                    let borderClass = 'border-border';
                    let bgClass = 'bg-muted/50';
                    let textClass = 'text-foreground';
                    let labelText = '';
                    let isSpecial = false;

                    // Phase 1: normalize highlight
                    if (currentStep.phase === 'normalize' && currentStep.readIdx === idx) {
                      bgClass = 'bg-orange-500/10 border-orange-500 scale-105';
                      isSpecial = true;
                    }

                    // Phase 2: mark highlights (read vs target index)
                    if (currentStep.phase === 'mark') {
                      if (currentStep.readIdx === idx) {
                        bgClass = 'bg-primary/10 border-primary scale-105';
                        isSpecial = true;
                      }
                      if (currentStep.targetIdx === idx) {
                        bgClass = 'bg-violet-500 border-violet-500 text-white font-bold scale-105 shadow-md';
                        textClass = 'text-white';
                        labelText = 'marked';
                        isSpecial = true;
                      }
                    }

                    // Phase 3: search scan index
                    if (currentStep.phase === 'search' && currentStep.readIdx === idx) {
                      const isFound = value >= 0;
                      bgClass = isFound ? 'bg-emerald-500 border-emerald-500 text-white font-bold scale-105 shadow-md' : 'bg-violet-500/10 border-violet-500';
                      if (isFound) {
                        textClass = 'text-white';
                        labelText = 'missing';
                      }
                      isSpecial = true;
                    }

                    return (
                      <div key={idx} className="relative flex flex-col items-center">
                        {/* Index pointer labels */}
                        {currentStep.phase === 'normalize' && currentStep.readIdx === idx && (
                          <span className="absolute -top-7 text-[9px] font-bold text-orange-500 whitespace-nowrap bg-background px-1 py-0.2 rounded border shadow-sm z-20">
                            i={idx}
                          </span>
                        )}
                        {currentStep.phase === 'mark' && currentStep.readIdx === idx && (
                          <span className="absolute -top-7 text-[9px] font-bold text-primary whitespace-nowrap bg-background px-1 py-0.2 rounded border shadow-sm z-20">
                            i={idx}
                          </span>
                        )}
                        {currentStep.phase === 'search' && currentStep.readIdx === idx && (
                          <span className="absolute -top-7 text-[9px] font-bold text-violet-500 whitespace-nowrap bg-background px-1 py-0.2 rounded border shadow-sm z-20">
                            check idx {idx} (val={idx+1})
                          </span>
                        )}

                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all ${bgClass} ${borderClass} ${isSpecial ? 'z-10' : ''}`}>
                          <span className={`font-semibold text-xs ${textClass}`}>{value}</span>
                        </div>

                        {/* Status label under box */}
                        {labelText && (
                          <span className={`absolute -bottom-5 text-[8px] font-bold px-1 rounded whitespace-nowrap ${
                            labelText === 'marked' ? 'bg-violet-500 text-white' : 'bg-emerald-500 text-white animate-pulse'
                          }`}>
                            {labelText}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                Commentary
              </h4>
              <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap animate-fade-in">
                {currentStep.explanation}
              </p>
            </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
