import React, { useState, useMemo } from "react";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { ArrowRight, Box } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  l1: number[];
  l2: number[];
  result: number[];
  l1Index: number;
  l2Index: number;
  carry: number;
  v1: number | null;
  v2: number | null;
  sum: number | null;
  message: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  let carry = 0;
  while (l1 || l2 || carry) {
    const v1 = l1 ? l1.val : 0;
    const v2 = l2 ? l2.val : 0;
    let sum = v1 + v2 + carry;
    carry = Math.floor(sum / 10);
    sum = sum % 10;
    cur.next = new ListNode(sum);
    cur = cur.next;
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
  }
  return dummy.next;
}`,
  python: `def addTwoNumbers(l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
    dummy = ListNode(0)
    current = dummy
    carry = 0
    while l1 or l2 or carry:
        v1 = l1.val if l1 else 0
        v2 = l2.val if l2 else 0
        total_sum = v1 + v2 + carry
        carry = total_sum // 10
        digit = total_sum % 10
        current.next = ListNode(digit)
        current = current.next
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    return dummy.next`,
  java: `public static class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int v1 = (l1 != null) ? l1.val : 0;
            int v2 = (l2 != null) ? l2.val : 0;
            int sum = v1 + v2 + carry;
            carry = sum / 10;
            sum = sum % 10;
            current.next = new ListNode(sum);
            current = current.next;
            if (l1 != null) {
                l1 = l1.next;
            }
            if (l2 != null) {
                l2 = l2.next;
            }
        }
        return dummy.next;
    }
}`,
  cpp: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* dummyHead = new ListNode(0);
        ListNode* current = dummyHead;
        int carry = 0;
        while (l1 != nullptr || l2 != nullptr || carry != 0) {
            int val1 = (l1 != nullptr) ? l1->val : 0;
            int val2 = (l2 != nullptr) ? val2->val : 0;
            int sum = val1 + val2 + carry;
            carry = sum / 10;
            int digit = sum % 10;
            current->next = new ListNode(digit);
            current = current->next;
            if (l1 != nullptr) {
                l1 = l1->next;
            }
            if (l2 != nullptr) {
                l2 = l2->next;
            }
        }
        ListNode* resultHead = dummyHead->next;
        return resultHead;
    }
};`
};

export const AddTwoNumbersVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const l1 = useMemo(() => [2, 4, 3], []);
  const l2 = useMemo(() => [5, 6, 4], []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const result = [0];
    let carry = 0;
    let l1Index = 0;
    let l2Index = 0;
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const addStep = (
      hL1: number,
      hL2: number,
      explanation: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        l1,
        l2,
        result: [...result],
        l1Index: hL1,
        l2Index: hL2,
        carry,
        v1: vars.v1 !== undefined ? vars.v1 : null,
        v2: vars.v2 !== undefined ? vars.v2 : null,
        sum: vars.sum !== undefined ? vars.sum : null,
        message: explanation,
        pseudoStep: pseudo
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      0, 0,
      "We have two numbers stored as chains of boxes (Linked Lists). They are stored backward! The first box is the ones place. Let's add them box by box.",
      "addTwoNumbers(l1, l2)",
      { },
      1, 1, 2, 3
    );

    addStep(
      0, 0,
      "First, we create a 'dummy' box with a 0 to start our new answer chain.",
      "SET dummy = ListNode(0), current = dummy",
      { },
      2, 2, 3, 4
    );

    addStep(
      0, 0,
      "We get ready to track any 'carry-over' if our addition goes over 9.",
      "SET carry = 0",
      { carry },
      4, 4, 5, 6
    );

    while (l1Index < l1.length || l2Index < l2.length || carry > 0) {
      addStep(
        l1Index, l2Index,
        "As long as there are boxes left in either chain, or we have a carry-over, we keep going!",
        `WHILE l1 OR l2 OR carry  →  ${l1Index < l1.length ? 'l1' : 'None'} OR ${l2Index < l2.length ? 'l2' : 'None'} OR carry=${carry}`,
        { carry },
        5, 5, 6, 7
      );

      const v1 = l1Index < l1.length ? l1[l1Index] : 0;
      const v2 = l2Index < l2.length ? l2[l2Index] : 0;

      addStep(
        l1Index, l2Index,
        `We look at the current boxes. Chain 1 has ${l1Index < l1.length ? v1 : 'nothing (so 0)'}. Chain 2 has ${l2Index < l2.length ? v2 : 'nothing (so 0)'}.`,
        `SET v1 = l1.val if l1 else 0  →  ${v1}; v2 = l2.val if l2 else 0  →  ${v2}`,
        { v1, v2, carry },
        6, 6, 7, 8
      );

      const sum = v1 + v2 + carry;
      
      addStep(
        l1Index, l2Index,
        `We add them together along with our carry! ${v1} + ${v2} + ${carry} (carry) = ${sum}.`,
        `SET sum = v1 + v2 + carry  →  ${sum}`,
        { v1, v2, sum, carry },
        8, 8, 9, 10
      );

      carry = Math.floor(sum / 10);
      const digit = sum % 10;

      addStep(
        l1Index, l2Index,
        `Since a box can only hold one digit (0-9), our new box will hold ${digit}, and we will carry over ${carry} to the next round!`,
        `SET carry = sum // 10  →  ${carry}; digit = sum % 10  →  ${digit}`,
        { v1, v2, sum, carry, digit },
        9, 9, 10, 11
      );

      result.push(digit);

      addStep(
        l1Index, l2Index,
        `We attach the new box (${digit}) to our answer chain!`,
        `current.next = ListNode(${digit})`,
        { v1, v2, sum, carry, digit },
        11, 11, 12, 13
      );

      if (l1Index < l1.length) l1Index++;
      if (l2Index < l2.length) l2Index++;

      addStep(
        l1Index, l2Index,
        `Now we move our focus to the next boxes in line.`,
        "SET current = current.next; l1 = l1.next; l2 = l2.next",
        { v1, v2, sum, carry },
        12, 12, 13, 14
      );
    }

    addStep(
      l1Index, l2Index,
      "We're out of boxes and have no carry-overs left! Our new answer chain is complete. We return it, skipping the first 'dummy' box we made.",
      `RETURN dummy.next  →  [${result.slice(1).join(", ")}]`,
      { carry },
      16, 15, 21, 22
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [l1, l2]);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const renderLinkedList = (list: number[], currentIndex: number, label: string, colorClass: string, activeColorClass: string) => {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground">{label}</h4>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {list.map((val, idx) => (
            <React.Fragment key={idx}>
              <div
                className={"w-10 h-10 flex flex-col items-center justify-center text-base font-bold rounded-lg border-2 shadow-sm transition-all " + (idx === currentIndex ? activeColorClass : colorClass)}
              >
                {val}
              </div>
              {idx < list.length - 1 && (
                <ArrowRight className={"w-4 h-4 " + (idx === currentIndex ? "text-primary animate-pulse" : "text-muted-foreground/50")} />
              )}
            </React.Fragment>
          ))}
          {currentIndex >= list.length && (
            <React.Fragment>
               <ArrowRight className="w-4 h-4 text-primary" />
               <div className="text-sm font-mono text-muted-foreground px-2 py-1 bg-muted/30 rounded border border-dashed">null</div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="bg-card rounded-lg p-6 border shadow-sm flex flex-col">
          <div className="mb-4">
             {renderLinkedList(
                step.l1, 
                step.l1Index, 
                "Chain 1 (l1)", 
                "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
                "bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-110 z-10 dark:bg-blue-600 dark:border-blue-50 dark:text-white"
             )}
             
             {renderLinkedList(
                step.l2, 
                step.l2Index, 
                "Chain 2 (l2)", 
                "bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
                "bg-green-500 text-white border-green-600 shadow-md shadow-green-500/30 scale-110 z-10 dark:bg-green-600 dark:border-green-50 dark:text-white"
             )}
          </div>

          <div className="mb-4 flex items-center gap-4 bg-yellow-50/50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
             <div className="flex-1">
               <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-500 mb-1">Carry Over</h4>
               <p className="text-xs text-yellow-700/80 dark:text-yellow-600">Added to the next round</p>
             </div>
             <div className={"w-12 h-12 flex items-center justify-center text-2xl font-black rounded-lg transition-all " + (step.carry > 0 ? "bg-yellow-400 text-yellow-900 shadow-md scale-110" : "bg-muted text-muted-foreground")}>
                {step.carry}
             </div>
          </div>

          <div className="mb-6">
             <div className="p-4 bg-muted/20 border rounded-xl">
               <h4 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                 <Box className="w-4 h-4" /> Result Answer Chain
               </h4>
               <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {step.result.map((val, idx) => (
                    <React.Fragment key={idx}>
                      <div
                        className={"w-10 h-10 flex items-center justify-center text-base font-bold rounded-lg border-2 shadow-sm transition-all " + (idx === 0 ? "bg-gray-100 text-gray-500 border-gray-300 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-800" : idx === step.result.length - 1 ? "bg-purple-500 text-white border-purple-600 shadow-md shadow-purple-500/30 scale-110 animate-in zoom-in z-10 dark:bg-purple-600 dark:border-purple-50 dark:text-white font-bold animate-pulse" : "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900")}
                        title={idx === 0 ? "Dummy Node" : `Value: ${val}`}
                      >
                        {val}
                      </div>
                      {idx < step.result.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                      )}
                    </React.Fragment>
                  ))}
               </div>
             </div>
          </div>
          <Card className="p-4 bg-primary/5 border border-primary/20 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.message}</p>
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
          <VariablePanel
            variables={{
              "v1 (Chain 1)": step.v1 !== null ? step.v1 : "null",
              "v2 (Chain 2)": step.v2 !== null ? step.v2 : "null",
              "sum (v1+v2+carry)": step.sum !== null ? step.sum : "null",
              "carry": step.carry,
            }}
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
export default AddTwoNumbersVisualization;
