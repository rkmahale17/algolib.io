import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  op: string;
  val?: number;
  cnt: Record<number, number>;
  stacks: Record<number, number[]>;
  maxCnt: number;
  res?: number;
  explanation: string;
  pseudoStep: string;
  action: string;
}

const languages: VisualizationLanguageMap = {
  python: `class FreqStack:
    def __init__(self):
        self.cnt = {}
        self.stacks = {}
        self.maxCnt = 0

    def push(self, val: int) -> None:
        val_cnt = self.cnt.get(val, 0) + 1
        self.cnt[val] = val_cnt
        if val_cnt > self.maxCnt:
            self.maxCnt = val_cnt
            self.stacks[val_cnt] = []
        self.stacks[val_cnt].append(val)

    def pop(self) -> int:
        stack = self.stacks[self.maxCnt]
        res = stack.pop()
        self.cnt[res] -= 1
        if not stack:
            del self.stacks[self.maxCnt]
            self.maxCnt -= 1
        return res`,

  typescript: `class FreqStack {
    private cnt: Map<number, number>;
    private stacks: Map<number, number[]>;
    private maxCnt: number;

    constructor() {
        this.cnt = new Map();
        this.stacks = new Map();
        this.maxCnt = 0;
    }

    push(val: number): void {
        const valCnt = (this.cnt.get(val) ?? 0) + 1;
        this.cnt.set(val, valCnt);
        if (valCnt > this.maxCnt) {
            this.maxCnt = valCnt;
            this.stacks.set(valCnt, []);
        }
        this.stacks.get(valCnt)!.push(val);
    }

    pop(): number {
        const stack = this.stacks.get(this.maxCnt)!;
        const res = stack.pop()!;
        this.cnt.set(res, this.cnt.get(res)! - 1);
        if (stack.length === 0) {
            this.stacks.delete(this.maxCnt);
            this.maxCnt--;
        }
        return res;
    }
}`,

  java: `class FreqStack {
    private Map<Integer, Integer> cnt;
    private Map<Integer, Stack<Integer>> stacks;
    private int maxCnt;

    public FreqStack() {
        this.cnt = new HashMap<>();
        this.stacks = new HashMap<>();
        this.maxCnt = 0;
    }

    public void push(int val) {
        int valCnt = cnt.getOrDefault(val, 0) + 1;
        cnt.put(val, valCnt);
        if (valCnt > maxCnt) {
            maxCnt = valCnt;
        }
        stacks.computeIfAbsent(valCnt, k -> new Stack<>()).push(val);
    }

    public int pop() {
        Stack<Integer> stack = stacks.get(maxCnt);
        int res = stack.pop();
        cnt.put(res, cnt.get(res) - 1);
        if (stack.isEmpty()) {
            stacks.remove(maxCnt);
            maxCnt--;
        }
        return res;
    }
}`,

  cpp: `class FreqStack {
private:
    map<int, int> cnt;
    map<int, vector<int>> stacks;
    int maxCnt;

public:
    FreqStack() {
        maxCnt = 0;
    }

    void push(int val) {
        cnt[val]++;
        int valCnt = cnt[val];
        if (valCnt > maxCnt) {
            maxCnt = valCnt;
        }
        stacks[valCnt].push_back(val);
    }

    int pop() {
        vector<int>& currentMaxFreqStack = stacks[maxCnt];
        int res = currentMaxFreqStack.back();
        currentMaxFreqStack.pop_back();
        cnt[res]--;
        if (currentMaxFreqStack.empty()) {
            stacks.erase(maxCnt);
            maxCnt--;
        }
        return res;
    }
};`
};

const generateSteps = (operations: {op: string, val?: number}[]) => {
  const steps: Step[] = [];
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

  const cnt: Record<number, number> = {};
  const stacks: Record<number, number[]> = {};
  let maxCnt = 0;

  const copyStacks = () => {
    const cp: Record<number, number[]> = {};
    for (const key in stacks) {
      cp[key] = [...stacks[key]];
    }
    return cp;
  };

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
    steps.push({
      op: extra.op || "",
      val: extra.val,
      cnt: { ...cnt },
      stacks: copyStacks(),
      maxCnt: maxCnt,
      res: extra.res,
      explanation: msg,
      pseudoStep: pseudo,
      action: extra.action || "processing"
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  addStep("Initialize frequency map, stacks map, and maxCnt.", "SET cnt = {}, stacks = {}, maxCnt = 0", 7, 3, 7, 8, { op: "init" });

  for (const op of operations) {
    if (op.op === "push") {
      const val = op.val!;
      // push start
      addStep(`Push value ${val} into FreqStack.`, `CALL push(${val})`, 12, 7, 12, 12, { op: "push", val, action: "push" });
      
      // valCnt
      const valCnt = (cnt[val] || 0) + 1;
      addStep(`Calculate new frequency of ${val}: ${valCnt - 1} + 1 = ${valCnt}.`, `valCnt = cnt[${val}] + 1 → ${valCnt}`, 13, 8, 13, 13, { op: "push", val, action: "frequency" });
      
      // cnt[val] = valCnt
      cnt[val] = valCnt;
      addStep(`Update frequency of ${val} to ${valCnt} in map.`, `cnt[${val}] = ${valCnt}`, 14, 9, 14, 14, { op: "push", val, action: "frequency" });
      
      // if valCnt > maxCnt
      addStep(`Check if new frequency ${valCnt} is greater than maxCnt (${maxCnt}).`, `IF valCnt > maxCnt`, 15, 10, 15, 15, { op: "push", val, action: "checking" });
      
      if (valCnt > maxCnt) {
        maxCnt = valCnt;
        if (!stacks[valCnt]) stacks[valCnt] = [];
        addStep(`New max frequency reached! Update maxCnt to ${valCnt} and initialize stack.`, `maxCnt = valCnt; stacks[${valCnt}] = []`, 16, 11, 16, 16, { op: "push", val, action: "updating max" });
      } else {
        if (!stacks[valCnt]) stacks[valCnt] = [];
      }
      
      stacks[valCnt].push(val);
      addStep(`Push ${val} onto the stack for frequency ${valCnt}.`, `stacks[${valCnt}].append(${val})`, 19, 13, 18, 18, { op: "push", val, action: "pushing" });

    } else if (op.op === "pop") {
      // pop start
      addStep(`Pop the most frequent element.`, `CALL pop()`, 22, 15, 21, 21, { op: "pop", action: "pop" });
      
      const stack = stacks[maxCnt];
      addStep(`Get the stack for the current maximum frequency (${maxCnt}).`, `stack = stacks[maxCnt]`, 23, 16, 22, 22, { op: "pop", action: "get stack" });
      
      const res = stack.pop()!;
      addStep(`Pop the top element from the max frequency stack: ${res}.`, `res = stack.pop() → ${res}`, 24, 17, 23, 23, { op: "pop", res, action: "popping" });
      
      cnt[res] -= 1;
      addStep(`Decrement the frequency of ${res} to ${cnt[res]}.`, `cnt[${res}] -= 1`, 25, 18, 24, 25, { op: "pop", res, action: "frequency" });
      
      addStep(`Check if the stack for max frequency ${maxCnt} is now empty.`, `IF stack is empty`, 26, 19, 25, 26, { op: "pop", res, action: "checking" });
      if (stack.length === 0) {
        delete stacks[maxCnt];
        maxCnt--;
        addStep(`Stack is empty. Delete it and decrement maxCnt to ${maxCnt}.`, `del stacks[maxCnt]; maxCnt -= 1`, 27, 20, 26, 27, { op: "pop", res, action: "updating max" });
      }
      
      addStep(`Return the popped element ${res}.`, `RETURN res → ${res}`, 30, 22, 29, 30, { op: "pop", res, action: "return" });
    }
  }

  return { steps, stepLineNumbers };
};

export const MaximumFrequencyStackVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Standard test case: push 5, 7, 5, 7, 4, 5, pop, pop, pop, pop
  const operations = [
    { op: "push", val: 5 },
    { op: "push", val: 7 },
    { op: "push", val: 5 },
    { op: "push", val: 7 },
    { op: "push", val: 4 },
    { op: "push", val: 5 },
    { op: "pop" },
    { op: "pop" },
    { op: "pop" },
    { op: "pop" }
  ];

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateSteps(operations);
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  // Helper to render stacks correctly (frequency ascending)
  const sortedFrequencies = Object.keys(currentStep.stacks).map(Number).sort((a, b) => a - b);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col gap-6">
                
              {/* Operations Overview */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground mb-4 tracking-widest">Operation Log</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {operations.map((op, idx) => {
                        // Find if this op is the active one
                        // We can roughly map currentStepIndex to the operation, but step index is much finer.
                        // We'll highlight based on op matching what's in currentStep.
                        // Actually, calculating which operation we are currently on:
                        // Each op has multiple steps. We can find the current operation index by looking at steps.
                        let activeOpIdx = 0;
                        let count = 0;
                        for (let i = 0; i <= currentStepIndex; i++) {
                            if (steps[i].op === "push" && steps[i].action === "push") count++;
                            if (steps[i].op === "pop" && steps[i].action === "pop") count++;
                        }
                        activeOpIdx = count - 1;

                        return (
                            <div key={idx} className={`px-2 py-1 text-xs rounded border font-mono ${idx === activeOpIdx ? 'bg-primary text-primary-foreground border-primary font-bold' : idx < activeOpIdx ? 'bg-muted border-border text-muted-foreground' : 'bg-transparent border-border/50 text-muted-foreground/50'}`}>
                                {op.op}{op.val !== undefined ? `(${op.val})` : '()'}
                            </div>
                        );
                    })}
                </div>
              </div>

              {/* State Summary */}
              <div className="flex gap-4">
                  <div className="flex-1 border border-border rounded-lg p-3 bg-muted/10">
                      <div className="text-xs font-bold text-muted-foreground mb-2">Max Count</div>
                      <div className="text-3xl font-mono text-primary">{currentStep.maxCnt}</div>
                  </div>
                  {currentStep.res !== undefined && currentStep.op === "pop" && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      className="flex-1 border border-green-500/30 bg-green-500/10 rounded-lg p-3 flex flex-col justify-center items-center"
                    >
                        <div className="text-xs font-bold text-green-600/70 mb-1">Popped Element</div>
                        <div className="text-2xl font-mono font-bold text-green-600">{currentStep.res}</div>
                    </motion.div>
                  )}
              </div>

              {/* Freq Stacks visualization */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground mb-4 tracking-widest">Stacks by Frequency</h3>
                <div className="flex flex-col gap-3 min-h-[160px] border border-dashed border-border rounded-lg p-4 bg-muted/5 relative">
                    {sortedFrequencies.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground italic text-sm">
                            Stacks are empty
                        </div>
                    )}
                    <AnimatePresence>
                    {sortedFrequencies.map(freq => (
                        <motion.div 
                            key={freq}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${freq === currentStep.maxCnt ? 'bg-primary text-primary-foreground shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-muted text-muted-foreground border border-border'}`}>
                                f={freq}
                            </div>
                            <div className="flex-1 flex gap-2 items-center min-h-[40px] px-3 py-2 bg-card border border-border rounded-lg">
                                {currentStep.stacks[freq] && currentStep.stacks[freq].length > 0 ? (
                                    currentStep.stacks[freq].map((val, idx) => (
                                        <motion.div
                                            key={`${freq}-${idx}-${val}`}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-8 h-8 flex items-center justify-center bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono font-bold rounded"
                                        >
                                            {val}
                                        </motion.div>
                                    ))
                                ) : (
                                    <span className="text-xs text-muted-foreground italic px-2">Empty</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
              </div>

              {/* Frequency Map */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground mb-4 tracking-widest">Frequency Map (Count)</h3>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(currentStep.cnt).filter(([_, count]) => count > 0).length === 0 ? (
                        <div className="text-sm italic text-muted-foreground">Map is empty</div>
                    ) : (
                        Object.entries(currentStep.cnt)
                            .filter(([_, count]) => count > 0)
                            .map(([val, count]) => (
                                <div key={val} className="flex border border-border rounded overflow-hidden text-sm font-mono">
                                    <div className="px-2 py-1 bg-muted font-bold">{val}</div>
                                    <div className="px-2 py-1 bg-card text-primary font-bold">{count}</div>
                                </div>
                        ))
                    )}
                </div>
              </div>

            </div>
          </Card>

          {/* Descriptive Commentary Box (at the bottom of left content) */}
          <div className="p-4 bg-muted/50 rounded-lg text-sm leading-relaxed text-muted-foreground border border-border">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Process Step
            </div>
            {currentStep.explanation}
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col gap-6">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel
            variables={{
              operation: currentStep.op || 'Init',
              value: currentStep.val !== undefined ? currentStep.val : 'N/A',
              maxFrequency: currentStep.maxCnt,
              activeStackSize: currentStep.stacks[currentStep.maxCnt]?.length || 0,
              result: currentStep.res !== undefined ? currentStep.res : 'N/A'
            }}
          />
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
