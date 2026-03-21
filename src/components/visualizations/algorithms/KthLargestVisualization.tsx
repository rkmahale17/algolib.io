import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  nums: number[];
  l: number;
  r: number;
  p: number;
  i: number;
  k: number;
  pivot: number | null;
  explanation: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const KthLargestVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const initialNums = [3, 2, 1, 5, 6, 4];
  const targetK = 2;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const nums = [...initialNums];
    const n = nums.length;
    let k = n - targetK;

    s.push({
      nums: [...nums],
      l: -1, r: -1, p: -1, i: -1, k: targetK, pivot: null,
      explanation: `Starting findKthLargest with k = ${targetK}.`,
      highlightedLines: [1],
      variables: { nums: `[${nums.join(', ')}]`, k: targetK }
    });

    s.push({
      nums: [...nums],
      l: -1, r: -1, p: -1, i: -1, k: targetK, pivot: null,
      explanation: `Transform k to index: k = ${n} - ${targetK} = ${k}. We need the element at index ${k} in a sorted array.`,
      highlightedLines: [2],
      variables: { nums: `[${nums.join(', ')}]`, targetIndex: k }
    });

    const quickSelect = (l: number, r: number) => {
      s.push({
        nums: [...nums],
        l, r, p: -1, i: -1, k, pivot: null,
        explanation: `Calling quickSelect(l=${l}, r=${r}).`,
        highlightedLines: [4, 26],
        variables: { l, r, targetIndex: k }
      });

      const pivot = nums[r];
      let p = l;

      s.push({
        nums: [...nums],
        l, r, p: -1, i: -1, k, pivot,
        explanation: `Chosen pivot: nums[r] = ${pivot}. Initializing partition pointer p = ${l}.`,
        highlightedLines: [5, 6],
        variables: { l, r, pivot, p }
      });

      for (let i = l; i < r; i++) {
        s.push({
          nums: [...nums],
          l, r, p, i, k, pivot,
          explanation: `Checking loop condition: i = ${i} < r = ${r}.`,
          highlightedLines: [8],
          variables: { i, p, pivot }
        });

        s.push({
          nums: [...nums],
          l, r, p, i, k, pivot,
          explanation: `Is nums[i] (${nums[i]}) <= pivot (${pivot})?`,
          highlightedLines: [9],
          variables: { i, "nums[i]": nums[i], pivot }
        });

        if (nums[i] <= pivot) {
          const temp = nums[p];
          nums[p] = nums[i];
          nums[i] = temp;

          s.push({
            nums: [...nums],
            l, r, p, i, k, pivot,
            explanation: `Yes, swap nums[p] and nums[i].`,
            highlightedLines: [10],
            variables: { i, p, swapped: `(${nums[p]}, ${nums[i]})` }
          });

          p++;
          s.push({
            nums: [...nums],
            l, r, p, i, k, pivot,
            explanation: `Increment p to ${p}.`,
            highlightedLines: [11],
            variables: { p }
          });
        }
      }

      const temp = nums[p];
      nums[p] = nums[r];
      nums[r] = temp;

      s.push({
        nums: [...nums],
        l, r, p, i: r, k, pivot,
        explanation: `Loop end. Swap pivot nums[r] with nums[p]. Pivot ${pivot} is now at index ${p}.`,
        highlightedLines: [15],
        variables: { p, pivotPlacement: `nums[${p}] = ${pivot}` }
      });

      s.push({
        nums: [...nums],
        l, r, p, i: -1, k, pivot,
        explanation: `Is pivot index p (${p}) equal to target index k (${k})?`,
        highlightedLines: [17, 19, 21],
        variables: { p, k }
      });

      if (p > k) {
        s.push({
          nums: [...nums],
          l, r, p, i: -1, k, pivot,
          explanation: `p (${p}) > k (${k}). Searching in the left subarray.`,
          highlightedLines: [18],
          variables: { nextRange: `[${l}, ${p - 1}]` }
        });
        quickSelect(l, p - 1);
      } else if (p < k) {
        s.push({
          nums: [...nums],
          l, r, p, i: -1, k, pivot,
          explanation: `p (${p}) < k (${k}). Searching in the right subarray.`,
          highlightedLines: [20],
          variables: { nextRange: `[${p + 1}, ${r}]` }
        });
        quickSelect(p + 1, r);
      } else {
        s.push({
          nums: [...nums],
          l, r, p, i: -1, k, pivot,
          explanation: `p (${p}) === k (${k}). We found the element!`,
          highlightedLines: [22],
          variables: { result: nums[p] }
        });
      }
    };

    quickSelect(0, n - 1);

    return s;
  }, [initialNums, targetK]);

  const code = `function findKthLargest(nums: number[], k: number): number {
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
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wider">Visual Partitioning</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <AnimatePresence mode="popLayout">
                {step.nums.map((num, idx) => {
                  const isPivot = idx === step.r && step.i === -1; // Before final swap, pivot is at r
                  const isCurrentPivot = num === step.pivot && idx === step.p;
                  const isP = idx === step.p;
                  const isI = idx === step.i;
                  const inRange = idx >= step.l && idx <= step.r;
                  const targetMatch = idx === (initialNums.length - targetK) && step.highlightedLines.includes(17);

                  return (
                    <motion.div
                      key={`${idx}-${num}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: inRange || step.l === -1 ? 1 : 0.4,
                        scale: isI || isP || targetMatch ? 1.1 : 1,
                        backgroundColor: targetMatch
                          ? "green"
                          : isP ? "green"
                            : isI ? "purple"
                              : isPivot ? "var(--primary)" : "var(--card)",
                        borderColor: isPivot || isCurrentPivot ? "var(--primary)" : "var(--border)"
                      }}
                      className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2 transition-all relative ${isP ? "shadow-lg z-10" : ""
                        }`}
                    >
                      <span className="text-lg font-bold">{num}</span>
                      <div className="absolute -bottom-6 flex flex-col items-center">
                        {isP && <span className="text-[10px] font-black text-accent uppercase bg-primary w-4 h-4 rounded-full flex items-center justify-center">p</span>}
                        {isI && <span className="text-[10px] font-black text-muted-foreground uppercase bg-primary w-4 h-4 rounded-full flex items-center justify-center">i</span>}
                        {targetMatch && <span className="text-[10px] font-black text-primary uppercase bg-primary w-4 h-4 rounded-full flex items-center justify-center">★ K</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-muted/30 rounded-lg border flex flex-col items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Pivot</span>
                <span className="text-xl font-bold text-primary">{step.pivot !== null ? step.pivot : '-'}</span>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border flex flex-col items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Target Index</span>
                <span className="text-xl font-bold">{initialNums.length - targetK}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />

          <Card className="p-4 bg-muted/20 border-dashed border-border text-[10px] text-muted-foreground">
            <p>• <span className="text-accent font-bold">p pointer</span>: Elements to the left of p are guaranteed to be ≤ pivot.</p>
            <p>• <span className="text-muted-foreground font-bold">i pointer</span>: Currently scanning element at this index.</p>
            <p>• <span className="text-primary font-bold">Pivot</span>: Element used to partition the array.</p>
          </Card>
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
