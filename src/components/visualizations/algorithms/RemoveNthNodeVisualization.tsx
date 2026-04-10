import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface Step {
  list: number[];
  left: number | null; // index mapping relative to `list` (-1 means dummy)
  right: number | null; // index mapping relative to `list`
  nVar: number;
  message: string;
  lineNumber: number;
  isMatch?: boolean;
  toRemove: number | null;
  removed: boolean;
}

export const RemoveNthNodeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let left: ListNode | null = dummy;
  let right: ListNode | null = head;

  while (n > 0 && right !== null) {
    right = right.next;
    n -= 1;
  }

  while (right !== null) {
    left = left!.next;
    right = right.next;
  }

  left!.next = left!.next!.next;
  return dummy.next;
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const list = [1, 2, 3, 4, 5];
    const targetN = 2;
    
    let nVar = targetN;
    let left: number | null = null;
    let right: number | null = null;
    
    const snap = (msg: string, line: number, isMatch: boolean = false, toRemove: number | null = null, removed: boolean = false, overrideList?: number[]) => {
      s.push({
        list: overrideList ? [...overrideList] : [...list],
        left,
        right: right !== null && right >= list.length ? null : right,
        nVar,
        message: msg,
        lineNumber: line,
        isMatch,
        toRemove,
        removed
      });
    };

    snap(`Execution starts.`, 1, false);

    snap(`Initialize dummy node to handle potential head removals natively.`, 2, false);
    
    left = -1;
    snap(`Set left pointer anchoring securely to the initialized dummy Node.`, 3, false);

    right = 0;
    snap(`Initialize right pointer bounds matching the core head of the list.`, 4, false);

    while (true) {
        snap(`Verifying span constraints. Processing while loop requirement: n (${nVar}) > 0 AND right is valid.`, 6, false);
        if (nVar > 0 && right !== null && right < list.length) {
            right += 1;
            snap(`Evaluated true. Shifted right pointer forward 1 span segment.`, 7, false);
            nVar -= 1;
            snap(`Decremented spacing constraint 'n' tracking variable to ${nVar}.`, 8, true);
        } else {
            snap(`Evaluated false. Distance constraint span requirement safely established! Breaking span loop.`, 6, false);
            break;
        }
    }
    
    while (true) {
        snap(`Verifying dual sweep conditions: Does right limit pointer exist?`, 11, false);
        if (right !== null && right < list.length) {
            left += 1;
            snap(`Sweep evaluated true. Progressing left pointer.`, 12, false);
            right += 1;
            snap(`Progressing right pointer synchronously maintaining exact constraint gap!`, 13, true);
        } else {
            snap(`Sweep evaluated false! Right pointer breached final null bounding box. Processing halted.`, 11, false);
            break;
        }
    }

    const toRemoveTarget = left! + 1;
    snap(`Left pointer arrived prior to the deletion target safely. Processing next chain mapping detatch.`, 16, true, toRemoveTarget, false);

    const resultList = [...list];
    resultList.splice(toRemoveTarget, 1);
    
    snap(`Node detached perfectly. Return resulting dummy chained bounds!`, 17, true, null, true, resultList);

    return s;
  }, []);

  const step = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
            <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-widest text-center">
              Pointers Topology Reference
            </h3>
            <div className="flex flex-col gap-6 p-4">
              <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-8 pb-4 pt-6">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground uppercase">{step.left === -1 ? 'L' : ''}</span>
                    <div className={`w-8 h-8 flex items-center justify-center rounded border-2 border-dashed font-bold text-xs transition-all shadow-sm ${step.left === -1 ? 'bg-primary/20 border-primary text-primary shadow-primary/20 scale-110' : 'bg-muted/30 border-muted-foreground text-muted-foreground opacity-50'}`}>
                      D
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 mx-1 text-muted-foreground opacity-50" />
                  
                  {step.list.map((val, idx) => {
                    const isLeft = step.left === (step.removed && idx >= step.toRemove! ? idx + 1 : idx);
                    const isRight = step.right === (step.removed && idx >= step.toRemove! ? idx + 1 : idx);
                    const isRemovedTarget = step.toRemove === idx && !step.removed;

                    return (
                        <div key={idx} className="flex items-center">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-muted-foreground uppercase w-10 text-center overflow-visible whitespace-nowrap">
                                {isLeft && isRight ? 'L,R' : isLeft ? 'L' : isRight ? 'R' : ''}
                            </span>
                            <div
                            className={`w-8 h-8 flex items-center justify-center rounded border-2 font-bold text-sm transition-all shadow-sm ${
                                isRemovedTarget
                                ? 'bg-destructive/20 border-destructive text-destructive scale-110 shadow-destructive/20'
                                : isLeft && isRight
                                ? 'bg-gradient-to-br from-primary/30 to-secondary/30 border-primary text-primary shadow-primary/20'
                                : isLeft
                                ? 'bg-primary/20 border-primary text-primary shadow-primary/20 scale-110'
                                : isRight
                                ? 'bg-secondary/20 border-secondary text-secondary-foreground shadow-secondary/20 scale-110'
                                : 'bg-card border-border text-foreground'
                            }`}
                            >
                            {val}
                            </div>
                        </div>
                        {idx < step.list.length - 1 && (
                            <ArrowRight className={`w-3 h-3 mx-1 transition-all ${step.removed && step.toRemove === idx ? 'text-destructive scale-125' : 'text-muted-foreground opacity-50'}`} />
                        )}
                        </div>
                    );
                  })}
                  
                  <ArrowRight className="w-3 h-3 mx-1 text-muted-foreground opacity-50" />
                  <div className="relative flex items-center justify-center">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-muted-foreground uppercase">{step.right === null && step.left !== null ? 'R' : ''}</span>
                    <div className={`w-8 h-8 px-1 flex items-center justify-center rounded border-2 border-dashed font-bold text-[10px] transition-all shadow-sm ${step.right === null && step.left !== null ? 'bg-secondary/20 border-secondary text-secondary-foreground shadow-secondary/20 scale-110' : 'bg-muted/30 border-muted-foreground text-muted-foreground opacity-30'}`}>
                      NUL
                    </div>
                  </div>
              </div>

              <div className="flex gap-4 text-xs font-mono justify-center items-center flex-wrap pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-primary/10 border border-primary/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    <span className="text-primary font-bold text-[10px] uppercase tracking-wider">Left Pointer</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-secondary/10 border border-secondary/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                    <span className="text-secondary-foreground font-bold text-[10px] uppercase tracking-wider">Right Pointer</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-destructive/10 border border-destructive/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-destructive font-bold text-[10px] uppercase tracking-wider">To Remove</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm flex items-center ${step?.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${step?.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                {step?.isMatch ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Execution Detail Tracker
                </h4>
                <p className="text-xs font-medium leading-relaxed text-foreground/90 leading-tight">
                  {step?.message || ''}
                </p>
              </div>
            </div>
          </Card>

          <VariablePanel
            variables={{
              "n": step.nVar,
              "left": step.left === -1 ? 'dummy node [val: 0]' : step.left !== null ? `node[${step.left}] -> ${step.list[step.left]}` : 'null',
              "right": step.right !== null ? `node[${step.right}] -> ${step.list[step.right]}` : 'null',
            }}
          />
        </div>
      }
      rightContent={
        <div className="space-y-4 h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[step?.lineNumber || 1]}
            language="typescript"
          />
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
