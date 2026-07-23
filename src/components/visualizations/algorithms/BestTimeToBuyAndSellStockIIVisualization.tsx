import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Card } from '@/components/ui/card';

interface Step {
  prices: number[];
  i: number | null;
  highlights: number[];
  transactions: { from: number; to: number; profit: number }[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function maxProfit(prices: number[]): number {
    let profit = 0;
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1];
        }
    }
    return profit;
}`,

  python: `def maxProfit(prices: list[int]) -> int:
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]
    return profit`,

  java: `public int maxProfit(int[] prices) {
    int profit = 0;
    for (int i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1];
        }
    }
    return profit;
}`,

  cpp: `int maxProfit(vector<int>& prices) {
    int profit = 0;
    for (int i = 1; i < prices.size(); i++) {
        if (prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1];
        }
    }
    return profit;
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

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

  let profit = 0;
  const transactions: { from: number; to: number; profit: number }[] = [];

  // Step 0: Init profit = 0
  steps.push({
    prices,
    i: null,
    highlights: [],
    transactions: [],
    variables: { profit, i: '-', 'prices[i]': '-', 'prices[i-1]': '-' },
    explanation: 'Initialize profit = 0. This variable accumulates all daily transaction profits.',
    pseudoStep: 'SET profit = 0'
  });
  addLines(2, 2, 2, 2);

  for (let i = 1; i < prices.length; i++) {
    const prevPrice = prices[i - 1];
    const currPrice = prices[i];

    // Loop header check
    steps.push({
      prices,
      i,
      highlights: [i - 1, i],
      transactions: [...transactions],
      variables: { profit, i, 'prices[i]': currPrice, 'prices[i-1]': prevPrice },
      explanation: `Examine interval: Compare day ${i} ($${currPrice}) with day ${i - 1} ($${prevPrice}).`,
      pseudoStep: `FOR i = ${i} TO ${prices.length - 1}:`
    });
    addLines(3, 3, 3, 3);

    const isProfitable = currPrice > prevPrice;

    // Condition check
    steps.push({
      prices,
      i,
      highlights: [i - 1, i],
      transactions: [...transactions],
      variables: { profit, i, 'prices[i]': currPrice, 'prices[i-1]': prevPrice },
      explanation: `Check if current price ($${currPrice}) > previous price ($${prevPrice}) → ${isProfitable ? 'YES' : 'NO'}.`,
      pseudoStep: `IF prices[i] ($${currPrice}) > prices[i-1] ($${prevPrice}) → ${isProfitable ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(4, 4, 4, 4);

    if (isProfitable) {
      const diff = currPrice - prevPrice;
      profit += diff;
      transactions.push({ from: i - 1, to: i, profit: diff });

      // Add profit step
      steps.push({
        prices,
        i,
        highlights: [i - 1, i],
        transactions: [...transactions],
        variables: { profit, i, 'prices[i]': currPrice, 'prices[i-1]': prevPrice, diff },
        explanation: `Price increased! Buy on day ${i-1} ($${prevPrice}) and sell on day ${i} ($${currPrice}) to capture profit of $${diff}. Total profit becomes $${profit}.`,
        pseudoStep: `SET profit = profit + (prices[i] - prices[i-1]) → ${profit}`
      });
      addLines(5, 5, 5, 5);
    }
  }

  // Final return step
  steps.push({
    prices,
    i: null,
    highlights: [],
    transactions: [...transactions],
    variables: { profit, i: '-', 'prices[i]': '-', 'prices[i-1]': '-' },
    explanation: `Scanned all daily intervals. The maximum achievable profit is $${profit}.`,
    pseudoStep: `RETURN profit → ${profit}`
  });
  addLines(8, 6, 8, 8);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const BestTimeToBuyAndSellStockIIVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);
  const maxPrice = Math.max(...currentStep.prices);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Best Time to Buy and Sell Stock II (Greedy Approach)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="flex items-end justify-center gap-2 h-48">
                {currentStep.prices.map((value, idx) => {
                  const isHighlighted = currentStep.highlights.includes(idx);
                  
                  // Check if a transaction happened ending or starting at this index
                  const activeTx = currentStep.transactions.find(tx => tx.to === idx);

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[50px] relative">
                      
                      {/* Price increase tag */}
                      {activeTx && (
                        <div className="absolute -top-7 px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-bold shadow animate-bounce">
                          +${activeTx.profit}
                        </div>
                      )}

                      {/* Bar charts */}
                      <div
                        className={`w-full rounded-t transition-all duration-200 ${
                          isHighlighted
                            ? 'bg-primary shadow-lg shadow-primary/50 scale-105'
                            : activeTx
                            ? 'bg-emerald-500/80 shadow-emerald-500/20'
                            : 'bg-muted/60'
                        }`}
                        style={{ height: `${(value / maxPrice) * 100}%`, minHeight: '20px' }}
                      />
                      
                      <span className="text-xs font-mono">${value}</span>
                      
                      {/* Highlight label index */}
                      <span className={`text-[10px] ${isHighlighted ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {idx}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Captured Transactions List */}
          {currentStep.transactions.length > 0 && (
            <Card className="p-4 bg-muted/30 border-border/50 space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Captured Transactions</h4>
              <div className="flex flex-col gap-2">
                {currentStep.transactions.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono border-b border-border/30 pb-2 last:border-0 last:pb-0">
                    <div className="text-foreground">
                      <span>Day {tx.from} (${currentStep.prices[tx.from]})</span>
                      <span className="mx-2 text-muted-foreground">→</span>
                      <span>Day {tx.to} (${currentStep.prices[tx.to]})</span>
                    </div>
                    <span className="bg-emerald-500 text-white dark:text-black font-bold px-2 py-0.5 rounded text-[10px]">
                      +${tx.profit}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="mt-auto space-y-4">
            <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                Commentary
              </h4>
              <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap animate-fade-in">
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
