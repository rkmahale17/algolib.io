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
  longestPalindrome: string;
  start: number;
  maxLen: number;
  currentLen: number;
  phase: string;
  message: string;
  highlightedLines: number[];
}

export const LongestPalindromicSubstringVisualization = () => {
  const code = `function longestPalindrome(s: string): string {
  let start = 0, maxLen = 0;
  
  function expand(left: number, right: number): void {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const len = right - left + 1;
      if (len > maxLen) {
        maxLen = len;
        start = left;
      }
      left--;
      right++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  
  return s.substring(start, start + maxLen);
}`;

  const steps: Step[] = [
    { s: "babad", i: -1, left: -1, right: -1, longestPalindrome: "", start: 0, maxLen: 0, currentLen: 0, phase: "init", message: "Initialize: start=0, maxLen=0", highlightedLines: [2] },
    
    { s: "babad", i: 0, left: 0, right: 0, longestPalindrome: "", start: 0, maxLen: 0, currentLen: 0, phase: "odd", message: "i=0: Start odd expansion from center 'b'", highlightedLines: [17] },
    { s: "babad", i: 0, left: 0, right: 0, longestPalindrome: "", start: 0, maxLen: 0, currentLen: 0, phase: "odd", message: "Check: s[0]='b' == s[0]='b' ✓", highlightedLines: [5] },
    { s: "babad", i: 0, left: 0, right: 0, longestPalindrome: "b", start: 0, maxLen: 1, currentLen: 1, phase: "odd", message: "Found palindrome 'b' (len=1). Update maxLen=1", highlightedLines: [7] },
    { s: "babad", i: 0, left: -1, right: 1, longestPalindrome: "b", start: 0, maxLen: 1, currentLen: 0, phase: "odd", message: "Expand: left=-1 out of bounds ✗", highlightedLines: [5] },
    
    { s: "babad", i: 0, left: 0, right: 1, longestPalindrome: "b", start: 0, maxLen: 1, currentLen: 0, phase: "even", message: "i=0: Start even expansion between 'b' and 'a'", highlightedLines: [18] },
    { s: "babad", i: 0, left: 0, right: 1, longestPalindrome: "b", start: 0, maxLen: 1, currentLen: 0, phase: "even", message: "Check: s[0]='b' != s[1]='a' ✗", highlightedLines: [5] },
    
    { s: "babad", i: 1, left: 1, right: 1, longestPalindrome: "b", start: 0, maxLen: 1, currentLen: 0, phase: "odd", message: "i=1: Start odd expansion from center 'a'", highlightedLines: [17] },
    { s: "babad", i: 1, left: 1, right: 1, longestPalindrome: "b", start: 0, maxLen: 1, currentLen: 0, phase: "odd", message: "Check: s[1]='a' == s[1]='a' ✓", highlightedLines: [5] },
    { s: "babad", i: 1, left: 1, right: 1, longestPalindrome: "b", start: 0, maxLen: 1, currentLen: 1, phase: "odd", message: "Found 'a' (len=1). No improvement", highlightedLines: [7] },
    { s: "babad", i: 1, left: 0, right: 2, longestPalindrome: "b", start: 0, maxLen: 1, currentLen: 0, phase: "odd", message: "Expand: Check s[0]='b' == s[2]='b' ✓", highlightedLines: [5] },
    { s: "babad", i: 1, left: 0, right: 2, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 3, phase: "odd", message: "Found 'bab' (len=3)! Update maxLen=3, start=0", highlightedLines: [7] },
    { s: "babad", i: 1, left: -1, right: 3, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "Expand: left=-1 out of bounds ✗", highlightedLines: [5] },
    
    { s: "babad", i: 1, left: 1, right: 2, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "even", message: "i=1: Start even expansion between 'a' and 'b'", highlightedLines: [18] },
    { s: "babad", i: 1, left: 1, right: 2, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "even", message: "Check: s[1]='a' != s[2]='b' ✗", highlightedLines: [5] },
    
    { s: "babad", i: 2, left: 2, right: 2, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "i=2: Start odd expansion from center 'b'", highlightedLines: [17] },
    { s: "babad", i: 2, left: 2, right: 2, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "Check: s[2]='b' == s[2]='b' ✓", highlightedLines: [5] },
    { s: "babad", i: 2, left: 2, right: 2, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 1, phase: "odd", message: "Found 'b' (len=1). No improvement", highlightedLines: [7] },
    { s: "babad", i: 2, left: 1, right: 3, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "Expand: Check s[1]='a' == s[3]='a' ✓", highlightedLines: [5] },
    { s: "babad", i: 2, left: 1, right: 3, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 3, phase: "odd", message: "Found 'aba' (len=3). Equal to maxLen, no update", highlightedLines: [7] },
    { s: "babad", i: 2, left: 0, right: 4, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "Expand: s[0]='b' != s[4]='d' ✗", highlightedLines: [5] },
    
    { s: "babad", i: 2, left: 2, right: 3, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "even", message: "i=2: Start even expansion between 'b' and 'a'", highlightedLines: [18] },
    { s: "babad", i: 2, left: 2, right: 3, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "even", message: "Check: s[2]='b' != s[3]='a' ✗", highlightedLines: [5] },
    
    { s: "babad", i: 3, left: 3, right: 3, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "i=3: Start odd expansion from center 'a'", highlightedLines: [17] },
    { s: "babad", i: 3, left: 3, right: 3, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "Check: s[3]='a' == s[3]='a' ✓", highlightedLines: [5] },
    { s: "babad", i: 3, left: 3, right: 3, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 1, phase: "odd", message: "Found 'a' (len=1). No improvement", highlightedLines: [7] },
    { s: "babad", i: 3, left: 2, right: 4, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "Expand: s[2]='b' != s[4]='d' ✗", highlightedLines: [5] },
    
    { s: "babad", i: 3, left: 3, right: 4, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "even", message: "i=3: Start even expansion between 'a' and 'd'", highlightedLines: [18] },
    { s: "babad", i: 3, left: 3, right: 4, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "even", message: "Check: s[3]='a' != s[4]='d' ✗", highlightedLines: [5] },
    
    { s: "babad", i: 4, left: 4, right: 4, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "i=4: Start odd expansion from center 'd'", highlightedLines: [17] },
    { s: "babad", i: 4, left: 4, right: 4, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "Check: s[4]='d' == s[4]='d' ✓", highlightedLines: [5] },
    { s: "babad", i: 4, left: 4, right: 4, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 1, phase: "odd", message: "Found 'd' (len=1). No improvement", highlightedLines: [7] },
    { s: "babad", i: 4, left: 3, right: 5, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "odd", message: "Expand: right=5 out of bounds ✗", highlightedLines: [5] },
    
    { s: "babad", i: 4, left: 4, right: 5, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "even", message: "i=4: Even expansion, right=5 out of bounds ✗", highlightedLines: [18] },
    
    { s: "babad", i: -1, left: -1, right: -1, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "return", message: "Loop complete! Return substring from start=0, len=3", highlightedLines: [21] },
    { s: "babad", i: -1, left: -1, right: -1, longestPalindrome: "bab", start: 0, maxLen: 3, currentLen: 0, phase: "done", message: "Result: 'bab' ✓", highlightedLines: [21] }
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
    if (currentStep.longestPalindrome && idx >= currentStep.start && idx < currentStep.start + currentStep.maxLen) {
      return 'bg-green-500/20 border-green-500/50';
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

          {currentStep.longestPalindrome && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 bg-green-500/10 rounded border border-green-500/30 mb-4"
            >
              <p className="text-sm font-semibold text-green-600">
                Longest: "{currentStep.longestPalindrome}" (length = {currentStep.maxLen})
              </p>
            </motion.div>
          )}

          <VariablePanel
            variables={{
              i: currentStep.i,
              left: currentStep.left,
              right: currentStep.right,
              currentLen: currentStep.currentLen,
              maxLen: currentStep.maxLen,
              start: currentStep.start
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
