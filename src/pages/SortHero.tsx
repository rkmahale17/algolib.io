import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ModeSelection } from "@/components/sortHero/ModeSelection";
import { GameBoard } from "@/components/sortHero/GameBoard";

export type SortMode = "bubble" | "selection" | "quick";

const SortHero = () => {
  const [selectedMode, setSelectedMode] = useState<SortMode | null>(null);
  const [level, setLevel] = useState(1);

  const handleModeSelect = (mode: SortMode) => {
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
        <title>Sort Hero Game - Learn Sorting Algorithms Interactively | Rulcode.com</title>
        <meta name="description" content="Master bubble sort, selection sort, and quicksort through interactive gameplay. Learn sorting algorithms with step-by-step visualizations and challenges." />
        <meta name="keywords" content="sorting algorithms game, bubble sort game, quicksort game, learn sorting interactively, algorithm visualization game, coding education" />
        <link rel="canonical" href="https://rulcode.com/games/sort-hero" />
        
        <meta property="og:title" content="Sort Hero - Interactive Sorting Algorithms Game" />
        <meta property="og:description" content="Learn sorting algorithms through interactive gameplay." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rulcode.com/games/sort-hero" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sort Hero - Learn Sorting Algorithms" />
        <meta name="twitter:description" content="Master bubble sort, selection sort, and quicksort through gameplay." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            SORT HERO
          </h1>
          <p className="text-muted-foreground">Learn sorting algorithms through interactive gameplay</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
            BETA
          </span>
        </div>

        {!selectedMode ? (
          <ModeSelection onSelectMode={handleModeSelect} />
        ) : (
          <GameBoard 
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

export default SortHero;
