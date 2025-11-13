import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DPMode } from "@/hooks/useDPGame";
import { Brain, Grid3x3, Type, Coins, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DPModeSelectionProps {
  onSelectMode: (mode: DPMode) => void;
}

export const DPModeSelection = ({ onSelectMode }: DPModeSelectionProps) => {
  const navigate = useNavigate();
  const modes = [
    {
      id: "fibonacci" as DPMode,
      name: "Fibonacci",
      description: "Learn 1D DP with the classic Fibonacci sequence",
      icon: Grid3x3,
      difficulty: "Beginner",
      formula: "dp[i] = dp[i-1] + dp[i-2]",
      color: "text-blue-500",
    },
    {
      id: "knapsack" as DPMode,
      name: "0/1 Knapsack",
      description: "Master 2D DP with weight-value optimization",
      icon: Brain,
      difficulty: "Intermediate",
      formula: "dp[i][w] = max(dp[i-1][w], ...)",
      color: "text-green-500",
    },
    {
      id: "lcs" as DPMode,
      name: "Longest Common Subsequence",
      description: "Compare strings using dynamic programming",
      icon: Type,
      difficulty: "Intermediate",
      formula: "dp[i][j] = match ? dp[i-1][j-1]+1 : ...",
      color: "text-purple-500",
    },
    {
      id: "coinChange" as DPMode,
      name: "Coin Change",
      description: "Find number of ways to make change",
      icon: Coins,
      difficulty: "Intermediate",
      formula: "dp[i][j] = dp[i-1][j] + dp[i][j-coin]",
      color: "text-orange-500",
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/games')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Button>
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Algorithm</h2>
        <p className="text-muted-foreground">Select a Dynamic Programming problem to solve</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Card key={mode.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 bg-primary/10 rounded-lg", mode.color)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mode.name}</CardTitle>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {mode.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{mode.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <code className="block bg-muted/50 p-2 rounded text-xs font-mono overflow-x-auto">
                  {mode.formula}
                </code>
                <Button
                  onClick={() => onSelectMode(mode.id)}
                  className="w-full"
                  variant="default"
                >
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">How to Play</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Click on empty cells (marked with ?) to enter values</p>
          <p>• Use the hint button to highlight parent cells</p>
          <p>• Toggle formula display to see the recurrence relation</p>
          <p>• Complete all cells correctly to advance to the next level</p>
          <p className="text-primary font-semibold">+10 per correct cell, -5 per wrong attempt</p>
        </CardContent>
      </Card>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
