import { useState } from "react";
import { StackModeSelection } from "@/components/stackMaster/StackModeSelection";
import { StackGameBoard } from "@/components/stackMaster/StackGameBoard";
import { StackMode } from "@/hooks/useStackGame";

const StackMaster = () => {
  const [selectedMode, setSelectedMode] = useState<StackMode | null>(null);

  const handleModeSelect = (mode: StackMode) => {
    setSelectedMode(mode);
  };

  const handleBackToMenu = () => {
    setSelectedMode(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            STACK MASTER
          </h1>
          <p className="text-muted-foreground">Master stack operations through fast-paced symbol matching</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
            BETA
          </span>
        </div>

        {!selectedMode ? (
          <StackModeSelection onSelectMode={handleModeSelect} />
        ) : (
          <StackGameBoard 
            mode={selectedMode}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </div>
    </div>
  );
};

export default StackMaster;
