import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  prices: number[];
  buy: number[];
  sell: number[];
  cooldown: number[];
  i: number;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function maxProfit(prices: number[]): number {
  if (!prices || prices.length <= 1) {
    return 0;
  }
  const n = prices.length;
  const buy = new Array(n).fill(0);
  const sell = new Array(n).fill(0);
  const cooldown = new Array(n).fill(0);
  buy[0] = -prices[0];
  cooldown[0] = 0;
  sell[0] = 0;
  for (let i = 1; i < n; i++) {
    buy[i] = Math.max(cooldown[i - 1] - prices[i], buy[i - 1]);
    sell[i] = buy[i - 1] + prices[i];
    cooldown[i] = Math.max(cooldown[i - 1], sell[i - 1]);
  }
  return Math.max(sell[n - 1], cooldown[n - 1]);
}`,
  python: `def maxProfit(prices: list[int]) -> int:
    n = len(prices)
    if n == 0:
        return 0
    buy = [0] * n
    sell = [0] * n
    cooldown = [0] * n
    buy[0] = -prices[0]
    for i in range(1, n):
        buy[i] = max(cooldown[i - 1] - prices[i], buy[i - 1])
        sell[i] = buy[i - 1] + prices[i]
        cooldown[i] = max(cooldown[i - 1], sell[i - 1])
    return max(sell[n - 1], cooldown[n - 1])`,
  java: `public static class Solution {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length <= 1) {
            return 0;
        }
        int n = prices.length;
        int[] buy = new int[n];
        int[] sell = new int[n];
        int[] cooldown = new int[n];
        buy[0] = -prices[0];
        sell[0] = 0;
        cooldown[0] = 0;
        for (int i = 1; i < n; i++) {
            buy[i] = Math.max(buy[i - 1], cooldown[i - 1] - prices[i]);
            sell[i] = buy[i - 1] + prices[i];
            cooldown[i] = Math.max(cooldown[i - 1], sell[i - 1]);
        }
        return Math.max(sell[n - 1], cooldown[n - 1]);
    }
}`,
  cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int n = prices.size();
        if (n == 0) return 0;
        vector<int> buy(n, 0);
        vector<int> sell(n, 0);
        vector<int> cooldown(n, 0);
        buy[0] = -prices[0];
        for (int i = 1; i < n; ++i) {
            buy[i] = max(buy[i - 1], cooldown[i - 1] - prices[i]);
            sell[i] = buy[i - 1] + prices[i];
            cooldown[i] = max({cooldown[i - 1], sell[i - 1], buy[i-1]});
        }
        return max({cooldown[n - 1], sell[n - 1], buy[n-1]});
    }
};`
};

export const BestTimeToBuyAndSellStockWithCooldownVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const prices = useMemo(() => [1, 2, 3, 0, 2], []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const n = prices.length;
    let buy = new Array(n).fill(0);
    let sell = new Array(n).fill(0);
    let cooldown = new Array(n).fill(0);

    const addStep = (
      i: number,
      explanation: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, java: number, cpp: number
    ) => {
      stepsList.push({
        prices,
        buy: [...buy],
        sell: [...sell],
        cooldown: [...cooldown],
        i,
        explanation,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    addStep(
      -1,
      "Function started. Input prices array received.",
      "maxProfit(prices=[1,2,3,0,2])",
      { prices: `[${prices.join(', ')}]` },
      1, 1, 2, 3
    );

    addStep(
      -1,
      `Check if prices array is empty or has only 1 day. Prices length is ${prices.length}, so we continue.`,
      "IF prices.length <= 1  →  5 <= 1 (NO)",
      { prices: `[${prices.join(', ')}]`, length: prices.length },
      2, 3, 3, 5
    );

    addStep(
      -1,
      "Initialize DP arrays `buy`, `sell`, and `cooldown` with 0s. Size is equal to the number of days.",
      "SET buy = [0]*n, sell = [0]*n, cooldown = [0]*n",
      { n, buy: `[${buy.join(', ')}]`, sell: `[${sell.join(', ')}]`, cooldown: `[${cooldown.join(', ')}]` },
      6, 5, 7, 6
    );

    buy[0] = -prices[0];
    cooldown[0] = 0;
    sell[0] = 0;
    
    addStep(
      0,
      `Initialize base cases for day 0.\nbuy[0] = -prices[0] = -${prices[0]}\ncooldown[0] = 0\nsell[0] = 0`,
      "SET buy[0] = -prices[0], cooldown[0] = 0, sell[0] = 0",
      { "prices[0]": prices[0], "buy[0]": buy[0], "sell[0]": sell[0], "cooldown[0]": cooldown[0] },
      9, 8, 10, 9
    );

    for (let i = 1; i < n; i++) {
      addStep(
        i,
        `Processing day ${i}. Price of stock is $${prices[i]}.`,
        `FOR i FROM 1 TO n-1  →  i = ${i}`,
        { i, "prices[i]": prices[i] },
        12, 9, 13, 10
      );

      const prevCooldown = cooldown[i - 1];
      const prevBuy = buy[i - 1];
      buy[i] = Math.max(prevCooldown - prices[i], prevBuy);
      
      addStep(
        i,
        `Update buy[${i}]: Max of (buying today after cooling down yesterday, OR holding the previously bought stock)\nMax(${prevCooldown} - ${prices[i]}, ${prevBuy}) = ${buy[i]}`,
        `SET buy[i] = max(cooldown[i-1] - prices[i], buy[i-1])  →  buy[${i}] = ${buy[i]}`,
        { i, "prices[i]": prices[i], "cooldown[i-1]": prevCooldown, "buy[i-1]": prevBuy, "buy[i]": buy[i] },
        13, 10, 14, 11
      );

      sell[i] = prevBuy + prices[i];
      addStep(
        i,
        `Update sell[${i}]: We can only sell today if we bought or held a stock up to yesterday.\n${prevBuy} + ${prices[i]} = ${sell[i]}`,
        `SET sell[i] = buy[i-1] + prices[i]  →  sell[${i}] = ${sell[i]}`,
        { i, "prices[i]": prices[i], "buy[i-1]": prevBuy, "sell[i]": sell[i] },
        14, 11, 15, 12
      );

      const prevSell = sell[i - 1];
      cooldown[i] = Math.max(prevCooldown, prevSell);
      addStep(
        i,
        `Update cooldown[${i}]: Max of (staying in cooldown, OR having sold stock yesterday)\nMax(${prevCooldown}, ${prevSell}) = ${cooldown[i]}`,
        `SET cooldown[i] = max(cooldown[i-1], sell[i-1])  →  cooldown[${i}] = ${cooldown[i]}`,
        { i, "cooldown[i-1]": prevCooldown, "sell[i-1]": prevSell, "cooldown[i]": cooldown[i] },
        15, 12, 16, 13
      );
    }

    const result = Math.max(sell[n - 1], cooldown[n - 1]);
    addStep(
      n,
      `Return the max profit on the last day, which must be either after selling or resting in cooldown.\nMax(${sell[n-1]}, ${cooldown[n-1]}) = ${result}`,
      `RETURN max(sell[n-1], cooldown[n-1])  →  ${result}`,
      { "sell[n-1]": sell[n-1], "cooldown[n-1]": cooldown[n-1], result },
      17, 13, 18, 15
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, [prices]);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-sm font-bold text-foreground mb-4 opacity-90">
              Buy and Sell Stock with Cooldown (DP Table)
            </h2>
            <Card className="p-6 bg-card/60 backdrop-blur border border-border shadow-sm overflow-hidden relative">
              <div className="flex flex-col gap-4">
                
                {/* Headers */}
                <div className="flex items-center gap-2">
                  <div className="w-20 font-mono text-sm opacity-50">Day</div>
                  {prices.map((_, idx) => (
                    <div key={idx} className={`flex-1 text-center font-mono text-sm ${idx === step.i ? 'text-primary font-bold' : 'opacity-70'}`}>
                      {idx}
                    </div>
                  ))}
                </div>
                
                {/* Prices */}
                <div className="flex items-center gap-2">
                  <div className="w-20 font-bold text-sm">Price</div>
                  {prices.map((price, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-1 h-12 flex items-center justify-center border rounded-lg font-bold transition-all duration-100 ${
                        idx === step.i 
                          ? 'border-primary bg-primary/20 text-primary scale-105 shadow-sm' 
                          : 'border-border/50 bg-background/50'
                      }`}
                    >
                      ${price}
                    </div>
                  ))}
                </div>

                <div className="h-px bg-border/50 my-2" />
                
                {/* Buy Array */}
                <div className="flex items-center gap-2">
                  <div className="w-20 font-bold text-sm text-blue-500">Buy</div>
                  {prices.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-1 h-10 flex items-center justify-center border rounded font-mono transition-all ${
                        idx <= step.i || (idx === 0 && step.i >= 0)
                          ? idx === step.i ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-600/80 dark:text-blue-400/80'
                          : 'border-dashed border-border/30 text-muted-foreground/30'
                      }`}
                    >
                      {(idx <= step.i || (idx === 0 && step.i >= 0)) ? step.buy[idx] : '-'}
                    </div>
                  ))}
                </div>

                {/* Sell Array */}
                <div className="flex items-center gap-2">
                  <div className="w-20 font-bold text-sm text-green-500">Sell</div>
                  {prices.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-1 h-10 flex items-center justify-center border rounded font-mono transition-all ${
                        idx <= step.i || (idx === 0 && step.i >= 0)
                          ? idx === step.i ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400' : 'bg-green-500/10 border-green-500/30 text-green-600/80 dark:text-green-400/80'
                          : 'border-dashed border-border/30 text-muted-foreground/30'
                      }`}
                    >
                      {(idx <= step.i || (idx === 0 && step.i >= 0)) ? step.sell[idx] : '-'}
                    </div>
                  ))}
                </div>

                {/* Cooldown Array */}
                <div className="flex items-center gap-2">
                  <div className="w-20 font-bold text-sm text-purple-500">Cooldown</div>
                  {prices.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-1 h-10 flex items-center justify-center border rounded font-mono transition-all ${
                        idx <= step.i || (idx === 0 && step.i >= 0)
                          ? idx === step.i ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400' : 'bg-purple-500/10 border-purple-500/30 text-purple-600/80 dark:text-purple-400/80'
                          : 'border-dashed border-border/30 text-muted-foreground/30'
                      }`}
                    >
                      {(idx <= step.i || (idx === 0 && step.i >= 0)) ? step.cooldown[idx] : '-'}
                    </div>
                  ))}
                </div>

              </div>
            </Card>
          </div>

          <div>
             <Card className="p-4 border-primary/20 bg-primary/5 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                       Commentary
                    </h4>
                    <p className="text-[13px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                       {step.explanation}
                    </p>
                  </div>
                </div>
             </Card>
          </div>
          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
        />
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
export default BestTimeToBuyAndSellStockWithCooldownVisualization;
