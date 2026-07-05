import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  bits: string[];
  bitsPrev?: string[];
  showPrev?: boolean;
}

const languages: VisualizationLanguageMap = {
  typescript: `function hammingWeight(n: number): number {
    let count = 0;
    while (n !== 0) {
        n = n & (n - 1);
        count++;
    }
    return count;
}`,
  python: `def hammingWeight(n: int) -> int:
    count = 0
    while n != 0:
        n = n & (n - 1)
        count += 1
    return count`,
  java: `public static class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n = n & (n - 1);
            count++;
        }
        return count;
    }
}`,
  cpp: `class Solution {
public:
    int hammingWeight(unsigned int n) {
        int count = 0;
        while (n != 0) {
            n = n & (n - 1);
            count++;
        }
        return count;
    }
};`
};

export const NumberOf1BitsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({
    typescript: [],
    python: [],
    java: [],
    cpp: []
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
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

    // Step 0: start
    generatedSteps.push({
      variables: { n: 11, nBinary: '00001011', count: '-' },
      explanation: "Start counting set bits of n = 11 (binary 00001011) using Brian Kernighan's Algorithm.",
      pseudoStep: "FUNCTION hammingWeight(n)",
      bits: ['0', '0', '0', '0', '1', '0', '1', '1']
    });
    addLines(1, 1, 3, 4);

    // Step 1: count init
    let count = 0;
    generatedSteps.push({
      variables: { n: 11, nBinary: '00001011', count },
      explanation: `Initialize count = ${count}.`,
      pseudoStep: "SET count = 0",
      bits: ['0', '0', '0', '0', '1', '0', '1', '1']
    });
    addLines(2, 2, 4, 5);

    // Step 2: Loop check 1
    generatedSteps.push({
      variables: { n: 11, nBinary: '00001011', count },
      explanation: "Check if n !== 0. Since n is 11, we enter the loop.",
      pseudoStep: "WHILE n != 0",
      bits: ['0', '0', '0', '0', '1', '0', '1', '1']
    });
    addLines(3, 3, 5, 6);

    // Step 3: n = n & (n - 1)
    generatedSteps.push({
      variables: { n: 11, nBinary: '00001011', count, prevN: 10, prevNBinary: '00001010' },
      explanation: "n & (n - 1) clears the rightmost set bit: 11 (00001011) & 10 (00001010) = 10 (00001010).",
      pseudoStep: "SET n = n & (n - 1)",
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsPrev: ['0', '0', '0', '0', '1', '0', '1', '0'],
      showPrev: true
    });
    addLines(4, 4, 6, 7);

    // Step 4: count++
    count++;
    generatedSteps.push({
      variables: { n: 10, nBinary: '00001010', count },
      explanation: `Increment count of set bits: count = ${count}.`,
      pseudoStep: "SET count = count + 1",
      bits: ['0', '0', '0', '0', '1', '0', '1', '0']
    });
    addLines(5, 5, 7, 8);

    // Step 5: Loop check 2
    generatedSteps.push({
      variables: { n: 10, nBinary: '00001010', count },
      explanation: "Check if n !== 0. Since n is 10, continue loop.",
      pseudoStep: "WHILE n != 0",
      bits: ['0', '0', '0', '0', '1', '0', '1', '0']
    });
    addLines(3, 3, 5, 6);

    // Step 6: n = n & (n - 1)
    generatedSteps.push({
      variables: { n: 10, nBinary: '00001010', count, prevN: 9, prevNBinary: '00001001' },
      explanation: "Clear rightmost set bit: 10 (00001010) & 9 (00001001) = 8 (00001000).",
      pseudoStep: "SET n = n & (n - 1)",
      bits: ['0', '0', '0', '0', '1', '0', '1', '0'],
      bitsPrev: ['0', '0', '0', '0', '1', '0', '0', '1'],
      showPrev: true
    });
    addLines(4, 4, 6, 7);

    // Step 7: count++
    count++;
    generatedSteps.push({
      variables: { n: 8, nBinary: '00001000', count },
      explanation: `Increment count of set bits: count = ${count}.`,
      pseudoStep: "SET count = count + 1",
      bits: ['0', '0', '0', '0', '1', '0', '0', '0']
    });
    addLines(5, 5, 7, 8);

    // Step 8: Loop check 3
    generatedSteps.push({
      variables: { n: 8, nBinary: '00001000', count },
      explanation: "Check if n !== 0. Since n is 8, continue loop.",
      pseudoStep: "WHILE n != 0",
      bits: ['0', '0', '0', '0', '1', '0', '0', '0']
    });
    addLines(3, 3, 5, 6);

    // Step 9: n = n & (n - 1)
    generatedSteps.push({
      variables: { n: 8, nBinary: '00001000', count, prevN: 7, prevNBinary: '00000111' },
      explanation: "Clear rightmost set bit: 8 (00001000) & 7 (00000111) = 0 (00000000).",
      pseudoStep: "SET n = n & (n - 1)",
      bits: ['0', '0', '0', '0', '1', '0', '0', '0'],
      bitsPrev: ['0', '0', '0', '0', '0', '1', '1', '1'],
      showPrev: true
    });
    addLines(4, 4, 6, 7);

    // Step 10: count++
    count++;
    generatedSteps.push({
      variables: { n: 0, nBinary: '00000000', count },
      explanation: `Increment count of set bits: count = ${count}.`,
      pseudoStep: "SET count = count + 1",
      bits: ['0', '0', '0', '0', '0', '0', '0', '0']
    });
    addLines(5, 5, 7, 8);

    // Step 11: Loop check 4
    generatedSteps.push({
      variables: { n: 0, nBinary: '00000000', count },
      explanation: "Check if n !== 0. Since n is 0, exit loop.",
      pseudoStep: "WHILE n != 0",
      bits: ['0', '0', '0', '0', '0', '0', '0', '0']
    });
    addLines(3, 3, 5, 6);

    // Step 12: Return
    generatedSteps.push({
      variables: { n: 0, nBinary: '00000000', count, result: count },
      explanation: `Return the final count of set bits: ${count}.`,
      pseudoStep: "RETURN count",
      bits: ['0', '0', '0', '0', '0', '0', '0', '0']
    });
    addLines(7, 6, 8, 9);

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
                Number of 1 Bits (Hamming Weight)
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="text-xs font-semibold text-muted-foreground mb-3 text-center">
                    Value of n (Binary)
                  </div>
                  <div className="flex gap-1 justify-center mb-2">
                    {currentStep.bits.map((bit, idx) => (
                      <div key={idx} className={`w-8 h-8 flex items-center justify-center font-mono text-sm border rounded font-bold ${
                        bit === '1' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'
                      }`}>
                        {bit}
                      </div>
                    ))}
                  </div>
                  <div className="text-center font-mono text-xs text-primary font-bold">
                    Decimal: {currentStep.variables.n}
                  </div>
                </div>

                {currentStep.showPrev && currentStep.bitsPrev && (
                  <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10 animate-in fade-in duration-300">
                    <div className="text-xs font-semibold text-muted-foreground mb-3 text-center">
                      Value of n - 1 (Binary)
                    </div>
                    <div className="flex gap-1 justify-center mb-2">
                      {currentStep.bitsPrev.map((bit, idx) => (
                        <div key={idx} className={`w-8 h-8 flex items-center justify-center font-mono text-sm border rounded font-bold ${
                          bit === '1' ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-muted border-border text-muted-foreground'
                        }`}>
                          {bit}
                        </div>
                      ))}
                    </div>
                    <div className="text-center font-mono text-xs text-orange-500 font-bold">
                      Decimal: {currentStep.variables.prevN}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
                  <div className="font-bold text-muted-foreground">Brian Kernighan's Algorithm Intuition:</div>
                  <div>• The operation <span className="font-semibold text-primary font-mono">n & (n - 1)</span> clears the least significant (rightmost) set bit of <span className="font-semibold font-mono">n</span>.</div>
                  <div>• Instead of checking all 32 bits of an integer, we only loop as many times as there are 1 bits.</div>
                  <div>• This makes the algorithm run in <span className="font-semibold font-mono">O(k)</span> time where <span className="font-mono">k</span> is the number of 1 bits.</div>
                </div>
              </div>
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
          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
            <p className="text-sm font-medium leading-relaxed min-h-[40px]">{currentStep.explanation}</p>
          </Card>
          <VariablePanel variables={currentStep.variables} />
        </div>
      }
    />
  );
};