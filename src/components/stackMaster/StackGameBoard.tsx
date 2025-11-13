import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, ArrowUp, ArrowDown, Heart, Flame } from "lucide-react";
import { StackMode, useStackGame } from "@/hooks/useStackGame";
import { FallingSymbols } from "./FallingSymbols";
import { StackVisualization } from "./StackVisualization";
import { StackGameOver } from "./StackGameOver";
import { useEffect } from "react";

interface StackGameBoardProps {
  mode: StackMode;
  onBackToMenu: () => void;
}

const modeNames = {
  parentheses: "Classic Parentheses",
  brackets: "Bracket Mix",
  tags: "HTML Tags",
  speed: "Speed Mode"
};

export const StackGameBoard = ({ mode, onBackToMenu }: StackGameBoardProps) => {
  const { gameState, push, pop, startGame, reset, getSymbolColor } = useStackGame(mode);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isGameOver) return;
      
      const topSymbol = gameState.fallingSymbols[0];
      if (!topSymbol) return;

      if (e.key === 'ArrowUp') {
        push(topSymbol);
      } else if (e.key === 'ArrowDown') {
        pop(topSymbol);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.isGameOver, gameState.fallingSymbols, push, pop]);

  const getScoreColor = () => {
    if (gameState.score >= 800) return "text-green-500";
    if (gameState.score >= 600) return "text-blue-500";
    if (gameState.score >= 400) return "text-yellow-500";
    return "text-orange-500";
  };

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
                <CardTitle className="text-lg">{modeNames[mode]}</CardTitle>
                <div className="w-20" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-5 gap-3 text-center">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className={`text-xl font-bold ${getScoreColor()}`}>{gameState.score}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-xl font-bold text-primary">{gameState.level}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Combo</p>
                  <p className="text-xl font-bold text-orange-500 flex items-center justify-center gap-1">
                    {gameState.combo > 0 && <Flame className="w-4 h-4" />}
                    ×{gameState.combo}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="text-xl font-bold text-secondary">×{gameState.maxCombo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Lives</p>
                  <div className="flex justify-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-5 h-5 ${
                          i < gameState.lives
                            ? "fill-red-500 text-red-500"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Game Area */}
              <FallingSymbols
                symbols={gameState.fallingSymbols}
                onPush={push}
                onPop={pop}
                getSymbolColor={getSymbolColor}
              />

              {/* Controls */}
              <div className="space-y-3">
                {!gameState.isPlaying ? (
                  <Button onClick={startGame} size="lg" className="w-full">
                    <Play className="mr-2 h-5 w-5" /> Start Game
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => {
                        const topSymbol = gameState.fallingSymbols[0];
                        if (topSymbol) push(topSymbol);
                      }}
                      disabled={gameState.fallingSymbols.length === 0}
                      size="lg"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ArrowUp className="mr-2 h-5 w-5" /> PUSH
                    </Button>
                    <Button
                      onClick={() => {
                        const topSymbol = gameState.fallingSymbols[0];
                        if (topSymbol) pop(topSymbol);
                      }}
                      disabled={gameState.fallingSymbols.length === 0}
                      size="lg"
                      variant="destructive"
                    >
                      <ArrowDown className="mr-2 h-5 w-5" /> POP
                    </Button>
                  </div>
                )}

                <div className="text-center text-xs text-muted-foreground space-y-1">
                  <p>💡 Keyboard: ↑ = PUSH (open symbols) | ↓ = POP (close symbols)</p>
                  <p>Or click directly on falling symbols!</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">Stack Rules (LIFO):</p>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• <strong>PUSH</strong> open symbols: ( [ &#123; &lt;tag&gt;</li>
                  <li>• <strong>POP</strong> matching close symbols: ) ] &#125; &lt;/tag&gt;</li>
                  <li>• Stack must stay balanced - wrong action = lose life</li>
                  <li>• Missing a symbol = lose life</li>
                  <li>• 10+ streak = combo bonus!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <StackVisualization 
            stack={gameState.stack}
            getSymbolColor={getSymbolColor}
          />
        </div>
      </div>

      <StackGameOver
        isOpen={gameState.isGameOver}
        score={gameState.score}
        correctMoves={gameState.correctMoves}
        totalMoves={gameState.totalMoves}
        maxCombo={gameState.maxCombo}
        level={gameState.level}
        onRestart={reset}
        onBackToMenu={onBackToMenu}
      />
    </>
  );
};
