import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WindowMode } from "@/hooks/useSlidingWindowGame";
import { TrendingUp, Grid3x3, Type, Target } from "lucide-react";

interface SlidingWindowModeSelectionProps {
  onSelectMode: (mode: WindowMode) => void;
}

export const SlidingWindowModeSelection = ({ onSelectMode }: SlidingWindowModeSelectionProps) => {
  const modes = [
    {
      id: "maxSum" as WindowMode,
      name: "Max Sum",
      description: "Find the maximum sum subarray within a target limit",
      icon: TrendingUp,
      difficulty: "Beginner",
      explanation: "Expand until sum exceeds target, then shrink from left",
      color: "text-green-500",
    },
    {
      id: "targetSum" as WindowMode,
      name: "Target Sum",
      description: "Find a window with exact target sum",
      icon: Target,
      difficulty: "Intermediate",
      explanation: "Expand to increase sum, shrink to decrease",
      color: "text-blue-500",
    },
    {
      id: "distinct" as WindowMode,
      name: "Distinct Elements",
      description: "Maintain only distinct elements in the window",
      icon: Grid3x3,
      difficulty: "Intermediate",
      explanation: "Shrink when duplicates appear",
      color: "text-purple-500",
    },
    {
      id: "substring" as WindowMode,
      name: "Longest Substring",
      description: "Find longest window without repeating elements",
      icon: Type,
      difficulty: "Advanced",
      explanation: "Expand for length, shrink on duplicates",
      color: "text-orange-500",
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Challenge</h2>
        <p className="text-muted-foreground">Master the sliding window technique</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Card key={mode.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
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
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <span className="font-semibold">Strategy:</span> {mode.explanation}
                </div>
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
          <p>• Use ➡️ <strong>Expand</strong> to grow the window to the right</p>
          <p>• Use ⬅️ <strong>Shrink</strong> to contract the window from the left</p>
          <p>• Click ✅ <strong>Check</strong> to validate your current window</p>
          <p>• Use keyboard: Arrow keys to move, Space to check</p>
          <p className="text-primary font-semibold">+50 per correct check, -20 for wrong attempts</p>
        </CardContent>
      </Card>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
