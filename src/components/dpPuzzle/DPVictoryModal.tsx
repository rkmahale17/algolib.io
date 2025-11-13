import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, Award } from "lucide-react";

interface DPVictoryModalProps {
  isOpen: boolean;
  score: number;
  correctCells: number;
  totalCells: number;
  wrongAttempts: number;
  hintsUsed: number;
  accuracy: number;
  grade: string;
  onNextLevel: () => void;
  onBackToMenu: () => void;
}

export const DPVictoryModal = ({
  isOpen,
  score,
  correctCells,
  totalCells,
  wrongAttempts,
  hintsUsed,
  accuracy,
  grade,
  onNextLevel,
  onBackToMenu,
}: DPVictoryModalProps) => {
  const getGradeColor = () => {
    if (grade === "S") return "text-yellow-500";
    if (grade === "A") return "text-green-500";
    if (grade === "B") return "text-blue-500";
    if (grade === "C") return "text-purple-500";
    return "text-gray-500";
  };
  
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Puzzle Complete!
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
                  <span className="text-sm font-medium">Correct</span>
                </div>
                <div className="text-xl font-bold">{correctCells}/{totalCells}</div>
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
                <span className="text-muted-foreground">Wrong Attempts:</span>
                <span className="font-medium">{wrongAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hints Used:</span>
                <span className="font-medium">{hintsUsed}/3</span>
              </div>
            </div>
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
