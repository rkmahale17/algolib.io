import { useState } from 'react';
import { Database, Plus, Trash, Eye, Minimize2, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  operation: string;
  args?: number[];
  stack: number[];
  minStack: number[];
  returnValue?: number | string;
  activeOp: number;
  lineNumber: number[];
  explanation: string;
  variables: Record<string, any>;
  highlightedStackIndex?: number | null;
  highlightedMinStackIndex?: number | null;
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

export const MinStackVisualization = () => {
  const code = `class MinStack {
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
}`;

  const steps: Step[] = [
    {
      operation: 'Constructor()',
      stack: [],
      minStack: [],
      activeOp: 0,
      lineNumber: [5, 6, 7, 8],
      explanation: 'We initialize an empty MinStack. Behind the scenes, we create two empty arrays: `stack` for our main values, and `minStack` to track the minimum element at each level.',
      variables: {
        stack: '[]',
        minStack: '[]',
        returnValue: 'undefined',
      },
    },
    {
      operation: 'push(-2)',
      args: [-2],
      stack: [-2],
      minStack: [],
      activeOp: 1,
      lineNumber: [10, 11],
      explanation: 'First, we push the value -2 onto the main `stack`. Next, we must determine the minimum value to push onto the `minStack`.',
      variables: {
        val: -2,
        stack: '[-2]',
        minStack: '[]',
        returnValue: 'void',
      },
      highlightedStackIndex: 0,
    },
    {
      operation: 'push(-2)',
      args: [-2],
      stack: [-2],
      minStack: [-2],
      activeOp: 1,
      lineNumber: [13, 14, 15, 16, 18],
      explanation: 'Since the `minStack` is currently empty, the minimum value at this level is -2. We push -2 onto the `minStack`.',
      variables: {
        val: -2,
        stack: '[-2]',
        minStack: '[-2]',
        minVal: -2,
        returnValue: 'void',
      },
      highlightedStackIndex: 0,
      highlightedMinStackIndex: 0,
    },
    {
      operation: 'push(0)',
      args: [0],
      stack: [-2, 0],
      minStack: [-2],
      activeOp: 2,
      lineNumber: [10, 11],
      explanation: 'We push the value 0 onto the main `stack`.',
      variables: {
        val: 0,
        stack: '[-2, 0]',
        minStack: '[-2]',
        returnValue: 'void',
      },
      highlightedStackIndex: 1,
    },
    {
      operation: 'push(0)',
      args: [0],
      stack: [-2, 0],
      minStack: [-2, -2],
      activeOp: 2,
      lineNumber: [13, 14, 15, 16, 18],
      explanation: 'We compare the new value (0) with the current minimum on top of the `minStack` (-2). The minimum of {0, -2} is -2. We push -2 onto the `minStack`.',
      variables: {
        val: 0,
        stack: '[-2, 0]',
        minStack: '[-2, -2]',
        minVal: -2,
        returnValue: 'void',
      },
      highlightedStackIndex: 1,
      highlightedMinStackIndex: 1,
    },
    {
      operation: 'push(-3)',
      args: [-3],
      stack: [-2, 0, -3],
      minStack: [-2, -2],
      activeOp: 3,
      lineNumber: [10, 11],
      explanation: 'We push the value -3 onto the main `stack`.',
      variables: {
        val: -3,
        stack: '[-2, 0, -3]',
        minStack: '[-2, -2]',
        returnValue: 'void',
      },
      highlightedStackIndex: 2,
    },
    {
      operation: 'push(-3)',
      args: [-3],
      stack: [-2, 0, -3],
      minStack: [-2, -2, -3],
      activeOp: 3,
      lineNumber: [13, 14, 15, 16, 18],
      explanation: 'We compare the new value (-3) with the current minimum on top of the `minStack` (-2). The minimum of {-3, -2} is -3. We push -3 onto the `minStack`.',
      variables: {
        val: -3,
        stack: '[-2, 0, -3]',
        minStack: '[-2, -2, -3]',
        minVal: -3,
        returnValue: 'void',
      },
      highlightedStackIndex: 2,
      highlightedMinStackIndex: 2,
    },
    {
      operation: 'getMin()',
      stack: [-2, 0, -3],
      minStack: [-2, -2, -3],
      activeOp: 4,
      lineNumber: [30, 31, 32],
      explanation: 'We retrieve the minimum element by peeking at the top of the `minStack`. This returns -3 in constant O(1) time.',
      variables: {
        stack: '[-2, 0, -3]',
        minStack: '[-2, -2, -3]',
        returnValue: -3,
      },
      highlightedMinStackIndex: 2,
    },
    {
      operation: 'pop()',
      stack: [-2, 0],
      minStack: [-2, -2],
      activeOp: 5,
      lineNumber: [21, 22, 23, 24],
      explanation: 'We pop the top elements from both `stack` and `minStack` simultaneously. This removes the element -3 and its corresponding minimum value, keeping both stacks in sync.',
      variables: {
        stack: '[-2, 0]',
        minStack: '[-2, -2]',
        returnValue: 'void',
      },
      highlightedStackIndex: 2,
      highlightedMinStackIndex: 2,
    },
    {
      operation: 'top()',
      stack: [-2, 0],
      minStack: [-2, -2],
      activeOp: 6,
      lineNumber: [26, 27, 28],
      explanation: 'We retrieve the top element of the main `stack`, which is 0. This operation takes constant O(1) time.',
      variables: {
        stack: '[-2, 0]',
        minStack: '[-2, -2]',
        returnValue: 0,
      },
      highlightedStackIndex: 1,
    },
    {
      operation: 'getMin()',
      stack: [-2, 0],
      minStack: [-2, -2],
      activeOp: 7,
      lineNumber: [30, 31, 32],
      explanation: 'We retrieve the minimum element from the top of the `minStack`, which is now -2.',
      variables: {
        stack: '[-2, 0]',
        minStack: '[-2, -2]',
        returnValue: -2,
      },
      highlightedMinStackIndex: 1,
    },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-0 border ${
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
                        className={`w-full h-12 flex items-center justify-center rounded-xl font-mono text-sm font-bold border transition-all duration-0 ${
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
                        className={`w-full h-12 flex items-center justify-center rounded-xl font-mono text-sm font-bold border transition-all duration-0 ${
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

          {/* Narrative Commentary Box - Positioned at the bottom (Rule 13) */}
          <Card className="p-4 border-l-4 border-primary bg-accent/40 shadow-sm flex items-center min-h-[70px]">
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

          {/* VariablePanel - Positioned below commentary box (Rule 13) */}
          <VariablePanel variables={currentStep.variables} />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={currentStep.lineNumber}
            language="typescript"
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
