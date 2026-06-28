import { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  k: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  highlightIndices: number[];
  left?: number;
  right?: number;
  phase?: string;
}

// ─── Hardcoded code per language (no comments) ──────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function rotate(nums: number[], k: number): void {
    k = k % nums.length;
    let l = 0;
    let r = nums.length - 1;
    while (l < r) {
        [nums[l], nums[r]] = [nums[r], nums[l]];
        l++;
        r--;
    }
    l = 0;
    r = k - 1;
    while (l < r) {
        [nums[l], nums[r]] = [nums[r], nums[l]];
        l++;
        r--;
    }
    l = k;
    r = nums.length - 1;
    while (l < r) {
        [nums[l], nums[r]] = [nums[r], nums[l]];
        l++;
        r--;
    }
}`,

  python: `def rotate(nums: List[int], k: int) -> None:
    n = len(nums)
    if n == 0:
        return
    k = k % n
    def reverse(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1
            r -= 1
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)`,

  java: `public static class Solution {
  public void rotate(int[] nums, Integer k) {
      if (nums == null || nums.length == 0) return;
      if (k == null) k = 0;
      int n = nums.length;
      k = k % n;
      reverse(nums, 0, n - 1);
      reverse(nums, 0, k - 1);
      reverse(nums, k, n - 1);
  }
  private void reverse(int[] nums, int l, int r) {
      while (l < r) {
          int temp = nums[l];
          nums[l] = nums[r];
          nums[r] = temp;
          l++;
          r--;
      }
  }
}`,

  cpp: `class Solution {
public:
    void rotate(vector<int> &nums, int k) {
        if (nums.empty()) return;
        int n = nums.size();
        k = k % n;
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }
    void reverse(vector<int> &nums, int left, int right) {
    while (left < right) {
        swap(nums[left++], nums[right--]);
    }
}
};`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const nums = [1, 2, 3, 4, 5, 6, 7];
  const n = nums.length;
  let k = 3;
  const steps: Step[] = [];
  const currentArray = [...nums];

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

  const addStep = (arr: number[], msg: string, line: number, l?: number, r?: number, highlights: number[] = [], phase?: string, ts_l = line, py_l = line, java_l = line, cpp_l = line) => {
    steps.push({
      array: [...arr],
      k,
      explanation: msg,
      pseudoStep: msg,
      variables: {
        phase: phase || '-',
        k,
        left: l !== undefined ? l : '-',
        right: r !== undefined ? r : '-',
        'nums[left]': l !== undefined && l >= 0 && l < arr.length ? arr[l] : '-',
        'nums[right]': r !== undefined && r >= 0 && r < arr.length ? arr[r] : '-'
      },
      highlightIndices: highlights,
      left: l,
      right: r,
      phase
    });
    addLines(ts_l, py_l, java_l, cpp_l);
  };

  addStep(currentArray, `Initial array. Rotate by k = ${k}`, 1, undefined, undefined, [], '-', 1, 1, 2, 3);
  steps[steps.length - 1].pseudoStep = `START rotate: k = ${k}`;

  k = k % n;
  addStep(currentArray, `Calculate k = k % n  →  ${k} % ${n} = ${k}`, 2, undefined, undefined, [], '-', 2, 5, 6, 6);
  steps[steps.length - 1].pseudoStep = `SET k = k % n  →  ${k}`;

  const performReverse = (
    arr: number[],
    left: number,
    right: number,
    ts: { start: number; loop: number; swap: number; move: number },
    py: { start: number; loop: number; swap: number; move: number },
    java: { start: number; loop: number; swap: number; move: number },
    cpp: { start: number; loop: number; swap: number; move: number },
    phaseName: string
  ) => {
    let l = left;
    let r = right;

    addStep(arr, `${phaseName}: Start reversing from index ${l} to ${r}`, ts.start, l, r, [], phaseName, ts.start, py.start, java.start, cpp.start);
    steps[steps.length - 1].pseudoStep = `CALL reverse(nums, ${l}, ${r})`;

    while (l < r) {
      addStep(arr, `${phaseName}: Check condition: left (${l}) < right (${r}) is true.`, ts.loop, l, r, [l, r], phaseName, ts.loop, py.loop, java.loop, cpp.loop);
      steps[steps.length - 1].pseudoStep = `WHILE left < right  →  ${l} < ${r}  →  YES ✓`;

      const prevLVal = arr[l];
      const prevRVal = arr[r];
      [arr[l], arr[r]] = [arr[r], arr[l]];
      addStep(arr, `${phaseName}: Swap nums[left] (${prevLVal}) and nums[right] (${prevRVal})`, ts.swap, l, r, [l, r], phaseName, ts.swap, py.swap, java.swap, cpp.swap);
      steps[steps.length - 1].pseudoStep = `SWAP nums[left], nums[right]  →  index ${l} & ${r}`;

      l++;
      r--;
      addStep(arr, `${phaseName}: Move boundaries inwards: left++, right--.`, ts.move, l, r, [], phaseName, ts.move, py.move, java.move, cpp.move);
      steps[steps.length - 1].pseudoStep = `left++, right--  →  left = ${l}, right = ${r}`;
    }

    addStep(arr, `${phaseName}: Loop terminated because left (${l}) < right (${r}) is false.`, ts.loop, l, r, [], phaseName, ts.loop, py.loop, java.loop, cpp.loop);
    steps[steps.length - 1].pseudoStep = `WHILE left < right  →  ${l} < ${r}  →  NO ✗`;
  };

  performReverse(currentArray, 0, n - 1, 
    { start: 3, loop: 5, swap: 6, move: 7 },
    { start: 11, loop: 7, swap: 8, move: 9 },
    { start: 7, loop: 12, swap: 13, move: 16 },
    { start: 7, loop: 12, swap: 13, move: 13 },
    "Reverse Entire Array"
  );
  performReverse(currentArray, 0, k - 1,
    { start: 10, loop: 12, swap: 13, move: 14 },
    { start: 12, loop: 7, swap: 8, move: 9 },
    { start: 8, loop: 12, swap: 13, move: 16 },
    { start: 8, loop: 12, swap: 13, move: 13 },
    "Reverse First K Elements"
  );
  performReverse(currentArray, k, n - 1,
    { start: 17, loop: 19, swap: 20, move: 21 },
    { start: 13, loop: 7, swap: 8, move: 9 },
    { start: 9, loop: 12, swap: 13, move: 16 },
    { start: 9, loop: 12, swap: 13, move: 13 },
    "Reverse Remaining Elements"
  );

  addStep(currentArray, "Rotation complete!", 24, undefined, undefined, [], '-', 24, 13, 10, 10);
  steps[steps.length - 1].pseudoStep = "RETURN  (rotation done)";

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const RotateArrayVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

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
            <div className="flex flex-col items-center gap-8">
              {currentStep.phase && currentStep.phase !== '-' && (
                <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider border border-primary/20">
                  {currentStep.phase}
                </div>
              )}
              <div className="flex items-end justify-center gap-2 w-full max-w-lg">
                {currentStep.array.map((value, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative">
                    <div
                      className={`w-full aspect-square rounded flex items-center justify-center font-semibold text-lg transition-all duration-300 ${currentStep.highlightIndices.includes(index)
                        ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                        : index === currentStep.left || index === currentStep.right
                          ? 'bg-accent text-accent-foreground border-2 border-primary ring-2 ring-primary/20 scale-105'
                          : 'bg-muted text-foreground'
                        }`}
                    >
                      {value}
                    </div>
                    <span className="text-xs text-muted-foreground">{index}</span>

                    {/* Pointers */}
                    <div className="h-10 flex flex-col items-center justify-start gap-1">
                      {index === currentStep.left && (
                        <span className="text-[10px] font-bold text-blue-500 animate-bounce">Left</span>
                      )}
                      {index === currentStep.right && (
                        <span className="text-[10px] font-bold text-blue-500 animate-bounce">Right</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-sm text-foreground">Rotate Array In-Place Strategy:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Step 1: Reverse the entire array of size n</p>
              <p>• Step 2: Reverse the first k elements (indices 0 to k-1)</p>
              <p>• Step 3: Reverse the remaining n-k elements (indices k to n-1)</p>
              <p>• Time: O(n) · Space: O(1) in-place without extra space</p>
            </div>
          </div>

          <VariablePanel
            variables={{
              phase: currentStep.phase || '-',
              k: currentStep.k,
              left: currentStep.left !== undefined ? currentStep.left : '-',
              right: currentStep.right !== undefined ? currentStep.right : '-',
              array: JSON.stringify(currentStep.array)
            }}
          />
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
