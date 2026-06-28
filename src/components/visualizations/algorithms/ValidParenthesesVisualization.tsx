import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  s: string;
  idx: number;
  stack: string[];
  currentChar?: string;
  action: string;
  isValid?: boolean;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  python: `def isValid(s: str) -> bool:
    stack = []
    closeToOpen = {
        ")": "(",
        "]": "[",
        "}": "{"
    }
    for c in s:
        if c in closeToOpen:
            if stack and stack[-1] == closeToOpen[c]:
                stack.pop()
            else:
                return False
        else:
            stack.append(c)
    return len(stack) == 0`,

  typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char in map) {
      if (stack.length === 0 || stack[stack.length - 1] !== map[char]) {
        return false;
      }
      stack.pop();
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,

  java: `public class Solution {
    public boolean isValid(String s) {
        if (s == null || s.length() == 0) {
            return true;
        }
        Stack<Character> stack = new Stack<>();
        HashMap<Character, Character> map = new HashMap<>();
        map.put(')', '(');
        map.put(']', '[');
        map.put('}', '{');
        for (char c : s.toCharArray()) {
            if (map.containsKey(c)) {
                if (!stack.isEmpty() && stack.peek().equals(map.get(c))) {
                    stack.pop();
                } else {
                    return false;
                }
            } else {
                stack.push(c);
            }
        }
        return stack.isEmpty();
    }
}`,

  cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> mapping = {
            {')', '('}, {'}', '{'}, {']', '['}
        };
        for (char c : s) {
            if (mapping.find(c) != mapping.end()) {
                if (st.empty() || st.top() != mapping[c]) {
                    return false;
                }
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
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

  const stack: string[] = [];
  const map: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
    steps.push({
      s,
      idx: extra.hasOwnProperty('idx') ? extra.idx! : -1,
      stack: [...stack],
      currentChar: extra.currentChar,
      action: extra.action || "processing",
      isValid: extra.isValid,
      explanation: msg,
      pseudoStep: pseudo
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  addStep("Initialize an empty stack to track unmatched opening brackets.", "SET stack = []", 2, 2, 6, 4);

  // 2. Define map
  addStep("Define lookup map for closing-to-opening bracket matches.", "SET map = { ')':'(', '}':'{', ']':'[' }", 3, 3, 7, 5);

  let i = 0;
  for (i = 0; i < s.length; i++) {
    const char = s[i];

    // 3. Loop start
    addStep(`Iteration ${i}: Process character '${char}'.`, `FOR c IN s [i = ${i}]`, 8, 8, 11, 8, { idx: i, currentChar: char, action: "loop" });

    // 4. Check if char in map
    addStep(`Check if '${char}' is a closing bracket.`, `IF c IN map`, 10, 9, 12, 9, { idx: i, currentChar: char, action: "checking" });

    if (char in map) {
      // 5. Check stack top
      const expected = map[char];
      const actual = stack[stack.length - 1];
      const match = stack.length > 0 && actual === expected;

      addStep(
        `Validate stack top: expected opening '${expected}', found '${actual || "empty"}'.`,
        `IF stack AND stack[-1] == map[c]`,
        11, 10, 13, 10,
        { idx: i, currentChar: char, action: "checking" }
      );

      if (match) {
        stack.pop();
        addStep(`Match found! Pop '${expected}' from stack.`, "stack.pop()", 14, 11, 14, 13, { idx: i, currentChar: char, action: "popping" });
      } else {
        addStep(`Mismatch or empty stack for '${char}'! Return false.`, "RETURN False", 12, 13, 16, 11, { idx: i, currentChar: char, action: "checking", isValid: false });
        return { steps, stepLineNumbers };
      }
    } else {
      // 6. Push opening bracket
      stack.push(char);
      addStep(`'${char}' is an opening bracket. Push onto stack.`, "stack.append(c)", 16, 15, 19, 15, { idx: i, currentChar: char, action: "pushing" });
    }
  }

  // 7. Loop complete
  addStep("All characters processed. Check if stack is empty.", "IF len(stack) == 0", 19, 16, 22, 18);

  const isValid = stack.length === 0;
  addStep(
    isValid ? "Stack is empty. All brackets matched successfully!" : `Stack has unmatched opening brackets: ${stack.join(', ')}`,
    `RETURN len(stack) == 0 → ${isValid}`,
    19, 16, 22, 18,
    { isValid }
  );

  return { steps, stepLineNumbers };
};

export const ValidParenthesesVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const s = "({[]})";

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateSteps(s);
  }, [s]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-8">
              <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest">Input String</h3>
              <div className="flex gap-2">
                {currentStep.s.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-lg border-2 transition-all duration-200 ${idx === currentStep.idx
                      ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)] font-bold scale-105'
                      : idx < currentStep.idx
                        ? 'bg-muted border-transparent text-muted-foreground opacity-50'
                        : 'bg-card border-border text-foreground'
                      }`}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest">Stack</h3>
              <div className="h-24 border-2 border-dashed border-border rounded-xl p-4 bg-muted/30 flex items-end justify-center">
                <AnimatePresence mode="popLayout">
                  {currentStep.stack.length > 0 ? (
                    <div className="flex gap-2">
                      {currentStep.stack.map((item, idx) => (
                        <motion.div
                          key={`${idx}-${item}`}
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 20 }}
                          transition={{ duration: 0.2 }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold shadow-lg"
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full text-center text-sm text-muted-foreground italic self-center">
                      Stack is empty
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {currentStep.isValid !== undefined && (
              <div className={`p-4 rounded-lg border flex items-center justify-center gap-3 mb-4 ${currentStep.isValid
                ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 font-bold'
                : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 font-bold'
                }`}>
                <span className="text-base font-bold">
                  {currentStep.isValid ? '✓ Valid Parentheses' : '✗ Invalid Structure'}
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
                index: currentStep.idx === -1 ? 'None' : currentStep.idx,
                character: currentStep.currentChar || 'None',
                stackSize: currentStep.stack.length,
                action: currentStep.action.charAt(0).toUpperCase() + currentStep.action.slice(1),
                status: currentStep.isValid === undefined ? 'Processing' : (currentStep.isValid ? 'Valid' : 'Invalid')
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