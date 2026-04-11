import { useState, useEffect } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';

interface Step {
  small: number[];
  large: number[];
  num: number | null;
  median: number | null;
  explanation: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const FindMedianFromDataStreamVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);

  const code = `class Heap {
  private data: number[] = [];
  private comparator: (a: number, b: number) => boolean;

  constructor(comparator: (a: number, b: number) => boolean) {
    this.comparator = comparator;
  }

  size(): number {
    return this.data.length;
  }

  peek(): number {
    return this.data[0];
  }

  push(val: number): void {
    this.data.push(val);
    this.heapifyUp();
  }

  pop(): number {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.heapifyDown();
    }
    return top;
  }

  private heapifyUp(): void {
    let i = this.data.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.comparator(this.data[i], this.data[parent])) {
        [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
        i = parent;
      } else break;
    }
  }

  private heapifyDown(): void {
    let i = 0;
    const n = this.data.length;

    while (true) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let best = i;

      if (left < n && this.comparator(this.data[left], this.data[best])) {
        best = left;
      }
      if (right < n && this.comparator(this.data[right], this.data[best])) {
        best = right;
      }

      if (best !== i) {
        [this.data[i], this.data[best]] = [this.data[best], this.data[i]];
        i = best;
      } else break;
    }
  }
}

class MedianFinder {
  private small: Heap;
  private large: Heap;

  constructor() {
    this.small = new Heap((a, b) => a > b);
    this.large = new Heap((a, b) => a < b);
  }

  addNum(num: number): void {
    this.small.push(num);

    if (this.small.size() && this.large.size() &&
        this.small.peek() > this.large.peek()) {
      this.large.push(this.small.pop());
    }

    if (this.small.size() > this.large.size() + 1) {
      this.large.push(this.small.pop());
    }

    if (this.large.size() > this.small.size() + 1) {
      this.small.push(this.large.pop());
    }
  }

  findMedian(): number {
    if (this.small.size() > this.large.size()) {
      return this.small.peek();
    }

    if (this.large.size() > this.small.size()) {
      return this.large.peek();
    }

    return (this.small.peek() + this.large.peek()) / 2;
  }
}`;

  const generateSteps = () => {
    const s: Step[] = [];
    const inputs = [5, 10, 2, 8, 3, 7];
    let smallHeap: number[] = [];
    let largeHeap: number[] = [];

    const getMedian = (sH: number[], lH: number[]) => {
      if (sH.length > lH.length) return sH[0];
      if (lH.length > sH.length) return lH[0];
      if (sH.length === 0) return null;
      return (sH[0] + lH[0]) / 2;
    };

    // Initial state
    s.push({
      small: [],
      large: [],
      num: null,
      median: null,
      explanation: "Initialize two heaps: Max-Heap (small) and Min-Heap (large).",
      highlightedLines: [71, 72, 73, 74],
      variables: { smallSize: 0, largeSize: 0 }
    });

    inputs.forEach((num) => {
      // Step: Start addNum
      s.push({
        small: [...smallHeap],
        large: [...largeHeap],
        num,
        median: getMedian(smallHeap, largeHeap),
        explanation: `Calling addNum(${num}).`,
        highlightedLines: [76],
        variables: { num, smallSize: smallHeap.length, largeSize: largeHeap.length }
      });

      // Step: Push to small
      smallHeap.push(num);
      smallHeap.sort((a, b) => b - a); // Simulate max heap
      s.push({
        small: [...smallHeap],
        large: [...largeHeap],
        num,
        median: getMedian(smallHeap, largeHeap),
        explanation: `Push ${num} to the small (max) heap.`,
        highlightedLines: [77],
        variables: { num, small: `[${smallHeap.join(', ')}]`, smallSize: smallHeap.length }
      });

      // Step: Check ordering
      s.push({
        small: [...smallHeap],
        large: [...largeHeap],
        num,
        median: getMedian(smallHeap, largeHeap),
        explanation: "Check if max element of small heap is greater than min element of large heap.",
        highlightedLines: [79, 80],
        variables: { smallMax: smallHeap[0], largeMin: largeHeap[0] || 'N/A' }
      });

      if (smallHeap.length && largeHeap.length && smallHeap[0] > largeHeap[0]) {
        const val = smallHeap.shift()!;
        largeHeap.push(val);
        largeHeap.sort((a, b) => a - b); // Simulate min heap
        s.push({
          small: [...smallHeap],
          large: [...largeHeap],
          num,
          median: getMedian(smallHeap, largeHeap),
          explanation: `Max of small (${val}) > min of large. Move ${val} to large heap to maintain ordering.`,
          highlightedLines: [81],
          variables: { small: `[${smallHeap.join(', ')}]`, large: `[${largeHeap.join(', ')}]` }
        });
      }

      // Step: Balance sizes (small too big)
      s.push({
        small: [...smallHeap],
        large: [...largeHeap],
        num,
        median: getMedian(smallHeap, largeHeap),
        explanation: "Check if small heap size > large heap size + 1.",
        highlightedLines: [84],
        variables: { smallSize: smallHeap.length, largeSize: largeHeap.length }
      });

      if (smallHeap.length > largeHeap.length + 1) {
        const val = smallHeap.shift()!;
        largeHeap.push(val);
        largeHeap.sort((a, b) => a - b);
        s.push({
          small: [...smallHeap],
          large: [...largeHeap],
          num,
          median: getMedian(smallHeap, largeHeap),
          explanation: `Small heap is too large. Move max element (${val}) to large heap.`,
          highlightedLines: [85],
          variables: { small: `[${smallHeap.join(', ')}]`, large: `[${largeHeap.join(', ')}]` }
        });
      }

      // Step: Balance sizes (large too big)
      s.push({
        small: [...smallHeap],
        large: [...largeHeap],
        num,
        median: getMedian(smallHeap, largeHeap),
        explanation: "Check if large heap size > small heap size + 1.",
        highlightedLines: [88],
        variables: { smallSize: smallHeap.length, largeSize: largeHeap.length }
      });

      if (largeHeap.length > smallHeap.length + 1) {
        const val = largeHeap.shift()!;
        smallHeap.push(val);
        smallHeap.sort((a, b) => b - a);
        s.push({
          small: [...smallHeap],
          large: [...largeHeap],
          num,
          median: getMedian(smallHeap, largeHeap),
          explanation: `Large heap is too large. Move min element (${val}) to small heap.`,
          highlightedLines: [89],
          variables: { small: `[${smallHeap.join(', ')}]`, large: `[${largeHeap.join(', ')}]` }
        });
      }

      // Step: findMedian Call
      const finalMedian = getMedian(smallHeap, largeHeap);
      s.push({
        small: [...smallHeap],
        large: [...largeHeap],
        num: null,
        median: finalMedian,
        explanation: `Calling findMedian(). Heaps are balanced and ordered.`,
        highlightedLines: [93],
        variables: { smallSize: smallHeap.length, largeSize: largeHeap.length }
      });

      s.push({
        small: [...smallHeap],
        large: [...largeHeap],
        num: null,
        median: finalMedian,
        explanation: `Median is ${finalMedian}.`,
        highlightedLines: smallHeap.length > largeHeap.length ? [95] : (largeHeap.length > smallHeap.length ? [99] : [102]),
        variables: { median: finalMedian }
      });
    });

    setSteps(s);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  if (steps.length === 0) return null;
  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Two Heaps Strategy</h3>
            </div>

            <div className="grid grid-cols-2 gap-8 relative">
              {/* Small Heap (Max Heap) */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase">
                  <span>Small Heap</span>
                  <ArrowUp className="w-3 h-3" />
                </div>
                <div className="flex flex-col-reverse items-center gap-2 min-h-[160px] w-full border-2 border-dashed border-blue-500/20 rounded-xl p-4 bg-blue-500/5">
                  <AnimatePresence mode="popLayout">
                    {step.small.map((val, idx) => (
                      <motion.div
                        key={`small-${val}-${idx}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{
                          opacity: 1,
                          scale: idx === 0 ? 1.1 : 1,
                          y: 0,
                          backgroundColor: idx === 0 ? "rgba(59, 130, 246, 0.2)" : "var(--card)",
                          borderColor: idx === 0 ? "rgb(59, 130, 246)" : "var(--border)"
                        }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 font-bold shadow-sm ${
                          idx === 0 ? "z-10 shadow-blue-500/20" : ""
                        }`}
                      >
                        {val}
                        {idx === 0 && (
                          <div className="absolute -top-6 text-[8px] font-black text-blue-500 uppercase bg-blue-500/10 px-1 rounded">
                            Max
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {step.small.length === 0 && (
                    <span className="text-[10px] text-muted-foreground uppercase absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 rotate-90 origin-center opacity-30 select-none">
                      Empty Max-Heap
                    </span>
                  )}
                </div>
              </div>

              {/* Center Divider/Property */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-background border-2 border-primary/20 rounded-full p-2 shadow-xl">
                  <span className="text-xs font-black text-primary">≤</span>
                </div>
              </div>

              {/* Large Heap (Min Heap) */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase">
                  <ArrowDown className="w-3 h-3" />
                  <span>Large Heap</span>
                </div>
                <div className="flex flex-col items-center gap-2 min-h-[160px] w-full border-2 border-dashed border-green-500/20 rounded-xl p-4 bg-green-500/5">
                  <AnimatePresence mode="popLayout">
                    {step.large.map((val, idx) => (
                      <motion.div
                        key={`large-${val}-${idx}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{
                          opacity: 1,
                          scale: idx === 0 ? 1.1 : 1,
                          y: 0,
                          backgroundColor: idx === 0 ? "rgba(34, 197, 94, 0.2)" : "var(--card)",
                          borderColor: idx === 0 ? "rgb(34, 197, 94)" : "var(--border)"
                        }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 font-bold shadow-sm ${
                          idx === 0 ? "z-10 shadow-green-500/20" : ""
                        }`}
                      >
                        {val}
                        {idx === 0 && (
                          <div className="absolute -bottom-6 text-[8px] font-black text-green-500 uppercase bg-green-500/10 px-1 rounded">
                            Min
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {step.large.length === 0 && (
                    <span className="text-[10px] text-muted-foreground uppercase absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 rotate-90 origin-center opacity-30 select-none">
                      Empty Min-Heap
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-muted/20 border rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Current Median</span>
                  <span className="text-2xl font-black text-primary">
                    {step.median !== null ? step.median : '-'}
                  </span>
                </div>
                <div className={`p-2 rounded-full ${step.num ? 'bg-primary/10 animate-pulse' : 'bg-muted'}`}>
                  {step.num ? (
                    <span className="text-xs font-bold text-primary px-2">Adding: {step.num}</span>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground px-2">Ready</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
              <Info className="w-3 h-3" />
              Algorithm Logic
            </h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />

          <Card className="p-4 bg-muted/20 border-dashed border-border text-[10px] text-muted-foreground">
            <p>• <span className="text-blue-500 font-bold">Small Heap</span>: Rebalance by pushing/popping from top (Max).</p>
            <p>• <span className="text-green-500 font-bold">Large Heap</span>: Stores the larger half (Min on top).</p>
            <p>• <span className="text-primary font-bold">Median</span>: Top of either heap (if unequal sizes) or average of tops.</p>
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
