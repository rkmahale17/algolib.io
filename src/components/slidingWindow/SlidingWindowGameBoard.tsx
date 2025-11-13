import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlidingWindowArray } from "./SlidingWindowArray";
import { SlidingWindowVictoryModal } from "./SlidingWindowVictoryModal";
import { useSlidingWindowGame, WindowMode } from "@/hooks/useSlidingWindowGame";
import { ArrowLeft, RotateCcw, Lightbulb, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SlidingWindowGameBoardProps {
  mode: WindowMode;
  level: number;
  onBackToMenu: () => void;
  onNextLevel: () => void;
}

export const SlidingWindowGameBoard = ({ mode, level, onBackToMenu, onNextLevel }: SlidingWindowGameBoardProps) => {
  const {
    gameState,
    windowData,
    expand,
    shrink,
    check,
    useHint,
    reset,
    getAccuracy,
  } = useSlidingWindowGame(mode, level);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isComplete) return;
      
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          expand();
          break;
        case "ArrowLeft":
          e.preventDefault();
          shrink();
          break;
        case " ":
          e.preventDefault();
          check();
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState.isComplete]);
  
  const getModeTitle = () => {
    const titles: Record<WindowMode, string> = {
      maxSum: "Max Sum",
      targetSum: "Target Sum",
      distinct: "Distinct Elements",
      substring: "Longest Substring",
    };
    return titles[mode];
  };
  
  const getTargetLabel = () => {
    switch (mode) {
      case "maxSum":
        return `Max Sum: ≤ ${gameState.target}`;
      case "targetSum":
        return `Target Sum: ${gameState.target}`;
      case "distinct":
        return `Target Distinct: ${gameState.target}`;
      case "substring":
        return `Target Length: ${gameState.target}`;
      default:
        return "";
    }
  };
  
  const getCurrentStatus = () => {
    switch (mode) {
      case "maxSum":
      case "targetSum":
        return `Current Sum: ${windowData.sum}`;
      case "distinct":
        return `Distinct: ${windowData.distinct}`;
      case "substring":
        return `Length: ${windowData.length}, Distinct: ${windowData.distinct}`;
      default:
        return "";
    }
  };
  
  const getGrade = () => {
    const accuracy = getAccuracy();
    if (accuracy >= 95) return "S";
    if (accuracy >= 90) return "A";
    if (accuracy >= 80) return "B";
    if (accuracy >= 70) return "C";
    if (accuracy >= 60) return "D";
    return "F";
  };
  
  return (
    <>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={onBackToMenu}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-xl font-bold">{getModeTitle()}</h2>
                <p className="text-sm text-muted-foreground">Level {level}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-primary text-xl">{gameState.score}</div>
                <div className="text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-xl">{gameState.moves}</div>
                <div className="text-muted-foreground">Moves</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-xl">{gameState.hintsRemaining}</div>
                <div className="text-muted-foreground">Hints</div>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{getTargetLabel()}</h3>
                  <span className="text-sm text-muted-foreground">{getCurrentStatus()}</span>
                </div>
                
                <SlidingWindowArray
                  array={gameState.array}
                  left={gameState.left}
                  right={gameState.right}
                  messageType={gameState.messageType}
                />
                
                <div className="text-center text-sm text-muted-foreground">
                  Window: [{gameState.left}, {gameState.right}] = [{windowData.windowArray.join(", ")}]
                </div>
              </div>
            </Card>
            
            {gameState.message && (
              <Alert
                className={
                  gameState.messageType === "success"
                    ? "bg-green-500/10 border-green-500"
                    : gameState.messageType === "error"
                    ? "bg-red-500/10 border-red-500"
                    : "bg-blue-500/10 border-blue-500"
                }
              >
                <AlertDescription className="font-medium">{gameState.message}</AlertDescription>
              </Alert>
            )}
            
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Controls</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={shrink}
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={gameState.isComplete}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Shrink (←)
                </Button>
                
                <Button
                  onClick={expand}
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={gameState.isComplete}
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Expand (→)
                </Button>
                
                <Button
                  onClick={check}
                  variant="default"
                  size="lg"
                  className="col-span-2"
                  disabled={gameState.isComplete}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check (Space)
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={useHint}
                  variant="outline"
                  className="w-full"
                  disabled={gameState.hintsRemaining === 0 || gameState.isComplete}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Hint ({gameState.hintsRemaining})
                </Button>
                
                <Button onClick={reset} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="font-semibold mb-2">Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Correct Checks:</span>
                  <span className="font-medium text-green-500">{gameState.correctChecks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wrong Checks:</span>
                  <span className="font-medium text-red-500">{gameState.wrongChecks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-medium">{getAccuracy()}%</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border-primary/50 bg-primary/5">
              <h3 className="font-semibold mb-2 text-primary">Strategy</h3>
              <p className="text-sm text-muted-foreground">
                {mode === "maxSum" && "Expand to increase sum. Shrink when exceeding target."}
                {mode === "targetSum" && "Adjust window size to match exact target sum."}
                {mode === "distinct" && "Shrink when duplicates appear. Expand when all distinct."}
                {mode === "substring" && "Find longest window without repeating elements."}
              </p>
            </Card>
          </div>
        </div>
      </div>
      
      <SlidingWindowVictoryModal
        isOpen={gameState.isComplete}
        score={gameState.score}
        moves={gameState.moves}
        correctChecks={gameState.correctChecks}
        wrongChecks={gameState.wrongChecks}
        accuracy={getAccuracy()}
        grade={getGrade()}
        onNextLevel={onNextLevel}
        onBackToMenu={onBackToMenu}
      />
    </>
  );
};
