import React, { useEffect, useState, useMemo } from "react";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  n: number;
  stack: string[];
  result: string[];
  openN: number;
  closedN: number;
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function generateParenthesis(n: number): string[] {
  const stack: string[] = [];
  const result: string[] = [];
  function backtrack(openN: number, closedN: number): void {
    if (openN === n && closedN === n) {
      result.push(stack.join(""));
      return;
    }
    if (openN < n) {
      stack.push("(");
      backtrack(openN + 1, closedN);
      stack.pop();
    }
    if (closedN < openN) {
      stack.push(")");
      backtrack(openN, closedN + 1);
      stack.pop();
    }
  }
  backtrack(0, 0);
  return result;
}`,
  python: `def generateParenthesis(n: int) -> list[str]:
    stack = []
    result = []
    def backtrack(open_count: int, close_count: int) -> None:
        if open_count == n and close_count == n:
            result.append("".join(stack))
            return
        if open_count < n:
            stack.append("(")
            backtrack(open_count + 1, close_count)
            stack.pop()
        if close_count < open_count:
            stack.append(")")
            backtrack(open_count, close_count + 1)
            stack.pop()
    backtrack(0, 0)
    return result`,
  java: `public static class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        StringBuilder currentCombination = new StringBuilder();
        backtrack(0, 0, n, currentCombination, result);
        return result;
    }
    private void backtrack(int openN, int closedN, int n, StringBuilder currentCombination, List<String> result) {
        if (openN == n && closedN == n) {
            result.add(currentCombination.toString());
            return;
        }
        if (openN < n) {
            currentCombination.append('(');
            backtrack(openN + 1, closedN, n, currentCombination, result);
            currentCombination.deleteCharAt(currentCombination.length() - 1);
        }
        if (closedN < openN) {
            currentCombination.append(')');
            backtrack(openN, closedN + 1, n, currentCombination, result);
            currentCombination.deleteCharAt(currentCombination.length() - 1);
        }
    }
}`,
  cpp: `class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> result;
        string current_combo;
        backtrack(n, 0, 0, current_combo, result);
        return result;
    }
private:
    void backtrack(
        int n,
        int openCount,
        int closeCount,
        string& current_combo,
        vector<string>& result
    ) {
        if (openCount == n && closeCount == n) {
            result.push_back(current_combo);
            return;
        }
        if (openCount < n) {
            current_combo.push_back('(');
            backtrack(n, openCount + 1, closeCount, current_combo, result);
            current_combo.pop_back();
        }
        if (closeCount < openCount) {
            current_combo.push_back(')');
            backtrack(n, openCount, closeCount + 1, current_combo, result);
            current_combo.pop_back();
        }
    }
};`
};

export const GenerateParenthesesVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const n = 3;

  const { steps, stepLineNumbers } = useMemo(() => {
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const stack: string[] = [];
    const result: string[] = [];

    const addStep = (
      openN: number,
      closedN: number,
      message: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        n,
        stack: [...stack],
        result: [...result],
        openN,
        closedN,
        message,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      0, 0,
      `We want to build well-formed parenthesis strings with ${n} pairs. Let's start with an empty stack and an empty result list!`,
      `generateParenthesis(n=${n})`,
      { n },
      1, 1, 2, 3
    );

    addStep(
      0, 0,
      "Initialize recursion variables and result collections.",
      "SET stack = [], result = []",
      { stack: "[]", result: "[]" },
      2, 2, 3, 4
    );

    const backtrackCall = (openN: number, closedN: number) => {
      addStep(
        openN, closedN,
        `Checking our current state: We have placed ${openN} '(' and ${closedN} ')'.`,
        `CALL backtrack(openN=${openN}, closedN=${closedN})`,
        { openN, closedN },
        4, 4, 8, 10
      );

      addStep(
        openN, closedN,
        `Did we use all ${n} open and ${n} closed parentheses? (${openN} === ${n} and ${closedN} === ${n})`,
        `IF openN == ${n} AND closedN == ${n}  →  ${openN} == ${n} AND ${closedN} == ${n}`,
        { openN, closedN },
        5, 5, 9, 17
      );

      if (openN === n && closedN === n) {
        result.push(stack.join(""));
        addStep(
          openN, closedN,
          `Yes! We successfully built a complete and valid string: "${stack.join("")}". Save it to results.`,
          `result.push("${stack.join("")}")`,
          { result: JSON.stringify(result) },
          6, 6, 10, 18
        );
        
        addStep(
          openN, closedN,
          `Going back (returning) to explore other possibilities.`,
          "RETURN",
          { },
          7, 7, 11, 19
        );
        return;
      }

      addStep(
        openN, closedN,
        `Can we add an open parenthesis '('? We can if we haven't reached our limit of ${n}. (${openN} < ${n})`,
        `IF openN < ${n}  →  ${openN} < ${n}`,
        { openN, closedN },
        9, 8, 13, 21
      );

      if (openN < n) {
        stack.push("(");
        addStep(
          openN, closedN,
          `Yes, we can! Add '(' to our building stack. Stack: [${stack.join(", ")}].`,
          "stack.push('(')",
          { stack: `[${stack.join(",")}]` },
          10, 9, 14, 22
        );

        backtrackCall(openN + 1, closedN);

        stack.pop();
        addStep(
          openN, closedN,
          `Backtracking! We've explored everything with that last '('. Remove it. Stack: [${stack.join(", ")}].`,
          "stack.pop()",
          { stack: `[${stack.join(",")}]` },
          12, 11, 16, 24
        );
      }

      addStep(
        openN, closedN,
        `Can we add a closed parenthesis ')'? Only if it matches an open one we've already placed! (${closedN} < ${openN})`,
        `IF closedN < openN  →  ${closedN} < ${openN}`,
        { openN, closedN },
        14, 12, 18, 26
      );

      if (closedN < openN) {
        stack.push(")");
        addStep(
          openN, closedN,
          `Yes! We have an unmatched '(' waiting. Add ')' to our building stack. Stack: [${stack.join(", ")}].`,
          "stack.push(')')",
          { stack: `[${stack.join(",")}]` },
          15, 13, 19, 27
        );

        backtrackCall(openN, closedN + 1);

        stack.pop();
        addStep(
          openN, closedN,
          `Backtracking! We've explored everything with that last ')'. Remove it. Stack: [${stack.join(", ")}].`,
          "stack.pop()",
          { stack: `[${stack.join(",")}]` },
          17, 15, 21, 29
        );
      }
    };

    addStep(
      0, 0,
      `Let's start the building process from the very beginning.`,
      "CALL backtrack(openN=0, closedN=0)",
      { },
      20, 16, 5, 6
    );
    backtrackCall(0, 0);

    addStep(
      0, 0,
      `Awesome! We have explored all possible paths and generated every valid combination: ${JSON.stringify(result)}.`,
      `RETURN result  →  ${JSON.stringify(result)}`,
      { result: JSON.stringify(result) },
      21, 17, 6, 7
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, []);

  useEffect(() => {
    setCurrentStepIndex(0);
  }, [steps]);

  if (steps.length === 0) return null;
  const currentStep = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Building the String (Stack)</h3>
            <div className="flex gap-2 mb-2 min-h-[4rem] items-center p-4 rounded-xl bg-muted/30 border border-muted">
              {currentStep.stack.length > 0 ? (
                currentStep.stack.map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-14 flex items-center justify-center text-2xl font-bold rounded-lg border-2 shadow-sm transition-all animate-in zoom-in ${
                      char === "(" 
                        ? "bg-blue-500/20 text-blue-600 border-blue-500/50 dark:text-blue-400 dark:border-blue-400/50" 
                        : "bg-green-500/20 text-green-600 border-green-500/50 dark:text-green-400 dark:border-green-400/50"
                    }`}
                  >
                    {char}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic flex items-center h-14 px-2">Start placing blocks...</div>
              )}
            </div>
            <p className="text-xs text-muted-foreground ml-2">Open left: {currentStep.n - currentStep.openN} &nbsp; | &nbsp; Needs closing: {currentStep.openN - currentStep.closedN}</p>
          </div>

          <div className="mb-8 flex-1">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Valid Combinations Found ({currentStep.result.length})
            </h3>
            <div className="flex flex-wrap gap-3 max-h-[12rem] overflow-y-auto w-full p-4 border rounded-xl bg-muted/10 min-h-[8rem] content-start">
              {currentStep.result.length > 0 ? (
                currentStep.result.map((str, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-400 font-mono font-bold rounded-lg border border-green-500/30 text-lg animate-in fade-in shadow-sm"
                  >
                    {str}
                  </div>
                ))
              ) : (
                 <div className="text-muted-foreground italic text-sm">No valid combinations found yet...</div>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <Card className="p-4 bg-primary/5 border border-primary/20 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium">{currentStep.message}</p>
            </Card>

            <div className="rounded-xl overflow-hidden border border-muted bg-card shadow-sm">
              <VariablePanel
                variables={{
                  "n (Pairs)": currentStep.n,
                  "openN (Used '(')": currentStep.openN,
                  "closedN (Used ')')": currentStep.closedN,
                }}
              />
            </div>
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
export default GenerateParenthesesVisualization;
