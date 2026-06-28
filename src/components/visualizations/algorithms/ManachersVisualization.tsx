import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  processed: string;
  radius: number[];
  i: number;
  center: number;
  right: number;
  mirror: number;
  maxLen: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  phase: 'init' | 'preprocess' | 'mirror' | 'expand' | 'update_boundary' | 'update_max' | 'done';
}

const languages: VisualizationLanguageMap = {
  typescript: `function longestPalindromeManachers(s: string): number {
    if (s.length === 0) return 0;
    const processed = "#" + s.split("").join("#") + "#";
    const n = processed.length;
    const radius = new Array(n).fill(0);
    let center = 0;
    let right = 0;
    let maxLen = 0;
    for (let i = 0; i < n; i++) {
        const mirror = 2 * center - i;
        if (i < right) {
            radius[i] = Math.min(right - i, radius[mirror]);
        }
        while (
            i - radius[i] - 1 >= 0 &&
            i + radius[i] + 1 < n &&
            processed[i - radius[i] - 1] === processed[i + radius[i] + 1]
        ) {
            radius[i]++;
        }
        if (i + radius[i] > right) {
            center = i;
            right = i + radius[i];
        }
        maxLen = Math.max(maxLen, radius[i]);
    }
    return maxLen;
}`,

  python: `def longestPalindromeManachers(s: str) -> int:
    if len(s) == 0:
        return 0
    processed = "#" + "#".join(s) + "#"
    n = len(processed)
    radius = [0] * n
    center = 0
    right = 0
    max_len = 0
    for i in range(n):
        mirror = 2 * center - i
        if i < right:
            radius[i] = min(right - i, radius[mirror])
        while (
            i - radius[i] - 1 >= 0 and
            i + radius[i] + 1 < n and
            processed[i - radius[i] - 1] == processed[i + radius[i] + 1]
        ):
            radius[i] += 1
        if i + radius[i] > right:
            center = i
            right = i + radius[i]
        max_len = max(max_len, radius[i])
    return max_len`,

  java: `public static class Solution {
    public int longestPalindromeManachers(String s) {
        if (s.length() == 0) return 0;
        StringBuilder processed = new StringBuilder("#");
        for (char c : s.toCharArray()) {
            processed.append(c).append("#");
        }
        int n = processed.length();
        int[] radius = new int[n];
        int center = 0;
        int right = 0;
        int maxLen = 0;
        for (int i = 0; i < n; i++) {
            int mirror = 2 * center - i;
            if (i < right) {
                radius[i] = Math.min(right - i, radius[mirror]);
            }
            while (
                i - radius[i] - 1 >= 0 &&
                i + radius[i] + 1 < n &&
                processed.charAt(i - radius[i] - 1) == processed.charAt(i + radius[i] + 1)
            ) {
                radius[i]++;
            }
            if (i + radius[i] > right) {
                center = i;
                right = i + radius[i];
            }
            maxLen = Math.max(maxLen, radius[i]);
        }
        return maxLen;
    }
}`,

  cpp: `class Solution {
public:
    int longestPalindromeManachers(string s) {
        if (s.length() == 0) return 0;
        string processed = "#";
        for (char c : s) {
            processed += c;
            processed += "#";
        }
        int n = processed.size();
        vector<int> radius(n, 0);
        int center = 0;
        int right = 0;
        int maxLen = 0;
        for (int i = 0; i < n; i++) {
            int mirror = 2 * center - i;
            if (i < right) {
                radius[i] = min(right - i, radius[mirror]);
            }
            while (
                i - radius[i] - 1 >= 0 &&
                i + radius[i] + 1 < n &&
                processed[i - radius[i] - 1] == processed[i + radius[i] + 1]
            ) {
                radius[i]++;
            }
            if (i + radius[i] > right) {
                center = i;
                right = i + radius[i];
            }
            maxLen = max(maxLen, radius[i]);
        }
        return maxLen;
    }
};`,
};

export const ManachersVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const inputStr = 'abaabad';

  const { steps, stepLineNumbers } = useMemo(() => {
    const s = inputStr;
    const s_steps: Step[] = [];

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

    s_steps.push({
      processed: '', radius: [], i: -1, center: 0, right: 0, mirror: -1, maxLen: 0,
      explanation: 'Start longestPalindromeManachers. Check if input string is empty.',
      pseudoStep: 'IF len(s) == 0  →  NO ✗',
      variables: { s, 'length': s.length },
      phase: 'init'
    });
    addLines(2, 2, 3, 3);

    const processed = '#' + s.split('').join('#') + '#';
    const n = processed.length;
    const radius = new Array(n).fill(0);
    let center = 0;
    let right = 0;
    let maxLen = 0;

    s_steps.push({
      processed, radius: [...radius], i: -1, center, right, mirror: -1, maxLen,
      explanation: `Preprocess string to handle even/odd lengths by inserting '#'. processed = "${processed}"`,
      pseudoStep: `SET processed = "#" + join(s, "#") + "#"`,
      variables: { processed, n },
      phase: 'preprocess'
    });
    addLines(3, 4, 4, 4);

    s_steps.push({
      processed, radius: [...radius], i: -1, center, right, mirror: -1, maxLen,
      explanation: 'Initialize radius array, and pointers: center = 0, right = 0, maxLen = 0.',
      pseudoStep: 'SET radius = [0...n], center = 0, right = 0, maxLen = 0',
      variables: { center, right, maxLen },
      phase: 'preprocess'
    });
    addLines(6, 7, 9, 9);

    for (let i = 0; i < n; i++) {
      const mirror = 2 * center - i;

      s_steps.push({
        processed, radius: [...radius], i, center, right, mirror, maxLen,
        explanation: `Iteration i=${i} (char="${processed[i]}"): calculate mirror position across current center: mirror = 2 * center - i = 2 * ${center} - ${i} = ${mirror}.`,
        pseudoStep: `FOR i = ${i} : SET mirror = 2 * center - i  →  ${mirror}`,
        variables: { i, 'processed[i]': processed[i], center, mirror },
        phase: 'mirror'
      });
      addLines(10, 11, 13, 13);

      if (i < right) {
        radius[i] = Math.min(right - i, radius[mirror] ?? 0);
        s_steps.push({
          processed, radius: [...radius], i, center, right, mirror, maxLen,
          explanation: `Since i (${i}) < right (${right}), initialize radius[${i}] using symmetry: min(right - i, radius[mirror]) = min(${right - i}, ${radius[mirror] ?? 0}) = ${radius[i]}.`,
          pseudoStep: `IF i < right: radius[i] = MIN(right - i, radius[mirror])  →  ${radius[i]}`,
          variables: { 'right-i': right - i, 'radius[mirror]': radius[mirror] ?? 0, 'radius[i]': radius[i] },
          phase: 'mirror'
        });
        addLines(12, 13, 15, 15);
      }

      s_steps.push({
        processed, radius: [...radius], i, center, right, mirror, maxLen,
        explanation: `Attempt to expand the palindrome centered at i=${i} with starting radius ${radius[i]}.`,
        pseudoStep: `WHILE characters at bounds match`,
        variables: { i, 'radius[i]': radius[i] },
        phase: 'expand'
      });
      addLines(14, 14, 17, 17);

      while (
        i - radius[i] - 1 >= 0 &&
        i + radius[i] + 1 < n &&
        processed[i - radius[i] - 1] === processed[i + radius[i] + 1]
      ) {
        radius[i]++;
        s_steps.push({
          processed, radius: [...radius], i, center, right, mirror, maxLen,
          explanation: `Characters match: processed[${i - radius[i]}]="${processed[i - radius[i]]}" == processed[${i + radius[i]}]="${processed[i + radius[i]]}". Increment radius to ${radius[i]}.`,
          pseudoStep: `SET radius[${i}] = ${radius[i]}`,
          variables: { i, 'radius[i]': radius[i], left: i - radius[i], rightEdge: i + radius[i] },
          phase: 'expand'
        });
        addLines(19, 19, 20, 20);
      }

      if (i + radius[i] > right) {
        center = i;
        right = i + radius[i];
        s_steps.push({
          processed, radius: [...radius], i, center, right, mirror, maxLen,
          explanation: `Palindrome centered at ${i} extends past current right boundary (${i + radius[i]} > ${right - radius[i]}). Update center = ${center}, right = ${right}.`,
          pseudoStep: `IF i + radius[i] > right: SET center = ${center}, right = ${right}`,
          variables: { center, right },
          phase: 'update_boundary'
        });
        addLines(22, 21, 23, 22);
      }

      maxLen = Math.max(maxLen, radius[i]);
      s_steps.push({
        processed, radius: [...radius], i, center, right, mirror, maxLen,
        explanation: `Update maximum palindrome radius found so far: maxLen = max(${maxLen}, ${radius[i]}) = ${maxLen}.`,
        pseudoStep: `SET maxLen = MAX(maxLen, radius[i])  →  ${maxLen}`,
        variables: { maxLen, 'radius[i]': radius[i] },
        phase: 'update_max'
      });
      addLines(25, 23, 26, 25);
    }

    s_steps.push({
      processed, radius: [...radius], i: -1, center, right, mirror: -1, maxLen,
      explanation: `Completed processing all elements. Return the maximum palindrome radius found: ${maxLen}.`,
      pseudoStep: `RETURN maxLen  →  ${maxLen}`,
      variables: { maxLen, result: maxLen },
      phase: 'done'
    });
    addLines(27, 24, 28, 27);

    return { steps: s_steps, stepLineNumbers };
  }, [inputStr]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const getCharColor = (idx: number) => {
    if (currentStep.i === -1) return 'none';
    const lo = currentStep.i - (currentStep.radius[currentStep.i] || 0);
    const hi = currentStep.i + (currentStep.radius[currentStep.i] || 0);
    if (idx === currentStep.i) return 'current';
    if (idx === currentStep.mirror && currentStep.mirror >= 0) return 'mirror';
    if (idx >= lo && idx <= hi) return 'inPalin';
    return 'none';
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20 relative">
              <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-widest font-sans">
                Manacher's Algorithm (Longest Palindrome)
              </h3>

              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-tighter">Processed String</h4>
                  <div className="flex flex-wrap gap-x-[3px] gap-y-7 justify-center pb-6">
                    {currentStep.processed.split('').map((char, idx) => {
                      const color = getCharColor(idx);
                      return (
                        <div key={idx} className="relative flex flex-col items-center">
                          <span style={{ fontSize: '9px', color: '#666', fontFamily: 'monospace', marginBottom: '4px' }}>{idx}</span>
                          <motion.div
                            animate={{
                              backgroundColor:
                                color === 'current' ? '#84cc16' :
                                  color === 'mirror' ? 'rgba(251,191,36,0.25)' :
                                    color === 'inPalin' ? 'rgba(132,204,22,0.12)' :
                                      'transparent',
                              borderColor:
                                color === 'current' ? '#84cc16' :
                                  color === 'mirror' ? '#fbbf24' :
                                    color === 'inPalin' ? 'rgba(132,204,22,0.5)' :
                                      'var(--border)',
                              scale: color === 'current' ? 1.1 : 1,
                            }}
                            className="w-8 h-8 border-2 rounded-md flex items-center justify-center text-xs font-bold"
                            style={{ color: color === 'current' ? '#000' : undefined }}
                          >
                            {char}
                          </motion.div>
                          {idx === currentStep.i && currentStep.i !== -1 && (
                            <div className="absolute -bottom-5">
                              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#84cc16' }}>i</span>
                            </div>
                          )}
                          {idx === currentStep.mirror && currentStep.mirror >= 0 && currentStep.mirror !== currentStep.i && (
                            <div className="absolute -bottom-5">
                              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#fbbf24' }}>m</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-tighter">Radius Array</h4>
                  <div className="flex flex-wrap gap-[3px] gap-y-3 justify-center">
                    {currentStep.processed.split('').map((_, idx) => {
                      const val = currentStep.radius[idx] ?? 0;
                      const isActive = idx === currentStep.i;
                      const isMax = val === currentStep.maxLen && val > 0;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <motion.div
                            animate={{
                              backgroundColor: isActive ? 'rgba(132,204,22,0.25)' : isMax ? 'rgba(132,204,22,0.12)' : 'transparent',
                              borderColor: isActive ? '#84cc16' : isMax ? 'rgba(132,204,22,0.5)' : 'var(--border)',
                              scale: isActive ? 1.1 : 1,
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-md border-2 text-xs font-bold"
                          >
                            {val}
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'center', value: currentStep.center, color: '#84cc16' },
                    { label: 'right', value: currentStep.right, color: '#60a5fa' },
                    { label: 'maxLen', value: currentStep.maxLen, color: '#a78bfa' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-3 rounded-lg border-2" style={{ borderColor: color + '33', background: color + '10' }}>
                      <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: '#888' }}>{label}</div>
                      <div className="text-xl font-black" style={{ color }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Algorithm Step</h4>
              <p className="text-sm font-medium leading-relaxed">{currentStep.explanation}</p>
            </Card>
            <VariablePanel variables={currentStep.variables} />
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
