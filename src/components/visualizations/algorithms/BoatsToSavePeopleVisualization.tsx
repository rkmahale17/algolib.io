import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  people: number[];
  l: number;
  r: number;
  dispatchedBoats: number[][];
  activeBoat: number[];
  res: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function numRescueBoats(people: number[], limit: number): number {
    people.sort((a, b) => a - b);
    let res = 0;
    let l = 0;
    let r = people.length - 1;
    while (l <= r) {
        const remain = limit - people[r];
        r--;
        res++;
        if (l <= r && remain >= people[l]) {
            l++;
        }
    }
    return res;
}`,

  python: `def numRescueBoats(people: list[int], limit: int) -> int:
    people.sort()
    res = 0
    l = 0
    r = len(people) - 1
    while l <= r:
        remain = limit - people[r]
        r -= 1
        res += 1
        if l <= r and remain >= people[l]:
            l += 1
    return res`,

  java: `public int numRescueBoats(int[] people, int limit) {
    Arrays.sort(people);
    int boats = 0;
    int left = 0;
    int right = people.length - 1;
    while (left <= right) {
        int remainingCapacity = limit - people[right];
        right--;
        boats++;
        if (left <= right && remainingCapacity >= people[left]) {
            left++;
        }
    }
    return boats;
}`,

  cpp: `int numRescueBoats(vector<int>& people, int limit) {
    sort(people.begin(), people.end());
    int res = 0;
    int l = 0;
    int r = people.size() - 1;
    while (l <= r) {
        int remain = limit - people[r];
        r--;
        res++;
        if (l <= r && remain >= people[l]) {
            l++;
        }
    }
    return res;
}`,
};

function generateVisualizationData() {
  const initialPeople = [3, 2, 2, 1];
  const limit = 3;
  const people = [...initialPeople];
  const steps: Step[] = [];
  const dispatchedBoats: number[][] = [];

  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  // Push helper
  const pushStep = (
    l: number,
    r: number,
    activeBoat: number[],
    res: number,
    explanation: string,
    pseudoStep: string,
    ts: number,
    py: number,
    java: number,
    cpp: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalVars: Record<string, any> = {}
  ) => {
    steps.push({
      people: [...people],
      l,
      r,
      dispatchedBoats: dispatchedBoats.map((b) => [...b]),
      activeBoat: [...activeBoat],
      res,
      variables: {
        dispatchedBoats: `[${dispatchedBoats.map((b) => `[${b.join(', ')}]`).join(', ')}]`,
        activeBoat: `[${activeBoat.join(', ')}]`,
        res,
        limit,
        ...additionalVars,
      },
      explanation,
      pseudoStep,
    });
    addLines(ts, py, java, cpp);
  };

  // Step 1: Sort
  people.sort((a, b) => a - b);
  let res = 0;
  let l = 0;
  let r = people.length - 1;
  pushStep(
    l,
    r,
    [],
    res,
    'Sort the weights in ascending order: [1, 2, 2, 3]. Initialize boat count res = 0, left pointer l = 0 (lightest), and right pointer r = 3 (heaviest).',
    'people.sort()  →  [1, 2, 2, 3]',
    2,
    2,
    2,
    2,
    { l, r }
  );

  while (l <= r) {
    // Step A: Loop Condition
    pushStep(
      l,
      r,
      [],
      res,
      `Check loop condition: l (${l}) <= r (${r}) is true. We still have people to rescue.`,
      `WHILE l <= r  →  ${l} <= ${r}  →  YES ✓`,
      6,
      6,
      6,
      6,
      { l, r }
    );

    const remain = limit - people[r];
    const heaviestWeight = people[r];
    r--;
    res++;
    const activeBoat = [heaviestWeight];

    pushStep(
      l,
      r,
      activeBoat,
      res,
      `Greedy choice: Place the heaviest person (weight ${heaviestWeight}) in a boat. Remaining capacity: limit - ${heaviestWeight} = ${remain}. Increment boat count to ${res}.`,
      `INCREMENT res → ${res}, remain = limit − people[r] (${remain})`,
      7,
      7,
      7,
      7,
      { l, r, remain }
    );

    const fits = l <= r && remain >= people[l];
    pushStep(
      l,
      r,
      activeBoat,
      res,
      `Check if the lightest person (weight ${people[l]}) can share the boat: l <= r and remaining capacity (${remain}) >= weight (${people[l]}) → ${fits ? 'YES' : 'NO'}.`,
      `IF l <= r AND remain >= people[l]  →  ${fits ? 'YES ✓' : 'NO ✗'}`,
      10,
      10,
      10,
      10,
      { l, r, remain, 'people[l]': people[l] }
    );

    if (fits) {
      activeBoat.push(people[l]);
      l++;
      pushStep(
        l,
        r,
        activeBoat,
        res,
        `The lightest person (weight ${activeBoat[1]}) fits in the boat. Move left pointer to index l = ${l}.`,
        `INCREMENT l → ${l}`,
        11,
        11,
        11,
        11,
        { l, r, remain }
      );
    }

    // Iteration ends - dispatch boat
    dispatchedBoats.push([...activeBoat]);
    pushStep(
      l,
      r,
      [],
      res,
      `Dispatch the boat with passengers: [${activeBoat.join(', ')}].`,
      `DISPATCH BOAT  →  [${activeBoat.join(', ')}]`,
      13,
      6,
      13,
      13,
      { l, r }
    );
  }

  // Return step
  pushStep(l, r, [], res, `All people rescued. Return total boats used: ${res}.`, `RETURN res (${res})`, 14, 12, 14, 14);

  return { steps, stepLineNumbers };
}

export const BoatsToSavePeopleVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Boats to Save People
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-14">
                <h4 className="text-xs font-semibold text-muted-foreground mb-6">People Weights Array</h4>
                <div className="flex gap-4 justify-center items-start pt-14 pb-14">
                  {currentStep.people.map((num, idx) => {
                    // Highlight l and r pointers
                    const isLeft = currentStep.l === idx;
                    const isRight = currentStep.r === idx;

                    // Check if this weight is already boarded/dispatched
                    // A weight at index idx is boarded if it's less than l or greater than r
                    const isRescued = idx < currentStep.l || idx > (currentStep.r === null ? -1 : currentStep.r);

                    let bgClass = 'bg-muted/50 border-border';
                    let textClass = 'text-foreground';

                    if (isRescued) {
                      bgClass = 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 opacity-40';
                      textClass = 'text-muted-foreground';
                    }

                    if (isLeft && !isRescued) {
                      bgClass = 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 scale-110 shadow-md';
                      textClass = 'text-blue-950 dark:text-blue-50';
                    }

                    if (isRight && !isRescued) {
                      bgClass = 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500 scale-110 shadow-md';
                      textClass = 'text-orange-950 dark:text-orange-50';
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 relative">
                        {isRight && !isRescued && (
                          <span className="absolute -top-14 left-1/2 -translate-x-1/2 text-[9px] font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap bg-orange-100 dark:bg-orange-950 px-1 py-0.5 rounded border border-orange-500/20 z-20 shadow-sm">
                            r (heavy)
                          </span>
                        )}

                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-bold transition-all duration-0 ${bgClass} ${textClass}`}
                        >
                          <span className="text-xs font-semibold">{num}</span>
                        </div>

                        {isLeft && !isRescued && (
                          <span className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-[9px] font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap bg-blue-100 dark:bg-blue-950 px-1 py-0.5 rounded border border-blue-500/20 z-20 shadow-sm">
                            l (light)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Boat Loading Bay */}
              <div className="mt-6 border-t border-border/40 pt-6">
                <h4 className="text-xs font-semibold text-muted-foreground mb-4">Boat Loading Bay</h4>
                <div className="flex gap-6 justify-center flex-wrap">
                  {/* Current Active Boat */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">Active Boat</span>
                    <div className="w-24 h-16 border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl flex items-center justify-center gap-2">
                      {currentStep.activeBoat.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">Empty</span>
                      ) : (
                        currentStep.activeBoat.map((weight, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-lg border border-primary bg-primary/20 flex items-center justify-center text-xs font-black text-primary"
                          >
                            {weight}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Dispatched Boats */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">Dispatched Boats</span>
                    <div className="flex gap-2 items-center min-h-[64px] px-4 py-2 bg-muted/20 border border-border/50 rounded-xl max-w-sm overflow-x-auto">
                      {currentStep.dispatchedBoats.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">None</span>
                      ) : (
                        currentStep.dispatchedBoats.map((boat, idx) => (
                          <div
                            key={idx}
                            className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400"
                          >
                            🚣 [{boat.join(', ')}]
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-auto">
            <Card className="p-5 border border-border bg-background shadow-sm">
              <h4 className="text-xs font-semibold text-foreground mb-2">Commentary</h4>
              <p className="text-[14px] font-medium leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {currentStep.explanation}
              </p>
            </Card>
          </div>
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
