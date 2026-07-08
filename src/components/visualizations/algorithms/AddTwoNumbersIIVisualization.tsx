import React, { useState, useMemo } from "react";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { ArrowRight, Box, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  l1: number[];
  l2: number[];
  s1: number[];
  s2: number[];
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
  const s1: number[] = [];
  const s2: number[] = [];
  while (l1) {
    s1.push(l1.val);
    l1 = l1.next;
  }
  while (l2) {
    s2.push(l2.val);
    l2 = l2.next;
  }
  let carry = 0;
  let head: ListNode | null = null;
  while (s1.length || s2.length || carry) {
    let sum = carry;
    if (s1.length) sum += s1.pop()!;
    if (s2.length) sum += s2.pop()!;
    const node = new ListNode(sum % 10);
    node.next = head;
    head = node;
    carry = Math.floor(sum / 10);
  }
  return head;
}`,
  python: `def addTwoNumbers(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
    s1 = []
    s2 = []
    while l1:
        s1.append(l1.val)
        l1 = l1.next
    while l2:
        s2.append(l2.val)
        l2 = l2.next
    carry = 0
    head = None
    while s1 or s2 or carry:
        current_sum = carry
        if s1:
            current_sum += s1.pop()
        if s2:
            current_sum += s2.pop()
        node = ListNode(current_sum % 10)
        node.next = head
        head = node
        carry = current_sum // 10
    return head`,
  java: `public static class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        Stack<Integer> s1 = new Stack<>();
        Stack<Integer> s2 = new Stack<>();
        while (l1 != null) {
            s1.push(l1.val);
            l1 = l1.next;
        }
        while (l2 != null) {
            s2.push(l2.val);
            l2 = l2.next;
        }
        int carry = 0;
        ListNode head = null;
        while (!s1.isEmpty() || !s2.isEmpty() || carry != 0) {
            int sum = carry;
            if (!s1.isEmpty()) {
                sum += s1.pop();
            }
            if (!s2.isEmpty()) {
                sum += s2.pop();
            }
            ListNode newNode = new ListNode(sum % 10);
            newNode.next = head;
            head = newNode;
            carry = sum / 10;
        }
        return head;
    }
}`,
  cpp: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        stack<int> s1;
        stack<int> s2;
        while (l1) {
            s1.push(l1->val);
            l1 = l1->next;
        }
        while (l2) {
            s2.push(l2->val);
            l2 = l2->next;
        }
        int carry = 0;
        ListNode* head = nullptr;
        while (!s1.empty() || !s2.empty() || carry) {
            int sum = carry;
            if (!s1.empty()) {
                sum += s1.top();
                s1.pop();
            }
            if (!s2.empty()) {
                sum += s2.top();
                s2.pop();
            }
            ListNode* node = new ListNode(sum % 10);
            node->next = head;
            head = node;
            carry = sum / 10;
        }
        return head;
    }
};`
};

export const AddTwoNumbersIIVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const l1 = useMemo(() => [7, 2, 4, 3], []);
  const l2 = useMemo(() => [5, 6, 4], []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s1: number[] = [];
    const s2: number[] = [];
    const result: number[] = [];
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
        s1: [...s1],
        s2: [...s2],
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
      "We have two numbers stored as chains of boxes (Linked Lists). In this problem, they are stored in normal order (Most Significant Digit first).",
      "addTwoNumbers(l1, l2)",
      {},
      1, 1, 2, 3
    );

    addStep(
      0, 0,
      "To add from the rightmost (least significant) digits first, we use two Stacks. A stack is Last-In, First-Out, reversing the order.",
      "SET s1 = [], s2 = []",
      {},
      2, 2, 3, 4
    );

    while (l1Index < l1.length) {
      addStep(
        l1Index, 0,
        `We traverse Chain 1. Pushing ${l1[l1Index]} onto stack s1.`,
        `WHILE l1: s1.push(l1.val)`,
        {},
        4, 4, 5, 6
      );
      s1.push(l1[l1Index]);
      addStep(
        l1Index, 0,
        `Stack s1 now has ${s1.length} items. We move to the next box in Chain 1.`,
        `SET s1.push(${l1[l1Index]}); l1 = l1.next`,
        {},
        5, 5, 6, 7
      );
      l1Index++;
    }

    addStep(
      l1Index, 0,
      `Chain 1 is fully traversed and pushed to s1.`,
      `END WHILE l1`,
      {},
      4, 4, 5, 6
    );

    while (l2Index < l2.length) {
      addStep(
        l1Index, l2Index,
        `We traverse Chain 2. Pushing ${l2[l2Index]} onto stack s2.`,
        `WHILE l2: s2.push(l2.val)`,
        {},
        8, 7, 9, 10
      );
      s2.push(l2[l2Index]);
      addStep(
        l1Index, l2Index,
        `Stack s2 now has ${s2.length} items. We move to the next box in Chain 2.`,
        `SET s2.push(${l2[l2Index]}); l2 = l2.next`,
        {},
        9, 8, 10, 11
      );
      l2Index++;
    }

    addStep(
      l1Index, l2Index,
      `Chain 2 is fully traversed and pushed to s2.`,
      `END WHILE l2`,
      {},
      8, 7, 9, 10
    );

    addStep(
      l1Index, l2Index,
      "We initialize our carry-over to 0, and our new result list's head to null.",
      "SET carry = 0, head = null",
      { carry },
      12, 10, 13, 14
    );

    while (s1.length > 0 || s2.length > 0 || carry > 0) {
      addStep(
        l1Index, l2Index,
        `We loop as long as either stack has items left, or we have a carry.`,
        `WHILE s1 OR s2 OR carry`,
        { carry },
        14, 12, 15, 16
      );

      let sum = carry;
      let v1 = 0;
      let v2 = 0;

      addStep(
        l1Index, l2Index,
        `We start with the carry from the previous position: ${carry}.`,
        `SET sum = carry  →  ${sum}`,
        { carry, sum },
        15, 13, 16, 17
      );

      if (s1.length > 0) {
        v1 = s1.pop() as number;
        sum += v1;
        addStep(
          l1Index, l2Index,
          `We pop from s1: ${v1}. Add it to our sum.`,
          `IF s1: sum += s1.pop()  →  ${sum}`,
          { carry, v1, sum },
          16, 14, 17, 18
        );
      }

      if (s2.length > 0) {
        v2 = s2.pop() as number;
        sum += v2;
        addStep(
          l1Index, l2Index,
          `We pop from s2: ${v2}. Add it to our sum.`,
          `IF s2: sum += s2.pop()  →  ${sum}`,
          { carry, v1, v2, sum },
          17, 16, 20, 22
        );
      }

      const digit = sum % 10;
      const nextCarry = Math.floor(sum / 10);

      addStep(
        l1Index, l2Index,
        `Our total sum is ${sum}. We take the last digit ${digit} for the new node.`,
        `SET node = ListNode(sum % 10)  →  ${digit}`,
        { carry, v1, v2, sum },
        18, 18, 23, 26
      );

      result.unshift(digit);

      addStep(
        l1Index, l2Index,
        `We prepend the new node (${digit}) to our result list to build it right-to-left!`,
        `node.next = head; head = node`,
        { carry, v1, v2, sum },
        19, 19, 24, 27
      );

      carry = nextCarry;

      addStep(
        l1Index, l2Index,
        `We calculate the new carry for the next round: ${carry}.`,
        `SET carry = sum // 10  →  ${carry}`,
        { carry, v1, v2, sum },
        21, 21, 26, 29
      );
    }

    addStep(
      l1Index, l2Index,
      "Both stacks are empty and we have no carry left! Our result list is complete.",
      `RETURN head  →  [${result.join(", ")}]`,
      { carry },
      23, 22, 28, 31
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [l1, l2]);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const renderLinkedList = (list: number[], currentIndex: number, label: string, colorClass: string, activeColorClass: string, hideArrowAfterActive = false) => {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground">{label}</h4>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {list.map((val, idx) => (
            <React.Fragment key={idx}>
              <div
                className={"w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg border-2 shadow-sm transition-all duration-500 ease-in-out " + (idx === currentIndex ? activeColorClass : idx < currentIndex ? "bg-muted text-muted-foreground border-border" : colorClass)}
              >
                {val}
              </div>
              {idx < list.length - 1 && (
                <ArrowRight className={"w-4 h-4 transition-all duration-500 " + (idx === currentIndex && !hideArrowAfterActive ? "text-primary scale-125 stroke-[3px]" : "text-muted-foreground/50")} />
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

  const renderStack = (stack: number[], label: string, colorClass: string) => {
    return (
      <div className="flex flex-col items-center">
        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">{label}</h4>
        <div className="w-16 min-h-[120px] border-b-4 border-x-2 border-border rounded-b-xl flex flex-col-reverse justify-start p-1 gap-1 bg-muted/10 relative">
          {stack.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground italic">empty</div>
          )}
          {stack.map((val, idx) => (
            <div
              key={`stack-${idx}`}
              className={`w-full h-8 flex items-center justify-center text-sm font-bold rounded shadow-sm transition-all duration-500 ease-in-out ${colorClass} animate-in slide-in-from-top-4`}
            >
              {val}
            </div>
          ))}
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

          <div className="mb-6 grid grid-cols-2 gap-4 max-w-[200px] mx-auto">
             {renderStack(step.s1, "Stack 1 (s1)", "bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700")}
             {renderStack(step.s2, "Stack 2 (s2)", "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700")}
          </div>

          <div className="mb-4 flex items-center gap-4 bg-yellow-50/50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
             <div className="flex-1">
               <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-500 mb-1">Carry Over</h4>
               <p className="text-xs text-yellow-700/80 dark:text-yellow-600">Added to the next round</p>
             </div>
             <div className={"w-12 h-12 flex items-center justify-center text-2xl font-black rounded-lg transition-all duration-500 ease-in-out " + (step.carry > 0 ? "bg-yellow-400 text-yellow-900 shadow-md scale-110" : "bg-muted text-muted-foreground")}>
                {step.carry}
             </div>
          </div>

          <div className="mb-6">
             <div className="p-4 bg-muted/20 border rounded-xl">
               <h4 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                 <Box className="w-4 h-4" /> Result Answer Chain (Built right-to-left)
               </h4>
               <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {step.result.length === 0 && (
                     <div className="text-sm italic text-muted-foreground">Empty</div>
                  )}
                  {step.result.map((val, idx) => (
                    <React.Fragment key={`result-${step.result.length - idx}`}>
                      <div
                        className={"w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg border-2 shadow-sm transition-all duration-500 ease-in-out " + (idx === 0 ? "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/40 ring-4 ring-purple-500/20 scale-110 animate-in zoom-in z-10 dark:bg-purple-600 dark:border-purple-500 dark:text-white" : "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900")}
                        title={`Value: ${val}`}
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
              "v1 (popped s1)": step.v1 !== null ? step.v1 : "null",
              "v2 (popped s2)": step.v2 !== null ? step.v2 : "null",
              "sum": step.sum !== null ? step.sum : "null",
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
export default AddTwoNumbersIIVisualization;
