import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface Step {
  strs: string[];
  encoded: string;
  decoded: string[];
  phase: string;
  currentIdx: number;
  currentStr: string;
  i: number;
  j: number;
  length: number;
  message: string;
  highlightedLines: number[];
}

export const EncodeDecodeStringsVisualization = () => {
  const code = `function encode(strs: string[]): string {
  let result = '';
  for (const str of strs) {
    result += str.length + '#' + str;
  }
  return result;
}

function decode(s: string): string[] {
  const result: string[] = [];
  let i = 0;
  
  while (i < s.length) {
    let j = i;
    while (s[j] !== '#') j++;
    const length = parseInt(s.substring(i, j));
    const str = s.substring(j + 1, j + 1 + length);
    result.push(str);
    i = j + 1 + length;
  }
  
  return result;
}`;

  const steps: Step[] = [
    { strs: ["hello", "world"], encoded: "", decoded: [], phase: "encode-start", currentIdx: -1, currentStr: "", i: -1, j: -1, length: 0, message: "ENCODE: Start with input array", highlightedLines: [2] },
    
    { strs: ["hello", "world"], encoded: "", decoded: [], phase: "encode-process", currentIdx: 0, currentStr: "hello", i: -1, j: -1, length: 5, message: "Processing str[0]: 'hello' (length=5)", highlightedLines: [3] },
    { strs: ["hello", "world"], encoded: "5", decoded: [], phase: "encode-len", currentIdx: 0, currentStr: "hello", i: -1, j: -1, length: 5, message: "Add length: '5'", highlightedLines: [4] },
    { strs: ["hello", "world"], encoded: "5#", decoded: [], phase: "encode-delim", currentIdx: 0, currentStr: "hello", i: -1, j: -1, length: 5, message: "Add delimiter: '#'", highlightedLines: [4] },
    { strs: ["hello", "world"], encoded: "5#hello", decoded: [], phase: "encode-str", currentIdx: 0, currentStr: "hello", i: -1, j: -1, length: 5, message: "Add string: 'hello'", highlightedLines: [4] },
    
    { strs: ["hello", "world"], encoded: "5#hello", decoded: [], phase: "encode-process", currentIdx: 1, currentStr: "world", i: -1, j: -1, length: 5, message: "Processing str[1]: 'world' (length=5)", highlightedLines: [3] },
    { strs: ["hello", "world"], encoded: "5#hello5", decoded: [], phase: "encode-len", currentIdx: 1, currentStr: "world", i: -1, j: -1, length: 5, message: "Add length: '5'", highlightedLines: [4] },
    { strs: ["hello", "world"], encoded: "5#hello5#", decoded: [], phase: "encode-delim", currentIdx: 1, currentStr: "world", i: -1, j: -1, length: 5, message: "Add delimiter: '#'", highlightedLines: [4] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: [], phase: "encode-str", currentIdx: 1, currentStr: "world", i: -1, j: -1, length: 5, message: "Add string: 'world'", highlightedLines: [4] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: [], phase: "encode-done", currentIdx: -1, currentStr: "", i: -1, j: -1, length: 0, message: "Encoding complete! Result: '5#hello5#world'", highlightedLines: [6] },
    
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: [], phase: "decode-start", currentIdx: -1, currentStr: "", i: 0, j: -1, length: 0, message: "DECODE: Start parsing encoded string", highlightedLines: [10] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: [], phase: "decode-init", currentIdx: -1, currentStr: "", i: 0, j: -1, length: 0, message: "Initialize: i=0, result=[]", highlightedLines: [11] },
    
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: [], phase: "decode-loop", currentIdx: 0, currentStr: "", i: 0, j: 0, length: 0, message: "Loop iteration 1: i=0, j=0", highlightedLines: [13] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: [], phase: "decode-find", currentIdx: 0, currentStr: "", i: 0, j: 0, length: 0, message: "Find delimiter: s[0]='5' != '#'", highlightedLines: [15] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: [], phase: "decode-find", currentIdx: 0, currentStr: "", i: 0, j: 1, length: 0, message: "s[1]='#' found! j=1", highlightedLines: [15] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: [], phase: "decode-length", currentIdx: 0, currentStr: "", i: 0, j: 1, length: 5, message: "Parse length: substring(0,1)='5' → length=5", highlightedLines: [16] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: [], phase: "decode-extract", currentIdx: 0, currentStr: "hello", i: 0, j: 1, length: 5, message: "Extract string: substring(2,7)='hello'", highlightedLines: [17] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello"], phase: "decode-push", currentIdx: 0, currentStr: "hello", i: 0, j: 1, length: 5, message: "Push 'hello' to result array", highlightedLines: [18] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello"], phase: "decode-advance", currentIdx: 0, currentStr: "", i: 7, j: 1, length: 5, message: "Advance pointer: i = 1 + 1 + 5 = 7", highlightedLines: [19] },
    
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello"], phase: "decode-loop", currentIdx: 1, currentStr: "", i: 7, j: 7, length: 0, message: "Loop iteration 2: i=7, j=7", highlightedLines: [13] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello"], phase: "decode-find", currentIdx: 1, currentStr: "", i: 7, j: 7, length: 0, message: "Find delimiter: s[7]='5' != '#'", highlightedLines: [15] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello"], phase: "decode-find", currentIdx: 1, currentStr: "", i: 7, j: 8, length: 0, message: "s[8]='#' found! j=8", highlightedLines: [15] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello"], phase: "decode-length", currentIdx: 1, currentStr: "", i: 7, j: 8, length: 5, message: "Parse length: substring(7,8)='5' → length=5", highlightedLines: [16] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello"], phase: "decode-extract", currentIdx: 1, currentStr: "world", i: 7, j: 8, length: 5, message: "Extract string: substring(9,14)='world'", highlightedLines: [17] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello", "world"], phase: "decode-push", currentIdx: 1, currentStr: "world", i: 7, j: 8, length: 5, message: "Push 'world' to result array", highlightedLines: [18] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello", "world"], phase: "decode-advance", currentIdx: 1, currentStr: "", i: 14, j: 8, length: 5, message: "Advance pointer: i = 8 + 1 + 5 = 14", highlightedLines: [19] },
    
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello", "world"], phase: "decode-check", currentIdx: -1, currentStr: "", i: 14, j: -1, length: 0, message: "Check loop: i=14 >= s.length=14, exit loop", highlightedLines: [13] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello", "world"], phase: "decode-done", currentIdx: -1, currentStr: "", i: -1, j: -1, length: 0, message: "Decoding complete! Return ['hello', 'world'] ✓", highlightedLines: [22] }
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
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                currentStep.phase.startsWith('encode') ? 'bg-blue-500/20 text-blue-600' :
                currentStep.phase.startsWith('decode') ? 'bg-green-500/20 text-green-600' :
                'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep.phase.startsWith('encode') ? 'ENCODE' : 'DECODE'}
            </motion.div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Input Array:</p>
            <div className="flex gap-2">
              {currentStep.strs.map((str, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: idx === currentStep.currentIdx ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                  className={`px-3 py-2 rounded border-2 font-mono text-sm ${
                    idx === currentStep.currentIdx ? 'bg-yellow-500/20 border-yellow-500' : 'bg-muted/50 border-border'
                  }`}
                >
                  "{str}"
                </motion.div>
              ))}
            </div>
          </div>

          {currentStep.encoded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-500/10 rounded border border-blue-500/30 mb-4"
            >
              <p className="text-xs text-muted-foreground mb-1">Encoded String:</p>
              <div className="font-mono text-sm break-all">
                {currentStep.encoded.split('').map((char, idx) => (
                  <span
                    key={idx}
                    className={`${
                      (currentStep.phase.includes('decode') && idx >= currentStep.i && idx <= currentStep.j) ||
                      (currentStep.phase === 'encode-len' && idx === currentStep.encoded.length - 1) ||
                      (currentStep.phase === 'encode-delim' && idx === currentStep.encoded.length - 1) ||
                      (currentStep.phase === 'encode-str' && idx >= currentStep.encoded.length - currentStep.currentStr.length)
                        ? 'bg-yellow-500/30 px-0.5'
                        : ''
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep.decoded.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <p className="text-xs text-muted-foreground mb-2">Decoded Array:</p>
              <div className="flex gap-2 flex-wrap">
                <AnimatePresence>
                  {currentStep.decoded.map((str, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="px-3 py-2 rounded font-mono text-sm bg-green-500/20 border-2 border-green-500/30"
                    >
                      "{str}"
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          <VariablePanel
            variables={{
              currentIdx: currentStep.currentIdx,
              i: currentStep.i,
              j: currentStep.j,
              length: currentStep.length
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
