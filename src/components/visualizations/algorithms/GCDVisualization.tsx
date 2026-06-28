import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  a: number;
  b: number;
  temp: number | null;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function gcd(a: number, b: number): number {
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}`,
  python: `def gcd_euclidean(a, b):
    while(b):
        a, b = b, a % b
    return a`,
  java: `public static int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`,
  cpp: `class Solution {
public:
    int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
};`
};

export const GCDVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const initialA = 48;
  const initialB = 18;

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
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

    let a = initialA;
    let b = initialB;

    s.push({
      a, b, temp: null,
      explanation: `Starting GCD with a = ${a}, b = ${b}.`,
      pseudoStep: `CALL gcd(a = ${a}, b = ${b})`,
      variables: { a, b }
    });
    addLines(1, 1, 1, 3);

    while (b) {
      s.push({
        a, b, temp: null,
        explanation: `Checking while condition: b (${b}) is non-zero.`,
        pseudoStep: `WHILE b != 0 (${b} != 0) → YES ✓`,
        variables: { a, b }
      });
      addLines(2, 2, 2, 4);

      const temp = b;
      s.push({
        a, b, temp,
        explanation: `Store current b in temp: temp = ${temp}.`,
        pseudoStep: `SET temp = b (temp = ${temp})`,
        variables: { a, b, temp }
      });
      addLines(3, 2, 3, 5);

      const remainder = a % b;
      b = remainder;
      s.push({
        a, b, temp,
        explanation: `Calculate remainder: b = a % b = ${a} % ${temp} = ${remainder}.`,
        pseudoStep: `SET b = a % b (b = ${a} % ${temp} = ${remainder})`,
        variables: { a, b, temp, remainder }
      });
      addLines(4, 3, 4, 6);

      a = temp;
      s.push({
        a, b, temp,
        explanation: `Update a to the previous value of b (stored in temp): a = ${a}.`,
        pseudoStep: `SET a = temp (a = ${temp})`,
        variables: { a, b, temp }
      });
      addLines(5, 3, 5, 7);
    }

    s.push({
      a, b, temp: null,
      explanation: "b is now 0. The GCD is the current value of a.",
      pseudoStep: "WHILE b != 0 (0 != 0) → NO ✗",
      variables: { a, b }
    });
    addLines(2, 2, 2, 4);

    s.push({
      a, b, temp: null,
      explanation: `Return GCD = ${a}.`,
      pseudoStep: `RETURN a (a = ${a})`,
      variables: { result: a }
    });
    addLines(7, 4, 7, 9);

    return { steps: s, stepLineNumbers: lines };
  }, [initialA, initialB]);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 2v20M2 12h20M7 7l10 10M7 17L17 7" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="text-sm font-semibold mb-8 text-muted-foreground uppercase tracking-widest text-center">Division Algorithm Status</h3>

              <div className="flex justify-around items-end gap-4 mb-12">
                <div className="flex flex-col items-center gap-3 w-1/3">
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Value A</div>
                  <motion.div
                    className="w-full aspect-square bg-primary/10 border-2 border-primary/50 rounded-3xl flex items-center justify-center relative shadow-[0_0_20px_rgba(var(--primary),0.15)]"
                  >
                    <span className="text-4xl font-black text-primary">{step.a}</span>
                  </motion.div>
                </div>

                <div className="flex flex-col items-center gap-6 pb-4">
                  <div className="text-2xl font-black text-muted-foreground/30">%</div>
                  <motion.div
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>

                <div className="flex flex-col items-center gap-3 w-1/3">
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Value B</div>
                  <motion.div
                    className="w-full aspect-square bg-blue-500/10 border-2 border-blue-500/50 rounded-3xl flex items-center justify-center relative shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                  >
                    <span className="text-4xl font-black text-blue-500">{step.b}</span>
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence mode="wait">
                  {step.temp !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-4 bg-accent/10 border-2 border-accent/40 rounded-2xl flex flex-col items-center"
                    >
                      <span className="text-[10px] font-bold text-accent uppercase mb-1">Temp (Stored B)</span>
                      <span className="text-2xl font-black text-accent">{step.temp}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-4 bg-muted/30 border-2 border-dashed border-border rounded-2xl flex flex-col items-center col-start-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Modulo (A % B)</span>
                  <span className="text-2xl font-black text-muted-foreground">
                    {step.variables.remainder !== undefined ? step.variables.remainder : (step.b !== 0 ? step.a % step.b : '0')}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-6 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Euclidean Insight</h4>
              <p className="text-sm font-medium leading-relaxed min-h-[40px]">{step.explanation}</p>
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
