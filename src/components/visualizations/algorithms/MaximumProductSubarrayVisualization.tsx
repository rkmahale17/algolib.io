import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { Card } from '@/components/ui/card';
import { Zap, Info, Hash } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  i: number;
  maxProduct: number;
  currentMax: number;
  currentMin: number;
  tempMax?: number;
  message: string;
  curMaxRange: [number, number]; // [start, end]
  bestRange: [number, number]; // [start, end]
  phase: 'init' | 'prep' | 'update-max' | 'update-min' | 'update-global' | 'done';
  isRecordUpdate: boolean;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function maxProduct(nums: number[]): number {
    if (nums.length === 0) return 0;
    let maxProduct = nums[0];
    let currentMax = nums[0];
    let currentMin = nums[0];
    for (let i = 1; i < nums.length; i++) {
        const num = nums[i];
        const tempMax = currentMax;
        currentMax = Math.max(
            num,
            num * currentMax,
            num * currentMin
        );
        currentMin = Math.min(
            num,
            num * tempMax,
            num * currentMin
        );
        maxProduct = Math.max(maxProduct, currentMax);
    }
    return maxProduct;
}`,
  python: `def maxProduct(nums: List[int]) -> int:
    max_product = nums[0]
    current_max = nums[0]
    current_min = nums[0]
    for i in range(1, len(nums)):
        num = nums[i]
        temp_max = current_max
        current_max = max(num, num * current_max, num * current_min)
        current_min = min(num, num * temp_max, num * current_min)
        max_product = max(max_product, current_max)
    return max_product`,
  java: `public static class Solution {
    public int maxProduct(int[] nums) {
        int maxProduct = nums[0];
        int currentMax = nums[0];
        int currentMin = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int num = nums[i];
            int tempMax = currentMax;
            currentMax = Math.max(num, Math.max(num * currentMax, num * currentMin));
            currentMin = Math.min(num, Math.min(num * tempMax, num * currentMin));
            maxProduct = Math.max(maxProduct, currentMax);
        }
        return maxProduct;
    }
}`,
  cpp: `class Solution{
public:
        int maxProduct(vector<int>& nums) {
            int maxProduct = nums[0];
            int currentMax = nums[0];
            int currentMin = nums[0];
            for (int i = 1; i < nums.size(); i++) {
                int num = nums[i];
                int tempMax = currentMax;
                currentMax = max({num, num * currentMax, num * currentMin});
                currentMin = min({num, num * tempMax, num * currentMin});
                maxProduct = max(maxProduct, currentMax);
            }
            return maxProduct;
        }
};`
};

export const MaximumProductSubarrayVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const stepsData = useMemo(() => {
    const nums = [2, 3, -2, 4, -1];
    const s: Step[] = [];
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

    let maxProduct = nums[0];
    let currentMax = nums[0];
    let currentMin = nums[0];
    let curMaxStart = 0;
    let curMinStartActual = 0;
    let bestStart = 0;
    let bestEnd = 0;

    s.push({
      array: [...nums],
      i: 0,
      maxProduct,
      currentMax,
      currentMin,
      message: `Step 1: Initialization. We start with the first element (${nums[0]}) as our initial max product, current max, and current min.`,
      curMaxRange: [0, 0],
      bestRange: [0, 0],
      phase: 'init',
      isRecordUpdate: false,
      pseudoStep: `SET maxProduct = ${nums[0]}, currentMax = ${nums[0]}, currentMin = ${nums[0]}`
    });
    addLines(3, 2, 3, 4);

    for (let i = 1; i < nums.length; i++) {
      const num = nums[i];
      const tempMax = currentMax;

      s.push({
        array: [...nums],
        i,
        maxProduct,
        currentMax,
        currentMin,
        tempMax,
        message: `i = ${i}: We pick ${num} and store our currentMax (${tempMax}) in 'tempMax'.`,
        curMaxRange: [curMaxStart, i - 1],
        bestRange: [bestStart, bestEnd],
        phase: 'prep',
        isRecordUpdate: false,
        pseudoStep: `SET tempMax = ${tempMax}`
      });
      addLines(8, 7, 8, 9);

      const oldMax = currentMax;
      const oldMin = currentMin;
      currentMax = Math.max(num, num * oldMax, num * oldMin);
      
      if (currentMax === num) curMaxStart = i;
      else if (currentMax === num * oldMin) curMaxStart = curMinStartActual;

      s.push({
        array: [...nums],
        i,
        maxProduct,
        currentMax,
        currentMin: oldMin,
        tempMax,
        message: `Update currentMax: max(num, num * currentMax, num * currentMin) = ${currentMax}.`,
        curMaxRange: [curMaxStart, i],
        bestRange: [bestStart, bestEnd],
        phase: 'update-max',
        isRecordUpdate: false,
        pseudoStep: `SET currentMax = Math.max(${num}, ${num * oldMax}, ${num * oldMin})`
      });
      addLines(9, 8, 9, 10);

      currentMin = Math.min(num, num * tempMax, num * oldMin);
      if (currentMin === num) curMinStartActual = i;
      else if (currentMin === num * tempMax) curMinStartActual = curMaxStart; 
      
      s.push({
        array: [...nums],
        i,
        maxProduct,
        currentMax,
        currentMin,
        tempMax,
        message: `Update currentMin: min(num, num * tempMax, num * currentMin) = ${currentMin}.`,
        curMaxRange: [curMaxStart, i],
        bestRange: [bestStart, bestEnd],
        phase: 'update-min',
        isRecordUpdate: false,
        pseudoStep: `SET currentMin = Math.min(${num}, ${num * tempMax}, ${num * oldMin})`
      });
      addLines(14, 9, 10, 11);

      if (currentMax > maxProduct) {
        maxProduct = currentMax;
        bestStart = curMaxStart;
        bestEnd = i;
        s.push({
          array: [...nums],
          i,
          maxProduct,
          currentMax,
          currentMin,
          tempMax,
          message: `🔥 New global maximum found! Updating maxProduct to ${maxProduct}.`,
          curMaxRange: [curMaxStart, i],
          bestRange: [bestStart, bestEnd],
          phase: 'update-global',
          isRecordUpdate: true,
          pseudoStep: `SET maxProduct = Math.max(${maxProduct}, ${currentMax})`
        });
        addLines(19, 10, 11, 12);
      }
    }

    s.push({
      array: [...nums],
      i: nums.length,
      maxProduct,
      currentMax,
      currentMin,
      message: `Final result: The maximum product found is ${maxProduct}.`,
      curMaxRange: [-1, -1],
      bestRange: [bestStart, bestEnd],
      phase: 'done',
      isRecordUpdate: false,
      pseudoStep: `RETURN maxProduct  →  ${maxProduct}`
    });
    addLines(21, 11, 13, 14);

    return { steps: s, stepLineNumbers };
  }, []);

  const { steps, stepLineNumbers } = stepsData;
  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[420px] flex flex-col shadow-lg shadow-primary/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3 text-primary" />
                  Visualizing Product Extremes
                </h3>
              </div>

              <div className="flex-1 flex justify-center items-center pb-8">
                <div className="relative flex justify-center items-center gap-4">
                  <div className="flex items-center gap-3 relative z-10">
                    <AnimatePresence mode="popLayout">
                      {currentStep.array.map((value, index) => {
                        const isCurrent = index === currentStep.i;
                        const isInBestRange = index >= currentStep.bestRange[0] && index <= currentStep.bestRange[1];
                        const maxVal = Math.max(...currentStep.array.map(Math.abs), 1);
                        const normalizedHeight = (Math.abs(value) / maxVal) * 50 + 20;

                        return (
                          <div key={index} className="flex flex-col items-center w-12 relative group">
                            <div className="h-16 flex items-end justify-center mb-2">
                              {value >= 0 && (
                                <motion.div
                                  className={`w-6 rounded-t-lg transition-colors duration-300 ${isCurrent ? 'bg-primary' : 'bg-blue-500/20'}`}
                                  animate={{ height: normalizedHeight }}
                                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                />
                              )}
                            </div>
                            <motion.div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 z-30 transition-all duration-300 ${
                                isCurrent
                                  ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-xl shadow-primary/30'
                                  : 'bg-muted/50 border-border text-foreground hover:bg-muted'
                              }`}
                              animate={{
                                scale: isCurrent ? 1.1 : 1,
                                borderColor: isInBestRange ? 'var(--primary)' : 'rgba(148, 163, 184, 0.3)'
                              }}
                            >
                              {value}
                            </motion.div>
                            <div className="h-16 flex items-start justify-center mt-2">
                              {value < 0 && (
                                <motion.div
                                  className={`w-6 rounded-b-lg transition-colors duration-300 ${isCurrent ? 'bg-primary' : 'bg-red-500/20'}`}
                                  animate={{ height: normalizedHeight }}
                                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                />
                              )}
                            </div>
                            <div className="mt-2 text-[9px] font-mono font-bold text-muted-foreground uppercase opacity-60">
                              IDX {index}
                            </div>
                          </div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-auto pt-6 border-t border-border/40">
                <div className="flex flex-col items-center p-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <span className="text-[9px] font-bold text-blue-600 uppercase mb-1">currentMax</span>
                  <span className="text-base font-black text-blue-600 font-mono">{currentStep.currentMax}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-orange-500/5 border border-orange-500/10">
                  <span className="text-[9px] font-bold text-orange-600 uppercase mb-1">currentMin</span>
                  <span className="text-base font-black text-orange-600 font-mono">{currentStep.currentMin}</span>
                </div>
                <motion.div 
                  className={`flex flex-col items-center p-2 rounded-xl border-2 ${currentStep.isRecordUpdate ? 'bg-primary/10 border-primary' : 'bg-primary/5 border-primary/20'}`}
                >
                  <span className="text-[9px] font-bold text-primary uppercase mb-1 flex items-center gap-1">
                    <Hash className="w-2 h-2" /> Global Best
                  </span>
                  <span className="text-base font-black font-mono text-primary">
                    {currentStep.maxProduct}
                  </span>
                </motion.div>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm font-medium leading-relaxed min-h-[40px]">{currentStep.message}</p>
            </Card>
            <VariablePanel
              variables={{
                index_i: currentStep.i >= currentStep.array.length ? 'N/A' : currentStep.i,
                value_n: currentStep.i >= currentStep.array.length ? 'N/A' : currentStep.array[currentStep.i],
                maxProd: currentStep.maxProduct,
                'tempMax': currentStep.tempMax ?? 'N/A',
                curMax: currentStep.currentMax,
                curMin: currentStep.currentMin,
              }}
            />
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex gap-3">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                <strong>The Negative insight:</strong> A negative number multiplied by a large negative value can suddenly become our new maximum.
              </p>
            </div>
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
      }
    />
  );
};
