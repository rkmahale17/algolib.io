import { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  low: number;
  mid: number;
  high: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

// ─── Hardcoded code per language (no comments) ──────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function dutchNationalFlag(nums: number[]): void {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`,

  python: `def dutch_national_flag(nums):
    low = 0
    mid = 0
    high = len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,

  java: `public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            int tmp = nums[low];
            nums[low] = nums[mid];
            nums[mid] = tmp;
            low++;
            mid++;
        }
        else if (nums[mid] == 1) {
            mid++;
        }
        else {
            int tmp = nums[mid];
            nums[mid] = nums[high];
            nums[high] = tmp;
            high--;
        }
    }
}`,

  cpp: `void dutchNationalFlag(vector<int>& nums) {
    int low = 0;
    int mid = 0;
    int high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++;
            mid++;
        }
        else if (nums[mid] == 1) {
            mid++;
        }
        else {
            swap(nums[mid], nums[high]);
            high--;
        }
    }
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const initialArray = [2, 0, 2, 1, 1, 0, 2, 1, 0];
  const steps: Step[] = [];
  const nums = [...initialArray];
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

  let low = 0;
  steps.push({
    array: [...nums],
    low: 0,
    mid: -1,
    high: -1,
    explanation: 'Initialize low pointer to 0.',
    pseudoStep: 'SET low = 0',
    variables: { low: 0, mid: '-', high: '-', 'nums[mid]': '-' }
  });
  addLines(2, 2, 2, 2);

  let mid = 0;
  steps.push({
    array: [...nums],
    low,
    mid: 0,
    high: -1,
    explanation: 'Initialize mid pointer to 0.',
    pseudoStep: 'SET mid = 0',
    variables: { low, mid: 0, high: '-', 'nums[mid]': nums[0] }
  });
  addLines(3, 3, 2, 3);

  let high = nums.length - 1;
  steps.push({
    array: [...nums],
    low,
    mid,
    high,
    explanation: `Initialize high pointer to the last index (${high}).`,
    pseudoStep: `SET high = nums.length − 1  →  ${high}`,
    variables: { low, mid, high, 'nums[mid]': nums[mid] }
  });
  addLines(4, 4, 2, 4);

  while (mid <= high) {
    steps.push({
      array: [...nums],
      low,
      mid,
      high,
      explanation: `Check loop condition: mid (${mid}) <= high (${high}) is true.`,
      pseudoStep: `WHILE mid <= high  →  ${mid} <= ${high}  →  YES ✓`,
      variables: { low, mid, high, 'nums[mid]': nums[mid] }
    });
    addLines(5, 5, 3, 5);

    steps.push({
      array: [...nums],
      low,
      mid,
      high,
      explanation: `Compare current value nums[mid] (${nums[mid]}) with 0.`,
      pseudoStep: `IF nums[mid] == 0  →  ${nums[mid]} == 0  →  ${nums[mid] === 0 ? 'YES ✓' : 'NO ✗'}`,
      variables: { low, mid, high, 'nums[mid]': nums[mid] }
    });
    addLines(6, 6, 4, 6);

    if (nums[mid] === 0) {
      const prevLowVal = nums[low];
      const prevMidVal = nums[mid];
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      steps.push({
        array: [...nums],
        low,
        mid,
        high,
        explanation: `nums[mid] is 0. Swap nums[low] (${prevLowVal}) and nums[mid] (${prevMidVal}) to move it to the low section.`,
        pseudoStep: `SWAP nums[low], nums[mid]  →  swap index ${low} & ${mid}`,
        variables: { low, mid, high, 'nums[mid]': nums[mid] }
      });
      addLines(7, 7, 5, 7);

      low++;
      steps.push({
        array: [...nums],
        low,
        mid,
        high,
        explanation: `Increment low pointer to ${low}.`,
        pseudoStep: 'low++  (move low boundary right)',
        variables: { low, mid, high, 'nums[mid]': nums[mid] }
      });
      addLines(8, 8, 8, 8);

      mid++;
      steps.push({
        array: [...nums],
        low,
        mid,
        high,
        explanation: `Increment mid pointer to ${mid}.`,
        pseudoStep: 'mid++  (move mid pointer right)',
        variables: { low, mid, high, 'nums[mid]': mid <= high ? nums[mid] : 'done' }
      });
      addLines(9, 9, 9, 9);
    } else {
      steps.push({
        array: [...nums],
        low,
        mid,
        high,
        explanation: `Compare current value nums[mid] (${nums[mid]}) with 1.`,
        pseudoStep: `ELSE IF nums[mid] == 1  →  ${nums[mid]} == 1  →  ${nums[mid] === 1 ? 'YES ✓' : 'NO ✗'}`,
        variables: { low, mid, high, 'nums[mid]': nums[mid] }
      });
      addLines(10, 10, 11, 11);

      if (nums[mid] === 1) {
        mid++;
        steps.push({
          array: [...nums],
          low,
          mid,
          high,
          explanation: `nums[mid] is 1, which belongs in the middle. Just increment mid pointer to ${mid}.`,
          pseudoStep: 'mid++  (value is 1, keep in middle)',
          variables: { low, mid, high, 'nums[mid]': mid <= high ? nums[mid] : 'done' }
        });
        addLines(11, 11, 12, 12);
      } else {
        const prevHighVal = nums[high];
        const prevMidVal = nums[mid];
        [nums[mid], nums[high]] = [nums[high], nums[mid]];
        steps.push({
          array: [...nums],
          low,
          mid,
          high,
          explanation: `nums[mid] is 2. Swap nums[mid] (${prevMidVal}) and nums[high] (${prevHighVal}) to move it to the high section.`,
          pseudoStep: `SWAP nums[mid], nums[high]  →  swap index ${mid} & ${high}`,
          variables: { low, mid, high, 'nums[mid]': nums[mid] }
        });
        addLines(13, 13, 15, 15);

        high--;
        steps.push({
          array: [...nums],
          low,
          mid,
          high,
          explanation: `Decrement high pointer to ${high}. Mid stays current to inspect the swapped value.`,
          pseudoStep: 'high--  (move high boundary left)',
          variables: { low, mid, high, 'nums[mid]': nums[mid] }
        });
        addLines(14, 14, 18, 16);
      }
    }
  }

  steps.push({
    array: [...nums],
    low,
    mid,
    high,
    explanation: 'Algorithm finished. All colors sorted: Red (0), White (1), and Blue (2).',
    pseudoStep: 'RETURN  (sorted)',
    variables: { low, mid, high, 'nums[mid]': 'done' }
  });
  addLines(17, 14, 21, 19);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const DutchNationalFlagVisualization = () => {
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
      }, 1200 / speed);
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

  const getColorClass = (value: number) => {
    switch (value) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-white border-2 border-gray-400';
      case 2: return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

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
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {currentStep.array.map((value, index) => {
                const isLow = index === currentStep.low;
                const isMid = index === currentStep.mid;
                const isHigh = index === currentStep.high;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 relative">
                    <div className="text-xs space-y-0.5 h-8 flex flex-col justify-end items-center">
                      {isLow && <div className="font-semibold text-blue-500">Low</div>}
                      {isMid && <div className="font-semibold text-blue-500">Mid</div>}
                      {isHigh && <div className="font-semibold text-blue-500">High</div>}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${getColorClass(
                        value
                      )} ${isMid ? 'shadow-lg shadow-primary/50 scale-110 ring-4 ring-primary' :
                        isLow || isHigh ? 'scale-105' : ''
                        }`}
                    >
                      <span className={value === 1 ? 'text-gray-800' : 'text-white'}>{value}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">[{index}]</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-muted-foreground text-xs">0 (Red)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-400"></div>
                <span className="text-muted-foreground text-xs">1 (White)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground text-xs">2 (Blue)</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-sm text-foreground">Dutch National Flag Strategy:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Divide the array into three sections: low (0s), mid (1s), and high (2s)</p>
              <p>• Pointers track boundaries: `low` (end of 0s), `mid` (current element), `high` (start of 2s)</p>
              <p>• Swap element at `mid` to its correct region and update boundaries accordingly</p>
              <p>• Time: O(n) · Space: O(1) in-place</p>
            </div>
          </div>

          <VariablePanel
            variables={{
              low: currentStep.low,
              mid: currentStep.mid,
              high: currentStep.high,
              'nums[mid]': currentStep.mid >= 0 && currentStep.mid <= currentStep.high ? currentStep.array[currentStep.mid] : 'done'
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
