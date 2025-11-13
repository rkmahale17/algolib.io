import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraphMode } from "@/hooks/useGraphGame";
import { Layers, GitBranch } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AlgorithmInfoProps {
  mode: GraphMode;
  frontier: { x: number; y: number }[];
  visitedCount: number;
}

const algorithmDetails = {
  bfs: {
    title: "Breadth-First Search (BFS)",
    icon: Layers,
    description: "Explores level by level using a Queue (FIFO - First In, First Out)",
    characteristics: [
      "Visits nodes layer by layer",
      "Finds shortest path",
      "Uses a queue data structure",
      "Explores all neighbors before going deeper"
    ],
    complexity: "Time: O(V + E) • Space: O(V)",
    dataStructure: "Queue (FIFO)",
    color: "text-blue-500"
  },
  dfs: {
    title: "Depth-First Search (DFS)",
    icon: GitBranch,
    description: "Explores as far as possible along each branch using a Stack (LIFO - Last In, First Out)",
    characteristics: [
      "Goes deep into one path first",
      "Backtracks when reaching dead end",
      "Uses a stack data structure",
      "May not find shortest path"
    ],
    complexity: "Time: O(V + E) • Space: O(V)",
    dataStructure: "Stack (LIFO)",
    color: "text-purple-500"
  }
};

export const AlgorithmInfo = ({ mode, frontier, visitedCount }: AlgorithmInfoProps) => {
  const info = algorithmDetails[mode];
  const Icon = info.icon;
  
  return (
    <Card className="backdrop-blur-sm bg-card/80 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className={cn("w-5 h-5", info.color)} />
          <CardTitle className="text-base">{info.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Characteristics:</h4>
            <ul className="space-y-1">
              {info.characteristics.map((char, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className={cn("mt-0.5", info.color)}>•</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t border-border space-y-2">
          <div>
            <p className="text-xs font-semibold mb-1">Data Structure:</p>
            <p className="text-xs text-muted-foreground font-mono">{info.dataStructure}</p>
          </div>
          
          <div>
            <p className="text-xs font-semibold mb-1">Complexity:</p>
            <p className="text-xs text-muted-foreground font-mono">{info.complexity}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold">Visited Nodes:</p>
            <p className="text-sm font-bold text-primary">{visitedCount}</p>
          </div>
          
          <div>
            <p className="text-xs font-semibold mb-2">
              {mode === "bfs" ? "Queue" : "Stack"} ({frontier.length} items):
            </p>
            <ScrollArea className="h-24 w-full border border-border rounded-md p-2">
              <div className="space-y-1">
                {frontier.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Empty</p>
                ) : (
                  frontier.map((pos, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "text-xs font-mono px-2 py-1 rounded",
                        i === (mode === "bfs" ? 0 : frontier.length - 1) 
                          ? "bg-primary/20 text-primary font-bold" 
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      ({pos.x}, {pos.y}) {i === (mode === "bfs" ? 0 : frontier.length - 1) && "← Next"}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
