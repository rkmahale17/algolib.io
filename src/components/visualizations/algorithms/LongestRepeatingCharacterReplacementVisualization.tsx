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
  k: number;
  left: number;
  right: number;
  charCount: Record<string, number>;
  maxCount: number;
  maxLength: number;
  message: string;
  highlightedLines: number[];
}

export const LongestRepeatingCharacterReplacementVisualization = () => {
  const code = `function characterReplacement(s: string, k: number): number {
  let left = 0;
  let maxCount = 0;
  let maxLength = 0;
  const charCount: Record<string, number> = {};
  
  for (let right = 0; right < s.length; right++) {
    charCount[s[right]] = (charCount[s[right]] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[s[right]]);
    
    while (right - left + 1 - maxCount > k) {
      charCount[s[left]]--;
      left++;
    }
    
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`;

  const steps: Step[] = [
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: -1,
      charCount: {},
      maxCount: 0,
      maxLength: 0,
      message: "Initialize: left=0, right will start at 0, k=1 (can replace 1 char)",
      highlightedLines: [2, 3, 4, 5]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 0,
      charCount: { A: 1 },
      maxCount: 1,
      maxLength: 1,
      message: "right=0: Add 'A' to window, charCount['A']=1, maxCount=1, window='A' (valid)",
      highlightedLines: [8, 9]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 0,
      charCount: { A: 1 },
      maxCount: 1,
      maxLength: 1,
      message: "Window size (1) - maxCount (1) = 0 ≤ k (1), no shrink needed",
      highlightedLines: [11]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 0,
      charCount: { A: 1 },
      maxCount: 1,
      maxLength: 1,
      message: "Update maxLength = max(0, 1) = 1",
      highlightedLines: [15]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 1,
      charCount: { A: 2 },
      maxCount: 2,
      maxLength: 2,
      message: "right=1: Add 'A' to window, charCount['A']=2, maxCount=2, window='AA'",
      highlightedLines: [8, 9]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 1,
      charCount: { A: 2 },
      maxCount: 2,
      maxLength: 2,
      message: "Window size (2) - maxCount (2) = 0 ≤ k, maxLength=2",
      highlightedLines: [11, 15]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 2,
      charCount: { A: 2, B: 1 },
      maxCount: 2,
      maxLength: 3,
      message: "right=2: Add 'B' to window, charCount['B']=1, window='AAB' (can replace 1 B)",
      highlightedLines: [8, 9]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 2,
      charCount: { A: 2, B: 1 },
      maxCount: 2,
      maxLength: 3,
      message: "Window size (3) - maxCount (2) = 1 ≤ k, valid window, maxLength=3",
      highlightedLines: [11, 15]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 3,
      charCount: { A: 3, B: 1 },
      maxCount: 3,
      maxLength: 4,
      message: "right=3: Add 'A' to window, charCount['A']=3, maxCount=3, window='AABA'",
      highlightedLines: [8, 9]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 3,
      charCount: { A: 3, B: 1 },
      maxCount: 3,
      maxLength: 4,
      message: "Window size (4) - maxCount (3) = 1 ≤ k, maxLength=4",
      highlightedLines: [11, 15]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 4,
      charCount: { A: 3, B: 2 },
      maxCount: 3,
      maxLength: 4,
      message: "right=4: Add 'B' to window, charCount['B']=2, window='AABAB'",
      highlightedLines: [8, 9]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 0,
      right: 4,
      charCount: { A: 3, B: 2 },
      maxCount: 3,
      maxLength: 4,
      message: "Window size (5) - maxCount (3) = 2 > k (1), need to shrink!",
      highlightedLines: [11]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 1,
      right: 4,
      charCount: { A: 2, B: 2 },
      maxCount: 3,
      maxLength: 4,
      message: "Shrink: Remove 'A' from left, charCount['A']=2, left=1, window='ABAB'",
      highlightedLines: [12, 13]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 1,
      right: 4,
      charCount: { A: 2, B: 2 },
      maxCount: 3,
      maxLength: 4,
      message: "Window size (4) - maxCount (3) = 1 ≤ k, valid again",
      highlightedLines: [11, 15]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 1,
      right: 5,
      charCount: { A: 2, B: 3 },
      maxCount: 3,
      maxLength: 5,
      message: "right=5: Add 'B' to window, charCount['B']=3, maxCount=3, window='ABABB'",
      highlightedLines: [8, 9]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 1,
      right: 5,
      charCount: { A: 2, B: 3 },
      maxCount: 3,
      maxLength: 5,
      message: "Window size (5) - maxCount (3) = 2 > k, need to shrink again",
      highlightedLines: [11]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 2,
      right: 5,
      charCount: { A: 1, B: 3 },
      maxCount: 3,
      maxLength: 5,
      message: "Shrink: Remove 'A' from left, charCount['A']=1, left=2, window='BABB'",
      highlightedLines: [12, 13]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 2,
      right: 5,
      charCount: { A: 1, B: 3 },
      maxCount: 3,
      maxLength: 5,
      message: "Window size (4) - maxCount (3) = 1 ≤ k, valid",
      highlightedLines: [11, 15]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 2,
      right: 6,
      charCount: { A: 2, B: 3 },
      maxCount: 3,
      maxLength: 5,
      message: "right=6: Add 'A' to window, charCount['A']=2, window='BABBA'",
      highlightedLines: [8, 9]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 2,
      right: 6,
      charCount: { A: 2, B: 3 },
      maxCount: 3,
      maxLength: 5,
      message: "Window size (5) - maxCount (3) = 2 > k, shrink needed",
      highlightedLines: [11]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 3,
      right: 6,
      charCount: { A: 2, B: 2 },
      maxCount: 3,
      maxLength: 5,
      message: "Shrink: Remove 'B' from left, charCount['B']=2, left=3, window='ABBA'",
      highlightedLines: [12, 13]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 3,
      right: 6,
      charCount: { A: 2, B: 2 },
      maxCount: 3,
      maxLength: 5,
      message: "Window size (4) - maxCount (3) = 1 ≤ k, valid window",
      highlightedLines: [11, 15]
    },
    {
      s: "AABABBA",
      k: 1,
      left: 3,
      right: 6,
      charCount: { A: 2, B: 2 },
      maxCount: 3,
      maxLength: 4,
      message: "Complete! Max length = 4 (substring 'AABA' at indices 0-3)",
      highlightedLines: [18]
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

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={handleStepBack} disabled={currentStepIndex === 0} variant="outline" size="sm">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={handleStepForward} disabled={currentStepIndex === steps.length - 1} variant="outline" size="sm">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">String: "{currentStep.s}" (k={currentStep.k})</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {currentStep.s.split('').map((char, idx) => {
                const isInWindow = idx >= currentStep.left && idx <= currentStep.right && currentStep.right >= 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`w-12 h-12 flex items-center justify-center rounded font-mono font-bold text-lg border-2 ${
                      isInWindow
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-muted/50 border-border text-muted-foreground'
                    }`}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Window:</span>
                <span className="font-mono font-bold text-primary">
                  {currentStep.right >= 0 
                    ? currentStep.s.slice(currentStep.left, currentStep.right + 1)
                    : 'empty'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Window Size:</span>
                <span className="font-mono font-bold">
                  {currentStep.right >= 0 ? currentStep.right - currentStep.left + 1 : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Replacements Needed:</span>
                <span className="font-mono font-bold">
                  {currentStep.right >= 0 
                    ? Math.max(0, (currentStep.right - currentStep.left + 1) - currentStep.maxCount)
                    : 0}
                </span>
              </div>
            </div>

            {Object.entries(currentStep.charCount).length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Character Counts:</h4>
                <div className="space-y-2">
                  {Object.entries(currentStep.charCount).map(([char, count]) => (
                    <motion.div
                      key={char}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex justify-between items-center p-2 bg-muted/50 rounded"
                    >
                      <span className="font-mono font-bold">{char}</span>
                      <span className="font-mono text-primary">{count}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <VariablePanel
              variables={{
                k: currentStep.k,
                left: currentStep.left,
                right: currentStep.right,
                maxCount: currentStep.maxCount,
                maxLength: currentStep.maxLength
              }}
            />

            <Card className="p-4 mt-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-foreground">{currentStep.message}</p>
            </Card>
          </Card>
        </div>

        <div className="space-y-4">
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
                  glyphMargin: false,
                  folding: false,
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
