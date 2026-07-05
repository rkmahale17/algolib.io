import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Sparkles, Hourglass, Info } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  l: number;
  r: number;
  k: number;
  res: number;
  hours: number;
  currentPileIdx: number;
  piles: number[];
  h: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function minEatingSpeed(piles: number[], h: number): number {
  let l = 1;
  let r = Math.max(...piles);
  let res = r;
  while (l <= r) {
    const k = l + Math.floor((r - l) / 2);
    let hours = 0;
    for (const p of piles) {
      hours += Math.ceil(p / k);
    }
    if (hours <= h) {
      res = k;
      r = k - 1;
    } else {
      l = k + 1;
    }
  }
  return res;
}`,
  python: `import math

def minEatingSpeed(piles: list[int], h: int) -> int:
    l = 1
    r = max(piles)
    res = r
    while l <= r:
        k = (l + r) // 2
        hours = 0
        for p in piles:
            hours += math.ceil(p / k)
        if hours <= h:
            res = min(res, k)
            r = k - 1
        else:
            l = k + 1
    return res`,
  java: `public static class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int l = 1;
        int r = 0;
        for (int pile : piles) {
            r = Math.max(r, pile);
        }
        int res = r;
        while (l <= r) {
            int k = l + (r - l) / 2;
            long hours = 0;
            for (int p : piles) {
                hours += Math.ceil((double) p / k);
            }
            if (hours <= h) {
                res = k;
                r = k - 1;
            } else {
                l = k + 1;
            }
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        long long l = 1;
        long long r = *max_element(piles.begin(), piles.end()); 
        long long res = r;
        while (l <= r) {
            long long k = l + (r - l) / 2;
            long long hours = 0;
            for (int p : piles) {
                hours += (p + k - 1) / k;
            }
            if (hours <= h) {
                res = k;
                r = k - 1;
            } else {
                l = k + 1;
            }
        }
        return res;
    }
};`
};

export const KokoEatingBananasVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const piles = [3, 6, 7, 11];
  const h = 8;

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const pilesData = [3, 6, 7, 11];
    const hVal = 8;

    const getVariables = (l: number, r: number, k: number, res: number, hours: number, currentPileIdx: number) => {
      return {
        l: l > 0 ? l : 'N/A',
        r: r > 0 ? r : 'N/A',
        k: k > 0 ? k : 'calculating...',
        res: res > 0 ? res : 'N/A',
        hours: k > 0 ? `${hours} / ${hVal}` : 'N/A',
        currentPile: currentPileIdx !== -1 ? `piles[${currentPileIdx}] = ${pilesData[currentPileIdx]}` : 'N/A'
      };
    };

    const pushStep = (
      explanation: string,
      pseudo: string,
      l: number, r: number, k: number, res: number, hours: number, currentPileIdx: number,
      ts: number, py: number, jv: number, cp: number
    ) => {
      stepsList.push({
        l,
        r,
        k,
        res,
        hours,
        currentPileIdx,
        piles: pilesData,
        h: hVal,
        explanation,
        pseudoStep: pseudo,
        variables: getVariables(l, r, k, res, hours, currentPileIdx)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      "Given piles = [3, 6, 7, 11] and guard return time h = 8. Koko wants to eat all bananas slowly but finish within h hours.",
      "minEatingSpeed(piles=[3,6,7,11], h=8)",
      -1, -1, -1, -1, 0, -1,
      1, 3, 2, 3
    );

    let l = 1;
    pushStep(
      "Set the lower bound of eating speed l = 1 banana per hour. This is the minimum possible eating speed.",
      "l = 1",
      l, -1, -1, -1, 0, -1,
      2, 4, 3, 4
    );

    let r = 11;
    pushStep(
      "Set the upper bound of eating speed r = 11 bananas per hour (maximum pile size).",
      "r = max(piles)  →  11",
      l, r, -1, -1, 0, -1,
      3, 5, 4, 5
    );

    let res = r;
    pushStep(
      "Initialize the result speed res to the maximum speed r = 11. We will try to find a smaller valid speed.",
      "res = r  →  11",
      l, r, -1, res, 0, -1,
      4, 6, 8, 6
    );

    while (l <= r) {
      pushStep(
        `Check loop condition: l (${l}) <= r (${r}) is true. We continue our binary search.`,
        `WHILE l <= r  →  ${l} <= ${r}`,
        l, r, -1, res, 0, -1,
        5, 7, 9, 7
      );

      const k = l + Math.floor((r - l) / 2);
      pushStep(
        `Calculate middle speed candidate k = l + (r - l) / 2 = ${k} bananas per hour.`,
        `k = (l + r) // 2  →  ${k}`,
        l, r, k, res, 0, -1,
        6, 8, 10, 8
      );

      pushStep(
        `Initialize running sum hours = 0. We will count how many hours it takes to eat all bananas at speed k = ${k}.`,
        "hours = 0",
        l, r, k, res, 0, -1,
        7, 9, 11, 9
      );

      let hours = 0;
      for (let i = 0; i < pilesData.length; i++) {
        const p = pilesData[i];
        hours += Math.ceil(p / k);
        const addedHours = Math.ceil(p / k);
        pushStep(
          `For pile ${i} with ${p} bananas, eating at speed k = ${k} takes Math.ceil(${p} / ${k}) = ${addedHours} hour(s). Running total hours = ${hours}.`,
          `hours += Math.ceil(p / k)  →  add ${addedHours} hr(s)`,
          l, r, k, res, hours, i,
          8, 10, 12, 10
        );
      }

      pushStep(
        `Check if total hours (${hours}) is within the guard return limit h = ${hVal}.`,
        `IF hours <= h  →  ${hours} <= ${hVal}`,
        l, r, k, res, hours, -1,
        11, 12, 15, 13
      );

      if (hours <= hVal) {
        res = k;
        pushStep(
          `Since ${hours} <= ${hVal}, speed k = ${k} is feasible! Update the best speed res = k = ${res}.`,
          `res = k  →  ${res}`,
          l, r, k, res, hours, -1,
          12, 13, 16, 14
        );

        r = k - 1;
        pushStep(
          `Try to find if Koko can eat even slower. Set the upper search bound to r = k - 1 = ${r}.`,
          `r = k - 1  →  ${r}`,
          l, r, k, res, hours, -1,
          13, 14, 17, 15
        );
      } else {
        l = k + 1;
        pushStep(
          `Since total hours (${hours}) exceeds guard return limit h = ${hVal}, speed k = ${k} is too slow. Increase lower bound to l = k + 1 = ${l}.`,
          `l = k + 1  →  ${l}`,
          l, r, k, res, hours, -1,
          15, 16, 19, 17
        );
      }
    }

    pushStep(
      `Check loop condition: l (${l}) <= r (${r}) is false. The binary search space is exhausted.`,
      `WHILE l <= r  →  ${l} <= ${r}`,
      l, r, -1, res, 0, -1,
      5, 7, 9, 7
    );

    pushStep(
      `The search is complete. Return the minimum eating speed found, res = ${res}.`,
      `RETURN res  →  ${res}`,
      l, r, -1, res, 0, -1,
      18, 17, 22, 20
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStep] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  const getPileRows = (bananaCount: number, speedVal: number) => {
    if (speedVal <= 0) return [bananaCount];
    const rows = [];
    let remaining = bananaCount;
    while (remaining > 0) {
      rows.push(Math.min(remaining, speedVal));
      remaining -= speedVal;
    }
    return rows;
  };

  return (
    <div className="space-y-6">
      <VisualizationLayout
        leftContent={
          <div className="space-y-6 flex flex-col h-full text-foreground">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
                Koko Eating Bananas (Binary Search on Answer)
              </h2>
              
              <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative space-y-6">
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2">
                    <Hourglass className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Guards Return Time: <strong className="text-foreground">{h} hours</strong></span>
                  </div>
                  {step.k > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Current Total Time:{' '}
                        <strong className={step.hours <= h ? "text-green-500" : "text-destructive"}>
                          {step.hours} hours
                        </strong>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Banana Piles Array</h4>
                    <div className="flex gap-1.5">
                      {piles.map((pileSize, idx) => {
                        const isCurrent = step.currentPileIdx === idx;
                        return (
                          <div
                            key={idx}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-md'
                                : 'bg-muted/50 border-border text-foreground/80'
                            }`}
                          >
                            {pileSize}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 h-56 items-end border-b border-border/50 pb-2">
                    {piles.map((pileSize, idx) => {
                      const isCurrent = step.currentPileIdx === idx;
                      const rows = getPileRows(pileSize, step.k);
                      
                      return (
                        <div key={idx} className="flex flex-col items-center justify-end h-full relative">
                          {isCurrent && (
                            <div className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-xl -z-10 transition-all duration-350" />
                          )}
                          
                          <div className="flex flex-col-reverse gap-1.5 w-full items-center mb-2">
                            {rows.map((rowBananas, rowIdx) => (
                              <div 
                                key={rowIdx} 
                                className={`flex gap-0.5 justify-center p-1 rounded transition-colors duration-150 ${
                                  isCurrent 
                                    ? 'bg-amber-500/20 border border-amber-500/40' 
                                    : 'bg-amber-500/10 border border-amber-500/20'
                                }`}
                              >
                                {Array.from({ length: rowBananas }).map((_, bIdx) => (
                                  <div 
                                    key={bIdx} 
                                    className="w-2.5 h-6 rounded-full bg-amber-400 border border-amber-500 shadow-sm"
                                    title="Banana"
                                  />
                                ))}
                              </div>
                            ))}
                          </div>

                          <div className="text-center">
                            <span className={`text-xs font-mono font-bold ${isCurrent ? "text-amber-500" : "text-muted-foreground"}`}>
                              {pileSize} bananas
                            </span>
                            {step.k > 0 && (
                              <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                                {Math.ceil(pileSize / step.k)} hr{Math.ceil(pileSize / step.k) > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Speed Search Space (k = 1 to max(pile))</h4>
                  <div className="relative bg-muted/40 p-4 rounded-xl border border-border/40 min-h-[90px] flex items-center animate-all duration-300">
                    
                    {step.l > 0 && step.r > 0 && step.l <= step.r && (
                      <div 
                        className="absolute h-1.5 bg-primary/25 rounded-full transition-all duration-300"
                        style={{
                          left: `${((step.l - 1) / 10) * 80 + 10}%`,
                          right: `${100 - (((step.r - 1) / 10) * 80 + 10)}%`
                        }}
                      />
                    )}

                    <div className="w-full h-1.5 bg-border rounded-full flex justify-between relative">
                      
                      {Array.from({ length: 11 }).map((_, idx) => {
                        const speedVal = idx + 1;
                        const isL = step.l === speedVal;
                        const isR = step.r === speedVal;
                        const isK = step.k === speedVal;
                        const isRes = step.res === speedVal;

                        return (
                          <div 
                            key={idx} 
                            className="absolute flex flex-col items-center justify-center -translate-x-1/2 transition-all duration-300"
                            style={{ left: `${(idx / 10) * 80 + 10}%` }}
                          >
                            <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-150 ${
                              isK ? 'bg-primary border-primary scale-125' :
                              isL ? 'bg-green-500 border-green-500' :
                              isR ? 'bg-rose-500 border-rose-500' :
                              isRes ? 'bg-amber-400 border-amber-500' :
                              'bg-background border-border'
                            }`} />

                            <span className="text-[10px] font-mono mt-1 text-muted-foreground">
                              {speedVal}
                            </span>

                            <div className="absolute -top-7 flex flex-col items-center">
                              {isK && (
                                <span className="text-[9px] font-black bg-primary text-primary-foreground px-1 rounded shadow">
                                  k
                                </span>
                              )}
                              {!isK && isL && (
                                <span className="text-[9px] font-black bg-green-500 text-white px-1 rounded shadow">
                                  l
                                </span>
                              )}
                              {!isK && isR && (
                                <span className="text-[9px] font-black bg-rose-500 text-white px-1 rounded shadow">
                                  r
                                </span>
                              )}
                            </div>

                            {isRes && (
                              <div className="absolute -bottom-6">
                                <span className="text-[9px] font-black bg-amber-400 text-amber-950 px-1 rounded flex items-center gap-0.5 shadow">
                                  <Sparkles className="h-2 w-2" /> res
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm text-foreground flex items-center min-h-[70px]">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Narrative
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90">
                    {step.explanation}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStep}
              onLanguageChange={() => setCurrentStep(0)}
            />
            <VariablePanel variables={step.variables} />
          </div>
        }
        controls={
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
        }
      />
    </div>
  );
};
export default KokoEatingBananasVisualization;
