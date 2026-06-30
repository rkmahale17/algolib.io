import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { ListFilter, FileText } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

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
  explanation: string;
  pseudoStep: string;
}

const USE_CASES = [
  { name: "Standard (hello)", id: "standard", strs: ["hello", "word"] },
  { name: "Edge Case (empty)", id: "empty", strs: ["", "a"] }
];

const languages: VisualizationLanguageMap = {
  python: `def Solution(strs):
    def encode(strs):
        res = ""
        for s in strs:
            res += str(len(s)) + "#" + s
        return res

    def decode(s):
        res = []
        i = 0
        while i < len(s):
            j = i
            while s[j] != "#":
                j += 1
            length = int(s[i:j])
            word = s[j+1:j+1+length]
            res.append(word)
            i = j + 1 + length
        return res

    encoded = encode(strs)
    return decode(encoded)`,

  typescript: `function Solution(strs: string[]): string[] {
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
}`,

  java: `public class Solution {
    public String encode(List<String> strs) {
        StringBuilder res = new StringBuilder();
        for (String s : strs) {
            res.append(s.length()).append("#").append(s);
        }
        return res.toString();
    }

    public List<String> decode(String str) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < str.length()) {
            int j = i;
            while (str.charAt(j) != '#') {
                j++;
            }
            int length = Integer.parseInt(str.substring(i, j));
            String word = str.substring(j + 1, j + 1 + length);
            res.add(word);
            i = j + 1 + length;
        }
        return res;
    }

    public List<String> solution(String[] strs) {
        String encoded = encode(Arrays.asList(strs));
        return decode(encoded);
    }
}`,

  cpp: `class Solution {
public:
    string encode(vector<string>& strs) {
        string res = "";
        for (string s : strs) {
            res += to_string(s.length()) + "#" + s;
        }
        return res;
    }

    vector<string> decode(string str) {
        vector<string> res;
        int i = 0;
        while (i < str.length()) {
            int j = i;
            while (str[j] != '#') {
                j++;
            }
            int length = stoi(str.substr(i, j - i));
            string word = str.substr(j + 1, length);
            res.push_back(word);
            i = j + 1 + length;
        }
        return res;
    }

    vector<string> SolutionFunc(vector<string>& strs) {
        string encoded = encode(strs);
        return decode(encoded);
    }
};`
};

const generateStepsData = (strs: string[]) => {
  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  let encoded = "";
  const decoded: string[] = [];

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
    steps.push({
      strs,
      encoded,
      decoded: [...decoded],
      phase: extra.phase || 'init',
      currentIdx: extra.hasOwnProperty('currentIdx') ? extra.currentIdx! : -1,
      currentStr: extra.currentStr || "",
      i: extra.hasOwnProperty('i') ? extra.i! : -1,
      j: extra.hasOwnProperty('j') ? extra.j! : -1,
      length: extra.length || 0,
      explanation: msg,
      pseudoStep: pseudo
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  addStep("Initialize the Encode and Decode strings process.", "CALL Solution(strs)", 1, 1, 26, 27);

  // 2. Call Encode
  addStep("Call encode(strs) function. Initialize res to empty string.", "CALL encode(strs)", 26, 21, 27, 28);

  // Loop inside Encode
  for (let idx = 0; idx < strs.length; idx++) {
    const s = strs[idx];
    addStep(`Processing string at index ${idx}: "${s}".`, `FOR s IN strs`, 4, 4, 4, 5, { phase: 'encode', currentIdx: idx, currentStr: s });

    encoded += s.length + "#" + s;
    addStep(`Append length (${s.length}) + "#" + string ("${s}") to res.`, `SET res = res + len(s) + "#" + s`, 5, 5, 5, 6, { phase: 'encode', currentIdx: idx, currentStr: s });
  }

  // Return from Encode
  addStep(`Encoding finished. Return encoded representation: "${encoded}".`, `RETURN res → "${encoded}"`, 7, 6, 7, 8, { phase: 'encode' });

  // 3. Call Decode
  addStep("Call decode(str) function. Initialize empty result list and pointer i = 0.", "CALL decode(encoded)", 27, 22, 28, 29, { phase: 'decode', i: 0 });

  let i = 0;
  while (i < encoded.length) {
    addStep(`Loop check: i = ${i} < length = ${encoded.length}.`, `WHILE i < len(s)`, 13, 11, 13, 14, { phase: 'decode', i });

    let j = i;
    addStep(`Initialize j to ${i} to scan for the delimiter '#'.`, "SET j = i", 14, 12, 14, 15, { phase: 'decode', i, j });

    while (encoded[j] !== "#") {
      j++;
    }
    addStep(`Scan complete. Delimiter '#' found at index ${j}.`, `WHILE s[j] != "#"`, 15, 13, 15, 16, { phase: 'decode', i, j });

    const length = parseInt(encoded.substring(i, j));
    addStep(`Parse string length between indices ${i} and ${j}: ${length}.`, `SET length = int(s[i:j]) → ${length}`, 18, 15, 18, 19, { phase: 'decode', i, j, length });

    const word = encoded.substring(j + 1, j + 1 + length);
    addStep(`Extract word of length ${length} starting at index ${j + 1}: "${word}".`, `SET word = s[j+1 : j+1+length] → "${word}"`, 19, 16, 19, 20, { phase: 'decode', i, j, length, currentStr: word });

    decoded.push(word);
    addStep(`Add extracted word "${word}" to the result list.`, `APPEND word TO res`, 20, 17, 20, 21, { phase: 'decode', i, j, length, currentStr: word });

    i = j + 1 + length;
    addStep(`Advance pointer i to the start of the next segment (index ${i}).`, `SET i = j + 1 + length → ${i}`, 21, 18, 21, 22, { phase: 'decode', i, j, length });
  }

  // End Decode Loop
  addStep(`Loop check: i = ${i} >= length = ${encoded.length}. Loop complete.`, `WHILE i < len(s) → FALSE ✗`, 13, 11, 13, 14, { phase: 'decode', i });

  // Return from Decode
  addStep("Decoding complete. Return restored string list.", "RETURN res", 23, 19, 23, 24, { phase: 'result' });

  return { steps, stepLineNumbers };
};

export const EncodeDecodeStringsVisualization = () => {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const activeCase = USE_CASES[activeCaseIdx];

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateStepsData(activeCase.strs);
  }, [activeCase]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const handleCaseChange = (idx: number) => {
    setActiveCaseIdx(idx);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Case selections / Controls at Top */}
      <div className="flex flex-col gap-4 bg-card p-6 rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="flex p-0.5 bg-muted rounded-lg border border-border w-fit shadow-inner">
          <button
            onClick={() => handleCaseChange(0)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              activeCaseIdx === 0 
              ? 'bg-background text-foreground border border-border/50 shadow-sm font-bold' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            Standard (hello)
          </button>
          <button
            onClick={() => handleCaseChange(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              activeCaseIdx === 1 
              ? 'bg-background text-foreground border border-border/50 shadow-sm font-bold' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Edge Case ("", a)
          </button>
        </div>
        <div className="w-full pt-4 border-t border-border">
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
        </div>
      </div>

      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic">Input Strings</h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {currentStep.strs.map((str, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-1 rounded font-mono text-sm border-2 transition-all duration-200 ${
                        idx === currentStep.currentIdx 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-600 font-bold scale-105 shadow-sm' 
                        : 'bg-muted/50 border-border text-muted-foreground'
                      }`}
                    >
                      "{str}"
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest italic">Intermediary Encoded Representation</p>
                <div className="p-4 bg-muted/30 rounded-lg border border-border font-mono text-lg break-all flex flex-wrap gap-1">
                  {currentStep.encoded ? (
                    currentStep.encoded.split('').map((char, idx) => {
                      const isFocus = (currentStep.phase === 'decode' && idx >= currentStep.i && idx <= currentStep.j);
                      const isLengthMatch = (currentStep.phase === 'decode' && char !== '#' && idx >= currentStep.j + 1 && idx <= currentStep.j + currentStep.length);
                      
                      return (
                        <motion.span
                          key={idx}
                          className={`inline-block px-1 rounded transition-colors ${
                            isFocus ? 'bg-yellow-500 text-yellow-950 font-bold scale-110 shadow-sm' :
                            isLengthMatch ? 'bg-primary/20 text-primary font-bold' :
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
                <div className="mb-2">
                  <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest italic">Decoded Strings (Restored)</p>
                  <div className="flex gap-2 flex-wrap">
                    <AnimatePresence>
                      {currentStep.decoded.map((str, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="px-3 py-1 rounded bg-green-500/10 border-2 border-green-500/30 text-green-600 font-mono text-sm font-bold shadow-sm"
                        >
                          "{str}"
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </Card>

            {/* Descriptive Commentary Box (at the bottom) */}
            <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
              <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Process Step
              </div>
              {currentStep.explanation}
            </div>

            {/* Variable Panel (below the commentary box) */}
            <div className="pt-2">
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
          </div>
        }
        rightContent={
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
        }
      />
    </div>
  );
};
