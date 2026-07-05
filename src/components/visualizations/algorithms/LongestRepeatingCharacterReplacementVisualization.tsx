import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  l: number;
  r: number;
  maxf: number;
  res: number;
  count: Record<string, number>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  python: `def characterReplacement(s: str, k: int) -> int:
    count = {}
    res = 0
    l = 0
    maxf = 0
    for r in range(len(s)):
        count[s[r]] = 1 + count.get(s[r], 0)
        maxf = max(maxf, count[s[r]])
        while (r - l + 1) - maxf > k:
            count[s[l]] -= 1
            l += 1
        res = max(res, r - l + 1)
    return res`,

  typescript: `function characterReplacement(s: string, k: number): number {
  const count: { [char: string]: number } = {};
  let res = 0;
  let l = 0;
  let maxf = 0;
  for (let r = 0; r < s.length; r++) {
    count[s[r]] = 1 + (count[s[r]] || 0);
    maxf = Math.max(maxf, count[s[r]]);
    while ((r - l + 1) - maxf > k) {
      count[s[l]] -= 1;
      l += 1;
    }
    res = Math.max(res, r - l + 1);
  }
  return res;
}`,

  java: `public class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int res = 0;
        int l = 0;
        int maxf = 0;
        for (int r = 0; r < s.length(); r++) {
            count[s.charAt(r) - 'A']++;
            maxf = Math.max(maxf, count[s.charAt(r) - 'A']);
            while ((r - l + 1) - maxf > k) {
                count[s.charAt(l) - 'A']--;
                l++;
            }
            res = Math.max(res, r - l + 1);
        }
        return res;
    }
}`,

  cpp: `class Solution {
public:
    int characterReplacement(string s, int k) {
        unordered_map<char, int> count;
        int res = 0;
        int l = 0;
        int maxf = 0;
        for (int r = 0; r < s.length(); r++) {
            char currentChar = s[r];
            count[currentChar]++;
            maxf = max(maxf, count[currentChar]);
            while ((r - l + 1) - maxf > k) {
                count[s[l]]--;
                l += 1;
            }
            res = max(res, r - l + 1);
        }
        return res;
    }
};`
};

const generateVisualizationData = () => {
  const s = "AABABBA";
  const k = 1;
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

  const count: Record<string, number> = {};
  let res = 0;
  let l = 0;
  let maxf = 0;

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number) => {
    steps.push({
      l,
      r: steps.length === 0 ? -1 : r,
      maxf,
      res,
      count: { ...count },
      explanation: msg,
      pseudoStep: pseudo
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  addStep("Initialize variables: l = 0, res = 0, count = {}, maxf = 0.", "CALL characterReplacement(s, k)", 2, 2, 3, 4);

  let r = 0;
  for (r = 0; r < s.length; r++) {
    // 2. Loop start
    addStep(`Increment right pointer r to ${r}. Character at s[${r}] is '${s[r]}'.`, `FOR r = ${r}`, 6, 6, 7, 8);

    // 3. Increment frequency
    count[s[r]] = (count[s[r]] || 0) + 1;
    addStep(`Increment frequency of '${s[r]}'. count['${s[r]}'] becomes ${count[s[r]]}.`, `SET count[s[r]] = count[s[r]] + 1`, 7, 7, 8, 10);

    // 4. Update maxf
    maxf = Math.max(maxf, count[s[r]]);
    addStep(`Update maxf to max(maxf, count['${s[r]}']) = ${maxf}.`, `SET maxf = max(maxf, count[s[r]])`, 8, 8, 9, 11);

    // 5. Shrink window loop check
    while ((r - l + 1) - maxf > k) {
      addStep(`Window size (${r - l + 1}) - maxf (${maxf}) = ${(r - l + 1) - maxf} > k (${k}). Window is invalid, need to shrink.`, `WHILE (r - l + 1) - maxf > k`, 9, 9, 10, 12);

      // Decrement count
      count[s[l]] -= 1;
      if (count[s[l]] === 0) delete count[s[l]];
      addStep(`Decrement count of leftmost character s[${l}] ('${s[l]}').`, `SET count[s[l]] = count[s[l]] - 1`, 10, 10, 11, 13);

      // Increment l
      l += 1;
      addStep(`Move left pointer l to ${l}.`, `SET l = l + 1`, 11, 11, 12, 14);
    }
    // Check loop finished
    addStep(`Window size (${r - l + 1}) - maxf (${maxf}) = ${(r - l + 1) - maxf} <= k (${k}). Window is valid.`, `WHILE (r - l + 1) - maxf > k → FALSE ✗`, 9, 9, 10, 12);

    // Update result
    res = Math.max(res, r - l + 1);
    addStep(`Update maximum length res = max(res, window size) = ${res}.`, `SET res = max(res, r - l + 1)`, 13, 12, 14, 16);
  }

  // Final return
  addStep(`Algorithm completed. Return the maximum length of repeating character substring: ${res}.`, `RETURN res`, 15, 13, 16, 18);

  return { steps, stepLineNumbers };
};

export const LongestRepeatingCharacterReplacementVisualization = () => {
  const s = "AABABBA";
  const k = 1;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateVisualizationData();
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
      leftContent={
        <div className="space-y-6">
          <Card className="p-6">
            <div>
              <h3 className="text-sm font-semibold mb-6 text-foreground">Input String: "{s}" (k={k})</h3>
              <div className="flex flex-wrap gap-4 py-12 items-center justify-center">
                {s.split('').map((char, idx) => {
                  const isInWindow = idx >= currentStep.l && idx <= currentStep.r;
                  const isLeft = idx === currentStep.l;
                  const isRight = idx === currentStep.r;
                  return (
                    <div key={idx} className="relative">
                      <motion.div
                        animate={{
                          backgroundColor: isInWindow ? 'rgba(132, 204, 22, 0.2)' : 'transparent',
                          borderColor: isInWindow ? '#84CC16' : '#e2e8f0',
                          scale: isInWindow ? 1.05 : 1,
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded border-2 font-mono font-bold text-foreground"
                      >
                        {char}
                      </motion.div>
                      {isLeft && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <div className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm">l</div>
                          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-blue-600"></div>
                        </div>
                      )}
                      {isRight && (
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-red-600"></div>
                          <div className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm">r</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Descriptive Commentary Box (at the bottom) */}
          <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
            <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Process Step
            </div>
            {currentStep.explanation}
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
          <VariablePanel
            variables={{
              l: currentStep.l,
              r: currentStep.r,
              maxf: currentStep.maxf,
              res: currentStep.res,
              ...(Object.keys(currentStep.count).length > 0 && { count: JSON.stringify(currentStep.count) })
            }}
          />
        </div>
      }
    />
  );
};
