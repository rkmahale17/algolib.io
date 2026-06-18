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
  temperatures: number[];
  res: number[];
  stack: [number, number][];
  prevStack: [number, number][];
  i: number;
  t: number | null;
  activeStackInd: number | null;
  activeStackTemp: number | null;
  explanation: string;
  lineNumber: number;
  variables: Record<string, any>;
  phase: 'init' | 'loop' | 'while_check' | 'while_pop' | 'while_update' | 'push' | 'done';
}

interface TestCase {
  id: string;
  name: string;
  temperatures: number[];
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Example 1', temperatures: [73, 74, 75, 71, 69, 72, 76, 73] },
  { id: 'ex2', name: 'Example 2', temperatures: [30, 40, 50, 60] },
  { id: 'ex3', name: 'Flat Temps', temperatures: [30, 30, 30] }
];

export const DailyTemperaturesVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0];

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function dailyTemperatures(temperatures: number[]): number[] {
    const res = new Array(temperatures.length).fill(0);
    const stack: [number, number][] = [];

    for (let i = 0; i < temperatures.length; i++) {
        const t = temperatures[i];

        while (stack.length && t > stack[stack.length - 1][0]) {
            const [, stackInd] = stack.pop()!;
            res[stackInd] = i - stackInd;
        }

        stack.push([t, i]);
    }

    return res;
}`;

  const generateSteps = useCallback(() => {
    const temps = selectedTestCase.temperatures;
    const newSteps: Step[] = [];
    const res = new Array(temps.length).fill(0);
    const stack: [number, number][] = [];

    const getVariables = (i: number, t: number | null, extra: Record<string, any> = {}) => {
      const stackStr = stack.length > 0 
        ? `[${stack.map(([temp, idx]) => `[${temp}, ${idx}]`).join(', ')}]`
        : '[]';
      return {
        'res': `[${res.join(', ')}]`,
        'stack': stackStr,
        'i': i >= 0 && i < temps.length ? i : 'N/A',
        't': t !== null ? t : 'N/A',
        ...extra
      };
    };

    const pushStep = (
      lineNumber: number,
      explanation: string,
      phase: Step['phase'],
      i: number,
      t: number | null,
      prevStack: [number, number][],
      variablesExtra: Record<string, any> = {}
    ) => {
      newSteps.push({
        temperatures: [...temps],
        res: [...res],
        stack: stack.map(pair => [...pair] as [number, number]),
        prevStack,
        i,
        t,
        explanation,
        lineNumber,
        phase,
        variables: getVariables(i, t, variablesExtra),
        activeStackInd: variablesExtra.activeStackInd || null,
        activeStackTemp: variablesExtra.activeStackTemp || null
      });
    };

    // Step 1: Start
    pushStep(1, `Start dailyTemperatures function. Input temperatures: [${temps.join(', ')}].`, 'init', -1, null, []);

    // Step 2: Initialize res
    pushStep(2, `Initialize result array res with 0. Each index will hold the number of wait days.`, 'init', -1, null, []);

    // Step 3: Initialize stack
    pushStep(3, `Initialize an empty stack. This stack will store pairs of [temperature, index] in monotonic decreasing order.`, 'init', -1, null, []);

    // Step 5: Loop start
    pushStep(5, `Start iterating through daily temperatures.`, 'loop', -1, null, []);

    for (let i = 0; i < temps.length; i++) {
      const t = temps[i];

      // Line 5: Loop iteration
      pushStep(5, `Loop iteration: Day i = ${i}.`, 'loop', i, null, stack.map(p => [...p]));

      // Line 6: const t = temperatures[i]
      pushStep(6, `Retrieve today's temperature: t = ${t}°F.`, 'loop', i, t, stack.map(p => [...p]));

      // Line 8: while (stack.length && t > stack.top.temp)
      let condition = stack.length > 0 && t > stack[stack.length - 1][0];
      pushStep(8, `Check while loop: Is stack not empty (${stack.length > 0}) AND is t (${t}) > top of stack (${stack.length > 0 ? stack[stack.length - 1][0] : 'N/A'})? ${condition ? 'Yes!' : 'No.'}`, 'while_check', i, t, stack.map(p => [...p]), {
        activeStackInd: stack.length > 0 ? stack[stack.length - 1][1] : null,
        activeStackTemp: stack.length > 0 ? stack[stack.length - 1][0] : null
      });

      while (stack.length && t > stack[stack.length - 1][0]) {
        const prevStackState = stack.map(p => [...p]) as [number, number][];
        // Line 9: pop top
        const popped = stack.pop()!;
        const [poppedTemp, stackInd] = popped;

        pushStep(9, `Pop [${poppedTemp}, ${stackInd}] from the stack. The index is stackInd = ${stackInd}.`, 'while_pop', i, t, prevStackState, {
          activeStackInd: stackInd,
          activeStackTemp: poppedTemp
        });

        // Line 10: res[stackInd] = i - stackInd
        res[stackInd] = i - stackInd;
        pushStep(10, `Calculate wait days: i - stackInd = ${i} - ${stackInd} = ${res[stackInd]} day(s). Update res[${stackInd}] = ${res[stackInd]}.`, 'while_update', i, t, stack.map(p => [...p]), {
          activeStackInd: stackInd,
          activeStackTemp: poppedTemp
        });

        // Line 8: Loop check again
        condition = stack.length > 0 && t > stack[stack.length - 1][0];
        pushStep(8, `Re-check while loop condition: Is stack not empty (${stack.length > 0}) AND is t (${t}) > top of stack (${stack.length > 0 ? stack[stack.length - 1][0] : 'N/A'})? ${condition ? 'Yes!' : 'No.'}`, 'while_check', i, t, stack.map(p => [...p]), {
          activeStackInd: stack.length > 0 ? stack[stack.length - 1][1] : null,
          activeStackTemp: stack.length > 0 ? stack[stack.length - 1][0] : null
        });
      }

      // Line 13: stack.push([t, i])
      const prevStackBeforePush = stack.map(p => [...p]) as [number, number][];
      stack.push([t, i]);
      pushStep(13, `Push current [temperature, index] tuple [${t}, ${i}] onto the stack.`, 'push', i, t, prevStackBeforePush);
    }

    // Line 5: Loop finished
    pushStep(5, `Finished iterating through all days. Any indices remaining in the stack have no future warmer days, so their res value remains 0.`, 'loop', temps.length, null, stack.map(p => [...p]));

    // Line 16: return res
    pushStep(16, `Return the final result array res: [${res.join(', ')}].`, 'done', -1, null, stack.map(p => [...p]), { return: `[${res.join(', ')}]` });

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
    if (currentStepIndex === steps.length - 1 && steps.length > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  }, [currentStepIndex, steps]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const { temperatures, res, stack } = currentStep;

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
                  {tc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Parallel Arrays Card */}
          <Card className="p-4 bg-card border border-border shadow-sm space-y-4 overflow-x-auto">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Temperatures & Wait Times
            </span>
            <div className="flex flex-col gap-3 min-w-max pb-2">
              {/* Row 1: Temperatures */}
              <div className="flex items-center gap-2">
                <div className="w-24 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right pr-2 shrink-0">
                  Daily Temp:
                </div>
                <div className="flex gap-2">
                  {temperatures.map((temp, idx) => {
                    const isActive = currentStep.i === idx;
                    const isPopped = currentStep.activeStackInd === idx;
                    const inStack = stack.some(([, sIdx]) => sIdx === idx);

                    return (
                      <motion.div
                        key={idx}
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
                        className={`w-9 h-9 rounded-md border flex flex-col items-center justify-center font-bold text-xs relative transition-all duration-300 ${
                          isActive
                            ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 font-extrabold ring-2 ring-amber-500/20'
                            : isPopped
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-400 font-extrabold ring-2 ring-indigo-500/20 animate-pulse'
                            : inStack
                            ? 'bg-primary/5 border-primary/45 text-foreground font-semibold'
                            : 'bg-card border-border text-foreground/50 opacity-60'
                        }`}
                      >
                        <span>{temp}</span>
                        <span className="text-[6px] text-muted-foreground/60 absolute bottom-0.5">
                          {idx}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Wait Times (res) */}
              <div className="flex items-center gap-2">
                <div className="w-24 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right pr-2 shrink-0">
                  Wait Days (res):
                </div>
                <div className="flex gap-2">
                  {res.map((val, idx) => {
                    const isUpdated = currentStep.phase === 'while_update' && currentStep.activeStackInd === idx;

                    return (
                      <div
                        key={idx}
                        className={`w-9 h-9 rounded-md border flex flex-col items-center justify-center font-bold text-xs relative transition-all duration-300 ${
                          isUpdated
                            ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-extrabold ring-2 ring-green-500/20 scale-105'
                            : val > 0
                            ? 'bg-card border-primary/20 text-primary font-semibold'
                            : 'bg-muted/30 border-border text-muted-foreground/45'
                        }`}
                      >
                        <span>{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Stack Visual & Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stack Visual */}
            <Card className="p-4 bg-card border border-border shadow-sm flex flex-col items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-4">
                Monotonic Stack
              </span>
              <div className="w-full max-w-[160px] h-56 border-2 border-t-0 border-primary/30 rounded-b-2xl p-2 bg-muted/10 relative flex flex-col justify-end gap-2">
                <div className="absolute top-0 inset-x-0 border-t border-dashed border-primary/20" />
                <AnimatePresence mode="popLayout">
                  {stack.length > 0 ? (
                    stack.map(([temp, idx], sIdx) => {
                      const isTop = sIdx === stack.length - 1;
                      const isActiveTop = isTop && (currentStep.phase === 'while_check' || currentStep.phase === 'while_pop' || currentStep.phase === 'while_update');

                      return (
                        <motion.div
                          key={`${idx}-${temp}`}
                          layout
                          initial={{ opacity: 0, y: -40, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, y: -40 }}
                          transition={{ duration: 0.2 }}
                          className={`w-full h-10 flex items-center justify-between px-3 rounded-lg font-mono font-bold text-xs border shadow-sm ${
                            isActiveTop
                              ? 'bg-indigo-500 text-white border-indigo-500 shadow-indigo-500/20'
                              : isTop
                              ? 'bg-primary text-primary-foreground border-primary shadow-primary/20'
                              : 'bg-card text-foreground border-border'
                          }`}
                        >
                          <span className="text-[10px] text-muted-foreground/30 font-sans">#{idx}</span>
                          <span>{temp}°F</span>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="w-full text-center text-xs text-muted-foreground italic py-20">
                      Empty Stack
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Active Comparison Details */}
            <Card className="p-4 bg-card border border-border shadow-sm flex flex-col justify-center min-h-[200px]">
              {currentStep.activeStackTemp !== null ? (
                <div className="space-y-3 font-mono text-xs">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block text-center">
                    Active Comparison
                  </span>
                  <div className="bg-muted/30 rounded-lg p-3 border border-border/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Today's Temp (t):</span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">{currentStep.t}°F</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Stack Top Temp:</span>
                      <span className="font-extrabold text-indigo-500">{currentStep.activeStackTemp}°F (day {currentStep.activeStackInd})</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-border/50 pt-2 font-sans font-bold">
                      <span className="text-muted-foreground text-[10px] uppercase">Condition:</span>
                      <span className="text-foreground text-xs">
                        t ({currentStep.t}) &gt; top ({currentStep.activeStackTemp})
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-border/50 pt-2">
                      <span className="text-primary font-bold text-[10px] uppercase">Decision:</span>
                      <span className={`text-xs font-bold ${currentStep.t! > currentStep.activeStackTemp! ? 'text-green-500 animate-pulse' : 'text-red-500'}`}>
                        {currentStep.t! > currentStep.activeStackTemp! ? 'TRUE (Pop & Update res)' : 'FALSE (Break loop)'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : currentStep.t !== null ? (
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    No Comparison (Stack Empty)
                  </span>
                  <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-mono font-extrabold text-lg shadow-md">
                    {currentStep.t}°F
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active temperature is {currentStep.t}°F. Stack is empty, so we push today's values directly.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground/60 text-xs italic">
                  No active operation
                </div>
              )}
            </Card>
          </div>

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
