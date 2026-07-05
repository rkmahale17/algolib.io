import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, XCircle, Check, Play, Pause, AlertTriangle } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  tripletsState: {
    triplets: number[][];
    target: number[];
    good: number[];
    currentIndex: number | null;
    currentItemState: 'evaluating' | 'exceeds' | 'accepted' | 'checking-components' | null;
    elementChecks: ('checking' | 'pass' | 'fail' | 'match' | null)[];
    goodAddedThisStep: number | null;
  };
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

interface TestCase {
  id: string;
  name: string;
  triplets: number[][];
  target: number[];
  expected: boolean;
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Valid Combination', triplets: [[2, 5, 3], [1, 8, 4], [1, 7, 5]], target: [2, 7, 5], expected: true },
  { id: 'ex2', name: 'Exceeding Elements', triplets: [[3, 4, 5], [4, 5, 6]], target: [3, 2, 5], expected: false },
  { id: 'ex3', name: 'Missing Components', triplets: [[2, 5, 3], [2, 3, 4]], target: [2, 5, 5], expected: false },
  { id: 'ex4', name: 'Large Set Valid', triplets: [[2, 5, 3], [1, 8, 4], [1, 7, 5], [2, 2, 2]], target: [2, 7, 5], expected: true }
];

const languages: VisualizationLanguageMap = {
  typescript: `function mergeTriplets(triplets: number[][], target: number[]): boolean {
  const good = new Set<number>();
  for (const t of triplets) {
    if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) {
      continue;
    }
    t.forEach((v, i) => {
      if (v === target[i]) {
        good.add(i);
      }
    });
  }
  return good.size === 3;
}`,
  python: `def mergeTriplets(triplets: list[list[int]], target: list[int]) -> bool:
    good_indices = set()
    for t in triplets:
        if t[0] > target[0] or t[1] > target[1] or t[2] > target[2]:
            continue
        for i in range(3):
            if t[i] == target[i]:
                good_indices.add(i)
        if len(good_indices) == 3:
            return True
    return len(good_indices) == 3`,
  java: `public static class Solution {
    public boolean mergeTriplets(int[][] triplets, int[] target) {
        Set<Integer> good = new HashSet<>();
        for (int[] t : triplets) {
            if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) {
                continue;
            }
            if (t[0] == target[0]) {
                good.add(0);
            }
            if (t[1] == target[1]) {
                good.add(1);
            }
            if (t[2] == target[2]) {
                good.add(2);
            }
            if (good.size() == 3) {
                return true;
            }
        }
        return good.size() == 3;
    }
}`,
  cpp: `class Solution {
public:
    bool mergeTriplets(vector<vector<int>>& triplets, vector<int>& target) {
        vector<bool> good(3, false);
        for (const vector<int>& t : triplets) {
            if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) {
                continue;
            }
            for (int i = 0; i < 3; ++i) {
                if (t[i] == target[i]) {
                    good[i] = true;
                }
            }
        }
        return good[0] && good[1] && good[2];
    }
};`
};

export const MergeTripletsVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = useMemo(() => TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0], [selectedTestCaseId]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const triplets = selectedTestCase.triplets;
    const target = selectedTestCase.target;
    const newSteps: Step[] = [];
    const goodSet = new Set<number>();
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const getGoodArray = () => Array.from(goodSet).sort((a, b) => a - b);

    const pushStep = (
      explanation: string,
      pseudo: string,
      currentIndex: number | null,
      currentItemState: Step['tripletsState']['currentItemState'],
      elementChecks: Step['tripletsState']['elementChecks'],
      variablesExtra: Record<string, any> = {},
      goodAddedThisStep: number | null = null,
      ts: number, py: number, jv: number, cp: number
    ) => {
      const currentTriplet = currentIndex !== null ? triplets[currentIndex] : null;
      newSteps.push({
        tripletsState: {
          triplets: triplets.map(t => [...t]),
          target: [...target],
          good: getGoodArray(),
          currentIndex,
          currentItemState,
          elementChecks: [...elementChecks],
          goodAddedThisStep,
        },
        explanation,
        pseudoStep: pseudo,
        variables: {
          'target': `[${target.join(', ')}]`,
          'good': `Set {${getGoodArray().join(', ')}}`,
          'good.size': goodSet.size,
          ...(currentTriplet ? { 't': `[${currentTriplet.join(', ')}]` } : {}),
          ...variablesExtra,
        }
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      `Welcome! We want to see if we can form the target triplet [${target.join(', ')}] using the given triplets.`,
      `mergeTriplets(triplets, target=[${target.join(", ")}])`,
      null, null, [null, null, null],
      {}, null,
      1, 1, 2, 3
    );

    pushStep(
      `Initialize Set 'good' to keep track of matched target component indices (0, 1, or 2).`,
      "SET good = Set()",
      null, null, [null, null, null],
      {}, null,
      2, 2, 3, 4
    );

    pushStep(
      `We loop through the triplets one by one to find valid candidate triplets.`,
      "FOR t IN triplets",
      null, null, [null, null, null],
      {}, null,
      3, 3, 4, 5
    );

    for (let idx = 0; idx < triplets.length; idx++) {
      const t = triplets[idx];

      pushStep(
        `Evaluating triplet ${idx + 1}/${triplets.length}: [${t.join(', ')}].`,
        `// Inspecting triplet [${t.join(", ")}]`,
        idx, 'evaluating', [null, null, null],
        {}, null,
        4, 4, 5, 6
      );

      pushStep(
        `Compare components of triplet [${t.join(', ')}] with target [${target.join(', ')}].`,
        `IF t[0] > target[0] OR t[1] > target[1] OR t[2] > target[2]`,
        idx, 'evaluating', ['checking', 'checking', 'checking'],
        {}, null,
        4, 4, 5, 6
      );

      const exceeds = t[0] > target[0] || t[1] > target[1] || t[2] > target[2];
      if (exceeds) {
        const checks: ('pass' | 'fail')[] = [
          t[0] > target[0] ? 'fail' : 'pass',
          t[1] > target[1] ? 'fail' : 'pass',
          t[2] > target[2] ? 'fail' : 'pass',
        ];
        const failedIndices = checks.map((c, i) => c === 'fail' ? i : null).filter(x => x !== null) as number[];
        const failedExprs = failedIndices.map(i => `t[${i}] (${t[i]}) > target[${i}] (${target[i]})`).join(' and ');

        pushStep(
          `Triplet [${t.join(', ')}] cannot be used because ${failedExprs}. Max operation can only keep or increase elements. Skipping this triplet.`,
          "CONTINUE",
          idx, 'exceeds', checks.map(c => c === 'fail' ? 'fail' : 'pass'),
          {}, null,
          5, 5, 6, 7
        );
        continue;
      }

      pushStep(
        `All components in [${t.join(', ')}] are less than or equal to the target. Triplet is valid. Let's check for target component matches.`,
        "// Valid triplet candidate",
        idx, 'accepted', ['pass', 'pass', 'pass'],
        {}, null,
        7, 6, 8, 9
      );

      for (let i = 0; i < 3; i++) {
        const v = t[i];
        const checks: Step['tripletsState']['elementChecks'] = [null, null, null];
        checks[i] = 'checking';

        pushStep(
          `Check if t[${i}] (${v}) is equal to target[${i}] (${target[i]}).`,
          `IF t[${i}] == target[${i}]  →  ${v} == ${target[i]}`,
          idx, 'checking-components', checks,
          { i, v }, null,
          8, 7, 8, 10
        );

        if (v === target[i]) {
          goodSet.add(i);
          const matchChecks: Step['tripletsState']['elementChecks'] = [null, null, null];
          matchChecks[i] = 'match';
          pushStep(
            `Yes! t[${i}] (${v}) matches target[${i}] (${target[i]}). Add index ${i} to the 'good' set.`,
            `good.add(${i})`,
            idx, 'checking-components', matchChecks,
            { i, v }, i,
            9, 8, 9, 11
          );
        } else {
          const failChecks: Step['tripletsState']['elementChecks'] = [null, null, null];
          failChecks[i] = 'fail';
          pushStep(
            `t[${i}] (${v}) does not match target[${i}] (${target[i]}). Continue checking.`,
            "// No match",
            idx, 'checking-components', failChecks,
            { i, v }, null,
            8, 7, 8, 10
          );
        }
      }

      pushStep(
        `Check early termination: We have found matches for ${goodSet.size} components.`,
        `IF len(good) == 3  →  ${goodSet.size} == 3`,
        idx, 'accepted', [null, null, null],
        {}, null,
        3, 9, 17, 5
      );

      if (goodSet.size === 3) {
        pushStep(
          `Early termination! The 'good' set contains all three indices (0, 1, 2). Return True immediately.`,
          "RETURN True",
          idx, 'accepted', [null, null, null],
          {}, null,
          3, 10, 18, 5
        );
        return { steps: newSteps, stepLineNumbers: lines };
      }
    }

    pushStep(
      `We have finished checking all triplets. Now, check if the size of the 'good' set is 3.`,
      `RETURN len(good) == 3  →  ${goodSet.size} == 3`,
      null, null, [null, null, null],
      { 'good.size === 3': goodSet.size === 3 ? 'true' : 'false' }, null,
      13, 11, 21, 15
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [selectedTestCase]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  // Trigger confetti when visual finishes successfully
  useEffect(() => {
    if (currentStepIndex === steps.length - 1 && steps.length > 0) {
      const isSuccess = steps[currentStepIndex].tripletsState.good.length === 3;
      if (isSuccess) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    }
  }, [currentStepIndex, steps]);

  if (steps.length === 0) return null;

  const { triplets, target, good, currentIndex, currentItemState, elementChecks } = currentStep.tripletsState;

  return (
    <div className="space-y-6">
      {/* Test Cases Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          Test Cases
        </h3>
        <div className="flex flex-wrap gap-2 bg-background p-1 rounded-lg border border-border shadow-sm">
          {TEST_CASES.map(tc => (
            <button
              key={tc.id}
              onClick={() => {
                setSelectedTestCaseId(tc.id);
                setCurrentStepIndex(0);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                selectedTestCaseId === tc.id 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tc.expected ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
              {tc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Visualization Layout */}
      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-xl border-2 border-primary/20 p-6 flex flex-col gap-6">
              
              {/* Target and Good Set */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Target Triplet & Matched Components
                </h4>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-3 rounded-lg border border-border shadow-sm overflow-hidden">
                  {/* Target values */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">Target Triplet</span>
                    <div className="flex gap-1.5">
                      {target.map((val, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-0.5">
                          <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-sm text-primary">
                            {val}
                          </div>
                          <span className="text-[9px] text-muted-foreground font-mono">Index {idx}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Good status cards */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">Good Set Status</span>
                    <div className="flex gap-1.5">
                      {target.map((val, idx) => {
                        const isMatched = good.includes(idx);
                        const isNewlyAdded = currentStep.tripletsState.goodAddedThisStep === idx;
                        return (
                          <motion.div
                            key={idx}
                            animate={isNewlyAdded ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5 }}
                            className={`w-9 h-9 rounded-md flex flex-col items-center justify-center border transition-all duration-300 ${
                              isMatched
                                ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-bold shadow-md shadow-green-500/15'
                                : 'bg-muted/30 border-dashed border-muted-foreground/30 text-muted-foreground/50'
                            }`}
                          >
                            {isMatched ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-500 mb-0.5" />
                                <span className="text-[8px] uppercase font-bold tracking-wider">Idx {idx}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-xs font-semibold">?</span>
                                <span className="text-[8px] font-medium">Idx {idx}</span>
                              </>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* List of Triplets */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Triplets Stack
                </h4>
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {triplets.map((triplet, idx) => {
                    const isActive = currentIndex === idx;
                    
                    let triState: 'pending' | 'active' | 'exceeded' | 'valid' = 'pending';
                    if (isActive) {
                      triState = 'active';
                    } else if (currentIndex !== null && idx < currentIndex) {
                      const exc = triplet[0] > target[0] || triplet[1] > target[1] || triplet[2] > target[2];
                      triState = exc ? 'exceeded' : 'valid';
                    } else if (currentIndex === null && currentStepIndex > 2) {
                      const exc = triplet[0] > target[0] || triplet[1] > target[1] || triplet[2] > target[2];
                      triState = exc ? 'exceeded' : 'valid';
                    }

                    return (
                      <motion.div
                        key={idx}
                        layout
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-300 ${
                          triState === 'active'
                            ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-md scale-[1.01]'
                            : triState === 'exceeded'
                            ? 'bg-red-500/5 border-red-200 dark:border-red-950/50 opacity-50'
                            : triState === 'valid'
                            ? 'bg-green-500/5 border-green-200 dark:border-green-950/50'
                            : 'bg-card border-border'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground w-6">T{idx + 1}</span>
                          <div className="flex gap-1.5">
                            {triplet.map((val, eIdx) => {
                              const elCheckStatus = isActive ? elementChecks[eIdx] : null;

                              return (
                                <div
                                  key={eIdx}
                                  className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                                    triState === 'exceeded' && val > target[eIdx]
                                      ? 'bg-red-500/10 border-red-400 text-red-500 line-through'
                                      : triState === 'valid' && val === target[eIdx]
                                      ? 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400'
                                      : elCheckStatus === 'match'
                                      ? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-400 scale-105 shadow-inner font-bold'
                                      : elCheckStatus === 'fail'
                                      ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400'
                                      : elCheckStatus === 'pass'
                                      ? 'bg-blue-500/10 border-blue-400 text-blue-600 dark:text-blue-400'
                                      : elCheckStatus === 'checking'
                                      ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-400 animate-pulse scale-105'
                                      : 'bg-muted/50 border-border text-foreground'
                                  }`}
                                >
                                  {val}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Triplet State Badge */}
                        <div className="text-xs font-semibold">
                          {triState === 'active' && currentItemState === 'evaluating' && (
                            <span className="text-amber-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                              Checking...
                            </span>
                          )}
                          {triState === 'active' && currentItemState === 'exceeds' && (
                            <span className="text-red-500 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Exceeds Target
                            </span>
                          )}
                          {triState === 'active' && currentItemState === 'accepted' && (
                            <span className="text-green-500">Valid</span>
                          )}
                          {triState === 'active' && currentItemState === 'checking-components' && (
                            <span className="text-blue-500">Checking Items</span>
                          )}
                          {triState === 'exceeded' && (
                            <span className="text-red-400 dark:text-red-600 font-medium">Skipped</span>
                          )}
                          {triState === 'valid' && (
                            <span className="text-green-500 font-medium">Checked</span>
                          )}
                          {triState === 'pending' && (
                            <span className="text-muted-foreground/40 font-normal">Pending</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

            </div>

            <Card className="p-4 bg-primary/5 border border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium">
                {currentStep.explanation}
              </p>
            </Card>
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStepIndex}
              onLanguageChange={() => setCurrentStepIndex(0)}
            />
            <VariablePanel variables={currentStep.variables} />
          </div>
        }
        controls={
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
        }
      />
    </div>
  );
};
export default MergeTripletsVisualization;
