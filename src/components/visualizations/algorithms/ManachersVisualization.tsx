import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  processed: string;
  radius: number[];
  i: number;
  center: number;
  right: number;
  mirror: number;
  maxLen: number;
  explanation: string;
  highlightedLines: number[];
  variables: Record<string, any>;
  phase: 'init' | 'preprocess' | 'mirror' | 'expand' | 'update_boundary' | 'update_max' | 'done';
}

export const ManachersVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const inputStr = 'abaabad';

  const steps: Step[] = useMemo(() => {
    const s = inputStr;
    const s_steps: Step[] = [];

    s_steps.push({
      processed: '', radius: [], i: -1, center: 0, right: 0, mirror: -1, maxLen: 0,
      explanation: 'Start longestPalindromeManachers. Check if input is empty.',
      highlightedLines: [1, 2],
      variables: { s, 'length': s.length },
      phase: 'init'
    });

    const processed = '#' + s.split('').join('#') + '#';
    const n = processed.length;
    const radius = new Array(n).fill(0);
    let center = 0;
    let right = 0;
    let maxLen = 0;

    s_steps.push({
      processed, radius: [...radius], i: -1, center, right, mirror: -1, maxLen,
      explanation: `Preprocess: insert '#' between chars. processed = "${processed}"`,
      highlightedLines: [4, 5],
      variables: { processed, n },
      phase: 'preprocess'
    });

    s_steps.push({
      processed, radius: [...radius], i: -1, center, right, mirror: -1, maxLen,
      explanation: 'Initialize radius array, center = 0, right = 0, maxLen = 0.',
      highlightedLines: [7, 9, 10, 11],
      variables: { center, right, maxLen },
      phase: 'preprocess'
    });

    for (let i = 0; i < n; i++) {
      const mirror = 2 * center - i;

      s_steps.push({
        processed, radius: [...radius], i, center, right, mirror, maxLen,
        explanation: `Iteration i=${i} (char="${processed[i]}"): compute mirror = 2*${center}-${i} = ${mirror}.`,
        highlightedLines: [13, 14],
        variables: { i, 'processed[i]': processed[i], center, mirror },
        phase: 'mirror'
      });

      if (i < right) {
        radius[i] = Math.min(right - i, radius[mirror] ?? 0);
        s_steps.push({
          processed, radius: [...radius], i, center, right, mirror, maxLen,
          explanation: `i=${i} < right=${right}: use symmetry. radius[${i}] = min(${right - i}, ${radius[mirror] ?? 0}) = ${radius[i]}.`,
          highlightedLines: [16, 17],
          variables: { 'right-i': right - i, 'radius[mirror]': radius[mirror] ?? 0, 'radius[i]': radius[i] },
          phase: 'mirror'
        });
      }

      s_steps.push({
        processed, radius: [...radius], i, center, right, mirror, maxLen,
        explanation: `Try expanding palindrome at i=${i} with current radius ${radius[i]}.`,
        highlightedLines: [20, 21, 22, 23],
        variables: { i, 'radius[i]': radius[i] },
        phase: 'expand'
      });

      while (
        i - radius[i] - 1 >= 0 &&
        i + radius[i] + 1 < n &&
        processed[i - radius[i] - 1] === processed[i + radius[i] + 1]
      ) {
        radius[i]++;
        s_steps.push({
          processed, radius: [...radius], i, center, right, mirror, maxLen,
          explanation: `Match: processed[${i - radius[i]}]="${processed[i - radius[i]]}" == processed[${i + radius[i]}]="${processed[i + radius[i]]}". Expand radius to ${radius[i]}.`,
          highlightedLines: [25],
          variables: { i, 'radius[i]': radius[i], left: i - radius[i], rightEdge: i + radius[i] },
          phase: 'expand'
        });
      }

      if (i + radius[i] > right) {
        center = i;
        right = i + radius[i];
        s_steps.push({
          processed, radius: [...radius], i, center, right, mirror, maxLen,
          explanation: `i + radius[i] = ${i + radius[i]} > right. Update center=${center}, right=${right}.`,
          highlightedLines: [28, 29, 30],
          variables: { center, right },
          phase: 'update_boundary'
        });
      }

      maxLen = Math.max(maxLen, radius[i]);
      s_steps.push({
        processed, radius: [...radius], i, center, right, mirror, maxLen,
        explanation: `Update maxLen = max(${maxLen}, ${radius[i]}) = ${maxLen}.`,
        highlightedLines: [33],
        variables: { maxLen, 'radius[i]': radius[i] },
        phase: 'update_max'
      });
    }

    s_steps.push({
      processed, radius: [...radius], i: -1, center, right, mirror: -1, maxLen,
      explanation: `Done! Longest palindrome length = maxLen = ${maxLen}.`,
      highlightedLines: [36],
      variables: { maxLen, result: maxLen },
      phase: 'done'
    });

    return s_steps;
  }, [inputStr]);

  const code = `function longestPalindromeManachers(s: string): number {
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
}`;

  const step = steps[currentStep] || steps[0];

  const getCharColor = (idx: number) => {
    if (step.i === -1) return 'none';
    const lo = step.i - (step.radius[step.i] || 0);
    const hi = step.i + (step.radius[step.i] || 0);
    if (idx === step.i) return 'current';
    if (idx === step.mirror && step.mirror >= 0) return 'mirror';
    if (idx >= lo && idx <= hi) return 'inPalin';
    return 'none';
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20 relative">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-widest">Manacher's Algorithm</h3>

            <div className="space-y-10">
              <div>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-tighter">Processed String</h4>
                <div className="flex flex-wrap gap-x-[3px] gap-y-7 justify-center pb-6">
                  {step.processed.split('').map((char, idx) => {
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
                        {idx === step.i && step.i !== -1 && (
                          <div className="absolute -bottom-5">
                            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#84cc16' }}>i</span>
                          </div>
                        )}
                        {idx === step.mirror && step.mirror >= 0 && step.mirror !== step.i && (
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
                  {step.processed.split('').map((_, idx) => {
                    const val = step.radius[idx] ?? 0;
                    const isActive = idx === step.i;
                    const isMax = val === step.maxLen && val > 0;
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
                  { label: 'center', value: step.center, color: '#84cc16' },
                  { label: 'right', value: step.right, color: '#60a5fa' },
                  { label: 'maxLen', value: step.maxLen, color: '#a78bfa' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-3 rounded-lg border-2" style={{ borderColor: color + '33', background: color + '10' }}>
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: '#888' }}>{label}</div>
                    <div className="text-xl font-black" style={{ color }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Algorithm Step</h4>
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
