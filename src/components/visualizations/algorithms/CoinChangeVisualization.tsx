import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  array: (number | string)[];
  highlighting: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const CoinChangeVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const coins = [1, 2, 5];
  const amount = 6;

  // Helper to init array with logic value
  const INF = 7; // amount + 1

  const steps: Step[] = [
    {
      array: [],
      highlighting: [],
      variables: { coins: '[1, 2, 5]', amount: 6 },
      explanation: "Starting with coins [1, 2, 5] and target amount 6.\nOur goal is to find the minimum number of coins to sum to exactly 6.",
      highlightedLines: [1],
      lineExecution: "function coinChange(...) {"
    },
    {
      array: [7, 7, 7, 7, 7, 7, 7], // 0 to 6
      highlighting: [],
      variables: { coins: '[1, 2, 5]', amount: 6, 'amount + 1': 7 },
      explanation: "Initialize tracking array 'dp' of size 7 (amount + 1).\nWe fill it with 7 (representing Infinity, an impossible state) initially.",
      highlightedLines: [2],
      lineExecution: "const dp: number[] = new Array(amount + 1).fill(amount + 1);"
    },
    {
      array: [0, 7, 7, 7, 7, 7, 7],
      highlighting: [0],
      variables: { amount: 6 },
      explanation: "Base case setup: It takes exactly 0 coins to make an amount of 0.",
      highlightedLines: [3],
      lineExecution: "dp[0] = 0;"
    },
    // a = 1
    {
      array: [0, 7, 7, 7, 7, 7, 7],
      highlighting: [1],
      variables: { a: 1, amount: 6 },
      explanation: "Outer loop starts: Target amount 'a' = 1.\nWe want to find the minimum coins to make 1.",
      highlightedLines: [4],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 7, 7, 7, 7, 7, 7],
      highlighting: [1],
      variables: { a: 1, coin: 1 },
      explanation: "Inner loop starts: Try using the coin of value 1.",
      highlightedLines: [5],
      lineExecution: "for (const coin of coins) // coin = 1"
    },
    {
      array: [0, 7, 7, 7, 7, 7, 7],
      highlighting: [1],
      variables: { a: 1, coin: 1 },
      explanation: "Check: Is current amount minus coin >= 0? (1 - 1 = 0). Yes, we can use this coin.",
      highlightedLines: [6],
      lineExecution: "if (a - coin >= 0)"
    },
    {
      array: [0, 1, 7, 7, 7, 7, 7],
      highlighting: [1],
      variables: { a: 1, coin: 1, 'dp[1]': 1 },
      explanation: "We take 1 coin + the optimal coins for the remainder (dp[1-1] -> dp[0] -> 0).\nTotal coins = 1. Update dp[1] to Math.min(Infinity, 1) = 1.",
      highlightedLines: [7],
      lineExecution: "dp[a] = Math.min(dp[a], 1 + dp[a - coin]);"
    },
    // a = 2
    {
      array: [0, 1, 7, 7, 7, 7, 7],
      highlighting: [2],
      variables: { a: 2 },
      explanation: "Move to target amount 'a' = 2.",
      highlightedLines: [4],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 1, 7, 7, 7, 7, 7],
      highlighting: [2],
      variables: { a: 2, coin: 1 },
      explanation: "Try coin = 1. Can we use it? (2 - 1 >= 0). Yes.",
      highlightedLines: [5, 6],
      lineExecution: "if (a - coin >= 0)"
    },
    {
      array: [0, 1, 2, 7, 7, 7, 7],
      highlighting: [2],
      variables: { a: 2, coin: 1, 'dp[2]': 2 },
      explanation: "Update dp[2] to minimum between current (Infinity) and 1 + optimal for remainder (dp[1] = 1).\ndp[2] = 2.",
      highlightedLines: [7],
      lineExecution: "dp[2] = 2"
    },
    {
      array: [0, 1, 2, 7, 7, 7, 7],
      highlighting: [2],
      variables: { a: 2, coin: 2 },
      explanation: "Try the next coin = 2. Can we use it? (2 - 2 >= 0). Yes.",
      highlightedLines: [5, 6],
      lineExecution: "if (a - coin >= 0)"
    },
    {
      array: [0, 1, 1, 7, 7, 7, 7],
      highlighting: [2],
      variables: { a: 2, coin: 2, 'dp[2]': 1 },
      explanation: "1 coin + optimal remainder dp[0] (0 coins) = 1 total coin.\nMath.min(previous 2 coins, 1 coin) = 1. Much more efficient!",
      highlightedLines: [7],
      lineExecution: "dp[2] = 1"
    },
    // a = 3
    {
      array: [0, 1, 1, 7, 7, 7, 7],
      highlighting: [3],
      variables: { a: 3 },
      explanation: "Move to target amount 'a' = 3.",
      highlightedLines: [4],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 1, 1, 2, 7, 7, 7],
      highlighting: [3],
      variables: { a: 3, coin: 1, 'dp[3]': 2 },
      explanation: "Try coin = 1: dp[3] = Math.min(Infinity, 1 + dp[2]) = 1 + 1 = 2.",
      highlightedLines: [7],
      lineExecution: "dp[3] = 2"
    },
    {
      array: [0, 1, 1, 2, 7, 7, 7],
      highlighting: [3],
      variables: { a: 3, coin: 2, 'dp[3]': 2 },
      explanation: "Try coin = 2: dp[3] = Math.min(2, 1 + dp[1]) = Math.min(2, 2) = 2. No improvement.",
      highlightedLines: [7],
      lineExecution: "dp[3] = 2"
    },
    // a = 4
    {
      array: [0, 1, 1, 2, 7, 7, 7],
      highlighting: [4],
      variables: { a: 4 },
      explanation: "Move to target amount 'a' = 4.",
      highlightedLines: [4],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 1, 1, 2, 3, 7, 7],
      highlighting: [4],
      variables: { a: 4, coin: 1, 'dp[4]': 3 },
      explanation: "Try coin = 1: dp[4] = 1 + dp[3] = 3.",
      highlightedLines: [7],
      lineExecution: "dp[4] = 3"
    },
    {
      array: [0, 1, 1, 2, 2, 7, 7],
      highlighting: [4],
      variables: { a: 4, coin: 2, 'dp[4]': 2 },
      explanation: "Try coin = 2: dp[4] = 1 + dp[2] (1) = 2. Improved!",
      highlightedLines: [7],
      lineExecution: "dp[4] = 2"
    },
    // a = 5
    {
      array: [0, 1, 1, 2, 2, 7, 7],
      highlighting: [5],
      variables: { a: 5 },
      explanation: "Move to target amount 'a' = 5.",
      highlightedLines: [4],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 1, 1, 2, 2, 3, 7],
      highlighting: [5],
      variables: { a: 5, coin: 1, 'dp[5]': 3 },
      explanation: "Try coin = 1: dp[5] = 1 + dp[4] = 3.",
      highlightedLines: [7],
      lineExecution: "dp[5] = 3"
    },
    {
      array: [0, 1, 1, 2, 2, 3, 7],
      highlighting: [5],
      variables: { a: 5, coin: 2, 'dp[5]': 3 },
      explanation: "Try coin = 2: dp[5] = 1 + dp[3] = 3. No change.",
      highlightedLines: [7],
      lineExecution: "dp[5] = 3"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 7],
      highlighting: [5],
      variables: { a: 5, coin: 5, 'dp[5]': 1 },
      explanation: "Try coin = 5: dp[5] = 1 + dp[0] (0) = 1. Direct match with exact coin!",
      highlightedLines: [7],
      lineExecution: "dp[5] = 1"
    },
    // a = 6
    {
      array: [0, 1, 1, 2, 2, 1, 7],
      highlighting: [6],
      variables: { a: 6 },
      explanation: "Move to target amount 'a' = 6 (Last iteration).",
      highlightedLines: [4],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2],
      highlighting: [6],
      variables: { a: 6, coin: 1, 'dp[6]': 2 },
      explanation: "Try coin = 1: dp[6] = 1 + dp[5] (1) = 2.",
      highlightedLines: [7],
      lineExecution: "dp[6] = 2"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2],
      highlighting: [6],
      variables: { a: 6, coin: 2, 'dp[6]': 2 },
      explanation: "Try coin = 2: dp[6] = 1 + dp[4] (2) = 3. Math.min(2, 3) = 2. Keep 2.",
      highlightedLines: [7],
      lineExecution: "dp[6] = 1 + dp[4] (3) >= 2"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2],
      highlighting: [6],
      variables: { a: 6, coin: 5, 'dp[6]': 2 },
      explanation: "Try coin = 5: dp[6] = 1 + dp[1] (1) = 2. Same value, no change.",
      highlightedLines: [7],
      lineExecution: "dp[6] = 1 + dp[1] (2) >= 2"
    },
    // End
    {
      array: [0, 1, 1, 2, 2, 1, 2],
      highlighting: [],
      variables: { amount: 6 },
      explanation: "Outer loop finished perfectly. We now check the final return condition.",
      highlightedLines: [11],
      lineExecution: "return dp[amount] !== amount + 1 ..."
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2],
      highlighting: [6],
      variables: { result: 2 },
      explanation: "Since dp[6] is 2 (which is not Infinity), we return 2.\nOptimal solution is e.g. 5 + 1.",
      highlightedLines: [11],
      lineExecution: "return 2"
    }
  ];

  const code = `function coinChange(coins: number[], amount: number): number {
  const dp: number[] = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (a - coin >= 0) {
        dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
      }
    }
  }
  return dp[amount] !== amount + 1 ? dp[amount] : -1;
}`;

  const step = steps[currentStep];

  const displayArray = step.array.map(v => v === 7 ? '∞' : v);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm relative overflow-hidden">
               <div className="flex flex-col gap-4 mb-6 border-b-2 border-primary/10 pb-4">
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Available Coins</h3>
                    <div className="flex gap-3">
                       {coins.map((coinValue, idx) => {
                          const isTesting = step.variables.coin === coinValue;
                          return (
                            <div key={idx} className={`relative flex items-center justify-center w-12 h-12 rounded-full border-[3px] font-black text-lg ${
                              isTesting 
                                ? 'bg-orange-500/20 border-orange-500 text-orange-500 scale-[1.15] shadow-[0_0_15px_rgba(249,115,22,0.4)] z-10' 
                                : 'bg-yellow-500/10 border-yellow-500/70 text-yellow-600 dark:text-yellow-500 opacity-70'
                            }`}>
                               <div className="absolute w-[80%] h-[80%] rounded-full border border-current opacity-30 pointer-events-none"></div>
                               {coinValue}
                            </div>
                          )
                       })}
                    </div>
                 </div>
                 <div>
                    <h3 className="text-xs font-normal text-primary/70 mb-1">Objective</h3>
                    <div className="text-sm font-normal text-primary bg-primary/10 px-4 py-2 rounded inline-block text-center shadow-sm border border-primary/10">
                        <div className="text-xs text-primary/80 mb-0.5">Target</div>
                        <div className="text-lg font-semibold">{amount}</div>
                    </div>
                 </div>
               </div>

              <h3 className="text-xs font-black uppercase tracking-widest text-primary/70 mb-3">
                 DP Tracking Array (Min Coins Needed)
              </h3>
              
              <div className="flex items-center gap-1.5 overflow-x-auto pb-4 pt-2 px-1">
                {displayArray.map((value, index) => {
                  const isHighlighted = step.highlighting.includes(index);
                  const isBase = index === 0;
                  
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-1.5 flex-shrink-0"
                    >
                      <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                          isHighlighted
                            ? 'bg-primary text-primary-foreground border-2 border-primary shadow-lg ring-2 ring-primary/30 z-10'
                            : value === '∞'
                              ? 'bg-muted/30 text-muted-foreground/30 border border-border/40 border-dashed'
                              : isBase 
                                ? 'bg-green-500/10 border border-green-500/30 text-green-500/80'
                                : 'bg-muted/80 text-foreground/80 border border-border'
                        }`}
                      >
                        {value}
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${isHighlighted ? 'text-primary' : 'text-muted-foreground/50'}`}>
                        Amt {index}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-5 border-l-4 border-primary bg-primary/5 relative overflow-hidden shadow-sm">
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
                   <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                     {step.explanation}
                   </p>
                </div>
              </div>
            </Card>
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
           <div className="p-1">
             <VariablePanel variables={step.variables} />
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