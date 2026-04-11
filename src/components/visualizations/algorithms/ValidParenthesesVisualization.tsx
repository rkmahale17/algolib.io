import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';

interface Step {
  s: string;
  idx: number;
  stack: string[];
  currentChar?: string;
  action: string;
  isValid?: boolean;
  message: string;
  highlightedLines: number[];
}

export const ValidParenthesesVisualization = () => {
  const code = `function isValid(s: string): boolean {
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
}`;

  const steps: Step[] = [
    {
      s: "({[]})",
      idx: -1,
      stack: [],
      action: "initialization",
      message: "First, we initialize an empty stack to keep track of opening brackets as we encounter them.",
      highlightedLines: [2]
    },
    {
      s: "({[]})",
      idx: -1,
      stack: [],
      action: "initialization",
      message: "We also define a map that links each closing bracket to its corresponding opening bracket.",
      highlightedLines: [3, 4, 5, 6, 7]
    },
    // Iteration 0: '('
    {
      s: "({[]})",
      idx: 0,
      stack: [],
      currentChar: "(",
      action: "loop",
      message: "Iteration 0: We start the loop for the first character in the string.",
      highlightedLines: [9]
    },
    {
      s: "({[]})",
      idx: 0,
      stack: [],
      currentChar: "(",
      action: "assignment",
      message: "The current character is '('.",
      highlightedLines: [10]
    },
    {
      s: "({[]})",
      idx: 0,
      stack: [],
      currentChar: "(",
      action: "checking",
      message: "We check if '(' is a closing bracket by looking it up in our 'map'.",
      highlightedLines: [12]
    },
    {
      s: "({[]})",
      idx: 0,
      stack: [],
      currentChar: "(",
      action: "pushing",
      message: "'(' is not in the map (it's an opening bracket), so we move to the else block to push it onto the stack.",
      highlightedLines: [17, 18]
    },
    {
      s: "({[]})",
      idx: 0,
      stack: ["("],
      currentChar: "(",
      action: "pushed",
      message: "The stack now contains: ['('].",
      highlightedLines: [18]
    },
    // Iteration 1: '{'
    {
      s: "({[]})",
      idx: 1,
      stack: ["("],
      currentChar: "{",
      action: "loop",
      message: "Iteration 1: Moving to the next character in the string.",
      highlightedLines: [9]
    },
    {
      s: "({[]})",
      idx: 1,
      stack: ["("],
      currentChar: "{",
      action: "assignment",
      message: "The current character is now '{'.",
      highlightedLines: [10]
    },
    {
      s: "({[]})",
      idx: 1,
      stack: ["("],
      currentChar: "{",
      action: "checking",
      message: "Checking if '{' is a closing bracket. It's not.",
      highlightedLines: [12]
    },
    {
      s: "({[]})",
      idx: 1,
      stack: ["(", "{"],
      currentChar: "{",
      action: "pushed",
      message: "'{' is pushed onto the stack. Stack: ['(', '{'].",
      highlightedLines: [18]
    },
    // Iteration 2: '['
    {
      s: "({[]})",
      idx: 2,
      stack: ["(", "{"],
      currentChar: "[",
      action: "loop",
      message: "Iteration 2: Next character.",
      highlightedLines: [9]
    },
    {
      s: "({[]})",
      idx: 2,
      stack: ["(", "{", "["],
      currentChar: "[",
      action: "pushed",
      message: "'[' is an opening bracket, so we push it. Stack: ['(', '{', '['].",
      highlightedLines: [18]
    },
    // Iteration 3: ']'
    {
      s: "({[]})",
      idx: 3,
      stack: ["(", "{", "["],
      currentChar: "]",
      action: "loop",
      message: "Iteration 3: Reached a closing bracket ']'.",
      highlightedLines: [9, 10]
    },
    {
      s: "({[]})",
      idx: 3,
      stack: ["(", "{", "["],
      currentChar: "]",
      action: "checking",
      message: "']' IS in the map, so we enter the matching logic.",
      highlightedLines: [12]
    },
    {
      s: "({[]})",
      idx: 3,
      stack: ["(", "{", "["],
      currentChar: "]",
      action: "validating",
      message: "We check if the stack is empty or if the top element matches the opening bracket for ']'.",
      highlightedLines: [13]
    },
    {
      s: "({[]})",
      idx: 3,
      stack: ["(", "{", "["],
      currentChar: "]",
      action: "validating",
      message: "The top of the stack is '[', which matches map[']'].",
      highlightedLines: [13]
    },
    {
      s: "({[]})",
      idx: 3,
      stack: ["(", "{"],
      currentChar: "]",
      action: "popping",
      message: "Match found! We pop '[' from the stack.",
      highlightedLines: [16]
    },
    // Iteration 4: '}'
    {
      s: "({[]})",
      idx: 4,
      stack: ["(", "{"],
      currentChar: "}",
      action: "checking",
      message: "Iteration 4: char='}'. It's in the map.",
      highlightedLines: [12]
    },
    {
      s: "({[]})",
      idx: 4,
      stack: ["(", "{"],
      currentChar: "}",
      action: "validating",
      message: "Stack top '{' matches map['}'].",
      highlightedLines: [13]
    },
    {
      s: "({[]})",
      idx: 4,
      stack: ["("],
      currentChar: "}",
      action: "popping",
      message: "Popping '{'. Stack now: ['('].",
      highlightedLines: [16]
    },
    // Iteration 5: ')'
    {
      s: "({[]})",
      idx: 5,
      stack: ["("],
      currentChar: ")",
      action: "checking",
      message: "Iteration 5: char=')'. Matches stack top '('.",
      highlightedLines: [12, 13]
    },
    {
      s: "({[]})",
      idx: 5,
      stack: [],
      currentChar: ")",
      action: "popping",
      message: "Popping '('. The stack is now empty.",
      highlightedLines: [16]
    },
    // Completion
    {
      s: "({[]})",
      idx: 6,
      stack: [],
      action: "loop end",
      message: "The string has been fully processed.",
      highlightedLines: [20]
    },
    {
      s: "({[]})",
      idx: 6,
      stack: [],
      isValid: true,
      action: "final check",
      message: "Since the stack is empty, all parentheses were correctly matched. Return true.",
      highlightedLines: [22]
    }
  ];


  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Input String</h3>
              <div className="flex gap-2">
                {currentStep.s.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-lg border-2 transition-colors duration-200 ${idx === currentStep.idx
                      ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]'
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
              <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Stack</h3>
              <div className="h-24 border-2 border-dashed border-border rounded-xl p-4 bg-muted/30 flex items-end">
                <AnimatePresence mode="popLayout">
                  {currentStep.stack.length > 0 ? (
                    <div className="flex gap-2">
                      {currentStep.stack.map((item, idx) => (
                        <motion.div
                          key={`${idx}-${item}`}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-bold shadow-lg"
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full text-center text-sm text-muted-foreground italic">
                      Stack is empty
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-bold text-primary mr-2">Step {currentStepIndex}:</span>
                  {currentStep.message}
                </p>
              </div>

              <VariablePanel
                variables={{
                  index: currentStep.idx === -1 ? 'None' : currentStep.idx,
                  character: currentStep.currentChar || 'None',
                  stackSize: currentStep.stack.length,
                  action: currentStep.action.charAt(0).toUpperCase() + currentStep.action.slice(1),
                  status: currentStep.isValid === undefined ? 'Processing' : (currentStep.isValid ? 'Valid' : 'Invalid')
                }}
              />

              {currentStep.isValid !== undefined && (
                <div className={`p-4 rounded-lg border flex items-center justify-center gap-3 ${currentStep.isValid
                  ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                  }`}>
                  <span className="text-xl font-bold">
                    {currentStep.isValid ? '✓ Valid Parentheses' : '✗ Invalid Structure'}
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