import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  a: number;
  b: number;
  temp: number | null;
  explanation: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const GCDVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const initialA = 48;
  const initialB = 18;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    let a = initialA;
    let b = initialB;

    s.push({
      a, b, temp: null,
      explanation: `Starting GCD with a = ${a}, b = ${b}.`,
      highlightedLines: [1],
      variables: { a, b }
    });

    while (b) {
      s.push({
        a, b, temp: null,
        explanation: `Checking while condition: b (${b}) is non-zero.`,
        highlightedLines: [2],
        variables: { a, b }
      });

      const temp = b;
      s.push({
        a, b, temp,
        explanation: `Store current b in temp: temp = ${temp}.`,
        highlightedLines: [3],
        variables: { a, b, temp }
      });

      const remainder = a % b;
      b = remainder;
      s.push({
        a, b, temp,
        explanation: `Calculate remainder: b = a % b = ${a} % ${temp} = ${remainder}.`,
        highlightedLines: [4],
        variables: { a, b, temp, remainder }
      });

      a = temp;
      s.push({
        a, b, temp,
        explanation: `Update a to the previous value of b (stored in temp): a = ${a}.`,
        highlightedLines: [5],
        variables: { a, b, temp }
      });
    }

    s.push({
      a, b, temp: null,
      explanation: "b is now 0. The GCD is the current value of a.",
      highlightedLines: [2],
      variables: { a, b }
    });

    s.push({
      a, b, temp: null,
      explanation: `Return GCD = ${a}.`,
      highlightedLines: [7],
      variables: { result: a }
    });

    return s;
  }, [initialA, initialB]);

  const code = `function gcd(a: number, b: number): number {
    while (b) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
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
                  animate={{ scale: step.highlightedLines.includes(5) ? 1.1 : 1 }}
                  className="w-full aspect-square bg-primary/10 border-2 border-primary/50 rounded-3xl flex items-center justify-center relative shadow-[0_0_20px_rgba(var(--primary),0.15)]"
                >
                  <span className="text-4xl font-black text-primary">{step.a}</span>
                </motion.div>
              </div>

              <div className="flex flex-col items-center gap-6 pb-4">
                <div className="text-2xl font-black text-muted-foreground/30">%</div>
                <motion.div
                  animate={{ rotate: step.highlightedLines.includes(4) ? 180 : 0 }}
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
                  animate={{ scale: step.highlightedLines.includes(4) ? 1.1 : 1 }}
                  className="w-full aspect-square bg-blue-500/10 border-2 border-blue-500/50 rounded-3xl flex items-center justify-center relative shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                >
                  <span className="text-4xl font-black text-blue-500">{step.b}</span>
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence>
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

          <Card className="p-6 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Euclidean Insight</h4>
            <p className="text-sm font-medium leading-relaxed">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
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
