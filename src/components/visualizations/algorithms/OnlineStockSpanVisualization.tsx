import { useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  prices: number[];
  spans: number[];
  currentPrice: number | null;
  stack: [number, number][];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  python: `class StockSpanner:
    def __init__(self):
        self.stack = []

    def next(self, price: int) -> int:
        span = 1
        while self.stack and self.stack[-1][0] <= price:
            previous_price, previous_span = self.stack.pop()
            span += previous_span
        self.stack.append([price, span])
        return span`,

  typescript: `class StockSpanner {
    private stack: [number, number][];

    constructor() {
        this.stack = [];
    }

    next(price: number): number {
        let span = 1;
        while (this.stack.length > 0 && this.stack[this.stack.length - 1][0] <= price) {
            span += this.stack[this.stack.length - 1][1];
            this.stack.pop();
        }
        this.stack.push([price, span]);
        return span;
    }
}`,

  java: `class StockSpanner {
    private Deque<int[]> stack;

    public StockSpanner() {
        this.stack = new ArrayDeque<>();
    }

    public int next(int price) {
        int span = 1;
        while (!stack.isEmpty() && stack.peek()[0] <= price) {
            span += stack.pop()[1];
        }
        stack.push(new int[]{price, span});
        return span;
    }
}`,

  cpp: `class StockSpanner {
private:
    vector<pair<int, int>> stock_span_stack;

public:
    StockSpanner() {
    }

    int next(int price) {
        int current_span = 1;
        while (!stock_span_stack.empty() && stock_span_stack.back().first <= price) {
            current_span += stock_span_stack.back().second;
            stock_span_stack.pop_back();
        }
        stock_span_stack.push_back({price, current_span});
        return current_span;
    }
};`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const inputPrices = [100, 80, 60, 70, 60, 75, 85];
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

  steps.push({
    prices: [],
    spans: [],
    currentPrice: null,
    stack: [],
    variables: { span: '-' },
    explanation: 'Initialize an empty stack. The stack will store pairs of [price, span].',
    pseudoStep: 'SET stack = [] (empty stack of [price, span])',
  });
  addLines(5, 3, 5, 7);

  const stack: [number, number][] = [];
  const prices: number[] = [];
  const spans: number[] = [];

  for (let i = 0; i < inputPrices.length; i++) {
    const price = inputPrices[i];
    prices.push(price);
    
    steps.push({
      prices: [...prices],
      spans: [...spans],
      currentPrice: price,
      stack: [...stack],
      variables: { price, span: 1 },
      explanation: `Calling next(${price}). Initialize span = 1 because every price spans at least itself.`,
      pseudoStep: `CALL next(${price}): SET span = 1`,
    });
    addLines(9, 6, 9, 10);

    let span = 1;

    while (stack.length > 0 && stack[stack.length - 1][0] <= price) {
      steps.push({
        prices: [...prices],
        spans: [...spans],
        currentPrice: price,
        stack: [...stack],
        variables: { 
          price, 
          span, 
          'stack.top': `[${stack[stack.length - 1][0]}, ${stack[stack.length - 1][1]}]` 
        },
        explanation: `Stack is not empty and top price ${stack[stack.length - 1][0]} is <= ${price}. We can combine spans.`,
        pseudoStep: `WHILE stack not empty AND stack.top.price (${stack[stack.length - 1][0]}) <= ${price}  →  TRUE ✓`,
      });
      addLines(10, 7, 10, 11);

      span += stack[stack.length - 1][1];
      
      steps.push({
        prices: [...prices],
        spans: [...spans],
        currentPrice: price,
        stack: [...stack],
        variables: { 
          price, 
          span, 
          'stack.top': `[${stack[stack.length - 1][0]}, ${stack[stack.length - 1][1]}]` 
        },
        explanation: `Add top element's span (${stack[stack.length - 1][1]}) to current span. span becomes ${span}. Pop the top element.`,
        pseudoStep: `ADD stack.top.span to span, POP stack.top`,
      });
      addLines(11, 9, 11, 12);
      
      stack.pop();
    }

    steps.push({
      prices: [...prices],
      spans: [...spans],
      currentPrice: price,
      stack: [...stack],
      variables: { 
        price, 
        span, 
        'stack.top': stack.length > 0 ? `[${stack[stack.length - 1][0]}, ${stack[stack.length - 1][1]}]` : 'empty' 
      },
      explanation: stack.length === 0 
        ? `Stack is empty. Loop terminates.` 
        : `Top price ${stack[stack.length - 1][0]} > ${price}. Loop terminates.`,
      pseudoStep: `WHILE stack not empty AND stack.top.price <= ${price}  →  FALSE ✗`,
    });
    addLines(10, 7, 10, 11);

    stack.push([price, span]);
    spans.push(span);

    steps.push({
      prices: [...prices],
      spans: [...spans],
      currentPrice: price,
      stack: [...stack],
      variables: { price, span },
      explanation: `Push [${price}, ${span}] onto the stack and return span ${span}.`,
      pseudoStep: `PUSH [${price}, ${span}] to stack, RETURN ${span}`,
    });
    addLines(14, 10, 13, 15);
  }

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const OnlineStockSpanVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <div className="space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Visual state */}
        <div className="flex flex-col space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex-1">
            
            {/* Prices Stream */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-sm text-foreground">Prices Stream</h3>
              <div className="flex justify-start gap-2 flex-wrap min-h-[40px]">
                {currentStep.prices.map((p, idx) => {
                  const isActive = idx === currentStep.prices.length - 1 && currentStep.currentPrice !== null;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 sm:gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-primary border-primary scale-110 shadow-lg'
                          : 'bg-muted/50 border-border'
                      }`}>
                        <span className="font-semibold text-sm text-foreground">{p}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{currentStep.spans[idx] || '-'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monotonic Stack */}
            <div>
              <h3 className="font-semibold mb-4 text-sm text-foreground">Monotonic Stack [price, span]</h3>
              <div className="flex justify-start items-end gap-2 min-h-[140px] border-b-2 border-border/50 pb-2 overflow-x-auto">
                {currentStep.stack.map(([p, s], idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="w-16 h-12 bg-accent/30 rounded-md border-2 border-accent flex flex-col items-center justify-center transition-all duration-300">
                      <span className="font-semibold text-sm text-foreground">{p}</span>
                      <span className="text-[10px] text-muted-foreground">span: {s}</span>
                    </div>
                    {/* Replaced 'idx' label with text 'bottom' as requested to avoid index markings */}
                    <span className="text-[10px] text-muted-foreground">{idx === 0 ? 'bottom' : ''}</span>
                  </div>
                ))}
                {currentStep.stack.length === 0 && (
                  <div className="text-sm text-muted-foreground italic h-16 flex items-center">Stack is empty</div>
                )}
              </div>
            </div>

          </div>

          <div className="bg-muted/50 rounded-lg border border-border p-4 mt-auto">
            <p className="text-sm text-muted-foreground">{currentStep.explanation}</p>
          </div>
        </div>

        {/* Right column: Code and variables */}
        <div className="flex flex-col space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      </div>
    </div>
  );
};
