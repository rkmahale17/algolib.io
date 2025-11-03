import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const NumberOf1BitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      variables: { n: '00001011 (11)', count: 0, bit: '-' },
      explanation: "Initialize: n = 11 in binary is 00001011. Count = 0",
      highlightedLine: 2
    },
    {
      variables: { n: '00001011', count: 1, bit: '1' },
      explanation: "Check rightmost bit: n & 1 = 1. Count++. Shift right: n >>= 1",
      highlightedLine: 5
    },
    {
      variables: { n: '00000101', count: 2, bit: '1' },
      explanation: "Check rightmost bit: n & 1 = 1. Count++. Shift right",
      highlightedLine: 5
    },
    {
      variables: { n: '00000010', count: 2, bit: '0' },
      explanation: "Check rightmost bit: n & 1 = 0. No count++. Shift right",
      highlightedLine: 5
    },
    {
      variables: { n: '00000001', count: 3, bit: '1' },
      explanation: "Check rightmost bit: n & 1 = 1. Count++. Shift right",
      highlightedLine: 5
    },
    {
      variables: { n: '00000000', count: 3, bit: '-' },
      explanation: "n = 0, done! Total count = 3 (three 1-bits in 11)",
      highlightedLine: 8
    }
  ];

  const code = `function hammingWeight(n: number): number {
  let count = 0;
  
  while (n !== 0) {
    count += n & 1;  // Check rightmost bit
    n >>>= 1;        // Unsigned right shift
  }
  
  return count;
}`;

  const leftContent = (
    <>
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
        <h3 className="font-semibold mb-4 text-center">Binary Representation</h3>
        <div className="font-mono text-3xl text-center">{steps[currentStep].variables.n}</div>
        <div className="text-center mt-2 text-sm text-muted-foreground">
          Current bit: {steps[currentStep].variables.bit}
        </div>
      </div>
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </div>

      <VariablePanel variables={{ count: steps[currentStep].variables.count }} />
    </>
  );

  const rightContent = (
    <>
      <div className="text-sm font-semibold text-muted-foreground mb-2">TypeScript</div>
      <CodeHighlighter 
        code={code} 
        language="typescript"
        highlightedLine={steps[currentStep].highlightedLine}
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
