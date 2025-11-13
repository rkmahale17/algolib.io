import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Home, Target } from "lucide-react";

interface GraphVictoryModalProps {
  isOpen: boolean;
  score: number;
  moves: number;
  visitedNodes: number;
  pathLength: number;
  onNextLevel: () => void;
  onBackToMenu: () => void;
  onCompareModes?: () => void;
}

export const GraphVictoryModal = ({ 
  isOpen,
  score, 
  moves, 
  visitedNodes,
  pathLength,
  onNextLevel, 
  onBackToMenu,
  onCompareModes
}: GraphVictoryModalProps) => {
  const getGrade = () => {
    if (score >= 800) return "A+";
    if (score >= 600) return "A";
    if (score >= 400) return "B";
    return "C";
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Goal Reached!</DialogTitle>
          <DialogDescription className="text-center">
            You successfully navigated through the maze!
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
              <p className="text-sm text-muted-foreground">Moves</p>
              <p className="text-2xl font-bold">{moves}</p>
            </div>
            <div className="text-center space-y-1 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Visited</p>
              <p className="text-2xl font-bold text-primary">{visitedNodes}</p>
            </div>
            <div className="text-center space-y-1 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Path Length</p>
              <p className="text-2xl font-bold text-secondary">{pathLength}</p>
            </div>
          </div>

          {onCompareModes && (
            <Button 
              variant="outline" 
              onClick={onCompareModes} 
              className="w-full"
            >
              <Target className="mr-2 h-4 w-4" /> Compare BFS vs DFS
            </Button>
          )}

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
