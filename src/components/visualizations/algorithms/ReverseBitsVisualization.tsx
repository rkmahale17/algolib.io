import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

export const ReverseBitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      variables: { n: '10110000', result: '00000000', bit: '-', iteration: '0/8' },
      explanation: "Start: n = 10110000, result = 00000000. Process 8 bits (showing simplified)"
    },
    {
      variables: { n: '01011000', result: '00000000', bit: '0', iteration: '1/8' },
      explanation: "Extract rightmost bit (0), shift result left, add bit. Shift n right"
    },
    {
      variables: { n: '00101100', result: '00000000', bit: '0', iteration: '2/8' },
      explanation: "Extract bit (0), result << 1 | bit. Shift n right"
    },
    {
      variables: { n: '00010110', result: '00000000', bit: '0', iteration: '3/8' },
      explanation: "Extract bit (0), result << 1 | bit. Shift n right"
    },
    {
      variables: { n: '00001011', result: '00000001', bit: '1', iteration: '4/8' },
      explanation: "Extract bit (1), result << 1 | bit = 00000001. Shift n right"
    },
    {
      variables: { n: '00000101', result: '00000011', bit: '1', iteration: '5/8' },
      explanation: "Extract bit (1), result = 00000011. Continuing..."
    },
    {
      variables: { n: '00000010', result: '00000110', bit: '0', iteration: '6/8' },
      explanation: "Extract bit (0), result = 00000110"
    },
    {
      variables: { n: '00000001', result: '00001101', bit: '1', iteration: '7/8' },
      explanation: "Extract bit (1), result = 00001101"
    },
    {
      variables: { n: '00000000', result: '00011010', bit: '0', iteration: '8/8' },
      explanation: "Final bit (0), result = 00011010. Bits reversed!"
    }
  ];

  const code = `def reverseBits(n):
    result = 0
    
    for i in range(32):
        # Extract rightmost bit of n
        bit = n & 1
        
        # Shift result left and add bit
        result = (result << 1) | bit
        
        # Shift n right to process next bit
        n >>= 1
    
    return result`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <h3 className="font-semibold mb-2">Original (n)</h3>
          <p className="font-mono text-lg">{steps[currentStep].variables.n}</p>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg">
          <h3 className="font-semibold mb-2">Reversed (result)</h3>
          <p className="font-mono text-lg">{steps[currentStep].variables.result}</p>
        </div>
      </div>
      
      <VariablePanel variables={{
        'Current Bit': steps[currentStep].variables.bit,
        'Progress': steps[currentStep].variables.iteration
      }} />
      
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">{steps[currentStep].explanation}</p>
      </div>

      <CodeHighlighter code={code} language="python" />
      
      <SimpleStepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onStepChange={setCurrentStep}
      />
    </div>
  );
};