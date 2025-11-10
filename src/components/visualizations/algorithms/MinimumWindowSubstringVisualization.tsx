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
  t: string;
  left: number;
  right: number;
  tCount: Record<string, number>;
  windowCount: Record<string, number>;
  have: number;
  need: number;
  result: string;
  resultIndices: [number, number];
  message: string;
  highlightedLines: number[];
}

export const MinimumWindowSubstringVisualization = () => {
  const code = `function minWindow(s: string, t: string): string {
  if (t === "") return "";
  
  const tCount: Record<string, number> = {};
  const window: Record<string, number> = {};
  
  for (const c of t) {
    tCount[c] = (tCount[c] || 0) + 1;
  }
  
  let have = 0;
  const need = Object.keys(tCount).length;
  let result = [-1, -1];
  let resultLen = Infinity;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window[c] = (window[c] || 0) + 1;
    
    if (c in tCount && window[c] === tCount[c]) {
      have++;
    }
    
    while (have === need) {
      if (right - left + 1 < resultLen) {
        result = [left, right];
        resultLen = right - left + 1;
      }
      
      window[s[left]]--;
      if (s[left] in tCount && window[s[left]] < tCount[s[left]]) {
        have--;
      }
      left++;
    }
  }
  
  return resultLen === Infinity ? "" : s.substring(result[0], result[1] + 1);
}`;

  const steps: Step[] = [
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 0,
      right: -1,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: {},
      have: 0,
      need: 3,
      result: "",
      resultIndices: [-1, -1],
      message: "Initialize: Build target char count {A:1, B:1, C:1}, need=3 unique chars",
      highlightedLines: [4, 5, 7, 8, 9, 11, 12]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 0,
      right: 0,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { A: 1 },
      have: 1,
      need: 3,
      result: "",
      resultIndices: [-1, -1],
      message: "right=0: Add 'A' to window, window['A']=1 matches tCount['A']=1, have=1/3",
      highlightedLines: [18, 19, 21, 22]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 0,
      right: 1,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { A: 1, D: 1 },
      have: 1,
      need: 3,
      result: "",
      resultIndices: [-1, -1],
      message: "right=1: Add 'D' to window (not in target), have=1/3",
      highlightedLines: [18, 19]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 0,
      right: 3,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { A: 1, D: 1, O: 1, B: 1 },
      have: 2,
      need: 3,
      result: "",
      resultIndices: [-1, -1],
      message: "right=3: Add 'B' to window, window['B']=1 matches tCount['B']=1, have=2/3",
      highlightedLines: [18, 19, 21, 22]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 0,
      right: 5,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { A: 1, D: 1, O: 1, B: 1, E: 1, C: 1 },
      have: 3,
      need: 3,
      result: "",
      resultIndices: [-1, -1],
      message: "right=5: Add 'C' to window, window['C']=1 matches tCount['C']=1, have=3/3! Valid window found",
      highlightedLines: [18, 19, 21, 22]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 0,
      right: 5,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { A: 1, D: 1, O: 1, B: 1, E: 1, C: 1 },
      have: 3,
      need: 3,
      result: "ADOBEC",
      resultIndices: [0, 5],
      message: "Valid window 'ADOBEC' (length=6), save as current result",
      highlightedLines: [25, 26, 27, 28]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 1,
      right: 5,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { A: 0, D: 1, O: 1, B: 1, E: 1, C: 1 },
      have: 2,
      need: 3,
      result: "ADOBEC",
      resultIndices: [0, 5],
      message: "Shrink: Remove 'A' from left, window['A']=0 < tCount['A']=1, have=2/3, invalid now",
      highlightedLines: [30, 31, 32, 33, 34]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 1,
      right: 9,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { D: 2, O: 2, B: 1, E: 2, C: 1, A: 1 },
      have: 3,
      need: 3,
      result: "ADOBEC",
      resultIndices: [0, 5],
      message: "Expand to right=9. Found 'A' again. have=3/3, window='DOBECODE' (too long)",
      highlightedLines: [18, 19, 21, 22]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 4,
      right: 9,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { B: 1, E: 2, C: 1, O: 1, D: 1, A: 1 },
      have: 3,
      need: 3,
      result: "ADOBEC",
      resultIndices: [0, 5],
      message: "Shrink from left: Remove 'D', 'O', 'B', 'E'. Still have=3/3 at left=4",
      highlightedLines: [30, 34]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 5,
      right: 10,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { C: 1, O: 1, D: 1, E: 1, B: 1, A: 1 },
      have: 3,
      need: 3,
      result: "ADOBEC",
      resultIndices: [0, 5],
      message: "right=10: Add 'B' to window. have=3/3. Window 'CODEAB' length=6",
      highlightedLines: [18, 19, 21, 22]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 8,
      right: 12,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { A: 2, B: 1, C: 1 },
      have: 3,
      need: 3,
      result: "ADOBEC",
      resultIndices: [0, 5],
      message: "right=12: Add 'C' to window. have=3/3! Window='EBANC' (length=5)",
      highlightedLines: [18, 19, 21, 22]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 8,
      right: 12,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { E: 1, B: 1, A: 2, N: 1, C: 1 },
      have: 3,
      need: 3,
      result: "EBANC",
      resultIndices: [8, 12],
      message: "Update result! 'EBANC' (length=5 < 6) is the new minimum",
      highlightedLines: [26, 27, 28]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 9,
      right: 12,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { B: 1, A: 2, N: 1, C: 1 },
      have: 3,
      need: 3,
      result: "EBANC",
      resultIndices: [8, 12],
      message: "Shrink: Remove 'E' from left, still have=3/3. Window='BANC' (length=4)",
      highlightedLines: [30, 34]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 9,
      right: 12,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { B: 1, A: 2, N: 1, C: 1 },
      have: 3,
      need: 3,
      result: "BANC",
      resultIndices: [9, 12],
      message: "Update result again! 'BANC' (length=4) is now the minimum",
      highlightedLines: [26, 27, 28]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 10,
      right: 12,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { A: 1, N: 1, C: 1 },
      have: 2,
      need: 3,
      result: "BANC",
      resultIndices: [9, 12],
      message: "Shrink: Remove 'B' from left, window['B']=0 < tCount['B']=1, have=2/3",
      highlightedLines: [30, 31, 32, 33, 34]
    },
    {
      s: "ADOBECODEBANC",
      t: "ABC",
      left: 10,
      right: 12,
      tCount: { A: 1, B: 1, C: 1 },
      windowCount: { A: 1, N: 1, C: 1 },
      have: 2,
      need: 3,
      result: "BANC",
      resultIndices: [9, 12],
      message: "Complete! Return 'BANC' (length=4) as the minimum window substring",
      highlightedLines: [38]
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
            <h3 className="text-lg font-semibold mb-4">Target: "{currentStep.t}"</h3>
            <div className="flex gap-2 mb-6">
              {currentStep.t.split('').map((char, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 flex items-center justify-center rounded bg-primary/20 border-2 border-primary font-mono font-bold"
                >
                  {char}
                </motion.div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-4">String: "{currentStep.s}"</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {currentStep.s.split('').map((char, idx) => {
                const isInWindow = idx >= currentStep.left && idx <= currentStep.right && currentStep.right >= 0;
                const isResult = idx >= currentStep.resultIndices[0] && idx <= currentStep.resultIndices[1] && currentStep.resultIndices[0] >= 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                    className={`w-10 h-10 flex items-center justify-center rounded font-mono font-bold border-2 ${
                      isInWindow
                        ? 'bg-primary/20 border-primary text-primary'
                        : isResult
                        ? 'bg-green-500/20 border-green-500 text-green-600'
                        : 'bg-muted/50 border-border text-muted-foreground'
                    }`}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>

            {currentStep.result && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-3 bg-green-500/10 border border-green-500/20 rounded mb-4"
              >
                <p className="text-sm font-semibold text-green-600">Current Best: "{currentStep.result}"</p>
              </motion.div>
            )}

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Window Character Counts:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(currentStep.tCount).map(([char]) => (
                  <div key={char} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="font-mono font-bold">{char}</span>
                    <span className="font-mono text-sm">
                      {currentStep.windowCount[char] || 0} / {currentStep.tCount[char]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <VariablePanel
              variables={{
                left: currentStep.left,
                right: currentStep.right,
                have: currentStep.have,
                need: currentStep.need,
                windowSize: currentStep.right >= 0 ? currentStep.right - currentStep.left + 1 : 0
              }}
            />

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
