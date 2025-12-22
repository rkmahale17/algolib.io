import { useState } from "react";
import { Helmet } from "react-helmet-async";
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
    <>
      <Helmet>
        <title>Stack Master Game - Learn Stack Data Structure | RulCode.com</title>
        <meta name="description" content="Master stack operations through fast-paced symbol matching game. Learn LIFO data structure, push/pop operations, and valid parentheses patterns interactively." />
        <meta name="keywords" content="stack data structure game, learn stack operations, LIFO game, parentheses matching, data structure learning, interactive stack tutorial" />
        <link rel="canonical" href="https://rulcode.com/games/stack-master" />
        
        <meta property="og:title" content="Stack Master - Interactive Stack Learning Game" />
        <meta property="og:description" content="Master stack operations through fast-paced symbol matching." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rulcode.com/games/stack-master" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Stack Master - Learn Stack Data Structure" />
        <meta name="twitter:description" content="Master stack operations through fast-paced symbol matching game." />
      </Helmet>
      
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
    </>
  );
};

export default StackMaster;
