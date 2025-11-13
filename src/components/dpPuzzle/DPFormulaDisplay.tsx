import { Card } from "@/components/ui/card";
import { DPMode } from "@/hooks/useDPGame";

interface DPFormulaDisplayProps {
  mode: DPMode;
  show: boolean;
}

export const DPFormulaDisplay = ({ mode, show }: DPFormulaDisplayProps) => {
  if (!show) return null;
  
  const formulas: Record<DPMode, { title: string; formula: string; explanation: string }> = {
    fibonacci: {
      title: "Fibonacci Recurrence",
      formula: "dp[i] = dp[i-1] + dp[i-2]",
      explanation: "Each number is the sum of the two preceding ones",
    },
    knapsack: {
      title: "0/1 Knapsack Recurrence",
      formula: "dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])",
      explanation: "Maximum value: either skip item or include it (if weight allows)",
    },
    lcs: {
      title: "Longest Common Subsequence",
      formula: "dp[i][j] = (s1[i-1] == s2[j-1]) ? dp[i-1][j-1] + 1 : max(dp[i-1][j], dp[i][j-1])",
      explanation: "If characters match: add 1 to diagonal. Otherwise: take max from top or left",
    },
    coinChange: {
      title: "Coin Change (Number of Ways)",
      formula: "dp[i][j] = dp[i-1][j] + dp[i][j-coin[i-1]]",
      explanation: "Ways to make amount: exclude coin + include coin (if amount allows)",
    },
  };
  
  const { title, formula, explanation } = formulas[mode];
  
  return (
    <Card className="p-4 bg-primary/5 border-primary/20">
      <h3 className="font-semibold text-primary mb-2">{title}</h3>
      <code className="block bg-muted/50 p-3 rounded text-sm font-mono mb-2 overflow-x-auto">
        {formula}
      </code>
      <p className="text-sm text-muted-foreground">{explanation}</p>
    </Card>
  );
};
