import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
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
  matchStatus?: 'match' | 'mismatch' | 'none';
  matchedRange?: [number, number];
}

const languages: VisualizationLanguageMap = {
  typescript: `function solution(text: string, pattern: string): number {
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
}`,
  python: `def solution(text, pattern):
    if pattern == "":
        return 0
    if text == "":
        return -1
    def build_lps(p):
        lps = [0] * len(p)
        length = 0
        i = 1
        while i < len(p):
            if p[i] == p[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                if length != 0:
                    length = lps[length - 1]
                else:
                    lps[i] = 0
                    i += 1
        return lps
    lps = build_lps(pattern)
    i = 0
    j = 0
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
        if j == len(pattern):
            return i - j
        elif i < len(text) and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return -1`,
  java: `public static class Solution {
    public int solution(String text, String pattern) {
        if (pattern.length() == 0)
            return 0;
        if (text.length() == 0)
            return -1;
        int[] lps = buildLPS(pattern);
        int i = 0, j = 0;
        while (i < text.length()) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;
            }
            if (j == pattern.length())
                return i - j;
            else if (i < text.length() && text.charAt(i) != pattern.charAt(j)) {
                if (j != 0)
                    j = lps[j - 1];
                else
                    i++;
            }
        }
        return -1;
    }
    int[] buildLPS(String pattern) {
        int[] lps = new int[pattern.length()];
        int len = 0;
        for (int i = 1; i < pattern.length();) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                lps[i++] = ++len;
            }
            else if (len != 0)
                len = lps[len - 1];
            else
                lps[i++] = 0;
        }
        return lps;
    }
}`,
  cpp: `class Solution {
public:
vector<int> buildLPS(string pattern) {
    int m = pattern.size();
    vector<int> lps(m, 0);
    int len = 0;
    for (int i = 1; i < m;) {
        if (pattern[i] == pattern[len]) {
            lps[i++] = ++len;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }
    }
    return lps;
}
int solution(string text, string pattern) {
    if (pattern.empty())
        return 0;
    if (text.empty())
        return -1;
    vector<int> lps = buildLPS(pattern);
    int i = 0, j = 0;
    while (i < text.size()) {
        if (text[i] == pattern[j]) {
            i++;
            j++;
        }
        if (j == pattern.size())
            return i - j;
        else if (i < text.size() && text[i] != pattern[j]) {
            if (j != 0)
                j = lps[j - 1];
            else
                i++;
        }
    }
    return -1;
}
};`
};

export const KMPVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const textInput = "ababcabcabababd";
  const patternInput = "ababd";

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const text = textInput;
    const pattern = patternInput;

    const lines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    s.push({
      text, pattern, lps: [], i: -1, j: -1,
      explanation: "Initialize KMP search function.",
      pseudoStep: `CALL solution(text = "${text}", pattern = "${pattern}")`,
      variables: { text, pattern },
      phase: 'init'
    });
    addLines(1, 1, 2, 20);

    s.push({
      text, pattern, lps: [], i: -1, j: -1,
      explanation: "Check if pattern is empty. If so, it's found at index 0.",
      pseudoStep: `IF pattern.length == 0 (len = ${pattern.length})`,
      variables: { patternLength: pattern.length },
      phase: 'init'
    });
    addLines(2, 2, 3, 21);
    if (pattern.length === 0) return { steps: s, stepLineNumbers: lines };

    s.push({
      text, pattern, lps: [], i: -1, j: -1,
      explanation: "Check if text is empty. If pattern is not empty, it cannot be found.",
      pseudoStep: `IF text.length == 0 (len = ${text.length})`,
      variables: { textLength: text.length },
      phase: 'init'
    });
    addLines(3, 4, 5, 23);
    if (text.length === 0) return { steps: s, stepLineNumbers: lines };

    const lps = new Array(pattern.length).fill(0);
    let len = 0;

    s.push({
      text, pattern, lps: [...lps], i: -1, j: -1,
      explanation: "Call buildLPS to construct the LPS array.",
      pseudoStep: "SET lps = CALL buildLPS(pattern)",
      variables: { pattern },
      phase: 'lps'
    });
    addLines(20, 22, 7, 25);

    s.push({
      text, pattern, lps: [...lps], i: -1, j: -1,
      explanation: "Initialize LPS array with zeros.",
      pseudoStep: `SET lps = [0, ..., 0] (size = ${pattern.length})`,
      variables: { lps: `[${lps.join(',')}]` },
      phase: 'lps'
    });
    addLines(5, 7, 26, 5);

    s.push({
      text, pattern, lps: [...lps], i: -1, j: -1,
      explanation: "Initialize len to 0.",
      pseudoStep: "SET len = 0",
      variables: { len },
      phase: 'lps'
    });
    addLines(6, 8, 27, 6);

    for (let l_i = 1; l_i < pattern.length;) {
      s.push({
        text, pattern, lps: [...lps], i: -1, j: -1,
        explanation: `Comparing pattern[${l_i}] ('${pattern[l_i]}') with pattern[${len}] ('${pattern[len]}').`,
        pseudoStep: `IF pattern[${l_i}] == pattern[${len}] ('${pattern[l_i]}' == '${pattern[len]}') → ${pattern[l_i] === pattern[len] ? 'YES ✓' : 'NO ✗'}`,
        variables: { i: l_i, len, "pattern[i]": pattern[l_i], "pattern[len]": pattern[len] },
        phase: 'lps',
        lps_i: l_i,
        lps_len: len,
        matchStatus: pattern[l_i] === pattern[len] ? 'match' : 'mismatch'
      });
      addLines(8, 11, 29, 8);

      if (pattern[l_i] === pattern[len]) {
        len++;
        lps[l_i] = len;
        s.push({
          text, pattern, lps: [...lps], i: -1, j: -1,
          explanation: `Characters match! Increment len to ${len} and set lps[${l_i}] = ${len}.`,
          pseudoStep: `SET lps[${l_i}] = ${len}`,
          variables: { i: l_i, len, lps: `[${lps.join(',')}]` },
          phase: 'lps',
          lps_i: l_i,
          lps_len: len,
          matchStatus: 'match'
        });
        addLines(9, 12, 30, 9);
        l_i++;
      } else if (len !== 0) {
        const oldLen = len;
        len = lps[len - 1];
        s.push({
          text, pattern, lps: [...lps], i: -1, j: -1,
          explanation: `Mismatch and len != 0. Fallback: update len to lps[${oldLen - 1}] = ${len}.`,
          pseudoStep: `SET len = lps[len - 1] (len = ${len})`,
          variables: { i: l_i, oldLen, newLen: len },
          phase: 'lps',
          lps_i: l_i,
          lps_len: len,
          matchStatus: 'mismatch'
        });
        addLines(12, 17, 33, 12);
      } else {
        lps[l_i] = 0;
        s.push({
          text, pattern, lps: [...lps], i: -1, j: -1,
          explanation: `Mismatch and len == 0. Set lps[${l_i}] = 0 and move to next index.`,
          pseudoStep: `SET lps[${l_i}] = 0`,
          variables: { i: l_i, len, lps: `[${lps.join(',')}]` },
          phase: 'lps',
          lps_i: l_i,
          lps_len: len,
          matchStatus: 'mismatch'
        });
        addLines(15, 19, 35, 14);
        l_i++;
      }
    }

    s.push({
      text, pattern, lps: [...lps], i: -1, j: -1,
      explanation: "LPS array construction complete. Return lps array.",
      pseudoStep: "RETURN lps",
      variables: { lps: `[${lps.join(',')}]` },
      phase: 'lps'
    });
    addLines(18, 21, 37, 18);

    let i = 0;
    let j = 0;

    s.push({
      text, pattern, lps: [...lps], i, j,
      explanation: "Initialize text pointer i = 0 and pattern pointer j = 0.",
      pseudoStep: "SET i = 0, j = 0",
      variables: { i, j },
      phase: 'search'
    });
    addLines(21, 23, 8, 26);

    while (i < text.length) {
      s.push({
        text, pattern, lps: [...lps], i, j,
        explanation: `Comparing text[${i}] ('${text[i]}') with pattern[${j}] ('${pattern[j]}').`,
        pseudoStep: `IF text[${i}] == pattern[${j}] ('${text[i]}' == '${pattern[j]}') → ${text[i] === pattern[j] ? 'YES ✓' : 'NO ✗'}`,
        variables: { i, j, "text[i]": text[i], "pattern[j]": pattern[j] },
        phase: 'search',
        matchStatus: text[i] === pattern[j] ? 'match' : 'mismatch'
      });
      addLines(24, 26, 10, 28);

      if (text[i] === pattern[j]) {
        i++;
        j++;
        s.push({
          text, pattern, lps: [...lps], i, j,
          explanation: `Characters match! Increment i to ${i} and j to ${j}.`,
          pseudoStep: "SET i = i + 1, j = j + 1",
          variables: { i, j },
          phase: 'match',
          matchStatus: 'match'
        });
        addLines(25, 27, 11, 29);
      }

      if (j === pattern.length) {
        s.push({
          text, pattern, lps: [...lps], i, j,
          explanation: `Pattern matched completely! Return start index i - j = ${i - j}.`,
          pseudoStep: `RETURN i - j (${i - j})`,
          variables: { startIdx: i - j },
          phase: 'done',
          matchedRange: [i - j, i - 1]
        });
        addLines(29, 30, 15, 33);
        return { steps: s, stepLineNumbers: lines };
      } else if (i < text.length && text[i] !== pattern[j]) {
        s.push({
          text, pattern, lps: [...lps], i, j,
          explanation: `Mismatch at text[${i}] and pattern[${j}].`,
          pseudoStep: `IF text[${i}] != pattern[${j}] → YES ✓`,
          variables: { i, j, "text[i]": text[i], "pattern[j]": pattern[j] },
          phase: 'mismatch',
          matchStatus: 'mismatch'
        });
        addLines(30, 31, 16, 34);

        if (j !== 0) {
          const oldJ = j;
          j = lps[j - 1];
          s.push({
            text, pattern, lps: [...lps], i, j,
            explanation: `j != 0. Shift pattern based on LPS value: new j = lps[${oldJ - 1}] = ${j}.`,
            pseudoStep: `SET j = lps[j - 1] (j = ${j})`,
            variables: { oldJ, newJ: j },
            phase: 'mismatch',
            matchStatus: 'none'
          });
          addLines(32, 33, 18, 36);
        } else {
          i++;
          s.push({
            text, pattern, lps: [...lps], i, j,
            explanation: `j == 0. Shift pattern is not possible. Incrementing i to ${i}.`,
            pseudoStep: "SET i = i + 1",
            variables: { i, j },
            phase: 'mismatch',
            matchStatus: 'none'
          });
          addLines(34, 34, 20, 38);
        }
      }
    }

    s.push({
      text, pattern, lps: [...lps], i, j,
      explanation: "Search complete. Pattern not found in text.",
      pseudoStep: "RETURN -1",
      variables: {},
      phase: 'done'
    });
    addLines(37, 36, 23, 41);

    return { steps: s, stepLineNumbers: lines };
  }, [textInput, patternInput]);

  const step = steps[currentStepIndex] || steps[steps.length - 1];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden">
              <h3 className="text-xs font-bold mb-8 text-muted-foreground uppercase tracking-widest">KMP Search</h3>

              <div className="space-y-12">
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest opacity-60 text-center">Text Array</h4>
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
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest opacity-60 text-center">Pattern Matching</h4>
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
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest opacity-60 text-center">LPS (Longest Prefix Suffix) Array</h4>
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
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Explanation</h4>
              <p className="text-sm font-medium leading-relaxed min-h-[40px]">{step.explanation}</p>
            </Card>

            <VariablePanel variables={step.variables} />
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
