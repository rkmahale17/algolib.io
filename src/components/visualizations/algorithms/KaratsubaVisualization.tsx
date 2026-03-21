import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  x: number;
  y: number;
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  ac?: number;
  bd?: number;
  ad_plus_bc?: number;
  halfN?: number;
  result?: number;
  explanation: string;
  highlightedLines: number[];
  variables: Record<string, any>;
  depth: number;
  callStack: string[];
}

export const KaratsubaVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputX, setInputX] = useState(1234);
  const [inputY, setInputY] = useState(5678);

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];

    const karatsuba = (x: number, y: number, depth: number, stack: string[]): number => {
      const currentStack = [...stack, `karatsuba(${x}, ${y})`];

      s.push({
        x, y, depth, callStack: currentStack,
        explanation: `Calling karatsuba(x=${x}, y=${y}) at depth ${depth}.`,
        highlightedLines: [1],
        variables: { x, y, depth }
      });

      const xStr = x.toString();
      const yStr = y.toString();
      s.push({
        x, y, depth, callStack: currentStack,
        explanation: `Convert numbers to strings: xStr="${xStr}", yStr="${yStr}".`,
        highlightedLines: [2, 3],
        variables: { xStr, yStr }
      });

      const n = Math.max(xStr.length, yStr.length);
      s.push({
        x, y, depth, callStack: currentStack,
        explanation: `Determine max length n = ${n}.`,
        highlightedLines: [5],
        variables: { xStr, yStr, n }
      });

      if (n <= 1) {
        const res = x * y;
        s.push({
          x, y, depth, callStack: currentStack,
          explanation: `Base case: n <= 1. Multiply directly: ${x} * ${y} = ${res}.`,
          highlightedLines: [7, 8, 9],
          variables: { x, y, result: res }
        });
        return res;
      }

      const halfN = Math.floor(n / 2);
      s.push({
        x, y, depth, callStack: currentStack, halfN,
        explanation: `Calculate halfN = floor(${n} / 2) = ${halfN}.`,
        highlightedLines: [11],
        variables: { n, halfN }
      });

      const a = parseInt(xStr.slice(0, xStr.length - halfN) || '0');
      const b = parseInt(xStr.slice(xStr.length - halfN) || '0');
      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b,
        explanation: `Split x into a = ${a} and b = ${b}.`,
        highlightedLines: [13, 14],
        variables: { xStr, halfN, a, b }
      });

      const c = parseInt(yStr.slice(0, yStr.length - halfN) || '0');
      const d = parseInt(yStr.slice(yStr.length - halfN) || '0');
      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d,
        explanation: `Split y into c = ${c} and d = ${d}.`,
        highlightedLines: [15, 16],
        variables: { yStr, halfN, c, d }
      });

      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d,
        explanation: `Recursively compute ac = karatsuba(a=${a}, c=${c}).`,
        highlightedLines: [18],
        variables: { a, c }
      });
      const ac = karatsuba(a, c, depth + 1, currentStack);

      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d, ac,
        explanation: `Recursively compute bd = karatsuba(b=${b}, d=${d}).`,
        highlightedLines: [19],
        variables: { b, d, ac }
      });
      const bd = karatsuba(b, d, depth + 1, currentStack);

      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d, ac, bd,
        explanation: `Compute ad_plus_bc = karatsuba(a+b=${a + b}, c+d=${c + d}) - ac - bd.`,
        highlightedLines: [20],
        variables: { a_plus_b: a + b, c_plus_d: c + d, ac, bd }
      });
      const ad_plus_bc = karatsuba(a + b, c + d, depth + 1, currentStack) - ac - bd;

      const result = ac * Math.pow(10, 2 * halfN) + ad_plus_bc * Math.pow(10, halfN) + bd;
      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d, ac, bd, ad_plus_bc, result,
        explanation: `Combine results: ${ac} * 10^${2 * halfN} + ${ad_plus_bc} * 10^${halfN} + ${bd} = ${result}.`,
        highlightedLines: [22],
        variables: { ac, bd, ad_plus_bc, halfN, result }
      });

      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d, ac, bd, ad_plus_bc, result,
        explanation: `Returning result ${result} for karatsuba(${x}, ${y}).`,
        highlightedLines: [24],
        variables: { result }
      });

      return result;
    };

    karatsuba(inputX, inputY, 0, []);
    return s;
  }, [inputX, inputY]);

  const code = `function karatsuba(x: number, y: number): number {
  const xStr = x.toString();
  const yStr = y.toString();

  const n = Math.max(xStr.length, yStr.length);

  if (n <= 1) {
    return x * y;
  }

  const halfN = Math.floor(n / 2);

  const a = parseInt(xStr.slice(0, xStr.length - halfN) || '0');
  const b = parseInt(xStr.slice(xStr.length - halfN) || '0');
  const c = parseInt(yStr.slice(0, yStr.length - halfN) || '0');
  const d = parseInt(yStr.slice(yStr.length - halfN) || '0');

  const ac = karatsuba(a, c);
  const bd = karatsuba(b, d);
  const ad_plus_bc = karatsuba(a + b, c + d) - ac - bd;

  const result = ac * Math.pow(10, 2 * halfN) + ad_plus_bc * Math.pow(10, halfN) + bd;

  return result;
}`;

  const step = steps[currentStep] || steps[0];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wider">Multiplication breakdown</h3>

            <div className="flex flex-col items-center justify-center space-y-8 min-h-[300px]">
              {/* Current numbers being multiplied */}
              <motion.div
                layout
                className="flex flex-wrap items-center justify-center gap-6 bg-primary/10 p-6 rounded-2xl border-2 border-primary/20 shadow-xl"
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-primary">{step.x}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Multiplier X</span>
                </div>
                <span className="text-4xl font-light text-muted-foreground">×</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-primary">{step.y}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Multiplier Y</span>
                </div>
              </motion.div>

              {/* Splitting representation */}
              <AnimatePresence mode="wait">
                {step.a !== undefined && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full grid grid-cols-2 gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-end px-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Split X</span>
                        <span className="text-[10px] font-medium text-primary/60">10^{step.halfN}</span>
                      </div>
                      <div className="flex h-12 rounded-lg overflow-hidden border border-border bg-muted/20">
                        <div className="flex-1 flex items-center justify-center bg-blue-500/10 text-blue-400 font-bold border-r border-border">
                          {step.a}
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-purple-500/10 text-purple-400 font-bold">
                          {step.b}
                        </div>
                      </div>
                      <div className="flex justify-between px-2 text-[10px] font-bold">
                        <span className="text-blue-500/60 text-center flex-1 italic text-[9px]">a (high)</span>
                        <span className="text-purple-500/60 text-center flex-1 italic text-[9px]">b (low)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-end px-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Split Y</span>
                        <span className="text-[10px] font-medium text-primary/60">10^{step.halfN}</span>
                      </div>
                      <div className="flex h-12 rounded-lg overflow-hidden border border-border bg-muted/20">
                        <div className="flex-1 flex items-center justify-center bg-green-500/10 text-green-400 font-bold border-r border-border">
                          {step.c}
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-orange-500/10 text-orange-400 font-bold">
                          {step.d}
                        </div>
                      </div>
                      <div className="flex justify-between px-2 text-[10px] font-bold">
                        <span className="text-green-500/60 text-center flex-1 italic text-[9px]">c (high)</span>
                        <span className="text-orange-500/60 text-center flex-1 italic text-[9px]">d (low)</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recursive components */}
              <AnimatePresence mode="wait">
                {(step.ac !== undefined || step.bd !== undefined || step.ad_plus_bc !== undefined) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex flex-wrap justify-center gap-3 px-2"
                  >
                    <div className={`flex flex-col items-center p-2 rounded-lg border transition-all ${step.highlightedLines.includes(21) ? 'bg-blue-500/20 shadow-sm border-blue-500/50' : 'bg-muted/10 border-border/50 opacity-60'}`}>
                      <span className="text-[8px] font-bold uppercase text-muted-foreground mb-1">ac</span>
                      <span className="text-sm font-mono font-bold">{step.ac ?? '?'}</span>
                    </div>
                    <div className={`flex flex-col items-center p-2 rounded-lg border transition-all ${step.highlightedLines.includes(22) ? 'bg-green-500/20 shadow-sm border-green-500/50' : 'bg-muted/10 border-border/50 opacity-60'}`}>
                      <span className="text-[8px] font-bold uppercase text-muted-foreground mb-1">bd</span>
                      <span className="text-sm font-mono font-bold">{step.bd ?? '?'}</span>
                    </div>
                    <div className={`flex flex-col items-center p-2 rounded-lg border transition-all ${step.highlightedLines.includes(23) ? 'bg-orange-500/20 shadow-sm border-orange-500/50' : 'bg-muted/10 border-border/50 opacity-60'}`}>
                      <span className="text-[8px] font-bold uppercase text-muted-foreground mb-1">ad+bc</span>
                      <span className="text-sm font-mono font-bold">{step.ad_plus_bc ?? '?'}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Final Result */}
              <AnimatePresence mode="wait">
                {step.result !== undefined && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotateX: 45 }}
                    animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="bg-emerald-500/10 border-2 border-emerald-500/50 p-4 rounded-xl shadow-2xl shadow-emerald-500/10"
                  >
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center mb-1">Intermediate Result</div>
                    <div className="text-2xl font-black text-foreground font-mono">{step.result}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Algorithm Logic</h4>
              <div className="flex space-x-1">
                {step.callStack.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === step.depth ? 'bg-primary animate-pulse' : 'bg-primary/20'}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />

          {/* Call Stack Visualization */}
          <Card className="p-4 bg-muted/20 border-dashed border-border">
            <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-3 flex items-center">
              <span className="mr-2">Recursion Stack</span>
              <span className="px-1.5 py-0.5 rounded bg-muted text-[8px]">Depth: {step.depth}</span>
            </h4>
            <div className="space-y-1.5">
              {step.callStack.map((call, idx) => (
                <motion.div
                  key={`${idx}-${call}`}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  style={{ marginLeft: `${idx * 8}px` }}
                  className={`text-[10px] font-mono py-1 px-2 rounded-md flex items-center border ${idx === step.depth ? 'bg-primary/10 border-primary/30 text-primary font-bold' : 'bg-muted/50 border-transparent text-muted-foreground'}`}
                >
                  <span className="mr-2 opacity-50">{idx}</span>
                  {call}
                </motion.div>
              ))}
            </div>
          </Card>
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
