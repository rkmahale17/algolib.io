import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { ListFilter, Hash } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  s: string;
  i: number;
  l: number;
  r: number;
  totalRes: number;
  paliRes: number;
  explanation: string;
  pseudoStep: string;
  phase: 'odd' | 'even' | 'init' | 'result';
}

const languages: VisualizationLanguageMap = {
  python: `def countSubstrings(s: str) -> int:
    def countPali(s: str, l: int, r: int) -> int:
        res = 0
        while l >= 0 and r < len(s) and s[l] == s[r]:
            res += 1
            l -= 1
            r += 1
        return res
    res = 0
    for i in range(len(s)):
        res += countPali(s, i, i)
        res += countPali(s, i, i + 1)
    return res`,

  typescript: `function countSubstrings(s: string): number {
  let res = 0;
  for (let i = 0; i < s.length; i++) {
    res += countPali(s, i, i);
    res += countPali(s, i, i + 1);
  }
  return res;
}

function countPali(s: string, l: number, r: number): number {
  let res = 0;
  while (l >= 0 && r < s.length && s[l] === s[r]) {
    res++;
    l--;
    r++;
  }
  return res;
}`,

  java: `public class Solution {
    public int countSubstrings(String s) {
        int res = 0;
        for (int i = 0; i < s.length(); i++) {
            res += countPali(s, i, i);
            res += countPali(s, i, i + 1);
        }
        return res;
    }

    private int countPali(String s, int l, int r) {
        int res = 0;
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            res++;
            l--;
            r++;
        }
        return res;
    }
}`,

  cpp: `class Solution {
public:
    int expandAroundCenter(string& s, int left, int right) {
        int count = 0;
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            count++;
            left--;
            right++;
        }
        return count;
    }

    int countSubstrings(string s) {
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            count += expandAroundCenter(s, i, i);
            count += expandAroundCenter(s, i, i + 1);
        }
        return count;
    }
};`
};

const generateSteps = (s: string) => {
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

  let totalRes = 0;

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
    steps.push({
      s,
      i: extra.hasOwnProperty('i') ? extra.i! : -1,
      l: extra.hasOwnProperty('l') ? extra.l! : -1,
      r: extra.hasOwnProperty('r') ? extra.r! : -1,
      totalRes,
      paliRes: extra.paliRes ?? 0,
      phase: extra.phase || 'init',
      explanation: msg,
      pseudoStep: pseudo
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  addStep("Initialize total result counter res = 0.", "SET res = 0", 2, 9, 3, 14);

  for (let i = 0; i < s.length; i++) {
    // 2. Loop iteration start
    addStep(`Iteration i = ${i}: Consider character '${s[i]}' as center.`, `FOR i = ${i} TO len(s) - 1`, 3, 10, 4, 15, { i, phase: 'odd' });

    // 3. Odd palindrome expansion
    addStep(`Call countPali/expandAroundCenter to check odd-length palindromes centered at index ${i} ('${s[i]}').`, `CALL countPali(s, ${i}, ${i})`, 4, 11, 5, 16, { i, l: i, r: i, phase: 'odd' });

    let l1 = i;
    let r1 = i;
    let oddCount = 0;
    addStep(`[countPali] Initialize local palindrome count local_res = 0.`, `SET local_res = 0`, 11, 3, 12, 4, { i, l: l1, r: r1, phase: 'odd', paliRes: 0 });

    while (l1 >= 0 && r1 < s.length && s[l1] === s[r1]) {
      addStep(
        `[countPali] Check bounds and characters at l = ${l1} ('${s[l1]}') and r = ${r1} ('${s[r1]}'). Match found!`,
        `WHILE l >= 0 AND r < len(s) AND s[l] == s[r] → TRUE`,
        12, 4, 13, 5,
        { i, l: l1, r: r1, phase: 'odd', paliRes: oddCount }
      );

      oddCount++;
      addStep(
        `[countPali] Increment local palindrome count local_res = ${oddCount}.`,
        `SET local_res = local_res + 1`,
        13, 5, 14, 6,
        { i, l: l1, r: r1, phase: 'odd', paliRes: oddCount }
      );

      l1--;
      r1++;
      addStep(
        `[countPali] Expand pointers: decrement l to ${l1}, increment r to ${r1}.`,
        `SET l = l - 1, r = r + 1`,
        14, 6, 15, 7,
        { i, l: l1, r: r1, phase: 'odd', paliRes: oddCount }
      );
    }

    const conditionReason = l1 < 0 ? "left pointer out of bounds" : (r1 >= s.length ? "right pointer out of bounds" : `character mismatch: s[${l1}] ('${s[l1]}') !== s[${r1}] ('${s[r1]}')`);
    addStep(
      `[countPali] Check bounds and characters at l = ${l1}, r = ${r1}. Condition fails: ${conditionReason}.`,
      `WHILE l >= 0 AND r < len(s) AND s[l] == s[r] → FALSE`,
      12, 4, 13, 5,
      { i, l: l1, r: r1, phase: 'odd', paliRes: oddCount }
    );

    addStep(
      `[countPali] Return local palindrome count ${oddCount} to caller.`,
      `RETURN local_res → ${oddCount}`,
      17, 8, 18, 10,
      { i, l: l1, r: r1, phase: 'odd', paliRes: oddCount }
    );

    totalRes += oddCount;
    addStep(`Update total palindromes count: res = res + ${oddCount} → ${totalRes}.`, `SET res = res + ${oddCount}`, 4, 11, 5, 16, { i, phase: 'odd' });

    // 4. Even palindrome expansion
    addStep(`Call countPali/expandAroundCenter to check even-length palindromes centered between index ${i} ('${s[i]}') and ${i+1} ('${s[i+1] || ""}').`, `CALL countPali(s, ${i}, ${i+1})`, 5, 12, 6, 17, { i, l: i, r: i + 1, phase: 'even' });

    let l2 = i;
    let r2 = i + 1;
    let evenCount = 0;
    addStep(`[countPali] Initialize local palindrome count local_res = 0.`, `SET local_res = 0`, 11, 3, 12, 4, { i, l: l2, r: r2, phase: 'even', paliRes: 0 });

    while (l2 >= 0 && r2 < s.length && s[l2] === s[r2]) {
      addStep(
        `[countPali] Check bounds and characters at l = ${l2} ('${s[l2]}') and r = ${r2} ('${s[r2]}'). Match found!`,
        `WHILE l >= 0 AND r < len(s) AND s[l] == s[r] → TRUE`,
        12, 4, 13, 5,
        { i, l: l2, r: r2, phase: 'even', paliRes: evenCount }
      );

      evenCount++;
      addStep(
        `[countPali] Increment local palindrome count local_res = ${evenCount}.`,
        `SET local_res = local_res + 1`,
        13, 5, 14, 6,
        { i, l: l2, r: r2, phase: 'even', paliRes: evenCount }
      );

      l2--;
      r2++;
      addStep(
        `[countPali] Expand pointers: decrement l to ${l2}, increment r to ${r2}.`,
        `SET l = l - 1, r = r + 1`,
        14, 6, 15, 7,
        { i, l: l2, r: r2, phase: 'even', paliRes: evenCount }
      );
    }

    const conditionReasonEven = l2 < 0 ? "left pointer out of bounds" : (r2 >= s.length ? "right pointer out of bounds" : `character mismatch: s[${l2}] ('${s[l2]}') !== s[${r2}] ('${s[r2]}')`);
    addStep(
      `[countPali] Check bounds and characters at l = ${l2}, r = ${r2}. Condition fails: ${conditionReasonEven}.`,
      `WHILE l >= 0 AND r < len(s) AND s[l] == s[r] → FALSE`,
      12, 4, 13, 5,
      { i, l: l2, r: r2, phase: 'even', paliRes: evenCount }
    );

    addStep(
      `[countPali] Return local palindrome count ${evenCount} to caller.`,
      `RETURN local_res → ${evenCount}`,
      17, 8, 18, 10,
      { i, l: l2, r: r2, phase: 'even', paliRes: evenCount }
    );

    totalRes += evenCount;
    addStep(`Update total palindromes count: res = res + ${evenCount} → ${totalRes}.`, `SET res = res + ${evenCount}`, 5, 12, 6, 17, { i, phase: 'even' });
  }

  // 5. Complete
  addStep(`Finished counting. Total palindromic substrings: ${totalRes}.`, `RETURN res → ${totalRes}`, 7, 13, 8, 19, { phase: 'result' });

  return { steps, stepLineNumbers };
};

export const PalindromicSubstringsVisualization = () => {
  const [activeCase, setActiveCase] = useState<'aaa' | 'abc'>('aaa');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateSteps(activeCase);
  }, [activeCase]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const handleCaseChange = (newCase: 'aaa' | 'abc') => {
    setActiveCase(newCase);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Case selections / Controls at Top */}
      <div className="flex flex-col gap-4 bg-card p-6 rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="flex p-0.5 bg-muted rounded-lg border border-border w-fit shadow-inner">
          <button
            onClick={() => handleCaseChange('aaa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              activeCase === 'aaa' 
              ? 'bg-background text-foreground border border-border/50 shadow-sm font-bold' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            Mixed (aaa)
          </button>
          <button
            onClick={() => handleCaseChange('abc')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              activeCase === 'abc' 
              ? 'bg-background text-foreground border border-border/50 shadow-sm font-bold' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Hash className="h-3.5 w-3.5" />
            Minimal (abc)
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
                    
                    return (
                      <div
                        key={idx}
                        className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-lg border-2 transition-all duration-200 ${
                          isCenter
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.3)] font-bold scale-105'
                          : isExpanding
                            ? 'bg-primary/20 border-primary text-primary font-bold scale-105 shadow-sm'
                            : 'bg-card border-border text-foreground'
                        }`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <Card className="flex-1 p-4 bg-green-500/5 border-green-500/20 text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{currentStep.totalRes}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Count</p>
                  </Card>
                  <Card className="flex-1 p-4 bg-blue-500/5 border-blue-500/20 text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentStep.paliRes}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Center {currentStep.phase === 'odd' ? 'Odd' : 'Even'}</p>
                  </Card>
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

            {/* Variable Panel (below the commentary box) */}
            <div className="pt-2">
              <VariablePanel
                variables={{
                  center_i: currentStep.i === -1 ? 'None' : currentStep.i,
                  L: currentStep.l === -1 ? 'Out' : currentStep.l,
                  R: currentStep.r === -1 ? 'Out' : currentStep.r,
                  substring: (currentStep.l >= 0 && currentStep.r >= 0) ? `"${currentStep.s.substring(currentStep.l, currentStep.r + 1)}"` : 'N/A'
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
