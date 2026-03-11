import { ReactNode } from 'react';

interface VisualizationLayoutProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  controls: ReactNode;
}

export const VisualizationLayout = ({ 
  leftContent, 
  rightContent, 
  controls 
}: VisualizationLayoutProps) => {
  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4">
        {controls}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Visualization */}
        <div className="space-y-4">
          {leftContent}
        </div>

        {/* Right Column - Code */}
        <div className="space-y-4">
          {rightContent}
        </div>
      </div>
    </div>
  );
};
