import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  s: string;
  dp: boolean[];
  i: number;
  j: number;
  currentSubstring: string;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function wordBreak(s: string, wordDict: string[]): boolean {
  const wordSet = new Set(wordDict);
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n];
}`,
  python: `def wordBreak(s: str, wordDict: List[str]) -> bool:
    word_set = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[n]`,
  java: `public static class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }
}`,
  cpp: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.length();
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.count(s.substr(j, i - j))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }
};`
};

export const WordBreakVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const s = "leetcode";
  const wordDict = ["leet", "code"];

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const n = s.length;
    const wordSet = new Set(wordDict);
    const dp = new Array(n + 1).fill(false);
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

    // 1. Initial State / Setup
    stepsList.push({
      s,
      dp: [...dp],
      i: 0,
      j: -1,
      currentSubstring: '',
      variables: { s: `"${s}"`, wordDict: `["${wordDict.join('", "')}"]` },
      explanation: "Initialize the word set for fast lookups and get the input string length.",
      pseudoStep: "SET wordSet = Set(wordDict), n = s.length"
    });
    addLines(2, 2, 3, 4);

    // 2. DP Array Initialization
    dp[0] = true;
    stepsList.push({
      s,
      dp: [...dp],
      i: 0,
      j: -1,
      currentSubstring: '',
      variables: { n, dp: '[true, false, ...]', 'dp[0]': true },
      explanation: "Initialize DP array of size n + 1. dp[0] = true since an empty string is always valid.",
      pseudoStep: "SET dp[0] = true"
    });
    addLines(5, 5, 6, 7);

    // 3. Loops
    for (let i = 1; i <= n; i++) {
      stepsList.push({
        s,
        dp: [...dp],
        i,
        j: -1,
        currentSubstring: '',
        variables: { n, i },
        explanation: `Outer loop: Checking prefix of length i = ${i}. We analyze substring up to index ${i}.`,
        pseudoStep: `FOR i = 1 TO n (i = ${i})`
      });
      addLines(6, 6, 7, 8);

      for (let j = 0; j < i; j++) {
        const sub = s.substring(j, i);
        const dpVal = dp[j];
        const inDict = wordSet.has(sub);

        stepsList.push({
          s,
          dp: [...dp],
          i,
          j,
          currentSubstring: sub,
          variables: { i, j, substring: `"${sub}"`, 'dp[j]': dpVal },
          explanation: `Inner loop split position j = ${j}. Is prefix s[0..j-1] segmentable? (dp[${j}] = ${dpVal}). We extract candidate suffix: "${sub}".`,
          pseudoStep: `FOR j = 0 TO i-1 (j = ${j})`
        });
        addLines(7, 7, 8, 9);

        stepsList.push({
          s,
          dp: [...dp],
          i,
          j,
          currentSubstring: sub,
          variables: { i, j, substring: `"${sub}"`, 'dp[j]': dpVal, inDict },
          explanation: `Check condition: Is dp[${j}] true AND is "${sub}" in the dictionary? dp[${j}] && wordSet.has("${sub}") → ${dpVal} && ${inDict} → ${dpVal && inDict ? "YES ✓" : "NO ✗"}`,
          pseudoStep: `IF dp[j] AND wordSet.has(s[j..i-1])`
        });
        addLines(8, 8, 9, 10);

        if (dpVal && inDict) {
          dp[i] = true;
          stepsList.push({
            s,
            dp: [...dp],
            i,
            j,
            currentSubstring: sub,
            variables: { i, j, substring: `"${sub}"`, 'dp[i]': true },
            explanation: `Condition met! dp[${j}] is true and "${sub}" exists in dictionary. This means the prefix s[0..${i}-1] can be segmented. Set dp[${i}] = true.`,
            pseudoStep: `SET dp[i] = true, BREAK`
          });
          addLines(9, 9, 10, 11);
          break;
        }
      }
    }

    // 4. Return Statement
    stepsList.push({
      s,
      dp: [...dp],
      i: n,
      j: -1,
      currentSubstring: '',
      variables: { result: dp[n] },
      explanation: `All subproblems solved. Return dp[${n}] = ${dp[n]}.`,
      pseudoStep: `RETURN dp[n] (${dp[n]})`
    });
    addLines(14, 11, 15, 16);

    return { steps: stepsList, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden">
              <div className="p-3 bg-muted/40 rounded text-sm text-foreground mb-4">
                <span className="font-semibold">Dictionary:</span> [{wordDict.map(w => `"${w}"`).join(', ')}]
              </div>

              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                Input String (s = "{s}")
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {s.split('').map((char, idx) => {
                  let charBoxClass = "bg-muted/30 border-border text-foreground";
                  const isCurrentRange = step.j !== -1 && idx >= step.j && idx < step.i;
                  const isProcessed = idx < step.i;

                  if (isCurrentRange) {
                    charBoxClass = "bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400 font-bold scale-105 shadow-md";
                  } else if (isProcessed) {
                    charBoxClass = "bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400";
                  }

                  return (
                    <div
                      key={idx}
                      className={`w-9 h-9 flex flex-col items-center justify-center font-bold border-2 rounded-lg transition-all duration-200 ${charBoxClass}`}
                    >
                      <span className="text-sm">{char}</span>
                    </div>
                  );
                })}
              </div>

              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                DP Array (Prefix of length i is segmentable)
              </h3>
              <div className="flex gap-2.5 overflow-x-auto pb-4 pt-1">
                {step.dp.map((val, idx) => {
                  const isI = idx === step.i && step.i !== -1;
                  const isJ = idx === step.j && step.j !== -1;

                  let dpBoxClass = val
                    ? 'bg-green-500/10 border-green-500/40 text-green-600 dark:text-green-400'
                    : 'bg-muted/30 border-border text-muted-foreground/60';

                  if (isI) {
                    dpBoxClass = 'bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-400 font-bold scale-105 shadow-md';
                  } else if (isJ) {
                    dpBoxClass = 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400 font-bold scale-105 shadow-md';
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div
                        className={`w-9 h-9 flex items-center justify-center font-bold text-xs border-2 rounded-lg transition-all duration-200 ${dpBoxClass}`}
                      >
                        {val ? 'T' : 'F'}
                      </div>
                      <span className={`text-[10px] font-mono ${isI ? 'text-orange-500 font-bold' : isJ ? 'text-blue-500 font-bold' : 'text-muted-foreground/60'}`}>
                        i = {idx}
                      </span>
                    </div>
                  );
                })}
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

            <VariablePanel variables={step.variables} />

            <Card className="p-4 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">
                Why this works
              </h4>
              <p>
                `dp[i]` is true if the prefix of length `i` (`s[0...i-1]`) can be segmented.
              </p>
              <p>
                To check this, we look at all split points `j` from 0 to `i - 1`. If `dp[j]` is true (prefix `s[0...j-1]` is valid) and the suffix `s[j...i-1]` is in the dictionary, then `dp[i]` is set to true.
              </p>
              <p>
                If we find any valid segmentation, we break early to optimize.
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

export default WordBreakVisualization;