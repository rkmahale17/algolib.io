import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  s1: number[];
  s2: number[];
  conceptualQueue: number[];
  activeOperation: string;
  activeValue?: number;
  highlightedStack: 's1' | 's2' | null;
  highlightedIdx: number | null;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `class MyQueue {
    private s1: number[];
    private s2: number[];
    constructor() {
        this.s1 = [];
        this.s2 = [];
    }
    push(x: number): void {
        this.s1.push(x);
    }
    pop(): number {
        if (this.s2.length === 0) {
            while (this.s1.length > 0) {
                this.s2.push(this.s1.pop()!);
            }
        }
        return this.s2.pop()!;
    }
    peek(): number {
        if (this.s2.length === 0) {
            while (this.s1.length > 0) {
                this.s2.push(this.s1.pop()!);
            }
        }
        return this.s2[this.s2.length - 1];
    }
    empty(): boolean {
        return this.s1.length === 0 && this.s2.length === 0;
    }
}`,

  python: `class MyQueue:
    def __init__(self):
        self.s1 = []
        self.s2 = []
    def push(self, x: int) -> None:
        self.s1.append(x)
    def pop(self) -> int:
        if not self.s2:
            while self.s1:
                self.s2.append(self.s1.pop())
        return self.s2.pop()
    def peek(self) -> int:
        if not self.s2:
            while self.s1:
                self.s2.append(self.s1.pop())
        return self.s2[-1]
    def empty(self) -> bool:
        return not self.s1 and not self.s2`,

  java: `class MyQueue {
    private Deque<Integer> s1;
    private Deque<Integer> s2;
    public MyQueue() {
        s1 = new ArrayDeque<>();
        s2 = new ArrayDeque<>();
    }
    public void push(int x) {
        s1.push(x);
    }
    public int pop() {
        if (s2.isEmpty()) {
            transferElements();
        }
        return s2.pop();
    }
    public int peek() {
        if (s2.isEmpty()) {
            transferElements();
        }
        return s2.peek();
    }
    public boolean empty() {
        return s1.isEmpty() && s2.isEmpty();
    }
    private void transferElements() {
        while (!s1.isEmpty()) {
            s2.push(s1.pop());
        }
    }
}`,

  cpp: `class MyQueue {
private:
    vector<int> s1;
    vector<int> s2;
    void transferS1ToS2() {
        if (s2.empty()) {
            while (!s1.empty()) {
                s2.push_back(s1.back());
                s1.pop_back();
            }
        }
    }
public:
    MyQueue() {
    }
    void push(int x) {
        s1.push_back(x);
    }
    int pop() {
        transferS1ToS2();
        int frontElement = s2.back();
        s2.pop_back();
        return frontElement;
    }
    int peek() {
        transferS1ToS2();
        return s2.back();
    }
    bool empty() {
        return s1.empty() && s2.empty();
    }
};`,
};

function generateVisualizationData() {
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

  // 1. Initial State / Constructor
  steps.push({
    s1: [],
    s2: [],
    conceptualQueue: [],
    activeOperation: 'init',
    highlightedStack: null,
    highlightedIdx: null,
    variables: { s1: '[]', s2: '[]' },
    explanation: "Initialize two empty stacks: s1 (input stack) to record incoming elements, and s2 (output stack) to help reverse them for FIFO output.",
    pseudoStep: `CALL MyQueue()`
  });
  addLines(4, 2, 4, 14);

  // 2. push(1)
  steps.push({
    s1: [],
    s2: [],
    conceptualQueue: [],
    activeOperation: 'push',
    activeValue: 1,
    highlightedStack: null,
    highlightedIdx: null,
    variables: { x: 1, s1: '[]', s2: '[]' },
    explanation: "Pushing 1 onto the queue. We prepare to add it to the input stack s1.",
    pseudoStep: "CALL push(x = 1)"
  });
  addLines(8, 5, 8, 16);

  // 3. push(1) actual
  steps.push({
    s1: [1],
    s2: [],
    conceptualQueue: [1],
    activeOperation: 'push',
    activeValue: 1,
    highlightedStack: 's1',
    highlightedIdx: 0,
    variables: { x: 1, s1: '[1]', s2: '[]' },
    explanation: "1 is pushed onto stack s1.",
    pseudoStep: "CALL s1.push(1)"
  });
  addLines(9, 6, 9, 17);

  // 4. push(2)
  steps.push({
    s1: [1],
    s2: [],
    conceptualQueue: [1],
    activeOperation: 'push',
    activeValue: 2,
    highlightedStack: null,
    highlightedIdx: null,
    variables: { x: 2, s1: '[1]', s2: '[]' },
    explanation: "Pushing 2 onto the queue. We prepare to add it to s1.",
    pseudoStep: "CALL push(x = 2)"
  });
  addLines(8, 5, 8, 16);

  // 5. push(2) actual
  steps.push({
    s1: [1, 2],
    s2: [],
    conceptualQueue: [1, 2],
    activeOperation: 'push',
    activeValue: 2,
    highlightedStack: 's1',
    highlightedIdx: 1,
    variables: { x: 2, s1: '[1, 2]', s2: '[]' },
    explanation: "2 is pushed onto stack s1. Stack s1 now contains [1, 2] with 2 at the top.",
    pseudoStep: "CALL s1.push(2)"
  });
  addLines(9, 6, 9, 17);

  // 6. peek() - check s2 empty
  steps.push({
    s1: [1, 2],
    s2: [],
    conceptualQueue: [1, 2],
    activeOperation: 'peek',
    highlightedStack: null,
    highlightedIdx: null,
    variables: { s1: '[1, 2]', s2: '[]', "s2.isEmpty": true },
    explanation: "Request the front element of the queue. Since output stack s2 is empty, we must transfer elements from s1 to s2 to reverse them.",
    pseudoStep: "IF s2.length === 0  →  YES ✓"
  });
  addLines(20, 13, 18, 26);

  // 7. peek() - transfer while loop condition
  steps.push({
    s1: [1, 2],
    s2: [],
    conceptualQueue: [1, 2],
    activeOperation: 'peek',
    highlightedStack: null,
    highlightedIdx: null,
    variables: { s1: '[1, 2]', s2: '[]' },
    explanation: "Transfer loop: Pop from s1 and push to s2 while s1 has elements.",
    pseudoStep: "WHILE s1.length > 0  →  YES ✓"
  });
  addLines(21, 14, 27, 7);

  // 8. peek() - pop 2 push to s2
  steps.push({
    s1: [1],
    s2: [2],
    conceptualQueue: [1, 2],
    activeOperation: 'peek',
    highlightedStack: 's2',
    highlightedIdx: 0,
    variables: { s1: '[1]', s2: '[2]', transferred: 2 },
    explanation: "Pop 2 from s1 and push it onto s2.",
    pseudoStep: "CALL s2.push(s1.pop() = 2)"
  });
  addLines(22, 15, 28, 8);

  // 9. peek() - recheck while loop condition
  steps.push({
    s1: [1],
    s2: [2],
    conceptualQueue: [1, 2],
    activeOperation: 'peek',
    highlightedStack: null,
    highlightedIdx: null,
    variables: { s1: '[1]', s2: '[2]' },
    explanation: "s1 still has element 1. Continue the transfer.",
    pseudoStep: "WHILE s1.length > 0  →  YES ✓"
  });
  addLines(21, 14, 27, 7);

  // 10. peek() - pop 1 push to s2
  steps.push({
    s1: [],
    s2: [2, 1],
    conceptualQueue: [1, 2],
    activeOperation: 'peek',
    highlightedStack: 's2',
    highlightedIdx: 1,
    variables: { s1: '[]', s2: '[2, 1]', transferred: 1 },
    explanation: "Pop 1 from s1 and push it onto s2. Now the oldest element (1) is at the top of s2.",
    pseudoStep: "CALL s2.push(s1.pop() = 1)"
  });
  addLines(22, 15, 28, 8);

  // 11. peek() - transfer loop terminates
  steps.push({
    s1: [],
    s2: [2, 1],
    conceptualQueue: [1, 2],
    activeOperation: 'peek',
    highlightedStack: null,
    highlightedIdx: null,
    variables: { s1: '[]', s2: '[2, 1]' },
    explanation: "s1 is empty. Transfer loop completes.",
    pseudoStep: "WHILE s1.length > 0  →  NO ✗"
  });
  addLines(21, 14, 27, 7);

  // 12. peek() - return top of s2
  steps.push({
    s1: [],
    s2: [2, 1],
    conceptualQueue: [1, 2],
    activeOperation: 'peek',
    highlightedStack: 's2',
    highlightedIdx: 1,
    variables: { s1: '[]', s2: '[2, 1]', result: 1 },
    explanation: "Return the top element of stack s2 (which is 1) without removing it.",
    pseudoStep: "RETURN s2[s2.length - 1]  →  1"
  });
  addLines(25, 16, 21, 27);

  // 13. pop() - check s2 empty
  steps.push({
    s1: [],
    s2: [2, 1],
    conceptualQueue: [1, 2],
    activeOperation: 'pop',
    highlightedStack: null,
    highlightedIdx: null,
    variables: { s1: '[]', s2: '[2, 1]', "s2.isEmpty": false },
    explanation: "Remove the front element of the queue. Since s2 is not empty, no transfer is required.",
    pseudoStep: "IF s2.length === 0  →  NO ✗"
  });
  addLines(12, 8, 12, 20);

  // 14. pop() - pop value from s2
  steps.push({
    s1: [],
    s2: [2],
    conceptualQueue: [2],
    activeOperation: 'pop',
    highlightedStack: 's2',
    highlightedIdx: 1,
    variables: { s1: '[]', s2: '[2]', result: 1 },
    explanation: "Pop and return the top element of s2, which is 1 (the oldest element).",
    pseudoStep: "RETURN s2.pop()  →  1"
  });
  addLines(17, 11, 15, 23);

  // 15. empty()
  steps.push({
    s1: [],
    s2: [2],
    conceptualQueue: [2],
    activeOperation: 'empty',
    highlightedStack: null,
    highlightedIdx: null,
    variables: { s1: '[]', s2: '[2]' },
    explanation: "Check if the queue is empty. A queue is empty only if both stacks s1 and s2 are empty.",
    pseudoStep: "CALL empty()"
  });
  addLines(27, 17, 23, 29);

  // 16. empty() return
  steps.push({
    s1: [],
    s2: [2],
    conceptualQueue: [2],
    activeOperation: 'empty',
    highlightedStack: null,
    highlightedIdx: null,
    variables: { s1: '[]', s2: '[2]', isEmpty: false },
    explanation: "Stack s2 contains 2, so the queue is not empty. Return false.",
    pseudoStep: "RETURN s1.isEmpty AND s2.isEmpty  →  false"
  });
  addLines(28, 18, 24, 30);

  return { steps, stepLineNumbers };
}

export const ImplementQueueUsingStacksVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Implement Queue using Stacks
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              
              {/* 1. Conceptual Queue (FIFO) at the top */}
              <div className="mb-8">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Conceptual Queue (FIFO)</h4>
                <div className="flex justify-center items-center min-h-[50px]">
                  {currentStep.conceptualQueue.length === 0 ? (
                    <span className="text-xs text-muted-foreground/45 italic">Queue Empty</span>
                  ) : (
                    <div className="flex items-center gap-1.5 border border-border/50 px-4 py-2 rounded-lg bg-muted/10 relative">
                      <span className="text-[8px] font-bold uppercase tracking-tighter text-blue-500 mr-2">Front</span>
                      {currentStep.conceptualQueue.map((val, idx) => (
                        <div 
                          key={idx} 
                          className="w-7 h-7 flex items-center justify-center rounded bg-card border border-border font-bold text-xs"
                        >
                          {val}
                        </div>
                      ))}
                      <span className="text-[8px] font-bold uppercase tracking-tighter text-violet-500 ml-2">Back</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Two stacks side-by-side (s1 and s2) */}
              <div className="grid grid-cols-2 gap-8 pt-4 pb-4">
                
                {/* s1 - Input Stack */}
                <div className="flex flex-col items-center">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">s1: Input Stack (push)</h4>
                  <div className="border-b-4 border-x-4 border-dashed border-zinc-300 dark:border-zinc-800 rounded-b-xl w-28 min-h-[140px] flex flex-col-reverse justify-start items-center p-3 gap-2 bg-muted/5 shadow-inner">
                    {currentStep.s1.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground/30 italic text-center my-auto">Empty</span>
                    ) : (
                      currentStep.s1.map((val, idx) => {
                        const isTop = idx === currentStep.s1.length - 1;
                        const isHighlighted = currentStep.highlightedStack === 's1' && currentStep.highlightedIdx === idx;
                        return (
                          <div 
                            key={idx}
                            className={`w-20 h-8 flex items-center justify-between px-3 rounded-lg border font-mono text-xs transition-all duration-200 ${
                              isHighlighted 
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 scale-105 font-bold shadow-sm'
                                : 'border-border bg-card text-foreground'
                            }`}
                          >
                            <span>{val}</span>
                            {isTop && (
                              <span className="text-[7px] font-black bg-zinc-200 dark:bg-zinc-800 text-foreground px-1 py-0.5 rounded tracking-tighter uppercase">Top</span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* s2 - Output Stack */}
                <div className="flex flex-col items-center">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">s2: Output Stack (pop/peek)</h4>
                  <div className="border-b-4 border-x-4 border-dashed border-zinc-300 dark:border-zinc-800 rounded-b-xl w-28 min-h-[140px] flex flex-col-reverse justify-start items-center p-3 gap-2 bg-muted/5 shadow-inner">
                    {currentStep.s2.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground/30 italic text-center my-auto">Empty</span>
                    ) : (
                      currentStep.s2.map((val, idx) => {
                        const isTop = idx === currentStep.s2.length - 1;
                        const isHighlighted = currentStep.highlightedStack === 's2' && currentStep.highlightedIdx === idx;
                        return (
                          <div 
                            key={idx}
                            className={`w-20 h-8 flex items-center justify-between px-3 rounded-lg border font-mono text-xs transition-all duration-200 ${
                              isHighlighted 
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 scale-105 font-bold shadow-sm'
                                : 'border-border bg-card text-foreground'
                            }`}
                          >
                            <span>{val}</span>
                            {isTop && (
                              <span className="text-[7px] font-black bg-zinc-200 dark:bg-zinc-800 text-foreground px-1 py-0.5 rounded tracking-tighter uppercase">Top</span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            {/* Commentary box styled like the variable panel */}
            <div className="bg-muted/50 rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Commentary</h3>
              <p className="text-[14px] font-medium leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {currentStep.explanation}
              </p>
            </div>
            <VariablePanel variables={currentStep.variables} />
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
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
