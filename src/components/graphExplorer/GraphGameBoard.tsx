import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Lightbulb, Play, StepForward, Pause } from "lucide-react";
import { GraphMode, useGraphGame } from "@/hooks/useGraphGame";
import { MazeGrid } from "./MazeGrid";
import { AlgorithmInfo } from "./AlgorithmInfo";
import { GraphVictoryModal } from "./GraphVictoryModal";
import { useState } from "react";

interface GraphGameBoardProps {
  mode: GraphMode;
  level: number;
  onBackToMenu: () => void;
  onNextLevel: () => void;
}

const modeNames = {
  bfs: "BFS (Breadth-First Search)",
  dfs: "DFS (Depth-First Search)"
};

export const GraphGameBoard = ({ mode, level, onBackToMenu, onNextLevel }: GraphGameBoardProps) => {
  const { gameState, startAlgorithm, step, autoPlay, useHint, reset } = useGraphGame(mode, level);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const handleAutoPlay = () => {
    setIsAutoPlaying(true);
    const cleanup = autoPlay();
    setTimeout(() => {
      setIsAutoPlaying(false);
      cleanup();
    }, gameState.grid.length * gameState.grid.length * 300);
  };

  const getScoreColor = () => {
    if (gameState.score >= 800) return "text-green-500";
    if (gameState.score >= 600) return "text-blue-500";
    if (gameState.score >= 400) return "text-yellow-500";
    return "text-orange-500";
  };

  const hasStarted = gameState.isPlaying || gameState.moves > 0 || gameState.isComplete;

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="backdrop-blur-sm bg-card/80">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBackToMenu}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <CardTitle className="text-lg">{modeNames[mode]} - Level {level}</CardTitle>
                <div className="w-20" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor()}`}>{gameState.score}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Moves</p>
                  <p className="text-2xl font-bold text-primary">{gameState.moves}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Hints Left</p>
                  <p className="text-2xl font-bold text-secondary">{3 - gameState.hintsUsed}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Frontier</p>
                  <p className="text-2xl font-bold text-orange-500">{gameState.frontier.length}</p>
                </div>
              </div>

              {/* Maze Grid */}
              <MazeGrid 
                grid={gameState.grid}
                startPos={gameState.startPos}
                goalPos={gameState.goalPos}
                currentPos={gameState.currentPos}
              />

              {/* Controls */}
              <div className="flex gap-2 justify-center flex-wrap">
                {!hasStarted ? (
                  <Button onClick={startAlgorithm} size="lg">
                    <Play className="mr-2 h-4 w-4" /> Start Algorithm
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="default" 
                      onClick={step}
                      disabled={gameState.frontier.length === 0 || gameState.isComplete || isAutoPlaying}
                    >
                      <StepForward className="mr-2 h-4 w-4" /> Next Step
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={handleAutoPlay}
                      disabled={gameState.frontier.length === 0 || gameState.isComplete || isAutoPlaying}
                    >
                      {isAutoPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      Auto Play
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button 
                  variant="outline" 
                  onClick={useHint}
                  disabled={gameState.hintsUsed >= 3 || !hasStarted}
                >
                  <Lightbulb className="mr-2 h-4 w-4" /> Hint ({3 - gameState.hintsUsed})
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-center space-y-1">
                <p className="font-semibold">
                  {!hasStarted && "Click 'Start Algorithm' to begin!"}
                  {hasStarted && !gameState.isComplete && "Click 'Next Step' to explore the maze"}
                  {gameState.isComplete && "Goal reached! 🎉"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mode === "bfs" ? "BFS explores layer by layer using a Queue (FIFO)" : "DFS dives deep using a Stack (LIFO)"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <AlgorithmInfo 
            mode={mode} 
            frontier={gameState.frontier}
            visitedCount={gameState.visited.size}
          />
        </div>
      </div>

      <GraphVictoryModal
        isOpen={gameState.isComplete}
        score={gameState.score}
        moves={gameState.moves}
        visitedNodes={gameState.visited.size}
        pathLength={gameState.path.length}
        onNextLevel={onNextLevel}
        onBackToMenu={onBackToMenu}
      />
    </>
  );
};
