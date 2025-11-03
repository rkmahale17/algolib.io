import { useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

export const SumOfTwoIntegersVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      variables: { a: '0011 (3)', b: '0101 (5)', carry: '0000' },
      explanation: "Start: a = 3 (0011), b = 5 (0101). Goal: Add without using + operator"
    },
    {
      variables: { a: '0110 (6)', b: '0010 (2)', carry: '0010' },
      explanation: "XOR gives sum without carry: 0011 ^ 0101 = 0110. AND + shift gives carry: (0011 & 0101) << 1 = 0010"
    },
    {
      variables: { a: '0100 (4)', b: '0100 (4)', carry: '0100' },
      explanation: "XOR: 0110 ^ 0010 = 0100. Carry: (0110 & 0010) << 1 = 0100"
    },
    {
      variables: { a: '1000 (8)', b: '0000 (0)', carry: '0000' },
      explanation: "XOR: 0100 ^ 0100 = 1000. Carry: (0100 & 0100) << 1 = 0000. Carry is 0, done!"
    }
  ];

  const code = `def getSum(a, b):
    while b != 0:
        # Calculate carry
        carry = a & b
        
        # Calculate sum without carry (XOR)
        a = a ^ b
        
        # Shift carry left by 1
        b = carry << 1
    
    return a`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <h3 className="font-semibold mb-2">a (binary)</h3>
          <p className="font-mono">{steps[currentStep].variables.a}</p>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg">
          <h3 className="font-semibold mb-2">b (carry)</h3>
          <p className="font-mono">{steps[currentStep].variables.b}</p>
        </div>
        <div className="p-4 bg-accent/10 rounded-lg">
          <h3 className="font-semibold mb-2">Operation</h3>
          <p className="text-sm">{steps[currentStep].variables.carry}</p>
        </div>
      </div>
      
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">{steps[currentStep].explanation}</p>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>• XOR (^) adds bits without carry</p>
          <p>• AND (&) finds where both bits are 1 (needs carry)</p>
          <p>• Left shift (&lt;&lt;) moves carry to next position</p>
        </div>
      </div>

      <CodeHighlighter code={code} language="python" />
      
      <StepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onStepChange={setCurrentStep}
      />
    </div>
  );
};