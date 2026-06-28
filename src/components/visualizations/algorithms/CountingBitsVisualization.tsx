import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function countBits(n: number): number[] {
    const ans: number[] = new Array(n + 1).fill(0);
    let offset = 1;
    for (let i = 1; i <= n; i++) {
        if (i === offset * 2) {
            offset = i;
        }
        ans[i] = 1 + ans[i - offset];
    }
    return ans;
}`,
  python: `def countBits(n: int):
    ans = [0] * (n + 1)
    offset = 1
    for i in range(1, n + 1):
        if i == offset * 2:
            offset = i
        ans[i] = 1 + ans[i - offset]
    return ans`,
  java: `public int[] countBits(int n) {
    int[] ans = new int[n + 1];
    int offset = 1;
    for (int i = 1; i <= n; i++) {
        if (i == offset * 2) {
            offset = i;
        }
        ans[i] = 1 + ans[i - offset];
    }
    return ans;
}`,
  cpp: `vector<int> countBits(int n) {
    vector<int> ans(n + 1, 0);
    int offset = 1;
    for (int i = 1; i <= n; i++) {
        if (i == offset * 2) {
            offset = i;
        }
        ans[i] = 1 + ans[i - offset];
    }
    return ans;
}`
};

export const CountingBitsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({
    typescript: [],
    python: [],
    java: [],
    cpp: []
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const n = 8;
    const generatedSteps: Step[] = [];
    const stepLines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLines.typescript!.push(ts);
      stepLines.python!.push(py);
      stepLines.java!.push(java);
      stepLines.cpp!.push(cpp);
    };

    const dp = new Array(n + 1).fill(0);

    // Function Entry
    generatedSteps.push({
      array: [...dp],
      highlights: [],
      variables: { n, i: '-', offset: '-' },
      explanation: `Count set bits for all numbers from 0 to ${n}.`,
      pseudoStep: "FUNCTION countBits(n)"
    });
    addLines(1, 1, 1, 1);

    // Array Init
    generatedSteps.push({
      array: [...dp],
      highlights: [],
      variables: { n, i: '-', offset: '-' },
      explanation: `Initialize ans array of size ${n + 1} with 0s.`,
      pseudoStep: "SET ans = [0] * (n + 1)"
    });
    addLines(2, 2, 2, 2);

    let offset = 1;
    // Offset Init
    generatedSteps.push({
      array: [...dp],
      highlights: [],
      variables: { n, i: '-', offset },
      explanation: "Initialize offset to 1 to track the latest power of 2.",
      pseudoStep: "SET offset = 1"
    });
    addLines(3, 3, 3, 3);

    for (let i = 1; i <= n; i++) {
      // Loop Check i
      generatedSteps.push({
        array: [...dp],
        highlights: [i],
        variables: { n, i, offset },
        explanation: `Processing number i = ${i}.`,
        pseudoStep: `FOR i = ${i} to ${n}`
      });
      addLines(4, 4, 4, 4);

      // Power of 2 check
      generatedSteps.push({
        array: [...dp],
        highlights: [i],
        variables: { n, i, offset },
        explanation: `Check if i (${i}) is the next power of 2 (i === offset * 2 = ${offset * 2}).`,
        pseudoStep: `IF i == offset * 2`
      });
      addLines(5, 5, 5, 5);

      if (i === offset * 2) {
        offset = i;
        generatedSteps.push({
          array: [...dp],
          highlights: [i],
          variables: { n, i, offset },
          explanation: `New power of 2 detected. Update offset to ${offset}.`,
          pseudoStep: "SET offset = i"
        });
        addLines(6, 6, 6, 6);
      }

      dp[i] = 1 + dp[i - offset];
      generatedSteps.push({
        array: [...dp],
        highlights: [i, i - offset],
        variables: { n, i, offset },
        explanation: `Calculate set bits for ${i} using dynamic programming: ans[${i}] = 1 + ans[${i} - ${offset}] = 1 + ans[${i - offset}] = ${dp[i]}.`,
        pseudoStep: `SET ans[i] = 1 + ans[i - offset]`
      });
      addLines(8, 7, 8, 8);
    }

    // Return
    generatedSteps.push({
      array: [...dp],
      highlights: [],
      variables: { n, i: '-', offset },
      explanation: `Return the final computed ans array: [${dp.join(', ')}].`,
      pseudoStep: "RETURN ans"
    });
    addLines(10, 8, 10, 10);

    setSteps(generatedSteps);
    setStepLineNumbers(stepLines);
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-4">
              <h3 className="text-xs font-semibold mb-6 text-muted-foreground uppercase tracking-widest text-center">
                Counting Bits (DP)
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-center text-muted-foreground">DP Array (ans)</div>
                  <div className="flex items-center justify-center gap-2 flex-wrap min-h-[90px]">
                    {currentStep.array.map((value, index) => {
                      const isHighlighted = currentStep.highlights.includes(index);
                      return (
                        <div key={index} className="flex flex-col items-center gap-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                            isHighlighted
                              ? 'bg-primary/20 border-primary text-primary scale-110 shadow-lg'
                              : 'bg-muted/50 border-border text-foreground'
                          }`}>
                            {value}
                          </div>
                          <span className="text-[10px] text-muted-foreground">[{index}]</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
                  <div className="font-bold text-muted-foreground">DP Relation Logic:</div>
                  <div>• Any number <span className="font-semibold font-mono text-primary">i</span> can be broken into: <span className="font-semibold font-mono text-primary">1 + ans[i - offset]</span>.</div>
                  <div>• The <span className="font-semibold font-mono">1</span> represents the most significant bit (the offset power of 2).</div>
                  <div>• <span className="font-semibold font-mono text-primary">ans[i - offset]</span> retrieves the set bits for the remaining value.</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm font-medium leading-relaxed min-h-[40px]">{currentStep.explanation}</p>
            </Card>
            <VariablePanel variables={currentStep.variables} />
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
      }
    />
  );
};