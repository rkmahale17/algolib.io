import { useState, useEffect, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  minHeap: number[];
  k: number;
  valToAdd: number | null;
  returnedValue: number | null;
  explanation: string;
  variables: Record<string, any>;
  operation?: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `class KthLargest {
  private minHeap: number[];
  private k: number;
  constructor(k: number, nums: number[]) {
    this.k = k;
    this.minHeap = [];
    for (const num of nums) {
      this.add(num);
    }
  }
  add(val: number): number {
    this.minHeap.push(val);
    this.minHeap.sort((a, b) => a - b);
    while (this.minHeap.length > this.k) {
      this.minHeap.shift();
    }
    return this.minHeap[0];
  }
}`,
  python: `import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.min_heap = nums[:k]
        heapq.heapify(self.min_heap)
        for num in nums[k:]:
            if num > self.min_heap[0]:
                heapq.heapreplace(self.min_heap, num)
    def add(self, val: int) -> int:
        if len(self.min_heap) < self.k:
            heapq.heappush(self.min_heap, val)
        elif val > self.min_heap[0]:
            heapq.heapreplace(self.min_heap, val)
        return self.min_heap[0]`,
  java: `class KthLargest {
    private PriorityQueue<Integer> minHeap;
    private int k;
    public KthLargest(int k, int[] nums) {
        this.k = k;
        minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
    }
    public int add(int val) {
        minHeap.offer(val);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
        return minHeap.peek();
    }
}`,
  cpp: `class KthLargest {
public:
    priority_queue<int, vector<int>, greater<int>> minHeap;
    int k;
    KthLargest(int k, const vector<int>& nums) {
        this->k = k;
        for (int num : nums) {
            minHeap.push(num);
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }
    }
    int add(int val) {
        minHeap.push(val);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
        return minHeap.top();
    }
};`
};

export const KthLargestElementInAStreamVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const kParam = 3;
  const initialNums = useMemo(() => [4, 5, 8, 2], []);
  const streamAdds = useMemo(() => [3, 5, 10, 9, 4], []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    
    let k = kParam;
    let minHeap: number[] = [];

    const addStep = (
      explanation: string,
      pseudo: string,
      vars: any,
      op: string,
      val: number | null,
      ret: number | null,
      ts: number, py: number, j: number, cpp: number
    ) => {
      s.push({
        minHeap: [...minHeap],
        k,
        valToAdd: val,
        returnedValue: ret,
        explanation,
        pseudoStep: pseudo,
        variables: vars,
        operation: op
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(j);
      lines.cpp!.push(cpp);
    };

    // Constructor setup
    addStep(
      `Initializing KthLargest with k = ${k} and initial stream [${initialNums.join(', ')}].`,
      `KthLargest(k=${k}, nums=[${initialNums.join(', ')}])`,
      { k, nums: `[${initialNums.join(', ')}]` },
      'constructor',
      null,
      null,
      4, 4, 4, 5
    );

    addStep(
      `Set internal k to ${k} and initialize an empty minHeap array.`,
      `SET this.k = ${k}, this.minHeap = []`,
      { k, minHeap: `[]` },
      'constructor',
      null,
      null,
      5, 5, 5, 6
    );

    const simulateAdd = (val: number, isConstructor: boolean) => {
      addStep(
        isConstructor ? `Constructor calling add(${val}) for initial stream element.` : `Client calls add(${val}) to add a new score to the stream.`,
        `add(val=${val})`,
        { val, k },
        'add',
        val,
        null,
        isConstructor ? 8 : 11, isConstructor ? 10 : 11, isConstructor ? 8 : 14, isConstructor ? 8 : 14
      );

      minHeap.push(val);
      addStep(
        `Push ${val} to the end of the minHeap array.`,
        `minHeap.push(${val})`,
        { val, minHeapLength: minHeap.length },
        'add',
        val,
        null,
        12, 13, 15, 15
      );

      minHeap.sort((a, b) => a - b);
      addStep(
        `Sort the minHeap array in ascending order to maintain heap properties (smallest at index 0).`,
        `minHeap.sortAscending()`,
        { val, minHeapLength: minHeap.length },
        'add',
        val,
        null,
        13, 13, 15, 15
      );

      addStep(
        `Check if minHeap size (${minHeap.length}) > k (${k}).`,
        `WHILE minHeap.length > ${k}  →  ${minHeap.length} > ${k}`,
        { minHeapLength: minHeap.length, k },
        'add',
        val,
        null,
        14, 12, 16, 16
      );

      while (minHeap.length > k) {
        const removed = minHeap.shift();
        addStep(
          `Size exceeds k. Shift out the smallest element (${removed}) from the front.`,
          "minHeap.shift()",
          { removedValue: removed, minHeapLength: minHeap.length },
          'add',
          val,
          null,
          15, 10, 17, 17
        );

        addStep(
          `Check if minHeap size (${minHeap.length}) > k (${k}).`,
          `WHILE minHeap.length > ${k}  →  ${minHeap.length} > ${k}`,
          { minHeapLength: minHeap.length, k },
          'add',
          val,
          null,
          14, 12, 16, 16
        );
      }

      const result = minHeap[0];
      addStep(
        `Return the smallest element in our size-k array, which is at index 0: ${result}. This is the kth largest element overall!`,
        `RETURN minHeap[0]  →  ${result}`,
        { returnedResult: result },
        'add',
        val,
        result,
        17, 16, 19, 19
      );
    };

    // Iterate through initialNums
    for (const num of initialNums) {
      addStep(
        `Looping through initial stream numbers. Current num is ${num}.`,
        `FOR num IN nums  →  num = ${num}`,
        { num },
        'constructor',
        null,
        null,
        7, 8, 7, 7
      );
      simulateAdd(num, true);
    }

    addStep(
      `Constructor finishes. The minHeap is now fully initialized with the first ${initialNums.length} elements.`,
      "CONSTRUCTOR DONE",
      { },
      'constructor',
      null,
      null,
      10, 10, 13, 13
    );

    // Iterate through streamAdds
    for (const num of streamAdds) {
      simulateAdd(num, false);
    }

    return { steps: s, stepLineNumbers: lines };
  }, [initialNums, streamAdds]);

  useEffect(() => {
    setCurrentStep(0);
  }, [steps]);

  if (steps.length === 0) return null;
  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-4 bg-primary/5 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">minHeap Array (Size: {step.minHeap.length} / k: {step.k})</h3>
              {step.operation === 'add' && step.valToAdd !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Incoming:</span>
                  <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 font-bold flex items-center justify-center border border-orange-500/40">{step.valToAdd}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-end gap-3 min-h-[100px] mb-8">
              <AnimatePresence mode="popLayout">
                {step.minHeap.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-muted-foreground text-sm italic w-full text-center py-4"
                  >
                    Array is empty
                  </motion.div>
                )}
                {step.minHeap.map((val, idx) => {
                  const isKthLargest = idx === 0 && step.minHeap.length > 0;
                  const isNewlyAdded = step.operation === 'add' && val === step.valToAdd;
                  
                  return (
                    <motion.div
                      key={`${idx}-${val}-${currentStep}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        borderColor: isNewlyAdded ? 'hsl(var(--primary))' : isKthLargest ? '#22c55e' : 'hsl(var(--border))'
                      }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2 shadow-sm relative ${isKthLargest ? 'bg-green-500/10' : 'bg-card'}`}
                    >
                      <span className={`text-lg font-bold ${isKthLargest ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>{val}</span>
                      
                      {isKthLargest && (
                        <div className="absolute -bottom-6 flex flex-col items-center whitespace-nowrap">
                          <span className="text-[8px] font-bold text-green-600 dark:text-green-400">kth largest</span>
                        </div>
                      )}
                      {!isKthLargest && (
                        <div className="absolute -bottom-4 flex flex-col items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {step.returnedValue !== null && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-between"
              >
                <span className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Result Returned:</span>
                <span className="text-2xl font-black text-green-600 dark:text-green-400">{step.returnedValue}</span>
              </motion.div>
            )}
          </Card>

          <VariablePanel variables={step.variables} />
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
export default KthLargestElementInAStreamVisualization;
