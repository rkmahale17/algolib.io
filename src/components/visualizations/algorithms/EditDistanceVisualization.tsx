import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  dp: number[][];
  i: number;
  j: number;
  word1: string;
  word2: string;
  operation: string;
  message: string;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;
  const cache: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(Infinity)
  );
  for (let j = 0; j <= n; j++) {
    cache[m][j] = n - j;
  }
  for (let i = 0; i <= m; i++) {
    cache[i][n] = m - i;
  }
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (word1[i] === word2[j]) {
        cache[i][j] = cache[i + 1][j + 1];
      } else {
        cache[i][j] =
          1 +
          Math.min(
            cache[i + 1][j],
            cache[i][j + 1],
            cache[i + 1][j + 1]
          );
      }
    }
  }
  return cache[0][0];
}`,

  python: `def minDistance(word1: str, word2: str) -> int:
  m = len(word1)
  n = len(word2)
  cache = [[float('inf')] * (n + 1) for _ in range(m + 1)]
  for j in range(n + 1):
    cache[m][j] = n - j
  for i in range(m + 1):
    cache[i][n] = m - i
  for i in range(m - 1, -1, -1):
    for j in range(n - 1, -1, -1):
      if word1[i] == word2[j]:
        cache[i][j] = cache[i + 1][j + 1]
      else:
        cache[i][j] = 1 + min(
          cache[i + 1][j],
          cache[i][j + 1],
          cache[i + 1][j + 1]
        )
  return cache[0][0]`,

  java: `public static class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[][] cache = new int[m + 1][n + 1];
        for (int j = 0; j <= n; j++) {
            cache[m][j] = n - j;
        }
        for (int i = 0; i <= m; i++) {
            cache[i][n] = m - i;
        }
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                if (word1.charAt(i) == word2.charAt(j)) {
                    cache[i][j] = cache[i + 1][j + 1];
                } else {
                    cache[i][j] = 1 + Math.min(
                        cache[i + 1][j],
                        Math.min(cache[i][j + 1], cache[i + 1][j + 1])
                    );
                }
            }
        }
        return cache[0][0];
    }
}`,

  cpp: `class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length(), n = word2.length();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1));
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = min({
                        dp[i - 1][j],
                        dp[i][j - 1],
                        dp[i - 1][j - 1]
                    }) + 1;
                }
            }
        }
        return dp[m][n];
    }
};`
};

function generateVisualizationData() {
  const word1 = 'horse';
  const word2 = 'ros';
  const m = word1.length;
  const n = word2.length;

  const cache = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const steps: Step[] = [];
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

  // Base cases
  for (let j = 0; j <= n; j++) {
    cache[m][j] = n - j;
  }
  steps.push({
    dp: cache.map((row) => [...row]),
    i: m,
    j: -1,
    word1,
    word2,
    operation: 'init',
    message: 'Base case: if first word is empty, we must insert all remaining characters.',
    explanation: 'Initialize the base case where word1 is empty (index m). The edit distance is the number of characters in word2 to insert.',
    pseudoStep: 'SET cache[m][j] = n - j (Insertions)',
  });
  addLines(7, 5, 6, 7);

  for (let i = 0; i <= m; i++) {
    cache[i][n] = m - i;
  }
  steps.push({
    dp: cache.map((row) => [...row]),
    i: -1,
    j: n,
    word1,
    word2,
    operation: 'init',
    message: 'Base case: if second word is empty, we must delete all remaining characters.',
    explanation: 'Initialize the base case where word2 is empty (index n). The edit distance is the number of characters in word1 to delete.',
    pseudoStep: 'SET cache[i][n] = m - i (Deletions)',
  });
  addLines(10, 7, 9, 6);

  // Main DP
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      // Comparison Step
      steps.push({
        dp: cache.map((row) => [...row]),
        i,
        j,
        word1,
        word2,
        operation: 'compare',
        message: `Comparing: word1[${i}] ('${word1[i]}') and word2[${j}] ('${word2[j]}')`,
        explanation: `Compare character '${word1[i]}' at index ${i} with '${word2[j]}' at index ${j}.`,
        pseudoStep: `IF word1[${i}] == word2[${j}] → '${word1[i]}' == '${word2[j]}'?`,
      });
      addLines(15, 11, 14, 10);

      if (word1[i] === word2[j]) {
        cache[i][j] = cache[i + 1][j + 1];
        steps.push({
          dp: cache.map((row) => [...row]),
          i,
          j,
          word1,
          word2,
          operation: 'match',
          message: `Match! '${word1[i]}' === '${word2[j]}'. dp[${i}][${j}] = dp[${i + 1}][${j + 1}] = ${cache[i][j]}`,
          explanation: `Characters match! No operation needed. Inherit the edit distance from diagonal subproblem.`,
          pseudoStep: `SET cache[${i}][${j}] = cache[${i + 1}][${j + 1}]`,
        });
        addLines(16, 12, 15, 11);
      } else {
        const deleteOp = cache[i + 1][j];
        const insertOp = cache[i][j + 1];
        const replaceOp = cache[i + 1][j + 1];
        cache[i][j] = 1 + Math.min(deleteOp, insertOp, replaceOp);

        const minOp = Math.min(deleteOp, insertOp, replaceOp);
        const opName = minOp === deleteOp ? 'delete' : minOp === insertOp ? 'insert' : 'replace';

        steps.push({
          dp: cache.map((row) => [...row]),
          i,
          j,
          word1,
          word2,
          operation: opName,
          message: `'${word1[i]}' !== '${word2[j]}'. Min(del=${deleteOp}, ins=${insertOp}, rep=${replaceOp}) + 1 = ${cache[i][j]}`,
          explanation: `Mismatch! Take the minimum of Delete (${deleteOp}), Insert (${insertOp}), or Replace (${replaceOp}) and add 1 operation cost. Chosen: ${opName.toUpperCase()}.`,
          pseudoStep: `SET cache[${i}][${j}] = 1 + MIN(Delete, Insert, Replace)`,
        });
        addLines(18, 14, 17, 12);
      }
    }
  }

  // Complete Step
  steps.push({
    dp: cache.map((row) => [...row]),
    i: 0,
    j: 0,
    word1,
    word2,
    operation: 'complete',
    message: `Minimum edit distance calculated: ${cache[0][0]}`,
    explanation: `Edit distance calculation complete. The minimum distance to transform '${word1}' to '${word2}' is stored at cache[0][0], which is ${cache[0][0]}.`,
    pseudoStep: 'RETURN cache[0][0]',
  });
  addLines(28, 19, 23, 20);

  return { steps, stepLineNumbers };
}

export const EditDistanceVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <div className="w-full space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual State */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm overflow-x-auto">
            <h3 className="text-sm font-semibold mb-4 text-center text-foreground font-sans">
              Edit Distance DP Table
            </h3>
            <div className="inline-block min-w-full">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border p-2 bg-muted/50 w-8 text-muted-foreground font-mono"></th>
                    {currentStep.word2.split('').map((char, idx) => (
                      <th key={idx} className="border border-border p-2 bg-muted w-8 text-center font-mono text-muted-foreground">
                        {char}
                        <div className="text-[10px] opacity-60 font-normal">{idx}</div>
                      </th>
                    ))}
                    <th className="border border-border p-2 bg-muted w-8 text-center text-muted-foreground font-mono">
                      ∅
                      <div className="text-[10px] opacity-60 font-normal">{currentStep.word2.length}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentStep.dp.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="border border-border p-2 bg-muted font-semibold text-center w-8 font-mono text-foreground">
                        {rIdx < currentStep.word1.length ? (
                          <>
                            {currentStep.word1[rIdx]}
                            <div className="text-[10px] text-muted-foreground font-normal">{rIdx}</div>
                          </>
                        ) : (
                          '∅'
                        )}
                      </td>
                      {row.map((val, cIdx) => {
                        const isCurrent = rIdx === currentStep.i && cIdx === currentStep.j;
                        const isInit = currentStep.operation === 'init';
                        
                        let cellClass = 'text-muted-foreground/30';
                        if (isCurrent) {
                          cellClass = 'bg-primary/20 ring-2 ring-primary ring-inset font-bold text-primary scale-105';
                        } else if (val !== Infinity && val >= 0) {
                          cellClass = isInit ? 'bg-muted/40 text-foreground/75' : 'bg-green-500/5 text-green-600 dark:text-green-400';
                        }

                        return (
                          <td
                            key={cIdx}
                            className={`border border-border p-2 text-center transition-all duration-300 w-8 h-8 text-[10px] ${cellClass}`}
                          >
                            {val === Infinity ? '∞' : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commentary Panel */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {currentStep.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Code Display and Variables */}
        <div className="lg:col-span-5 space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel
            variables={{
              i: currentStep.i !== -1 ? currentStep.i : 'done',
              j: currentStep.j !== -1 ? currentStep.j : 'done',
              operation: currentStep.operation,
              'word1[i]': currentStep.i >= 0 && currentStep.i < currentStep.word1.length ? currentStep.word1[currentStep.i] : '-',
              'word2[j]': currentStep.j >= 0 && currentStep.j < currentStep.word2.length ? currentStep.word2[currentStep.j] : '-',
              ans: currentStep.dp[0][0]
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditDistanceVisualization;
