import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  highlighting: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  calc?: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function climbStairs(n: number): number {
  let one = 1;
  let two = 1;
  for (let i = 0; i < n - 1; i++) {
    const temp = one;
    one = one + two;
    two = temp;
  }
  return one;
}`,
  python: `def climbStairs(n: int) -> int:
    one, two = 1, 1
    for _ in range(n - 1):
        temp = one
        one = one + two
        two = temp
    return one`,
  java: `public int climbStairs(int n) {
    int one = 1;
    int two = 1;
    for (int i = 0; i < n - 1; i++) {
        int temp = one;
        one = one + two;
        two = temp;
    }
    return one;
}`,
  cpp: `int climbStairs(int n) {
    int one = 1;
    int two = 1;
    for (int i = 0; i < n - 1; i++) {
        int temp = one;
        one = one + two;
        two = temp;
    }
    return one;
}`
};

export const ClimbingStairsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const n = 5;

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    // Initial state
    s.push({
      array: [1, 1],
      highlighting: [0, 1],
      variables: { n, one: 1, two: 1 },
      explanation: "Initialize one = 1 and two = 1. 'one' represents the ways to reach the current stair (stair 1), and 'two' represents the ways to reach the previous stair (stair 0).",
      pseudoStep: "SET one = 1, two = 1"
    });
    addLines(2, 2, 2, 2);

    let one = 1;
    let two = 1;
    const currentArray = [1, 1];

    for (let i = 0; i < n - 1; i++) {
      // Loop check step
      s.push({
        array: [...currentArray],
        highlighting: [i + 1],
        variables: { n, one, two, i },
        explanation: `Check loop condition: i = ${i} < ${n - 1} (n - 1 = 4). We will compute ways to reach stair ${i + 2}.`,
        pseudoStep: `FOR i = 0 TO n-2 (i = ${i})`
      });
      addLines(4, 3, 4, 4);

      // temp = one
      const temp = one;
      s.push({
        array: [...currentArray],
        highlighting: [i + 1],
        variables: { n, one, two, i, temp },
        explanation: `Store current 'one' value in temp: temp = ${one}.`,
        pseudoStep: `SET temp = one (${one})`
      });
      addLines(5, 4, 5, 5);

      // one = one + two
      one = one + two;
      currentArray.push(one);
      s.push({
        array: [...currentArray],
        highlighting: [i + 2],
        variables: { n, one, two, i, temp },
        explanation: `Update 'one' as the sum of the last two stairs: one = one + two → ${temp} + ${two} = ${one}. The number of ways to reach stair ${i + 2} is ${one}.`,
        pseudoStep: `SET one = one + two (${temp} + ${two} = ${one})`,
        calc: `${temp} + ${two} = ${one}`
      });
      addLines(6, 5, 6, 6);

      // two = temp
      two = temp;
      s.push({
        array: [...currentArray],
        highlighting: [i + 2],
        variables: { n, one, two, i, temp },
        explanation: `Shift 'two' to take the previous value of 'one' stored in temp: two = ${two}.`,
        pseudoStep: `SET two = temp (${two})`
      });
      addLines(7, 6, 7, 7);
    }

    // Return step
    s.push({
      array: [...currentArray],
      highlighting: [n],
      variables: { n, one, two },
      explanation: `Loop terminates. Return the value of 'one' = ${one}, which represents the total number of ways to climb ${n} stairs.`,
      pseudoStep: `RETURN one (${one})`
    });
    addLines(9, 7, 9, 9);

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);
  const maxStairsCount = 6; // Stair 0 up to Stair 5

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 flex flex-col items-center">
              <h3 className="text-sm font-semibold mb-12 text-muted-foreground uppercase tracking-widest">
                Climbing Stairs (n = {n})
              </h3>
              <div className="relative w-full max-w-sm flex items-end justify-start h-[180px] pl-4">
                {Array.from({ length: maxStairsCount }).map((_, idx) => {
                  const isCalculated = idx < step.array.length;
                  const val = isCalculated ? step.array[idx] : "?";
                  const isCurrent = step.highlighting.includes(idx);

                  return (
                    <div key={idx} className="relative flex flex-col items-center">
                      {isCurrent && (
                        <div className="absolute -top-12 z-20 text-orange-500 scale-[2.5]">
                          <div className="-scale-x-100">🚶</div>
                        </div>
                      )}

                      <div
                        className={`absolute -top-6 text-[10px] font-black ${
                          isCurrent ? 'text-orange-500' : isCalculated ? 'text-primary' : 'text-muted-foreground/30'
                        }`}
                      >
                        {val}
                      </div>

                      <div
                        className={`w-[45px] border-l-2 border-t-2 relative flex items-center justify-center transition-all duration-200 ${
                          isCurrent
                            ? 'bg-orange-500/10 border-orange-500 shadow-[inset_0_0_12px_rgba(249,115,22,0.2)]'
                            : isCalculated
                              ? 'bg-primary/5 border-primary/50'
                              : 'bg-muted/10 border-border/40 dashed opacity-50'
                        }`}
                        style={{
                          height: `${(idx * 22) + 20}px`
                        }}
                      >
                        <div className="absolute bottom-2 text-[8px] font-mono text-muted-foreground/50 font-black">
                          S{idx}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {step.calc && (
              <Card className="p-4 bg-primary/5 border-primary/10">
                <h3 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wider">Calculation</h3>
                <p className="font-mono text-center text-lg font-bold">{step.calc}</p>
              </Card>
            )}
            
            <Card className="p-4 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">
                Why this works
              </h4>
              <p>
                To reach the n-th stair, we could have taken 1 step from the (n-1)-th stair or 2 steps from the (n-2)-th stair.
              </p>
              <p>
                Thus, the number of ways to reach stair n is the sum of ways to reach stair n-1 and n-2: `ways(n) = ways(n-1) + ways(n-2)`.
              </p>
              <p>
                This is exactly the Fibonacci sequence, which we compute iteratively in O(1) space using two variables.
              </p>
            </Card>
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
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">
              {step.explanation}
            </p>
          </Card>
          <VariablePanel variables={step.variables} />
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