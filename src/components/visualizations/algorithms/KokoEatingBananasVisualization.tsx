import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Sparkles, Hourglass } from 'lucide-react';

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
  highlightedLines: number[];
  lineExecution: string;
}

export const KokoEatingBananasVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const piles = [3, 6, 7, 11];
  const h = 8;

  const code = `function minEatingSpeed(piles: number[], h: number): number {
  let l = 1;
  let r = Math.max(...piles);
  let res = r;

  while (l <= r) {
    const k = Math.floor((l + r) / 2);

    let hours = 0;
    for (const p of piles) {
      hours += Math.ceil(p / k);
    }

    if (hours <= h) {
      res = Math.min(res, k);
      r = k - 1;
    } else {
      l = k + 1;
    }
  }

  return res;
}`;

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const pilesData = [3, 6, 7, 11];
    const hVal = 8;

    stepsList.push({
      l: -1,
      r: -1,
      k: -1,
      res: -1,
      hours: 0,
      currentPileIdx: -1,
      piles: pilesData,
      h: hVal,
      explanation: "Given piles = [3, 6, 7, 11] and guard return time h = 8. Koko wants to eat all bananas slowly but finish within h hours.",
      lineExecution: "function minEatingSpeed(piles: number[], h: number): number {",
      highlightedLines: [1]
    });

    stepsList.push({
      l: 1,
      r: -1,
      k: -1,
      res: -1,
      hours: 0,
      currentPileIdx: -1,
      piles: pilesData,
      h: hVal,
      explanation: "Set the lower bound of eating speed l = 1 banana per hour. This is the minimum possible eating speed.",
      lineExecution: "let l = 1;",
      highlightedLines: [2]
    });

    stepsList.push({
      l: 1,
      r: 11,
      k: -1,
      res: -1,
      hours: 0,
      currentPileIdx: -1,
      piles: pilesData,
      h: hVal,
      explanation: "Set the upper bound of eating speed r = 11 bananas per hour (maximum pile size). Eating faster than 11 bananas/hour doesn't save any more hours.",
      lineExecution: "let r = Math.max(...piles);",
      highlightedLines: [3]
    });

    stepsList.push({
      l: 1,
      r: 11,
      res: 11,
      k: -1,
      hours: 0,
      currentPileIdx: -1,
      piles: pilesData,
      h: hVal,
      explanation: "Initialize the result speed res to the maximum speed r = 11. We will try to find a smaller valid speed.",
      lineExecution: "let res = r;",
      highlightedLines: [4]
    });

    let l = 1;
    let r = 11;
    let res = 11;

    while (l <= r) {
      stepsList.push({
        l,
        r,
        k: -1,
        res,
        hours: 0,
        currentPileIdx: -1,
        piles: pilesData,
        h: hVal,
        explanation: `Check loop condition: l (${l}) <= r (${r}) is true. We continue our binary search.`,
        lineExecution: "while (l <= r) {",
        highlightedLines: [6]
      });

      const k = Math.floor((l + r) / 2);
      stepsList.push({
        l,
        r,
        k,
        res,
        hours: 0,
        currentPileIdx: -1,
        piles: pilesData,
        h: hVal,
        explanation: `Calculate middle speed candidate k = Math.floor((${l} + ${r}) / 2) = ${k} bananas per hour.`,
        lineExecution: "const k = Math.floor((l + r) / 2);",
        highlightedLines: [7]
      });

      stepsList.push({
        l,
        r,
        k,
        res,
        hours: 0,
        currentPileIdx: -1,
        piles: pilesData,
        h: hVal,
        explanation: `Initialize running sum hours = 0. We will count how many hours it takes to eat all bananas at speed k = ${k}.`,
        lineExecution: "let hours = 0;",
        highlightedLines: [9]
      });

      let hours = 0;
      for (let i = 0; i < pilesData.length; i++) {
        const p = pilesData[i];
        hours += Math.ceil(p / k);
        const addedHours = Math.ceil(p / k);
        stepsList.push({
          l,
          r,
          k,
          res,
          hours,
          currentPileIdx: i,
          piles: pilesData,
          h: hVal,
          explanation: `For pile ${i} with ${p} bananas, eating at speed k = ${k} takes Math.ceil(${p} / ${k}) = ${addedHours} hour(s). Running total hours = ${hours}.`,
          lineExecution: "hours += Math.ceil(p / k);",
          highlightedLines: [10, 11]
        });
      }

      stepsList.push({
        l,
        r,
        k,
        res,
        hours,
        currentPileIdx: -1,
        piles: pilesData,
        h: hVal,
        explanation: `Check if total hours (${hours}) is within the guard return limit h = ${hVal}.`,
        lineExecution: "if (hours <= h) {",
        highlightedLines: [14]
      });

      if (hours <= hVal) {
        const oldRes = res;
        res = Math.min(res, k);
        stepsList.push({
          l,
          r,
          k,
          res,
          hours,
          currentPileIdx: -1,
          piles: pilesData,
          h: hVal,
          explanation: `Since ${hours} <= ${hVal}, speed k = ${k} is feasible! Update the best speed res = Math.min(${oldRes}, ${k}) = ${res}.`,
          lineExecution: "res = Math.min(res, k);",
          highlightedLines: [15]
        });

        r = k - 1;
        stepsList.push({
          l,
          r,
          k,
          res,
          hours,
          currentPileIdx: -1,
          piles: pilesData,
          h: hVal,
          explanation: `Try to find if Koko can eat even slower. Set the upper search bound to r = k - 1 = ${r}.`,
          lineExecution: "r = k - 1;",
          highlightedLines: [16]
        });
      } else {
        stepsList.push({
          l,
          r,
          k,
          res,
          hours,
          currentPileIdx: -1,
          piles: pilesData,
          h: hVal,
          explanation: `Since total hours (${hours}) exceeds guard return limit h = ${hVal}, speed k = ${k} is too slow.`,
          lineExecution: "} else {",
          highlightedLines: [17]
        });

        l = k + 1;
        stepsList.push({
          l,
          r,
          k,
          res,
          hours,
          currentPileIdx: -1,
          piles: pilesData,
          h: hVal,
          explanation: `We must eat faster. Increase the lower search bound to l = k + 1 = ${l}.`,
          lineExecution: "l = k + 1;",
          highlightedLines: [18]
        });
      }
    }

    stepsList.push({
      l,
      r,
      k: -1,
      res,
      hours: 0,
      currentPileIdx: -1,
      piles: pilesData,
      h: hVal,
      explanation: `Check loop condition: l (${l}) <= r (${r}) is false. The binary search space is exhausted.`,
      lineExecution: "while (l <= r) {",
      highlightedLines: [6]
    });

    stepsList.push({
      l,
      r,
      k: -1,
      res,
      hours: 0,
      currentPileIdx: -1,
      piles: pilesData,
      h: hVal,
      explanation: `The search is complete. Return the minimum eating speed found, res = ${res}.`,
      lineExecution: "return res;",
      highlightedLines: [22]
    });

    return stepsList;
  }, []);

  const step = steps[currentStep];

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
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full text-foreground animate-none">
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
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Banana Piles</h4>
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
                <div className="relative bg-muted/40 p-4 rounded-xl border border-border/40 min-h-[90px] flex items-center">
                  
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
                          className="absolute flex flex-col items-center justify-center -translate-x-1/2"
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

          <div className="space-y-4">
            <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm text-foreground">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                    Current Execution
                  </h4>
                  <div className="text-sm font-mono bg-background/80 p-2.5 rounded-lg border border-border/50 shadow-sm inline-block">
                    {step.lineExecution}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                    Commentary
                  </h4>
                  <p className="text-[14px] font-medium leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
              </div>
            </Card>
            
            <VariablePanel 
              variables={{
                l: step.l > 0 ? step.l : 'N/A',
                r: step.r > 0 ? step.r : 'N/A',
                k: step.k > 0 ? step.k : 'calculating...',
                res: step.res > 0 ? step.res : 'N/A',
                hours: step.k > 0 ? `${step.hours} / ${h}` : 'N/A',
                searchSpace: step.l > 0 && step.r > 0 ? `${step.r - step.l + 1} speed(s) left` : 'N/A'
              }} 
            />
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex-1 overflow-hidden min-h-[400px]">
            <AnimatedCodeEditor
              code={code}
              language="typescript"
              highlightedLines={step.highlightedLines}
            />
          </div>
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
  );
};
