import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  bits: string[];
  checkingBit: number;
}

export const NumberOf1BitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: Step[] = [
    {
      variables: { n: 11, nBinary: '00001011', count: '?' },
      explanation: "Starting function with n = 11 (binary: 00001011). Will count the number of 1 bits.",
      highlightedLines: [1],
      lineExecution: "function hammingWeight(n: number): number {",
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 11, nBinary: '00001011', count: 0 },
      explanation: "Initialize count = 0. This will track the number of 1 bits found.",
      highlightedLines: [2],
      lineExecution: "let count = 0;",
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 11, nBinary: '00001011', count: 0 },
      explanation: "Check loop condition: n (11) !== 0? Yes, enter loop.",
      highlightedLines: [3],
      lineExecution: "while (n !== 0)",
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 11, nBinary: '00001011', count: 0, rightmost: 1 },
      explanation: "Check rightmost bit: n & 1 = 00001011 & 00000001 = 1.",
      highlightedLines: [4],
      lineExecution: "count += n & 1",
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 11, nBinary: '00001011', count: 1, rightmost: 1 },
      explanation: "Rightmost bit is 1, add to count. count = 0 + 1 = 1.",
      highlightedLines: [4],
      lineExecution: "count = 1",
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 11, nBinary: '00001011', count: 1 },
      explanation: "Unsigned right shift: n >>>= 1. Shifts all bits right by 1 position.",
      highlightedLines: [5],
      lineExecution: "n >>>= 1",
      bits: ['0', '0', '0', '0', '1', '0', '1', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 5, nBinary: '00000101', count: 1 },
      explanation: "After shift: n = 5 (binary: 00000101). Lost the rightmost bit.",
      highlightedLines: [5],
      lineExecution: "n = 5",
      bits: ['0', '0', '0', '0', '0', '1', '0', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 5, nBinary: '00000101', count: 1 },
      explanation: "Check loop condition: n (5) !== 0? Yes, continue.",
      highlightedLines: [3],
      lineExecution: "while (n !== 0)",
      bits: ['0', '0', '0', '0', '0', '1', '0', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 5, nBinary: '00000101', count: 1, rightmost: 1 },
      explanation: "Check rightmost bit: n & 1 = 00000101 & 00000001 = 1.",
      highlightedLines: [4],
      lineExecution: "count += n & 1",
      bits: ['0', '0', '0', '0', '0', '1', '0', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 5, nBinary: '00000101', count: 2, rightmost: 1 },
      explanation: "Rightmost bit is 1, add to count. count = 1 + 1 = 2.",
      highlightedLines: [4],
      lineExecution: "count = 2",
      bits: ['0', '0', '0', '0', '0', '1', '0', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 5, nBinary: '00000101', count: 2 },
      explanation: "Unsigned right shift: n >>>= 1.",
      highlightedLines: [5],
      lineExecution: "n >>>= 1",
      bits: ['0', '0', '0', '0', '0', '1', '0', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 2, nBinary: '00000010', count: 2 },
      explanation: "After shift: n = 2 (binary: 00000010).",
      highlightedLines: [5],
      lineExecution: "n = 2",
      bits: ['0', '0', '0', '0', '0', '0', '1', '0'],
      checkingBit: -1
    },
    {
      variables: { n: 2, nBinary: '00000010', count: 2 },
      explanation: "Check loop condition: n (2) !== 0? Yes, continue.",
      highlightedLines: [3],
      lineExecution: "while (n !== 0)",
      bits: ['0', '0', '0', '0', '0', '0', '1', '0'],
      checkingBit: -1
    },
    {
      variables: { n: 2, nBinary: '00000010', count: 2, rightmost: 0 },
      explanation: "Check rightmost bit: n & 1 = 00000010 & 00000001 = 0.",
      highlightedLines: [4],
      lineExecution: "count += n & 1",
      bits: ['0', '0', '0', '0', '0', '0', '1', '0'],
      checkingBit: 7
    },
    {
      variables: { n: 2, nBinary: '00000010', count: 2, rightmost: 0 },
      explanation: "Rightmost bit is 0, don't add. count = 2 + 0 = 2.",
      highlightedLines: [4],
      lineExecution: "count = 2",
      bits: ['0', '0', '0', '0', '0', '0', '1', '0'],
      checkingBit: 7
    },
    {
      variables: { n: 2, nBinary: '00000010', count: 2 },
      explanation: "Unsigned right shift: n >>>= 1.",
      highlightedLines: [5],
      lineExecution: "n >>>= 1",
      bits: ['0', '0', '0', '0', '0', '0', '1', '0'],
      checkingBit: -1
    },
    {
      variables: { n: 1, nBinary: '00000001', count: 2 },
      explanation: "After shift: n = 1 (binary: 00000001).",
      highlightedLines: [5],
      lineExecution: "n = 1",
      bits: ['0', '0', '0', '0', '0', '0', '0', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 1, nBinary: '00000001', count: 2 },
      explanation: "Check loop condition: n (1) !== 0? Yes, continue.",
      highlightedLines: [3],
      lineExecution: "while (n !== 0)",
      bits: ['0', '0', '0', '0', '0', '0', '0', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 1, nBinary: '00000001', count: 2, rightmost: 1 },
      explanation: "Check rightmost bit: n & 1 = 00000001 & 00000001 = 1.",
      highlightedLines: [4],
      lineExecution: "count += n & 1",
      bits: ['0', '0', '0', '0', '0', '0', '0', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 1, nBinary: '00000001', count: 3, rightmost: 1 },
      explanation: "Rightmost bit is 1, add to count. count = 2 + 1 = 3.",
      highlightedLines: [4],
      lineExecution: "count = 3",
      bits: ['0', '0', '0', '0', '0', '0', '0', '1'],
      checkingBit: 7
    },
    {
      variables: { n: 1, nBinary: '00000001', count: 3 },
      explanation: "Unsigned right shift: n >>>= 1.",
      highlightedLines: [5],
      lineExecution: "n >>>= 1",
      bits: ['0', '0', '0', '0', '0', '0', '0', '1'],
      checkingBit: -1
    },
    {
      variables: { n: 0, nBinary: '00000000', count: 3 },
      explanation: "After shift: n = 0 (binary: 00000000). All bits processed.",
      highlightedLines: [5],
      lineExecution: "n = 0",
      bits: ['0', '0', '0', '0', '0', '0', '0', '0'],
      checkingBit: -1
    },
    {
      variables: { n: 0, nBinary: '00000000', count: 3 },
      explanation: "Check loop condition: n (0) !== 0? No, exit loop.",
      highlightedLines: [3],
      lineExecution: "while (n !== 0) -> false",
      bits: ['0', '0', '0', '0', '0', '0', '0', '0'],
      checkingBit: -1
    },
    {
      variables: { n: 0, nBinary: '00000000', count: 3 },
      explanation: "Return count = 3. The number 11 has three 1-bits!",
      highlightedLines: [7],
      lineExecution: "return count = 3",
      bits: ['0', '0', '0', '0', '0', '0', '0', '0'],
      checkingBit: -1
    },
    {
      variables: { n: 0, nBinary: '00000000', count: 3, result: 3 },
      explanation: "Algorithm complete! Found 3 one-bits. Time: O(log n), Space: O(1).",
      highlightedLines: [7],
      lineExecution: "Result: 3",
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

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`binary-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
              <h3 className="font-semibold mb-4 text-center">Binary Representation</h3>
              <div className="flex gap-1 justify-center mb-4 flex-wrap">
                {step.bits.map((bit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-mono text-lg border-2 rounded transition-all ${
                      bit === '1' 
                        ? 'bg-primary/30 border-primary font-bold' 
                        : 'bg-muted border-border'
                    } ${idx === step.checkingBit ? 'ring-2 ring-accent scale-110' : ''}`}
                  >
                    {bit}
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <p className="font-mono text-xl">{step.variables.nBinary}</p>
                <p className="text-sm text-muted-foreground mt-1">Decimal: {step.variables.n}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            key={`algorithm-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h3 className="font-semibold mb-2 text-sm">Bit Manipulation:</h3>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>• n & 1: Gets the rightmost bit (0 or 1)</p>
                <p>• n {'>>>='}  1: Unsigned right shift by 1</p>
                <p>• Check each bit until n becomes 0</p>
                <p>• Time: O(log n), Space: O(1)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <VariablePanel variables={{ count: step.variables.count }} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};