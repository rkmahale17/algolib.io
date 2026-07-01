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
  tokens: string[];
  currentIndex: number;
  stack: number[];
  prevStack: number[];
  operand1?: number;
  operand2?: number;
  operator?: string;
  result?: number;
  explanation: string;
  variables: Record<string, any>;
  phase: 'init' | 'scan' | 'push_operand' | 'pop_a' | 'pop_b' | 'apply_operator' | 'done';
  pseudoStep: string;
}

interface TestCase {
  id: string;
  name: string;
  tokens: string[];
  expected: number;
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Example 1', tokens: ["2", "1", "+", "3", "*"], expected: 9 },
  { id: 'ex2', name: 'Example 2', tokens: ["4", "13", "5", "/", "+"], expected: 6 },
  { id: 'ex3', name: 'Example 3', tokens: ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"], expected: 22 }
];

const languages: VisualizationLanguageMap = {
  typescript: `function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  for (const token of tokens) {
    if (token === "+") {
      stack.push(stack.pop()! + stack.pop()!);
    } else if (token === "-") {
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push(b - a);
    } else if (token === "*") {
      stack.push(stack.pop()! * stack.pop()!);
    } else if (token === "/") {
      const a = stack.pop()!;
      const b = stack.pop()!;
      stack.push(Math.trunc(b / a));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}`,
  python: `def evalRPN(tokens: list[str]) -> int:
    stack = []
    for token in tokens:
        if token == "+":
            stack.append(stack.pop() + stack.pop())
        elif token == "-":
            a = stack.pop()
            b = stack.pop()
            stack.append(b - a)
        elif token == "*":
            stack.append(stack.pop() * stack.pop())
        elif token == "/":
            a = stack.pop()
            b = stack.pop()
            stack.append(int(b / a))
        else:
            stack.append(int(token))
    return stack[0]`,
  java: `public static class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String token : tokens) {
            switch (token) {
                case "+":
                    stack.push(stack.pop() + stack.pop());
                    break;
                case "-":
                    int a_minus = stack.pop();
                    int b_minus = stack.pop();
                    stack.push(b_minus - a_minus);
                    break;
                case "*":
                    stack.push(stack.pop() * stack.pop());
                    break;
                case "/":
                    int a_div = stack.pop();
                    int b_div = stack.pop();
                    stack.push(b_div / a_div);
                    break;
                default:
                    stack.push(Integer.parseInt(token));
                    break;
            }
        }
        return stack.pop();
    }
}`,
  cpp: `class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        vector<int> stack;
        for (const string& token : tokens) {
            if (token == "+") {
                int operand2 = stack.back();
                stack.pop_back();
                int operand1 = stack.back();
                stack.pop_back();
                stack.push_back(operand1 + operand2);
            } else if (token == "-") {
                int operand2 = stack.back();
                stack.pop_back();
                int operand1 = stack.back();
                stack.pop_back();
                stack.push_back(operand1 - operand2);
            } else if (token == "*") {
                int operand2 = stack.back();
                stack.pop_back();
                int operand1 = stack.back();
                stack.pop_back();
                stack.push_back(operand1 * operand2);
            } else if (token == "/") {
                int operand2 = stack.back();
                stack.pop_back();
                int operand1 = stack.back();
                stack.pop_back();
                stack.push_back(operand1 / operand2);
            } else {
                stack.push_back(stoi(token));
            }
        }
        return stack.back();
    }
};`
};

export const EvaluateRPNVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = useMemo(() => TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0], [selectedTestCaseId]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const tokens = selectedTestCase.tokens;
    const newSteps: Step[] = [];
    const stack: number[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const getVariables = (currentIndex: number, extra: Record<string, any> = {}) => {
      return {
        'stack': `[${stack.join(', ')}]`,
        'token': currentIndex >= 0 && currentIndex < tokens.length ? `"${tokens[currentIndex]}"` : 'N/A',
        ...extra
      };
    };

    const pushStep = (
      explanation: string,
      pseudo: string,
      phase: Step['phase'],
      currentIndex: number,
      prevStack: number[],
      variablesExtra: Record<string, any> = {},
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        tokens: [...tokens],
        currentIndex,
        stack: [...stack],
        prevStack,
        explanation,
        pseudoStep: pseudo,
        phase,
        variables: getVariables(currentIndex, variablesExtra),
        ...variablesExtra
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      `Start RPN evaluation. Input tokens: [${tokens.map(t => `"${t}"`).join(', ')}].`,
      "evalRPN(tokens)",
      'init', -1, [], {},
      1, 1, 2, 3
    );

    pushStep(
      `Initialize empty stack to store operands.`,
      "SET stack = []",
      'init', -1, [], {},
      2, 2, 3, 4
    );

    pushStep(
      `Begin iterating through each token in the list.`,
      "FOR token IN tokens",
      'scan', -1, [], {},
      3, 3, 4, 5
    );

    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx];

      pushStep(
        `Scan token: "${token}" at index ${idx}.`,
        `// token = "${token}"`,
        'scan', idx, [...stack], {},
        3, 3, 4, 5
      );

      if (token === "+") {
        pushStep(
          `Token is "+". Pop two operands, add them, and push the sum back.`,
          'IF token == "+"',
          'scan', idx, [...stack], {},
          4, 4, 6, 6
        );

        const prev = [...stack];
        const val1 = stack.pop()!;
        const val2 = stack.pop()!;
        const res = val2 + val1;
        stack.push(res);

        pushStep(
          `Pop ${val1} and ${val2}. Add them: ${val2} + ${val1} = ${res}. Push result onto the stack.`,
          `stack.append(stack.pop() + stack.pop())  →  ${res}`,
          'apply_operator', idx, prev, {
            operand1: val1,
            operand2: val2,
            operator: '+',
            result: res
          },
          5, 5, 7, 11
        );

      } else if (token === "-") {
        pushStep(
          `Token is "-". Order matters for subtraction: b - a.`,
          'ELIF token == "-"',
          'scan', idx, [...stack], {},
          6, 6, 9, 12
        );

        const prev = [...stack];
        const a = stack.pop()!;
        pushStep(
          `Pop the first operand from the top (subtrahend): a = ${a}.`,
          "SET a = stack.pop()",
          'pop_a', idx, prev, {
            operand1: a
          },
          7, 7, 10, 14
        );

        const b = stack.pop()!;
        pushStep(
          `Pop the next operand (minuend): b = ${b}.`,
          "SET b = stack.pop()",
          'pop_b', idx, [...prev], {
            operand1: a,
            operand2: b
          },
          8, 8, 11, 16
        );

        const res = b - a;
        stack.push(res);
        pushStep(
          `Perform subtraction: b - a = ${b} - ${a} = ${res}. Push result onto the stack.`,
          `stack.append(b - a)  →  ${res}`,
          'apply_operator', idx, [...prev], {
            operand1: a,
            operand2: b,
            operator: '-',
            result: res
          },
          9, 9, 12, 17
        );

      } else if (token === "*") {
        pushStep(
          `Token is "*". Pop two operands, multiply them, and push the product.`,
          'ELIF token == "*"',
          'scan', idx, [...stack], {},
          10, 10, 14, 18
        );

        const prev = [...stack];
        const val1 = stack.pop()!;
        const val2 = stack.pop()!;
        const res = val2 * val1;
        stack.push(res);

        pushStep(
          `Pop ${val1} and ${val2}. Multiply: ${val2} * ${val1} = ${res}. Push result onto the stack.`,
          `stack.append(stack.pop() * stack.pop())  →  ${res}`,
          'apply_operator', idx, prev, {
            operand1: val1,
            operand2: val2,
            operator: '*',
            result: res
          },
          11, 11, 15, 23
        );

      } else if (token === "/") {
        pushStep(
          `Token is "/". Order matters: b / a (truncated toward zero).`,
          'ELIF token == "/"',
          'scan', idx, [...stack], {},
          12, 12, 17, 24
        );

        const prev = [...stack];
        const a = stack.pop()!;
        pushStep(
          `Pop the first operand from the top (divisor): a = ${a}.`,
          "SET a = stack.pop()",
          'pop_a', idx, prev, {
            operand1: a
          },
          13, 13, 18, 26
        );

        const b = stack.pop()!;
        pushStep(
          `Pop the next operand (dividend): b = ${b}.`,
          "SET b = stack.pop()",
          'pop_b', idx, [...prev], {
            operand1: a,
            operand2: b
          },
          14, 14, 19, 28
        );

        const res = Math.trunc(b / a);
        stack.push(res);
        pushStep(
          `Divide b by a and truncate: ${b} / ${a} = ${res}. Push result onto the stack.`,
          `stack.append(int(b / a))  →  ${res}`,
          'apply_operator', idx, [...prev], {
            operand1: a,
            operand2: b,
            operator: '/',
            result: res
          },
          15, 15, 20, 29
        );

      } else {
        pushStep(
          `Token "${token}" is not an operator, so it must be a number.`,
          "ELSE",
          'scan', idx, [...stack], {},
          16, 16, 22, 30
        );

        const val = Number(token);
        const prev = [...stack];
        stack.push(val);

        pushStep(
          `Convert string "${token}" to number ${val} and push it onto the stack.`,
          `stack.append(${val})`,
          'push_operand', idx, prev, {
            result: val
          },
          17, 17, 23, 31
        );
      }
    }

    pushStep(
      `Finished scanning all tokens.`,
      "// loop finished",
      'scan', tokens.length, [...stack], {},
      3, 3, 4, 5
    );

    pushStep(
      `The stack has exactly one remaining element: ${stack[0]}. Return this as the final evaluated result.`,
      `RETURN stack[0]  →  ${stack[0]}`,
      'done', -1, [...stack], { return: stack[0] },
      20, 18, 27, 34
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

  const { currentIndex, stack, operand1, operand2, operator, result } = currentStep;

  return (
    <div className="space-y-6">
      {/* Test Case Toggle */}
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
            {/* Token Scanner Tape */}
            <Card className="p-4 bg-card border border-border shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Tokens Scanner Ribbon
              </span>
              <div className="flex gap-2 flex-wrap items-center">
                {selectedTestCase.tokens.map((token, idx) => {
                  const isActive = currentIndex === idx;
                  const processed = currentIndex !== -1 && idx < currentIndex;
                  const isOp = ['+', '-', '*', '/'].includes(token);

                  return (
                    <motion.div
                      key={idx}
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
                      className={`w-9 h-9 rounded-md border flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 font-extrabold ring-2 ring-amber-500/20'
                          : processed
                          ? 'bg-muted/50 border-border text-foreground/45 opacity-60'
                          : isOp
                          ? 'bg-primary/5 border-primary/30 text-primary'
                          : 'bg-card border-border text-foreground'
                      }`}
                    >
                      <span>{token}</span>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* Physical Stack Bucket and Active Operation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stack Visual */}
              <Card className="p-4 bg-card border border-border shadow-sm flex flex-col items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-4">
                  Operands Stack
                </span>
                <div className="w-full max-w-[160px] h-56 border-2 border-t-0 border-primary/30 rounded-b-2xl p-2 bg-muted/10 relative flex flex-col justify-end gap-2">
                  <div className="absolute top-0 inset-x-0 border-t border-dashed border-primary/20" />
                  <AnimatePresence mode="popLayout">
                    {stack.length > 0 ? (
                      stack.map((item, idx) => (
                        <motion.div
                          key={`${idx}-${item}`}
                          layout
                          initial={{ opacity: 0, y: -40, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, y: -40 }}
                          transition={{ duration: 0.2 }}
                          className={`w-full h-10 flex items-center justify-center rounded-lg font-mono font-bold text-sm border shadow-sm ${
                            idx === stack.length - 1
                              ? 'bg-primary text-primary-foreground border-primary shadow-primary/20'
                              : 'bg-card text-foreground border-border'
                          }`}
                        >
                          {item}
                        </motion.div>
                      ))
                    ) : (
                      <div className="w-full text-center text-xs text-muted-foreground italic py-20">
                        Empty Stack
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>

              {/* Active Operation Details */}
              <Card className="p-4 bg-card border border-border shadow-sm flex flex-col justify-center min-h-[200px]">
                {operator ? (
                  <div className="space-y-3 font-mono text-xs">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block text-center">
                      Active Operation
                    </span>
                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">First popped (a):</span>
                        <span className="font-extrabold text-amber-600 dark:text-amber-400">{operand1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Second popped (b):</span>
                        <span className="font-extrabold text-primary">{operand2}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-border/50 pt-2 font-sans font-bold">
                        <span className="text-muted-foreground text-[10px] uppercase">Calculation:</span>
                        <span className="text-foreground text-sm">
                          {operator === '/' 
                            ? `Math.trunc(${operand2} / ${operand1})`
                            : `${operand2} ${operator} ${operand1}`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-border/50 pt-2">
                        <span className="text-primary font-bold text-[10px] uppercase">Pushed Result:</span>
                        <span className="text-base font-extrabold text-primary">{result}</span>
                      </div>
                    </div>
                  </div>
                ) : result !== undefined && currentIndex !== -1 ? (
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Pushed Operand
                    </span>
                    <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-mono font-extrabold text-lg shadow-md">
                      {result}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pushed number {result} directly onto the stack.
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
export default EvaluateRPNVisualization;
