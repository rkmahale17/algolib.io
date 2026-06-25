import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  text: string;
  pattern: string;
  lps: number[];
  i: number;
  j: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  phase: 'init' | 'lps' | 'search' | 'match' | 'mismatch' | 'done';
  lps_i?: number;
  lps_len?: number;
  result: number[];
}

const languages: VisualizationLanguageMap = {
  typescript: `function solution(text: string, pattern: string): number[] {
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
}`,

  python: `def solution(text: str, pattern: str):
    n = len(text)
    m = len(pattern)
    result = []
    if pattern == "":
        return list(range(n))
    if n == 0 or m > n:
        return []
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    i = 0
    j = 0
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
        if j == m:
            result.append(i - j)
            j = lps[j - 1]
        elif i < n and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return result`,

  java: `public static class Solution {
    public static List<Integer> solution(String text, String pattern) {
        List<Integer> result = new ArrayList<>();
        int n = text.length();
        int m = pattern.length();
        if (pattern.equals("")) {
            for (int i = 0; i < n; i++) result.add(i);
            return result;
        }
        if (n == 0 || m > n) return result;
        int[] lps = new int[m];
        int len = 0;
        int i = 1;
        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        i = 0;
        int j = 0;
        while (i < n) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;
            }
            if (j == m) {
                result.add(i - j);
                j = lps[j - 1];
            }
            else if (i < n && text.charAt(i) != pattern.charAt(j)) {
                if (j != 0)
                    j = lps[j - 1];
                else
                    i++;
            }
        }
        return result;
    }
}`,

  cpp: `class Solution {
public:
    vector<int> solution(string text, string pattern) {
        vector<int> result;
        int n = text.length();
        int m = pattern.length();
        if (pattern == "") {
            for (int i = 0; i < n; i++) result.push_back(i);
            return result;
        }
        if (n == 0 || m > n) return result;
        vector<int> lps(m, 0);
        int len = 0;
        int i = 1;
        while (i < m) {
            if (pattern[i] == pattern[len]) {
                len++;
                lps[i] = len;
                i++;
            }
            else {
                if (len != 0) {
                    len = lps[len - 1];
                }
                else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        int j = 0;
        i = 0;
        while (i < n) {
            if (text[i] == pattern[j]) {
                i++;
                j++;
            }
            if (j == m) {
                result.push_back(i - j);
                j = lps[j - 1];
            }
            else if (i < n && text[i] != pattern[j]) {
                if (j != 0)
                    j = lps[j - 1];
                else
                    i++;
            }
        }
        return result;
    }
};`,
};

export const RabinKarpVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const textInput = 'ababcabcabababd';
  const patternInput = 'aba';

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const text = textInput;
    const pattern = patternInput;
    const n = text.length;
    const m = pattern.length;
    let currentResult: number[] = [];

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

    const push = (
      explanation: string,
      pseudoStep: string,
      ts: number, py: number, java: number, cpp: number,
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
        pseudoStep,
        variables,
        phase,
        lps_i,
        lps_len,
        result: [...currentResult],
      });
      addLines(ts, py, java, cpp);
    };

    // 1. Init
    push(
      'Initialize result array, n, and m.',
      'SET result = [], n = text.length, m = pattern.length',
      2, 2, 3, 4,
      { n, m, result: '[]' },
      'init', -1, -1, []
    );

    if (pattern.length === 0) {
      push(
        'Pattern is empty, push all indices to result.',
        'RETURN all indices [0..n-1]',
        5, 5, 6, 7,
        { pattern: '""' },
        'done', -1, -1, []
      );
      return { steps: s, stepLineNumbers };
    }

    if (n === 0 || m > n) {
      push(
        'Text is empty or pattern is longer than text. Return empty result.',
        'RETURN []',
        9, 7, 10, 11,
        { n, m },
        'done', -1, -1, []
      );
      return { steps: s, stepLineNumbers };
    }

    const lps: number[] = new Array(m).fill(0);
    push(
      'Initialize LPS array with zeros.',
      'SET lps = [0, 0, ...]',
      10, 9, 11, 12,
      { lps: `[${lps.join(',')}]` },
      'lps', -1, -1, lps
    );

    let len = 0;
    let i = 1;
    push(
      'Set len = 0, i = 1 to begin LPS computation.',
      'SET len = 0, i = 1',
      11, 10, 12, 13,
      { len, i },
      'lps', -1, -1, lps
    );

    while (i < m) {
      push(
        `Compare pattern[${i}]='${pattern[i]}' with pattern[${len}]='${pattern[len]}' to compute LPS.`,
        `WHILE i (${i}) < m (${m}) : IF pattern[i] == pattern[len]`,
        13, 12, 14, 15,
        { i, len, 'pattern[i]': pattern[i], 'pattern[len]': pattern[len] },
        'lps', -1, -1, lps, i, len
      );

      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        push(
          `Match! Increment len to ${len}, set lps[${i}] = ${len}, and increment i to ${i + 1}.`,
          `SET len = ${len}, lps[${i}] = ${len}, i = i + 1`,
          14, 13, 15, 16,
          { i, len, lps: `[${lps.join(',')}]` },
          'lps', -1, -1, lps, i, len
        );
        i++;
      } else if (len !== 0) {
        const prev = len;
        len = lps[len - 1];
        push(
          `Mismatch and len > 0. Fallback len = lps[len-1] = lps[${prev - 1}] = ${len}.`,
          `SET len = lps[${prev - 1}] = ${len}`,
          19, 18, 20, 22,
          { i, oldLen: prev, newLen: len },
          'lps', -1, -1, lps, i, len
        );
      } else {
        lps[i] = 0;
        push(
          `Mismatch and len == 0. Set lps[${i}] = 0 and increment i to ${i + 1}.`,
          `SET lps[${i}] = 0, i = i + 1`,
          22, 21, 23, 26,
          { i, len, lps: `[${lps.join(',')}]` },
          'lps', -1, -1, lps, i, len
        );
        i++;
      }
    }

    push(
      'LPS table construction complete.',
      'LPS COMPLETED',
      10, 9, 11, 12,
      { lps: `[${lps.join(',')}]` },
      'lps', -1, -1, lps
    );

    let j = 0;
    i = 0;
    push(
      'Initialize pointers j = 0 for pattern and i = 0 for text.',
      'SET j = 0, i = 0',
      27, 23, 28, 31,
      { i, j },
      'search', i, j, lps
    );

    while (i < n) {
      push(
        `Search loop: compare text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'.`,
        `WHILE i (${i}) < n (${n}) : IF text[i] == pattern[j]`,
        29, 25, 30, 33,
        { i, j, 'text[i]': text[i], 'pattern[j]': pattern[j] },
        'search', i, j, lps
      );

      if (text[i] === pattern[j]) {
        i++;
        j++;
        push(
          `Characters match! Advance pointers: i to ${i}, j to ${j}.`,
          `SET i = i + 1, j = j + 1`,
          30, 26, 31, 34,
          { i, j },
          'match', i, j, lps
        );
      }

      if (j === m) {
        currentResult = [...currentResult, i - j];
        push(
          `Full pattern match found at index ${i - j}! Save index and reset j = lps[j - 1] = ${lps[j - 1]}.`,
          `ADD ${i - j} TO result; SET j = lps[${j - 1}] = ${lps[j - 1]}`,
          34, 29, 35, 38,
          { matchIdx: i - j, result: `[${currentResult.join(',')}]`, newJ: lps[j - 1] },
          'match', i, j, lps
        );
        j = lps[j - 1];
      } else if (i < n && text[i] !== pattern[j]) {
        push(
          `Mismatch: text[${i}]='${text[i]}' != pattern[${j}]='${pattern[j]}'.`,
          `IF text[i] != pattern[j]`,
          37, 32, 39, 42,
          { i, j, 'text[i]': text[i], 'pattern[j]': pattern[j] },
          'mismatch', i, j, lps
        );

        if (j !== 0) {
          const oldJ = j;
          j = lps[j - 1];
          push(
            `j > 0. Shift pattern based on LPS: reset j = lps[j - 1] = ${j}.`,
            `SET j = lps[${oldJ - 1}] = ${j}`,
            38, 33, 40, 44,
            { oldJ, newJ: j },
            'mismatch', i, j, lps
          );
        } else {
          i++;
          push(
            `j == 0. Advance text pointer i to ${i}.`,
            `SET i = i + 1`,
            40, 35, 42, 46,
            { i, j },
            'mismatch', i, j, lps
          );
        }
      }
    }

    push(
      `Search finished. Return all matching starting indices: [${currentResult.join(', ')}].`,
      'RETURN result',
      45, 37, 46, 49,
      { result: `[${currentResult.join(',')}]` },
      'done', i, j, lps
    );

    return { steps: s, stepLineNumbers };
  }, [textInput, patternInput]);

  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const phaseColor = {
    init: 'rgba(var(--primary), 0.1)',
    lps: 'rgba(168, 85, 247, 0.15)',
    search: 'rgba(59, 130, 246, 0.15)',
    match: 'rgba(34, 197, 94, 0.15)',
    mismatch: 'rgba(239, 68, 68, 0.15)',
    done: 'rgba(34, 197, 94, 0.15)',
  }[currentStep.phase];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-5">
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-xs font-semibold mb-6 text-muted-foreground uppercase tracking-widest">
              KMP String Search (Rabin-Karp slug)
            </h3>

            <div className="space-y-10">
              {/* Text Row */}
              <div>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest">Text</h4>
                <div className="flex flex-wrap gap-x-1 gap-y-6 justify-center pb-4">
                  {currentStep.text.split('').map((char, idx) => {
                    const isI = idx === currentStep.i && (currentStep.phase === 'search' || currentStep.phase === 'match' || currentStep.phase === 'mismatch');
                    const isMatched = currentStep.result.some((start) => idx >= start && idx < start + currentStep.pattern.length);
                    const isCurrent = currentStep.phase === 'search' || currentStep.phase === 'match' || currentStep.phase === 'mismatch'
                      ? idx >= currentStep.i - currentStep.j && idx < currentStep.i - currentStep.j + currentStep.pattern.length && currentStep.j > 0
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
                  {currentStep.pattern.split('').map((char, idx) => {
                    const isJ = idx === currentStep.j && (currentStep.phase === 'search' || currentStep.phase === 'match' || currentStep.phase === 'mismatch');
                    const isLpsI = currentStep.phase === 'lps' && idx === currentStep.lps_i;
                    const isLpsLen = currentStep.phase === 'lps' && idx === currentStep.lps_len;

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
                  {currentStep.pattern.split('').map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] text-muted-foreground font-mono">[{idx}]</span>
                      <motion.div
                        animate={{
                          backgroundColor:
                            currentStep.phase === 'lps' && idx === currentStep.lps_i
                              ? 'rgba(168, 85, 247, 0.2)'
                              : 'transparent',
                          borderColor:
                            currentStep.phase === 'lps' && idx === currentStep.lps_i
                              ? 'rgb(168, 85, 247)'
                              : 'var(--border)',
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 bg-muted/20 font-bold text-sm"
                      >
                        {currentStep.lps[idx] ?? 0}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Array */}
              {currentStep.result.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-green-500 uppercase mb-3 tracking-widest">
                    Matches Found
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentStep.result.map((idx, k) => (
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
            <p className="text-sm font-medium leading-relaxed ml-2">{currentStep.explanation}</p>
          </motion.div>

          <VariablePanel variables={currentStep.variables} />
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
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
