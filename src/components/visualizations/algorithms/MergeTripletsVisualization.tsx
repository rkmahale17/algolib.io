import { useEffect, useRef, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Check, Trophy, Play, Pause, SkipForward, SkipBack, RotateCcw, AlertTriangle } from 'lucide-react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

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
  lineNumber: number;
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

export const MergeTripletsVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0];

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function mergeTriplets(triplets: number[][], target: number[]): boolean {
    const good = new Set<number>();

    for (const t of triplets) {
        if (
            t[0] > target[0] ||
            t[1] > target[1] ||
            t[2] > target[2]
        ) {
            continue;
        }

        t.forEach((v, i) => {
            if (v === target[i]) {
                good.add(i);
            }
        });
    }

    return good.size === 3;
}`;

  const generateSteps = useCallback(() => {
    const triplets = selectedTestCase.triplets;
    const target = selectedTestCase.target;
    const newSteps: Step[] = [];
    const goodSet = new Set<number>();

    const getGoodArray = () => Array.from(goodSet).sort((a, b) => a - b);

    const pushStep = (
      lineNumber: number,
      explanation: string,
      currentIndex: number | null,
      currentItemState: Step['tripletsState']['currentItemState'],
      elementChecks: Step['tripletsState']['elementChecks'],
      variablesExtra: Record<string, any> = {},
      goodAddedThisStep: number | null = null
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
        lineNumber,
        variables: {
          'target': `[${target.join(', ')}]`,
          'good': `Set {${getGoodArray().join(', ')}}`,
          'good.size': goodSet.size,
          ...(currentTriplet ? { 't': `[${currentTriplet.join(', ')}]` } : {}),
          ...variablesExtra,
        }
      });
    };

    // Step 1: Init
    pushStep(1, `Welcome! We want to see if we can form the target triplet [${target.join(', ')}] using the given triplets.`, null, null, [null, null, null]);

    // Step 2: Initialize good set
    pushStep(2, `Initialize an empty Set 'good' to keep track of matched target component indices (0, 1, or 2).`, null, null, [null, null, null]);

    // Step 3: Loop start
    pushStep(4, `We loop through the triplets one by one to find valid candidate triplets.`, null, null, [null, null, null]);

    for (let idx = 0; idx < triplets.length; idx++) {
      const t = triplets[idx];

      // Line 4: Current triplet check
      pushStep(4, `Evaluating triplet ${idx + 1}/${triplets.length}: [${t.join(', ')}].`, idx, 'evaluating', [null, null, null]);

      // Line 5: Check if any component exceeds target
      pushStep(5, `Compare components of triplet [${t.join(', ')}] with target [${target.join(', ')}].`, idx, 'evaluating', ['checking', 'checking', 'checking']);

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
          10,
          `Triplet [${t.join(', ')}] cannot be used because ${failedExprs}. Any max operation with this triplet would exceed the target components. We skip this triplet.`,
          idx,
          'exceeds',
          checks.map(c => c === 'fail' ? 'fail' : 'pass')
        );
        continue;
      }

      // Pass verification
      pushStep(
        13,
        `All components in [${t.join(', ')}] are less than or equal to the target. This triplet is valid. Let's inspect its components to see if they match the target.`,
        idx,
        'accepted',
        ['pass', 'pass', 'pass']
      );

      // Line 13: forEach
      pushStep(
        13,
        `Loop through each component of the valid triplet [${t.join(', ')}] using forEach.`,
        idx,
        'checking-components',
        [null, null, null]
      );

      for (let i = 0; i < 3; i++) {
        const v = t[i];
        const checks: Step['tripletsState']['elementChecks'] = [null, null, null];
        checks[i] = 'checking';

        // Line 14: check if t[i] === target[i]
        pushStep(
          14,
          `Check if t[${i}] (${v}) is equal to target[${i}] (${target[i]}).`,
          idx,
          'checking-components',
          checks,
          { i, v }
        );

        if (v === target[i]) {
          goodSet.add(i);
          const matchChecks: Step['tripletsState']['elementChecks'] = [null, null, null];
          matchChecks[i] = 'match';
          // Line 15: good.add(i)
          pushStep(
            15,
            `Yes! t[${i}] (${v}) matches target[${i}] (${target[i]}). Add index ${i} to the 'good' set.`,
            idx,
            'checking-components',
            matchChecks,
            { i, v },
            i
          );
        } else {
          const failChecks: Step['tripletsState']['elementChecks'] = [null, null, null];
          failChecks[i] = 'fail';
          // Line 14: no match
          pushStep(
            14,
            `t[${i}] (${v}) does not match target[${i}] (${target[i]}). Continue checking.`,
            idx,
            'checking-components',
            failChecks,
            { i, v }
          );
        }
      }
    }

    // After loop: line 20
    pushStep(
      20,
      `We have finished checking all triplets. Now, check if the size of the 'good' set is 3.`,
      null,
      null,
      [null, null, null],
      { 'good.size === 3': goodSet.size === 3 ? 'true' : 'false' }
    );

    // Final return
    pushStep(
      20,
      `The 'good' set contains ${goodSet.size} components. We return ${goodSet.size === 3 ? 'true' : 'false'}.`,
      null,
      null,
      [null, null, null],
      { 'good.size === 3': goodSet.size === 3 ? 'true' : 'false', 'result': goodSet.size === 3 ? 'true' : 'false' }
    );

    setSteps(newSteps);
    setCurrentStepIndex(0);
  }, [selectedTestCase]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

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

  const currentStep = steps[currentStepIndex];
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
                setIsPlaying(false);
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

      {/* Control Buttons */}
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

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Visuals & Explanation */}
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
                  
                  // Determine status of previously processed triplets
                  let triState: 'pending' | 'active' | 'exceeded' | 'valid' = 'pending';
                  if (isActive) {
                    triState = 'active';
                  } else if (currentIndex !== null && idx < currentIndex) {
                    // Check if this triplet exceeded target
                    const exc = triplet[0] > target[0] || triplet[1] > target[1] || triplet[2] > target[2];
                    triState = exc ? 'exceeded' : 'valid';
                  } else if (currentIndex === null && currentStepIndex > 2) {
                    // Loop is finished
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
                                    ? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-400 scale-105 shadow-inner'
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

          {/* Explanation Text */}
          <div className="bg-accent/40 rounded-xl border border-accent p-5 shadow-sm">
            <p className="text-sm sm:text-base leading-relaxed font-medium text-foreground">
              {currentStep.explanation}
            </p>
          </div>

          {/* Variable State Table */}
          <VariablePanel variables={currentStep.variables} />
        </div>

        {/* Right Panel: Animated Code Editor */}
        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
      </div>
    </div>
  );
};
