import { useEffect, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import confetti from 'canvas-confetti';

interface Step {
  s1: string;
  s2: string;
  l: number;
  r: number;
  s1Count: number[];
  s2Count: number[];
  matches: number;
  explanation: string;
  phase: 'init' | 'check' | 'slide' | 'done';
  pseudoStep: string;
  variables: Record<string, any>;
}

interface TestCase {
  id: string;
  name: string;
  s1: string;
  s2: string;
  expected: boolean;
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Permutation Found', s1: 'ab', s2: 'eidbaooo', expected: true },
  { id: 'ex2', name: 'No Permutation', s1: 'ab', s2: 'eidboaoo', expected: false },
  { id: 'ex3', name: 'Valid Multiple', s1: 'adc', s2: 'dcda', expected: true },
  { id: 'ex4', name: 'Long Target', s1: 'hello', s2: 'ooolleoooleh', expected: false }
];

const languages: VisualizationLanguageMap = {
  typescript: `function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;
  const s1Count = new Array(26).fill(0);
  const s2Count = new Array(26).fill(0);
  for (let i = 0; i < s1.length; i++) {
    s1Count[s1.charCodeAt(i) - 97]++;
    s2Count[s2.charCodeAt(i) - 97]++;
  }
  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (s1Count[i] === s2Count[i]) {
      matches++;
    }
  }
  let l = 0;
  for (let r = s1.length; r < s2.length; r++) {
    if (matches === 26) return true;
    const indexToAdd = s2.charCodeAt(r) - 97;
    s2Count[indexToAdd]++;
    if (s1Count[indexToAdd] === s2Count[indexToAdd]) {
      matches++;
    } else if (s1Count[indexToAdd] + 1 === s2Count[indexToAdd]) {
      matches--;
    }
    const indexToRemove = s2.charCodeAt(l) - 97;
    s2Count[indexToRemove]--;
    if (s1Count[indexToRemove] === s2Count[indexToRemove]) {
      matches++;
    } else if (s1Count[indexToRemove] - 1 === s2Count[indexToRemove]) {
      matches--;
    }
    l++;
  }
  return matches === 26;
}`,
  python: `def checkInclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2):
        return False
    s1_count = [0] * 26
    s2_count = [0] * 26
    for i in range(len(s1)):
        s1_count[ord(s1[i]) - ord('a')] += 1
        s2_count[ord(s2[i]) - ord('a')] += 1
    matches = 0
    for i in range(26):
        if s1_count[i] == s2_count[i]:
            matches += 1
    l = 0
    for r in range(len(s1), len(s2)):
        if matches == 26:
            return True
        index = ord(s2[r]) - ord('a')
        s2_count[index] += 1
        if s1_count[index] == s2_count[index]:
            matches += 1
        elif s1_count[index] + 1 == s2_count[index]:
            matches -= 1
        index = ord(s2[l]) - ord('a')
        s2_count[index] -= 1
        if s1_count[index] == s2_count[index]:
            matches += 1
        elif s1_count[index] - 1 == s2_count[index]:
            matches -= 1
        l += 1
    return matches == 26`,
  java: `public static class Solution {
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) {
            return false;
        }
        int[] s1Count = new int[26];
        int[] s2Count = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            s1Count[s1.charAt(i) - 'a']++;
            s2Count[s2.charAt(i) - 'a']++;
        }
        int matches = 0;
        for (int i = 0; i < 26; i++) {
            if (s1Count[i] == s2Count[i]) {
                matches++;
            }
        }
        int l = 0;
        for (int r = s1.length(); r < s2.length(); r++) {
            if (matches == 26) {
                return true;
            }
            int indexToAdd = s2.charAt(r) - 'a';
            s2Count[indexToAdd]++;
            if (s1Count[indexToAdd] == s2Count[indexToAdd]) {
                matches++;
            } else if (s1Count[indexToAdd] + 1 == s2Count[indexToAdd]) {
                matches--;
            }
            int indexToRemove = s2.charAt(l) - 'a';
            s2Count[indexToRemove]--;
            if (s1Count[indexToRemove] == s2Count[indexToRemove]) {
                matches++;
            } else if (s1Count[indexToRemove] - 1 == s2Count[indexToRemove]) {
                matches--;
            }
            l++;
        }
        return matches == 26;
    }
}`,
  cpp: `class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        if (s1.length() > s2.length()) {
            return false;
        }
        vector<int> s1Count(26, 0);
        vector<int> s2Count(26, 0);
        for (int i = 0; i < s1.length(); ++i) {
            s1Count[s1[i] - 'a']++;
            s2Count[s2[i] - 'a']++;
        }
        int matches = 0;
        for (int i = 0; i < 26; ++i) {
            if (s1Count[i] == s2Count[i]) {
                matches++;
            }
        }
        int l = 0;
        for (int r = s1.length(); r < s2.length(); ++r) {
            if (matches == 26) {
                return true;
            }
            int indexR = s2[r] - 'a';
            s2Count[indexR]++;
            if (s1Count[indexR] == s2Count[indexR]) {
                matches++;
            } else if (s1Count[indexR] + 1 == s2Count[indexR]) {
                matches--;
            }
            int indexL = s2[l] - 'a';
            s2Count[indexL]--;
            if (s1Count[indexL] == s2Count[indexL]) {
                matches++;
            } else if (s1Count[indexL] - 1 == s2Count[indexL]) {
                matches--;
            }
            l++;
        }
        return matches == 26;
    }
};`
};

export const PermutationInStringVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = useMemo(() => TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0], [selectedTestCaseId]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s1 = selectedTestCase.s1;
    const s2 = selectedTestCase.s2;
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const getVariables = (l: number, r: number, matchesVal: number, extra: Record<string, any> = {}) => {
      return {
        's1': `"${s1}"`,
        's2': `"${s2}"`,
        'l': l,
        'r': r,
        'matches': `${matchesVal} / 26`,
        ...extra
      };
    };

    const pushStep = (
      explanation: string,
      pseudo: string,
      phase: Step['phase'],
      l: number,
      r: number,
      s1CountCopy: number[],
      s2CountCopy: number[],
      matchesVal: number,
      variablesExtra: Record<string, any> = {},
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        s1,
        s2,
        l,
        r,
        s1Count: [...s1CountCopy],
        s2Count: [...s2CountCopy],
        matches: matchesVal,
        explanation,
        pseudoStep: pseudo,
        phase,
        variables: getVariables(l, r, matchesVal, variablesExtra)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    const s1Count = new Array(26).fill(0);
    const s2Count = new Array(26).fill(0);

    pushStep(
      `Start checkInclusion: s1 = "${s1}", s2 = "${s2}". Check if s1.length (${s1.length}) > s2.length (${s2.length}).`,
      `checkInclusion(s1="${s1}", s2="${s2}")`,
      'init', 0, -1, s1Count, s2Count, 0,
      {},
      1, 1, 2, 3
    );

    if (s1.length > s2.length) {
      pushStep(
        `s1 length is greater than s2 length. It's impossible to fit a permutation of s1 in s2. Return false.`,
        "RETURN False",
        'done', 0, -1, s1Count, s2Count, 0,
        { return: 'false' },
        2, 3, 4, 5
      );
      return { steps: newSteps, stepLineNumbers: lines };
    }

    pushStep(
      `Initialize s1Count and s2Count arrays of size 26 for English lowercase character counts.`,
      "SET s1Count = [0]*26, s2Count = [0]*26",
      'init', 0, -1, s1Count, s2Count, 0,
      {},
      3, 4, 6, 7
    );

    pushStep(
      `Populate s1Count and the first window of s2Count (length ${s1.length}).`,
      `FOR i = 0 TO ${s1.length - 1}`,
      'init', 0, -1, s1Count, s2Count, 0,
      {},
      5, 6, 8, 9
    );

    for (let i = 0; i < s1.length; i++) {
      const charCode1 = s1.charCodeAt(i) - 97;
      const charCode2 = s2.charCodeAt(i) - 97;
      s1Count[charCode1]++;
      s2Count[charCode2]++;
      pushStep(
        `Counted s1[${i}] ('${s1[i]}') and s2[${i}] ('${s2[i]}').`,
        `s1Count['${s1[i]}']++, s2Count['${s2[i]}']++`,
        'init', 0, -1, s1Count, s2Count, 0,
        {},
        6, 7, 9, 10
      );
    }

    let matches = 0;
    pushStep(
      `Compute character counts that already match between the target s1 and the first window of s2.`,
      "SET matches = 0",
      'init', 0, -1, s1Count, s2Count, 0,
      {},
      9, 9, 12, 13
    );

    for (let i = 0; i < 26; i++) {
      if (s1Count[i] === s2Count[i]) {
        matches++;
      }
    }
    pushStep(
      `Initial matches: ${matches} out of 26 character frequencies are identical (including characters with count 0 on both sides).`,
      `FOR i = 0 TO 25  →  matches = ${matches}`,
      'init', 0, -1, s1Count, s2Count, matches,
      {},
      10, 10, 13, 14
    );

    let l = 0;
    pushStep(
      `Set left pointer of sliding window: l = 0.`,
      "SET l = 0",
      'init', l, -1, s1Count, s2Count, matches,
      {},
      15, 13, 18, 19
    );

    pushStep(
      `Start loop. Slide the window right from index r = ${s1.length}.`,
      `FOR r = ${s1.length} TO ${s2.length - 1}`,
      'slide', l, s1.length - 1, s1Count, s2Count, matches,
      {},
      16, 14, 19, 20
    );

    for (let r = s1.length; r < s2.length; r++) {
      pushStep(
        `Checking window with right pointer r = ${r} ('${s2[r]}').`,
        `// r = ${r}`,
        'slide', l, r - 1, s1Count, s2Count, matches,
        { u: s2[r] },
        16, 14, 19, 20
      );

      pushStep(
        `Check if matches count (${matches}) equals 26.`,
        `IF matches == 26  →  ${matches} == 26`,
        'check', l, r - 1, s1Count, s2Count, matches,
        {},
        17, 15, 20, 21
      );
      if (matches === 26) {
        pushStep(
          `All 26 character frequencies match! We found a permutation. Return true.`,
          "RETURN True",
          'done', l, r - 1, s1Count, s2Count, matches,
          { return: 'true' },
          17, 16, 21, 21
        );
        return { steps: newSteps, stepLineNumbers: lines };
      }

      const indexToAdd = s2.charCodeAt(r) - 97;
      s2Count[indexToAdd]++;
      pushStep(
        `Add character s2[r] ('${s2[r]}') to the sliding window. Update window counts.`,
        `s2Count['${s2[r]}']++`,
        'slide', l, r, s1Count, s2Count, matches,
        {},
        18, 17, 23, 24
      );

      const isMatch = s1Count[indexToAdd] === s2Count[indexToAdd];
      const isMismatch = s1Count[indexToAdd] + 1 === s2Count[indexToAdd];
      if (isMatch) {
        matches++;
      } else if (isMismatch) {
        matches--;
      }
      pushStep(
        isMatch
          ? `Count of '${s2[r]}' in window matches target s1 count (${s1Count[indexToAdd]}). Increment matches count to ${matches}.`
          : isMismatch
          ? `Count of '${s2[r]}' in window was matching, but now exceeds target count (${s1Count[indexToAdd]} vs ${s2Count[indexToAdd]}). Decrement matches count to ${matches}.`
          : `Count of '${s2[r]}' updated. Counts still don't match. Matches count remains ${matches}.`,
        isMatch
          ? `matches += 1  →  ${matches}`
          : isMismatch
          ? `matches -= 1  →  ${matches}`
          : `// no matches change`,
        'slide', l, r, s1Count, s2Count, matches,
        {},
        20, 19, 25, 26
      );

      const indexToRemove = s2.charCodeAt(l) - 97;
      s2Count[indexToRemove]--;
      pushStep(
        `Remove outgoing character s2[l] ('${s2[l]}') from the sliding window.`,
        `s2Count['${s2[l]}']--`,
        'slide', l, r, s1Count, s2Count, matches,
        {},
        25, 23, 30, 31
      );

      const isMatchL = s1Count[indexToRemove] === s2Count[indexToRemove];
      const isMismatchL = s1Count[indexToRemove] - 1 === s2Count[indexToRemove];
      if (isMatchL) {
        matches++;
      } else if (isMismatchL) {
        matches--;
      }
      pushStep(
        isMatchL
          ? `Count of '${s2[l]}' in window matches target s1 count (${s1Count[indexToRemove]}). Increment matches count to ${matches}.`
          : isMismatchL
          ? `Count of '${s2[l]}' in window was matching, but now falls below target count (${s1Count[indexToRemove]} vs ${s2Count[indexToRemove]}). Decrement matches count to ${matches}.`
          : `Count of '${s2[l]}' updated. Counts still don't match. Matches count remains ${matches}.`,
        isMatchL
          ? `matches += 1  →  ${matches}`
          : isMismatchL
          ? `matches -= 1  →  ${matches}`
          : `// no matches change`,
        'slide', l, r, s1Count, s2Count, matches,
        {},
        27, 25, 32, 33
      );

      l++;
      pushStep(
        `Increment left pointer l to ${l} to slide the window forward.`,
        `l += 1  →  ${l}`,
        'slide', l, r, s1Count, s2Count, matches,
        {},
        32, 29, 37, 38
      );
    }

    pushStep(
      `Finished loop. Check if the matches count of the last window is 26.`,
      `RETURN matches == 26  →  ${matches} == 26`,
      'check', l, s2.length - 1, s1Count, s2Count, matches,
      {},
      34, 30, 39, 40
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [selectedTestCase]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  useEffect(() => {
    if (currentStepIndex === steps.length - 1 && steps.length > 0) {
      const step = steps[currentStepIndex];
      const isSuccess = step.matches === 26;
      if (isSuccess) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    }
  }, [currentStepIndex, steps]);

  if (steps.length === 0) return null;

  const { s1, s2, l, r, s1Count, s2Count, matches } = currentStep;

  const activeChars = Array.from(
    new Set([
      ...s1.split(''),
      ...(r !== -1 ? s2.slice(l, r + 1).split('') : [])
    ])
  ).sort();

  const getCharStyle = (idx: number) => {
    const isCurrentR = idx === r;
    const isCurrentL = idx === l;
    const isInWindow = idx >= l && idx <= r && r !== -1;

    if (isCurrentR || isCurrentL) {
      return "bg-primary text-primary-foreground border-primary scale-110 z-10 shadow-md";
    }
    if (isInWindow) {
      return "bg-primary/20 text-foreground border-primary/40 shadow-inner";
    }
    return "bg-muted/50 text-foreground border-border";
  };

  return (
    <div className="space-y-6">
      {/* Test Cases Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          Test Cases
        </h3>
        <div className="flex flex-wrap gap-2 bg-background p-1 rounded-lg border border-border shadow-sm">
          {TEST_CASES.map(tc => (
            <button
              key={tc.id}
              onClick={() => {
                setSelectedTestCaseId(tc.id);
                setCurrentStepIndex(0);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                selectedTestCaseId === tc.id 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tc.expected ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
              {tc.name}
            </button>
          ))}
        </div>
      </div>

      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            {/* Letter Blocks: s1 and s2 */}
            <Card className="p-4 bg-card border border-border shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Target Permutation (s1)</span>
                <div className="flex gap-1.5 flex-wrap">
                  {s1.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-md bg-secondary/40 border border-secondary flex items-center justify-center font-bold text-xs font-mono text-foreground"
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Sliding Window (s2)</span>
                  <div className="flex gap-2 font-mono text-[9px] text-muted-foreground">
                    <span>L: {l}</span>
                    <span>R: {r !== -1 ? r : '-'}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {s2.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-md border flex items-center justify-center font-bold text-xs font-mono transition-all duration-200 ${getCharStyle(idx)}`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-card border border-border shadow-sm flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 text-center block">
                  Frequencies Comparison
                </span>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {activeChars.map(char => {
                    const charIdx = char.charCodeAt(0) - 97;
                    const targetCount = s1Count[charIdx];
                    const windowCount = s2Count[charIdx];
                    const isMatching = targetCount === windowCount;

                    return (
                      <div
                        key={char}
                        className={`flex justify-between items-center px-3 py-1.5 rounded border text-xs font-semibold transition-all duration-300 ${
                          isMatching
                            ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                            : 'bg-muted/40 border-border/50 text-foreground'
                        }`}
                      >
                        <span className="font-mono">{char.toUpperCase()}</span>
                        <span className="font-mono">
                          {windowCount} / {targetCount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-4 bg-card border border-border shadow-sm flex flex-col justify-center items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center block">
                  Frequencies Matches
                </span>

                <div className="flex flex-col items-center gap-1.5 w-full">
                  <span className={`text-xl font-bold font-mono transition-all duration-300 ${
                    matches === 26 
                      ? 'text-green-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-110' 
                      : 'text-foreground'
                  }`}>
                    {matches} / 26
                  </span>
                  <span className="text-[9px] text-muted-foreground uppercase text-center block">
                    identical counts
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-border">
                  <div
                    className={`h-full transition-all duration-300 ${
                      matches === 26 ? 'bg-green-500' : 'bg-primary'
                    }`}
                    style={{ width: `${(matches / 26) * 100}%` }}
                  />
                </div>
              </Card>
            </div>

            <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm flex items-center ${
              currentStep.phase === 'done' && matches === 26
                ? 'bg-green-500/5 border-green-500' 
                : 'bg-primary/5 border-primary/20'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl shrink-0 ${
                  currentStep.phase === 'done' && matches === 26
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Narrative
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90">
                    {currentStep.explanation}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        }
        rightContent={
          <div className="space-y-4 h-full flex flex-col">
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStepIndex}
              onLanguageChange={() => setCurrentStepIndex(0)}
            />
            <VariablePanel variables={currentStep.variables} />
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
    </div>
  );
};
export default PermutationInStringVisualization;
