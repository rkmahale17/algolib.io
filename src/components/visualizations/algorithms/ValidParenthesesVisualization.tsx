import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

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
      action: "initialize",
      message: "Initialize empty stack and mapping for closing brackets",
      highlightedLines: [2]
    },
    {
      s: "({[]})",
      idx: 0,
      stack: [],
      currentChar: "(",
      action: "push",
      message: "i=0: char='(' is opening bracket, push to stack",
      highlightedLines: [10]
    },
    {
      s: "({[]})",
      idx: 0,
      stack: ["("],
      currentChar: "(",
      action: "pushed",
      message: "Stack after push: ['(']",
      highlightedLines: [17]
    },
    {
      s: "({[]})",
      idx: 1,
      stack: ["("],
      currentChar: "{",
      action: "push",
      message: "i=1: char='{' is opening bracket, push to stack",
      highlightedLines: [17]
    },
    {
      s: "({[]})",
      idx: 1,
      stack: ["(", "{"],
      currentChar: "{",
      action: "pushed",
      message: "Stack after push: ['(', '{']",
      highlightedLines: [17]
    },
    {
      s: "({[]})",
      idx: 2,
      stack: ["(", "{"],
      currentChar: "[",
      action: "push",
      message: "i=2: char='[' is opening bracket, push to stack",
      highlightedLines: [17]
    },
    {
      s: "({[]})",
      idx: 2,
      stack: ["(", "{", "["],
      currentChar: "[",
      action: "pushed",
      message: "Stack after push: ['(', '{', '[']",
      highlightedLines: [17]
    },
    {
      s: "({[]})",
      idx: 3,
      stack: ["(", "{", "["],
      currentChar: "]",
      action: "check",
      message: "i=3: char=']' is closing bracket, check if matches top of stack",
      highlightedLines: [12]
    },
    {
      s: "({[]})",
      idx: 3,
      stack: ["(", "{"],
      currentChar: "]",
      action: "popped",
      message: "Stack top '[' matches. Pop. Stack now: ['(', '{']",
      highlightedLines: [15]
    },
    {
      s: "({[]})",
      idx: 4,
      stack: ["(", "{"],
      currentChar: "}",
      action: "check",
      message: "i=4: char='}' is closing bracket, check if matches top",
      highlightedLines: [12]
    },
    {
      s: "({[]})",
      idx: 4,
      stack: ["("],
      currentChar: "}",
      action: "popped",
      message: "Stack top '{' matches. Pop. Stack now: ['(']",
      highlightedLines: [15]
    },
    {
      s: "({[]})",
      idx: 5,
      stack: ["("],
      currentChar: ")",
      action: "check",
      message: "i=5: char=')' is closing bracket, check if matches top",
      highlightedLines: [12]
    },
    {
      s: "({[]})",
      idx: 5,
      stack: [],
      currentChar: ")",
      action: "popped",
      message: "Stack top '(' matches. Pop. Stack now: []",
      highlightedLines: [15]
    },
    {
      s: "({[]})",
      idx: 6,
      stack: [],
      isValid: true,
      action: "result",
      message: "Stack is empty! All brackets matched. Return true ✓",
      highlightedLines: [21]
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const decorations = currentStep.highlightedLines.map(line => ({
        range: new monacoRef.current!.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-line',
        }
      }));
      editorRef.current.createDecorationsCollection(decorations);
    }
  }, [currentStepIndex, currentStep.highlightedLines]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => setCurrentStepIndex(0)} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} variant="outline" size="sm">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1} variant="outline" size="sm">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Input String</h3>
            <div className="flex gap-2 mb-6">
              {currentStep.s.split('').map((char, idx) => (
                <motion.div
                  key={idx}
                  animate={{ scale: idx === currentStep.idx ? 1.1 : 1 }}
                  className={`w-12 h-12 flex items-center justify-center rounded font-mono font-bold text-lg border-2 ${
                    idx === currentStep.idx ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary' : idx < currentStep.idx ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/50 border-border'
                  }`}
                >
                  {char}
                </motion.div>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3">Stack</h4>
              <div className="min-h-[60px] border-2 border-dashed rounded-lg p-3 bg-muted/20">
                {currentStep.stack.length > 0 ? (
                  <div className="flex gap-2">
                    {currentStep.stack.map((item, idx) => (
                      <motion.div key={idx} initial={{ scale: 0.5, y: -20 }} animate={{ scale: 1, y: 0 }} className="w-12 h-12 flex items-center justify-center rounded bg-primary/20 border-2 border-primary font-mono font-bold">
                        {item}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">Empty</p>
                )}
              </div>
            </div>

            <VariablePanel variables={{ index: currentStep.idx, currentChar: currentStep.currentChar || 'N/A', stackSize: currentStep.stack.length, action: currentStep.action }} />

            {currentStep.isValid !== undefined && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`p-4 rounded mt-4 ${currentStep.isValid ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                <p className={`text-lg font-bold ${currentStep.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStep.isValid ? '✓ Valid Parentheses' : '✗ Invalid'}
                </p>
              </motion.div>
            )}

            <Card className="p-4 mt-4 bg-primary/5 border-primary/20">
              <p className="text-sm">{currentStep.message}</p>
            </Card>
          </Card>
        </div>

        <Card className="p-4">
          <div className="h-[700px]">
            <Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(editor, monaco) => { editorRef.current = editor; monacoRef.current = monaco; }} />
          </div>
        </Card>
      </div>

      <style>{`.highlighted-line { background: rgba(59, 130, 246, 0.15); border-left: 3px solid rgb(59, 130, 246); }`}</style>
    </div>
  );
};