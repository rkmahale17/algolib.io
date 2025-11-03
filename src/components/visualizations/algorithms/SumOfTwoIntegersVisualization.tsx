import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const SumOfTwoIntegersVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      variables: { a: '0011 (3)', b: '0101 (5)', carry: '0000' },
      explanation: "Initialize: a = 3 (0011), b = 5 (0101). Add without using + operator",
      highlightedLine: 1
    },
    {
      variables: { a: '0110 (6)', b: '0010 (2)', carry: '0010' },
      explanation: "XOR for sum: 0011 ^ 0101 = 0110. AND+shift for carry: (0011 & 0101) << 1 = 0010",
      highlightedLine: 4
    },
    {
      variables: { a: '0100 (4)', b: '0100 (4)', carry: '0100' },
      explanation: "Continue: XOR 0110 ^ 0010 = 0100. Carry: (0110 & 0010) << 1 = 0100",
      highlightedLine: 7
    },
    {
      variables: { a: '1000 (8)', b: '0000 (0)', carry: '0000' },
      explanation: "Final: XOR 0100 ^ 0100 = 1000 (8). Carry is 0, done! Result = 8",
      highlightedLine: 11
    }
  ];

  const code = `function getSum(a: number, b: number): number {
  while (b !== 0) {
    // Calculate carry
    const carry = a & b;
    
    // Calculate sum without carry (XOR)
    a = a ^ b;
    
    // Shift carry left by 1
    b = carry << 1;
  }
  
  return a;
}`;

  const leftContent = (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2 text-sm">a (binary)</h3>
          <p className="font-mono text-lg">{steps[currentStep].variables.a}</p>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
          <h3 className="font-semibold mb-2 text-sm">b (carry)</h3>
          <p className="font-mono text-lg">{steps[currentStep].variables.b}</p>
        </div>
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
          <h3 className="font-semibold mb-2 text-sm">Operation</h3>
          <p className="text-sm">{steps[currentStep].variables.carry}</p>
        </div>
      </div>
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">How it works:</h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• XOR (^) adds bits without carry</p>
          <p>• AND (&) finds where both bits are 1 (needs carry)</p>
          <p>• Left shift (&lt;&lt;) moves carry to next position</p>
        </div>
      </div>

      <VariablePanel variables={steps[currentStep].variables} />
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