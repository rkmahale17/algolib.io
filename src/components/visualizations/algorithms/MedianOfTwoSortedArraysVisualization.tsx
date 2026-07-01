import React, { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  A: number[];
  B: number[];
  i: number;
  j: number;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  let A = nums1;
  let B = nums2;
  const total = A.length + B.length;
  const half = Math.floor(total / 2);
  if (B.length < A.length) {
    [A, B] = [B, A];
  }
  let l = 0;
  let r = A.length - 1;
  while (true) {
    const i = Math.floor((l + r) / 2);
    const j = half - i - 2;
    const Aleft = i >= 0 ? A[i] : -Infinity;
    const Aright = i + 1 < A.length ? A[i + 1] : Infinity;
    const Bleft = j >= 0 ? B[j] : -Infinity;
    const Bright = j + 1 < B.length ? B[j + 1] : Infinity;
    if (Aleft <= Bright && Bleft <= Aright) {
      if (total % 2) {
        return Math.min(Aright, Bright);
      }
      return (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2;
    } else if (Aleft > Bright) {
      r = i - 1;
    } else {
      l = i + 1;
    }
  }
}`,
  python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    A, B = nums1, nums2
    total = len(A) + len(B)
    half = total // 2
    if len(B) < len(A):
        A, B = B, A
    l, r = 0, len(A) - 1
    while True:
        i = (l + r) // 2
        j = half - i - 2
        Aleft = A[i] if i >= 0 else -math.inf
        Aright = A[i + 1] if (i + 1) < len(A) else math.inf
        Bleft = B[j] if j >= 0 else -math.inf
        Bright = B[j + 1] if (j + 1) < len(B) else math.inf
        if Aleft <= Bright and Bleft <= Aright:
            if total % 2:
                return min(Aright, Bright)
            else:
                return (max(Aleft, Bleft) + min(Aright, Bright)) / 2.0
        elif Aleft > Bright:
            r = i - 1
        else:
            l = i + 1`,
  java: `public static class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int[] A = nums1;
        int[] B = nums2;
        int m = A.length;
        int n = B.length;
        if (m > n) {
            int[] temp = A;
            A = B;
            B = temp;
            int tempLen = m;
            m = n;
            n = tempLen;
        }
        int totalLength = m + n;
        int halfPartLength = (totalLength + 1) / 2;
        int low = 0;
        int high = m;
        while (low <= high) {
            int cutA = low + (high - low) / 2;
            int cutB = halfPartLength - cutA;
            long Aleft = (cutA == 0) ? -1000001L : A[cutA - 1];
            long Aright = (cutA == m) ? 1000001L : A[cutA];
            long Bleft = (cutB == 0) ? -1000001L : B[cutB - 1];
            long Bright = (cutB == n) ? 1000001L : B[cutB];
            if (Aleft <= Bright && Bleft <= Aright) {
                if (totalLength % 2 == 1) {
                    return (double) Math.max(Aleft, Bleft);
                } else {
                    return (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2.0;
                }
            } else if (Aleft > Bright) {
                high = cutA - 1;
            } else {
                low = cutA + 1;
            }
        }
        return 0.0;
    }
}`,
  cpp: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        vector<int>* pA = &nums1;
        vector<int>* pB = &nums2;
        int m = pA->size();
        int n = pB->size();
        if (m > n) {
            swap(pA, pB);
            swap(m, n);
        }
        vector<int>& A = *pA;
        vector<int>& B = *pB;
        int totalLength = m + n;
        int halfPartLength = (totalLength + 1) / 2;
        int low = 0;
        int high = m;
        while (low <= high) {
            int cutA = low + (high - low) / 2;
            int cutB = halfPartLength - cutA;
            long Aleft = (cutA == 0) ? -1000001L : A[cutA - 1];
            long Aright = (cutA == m) ? 1000001L : A[cutA];
            long Bleft = (cutB == 0) ? -1000001L : B[cutB - 1];
            long Bright = (cutB == n) ? 1000001L : B[cutB];
            if (Aleft <= Bright && Bleft <= Aright) {
                if (totalLength % 2 == 1) {
                    return static_cast<double>(max(Aleft, Bleft));
                } else {
                    return static_cast<double>(max(Aleft, Bleft) + min(Aright, Bright)) / 2.0;
                }
            } else if (Aleft > Bright) {
                high = cutA - 1;
            } else {
                low = cutA + 1;
            }
        }
        return 0.0;
    }
};`
};

export const MedianOfTwoSortedArraysVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nums1 = useMemo(() => [1, 3, 8, 9, 15], []);
  const nums2 = useMemo(() => [7, 11, 18, 19, 21, 25], []);

  const formatInf = (val: number) => {
    if (val === -Infinity || val < -100000) return '-∞';
    if (val === Infinity || val > 100000) return '∞';
    return val;
  };

  const { steps, stepLineNumbers } = useMemo(() => {
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    let A = [...nums1];
    let B = [...nums2];
    let i_val = -2;
    let j_val = -2;

    const addStep = (
      exp: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        A: [...A],
        B: [...B],
        i: i_val,
        j: j_val,
        variables: { ...vars },
        explanation: exp,
        pseudoStep: pseudo
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    let vars: any = { A: 'nums1', B: 'nums2' };

    addStep(
      `Initialize pointers to our arrays A and B.`,
      "findMedianSortedArrays(nums1, nums2)",
      vars,
      1, 1, 2, 3
    );
    
    const total = A.length + B.length;
    const half = Math.floor(total / 2);
    vars = { ...vars, total, half };
    
    addStep(
      `Calculate total length (${total}) and the target half length (${half}) for the left partition.`,
      "SET total = len(A) + len(B), half = total // 2",
      vars,
      4, 3, 15, 14
    );

    addStep(
      `Check if B is shorter than A to optimize binary search on the smaller array.`,
      "IF len(B) < len(A)",
      vars,
      6, 5, 7, 8
    );
    if (B.length < A.length) {
      [A, B] = [B, A];
      addStep(
        `Swapped A and B so A is the shorter array.`,
        "SET A, B = B, A",
        vars,
        7, 6, 8, 9
      );
    }

    let l = 0;
    let r = A.length - 1;
    vars = { ...vars, l, r };
    addStep(
      `Initialize binary search bounds l=${l} and r=${r} for array A.`,
      "SET l = 0, r = len(A) - 1",
      vars,
      9, 7, 17, 16
    );

    let maxIters = 20;
    while (maxIters-- > 0) {
      addStep(
        `Start binary search iteration.`,
        "WHILE True",
        vars,
        11, 8, 19, 18
      );
      
      const i = Math.floor((l + r) / 2);
      i_val = i;
      vars = { ...vars, i };
      
      const j = half - i - 2;
      j_val = j;
      vars = { ...vars, j };
      
      addStep(
        `Calculate partition indices: i = floor((l+r)/2) = ${i}. j = half-i-2 = ${j}.`,
        `SET i = (l + r) // 2  →  ${i}; j = half - i - 2  →  ${j}`,
        vars,
        12, 9, 20, 19
      );

      const Aleft = i >= 0 ? A[i] : -Infinity;
      const Aright = i + 1 < A.length ? A[i + 1] : Infinity;
      const Bleft = j >= 0 ? B[j] : -Infinity;
      const Bright = j + 1 < B.length ? B[j + 1] : Infinity;
      vars = {
        ...vars,
        Aleft: formatInf(Aleft),
        Aright: formatInf(Aright),
        Bleft: formatInf(Bleft),
        Bright: formatInf(Bright)
      };

      addStep(
        `Define boundary variables. Aleft=${formatInf(Aleft)}, Aright=${formatInf(Aright)}, Bleft=${formatInf(Bleft)}, Bright=${formatInf(Bright)}.`,
        "SET Aleft, Aright, Bleft, Bright",
        vars,
        14, 11, 22, 21
      );

      addStep(
        `Check partition validity: Is Aleft (${formatInf(Aleft)}) <= Bright (${formatInf(Bright)}) AND Bleft (${formatInf(Bleft)}) <= Aright (${formatInf(Aright)})?`,
        `IF Aleft <= Bright AND Bleft <= Aright  →  ${Aleft <= Bright} AND ${Bleft <= Aright}`,
        vars,
        18, 15, 26, 25
      );

      if (Aleft <= Bright && Bleft <= Aright) {
        addStep(
          `Partition is valid! We have correctly divided the merged arrays.`,
          "// Partition correct",
          vars,
          18, 15, 26, 25
        );
        if (total % 2) {
          const median = Math.min(Aright, Bright);
          vars = { ...vars, median };
          addStep(
            `Total length is odd. The median is the smallest element in the right partition: min(${formatInf(Aright)}, ${formatInf(Bright)}) = ${median}.`,
            `RETURN min(Aright, Bright)  →  ${median}`,
            vars,
            20, 17, 28, 27
          );
          break;
        } else {
          const maxLeft = Math.max(Aleft, Bleft);
          const minRight = Math.min(Aright, Bright);
          const median = (maxLeft + minRight) / 2;
          vars = { ...vars, maxLeft, minRight, median };
          addStep(
            `Total length is even. The median is the average of max(left) and min(right): (${maxLeft} + ${minRight}) / 2 = ${median}.`,
            `RETURN (max(Aleft, Bleft) + min(Aright, Bright)) / 2  →  ${median}`,
            vars,
            22, 19, 30, 29
          );
          break;
        }
      } else if (Aleft > Bright) {
        r = i - 1;
        vars = { ...vars, r };
        addStep(
          `Aleft (${Aleft}) is greater than Bright (${Bright}). Shift A's partition point i to the left: r = ${r}.`,
          `SET r = i - 1  →  ${r}`,
          vars,
          24, 21, 33, 32
        );
      } else {
        l = i + 1;
        vars = { ...vars, l };
        addStep(
          `Bleft (${Bleft}) is greater than Aright (${Aright}). Shift A's partition point i to the right: l = ${l}.`,
          `SET l = i + 1  →  ${l}`,
          vars,
          26, 23, 35, 34
        );
      }
    }

    return { steps: newSteps, stepLineNumbers: lines };
  }, [nums1, nums2]);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const ArrayRenderer = ({ title, array, partitionIndex }: { title: string, array: number[], partitionIndex: number }) => (
    <div className="mb-4">
      <h3 className="font-semibold text-sm mb-2 text-muted-foreground">{title}</h3>
      <div className="flex items-center flex-wrap gap-x-2 gap-y-4">
        {array.length === 0 && (
          <div className="text-sm text-muted-foreground italic">Empty Array</div>
        )}
        {array.map((value, idx) => {
          const isLeft = idx <= partitionIndex;
          const isBoundaryLeft = idx === partitionIndex;
          const isBoundaryRight = idx === partitionIndex + 1;
          
          return (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                    isLeft ? 'bg-primary/20 border-primary/50' : 'bg-secondary border-border'
                  } ${isBoundaryLeft ? 'ring-2 ring-blue-500' : ''} ${isBoundaryRight ? 'ring-2 ring-amber-500' : ''}`}
                >
                  <span className="font-semibold text-sm">{value}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{idx}</span>
              </div>
              {isBoundaryLeft && idx < array.length - 1 && (
                <div className="mx-1 h-12 w-0.5 bg-destructive rounded-full self-start mt-1"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-hidden relative">
            <ArrayRenderer title="Array A (Shorter)" array={step.A} partitionIndex={step.i} />
            <ArrayRenderer title="Array B (Longer)" array={step.B} partitionIndex={step.j} />
            
            <div className="flex gap-4 mt-3 text-xs mb-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary/20 border border-primary/50"></div>
                <span className="text-muted-foreground">Left Partition</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-secondary border border-border"></div>
                <span className="text-muted-foreground">Right Partition</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-4 bg-destructive rounded-full"></div>
                <span className="text-muted-foreground">Cut Line</span>
              </div>
            </div>

            {step.i >= -1 && (
                <div className="mt-4 p-3 bg-background rounded border text-xs grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 border-r pr-2">
                        <span className="font-semibold text-blue-500">Left Max (Aleft, Bleft)</span>
                        <span>Aleft = {step.variables.Aleft || '-∞'}</span>
                        <span>Bleft = {step.variables.Bleft || '-∞'}</span>
                    </div>
                    <div className="flex flex-col gap-1 pl-2">
                        <span className="font-semibold text-amber-500">Right Min (Aright, Bright)</span>
                        <span>Aright = {step.variables.Aright || '∞'}</span>
                        <span>Bright = {step.variables.Bright || '∞'}</span>
                    </div>
                </div>
            )}
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
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
export default MedianOfTwoSortedArraysVisualization;
