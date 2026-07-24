'use client';

import { useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums1: number[];
  nums2: number[];
  p1: number;
  p2: number;
  p: number;
  highlights1: number[];
  highlights2: number[];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

// ─── Hardcoded code per language (no comments) ────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    let p1 = m - 1;
    let p2 = n - 1;
    let p = m + n - 1;
    while (p1 >= 0 && p2 >= 0) {
        if (nums1[p1] > nums2[p2]) {
            nums1[p] = nums1[p1];
            p1--;
        } else {
            nums1[p] = nums2[p2];
            p2--;
        }
        p--;
    }
    while (p2 >= 0) {
        nums1[p] = nums2[p2];
        p2--;
        p--;
    }
}`,

  python: `def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    p1 = m - 1
    p2 = n - 1
    write_ptr = m + n - 1
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] >= nums2[p2]:
            nums1[write_ptr] = nums1[p1]
            p1 -= 1
        else:
            nums1[write_ptr] = nums2[p2]
            p2 -= 1
        write_ptr -= 1
    while p2 >= 0:
        nums1[write_ptr] = nums2[p2]
        p2 -= 1
        write_ptr -= 1`,

  java: `public void merge(int[] nums1, int m, int[] nums2, int n) {
    int p1 = m - 1;
    int p2 = n - 1;
    int write_idx = m + n - 1;
    while (p1 >= 0 && p2 >= 0) {
        if (nums1[p1] > nums2[p2]) {
            nums1[write_idx] = nums1[p1];
            p1--;
        } else {
            nums1[write_idx] = nums2[p2];
            p2--;
        }
        write_idx--;
    }
    while (p2 >= 0) {
        nums1[write_idx] = nums2[p2];
        p2--;
        write_idx--;
    }
}`,

  cpp: `void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int p1 = m - 1;
    int p2 = n - 1;
    int write_idx = m + n - 1;
    while (p1 >= 0 && p2 >= 0) {
        if (nums1[p1] >= nums2[p2]) {
            nums1[write_idx] = nums1[p1];
            p1--;
        } else {
            nums1[write_idx] = nums2[p2];
            p2--;
        }
        write_idx--;
    }
    while (p2 >= 0) {
        nums1[write_idx] = nums2[p2];
        p2--;
        write_idx--;
    }
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const initialNums1 = [4, 5, 6, 0, 0, 0];
  const m = 3;
  const initialNums2 = [1, 2, 3];
  const n = 3;

  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  let nums1 = [...initialNums1];
  let nums2 = [...initialNums2];
  let p1 = m - 1; // 2
  let p2 = n - 1; // 2
  let p = m + n - 1; // 5

  // Step 1: Initial state / pointers set up
  steps.push({
    nums1: [...nums1],
    nums2: [...nums2],
    p1,
    p2,
    p,
    highlights1: [],
    highlights2: [],
    explanation: `Initialize pointers. p1 = ${p1} (points to last valid element of nums1), p2 = ${p2} (points to last element of nums2), and write pointer p = ${p} (points to the end of nums1's full capacity).`,
    pseudoStep: `SET p1 = m − 1, p2 = n − 1, write_ptr = m + n − 1`,
    variables: {
      p1,
      'nums1[p1]': nums1[p1],
      p2,
      'nums2[p2]': nums2[p2],
      p,
      'nums1[p]': nums1[p]
    }
  });
  addLines(2, 2, 2, 2);

  // Main while loop
  while (p1 >= 0 && p2 >= 0) {
    // Step: Loop condition check
    steps.push({
      nums1: [...nums1],
      nums2: [...nums2],
      p1,
      p2,
      p,
      highlights1: [p1, p],
      highlights2: [p2],
      explanation: `Check loop condition: p1 >= 0 (${p1} >= 0) and p2 >= 0 (${p2} >= 0). Both are true, so continue merging.`,
      pseudoStep: `WHILE p1 ≥ 0 AND p2 ≥ 0  →  ${p1} ≥ 0 AND ${p2} ≥ 0  →  YES ✓`,
      variables: {
        p1,
        'nums1[p1]': nums1[p1],
        p2,
        'nums2[p2]': nums2[p2],
        p,
        'nums1[p]': nums1[p]
      }
    });
    addLines(5, 5, 5, 5);

    // Step: Comparison
    steps.push({
      nums1: [...nums1],
      nums2: [...nums2],
      p1,
      p2,
      p,
      highlights1: [p1],
      highlights2: [p2],
      explanation: `Compare nums1[p1] (${nums1[p1]}) and nums2[p2] (${nums2[p2]}).`,
      pseudoStep: `IF nums1[p1] ≥ nums2[p2]  →  ${nums1[p1]} ≥ ${nums2[p2]}  →  ${nums1[p1] >= nums2[p2] ? 'YES ✓' : 'NO ✗'}`,
      variables: {
        p1,
        'nums1[p1]': nums1[p1],
        p2,
        'nums2[p2]': nums2[p2],
        p,
        'nums1[p]': nums1[p]
      }
    });
    addLines(6, 6, 6, 6);

    if (nums1[p1] >= nums2[p2]) {
      // Step: Copy nums1[p1]
      nums1[p] = nums1[p1];
      steps.push({
        nums1: [...nums1],
        nums2: [...nums2],
        p1,
        p2,
        p,
        highlights1: [p1, p],
        highlights2: [],
        explanation: `Since nums1[p1] (${nums1[p1]}) is larger or equal, copy it to the current write position nums1[${p}].`,
        pseudoStep: `SET nums1[write_ptr] = nums1[p1]  →  nums1[${p}] = ${nums1[p1]}`,
        variables: {
          p1,
          'nums1[p1]': nums1[p1],
          p2,
          'nums2[p2]': nums2[p2],
          p,
          'nums1[p]': nums1[p]
        }
      });
      addLines(7, 7, 7, 7);

      // Step: Decrement p1
      p1--;
      steps.push({
        nums1: [...nums1],
        nums2: [...nums2],
        p1,
        p2,
        p,
        highlights1: p1 >= 0 ? [p1] : [],
        highlights2: [],
        explanation: `Decrement p1 to ${p1} to point to the next element in nums1.`,
        pseudoStep: `DECREMENT p1  →  ${p1}`,
        variables: {
          p1: p1 >= 0 ? p1 : '-',
          'nums1[p1]': p1 >= 0 ? nums1[p1] : '-',
          p2,
          'nums2[p2]': nums2[p2],
          p,
          'nums1[p]': nums1[p]
        }
      });
      addLines(8, 8, 8, 8);
    } else {
      // Step: Copy nums2[p2]
      nums1[p] = nums2[p2];
      steps.push({
        nums1: [...nums1],
        nums2: [...nums2],
        p1,
        p2,
        p,
        highlights1: [p],
        highlights2: [p2],
        explanation: `Since nums2[p2] (${nums2[p2]}) is larger, copy it to the current write position nums1[${p}].`,
        pseudoStep: `SET nums1[write_ptr] = nums2[p2]  →  nums1[${p}] = ${nums2[p2]}`,
        variables: {
          p1,
          'nums1[p1]': nums1[p1],
          p2,
          'nums2[p2]': nums2[p2],
          p,
          'nums1[p]': nums1[p]
        }
      });
      addLines(10, 10, 10, 10);

      // Step: Decrement p2
      p2--;
      steps.push({
        nums1: [...nums1],
        nums2: [...nums2],
        p1,
        p2,
        p,
        highlights1: [],
        highlights2: p2 >= 0 ? [p2] : [],
        explanation: `Decrement p2 to ${p2} to point to the next element in nums2.`,
        pseudoStep: `DECREMENT p2  →  ${p2}`,
        variables: {
          p1,
          'nums1[p1]': nums1[p1],
          p2: p2 >= 0 ? p2 : '-',
          'nums2[p2]': p2 >= 0 ? nums2[p2] : '-',
          p,
          'nums1[p]': nums1[p]
        }
      });
      addLines(11, 11, 11, 11);
    }

    // Step: Decrement write pointer
    p--;
    steps.push({
      nums1: [...nums1],
      nums2: [...nums2],
      p1,
      p2,
      p,
      highlights1: p >= 0 ? [p] : [],
      highlights2: [],
      explanation: `Decrement the write pointer to ${p} to point to the next empty slot from the right.`,
      pseudoStep: `DECREMENT write_ptr  →  ${p}`,
      variables: {
        p1: p1 >= 0 ? p1 : '-',
        'nums1[p1]': p1 >= 0 ? nums1[p1] : '-',
        p2: p2 >= 0 ? p2 : '-',
        'nums2[p2]': p2 >= 0 ? nums2[p2] : '-',
        p: p >= 0 ? p : '-',
        'nums1[p]': p >= 0 ? nums1[p] : '-'
      }
    });
    addLines(13, 12, 13, 13);
  }

  // Step: Loop Condition Check (terminates)
  steps.push({
    nums1: [...nums1],
    nums2: [...nums2],
    p1,
    p2,
    p,
    highlights1: p1 >= 0 ? [p1] : [],
    highlights2: p2 >= 0 ? [p2] : [],
    explanation: `Check loop condition: p1 >= 0 (${p1} >= 0) and p2 >= 0 (${p2} >= 0). Since p1 is ${p1}, this condition is false. Exit the main loop.`,
    pseudoStep: `WHILE p1 ≥ 0 AND p2 ≥ 0  →  ${p1} ≥ 0 AND ${p2} ≥ 0  →  NO ✗`,
    variables: {
      p1: p1 >= 0 ? p1 : '-',
      'nums1[p1]': p1 >= 0 ? nums1[p1] : '-',
      p2: p2 >= 0 ? p2 : '-',
      'nums2[p2]': p2 >= 0 ? nums2[p2] : '-',
      p: p >= 0 ? p : '-',
      'nums1[p]': p >= 0 ? nums1[p] : '-'
    }
  });
  addLines(5, 5, 5, 5);

  // Copy remaining elements of nums2
  steps.push({
    nums1: [...nums1],
    nums2: [...nums2],
    p1,
    p2,
    p,
    highlights1: [],
    highlights2: p2 >= 0 ? [p2] : [],
    explanation: `Check if there are any remaining elements in nums2 to copy: p2 >= 0 (${p2} >= 0).`,
    pseudoStep: `WHILE p2 ≥ 0  →  ${p2} ≥ 0  →  ${p2 >= 0 ? 'YES ✓' : 'NO ✗'}`,
    variables: {
      p1: p1 >= 0 ? p1 : '-',
      'nums1[p1]': p1 >= 0 ? nums1[p1] : '-',
      p2: p2 >= 0 ? p2 : '-',
      'nums2[p2]': p2 >= 0 ? nums2[p2] : '-',
      p: p >= 0 ? p : '-',
      'nums1[p]': p >= 0 ? nums1[p] : '-'
    }
  });
  addLines(15, 13, 15, 15);

  while (p2 >= 0) {
    // Step: Copy nums2[p2] to nums1[p]
    nums1[p] = nums2[p2];
    steps.push({
      nums1: [...nums1],
      nums2: [...nums2],
      p1,
      p2,
      p,
      highlights1: [p],
      highlights2: [p2],
      explanation: `Copy remaining element nums2[p2] (${nums2[p2]}) to nums1[${p}].`,
      pseudoStep: `SET nums1[write_ptr] = nums2[p2]  →  nums1[${p}] = ${nums2[p2]}`,
      variables: {
        p1: p1 >= 0 ? p1 : '-',
        'nums1[p1]': p1 >= 0 ? nums1[p1] : '-',
        p2: p2 >= 0 ? p2 : '-',
        'nums2[p2]': p2 >= 0 ? nums2[p2] : '-',
        p: p >= 0 ? p : '-',
        'nums1[p]': p >= 0 ? nums1[p] : '-'
      }
    });
    addLines(16, 14, 16, 16);

    // Step: Decrement p2
    p2--;
    steps.push({
      nums1: [...nums1],
      nums2: [...nums2],
      p1,
      p2,
      p,
      highlights1: [],
      highlights2: p2 >= 0 ? [p2] : [],
      explanation: `Decrement p2 to ${p2} to point to the next remaining element in nums2.`,
      pseudoStep: `DECREMENT p2  →  ${p2}`,
      variables: {
        p1: p1 >= 0 ? p1 : '-',
        'nums1[p1]': p1 >= 0 ? nums1[p1] : '-',
        p2: p2 >= 0 ? p2 : '-',
        'nums2[p2]': p2 >= 0 ? nums2[p2] : '-',
        p: p >= 0 ? p : '-',
        'nums1[p]': p >= 0 ? nums1[p] : '-'
      }
    });
    addLines(17, 15, 17, 17);

    // Step: Decrement p
    p--;
    steps.push({
      nums1: [...nums1],
      nums2: [...nums2],
      p1,
      p2,
      p,
      highlights1: p >= 0 ? [p] : [],
      highlights2: [],
      explanation: `Decrement write pointer to ${p}.`,
      pseudoStep: `DECREMENT write_ptr  →  ${p}`,
      variables: {
        p1: p1 >= 0 ? p1 : '-',
        'nums1[p1]': p1 >= 0 ? nums1[p1] : '-',
        p2: p2 >= 0 ? p2 : '-',
        'nums2[p2]': p2 >= 0 ? nums2[p2] : '-',
        p: p >= 0 ? p : '-',
        'nums1[p]': p >= 0 ? nums1[p] : '-'
      }
    });
    addLines(18, 16, 18, 18);

    // Step: Check loop condition again
    steps.push({
      nums1: [...nums1],
      nums2: [...nums2],
      p1,
      p2,
      p,
      highlights1: [],
      highlights2: p2 >= 0 ? [p2] : [],
      explanation: `Check loop condition: p2 >= 0 (${p2} >= 0).`,
      pseudoStep: `WHILE p2 ≥ 0  →  ${p2} ≥ 0  →  ${p2 >= 0 ? 'YES ✓' : 'NO ✗'}`,
      variables: {
        p1: p1 >= 0 ? p1 : '-',
        'nums1[p1]': p1 >= 0 ? nums1[p1] : '-',
        p2: p2 >= 0 ? p2 : '-',
        'nums2[p2]': p2 >= 0 ? nums2[p2] : '-',
        p: p >= 0 ? p : '-',
        'nums1[p]': p >= 0 ? nums1[p] : '-'
      }
    });
    addLines(15, 13, 15, 15);
  }

  // Final Step: Complete
  steps.push({
    nums1: [...nums1],
    nums2: [...nums2],
    p1,
    p2,
    p,
    highlights1: [],
    highlights2: [],
    explanation: `Merge complete! All elements of nums2 have been copied to the beginning of nums1. The combined array is now sorted in non-decreasing order.`,
    pseudoStep: `RETURN`,
    variables: {
      p1: p1 >= 0 ? p1 : '-',
      'nums1[p1]': p1 >= 0 ? nums1[p1] : '-',
      p2: p2 >= 0 ? p2 : '-',
      'nums2[p2]': p2 >= 0 ? nums2[p2] : '-',
      p: p >= 0 ? p : '-',
      'nums1[p]': p >= 0 ? nums1[p] : '-'
    }
  });
  addLines(20, 16, 20, 20);

  return { steps, stepLineNumbers };
}

export const MergeSortedArrayVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <div className="space-y-6">
      {/* Playback Controls */}
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Visual State & Commentary */}
        <div className="space-y-6">
          <div className="bg-muted/20 rounded-xl border border-border/50 p-6 flex flex-col justify-center min-h-[300px]">
            {/* Destination Array (nums1) */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wide">
                Destination array (nums1)
              </h4>
              <div className="flex gap-2 flex-wrap justify-start py-2">
                {currentStep.nums1.map((value, idx) => {
                  const isP1 = idx === currentStep.p1;
                  const isP = idx === currentStep.p;
                  const isHighlighted = currentStep.highlights1.includes(idx);
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all duration-200 ${
                        isHighlighted
                          ? 'bg-primary/20 border-primary scale-105 shadow-md'
                          : 'bg-muted/30 border-border/80'
                      }`}>
                        <span className="font-semibold text-sm text-foreground">
                          {value}
                        </span>
                      </div>
                      {/* Pointer labels underneath */}
                      <div className="h-8 flex flex-col justify-start items-center text-[10px] font-bold">
                        {isP1 && <span className="text-blue-500">p1</span>}
                        {isP && <span className="text-red-500">write</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Source Array (nums2) */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wide">
                Source array (nums2)
              </h4>
              <div className="flex gap-2 flex-wrap justify-start py-2">
                {currentStep.nums2.map((value, idx) => {
                  const isP2 = idx === currentStep.p2;
                  const isHighlighted = currentStep.highlights2.includes(idx);
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all duration-200 ${
                        isHighlighted
                          ? 'bg-emerald-500/20 border-emerald-500 scale-105 shadow-md'
                          : 'bg-muted/30 border-border/80'
                      }`}>
                        <span className="font-semibold text-sm text-foreground">
                          {value}
                        </span>
                      </div>
                      {/* Pointer labels underneath */}
                      <div className="h-8 flex flex-col justify-start items-center text-[10px] font-bold">
                        {isP2 && <span className="text-emerald-500">p2</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Commentary Box */}
          <div className="bg-accent/40 rounded-xl border border-accent/60 p-5 shadow-sm">
            <h4 className="text-xs font-bold text-accent-foreground/75 tracking-wide mb-1">
              Commentary
            </h4>
            <p className="text-sm font-medium leading-relaxed text-foreground select-none">
              {currentStep.explanation}
            </p>
          </div>

          {/* Strategy / Complexity Info */}
          <div className="bg-muted/50 rounded-xl border border-border/50 p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-foreground mb-2">Three-pointer merge strategy</h4>
            <div className="text-xs space-y-1.5 text-muted-foreground leading-relaxed">
              <p>• To merge in O(1) auxiliary space, we work from right to left (largest to smallest elements).</p>
              <p>• We initialize pointers `p1` (end of valid nums1), `p2` (end of nums2), and a write pointer `p` (end of nums1's capacity).</p>
              <p>• At each step, we compare the elements at `p1` and `p2`, write the larger one to `p`, and decrement the respective pointer and `p`.</p>
              <p>• If `nums2` still has elements after `p1` is exhausted, we copy them directly. If `nums1` has remaining elements, they are already in place.</p>
              <p>• Time complexity: <code className="font-mono text-primary font-bold">O(m + n)</code></p>
              <p>• Space complexity: <code className="font-mono text-primary font-bold">O(1)</code> auxiliary space</p>
            </div>
          </div>
        </div>

        {/* Right Column: Code panel & Variable Panel */}
        <div className="space-y-4 flex flex-col">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      </div>
    </div>
  );
};
