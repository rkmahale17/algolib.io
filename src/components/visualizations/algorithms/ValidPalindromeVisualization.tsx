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
  cleaned: string;
  left: number;
  right: number;
  leftChar?: string;
  rightChar?: string;
  isPalindrome?: boolean;
  message: string;
  highlightedLines: number[];
}

export const ValidPalindromeVisualization = () => {
  const code = `function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  let left = 0;
  let right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}`;

  const steps: Step[] = [
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "",
      left: 0,
      right: 0,
      message: "Original string: 'A man, a plan, a canal: Panama'",
      highlightedLines: [1]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 0,
      right: 0,
      message: "Clean string: lowercase + remove non-alphanumeric → 'amanaplanacanalpanama'",
      highlightedLines: [2]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 0,
      right: 20,
      message: "Initialize: left=0, right=20 (last index)",
      highlightedLines: [4, 5]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 0,
      right: 20,
      leftChar: 'a',
      rightChar: 'a',
      message: "Compare: cleaned[0]='a' vs cleaned[20]='a' → Match ✓",
      highlightedLines: [8]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 1,
      right: 19,
      message: "Move pointers: left++, right-- → left=1, right=19",
      highlightedLines: [11, 12]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 1,
      right: 19,
      leftChar: 'm',
      rightChar: 'm',
      message: "Compare: cleaned[1]='m' vs cleaned[19]='m' → Match ✓",
      highlightedLines: [8]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 2,
      right: 18,
      leftChar: 'a',
      rightChar: 'a',
      message: "Compare: cleaned[2]='a' vs cleaned[18]='a' → Match ✓",
      highlightedLines: [8, 11, 12]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 3,
      right: 17,
      leftChar: 'n',
      rightChar: 'n',
      message: "Compare: cleaned[3]='n' vs cleaned[17]='n' → Match ✓",
      highlightedLines: [8, 11, 12]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 4,
      right: 16,
      leftChar: 'a',
      rightChar: 'a',
      message: "Compare: cleaned[4]='a' vs cleaned[16]='a' → Match ✓",
      highlightedLines: [8, 11, 12]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 5,
      right: 15,
      leftChar: 'p',
      rightChar: 'p',
      message: "Compare: cleaned[5]='p' vs cleaned[15]='p' → Match ✓",
      highlightedLines: [8, 11, 12]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 6,
      right: 14,
      leftChar: 'l',
      rightChar: 'l',
      message: "Compare: cleaned[6]='l' vs cleaned[14]='l' → Match ✓",
      highlightedLines: [8, 11, 12]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 7,
      right: 13,
      leftChar: 'a',
      rightChar: 'a',
      message: "Compare: cleaned[7]='a' vs cleaned[13]='a' → Match ✓",
      highlightedLines: [8, 11, 12]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 8,
      right: 12,
      leftChar: 'n',
      rightChar: 'n',
      message: "Compare: cleaned[8]='n' vs cleaned[12]='n' → Match ✓",
      highlightedLines: [8, 11, 12]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 9,
      right: 11,
      leftChar: 'a',
      rightChar: 'a',
      message: "Compare: cleaned[9]='a' vs cleaned[11]='a' → Match ✓",
      highlightedLines: [8, 11, 12]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 10,
      right: 10,
      message: "Pointers meet: left=10, right=10. Loop exits (left < right is false)",
      highlightedLines: [7]
    },
    {
      s: "A man, a plan, a canal: Panama",
      cleaned: "amanaplanacanalpanama",
      left: 10,
      right: 10,
      isPalindrome: true,
      message: "All characters matched! Return true ✓",
      highlightedLines: [15]
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
            <h3 className="text-lg font-semibold mb-4">Original String</h3>
            <p className="font-mono text-lg mb-6 p-3 bg-muted/50 rounded">"{currentStep.s}"</p>

            {currentStep.cleaned && (
              <>
                <h3 className="text-lg font-semibold mb-4">Cleaned String</h3>
                <div className="flex flex-wrap gap-1 mb-4">
                  {currentStep.cleaned.split('').map((char, idx) => {
                    const isLeft = idx === currentStep.left;
                    const isRight = idx === currentStep.right;
                    const isChecked = idx < currentStep.left || idx > currentStep.right;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.02 }}
                        className={`w-9 h-9 flex items-center justify-center rounded font-mono font-bold text-sm border-2 ${
                          isLeft
                            ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary'
                            : isRight
                            ? 'bg-secondary/20 border-secondary text-secondary-foreground ring-2 ring-secondary'
                            : isChecked
                            ? 'bg-green-500/10 border-green-500/30 text-green-600'
                            : 'bg-muted/50 border-border text-foreground'
                        }`}
                      >
                        {char}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Left Pointer</p>
                    <p className="font-mono font-bold text-primary">
                      {currentStep.left} {currentStep.leftChar && `→ '${currentStep.leftChar}'`}
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded border border-secondary/20">
                    <p className="text-xs text-muted-foreground mb-1">Right Pointer</p>
                    <p className="font-mono font-bold text-secondary-foreground">
                      {currentStep.right} {currentStep.rightChar && `→ '${currentStep.rightChar}'`}
                    </p>
                  </div>
                </div>
              </>
            )}

            <VariablePanel
              variables={{
                left: currentStep.left,
                right: currentStep.right,
                stringLength: currentStep.cleaned.length,
                remaining: Math.max(0, currentStep.right - currentStep.left + 1)
              }}
            />

            {currentStep.isPalindrome !== undefined && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-4 rounded mt-4 ${currentStep.isPalindrome ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}
              >
                <p className={`text-lg font-bold ${currentStep.isPalindrome ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStep.isPalindrome ? '✓ Valid Palindrome' : '✗ Not a Palindrome'}
                </p>
              </motion.div>
            )}

            <Card className="p-4 mt-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-foreground">{currentStep.message}</p>
            </Card>
          </Card>
        </div>

        <Card className="p-4 overflow-hidden">
          <div className="h-[700px]">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineNumbers: 'on',
              }}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                monacoRef.current = monaco;
                const decorations = currentStep.highlightedLines.map(line => ({
                  range: new monaco.Range(line, 1, line, 1),
                  options: {
                    isWholeLine: true,
                    className: 'highlighted-line',
                  }
                }));
                editor.createDecorationsCollection(decorations);
              }}
            />
          </div>
        </Card>
      </div>

      <style>{`
        .highlighted-line {
          background: rgba(59, 130, 246, 0.15);
          border-left: 3px solid rgb(59, 130, 246);
        }
      `}</style>
    </div>
  );
};
