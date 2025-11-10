import { useState } from 'react';
import { Card } from '@/components/ui/card';
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
  bitsN: string[];
  bitsResult: string[];
  extractBit?: number;
}

export const ReverseBitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: Step[] = [
    {
      variables: { n: '00001011', result: '00000000' },
      explanation: "Starting with n = 11 (binary: 00001011 shown as 8 bits). Process 32 bits total.",
      highlightedLines: [1],
      lineExecution: "function reverseBits(n: number): number {",
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '0']
    },
    {
      variables: { n: '00001011', result: 0, i: 0 },
      explanation: "Initialize result = 0. Will extract and reverse bits one by one.",
      highlightedLines: [2],
      lineExecution: "let result = 0;",
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '0']
    },
    {
      variables: { n: '00001011', result: 0, i: 0 },
      explanation: "Start loop: i = 0. Will iterate 32 times to process all bits.",
      highlightedLines: [3],
      lineExecution: "for (let i = 0; i < 32; i++)",
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '0']
    },
    {
      variables: { n: '00001011', result: 0, i: 0, bit: '?' },
      explanation: "Extract rightmost bit using bitwise AND with 1.",
      highlightedLines: [4],
      lineExecution: "const bit = n & 1;",
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '0'],
      extractBit: 7
    },
    {
      variables: { n: '00001011', result: 0, i: 0, bit: 1 },
      explanation: "bit = 1. Extracted rightmost bit of n.",
      highlightedLines: [4],
      lineExecution: "bit = 1",
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '0'],
      extractBit: 7
    },
    {
      variables: { n: '00001011', result: 0, i: 0, bit: 1 },
      explanation: "Shift result left by 1: (0 << 1) = 0.",
      highlightedLines: [5],
      lineExecution: "result = (result << 1) | bit;",
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '0']
    },
    {
      variables: { n: '00001011', result: 1, i: 0, bit: 1 },
      explanation: "OR with bit: result = 0 | 1 = 1. Added bit to result.",
      highlightedLines: [5],
      lineExecution: "result = 1",
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '1']
    },
    {
      variables: { n: '00001011', result: 1, i: 0, bit: 1 },
      explanation: "Unsigned right shift n by 1. Removes processed bit.",
      highlightedLines: [6],
      lineExecution: "n >>>= 1;",
      bitsN: ['0', '0', '0', '0', '1', '0', '1', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '1']
    },
    {
      variables: { n: '00000101', result: 1, i: 1 },
      explanation: "After shift: n = 00000101. Bit 1 removed. Continue loop.",
      highlightedLines: [6],
      lineExecution: "n = 00000101",
      bitsN: ['0', '0', '0', '0', '0', '1', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '1']
    },
    {
      variables: { n: '00000101', result: 1, i: 1, bit: 1 },
      explanation: "Loop i=1: Extract bit = n & 1 = 1.",
      highlightedLines: [4],
      lineExecution: "bit = 1",
      bitsN: ['0', '0', '0', '0', '0', '1', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '0', '1'],
      extractBit: 7
    },
    {
      variables: { n: '00000101', result: 3, i: 1, bit: 1 },
      explanation: "Shift and OR: result = (1 << 1) | 1 = 3.",
      highlightedLines: [5],
      lineExecution: "result = 3",
      bitsN: ['0', '0', '0', '0', '0', '1', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '1', '1']
    },
    {
      variables: { n: '00000010', result: 3, i: 2 },
      explanation: "Shift n: n = 00000010. Continue processing.",
      highlightedLines: [6],
      lineExecution: "n = 00000010",
      bitsN: ['0', '0', '0', '0', '0', '0', '1', '0'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '1', '1']
    },
    {
      variables: { n: '00000010', result: 3, i: 2, bit: 0 },
      explanation: "Loop i=2: Extract bit = n & 1 = 0.",
      highlightedLines: [4],
      lineExecution: "bit = 0",
      bitsN: ['0', '0', '0', '0', '0', '0', '1', '0'],
      bitsResult: ['0', '0', '0', '0', '0', '0', '1', '1'],
      extractBit: 7
    },
    {
      variables: { n: '00000010', result: 6, i: 2, bit: 0 },
      explanation: "Shift and OR: result = (3 << 1) | 0 = 6.",
      highlightedLines: [5],
      lineExecution: "result = 6",
      bitsN: ['0', '0', '0', '0', '0', '0', '1', '0'],
      bitsResult: ['0', '0', '0', '0', '0', '1', '1', '0']
    },
    {
      variables: { n: '00000001', result: 6, i: 3 },
      explanation: "Shift n: n = 00000001. One more bit to process.",
      highlightedLines: [6],
      lineExecution: "n = 00000001",
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '1', '1', '0']
    },
    {
      variables: { n: '00000001', result: 6, i: 3, bit: 1 },
      explanation: "Loop i=3: Extract bit = n & 1 = 1.",
      highlightedLines: [4],
      lineExecution: "bit = 1",
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '0', '1', '1', '0'],
      extractBit: 7
    },
    {
      variables: { n: '00000001', result: 13, i: 3, bit: 1 },
      explanation: "Shift and OR: result = (6 << 1) | 1 = 13.",
      highlightedLines: [5],
      lineExecution: "result = 13",
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '1'],
      bitsResult: ['0', '0', '0', '0', '1', '1', '0', '1']
    },
    {
      variables: { n: '00000000', result: 13, i: 4 },
      explanation: "Shift n: n = 0. Continue for remaining 28 iterations...",
      highlightedLines: [3],
      lineExecution: "for (let i = 4; i < 32; i++)",
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '0'],
      bitsResult: ['0', '0', '0', '0', '1', '1', '0', '1']
    },
    {
      variables: { result: '11010000...', iterations: 32 },
      explanation: "After 32 iterations, all bits reversed. Return unsigned result.",
      highlightedLines: [8],
      lineExecution: "return result >>> 0;",
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '0'],
      bitsResult: ['1', '1', '0', '1', '0', '0', '0', '0']
    },
    {
      variables: { result: '11010000...', finalResult: 'reversed 32-bit value' },
      explanation: "Algorithm complete! Time: O(1) - always 32 iterations, Space: O(1).",
      highlightedLines: [8],
      lineExecution: "Result: reversed bits",
      bitsN: ['0', '0', '0', '0', '0', '0', '0', '0'],
      bitsResult: ['1', '1', '0', '1', '0', '0', '0', '0']
    }
  ];

  const code = `function reverseBits(n: number): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    const bit = n & 1;
    result = (result << 1) | bit;
    n >>>= 1;
  }
  return result >>> 0;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`n-bits-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Original n (8 bits shown)</h3>
              <div className="flex gap-1 justify-center">
                {step.bitsN.map((bit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`w-10 h-10 flex items-center justify-center font-mono text-lg border-2 rounded transition-all duration-300 ${
                      bit === '1' ? 'bg-primary/30 border-primary' : 'bg-muted border-border'
                    } ${idx === step.extractBit ? 'ring-2 ring-accent scale-110' : ''}`}
                  >
                    {bit}
                  </motion.div>
                ))}
              </div>
              {step.extractBit !== undefined && step.extractBit >= 0 && (
                <p className="text-xs text-center mt-2 text-muted-foreground">↑ Extracting this bit</p>
              )}
            </Card>
          </motion.div>

          <motion.div
            key={`result-bits-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Reversed result (8 bits shown)</h3>
              <div className="flex gap-1 justify-center">
                {step.bitsResult.map((bit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`w-10 h-10 flex items-center justify-center font-mono text-lg border-2 rounded transition-all duration-300 ${
                      bit === '1' ? 'bg-secondary/30 border-secondary' : 'bg-muted border-border'
                    }`}
                  >
                    {bit}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`algorithm-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-2 text-sm">Bit Operations:</h3>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>• n & 1: Extract rightmost bit</p>
                <p>• result {'<<'} 1: Shift result left</p>
                <p>• result | bit: Add extracted bit</p>
                <p>• n {'>>>'} 1: Unsigned right shift n</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <VariablePanel variables={step.variables} />
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