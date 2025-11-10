import { useState, useEffect, useRef } from 'react';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  list: number[];
  phase: 'find-middle' | 'reverse' | 'merge';
  slow: number | null;
  fast: number | null;
  firstHalf: number[];
  secondHalf: number[];
  result: number[];
  message: string;
  lineNumber: number;
}

export const ReorderListVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function reorderList(head: ListNode | null): void {
  if (!head || !head.next) return;
  
  // Step 1: Find middle using slow/fast pointers
  let slow = head, fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  // Step 2: Reverse second half
  let second = slow.next;
  slow.next = null;
  let prev = null;
  while (second) {
    let tmp = second.next;
    second.next = prev;
    prev = second;
    second = tmp;
  }
  
  // Step 3: Merge two halves alternately
  let first = head;
  second = prev;
  while (second) {
    let tmp1 = first.next, tmp2 = second.next;
    first.next = second;
    second.next = tmp1;
    first = tmp1;
    second = tmp2;
  }
}`;

  const generateSteps = () => {
    const list = [1, 2, 3, 4, 5];
    const newSteps: Step[] = [];

    // Phase 1: Find middle
    newSteps.push({
      list: [...list],
      phase: 'find-middle',
      slow: 0,
      fast: 0,
      firstHalf: [],
      secondHalf: [],
      result: [],
      message: 'Step 1: Find middle using slow/fast pointers',
      lineNumber: 4
    });

    let slow = 0, fast = 0;
    while (fast + 2 < list.length) {
      slow++;
      fast += 2;
      newSteps.push({
        list: [...list],
        phase: 'find-middle',
        slow,
        fast,
        firstHalf: [],
        secondHalf: [],
        result: [],
        message: `Move slow by 1, fast by 2. Middle at index ${slow}`,
        lineNumber: 6
      });
    }

    const mid = slow;
    const firstHalf = list.slice(0, mid + 1);
    const secondHalf = list.slice(mid + 1);

    newSteps.push({
      list: [...list],
      phase: 'find-middle',
      slow: mid,
      fast: null,
      firstHalf: [...firstHalf],
      secondHalf: [...secondHalf],
      result: [],
      message: `Found middle at ${list[mid]}. Split list into two halves`,
      lineNumber: 11
    });

    // Phase 2: Reverse second half
    newSteps.push({
      list: [...list],
      phase: 'reverse',
      slow: null,
      fast: null,
      firstHalf: [...firstHalf],
      secondHalf: [...secondHalf],
      result: [],
      message: 'Step 2: Reverse second half',
      lineNumber: 13
    });

    const reversedSecond = [...secondHalf].reverse();
    newSteps.push({
      list: [...list],
      phase: 'reverse',
      slow: null,
      fast: null,
      firstHalf: [...firstHalf],
      secondHalf: [...reversedSecond],
      result: [],
      message: `Second half reversed: [${reversedSecond.join(', ')}]`,
      lineNumber: 20
    });

    // Phase 3: Merge alternately
    newSteps.push({
      list: [...list],
      phase: 'merge',
      slow: null,
      fast: null,
      firstHalf: [...firstHalf],
      secondHalf: [...reversedSecond],
      result: [],
      message: 'Step 3: Merge two halves alternately',
      lineNumber: 23
    });

    const result: number[] = [];
    const maxLen = Math.max(firstHalf.length, reversedSecond.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < firstHalf.length) result.push(firstHalf[i]);
      if (i < reversedSecond.length) result.push(reversedSecond[i]);
      
      newSteps.push({
        list: [...list],
        phase: 'merge',
        slow: null,
        fast: null,
        firstHalf: [...firstHalf],
        secondHalf: [...reversedSecond],
        result: [...result],
        message: `Merged ${result.length} nodes alternately`,
        lineNumber: 26
      });
    }

    newSteps.push({
      list: [...list],
      phase: 'merge',
      slow: null,
      fast: null,
      firstHalf: [...firstHalf],
      secondHalf: [...reversedSecond],
      result: [...result],
      message: `Complete! Reordered list: [${result.join(', ')}]`,
      lineNumber: 31
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">
              {currentStep.phase === 'find-middle' && 'Phase 1: Find Middle'}
              {currentStep.phase === 'reverse' && 'Phase 2: Reverse Second Half'}
              {currentStep.phase === 'merge' && 'Phase 3: Merge Alternately'}
            </h3>

            {/* Original List */}
            {currentStep.phase === 'find-middle' && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Original List:</p>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {currentStep.list.map((val, idx) => (
                    <div key={idx} className="flex items-center">
                      <div
                        className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all ${
                          currentStep.slow === idx
                            ? 'bg-primary/20 border-primary text-primary'
                            : currentStep.fast === idx
                            ? 'bg-secondary/20 border-secondary text-secondary-foreground'
                            : 'bg-card border-border text-foreground'
                        }`}
                      >
                        {val}
                      </div>
                      {idx < currentStep.list.length - 1 && (
                        <div className="text-xl mx-1 text-muted-foreground">→</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Two Halves */}
            {(currentStep.phase === 'reverse' || currentStep.phase === 'merge') && currentStep.firstHalf.length > 0 && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">First Half:</p>
                  <div className="flex gap-2">
                    {currentStep.firstHalf.map((val, idx) => (
                      <div
                        key={idx}
                        className="w-12 h-12 flex items-center justify-center rounded-lg border-2 bg-primary/20 border-primary text-primary font-bold"
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Second Half {currentStep.phase === 'reverse' && '(Reversed)'}:
                  </p>
                  <div className="flex gap-2">
                    {currentStep.secondHalf.map((val, idx) => (
                      <div
                        key={idx}
                        className="w-12 h-12 flex items-center justify-center rounded-lg border-2 bg-secondary/20 border-secondary text-secondary-foreground font-bold"
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>

                {currentStep.result.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Result:</p>
                    <div className="flex gap-2 flex-wrap">
                      {currentStep.result.map((val, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-12 flex items-center justify-center rounded-lg border-2 bg-accent/20 border-accent text-accent-foreground font-bold"
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 p-4 bg-muted rounded">
              <p className="text-sm">{currentStep.message}</p>
            </div>
          </div>

          <VariablePanel
            variables={{
              phase: currentStep.phase === 'find-middle' ? '1: Find Middle' : currentStep.phase === 'reverse' ? '2: Reverse' : '3: Merge',
              slow: currentStep.slow !== null ? `node ${currentStep.slow}` : '-',
              fast: currentStep.fast !== null ? `node ${currentStep.fast}` : '-',
              result: currentStep.result.length > 0 ? `[${currentStep.result.join(', ')}]` : 'in progress'
            }}
          />
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>
    </div>
  );
};
