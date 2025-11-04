import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const NumberOf1BitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      variables: { n: 11, nBinary: '00001011', count: 0 },
      explanation: "Start: n = 11 (binary: 00001011). Initialize count = 0",
      highlightedLine: 0,
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 11, nBinary: '00001011', count: 0 },
      explanation: "Enter while loop: n ≠ 0, continue",
      highlightedLine: 1,
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 11, nBinary: '00001011', count: 0, rightmost: 1 },
      explanation: "Check rightmost bit: n & 1 = 00001011 & 00000001 = 1",
      highlightedLine: 2,
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 11, nBinary: '00001011', count: 1, rightmost: 1 },
      explanation: "Rightmost bit is 1, so count += 1. Now count = 1",
      highlightedLine: 2,
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 5, nBinary: '00000101', count: 1 },
      explanation: "Right shift: n >>>= 1. n becomes 00000101 (5)",
      highlightedLine: 3,
      bits: ['0', '0', '0', '0', '0', '1', '0', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 5, nBinary: '00000101', count: 1 },
      explanation: "Loop: n = 5 ≠ 0, continue",
      highlightedLine: 1,
      bits: ['0', '0', '0', '0', '0', '1', '0', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 5, nBinary: '00000101', count: 1, rightmost: 1 },
      explanation: "Check rightmost bit: n & 1 = 00000101 & 00000001 = 1",
      highlightedLine: 2,
      bits: ['0', '0', '0', '0', '0', '1', '0', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 5, nBinary: '00000101', count: 2, rightmost: 1 },
      explanation: "Rightmost bit is 1, count += 1. Now count = 2",
      highlightedLine: 2,
      bits: ['0', '0', '0', '0', '0', '1', '0', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 2, nBinary: '00000010', count: 2 },
      explanation: "Right shift: n >>>= 1. n becomes 00000010 (2)",
      highlightedLine: 3,
      bits: ['0', '0', '0', '0', '0', '0', '1', '0'],
      checkingBit: -1
    },
    {
      variables: { n: 2, nBinary: '00000010', count: 2 },
      explanation: "Loop: n = 2 ≠ 0, continue",
      highlightedLine: 1,
      bits: ['0', '0', '0', '0', '0', '0', '1', '0'],
      checkingBit: 7
    },
    {
      variables: { n: 2, nBinary: '00000010', count: 2, rightmost: 0 },
      explanation: "Check rightmost bit: n & 1 = 00000010 & 00000001 = 0",
      highlightedLine: 2,
      bits: ['0', '0', '0', '0', '0', '0', '1', '0'],
      checkingBit: 7
    },
    {
      variables: { n: 2, nBinary: '00000010', count: 2, rightmost: 0 },
      explanation: "Rightmost bit is 0, don't increment count. count stays 2",
      highlightedLine: 2,
      bits: ['0', '0', '0', '0', '0', '0', '1', '0'],
      checkingBit: 7
    },
    {
      variables: { n: 1, nBinary: '00000001', count: 2 },
      explanation: "Right shift: n >>>= 1. n becomes 00000001 (1)",
      highlightedLine: 3,
      bits: ['0', '0', '0', '0', '0', '0', '0', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 1, nBinary: '00000001', count: 2 },
      explanation: "Loop: n = 1 ≠ 0, continue",
      highlightedLine: 1,
      bits: ['0', '0', '0', '0', '0', '0', '0', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 1, nBinary: '00000001', count: 2, rightmost: 1 },
      explanation: "Check rightmost bit: n & 1 = 00000001 & 00000001 = 1",
      highlightedLine: 2,
      bits: ['0', '0', '0', '0', '0', '0', '0', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 1, nBinary: '00000001', count: 3, rightmost: 1 },
      explanation: "Rightmost bit is 1, count += 1. Now count = 3",
      highlightedLine: 2,
      bits: ['0', '0', '0', '0', '0', '0', '0', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 0, nBinary: '00000000', count: 3 },
      explanation: "Right shift: n >>>= 1. n becomes 00000000 (0)",
      highlightedLine: 3,
      bits: ['0', '0', '0', '0', '0', '0', '0', '0'],
      checkingBit: -1
    },
    {
      variables: { n: 0, nBinary: '00000000', count: 3 },
      explanation: "Exit loop: n = 0. Return count = 3. The number 11 has three 1-bits!",
      highlightedLine: 4,
      bits: ['0', '0', '0', '0', '0', '0', '0', '0'],
      checkingBit: -1
    }
  ];

  const code = `function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    count += n & 1;
    n >>>= 1;
  }
  return count;
}`;

  const step = steps[currentStep];

  const leftContent = (
    <>
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
        <h3 className="font-semibold mb-4 text-center">Binary Representation</h3>
        <div className="flex gap-1 justify-center mb-4">
          {step.bits.map((bit, idx) => (
            <div key={idx} className={`w-10 h-10 flex items-center justify-center font-mono text-lg border-2 rounded transition-all ${
              bit === '1' 
                ? 'bg-primary/30 border-primary font-bold' 
                : 'bg-muted border-border'
            } ${idx === step.checkingBit ? 'ring-2 ring-accent scale-110' : ''}`}>
              {bit}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="font-mono text-xl">{step.variables.nBinary}</p>
          <p className="text-sm text-muted-foreground mt-1">Decimal: {step.variables.n}</p>
        </div>
      </div>
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{step.explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">Algorithm:</h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• Check each bit from right to left</p>
          <p>• n & 1: Gets the rightmost bit (0 or 1)</p>
          <p>• n {'>>'}{'>'}= 1: Shifts all bits right by 1</p>
          <p>• Count all 1-bits until n becomes 0</p>
        </div>
      </div>

      <VariablePanel variables={{ count: step.variables.count }} />
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