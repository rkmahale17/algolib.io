import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  i: number;
  j: number;
  activeStack: [number, number][];
  memo: Record<string, boolean>;
  success: Record<string, boolean>;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  lineExecution: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function isInterleave(s1: string, s2: string, s3: string): boolean {
  if (s1.length + s2.length !== s3.length) {
    return false;
  }
  const memo = new Map<string, boolean>();
  function dfs(i: number, j: number): boolean {
    if (i === s1.length && j === s2.length) {
      return true;
    }
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }
    if (i < s1.length && s1[i] === s3[i + j] && dfs(i + 1, j)) {
      memo.set(key, true);
      return true;
    }
    if (j < s2.length && s2[j] === s3[i + j] && dfs(i, j + 1)) {
      memo.set(key, true);
      return true;
    }
    memo.set(key, false);
    return false;
  }
  return dfs(0, 0);
}`,
  python: `def isInterleave(s1: str, s2: str, s3: str) -> bool:
    if len(s1) + len(s2) != len(s3):
        return False
    memo = {}
    def dfs(i: int, j: int) -> bool:
        if i == len(s1) and j == len(s2):
            return True
        key = (i, j)
        if key in memo:
            return memo[key]
        if i < len(s1) and s1[i] == s3[i + j] and dfs(i + 1, j):
            memo[key] = True
            return True
        if j < len(s2) and s2[j] == s3[i + j] and dfs(i, j + 1):
            memo[key] = True
            return True
        memo[key] = False
        return False
    return dfs(0, 0)`,
  java: `public static class Solution {
    private String s1_ref, s2_ref, s3_ref;
    private Boolean[][] memo;
    public boolean isInterleave(String s1, String s2, String s3) {
        if (s1.length() + s2.length() != s3.length()) {
            return false;
        }
        this.s1_ref = s1;
        this.s2_ref = s2;
        this.s3_ref = s3;
        this.memo = new Boolean[s1.length() + 1][s2.length() + 1];
        return dfs(0, 0);
    }
    private boolean dfs(int i, int j) {
        if (i == s1_ref.length() && j == s2_ref.length()) {
            return true;
        }
        if (memo[i][j] != null) {
            return memo[i][j];
        }
        boolean result = false;
        if (i < s1_ref.length() && s1_ref.charAt(i) == s3_ref.charAt(i + j)) {
            if (dfs(i + 1, j)) {
                result = true;
            }
        }
        if (!result && j < s2_ref.length() && s2_ref.charAt(j) == s3_ref.charAt(i + j)) {
            if (dfs(i, j + 1)) {
                result = true;
            }
        }
        memo[i][j] = result;
        return result;
    }
}`,
  cpp: `class Solution {
public:
    string s1_ref, s2_ref, s3_ref;
    unordered_map<string, bool> memo;
    bool dfs(int i, int j) {
        if (i == s1_ref.length() && j == s2_ref.length()) {
            return true;
        }
        string key = to_string(i) + "," + to_string(j);
        if (memo.count(key)) {
            return memo[key];
        }
        if (i < s1_ref.length() && s1_ref[i] == s3_ref[i + j]) {
            if (dfs(i + 1, j)) {
                memo[key] = true;
                return true;
            }
        }
        if (j < s2_ref.length() && s2_ref[j] == s3_ref[i + j]) {
            if (dfs(i, j + 1)) {
                memo[key] = true;
                return true;
            }
        }
        memo[key] = false;
        return false;
    }
    bool isInterleave(string s1, string s2, string s3) {
        if (s1.length() + s2.length() != s3.length()) {
            return false;
        }
        s1_ref = s1;
        s2_ref = s2;
        s3_ref = s3;
        memo.clear();
        return dfs(0, 0);
    }
};`
};

export const InterleavingStringVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const s1 = "aabcc";
  const s2 = "dbbca";
  const s3 = "aadbbcbcac";

  const { steps, stepLineNumbers } = useMemo(() => {
    const tempSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const memo: Record<string, boolean> = {};
    const success: Record<string, boolean> = {};
    const currentStack: [number, number][] = [];

    const getVariables = (i: number, j: number, currentVisitedSize: number, line: string) => {
      return {
        "Current State (i, j)": i >= 0 ? `(${i}, ${j})` : 'Initial Check',
        "Next s3 character": i >= 0 && (i + j) < s3.length ? `'${s3[i + j]}' at index ${i + j}` : 'None',
        "Active Stack Depth": currentStack.length,
        "Memoization Size": currentVisitedSize,
        "Line Execution": line
      };
    };

    const pushStep = (
      ts: number, py: number, jv: number, cp: number,
      explanation: string,
      pseudo: string,
      i: number, j: number,
      lineExec: string
    ) => {
      tempSteps.push({
        i,
        j,
        activeStack: [...currentStack],
        memo: { ...memo },
        success: { ...success },
        explanation,
        pseudoStep: pseudo,
        lineExecution: lineExec,
        variables: getVariables(i, j, Object.keys(memo).length, lineExec)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    // Step 1: Initial check
    pushStep(
      2, 2, 5, 29,
      `First, check if the sum of s1's length (${s1.length}) and s2's length (${s2.length}) is equal to s3's length (${s3.length}). Since 5 + 5 = 10, the lengths match and we can proceed.`,
      "isInterleave(s1, s2, s3)",
      -1, -1,
      "if (s1.length + s2.length !== s3.length)"
    );

    // Step 2: Initialize Memo
    pushStep(
      5, 4, 11, 35,
      `Initialize a memoization Map 'dp' to cache results for subproblems. This prevents recomputing states (i, j) that have already been evaluated.`,
      "SET memo = {}",
      -1, -1,
      "const memo = new Map<string, boolean>();"
    );

    // Step 3: Trigger DFS
    pushStep(
      25, 19, 12, 36,
      `Start the depth-first search (DFS) by invoking dfs(0, 0). Pointers for both s1 and s2 start at index 0.`,
      "dfs(0, 0)",
      -1, -1,
      "return dfs(0, 0);"
    );

    const runDfs = (i: number, j: number): boolean => {
      const key = `${i},${j}`;
      currentStack.push([i, j]);

      // Enter dfs
      pushStep(
        6, 5, 14, 5,
        `dfs(${i}, ${j}) is called. This means we are attempting to form the prefix of s3 of length ${i + j} using ${i} characters from s1 and ${j} characters from s2.`,
        `dfs(i=${i}, j=${j})`,
        i, j,
        `const dfs = (${i}, ${j}) => {`
      );

      // Base Case Check
      pushStep(
        7, 6, 15, 6,
        `Check if we have reached the end of both strings. i is ${i}/${s1.length} and j is ${j}/${s2.length}.`,
        `IF i == len(s1) AND j == len(s2)  →  ${i} == 5 AND ${j} == 5`,
        i, j,
        "if (i === s1.length && j === s2.length)"
      );

      if (i === s1.length && j === s2.length) {
        success[key] = true;
        pushStep(
          8, 7, 16, 7,
          `Both s1 and s2 are fully exhausted! We have successfully formed the entire s3 string. Return true.`,
          "RETURN True",
          i, j,
          "return true;"
        );
        currentStack.pop();
        return true;
      }

      // Memo check
      pushStep(
        11, 9, 18, 10,
        `Check if state (${i}, ${j}) is already in the memo Map. Key is "${key}".`,
        `IF (i, j) in memo  →  "${key}" in memo`,
        i, j,
        `const key = "${key}"; if (dp.has(key))`
      );

      if (key in memo) {
        pushStep(
          12, 10, 19, 11,
          `Memo hit! dfs(${i}, ${j}) was already computed and stored as false. Return cached result.`,
          `RETURN memo[(${i}, ${j})]  →  False`,
          i, j,
          "return dp.get(key);"
        );
        currentStack.pop();
        return memo[key];
      }

      // Match character from s1
      const canMatchS1 = i < s1.length && s1[i] === s3[i + j];
      pushStep(
        14, 11, 22, 13,
        i < s1.length 
          ? `Compare current character of s1 ('${s1[i]}') at index ${i} with s3 ('${s3[i + j]}') at index ${i + j}.`
          : `s1 is fully exhausted. Cannot match from s1.`,
        `IF i < len(s1) AND s1[i] == s3[i+j]  →  ${i} < 5 AND ${s1[i] || '∅'} == ${s3[i+j] || '∅'}`,
        i, j,
        "i < s1.length && s1[i] === s3[i + j]"
      );

      if (canMatchS1) {
        pushStep(
          14, 11, 23, 14,
          `Match! s1[${i}] ('${s1[i]}') matches s3[${i + j}] ('${s3[i + j]}'). Recursively search by moving s1's pointer: dfs(${i + 1}, ${j}).`,
          `dfs(i=${i+1}, j=${j})`,
          i, j,
          "dfs(i + 1, j)"
        );

        const matched = runDfs(i + 1, j);
        if (matched) {
          success[key] = true;
          pushStep(
            16, 13, 24, 16,
            `dfs(${i + 1}, ${j}) returned true. Thus, dfs(${i}, ${j}) also succeeds. Return true.`,
            "RETURN True",
            i, j,
            "return true;"
          );
          currentStack.pop();
          return true;
        }

        pushStep(
          14, 11, 23, 14,
          `dfs(${i + 1}, ${j}) returned false. That branch failed; backtrack and try matching from s2 instead.`,
          `dfs(i=${i+1}, j=${j})  →  False`,
          i, j,
          "dfs(i + 1, j) // failed"
        );
      }

      // Match character from s2
      const canMatchS2 = j < s2.length && s2[j] === s3[i + j];
      pushStep(
        18, 14, 27, 19,
        j < s2.length
          ? `Compare current character of s2 ('${s2[j]}') at index ${j} with s3 ('${s3[i + j]}') at index ${i + j}.`
          : `s2 is fully exhausted. Cannot match from s2.`,
        `IF j < len(s2) AND s2[j] == s3[i+j]  →  ${j} < 5 AND ${s2[j] || '∅'} == ${s3[i+j] || '∅'}`,
        i, j,
        "j < s2.length && s2[j] === s3[i + j]"
      );

      if (canMatchS2) {
        pushStep(
          18, 14, 28, 20,
          `Match! s2[${j}] ('${s2[j]}') matches s3[${i + j}] ('${s3[i + j]}'). Recursively search by moving s2's pointer: dfs(${i}, ${j + 1}).`,
          `dfs(i=${i}, j=${j+1})`,
          i, j,
          "dfs(i, j + 1)"
        );

        const matched = runDfs(i, j + 1);
        if (matched) {
          success[key] = true;
          pushStep(
            20, 15, 29, 22,
            `dfs(${i}, ${j + 1}) returned true. Thus, dfs(${i}, ${j}) also succeeds. Return true.`,
            "RETURN True",
            i, j,
            "return true;"
          );
          currentStack.pop();
          return true;
        }

        pushStep(
          18, 14, 28, 20,
          `dfs(${i}, ${j + 1}) returned false. That branch also failed.`,
          `dfs(i=${i}, j=${j+1})  →  False`,
          i, j,
          "dfs(i, j + 1) // failed"
        );
      }

      // No match works, cache and return false
      memo[key] = false;
      pushStep(
        22, 17, 32, 25,
        `No valid paths could be formed from state (${i}, ${j}). Store false in memo and return false.`,
        `memo[(${i}, ${j})] = False  →  RETURN False`,
        i, j,
        "dp.set(key, false); return false;"
      );

      currentStack.pop();
      return false;
    };

    const finalResult = runDfs(0, 0);

    // Final result step
    pushStep(
      25, 19, 12, 36,
      `dfs(0, 0) returned ${finalResult}. Since there exists a valid path that interleaves s1 and s2 to form s3, the function returns true.`,
      `RETURN ${finalResult}`,
      -1, -1,
      `return dfs(0, 0); // returned ${finalResult}`
    );

    return { steps: tempSteps, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStep] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  // Helper to determine the status of a grid cell
  const getCellStatus = (r: number, c: number) => {
    if (!step) return 'unvisited';
    const key = `${r},${c}`;
    const isActive = step.activeStack.some(([sI, sJ]) => sI === r && sJ === c);
    const isSuccess = step.success[key] === true;
    const isFailed = step.memo[key] === false;

    if (isActive) return 'active';
    if (isSuccess) return 'success';
    if (isFailed) return 'failed';
    return 'unvisited';
  };

  // Check if a character is matched on the active path
  const isCharMatchedS1 = (index: number) => {
    if (!step) return false;
    for (let k = 0; k < step.activeStack.length - 1; k++) {
      const [currI, currJ] = step.activeStack[k];
      const [nextI, nextJ] = step.activeStack[k + 1];
      if (currI === index && nextI === index + 1 && currJ === nextJ) {
        return true;
      }
    }
    return false;
  };

  const isCharMatchedS2 = (index: number) => {
    if (!step) return false;
    for (let k = 0; k < step.activeStack.length - 1; k++) {
      const [currI, currJ] = step.activeStack[k];
      const [nextI, nextJ] = step.activeStack[k + 1];
      if (currJ === index && nextJ === index + 1 && currI === nextI) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <VisualizationLayout
        controls={
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
        }
        leftContent={
          <div className="space-y-6">
            {/* Strings and Pointers Panel */}
            <Card className="p-5 border shadow-sm">
              <h3 className="text-sm font-semibold mb-4 text-foreground/80 uppercase tracking-wider">String Pointers</h3>
              <div className="space-y-4">
                {/* String 1 */}
                <div className="flex items-center gap-4">
                  <span className="w-12 text-sm font-semibold text-muted-foreground">s1:</span>
                  <div className="flex gap-1 animate-all duration-300">
                    {s1.split('').map((char, index) => {
                      const isActive = step.i === index;
                      const isMatched = isCharMatchedS1(index);
                      return (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-sm font-bold transition-all relative ${
                            isActive
                              ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/30'
                              : isMatched
                              ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                              : 'bg-muted/30 border-border/50 text-muted-foreground'
                          }`}
                        >
                          {char}
                          {isActive && (
                            <div className="absolute -bottom-5 text-[8px] font-black uppercase text-blue-600 dark:text-blue-400">
                              i={index}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div
                      className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-xs font-bold text-muted-foreground/40 transition-all relative ${
                        step.i === s1.length
                          ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/30'
                          : 'bg-muted/30 border-border/50'
                      }`}
                    >
                      ∅
                      {step.i === s1.length && (
                        <div className="absolute -bottom-5 text-[8px] font-black uppercase text-blue-600 dark:text-blue-400">
                          i={s1.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* String 2 */}
                <div className="flex items-center gap-4 pt-2">
                  <span className="w-12 text-sm font-semibold text-muted-foreground">s2:</span>
                  <div className="flex gap-1 animate-all duration-300">
                    {s2.split('').map((char, index) => {
                      const isActive = step.j === index;
                      const isMatched = isCharMatchedS2(index);
                      return (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-sm font-bold transition-all relative ${
                            isActive
                              ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/30'
                              : isMatched
                              ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                              : 'bg-muted/30 border-border/50 text-muted-foreground'
                          }`}
                        >
                          {char}
                          {isActive && (
                            <div className="absolute -bottom-5 text-[8px] font-black uppercase text-blue-600 dark:text-blue-400">
                              j={index}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div
                      className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-xs font-bold text-muted-foreground/40 transition-all relative ${
                        step.j === s2.length
                          ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/30'
                          : 'bg-muted/30 border-border/50'
                      }`}
                    >
                      ∅
                      {step.j === s2.length && (
                        <div className="absolute -bottom-5 text-[8px] font-black uppercase text-blue-600 dark:text-blue-400">
                          j={s2.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* String 3 */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <span className="w-12 text-sm font-semibold text-muted-foreground">s3:</span>
                  <div className="flex gap-1 flex-wrap animate-all duration-300">
                    {s3.split('').map((char, index) => {
                      const isActive = step.i !== -1 && step.j !== -1 && (step.i + step.j) === index;
                      const isMatched = step.i !== -1 && step.j !== -1 && index < (step.i + step.j);
                      return (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-sm font-bold transition-all relative ${
                            isActive
                              ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary/30'
                              : isMatched
                              ? 'bg-green-500/25 border-green-500/40 text-green-700 dark:text-green-400'
                              : 'bg-muted/30 border-border/50 text-muted-foreground'
                          }`}
                        >
                          {char}
                          {isActive && (
                            <div className="absolute -bottom-5 text-[7px] font-black uppercase text-primary">
                              i+j={index}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div
                      className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-xs font-bold text-muted-foreground/40 transition-all relative ${
                        step.i !== -1 && step.j !== -1 && (step.i + step.j) === s3.length
                          ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary/30'
                          : 'bg-muted/30 border-border/50'
                      }`}
                    >
                      ∅
                      {step.i !== -1 && step.j !== -1 && (step.i + step.j) === s3.length && (
                        <div className="absolute -bottom-5 text-[7px] font-black uppercase text-primary">
                          i+j={s3.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 2D DP Table / State space */}
            <Card className="p-5 border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">DFS Memoization Grid</h3>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500" />
                    <span className="text-muted-foreground">Active Stack</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500" />
                    <span className="text-muted-foreground">Path Success</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500" />
                    <span className="text-muted-foreground">Memoized False</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr>
                      <th className="border border-border p-2 bg-muted text-xs text-muted-foreground font-mono text-center">
                        s1\s2
                      </th>
                      <th className="border border-border p-2 bg-muted text-xs font-mono text-center">
                        ∅<div className="text-[10px] text-muted-foreground font-normal">0</div>
                      </th>
                      {s2.split('').map((char, index) => (
                        <th key={index} className="border border-border p-2 bg-muted text-xs font-mono text-center font-bold">
                          {char}
                          <div className="text-[10px] text-muted-foreground font-normal">{index + 1}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: s1.length + 1 }).map((_, r) => (
                      <tr key={r}>
                        <td className="border border-border p-2 bg-muted text-xs font-mono font-bold text-center">
                          {r === 0 ? '∅' : s1[r - 1]}
                          <div className="text-[10px] text-muted-foreground font-normal">{r}</div>
                        </td>
                        {Array.from({ length: s2.length + 1 }).map((_, c) => {
                          const status = getCellStatus(r, c);
                          const isCurrent = step.i === r && step.j === c;
                          
                          let cellClass = 'bg-background text-muted-foreground/40';
                          let symbol = '';

                          if (status === 'active') {
                            cellClass = 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500 font-extrabold animate-pulse';
                            symbol = '●';
                          } else if (status === 'success') {
                            cellClass = 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500 font-bold';
                            symbol = '✓';
                          } else if (status === 'failed') {
                            cellClass = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
                            symbol = '✗';
                          }

                          return (
                            <td
                              key={c}
                              className={`border border-border p-1 text-center text-xs font-semibold select-none transition-all w-8 h-8 ${cellClass} ${
                                isCurrent ? 'ring-2 ring-primary ring-inset font-black' : ''
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center h-full">
                                <span className="text-[10px]">{symbol}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            {/* Educational Commentary */}
            <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm flex items-center min-h-[70px]">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Narrative
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {step.explanation}
                  </p>
                </div>
              </div>
            </Card>

            {/* Variable Panel */}
            <VariablePanel variables={step.variables} />
          </div>
        }
      />
    </div>
  );
};
export default InterleavingStringVisualization;
