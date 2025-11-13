import { useState } from "react";
import { TwoPointerModeSelection } from "@/components/twoPointer/TwoPointerModeSelection";
import { TwoPointerGameBoard } from "@/components/twoPointer/TwoPointerGameBoard";
import { PointerMode } from "@/hooks/useTwoPointerGame";

const TwoPointer = () => {
  const [selectedMode, setSelectedMode] = useState<PointerMode | null>(null);
  const [level, setLevel] = useState(1);
  
  const handleModeSelect = (mode: PointerMode) => {
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
            TWO POINTER RACE
          </h1>
          <p className="text-muted-foreground">Master the two-pointer technique by catching the correct pairs</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
            BETA
          </span>
        </div>
        
        {!selectedMode ? (
          <TwoPointerModeSelection onSelectMode={handleModeSelect} />
        ) : (
          <TwoPointerGameBoard
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

export default TwoPointer;
