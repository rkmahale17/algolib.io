import React, { useState, useMemo } from "react";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  s: string;
  p: string;
  i: number;
  j: number;
  cache: Record<string, boolean>;
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
  match?: boolean;
}

const languages: VisualizationLanguageMap = {
  typescript: `function isMatch(s: string, p: string): boolean {
  const cache = new Map<string, boolean>();
  function dfs(i: number, j: number): boolean {
    const key = \`\${i},\${j}\`;
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    if (i >= s.length && j >= p.length) {
      return true;
    }
    if (j >= p.length) {
      return false;
    }
    const match = i < s.length && (s[i] === p[j] || p[j] === ".");
    if (j + 1 < p.length && p[j + 1] === "*") {
      const result = dfs(i, j + 2) || (match && dfs(i + 1, j));
      cache.set(key, result);
      return result;
    }
    if (match) {
      const result = dfs(i + 1, j + 1);
      cache.set(key, result);
      return result;
    }
    cache.set(key, false);
    return false;
  }
  return dfs(0, 0);
}`,
  python: `def isMatch(s: str, p: str) -> bool:
    cache = {}
    def dfs(i: int, j: int) -> bool:
        if (i, j) in cache:
            return cache[(i, j)]
        if i >= len(s) and j >= len(p):
            return True
        if j >= len(p):
            return False
        match = i < len(s) and (s[i] == p[j] or p[j] == '.')
        if j + 1 < len(p) and p[j + 1] == '*':
            result = dfs(i, j + 2) or (match and dfs(i + 1, j))
            cache[(i, j)] = result
            return result
        if match:
            result = dfs(i + 1, j + 1)
            cache[(i, j)] = result
            return result
        cache[(i, j)] = False
        return False
    return dfs(0, 0)`,
  java: `public static class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length();
        int n = p.length();
        Boolean[][] dp = new Boolean[m + 1][n + 1];
        return dfs(s, p, 0, 0, dp);
    }
    private boolean dfs(String s, String p, int i, int j, Boolean[][] dp) {
        if (dp[i][j] != null) {
            return dp[i][j];
        }
        if (i == s.length() && j == p.length()) {
            return true;
        }
        if (j == p.length()) {
            return false;
        }
        boolean match = i < s.length() && (s.charAt(i) == p.charAt(j) || p.charAt(j) == '.');
        if (j + 1 < p.length() && p.charAt(j + 1) == '*') {
            boolean result = dfs(s, p, i, j + 2, dp) || (match && dfs(s, p, i + 1, j, dp));
            dp[i][j] = result;
            return result;
        }
        if (match) {
            boolean result = dfs(s, p, i + 1, j + 1, dp);
            dp[i][j] = result;
            return result;
        }
        dp[i][j] = false;
        return false;
    }
}`,
  cpp: `class Solution {
public:
    bool isMatch(string s, string p) {
        int s_len = s.length();
        int p_len = p.length();
        vector<vector<bool>> dp(s_len + 1, vector<bool>(p_len + 1, false));
        dp[0][0] = true;
        for (int j = 1; j <= p_len; ++j) {
            if (p[j - 1] == '*') {
                dp[0][j] = dp[0][j - 2];
            }
        }
        for (int i = 1; i <= s_len; ++i) {
            for (int j = 1; j <= p_len; ++j) {
                if (p[j - 1] == '.' || p[j - 1] == s[i - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else if (p[j - 1] == '*') {
                    dp[i][j] = dp[i][j - 2];
                    if (p[j - 2] == '.' || p[j - 2] == s[i - 1]) {
                        dp[i][j] = dp[i][j] || dp[i - 1][j];
                    }
                } else {
                    dp[i][j] = false;
                }
            }
        }
        return dp[s_len][p_len];
    }
};`
};

export const RegularExpressionMatchingVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s = "aab";
    const p = "c*a*b";
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const cache = new Map<string, boolean>();

    const addStep = (
      i: number,
      j: number,
      message: string,
      pseudo: string,
      vars: any,
      match: boolean | undefined,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        s,
        p,
        i,
        j,
        cache: Object.fromEntries(cache.entries()),
        message,
        pseudoStep: pseudo,
        variables: vars,
        match
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      0, 0,
      `Starting matching process with s="${s}" and p="${p}"`,
      `isMatch(s="${s}", p="${p}")`,
      { s: `"${s}"`, p: `"${p}"` },
      undefined,
      1, 1, 2, 3
    );

    addStep(
      0, 0,
      "Initialize memoization cache/table structure.",
      "SET cache = {}",
      { cache: "{}" },
      undefined,
      2, 2, 5, 6
    );

    addStep(
      0, 0,
      "Invoke the recursive depth-first search starting at indexes 0, 0.",
      "dfs(i=0, j=0)",
      { i: 0, j: 0 },
      undefined,
      28, 21, 6, 20
    );

    function dfs(i: number, j: number): boolean {
      const key = `${i},${j}`;
      
      addStep(
        i, j,
        `dfs(${i}, ${j}) called. Check cache or bounds.`,
        `CALL dfs(i=${i}, j=${j})`,
        { i, j },
        undefined,
        3, 3, 8, 11
      );

      if (cache.has(key)) {
        addStep(
          i, j,
          `Cache hit for index state (${i}, ${j}): returned cached value ${cache.get(key)}.`,
          `cache.get("${key}")  →  ${cache.get(key)}`,
          { cache: JSON.stringify(Object.fromEntries(cache.entries())) },
          undefined,
          5, 4, 9, 15
        );
        return cache.get(key)!;
      }

      if (i >= s.length && j >= p.length) {
        addStep(
          i, j,
          `Both string s and pattern p are fully consumed. Match successful!`,
          `IF i >= s.length AND j >= p.length  →  TRUE`,
          { i, j },
          undefined,
          8, 6, 12, 27
        );
        return true;
      }

      if (j >= p.length) {
        addStep(
          i, j,
          `Pattern is exhausted but string has remaining characters. Match failed.`,
          `IF j >= p.length  →  TRUE`,
          { i, j },
          undefined,
          11, 8, 15, 23
        );
        return false;
      }

      const match = i < s.length && (s[i] === p[j] || p[j] === ".");
      addStep(
        i, j,
        `Compare s[${i}] ('${s[i] || ""}') and p[${j}] ('${p[j]}'). Match: ${match}.`,
        `SET match = i < len(s) AND (s[i] == p[j] OR p[j] == '.')  →  ${match}`,
        { i, j, charS: s[i] || "∅", charP: p[j], match },
        match,
        14, 10, 18, 15
      );

      if (j + 1 < p.length && p[j + 1] === "*") {
        addStep(
          i, j,
          `Next character in pattern is '*', branching paths: skip '${p[j]}*' (dfs(i, j+2)) or consume (dfs(i+1, j))`,
          `IF p[j+1] == '*'  →  TRUE`,
          { i, j, nextChar: p[j + 1] },
          match,
          15, 11, 19, 17
        );
        
        let result = dfs(i, j + 2);
        if (!result && match) {
          result = dfs(i + 1, j);
        }

        cache.set(key, result);
        addStep(
          i, j,
          `Result for (${i}, ${j}) with '*' wildcard evaluated to ${result}. Saved to cache.`,
          `cache["${key}"] = ${result}`,
          { result, cache: JSON.stringify(Object.fromEntries(cache.entries())) },
          match,
          17, 13, 21, 18
        );
        return result;
      }

      if (match) {
        addStep(
          i, j,
          `Characters match. Proceeding to next characters: dfs(${i + 1}, ${j + 1}).`,
          `IF match  →  TRUE`,
          { i, j },
          match,
          20, 15, 24, 16
        );

        const result = dfs(i + 1, j + 1);
        cache.set(key, result);

        addStep(
          i, j,
          `Result for (${i}, ${j}) without '*' wildcard evaluated to ${result}. Saved to cache.`,
          `cache["${key}"] = ${result}`,
          { result, cache: JSON.stringify(Object.fromEntries(cache.entries())) },
          match,
          22, 17, 26, 16
        );
        return result;
      }

      cache.set(key, false);
      addStep(
        i, j,
        `Characters do not match. Result is false. Saved to cache.`,
        `cache["${key}"] = false`,
        { result: false, cache: JSON.stringify(Object.fromEntries(cache.entries())) },
        match,
        25, 19, 29, 23
      );
      return false;
    }

    dfs(0, 0);

    return { steps: newSteps, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="bg-card rounded-lg p-6 border space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">String (s)</h3>
              <div className="flex gap-2">
                {step.s.split("").map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 flex items-center justify-center border rounded font-mono text-lg
                      ${idx === step.i ? "bg-primary/20 border-primary text-primary font-bold" : "bg-muted text-foreground"}`}
                  >
                    {char}
                  </div>
                ))}
                {step.i === step.s.length && (
                  <div className="w-10 h-10 flex items-center justify-center border rounded font-mono text-lg bg-primary/20 border-primary text-primary font-bold">
                    ∅
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Pattern (p)</h3>
              <div className="flex gap-2 flex-wrap">
                {step.p.split("").map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 flex items-center justify-center border rounded font-mono text-lg
                      ${idx === step.j ? "bg-primary/20 border-primary text-primary font-bold" : "bg-muted text-foreground"}`}
                  >
                    {char}
                  </div>
                ))}
                {step.j === step.p.length && (
                  <div className="w-10 h-10 flex items-center justify-center border rounded font-mono text-lg bg-primary/20 border-primary text-primary font-bold">
                    ∅
                  </div>
                )}
              </div>
            </div>
          </div>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.message}</p>
          </Card>

          <VariablePanel
            variables={{
              i: step.i,
              j: step.j,
              "s[i]": step.i < step.s.length ? step.s[step.i] : "∅",
              "p[j]": step.j < step.p.length ? step.p[step.j] : "∅",
              match: step.match !== undefined ? step.match.toString() : "-",
              cacheSize: Object.keys(step.cache).length,
            }}
          />
          
          {Object.keys(step.cache).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Cache</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-muted rounded">
                {Object.entries(step.cache).map(([key, val]) => (
                  <div key={key} className={`text-xs px-2 py-1 rounded ${val ? "bg-green-500/20 text-green-600 font-bold" : "bg-red-500/20 text-red-600 font-bold"}`}>
                    {key}: {val.toString()}
                  </div>
                ))}
              </div>
            </div>
          )}
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
export default RegularExpressionMatchingVisualization;
