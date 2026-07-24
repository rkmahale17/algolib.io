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
  callStack: string[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function reverseString(s: string[]): void {
    function reverse(left: number, right: number): void {
        if (left < right) {
            [s[left], s[right]] = [s[right], s[left]];
            reverse(left + 1, right - 1);
        }
    }
    reverse(0, s.length - 1);
}`,

  python: `def reverseString(s: list[str]) -> None:
    def _reverse(left: int, right: int) -> None:
        if left < right:
            s[left], s[right] = s[right], s[left]
            _reverse(left + 1, right - 1)
    _reverse(0, len(s) - 1)`,

  java: `class Solution {
    public void reverseString(char[] s) {
        reverse(s, 0, s.length - 1);
    }
    private void reverse(char[] s, int left, int right) {
        if (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            reverse(s, left + 1, right - 1);
        }
    }
}`,

  cpp: `class Solution {
public:
    void reverseString(vector<char>& s) {
        reverseHelper(s, 0, (int)s.size() - 1);
    }
private:
    void reverseHelper(vector<char>& s, int left, int right) {
        if (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            reverseHelper(s, left + 1, right - 1);
        }
    }
};`,
};

function generateVisualizationData() {
  const initialString = ["h", "e", "l", "l", "o"];
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

  // Step 1: Init helper call
  steps.push({
    s: [...initialString],
    left: 0,
    right: 4,
    callStack: [],
    variables: { s: `["h", "e", "l", "l", "o"]`, left: "-", right: "-", "stack_depth": 0 },
    explanation: "Start the process by initiating the helper function. We set the initial left pointer to 0 and the right pointer to s.length - 1 (index 4).",
    pseudoStep: "CALL reverse(s, 0, 4)"
  });
  addLines(8, 6, 3, 4);

  // Step 2: reverse(0, 4) - Check condition
  steps.push({
    s: ["h", "e", "l", "l", "o"],
    left: 0,
    right: 4,
    callStack: ["reverse(0, 4)"],
    variables: { s: `["h", "e", "l", "l", "o"]`, left: 0, right: 4, "left < right": "0 < 4 → true", "stack_depth": 1 },
    explanation: "Inside reverse(0, 4), verify if left < right. Since 0 < 4 is true, we proceed with the recursive swap.",
    pseudoStep: "IF left (0) < right (4)  →  true"
  });
  addLines(3, 3, 6, 8);

  // Step 3: reverse(0, 4) - Swap
  steps.push({
    s: ["o", "e", "l", "l", "h"],
    left: 0,
    right: 4,
    callStack: ["reverse(0, 4)"],
    variables: { s: `["o", "e", "l", "l", "h"]`, left: 0, right: 4, temp: "h", "stack_depth": 1 },
    explanation: "Swap the characters at the left and right pointers in-place. 'h' at index 0 and 'o' at index 4 swap positions.",
    pseudoStep: "SWAP s[0] ('h') AND s[4] ('o')"
  });
  addLines(4, 4, 7, 9);

  // Step 4: reverse(0, 4) - Call reverse(1, 3)
  steps.push({
    s: ["o", "e", "l", "l", "h"],
    left: 0,
    right: 4,
    callStack: ["reverse(0, 4)"],
    variables: { s: `["o", "e", "l", "l", "h"]`, left: 0, right: 4, "stack_depth": 1 },
    explanation: "Make a recursive call to reverse(1, 3) to process the next inner segment.",
    pseudoStep: "CALL reverse(s, 1, 3)"
  });
  addLines(5, 5, 10, 12);

  // Step 5: reverse(1, 3) - Check condition
  steps.push({
    s: ["o", "e", "l", "l", "h"],
    left: 1,
    right: 3,
    callStack: ["reverse(0, 4)", "reverse(1, 3)"],
    variables: { s: `["o", "e", "l", "l", "h"]`, left: 1, right: 3, "left < right": "1 < 3 → true", "stack_depth": 2 },
    explanation: "In the new stack frame reverse(1, 3), check if left < right. Since 1 < 3 is true, we proceed to swap the next pair.",
    pseudoStep: "IF left (1) < right (3)  →  true"
  });
  addLines(3, 3, 6, 8);

  // Step 6: reverse(1, 3) - Swap
  steps.push({
    s: ["o", "l", "l", "e", "h"],
    left: 1,
    right: 3,
    callStack: ["reverse(0, 4)", "reverse(1, 3)"],
    variables: { s: `["o", "l", "l", "e", "h"]`, left: 1, right: 3, temp: "e", "stack_depth": 2 },
    explanation: "Swap the characters at the left and right pointers. 'e' at index 1 and 'l' at index 3 swap positions.",
    pseudoStep: "SWAP s[1] ('e') AND s[3] ('l')"
  });
  addLines(4, 4, 7, 9);

  // Step 7: reverse(1, 3) - Call reverse(2, 2)
  steps.push({
    s: ["o", "l", "l", "e", "h"],
    left: 1,
    right: 3,
    callStack: ["reverse(0, 4)", "reverse(1, 3)"],
    variables: { s: `["o", "l", "l", "e", "h"]`, left: 1, right: 3, "stack_depth": 2 },
    explanation: "Make a recursive call to reverse(2, 2) to process the center of the array.",
    pseudoStep: "CALL reverse(s, 2, 2)"
  });
  addLines(5, 5, 10, 12);

  // Step 8: reverse(2, 2) - Check condition (Base Case)
  steps.push({
    s: ["o", "l", "l", "e", "h"],
    left: 2,
    right: 2,
    callStack: ["reverse(0, 4)", "reverse(1, 3)", "reverse(2, 2)"],
    variables: { s: `["o", "l", "l", "e", "h"]`, left: 2, right: 2, "left < right": "2 < 2 → false", "stack_depth": 3 },
    explanation: "In stack frame reverse(2, 2), check if left < right. Since 2 < 2 is false, we hit the base case: no more swapping is needed.",
    pseudoStep: "IF left (2) < right (2)  →  false"
  });
  addLines(3, 3, 6, 8);

  // Step 9: Return from reverse(2, 2)
  steps.push({
    s: ["o", "l", "l", "e", "h"],
    left: 2,
    right: 2,
    callStack: ["reverse(0, 4)", "reverse(1, 3)"],
    variables: { s: `["o", "l", "l", "e", "h"]`, left: 2, right: 2, "stack_depth": 2 },
    explanation: "The base case is reached, so the stack frame reverse(2, 2) returns and is popped off the call stack.",
    pseudoStep: "RETURN  (pop reverse(2, 2))"
  });
  addLines(6, 6, 11, 13);

  // Step 10: Return from reverse(1, 3)
  steps.push({
    s: ["o", "l", "l", "e", "h"],
    left: 1,
    right: 3,
    callStack: ["reverse(0, 4)"],
    variables: { s: `["o", "l", "l", "e", "h"]`, left: 1, right: 3, "stack_depth": 1 },
    explanation: "Having completed the inner recursion, the stack frame reverse(1, 3) completes and returns to its caller.",
    pseudoStep: "RETURN  (pop reverse(1, 3))"
  });
  addLines(6, 6, 11, 13);

  // Step 11: Return from reverse(0, 4)
  steps.push({
    s: ["o", "l", "l", "e", "h"],
    left: 0,
    right: 4,
    callStack: [],
    variables: { s: `["o", "l", "l", "e", "h"]`, left: 0, right: 4, "stack_depth": 0 },
    explanation: "The initial helper call reverse(0, 4) completes its execution and returns back to the main function.",
    pseudoStep: "RETURN  (pop reverse(0, 4))"
  });
  addLines(8, 6, 3, 4);

  // Step 12: Final return
  steps.push({
    s: ["o", "l", "l", "e", "h"],
    left: 0,
    right: 4,
    callStack: [],
    variables: { s: `["o", "l", "l", "e", "h"]`, "stack_depth": 0 },
    explanation: "The main function reverseString finishes. The string array is fully reversed in-place.",
    pseudoStep: "RETURN"
  });
  addLines(9, 1, 4, 5);

  return { steps, stepLineNumbers };
}

export const ReverseStringVisualization: React.FC = () => {
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
              Reverse String (Recursive Two Pointers)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative space-y-8">
              {/* Array visual representation */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground mb-6">Character Array</h4>
                <div className="flex gap-3 justify-center items-center">
                  {currentStep.s.map((char, idx) => {
                    const isLeft = idx === currentStep.left && currentStepIndex > 0 && currentStepIndex < 11;
                    const isRight = idx === currentStep.right && currentStepIndex > 0 && currentStepIndex < 11;
                    const isHighlighted = (isLeft || isRight) && currentStepIndex > 0 && currentStepIndex < 11;

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
                        
                        {/* Pointer tags */}
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

              {/* Call Stack representation */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground mb-4">Recursive Call Stack</h4>
                <div className="min-h-[120px] p-4 bg-muted/20 border border-dashed border-border rounded-xl flex flex-col-reverse gap-2 justify-end">
                  {currentStep.callStack.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic text-center my-auto">Empty Stack</span>
                  ) : (
                    currentStep.callStack.map((frame, idx) => {
                      const isActive = idx === currentStep.callStack.length - 1;
                      return (
                        <div 
                          key={idx} 
                          className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
                            isActive
                              ? "bg-primary/10 border-primary text-primary font-semibold shadow-sm"
                              : "bg-muted/40 border-border text-muted-foreground"
                          }`}
                        >
                          <span>{frame}</span>
                          {isActive && (
                            <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-sans uppercase tracking-wider scale-90">active</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
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
