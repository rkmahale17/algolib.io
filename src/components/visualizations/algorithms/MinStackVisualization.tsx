import { useState, useMemo } from 'react';
import { Database, Plus, Trash, Eye, Minimize2, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  operation: string;
  args?: number[];
  stack: number[];
  minStack: number[];
  returnValue?: number | string;
  activeOp: number;
  explanation: string;
  variables: Record<string, any>;
  highlightedStackIndex?: number | null;
  highlightedMinStackIndex?: number | null;
  pseudoStep: string;
}

const OPERATIONS = [
  { name: 'Constructor()', type: 'init' },
  { name: 'push(-2)', type: 'push', val: -2 },
  { name: 'push(0)', type: 'push', val: 0 },
  { name: 'push(-3)', type: 'push', val: -3 },
  { name: 'getMin()', type: 'getMin' },
  { name: 'pop()', type: 'pop' },
  { name: 'top()', type: 'top' },
  { name: 'getMin()', type: 'getMin' },
];

const languages: VisualizationLanguageMap = {
  typescript: `class MinStack {
  private stack: number[];
  private minStack: number[];
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val: number): void {
    this.stack.push(val);
    const minVal =
      this.minStack.length > 0
        ? Math.min(val, this.minStack[this.minStack.length - 1])
        : val;
    this.minStack.push(minVal);
  }
  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }
  top(): number {
    return this.stack[this.stack.length - 1];
  }
  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}`,
  python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.minStack = []
    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.minStack:
            min_val_to_push = val
        else:
            min_val_to_push = min(val, self.minStack[-1])
        self.minStack.append(min_val_to_push)
    def pop(self) -> None:
        self.stack.pop()
        self.minStack.pop()
    def top(self) -> int:
        return self.stack[-1]
    def getMin(self) -> int:
        return self.minStack[-1]`,
  java: `class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;
    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }
    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        } else {
            minStack.push(minStack.peek());
        }
    }
    public void pop() {
        stack.pop();
        minStack.pop();
    }
    public int top() {
        return stack.peek();
    }
    public int getMin() {
        return minStack.peek();
    }
}`,
  cpp: `#include <vector>
#include <algorithm>
class MinStack {
private:
    vector<int> stack;
    vector<int> minStack;
public:
    MinStack() {
    }
    void push(int val) {
        stack.push_back(val);
        if (minStack.empty()) {
            minStack.push_back(val);
        } else {
            minStack.push_back(min(val, minStack.back()));
        }
    }
    void pop() {
        stack.pop_back();
        minStack.pop_back();
    }
    int top() {
        return stack.back();
    }
    int getMin() {
        return minStack.back();
    }
};`
};

export const MinStackVisualization = () => {
  const steps: Step[] = [
    {
      operation: 'Constructor()',
      stack: [],
      minStack: [],
      activeOp: 0,
      explanation: 'We initialize an empty MinStack. Behind the scenes, we create two empty arrays: stack for our main values, and minStack to track the minimum element at each level.',
      variables: {
        stack: '[]',
        minStack: '[]',
        returnValue: 'undefined',
      },
      pseudoStep: "MinStack()",
    },
    {
      operation: 'push(-2)',
      args: [-2],
      stack: [-2],
      minStack: [],
      activeOp: 1,
      explanation: 'First, we push the value -2 onto the main stack. Next, we must determine the minimum value to push onto the minStack.',
      variables: {
        val: -2,
        stack: '[-2]',
        minStack: '[]',
        returnValue: 'void',
      },
      highlightedStackIndex: 0,
      pseudoStep: "push(-2)  →  stack.push(-2)",
    },
    {
      operation: 'push(-2)',
      args: [-2],
      stack: [-2],
      minStack: [-2],
      activeOp: 1,
      explanation: 'Since the minStack is currently empty, the minimum value at this level is -2. We push -2 onto the minStack.',
      variables: {
        val: -2,
        stack: '[-2]',
        minStack: '[-2]',
        minVal: -2,
        returnValue: 'void',
      },
      highlightedStackIndex: 0,
      highlightedMinStackIndex: 0,
      pseudoStep: "minStack.push(-2)",
    },
    {
      operation: 'push(0)',
      args: [0],
      stack: [-2, 0],
      minStack: [-2],
      activeOp: 2,
      explanation: 'We push the value 0 onto the main stack.',
      variables: {
        val: 0,
        stack: '[-2, 0]',
        minStack: '[-2]',
        returnValue: 'void',
      },
      highlightedStackIndex: 1,
      pseudoStep: "push(0)  →  stack.push(0)",
    },
    {
      operation: 'push(0)',
      args: [0],
      stack: [-2, 0],
      minStack: [-2, -2],
      activeOp: 2,
      explanation: 'We compare the new value (0) with the current minimum on top of the minStack (-2). The minimum of {0, -2} is -2. We push -2 onto the minStack.',
      variables: {
        val: 0,
        stack: '[-2, 0]',
        minStack: '[-2, -2]',
        minVal: -2,
        returnValue: 'void',
      },
      highlightedStackIndex: 1,
      highlightedMinStackIndex: 1,
      pseudoStep: "minStack.push(min(-2, 0))  →  -2",
    },
    {
      operation: 'push(-3)',
      args: [-3],
      stack: [-2, 0, -3],
      minStack: [-2, -2],
      activeOp: 3,
      explanation: 'We push the value -3 onto the main stack.',
      variables: {
        val: -3,
        stack: '[-2, 0, -3]',
        minStack: '[-2, -2]',
        returnValue: 'void',
      },
      highlightedStackIndex: 2,
      pseudoStep: "push(-3)  →  stack.push(-3)",
    },
    {
      operation: 'push(-3)',
      args: [-3],
      stack: [-2, 0, -3],
      minStack: [-2, -2, -3],
      activeOp: 3,
      explanation: 'We compare the new value (-3) with the current minimum on top of the minStack (-2). The minimum of {-3, -2} is -3. We push -3 onto the minStack.',
      variables: {
        val: -3,
        stack: '[-2, 0, -3]',
        minStack: '[-2, -2, -3]',
        minVal: -3,
        returnValue: 'void',
      },
      highlightedStackIndex: 2,
      highlightedMinStackIndex: 2,
      pseudoStep: "minStack.push(min(-2, -3))  →  -3",
    },
    {
      operation: 'getMin()',
      stack: [-2, 0, -3],
      minStack: [-2, -2, -3],
      activeOp: 4,
      explanation: 'We retrieve the minimum element by peeking at the top of the minStack. This returns -3 in constant O(1) time.',
      variables: {
        stack: '[-2, 0, -3]',
        minStack: '[-2, -2, -3]',
        returnValue: -3,
      },
      highlightedMinStackIndex: 2,
      pseudoStep: "getMin()  →  minStack.peek()  →  -3",
    },
    {
      operation: 'pop()',
      stack: [-2, 0],
      minStack: [-2, -2],
      activeOp: 5,
      explanation: 'We pop the top elements from both stack and minStack simultaneously. This removes the element -3 and its corresponding minimum value, keeping both stacks in sync.',
      variables: {
        stack: '[-2, 0]',
        minStack: '[-2, -2]',
        returnValue: 'void',
      },
      highlightedStackIndex: 2,
      highlightedMinStackIndex: 2,
      pseudoStep: "pop()  →  stack.pop(), minStack.pop()",
    },
    {
      operation: 'top()',
      stack: [-2, 0],
      minStack: [-2, -2],
      activeOp: 6,
      explanation: 'We retrieve the top element of the main stack, which is 0. This operation takes constant O(1) time.',
      variables: {
        stack: '[-2, 0]',
        minStack: '[-2, -2]',
        returnValue: 0,
      },
      highlightedStackIndex: 1,
      pseudoStep: "top()  →  stack.peek()  →  0",
    },
    {
      operation: 'getMin()',
      stack: [-2, 0],
      minStack: [-2, -2],
      activeOp: 7,
      explanation: 'We retrieve the minimum element from the top of the minStack, which is now -2.',
      variables: {
        stack: '[-2, 0]',
        minStack: '[-2, -2]',
        returnValue: -2,
      },
      highlightedMinStackIndex: 1,
      pseudoStep: "getMin()  →  minStack.peek()  →  -2",
    },
  ];

  const stepLineNumbers: StepLineNumberMap = {
    typescript: [
      4, // 0
      9, // 1
      10, // 2
      9, // 3
      10, // 4
      9, // 5
      10, // 6
      23, // 7
      16, // 8
      20, // 9
      23 // 10
    ],
    python: [
      2, // 0
      6, // 1
      7, // 2
      6, // 3
      7, // 4
      6, // 5
      7, // 6
      17, // 7
      12, // 8
      15, // 9
      17 // 10
    ],
    java: [
      4, // 0
      9, // 1
      10, // 2
      9, // 3
      10, // 4
      9, // 5
      10, // 6
      23, // 7
      16, // 8
      20, // 9
      23 // 10
    ],
    cpp: [
      8, // 0
      11, // 1
      12, // 2
      11, // 3
      12, // 4
      11, // 5
      12, // 6
      25, // 7
      18, // 8
      22, // 9
      25 // 10
    ]
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  const getOpIcon = (type: string) => {
    switch (type) {
      case 'init':
        return <Database className="w-3.5 h-3.5" />;
      case 'push':
        return <Plus className="w-3.5 h-3.5" />;
      case 'pop':
        return <Trash className="w-3.5 h-3.5" />;
      case 'top':
        return <Eye className="w-3.5 h-3.5" />;
      case 'getMin':
        return <Minimize2 className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            {/* Operation Sequence Flow */}
            <Card className="p-4 bg-card border border-border/50 shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Operation Sequence
              </span>
              <div className="flex flex-wrap gap-2">
                {OPERATIONS.map((op, idx) => {
                  const isActive = currentStep.activeOp === idx;
                  const isProcessed = idx < currentStep.activeOp;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-300 border ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(var(--primary),0.3)] ring-2 ring-primary/20 scale-105'
                          : isProcessed
                          ? 'bg-muted/40 border-muted text-muted-foreground opacity-60'
                          : 'bg-card border-border text-foreground/80'
                      }`}
                    >
                      {getOpIcon(op.type)}
                      <span>{op.name}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Stacks Container */}
            <Card className="p-6 bg-card border border-border/50 shadow-sm">
              <div className="grid grid-cols-2 gap-8 relative">
                {/* Main Stack */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                    Main Stack (<span className="text-primary">stack</span>)
                  </span>
                  
                  {/* The Stack Box Visual (U-shape container) */}
                  <div className="w-full max-w-[160px] h-60 border-4 border-t-0 border-primary/30 rounded-b-2xl p-3 bg-muted/5 flex flex-col-reverse gap-2 relative">
                    {/* Empty stack indicator */}
                    {currentStep.stack.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground italic">
                        Empty
                      </div>
                    )}
                    {currentStep.stack.map((val, idx) => {
                      const isHighlighted = currentStep.highlightedStackIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`w-full h-12 flex items-center justify-center rounded-xl font-mono text-sm font-bold border transition-all duration-200 ${
                            isHighlighted
                              ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.4)] scale-102 z-10'
                              : 'bg-card text-foreground border-border/80'
                          }`}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Min Stack */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                    Min Stack (<span className="text-indigo-400">minStack</span>)
                  </span>

                  {/* The Stack Box Visual (U-shape container) */}
                  <div className="w-full max-w-[160px] h-60 border-4 border-t-0 border-indigo-500/30 rounded-b-2xl p-3 bg-muted/5 flex flex-col-reverse gap-2 relative">
                    {/* Empty stack indicator */}
                    {currentStep.minStack.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground italic">
                        Empty
                      </div>
                    )}
                    {currentStep.minStack.map((val, idx) => {
                      const isHighlighted = currentStep.highlightedMinStackIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`w-full h-12 flex items-center justify-center rounded-xl font-mono text-sm font-bold border transition-all duration-200 ${
                            isHighlighted
                              ? 'bg-indigo-500 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-102 z-10'
                              : 'bg-card text-foreground border-border/80'
                          }`}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Horizontal Connecting Guides (Dashed Lines) */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-end gap-2 p-3 pt-16 max-w-[160px] mx-auto left-0 right-0">
                  {Array.from({ length: Math.max(currentStep.stack.length, currentStep.minStack.length) }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-12 flex items-center justify-center"
                      style={{
                        visibility: idx < currentStep.stack.length && idx < currentStep.minStack.length ? 'visible' : 'hidden',
                      }}
                    >
                      <div className="w-24 border-t-2 border-dashed border-border/40" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm flex items-center min-h-[70px]">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Narrative
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90">
                    {currentStep.explanation}
                  </p>
                </div>
              </div>
            </Card>
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
    </div>
  );
};
export default MinStackVisualization;
