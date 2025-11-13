import { useState } from "react";
import { GraphModeSelection } from "@/components/graphExplorer/GraphModeSelection";
import { GraphGameBoard } from "@/components/graphExplorer/GraphGameBoard";
import { GraphMode } from "@/hooks/useGraphGame";

const GraphExplorer = () => {
  const [selectedMode, setSelectedMode] = useState<GraphMode | null>(null);
  const [level, setLevel] = useState(1);

  const handleModeSelect = (mode: GraphMode) => {
    setSelectedMode(mode);
    setLevel(1);
  };

  const handleBackToMenu = () => {
    setSelectedMode(null);
  };

  const handleNextLevel = () => {
    setLevel(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            GRAPH EXPLORER
          </h1>
          <p className="text-muted-foreground">Traverse the maze and learn graph algorithms visually</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
            BETA
          </span>
        </div>

        {!selectedMode ? (
          <GraphModeSelection onSelectMode={handleModeSelect} />
        ) : (
          <GraphGameBoard 
            mode={selectedMode} 
            level={level}
            onBackToMenu={handleBackToMenu}
            onNextLevel={handleNextLevel}
          />
        )}
      </div>
    </div>
  );
};

export default GraphExplorer;
