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
  i: number;
  left: number;
  right: number;
  count: number;
  phase: string;
  message: string;
  highlightedLines: number[];
}

export const PalindromicSubstringsVisualization = () => {
  const code = `function countSubstrings(s: string): number {
  let count = 0;
  
  function expand(left: number, right: number): void {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++;
      left--;
      right++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  
  return count;
}`;

  const steps: Step[] = [
    { s: "aaa", i: -1, left: -1, right: -1, count: 0, phase: "init", message: "Initialize: count=0", highlightedLines: [2] },
    
    { s: "aaa", i: 0, left: 0, right: 0, count: 0, phase: "odd", message: "i=0: Start odd expansion from center 'a'", highlightedLines: [12] },
    { s: "aaa", i: 0, left: 0, right: 0, count: 0, phase: "odd", message: "Check: s[0]='a' == s[0]='a' ✓", highlightedLines: [5] },
    { s: "aaa", i: 0, left: 0, right: 0, count: 1, phase: "odd", message: "Found palindrome 'a'. count=1", highlightedLines: [6] },
    { s: "aaa", i: 0, left: -1, right: 1, count: 1, phase: "odd", message: "Expand: left=-1 out of bounds ✗", highlightedLines: [7] },
    
    { s: "aaa", i: 0, left: 0, right: 1, count: 1, phase: "even", message: "i=0: Start even expansion between positions 0 and 1", highlightedLines: [13] },
    { s: "aaa", i: 0, left: 0, right: 1, count: 1, phase: "even", message: "Check: s[0]='a' == s[1]='a' ✓", highlightedLines: [5] },
    { s: "aaa", i: 0, left: 0, right: 1, count: 2, phase: "even", message: "Found palindrome 'aa'. count=2", highlightedLines: [6] },
    { s: "aaa", i: 0, left: -1, right: 2, count: 2, phase: "even", message: "Expand: left=-1 out of bounds ✗", highlightedLines: [7] },
    
    { s: "aaa", i: 1, left: 1, right: 1, count: 2, phase: "odd", message: "i=1: Start odd expansion from center 'a'", highlightedLines: [12] },
    { s: "aaa", i: 1, left: 1, right: 1, count: 2, phase: "odd", message: "Check: s[1]='a' == s[1]='a' ✓", highlightedLines: [5] },
    { s: "aaa", i: 1, left: 1, right: 1, count: 3, phase: "odd", message: "Found palindrome 'a'. count=3", highlightedLines: [6] },
    { s: "aaa", i: 1, left: 0, right: 2, count: 3, phase: "odd", message: "Expand: Check s[0]='a' == s[2]='a' ✓", highlightedLines: [5] },
    { s: "aaa", i: 1, left: 0, right: 2, count: 4, phase: "odd", message: "Found palindrome 'aaa'. count=4", highlightedLines: [6] },
    { s: "aaa", i: 1, left: -1, right: 3, count: 4, phase: "odd", message: "Expand: left=-1 out of bounds ✗", highlightedLines: [7] },
    
    { s: "aaa", i: 1, left: 1, right: 2, count: 4, phase: "even", message: "i=1: Start even expansion between positions 1 and 2", highlightedLines: [13] },
    { s: "aaa", i: 1, left: 1, right: 2, count: 4, phase: "even", message: "Check: s[1]='a' == s[2]='a' ✓", highlightedLines: [5] },
    { s: "aaa", i: 1, left: 1, right: 2, count: 5, phase: "even", message: "Found palindrome 'aa'. count=5", highlightedLines: [6] },
    { s: "aaa", i: 1, left: 0, right: 3, count: 5, phase: "even", message: "Expand: right=3 out of bounds ✗", highlightedLines: [7] },
    
    { s: "aaa", i: 2, left: 2, right: 2, count: 5, phase: "odd", message: "i=2: Start odd expansion from center 'a'", highlightedLines: [12] },
    { s: "aaa", i: 2, left: 2, right: 2, count: 5, phase: "odd", message: "Check: s[2]='a' == s[2]='a' ✓", highlightedLines: [5] },
    { s: "aaa", i: 2, left: 2, right: 2, count: 6, phase: "odd", message: "Found palindrome 'a'. count=6", highlightedLines: [6] },
    { s: "aaa", i: 2, left: 1, right: 3, count: 6, phase: "odd", message: "Expand: right=3 out of bounds ✗", highlightedLines: [7] },
    
    { s: "aaa", i: 2, left: 2, right: 3, count: 6, phase: "even", message: "i=2: Even expansion, right=3 out of bounds ✗", highlightedLines: [13] },
    
    { s: "aaa", i: -1, left: -1, right: -1, count: 6, phase: "done", message: "Complete! Total palindromic substrings = 6", highlightedLines: [16] }
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
          className: 'highlighted-line'
        }
      }));
      editorRef.current.createDecorationsCollection(decorations);
    }
  }, [currentStepIndex]);

  const getCharClass = (idx: number) => {
    if (idx === currentStep.i) return 'bg-yellow-500/30 border-yellow-500 ring-2 ring-yellow-500';
    if (idx >= currentStep.left && idx <= currentStep.right && currentStep.left >= 0) {
      return 'bg-primary/30 border-primary';
    }
    return 'bg-muted/50 border-border';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button onClick={() => setCurrentStepIndex(0)} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} 
            disabled={currentStepIndex === 0} 
            variant="outline" 
            size="sm"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} 
            disabled={currentStepIndex === steps.length - 1} 
            variant="outline" 
            size="sm"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">String: "{currentStep.s}"</h3>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                currentStep.phase === 'odd' ? 'bg-blue-500/20 text-blue-600' :
                currentStep.phase === 'even' ? 'bg-purple-500/20 text-purple-600' :
                currentStep.phase === 'done' ? 'bg-green-500/20 text-green-600' :
                'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep.phase === 'odd' ? 'ODD' : 
               currentStep.phase === 'even' ? 'EVEN' : 
               currentStep.phase === 'done' ? 'DONE' : 'INIT'}
            </motion.div>
          </div>

          <div className="flex gap-2 mb-6">
            {currentStep.s.split('').map((char, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.9 }}
                animate={{ 
                  scale: idx === currentStep.i ? 1.15 : 
                         (idx >= currentStep.left && idx <= currentStep.right && currentStep.left >= 0) ? 1.1 : 1
                }}
                transition={{ duration: 0.2 }}
                className={`w-12 h-12 flex items-center justify-center rounded font-mono font-bold border-2 transition-all ${getCharClass(idx)}`}
              >
                {char}
              </motion.div>
            ))}
          </div>

          <motion.div
            key={currentStep.count}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-green-500/10 rounded border border-green-500/30 mb-4"
          >
            <p className="text-3xl font-bold text-green-600 text-center">{currentStep.count}</p>
            <p className="text-xs text-center text-muted-foreground mt-1">Palindromes Found</p>
          </motion.div>

          <VariablePanel
            variables={{
              i: currentStep.i,
              left: currentStep.left,
              right: currentStep.right,
              count: currentStep.count
            }}
          />

          <Card className="p-4 mt-4 bg-primary/5 border-primary/20">
            <p className="text-sm">{currentStep.message}</p>
          </Card>
        </Card>

        <Card className="p-4">
          <div className="h-[700px]">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false
              }}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                monacoRef.current = monaco;
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
