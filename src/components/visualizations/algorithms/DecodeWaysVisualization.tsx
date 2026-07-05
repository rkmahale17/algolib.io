import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  s: string;
  memo: Map<number, number>;
  i: number | null;
  res: number | null;
  stack: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  calc?: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function numDecodings(s: string): number {
  const dp: Map<number, number> = new Map();
  dp.set(s.length, 1);
  function dfs(i: number): number {
    if (dp.has(i)) return dp.get(i)!;
    if (s[i] === '0') return 0;
    let res = dfs(i + 1);
    if (
      i + 1 < s.length &&
      (s[i] === '1' || (s[i] === '2' && '0123456'.includes(s[i + 1])))
    ) {
      res += dfs(i + 2);
    }
    dp.set(i, res);
    return res;
  }
  return dfs(0);
}`,
  python: `def numDecodings(s: str) -> int:
    dp = {len(s): 1}
    def dfs(i: int) -> int:
        if i in dp:
            return dp[i]
        if s[i] == '0':
            return 0
        res = dfs(i + 1)
        if (
            i + 1 < len(s) and
            (s[i] == '1' or (s[i] == '2' and s[i + 1] in "0123456"))
        ):
            res += dfs(i + 2)
        dp[i] = res
        return res
    return dfs(0)`,
  java: `public static class Solution {
    public int dfs(int i, String s, Map<Integer, Integer> dp) {
        if (dp.containsKey(i)) {
            return dp.get(i);
        }
        if (i == s.length()) {
            return 1;
        }
        if (s.charAt(i) == '0') {
            return 0;
        }
        int res = dfs(i + 1, s, dp);
        if (
            i + 1 < s.length() &&
            (s.charAt(i) == '1' ||
            (s.charAt(i) == '2' && s.charAt(i + 1) <= '6'))
        ) {
            res += dfs(i + 2, s, dp);
        }
        dp.put(i, res);
        return res;
    }
    public int numDecodings(String s) {
        Map<Integer, Integer> dp = new HashMap<>();
        dp.put(s.length(), 1);
        return dfs(0, s, dp);
    }
}`,
  cpp: `class Solution {
 public:
    int dfs(int i, string& s, unordered_map<int, int>& dp) {
        if (dp.count(i)) {
            return dp[i];
        }
        if (i == s.size()) {
            return 1;
        }
        if (s[i] == '0') {
            return 0;
        }
        int res = 0;
        res += dfs(i + 1, s, dp);
        if (
            i + 1 < s.size() &&
            (s[i] == '1' || (s[i] == '2' && s[i + 1] <= '6'))
        ) {
            res += dfs(i + 2, s, dp);
        }
        dp[i] = res;
        return res;
    }
    int numDecodings(string s) {
        unordered_map<int, int> dp;
        return dfs(0, s, dp);
    }
};`
};

export const DecodeWaysVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const s = "11106";

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const memo = new Map<number, number>();
    const stack: number[] = [];
    const n = s.length;
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

    // 1. Initial Function call
    stepsList.push({
      s,
      memo: new Map(memo),
      i: null,
      res: null,
      stack: [...stack],
      variables: { s: `"${s}"` },
      explanation: `Determine number of ways to decode "${s}" using mapping 1=A, ..., 26=Z. We use DFS with memoization.`,
      pseudoStep: "CALL numDecodings(s)"
    });
    addLines(1, 1, 23, 24);

    // 2. Setup map and base case
    memo.set(n, 1);
    stepsList.push({
      s,
      memo: new Map(memo),
      i: null,
      res: null,
      stack: [...stack],
      variables: { "dp[5]": 1 },
      explanation: `Initialize DP memo map. Base Case: Reaching index ${n} (end of string) is 1 valid path: dp.set(${n}, 1).`,
      pseudoStep: `SET dp[${n}] = 1`
    });
    addLines(3, 2, 24, 25);

    const solve = (i: number): number => {
      stack.push(i);

      stepsList.push({
        s,
        memo: new Map(memo),
        i,
        res: null,
        stack: [...stack],
        variables: { i, stack: stack.join(" → ") },
        explanation: `Call dfs(${i}). Inspect character '${s[i]}' at index ${i}. Check if computed in memo map.`,
        pseudoStep: `CALL dfs(${i})`
      });
      addLines(4, 3, 2, 3);

      if (memo.has(i)) {
        const val = memo.get(i)!;
        stepsList.push({
          s,
          memo: new Map(memo),
          i,
          res: val,
          stack: [...stack],
          variables: { i, "dp.get(i)": val },
          explanation: `Memo Hit! dp[${i}] has value ${val}. Return ${val}.`,
          pseudoStep: `RETURN dp[${i}] (${val})`
        });
        addLines(5, 4, 3, 4);
        stack.pop();
        return val;
      }

      if (s[i] === '0') {
        stepsList.push({
          s,
          memo: new Map(memo),
          i,
          res: 0,
          stack: [...stack],
          variables: { i, "s[i]": "0" },
          explanation: `Leading zero check: s[${i}] is '0'. Since a valid letter code cannot start with '0', return 0.`,
          pseudoStep: "RETURN 0"
        });
        addLines(6, 6, 9, 10);
        stack.pop();
        return 0;
      }

      stepsList.push({
        s,
        memo: new Map(memo),
        i,
        res: null,
        stack: [...stack],
        variables: { i, next_call: `dfs(${i + 1})` },
        explanation: `Single digit path: Decode '${s[i]}' as a single letter. Call dfs(${i + 1}) to process the remainder.`,
        pseudoStep: `SET res = dfs(${i + 1})`
      });
      addLines(7, 8, 12, 14);

      let res = solve(i + 1);

      stepsList.push({
        s,
        memo: new Map(memo),
        i,
        res,
        stack: [...stack],
        variables: { i, res },
        explanation: `Returned to dfs(${i}). Single-digit branch yielded ${res} way(s). Now check if two digits starting at index ${i} are valid (10-26).`,
        pseudoStep: `SET res = ${res}`
      });
      addLines(7, 8, 12, 14);

      const isValidDouble = i + 1 < n && (s[i] === '1' || (s[i] === '2' && '0123456'.includes(s[i + 1])));
      if (isValidDouble) {
        const combined = s.substring(i, i + 2);
        stepsList.push({
          s,
          memo: new Map(memo),
          i,
          res,
          stack: [...stack],
          variables: { i, combined, next_call: `dfs(${i + 2})` },
          explanation: `Two-digit path: "${combined}" is valid (10–26). Call dfs(${i + 2}) to find ways from this branch.`,
          pseudoStep: `res += dfs(${i + 2})`
        });
        addLines(12, 13, 18, 19);

        const res2 = solve(i + 2);
        res += res2;

        stepsList.push({
          s,
          memo: new Map(memo),
          i,
          res,
          stack: [...stack],
          variables: { i, ways_from_combined: res2, total_ways: res },
          explanation: `Returned to dfs(${i}). Two-digit path added ${res2} way(s). New total: ${res}.`,
          pseudoStep: `SET res = ${res}`
        });
        addLines(12, 13, 18, 19);
      } else {
        const combined = i + 1 < n ? s.substring(i, i + 2) : "n/a";
        stepsList.push({
          s,
          memo: new Map(memo),
          i,
          res,
          stack: [...stack],
          variables: { i, combined },
          explanation: combined !== "n/a"
            ? `Two-digit path check: "${combined}" is NOT valid (>26 or starting with 0). Skip two-digit branch.`
            : `Two-digit path check: End of string reached, cannot take two digits.`,
          pseudoStep: "IF isValidDouble -> NO ✗"
        });
        addLines(8, 9, 13, 15);
      }

      memo.set(i, res);
      stepsList.push({
        s,
        memo: new Map(memo),
        i,
        res,
        stack: [...stack],
        variables: { i, final_res: res },
        explanation: `Save subproblem result: dp.set(${i}, ${res}). Return ${res} ways.`,
        pseudoStep: `SET dp[${i}] = ${res}, RETURN`
      });
      addLines(14, 14, 20, 21);

      stack.pop();
      return res;
    };

    stepsList.push({
      s,
      memo: new Map(memo),
      i: null,
      res: null,
      stack: [],
      variables: { initial_call: "dfs(0)" },
      explanation: "Launch recursive DFS traversal starting at index 0.",
      pseudoStep: "RETURN dfs(0)"
    });
    addLines(17, 16, 26, 26);

    const finalRes = solve(0);

    stepsList.push({
      s,
      memo: new Map(memo),
      i: 0,
      res: finalRes,
      stack: [],
      variables: { final_result: finalRes },
      explanation: `Algorithm Complete! dfs(0) returned ${finalRes}. There are exactly ${finalRes} ways to decode "${s}".`,
      pseudoStep: `RETURN ${finalRes}`
    });
    addLines(17, 16, 26, 26);

    return { steps: stepsList, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-8">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Input String (s = "{s}")
                </h4>
                <div className="flex gap-2">
                  {s.split('').map((char, idx) => {
                    const isProcessing = step.i === idx;
                    const isInStack = step.stack.includes(idx);

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-bold transition-all duration-250 ${
                            isProcessing
                              ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 scale-105 shadow-md z-10"
                              : isInStack
                                ? "border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400 font-bold"
                                : "border-border bg-muted/30 text-foreground"
                          }`}
                        >
                          {char}
                        </div>
                        {isProcessing && (
                          <span className="text-[8px] font-bold text-orange-500 uppercase font-mono px-1 bg-orange-500/10 rounded">
                            dfs({idx})
                          </span>
                        )}
                        {!isProcessing && isInStack && (
                          <span className="text-[8px] font-bold text-blue-500 uppercase font-mono px-1 bg-blue-500/10 rounded">
                            Wait
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 border-dashed font-bold transition-all duration-200 ${
                        step.i === s.length
                          ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 scale-105"
                          : "border-border/50 text-muted-foreground/30"
                      }`}
                    >
                      END
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Memoization Table (dp Map)
                </h4>
                <div className="flex gap-3 flex-wrap pt-1 pb-1">
                  {Array.from({ length: s.length + 1 }).map((_, idx) => {
                    const hasValue = step.memo.has(idx);
                    const val = step.memo.get(idx);
                    const isProcessing = step.i === idx;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div
                          className={`w-14 h-14 flex flex-col items-center justify-center rounded-lg border-2 font-bold transition-all duration-200 shadow-sm ${
                            hasValue
                              ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                              : isProcessing
                                ? "border-orange-500/30 bg-orange-500/5 text-orange-600/70"
                                : "border-border/40 bg-muted/20 text-muted-foreground/30"
                          }`}
                        >
                          <span className="text-[9px] uppercase font-mono tracking-tighter opacity-70 mb-0.5">
                            dp[{idx}]
                          </span>
                          <span className="text-lg font-bold font-mono">
                            {hasValue ? val : "?"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {step.stack.length > 0 && (
                <div className="mt-8 border-t border-border/40 pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Active Call Stack
                  </h4>
                  <div className="flex gap-2 items-center flex-wrap">
                    {step.stack.map((idx, pos) => (
                      <React.Fragment key={pos}>
                        <div className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-500/20 font-mono shadow-sm">
                          dfs({idx})
                        </div>
                        {pos < step.stack.length - 1 && (
                          <span className="text-muted-foreground/30 font-bold">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {step.calc && (
              <Card className="p-4 bg-primary/5 border-primary/10">
                <h3 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wider">Calculation</h3>
                <p className="font-mono text-center text-lg font-bold">{step.calc}</p>
              </Card>
            )}

            <Card className="p-4 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">
                Why this works
              </h4>
              <p>
                To decode a string, we can try taking 1 digit (if valid, i.e., not '0') or 2 digits (if valid, between 10 and 26).
              </p>
              <p>
                The subproblem `dfs(i)` returns the number of valid decodings starting at index `i`.
              </p>
              <p>
                Without memoization, the call tree has overlapping subproblems that lead to exponential O(2^N) time.
              </p>
              <p>
                By storing computed subproblem states in a memo map, we ensure each index is solved at most once, reducing time complexity to O(N).
              </p>
            </Card>
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
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">
              {step.explanation}
            </p>
          </Card>
          <VariablePanel variables={step.variables} />
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

export default DecodeWaysVisualization;
