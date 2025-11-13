import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DPGrid } from "./DPGrid";
import { DPFormulaDisplay } from "./DPFormulaDisplay";
import { DPVictoryModal } from "./DPVictoryModal";
import { useDPGame, DPMode } from "@/hooks/useDPGame";
import { ArrowLeft, RotateCcw, Lightbulb, Eye, CheckCircle } from "lucide-react";
import { useState } from "react";

interface DPGameBoardProps {
  mode: DPMode;
  level: number;
  onBackToMenu: () => void;
  onNextLevel: () => void;
}

export const DPGameBoard = ({ mode, level, onBackToMenu, onNextLevel }: DPGameBoardProps) => {
  const {
    gameState,
    enterValue,
    useHint,
    toggleFormula,
    reset,
    checkAll,
    getAccuracy,
  } = useDPGame(mode, level);
  
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  
  const handleCellClick = (row: number, col: number) => {
    if (gameState.grid[row][col].isEditable) {
      setSelectedCell({ row, col });
    }
  };
  
  const handleHint = () => {
    if (selectedCell && gameState.hintsRemaining > 0) {
      useHint(selectedCell.row, selectedCell.col);
    }
  };
  
  const getModeTitle = () => {
    const titles: Record<DPMode, string> = {
      fibonacci: "Fibonacci",
      knapsack: "0/1 Knapsack",
      lcs: "Longest Common Subsequence",
      coinChange: "Coin Change",
    };
    return titles[mode];
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
                <div className="font-semibold text-xl">
                  {gameState.correctCells}/{gameState.totalEditableCells}
                </div>
                <div className="text-muted-foreground">Correct</div>
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
            <Card className="p-4">
              <DPGrid
                grid={gameState.grid}
                onCellChange={enterValue}
                onCellClick={handleCellClick}
                highlightedCells={gameState.highlightedCells}
                mode={mode}
                problemData={gameState.problemData}
              />
            </Card>
            
            <DPFormulaDisplay mode={mode} show={gameState.showFormula} />
          </div>
          
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Controls</h3>
              <div className="space-y-2">
                <Button
                  onClick={handleHint}
                  variant="outline"
                  className="w-full"
                  disabled={!selectedCell || gameState.hintsRemaining === 0}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Use Hint ({gameState.hintsRemaining} left)
                </Button>
                
                <Button onClick={toggleFormula} variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  {gameState.showFormula ? "Hide" : "Show"} Formula
                </Button>
                
                <Button onClick={checkAll} variant="outline" className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check All
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
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-medium">{getAccuracy()}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wrong Attempts:</span>
                  <span className="font-medium">{gameState.wrongAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hints Used:</span>
                  <span className="font-medium">{gameState.hintsUsed}</span>
                </div>
              </div>
            </Card>
            
            {selectedCell && (
              <Card className="p-4 border-primary/50 bg-primary/5">
                <h3 className="font-semibold mb-2 text-primary">Selected Cell</h3>
                <p className="text-sm">
                  Row {selectedCell.row}, Column {selectedCell.col}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Use Hint" to see parent cells
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <DPVictoryModal
        isOpen={gameState.isComplete}
        score={gameState.score}
        correctCells={gameState.correctCells}
        totalCells={gameState.totalEditableCells}
        wrongAttempts={gameState.wrongAttempts}
        hintsUsed={gameState.hintsUsed}
        accuracy={getAccuracy()}
        grade={getGrade()}
        onNextLevel={onNextLevel}
        onBackToMenu={onBackToMenu}
      />
    </>
  );
};
