import React, { useEffect, useState, useMemo } from "react";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  s: string;
  part: string[];
  i: number;
  j: number | null;
  res: string[][];
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function partition(s: string): string[][] {
  const res: string[][] = [];
  const part: string[] = [];
  function isPalindrome(left: number, right: number): boolean {
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    return true;
  }
  function dfs(i: number): void {
    if (i >= s.length) {
      res.push([...part]);
      return;
    }
    for (let j = i; j < s.length; j++) {
      if (isPalindrome(i, j)) {
        part.push(s.substring(i, j + 1));
        dfs(j + 1);
        part.pop();
      }
    }
  }
  dfs(0);
  return res;
}`,
  python: `def partition(s):
    res = []
    part = []
    def isPalindrome(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    def dfs(i):
        if i >= len(s):
            res.append(part[:])
            return
        for j in range(i, len(s)):
            if isPalindrome(i, j):
                part.append(s[i:j + 1])
                dfs(j + 1)
                part.pop()
    dfs(0)
    return res`,
  java: `public static class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> res = new ArrayList<>();
        List<String> part = new ArrayList<>();
        dfs(s, 0, part, res);
        return res;
    }
    private void dfs(String s, int i, List<String> part, List<List<String>> res) {
        if (i >= s.length()) {
            res.add(new ArrayList<>(part));
            return;
        }
        for (int j = i; j < s.length(); j++) {
            if (isPalindrome(s, i, j)) {
                part.add(s.substring(i, j + 1));
                dfs(s, j + 1, part, res);
                part.remove(part.size() - 1);
            }
        }
    }
    private boolean isPalindrome(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> res;
        vector<string> part;
        function<bool(int, int)> isPalindrome = [&](int left, int right) {
            while (left < right) {
                if (s[left] != s[right]) {
                    return false;
                }
                left++;
                right--;
            }
            return true;
        };
        function<void(int)> dfs = [&](int i) {
            if (i >= s.length()) {
                res.push_back(part);
                return;
            }
            for (int j = i; j < s.length(); j++) {
                if (isPalindrome(i, j)) {
                    part.push_back(s.substr(i, j - i + 1));
                    dfs(j + 1);
                    part.pop_back();
                }
            }
        };
        dfs(0);
        return res;
    }
};`
};

export const PalindromePartitioningVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s = "aab";
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const res: string[][] = [];
    const part: string[] = [];

    const addStep = (
      i: number,
      j: number | null,
      message: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        s,
        part: [...part],
        i,
        j,
        res: res.map((p) => [...p]),
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
      0, null,
      `Initialize partition logic. Input string is "${s}".`,
      `partition(s="${s}")`,
      { s: `"${s}"` },
      1, 1, 2, 3
    );

    addStep(
      0, null,
      "Initialize empty result res and current partition path arrays.",
      "SET res = [], part = []",
      { res: "[]", part: "[]" },
      2, 2, 3, 4
    );

    function isPalindromeCall(left: number, right: number): boolean {
      addStep(
        left, right,
        `isPalindrome(${left}, ${right}) called for substring "${s.substring(left, right + 1)}"`,
        `CALL isPalindrome(left=${left}, right=${right})`,
        { substring: `"${s.substring(left, right + 1)}"` },
        4, 4, 21, 6
      );

      let l = left;
      let r = right;
      while (l < r) {
        addStep(
          left, right,
          `Compare character at index ${l} ('${s[l]}') with index ${r} ('${s[r]}').`,
          `IF s[${l}] != s[${r}]  →  '${s[l]}' != '${s[r]}'`,
          { leftIdx: l, rightIdx: r, [`s[${l}]`]: `'${s[l]}'`, [`s[${r}]`]: `'${s[r]}'` },
          6, 6, 23, 8
        );

        if (s[l] !== s[r]) {
          addStep(
            left, right,
            `Mismatch detected! '${s[l]}' !== '${s[r]}', returning false (not a palindrome).`,
            "RETURN false",
            { mismatch: true },
            7, 7, 24, 9
          );
          return false;
        }
        l++;
        r--;
      }
      
      addStep(
        left, right,
        `Loop finished. Substring "${s.substring(left, right + 1)}" is a valid palindrome.`,
        "RETURN true",
        { substring: `"${s.substring(left, right + 1)}"` },
        12, 10, 29, 14
      );
      return true;
    }

    function dfsCall(i: number) {
      addStep(
        i, null,
        `dfs(i=${i}) called. Current partition: [${part.map(p => `"${p}"`).join(", ")}].`,
        `CALL dfs(i=${i})`,
        { i, part: `[${part.map(p => `"${p}"`).join(",")}]` },
        14, 11, 8, 16
      );

      addStep(
        i, null,
        `Check base case: starting index i (${i}) >= s.length (${s.length})`,
        `IF i >= s.length  →  ${i} >= 3`,
        { i, length: s.length },
        15, 12, 9, 17
      );

      if (i >= s.length) {
        res.push([...part]);
        addStep(
          i, null,
          `Base case met! Add partition [${part.map(p => `"${p}"`).join(", ")}] to result.`,
          `res.push([${part.map(p => `"${p}"`).join(",")}])`,
          { res: JSON.stringify(res) },
          16, 13, 10, 18
        );
        return;
      }

      for (let j = i; j < s.length; j++) {
        addStep(
          i, j,
          `Loop index j = ${j}. Evaluate substring "${s.substring(i, j + 1)}".`,
          `FOR j FROM ${i} TO 2  →  j = ${j}`,
          { i, j, substring: `"${s.substring(i, j + 1)}"` },
          19, 15, 13, 21
        );

        const isPal = isPalindromeCall(i, j);

        addStep(
          i, j,
          `isPalindrome(${i}, ${j}) returned ${isPal}.`,
          `isPalindrome(${i}, ${j})  →  ${isPal}`,
          { substring: `"${s.substring(i, j + 1)}"`, isPal },
          20, 16, 14, 22
        );

        if (isPal) {
          const sub = s.substring(i, j + 1);
          part.push(sub);
          addStep(
            i, j,
            `Include palindrome "${sub}" in partition. Current path: [${part.map(p => `"${p}"`).join(", ")}].`,
            `part.push("${sub}")`,
            { part: `[${part.map(p => `"${p}"`).join(",")}]` },
            21, 17, 15, 23
          );

          dfsCall(j + 1);

          const popped = part.pop();
          addStep(
            i, j,
            `Backtrack: pop "${popped}" from partition. Current path: [${part.map(p => `"${p}"`).join(", ")}].`,
            "part.pop()",
            { part: `[${part.map(p => `"${p}"`).join(",")}]` },
            23, 19, 17, 25
          );
        }
      }
    }

    addStep(
      0, null,
      "Start backtracking from the beginning of string (index 0).",
      "CALL dfs(i=0)",
      { i: 0 },
      27, 20, 5, 29
    );
    
    dfsCall(0);

    addStep(
      0, null,
      `Algorithm finished. Return list of all unique partitions: ${JSON.stringify(res)}.`,
      `RETURN res  →  ${JSON.stringify(res)}`,
      { res: JSON.stringify(res) },
      28, 21, 6, 30
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, []);

  if (steps.length === 0) return null;
  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <Card className="p-6 bg-card border border-border shadow-sm flex flex-col">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Input String (s)</h3>
            <div className="flex gap-2 mb-6">
              {step.s.split("").map((char, idx) => {
                const isI = idx === step.i;
                const isJ = idx === step.j;
                
                let highlightClass = "bg-card border-border text-foreground";
                if (step.i !== null && step.j !== null && idx >= step.i && idx <= step.j) {
                  highlightClass = "bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400";
                }

                if (isJ && isI) {
                  highlightClass += " ring-2 ring-purple-500 z-10 scale-105";
                } else if (isJ) {
                  highlightClass += " ring-2 ring-blue-500 z-10 scale-105";
                } else if (isI) {
                  highlightClass += " ring-2 ring-primary z-10 scale-105";
                }

                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all relative ${highlightClass}`}
                  >
                    <span>{char}</span>
                    {(isI || isJ) && (
                      <div className="absolute -bottom-6 text-[10px] font-bold uppercase font-mono text-muted-foreground whitespace-nowrap">
                        {isI && isJ ? "i,j" : isJ ? "j" : "i"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Current Partition (part)</h3>
            <div className="flex gap-2 mb-6 min-h-[3rem] flex-wrap">
              {step.part.length > 0 ? (
                step.part.map((str, idx) => (
                  <div
                    key={idx}
                    className="px-4 h-12 flex items-center justify-center text-primary-foreground font-bold rounded-lg border bg-primary border-primary transition-all animate-in zoom-in"
                  >
                    &quot;{str}&quot;
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic flex items-center h-12 px-2 text-sm">
                  Empty []
                </div>
              )}
            </div>

            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
              Result Partitions ({step.res.length})
            </h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto w-full p-3 border rounded-lg bg-muted/20 min-h-[6rem]">
              {step.res.map((sub, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 font-mono rounded border border-green-500/30 text-xs font-bold animate-in fade-in"
                >
                  [{sub.map((s) => `"${s}"`).join(", ")}]
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20 mt-auto">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.message}</p>
          </Card>

          <VariablePanel
            variables={{
              "i (start index)": step.i,
              "j (end index)": step.j !== null ? step.j : "null",
              "part (current partition)": `[${step.part.map((p) => `"${p}"`).join(", ")}]`,
              "res.length": step.res.length,
            }}
          />
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
export default PalindromePartitioningVisualization;
