import { useEffect, useRef, useState, useCallback } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  x: number;
  initialX: number;
  res: number;
  prevRes: number;
  digit: number | null;
  explanation: string;
  lineNumber: number;
  variables: Record<string, any>;
  phase: 'init' | 'loop' | 'pop_digit' | 'trunc_x' | 'check_max' | 'check_min' | 'accumulate' | 'overflow' | 'done';
}

interface TestCase {
  id: string;
  name: string;
  x: number;
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Example 1', x: 123 },
  { id: 'ex2', name: 'Example 2', x: -123 },
  { id: 'ex3', name: 'Example 3', x: 120 },
  { id: 'ex4', name: 'Positive Overflow', x: 1534236469 },
  { id: 'ex5', name: 'Negative Overflow', x: -1563847412 }
];

export const ReverseIntegerVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0];

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function reverse(x: number): number {
    const MIN = -(2 ** 31);
    const MAX = 2 ** 31 - 1;

    let res = 0;

    while (x !== 0) {
        const digit = x % 10;
        x = Math.trunc(x / 10);

        if (
            res > Math.trunc(MAX / 10) ||
            (res === Math.trunc(MAX / 10) && digit > MAX % 10)
        ) {
            return 0;
        }

        if (
            res < Math.trunc(MIN / 10) ||
            (res === Math.trunc(MIN / 10) && digit < MIN % 10)
        ) {
            return 0;
        }

        res = res * 10 + digit;
    }

    return res;
}`;

  const generateSteps = useCallback(() => {
    const initialX = selectedTestCase.x;
    const newSteps: Step[] = [];
    let x = initialX;
    let res = 0;

    const MIN = -2147483648;
    const MAX = 2147483647;

    const getVariables = (currentX: number, digit: number | null, extra: Record<string, any> = {}) => {
      return {
        'x': currentX,
        'res': res,
        'digit': digit !== null ? digit : 'N/A',
        ...extra
      };
    };

    const pushStep = (
      lineNumber: number,
      explanation: string,
      phase: Step['phase'],
      currentX: number,
      digit: number | null,
      prevRes: number,
      variablesExtra: Record<string, any> = {}
    ) => {
      newSteps.push({
        x: currentX,
        initialX,
        res,
        prevRes,
        digit,
        explanation,
        lineNumber,
        phase,
        variables: getVariables(currentX, digit, variablesExtra),
      });
    };

    // Step 1: Start
    pushStep(1, `Start reverse function. x = ${initialX}.`, 'init', x, null, 0);

    // Step 2: MIN
    pushStep(2, `Define MIN = -2147483648 (signed 32-bit minimum).`, 'init', x, null, 0);

    // Step 3: MAX
    pushStep(3, `Define MAX = 2147483647 (signed 32-bit maximum).`, 'init', x, null, 0);

    // Step 5: Initialize res
    pushStep(5, `Initialize the accumulated result: res = 0.`, 'init', x, null, 0);

    // Step 7: Loop start
    pushStep(7, `Check loop condition: Is x (${x}) not equal to 0? ${x !== 0 ? 'Yes.' : 'No.'}`, 'loop', x, null, 0);

    while (x !== 0) {
      const prevRes = res;
      // Line 8: const digit = x % 10
      const digit = x % 10;
      pushStep(8, `Pop the last digit of x: digit = x % 10 = ${x} % 10 = ${digit}.`, 'pop_digit', x, digit, prevRes);

      // Line 9: x = Math.trunc(x / 10)
      const prevX = x;
      x = Math.trunc(x / 10);
      pushStep(9, `Remove the last digit from x: x = Math.trunc(${prevX} / 10) = ${x}.`, 'trunc_x', x, digit, prevRes);

      // Line 11: Check positive overflow
      const maxThreshold = Math.trunc(MAX / 10); // 214748364
      const maxDigitLimit = MAX % 10; // 7
      const maxOverflow = res > maxThreshold || (res === maxThreshold && digit > maxDigitLimit);

      pushStep(11, `Check positive overflow: Is res (${res}) > ${maxThreshold}? Or is res === ${maxThreshold} AND digit (${digit}) > ${maxDigitLimit}? Result: ${maxOverflow ? 'YES (overflow)' : 'No (safe)'}`, 'check_max', x, digit, prevRes);

      if (maxOverflow) {
        pushStep(15, `Positive overflow detected! Return 0.`, 'overflow', x, digit, prevRes, { return: 0 });
        setSteps(newSteps);
        setCurrentStepIndex(0);
        return;
      }

      // Line 18: Check negative overflow
      const minThreshold = Math.trunc(MIN / 10); // -214748364
      const minDigitLimit = MIN % 10; // -8
      const minOverflow = res < minThreshold || (res === minThreshold && digit < minDigitLimit);

      pushStep(18, `Check negative overflow: Is res (${res}) < ${minThreshold}? Or is res === ${minThreshold} AND digit (${digit}) < ${minDigitLimit}? Result: ${minOverflow ? 'YES (overflow)' : 'No (safe)'}`, 'check_min', x, digit, prevRes);

      if (minOverflow) {
        pushStep(22, `Negative overflow detected! Return 0.`, 'overflow', x, digit, prevRes, { return: 0 });
        setSteps(newSteps);
        setCurrentStepIndex(0);
        return;
      }

      // Line 25: res = res * 10 + digit
      res = res * 10 + digit;
      pushStep(25, `Accumulate digit: res = res * 10 + digit = ${prevRes} * 10 + ${digit} = ${res}.`, 'accumulate', x, digit, prevRes);

      // Line 7: Loop check again
      pushStep(7, `Check loop condition: Is x (${x}) not equal to 0? ${x !== 0 ? 'Yes.' : 'No.'}`, 'loop', x, null, res);
    }

    // Loop finished / line 28
    pushStep(28, `Finished loop because x is now 0. Return the reversed result res = ${res}.`, 'done', x, null, res, { return: res });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  }, [selectedTestCase]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  useEffect(() => {
    if (currentStepIndex === steps.length - 1 && steps.length > 0 && steps[currentStepIndex].lineNumber === 28) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  }, [currentStepIndex, steps]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const { x, res, digit, phase } = currentStep;

  // Remaining x digits representation
  const xString = Math.abs(x).toString();
  const xDigits = x === 0 ? [] : xString.split('');
  const hasMinus = x < 0;

  // Accumulated res digits representation
  const resString = Math.abs(res).toString();
  const resDigits = res === 0 ? ['0'] : resString.split('');
  const resHasMinus = res < 0;

  const maxThreshold = 214748364;
  const minThreshold = -214748364;
  const isCheckingMax = phase === 'check_max';
  const isCheckingMin = phase === 'check_min';

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          {/* Test Case Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
              Test Cases
            </h3>
            <div className="flex flex-wrap gap-2 bg-background p-1 rounded-lg border border-border shadow-sm">
              {TEST_CASES.map(tc => (
                <button
                  key={tc.id}
                  onClick={() => {
                    setSelectedTestCaseId(tc.id);
                    setIsPlaying(false);
                    setCurrentStepIndex(0);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                    selectedTestCaseId === tc.id 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {tc.name} ({tc.x})
                </button>
              ))}
            </div>
          </div>

          {/* Digits Extractor & Result builder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input x Digits */}
            <Card className="p-4 bg-card border border-border shadow-sm flex flex-col justify-center min-h-[120px] relative overflow-hidden">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-4">
                Remaining Number (x)
              </span>
              {x === 0 ? (
                <div className="text-center font-mono text-xl font-extrabold text-muted-foreground/45">
                  0
                </div>
              ) : (
                <div className="flex gap-2 justify-center items-center">
                  {hasMinus && (
                    <div className="w-9 h-9 rounded-md border border-border bg-muted flex items-center justify-center font-mono font-extrabold text-sm text-foreground">
                      -
                    </div>
                  )}
                  {xDigits.map((d, i) => {
                    const isPopped = i === xDigits.length - 1 && phase === 'pop_digit';

                    return (
                      <motion.div
                        key={i}
                        animate={isPopped ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5, repeat: isPopped ? Infinity : 0, repeatDelay: 1 }}
                        className={`w-9 h-9 rounded-md border flex items-center justify-center font-mono font-extrabold text-sm transition-all duration-300 ${
                          isPopped
                            ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 font-extrabold ring-2 ring-amber-500/20'
                            : 'bg-card border-border text-foreground'
                        }`}
                      >
                        {d}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Accumulated res Digits */}
            <Card className="p-4 bg-card border border-border shadow-sm flex flex-col justify-center min-h-[120px] relative overflow-hidden">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-4">
                Reversed Result (res)
              </span>
              <div className="flex gap-2 justify-center items-center">
                {resHasMinus && (
                  <div className="w-9 h-9 rounded-md border border-primary/20 bg-muted flex items-center justify-center font-mono font-extrabold text-sm text-primary">
                    -
                  </div>
                )}
                {resDigits.map((d, i) => {
                  const isAccumulated = i === resDigits.length - 1 && phase === 'accumulate';

                  return (
                    <motion.div
                      key={i}
                      initial={isAccumulated ? { scale: 0.8, opacity: 0 } : {}}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`w-9 h-9 rounded-md border flex items-center justify-center font-mono font-extrabold text-sm transition-all duration-300 ${
                        isAccumulated
                          ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-extrabold ring-2 ring-green-500/20 scale-105'
                          : 'bg-card border-primary/20 text-primary'
                      }`}
                    >
                      {d}
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* 32-Bit Signed Bounds Checker */}
          <Card className="p-4 bg-card border border-border shadow-sm space-y-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              32-Bit Signed Bounds Checker
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {/* Max Bound Check */}
              <div className={`p-3 rounded-lg border transition-all duration-300 ${isCheckingMax ? 'bg-indigo-500/5 border-indigo-500 ring-2 ring-indigo-500/10' : 'bg-muted/20 border-border/50'}`}>
                <div className="font-bold text-[9px] text-muted-foreground uppercase tracking-wider mb-2">Positive Overflow Check</div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Threshold (MAX/10):</span>
                    <span className="font-bold text-foreground">214748364</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current res:</span>
                    <span className={`font-bold ${isCheckingMax ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'}`}>{res}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Digit:</span>
                    <span className="font-bold text-foreground">{digit !== null ? digit : 'N/A'}</span>
                  </div>
                  <div className="border-t border-border/50 mt-2 pt-2 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">res &gt; 214748364 ?</span>
                      <span className={`font-bold ${res > maxThreshold ? 'text-red-500' : 'text-foreground'}`}>
                        {res > maxThreshold ? 'TRUE' : 'FALSE'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">res === 214748364 &amp; digit &gt; 7 ?</span>
                      <span className={`font-bold ${res === maxThreshold && digit !== null && digit > 7 ? 'text-red-500' : 'text-foreground'}`}>
                        {res === maxThreshold && digit !== null && digit > 7 ? 'TRUE' : 'FALSE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Min Bound Check */}
              <div className={`p-3 rounded-lg border transition-all duration-300 ${isCheckingMin ? 'bg-indigo-500/5 border-indigo-500 ring-2 ring-indigo-500/10' : 'bg-muted/20 border-border/50'}`}>
                <div className="font-bold text-[9px] text-muted-foreground uppercase tracking-wider mb-2">Negative Overflow Check</div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Threshold (MIN/10):</span>
                    <span className="font-bold text-foreground">-214748364</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current res:</span>
                    <span className={`font-bold ${isCheckingMin ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'}`}>{res}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Digit:</span>
                    <span className="font-bold text-foreground">{digit !== null ? digit : 'N/A'}</span>
                  </div>
                  <div className="border-t border-border/50 mt-2 pt-2 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">res &lt; -214748364 ?</span>
                      <span className={`font-bold ${res < minThreshold ? 'text-red-500' : 'text-foreground'}`}>
                        {res < minThreshold ? 'TRUE' : 'FALSE'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">res === -214748364 &amp; digit &lt; -8 ?</span>
                      <span className={`font-bold ${res === minThreshold && digit !== null && digit < -8 ? 'text-red-500' : 'text-foreground'}`}>
                        {res === minThreshold && digit !== null && digit < -8 ? 'TRUE' : 'FALSE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Explanation Text */}
          <Card className="p-4 border-l-4 border-primary bg-accent/40 shadow-sm flex items-center min-h-[70px]">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Narrative
                </h4>
                <p className="text-xs font-medium leading-relaxed text-foreground/90">
                  {currentStep.explanation}
                </p>
              </div>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4 h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[currentStep.lineNumber]}
            language="typescript"
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
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
