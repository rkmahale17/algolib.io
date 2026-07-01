import { useEffect, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import confetti from 'canvas-confetti';

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
  phase: 'init' | 'loop' | 'while_check' | 'while_pop' | 'while_update' | 'push' | 'done';
  pseudoStep: string;
  variables: Record<string, any>;
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

const languages: VisualizationLanguageMap = {
  typescript: `function dailyTemperatures(temperatures: number[]): number[] {
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
}`,
  python: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    res = [0] * len(temperatures)
    stack = []
    for i, t in enumerate(temperatures):
        while stack and t > stack[-1][0]:
            prev_temp, prev_index = stack.pop()
            res[prev_index] = i - prev_index
        stack.append((t, i))
    return res`,
  java: `public static class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] res = new int[n];
        Deque<int[]> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            int currentTemp = temperatures[i];
            while (!stack.isEmpty() && currentTemp > stack.peek()[0]) {
                int[] prevDay = stack.pop();
                int prevIndex = prevDay[1];
                res[prevIndex] = i - prevIndex;
            }
            stack.push(new int[]{currentTemp, i});
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> res(n, 0);
        stack<pair<int, int>> s;
        for (int i = 0; i < n; ++i) {
            int current_temp = temperatures[i];
            while (!s.empty() && current_temp > s.top().first) {
                pair<int, int> prev_day = s.top();
                s.pop();
                res[prev_day.second] = i - prev_day.second;
            }
            s.push({current_temp, i});
        }
        return res;
    }
};`
};

export const DailyTemperaturesVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = useMemo(() => TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0], [selectedTestCaseId]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const temps = selectedTestCase.temperatures;
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
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
      explanation: string,
      pseudo: string,
      phase: Step['phase'],
      i: number,
      t: number | null,
      prevStack: [number, number][],
      variablesExtra: Record<string, any> = {},
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        temperatures: [...temps],
        res: [...res],
        stack: stack.map(pair => [...pair] as [number, number]),
        prevStack,
        i,
        t,
        explanation,
        pseudoStep: pseudo,
        phase,
        variables: getVariables(i, t, variablesExtra),
        activeStackInd: variablesExtra.activeStackInd || null,
        activeStackTemp: variablesExtra.activeStackTemp || null
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      `Start dailyTemperatures function. Input temperatures: [${temps.join(', ')}].`,
      "dailyTemperatures(temperatures)",
      'init', -1, null, [], {},
      1, 1, 2, 3
    );

    pushStep(
      `Initialize result array res with 0. Each index will hold the number of wait days.`,
      "SET res = [0] * len(temperatures)",
      'init', -1, null, [], {},
      2, 2, 4, 5
    );

    pushStep(
      `Initialize an empty stack. This stack will store pairs of [temperature, index] in monotonic decreasing order.`,
      "SET stack = []",
      'init', -1, null, [], {},
      3, 3, 5, 6
    );

    pushStep(
      `Start iterating through daily temperatures.`,
      "FOR i, t IN enumerate(temperatures)",
      'loop', -1, null, [], {},
      4, 4, 6, 7
    );

    for (let i = 0; i < temps.length; i++) {
      const t = temps[i];

      pushStep(
        `Retrieve today's temperature: t = ${t}°F at index i = ${i}.`,
        `// i = ${i}, t = ${t}`,
        'loop', i, t, stack.map(p => [...p]), {},
        5, 4, 7, 8
      );

      let condition = stack.length > 0 && t > stack[stack.length - 1][0];
      pushStep(
        `Check while loop: Is stack not empty (${stack.length > 0}) AND is t (${t}) > top of stack (${stack.length > 0 ? stack[stack.length - 1][0] : 'N/A'})? ${condition ? 'Yes!' : 'No.'}`,
        `WHILE stack AND t > stack[-1][0]`,
        'while_check', i, t, stack.map(p => [...p]), {
          activeStackInd: stack.length > 0 ? stack[stack.length - 1][1] : null,
          activeStackTemp: stack.length > 0 ? stack[stack.length - 1][0] : null
        },
        6, 5, 8, 9
      );

      while (stack.length && t > stack[stack.length - 1][0]) {
        const prevStackState = stack.map(p => [...p]) as [number, number][];
        const popped = stack.pop()!;
        const [poppedTemp, stackInd] = popped;

        pushStep(
          `Pop [${poppedTemp}, ${stackInd}] from the stack. The index is stackInd = ${stackInd}.`,
          "prev_temp, prev_index = stack.pop()",
          'while_pop', i, t, prevStackState, {
            activeStackInd: stackInd,
            activeStackTemp: poppedTemp
          },
          7, 6, 9, 10
        );

        res[stackInd] = i - stackInd;
        pushStep(
          `Calculate wait days: i - stackInd = ${i} - ${stackInd} = ${res[stackInd]} day(s). Update res[${stackInd}] = ${res[stackInd]}.`,
          `res[prev_index] = i - prev_index  →  ${res[stackInd]}`,
          'while_update', i, t, stack.map(p => [...p]), {
            activeStackInd: stackInd,
            activeStackTemp: poppedTemp
          },
          8, 7, 11, 12
        );

        condition = stack.length > 0 && t > stack[stack.length - 1][0];
        pushStep(
          `Re-check while loop condition: Is stack not empty (${stack.length > 0}) AND is t (${t}) > top of stack (${stack.length > 0 ? stack[stack.length - 1][0] : 'N/A'})? ${condition ? 'Yes!' : 'No.'}`,
          `WHILE stack AND t > stack[-1][0]`,
          'while_check', i, t, stack.map(p => [...p]), {
            activeStackInd: stack.length > 0 ? stack[stack.length - 1][1] : null,
            activeStackTemp: stack.length > 0 ? stack[stack.length - 1][0] : null
          },
          6, 5, 8, 9
        );
      }

      const prevStackBeforePush = stack.map(p => [...p]) as [number, number][];
      stack.push([t, i]);
      pushStep(
        `Push current [temperature, index] tuple [${t}, ${i}] onto the stack.`,
        `stack.append((t, i))`,
        'push', i, t, prevStackBeforePush, {},
        10, 8, 13, 14
      );
    }

    pushStep(
      `Finished iterating through all days. Any indices remaining in the stack have no future warmer days, so their res value remains 0.`,
      `// loop finished`,
      'loop', temps.length, null, stack.map(p => [...p]), {},
      4, 4, 6, 7
    );

    pushStep(
      `Return the final result array res: [${res.join(', ')}].`,
      `RETURN res  →  [${res.join(', ')}]`,
      'done', -1, null, stack.map(p => [...p]), { return: `[${res.join(', ')}]` },
      12, 9, 15, 16
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [selectedTestCase]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

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

  const { temperatures, res, stack } = currentStep;

  return (
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

      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
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
            <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm flex items-center min-h-[70px]">
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
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStepIndex}
              onLanguageChange={() => setCurrentStepIndex(0)}
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
    </div>
  );
};
export default DailyTemperaturesVisualization;
