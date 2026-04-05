import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  array: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  highlighting: number[];
}

export const ClimbingStairsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      array: [1], // Stair 0
      variables: { n: 5 },
      explanation: "Starting with n = 5. We need to find the number of ways to climb 5 stairs. At step 0 (ground), there is mathematically 1 way to be there.",
      highlightedLines: [1],
      lineExecution: "function climbStairs(n: number): number {",
      highlighting: [0]
    },
    {
      array: [1, 1], // Stair 0, Stair 1
      variables: { n: 5, one: 1, two: 1 },
      explanation: "Initialize one = 1 and two = 1.\n'one' tracks ways to reach the current top step, 'two' tracks ways for the step before it.",
      highlightedLines: [2, 3],
      lineExecution: "let one = 1;\nlet two = 1;",
      highlighting: [0, 1]
    },
    // i = 0
    {
      array: [1, 1],
      variables: { n: 5, one: 1, two: 1, i: 0 },
      explanation: "Start loop from i = 0 to n - 1 (which is 4).",
      highlightedLines: [4],
      lineExecution: "for (let i = 0; i < n - 1; i++)",
      highlighting: [1]
    },
    {
      array: [1, 1],
      variables: { n: 5, one: 1, two: 1, i: 0, temp: 1 },
      explanation: "Store current value of 'one' in 'temp'.",
      highlightedLines: [5],
      lineExecution: "const temp = one;",
      highlighting: [1]
    },
    {
      array: [1, 1, 2],
      variables: { n: 5, one: 2, two: 1, i: 0, temp: 1 },
      explanation: "Calculate ways to reach step 2.\nIt is the sum of ways to reach step 1 + ways to reach step 0 (1 + 1 = 2).",
      highlightedLines: [6],
      lineExecution: "one = one + two;",
      highlighting: [2]
    },
    {
      array: [1, 1, 2],
      variables: { n: 5, one: 2, two: 1, i: 0, temp: 1 },
      explanation: "Shift 'two' forward to 'temp' (the old step 1).",
      highlightedLines: [7],
      lineExecution: "two = temp;",
      highlighting: [2]
    },
    // i = 1
    {
      array: [1, 1, 2],
      variables: { n: 5, one: 2, two: 1, i: 1 },
      explanation: "Loop iteration i = 1 (Targeting step 3).",
      highlightedLines: [4],
      lineExecution: "for (let i = 0; i < n - 1; i++)",
      highlighting: [2]
    },
    {
      array: [1, 1, 2],
      variables: { n: 5, one: 2, two: 1, i: 1, temp: 2 },
      explanation: "Store 'one' (2) in 'temp'.",
      highlightedLines: [5],
      lineExecution: "const temp = one;",
      highlighting: [2]
    },
    {
      array: [1, 1, 2, 3],
      variables: { n: 5, one: 3, two: 1, i: 1, temp: 2 },
      explanation: "Calculate ways to reach step 3.\nIt is the sum of ways to reach step 2 + ways to reach step 1 (2 + 1 = 3).",
      highlightedLines: [6],
      lineExecution: "one = one + two;",
      highlighting: [3]
    },
    {
      array: [1, 1, 2, 3],
      variables: { n: 5, one: 3, two: 2, i: 1, temp: 2 },
      explanation: "Shift 'two' forward to 'temp' (the old step 2).",
      highlightedLines: [7],
      lineExecution: "two = temp;",
      highlighting: [3]
    },
    // i = 2
    {
      array: [1, 1, 2, 3],
      variables: { n: 5, one: 3, two: 2, i: 2 },
      explanation: "Loop iteration i = 2 (Targeting step 4).",
      highlightedLines: [4],
      lineExecution: "for (let i = 0; i < n - 1; i++)",
      highlighting: [3]
    },
    {
      array: [1, 1, 2, 3],
      variables: { n: 5, one: 3, two: 2, i: 2, temp: 3 },
      explanation: "Store 'one' (3) in 'temp'.",
      highlightedLines: [5],
      lineExecution: "const temp = one;",
      highlighting: [3]
    },
    {
      array: [1, 1, 2, 3, 5],
      variables: { n: 5, one: 5, two: 2, i: 2, temp: 3 },
      explanation: "Calculate ways to reach step 4.\nIt is the sum of ways to reach step 3 + ways to reach step 2 (3 + 2 = 5).",
      highlightedLines: [6],
      lineExecution: "one = one + two;",
      highlighting: [4]
    },
    {
      array: [1, 1, 2, 3, 5],
      variables: { n: 5, one: 5, two: 3, i: 2, temp: 3 },
      explanation: "Shift 'two' forward to 'temp' (the old step 3).",
      highlightedLines: [7],
      lineExecution: "two = temp;",
      highlighting: [4]
    },
    // i = 3
    {
      array: [1, 1, 2, 3, 5],
      variables: { n: 5, one: 5, two: 3, i: 3 },
      explanation: "Loop iteration i = 3 (Final calculation targeting step 5).",
      highlightedLines: [4],
      lineExecution: "for (let i = 0; i < n - 1; i++)",
      highlighting: [4]
    },
    {
      array: [1, 1, 2, 3, 5],
      variables: { n: 5, one: 5, two: 3, i: 3, temp: 5 },
      explanation: "Store 'one' (5) in 'temp'.",
      highlightedLines: [5],
      lineExecution: "const temp = one;",
      highlighting: [4]
    },
    {
      array: [1, 1, 2, 3, 5, 8],
      variables: { n: 5, one: 8, two: 3, i: 3, temp: 5 },
      explanation: "Calculate ways to reach step 5.\nIt is the sum of ways to reach step 4 + ways to reach step 3 (5 + 3 = 8).",
      highlightedLines: [6],
      lineExecution: "one = one + two;",
      highlighting: [5]
    },
    {
      array: [1, 1, 2, 3, 5, 8],
      variables: { n: 5, one: 8, two: 5, i: 3, temp: 5 },
      explanation: "Shift 'two' forward to 'temp'.",
      highlightedLines: [7],
      lineExecution: "two = temp;",
      highlighting: [5]
    },
    // End
    {
      array: [1, 1, 2, 3, 5, 8],
      variables: { n: 5, one: 8, two: 5, i: 4 },
      explanation: "Loop condition i < n - 1 is false. Loop completes.",
      highlightedLines: [4],
      lineExecution: "i < n - 1 -> false",
      highlighting: [5]
    },
    {
      array: [1, 1, 2, 3, 5, 8],
      variables: { n: 5, one: 8 },
      explanation: "Return 'one', which is 8.\nThere are 8 distinct ways to climb 5 stairs.",
      highlightedLines: [9],
      lineExecution: "return one;",
      highlighting: [5]
    }
  ];

  const code = `function climbStairs(n: number): number {
  let one = 1;
  let two = 1;
  for (let i = 0; i < n - 1; i++) {
    const temp = one;
    one = one + two;
    two = temp;
  }
  return one;
}`;

  const step = steps[currentStep];
  
  // Total stairs is n=5, plus step 0 (ground).
  const maxStairsCount = 6; 

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          {/* Staircase Visual */}
          <div>
            <Card className="p-8 bg-card/40 border-border/50 relative overflow-hidden flex flex-col items-center min-h-[300px]">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-12 border-b-2 border-primary/20 pb-2">
                Climbing Stairs (n = 5)
              </h3>
              
              <div className="relative w-full max-w-sm flex items-end justify-start h-[160px] pl-4">
                 {Array.from({ length: maxStairsCount }).map((_, idx) => {
                    const isCalculated = idx < step.array.length;
                    const val = isCalculated ? step.array[idx] : "?";
                    const isCurrent = step.highlighting.includes(idx);
                    
                    return (
                      <div key={idx} className="relative flex flex-col items-center">
                        {/* The Person Climber */}
                        {isCurrent && (
                          <div className="absolute -top-12 z-20 text-orange-500 scale-[2.5]">
                            <div className="-scale-x-100">🚶</div>
                          </div>
                        )}
                        
                        {/* Ways Value Tag */}
                        <div className={`absolute -top-6 text-[10px] font-black ${isCurrent ? 'text-orange-500' : isCalculated ? 'text-primary' : 'text-muted-foreground/30'}`}>
                           {val}
                        </div>

                        {/* The Stair Block */}
                        <div 
                          className={`w-[45px] border-l-2 border-t-2 relative flex items-center justify-center ${
                            isCurrent 
                              ? 'bg-orange-500/10 border-orange-500 shadow-[inset_0_0_12px_rgba(249,115,22,0.2)]' 
                              : isCalculated 
                                ? 'bg-primary/5 border-primary/50' 
                                : 'bg-muted/10 border-border/40 dashed opacity-50'
                          }`}
                          style={{
                            height: `${(idx * 20) + 16}px`
                          }}
                        >
                           <div className="absolute bottom-2 text-[8px] font-mono text-muted-foreground/40 font-black">
                             S{idx}
                           </div>
                        </div>
                      </div>
                    );
                 })}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-5 border-l-4 border-primary bg-primary/5 relative shadow-sm">
              <div className="space-y-4">
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                     Current Execution
                   </h4>
                   <div className="text-sm font-mono bg-background/80 p-2.5 rounded-lg border border-border/50 shadow-sm inline-block">
                     {step.lineExecution}
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                     Commentary
                   </h4>
                   <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                     {step.explanation}
                   </p>
                </div>
              </div>
            </Card>
          </div>

        </div>
      }
      rightContent={
        <div className="space-y-6 h-full flex flex-col">
          <div className="flex-1 overflow-hidden min-h-[400px]">
            <AnimatedCodeEditor
              code={code}
              language="typescript"
              highlightedLines={step.highlightedLines}
            />
          </div>
          <div className="p-1">
            <VariablePanel variables={step.variables} />
          </div>
        </div>
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