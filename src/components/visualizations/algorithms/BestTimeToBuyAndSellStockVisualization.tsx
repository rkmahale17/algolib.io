import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Card } from '@/components/ui/card';

interface Step {
  array: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function maxProfit(prices: number[]): number {
    let l = 0;
    let r = 1;
    let maxProfit = 0;
    while (r < prices.length) {
        if (prices[l] < prices[r]) {
            maxProfit = Math.max(maxProfit, prices[r] - prices[l]);
        } else {
            l = r;
        }
        r++;
    }
    return maxProfit;
}`,

  python: `def maxProfit(prices: List[int]) -> int:
    l = 0
    r = 1
    max_profit = 0
    while r < len(prices):
        if prices[l] < prices[r]:
            max_profit = max(max_profit, prices[r] - prices[l])
        else:
            l = r
        r += 1
    return max_profit`,

  java: `public static class Solution {
    public int maxProfit(int[] prices) {
        int l = 0;
        int r = 1;
        int maxProfit = 0;
        while (r < prices.length) {
            if (prices[l] < prices[r]) {
                maxProfit = Math.max(maxProfit, prices[r] - prices[l]);
            } else {
                l = r;
            }
            r++;
        }
        return maxProfit;
    }
}`,

  cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int l = 0;
        int r = 1;
        int maxProfit = 0;
        while (r < prices.size()) {
            if (prices[l] < prices[r]) {
                int profit = prices[r] - prices[l];
                maxProfit = max(maxProfit, profit);
            } else {
                l = r;
            }
            r++;
        }
        return maxProfit;
    }
};`,
};

function generateVisualizationData() {
  const prices = [7, 1, 5, 3, 6, 4];
  const steps: Step[] = [];

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

  let l = 0;
  let r = 1;
  let maxProfit = 0;

  // Init L
  steps.push({
    array: [...prices],
    highlights: [l],
    variables: { l, r: '-', maxProfit: '-' },
    explanation: 'Initialize left pointer l = 0 (potential buy day)',
    pseudoStep: 'SET l = 0'
  });
  addLines(2, 2, 3, 4);

  // Init R
  steps.push({
    array: [...prices],
    highlights: [l, r],
    variables: { l, r, maxProfit: '-' },
    explanation: 'Initialize right pointer r = 1 (potential sell day)',
    pseudoStep: 'SET r = 1'
  });
  addLines(3, 3, 4, 5);

  // Init maxProfit
  steps.push({
    array: [...prices],
    highlights: [l, r],
    variables: { l, r, maxProfit },
    explanation: 'Initialize maxProfit to 0',
    pseudoStep: 'SET maxProfit = 0'
  });
  addLines(4, 4, 5, 6);

  while (r < prices.length) {
    steps.push({
      array: [...prices],
      highlights: [l, r],
      variables: { l, r, maxProfit },
      explanation: `Check loop condition: r (${r}) < prices.length (${prices.length})`,
      pseudoStep: `WHILE r (${r}) < prices.length (${prices.length})  →  YES ✓`
    });
    addLines(5, 5, 6, 7);

    steps.push({
      array: [...prices],
      highlights: [l, r],
      variables: { l, r, maxProfit, 'prices[l]': prices[l], 'prices[r]': prices[r] },
      explanation: `Check if prices[l] ($${prices[l]}) < prices[r] ($${prices[r]}) (is buying at day l and selling at day r profitable?)`,
      pseudoStep: `IF prices[l] ($${prices[l]}) < prices[r] ($${prices[r]})  →  ${prices[l] < prices[r] ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(6, 6, 7, 8);

    if (prices[l] < prices[r]) {
      const profit = prices[r] - prices[l];
      const oldMaxProfit = maxProfit;
      maxProfit = Math.max(maxProfit, profit);

      steps.push({
        array: [...prices],
        highlights: [l, r],
        variables: { l, r, maxProfit, profit },
        explanation: `Profitable! Calculate profit = prices[r] - prices[l] = $${prices[r]} - $${prices[l]} = $${profit}. Update maxProfit = max(${oldMaxProfit}, ${profit}) = $${maxProfit}.`,
        pseudoStep: `SET maxProfit = MAX(maxProfit, prices[r] - prices[l])  →  MAX(${oldMaxProfit}, ${profit}) = ${maxProfit}`
      });
      addLines(7, 7, 8, 9);
    } else {
      l = r;
      steps.push({
        array: [...prices],
        highlights: [l, r],
        variables: { l, r, maxProfit },
        explanation: `Not profitable (buying at $${prices[l]} >= selling at $${prices[r]}). Shift left pointer l to r (${r}) to buy at this lower price.`,
        pseudoStep: `ELSE: l = r  →  l = ${r}`
      });
      addLines(9, 9, 10, 12);
    }

    steps.push({
      array: [...prices],
      highlights: [l, r],
      variables: { l, r, maxProfit },
      explanation: `Increment right pointer r to examine the next day's price.`,
      pseudoStep: `SET r = r + 1  →  ${r + 1}`
    });
    addLines(11, 10, 12, 14);
    r++;
  }

  steps.push({
    array: [...prices],
    highlights: [],
    variables: { l, r, maxProfit },
    explanation: `Check loop condition: r (${r}) < prices.length (${prices.length}). False, exit loop.`,
    pseudoStep: `WHILE r (${r}) < prices.length (${prices.length})  →  NO ✗`
  });
  addLines(5, 5, 6, 7);

  steps.push({
    array: [...prices],
    highlights: [],
    variables: { maxProfit },
    explanation: `Return the maximum profit found: $${maxProfit}`,
    pseudoStep: `RETURN maxProfit  →  ${maxProfit}`
  });
  addLines(13, 11, 14, 16);

  return { steps, stepLineNumbers };
}

export const BestTimeToBuyAndSellStockVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);
  const maxPrice = Math.max(...currentStep.array);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Best Time to Buy and Sell Stock (Sliding Window)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="flex items-end justify-center gap-2 h-48">
                {currentStep.array.map((value, idx) => {
                  const l = currentStep.variables.l;
                  const r = currentStep.variables.r;
                  const isL = idx === l;
                  const isR = idx === r;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[50px] relative">
                      {isL && <div className="absolute -top-6 text-xs font-bold text-green-500">L</div>}
                      {isR && <div className="absolute -top-6 text-xs font-bold text-blue-500">R</div>}
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isL || isR
                            ? 'bg-primary shadow-lg shadow-primary/50'
                            : 'bg-muted/60'
                        }`}
                        style={{ height: `${(value / maxPrice) * 100}%`, minHeight: '20px' }}
                      />
                      <span className="text-xs font-mono">${value}</span>
                      <span className="text-xs text-muted-foreground">{idx}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                Commentary
              </h4>
              <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap animate-fade-in">
                {currentStep.explanation}
              </p>
            </Card>
            <VariablePanel variables={currentStep.variables} />
          </div>
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
