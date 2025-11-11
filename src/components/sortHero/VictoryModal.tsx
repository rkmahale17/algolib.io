import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Home } from "lucide-react";

interface VictoryModalProps {
  isOpen: boolean;
  score: number;
  moves: number;
  errors: number;
  grade: string;
  onNextLevel: () => void;
  onBackToMenu: () => void;
}

export const VictoryModal = ({ 
  isOpen,
  score, 
  moves, 
  errors, 
  grade, 
  onNextLevel, 
  onBackToMenu 
}: VictoryModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Level Complete!</DialogTitle>
          <DialogDescription className="text-center">
            Great job sorting those numbers!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center py-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Final Score</p>
            <p className="text-5xl font-bold text-primary">{score}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Grade</p>
              <p className="text-3xl font-bold text-secondary">{grade}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Moves</p>
              <p className="text-2xl font-bold">{moves}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Errors</p>
              <p className="text-2xl font-bold text-destructive">{errors}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onBackToMenu} className="flex-1">
              <Home className="mr-2 h-4 w-4" /> Menu
            </Button>
            <Button onClick={onNextLevel} className="flex-1">
              Next Level <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
