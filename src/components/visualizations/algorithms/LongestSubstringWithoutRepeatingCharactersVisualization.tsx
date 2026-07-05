import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { CheckCircle2, SplitSquareHorizontal, Navigation } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  s: string;
  l: number | null;
  r: number | null;
  res: number;
  charSet: string[];
  explanation: string;
  pseudoStep: string;
  isMatch?: boolean;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  python: `def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    l = 0
    res = 0
    for r in range(len(s)):
        while s[r] in char_set:
            char_set.remove(s[l])
            l += 1
        char_set.add(s[r])
        res = max(res, r - l + 1)
    return res`,

  typescript: `function lengthOfLongestSubstring(s: string): number {
  const charSet = new Set<string>();
  let l = 0;
  let res = 0;
  for (let r = 0; r < s.length; r++) {
    while (charSet.has(s[r])) {
      charSet.delete(s[l]);
      l++;
    }
    charSet.add(s[r]);
    res = Math.max(res, r - l + 1);
  }
  return res;
}`,

  java: `public class Solution {
    public int lengthOfLongestSubstring(String s) {
        java.util.Set<Character> charSet = new java.util.HashSet<>();
        int l = 0;
        int res = 0;
        for (int r = 0; r < s.length(); r++) {
            while (charSet.contains(s.charAt(r))) {
                charSet.remove(s.charAt(l));
                l++;
            }
            charSet.add(s.charAt(r));
            res = Math.max(res, r - l + 1);
        }
        return res;
    }
}`,

  cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> charIndex;
        int maxLength = 0;
        int left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s[right];
            if (charIndex.find(c) != charIndex.end() && charIndex[c] >= left) {
                left = charIndex[c] + 1;
            }
            charIndex[c] = right;
            maxLength = max(maxLength, right - left + 1);
        }
        return maxLength;
    }
};`
};

const generateStepsData = () => {
  const s = "pwwkew";
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

  let l = 0;
  let res = 0;
  const charSet = new Set<string>();

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, isMatch: boolean = false, overrideR: number | null = null) => {
    const activeL = tsLine > 3 ? l : null;
    steps.push({
      s,
      l: activeL,
      r: overrideR,
      res,
      charSet: Array.from(charSet),
      explanation: msg,
      pseudoStep: pseudo,
      isMatch,
      variables: {
        s: `"${s}"`,
        charSet: `{${Array.from(charSet).join(', ')}}`,
        l: activeL !== null ? activeL : 'null',
        r: overrideR !== null ? overrideR : 'null',
        res
      }
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  addStep("Initialize sliding window boundaries and character tracking set.", "CALL lengthOfLongestSubstring(s)", 2, 2, 3, 4);
  addStep("Initialize left pointer bounds l = 0.", "SET l = 0", 3, 3, 4, 6);
  addStep("Initialize max substring length accumulator res = 0.", "SET res = 0", 4, 4, 5, 5);

  for (let r = 0; r < s.length; r++) {
    addStep(`Advance right pointer r to index ${r} ('${s[r]}').`, `FOR r = ${r} TO len(s) - 1`, 5, 5, 6, 7, false, r);

    const currentChar = s[r];
    addStep(`Check if '${currentChar}' causes a collision in the current window.`, `WHILE s[r] IN char_set`, 6, 6, 7, 9, false, r);

    while (charSet.has(s[r])) {
      addStep(`Collision! '${s[r]}' is already in set. Shrink window.`, `WHILE s[r] IN char_set → TRUE`, 6, 6, 7, 9, true, r);

      const dropChar = s[l];
      charSet.delete(dropChar);
      addStep(`Remove leftmost character '${dropChar}' from set.`, `char_set.remove(s[l])`, 7, 7, 8, 10, true, r);

      l++;
      addStep(`Advance left pointer l to ${l}.`, "SET l = l + 1", 8, 8, 9, 10, false, r);
      addStep(`Re-evaluate collision for '${s[r]}'.`, `WHILE s[r] IN char_set`, 6, 6, 7, 9, false, r);
    }

    charSet.add(s[r]);
    addStep(`No collision. Add '${s[r]}' to set.`, "char_set.add(s[r])", 10, 9, 11, 12, true, r);

    res = Math.max(res, r - l + 1);
    addStep(`Update max length res = max(res, window size) = ${res}.`, `SET res = max(res, r - l + 1)`, 11, 10, 12, 13, false, r);
  }

  addStep(`Algorithm completed. Return the max length: ${res}.`, `RETURN res → ${res}`, 13, 11, 14, 15, true, null);

  return { steps, stepLineNumbers };
};

export const LongestSubstringWithoutRepeatingCharactersVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateStepsData();
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-5 bg-card border border-border shadow-lg">
            <h3 className="text-xs font-semibold mb-6 text-muted-foreground uppercase tracking-widest text-center">
              Sliding Window Visualizer
            </h3>
            
            <div className="flex flex-col items-center gap-1 p-4 mb-4 w-full">
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-6">
                {currentStep.s.split('').map((char, index) => {
                  const isLeftPointer = currentStep.l === index;
                  const isRightPointer = currentStep.r === index;
                  
                  const isInActiveWindow = currentStep.l !== null && currentStep.r !== null && index >= currentStep.l && index <= currentStep.r;
                  
                  let cellStyle = "border-border bg-muted/30 text-muted-foreground scale-100 opacity-60";
                  
                  if (isInActiveWindow) {
                      cellStyle = "border-primary bg-primary/10 text-foreground scale-110 shadow-sm font-bold";
                  }
                  
                  return (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div className="h-4 flex items-end justify-center font-bold text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                         {(isLeftPointer && isRightPointer) ? "L, R" : isLeftPointer ? "L" : isRightPointer ? "R" : ""}
                      </div>
                      
                      <div className={`w-8 h-8 flex items-center justify-center text-base tracking-tight transition-all duration-300 border rounded-lg ${cellStyle}`}>
                        {char}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-border">
                <span className="text-[10px] font-bold text-center uppercase text-primary/70 mb-1 tracking-widest">Active Hash Set Memory (charSet)</span>
                <div className="flex flex-wrap gap-2 justify-center p-2 rounded bg-muted/30 w-full min-h-[48px] items-center">
                   {currentStep.charSet.length === 0 ? (
                       <span className="text-xs italic text-muted-foreground self-center">Set is empty</span>
                   ) : (
                       currentStep.charSet.map((c, i) => (
                           <div key={i} className="w-8 h-8 flex items-center justify-center font-bold text-foreground border border-border rounded-full bg-background shadow-sm transition-all duration-300">
                              {c}
                           </div>
                       ))
                   )}
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
  );
};