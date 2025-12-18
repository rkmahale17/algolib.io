import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { DPModeSelection } from "@/components/dpPuzzle/DPModeSelection";
import { DPGameBoard } from "@/components/dpPuzzle/DPGameBoard";
import { DPMode } from "@/hooks/useDPGame";

const DPPuzzle = () => {
  const [selectedMode, setSelectedMode] = useState<DPMode | null>(null);
  const [level, setLevel] = useState(1);
  
  const handleModeSelect = (mode: DPMode) => {
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
        <title>DP Puzzle Grid Game - Learn Dynamic Programming | Rulcode.com</title>
        <meta name="description" content="Master dynamic programming through interactive table-filling puzzles. Learn Fibonacci, Knapsack, LCS, and more DP patterns by solving visual challenges." />
        <meta name="keywords" content="dynamic programming game, DP table game, knapsack game, fibonacci game, LCS game, memoization learning, coding interview DP" />
        <link rel="canonical" href="https://rulcode.com/games/dp-puzzle" />
        
        <meta property="og:title" content="DP Puzzle Grid - Dynamic Programming Game" />
        <meta property="og:description" content="Master DP by filling tables for classic problems." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rulcode.com/games/dp-puzzle" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DP Puzzle Grid - Learn Dynamic Programming" />
        <meta name="twitter:description" content="Master DP through interactive table-filling puzzles." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            DP PUZZLE GRID
          </h1>
          <p className="text-muted-foreground">Master Dynamic Programming by filling the table correctly</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
            BETA
          </span>
        </div>
        
        {!selectedMode ? (
          <DPModeSelection onSelectMode={handleModeSelect} />
        ) : (
          <DPGameBoard
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

export default DPPuzzle;
