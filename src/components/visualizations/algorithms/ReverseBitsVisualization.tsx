import { useState, useMemo } from 'react';
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
  activeBitIndex?: number;    // The 'i' index in n (visual index 31-i)
  targetBitIndex?: number;    // The '31-i' index in res (visual index i)
}

export const ReverseBitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // User provided code
  const code = `function reverseBits(n: number): number {
    let res = 0;

    // Loop through all 32 bits
    for (let i = 0; i < 32; i++) {
        // Extract the i-th bit
        const bit = (n >> i) & 1;

        // Place the bit at the reversed position
        res |= bit << (31 - i);
    }

    // Ensure unsigned 32-bit result
    return res >>> 0;
}`;

  const steps = useMemo(() => {
    const generatedSteps: Step[] = [];
    // Example number n = 43261596 (binary ...0010100101000001111010011100)
    // Using n = 11 for consistency with previous example, but showing full 32 bits
    const nVal = 11; 
    let res = 0;
    
    // Helper to get 32-bit string array
    const toBits = (num: number) => 
        (num >>> 0).toString(2).padStart(32, '0').split('');

    // Initial state
    generatedSteps.push({
      variables: { n: nVal, res: 0 },
      explanation: "Initialize res = 0. We will build the Reversed result bit by bit.",
      highlightedLines: [2],
      lineExecution: "let res = 0;",
      bitsN: toBits(nVal),
      bitsResult: toBits(res)
    });

    for (let i = 0; i < 32; i++) {
        // Visual mappings:
        // Array index 0 is MSB (bit 31), Array index 31 is LSB (bit 0).
        // Logic 'i' is bit position from LSB (0..31).
        // So bit 'i' is located at array index 31 - i.
        const visualActiveIndex = 31 - i;

        // Step: Loop Check
        generatedSteps.push({
            variables: { n: nVal, res, i },
            explanation: `Loop i = ${i}. Processing bit at position ${i} of n.`,
            highlightedLines: [5],
            lineExecution: `for (let i = 0; i < 32; i++)`,
            bitsN: toBits(nVal),
            bitsResult: toBits(res),
            activeBitIndex: visualActiveIndex
        });

        // Step: Extract Bit
        const bit = (nVal >> i) & 1;
        generatedSteps.push({
            variables: { n: nVal, res, i, bit },
            explanation: `Extract i-th bit: (n >> ${i}) & 1 = ${bit}.`,
            highlightedLines: [7],
            lineExecution: `const bit = (n >> i) & 1;`,
            bitsN: toBits(nVal),
            bitsResult: toBits(res),
            activeBitIndex: visualActiveIndex
        });

        // Step: Place Bit
        const targetPos = 31 - i;
        // Target bit position visual index: 31 - targetPos = 31 - (31-i) = i.
        const visualTargetIndex = i;
        const shiftVal = bit << targetPos;
        res |= shiftVal;
        
        generatedSteps.push({
            variables: { n: nVal, res: res >>> 0, i, bit },
            explanation: `Place bit at reversed position ${targetPos}.\nUpdate res: Set bit ${targetPos} to ${bit}.`,
            highlightedLines: [10],
            lineExecution: `res |= bit << (31 - i);`,
            bitsN: toBits(nVal),
            bitsResult: toBits(res),
            activeBitIndex: visualActiveIndex,
            targetBitIndex: visualTargetIndex
        });
    }

    // Final result
    generatedSteps.push({
        variables: { n: nVal, res: res >>> 0 },
        explanation: "Loop complete. Return unsigned 32-bit result.",
        highlightedLines: [14],
        lineExecution: "return res >>> 0;",
        bitsN: toBits(nVal),
        bitsResult: toBits(res)
    });

    return generatedSteps;
  }, []);

  const step = steps[currentStep] || steps[0];

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
              <h3 className="font-semibold mb-2 text-sm">Input n (32 bits)</h3>
               {/* 
                 Visual mapping: Array index 0 = MSB (bit 31). Array index 31 = LSB (bit 0).
                 Bit labels row below provides context.
               */}
              <div className="flex flex-wrap gap-0.5 justify-center">
                {step.bitsN.map((bit, idx) => {
                  const isActive = step.activeBitIndex === idx;
                  return (
                    <motion.div
                      key={idx}
                      className={`w-6 h-8 flex items-center justify-center font-mono text-xs border rounded transition-colors ${
                        bit === '1' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'
                      } ${isActive ? 'ring-2 ring-yellow-500 bg-yellow-500/10 z-10 scale-110 shadow-md' : ''}`}
                      title={`Bit ${31 - idx}`}
                    >
                      {bit}
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex justify-between px-1 mt-1 text-[10px] text-muted-foreground font-mono w-full">
                 <span>31 (MSB)</span>
                 <span>(LSB) 0</span>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`result-bits-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Result res (32 bits)</h3>
              <div className="flex flex-wrap gap-0.5 justify-center">
                {step.bitsResult.map((bit, idx) => {
                  const isTarget = step.targetBitIndex === idx;
                  return (
                    <motion.div
                      key={idx}
                      className={`w-6 h-8 flex items-center justify-center font-mono text-xs border rounded transition-colors ${
                        bit === '1' ? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300' : 'bg-muted border-border text-muted-foreground'
                      } ${isTarget ? 'ring-2 ring-green-500 bg-green-500/10 z-10 scale-110 shadow-md' : ''}`}
                      title={`Bit ${31 - idx}`}
                    >
                      {bit}
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex justify-between px-1 mt-1 text-[10px] text-muted-foreground font-mono w-full">
                 <span>31 (MSB)</span>
                 <span>(LSB) 0</span>
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
                <div className="text-sm text-muted-foreground pt-2 whitespace-pre-wrap">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Variable Panel */}
          <div className="p-1">
             <VariablePanel variables={step.variables} />
          </div>

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