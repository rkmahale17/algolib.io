import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  bitsN: string[];
  bitsResult: string[];
  activeBitIndex?: number;    // The 'i' index in n (visual index 31-i)
  targetBitIndex?: number;    // The '31-i' index in res (visual index i)
}

const languages: VisualizationLanguageMap = {
  typescript: `function reverseBits(n: number): number {
  let res = 0;
  for (let i = 0; i < 32; i++) {
    const bit = (n >> i) & 1;
    res |= bit << (31 - i);
  }
  return res >>> 0;
}`,
  python: `def reverseBits(n: int) -> int:
    res = 0
    for i in range(32):
        bit = (n >> i) & 1
        res |= bit << (31 - i)
    return res`,
  java: `public static class Solution {
    public int reverseBits(int n) {
        int res = 0;
        for (int i = 0; i < 32; i++) {
            int bit = (n >> i) & 1;
            res |= bit << (31 - i);
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    uint32_t reverseBits(uint32_t n) {
        uint32_t res = 0;
        for (int i = 0; i < 32; i++) {
            uint32_t bit = (n >> i) & 1;
            res |= bit << (31 - i);
        }
        return res;
    }
};`
};

export const ReverseBitsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const generatedSteps: Step[] = [];
    const nVal = 11;
    let res = 0;

    const lines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    const toBits = (num: number) =>
      (num >>> 0).toString(2).padStart(32, '0').split('');

    // Initial state
    generatedSteps.push({
      variables: { n: nVal, res: 0 },
      explanation: "Initialize res = 0. We will build the reversed result bit by bit.",
      pseudoStep: "SET res = 0",
      bitsN: toBits(nVal),
      bitsResult: toBits(res)
    });
    addLines(2, 2, 3, 4);

    for (let i = 0; i < 32; i++) {
      const visualActiveIndex = 31 - i;

      // Loop check
      generatedSteps.push({
        variables: { n: nVal, res, i },
        explanation: `Loop i = ${i}. Processing bit at position ${i} of n. We shift 'n' right by 'i' positions to bring the target bit to the LSB position.`,
        pseudoStep: `FOR i = 0 TO 31 (i = ${i})`,
        bitsN: toBits(nVal),
        bitsResult: toBits(res),
        activeBitIndex: visualActiveIndex
      });
      addLines(3, 3, 4, 5);

      // Extract bit
      const bit = (nVal >> i) & 1;
      generatedSteps.push({
        variables: { n: nVal, res, i, bit },
        explanation: `Extract i-th bit: (n >> ${i}) & 1 = ${bit}. The bitwise AND with 1 isolates the single bit we care about.`,
        pseudoStep: `SET bit = (n >> ${i}) & 1 (bit = ${bit})`,
        bitsN: toBits(nVal),
        bitsResult: toBits(res),
        activeBitIndex: visualActiveIndex
      });
      addLines(4, 4, 5, 6);

      // Place bit
      const targetPos = 31 - i;
      const visualTargetIndex = i;
      const shiftVal = bit << targetPos;
      res |= shiftVal;

      generatedSteps.push({
        variables: { n: nVal, res: res >>> 0, i, bit },
        explanation: `Place bit at reversed position ${targetPos}.\nSet bit ${targetPos} in 'res' to ${bit} using bitwise OR (|) after shifting the bit left by ${targetPos}.`,
        pseudoStep: `SET res = res | (bit << ${targetPos}) (res = ${res >>> 0})`,
        bitsN: toBits(nVal),
        bitsResult: toBits(res),
        activeBitIndex: visualActiveIndex,
        targetBitIndex: visualTargetIndex
      });
      addLines(5, 5, 6, 7);
    }

    // Final result
    generatedSteps.push({
      variables: { n: nVal, res: res >>> 0 },
      explanation: "Loop complete. Return unsigned 32-bit result. Using '>>> 0' forces JavaScript to treat 'res' as an unsigned 32-bit integer, avoiding negative representations.",
      pseudoStep: "RETURN res >>> 0",
      bitsN: toBits(nVal),
      bitsResult: toBits(res)
    });
    addLines(7, 6, 8, 9);

    return { steps: generatedSteps, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
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

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">{step.explanation}</p>
            </Card>

            <VariablePanel variables={step.variables} />
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};