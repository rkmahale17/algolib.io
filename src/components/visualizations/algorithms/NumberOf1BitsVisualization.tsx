import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

export const NumberOf1BitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      variables: { n: '00001011 (11)', count: 0, bit: '-' },
      explanation: "Start: n = 11 in binary is 00001011. Count = 0"
    },
    {
      variables: { n: '00001011', count: 1, bit: '1' },
      explanation: "Check rightmost bit: n & 1 = 1. Count++. Shift right: n >> 1"
    },
    {
      variables: { n: '00000101', count: 2, bit: '1' },
      explanation: "Check rightmost bit: n & 1 = 1. Count++. Shift right"
    },
    {
      variables: { n: '00000010', count: 2, bit: '0' },
      explanation: "Check rightmost bit: n & 1 = 0. No count++. Shift right"
    },
    {
      variables: { n: '00000001', count: 3, bit: '1' },
      explanation: "Check rightmost bit: n & 1 = 1. Count++. Shift right"
    },
    {
      variables: { n: '00000000', count: 3, bit: '-' },
      explanation: "n = 0, done! Total count = 3 (three 1-bits in 11)"
    }
  ];

  const code = `def hammingWeight(n):
    count = 0
    
    while n:
        count += n & 1  # Check rightmost bit
        n >>= 1         # Shift right by 1
    
    return count

# Optimized (Brian Kernighan's Algorithm)
def hammingWeight_optimized(n):
    count = 0
    while n:
        n &= (n - 1)  # Remove rightmost 1 bit
        count += 1
    return count`;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
        <h3 className="font-semibold mb-4 text-center">Binary Representation</h3>
        <div className="font-mono text-3xl text-center">{steps[currentStep].variables.n}</div>
        <div className="text-center mt-2 text-sm text-muted-foreground">
          Current bit: {steps[currentStep].variables.bit}
        </div>
      </div>
      
      <VariablePanel variables={{ count: steps[currentStep].variables.count }} />
      
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