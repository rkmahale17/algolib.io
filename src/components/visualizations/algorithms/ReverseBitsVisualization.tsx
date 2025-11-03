import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const ReverseBitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      variables: { n: '10110000', result: '00000000', bit: '-', iteration: '0/8' },
      explanation: "Initialize: n = 10110000, result = 00000000. Process bits one by one",
      highlightedLine: 2
    },
    {
      variables: { n: '01011000', result: '00000000', bit: '0', iteration: '1/8' },
      explanation: "Extract rightmost bit (0), shift result left, add bit. Shift n right",
      highlightedLine: 6
    },
    {
      variables: { n: '00101100', result: '00000000', bit: '0', iteration: '2/8' },
      explanation: "Extract bit (0), result = (result << 1) | bit. Shift n right",
      highlightedLine: 6
    },
    {
      variables: { n: '00010110', result: '00000000', bit: '0', iteration: '3/8' },
      explanation: "Extract bit (0), result = (result << 1) | bit. Shift n right",
      highlightedLine: 6
    },
    {
      variables: { n: '00001011', result: '00000001', bit: '1', iteration: '4/8' },
      explanation: "Extract bit (1), result = (result << 1) | bit = 00000001",
      highlightedLine: 6
    },
    {
      variables: { n: '00000101', result: '00000011', bit: '1', iteration: '5/8' },
      explanation: "Extract bit (1), result = 00000011. Continuing...",
      highlightedLine: 9
    },
    {
      variables: { n: '00000010', result: '00000110', bit: '0', iteration: '6/8' },
      explanation: "Extract bit (0), result = 00000110",
      highlightedLine: 9
    },
    {
      variables: { n: '00000001', result: '00001101', bit: '1', iteration: '7/8' },
      explanation: "Extract bit (1), result = 00001101",
      highlightedLine: 9
    },
    {
      variables: { n: '00000000', result: '00011010', bit: '0', iteration: '8/8' },
      explanation: "Final bit (0), result = 00011010. Bits reversed!",
      highlightedLine: 12
    }
  ];

  const code = `function reverseBits(n: number): number {
  let result = 0;
  
  for (let i = 0; i < 32; i++) {
    // Extract rightmost bit of n
    const bit = n & 1;
    
    // Shift result left and add bit
    result = (result << 1) | bit;
    
    // Shift n right to process next bit
    n >>>= 1;
  }
  
  return result >>> 0;  // Ensure unsigned
}`;

  const leftContent = (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2 text-sm">Original (n)</h3>
          <p className="font-mono text-lg">{steps[currentStep].variables.n}</p>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
          <h3 className="font-semibold mb-2 text-sm">Reversed (result)</h3>
          <p className="font-mono text-lg">{steps[currentStep].variables.result}</p>
        </div>
      </div>
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </div>

      <VariablePanel variables={{
        'Current Bit': steps[currentStep].variables.bit,
        'Progress': steps[currentStep].variables.iteration
      }} />
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
