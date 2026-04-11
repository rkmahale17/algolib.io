import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';

interface Step {
  s: string;
  l: number;
  r: number;
  currentCharL?: string;
  currentCharR?: string;
  comment: string;
  highlightedLines: number[];
  isValid?: boolean;
}

export const ValidPalindromeVisualization = () => {
  const code = `function isPalindrome(s: string): boolean {
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
}`;

  const cases = {
    valid: {
      steps: [
        { s: "race car", l: 0, r: 7, comment: "Initialize pointers at the start (l=0) and end (r=7).", highlightedLines: [2, 3] },
        { s: "race car", l: 0, r: 7, comment: "Check main loop condition: 0 < 7 is true.", highlightedLines: [5] },
        { s: "race car", l: 0, r: 7, currentCharL: 'r', comment: "Left pointer check: 'r' is alphanumeric, so we skip the l-skip loop.", highlightedLines: [6] },
        { s: "race car", l: 0, r: 7, currentCharR: 'r', comment: "Right pointer check: 'r' is alphanumeric, so we skip the r-skip loop.", highlightedLines: [9] },
        { s: "race car", l: 0, r: 7, currentCharL: 'r', currentCharR: 'r', comment: "Compare 'r' and 'r' (case-insensitive). They match!", highlightedLines: [12] },
        { s: "race car", l: 1, r: 6, comment: "Matching characters found! Increment left and decrement right.", highlightedLines: [15, 16] },
        { s: "race car", l: 1, r: 6, comment: "Next iteration: 1 < 6 is true.", highlightedLines: [5] },
        { s: "race car", l: 1, r: 6, currentCharL: 'a', comment: "Left pointer at 'a' is alphanumeric.", highlightedLines: [6] },
        { s: "race car", l: 1, r: 6, currentCharR: 'a', comment: "Right pointer at 'a' is alphanumeric.", highlightedLines: [9] },
        { s: "race car", l: 1, r: 6, currentCharL: 'a', currentCharR: 'a', comment: "Characters 'a' and 'a' match.", highlightedLines: [12] },
        { s: "race car", l: 2, r: 5, comment: "Increment l, decrement r.", highlightedLines: [15, 16] },
        { s: "race car", l: 2, r: 5, comment: "Next iteration: 2 < 5 is true.", highlightedLines: [5] },
        { s: "race car", l: 2, r: 5, currentCharL: 'c', comment: "Left pointer at 'c' is alphanumeric.", highlightedLines: [6] },
        { s: "race car", l: 2, r: 5, currentCharR: 'c', comment: "Right pointer at 'c' is alphanumeric.", highlightedLines: [9] },
        { s: "race car", l: 2, r: 5, currentCharL: 'c', currentCharR: 'c', comment: "Characters 'c' and 'c' match.", highlightedLines: [12] },
        { s: "race car", l: 3, r: 4, comment: "Increment l, decrement r.", highlightedLines: [15, 16] },
        { s: "race car", l: 3, r: 4, comment: "Next iteration: 3 < 4 is true.", highlightedLines: [5] },
        { s: "race car", l: 3, r: 4, currentCharL: 'e', comment: "Left pointer at 'e' is alphanumeric.", highlightedLines: [6] },
        { s: "race car", l: 3, r: 4, currentCharR: ' ', comment: "Right pointer check: space (' ') is NOT alphanumeric.", highlightedLines: [9] },
        { s: "race car", l: 3, r: 3, currentCharR: ' ', comment: "Decrement right pointer to skip the space.", highlightedLines: [10] },
        { s: "race car", l: 3, r: 3, comment: "End of r-skip loop: r is no longer greater than l.", highlightedLines: [9] },
        { s: "race car", l: 3, r: 3, currentCharL: 'e', currentCharR: 'e', comment: "Compare 'e' and 'e'. Match!", highlightedLines: [12] },
        { s: "race car", l: 4, r: 2, comment: "Increment l, decrement r.", highlightedLines: [15, 16] },
        { s: "race car", l: 4, r: 2, comment: "Check main loop: 4 < 2 is false. Pointers have crossed.", highlightedLines: [5] },
        { s: "race car", l: 4, r: 2, isValid: true, comment: "The string is a valid palindrome!", highlightedLines: [18] }
      ]
    },
    invalid: {
      steps: [
        { s: "race a car", l: 0, r: 9, comment: "Initialize pointers: l=0, r=9.", highlightedLines: [2, 3] },
        { s: "race a car", l: 0, r: 9, comment: "0 < 9 is true.", highlightedLines: [5] },
        { s: "race a car", l: 0, r: 9, currentCharL: 'r', currentCharR: 'r', comment: "Match 'r' at ends.", highlightedLines: [12] },
        { s: "race a car", l: 1, r: 8, comment: "Move pointers center-ward.", highlightedLines: [15, 16] },
        { s: "race a car", l: 1, r: 8, comment: "Next iteration: 1 < 8.", highlightedLines: [5] },
        { s: "race a car", l: 1, r: 8, currentCharL: 'a', currentCharR: 'a', comment: "Match 'a' at next position.", highlightedLines: [12] },
        { s: "race a car", l: 2, r: 7, comment: "Move pointers.", highlightedLines: [15, 16] },
        { s: "race a car", l: 2, r: 7, comment: "Next iteration: 2 < 7.", highlightedLines: [5] },
        { s: "race a car", l: 2, r: 7, currentCharL: 'c', currentCharR: 'c', comment: "Match 'c'.", highlightedLines: [12] },
        { s: "race a car", l: 3, r: 6, comment: "Move pointers.", highlightedLines: [15, 16] },
        { s: "race a car", l: 3, r: 6, comment: "Next iteration: 3 < 6.", highlightedLines: [5] },
        { s: "race a car", l: 3, r: 6, currentCharL: 'e', currentCharR: 'a', comment: "Compare 'e' and 'a'. No match!", highlightedLines: [12] },
        { s: "race a car", l: 3, r: 6, isValid: false, comment: "Found a mismatch. Return false.", highlightedLines: [13] }
      ]
    }
  };

  const [caseId, setCaseId] = useState<'valid' | 'invalid'>('valid');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = cases[caseId].steps;
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  const handleCaseChange = (newCase: 'valid' | 'invalid') => {
    setCaseId(newCase);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
        
        <div className="flex p-1 bg-muted rounded-xl border border-border w-fit backdrop-blur-sm shadow-inner">
          <button
            onClick={() => handleCaseChange('valid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              caseId === 'valid' 
              ? 'bg-card text-primary shadow-sm ring-1 ring-border/50' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${caseId === 'valid' ? 'text-primary' : 'text-muted-foreground'}`} />
            Valid Case
          </button>
          <button
            onClick={() => handleCaseChange('invalid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              caseId === 'invalid' 
              ? 'bg-card text-destructive shadow-sm ring-1 ring-border/50' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <XCircle className={`h-4 w-4 ${caseId === 'invalid' ? 'text-destructive' : 'text-muted-foreground'}`} />
            Invalid Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">String Inspection</h3>
              <div className="flex flex-wrap gap-2">
                {currentStep.s.split('').map((char, idx) => {
                  const isLeft = idx === currentStep.l;
                  const isRight = idx === currentStep.r;
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-lg border-2 transition-all duration-200 ${
                        isLeft && isRight
                        ? 'bg-purple-500/20 border-purple-500 text-purple-600 shadow-[0_0_10px_purple]'
                        : isLeft
                          ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]'
                          : isRight
                            ? 'bg-secondary/20 border-secondary text-secondary-foreground shadow-[0_0_10px_secondary]'
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

            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 min-h-[80px] flex items-center">
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-bold text-primary mr-2">Step {currentStepIndex}:</span>
                  {currentStep.comment}
                </p>
              </div>

              <VariablePanel
                variables={{
                  left: currentStep.l,
                  right: currentStep.r,
                  leftChar: currentStep.currentCharL === ' ' ? 'Space' : (currentStep.currentCharL || 'None'),
                  rightChar: currentStep.currentCharR === ' ' ? 'Space' : (currentStep.currentCharR || 'None'),
                  status: currentStep.isValid === undefined ? 'Comparing' : (currentStep.isValid ? 'Valid' : 'Invalid')
                }}
              />

              {currentStep.isValid !== undefined && (
                <div className={`p-4 rounded-lg border flex items-center justify-center gap-3 ${
                  currentStep.isValid
                  ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                }`}>
                  <span className="text-xl font-bold">
                    {currentStep.isValid ? '✓ Valid Palindrome' : '✗ Not a Palindrome'}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:h-[calc(100vh-250px)] min-h-[500px]">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={currentStep.highlightedLines}
          />
        </div>
      </div>
    </div>
  );
};


