import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Layers, Code, Gauge, ArrowLeft } from "lucide-react";
import { StackMode } from "@/hooks/useStackGame";
import { useNavigate } from "react-router-dom";

interface StackModeSelectionProps {
  onSelectMode: (mode: StackMode) => void;
}

const modes = [
  {
    id: "parentheses" as StackMode,
    name: "Classic Parentheses",
    icon: Layers,
    description: "Master the basics with simple parentheses matching",
    difficulty: "Beginner",
    color: "from-green-500 to-emerald-500",
    symbols: "( )",
    features: ["Learn PUSH and POP", "Perfect for beginners", "Build your foundation"]
  },
  {
    id: "brackets" as StackMode,
    name: "Bracket Mix",
    icon: Code,
    description: "Handle multiple types of brackets simultaneously",
    difficulty: "Intermediate",
    color: "from-blue-500 to-cyan-500",
    symbols: "( ) [ ] { }",
    features: ["Multiple bracket types", "Pattern recognition", "Stack balancing"]
  },
  {
    id: "tags" as StackMode,
    name: "HTML Tags",
    icon: Code,
    description: "Match opening and closing HTML tags like a parser",
    difficulty: "Advanced",
    color: "from-blue-500 to-cyan-500",
    symbols: "<div> <p> <span>",
    features: ["Real-world parsing", "Complex matching", "Advanced patterns"]
  },
  {
    id: "speed" as StackMode,
    name: "Speed Mode",
    icon: Gauge,
    description: "Test your reflexes with increasing speed",
    difficulty: "Expert",
    color: "from-red-500 to-orange-500",
    symbols: "All types",
    features: ["Increasing difficulty", "Speed challenges", "Ultimate test"]
  }
];

export const StackModeSelection = ({ onSelectMode }: StackModeSelectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
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
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Challenge</h2>
        <p className="text-muted-foreground">
          Learn stack operations through fast-paced symbol matching
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
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{mode.name}</CardTitle>
                  <span className="text-xs font-normal text-muted-foreground px-2 py-1 bg-muted rounded">
                    {mode.difficulty}
                  </span>
                </div>
                <CardDescription>{mode.description}</CardDescription>
                <div className="mt-2 font-mono text-xl text-center py-2 bg-muted/50 rounded">
                  {mode.symbols}
                </div>
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
                  <Zap className="mr-2 h-4 w-4" /> Start Challenge
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">🎮 How to Play</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. <strong>Watch</strong> symbols fall from the top of the screen</p>
          <p>2. <strong>Click symbols</strong> or use keyboard (↑ = PUSH, ↓ = POP)</p>
          <p>3. <strong>PUSH</strong> when you see opening symbols: ( [ &#123; &lt;tag&gt;</p>
          <p>4. <strong>POP</strong> when you see matching closing symbols: ) ] &#125; &lt;/tag&gt;</p>
          <p>5. <strong>Survive</strong> as long as possible - missing = -1 life, wrong action = -1 life</p>
          <p>6. Build <strong>combo streaks</strong> for bonus points!</p>
        </CardContent>
      </Card>
    </div>
  );
};
