import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  input: string;
  currentIdx: number;
  stack: string[];
  currentChar: string;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
  isValid?: boolean;
}

export const ValidParenthesesVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const input = "({[]})";
  
  const steps: Step[] = [
    {
      input,
      currentIdx: -1,
      stack: [],
      currentChar: '',
      variables: { s: '({[]})' },
      message: "Start: Use stack to match opening/closing brackets",
      lineNumber: 1
    },
    {
      input,
      currentIdx: 0,
      stack: ['('],
      currentChar: '(',
      variables: { i: 0, char: '(', stack: ['('] },
      message: "Opening '(' - push to stack",
      lineNumber: 6
    },
    {
      input,
      currentIdx: 1,
      stack: ['(', '{'],
      currentChar: '{',
      variables: { i: 1, char: '{', stack: ['(', '{'] },
      message: "Opening '{' - push to stack",
      lineNumber: 6
    },
    {
      input,
      currentIdx: 2,
      stack: ['(', '{', '['],
      currentChar: '[',
      variables: { i: 2, char: '[', stack: ['(', '{', '['] },
      message: "Opening '[' - push to stack",
      lineNumber: 6
    },
    {
      input,
      currentIdx: 3,
      stack: ['(', '{'],
      currentChar: ']',
      variables: { i: 3, char: ']', top: '[', match: true },
      message: "Closing ']' - matches '[' on stack. Pop!",
      lineNumber: 13
    },
    {
      input,
      currentIdx: 4,
      stack: ['('],
      currentChar: '}',
      variables: { i: 4, char: '}', top: '{', match: true },
      message: "Closing '}' - matches '{' on stack. Pop!",
      lineNumber: 13
    },
    {
      input,
      currentIdx: 5,
      stack: [],
      currentChar: ')',
      variables: { i: 5, char: ')', top: '(', match: true },
      message: "Closing ')' - matches '(' on stack. Pop!",
      lineNumber: 13
    },
    {
      input,
      currentIdx: 5,
      stack: [],
      currentChar: ')',
      variables: { stack: [], valid: true },
      message: "Stack empty! All brackets matched. Valid! Time: O(n), Space: O(n)",
      lineNumber: 18,
      isValid: true
    }
  ];

  const code = `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      // Opening bracket - push to stack
      stack.push(char);
    } else {
      // Closing bracket - check if matches top of stack
      if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
        return false;
      }
      stack.pop();
    }
  }
  
  // Valid if stack is empty (all brackets matched)
  return stack.length === 0;
}`;

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => setCurrentStepIndex(0);

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleReset} disabled={currentStepIndex === 0}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleStepBack} disabled={currentStepIndex === 0}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleStepForward} disabled={currentStepIndex === steps.length - 1}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm font-medium">
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Visualization */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Valid Parentheses</h3>

            <div className="space-y-4">
              {/* Input String */}
              <div>
                <div className="text-sm font-semibold mb-2">Input String:</div>
                <div className="flex gap-1">
                  {input.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 flex items-center justify-center rounded font-mono text-lg font-bold ${
                        idx === currentStep.currentIdx
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                          : idx < currentStep.currentIdx
                          ? 'bg-secondary/50'
                          : 'bg-muted'
                      }`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Character */}
              {currentStep.currentChar && (
                <div className="p-4 bg-primary/20 rounded border border-primary/30">
                  <div className="text-sm font-semibold mb-1">Current Character:</div>
                  <div className="text-2xl font-bold font-mono text-primary">
                    '{currentStep.currentChar}'
                  </div>
                </div>
              )}

              {/* Stack */}
              <div>
                <div className="text-sm font-semibold mb-2">Stack (Bottom → Top):</div>
                <div className="flex gap-2">
                  {currentStep.stack.length > 0 ? (
                    currentStep.stack.map((item, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 flex items-center justify-center rounded bg-accent text-accent-foreground font-mono text-lg font-bold"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground italic">Empty</div>
                  )}
                </div>
              </div>

              {/* Result */}
              {currentStep.isValid !== undefined && (
                <div className={`p-4 rounded ${
                  currentStep.isValid ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
                }`}>
                  <div className="text-sm font-semibold mb-1">Result:</div>
                  <div className="text-xl font-bold">
                    {currentStep.isValid ? '✓ Valid' : '✗ Invalid'}
                  </div>
                </div>
              )}

              {/* Variables */}
              <div>
                <div className="text-sm font-semibold mb-2">Variables:</div>
                <div className="p-3 bg-muted/50 rounded text-xs font-mono space-y-1">
                  {Object.entries(currentStep.variables).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{key}:</span>{' '}
                      <span className="text-primary">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded text-sm">
              {currentStep.message}
            </div>
          </Card>
        </div>

        {/* Code */}
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript Code</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber) => ({
                style: {
                  backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent',
                  display: 'block',
                  width: '100%'
                }
              })}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
