import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Home, TrendingUp } from "lucide-react";

interface StackGameOverProps {
  isOpen: boolean;
  score: number;
  correctMoves: number;
  totalMoves: number;
  maxCombo: number;
  level: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const StackGameOver = ({ 
  isOpen,
  score, 
  correctMoves,
  totalMoves,
  maxCombo,
  level,
  onRestart, 
  onBackToMenu 
}: StackGameOverProps) => {
  const accuracy = totalMoves > 0 ? Math.round((correctMoves / totalMoves) * 100) : 0;
  
  const getGrade = () => {
    if (accuracy >= 95) return "A+";
    if (accuracy >= 85) return "A";
    if (accuracy >= 70) return "B";
    return "C";
  };

  const getMessage = () => {
    if (accuracy >= 95) return "Perfect Stack Master! 🎉";
    if (accuracy >= 85) return "Excellent Performance! 🌟";
    if (accuracy >= 70) return "Good Job! Keep Practicing! 💪";
    return "Keep Learning! Practice Makes Perfect! 📚";
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Game Over!</DialogTitle>
          <DialogDescription className="text-center">
            {getMessage()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center py-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Final Score</p>
            <p className="text-5xl font-bold text-primary">{score}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-1 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Grade</p>
              <p className="text-3xl font-bold text-secondary">{getGrade()}</p>
            </div>
            <div className="text-center space-y-1 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-2xl font-bold">{level}</p>
            </div>
            <div className="text-center space-y-1 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold text-primary">{accuracy}%</p>
            </div>
            <div className="text-center space-y-1 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Max Combo</p>
              <p className="text-2xl font-bold text-secondary">×{maxCombo}</p>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Correct Moves:</span>
              <span className="font-bold text-green-500">{correctMoves}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Moves:</span>
              <span className="font-bold">{totalMoves}</span>
            </div>
          </div>

          <div className="p-3 bg-primary/10 rounded-lg text-xs text-center text-muted-foreground">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            That's exactly how compilers validate parentheses using stacks!
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onBackToMenu} className="flex-1">
              <Home className="mr-2 h-4 w-4" /> Menu
            </Button>
            <Button onClick={onRestart} className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" /> Play Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
