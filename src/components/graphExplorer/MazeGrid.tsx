import { Cell } from "@/hooks/useGraphGame";
import { cn } from "@/lib/utils";
import { Flag, Play } from "lucide-react";

interface MazeGridProps {
  grid: Cell[][];
  startPos: { x: number; y: number };
  goalPos: { x: number; y: number };
  currentPos: { x: number; y: number } | null;
}

export const MazeGrid = ({ grid, startPos, goalPos, currentPos }: MazeGridProps) => {
  const size = grid.length;
  const cellSize = Math.min(60, Math.floor(500 / size));
  
  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className="grid gap-1 bg-muted/30 p-2 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isStart = x === startPos.x && y === startPos.y;
            const isGoal = x === goalPos.x && y === goalPos.y;
            const isCurrent = currentPos && x === currentPos.x && y === currentPos.y;
            
            return (
              <div
                key={`${x}-${y}`}
                className={cn(
                  "relative flex items-center justify-center rounded-md transition-all duration-300",
                  "border border-border/50",
                  cell.isWall && "bg-muted border-muted-foreground/30",
                  !cell.isWall && !cell.visited && "bg-background",
                  cell.visited && !isCurrent && "bg-primary/20 animate-in fade-in",
                  cell.inFrontier && "bg-secondary/40 animate-pulse",
                  isCurrent && "bg-primary ring-2 ring-primary ring-offset-2 ring-offset-background scale-110",
                  cell.isPath && "bg-yellow-500/30"
                )}
                style={{ 
                  width: cellSize, 
                  height: cellSize,
                  animationDelay: cell.visitOrder >= 0 ? `${cell.visitOrder * 50}ms` : '0ms'
                }}
              >
                {isStart && (
                  <Play className="w-4 h-4 text-green-500 fill-green-500" />
                )}
                {isGoal && (
                  <Flag className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                )}
                {cell.visited && !isStart && !isGoal && cell.visitOrder >= 0 && (
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {cell.visitOrder}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
