import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Zap, Layers, Info } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface StackFrame {
  x: number;
  n: number;
  res?: number;
}

interface Step {
  phase: string;
  x: number;
  n: number;
  absN: number;
  helperX: number;
  helperN: number;
  stack: StackFrame[];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  finalRes?: number;
  finalAdjusted?: number;
}

interface TestCase {
  id: string;
  label: string;
  x: number;
  n: number;
  description: string;
}

const TEST_CASES: TestCase[] = [
  { id: 'positive-even', label: 'x = 2.0, n = 10', x: 2.0, n: 10, description: 'Symmetric (Even Exponent)' },
  { id: 'positive-odd', label: 'x = 2.1, n = 3', x: 2.1, n: 3, description: 'Asymmetric (Odd Exponent)' },
  { id: 'negative-even', label: 'x = 2.0, n = -2', x: 2.0, n: -2, description: 'Inversion (Negative Exponent)' },
];

const languages: VisualizationLanguageMap = {
  typescript: `function myPow(x: number, n: number): number {
  const res = helper(x, Math.abs(n));
  return n >= 0 ? res : 1 / res;
}

function helper(x: number, n: number): number {
  if (x === 0) return 0;
  if (n === 0) return 1;
  const res = helper(x * x, Math.floor(n / 2));
  return n % 2 !== 0 ? x * res : res;
}`,
  python: `def myPow(x: float, n: int) -> float:
    res = helper(x, abs(n))
    return res if n >= 0 else 1 / res

def helper(x: float, n: int) -> float:
    if x == 0:
        return 0
    if n == 0:
        return 1
    res = helper(x * x, n // 2)
    return x * res if n % 2 != 0 else res`,
  java: `public static class Solution {
    public double myPow(double x, int n) {
        long N = n;
        if (N < 0) {
            x = 1 / x;
            N = -N;
        }
        return helper(x, N);
    }
    private double helper(double x, long n) {
        if (x == 0) return 0;
        if (n == 0) return 1;
        double res = helper(x * x, n / 2);
        return (n % 2 != 0) ? x * res : res;
    }
}`,
  cpp: `class Solution {
public:
    double myPow(double x, int n) {
        long long N = n;
        if (N < 0) {
            x = 1 / x;
            N = -N;
        }
        double ans = 1.0;
        double current_product = x;
        for (long long i = N; i > 0; i /= 2) {
            if (i % 2 == 1) {
                ans = ans * current_product;
            }
            current_product = current_product * current_product;
        }
        return ans;
    }
};`
};

export const PowxNVisualization = () => {
  const [testCaseIndex, setTestCaseIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const selectedCase = TEST_CASES[testCaseIndex];

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const x = selectedCase.x;
    const n = selectedCase.n;
    const absN = Math.abs(n);

    const addStep = (
      phase: string,
      hx: number,
      hn: number,
      stack: StackFrame[],
      explanation: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      s.push({
        phase,
        x,
        n,
        absN,
        helperX: hx,
        helperN: hn,
        stack: [...stack],
        explanation,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    // 1. Entering myPow
    addStep(
      'myPow-entry', x, absN, [],
      `MULTIPLIER INITIATED: Fuel Core set to density x = ${x.toFixed(2)}. Target Warp Factor n = ${n}. Pre-checking exponent phase direction.`,
      `myPow(x=${x}, n=${n})`,
      { x, n },
      1, 1, 2, 3
    );

    // 2. Inversion check
    addStep(
      'myPow-entry', x, absN, [],
      `Pre-checking absolute values. Target exponent absolute is |${n}| = ${absN}.`,
      `SET absN = abs(n)  →  ${absN}`,
      { x, n, absN },
      2, 2, 4, 5
    );

    // 3. Calling helper
    addStep(
      'myPow-call-helper', x, absN, [],
      `ABS EXTRAPOLATION: Booting recursive sub-reactor core helper(${x.toFixed(2)}, ${absN}).`,
      `CALL helper(x=${x}, n=${absN})`,
      { x, n, absN },
      2, 2, 8, 11
    );

    const stackFrames: StackFrame[] = [];

    function runHelper(hx: number, hn: number): number {
      const frameIndex = stackFrames.length;
      stackFrames.push({ x: hx, n: hn });

      addStep(
        'helper-entry', hx, hn, stackFrames,
        `REACTOR FRAME CHARGING: Level ${stackFrames.length} recursion chamber online. Processing local core x = ${hx.toFixed(5)}, n = ${hn}.`,
        `CALL helper(x=${hx.toFixed(3)}, n=${hn})`,
        { x, n, "helper x": Number(hx.toFixed(5)), "helper n": hn, stackDepth: stackFrames.length },
        6, 5, 10, 11
      );

      addStep(
        'helper-check-x', hx, hn, stackFrames,
        `FUEL CORE CHECK: Assessing core density x. Current value is ${hx.toFixed(5)}. Reactor check: ${hx === 0 ? 'CRITICAL: Fuel density is zero. Instant decay to 0 energy.' : 'Fuel core density verified (non-zero).'}`,
        `IF x == 0  →  ${hx.toFixed(3)} == 0`,
        { "helper x": Number(hx.toFixed(5)), "helper n": hn },
        7, 6, 11, 11
      );

      if (hx === 0) {
        stackFrames.pop();
        return 0;
      }

      addStep(
        'helper-check-n', hx, hn, stackFrames,
        `EXPONENT DECAY CHECK: Assessing local warp factor n. Current exponent: ${hn}. Reactor status: ${hn === 0 ? 'Warp factor decayed to 0. Yielding baseline 1.0.' : 'Warp factor is active. Proceeding to divide-and-conquer squaring.'}`,
        `IF n == 0  →  ${hn} == 0`,
        { "helper x": Number(hx.toFixed(5)), "helper n": hn },
        8, 8, 12, 11
      );

      if (hn === 0) {
        addStep(
          'helper-return-base', hx, hn, stackFrames,
          `ZERO-POINT STABILIZATION: Base case helper(${hx.toFixed(2)}, 0) reached. Emitting baseline zero-point energy block (1.0).`,
          "RETURN 1.0",
          { "helper x": Number(hx.toFixed(5)), "helper n": hn, returnValue: 1 },
          8, 9, 12, 17
        );
        stackFrames.pop();
        return 1;
      }

      const nextX = hx * hx;
      const nextN = Math.floor(hn / 2);
      const isEven = hn % 2 === 0;

      addStep(
        'helper-recurse', hx, hn, stackFrames,
        isEven
          ? `BALANCED EXCITATION (EVEN): Local warp factor n = ${hn} is symmetric! Base squared: ${hx.toFixed(5)} -> ${nextX.toFixed(5)}. Exponent halved: ${hn} -> ${nextN}.`
          : `ASYMMETRIC EXCITATION (ODD): Local warp factor n = ${hn} is asymmetric! Base squared: ${hx.toFixed(5)} -> ${nextX.toFixed(5)}. Exponent halved: ${hn} -> ${nextN}.`,
        `helper(x*x, n//2)  →  helper(${nextX.toFixed(3)}, ${nextN})`,
        { "helper x": Number(hx.toFixed(5)), "helper n": hn, "next x": Number(nextX.toFixed(5)), "next n": nextN },
        9, 10, 13, 15
      );

      const childRes = runHelper(nextX, nextN);

      stackFrames[frameIndex] = { ...stackFrames[frameIndex], res: childRes };

      addStep(
        'helper-return-eval', hx, hn, stackFrames,
        `CHAMBER ECHO: Deeper sub-reactor has returned energy block: ${childRes.toFixed(5)}. Re-engaging local chamber parameters.`,
        `res = helper(${nextX.toFixed(3)}, ${nextN})  →  ${childRes.toFixed(4)}`,
        { "helper x": Number(hx.toFixed(5)), "helper n": hn, "res": Number(childRes.toFixed(5)) },
        9, 10, 13, 13
      );

      const result = hn % 2 !== 0 ? hx * childRes : childRes;

      addStep(
        'helper-return-value', hx, hn, stackFrames,
        isEven
          ? `SYMMETRIC DISCHARGE: Exponent n = ${hn} was even. Sub-reactor energy (${childRes.toFixed(5)}) is stable. Chamber helper(${hx.toFixed(5)}, ${hn}) discharging ${result.toFixed(5)}.`
          : `ASYMMETRIC FUSION: Exponent n = ${hn} was odd. Multiplying accumulated charge x (${hx.toFixed(5)}) with sub-reactor energy (${childRes.toFixed(5)}). Resulting discharge: ${result.toFixed(5)}.`,
        `RETURN ${isEven ? 'res' : 'x * res'}  →  ${result.toFixed(4)}`,
        { "helper x": Number(hx.toFixed(5)), "helper n": hn, "res": Number(childRes.toFixed(5)), "returning": Number(result.toFixed(5)) },
        10, 11, 14, 13
      );

      stackFrames.pop();
      return result;
    }

    const finalRes = runHelper(x, absN);

    // back in myPow
    addStep(
      'myPow-helper-result', x, absN, [],
      `SUB-REACTOR SHUTDOWN: Recursive core has successfully converged and returned final absolute energy res = ${finalRes.toFixed(5)}.`,
      `res = helper(x, absN)  →  ${finalRes.toFixed(4)}`,
      { x, n, res: Number(finalRes.toFixed(5)) },
      2, 2, 8, 17
    );

    const finalAdjusted = n >= 0 ? finalRes : 1 / finalRes;

    addStep(
      'myPow-final-return', x, absN, [],
      n >= 0
        ? `MISSION SUCCESSFUL: Exponent n = ${n} was non-negative. Outputting raw absolute energy: ${finalAdjusted.toFixed(5)}.`
        : `GRAVITY INVERSION: Exponent n = ${n} is negative. Inverting absolute energy (1 / ${finalRes.toFixed(5)}). Outputting reciprocal energy: ${finalAdjusted.toFixed(5)}.`,
      `RETURN ${n >= 0 ? 'res' : '1 / res'}  →  ${finalAdjusted.toFixed(4)}`,
      { x, n, res: Number(finalRes.toFixed(5)), "final result": Number(finalAdjusted.toFixed(5)) },
      3, 3, 8, 17
    );

    return { steps: s, stepLineNumbers: lines };
  }, [selectedCase]);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const handleTestCaseChange = (index: number) => {
    setTestCaseIndex(index);
    setCurrentStep(0);
  };

  return (
    <VisualizationLayout
      key={`powx-n-${testCaseIndex}`}
      controls={
        <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between border-b pb-4">
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
          <div className="flex flex-col gap-1.5 min-w-[280px]">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Test Case Engine Configuration</div>
            <div className="flex bg-muted/60 p-1 rounded-xl border border-border/50 gap-1 select-none">
              {TEST_CASES.map((tc, idx) => {
                const active = testCaseIndex === idx;
                return (
                  <button
                    key={tc.id}
                    onClick={() => handleTestCaseChange(idx)}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      active
                        ? 'bg-background text-primary shadow-sm border border-border/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                  >
                    <Zap className={`h-3 w-3 ${active ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                    <span>{tc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      }
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/40 backdrop-blur-sm border border-border/40 relative overflow-hidden">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-widest text-center flex items-center justify-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Core Reactor Chamber Status
            </h3>

            <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {step.stack.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-5 border border-dashed border-primary/20 rounded-2xl bg-primary/5 flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-sm font-bold text-foreground">myPow Main Core Active</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {step.phase === 'myPow-entry' ? 'Initializing multiplication sequence...' : 'Formulating reciprocal adjustment...'}
                    </span>
                  </motion.div>
                ) : (
                  [...step.stack].reverse().map((frame, index) => {
                    const depth = step.stack.length - index;
                    const isActive = index === 0;
                    const isEven = frame.n % 2 === 0;

                    return (
                      <motion.div
                        key={`frame-${depth}-${frame.x}-${frame.n}`}
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1, 
                          y: 0,
                          borderColor: isActive ? 'hsl(var(--primary))' : 'rgba(var(--border), 0.4)',
                        }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className={`p-4 rounded-xl border flex flex-col gap-2 relative bg-card/60 transition-all ${
                          isActive 
                            ? 'shadow-[0_0_15px_rgba(var(--primary),0.1)] border-primary/50 bg-primary/5' 
                            : 'border-border/30 opacity-70'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute top-2 right-3 flex items-center gap-1.5">
                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Active</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-muted-foreground uppercase">
                            Chamber Level {depth}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            isEven ? 'bg-sky-500/10 text-sky-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {isEven ? 'Even Exponent' : 'Odd Exponent'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Base x</span>
                            <span className="text-sm font-mono font-bold text-foreground">{frame.x.toFixed(4)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Exponent n</span>
                            <span className="text-sm font-mono font-bold text-foreground">{frame.n}</span>
                          </div>
                          <div className="flex flex-col col-span-2 sm:col-span-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Return State</span>
                            <span className="text-sm font-mono font-bold text-primary">
                              {frame.res !== undefined ? frame.res.toFixed(4) : 'Pending...'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {step.stack.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-1">Squaring Core x</div>
                  <div className="text-lg font-black text-primary font-mono flex items-center justify-center gap-1.5">
                    {step.helperX.toFixed(2)}
                    <span className="text-xs text-muted-foreground font-normal">→</span>
                    {(step.helperX * step.helperX).toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-1">Halving Exponent n</div>
                  <div className="text-lg font-black text-foreground font-mono flex items-center justify-center gap-1.5">
                    {step.helperN}
                    <span className="text-xs text-muted-foreground font-normal">→</span>
                    {Math.floor(step.helperN / 2)}
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-5 border border-primary/20 bg-primary/5 relative overflow-hidden shadow-inner">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" /> Core Reactor Telemetry Log
            </h4>
            <p className="text-sm font-medium leading-relaxed font-sans text-foreground">
              {step.explanation}
            </p>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStep}
            onLanguageChange={() => setCurrentStep(0)}
          />
          <VariablePanel variables={step.variables} />
        </div>
      }
    />
  );
};
export default PowxNVisualization;
