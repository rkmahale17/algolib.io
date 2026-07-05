import React, { useState, useMemo } from "react";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  dp: number[][];
  s: string;
  t: string;
  i: number;
  j: number;
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function numDistinct(s: string, t: string): number {
  const n = s.length;
  const m = t.length;
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) {
    dp[i][0] = 1;
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }
  return dp[n][m];
}`,
  python: `def numDistinct(s: str, t: str) -> int:
    len_s = len(s)
    len_t = len(t)
    dp = [[0] * (len_t + 1) for _ in range(len_s + 1)]
    for i in range(len_s + 1): 
        dp[i][0] = 1
    for i in range(1, len_s + 1):
        for j in range(1, len_t + 1):
            if s[i - 1] == t[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j]
            else:
                dp[i][j] = dp[i - 1][j]
    return dp[len_s][len_t]`,
  java: `public static class Solution {
    public int numDistinct(String s, String t) {
        int n = s.length();
        int m = t.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 0; i <= n; i++) {
            dp[i][0] = 1;
        }
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (s.charAt(i - 1) == t.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }
        return dp[n][m];
    }
}`,
  cpp: `class Solution {
public:
    int numDistinct(string s, string t) {
        int n = s.length();
        int m = t.length();
        vector<vector<double>> dp(m + 1, vector<double>(n + 1, 0));
        for (int j = 0; j <= n; ++j) {
            dp[0][j] = 1;
        }
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (t[i - 1] == s[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + dp[i][j - 1];
                } else {
                    dp[i][j] = dp[i][j - 1];
                }
            }
        }
        return (int)dp[m][n];
    }
};`
};

export const DistinctSubsequencesVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const sWord = "babgbag";
  const tWord = "bag";

  const { steps, stepLineNumbers } = useMemo(() => {
    const s = sWord;
    const t = tWord;
    const n = s.length;
    const m = t.length;

    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const addStep = (
      i: number,
      j: number,
      message: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        dp: dp.map((row) => [...row]),
        s,
        t,
        i,
        j,
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
      -1, -1,
      `Welcome! We want to find how many ways we can form the short word "${t}" by picking letters from the long word "${s}".`,
      `numDistinct(s="${s}", t="${t}")`,
      { s: `"${s}"`, t: `"${t}"` },
      1, 1, 2, 3
    );

    addStep(
      -1, -1,
      `Initialize DP grid of size (len(s)+1) x (len(t)+1). dp[i][j] holds subsequences of s[:i] matching t[:j].`,
      "SET dp = [[0]*(len_t + 1) for _ in range(len_s + 1)]",
      { n, m },
      4, 4, 5, 6
    );

    for (let i = 0; i <= n; i++) {
      dp[i][0] = 1;
    }
    
    addStep(
      -1, 0,
      `Base case: To form an empty string (column 0), there is exactly 1 way: just pick 0 letters! So we fill the first column with 1s.`,
      "FOR i FROM 0 TO n  →  dp[i][0] = 1",
      { dp: JSON.stringify(dp) },
      5, 5, 6, 7
    );

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const sChar = s[i - 1];
        const tChar = t[j - 1];

        addStep(
          i, j,
          `Looking at row ${i} (letter '${sChar}') and col ${j} (letter '${tChar}'). Do they match?`,
          `IF s[i-1] == t[j-1]  →  '${sChar}' == '${tChar}'`,
          { i, j, sChar, tChar },
          10, 9, 11, 12
        );

        if (sChar === tChar) {
          dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
          addStep(
            i, j,
            `Match! '${sChar}' === '${tChar}'. We can either use this letter (ways from diagonal ↖: ${dp[i - 1][j - 1]}) or NOT use it (ways from above ↑: ${dp[i - 1][j]}). Total ways = ${dp[i][j]}.`,
            `dp[i][j] = dp[i-1][j-1] + dp[i-1][j]  →  ${dp[i][j]}`,
            { i, j, diagonal: dp[i - 1][j - 1], above: dp[i - 1][j], total: dp[i][j] },
            11, 10, 12, 13
          );
        } else {
          dp[i][j] = dp[i - 1][j];
          addStep(
            i, j,
            `No match! '${sChar}' !== '${tChar}'. We can't use this letter. So we just bring down the ways from the box above ↑: ${dp[i][j]}.`,
            `dp[i][j] = dp[i-1][j]  →  ${dp[i][j]}`,
            { i, j, above: dp[i - 1][j], total: dp[i][j] },
            13, 12, 14, 15
          );
        }
      }
    }

    addStep(
      n, m,
      `All done! The number in the very last box tells us there are ${dp[n][m]} ways to form "${t}" from "${s}".`,
      `RETURN dp[n][m]  →  ${dp[n][m]}`,
      { result: dp[n][m] },
      17, 13, 18, 19
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [sWord, tWord]);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="bg-card rounded-lg p-6 border shadow-sm w-full overflow-hidden">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-center">Distinct Subsequences DP Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="border border-border p-2 bg-muted text-muted-foreground font-normal">
                      s \ t
                    </th>
                    <th className="border border-border p-2 bg-muted text-center text-muted-foreground">
                      ∅
                      <div className="text-[10px] font-normal">0</div>
                    </th>
                    {step.t.split("").map((char, idx) => (
                      <th key={idx} className="border border-border p-2 bg-muted text-center font-mono">
                        {char}
                        <div className="text-[10px] text-muted-foreground font-normal">{idx + 1}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {step.dp.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-border p-2 bg-muted font-semibold text-center font-mono">
                        {i === 0 ? "∅" : step.s[i - 1]}
                        <div className="text-[10px] text-muted-foreground font-normal">{i}</div>
                      </td>
                      {row.map((val, j) => {
                        const isCurrent = i === step.i && j === step.j;
                        let isDependency = false;
                        if (step.i === i && step.j === j) {
                            // Current cell
                        } else if (step.i !== -1 && step.j !== -1) {
                           if (step.i > 0 && step.j > 0) {
                              const currSChar = step.s[step.i - 1];
                              const currTChar = step.t[step.j - 1];
                              if (currSChar === currTChar) {
                                  if (i === step.i - 1 && (j === step.j - 1 || j === step.j)) {
                                      isDependency = true;
                                  }
                              } else {
                                  if (i === step.i - 1 && j === step.j) {
                                      isDependency = true;
                                  }
                              }
                           }
                        }

                        return (
                          <td
                            key={j}
                            className={`border border-border p-2 text-center transition-all min-w-[40px] ${
                              isCurrent
                                ? "bg-primary/20 ring-2 ring-primary ring-inset font-bold text-primary"
                                : isDependency
                                ? "bg-primary/10 text-primary border-primary animate-pulse"
                                : val > 0
                                ? "bg-green-500/10 text-green-700 dark:text-green-400 font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {step.message}
            </p>
          </Card>

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
          <VariablePanel
            variables={{
              "long word (s)": step.s,
              "short word (t)": step.t,
              "row index (i)": step.i >= 0 ? step.i : "-",
              "col index (j)": step.j >= 0 ? step.j : "-",
              "current s char": step.i > 0 ? step.s[step.i - 1] : "-",
              "current t char": step.j > 0 ? step.t[step.j - 1] : "-",
            }}
          />
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
export default DistinctSubsequencesVisualization;
