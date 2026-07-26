import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  queue: number[];
  conceptualStack: number[];
  activeOperation: string;
  activeValue?: number;
  highlightedQueueIdx: number | null;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `class MyStack {
    private q: number[];
    constructor() {
        this.q = [];
    }
    push(x: number): void {
        this.q.push(x);
    }
    pop(): number {
        for (let i = 0; i < this.q.length - 1; i++) {
            this.q.push(this.q.shift()!);
        }
        return this.q.shift()!;
    }
    top(): number {
        return this.q[this.q.length - 1];
    }
    empty(): boolean {
        return this.q.length === 0;
    }
}`,

  python: `import collections

class MyStack:
    def __init__(self):
        self.q = collections.deque()
    def push(self, x: int) -> None:
        self.q.append(x)
    def pop(self) -> int:
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())
        return self.q.popleft()
    def top(self) -> int:
        return self.q[-1]
    def empty(self) -> bool:
        return len(self.q) == 0`,

  java: `class MyStack {
    private Deque<Integer> q;
    public MyStack() {
        q = new LinkedList<>();
    }
    public void push(int x) {
        q.addLast(x);
    }
    public int pop() {
        int size = q.size();
        for (int i = 0; i < size - 1; i++) {
            q.addLast(q.removeFirst());
        }
        return q.removeFirst();
    }
    public int top() {
        return q.peekLast();
    }
    public boolean empty() {
        return q.isEmpty();
    }
}`,

  cpp: `class MyStack {
private:
    queue<int> q;
public:
    MyStack() {
    }
    void push(int x) {
        q.push(x);
    }
    int pop() {
        int currentSize = q.size();
        for (int i = 0; i < currentSize - 1; ++i) {
            q.push(q.front());
            q.pop();
        }
        int poppedValue = q.front();
        q.pop();
        return poppedValue;
    }
    int top() {
        return q.back();
    }
    bool empty() {
        return q.empty();
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

  // 1. Init MyStack
  steps.push({
    queue: [],
    conceptualStack: [],
    activeOperation: 'init',
    highlightedQueueIdx: null,
    variables: { q: '[]' },
    explanation: "Initialize an empty queue 'q' which will be used to simulate LIFO behavior.",
    pseudoStep: "CALL MyStack()"
  });
  addLines(3, 3, 3, 5);

  // 2. push(1)
  steps.push({
    queue: [],
    conceptualStack: [],
    activeOperation: 'push',
    activeValue: 1,
    highlightedQueueIdx: null,
    variables: { x: 1, q: '[]' },
    explanation: "Pushing 1 onto the stack. We first prepare to add it to the back of our queue.",
    pseudoStep: "CALL push(x = 1)"
  });
  addLines(6, 5, 6, 7);

  // 3. push(1) actual
  steps.push({
    queue: [1],
    conceptualStack: [1],
    activeOperation: 'push',
    activeValue: 1,
    highlightedQueueIdx: 0,
    variables: { x: 1, q: '[1]' },
    explanation: "1 is enqueued to the back of the queue.",
    pseudoStep: "CALL q.push(1)"
  });
  addLines(7, 6, 7, 8);

  // 4. push(2)
  steps.push({
    queue: [1],
    conceptualStack: [1],
    activeOperation: 'push',
    activeValue: 2,
    highlightedQueueIdx: null,
    variables: { x: 2, q: '[1]' },
    explanation: "Pushing 2 onto the stack. We prepare to enqueue it to the back.",
    pseudoStep: "CALL push(x = 2)"
  });
  addLines(6, 5, 6, 7);

  // 5. push(2) actual
  steps.push({
    queue: [1, 2],
    conceptualStack: [1, 2],
    activeOperation: 'push',
    activeValue: 2,
    highlightedQueueIdx: 1,
    variables: { x: 2, q: '[1, 2]' },
    explanation: "2 is enqueued to the back of the queue. The stack conceptually has 2 on top.",
    pseudoStep: "CALL q.push(2)"
  });
  addLines(7, 6, 7, 8);

  // 6. top()
  steps.push({
    queue: [1, 2],
    conceptualStack: [1, 2],
    activeOperation: 'top',
    highlightedQueueIdx: null,
    variables: { q: '[1, 2]', top: 2 },
    explanation: "Request the top element of the stack. We look at the element last pushed (at the back of the queue).",
    pseudoStep: "CALL top()"
  });
  addLines(15, 11, 16, 20);

  // 7. top() return
  steps.push({
    queue: [1, 2],
    conceptualStack: [1, 2],
    activeOperation: 'top',
    highlightedQueueIdx: 1,
    variables: { q: '[1, 2]', result: 2 },
    explanation: "Return the last element of the queue (which is 2) without removing it.",
    pseudoStep: "RETURN q[q.length - 1]  →  2"
  });
  addLines(16, 12, 17, 21);

  // 8. pop() start
  steps.push({
    queue: [1, 2],
    conceptualStack: [1, 2],
    activeOperation: 'pop',
    highlightedQueueIdx: null,
    variables: { q: '[1, 2]' },
    explanation: "Pop the top element. In a queue, we can only dequeue from the front. We need to rotate the queue to bring 2 to the front.",
    pseudoStep: "CALL pop()"
  });
  addLines(9, 7, 9, 10);

  // 9. pop() loop condition
  steps.push({
    queue: [1, 2],
    conceptualStack: [1, 2],
    activeOperation: 'pop',
    highlightedQueueIdx: null,
    variables: { q: '[1, 2]', i: 0, "length - 1": 1 },
    explanation: "Start a loop to rotate q.length - 1 elements (2 - 1 = 1 element) from the front to the back.",
    pseudoStep: "FOR i = 0  →  i < 1  →  YES ✓"
  });
  addLines(10, 8, 11, 12);

  // 10. pop() shift & push
  steps.push({
    queue: [2, 1],
    conceptualStack: [1, 2],
    activeOperation: 'pop',
    highlightedQueueIdx: 1, // index of rotated element
    variables: { q: '[2, 1]', i: 0, rotated: 1 },
    explanation: "Dequeue 1 from the front and enqueue it back to the tail of the queue.",
    pseudoStep: "CALL q.push(q.shift() = 1)"
  });
  addLines(11, 9, 12, 13);

  // 11. pop() loop ends
  steps.push({
    queue: [2, 1],
    conceptualStack: [1, 2],
    activeOperation: 'pop',
    highlightedQueueIdx: null,
    variables: { q: '[2, 1]' },
    explanation: "Rotation loop finished. The original top element (2) is now at the front of the queue.",
    pseudoStep: "LOOP END"
  });
  addLines(12, 9, 13, 15);

  // 12. pop() actual shift / pop
  steps.push({
    queue: [1],
    conceptualStack: [1],
    activeOperation: 'pop',
    highlightedQueueIdx: null,
    variables: { q: '[1]', popped: 2 },
    explanation: "Dequeue the front element (2) and return it. This completes the LIFO pop operation.",
    pseudoStep: "RETURN q.shift()  →  2"
  });
  addLines(13, 10, 14, 18);

  // 13. empty()
  steps.push({
    queue: [1],
    conceptualStack: [1],
    activeOperation: 'empty',
    highlightedQueueIdx: null,
    variables: { q: '[1]' },
    explanation: "Check if the stack is empty. We verify if the underlying queue size is 0.",
    pseudoStep: "CALL empty()"
  });
  addLines(18, 13, 19, 23);

  // 14. empty() return
  steps.push({
    queue: [1],
    conceptualStack: [1],
    activeOperation: 'empty',
    highlightedQueueIdx: null,
    variables: { q: '[1]', isEmpty: false },
    explanation: "The queue is not empty (size is 1). Return false.",
    pseudoStep: "RETURN q.length === 0  →  false"
  });
  addLines(19, 14, 20, 24);

  return { steps, stepLineNumbers };
}

export const ImplementStackUsingQueuesVisualization: React.FC = () => {
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
              Implement Stack using Queues
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 pb-4">
                
                {/* 1. Actual Single Queue View (Horizontal) */}
                <div className="flex flex-col items-center">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6">Actual Single Queue (FIFO)</h4>
                  
                  <div className="relative flex items-center justify-center min-h-[140px] w-full">
                    {currentStep.queue.length === 0 ? (
                      <span className="text-xs text-muted-foreground/40 italic">Queue Empty</span>
                    ) : (
                      <div className="flex items-center gap-1.5 border-y-2 border-dashed border-zinc-200 dark:border-zinc-800 px-6 py-4 rounded-lg bg-muted/5 relative">
                        {/* Front indicator */}
                        <span className="absolute -left-1 text-[8px] font-bold uppercase tracking-tighter text-blue-500 bg-blue-100/80 dark:bg-blue-950/60 px-1 py-0.5 rounded border border-blue-500/20">
                          Front
                        </span>

                        {currentStep.queue.map((val, idx) => {
                          const isHighlighted = currentStep.highlightedQueueIdx === idx;
                          return (
                            <div 
                              key={idx} 
                              className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-black transition-all duration-200 text-xs ${
                                isHighlighted
                                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 scale-110 shadow-sm'
                                  : 'border-border bg-card text-foreground'
                              }`}
                            >
                              {val}
                            </div>
                          );
                        })}

                        {/* Back indicator */}
                        <span className="absolute -right-1 text-[8px] font-bold uppercase tracking-tighter text-violet-500 bg-violet-100/80 dark:bg-violet-950/60 px-1 py-0.5 rounded border border-violet-500/20">
                          Back
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Conceptual Stack View (Vertical) */}
                <div className="flex flex-col items-center border-t md:border-t-0 md:border-l border-border/40 pt-6 md:pt-0">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6">Conceptual Stack (LIFO)</h4>
                  
                  <div className="border-b-4 border-x-4 border-dashed border-zinc-300 dark:border-zinc-800 rounded-b-xl w-28 min-h-[140px] flex flex-col-reverse justify-start items-center p-3 gap-2 bg-muted/5 shadow-inner">
                    {currentStep.conceptualStack.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground/30 italic text-center my-auto">Stack Empty</span>
                    ) : (
                      currentStep.conceptualStack.map((val, idx) => {
                        const isTop = idx === currentStep.conceptualStack.length - 1;
                        return (
                          <div 
                            key={idx}
                            className={`w-20 h-8 flex items-center justify-between px-3 rounded-lg border font-mono text-xs ${
                              isTop 
                                ? 'border-primary bg-primary/10 text-primary font-bold' 
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
          {/* Variable section below the editor as requested */}
          <VariablePanel variables={currentStep.variables} />
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
