import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Search, TextCursorInput } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  s: string;
  i: number;
  l: number;
  r: number;
  res: string;
  resLen: number;
  explanation: string;
  pseudoStep: string;
  phase: 'odd' | 'even' | 'init' | 'result';
}

const USE_CASES = [
  { name: "Mixed (babad)", id: "babad", s: "babad" },
  { name: "Even Result (cbbd)", id: "cbbd", s: "cbbd" }
];

const languages: VisualizationLanguageMap = {
  python: `def longestPalindrome(s: str) -> str:
    res = ""
    resLen = 0
    for i in range(len(s)):
        l = i
        r = i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > resLen:
                res = s[l:r+1]
                resLen = r - l + 1
            l -= 1
            r -= 1
        l = i
        r = i + 1
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > resLen:
                res = s[l:r+1]
                resLen = r - l + 1
            l -= 1
            r -= 1
    return res`,

  typescript: `function longestPalindrome(s: string): string {
  let res = "";
  let resLen = 0;
  for (let i = 0; i < s.length; i++) {
    let l = i;
    let r = i;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if ((r - l + 1) > resLen) {
        res = s.substring(l, r + 1);
        resLen = r - l + 1;
      }
      l--;
      r++;
    }
    l = i;
    r = i + 1;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if ((r - l + 1) > resLen) {
        res = s.substring(l, r + 1);
        resLen = r - l + 1;
      }
      l--;
      r++;
    }
  }
  return res;
}`,

  java: `public class Solution {
    public String longestPalindrome(String s) {
        String res = "";
        int resLen = 0;
        for (int i = 0; i < s.length(); i++) {
            int l = i;
            int r = i;
            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
                if ((r - l + 1) > resLen) {
                    res = s.substring(l, r + 1);
                    resLen = r - l + 1;
                }
                l--;
                r++;
            }
            l = i;
            r = i + 1;
            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
                if ((r - l + 1) > resLen) {
                    res = s.substring(l, r + 1);
                    resLen = r - l + 1;
                }
                l--;
                r++;
            }
        }
        return res;
    }
}`,

  cpp: `class Solution {
public:
    int expandAroundCenter(string& s, int left, int right) {
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }

    string longestPalindrome(string s) {
        if (s.empty()) return "";
        int start = 0, maxLen = 0;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expandAroundCenter(s, i, i);
            int len2 = expandAroundCenter(s, i, i + 1);
            int len = max(len1, len2);
            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }
        return s.substr(start, maxLen);
    }
};`
};

const generateStepsData = (s: string) => {
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

  let res = "";
  let resLen = 0;

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
    steps.push({
      s,
      i: extra.hasOwnProperty('i') ? extra.i! : -1,
      l: extra.hasOwnProperty('l') ? extra.l! : -1,
      r: extra.hasOwnProperty('r') ? extra.r! : -1,
      res,
      resLen,
      phase: extra.phase || 'init',
      explanation: msg,
      pseudoStep: pseudo
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  addStep("Initialize max palindrome trackers: res = \"\" and resLen = 0.", "SET res = \"\", resLen = 0", 2, 2, 3, 13);

  for (let i = 0; i < s.length; i++) {
    // 2. Loop start
    addStep(`Iteration i = ${i}: Evaluate palindromes centered around index ${i} ('${s[i]}').`, `FOR i = ${i} TO len(s) - 1`, 4, 4, 5, 14, { i, phase: 'odd' });

    // 3. Odd expansion init
    let l1 = i;
    let r1 = i;
    addStep("Initialize pointers for odd-length palindrome center.", `SET l = ${i}, r = ${i}`, 5, 5, 6, 15, { i, l: l1, r: r1, phase: 'odd' });

    while (l1 >= 0 && r1 < s.length && s[l1] === s[r1]) {
      addStep(`Condition check: match at s[${l1}] ('${s[l1]}') and s[${r1}] ('${s[r1]}').`, "WHILE l >= 0 AND r < len(s) AND s[l] == s[r]", 7, 7, 8, 4, { i, l: l1, r: r1, phase: 'odd' });

      const currentLen = r1 - l1 + 1;
      const improved = currentLen > resLen;
      addStep(`Evaluate palindrome length: ${currentLen} vs max seen: ${resLen}.`, `IF ${currentLen} > ${resLen}`, 8, 8, 9, 18, { i, l: l1, r: r1, phase: 'odd' });

      if (improved) {
        res = s.substring(l1, r1 + 1);
        resLen = currentLen;
        addStep(`New longest palindrome found! Update res = "${res}", resLen = ${resLen}.`, `SET res = "${res}", resLen = ${resLen}`, 10, 10, 11, 19, { i, l: l1, r: r1, phase: 'odd' });
      }

      l1--;
      r1++;
      addStep(`Expand pointers outwards. l = ${l1}, r = ${r1}.`, "SET l = l - 1, r = r + 1", 12, 11, 13, 5, { i, l: l1, r: r1, phase: 'odd' });
    }

    addStep(`Odd expansion complete for center ${i}.`, "WHILE l >= 0 AND r < len(s) AND s[l] == s[r] → FALSE ✗", 7, 7, 8, 4, { i, l: l1, r: r1, phase: 'odd' });

    // 4. Even expansion init
    let l2 = i;
    let r2 = i + 1;
    addStep(`Initialize pointers for even-length palindrome center between index ${i} and ${i + 1}.`, `SET l = ${i}, r = ${i + 1}`, 15, 13, 16, 16, { i, l: l2, r: r2, phase: 'even' });

    while (l2 >= 0 && r2 < s.length && s[l2] === s[r2]) {
      addStep(`Condition check: match at s[${l2}] ('${s[l2]}') and s[${r2}] ('${s[r2]}').`, "WHILE l >= 0 AND r < len(s) AND s[l] == s[r]", 17, 15, 18, 4, { i, l: l2, r: r2, phase: 'even' });

      const currentLen = r2 - l2 + 1;
      const improved = currentLen > resLen;
      addStep(`Evaluate palindrome length: ${currentLen} vs max seen: ${resLen}.`, `IF ${currentLen} > ${resLen}`, 18, 16, 19, 18, { i, l: l2, r: r2, phase: 'even' });

      if (improved) {
        res = s.substring(l2, r2 + 1);
        resLen = currentLen;
        addStep(`New longest palindrome found! Update res = "${res}", resLen = ${resLen}.`, `SET res = "${res}", resLen = ${resLen}`, 19, 17, 20, 19, { i, l: l2, r: r2, phase: 'even' });
      }

      l2--;
      r2++;
      addStep(`Expand pointers outwards. l = ${l2}, r = ${r2}.`, "SET l = l - 1, r = r + 1", 22, 19, 23, 5, { i, l: l2, r: r2, phase: 'even' });
    }

    addStep(`Even expansion complete for center ${i}.`, "WHILE l >= 0 AND r < len(s) AND s[l] == s[r] → FALSE ✗", 17, 15, 18, 4, { i, l: l2, r: r2, phase: 'even' });
  }

  addStep(`Finished evaluation. Return longest palindromic substring: "${res}".`, `RETURN res → "${res}"`, 26, 21, 27, 23, { phase: 'result' });

  return { steps, stepLineNumbers };
};

export const LongestPalindromicSubstringVisualization = () => {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const activeCase = USE_CASES[activeCaseIdx];

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateStepsData(activeCase.s);
  }, [activeCase]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const handleCaseChange = (idx: number) => {
    setActiveCaseIdx(idx);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Case selections / Controls at Top */}
      <div className="flex flex-col gap-4 bg-card p-6 rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="flex p-0.5 bg-muted rounded-lg border border-border w-fit shadow-inner">
          <button
            onClick={() => handleCaseChange(0)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              activeCaseIdx === 0 
              ? 'bg-background text-foreground border border-border/50 shadow-sm font-bold' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            Mixed (babad)
          </button>
          <button
            onClick={() => handleCaseChange(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              activeCaseIdx === 1 
              ? 'bg-background text-foreground border border-border/50 shadow-sm font-bold' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TextCursorInput className="h-3.5 w-3.5" />
            Even Result (cbbd)
          </button>
        </div>
        <div className="w-full pt-4 border-t border-border">
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
        </div>
      </div>

      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">String Inspection</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    currentStep.phase === 'odd' ? 'bg-blue-500/10 text-blue-500' :
                    currentStep.phase === 'even' ? 'bg-purple-500/10 text-purple-500' :
                    currentStep.phase === 'result' ? 'bg-green-500/10 text-green-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep.phase} mode
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentStep.s.split('').map((char, idx) => {
                    const isCenter = idx === currentStep.i;
                    const isExpanding = currentStep.l >= 0 && idx >= currentStep.l && idx <= currentStep.r;
                    const isResult = currentStep.phase === 'result' && currentStep.res.includes(char) && 
                                     idx >= currentStep.s.indexOf(currentStep.res) && 
                                     idx < currentStep.s.indexOf(currentStep.res) + currentStep.res.length;

                    return (
                      <div
                        key={idx}
                        className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-lg border-2 transition-all duration-200 ${
                          isCenter
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.3)] font-bold scale-105'
                          : isExpanding
                            ? 'bg-primary/20 border-primary text-primary font-bold scale-105 shadow-sm'
                            : isResult
                              ? 'bg-green-500/20 border-green-500 text-green-600 shadow-[0_0_10px_rgba(34,197,94,0.3)] font-bold scale-105'
                              : 'bg-card border-border text-foreground'
                        }`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              </div>

              {currentStep.phase === 'result' && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center gap-3 mb-4 font-bold">
                  <span className="text-base font-bold">Result: "{currentStep.res}"</span>
                </div>
              )}
            </Card>

            {/* Descriptive Commentary Box (at the bottom) */}
            <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
              <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Process Step
              </div>
              {currentStep.explanation}
            </div>

            {/* Variable Panel (below the commentary box) */}
            <div className="pt-2">
              <VariablePanel
                variables={{
                  index_i: currentStep.i === -1 ? 'N/A' : currentStep.i,
                  left: currentStep.l === -1 ? 'None' : currentStep.l,
                  right: currentStep.r === -1 ? 'None' : currentStep.r,
                  longest: currentStep.res || '""',
                  maxLen: currentStep.resLen
                }}
              />
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
      />
    </div>
  );
};
