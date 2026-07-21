import { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  strs: string[];
  res: string;
  activeCol: number;
  activeRow: number;
  mismatchCell: { r: number, c: number } | null;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  python: `def longestCommonPrefix(strs: list[str]) -> str:
    res = ""
    if not strs:
        return res
    for i in range(len(strs[0])):
        for s in strs:
            if i == len(s) or s[i] != strs[0][i]:
                return res
        res += strs[0][i]
    return res`,

  typescript: `function longestCommonPrefix(strs: string[]): string {
    let res = "";
    if (strs.length === 0) {
        return res;
    }
    for (let i = 0; i < strs[0].length; i++) {
        for (const s of strs) {
            if (i === s.length || s[i] !== strs[0][i]) {
                return res;
            }
        }
        res += strs[0][i];
    }
    return res;
}`,

  java: `public String longestCommonPrefix(String[] strs) {
    if (strs == null || strs.length == 0) {
        return "";
    }
    String res = "";
    for (int i = 0; i < strs[0].length(); i++) {
        char currentChar = strs[0].charAt(i);
        for (String s : strs) {
            if (i == s.length() || s.charAt(i) != currentChar) {
                return res;
            }
        }
        res += currentChar;
    }
    return res;
}`,

  cpp: `string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) {
        return "";
    }
    string res = "";
    for (int i = 0; i < strs[0].length(); ++i) {
        char currentChar = strs[0][i];
        for (const string& s : strs) {
            if (i >= s.length() || s[i] != currentChar) {
                return res;
            }
        }
        res += currentChar;
    }
    return res;
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const strs = ["flower", "flow", "flight"];
  const steps: Step[] = [];
  let res = "";
  
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

  steps.push({
    strs,
    res,
    activeCol: -1,
    activeRow: -1,
    mismatchCell: null,
    variables: { res: '""', i: '-', s: '-' },
    explanation: 'Initialize an empty string "res" to store the longest common prefix.',
    pseudoStep: 'SET res = ""'
  });
  addLines(2, 2, 5, 5); // init res

  steps.push({
    strs,
    res,
    activeCol: -1,
    activeRow: -1,
    mismatchCell: null,
    variables: { res: '""', i: '-', s: '-' },
    explanation: 'Check if the array "strs" is empty.',
    pseudoStep: 'IF strs is empty THEN RETURN res'
  });
  addLines(3, 3, 2, 2); // check empty

  for (let i = 0; i < strs[0].length; i++) {
    steps.push({
      strs,
      res,
      activeCol: i,
      activeRow: -1,
      mismatchCell: null,
      variables: { res: `"${res}"`, i, s: '-' },
      explanation: `Start checking character at index i=${i} ('${strs[0][i]}') from the first string.`,
      pseudoStep: `FOR i = ${i} TO ${strs[0].length - 1}:`
    });
    addLines(6, 5, 6, 6); // outer loop

    const currentChar = strs[0][i];
    let mismatch = false;

    for (let row = 0; row < strs.length; row++) {
      const s = strs[row];

      steps.push({
        strs,
        res,
        activeCol: i,
        activeRow: row,
        mismatchCell: null,
        variables: { res: `"${res}"`, i, s: `"${s}"` },
        explanation: `Compare with string "${s}".`,
        pseudoStep: `FOR each string s IN strs: (s="${s}")`
      });
      addLines(7, 6, 8, 8); // inner loop

      steps.push({
        strs,
        res,
        activeCol: i,
        activeRow: row,
        mismatchCell: null,
        variables: { res: `"${res}"`, i, s: `"${s}"` },
        explanation: `Check if i=${i} is out of bounds for "${s}" or if s[${i}] ('${s[i] || ''}') doesn't match '${currentChar}'.`,
        pseudoStep: `IF i == s.length OR s[i] != '${currentChar}':`
      });
      addLines(8, 7, 9, 9); // condition

      if (i === s.length || s[i] !== currentChar) {
        steps.push({
          strs,
          res,
          activeCol: i,
          activeRow: row,
          mismatchCell: { r: row, c: i },
          variables: { res: `"${res}"`, i, s: `"${s}"` },
          explanation: `Mismatch found at "${s}"! Return accumulated prefix "${res}".`,
          pseudoStep: `RETURN res ("${res}")`
        });
        addLines(9, 8, 10, 10); // return res
        mismatch = true;
        break;
      }
    }

    if (mismatch) {
      break;
    }

    res += currentChar;
    steps.push({
      strs,
      res,
      activeCol: i,
      activeRow: -1,
      mismatchCell: null,
      variables: { res: `"${res}"`, i, s: '-' },
      explanation: `All strings match at index ${i}. Append '${currentChar}' to res.`,
      pseudoStep: `APPEND '${currentChar}' TO res`
    });
    addLines(12, 9, 13, 13); // append to res
  }

  // Only add the final return step if we didn't exit early from a mismatch.
  // Wait, if it didn't mismatch, the loop naturally finishes and returns.
  // We'll check if the full loop ran.
  const didMismatch = steps[steps.length - 1].pseudoStep.startsWith("RETURN");
  if (!didMismatch) {
    steps.push({
      strs,
      res,
      activeCol: -1,
      activeRow: -1,
      mismatchCell: null,
      variables: { res: `"${res}"`, i: '-', s: '-' },
      explanation: `Checked all characters of the first string. Return the full prefix "${res}".`,
      pseudoStep: `RETURN res ("${res}")`
    });
    addLines(14, 10, 15, 15); // final return res
  }

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const LongestCommonPrefixVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: visual state */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex flex-col gap-6">
            
            {/* strs Array */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-foreground">Strings (strs)</h3>
              <div className="flex flex-col gap-3">
                {currentStep.strs.map((str, rowIdx) => (
                  <div key={rowIdx} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-12 text-right shrink-0">strs[{rowIdx}]</span>
                    <div className="flex gap-1">
                      {str.split('').map((char, colIdx) => {
                        let bgColor = 'bg-muted/50 border-border';
                        let textColor = 'text-foreground';
                        let isHighlighted = false;
                        
                        // Current column being checked
                        if (colIdx === currentStep.activeCol) {
                          if (currentStep.activeRow === -1 || currentStep.activeRow >= rowIdx) {
                            bgColor = 'bg-primary border-primary scale-110 shadow-lg';
                            textColor = 'text-primary-foreground';
                            isHighlighted = true;
                          }
                          // Mismatch cell
                          if (currentStep.mismatchCell && currentStep.mismatchCell.r === rowIdx && currentStep.mismatchCell.c === colIdx) {
                            bgColor = 'bg-destructive border-destructive scale-110 shadow-lg';
                            textColor = 'text-destructive-foreground';
                            isHighlighted = true;
                          }
                        }
                        // Prefix matched so far
                        else if (colIdx < currentStep.res.length) {
                          bgColor = 'bg-primary/20 border-primary/50';
                        }

                        return (
                          <div
                            key={colIdx}
                            className={`w-8 h-8 rounded flex items-center justify-center border ${bgColor} ${isHighlighted ? 'z-10' : ''}`}
                          >
                            <span className={`font-mono text-sm font-semibold ${textColor}`}>{char}</span>
                          </div>
                        );
                      })}
                      {/* Show empty box if testing out of bounds (when checking s.length) */}
                      {currentStep.mismatchCell && currentStep.mismatchCell.r === rowIdx && currentStep.mismatchCell.c === str.length && (
                        <div className="w-8 h-8 rounded flex items-center justify-center border bg-destructive border-destructive scale-110 shadow-lg z-10">
                           <span className="font-mono text-sm font-semibold text-destructive-foreground">?</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* res String */}
            <div>
              <h3 className="font-semibold mb-2 text-sm text-foreground">Result (res)</h3>
              <div className="flex justify-start gap-1">
                {currentStep.res.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic h-8 flex items-center">"" (Empty)</div>
                ) : (
                  currentStep.res.split('').map((char, idx) => (
                    <div key={idx} className="w-8 h-8 rounded flex items-center justify-center border border-primary bg-primary/20">
                      <span className="font-mono text-sm font-semibold text-foreground">{char}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>
          
          <VariablePanel variables={currentStep.variables} />

        </div>

        {/* Right column: code */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
        </div>
      </div>
    </div>
  );
};
