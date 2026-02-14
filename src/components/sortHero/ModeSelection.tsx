import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shuffle, Target, Zap, ArrowLeft } from "lucide-react";
import { SortMode } from "@/pages/SortHero";
import { useNavigate } from "react-router-dom";

interface ModeSelectionProps {
  onSelectMode: (mode: SortMode) => void;
}

export const ModeSelection = ({ onSelectMode }: ModeSelectionProps) => {
  const navigate = useNavigate();
  const modes = [
    {
      id: "bubble" as SortMode,
      title: "Bubble Sort",
      description: "Swap adjacent elements to bubble larger numbers to the end",
      difficulty: "Beginner",
      icon: Shuffle,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "selection" as SortMode,
      title: "Selection Sort",
      description: "Find the minimum element and place it in the correct position",
      difficulty: "Intermediate",
      icon: Target,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "quick" as SortMode,
      title: "QuickSort",
      description: "Partition numbers around a pivot to sort efficiently",
      difficulty: "Advanced",
      icon: Zap,
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/games')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <Card key={mode.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle>{mode.title}</CardTitle>
              <CardDescription>{mode.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className="font-semibold">{mode.difficulty}</span>
                </div>
                <Button 
                  onClick={() => onSelectMode(mode.id)}
                  className="w-full"
                >
                  Play <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      </div>
    </div>
  );
};
