import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';

interface Step {
  s: string;
  t: string;
  sCount: Record<string, number>;
  tCount: Record<string, number>;
  currentChar?: string;
  checking?: string;
  isAnagram?: boolean;
  message: string;
  highlightedLines: number[];
}

export const ValidAnagramVisualization = () => {
  const code = `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  
  const sCount: Record<string, number> = {};
  const tCount: Record<string, number> = {};
  
  for (let i = 0; i < s.length; i++) {
    sCount[s[i]] = (sCount[s[i]] || 0) + 1;
    tCount[t[i]] = (tCount[t[i]] || 0) + 1;
  }
  
  for (const char in sCount) {
    if (sCount[char] !== tCount[char]) {
      return false;
    }
  }
  
  return true;
}`;

  const steps: Step[] = [
    {
      s: "anagram",
      t: "nagaram",
      sCount: {},
      tCount: {},
      message: "Initialize: Check if lengths match. s.length=7, t.length=7 ✓",
      highlightedLines: [2]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: {},
      tCount: {},
      message: "Create empty frequency maps for both strings",
      highlightedLines: [4, 5]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: { a: 1 },
      tCount: { n: 1 },
      currentChar: 'a',
      message: "i=0: Count s[0]='a' → sCount['a']=1, t[0]='n' → tCount['n']=1",
      highlightedLines: [8, 9]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: { a: 1, n: 1 },
      tCount: { n: 1, a: 1 },
      currentChar: 'n',
      message: "i=1: Count s[1]='n' → sCount['n']=1, t[1]='a' → tCount['a']=1",
      highlightedLines: [8, 9]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: { a: 2, n: 1 },
      tCount: { n: 1, a: 2 },
      currentChar: 'a',
      message: "i=2: Count s[2]='a' → sCount['a']=2, t[2]='a' → tCount['a']=2",
      highlightedLines: [8, 9]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: { a: 2, n: 1, g: 1 },
      tCount: { n: 1, a: 2, g: 1 },
      currentChar: 'g',
      message: "i=3: Count s[3]='g' → sCount['g']=1, t[3]='g' → tCount['g']=1",
      highlightedLines: [8, 9]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: { a: 3, n: 1, g: 1 },
      tCount: { n: 1, a: 3, g: 1 },
      currentChar: 'a',
      message: "i=4: Count s[4]='a' → sCount['a']=3, t[4]='a' → tCount['a']=3",
      highlightedLines: [8, 9]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: { a: 3, n: 1, g: 1, r: 1 },
      tCount: { n: 1, a: 3, g: 1, r: 1 },
      currentChar: 'r',
      message: "i=5: Count s[5]='r' → sCount['r']=1, t[5]='r' → tCount['r']=1",
      highlightedLines: [8, 9]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: { a: 3, n: 1, g: 1, r: 1, m: 1 },
      tCount: { n: 1, a: 4, g: 1, r: 1, m: 1 },
      currentChar: 'm',
      message: "i=6: Count s[6]='m' → sCount['m']=1, t[6]='a' → tCount['a']=4",
      highlightedLines: [8, 9]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: { a: 3, n: 1, g: 1, r: 1, m: 1 },
      tCount: { n: 1, a: 4, g: 1, r: 1, m: 1 },
      message: "Frequency counting complete. Now compare each character count.",
      highlightedLines: [12]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: { a: 3, n: 1, g: 1, r: 1, m: 1 },
      tCount: { n: 1, a: 4, g: 1, r: 1, m: 1 },
      checking: 'a',
      message: "Check 'a': sCount['a']=3 vs tCount['a']=4 → NOT EQUAL ✗",
      highlightedLines: [13, 14]
    },
    {
      s: "anagram",
      t: "nagaram",
      sCount: { a: 3, n: 1, g: 1, r: 1, m: 1 },
      tCount: { n: 1, a: 4, g: 1, r: 1, m: 1 },
      isAnagram: false,
      message: "Mismatch found! Return false - NOT an anagram",
      highlightedLines: [14]
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

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
            <h3 className="text-lg font-semibold mb-4">String s: "{currentStep.s}"</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {currentStep.s.split('').map((char, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`w-10 h-10 flex items-center justify-center rounded font-mono font-bold border-2 ${
                    char === currentStep.currentChar || char === currentStep.checking
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-muted/50 border-border text-foreground'
                  }`}
                >
                  {char}
                </motion.div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-4">String t: "{currentStep.t}"</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {currentStep.t.split('').map((char, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`w-10 h-10 flex items-center justify-center rounded font-mono font-bold border-2 ${
                    char === currentStep.currentChar || char === currentStep.checking
                      ? 'bg-secondary/20 border-secondary text-secondary-foreground'
                      : 'bg-muted/50 border-border text-foreground'
                  }`}
                >
                  {char}
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card className="p-4">
                <h4 className="text-sm font-semibold mb-3">sCount</h4>
                <div className="space-y-2">
                  {Object.entries(currentStep.sCount).length > 0 ? (
                    Object.entries(currentStep.sCount).map(([char, count]) => (
                      <motion.div
                        key={char}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`flex justify-between items-center p-2 rounded ${
                          char === currentStep.checking
                            ? 'bg-primary/20 border border-primary'
                            : 'bg-muted/50'
                        }`}
                      >
                        <span className="font-mono font-bold">{char}</span>
                        <span className="font-mono text-primary">{count}</span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Empty</p>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="text-sm font-semibold mb-3">tCount</h4>
                <div className="space-y-2">
                  {Object.entries(currentStep.tCount).length > 0 ? (
                    Object.entries(currentStep.tCount).map(([char, count]) => (
                      <motion.div
                        key={char}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`flex justify-between items-center p-2 rounded ${
                          char === currentStep.checking
                            ? 'bg-secondary/20 border border-secondary'
                            : 'bg-muted/50'
                        }`}
                      >
                        <span className="font-mono font-bold">{char}</span>
                        <span className="font-mono text-secondary">{count}</span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Empty</p>
                  )}
                </div>
              </Card>
            </div>

            {currentStep.isAnagram !== undefined && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-4 rounded ${currentStep.isAnagram ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}
              >
                <p className={`text-lg font-bold ${currentStep.isAnagram ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStep.isAnagram ? '✓ Valid Anagram' : '✗ Not an Anagram'}
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
