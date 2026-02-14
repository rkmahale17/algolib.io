import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, Award } from "lucide-react";

interface SlidingWindowVictoryModalProps {
  isOpen: boolean;
  score: number;
  moves: number;
  correctChecks: number;
  wrongChecks: number;
  accuracy: number;
  grade: string;
  onNextLevel: () => void;
  onBackToMenu: () => void;
}

export const SlidingWindowVictoryModal = ({
  isOpen,
  score,
  moves,
  correctChecks,
  wrongChecks,
  accuracy,
  grade,
  onNextLevel,
  onBackToMenu,
}: SlidingWindowVictoryModalProps) => {
  const getGradeColor = () => {
    if (grade === "S") return "text-yellow-500";
    if (grade === "A") return "text-green-500";
    if (grade === "B") return "text-blue-500";
    if (grade === "C") return "text-blue-500";
    return "text-gray-500";
  };
  
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Window Mastered!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className={`text-6xl font-bold ${getGradeColor()}`}>
              {grade}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <span className="font-medium">Score</span>
              </div>
              <span className="text-2xl font-bold text-primary">{score}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Moves</span>
                </div>
                <div className="text-xl font-bold">{moves}</div>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Accuracy</span>
                </div>
                <div className="text-xl font-bold">{accuracy}%</div>
              </div>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Correct Checks:</span>
                <span className="font-medium text-green-500">{correctChecks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wrong Checks:</span>
                <span className="font-medium text-red-500">{wrongChecks}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm">
            <p className="font-semibold text-primary mb-1">🎯 You just mastered the sliding window!</p>
            <p className="text-muted-foreground">
              You expanded and shrunk the window to maintain the optimal condition. This is a key pattern in algorithm interviews!
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={onNextLevel} className="flex-1" size="lg">
              Next Level
            </Button>
            <Button onClick={onBackToMenu} variant="outline" className="flex-1" size="lg">
              Back to Menu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
