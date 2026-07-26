import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  ops: string[];
  opIndex: number;
  stack: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function calPoints(ops: string[]): number {
    const stack: number[] = [];
    for (const op of ops) {
        if (op === "+") {
            stack.push(stack[stack.length - 1] + stack[stack.length - 2]);
        } else if (op === "D") {
            stack.push(2 * stack[stack.length - 1]);
        } else if (op === "C") {
            stack.pop();
        } else {
            stack.push(Number(op));
        }
    }
    return stack.reduce((sum, score) => sum + score, 0);
}`,

  python: `def calPoints(operations: list[str]) -> int:
    stack = []
    for op in operations:
        if op == "+":
            stack.append(stack[-1] + stack[-2])
        elif op == "D":
            stack.append(2 * stack[-1])
        elif op == "C":
            stack.pop()
        else:
            stack.append(int(op))
    return sum(stack)`,

  java: `public static class Solution {
    public int calPoints(String[] operations) {
        List<Integer> stack = new ArrayList<>();
        for (String op : operations) {
            if (op.equals("+")) {
                int lastScore = stack.get(stack.size() - 1);
                int secondLastScore = stack.get(stack.size() - 2);
                stack.add(lastScore + secondLastScore);
            } else if (op.equals("D")) {
                int lastScore = stack.get(stack.size() - 1);
                stack.add(2 * lastScore);
            } else if (op.equals("C")) {
                stack.remove(stack.size() - 1);
            } else {
                stack.add(Integer.parseInt(op));
            }
        }
        int totalSum = 0;
        for (int score : stack) {
            totalSum += score;
        }
        return totalSum;
    }
}`,

  cpp: `class Solution {
public:
    int calPoints(vector<string>& operations) {
        vector<int> record;
        for (const string& op : operations) {
            if (op == "+") {
                int prev1 = record.back();
                int prev2 = record[record.size() - 2];
                record.push_back(prev1 + prev2);
            } else if (op == "D") {
                int prev = record.back();
                record.push_back(2 * prev);
            } else if (op == "C") {
                record.pop_back();
            } else {
                record.push_back(stoi(op));
            }
        }
        int totalSum = 0;
        for (int score : record) {
            totalSum += score;
        }
        return totalSum;
    }
};`,
};

function generateVisualizationData() {
  const ops = ["5", "2", "C", "D", "+"];
  const steps: Step[] = [];
  const stack: number[] = [];

  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  // 1. Initial State / Function call
  steps.push({
    ops,
    opIndex: -1,
    stack: [...stack],
    highlights: [],
    variables: { operations: `["${ops.join('", "')}"]`, stack: '[]' },
    explanation: "Given a list of baseball game operation strings, we process each step to calculate a running record of points.",
    pseudoStep: `CALL calPoints(operations)`
  });
  addLines(1, 1, 2, 3);

  // 2. Initialize stack
  steps.push({
    ops,
    opIndex: -1,
    stack: [...stack],
    highlights: [],
    variables: { operations: `["${ops.join('", "')}"]`, stack: '[]' },
    explanation: "Initialize an empty stack (or list) to store the valid scores.",
    pseudoStep: "SET stack = []"
  });
  addLines(2, 2, 3, 4);

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];

    // 3. Loop Header
    steps.push({
      ops,
      opIndex: i,
      stack: [...stack],
      highlights: [],
      variables: { op: `"${op}"`, stack: `[${stack.join(', ')}]` },
      explanation: `Retrieve the next operation: "${op}".`,
      pseudoStep: `FOR op = "${op}"`
    });
    addLines(3, 3, 4, 5);

    if (op === "+") {
      const top = stack[stack.length - 1];
      const second = stack[stack.length - 2];
      const sumVal = top + second;
      stack.push(sumVal);

      // 4. Sum previous two
      steps.push({
        ops,
        opIndex: i,
        stack: [...stack],
        highlights: [stack.length - 1],
        variables: { op: `"${op}"`, "stack[-1]": top, "stack[-2]": second, added: sumVal, stack: `[${stack.join(', ')}]` },
        explanation: `Operation '+' adds the sum of the previous two scores: ${second} + ${top} = ${sumVal} to the record.`,
        pseudoStep: `CALL stack.push(${top} + ${second} = ${sumVal})`
      });
      addLines(5, 5, 8, 9);
    } else if (op === "D") {
      const top = stack[stack.length - 1];
      const doubleVal = 2 * top;
      stack.push(doubleVal);

      // 5. Double top element
      steps.push({
        ops,
        opIndex: i,
        stack: [...stack],
        highlights: [stack.length - 1],
        variables: { op: `"${op}"`, "stack[-1]": top, added: doubleVal, stack: `[${stack.join(', ')}]` },
        explanation: `Operation 'D' doubles the previous score: 2 * ${top} = ${doubleVal} and records it.`,
        pseudoStep: `CALL stack.push(2 × ${top} = ${doubleVal})`
      });
      addLines(7, 7, 11, 12);
    } else if (op === "C") {
      const popped = stack.pop();

      // 6. Pop score
      steps.push({
        ops,
        opIndex: i,
        stack: [...stack],
        highlights: [],
        variables: { op: `"${op}"`, removed: popped, stack: `[${stack.join(', ')}]` },
        explanation: `Operation 'C' invalidates and removes the most recent score (${popped}) from the record.`,
        pseudoStep: `CALL stack.pop()  →  removes ${popped}`
      });
      addLines(9, 9, 13, 14);
    } else {
      const val = Number(op);
      stack.push(val);

      // 7. Parse number and push
      steps.push({
        ops,
        opIndex: i,
        stack: [...stack],
        highlights: [stack.length - 1],
        variables: { op: `"${op}"`, added: val, stack: `[${stack.join(', ')}]` },
        explanation: `Read integer value ${val} and push it onto the record stack.`,
        pseudoStep: `CALL stack.push(${val})`
      });
      addLines(11, 11, 15, 16);
    }
  }

  // 8. Return final sum
  const totalSum = stack.reduce((sum, val) => sum + val, 0);
  steps.push({
    ops,
    opIndex: ops.length - 1,
    stack: [...stack],
    highlights: [],
    variables: { stack: `[${stack.join(', ')}]`, sum: totalSum },
    explanation: `All operations are processed. Calculate and return the sum of all scores currently in the record: ${stack.join(' + ')} = ${totalSum}.`,
    pseudoStep: `RETURN sum(stack)  →  ${totalSum}`
  });
  addLines(14, 12, 22, 23);

  return { steps, stepLineNumbers };
}

export const BaseballGameVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);
  const totalSum = currentStep.stack.reduce((a, b) => a + b, 0);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Baseball Game (Stack Record)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              
              {/* Operations row */}
              <div className="mb-8">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Operations Sequence</h4>
                <div className="flex gap-3 justify-center items-center">
                  {currentStep.ops.map((op, idx) => {
                    const isCurrent = currentStep.opIndex === idx;
                    let opClass = 'border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-foreground opacity-55';
                    if (isCurrent) {
                      opClass = 'border-primary bg-primary/10 text-primary scale-110 shadow-sm font-bold ring-2 ring-primary/30';
                    } else if (idx < currentStep.opIndex) {
                      opClass = 'border-muted bg-muted/30 text-muted-foreground opacity-40';
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 text-xs font-semibold transition-all duration-200 ${opClass}`}>
                          {op}
                        </div>
                        {isCurrent && <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Current</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stack visual representation */}
              <div className="flex flex-col items-center mb-8">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Points Record Stack</h4>
                
                {/* Visual Cup for Stack */}
                <div className="border-b-4 border-x-4 border-dashed border-zinc-300 dark:border-zinc-800 rounded-b-xl w-36 min-h-[220px] flex flex-col-reverse justify-start items-center p-3 gap-2.5 bg-muted/5 shadow-inner">
                  {currentStep.stack.length === 0 ? (
                    <span className="text-xs text-muted-foreground/40 italic text-center my-auto">Stack Empty</span>
                  ) : (
                    currentStep.stack.map((score, idx) => {
                      const isHighlighted = currentStep.highlights.includes(idx);
                      const isTop = idx === currentStep.stack.length - 1;

                      return (
                        <div
                          key={idx}
                          className={`w-28 h-8 flex items-center justify-between px-3 rounded-lg border font-mono text-sm transition-all duration-200 shadow-sm ${
                            isHighlighted 
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/30' 
                              : 'border-border bg-card text-foreground'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-muted-foreground/60">[{idx}]</span>
                          <span className="font-bold">{score}</span>
                          {isTop ? (
                            <span className="text-[8px] font-black bg-zinc-200 dark:bg-zinc-800 text-foreground px-1.5 py-0.5 rounded tracking-widest uppercase">Top</span>
                          ) : (
                            <span className="w-8" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Total points sum */}
              <div className="flex justify-between items-center border-t border-border/40 pt-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Recorded Score Sum</span>
                <span className="text-sm font-black px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-md border border-border/50">
                  {totalSum}
                </span>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            {/* Commentary box styled like the variable panel */}
            <div className="bg-muted/50 rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Commentary</h3>
              <p className="text-[14px] font-medium leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {currentStep.explanation}
              </p>
            </div>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          {/* Variable section below the editor as requested */}
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
