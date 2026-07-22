import { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums: number[];
  k: number;
  i: number | null;
  readIdx: number | null;
  writeIdx: number | null;
  val: number;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  python: `def removeElement(nums: list[int], val: int) -> int:
    k = 0
    for i in range(len(nums)):
        if nums[i] != val:
            nums[k] = nums[i]
            k += 1
    return k`,

  typescript: `function removeElement(nums: number[], val: number): number {
    let k = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== val) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
}`,

  java: `public int removeElement(int[] nums, int val) {
    int k = 0;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != val) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
}`,

  cpp: `int removeElement(vector<int>& nums, int val) {
    int k = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] != val) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const initialNums = [3, 2, 2, 3];
  const val = 3;
  const nums = [...initialNums];
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

  let k = 0;

  // Init step
  steps.push({
    nums: [...nums],
    k,
    i: null,
    readIdx: null,
    writeIdx: null,
    val,
    variables: { k, i: '-', 'nums[i]': '-', val },
    explanation: `Initialize pointer k = 0. This pointer tracks the next write position for elements not equal to ${val}.`,
    pseudoStep: 'SET k = 0'
  });
  addLines(2, 2, 2, 2);

  for (let i = 0; i < nums.length; i++) {
    // Loop header step
    steps.push({
      nums: [...nums],
      k,
      i,
      readIdx: null,
      writeIdx: null,
      val,
      variables: { k, i, 'nums[i]': nums[i], val },
      explanation: `Read index i = ${i}. Inspect element nums[${i}] = ${nums[i]}.`,
      pseudoStep: `FOR i = ${i} TO ${nums.length - 1}:`
    });
    addLines(3, 3, 3, 3);

    // Condition step
    const matches = nums[i] !== val;
    steps.push({
      nums: [...nums],
      k,
      i,
      readIdx: i,
      writeIdx: null,
      val,
      variables: { k, i, 'nums[i]': nums[i], val },
      explanation: `Check if nums[${i}] (${nums[i]}) is not equal to val (${val}) → ${matches ? 'YES' : 'NO'}.`,
      pseudoStep: `IF nums[i] (${nums[i]}) != val (${val}) → ${matches ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(4, 4, 4, 4);

    if (matches) {
      // Assign step
      nums[k] = nums[i];
      steps.push({
        nums: [...nums],
        k,
        i,
        readIdx: i,
        writeIdx: k,
        val,
        variables: { k, i, 'nums[i]': nums[i], val },
        explanation: `Copy value ${nums[i]} from read pointer i=${i} to write pointer k=${k}.`,
        pseudoStep: `SET nums[k] = nums[i]  →  nums[${k}] = ${nums[i]}`
      });
      addLines(5, 5, 5, 5);

      // Increment k step
      k++;
      steps.push({
        nums: [...nums],
        k,
        i,
        readIdx: null,
        writeIdx: null,
        val,
        variables: { k, i, 'nums[i]': nums[i], val },
        explanation: `Increment write pointer k to ${k}.`,
        pseudoStep: `INCREMENT k → ${k}`
      });
      addLines(6, 6, 6, 6);
    }
  }

  // Final return step
  steps.push({
    nums: [...nums],
    k,
    i: null,
    readIdx: null,
    writeIdx: null,
    val,
    variables: { k, i: '-', 'nums[i]': '-', val },
    explanation: `All elements processed. Return k = ${k}. The first ${k} elements contain the elements that are not equal to ${val}.`,
    pseudoStep: `RETURN k (${k})`
  });
  addLines(9, 7, 9, 9);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const RemoveElementVisualization = () => {
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex flex-col gap-6">
            
            {/* nums Array with pointer labels */}
            <div>
              <h3 className="font-semibold mb-6 text-sm text-foreground">Array State</h3>
              <div className="flex flex-col gap-8 items-start relative pt-10 pb-10">
                
                <div className="flex justify-start gap-4">
                  {currentStep.nums.map((value, idx) => {
                    let borderClass = 'border-border';
                    let bgClass = 'bg-muted/50';
                    let textClass = 'text-foreground';
                    let isSpecial = false;

                    // Kept elements prefix
                    if (idx < currentStep.k) {
                      bgClass = 'bg-emerald-500/10 dark:bg-emerald-500/20';
                      borderClass = 'border-emerald-500/50';
                    }

                    // Highlight currently read element
                    if (idx === currentStep.readIdx) {
                      bgClass = 'bg-primary border-primary scale-110 shadow-lg';
                      textClass = 'text-primary-foreground';
                      isSpecial = true;
                    }

                    // Highlight currently written element
                    if (idx === currentStep.writeIdx) {
                      bgClass = 'bg-violet-500 border-violet-500 scale-110 shadow-lg';
                      textClass = 'text-white';
                      isSpecial = true;
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 relative">
                        {/* Pointer label: i (read pointer) */}
                        {currentStep.i === idx && (
                          <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary whitespace-nowrap bg-background px-1.5 py-0.5 rounded border border-primary/30 shadow-sm z-20 animate-pulse">
                            i (read)
                          </span>
                        )}

                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${bgClass} ${borderClass} ${isSpecial ? 'z-10' : ''}`}>
                          <span className={`font-semibold text-sm ${textClass}`}>{value}</span>
                        </div>

                        {/* Pointer label: k (write pointer) */}
                        {currentStep.k === idx && (
                          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[10px] font-bold text-violet-500 whitespace-nowrap bg-background px-1.5 py-0.5 rounded border border-violet-500/30 shadow-sm z-20">
                            k (write)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Target Value Box */}
            <div className="flex gap-4 items-center border-t border-border/50 pt-4">
              <span className="text-sm font-semibold text-foreground">Target value to remove (val):</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-destructive bg-destructive/10">
                <span className="font-semibold text-sm text-destructive dark:text-destructive-foreground">{currentStep.val}</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>
          
          <VariablePanel variables={currentStep.variables} />

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
        </div>
      </div>
    </div>
  );
};
