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
  for (let i = 0; i < 32; i++) {
    const bit = (n >> i) & 1;
    res |= bit << (31 - i);
  }
  return res >>> 0;
}`;

  const steps = useMemo(() => {
    const generatedSteps: Step[] = [];
    // Example number n = 11 (binary ...00000000000000000000000000001011)
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
        explanation: `Loop i = ${i}. Processing bit at position ${i} of n. We shift 'n' right by 'i' positions to bring the target bit to the least significant position.`,
        highlightedLines: [3],
        lineExecution: `for (let i = 0; i < 32; i++)`,
        bitsN: toBits(nVal),
        bitsResult: toBits(res),
        activeBitIndex: visualActiveIndex
      });

      // Step: Extract Bit
      const bit = (nVal >> i) & 1;
      generatedSteps.push({
        variables: { n: nVal, res, i, bit },
        explanation: `Extract i-th bit: (n >> ${i}) & 1 = ${bit}. The bitwise AND with 1 isolates the single bit we care about.`,
        highlightedLines: [4],
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
        explanation: `Place bit at reversed position ${targetPos}.\nSet bit ${targetPos} in 'res' to ${bit} using bitwise OR (|) after shifting the bit left by ${targetPos}.`,
        highlightedLines: [5],
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
      explanation: "Loop complete. Return unsigned 32-bit result. Using '>>> 0' forces JavaScript to treat 'res' as an unsigned 32-bit integer, avoiding negative representations.",
      highlightedLines: [7],
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
        <div className="space-y-6">
          <div>
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="font-bold mb-3 text-sm text-primary uppercase tracking-wider">Input n (32 bits)</h3>
              <div className="flex flex-wrap gap-0.5 justify-center">
                {step.bitsN.map((bit, idx) => {
                  const isActive = step.activeBitIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`w-6 h-8 flex items-center justify-center font-mono text-xs border rounded ${bit === '1' ? 'bg-primary/20 border-primary/50 text-foreground' : 'bg-muted/50 border-border text-muted-foreground/50'
                        } ${isActive ? 'ring-2 ring-orange-500 bg-orange-500/20 z-10 !text-orange-500 !border-orange-500' : ''}`}
                      title={`Bit ${31 - idx}`}
                    >
                      {bit}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between px-1 mt-2 text-[10px] text-muted-foreground font-mono w-full font-bold">
                <span>31 (MSB)</span>
                <span>0 (LSB)</span>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="font-bold mb-3 text-sm text-green-600 uppercase tracking-wider">Result res (32 bits)</h3>
              <div className="flex flex-wrap gap-0.5 justify-center">
                {step.bitsResult.map((bit, idx) => {
                  const isTarget = step.targetBitIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`w-6 h-8 flex items-center justify-center font-mono text-xs border rounded ${bit === '1' ? 'bg-green-500/20 border-green-500/50 text-foreground' : 'bg-muted/50 border-border text-muted-foreground/50'
                        } ${isTarget ? 'ring-2 ring-green-500 bg-green-500/20 z-10 !text-green-500 !border-green-500' : ''}`}
                      title={`Bit ${31 - idx}`}
                    >
                      {bit}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between px-1 mt-2 text-[10px] text-muted-foreground font-mono w-full font-bold">
                <span>31 (MSB)</span>
                <span>0 (LSB)</span>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-5 border-l-4 border-primary bg-primary/5 relative overflow-hidden shadow-sm">
              <div className="space-y-4">
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                     Current Execution
                   </h4>
                   <div className="text-sm font-mono bg-background/80 p-2.5 rounded-lg border border-border/50 shadow-sm inline-block">
                     {step.lineExecution}
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                     Commentary
                   </h4>
                   <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                     {step.explanation}
                   </p>
                </div>
              </div>
            </Card>
          </div>

        </div>
      }
      rightContent={
        <div className="space-y-6 h-full flex flex-col">
          <div className="flex-1 overflow-hidden min-h-[400px]">
            <AnimatedCodeEditor
              code={code}
              language="typescript"
              highlightedLines={step.highlightedLines}
            />
          </div>
          {/* Variable Panel */}
          <div className="p-1">
            <VariablePanel variables={step.variables} />
          </div>
        </div>
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