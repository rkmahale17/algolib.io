import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  dp: number[][];
  i: number;
  j: number;
  text1: string;
  text2: string;
  message: string;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (text1[i] === text2[j]) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i][j + 1], dp[i + 1][j]);
      }
    }
  }
  return dp[0][0];
}`,
  python: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    m = len(text1)
    n = len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            if text1[i] == text2[j]:
                dp[i][j] = 1 + dp[i + 1][j + 1]
            else:
                dp[i][j] = max(dp[i][j + 1], dp[i + 1][j])
    return dp[0][0]`,
  java: `public static class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]);
                }
            }
        }
        return dp[m][n];
    }
}`,
  cpp: `class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.length(), n = text2.length();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
};`
};

export const LCSVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const text1 = 'abcde';
    const text2 = 'ace';
    const m = text1.length;
    const n = text2.length;

    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const s: Step[] = [];
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

    // Step 1: Initialization
    s.push({
      dp: dp.map((row) => [...row]),
      i: -1,
      j: -1,
      text1,
      text2,
      message: 'Initialize DP table with 0s.',
      explanation: 'Initialize a 2D array dp of size (m+1) x (n+1) with all values set to 0. dp[i][j] will store the LCS of text1[i:] and text2[j:].',
      pseudoStep: 'SET dp = [m+1][n+1] matrix of 0s',
    });
    addLines(3, 4, 5, 5);

    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        // Comparison Step
        s.push({
          dp: dp.map((row) => [...row]),
          i,
          j,
          text1,
          text2,
          message: `Checking: text1[${i}] ('${text1[i]}') and text2[${j}] ('${text2[j]}')`,
          explanation: `Compare character '${text1[i]}' at text1[${i}] with '${text2[j]}' at text2[${j}].`,
          pseudoStep: `IF text1[${i}] == text2[${j}] → '${text1[i]}' == '${text2[j]}'?`,
        });
        addLines(8, 7, 8, 8);

        if (text1[i] === text2[j]) {
          dp[i][j] = 1 + dp[i + 1][j + 1];
          s.push({
            dp: dp.map((row) => [...row]),
            i,
            j,
            text1,
            text2,
            message: `Match! dp[${i}][${j}] = 1 + dp[${i + 1}][${j + 1}] = ${dp[i][j]}`,
            explanation: `Characters match! Increment the LCS length by 1 from the diagonal neighbor dp[${i + 1}][${j + 1}].`,
            pseudoStep: `SET dp[${i}][${j}] = 1 + dp[${i + 1}][${j + 1}]`,
          });
          addLines(9, 8, 9, 9);
        } else {
          dp[i][j] = Math.max(dp[i][j + 1], dp[i + 1][j]);
          s.push({
            dp: dp.map((row) => [...row]),
            i,
            j,
            text1,
            text2,
            message: `No match. dp[${i}][${j}] = max(dp[${i}][${j + 1}], dp[${i + 1}][${j}]) = ${dp[i][j]}`,
            explanation: `Characters do not match. Take the maximum LCS length from either omitting text1[${i}] (dp[${i + 1}][${j}]) or text2[${j}] (dp[${i}][${j + 1}]).`,
            pseudoStep: `SET dp[${i}][${j}] = MAX(dp[${i}][${j + 1}], dp[${i + 1}][${j}])`,
          });
          addLines(11, 10, 11, 11);
        }
      }
    }

    // Final Step
    s.push({
      dp: dp.map((row) => [...row]),
      i: 0,
      j: 0,
      text1,
      text2,
      message: `Result: dp[0][0] = ${dp[0][0]}`,
      explanation: `The LCS computation is complete. The length of the longest common subsequence is stored in the top-left cell dp[0][0], which is ${dp[0][0]}.`,
      pseudoStep: 'RETURN dp[0][0]',
    });
    addLines(15, 11, 15, 15);

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 overflow-x-auto">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest text-center mb-4">
                LCS Table (Bottom-Up)
              </h3>
              <div className="inline-block min-w-full">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-border p-2 bg-muted/50 w-10 text-muted-foreground font-mono"></th>
                      {step.text2.split('').map((char, idx) => (
                        <th key={idx} className="border border-border p-2 bg-muted w-10 text-center font-mono text-muted-foreground">
                          {char}
                          <div className="text-[10px] opacity-60 font-normal">{idx}</div>
                        </th>
                      ))}
                      <th className="border border-border p-2 bg-muted w-10 text-center text-muted-foreground font-mono">
                        ∅
                        <div className="text-[10px] opacity-60 font-normal">{step.text2.length}</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {step.dp.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="border border-border p-2 bg-muted font-semibold text-center w-10 font-mono text-foreground">
                          {rowIdx < step.text1.length ? (
                            <>
                              {step.text1[rowIdx]}
                              <div className="text-[10px] text-muted-foreground font-normal">{rowIdx}</div>
                            </>
                          ) : (
                            '∅'
                          )}
                        </td>
                        {row.map((val, colIdx) => {
                          const isCurrent = rowIdx === step.i && colIdx === step.j;
                          const isDependency =
                            step.i !== -1 &&
                            ((rowIdx === step.i + 1 && colIdx === step.j + 1) ||
                              (rowIdx === step.i && colIdx === step.j + 1) ||
                              (rowIdx === step.i + 1 && colIdx === step.j));

                          let cellClass = 'text-muted-foreground/40';
                          if (isCurrent) {
                            cellClass = 'bg-primary/20 ring-2 ring-primary ring-inset font-bold text-primary scale-105';
                          } else if (isDependency) {
                            cellClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium';
                          } else if (val > 0) {
                            cellClass = 'bg-green-500/5 text-green-600 dark:text-green-400';
                          }

                          return (
                            <td
                              key={colIdx}
                              className={`border border-border p-2 text-center transition-all duration-300 w-10 h-10 ${cellClass}`}
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
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">
                {step.explanation}
              </p>
            </Card>

            <VariablePanel
              variables={{
                i: step.i !== -1 ? step.i : '-',
                j: step.j !== -1 ? step.j : '-',
                'text1[i]': step.i >= 0 && step.i < step.text1.length ? step.text1[step.i] : '-',
                'text2[j]': step.j >= 0 && step.j < step.text2.length ? step.text2[step.j] : '-',
                'dp[i][j]': step.i !== -1 ? step.dp[step.i][step.j] : step.dp[0][0]
              }}
            />

            <Card className="p-4 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">
                Why this works
              </h4>
              <p>
                LCS can be solved by comparing characters from the end of both strings.
              </p>
              <p>
                If characters match, the LCS length increases by 1 plus the LCS of the remaining suffixes: `1 + dp[i+1][j+1]`.
              </p>
              <p>
                If they mismatch, the LCS length is the maximum value found by either skipping `text1[i]` or `text2[j]`: `max(dp[i][j+1], dp[i+1][j])`.
              </p>
            </Card>
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

export default LCSVisualization;
