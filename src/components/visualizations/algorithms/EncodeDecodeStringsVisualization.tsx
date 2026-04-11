import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ListFilter, FileText } from 'lucide-react';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';

interface Step {
  strs: string[];
  encoded: string;
  decoded: string[];
  phase: 'init' | 'encode' | 'decode' | 'result';
  currentIdx: number;
  currentStr: string;
  i: number;
  j: number;
  length: number;
  comment: string;
  highlightedLines: number[];
}

export const EncodeDecodeStringsVisualization = () => {
  const code = `function Solution(strs: string[]): string[] {
  function encode(strs: string[]): string {
    let res = "";
    for (const s of strs) {
      res += s.length + "#" + s;
    }
    return res;
  }

  function decode(str: string): string[] {
    const res: string[] = [];
    let i = 0;
    while (i < str.length) {
      let j = i;
      while (str[j] !== "#") {
        j++;
      }
      const length = parseInt(str.substring(i, j));
      const word = str.substring(j + 1, j + 1 + length);
      res.push(word);
      i = j + 1 + length;
    }
    return res;
  }

  const encoded = encode(strs);
  return decode(encoded);
}`;

  const cases = {
    "standard": {
      strs: ["hello", "word"],
      steps: [
        { strs: ["hello", "word"], encoded: "", decoded: [], phase: 'init', currentIdx: -1, currentStr: "", i: -1, j: -1, length: 0, comment: "Starting the Encode and Decode process for ['hello', 'word'].", highlightedLines: [1] },
        { strs: ["hello", "word"], encoded: "", decoded: [], phase: 'encode', currentIdx: -1, currentStr: "", i: -1, j: -1, length: 0, comment: "Calling `encode(strs)`. Initializing `res` to an empty string.", highlightedLines: [2, 3, 26] },
        { strs: ["hello", "word"], encoded: "", decoded: [], phase: 'encode', currentIdx: 0, currentStr: "hello", i: -1, j: -1, length: 0, comment: "Iteration 1: Processing the first string 'hello'.", highlightedLines: [4] },
        { strs: ["hello", "word"], encoded: "5#hello", decoded: [], phase: 'encode', currentIdx: 0, currentStr: "hello", i: -1, j: -1, length: 0, comment: "Append '5#hello' (length + '#' + string) to `res`.", highlightedLines: [5] },
        { strs: ["hello", "word"], encoded: "5#hello", decoded: [], phase: 'encode', currentIdx: 1, currentStr: "word", i: -1, j: -1, length: 0, comment: "Iteration 2: Processing the string 'word'.", highlightedLines: [4] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: [], phase: 'encode', currentIdx: 1, currentStr: "word", i: -1, j: -1, length: 0, comment: "Append '4#word' to `res`.", highlightedLines: [5] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: [], phase: 'encode', currentIdx: -1, currentStr: "", i: -1, j: -1, length: 0, comment: "Encoding finished. Resulting string: '5#hello4#word'.", highlightedLines: [7, 26] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: [], phase: 'decode', currentIdx: -1, currentStr: "", i: -1, j: -1, length: 0, comment: "Calling `decode(encoded)`. Initializing `res` array and pointer `i = 0`.", highlightedLines: [10, 11, 12, 27] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: [], phase: 'decode', currentIdx: -1, currentStr: "", i: 0, j: 0, length: 0, comment: "While i (0) < 13: Search for '#' starting from j = i (0).", highlightedLines: [13, 14, 15] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: [], phase: 'decode', currentIdx: -1, currentStr: "", i: 0, j: 1, length: 0, comment: "Found '#' at index j = 1.", highlightedLines: [15, 16] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: [], phase: 'decode', currentIdx: -1, currentStr: "", i: 0, j: 1, length: 5, comment: "Parse length between i and j: str.substring(0, 1) = '5'.", highlightedLines: [18] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: [], phase: 'decode', currentIdx: -1, currentStr: "hello", i: 0, j: 1, length: 5, comment: "Extract word using parsed length 5: str.substring(2, 7) = 'hello'.", highlightedLines: [19] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: ["hello"], phase: 'decode', currentIdx: -1, currentStr: "hello", i: 0, j: 1, length: 5, comment: "Add 'hello' to decoded array.", highlightedLines: [20] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: ["hello"], phase: 'decode', currentIdx: -1, currentStr: "", i: 7, j: 1, length: 5, comment: "Advance `i` to j + 1 + length (1 + 1 + 5 = 7).", highlightedLines: [21] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: ["hello"], phase: 'decode', currentIdx: -1, currentStr: "", i: 7, j: 7, length: 0, comment: "Next iteration: Find next '#' starting from j = 7.", highlightedLines: [13, 14, 15] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: ["hello"], phase: 'decode', currentIdx: -1, currentStr: "", i: 7, j: 8, length: 0, comment: "Found '#' at index j = 8.", highlightedLines: [15, 16] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: ["hello"], phase: 'decode', currentIdx: -1, currentStr: "", i: 7, j: 8, length: 4, comment: "Parse length: str.substring(7, 8) = '4'.", highlightedLines: [18] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: ["hello"], phase: 'decode', currentIdx: -1, currentStr: "word", i: 7, j: 8, length: 4, comment: "Extract word of length 4: 'word'.", highlightedLines: [19] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: ["hello", "word"], phase: 'decode', currentIdx: -1, currentStr: "word", i: 7, j: 8, length: 4, comment: "Add 'word' to result.", highlightedLines: [20] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: ["hello", "word"], phase: 'decode', currentIdx: -1, currentStr: "", i: 13, j: 8, length: 4, comment: "Advance `i` to 8 + 1 + 4 = 13.", highlightedLines: [21] },
        { strs: ["hello", "word"], encoded: "5#hello4#word", decoded: ["hello", "word"], phase: 'result', currentIdx: -1, currentStr: "", i: -1, j: -1, length: 0, comment: "Decoding complete. Final array restored!", highlightedLines: [23, 27] }
      ]
    },
    "empty": {
      strs: ["", "a"],
      steps: [
        { strs: ["", "a"], encoded: "", decoded: [], phase: 'init', currentIdx: -1, currentStr: "", i: -1, j: -1, length: 0, comment: "Checking edge case with an empty string.", highlightedLines: [1] },
        { strs: ["", "a"], encoded: "0#", decoded: [], phase: 'encode', currentIdx: 0, currentStr: "", i: -1, j: -1, length: 0, comment: "Encoding empty string: length 0 + '#'.", highlightedLines: [5] },
        { strs: ["", "a"], encoded: "0#1#a", decoded: [], phase: 'encode', currentIdx: 1, currentStr: "a", i: -1, j: -1, length: 0, comment: "Encoding 'a': length 1 + '#'.", highlightedLines: [5] },
        { strs: ["", "a"], encoded: "0#1#a", decoded: [], phase: 'decode', currentIdx: -1, currentStr: "", i: 0, j: 1, length: 0, comment: "Length 0 found at index 1.", highlightedLines: [18] },
        { strs: ["", "a"], encoded: "0#1#a", decoded: [""], phase: 'decode', currentIdx: -1, currentStr: "", i: 2, j: 1, length: 0, comment: "Extracted empty string.", highlightedLines: [20] },
        { strs: ["", "a"], encoded: "0#1#a", decoded: ["", "a"], phase: 'result', currentIdx: -1, currentStr: "", i: -1, j: -1, length: 0, comment: "Correctly restored ['', 'a'].", highlightedLines: [23] }
      ]
    }
  };

  const [activeCase, setActiveCase] = useState<'standard' | 'empty'>('standard');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = cases[activeCase].steps;
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  const handleCaseChange = (newCase: 'standard' | 'empty') => {
    setActiveCase(newCase);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
        
        <div className="flex p-1 bg-muted rounded-xl border border-border w-fit backdrop-blur-sm shadow-inner">
          <button
            onClick={() => handleCaseChange('standard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeCase === 'standard' 
              ? 'bg-card text-primary shadow-sm ring-1 ring-border/50' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListFilter className="h-4 w-4" />
            Standard (hello)
          </button>
          <button
            onClick={() => handleCaseChange('empty')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeCase === 'empty' 
              ? 'bg-card text-primary shadow-sm ring-1 ring-border/50' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className={activeCase === 'empty' ? 'text-primary h-4 w-4' : 'text-muted-foreground h-4 w-4'} />
            Edge Case ("", a)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider italic">Input Strings</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.strs.map((str, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1 rounded font-mono text-sm border-2 transition-all duration-200 ${
                      idx === currentStep.currentIdx 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-600' 
                      : 'bg-muted/50 border-border text-muted-foreground'
                    }`}
                  >
                    "{str}"
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-2 uppercase italic">Intermediary Encoded Representation</p>
              <div className="p-4 bg-muted/30 rounded-lg border border-border font-mono text-lg break-all flex flex-wrap gap-1">
                {currentStep.encoded ? (
                  currentStep.encoded.split('').map((char, idx) => {
                    const isFocus = (currentStep.phase === 'decode' && idx >= currentStep.i && idx <= currentStep.j);
                    const isLengthMatch = (currentStep.phase === 'decode' && char !== '#' && idx >= currentStep.j + 1 && idx <= currentStep.j + currentStep.length);
                    
                    return (
                      <motion.span
                        key={idx}
                        className={`inline-block px-1 rounded transition-colors ${
                          isFocus ? 'bg-yellow-500 text-yellow-950 font-bold' :
                          isLengthMatch ? 'bg-primary/20 text-primary' :
                          'text-muted-foreground'
                        }`}
                      >
                        {char}
                      </motion.span>
                    );
                  })
                ) : (
                  <span className="text-muted-foreground italic text-sm">Waiting for encoding...</span>
                )}
              </div>
            </div>

            {currentStep.decoded.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-muted-foreground mb-2 uppercase italic">Decoded Strings (Restored)</p>
                <div className="flex gap-2 flex-wrap">
                  <AnimatePresence>
                    {currentStep.decoded.map((str, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-3 py-1 rounded bg-green-500/10 border-2 border-green-500/30 text-green-600 font-mono text-sm"
                      >
                        "{str}"
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 min-h-[80px]">
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-bold text-primary mr-2 uppercase tracking-tighter">[{currentStep.phase.toUpperCase()}]</span>
                  {currentStep.comment}
                </p>
              </div>

              <VariablePanel
                variables={{
                  phase: currentStep.phase.toUpperCase(),
                  pointer_i: currentStep.i === -1 ? 'N/A' : currentStep.i,
                  pointer_j: currentStep.j === -1 ? 'N/A' : currentStep.j,
                  parsedLen: currentStep.length || '0',
                  extracted: currentStep.currentStr || 'None'
                }}
              />
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
