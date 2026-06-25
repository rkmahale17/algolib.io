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
  bitsA: string[];
  bitsB: string[];
  bitsCarry?: string[];
}

const languages: VisualizationLanguageMap = {
  typescript: `function getSum(a: number, b: number): number {
    while (b !== 0) {
        const carry = a & b;
        a = a ^ b;
        b = carry << 1;
    }
    return a;
}`,
  python: `def getSum(a: int, b: int) -> int:
    MASK = 0xFFFFFFFF
    MAX  = 0x7FFFFFFF
    while b != 0:
        carry = (a & b) & MASK
        a = (a ^ b) & MASK
        b = (carry << 1) & MASK
    return a if a <= MAX else ~(a ^ MASK)`,
  java: `public static class Solution {
    public int getSum(int a, int b) {
        while (b != 0) {
            int carry = a & b;
            a = a ^ b;
            b = carry << 1;
        }
        return a;
    }
}`,
  cpp: `class Solution {
public:
    int getSum(int a, int b) {
        while (b != 0) {
            int carry = a & b;
            a = a ^ b;
            b = carry << 1;
        }
        return a;
    }
};`
};

export const SumOfTwoIntegersVisualization = () => {
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
      variables: { a: 3, b: 5, aBinary: '0011', bBinary: '0101', carry: '-', result: '-' },
      explanation: "Start bitwise addition: a = 3 (binary: 0011), b = 5 (binary: 0101). Goal is to sum without the '+' operator.",
      pseudoStep: "FUNCTION getSum(a, b)",
      bitsA: ['0', '0', '1', '1'],
      bitsB: ['0', '1', '0', '1']
    });
    addLines(1, 1, 2, 3);

    // Step 1: while check
    generatedSteps.push({
      variables: { a: 3, b: 5, aBinary: '0011', bBinary: '0101', carry: '-', result: '-' },
      explanation: "Check loop condition: b !== 0. Since b is 5, we enter the loop.",
      pseudoStep: "WHILE b != 0",
      bitsA: ['0', '0', '1', '1'],
      bitsB: ['0', '1', '0', '1']
    });
    addLines(2, 4, 3, 4);

    // Step 2: carry
    generatedSteps.push({
      variables: { a: 3, b: 5, aBinary: '0011', bBinary: '0101', carry: '0001', result: '-' },
      explanation: "Calculate carry by performing bitwise AND: carry = a & b = 0011 & 0101 = 0001 (carry occurs where both bits are 1).",
      pseudoStep: "SET carry = a & b",
      bitsA: ['0', '0', '1', '1'],
      bitsB: ['0', '1', '0', '1'],
      bitsCarry: ['0', '0', '0', '1']
    });
    addLines(3, 5, 4, 5);

    // Step 3: a = a ^ b
    generatedSteps.push({
      variables: { a: 6, b: 5, aBinary: '0110', bBinary: '0101', carry: '0001', result: '-' },
      explanation: "Calculate XOR sum (sum ignoring carries): a = a ^ b = 0011 ^ 0101 = 0110 (6).",
      pseudoStep: "SET a = a ^ b",
      bitsA: ['0', '1', '1', '0'],
      bitsB: ['0', '1', '0', '1']
    });
    addLines(4, 6, 5, 6);

    // Step 4: b = carry << 1
    generatedSteps.push({
      variables: { a: 6, b: 2, aBinary: '0110', bBinary: '0010', carry: '0001', result: '-' },
      explanation: "Shift carry left by 1 bit to prepare it for addition at the next higher position: b = carry << 1 = 0010 (2).",
      pseudoStep: "SET b = carry << 1",
      bitsA: ['0', '1', '1', '0'],
      bitsB: ['0', '0', '1', '0']
    });
    addLines(5, 7, 6, 7);

    // Step 5: loop check
    generatedSteps.push({
      variables: { a: 6, b: 2, aBinary: '0110', bBinary: '0010', carry: '-', result: '-' },
      explanation: "Loop check: b is 2, which is not 0, so continue adding carries.",
      pseudoStep: "WHILE b != 0",
      bitsA: ['0', '1', '1', '0'],
      bitsB: ['0', '0', '1', '0']
    });
    addLines(2, 4, 3, 4);

    // Step 6: carry
    generatedSteps.push({
      variables: { a: 6, b: 2, aBinary: '0110', bBinary: '0010', carry: '0010', result: '-' },
      explanation: "Calculate new carry: carry = a & b = 0110 & 0010 = 0010.",
      pseudoStep: "SET carry = a & b",
      bitsA: ['0', '1', '1', '0'],
      bitsB: ['0', '0', '1', '0'],
      bitsCarry: ['0', '0', '1', '0']
    });
    addLines(3, 5, 4, 5);

    // Step 7: a = a ^ b
    generatedSteps.push({
      variables: { a: 4, b: 2, aBinary: '0100', bBinary: '0010', carry: '0010', result: '-' },
      explanation: "Apply XOR sum: a = a ^ b = 0110 ^ 0010 = 0100 (4).",
      pseudoStep: "SET a = a ^ b",
      bitsA: ['0', '1', '0', '0'],
      bitsB: ['0', '0', '1', '0']
    });
    addLines(4, 6, 5, 6);

    // Step 8: b = carry << 1
    generatedSteps.push({
      variables: { a: 4, b: 4, aBinary: '0100', bBinary: '0100', carry: '0010', result: '-' },
      explanation: "Shift carry left: b = carry << 1 = 0010 << 1 = 0100 (4).",
      pseudoStep: "SET b = carry << 1",
      bitsA: ['0', '1', '0', '0'],
      bitsB: ['0', '1', '0', '0']
    });
    addLines(5, 7, 6, 7);

    // Step 9: loop check
    generatedSteps.push({
      variables: { a: 4, b: 4, aBinary: '0100', bBinary: '0100', carry: '-', result: '-' },
      explanation: "Loop check: b is 4, which is not 0, so continue adding carries.",
      pseudoStep: "WHILE b != 0",
      bitsA: ['0', '1', '0', '0'],
      bitsB: ['0', '1', '0', '0']
    });
    addLines(2, 4, 3, 4);

    // Step 10: carry
    generatedSteps.push({
      variables: { a: 4, b: 4, aBinary: '0100', bBinary: '0100', carry: '0100', result: '-' },
      explanation: "Calculate carry: carry = a & b = 0100 & 0100 = 0100.",
      pseudoStep: "SET carry = a & b",
      bitsA: ['0', '1', '0', '0'],
      bitsB: ['0', '1', '0', '0'],
      bitsCarry: ['0', '1', '0', '0']
    });
    addLines(3, 5, 4, 5);

    // Step 11: a = a ^ b
    generatedSteps.push({
      variables: { a: 0, b: 4, aBinary: '0000', bBinary: '0100', carry: '0100', result: '-' },
      explanation: "Apply XOR sum: a = a ^ b = 0100 ^ 0100 = 0000 (0).",
      pseudoStep: "SET a = a ^ b",
      bitsA: ['0', '0', '0', '0'],
      bitsB: ['0', '1', '0', '0']
    });
    addLines(4, 6, 5, 6);

    // Step 12: b = carry << 1
    generatedSteps.push({
      variables: { a: 0, b: 8, aBinary: '0000', bBinary: '1000', carry: '0100', result: '-' },
      explanation: "Shift carry left: b = carry << 1 = 0100 << 1 = 1000 (8).",
      pseudoStep: "SET b = carry << 1",
      bitsA: ['0', '0', '0', '0'],
      bitsB: ['1', '0', '0', '0']
    });
    addLines(5, 7, 6, 7);

    // Step 13: loop check
    generatedSteps.push({
      variables: { a: 0, b: 8, aBinary: '0000', bBinary: '1000', carry: '-', result: '-' },
      explanation: "Loop check: b is 8, which is not 0, so continue adding carries.",
      pseudoStep: "WHILE b != 0",
      bitsA: ['0', '0', '0', '0'],
      bitsB: ['1', '0', '0', '0']
    });
    addLines(2, 4, 3, 4);

    // Step 14: carry
    generatedSteps.push({
      variables: { a: 0, b: 8, aBinary: '0000', bBinary: '1000', carry: '0000', result: '-' },
      explanation: "Calculate carry: carry = a & b = 0000 & 1000 = 0000 (no carry produced).",
      pseudoStep: "SET carry = a & b",
      bitsA: ['0', '0', '0', '0'],
      bitsB: ['1', '0', '0', '0'],
      bitsCarry: ['0', '0', '0', '0']
    });
    addLines(3, 5, 4, 5);

    // Step 15: a = a ^ b
    generatedSteps.push({
      variables: { a: 8, b: 8, aBinary: '1000', bBinary: '1000', carry: '0000', result: '-' },
      explanation: "Apply XOR sum: a = a ^ b = 0000 ^ 1000 = 1000 (8).",
      pseudoStep: "SET a = a ^ b",
      bitsA: ['1', '0', '0', '0'],
      bitsB: ['1', '0', '0', '0']
    });
    addLines(4, 6, 5, 6);

    // Step 16: b = carry << 1
    generatedSteps.push({
      variables: { a: 8, b: 0, aBinary: '1000', bBinary: '0000', carry: '0000', result: '-' },
      explanation: "Shift carry left: b = carry << 1 = 0000 << 1 = 0000 (0).",
      pseudoStep: "SET b = carry << 1",
      bitsA: ['1', '0', '0', '0'],
      bitsB: ['0', '0', '0', '0']
    });
    addLines(5, 7, 6, 7);

    // Step 17: loop exit & return
    generatedSteps.push({
      variables: { a: 8, b: 0, aBinary: '1000', bBinary: '0000', carry: '0000', result: 8 },
      explanation: "Loop check: b is 0. Exit loop and return a = 8.",
      pseudoStep: "RETURN a",
      bitsA: ['1', '0', '0', '0'],
      bitsB: ['0', '0', '0', '0']
    });
    addLines(7, 8, 8, 9);

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
                Sum of Two Integers (Bitwise)
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4 justify-between flex-wrap">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 flex-1 min-w-[140px]">
                    <div className="text-xs font-semibold text-muted-foreground mb-3 text-center">Variable a (XOR Sum)</div>
                    <div className="flex gap-1 justify-center">
                      {currentStep.bitsA.map((bit, idx) => (
                        <div key={idx} className={`w-8 h-8 flex items-center justify-center font-mono text-sm border rounded font-bold ${
                          bit === '1' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'
                        }`}>
                          {bit}
                        </div>
                      ))}
                    </div>
                    <div className="text-center font-mono text-xs mt-3 text-primary font-bold">
                      Val: {currentStep.variables.a} (Binary: {currentStep.variables.aBinary})
                    </div>
                  </div>

                  <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10 flex-1 min-w-[140px]">
                    <div className="text-xs font-semibold text-muted-foreground mb-3 text-center">Variable b (Carry Shift)</div>
                    <div className="flex gap-1 justify-center">
                      {currentStep.bitsB.map((bit, idx) => (
                        <div key={idx} className={`w-8 h-8 flex items-center justify-center font-mono text-sm border rounded font-bold ${
                          bit === '1' ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-muted border-border text-muted-foreground'
                        }`}>
                          {bit}
                        </div>
                      ))}
                    </div>
                    <div className="text-center font-mono text-xs mt-3 text-orange-500 font-bold">
                      Val: {currentStep.variables.b} (Binary: {currentStep.variables.bBinary})
                    </div>
                  </div>
                </div>

                {currentStep.bitsCarry && (
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <div className="text-xs font-semibold text-muted-foreground mb-3 text-center">Calculated Carry (a & b)</div>
                    <div className="flex gap-1 justify-center">
                      {currentStep.bitsCarry.map((bit, idx) => (
                        <div key={idx} className={`w-8 h-8 flex items-center justify-center font-mono text-sm border rounded font-bold ${
                          bit === '1' ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-muted border-border text-muted-foreground'
                        }`}>
                          {bit}
                        </div>
                      ))}
                    </div>
                    <div className="text-center font-mono text-xs mt-3 text-red-500 font-bold">
                      Binary Carry: {currentStep.variables.carry}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
                  <div className="font-bold text-muted-foreground">Bitwise Operations Quick Guide:</div>
                  <div>• <span className="font-semibold text-primary font-mono">XOR (a ^ b)</span>: Adds bits without carry (0^0=0, 1^0=1, 1^1=0).</div>
                  <div>• <span className="font-semibold text-primary font-mono">AND (a & b)</span>: Identifies carry positions where both bits are 1.</div>
                  <div>• <span className="font-semibold text-primary font-mono">Left Shift (carry &lt;&lt; 1)</span>: Moves carry bits to the next higher position to be added.</div>
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