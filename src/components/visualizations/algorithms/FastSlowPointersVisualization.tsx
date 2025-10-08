import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface ListNode {
  val: number;
  next: ListNode | null;
  x?: number;
  y?: number;
}

interface Step {
  slow: number | null;
  fast: number | null;
  message: string;
  lineNumber: number;
  hasCycle: boolean | null;
}

export const FastSlowPointersVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);
  const [list, setList] = useState<ListNode | null>(null);

  const code = `function hasCycle(head: ListNode | null): boolean {
  if (!head || !head.next) return false;
  
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) {
      return true;
    }
  }
  
  return false;
}`;

  const createListWithCycle = (): ListNode => {
    const nodes: ListNode[] = [
      { val: 3, next: null },
      { val: 2, next: null },
      { val: 0, next: null },
      { val: -4, next: null }
    ];
    
    nodes[0].next = nodes[1];
    nodes[1].next = nodes[2];
    nodes[2].next = nodes[3];
    nodes[3].next = nodes[1]; // Creates cycle

    return nodes[0];
  };

  const getNodeIndex = (head: ListNode | null, target: ListNode | null): number | null => {
    if (!target) return null;
    let index = 0;
    let current = head;
    const visited = new Set<ListNode>();
    
    while (current && !visited.has(current)) {
      if (current === target) return index;
      visited.add(current);
      current = current.next;
      index++;
    }
    return null;
  };

  const generateSteps = () => {
    const head = createListWithCycle();
    setList(head);
    const newSteps: Step[] = [];

    newSteps.push({
      slow: null,
      fast: null,
      message: 'Initialize slow and fast pointers at head',
      lineNumber: 4,
      hasCycle: null
    });

    let slow: ListNode | null = head;
    let fast: ListNode | null = head;

    newSteps.push({
      slow: getNodeIndex(head, slow),
      fast: getNodeIndex(head, fast),
      message: 'Both pointers start at head',
      lineNumber: 5,
      hasCycle: null
    });

    while (fast && fast.next) {
      slow = slow!.next;
      fast = fast.next.next;

      newSteps.push({
        slow: getNodeIndex(head, slow),
        fast: getNodeIndex(head, fast),
        message: `Move slow by 1, fast by 2. Slow at node ${getNodeIndex(head, slow)}, Fast at node ${getNodeIndex(head, fast)}`,
        lineNumber: 8,
        hasCycle: null
      });

      if (slow === fast) {
        newSteps.push({
          slow: getNodeIndex(head, slow),
          fast: getNodeIndex(head, fast),
          message: 'Pointers met! Cycle detected',
          lineNumber: 11,
          hasCycle: true
        });
        break;
      }
    }

    if (!newSteps[newSteps.length - 1].hasCycle) {
      newSteps.push({
        slow: getNodeIndex(head, slow),
        fast: getNodeIndex(head, fast),
        message: 'Fast pointer reached end, no cycle',
        lineNumber: 15,
        hasCycle: false
      });
    }

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0 || !list) return null;

  const currentStep = steps[currentStepIndex];
  
  // Create array representation for visualization
  const nodes: number[] = [];
  let current = list;
  const visited = new Set<ListNode>();
  while (current && !visited.has(current)) {
    nodes.push(current.val);
    visited.add(current);
    current = current.next;
  }

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

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Linked List Visualization</h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          {nodes.map((val, idx) => (
            <div key={idx} className="flex items-center">
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all ${
                  currentStep.slow === idx && currentStep.fast === idx
                    ? 'bg-purple-500/20 border-purple-500 text-purple-500'
                    : currentStep.slow === idx
                    ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                    : currentStep.fast === idx
                    ? 'bg-green-500/20 border-green-500 text-green-500'
                    : 'bg-card border-border'
                }`}
              >
                {val}
              </div>
              {idx < nodes.length - 1 && (
                <div className="text-2xl mx-2 text-muted-foreground">→</div>
              )}
            </div>
          ))}
          {currentStep.hasCycle && (
            <div className="text-2xl mx-2 text-muted-foreground">↺</div>
          )}
        </div>
        
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/20 border-2 border-blue-500"></div>
            <span>Slow Pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500"></div>
            <span>Fast Pointer</span>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          slow: currentStep.slow !== null ? `Node ${currentStep.slow}` : 'null',
          fast: currentStep.fast !== null ? `Node ${currentStep.fast}` : 'null',
          hasCycle: currentStep.hasCycle !== null ? String(currentStep.hasCycle) : 'checking...'
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};