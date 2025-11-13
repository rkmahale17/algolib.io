import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, GitBranch, ArrowRight } from "lucide-react";
import { GraphMode } from "@/hooks/useGraphGame";

interface GraphModeSelectionProps {
  onSelectMode: (mode: GraphMode) => void;
}

const modes = [
  {
    id: "bfs" as GraphMode,
    name: "BFS (Breadth-First)",
    icon: Layers,
    description: "Explore layer by layer using a queue. Perfect for finding the shortest path!",
    difficulty: "Beginner Friendly",
    color: "from-blue-500 to-cyan-500",
    features: ["Finds shortest path", "Layer-by-layer exploration", "Queue (FIFO) based"]
  },
  {
    id: "dfs" as GraphMode,
    name: "DFS (Depth-First)",
    icon: GitBranch,
    description: "Dive deep into paths using a stack. Learn how backtracking works!",
    difficulty: "Intermediate",
    color: "from-purple-500 to-pink-500",
    features: ["Deep exploration", "Backtracking logic", "Stack (LIFO) based"]
  }
];

export const GraphModeSelection = ({ onSelectMode }: GraphModeSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Algorithm</h2>
        <p className="text-muted-foreground">
          Learn graph traversal by exploring mazes visually
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Card 
              key={mode.id}
              className="backdrop-blur-sm bg-card/80 hover:bg-card/90 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => onSelectMode(mode.id)}
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {mode.name}
                  <span className="text-xs font-normal text-muted-foreground px-2 py-1 bg-muted rounded">
                    {mode.difficulty}
                  </span>
                </CardTitle>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {mode.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${mode.color}`} />
                      {feature}
                    </div>
                  ))}
                </div>
                <Button className="w-full group-hover:gap-3 transition-all" variant="secondary">
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">🎯 How to Play</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. <strong>Start</strong> the algorithm by clicking the "Start" button</p>
          <p>2. <strong>Step through</strong> manually to understand each move, or use Auto Play</p>
          <p>3. Watch the <strong>frontier (queue/stack)</strong> update in real-time</p>
          <p>4. Reach the <strong>goal</strong> and compare BFS vs DFS performance!</p>
        </CardContent>
      </Card>
    </div>
  );
};
