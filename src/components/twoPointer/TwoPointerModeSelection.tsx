import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PointerMode } from "@/hooks/useTwoPointerGame";
import { Plus, Minus, X } from "lucide-react";

interface TwoPointerModeSelectionProps {
  onSelectMode: (mode: PointerMode) => void;
}

export const TwoPointerModeSelection = ({ onSelectMode }: TwoPointerModeSelectionProps) => {
  const modes = [
    {
      id: "sum" as PointerMode,
      name: "Sum Mode",
      description: "Find pairs where arr[L] + arr[R] equals the target",
      icon: Plus,
      difficulty: "Beginner",
      explanation: "Move left++ when sum < target, right-- when sum > target",
      color: "text-green-500",
    },
    {
      id: "difference" as PointerMode,
      name: "Difference Mode",
      description: "Find pairs where |arr[L] - arr[R]| equals the target",
      icon: Minus,
      difficulty: "Intermediate",
      explanation: "Adjust pointers to match the exact difference",
      color: "text-blue-500",
    },
    {
      id: "product" as PointerMode,
      name: "Product Mode",
      description: "Find pairs where arr[L] × arr[R] equals the target",
      icon: X,
      difficulty: "Advanced",
      explanation: "Balance multiplication by adjusting both pointers",
      color: "text-purple-500",
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Challenge</h2>
        <p className="text-muted-foreground">Master the two-pointer technique for finding pairs</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
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
          <p>• <strong className="text-blue-500">Left Pointer</strong> starts at the beginning of the array</p>
          <p>• <strong className="text-red-500">Right Pointer</strong> starts at the end of the array</p>
          <p>• Move pointers to find pairs that match the target condition</p>
          <p>• Click ✅ <strong>Check Pair</strong> when you think you've found a valid pair</p>
          <p>• Find all valid pairs to complete the level!</p>
          <p className="text-primary font-semibold">+100 per pair found, -20 for wrong checks</p>
        </CardContent>
      </Card>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
