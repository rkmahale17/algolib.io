import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Zap, RefreshCw, Layers, ArrowDown, Info, HelpCircle } from 'lucide-react';

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
  highlightedLines: number[];
  explanation: string;
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

export const PowxNVisualization = () => {
  const [testCaseIndex, setTestCaseIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const selectedCase = TEST_CASES[testCaseIndex];

  // Steps generator for the selected test case
  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const x = selectedCase.x;
    const n = selectedCase.n;
    const absN = Math.abs(n);

    // 1. Entering myPow
    s.push({
      phase: 'myPow-entry',
      x,
      n,
      absN,
      helperX: x,
      helperN: absN,
      stack: [],
      highlightedLines: [1],
      explanation: `MULTIPLIER INITIATED: Fuel Core set to density x = ${x.toFixed(2)}. Target Warp Factor n = ${n}. Pre-checking exponent phase direction.`,
      variables: { x, n }
    });

    // 2. Calling helper
    s.push({
      phase: 'myPow-call-helper',
      x,
      n,
      absN,
      helperX: x,
      helperN: absN,
      stack: [],
      highlightedLines: [2],
      explanation: `ABS EXTRAPOLATION: Converting Target Warp Factor to absolute value |${n}| = ${absN}. Booting recursive sub-reactor core helper(${x.toFixed(2)}, ${absN}).`,
      variables: { x, n, absN }
    });

    const stackFrames: StackFrame[] = [];

    function runHelper(hx: number, hn: number): number {
      const frameIndex = stackFrames.length;
      stackFrames.push({ x: hx, n: hn });

      // helper entry step
      s.push({
        phase: 'helper-entry',
        x,
        n,
        absN,
        helperX: hx,
        helperN: hn,
        stack: [...stackFrames],
        highlightedLines: [6],
        explanation: `REACTOR FRAME CHARGING: Level ${stackFrames.length} recursion chamber online. Processing sub-power computation for local core x = ${hx.toFixed(5)}, n = ${hn}.`,
        variables: { x, n, "helper x": Number(hx.toFixed(5)), "helper n": hn, stackDepth: stackFrames.length }
      });

      // check x === 0
      s.push({
        phase: 'helper-check-x',
        x,
        n,
        absN,
        helperX: hx,
        helperN: hn,
        stack: [...stackFrames],
        highlightedLines: [7],
        explanation: `FUEL CORE CHECK: Assessing core density x. Current value is ${hx.toFixed(5)}. Reactor check: ${hx === 0 ? 'CRITICAL: Fuel density is zero. Instant decay to 0 energy.' : 'Fuel core density verified (non-zero).'}`,
        variables: { "helper x": Number(hx.toFixed(5)), "helper n": hn }
      });

      if (hx === 0) {
        stackFrames.pop();
        return 0;
      }

      // check n === 0
      s.push({
        phase: 'helper-check-n',
        x,
        n,
        absN,
        helperX: hx,
        helperN: hn,
        stack: [...stackFrames],
        highlightedLines: [8],
        explanation: `EXPONENT DECAY CHECK: Assessing local warp factor n. Current exponent: ${hn}. Reactor status: ${hn === 0 ? 'Warp factor decayed to 0. Yielding baseline 1.0.' : 'Warp factor is active. Proceeding to divide-and-conquer squaring.'}`,
        variables: { "helper x": Number(hx.toFixed(5)), "helper n": hn }
      });

      if (hn === 0) {
        s.push({
          phase: 'helper-return-base',
          x,
          n,
          absN,
          helperX: hx,
          helperN: hn,
          stack: [...stackFrames],
          highlightedLines: [8],
          explanation: `ZERO-POINT STABILIZATION: Base case helper(${hx.toFixed(2)}, 0) reached. Emitting baseline zero-point energy block (1.0). Chamber collapsing, discharging energy to parent.`,
          variables: { "helper x": Number(hx.toFixed(5)), "helper n": hn, returnValue: 1 }
        });
        stackFrames.pop();
        return 1;
      }

      const nextX = hx * hx;
      const nextN = Math.floor(hn / 2);
      const isEven = hn % 2 === 0;

      // prepare to recurse
      s.push({
        phase: 'helper-recurse',
        x,
        n,
        absN,
        helperX: hx,
        helperN: hn,
        stack: [...stackFrames],
        highlightedLines: [10],
        explanation: isEven
          ? `BALANCED EXCITATION (EVEN): Local warp factor n = ${hn} is symmetric! Initiating squarer. Base squared: ${hx.toFixed(5)} -> ${nextX.toFixed(5)}. Exponent halved: ${hn} -> ${nextN}. Recursing into deeper core chamber.`
          : `ASYMMETRIC EXCITATION (ODD): Local warp factor n = ${hn} is asymmetric! Accumulating single fuel charge of x = ${hx.toFixed(5)}. Base squared: ${hx.toFixed(5)} -> ${nextX.toFixed(5)}. Exponent halved: ${hn} -> ${nextN}. Recursing into deeper core chamber.`,
        variables: { "helper x": Number(hx.toFixed(5)), "helper n": hn, "next x": Number(nextX.toFixed(5)), "next n": nextN }
      });

      const childRes = runHelper(nextX, nextN);

      // back in current frame
      stackFrames[frameIndex] = { ...stackFrames[frameIndex], res: childRes };

      s.push({
        phase: 'helper-return-eval',
        x,
        n,
        absN,
        helperX: hx,
        helperN: hn,
        stack: [...stackFrames],
        highlightedLines: [10],
        explanation: `CHAMBER ECHO: Deeper sub-reactor has returned energy block: ${childRes.toFixed(5)}. Re-engaging local chamber parameters.`,
        variables: { "helper x": Number(hx.toFixed(5)), "helper n": hn, "res": Number(childRes.toFixed(5)) }
      });

      const result = hn % 2 !== 0 ? hx * childRes : childRes;

      s.push({
        phase: 'helper-return-value',
        x,
        n,
        absN,
        helperX: hx,
        helperN: hn,
        stack: [...stackFrames],
        highlightedLines: [12],
        explanation: isEven
          ? `SYMMETRIC DISCHARGE: Exponent n = ${hn} was even. Sub-reactor energy (${childRes.toFixed(5)}) is stable. Chamber helper(${hx.toFixed(5)}, ${hn}) discharging ${result.toFixed(5)}.`
          : `ASYMMETRIC FUSION: Exponent n = ${hn} was odd. Multiplying accumulated charge x (${hx.toFixed(5)}) with sub-reactor energy (${childRes.toFixed(5)}). Resulting discharge: ${result.toFixed(5)}.`,
        variables: { "helper x": Number(hx.toFixed(5)), "helper n": hn, "res": Number(childRes.toFixed(5)), "returning": Number(result.toFixed(5)) }
      });

      stackFrames.pop();
      return result;
    }

    const finalRes = runHelper(x, absN);

    // back in myPow
    s.push({
      phase: 'myPow-helper-result',
      x,
      n,
      absN,
      finalRes,
      stack: [],
      highlightedLines: [2],
      explanation: `SUB-REACTOR SHUTDOWN: Recursive core has successfully converged and returned final absolute energy res = ${finalRes.toFixed(5)}. Initiating dimension folding check.`,
      variables: { x, n, res: Number(finalRes.toFixed(5)) }
    });

    const finalAdjusted = n >= 0 ? finalRes : 1 / finalRes;

    // final return
    s.push({
      phase: 'myPow-final-return',
      x,
      n,
      absN,
      finalRes,
      finalAdjusted,
      stack: [],
      highlightedLines: [3],
      explanation: n >= 0
        ? `MISSION SUCCESSFUL: Exponent n = ${n} was non-negative. Outputting raw absolute energy: ${finalAdjusted.toFixed(5)}.`
        : `GRAVITY INVERSION: Exponent n = ${n} is negative. Inverting absolute energy (1 / ${finalRes.toFixed(5)}). Outputting reciprocal energy: ${finalAdjusted.toFixed(5)}.`,
      variables: { x, n, res: Number(finalRes.toFixed(5)), "final result": Number(finalAdjusted.toFixed(5)) }
    });

    return s;
  }, [selectedCase]);

  const step = steps[currentStep];

  const code = `function myPow(x: number, n: number): number {
    const res = helper(x, Math.abs(n));
    return n >= 0 ? res : 1 / res;
}

function helper(x: number, n: number): number {
    if (x === 0) return 0;
    if (n === 0) return 1;

    const res = helper(x * x, Math.floor(n / 2));

    return n % 2 !== 0 ? x * res : res;
}`;

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
          {/* Test Case Selection Panel */}
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
          {/* Main Visual: Exponentiation Square and Halve Tracking */}
          <Card className="p-6 bg-card/40 backdrop-blur-sm border border-border/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Zap className="w-24 h-24 text-primary" />
            </div>
            
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-widest text-center flex items-center justify-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Core Reactor Chamber Status
            </h3>

            {/* Recursion Stack Frame List */}
            <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {step.stack.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-5 border border-dashed border-primary/20 rounded-2xl bg-primary/5 flex flex-col items-center justify-center text-center"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-foreground">myPow Main Core Active</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {step.phase === 'myPow-entry' ? 'Initializing multiplication sequence...' : 'Formulating reciprocal adjustment...'}
                    </span>
                  </motion.div>
                ) : (
                  // Display stack of recursion frames, with the top (last element) highlighted
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
                          borderColor: isActive ? 'var(--primary)' : 'rgba(var(--border), 0.4)',
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
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
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

            {/* Square/Halve Pipeline Track */}
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

          {/* Telemetry Log Commentary Panel */}
          <Card className="p-5 border-2 border-primary/20 bg-primary/5 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" /> Core Reactor Telemetry Log
            </h4>
            <p className="text-sm font-medium leading-relaxed font-sans text-foreground">
              {step.explanation}
            </p>
          </Card>

          {/* Variable Registry */}
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
    />
  );
};
