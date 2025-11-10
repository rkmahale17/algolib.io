import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';

interface Step {
  list: number[];
  prev: number | null;
  current: number | null;
  next: number | null;
  reversed: boolean[];
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const ReverseLinkedListVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const list = [1, 2, 3, 4, 5];

  const steps: Step[] = [
    { list, prev: null, current: 0, next: null, reversed: [false, false, false, false, false], variables: { prev: 'null', current: '1' }, message: "Initialize: prev=null, current=head(1)", lineNumber: 2 },
    { list, prev: null, current: 0, next: 1, reversed: [false, false, false, false, false], variables: { next: '2' }, message: "Store next pointer: next=2", lineNumber: 6 },
    { list, prev: null, current: 0, next: 1, reversed: [true, false, false, false, false], variables: { action: 'current.next = prev' }, message: "Reverse pointer: 1->null", lineNumber: 7 },
    { list, prev: 0, current: 1, next: 1, reversed: [true, false, false, false, false], variables: { prev: '1', current: '2' }, message: "Move forward: prev=1, current=2", lineNumber: 9 },
    { list, prev: 1, current: 2, next: 2, reversed: [true, true, false, false, false], variables: { action: 'reverse' }, message: "Reverse pointer: 2->1", lineNumber: 7 },
    { list, prev: 2, current: 3, next: 3, reversed: [true, true, true, false, false], variables: { action: 'reverse' }, message: "Reverse pointer: 3->2", lineNumber: 7 },
    { list, prev: 3, current: 4, next: 4, reversed: [true, true, true, true, false], variables: { action: 'reverse' }, message: "Reverse pointer: 4->3", lineNumber: 7 },
    { list, prev: 4, current: null, next: null, reversed: [true, true, true, true, true], variables: { result: 'prev = 5' }, message: "Complete! Return prev(5) as new head. Time: O(n), Space: O(1)", lineNumber: 12 }
  ];

  const code = `function reverseList(head: ListNode | null): ListNode | null {
  let prev = null;
  let current = head;
  
  while (current !== null) {
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(0)} disabled={currentStepIndex === 0}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0}><SkipBack className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1}><SkipForward className="h-4 w-4" /></Button>
          </div>
          <div className="text-sm">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Reverse Linked List</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {currentStep.list.map((val, idx) => (
                <div key={idx} className="flex items-center">
                  <div className={`w-14 h-14 flex items-center justify-center rounded font-bold text-lg border-2 ${
                    currentStep.current === idx ? 'bg-primary/20 border-primary text-primary' :
                    currentStep.prev === idx ? 'bg-accent/20 border-accent text-accent-foreground' :
                    currentStep.next === idx ? 'bg-secondary/20 border-secondary text-secondary-foreground' : 'bg-muted border-border text-foreground'
                  }`}>
                    {val}
                  </div>
                  {idx < currentStep.list.length - 1 && (
                    <div className="text-xl mx-1">{currentStep.reversed[idx] ? '←' : '→'}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary/20 border-2 border-primary"></div>Current</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-accent/20 border-2 border-accent"></div>Prev</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-secondary/20 border-2 border-secondary"></div>Next</div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm animate-fade-in">{currentStep.message}</div>
            <div className="mt-4 animate-fade-in">
              <VariablePanel
                variables={{
                  step: `${currentStepIndex + 1}/${steps.length}`,
                  prev: currentStep.prev !== null ? `Node ${currentStep.prev + 1}` : 'null',
                  current: currentStep.current !== null ? `Node ${currentStep.current + 1}` : 'null',
                  next: currentStep.next !== null ? `Node ${currentStep.next + 1}` : 'null',
                }}
              />
            </div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript</h3>
          <div className="flex-1 overflow-auto animate-fade-in">
            <AnimatedCodeEditor code={code} language="typescript" highlightedLines={[currentStep.lineNumber]} />
          </div>
        </Card>
      </div>
    </div>
  );
};
