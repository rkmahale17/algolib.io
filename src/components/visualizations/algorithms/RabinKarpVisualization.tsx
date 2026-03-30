import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
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
  result: number[];
}

const code = `function solution(text: string, pattern: string): number[] {
  const result: number[] = [];
  const n = text.length;
  const m = pattern.length;

  if (pattern === "") {
    for (let i = 0; i < n; i++) result.push(i);
    return result;
  }

  if (n === 0 || m > n) return [];

  const lps: number[] = new Array(m).fill(0);

  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  let j = 0;
  i = 0;

  while (i < n) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }

    if (j === m) {
      result.push(i - j);
      j = lps[j - 1];
    } else if (i < n && text[i] !== pattern[j]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return result;
}`;

export const RabinKarpVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const textInput = 'ababcabcabababd';
  const patternInput = 'aba';

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const text = textInput;
    const pattern = patternInput;
    const n = text.length;
    const m = pattern.length;
    let currentResult: number[] = [];

    const push = (
      explanation: string,
      highlightedLines: number[],
      variables: Record<string, any>,
      phase: Step['phase'],
      i: number,
      j: number,
      lps: number[],
      lps_i?: number,
      lps_len?: number
    ) => {
      s.push({
        text,
        pattern,
        lps: [...lps],
        i,
        j,
        explanation,
        highlightedLines,
        variables,
        phase,
        lps_i,
        lps_len,
        result: [...currentResult],
      });
    };

    push('Initialize result array, n, and m.', [1, 2, 3, 4], { n, m, result: '[]' }, 'init', -1, -1, []);

    if (pattern.length === 0) {
      push('Pattern is empty, push all indices to result.', [6, 7, 8], { pattern: '""' }, 'done', -1, -1, []);
      return s;
    }
    push('Pattern is not empty, proceed.', [6], { pattern }, 'init', -1, -1, []);

    if (n === 0 || m > n) {
      push('Text is empty or pattern longer than text, return [].', [11], { n, m }, 'done', -1, -1, []);
      return s;
    }
    push('Text length and pattern length are valid.', [11], { n, m }, 'init', -1, -1, []);

    const lps: number[] = new Array(m).fill(0);
    push('Initialize LPS array with zeros.', [13], { lps: `[${lps.join(',')}]` }, 'lps', -1, -1, lps);

    let len = 0;
    let i = 1;
    push('Set len=0, i=1 to begin LPS computation.', [15, 16], { len, i }, 'lps', -1, -1, lps);

    while (i < m) {
      push(
        `Loop: i=${i} < m=${m}. Comparing pattern[${i}]='${pattern[i]}' with pattern[${len}]='${pattern[len]}'.`,
        [18, 19],
        { i, len, 'pattern[i]': pattern[i], 'pattern[len]': pattern[len] },
        'lps',
        -1,
        -1,
        lps,
        i,
        len
      );

      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        push(
          `Match! len→${len}, lps[${i}]=${len}. Increment i→${i + 1}.`,
          [20, 21, 22],
          { i, len, lps: `[${lps.join(',')}]` },
          'lps',
          -1,
          -1,
          lps,
          i,
          len
        );
        i++;
      } else if (len !== 0) {
        const prev = len;
        len = lps[len - 1];
        push(
          `Mismatch, len≠0. Set len=lps[${prev - 1}]=${len}. i stays ${i}.`,
          [24, 25],
          { i, oldLen: prev, newLen: len },
          'lps',
          -1,
          -1,
          lps,
          i,
          len
        );
      } else {
        lps[i] = 0;
        push(
          `Mismatch, len=0. Set lps[${i}]=0. Increment i→${i + 1}.`,
          [27, 28],
          { i, len, lps: `[${lps.join(',')}]` },
          'lps',
          -1,
          -1,
          lps,
          i,
          len
        );
        i++;
      }
    }

    push('LPS construction complete.', [13], { lps: `[${lps.join(',')}]` }, 'lps', -1, -1, lps);

    let j = 0;
    i = 0;
    push('Set j=0, i=0 for pattern search phase.', [32, 33], { i, j }, 'search', i, j, lps);

    while (i < n) {
      push(
        `Search loop: i=${i}, j=${j}. text[${i}]='${text[i]}' vs pattern[${j}]='${pattern[j]}'.`,
        [35, 36],
        { i, j, 'text[i]': text[i], 'pattern[j]': pattern[j] },
        'search',
        i,
        j,
        lps
      );

      if (text[i] === pattern[j]) {
        i++;
        j++;
        push(
          `Characters match. i→${i}, j→${j}.`,
          [37, 38],
          { i, j },
          'match',
          i,
          j,
          lps
        );
      }

      if (j === m) {
        currentResult = [...currentResult, i - j];
        push(
          `Pattern found at index ${i - j}! Push to result. Use LPS to shift: j=lps[${j - 1}]=${lps[j - 1]}.`,
          [42, 43],
          { matchIdx: i - j, result: `[${currentResult.join(',')}]`, newJ: lps[j - 1] },
          'match',
          i,
          j,
          lps
        );
        j = lps[j - 1];
      } else if (i < n && text[i] !== pattern[j]) {
        push(
          `Mismatch: text[${i}]='${text[i]}' ≠ pattern[${j}]='${pattern[j]}'.`,
          [44, 45],
          { i, j, 'text[i]': text[i], 'pattern[j]': pattern[j] },
          'mismatch',
          i,
          j,
          lps
        );
        if (j !== 0) {
          const oldJ = j;
          j = lps[j - 1];
          push(
            `j≠0. Shift pattern: j=lps[${oldJ - 1}]=${j}.`,
            [46, 47],
            { oldJ, newJ: j },
            'mismatch',
            i,
            j,
            lps
          );
        } else {
          i++;
          push(
            `j=0. Advance i→${i}.`,
            [49, 50],
            { i, j },
            'mismatch',
            i,
            j,
            lps
          );
        }
      }
    }

    push(
      `Search complete. All matches: [${currentResult.join(', ')}].`,
      [54],
      { result: `[${currentResult.join(',')}]` },
      'done',
      i,
      j,
      lps
    );

    return s;
  }, [textInput, patternInput]);

  const step = steps[currentStep] || steps[steps.length - 1];

  const phaseColor = {
    init: 'rgba(var(--primary), 0.1)',
    lps: 'rgba(168, 85, 247, 0.15)',
    search: 'rgba(59, 130, 246, 0.15)',
    match: 'rgba(34, 197, 94, 0.15)',
    mismatch: 'rgba(239, 68, 68, 0.15)',
    done: 'rgba(34, 197, 94, 0.15)',
  }[step.phase];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-5">
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-xs font-semibold mb-6 text-muted-foreground uppercase tracking-widest">
              KMP String Search
            </h3>

            <div className="space-y-10">
              {/* Text Row */}
              <div>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest">Text</h4>
                <div className="flex flex-wrap gap-x-1 gap-y-6 justify-center pb-4">
                  {step.text.split('').map((char, idx) => {
                    const isI = idx === step.i && (step.phase === 'search' || step.phase === 'match' || step.phase === 'mismatch');
                    const isMatched = step.result.some((start) => idx >= start && idx < start + step.pattern.length);
                    const isCurrent = step.phase === 'search' || step.phase === 'match' || step.phase === 'mismatch'
                      ? idx >= step.i - step.j && idx < step.i - step.j + step.pattern.length && step.j > 0
                      : false;

                    return (
                      <div key={idx} className="relative flex flex-col items-center">
                        <span className="text-[9px] text-muted-foreground font-mono mb-1">{idx}</span>
                        <motion.div
                          animate={{
                            backgroundColor: isMatched
                              ? 'rgba(34, 197, 94, 0.25)'
                              : isCurrent
                                ? 'rgba(59, 130, 246, 0.15)'
                                : 'transparent',
                            borderColor: isMatched
                              ? 'rgb(34, 197, 94)'
                              : isI
                                ? 'var(--primary)'
                                : isCurrent
                                  ? 'rgb(59, 130, 246)'
                                  : 'var(--border)',
                            scale: isI ? 1.1 : 1,
                          }}
                          className="w-9 h-9 border-2 rounded-lg flex items-center justify-center text-sm font-bold"
                        >
                          {char}
                        </motion.div>
                        <div className="absolute -bottom-5">
                          {isI && <span className="text-[9px] font-black text-primary uppercase">i</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pattern Row */}
              <div className="pt-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest">Pattern</h4>
                <div className="flex flex-wrap gap-x-1 gap-y-6 justify-center pb-4">
                  {step.pattern.split('').map((char, idx) => {
                    const isJ = idx === step.j && (step.phase === 'search' || step.phase === 'match' || step.phase === 'mismatch');
                    const isLpsI = step.phase === 'lps' && idx === step.lps_i;
                    const isLpsLen = step.phase === 'lps' && idx === step.lps_len;

                    return (
                      <div key={idx} className="relative flex flex-col items-center">
                        <span className="text-[9px] text-muted-foreground font-mono mb-1">{idx}</span>
                        <motion.div
                          animate={{
                            backgroundColor: isLpsI || isLpsLen
                              ? 'rgba(168, 85, 247, 0.2)'
                              : isJ
                                ? 'rgba(59, 130, 246, 0.15)'
                                : 'transparent',
                            borderColor: isLpsI
                              ? 'rgb(168, 85, 247)'
                              : isLpsLen
                                ? 'rgb(192, 132, 252)'
                                : isJ
                                  ? 'rgb(59, 130, 246)'
                                  : 'var(--border)',
                            scale: isJ || isLpsI ? 1.1 : 1,
                          }}
                          className="w-9 h-9 border-2 rounded-lg flex items-center justify-center text-sm font-bold"
                        >
                          {char}
                        </motion.div>
                        <div className="absolute -bottom-5 flex gap-1">
                          {isJ && <span className="text-[9px] font-black text-blue-500 uppercase">j</span>}
                          {isLpsI && <span className="text-[9px] font-black text-purple-500 uppercase">i</span>}
                          {isLpsLen && <span className="text-[9px] font-black text-purple-400 uppercase">len</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LPS Array */}
              <div className="pt-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest">
                  LPS Array
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {step.pattern.split('').map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] text-muted-foreground font-mono">[{idx}]</span>
                      <motion.div
                        animate={{
                          backgroundColor:
                            step.phase === 'lps' && idx === step.lps_i
                              ? 'rgba(168, 85, 247, 0.2)'
                              : 'transparent',
                          borderColor:
                            step.phase === 'lps' && idx === step.lps_i
                              ? 'rgb(168, 85, 247)'
                              : 'var(--border)',
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 bg-muted/20 font-bold text-sm"
                      >
                        {step.lps[idx] ?? 0}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Array */}
              {step.result.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-green-500 uppercase mb-3 tracking-widest">
                    Matches Found
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {step.result.map((idx, k) => (
                      <motion.div
                        key={k}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-3 py-1.5 bg-green-500/20 border border-green-500 rounded-full text-sm font-bold text-green-400"
                      >
                        {idx}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Explanation */}
          <motion.div
            animate={{ backgroundColor: phaseColor }}
            className="rounded-xl border border-primary/20 p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1.5 ml-2">Step</h4>
            <p className="text-sm font-medium leading-relaxed ml-2">{step.explanation}</p>
          </motion.div>

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
