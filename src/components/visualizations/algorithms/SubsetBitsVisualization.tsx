import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  nums: number[];
  mask: number;
  i: number;
  bitSet: boolean;
  currentSubset: number[];
  allSubsets: number[][];
  explanation: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const SubsetBitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [1, 2, 3];

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const res: number[][] = [];
    const n = nums.length;

    // Initialization
    s.push({
      nums,
      mask: -1,
      i: -1,
      bitSet: false,
      currentSubset: [],
      allSubsets: [],
      explanation: "Starting subset generation with nums = [1, 2, 3].",
      highlightedLines: [1],
      variables: { nums: "[1, 2, 3]", res: "[]" }
    });

    s.push({
      nums,
      mask: -1,
      i: -1,
      bitSet: false,
      currentSubset: [],
      allSubsets: [],
      explanation: "Initialize an empty array to store results.",
      highlightedLines: [2],
      variables: { nums: "[1, 2, 3]", res: "[]" }
    });

    s.push({
      nums,
      mask: -1,
      i: -1,
      bitSet: false,
      currentSubset: [],
      allSubsets: [],
      explanation: "Get the number of elements: n = 3.",
      highlightedLines: [3],
      variables: { nums: "[1, 2, 3]", res: "[]", n: 3 }
    });

    for (let mask = 0; mask < (1 << n); mask++) {
      const binary = mask.toString(2).padStart(n, '0');
      s.push({
        nums,
        mask,
        i: -1,
        bitSet: false,
        currentSubset: [],
        allSubsets: [...res.map(sub => [...sub])],
        explanation: `Outer loop: mask = ${mask} (${binary} in binary).`,
        highlightedLines: [5],
        variables: { n: 3, mask: `${mask} (${binary})`, res: `size ${res.length}` }
      });

      const subset: number[] = [];
      s.push({
        nums,
        mask,
        i: -1,
        bitSet: false,
        currentSubset: [],
        allSubsets: [...res.map(sub => [...sub])],
        explanation: "Initialize an empty array for the current subset.",
        highlightedLines: [6],
        variables: { mask: `${mask} (${binary})`, subset: "[]" }
      });

      for (let i = 0; i < n; i++) {
        s.push({
          nums,
          mask,
          i,
          bitSet: (mask & (1 << i)) !== 0,
          currentSubset: [...subset],
          allSubsets: [...res.map(sub => [...sub])],
          explanation: `Inner loop: checking bit i = ${i}.`,
          highlightedLines: [8],
          variables: { mask: `${mask} (${binary})`, i, subset: `[${subset.join(', ')}]` }
        });

        const bitIsSet = (mask & (1 << i)) !== 0;
        s.push({
          nums,
          mask,
          i,
          bitSet: bitIsSet,
          currentSubset: [...subset],
          allSubsets: [...res.map(sub => [...sub])],
          explanation: `Checking if bit ${i} is set: (mask & (1 << ${i})) is ${bitIsSet ? 'non-zero' : 'zero'}.`,
          highlightedLines: [9],
          variables: { mask: `${mask} (${binary})`, i, bitIsSet }
        });

        if (bitIsSet) {
          subset.push(nums[i]);
          s.push({
            nums,
            mask,
            i,
            bitSet: true,
            currentSubset: [...subset],
            allSubsets: [...res.map(sub => [...sub])],
            explanation: `Bit ${i} is set. Adding nums[${i}] = ${nums[i]} to the subset.`,
            highlightedLines: [10],
            variables: { mask: `${mask} (${binary})`, i, subset: `[${subset.join(', ')}]` }
          });
        }
      }

      res.push([...subset]);
      s.push({
        nums,
        mask,
        i: -1,
        bitSet: false,
        currentSubset: [...subset],
        allSubsets: [...res.map(sub => [...sub])],
        explanation: `Finished building subset [${subset.join(', ')}]. Adding it to result res.`,
        highlightedLines: [14],
        variables: { mask: `${mask} (${binary})`, res: `size ${res.length}` }
      });
    }

    s.push({
      nums,
      mask: -1,
      i: -1,
      bitSet: false,
      currentSubset: [],
      allSubsets: [...res.map(sub => [...sub])],
      explanation: "Algorithm complete. Returning all subsets.",
      highlightedLines: [17],
      variables: { totalSubsets: res.length }
    });

    return s;
  }, [nums]);

  const code = `function subsets(nums: number[]): number[][] {
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
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Bitmask Status</h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-xl border">
                <span className="text-sm font-medium">Current Mask (Decimal)</span>
                <span className="text-2xl font-bold text-primary">{step.mask === -1 ? 'N/A' : step.mask}</span>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">Binary Representation (Bits for positions 0, 1, 2)</span>
                <div className="flex gap-4 justify-center">
                  {[0, 1, 2].map((bitIdx) => {
                    const isBitActive = step.mask !== -1 && (step.mask & (1 << bitIdx)) !== 0;
                    const isCurrentBitBeingChecked = step.i === bitIdx;
                    return (
                      <div key={bitIdx} className="flex flex-col items-center gap-2">
                        <motion.div
                          animate={{
                            scale: isCurrentBitBeingChecked ? 1.1 : 1,
                            backgroundColor: isCurrentBitBeingChecked
                              ? "var(--accent)"
                              : isBitActive ? "var(--primary)" : "var(--muted)",
                          }}
                          className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-colors ${isBitActive ? "border-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]" : "border-border text-muted-foreground"
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

          <Card className="p-6 bg-card/50 border-primary/20">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Current Working Subset</h3>
            <div className="flex flex-wrap gap-2 min-h-[64px] p-4 bg-muted/20 rounded-xl border border-dashed border-primary/30 items-center justify-center">
              <AnimatePresence mode="popLayout">
                {step.currentSubset.length === 0 ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground italic text-sm">Empty Set (∅)</motion.span>
                ) : (
                  step.currentSubset.map((val) => (
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

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Explanation</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-card/50">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">All Subsets Found ({step.allSubsets.length})</h4>
              <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                {step.allSubsets.map((sub, idx) => (
                  <span key={idx} className="px-2 py-1 bg-muted text-[10px] rounded border border-border/50 font-mono">
                    [{sub.join(', ') || '∅'}]
                  </span>
                ))}
              </div>
            </Card>
            <VariablePanel variables={step.variables} />
          </div>
        </div>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
