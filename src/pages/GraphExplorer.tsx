import { useState } from "react";
import { Helmet } from "react-helmet-async";
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
    <>
      <Helmet>
        <title>Graph Explorer Game - Learn BFS and DFS Algorithms | Rulcode.com</title>
        <meta name="description" content="Master graph traversal algorithms through maze navigation. Learn BFS, DFS, and pathfinding by solving visual graph puzzles interactively." />
        <meta name="keywords" content="graph algorithms game, BFS game, DFS game, maze solver, graph traversal learning, pathfinding game, coding interview graphs" />
        <link rel="canonical" href="https://rulcode.com/games/graph-explorer" />
        
        <meta property="og:title" content="Graph Explorer - Learn Graph Algorithms" />
        <meta property="og:description" content="Master BFS and DFS through maze navigation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rulcode.com/games/graph-explorer" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Graph Explorer - Graph Algorithm Game" />
        <meta name="twitter:description" content="Learn graph traversal by solving maze puzzles." />
      </Helmet>
      
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
    </>
  );
};

export default GraphExplorer;
