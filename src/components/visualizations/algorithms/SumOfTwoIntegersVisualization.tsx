import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const SumOfTwoIntegersVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      variables: { a: 3, b: 5, aBinary: '0011', bBinary: '0101', carry: '-', result: '-' },
      explanation: "Start: a = 3 (binary: 0011), b = 5 (binary: 0101). Goal: Add without + operator",
      highlightedLine: 0,
      bitsA: ['0', '0', '1', '1'],
      bitsB: ['0', '1', '0', '1']
    },
    {
      variables: { a: 3, b: 5, aBinary: '0011', bBinary: '0101', carry: '-', result: '-' },
      explanation: "Enter while loop: b ≠ 0, so continue processing",
      highlightedLine: 1,
      bitsA: ['0', '0', '1', '1'],
      bitsB: ['0', '1', '0', '1']
    },
    {
      variables: { a: 3, b: 5, aBinary: '0011', bBinary: '0101', carry: '0001', result: '-' },
      explanation: "Calculate carry: a & b = 0011 & 0101 = 0001 (where both bits are 1)",
      highlightedLine: 2,
      bitsA: ['0', '0', '1', '1'],
      bitsB: ['0', '1', '0', '1'],
      bitsCarry: ['0', '0', '0', '1']
    },
    {
      variables: { a: 6, b: 5, aBinary: '0110', bBinary: '0101', carry: '0001', result: '-' },
      explanation: "Calculate sum without carry: a = a ^ b = 0011 ^ 0101 = 0110 (XOR adds bits ignoring carry)",
      highlightedLine: 3,
      bitsA: ['0', '1', '1', '0'],
      bitsB: ['0', '1', '0', '1']
    },
    {
      variables: { a: 6, b: 2, aBinary: '0110', bBinary: '0010', carry: '0001', result: '-' },
      explanation: "Shift carry left: b = carry << 1 = 0001 << 1 = 0010 (move carry to next position)",
      highlightedLine: 4,
      bitsA: ['0', '1', '1', '0'],
      bitsB: ['0', '0', '1', '0']
    },
    {
      variables: { a: 6, b: 2, aBinary: '0110', bBinary: '0010', carry: '-', result: '-' },
      explanation: "Loop again: b = 2 ≠ 0, continue processing",
      highlightedLine: 1,
      bitsA: ['0', '1', '1', '0'],
      bitsB: ['0', '0', '1', '0']
    },
    {
      variables: { a: 6, b: 2, aBinary: '0110', bBinary: '0010', carry: '0010', result: '-' },
      explanation: "Calculate carry: a & b = 0110 & 0010 = 0010",
      highlightedLine: 2,
      bitsA: ['0', '1', '1', '0'],
      bitsB: ['0', '0', '1', '0'],
      bitsCarry: ['0', '0', '1', '0']
    },
    {
      variables: { a: 4, b: 2, aBinary: '0100', bBinary: '0010', carry: '0010', result: '-' },
      explanation: "Sum without carry: a = a ^ b = 0110 ^ 0010 = 0100",
      highlightedLine: 3,
      bitsA: ['0', '1', '0', '0'],
      bitsB: ['0', '0', '1', '0']
    },
    {
      variables: { a: 4, b: 4, aBinary: '0100', bBinary: '0100', carry: '0010', result: '-' },
      explanation: "Shift carry: b = carry << 1 = 0010 << 1 = 0100",
      highlightedLine: 4,
      bitsA: ['0', '1', '0', '0'],
      bitsB: ['0', '1', '0', '0']
    },
    {
      variables: { a: 4, b: 4, aBinary: '0100', bBinary: '0100', carry: '-', result: '-' },
      explanation: "Loop again: b = 4 ≠ 0, continue",
      highlightedLine: 1,
      bitsA: ['0', '1', '0', '0'],
      bitsB: ['0', '1', '0', '0']
    },
    {
      variables: { a: 4, b: 4, aBinary: '0100', bBinary: '0100', carry: '0100', result: '-' },
      explanation: "Calculate carry: a & b = 0100 & 0100 = 0100",
      highlightedLine: 2,
      bitsA: ['0', '1', '0', '0'],
      bitsB: ['0', '1', '0', '0'],
      bitsCarry: ['0', '1', '0', '0']
    },
    {
      variables: { a: 0, b: 4, aBinary: '0000', bBinary: '0100', carry: '0100', result: '-' },
      explanation: "Sum without carry: a = a ^ b = 0100 ^ 0100 = 0000",
      highlightedLine: 3,
      bitsA: ['0', '0', '0', '0'],
      bitsB: ['0', '1', '0', '0']
    },
    {
      variables: { a: 0, b: 8, aBinary: '0000', bBinary: '1000', carry: '0100', result: '-' },
      explanation: "Shift carry: b = carry << 1 = 0100 << 1 = 1000",
      highlightedLine: 4,
      bitsA: ['0', '0', '0', '0'],
      bitsB: ['1', '0', '0', '0']
    },
    {
      variables: { a: 0, b: 8, aBinary: '0000', bBinary: '1000', carry: '-', result: '-' },
      explanation: "Loop again: b = 8 ≠ 0, continue",
      highlightedLine: 1,
      bitsA: ['0', '0', '0', '0'],
      bitsB: ['1', '0', '0', '0']
    },
    {
      variables: { a: 0, b: 8, aBinary: '0000', bBinary: '1000', carry: '0000', result: '-' },
      explanation: "Calculate carry: a & b = 0000 & 1000 = 0000 (no overlap)",
      highlightedLine: 2,
      bitsA: ['0', '0', '0', '0'],
      bitsB: ['1', '0', '0', '0'],
      bitsCarry: ['0', '0', '0', '0']
    },
    {
      variables: { a: 8, b: 8, aBinary: '1000', bBinary: '1000', carry: '0000', result: '-' },
      explanation: "Sum: a = a ^ b = 0000 ^ 1000 = 1000",
      highlightedLine: 3,
      bitsA: ['1', '0', '0', '0'],
      bitsB: ['1', '0', '0', '0']
    },
    {
      variables: { a: 8, b: 0, aBinary: '1000', bBinary: '0000', carry: '0000', result: '-' },
      explanation: "Shift carry: b = carry << 1 = 0000 << 1 = 0000",
      highlightedLine: 4,
      bitsA: ['1', '0', '0', '0'],
      bitsB: ['0', '0', '0', '0']
    },
    {
      variables: { a: 8, b: 0, aBinary: '1000', bBinary: '0000', carry: '0000', result: 8 },
      explanation: "Exit loop: b = 0. Return a = 8. Success! 3 + 5 = 8",
      highlightedLine: 5,
      bitsA: ['1', '0', '0', '0'],
      bitsB: ['0', '0', '0', '0']
    }
  ];

  const code = `function getSum(a: number, b: number): number {
  while (b !== 0) {
    const carry = a & b;
    a = a ^ b;
    b = carry << 1;
  }
  return a;
}`;

  const step = steps[currentStep];

  const leftContent = (
    <>
      <div className="space-y-4">
        <div className="flex gap-2 justify-center items-center flex-wrap">
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 flex-1">
            <h3 className="font-semibold mb-2 text-sm">a (binary)</h3>
            <div className="flex gap-1 justify-center flex-wrap">
              {step.bitsA.map((bit, idx) => (
                <div key={idx} className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-mono text-lg border-2 rounded ${bit === '1' ? 'bg-primary/30 border-primary' : 'bg-muted border-border'}`}>
                  {bit}
                </div>
              ))}
            </div>
            <p className="font-mono text-center mt-2 text-sm">{step.variables.aBinary} = {step.variables.a}</p>
          </div>
          
          <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20 flex-1">
            <h3 className="font-semibold mb-2 text-sm">b (carry)</h3>
            <div className="flex gap-1 justify-center flex-wrap">
              {step.bitsB.map((bit, idx) => (
                <div key={idx} className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-mono text-lg border-2 rounded ${bit === '1' ? 'bg-secondary/30 border-secondary' : 'bg-muted border-border'}`}>
                  {bit}
                </div>
              ))}
            </div>
            <p className="font-mono text-center mt-2 text-sm">{step.variables.bBinary} = {step.variables.b}</p>
          </div>
        </div>

        {step.bitsCarry && (
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <h3 className="font-semibold mb-2 text-sm text-center">Carry Calculation</h3>
            <div className="flex gap-1 justify-center flex-wrap">
              {step.bitsCarry.map((bit, idx) => (
                <div key={idx} className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-mono text-lg border-2 rounded ${bit === '1' ? 'bg-accent/30 border-accent' : 'bg-muted border-border'}`}>
                  {bit}
                </div>
              ))}
            </div>
            <p className="font-mono text-center mt-2 text-sm">{step.variables.carry}</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{step.explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">Bit Operations:</h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• XOR (^): Adds bits without carry (0^0=0, 0^1=1, 1^0=1, 1^1=0)</p>
          <p>• AND (&): Finds where both bits are 1 (needs carry)</p>
          <p>• Left shift (&lt;&lt;): Moves carry to next position</p>
        </div>
      </div>

      <VariablePanel variables={step.variables} />
    </>
  );

  const rightContent = (
    <>
      <CodeHighlighter 
        code={code} 
        language="TypeScript"
        highlightedLine={step.highlightedLine}
      />
    </>
  );

  const controls = (
    <SimpleStepControls
      currentStep={currentStep}
      totalSteps={steps.length}
      onStepChange={setCurrentStep}
    />
  );

  return (
    <VisualizationLayout
      leftContent={leftContent}
      rightContent={rightContent}
      controls={controls}
    />
  );
};