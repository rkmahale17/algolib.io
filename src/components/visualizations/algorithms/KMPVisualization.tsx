import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  text: string;
  pattern: string;
  lps: number[];
  i: number;
  j: number;
  explanation: string;
  highlightedLines: number[];
  variables: Record<string, any>;
  phase: 'init' | 'lps' | 'search' | 'match' | 'mismatch' | 'done';
  lps_i?: number;
  lps_len?: number;
  matchStatus?: 'match' | 'mismatch' | 'none';
  matchedRange?: [number, number];
}

export const KMPVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const textInput = "ababcabcabababd";
  const patternInput = "ababd";

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const text = textInput;
    const pattern = patternInput;

    s.push({
      text, pattern, lps: [], i: -1, j: -1,
      explanation: "Initialize KMP search function.",
      highlightedLines: [1],
      variables: { text, pattern },
      phase: 'init'
    });

    s.push({
      text, pattern, lps: [], i: -1, j: -1,
      explanation: "Check if pattern is empty. If so, it's found at index 0.",
      highlightedLines: [2],
      variables: { patternLength: pattern.length },
      phase: 'init'
    });
    if (pattern.length === 0) return s;

    s.push({
      text, pattern, lps: [], i: -1, j: -1,
      explanation: "Check if text is empty. If pattern is not empty, it cannot be found.",
      highlightedLines: [3],
      variables: { textLength: text.length },
      phase: 'init'
    });
    if (text.length === 0) return s;

    const lps = new Array(pattern.length).fill(0);
    let len = 0;

    s.push({
      text, pattern, lps: [...lps], i: -1, j: -1,
      explanation: "Call buildLPS to construct the LPS array.",
      highlightedLines: [22],
      variables: { pattern },
      phase: 'lps'
    });

    s.push({
      text, pattern, lps: [...lps], i: -1, j: -1,
      explanation: "Initialize LPS array with zeros.",
      highlightedLines: [6],
      variables: { lps: `[${lps.join(',')}]` },
      phase: 'lps'
    });

    s.push({
      text, pattern, lps: [...lps], i: -1, j: -1,
      explanation: "Initialize len to 0.",
      highlightedLines: [7],
      variables: { len },
      phase: 'lps'
    });

    for (let l_i = 1; l_i < pattern.length;) {
      s.push({
        text, pattern, lps: [...lps], i: -1, j: -1,
        explanation: `Comparing pattern[${l_i}] ('${pattern[l_i]}') with pattern[${len}] ('${pattern[len]}').`,
        highlightedLines: [8, 9],
        variables: { i: l_i, len, "pattern[i]": pattern[l_i], "pattern[len]": pattern[len] },
        phase: 'lps',
        lps_i: l_i,
        lps_len: len,
        matchStatus: pattern[l_i] === pattern[len] ? 'match' : 'mismatch'
      });

      if (pattern[l_i] === pattern[len]) {
        len++;
        lps[l_i] = len;
        s.push({
          text, pattern, lps: [...lps], i: -1, j: -1,
          explanation: `Characters match! Increment len to ${len} and set lps[${l_i}] = ${len}.`,
          highlightedLines: [10],
          variables: { i: l_i, len, lps: `[${lps.join(',')}]` },
          phase: 'lps',
          lps_i: l_i,
          lps_len: len,
          matchStatus: 'match'
        });
        l_i++;
      } else if (len !== 0) {
        const oldLen = len;
        len = lps[len - 1];
        s.push({
          text, pattern, lps: [...lps], i: -1, j: -1,
          explanation: `Mismatch and len != 0. Update len to lps[${oldLen - 1}] = ${len}.`,
          highlightedLines: [12, 13],
          variables: { i: l_i, oldLen, newLen: len },
          phase: 'lps',
          lps_i: l_i,
          lps_len: len,
          matchStatus: 'mismatch'
        });
      } else {
        lps[l_i] = 0;
        s.push({
          text, pattern, lps: [...lps], i: -1, j: -1,
          explanation: `Mismatch and len == 0. Set lps[${l_i}] = 0 and move to next character.`,
          highlightedLines: [15, 16],
          variables: { i: l_i, len, lps: `[${lps.join(',')}]` },
          phase: 'lps',
          lps_i: l_i,
          lps_len: len,
          matchStatus: 'mismatch'
        });
        l_i++;
      }
    }

    s.push({
      text, pattern, lps: [...lps], i: -1, j: -1,
      explanation: "LPS array construction complete. Return lps.",
      highlightedLines: [19],
      variables: { lps: `[${lps.join(',')}]` },
      phase: 'lps'
    });

    let i = 0;
    let j = 0;

    s.push({
      text, pattern, lps: [...lps], i, j,
      explanation: "Initialize pointers i=0 (text) and j=0 (pattern).",
      highlightedLines: [23, 24],
      variables: { i, j },
      phase: 'search'
    });

    while (i < text.length) {
      s.push({
        text, pattern, lps: [...lps], i, j,
        explanation: `Comparing text[${i}] ('${text[i]}') with pattern[${j}] ('${pattern[j]}').`,
        highlightedLines: [26, 27],
        variables: { i, j, "text[i]": text[i], "pattern[j]": pattern[j] },
        phase: 'search',
        matchStatus: text[i] === pattern[j] ? 'match' : 'mismatch'
      });

      if (text[i] === pattern[j]) {
        i++;
        j++;
        s.push({
          text, pattern, lps: [...lps], i, j,
          explanation: `Characters match! Increment both i to ${i} and j to ${j}.`,
          highlightedLines: [28, 29],
          variables: { i, j },
          phase: 'match',
          matchStatus: 'match'
        });
      }

      if (j === pattern.length) {
        s.push({
          text, pattern, lps: [...lps], i, j,
          explanation: `Full pattern match found! Returning start index i - j = ${i - j}.`,
          highlightedLines: [31, 32],
          variables: { startIdx: i - j },
          phase: 'done',
          matchedRange: [i - j, i - 1]
        });
        return s;
      } else if (i < text.length && text[i] !== pattern[j]) {
        s.push({
          text, pattern, lps: [...lps], i, j,
          explanation: `Mismatch found at text[${i}] and pattern[${j}].`,
          highlightedLines: [33],
          variables: { i, j, "text[i]": text[i], "pattern[j]": pattern[j] },
          phase: 'mismatch',
          matchStatus: 'mismatch'
        });

        if (j !== 0) {
          const oldJ = j;
          j = lps[j - 1];
          s.push({
            text, pattern, lps: [...lps], i, j,
            explanation: `j != 0. Use LPS to shift pattern. new j = lps[${oldJ - 1}] = ${j}.`,
            highlightedLines: [34, 35],
            variables: { oldJ, newJ: j },
            phase: 'mismatch',
            matchStatus: 'none'
          });
        } else {
          i++;
          s.push({
            text, pattern, lps: [...lps], i, j,
            explanation: `j == 0. Cannot shift pattern further. Incrementing i to ${i}.`,
            highlightedLines: [37],
            variables: { i, j },
            phase: 'mismatch',
            matchStatus: 'none'
          });
        }
      }
    }

    s.push({
      text, pattern, lps: [...lps], i, j,
      explanation: "Search complete. Pattern not found in text.",
      highlightedLines: [40],
      variables: {},
      phase: 'done'
    });

    return s;
  }, [textInput, patternInput]);

  const code = `function solution(text: string, pattern: string): number {
  if (pattern.length === 0) return 0;
  if (text.length === 0) return -1;

  function buildLPS(p: string): number[] {
    const lps = new Array(p.length).fill(0);
    let len = 0;
    for (let i = 1; i < p.length;) {
      if (p[i] === p[len]) {
        lps[i++] = ++len;
      }
      else if (len !== 0) {
        len = lps[len - 1];
      }
      else {
        lps[i++] = 0;
      }
    }
    return lps;
  }

  const lps = buildLPS(pattern);
  let i = 0;
  let j = 0;

  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }
    if (j === pattern.length)
      return i - j;
    else if (i < text.length && text[i] !== pattern[j]) {
      if (j !== 0)
        j = lps[j - 1];
      else
        i++;
    }
  }
  return -1;
}`;

  const step = steps[currentStep] || steps[steps.length - 1];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden">
            <h3 className="text-xs font-bold mb-8 text-muted-foreground uppercase tracking-widest">KMP Search</h3>

            <div className="space-y-12">
              <div className="overflow-x-auto pb-4 scrollbar-hide">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest opacity-60">Text Array</h4>
                <div className="flex gap-1.5 justify-center min-w-max px-4">
                  {step.text.split('').map((char, idx) => {
                    const isCurrent = (idx === step.i && (step.phase === 'search' || step.phase === 'match' || step.phase === 'mismatch'));
                    const isMatchedResult = step.matchedRange && idx >= step.matchedRange[0] && idx <= step.matchedRange[1];
                    const isMatch = isCurrent && step.matchStatus === 'match';
                    const isMismatch = isCurrent && step.matchStatus === 'mismatch';

                    return (
                      <div key={idx} className="relative flex flex-col items-center">
                        <motion.div
                          animate={{
                            backgroundColor: isMatchedResult
                              ? "rgba(16, 185, 129, 0.2)"
                              : isMatch
                                ? "rgba(16, 185, 129, 0.15)"
                                : isMismatch
                                  ? "rgba(239, 68, 68, 0.15)"
                                  : (isCurrent ? "rgba(var(--primary), 0.15)" : "rgba(255, 255, 255, 0.03)"),
                            borderColor: isMatchedResult
                              ? "rgb(16, 185, 129)"
                              : isMatch
                                ? "rgb(16, 185, 129)"
                                : isMismatch
                                  ? "rgb(239, 68, 68)"
                                  : (isCurrent ? "var(--primary)" : "rgba(255, 255, 255, 0.1)"),
                            scale: isCurrent || isMatchedResult ? 1.05 : 1,
                            y: isCurrent ? -2 : 0
                          }}
                          className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center text-sm font-bold transition-all backdrop-blur-md
                            ${isCurrent ? 'z-10 ring-2 ring-primary/20' : 'z-0'}
                          `}
                        >
                          {char}
                        </motion.div>
                        <AnimatePresence>
                          {isCurrent && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute -bottom-6 flex flex-col items-center"
                            >
                              <div className="w-0.5 h-2 bg-primary mb-0.5" />
                              <span className="text-[8px] font-bold text-primary px-1 bg-primary/20 rounded">i</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="absolute -top-5">
                          <span className="text-[8px] text-muted-foreground font-mono opacity-40">{idx}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative pt-8 min-h-[100px]">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest opacity-60">Pattern Matching</h4>
                <div
                  className="flex gap-1.5 justify-center transition-all duration-500 ease-out min-w-max px-4"
                  style={{
                    transform: (step.phase === 'search' || step.phase === 'match' || step.phase === 'mismatch' || step.phase === 'done')
                      ? `translateX(${(step.i - step.j - step.text.length / 2 + step.pattern.length / 2) * 46}px)`
                      : 'none'
                  }}
                >
                  {step.pattern.split('').map((char, idx) => {
                    const isCurrent = idx === step.j && (step.phase === 'search' || step.phase === 'match' || step.phase === 'mismatch');
                    const isLPSMatch = step.phase === 'lps' && idx === step.lps_i;
                    const isLPSLen = step.phase === 'lps' && idx === step.lps_len;
                    const isMatch = isCurrent && step.matchStatus === 'match';
                    const isMismatch = isCurrent && step.matchStatus === 'mismatch';

                    return (
                      <div key={idx} className="relative flex flex-col items-center">
                        <motion.div
                          animate={{
                            backgroundColor: isMatch
                              ? "rgba(16, 185, 129, 0.15)"
                              : isMismatch
                                ? "rgba(239, 68, 68, 0.15)"
                                : isCurrent
                                  ? "rgba(59, 130, 246, 0.15)"
                                  : (isLPSMatch || isLPSLen ? "rgba(168, 85, 247, 0.15)" : "rgba(255, 255, 255, 0.03)"),
                            borderColor: isMatch
                              ? "rgb(16, 185, 129)"
                              : isMismatch
                                ? "rgb(239, 68, 68)"
                                : isCurrent
                                  ? "rgb(59, 130, 246)"
                                  : (isLPSMatch || isLPSLen ? "rgb(168, 85, 247)" : "rgba(255, 255, 255, 0.1)"),
                            scale: isCurrent || isLPSMatch || isLPSLen ? 1.05 : 1,
                            y: isCurrent ? 2 : 0
                          }}
                          className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center text-sm font-bold transition-all backdrop-blur-md
                            ${isCurrent ? 'z-10 ring-2 ring-blue-500/20' : 'z-0'}
                          `}
                        >
                          {char}
                        </motion.div>
                        <AnimatePresence>
                          {isCurrent && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute -top-6 flex flex-col items-center"
                            >
                              <span className="text-[8px] font-bold text-blue-500 px-1 bg-blue-500/20 rounded mb-0.5">j</span>
                              <div className="w-0.5 h-2 bg-blue-500" />
                            </motion.div>
                          )}
                          {(isLPSMatch || isLPSLen) && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute -top-6 flex flex-col items-center"
                            >
                              <span className={`text-[8px] font-bold px-1 rounded mb-0.5 ${isLPSMatch ? 'text-purple-500 bg-purple-500/20' : 'text-purple-400 bg-purple-400/20'}`}>
                                {isLPSMatch ? 'i' : 'len'}
                              </span>
                              <div className={`w-0.5 h-2 ${isLPSMatch ? 'bg-purple-500' : 'bg-purple-400'}`} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="absolute -bottom-5">
                          <span className="text-[8px] text-muted-foreground font-mono opacity-40">{idx}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-xl border border-primary/10">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest opacity-60">LPS (Longest Prefix Suffix) Array</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {step.pattern.split('').map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="text-[8px] text-muted-foreground mb-1 font-mono opacity-40">[{idx}]</div>
                      <motion.div
                        animate={{
                          backgroundColor: step.phase === 'lps' && idx === step.lps_i ? "rgba(168, 85, 247, 0.15)" : "rgba(255, 255, 255, 0.02)",
                          borderColor: step.phase === 'lps' && idx === step.lps_i ? "rgb(168, 85, 247)" : "rgba(255, 255, 255, 0.05)",
                          scale: step.phase === 'lps' && idx === step.lps_i ? 1.05 : 1
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border bg-muted/20 font-bold text-sm backdrop-blur-sm"
                      >
                        {step.lps[idx] !== undefined ? step.lps[idx] : 0}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Explanation</h4>
            <p className="text-sm font-medium leading-relaxed">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
