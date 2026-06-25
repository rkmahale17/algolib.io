import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

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
  pseudoStep: string;
  variables: Record<string, any>;
  depth: number;
  callStack: string[];
}

const languages: VisualizationLanguageMap = {
  typescript: `function karatsuba(x: number, y: number): number {
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
}`,
  python: `def karatsuba(x, y):
    if x < 10 or y < 10:
        return x * y
    n = max(len(str(x)), len(str(y)))
    n_half = n // 2
    a = x // (10 ** n_half)
    b = x % (10 ** n_half)
    c = y // (10 ** n_half)
    d = y % (10 ** n_half)
    ac = karatsuba(a, c)
    bd = karatsuba(b, d)
    ad_plus_bc = karatsuba(a + b, c + d) - ac - bd
    result = ac * (10 ** (2 * n_half)) + ad_plus_bc * (10 ** n_half) + bd
    return result`,
  java: `public static long karatsuba(long x, long y) {
    if (x < 10 || y < 10) {
        return x * y;
    }
    int n = Math.max(String.valueOf(x).length(), String.valueOf(y).length());
    int halfN = (n + 1) / 2;
    long a = x / (long)Math.pow(10, halfN);
    long b = x % (long)Math.pow(10, halfN);
    long c = y / (long)Math.pow(10, halfN);
    long d = y % (long)Math.pow(10, halfN);
    long ac = karatsuba(a, c);
    long bd = karatsuba(b, d);
    long ad_plus_bc = karatsuba(a + b, c + d) - ac - bd;
    return ac * (long)Math.pow(10, 2 * halfN) + ad_plus_bc * (long)Math.pow(10, halfN) + bd;
}`,
  cpp: `class Solution {
public:
long long karatsuba(long long x, long long y) {
    if (x < 10 || y < 10) {
        return x * y;
    }
    int n = max(to_string(x).length(), to_string(y).length());
    int m = n / 2;
    long long power = 1;
    for (int i = 0; i < m; i++) power *= 10;
    long long a = x / power;
    long long b = x % power;
    long long c = y / power;
    long long d = y % power;
    long long ac = karatsuba(a, c);
    long long bd = karatsuba(b, d);
    long long adbc = karatsuba(a + b, c + d) - ac - bd;
    long long power2m = power * power;
    return ac * power2m + adbc * power + bd;
}
};`
};

export const KaratsubaVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputX] = useState(1234);
  const [inputY] = useState(5678);

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

    const runKaratsuba = (x: number, y: number, depth: number, stack: string[]): number => {
      const currentStack = [...stack, `karatsuba(${x}, ${y})`];

      s.push({
        x, y, depth, callStack: currentStack,
        explanation: `Calling karatsuba(x=${x}, y=${y}) at depth ${depth}.`,
        pseudoStep: `CALL karatsuba(x = ${x}, y = ${y})`,
        variables: { x, y, depth }
      });
      addLines(1, 1, 1, 3);

      const xStr = x.toString();
      const yStr = y.toString();
      s.push({
        x, y, depth, callStack: currentStack,
        explanation: `Convert numbers to strings for digit operations: xStr="${xStr}", yStr="${yStr}".`,
        pseudoStep: `SET xStr = "${xStr}", yStr = "${yStr}"`,
        variables: { xStr, yStr }
      });
      addLines(2, 4, 5, 7);

      const n = Math.max(xStr.length, yStr.length);
      s.push({
        x, y, depth, callStack: currentStack,
        explanation: `Determine maximum digit length n = ${n}.`,
        pseudoStep: `SET n = max(length(x), length(y)) (n = ${n})`,
        variables: { xStr, yStr, n }
      });
      addLines(4, 4, 5, 7);

      if (n <= 1) {
        const res = x * y;
        s.push({
          x, y, depth, callStack: currentStack,
          explanation: `Base case reached: n <= 1. Multiply directly: ${x} * ${y} = ${res}.`,
          pseudoStep: `IF n <= 1 → RETURN x * y (${x} * ${y} = ${res})`,
          variables: { x, y, result: res }
        });
        addLines(6, 3, 3, 5);
        return res;
      }

      const halfN = Math.floor(n / 2);
      s.push({
        x, y, depth, callStack: currentStack, halfN,
        explanation: `Calculate partition split point halfN = floor(${n} / 2) = ${halfN}.`,
        pseudoStep: `SET halfN = n / 2 (halfN = ${halfN})`,
        variables: { n, halfN }
      });
      addLines(8, 5, 6, 8);

      const a = parseInt(xStr.slice(0, xStr.length - halfN) || '0');
      const b = parseInt(xStr.slice(xStr.length - halfN) || '0');
      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b,
        explanation: `Split multiplier x into most significant half a = ${a} and least significant half b = ${b}.`,
        pseudoStep: `SET a = x[high] (${a}), b = x[low] (${b})`,
        variables: { xStr, halfN, a, b }
      });
      addLines(9, 6, 7, 11);

      const c = parseInt(yStr.slice(0, yStr.length - halfN) || '0');
      const d = parseInt(yStr.slice(yStr.length - halfN) || '0');
      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d,
        explanation: `Split multiplier y into most significant half c = ${c} and least significant half d = ${d}.`,
        pseudoStep: `SET c = y[high] (${c}), d = y[low] (${d})`,
        variables: { yStr, halfN, c, d }
      });
      addLines(11, 8, 9, 13);

      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d,
        explanation: `Recursively compute product of high halves: ac = karatsuba(a=${a}, c=${c}).`,
        pseudoStep: `SET ac = CALL karatsuba(a, c) (a = ${a}, c = ${c})`,
        variables: { a, c }
      });
      addLines(13, 10, 11, 15);
      const ac = runKaratsuba(a, c, depth + 1, currentStack);

      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d, ac,
        explanation: `Recursively compute product of low halves: bd = karatsuba(b=${b}, d=${d}).`,
        pseudoStep: `SET bd = CALL karatsuba(b, d) (b = ${b}, d = ${d})`,
        variables: { b, d, ac }
      });
      addLines(14, 11, 12, 16);
      const bd = runKaratsuba(b, d, depth + 1, currentStack);

      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d, ac, bd,
        explanation: `Compute combined inner product recursively: (a+b)(c+d) - ac - bd.`,
        pseudoStep: `SET ad_plus_bc = CALL karatsuba(a+b, c+d) - ac - bd`,
        variables: { a_plus_b: a + b, c_plus_d: c + d, ac, bd }
      });
      addLines(15, 12, 13, 17);
      const ad_plus_bc = runKaratsuba(a + b, c + d, depth + 1, currentStack) - ac - bd;

      const result = ac * Math.pow(10, 2 * halfN) + ad_plus_bc * Math.pow(10, halfN) + bd;
      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d, ac, bd, ad_plus_bc, result,
        explanation: `Combine intermediate products using Karatsuba equation: ${ac}*10^${2 * halfN} + ${ad_plus_bc}*10^${halfN} + ${bd} = ${result}.`,
        pseudoStep: `SET result = ac*10^(2*halfN) + (ad+bc)*10^halfN + bd`,
        variables: { ac, bd, ad_plus_bc, halfN, result }
      });
      addLines(16, 13, 14, 19);

      s.push({
        x, y, depth, callStack: currentStack, halfN, a, b, c, d, ac, bd, ad_plus_bc, result,
        explanation: `Returning computed product result = ${result} for karatsuba(${x}, ${y}).`,
        pseudoStep: `RETURN result (result = ${result})`,
        variables: { result }
      });
      addLines(17, 13, 14, 19);

      return result;
    };

    runKaratsuba(inputX, inputY, 0, []);
    return { steps: s, stepLineNumbers: lines };
  }, [inputX, inputY]);

  const step = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wider">Multiplication breakdown</h3>

              <div className="flex flex-col items-center justify-center space-y-8 min-h-[300px]">
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

                <AnimatePresence mode="wait">
                  {(step.ac !== undefined || step.bd !== undefined || step.ad_plus_bc !== undefined) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex flex-wrap justify-center gap-3 px-2"
                    >
                      <div className="flex flex-col items-center p-2 rounded-lg border bg-blue-500/10 border-blue-500/30">
                        <span className="text-[8px] font-bold uppercase text-muted-foreground mb-1">ac</span>
                        <span className="text-sm font-mono font-bold">{step.ac ?? '?'}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg border bg-green-500/10 border-green-500/30">
                        <span className="text-[8px] font-bold uppercase text-muted-foreground mb-1">bd</span>
                        <span className="text-sm font-mono font-bold">{step.bd ?? '?'}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg border bg-orange-500/10 border-orange-500/30">
                        <span className="text-[8px] font-bold uppercase text-muted-foreground mb-1">ad+bc</span>
                        <span className="text-sm font-mono font-bold">{step.ad_plus_bc ?? '?'}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {step.result !== undefined && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-500/10 border-2 border-emerald-500/50 p-4 rounded-xl shadow-2xl"
                    >
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center mb-1">Intermediate Result</div>
                      <div className="text-2xl font-black text-foreground font-mono">{step.result}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Algorithm Logic</h4>
                <div className="flex space-x-1">
                  {step.callStack.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === step.depth ? 'bg-primary animate-pulse' : 'bg-primary/20'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">{step.explanation}</p>
            </Card>

            <VariablePanel variables={step.variables} />

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
