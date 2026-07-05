import React, { useState, useEffect, useRef } from "react";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface Step {
  nums: number[];
  l: number;
  r: number;
  p: number;
  i: number;
  pivot: number | null;
  explanation: string;
  variables: Record<string, any>;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function findKthLargest(nums: number[], k: number): number {
    k = nums.length - k;
    function quickSelect(l: number, r: number): number {
        const pivot = nums[r];
        let p = l;
        for (let i = l; i < r; i++) {
            if (nums[i] <= pivot) {
                [nums[p], nums[i]] = [nums[i], nums[p]];
                p++;
            }
        }
        [nums[p], nums[r]] = [nums[r], nums[p]];
        if (p > k) {
            return quickSelect(l, p - 1);
        } else if (p < k) {
            return quickSelect(p + 1, r);
        } else {
            return nums[p];
        }
    }
    return quickSelect(0, nums.length - 1);
}`,
  python: `def findKthLargest(nums: list[int], k: int) -> int:
    k = len(nums) - k
    def quickSelect(l: int, r: int) -> int:
        pivot = nums[r]
        p = l
        for i in range(l, r):
            if nums[i] <= pivot:
                nums[p], nums[i] = nums[i], nums[p]
                p += 1
        nums[p], nums[r] = nums[r], nums[p]
        if p > k:
            return quickSelect(l, p - 1)
        elif p < k:
            return quickSelect(p + 1, r)
        else:
            return nums[p]
    return quickSelect(0, len(nums) - 1)`,
  java: `public static class Solution {
    public int findKthLargest(int[] nums, int k) {
        k = nums.length - k;
        return quickSelect(nums, 0, nums.length - 1, k);
    }
    private int quickSelect(int[] nums, int l, int r, int k) {
        int pivot = nums[r];
        int p = l;
        for (int i = l; i < r; i++) {
            if (nums[i] <= pivot) {
                swap(nums, p, i);
                p++;
            }
        }
        swap(nums, p, r);
        if (p > k) {
            return quickSelect(nums, l, p - 1, k);
        } else if (p < k) {
            return quickSelect(nums, p + 1, r, k);
        } else {
            return nums[p];
        }
    }
    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}`,
  cpp: `class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        k = nums.size() - k;
        return quickSelect(nums, 0, nums.size() - 1, k);
    }
private:
    int quickSelect(vector<int>& nums, int l, int r, int k) {
        int pivot = nums[r];
        int p = l;
        for (int i = l; i < r; i++) {
            if (nums[i] <= pivot) {
                swap(nums[p], nums[i]);
                p++;
            }
        }
        swap(nums[p], nums[r]);
        if (p > k) {
            return quickSelect(nums, l, p - 1, k);
        }
        else if (p < k) {
            return quickSelect(nums, p + 1, r, k);
        }
        else {
            return nums[p];
        }
    }
};`
};

export const KthLargestVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initialNums = [3, 2, 1, 5, 6, 4];
  const targetK = 2;

  const generateStepsData = () => {
    const steps: Step[] = [];
    const nums = [...initialNums];
    const n = nums.length;
    let k = n - targetK;

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
      nums: [...nums], l: -1, r: -1, p: -1, i: -1, pivot: null,
      explanation: `Starting findKthLargest with k = ${targetK}.`,
      variables: { nums: `[${nums.join(', ')}]`, k: targetK },
      pseudoStep: `CALL findKthLargest(nums, k = ${targetK})`
    });
    addLines(1, 1, 2, 3);

    steps.push({
      nums: [...nums], l: -1, r: -1, p: -1, i: -1, pivot: null,
      explanation: `Transform k to index: k = ${n} - ${targetK} = ${k}. We need the element at index ${k} in a sorted array.`,
      variables: { targetIndex: k },
      pseudoStep: `SET k = nums.length - k  →  ${k}`
    });
    addLines(2, 2, 3, 4);

    steps.push({
      nums: [...nums], l: -1, r: -1, p: -1, i: -1, pivot: null,
      explanation: `Calling quickSelect(0, ${n - 1}) to find the element at index ${k}.`,
      variables: { l: 0, r: n - 1, targetIndex: k },
      pseudoStep: `CALL quickSelect(l = 0, r = ${n - 1})`
    });
    addLines(21, 17, 4, 5);

    const quickSelect = (l: number, r: number) => {
      steps.push({
        nums: [...nums], l, r, p: -1, i: -1, pivot: null,
        explanation: `Entering quickSelect(l = ${l}, r = ${r}).`,
        variables: { l, r, targetIndex: k },
        pseudoStep: `CALL quickSelect(l = ${l}, r = ${r})`
      });
      addLines(3, 3, 6, 8);

      const pivot = nums[r];
      steps.push({
        nums: [...nums], l, r, p: -1, i: -1, pivot,
        explanation: `Chosen pivot: nums[r] = ${pivot}.`,
        variables: { pivot, r },
        pseudoStep: `SET pivot = nums[r]  →  ${pivot}`
      });
      addLines(4, 4, 7, 9);

      let p = l;
      steps.push({
        nums: [...nums], l, r, p, i: -1, pivot,
        explanation: `Initializing partition pointer p = ${l}.`,
        variables: { p, l },
        pseudoStep: `SET p = l  →  ${l}`
      });
      addLines(5, 5, 8, 10);

      for (let i = l; i < r; i++) {
        steps.push({
          nums: [...nums], l, r, p, i, pivot,
          explanation: `Checking loop condition: i = ${i} < r = ${r}.`,
          variables: { i, r, p },
          pseudoStep: `FOR i = ${i} to ${r - 1}`
        });
        addLines(6, 6, 9, 11);

        steps.push({
          nums: [...nums], l, r, p, i, pivot,
          explanation: `Is nums[i] (${nums[i]}) <= pivot (${pivot})?`,
          variables: { "nums[i]": nums[i], pivot },
          pseudoStep: `IF nums[i] <= pivot  →  ${nums[i]} <= ${pivot} ?`
        });
        addLines(7, 7, 10, 12);

        if (nums[i] <= pivot) {
          const valI = nums[i];
          const valP = nums[p];
          [nums[p], nums[i]] = [nums[i], nums[p]];

          steps.push({
            nums: [...nums], l, r, p, i, pivot,
            explanation: `Yes, swap nums[p] (${valP}) and nums[i] (${valI}).`,
            variables: { p, i, "nums[p]": valI, "nums[i]": valP },
            pseudoStep: `SWAP nums[p], nums[i]  →  swap(${valP}, ${valI})`
          });
          addLines(8, 8, 11, 13);

          p++;
          steps.push({
            nums: [...nums], l, r, p, i, pivot,
            explanation: `Increment p to ${p}.`,
            variables: { p },
            pseudoStep: `SET p = p + 1  →  ${p}`
          });
          addLines(9, 9, 12, 14);
        }
      }

      const valP = nums[p];
      const valR = nums[r];
      [nums[p], nums[r]] = [nums[r], nums[p]];
      steps.push({
        nums: [...nums], l, r, p, i: -1, pivot,
        explanation: `Loop end. Swap pivot nums[r] (${valR}) with nums[p] (${valP}). Pivot is now at index ${p}.`,
        variables: { p, r, pivotPlacement: `nums[${p}] = ${valR}` },
        pseudoStep: `SWAP nums[p], nums[r]  →  swap(${valP}, ${valR})`
      });
      addLines(12, 10, 15, 17);

      steps.push({
        nums: [...nums], l, r, p, i: -1, pivot,
        explanation: `Comparing pivot index p (${p}) with target k (${k}).`,
        variables: { p, k },
        pseudoStep: `IF p > k  →  ${p} > ${k} ?`
      });
      addLines(13, 11, 16, 18);

      if (p > k) {
        steps.push({
          nums: [...nums], l, r, p, i: -1, pivot,
          explanation: `p (${p}) > k (${k}). Element is in the left subarray.`,
          variables: { nextRange: `[${l}, ${p - 1}]` },
          pseudoStep: `CALL quickSelect(l = ${l}, r = ${p - 1})`
        });
        addLines(14, 12, 17, 19);
        quickSelect(l, p - 1);
      } else if (p < k) {
        steps.push({
          nums: [...nums], l, r, p, i: -1, pivot,
          explanation: `p (${p}) < k (${k}). Element is in the right subarray.`,
          variables: { nextRange: `[${p + 1}, ${r}]` },
          pseudoStep: `CALL quickSelect(l = ${p + 1}, r = ${r})`
        });
        addLines(16, 14, 19, 22);
        quickSelect(p + 1, r);
      } else {
        steps.push({
          nums: [...nums], l, r, p, i: -1, pivot,
          explanation: `p (${p}) === k (${k}). Found the element!`,
          variables: { result: nums[p] },
          pseudoStep: `RETURN nums[p]  →  ${nums[p]}`
        });
        addLines(18, 16, 21, 25);
      }
    };

    quickSelect(0, n - 1);

    const lastStep = steps[steps.length - 1];
    steps.push({
      ...lastStep,
      explanation: "Algorithm Complete!",
      pseudoStep: "DONE"
    });
    addLines(18, 16, 21, 25);

    return { steps, stepLineNumbers };
  };

  const { steps, stepLineNumbers } = generateStepsData();

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
        speed={speed}
        onSpeedChange={setSpeed}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6 bg-card/50 border shadow-sm">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wider">Visual Partitioning</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <AnimatePresence mode="popLayout">
                {currentStep.nums.map((num, idx) => {
                  const isPivot = idx === currentStep.r && currentStep.i === -1;
                  const isCurrentPivot = num === currentStep.pivot && idx === currentStep.p;
                  const isP = idx === currentStep.p;
                  const isI = idx === currentStep.i;
                  const inRange = idx >= currentStep.l && idx <= currentStep.r;
                  const targetMatch = idx === (initialNums.length - targetK) && currentStepIndex === steps.length - 2;

                  return (
                    <motion.div
                      key={`${idx}-${num}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: inRange || currentStep.l === -1 ? 1 : 0.4,
                        scale: isI || isP || targetMatch ? 1.1 : 1,
                        backgroundColor: targetMatch
                          ? "#22c55e"
                          : isP
                          ? "#22c55e"
                          : isI
                          ? "#a855f7"
                          : isPivot
                          ? "hsl(var(--primary))"
                          : "var(--card)",
                        borderColor: isPivot || isCurrentPivot ? "hsl(var(--primary))" : "var(--border)"
                      }}
                      className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center border-2 transition-all relative ${
                        isP || isI || targetMatch || isPivot
                          ? "shadow-lg z-10 text-white font-bold"
                          : "text-foreground"
                      }`}
                    >
                      <span className="text-xs font-bold">{num}</span>
                      <div className="absolute -bottom-6 flex flex-col items-center">
                        {isP && <span className="text-[10px] font-black text-white uppercase bg-green-500 w-4 h-4 rounded-full flex items-center justify-center shadow-sm">p</span>}
                        {isI && <span className="text-[10px] font-black text-white uppercase bg-purple-500 w-4 h-4 rounded-full flex items-center justify-center shadow-sm">i</span>}
                        {targetMatch && <span className="text-[10px] font-black text-white uppercase bg-amber-500 px-1.5 h-4 rounded-full flex items-center justify-center shadow-sm whitespace-nowrap">★ K</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-muted/30 rounded-lg border flex flex-col items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Pivot</span>
                <span className="text-xl font-bold text-primary">{currentStep.pivot !== null ? currentStep.pivot : "-"}</span>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border flex flex-col items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Target Index</span>
                <span className="text-xl font-bold text-foreground">{initialNums.length - targetK}</span>
              </div>
            </div>
          </Card>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{currentStep.explanation}</p>
          </div>

          <Card className="p-4 bg-muted/20 border-dashed border-border text-[10px] text-muted-foreground space-y-1">
            <p>• <span className="text-green-600 dark:text-green-400 font-bold">p pointer</span>: Elements to the left of p are guaranteed to be ≤ pivot.</p>
            <p>• <span className="text-purple-600 dark:text-purple-400 font-bold">i pointer</span>: Currently scanning element at this index.</p>
            <p>• <span className="text-primary font-bold">Pivot</span>: Element used to partition the array.</p>
          </Card>
        </div>

        {/* Right Column: Code Display and Variables */}
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
