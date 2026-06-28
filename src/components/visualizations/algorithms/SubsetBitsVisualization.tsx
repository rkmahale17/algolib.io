import React, { useState, useEffect, useRef } from "react";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface Step {
  nums: number[];
  mask: number;
  i: number;
  bitSet: boolean;
  currentSubset: number[];
  allSubsets: number[][];
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function subsets(nums: number[]): number[][] {
    const res: number[][] = [];
    const n = nums.length;
    for (let mask = 0; mask < (1 << n); mask++) {
        const subset: number[] = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push(nums[i]);
            }
        }
        res.push(subset);
    }
    return res;
}`,
  python: `def subsets(nums):
    res = []
    n = len(nums)
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        res.append(subset)
    return res`,
  java: `public static class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        int n = nums.length;
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {
                    subset.add(nums[i]);
                }
            }
            res.add(subset);
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        int n = nums.size();
        for (int mask = 0; mask < (1 << n); mask++) {
            vector<int> subset;
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {
                    subset.push_back(nums[i]);
                }
            }
            res.push_back(subset);
        }
        return res;
    }
};`
};

export const SubsetBitsVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nums = [1, 2, 3];

  const generateStepsData = () => {
    const steps: Step[] = [];
    const res: number[][] = [];
    const n = nums.length;

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
      nums, mask: -1, i: -1, bitSet: false, currentSubset: [], allSubsets: [],
      explanation: "Starting subset generation with nums = [1, 2, 3].",
      pseudoStep: "CALL subsets(nums = [1, 2, 3])"
    });
    addLines(1, 1, 2, 3);

    steps.push({
      nums, mask: -1, i: -1, bitSet: false, currentSubset: [], allSubsets: [],
      explanation: "Initialize an empty array res to store the subsets.",
      pseudoStep: "SET res = []"
    });
    addLines(2, 2, 3, 4);

    steps.push({
      nums, mask: -1, i: -1, bitSet: false, currentSubset: [], allSubsets: [],
      explanation: "Get the number of elements: n = 3.",
      pseudoStep: "SET n = 3"
    });
    addLines(3, 3, 4, 5);

    for (let mask = 0; mask < (1 << n); mask++) {
      const binary = mask.toString(2).padStart(n, '0');
      steps.push({
        nums, mask, i: -1, bitSet: false, currentSubset: [],
        allSubsets: [...res.map(sub => [...sub])],
        explanation: `Outer loop: mask = ${mask} (${binary} in binary).`,
        pseudoStep: `FOR mask = ${mask} to ${ (1 << n) - 1 }`
      });
      addLines(4, 4, 5, 6);

      const subset: number[] = [];
      steps.push({
        nums, mask, i: -1, bitSet: false, currentSubset: [],
        allSubsets: [...res.map(sub => [...sub])],
        explanation: "Initialize an empty array for the current subset.",
        pseudoStep: "SET subset = []"
      });
      addLines(5, 5, 6, 7);

      for (let i = 0; i < n; i++) {
        steps.push({
          nums, mask, i, bitSet: (mask & (1 << i)) !== 0,
          currentSubset: [...subset], allSubsets: [...res.map(sub => [...sub])],
          explanation: `Inner loop: check if element at index i = ${i} should be included.`,
          pseudoStep: `FOR i = ${i} to ${n - 1}`
        });
        addLines(6, 6, 7, 8);

        const bitIsSet = (mask & (1 << i)) !== 0;
        steps.push({
          nums, mask, i, bitSet: bitIsSet, currentSubset: [...subset],
          allSubsets: [...res.map(sub => [...sub])],
          explanation: `Check if bit ${i} is set in mask: (mask & (1 << ${i})) is ${bitIsSet ? 'non-zero' : 'zero'}.`,
          pseudoStep: `IF mask & (1 << ${i})  →  ${bitIsSet ? 'YES ✓' : 'NO ✗'}`
        });
        addLines(7, 7, 8, 9);

        if (bitIsSet) {
          subset.push(nums[i]);
          steps.push({
            nums, mask, i, bitSet: true, currentSubset: [...subset],
            allSubsets: [...res.map(sub => [...sub])],
            explanation: `Bit ${i} is set. Adding nums[${i}] = ${nums[i]} to the subset.`,
            pseudoStep: `ADD nums[${i}] (${nums[i]}) to subset`
          });
          addLines(8, 8, 9, 10);
        }
      }

      res.push([...subset]);
      steps.push({
        nums, mask, i: -1, bitSet: false, currentSubset: [...subset],
        allSubsets: [...res.map(sub => [...sub])],
        explanation: `Finished building subset [${subset.join(', ')}]. Adding it to result res.`,
        pseudoStep: `ADD subset copy to res  →  res.push([${subset.join(', ')}])`
      });
      addLines(11, 9, 12, 13);
    }

    steps.push({
      nums, mask: -1, i: -1, bitSet: false, currentSubset: [],
      allSubsets: [...res.map(sub => [...sub])],
      explanation: "Algorithm complete. Returning all subsets.",
      pseudoStep: "RETURN res"
    });
    addLines(13, 10, 14, 15);

    const lastStep = steps[steps.length - 1];
    steps.push({
      ...lastStep,
      explanation: "Algorithm Complete!",
      pseudoStep: "DONE"
    });
    addLines(13, 10, 14, 15);

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
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Bitmask Status</h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-xl border">
                <span className="text-sm font-medium text-foreground">Current Mask (Decimal)</span>
                <span className="text-2xl font-bold text-primary">{currentStep.mask === -1 ? 'N/A' : currentStep.mask}</span>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">Binary Representation (Bits for positions 0, 1, 2)</span>
                <div className="flex gap-4 justify-center">
                  {[0, 1, 2].map((bitIdx) => {
                    const isBitActive = currentStep.mask !== -1 && (currentStep.mask & (1 << bitIdx)) !== 0;
                    const isCurrentBitBeingChecked = currentStep.i === bitIdx;
                    return (
                      <div key={bitIdx} className="flex flex-col items-center gap-2">
                        <motion.div
                          animate={{
                            scale: isCurrentBitBeingChecked ? 1.1 : 1,
                            backgroundColor: isCurrentBitBeingChecked
                              ? "var(--accent)"
                              : isBitActive ? "var(--primary)" : "var(--muted)",
                          }}
                          className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-colors ${
                            isBitActive
                              ? "border-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          <span className="text-2xl font-bold">{isBitActive ? '1' : '0'}</span>
                        </motion.div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Bit {bitIdx}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 border shadow-sm">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Current Working Subset</h3>
            <div className="flex flex-wrap gap-2 min-h-[64px] p-4 bg-muted/20 rounded-xl border border-dashed border-primary/30 items-center justify-center">
              <AnimatePresence mode="popLayout">
                {currentStep.currentSubset.length === 0 ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground italic text-sm">Empty Set (∅)</motion.span>
                ) : (
                  currentStep.currentSubset.map((val) => (
                    <motion.div
                      key={val}
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="w-12 h-12 bg-primary/20 text-primary border-2 border-primary/50 rounded-lg flex items-center justify-center font-bold shadow-sm"
                    >
                      {val}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </Card>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{currentStep.explanation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-card border border-border rounded-xl">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">All Subsets Found ({currentStep.allSubsets.length})</h3>
              <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                {currentStep.allSubsets.map((sub, idx) => (
                  <span key={idx} className="px-2 py-1 bg-muted text-[10px] rounded border border-border/50 font-mono text-foreground">
                    [{sub.join(', ') || '∅'}]
                  </span>
                ))}
              </div>
            </div>
            <VariablePanel
              variables={{
                nums: currentStep.nums,
                mask: currentStep.mask === -1 ? "None" : `${currentStep.mask} (binary: ${currentStep.mask.toString(2).padStart(currentStep.nums.length, '0')})`,
                i: currentStep.i === -1 ? "None" : currentStep.i,
                "bit set": currentStep.i === -1 ? "None" : (currentStep.bitSet ? "true" : "false"),
                "current subset": currentStep.currentSubset,
              }}
            />
          </div>
        </div>

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
