import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface Cell {
  value: number | null;
  isEditable: boolean;
  isCorrect: boolean | null;
  row: number;
  col: number;
}

interface DPGridProps {
  grid: Cell[][];
  onCellChange: (row: number, col: number, value: string) => void;
  onCellClick: (row: number, col: number) => void;
  highlightedCells: { row: number; col: number }[];
  mode: string;
  problemData: any;
}

export const DPGrid = ({
  grid,
  onCellChange,
  onCellClick,
  highlightedCells,
  mode,
  problemData,
}: DPGridProps) => {
  const isHighlighted = (row: number, col: number) => {
    return highlightedCells.some(h => h.row === row && h.col === col);
  };
  
  const getRowLabel = (row: number) => {
    if (mode === "fibonacci") return "";
    if (mode === "knapsack") return row === 0 ? "W" : `${row - 1}`;
    if (mode === "lcs") {
      if (row === 0) return "";
      return problemData.string1?.[row - 1] || "";
    }
    if (mode === "coinChange") {
      if (row === 0) return "∅";
      return problemData.coins?.[row - 1]?.toString() || "";
    }
    return row.toString();
  };
  
  const getColLabel = (col: number) => {
    if (mode === "fibonacci") return col.toString();
    if (mode === "knapsack") return col.toString();
    if (mode === "lcs") {
      if (col === 0) return "";
      return problemData.string2?.[col - 1] || "";
    }
    if (mode === "coinChange") return col.toString();
    return col.toString();
  };
  
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-border bg-muted/30 font-semibold text-sm min-w-12">
                {mode === "fibonacci" ? "i" : mode === "knapsack" ? "i\\w" : mode === "lcs" ? "LCS" : "coins\\$"}
              </th>
              {Array.from({ length: cols }).map((_, col) => (
                <th
                  key={col}
                  className="p-2 border border-border bg-muted/30 font-semibold text-sm min-w-16"
                >
                  {getColLabel(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-2 border border-border bg-muted/30 font-semibold text-sm text-center">
                  {getRowLabel(rowIndex)}
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      "p-1 border border-border transition-all duration-300",
                      isHighlighted(rowIndex, colIndex) && "bg-yellow-500/20 ring-2 ring-yellow-500",
                      cell.isCorrect === true && "bg-green-500/20 animate-pulse",
                      cell.isCorrect === false && "bg-red-500/20 animate-shake"
                    )}
                  >
                    {cell.isEditable ? (
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={cell.value === null ? "" : cell.value}
                        onChange={(e) => onCellChange(rowIndex, colIndex, e.target.value)}
                        onClick={() => onCellClick(rowIndex, colIndex)}
                        className={cn(
                          "w-full h-12 text-center text-lg font-semibold bg-background/50 border-0",
                          cell.value === null && "text-muted-foreground"
                        )}
                        placeholder="?"
                      />
                    ) : (
                      <div className="w-full h-12 flex items-center justify-center text-lg font-semibold">
                        {cell.value}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
