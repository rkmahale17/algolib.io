import { cn } from "@/lib/utils";

interface NumberTileProps {
  value: number;
  index: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isPivot: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const NumberTile = ({
  value,
  index,
  isSelected,
  isHighlighted,
  isPivot,
  onClick,
  onDragStart,
  onDrop,
  onDragOver,
}: NumberTileProps) => {
  return (
    <div
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={cn(
        "w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 transform hover:scale-110",
        "shadow-lg hover:shadow-xl",
        isSelected && "scale-110 ring-4 ring-primary",
        isHighlighted && "ring-4 ring-yellow-500 animate-pulse",
        isPivot && "ring-4 ring-blue-500",
        !isSelected && !isHighlighted && !isPivot && "bg-gradient-to-br from-primary/80 to-secondary/80 text-primary-foreground"
      )}
      style={{
        backgroundColor: isSelected ? "hsl(var(--primary))" : 
                        isHighlighted ? "hsl(var(--yellow-500))" :
                        isPivot ? "hsl(var(--blue-500))" : undefined,
        color: (isSelected || isHighlighted || isPivot) ? "white" : undefined,
      }}
    >
      {value}
    </div>
  );
};
