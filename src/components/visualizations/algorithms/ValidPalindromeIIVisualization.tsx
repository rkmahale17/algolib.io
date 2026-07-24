import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  s: string[];
  left: number;
  right: number;
  highlightedIndices: number[];
  showOptions: boolean;
  option1Active: boolean;
  option1Result: boolean | null;
  option2Active: boolean;
  option2Result: boolean | null;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function validPalindrome(s: string): boolean {
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) {
            const skipLeftSub = s.slice(left + 1, right + 1);
            const isSkipLeftPalindrome = skipLeftSub === skipLeftSub.split('').reverse().join('');
            const skipRightSub = s.slice(left, right);
            const isSkipRightPalindrome = skipRightSub === skipRightSub.split('').reverse().join('');
            return isSkipLeftPalindrome || isSkipRightPalindrome;
        }
        left++;
        right--;
    }
    return true;
}`,

  python: `def validPalindrome(s: str) -> bool:
    left = 0
    right = len(s) - 1
    while left < right:
        if s[left] != s[right]:
            skip_left = s[left + 1 : right + 1]
            skip_right = s[left : right]
            return is_palindrome_check(skip_left) or is_palindrome_check(skip_right)
        left += 1
        right -= 1
    return True

def is_palindrome_check(sub_s: str) -> bool:
    return sub_s == sub_s[::-1]`,

  java: `class Solution {
    private boolean isPalindrome(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    public boolean validPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return isPalindrome(s, left + 1, right) || isPalindrome(s, left, right - 1);
            }
            left++;
            right--;
        }
        return true;
    }
}`,

  cpp: `class Solution {
public:
    bool checkPalindrome(const string& s, int i, int j) {
        while (i < j) {
            if (s[i] != s[j]) {
                return false;
            }
            i++;
            j--;
        }
        return true;
    }
    bool validPalindrome(string s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            if (s[left] != s[right]) {
                return checkPalindrome(s, left + 1, right) || checkPalindrome(s, left, j - 1);
            }
            left++;
            right--;
        }
        return true;
    }
};`,
};

function generateVisualizationData() {
  const initialString = ["a", "b", "b", "c", "a"];
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

  // Step 1: Initialize pointers
  steps.push({
    s: [...initialString],
    left: 0,
    right: 4,
    highlightedIndices: [0, 4],
    showOptions: false,
    option1Active: false,
    option1Result: null,
    option2Active: false,
    option2Result: null,
    variables: { s: `"abbca"`, left: 0, right: 4, "s[left]": "a", "s[right]": "a" },
    explanation: "Initialize two pointers: left starting at index 0 and right starting at index 4 (s.length - 1).",
    pseudoStep: "SET left = 0, right = 4"
  });
  addLines(2, 2, 13, 14);

  // Step 2: Loop condition check
  steps.push({
    s: [...initialString],
    left: 0,
    right: 4,
    highlightedIndices: [0, 4],
    showOptions: false,
    option1Active: false,
    option1Result: null,
    option2Active: false,
    option2Result: null,
    variables: { left: 0, right: 4, "left < right": "0 < 4 → true" },
    explanation: "Check the loop condition. Since left (0) < right (4), we enter the while loop.",
    pseudoStep: "WHILE left (0) < right (4)"
  });
  addLines(4, 4, 15, 16);

  // Step 3: Compare s[0] and s[4]
  steps.push({
    s: [...initialString],
    left: 0,
    right: 4,
    highlightedIndices: [0, 4],
    showOptions: false,
    option1Active: false,
    option1Result: null,
    option2Active: false,
    option2Result: null,
    variables: { left: 0, right: 4, "s[left]": "a", "s[right]": "a", "match": "true" },
    explanation: "Compare the characters at the pointers. Since s[0] ('a') equals s[4] ('a'), they match and contribute to a palindrome.",
    pseudoStep: "IF s[left] ('a') != s[right] ('a')  →  false"
  });
  addLines(5, 5, 16, 17);

  // Step 4: Move pointers inward
  steps.push({
    s: [...initialString],
    left: 1,
    right: 3,
    highlightedIndices: [1, 3],
    showOptions: false,
    option1Active: false,
    option1Result: null,
    option2Active: false,
    option2Result: null,
    variables: { left: 1, right: 3, "s[left]": "b", "s[right]": "c" },
    explanation: "Move both pointers inwards: increment left to 1 and decrement right to 3.",
    pseudoStep: "left++, right--  →  left = 1, right = 3"
  });
  addLines(12, 9, 19, 20);

  // Step 5: Loop condition check
  steps.push({
    s: [...initialString],
    left: 1,
    right: 3,
    highlightedIndices: [1, 3],
    showOptions: false,
    option1Active: false,
    option1Result: null,
    option2Active: false,
    option2Result: null,
    variables: { left: 1, right: 3, "left < right": "1 < 3 → true" },
    explanation: "Check the loop condition. Since left (1) < right (3), we continue the comparison loop.",
    pseudoStep: "WHILE left (1) < right (3)"
  });
  addLines(4, 4, 15, 16);

  // Step 6: Compare s[1] and s[3] (Mismatch)
  steps.push({
    s: [...initialString],
    left: 1,
    right: 3,
    highlightedIndices: [1, 3],
    showOptions: false,
    option1Active: false,
    option1Result: null,
    option2Active: false,
    option2Result: null,
    variables: { left: 1, right: 3, "s[left]": "b", "s[right]": "c", "match": "false" },
    explanation: "Compare the characters at the pointers. Since s[1] ('b') and s[3] ('c') do not match, we have a mismatch. We have exactly one chance to delete a character to form a palindrome.",
    pseudoStep: "IF s[left] ('b') != s[right] ('c')  →  true"
  });
  addLines(5, 5, 16, 17);

  // Step 7: Option 1: Skip left character
  steps.push({
    s: [...initialString],
    left: 1,
    right: 3,
    highlightedIndices: [2, 3],
    showOptions: true,
    option1Active: true,
    option1Result: false,
    option2Active: false,
    option2Result: null,
    variables: { left: 1, right: 3, "skip_left_substring": "s[2..3] = \"bc\"", "is_palindrome": "false" },
    explanation: "Option 1: Try deleting the left character 'b' at index 1. Check if the remaining substring s[2..3] ('bc') is a palindrome. Comparing 'b' vs 'c' -> no match. Substring 'bc' is NOT a palindrome.",
    pseudoStep: "CALL checkPalindrome(\"bc\")  →  false"
  });
  addLines(7, 8, 17, 18);

  // Step 8: Option 2: Skip right character
  steps.push({
    s: [...initialString],
    left: 1,
    right: 3,
    highlightedIndices: [1, 2],
    showOptions: true,
    option1Active: false,
    option1Result: false,
    option2Active: true,
    option2Result: true,
    variables: { left: 1, right: 3, "skip_right_substring": "s[1..2] = \"bb\"", "is_palindrome": "true" },
    explanation: "Option 2: Try deleting the right character 'c' at index 3. Check if the remaining substring s[1..2] ('bb') is a palindrome. Comparing s[1] 'b' vs s[2] 'b' -> match! Substring 'bb' IS a palindrome.",
    pseudoStep: "CALL checkPalindrome(\"bb\")  →  true"
  });
  addLines(9, 8, 17, 18);

  // Step 9: Return result
  steps.push({
    s: [...initialString],
    left: 1,
    right: 3,
    highlightedIndices: [1, 2],
    showOptions: true,
    option1Active: false,
    option1Result: false,
    option2Active: false,
    option2Result: true,
    variables: { "option1_result": "false", "option2_result": "true", "result": "true" },
    explanation: "Since Option 2 is a palindrome (skipping 'c' leaves 'abb_a' which is 'abba'), the original string satisfies the valid palindrome II condition. Return true.",
    pseudoStep: "RETURN true"
  });
  addLines(10, 8, 17, 18);

  return { steps, stepLineNumbers };
}

export const ValidPalindromeIIVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Valid Palindrome II (One Deletion)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative space-y-8">
              {/* String representation */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground mb-6">Input String</h4>
                <div className="flex gap-3 justify-center items-center">
                  {currentStep.s.map((char, idx) => {
                    const isLeft = idx === currentStep.left && currentStepIndex < 8;
                    const isRight = idx === currentStep.right && currentStepIndex < 8;
                    const isHighlighted = currentStep.highlightedIndices.includes(idx);

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div 
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-bold transition-all shadow-sm ${
                            isHighlighted 
                              ? "border-orange-500 bg-orange-100 dark:bg-orange-950/50 text-orange-950 dark:text-orange-200 scale-110 z-10" 
                              : "border-border bg-card text-foreground"
                          }`}
                        >
                          <span className="text-sm font-semibold">{char}</span>
                        </div>
                        
                        {/* Pointer indicators */}
                        <div className="h-6 flex flex-col items-center justify-start text-[10px] font-bold">
                          {isLeft && isRight ? (
                            <span className="text-orange-600 dark:text-orange-400">left/right</span>
                          ) : isLeft ? (
                            <span className="text-blue-600 dark:text-blue-400">left</span>
                          ) : isRight ? (
                            <span className="text-purple-600 dark:text-purple-400">right</span>
                          ) : (
                            <span className="opacity-0">-</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Substring check options */}
              {currentStep.showOptions && (
                <div className="space-y-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h4 className="text-[11px] font-bold text-muted-foreground mb-2">Branching Options Check</h4>
                  
                  {/* Option 1 */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    currentStep.option1Active 
                      ? "bg-primary/5 border-primary" 
                      : "bg-muted/10 border-border"
                  }`}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-foreground">Option 1: Skip left character s[1] ('b')</span>
                      <span className="text-[11px] text-muted-foreground">Check if s[2..3] ("bc") is a palindrome</span>
                    </div>
                    <div>
                      {currentStep.option1Result === null ? (
                        <span className="text-xs text-muted-foreground italic">Checking...</span>
                      ) : currentStep.option1Result ? (
                        <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded">✓ Palindrome</span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-500/10 px-2 py-1 rounded">✗ Mismatch</span>
                      )}
                    </div>
                  </div>

                  {/* Option 2 */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    currentStep.option2Active 
                      ? "bg-primary/5 border-primary font-medium" 
                      : "bg-muted/10 border-border"
                  }`}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-foreground">Option 2: Skip right character s[3] ('c')</span>
                      <span className="text-[11px] text-muted-foreground">Check if s[1..2] ("bb") is a palindrome</span>
                    </div>
                    <div>
                      {currentStep.option2Result === null ? (
                        <span className="text-xs text-muted-foreground italic">Pending</span>
                      ) : currentStep.option2Result ? (
                        <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded">✓ Palindrome</span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-500/10 px-2 py-1 rounded">✗ Mismatch</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Commentary (Black and White) */}
          <div className="mt-auto">
            <Card className="p-5 border-l-4 border-foreground/30 bg-muted/30 shadow-sm">
              <h4 className="text-[11px] font-bold text-muted-foreground mb-2">
                Commentary
              </h4>
              <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {currentStep.explanation}
              </p>
            </Card>
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
