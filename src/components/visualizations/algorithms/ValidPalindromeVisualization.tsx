import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  s: string;
  l: number;
  r: number;
  currentCharL?: string;
  currentCharR?: string;
  explanation: string;
  pseudoStep: string;
  isValid?: boolean;
}

const languages: VisualizationLanguageMap = {
  python: `def isPalindrome(s: str) -> bool:
    def alphaNum(c: str) -> bool:
        return c.isalnum()
    l = 0
    r = len(s) - 1
    while l < r:
        while l < r and not alphaNum(s[l]):
            l += 1
        while r > l and not alphaNum(s[r]):
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True`,

  typescript: `function isPalindrome(s: string): boolean {
  let l = 0;
  let r = s.length - 1;
  while (l < r) {
    while (l < r && !alphaNum(s[l])) {
      l++;
    }
    while (r > l && !alphaNum(s[r])) {
      r--;
    }
    if (s[l].toLowerCase() !== s[r].toLowerCase()) {
      return false;
    }
    l++;
    r--;
  }
  return true;
}

function alphaNum(c: string): boolean {
  const code = c.charCodeAt(0);
  return (
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    (code >= 48 && code <= 57)
  );
}`,

  java: `public class Solution {
    public boolean isPalindrome(String s) {
        int l = 0;
        int r = s.length - 1;
        while (l < r) {
            while (l < r && !alphaNum(s.charAt(l))) {
                l++;
            }
            while (r > l && !alphaNum(s.charAt(r))) {
                r--;
            }
            if (s.charAt(l) != s.charAt(r) && Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {
                return false;
            }
            l++;
            r--;
        }
        return true;
    }

    private boolean alphaNum(char c) {
        return Character.isLetterOrDigit(c);
    }
}`,

  cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) {
                left++;
            }
            while (left < right && !isalnum(s[right])) {
                right--;
            }
            if (tolower(s[left]) != tolower(s[right])) {
                return false;
            }
            left++;
            right--;
        }
        return true;
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

  const alphaNum = (c: string) => {
    const code = c.charCodeAt(0);
    return (
      (code >= 65 && code <= 90) ||
      (code >= 97 && code <= 122) ||
      (code >= 48 && code <= 57)
    );
  };

  let l = 0;
  let r = s.length - 1;

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
    steps.push({
      s,
      l,
      r,
      currentCharL: extra.currentCharL,
      currentCharR: extra.currentCharR,
      explanation: msg,
      pseudoStep: pseudo,
      isValid: extra.isValid
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  addStep("Initialize left and right pointers at both ends of the string.", "SET l = 0, r = len(s) - 1", 2, 4, 3, 4);

  while (l < r) {
    // 2. Loop check
    addStep(`Loop check: is left (${l}) < right (${r})?`, `WHILE l < r → ${l} < ${r}`, 4, 6, 5, 5);

    // 3. Skip left non-alphanumeric
    addStep(`Check if character at left pointer s[${l}] ('${s[l]}') is alphanumeric.`, "WHILE l < r AND NOT alphaNum(s[l])", 5, 7, 6, 6, { currentCharL: s[l] });
    while (l < r && !alphaNum(s[l])) {
      l++;
      addStep(`s[${l - 1}] is non-alphanumeric. Increment left pointer to ${l}.`, "SET l = l + 1", 6, 8, 7, 7);
      addStep(`Check if character at left pointer s[${l}] ('${s[l]}') is alphanumeric.`, "WHILE l < r AND NOT alphaNum(s[l])", 5, 7, 6, 6, { currentCharL: s[l] });
    }

    // 4. Skip right non-alphanumeric
    addStep(`Check if character at right pointer s[${r}] ('${s[r]}') is alphanumeric.`, "WHILE r > l AND NOT alphaNum(s[r])", 8, 9, 9, 9, { currentCharR: s[r] });
    while (r > l && !alphaNum(s[r])) {
      r--;
      addStep(`s[${r + 1}] is non-alphanumeric. Decrement right pointer to ${r}.`, "SET r = r - 1", 9, 10, 10, 10);
      addStep(`Check if character at right pointer s[${r}] ('${s[r]}') is alphanumeric.`, "WHILE r > l AND NOT alphaNum(s[r])", 8, 9, 9, 9, { currentCharR: s[r] });
    }

    // 5. Compare characters
    const charL = s[l].toLowerCase();
    const charR = s[r].toLowerCase();
    addStep(
      `Compare characters (case-insensitive): '${charL}' vs '${charR}'.`,
      `IF s[l].lower() != s[r].lower() → '${charL}' != '${charR}'`,
      11, 11, 12, 12,
      { currentCharL: s[l], currentCharR: s[r] }
    );

    if (charL !== charR) {
      addStep("Characters do not match! The string is not a palindrome.", "RETURN False", 12, 12, 13, 13, { isValid: false });
      return { steps, stepLineNumbers };
    }

    // 6. Move pointers center-ward
    l++;
    r--;
    addStep(`Match! Move both pointers center-ward. New left = ${l}, right = ${r}.`, "SET l = l + 1, r = r - 1", 14, 13, 15, 15);
  }

  // 7. Complete final check
  addStep("Pointers crossed. All compared character pairs matched successfully.", "RETURN True", 17, 15, 18, 18, { isValid: true });

  return { steps, stepLineNumbers };
};

export const ValidPalindromeVisualization = () => {
  const [caseId, setCaseId] = useState<'valid' | 'invalid'>('valid');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const targetStr = caseId === 'valid' ? "race car" : "race a car";
    return generateStepsData(targetStr);
  }, [caseId]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const handleCaseChange = (newCase: 'valid' | 'invalid') => {
    setCaseId(newCase);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Case selections / Controls at Top */}
      <div className="flex flex-col gap-4 bg-card p-6 rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="flex p-0.5 bg-muted rounded-lg border border-border w-fit shadow-inner">
          <button
            onClick={() => handleCaseChange('valid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              caseId === 'valid' 
              ? 'bg-background text-foreground border border-border/50 shadow-sm font-bold' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${caseId === 'valid' ? 'text-green-500' : 'text-muted-foreground'}`} />
            Valid Case
          </button>
          <button
            onClick={() => handleCaseChange('invalid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              caseId === 'invalid' 
              ? 'bg-background text-foreground border border-border/50 shadow-sm font-bold' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <XCircle className={`h-3.5 w-3.5 ${caseId === 'invalid' ? 'text-red-500' : 'text-muted-foreground'}`} />
            Invalid Case
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
                <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest">String Inspection</h3>
                <div className="flex flex-wrap gap-2">
                  {currentStep.s.split('').map((char, idx) => {
                    const isLeft = idx === currentStep.l;
                    const isRight = idx === currentStep.r;
                    return (
                      <div
                        key={idx}
                        className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-lg border-2 transition-all duration-200 ${
                          isLeft && isRight
                          ? 'bg-purple-500/20 border-purple-500 text-purple-600 shadow-[0_0_10px_purple] font-bold'
                          : isLeft
                            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)] font-bold scale-105'
                            : isRight
                              ? 'bg-secondary/20 border-secondary text-secondary-foreground shadow-[0_0_10px_secondary] font-bold scale-105'
                              : idx < currentStep.l || idx > currentStep.r
                                ? 'bg-muted border-transparent text-muted-foreground opacity-50'
                                : 'bg-card border-border text-foreground'
                          }`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-primary/20 border border-primary" />
                    <span>Left Pointer</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-secondary/20 border border-secondary" />
                    <span>Right Pointer</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500" />
                    <span>Meeting Point</span>
                  </div>
                </div>
              </div>

              {currentStep.isValid !== undefined && (
                <div className={`p-4 rounded-lg border flex items-center justify-center gap-3 mb-4 ${
                  currentStep.isValid
                  ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 font-bold'
                  : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 font-bold'
                }`}>
                  <span className="text-base font-bold">
                    {currentStep.isValid ? '✓ Valid Palindrome' : '✗ Not a Palindrome'}
                  </span>
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
                  left: currentStep.l,
                  right: currentStep.r,
                  leftChar: currentStep.currentCharL === ' ' ? 'Space' : (currentStep.currentCharL || 'None'),
                  rightChar: currentStep.currentCharR === ' ' ? 'Space' : (currentStep.currentCharR || 'None'),
                  status: currentStep.isValid === undefined ? 'Comparing' : (currentStep.isValid ? 'Valid' : 'Invalid')
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
