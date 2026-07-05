import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  s: string;
  t: string;
  l: number;
  r: number;
  have: number;
  need: number;
  res: [number, number];
  resLen: number;
  countT: Record<string, number>;
  window: Record<string, number>;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const USE_CASES = [
  {
    id: 'standard',
    label: 'Case 1: Standard',
    s: "ADOBECODEBANC",
    t: "ABC",
  },
  {
    id: 'no-solution',
    label: 'Case 2: No Solution',
    s: "ADOBE",
    t: "XYZ",
  },
  {
    id: 'already-min',
    label: 'Case 3: Already Minimum',
    s: "ABC",
    t: "ABC",
  }
];

const languages: VisualizationLanguageMap = {
  python: `def minWindow(s: str, t: str) -> str:
    if not t:
        return ""
    countT = {}
    window = {}
    for c in t:
        countT[c] = countT.get(c, 0) + 1
    have = 0
    need = len(countT)
    res = [-1, -1]
    resLen = float('inf')
    l = 0
    for r in range(len(s)):
        c = s[r]
        window[c] = window.get(c, 0) + 1
        if c in countT and window[c] == countT[c]:
            have += 1
        while have == need:
            if (r - l + 1) < resLen:
                res = [l, r]
                resLen = r - l + 1
            leftChar = s[l]
            window[leftChar] -= 1
            if leftChar in countT and window[leftChar] < countT[leftChar]:
                have -= 1
            l += 1
    start, end = res
    return s[start:end+1] if resLen != float('inf') else ""`,

  typescript: `function minWindow(s: string, t: string): string {
  if (t === "") return "";
  const countT: Record<string, number> = {};
  const window: Record<string, number> = {};
  for (const c of t) {
    countT[c] = (countT[c] || 0) + 1;
  }
  let have = 0;
  const need = Object.keys(countT).length;
  let res: [number, number] = [-1, -1];
  let resLen = Infinity;
  let l = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    window[c] = (window[c] || 0) + 1;
    if (c in countT && window[c] === countT[c]) {
      have++;
    }
    while (have === need) {
      if ((r - l + 1) < resLen) {
        res = [l, r];
        resLen = r - l + 1;
      }
      const leftChar = s[l];
      window[leftChar]--;
      if (leftChar in countT && window[leftChar] < countT[leftChar]) {
        have--;
      }
      l++;
    }
  }
  const [start, end] = res;
  return resLen !== Infinity ? s.slice(start, end + 1) : "";
}`,

  java: `public class Solution {
    public String minWindow(String s, String t) {
        if (t.equals("")) return "";
        java.util.Map<Character, Integer> countT = new java.util.HashMap<>();
        java.util.Map<Character, Integer> window = new java.util.HashMap<>();
        for (char c : t.toCharArray()) {
            countT.put(c, countT.getOrDefault(c, 0) + 1);
        }
        int have = 0;
        int need = countT.size();
        int[] res = {-1, -1};
        int resLen = Integer.MAX_VALUE;
        int l = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            window.put(c, window.getOrDefault(c, 0) + 1);
            if (countT.containsKey(c) && window.get(c).equals(countT.get(c))) {
                have++;
            }
            while (have == need) {
                if ((r - l + 1) < resLen) {
                    res[0] = l;
                    res[1] = r;
                    resLen = r - l + 1;
                }
                char leftChar = s.charAt(l);
                window.put(leftChar, window.get(leftChar) - 1);
                if (countT.containsKey(leftChar) && window.get(leftChar) < countT.get(leftChar)) {
                    have--;
                }
                l++;
            }
        }
        int start = res[0];
        int end = res[1];
        return resLen != Integer.MAX_VALUE ? s.substring(start, end + 1) : "";
    }
}`,

  cpp: `class Solution {
public:
    string minWindow(string s, string t) {
        if (s.empty() || t.empty()) return "";
        unordered_map<char, int> need, window;
        for (char c : t) {
            need[c]++;
        }
        int required = need.size();
        int formed = 0;
        int left = 0;
        int minLen = INT_MAX;
        int minLeft = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s[right];
            window[c]++;
            if (need.find(c) != need.end() && window[c] == need[c]) {
                formed++;
            }
            while (left <= right && formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minLeft = left;
                }
                char leftChar = s[left];
                window[leftChar]--;
                if (need.find(leftChar) != need.end() && window[leftChar] < need[leftChar]) {
                    formed--;
                }
                left++;
            }
        }
        return minLen == INT_MAX ? "" : s.substr(minLeft, minLen);
    }
};`
};

export const MinimumWindowSubstringVisualization = () => {
  const [useCaseIdx, setUseCaseIdx] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentCase = USE_CASES[useCaseIdx];

  const { steps, stepLineNumbers } = useMemo(() => {
    const s = currentCase.s;
    const t = currentCase.t;
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

    const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
      steps.push({
        s, t,
        l: extra.hasOwnProperty('l') ? extra.l! : l,
        r: extra.hasOwnProperty('r') ? extra.r! : r,
        have: extra.hasOwnProperty('have') ? extra.have! : have,
        need: extra.hasOwnProperty('need') ? extra.need! : need,
        res: extra.res || res,
        resLen: extra.hasOwnProperty('resLen') ? extra.resLen! : resLen,
        countT: extra.countT || { ...countT },
        window: extra.window || { ...window },
        explanation: msg,
        pseudoStep: pseudo,
        variables: {
          s, t,
          l: extra.hasOwnProperty('l') ? extra.l! : l,
          r: extra.hasOwnProperty('r') ? extra.r! : r,
          have: extra.hasOwnProperty('have') ? extra.have! : have,
          need: extra.hasOwnProperty('need') ? extra.need! : need,
          resLen: extra.hasOwnProperty('resLen') ? (extra.resLen === Infinity ? "Infinity" : extra.resLen!) : (resLen === Infinity ? "Infinity" : resLen)
        }
      });
      addLines(tsLine, pyLine, javaLine, cppLine);
    };

    let have = 0;
    let need = 0;
    let l = 0;
    let r = -1;
    let res: [number, number] = [-1, -1];
    let resLen = Infinity;
    const countT: Record<string, number> = {};
    const window: Record<string, number> = {};

    // 1. Signature
    addStep("Initialize the minWindow algorithm search.", "CALL minWindow(s, t)", 1, 1, 2, 3);

    // 2. Empty check
    addStep(`Check if target string t is empty. t = "${t}"`, "IF t == \"\" -> RETURN \"\"", 2, 2, 3, 4);

    if (t !== "") {
      // 3. Init structures
      addStep("Initialize frequency maps countT and window.", "SET countT = {}, window = {}", 3, 4, 4, 5);

      // 4. Count target characters
      for (const c of t) {
        countT[c] = (countT[c] || 0) + 1;
        addStep(`Count character '${c}' in target string t.`, `SET countT[${c}] = countT[${c}] + 1`, 5, 6, 6, 6);
      }

      need = Object.keys(countT).length;
      // 5. Initialize have/need
      addStep(`Initialize 'have' to 0. Unique characters to match: ${need}.`, `SET have = 0, need = ${need}`, 8, 8, 9, 9);

      // 6. Initialize pointers
      addStep("Initialize window result trackers and left pointer l = 0.", "SET res = [-1, -1], resLen = Infinity, l = 0", 10, 10, 11, 11);

      // Loop
      for (r = 0; r < s.length; r++) {
        const c = s[r];
        window[c] = (window[c] || 0) + 1;
        addStep(`Expand sliding window: move right pointer to index ${r} ('${c}').`, `FOR r = ${r} TO len(s) - 1`, 13, 13, 14, 14);

        if (c in countT && window[c] === countT[c]) {
          have++;
          addStep(`Frequency of '${c}' in window meets target. Increment 'have' to ${have}.`, `SET have = have + 1`, 16, 16, 17, 17);
        }

        while (have === need) {
          addStep(`All character requirements met (${have}/${need}). Check window validity.`, "WHILE have == need", 19, 18, 20, 20);

          if ((r - l + 1) < resLen) {
            res = [l, r];
            resLen = r - l + 1;
            addStep(`Current window [${l}, ${r}] ("${s.slice(l, r + 1)}") is smaller than best seen. Update min.`, `SET res = [l, r], resLen = r - l + 1 → ${resLen}`, 20, 19, 21, 21);
          }

          const leftChar = s[l];
          window[leftChar]--;
          addStep(`Shrink window from left. Decrement count of '${leftChar}'.`, `SET window[${leftChar}] = window[${leftChar}] - 1`, 24, 22, 26, 25);

          if (leftChar in countT && window[leftChar] < countT[leftChar]) {
            have--;
            addStep(`Frequency of '${leftChar}' falls below target. Decrement 'have' to ${have}.`, `SET have = have - 1`, 26, 24, 28, 27);
          }

          l++;
          addStep(`Advance left pointer l to index ${l}.`, "SET l = l + 1", 29, 26, 31, 30);
        }
        // loop check false
        addStep(`Window [${l}, ${r}] lacks required characters (${have}/${need}). Expand window next.`, "WHILE have == need → FALSE ✗", 19, 18, 20, 20);
      }

      // 7. Complete final check
      addStep("All elements processed. Prepare final minimum substring result.", "RETURN", 32, 27, 34, 33);
    }

    const resultStr = resLen !== Infinity ? s.slice(res[0], res[1] + 1) : "";
    addStep(`Final result substring is "${resultStr}".`, `RETURN result → "${resultStr}"`, 33, 28, 36, 33, { r: s.length - 1 });

    return { steps, stepLineNumbers };
  }, [currentCase]);

  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const handleUseCaseChange = (idx: number) => {
    setUseCaseIdx(idx);
    setCurrentStepIndex(0);
  };

  const getCharStyle = (idx: number) => {
    const isCurrentR = idx === currentStep.r;
    const isCurrentL = idx === currentStep.l;
    const isInWindow = idx >= currentStep.l && idx <= currentStep.r && currentStep.r !== -1;
    const isInResult = currentStep.res[0] !== -1 && idx >= currentStep.res[0] && idx <= currentStep.res[1];

    if (isCurrentR || isCurrentL) {
      return "bg-primary text-primary-foreground border-primary scale-110 z-10 shadow-md";
    }
    if (isInWindow) {
      return "bg-primary/20 text-foreground border-primary/30";
    }
    if (isInResult) {
      return "bg-green-500/20 text-foreground border-green-500/30";
    }
    return "bg-muted/50 text-foreground border-border";
  };

  return (
    <div className="space-y-6">
      {/* Controls / Case selection */}
      <div className="flex flex-col gap-6 bg-card p-6 rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc, idx) => (
            <Button
              key={uc.id}
              variant={useCaseIdx === idx ? "default" : "outline"}
              size="sm"
              onClick={() => handleUseCaseChange(idx)}
              className={`text-xs h-8 px-4 rounded-full transition-all duration-200 ${useCaseIdx === idx ? "shadow-md scale-105" : "hover:bg-muted"}`}
            >
              {uc.label}
            </Button>
          ))}
        </div>
        <div className="w-full pt-4 border-t border-border">
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column visual representation */}
        <Card className="p-6 flex flex-col gap-6 overflow-hidden border shadow-lg bg-card">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Target Characters (t)</span>
              <div className="flex gap-2">
                {currentCase.t.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border-2 bg-secondary/30 border-secondary text-foreground font-mono font-bold text-xs"
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Source String (s)</span>
                <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
                  <span>L: {currentStep.l}</span>
                  <span>R: {currentStep.r !== -1 ? currentStep.r : '-'}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentStep.s.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-xs transition-all duration-200 ${getCharStyle(idx)}`}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Character Frequencies</span>
                <div className="space-y-1">
                  {Object.entries(currentStep.countT).map(([char, count]) => (
                    <div key={char} className="flex justify-between items-center p-2 bg-muted/30 rounded-md border border-border/50">
                      <span className="font-mono text-xs font-bold text-foreground">{char}</span>
                      <span className={`font-mono text-xs font-bold ${ (currentStep.window[char] || 0) >= count ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                        {currentStep.window[char] || 0} / {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Current Best Window</span>
                <div className="p-3 bg-secondary/20 rounded-lg border border-secondary/50 flex flex-col items-center justify-center min-h-[60px]">
                  {currentStep.resLen === Infinity ? (
                    <span className="text-xs text-muted-foreground italic">No window found yet</span>
                  ) : (
                    <>
                      <span className="text-sm font-bold text-foreground font-mono">
                        "{currentStep.s.slice(currentStep.res[0], currentStep.res[1] + 1)}"
                      </span>
                      <span className="text-[10px] text-muted-foreground">Length: {currentStep.resLen}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Descriptive Commentary Box (at the bottom) */}
          <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
            <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Process Step
            </div>
            {currentStep.explanation}
          </div>
        </Card>

        {/* Right column code panel & VariablePanel */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      </div>
    </div>
  );
};
