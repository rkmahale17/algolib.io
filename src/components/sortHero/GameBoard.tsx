import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Undo2, Lightbulb } from "lucide-react";
import { SortMode } from "@/pages/SortHero";
import { useSortGame } from "@/hooks/useSortGame";
import { NumberTile } from "./NumberTile";
import { VictoryModal } from "./VictoryModal";

interface GameBoardProps {
  mode: SortMode;
  level: number;
  onBackToMenu: () => void;
  onNextLevel: () => void;
}

const modeNames = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  quick: "QuickSort"
};

export const GameBoard = ({ mode, level, onBackToMenu, onNextLevel }: GameBoardProps) => {
  const { gameState, selectTile, swapTiles, useHint, reset, undo } = useSortGame(mode, level);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (dropIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      swapTiles(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const getGrade = () => {
    const efficiency = gameState.moves / gameState.numbers.length;
    if (gameState.errors === 0 && efficiency <= 2) return "A+";
    if (gameState.errors <= 2 && efficiency <= 3) return "A";
    if (gameState.errors <= 5) return "B";
    return "C";
  };

  return (
    <>
      <Card className="backdrop-blur-sm bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBackToMenu}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <CardTitle>{modeNames[mode]} - Level {level}</CardTitle>
            <div className="w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Moves</p>
              <p className="text-2xl font-bold text-primary">{gameState.moves}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Hints Left</p>
              <p className="text-2xl font-bold text-secondary">{3 - gameState.hintsUsed}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Errors</p>
              <p className="text-2xl font-bold text-destructive">{gameState.errors}</p>
            </div>
          </div>

          {/* Game Board */}
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="flex gap-4 flex-wrap justify-center">
              {gameState.numbers.map((num, index) => (
                <NumberTile
                  key={`${num}-${index}`}
                  value={num}
                  index={index}
                  isSelected={gameState.selectedIndex === index}
                  isHighlighted={gameState.highlightIndices.includes(index)}
                  isPivot={gameState.pivotIndex === index}
                  onClick={() => selectTile(index)}
                  onDragStart={handleDragStart(index)}
                  onDrop={handleDrop(index)}
                  onDragOver={handleDragOver}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center flex-wrap">
            <Button variant="outline" onClick={undo}>
              <Undo2 className="mr-2 h-4 w-4" /> Undo
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button 
              variant="secondary" 
              onClick={useHint}
              disabled={gameState.hintsUsed >= 3}
            >
              <Lightbulb className="mr-2 h-4 w-4" /> Hint ({3 - gameState.hintsUsed})
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-center">
            {mode === "bubble" && "Click and drag to swap adjacent numbers. Only swap if left > right!"}
            {mode === "selection" && "Select the smallest unsorted number and move it to its correct position."}
            {mode === "quick" && `Partition numbers around the pivot (${gameState.pivotIndex !== null ? gameState.numbers[gameState.pivotIndex] : ""}). Smaller left, larger right!`}
          </div>
        </CardContent>
      </Card>

      <VictoryModal
        isOpen={gameState.isComplete}
        moves={gameState.moves}
        errors={gameState.errors}
        grade={getGrade()}
        onNextLevel={onNextLevel}
        onBackToMenu={onBackToMenu}
      />
    </>
  );
};
