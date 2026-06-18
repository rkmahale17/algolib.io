import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, XCircle, Check, Play, Pause, SkipForward, SkipBack, RotateCcw, Info } from 'lucide-react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  s1: string;
  s2: string;
  l: number;
  r: number;
  s1Count: number[];
  s2Count: number[];
  matches: number;
  explanation: string;
  lineNumber: number;
  variables: Record<string, any>;
  phase: 'init' | 'check' | 'slide' | 'done';
}

interface TestCase {
  id: string;
  name: string;
  s1: string;
  s2: string;
  expected: boolean;
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Permutation Found', s1: 'ab', s2: 'eidbaooo', expected: true },
  { id: 'ex2', name: 'No Permutation', s1: 'ab', s2: 'eidboaoo', expected: false },
  { id: 'ex3', name: 'Valid Multiple', s1: 'adc', s2: 'dcda', expected: true },
  { id: 'ex4', name: 'Long Target', s1: 'hello', s2: 'ooolleoooleh', expected: false }
];

export const PermutationInStringVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0];

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function checkInclusion(s1: string, s2: string): boolean {
    if (s1.length > s2.length) return false;

    const s1Count = new Array(26).fill(0);
    const s2Count = new Array(26).fill(0);

    for (let i = 0; i < s1.length; i++) {
        s1Count[s1.charCodeAt(i) - 97]++;
        s2Count[s2.charCodeAt(i) - 97]++;
    }

    let matches = 0;
    for (let i = 0; i < 26; i++) {
        if (s1Count[i] === s2Count[i]) {
            matches++;
        }
    }

    let l = 0;
    for (let r = s1.length; r < s2.length; r++) {
        if (matches === 26) return true;

        let indexToAdd = s2.charCodeAt(r) - 97;
        s2Count[indexToAdd]++;
        if (s1Count[indexToAdd] === s2Count[indexToAdd]) {
            matches++;
        } else if (s1Count[indexToAdd] + 1 === s2Count[indexToAdd]) {
            matches--;
        }

        let indexToRemove = s2.charCodeAt(l) - 97;
        s2Count[indexToRemove]--;
        if (s1Count[indexToRemove] === s2Count[indexToRemove]) {
            matches++;
        } else if (s1Count[indexToRemove] - 1 === s2Count[indexToRemove]) {
            matches--;
        }
        l++;
    }

    return matches === 26;
}`;

  const generateSteps = useCallback(() => {
    const s1 = selectedTestCase.s1;
    const s2 = selectedTestCase.s2;
    const newSteps: Step[] = [];

    const getVariables = (l: number, r: number, matchesVal: number, extra: Record<string, any> = {}) => {
      return {
        's1': `"${s1}"`,
        's2': `"${s2}"`,
        'l': l,
        'r': r,
        'matches': `${matchesVal} / 26`,
        ...extra
      };
    };

    const pushStep = (
      lineNumber: number,
      explanation: string,
      phase: Step['phase'],
      l: number,
      r: number,
      s1CountCopy: number[],
      s2CountCopy: number[],
      matchesVal: number,
      variablesExtra: Record<string, any> = {}
    ) => {
      newSteps.push({
        s1,
        s2,
        l,
        r,
        s1Count: [...s1CountCopy],
        s2Count: [...s2CountCopy],
        matches: matchesVal,
        explanation,
        lineNumber,
        phase,
        variables: getVariables(l, r, matchesVal, variablesExtra)
      });
    };

    const s1Count = new Array(26).fill(0);
    const s2Count = new Array(26).fill(0);

    // Step 1: Init / line 1
    pushStep(1, `Start checkInclusion: s1 = "${s1}", s2 = "${s2}". Check if s1.length (${s1.length}) > s2.length (${s2.length}).`, 'init', 0, -1, s1Count, s2Count, 0);

    if (s1.length > s2.length) {
      pushStep(2, `s1 length is greater than s2 length. It's impossible to fit a permutation of s1 in s2. Return false.`, 'done', 0, -1, s1Count, s2Count, 0, { return: 'false' });
      setSteps(newSteps);
      setCurrentStepIndex(0);
      return;
    }

    // Step 2: Init arrays / lines 3-4
    pushStep(4, `Initialize s1Count and s2Count arrays of size 26 for English lowercase character counts.`, 'init', 0, -1, s1Count, s2Count, 0);

    // Step 3: Populate counts / lines 6-9
    pushStep(6, `Populate s1Count and the first window of s2Count (length ${s1.length}).`, 'init', 0, -1, s1Count, s2Count, 0);

    for (let i = 0; i < s1.length; i++) {
      const charCode1 = s1.charCodeAt(i) - 97;
      const charCode2 = s2.charCodeAt(i) - 97;
      s1Count[charCode1]++;
      s2Count[charCode2]++;
      pushStep(6, `Counted s1[${i}] ('${s1[i]}') and s2[${i}] ('${s2[i]}').`, 'init', 0, -1, s1Count, s2Count, 0);
    }

    // Step 4: Count initial matches / lines 11-16
    let matches = 0;
    pushStep(12, `Compute character counts that already match between the target s1 and the first window of s2.`, 'init', 0, -1, s1Count, s2Count, 0);

    for (let i = 0; i < 26; i++) {
      if (s1Count[i] === s2Count[i]) {
        matches++;
      }
    }
    pushStep(13, `Initial matches: ${matches} out of 26 character frequencies are identical (including characters with count 0 on both sides).`, 'init', 0, -1, s1Count, s2Count, matches);

    let l = 0;
    pushStep(18, `Set left pointer of sliding window: l = 0.`, 'init', l, -1, s1Count, s2Count, matches);

    // Sliding window loop / line 19
    pushStep(19, `Start loop. Slide the window right from index r = ${s1.length}.`, 'slide', l, s1.length - 1, s1Count, s2Count, matches);

    for (let r = s1.length; r < s2.length; r++) {
      // Loop check
      pushStep(19, `Checking window with right pointer r = ${r} ('${s2[r]}').`, 'slide', l, r - 1, s1Count, s2Count, matches);

      // Line 20: matches === 26 check
      pushStep(20, `Check if matches count (${matches}) equals 26.`, 'check', l, r - 1, s1Count, s2Count, matches);
      if (matches === 26) {
        pushStep(20, `All 26 character frequencies match! We found a permutation. Return true.`, 'done', l, r - 1, s1Count, s2Count, matches, { return: 'true' });
        setSteps(newSteps);
        setCurrentStepIndex(0);
        return;
      }

      // Line 22: Add character at r
      const indexToAdd = s2.charCodeAt(r) - 97;
      s2Count[indexToAdd]++;
      pushStep(23, `Add character s2[r] ('${s2[r]}') to the sliding window. Update window counts.`, 'slide', l, r, s1Count, s2Count, matches);

      // Update matches count after adding
      const prevMatches1 = matches;
      if (s1Count[indexToAdd] === s2Count[indexToAdd]) {
        matches++;
      } else if (s1Count[indexToAdd] + 1 === s2Count[indexToAdd]) {
        matches--;
      }
      pushStep(
        24,
        s1Count[indexToAdd] === s2Count[indexToAdd]
          ? `Count of '${s2[r]}' in window matches target s1 count (${s1Count[indexToAdd]}). Increment matches count to ${matches}.`
          : s1Count[indexToAdd] + 1 === s2Count[indexToAdd]
          ? `Count of '${s2[r]}' in window was matching, but now exceeds target count (${s1Count[indexToAdd]} vs ${s2Count[indexToAdd]}). Decrement matches count to ${matches}.`
          : `Count of '${s2[r]}' updated. Counts still don't match. Matches count remains ${matches}.`,
        'slide',
        l,
        r,
        s1Count,
        s2Count,
        matches
      );

      // Line 30: Remove character at l
      const indexToRemove = s2.charCodeAt(l) - 97;
      s2Count[indexToRemove]--;
      pushStep(31, `Remove outgoing character s2[l] ('${s2[l]}') from the sliding window.`, 'slide', l, r, s1Count, s2Count, matches);

      // Update matches count after removing
      if (s1Count[indexToRemove] === s2Count[indexToRemove]) {
        matches++;
      } else if (s1Count[indexToRemove] - 1 === s2Count[indexToRemove]) {
        matches--;
      }
      pushStep(
        32,
        s1Count[indexToRemove] === s2Count[indexToRemove]
          ? `Count of '${s2[l]}' in window matches target s1 count (${s1Count[indexToRemove]}). Increment matches count to ${matches}.`
          : s1Count[indexToRemove] - 1 === s2Count[indexToRemove]
          ? `Count of '${s2[l]}' in window was matching, but now falls below target count (${s1Count[indexToRemove]} vs ${s2Count[indexToRemove]}). Decrement matches count to ${matches}.`
          : `Count of '${s2[l]}' updated. Counts still don't match. Matches count remains ${matches}.`,
        'slide',
        l,
        r,
        s1Count,
        s2Count,
        matches
      );

      // Line 38: l++
      l++;
      pushStep(38, `Increment left pointer l to ${l} to slide the window forward.`, 'slide', l, r, s1Count, s2Count, matches);
    }

    // Line 41: check final matches
    pushStep(41, `Finished loop. Check if the matches count of the last window is 26.`, 'check', l, s2.length - 1, s1Count, s2Count, matches);
    if (matches === 26) {
      pushStep(41, `All 26 character frequencies match! We found a permutation. Return true.`, 'done', l, s2.length - 1, s1Count, s2Count, matches, { return: 'true' });
    } else {
      pushStep(41, `No permutation matches found in the entire string. Return false.`, 'done', l, s2.length - 1, s1Count, s2Count, matches, { return: 'false' });
    }

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
      const step = steps[currentStepIndex];
      const isSuccess = step.matches === 26;
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
  const { s1, s2, l, r, s1Count, s2Count, matches } = currentStep;

  // Filter out characters that are actually present in s1 or currently in s2's window
  const activeChars = Array.from(
    new Set([
      ...s1.split(''),
      ...(r !== -1 ? s2.slice(l, r + 1).split('') : [])
    ])
  ).sort();

  const getCharStyle = (idx: number) => {
    const isCurrentR = idx === r;
    const isCurrentL = idx === l;
    const isInWindow = idx >= l && idx <= r && r !== -1;

    if (isCurrentR || isCurrentL) {
      return "bg-primary text-primary-foreground border-primary scale-110 z-10 shadow-md";
    }
    if (isInWindow) {
      return "bg-primary/20 text-foreground border-primary/40 shadow-inner";
    }
    return "bg-muted/50 text-foreground border-border";
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          {/* Test Cases Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                    selectedTestCaseId === tc.id 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tc.expected ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                  {tc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Letter Blocks: s1 and s2 */}
          <Card className="p-4 bg-card border border-border shadow-sm space-y-6">
            {/* Target Permutation (s1) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Target Permutation (s1)</span>
              <div className="flex gap-1.5 flex-wrap">
                {s1.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-md bg-secondary/40 border border-secondary flex items-center justify-center font-bold text-xs font-mono text-foreground"
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            {/* Sliding Window on s2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Sliding Window (s2)</span>
                <div className="flex gap-2 font-mono text-[9px] text-muted-foreground">
                  <span>L: {l}</span>
                  <span>R: {r !== -1 ? r : '-'}</span>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {s2.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-md border flex items-center justify-center font-bold text-xs font-mono transition-all duration-200 ${getCharStyle(idx)}`}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Frequencies Match and Matches counter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Character frequencies comparison */}
            <Card className="p-4 bg-card border border-border shadow-sm flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 text-center block">
                Frequencies Comparison
              </span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {activeChars.map(char => {
                  const charIdx = char.charCodeAt(0) - 97;
                  const targetCount = s1Count[charIdx];
                  const windowCount = s2Count[charIdx];
                  const isMatching = targetCount === windowCount;

                  return (
                    <div
                      key={char}
                      className={`flex justify-between items-center px-3 py-1.5 rounded border text-xs font-semibold transition-all duration-300 ${
                        isMatching
                          ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                          : 'bg-muted/40 border-border/50 text-foreground'
                      }`}
                    >
                      <span className="font-mono">{char.toUpperCase()}</span>
                      <span className="font-mono">
                        {windowCount} / {targetCount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Matches counter out of 26 */}
            <Card className="p-4 bg-card border border-border shadow-sm flex flex-col justify-center items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center block">
                Frequencies Matches
              </span>

              <div className="flex flex-col items-center gap-1.5 w-full">
                <span className={`text-xl font-bold font-mono transition-all duration-300 ${
                  matches === 26 
                    ? 'text-green-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-110' 
                    : 'text-foreground'
                }`}>
                  {matches} / 26
                </span>
                <span className="text-[9px] text-muted-foreground uppercase text-center block">
                  identical counts
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-border">
                <div
                  className={`h-full transition-all duration-300 ${
                    matches === 26 ? 'bg-green-500' : 'bg-primary'
                  }`}
                  style={{ width: `${(matches / 26) * 100}%` }}
                />
              </div>
            </Card>
          </div>

          {/* Explanation Text */}
          <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm flex items-center ${
            currentStep.phase === 'done' && matches === 26
              ? 'bg-green-500/5 border-green-500' 
              : 'bg-accent/40 border-primary'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl shrink-0 ${
                currentStep.phase === 'done' && matches === 26
                  ? 'bg-green-500 text-white' 
                  : 'bg-primary/10 text-primary'
              }`}>
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Narrative
                </h4>
                <p className="text-xs font-medium leading-relaxed text-foreground/90">
                  {currentStep.explanation}
                </p>
              </div>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4 h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[currentStep.lineNumber]}
            language="typescript"
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
  );
};
