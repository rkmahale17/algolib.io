import { useState } from "react";
import { SlidingWindowModeSelection } from "@/components/slidingWindow/SlidingWindowModeSelection";
import { SlidingWindowGameBoard } from "@/components/slidingWindow/SlidingWindowGameBoard";
import { WindowMode } from "@/hooks/useSlidingWindowGame";

const SlidingWindow = () => {
  const [selectedMode, setSelectedMode] = useState<WindowMode | null>(null);
  const [level, setLevel] = useState(1);
  
  const handleModeSelect = (mode: WindowMode) => {
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
            SLIDING WINDOW NINJA
          </h1>
          <p className="text-muted-foreground">Master the sliding window technique through interactive gameplay</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
            BETA
          </span>
        </div>
        
        {!selectedMode ? (
          <SlidingWindowModeSelection onSelectMode={handleModeSelect} />
        ) : (
          <SlidingWindowGameBoard
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

export default SlidingWindow;
