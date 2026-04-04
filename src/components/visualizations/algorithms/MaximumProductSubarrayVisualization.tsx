import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { Card } from '@/components/ui/card';
import { Zap, Info, Hash, Target } from 'lucide-react';

interface Step {
  array: number[];
  i: number;
  maxProduct: number;
  currentMax: number;
  currentMin: number;
  tempMax?: number;
  message: string;
  lineNumber: number;
  curMaxRange: [number, number]; // [start, end]
  bestRange: [number, number]; // [start, end]
  phase: 'init' | 'prep' | 'update-max' | 'update-min' | 'update-global' | 'done';
  isRecordUpdate: boolean;
}

export const MaximumProductSubarrayVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function maxProduct(nums: number[]): number {
  if (nums.length === 0) return 0;
  let maxProduct = nums[0];
  let currentMax = nums[0];
  let currentMin = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const tempMax = currentMax;

    currentMax = Math.max(num, num * currentMax, num * currentMin);
    currentMin = Math.min(num, num * tempMax, num * currentMin);

    maxProduct = Math.max(maxProduct, currentMax);
  }

  return maxProduct;
}`;

  const steps: Step[] = useMemo(() => {
    const nums = [2, 3, -2, 4, -1];
    const s: Step[] = [];

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
      lineNumber: 3,
      curMaxRange: [0, 0],
      bestRange: [0, 0],
      phase: 'init',
      isRecordUpdate: false
    });

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
          lineNumber: 9,
          curMaxRange: [curMaxStart, i - 1],
          bestRange: [bestStart, bestEnd],
          phase: 'prep',
          isRecordUpdate: false
        });

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
          lineNumber: 11,
          curMaxRange: [curMaxStart, i],
          bestRange: [bestStart, bestEnd],
          phase: 'update-max',
          isRecordUpdate: false
        });

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
          lineNumber: 12,
          curMaxRange: [curMaxStart, i],
          bestRange: [bestStart, bestEnd],
          phase: 'update-min',
          isRecordUpdate: false
        });

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
            lineNumber: 14,
            curMaxRange: [curMaxStart, i],
            bestRange: [bestStart, bestEnd],
            phase: 'update-global',
            isRecordUpdate: true
          });
        }
    }

    s.push({
      array: [...nums],
      i: nums.length,
      maxProduct,
      currentMax,
      currentMin,
      message: `Final result: The maximum product found is ${maxProduct}.`,
      lineNumber: 17,
      curMaxRange: [-1, -1],
      bestRange: [bestStart, bestEnd],
      phase: 'done',
      isRecordUpdate: false
    });

    return s;
  }, []);

  const currentStep = steps[currentStepIndex] || steps[0];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-8">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[480px] flex flex-col shadow-lg shadow-primary/5">
            <div className="flex justify-between items-center mb-12">
               <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary" />
                Visualizing Product Extremes
              </h3>
            </div>

            <div className="flex-1 flex justify-center items-center pb-12">
               <div className="relative flex justify-center items-center gap-4">
                  <div className="flex items-center gap-4 relative z-10">
                    <AnimatePresence mode="popLayout">
                      {currentStep.array.map((value, index) => {
                        const isCurrent = index === currentStep.i;
                        const isInBestRange = index >= currentStep.bestRange[0] && index <= currentStep.bestRange[1];
                        const maxVal = Math.max(...currentStep.array.map(Math.abs), 1);
                        const normalizedHeight = (Math.abs(value) / maxVal) * 60 + 20;

                        return (
                          <div key={index} className="flex flex-col items-center w-12 relative group">
                            <div className="h-20 flex items-end justify-center mb-2">
                               {value >= 0 && (
                                  <motion.div
                                    className={`w-8 rounded-t-lg transition-colors duration-300 ${isCurrent ? 'bg-primary' : 'bg-blue-500/20'}`}
                                    animate={{ height: normalizedHeight }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                  />
                               )}
                            </div>
                            <motion.div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border-2 z-30 transition-all duration-300 ${
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
                            <div className="h-20 flex items-start justify-center mt-2">
                               {value < 0 && (
                                  <motion.div
                                    className={`w-8 rounded-b-lg transition-colors duration-300 ${isCurrent ? 'bg-primary' : 'bg-red-500/20'}`}
                                    animate={{ height: normalizedHeight }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                  />
                               )}
                            </div>
                            <div className="mt-4 text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                              IDX {index}
                            </div>
                          </div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-auto pt-8 border-t border-border/40">
              <div className="flex flex-col items-center p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <span className="text-[10px] font-bold text-blue-600 uppercase mb-1">currentMax</span>
                <span className="text-xl font-black text-blue-600 font-mono">{currentStep.currentMax}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <span className="text-[10px] font-bold text-orange-600 uppercase mb-1">currentMin</span>
                <span className="text-xl font-black text-orange-600 font-mono">{currentStep.currentMin}</span>
              </div>
              <motion.div 
                className={`flex flex-col items-center p-3 rounded-xl border-2 ${currentStep.isRecordUpdate ? 'bg-primary/10 border-primary' : 'bg-primary/5 border-primary/20'}`}
              >
                <span className="text-[10px] font-bold text-primary uppercase mb-1 flex items-center gap-1">
                   <Hash className="w-2 h-2" /> Global Best
                </span>
                <span className="text-xl font-black font-mono text-primary">
                  {currentStep.maxProduct}
                </span>
              </motion.div>
            </div>
          </Card>

          <Card className="p-6 bg-accent/30 border-l-4 border-primary relative overflow-hidden transition-all duration-300 shadow-sm flex items-center">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                <motion.div
                  animate={currentStep.isRecordUpdate ? { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] } : {}}
                >
                  {currentStep.isRecordUpdate ? '🚀' : (currentStep.phase === 'prep' ? '🔍' : '💡')}
                </motion.div>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/80">
                  Step Insight
                </h4>
                <p className="text-[15px] font-medium leading-relaxed text-foreground/90">
                  {currentStep.message}
                </p>
              </div>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={[currentStep.lineNumber]}
          />
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
