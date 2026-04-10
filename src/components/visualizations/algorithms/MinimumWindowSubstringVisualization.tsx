import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { StepControls } from '../shared/StepControls';
import { Button } from '@/components/ui/button';

interface Step {
  s: string;
  t: string;
  l: number;
  r: number;
  have: number;
  need: number;
  res: [number, number];
  resLen: number;
  countT: Record<string, number>;
  window: Record<string, number>;
  message: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

const USE_CASES = [
  {
    id: 'standard',
    label: 'Case 1: Standard',
    s: "ADOBECODEBANC",
    t: "ABC",
  },
  {
    id: 'no-solution',
    label: 'Case 2: No Solution',
    s: "ADOBE",
    t: "XYZ",
  },
  {
    id: 'already-min',
    label: 'Case 3: Already Minimum',
    s: "ABC",
    t: "ABC",
  }
];

export const MinimumWindowSubstringVisualization = () => {
  const [useCaseIdx, setUseCaseIdx] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const currentCase = USE_CASES[useCaseIdx];

  const steps = useMemo(() => {
    const s = currentCase.s;
    const t = currentCase.t;
    const steps: Step[] = [];

    // Signature
    steps.push({
      s, t, l: 0, r: -1, have: 0, need: 0, res: [-1, -1], resLen: Infinity,
      countT: {}, window: {},
      message: "Initialize the minWindow algorithm search.",
      highlightedLines: [1],
      variables: { s, t }
    });

    // Line 2: if (t === "") return "";
    steps.push({
      s, t, l: 0, r: -1, have: 0, need: 0, res: [-1, -1], resLen: Infinity,
      countT: {}, window: {},
      message: `Check if target string t is empty. t = "${t}"`,
      highlightedLines: [2],
      variables: { t }
    });

    if (t === "") {
      steps.push({
        s, t, l: 0, r: -1, have: 0, need: 0, res: [-1, -1], resLen: Infinity,
        countT: {}, window: {},
        message: "Target string is empty, returning empty string.",
        highlightedLines: [2],
        variables: { return: "" }
      });
      return steps;
    }

    const countT: Record<string, number> = {};
    const window: Record<string, number> = {};

    // Lines 3-4: Init records
    steps.push({
      s, t, l: 0, r: -1, have: 0, need: 0, res: [-1, -1], resLen: Infinity,
      countT: { ...countT }, window: { ...window },
      message: "Initialize frequency maps for target characters and current window.",
      highlightedLines: [3, 4],
      variables: { countT: {}, window: {} }
    });

    // Lines 5-7: Populate countT
    for (const c of t) {
      countT[c] = (countT[c] || 0) + 1;
      steps.push({
        s, t, l: 0, r: -1, have: 0, need: 0, res: [-1, -1], resLen: Infinity,
        countT: { ...countT }, window: { ...window },
        message: `Counting character '${c}' in target string t.`,
        highlightedLines: [5, 6],
        variables: { countT: { ...countT } }
      });
    }

    // Lines 8-9: have, need
    let have = 0;
    const need = Object.keys(countT).length;
    steps.push({
      s, t, l: 0, r: -1, have, need, res: [-1, -1], resLen: Infinity,
      countT: { ...countT }, window: { ...window },
      message: `Initialize 'have' to 0. Number of unique characters needed: ${need}.`,
      highlightedLines: [8, 9],
      variables: { have, need }
    });

    // Lines 10-12: res, resLen, l
    let res: [number, number] = [-1, -1];
    let resLen = Infinity;
    let l = 0;
    steps.push({
      s, t, l, r: -1, have, need, res, resLen,
      countT: { ...countT }, window: { ...window },
      message: "Initialize tracking variables and the left pointer 'l'.",
      highlightedLines: [10, 11, 12],
      variables: { res, resLen, l }
    });

    // Loop
    for (let r = 0; r < s.length; r++) {
      const c = s[r];
      window[c] = (window[c] || 0) + 1;

      steps.push({
        s, t, l, r, have, need, res, resLen,
        countT: { ...countT }, window: { ...window },
        message: `Expand window by moving right pointer to index ${r} ('${c}').`,
        highlightedLines: [13, 14, 15],
        variables: { r, c, "window[c]": window[c] }
      });

      if (c in countT && window[c] === countT[c]) {
        have++;
        steps.push({
          s, t, l, r, have, need, res, resLen,
          countT: { ...countT }, window: { ...window },
          message: `Character '${c}' count matches target frequency! Increment 'have'.`,
          highlightedLines: [16, 17],
          variables: { have, need }
        });
      }

      while (have === need) {
        steps.push({
          s, t, l, r, have, need, res, resLen,
          countT: { ...countT }, window: { ...window },
          message: `All required characters found (${have}/${need}). Checking if current window is smaller.`,
          highlightedLines: [19],
          variables: { have, need, currentSize: r - l + 1, resLen }
        });

        if ((r - l + 1) < resLen) {
          res = [l, r];
          resLen = r - l + 1;
          steps.push({
            s, t, l, r, have, need, res, resLen,
            countT: { ...countT }, window: { ...window },
            message: `Found smaller window! New minimum length: ${resLen}. Substring: "${s.slice(l, r + 1)}"`,
            highlightedLines: [20, 21, 22],
            variables: { res, resLen }
          });
        }

        const leftChar = s[l];
        window[leftChar]--;
        
        steps.push({
          s, t, l, r, have, need, res, resLen,
          countT: { ...countT }, window: { ...window },
          message: `Shrinking window by removing '${leftChar}' from index ${l}.`,
          highlightedLines: [24, 25],
          variables: { l, leftChar, "window[leftChar]": window[leftChar] }
        });

        if (leftChar in countT && window[leftChar] < countT[leftChar]) {
          have--;
          steps.push({
            s, t, l, r, have, need, res, resLen,
            countT: { ...countT }, window: { ...window },
            message: `Window no longer contains enough '${leftChar}'. Decrement 'have'.`,
            highlightedLines: [26, 27],
            variables: { have, need }
          });
        }

        l++;
        steps.push({
          s, t, l, r, have, need, res, resLen,
          countT: { ...countT }, window: { ...window },
          message: "Moving left pointer to search for a potentially smaller valid window.",
          highlightedLines: [29],
          variables: { l }
        });
      }
    }

    // Final Lines
    steps.push({
      s, t, l, r: s.length - 1, have, need, res, resLen,
      countT: { ...countT }, window: { ...window },
      message: "Finished iterating through the string. Preparing final result.",
      highlightedLines: [32],
      variables: { res }
    });

    const resultStr = resLen !== Infinity ? s.slice(res[0], res[1] + 1) : "";
    steps.push({
      s, t, l, r: s.length - 1, have, need, res, resLen,
      countT: { ...countT }, window: { ...window },
      message: `Final result: "${resultStr}"`,
      highlightedLines: [33],
      variables: { return: resultStr }
    });

    return steps;
  }, [currentCase]);

  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];

  const code = `function minWindow(s: string, t: string): string {
  if (t === "") return "";
  const countT: Record<string, number> = {};
  const window: Record<string, number> = {};
  for (const c of t) {
    countT[c] = (countT[c] || 0) + 1;
  }
  let have = 0;
  const need = Object.keys(countT).length;
  let res: [number, number] = [-1, -1];
  let resLen = Infinity;
  let l = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    window[c] = (window[c] || 0) + 1;
    if (c in countT && window[c] === countT[c]) {
      have++;
    }
    while (have === need) {
      if ((r - l + 1) < resLen) {
        res = [l, r];
        resLen = r - l + 1;
      }
      const leftChar = s[l];
      window[leftChar]--;
      if (leftChar in countT && window[leftChar] < countT[leftChar]) {
        have--;
      }
      l++;
    }
  }
  const [start, end] = res;
  return resLen !== Infinity ? s.slice(start, end + 1) : "";
}`;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1000 / speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handleUseCaseChange = (idx: number) => {
    setUseCaseIdx(idx);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const getCharStyle = (idx: number) => {
    const isCurrentR = idx === currentStep.variables.r;
    const isCurrentL = idx === currentStep.l;
    const isInWindow = idx >= currentStep.l && idx <= currentStep.r && currentStep.r !== -1;
    const isInResult = currentStep.res[0] !== -1 && idx >= currentStep.res[0] && idx <= currentStep.res[1];

    if (isCurrentR || isCurrentL) {
      return "bg-primary text-primary-foreground border-primary scale-110 z-10 shadow-md";
    }
    if (isInWindow) {
      return "bg-primary/20 text-foreground border-primary/30";
    }
    if (isInResult) {
      return "bg-green-500/20 text-foreground border-green-500/30";
    }
    return "bg-muted/50 text-foreground border-border";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 bg-card p-6 rounded-xl border-2 border-primary/10 shadow-sm overflow-x-auto">
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc, idx) => (
            <Button
              key={uc.id}
              variant={useCaseIdx === idx ? "default" : "outline"}
              size="sm"
              onClick={() => handleUseCaseChange(idx)}
              className={`text-xs h-8 px-4 rounded-full transition-all duration-200 ${useCaseIdx === idx ? "shadow-md scale-105" : "hover:bg-muted"}`}
            >
              {uc.label}
            </Button>
          ))}
        </div>
        <div className="w-full pt-4 border-t border-border/50">
          <StepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length - 1}
            onStepForward={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
            onStepBack={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6 flex flex-col gap-6 overflow-hidden border-2 border-primary/5 shadow-lg bg-card/50 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Target Characters (t)</span>
              <div className="flex gap-2">
                {currentCase.t.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border-2 bg-secondary/30 border-secondary text-foreground font-mono font-bold text-xs"
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Source String (s)</span>
                <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
                  <span>L: {currentStep.l}</span>
                  <span>R: {currentStep.variables.r !== undefined ? currentStep.variables.r : '-'}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentStep.s.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-xs transition-all duration-200 ${getCharStyle(idx)}`}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Character Frequencies</span>
                <div className="space-y-1">
                  {Object.entries(currentStep.countT).map(([char, count]) => (
                    <div key={char} className="flex justify-between items-center p-2 bg-muted/30 rounded-md border border-border/50">
                      <span className="font-mono text-xs font-bold text-foreground">{char}</span>
                      <span className={`font-mono text-xs font-bold ${ (currentStep.window[char] || 0) >= count ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                        {currentStep.window[char] || 0} / {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Current Best Window</span>
                <div className="p-3 bg-secondary/20 rounded-lg border border-secondary/50 flex flex-col items-center justify-center min-h-[60px]">
                  {currentStep.resLen === Infinity ? (
                    <span className="text-xs text-muted-foreground italic">No window found yet</span>
                  ) : (
                    <>
                      <span className="text-sm font-bold text-foreground font-mono">
                        "{currentStep.s.slice(currentStep.res[0], currentStep.res[1] + 1)}"
                      </span>
                      <span className="text-[10px] text-muted-foreground">Length: {currentStep.resLen}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Commentary
            </div>
            <p className="text-sm leading-relaxed text-foreground font-medium">
              {currentStep.message}
            </p>
          </div>

          <div className="pt-2">
            <VariablePanel variables={currentStep.variables} />
          </div>
        </Card>

        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={currentStep.highlightedLines}
        />
      </div>
    </div>
  );
};
