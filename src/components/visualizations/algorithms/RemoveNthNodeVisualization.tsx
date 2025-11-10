import { useState, useEffect, useRef } from 'react';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  list: number[];
  dummy: boolean;
  slow: number | null;
  fast: number | null;
  toRemove: number | null;
  removed: boolean;
  message: string;
  lineNumber: number;
}

export const RemoveNthNodeVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let slow = dummy;
  let fast = dummy;
  
  // Move fast pointer n+1 steps ahead
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  
  // Move both pointers until fast reaches end
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }
  
  // Remove the nth node
  slow.next = slow.next.next;
  
  return dummy.next;
}`;

  const generateSteps = () => {
    const list = [1, 2, 3, 4, 5];
    const n = 2;
    const newSteps: Step[] = [];

    newSteps.push({
      list: [...list],
      dummy: true,
      slow: -1,
      fast: -1,
      toRemove: null,
      removed: false,
      message: `Remove ${n}th node from end. Create dummy node and initialize pointers`,
      lineNumber: 1
    });

    // Move fast n+1 steps ahead
    for (let i = 0; i <= n; i++) {
      newSteps.push({
        list: [...list],
        dummy: true,
        slow: -1,
        fast: i - 1,
        toRemove: null,
        removed: false,
        message: `Move fast pointer ${i}/${n + 1} steps ahead`,
        lineNumber: 6
      });
    }

    // Move both until fast reaches end
    let slow = -1;
    let fast = n;
    while (fast < list.length) {
      slow++;
      fast++;
      newSteps.push({
        list: [...list],
        dummy: true,
        slow,
        fast: fast < list.length ? fast : null,
        toRemove: null,
        removed: false,
        message: `Move both pointers. Slow at ${slow >= 0 ? list[slow] : 'dummy'}, Fast at ${fast < list.length ? list[fast] : 'end'}`,
        lineNumber: 11
      });
    }

    // Remove the node
    const removeIdx = slow + 1;
    newSteps.push({
      list: [...list],
      dummy: true,
      slow,
      fast: null,
      toRemove: removeIdx,
      removed: false,
      message: `Slow.next points to node to remove (${list[removeIdx]})`,
      lineNumber: 16
    });

    const resultList = [...list];
    resultList.splice(removeIdx, 1);
    newSteps.push({
      list: resultList,
      dummy: true,
      slow,
      fast: null,
      toRemove: null,
      removed: true,
      message: `Removed node ${list[removeIdx]}. Result: [${resultList.join(', ')}]`,
      lineNumber: 17
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
            <h3 className="text-lg font-semibold mb-4">Linked List</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {currentStep.dummy && (
                <div className="flex items-center">
                  <div className="w-14 h-14 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-muted/30 font-bold text-sm">
                    D
                  </div>
                  <div className="text-xl mx-1 text-muted-foreground">→</div>
                </div>
              )}
              {currentStep.list.map((val, idx) => (
                <div key={idx} className="flex items-center">
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all ${
                      currentStep.toRemove === idx
                        ? 'bg-destructive/20 border-destructive text-destructive scale-110'
                        : currentStep.slow === idx
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

            <div className="mt-4 flex gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20 border-2 border-primary"></div>
                <span>Slow Pointer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-secondary/20 border-2 border-secondary"></div>
                <span>Fast Pointer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-destructive/20 border-2 border-destructive"></div>
                <span>To Remove</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted rounded">
              <p className="text-sm">{currentStep.message}</p>
            </div>
          </div>

          <VariablePanel
            variables={{
              n: 2,
              slow: currentStep.slow === -1 ? 'dummy' : currentStep.slow !== null ? `node ${currentStep.slow}` : 'null',
              fast: currentStep.fast === -1 ? 'dummy' : currentStep.fast !== null ? `node ${currentStep.fast}` : 'end',
              toRemove: currentStep.toRemove !== null ? currentStep.list[currentStep.toRemove] : 'none'
            }}
          />
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>
    </div>
  );
};
