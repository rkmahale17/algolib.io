import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  small: number[];
  large: number[];
  num: number | null;
  median: number | null;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `class MedianFinder {
  private small: number[] = [];
  private large: number[] = [];
  constructor() {}
  addNum(num: number): void {
    this.small.push(num);
    this.small.sort((a, b) => b - a);
    if (this.large.length > 0 && this.small[0] > this.large[0]) {
      this.large.push(this.small.shift()!);
      this.large.sort((a, b) => a - b);
    }
    if (this.small.length > this.large.length + 1) {
      this.large.push(this.small.shift()!);
      this.large.sort((a, b) => a - b);
    } else if (this.large.length > this.small.length + 1) {
      this.small.push(this.large.shift()!);
      this.small.sort((a, b) => b - a);
    }
  }
  findMedian(): number {
    if (this.small.length > this.large.length) return this.small[0];
    if (this.large.length > this.small.length) return this.large[0];
    return (this.small[0] + this.large[0]) / 2.0;
  }
}`,
  python: `class MedianFinder:
    def __init__(self):
        self.small = []
        self.large = []
    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        if self.large and (-self.small[0] > self.large[0]):
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        elif len(self.large) > len(self.small) + 1:
            heapq.heappush(self.small, -heapq.heappop(self.large))
    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        elif len(self.large) > len(self.small):
            return self.large[0]
        else:
            return (-self.small[0] + self.large[0]) / 2.0`,
  java: `public static class Solution {
    public static class MedianFinder {
        private PriorityQueue<Integer> small;
        private PriorityQueue<Integer> large;
        public MedianFinder() {
            this.small = new PriorityQueue<>((a, b) -> b - a);
            this.large = new PriorityQueue<>();
        }
        public void addNum(int num) {
            small.offer(num);
            if (!large.isEmpty() && small.peek() > large.peek()) {
                large.offer(small.poll());
            }
            if (small.size() > large.size() + 1) {
                large.offer(small.poll());
            } else if (large.size() > small.size() + 1) {
                small.offer(large.poll());
            }
        }
        public double findMedian() {
            if (small.size() > large.size()) {
                return small.peek();
            } else if (large.size() > small.size()) {
                return large.peek();
            } else {
                return (small.peek() + large.peek()) / 2.0;
            }
        }
    }
}`,
  cpp: `class Solution {
private:
    priority_queue<int> small;
    priority_queue<int, vector<int>, greater<int>> large;
public:
    Solution() {}
    void addNum(int num) {
        small.push(num);
        if (!small.empty() && !large.empty() && small.top() > large.top()) {
            large.push(small.top());
            small.pop();
        }
        if (small.size() > large.size() + 1) {
            large.push(small.top());
            small.pop();
        } else if (large.size() > small.size() + 1) {
            small.push(large.top());
            large.pop();
        }
    }
    double findMedian() {
        if (small.size() > large.size()) return small.top();
        if (large.size() > small.size()) return large.top();
        return (small.top() + large.top()) / 2.0;
    }
};`
};

export const FindMedianFromDataStreamVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [{ steps, stepLineNumbers }] = useState(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const inputs = [5, 10, 2, 8, 3, 7];
    let smallHeap: number[] = [];
    let largeHeap: number[] = [];

    const getMedian = (sH: number[], lH: number[]) => {
      if (sH.length > lH.length) return sH[0];
      if (lH.length > sH.length) return lH[0];
      if (sH.length === 0) return null;
      return (sH[0] + lH[0]) / 2;
    };

    const addStep = (
      small: number[],
      large: number[],
      num: number | null,
      median: number | null,
      explanation: string,
      pseudo: string,
      variables: Record<string, any>,
      ts: number, py: number, java: number, cpp: number
    ) => {
      s.push({
        small,
        large,
        num,
        median,
        explanation,
        pseudoStep: pseudo,
        variables
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    addStep(
      [], [], null, null,
      "Initialize two heaps: Max-Heap (small) and Min-Heap (large).",
      "SET small = Heap(max), large = Heap(min)",
      { smallSize: 0, largeSize: 0 },
      4, 2, 5, 6
    );

    inputs.forEach((num) => {
      addStep(
        [...smallHeap],
        [...largeHeap],
        num,
        getMedian(smallHeap, largeHeap),
        `Calling addNum(${num}).`,
        `CALL addNum(num=${num})`,
        { num, smallSize: smallHeap.length, largeSize: largeHeap.length },
        5, 5, 9, 7
      );

      smallHeap.push(num);
      smallHeap.sort((a, b) => b - a);
      addStep(
        [...smallHeap],
        [...largeHeap],
        num,
        getMedian(smallHeap, largeHeap),
        `Push ${num} to the small (max) heap.`,
        `CALL small.push(${num})`,
        { num, small: `[${smallHeap.join(', ')}]`, smallSize: smallHeap.length },
        6, 6, 10, 8
      );

      addStep(
        [...smallHeap],
        [...largeHeap],
        num,
        getMedian(smallHeap, largeHeap),
        "Check if max element of small heap is greater than min element of large heap.",
        `IF small.peek() > large.peek()  →  ${largeHeap.length > 0 ? (smallHeap[0] > largeHeap[0] ? 'YES ✓' : 'NO ✗') : 'N/A'}`,
        { smallMax: smallHeap[0], largeMin: largeHeap[0] || 'N/A' },
        8, 7, 11, 9
      );

      if (smallHeap.length && largeHeap.length && smallHeap[0] > largeHeap[0]) {
        const val = smallHeap.shift()!;
        largeHeap.push(val);
        largeHeap.sort((a, b) => a - b);
        addStep(
          [...smallHeap],
          [...largeHeap],
          num,
          getMedian(smallHeap, largeHeap),
          `Max of small (${val}) > min of large. Move ${val} to large heap to maintain ordering.`,
          `CALL large.push(small.pop())`,
          { small: `[${smallHeap.join(', ')}]`, large: `[${largeHeap.join(', ')}]` },
          9, 8, 12, 10
        );
      }

      addStep(
        [...smallHeap],
        [...largeHeap],
        num,
        getMedian(smallHeap, largeHeap),
        "Check if small heap size > large heap size + 1.",
        `IF small.size() > large.size() + 1  →  ${smallHeap.length > largeHeap.length + 1 ? 'YES ✓' : 'NO ✗'}`,
        { smallSize: smallHeap.length, largeSize: largeHeap.length },
        12, 9, 14, 13
      );

      if (smallHeap.length > largeHeap.length + 1) {
        const val = smallHeap.shift()!;
        largeHeap.push(val);
        largeHeap.sort((a, b) => a - b);
        addStep(
          [...smallHeap],
          [...largeHeap],
          num,
          getMedian(smallHeap, largeHeap),
          `Small heap is too large. Move max element (${val}) to large heap.`,
          `CALL large.push(small.pop())`,
          { small: `[${smallHeap.join(', ')}]`, large: `[${largeHeap.join(', ')}]` },
          13, 10, 15, 14
        );
      }

      addStep(
        [...smallHeap],
        [...largeHeap],
        num,
        getMedian(smallHeap, largeHeap),
        "Check if large heap size > small heap size + 1.",
        `IF large.size() > small.size() + 1  →  ${largeHeap.length > smallHeap.length + 1 ? 'YES ✓' : 'NO ✗'}`,
        { smallSize: smallHeap.length, largeSize: largeHeap.length },
        15, 11, 16, 16
      );

      if (largeHeap.length > smallHeap.length + 1) {
        const val = largeHeap.shift()!;
        smallHeap.push(val);
        smallHeap.sort((a, b) => b - a);
        addStep(
          [...smallHeap],
          [...largeHeap],
          num,
          getMedian(smallHeap, largeHeap),
          `Large heap is too large. Move min element (${val}) to small heap.`,
          `CALL small.push(large.pop())`,
          { small: `[${smallHeap.join(', ')}]`, large: `[${largeHeap.join(', ')}]` },
          16, 12, 17, 17
        );
      }

      const finalMedian = getMedian(smallHeap, largeHeap);
      addStep(
        [...smallHeap],
        [...largeHeap],
        null,
        finalMedian,
        `Calling findMedian(). Heaps are balanced and ordered.`,
        `CALL findMedian()`,
        { smallSize: smallHeap.length, largeSize: largeHeap.length },
        20, 13, 20, 21
      );

      addStep(
        [...smallHeap],
        [...largeHeap],
        null,
        finalMedian,
        `Median is ${finalMedian}.`,
        `RETURN median → ${finalMedian}`,
        { median: finalMedian },
        smallHeap.length > largeHeap.length ? 21 : (largeHeap.length > smallHeap.length ? 22 : 23),
        smallHeap.length > largeHeap.length ? 14 : (largeHeap.length > smallHeap.length ? 16 : 18),
        smallHeap.length > largeHeap.length ? 21 : (largeHeap.length > smallHeap.length ? 23 : 25),
        smallHeap.length > largeHeap.length ? 22 : (largeHeap.length > smallHeap.length ? 23 : 24)
      );
    });

    return { steps: s, stepLineNumbers: lines };
  });

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Two Heaps Strategy</h3>
            </div>

            <div className="grid grid-cols-2 gap-8 relative">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase">
                  <span>Small Heap</span>
                  <ArrowUp className="w-3 h-3" />
                </div>
                <div className="flex flex-col-reverse items-center gap-2 min-h-[160px] w-full border-2 border-dashed border-blue-500/20 rounded-xl p-4 bg-blue-500/5">
                  <AnimatePresence mode="popLayout">
                    {step.small.map((val, idx) => (
                      <motion.div
                        key={`small-\${val}-\${idx}`}
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
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 font-bold shadow-sm \${
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

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-background border-2 border-primary/20 rounded-full p-2 shadow-xl">
                  <span className="text-xs font-black text-primary">≤</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase">
                  <ArrowDown className="w-3 h-3" />
                  <span>Large Heap</span>
                </div>
                <div className="flex flex-col items-center gap-2 min-h-[160px] w-full border-2 border-dashed border-green-500/20 rounded-xl p-4 bg-green-500/5">
                  <AnimatePresence mode="popLayout">
                    {step.large.map((val, idx) => (
                      <motion.div
                        key={`large-\${val}-\${idx}`}
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
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 font-bold shadow-sm \${
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
                <div className={`p-2 rounded-full \${step.num ? 'bg-primary/10 animate-pulse' : 'bg-muted'}`}>
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
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
        />
      }
    />
  );
};
